// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

// Possibly not needed on TypeScript

// namespace robotlegs.bender.extensions.matching{
//
//     import IllegalOperationError = flash.errors.IllegalOperationError;
//
//     /**
//      * A Package Matcher matches types in a given package
//      */
//     export class PackageMatcher implements ITypeMatcher {
//
//         /*============================================================================*/
//         /* Protected Properties                                                       */
//         /*============================================================================*/
//
//         protected _anyOfPackages: string[] = new Array<string>();
//
//         protected _noneOfPackages: string[] = new Array<string>();
//
//         protected _requirePackage: string;
//
//         protected _typeFilter: ITypeFilter;
//
//         /*============================================================================*/
//         /* Public Functions                                                           */
//         /*============================================================================*/
//
//         /**
//          * @inheritDoc
//          */
//         public createTypeFilter(): ITypeFilter {
//             return this._typeFilter ||this.= this.buildTypeFilter();
//         }
//
//         /**
//          * The full package that is required
//          * @param fullPackage
//          * @return Self
//          */
//         public require(fullPackage: string): PackageMatcher {
//             if (this._typeFilter)
//                 this.throwSealedMatcherError();
//
//             if (this._requirePackage)
//                 throw new IllegalOperationError('You can only set one required package on this PackageMatcher (two non-nested packages cannot both be required, and nested packages are redundant.)');
//
//             this._requirePackage = fullPackage;
//             return this;
//         }
//
//         /**
//          * Any packages that an item might be declared
//          */
//         public anyOf(... packages): PackageMatcher {
//             this.pushAddedPackagesTo(packages, this._anyOfPackages);
//             return this;
//         }
//
//         /**
//          * Packages that an item must not live in
//          */
//         public noneOf(... packages): PackageMatcher {
//             this.pushAddedPackagesTo(packages, this._noneOfPackages);
//             return this;
//         }
//
//         /**
//          * Locks this matcher
//          */
//         public lock(): void {
//             this.createTypeFilter();
//         }
//
//         /*============================================================================*/
//         /* Protected Functions                                                        */
//         /*============================================================================*/
//
//         protected buildTypeFilter(): ITypeFilter {
//             if (((!this._requirePackage) || this._requirePackage.length == 0) &&
//                 (this._anyOfPackages.length == 0) &&
//                 (this._noneOfPackages.length == 0)) {
//                 throw new TypeMatcherError(this.TypeMatcherError.EMPTY_MATCHER);
//             }
//             return new PackageFilter(this._requirePackage, this._anyOfPackages, this._noneOfPackages);
//         }
//
//         protected pushAddedPackagesTo(packages: any[], targetSet: string[]): void {
//             this._typeFilter && this.throwSealedMatcherError();
//
//             this.pushValuesToStringVector(packages, targetSet);
//         }
//
//         protected throwSealedMatcherError(): void {
//             throw new IllegalOperationError('This TypeMatcher has been sealed and can no longer be configured');
//         }
//
//         protected pushValuesToStringVector(values: any[], vector: string[]): void {
//             if (values.length == 1
//                 && (values[0] instanceof Array || values[0] instanceof string[])) {
//                 for each (var packageName: string in values[0]) {
//                     vector.push(packageName);
//                 }
//             }
//             else {
//                 for each (packageName in values) {
//                     vector.push(packageName);
//                 }
//             }
//         }
//     }
// }
