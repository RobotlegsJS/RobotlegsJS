// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../../../../../../src/robotlegs/bender/framework/api/IMatcher";
import { instanceOfType } from "../../../../../../src/robotlegs/bender/extensions/matching/instanceOfType";

export class TypeCollection {
    private _type: Function;
    private _subTypeOf: Function[];
    private _items: any[];

    constructor(type: Function, subTypeOf: Function[], items: any[]) {
        this._type = type;
        this._subTypeOf = subTypeOf;
        this._items = items;
    }

    public get matcher(): IMatcher {
        return instanceOfType(this._type);
    }

    public get type(): Function {
        return this._type;
    }

    public get matchWith(): Function[] {
        return this._subTypeOf.concat(this._type);
    }

    public get items(): any[] {
        return this._items;
    }
}
