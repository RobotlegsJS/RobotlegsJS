// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";

import { IEventCommandMap } from "./api/IEventCommandMap";
import { EventCommandMap } from "./impl/EventCommandMap";

/**
 * The Event Command Map allows you to bind Events to Commands
 */
export class EventCommandMapExtension implements IExtension {
    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        context.injector
            .bind(IEventCommandMap)
            .to(EventCommandMap)
            .inSingletonScope();
    }
}
