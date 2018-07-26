// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { BaseType } from "./BaseType";

export class ExtendedType extends BaseType {
    private _data: number;

    constructor(content: string, data: number) {
        super(content);
        this._data = data;
    }

    public get data(): number {
        return this._data;
    }
}
