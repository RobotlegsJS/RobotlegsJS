// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export class DomEventMapConfig {
    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    private _dispatcher: EventTarget;

    /**
     * @private
     */
    public get dispatcher(): EventTarget {
        return this._dispatcher;
    }

    private _eventString: string;

    /**
     * @private
     */
    public get eventString(): string {
        return this._eventString;
    }

    private _listener: EventListenerOrEventListenerObject;

    /**
     * @private
     */
    public get listener(): EventListenerOrEventListenerObject {
        return this._listener;
    }

    private _options: boolean | AddEventListenerOptions;

    /**
     * @private
     */
    public get options(): boolean | AddEventListenerOptions {
        return this._options;
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(
        dispatcher: EventTarget,
        eventString: string,
        listener: EventListenerOrEventListenerObject,
        options: boolean | AddEventListenerOptions
    ) {
        this._dispatcher = dispatcher;
        this._eventString = eventString;
        this._listener = listener;
        this._options = options;
    }

    public equalTo(
        dispatcher: EventTarget,
        eventString: string,
        listener: EventListenerOrEventListenerObject,
        options: boolean | AddEventListenerOptions
    ): boolean {
        return (
            this._dispatcher === dispatcher &&
            this._eventString === eventString &&
            this._listener === listener &&
            this._options === options
        );
    }
}
