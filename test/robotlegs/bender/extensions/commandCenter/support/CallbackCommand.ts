// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

@injectable()
export class CallbackCommand implements ICommand {

    protected _callback: Function;

    constructor(
        @inject("Function") @named("executeCallback") callback: Function
    ) {
        this._callback = callback;
    }

    public execute(): void {
        this._callback();
    }
}
