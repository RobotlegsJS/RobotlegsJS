// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { IExtension } from "../../../../../../src/robotlegs/bender/framework/api/IExtension";
import { safelyCallBack } from "../../../../../../src/robotlegs/bender/framework/impl/safelyCallback";

export class CallbackExtension implements IExtension {

    public static staticCallback: Function;

    private _callback: Function;

    constructor(callback?: Function) {
        if (!callback) {
            this._callback = CallbackExtension.staticCallback;
        } else {
            this._callback = callback;
        }
    }

    public extend(context: IContext): void {
        if (this._callback) {
            safelyCallBack(this._callback, null, context);
        }
    }
}
