// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ContextViewExtension } from "../../extensions/contextView/ContextViewExtension";
import { ContextViewListenerConfig } from "../../extensions/contextView/ContextViewListenerConfig";
import { StageSyncExtension } from "../../extensions/contextView/StageSyncExtension";
import { DirectCommandMapExtension } from "../../extensions/directCommandMap/DirectCommandMapExtension";
import { InjectableLoggerExtension } from "../../extensions/enhancedLogging/InjectableLoggerExtension";
import { ConsoleLoggingExtension } from "../../extensions/enhancedLogging/ConsoleLoggingExtension";
import { EventCommandMapExtension } from "../../extensions/eventCommandMap/EventCommandMapExtension";
import { EventDispatcherExtension } from "../../extensions/eventDispatcher/EventDispatcherExtension";
import { LocalEventMapExtension } from "../../extensions/localEventMap/LocalEventMapExtension";
import { MediatorMapExtension } from "../../extensions/mediatorMap/MediatorMapExtension";
// import { ModularityExtension } from "../../extensions/modularity/ModularityExtension";
import { StageCrawlerExtension } from "../../extensions/viewManager/StageCrawlerExtension";
import { StageObserverExtension } from "../../extensions/viewManager/StageObserverExtension";
import { ViewManagerExtension } from "../../extensions/viewManager/ViewManagerExtension";
// import { ViewProcessorMapExtension } from "../../extensions/viewProcessorMap/ViewProcessorMapExtension";
// import { VigilanceExtension } from "../../extensions/vigilance/VigilanceExtension";
import { IBundle } from "../../framework/api/IBundle";
import { IContext } from "../../framework/api/IContext";
import { LogLevel } from "../../framework/api/LogLevel";

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
            // VigilanceExtension,
            InjectableLoggerExtension,
            ContextViewExtension,
            EventDispatcherExtension,
            // ModularityExtension,
            DirectCommandMapExtension,
            EventCommandMapExtension,
            LocalEventMapExtension,
            ViewManagerExtension,
            StageObserverExtension,
            MediatorMapExtension,
            // ViewProcessorMapExtension,
            StageCrawlerExtension,
            StageSyncExtension);

            context.configure(ContextViewListenerConfig);
    }
}
