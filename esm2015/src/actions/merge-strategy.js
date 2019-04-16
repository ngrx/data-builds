/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const MergeStrategy = {
    /**
     * Update the collection entities and ignore all change tracking for this operation.
     * ChangeState is untouched.
     */
    IgnoreChanges: 0,
    /**
     * Updates current values for unchanged entities.
     * If entities are changed, preserves their current values and
     * overwrites their originalValue with the merge entity.
     * This is the query-success default.
     */
    PreserveChanges: 1,
    /**
     * Replace the current collection entities.
     * Discards the ChangeState for the merged entities if set
     * and their ChangeTypes becomes "unchanged".
     * This is the save-success default.
     */
    OverwriteChanges: 2,
};
export { MergeStrategy };
MergeStrategy[MergeStrategy.IgnoreChanges] = 'IgnoreChanges';
MergeStrategy[MergeStrategy.PreserveChanges] = 'PreserveChanges';
MergeStrategy[MergeStrategy.OverwriteChanges] = 'OverwriteChanges';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBRUU7OztPQUdHO0lBQ0gsZ0JBQWE7SUFDYjs7Ozs7T0FLRztJQUNILGtCQUFlO0lBQ2Y7Ozs7O09BS0c7SUFDSCxtQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogSG93IHRvIG1lcmdlIGFuIGVudGl0eSwgYWZ0ZXIgcXVlcnkgb3Igc2F2ZSwgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIHVuc2F2ZWQgY2hhbmdlcy4gKi9cbmV4cG9ydCBlbnVtIE1lcmdlU3RyYXRlZ3kge1xuICAvKipcbiAgICogVXBkYXRlIHRoZSBjb2xsZWN0aW9uIGVudGl0aWVzIGFuZCBpZ25vcmUgYWxsIGNoYW5nZSB0cmFja2luZyBmb3IgdGhpcyBvcGVyYXRpb24uXG4gICAqIENoYW5nZVN0YXRlIGlzIHVudG91Y2hlZC5cbiAgICovXG4gIElnbm9yZUNoYW5nZXMsXG4gIC8qKlxuICAgKiBVcGRhdGVzIGN1cnJlbnQgdmFsdWVzIGZvciB1bmNoYW5nZWQgZW50aXRpZXMuXG4gICAqIElmIGVudGl0aWVzIGFyZSBjaGFuZ2VkLCBwcmVzZXJ2ZXMgdGhlaXIgY3VycmVudCB2YWx1ZXMgYW5kXG4gICAqIG92ZXJ3cml0ZXMgdGhlaXIgb3JpZ2luYWxWYWx1ZSB3aXRoIHRoZSBtZXJnZSBlbnRpdHkuXG4gICAqIFRoaXMgaXMgdGhlIHF1ZXJ5LXN1Y2Nlc3MgZGVmYXVsdC5cbiAgICovXG4gIFByZXNlcnZlQ2hhbmdlcyxcbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIGN1cnJlbnQgY29sbGVjdGlvbiBlbnRpdGllcy5cbiAgICogRGlzY2FyZHMgdGhlIENoYW5nZVN0YXRlIGZvciB0aGUgbWVyZ2VkIGVudGl0aWVzIGlmIHNldFxuICAgKiBhbmQgdGhlaXIgQ2hhbmdlVHlwZXMgYmVjb21lcyBcInVuY2hhbmdlZFwiLlxuICAgKiBUaGlzIGlzIHRoZSBzYXZlLXN1Y2Nlc3MgZGVmYXVsdC5cbiAgICovXG4gIE92ZXJ3cml0ZUNoYW5nZXMsXG59XG4iXX0=