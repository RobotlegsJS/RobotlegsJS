// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.impl {

    import Event = flash.events.Event;
    import IContext = robotlegs.bender.framework.api.IContext;

    /**
     * Module Context Event
     * @private
     */
    export class ModularContextEvent extends Event {

        /*============================================================================*/
        /* Public Static Properties                                                   */
        /*============================================================================*/

        public static CONTEXT_ADD: string = "contextAdd";

        /*============================================================================*/
        /* Public Properties                                                          */
        /*============================================================================*/

        private _context: IContext;

        /**
         * The context associated with this event
         */
        public get context(): IContext {
            return this._context;
        }

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * Creates a Module Context Event
         * @param type The event type
         * @param context The associated context
         */
        constructor(type: string, context: IContext) {
            super(type, true, true);
            this._context = context;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        /*override*/ public clone(): Event {
            return new ModularContextEvent(this.type, this.context);
        }

        /*override*/ public toString(): string {
            return this.formatToString("ModularContextEvent", "context");
        }
    }
}
