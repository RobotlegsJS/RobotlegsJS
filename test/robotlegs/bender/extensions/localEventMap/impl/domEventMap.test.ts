// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { IEventMap } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/api/IEventMap";
import { EventMap } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/EventMap";

describe("DomEventMap", () => {
    const STARTED: string = "started";
    const COMPLETE: string = "complete";
    const CHANGE: string = "change";

    let eventDispatcher: EventTarget;
    let eventMap: IEventMap;

    let listenerExecuted: boolean = false;
    let listenerExecutedCount: number = 0;

    beforeEach(() => {
        eventDispatcher = window;
        eventMap = new EventMap();
    });

    afterEach(() => {
        resetListenerExecuted();
        resetListenerExecutedCount();

        eventMap.unmapAllListeners();

        eventDispatcher = null;
        eventMap = null;
    });

    function createDomEvemt(eventInterface: string, eventType: string): Event {
        let event: Event = document.createEvent(eventInterface);
        event.initEvent(eventType, true, true);
        return event;
    }

    function listener(e: Event): void {
        listenerExecuted = true;
    }

    function resetListenerExecuted(): void {
        listenerExecuted = false;
    }

    function listenerWithCounter(e: Event): void {
        listenerExecutedCount++;
    }

    function resetListenerExecutedCount(): void {
        listenerExecutedCount = 0;
    }

    it("listener_mapped_is_triggered_by_plain_event", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listener_mapped_is_triggered_by_custom_event", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventDispatcher.dispatchEvent(createDomEvemt("CustomEvent", STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listener_mapped_twice_only_fires_once", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.equal(listenerExecutedCount, 1);
    });

    it("listener_mapped_twice_and_removed_once_doesnt_fire", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.unmapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.equal(listenerExecutedCount, 0);
    });

    it("listener_mapped_and_unmapped_doesnt_fire", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.unmapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.equal(listenerExecutedCount, 0);
    });

    it("unmapDomListeners_causes_no_handlers_to_fire", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listener);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listener);
        eventMap.unmapDomListeners();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("unmapDomListener_that_was_not_mapped_cause_no_effect", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.unmapDomListener(eventDispatcher, CHANGE, listenerWithCounter);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.equal(listenerExecutedCount, 1);
    });

    it("suspend_causes_no_handlers_to_fire", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listener);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listener);
        eventMap.suspend();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("call_suspend_when_mapper_is_suspended_have_no_effet", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listener);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listener);
        eventMap.suspend();
        eventMap.suspend();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("suspend_then_resume_restores_handlers_to_fire", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listenerWithCounter);
        eventMap.suspend();
        eventMap.resume();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.equal(3, listenerExecutedCount);
    });

    it("call_resume_when_mapper_is_not_suspended_have_no_effet", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventMap.resume();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listeners_added_while_suspended_dont_fire", () => {
        eventMap.suspend();
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listener);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listener);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("listeners_added_while_suspended_fire_after_resume", () => {
        eventMap.suspend();
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listenerWithCounter);
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventMap.resume();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.equal(2, listenerExecutedCount);
    });

    it("listeners_can_be_unmapped_while_suspended", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listenerWithCounter);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listenerWithCounter);
        eventMap.suspend();
        eventMap.unmapDomListener(eventDispatcher, CHANGE, listenerWithCounter);
        eventMap.resume();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.equal(2, listenerExecutedCount);
    });

    it("all_listeners_can_be_unmapped_while_suspended", () => {
        eventMap.mapDomListener(eventDispatcher, STARTED, listener);
        eventMap.mapDomListener(eventDispatcher, COMPLETE, listener);
        eventMap.mapDomListener(eventDispatcher, CHANGE, listener);
        eventMap.suspend();
        eventMap.unmapDomListeners();
        eventMap.resume();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", COMPLETE));
        eventDispatcher.dispatchEvent(createDomEvemt("Event", CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("listeners_are_executed_in_the_same_order_when_added", () => {
        const expected: number[] = [1, 2, 3];
        let actual: number[] = [];
        eventMap.mapDomListener(eventDispatcher, STARTED, (e: Event) => {
            actual.push(1);
        });
        eventMap.mapDomListener(eventDispatcher, STARTED, (e: Event) => {
            actual.push(2);
        });
        eventMap.mapDomListener(eventDispatcher, STARTED, (e: Event) => {
            actual.push(3);
        });
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.deepEqual(actual, expected);
    });

    it("suspend_and_resume_do_not_change_order_of_execution_of_listeners", () => {
        const expected: number[] = [1, 2, 3];
        let actual: number[] = [];
        eventMap.mapDomListener(eventDispatcher, STARTED, (e: Event) => {
            actual.push(1);
        });
        eventMap.mapDomListener(eventDispatcher, STARTED, (e: Event) => {
            actual.push(2);
        });
        eventMap.mapDomListener(eventDispatcher, STARTED, (e: Event) => {
            actual.push(3);
        });
        eventMap.suspend();
        eventMap.resume();
        eventDispatcher.dispatchEvent(createDomEvemt("Event", STARTED));
        assert.deepEqual(actual, expected);
    });
});
