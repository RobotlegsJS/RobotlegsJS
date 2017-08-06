// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.impl {

    import EventDispatcher = flash.events.EventDispatcher;
    import IEventDispatcher = flash.events.IEventDispatcher;
    import IModuleConnector = robotlegs.bender.extensions.modularity.api.IModuleConnector;
    import IModuleConnectionAction = robotlegs.bender.extensions.modularity.dsl.IModuleConnectionAction;
    import IContext = robotlegs.bender.framework.api.IContext;
    import IInjector = robotlegs.bender.framework.api.IInjector;

    /**
     * @private
     */
    export class ModuleConnector implements IModuleConnector {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _rootInjector: IInjector;

        private _localDispatcher: IEventDispatcher;

        private _configuratorsByChannel: Object = {};

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(context: IContext) {
            var injector: IInjector = context.injector;
            this._rootInjector = this.getRootInjector(injector);
            this._localDispatcher = injector.getInstance(IEventDispatcher);
            context.whenDestroying(this.destroy);
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public onChannel(channelId: string): IModuleConnectionAction {
            return this.getOrCreateConfigurator(channelId);
        }

        /**
         * @inheritDoc
         */
        public onDefaultChannel(): IModuleConnectionAction {
            return this.getOrCreateConfigurator('global');
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private destroy(): void {
            for (var channelId: string in this._configuratorsByChannel) {
                var configurator: ModuleConnectionConfigurator = this._configuratorsByChannel[channelId];
                configurator.destroy();
                delete this._configuratorsByChannel[channelId];
            }

            this._configuratorsByChannel = null;
            this._localDispatcher = null;
            this._rootInjector = null;
        }

        private getOrCreateConfigurator(channelId: string): ModuleConnectionConfigurator {
            return this._configuratorsByChannel[channelId] ||this.= this.createConfigurator(channelId);
        }

        private createConfigurator(channelId: string): ModuleConnectionConfigurator {
            if (!this._rootInjector.hasMapping(IEventDispatcher, channelId)) {
                this._rootInjector.map(IEventDispatcher, channelId)
                    .toValue(new EventDispatcher());
            }
            return new ModuleConnectionConfigurator(this._localDispatcher, this._rootInjector.getInstance(IEventDispatcher, channelId));
        }

        private getRootInjector(injector: IInjector): IInjector {
            while (injector.parent) {
                injector = injector.parent;
            }
            return injector;
        }
    }
}
