// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMediatorMapping } from "../api/IMediatorMapping";
import { IViewHandler } from "../../viewManager/api/IViewHandler";

import { MediatorFactory } from "./MediatorFactory";

/**
 * @private
 */
export class MediatorViewHandler implements IViewHandler {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mappings: IMediatorMapping[] = [];

    private _knownMappings: Map<FunctionConstructor, IMediatorMapping[]> = new Map<FunctionConstructor, IMediatorMapping[]>();

    private _factory: MediatorFactory;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(factory: MediatorFactory) {
        this._factory = factory;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public addMapping(mapping: IMediatorMapping): void {
        var index: number = this._mappings.indexOf(mapping);
        if (index > -1)
            return;
        this._mappings.push(mapping);
        this.flushCache();
    }

    /**
     * @private
     */
    public removeMapping(mapping: IMediatorMapping): void {
        var index: number = this._mappings.indexOf(mapping);
        if (index == -1)
            return;
        this._mappings.splice(index, 1);
        this.flushCache();
    }

    /**
     * @private
     */
    public handleView(view: any, type: FunctionConstructor): void {
        var interestedMappings = this.getInterestedMappingsFor(view, type);
        if (interestedMappings)
            this._factory.createMediators(view, type, interestedMappings);
    }

    /**
     * @private
     */
    public handleItem(item: Object, type: FunctionConstructor): void {
        var interestedMappings = this.getInterestedMappingsFor(item, type);
        if (interestedMappings)
            this._factory.createMediators(item, type, interestedMappings);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private flushCache(): void {
        this._knownMappings = new Map<FunctionConstructor, IMediatorMapping[]>();
    }

    private getInterestedMappingsFor(item: Object, type: any): IMediatorMapping[] {
        var mapping: IMediatorMapping;

        // we've seen this type before and nobody was interested
        if (this._knownMappings[type] === false)
            return null;

        // we haven't seen this type before
        if (this._knownMappings[type] == undefined) {
            this._knownMappings[type] = false;
            for (let i in this._mappings) {
                let mapping: IMediatorMapping = this._mappings[i];
                if (mapping.matcher.matches(item)) {
                    if (!this._knownMappings[type])
                        this._knownMappings[type] = [];
                    this._knownMappings[type].push(mapping);
                }
            }
            // nobody cares, let's get out of here
            if (this._knownMappings[type] === false)
                return null;
        }

        // these mappings really do care
        return this._knownMappings[type];
    }
}
