// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";

/**
 * Custom Event
 * @private
 */
export class CustomEvent1 extends Event {
    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static ADDED: string = "added";
    public static REMOVED: string = "removed";

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a view configuration event
     * @param type The event type
     */
    constructor(type: string) {
        super(type, true);
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): CustomEvent1 {
        return new CustomEvent1(this.type);
    }
}
