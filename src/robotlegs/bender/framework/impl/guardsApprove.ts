// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IInjector } from "../api/IInjector";

import { instantiateUnmapped } from "./instantiateUnmapped";

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * <p>A guard can be a function, object or class.</p>
 *
 * <p>When a function is provided it is expected to return a Boolean when called.</p>
 *
 * <p>When an object is provided it is expected to expose an "approve" method
 * that returns a Boolean.</p>
 *
 * <p>When a class is provided, an instance of that class will be instantiated and tested.
 * If an injector is provided the instance will be created using that injector,
 * otherwise the instance will be created manually.</p>
 *
 * @param guards An array of guards
 * @param injector An optional Injector
 *
 * @return A Boolean value of false if any guard returns false
 */
export function guardsApprove(guards: any[], injector?: IInjector): boolean {
    for (let i = 0; i < guards.length; i++) {
        let guard: any = guards[i];

        if ((typeof (guard) === "function") && (guard.prototype.approve === undefined)) {
            if ((<Function>guard)()) {
                continue;
            }
            return false;
        }

        if ((typeof (guard) === "function") && (guard.prototype.approve !== undefined)) {
            guard = injector ? instantiateUnmapped(injector, guard) : new guard();
        }

        if (!guard.approve()) {
            return false;
        }
    }

    return true;
}
