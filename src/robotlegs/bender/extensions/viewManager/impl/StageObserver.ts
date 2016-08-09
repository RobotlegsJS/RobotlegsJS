// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ContainerBinding } from "./ContainerBinding";
import { ContainerRegistry } from "./ContainerRegistry";
import { ContainerRegistryEvent } from "./ContainerRegistryEvent";

/**
 * @private
 */
export class StageObserver {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _filter: RegExp = /^mx\.|^spark\.|^flash\./;

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
        this._registry.addEventListener(ContainerRegistryEvent.ROOT_CONTAINER_ADD, this.onRootContainerAdd);
        this._registry.addEventListener(ContainerRegistryEvent.ROOT_CONTAINER_REMOVE, this.onRootContainerRemove);

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
        this._registry.removeEventListener(ContainerRegistryEvent.ROOT_CONTAINER_ADD, this.onRootContainerAdd);
        this._registry.removeEventListener(ContainerRegistryEvent.ROOT_CONTAINER_REMOVE, this.onRootContainerRemove);

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
        container.on("added", this.onViewAddedToStage, this);

        // Watch the root container itself - nobody else is going to pick it up!
        // container.on("added", this.onContainerRootAddedToStage, this);

    }

    private removeRootListener(container: any): void {
        // container.removeEventListener(Event.ADDED_TO_STAGE, this.onViewAddedToStage, true);
        // container.removeEventListener(Event.ADDED_TO_STAGE, this.onContainerRootAddedToStage);

        container.off("added", this.onViewAddedToStage);
        // container.on("removed", this.onContainerRootAddedToStage);
    }

    private onViewAddedToStage(event: Event): void {
        var view: any = <any>event.target;

        //
        // // FIXME: ?
        //
        // // Question: would it be worth caching QCNs by view in a weak dictionary,
        // // to avoid getQualifiedClassName() cost?
        // var qcn: string = getQualifiedClassName(view);
        // var filtered: boolean = this._filter.test(qcn);
        // if (filtered)
        //     return;

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
