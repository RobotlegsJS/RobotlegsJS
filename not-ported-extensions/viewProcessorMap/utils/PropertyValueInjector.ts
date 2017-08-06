// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.utils {

    import IInjector = robotlegs.bender.framework.api.IInjector;

    /**
     * Avoids view reflection by using a provided map
     * of property names to dependency values
     */
    export class PropertyValueInjector {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _valuesByPropertyName:Object;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * Creates a Value Property Injection Processor
         *
         * <code>
         *     new PropertyValueInjector({
         *         userService: myUserService,
         *         userPM: myUserPM
         *     })
         * </code>
         *
         * @param valuesByPropertyName A map of property names to dependency values
         */
        constructor(valuesByPropertyName:Object) {
            this._valuesByPropertyName = valuesByPropertyName;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @private
         */
        public process(view:Object, type:Class, injector:IInjector):void {
            for (var propName:string in this._valuesByPropertyName) {
                view[propName] = this._valuesByPropertyName[propName];
            }
        }

        /**
         * @private
         */
        public unprocess(view:Object, type:Class, injector:IInjector):void {
        }
    }
}
