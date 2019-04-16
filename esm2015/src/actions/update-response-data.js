/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXJlc3BvbnNlLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFRQSx3Q0FXQzs7Ozs7O0lBVEMsZ0NBQW9COzs7OztJQUVwQixxQ0FBb0I7Ozs7Ozs7SUFNcEIscUNBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEYXRhIHJldHVybmVkIGluIGFuIEVudGl0eUFjdGlvbiBmcm9tIHRoZSBFbnRpdHlFZmZlY3RzIGZvciBTQVZFX1VQREFURV9PTkVfU1VDQ0VTUy5cbiAqIEVmZmVjdGl2ZWx5IGV4dGVuZHMgVXBkYXRlPFQ+IHdpdGggYSAnY2hhbmdlZCcgZmxhZy5cbiAqIFRoZSBpcyB0cnVlIGlmIHRoZSBzZXJ2ZXIgc2VudCBiYWNrIGNoYW5nZXMgdG8gdGhlIGVudGl0eSBkYXRhIGFmdGVyIHVwZGF0ZS5cbiAqIFN1Y2ggY2hhbmdlcyBtdXN0IGJlIGluIHRoZSBlbnRpdHkgZGF0YSBpbiBjaGFuZ2VzIHByb3BlcnR5LlxuICogRGVmYXVsdCBpcyBmYWxzZSAoc2VydmVyIGRpZCBub3QgcmV0dXJuIGVudGl0eSBkYXRhOyBhc3N1bWUgaXQgY2hhbmdlZCBub3RoaW5nKS5cbiAqIFNlZSBFbnRpdHlFZmZlY3RzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiB7XG4gIC8qKiBPcmlnaW5hbCBrZXkgKGlkKSBvZiB0aGUgZW50aXR5ICovXG4gIGlkOiBudW1iZXIgfCBzdHJpbmc7XG4gIC8qKiBFbnRpdHkgdXBkYXRlIGRhdGEuIFNob3VsZCBpbmNsdWRlIHRoZSBrZXkgKG9yaWdpbmFsIG9yIGNoYW5nZWQpICovXG4gIGNoYW5nZXM6IFBhcnRpYWw8VD47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzZXJ2ZXIgbWFkZSBhZGRpdGlvbmFsIGNoYW5nZXMgYWZ0ZXIgcHJvY2Vzc2luZyB0aGUgdXBkYXRlLlxuICAgKiBTdWNoIGFkZGl0aW9uYWwgY2hhbmdlcyBzaG91bGQgYmUgaW4gdGhlICdjaGFuZ2VzJyBvYmplY3QuXG4gICAqIERlZmF1bHQgaXMgZmFsc2VcbiAgICovXG4gIGNoYW5nZWQ/OiBib29sZWFuO1xufVxuIl19