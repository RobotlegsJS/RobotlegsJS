// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Detain/release pin Event
 */
export class PinEvent {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static DETAIN: string = "detain";

    public static RELEASE: string = "release";

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _type: string;
    private _instance: Object;
    private _target: any;

    /**
     * The type of event
     */
    public get type(): string {
        return this._type;
    }

    /**
     * The instance being detained or released
     */
    public get instance(): Object {
        return this._instance;
    }

    /**
     * The target of event
     */
    public get target(): any {
        return this._target;
    }

    public set target(value: any) {
        this._target = value;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Create a Pin Event
     * @param type The event type
     * @param instance The associated instance
     */
    constructor(type: string, instance: Object) {
        this._type = type;
        this._instance = instance;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): PinEvent {
        return new PinEvent(this.type, this._instance);
    }
}
