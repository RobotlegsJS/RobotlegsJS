// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { getQualifiedClassName } from "../../../framework/impl/getQualifiedClassName";

import { IClass } from "../../matching/IClass";

import { ICommand } from "../api/ICommand";

import { ICommandMapping } from "../api/ICommandMapping";

/**
 * @private
 */
export class CommandMapping implements ICommandMapping {
    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public get commandClass(): IClass<ICommand> {
        return this._commandClass;
    }

    /**
     * @inheritDoc
     */
    public get guards(): any[] {
        return this._guards;
    }

    /**
     * @inheritDoc
     */
    public get hooks(): any[] {
        return this._hooks;
    }

    /**
     * @inheritDoc
     */
    public get fireOnce(): boolean {
        return this._fireOnce;
    }

    /**
     * @inheritDoc
     */
    public get payloadInjectionEnabled(): boolean {
        return this._payloadInjectionEnabled;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _commandClass: IClass<ICommand>;
    private _guards: any[] = [];
    private _hooks: any[] = [];
    private _fireOnce: boolean = false;
    private _payloadInjectionEnabled: boolean = true;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Command Mapping
     * @param commandClass The concrete Command class
     */
    constructor(commandClass: IClass<ICommand>) {
        this._commandClass = commandClass;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public addGuards(...guards: any[]): ICommandMapping {
        this._guards = this._guards.concat.apply(this._guards, guards);
        return this;
    }

    /**
     * @inheritDoc
     */
    public addHooks(...hooks: any[]): ICommandMapping {
        this._hooks = this._hooks.concat.apply(this._hooks, hooks);
        return this;
    }

    /**
     * @inheritDoc
     */
    public setFireOnce(value: boolean): ICommandMapping {
        this._fireOnce = value;
        return this;
    }

    /**
     * @inheritDoc
     */
    public setPayloadInjectionEnabled(value: boolean): ICommandMapping {
        this._payloadInjectionEnabled = value;
        return this;
    }

    /**
     *
     */
    public toString(): string {
        return "Command " + getQualifiedClassName(this._commandClass);
    }
}
