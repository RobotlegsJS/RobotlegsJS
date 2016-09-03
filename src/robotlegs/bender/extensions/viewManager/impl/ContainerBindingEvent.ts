// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export class ContainerBindingEvent extends Event {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static BINDING_EMPTY: string = "bindingEmpty";

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(type: string) {
        super(type);
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): Event {
        return new ContainerBindingEvent(this.type);
    }
}
