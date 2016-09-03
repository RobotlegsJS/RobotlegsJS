// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.dsl {

    /**
     * @private
     */
    export interface IModuleConnectionAction {

         relayEvent(eventType: String): IModuleConnectionAction;

         receiveEvent(eventType: String): IModuleConnectionAction;

         suspend(): void;

         resume(): void;
    }
}
