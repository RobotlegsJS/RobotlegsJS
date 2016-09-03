// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import Dictionary = flash.utils.Dictionary;
    import IInjector = robotlegs.bender.framework.api.IInjector;

    /**
     * Default View Injection Processor implementation
     * @private
     */
    export class ViewInjectionProcessor {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _injectedObjects: Dictionary = new Dictionary(true);

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @private
         */
        public process(view: Object, type: Class, injector: IInjector): void {
            this._injectedObjects[view] || this.injectAndRemember(view, injector);
        }

        /**
         * @private
         */
        public unprocess(view: Object, type: Class, injector: IInjector): void {
            // assumption is that teardown is not wanted.
            // if you *do* want teardown, copy this class
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private injectAndRemember(view: Object, injector: IInjector): void {
            injector.injectInto(view);
            this._injectedObjects[view] = true;
        }
    }
}
