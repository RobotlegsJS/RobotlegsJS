// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------


/**
 * View Configuration Event
 * @private
 */
export class ConfigureViewEvent extends Event {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static CONFIGURE_VIEW: string = 'configureView';

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _view: any;

    /**
     * The view instance associated with this event
     */
    public get view(): any {
        return this._view;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a view configuration event
     * @param type The event type
     * @param view The associated view instance
     */
    constructor(type: string, view?: any) {
        // super(type, true, true);
        super(type);
        this._view = view;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): Event {
        return new ConfigureViewEvent(this.type, this._view);
    }
}
