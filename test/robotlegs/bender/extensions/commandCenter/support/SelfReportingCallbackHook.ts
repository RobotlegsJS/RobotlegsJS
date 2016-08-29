// ------------------------------------------------------------------------------
//  Copyright (c) 2011 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { SelfReportingCallbackCommand } from "./SelfReportingCallbackCommand";

@injectable()
export class SelfReportingCallbackHook {

    protected _callback: Function;
    protected _command: SelfReportingCallbackCommand;

    constructor(
        @inject("Function") @named("hookCallback") callback: Function,
        @inject(SelfReportingCallbackCommand) command: SelfReportingCallbackCommand
    ) {
        this._callback = callback;
        this._command = command;
    }

    public hook(): void {
        this._callback(this);
    }

    public get command(): SelfReportingCallbackCommand {
        return this._command;
    }
}
