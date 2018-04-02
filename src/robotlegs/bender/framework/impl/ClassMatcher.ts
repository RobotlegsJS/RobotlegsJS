import { IMatcher } from "../api/IMatcher";

/**
 * @private
 */
export class ClassMatcher implements IMatcher {
    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public matches(item: any): boolean {
        return typeof item === "function";
    }
}
