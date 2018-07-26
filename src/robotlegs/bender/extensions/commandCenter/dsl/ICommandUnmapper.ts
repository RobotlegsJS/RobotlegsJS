// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IClass } from "../../matching/IClass";

import { ICommand } from "../api/ICommand";

/**
 * @private
 */
export interface ICommandUnmapper {
    /**
     * Unmaps a Command
     * @param commandClass Command to unmap
     */
    fromCommand(commandClass: IClass<ICommand>): void;

    /**
     * Unmaps all commands from this trigger
     */
    fromAll(): void;
}
