// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Type Matcher Error
 */
export class TypeMatcherError extends Error {
    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static EMPTY_MATCHER: string =
        "An empty matcher will create a filter which matches nothing. " + "You should specify at least one condition for the filter.";

    public static SEALED_MATCHER: string = "This matcher has been sealed and can no longer be configured.";

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Type Matcher Error
     * @param message The error message
     */
    constructor(message: string) {
        super(message);
    }
}
