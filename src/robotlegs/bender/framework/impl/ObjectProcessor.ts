// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../api/IMatcher";

import { ObjectHandler } from "./ObjectHandler";

/**
 * Robotlegs object processor
 *
 * @private
 */
export class ObjectProcessor {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _handlers: ObjectHandler[] = [];

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Add a handler to process objects that match a given matcher.
     * @param matcher The matcher
     * @param handler The handler function
     */
    public addObjectHandler(matcher: IMatcher, handler: Function): void {
        this._handlers.push(new ObjectHandler(matcher, handler));
    }

    /**
     * Process an object by running it through all registered handlers
     * @param object The object instance to process.
     */
    public processObject(object: any): void {
        this._handlers.forEach((handler: ObjectHandler) => {
            handler.handle(object);
        });
    }

    /**
     * Removes all handlers
     */
    public removeAllHandlers(): void {
        this._handlers = [];
    }
}
