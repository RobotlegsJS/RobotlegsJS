// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/// <reference path="../../../../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../../../../../typings/index.d.ts" />

import "reflect-metadata";

import { assert } from "chai";

import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";
import { CommandPayload } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/CommandPayload";
import { CommandExecutor } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandExecutor";
import { CommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapping";
import { IInjector } from "../../../../../../src/robotlegs/bender/framework/api/IInjector";
import { RobotlegsInjector } from "../../../../../../src/robotlegs/bender/framework/impl/RobotlegsInjector";

import { HappyGuard } from "./../../../framework/impl/guardSupport/HappyGuard";
import { GrumpyGuard } from "./../../../framework/impl/guardSupport/GrumpyGuard";

import { ClassReportingCallbackCommand } from "../support/ClassReportingCallbackCommand";
import { ClassReportingCallbackCommand2 } from "../support/ClassReportingCallbackCommand2";
import { ClassReportingCallbackGuard } from "../support/ClassReportingCallbackGuard";
import { ClassReportingCallbackGuard2 } from "../support/ClassReportingCallbackGuard2";
import { ClassReportingCallbackHook } from "../support/ClassReportingCallbackHook";
import { ExecutelessCommand } from "../support/ExecutelessCommand";
import { IncorrectExecuteCommand } from "../support/IncorrectExecuteCommand";
import { MessageReturningCommand } from "../support/MessageReturningCommand";
import { MethodParametersCommand } from "../support/MethodParametersCommand";
import { NullCommand } from "../support/NullCommand";
import { PayloadInjectionPointsCommand } from "../support/PayloadInjectionPointsCommand";
import { PayloadInjectionPointsGuard } from "../support/PayloadInjectionPointsGuard";
import { PayloadInjectionPointsHook } from "../support/PayloadInjectionPointsHook";
import { ReportMethodCommand } from "../support/ReportMethodCommand";
import { SelfReportingCallbackCommand } from "../support/SelfReportingCallbackCommand";
import { SelfReportingCallbackHook } from "../support/SelfReportingCallbackHook";

describe("CommandExecutor", () => {

    let mappings: ICommandMapping[];
    let subject: CommandExecutor;
    let reported: any[];
    let injector: IInjector;

    function addMapping(commandClass: any = null): ICommandMapping {
        let mapping: ICommandMapping = new CommandMapping(commandClass || ClassReportingCallbackCommand);
        mappings.push(mapping);
        return mapping;
    }

    function addMappings(totalEvents: number = 1, commandClass: any = null): void {
        while (totalEvents--) {
            addMapping(commandClass);
        }
    }

    function executeCommands(payload: CommandPayload = null): void {
        subject.executeCommands(mappings, payload);
    }

    function reportingFunction(item: Object): void {
        reported.push(item);
    }

    function resultReporter(result: any, command: Object, mapping: ICommandMapping): void {
        reported.push(result);
        reported.push(mapping);
    }

    beforeEach(() => {
        reported = [];
        injector = new RobotlegsInjector();
        injector.bind("Function").toConstantValue(reportingFunction).whenTargetNamed("reportingFunction");
        subject = new CommandExecutor(injector);
        mappings = [];
    });

    afterEach(() => {
        mappings = null;
        subject = null;
        reported = null;
        injector = null;
    });

    it("oneShotMapping is removed", () => {
        let actualMapping: ICommandMapping = addMapping(ClassReportingCallbackCommand);
        let expectedMapping: ICommandMapping = null;
        let callCount: number = 0;
        actualMapping.setFireOnce(true);
        subject = new CommandExecutor(
            injector,
            function unmap(mapping: ICommandMapping): void {
                expectedMapping = mapping;
                callCount++;
            }
        );
        executeCommands();
        assert.equal(actualMapping, expectedMapping);
        assert.equal(callCount, 1);
    });

    it("command without execute method is still constructed", () => {
        addMapping(ExecutelessCommand).setExecuteMethod(null);
        executeCommands();
        assert.deepEqual(reported, [ExecutelessCommand]);
    });

    it("command is executed", () => {
        addMapping();
        executeCommands();
        assert.deepEqual(reported, [ClassReportingCallbackCommand]);
    });

    it("command is executed repeatedly", () => {
        addMappings(5);
        executeCommands();
        assert.equal(reported.length, 5);
    });

    it("hooks are called", () => {
        addMapping(NullCommand).addHooks(
            ClassReportingCallbackHook, ClassReportingCallbackHook, ClassReportingCallbackHook
        );
        executeCommands();
        assert.equal(reported.length, 3);
    });

    it("command is injected into hook", () => {
        let executedCommand: SelfReportingCallbackCommand = null;
        let injectedCommand: SelfReportingCallbackCommand = null;
        injector.bind("Function").toConstantValue(function(command: SelfReportingCallbackCommand): void {
            executedCommand = command;
        }).whenTargetNamed("executeCallback");
        injector.bind("Function").toConstantValue(function(hook: SelfReportingCallbackHook): void {
            injectedCommand = hook.command;
        }).whenTargetNamed("hookCallback");
        addMapping(SelfReportingCallbackCommand).addHooks(SelfReportingCallbackHook);
        executeCommands();
        assert.equal(injectedCommand, executedCommand);
    });

    it("command executes when the guard allows", () => {
        addMapping().addGuards(HappyGuard);
        executeCommands();
        assert.deepEqual(reported, [ClassReportingCallbackCommand]);
    });

    it("command does not execute when any guards denies", () => {
        addMapping().addGuards(HappyGuard, GrumpyGuard);
        executeCommands();
        assert.deepEqual(reported, []);
    });

    it("execution sequence is guard command guard command with multiple mappings", () => {
        addMapping(ClassReportingCallbackCommand).addGuards(ClassReportingCallbackGuard);
        addMapping(ClassReportingCallbackCommand2).addGuards(ClassReportingCallbackGuard2);
        executeCommands();
        assert.deepEqual(
            reported,
            [
                ClassReportingCallbackGuard, ClassReportingCallbackCommand,
                ClassReportingCallbackGuard2, ClassReportingCallbackCommand2
            ]
        );
    });

    it("execution sequence is guard hook command", () => {
        addMapping().addGuards(ClassReportingCallbackGuard).addHooks(ClassReportingCallbackHook);
        executeCommands();
        assert.deepEqual(
            reported,
            [ClassReportingCallbackGuard, ClassReportingCallbackHook, ClassReportingCallbackCommand]
        );
    });

    it("allowed commands get executed after denied command", () => {
        addMapping(ClassReportingCallbackCommand).addGuards(GrumpyGuard);
        addMapping(ClassReportingCallbackCommand2);
        executeCommands();
        assert.deepEqual(reported, [ClassReportingCallbackCommand2]);
    });

    it("command with different method than execute is called", () => {
        addMapping(ReportMethodCommand).setExecuteMethod("report");
        executeCommands();
        assert.deepEqual(reported, [ReportMethodCommand]);
    });

    it("throws error when executeMethod is not a function", () => {
        function invalidExecuteMethod(): void {
            addMapping(IncorrectExecuteCommand);
            executeCommands();
        }
        assert.throws(invalidExecuteMethod, TypeError, "command[mapping.executeMethod].bind is not a function");
    });

    it("payload is injected into command", () => {
        addMapping(PayloadInjectionPointsCommand);
        let payload: CommandPayload = new CommandPayload(["message", 1], [String, Number]);
        executeCommands(payload);
        assert.deepEqual(reported, payload.values);
    });

    it("payload is injected into hook", () => {
        addMapping(NullCommand).addHooks(PayloadInjectionPointsHook);
        let payload: CommandPayload = new CommandPayload(["message", 1], [String, Number]);
        executeCommands(payload);
        assert.deepEqual(reported, payload.values);
    });

    it("payload is injected into guard", () => {
        addMapping(NullCommand).addGuards(PayloadInjectionPointsGuard);
        let payload: CommandPayload = new CommandPayload(["message", 1], [String, Number]);
        executeCommands(payload);
        assert.deepEqual(reported, payload.values);
    });

    it("payload is passed to execute method", () => {
        addMapping(MethodParametersCommand);
        let payload: CommandPayload = new CommandPayload(["message", 1], [String, Number]);
        executeCommands(payload);
        assert.deepEqual(reported, payload.values);
    });

    it("payloadInjection is disabled", () => {
        function payloadInjectionDisabledThrowsError(): void {
            addMapping(PayloadInjectionPointsCommand).setPayloadInjectionEnabled(false);
            let payload: CommandPayload = new CommandPayload(["message", 1], [String, Number]);
            executeCommands(payload);
        }
        assert.throws(payloadInjectionDisabledThrowsError, Error, "No bindings found for serviceIdentifier: String");
    });

    it("result is handled", () => {
        let mapping: ICommandMapping = new CommandMapping(MessageReturningCommand);
        subject = new CommandExecutor(injector, null, resultReporter);
        injector.bind(String).toConstantValue("message");
        subject.executeCommand(mapping);
        assert.deepEqual(reported, ["message", mapping]);
    });

    it("uses injector mapped command instance", () => {
        injector.bind("Function").toConstantValue(reportingFunction).whenTargetNamed("executeCallback");
        injector.bind(SelfReportingCallbackCommand).toSelf();
        let expected: Object = injector.get(SelfReportingCallbackCommand);
        let mapping: ICommandMapping = addMapping(SelfReportingCallbackCommand);
        subject.executeCommand(mapping);
        assert.deepEqual(reported, [expected]);
    });
});
