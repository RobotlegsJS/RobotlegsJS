// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { injectable } from "inversify";

import { IConfig } from "../api/IConfig";
import { IContext } from "../api/IContext";
import { IExtension } from "../api/IExtension";
import { IInjector } from "../api/IInjector";
import { ILogger } from "../api/ILogger";
import { ILogTarget } from "../api/ILogTarget";
import { IMatcher } from "../api/IMatcher";
import { LifecycleEvent } from "../api/LifecycleEvent";

import { ConfigManager } from "./ConfigManager";
import { ExtensionInstaller } from "./ExtensionInstaller";
import { Lifecycle } from "./Lifecycle";
import { LogManager } from "./LogManager";
import { Pin } from "./Pin";
import { RobotlegsInjector } from "./RobotlegsInjector";
import { UID } from "./UID";

import { EventDispatcher } from "../../events/impl/EventDispatcher";

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
 * The core Robotlegs Context implementation
 */
@injectable()
export class Context extends EventDispatcher implements IContext {
    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public get injector(): IInjector {
        return this._injector;
    }

    /**
     * @inheritDoc
     */
    public get logLevel(): number {
        return this._logManager.logLevel;
    }

    /**
     * @inheritDoc
     */
    public set logLevel(value: number) {
        this._logManager.logLevel = value;
    }

    /**
     * @inheritDoc
     */
    public get state(): string {
        return this._lifecycle.state;
    }

    /**
     * @inheritDoc
     */
    public get uninitialized(): boolean {
        return this._lifecycle.uninitialized;
    }

    /**
     * @inheritDoc
     */
    public get initialized(): boolean {
        return this._lifecycle.initialized;
    }

    /**
     * @inheritDoc
     */
    public get active(): boolean {
        return this._lifecycle.active;
    }

    /**
     * @inheritDoc
     */
    public get suspended(): boolean {
        return this._lifecycle.suspended;
    }

    /**
     * @inheritDoc
     */
    public get destroyed(): boolean {
        return this._lifecycle.destroyed;
    }

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _uid: string = UID.create(Context);

    private _injector: IInjector;

    private _logManager: LogManager;

    private _children: IContext[] = [];

    private _pin: Pin;

    private _lifecycle: Lifecycle;

    private _configManager: ConfigManager;

    private _extensionInstaller: ExtensionInstaller;

    private _logger: ILogger;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a new Context
     */
    constructor() {
        super();
        this.setup();
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public initialize(callback?: Function): void {
        this._lifecycle.initialize(callback);
    }

    /**
     * @inheritDoc
     */
    public suspend(callback?: Function): void {
        this._lifecycle.suspend(callback);
    }

    /**
     * @inheritDoc
     */
    public resume(callback?: Function): void {
        this._lifecycle.resume(callback);
    }

    /**
     * @inheritDoc
     */
    public destroy(callback?: Function): void {
        this._lifecycle.destroy(callback);
    }

    /**
     * @inheritDoc
     */
    public beforeInitializing(handler: Function): IContext {
        this._lifecycle.beforeInitializing(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenInitializing(handler: Function): IContext {
        this._lifecycle.whenInitializing(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterInitializing(handler: Function): IContext {
        this._lifecycle.afterInitializing(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public beforeSuspending(handler: Function): IContext {
        this._lifecycle.beforeSuspending(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenSuspending(handler: Function): IContext {
        this._lifecycle.whenSuspending(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterSuspending(handler: Function): IContext {
        this._lifecycle.afterSuspending(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public beforeResuming(handler: Function): IContext {
        this._lifecycle.beforeResuming(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenResuming(handler: Function): IContext {
        this._lifecycle.whenResuming(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterResuming(handler: Function): IContext {
        this._lifecycle.afterResuming(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public beforeDestroying(handler: Function): IContext {
        this._lifecycle.beforeDestroying(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public whenDestroying(handler: Function): IContext {
        this._lifecycle.whenDestroying(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public afterDestroying(handler: Function): IContext {
        this._lifecycle.afterDestroying(handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public install(...extensions: any[]): IContext {
        for (let i: number = 0; i < extensions.length; i++) {
            let extension: IExtension = extensions[i];
            this._extensionInstaller.install(extension);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public configure(...configs: any[]): IContext {
        for (let i: number = 0; i < configs.length; i++) {
            let config: IConfig = configs[i];
            this._configManager.addConfig(config);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public addChild(child: IContext): IContext {
        if (this._children.indexOf(child) === -1) {
            this._logger.debug("Adding child context {0}", [child]);
            if (!child.uninitialized) {
                this._logger.warn("Child context {0} must be uninitialized", [child]);
            }
            if (child.injector.parent) {
                this._logger.warn("Child context {0} must not have a parent Injector", [child]);
            }
            this._children.push(child);
            child.injector.parent = this.injector;
            child.addEventListener(LifecycleEvent.POST_DESTROY, this.onChildDestroy, this);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public removeChild(child: IContext): IContext {
        let childIndex: number = this._children.indexOf(child);
        if (childIndex > -1) {
            this._logger.debug("Removing child context {0}", [child]);
            this._children.splice(childIndex, 1);
            child.injector.parent = null;
            child.removeEventListener(LifecycleEvent.POST_DESTROY, this.onChildDestroy, this);
        } else {
            this._logger.warn("Child context {0} must be a child of {1}", [child, this]);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public addConfigHandler(matcher: IMatcher, handler: Function): IContext {
        this._configManager.addConfigHandler(matcher, handler);
        return this;
    }

    /**
     * @inheritDoc
     */
    public getLogger(source: any): ILogger {
        return this._logManager.getLogger(source);
    }

    /**
     * @inheritDoc
     */
    public addLogTarget(target: ILogTarget): IContext {
        this._logManager.addLogTarget(target);
        return this;
    }

    /**
     * @inheritDoc
     */
    public detain(...instances: any[]): IContext {
        for (let i: number = 0; i < instances.length; i++) {
            let instance: any = instances[i];
            this._pin.detain(instance);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public release(...instances: any[]): IContext {
        for (let i: number = 0; i < instances.length; i++) {
            let instance: any = instances[i];
            this._pin.release(instance);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return this._uid;
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    /**
     * Configures mandatory context dependencies
     */
    private setup(): void {
        this._logManager = new LogManager();
        this._injector = new RobotlegsInjector();

        this._injector.bind<IInjector>(IInjector).toConstantValue(this._injector);
        this._injector.bind<IContext>(IContext).toConstantValue(this);

        this._logger = this._logManager.getLogger(this);
        this._pin = new Pin(this);
        this._lifecycle = new Lifecycle(this);
        this._configManager = new ConfigManager(this);
        this._extensionInstaller = new ExtensionInstaller(this);

        this.beforeInitializing(this.beforeInitializingCallback.bind(this));
        this.afterInitializing(this.afterInitializingCallback.bind(this));
        this.beforeDestroying(this.beforeDestroyingCallback.bind(this));
        this.afterDestroying(this.afterDestroyingCallback.bind(this));
    }

    private beforeInitializingCallback(): void {
        this._logger.debug("Initializing...");
    }

    private afterInitializingCallback(): void {
        this._logger.debug("Initialize complete");
    }

    private beforeDestroyingCallback(): void {
        this._logger.debug("Destroying...");
    }

    private afterDestroyingCallback(): void {
        this._extensionInstaller.destroy();
        this._configManager.destroy();
        this._pin.releaseAll();
        this._injector.unbindAll();
        this.removeChildren();
        this._logger.debug("Destroy complete");
        this._logManager.removeAllTargets();
    }

    private onChildDestroy(event: LifecycleEvent): void {
        this.removeChild(<IContext>event.target);
    }

    private removeChildren(): void {
        while (this._children.length > 0) {
            this.removeChild(this._children[this._children.length - 1]);
        }
    }
}
