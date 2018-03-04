// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { ObjectProcessor } from "../../../../../src/robotlegs/bender/framework/impl/ObjectProcessor";
import { instanceOfType } from "../../../../../src/robotlegs/bender/extensions/matching/instanceOfType";

import { TestObject } from "./objectSupport/TestObject";

describe("ObjectProcessor", () => {
    let objectProcessor: ObjectProcessor;

    beforeEach(() => {
        objectProcessor = new ObjectProcessor();
    });

    afterEach(() => {
        objectProcessor = null;
    });

    it("handler handles object", () => {
        let expected: TestObject = new TestObject("TestObject");
        let actual: TestObject = null;
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual = object;
        });
        objectProcessor.processObject(expected);
        assert.equal(actual, expected);
    });

    it("handler does not handle wrong object", () => {
        let actual: TestObject = null;
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual = object;
        });
        objectProcessor.processObject({});
        assert.isNull(actual);
    });

    it("handlers handle object", () => {
        let expected: string[] = ["handler1", "handler2", "handler3"];
        let actual: string[] = [];
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual.push("handler1");
        });
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual.push("handler2");
        });
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual.push("handler3");
        });
        objectProcessor.processObject(new TestObject("TestObject"));
        assert.deepEqual(actual, expected);
    });

    it("remove all handlers", () => {
        let expected: string[] = [];
        let actual: string[] = [];
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual.push("Handler should not fire after call to removeAllHandlers.");
        });
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual.push("Handler should not fire after call to removeAllHandlers.");
        });
        objectProcessor.addObjectHandler(instanceOfType(TestObject), function(object: TestObject): void {
            actual.push("Handler should not fire after call to removeAllHandlers.");
        });
        objectProcessor.removeAllHandlers();
        objectProcessor.processObject(new TestObject("TestObject"));
        assert.deepEqual(actual, expected);
    });
});
