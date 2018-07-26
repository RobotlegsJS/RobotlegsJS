// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export interface ICommandConfigurator {
    /**
     * Guards to check before allowing a command to execute
     * @param guards Guards
     * @return Self
     */
    withGuards(...guards: any[]): ICommandConfigurator;

    /**
     * Hooks to run before command execution
     * @param hooks Hooks
     * @return Self
     */
    withHooks(...hooks: any[]): ICommandConfigurator;

    /**
     * Should this command only run once?
     * @param value Toggle
     * @return Self
     */
    once(value?: boolean): ICommandConfigurator;

    /**
     * Should the payload values be injected into the command instance?
     * @param value Toggle
     * @return Self
     */
    withPayloadInjection(value?: boolean): ICommandConfigurator;
}
