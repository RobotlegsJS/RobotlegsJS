// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable } from "inversify";

import { CommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapping";

@injectable()
export class PriorityMapping extends CommandMapping {

    protected _priority: number;

    constructor(commandClass: Object, priority: number) {
        super(commandClass);
        this._priority = priority;
    }

    public get priority(): number {
        return this._priority;
    }
}
