// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IClass } from "../../matching/IClass";

import { ICommand } from "../api/ICommand";
import { ICommandMapping } from "../api/ICommandMapping";
import { ICommandMappingList } from "../api/ICommandMappingList";

import { ICommandMapper } from "../dsl/ICommandMapper";
import { ICommandUnmapper } from "../dsl/ICommandUnmapper";
import { ICommandConfigurator } from "../dsl/ICommandConfigurator";

import { CommandMapping } from "./CommandMapping";

/**
 * @private
 */
export class CommandMapper implements ICommandMapper, ICommandUnmapper, ICommandConfigurator {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mappings: ICommandMappingList;

    private _mapping: ICommandMapping;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Command Mapper
     * @param mappings The command mapping list to add mappings to
     */
    constructor(mappings: ICommandMappingList) {
        this._mappings = mappings;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public toCommand(commandClass: IClass<ICommand>): ICommandConfigurator {
        this._mapping = new CommandMapping(commandClass);
        this._mappings.addMapping(this._mapping);
        return this;
    }

    /**
     * @inheritDoc
     */
    public fromCommand(commandClass: IClass<ICommand>): void {
        this._mappings.removeMappingFor(commandClass);
    }

    /**
     * @inheritDoc
     */
    public fromAll(): void {
        this._mappings.removeAllMappings();
    }

    /**
     * @inheritDoc
     */
    public once(value: boolean = true): ICommandConfigurator {
        this._mapping.setFireOnce(value);
        return this;
    }

    /**
     * @inheritDoc
     */
    public withGuards(...guards: any[]): ICommandConfigurator {
        this._mapping.addGuards(...guards);
        return this;
    }

    /**
     * @inheritDoc
     */
    public withHooks(...hooks: any[]): ICommandConfigurator {
        this._mapping.addHooks(...hooks);
        return this;
    }

    /**
     * @inheritDoc
     */
    public withPayloadInjection(value: boolean = true): ICommandConfigurator {
        this._mapping.setPayloadInjectionEnabled(value);
        return this;
    }
}
