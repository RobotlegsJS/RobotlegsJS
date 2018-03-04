// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { getQualifiedClassName } from "../../framework/impl/getQualifiedClassName";

import { isInstanceOfType } from "./isInstanceOfType";
import { IType } from "./IType";
import { ITypeFilter } from "./ITypeFilter";

/**
 * @private
 */
export class TypeFilter implements ITypeFilter {
    /*============================================================================*/
    /* Public Properties                                                          */
    /*============================================================================*/

    protected _allOfTypes: Array<IType<any>>;

    /**
     * @inheritDoc
     */
    public get allOfTypes(): Array<IType<any>> {
        return this._allOfTypes;
    }

    protected _anyOfTypes: Array<IType<any>>;

    /**
     * @inheritDoc
     */
    public get anyOfTypes(): Array<IType<any>> {
        return this._anyOfTypes;
    }

    protected _noneOfTypes: Array<IType<any>>;

    /**
     * @inheritDoc
     */
    public get noneOfTypes(): Array<IType<any>> {
        return this._noneOfTypes;
    }

    protected _descriptor: string;

    /**
     * @inheritDoc
     */
    public get descriptor(): string {
        return (this._descriptor = this._descriptor || this.createDescriptor());
    }

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(allOf: Array<IType<any>>, anyOf: Array<IType<any>>, noneOf: Array<IType<any>>) {
        if (!allOf || !anyOf || !noneOf) {
            throw Error("TypeFilter parameters can not be null");
        }
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
        let i: number = this._allOfTypes.length;

        while (i--) {
            if (!isInstanceOfType(item, this._allOfTypes[i])) {
                return false;
            }
        }

        i = this._noneOfTypes.length;
        while (i--) {
            if (isInstanceOfType(item, this._noneOfTypes[i])) {
                return false;
            }
        }

        if (this._anyOfTypes.length === 0 && (this._allOfTypes.length > 0 || this._noneOfTypes.length > 0)) {
            return true;
        }

        i = this._anyOfTypes.length;
        while (i--) {
            if (isInstanceOfType(item, this._anyOfTypes[i])) {
                return true;
            }
        }

        return false;
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    protected alphabetiseCaseInsensitiveFCQNs(classes: Function[]): string[] {
        let fqcn: string;
        let allFCQNs: string[] = [];
        let iLength: number = classes.length;

        for (let i: number = 0; i < iLength; i++) {
            fqcn = getQualifiedClassName(classes[i]);
            allFCQNs[allFCQNs.length] = fqcn;
        }

        return allFCQNs.sort(this.stringSort);
    }

    protected createDescriptor(): string {
        let allOf_FCQNs: string[] = this.alphabetiseCaseInsensitiveFCQNs(this.allOfTypes);
        let anyOf_FCQNs: string[] = this.alphabetiseCaseInsensitiveFCQNs(this.anyOfTypes);
        let noneOf_FQCNs: string[] = this.alphabetiseCaseInsensitiveFCQNs(this.noneOfTypes);

        let description: string[] = [];

        if (allOf_FCQNs.length) {
            description.push("all of: " + allOf_FCQNs.toString());
        }

        if (anyOf_FCQNs.length) {
            description.push("any of: " + anyOf_FCQNs.toString());
        }

        if (noneOf_FQCNs.length) {
            description.push("none of: " + noneOf_FQCNs.toString());
        }

        return description.join("; ");
    }

    protected stringSort(item1: string, item2: string): number {
        let result: number = 0;

        // ignore upper and lowercase
        item1 = item1.toUpperCase();
        item2 = item2.toUpperCase();

        if (item1 < item2) {
            result = -1;
        } else if (item1 > item2) {
            result = 1;
        }

        return result;
    }
}
