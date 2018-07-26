// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Event } from "../../events/impl/Event";

/**
 * Detain/release pin Event
 */
export class PinEvent extends Event {
    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static DETAIN: string = "detain";

    public static RELEASE: string = "release";

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _instance: any;

    /**
     * The instance being detained or released
     */
    public get instance(): any {
        return this._instance;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Create a Pin Event
     * @param type The event type
     * @param instance The associated instance
     */
    constructor(type: string, instance: any) {
        super(type);
        this._instance = instance;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): PinEvent {
        return new PinEvent(this.type, this._instance);
    }
}
