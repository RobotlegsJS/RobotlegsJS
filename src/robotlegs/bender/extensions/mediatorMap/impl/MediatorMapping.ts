// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IGuard } from "../../../framework/api/IGuard";
import { IHook } from "../../../framework/api/IHook";

import { ITypeFilter } from "../../matching/ITypeFilter";

import { IMediatorMapping } from "../api/IMediatorMapping";
import { IMediatorConfigurator } from "../dsl/IMediatorConfigurator";

/**
 * @private
 */
export class MediatorMapping implements IMediatorMapping, IMediatorConfigurator {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _matcher: ITypeFilter;

    /**
     * @inheritDoc
     */
    public get matcher(): ITypeFilter {
        return this._matcher;
    }

    private _mediatorClass: FunctionConstructor;

    /**
     * @inheritDoc
     */
    public get mediatorClass(): FunctionConstructor {
        return this._mediatorClass;
    }

    private _guards: IGuard[] = [];

    /**
     * @inheritDoc
     */
    public get guards(): IGuard[] {
        return this._guards;
    }

    private _hooks: IHook[] = [];

    /**
     * @inheritDoc
     */
    public get hooks(): IHook[] {
        return this._hooks;
    }

    private _autoRemoveEnabled: boolean = true;

    /**
     * @inheritDoc
     */
    public get autoRemoveEnabled(): boolean {
        return this._autoRemoveEnabled;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(matcher: ITypeFilter, mediatorClass: FunctionConstructor) {
        this._matcher = matcher;
        this._mediatorClass = mediatorClass;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public withGuards(...guards: IGuard[]): IMediatorConfigurator {
        this._guards = this._guards.concat.apply(null, guards);
        return this;
    }

    /**
     * @inheritDoc
     */
    public withHooks(...hooks: IHook[]): IMediatorConfigurator {
        this._hooks = this._hooks.concat.apply(null, hooks);
        return this;
    }

    /**
     * @inheritDoc
     */
    public autoRemove(value: boolean = true): IMediatorConfigurator {
        this._autoRemoveEnabled = value;
        return this;
    }
}
