// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../api/IContext";
import { ILogger } from "../api/ILogger";

/**
 * Installs custom extensions into a given context
 *
 * @private
 */
export class ExtensionInstaller {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _classes: Map<any, any> = new Map<any, any>();

    private _context: IContext;

    private _logger: ILogger;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(context: IContext) {
        this._context = context;
        this._logger = this._context.getLogger(this);
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Installs the supplied extension
     * @param extension An object or class implementing IExtension
     */
    public install(extension: any): void {
        if (typeof (extension) === "function") {
            if (!this._classes[extension]) {
                this.install(new extension);
            }
        } else {
            let extensionClass: any = <any>extension.constructor;
            if (!this._classes[extensionClass]) {
                this._logger.debug("Installing extension {0}", [extension]);
                this._classes[extensionClass] = true;
                extension.extend(this._context);
            }
        }
    }

    /**
     * Destroy
     */
    public destroy(): void {
        for (let extensionClass in this._classes) {
            if (this._classes.hasOwnProperty(extensionClass)) {
                delete this._classes[extensionClass];
            }
        }
    }
}
