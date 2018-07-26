// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
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
