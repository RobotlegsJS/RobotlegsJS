// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
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
    allOfTypes: IType<any>[];

    /**
     * Any types that an item must extend or implement
     */
    anyOfTypes: IType<any>[];

    /**
     * Types that an item must not extend or implement
     */
    noneOfTypes: IType<any>[];

    /**
     * Unique description for this filter
     */
    descriptor: string;
}
