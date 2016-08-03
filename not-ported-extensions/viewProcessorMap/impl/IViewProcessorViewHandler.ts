// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {
    import IViewProcessorMapping = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapping;

    /**
     * @private
     */
    export interface IViewProcessorViewHandler {
        /**
         * @private
         */
         addMapping(mapping: IViewProcessorMapping): void;

        /**
         * @private
         */
         removeMapping(mapping: IViewProcessorMapping): void;

        /**
         * @private
         */
         processItem(item: Object, type: Class): void;

        /**
         * @private
         */
         unprocessItem(item: Object, type: Class): void;
    }
}
