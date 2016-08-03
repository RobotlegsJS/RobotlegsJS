// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandTrigger } from "../api/ICommandTrigger";

/**
 * @private
 */
export class NullCommandTrigger implements ICommandTrigger {

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public activate(): void { }

    /**
     * @private
     */
    public deactivate(): void { }
}
