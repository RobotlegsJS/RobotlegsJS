// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * A guard is expected to expose an "approve" method that returns a boolean
 *
 * <p>Note: a guard does not need to implement this interface.
 * Any object that exposes an "approve" method can be used as a guard.</p>
 */
export interface IGuard {
    /**
     * Does this guard approve of this action?
     * @return Approval
     */
    approve(): boolean;
}
