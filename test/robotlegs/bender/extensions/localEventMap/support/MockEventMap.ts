// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { DomEventMapConfig } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/DomEventMapConfig";
import { EventMap } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/EventMap";
import { EventMapConfig } from "../../../../../../src/robotlegs/bender/extensions/localEventMap/impl/EventMapConfig";

/**
 * Custom Event
 * @private
 */
export class MockEventMap extends EventMap {
    public get listeners(): EventMapConfig[] {
        return this._listeners;
    }

    public get suspendedListeners(): EventMapConfig[] {
        return this._suspendedListeners;
    }

    public get domListeners(): DomEventMapConfig[] {
        return this._domListeners;
    }

    public get suspendedDomListeners(): DomEventMapConfig[] {
        return this._suspendedDomListeners;
    }

    public get suspended(): boolean {
        return this._suspended;
    }
}
