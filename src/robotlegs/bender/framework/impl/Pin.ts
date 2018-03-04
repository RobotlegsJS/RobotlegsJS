// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IEventDispatcher } from "../../events/api/IEventDispatcher";
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

    private _instances: Map<any, boolean> = new Map<any, boolean>();

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
        if (!this._instances.get(instance)) {
            this._instances.set(instance, true);
            this._dispatcher.dispatchEvent(new PinEvent(PinEvent.DETAIN, instance));
        }
    }

    /**
     * Unpins an object
     * @param instance Instance to unpin
     */
    public release(instance: any): void {
        if (this._instances.get(instance)) {
            this._instances.delete(instance);
            this._dispatcher.dispatchEvent(new PinEvent(PinEvent.RELEASE, instance));
        }
    }

    /**
     * Removes all pins
     */
    public releaseAll(): void {
        this._instances.forEach((value: boolean, key: any) => this.release(key));
    }
}
