// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { Kernel, injectable } from "inversify";
import { IInjector } from "../api/IInjector";
import { ILogger } from "../api/ILogger";
import { LogManager } from "../impl/LogManager";

/**
 * Robotlegs IInjector Adapter
 */
@injectable()
export class RobotlegsInjector extends Kernel implements IInjector {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _logManager: LogManager;
    private _logger: ILogger;

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    public get logManager(): LogManager {
        return this._logManager;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a new Injector
     */
    constructor(logManager: LogManager) {
        super();

        this._logManager = logManager;
        this._logger = this._logManager.getLogger(this);
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public hasMapping(type: any, name: String ): Boolean {
        // TODO: implement method using Kernel API
        this._logger.error("hasMapping method is not implemented.");
        return true;
    }

    /**
     * @inheritDoc
     */
    public hasDirectMapping(type: any, name: String ): Boolean {
        // TODO: implement method using Kernel API
        this._logger.error("hasDirectMapping method is not implemented.");
        return true;
    }

    /**
     * @inheritDoc
     */
    public satisfies(type: any, name: String ): Boolean {
        // TODO: implement method using Kernel API
        this._logger.error("satisfies method is not implemented.");
        return true;
    }

    /**
     * @inheritDoc
     */
    public satisfiesDirectly(type: any, name: String ): Boolean {
        // TODO: implement method using Kernel API
        this._logger.error("satisfiesDirectly method is not implemented.");
        return true;
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
        let childInjector: IInjector = new RobotlegsInjector(this._logManager);
        childInjector.parent = this;
        return childInjector;
    }
}
