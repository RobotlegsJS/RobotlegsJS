// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import sinon = require("sinon");

import { ILogger } from "../../../../../../src/robotlegs/bender/framework/api/ILogger";
import { LogLevel } from "../../../../../../src/robotlegs/bender/framework/api/LogLevel";
import { Logger } from "../../../../../../src/robotlegs/bender/framework/impl/Logger";

import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";
import { ICommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandTrigger";
import { CommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapping";
import { CommandMappingList } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMappingList";
import { NullCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/NullCommandTrigger";

import { CallbackLogTarget } from "../../../framework/impl/loggingSupport/CallbackLogTarget";
import { LogParams } from "../../../framework/impl/loggingSupport/LogParams";

import { NullCommand } from "../support/NullCommand";
import { NullCommand2 } from "../support/NullCommand2";
import { NullCommand3 } from "../support/NullCommand3";
import { PriorityMapping } from "../support/PriorityMapping";

describe("CommandMappingList", () => {
    let logger: ILogger;
    let debugLogParams: LogParams;
    let warnLogParams: LogParams;
    let trigger: ICommandTrigger;
    let subject: CommandMappingList;
    let mapping1: ICommandMapping;
    let mapping2: ICommandMapping;
    let mapping3: ICommandMapping;
    let processors: any[] = [];

    function addPriorityMappings(): void {
        subject.addMapping(new PriorityMapping(NullCommand, 1));
        subject.addMapping(new PriorityMapping(NullCommand2, 2));
        subject.addMapping(new PriorityMapping(NullCommand3, 3));
    }

    beforeEach(() => {
        processors = [];
        logger = new Logger(
            {},
            new CallbackLogTarget(function(result: LogParams): void {
                if (result.level === LogLevel.DEBUG) {
                    debugLogParams = result;
                } else if (result.level === LogLevel.WARN) {
                    warnLogParams = result;
                }
            })
        );
        trigger = new NullCommandTrigger();
        subject = new CommandMappingList(trigger, processors, logger);
        mapping1 = new CommandMapping(NullCommand);
        mapping2 = new CommandMapping(NullCommand2);
        mapping3 = new CommandMapping(NullCommand3);
    });

    afterEach(() => {
        logger = null;
        debugLogParams = null;
        warnLogParams = null;
        trigger = null;
        subject = null;
        mapping1 = null;
        mapping2 = null;
        mapping3 = null;
        processors = null;
    });

    it("trigger_is_activated_when_first_mapping_is_added", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(mapping1);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_not_activated_when_second_mapping_is_added", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_not_activated_when_mapping_overwritten", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(new CommandMapping(NullCommand));
        subject.addMapping(new CommandMapping(NullCommand));
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_not_activated_for_second_identical_mapping", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping1);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_deactivated_when_last_mapping_is_removed", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.removeMappingFor(mapping1.commandClass);
        subject.removeMappingFor(mapping2.commandClass);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_deactivated_when_all_mappings_are_removed", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        subject.removeAllMappings();
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_not_deactivated_when_list_is_already_empty", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").never();
        subject.removeAllMappings();
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger_is_not_deactivated_when_second_last_mapping_is_removed", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").never();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.removeMappingFor(mapping1.commandClass);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("addMapping_logged_debug_message", () => {
        subject.addMapping(mapping1);
        assert.equal(debugLogParams.message, "{0} mapped to {1}");
    });

    it("addMapping_ignore_debug_message_when_logger_is_not_provided", () => {
        subject = new CommandMappingList(trigger, processors);
        subject.addMapping(mapping1);
        assert.isNull(debugLogParams);
    });

    it("removeMapping_logged_debug_message", () => {
        subject.addMapping(mapping1);
        subject.removeMapping(mapping1);
        assert.equal(debugLogParams.message, "{0} unmapped from {1}");
    });

    it("addMapping_ignore_debug_message_when_logger_is_not_provided", () => {
        subject = new CommandMappingList(trigger, processors);
        subject.addMapping(mapping1);
        subject.removeMapping(mapping1);
        assert.isNull(debugLogParams);
    });

    it("warning_logged_when_mapping_overwritten", () => {
        subject.addMapping(new CommandMapping(NullCommand));
        subject.addMapping(new CommandMapping(NullCommand));
        assert.equal(warnLogParams.message.indexOf("{0} already mapped to {1}"), 0);
    });

    it("warning_ignored_when_logger_is_not_provided", () => {
        subject = new CommandMappingList(trigger, processors);
        subject.addMapping(new CommandMapping(NullCommand));
        subject.addMapping(new CommandMapping(NullCommand));
        assert.isNull(warnLogParams);
    });

    it("list_is_empty", () => {
        assert.equal(subject.getList().length, 0);
    });

    it("list_not_empty_after_mapping_added", () => {
        subject.addMapping(mapping1);
        assert.equal(subject.getList().length, 1);
    });

    it("list_has_mapping", () => {
        subject.addMapping(mapping1);
        assert.equal(subject.getList().indexOf(mapping1), 0);
    });

    it("list_is_empty_after_mappings_are_removed", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.removeMapping(mapping1);
        subject.removeMapping(mapping2);
        assert.equal(subject.getList().length, 0);
    });

    it("list_is_empty_after_removeAll", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        subject.removeAllMappings();
        assert.equal(subject.getList().length, 0);
    });

    it("getList_returns_unique_list", () => {
        assert.notEqual(subject.getList(), subject.getList());
    });

    it("getList_returns_similar_list", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        let list1: ICommandMapping[] = subject.getList();
        let list2: ICommandMapping[] = subject.getList();
        assert.deepEqual(list1, list2);
    });

    it("sortFunction_is_used", () => {
        subject.withSortFunction(function(a: PriorityMapping, b: PriorityMapping): number {
            if (a.priority === b.priority) {
                return 0;
            }
            return a.priority > b.priority ? 1 : -1;
        });
        let priorityMapping1: PriorityMapping = new PriorityMapping(NullCommand, 1);
        let priorityMapping2: PriorityMapping = new PriorityMapping(NullCommand2, 2);
        let priorityMapping3: PriorityMapping = new PriorityMapping(NullCommand3, 3);
        subject.addMapping(priorityMapping3);
        subject.addMapping(priorityMapping1);
        subject.addMapping(priorityMapping2);
        assert.deepEqual(subject.getList(), [priorityMapping1, priorityMapping2, priorityMapping3]);
    });

    it("sortFunction_is_called_after_mappings_are_added", () => {
        let called: boolean = false;
        subject.withSortFunction(function(a: PriorityMapping, b: PriorityMapping): number {
            called = true;
            return 0;
        });
        addPriorityMappings();
        subject.getList();
        assert.isTrue(called);
    });

    it("sortFunction_is_only_called_once_after_mappings_are_added", () => {
        let called: boolean = false;
        subject.withSortFunction(function(a: PriorityMapping, b: PriorityMapping): number {
            called = true;
            return 0;
        });
        addPriorityMappings();
        subject.getList();
        called = false;
        subject.getList();
        assert.isFalse(called);
    });

    it("sortFunction_is_not_called_after_a_mapping_is_removed", () => {
        let called: boolean = false;
        subject.withSortFunction(function(a: PriorityMapping, b: PriorityMapping): number {
            called = true;
            return 0;
        });
        addPriorityMappings();
        subject.getList();
        called = false;
        subject.removeMappingFor(NullCommand);
        subject.getList();
        assert.isFalse(called);
    });

    it("mapping_processor_is_called", () => {
        let callCount: number = 0;
        processors.push(function(mapping: CommandMapping): void {
            callCount++;
        });
        subject.addMapping(mapping1);
        assert.equal(callCount, 1);
    });

    it("mapping_processor_is_given_mappings", () => {
        let mappings: any[] = [];
        processors.push(function(mapping: CommandMapping): void {
            mappings.push(mapping);
        });
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        assert.deepEqual(mappings, [mapping1, mapping2, mapping3]);
    });

    it("removeMapping_on_a_empty_list_does_nothing", () => {
        const expected: number = subject.getList().length;
        subject.removeMapping(mapping1);
        assert.equal(subject.getList().length, expected);
    });

    it("removeMapping_does_nothing_when_mapping_was_not_found", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        const expected: number = subject.getList().length;
        subject.removeMapping(mapping3);
        assert.equal(subject.getList().length, expected);
    });

    it("removeMappingFor_on_a_empty_list_does_nothing", () => {
        const expected: number = subject.getList().length;
        subject.removeMappingFor(mapping1.commandClass);
        assert.equal(subject.getList().length, expected);
    });

    it("removeMappingFor_does_nothing_when_mapping_was_not_found", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        const expected: number = subject.getList().length;
        subject.removeMappingFor(mapping3.commandClass);
        assert.equal(subject.getList().length, expected);
    });
});
