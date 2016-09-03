// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { assert } from "chai";
import sinon = require("sinon");

import { PinEvent } from "../../../../../src/robotlegs/bender/framework/api/PinEvent";
import { Pin } from "../../../../../src/robotlegs/bender/framework/impl/Pin";
import { EventDispatcher } from "../../../../../src/robotlegs/bender/events/impl/EventDispatcher";

describe("Pin", () => {

    let instance: Object;
    let dispatcher: EventDispatcher;
    let pin: Pin;

    beforeEach(() => {
        instance = {};
        dispatcher = new EventDispatcher();
        pin = new Pin(dispatcher);
    });

    afterEach(() => {
        instance = null;
        dispatcher = null;
        pin = null;
    });

    it("detain dispatches event", () => {
        let dispatcherSpy: Sinon.SinonSpy = sinon.spy(dispatcher, "dispatchEvent");
        pin.detain(instance);
        let pinEvent: PinEvent = <PinEvent>(dispatcherSpy.firstCall.args[0]);
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(pinEvent.type, PinEvent.DETAIN);
        assert.equal(pinEvent.instance, instance);
    });

    it("detain dispatches event once per valid detainment", () => {
        let dispatcherSpy: Sinon.SinonSpy = sinon.spy(dispatcher, "dispatchEvent");
        pin.detain(instance);
        pin.detain(instance);
        let pinEvent: PinEvent = <PinEvent>(dispatcherSpy.firstCall.args[0]);
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(pinEvent.type, PinEvent.DETAIN);
        assert.equal(pinEvent.instance, instance);
    });

    it("release dispatches event", () => {
        let dispatcherSpy: Sinon.SinonSpy = sinon.spy(dispatcher, "dispatchEvent");
        pin.detain(instance);
        pin.release(instance);
        let pinEvent: PinEvent = <PinEvent>(dispatcherSpy.secondCall.args[0]);
        assert.isTrue(dispatcherSpy.calledTwice);
        assert.equal(pinEvent.type, PinEvent.RELEASE);
        assert.equal(pinEvent.instance, instance);
    });

    it("release dispatches event once per valid release", () => {
        let dispatcherSpy: Sinon.SinonSpy = sinon.spy(dispatcher, "dispatchEvent");
        pin.detain(instance);
        pin.release(instance);
        pin.release(instance);
        let pinEvent: PinEvent = <PinEvent>(dispatcherSpy.secondCall.args[0]);
        assert.isTrue(dispatcherSpy.calledTwice);
        assert.equal(pinEvent.type, PinEvent.RELEASE);
        assert.equal(pinEvent.instance, instance);
    });

    it("release does not dispatch event if instance was not detained", () => {
        let dispatcherSpy: Sinon.SinonSpy = sinon.spy(dispatcher, "dispatchEvent");
        pin.release(instance);
        assert.isTrue(dispatcherSpy.notCalled);
    });

    it("releaseAll dispatches events for all instances", () => {
        let dispatcherSpy: Sinon.SinonSpy = sinon.spy(dispatcher, "dispatchEvent");
        let instanceA: Object = {};
        let instanceB: Object = {};
        let instanceC: Object = {};
        pin.detain(instanceA);
        pin.detain(instanceB);
        pin.detain(instanceC);
        pin.releaseAll();
        let pinDetainEventA: PinEvent = <PinEvent>(dispatcherSpy.args[0][0]);
        let pinDetainEventB: PinEvent = <PinEvent>(dispatcherSpy.args[1][0]);
        let pinDetainEventC: PinEvent = <PinEvent>(dispatcherSpy.args[2][0]);
        let pinReleaseEventA: PinEvent = <PinEvent>(dispatcherSpy.args[3][0]);
        let pinReleaseEventB: PinEvent = <PinEvent>(dispatcherSpy.args[4][0]);
        let pinReleaseEventC: PinEvent = <PinEvent>(dispatcherSpy.args[5][0]);
        assert.equal(dispatcherSpy.callCount, 6);
        assert.equal(pinDetainEventA.type, PinEvent.DETAIN);
        assert.equal(pinDetainEventA.instance, instanceA);
        assert.equal(pinDetainEventB.type, PinEvent.DETAIN);
        assert.equal(pinDetainEventB.instance, instanceB);
        assert.equal(pinDetainEventC.type, PinEvent.DETAIN);
        assert.equal(pinDetainEventC.instance, instanceC);
        assert.equal(pinReleaseEventA.type, PinEvent.RELEASE);
        assert.equal(pinReleaseEventA.instance, instanceA);
        assert.equal(pinReleaseEventB.type, PinEvent.RELEASE);
        assert.equal(pinReleaseEventB.instance, instanceB);
        assert.equal(pinReleaseEventC.type, PinEvent.RELEASE);
        assert.equal(pinReleaseEventC.instance, instanceC);
    });
});
