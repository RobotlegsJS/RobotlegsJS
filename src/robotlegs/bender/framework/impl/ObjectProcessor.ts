// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher} from "../api/IMatcher";

/**
 * Robotlegs object processor
 *
 * @private
 */
export class ObjectProcessor {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _handlers: any[] = [];

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
        for (let i: number = 0; i < this._handlers.length; i++) {
            let handler: ObjectHandler = this._handlers[i];
            handler.handle(object);
        }
    }

    /**
     * Removes all handlers
     */
    public removeAllHandlers(): void {
        this._handlers.length = 0;
    }
}

class ObjectHandler {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _matcher: IMatcher;

    private _handler: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(matcher: IMatcher, handler: Function) {
        this._matcher = matcher;
        this._handler = handler;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public handle(object: any): void {
        if (this._matcher.matches(object)) {
            this._handler(object);
        }
    }
}
