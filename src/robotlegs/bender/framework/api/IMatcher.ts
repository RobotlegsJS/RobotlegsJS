// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Simple Object Matcher
 */
export interface IMatcher {
    /**
     * Does this object match the given criteria?
     *
     * @param item The object to test
     * @return boolean
     */
    matches(item: any): boolean;
}
