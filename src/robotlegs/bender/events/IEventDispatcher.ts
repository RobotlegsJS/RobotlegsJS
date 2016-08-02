export let IEventDispatcher = Symbol('IEventDispatcher');
export interface IEventDispatcher {
    addEventListener(type: string, listener?: Function): void;
    hasEventListener(type: string, listener?: Function): boolean;
    removeEventListener(type: string, listener?: Function);
    willTrigger(type: string);
    dispatchEvent(event: any);
}
