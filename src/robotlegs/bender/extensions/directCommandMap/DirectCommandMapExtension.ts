// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";

import { IDirectCommandMap } from "./api/IDirectCommandMap";
import { DirectCommandMap } from "./impl/DirectCommandMap";

/**
 * Maps commands for direct (manual) execution
 */
export class DirectCommandMapExtension implements IExtension {

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        context.injector.bind(IDirectCommandMap).to(DirectCommandMap);
    }
}
