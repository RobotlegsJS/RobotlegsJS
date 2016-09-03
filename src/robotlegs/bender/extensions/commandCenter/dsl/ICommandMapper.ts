// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandConfigurator } from "./ICommandConfigurator";

/**
 * @private
 */
export interface ICommandMapper {
    /**
     * Creates a command mapping
     * @param commandClass The Command Class to map
     * @return Mapping configurator
     */
    toCommand(commandClass: Object): ICommandConfigurator;
}
