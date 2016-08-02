// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

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
    public get commandClass(): Object {
        return this._commandClass;
    }

    /**
     * @inheritDoc
     */
    public get executeMethod(): string {
        return this._executeMethod;
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

    private _commandClass: Object;
    private _executeMethod: string = "execute";
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
    constructor(commandClass: Object) {
        this._commandClass = commandClass;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public setExecuteMethod(name: string): ICommandMapping {
        this._executeMethod = name;
        return this;
    }

    /**
     * @inheritDoc
     */
    public addGuards(...guards: any[]): ICommandMapping {
        this._guards = this._guards.concat(guards);
        return this;
    }

    /**
     * @inheritDoc
     */
    public addHooks(...hooks: any[]): ICommandMapping {
        this._hooks = this._hooks.concat(hooks);
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

    public toString(): string {
        return "Command " + this._commandClass;
    }
}
