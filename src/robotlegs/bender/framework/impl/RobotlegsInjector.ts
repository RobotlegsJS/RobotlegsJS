// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Container, injectable } from "inversify";
import { IInjector } from "../api/IInjector";

/**
 * Robotlegs IInjector Adapter
 */
@injectable()
export class RobotlegsInjector extends Container implements IInjector {

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a new Injector
     */
    constructor() {
        super();
    }
}
