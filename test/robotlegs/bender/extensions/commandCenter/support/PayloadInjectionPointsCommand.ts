// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

@injectable()
export class PayloadInjectionPointsCommand {

    protected _message: String;
    protected _code: Number;
    protected _reportingFunc: Function;

    constructor(
        @inject("Function") @named("reportingFunc") reportingFunc: Function,
        @inject(String) message: String,
        @inject(Number) code: Number

    ) {
        this._reportingFunc = reportingFunc;
        this._message = message;
        this._code = code;
    }

    public execute(): void {
        if (this._reportingFunc) {
            this._reportingFunc(this._message);
            this._reportingFunc(this._code);
        }
    }
}
