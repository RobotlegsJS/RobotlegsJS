// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Robotlegs object lifecycle state
 */
export class LifecycleState {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static UNINITIALIZED: string = "uninitialized";

    public static INITIALIZING: string = "initializing";

    public static ACTIVE: string = "active";

    public static SUSPENDING: string = "suspending";

    public static SUSPENDED: string = "suspended";

    public static RESUMING: string = "resuming";

    public static DESTROYING: string = "destroying";

    public static DESTROYED: string = "destroyed";
}
