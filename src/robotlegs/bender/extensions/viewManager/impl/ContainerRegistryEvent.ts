// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Container existence event
 * @private
 */
import { Event } from "../../../events/impl/Event";

export class ContainerRegistryEvent extends Event {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static CONTAINER_ADD: string = "containerAdd";

    public static CONTAINER_REMOVE: string = "containerRemove";

    public static ROOT_CONTAINER_ADD: string = "rootContainerAdd";

    public static ROOT_CONTAINER_REMOVE: string = "rootContainerRemove";

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _container: any;

    /**
     * The container associated with this event
     */
    public get container(): any {
        return this._container;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a new container existence event
     * @param type The event type
     * @param container The container associated with this event
     */
    constructor(type: string, container: any) {
        super(type);
        this._container = container;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): ContainerRegistryEvent {
        return new ContainerRegistryEvent(this.type, this._container);
    }
}
