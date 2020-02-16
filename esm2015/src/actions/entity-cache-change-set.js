/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/actions/entity-cache-change-set.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const ChangeSetOperation = {
    Add: "Add",
    Delete: "Delete",
    Update: "Update",
    Upsert: "Upsert",
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
     * Meaningful to the ChangeSet producer and consumer. Ignored by \@ngrx/data.
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
    return Object.assign(Object.assign({}, changeSet), { changes });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsTUFBWSxrQkFBa0I7SUFDNUIsR0FBRyxPQUFRO0lBQ1gsTUFBTSxVQUFXO0lBQ2pCLE1BQU0sVUFBVztJQUNqQixNQUFNLFVBQVc7RUFDbEI7Ozs7OztBQUNELGtDQUlDOzs7SUFIQywwQkFBMkI7O0lBQzNCLGtDQUFtQjs7SUFDbkIsZ0NBQWM7Ozs7O0FBR2hCLHFDQUlDOzs7SUFIQyw2QkFBOEI7O0lBQzlCLHFDQUFtQjs7SUFDbkIsbUNBQThCOzs7Ozs7QUFHaEMscUNBSUM7OztJQUhDLDZCQUE4Qjs7SUFDOUIscUNBQW1COztJQUNuQixtQ0FBc0I7Ozs7OztBQUd4QixxQ0FJQzs7O0lBSEMsNkJBQThCOztJQUM5QixxQ0FBbUI7O0lBQ25CLG1DQUFjOzs7Ozs7QUFlaEIsK0JBWUM7Ozs7OztJQVZDLDRCQUF5Qjs7Ozs7O0lBTXpCLDJCQUFXOzs7OztJQUdYLHdCQUFhOzs7OztBQU1mLE1BQU0sT0FBTyxvQkFBb0I7Ozs7Ozs7O0lBRS9CLEdBQUcsQ0FBSSxVQUFrQixFQUFFLFFBQWlCO1FBQzFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUM5RCxDQUFDOzs7Ozs7O0lBR0QsTUFBTSxDQUNKLFVBQWtCLEVBQ2xCLElBQTJDOztjQUVyQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDN0IsQ0FBQyxDQUFDLElBQUk7WUFDTixDQUFDLENBQUMsSUFBSTtnQkFDSixDQUFDLENBQUMsQ0FBQyxtQkFBQSxDQUFDLElBQUksQ0FBQyxFQUF1QixDQUFDO2dCQUNqQyxDQUFDLENBQUMsRUFBRTtRQUNSLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDdEUsQ0FBQzs7Ozs7Ozs7SUFHRCxNQUFNLENBQ0osVUFBa0IsRUFDbEIsT0FBZ0M7UUFFaEMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUMxRSxDQUFDOzs7Ozs7OztJQUdELE1BQU0sQ0FBSSxVQUFrQixFQUFFLFFBQWlCO1FBQzdDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0NBQ0Y7Ozs7O0FBS0QsTUFBTSxPQUFPLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUU7Ozs7OztBQU05RCxNQUFNLFVBQVUsMEJBQTBCLENBQUMsU0FBb0I7SUFDN0QsU0FBUyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDOztVQUNuRSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNOzs7O0lBQ3RDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDdEQ7SUFDRCx1Q0FBWSxTQUFTLEtBQUUsT0FBTyxJQUFHO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5leHBvcnQgZW51bSBDaGFuZ2VTZXRPcGVyYXRpb24ge1xuICBBZGQgPSAnQWRkJyxcbiAgRGVsZXRlID0gJ0RlbGV0ZScsXG4gIFVwZGF0ZSA9ICdVcGRhdGUnLFxuICBVcHNlcnQgPSAnVXBzZXJ0Jyxcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0QWRkPFQgPSBhbnk+IHtcbiAgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5BZGQ7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXRpZXM6IFRbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXREZWxldGUge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogc3RyaW5nW10gfCBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRVcGRhdGU8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVXBkYXRlPFQ+W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0VXBzZXJ0PFQgPSBhbnk+IHtcbiAgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXRpZXM6IFRbXTtcbn1cblxuLyoqXG4gKiBBIGVudGl0aWVzIG9mIGEgc2luZ2xlIGVudGl0eSB0eXBlLCB3aGljaCBhcmUgY2hhbmdlZCBpbiB0aGUgc2FtZSB3YXkgYnkgYSBDaGFuZ2VTZXRPcGVyYXRpb25cbiAqL1xuZXhwb3J0IHR5cGUgQ2hhbmdlU2V0SXRlbSA9XG4gIHwgQ2hhbmdlU2V0QWRkXG4gIHwgQ2hhbmdlU2V0RGVsZXRlXG4gIHwgQ2hhbmdlU2V0VXBkYXRlXG4gIHwgQ2hhbmdlU2V0VXBzZXJ0O1xuXG4vKlxuICogQSBzZXQgb2YgZW50aXR5IENoYW5nZXMsIHR5cGljYWxseSB0byBiZSBzYXZlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXQ8VCA9IGFueT4ge1xuICAvKiogQW4gYXJyYXkgb2YgQ2hhbmdlU2V0SXRlbXMgdG8gYmUgcHJvY2Vzc2VkIGluIHRoZSBhcnJheSBvcmRlciAqL1xuICBjaGFuZ2VzOiBDaGFuZ2VTZXRJdGVtW107XG5cbiAgLyoqXG4gICAqIEFuIGFyYml0cmFyeSwgc2VyaWFsaXphYmxlIG9iamVjdCB0aGF0IHNob3VsZCB0cmF2ZWwgd2l0aCB0aGUgQ2hhbmdlU2V0LlxuICAgKiBNZWFuaW5nZnVsIHRvIHRoZSBDaGFuZ2VTZXQgcHJvZHVjZXIgYW5kIGNvbnN1bWVyLiBJZ25vcmVkIGJ5IEBuZ3J4L2RhdGEuXG4gICAqL1xuICBleHRyYXM/OiBUO1xuXG4gIC8qKiBBbiBhcmJpdHJhcnkgc3RyaW5nLCBpZGVudGlmeWluZyB0aGUgQ2hhbmdlU2V0IGFuZCBwZXJoYXBzIGl0cyBwdXJwb3NlICovXG4gIHRhZz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBGYWN0b3J5IHRvIGNyZWF0ZSBhIENoYW5nZVNldEl0ZW0gZm9yIGEgQ2hhbmdlU2V0T3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGFuZ2VTZXRJdGVtRmFjdG9yeSB7XG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldEFkZCBmb3IgbmV3IGVudGl0aWVzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICBhZGQ8VD4oZW50aXR5TmFtZTogc3RyaW5nLCBlbnRpdGllczogVCB8IFRbXSk6IENoYW5nZVNldEFkZDxUPiB7XG4gICAgZW50aXRpZXMgPSBBcnJheS5pc0FycmF5KGVudGl0aWVzKSA/IGVudGl0aWVzIDogZW50aXRpZXMgPyBbZW50aXRpZXNdIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5BZGQsIGVudGl0aWVzIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXREZWxldGUgZm9yIHByaW1hcnkga2V5cyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgZGVsZXRlKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBrZXlzOiBudW1iZXIgfCBudW1iZXJbXSB8IHN0cmluZyB8IHN0cmluZ1tdXG4gICk6IENoYW5nZVNldERlbGV0ZSB7XG4gICAgY29uc3QgaWRzID0gQXJyYXkuaXNBcnJheShrZXlzKVxuICAgICAgPyBrZXlzXG4gICAgICA6IGtleXNcbiAgICAgICAgPyAoW2tleXNdIGFzIHN0cmluZ1tdIHwgbnVtYmVyW10pXG4gICAgICAgIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGUsIGVudGl0aWVzOiBpZHMgfTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldFVwZGF0ZSBmb3IgVXBkYXRlcyBvZiBlbnRpdGllcyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgdXBkYXRlPFQgZXh0ZW5kcyB7IGlkOiBzdHJpbmcgfCBudW1iZXIgfT4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHVwZGF0ZXM6IFVwZGF0ZTxUPiB8IFVwZGF0ZTxUPltdXG4gICk6IENoYW5nZVNldFVwZGF0ZTxUPiB7XG4gICAgdXBkYXRlcyA9IEFycmF5LmlzQXJyYXkodXBkYXRlcykgPyB1cGRhdGVzIDogdXBkYXRlcyA/IFt1cGRhdGVzXSA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlLCBlbnRpdGllczogdXBkYXRlcyB9O1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0VXBzZXJ0IGZvciBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIHVwc2VydDxUPihlbnRpdHlOYW1lOiBzdHJpbmcsIGVudGl0aWVzOiBUIHwgVFtdKTogQ2hhbmdlU2V0VXBzZXJ0PFQ+IHtcbiAgICBlbnRpdGllcyA9IEFycmF5LmlzQXJyYXkoZW50aXRpZXMpID8gZW50aXRpZXMgOiBlbnRpdGllcyA/IFtlbnRpdGllc10gOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydCwgZW50aXRpZXMgfTtcbiAgfVxufVxuXG4vKipcbiAqIEluc3RhbmNlIG9mIGEgZmFjdG9yeSB0byBjcmVhdGUgYSBDaGFuZ2VTZXRJdGVtIGZvciBhIENoYW5nZVNldE9wZXJhdGlvblxuICovXG5leHBvcnQgY29uc3QgY2hhbmdlU2V0SXRlbUZhY3RvcnkgPSBuZXcgQ2hhbmdlU2V0SXRlbUZhY3RvcnkoKTtcblxuLyoqXG4gKiBSZXR1cm4gQ2hhbmdlU2V0IGFmdGVyIGZpbHRlcmluZyBvdXQgbnVsbCBhbmQgZW1wdHkgQ2hhbmdlU2V0SXRlbXMuXG4gKiBAcGFyYW0gY2hhbmdlU2V0IENoYW5nZVNldCB3aXRoIGNoYW5nZXMgdG8gZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gIGNoYW5nZVNldCA9IGNoYW5nZVNldCAmJiBjaGFuZ2VTZXQuY2hhbmdlcyA/IGNoYW5nZVNldCA6IHsgY2hhbmdlczogW10gfTtcbiAgY29uc3QgY2hhbmdlcyA9IGNoYW5nZVNldC5jaGFuZ2VzLmZpbHRlcihcbiAgICBjID0+IGMgIT0gbnVsbCAmJiBjLmVudGl0aWVzICYmIGMuZW50aXRpZXMubGVuZ3RoID4gMFxuICApO1xuICByZXR1cm4geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfTtcbn1cbiJdfQ==