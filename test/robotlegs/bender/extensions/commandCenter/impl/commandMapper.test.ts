// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry.ts";

import { assert } from "chai";

import sinon = require("sinon");

import { ICommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/ICommandMapping";
import { CommandMapper } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapper";
import { CommandMappingList } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMappingList";
import { NullCommandTrigger } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/NullCommandTrigger";

import { HappyGuard } from "../../../framework/impl/guardSupport/HappyGuard";
import { GrumpyGuard } from "../../../framework/impl/guardSupport/GrumpyGuard";
import { CallbackHook } from "../../../framework/impl/hookSupport/CallbackHook";

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

    it("toCommand creates CommandConfigurator", () => {
        assert.instanceOf(subject.toCommand(String), CommandMapper);
    });

    it("toCommand passes CommandMapping to MappingList", () => {
        let mappingsMock = sinon.mock(mappings);
        mappingsMock.expects("addMapping").once();
        subject.toCommand(String);
        mappingsMock.restore();
        mappingsMock.verify();
    });

    it("fromCommand delegates to MappingList", () => {
        let mappingsMock = sinon.mock(mappings);
        mappingsMock.expects("removeMappingFor").once().withArgs(String);
        subject.fromCommand(String);
        mappingsMock.restore();
        mappingsMock.verify();
    });

    it("fromAll delegates to MappingList", () => {
        let mappingsMock = sinon.mock(mappings);
        mappingsMock.expects("removeAllMappings").once();
        subject.fromAll();
        mappingsMock.restore();
        mappingsMock.verify();
    });

    it("once delegates to Mapping", () => {
        subject.toCommand(String);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock.expects("setFireOnce").once().withArgs(true);
        subject.once(true);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withGuards delegates to Mapping", () => {
        subject.toCommand(String);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock.expects("addGuards").once().withArgs(HappyGuard, GrumpyGuard);
        subject.withGuards(HappyGuard, GrumpyGuard);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withHooks delegates to Mapping", () => {
        subject.toCommand(String);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock.expects("addHooks").once().withArgs(CallbackHook);
        subject.withHooks(CallbackHook);
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withExecuteMethod delegates to Mapping", () => {
        subject.toCommand(String);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock.expects("setExecuteMethod").once().withArgs("execute");
        subject.withExecuteMethod("execute");
        mappingMock.restore();
        mappingMock.verify();
    });

    it("withPayloadInjection delegates to Mapping", () => {
        subject.toCommand(String);
        let list: ICommandMapping[] = mappings.getList();
        let mappingMock = sinon.mock(list[0]);
        mappingMock.expects("setPayloadInjectionEnabled").once().withArgs(true);
        subject.withPayloadInjection(true);
        mappingMock.restore();
        mappingMock.verify();
    });
});
