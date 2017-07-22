// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Kernel, injectable, interfaces } from "inversify";
import { IInjector } from "../api/IInjector";

/**
 * Robotlegs IInjector Adapter
 */
@injectable()
export class RobotlegsInjector extends Kernel implements IInjector {

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a new Injector
     */
    constructor() {
        super();
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public teardown(): void {
        this.unbindAll();
    }

    /**
     * @inheritDoc
     */
    public createChild(): IInjector {
        let childInjector: IInjector = new RobotlegsInjector();
        childInjector.parent = this;
        return childInjector;
    }
}
