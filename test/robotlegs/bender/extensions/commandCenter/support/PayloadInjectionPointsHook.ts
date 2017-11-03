// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

@injectable()
export class PayloadInjectionPointsHook {
    protected _message: string;
    protected _code: number;
    protected _reportingFunction: Function;

    constructor(
        @inject("Function")
        @named("reportingFunction")
        reportingFunction: Function,
        @inject(String) message: string,
        @inject(Number) code: number
    ) {
        this._reportingFunction = reportingFunction;
        this._message = message;
        this._code = code;
    }

    public hook(): void {
        if (this._reportingFunction) {
            this._reportingFunction(this._message);
            this._reportingFunction(this._code);
        }
    }
}
