// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

/**
 * The Robotlegs log target contract
 */
export interface ILogTarget {
    /**
     * Captures a log message
     *
     * @param source The source of the log message
     * @param level The log level of the message
     * @param timestamp getTimer() timestamp
     * @param message The log message
     * @param params Message parameters
     */
    log(source: any, level: number, timestamp: number, message: string, params: any[]): void;
}
