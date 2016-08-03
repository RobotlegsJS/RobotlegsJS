// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMediatorMap } from "./api/IMediatorMap";
import { MediatorMap } from "./impl/MediatorMap";

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";
import { IInjector } from "../../framework/api/IInjector";

import { IViewManager } from "../viewManager";

/**
 * This extension installs a shared IMediatorMap into the context
 */
export class MediatorMapExtension implements IExtension {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _injector: IInjector;

    private _mediatorMap: MediatorMap;

    private _viewManager: IViewManager;

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        context.beforeInitializing(this.beforeInitializing.bind(this))
            .beforeDestroying(this.beforeDestroying.bind(this))
            .whenDestroying(this.whenDestroying.bind(this));
        this._injector = context.injector;
        // this._injector.map(IMediatorMap).toSingleton(MediatorMap);
        this._injector.bind(IMediatorMap).to(MediatorMap).inSingletonScope();
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private beforeInitializing(): void {
        this._mediatorMap = this._injector.get<MediatorMap>(IMediatorMap);
        // if (this._injector.satisfiesDirectly(IViewManager)) {
        if (this._injector.isBound(IViewManager)) {
            this._viewManager = this._injector.get<IViewManager>(IViewManager);
            this._viewManager.addViewHandler(this._mediatorMap);
        }
    }

    private beforeDestroying(): void {
        this._mediatorMap.unmediateAll();
        // if (this._injector.satisfiesDirectly(IViewManager)) {
        if (this._injector.isBound(IViewManager)) {
            this._viewManager = this._injector.get<IViewManager>(IViewManager);
            this._viewManager.removeViewHandler(this._mediatorMap);
        }
    }

    private whenDestroying(): void {
        // if (this._injector.satisfiesDirectly(IMediatorMap)) {
        if (this._injector.isBound(IMediatorMap)) {
            this._injector.unbind(IMediatorMap);
        }
    }
}
