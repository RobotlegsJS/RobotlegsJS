// ------------------------------------------------------------------------------
//  Copyright (c) 2011 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/// <reference path="../../../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../../../../typings/index.d.ts" />

import "reflect-metadata";

import { assert } from "chai";

import { LogLevel } from "../../../../../src/robotlegs/bender/framework/api/LogLevel";
import { ILogger } from "../../../../../src/robotlegs/bender/framework/api/ILogger";
import { LogManager } from "../../../../../src/robotlegs/bender/framework/impl/LogManager";

import { CallbackLogTarget } from "./loggingSupport/CallbackLogTarget";
import { LogParams } from "./loggingSupport/LogParams";

describe("LogManager", () => {

    let source: Object;
    let logManager: LogManager;

    beforeEach(() => {
        source = {};
        logManager = new LogManager();
    });

    afterEach(() => {
        source = null;
        logManager = null;
    });

    it("level is passed", () => {
        logManager.logLevel = LogLevel.WARN;
        assert.equal(logManager.logLevel, LogLevel.WARN);
    });

    it("added targets are logged to", () => {
        let expected: string[] = ["target1", "target2", "target3"];
        let actual: string[] = [];
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push("target1");
        }));
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push("target2");
        }));
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push("target3");
        }));
        logManager.getLogger(source).info(expected);
        assert.deepEqual(actual, expected);
    });

    it("DEBUG log level logs only debug messages", () => {
        logManager.logLevel = LogLevel.DEBUG;
        let expected: number[] = [LogLevel.FATAL, LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
        let actual: number[] = [];
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push(result.level);
        }));
        let logger: ILogger = logManager.getLogger(source);
        logger.fatal("fatal");
        logger.error("error");
        logger.warn("warn");
        logger.info("info");
        logger.debug("debug");
        assert.deepEqual(actual, expected);
    });

    it("INFO log level logs only info messages", () => {
        logManager.logLevel = LogLevel.INFO;
        let expected: number[] = [LogLevel.FATAL, LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO];
        let actual: number[] = [];
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push(result.level);
        }));
        let logger: ILogger = logManager.getLogger(source);
        logger.fatal("fatal");
        logger.error("error");
        logger.warn("warn");
        logger.info("info");
        logger.debug("debug");
        assert.deepEqual(actual, expected);
    });

    it("WARN log level logs only warn messages", () => {
        logManager.logLevel = LogLevel.WARN;
        let expected: number[] = [LogLevel.FATAL, LogLevel.ERROR, LogLevel.WARN];
        let actual: number[] = [];
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push(result.level);
        }));
        let logger: ILogger = logManager.getLogger(source);
        logger.fatal("fatal");
        logger.error("error");
        logger.warn("warn");
        logger.info("info");
        logger.debug("debug");
        assert.deepEqual(actual, expected);
    });

    it("ERROR log level logs only error messages", () => {
        logManager.logLevel = LogLevel.ERROR;
        let expected: number[] = [LogLevel.FATAL, LogLevel.ERROR];
        let actual: number[] = [];
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push(result.level);
        }));
        let logger: ILogger = logManager.getLogger(source);
        logger.fatal("fatal");
        logger.error("error");
        logger.warn("warn");
        logger.info("info");
        logger.debug("debug");
        assert.deepEqual(actual, expected);
    });

    it("FATAL log level logs only fatal messages", () => {
        logManager.logLevel = LogLevel.FATAL;
        let expected: number[] = [LogLevel.FATAL];
        let actual: number[] = [];
        logManager.addLogTarget(new CallbackLogTarget(function(result: LogParams): void {
            actual.push(result.level);
        }));
        let logger: ILogger = logManager.getLogger(source);
        logger.fatal("fatal");
        logger.error("error");
        logger.warn("warn");
        logger.info("info");
        logger.debug("debug");
        assert.deepEqual(actual, expected);
    });
});
