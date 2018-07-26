// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

@injectable()
export class MethodParametersCommand implements ICommand {
    protected _reportingFunction: Function;

    constructor(
        @inject("Function")
        @named("reportingFunction")
        reportingFunction: Function
    ) {
        this._reportingFunction = reportingFunction;
    }

    public execute(message: string, code: number): void {
        if (this._reportingFunction) {
            this._reportingFunction(message);
            this._reportingFunction(code);
        }
    }
}
