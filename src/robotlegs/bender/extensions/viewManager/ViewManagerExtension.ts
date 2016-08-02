// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";
import { IInjector } from "../../framework/api/IInjector";
import { ILogger } from "../../framework/api/ILogger";

import { IViewManager } from "../viewManager/api/IViewManager";
import { ViewManager } from "../viewManager/impl/ViewManager";

import { ContainerRegistry } from "./impl/ContainerRegistry";

/**
 * This extension install a View Manager into the context
 */
export class ViewManagerExtension implements IExtension {

    /*============================================================================*/
    /* Private Static Properties                                                  */
    /*============================================================================*/

    // Really? Yes, there can be only one.
    private static _containerRegistry: ContainerRegistry;

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _injector: IInjector;

    private _viewManager: IViewManager;

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        context.whenInitializing(this.whenInitializing.bind(this));
        context.whenDestroying(this.whenDestroying.bind(this));

        this._injector = context.injector;

        // Just one Container Registry
        ViewManagerExtension._containerRegistry = ViewManagerExtension._containerRegistry || new ContainerRegistry();
        this._injector.bind(ContainerRegistry).toConstantValue(ViewManagerExtension._containerRegistry);

        // But you get your own View Manager
        this._injector.bind(IViewManager).to(ViewManager).inSingletonScope();
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private whenInitializing(): void {
        console.log("initializing ViewManagerExtension");
        this._viewManager = this._injector.get<IViewManager>(IViewManager);
    }

    private whenDestroying(): void {
        this._viewManager.removeAllHandlers();
        this._injector.unbind(IViewManager);
        this._injector.unbind(ContainerRegistry);
    }
}
