// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IInjector } from "../../../framework/api/IInjector";
import { ILogger } from "../../../framework/api/ILogger";

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";
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

    private _eventClass: Function;

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
        eventClass?: Function,
        processors?: any[],
        logger?: ILogger
    ) {
        this._dispatcher = dispatcher;
        this._type = type;
        this._eventClass = eventClass;
        this._mappings = new CommandMappingList(this, processors, logger);
        this._executor = new CommandExecutor(
            injector,
            this._mappings.removeMapping.bind(this._mappings)
        );
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
        this._dispatcher.removeEventListener(
            this._type,
            this.eventHandler,
            this
        );
    }

    public toString(): string {
        return this._eventClass + " with selector '" + this._type + "'";
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private eventHandler(event: Event): void {
        let eventConstructor: Function = event.constructor;
        let payloadEventClass: Function;
        // not pretty, but optimized to avoid duplicate checks and shortest paths
        if (eventConstructor === this._eventClass || !this._eventClass) {
            payloadEventClass = eventConstructor;
        } else if (this._eventClass === Event) {
            payloadEventClass = this._eventClass;
        } else {
            return;
        }
        this._executor.executeCommands(
            this._mappings.getList(),
            new CommandPayload([event], [payloadEventClass])
        );
    }
}
