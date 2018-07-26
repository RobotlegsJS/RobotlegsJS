// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";

/**
 * Custom Event
 * @private
 */
export class CustomEvent2 extends Event {
    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static COMPLETE: string = "complete";
    public static CHANGE: string = "change";

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
    public clone(): CustomEvent2 {
        return new CustomEvent2(this.type);
    }
}
