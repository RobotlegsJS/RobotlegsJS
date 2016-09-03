// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import Dictionary = flash.utils.Dictionary;
    import ITypeFilter = robotlegs.bender.extensions.matching.ITypeFilter;
    import IViewProcessorMapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapper;
    import IViewProcessorMapping = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapping;
    import IViewProcessorMappingConfig = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMappingConfig;
    import IViewProcessorUnmapper = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorUnmapper;
    import ILogger = robotlegs.bender.framework.api.ILogger;

    /**
     * @private
     */
    export class ViewProcessorMapper implements IViewProcessorMapper, IViewProcessorUnmapper {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _mappings:Dictionary = new Dictionary();

        private _handler:IViewProcessorViewHandler;

        private _matcher:ITypeFilter;

        private _logger:ILogger;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(matcher:ITypeFilter, handler:IViewProcessorViewHandler, logger:ILogger = null) {
            this._handler = handler;
            this._matcher = matcher;
            this._logger = logger;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public toProcess(processClassOrInstance:any):IViewProcessorMappingConfig {
            var mapping:IViewProcessorMapping = this._mappings[processClassOrInstance];
            return mapping
                ? this.overwriteMapping(mapping, processClassOrInstance)
                : this.createMapping(processClassOrInstance);
        }

        /**
         * @inheritDoc
         */
        public toInjection():IViewProcessorMappingConfig {
            return this.toProcess(this.ViewInjectionProcessor);
        }

        /**
         * @inheritDoc
         */
        public toNoProcess():IViewProcessorMappingConfig {
            return this.toProcess(this.NullProcessor);
        }

        /**
         * @inheritDoc
         */
        public fromProcess(processorClassOrInstance:any):void {
            var mapping:IViewProcessorMapping = this._mappings[processorClassOrInstance];
            mapping && this.deleteMapping(mapping);
        }

        /**
         * @inheritDoc
         */
        public fromAll():void {
            for (var processor:Object in this._mappings) {
                this.fromProcess(processor);
            }
        }

        /**
         * @inheritDoc
         */
        public fromNoProcess():void {
            this.fromProcess(this.NullProcessor);
        }

        /**
         * @inheritDoc
         */
        public fromInjection():void {
            this.fromProcess(this.ViewInjectionProcessor);
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private createMapping(processor:Object):ViewProcessorMapping {
            var mapping:ViewProcessorMapping = new ViewProcessorMapping(this._matcher, processor);
            this._handler.addMapping(mapping);
            this._mappings[processor] = mapping;
            this._logger && this._logger.debug('{0} mapped to {1}', [this._matcher, mapping]);
            return mapping;
        }

        private deleteMapping(mapping:IViewProcessorMapping):void {
            this._handler.removeMapping(mapping);
            delete this._mappings[mapping.processor];
            this._logger && this._logger.debug('{0} unmapped from {1}', [this._matcher, mapping]);
        }

        private overwriteMapping(mapping:IViewProcessorMapping,
            processClassOrInstance:any):IViewProcessorMappingConfig {
            this._logger && this._logger.warn('{0} is already mapped to {1}.\n' +
                'If you have overridden this mapping intentionally you can use "unmap()" ' +
                'prior to your replacement mapping in order to avoid seeing this message.\n',
                [this._matcher, mapping]);
            this.deleteMapping(mapping);
            return this.createMapping(processClassOrInstance);
        }
    }
}
