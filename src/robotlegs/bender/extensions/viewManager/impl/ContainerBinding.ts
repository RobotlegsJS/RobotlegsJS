// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IViewHandler } from "../api/IViewHandler";
import { EventDispatcher } from "../../../events/impl/EventDispatcher";

import { ContainerBindingEvent } from "./ContainerBindingEvent";

/*[Event(name="bindingEmpty", type="robotlegs.bender.extensions.viewManager.impl.ContainerBindingEvent")]*/
/**
 * @private
 */
export class ContainerBinding extends EventDispatcher {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _parent: ContainerBinding;

    /**
     * @private
     */
    public get parent(): ContainerBinding {
        return this._parent;
    }

    /**
     * @private
     */
    public set parent(value: ContainerBinding) {
        this._parent = value;
    }

    private _container: any;

    /**
     * @private
     */
    public get container(): any {
        return this._container;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _handlers: IViewHandler[] = [];

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(container: any) {
        super();
        this._container = container;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public addHandler(handler: IViewHandler): void {
        if (this._handlers.indexOf(handler) > -1)
            return;
        this._handlers.push(handler);
    }

    /**
     * @private
     */
    public removeHandler(handler: IViewHandler): void {
        var index: number = this._handlers.indexOf(handler);
        if (index > -1) {
            this._handlers.splice(index, 1);
            if (this._handlers.length == 0) {
                this.dispatchEvent(new ContainerBindingEvent(ContainerBindingEvent.BINDING_EMPTY));
            }
        }
    }

    /**
     * @private
     */
    public handleView(view: any, type: FunctionConstructor): void {
        var length: number = this._handlers.length;
        for (var i: number = 0; i < length; i++) {
            var handler: IViewHandler = <IViewHandler>this._handlers[i];
            handler.handleView(view, type);
        }
    }
}
