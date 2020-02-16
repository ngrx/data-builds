/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/reducers/entity-collection.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLE1BQVksVUFBVTtJQUNwQixtRUFBbUU7SUFDbkUsU0FBUyxHQUFJO0lBQ2IsNkNBQTZDO0lBQzdDLEtBQUssR0FBQTtJQUNMLDZFQUE2RTtJQUM3RSxPQUFPLEdBQUE7SUFDUCwrQ0FBK0M7SUFDL0MsT0FBTyxHQUFBO0VBQ1I7Ozs7Ozs7Ozs7OztBQU1ELGlDQUdDOzs7SUFGQyxpQ0FBdUI7O0lBQ3ZCLG9DQUE4Qjs7Ozs7Ozs7QUFhaEMsc0NBV0M7Ozs7OztJQVRDLHNDQUFtQjs7Ozs7SUFFbkIsdUNBQStCOzs7OztJQUUvQixrQ0FBZ0I7Ozs7O0lBRWhCLGtDQUFnQjs7Ozs7SUFFaEIsbUNBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5U3RhdGUsIERpY3Rpb25hcnkgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG4vKiogVHlwZXMgb2YgY2hhbmdlIGluIGEgQ2hhbmdlU3RhdGUgaW5zdGFuY2UgKi9cbmV4cG9ydCBlbnVtIENoYW5nZVR5cGUge1xuICAvKiogVGhlIGVudGl0eSBoYXMgbm90IGNoYW5nZWQgZnJvbSBpdHMgbGFzdCBrbm93biBzZXJ2ZXIgc3RhdGUuICovXG4gIFVuY2hhbmdlZCA9IDAsXG4gIC8qKiBUaGUgZW50aXR5IHdhcyBhZGRlZCB0byB0aGUgY29sbGVjdGlvbiAqL1xuICBBZGRlZCxcbiAgLyoqIFRoZSBlbnRpdHkgaXMgc2NoZWR1bGVkIGZvciBkZWxldGUgYW5kIHdhcyByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gKi9cbiAgRGVsZXRlZCxcbiAgLyoqIFRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2FzIHVwZGF0ZWQgKi9cbiAgVXBkYXRlZCxcbn1cblxuLyoqXG4gKiBDaGFuZ2Ugc3RhdGUgZm9yIGFuIGVudGl0eSB3aXRoIHVuc2F2ZWQgY2hhbmdlcztcbiAqIGFuIGVudHJ5IGluIGFuIEVudGl0eUNvbGxlY3Rpb24uY2hhbmdlU3RhdGUgbWFwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU3RhdGU8VD4ge1xuICBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlO1xuICBvcmlnaW5hbFZhbHVlPzogVCB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBNYXAgb2YgZW50aXR5IHByaW1hcnkga2V5cyB0byBlbnRpdHkgQ2hhbmdlU3RhdGVzLlxuICogRWFjaCBlbnRyeSByZXByZXNlbnRzIGFuIGVudGl0eSB3aXRoIHVuc2F2ZWQgY2hhbmdlcy5cbiAqL1xuZXhwb3J0IHR5cGUgQ2hhbmdlU3RhdGVNYXA8VD4gPSBEaWN0aW9uYXJ5PENoYW5nZVN0YXRlPFQ+PjtcblxuLyoqXG4gKiBEYXRhIGFuZCBpbmZvcm1hdGlvbiBhYm91dCBhIGNvbGxlY3Rpb24gb2YgZW50aXRpZXMgb2YgYSBzaW5nbGUgdHlwZS5cbiAqIEVudGl0eUNvbGxlY3Rpb25zIGFyZSBtYWludGFpbmVkIGluIHRoZSBFbnRpdHlDYWNoZSB3aXRoaW4gdGhlIG5ncnggc3RvcmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvbjxUID0gYW55PiBleHRlbmRzIEVudGl0eVN0YXRlPFQ+IHtcbiAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGNvbGxlY3Rpb24gKi9cbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICAvKiogQSBtYXAgb2YgQ2hhbmdlU3RhdGVzLCBrZXllZCBieSBpZCwgZm9yIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIGNoYW5nZVN0YXRlOiBDaGFuZ2VTdGF0ZU1hcDxUPjtcbiAgLyoqIFRoZSB1c2VyJ3MgY3VycmVudCBjb2xsZWN0aW9uIGZpbHRlciBwYXR0ZXJuICovXG4gIGZpbHRlcj86IHN0cmluZztcbiAgLyoqIHRydWUgaWYgY29sbGVjdGlvbiB3YXMgZXZlciBmaWxsZWQgYnkgUXVlcnlBbGw7IGZvcmNlZCBmYWxzZSBpZiBjbGVhcmVkICovXG4gIGxvYWRlZDogYm9vbGVhbjtcbiAgLyoqIHRydWUgd2hlbiBhIHF1ZXJ5IG9yIHNhdmUgb3BlcmF0aW9uIGlzIGluIHByb2dyZXNzICovXG4gIGxvYWRpbmc6IGJvb2xlYW47XG59XG4iXX0=