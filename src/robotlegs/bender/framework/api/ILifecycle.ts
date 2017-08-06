// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/*[Event(name="destroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="error", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="initialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postDestroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postInitialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postResume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="postSuspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preDestroy", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preInitialize", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preResume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="preSuspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="resume", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="stateChange", type="robotlegs.bender.framework.api.LifecycleEvent")]*/
/*[Event(name="suspend", type="robotlegs.bender.framework.api.LifecycleEvent")]*/

/**
 * The Robotlegs object lifecycle contract
 */
export interface ILifecycle { // extends IEventDispatcher
    /**
     * The current lifecycle state of the target object
     */
    state: string;

    /**
     * The target object associated with this lifecycle
     */
    target: any;

    /**
     * Is this object uninitialized?
     */
    uninitialized: boolean;

    /**
     * Has this object been fully initialized?
     */
    initialized: boolean;

    /**
     * Is this object currently active?
     */
    active: boolean;

    /**
     * Has this object been fully suspended?
     */
    suspended: boolean;

    /**
     * Has this object been fully destroyed?
     */
    destroyed: boolean;

    /**
     * Initializes the lifecycle
     * @param callback Initialization callback
     */
    initialize(callback?: Function): void;

    /**
     * Suspends the lifecycle
     * @param callback Suspension callback
     */
    suspend(callback?: Function): void;

    /**
     * Resumes a suspended lifecycle
     * @param callback Resumption callback
     */
    resume(callback?: Function): void;

    /**
     * Destroys an active lifecycle
     * @param callback Destruction callback
     */
    destroy(callback?: Function): void;

    /**
     * A handler to run before the target object is initialized
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-initialize handler
     * @return Self
     */
    beforeInitializing(handler: Function): ILifecycle;

    /**
     * A handler to run during initialization
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Initialization handler
     * @return Self
     */
    whenInitializing(handler: Function): ILifecycle;

    /**
     * A handler to run after initialization
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-initialize handler
     * @return Self
     */
    afterInitializing(handler: Function): ILifecycle;

    /**
     * A handler to run before the target object is suspended
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-suspend handler
     * @return Self
     */
    beforeSuspending(handler: Function): ILifecycle;

    /**
     * A handler to run during suspension
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Suspension handler
     * @return Self
     */
    whenSuspending(handler: Function): ILifecycle;

    /**
     * A handler to run after suspension
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-suspend handler
     * @return Self
     */
    afterSuspending(handler: Function): ILifecycle;

    /**
     * A handler to run before the target object is resumed
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-resume handler
     * @return Self
     */
    beforeResuming(handler: Function): ILifecycle;

    /**
     * A handler to run during resumption
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Resumption handler
     * @return Self
     */
    whenResuming(handler: Function): ILifecycle;

    /**
     * A handler to run after resumption
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-resume handler
     * @return Self
     */
    afterResuming(handler: Function): ILifecycle;

    /**
     * A handler to run before the target object is destroyed
     *
     * <p>The handler can be asynchronous. See: readme-async</p>
     *
     * @param handler Pre-destroy handler
     * @return Self
     */
    beforeDestroying(handler: Function): ILifecycle;

    /**
     * A handler to run during destruction
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Destruction handler
     * @return Self
     */
    whenDestroying(handler: Function): ILifecycle;

    /**
     * A handler to run after destruction
     *
     * <p>Note: The handler must be synchronous.</p>
     * @param handler Post-destroy handler
     * @return Self
     */
    afterDestroying(handler: Function): ILifecycle;
}
