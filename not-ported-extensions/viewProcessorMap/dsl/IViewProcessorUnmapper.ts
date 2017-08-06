// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.dsl {

    /**
     * Unmaps a view processor
     */
    export interface IViewProcessorUnmapper {
        /**
         * Unmaps a processor from a matcher
         * @param processorClassOrInstance
         */
         fromProcess(processorClassOrInstance: *): void;

        /**
         * Unmaps a matcher
         */
         fromNoProcess(): void;

        /**
         * Unmaps an injection processor
         */
         fromInjection(): void;

        /**
         * Unmaps all processors from this matcher
         */
         fromAll(): void;
    }
}
