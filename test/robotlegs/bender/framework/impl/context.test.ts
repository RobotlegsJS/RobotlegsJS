// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry.ts";

import { assert } from "chai";

import { IConfig } from "../../../../../src/robotlegs/bender/framework/api/IConfig";
import { IContext } from "../../../../../src/robotlegs/bender/framework/api/IContext";
import { IExtension } from "../../../../../src/robotlegs/bender/framework/api/IExtension";
import { IInjector } from "../../../../../src/robotlegs/bender/framework/api/IInjector";
import { LifecycleEvent } from "../../../../../src/robotlegs/bender/framework/api/LifecycleEvent";
import { LogLevel } from "../../../../../src/robotlegs/bender/framework/api/LogLevel";
import { PinEvent } from "../../../../../src/robotlegs/bender/framework/api/PinEvent";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";
import { RobotlegsInjector } from "../../../../../src/robotlegs/bender/framework/impl/RobotlegsInjector";

import { CallbackConfig } from "./contextSupport/CallbackConfig";
import { CallbackExtension } from "./contextSupport/CallbackExtension";
import { CallbackLogTarget } from "./loggingSupport/CallbackLogTarget";
import { LogParams } from "./loggingSupport/LogParams";

describe("Context", () => {

    let context: Context;

    beforeEach(() => {
        context = new Context();
    });

    afterEach(() => {
        context = null;
    });

    it("can instantiate", () => {
        assert.instanceOf(context, Context);
    });

    it("extensions are installed", () => {
        let actual: IContext = null;
        let extension: IExtension = new CallbackExtension(
            function(err: Object, ctx: IContext): void {
                actual = ctx;
            }
        );
        context.install(extension);
        assert.equal(actual, context);
    });

    it("configs are installed", () => {
        let installed: boolean = false;
        let config: IConfig = new CallbackConfig(
            function(): void {
                installed = true;
            }
        );
        context.configure(config);
        context.initialize();
        assert.isTrue(installed);
    });

    it("injector is mapped into itself", () => {
        let injector: IInjector = context.injector.get<IInjector>(IInjector);
        assert.strictEqual(injector, context.injector);
    });

    it("detain stores the instance", () => {
        let expected: Object = {};
        let actual: Object;
        let handler: Function = function(event: PinEvent): void {
            actual = event.instance;
        };
        context.addEventListener(PinEvent.DETAIN, handler);
        context.detain(expected);
        assert.strictEqual(actual, expected);
    });

    it("release frees up the instance", () => {
        let expected: Object = {};
        let actual: Object;
        let handler: Function = function(event: PinEvent): void {
            actual = event.instance;
        };
        context.addEventListener(PinEvent.RELEASE, handler);
        context.detain(expected);
        context.release(expected);
        assert.strictEqual(actual, expected);
    });

    it("addChild sets child parentInjector", () => {
        let child: Context = new Context();
        context.addChild(child);
        assert.strictEqual((<any>child.injector)._parentKernel, context.injector);
    });

    it("addChild logs warning unless child is uninitialized", () => {
        let warning: LogParams = null;
        context.addLogTarget(new CallbackLogTarget(
            function(log: LogParams): void {
                if (log.level === LogLevel.WARN) {
                    warning = log;
                };
            }));
        let child: Context = new Context();
        child.initialize();
        context.addChild(child);
        assert.equal(warning.message, "Child context {0} must be uninitialized");
        assert.deepEqual(warning.params, [child]);
    });

    it("addChild logs warning if child parentInjector is already set", () => {
        let warning: LogParams = null;
        context.addLogTarget(new CallbackLogTarget(
            function(log: LogParams): void {
                if (log.level === LogLevel.WARN) {
                    warning = log;
                };
            }));
        let child: Context = new Context();
        child.injector.parent = new RobotlegsInjector();
        context.addChild(child);
        assert.equal(warning.message, "Child context {0} must not have a parent Injector");
        assert.deepEqual(warning.params, [child]);
    });

    it("removeChild logs warning if child is NOT a child", () => {
        let warning: LogParams = null;
        context.addLogTarget(new CallbackLogTarget(
            function(log: LogParams): void {
                if (log.level === LogLevel.WARN) {
                    warning = log;
                };
            }));
        let child: Context = new Context();
        context.removeChild(child);
        assert.equal(warning.message, "Child context {0} must be a child of {1}");
        assert.deepEqual(warning.params, [child, context]);
    });

    it("removesChild clears child parentInjector", () => {
        let child: Context = new Context();
        context.addChild(child);
        context.removeChild(child);
        assert.isNull((<any>child.injector)._parentKernel);
    });

    it("child is removed when child is destroyed", () => {
        let child: Context = new Context();
        context.addChild(child);
        child.initialize();
        child.destroy();
        assert.isNull((<any>child.injector)._parentKernel);
    });

    it("children are removed when parent is destroyed", () => {
        let child1: Context = new Context();
        let child2: Context = new Context();
        context.addChild(child1);
        context.addChild(child2);
        context.initialize();
        context.destroy();
        assert.isNull((<any>child1.injector)._parentKernel);
        assert.isNull((<any>child2.injector)._parentKernel);
    });

    it("removed child is not removed again when destroyed", () => {
        let warning: LogParams = null;
        context.addLogTarget(new CallbackLogTarget(
            function(log: LogParams): void {
                if (log.level === LogLevel.WARN) {
                    warning = log;
                }
            }
        ));
        const child: Context = new Context();
        context.addChild(child);
        child.initialize();
        context.removeChild(child);
        child.destroy();
        assert.isNull(warning);
    });

    it("lifecycleEvents are propagated", () => {
        let actual: string[] = [];
        let expected: string[] = [
            LifecycleEvent.PRE_INITIALIZE,
            LifecycleEvent.INITIALIZE,
            LifecycleEvent.POST_INITIALIZE,
            LifecycleEvent.PRE_SUSPEND,
            LifecycleEvent.SUSPEND,
            LifecycleEvent.POST_SUSPEND,
            LifecycleEvent.PRE_RESUME,
            LifecycleEvent.RESUME,
            LifecycleEvent.POST_RESUME,
            LifecycleEvent.PRE_DESTROY,
            LifecycleEvent.DESTROY,
            LifecycleEvent.POST_DESTROY
        ];
        function handler(event: LifecycleEvent): void {
            actual.push(event.type);
        }
        for (let i: number = 0; i < expected.length; i++) {
            let type: string = expected[i];
            context.addEventListener(type, handler);
        }
        context.initialize();
        context.suspend();
        context.resume();
        context.destroy();
        assert.deepEqual(actual, expected);
    });

    it("lifecycleStateChangeEvent is propagated", () => {
        let called: Boolean = false;
        context.addEventListener(LifecycleEvent.STATE_CHANGE, function(event: LifecycleEvent): void {
            called = true;
        });
        context.initialize();
        assert.isTrue(called);
    });
});
