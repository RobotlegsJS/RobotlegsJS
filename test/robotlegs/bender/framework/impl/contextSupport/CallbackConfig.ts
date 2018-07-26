// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IConfig } from "../../../../../../src/robotlegs/bender/framework/api/IConfig";

export class CallbackConfig implements IConfig {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _callback: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    constructor(callback: Function) {
        this._callback = callback;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    public configure(): void {
        this._callback();
    }
}
