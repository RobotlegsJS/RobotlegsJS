// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ContainerBinding } from "./ContainerBinding";
import { ContainerRegistry } from "./ContainerRegistry";
import { ContainerRegistryEvent } from "./ContainerRegistryEvent";
import { IEvent } from "../../../events/api/IEvent";

/**
 * @private
 */
export class StageObserver {

    private _registry: ContainerRegistry;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(containerRegistry: ContainerRegistry) {
        this._registry = containerRegistry;

        // We only care about roots
        this._registry.addEventListener(ContainerRegistryEvent.ROOT_CONTAINER_ADD, this.onRootContainerAdd, this);
        this._registry.addEventListener(ContainerRegistryEvent.ROOT_CONTAINER_REMOVE, this.onRootContainerRemove, this);

        // We might have arrived late on the scene
        for (let i in this._registry.rootBindings) {
            let binding: ContainerBinding = this._registry.rootBindings[i];
            this.addRootListener(binding.container);
        }
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public destroy(): void {
        this._registry.removeEventListener(ContainerRegistryEvent.ROOT_CONTAINER_ADD, this.onRootContainerAdd, this);
        this._registry.removeEventListener(ContainerRegistryEvent.ROOT_CONTAINER_REMOVE, this.onRootContainerRemove, this);

        for (let i in this._registry.rootBindings) {
            let binding: ContainerBinding = this._registry.rootBindings[i];
            this.removeRootListener(binding.container);
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private onRootContainerAdd(event: ContainerRegistryEvent): void {
        this.addRootListener(event.container);
    }

    private onRootContainerRemove(event: ContainerRegistryEvent): void {
        this.removeRootListener(event.container);
    }

    private addRootListener(container: any): void {
        container.addEventListener("added", this.onViewAddedToStage, this);

        // Watch the root container itself - nobody else is going to pick it up!
        // container.on("added", this.onContainerRootAddedToStage, this);

    }

    private removeRootListener(container: any): void {
        // container.removeEventListener(Event.ADDED_TO_STAGE, this.onViewAddedToStage, true);
        // container.removeEventListener(Event.ADDED_TO_STAGE, this.onContainerRootAddedToStage);

        container.removeEventListener("added", this.onViewAddedToStage, this);
        // container.on("removed", this.onContainerRootAddedToStage);
    }

    private onViewAddedToStage(event: IEvent): void {
        var view: any = event.target;
        var type: FunctionConstructor = view['constructor'];

        // Walk upwards from the nearest binding
        var binding: ContainerBinding = this._registry.findParentBinding(view);
        while (binding) {
            binding.handleView(view, type);
            binding = binding.parent;
        }
    }

    // private onContainerRootAddedToStage(event: Event): void {
    //     console.log("onContainerRootAddedToStage");
    //
    //     var container: any = <any>event.target ;
    //     // container.removeEventListener(Event.ADDED_TO_STAGE, this.onContainerRootAddedToStage);
    //     container.on("added", this.onContainerRootAddedToStage, this);
    //
    //     var type: FunctionConstructor = container['constructor'];
    //     var binding: ContainerBinding = this._registry.getBinding(container);
    //     binding.handleView(container, type);
    // }
}
