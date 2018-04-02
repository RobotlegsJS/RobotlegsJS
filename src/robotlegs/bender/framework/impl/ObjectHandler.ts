// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../api/IMatcher";

export class ObjectHandler {
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
