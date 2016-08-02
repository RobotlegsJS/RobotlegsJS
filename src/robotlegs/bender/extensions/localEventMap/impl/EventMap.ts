// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable } from "inversify";

import { IEventDispatcher } from "../../../events/IEventDispatcher";
import { IEventMap } from "../api/IEventMap";
import { EventMapConfig } from "./EventMapConfig";

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
        dispatcher: IEventDispatcher,
        eventString: string,
        listener: Function,
        eventClass?: Object,
        useCapture: boolean = false,        // Not used in browser environment
        priority: number = 0,               // Not used in browser environment
        useWeakReference: boolean = true    // Not used in browser environment
    ): void {
        eventClass = eventClass || Event;

        var currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        var config: EventMapConfig;

        var i: number = currentListeners.length;
        while (i--) {
            config = currentListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, eventClass, useCapture)) {
                return;
            }
        }

        var callback: Function = (eventClass == Event)
            ? listener
            : function(event: Event): void {
                this.routeEventToListener(this.event, listener, eventClass);
            };

        config = new EventMapConfig(
            dispatcher,
            eventString,
            listener,
            eventClass,
            callback,
            useCapture
        );

        currentListeners.push(config);

        if (!this._suspended) {
            dispatcher.addEventListener(eventString, callback);
        }
    }

    /**
     * @inheritDoc
     */
    public unmapListener(
        dispatcher: IEventDispatcher,
        eventString: string,
        listener: Function,
        eventClass?: Object,
        useCapture: boolean = false
    ): void {
        eventClass = eventClass || Event;

        var currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        var i: number = currentListeners.length;
        while (i--) {
            var config: EventMapConfig = currentListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, eventClass, useCapture)) {
                if (!this._suspended) {
                    dispatcher.removeEventListener(eventString, config.callback);
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
        var currentListeners: EventMapConfig[] = this._suspended ? this._suspendedListeners : this._listeners;

        var eventConfig: EventMapConfig;
        var dispatcher: IEventDispatcher;
        while (eventConfig = currentListeners.pop()) {
            if (!this._suspended) {
                dispatcher = eventConfig.dispatcher;
                dispatcher.removeEventListener(eventConfig.eventString, eventConfig.callback);
            }
        }
    }

    /**
     * @inheritDoc
     */
    public suspend(): void {
        if (this._suspended)
            return;

        this._suspended = true;

        var eventConfig: EventMapConfig;
        var dispatcher: IEventDispatcher;
        while (eventConfig = this._listeners.pop()) {
            dispatcher = eventConfig.dispatcher;
            dispatcher.removeEventListener(eventConfig.eventString, eventConfig.callback);
            this._suspendedListeners.push(eventConfig);
        }
    }

    /**
     * @inheritDoc
     */
    public resume(): void {
        if (!this._suspended)
            return;

        this._suspended = false;

        var eventConfig: EventMapConfig;
        var dispatcher: IEventDispatcher;
        while (eventConfig = this._suspendedListeners.pop()) {
            dispatcher = eventConfig.dispatcher;
            dispatcher.addEventListener(eventConfig.eventString, eventConfig.callback);
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
