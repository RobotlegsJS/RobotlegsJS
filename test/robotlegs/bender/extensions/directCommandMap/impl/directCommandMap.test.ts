// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry.ts";

import { assert } from "chai";

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { IInjector } from "../../../../../../src/robotlegs/bender/framework/api/IInjector";
import { PinEvent } from "../../../../../../src/robotlegs/bender/framework/api/PinEvent";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";

import { IDirectCommandMap } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/api/IDirectCommandMap";
import { DirectCommandMap } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/impl/DirectCommandMap";
import { DirectCommandMapper } from "../../../../../../src/robotlegs/bender/extensions/directCommandMap/impl/DirectCommandMapper";

import { NullCommand } from "../../commandCenter/support/NullCommand";
import { CallbackCommand } from "../../commandCenter/support/CallbackCommand";
import { CallbackCommand2 } from "../../commandCenter/support/CallbackCommand2";

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

    afterEach(() => {

    });

    it("map creates IDirectCommandConfigurator", () => {
        assert.instanceOf(subject.map(NullCommand), DirectCommandMapper);
    });

    it("successfully executes command classes", () => {
        let executionCount: number = 0;

        injector.bind("Function").toFunction(function(): void {
            executionCount++;
        }).whenTargetNamed("executeCallback");

        subject
            .map(CallbackCommand)
            .map(CallbackCommand2)
            .execute();

        assert.equal(executionCount, 2);
    });

    it("commands get injected with DirectCommandMap instance", () => {
        let actual: IDirectCommandMap = null;

        injector.bind("Function").toFunction(function(passed: IDirectCommandMap): void {
            actual = passed;
        }).whenTargetNamed("reportingFunction");

        subject.map(DirectCommandMapReportingCommand).execute();

        assert.equal(actual, subject);
    });

    it("commands are disposed after execution", () => {
        let executionCount: number = 0;

        injector.bind("Function").toFunction(function(): void {
            executionCount++;
        }).whenTargetNamed("executeCallback");

        subject.map(CallbackCommand).execute();
        subject.map(CallbackCommand).execute();

        assert.equal(executionCount, 2);
    });

    it("sandboxed directCommandMap instance does not leak into system", () => {
        var actual: IDirectCommandMap = injector.get<IDirectCommandMap>(IDirectCommandMap);

        assert.notEqual(actual, subject);
    });

    it("detains command", () => {
        let command: Object = {};
        let wasDetained: Boolean = false;
        let handler: Function = function(...params): void {
            wasDetained = true;
        };

        context.addEventListener(PinEvent.DETAIN, handler);

        subject.detain(command);

        assert.isTrue(wasDetained);
    });

    it("releases command", () => {
        let command: Object = {};
        let wasReleased: Boolean = false;
        let handler: Function = function(...params): void {
            wasReleased = true;
        };

        context.addEventListener(PinEvent.RELEASE, handler);

        subject.detain(command);
        subject.release(command);

        assert.isTrue(wasReleased);
    });

    it("executes command", () => {
        let executionCount: number = 0;

        injector.bind("Function").toFunction(function(): void {
            executionCount++;
        }).whenTargetNamed("executeCallback");

        subject.map(CallbackCommand);
        subject.execute();

        assert.equal(executionCount, 1);
    });

    it("mapping processor is called", () => {
        let callCount: number = 0;
        subject.addMappingProcessor(function(mapping: ICommandMapping): void {
            callCount++;
        });
        subject.map(NullCommand);
        assert.equal(callCount, 1);
    });
});
