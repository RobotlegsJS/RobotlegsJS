// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IInjector } from "../../../../../src/robotlegs/bender/framework/api/IInjector";
import { IMatcher } from "../../../../../src/robotlegs/bender/framework/api/IMatcher";
import { instanceOfType } from "../../../../../src/robotlegs/bender/extensions/matching/instanceOfType";

import { BaseType } from "./support/BaseType";
import { ExtendedType } from "./support/ExtendedType";

describe("instanceOfType", () => {
    it("matches_primitive_type_Boolean", () => {
        let matcher: IMatcher = instanceOfType(Boolean);

        assert.isTrue(matcher.matches(true));
        assert.isTrue(matcher.matches(false));
        assert.isTrue(matcher.matches(Math.random() >= 0));
        assert.isTrue(matcher.matches(Math.random() <= 1));
    });

    it("matches_primitive_type_Function", () => {
        let matcher: IMatcher = instanceOfType(Function);

        assert.isTrue(
            matcher.matches(function empty() {
                console.log("do nothing!");
            })
        );
        assert.isTrue(
            matcher.matches(function args(arg: number) {
                return arg;
            })
        );
        assert.isTrue(matcher.matches(() => {}));
        assert.isTrue(
            matcher.matches((arg: number) => {
                arg++;
            })
        );
        assert.isTrue(matcher.matches(console.log));
        assert.isTrue(matcher.matches(instanceOfType));
    });

    it("matches_primitive_type_Number", () => {
        let matcher: IMatcher = instanceOfType(Number);

        assert.isTrue(matcher.matches(Number.NEGATIVE_INFINITY));
        assert.isTrue(matcher.matches(Number.MIN_SAFE_INTEGER));
        assert.isTrue(matcher.matches(Number.MIN_VALUE));
        assert.isTrue(matcher.matches(-1));
        assert.isTrue(matcher.matches(0));
        assert.isTrue(matcher.matches(1));
        assert.isTrue(matcher.matches(Number.EPSILON));
        assert.isTrue(matcher.matches(Number.MAX_VALUE));
        assert.isTrue(matcher.matches(Number.MAX_SAFE_INTEGER));
        assert.isTrue(matcher.matches(Number.POSITIVE_INFINITY));

        assert.isTrue(matcher.matches(Math.E));
        assert.isTrue(matcher.matches(Math.LN10));
        assert.isTrue(matcher.matches(Math.LN2));
        assert.isTrue(matcher.matches(Math.LOG2E));
        assert.isTrue(matcher.matches(Math.LOG10E));
        assert.isTrue(matcher.matches(Math.PI));
        assert.isTrue(matcher.matches(Math.SQRT1_2));
        assert.isTrue(matcher.matches(Math.SQRT2));
        assert.isTrue(matcher.matches(Math.random()));
    });

    it("matches_primitive_type_String", () => {
        let matcher: IMatcher = instanceOfType(String);
        let randomNumber: number = Math.random();

        assert.isTrue(matcher.matches(""));
        assert.isTrue(matcher.matches("this is not a empty string"));
        assert.isTrue(matcher.matches(randomNumber + " is a random value"));

        assert.isTrue(matcher.matches(``));
        assert.isTrue(matcher.matches(`this is not a empty string`));
        assert.isTrue(matcher.matches(`${randomNumber} is a random value`));
    });

    it("matches_primitive_type_Symbol", () => {
        let matcher: IMatcher = instanceOfType(Symbol);

        assert.isTrue(matcher.matches(Symbol("I'm a string")));
        assert.isTrue(matcher.matches(Symbol("I'm also a string")));
        assert.isTrue(matcher.matches(Symbol(`I'm a string too`)));
        assert.isTrue(matcher.matches(Symbol(-1)));
        assert.isTrue(matcher.matches(Symbol(0)));
        assert.isTrue(matcher.matches(Symbol(1)));
        assert.isTrue(matcher.matches(Symbol(Math.random())));
        assert.isTrue(matcher.matches(IInjector));
    });

    it("matches_primitive_type_Object", () => {
        let matcher: IMatcher = instanceOfType(Object);

        assert.isTrue(matcher.matches({}));
        assert.isTrue(matcher.matches({ data: "I'm not a empty object" }));
    });

    it("matches_custom_base_type", () => {
        let matcher: IMatcher = instanceOfType(BaseType);

        assert.isTrue(matcher.matches(new BaseType("")));
        assert.isTrue(matcher.matches(new BaseType("who am I?")));
    });

    it("matches_custom_extended_type", () => {
        let matcher: IMatcher = instanceOfType(ExtendedType);

        assert.isTrue(matcher.matches(new ExtendedType("", 0)));
        assert.isTrue(matcher.matches(new ExtendedType("who am I?", 41)));
    });

    it("matches_custom_base_and_extended_type", () => {
        let baseMatcher: IMatcher = instanceOfType(BaseType);
        let extendedMatcher: IMatcher = instanceOfType(ExtendedType);
        let extendedElement: ExtendedType = new ExtendedType("who am I?", 41);

        assert.isTrue(baseMatcher.matches(extendedElement));
        assert.isTrue(extendedMatcher.matches(extendedElement));
    });

    it("stress_match_test", () => {
        let matchers: IMatcher[] = [
            instanceOfType(Boolean),
            instanceOfType(Function),
            instanceOfType(Number),
            instanceOfType(String),
            instanceOfType(Symbol),
            instanceOfType(Object),
            instanceOfType(BaseType),
            instanceOfType(ExtendedType)
        ];

        let samples: any[][] = [
            // Boolean samples
            [true, false, Math.random() >= 0],
            // Function samples
            [
                function empty() {
                    console.log("do nothing!");
                },
                function args(arg: number) {
                    return arg;
                },
                console.log
            ],
            // Number samples
            [
                Number.NEGATIVE_INFINITY,
                Number.MIN_SAFE_INTEGER,
                Number.MIN_VALUE,
                -1,
                0,
                1,
                Number.EPSILON,
                Number.MAX_VALUE,
                Number.MAX_SAFE_INTEGER,
                Number.POSITIVE_INFINITY
            ],
            // String samples
            [
                "",
                "this is not a empty string",
                ``,
                `this is not a empty string`
            ],
            // Symbol samples
            [
                Symbol("I'm a string"),
                Symbol(-1),
                Symbol(0),
                Symbol(1),
                Symbol(Math.random()),
                IInjector
            ],
            // Object samples
            [
                {},
                { data: "I'm not a empty object" },
                { data: "I'm a long long long long object" }
            ],
            // BaseType samples
            [
                new BaseType(""),
                new BaseType("who am I?"),
                new BaseType("I'm a long long long long string")
            ],
            // ExtendedType samples
            [
                new ExtendedType("I'm not a empty object", 7),
                new ExtendedType("who am I?", 41)
            ]
        ];

        let numMatchers: number = matchers.length;
        let numSamples: number = samples.length;
        let numItems: number = 0;
        let matcher: IMatcher;
        let items: any[];

        for (let m: number = 0; m < numMatchers; m++) {
            matcher = matchers[m];

            for (let i: number = 0; i < numSamples; i++) {
                items = samples[i];
                numItems = items.length;

                for (let j: number = 0; j < numItems; j++) {
                    // Matcher is being matched with samples of same type
                    if (m === i) {
                        assert.isTrue(matcher.matches(items[j]));
                    } else if (m >= 5 && i > m) {
                        // Matcher is being matched with samples that are extended type
                        // Object matchs also with BaseType and ExtendedType
                        // BaseType matchs also with ExtendedType
                        assert.isTrue(matcher.matches(items[j]));
                    } else {
                        assert.isFalse(matcher.matches(items[j]));
                    }
                }
            }
        }
    });
});
