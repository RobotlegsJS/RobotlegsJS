// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { safelyCallBack } from "./safelyCallBack";

/**
 * Message Dispatcher implementation.
 */
export class MessageDispatcher {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _handlers: Map<any, any> = new Map<any, any>();

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Registers a message handler with a MessageDispatcher.
     * @param message The interesting message
     * @param handler The handler function
     */
    public addMessageHandler(message: Object, handler: Function): void {
        let messageHandlers: any[] = this._handlers.get(<any>message);
        if (messageHandlers) {
            if (messageHandlers.indexOf(handler) === -1) {
                messageHandlers.push(handler);
            }
        } else {
            this._handlers.set(<any>message, handler);
        }
    }

    /**
     * Checks whether the MessageDispatcher has any handlers registered for a specific message.
     * @param message The interesting message
     * @return A value of true if a handler of the specified message is registered; false otherwise.
     */
    public hasMessageHandler(message: Object): boolean {
        return this._handlers.get(<any>message);
    }

    /**
     * Removes a message handler from a MessageDispatcher
     * @param message The interesting message
     * @param handler The handler function
     */
    public removeMessageHandler(message: Object, handler: Function): void {
        let messageHandlers: any[] = this._handlers.get(<any>message);
        let index: number = messageHandlers ? messageHandlers.indexOf(handler) : -1;
        if (index !== -1) {
            messageHandlers.splice(index, 1);
            if (messageHandlers.length === 0) {
                this._handlers.delete(<any>message);
            }
        }
    }

    /**
     * Dispatches a message into the message flow.
     * @param message The interesting message
     * @param callback The completion callback function
     * @param reverse Should handlers be called in reverse order
     */
    public dispatchMessage(message: Object, callback: Function = null, reverse: boolean = false): void {
        let handlers: any[] = this._handlers.get(<any>message);
        if (handlers) {
            handlers = handlers.concat();
            if (!reverse) {
                handlers.reverse();
            }
            new MessageRunner(message, handlers, callback).run();
        } else {
            if (callback) {
                safelyCallBack(callback);
            }
        }
    }
}

class MessageRunner {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _message: Object;

    private _handlers: any[];

    private _callback: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(message: Object, handlers: any[], callback: Function) {
        this._message = message;
        this._handlers = handlers;
        this._callback = callback;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public run(): void {
        this.next();
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private next(): void {
        // Try to keep things synchronous with a simple loop,
        // forcefully breaking out for async handlers and recursing.
        // We do this to avoid increasing the stack depth unnecessarily.
        let handler: Function;
        while (handler = this._handlers.pop()) {
            if (handler.length === 0) { // sync handler: ()
                handler();
            } else if (handler.length === 1) { // sync handler: (message)
                handler(this._message);
            } else if (handler.length === 2) { // sync or async handler: (message, callback)
                let handled: boolean;
                handler(this._message, function(error: Object = null, msg: Object = null): void {
                    // handler must not invoke the callback more than once
                    if (handled) {
                        return;
                    }

                    handled = true;
                    if (this.error || this._handlers.length === 0) {
                        if (this._callback) {
                            safelyCallBack(this._callback, this.error, this._message);
                        }
                    } else {
                        this.next();
                    }
                });
                // IMPORTANT: MUST break this loop with a RETURN. See top.
                return;
            } else { // ERROR: this should NEVER happen
                throw new Error("Bad handler signature");
            }
        }
        // If we got here then this loop finished synchronously.
        // Nobody broke out, so we are done.
        // This relies on the various return statements above. Be careful.
        if (this._callback) {
            safelyCallBack(this._callback, null, this._message);
        }
    }
}
