// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ITypeFilter } from "./ITypeFilter";

/**
 * @private
 */
export class TypeFilter implements ITypeFilter {

    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    protected _allOfTypes: FunctionConstructor[];

    /**
     * @inheritDoc
     */
    public get allOfTypes(): FunctionConstructor[] {
        return this._allOfTypes;
    }

    protected _anyOfTypes: FunctionConstructor[];

    /**
     * @inheritDoc
     */
    public get anyOfTypes(): FunctionConstructor[] {
        return this._anyOfTypes;
    }

    protected _noneOfTypes: FunctionConstructor[];

    /**
     * @inheritDoc
     */
    public get noneOfTypes(): FunctionConstructor[] {
        return this._noneOfTypes;
    }

    protected _descriptor: string;

    /**
     * @inheritDoc
     */
    public get descriptor(): string {
        return this._descriptor = this._descriptor || this.createDescriptor();
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(allOf: FunctionConstructor[], anyOf: FunctionConstructor[], noneOf: FunctionConstructor[]) {
        if (!allOf || !anyOf || !noneOf)
            throw Error('TypeFilter parameters can not be null');
        this._allOfTypes = allOf;
        this._anyOfTypes = anyOf;
        this._noneOfTypes = noneOf;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public matches(item: any): boolean {
        var i: number = this._allOfTypes.length;
        while (i--) {
            if (!(item instanceof this._allOfTypes[i])) {
                return false;
            }
        }

        i = this._noneOfTypes.length;
        while (i--) {
            if (item instanceof this._noneOfTypes[i]) {
                return false;
            }
        }

        if (this._anyOfTypes.length == 0 && (this._allOfTypes.length > 0 || this._noneOfTypes.length > 0)) {
            return true;
        }

        i = this._anyOfTypes.length;
        while (i--) {
            if (item instanceof this._anyOfTypes[i]) {
                return true;
            }
        }

        return false;
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    protected alphabetiseCaseInsensitiveFCQNs(classVector: FunctionConstructor[]): string[] {
        var fqcn: string;
        var allFCQNs: string[] = [];

        var iLength: number = classVector.length;
        for (var i: number = 0; i < iLength; i++) {
            // fqcn = getQualifiedClassName(classVector[i]);
            fqcn = classVector[i].toString().match(/function\ ([^\(]+)/)[1]
            allFCQNs[allFCQNs.length] = fqcn;
        }

        allFCQNs.sort(this.stringSort);
        return allFCQNs;
    }

    protected createDescriptor(): string {
        var allOf_FCQNs: string[] = this.alphabetiseCaseInsensitiveFCQNs(this.allOfTypes);
        var anyOf_FCQNs: string[] = this.alphabetiseCaseInsensitiveFCQNs(this.anyOfTypes);
        var noneOf_FQCNs: string[] = this.alphabetiseCaseInsensitiveFCQNs(this.noneOfTypes);
        return "all of: " + allOf_FCQNs.toString()
            + ", any of: " + anyOf_FCQNs.toString()
            + ", none of: " + noneOf_FQCNs.toString();
    }

    protected stringSort(item1: string, item2: string): number {
        if (item1 < item2) {
            return 1;
        }
        return -1;
    }
}
