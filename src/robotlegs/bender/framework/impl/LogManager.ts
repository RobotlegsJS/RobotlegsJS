// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ILogger } from "../api/ILogger";
import { ILogTarget } from "../api/ILogTarget";
import { LogLevel } from "../api/LogLevel";
import { Logger } from "../impl/Logger";

/**
 * The log manager creates loggers and is itself a log target
 *
 * @private
 */
export class LogManager implements ILogTarget {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _logLevel: number = LogLevel.INFO;

    /**
     * The current log level
     */
    public get logLevel(): number {
        return this._logLevel;
    }

    /**
     * Sets the current log level
     */
    public set logLevel(value: number) {
        this._logLevel = value;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _targets: ILogTarget[] = [];

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Retrieves a logger for a given source
     * @param source Logging source
     * @return Logger
     */
    public getLogger(source: Object): ILogger {
        return new Logger(source, this);
    }

    /**
     * Adds a custom log target
     * @param target Log target
     * @return this
     */
    public addLogTarget(target: ILogTarget): void {
        this._targets.push(target);
    }

    /**
     * @inheritDoc
     */
    public log(
        source: Object,
        level: number,
        timestamp: number,
        message: string,
        params: any[] = null): void {

        if (level > this._logLevel) {
            return;
        }

        this._targets.forEach( (target: ILogTarget) => { target.log(source, level, timestamp, message, params); } );
    }

    public removeAllTargets(): void {
        this._targets = [];
    }
}
