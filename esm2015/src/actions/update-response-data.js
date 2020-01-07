/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/actions/update-response-data.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Data returned in an EntityAction from the EntityEffects for SAVE_UPDATE_ONE_SUCCESS.
 * Effectively extends Update<T> with a 'changed' flag.
 * The is true if the server sent back changes to the entity data after update.
 * Such changes must be in the entity data in changes property.
 * Default is false (server did not return entity data; assume it changed nothing).
 * See EntityEffects.
 * @record
 * @template T
 */
export function UpdateResponseData() { }
if (false) {
    /**
     * Original key (id) of the entity
     * @type {?}
     */
    UpdateResponseData.prototype.id;
    /**
     * Entity update data. Should include the key (original or changed)
     * @type {?}
     */
    UpdateResponseData.prototype.changes;
    /**
     * Whether the server made additional changes after processing the update.
     * Such additional changes should be in the 'changes' object.
     * Default is false
     * @type {?|undefined}
     */
    UpdateResponseData.prototype.changed;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXJlc3BvbnNlLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsd0NBV0M7Ozs7OztJQVRDLGdDQUFvQjs7Ozs7SUFFcEIscUNBQW9COzs7Ozs7O0lBTXBCLHFDQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGF0YSByZXR1cm5lZCBpbiBhbiBFbnRpdHlBY3Rpb24gZnJvbSB0aGUgRW50aXR5RWZmZWN0cyBmb3IgU0FWRV9VUERBVEVfT05FX1NVQ0NFU1MuXG4gKiBFZmZlY3RpdmVseSBleHRlbmRzIFVwZGF0ZTxUPiB3aXRoIGEgJ2NoYW5nZWQnIGZsYWcuXG4gKiBUaGUgaXMgdHJ1ZSBpZiB0aGUgc2VydmVyIHNlbnQgYmFjayBjaGFuZ2VzIHRvIHRoZSBlbnRpdHkgZGF0YSBhZnRlciB1cGRhdGUuXG4gKiBTdWNoIGNoYW5nZXMgbXVzdCBiZSBpbiB0aGUgZW50aXR5IGRhdGEgaW4gY2hhbmdlcyBwcm9wZXJ0eS5cbiAqIERlZmF1bHQgaXMgZmFsc2UgKHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YTsgYXNzdW1lIGl0IGNoYW5nZWQgbm90aGluZykuXG4gKiBTZWUgRW50aXR5RWZmZWN0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVSZXNwb25zZURhdGE8VD4ge1xuICAvKiogT3JpZ2luYWwga2V5IChpZCkgb2YgdGhlIGVudGl0eSAqL1xuICBpZDogbnVtYmVyIHwgc3RyaW5nO1xuICAvKiogRW50aXR5IHVwZGF0ZSBkYXRhLiBTaG91bGQgaW5jbHVkZSB0aGUga2V5IChvcmlnaW5hbCBvciBjaGFuZ2VkKSAqL1xuICBjaGFuZ2VzOiBQYXJ0aWFsPFQ+O1xuICAvKipcbiAgICogV2hldGhlciB0aGUgc2VydmVyIG1hZGUgYWRkaXRpb25hbCBjaGFuZ2VzIGFmdGVyIHByb2Nlc3NpbmcgdGhlIHVwZGF0ZS5cbiAgICogU3VjaCBhZGRpdGlvbmFsIGNoYW5nZXMgc2hvdWxkIGJlIGluIHRoZSAnY2hhbmdlcycgb2JqZWN0LlxuICAgKiBEZWZhdWx0IGlzIGZhbHNlXG4gICAqL1xuICBjaGFuZ2VkPzogYm9vbGVhbjtcbn1cbiJdfQ==