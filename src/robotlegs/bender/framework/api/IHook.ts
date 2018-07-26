// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * A hook is expected to expose a "hook" method
 *
 * <p>Note: a hook does not need to implement this interface.
 * Any object that exposes a "hook" method can be used.</p>
 */
export interface IHook {
    hook(): void;
}
