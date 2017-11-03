// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../../framework/api/IMatcher";

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * Creates a matcher that matches objects of the given type
 * @param type The type to match
 * @return A matcher
 */
export function instanceOfType(type: Function): IMatcher {
    return new InstanceOfMatcher(type);
}

/**
 * @private
 */
class InstanceOfMatcher implements IMatcher {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _type: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(type: Function) {
        this._type = type;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
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
     * The result is always of the Boolean primitive type.
     *
     * @see {@link https://github.com/Microsoft/TypeScript/blob/v2.6.1/doc/spec.md#4.19.4}
     */
    public matches(item: any): boolean {
        let match: boolean = false;

        switch (typeof item) {
            case "boolean":
            case "function":
            case "number":
            case "string":
            case "symbol":
                match = item.constructor === this._type;
                break;

            default:
                match = item instanceof this._type;
                break;
        }

        return match;
    }
}
