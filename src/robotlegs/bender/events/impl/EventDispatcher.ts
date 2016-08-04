// https://github.com/mrdoob/eventdispatcher.js

import { injectable } from "inversify";
import { IEventDispatcher } from "../api/IEventDispatcher";

@injectable()
export class EventDispatcher implements IEventDispatcher {
    private _listeners: {[id:string]: Function[]};
    private _target: any;

    constructor (target?: any) {
        this._target = target || this;
    }

    public addEventListener ( type: string, listener: Function ): void {
        if ( this._listeners === undefined ) {
            this._listeners = {};
        }

        let listeners = this._listeners;

        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
            listeners[ type ].push( listener );
        }
    }

    public hasEventListener ( type: string, listener?: Function ): boolean {
        if ( this._listeners === undefined ) {
            return false;
        }

        let listeners = this._listeners;

        if ( listeners[ type ] !== undefined ) {
            return ( listener !== undefined )
                ? listeners[ type ].indexOf( listener ) !== - 1
                : true;
        }

        return false;
    }

    public willTrigger ( type: string ): boolean {
        // TODO: http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html#willTrigger()
        console.warn("EventDispatcher#willTrigger not fully supported.", this);
        return this.hasEventListener(type);
    }

    public removeEventListener ( type: string, listener?: Function ) {
        if ( this._listeners === undefined ) {
            return;
        }

        let listeners = this._listeners;
        let listenerArray = listeners[ type ];

        if ( listenerArray !== undefined ) {
            let index = listenerArray.indexOf( listener );

            if ( index !== - 1 ) {
                listenerArray.splice( index, 1 );
            }
        }
    }

    public dispatchEvent ( event: any ) {
        if ( this._listeners === undefined ) {
            return;
        }

        let listeners = this._listeners;
        let listenerArray = listeners[ event.type ];

        if ( listenerArray !== undefined ) {

            event.target = this;

            let array = [], i = 0;
            let length = listenerArray.length;

            for ( i = 0; i < length; i ++ ) {
                array[ i ] = listenerArray[ i ];
            }

            for ( i = 0; i < length; i ++ ) {
                array[ i ].call( this, event );
            }
        }
    }
}
