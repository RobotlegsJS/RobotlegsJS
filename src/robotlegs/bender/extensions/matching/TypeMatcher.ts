// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ITypeFilter } from "./ITypeFilter";
import { TypeFilter } from "./TypeFilter";
import { ITypeMatcher } from "./ITypeMatcher";
import { ITypeMatcherFactory } from "./ITypeMatcherFactory";
import { TypeMatcherError } from "./TypeMatcherError";

/**
 * A Type Matcher matches objects that satisfy type matching rules
 */
export class TypeMatcher implements ITypeMatcher, ITypeMatcherFactory {
    /*============================================================================*/
    /* Protected Properties                                                       */
    /*============================================================================*/

    protected _allOfTypes: Function[] = [];

    protected _anyOfTypes: Function[] = [];

    protected _noneOfTypes: Function[] = [];

    protected _typeFilter: ITypeFilter = null;

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * All types that an item must extend or implement
     */
    public allOf(...types: any[]): TypeMatcher {
        this.pushAddedTypesTo(types, this._allOfTypes);
        return this;
    }

    /**
     * Any types that an item must extend or implement
     */
    public anyOf(...types: any[]): TypeMatcher {
        this.pushAddedTypesTo(types, this._anyOfTypes);
        return this;
    }

    /**
     * Types that an item must not extend or implement
     */
    public noneOf(...types: any[]): TypeMatcher {
        this.pushAddedTypesTo(types, this._noneOfTypes);
        return this;
    }

    /**
     * @inheritDoc
     */
    public createTypeFilter(): ITypeFilter {
        // calling this seals the matcher
        return (this._typeFilter = this._typeFilter || this.buildTypeFilter());
    }

    /**
     * Locks this type matcher
     * @return
     */
    public lock(): ITypeMatcherFactory {
        this.createTypeFilter();
        return this;
    }

    /**
     * @inheritDoc
     */
    public clone(): TypeMatcher {
        return new TypeMatcher()
            .allOf(this._allOfTypes)
            .anyOf(this._anyOfTypes)
            .noneOf(this._noneOfTypes);
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    protected buildTypeFilter(): ITypeFilter {
        if (
            this._allOfTypes.length === 0 &&
            this._anyOfTypes.length === 0 &&
            this._noneOfTypes.length === 0
        ) {
            throw new TypeMatcherError(TypeMatcherError.EMPTY_MATCHER);
        }
        return new TypeFilter(
            this._allOfTypes,
            this._anyOfTypes,
            this._noneOfTypes
        );
    }

    protected pushAddedTypesTo(types: any[], targetSet: Function[]): void {
        if (this._typeFilter) {
            this.throwSealedMatcherError();
        }

        this.pushValuesToTargetSet(types, targetSet);
    }

    protected throwSealedMatcherError(): void {
        throw new TypeMatcherError(TypeMatcherError.SEALED_MATCHER);
    }

    protected pushValuesToTargetSet(
        values: any[],
        targetSet: Function[]
    ): void {
        let types: Function[] =
            values.length === 1 && values[0] instanceof Array
                ? values[0]
                : values;

        types.forEach(type => {
            targetSet.push(type);
        });
    }
}
