/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const ChangeSetOperation = {
    Add: 'Add',
    Delete: 'Delete',
    Update: 'Update',
    Upsert: 'Upsert',
};
export { ChangeSetOperation };
/**
 * @record
 * @template T
 */
export function ChangeSetAdd() { }
if (false) {
    /** @type {?} */
    ChangeSetAdd.prototype.op;
    /** @type {?} */
    ChangeSetAdd.prototype.entityName;
    /** @type {?} */
    ChangeSetAdd.prototype.entities;
}
/**
 * @record
 */
export function ChangeSetDelete() { }
if (false) {
    /** @type {?} */
    ChangeSetDelete.prototype.op;
    /** @type {?} */
    ChangeSetDelete.prototype.entityName;
    /** @type {?} */
    ChangeSetDelete.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function ChangeSetUpdate() { }
if (false) {
    /** @type {?} */
    ChangeSetUpdate.prototype.op;
    /** @type {?} */
    ChangeSetUpdate.prototype.entityName;
    /** @type {?} */
    ChangeSetUpdate.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function ChangeSetUpsert() { }
if (false) {
    /** @type {?} */
    ChangeSetUpsert.prototype.op;
    /** @type {?} */
    ChangeSetUpsert.prototype.entityName;
    /** @type {?} */
    ChangeSetUpsert.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function ChangeSet() { }
if (false) {
    /**
     * An array of ChangeSetItems to be processed in the array order
     * @type {?}
     */
    ChangeSet.prototype.changes;
    /**
     * An arbitrary, serializable object that should travel with the ChangeSet.
     * Meaningful to the ChangeSet producer and consumer. Ignored by ngrx-data.
     * @type {?|undefined}
     */
    ChangeSet.prototype.extras;
    /**
     * An arbitrary string, identifying the ChangeSet and perhaps its purpose
     * @type {?|undefined}
     */
    ChangeSet.prototype.tag;
}
/**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
export class ChangeSetItemFactory {
    /**
     * Create the ChangeSetAdd for new entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    add(entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: ChangeSetOperation.Add, entities };
    }
    /**
     * Create the ChangeSetDelete for primary keys of the given entity type
     * @param {?} entityName
     * @param {?} keys
     * @return {?}
     */
    delete(entityName, keys) {
        /** @type {?} */
        const ids = Array.isArray(keys)
            ? keys
            : keys
                ? ((/** @type {?} */ ([keys])))
                : [];
        return { entityName, op: ChangeSetOperation.Delete, entities: ids };
    }
    /**
     * Create the ChangeSetUpdate for Updates of entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} updates
     * @return {?}
     */
    update(entityName, updates) {
        updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
        return { entityName, op: ChangeSetOperation.Update, entities: updates };
    }
    /**
     * Create the ChangeSetUpsert for new or existing entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    upsert(entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: ChangeSetOperation.Upsert, entities };
    }
}
/**
 * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
 * @type {?}
 */
export const changeSetItemFactory = new ChangeSetItemFactory();
/**
 * Return ChangeSet after filtering out null and empty ChangeSetItems.
 * @param {?} changeSet ChangeSet with changes to filter
 * @return {?}
 */
export function excludeEmptyChangeSetItems(changeSet) {
    changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
    /** @type {?} */
    const changes = changeSet.changes.filter((/**
     * @param {?} c
     * @return {?}
     */
    c => c != null && c.entities && c.entities.length > 0));
    return Object.assign({}, changeSet, { changes });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBUUUsS0FBTSxLQUFLO0lBQ1gsUUFBUyxRQUFRO0lBQ2pCLFFBQVMsUUFBUTtJQUNqQixRQUFTLFFBQVE7Ozs7Ozs7QUFFbkIsa0NBSUM7OztJQUhDLDBCQUEyQjs7SUFDM0Isa0NBQW1COztJQUNuQixnQ0FBYzs7Ozs7QUFHaEIscUNBSUM7OztJQUhDLDZCQUE4Qjs7SUFDOUIscUNBQW1COztJQUNuQixtQ0FBOEI7Ozs7OztBQUdoQyxxQ0FJQzs7O0lBSEMsNkJBQThCOztJQUM5QixxQ0FBbUI7O0lBQ25CLG1DQUFzQjs7Ozs7O0FBR3hCLHFDQUlDOzs7SUFIQyw2QkFBOEI7O0lBQzlCLHFDQUFtQjs7SUFDbkIsbUNBQWM7Ozs7OztBQWVoQiwrQkFZQzs7Ozs7O0lBVkMsNEJBQXlCOzs7Ozs7SUFNekIsMkJBQVc7Ozs7O0lBR1gsd0JBQWE7Ozs7O0FBTWYsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7Ozs7SUFFL0IsR0FBRyxDQUFJLFVBQWtCLEVBQUUsUUFBaUI7UUFDMUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQzlELENBQUM7Ozs7Ozs7SUFHRCxNQUFNLENBQ0osVUFBa0IsRUFDbEIsSUFBMkM7O2NBRXJDLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM3QixDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJO2dCQUNKLENBQUMsQ0FBQyxDQUFDLG1CQUFBLENBQUMsSUFBSSxDQUFDLEVBQXVCLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxFQUFFO1FBQ1IsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0RSxDQUFDOzs7Ozs7OztJQUdELE1BQU0sQ0FDSixVQUFrQixFQUNsQixPQUFnQztRQUVoQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzFFLENBQUM7Ozs7Ozs7O0lBR0QsTUFBTSxDQUFJLFVBQWtCLEVBQUUsUUFBaUI7UUFDN0MsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ2pFLENBQUM7Q0FDRjs7Ozs7QUFLRCxNQUFNLE9BQU8sb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsRUFBRTs7Ozs7O0FBTTlELE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxTQUFvQjtJQUM3RCxTQUFTLEdBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7O1VBQ25FLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU07Ozs7SUFDdEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUN0RDtJQUNELHlCQUFZLFNBQVMsSUFBRSxPQUFPLElBQUc7QUFDbkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuXG5leHBvcnQgZW51bSBDaGFuZ2VTZXRPcGVyYXRpb24ge1xuICBBZGQgPSAnQWRkJyxcbiAgRGVsZXRlID0gJ0RlbGV0ZScsXG4gIFVwZGF0ZSA9ICdVcGRhdGUnLFxuICBVcHNlcnQgPSAnVXBzZXJ0Jyxcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0QWRkPFQgPSBhbnk+IHtcbiAgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5BZGQ7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXRpZXM6IFRbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXREZWxldGUge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogc3RyaW5nW10gfCBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRVcGRhdGU8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVXBkYXRlPFQ+W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0VXBzZXJ0PFQgPSBhbnk+IHtcbiAgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXRpZXM6IFRbXTtcbn1cblxuLyoqXG4gKiBBIGVudGl0aWVzIG9mIGEgc2luZ2xlIGVudGl0eSB0eXBlLCB3aGljaCBhcmUgY2hhbmdlZCBpbiB0aGUgc2FtZSB3YXkgYnkgYSBDaGFuZ2VTZXRPcGVyYXRpb25cbiAqL1xuZXhwb3J0IHR5cGUgQ2hhbmdlU2V0SXRlbSA9XG4gIHwgQ2hhbmdlU2V0QWRkXG4gIHwgQ2hhbmdlU2V0RGVsZXRlXG4gIHwgQ2hhbmdlU2V0VXBkYXRlXG4gIHwgQ2hhbmdlU2V0VXBzZXJ0O1xuXG4vKlxuICogQSBzZXQgb2YgZW50aXR5IENoYW5nZXMsIHR5cGljYWxseSB0byBiZSBzYXZlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXQ8VCA9IGFueT4ge1xuICAvKiogQW4gYXJyYXkgb2YgQ2hhbmdlU2V0SXRlbXMgdG8gYmUgcHJvY2Vzc2VkIGluIHRoZSBhcnJheSBvcmRlciAqL1xuICBjaGFuZ2VzOiBDaGFuZ2VTZXRJdGVtW107XG5cbiAgLyoqXG4gICAqIEFuIGFyYml0cmFyeSwgc2VyaWFsaXphYmxlIG9iamVjdCB0aGF0IHNob3VsZCB0cmF2ZWwgd2l0aCB0aGUgQ2hhbmdlU2V0LlxuICAgKiBNZWFuaW5nZnVsIHRvIHRoZSBDaGFuZ2VTZXQgcHJvZHVjZXIgYW5kIGNvbnN1bWVyLiBJZ25vcmVkIGJ5IG5ncngtZGF0YS5cbiAgICovXG4gIGV4dHJhcz86IFQ7XG5cbiAgLyoqIEFuIGFyYml0cmFyeSBzdHJpbmcsIGlkZW50aWZ5aW5nIHRoZSBDaGFuZ2VTZXQgYW5kIHBlcmhhcHMgaXRzIHB1cnBvc2UgKi9cbiAgdGFnPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgdG8gY3JlYXRlIGEgQ2hhbmdlU2V0SXRlbSBmb3IgYSBDaGFuZ2VTZXRPcGVyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIENoYW5nZVNldEl0ZW1GYWN0b3J5IHtcbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0QWRkIGZvciBuZXcgZW50aXRpZXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIGFkZDxUPihlbnRpdHlOYW1lOiBzdHJpbmcsIGVudGl0aWVzOiBUIHwgVFtdKTogQ2hhbmdlU2V0QWRkPFQ+IHtcbiAgICBlbnRpdGllcyA9IEFycmF5LmlzQXJyYXkoZW50aXRpZXMpID8gZW50aXRpZXMgOiBlbnRpdGllcyA/IFtlbnRpdGllc10gOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZCwgZW50aXRpZXMgfTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldERlbGV0ZSBmb3IgcHJpbWFyeSBrZXlzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICBkZWxldGUoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIGtleXM6IG51bWJlciB8IG51bWJlcltdIHwgc3RyaW5nIHwgc3RyaW5nW11cbiAgKTogQ2hhbmdlU2V0RGVsZXRlIHtcbiAgICBjb25zdCBpZHMgPSBBcnJheS5pc0FycmF5KGtleXMpXG4gICAgICA/IGtleXNcbiAgICAgIDoga2V5c1xuICAgICAgICA/IChba2V5c10gYXMgc3RyaW5nW10gfCBudW1iZXJbXSlcbiAgICAgICAgOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZSwgZW50aXRpZXM6IGlkcyB9O1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0VXBkYXRlIGZvciBVcGRhdGVzIG9mIGVudGl0aWVzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICB1cGRhdGU8VCBleHRlbmRzIHsgaWQ6IHN0cmluZyB9PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgdXBkYXRlczogVXBkYXRlPFQ+IHwgVXBkYXRlPFQ+W11cbiAgKTogQ2hhbmdlU2V0VXBkYXRlPFQ+IHtcbiAgICB1cGRhdGVzID0gQXJyYXkuaXNBcnJheSh1cGRhdGVzKSA/IHVwZGF0ZXMgOiB1cGRhdGVzID8gW3VwZGF0ZXNdIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGUsIGVudGl0aWVzOiB1cGRhdGVzIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXRVcHNlcnQgZm9yIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgdXBzZXJ0PFQ+KGVudGl0eU5hbWU6IHN0cmluZywgZW50aXRpZXM6IFQgfCBUW10pOiBDaGFuZ2VTZXRVcHNlcnQ8VD4ge1xuICAgIGVudGl0aWVzID0gQXJyYXkuaXNBcnJheShlbnRpdGllcykgPyBlbnRpdGllcyA6IGVudGl0aWVzID8gW2VudGl0aWVzXSA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0LCBlbnRpdGllcyB9O1xuICB9XG59XG5cbi8qKlxuICogSW5zdGFuY2Ugb2YgYSBmYWN0b3J5IHRvIGNyZWF0ZSBhIENoYW5nZVNldEl0ZW0gZm9yIGEgQ2hhbmdlU2V0T3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBjaGFuZ2VTZXRJdGVtRmFjdG9yeSA9IG5ldyBDaGFuZ2VTZXRJdGVtRmFjdG9yeSgpO1xuXG4vKipcbiAqIFJldHVybiBDaGFuZ2VTZXQgYWZ0ZXIgZmlsdGVyaW5nIG91dCBudWxsIGFuZCBlbXB0eSBDaGFuZ2VTZXRJdGVtcy5cbiAqIEBwYXJhbSBjaGFuZ2VTZXQgQ2hhbmdlU2V0IHdpdGggY2hhbmdlcyB0byBmaWx0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgY2hhbmdlU2V0ID0gY2hhbmdlU2V0ICYmIGNoYW5nZVNldC5jaGFuZ2VzID8gY2hhbmdlU2V0IDogeyBjaGFuZ2VzOiBbXSB9O1xuICBjb25zdCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXMuZmlsdGVyKFxuICAgIGMgPT4gYyAhPSBudWxsICYmIGMuZW50aXRpZXMgJiYgYy5lbnRpdGllcy5sZW5ndGggPiAwXG4gICk7XG4gIHJldHVybiB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9O1xufVxuIl19