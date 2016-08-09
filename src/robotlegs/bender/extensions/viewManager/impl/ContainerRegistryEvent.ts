// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Container existence event
 * @private
 */
export class ContainerRegistryEvent { // extends CustomEvent

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
    private _type: string;

    /**
     * The container associated with this event
     */
    public get container(): any {
        return this._container;
    }

    public get type(): string {
        return this._type;
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
        this._type = type;
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
