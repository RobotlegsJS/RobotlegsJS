// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.dsl {

    import ITypeFilter = robotlegs.bender.extensions.matching.ITypeFilter;

    /**
     * View Processor Mapping
     */
    export interface IViewProcessorMapping {
        /**
         * The matcher for this mapping
         */
        matcher: ITypeFilter;

        /**
         * The processor for this mapping
         */
        processor: Object;

        /**
         * Sets the processor for this mapping
         */
        /*function set processor(value: Object): void;*/

        /**
         * The processor class for this mapping
         */
        processorClass: Class;

        /**
         * A list of guards to consult before allowing a view to be processed
         */
        guards: any[];

        /**
         * A list of hooks to run before processing a view
         */
        hooks: any[];
    }
}
