// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export class CommandPayload {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    /**
     * Ordered list of values
     */
    public get values(): any[] {
        return this._values;
    }

    /**
     * Ordered list of value classes
     */
    public get classes(): any[] {
        return this._classes;
    }

    /**
     * The number of payload items
     */
    public get length(): number {
        return this._classes ? this._classes.length : 0;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _values: any[];
    private _classes: any[];

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a command payload
     * @param values Optional values
     * @param classes Optional classes
     */
    constructor(values: any[] = null, classes: any[] = null) {
        this._values = values;
        this._classes = classes;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Adds an item to this payload
     * @param payloadValue The value
     * @param payloadClass The class of the value
     * @return Self
     */
    public addPayload(payloadValue: Object, payloadClass: Object): CommandPayload {
        if (this._values) {
            this._values.push(payloadValue);
        } else {
            this._values = [payloadValue];
        }
        if (this._classes) {
            this._classes.push(payloadClass);
        } else {
            this._classes = [payloadClass];
        }

        return this;
    }

    /**
     * Does this payload have any items?
     * @return Boolean
     */
    public hasPayload(): boolean {
        // todo: the final clause will make this fail silently
        // todo: rethink
        return this._values
            && this._values.length > 0
            && this._classes
            && this._classes.length > 0
            && this._classes.length === this._values.length;
    }
}
