// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";

/**
 * Relays events from a source to a destination
 */
export class EventRelay {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _source: IEventDispatcher;

    private _destination: IEventDispatcher;

    private _types: any[];

    private _active: boolean;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Relays events from the source to the destination
     * @param source Event Dispatcher
     * @param destination Event Dispatcher
     * @param types The list of event types to relay
     */
    constructor(source: IEventDispatcher, destination: IEventDispatcher, types: any[] = null) {
        this._source = source;
        this._destination = destination;
        this._types = types || [];
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Start relaying events
     * @return Self
     */
    public start(): EventRelay {
        if (!this._active) {
            this._active = true;
            this.addListeners();
        }
        return this;
    }

    /**
     * Stop relaying events
     * @return Self
     */
    public stop(): EventRelay {
        if (this._active) {
            this._active = false;
            this.removeListeners();
        }
        return this;
    }

    /**
     * Add a new event type to relay
     * @param eventType
     */
    public addType(eventType: string): void {
        this._types.push(eventType);
        if (this._active) {
            this.addListener(eventType);
        }
    }

    /**
     * Remove a relay event type
     * @param eventType
     */
    public removeType(eventType: string): void {
        let index: number = this._types.indexOf(eventType);
        if (index > -1) {
            this._types.splice(index, 1);
            this.removeListener(eventType);
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private addListener(type: string): void {
        this._source.addEventListener(type, this._destination.dispatchEvent, this._destination);
    }

    private removeListener(type: string): void {
        this._source.removeEventListener(type, this._destination.dispatchEvent, this._destination);
    }

    private addListeners(): void {
        for (let i: number = 0; i < this._types.length; i++) {
            let type = this._types[i];
            this.addListener(type);
        }
    }

    private removeListeners(): void {
        for (let i: number = 0; i < this._types.length; i++) {
            let type = this._types[i];
            this.removeListener(type);
        }
    }
}
