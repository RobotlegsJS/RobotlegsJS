// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import IViewProcessorUnmapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorUnmapper;

    /**
     * @private
     */
    export class NullViewProcessorUnmapper implements IViewProcessorUnmapper {

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @private
         */
        public fromProcess(processorClassOrInstance: any): void {
        }

        /**
         * @private
         */
        public fromAll(): void {
        }

        /**
         * @private
         */
        public fromNoProcess(): void {
        }

        /**
         * @private
         */
        public fromInjection(): void {
        }
    }
}
