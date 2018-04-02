// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import sinon = require("sinon");

import { IContext } from "../../../../../src/robotlegs/bender/framework/api/IContext";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";

import { ConsoleLoggingExtension } from "../../../../../src/robotlegs/bender/extensions/enhancedLogging/ConsoleLoggingExtension";

describe("ConsoleLoggingExtension", () => {
    let context: IContext;

    beforeEach(() => {
        context = new Context();
    });

    afterEach(() => {
        context.destroy();
        context = null;
    });

    it("ConsoleLogTarget_is_added_into_context", () => {
        let contextMock = sinon.mock(context);

        // Expects that addLogTarget is called once
        contextMock.expects("addLogTarget").once();

        // Install extension
        context.install(ConsoleLoggingExtension);

        // Initialize context
        context.initialize();

        // Verify if extension was installed
        contextMock.restore();
        contextMock.verify();
    });
});
