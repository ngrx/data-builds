(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/entity-cache-change-set", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChangeSetOperation;
    (function (ChangeSetOperation) {
        ChangeSetOperation["Add"] = "Add";
        ChangeSetOperation["Delete"] = "Delete";
        ChangeSetOperation["Update"] = "Update";
        ChangeSetOperation["Upsert"] = "Upsert";
    })(ChangeSetOperation = exports.ChangeSetOperation || (exports.ChangeSetOperation = {}));
    /**
     * Factory to create a ChangeSetItem for a ChangeSetOperation
     */
    class ChangeSetItemFactory {
        /** Create the ChangeSetAdd for new entities of the given entity type */
        add(entityName, entities) {
            entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
            return { entityName, op: ChangeSetOperation.Add, entities };
        }
        /** Create the ChangeSetDelete for primary keys of the given entity type */
        delete(entityName, keys) {
            const ids = Array.isArray(keys)
                ? keys
                : keys
                    ? [keys]
                    : [];
            return { entityName, op: ChangeSetOperation.Delete, entities: ids };
        }
        /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
        update(entityName, updates) {
            updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
            return { entityName, op: ChangeSetOperation.Update, entities: updates };
        }
        /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
        upsert(entityName, entities) {
            entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
            return { entityName, op: ChangeSetOperation.Upsert, entities };
        }
    }
    exports.ChangeSetItemFactory = ChangeSetItemFactory;
    /**
     * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
     */
    exports.changeSetItemFactory = new ChangeSetItemFactory();
    /**
     * Return ChangeSet after filtering out null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    function excludeEmptyChangeSetItems(changeSet) {
        changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
        const changes = changeSet.changes.filter(c => c != null && c.entities && c.entities.length > 0);
        return Object.assign(Object.assign({}, changeSet), { changes });
    }
    exports.excludeEmptyChangeSetItems = excludeEmptyChangeSetItems;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFFQSxJQUFZLGtCQUtYO0lBTEQsV0FBWSxrQkFBa0I7UUFDNUIsaUNBQVcsQ0FBQTtRQUNYLHVDQUFpQixDQUFBO1FBQ2pCLHVDQUFpQixDQUFBO1FBQ2pCLHVDQUFpQixDQUFBO0lBQ25CLENBQUMsRUFMVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQUs3QjtJQW1ERDs7T0FFRztJQUNILE1BQWEsb0JBQW9CO1FBQy9CLHdFQUF3RTtRQUN4RSxHQUFHLENBQUksVUFBa0IsRUFBRSxRQUFpQjtZQUMxQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDOUQsQ0FBQztRQUVELDJFQUEyRTtRQUMzRSxNQUFNLENBQ0osVUFBa0IsRUFDbEIsSUFBMkM7WUFFM0MsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxJQUFJO2dCQUNOLENBQUMsQ0FBQyxJQUFJO29CQUNKLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBeUI7b0JBQ2pDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDVCxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3RFLENBQUM7UUFFRCxrRkFBa0Y7UUFDbEYsTUFBTSxDQUNKLFVBQWtCLEVBQ2xCLE9BQWdDO1lBRWhDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFDMUUsQ0FBQztRQUVELHVGQUF1RjtRQUN2RixNQUFNLENBQUksVUFBa0IsRUFBRSxRQUFpQjtZQUM3QyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDakUsQ0FBQztLQUNGO0lBbENELG9EQWtDQztJQUVEOztPQUVHO0lBQ1UsUUFBQSxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7SUFFL0Q7OztPQUdHO0lBQ0gsU0FBZ0IsMEJBQTBCLENBQUMsU0FBb0I7UUFDN0QsU0FBUyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3pFLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUN0QyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQ3RELENBQUM7UUFDRix1Q0FBWSxTQUFTLEtBQUUsT0FBTyxJQUFHO0lBQ25DLENBQUM7SUFORCxnRUFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmV4cG9ydCBlbnVtIENoYW5nZVNldE9wZXJhdGlvbiB7XG4gIEFkZCA9ICdBZGQnLFxuICBEZWxldGUgPSAnRGVsZXRlJyxcbiAgVXBkYXRlID0gJ1VwZGF0ZScsXG4gIFVwc2VydCA9ICdVcHNlcnQnLFxufVxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRBZGQ8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldERlbGV0ZSB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBzdHJpbmdbXSB8IG51bWJlcltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldFVwZGF0ZTxUID0gYW55PiB7XG4gIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0aWVzOiBVcGRhdGU8VD5bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VTZXRVcHNlcnQ8VCA9IGFueT4ge1xuICBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdGllczogVFtdO1xufVxuXG4vKipcbiAqIEEgZW50aXRpZXMgb2YgYSBzaW5nbGUgZW50aXR5IHR5cGUsIHdoaWNoIGFyZSBjaGFuZ2VkIGluIHRoZSBzYW1lIHdheSBieSBhIENoYW5nZVNldE9wZXJhdGlvblxuICovXG5leHBvcnQgdHlwZSBDaGFuZ2VTZXRJdGVtID1cbiAgfCBDaGFuZ2VTZXRBZGRcbiAgfCBDaGFuZ2VTZXREZWxldGVcbiAgfCBDaGFuZ2VTZXRVcGRhdGVcbiAgfCBDaGFuZ2VTZXRVcHNlcnQ7XG5cbi8qXG4gKiBBIHNldCBvZiBlbnRpdHkgQ2hhbmdlcywgdHlwaWNhbGx5IHRvIGJlIHNhdmVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNldDxUID0gYW55PiB7XG4gIC8qKiBBbiBhcnJheSBvZiBDaGFuZ2VTZXRJdGVtcyB0byBiZSBwcm9jZXNzZWQgaW4gdGhlIGFycmF5IG9yZGVyICovXG4gIGNoYW5nZXM6IENoYW5nZVNldEl0ZW1bXTtcblxuICAvKipcbiAgICogQW4gYXJiaXRyYXJ5LCBzZXJpYWxpemFibGUgb2JqZWN0IHRoYXQgc2hvdWxkIHRyYXZlbCB3aXRoIHRoZSBDaGFuZ2VTZXQuXG4gICAqIE1lYW5pbmdmdWwgdG8gdGhlIENoYW5nZVNldCBwcm9kdWNlciBhbmQgY29uc3VtZXIuIElnbm9yZWQgYnkgQG5ncngvZGF0YS5cbiAgICovXG4gIGV4dHJhcz86IFQ7XG5cbiAgLyoqIEFuIGFyYml0cmFyeSBzdHJpbmcsIGlkZW50aWZ5aW5nIHRoZSBDaGFuZ2VTZXQgYW5kIHBlcmhhcHMgaXRzIHB1cnBvc2UgKi9cbiAgdGFnPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgdG8gY3JlYXRlIGEgQ2hhbmdlU2V0SXRlbSBmb3IgYSBDaGFuZ2VTZXRPcGVyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIENoYW5nZVNldEl0ZW1GYWN0b3J5IHtcbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0QWRkIGZvciBuZXcgZW50aXRpZXMgb2YgdGhlIGdpdmVuIGVudGl0eSB0eXBlICovXG4gIGFkZDxUPihlbnRpdHlOYW1lOiBzdHJpbmcsIGVudGl0aWVzOiBUIHwgVFtdKTogQ2hhbmdlU2V0QWRkPFQ+IHtcbiAgICBlbnRpdGllcyA9IEFycmF5LmlzQXJyYXkoZW50aXRpZXMpID8gZW50aXRpZXMgOiBlbnRpdGllcyA/IFtlbnRpdGllc10gOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZCwgZW50aXRpZXMgfTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIENoYW5nZVNldERlbGV0ZSBmb3IgcHJpbWFyeSBrZXlzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICBkZWxldGUoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIGtleXM6IG51bWJlciB8IG51bWJlcltdIHwgc3RyaW5nIHwgc3RyaW5nW11cbiAgKTogQ2hhbmdlU2V0RGVsZXRlIHtcbiAgICBjb25zdCBpZHMgPSBBcnJheS5pc0FycmF5KGtleXMpXG4gICAgICA/IGtleXNcbiAgICAgIDoga2V5c1xuICAgICAgICA/IChba2V5c10gYXMgc3RyaW5nW10gfCBudW1iZXJbXSlcbiAgICAgICAgOiBbXTtcbiAgICByZXR1cm4geyBlbnRpdHlOYW1lLCBvcDogQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZSwgZW50aXRpZXM6IGlkcyB9O1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgQ2hhbmdlU2V0VXBkYXRlIGZvciBVcGRhdGVzIG9mIGVudGl0aWVzIG9mIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSAqL1xuICB1cGRhdGU8VCBleHRlbmRzIHsgaWQ6IHN0cmluZyB8IG51bWJlciB9PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgdXBkYXRlczogVXBkYXRlPFQ+IHwgVXBkYXRlPFQ+W11cbiAgKTogQ2hhbmdlU2V0VXBkYXRlPFQ+IHtcbiAgICB1cGRhdGVzID0gQXJyYXkuaXNBcnJheSh1cGRhdGVzKSA/IHVwZGF0ZXMgOiB1cGRhdGVzID8gW3VwZGF0ZXNdIDogW107XG4gICAgcmV0dXJuIHsgZW50aXR5TmFtZSwgb3A6IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGUsIGVudGl0aWVzOiB1cGRhdGVzIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBDaGFuZ2VTZXRVcHNlcnQgZm9yIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyBvZiB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgKi9cbiAgdXBzZXJ0PFQ+KGVudGl0eU5hbWU6IHN0cmluZywgZW50aXRpZXM6IFQgfCBUW10pOiBDaGFuZ2VTZXRVcHNlcnQ8VD4ge1xuICAgIGVudGl0aWVzID0gQXJyYXkuaXNBcnJheShlbnRpdGllcykgPyBlbnRpdGllcyA6IGVudGl0aWVzID8gW2VudGl0aWVzXSA6IFtdO1xuICAgIHJldHVybiB7IGVudGl0eU5hbWUsIG9wOiBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0LCBlbnRpdGllcyB9O1xuICB9XG59XG5cbi8qKlxuICogSW5zdGFuY2Ugb2YgYSBmYWN0b3J5IHRvIGNyZWF0ZSBhIENoYW5nZVNldEl0ZW0gZm9yIGEgQ2hhbmdlU2V0T3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBjaGFuZ2VTZXRJdGVtRmFjdG9yeSA9IG5ldyBDaGFuZ2VTZXRJdGVtRmFjdG9yeSgpO1xuXG4vKipcbiAqIFJldHVybiBDaGFuZ2VTZXQgYWZ0ZXIgZmlsdGVyaW5nIG91dCBudWxsIGFuZCBlbXB0eSBDaGFuZ2VTZXRJdGVtcy5cbiAqIEBwYXJhbSBjaGFuZ2VTZXQgQ2hhbmdlU2V0IHdpdGggY2hhbmdlcyB0byBmaWx0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgY2hhbmdlU2V0ID0gY2hhbmdlU2V0ICYmIGNoYW5nZVNldC5jaGFuZ2VzID8gY2hhbmdlU2V0IDogeyBjaGFuZ2VzOiBbXSB9O1xuICBjb25zdCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXMuZmlsdGVyKFxuICAgIGMgPT4gYyAhPSBudWxsICYmIGMuZW50aXRpZXMgJiYgYy5lbnRpdGllcy5sZW5ndGggPiAwXG4gICk7XG4gIHJldHVybiB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9O1xufVxuIl19