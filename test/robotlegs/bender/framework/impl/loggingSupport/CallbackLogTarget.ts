// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ILogTarget } from "../../../../../../src/robotlegs/bender/framework/api/ILogTarget";

import { LogParams } from "./LogParams";

export class CallbackLogTarget implements ILogTarget {
    protected _callback: Function;

    constructor(callback: Function) {
        this._callback = callback;
    }

    public log(source: any, level: number, timestamp: number, message: string, params: any[]): void {
        if (this._callback) {
            this._callback(new LogParams(source, level, timestamp, message, params));
        }
    }
}
