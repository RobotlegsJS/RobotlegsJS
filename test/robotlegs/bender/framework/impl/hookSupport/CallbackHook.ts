// ------------------------------------------------------------------------------
//  Copyright (c) 2011 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject, named } from "inversify";

import { IHook } from "../../../../../../src/robotlegs/bender/framework/api/IHook";

@injectable()
export class CallbackHook implements IHook {

    private _callback: Function;

    constructor( @inject("Function") @named("hookCallback") callback: Function) {
        this._callback = callback;
    }

    public hook(): void {
        if (this._callback) {
            this._callback();
        }
    }
}
