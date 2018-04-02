import { IMatcher } from "../api/IMatcher";

/**
 * @private
 */
export class ObjectMatcher implements IMatcher {
    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public matches(item: any): boolean {
        return typeof item === "object";
    }
}
