// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

@injectable()
export class EventCallbackCommand implements ICommand {
    protected _callback: Function;
    protected _event: Event;

    constructor(
        @inject("Function")
        @named("reportEvent")
        callback: Function,
        @inject(Event) event: Event
    ) {
        this._callback = callback;
        this._event = event;
    }

    public execute(): void {
        this._callback(this._event);
    }
}
