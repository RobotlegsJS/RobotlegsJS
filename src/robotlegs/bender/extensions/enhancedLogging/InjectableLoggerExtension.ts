// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../../framework/api/IContext";
import { IExtension } from "../../framework/api/IExtension";
import { ILogger } from "../../framework/api/ILogger";

/**
 * Allows you to @inject unique loggers into your objects.
 *
 * There are two ways to inject the logger on the constructor of your class:
 *
 * * Using the literal string "ILogger":
 *
 * <code>
 *     constructor( @inject("ILogger") logger: ILogger ) { ... }
 * </code>
 *
 * * Using the ILogger Symbol:
 *
 * <code>
 *     constructor( @inject(ILogger) logger: ILogger ) { ... }
 * </code>
 */
export class InjectableLoggerExtension implements IExtension {

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public extend(context: IContext): void {
        // Map the literal string "ILogger"
        context.injector.bind<ILogger>("ILogger").toDynamicValue(() => {
            return context.getLogger(null);
        }).onActivation((ctx, logger) => {
            logger.source = ctx.plan.rootRequest.serviceIdentifier;
            return logger;
        });

        // Map the Symbol ILogger
        context.injector.bind<ILogger>(ILogger).toDynamicValue(() => {
            return context.getLogger(null);
        }).onActivation((ctx, logger) => {
            logger.source = ctx.plan.rootRequest.serviceIdentifier;
            return logger;
        });
    }
}
