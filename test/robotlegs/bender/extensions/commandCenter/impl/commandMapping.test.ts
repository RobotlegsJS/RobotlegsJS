// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

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

    it("mapping_stores_Command", () => {
        assert.equal(mapping.commandClass, commandClass);
    });

    it("default_ExecuteMethod", () => {
        assert.equal(mapping.executeMethod, "execute");
    });

    it("mapping_stores_ExecuteMethod", () => {
        mapping.setExecuteMethod("run");
        assert.equal(mapping.executeMethod, "run");
    });

    it("mapping_stores_Guards", () => {
        mapping.addGuards(1, 2, 3);
        assert.deepEqual(mapping.guards, [1, 2, 3]);
    });

    it("mapping_stores_GuardsArray", () => {
        mapping.addGuards([1, 2, 3]);
        assert.deepEqual(mapping.guards, [1, 2, 3]);
    });

    it("mapping_stores_Hooks", () => {
        mapping.addHooks(1, 2, 3);
        assert.deepEqual(mapping.hooks, [1, 2, 3]);
    });

    it("mapping_stores_HooksArray", () => {
        mapping.addHooks([1, 2, 3]);
        assert.deepEqual(mapping.hooks, [1, 2, 3]);
    });

    it("fireOnce_defaults_to_False", () => {
        assert.isFalse(mapping.fireOnce);
    });

    it("mapping_stores_FireOnce", () => {
        mapping.setFireOnce(true);
        assert.isTrue(mapping.fireOnce);
    });

    it("mapping_stores_FireOnce_when_false", () => {
        mapping.setFireOnce(false);
        assert.isFalse(mapping.fireOnce);
    });

    it("payloadInjectionEnabled_defaults_to_True", () => {
        assert.isTrue(mapping.payloadInjectionEnabled);
    });

    it("mapping_stores_PayloadInjectionEnabled", () => {
        mapping.setPayloadInjectionEnabled(false);
        assert.isFalse(mapping.payloadInjectionEnabled);
    });

    it("mapping_toString_describe_mapping", () => {
        assert.equal(mapping.toString(), "Command NullCommand");
    });
});
