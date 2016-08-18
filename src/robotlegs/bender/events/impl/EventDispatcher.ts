// https://github.com/mrdoob/eventdispatcher.js

import { injectable } from "inversify";

import { IEvent } from "../api/IEvent.ts";
import { IEventDispatcher } from "../api/IEventDispatcher";

import { Event } from "../impl/Event";

/**
 * @private
 */
const enum Keys{
    eventTarget,
    eventsMap,
    captureEventsMap,
    notifyLevel
}

/**
 * @private
 */
export interface EventBin {
    type:string;
    listener: Function;
    thisObject:any;
    priority:number;
    target:IEventDispatcher;
    useCapture:boolean;
    dispatchOnce:boolean;
}

var ONCE_EVENT_LIST:EventBin[] = [];

@injectable()
export class EventDispatcher implements IEventDispatcher {

    /**
     * @language en_US
     * create an instance of the EventDispatcher class.
     * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
     * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
     * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
     * @version Egret 2.4
     * @platform Web,Native
     */
    public constructor(target:IEventDispatcher = null) {
        this.$EventDispatcher = {
            0: target ? target : this,
            1: {},
            2: {},
            3: 0
        };
    }

    /**
     * @private
     */
    $EventDispatcher:Object;

    /**
     * @private
     *
     * @param useCapture
     */
    $getEventMap(useCapture?:boolean) {
        var values = this.$EventDispatcher;
        var eventMap:any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
        return eventMap;
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public addEventListener(type:string, listener:Function, thisObject?:any, useCapture?:boolean, priority?:number):void {
        this.$addListener(type, listener, thisObject, useCapture, priority);
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public once(type:string, listener:Function, thisObject?:any, useCapture?:boolean, priority?:number):void {
        this.$addListener(type, listener, thisObject, useCapture, priority, true);
    }

    /**
     * @private
     */
    $addListener(type:string, listener:Function, thisObject?:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):void {
        var values = this.$EventDispatcher;
        var eventMap:any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
        var list:EventBin[] = eventMap[type];
        if (!list) {
            list = eventMap[type] = [];
        }
        else if (values[Keys.notifyLevel] !== 0) {
            eventMap[type] = list = list.concat();
        }

        this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
    }

    $insertEventBin(list:Array<any>, type:string, listener:Function, thisObject?:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):boolean {
        priority = +priority | 0;
        var insertIndex = -1;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var bin = list[i];
            if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                return false;
            }
            if (insertIndex == -1 && bin.priority < priority) {
                insertIndex = i;
            }
        }
        var eventBin:EventBin = {
            type: type, listener: listener, thisObject: thisObject, priority: priority,
            target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
        };
        if (insertIndex !== -1) {
            list.splice(insertIndex, 0, eventBin);
        }
        else {
            list.push(eventBin);
        }
        return true;
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public removeEventListener(type:string, listener:Function, thisObject?:any, useCapture?:boolean):void {
        var values = this.$EventDispatcher;
        var eventMap:Object = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
        var list:EventBin[] = eventMap[type];
        if (!list) {
            return;
        }
        if (values[Keys.notifyLevel] !== 0) {
            eventMap[type] = list = list.concat();
        }

        this.$removeEventBin(list, listener, thisObject);

        if (list.length == 0) {
            eventMap[type] = null;
        }
    }

    $removeEventBin(list:Array<any>, listener:Function, thisObject?:any):boolean {
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var bin = list[i];
            if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                list.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public hasEventListener(type:string):boolean {
        var values = this.$EventDispatcher;
        return !!(values[Keys.eventsMap][type] || values[Keys.captureEventsMap][type]);
    }

    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public willTrigger(type:string):boolean {
        return this.hasEventListener(type);
    }


    /**
     * @inheritDoc
     * @version Egret 2.4
     * @platform Web,Native
     */
    public dispatchEvent(event:IEvent):boolean {
        event.currentTarget = this.$EventDispatcher[Keys.eventTarget];
        event.target = event.currentTarget;
        return this.$notifyListener(event, false);
    }

    /**
     * @private
     */
    $notifyListener(event:IEvent, capturePhase:boolean):boolean {
        var values = this.$EventDispatcher;
        var eventMap:Object = capturePhase ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
        var list:EventBin[] = eventMap[event.type];
        if (!list) {
            return true;
        }
        var length = list.length;
        if (length == 0) {
            return true;
        }
        var onceList = ONCE_EVENT_LIST;
        //做个标记，防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为dispatch()方法调用通常比on()等方法频繁。
        values[Keys.notifyLevel]++;
        for (var i = 0; i < length; i++) {
            var eventBin = list[i];
            eventBin.listener.call(eventBin.thisObject, event);
            if (eventBin.dispatchOnce) {
                onceList.push(eventBin);
            }
            if (event.defaultPrevented) {
                break;
            }
        }
        values[Keys.notifyLevel]--;
        while (onceList.length) {
            eventBin = onceList.pop();
            eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
        }
        return !event.defaultPrevented;
    }

    /**
     * @language en_US
     * Distribute a specified event parameters.
     * @param type The type of the event. Event listeners can access this information through the inherited type property.
     * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
     * the inherited bubbles property.
     * @param data {any} data
     * @version Egret 2.4
     * @platform Web,Native
     */
    public dispatchEventWith(type:string, bubbles?:boolean, data?:any):boolean {
        if (bubbles || this.hasEventListener(type)) {
            var event:Event = new CustomEvent(type, { bubbles: bubbles, detail: data });
            var result = this.dispatchEvent(event);
            return result;
        }
        return true;
    }
}
