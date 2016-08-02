// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ITypeMatcher } from "./ITypeMatcher";
import { TypeMatcher } from "./TypeMatcher";

/**
 * Type Matcher Factory
 */
export interface ITypeMatcherFactory extends ITypeMatcher {
    /**
     * Creates a clone of this matcher
     * @return The clone
     */
    clone(): TypeMatcher;
}
