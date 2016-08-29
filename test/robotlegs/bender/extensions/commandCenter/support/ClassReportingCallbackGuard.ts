// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

@injectable()
export class ClassReportingCallbackGuard {

    protected _reportingFunc: Function;

    constructor(
        @inject("Function") @named("reportingFunc") reportingFunc: Function
    ) {
        this._reportingFunc = reportingFunc;
    }

    public approve(): boolean {
        if (this._reportingFunc) {
            this._reportingFunc(ClassReportingCallbackGuard);
        }
        return true;
    }
}
