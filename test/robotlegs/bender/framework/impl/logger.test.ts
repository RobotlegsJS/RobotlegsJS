// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/// <reference path="../../../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../../../../typings/index.d.ts" />

import "reflect-metadata";

import { assert } from "chai";

import { LogLevel } from "../../../../../src/robotlegs/bender/framework/api/LogLevel";
import { Logger } from "../../../../../src/robotlegs/bender/framework/impl/Logger";

import { CallbackLogTarget } from "./loggingSupport/CallbackLogTarget";
import { LogParams } from "./loggingSupport/LogParams";

describe("Logger", () => {

    let source: Object;

    beforeEach(() => {
        source = {};
    });

    afterEach(() => {
        source = null;
    });

    it("source is passed", () => {
        let expected: Object = source;
        let actual: Object = null;
        let logger: Logger = new Logger(source, new CallbackLogTarget(function(result: LogParams): void {
            actual = result.source;
        }));
        logger.debug("hello");
        assert.equal(actual, expected);
    });

    it("level is passed", () => {
        let expected: number[] = [LogLevel.FATAL, LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
        let actual: number[] = [];
        let logger: Logger = new Logger(source, new CallbackLogTarget(function(result: LogParams): void {
            actual.push(result.level);
        }));
        logger.fatal("fatal");
        logger.error("error");
        logger.warn("warn");
        logger.info("info");
        logger.debug("debug");
        assert.deepEqual(actual, expected);
    });

    it("message is passed", () => {
        let expected: string = "hello";
        let actual: string = null;
        let logger: Logger = new Logger(source, new CallbackLogTarget(function(result: LogParams): void {
            actual = result.message;
        }));
        logger.debug(expected);
        assert.equal(actual, expected);
    });

    it("params are passed", () => {
        let expected: number[] = [1, 2, 3];
        let actual: number[] = null;
        let logger: Logger = new Logger(source, new CallbackLogTarget(function(result: LogParams): void {
            actual = result.params;
        }));
        logger.debug("hello", expected);
        assert.deepEqual(actual, expected);
    });
});
