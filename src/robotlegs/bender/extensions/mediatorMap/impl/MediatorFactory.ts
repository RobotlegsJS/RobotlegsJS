// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IInjector } from "../../../framework/api/IInjector";
import { applyHooks } from "../../../framework/impl/applyHooks";
import { guardsApprove } from "../../../framework/impl/guardsApprove";

import { IMediatorMapping } from "../api/IMediatorMapping";
import { ITypeFilter } from "../../matching/ITypeFilter";

import { MediatorManager } from "./MediatorManager";

/**
 * @private
 */
export class MediatorFactory {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mediators: Map<any, any> = new Map<any, any>();

    private _injector: IInjector;

    private _manager: MediatorManager;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(injector: IInjector, manager?: MediatorManager) {
        this._injector = injector;
        this._manager = manager || new MediatorManager(this);
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public getMediator(item: any, mapping: IMediatorMapping): any {
        return this._mediators.get(item) ? this._mediators.get(item).get(<any>mapping) : null;
    }

    /**
     * @private
     */
    public createMediators(item: any, type: FunctionConstructor, mappings: any[]): any[] {
        var createdMediators: any[] = [];
        var mediator: any;
        for (let i in mappings) {
            let mapping: IMediatorMapping = mappings[i];
            mediator = this.getMediator(item, mapping);

            if (!mediator) {
                this.mapTypeForFilterBinding(mapping.matcher, type, item);
                mediator = this.createMediator(item, mapping);
                this.unmapTypeForFilterBinding(mapping.matcher, type, item)
            }

            if (mediator)
                createdMediators.push(mediator);
        }
        return createdMediators;
    }

    /**
     * @private
     */
    public removeMediators(item: any): void {
        var mediators: Map<any, IMediatorMapping> = this._mediators.get(item);
        if (!mediators)
            return;

        for (var mapping in mediators) {
            this._manager.removeMediator(mediators[mapping], item, <any>mapping);
        }

        this._mediators.delete(item);
    }

    /**
     * @private
     */
    public removeAllMediators(): void {
        this._mediators.forEach((value, key) => this.removeMediators(key));
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private createMediator(item: any, mapping: IMediatorMapping): any {
        var mediator: any = this.getMediator(item, mapping);

        if (mediator)
            return mediator;

        if (mapping.guards.length == 0 || guardsApprove(mapping.guards, this._injector)) {
            var mediatorClass: FunctionConstructor = mapping.mediatorClass;
            mediator = this._injector.instantiateUnmapped(mediatorClass);
            if (mapping.hooks.length > 0) {
                this._injector.bind(mediatorClass).toConstantValue(mediator);
                applyHooks(mapping.hooks, this._injector);
                this._injector.unbind(mediatorClass);
            }
            this.addMediator(mediator, item, mapping);
        }
        return mediator;
    }

    private addMediator(mediator: any, item: any, mapping: IMediatorMapping): void {
        let mediatorMap = this._mediators.get(item) || new Map<any, IMediatorMapping>();
        this._mediators.set(item, mediatorMap);
        mediatorMap.set(<any>mapping, mediator);
        this._manager.addMediator(mediator, item, mapping);
    }

    private mapTypeForFilterBinding(filter: ITypeFilter, type: FunctionConstructor, item: any): void {
        let requiredTypes = this.requiredTypesFor(filter, type);
        for (let i in requiredTypes) {
            let requiredType: FunctionConstructor = requiredTypes[i];
            this._injector.bind(requiredType).toConstantValue(item);
        }
    }

    private unmapTypeForFilterBinding(filter: ITypeFilter, type: FunctionConstructor, item: any): void {
        let requiredTypes = this.requiredTypesFor(filter, type);
        for (let i in requiredTypes) {
            let requiredType: FunctionConstructor = requiredTypes[i];
            if (this._injector.isBound(requiredType))
                this._injector.unbind(requiredType);
        }
    }

    private requiredTypesFor(filter: ITypeFilter, type: FunctionConstructor): FunctionConstructor[] {
        var requiredTypes: FunctionConstructor[] = filter.allOfTypes.concat(filter.anyOfTypes);

        if (requiredTypes.indexOf(type) == -1)
            requiredTypes.push(type);

        return requiredTypes;
    }
}
