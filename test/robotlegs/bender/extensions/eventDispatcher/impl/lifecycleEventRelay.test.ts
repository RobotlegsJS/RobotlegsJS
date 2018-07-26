// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { IContext } from "../../../../../../src/robotlegs/bender/framework/api/IContext";
import { LifecycleEvent } from "../../../../../../src/robotlegs/bender/framework/api/LifecycleEvent";
import { Context } from "../../../../../../src/robotlegs/bender/framework/impl/Context";

import { IEventDispatcher } from "../../../../../../src/robotlegs/bender/events/api/IEventDispatcher";
import { Event } from "../../../../../../src/robotlegs/bender/events/impl/Event";
import { EventDispatcher } from "../../../../../../src/robotlegs/bender/events/impl/EventDispatcher";
import { LifecycleEventRelay } from "../../../../../../src/robotlegs/bender/extensions/eventDispatcher/impl/LifecycleEventRelay";

describe("LifecycleEventRelay", () => {
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
        LifecycleEvent.DESTROY,
        LifecycleEvent.POST_DESTROY
    ];
    let context: IContext;
    let dispatcher: IEventDispatcher;
    let subject: LifecycleEventRelay;
    let reportedTypes: string[];

    beforeEach(() => {
        context = new Context();
        dispatcher = new EventDispatcher();
        subject = new LifecycleEventRelay(context, dispatcher);
        reportedTypes = [];
    });

    afterEach(() => {
        context.destroy();
        context = null;
        dispatcher = null;
        subject = null;
        reportedTypes = null;
    });

    function listenFor(types: string[]): void {
        types.forEach((type: string) => {
            dispatcher.addEventListener(type, catchEvent);
        });
    }

    function catchEvent(event: Event): void {
        reportedTypes.push(event.type);
    }

    it("state_change_is_relayed", () => {
        listenFor([LifecycleEvent.STATE_CHANGE]);
        context.initialize();
        assert.isTrue(reportedTypes.indexOf(LifecycleEvent.STATE_CHANGE) >= 0);
    });

    it("lifecycle_events_are_relayed", () => {
        listenFor(LIFECYCLE_TYPES);
        context.initialize();
        context.suspend();
        context.resume();
        context.destroy();
        assert.deepEqual(reportedTypes, LIFECYCLE_TYPES);
    });

    it("lifecycle_events_are_NOT_relayed_after_destroy", () => {
        listenFor(LIFECYCLE_TYPES);
        subject.destroy();
        context.initialize();
        context.suspend();
        context.resume();
        context.destroy();
        assert.isEmpty(reportedTypes);
    });
});
