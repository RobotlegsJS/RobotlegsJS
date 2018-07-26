// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
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
            params.forEach((value: any, index: number) => {
                message = message.replace(`{${index}}`, value);
            });
        }
        return message;
    }
}
