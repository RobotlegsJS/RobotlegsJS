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
import { LifecycleTransition } from "../../../../../src/robotlegs/bender/framework/impl/LifecycleTransition";

describe("LifecycleTransition", () => {
    let target: IEventDispatcher;
    let lifecycle: Lifecycle;
    let transition: LifecycleTransition;

    beforeEach(() => {
        target = new EventDispatcher();
        lifecycle = new Lifecycle(target);
        transition = new LifecycleTransition("test", lifecycle);
    });

    afterEach(() => {
        target = null;
        lifecycle = null;
        transition = null;
    });

    it("invalid transition throws error", () => {
        function invalidTransition(): void {
            transition.fromStates("impossible").enter();
        }
        assert.throws(invalidTransition, Error, "Invalid transition");
    });

    it("invalid transition does not throw when errorListener is attached", () => {
        lifecycle.addEventListener(LifecycleEvent.ERROR, function(event: LifecycleEvent): void {});
        transition.fromStates("impossible").enter();
    });

    it("finalState is set", () => {
        transition.toStates(LifecycleState.INITIALIZING, LifecycleState.ACTIVE).enter();
        assert.equal(lifecycle.state, LifecycleState.ACTIVE);
    });

    it("transitionState is set", () => {
        transition
            .toStates(LifecycleState.INITIALIZING, LifecycleState.ACTIVE)
            .addBeforeHandler(function(message: any, callback: Function): void {
                setTimeout(callback, 1);
            })
            .enter();
        assert.equal(lifecycle.state, LifecycleState.INITIALIZING);
    });

    it("lifecycle events are dispatched", () => {
        let actual: string[] = [];
        let expected: string[] = [LifecycleEvent.PRE_INITIALIZE, LifecycleEvent.INITIALIZE, LifecycleEvent.POST_INITIALIZE];
        transition.withEvents(expected[0], expected[1], expected[2]);
        for (const type of expected) {
            lifecycle.addEventListener(type, function(event: Event): void {
                actual.push(event.type);
            });
        }
        transition.enter();
        assert.deepEqual(actual, expected);
    });

    it("listeners are reversed", () => {
        let actual: number[] = [];
        let expected: number[] = [3, 2, 1];
        transition.withEvents("preEvent", "event", "postEvent").inReverse();
        lifecycle.addEventListener("event", function(event: Event): void {
            actual.push(1);
        });
        lifecycle.addEventListener("event", function(event: Event): void {
            actual.push(2);
        });
        lifecycle.addEventListener("event", function(event: Event): void {
            actual.push(3);
        });
        transition.enter();
        assert.deepEqual(actual, expected);
    });

    it("callback is called", () => {
        let callCount: number = 0;
        transition.enter(function(): void {
            callCount++;
        });
        assert.equal(callCount, 1);
    });

    it("beforeHandlers are run", () => {
        let expected: string[] = ["a", "b", "c"];
        let actual: string[] = [];
        transition.addBeforeHandler(function(): void {
            actual.push("a");
        });
        transition.addBeforeHandler(function(): void {
            actual.push("b");
        });
        transition.addBeforeHandler(function(): void {
            actual.push("c");
        });
        transition.enter();
        assert.deepEqual(actual, expected);
    });

    it("beforeHandlers are run in reverse", () => {
        let expected: string[] = ["c", "b", "a"];
        let actual: string[] = [];
        transition.inReverse();
        transition.addBeforeHandler(function(): void {
            actual.push("a");
        });
        transition.addBeforeHandler(function(): void {
            actual.push("b");
        });
        transition.addBeforeHandler(function(): void {
            actual.push("c");
        });
        transition.enter();
        assert.deepEqual(actual, expected);
    });

    it("beforeHandler error throws", () => {
        function beforeHandler(): void {
            transition
                .addBeforeHandler(function(message: string, callback: Function): void {
                    callback("some error message");
                })
                .enter();
        }
        assert.throws(beforeHandler, Error, "some error message");
    });

    it("beforeHandler does not throw when errorListener is attached", () => {
        let expected: Error = new Error("There was a problem");
        let actual: Error = null;
        lifecycle.addEventListener(LifecycleEvent.ERROR, function(event: LifecycleEvent): void {});
        transition
            .addBeforeHandler(function(message: string, callback: Function): void {
                callback(expected);
            })
            .enter(function(error: Error): void {
                actual = error;
            });
        assert.equal(actual, expected);
    });

    it("invalidTransition is passed to callback when errorListener is attached", () => {
        let actual: any = null;
        lifecycle.addEventListener(LifecycleEvent.ERROR, function(event: LifecycleEvent): void {});
        transition.fromStates("impossible").enter(function(error: any): void {
            actual = error;
        });
        assert.instanceOf(actual, Error);
    });

    it("beforeHandlerError reverts state", () => {
        let expected: string = lifecycle.state;
        lifecycle.addEventListener(LifecycleEvent.ERROR, function(event: LifecycleEvent): void {});
        transition
            .fromStates(LifecycleState.UNINITIALIZED)
            .toStates("startState", "endState")
            .addBeforeHandler(function(message: string, callback: Function): void {
                callback("There was a problem");
            })
            .enter();
        assert.equal(lifecycle.state, expected);
    });

    it("callback is called if already transitioned", () => {
        let callCount: number = 0;
        transition.fromStates(LifecycleState.UNINITIALIZED).toStates("startState", "endState");
        transition.enter();
        transition.enter(function(): void {
            callCount++;
        });
        assert.equal(callCount, 1);
    });

    it("callback added during transition is called", (done: Function) => {
        let callCount: number = 0;
        transition
            .fromStates(LifecycleState.UNINITIALIZED)
            .toStates("startState", "endState")
            .addBeforeHandler(function(message: any, callback: Function): void {
                setTimeout(callback, 1);
            });
        transition.enter();
        transition.enter(function(): void {
            callCount++;
        });
        setTimeout(function(): void {
            assert.equal(callCount, 1);
            done();
        }, 50);
    });
});
