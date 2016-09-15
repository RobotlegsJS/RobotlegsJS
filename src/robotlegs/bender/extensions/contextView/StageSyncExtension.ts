// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { instanceOfType } from "../matching/instanceOfType";

import { ContextView } from "./ContextView"

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";
import { ILogger } from "../../framework/api/ILogger";

/**
 * <p>This Extension waits for a ContextView to be added as a configuration,
 * and initializes and destroys the context based on the contextView's stage presence.</p>
 *
 * <p>It should be installed before context initialization.</p>
 */
export class StageSyncExtension implements IExtension {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _context: IContext;

    private _contextView: any;

    private _logger: ILogger;

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        this._context = context;
        this._logger = context.getLogger(this);
        this._context.addConfigHandler(instanceOfType(ContextView), this.handleContextView.bind(this));
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private handleContextView(contextView: ContextView): void {
        if (this._contextView) {
            this._logger.warn("A contextView has already been installed, ignoring {0}", [contextView.view]);
            return;
        }
        this._contextView = contextView.view;
        if (this._contextView.stage) {
            this.initializeContext();
        } else {
            this._logger.debug("Context view is not yet on stage. Waiting...");
            // this._contextView.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
        }
    }

    private onAddedToStage(event: Event): void {
        // this._contextView.removeEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
        this.initializeContext();
    }

    private initializeContext(): void {
        this._logger.debug("Context view is now on stage. Initializing context...");
        this._context.initialize();
        // this._contextView.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
    }

    private onRemovedFromStage(event: Event): void {
        this._logger.debug("Context view has left the stage. Destroying context...");
        // this._contextView.removeEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
        this._context.destroy();
    }
}
