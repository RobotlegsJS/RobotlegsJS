// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { IConfig } from "../../../../../../src/robotlegs/bender/framework/api/IConfig";

@injectable()
export class TypedConfig implements IConfig {

    protected _callback: Function;

    constructor(
        @inject("Function") @named("callback") callback: Function
    ) {
        this._callback = callback;
    }

    public configure(): void {
        this._callback(this);
    }
}
