// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IBundle } from "../../framework/api/IBundle";
import { IContext } from "../../framework/api/IContext";
import { LogLevel } from "../../framework/api/LogLevel";

import { DirectCommandMapExtension } from "../../extensions/directCommandMap/DirectCommandMapExtension";
import { InjectableLoggerExtension } from "../../extensions/enhancedLogging/InjectableLoggerExtension";
import { ConsoleLoggingExtension } from "../../extensions/enhancedLogging/ConsoleLoggingExtension";
import { EventCommandMapExtension } from "../../extensions/eventCommandMap/EventCommandMapExtension";
import { EventDispatcherExtension } from "../../extensions/eventDispatcher/EventDispatcherExtension";
import { LocalEventMapExtension } from "../../extensions/localEventMap/LocalEventMapExtension";

/**
 * For that Classic Robotlegs flavour
 *
 * <p>This bundle installs a number of extensions commonly used
 * in typical Robotlegs applications and modules.</p>
 */
export class MVCSBundle implements IBundle {

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        context.logLevel = LogLevel.DEBUG;

        context.install(
            ConsoleLoggingExtension,
            InjectableLoggerExtension,
            EventDispatcherExtension,
            DirectCommandMapExtension,
            EventCommandMapExtension,
            LocalEventMapExtension
        );
    }
}
