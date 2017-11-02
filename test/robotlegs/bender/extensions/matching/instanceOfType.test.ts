// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IMatcher } from "../../../../../src/robotlegs/bender/framework/api/IMatcher";
import { instanceOfType } from "../../../../../src/robotlegs/bender/extensions/matching/instanceOfType";

describe("instanceOfType", () => {
    it("matches_primitive_type_Number", () => {
        let numberMatcher: IMatcher = instanceOfType(Number);

        assert.isTrue(numberMatcher.matches(Number.NEGATIVE_INFINITY));
        assert.isTrue(numberMatcher.matches(Number.MIN_SAFE_INTEGER));
        assert.isTrue(numberMatcher.matches(Number.MIN_VALUE));
        assert.isTrue(numberMatcher.matches(-1));
        assert.isTrue(numberMatcher.matches(0));
        assert.isTrue(numberMatcher.matches(1));
        assert.isTrue(numberMatcher.matches(Number.EPSILON));
        assert.isTrue(numberMatcher.matches(Number.MAX_VALUE));
        assert.isTrue(numberMatcher.matches(Number.MAX_SAFE_INTEGER));
        assert.isTrue(numberMatcher.matches(Number.POSITIVE_INFINITY));

        assert.isTrue(numberMatcher.matches(Math.E));
        assert.isTrue(numberMatcher.matches(Math.LN10));
        assert.isTrue(numberMatcher.matches(Math.LN2));
        assert.isTrue(numberMatcher.matches(Math.LOG2E));
        assert.isTrue(numberMatcher.matches(Math.LOG10E));
        assert.isTrue(numberMatcher.matches(Math.PI));
        assert.isTrue(numberMatcher.matches(Math.SQRT1_2));
        assert.isTrue(numberMatcher.matches(Math.SQRT2));
        assert.isTrue(numberMatcher.matches(Math.random()));
    });

    it("matches_primitive_type_String", () => {
        let stringMatcher: IMatcher = instanceOfType(String);
        let randomNumber: number = Math.random();

        assert.isTrue(stringMatcher.matches(""));
        assert.isTrue(stringMatcher.matches("this is not a empty string"));
        assert.isTrue(
            stringMatcher.matches(randomNumber + " is a random value")
        );

        assert.isTrue(stringMatcher.matches(""));
        assert.isTrue(stringMatcher.matches("this is not a empty string"));
        assert.isTrue(
            stringMatcher.matches(randomNumber + " is a random value")
        );

        assert.isTrue(stringMatcher.matches(``));
        assert.isTrue(stringMatcher.matches(`this is not a empty string`));
        assert.isTrue(
            stringMatcher.matches(`${randomNumber} is a random value`)
        );
    });
});
