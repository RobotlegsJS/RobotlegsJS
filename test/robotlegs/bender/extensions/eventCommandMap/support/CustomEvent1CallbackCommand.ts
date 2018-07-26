// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

import { CustomEvent1 } from "./CustomEvent1";

@injectable()
export class CustomEvent1CallbackCommand implements ICommand {
    protected _callback: Function;
    protected _event: CustomEvent1;

    constructor(
        @inject("Function")
        @named("reportEvent")
        callback: Function,
        @inject(CustomEvent1) event: CustomEvent1
    ) {
        this._callback = callback;
        this._event = event;
    }

    public execute(): void {
        this._callback(this._event);
    }
}
