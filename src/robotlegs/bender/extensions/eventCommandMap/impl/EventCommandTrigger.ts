// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IInjector } from "../../../framework/api/IInjector";
import { ILogger } from "../../../framework/api/ILogger";
import { getQualifiedClassName } from "../../../framework/impl/getQualifiedClassName";

import { IEvent } from "../../../events/api/IEvent";
import { IEventDispatcher } from "../../../events/api/IEventDispatcher";

import { IClass } from "../../matching/IClass";
import { isInstanceOfType } from "../../matching/isInstanceOfType";

import { ICommandExecutor } from "../../commandCenter/api/ICommandExecutor";
import { ICommandMappingList } from "../../commandCenter/api/ICommandMappingList";
import { ICommandTrigger } from "../../commandCenter/api/ICommandTrigger";
import { CommandPayload } from "../../commandCenter/api/CommandPayload";

import { CommandExecutor } from "../../commandCenter/impl/CommandExecutor";
import { CommandMapper } from "../../commandCenter/impl/CommandMapper";
import { CommandMappingList } from "../../commandCenter/impl/CommandMappingList";

/**
 * @private
 */
export class EventCommandTrigger implements ICommandTrigger {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _dispatcher: IEventDispatcher;

    private _type: string;

    private _eventClass: IClass<IEvent>;

    private _mappings: ICommandMappingList;

    private _executor: ICommandExecutor;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(
        injector: IInjector,
        dispatcher: IEventDispatcher,
        type: string,
        eventClass?: IClass<IEvent>,
        processors?: any[],
        logger?: ILogger
    ) {
        this._dispatcher = dispatcher;
        this._type = type;
        this._eventClass = eventClass;
        this._mappings = new CommandMappingList(this, processors ? processors : [], logger);
        this._executor = new CommandExecutor(injector, this._mappings.removeMapping.bind(this._mappings));
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public createMapper(): CommandMapper {
        return new CommandMapper(this._mappings);
    }

    /**
     * @inheritDoc
     */
    public activate(): void {
        this._dispatcher.addEventListener(this._type, this.eventHandler, this);
    }

    /**
     * @inheritDoc
     */
    public deactivate(): void {
        this._dispatcher.removeEventListener(this._type, this.eventHandler, this);
    }

    public toString(): string {
        let eventDescription: string = "";
        eventDescription = !this._eventClass ? "Event" : getQualifiedClassName(this._eventClass);
        return eventDescription + " with selector '" + this._type + "'";
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private eventHandler(event: Event): void {
        let eventConstructor: IClass<IEvent> = <IClass<IEvent>>event.constructor;
        let payloadEventClass: IClass<IEvent>;

        // not pretty, but optimized to avoid duplicate checks and shortest paths
        if (!this._eventClass) {
            payloadEventClass = eventConstructor;
        } else if (isInstanceOfType(event, this._eventClass)) {
            payloadEventClass = this._eventClass;
        } else {
            return;
        }
        this._executor.executeCommands(this._mappings.getList(), new CommandPayload([event], [payloadEventClass]));
    }
}
