// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ContainerRegistryEvent } from "./ContainerRegistryEvent";

import { ContainerRegistry } from "./ContainerRegistry";
import { ContainerBinding } from "./ContainerBinding";

import { ConfigureViewEvent } from "./ConfigureViewEvent";

/**
 * @private
 */
export class ManualStageObserver {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _registry: ContainerRegistry;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(containerRegistry: ContainerRegistry) {
        this._registry = containerRegistry;
        // We care about all containers (not just roots)
        this._registry.addEventListener(ContainerRegistryEvent.CONTAINER_ADD, this.onContainerAdd);
        this._registry.addEventListener(ContainerRegistryEvent.CONTAINER_REMOVE, this.onContainerRemove);
        // We might have arrived late on the scene
        for (let i in this._registry.bindings) {
            let binding: ContainerBinding = this._registry.bindings[i];
            this.addContainerListener(binding.container);
        }
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public destroy(): void {
        this._registry.removeEventListener(ContainerRegistryEvent.CONTAINER_ADD, this.onContainerAdd);
        this._registry.removeEventListener(ContainerRegistryEvent.CONTAINER_REMOVE, this.onContainerRemove);
        for (let i in this._registry.bindings) {
            let binding: ContainerBinding = this._registry.bindings[i];
            this.removeContainerListener(binding.container);
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private onContainerAdd(event: ContainerRegistryEvent): void {
        this.addContainerListener(event.container);
    }

    private onContainerRemove(event: ContainerRegistryEvent): void {
        this.removeContainerListener(event.container);
    }

    private addContainerListener(container: any): void {
        // We're interested in ALL container bindings
        // but just for normal, bubbling events
        container.addEventListener(ConfigureViewEvent.CONFIGURE_VIEW, this.onConfigureView);
    }

    private removeContainerListener(container: any): void {
        container.removeEventListener(ConfigureViewEvent.CONFIGURE_VIEW, this.onConfigureView);
    }

    private onConfigureView(event: ConfigureViewEvent): void {
        // Stop that event!
        event.stopImmediatePropagation();
        var container: any = <any>event.currentTarget;
        var view: any = <any>event.target;
        var type: FunctionConstructor = view['constructor'];
        this._registry.getBinding(container).handleView(view, type);
    }
}
