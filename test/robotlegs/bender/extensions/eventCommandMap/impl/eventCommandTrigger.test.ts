// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import sinon = require("sinon");

import { assert } from "chai";

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { IEvent } from "../../../../../../src/robotlegs/bender/events/api/IEvent";
import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { EventDispatcher } from "../../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

import { IClass } from "../../../../../../src/robotlegs/bender/extensions/matching/IClass";

import { CommandMapper } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapper";
import { CommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapping";
import { EventCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/eventCommandMap/impl/EventCommandTrigger";

import { CustomEvent1 } from "../support/CustomEvent1";
import { CustomEvent1CallbackCommand } from "../support/CustomEvent1CallbackCommand";
import { CustomEvent2 } from "../support/CustomEvent2";
import { EventCallbackCommand } from "../support/EventCallbackCommand";

describe("EventCommandTrigger", () => {
    let context: IContext;
    let eventDispatcher: EventDispatcher;
    let eventCommandTrigger: EventCommandTrigger;

    function createTrigger(eventType: string, eventClass?: IClass<IEvent>, processors?: any[]): void {
        eventCommandTrigger = new EventCommandTrigger(context.injector, eventDispatcher, eventType, eventClass, processors);
        context.initialize();
    }

    beforeEach(() => {
        context = new Context();
        eventDispatcher = new EventDispatcher();
    });

    afterEach(() => {
        context.destroy();
        eventCommandTrigger = null;
        eventDispatcher = null;
        context = null;
    });

    it("createMapper_returns_a_instance_of_CommandMapper", () => {
        createTrigger("added");
        assert.instanceOf(eventCommandTrigger.createMapper(), CommandMapper);
    });

    it("activating_adds_listener", () => {
        createTrigger("added");

        let eventDispatcherMock = sinon.mock(eventDispatcher);

        // Expects that console messages are called
        eventDispatcherMock
            .expects("addEventListener")
            .withArgs("added")
            .once();
        eventCommandTrigger.activate();

        // Verify if addEventListener is called by trigger
        eventDispatcherMock.restore();
        eventDispatcherMock.verify();
    });

    it("deactivating_removes_listener", () => {
        createTrigger("added");

        let eventDispatcherMock = sinon.mock(eventDispatcher);

        // Expects that console messages are called
        eventDispatcherMock
            .expects("removeEventListener")
            .withArgs("added")
            .once();
        eventCommandTrigger.deactivate();

        // Verify if addEventListener is called by trigger
        eventDispatcherMock.restore();
        eventDispatcherMock.verify();
    });

    it("toString_describe_event_command_trigger_when_eventClass_is_not_defined", () => {
        createTrigger("added");

        const expected: string = "Event with selector 'added'";
        let actual: string = eventCommandTrigger.toString();
        assert.equal(actual, expected);
    });

    it("toString_describe_event_command_trigger_when_eventClass_is_defined", () => {
        createTrigger(CustomEvent1.ADDED, CustomEvent1);

        const expected: string = "CustomEvent1 with selector 'added'";
        let actual: string = eventCommandTrigger.toString();
        assert.equal(actual, expected);
    });

    it("event_is_processed_by_command_when_event_class_is_not_defined", () => {
        let actual: Event;

        createTrigger("added");
        context.injector
            .bind("Function")
            .toConstantValue((event: Event) => {
                actual = event;
            })
            .whenTargetNamed("reportEvent");
        eventCommandTrigger.createMapper().toCommand(EventCallbackCommand);
        eventCommandTrigger.activate();
        eventDispatcher.dispatchEvent(new Event("added"));
        assert.instanceOf(actual, Event);
    });

    it("events_are_processed_by_command_when_event_class_is_not_defined", () => {
        let actual1: Event;
        let actual2: Event;

        createTrigger("added");
        context.injector
            .bind("Function")
            .toConstantValue((event: Event) => {
                if (!actual1) {
                    actual1 = event;
                } else {
                    actual2 = event;
                }
            })
            .whenTargetNamed("reportEvent");
        eventCommandTrigger.createMapper().toCommand(EventCallbackCommand);
        eventCommandTrigger.activate();
        eventDispatcher.dispatchEvent(new Event("added"));
        eventDispatcher.dispatchEvent(new Event("added"));
        assert.isNotNull(actual1);
        assert.instanceOf(actual1, Event);
        assert.isNotNull(actual2);
        assert.instanceOf(actual2, Event);
        assert.notEqual(actual1, actual2);
    });

    it("event_is_processed_by_command_when_event_class_is_defined", () => {
        let actual: Event;

        createTrigger(CustomEvent1.ADDED, CustomEvent1);
        context.injector
            .bind("Function")
            .toConstantValue((event: Event) => {
                actual = event;
            })
            .whenTargetNamed("reportEvent");
        eventCommandTrigger.createMapper().toCommand(CustomEvent1CallbackCommand);
        eventCommandTrigger.activate();
        eventDispatcher.dispatchEvent(new CustomEvent1(CustomEvent1.ADDED));
        assert.instanceOf(actual, CustomEvent1);
    });

    it("event_is_not_processed_by_command_when_event_class_is_different_than_expected", () => {
        let count: number = 0;

        createTrigger(CustomEvent1.ADDED, CustomEvent1);
        context.injector
            .bind("Function")
            .toConstantValue((event: Event) => {
                count++;
            })
            .whenTargetNamed("reportEvent");
        eventCommandTrigger.createMapper().toCommand(CustomEvent1CallbackCommand);
        eventCommandTrigger.activate();
        eventDispatcher.dispatchEvent(new CustomEvent1(CustomEvent1.ADDED));
        eventDispatcher.dispatchEvent(new CustomEvent2(CustomEvent2.ADDED));
        assert.equal(count, 1);
    });

    it("event_is_not_processed_by_command_when_event_class_does_not_match_received_event", () => {
        let actual: Event;

        createTrigger(CustomEvent1.ADDED, CustomEvent1);
        context.injector
            .bind("Function")
            .toConstantValue((event: Event) => {
                actual = event;
            })
            .whenTargetNamed("reportEvent");
        eventCommandTrigger.createMapper().toCommand(CustomEvent1CallbackCommand);
        eventCommandTrigger.activate();
        eventDispatcher.dispatchEvent(new CustomEvent2(CustomEvent2.ADDED));
        assert.isUndefined(actual);
    });

    it("mapping_processors_are_called", () => {
        let processors: any[] = [];
        let callCount: number = 0;
        let actual: Event;
        processors.push((mapping: CommandMapping) => {
            callCount++;
        });
        processors.push((mapping: CommandMapping) => {
            callCount++;
        });
        processors.push((mapping: CommandMapping) => {
            callCount++;
        });
        createTrigger(CustomEvent1.ADDED, CustomEvent1, processors);
        context.injector
            .bind("Function")
            .toConstantValue((event: Event) => {
                actual = event;
            })
            .whenTargetNamed("reportEvent");
        eventCommandTrigger.createMapper().toCommand(CustomEvent1CallbackCommand);
        eventCommandTrigger.activate();
        eventDispatcher.dispatchEvent(new CustomEvent1(CustomEvent1.ADDED));
        assert.instanceOf(actual, CustomEvent1);
        assert.equal(callCount, 3);
    });
});
