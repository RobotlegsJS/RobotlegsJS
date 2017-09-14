// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IInjector } from "../../../framework/api/IInjector";
import { ILogger } from "../../../framework/api/ILogger";

/**
 * @private
 */
export class InjectorListener {
    /*============================================================================*/
    /* Private Static Properties                                                  */
    /*============================================================================*/

    private static INJECTION_TYPES: any[] = [
        // InjectionEvent.POST_CONSTRUCT,
        // InjectionEvent.POST_INSTANTIATE,
        // InjectionEvent.PRE_CONSTRUCT
    ];

    private static MAPPING_TYPES: any[] = [
        // MappingEvent.MAPPING_OVERRIDE,
        // MappingEvent.POST_MAPPING_CHANGE,
        // MappingEvent.POST_MAPPING_CREATE,
        // MappingEvent.POST_MAPPING_REMOVE,
        // MappingEvent.PRE_MAPPING_CHANGE,
        // MappingEvent.PRE_MAPPING_CREATE
    ];

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _injector: IInjector;

    private _logger: ILogger;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates an Injector Listener
     * @param injector Injector
     * @param logger Logger
     */
    constructor(injector: IInjector, logger: ILogger) {
        this._injector = injector;
        this._logger = logger;
        this.addListeners();
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Destroys this listener
     */
    public destroy(): void {
        /*
        var type: string;
        for each (type in InjectorListener.INJECTION_TYPES) {
            this._injector.removeEventListener(type, this.onInjectionEvent);
        }
        for each (type in InjectorListener.MAPPING_TYPES) {
            this._injector.removeEventListener(type, this.onMappingEvent);
        }
        */
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private addListeners(): void {
        /*
        var type: string;
        for each (type in InjectorListener.INJECTION_TYPES) {
            this._injector.addEventListener(type, this.onInjectionEvent);
        }
        for each (type in InjectorListener.MAPPING_TYPES) {
            this._injector.addEventListener(type, this.onMappingEvent);
        }
        */
    }

    /*
    private onInjectionEvent(event: InjectionEvent): void {
        this._logger.debug("Injection event of type {0}. Instance: {1}. Instance type: {2}",
            [event.type, event.instance, event.instanceType]);
    }
    */

    /*
    private onMappingEvent(event: MappingEvent): void {
        this._logger.debug("Mapping event of type {0}. Mapped type: {1}. Mapped name: {2}",
            [event.type, event.mappedType, event.mappedName]);
    }
    */
}
