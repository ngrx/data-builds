/** How to merge an entity, after query or save, when the corresponding entity in the collection has unsaved changes. */
export declare enum MergeStrategy {
    /**
     * Update the collection entities and ignore all change tracking for this operation.
     * ChangeState is untouched.
     */
    IgnoreChanges = 0,
    /**
     * Updates current values for unchanged entities.
     * If entities are changed, preserves their current values and
     * overwrites their originalValue with the merge entity.
     * This is the query-success default.
     */
    PreserveChanges = 1,
    /**
     * Replace the current collection entities.
     * Discards the ChangeState for the merged entities if set
     * and their ChangeTypes becomes "unchanged".
     * This is the save-success default.
     */
    OverwriteChanges = 2
}
