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
export class SupportEvent extends Event {
    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static TYPE1: string = "type1";
    public static TYPE2: string = "type2";

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a view configuration event
     * @param type The event type
     */
    constructor(type: string) {
        super(type, { bubbles: true });
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): SupportEvent {
        return new SupportEvent(this.type);
    }
}
