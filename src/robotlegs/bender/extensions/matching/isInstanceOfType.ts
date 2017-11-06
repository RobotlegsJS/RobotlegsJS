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
 * Matches primitive types using constructor.
 * Matches all other types using instanceof operator.
 *
 * According to TypeScript specification:
 *
 * 4.19.4 The instanceof operator
 *
 * The instanceof operator requires the left operand to be of type Any,
 * an object type, or a type parameter type, and the right operand
 * to be of type Any or a subtype of the 'Function' interface type.
 *
 * The result is always of the boolean primitive type.
 *
 * @param { any } item The item to test
 * @param { IType<T> } type The type to match to
 * @return { boolean } <code>true</code> if the item is a instance of the type,
 * <code>false</code> otherwise.
 *
 * @see {@link https://github.com/Microsoft/TypeScript/blob/v2.6.1/doc/spec.md#4.19.4}
 */
export function isInstanceOfType<T>(item: any, type: IType<T>): boolean {
    return item instanceof type || item.constructor === type;
}
