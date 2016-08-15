// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Kernel, injectable } from "inversify";
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
    public hasMapping(type: any, name: String): Boolean {
        // TODO: implement method using Kernel API
        throw new Error("hasMapping method is not implemented.");
    }

    /**
     * @inheritDoc
     */
    public hasDirectMapping(type: any, name: String): Boolean {
        // TODO: implement method using Kernel API
        throw new Error("hasDirectMapping method is not implemented.");
    }

    /**
     * @inheritDoc
     */
    public satisfies(type: any, name: String): Boolean {
        // TODO: implement method using Kernel API
        throw new Error("satisfies method is not implemented.");
    }

    /**
     * @inheritDoc
     */
    public satisfiesDirectly(type: any, name: String): Boolean {
        // TODO: implement method using Kernel API
        throw new Error("satisfiesDirectly method is not implemented.");
    }

    /**
     * @inheritDoc
     */
    public teardown(): void {
        this.unbindAll();
    }

    /**
     * @inheritDoc
     */
    public instantiateUnmapped<T>(type: FunctionConstructor): T {
        this.bind(type).to(type);
        let instance: T = this.get<T>(type);
        this.unbind(type);
        return instance;
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
