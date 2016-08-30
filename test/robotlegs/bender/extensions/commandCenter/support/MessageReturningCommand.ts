// ------------------------------------------------------------------------------
//  Copyright (c) 2011 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

@injectable()
export class MessageReturningCommand {

    protected _message: String;

    constructor(
        @inject(String) message: String
    ) {
        this._message = message;
    }

    public execute(): String {
        return this._message;
    }
}
