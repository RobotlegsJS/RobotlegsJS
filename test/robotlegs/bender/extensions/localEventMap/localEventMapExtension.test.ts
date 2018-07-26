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

import { IEventMap } from "../../../../../src/robotlegs/bender/extensions/localEventMap/api/IEventMap";
import { EventMap } from "../../../../../src/robotlegs/bender/extensions/localEventMap/impl/EventMap";

import { EventDispatcherExtension } from "../../../../../src/robotlegs/bender/extensions/eventDispatcher/EventDispatcherExtension";
import { LocalEventMapExtension } from "../../../../../src/robotlegs/bender/extensions/localEventMap/LocalEventMapExtension";

describe("LocalEventMapExtension", () => {
    let context: IContext;

    beforeEach(() => {
        context = new Context();
    });

    afterEach(() => {
        context.destroy();
        context = null;
    });

    it("localEventMap_is_mapped_into_injector", () => {
        let actual: IEventMap = null;
        context.install(EventDispatcherExtension, LocalEventMapExtension);
        context.whenInitializing(() => {
            actual = context.injector.get<IEventMap>(IEventMap);
        });
        context.initialize();
        assert.instanceOf(actual, EventMap);
    });
});
