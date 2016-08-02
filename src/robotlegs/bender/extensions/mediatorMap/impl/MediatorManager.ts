// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { DisplayObject } from "pixi.js";

import { IMediatorMapping } from "../api/IMediatorMapping";
import { MediatorFactory } from "./MediatorFactory";

/**
 * @private
 */
export class MediatorManager {

    /*============================================================================*/
    /* Private Static Properties                                                  */
    /*============================================================================*/

    private static UIComponentClass: FunctionConstructor;

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

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
    public addMediator(mediator: any, item: any, mapping: IMediatorMapping): void {
        var displayObject: DisplayObject = <DisplayObject>item ;

        // Watch Display Object for removal
        if (displayObject && mapping.autoRemoveEnabled)
            displayObject.on('removed', this.onRemovedFromStage, this);
            // displayObject.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);

        // Synchronize with item life-cycle
        this.initializeMediator(mediator, item);
    }

    /**
     * @private
     */
    public removeMediator(mediator: any, item: any, mapping: IMediatorMapping): void {
        if (item instanceof DisplayObject)
            (<DisplayObject>item).off('removed', this.onRemovedFromStage);
            // displayObject.removeEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);

        this.destroyMediator(mediator);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private onRemovedFromStage(event: any): void {
        this._factory.removeMediators(event);
    }

    private initializeMediator(mediator: any, mediatedItem: any): void {
        if ('preInitialize' in mediator)
            mediator.preInitialize();

        if ('viewComponent' in mediator)
            mediator.viewComponent = mediatedItem;

        if ('initialize' in mediator)
            mediator.initialize();

        if ('postInitialize' in mediator)
            mediator.postInitialize();
    }

    private destroyMediator(mediator: any): void {
        if ('preDestroy' in mediator)
            mediator.preDestroy();

        if ('destroy' in mediator)
            mediator.destroy();

        if ('viewComponent' in mediator)
            mediator.viewComponent = null;

        if ('postDestroy' in mediator)
            mediator.postDestroy();
    }
}
