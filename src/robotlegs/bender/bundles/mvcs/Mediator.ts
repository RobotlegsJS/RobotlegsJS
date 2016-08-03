// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject } from "inversify";
// import { injectProperty } from "../../../utils";

import { IEventMap } from "../../extensions/localEventMap/api/IEventMap";
import { IEventDispatcher } from "../../events/IEventDispatcher";
import { IMediator } from "../../extensions/mediatorMap/api/IMediator";

/**
 * Classic Robotlegs mediator implementation
 *
 * <p>Override initialize and destroy to hook into the mediator lifecycle.</p>
 */
@injectable()
export abstract class Mediator implements IMediator {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    protected _viewComponent: any;

    /**
     * @private
     */
    public set viewComponent(view: any) {
        this._viewComponent = view;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public abstract initialize(): void;

    /**
     * @inheritDoc
     */
    public abstract destroy(): void;

    // @injectProperty(IEventMap)
    // protected eventMap: IEventMap;
    //
    // @injectProperty(IEventDispatcher)
    // protected eventDispatcher: IEventDispatcher;

    constructor (
        @inject(IEventMap) protected eventMap: IEventMap,
        @inject(IEventDispatcher) protected eventDispatcher: IEventDispatcher
    ) {
        this.eventMap = eventMap;
        this.eventDispatcher = eventDispatcher;
    }

    /**
     * Runs after the mediator has been destroyed.
     * Cleans up listeners mapped through the local EventMap.
     */
    public postDestroy(): void {
        this.eventMap.unmapListeners();
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    protected addViewListener(eventString: string, listener: Function, eventClass?: Object): void {
        this.eventMap.mapListener((<IEventDispatcher>this._viewComponent), eventString, listener, eventClass);
    }

    protected addContextListener(eventString: string, listener: Function, eventClass?: Object): void {
        this.eventMap.mapListener(this.eventDispatcher, eventString, listener, eventClass);
    }

    protected removeViewListener(eventString: string, listener: Function, eventClass?: Object): void {
        this.eventMap.unmapListener((<IEventDispatcher>this._viewComponent), eventString, listener, eventClass);
    }

    protected removeContextListener(eventString: string, listener: Function, eventClass?: Object): void {
        this.eventMap.unmapListener(this.eventDispatcher, eventString, listener, eventClass);
    }

    protected dispatch(event: Event): void {
        if (this.eventDispatcher.hasEventListener(event.type)) {
            this.eventDispatcher.dispatchEvent(event);
        }
    }
}
