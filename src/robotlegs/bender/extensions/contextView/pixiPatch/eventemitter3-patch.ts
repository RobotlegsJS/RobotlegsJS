/**
 * Patch PIXI event handling.
 *
 * - Proxy PIXI events to be compatible with EventDispatcher
 * - Implements event bubbling on `dispatchEvent` when `bubbles` is true.
 */

import EventEmitter = require("eventemitter3");
import { DisplayObject } from "pixi.js";
import { Event } from "../../../events/impl/Event";

const EventDispatcherMixin = {

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

    dispatchEvent: function(event: Event): void {
        event.target = this;

        let currentTarget = this;
        do {
            event.currentTarget = currentTarget;
            event.currentTarget.emit(event.type, event);
            currentTarget = currentTarget.parent;
        } while (currentTarget && event.bubbles);
    },

};

Object.assign(DisplayObject.prototype, EventDispatcherMixin);
Object.assign(EventEmitter.prototype, EventDispatcherMixin);
