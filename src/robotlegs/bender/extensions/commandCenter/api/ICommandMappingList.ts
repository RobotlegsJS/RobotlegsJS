// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandMapping } from "./ICommandMapping";

/**
 * @private
 */
export interface ICommandMappingList {
    /**
     * Optional mapping sort function
     * @param sorter Sort function
     * @return Self
     */
    withSortFunction(sorter: Function): ICommandMappingList;

    /**
     * Sorted list of active mappings
     * @return List of mappings
     */
    getList(): ICommandMapping[];

    /**
     * Adds a mapping to the mapping list
     * @param mapping Command mapping
     */
    addMapping(mapping: ICommandMapping): void;

    /**
     * Removes a mapping from the mapping list
     * @param mapping Command mapping
     */
    removeMapping(mapping: ICommandMapping): void;

    /**
     * Removes a mapping from the mapping list using the Command class
     * @param commandClass The command class to remove the mapping for
     */
    removeMappingFor(commandClass: Object): void;

    /**
     * Removes all mappings for this command mapping list
     */
    removeAllMappings(): void;
}
