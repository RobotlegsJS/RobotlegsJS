// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { safelyCallBack } from "../../../../../src/robotlegs/bender/framework/impl/safelyCallBack";

describe("safelyCallBack", () => {
    it("callback with no params is called", () => {
        let callCount: number = 0;
        let callback: Function = function(): void {
            callCount++;
        };
        safelyCallBack(callback, {}, {});
        assert.equal(callCount, 1);
    });

    it("callback with one param is called", () => {
        let callCount: number = 0;
        let callback: Function = function(param: any): void {
            callCount++;
        };
        safelyCallBack(callback, {}, {});
        assert.equal(callCount, 1);
    });

    it("callback with two params is called", () => {
        let callCount: number = 0;
        let callback: Function = function(param1: any, param2: any): void {
            callCount++;
        };
        safelyCallBack(callback, {}, {});
        assert.equal(callCount, 1);
    });

    it("callback receives error", () => {
        let expected: any = new Error("Something went hideously wrong.");
        let actual: any = null;
        let callback: Function = function(error: any): void {
            actual = error;
        };
        safelyCallBack(callback, expected, {});
        assert.equal(actual, expected);
    });

    it("callback receives message", () => {
        let expected: any = "message";
        let actual: any = null;
        let callback: Function = function(error: any, message: any): void {
            actual = message;
        };
        safelyCallBack(callback, {}, expected);
        assert.equal(actual, expected);
    });

    it("callback receives error and message", () => {
        let expectedError: any = new Error("Something went hideously wrong.");
        let actualError: any = null;
        let expectedMessage: any = "message";
        let actualMessage: any = null;
        let callback: Function = function(error: any, message: any): void {
            actualError = error;
            actualMessage = message;
        };
        safelyCallBack(callback, expectedError, expectedMessage);
        assert.equal(actualError, expectedError);
        assert.equal(actualMessage, expectedMessage);
    });

    it("invalid callback probably explodes", () => {
        function hookInstanceWithoutHook(): void {
            let callback: Function = function(
                error: any,
                message: any,
                invalidParameter: any
            ): void {};
            safelyCallBack(callback, {}, {});
        }
        assert.throws(
            hookInstanceWithoutHook,
            TypeError,
            "Callback function accepts more than two parameters."
        );
    });
});
