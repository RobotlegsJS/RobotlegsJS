/**
 * Patch PIXI event handling.
 *
 * - Proxy PIXI events to be compatible with EventDispatcher
 * - Implements event bubbling on `dispatchEvent` when `bubbles` is true.
 */

import { DisplayObject } from "pixi.js";

Object.assign(DisplayObject.prototype, {

    addEventListener: function(type: string, listener?: Function): void {
        this.on(type, listener);
    },

    hasEventListener: function(type: string, listener?: Function): boolean {
        return this.listeners(type).length > 0;
    },

    removeEventListener: function(type: string, listener?: Function): void {
        this.off(type, listener);
    },

    willTrigger: function(type: string): void {
        return this.hasEventListener(type);
    },

    dispatchEvent: function(event: any): void {
        if (event.bubbles) {
        }
        this.emit(event.type, event);
    },

});

