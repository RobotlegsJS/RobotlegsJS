// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { guid } from "inversify";

/**
 * Utility for generating unique object IDs
 */
export class UID {
    /**
     * Generates a UID for a given source object or class
     * @param source The source object or class
     * @return Generated UID
     */
    public static create(source?: any): string {
        return guid();
    }
}
