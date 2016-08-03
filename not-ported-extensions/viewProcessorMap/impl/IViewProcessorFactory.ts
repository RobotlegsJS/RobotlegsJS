// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    /**
     * @private
     */
    export interface IViewProcessorFactory {
        /**
         * @private
         */
         runProcessors(view: Object, type: Class, processorMappings: Array): void;

        /**
         * @private
         */
         runUnprocessors(view: Object, type: Class, processorMappings: Array): void;

        /**
         * @private
         */
         runAllUnprocessors(): void;
    }
}
