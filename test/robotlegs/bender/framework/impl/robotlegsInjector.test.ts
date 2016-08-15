// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/// <reference path="../../../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../../../../typings/index.d.ts" />

import "reflect-metadata";

import { assert } from "chai";

import { RobotlegsInjector } from "../../../../../src/robotlegs/bender/framework/impl/RobotlegsInjector";

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
        assert.equal(parentInjector, (<any>childInjector)._parentKernel);
    });

    it("createChild remembers parent", () => {
        childInjector = <RobotlegsInjector>parentInjector.createChild();
        assert.equal(parentInjector, (<any>childInjector)._parentKernel);
    });
});
