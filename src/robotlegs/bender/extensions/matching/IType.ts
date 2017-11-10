// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IClass } from "./IClass";

export type ISymbol<T> = (description?: string | number) => T;
export type IType<T> = IClass<T> | ISymbol<T>;
