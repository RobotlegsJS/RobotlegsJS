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

import { TypeCollection } from "./support/TypeCollection";
import { BaseType } from "./support/BaseType";
import { ExtendedType } from "./support/ExtendedType";

describe("instanceOfType", () => {
    let booleanCollection: TypeCollection = new TypeCollection(
        Boolean,
        [],
        [true, false, Math.random() >= 0, Math.random() < 1]
    );
    let dateCollection: TypeCollection = new TypeCollection(
        Date,
        [],
        [new Date(), new Date(2017, 11, 3)]
    );
    let functionCollection: TypeCollection = new TypeCollection(
        Function,
        [],
        [
            function empty() {
                console.log("do nothing!");
            },
            function args(arg: number) {
                return arg;
            },
            x => {
                console.log(`x = ${x}`);
            },
            console.log,
            instanceOfType
        ]
    );
    let numberCollection: TypeCollection = new TypeCollection(
        Number,
        [],
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
            Number.POSITIVE_INFINITY,
            Math.E,
            Math.LN10,
            Math.LN2,
            Math.LOG2E,
            Math.LOG10E,
            Math.PI,
            Math.SQRT1_2,
            Math.SQRT2,
            Math.random()
        ]
    );
    let stringCollection: TypeCollection = new TypeCollection(
        String,
        [],
        [
            "",
            "this is not a empty string",
            Math.random() + " is a random value",
            ``,
            `this is also not a empty string`,
            `${Math.random()} is another random value`
        ]
    );
    let symbolCollection: TypeCollection = new TypeCollection(
        Symbol,
        [],
        [
            Symbol("I'm a string"),
            Symbol("I'm also a string"),
            Symbol(`I'm a string too`),
            Symbol(-1),
            Symbol(0),
            Symbol(1),
            Symbol(Math.random()),
            IInjector
        ]
    );
    let objectCollection: TypeCollection = new TypeCollection(
        Object,
        [Function, Array, Date, BaseType, ExtendedType],
        [{}, { data: "I'm not a empty object" }, new Object()]
    );
    let arrayCollection: TypeCollection = new TypeCollection(
        Array,
        [],
        [[], ["I'm not a empty array"], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]
    );
    let baseTypeCollection: TypeCollection = new TypeCollection(
        BaseType,
        [ExtendedType],
        [
            new BaseType(""),
            new BaseType("who am I?"),
            new BaseType("I'm a long long long long string")
        ]
    );
    let extendedTypeCollection: TypeCollection = new TypeCollection(
        ExtendedType,
        [],
        [
            new ExtendedType("I'm not a empty object", 7),
            new ExtendedType("who am I?", 41)
        ]
    );

    it("matches_primitive_type_Boolean", () => {
        let matcher: IMatcher = booleanCollection.matcher;

        booleanCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_Date", () => {
        let matcher: IMatcher = dateCollection.matcher;

        dateCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_Function", () => {
        let matcher: IMatcher = functionCollection.matcher;

        functionCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_Number", () => {
        let matcher: IMatcher = numberCollection.matcher;

        numberCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_String", () => {
        let matcher: IMatcher = stringCollection.matcher;

        stringCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_Symbol", () => {
        let matcher: IMatcher = symbolCollection.matcher;

        symbolCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_Object", () => {
        let matcher: IMatcher = objectCollection.matcher;

        objectCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_primitive_type_Array", () => {
        let matcher: IMatcher = arrayCollection.matcher;

        arrayCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_custom_base_type", () => {
        let matcher: IMatcher = baseTypeCollection.matcher;

        baseTypeCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("matches_custom_extended_type", () => {
        let matcher: IMatcher = extendedTypeCollection.matcher;

        extendedTypeCollection.items.forEach(item => {
            assert.isTrue(matcher.matches(item));
        });
    });

    it("stress_match_test", done => {
        let collections: TypeCollection[] = [
            arrayCollection,
            baseTypeCollection,
            booleanCollection,
            dateCollection,
            extendedTypeCollection,
            functionCollection,
            numberCollection,
            objectCollection,
            stringCollection,
            symbolCollection
        ];

        let numCollections: number = collections.length;

        // iterate through matchers
        for (let c: number = 0; c < numCollections; c++) {
            let typeCollection: TypeCollection = collections[c];
            let matcher: IMatcher = typeCollection.matcher;
            let matchWith: Function[] = typeCollection.matchWith;

            // iterate through samples of the same type
            for (let i: number = 0; i < numCollections; i++) {
                let againstCollection: TypeCollection = collections[i];
                let items: any[] = againstCollection.items;
                let numItems: number = items.length;

                // iterate through each sample of the same type
                for (let j: number = 0; j < numItems; j++) {
                    // Verify if matcher should match with samples of this type
                    if (matchWith.indexOf(againstCollection.type) >= 0) {
                        assert.isTrue(matcher.matches(items[j]));
                    } else {
                        assert.isFalse(matcher.matches(items[j]));
                    }
                }
            }
        }

        done();
    });
});
