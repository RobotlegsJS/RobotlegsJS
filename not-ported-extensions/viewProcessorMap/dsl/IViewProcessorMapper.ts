// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.dsl {

    /**
     * Maps a matcher to a process
     */
    export interface IViewProcessorMapper {
        /**
         * Specifies the process to be mapped against the type or matcher.
         * @param processClassOrInstance An instance of a class, or a class implementing the following methods:
         * process(view: ISkinnable, class: Class, injector: Injector): void;
         * unprocess(view: ISkinnable, class: Class, injector: Injector): void;
         * @return the mapping config so that you can specify further details.
         */
         toProcess(processClassOrInstance: *): IViewProcessorMappingConfig;

        /**
         * Maps the type or matcher for injection.
         * @return the mapping config so that you can specify further details.
         */
         toInjection(): IViewProcessorMappingConfig;

        /**
         * Maps the type or matcher to a nothing-happens process, so that you can make use of guards and hooks.
         * @return the mapping config so that you can specify further details.
         */
         toNoProcess(): IViewProcessorMappingConfig;
    }
}
