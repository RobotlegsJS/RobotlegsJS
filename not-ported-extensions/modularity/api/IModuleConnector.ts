// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.api {

    import IModuleConnectionAction = robotlegs.bender.extensions.modularity.dsl.IModuleConnectionAction;

    /**
     * Creates event relays between modules
     */
    export interface IModuleConnector {
        /**
         * Connects to a specified channel
         * @param channelId The channel Id
         * @return Configurator
         */
         onChannel(channelId: String): IModuleConnectionAction;

        /**
         * Connects to the default channel
         * @return Configurator
         */
         onDefaultChannel(): IModuleConnectionAction;
    }
}
