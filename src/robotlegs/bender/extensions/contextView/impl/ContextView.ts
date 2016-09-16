// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContextView } from "../api/IContextView";

/**
 * The Context View represents the root any for a Context
 */
export class ContextView implements IContextView {

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
