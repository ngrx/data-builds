/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/merge-strategy.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var MergeStrategy = {
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
//# sourceMappingURL=merge-strategy.js.map