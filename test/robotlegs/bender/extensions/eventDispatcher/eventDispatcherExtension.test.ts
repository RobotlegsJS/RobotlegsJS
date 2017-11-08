// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IContext } from "../../../../../src/robotlegs/bender/framework/api/IContext";
import { LifecycleEvent } from "../../../../../src/robotlegs/bender/framework/api/LifecycleEvent";
import { Context } from "../../../../../src/robotlegs/bender/framework/impl/Context";

import { IEventDispatcher } from "../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { EventDispatcher } from "../../../../../src/robotlegs/bender/events/impl/EventDispatcher";
import { EventDispatcherExtension } from "../../../../../src/robotlegs/bender/extensions/eventDispatcher/EventDispatcherExtension";

describe("EventDispatcherExtension", () => {
    const LIFECYCLE_TYPES: string[] = [
        LifecycleEvent.PRE_INITIALIZE,
        LifecycleEvent.INITIALIZE,
        LifecycleEvent.POST_INITIALIZE,
        LifecycleEvent.PRE_SUSPEND,
        LifecycleEvent.SUSPEND,
        LifecycleEvent.POST_SUSPEND,
        LifecycleEvent.PRE_RESUME,
        LifecycleEvent.RESUME,
        LifecycleEvent.POST_RESUME,
        LifecycleEvent.PRE_DESTROY,
        LifecycleEvent.DESTROY
    ];
    let context: IContext;

    beforeEach(() => {
        context = new Context();
    });

    afterEach(() => {
        context.destroy();
        context = null;
    });

    it("an_EventDispatcher_is_mapped_into_injector", () => {
        let actual: IEventDispatcher = null;
        context.install(EventDispatcherExtension);
        context.whenInitializing(() => {
            actual = context.injector.get<IEventDispatcher>(IEventDispatcher);
        });
        context.initialize();
        assert.instanceOf(actual, EventDispatcher);
    });

    it("provided_EventDispatcher_is_mapped_into_injector", () => {
        const expected: IEventDispatcher = new EventDispatcher();
        let actual: IEventDispatcher = null;
        context.install(new EventDispatcherExtension(expected));
        context.whenInitializing(() => {
            actual = context.injector.get<IEventDispatcher>(IEventDispatcher);
        });
        context.initialize();
        assert.instanceOf(actual, EventDispatcher);
    });

    it("lifecycleEvents_are_relayed_to_dispatcher", () => {
        const dispatcher: IEventDispatcher = new EventDispatcher();
        const reportedTypes: string[] = [];
        LIFECYCLE_TYPES.forEach((type: string) => {
            dispatcher.addEventListener(type, (event: Event) => {
                reportedTypes.push(event.type);
            });
        });
        context.install(new EventDispatcherExtension(dispatcher));
        context.initialize();
        context.suspend();
        context.resume();
        context.destroy();
        assert.deepEqual(reportedTypes, LIFECYCLE_TYPES);
    });
});
