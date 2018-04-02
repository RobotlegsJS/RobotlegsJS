// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { IInjector } from "../../../../../../src/robotlegs/bender/framework/api/IInjector";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { IClass } from "../../../../../../src/robotlegs/bender/extensions/matching/IClass";

import { CommandPayload } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/CommandPayload";
import { ICommand } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommand";
import { ICommandExecutor } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandExecutor";
import { ICommandMappingList } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMappingList";

import { CommandExecutor } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandExecutor";
import { CommandMappingList } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMappingList";
import { NullCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/NullCommandTrigger";

import { IDirectCommandConfigurator } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/dsl/IDirectCommandConfigurator";
import { DirectCommandMapper } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/impl/DirectCommandMapper";

import { NullCommand } from "../../commandCenter/support/NullCommand";
import { CallbackCommand } from "../../commandCenter/support/CallbackCommand";
import { PayloadInjectionPointsCommand } from "../../commandCenter/support/PayloadInjectionPointsCommand";

import { HappyGuard } from "../../../framework/impl/guardSupport/HappyGuard";
import { GrumpyGuard } from "../../../framework/impl/guardSupport/GrumpyGuard";
import { CallbackHook } from "../../../framework/impl/hookSupport/CallbackHook";

describe("DirectCommandMapper", () => {
    let context: IContext;
    let injector: IInjector;
    let executor: ICommandExecutor;
    let mappings: ICommandMappingList;
    let mappingProcessors: any[];
    let subject: DirectCommandMapper;

    function createMapper(commandClass: IClass<ICommand>): DirectCommandMapper {
        context = new Context();
        context.initialize();
        injector = context.injector;
        let sandboxedInjector: IInjector = context.injector.createChild();
        mappingProcessors = [];
        mappings = new CommandMappingList(new NullCommandTrigger(), mappingProcessors, context.getLogger(this));
        executor = new CommandExecutor(sandboxedInjector, mappings.removeMapping.bind(mappings));
        return new DirectCommandMapper(executor, mappings, commandClass);
    }

    afterEach(() => {
        context.destroy();
        injector = null;
        executor = null;
        mappings = null;
        mappingProcessors = null;
        subject = null;
    });

    it("creates_DirectCommandMapper", () => {
        subject = createMapper(NullCommand);
        assert.instanceOf(subject, DirectCommandMapper);
    });

    it("successfully_executes_command_class", () => {
        subject = createMapper(CallbackCommand);

        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.execute();

        assert.equal(executionCount, 1);
    });

    it("successfully_executes_command_class_passing_payload", () => {
        subject = createMapper(PayloadInjectionPointsCommand);

        const expected: any[] = ["message", 1];
        let reported: any[] = [];

        let payload: CommandPayload = new CommandPayload(expected, [String, Number]);

        injector
            .bind("Function")
            .toFunction((item: any) => {
                reported.push(item);
            })
            .whenTargetNamed("reportingFunction");

        subject.execute(payload);

        assert.deepEqual(reported, expected);
    });

    it("withGuards_sets_happy_guard_and_execute_command", () => {
        subject = createMapper(CallbackCommand);

        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.withGuards(HappyGuard).execute();

        assert.equal(executionCount, 1);
    });

    it("withGuards_sets_grumpy_guard_and_do_not_execute_command", () => {
        subject = createMapper(CallbackCommand);

        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.withGuards(HappyGuard, GrumpyGuard).execute();

        assert.equal(executionCount, 0);
    });

    it("withHooks_sets_hooks_and_execute_command", () => {
        subject = createMapper(CallbackCommand);

        let hookCount: number = 0;
        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(() => {
                hookCount++;
            })
            .whenTargetNamed("hookCallback");

        injector
            .bind("Function")
            .toFunction(() => {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.withHooks(CallbackHook).execute();

        assert.equal(hookCount, 1);
        assert.equal(executionCount, 1);
    });

    it("withPayloadInjection_sets_payloadInjection_and_execute_command", () => {
        subject = createMapper(PayloadInjectionPointsCommand);

        const expected: any[] = ["message", 1];
        let reported: any[] = [];

        let payload: CommandPayload = new CommandPayload(expected, [String, Number]);

        injector
            .bind("Function")
            .toFunction((item: any) => {
                reported.push(item);
            })
            .whenTargetNamed("reportingFunction");

        subject.withPayloadInjection().execute(payload);

        assert.deepEqual(reported, expected);
    });

    it("withPayloadInjection_sets_payloadInjection_to_false_and_disable_payload_injection", () => {
        function disablePayloadInjection(): void {
            subject = createMapper(PayloadInjectionPointsCommand);

            const expected: any[] = ["message", 1];
            let reported: any[] = [];

            let payload: CommandPayload = new CommandPayload(expected, [String, Number]);

            injector
                .bind("Function")
                .toFunction((item: any) => {
                    reported.push(item);
                })
                .whenTargetNamed("reportingFunction");

            subject.withPayloadInjection(false).execute(payload);
        }

        assert.throws(disablePayloadInjection, Error);
    });

    it("map_creates_new_mapper_instance", () => {
        subject = createMapper(NullCommand);

        let newMapper: IDirectCommandConfigurator = subject.map(CallbackCommand);

        assert.instanceOf(newMapper, DirectCommandMapper);
        assert.notEqual(newMapper, subject);
    });
});
