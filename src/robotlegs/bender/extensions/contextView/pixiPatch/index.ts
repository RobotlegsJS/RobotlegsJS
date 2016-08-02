//
// Patch PIXI to emit "added"/"removed" events on global event dispatcher
//

import "./eventemitter3-patch";
import PIXI = require('pixi.js');

export function applyPixiPatch (interaction: any) {

    let addChild = PIXI.Container.prototype.addChild;
    let addChildAt = PIXI.Container.prototype.addChildAt;
    let removeChild = PIXI.Container.prototype.removeChild;
    let removeChildAt = PIXI.Container.prototype.removeChildAt;

    PIXI.Container.prototype.addChild = function(...child): PIXI.DisplayObject {
        for (var i = 0, len = child.length; i < len; i++) {
            addChild.call(this, child[i]);
            interaction.emit("added", { target: child[i] })
        }
        return this;
    }

    PIXI.Container.prototype.addChildAt = function(child, index): PIXI.DisplayObject  {
        addChildAt.call(this, child);
        interaction.emit("added", { target: child })
        return this;
    }

    PIXI.Container.prototype.removeChild = function(...child): PIXI.DisplayObject  {
        for (var i = 0, len = child.length; i < len; i++) {
            removeChild.call(this, child[i]);
            interaction.emit("removed", { target: child })
        }
        return this;
    }

    PIXI.Container.prototype.removeChildAt = function(index): PIXI.DisplayObject  {
        removeChildAt.call(this, index);
        interaction.emit("removed", { target: this.getChildAt(index) });
        return this;
    }

}

