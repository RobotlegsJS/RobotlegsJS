import EventEmitter = require('eventemitter3');

// proxy EventDispatcher interface to PIXI's EventEmitter3 methods
EventEmitter.prototype.addEventListener = function (type: string, listener?: Function): void {
    this.on(type, listener);
}

EventEmitter.prototype.hasEventListener = function (type: string, listener?: Function): boolean {
    return this.listeners(type).length > 0;
}

EventEmitter.prototype.removeEventListener = function (type: string, listener?: Function): void {
    this.off(type, listener);
}

EventEmitter.prototype.willTrigger = function (type: string): void {
    return this.hasEventListener( type );
}

EventEmitter.prototype.dispatchEvent = function (event: any): void {
    return this.emit(event.type, event);
}
