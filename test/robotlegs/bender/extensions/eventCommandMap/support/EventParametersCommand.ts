// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

import { SupportEvent } from "./SupportEvent";

@injectable()
export class EventParametersCommand implements ICommand {
    protected _callback: Function;

    constructor(
        @inject("Function")
        @named("executeCallback")
        callback: Function
    ) {
        this._callback = callback;
    }

    public execute(event: SupportEvent): void {
        this._callback(event);
    }
}
