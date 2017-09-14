// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
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
                if (result.level === LogLevel.WARN) {
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
        warnLogParams = null;
        trigger = null;
        subject = null;
        mapping1 = null;
        mapping2 = null;
        mapping3 = null;
        processors = null;
    });

    it("trigger is activated when first mapping is added", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(mapping1);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is not activated when second mapping is added", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is not activated when mapping overwritten", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(new CommandMapping(NullCommand));
        subject.addMapping(new CommandMapping(NullCommand));
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is not activated for second identical mapping", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("activate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping1);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is deactivated when last mapping is removed", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.removeMappingFor(mapping1.commandClass);
        subject.removeMappingFor(mapping2.commandClass);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is deactivated when all mappings are removed", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").once();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        subject.removeAllMappings();
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is not deactivated when list is already empty", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").never();
        subject.removeAllMappings();
        triggerMock.restore();
        triggerMock.verify();
    });

    it("trigger is not deactivated when second last mapping is removed", () => {
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").never();
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.removeMappingFor(mapping1.commandClass);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("warning logged when mapping overwritten", () => {
        subject.addMapping(new CommandMapping(NullCommand));
        subject.addMapping(new CommandMapping(NullCommand));
        assert.equal(
            warnLogParams.message.indexOf("{0} already mapped to {1}"),
            0
        );
    });

    it("list is empty", () => {
        assert.equal(subject.getList().length, 0);
    });

    it("list not empty after mapping added", () => {
        subject.addMapping(mapping1);
        assert.equal(subject.getList().length, 1);
    });

    it("list has mapping", () => {
        subject.addMapping(mapping1);
        assert.equal(subject.getList().indexOf(mapping1), 0);
    });

    it("list is empty after mappings are removed", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.removeMapping(mapping1);
        subject.removeMapping(mapping2);
        assert.equal(subject.getList().length, 0);
    });

    it("list is empty after removeAll", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        subject.removeAllMappings();
        assert.equal(subject.getList().length, 0);
    });

    it("getList returns unique list", () => {
        assert.notEqual(subject.getList(), subject.getList());
    });

    it("getList returns similar list", () => {
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        let list1: ICommandMapping[] = subject.getList();
        let list2: ICommandMapping[] = subject.getList();
        assert.deepEqual(list1, list2);
    });

    it("sortFunction is used", () => {
        subject.withSortFunction(function(
            a: PriorityMapping,
            b: PriorityMapping
        ): number {
            if (a.priority === b.priority) {
                return 0;
            }
            return a.priority > b.priority ? 1 : -1;
        });
        let priorityMapping1: PriorityMapping = new PriorityMapping(
            NullCommand,
            1
        );
        let priorityMapping2: PriorityMapping = new PriorityMapping(
            NullCommand2,
            2
        );
        let priorityMapping3: PriorityMapping = new PriorityMapping(
            NullCommand3,
            3
        );
        subject.addMapping(priorityMapping3);
        subject.addMapping(priorityMapping1);
        subject.addMapping(priorityMapping2);
        assert.deepEqual(subject.getList(), [
            priorityMapping1,
            priorityMapping2,
            priorityMapping3
        ]);
    });

    it("sortFunction is called after mappings are added", () => {
        let called: boolean = false;
        subject.withSortFunction(function(
            a: PriorityMapping,
            b: PriorityMapping
        ): number {
            called = true;
            return 0;
        });
        addPriorityMappings();
        subject.getList();
        assert.isTrue(called);
    });

    it("sortFunction is only called once after mappings are added", () => {
        let called: boolean = false;
        subject.withSortFunction(function(
            a: PriorityMapping,
            b: PriorityMapping
        ): number {
            called = true;
            return 0;
        });
        addPriorityMappings();
        subject.getList();
        called = false;
        subject.getList();
        assert.isFalse(called);
    });

    it("sortFunction is not called after a mapping is removed", () => {
        let called: boolean = false;
        subject.withSortFunction(function(
            a: PriorityMapping,
            b: PriorityMapping
        ): number {
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

    it("mapping processor is called", () => {
        let callCount: number = 0;
        processors.push(function(mapping: CommandMapping): void {
            callCount++;
        });
        subject.addMapping(mapping1);
        assert.equal(callCount, 1);
    });

    it("mapping processor is given mappings", () => {
        let mappings: any[] = [];
        processors.push(function(mapping: CommandMapping): void {
            mappings.push(mapping);
        });
        subject.addMapping(mapping1);
        subject.addMapping(mapping2);
        subject.addMapping(mapping3);
        assert.deepEqual(mappings, [mapping1, mapping2, mapping3]);
    });
});
