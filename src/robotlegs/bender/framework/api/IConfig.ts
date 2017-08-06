// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Optional application configuration interface
 *
 * <p>Note: a config does not need to implement this interface. But, it is highly recommended.</p>
 */
export interface IConfig {
    /**
     * Configure will be invoked after dependencies have been supplied
     */
    configure(): void;
}
