// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import sinon = require("sinon");

import { ICommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandTrigger";
import { CommandTriggerMap } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandTriggerMap";
import { NullCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/NullCommandTrigger";

describe("CommandTriggerMap", () => {
    let subject: CommandTriggerMap;

    function getKey(type: string, eventClass: Function): string {
        return type + eventClass;
    }

    function createTrigger(
        type: string,
        eventClass: Function
    ): ICommandTrigger {
        return new NullCommandTrigger();
    }

    beforeEach(() => {
        subject = new CommandTriggerMap(getKey, createTrigger);
    });

    afterEach(() => {
        subject = null;
    });

    it("keyFactory_is_called_with_params", () => {
        let subjectMock = sinon.mock(subject);
        subjectMock
            .expects("_keyFactory")
            .once()
            .withArgs("hi", 5);
        subject.getTrigger("hi", 5);
        subjectMock.restore();
        subjectMock.verify();
    });

    it("triggerFactory_is_called_with_params", () => {
        let subjectMock = sinon.mock(subject);
        subjectMock
            .expects("_triggerFactory")
            .once()
            .withArgs("hi", 5);
        subject.getTrigger("hi", 5);
        subjectMock.restore();
        subjectMock.verify();
    });

    it("trigger_is_cached_by_key", () => {
        let mapper1: ICommandTrigger = subject.getTrigger("hi", 5);
        let mapper2: ICommandTrigger = subject.getTrigger("hi", 5);
        assert.isNotNull(mapper1);
        assert.equal(mapper1, mapper2);
    });

    it("removeTrigger_deactivates_trigger", () => {
        let trigger: ICommandTrigger = subject.getTrigger("hi", 5);
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").once();
        subject.removeTrigger("hi", 5);
        triggerMock.restore();
        triggerMock.verify();
    });

    it("removeTrigger_deactivates_trigger_once_when_called_twice", () => {
        let trigger: ICommandTrigger = subject.getTrigger("hi", 5);
        let triggerMock = sinon.mock(trigger);
        triggerMock.expects("deactivate").once();
        subject.removeTrigger("hi", 5);
        subject.removeTrigger("hi", 5);
        triggerMock.restore();
        triggerMock.verify();
    });
});
