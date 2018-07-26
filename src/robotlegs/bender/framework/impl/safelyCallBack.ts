// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/*============================================================================*/
/* Public Functions                                                           */
/*============================================================================*/

/**
 * <p>Helper function to call any of the 3 forms of eventual callback: </p>
 *
 * <code>(), (error) and (error, message)</code>
 *
 * <p>NOTE: This helper will not handle null callbacks. You should check
 * if the callback is null from the calling location: </p>
 *
 * <code>callback &amp;&amp; safelyCallBack(callback, error, message);</code>
 *
 * <p>This prevents the overhead of calling safelyCallBack()
 * when there is no callback to call. Likewise it reduces the overhead
 * of a null check in safelyCallBack().</p>
 *
 * <p>QUESTION: Is this too harsh? Should we protect from null?</p>
 *
 * @param callback The actual callback
 * @param error An optional error
 * @param message An optional message
 */
export function safelyCallBack(callback: Function, error?: any, message?: any): void {
    if (callback.length === 0) {
        callback();
    } else if (callback.length === 1) {
        callback(error);
    } else if (callback.length === 2) {
        callback(error, message);
    } else {
        throw new TypeError("Callback function accepts more than two parameters.");
    }
}
