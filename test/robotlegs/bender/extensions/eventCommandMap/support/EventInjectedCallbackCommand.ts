// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";

@injectable()
export class EventInjectedCallbackCommand implements ICommand {
    protected _callback: Function;
    protected _event: Event;

    constructor(
        @inject("Function")
        @named("executeCallback")
        callback: Function,
        @inject(Event) event: Event
    ) {
        this._callback = callback;
        this._event = event;
    }

    public execute(): void {
        this._callback(this);
    }

    public get event(): Event {
        return this._event;
    }
}
