// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ITypeFilter } from "./ITypeFilter"

/**
 * Type matcher interface
 */
export interface ITypeMatcher {
    /**
     * Creates a Type Filter for this Type Matcher
     * @return The Type Filter
     */
    createTypeFilter(): ITypeFilter;
}
