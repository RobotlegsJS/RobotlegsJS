// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

@injectable()
export class PayloadInjectionPointsGuard {

    protected _message: String;
    protected _code: Number;
    protected _reportingFunction: Function;

    constructor(
        @inject("Function") @named("reportingFunction") reportingFunction: Function,
        @inject(String) message: String,
        @inject(Number) code: Number

    ) {
        this._reportingFunction = reportingFunction;
        this._message = message;
        this._code = code;
    }

    public approve(): boolean {
        if (this._reportingFunction) {
            this._reportingFunction(this._message);
            this._reportingFunction(this._code);
            return true;
        } else {
            return false;
        }
    }
}
