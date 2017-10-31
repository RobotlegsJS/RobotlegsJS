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
        assert.isFalse(event.defaultPrevented);
        assert.isFalse(event.bubbles);
        assert.isUndefined(event.detail);
    });

    it("event_with_type_and_bubbles_is_initialized", () => {
        let event: Event = new Event("added", { bubbles: true });
        assert.equal(event.type, "added");
        assert.isFalse(event.defaultPrevented);
        assert.isTrue(event.bubbles);
        assert.isUndefined(event.detail);
    });

    it("event_with_type_and_bubbles_and_detail_is_initialized", () => {
        let detail: any = {};
        let event: Event = new Event("added", { bubbles: true, detail });
        assert.equal(event.type, "added");
        assert.isFalse(event.defaultPrevented);
        assert.isTrue(event.bubbles);
        assert.equal(event.detail, detail);
    });

    it("preventDefault_is_called", () => {
        let event: Event = new Event("added");
        event.preventDefault();
        assert.isTrue(event.defaultPrevented);
    });

    it("stopPropagation_is_called", () => {
        let event: Event = new Event("added", { bubbles: true });
        event.stopPropagation();
        assert.isFalse(event.bubbles);
    });
});
