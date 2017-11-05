// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../../../../../../src/robotlegs/bender/framework/api/IMatcher";
import { IType } from "../../../../../../src/robotlegs/bender/extensions/matching/IType";
import { instanceOfType } from "../../../../../../src/robotlegs/bender/extensions/matching/instanceOfType";

export class TypeCollection<T> {
    private _type: IType<T>;
    private _subTypeOf: Array<IType<any>>;
    private _items: any[];

    constructor(type: IType<T>, subTypeOf: Array<IType<any>>, items: any[]) {
        this._type = type;
        this._subTypeOf = subTypeOf;
        this._items = items;
    }

    public get matcher(): IMatcher {
        return instanceOfType<T>(this._type);
    }

    public get type(): IType<T> {
        return this._type;
    }

    public get matchWith(): Array<IType<any>> {
        return this._subTypeOf.concat(this._type);
    }

    public get items(): any[] {
        return this._items;
    }
}
