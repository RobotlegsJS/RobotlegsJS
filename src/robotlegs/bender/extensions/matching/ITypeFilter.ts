// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IMatcher } from "../../framework/api/IMatcher";

import { IType } from "./IType";

/**
 * A Type Filter describes a Type Matcher
 */
export interface ITypeFilter extends IMatcher {
    /**
     * All types that an item must extend or implement
     */
    allOfTypes: Array<IType<any>>;

    /**
     * Any types that an item must extend or implement
     */
    anyOfTypes: Array<IType<any>>;

    /**
     * Types that an item must not extend or implement
     */
    noneOfTypes: Array<IType<any>>;

    /**
     * Unique description for this filter
     */
    descriptor: string;
}
