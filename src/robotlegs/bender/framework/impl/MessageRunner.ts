// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { safelyCallBack } from "./safelyCallBack";

export class MessageRunner {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _message: string;

    private _handlers: Function[];

    private _callback: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(message: string, handlers: Function[], callback: Function) {
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
        while (this._handlers.length > 0) {
            handler = this._handlers.pop();

            if (handler.length === 0) {
                // sync handler: ()
                handler();
            } else if (handler.length === 1) {
                // sync handler: (message)
                handler(this._message);
            } else if (handler.length === 2) {
                // sync or async handler: (message, callback)
                let handled: boolean = false;
                handler(
                    this._message,
                    function(error: Error = null, msg: string = null): void {
                        // handler must not invoke the callback more than once
                        if (handled) {
                            return;
                        }

                        handled = true;

                        if (error || this._handlers.length === 0) {
                            if (this._callback) {
                                safelyCallBack(this._callback, error, this._message);
                            }
                        } else {
                            this.next();
                        }
                    }.bind(this)
                );
                // IMPORTANT: MUST break this loop with a RETURN. See top.
                return;
            } else {
                // ERROR: this should NEVER happen
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
