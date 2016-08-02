// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.utils {

    import Dictionary = flash.utils.Dictionary;
    import IInjector = robotlegs.bender.framework.api.IInjector;

    /**
     * Simple Mediator creation processor
     */
    export class MediatorCreator {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _mediatorClass:Class;

        private _createdMediatorsByView:Dictionary = new Dictionary(true);

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * Mediator Creator Processor
         * @param mediatorClass The mediator class to create
         */
        constructor(mediatorClass:Class) {
            this._mediatorClass = mediatorClass;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @private
         */
        public process(view:Object, type:Class, injector:IInjector):void {
            if (this._createdMediatorsByView[view]) {
                return;
            }
            var mediator:any = injector.instantiateUnmapped(this._mediatorClass);
            this._createdMediatorsByView[view] = mediator;
            this.initializeMediator(view, mediator);
        }

        /**
         * @private
         */
        public unprocess(view:Object, type:Class, injector:IInjector):void {
            if (this._createdMediatorsByView[view]) {
                this.destroyMediator(this._createdMediatorsByView[view]);
                delete this._createdMediatorsByView[view];
            }
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private initializeMediator(view:Object, mediator:Object):void {
            if ('preInitialize' in mediator)
                mediator.preInitialize();

            if ('viewComponent' in mediator)
                mediator.viewComponent = view;

            if ('initialize' in mediator)
                mediator.initialize();

            if ('postInitialize' in mediator)
                mediator.postInitialize();
        }

        private destroyMediator(mediator:Object):void {
            if ('preDestroy' in mediator)
                mediator.preDestroy();

            if ('destroy' in mediator)
                mediator.destroy();

            if ('viewComponent' in mediator)
                mediator.viewComponent = null;

            if ('postDestroy' in mediator)
                mediator.postDestroy();
        }
    }
}
