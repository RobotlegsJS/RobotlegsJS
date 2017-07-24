// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { interfaces } from "inversify";

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * Instantiate a object inside the context of the injector without keeping it for future requests.
 * All injections of the object will be provided by the injector, but the injector will not keep
 * a reference of the object for future requests.
 *
 * @param injector An injector
 * @param type A object that must be instantiated
 */
export function instantiateUnmapped<T>(injector: interfaces.Container, type: interfaces.Newable<T>): T {
    injector.bind(type).to(type);
    let instance: T = injector.get<T>(type);
    injector.unbind(type);
    return instance;
}
