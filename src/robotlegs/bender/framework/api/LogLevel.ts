// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Robotlegs log level
 */
export class LogLevel {
    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static FATAL: number = 2;

    public static ERROR: number = 4;

    public static WARN: number = 8;

    public static INFO: number = 16;

    public static DEBUG: number = 32;

    public static NAME: any[] = [
        0,
        0,
        "FATAL", // 2
        0,
        "ERROR", // 4
        0,
        0,
        0,
        "WARN", // 8
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "INFO", // 16
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "DEBUG"
    ]; // 32
}
