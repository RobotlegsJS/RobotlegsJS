// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../../framework/api/IMatcher";


/**
 * A Type Filter describes a Type Matcher
 */
export interface ITypeFilter extends IMatcher {
    /**
     * All types that an item must extend or implement
     */
    allOfTypes: FunctionConstructor[];

    /**
     * Any types that an item must extend or implement
     */
    anyOfTypes: FunctionConstructor[];

    /**
     * Types that an item must not extend or implement
     */
    noneOfTypes: FunctionConstructor[];

    /**
     * Unique description for this filter
     */
    descriptor: string;
}
