// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { CommandPayload } from "../../commandCenter/api/CommandPayload";
import { IDirectCommandConfigurator } from "../dsl/IDirectCommandConfigurator";

/**
 * @private
 */
export interface IDirectCommandMapper {

    /**
     * Creates a mapping for a command class
     * @param commandClass The concrete Command class
     * @return Mapping configurator
     */
    map(commandClass: Object): IDirectCommandConfigurator;

    /**
     * Execute the configured command(s)
     * @param payload The Command Payload
     */
    execute(payload?: CommandPayload): void;
}
