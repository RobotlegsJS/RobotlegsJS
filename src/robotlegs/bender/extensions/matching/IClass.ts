// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

export type INewable<T> = new (...args: any[]) => T;
export type ISymbol = (description?: string | number) => Symbol;
export type IClass<T> = INewable<T> | ISymbol;
