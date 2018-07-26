// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import sinon = require("sinon");

import { assert } from "chai";

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { LogLevel } from "../../../../../../src/robotlegs/bender/framework/api/LogLevel";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { ConsoleLogTarget } from "../../../../../../src/robotlegs/bender/extensions/enhancedLogging/impl/ConsoleLogTarget";

describe("ConsoleLogTarget", () => {
    let context: IContext;
    let consoleLogTarget: ConsoleLogTarget;

    beforeEach(() => {
        context = new Context();
        consoleLogTarget = new ConsoleLogTarget(context);
    });

    afterEach(() => {
        consoleLogTarget = null;
        context = null;
    });

    function logMessages(): void {
        // Log all messages
        consoleLogTarget.log({}, LogLevel.DEBUG, Date.now(), "{0}", ["Hello!"]);
        consoleLogTarget.log({}, LogLevel.INFO, Date.now(), "{0}", ["Hello!"]);
        consoleLogTarget.log({}, LogLevel.WARN, Date.now(), "{0}", ["Hello!"]);
        consoleLogTarget.log({}, LogLevel.ERROR, Date.now(), "{0}", ["Hello!"]);
        consoleLogTarget.log({}, LogLevel.FATAL, Date.now(), "{0}", ["Hello!"]);
    }

    it("ConsoleLogTarget_is_created", () => {
        assert.instanceOf(consoleLogTarget, ConsoleLogTarget);
    });

    it("ConsoleLogTarget_logs_when_log_level_is_debug", () => {
        let consoleMock = sinon.mock(console);

        // Expects that console messages are called
        consoleMock.expects("log").once();
        consoleMock.expects("info").once();
        consoleMock.expects("warn").once();
        consoleMock.expects("error").twice();

        // Set debug level
        context.logLevel = LogLevel.DEBUG;

        // Log all messages
        logMessages();

        // Verify if expected messages are logged
        consoleMock.restore();
        consoleMock.verify();
    });

    it("ConsoleLogTarget_logs_when_log_level_is_info", () => {
        let consoleMock = sinon.mock(console);

        // Expects that console messages are called
        consoleMock.expects("log").never();
        consoleMock.expects("info").once();
        consoleMock.expects("warn").once();
        consoleMock.expects("error").twice();

        // Set debug level
        context.logLevel = LogLevel.INFO;

        // Log all messages
        logMessages();

        // Verify if expected messages are logged
        consoleMock.restore();
        consoleMock.verify();
    });

    it("ConsoleLogTarget_logs_when_log_leve_is_warn", () => {
        let consoleMock = sinon.mock(console);

        // Expects that console messages are called
        consoleMock.expects("log").never();
        consoleMock.expects("info").never();
        consoleMock.expects("warn").once();
        consoleMock.expects("error").twice();

        // Set debug level
        context.logLevel = LogLevel.WARN;

        // Log all messages
        logMessages();

        // Verify if expected messages are logged
        consoleMock.restore();
        consoleMock.verify();
    });

    it("ConsoleLogTarget_logs_when_log_leve_is_error", () => {
        let consoleMock = sinon.mock(console);

        // Expects that console messages are called
        consoleMock.expects("log").never();
        consoleMock.expects("info").never();
        consoleMock.expects("warn").never();
        consoleMock.expects("error").twice();

        // Set debug level
        context.logLevel = LogLevel.ERROR;

        // Log all messages
        logMessages();

        // Verify if expected messages are logged
        consoleMock.restore();
        consoleMock.verify();
    });

    it("ConsoleLogTarget_logs_when_log_leve_is_fatal", () => {
        let consoleMock = sinon.mock(console);

        // Expects that console messages are called
        consoleMock.expects("log").never();
        consoleMock.expects("info").never();
        consoleMock.expects("warn").never();
        consoleMock.expects("error").once();

        // Set debug level
        context.logLevel = LogLevel.FATAL;

        // Log all messages
        logMessages();

        // Verify if expected messages are logged
        consoleMock.restore();
        consoleMock.verify();
    });
});
