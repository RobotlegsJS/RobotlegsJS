// ------------------------------------------------------------------------------
//  Copyright (c) 2011 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IGuard } from "../../../../../../src/robotlegs/bender/framework/api/IGuard";

export class HappyGuard implements IGuard {
    public approve(): boolean {
        return true;
    }
}
