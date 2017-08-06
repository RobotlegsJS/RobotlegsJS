// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { InjectorListener } from "./impl/InjectorListener";
import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";

/**
 * This extension logs messages for all Injector actions.
 *
 * Warning: this extension will degrade the performance of your application.
 */
export class InjectorActivityLoggingExtension implements IExtension {

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        let listener: InjectorListener = new InjectorListener(
            context.injector,
            context.getLogger(this)
        );
        context.afterDestroying(listener.destroy);
    }
}
