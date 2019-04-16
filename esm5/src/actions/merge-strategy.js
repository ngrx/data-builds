/** How to merge an entity, after query or save, when the corresponding entity in the collection has unsaved changes. */
export var MergeStrategy;
(function (MergeStrategy) {
    /**
     * Update the collection entities and ignore all change tracking for this operation.
     * ChangeState is untouched.
     */
    MergeStrategy[MergeStrategy["IgnoreChanges"] = 0] = "IgnoreChanges";
    /**
     * Updates current values for unchanged entities.
     * If entities are changed, preserves their current values and
     * overwrites their originalValue with the merge entity.
     * This is the query-success default.
     */
    MergeStrategy[MergeStrategy["PreserveChanges"] = 1] = "PreserveChanges";
    /**
     * Replace the current collection entities.
     * Discards the ChangeState for the merged entities if set
     * and their ChangeTypes becomes "unchanged".
     * This is the save-success default.
     */
    MergeStrategy[MergeStrategy["OverwriteChanges"] = 2] = "OverwriteChanges";
})(MergeStrategy || (MergeStrategy = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsd0hBQXdIO0FBQ3hILE1BQU0sQ0FBTixJQUFZLGFBb0JYO0FBcEJELFdBQVksYUFBYTtJQUN2Qjs7O09BR0c7SUFDSCxtRUFBYSxDQUFBO0lBQ2I7Ozs7O09BS0c7SUFDSCx1RUFBZSxDQUFBO0lBQ2Y7Ozs7O09BS0c7SUFDSCx5RUFBZ0IsQ0FBQTtBQUNsQixDQUFDLEVBcEJXLGFBQWEsS0FBYixhQUFhLFFBb0J4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBIb3cgdG8gbWVyZ2UgYW4gZW50aXR5LCBhZnRlciBxdWVyeSBvciBzYXZlLCB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgdW5zYXZlZCBjaGFuZ2VzLiAqL1xuZXhwb3J0IGVudW0gTWVyZ2VTdHJhdGVneSB7XG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGNvbGxlY3Rpb24gZW50aXRpZXMgYW5kIGlnbm9yZSBhbGwgY2hhbmdlIHRyYWNraW5nIGZvciB0aGlzIG9wZXJhdGlvbi5cbiAgICogQ2hhbmdlU3RhdGUgaXMgdW50b3VjaGVkLlxuICAgKi9cbiAgSWdub3JlQ2hhbmdlcyxcbiAgLyoqXG4gICAqIFVwZGF0ZXMgY3VycmVudCB2YWx1ZXMgZm9yIHVuY2hhbmdlZCBlbnRpdGllcy5cbiAgICogSWYgZW50aXRpZXMgYXJlIGNoYW5nZWQsIHByZXNlcnZlcyB0aGVpciBjdXJyZW50IHZhbHVlcyBhbmRcbiAgICogb3ZlcndyaXRlcyB0aGVpciBvcmlnaW5hbFZhbHVlIHdpdGggdGhlIG1lcmdlIGVudGl0eS5cbiAgICogVGhpcyBpcyB0aGUgcXVlcnktc3VjY2VzcyBkZWZhdWx0LlxuICAgKi9cbiAgUHJlc2VydmVDaGFuZ2VzLFxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgY3VycmVudCBjb2xsZWN0aW9uIGVudGl0aWVzLlxuICAgKiBEaXNjYXJkcyB0aGUgQ2hhbmdlU3RhdGUgZm9yIHRoZSBtZXJnZWQgZW50aXRpZXMgaWYgc2V0XG4gICAqIGFuZCB0aGVpciBDaGFuZ2VUeXBlcyBiZWNvbWVzIFwidW5jaGFuZ2VkXCIuXG4gICAqIFRoaXMgaXMgdGhlIHNhdmUtc3VjY2VzcyBkZWZhdWx0LlxuICAgKi9cbiAgT3ZlcndyaXRlQ2hhbmdlcyxcbn1cbiJdfQ==