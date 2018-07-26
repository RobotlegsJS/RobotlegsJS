// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject } from "inversify";

@injectable()
export class MessageReturningCommand {
    protected _message: string;

    constructor(@inject(String) message: string) {
        this._message = message;
    }

    public execute(): string {
        return this._message;
    }
}
