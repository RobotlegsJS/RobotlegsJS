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

import { IExtension } from "../../../../../src/robotlegs/bender/framework/api/IExtension";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";
import { ExtensionInstaller } from "../../../../../src/robotlegs/bender/framework/impl/ExtensionInstaller";

import { CallbackExtension } from "./contextSupport/CallbackExtension";

describe("ExtensionInstaller", () => {

    let installer: ExtensionInstaller;

    beforeEach(() => {
        installer = new ExtensionInstaller(new Context());
    });

    afterEach(() => {
        installer = null;
    });

    it("extension instance is installed", () => {
        let callCount: number = 0;
        installer.install(new CallbackExtension(function(): void {
            callCount++;
        }));
        assert.equal(callCount, 1);
    });

    it("extension class is installed", () => {
        let callCount: number = 0;
        CallbackExtension.staticCallback = function(): void {
            callCount++;
        };
        installer.install(CallbackExtension);
        assert.equal(callCount, 1);
    });

    it("extension is installed once for same instance", () => {
        let callCount: number = 0;
        let callback: Function = function(): void {
            callCount++;
        };
        let extension: IExtension = new CallbackExtension(callback);
        installer.install(extension);
        installer.install(extension);
        assert.equal(callCount, 1);
    });

    it("extension is installed once for same class", () => {
        let callCount: number = 0;
        CallbackExtension.staticCallback = function(): void {
            callCount++;
        };
        installer.install(CallbackExtension);
        installer.install(CallbackExtension);
        assert.equal(callCount, 1);
    });
});
