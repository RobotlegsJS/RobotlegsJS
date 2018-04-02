//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

import { injectable } from "inversify";

import { IEvent } from "../api/IEvent";
import { IEventDispatcher } from "../api/IEventDispatcher";

import { Event } from "../impl/Event";

/**
 * @private
 */
const enum Keys {
    eventTarget,
    eventsMap,
    captureEventsMap,
    notifyLevel
}

/**
 * @private
 */
export interface IEventBin {
    type: string;
    listener: Function;
    thisObject: any;
    priority: number;
    target: IEventDispatcher;
    useCapture: boolean;
    dispatchOnce: boolean;
}

let ONCE_EVENT_LIST: IEventBin[] = [];

/**
 * The EventDispatcher class is the base class for all classes that dispatchEvent events. The EventDispatcher class implements
 * the IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows
 * any object on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
 * Event targets are an important part of the Egret event model. The event target serves as the focal point for how events
 * flow through the display list hierarchy. When an event such as a touch tap, Egret dispatches an event object into the
 * event flow from the root of the display list. The event object then makes its way through the display list until it
 * reaches the event target, at which point it begins its return trip through the display list. This round-trip journey
 * to the event target is conceptually divided into three phases: <br/>
 * the capture phase comprises the journey from the root to the last node before the event target's node, the target
 * phase comprises only the event target node, and the bubbling phase comprises any subsequent nodes encountered on
 * the return trip to the root of the display list. In general, the easiest way for a user-defined class to gain event
 * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already extending
 * another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, and write simple
 * hooks to route calls into the aggregated EventDispatcher.
 * @see egret.IEventDispatcher
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/events/EventDispatcher.ts
 * @language en_US
 */
@injectable()
export class EventDispatcher implements IEventDispatcher {
    /**
     * @private
     */
    private _eventDispatcher: any;

    /**
     * create an instance of the EventDispatcher class.
     * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
     * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
     * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public constructor(target: IEventDispatcher = null) {
        this._eventDispatcher = {
            0: target ? target : this,
            1: {},
            2: {},
            3: 0
        };
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public addEventListener(type: string, listener: Function, thisObject?: any, useCapture?: boolean, priority?: number): void {
        this._addListener(type, listener, thisObject, useCapture, priority);
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public once(type: string, listener: Function, thisObject?: any, useCapture?: boolean, priority?: number): void {
        this._addListener(type, listener, thisObject, useCapture, priority, true);
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public removeEventListener(type: string, listener: Function, thisObject?: any, useCapture?: boolean): void {
        let values = this._eventDispatcher;
        let eventMap: any = this._getEventMap(useCapture);
        let list: IEventBin[] = eventMap[type];

        if (!list) {
            return;
        }
        if (values[Keys.notifyLevel] !== 0) {
            eventMap[type] = list = list.concat();
        }

        this._removeEventBin(list, listener, thisObject);

        if (list.length === 0) {
            eventMap[type] = null;
        }
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public hasEventListener(type: string): boolean {
        let values = this._eventDispatcher;
        return !!(values[Keys.eventsMap][type] || values[Keys.captureEventsMap][type]);
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public willTrigger(type: string): boolean {
        return this.hasEventListener(type);
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public dispatchEvent(event: IEvent): boolean {
        event.currentTarget = this._eventDispatcher[Keys.eventTarget];
        event.target = event.currentTarget;
        return this._notifyListener(event, false);
    }

    /**
     * Distribute a specified event parameters.
     * @param type The type of the event. Event listeners can access this information through the inherited type property.
     * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
     * the inherited bubbles property.
     * @param data {any} data
     * @param cancelable Determines whether the Event object can be canceled. The default values is false.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public dispatchEventWith(type: string, bubbles?: boolean, data?: any, cancelable?: boolean): boolean {
        if (bubbles || this.hasEventListener(type)) {
            let event: Event = new Event(type, bubbles, cancelable, data);
            let result = this.dispatchEvent(event);
            return result;
        }
        return true;
    }

    /**
     * @private
     *
     * @param useCapture
     */
    private _getEventMap(useCapture?: boolean) {
        let values = this._eventDispatcher;
        let eventMap: any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
        return eventMap;
    }

    /**
     * @private
     */
    private _addListener(
        type: string,
        listener: Function,
        thisObject?: any,
        useCapture?: boolean,
        priority?: number,
        dispatchOnce?: boolean
    ): void {
        let values = this._eventDispatcher;
        let eventMap: any = this._getEventMap(useCapture);
        let list: IEventBin[] = eventMap[type];

        if (!list) {
            list = eventMap[type] = [];
        } else if (values[Keys.notifyLevel] !== 0) {
            eventMap[type] = list = list.concat();
        }

        this._insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
    }

    /**
     * @private
     */
    private _insertEventBin(
        list: any[],
        type: string,
        listener: Function,
        thisObject?: any,
        useCapture?: boolean,
        priority?: number,
        dispatchOnce?: boolean
    ): boolean {
        priority = priority || 0;
        let insertIndex = -1;
        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener === listener && bin.thisObject === thisObject && bin.target === this) {
                return false;
            }
            if (insertIndex === -1 && bin.priority < priority) {
                insertIndex = i;
            }
        }
        let eventBin: IEventBin = {
            type,
            listener,
            thisObject,
            priority,
            target: this,
            useCapture,
            dispatchOnce: !!dispatchOnce
        };
        if (insertIndex !== -1) {
            list.splice(insertIndex, 0, eventBin);
        } else {
            list.push(eventBin);
        }
        return true;
    }

    /**
     * @private
     */
    private _removeEventBin(list: any[], listener: Function, thisObject?: any): boolean {
        let length = list.length;

        for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener === listener && bin.thisObject === thisObject && bin.target === this) {
                list.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    /**
     * @private
     */
    private _notifyListener(event: IEvent, capturePhase: boolean): boolean {
        let values = this._eventDispatcher;
        let eventMap: any = this._getEventMap(capturePhase);
        let list: IEventBin[] = eventMap[event.type];
        if (!list) {
            return true;
        }
        let length = list.length;
        if (length === 0) {
            return true;
        }
        let onceList = ONCE_EVENT_LIST;
        values[Keys.notifyLevel]++;
        for (let i = 0; i < length; i++) {
            let eventBin = list[i];
            eventBin.listener.call(eventBin.thisObject, event);
            if (eventBin.dispatchOnce) {
                onceList.push(eventBin);
            }
            if (event.isPropagationImmediateStopped) {
                break;
            }
        }
        values[Keys.notifyLevel]--;
        while (onceList.length) {
            let eventBin = onceList.pop();
            eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
        }
        return !event.isDefaultPrevented;
    }
}
