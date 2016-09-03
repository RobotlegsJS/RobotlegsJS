// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

@injectable()
export class ClassReportingCallbackCommand2 implements ICommand {

    protected _reportingFunc: Function;

    constructor(
        @inject("Function") @named("reportingFunc") reportingFunc: Function
    ) {
        this._reportingFunc = reportingFunc;
    }

    public execute(): void {
        if (this._reportingFunc) {
            this._reportingFunc(ClassReportingCallbackCommand2);
        }
    }
}
