// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable } from "inversify";

import { IViewHandler } from "../api/IViewHandler";
import { IViewManager } from "../api/IViewManager";

import { EventDispatcher } from "../../../events/impl/EventDispatcher";
import { ViewManagerEvent } from "./ViewManagerEvent";

import { ContainerRegistry } from "../impl/ContainerRegistry";
import { ContainerBinding } from "../impl/ContainerBinding";

/*[Event(name="containerAdd", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/
/*[Event(name="containerRemove", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/
/*[Event(name="handlerAdd", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/
/*[Event(name="handlerRemove", type="robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent")]*/

/**
 * @private
 */
@injectable()
export class ViewManager extends EventDispatcher implements IViewManager {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _containers: any[] = [];

    /**
     * @inheritDoc
     */
    public get containers(): any[] {
        return this._containers;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _handlers: IViewHandler[] = [];

    private _registry: ContainerRegistry;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(containerRegistry: ContainerRegistry) {
        super();
        this._registry = containerRegistry;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public addContainer(container: any): void {
        if (!this.validContainer(container))
            return;

        console.log("addContainer: ", container);

        this._containers.push(container);

        for (let i in this._handlers) {
            let handler: IViewHandler = this._handlers[i];
            this._registry.addContainer(container).addHandler(handler);
        }
        this.dispatchEvent(new ViewManagerEvent(ViewManagerEvent.CONTAINER_ADD, container));
    }

    /**
     * @inheritDoc
     */
    public removeContainer(container: any): void {
        var index: number = this._containers.indexOf(container);
        if (index == -1)
            return;

        this._containers.splice(index, 1);

        var binding: ContainerBinding = this._registry.getBinding(container);
        for (let i in this._handlers) {
            let handler: IViewHandler = this._handlers[i];
            binding.removeHandler(handler);
        }
        this.dispatchEvent(new ViewManagerEvent(ViewManagerEvent.CONTAINER_REMOVE, container));
    }

    /**
     * @inheritDoc
     */
    public addViewHandler(handler: IViewHandler): void {
        if (this._handlers.indexOf(handler) != -1)
            return;

        this._handlers.push(handler);

        for (let i in this._containers) {
            let container: any = this._containers[i];
            this._registry.addContainer(container).addHandler(handler);
        }
        this.dispatchEvent(new ViewManagerEvent(ViewManagerEvent.HANDLER_ADD, null, handler));
    }

    /**
     * @inheritDoc
     */
    public removeViewHandler(handler: IViewHandler): void {
        var index: number = this._handlers.indexOf(handler);
        if (index == -1)
            return;

        this._handlers.splice(index, 1);

        for (let i in this._containers) {
            let container: any = this._containers[i];
            this._registry.getBinding(container).removeHandler(handler);
        }
        this.dispatchEvent(new ViewManagerEvent(ViewManagerEvent.HANDLER_REMOVE, null, handler));
    }

    /**
     * @inheritDoc
     */
    public removeAllHandlers(): void {
        for (let i in this._containers) {
            let container: any = this._containers[i];
            var binding: ContainerBinding = this._registry.getBinding(container);
            for (let j in this._handlers) {
                let handler: IViewHandler = this._handlers[j];
                binding.removeHandler(handler);
            }
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private validContainer(container: any): boolean {
        for (let i in this._containers) {
            let registeredContainer: any = this._containers[i];
            if (container == registeredContainer)
                return false;

            if (registeredContainer.contains(container) || container.contains(registeredContainer))
                throw new Error("Containers can not be nested");
        }
        return true;
    }
}
