// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IViewHandler } from "../api/IViewHandler";

/**
 * Container existence event
 * @private
 */
export class ViewManagerEvent { // extends CustomEvent

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static CONTAINER_ADD: string = 'containerAdd';

    public static CONTAINER_REMOVE: string = 'containerRemove';

    public static HANDLER_ADD: string = 'handlerAdd';

    public static HANDLER_REMOVE: string = 'handlerRemove';

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _container: any;
    private _type: string;
    public target: any;

    /**
     * The container associated with this event
     */
    public get container(): any {
        return this._container;
    }

    private _handler: IViewHandler;

    /**
     * The view handler associated with this event
     */
    public get handler(): IViewHandler {
        return this._handler;
    }

    public get type(): string { return this._type; }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a view manager event
     * @param type The event type
     * @param container The container associated with this event
     * @param handler The view handler associated with this event
     */
    constructor(type: string, container?: any, handler?: IViewHandler) {
        // super(type);
        this._type = type;
        this._container = container;
        this._handler = handler;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): ViewManagerEvent {
        return new ViewManagerEvent(this.type, this._container, this._handler);
    }
}
