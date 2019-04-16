/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
export class EntityDispatcherDefaultOptions {
    constructor() {
        /**
         * True if added entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticAdd = false;
        /**
         * True if deleted entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticDelete = true;
        /**
         * True if updated entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticUpdate = false;
        /**
         * True if upsert entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticUpsert = false;
        /**
         * True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically.
         */
        this.optimisticSaveEntities = false;
    }
}
EntityDispatcherDefaultOptions.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * True if added entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticAdd;
    /**
     * True if deleted entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticDelete;
    /**
     * True if updated entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticUpdate;
    /**
     * True if upsert entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticUpsert;
    /**
     * True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticSaveEntities;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7OztBQVUzQyxNQUFNLE9BQU8sOEJBQThCO0lBRDNDOzs7O1FBR0Usa0JBQWEsR0FBRyxLQUFLLENBQUM7Ozs7UUFFdEIscUJBQWdCLEdBQUcsSUFBSSxDQUFDOzs7O1FBRXhCLHFCQUFnQixHQUFHLEtBQUssQ0FBQzs7OztRQUV6QixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7Ozs7UUFFekIsMkJBQXNCLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLENBQUM7OztZQVpBLFVBQVU7Ozs7Ozs7SUFHVCx1REFBc0I7Ozs7O0lBRXRCLDBEQUF3Qjs7Ozs7SUFFeEIsMERBQXlCOzs7OztJQUV6QiwwREFBeUI7Ozs7O0lBRXpCLGdFQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciBFbnRpdHlEaXNwYXRjaGVyIGJlaGF2aW9yXG4gKiBzdWNoIGFzIHdoZXRoZXIgYGFkZCgpYCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gKiBBbiBvcHRpbWlzdGljIHNhdmUgbW9kaWZpZXMgdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHkgYW5kIGJlZm9yZSBzYXZpbmcgdG8gdGhlIHNlcnZlci5cbiAqIEEgcGVzc2ltaXN0aWMgc2F2ZSBtb2RpZmllcyB0aGUgY29sbGVjdGlvbiBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHRoZSBzYXZlIHdhcyBzdWNjZXNzZnVsLlxuICogVGhpcyBjbGFzcyBpbml0aWFsaXplcyB0aGUgZGVmYXVsdHMgdG8gdGhlIHNhZmVzdCB2YWx1ZXMuXG4gKiBQcm92aWRlIGFuIGFsdGVybmF0aXZlIHRvIGNoYW5nZSB0aGUgZGVmYXVsdHMgZm9yIGFsbCBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMge1xuICAvKiogVHJ1ZSBpZiBhZGRlZCBlbnRpdGllcyBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY0FkZCA9IGZhbHNlO1xuICAvKiogVHJ1ZSBpZiBkZWxldGVkIGVudGl0aWVzIGFyZSBzYXZlZCBvcHRpbWlzdGljYWxseTsgZmFsc2UgaWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LiAqL1xuICBvcHRpbWlzdGljRGVsZXRlID0gdHJ1ZTtcbiAgLyoqIFRydWUgaWYgdXBkYXRlZCBlbnRpdGllcyBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY1VwZGF0ZSA9IGZhbHNlO1xuICAvKiogVHJ1ZSBpZiB1cHNlcnQgZW50aXRpZXMgYXJlIHNhdmVkIG9wdGltaXN0aWNhbGx5OyBmYWxzZSBpZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHkuICovXG4gIG9wdGltaXN0aWNVcHNlcnQgPSBmYWxzZTtcbiAgLyoqIFRydWUgaWYgZW50aXRpZXMgaW4gYSBjYWNoZSBzYXZlRW50aXRpZXMgcmVxdWVzdCBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY1NhdmVFbnRpdGllcyA9IGZhbHNlO1xufVxuIl19