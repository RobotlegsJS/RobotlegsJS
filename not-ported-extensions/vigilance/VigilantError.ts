// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.vigilance {

    /**
     * Vigilant Error
     */
    export class VigilantError extends Error {

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * Creates a Vigilant Error
         * @param message The error message
         */
        constructor(message: string) {
            super(message);
        }
    }
}
