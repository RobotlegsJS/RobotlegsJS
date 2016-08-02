// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export interface ICommandMapping {
    /**
     * The concrete Command Class for this mapping
     */
    commandClass: Object;

    /**
     * The "execute" method to invoke on the Command instance
     */
    executeMethod: string;

    /**
     * A list of Guards to query before execution
     */
    guards: any[];

    /**
     * A list of Hooks to run during execution
     */
    hooks: any[];

    /**
     * Unmaps a Command after a successful execution
     */
    fireOnce: boolean;

    /**
     * Supply the payload values via instance injection
     */
    payloadInjectionEnabled: boolean;

    /**
     * The "execute" method to invoke on the Command instance
     */
    setExecuteMethod(name: string): ICommandMapping;

    /**
     * A list of Guards to query before execution
     */
    addGuards(...guards: any[]): ICommandMapping;

    /**
     * A list of Hooks to run during execution
     */
    addHooks(...hooks: any[]): ICommandMapping;

    /**
     * Unmaps a Command after a successful execution
     */
    setFireOnce(value: boolean): ICommandMapping;

    /**
     * Supply the payload values via instance injection
     */
    setPayloadInjectionEnabled(value: boolean): ICommandMapping;
}
