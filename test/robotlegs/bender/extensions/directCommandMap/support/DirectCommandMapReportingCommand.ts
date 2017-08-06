// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

import { IDirectCommandMap } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/api/IDirectCommandMap";

@injectable()
export class DirectCommandMapReportingCommand implements ICommand {

    protected _directCommandMap: IDirectCommandMap;
    protected _reportingFunction: Function;

    constructor(
        @inject(IDirectCommandMap) directCommandMap: IDirectCommandMap,
        @inject("Function") @named("reportingFunction") reportingFunction: Function
    ) {
        this._directCommandMap = directCommandMap;
        this._reportingFunction = reportingFunction;
    }

    public execute(): void {
        this._reportingFunction(this._directCommandMap);
    }
}
