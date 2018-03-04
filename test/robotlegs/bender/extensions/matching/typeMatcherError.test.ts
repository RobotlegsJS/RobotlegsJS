// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { TypeMatcherError } from "../../../../../src/robotlegs/bender/extensions/matching/TypeMatcherError";

describe("TypeMatcherError", () => {
    let typeMatcherError: TypeMatcherError;

    afterEach(() => {
        typeMatcherError = null;
    });

    it("can_be_instantiated", () => {
        typeMatcherError = new TypeMatcherError(TypeMatcherError.EMPTY_MATCHER);
        assert.instanceOf(typeMatcherError, Error);
    });

    it("empty_matcher_message_is_recovered", () => {
        typeMatcherError = new TypeMatcherError(TypeMatcherError.EMPTY_MATCHER);
        assert.equal(typeMatcherError.message, TypeMatcherError.EMPTY_MATCHER);
    });

    it("sealed_matcher_message_is_recovered", () => {
        typeMatcherError = new TypeMatcherError(TypeMatcherError.SEALED_MATCHER);
        assert.equal(typeMatcherError.message, TypeMatcherError.SEALED_MATCHER);
    });
});
