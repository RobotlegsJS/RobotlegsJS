// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import sinon = require("sinon");

import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";
import { CommandMapper } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapper";
import { CommandMappingList } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMappingList";
import { NullCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/NullCommandTrigger";

import { HappyGuard } from "../../../framework/impl/guardSupport/HappyGuard";
import { GrumpyGuard } from "../../../framework/impl/guardSupport/GrumpyGuard";
import { CallbackHook } from "../../../framework/impl/hookSupport/CallbackHook";

import { NullCommand } from "../support/NullCommand";

describe("CommandMapper", () => {
    let mappings: CommandMappingList;
    let subject: CommandMapper;

    beforeEach(() => {
        mappings = new CommandMappingList(new NullCommandTrigger(), []);
        subject = new CommandMapper(mappings);
    });

    afterEach(() => {
        mappings = null;
        subject = null;
    });

    it("toCommand_creates_CommandConfigurator", () => {
        assert.instanceOf(subject.toCommand(NullCommand), CommandMapper);
    });

    it("toCommand_passes_CommandMapping_to_MappingList", () => {
        let mappingsMock = sinon.mock(mappings);
        mappingsMock.expects("addMapping").once();
        subject.toCommand(NullCommand);
        mappingsMock.restore();
        mappingsMock.verify();
    });

    it("fromCommand_delegates_to_MappingList", () => {
        let mappingsMock = sinon.mock(mappings);
        mappingsMock
            .expects("removeMappingFor")
            .once()
            .withArgs(NullCommand);
        subject.fromCommand(NullCommand);
        mappingsMock.restore();
        mappingsMock.verify();
    });

    it("fromAll_delegates_to_MappingList", () => {
        let mappingsMock = sinon.mock(mappings);
        mappingsMock.expects("removeAllMappings").once();
        subject.fromAll();
        mappingsMock.restore();
        mappingsMock.verify();
    });

    it("once_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("setFireOnce")
            .once()
            .withArgs(true);
        subject.once();
        mappingMock.restore();
        mappingMock.verify();
    });

    it("once_when_true_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("setFireOnce")
            .once()
            .withArgs(true);
        subject.once(true);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("once_when_false_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("setFireOnce")
            .once()
            .withArgs(false);
        subject.once(false);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withGuards_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("addGuards")
            .once()
            .withArgs(HappyGuard, GrumpyGuard);
        subject.withGuards(HappyGuard, GrumpyGuard);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withHooks_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("addHooks")
            .once()
            .withArgs(CallbackHook);
        subject.withHooks(CallbackHook);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withPayloadInjection_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("setPayloadInjectionEnabled")
            .once()
            .withArgs(true);
        subject.withPayloadInjection();
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withPayloadInjection_when_true_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("setPayloadInjectionEnabled")
            .once()
            .withArgs(true);
        subject.withPayloadInjection(true);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withPayloadInjection_when_false_delegates_to_Mapping", () => {
        subject.toCommand(NullCommand);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock
            .expects("setPayloadInjectionEnabled")
            .once()
            .withArgs(false);
        subject.withPayloadInjection(false);
        mappingMock.restore();
        mappingMock.verify();
    });
});
