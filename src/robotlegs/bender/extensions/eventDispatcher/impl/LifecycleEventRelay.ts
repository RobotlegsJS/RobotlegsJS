// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";
import { LifecycleEvent } from "../../../framework/api/LifecycleEvent";

import { EventRelay } from "./EventRelay";

/**
 * @private
 */
export class LifecycleEventRelay {
    /*============================================================================*/
    /* Private Static Properties                                                  */
    /*============================================================================*/

    private static TYPES: string[] = [
        LifecycleEvent.STATE_CHANGE,
        LifecycleEvent.PRE_INITIALIZE,
        LifecycleEvent.INITIALIZE,
        LifecycleEvent.POST_INITIALIZE,
        LifecycleEvent.PRE_SUSPEND,
        LifecycleEvent.SUSPEND,
        LifecycleEvent.POST_SUSPEND,
        LifecycleEvent.PRE_RESUME,
        LifecycleEvent.RESUME,
        LifecycleEvent.POST_RESUME,
        LifecycleEvent.PRE_DESTROY,
        LifecycleEvent.DESTROY,
        LifecycleEvent.POST_DESTROY
    ];

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _relay: EventRelay;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(source: IEventDispatcher, destination: IEventDispatcher) {
        this._relay = new EventRelay(source, destination, LifecycleEventRelay.TYPES).start();
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public destroy(): void {
        this._relay.stop();
        this._relay = null;
    }
}
