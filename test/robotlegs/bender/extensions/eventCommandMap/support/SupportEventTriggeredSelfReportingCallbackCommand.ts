// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named, optional } from "inversify";

import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

import { SupportEvent } from "./SupportEvent";

@injectable()
export class SupportEventTriggeredSelfReportingCallbackCommand implements ICommand {
    @inject(Event)
    @optional()
    public untypedEvent: Event;

    @inject(SupportEvent)
    @optional()
    public typedEvent: SupportEvent;

    @inject("Function")
    @named("executeCallback")
    public callback: Function;

    public execute(): void {
        this.callback(this);
    }
}
