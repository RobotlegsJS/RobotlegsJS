// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { IType } from "../../../../../src/robotlegs/bender/extensions/matching/IType";
import { ITypeFilter } from "../../../../../src/robotlegs/bender/extensions/matching/ITypeFilter";
import { TypeFilter } from "../../../../../src/robotlegs/bender/extensions/matching/TypeFilter";
import { TypeMatcher } from "../../../../../src/robotlegs/bender/extensions/matching/TypeMatcher";
import { TypeMatcherError } from "../../../../../src/robotlegs/bender/extensions/matching/TypeMatcherError";

import { BaseType } from "./support/BaseType";
import { ExtendedType } from "./support/ExtendedType";

describe("TypeMatcher", () => {
    const ALL_OF: Array<IType<any>> = [BaseType, ExtendedType];
    const ALL_OF_2: Array<IType<any>> = [Object];
    const ANY_OF: Array<IType<any>> = [Boolean, Number];
    const ANY_OF_2: Array<IType<any>> = [Array, Date];
    const NONE_OF: Array<IType<any>> = [Error, TypeError];
    const NONE_OF_2: Array<IType<any>> = [TypeMatcherError];

    let matcher: TypeMatcher;

    afterEach(() => {
        matcher = null;
    });

    it("can_be_instantiated", () => {
        matcher = new TypeMatcher();
        assert.instanceOf(matcher, TypeMatcher);
    });

    it("not_supplying_allOf_causes_no_errors", () => {
        const expectedFilter: TypeFilter = new TypeFilter([], ANY_OF, NONE_OF);
        matcher = new TypeMatcher();
        matcher.anyOf(ANY_OF).noneOf(NONE_OF);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("not_supplying_anyOf_causes_no_errors", () => {
        const expectedFilter: TypeFilter = new TypeFilter(ALL_OF, [], NONE_OF);
        matcher = new TypeMatcher();
        matcher.allOf(ALL_OF).noneOf(NONE_OF);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("not_supplying_noneOf_causes_no_errors", () => {
        const expectedFilter: TypeFilter = new TypeFilter(ALL_OF, ANY_OF, []);
        matcher = new TypeMatcher();
        matcher.allOf(ALL_OF).anyOf(ANY_OF);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("supplying_all_any_and_none_in_different_order_populates_them_in_typeFilter", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF,
            NONE_OF
        );
        matcher = new TypeMatcher();
        matcher
            .noneOf(NONE_OF)
            .anyOf(ANY_OF)
            .allOf(ALL_OF);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("supplying_all_any_and_none_populates_them_in_typeFilter", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF,
            NONE_OF
        );
        matcher = new TypeMatcher();
        matcher
            .allOf(ALL_OF)
            .anyOf(ANY_OF)
            .noneOf(NONE_OF);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("supplying_multiple_all_values_includes_all_given_in_typeFilter", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF.concat(ALL_OF_2),
            ANY_OF,
            NONE_OF
        );
        matcher = new TypeMatcher();
        matcher
            .allOf(ALL_OF)
            .anyOf(ANY_OF)
            .noneOf(NONE_OF)
            .allOf(ALL_OF_2);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("supplying_multiple_any_values_includes_all_given_in_typeFilter", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF.concat(ANY_OF_2),
            NONE_OF
        );
        matcher = new TypeMatcher();
        matcher
            .allOf(ALL_OF)
            .anyOf(ANY_OF)
            .noneOf(NONE_OF)
            .anyOf(ANY_OF_2);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("supplying_multiple_none_values_includes_all_given_in_typeFilter", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF,
            NONE_OF.concat(NONE_OF_2)
        );
        matcher = new TypeMatcher();
        matcher
            .allOf(ALL_OF)
            .anyOf(ANY_OF)
            .noneOf(NONE_OF)
            .noneOf(NONE_OF_2);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("throws_TypeMatcherError_if_allOf_changed_after_filter_requested", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.allOf(ALL_OF);
            matcher.createTypeFilter();
            matcher.allOf(ALL_OF);
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_allOf_changed_after_lock", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.allOf(ALL_OF);
            matcher.lock();
            matcher.allOf(ALL_OF);
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_anyOf_changed_after_filter_requested", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.anyOf(ANY_OF);
            matcher.createTypeFilter();
            matcher.anyOf(ANY_OF);
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_anyOf_changed_after_lock", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.anyOf(ANY_OF);
            matcher.lock();
            matcher.anyOf(ANY_OF);
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_noneOf_changed_after_filter_requested", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.noneOf(NONE_OF);
            matcher.createTypeFilter();
            matcher.noneOf(NONE_OF);
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_noneOf_changed_after_lock", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.noneOf(NONE_OF);
            matcher.lock();
            matcher.noneOf(NONE_OF);
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_conditions_empty_and_filter_requested", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher
                .allOf([])
                .anyOf([])
                .noneOf([]);
            matcher.createTypeFilter();
        }
        assert.throws(createTypeFilter, Error);
    });

    it("throws_TypeMatcherError_if_empty_and_filter_requested", () => {
        function createTypeFilter(): void {
            matcher = new TypeMatcher();
            matcher.createTypeFilter();
        }
        assert.throws(createTypeFilter, Error);
    });

    it("clone_returns_open_copy_when_locked", () => {
        matcher = new TypeMatcher();
        matcher.allOf(ALL_OF).anyOf(ANY_OF);
        matcher.lock();

        const clone: TypeMatcher = matcher.clone();
        clone.noneOf(NONE_OF);

        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF,
            NONE_OF
        );

        assertMatchesTypeFilter(expectedFilter, clone.createTypeFilter());
    });

    it("supplying_all_any_and_none_as_normal_arguments_also_works", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF,
            NONE_OF
        );
        matcher = new TypeMatcher();
        matcher
            .allOf(BaseType, ExtendedType)
            .anyOf(Boolean, Number)
            .noneOf(Error, TypeError);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    it("mixing_all_any_and_none_arguments_also_works", () => {
        const expectedFilter: TypeFilter = new TypeFilter(
            ALL_OF,
            ANY_OF,
            NONE_OF
        );
        matcher = new TypeMatcher();
        matcher
            .allOf([BaseType], ExtendedType)
            .anyOf([Boolean], Number)
            .noneOf([Error], TypeError);
        assertMatchesTypeFilter(matcher.createTypeFilter(), expectedFilter);
    });

    function assertMatchesTypeFilter(
        expected: ITypeFilter,
        actual: ITypeFilter
    ): void {
        assert.deepEqual(expected.allOfTypes, actual.allOfTypes);
        assert.deepEqual(expected.anyOfTypes, actual.anyOfTypes);
        assert.deepEqual(expected.noneOfTypes, actual.noneOfTypes);
    }
});
