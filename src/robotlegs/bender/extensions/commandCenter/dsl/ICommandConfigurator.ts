// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IGuard } from "../../../framework/api/IGuard";
import { IHook } from "../../../framework/api/IHook";

/**
 * @private
 */
export interface ICommandConfigurator {
    /**
     * The "execute" method to invoke on the Command instance
     * @param name Method name
     * @return Self
     */
    withExecuteMethod(name: String): ICommandConfigurator;

    /**
     * Guards to check before allowing a command to execute
     * @param guards Guards
     * @return Self
     */
    withGuards(...guards: IGuard[]): ICommandConfigurator;

    /**
     * Hooks to run before command execution
     * @param hooks Hooks
     * @return Self
     */
    withHooks(...hooks: IHook[]): ICommandConfigurator;

    /**
     * Should this command only run once?
     * @param value Toggle
     * @return Self
     */
    once(value: boolean): ICommandConfigurator;

    /**
     * Should the payload values be injected into the command instance?
     * @param value Toggle
     * @return Self
     */
    withPayloadInjection(value: boolean): ICommandConfigurator;
}
