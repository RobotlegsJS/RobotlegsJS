// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.impl {

    import IEventDispatcher = flash.events.IEventDispatcher;
    import EventRelay = robotlegs.bender.extensions.eventDispatcher.impl.EventRelay;
    import IModuleConnectionAction = robotlegs.bender.extensions.modularity.dsl.IModuleConnectionAction;

    /**
     * @private
     */
    export class ModuleConnectionConfigurator implements IModuleConnectionAction {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _channelToLocalRelay: EventRelay;

        private _localToChannelRelay: EventRelay;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(
            localDispatcher: IEventDispatcher,
            channelDispatcher: IEventDispatcher) {
            this._localToChannelRelay = new EventRelay(localDispatcher, channelDispatcher).start();
            this._channelToLocalRelay = new EventRelay(channelDispatcher, localDispatcher).start();
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public relayEvent(eventType: string): IModuleConnectionAction {
            this._localToChannelRelay.addType(eventType);
            return this;
        }

        /**
         * @inheritDoc
         */
        public receiveEvent(eventType: string): IModuleConnectionAction {
            this._channelToLocalRelay.addType(eventType);
            return this;
        }

        /**
         * @inheritDoc
         */
        public suspend(): void {
            this._channelToLocalRelay.stop();
            this._localToChannelRelay.stop();
        }

        /**
         * @inheritDoc
         */
        public resume(): void {
            this._channelToLocalRelay.start();
            this._localToChannelRelay.start();
        }

        /**
         * @private
         */
        public destroy(): void {
            this._localToChannelRelay.stop();
            this._localToChannelRelay = null;
            this._channelToLocalRelay.stop();
            this._channelToLocalRelay = null;
        }
    }
}
