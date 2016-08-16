// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Lifecycle Error
 */
export class LifecycleError extends Error {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static SYNC_HANDLER_ARG_MISMATCH: string = "When and After handlers must accept 0 or 1 arguments";

    public static LATE_HANDLER_ERROR_MESSAGE: string = "Handler added late and will never fire";

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Lifecycle Error
     * @param message The error message
     */
    constructor(message: string) {
        super();
        this.name = "LifecycleError";
        this.message = message;
    }
}
