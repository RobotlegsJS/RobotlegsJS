// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

@injectable()
export class ExecutelessCommand {
    protected _reportingFunction: Function;

    constructor(
        @inject("Function")
        @named("reportingFunction")
        reportingFunction: Function
    ) {
        this._reportingFunction = reportingFunction;
        this._reportingFunction(ExecutelessCommand);
    }
}
