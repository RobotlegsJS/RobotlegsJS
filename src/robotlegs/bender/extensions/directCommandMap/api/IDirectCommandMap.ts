// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IDirectCommandMapper } from "./IDirectCommandMapper";

/**
 * Maps commands for direct (manual) execution
 */
export let IDirectCommandMap = Symbol("IDirectCommandMap");
export interface IDirectCommandMap extends IDirectCommandMapper {

    /**
     * Pins a command in memory
     * @param command the command instance to pin
     */
    detain(command: Object): void;

    /**
     * Unpins a command instance from memory
     * @param command the command instance to unpin
     */
    release(command: Object): void;

    /**
     * Adds a handler to process mappings
     * @param handler Function that accepts a mapping
     * @return Self
     */
    addMappingProcessor(handler: Function): IDirectCommandMap;
}
