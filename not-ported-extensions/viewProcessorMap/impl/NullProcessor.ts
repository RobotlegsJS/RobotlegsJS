// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    /**
     * @private
     */
    export class NullProcessor {

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @private
         */
        public process(view: Object, type: Class, injector: any): void {
        }

        /**
         * @private
         */
        public unprocess(view: Object, type: Class, injector: any): void {
        }
    }

}

