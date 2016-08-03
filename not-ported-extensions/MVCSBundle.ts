// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.bundles.mvcs {

    import ContextViewExtension = robotlegs.bender.extensions.contextView.ContextViewExtension;
    import ContextViewListenerConfig = robotlegs.bender.extensions.contextView.ContextViewListenerConfig;
    import StageSyncExtension = robotlegs.bender.extensions.contextView.StageSyncExtension;
    import DirectCommandMapExtension = robotlegs.bender.extensions.directCommandMap.DirectCommandMapExtension;
    import InjectableLoggerExtension = robotlegs.bender.extensions.enhancedLogging.InjectableLoggerExtension;
    import TraceLoggingExtension = robotlegs.bender.extensions.enhancedLogging.TraceLoggingExtension;
    import EventCommandMapExtension = robotlegs.bender.extensions.eventCommandMap.EventCommandMapExtension;
    import EventDispatcherExtension = robotlegs.bender.extensions.eventDispatcher.EventDispatcherExtension;
    import LocalEventMapExtension = robotlegs.bender.extensions.localEventMap.LocalEventMapExtension;
    import MediatorMapExtension = robotlegs.bender.extensions.mediatorMap.MediatorMapExtension;
    import ModularityExtension = robotlegs.bender.extensions.modularity.ModularityExtension;
    import StageCrawlerExtension = robotlegs.bender.extensions.viewManager.StageCrawlerExtension;
    import StageObserverExtension = robotlegs.bender.extensions.viewManager.StageObserverExtension;
    import ViewManagerExtension = robotlegs.bender.extensions.viewManager.ViewManagerExtension;
    import ViewProcessorMapExtension = robotlegs.bender.extensions.viewProcessorMap.ViewProcessorMapExtension;
    import VigilanceExtension = robotlegs.bender.extensions.vigilance.VigilanceExtension;
    import IBundle = robotlegs.bender.framework.api.IBundle;
    import IContext = robotlegs.bender.framework.api.IContext;
    import LogLevel = robotlegs.bender.framework.api.LogLevel;

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
                TraceLoggingExtension,
                VigilanceExtension,
                InjectableLoggerExtension,
                ContextViewExtension,
                EventDispatcherExtension,
                ModularityExtension,
                DirectCommandMapExtension,
                EventCommandMapExtension,
                LocalEventMapExtension,
                ViewManagerExtension,
                StageObserverExtension,
                MediatorMapExtension,
                ViewProcessorMapExtension,
                StageCrawlerExtension,
                StageSyncExtension);

            context.configure(ContextViewListenerConfig);
        }
    }
}
