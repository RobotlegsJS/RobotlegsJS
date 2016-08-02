// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandMapping } from "../api/ICommandMapping";
import { ICommandMappingList } from "../api/ICommandMappingList";
import { ICommandTrigger } from "../api/ICommandTrigger";

import { ILogger } from "../../../framework/api/ILogger";

type CommandMappingCompareFunction = (a: ICommandMapping, b: ICommandMapping) => number;

/**
 * @private
 */
export class CommandMappingList implements ICommandMappingList {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mappingsByCommand: Map<Object, ICommandMapping> = new Map<Object, ICommandMapping>();

    private _mappings: ICommandMapping[] = [];

    private _trigger: ICommandTrigger;

    private _processors: Function[];

    private _logger: ILogger;

    private _compareFunction: CommandMappingCompareFunction;

    private _sorted: boolean;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Create a command mapping list
     * @param trigger The trigger that owns this list
     * @param processors A reference to the mapping processors for this command map
     * @param logger Optional logger
     */
    constructor(trigger: ICommandTrigger, processors: Function[], logger: ILogger = null) {
        this._trigger = trigger;
        this._processors = processors;
        this._logger = logger;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public getList(): ICommandMapping[] {
        this._sorted || this.sortMappings();
        return this._mappings.concat();
    }

    /**
     * @inheritDoc
     */
    public withSortFunction(sorter: CommandMappingCompareFunction): ICommandMappingList {
        this._sorted = false;
        this._compareFunction = sorter;
        return this;
    }

    /**
     * @inheritDoc
     */
    public addMapping(mapping: ICommandMapping): void {
        this._sorted = false;
        this.applyProcessors(mapping);
        let oldMapping: ICommandMapping = this._mappingsByCommand[<any>mapping.commandClass];
        if (oldMapping) {
            this.overwriteMapping(oldMapping, mapping);
        }
        else {
            this.storeMapping(mapping);
            this._mappings.length === 1 && this._trigger.activate();
        }
    }

    /**
     * @inheritDoc
     */
    public removeMapping(mapping: ICommandMapping): void {
        if (this._mappingsByCommand[<any>mapping.commandClass]) {
            this.deleteMapping(mapping);
            this._mappings.length === 0 && this._trigger.deactivate();
        }
    }

    /**
     * @inheritDoc
     */
    public removeMappingFor(commandClass: Object): void {
        let mapping: ICommandMapping = this._mappingsByCommand[<any>commandClass];
        mapping && this.removeMapping(mapping);
    }

    /**
     * @inheritDoc
     */
    public removeAllMappings(): void {
        if (this._mappings.length > 0) {
            let list: ICommandMapping[] = this._mappings.concat();
            let length: number = list.length;
            while (length--) {
                this.deleteMapping(list[length]);
            }
            this._trigger.deactivate();
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private storeMapping(mapping: ICommandMapping): void {
        this._mappingsByCommand[<any>mapping.commandClass] = mapping;
        this._mappings.push(mapping);
        this._logger && this._logger.debug("{0} mapped to {1}", [this._trigger, mapping]);
    }

    private deleteMapping(mapping: ICommandMapping): void {
        delete this._mappingsByCommand[<any>mapping.commandClass];
        this._mappings.splice(this._mappings.indexOf(mapping), 1);
        this._logger && this._logger.debug("{0} unmapped from {1}", [this._trigger, mapping]);
    }

    private overwriteMapping(oldMapping: ICommandMapping, newMapping: ICommandMapping): void {
        this._logger && this._logger.warn("{0} already mapped to {1}\n" +
                                          "If you have overridden this mapping intentionally you can use 'unmap()' " +
                                          "prior to your replacement mapping in order to avoid seeing this message.\n",
        [this._trigger, oldMapping]);
        this.deleteMapping(oldMapping);
        this.storeMapping(newMapping);
    }

    private sortMappings(): void {
        if (this._compareFunction != null) {
            this._mappings = this._mappings.sort(this._compareFunction);
        }
        this._sorted = true;
    }

    private applyProcessors(mapping: ICommandMapping): void {
        for (let i in this._processors) {
            let processor: Function = this._processors[i];
            processor(mapping);
        }
    }
}
