// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

import { ConsoleLogTarget } from "./impl/ConsoleLogTarget";
import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";

/**
 * Adds a TraceLogTarget to the context
 */
export class ConsoleLoggingExtension implements IExtension {

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        context.addLogTarget(new ConsoleLogTarget(context));
    }
}
