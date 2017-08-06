// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.vigilance {

    import InjectorError = org.swiftsuspenders.errors.InjectorError;
    import MappingEvent = org.swiftsuspenders.mapping.MappingEvent;
    import LogMessageParser = robotlegs.bender.extensions.enhancedLogging.impl.LogMessageParser;
    import IContext = robotlegs.bender.framework.api.IContext;
    import IExtension = robotlegs.bender.framework.api.IExtension;
    import ILogTarget = robotlegs.bender.framework.api.ILogTarget;
    import LogLevel = robotlegs.bender.framework.api.LogLevel;

    /**
     * The Vigilance Extension throws Errors when warnings are logged.
     */
    export class VigilanceExtension implements IExtension, ILogTarget {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _messageParser: LogMessageParser = new LogMessageParser();

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public extend(context: IContext): void {
            context.injector.instantiateUnmapped(this.MetadataChecker).check();
            context.addLogTarget(this);
            context.injector.addEventListener(MappingEvent.MAPPING_OVERRIDE, this.mappingOverrideHandler)
        }

        /**
         * @inheritDoc
         */
        public log(source: Object, level: number, timestamp: number, message: string, params: any[] = null): void {
            if (level <= LogLevel.WARN) {
                throw new VigilantError(this._messageParser.parseMessage(message, params));
            }
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private mappingOverrideHandler(event: MappingEvent): void {
            throw new InjectorError("Injector mapping override for type " +
                event.mappedType + " with name " + event.mappedName);
        }
    }
}

import VigilantError = robotlegs.bender.extensions.vigilance.VigilantError;
import IContext = robotlegs.bender.framework.api.IContext;

class MetadataChecker {
    /*[Inject(optional=true)]*/
    public context: IContext;

    public check(): void {
        if (this.context == null) {
            throw new VigilantError(
                "It looks like custom metadata is being ignored by your compiler. " +
                "If you're compiling with the Flash IDE you need to open your " +
                '"Publish Settings" and select "Publish SWC". ' +
                "See: https: //github.com/robotlegs/robotlegs-framework/wiki/Common-Problems");
        }
    }
