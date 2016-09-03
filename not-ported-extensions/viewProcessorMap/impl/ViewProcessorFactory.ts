// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import DisplayObject = flash.display.DisplayObject;
    import Event = flash.events.Event;
    import Dictionary = flash.utils.Dictionary;
    import InjectorInterfaceConstructionError = org.swiftsuspenders.errors.InjectorInterfaceConstructionError;
    import ITypeFilter = robotlegs.bender.extensions.matching.ITypeFilter;
    import ViewProcessorMapError = robotlegs.bender.extensions.viewProcessorMap.api.ViewProcessorMapError;
    import IViewProcessorMapping = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapping;
    import IInjector = robotlegs.bender.framework.api.IInjector;
    import applyHooks = robotlegs.bender.framework.impl.applyHooks;
    import guardsApprove = robotlegs.bender.framework.impl.guardsApprove;

    /**
     * @private
     */
    export class ViewProcessorFactory implements IViewProcessorFactory {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _injector: IInjector;

        private _listenersByView: Dictionary = new Dictionary(true);

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(injector: IInjector) {
            this._injector = injector;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public runProcessors(view: Object, type: Class, processorMappings: any[]): void {
            this.createRemovedListener(view, type, processorMappings);

            var filter: ITypeFilter;

            for each (var mapping: IViewProcessorMapping in processorMappings) {
                filter = mapping.matcher;
                this.mapTypeForFilterBinding(filter, type, view);
                this.runProcess(view, type, mapping);
                this.unmapTypeForFilterBinding(filter, type, view);
            }
        }

        /**
         * @inheritDoc
         */
        public runUnprocessors(view: Object, type: Class, processorMappings: any[]): void {
            for each (var mapping: IViewProcessorMapping in processorMappings) {
                // ?? Is this correct - will assume that people are implementing something sensible in their processors.
                mapping.processor ||this.= this.createProcessor(mapping.processorClass);
                mapping.processor.unprocess(view, type, this._injector);
            }
        }

        /**
         * @inheritDoc
         */
        public runAllUnprocessors(): void {
            for each (var removalHandlers: any[] in this._listenersByView) {
                var iLength: number = removalHandlers.length;
                for (var i: number = 0; i < iLength; i++) {
                    removalHandlers[i](null);
                }
            }
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private runProcess(view: Object, type: Class, mapping: IViewProcessorMapping): void {
            if (guardsApprove(mapping.guards, this._injector)) {
                mapping.processor ||this.= this.createProcessor(mapping.processorClass);
                applyHooks(mapping.hooks, this._injector);
                mapping.processor.process(view, type, this._injector);
            }
        }

        private createProcessor(processorClass: Class): Object {
            if (!this._injector.hasMapping(processorClass)) {
                this._injector.map(processorClass).asSingleton();
            }

            try {
                return this._injector.getInstance(processorClass);
            }
            catch (error: InjectorInterfaceConstructionError) {
                var errorMsg: string = "The view processor "
                    + processorClass
                    + " has not been mapped in the injector, "
                    + "and it is not possible to instantiate an interface. "
                    + "Please map a concrete type against this interface.";
                throw(new ViewProcessorMapError(errorMsg));
            }
            return null;
        }

        private mapTypeForFilterBinding(filter: ITypeFilter, type: Class, view: Object): void {
            var requiredType: Class;
            var requiredTypes: Class[] = this.requiredTypesFor(filter, type);

            for each (requiredType in requiredTypes) {
                this._injector.map(requiredType).toValue(view);
            }
        }

        private unmapTypeForFilterBinding(filter: ITypeFilter, type: Class, view: Object): void
        {
            var requiredType: Class;
            var requiredTypes: Class[] = this.requiredTypesFor(filter, type);

            for each (requiredType in requiredTypes) {
                if (this._injector.hasDirectMapping(requiredType))
                    this._injector.unmap(requiredType);
            }
        }

        private requiredTypesFor(filter: ITypeFilter, type: Class): Class[] {
            var requiredTypes: Class[] = filter.allOfTypes.concat(filter.anyOfTypes);

            if (requiredTypes.indexOf(type) == -1)
                requiredTypes.push(type);

            return requiredTypes;
        }

        private createRemovedListener(view: Object, type: Class, processorMappings: any[]): void {
            if (view instanceof DisplayObject) {
                if (!this._listenersByView[view])
                    this._listenersByView[view] = [];

                var handler: Function = function(e: Event):void {
                    this.runUnprocessors(view, type, processorMappings);
                    (<DisplayObject>view ).removeEventListener(Event.REMOVED_FROM_STAGE, handler);
                    this.removeHandlerFromView(view, handler);
                };

                this._listenersByView[view].push(handler);
                (<DisplayObject>view ).addEventListener(Event.REMOVED_FROM_STAGE, handler, false, 0, true);
            }
        }

        private removeHandlerFromView(view:Object, handler:Function):void {
            if (this._listenersByView[view] && (this._listenersByView[view].length > 0)) {
                var handlerIndex:number = this._listenersByView[view].indexOf(handler);
                this._listenersByView[view].splice(handlerIndex, 1);
                if (this._listenersByView[view].length == 0) {
                    delete this._listenersByView[view];
                }
            }
        }
    }
}
