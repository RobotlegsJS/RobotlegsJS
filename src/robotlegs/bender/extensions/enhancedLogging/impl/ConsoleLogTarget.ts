// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../../../framework/api/IContext";
import { ILogTarget } from "../../../framework/api/ILogTarget";
import { LogLevel } from "../../../framework/api/LogLevel";
import { LogMessageParser } from "./LogMessageParser";

/**
 * A simple trace logger
 * @private
 */
export class ConsoleLogTarget implements ILogTarget {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _messageParser: LogMessageParser = new LogMessageParser();

    private _context: IContext;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Trace Log Target
     * @param context Context
     */
    constructor(context: IContext) {
        this._context = context;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public log(
        source: any,
        level: number,
        timestamp: number,
        message: string,
        params: any[] = null
    ): void {
        if (this._context.logLevel < level) {
            return;
        }

        switch (level) {
            case LogLevel.DEBUG:
                console.log(
                    timestamp,
                    this._context,
                    source,
                    this._messageParser.parseMessage(message, params)
                );
                break;

            case LogLevel.INFO:
                console.info(
                    timestamp,
                    this._context,
                    source,
                    this._messageParser.parseMessage(message, params)
                );
                break;

            case LogLevel.WARN:
                console.warn(
                    timestamp,
                    this._context,
                    source,
                    this._messageParser.parseMessage(message, params)
                );
                break;

            case LogLevel.ERROR:
                console.error(
                    timestamp,
                    this._context,
                    source,
                    this._messageParser.parseMessage(message, params)
                );
                break;

            case LogLevel.FATAL:
                console.error(
                    timestamp,
                    this._context,
                    source,
                    this._messageParser.parseMessage(message, params)
                );
                break;
        }
    }
}
