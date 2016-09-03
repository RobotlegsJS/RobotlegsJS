// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ITypeFilter } from "./ITypeFilter";

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
