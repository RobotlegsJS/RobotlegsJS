// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { DomEventMapConfig } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/DomEventMapConfig";

describe("DomEventMapConfig", () => {
    const DISPATCHER: EventTarget = window;
    const EVENT_STRING: string = "myEvent";
    const LISTENER: EventListener = (e: Event) => {
        console.log("do nothing");
    };
    const OPTIONS: boolean | AddEventListenerOptions = false;

    let instance: DomEventMapConfig;

    beforeEach(() => {
        instance = new DomEventMapConfig(DISPATCHER, EVENT_STRING, LISTENER, OPTIONS);
    });

    afterEach(() => {
        instance = null;
    });

    it("can_be_instantiated", () => {
        assert.instanceOf(instance, DomEventMapConfig);
    });

    it("get_dispatcher", () => {
        assert.equal(instance.dispatcher, DISPATCHER);
    });

    it("get_eventString", () => {
        assert.equal(instance.eventString, EVENT_STRING);
    });

    it("get_listener", () => {
        assert.equal(instance.listener, LISTENER);
    });

    it("equalTo_validate_same_instance", () => {
        assert.isTrue(instance.equalTo(DISPATCHER, EVENT_STRING, LISTENER, OPTIONS));
    });

    it("equalTo_do_not_accept_different_event_string", () => {
        assert.isFalse(instance.equalTo(DISPATCHER, "anotherEvent", LISTENER, OPTIONS));
    });

    it("equalTo_do_not_accept_different_listener", () => {
        assert.isFalse(
            instance.equalTo(
                DISPATCHER,
                EVENT_STRING,
                (e: Event) => {
                    console.log("Call me crazy!");
                },
                OPTIONS
            )
        );
    });

    it("equalTo_do_not_accept_different_options", () => {
        assert.isFalse(instance.equalTo(DISPATCHER, EVENT_STRING, LISTENER, true));
    });

    it("equalTo_do_not_accept_different_instance", () => {
        assert.isFalse(
            instance.equalTo(
                window,
                "anotherEvent",
                (e: Event) => {
                    console.log("Call me crazy!");
                },
                true
            )
        );
    });
});
