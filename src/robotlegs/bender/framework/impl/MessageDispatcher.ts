// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { MessageRunner } from "./MessageRunner";
import { safelyCallBack } from "./safelyCallBack";

/**
 * Message Dispatcher implementation.
 */
export class MessageDispatcher {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _handlers: Map<string, Function[]> = new Map();

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Registers a message handler with a MessageDispatcher.
     * @param message The interesting message
     * @param handler The handler function
     */
    public addMessageHandler(message: string, handler: Function): void {
        let messageHandlers: Function[] = this._handlers.get(message);
        if (messageHandlers) {
            if (messageHandlers.indexOf(handler) === -1) {
                messageHandlers.push(handler);
            }
        } else {
            this._handlers.set(message, [handler]);
        }
    }

    /**
     * Checks whether the MessageDispatcher has any handlers registered for a specific message.
     * @param message The interesting message
     * @return A value of true if a handler of the specified message is registered; false otherwise.
     */
    public hasMessageHandler(message: string): boolean {
        return this._handlers.has(message);
    }

    /**
     * Removes a message handler from a MessageDispatcher
     * @param message The interesting message
     * @param handler The handler function
     */
    public removeMessageHandler(message: string, handler: Function): void {
        let messageHandlers: Function[] = this._handlers.get(message);
        let index: number = messageHandlers ? messageHandlers.indexOf(handler) : -1;
        if (index !== -1) {
            messageHandlers.splice(index, 1);
            if (messageHandlers.length === 0) {
                this._handlers.delete(message);
            }
        }
    }

    /**
     * Dispatches a message into the message flow.
     * @param message The interesting message
     * @param callback The completion callback function
     * @param reverse Should handlers be called in reverse order
     */
    public dispatchMessage(message: string, callback: Function = null, reverse: boolean = false): void {
        let handlers: Function[] = this._handlers.get(<any>message);
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
