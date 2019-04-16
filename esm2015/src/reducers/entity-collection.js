/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const ChangeType = {
    /** The entity has not changed from its last known server state. */
    Unchanged: 0,
    /** The entity was added to the collection */
    Added: 1,
    /** The entity is scheduled for delete and was removed from the collection */
    Deleted: 2,
    /** The entity in the collection was updated */
    Updated: 3,
};
export { ChangeType };
ChangeType[ChangeType.Unchanged] = 'Unchanged';
ChangeType[ChangeType.Added] = 'Added';
ChangeType[ChangeType.Deleted] = 'Deleted';
ChangeType[ChangeType.Updated] = 'Updated';
/**
 * Change state for an entity with unsaved changes;
 * an entry in an EntityCollection.changeState map
 * @record
 * @template T
 */
export function ChangeState() { }
if (false) {
    /** @type {?} */
    ChangeState.prototype.changeType;
    /** @type {?|undefined} */
    ChangeState.prototype.originalValue;
}
/**
 * Data and information about a collection of entities of a single type.
 * EntityCollections are maintained in the EntityCache within the ngrx store.
 * @record
 * @template T
 */
export function EntityCollection() { }
if (false) {
    /**
     * Name of the entity type for this collection
     * @type {?}
     */
    EntityCollection.prototype.entityName;
    /**
     * A map of ChangeStates, keyed by id, for entities with unsaved changes
     * @type {?}
     */
    EntityCollection.prototype.changeState;
    /**
     * The user's current collection filter pattern
     * @type {?|undefined}
     */
    EntityCollection.prototype.filter;
    /**
     * true if collection was ever filled by QueryAll; forced false if cleared
     * @type {?}
     */
    EntityCollection.prototype.loaded;
    /**
     * true when a query or save operation is in progress
     * @type {?}
     */
    EntityCollection.prototype.loading;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUlFLG1FQUFtRTtJQUNuRSxZQUFhO0lBQ2IsNkNBQTZDO0lBQzdDLFFBQUs7SUFDTCw2RUFBNkU7SUFDN0UsVUFBTztJQUNQLCtDQUErQztJQUMvQyxVQUFPOzs7Ozs7Ozs7Ozs7O0FBT1QsaUNBR0M7OztJQUZDLGlDQUF1Qjs7SUFDdkIsb0NBQThCOzs7Ozs7OztBQWFoQyxzQ0FXQzs7Ozs7O0lBVEMsc0NBQW1COzs7OztJQUVuQix1Q0FBK0I7Ozs7O0lBRS9CLGtDQUFnQjs7Ozs7SUFFaEIsa0NBQWdCOzs7OztJQUVoQixtQ0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlTdGF0ZSwgRGljdGlvbmFyeSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbi8qKiBUeXBlcyBvZiBjaGFuZ2UgaW4gYSBDaGFuZ2VTdGF0ZSBpbnN0YW5jZSAqL1xuZXhwb3J0IGVudW0gQ2hhbmdlVHlwZSB7XG4gIC8qKiBUaGUgZW50aXR5IGhhcyBub3QgY2hhbmdlZCBmcm9tIGl0cyBsYXN0IGtub3duIHNlcnZlciBzdGF0ZS4gKi9cbiAgVW5jaGFuZ2VkID0gMCxcbiAgLyoqIFRoZSBlbnRpdHkgd2FzIGFkZGVkIHRvIHRoZSBjb2xsZWN0aW9uICovXG4gIEFkZGVkLFxuICAvKiogVGhlIGVudGl0eSBpcyBzY2hlZHVsZWQgZm9yIGRlbGV0ZSBhbmQgd2FzIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiAqL1xuICBEZWxldGVkLFxuICAvKiogVGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3YXMgdXBkYXRlZCAqL1xuICBVcGRhdGVkLFxufVxuXG4vKipcbiAqIENoYW5nZSBzdGF0ZSBmb3IgYW4gZW50aXR5IHdpdGggdW5zYXZlZCBjaGFuZ2VzO1xuICogYW4gZW50cnkgaW4gYW4gRW50aXR5Q29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSBtYXBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTdGF0ZTxUPiB7XG4gIGNoYW5nZVR5cGU6IENoYW5nZVR5cGU7XG4gIG9yaWdpbmFsVmFsdWU/OiBUIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIE1hcCBvZiBlbnRpdHkgcHJpbWFyeSBrZXlzIHRvIGVudGl0eSBDaGFuZ2VTdGF0ZXMuXG4gKiBFYWNoIGVudHJ5IHJlcHJlc2VudHMgYW4gZW50aXR5IHdpdGggdW5zYXZlZCBjaGFuZ2VzLlxuICovXG5leHBvcnQgdHlwZSBDaGFuZ2VTdGF0ZU1hcDxUPiA9IERpY3Rpb25hcnk8Q2hhbmdlU3RhdGU8VD4+O1xuXG4vKipcbiAqIERhdGEgYW5kIGluZm9ybWF0aW9uIGFib3V0IGEgY29sbGVjdGlvbiBvZiBlbnRpdGllcyBvZiBhIHNpbmdsZSB0eXBlLlxuICogRW50aXR5Q29sbGVjdGlvbnMgYXJlIG1haW50YWluZWQgaW4gdGhlIEVudGl0eUNhY2hlIHdpdGhpbiB0aGUgbmdyeCBzdG9yZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uPFQgPSBhbnk+IGV4dGVuZHMgRW50aXR5U3RhdGU8VD4ge1xuICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgY29sbGVjdGlvbiAqL1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIC8qKiBBIG1hcCBvZiBDaGFuZ2VTdGF0ZXMsIGtleWVkIGJ5IGlkLCBmb3IgZW50aXRpZXMgd2l0aCB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgY2hhbmdlU3RhdGU6IENoYW5nZVN0YXRlTWFwPFQ+O1xuICAvKiogVGhlIHVzZXIncyBjdXJyZW50IGNvbGxlY3Rpb24gZmlsdGVyIHBhdHRlcm4gKi9cbiAgZmlsdGVyPzogc3RyaW5nO1xuICAvKiogdHJ1ZSBpZiBjb2xsZWN0aW9uIHdhcyBldmVyIGZpbGxlZCBieSBRdWVyeUFsbDsgZm9yY2VkIGZhbHNlIGlmIGNsZWFyZWQgKi9cbiAgbG9hZGVkOiBib29sZWFuO1xuICAvKiogdHJ1ZSB3aGVuIGEgcXVlcnkgb3Igc2F2ZSBvcGVyYXRpb24gaXMgaW4gcHJvZ3Jlc3MgKi9cbiAgbG9hZGluZzogYm9vbGVhbjtcbn1cbiJdfQ==