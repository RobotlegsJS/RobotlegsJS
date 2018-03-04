// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { IClass } from "../../../../../../src/robotlegs/bender/extensions/matching/IClass";

import { IEvent } from "../../../../../../src/robotlegs/bender/events/api/IEvent";
import { IEventDispatcher } from "../../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { EventDispatcher } from "../../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

import { EventMapConfig } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/EventMapConfig";

import { CustomEvent } from "../support/CustomEvent";

describe("EventMapConfig", () => {
    const DISPATCHER: IEventDispatcher = new EventDispatcher();
    const EVENT_STRING: string = "myEvent";
    const LISTENER: Function = () => {
        console.log("do nothing");
    };
    const THIS_OBJECT: any = this;
    const EVENT_TYPE: IClass<IEvent> = Event;
    const CALLBACK: Function = () => {
        console.log("do nothing");
    };
    const USE_CAPTURE: boolean = true;
    const PRIORITY: number = 0;

    let instance: EventMapConfig;

    beforeEach(() => {
        instance = new EventMapConfig(DISPATCHER, EVENT_STRING, LISTENER, THIS_OBJECT, EVENT_TYPE, CALLBACK, USE_CAPTURE, PRIORITY);
    });

    afterEach(() => {
        instance = null;
    });

    it("can_be_instantiated", () => {
        assert.instanceOf(instance, EventMapConfig);
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

    it("get_thisObject", () => {
        assert.equal(instance.thisObject, THIS_OBJECT);
    });

    it("get_eventClass", () => {
        assert.equal(instance.eventClass, EVENT_TYPE);
    });

    it("get_callback", () => {
        assert.equal(instance.callback, CALLBACK);
    });

    it("get_useCapture", () => {
        assert.equal(instance.useCapture, USE_CAPTURE);
    });

    it("get_priority", () => {
        assert.equal(instance.priority, PRIORITY);
    });

    it("equalTo_validate_same_instance", () => {
        assert.isTrue(instance.equalTo(DISPATCHER, EVENT_STRING, LISTENER, THIS_OBJECT, EVENT_TYPE, USE_CAPTURE));
    });

    it("equalTo_do_not_accept_different_dispatcher", () => {
        assert.isFalse(instance.equalTo(new EventDispatcher(), EVENT_STRING, LISTENER, THIS_OBJECT, EVENT_TYPE, USE_CAPTURE));
    });

    it("equalTo_do_not_accept_different_event_string", () => {
        assert.isFalse(instance.equalTo(DISPATCHER, "anotherEvent", LISTENER, THIS_OBJECT, EVENT_TYPE, USE_CAPTURE));
    });

    it("equalTo_do_not_accept_different_listener", () => {
        assert.isFalse(
            instance.equalTo(
                DISPATCHER,
                EVENT_STRING,
                () => {
                    console.log("Call me crazy!");
                },
                THIS_OBJECT,
                EVENT_TYPE,
                USE_CAPTURE
            )
        );
    });

    it("equalTo_do_not_accept_different_this_object", () => {
        assert.isFalse(instance.equalTo(DISPATCHER, EVENT_STRING, LISTENER, {}, EVENT_TYPE, USE_CAPTURE));
    });

    it("equalTo_do_not_accept_different_event_type", () => {
        assert.isFalse(instance.equalTo(DISPATCHER, EVENT_STRING, LISTENER, THIS_OBJECT, CustomEvent, USE_CAPTURE));
    });

    it("equalTo_do_not_accept_different_use_Capture", () => {
        assert.isFalse(instance.equalTo(DISPATCHER, EVENT_STRING, LISTENER, THIS_OBJECT, EVENT_TYPE, false));
    });

    it("equalTo_do_not_accept_different_instance", () => {
        assert.isFalse(
            instance.equalTo(
                new EventDispatcher(),
                "anotherEvent",
                () => {
                    console.log("Call me crazy!");
                },
                {},
                CustomEvent,
                false
            )
        );
    });
});
