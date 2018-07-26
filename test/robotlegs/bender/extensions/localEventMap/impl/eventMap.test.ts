// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { IEventDispatcher } from "../../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { EventDispatcher } from "../../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

import { IEventMap } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/api/IEventMap";
import { EventMap } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/EventMap";

import { CustomEvent } from "../support/CustomEvent";
import { CustomEvent2 } from "../support/CustomEvent2";

describe("EventMap", () => {
    let eventDispatcher: IEventDispatcher;
    let eventMap: IEventMap;

    let listenerExecuted: boolean = false;
    let listenerExecutedCount: number = 0;

    beforeEach(() => {
        eventDispatcher = new EventDispatcher();
        eventMap = new EventMap();
    });

    afterEach(() => {
        resetListenerExecuted();
        resetListenerExecutedCount();
    });

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

    it("listener_mapped_without_type_is_triggered_by_plain_Event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventDispatcher.dispatchEvent(new Event(CustomEvent.STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listener_mapped_without_type_is_triggered_by_correct_typed_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listener_mapped_with_type_is_triggered_by_correct_typed_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listener_mapped_with_type_is_NOT_triggered_by_plain_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventDispatcher.dispatchEvent(new Event(CustomEvent.STARTED));
        assert.isFalse(listenerExecuted);
    });

    it("listener_mapped_twice_only_fires_once", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter, this, CustomEvent);
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter, this, CustomEvent);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.equal(listenerExecutedCount, 1);
    });

    it("listener_mapped_twice_and_removed_once_doesnt_fire", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter, this, CustomEvent);
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter, this, CustomEvent);
        eventMap.unmapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter, this, CustomEvent);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.equal(listenerExecutedCount, 0);
    });

    it("listener_mapped_and_unmapped_without_type_doesnt_fire_in_response_to_typed_or_plain_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.unmapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventDispatcher.dispatchEvent(new Event(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.isFalse(listenerExecuted);
    });

    it("listener_mapped_and_unmapped_with_type_doesnt_fire_in_response_to_typed_or_plain_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventMap.unmapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventDispatcher.dispatchEvent(new Event(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.isFalse(listenerExecuted);
    });

    it("listener_mapped_with_type_and_unmapped_without_type_fires_in_response_to_typed_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventMap.unmapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listener_mapped_without_type_and_unmapped_with_type_fires_in_response_to_plain_event", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.unmapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventDispatcher.dispatchEvent(new Event(CustomEvent.STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("unmapListeners_causes_no_handlers_to_fire", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listener);
        eventMap.unmapListeners();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("suspend_causes_no_handlers_to_fire", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listener);
        eventMap.suspend();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("call_suspend_when_mapper_is_suspended_have_no_effet", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listener);
        eventMap.suspend();
        eventMap.suspend();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("suspend_then_resume_restores_handlers_to_fire", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listenerWithCounter);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listenerWithCounter);
        eventMap.suspend();
        eventMap.resume();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.equal(3, listenerExecutedCount);
    });

    it("call_resume_when_mapper_is_not_suspended_have_no_effet", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener, this, CustomEvent);
        eventMap.resume();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.isTrue(listenerExecuted);
    });

    it("listeners_added_while_suspended_dont_fire", () => {
        eventMap.suspend();
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listener);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("listeners_added_while_suspended_fire_after_resume", () => {
        eventMap.suspend();
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listenerWithCounter);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listenerWithCounter);
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventMap.resume();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.equal(2, listenerExecutedCount);
    });

    it("listeners_can_be_unmapped_while_suspended", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listenerWithCounter);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listenerWithCounter);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listenerWithCounter);
        eventMap.suspend();
        eventMap.unmapListener(eventDispatcher, CustomEvent2.CHANGE, listenerWithCounter);
        eventMap.resume();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.equal(2, listenerExecutedCount);
    });

    it("all_listeners_can_be_unmapped_while_suspended", () => {
        eventMap.mapListener(eventDispatcher, CustomEvent.STARTED, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.COMPLETE, listener);
        eventMap.mapListener(eventDispatcher, CustomEvent2.CHANGE, listener);
        eventMap.suspend();
        eventMap.unmapListeners();
        eventMap.resume();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.COMPLETE));
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent2.CHANGE));
        assert.isFalse(listenerExecuted);
    });

    it("listeners_are_executed_in_order_of_priority", () => {
        const expectedOrder: number[] = [3, 2, 1, 0];
        let thisObj: any = {};
        let actualOrder: number[] = [];
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push(0);
            },
            thisObj,
            CustomEvent,
            false
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push(1);
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push(2);
            },
            thisObj,
            CustomEvent,
            false,
            2
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push(3);
            },
            thisObj,
            CustomEvent,
            false,
            3
        );
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.deepEqual(actualOrder, expectedOrder);
    });

    it("listeners_with_same_priority_are_executed_in_the_order_in_which_they_were_added", () => {
        const expectedOrder: string[] = ["2", "1.a", "1.b", "1.c", "0"];
        let thisObj: any = {};
        let actualOrder: string[] = [];
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("0");
            },
            thisObj,
            CustomEvent,
            false
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("1.a");
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("1.b");
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("1.c");
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("2");
            },
            thisObj,
            CustomEvent,
            false,
            2
        );
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.deepEqual(actualOrder, expectedOrder);
    });

    it("listeners_with_priority_do_not_loose_priority_when_event_map_is_suspended", () => {
        const expectedOrder: string[] = ["2", "1.a", "1.b", "1.c", "0"];
        let thisObj: any = {};
        let actualOrder: string[] = [];
        eventMap.suspend();
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("0");
            },
            thisObj,
            CustomEvent,
            false
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("1.a");
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("1.b");
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("1.c");
            },
            thisObj,
            CustomEvent,
            false,
            1
        );
        eventMap.mapListener(
            eventDispatcher,
            CustomEvent.STARTED,
            (e: Event) => {
                actualOrder.push("2");
            },
            thisObj,
            CustomEvent,
            false,
            2
        );
        eventMap.resume();
        eventDispatcher.dispatchEvent(new CustomEvent(CustomEvent.STARTED));
        assert.deepEqual(actualOrder, expectedOrder);
    });
});
