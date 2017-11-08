// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { LifecycleEvent } from "../../../../../../src/robotlegs/bender/framework/api/LifecycleEvent";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { IEventDispatcher } from "../../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { EventDispatcher } from "../../../../../../src/robotlegs/bender/events/impl/EventDispatcher";
import { EventRelay } from "../../../../../../src/robotlegs/bender/extensions/eventDispatcher/impl/EventRelay";

describe("EventRelay", () => {
    let source: IEventDispatcher;
    let destination: IEventDispatcher;
    let subject: EventRelay;
    let reportedTypes: string[];

    beforeEach(() => {
        source = new EventDispatcher();
        destination = new EventDispatcher();
        reportedTypes = [];
    });

    afterEach(() => {
        source = null;
        destination = null;
        subject = null;
        reportedTypes = null;
    });

    function createRelayFor(types?: string[]): EventRelay {
        subject = new EventRelay(source, destination, types);
        captureEventsOf(types);
        return subject;
    }

    function captureEventsOf(types: string[]): void {
        if (types) {
            types.forEach((type: string) => {
                destination.addEventListener(type, catchEvent);
            });
        }
    }

    function catchEvent(event: Event): void {
        reportedTypes.push(event.type);
    }

    it("no_relay_before_start_when_types_are_not_defined", () => {
        createRelayFor();
        source.dispatchEvent(new Event("test1"));
        assert.isEmpty(reportedTypes);
    });

    it("no_relay_before_start", () => {
        createRelayFor(["test1"]);
        source.dispatchEvent(new Event("test1"));
        assert.isEmpty(reportedTypes);
    });

    it("relays_specified_events", () => {
        createRelayFor(["test1", "test2"]).start();
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.deepEqual(reportedTypes, ["test1", "test2"]);
    });

    it("ignores_unspecified_events", () => {
        createRelayFor().start();
        source.dispatchEvent(new Event("test1"));
        assert.isEmpty(reportedTypes);
    });

    it("relays_specified_events_but_ignores_unspecified_events", () => {
        createRelayFor(["test1"]).start();
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.deepEqual(reportedTypes, ["test1"]);
    });

    it("call_start_when_relay_is_active_have_no_effect", () => {
        createRelayFor(["test1"])
            .start()
            .start();
        source.dispatchEvent(new Event("test1"));
        assert.deepEqual(reportedTypes, ["test1"]);
    });

    it("no_relay_after_stop", () => {
        createRelayFor(["test1"])
            .start()
            .stop();
        source.dispatchEvent(new Event("test1"));
        assert.isEmpty(reportedTypes);
    });

    it("call_stop_when_relay_is_not_active_have_no_effect", () => {
        createRelayFor(["test1"]).stop();
        source.dispatchEvent(new Event("test1"));
        assert.isEmpty(reportedTypes);
    });

    it("relay_resumes", () => {
        createRelayFor(["test1"])
            .start()
            .stop()
            .start();
        source.dispatchEvent(new Event("test1"));
        assert.deepEqual(reportedTypes, ["test1"]);
    });

    it("addType_when_relay_is_not_active_captures_event", () => {
        let extraType: string = "test2";
        let relay: EventRelay = createRelayFor(["test1"]);
        captureEventsOf([extraType]);
        relay.addType(extraType);
        relay.start();
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.deepEqual(reportedTypes, ["test1", extraType]);
    });

    it("addType_when_relay_is_active_captures_event", () => {
        let extraType: string = "test2";
        let relay: EventRelay = createRelayFor(["test1"]);
        captureEventsOf([extraType]);
        relay.start();
        relay.addType(extraType);
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.deepEqual(reportedTypes, ["test1", extraType]);
    });

    it("removeType_removes_relay_of_event", () => {
        let relay: EventRelay = createRelayFor(["test1", "test2"]);
        relay.removeType("test1");
        relay.start();
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.deepEqual(reportedTypes, ["test2"]);
    });

    it("removeType_removes_relay_of_events", () => {
        let relay: EventRelay = createRelayFor(["test1", "test2"]);
        relay.removeType("test1");
        relay.removeType("test2");
        relay.start();
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.isEmpty(reportedTypes);
    });

    it("removeType_have_no_effect_when_event_is_not_mapped", () => {
        let relay: EventRelay = createRelayFor(["test1", "test2"]);
        relay.removeType("test3");
        relay.start();
        source.dispatchEvent(new Event("test1"));
        source.dispatchEvent(new Event("test2"));
        assert.deepEqual(reportedTypes, ["test1", "test2"]);
    });
});
