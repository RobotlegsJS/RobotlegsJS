// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry.ts";

import { assert } from "chai";

import { CommandPayload } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/CommandPayload";

describe("CommandPayload", () => {

    let subject: CommandPayload;

    function createConfig(values: any[] = null, classes: any[] = null): CommandPayload {
        return subject = new CommandPayload(values, classes);
    }

    beforeEach(() => {
        ;
    });

    afterEach(() => {
        subject = null;
    });

    it("test values by default null", () => {
        createConfig();
        assert.isNull(subject.values);
    });

    it("test classes by default null", () => {
        createConfig();
        assert.isNull(subject.classes);
    });

    it("test values are stored", () => {
        let expected: any[] = ["string", 0];
        createConfig(expected);
        assert.deepEqual(subject.values, expected);
    });

    it("test classes are stored", () => {
        let expected: any[] = [String, Number];
        createConfig(null, expected);
        assert.deepEqual(subject.classes, expected);
    });

    it("test adding stores values", () => {
        createConfig();

        subject.addPayload("string", String);

        let hasValue: boolean = subject.values.indexOf("string") > -1;
        assert.isTrue(hasValue);
    });

    it("test adding stores classes", () => {
        createConfig();

        subject.addPayload("string", String);

        let hasClass: boolean = subject.classes.indexOf(String) > -1;
        assert.isTrue(hasClass);
    });

    it("test adding stores in lockstep", () => {
        createConfig(["string", 0], [String, Number]);

        let value: Object = {};

        subject.addPayload(value, Object);

        let valueIndex: Number = subject.values.indexOf(value);
        let classIndex: Number = subject.classes.indexOf(Object);

        assert.equal(valueIndex, classIndex);
    });

    it("can ask for length without classes", () => {
        createConfig();
        assert.equal(subject.length, 0);
    });
});
