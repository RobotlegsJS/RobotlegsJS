// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
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
export function instanceOfType(type: any): IMatcher {
    return new InstanceOfMatcher(type);
}

/**
 * @private
 */
class InstanceOfMatcher implements IMatcher {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _type: any;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(type: any) {
        this._type = type;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public matches(item: any): boolean {
        return item instanceof this._type;
    }
}
