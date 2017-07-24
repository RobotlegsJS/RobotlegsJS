// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
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
 * <p>A hook can be a function, object or class.</p>
 *
 * <p>When an object is passed it is expected to expose a "hook" method.</p>
 *
 * <p>When a class is passed, an instance of that class will be instantiated and called.
 * If an injector is provided the instance will be created using that injector,
 * otherwise the instance will be created manually.</p>
 *
 * @param hooks An array of hooks
 * @param injector An optional Injector
 */
export function applyHooks(hooks: any[], injector?: IInjector): void {
    for (let i = 0; i < hooks.length; i++) {
        let hook: any = hooks[i];

        if ((typeof (hook) === "function") && (hook.prototype.hook === undefined)) {
            (<Function>hook)();
            continue;
        }

        if ((typeof (hook) === "function") && (hook.prototype.hook !== undefined)) {
            hook = injector ? instantiateUnmapped(injector, hook) : new hook();
        }

        hook.hook();
    }
}
