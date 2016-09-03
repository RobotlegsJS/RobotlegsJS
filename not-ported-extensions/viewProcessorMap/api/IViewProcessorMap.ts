// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.api {
    import ITypeMatcher = robotlegs.bender.extensions.matching.ITypeMatcher;
    import IViewProcessorMapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapper;
    import IViewProcessorUnmapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorUnmapper;

    /**
     * The View Processor Map allows you to bind views to processors
     */
    export interface IViewProcessorMap {
        /**
         * Maps a matcher that will be tested against incoming items to be handled.
         * @param matcher The type or package matcher specifying the rules for matching.
         * @return the mapper so that you can continue the mapping.
         */
         mapMatcher(matcher: ITypeMatcher): IViewProcessorMapper;

        /**
         * Maps a type that will be tested against incoming items to be handled.
         * Under the hood this will create a TypeMatcher for this type.
         * @param type The class or interface to be matched against.
         * @return the mapper so that you can continue the mapping.
         */
         map(type: Class): IViewProcessorMapper;

        /**
         * Removes a mapping that was made against a matcher.
         * No error will be thrown if there isn't a mapping to remove.
         * @param matcher The type or package matcher specifying the rules for matching.
         * @return the unmapper so that you can continue the unmapping.
         */
         unmapMatcher(matcher: ITypeMatcher): IViewProcessorUnmapper;

        /**
         * Removes a mapping that was made against a type.
         * No error will be thrown if there isn't a mapping to remove.
         * @param type The class or interface to be matched against.
         * @return the unmapper so that you can continue the unmapping.
         */
         unmap(type: Class): IViewProcessorUnmapper;

        /**
         * Processes an item directly. If the item matches any mapped matchers or types then it will be processed according to those mappings.
         * @param item The item to process.
         */
         process(item: Object): void;

        /**
         * Runs unprocess on relevant processors for an item if there are any.
         * @param item The item to unprocess.
         */
         unprocess(item: Object): void;
    }
}
