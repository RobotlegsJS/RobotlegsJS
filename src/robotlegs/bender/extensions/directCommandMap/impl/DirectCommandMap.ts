// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject } from "inversify";

import { IContext } from "../../../framework/api/IContext";
import { IInjector } from "../../../framework/api/IInjector";

import { IClass } from "../../matching/IClass";

import { CommandPayload } from "../../commandCenter/api/CommandPayload";
import { ICommand } from "../../commandCenter/api/ICommand";
import { ICommandExecutor } from "../../commandCenter/api/ICommandExecutor";

import { CommandExecutor } from "../../commandCenter/impl/CommandExecutor";
import { CommandMappingList } from "../../commandCenter/impl/CommandMappingList";
import { NullCommandTrigger } from "../../commandCenter/impl/NullCommandTrigger";

import { IDirectCommandMap } from "../api/IDirectCommandMap";
import { IDirectCommandConfigurator } from "../dsl/IDirectCommandConfigurator";

import { DirectCommandMapper } from "./DirectCommandMapper";

/**
 * Maps commands for direct (manual) execution
 */
@injectable()
export class DirectCommandMap implements IDirectCommandMap {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mappingProcessors: any[] = [];

    private _context: IContext;

    private _executor: ICommandExecutor;

    private _mappings: CommandMappingList;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Direct Command Map
     * @param context The context that owns this map
     */
    constructor(@inject(IContext) context: IContext) {
        this._context = context;
        // Create a child injector
        let sandboxedInjector: IInjector = context.injector.createChild();
        // allow access to this specific instance in the commands
        sandboxedInjector.bind(IDirectCommandMap).toConstantValue(this);
        this._mappings = new CommandMappingList(new NullCommandTrigger(), this._mappingProcessors, context.getLogger(this));
        this._executor = new CommandExecutor(sandboxedInjector, this._mappings.removeMapping.bind(this._mappings));
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public map(commandClass: IClass<ICommand>): IDirectCommandConfigurator {
        return new DirectCommandMapper(this._executor, this._mappings, commandClass);
    }

    /**
     * @inheritDoc
     */
    public detain(command: IClass<ICommand>): void {
        this._context.detain(command);
    }

    /**
     * @inheritDoc
     */
    public release(command: IClass<ICommand>): void {
        this._context.release(command);
    }

    /**
     * @inheritDoc
     */
    public execute(payload?: CommandPayload): void {
        this._executor.executeCommands(this._mappings.getList(), payload);
    }

    /**
     * @inheritDoc
     */
    public addMappingProcessor(handler: Function): IDirectCommandMap {
        if (this._mappingProcessors.indexOf(handler) === -1) {
            this._mappingProcessors.push(handler);
        }
        return this;
    }
}
