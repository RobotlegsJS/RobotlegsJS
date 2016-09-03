// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * @private
 */
export interface ICommandTrigger {
    /**
     * Invoked when the trigger should be activated.
     *
     * <p>Use this to add event listeners or Signal handlers.</p>
     */
    activate(): void;

    /**
     * Invoked when the trigger should be deactivated.
     *
     * <p>Use this to remove event listeners or Signal handlers.</p>
     */
    deactivate(): void;
}
