// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * The Context View represents the root any for a Context
 */
export class ContextView {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _view: any;

    /**
     * The root DisplayObjectContainer for this Context
     */
    public get view(): any {
        return this._view;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * The Context View represents the root any for a Context
     * @param view The root any for this Context
     */
    constructor(view: any) {
        this._view = view;
    }
}
