// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandTrigger } from "../api/ICommandTrigger";

/**
 * @private
 */
export class CommandTriggerMap {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _triggers: Map<any, any> = new Map<any, any>();

    private _keyFactory: Function;

    private _triggerFactory: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a command trigger map
     * @param keyFactory Factory function to creates keys
     * @param triggerFactory Factory function to create triggers
     */
    constructor(keyFactory: Function, triggerFactory: Function) {
        this._keyFactory = keyFactory;
        this._triggerFactory = triggerFactory;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public getTrigger(...params): ICommandTrigger {
        let key: any = this.getKey(params);
        return this._triggers[key] = this._triggers[key] || this.createTrigger(params);
    }

    /**
     * @private
     */
    public removeTrigger(...params): ICommandTrigger {
        return this.destroyTrigger(this.getKey(params));
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private getKey(mapperArgs: any[]): any {
        return this._keyFactory.apply(null, mapperArgs);
    }

    private createTrigger(mapperArgs: any[]): ICommandTrigger {
        return this._triggerFactory.apply(null, mapperArgs);
    }

    private destroyTrigger(key: any): ICommandTrigger {
        let trigger: ICommandTrigger = this._triggers[key];
        if (trigger) {
            trigger.deactivate();
            delete this._triggers[key];
        }
        return trigger;
    }
}
