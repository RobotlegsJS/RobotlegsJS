// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { RobotlegsInjector } from "../../../../../src/robotlegs/bender/framework/impl/RobotlegsInjector";

import { TestObject } from "./objectSupport/TestObject";

describe("RobotlegsInjector", () => {
    let parentInjector: RobotlegsInjector;
    let childInjector: RobotlegsInjector;

    beforeEach(() => {
        parentInjector = new RobotlegsInjector();
    });

    afterEach(() => {
        parentInjector = null;
        childInjector = null;
    });

    it("parent get set", () => {
        childInjector = new RobotlegsInjector();
        childInjector.parent = parentInjector;
        assert.equal(parentInjector, <RobotlegsInjector>childInjector.parent);
    });

    it("createChild remembers parent", () => {
        childInjector = <RobotlegsInjector>parentInjector.createChild();
        assert.equal(parentInjector, <RobotlegsInjector>childInjector.parent);
    });

    it("isBound check if a identifier is mapped", () => {
        parentInjector = new RobotlegsInjector();
        childInjector = new RobotlegsInjector();
        childInjector.parent = parentInjector;

        parentInjector.bind(TestObject).to(TestObject);

        assert.isTrue(parentInjector.isBound(TestObject));
        assert.isTrue(childInjector.isBound(TestObject));
    });
});
