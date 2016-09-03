// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { assert } from "chai";

import { CommandMapping } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/impl/CommandMapping";

import { NullCommand } from "../support/NullCommand";

describe("CommandMapping", () => {

    let mapping: CommandMapping;
    let commandClass: any;

    beforeEach(() => {
        commandClass = NullCommand;
        mapping = new CommandMapping(commandClass);
    });

    afterEach(() => {
        mapping = null;
        commandClass = null;
    });

    it("mapping stores Command", () => {
        assert.equal(mapping.commandClass, commandClass);
    });

    it("default ExecuteMethod", () => {
        assert.equal(mapping.executeMethod, "execute");
    });

    it("mapping stores ExecuteMethod", () => {
        mapping.setExecuteMethod("run");
        assert.equal(mapping.executeMethod, "run");
    });

    it("mapping stores Guards", () => {
        mapping.addGuards(1, 2, 3);
        assert.deepEqual(mapping.guards, [1, 2, 3]);
    });

    it("mapping stores GuardsArray", () => {
        mapping.addGuards([1, 2, 3]);
        assert.deepEqual(mapping.guards, [1, 2, 3]);
    });

    it("mapping stores Hooks", () => {
        mapping.addHooks(1, 2, 3);
        assert.deepEqual(mapping.hooks, [1, 2, 3]);
    });

    it("mapping stores HooksArray", () => {
        mapping.addHooks([1, 2, 3]);
        assert.deepEqual(mapping.hooks, [1, 2, 3]);
    });

    it("fireOnce defaults to False", () => {
        assert.isFalse(mapping.fireOnce);
    });

    it("mapping stores FireOnce", () => {
        mapping.setFireOnce(true);
        assert.isTrue(mapping.fireOnce);
    });

    it("mapping stores FireOnce when false", () => {
        mapping.setFireOnce(false);
        assert.isFalse(mapping.fireOnce);
    });

    it("payloadInjectionEnabled defaults to True", () => {
        assert.isTrue(mapping.payloadInjectionEnabled);
    });

    it("mapping stores PayloadInjectionEnabled", () => {
        mapping.setPayloadInjectionEnabled(false);
        assert.isFalse(mapping.payloadInjectionEnabled);
    });
});
