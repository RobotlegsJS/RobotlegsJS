// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IDirectCommandMapper } from "../api/IDirectCommandMapper";

/**
 * @private
 */
export interface IDirectCommandConfigurator extends IDirectCommandMapper {
    /**
     * The "execute" method to invoke on the Command instance
     * @param name Method name
     * @return Self
     */
    withExecuteMethod(name: string): IDirectCommandConfigurator;

    /**
     * Guards to check before allowing a command to execute
     * @param guards Guards
     * @return Self
     */
    withGuards(...guards: any[]): IDirectCommandConfigurator;

    /**
     * Hooks to run before command execution
     * @param hooks Hooks
     * @return Self
     */
    withHooks(...hooks: any[]): IDirectCommandConfigurator;

    /**
     * Should the payload values be injected into the command instance?
     * @param value Toggle
     * @return Self
     */
    withPayloadInjection(value?: boolean): IDirectCommandConfigurator;
}
