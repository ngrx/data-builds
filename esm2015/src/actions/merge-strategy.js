/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/actions/merge-strategy.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const MergeStrategy = {
    /**
     * Update the collection entities and ignore all change tracking for this operation.
     * Each entity's `changeState` is untouched.
     */
    IgnoreChanges: 0,
    /**
     * Updates current values for unchanged entities.
     * For each changed entity it preserves the current value and overwrites the `originalValue` with the merge entity.
     * This is the query-success default.
     */
    PreserveChanges: 1,
    /**
     * Replace the current collection entities.
     * For each merged entity it discards the `changeState` and sets the `changeType` to "unchanged".
     * This is the save-success default.
     */
    OverwriteChanges: 2,
};
export { MergeStrategy };
MergeStrategy[MergeStrategy.IgnoreChanges] = 'IgnoreChanges';
MergeStrategy[MergeStrategy.PreserveChanges] = 'PreserveChanges';
MergeStrategy[MergeStrategy.OverwriteChanges] = 'OverwriteChanges';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsTUFBWSxhQUFhO0lBQ3ZCOzs7T0FHRztJQUNILGFBQWEsR0FBQTtJQUNiOzs7O09BSUc7SUFDSCxlQUFlLEdBQUE7SUFDZjs7OztPQUlHO0lBQ0gsZ0JBQWdCLEdBQUE7RUFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogSG93IHRvIG1lcmdlIGFuIGVudGl0eSwgYWZ0ZXIgcXVlcnkgb3Igc2F2ZSwgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIHVuc2F2ZWQgY2hhbmdlcy4gKi9cbmV4cG9ydCBlbnVtIE1lcmdlU3RyYXRlZ3kge1xuICAvKipcbiAgICogVXBkYXRlIHRoZSBjb2xsZWN0aW9uIGVudGl0aWVzIGFuZCBpZ25vcmUgYWxsIGNoYW5nZSB0cmFja2luZyBmb3IgdGhpcyBvcGVyYXRpb24uXG4gICAqIEVhY2ggZW50aXR5J3MgYGNoYW5nZVN0YXRlYCBpcyB1bnRvdWNoZWQuXG4gICAqL1xuICBJZ25vcmVDaGFuZ2VzLFxuICAvKipcbiAgICogVXBkYXRlcyBjdXJyZW50IHZhbHVlcyBmb3IgdW5jaGFuZ2VkIGVudGl0aWVzLlxuICAgKiBGb3IgZWFjaCBjaGFuZ2VkIGVudGl0eSBpdCBwcmVzZXJ2ZXMgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIG92ZXJ3cml0ZXMgdGhlIGBvcmlnaW5hbFZhbHVlYCB3aXRoIHRoZSBtZXJnZSBlbnRpdHkuXG4gICAqIFRoaXMgaXMgdGhlIHF1ZXJ5LXN1Y2Nlc3MgZGVmYXVsdC5cbiAgICovXG4gIFByZXNlcnZlQ2hhbmdlcyxcbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIGN1cnJlbnQgY29sbGVjdGlvbiBlbnRpdGllcy5cbiAgICogRm9yIGVhY2ggbWVyZ2VkIGVudGl0eSBpdCBkaXNjYXJkcyB0aGUgYGNoYW5nZVN0YXRlYCBhbmQgc2V0cyB0aGUgYGNoYW5nZVR5cGVgIHRvIFwidW5jaGFuZ2VkXCIuXG4gICAqIFRoaXMgaXMgdGhlIHNhdmUtc3VjY2VzcyBkZWZhdWx0LlxuICAgKi9cbiAgT3ZlcndyaXRlQ2hhbmdlcyxcbn1cbiJdfQ==