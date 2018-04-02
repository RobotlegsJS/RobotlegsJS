// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../../framework/api/IMatcher";

import { isInstanceOfType } from "./isInstanceOfType";
import { IType } from "./IType";

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * @private
 */
class InstanceOfTypeMatcher<T> implements IMatcher {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _type: IType<T>;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(type: IType<T>) {
        this._type = type;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Verify if the given item is a instance of this type.
     *
     * @param { any } item The item to test
     * @return { boolean } <code>true</code> if the item is a instance of the type,
     * <code>false</code> otherwise.
     */
    public matches(item: any): boolean {
        return isInstanceOfType<T>(item, this._type);
    }
}

/**
 * Creates a matcher that matches objects of the given type
 * @param type The type to match
 * @return A matcher
 */
export function instanceOfType<T>(type: IType<T>): IMatcher {
    return new InstanceOfTypeMatcher<T>(type);
}
