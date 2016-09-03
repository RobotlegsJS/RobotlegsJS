// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { instanceOfType } from "../matching/instanceOfType";

import { ContextView } from "./ContextView";

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";
import { IInjector } from "../../framework/api/IInjector";
import { ILogger } from "../../framework/api/ILogger";

import { applyPixiPatch } from "./pixiPatch";

/**
 * <p>This Extension waits for a ContextView to be added as a configuration
 * and maps it into the context's injector.</p>
 *
 * <p>It should be installed before context initialization.</p>
 */
export class ContextViewExtension implements IExtension {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _injector: IInjector;

    private _logger: ILogger;

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        this._injector = context.injector;
        this._logger = context.getLogger(this);
        context.beforeInitializing(this.beforeInitializing.bind(this));
        context.addConfigHandler(instanceOfType(ContextView), this.handleContextView.bind(this));
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private handleContextView(contextView: ContextView): void {
        if (this._injector.isBound(ContextView)) {
            this._logger.warn('A contextView has already been installed, ignoring {0}', [contextView.view]);
        }
        else {
            this._logger.debug("Mapping {0} as contextView", [contextView.view]);

            applyPixiPatch(contextView.view);

            // this._injector.map(ContextView).toValue(contextView);
            this._injector.bind(ContextView).toConstantValue(contextView);
        }
    }

    private beforeInitializing(): void {
        if (!this._injector.isBound(ContextView)) {
            this._logger.error("A ContextView must be installed if you install the ContextViewExtension.");
        }
    }
}
