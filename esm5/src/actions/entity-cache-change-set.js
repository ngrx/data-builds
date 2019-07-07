import * as tslib_1 from "tslib";
export var ChangeSetOperation;
(function (ChangeSetOperation) {
    ChangeSetOperation["Add"] = "Add";
    ChangeSetOperation["Delete"] = "Delete";
    ChangeSetOperation["Update"] = "Update";
    ChangeSetOperation["Upsert"] = "Upsert";
})(ChangeSetOperation || (ChangeSetOperation = {}));
/**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
var ChangeSetItemFactory = /** @class */ (function () {
    function ChangeSetItemFactory() {
    }
    /** Create the ChangeSetAdd for new entities of the given entity type */
    ChangeSetItemFactory.prototype.add = function (entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName: entityName, op: ChangeSetOperation.Add, entities: entities };
    };
    /** Create the ChangeSetDelete for primary keys of the given entity type */
    ChangeSetItemFactory.prototype.delete = function (entityName, keys) {
        var ids = Array.isArray(keys)
            ? keys
            : keys
                ? [keys]
                : [];
        return { entityName: entityName, op: ChangeSetOperation.Delete, entities: ids };
    };
    /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
    ChangeSetItemFactory.prototype.update = function (entityName, updates) {
        updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
        return { entityName: entityName, op: ChangeSetOperation.Update, entities: updates };
    };
    /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
    ChangeSetItemFactory.prototype.upsert = function (entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName: entityName, op: ChangeSetOperation.Upsert, entities: entities };
    };
    return ChangeSetItemFactory;
}());
export { ChangeSetItemFactory };
/**
 * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
 */
export var changeSetItemFactory = new ChangeSetItemFactory();
/**
 * Return ChangeSet after filtering out null and empty ChangeSetItems.
 * @param changeSet ChangeSet with changes to filter
 */
export function excludeEmptyChangeSetItems(changeSet) {
    changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
    var changes = changeSet.changes.filter(function (c) { return c != null && c.entities && c.entities.length > 0; });
    return tslib_1.__assign({}, changeSet, { changes: changes });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBTixJQUFZLGtCQUtYO0FBTEQsV0FBWSxrQkFBa0I7SUFDNUIsaUNBQVcsQ0FBQTtJQUNYLHVDQUFpQixDQUFBO0lBQ2pCLHVDQUFpQixDQUFBO0lBQ2pCLHVDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFMVyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBSzdCO0FBbUREOztHQUVHO0FBQ0g7SUFBQTtJQWtDQSxDQUFDO0lBakNDLHdFQUF3RTtJQUN4RSxrQ0FBRyxHQUFILFVBQU8sVUFBa0IsRUFBRSxRQUFpQjtRQUMxQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRSxPQUFPLEVBQUUsVUFBVSxZQUFBLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxRQUFRLFVBQUEsRUFBRSxDQUFDO0lBQzlELENBQUM7SUFFRCwyRUFBMkU7SUFDM0UscUNBQU0sR0FBTixVQUNFLFVBQWtCLEVBQ2xCLElBQTJDO1FBRTNDLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxJQUFJO1lBQ04sQ0FBQyxDQUFDLElBQUk7Z0JBQ0osQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUF5QjtnQkFDakMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNULE9BQU8sRUFBRSxVQUFVLFlBQUEsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0lBRUQsa0ZBQWtGO0lBQ2xGLHFDQUFNLEdBQU4sVUFDRSxVQUFrQixFQUNsQixPQUFnQztRQUVoQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RSxPQUFPLEVBQUUsVUFBVSxZQUFBLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDMUUsQ0FBQztJQUVELHVGQUF1RjtJQUN2RixxQ0FBTSxHQUFOLFVBQVUsVUFBa0IsRUFBRSxRQUFpQjtRQUM3QyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRSxPQUFPLEVBQUUsVUFBVSxZQUFBLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLFVBQUEsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFsQ0QsSUFrQ0M7O0FBRUQ7O0dBRUc7QUFDSCxNQUFNLENBQUMsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFFL0Q7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLDBCQUEwQixDQUFDLFNBQW9CO0lBQzdELFNBQVMsR0FBRyxTQUFTLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUN6RSxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDdEMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFoRCxDQUFnRCxDQUN0RCxDQUFDO0lBQ0YsNEJBQVksU0FBUyxJQUFFLE9BQU8sU0FBQSxJQUFHO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlQWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUtYWN0aW9uJztcbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcblxuZXhwb3J0IGVudW0gQ2hhbmdlU2V0T3BlcmF0aW9uIHtcbiAgQWRkID0gJ0FkZCcsXG4gIERlbGV0ZSA9ICdEZWxldGUnLFxuICBVcGRhdGUgPSAnVXBkYXRlJyxcbiAgVXBzZXJ0ID0gJ1Vwc2VydCcsXG59XG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldEFkZDxUID0gYW55PiB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBUW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0RGVsZXRlIHtcbiAgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXRpZXM6IHN0cmluZ1tdIHwgbnVtYmVyW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0VXBkYXRlPFQgPSBhbnk+IHtcbiAgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXRpZXM6IFVwZGF0ZTxUPltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldFVwc2VydDxUID0gYW55PiB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0O1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBUW107XG59XG5cbi8qKlxuICogQSBlbnRpdGllcyBvZiBhIHNpbmdsZSBlbnRpdHkgdHlwZSwgd2hpY2ggYXJlIGNoYW5nZWQgaW4gdGhlIHNhbWUgd2F5IGJ5IGEgQ2hhbmdlU2V0T3BlcmF0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5nZVNldEl0ZW0gPVxuICB8IENoYW5nZVNldEFkZFxuICB8IENoYW5nZVNldERlbGV0ZVxuICB8IENoYW5nZVNldFVwZGF0ZVxuICB8IENoYW5nZVNldFVwc2VydDtcblxuLypcbiAqIEEgc2V0IG9mIGVudGl0eSBDaGFuZ2VzLCB0eXBpY2FsbHkgdG8gYmUgc2F2ZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlU2V0PFQgPSBhbnk+IHtcbiAgLyoqIEFuIGFycmF5IG9mIENoYW5nZVNldEl0ZW1zIHRvIGJlIHByb2Nlc3NlZCBpbiB0aGUgYXJyYXkgb3JkZXIgKi9cbiAgY2hhbmdlczogQ2hhbmdlU2V0SXRlbVtdO1xuXG4gIC8qKlxuICAgKiBBbiBhcmJpdHJhcnksIHNlcmlhbGl6YWJsZSBvYmplY3QgdGhhdCBzaG91bGQgdHJhdmVsIHdpdGggdGhlIENoYW5nZVNldC5cbiAgICogTWVhbmluZ2Z1bCB0byB0aGUgQ2hhbmdlU2V0IHByb2R1Y2VyIGFuZCBjb25zdW1lci4gSWdub3JlZCBieSBuZ3J4LWRhdGEuXG4gICAqL1xuICBleHRyYXM/OiBUO1xuXG4gIC8qKiBBbiBhcmJpdHJhcnkgc3RyaW5nLCBpZGVudGlmeWluZyB0aGUgQ2hhbmdlU2V0IGFuZCBwZXJoYXBzIGl0cyBwdXJwb3NlICovXG4gIHRhZz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBGYWN0b3J5IHRvIGNyZWF0ZSBhIENoYW5nZVNldEl0ZW0gZm9yIGEgQ2hhbmdlU2V0T3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGFuZ2VTZXRJdGVtRmFjdG9yeSB7XG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldEFkZCBmb3IgbmV3IGVudGl0aWVzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICBhZGQ8VD4oZW50aXR5TmFtZTogc3RyaW5nLCBlbnRpdGllczogVCB8IFRbXSk6IENoYW5nZVNldEFkZDxUPiB7XG4gICAgZW50aXRpZXMgPSBBcnJheS5pc0FycmF5KGVudGl0aWVzKSA/IGVudGl0aWVzIDogZW50aXRpZXMgPyBbZW50aXRpZXNdIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5BZGQsIGVudGl0aWVzIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXREZWxldGUgZm9yIHByaW1hcnkga2V5cyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgZGVsZXRlKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBrZXlzOiBudW1iZXIgfCBudW1iZXJbXSB8IHN0cmluZyB8IHN0cmluZ1tdXG4gICk6IENoYW5nZVNldERlbGV0ZSB7XG4gICAgY29uc3QgaWRzID0gQXJyYXkuaXNBcnJheShrZXlzKVxuICAgICAgPyBrZXlzXG4gICAgICA6IGtleXNcbiAgICAgICAgPyAoW2tleXNdIGFzIHN0cmluZ1tdIHwgbnVtYmVyW10pXG4gICAgICAgIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGUsIGVudGl0aWVzOiBpZHMgfTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldFVwZGF0ZSBmb3IgVXBkYXRlcyBvZiBlbnRpdGllcyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgdXBkYXRlPFQgZXh0ZW5kcyB7IGlkOiBzdHJpbmcgfCBudW1iZXIgfT4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHVwZGF0ZXM6IFVwZGF0ZTxUPiB8IFVwZGF0ZTxUPltdXG4gICk6IENoYW5nZVNldFVwZGF0ZTxUPiB7XG4gICAgdXBkYXRlcyA9IEFycmF5LmlzQXJyYXkodXBkYXRlcykgPyB1cGRhdGVzIDogdXBkYXRlcyA/IFt1cGRhdGVzXSA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlLCBlbnRpdGllczogdXBkYXRlcyB9O1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0VXBzZXJ0IGZvciBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIHVwc2VydDxUPihlbnRpdHlOYW1lOiBzdHJpbmcsIGVudGl0aWVzOiBUIHwgVFtdKTogQ2hhbmdlU2V0VXBzZXJ0PFQ+IHtcbiAgICBlbnRpdGllcyA9IEFycmF5LmlzQXJyYXkoZW50aXRpZXMpID8gZW50aXRpZXMgOiBlbnRpdGllcyA/IFtlbnRpdGllc10gOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydCwgZW50aXRpZXMgfTtcbiAgfVxufVxuXG4vKipcbiAqIEluc3RhbmNlIG9mIGEgZmFjdG9yeSB0byBjcmVhdGUgYSBDaGFuZ2VTZXRJdGVtIGZvciBhIENoYW5nZVNldE9wZXJhdGlvblxuICovXG5leHBvcnQgY29uc3QgY2hhbmdlU2V0SXRlbUZhY3RvcnkgPSBuZXcgQ2hhbmdlU2V0SXRlbUZhY3RvcnkoKTtcblxuLyoqXG4gKiBSZXR1cm4gQ2hhbmdlU2V0IGFmdGVyIGZpbHRlcmluZyBvdXQgbnVsbCBhbmQgZW1wdHkgQ2hhbmdlU2V0SXRlbXMuXG4gKiBAcGFyYW0gY2hhbmdlU2V0IENoYW5nZVNldCB3aXRoIGNoYW5nZXMgdG8gZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gIGNoYW5nZVNldCA9IGNoYW5nZVNldCAmJiBjaGFuZ2VTZXQuY2hhbmdlcyA/IGNoYW5nZVNldCA6IHsgY2hhbmdlczogW10gfTtcbiAgY29uc3QgY2hhbmdlcyA9IGNoYW5nZVNldC5jaGFuZ2VzLmZpbHRlcihcbiAgICBjID0+IGMgIT0gbnVsbCAmJiBjLmVudGl0aWVzICYmIGMuZW50aXRpZXMubGVuZ3RoID4gMFxuICApO1xuICByZXR1cm4geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfTtcbn1cbiJdfQ==