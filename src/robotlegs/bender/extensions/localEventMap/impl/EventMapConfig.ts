// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";

/**
 * @private
 */
export class EventMapConfig {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _dispatcher: IEventDispatcher | EventTarget;

    /**
     * @private
     */
    public get dispatcher(): IEventDispatcher | EventTarget {
        return this._dispatcher;
    }

    private _eventString: string;

    /**
     * @private
     */
    public get eventString(): string {
        return this._eventString;
    }

    private _listener: Function;
    private _thisObject: any;

    /**
     * @private
     */
    public get listener(): Function {
        return this._listener;
    }

    /**
     * @private
     */
    public get thisObject(): Function {
        return this._thisObject;
    }

    private _eventClass: Object;

    /**
     * @private
     */
    public get eventClass(): Object {
        return this._eventClass;
    }

    private _callback: Function;

    /**
     * @private
     */
    public get callback(): Function {
        return this._callback;
    }

    private _useCapture: boolean;

    /**
     * @private
     */
    public get useCapture(): boolean {
        return this._useCapture;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(
        dispatcher: IEventDispatcher | EventTarget,
        eventString: string,
        listener: Function,
        thisObject: any,
        eventClass: Object,
        callback: Function,
        useCapture: boolean
    ) {
        this._dispatcher = dispatcher;
        this._eventString = eventString;
        this._listener = listener;
        this._thisObject = thisObject;
        this._eventClass = eventClass;
        this._callback = callback;
        this._useCapture = useCapture;
    }

    public equalTo(
        dispatcher: IEventDispatcher | EventTarget,
        eventString: string,
        listener: Function,
        thisObject: any,
        eventClass: Object,
        useCapture: boolean
    ): boolean {
        return this._eventString === eventString
            && this._eventClass === eventClass
            && this._thisObject === thisObject
            && this._dispatcher === dispatcher
            && this._listener === listener
            && this._useCapture === useCapture;
    }
}
