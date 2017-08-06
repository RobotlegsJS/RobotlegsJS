// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

// Possibly not needed on TypeScript

// import { ITypeFilter } from "./ITypeFilter";
//
// /**
//  * A filter that describes a package matcher
//  */
// export class PackageFilter implements ITypeFilter {
//
//     /*============================================================================*/
//     /* Public Properties                                                          */
//     /*============================================================================*/
//
//     protected _descriptor: string;
//
//     /**
//      * @inheritDoc
//      */
//     public get descriptor(): string {
//         return this._descriptor = this._descriptor || this.createDescriptor();
//     }
//
//     /**
//      * @inheritDoc
//      */
//     public get allOfTypes(): FunctionConstructor[] {
//         return this.emptyVector;
//     }
//
//     /**
//      * @inheritDoc
//      */
//     public get anyOfTypes(): FunctionConstructor[] {
//         return this.emptyVector;
//     }
//
//     /**
//      * @inheritDoc
//      */
//     public get noneOfTypes(): FunctionConstructor[] {
//         return this.emptyVector;
//     }
//
//     /*============================================================================*/
//     /* Protected Properties                                                       */
//     /*============================================================================*/
//
//     protected emptyVector: FunctionConstructor[] = [];
//
//     protected _requirePackage: string;
//
//     protected _anyOfPackages: string[];
//
//     protected _noneOfPackages: string[];
//
//     /*============================================================================*/
//     /* Constructor                                                                */
//     /*============================================================================*/
//
//     /**
//      * Creates a new Package Filter
//      * @param requiredPackage
//      * @param anyOfPackages
//      * @param noneOfPackages
//      */
//     constructor( requiredPackage: string, anyOfPackages: string[], noneOfPackages: string[]) {
//         this._requirePackage = requiredPackage;
//         this._anyOfPackages = anyOfPackages;
//         this._noneOfPackages = noneOfPackages;
//         this._anyOfPackages.sort(this.stringSort);
//         this._noneOfPackages.sort(this.stringSort);
//     }
//
//     /*============================================================================*/
//     /* Public Functions                                                           */
//     /*============================================================================*/
//
//     /**
//      * @inheritDoc
//      */
//     public matches(item: any): boolean {
//         var fqcn: string = getQualifiedClassName(item);
//         var packageName: string;
//
//         if (this._requirePackage && (!this.matchPackageInFQCN(this._requirePackage, fqcn)))
//             return false;
//
//         for each (packageName in this._noneOfPackages) {
//             if (this.matchPackageInFQCN(packageName, fqcn))
//                 return false;
//         }
//
//         for each (packageName in this._anyOfPackages) {
//             if (this.matchPackageInFQCN(packageName, fqcn))
//                 return true;
//         }
//         if (this._anyOfPackages.length > 0)
//             return false;
//
//         if (this._requirePackage)
//             return true;
//
//         if (this._noneOfPackages.length > 0)
//             return true;
//
//         return false;
//     }
//
//     /*============================================================================*/
//     /* Protected Functions                                                        */
//     /*============================================================================*/
//
//     protected stringSort(item1: string, item2: string): number {
//         if (item1 > item2) {
//             return 1;
//         }
//         return -1;
//     }
//
//     /*============================================================================*/
//     /* Private Functions                                                          */
//     /*============================================================================*/
//
//     private createDescriptor(): string {
//         return "require: " + this._requirePackage
//         + ", any of: " + this._anyOfPackages.toString()
//         + ", none of: " + this._noneOfPackages.toString();
//     }
//
//     private matchPackageInFQCN(packageName: string, fqcn: string): boolean {
//         return (fqcn.indexOf(packageName) == 0)
//     }
// }
