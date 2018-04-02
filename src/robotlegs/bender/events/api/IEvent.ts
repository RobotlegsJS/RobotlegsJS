export interface IEvent {
    type: string;
    bubbles?: boolean;
    cancelable?: boolean;
    isDefaultPrevented?: boolean;
    isPropagationStopped?: boolean;
    isPropagationImmediateStopped?: boolean;
    currentTarget?: any;
    target?: any;
    data?: any;
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
