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

import { IConfig } from "../../../../../src/robotlegs/bender/framework/api/IConfig";
import { RobotlegsInjector } from "../../../../../src/robotlegs/bender/framework/impl/RobotlegsInjector";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";
import { ConfigManager } from "../../../../../src/robotlegs/bender/framework/impl/ConfigManager";

import { instanceOfType } from "../../../../../src/robotlegs/bender/extensions/matching/instanceOfType";

import { TypedConfig } from "./configSupport/TypedConfig";
import { TestObject } from "./objectSupport/TestObject";

describe("ConfigManager", () => {

    let context: Context;
    let injector: RobotlegsInjector;
    let configManager: ConfigManager;

    beforeEach(() => {
        context = new Context();
        injector = context.injector;
        configManager = new ConfigManager(context);
    });

    afterEach(() => {
        context = null;
        injector = null;
        configManager = null;
    });

    it("addConfig works", () => {
        configManager.addConfig({});
    });

    it("addHandler works", () => {
        configManager.addConfigHandler(instanceOfType(TestObject), new Function());
    });

    it("handler is called", () => {
        let expected: TestObject = new TestObject("config");
        let actual: Object = null;
        configManager.addConfigHandler(instanceOfType(TestObject), function(config: Object): void {
            actual = config;
        });
        configManager.addConfig(expected);
        assert.equal(actual, expected);
    });

    it("configure is invoked for IConfig object", () => {
        let actual: IConfig = null;
        injector.bind("Function").toConstantValue(function(config: IConfig): void {
            actual = config;
        }).whenTargetNamed("callback");
        let expected: TypedConfig = injector.instantiateUnmapped<TypedConfig>(TypedConfig);
        configManager.addConfig(expected);
        context.initialize();
        assert.equal(actual, expected);
    });

    it("configure is invoked for IConfig class", () => {
        let actual: IConfig = null;
        injector.bind("Function").toConstantValue(function(config: IConfig): void {
            actual = config;
        }).whenTargetNamed("callback");
        configManager.addConfig(TypedConfig);
        context.initialize();
        assert.isTrue(actual instanceof TypedConfig);
    });

    it("config queue is processed after other initialize listeners", () => {
        let actual: string[] = [];
        injector.bind("Function").toConstantValue(function(config: IConfig): void {
            actual.push("config");
        }).whenTargetNamed("callback");
        configManager.addConfig(TypedConfig);
        context.whenInitializing(function(): void {
            actual.push("listener1");
        });
        context.whenInitializing(function(): void {
            actual.push("listener2");
        });
        context.initialize();
        assert.deepEqual(actual, ["listener1", "listener2", "config"]);
    });

    it("destroy", () => {
        configManager.addConfigHandler(instanceOfType(String), function(config: Object): void {
            throw new Error("Handler should not fire after call to destroy");
        });
        configManager.destroy();
        configManager.addConfig(TypedConfig);
    });
});
