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

import { IEventDispatcher } from "../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { EventDispatcher } from "../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

import { IEventCommandMap } from "../../../../../src/robotlegs/bender/extensions/eventCommandMap/api/IEventCommandMap";
import { EventCommandMap } from "../../../../../src/robotlegs/bender/extensions/eventCommandMap/impl/EventCommandMap";
import { EventCommandMapExtension } from "../../../../../src/robotlegs/bender/extensions/eventCommandMap/EventCommandMapExtension";

describe("EventCommandMapExtension", () => {
    let context: IContext;

    beforeEach(() => {
        context = new Context();
        context.injector.bind(IEventDispatcher).toConstantValue(new EventDispatcher());
    });

    afterEach(() => {
        context.destroy();
        context = null;
    });

    it("eventCommandMap_is_mapped_into_injector", () => {
        let actual: IEventCommandMap = null;
        context.install(EventCommandMapExtension);
        context.whenInitializing(function(): void {
            actual = context.injector.get<IEventCommandMap>(IEventCommandMap);
        });
        context.initialize();
        assert.instanceOf(actual, EventCommandMap);
    });
});
