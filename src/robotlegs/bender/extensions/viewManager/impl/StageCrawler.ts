// ------------------------------------------------------------------------------
//  Copyright (c) 2009-2013 the original author or authors. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ContainerBinding } from "./ContainerBinding";

/**
 * @private
 */
export class StageCrawler {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _binding: ContainerBinding;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(containerBinding: ContainerBinding) {
        this._binding = containerBinding;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public scan(view: any): void {
        this.scanContainer(view);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private scanContainer(container: any): void {
        this.processView(container);
        var numChildren: number = container.numChildren;
        for (var i: number = 0; i < numChildren; i++) {
            // TODO: abstract view layer (pixi.js/three.js)
            var child: any = container.getChildAt(i);
            child['addChild'] // is a container?
                ? this.scanContainer(<any>child)
                : this.processView(child);
        }
    }

    private processView(view: any): void {
        this._binding.handleView(view, view['constructor']);
    }
}
