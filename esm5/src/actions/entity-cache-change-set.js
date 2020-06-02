var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-cache-change-set.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var ChangeSetOperation = {
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
var /**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
ChangeSetItemFactory = /** @class */ (function () {
    function ChangeSetItemFactory() {
    }
    /** Create the ChangeSetAdd for new entities of the given entity type */
    /**
     * Create the ChangeSetAdd for new entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    ChangeSetItemFactory.prototype.add = /**
     * Create the ChangeSetAdd for new entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    function (entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName: entityName, op: ChangeSetOperation.Add, entities: entities };
    };
    /** Create the ChangeSetDelete for primary keys of the given entity type */
    /**
     * Create the ChangeSetDelete for primary keys of the given entity type
     * @param {?} entityName
     * @param {?} keys
     * @return {?}
     */
    ChangeSetItemFactory.prototype.delete = /**
     * Create the ChangeSetDelete for primary keys of the given entity type
     * @param {?} entityName
     * @param {?} keys
     * @return {?}
     */
    function (entityName, keys) {
        /** @type {?} */
        var ids = Array.isArray(keys)
            ? keys
            : keys
                ? ((/** @type {?} */ ([keys])))
                : [];
        return { entityName: entityName, op: ChangeSetOperation.Delete, entities: ids };
    };
    /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
    /**
     * Create the ChangeSetUpdate for Updates of entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} updates
     * @return {?}
     */
    ChangeSetItemFactory.prototype.update = /**
     * Create the ChangeSetUpdate for Updates of entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} updates
     * @return {?}
     */
    function (entityName, updates) {
        updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
        return { entityName: entityName, op: ChangeSetOperation.Update, entities: updates };
    };
    /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
    /**
     * Create the ChangeSetUpsert for new or existing entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    ChangeSetItemFactory.prototype.upsert = /**
     * Create the ChangeSetUpsert for new or existing entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    function (entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName: entityName, op: ChangeSetOperation.Upsert, entities: entities };
    };
    return ChangeSetItemFactory;
}());
/**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
export { ChangeSetItemFactory };
/**
 * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
 * @type {?}
 */
export var changeSetItemFactory = new ChangeSetItemFactory();
/**
 * Return ChangeSet after filtering out null and empty ChangeSetItems.
 * @param {?} changeSet ChangeSet with changes to filter
 * @return {?}
 */
export function excludeEmptyChangeSetItems(changeSet) {
    changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
    /** @type {?} */
    var changes = changeSet.changes.filter((/**
     * @param {?} c
     * @return {?}
     */
    function (c) { return c != null && c.entities && c.entities.length > 0; }));
    return __assign(__assign({}, changeSet), { changes: changes });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFZLGtCQUFrQjtJQUM1QixHQUFHLE9BQVE7SUFDWCxNQUFNLFVBQVc7SUFDakIsTUFBTSxVQUFXO0lBQ2pCLE1BQU0sVUFBVztFQUNsQjs7Ozs7O0FBQ0Qsa0NBSUM7OztJQUhDLDBCQUEyQjs7SUFDM0Isa0NBQW1COztJQUNuQixnQ0FBYzs7Ozs7QUFHaEIscUNBSUM7OztJQUhDLDZCQUE4Qjs7SUFDOUIscUNBQW1COztJQUNuQixtQ0FBOEI7Ozs7OztBQUdoQyxxQ0FJQzs7O0lBSEMsNkJBQThCOztJQUM5QixxQ0FBbUI7O0lBQ25CLG1DQUFzQjs7Ozs7O0FBR3hCLHFDQUlDOzs7SUFIQyw2QkFBOEI7O0lBQzlCLHFDQUFtQjs7SUFDbkIsbUNBQWM7Ozs7OztBQWVoQiwrQkFZQzs7Ozs7O0lBVkMsNEJBQXlCOzs7Ozs7SUFNekIsMkJBQVc7Ozs7O0lBR1gsd0JBQWE7Ozs7O0FBTWY7Ozs7SUFBQTtJQWtDQSxDQUFDO0lBakNDLHdFQUF3RTs7Ozs7Ozs7SUFDeEUsa0NBQUc7Ozs7Ozs7SUFBSCxVQUFPLFVBQWtCLEVBQUUsUUFBaUI7UUFDMUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsT0FBTyxFQUFFLFVBQVUsWUFBQSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRUQsMkVBQTJFOzs7Ozs7O0lBQzNFLHFDQUFNOzs7Ozs7SUFBTixVQUNFLFVBQWtCLEVBQ2xCLElBQTJDOztZQUVyQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDN0IsQ0FBQyxDQUFDLElBQUk7WUFDTixDQUFDLENBQUMsSUFBSTtnQkFDSixDQUFDLENBQUMsQ0FBQyxtQkFBQSxDQUFDLElBQUksQ0FBQyxFQUF1QixDQUFDO2dCQUNqQyxDQUFDLENBQUMsRUFBRTtRQUNSLE9BQU8sRUFBRSxVQUFVLFlBQUEsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0lBRUQsa0ZBQWtGOzs7Ozs7OztJQUNsRixxQ0FBTTs7Ozs7OztJQUFOLFVBQ0UsVUFBa0IsRUFDbEIsT0FBZ0M7UUFFaEMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEUsT0FBTyxFQUFFLFVBQVUsWUFBQSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzFFLENBQUM7SUFFRCx1RkFBdUY7Ozs7Ozs7O0lBQ3ZGLHFDQUFNOzs7Ozs7O0lBQU4sVUFBVSxVQUFrQixFQUFFLFFBQWlCO1FBQzdDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLE9BQU8sRUFBRSxVQUFVLFlBQUEsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsVUFBQSxFQUFFLENBQUM7SUFDakUsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQWxDRCxJQWtDQzs7Ozs7Ozs7O0FBS0QsTUFBTSxLQUFPLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUU7Ozs7OztBQU05RCxNQUFNLFVBQVUsMEJBQTBCLENBQUMsU0FBb0I7SUFDN0QsU0FBUyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDOztRQUNuRSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNOzs7O0lBQ3RDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBaEQsQ0FBZ0QsRUFDdEQ7SUFDRCw2QkFBWSxTQUFTLEtBQUUsT0FBTyxTQUFBLElBQUc7QUFDbkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmV4cG9ydCBlbnVtIENoYW5nZVNldE9wZXJhdGlvbiB7XG4gIEFkZCA9ICdBZGQnLFxuICBEZWxldGUgPSAnRGVsZXRlJyxcbiAgVXBkYXRlID0gJ1VwZGF0ZScsXG4gIFVwc2VydCA9ICdVcHNlcnQnLFxufVxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRBZGQ8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldERlbGV0ZSB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBzdHJpbmdbXSB8IG51bWJlcltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldFVwZGF0ZTxUID0gYW55PiB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBVcGRhdGU8VD5bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRVcHNlcnQ8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVFtdO1xufVxuXG4vKipcbiAqIEEgZW50aXRpZXMgb2YgYSBzaW5nbGUgZW50aXR5IHR5cGUsIHdoaWNoIGFyZSBjaGFuZ2VkIGluIHRoZSBzYW1lIHdheSBieSBhIENoYW5nZVNldE9wZXJhdGlvblxuICovXG5leHBvcnQgdHlwZSBDaGFuZ2VTZXRJdGVtID1cbiAgfCBDaGFuZ2VTZXRBZGRcbiAgfCBDaGFuZ2VTZXREZWxldGVcbiAgfCBDaGFuZ2VTZXRVcGRhdGVcbiAgfCBDaGFuZ2VTZXRVcHNlcnQ7XG5cbi8qXG4gKiBBIHNldCBvZiBlbnRpdHkgQ2hhbmdlcywgdHlwaWNhbGx5IHRvIGJlIHNhdmVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldDxUID0gYW55PiB7XG4gIC8qKiBBbiBhcnJheSBvZiBDaGFuZ2VTZXRJdGVtcyB0byBiZSBwcm9jZXNzZWQgaW4gdGhlIGFycmF5IG9yZGVyICovXG4gIGNoYW5nZXM6IENoYW5nZVNldEl0ZW1bXTtcblxuICAvKipcbiAgICogQW4gYXJiaXRyYXJ5LCBzZXJpYWxpemFibGUgb2JqZWN0IHRoYXQgc2hvdWxkIHRyYXZlbCB3aXRoIHRoZSBDaGFuZ2VTZXQuXG4gICAqIE1lYW5pbmdmdWwgdG8gdGhlIENoYW5nZVNldCBwcm9kdWNlciBhbmQgY29uc3VtZXIuIElnbm9yZWQgYnkgQG5ncngvZGF0YS5cbiAgICovXG4gIGV4dHJhcz86IFQ7XG5cbiAgLyoqIEFuIGFyYml0cmFyeSBzdHJpbmcsIGlkZW50aWZ5aW5nIHRoZSBDaGFuZ2VTZXQgYW5kIHBlcmhhcHMgaXRzIHB1cnBvc2UgKi9cbiAgdGFnPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgdG8gY3JlYXRlIGEgQ2hhbmdlU2V0SXRlbSBmb3IgYSBDaGFuZ2VTZXRPcGVyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIENoYW5nZVNldEl0ZW1GYWN0b3J5IHtcbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0QWRkIGZvciBuZXcgZW50aXRpZXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIGFkZDxUPihlbnRpdHlOYW1lOiBzdHJpbmcsIGVudGl0aWVzOiBUIHwgVFtdKTogQ2hhbmdlU2V0QWRkPFQ+IHtcbiAgICBlbnRpdGllcyA9IEFycmF5LmlzQXJyYXkoZW50aXRpZXMpID8gZW50aXRpZXMgOiBlbnRpdGllcyA/IFtlbnRpdGllc10gOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZCwgZW50aXRpZXMgfTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldERlbGV0ZSBmb3IgcHJpbWFyeSBrZXlzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICBkZWxldGUoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIGtleXM6IG51bWJlciB8IG51bWJlcltdIHwgc3RyaW5nIHwgc3RyaW5nW11cbiAgKTogQ2hhbmdlU2V0RGVsZXRlIHtcbiAgICBjb25zdCBpZHMgPSBBcnJheS5pc0FycmF5KGtleXMpXG4gICAgICA/IGtleXNcbiAgICAgIDoga2V5c1xuICAgICAgICA/IChba2V5c10gYXMgc3RyaW5nW10gfCBudW1iZXJbXSlcbiAgICAgICAgOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZSwgZW50aXRpZXM6IGlkcyB9O1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0VXBkYXRlIGZvciBVcGRhdGVzIG9mIGVudGl0aWVzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICB1cGRhdGU8VCBleHRlbmRzIHsgaWQ6IHN0cmluZyB8IG51bWJlciB9PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgdXBkYXRlczogVXBkYXRlPFQ+IHwgVXBkYXRlPFQ+W11cbiAgKTogQ2hhbmdlU2V0VXBkYXRlPFQ+IHtcbiAgICB1cGRhdGVzID0gQXJyYXkuaXNBcnJheSh1cGRhdGVzKSA/IHVwZGF0ZXMgOiB1cGRhdGVzID8gW3VwZGF0ZXNdIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGUsIGVudGl0aWVzOiB1cGRhdGVzIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXRVcHNlcnQgZm9yIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgdXBzZXJ0PFQ+KGVudGl0eU5hbWU6IHN0cmluZywgZW50aXRpZXM6IFQgfCBUW10pOiBDaGFuZ2VTZXRVcHNlcnQ8VD4ge1xuICAgIGVudGl0aWVzID0gQXJyYXkuaXNBcnJheShlbnRpdGllcykgPyBlbnRpdGllcyA6IGVudGl0aWVzID8gW2VudGl0aWVzXSA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0LCBlbnRpdGllcyB9O1xuICB9XG59XG5cbi8qKlxuICogSW5zdGFuY2Ugb2YgYSBmYWN0b3J5IHRvIGNyZWF0ZSBhIENoYW5nZVNldEl0ZW0gZm9yIGEgQ2hhbmdlU2V0T3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBjaGFuZ2VTZXRJdGVtRmFjdG9yeSA9IG5ldyBDaGFuZ2VTZXRJdGVtRmFjdG9yeSgpO1xuXG4vKipcbiAqIFJldHVybiBDaGFuZ2VTZXQgYWZ0ZXIgZmlsdGVyaW5nIG91dCBudWxsIGFuZCBlbXB0eSBDaGFuZ2VTZXRJdGVtcy5cbiAqIEBwYXJhbSBjaGFuZ2VTZXQgQ2hhbmdlU2V0IHdpdGggY2hhbmdlcyB0byBmaWx0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgY2hhbmdlU2V0ID0gY2hhbmdlU2V0ICYmIGNoYW5nZVNldC5jaGFuZ2VzID8gY2hhbmdlU2V0IDogeyBjaGFuZ2VzOiBbXSB9O1xuICBjb25zdCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXMuZmlsdGVyKFxuICAgIGMgPT4gYyAhPSBudWxsICYmIGMuZW50aXRpZXMgJiYgYy5lbnRpdGllcy5sZW5ndGggPiAwXG4gICk7XG4gIHJldHVybiB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9O1xufVxuIl19