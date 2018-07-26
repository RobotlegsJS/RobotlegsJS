// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

export class BaseType {
    private _content: string;

    constructor(content: string) {
        this._content = content;
    }

    public get content(): string {
        return this._content;
    }
}
