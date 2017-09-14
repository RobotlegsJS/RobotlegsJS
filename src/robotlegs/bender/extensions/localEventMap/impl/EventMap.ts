// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable } from "inversify";

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";
import { IEventMap } from "../api/IEventMap";
import { EventMapConfig } from "./EventMapConfig";
import { Event } from "../../../events/impl/Event";

/**
 * @private
 */
@injectable()
export class EventMap implements IEventMap {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _listeners: EventMapConfig[] = [];

    private _suspendedListeners: EventMapConfig[] = [];

    private _suspended: boolean = false;

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public mapListener(
        dispatcher: IEventDispatcher | EventTarget,
        eventString: string,
        listener: Function,
        thisObject?: any,
        eventClass?: Object,
        useCapture: boolean = false,        // Not used in browser environment
        priority: number = 0,               // Not used in browser environment
        useWeakReference: boolean = true    // Not used in browser environment
    ): void {
        eventClass = eventClass || Event;

        let currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        let config: EventMapConfig;

        let i: number = currentListeners.length;
        while (i--) {
            config = currentListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, thisObject, eventClass, useCapture)) {
                return;
            }
        }

        let callback: Function = (eventClass === Event)
            ? listener
            : function(event: Event): void {
                this.routeEventToListener(this.event, listener, eventClass);
            };

        config = new EventMapConfig(
            dispatcher,
            eventString,
            listener,
            thisObject,
            eventClass,
            callback,
            useCapture
        );

        currentListeners.push(config);

        if (!this._suspended) {
            (<IEventDispatcher>dispatcher).addEventListener(eventString, callback, thisObject);
        }
    }

    /**
     * @inheritDoc
     */
    public unmapListener(
        dispatcher: IEventDispatcher | EventTarget,
        eventString: string,
        listener: Function,
        thisObject?: any,
        eventClass?: Object,
        useCapture: boolean = false
    ): void {
        eventClass = eventClass || Event;

        let currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        let i: number = currentListeners.length;
        while (i--) {
            let config: EventMapConfig = currentListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, thisObject, eventClass, useCapture)) {
                if (!this._suspended) {
                    (<IEventDispatcher>dispatcher).removeEventListener(eventString, config.callback, thisObject);
                }
                currentListeners.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @inheritDoc
     */
    public unmapListeners(): void {
        let currentListeners: EventMapConfig[] = this._suspended ? this._suspendedListeners : this._listeners;

        let eventConfig: EventMapConfig;
        let dispatcher: IEventDispatcher | EventTarget;
        while (eventConfig = currentListeners.pop()) {
            if (!this._suspended) {
                dispatcher = eventConfig.dispatcher;
                (<IEventDispatcher>dispatcher).removeEventListener(eventConfig.eventString, eventConfig.callback, eventConfig.thisObject);
            }
        }
    }

    /**
     * @inheritDoc
     */
    public suspend(): void {
        if (this._suspended) {
            return;
        }

        this._suspended = true;

        let eventConfig: EventMapConfig;
        let dispatcher: IEventDispatcher | EventTarget;
        while (eventConfig = this._listeners.pop()) {
            dispatcher = eventConfig.dispatcher;
            (<IEventDispatcher>dispatcher).removeEventListener(eventConfig.eventString, eventConfig.callback, eventConfig.thisObject);
            this._suspendedListeners.push(eventConfig);
        }
    }

    /**
     * @inheritDoc
     */
    public resume(): void {
        if (!this._suspended) {
            return;
        }

        this._suspended = false;

        let eventConfig: EventMapConfig;
        let dispatcher: IEventDispatcher | EventTarget;
        while (eventConfig = this._suspendedListeners.pop()) {
            dispatcher = eventConfig.dispatcher;
            (<IEventDispatcher>dispatcher).addEventListener(eventConfig.eventString, eventConfig.callback, eventConfig.thisObject);
            this._listeners.push(eventConfig);
        }
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    /**
     * Event Handler
     *
     * @param event The <code>Event</code>
     * @param listener
     * @param originalEventClass
     */
    protected routeEventToListener(event: Event, listener: Function, originalEventClass: Object): void {
        if (event instanceof <any>originalEventClass) {
            listener(event);
        }
    }
}
