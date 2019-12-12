/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBRUU7OztPQUdHO0lBQ0gsZ0JBQWE7SUFDYjs7OztPQUlHO0lBQ0gsa0JBQWU7SUFDZjs7OztPQUlHO0lBQ0gsbUJBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEhvdyB0byBtZXJnZSBhbiBlbnRpdHksIGFmdGVyIHF1ZXJ5IG9yIHNhdmUsIHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyB1bnNhdmVkIGNoYW5nZXMuICovXG5leHBvcnQgZW51bSBNZXJnZVN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgY29sbGVjdGlvbiBlbnRpdGllcyBhbmQgaWdub3JlIGFsbCBjaGFuZ2UgdHJhY2tpbmcgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgKiBFYWNoIGVudGl0eSdzIGBjaGFuZ2VTdGF0ZWAgaXMgdW50b3VjaGVkLlxuICAgKi9cbiAgSWdub3JlQ2hhbmdlcyxcbiAgLyoqXG4gICAqIFVwZGF0ZXMgY3VycmVudCB2YWx1ZXMgZm9yIHVuY2hhbmdlZCBlbnRpdGllcy5cbiAgICogRm9yIGVhY2ggY2hhbmdlZCBlbnRpdHkgaXQgcHJlc2VydmVzIHRoZSBjdXJyZW50IHZhbHVlIGFuZCBvdmVyd3JpdGVzIHRoZSBgb3JpZ2luYWxWYWx1ZWAgd2l0aCB0aGUgbWVyZ2UgZW50aXR5LlxuICAgKiBUaGlzIGlzIHRoZSBxdWVyeS1zdWNjZXNzIGRlZmF1bHQuXG4gICAqL1xuICBQcmVzZXJ2ZUNoYW5nZXMsXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSBjdXJyZW50IGNvbGxlY3Rpb24gZW50aXRpZXMuXG4gICAqIEZvciBlYWNoIG1lcmdlZCBlbnRpdHkgaXQgZGlzY2FyZHMgdGhlIGBjaGFuZ2VTdGF0ZWAgYW5kIHNldHMgdGhlIGBjaGFuZ2VUeXBlYCB0byBcInVuY2hhbmdlZFwiLlxuICAgKiBUaGlzIGlzIHRoZSBzYXZlLXN1Y2Nlc3MgZGVmYXVsdC5cbiAgICovXG4gIE92ZXJ3cml0ZUNoYW5nZXMsXG59XG4iXX0=