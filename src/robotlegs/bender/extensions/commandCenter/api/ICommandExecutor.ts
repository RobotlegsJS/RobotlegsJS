// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandMapping } from "./ICommandMapping";
import { CommandPayload } from "./CommandPayload";

/**
 * @private
 */
export interface ICommandExecutor {
    /**
     * Execute a command for a given mapping
     * @param mapping The Command Mapping
     * @param payload The Command Payload
     */
    executeCommand(mapping: ICommandMapping, payload?: CommandPayload): void;

    /**
     * Execute a list of commands for a given list of mappings
     * @param mappings The Command Mappings
     * @param payload The Command Payload
     */
    executeCommands(
        mappings: ICommandMapping[],
        payload?: CommandPayload
    ): void;
}
