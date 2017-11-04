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
import { PinEvent } from "../../../../../../src/robotlegs/bender/framework/api/PinEvent";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";
import { CommandPayload } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/CommandPayload";

import { IDirectCommandMap } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/api/IDirectCommandMap";
import { DirectCommandMap } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/impl/DirectCommandMap";
import { DirectCommandMapper } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/impl/DirectCommandMapper";

import { NullCommand } from "../../commandCenter/support/NullCommand";
import { CallbackCommand } from "../../commandCenter/support/CallbackCommand";
import { CallbackCommand2 } from "../../commandCenter/support/CallbackCommand2";
import { PayloadInjectionPointsCommand } from "../../commandCenter/support/PayloadInjectionPointsCommand";

import { DirectCommandMapReportingCommand } from "../support/DirectCommandMapReportingCommand";

describe("DirectCommandMap", () => {
    let context: IContext;
    let subject: DirectCommandMap;
    let injector: IInjector;

    beforeEach(() => {
        context = new Context();
        injector = context.injector;
        injector.bind(IDirectCommandMap).to(DirectCommandMap);
        subject = injector.get<DirectCommandMap>(IDirectCommandMap);
    });

    afterEach(() => {});

    it("map_creates_IDirectCommandConfigurator", () => {
        assert.instanceOf(subject.map(NullCommand), DirectCommandMapper);
    });

    it("successfully_executes_command_classes", () => {
        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(function(): void {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject
            .map(CallbackCommand)
            .map(CallbackCommand2)
            .execute();

        assert.equal(executionCount, 2);
    });

    it("successfully_executes_command_class_passing_payload", () => {
        const expected: any[] = ["message", 1];
        let reported: any[] = [];

        let payload: CommandPayload = new CommandPayload(expected, [
            String,
            Number
        ]);

        injector
            .bind("Function")
            .toFunction((item: any) => {
                reported.push(item);
            })
            .whenTargetNamed("reportingFunction");

        subject.map(PayloadInjectionPointsCommand).execute(payload);

        assert.deepEqual(reported, expected);
    });

    it("commands_get_injected_with_DirectCommandMap_instance", () => {
        let actual: IDirectCommandMap = null;

        injector
            .bind("Function")
            .toFunction(function(passed: IDirectCommandMap): void {
                actual = passed;
            })
            .whenTargetNamed("reportingFunction");

        subject.map(DirectCommandMapReportingCommand).execute();

        assert.equal(actual, subject);
    });

    it("commands_are_disposed_after_execution", () => {
        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(function(): void {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.map(CallbackCommand).execute();
        subject.map(CallbackCommand).execute();

        assert.equal(executionCount, 2);
    });

    it("sandboxed_directCommandMap_instance_does_not_leak_into_system", () => {
        let actual: IDirectCommandMap = injector.get<IDirectCommandMap>(
            IDirectCommandMap
        );

        assert.notEqual(actual, subject);
    });

    it("detains_command", () => {
        let command: Object = {};
        let wasDetained: boolean = false;
        let handler: Function = function(...params): void {
            wasDetained = true;
        };

        context.addEventListener(PinEvent.DETAIN, handler);

        subject.detain(command);

        assert.isTrue(wasDetained);
    });

    it("releases_command", () => {
        let command: Object = {};
        let wasReleased: boolean = false;
        let handler: Function = function(...params): void {
            wasReleased = true;
        };

        context.addEventListener(PinEvent.RELEASE, handler);

        subject.detain(command);
        subject.release(command);

        assert.isTrue(wasReleased);
    });

    it("executes_command", () => {
        let executionCount: number = 0;

        injector
            .bind("Function")
            .toFunction(function(): void {
                executionCount++;
            })
            .whenTargetNamed("executeCallback");

        subject.map(CallbackCommand);
        subject.execute();

        assert.equal(executionCount, 1);
    });

    it("mapping_processor_is_called", () => {
        let callCount: number = 0;
        subject.addMappingProcessor(function(mapping: ICommandMapping): void {
            callCount++;
        });
        subject.map(NullCommand);
        assert.equal(callCount, 1);
    });

    it("mapping_processors_are_called", () => {
        let callCount: number = 0;
        subject.addMappingProcessor(function(mapping: ICommandMapping): void {
            callCount++;
        });
        subject.addMappingProcessor(function(mapping: ICommandMapping): void {
            callCount++;
        });
        subject.map(NullCommand);
        assert.equal(callCount, 2);
    });

    it("adding_mapping_processor_twice_is_called_once", () => {
        let callCount: number = 0;
        let mappingProcessor: Function = (mapping: ICommandMapping) => {
            callCount++;
        };
        subject.addMappingProcessor(mappingProcessor);
        subject.addMappingProcessor(mappingProcessor);
        subject.map(NullCommand);
        assert.equal(callCount, 1);
    });
});
