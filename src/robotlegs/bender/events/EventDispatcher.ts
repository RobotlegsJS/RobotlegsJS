// https://github.com/mrdoob/eventdispatcher.js

import { injectable } from "inversify";
import { IEventDispatcher } from "./IEventDispatcher";

@injectable()
export class EventDispatcher {
    private _listeners: {[id:string]: Function[]};
    private _target: any;

    constructor (target?: any) {
        this._target = target || this;
    }

    addEventListener ( type: string, listener: Function ): void {
        if ( this._listeners === undefined ) this._listeners = {};

        var listeners = this._listeners;

        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
            listeners[ type ].push( listener );
        }
    }

    hasEventListener ( type: string, listener?: Function ): boolean {
        if ( this._listeners === undefined ) return false;
        var listeners = this._listeners;

        if ( listeners[ type ] !== undefined ) {
            return ( listener !== undefined )
                ? listeners[ type ].indexOf( listener ) !== - 1
                : true
        }

        return false;
    }

    willTrigger ( type: string ): boolean {
        // TODO: http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html#willTrigger()
        console.warn("EventDispatcher#willTrigger not fully supported.", this);
        return this.hasEventListener(type);
    }

    removeEventListener ( type: string, listener?: Function ) {
        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ type ];

        if ( listenerArray !== undefined ) {
            var index = listenerArray.indexOf( listener );

            if ( index !== - 1 ) {
                listenerArray.splice( index, 1 );
            }
        }
    }

    dispatchEvent ( event: any ) {
        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ event.type ];

        if ( listenerArray !== undefined ) {

            event.target = this;

            var array = [], i = 0;
            var length = listenerArray.length;

            for ( i = 0; i < length; i ++ ) {
                array[ i ] = listenerArray[ i ];
            }

            for ( i = 0; i < length; i ++ ) {
                array[ i ].call( this, event );
            }

        }
    }

}
