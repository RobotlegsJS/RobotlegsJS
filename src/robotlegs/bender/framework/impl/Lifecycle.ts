// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IEventDispatcher } from "../../events/api/IEventDispatcher";

import { ILifecycle } from "../api/ILifecycle";
import { LifecycleError } from "../api/LifecycleError";
import { LifecycleEvent } from "../api/LifecycleEvent";
import { LifecycleState } from "../api/LifecycleState";

import { LifecycleTransition } from "./LifecycleTransition";

/*[Event(name="destroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="error", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="initialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postDestroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postInitialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postResume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postSuspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preDestroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preInitialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preResume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preSuspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="resume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="stateChange", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="suspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/

/**
 * Default object lifecycle
 *
 * @private
 */
export class Lifecycle implements ILifecycle {
    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _state: string = LifecycleState.UNINITIALIZED;

    /**
     * @inheritDoc
     */
    public get state(): string {
        return this._state;
    }

    private _target: Object;

    /**
     * @inheritDoc
     */
    public get target(): Object {
        return this._target;
    }

    /**
     * @inheritDoc
     */
    public get uninitialized(): boolean {
        return this._state === LifecycleState.UNINITIALIZED;
    }

    /**
     * @inheritDoc
     */
    public get initialized(): boolean {
        return (
            this._state !== LifecycleState.UNINITIALIZED &&
            this._state !== LifecycleState.INITIALIZING
        );
    }

    /**
     * @inheritDoc
     */
    public get active(): boolean {
        return this._state === LifecycleState.ACTIVE;
    }

    /**
     * @inheritDoc
     */
    public get suspended(): boolean {
        return this._state === LifecycleState.SUSPENDED;
    }

    /**
     * @inheritDoc
     */
    public get destroyed(): boolean {
        return this._state === LifecycleState.DESTROYED;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _reversedEventTypes: Map<any, boolean> = new Map<any, boolean>();

    private _reversePriority: number = 0;

    private _initialize: LifecycleTransition;

    private _suspend: LifecycleTransition;

    private _resume: LifecycleTransition;

    private _destroy: LifecycleTransition;

    private _dispatcher: IEventDispatcher;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a lifecycle for a given target object
     * @param target The target object
     */
    constructor(target: IEventDispatcher) {
        this._target = target;
        this._dispatcher = target; // || new EventDispatcher(this);
        this.configureTransitions();
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public initialize(callback?: Function): void {
        this._initialize.enter(callback);
    }

    /**
     * @inheritDoc
     */
    public suspend(callback?: Function): void {
        this._suspend.enter(callback);
    }

    /**
     * @inheritDoc
     */
    public resume(callback?: Function): void {
        this._resume.enter(callback);
    }

    /**
     * @inheritDoc
     */
    public destroy(callback?: Function): void {
        this._destroy.enter(callback);
    }

    /**
     * @inheritDoc
     */
    public beforeInitializing(handler: Function): ILifecycle {
        if (!this.uninitialized) {
            this.reportError(LifecycleError.LATE_HANDLER_ERROR_MESSAGE);
        }
        this._initialize.addBeforeHandler(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenInitializing(handler: Function): ILifecycle {
        if (this.initialized) {
            this.reportError(LifecycleError.LATE_HANDLER_ERROR_MESSAGE);
        }
        this.addEventListener(
            LifecycleEvent.INITIALIZE,
            this.createSyncLifecycleListener(handler, true)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterInitializing(handler: Function): ILifecycle {
        if (this.initialized) {
            this.reportError(LifecycleError.LATE_HANDLER_ERROR_MESSAGE);
        }
        this.addEventListener(
            LifecycleEvent.POST_INITIALIZE,
            this.createSyncLifecycleListener(handler, true)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public beforeSuspending(handler: Function): ILifecycle {
        this._suspend.addBeforeHandler(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenSuspending(handler: Function): ILifecycle {
        this.addEventListener(
            LifecycleEvent.SUSPEND,
            this.createSyncLifecycleListener(handler)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterSuspending(handler: Function): ILifecycle {
        this.addEventListener(
            LifecycleEvent.POST_SUSPEND,
            this.createSyncLifecycleListener(handler)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public beforeResuming(handler: Function): ILifecycle {
        this._resume.addBeforeHandler(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenResuming(handler: Function): ILifecycle {
        this.addEventListener(
            LifecycleEvent.RESUME,
            this.createSyncLifecycleListener(handler)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterResuming(handler: Function): ILifecycle {
        this.addEventListener(
            LifecycleEvent.POST_RESUME,
            this.createSyncLifecycleListener(handler)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public beforeDestroying(handler: Function): ILifecycle {
        this._destroy.addBeforeHandler(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenDestroying(handler: Function): ILifecycle {
        this.addEventListener(
            LifecycleEvent.DESTROY,
            this.createSyncLifecycleListener(handler, true)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterDestroying(handler: Function): ILifecycle {
        this.addEventListener(
            LifecycleEvent.POST_DESTROY,
            this.createSyncLifecycleListener(handler, true)
        );
        return this;
    }

    /**
     * @inheritDoc
     */
    public addEventListener(
        type: string,
        listener: Function,
        useCapture: boolean = false,
        priority: number = 0,
        useWeakReference: boolean = false
    ): void {
        priority = this.flipPriority(type, priority);
        // this._dispatcher.addEventListener(type, listener, useCapture, priority, useWeakReference);
        this._dispatcher.addEventListener(
            type,
            listener,
            undefined,
            useCapture,
            priority
        );
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(
        type: string,
        listener: Function,
        useCapture: boolean = false
    ): void {
        this._dispatcher.removeEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public dispatchEvent(event: any): boolean {
        return this._dispatcher.dispatchEvent(event);
    }

    /**
     * @inheritDoc
     */
    public hasEventListener(type: string): boolean {
        return this._dispatcher.hasEventListener(type);
    }

    /**
     * @inheritDoc
     */
    public willTrigger(type: string): boolean {
        return this._dispatcher.willTrigger(type);
    }

    /*============================================================================*/
    /* Internal Functions                                                         */
    /*============================================================================*/

    public setCurrentState(state: string): void {
        if (this._state !== state) {
            this._state = state;
            this.dispatchEvent(new LifecycleEvent(LifecycleEvent.STATE_CHANGE));
        }
    }

    public addReversedEventTypes(...types): void {
        for (let i: number = 0; i < types.length; i++) {
            let type = types[i];
            this._reversedEventTypes.set(type, true);
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private configureTransitions(): void {
        this._initialize = new LifecycleTransition(
            LifecycleEvent.PRE_INITIALIZE,
            this
        )
            .fromStates(LifecycleState.UNINITIALIZED)
            .toStates(LifecycleState.INITIALIZING, LifecycleState.ACTIVE)
            .withEvents(
                LifecycleEvent.PRE_INITIALIZE,
                LifecycleEvent.INITIALIZE,
                LifecycleEvent.POST_INITIALIZE
            );

        this._suspend = new LifecycleTransition(
            LifecycleEvent.PRE_SUSPEND,
            this
        )
            .fromStates(LifecycleState.ACTIVE)
            .toStates(LifecycleState.SUSPENDING, LifecycleState.SUSPENDED)
            .withEvents(
                LifecycleEvent.PRE_SUSPEND,
                LifecycleEvent.SUSPEND,
                LifecycleEvent.POST_SUSPEND
            )
            .inReverse();

        this._resume = new LifecycleTransition(LifecycleEvent.PRE_RESUME, this)
            .fromStates(LifecycleState.SUSPENDED)
            .toStates(LifecycleState.RESUMING, LifecycleState.ACTIVE)
            .withEvents(
                LifecycleEvent.PRE_RESUME,
                LifecycleEvent.RESUME,
                LifecycleEvent.POST_RESUME
            );

        this._destroy = new LifecycleTransition(
            LifecycleEvent.PRE_DESTROY,
            this
        )
            .fromStates(LifecycleState.SUSPENDED, LifecycleState.ACTIVE)
            .toStates(LifecycleState.DESTROYING, LifecycleState.DESTROYED)
            .withEvents(
                LifecycleEvent.PRE_DESTROY,
                LifecycleEvent.DESTROY,
                LifecycleEvent.POST_DESTROY
            )
            .inReverse();
    }

    private flipPriority(type: string, priority: number): number {
        return priority === 0 && this._reversedEventTypes.get(type)
            ? this._reversePriority++
            : priority;
    }

    private createSyncLifecycleListener(
        handler: Function,
        once: boolean = false
    ): Function {
        // When and After handlers can not be asynchronous
        if (handler.length > 1) {
            throw new LifecycleError(LifecycleError.SYNC_HANDLER_ARG_MISMATCH);
        }

        // A handler that accepts 1 argument is provided with the event type
        if (handler.length === 1) {
            return function(event: LifecycleEvent): void {
                if (once) {
                    // (<IEventDispatcher>event.target).removeEventListener(event.type, arguments.callee);
                    (<IEventDispatcher>event.target).removeEventListener(
                        event.type,
                        handler
                    );
                }
                handler(event.type);
            };
        }

        // Or, just call the handler
        return function(event: LifecycleEvent): void {
            if (once) {
                // (<IEventDispatcher>event.target).removeEventListener(event.type, arguments.callee);
                (<IEventDispatcher>event.target).removeEventListener(
                    event.type,
                    handler
                );
            }
            handler();
        };
    }

    private reportError(message: string): void {
        let error: LifecycleError = new LifecycleError(message);
        if (this.hasEventListener(LifecycleEvent.ERROR)) {
            let event: LifecycleEvent = new LifecycleEvent(
                LifecycleEvent.ERROR,
                error
            );
            this.dispatchEvent(event);
        } else {
            throw error;
        }
    }
}
