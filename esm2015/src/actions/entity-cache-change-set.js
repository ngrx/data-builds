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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBR0UsS0FBTSxLQUFLO0lBQ1gsUUFBUyxRQUFRO0lBQ2pCLFFBQVMsUUFBUTtJQUNqQixRQUFTLFFBQVE7Ozs7Ozs7QUFFbkIsa0NBSUM7OztJQUhDLDBCQUEyQjs7SUFDM0Isa0NBQW1COztJQUNuQixnQ0FBYzs7Ozs7QUFHaEIscUNBSUM7OztJQUhDLDZCQUE4Qjs7SUFDOUIscUNBQW1COztJQUNuQixtQ0FBOEI7Ozs7OztBQUdoQyxxQ0FJQzs7O0lBSEMsNkJBQThCOztJQUM5QixxQ0FBbUI7O0lBQ25CLG1DQUFzQjs7Ozs7O0FBR3hCLHFDQUlDOzs7SUFIQyw2QkFBOEI7O0lBQzlCLHFDQUFtQjs7SUFDbkIsbUNBQWM7Ozs7OztBQWVoQiwrQkFZQzs7Ozs7O0lBVkMsNEJBQXlCOzs7Ozs7SUFNekIsMkJBQVc7Ozs7O0lBR1gsd0JBQWE7Ozs7O0FBTWYsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7Ozs7SUFFL0IsR0FBRyxDQUFJLFVBQWtCLEVBQUUsUUFBaUI7UUFDMUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQzlELENBQUM7Ozs7Ozs7SUFHRCxNQUFNLENBQ0osVUFBa0IsRUFDbEIsSUFBMkM7O2NBRXJDLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM3QixDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxJQUFJO2dCQUNKLENBQUMsQ0FBQyxDQUFDLG1CQUFBLENBQUMsSUFBSSxDQUFDLEVBQXVCLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxFQUFFO1FBQ1IsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0RSxDQUFDOzs7Ozs7OztJQUdELE1BQU0sQ0FDSixVQUFrQixFQUNsQixPQUFnQztRQUVoQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzFFLENBQUM7Ozs7Ozs7O0lBR0QsTUFBTSxDQUFJLFVBQWtCLEVBQUUsUUFBaUI7UUFDN0MsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ2pFLENBQUM7Q0FDRjs7Ozs7QUFLRCxNQUFNLE9BQU8sb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsRUFBRTs7Ozs7O0FBTTlELE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxTQUFvQjtJQUM3RCxTQUFTLEdBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7O1VBQ25FLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU07Ozs7SUFDdEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUN0RDtJQUNELHlCQUFZLFNBQVMsSUFBRSxPQUFPLElBQUc7QUFDbkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmV4cG9ydCBlbnVtIENoYW5nZVNldE9wZXJhdGlvbiB7XG4gIEFkZCA9ICdBZGQnLFxuICBEZWxldGUgPSAnRGVsZXRlJyxcbiAgVXBkYXRlID0gJ1VwZGF0ZScsXG4gIFVwc2VydCA9ICdVcHNlcnQnLFxufVxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRBZGQ8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldERlbGV0ZSB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBzdHJpbmdbXSB8IG51bWJlcltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldFVwZGF0ZTxUID0gYW55PiB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBVcGRhdGU8VD5bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRVcHNlcnQ8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVFtdO1xufVxuXG4vKipcbiAqIEEgZW50aXRpZXMgb2YgYSBzaW5nbGUgZW50aXR5IHR5cGUsIHdoaWNoIGFyZSBjaGFuZ2VkIGluIHRoZSBzYW1lIHdheSBieSBhIENoYW5nZVNldE9wZXJhdGlvblxuICovXG5leHBvcnQgdHlwZSBDaGFuZ2VTZXRJdGVtID1cbiAgfCBDaGFuZ2VTZXRBZGRcbiAgfCBDaGFuZ2VTZXREZWxldGVcbiAgfCBDaGFuZ2VTZXRVcGRhdGVcbiAgfCBDaGFuZ2VTZXRVcHNlcnQ7XG5cbi8qXG4gKiBBIHNldCBvZiBlbnRpdHkgQ2hhbmdlcywgdHlwaWNhbGx5IHRvIGJlIHNhdmVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldDxUID0gYW55PiB7XG4gIC8qKiBBbiBhcnJheSBvZiBDaGFuZ2VTZXRJdGVtcyB0byBiZSBwcm9jZXNzZWQgaW4gdGhlIGFycmF5IG9yZGVyICovXG4gIGNoYW5nZXM6IENoYW5nZVNldEl0ZW1bXTtcblxuICAvKipcbiAgICogQW4gYXJiaXRyYXJ5LCBzZXJpYWxpemFibGUgb2JqZWN0IHRoYXQgc2hvdWxkIHRyYXZlbCB3aXRoIHRoZSBDaGFuZ2VTZXQuXG4gICAqIE1lYW5pbmdmdWwgdG8gdGhlIENoYW5nZVNldCBwcm9kdWNlciBhbmQgY29uc3VtZXIuIElnbm9yZWQgYnkgbmdyeC1kYXRhLlxuICAgKi9cbiAgZXh0cmFzPzogVDtcblxuICAvKiogQW4gYXJiaXRyYXJ5IHN0cmluZywgaWRlbnRpZnlpbmcgdGhlIENoYW5nZVNldCBhbmQgcGVyaGFwcyBpdHMgcHVycG9zZSAqL1xuICB0YWc/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRmFjdG9yeSB0byBjcmVhdGUgYSBDaGFuZ2VTZXRJdGVtIGZvciBhIENoYW5nZVNldE9wZXJhdGlvblxuICovXG5leHBvcnQgY2xhc3MgQ2hhbmdlU2V0SXRlbUZhY3Rvcnkge1xuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXRBZGQgZm9yIG5ldyBlbnRpdGllcyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgYWRkPFQ+KGVudGl0eU5hbWU6IHN0cmluZywgZW50aXRpZXM6IFQgfCBUW10pOiBDaGFuZ2VTZXRBZGQ8VD4ge1xuICAgIGVudGl0aWVzID0gQXJyYXkuaXNBcnJheShlbnRpdGllcykgPyBlbnRpdGllcyA6IGVudGl0aWVzID8gW2VudGl0aWVzXSA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkLCBlbnRpdGllcyB9O1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0RGVsZXRlIGZvciBwcmltYXJ5IGtleXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIGRlbGV0ZShcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAga2V5czogbnVtYmVyIHwgbnVtYmVyW10gfCBzdHJpbmcgfCBzdHJpbmdbXVxuICApOiBDaGFuZ2VTZXREZWxldGUge1xuICAgIGNvbnN0IGlkcyA9IEFycmF5LmlzQXJyYXkoa2V5cylcbiAgICAgID8ga2V5c1xuICAgICAgOiBrZXlzXG4gICAgICAgID8gKFtrZXlzXSBhcyBzdHJpbmdbXSB8IG51bWJlcltdKVxuICAgICAgICA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlLCBlbnRpdGllczogaWRzIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXRVcGRhdGUgZm9yIFVwZGF0ZXMgb2YgZW50aXRpZXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIHVwZGF0ZTxUIGV4dGVuZHMgeyBpZDogc3RyaW5nIHwgbnVtYmVyIH0+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICB1cGRhdGVzOiBVcGRhdGU8VD4gfCBVcGRhdGU8VD5bXVxuICApOiBDaGFuZ2VTZXRVcGRhdGU8VD4ge1xuICAgIHVwZGF0ZXMgPSBBcnJheS5pc0FycmF5KHVwZGF0ZXMpID8gdXBkYXRlcyA6IHVwZGF0ZXMgPyBbdXBkYXRlc10gOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZSwgZW50aXRpZXM6IHVwZGF0ZXMgfTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldFVwc2VydCBmb3IgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICB1cHNlcnQ8VD4oZW50aXR5TmFtZTogc3RyaW5nLCBlbnRpdGllczogVCB8IFRbXSk6IENoYW5nZVNldFVwc2VydDxUPiB7XG4gICAgZW50aXRpZXMgPSBBcnJheS5pc0FycmF5KGVudGl0aWVzKSA/IGVudGl0aWVzIDogZW50aXRpZXMgPyBbZW50aXRpZXNdIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQsIGVudGl0aWVzIH07XG4gIH1cbn1cblxuLyoqXG4gKiBJbnN0YW5jZSBvZiBhIGZhY3RvcnkgdG8gY3JlYXRlIGEgQ2hhbmdlU2V0SXRlbSBmb3IgYSBDaGFuZ2VTZXRPcGVyYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGNoYW5nZVNldEl0ZW1GYWN0b3J5ID0gbmV3IENoYW5nZVNldEl0ZW1GYWN0b3J5KCk7XG5cbi8qKlxuICogUmV0dXJuIENoYW5nZVNldCBhZnRlciBmaWx0ZXJpbmcgb3V0IG51bGwgYW5kIGVtcHR5IENoYW5nZVNldEl0ZW1zLlxuICogQHBhcmFtIGNoYW5nZVNldCBDaGFuZ2VTZXQgd2l0aCBjaGFuZ2VzIHRvIGZpbHRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICBjaGFuZ2VTZXQgPSBjaGFuZ2VTZXQgJiYgY2hhbmdlU2V0LmNoYW5nZXMgPyBjaGFuZ2VTZXQgOiB7IGNoYW5nZXM6IFtdIH07XG4gIGNvbnN0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcy5maWx0ZXIoXG4gICAgYyA9PiBjICE9IG51bGwgJiYgYy5lbnRpdGllcyAmJiBjLmVudGl0aWVzLmxlbmd0aCA+IDBcbiAgKTtcbiAgcmV0dXJuIHsgLi4uY2hhbmdlU2V0LCBjaGFuZ2VzIH07XG59XG4iXX0=