// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry.ts";

import { assert } from "chai";

import { IContext } from "../../../../../src/robotlegs/bender/framework/api/IContext";
import { ILogger } from "../../../../../src/robotlegs/bender/framework/api/ILogger";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";
import { Logger } from "../../../../../src/robotlegs/bender/framework/impl/Logger";
import { InjectableLoggerExtension } from "../../../../../src/robotlegs/bender/extensions/enhancedLogging/InjectableLoggerExtension";

describe("InjectableLoggerExtension", () => {
    let context: IContext;

    beforeEach(() => {
        context = new Context();
        context.install(InjectableLoggerExtension);
    });

    afterEach(() => {
        context = null;
    });

    it("logger is mapped into injector through ILogger symbol", () => {
        let actual: Object = null;
        context.whenInitializing(function(): void {
            actual = context.injector.get<ILogger>(ILogger);
        });
        context.initialize();
        assert.instanceOf(actual, Logger);
    });

    it("logger is mapped into injector through ILogger string", () => {
        let actual: Object = null;
        context.whenInitializing(function(): void {
            actual = context.injector.get<ILogger>("ILogger");
        });
        context.initialize();
        assert.instanceOf(actual, Logger);
    });
});
