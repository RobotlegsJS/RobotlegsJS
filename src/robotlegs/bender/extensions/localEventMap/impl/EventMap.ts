// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
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
import { DomEventMapConfig } from "./DomEventMapConfig";
import { EventMapConfig } from "./EventMapConfig";

/**
 * @private
 */
@injectable()
export class EventMap implements IEventMap {
    /*============================================================================*/
    /* Protected Properties                                                       */
    /*============================================================================*/

    protected _listeners: EventMapConfig[] = [];
    protected _suspendedListeners: EventMapConfig[] = [];

    protected _domListeners: DomEventMapConfig[] = [];
    protected _suspendedDomListeners: DomEventMapConfig[] = [];

    protected _suspended: boolean = false;

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
        priority: number = 0
    ): void {
        eventClass = eventClass === undefined ? Event : eventClass;

        let currentListeners: EventMapConfig[] = this._suspended ? this._suspendedListeners : this._listeners;

        let config: EventMapConfig;

        let i: number = currentListeners.length;
        while (i--) {
            config = currentListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, thisObject, eventClass, useCapture)) {
                return;
            }
        }

        let callback: Function =
            eventClass === Event
                ? listener
                : (event: Event) => {
                      this.routeEventToListener(event, listener, eventClass);
                  };

        config = new EventMapConfig(dispatcher, eventString, listener, thisObject, eventClass, callback, useCapture, priority);

        currentListeners.push(config);

        if (!this._suspended) {
            dispatcher.addEventListener(eventString, callback, thisObject, useCapture, priority);
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

        let currentListeners: EventMapConfig[] = this._suspended ? this._suspendedListeners : this._listeners;

        let i: number = currentListeners.length;
        while (i--) {
            let config: EventMapConfig = currentListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, thisObject, eventClass, useCapture)) {
                if (!this._suspended) {
                    dispatcher.removeEventListener(eventString, config.callback, thisObject, useCapture);
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
    public mapDomListener(
        dispatcher: EventTarget,
        eventString: string,
        listener?: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        let currentDomListeners: DomEventMapConfig[] = this._suspended ? this._suspendedDomListeners : this._domListeners;

        let domConfig: DomEventMapConfig;

        let i: number = currentDomListeners.length;
        while (i--) {
            domConfig = currentDomListeners[i];
            if (domConfig.equalTo(dispatcher, eventString, listener, options)) {
                return;
            }
        }

        domConfig = new DomEventMapConfig(dispatcher, eventString, listener, options);

        currentDomListeners.push(domConfig);

        if (!this._suspended) {
            dispatcher.addEventListener(eventString, listener, options);
        }
    }

    /**
     * @inheritDoc
     */
    public unmapDomListener(
        dispatcher: EventTarget,
        eventString: string,
        listener?: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void {
        let currentDomListeners: DomEventMapConfig[] = this._suspended ? this._suspendedDomListeners : this._domListeners;

        let i: number = currentDomListeners.length;
        while (i--) {
            let config: DomEventMapConfig = currentDomListeners[i];
            if (config.equalTo(dispatcher, eventString, listener, options)) {
                if (!this._suspended) {
                    dispatcher.removeEventListener(eventString, listener, options);
                }
                currentDomListeners.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @inheritDoc
     */
    public unmapDomListeners(): void {
        let currentDomListeners: DomEventMapConfig[] = this._suspended ? this._suspendedDomListeners : this._domListeners;

        let domEventConfig: DomEventMapConfig;
        let dispatcher: EventTarget;

        while (currentDomListeners.length) {
            domEventConfig = currentDomListeners.pop();

            if (!this._suspended) {
                dispatcher = domEventConfig.dispatcher;
                dispatcher.removeEventListener(domEventConfig.eventString, domEventConfig.listener, domEventConfig.options);
            }
        }
    }

    /**
     * @inheritDoc
     */
    public unmapAllListeners(): void {
        this.unmapListeners();
        this.unmapDomListeners();
    }

    /**
     * @inheritDoc
     */
    public suspend(): void {
        if (this._suspended) {
            return;
        }

        this._suspended = true;

        // Handle EventDispatcher's
        let dispatcher: IEventDispatcher;

        this._listeners.forEach((eventConfig: EventMapConfig) => {
            dispatcher = eventConfig.dispatcher;
            dispatcher.removeEventListener(eventConfig.eventString, eventConfig.callback, eventConfig.thisObject, eventConfig.useCapture);
            this._suspendedListeners.push(eventConfig);
        });

        this._listeners = [];

        // Handle EventTarget's (DOM)
        let domDispatcher: EventTarget;

        this._domListeners.forEach((domEventConfig: DomEventMapConfig) => {
            domDispatcher = domEventConfig.dispatcher;
            domDispatcher.removeEventListener(domEventConfig.eventString, domEventConfig.listener, domEventConfig.options);
            this._suspendedDomListeners.push(domEventConfig);
        });

        this._domListeners = [];
    }

    /**
     * @inheritDoc
     */
    public resume(): void {
        if (!this._suspended) {
            return;
        }

        this._suspended = false;

        // Handle EventDispatcher's
        let dispatcher: IEventDispatcher;

        this._suspendedListeners.forEach((eventConfig: EventMapConfig) => {
            dispatcher = eventConfig.dispatcher;
            dispatcher.addEventListener(
                eventConfig.eventString,
                eventConfig.callback,
                eventConfig.thisObject,
                eventConfig.useCapture,
                eventConfig.priority
            );
            this._listeners.push(eventConfig);
        });

        this._suspendedListeners = [];

        // Handle EventTarget's (DOM)
        let domDispatcher: EventTarget;

        this._suspendedDomListeners.forEach((domEventConfig: DomEventMapConfig) => {
            domDispatcher = domEventConfig.dispatcher;
            domDispatcher.addEventListener(domEventConfig.eventString, domEventConfig.listener, domEventConfig.options);
            this._domListeners.push(domEventConfig);
        });

        this._suspendedDomListeners = [];
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
    protected routeEventToListener(event: Event, listener: Function, originalEventClass: IClass<IEvent>): void {
        if (isInstanceOfType(event, originalEventClass)) {
            listener(event);
        }
    }
}
