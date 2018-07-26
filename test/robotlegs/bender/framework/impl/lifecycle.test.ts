// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IEventDispatcher } from "../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { EventDispatcher } from "../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

import { LifecycleEvent } from "../../../../../src/robotlegs/bender/framework/api/LifecycleEvent";
import { LifecycleState } from "../../../../../src/robotlegs/bender/framework/api/LifecycleState";
import { Lifecycle } from "../../../../../src/robotlegs/bender/framework/impl/Lifecycle";

describe("Lifecycle", () => {
    let target: IEventDispatcher;
    let lifecycle: Lifecycle;

    beforeEach(() => {
        target = new EventDispatcher();
        lifecycle = new Lifecycle(target);
    });

    afterEach(() => {
        target = null;
        lifecycle = null;
    });

    it("lifecycle starts uninitialized", () => {
        assert.equal(lifecycle.state, LifecycleState.UNINITIALIZED);
        assert.isTrue(lifecycle.uninitialized);
        assert.isFalse(lifecycle.initialized);
        assert.isFalse(lifecycle.active);
        assert.isFalse(lifecycle.suspended);
        assert.isFalse(lifecycle.destroyed);
    });

    it("target is correct", () => {
        assert.equal(lifecycle.target, target);
    });

    // ----- Basic valid transitions

    it("initialize turns state active", () => {
        lifecycle.initialize();
        assert.equal(lifecycle.state, LifecycleState.ACTIVE);
        assert.isFalse(lifecycle.uninitialized);
        assert.isTrue(lifecycle.initialized);
        assert.isTrue(lifecycle.active);
        assert.isFalse(lifecycle.suspended);
        assert.isFalse(lifecycle.destroyed);
    });

    it("suspend turns state suspended", () => {
        lifecycle.initialize();
        lifecycle.suspend();
        assert.equal(lifecycle.state, LifecycleState.SUSPENDED);
        assert.isFalse(lifecycle.uninitialized);
        assert.isTrue(lifecycle.initialized);
        assert.isFalse(lifecycle.active);
        assert.isTrue(lifecycle.suspended);
        assert.isFalse(lifecycle.destroyed);
    });

    it("resume turns state active", () => {
        lifecycle.initialize();
        lifecycle.suspend();
        lifecycle.resume();
        assert.equal(lifecycle.state, LifecycleState.ACTIVE);
        assert.isFalse(lifecycle.uninitialized);
        assert.isTrue(lifecycle.initialized);
        assert.isTrue(lifecycle.active);
        assert.isFalse(lifecycle.suspended);
        assert.isFalse(lifecycle.destroyed);
    });

    it("destroy turns state destroyed", () => {
        lifecycle.initialize();
        lifecycle.destroy();
        assert.equal(lifecycle.state, LifecycleState.DESTROYED);
        assert.isFalse(lifecycle.uninitialized);
        assert.isTrue(lifecycle.initialized);
        assert.isFalse(lifecycle.active);
        assert.isFalse(lifecycle.suspended);
        assert.isTrue(lifecycle.destroyed);
    });

    it("typical transition chain does not throw errors", () => {
        let methods: Function[] = [
            lifecycle.initialize.bind(lifecycle),
            lifecycle.suspend.bind(lifecycle),
            lifecycle.resume.bind(lifecycle),
            lifecycle.suspend.bind(lifecycle),
            lifecycle.resume.bind(lifecycle),
            lifecycle.destroy.bind(lifecycle)
        ];
        assert.equal(methodErrorCount(methods), 0);
    });

    // ----- Invalid transitions

    it("from uninitialized state: suspend, resume and destroy throw errors", () => {
        let methods: Function[] = [lifecycle.suspend.bind(lifecycle), lifecycle.resume.bind(lifecycle), lifecycle.destroy.bind(lifecycle)];
        assert.equal(methodErrorCount(methods), 3);
    });

    it("from suspended state: initialize throws error", () => {
        let methods: Function[] = [
            lifecycle.initialize.bind(lifecycle),
            lifecycle.suspend.bind(lifecycle),
            lifecycle.initialize.bind(lifecycle)
        ];
        assert.equal(methodErrorCount(methods), 1);
    });

    it("from destroyed state: initialize, suspend and resume throw errors", () => {
        let methods: Function[] = [
            lifecycle.initialize.bind(lifecycle),
            lifecycle.destroy.bind(lifecycle),
            lifecycle.initialize.bind(lifecycle),
            lifecycle.suspend.bind(lifecycle),
            lifecycle.resume.bind(lifecycle)
        ];
        assert.equal(methodErrorCount(methods), 3);
    });

    // ----- Events

    it("events are dispatched", () => {
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
        let listener: Function = function(event: LifecycleEvent): void {
            actual.push(event.type);
        };

        for (const type of expected) {
            lifecycle.addEventListener(type, listener);
        }

        lifecycle.initialize();
        lifecycle.suspend();
        lifecycle.resume();
        lifecycle.destroy();

        assert.deepEqual(actual, expected);
    });

    // ----- Shorthand transition handlers

    it("whenHandler with more than 1 argument throws", () => {
        function whenInitializingWrongHandler(): void {
            lifecycle.whenInitializing(function(phase: string, callback: Function): void {});
        }
        assert.throws(whenInitializingWrongHandler, Error, "When and After handlers must accept 0 or 1 arguments");
    });

    it("afterHandler with more than 1 argument throws", () => {
        function afterInitializingWrongHandler(): void {
            lifecycle.afterInitializing(function(phase: string, callback: Function): void {});
        }
        assert.throws(afterInitializingWrongHandler, Error, "When and After handlers must accept 0 or 1 arguments");
    });

    it("when and afterHandlers with single arguments receive event types", () => {
        let expected: string[] = [
            LifecycleEvent.INITIALIZE,
            LifecycleEvent.POST_INITIALIZE,
            LifecycleEvent.SUSPEND,
            LifecycleEvent.POST_SUSPEND,
            LifecycleEvent.RESUME,
            LifecycleEvent.POST_RESUME,
            LifecycleEvent.DESTROY,
            LifecycleEvent.POST_DESTROY
        ];
        let actual: string[] = [];
        let handler: Function = function(type: string): void {
            actual.push(type);
        };
        lifecycle
            .whenInitializing(handler)
            .afterInitializing(handler)
            .whenSuspending(handler)
            .afterSuspending(handler)
            .whenResuming(handler)
            .afterResuming(handler)
            .whenDestroying(handler)
            .afterDestroying(handler);
        lifecycle.initialize();
        lifecycle.suspend();
        lifecycle.resume();
        lifecycle.destroy();
        assert.deepEqual(actual, expected);
    });

    it("when and afterHandlers with no arguments are called", () => {
        let callCount: number = 0;
        let handler: Function = function(): void {
            callCount++;
        };
        lifecycle
            .whenInitializing(handler)
            .afterInitializing(handler)
            .whenSuspending(handler)
            .afterSuspending(handler)
            .whenResuming(handler)
            .afterResuming(handler)
            .whenDestroying(handler)
            .afterDestroying(handler);
        lifecycle.initialize();
        lifecycle.suspend();
        lifecycle.resume();
        lifecycle.destroy();
        assert.equal(callCount, 8);
    });

    it("before handlers are executed", () => {
        let callCount: number = 0;
        let handler: Function = function(): void {
            callCount++;
        };
        lifecycle
            .beforeInitializing(handler)
            .beforeSuspending(handler)
            .beforeResuming(handler)
            .beforeDestroying(handler);
        lifecycle.initialize();
        lifecycle.suspend();
        lifecycle.resume();
        lifecycle.destroy();
        assert.equal(callCount, 4);
    });

    it("async before handlers are executed", (done: Function) => {
        let callCount: number = 0;
        let handler: Function = function(message: any, callback: Function): void {
            callCount++;
            setTimeout(callback.bind(this), 1);
        };
        lifecycle
            .beforeInitializing(handler)
            .beforeSuspending(handler)
            .beforeResuming(handler)
            .beforeDestroying(handler);
        lifecycle.initialize(function(): void {
            lifecycle.suspend(function(): void {
                lifecycle.resume(function(): void {
                    lifecycle.destroy();
                });
            });
        });
        setTimeout(function(): void {
            assert.equal(callCount, 4);
            done();
        }, 50);
    });

    // ----- Suspend and Destroy run backwards

    it("suspend runs backwards", () => {
        let expected: string[] = ["before3", "before2", "before1", "when3", "when2", "when1", "after3", "after2", "after1"];
        let actual: string[] = [];
        lifecycle.beforeSuspending(createValuePusher(actual, "before1"));
        lifecycle.beforeSuspending(createValuePusher(actual, "before2"));
        lifecycle.beforeSuspending(createValuePusher(actual, "before3"));
        lifecycle.whenSuspending(createValuePusher(actual, "when1"));
        lifecycle.whenSuspending(createValuePusher(actual, "when2"));
        lifecycle.whenSuspending(createValuePusher(actual, "when3"));
        lifecycle.afterSuspending(createValuePusher(actual, "after1"));
        lifecycle.afterSuspending(createValuePusher(actual, "after2"));
        lifecycle.afterSuspending(createValuePusher(actual, "after3"));
        lifecycle.initialize();
        lifecycle.suspend();
        assert.deepEqual(actual, expected);
    });

    it("destroy runs backwards", () => {
        let expected: string[] = ["before3", "before2", "before1", "when3", "when2", "when1", "after3", "after2", "after1"];
        let actual: string[] = [];
        lifecycle.beforeDestroying(createValuePusher(actual, "before1"));
        lifecycle.beforeDestroying(createValuePusher(actual, "before2"));
        lifecycle.beforeDestroying(createValuePusher(actual, "before3"));
        lifecycle.whenDestroying(createValuePusher(actual, "when1"));
        lifecycle.whenDestroying(createValuePusher(actual, "when2"));
        lifecycle.whenDestroying(createValuePusher(actual, "when3"));
        lifecycle.afterDestroying(createValuePusher(actual, "after1"));
        lifecycle.afterDestroying(createValuePusher(actual, "after2"));
        lifecycle.afterDestroying(createValuePusher(actual, "after3"));
        lifecycle.initialize();
        lifecycle.destroy();
        assert.deepEqual(actual, expected);
    });

    // ----- Before handlers callback message

    it("beforeHandler callbacks are passed correct message", () => {
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
        let actual: string[] = [];
        lifecycle.beforeInitializing(createMessagePusher(actual));
        lifecycle.whenInitializing(createMessagePusher(actual));
        lifecycle.afterInitializing(createMessagePusher(actual));
        lifecycle.beforeSuspending(createMessagePusher(actual));
        lifecycle.whenSuspending(createMessagePusher(actual));
        lifecycle.afterSuspending(createMessagePusher(actual));
        lifecycle.beforeResuming(createMessagePusher(actual));
        lifecycle.whenResuming(createMessagePusher(actual));
        lifecycle.afterResuming(createMessagePusher(actual));
        lifecycle.beforeDestroying(createMessagePusher(actual));
        lifecycle.whenDestroying(createMessagePusher(actual));
        lifecycle.afterDestroying(createMessagePusher(actual));
        lifecycle.initialize();
        lifecycle.suspend();
        lifecycle.resume();
        lifecycle.destroy();
        assert.deepEqual(actual, expected);
    });

    // ----- StateChange Event

    it("stateChange triggers event", () => {
        let event: LifecycleEvent = null;
        lifecycle.addEventListener(LifecycleEvent.STATE_CHANGE, function(e: LifecycleEvent): void {
            event = e;
        });
        lifecycle.initialize();
        assert.equal(event.type, LifecycleEvent.STATE_CHANGE);
    });

    // ----- Adding handlers that will never be called

    it("adding beforeInitializing handler after initialization throws error", () => {
        function beforeInitializingWrongHandler(): void {
            lifecycle.initialize();
            lifecycle.beforeInitializing(nop);
        }
        assert.throws(beforeInitializingWrongHandler, Error, "Handler added late and will never fire");
    });

    it("adding whenInitializing handler after initialization throws error", () => {
        function whenInitializingWrongHandler(): void {
            lifecycle.initialize();
            lifecycle.whenInitializing(nop);
        }
        assert.throws(whenInitializingWrongHandler, Error, "Handler added late and will never fire");
    });

    it("adding whenInitializing handler during initialization does NOT throw error", (done: Function) => {
        let callCount: number = 0;
        lifecycle.beforeInitializing(function(message: any, callback: Function): void {
            setTimeout(callback, 50);
        });
        lifecycle.initialize();
        lifecycle.whenInitializing(function(): void {
            callCount++;
            assert.equal(callCount, 1);
            done();
        });
    });

    it("adding afterInitializing handler after initialization throws error", () => {
        function afterInitializingWrongHandler(): void {
            lifecycle.initialize();
            lifecycle.afterInitializing(nop);
        }
        assert.throws(afterInitializingWrongHandler, Error, "Handler added late and will never fire");
    });

    it("adding afterInitializing handler during initialization does NOT throw error", () => {
        let callCount: number = 0;
        lifecycle.whenInitializing(function(): void {
            lifecycle.afterInitializing(function(): void {
                callCount++;
            });
        });
        lifecycle.initialize();
        assert.equal(callCount, 1);
    });

    // ----- Auxiliar methods

    function methodErrorCount(methods: Function[]): number {
        let errorCount: number = 0;

        for (const method of methods) {
            try {
                method();
            } catch (error) {
                errorCount++;
            }
        }

        return errorCount;
    }

    function createValuePusher(array: any[], value: any): Function {
        return function(): void {
            array.push(value);
        };
    }

    function createMessagePusher(array: any[]): Function {
        return function(message: any): void {
            array.push(message);
        };
    }

    function nop(): void {}
});
