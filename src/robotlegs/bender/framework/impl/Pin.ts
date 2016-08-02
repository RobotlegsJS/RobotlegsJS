// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IEventDispatcher } from "../../events/IEventDispatcher";
import { PinEvent } from "../api/PinEvent";

/**
 * Pins objects in memory
 *
 * @private
 */
export class Pin {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _instances: Map<any, any> = new Map<any, any>();

    private _dispatcher: IEventDispatcher;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(dispatcher: IEventDispatcher) {
        this._dispatcher = dispatcher;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Pin an object in memory
     * @param instance Instance to pin
     */
    public detain(instance: any): void {
        if (!this._instances[instance]) {
            this._instances[instance] = true;
            this._dispatcher.dispatchEvent(new PinEvent(PinEvent.DETAIN, instance));
        }
    }

    /**
     * Unpins an object
     * @param instance Instance to unpin
     */
    public release(instance: any): void {
        if (this._instances[instance]) {
            delete this._instances[instance];
            this._dispatcher.dispatchEvent(new PinEvent(PinEvent.RELEASE, instance));
        }
    }

    /**
     * Removes all pins
     */
    public releaseAll(): void {
        for (let i in this._instances) {
            let instance: any = this._instances[i];
            this.release(instance);
        }
    }
}
