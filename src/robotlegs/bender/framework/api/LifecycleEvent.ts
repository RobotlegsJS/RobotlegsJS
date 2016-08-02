// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Robotlegs object lifecycle event
 */
export class LifecycleEvent {

    /*============================================================================*/
    /* Public Static Properties                                                   */
    /*============================================================================*/

    public static ERROR: string = "_error";

    public static STATE_CHANGE: string = "stateChange";

    public static PRE_INITIALIZE: string = "preInitialize";

    public static INITIALIZE: string = "initialize";

    public static POST_INITIALIZE: string = "postInitialize";

    public static PRE_SUSPEND: string = "preSuspend";

    public static SUSPEND: string = "suspend";

    public static POST_SUSPEND: string = "postSuspend";

    public static PRE_RESUME: string = "preResume";

    public static RESUME: string = "resume";

    public static POST_RESUME: string = "postResume";

    public static PRE_DESTROY: string = "preDestroy";

    public static DESTROY: string = "destroy";

    public static POST_DESTROY: string = "postDestroy";

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _error: Error;
    private _type: string;
    public target: any;

    /**
     * Associated lifecycle error
     */
    public get error(): Error { return this._error; }
    public get type(): string { return this._type; }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Lifecycle Event
     * @param type The event type
     * @param error Optional error
     */
    constructor(type: string, error?: Error) {
        // super(type);
        this._type = type;
        this._error = error;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public clone(): LifecycleEvent {
        return new LifecycleEvent(this.type, this.error);
    }
}
