// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export class LogMessageParser {
    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Parse a parametrized message
     *
     * @param message The message string
     * @param params The parameter values
     * @return The parsed message
     */
    public parseMessage(message: string, params: any[]): string {
        if (params && params.length) {
            let numParams: number = params.length;
            for (let i: number = 0; i < numParams; ++i) {
                message = message.split("{" + i + "}").join(params[i]);
            }
        }
        return message;
    }
}
