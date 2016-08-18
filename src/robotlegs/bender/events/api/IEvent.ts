export interface IEvent {
    type: string,
    defaultPrevented?: boolean,
    bubbles?: boolean,
    target?: any,
    currentTarget?: any,
    detail?: any,
}

export interface IEventInit {
    bubbles?: boolean,
    detail?: any
}
