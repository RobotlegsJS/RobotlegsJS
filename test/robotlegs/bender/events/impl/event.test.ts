// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { Event } from "../../../../../src/";

describe("Event", () => {
    it("event_only_with_type_is_initialized", () => {
        let event: Event = new Event("added");
        assert.equal(event.type, "added");
        assert.isFalse(event.isDefaultPrevented);
        assert.isFalse(event.bubbles);
        assert.isFalse(event.cancelable);
        assert.isUndefined(event.data);
    });

    it("event_with_type_and_bubbles_is_initialized", () => {
        let event: Event = new Event("added", true);
        assert.equal(event.type, "added");
        assert.isFalse(event.isDefaultPrevented);
        assert.isTrue(event.bubbles);
        assert.isFalse(event.cancelable);
        assert.isUndefined(event.data);
    });

    it("event_with_type_and_bubbles_and_cancelable_is_initialized", () => {
        let event: Event = new Event("added", true, true);
        assert.equal(event.type, "added");
        assert.isFalse(event.isDefaultPrevented);
        assert.isTrue(event.bubbles);
        assert.isTrue(event.cancelable);
        assert.isUndefined(event.data);
    });

    it("event_with_type_and_bubbles_and_cancelable_and_data_is_initialized", () => {
        let data: any = {};
        let event: Event = new Event("added", true, true, data);
        assert.equal(event.type, "added");
        assert.isFalse(event.isDefaultPrevented);
        assert.isTrue(event.bubbles);
        assert.isTrue(event.cancelable);
        assert.equal(event.data, data);
    });

    it("preventDefault_is_called", () => {
        let event: Event = new Event("added", false, true);
        event.preventDefault();
        assert.isTrue(event.isDefaultPrevented);
    });

    it("stopPropagation_is_called", () => {
        let event: Event = new Event("added", true);
        event.stopPropagation();
        assert.isTrue(event.isPropagationStopped);
    });

    it("stopImmediatePropagation_is_called", () => {
        let event: Event = new Event("added", true);
        event.stopImmediatePropagation();
        assert.isTrue(event.isPropagationImmediateStopped);
    });
});
