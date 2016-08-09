// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ILogger } from "../../../framework/api/ILogger";
import { ITypeFilter } from "../../matching/ITypeFilter";

import { IMediatorMapping } from "../api/IMediatorMapping";
import { IMediatorConfigurator } from "../dsl/IMediatorConfigurator";
import { IMediatorMapper } from "../dsl/IMediatorMapper";
import { IMediatorUnmapper } from "../dsl/IMediatorUnmapper";

import { MediatorViewHandler } from "./MediatorViewHandler";
import { MediatorMapping } from "./MediatorMapping";

/**
 * @private
 */
export class MediatorMapper implements IMediatorMapper, IMediatorUnmapper {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mappings: Map<any, IMediatorMapping> = new Map<any, IMediatorMapping>();

    private _typeFilter: ITypeFilter;

    private _handler: MediatorViewHandler;

    private _logger: ILogger;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(typeFilter: ITypeFilter, handler: MediatorViewHandler, logger?: ILogger) {
        this._typeFilter = typeFilter;
        this._handler = handler;
        this._logger = logger;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public toMediator(mediatorClass: any): IMediatorConfigurator {
        var mapping: IMediatorMapping = this._mappings[<any>mediatorClass];
        return mapping
            ? this.overwriteMapping(mapping)
            : this.createMapping(mediatorClass);
    }

    /**
     * @inheritDoc
     */
    public fromMediator(mediatorClass: any): void {
        var mapping: IMediatorMapping = this._mappings[<any>mediatorClass];
        mapping && this.deleteMapping(mapping);
    }

    /**
     * @inheritDoc
     */
    public fromAll(): void {
        for (let i in this._mappings) {
            let mapping: IMediatorMapping = this._mappings[i];
            this.deleteMapping(mapping);
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private createMapping(mediatorClass: any): MediatorMapping {
        var mapping: MediatorMapping = new MediatorMapping(this._typeFilter, mediatorClass);
        this._handler.addMapping(mapping);
        this._mappings[<any>mediatorClass] = mapping;
        this._logger && this._logger.debug('{0} mapped to {1}', [this._typeFilter, mapping]);
        return mapping;
    }

    private deleteMapping(mapping: IMediatorMapping): void {
        this._handler.removeMapping(mapping);
        delete this._mappings[<any>mapping.mediatorClass];
        this._logger && this._logger.debug('{0} unmapped from {1}', [this._typeFilter, mapping]);
    }

    private overwriteMapping(mapping: IMediatorMapping): IMediatorConfigurator {
        this._logger && this._logger.warn('{0} already mapped to {1}\n' +
            'If you have overridden this mapping intentionally you can use "unmap()" ' +
            'prior to your replacement mapping in order to avoid seeing this message.\n',
            [this._typeFilter, mapping]);
        this.deleteMapping(mapping);
        return this.createMapping(mapping.mediatorClass);
    }
}
