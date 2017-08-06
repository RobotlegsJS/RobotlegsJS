// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ILogger } from "../api/ILogger";
import { ILogTarget } from "../api/ILogTarget";
import { LogLevel } from "../api/LogLevel";

/**
 * Default Robotlegs logger
 *
 * @private
 */
export class Logger implements ILogger {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _source: any;

    private _target: ILogTarget;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a new logger
     * @param source The log source object
     * @param target The log target
     */
    constructor(source: any, target: ILogTarget) {
        this._source = source;
        this._target = target;
    }

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public set source(source: any) {
        this._source = source;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public debug(message: any, params?: any[]): void {
        this._target.log(this._source, LogLevel.DEBUG, this.getTimer(), message, params);
    }

    /**
     * @inheritDoc
     */
    public info(message: any, params?: any[]): void {
        this._target.log(this._source, LogLevel.INFO, this.getTimer(), message, params);
    }

    /**
     * @inheritDoc
     */
    public warn(message: any, params?: any[]): void {
        this._target.log(this._source, LogLevel.WARN, this.getTimer(), message, params);
    }

    /**
     * @inheritDoc
     */
    public error(message: any, params?: any[]): void {
        this._target.log(this._source, LogLevel.ERROR, this.getTimer(), message, params);
    }

    /**
     * @inheritDoc
     */
    public fatal(message: any, params?: any[]): void {
        this._target.log(this._source, LogLevel.FATAL, this.getTimer(), message, params);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private getTimer(): number {
        return Date.now();
    }
}
