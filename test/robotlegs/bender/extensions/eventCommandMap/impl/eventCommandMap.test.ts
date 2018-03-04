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
import { IInjector } from "../../../../../../src/robotlegs/bender/framework/api/IInjector";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { IEvent } from "../../../../../../src/robotlegs/bender/events/api/IEvent";
import { IEventDispatcher } from "../../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { EventDispatcher } from "../../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

import { IClass } from "../../../../../../src/robotlegs/bender/extensions/matching/IClass";

import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";
import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";
import { ICommandMapper } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/dsl/ICommandMapper";
import { CommandMapper } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapper";
import { CommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapping";

import { IEventCommandMap } from "../../../../../../src/robotlegs/bender/extensions/eventCommandMap/api/IEventCommandMap";
import { EventCommandMap } from "../../../../../../src/robotlegs/bender/extensions/eventCommandMap/impl/EventCommandMap";
import { EventCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/eventCommandMap/impl/EventCommandTrigger";

import { HappyGuard } from "../../../framework/impl/guardSupport/HappyGuard";
import { GrumpyGuard } from "../../../framework/impl/guardSupport/GrumpyGuard";

import { CallbackCommand } from "../../commandCenter/support/CallbackCommand";
import { CallbackCommand2 } from "../../commandCenter/support/CallbackCommand2";
import { ClassReportingCallbackGuard } from "../../commandCenter/support/ClassReportingCallbackGuard";
import { ClassReportingCallbackGuard2 } from "../../commandCenter/support/ClassReportingCallbackGuard2";
import { ClassReportingCallbackCommand } from "../../commandCenter/support/ClassReportingCallbackCommand";
import { ClassReportingCallbackCommand2 } from "../../commandCenter/support/ClassReportingCallbackCommand2";
import { ClassReportingCallbackHook } from "../../commandCenter/support/ClassReportingCallbackHook";

import { NullCommand } from "../../commandCenter/support/NullCommand";

import { CascadingCommand } from "../support/CascadingCommand";
import { CommandMappingCommand } from "../support/CommandMappingCommand";
import { CommandUnmappingCommand } from "../support/CommandUnmappingCommand";
import { EventInjectedCallbackCommand } from "../support/EventInjectedCallbackCommand";
import { EventInjectedCallbackGuard } from "../support/EventInjectedCallbackGuard";
import { EventParametersCommand } from "../support/EventParametersCommand";
import { SupportEvent } from "../support/SupportEvent";
import { SupportEventTriggeredSelfReportingCallbackCommand } from "../support/SupportEventTriggeredSelfReportingCallbackCommand";

describe("EventCommandMap", () => {
    let reportedExecutions: any[];
    let context: IContext;
    let injector: IInjector;
    let dispatcher: EventDispatcher;
    let subject: EventCommandMap;

    function reportingFunction(item: any): void {
        reportedExecutions.push(item);
    }

    function commandExecutionCount(totalEvents: number = 1, oneshot: boolean = false): number {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
            })
            .whenTargetNamed("executeCallback");

        subject
            .map(SupportEvent.TYPE1, SupportEvent)
            .toCommand(CallbackCommand)
            .once(oneshot);

        while (totalEvents--) {
            dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        }

        return executeCount;
    }

    function oneshotCommandExecutionCount(totalEvents: number = 1): number {
        return commandExecutionCount(totalEvents, true);
    }

    function hookCallCount(...hooks: any[]): number {
        let executionCount: number = 0;
        injector.unbind("Function");
        injector
            .bind("Function")
            .toFunction(() => {
                executionCount++;
            })
            .whenTargetNamed("reportingFunction");
        subject
            .map(SupportEvent.TYPE1)
            .toCommand(NullCommand)
            .withHooks(hooks);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        return executionCount;
    }

    function commandExecutionCountWithGuards(...guards: any[]): number {
        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject
            .map(SupportEvent.TYPE1)
            .toCommand(CallbackCommand)
            .withGuards(guards);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        return executionCount;
    }

    beforeEach(() => {
        reportedExecutions = [];
        context = new Context();
        injector = context.injector;
        injector
            .bind("Function")
            .toConstantValue(reportingFunction)
            .whenTargetNamed("reportingFunction");
        dispatcher = new EventDispatcher();
        subject = new EventCommandMap(context, dispatcher);
        context.initialize();
    });

    afterEach(() => {
        reportedExecutions = null;
        context.destroy();
        context = null;
        injector = null;
        dispatcher = null;
        subject = null;
    });

    it("map_creates_mapper", () => {
        assert.instanceOf(subject.map(SupportEvent.TYPE1, SupportEvent), CommandMapper);
    });

    it("map_to_identical_Type_but_different_Event_returns_different_mapper", () => {
        let mapper1: ICommandMapper = subject.map(SupportEvent.TYPE1, SupportEvent);
        let mapper2: ICommandMapper = subject.map(SupportEvent.TYPE1, Event);
        assert.notEqual(mapper1, mapper2);
    });

    it("map_to_different_Type_but_identical_Event_returns_different_mapper", () => {
        let mapper1: ICommandMapper = subject.map(SupportEvent.TYPE1, SupportEvent);
        let mapper2: ICommandMapper = subject.map(SupportEvent.TYPE2, SupportEvent);
        assert.notEqual(mapper1, mapper2);
    });

    it("unmap_returns_mapper", () => {
        let mapper: ICommandMapper = subject.map(SupportEvent.TYPE1, SupportEvent);
        assert.instanceOf(subject.unmap(SupportEvent.TYPE1, SupportEvent), CommandMapper);
    });

    it("robust_to_unmapping_non_existent_mappings", () => {
        // note: no assertion, just testing for the lack of an NPE
        subject.unmap(SupportEvent.TYPE1, SupportEvent).fromCommand(NullCommand);
    });

    it("command_executes_successfully", () => {
        assert.equal(commandExecutionCount(1), 1);
    });

    it("command_executes_repeatedly", () => {
        assert.equal(commandExecutionCount(5), 5);
    });

    it("fireOnce_command_executes_once", () => {
        assert.equal(oneshotCommandExecutionCount(5), 1);
    });

    it("event_is_injected_into_command", () => {
        const expectedEvent: SupportEvent = new SupportEvent(SupportEvent.TYPE1);
        let injectedEvent: Event = null;

        injector
            .bind("Function")
            .toFunction((command: EventInjectedCallbackCommand) => {
                injectedEvent = command.event;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1, Event).toCommand(EventInjectedCallbackCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(injectedEvent, expectedEvent);
    });

    it("event_is_passed_to_execute_method", () => {
        const expectedEvent: SupportEvent = new SupportEvent(SupportEvent.TYPE1);
        let actualEvent: SupportEvent = null;

        injector
            .bind("Function")
            .toFunction((event: SupportEvent) => {
                actualEvent = event;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1, SupportEvent).toCommand(EventParametersCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(actualEvent, expectedEvent);
    });

    it("concretely_specified_typed_event_is_injected_into_command_as_typed_event", () => {
        const expectedEvent: SupportEvent = new SupportEvent(SupportEvent.TYPE1);
        let untypedEvent: Event;
        let typedEvent: SupportEvent;

        injector
            .bind("Function")
            .toFunction((command: SupportEventTriggeredSelfReportingCallbackCommand) => {
                untypedEvent = command.untypedEvent;
                typedEvent = command.typedEvent;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1, SupportEvent).toCommand(SupportEventTriggeredSelfReportingCallbackCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(typedEvent, expectedEvent);
        assert.isUndefined(untypedEvent);
    });

    it("abstractly_specified_typed_event_is_injected_into_command_as_untyped_event", () => {
        const expectedEvent: SupportEvent = new SupportEvent(SupportEvent.TYPE1);
        let untypedEvent: Event;
        let typedEvent: SupportEvent;

        injector
            .bind("Function")
            .toFunction((command: SupportEventTriggeredSelfReportingCallbackCommand) => {
                untypedEvent = command.untypedEvent;
                typedEvent = command.typedEvent;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1, Event).toCommand(SupportEventTriggeredSelfReportingCallbackCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(untypedEvent, expectedEvent);
        assert.isUndefined(typedEvent);
    });

    it("unspecified_typed_event_is_injected_into_command_as_typed_event", () => {
        const expectedEvent: SupportEvent = new SupportEvent(SupportEvent.TYPE1);
        let untypedEvent: Event;
        let typedEvent: SupportEvent;

        injector
            .bind("Function")
            .toFunction((command: SupportEventTriggeredSelfReportingCallbackCommand) => {
                untypedEvent = command.untypedEvent;
                typedEvent = command.typedEvent;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1).toCommand(SupportEventTriggeredSelfReportingCallbackCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(typedEvent, expectedEvent);
        assert.isUndefined(untypedEvent);
    });

    it("unspecified_untyped_event_is_injected_into_command_as_untyped_event", () => {
        const eventType: string = "eventType";
        const expectedEvent: Event = new Event(eventType);
        let untypedEvent: Event;
        let typedEvent: SupportEvent;

        injector
            .bind("Function")
            .toFunction((command: SupportEventTriggeredSelfReportingCallbackCommand) => {
                untypedEvent = command.untypedEvent;
                typedEvent = command.typedEvent;
            })
            .whenTargetNamed("executeCallback");

        subject.map(eventType).toCommand(SupportEventTriggeredSelfReportingCallbackCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(untypedEvent, expectedEvent);
        assert.isUndefined(typedEvent);
    });

    it("specified_untyped_event_is_injected_into_command_as_untyped_event", () => {
        const eventType: string = "eventType";
        const expectedEvent: Event = new Event(eventType);
        let untypedEvent: Event;
        let typedEvent: SupportEvent;

        injector
            .bind("Function")
            .toFunction((command: SupportEventTriggeredSelfReportingCallbackCommand) => {
                untypedEvent = command.untypedEvent;
                typedEvent = command.typedEvent;
            })
            .whenTargetNamed("executeCallback");

        subject.map(eventType, Event).toCommand(SupportEventTriggeredSelfReportingCallbackCommand);

        dispatcher.dispatchEvent(expectedEvent);

        assert.equal(untypedEvent, expectedEvent);
        assert.isUndefined(typedEvent);
    });

    it("command_does_not_execute_when_incorrect_eventType_dispatched", () => {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1).toCommand(CallbackCommand);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE2));

        assert.equal(executeCount, 0);
    });

    it("command_does_not_execute_when_incorrect_eventClass_dispatched", () => {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1, SupportEvent).toCommand(CallbackCommand);
        dispatcher.dispatchEvent(new Event(SupportEvent.TYPE1));

        assert.equal(executeCount, 0);
    });

    it("command_does_not_execute_after_event_unmapped", () => {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1, SupportEvent).toCommand(CallbackCommand);
        subject.unmap(SupportEvent.TYPE1, SupportEvent).fromCommand(CallbackCommand);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));

        assert.equal(executeCount, 0);
    });

    it("oneshot_mappings_should_not_bork_stacked_mappings", () => {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
            })
            .whenTargetNamed("executeCallback");

        subject
            .map(SupportEvent.TYPE1, SupportEvent)
            .toCommand(CallbackCommand)
            .once();
        subject
            .map(SupportEvent.TYPE1, SupportEvent)
            .toCommand(CallbackCommand2)
            .once();
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));

        assert.equal(executeCount, 2);
    });

    it("one_shot_command_should_not_cause_infinite_loop_when_dispatching_to_self", () => {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
                dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
            })
            .whenTargetNamed("executeCallback");

        subject
            .map(SupportEvent.TYPE1)
            .toCommand(CallbackCommand)
            .once();
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));

        assert.equal(executeCount, 1);
    });

    it("commands_should_not_stomp_over_event_mappings", () => {
        let executeCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executeCount++;
                dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE2));
            })
            .whenTargetNamed("executeCallback");

        subject.map(SupportEvent.TYPE1).toCommand(CallbackCommand);
        subject
            .map(SupportEvent.TYPE2)
            .toCommand(CallbackCommand)
            .once();
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));

        assert.equal(executeCount, 2);
    });

    it("commands_are_executed_in_order", () => {
        subject.map(SupportEvent.TYPE1).toCommand(ClassReportingCallbackCommand);
        subject.map(SupportEvent.TYPE1).toCommand(ClassReportingCallbackCommand2);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        assert.deepEqual(reportedExecutions, [ClassReportingCallbackCommand, ClassReportingCallbackCommand2]);
    });

    it("hooks_are_called", () => {
        assert.equal(hookCallCount(ClassReportingCallbackHook, ClassReportingCallbackHook), 2);
    });

    it("command_executes_when_the_guard_allows", () => {
        assert.equal(commandExecutionCountWithGuards(HappyGuard), 1);
    });

    it("command_executes_when_all_guards_allow", () => {
        assert.equal(commandExecutionCountWithGuards(HappyGuard, HappyGuard), 1);
    });

    it("command_does_not_execute_when_the_guard_denies", () => {
        assert.equal(commandExecutionCountWithGuards(GrumpyGuard), 0);
    });

    it("command_does_not_execute_when_any_guards_denies", () => {
        assert.equal(commandExecutionCountWithGuards(HappyGuard, GrumpyGuard), 0);
    });

    it("command_does_not_execute_when_all_guards_deny", () => {
        assert.equal(commandExecutionCountWithGuards(GrumpyGuard, GrumpyGuard), 0);
    });

    it("event_is_injected_into_guard", () => {
        const event: SupportEvent = new SupportEvent(SupportEvent.TYPE1);
        let injectedEvent: Event = null;

        injector
            .bind("Function")
            .toFunction((guard: EventInjectedCallbackGuard) => {
                injectedEvent = guard.event;
            })
            .whenTargetNamed("approveCallback");
        subject
            .map(SupportEvent.TYPE1, Event)
            .toCommand(NullCommand)
            .withGuards(EventInjectedCallbackGuard);

        dispatcher.dispatchEvent(event);
        assert.equal(injectedEvent, event);
    });

    it("cascading_events_do_not_throw_unmap_errors", () => {
        injector.bind(IEventDispatcher).toConstantValue(dispatcher);
        injector.bind(IEventCommandMap).toConstantValue(subject);
        subject
            .map(CascadingCommand.EVENT_TYPE)
            .toCommand(CascadingCommand)
            .once();
        dispatcher.dispatchEvent(new Event(CascadingCommand.EVENT_TYPE));
    });

    it("execution_sequence_is_guard_command_guard_command_for_multiple_mappings_to_same_event", () => {
        subject
            .map(SupportEvent.TYPE1)
            .toCommand(ClassReportingCallbackCommand)
            .withGuards(ClassReportingCallbackGuard);
        subject
            .map(SupportEvent.TYPE1)
            .toCommand(ClassReportingCallbackCommand2)
            .withGuards(ClassReportingCallbackGuard2);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        const expectedOrder: any[] = [
            ClassReportingCallbackGuard,
            ClassReportingCallbackCommand,
            ClassReportingCallbackGuard2,
            ClassReportingCallbackCommand2
        ];
        assert.deepEqual(reportedExecutions, expectedOrder);
    });

    it("previously_constructed_command_does_not_slip_through_the_loop", () => {
        subject
            .map(SupportEvent.TYPE1)
            .toCommand(ClassReportingCallbackCommand)
            .withGuards(HappyGuard);
        subject
            .map(SupportEvent.TYPE1)
            .toCommand(ClassReportingCallbackCommand2)
            .withGuards(GrumpyGuard);
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        const expectedOrder: any[] = [ClassReportingCallbackCommand];
        assert.deepEqual(reportedExecutions, expectedOrder);
    });

    it("commands_mapped_during_execution_are_not_executed", () => {
        injector.bind(IEventCommandMap).toConstantValue(subject);
        injector
            .bind(ICommand)
            .toConstantValue(ClassReportingCallbackCommand)
            .whenTargetNamed("nestedCommand");
        subject
            .map(SupportEvent.TYPE1, Event)
            .toCommand(CommandMappingCommand)
            .once();
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        assert.deepEqual(reportedExecutions, []);
    });

    it("commands_unmapped_during_execution_are_still_executed", () => {
        injector.bind(IEventCommandMap).toConstantValue(subject);
        injector
            .bind(ICommand)
            .toConstantValue(ClassReportingCallbackCommand)
            .whenTargetNamed("nestedCommand");
        subject
            .map(SupportEvent.TYPE1, Event)
            .toCommand(CommandUnmappingCommand)
            .once();
        subject
            .map(SupportEvent.TYPE1, Event)
            .toCommand(ClassReportingCallbackCommand)
            .once();
        dispatcher.dispatchEvent(new SupportEvent(SupportEvent.TYPE1));
        assert.deepEqual(reportedExecutions, [ClassReportingCallbackCommand]);
    });

    it("mapping_processor_is_called", () => {
        let callCount: number = 0;
        subject.addMappingProcessor((mapping: ICommandMapping) => {
            callCount++;
        });
        subject.map("type").toCommand(NullCommand);
        assert.equal(callCount, 1);
    });

    it("mapping_processor_are_called", () => {
        let callCount: number = 0;
        subject.addMappingProcessor((mapping: ICommandMapping) => {
            callCount++;
        });
        subject.addMappingProcessor((mapping: ICommandMapping) => {
            callCount++;
        });
        subject.addMappingProcessor((mapping: ICommandMapping) => {
            callCount++;
        });
        subject.map("type").toCommand(NullCommand);
        assert.equal(callCount, 3);
    });

    it("mapping_processor_added_twice_is_called_once", () => {
        let callCount: number = 0;
        let processor: Function = (mapping: ICommandMapping) => {
            callCount++;
        };
        subject.addMappingProcessor(processor);
        subject.addMappingProcessor(processor);
        subject.map("type").toCommand(NullCommand);
        assert.equal(callCount, 1);
    });
});
