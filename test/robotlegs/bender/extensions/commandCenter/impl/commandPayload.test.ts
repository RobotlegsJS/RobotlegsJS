// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { CommandPayload } from "../../../../../../src/robotlegs/bender/extensions/commandCenter/api/CommandPayload";

describe("CommandPayload", () => {
    let subject: CommandPayload;

    function createConfig(
        values?: any[],
        classes?: Function[]
    ): CommandPayload {
        return (subject = new CommandPayload(values, classes));
    }

    afterEach(() => {
        subject = null;
    });

    it("test_values_by_default_undefined", () => {
        createConfig();
        assert.isUndefined(subject.values);
    });

    it("test_classes_by_default_undefined", () => {
        createConfig();
        assert.isUndefined(subject.classes);
    });

    it("test_values_are_stored", () => {
        let expected: any[] = ["string", 0];
        createConfig(expected);
        assert.deepEqual(subject.values, expected);
    });

    it("test_classes_are_stored", () => {
        let expected: Function[] = [String, Number];
        createConfig(null, expected);
        assert.deepEqual(subject.classes, expected);
    });

    it("test_adding_stores_values", () => {
        createConfig();

        subject.addPayload("string", String);

        let hasValue: boolean = subject.values.indexOf("string") > -1;
        assert.isTrue(hasValue);
    });

    it("test_adding_stores_classes", () => {
        createConfig();

        subject.addPayload("string", String);

        let hasClass: boolean = subject.classes.indexOf(String) > -1;
        assert.isTrue(hasClass);
    });

    it("test_adding_stores_in_lockstep", () => {
        createConfig(["string", 0], [String, Number]);

        let value: Object = {};

        subject.addPayload(value, Object);

        let valueIndex: number = subject.values.indexOf(value);
        let classIndex: number = subject.classes.indexOf(Object);

        assert.equal(valueIndex, classIndex);
    });

    it("can_ask_for_length_without_values_and_classes", () => {
        createConfig();
        assert.equal(subject.length, 0);
    });

    it("can_ask_for_length_when_values_and_classes_are_defined", () => {
        createConfig(["string", 0], [String, Number]);
        assert.equal(subject.length, 2);
    });

    it("hasPayload_works_without_values_and_classes", () => {
        createConfig();
        assert.isFalse(subject.hasPayload());
    });

    it("hasPayload_works_when_values_and_classes_are_defined", () => {
        createConfig(["string", 0], [String, Number]);
        assert.isTrue(subject.hasPayload());
    });
});
