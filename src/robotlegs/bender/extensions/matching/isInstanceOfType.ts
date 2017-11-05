// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IType } from "./IType";

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * Verify if a given item is a instance of a given type.
 *
 * @param { any } item The item to test
 * @param { IType<T> } type The type to match to
 * @return { boolean } <code>true</code> if the item is a instance of the type, <code>false</code> otherwise.
 */
export function isInstanceOfType<T>(item: any, type: IType<T>): boolean {
    return item instanceof type || item.constructor === type;
}
