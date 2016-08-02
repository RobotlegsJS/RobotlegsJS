// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap {

    import IViewHandler = robotlegs.bender.extensions.viewManager.api.IViewHandler;
    import IViewManager = robotlegs.bender.extensions.viewManager.api.IViewManager;
    import IViewProcessorMap = robotlegs.bender.extensions.viewProcessorMap.api.IViewProcessorMap;
    import IViewProcessorFactory = robotlegs.bender.extensions.viewProcessorMap.impl.IViewProcessorFactory;
    import ViewProcessorFactory = robotlegs.bender.extensions.viewProcessorMap.impl.ViewProcessorFactory;
    import ViewProcessorMap = robotlegs.bender.extensions.viewProcessorMap.impl.ViewProcessorMap;
    import IContext = robotlegs.bender.framework.api.IContext;
    import IExtension = robotlegs.bender.framework.api.IExtension;
    import IInjector = robotlegs.bender.framework.api.IInjector;

    /**
     * This extension install a View Processor Map into a context
     */
    export class ViewProcessorMapExtension implements IExtension {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _injector: IInjector;

        private _viewProcessorMap: IViewProcessorMap;

        private _viewManager: IViewManager;

        private _viewProcessorFactory: IViewProcessorFactory;

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public extend(context: IContext): void {
            context.beforeInitializing(this.beforeInitializing);
            context.beforeDestroying(this.beforeDestroying);
            context.whenDestroying(this.whenDestroying);
            this._injector = context.injector;
            this._injector.map(IViewProcessorFactory).toValue(new ViewProcessorFactory(this._injector.createChild()));
            this._injector.map(IViewProcessorMap).toSingleton(ViewProcessorMap);
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private beforeInitializing(): void {
            this._viewProcessorMap = this._injector.getInstance(IViewProcessorMap);
            this._viewProcessorFactory = this._injector.getInstance(IViewProcessorFactory);
            if (this._injector.satisfiesDirectly(IViewManager)) {
                this._viewManager = this._injector.getInstance(IViewManager);
                this._viewManager.addViewHandler(<IViewHandler>this._viewProcessorMap );
            }
        }

        private beforeDestroying(): void {
            this._viewProcessorFactory.runAllUnprocessors();

            if (this._injector.satisfiesDirectly(IViewManager)) {
                this._viewManager = this._injector.getInstance(IViewManager);
                this._viewManager.removeViewHandler(<IViewHandler>this._viewProcessorMap );
            }
        }

        private whenDestroying(): void {
            if (this._injector.satisfiesDirectly(IViewProcessorMap)) {
                this._injector.unmap(IViewProcessorMap);
            }
            if (this._injector.satisfiesDirectly(IViewProcessorFactory)) {
                this._injector.unmap(IViewProcessorFactory);
            }
        }
    }
}
