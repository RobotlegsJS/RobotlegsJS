// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * Returns the fully qualified class name of an object. Support EcmaScript from v3 upto v6.
 *
 * @param {any} value The object for which a fully qualified class name is desired.
 * @return {string} A string containing the fully qualified class name.
 */
export function getQualifiedClassName(value: any): string {
    // es pattern
    let v3: RegExp = /function\ ([^\(]+)/;
    let v6: RegExp = /class\ ([^\ ]+)/;
    let classDescriptor: string = value.toString();
    let result: RegExpMatchArray = classDescriptor.match(v3) || classDescriptor.match(v6);

    return result[1];
}
