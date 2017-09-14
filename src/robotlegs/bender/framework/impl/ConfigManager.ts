// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { interfaces } from "inversify";

import { IConfig } from "../api/IConfig";
import { IContext } from "../api/IContext";
import { IInjector } from "../api/IInjector";
import { ILogger } from "../api/ILogger";
import { IMatcher } from "../api/IMatcher";
import { LifecycleEvent } from "../api/LifecycleEvent";

import { ObjectProcessor } from "./ObjectProcessor";
import { instantiateUnmapped } from "./instantiateUnmapped";

/**
 * The config manager handles configuration files and
 * allows the installation of custom configuration handlers.
 *
 * <p>It is pre-configured to handle plain objects and classes</p>
 *
 * @private
 */
export class ConfigManager {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _objectProcessor: ObjectProcessor = new ObjectProcessor();

    private _configs: Map<any, boolean> = new Map<any, boolean>();

    private _queue: any[] = [];

    private _injector: IInjector;

    private _logger: ILogger;

    private _initialized: boolean = false;

    private _context: IContext;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(context: IContext) {
        this._context = context;
        this._injector = context.injector;
        this._logger = context.getLogger(this);
        this.addConfigHandler(new ClassMatcher(), this.handleClass.bind(this));
        this.addConfigHandler(
            new ObjectMatcher(),
            this.handleObject.bind(this)
        );
        // The ConfigManager should process the config queue
        // at the end of the INITIALIZE phase,
        // but *before* POST_INITIALIZE, so use low event priority
        context.addEventListener(
            LifecycleEvent.INITIALIZE,
            this.initialize,
            this,
            false,
            -100
        );
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Process a given configuration object by running it through registered handlers.
     * <p>If the manager is not initialized the configuration will be queued.</p>
     * @param config The configuration object or class
     */
    public addConfig(config: any): void {
        if (!this._configs.get(config)) {
            this._configs.set(config, true);
            this._objectProcessor.processObject(config);
        }
    }

    /**
     * Adds a custom configuration handlers
     * @param matcher Pattern to match configuration objects
     * @param handler Handler to process matching configurations
     */
    public addConfigHandler(matcher: IMatcher, handler: Function): void {
        this._objectProcessor.addObjectHandler(matcher, handler);
    }

    /**
     * Destroy
     */
    public destroy(): void {
        this._context.removeEventListener(
            LifecycleEvent.INITIALIZE,
            this.initialize
        );
        this._objectProcessor.removeAllHandlers();
        this._queue.length = 0;
        this._configs.clear();
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private initialize(event: LifecycleEvent): void {
        if (!this._initialized) {
            this._initialized = true;
            this.processQueue();
        }
    }

    private handleClass(type: interfaces.Newable<IConfig>): void {
        if (this._initialized) {
            this._logger.debug(
                "Already initialized. Instantiating config class {0}",
                [type]
            );
            this.processClass(type);
        } else {
            this._logger.debug(
                "Not yet initialized. Queuing config class {0}",
                [type]
            );
            this._queue.push(type);
        }
    }

    private handleObject(object: any): void {
        if (this._initialized) {
            this._logger.debug(
                "Already initialized. Injecting into config object {0}",
                [object]
            );
            this.processObject(object);
        } else {
            this._logger.debug(
                "Not yet initialized. Queuing config object {0}",
                [object]
            );
            this._queue.push(object);
        }
    }

    private processQueue(): void {
        for (let i in this._queue) {
            if (this._queue.hasOwnProperty(i)) {
                let config: any = this._queue[i];
                if (typeof config === "function") {
                    // instanceof Class
                    this._logger.debug(
                        "Now initializing. Instantiating config class {0}",
                        [config]
                    );
                    this.processClass(config);
                } else {
                    this._logger.debug(
                        "Now initializing. Injecting into config object {0}",
                        [config]
                    );
                    this.processObject(config);
                }
            }
        }
        this._queue.length = 0;
    }

    private processClass(type: interfaces.Newable<IConfig>): void {
        let config: IConfig = instantiateUnmapped<IConfig>(
            this._injector,
            type
        );
        if (config) {
            config.configure();
        }
    }

    private processObject(object: any): void {
        let config: IConfig = <IConfig>object;
        if (config && config.configure) {
            config.configure();
        }
    }
}

/**
 * @private
 */
class ClassMatcher implements IMatcher {
    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public matches(item: any): boolean {
        return typeof item === "function";
    }
}

/**
 * @private
 */
class ObjectMatcher implements IMatcher {
    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public matches(item: any): boolean {
        return typeof item === "object";
    }
}
