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

import { IEvent } from "../api/IEvent";

/**
 * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
 * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
 * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
 * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
 * information. Events associated with a touch tap, for example, need to include additional information about the
 * location of the touch event. You can pass such additional information to event listeners by extending the Event class,
 * which is what the TouchEvent class does. Egret API defines several Event subclasses for common events that require
 * additional information. Events associated with each of the Event subclasses are described in the documentation for
 * each class.The methods of the Event class can be used in event listener functions to affect the behavior of the event
 * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
 * preventDefault() method. You can also make the current event listener the last one to process an event by calling
 * the stopPropagation() or stopImmediatePropagation() method.
 * @see egret.EventDispatcher
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/events/Event.ts
 * @see http://edn.egret.com/cn/docs/page/798 取消触摸事件
 * @language en_US
 */
export class Event implements IEvent {
    /**
     * @private
     */
    private _type: string;

    /**
     * @private
     */
    private _bubbles: boolean;

    /**
     * @private
     */
    private _cancelable: boolean;

    /**
     * @private
     */
    private _currentTarget: any;

    /**
     * @private
     */
    private _target: any;

    /**
     * @private
     */
    private _isDefaultPrevented: boolean = false;

    /**
     * @private
     */
    private _isPropagationStopped: boolean = false;

    /**
     * @private
     */
    private _isPropagationImmediateStopped: boolean = false;

    /**
     * @private
     */
    private _data: any;

    /**
     * Creates an Event object to pass as a parameter to event listeners.
     * @param type  The type of the event, accessible as Event.type.
     * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
     * @param cancelable Determines whether the Event object can be canceled. The default values is false.
     * @param data the optional data associated with this event
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
        this._type = type;
        this._bubbles = !!bubbles;
        this._cancelable = !!cancelable;
        this._data = data;
    }

    /**
     * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
     * are carried out by default. For example, if a user types a character into a text input, the default behavior
     * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
     * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
     * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
     * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
     * otherwise, preventDefault() has no effect.
     * @see #cancelable
     * @see #isDefaultPrevented
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public preventDefault(): void {
        if (this._cancelable) {
            this._isDefaultPrevented = true;
        }
    }

    /**
     * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
     * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
     * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
     * method have no effect. This method can be called in any phase of the event flow.<br/>
     * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
     * @see #stopImmediatePropagation()
     * @see #preventDefault()
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public stopPropagation(): void {
        if (this._bubbles) {
            this._isPropagationStopped = true;
        }
    }

    /**
     * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
     * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
     * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.<br/>
     * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
     * @see #stopPropagation()
     * @see #preventDefault()
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public stopImmediatePropagation(): void {
        if (this._bubbles) {
            this._isPropagationImmediateStopped = true;
        }
    }

    /**
     * The type of event. The type is case-sensitive.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get type(): string {
        return this._type;
    }

    /**
     * Indicates whether an event is a bubbling event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get bubbles(): boolean {
        return this._bubbles;
    }

    /**
     * Indicates whether the behavior associated with the event can be prevented. If the behavior can be
     * canceled, this value is true; otherwise it is false.
     * @see #preventDefault()
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get cancelable(): boolean {
        return this._cancelable;
    }

    /**
     * Checks whether the preventDefault() method has been called on the event. If the preventDefault() method has been
     * called, returns true; otherwise, returns false.
     * @returns If preventDefault() has been called, returns true; otherwise, returns false.
     * @see #preventDefault()
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get isDefaultPrevented(): boolean {
        return this._isDefaultPrevented;
    }

    public get isPropagationStopped(): boolean {
        return this._isPropagationStopped;
    }

    public get isPropagationImmediateStopped(): boolean {
        return this._isPropagationImmediateStopped;
    }

    /**
     * The object that is actively processing the Event object with an event listener. For example, if a
     * user clicks an OK button, the current target could be the node containing that button or one of its ancestors
     * that has registered an event listener for that event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get currentTarget(): any {
        return this._currentTarget;
    }

    public set currentTarget(value: any) {
        this._currentTarget = value;
    }

    /**
     * The event target. This property contains the target node. For example, if a user clicks an OK button,
     * the target node is the display list node containing that button.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get target(): any {
        return this._target;
    }

    public set target(value: any) {
        this._target = value;
    }

    /**
     * the optional data associated with this event
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    public get data(): any {
        return this._data;
    }

    public set data(value: any) {
        this._data = value;
    }
}
