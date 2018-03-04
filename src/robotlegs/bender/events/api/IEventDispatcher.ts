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

import { IEvent } from "./IEvent";

export let IEventDispatcher = Symbol("IEventDispatcher");

/**
 * @language en_US
 * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific types
 * of event listeners are registered, and dispatches events. Event targets are an important part of the Egret event model.
 * The event target serves as the focal point for how events flow through the display list hierarchy. When an event
 * such as a touch tap occurs, an event object is dispatched into the event flow from the root of the display list.
 * The event object makes a round-trip journey to the event target, which is conceptually divided into three phases: <br/>
 * the capture phase includes the journey from the root to the last node before the event target's node; the target
 * phase includes only the event target node; and the bubbling phase includes any subsequent nodes encountered on the
 * return trip to the root of the display list.In general, the easiest way for a user-defined class to gain event
 * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already
 * extending another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member,
 * and write simple hooks to route calls into the aggregated EventDispatcher.
 * @see egret.EventDispatcher
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/events/IEventDispatcher.ts
 */
export interface IEventDispatcher {
    /**
     * @language en_US
     * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
     * event. You can register event listeners on all nodes in the display list for a specific type of event, phase,
     * and priority.After you successfully register an event listener, you cannot change its priority through additional
     * calls to on(). To change a listener's priority, you must first call removeEventListener(). Then you can register the
     * listener again with the new priority level.After the listener is registered, subsequent calls to on() with a
     * different value for either type or useCapture result in the creation of a separate listener registration. <br/>
     * When you no longer need an event listener, remove it by calling EventDispatcher.removeEventListener(); otherwise, memory
     * problems might result. Objects with registered event listeners are not automatically removed from memory because
     * the garbage collector does not remove objects that still have references.Copying an EventDispatcher instance does
     * not copy the event listeners attached to it. (If your newly created node needs an event listener, you must attach
     * the listener after creating the node.) However, if you move an EventDispatcher instance, the event listeners attached
     * to it move along with it.If the event listener is being registered on a node while an event is also being processed
     * on this node, the event listener is not triggered during the current phase but may be triggered during a later phase
     * in the event flow, such as the bubbling phase.If an event listener is removed from a node while an event is being
     * processed on the node, it is still triggered by the current actions. After it is removed, the event listener is
     * never invoked again (unless it is registered again for future processing).
     * @param type The type of event.
     * @param listener The listener function that processes the event. This function must accept an event object as
     * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
     * have any name.
     * @param thisObject the listener function's "this"
     * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
     * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
     * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
     * in all three phases, call on() twice, once with useCapture set to true, then again with useCapture set to false.
     * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
     * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
     * If two or more listeners share the same priority, they are processed in the order in which they were added.
     * The default priority is
     * @see #once()
     * @see #removeEventListener()
     * @version Egret 2.4
     * @platform Web,Native
     */
    addEventListener(type: string, listener: Function, thisObject?: any, useCapture?: boolean, priority?: number): void;

    /**
     * @language en_US
     * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
     * event. Different from the on() method,the listener receives notification only once,and then it will be removed
     * automatically.
     * @param type The type of event.
     * @param listener The listener function that processes the event. This function must accept an event object as
     * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
     * have any name.
     * @param thisObject the listener function's "this"
     * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
     * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
     * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
     * in all three phases, call on() twice, once with useCapture set to true, then again with useCapture set to false.
     * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
     * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
     * If two or more listeners share the same priority, they are processed in the order in which they were added.
     * The default priority is
     * @see #on()
     * @see #removeEventListener()
     * @version Egret 2.4
     * @platform Web,Native
     */
    once(type: string, listener: Function, thisObject?: any, useCapture?: boolean, priority?: number): void;

    /**
     * @language en_US
     * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the
     * EventDispatcher object, a call to this method has no effect.
     * @param type The type of event.
     * @param listener The listener object to remove.
     * @param thisObject the listener function's "this"
     * @param useCapture Specifies whether the listener was registered for the capture phase or the bubbling phases.
     * If the listener was registered for both the capture phase and the bubbling phases, two calls to removeEventListener()
     * are required to remove both: one call with useCapture set to true, and another call with useCapture set to false.
     * @version Egret 2.4
     * @platform Web,Native
     */
    removeEventListener(type: string, listener: Function, thisObject?: any, useCapture?: boolean): void;

    /**
     * @language en_US
     * Checks whether the EventDispatcher object has any listeners registered for a specific type of event. This allows
     * you to determine where an EventDispatcher object has altered handling of an event type in the event flow hierarchy.
     * To determine whether a specific event type will actually trigger an event listener, use IEventDispatcher.willTrigger().
     * The difference between hasEventListener() and willTrigger() is that hasEventListener() examines only the object to
     * which it belongs, whereas willTrigger() examines the entire event flow for the event specified by the type parameter.
     * @param type The type of event.
     * @returns A value of true if a listener of the specified type is registered; false otherwise.
     * @see #willTrigger()
     * @version Egret 2.4
     * @platform Web,Native
     */
    hasEventListener(type: string): boolean;

    /**
     * @language en_US
     * Dispatches an event into the event flow. The event target is the EventDispatcher object upon which dispatchEvent() is called.
     * @param event The event object dispatched into the event flow.
     * @returns A value of true unless preventDefault() is called on the event, in which case it returns false.
     * @version Egret 2.4
     * @platform Web,Native
     */
    dispatchEvent(event: IEvent): boolean;

    /**
     * @language en_US
     * Checks whether an event listener is registered with this EventDispatcher object or any of its ancestors for the
     * specified event type. This method returns true if an event listener is triggered during any phase of the event
     * flow when an event of the specified type is dispatched to this EventDispatcher object or any of its descendants.
     * @param type The type of event.
     * @returns A value of true if a listener of the specified type will be triggered; false otherwise.
     * @see #hasEventListener()
     * @version Egret 2.4
     * @platform Web,Native
     */
    willTrigger(type: string): boolean;
}
