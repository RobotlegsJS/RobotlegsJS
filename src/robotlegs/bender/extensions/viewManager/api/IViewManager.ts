// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

// import PIXI = require("pixi.js");

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";
import { IViewHandler } from "./IViewHandler";

/*[Event(name="containerAdd", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/
/*[Event(name="containerRemove", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/
/*[Event(name="handlerAdd", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/
/*[Event(name="handlerRemove", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/

/**
 * The View Manager allows you to add multiple "view root" containers to a context
 */
export let IViewManager = Symbol("IViewManager");
export interface IViewManager extends IEventDispatcher {

    /**
     * A list of currently registered container
     */
    containers: any[];

    /**
     * Adds a container as a "view root" into the context
     * @param container
     */
    addContainer(container: any): void;

    /**
     * Removes a container from this context
     * @param container
     */
    removeContainer(container: any): void;

    /**
     * Registers a view handler
     * @param handler
     */
    addViewHandler(handler: IViewHandler): void;

    /**
     * Removes a view handler
     * @param handler
     */
    removeViewHandler(handler: IViewHandler): void;

    /**
     * Removes all view handlers from this context
     */
    removeAllHandlers(): void;
}
