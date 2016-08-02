// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.impl {

    import DisplayObjectContainer = flash.display.DisplayObjectContainer;
    import IViewManager = robotlegs.bender.extensions.viewManager.api.IViewManager;
    import ViewManagerEvent = robotlegs.bender.extensions.viewManager.impl.ViewManagerEvent;
    import IContext = robotlegs.bender.framework.api.IContext;
    import ILogger = robotlegs.bender.framework.api.ILogger;

    /**
     * @private
     */
    export class ViewManagerBasedExistenceWatcher {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _logger: ILogger;

        private _viewManager: IViewManager;

        private _context: IContext;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(context: IContext, viewManager: IViewManager) {
            this._logger = context.getLogger(this);
            this._viewManager = viewManager;
            this._context = context;
            this._context.whenDestroying(this.destroy);
            this.init();
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private init(): void {
            for each (var container: DisplayObjectContainer in this._viewManager.containers) {
                this._logger.debug("Adding context existence event listener to container {0}", [container]);
                container.addEventListener(this.ModularContextEvent.CONTEXT_ADD, this.onContextAdd);
            }
            this._viewManager.addEventListener(ViewManagerEvent.CONTAINER_ADD, this.onContainerAdd);
            this._viewManager.addEventListener(ViewManagerEvent.CONTAINER_REMOVE, this.onContainerRemove);
        }

        private destroy(): void {
            for each (var container: DisplayObjectContainer in this._viewManager.containers) {
                this._logger.debug("Removing context existence event listener from container {0}", [container]);
                container.removeEventListener(this.ModularContextEvent.CONTEXT_ADD, this.onContextAdd);
            }
            this._viewManager.removeEventListener(ViewManagerEvent.CONTAINER_ADD, this.onContainerAdd);
            this._viewManager.removeEventListener(ViewManagerEvent.CONTAINER_REMOVE, this.onContainerRemove);
        }

        private onContainerAdd(event: ViewManagerEvent): void {
            this._logger.debug("Adding context existence event listener to container {0}", [event.container]);
            event.container.addEventListener(this.ModularContextEvent.CONTEXT_ADD, this.onContextAdd);
        }

        private onContainerRemove(event: ViewManagerEvent): void {
            this._logger.debug("Removing context existence event listener from container {0}", [event.container]);
            event.container.removeEventListener(this.ModularContextEvent.CONTEXT_ADD, this.onContextAdd);
        }

        private onContextAdd(event: ModularContextEvent): void {
            // We might catch out own existence event, so ignore that
            if (event.context != this._context) {
                event.stopImmediatePropagation();
                this._logger.debug("Context existence event caught. Configuring child context {0}", [event.context]);
                this._context.addChild(event.context);
            }
        }
    }
}
