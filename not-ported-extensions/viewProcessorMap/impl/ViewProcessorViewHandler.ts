// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved. 
// 
//  NOTICE: You are permitted to use, modify, and distribute this file 
//  in accordance with the terms of the license agreement accompanying it. 
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.viewProcessorMap.impl {

    import Dictionary = flash.utils.Dictionary;
    import IViewProcessorMapping = robotlegs.bender.extensions.viewProcessorMap.dsl.IViewProcessorMapping;

    /**
     * @private
     */
    export class ViewProcessorViewHandler implements IViewProcessorViewHandler {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _mappings:any[] = [];

        private _knownMappings:Dictionary = new Dictionary(true);

        private _factory:IViewProcessorFactory;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(factory:IViewProcessorFactory):void {
            this._factory = factory;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public addMapping(mapping:IViewProcessorMapping):void {
            var index:number = this._mappings.indexOf(mapping);
            if (index > -1)
                return;
            this._mappings.push(mapping);
            this.flushCache();
        }

        /**
         * @inheritDoc
         */
        public removeMapping(mapping:IViewProcessorMapping):void {
            var index:number = this._mappings.indexOf(mapping);
            if (index == -1)
                return;
            this._mappings.splice(index, 1);
            this.flushCache();
        }

        /**
         * @inheritDoc
         */
        public processItem(item:Object, type:Class):void {
            var interestedMappings:any[] = this.getInterestedMappingsFor(item, type);
            if (interestedMappings)
                this._factory.runProcessors(item, type, interestedMappings);
        }

        /**
         * @inheritDoc
         */
        public unprocessItem(item:Object, type:Class):void {
            var interestedMappings:any[] = this.getInterestedMappingsFor(item, type);
            if (interestedMappings)
                this._factory.runUnprocessors(item, type, interestedMappings);
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private flushCache():void {
            this._knownMappings = new Dictionary(true);
        }

        private getInterestedMappingsFor(view:Object, type:Class):any[] {
            var mapping:IViewProcessorMapping;

            // we've seen this type before and nobody was interested
            if (this._knownMappings[type] === false)
                return null;

            // we haven't seen this type before
            if (this._knownMappings[type] == undefined) {
                this._knownMappings[type] = false;
                for each (mapping in this._mappings) {
                    if (mapping.matcher.matches(view)) {
                        if (!this._knownMappings[type])
                            this._knownMappings[type] = [];
                        this._knownMappings[type].push(mapping);
                    }
                }
                // nobody cares, let's get out of here
                if (this._knownMappings[type] === false)
                    return null;
            }

            // these mappings really do care
            return <Array>this._knownMappings[type] ;
        }
    }
}
