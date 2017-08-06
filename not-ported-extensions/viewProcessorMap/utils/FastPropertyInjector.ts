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
     * of property names to dependency types
     */
    export class FastPropertyInjector {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _propertyTypesByName:Object;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * Creates a Fast Property Injection Processor
         *
         * <code>
         *     new FastPropertyInjector({
         *         userService: IUserService,
         *         userPM: UserPM
         *     })
         * </code>
         *
         * @param propertyTypesByName A map of property names to dependency types
         */
        constructor(propertyTypesByName:Object) {
            this._propertyTypesByName = propertyTypesByName;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @private
         */
        public process(view:Object, type:Class, injector:IInjector):void {
            for (var propName:string in this._propertyTypesByName) {
                view[propName] = injector.getInstance(this._propertyTypesByName[propName]);
            }
        }

        /**
         * @private
         */
        public unprocess(view:Object, type:Class, injector:IInjector):void {
        }
    }
}
