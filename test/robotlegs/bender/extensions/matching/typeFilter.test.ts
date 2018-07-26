// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IType } from "../../../../../src/robotlegs/bender/extensions/matching/IType";
import { TypeFilter } from "../../../../../src/robotlegs/bender/extensions/matching/TypeFilter";

import { BaseType } from "./support/BaseType";
import { ExtendedType } from "./support/ExtendedType";

describe("TypeFilter", () => {
    let allOf: Array<IType<any>> = [ExtendedType, Object, BaseType];
    let anyOf: Array<IType<any>> = [Promise, String, TypeFilter, Function, Number, Boolean];
    let noneOf: Array<IType<any>> = [Error];
    let filter: TypeFilter;

    beforeEach(() => {
        filter = new TypeFilter(allOf, anyOf, noneOf);
    });

    afterEach(() => {
        filter = null;
    });

    it("can_be_instantiated", () => {
        assert.instanceOf(filter, TypeFilter);
    });

    it("get_allOfTypes", () => {
        assert.deepEqual(filter.allOfTypes, allOf);
    });

    it("get_anyOfTypes", () => {
        assert.deepEqual(filter.anyOfTypes, anyOf);
    });

    it("get_noneOfTypes", () => {
        assert.deepEqual(filter.noneOfTypes, noneOf);
    });

    it("get_descriptor_returns_alphabetised_readable_list", () => {
        const expected: string =
            "all of: BaseType,ExtendedType,Object; any of: Boolean,Function,Number,Promise,String,TypeFilter; none of: Error";
        let actual: string = filter.descriptor;
        assert.equal(actual, expected);
    });

    it("get_descriptor_returns_allOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([ExtendedType, Object, BaseType], [], []);
        const expected: string = "all of: BaseType,ExtendedType,Object";
        let actual: string = typeFilter.descriptor;
        assert.equal(actual, expected);
    });

    it("get_descriptor_returns_anyOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([], [Number, Array, String, Error], []);
        const expected: string = "any of: Array,Error,Number,String";
        let actual: string = typeFilter.descriptor;
        assert.equal(actual, expected);
    });

    it("get_descriptor_returns_noneOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([], [], [BaseType, ExtendedType, Object]);
        const expected: string = "none of: BaseType,ExtendedType,Object";
        let actual: string = typeFilter.descriptor;
        assert.equal(actual, expected);
    });

    it("get_descriptor_returns_with_duplicated_elements", () => {
        let typeFilter: TypeFilter = new TypeFilter([BaseType, BaseType], [BaseType, BaseType], [BaseType, BaseType]);
        const expected: string = "all of: BaseType,BaseType; any of: BaseType,BaseType; none of: BaseType,BaseType";
        let actual: string = typeFilter.descriptor;
        assert.equal(actual, expected);
    });

    it("initialising_with_allOf_null_throws_error", () => {
        function createTypeFilter(): void {
            let type: TypeFilter = new TypeFilter(null, anyOf, noneOf);
            type = type || null;
        }
        assert.throws(createTypeFilter, Error);
    });

    it("initialising_with_anyOf_null_throws_error", () => {
        function createTypeFilter(): void {
            let type: TypeFilter = new TypeFilter(allOf, null, noneOf);
            type = type || null;
        }
        assert.throws(createTypeFilter, Error);
    });

    it("initialising_with_noneOf_null_throws_error", () => {
        function createTypeFilter(): void {
            let type: TypeFilter = new TypeFilter(allOf, anyOf, null);
            type = type || null;
        }
        assert.throws(createTypeFilter, Error);
    });

    it("matches_allOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([ExtendedType, BaseType, Object], [], []);
        assert.isTrue(typeFilter.matches(new ExtendedType("who am I?", 41)));
        assert.isFalse(typeFilter.matches(new BaseType("who am I?")));
        assert.isFalse(typeFilter.matches({ x: 0, y: 0 }));
    });

    it("matches_allOff_anyOf", () => {
        let typeFilter: TypeFilter = new TypeFilter([ExtendedType, BaseType], [Object], []);
        assert.isTrue(typeFilter.matches(new ExtendedType("who am I?", 41)));
        assert.isFalse(typeFilter.matches(new BaseType("who am I?")));
        assert.isFalse(typeFilter.matches({ x: 0, y: 0 }));
    });

    it("matches_allOff_noneOf", () => {
        let typeFilter: TypeFilter = new TypeFilter([ExtendedType, BaseType, Object], [], [Error]);
        assert.isTrue(typeFilter.matches(new ExtendedType("who am I?", 41)));
        assert.isFalse(typeFilter.matches(new BaseType("who am I?")));
        assert.isFalse(typeFilter.matches({ x: 0, y: 0 }));
        assert.isFalse(typeFilter.matches(new Error("Should never be called")));
    });

    it("matches_allOff_anyOff_noneOf", () => {
        let typeFilter: TypeFilter = new TypeFilter([ExtendedType, BaseType], [Object], [Error]);
        assert.isTrue(typeFilter.matches(new ExtendedType("who am I?", 41)));
        assert.isFalse(typeFilter.matches(new BaseType("who am I?")));
        assert.isFalse(typeFilter.matches({ x: 0, y: 0 }));
        assert.isFalse(typeFilter.matches(new Error("Should never be called")));
    });

    it("matches_anyOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([], [String, Function, Number, Boolean], []);

        assert.isTrue(typeFilter.matches(5));
        assert.isTrue(typeFilter.matches(true));
        assert.isTrue(typeFilter.matches("I'm a string"));
        assert.isTrue(typeFilter.matches(console.log));
        assert.isFalse(typeFilter.matches(new Error("Should never be called")));
    });

    it("matches_anyOff_noneOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([], [String, Function, Number, Boolean], [Error, Function]);

        assert.isTrue(typeFilter.matches(5));
        assert.isTrue(typeFilter.matches(true));
        assert.isTrue(typeFilter.matches("I'm a string"));
        assert.isFalse(typeFilter.matches(new Error("Should never be called")));
        assert.isFalse(typeFilter.matches(console.log));
    });

    it("matches_noneOff", () => {
        let typeFilter: TypeFilter = new TypeFilter([], [], [Error, Function]);

        assert.isTrue(typeFilter.matches(5));
        assert.isTrue(typeFilter.matches(true));
        assert.isTrue(typeFilter.matches("I'm a string"));
        assert.isTrue(typeFilter.matches(new ExtendedType("who am I?", 41)));
        assert.isTrue(typeFilter.matches(new BaseType("who am I?")));
        assert.isTrue(typeFilter.matches({ x: 0, y: 0 }));
        assert.isFalse(typeFilter.matches(new Error("Should never be called")));
        assert.isFalse(typeFilter.matches(console.log));
    });

    it("class_not_matched_by_any", () => {
        let typeFilter: TypeFilter = new TypeFilter([], [], []);

        assert.isFalse(typeFilter.matches(5));
        assert.isFalse(typeFilter.matches(true));
        assert.isFalse(typeFilter.matches("I'm a string"));
        assert.isFalse(typeFilter.matches(new ExtendedType("who am I?", 41)));
        assert.isFalse(typeFilter.matches(new BaseType("who am I?")));
        assert.isFalse(typeFilter.matches({ x: 0, y: 0 }));
        assert.isFalse(typeFilter.matches(new Error("Should never be called")));
        assert.isFalse(typeFilter.matches(console.log));
    });
});
