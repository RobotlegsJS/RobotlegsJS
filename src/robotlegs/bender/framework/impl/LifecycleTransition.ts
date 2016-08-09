// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Lifecycle } from "./Lifecycle";
import { LifecycleEvent } from "../api/LifecycleEvent";
import { MessageDispatcher } from "./MessageDispatcher";
import { safelyCallBack } from "./safelyCallBack";

/**
 * Handles a lifecycle transition
 *
 * @private
 */
export class LifecycleTransition {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _fromStates: string[] = [];

    private _dispatcher: MessageDispatcher = new MessageDispatcher();

    private _callbacks: any[] = [];

    private _name: string;

    private _lifecycle: Lifecycle;

    private _transitionState: string;

    private _finalState: string;

    private _preTransitionEvent: string;

    private _transitionEvent: string;

    private _postTransitionEvent: string;

    private _reverse: boolean;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a lifecycle transition
     * @param name The name of the transition
     * @param lifecycle The associated lifecycle instance
     */
    constructor(name: string, lifecycle: Lifecycle) {
        this._name = name;
        this._lifecycle = lifecycle;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * States that this transition is allowed to enter from
     * @param states Allowed states
     * @return Self
     */
    public fromStates(...states): LifecycleTransition {
        for (let i: number = 0; i < states.length; i++) {
            let state = states[i];
            this._fromStates.push(state);
        }
        return this;
    }

    /**
     * The states that this transition applies
     * @param transitionState The state that the target is put into during the transition
     * @param finalState The state that the target is put into after the transition
     * @return
     */
    public toStates(transitionState: string, finalState: string): LifecycleTransition {
        this._transitionState = transitionState;
        this._finalState = finalState;
        return this;
    }

    /**
     * The events that the lifecycle will dispatch
     * @param preTransitionEvent
     * @param transitionEvent
     * @param postTransitionEvent
     * @return Self
     */
    public withEvents(preTransitionEvent: string, transitionEvent: string, postTransitionEvent: string): LifecycleTransition {
        this._preTransitionEvent = preTransitionEvent;
        this._transitionEvent = transitionEvent;
        this._postTransitionEvent = postTransitionEvent;
        if (this._reverse) {
            this._lifecycle.addReversedEventTypes(preTransitionEvent, transitionEvent, postTransitionEvent);
        }
        return this;
    }

    /**
     * Reverse the dispatch order of this transition
     * @return Self
     */
    public inReverse(): LifecycleTransition {
        this._reverse = true;
        this._lifecycle.addReversedEventTypes(this._preTransitionEvent, this._transitionEvent, this._postTransitionEvent);
        return this;
    }

    /**
     * A handler to run before the transition runs
     * @param handler Possibly asynchronous before handler
     * @return Self
     */
    public addBeforeHandler(handler: Function): LifecycleTransition {
        this._dispatcher.addMessageHandler(this._name, handler);
        return this;
    }

    /**
     * Attempts to enter the transition
     * @param callback Completion callback
     */
    public enter(callback: Function = null): void {
        // immediately call back if we have already transitioned, and exit
        if (this._lifecycle.state === this._finalState) {
            if (callback) {
                safelyCallBack(callback, null, this._name);
            }
            return;
        }

        // queue this callback if we are mid transition, and exit
        if (this._lifecycle.state === this._transitionState) {
            if (callback) {
                this._callbacks.push(callback);
            }
            return;
        }

        // report invalid transition, and exit
        if (this.invalidTransition()) {
            this.reportError("Invalid transition", [callback]);
            return;
        }

        // store the initial lifecycle state in case we need to roll back
        let initialState: string = this._lifecycle.state;

        // queue the first callback
        if (callback) {
            this._callbacks.push(callback);
        }

        // put lifecycle into transition state
        this.setState(this._transitionState);

        // run before handlers
        this._dispatcher.dispatchMessage(this._name, function(error: any): void {
            // revert state, report error, and exit
            if (error) {
                this.setState(initialState);
                this.reportError(error, this._callbacks);
                return;
            }

            // dispatch pre transition and transition events
            this.dispatch(this._preTransitionEvent);

            this.dispatch(this._transitionEvent);

            // put lifecycle into final state
            this.setState(this._finalState);

            // process callback queue (dup and trash for safety)
            let callbacks: any[] = this._callbacks.concat();
            this._callbacks.length = 0;
            for (let i: number; i < callbacks.length; i++) {
                let callbackChild = callbacks[i];
                safelyCallBack(callbackChild, null, this._name);
            }

            // dispatch post transition event
            this.dispatch(this._postTransitionEvent);

        }.bind(this), this._reverse);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private invalidTransition(): boolean {
        return this._fromStates.length > 0
            && this._fromStates.indexOf(this._lifecycle.state) == -1;
    }

    private setState(state: string): void {
        if (state) {
            this._lifecycle.setCurrentState(state);
        }
    }

    private dispatch(type: string): void {
        if (type && this._lifecycle.hasEventListener(type)) {
            this._lifecycle.dispatchEvent(new LifecycleEvent(type));
        }
    }

    private reportError(message: any, callbacks: any[] = null): void {
        // turn message into Error
        let error: Error = message instanceof Error
            ? <Error>message
            : new Error(message);

        // dispatch error event if a listener exists, or throw
        if (this._lifecycle.hasEventListener(LifecycleEvent.ERROR)) {
            let event: LifecycleEvent = new LifecycleEvent(LifecycleEvent.ERROR, error);
            this._lifecycle.dispatchEvent(event);
            // process callback queue
            if (callbacks) {
                for (let i = 0; i < callbacks.length; i++) {
                    let callback = callbacks[i];
                    if (callback) {
                        safelyCallBack(callback, error, this._name);
                    }
                }
                callbacks.length = 0;
            }
        } else {
            // explode!
            throw error;
        }
    }
}
