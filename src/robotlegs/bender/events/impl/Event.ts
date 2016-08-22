import { IEvent, IEventInit } from "../api/IEvent";

export class Event implements IEvent {

    public type: string;
    public defaultPrevented: boolean;
    public bubbles: boolean;
    public target: any;
    public currentTarget: any;
    public detail: any;

    constructor(type: string, eventInit: IEventInit = { bubbles: false }) {
        this.type = type;
        this.bubbles = false;
        this.defaultPrevented = false;
        this.detail = eventInit.detail;
    }

    public preventDefault(): void {
        this.defaultPrevented = true;
    }

    public stopPropagation(): void {
        this.bubbles = false;
    }

}
