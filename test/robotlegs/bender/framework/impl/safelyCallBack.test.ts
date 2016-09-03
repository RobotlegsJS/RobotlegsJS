// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

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
        let callback: Function = function(param: Object): void {
            callCount++;
        };
        safelyCallBack(callback, {}, {});
        assert.equal(callCount, 1);
    });

    it("callback with two params is called", () => {
        let callCount: number = 0;
        let callback: Function = function(param1: Object, param2: Object): void {
            callCount++;
        };
        safelyCallBack(callback, {}, {});
        assert.equal(callCount, 1);
    });

    it("callback receives error", () => {
        let expected: Object = new Error("Something went hideously wrong.");
        let actual: Object = null;
        let callback: Function = function(error: Object): void {
            actual = error;
        };
        safelyCallBack(callback, expected, {});
        assert.equal(actual, expected);
    });

    it("callback receives message", () => {
        let expected: Object = "message";
        let actual: Object = null;
        let callback: Function = function(error: Object, message: Object): void {
            actual = message;
        };
        safelyCallBack(callback, {}, expected);
        assert.equal(actual, expected);
    });

    it("callback receives error and message", () => {
        let expectedError: Object = new Error("Something went hideously wrong.");
        let actualError: Object = null;
        let expectedMessage: Object = "message";
        let actualMessage: Object = null;
        let callback: Function = function(error: Object, message: Object): void {
            actualError = error;
            actualMessage = message;
        };
        safelyCallBack(callback, expectedError, expectedMessage);
        assert.equal(actualError, expectedError);
        assert.equal(actualMessage, expectedMessage);
    });

    it("invalid callback probably explodes", () => {
        function hookInstanceWithoutHook(): void {
            let callback: Function = function(error: Object, message: Object, invalidParameter: Object): void {
                ;
            };
            safelyCallBack(callback, {}, {});
        }
        assert.throws(hookInstanceWithoutHook, TypeError, "Callback function accepts more than two parameters.");
    });
});
