(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/merge-strategy", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** How to merge an entity, after query or save, when the corresponding entity in the collection has unsaved changes. */
    var MergeStrategy;
    (function (MergeStrategy) {
        /**
         * Update the collection entities and ignore all change tracking for this operation.
         * Each entity's `changeState` is untouched.
         */
        MergeStrategy[MergeStrategy["IgnoreChanges"] = 0] = "IgnoreChanges";
        /**
         * Updates current values for unchanged entities.
         * For each changed entity it preserves the current value and overwrites the `originalValue` with the merge entity.
         * This is the query-success default.
         */
        MergeStrategy[MergeStrategy["PreserveChanges"] = 1] = "PreserveChanges";
        /**
         * Replace the current collection entities.
         * For each merged entity it discards the `changeState` and sets the `changeType` to "unchanged".
         * This is the save-success default.
         */
        MergeStrategy[MergeStrategy["OverwriteChanges"] = 2] = "OverwriteChanges";
    })(MergeStrategy = exports.MergeStrategy || (exports.MergeStrategy = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSx3SEFBd0g7SUFDeEgsSUFBWSxhQWtCWDtJQWxCRCxXQUFZLGFBQWE7UUFDdkI7OztXQUdHO1FBQ0gsbUVBQWEsQ0FBQTtRQUNiOzs7O1dBSUc7UUFDSCx1RUFBZSxDQUFBO1FBQ2Y7Ozs7V0FJRztRQUNILHlFQUFnQixDQUFBO0lBQ2xCLENBQUMsRUFsQlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFrQnhCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEhvdyB0byBtZXJnZSBhbiBlbnRpdHksIGFmdGVyIHF1ZXJ5IG9yIHNhdmUsIHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyB1bnNhdmVkIGNoYW5nZXMuICovXG5leHBvcnQgZW51bSBNZXJnZVN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgY29sbGVjdGlvbiBlbnRpdGllcyBhbmQgaWdub3JlIGFsbCBjaGFuZ2UgdHJhY2tpbmcgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgKiBFYWNoIGVudGl0eSdzIGBjaGFuZ2VTdGF0ZWAgaXMgdW50b3VjaGVkLlxuICAgKi9cbiAgSWdub3JlQ2hhbmdlcyxcbiAgLyoqXG4gICAqIFVwZGF0ZXMgY3VycmVudCB2YWx1ZXMgZm9yIHVuY2hhbmdlZCBlbnRpdGllcy5cbiAgICogRm9yIGVhY2ggY2hhbmdlZCBlbnRpdHkgaXQgcHJlc2VydmVzIHRoZSBjdXJyZW50IHZhbHVlIGFuZCBvdmVyd3JpdGVzIHRoZSBgb3JpZ2luYWxWYWx1ZWAgd2l0aCB0aGUgbWVyZ2UgZW50aXR5LlxuICAgKiBUaGlzIGlzIHRoZSBxdWVyeS1zdWNjZXNzIGRlZmF1bHQuXG4gICAqL1xuICBQcmVzZXJ2ZUNoYW5nZXMsXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSBjdXJyZW50IGNvbGxlY3Rpb24gZW50aXRpZXMuXG4gICAqIEZvciBlYWNoIG1lcmdlZCBlbnRpdHkgaXQgZGlzY2FyZHMgdGhlIGBjaGFuZ2VTdGF0ZWAgYW5kIHNldHMgdGhlIGBjaGFuZ2VUeXBlYCB0byBcInVuY2hhbmdlZFwiLlxuICAgKiBUaGlzIGlzIHRoZSBzYXZlLXN1Y2Nlc3MgZGVmYXVsdC5cbiAgICovXG4gIE92ZXJ3cml0ZUNoYW5nZXMsXG59XG4iXX0=