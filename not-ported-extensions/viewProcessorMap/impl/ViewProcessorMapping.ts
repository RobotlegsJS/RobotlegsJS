// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import ITypeFilter = robotlegs.bender.extensions.matching.ITypeFilter;
    import IViewProcessorMapping = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapping;
    import IViewProcessorMappingConfig = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMappingConfig;

    /**
     * @private
     */
    export class ViewProcessorMapping implements IViewProcessorMapping, IViewProcessorMappingConfig {

        /*============================================================================*/
        /* Public Properties                                                          */
        /*============================================================================*/

        private _matcher:ITypeFilter;

        /**
         * @inheritDoc
         */
        public get matcher():ITypeFilter {
            return this._matcher;
        }

        private _processor:Object;

        /**
         * @inheritDoc
         */
        public get processor():Object {
            return this._processor;
        }

        /**
         * @inheritDoc
         */
        public set processor(value:Object) {
            this._processor = value;
        }

        private _processorClass:Class;

        /**
         * @inheritDoc
         */
        public get processorClass():Class {
            return this._processorClass;
        }

        private _guards:any[] = [];

        /**
         * @inheritDoc
         */
        public get guards():any[] {
            return this._guards;
        }

        private _hooks:any[] = [];

        /**
         * @inheritDoc
         */
        public get hooks():any[] {
            return this._hooks;
        }

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(matcher:ITypeFilter, processor:Object) {
            this._matcher = matcher;

            this.setProcessor(processor);
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public withGuards(... guards):IViewProcessorMappingConfig {
            this._guards = this._guards.concat.apply(null, guards);
            return this;
        }

        /**
         * @inheritDoc
         */
        public withHooks(... hooks):IViewProcessorMappingConfig {
            this._hooks = this._hooks.concat.apply(null, hooks);
            return this;
        }

        public toString():string {
            return 'Processor ' + this._processor;
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private setProcessor(processor:Object):void {
            if (processor instanceof Class) {
                this._processorClass = <Class>processor ;
            }
            else {
                this._processor = processor;
                this._processorClass = this._processor.constructor;
            }
        }
    }

}
