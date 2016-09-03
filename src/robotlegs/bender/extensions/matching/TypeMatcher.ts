// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
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

    protected _allOfTypes: FunctionConstructor[] = [];

    protected _anyOfTypes: FunctionConstructor[] = [];

    protected _noneOfTypes: FunctionConstructor[] = [];

    protected _typeFilter: ITypeFilter;

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
        return (new TypeMatcher()).allOf(this._allOfTypes).anyOf(this._anyOfTypes).noneOf(this._noneOfTypes);
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    protected buildTypeFilter(): ITypeFilter {
        if ((this._allOfTypes.length == 0) &&
            (this._anyOfTypes.length == 0) &&
            (this._noneOfTypes.length == 0)) {
            throw new TypeMatcherError(TypeMatcherError.EMPTY_MATCHER);
        }
        return new TypeFilter(this._allOfTypes, this._anyOfTypes, this._noneOfTypes);
    }

    protected pushAddedTypesTo(types: any[], targetSet: FunctionConstructor[]): void {
        if (this._typeFilter) {
            this.throwSealedMatcherError();
        }

        this.pushValuesToClassVector(types, targetSet);
    }

    protected throwSealedMatcherError(): void {
        throw new TypeMatcherError(TypeMatcherError.SEALED_MATCHER);
    }

    protected pushValuesToClassVector(values: any[], vector: FunctionConstructor[]): void {
        if (values.length === 1 && (typeof (values[0]) === "array")) {
            for (let i: number; i < values[0].length; i++) {
                let type: FunctionConstructor = values[0][i];
                vector.push(type);
            }
        } else {
            for (let i: number = 0; i < values.length; i++) {
                let type = values[i];
                vector.push(type);
            }
        }
    }
}
