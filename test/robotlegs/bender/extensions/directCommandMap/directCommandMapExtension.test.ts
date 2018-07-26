// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IContext } from "../../../../../src/robotlegs/bender/framework/api/IContext";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";

import { IDirectCommandMap } from "../../../../../src/robotlegs/bender/extensions/directCommandMap/api/IDirectCommandMap";
import { DirectCommandMap } from "../../../../../src/robotlegs/bender/extensions/directCommandMap/impl/DirectCommandMap";
import { DirectCommandMapExtension } from "../../../../../src/robotlegs/bender/extensions/directCommandMap/DirectCommandMapExtension";

describe("DirectCommandMapExtension", () => {
    let context: IContext;

    beforeEach(() => {
        context = new Context();
        context.install(DirectCommandMapExtension);
    });

    afterEach(() => {
        context = null;
    });

    it("directCommandMap_is_mapped_into_injector", () => {
        let actual: IDirectCommandMap = null;
        context.whenInitializing(function(): void {
            actual = context.injector.get<IDirectCommandMap>(IDirectCommandMap);
        });
        context.initialize();
        assert.isNotNull(actual);
        assert.instanceOf(actual, DirectCommandMap);
    });
});
