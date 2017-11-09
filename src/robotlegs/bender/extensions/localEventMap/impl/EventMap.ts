// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable } from "inversify";

import { IEvent } from "../../../events/api/IEvent";
import { IEventDispatcher } from "../../../events/api/IEventDispatcher";
import { Event } from "../../../events/impl/Event";

import { IClass } from "../../../extensions/matching/IClass";
import { isInstanceOfType } from "../../../extensions/matching/isInstanceOfType";

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
        thisObject?: any,
        eventClass?: IClass<IEvent>,
        useCapture: boolean = false, // Not used in browser environment
        priority: number = 0 // Not used in browser environment
    ): void {
        eventClass = eventClass === undefined ? Event : eventClass;

        let currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        let config: EventMapConfig;

        let i: number = currentListeners.length;
        while (i--) {
            config = currentListeners[i];
            if (
                config.equalTo(
                    dispatcher,
                    eventString,
                    listener,
                    thisObject,
                    eventClass,
                    useCapture
                )
            ) {
                return;
            }
        }

        let callback: Function =
            eventClass === Event
                ? listener
                : (event: Event) => {
                      this.routeEventToListener(event, listener, eventClass);
                  };

        config = new EventMapConfig(
            dispatcher,
            eventString,
            listener,
            thisObject,
            eventClass,
            callback,
            useCapture,
            priority
        );

        currentListeners.push(config);

        if (!this._suspended) {
            dispatcher.addEventListener(
                eventString,
                callback,
                thisObject,
                useCapture,
                priority
            );
        }
    }

    /**
     * @inheritDoc
     */
    public unmapListener(
        dispatcher: IEventDispatcher,
        eventString: string,
        listener: Function,
        thisObject?: any,
        eventClass?: IClass<IEvent>,
        useCapture: boolean = false
    ): void {
        eventClass = eventClass !== undefined ? eventClass : Event;

        let currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        let i: number = currentListeners.length;
        while (i--) {
            let config: EventMapConfig = currentListeners[i];
            if (
                config.equalTo(
                    dispatcher,
                    eventString,
                    listener,
                    thisObject,
                    eventClass,
                    useCapture
                )
            ) {
                if (!this._suspended) {
                    dispatcher.removeEventListener(
                        eventString,
                        config.callback,
                        thisObject,
                        useCapture
                    );
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
        let currentListeners: EventMapConfig[] = this._suspended
            ? this._suspendedListeners
            : this._listeners;

        let eventConfig: EventMapConfig;
        let dispatcher: IEventDispatcher;

        while (currentListeners.length) {
            eventConfig = currentListeners.pop();

            if (!this._suspended) {
                dispatcher = eventConfig.dispatcher;
                dispatcher.removeEventListener(
                    eventConfig.eventString,
                    eventConfig.callback,
                    eventConfig.thisObject,
                    eventConfig.useCapture
                );
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
        let dispatcher: IEventDispatcher;

        while (this._listeners.length) {
            eventConfig = this._listeners.pop();
            dispatcher = eventConfig.dispatcher;
            dispatcher.removeEventListener(
                eventConfig.eventString,
                eventConfig.callback,
                eventConfig.thisObject,
                eventConfig.useCapture
            );
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
        let dispatcher: IEventDispatcher;

        while (this._suspendedListeners.length) {
            eventConfig = this._suspendedListeners.pop();
            dispatcher = eventConfig.dispatcher;
            dispatcher.addEventListener(
                eventConfig.eventString,
                eventConfig.callback,
                eventConfig.thisObject,
                eventConfig.useCapture,
                eventConfig.priority
            );
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
    protected routeEventToListener(
        event: Event,
        listener: Function,
        originalEventClass: IClass<IEvent>
    ): void {
        if (isInstanceOfType(event, originalEventClass)) {
            listener(event);
        }
    }
}
