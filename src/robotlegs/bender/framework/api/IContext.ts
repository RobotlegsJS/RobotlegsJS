// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IConfig } from "./IConfig";
import { IExtension } from "./IExtension";
import { IInjector } from "./IInjector";
import { ILogger } from "./ILogger";
import { ILogTarget } from "./ILogTarget";
import { IMatcher } from "./IMatcher";

import { IEventDispatcher } from "../../events/IEventDispatcher";

/*[Event(name="destroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="detain", type="robotlegs.bender.framework.api.PinEvent")]*/
/*[Event(name="initialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postDestroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postInitialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postResume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postSuspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preDestroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preInitialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preResume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preSuspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="release", type="robotlegs.bender.framework.api.PinEvent")]*/
/*[Event(name="resume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="stateChange", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="suspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/

/**
 * The Robotlegs context contract
 */
export let IContext = Symbol("IContext");
export interface IContext extends IEventDispatcher {
    /**
     * The context dependency injector
     */
    injector: IInjector;

    /**
     * The current log level
     */
    logLevel: number;

    /**
     * The current lifecycle state
     */
    state: string;

    /**
     * Is this context uninitialized?
     */
    uninitialized: boolean;

    /**
     * Is this context initialized?
     */
    initialized: boolean;

    /**
     * Is this context active?
     */
    active: boolean;

    /**
     * Is this context suspended?
     */
    suspended: boolean;

    /**
     * Has this context been destroyed?
     */
    destroyed: boolean;

    /**
     * Installs custom extensions or bundles into the context
     * @param extensions Objects or classes implementing IExtension or IBundle
     * @return this
     */
    install(...extensions: Object[]): IContext;

    /**
     * Configures the context with custom configurations
     * @param configs Configuration objects or classes of any type
     * @return this
     */
    configure(...configs: Object[]): IContext;

    /**
     * Adds an uninitialized context as a child
     *
     * <p>This sets up an injection chain.</p>
     *
     * @param child The context to add as a child
     * @return this
     */
    addChild(child: IContext): IContext;

    /**
     * Removes a child context from this context
     * @param child The child context to remove
     * @return this
     */
    removeChild(child: IContext): IContext;

    /**
     * Adds a custom configuration handler
     * @param matcher Pattern to match configurations
     * @param handler Handler to process matching configurations
     * @return this
     */
    addConfigHandler(matcher: IMatcher, handler: Function): IContext;

    /**
     * Retrieves a logger for a given source
     * @param source Logging source
     * @return Logger
     */
    getLogger(source: any): ILogger;

    /**
     * Adds a custom log target
     * @param target Log target
     * @return this
     */
    addLogTarget(target: ILogTarget): IContext;

    /**
     * Pins instances in memory
     * @param instances Instances to pin
     * @return this
     */
    detain(...instances): IContext;

    /**
     * Unpins instances from memory
     * @param instances Instances to unpin
     * @return this
     */
    release(... instances): IContext;

    /**
     * Initializes this context
     * @param callback Initialization callback
     */
    initialize(callback?: Function): void;

    /**
     * Suspends this context
     * @param callback Suspension callback
     */
    suspend(callback?: Function): void;

    /**
     * Resumes a suspended context
     * @param callback Resumption callback
     */
    resume(callback?: Function): void;

    /**
     * Destroys an active context
     * @param callback Destruction callback
     */
    destroy(callback?: Function): void;

    /**
     * A handler to run before the context is initialized
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-initialize handler
     * @return this
     */
    beforeInitializing(handler: Function): IContext;

    /**
     * A handler to run during initialization
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Initialization handler
     * @return this
     */
    whenInitializing(handler: Function): IContext;

    /**
     * A handler to run after initialization
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-initialize handler
     * @return this
     */
    afterInitializing(handler: Function): IContext;

    /**
     * A handler to run before the target object is suspended
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-suspend handler
     * @return this
     */
    beforeSuspending(handler: Function): IContext;

    /**
     * A handler to run during suspension
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Suspension handler
     * @return this
     */
    whenSuspending(handler: Function): IContext;

    /**
     * A handler to run after suspension
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-suspend handler
     * @return this
     */
    afterSuspending(handler: Function): IContext;

    /**
     * A handler to run before the context is resumed
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-resume handler
     * @return this
     */
    beforeResuming(handler: Function): IContext;

    /**
     * A handler to run during resumption
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Resumption handler
     * @return this
     */
    whenResuming(handler: Function): IContext;

    /**
     * A handler to run after resumption
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-resume handler
     * @return Self
     */
    afterResuming(handler: Function): IContext;

    /**
     * A handler to run before the context is destroyed
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-destroy handler
     * @return this
     */
    beforeDestroying(handler: Function): IContext;

    /**
     * A handler to run during destruction
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Destruction handler
     * @return this
     */
    whenDestroying(handler: Function): IContext;

    /**
     * A handler to run after destruction
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-destroy handler
     * @return this
     */
    afterDestroying(handler: Function): IContext;
}
