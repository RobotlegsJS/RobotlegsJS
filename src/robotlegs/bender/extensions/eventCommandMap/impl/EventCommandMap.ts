// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable, inject } from "inversify";

import { IContext } from "../../../framework/api/IContext";
import { IInjector } from "../../../framework/api/IInjector";
import { ILogger } from "../../../framework/api/ILogger";

import { IEventDispatcher } from "../../../events/api/IEventDispatcher";

import { ICommandMapper } from "../../commandCenter/dsl/ICommandMapper";
import { ICommandUnmapper } from "../../commandCenter/dsl/ICommandUnmapper";

import { CommandTriggerMap } from "../../commandCenter/impl/CommandTriggerMap";

import { IEventCommandMap } from "../../eventCommandMap/api/IEventCommandMap";

import { EventCommandTrigger } from "./EventCommandTrigger";

/**
 * @private
 */
@injectable()
export class EventCommandMap implements IEventCommandMap {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _mappingProcessors: any[] = [];

    private _injector: IInjector;

    private _dispatcher: IEventDispatcher;

    private _triggerMap: CommandTriggerMap;

    private _logger: ILogger;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(
        @inject(IContext) context: IContext,
        @inject(IEventDispatcher) dispatcher: IEventDispatcher
    ) {
        this._injector = context.injector;
        this._logger = context.getLogger(this);
        this._dispatcher = dispatcher;
        this._triggerMap = new CommandTriggerMap(this.getKey, this.createTrigger.bind(this));
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public map(type: string, eventClass?: Object): ICommandMapper {
        return this.getTrigger(type, eventClass).createMapper();
    }

    /**
     * @inheritDoc
     */
    public unmap(type: string, eventClass?: Object): ICommandUnmapper {
        return this.getTrigger(type, eventClass).createMapper();
    }

    /**
     * @inheritDoc
     */
    public addMappingProcessor(handler: Function): IEventCommandMap {
        if (this._mappingProcessors.indexOf(handler) === -1) {
            this._mappingProcessors.push(handler);
        }
        return this;
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private getKey(type: string, eventClass: Object): string {
        return type + eventClass;
    }

    private getTrigger(type: string, eventClass: Object): EventCommandTrigger {
        return <EventCommandTrigger>this._triggerMap.getTrigger(type, eventClass) ;
    }

    private createTrigger(type: string, eventClass: Object): EventCommandTrigger {
        return new EventCommandTrigger(this._injector, this._dispatcher, type, eventClass, this._mappingProcessors, this._logger);
    }
}
