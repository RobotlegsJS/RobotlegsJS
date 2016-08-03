// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import DisplayObject = flash.display.DisplayObject;
    import Dictionary = flash.utils.Dictionary;
    import ITypeMatcher = robotlegs.bender.extensions.matching.ITypeMatcher;
    import TypeMatcher = robotlegs.bender.extensions.matching.TypeMatcher;
    import IViewHandler = robotlegs.bender.extensions.viewManager.api.IViewHandler;
    import IViewProcessorMap = robotlegs.bender.extensions.viewProcessorMap.api.IViewProcessorMap;
    import IViewProcessorMapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapper;
    import IViewProcessorUnmapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorUnmapper;

    /**
     * View Processor Map implementation
     * @private
     */
    export class ViewProcessorMap implements IViewProcessorMap, IViewHandler {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _mappers:Dictionary = new Dictionary();

        private _handler:IViewProcessorViewHandler;

        private NULL_UNMAPPER:IViewProcessorUnmapper = new NullViewProcessorUnmapper();

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(factory:IViewProcessorFactory, handler:IViewProcessorViewHandler = null) {
            this._handler = handler || new ViewProcessorViewHandler(factory);
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public mapMatcher(matcher:ITypeMatcher):IViewProcessorMapper {
            return this._mappers[matcher.createTypeFilter().descriptor] ||this.= this.createMapper(matcher);
        }

        /**
         * @inheritDoc
         */
        public map(type:Class):IViewProcessorMapper {
            var matcher:ITypeMatcher = new TypeMatcher().allOf(type);
            return this.mapMatcher(matcher);
        }

        /**
         * @inheritDoc
         */
        public unmapMatcher(matcher:ITypeMatcher):IViewProcessorUnmapper {
            return this._mappers[matcher.createTypeFilter().descriptor] || this.NULL_UNMAPPER;
        }

        /**
         * @inheritDoc
         */
        public unmap(type:Class):IViewProcessorUnmapper {
            var matcher:ITypeMatcher = new TypeMatcher().allOf(type);
            return this.unmapMatcher(matcher);
        }

        /**
         * @inheritDoc
         */
        public process(item:Object):void {
            var type:Class = <Class>item.constructor ;
            this._handler.processItem(item, type);
        }

        /**
         * @inheritDoc
         */
        public unprocess(item:Object):void {
            var type:Class = <Class>item.constructor ;
            this._handler.unprocessItem(item, type);
        }

        /**
         * @inheritDoc
         */
        public handleView(view:DisplayObject, type:Class):void {
            this._handler.processItem(view, type);
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private createMapper(matcher:ITypeMatcher):IViewProcessorMapper {
            return new ViewProcessorMapper(matcher.createTypeFilter(), this._handler);
        }
    }

}
