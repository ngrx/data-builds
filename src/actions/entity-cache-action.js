(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/entity-cache-action", ["require", "exports", "@ngrx/data/src/actions/entity-cache-change-set", "@ngrx/data/src/actions/merge-strategy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var entity_cache_change_set_1 = require("@ngrx/data/src/actions/entity-cache-change-set");
    exports.ChangeSetOperation = entity_cache_change_set_1.ChangeSetOperation;
    const merge_strategy_1 = require("@ngrx/data/src/actions/merge-strategy");
    var EntityCacheAction;
    (function (EntityCacheAction) {
        EntityCacheAction["CLEAR_COLLECTIONS"] = "@ngrx/data/entity-cache/clear-collections";
        EntityCacheAction["LOAD_COLLECTIONS"] = "@ngrx/data/entity-cache/load-collections";
        EntityCacheAction["MERGE_QUERY_SET"] = "@ngrx/data/entity-cache/merge-query-set";
        EntityCacheAction["SET_ENTITY_CACHE"] = "@ngrx/data/entity-cache/set-cache";
        EntityCacheAction["SAVE_ENTITIES"] = "@ngrx/data/entity-cache/save-entities";
        EntityCacheAction["SAVE_ENTITIES_CANCEL"] = "@ngrx/data/entity-cache/save-entities-cancel";
        EntityCacheAction["SAVE_ENTITIES_CANCELED"] = "@ngrx/data/entity-cache/save-entities-canceled";
        EntityCacheAction["SAVE_ENTITIES_ERROR"] = "@ngrx/data/entity-cache/save-entities-error";
        EntityCacheAction["SAVE_ENTITIES_SUCCESS"] = "@ngrx/data/entity-cache/save-entities-success";
    })(EntityCacheAction = exports.EntityCacheAction || (exports.EntityCacheAction = {}));
    /**
     * Clear the collections identified in the collectionSet.
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If no array, clear all collections.
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    class ClearCollections {
        constructor(collections, tag) {
            this.type = EntityCacheAction.CLEAR_COLLECTIONS;
            this.payload = { collections, tag };
        }
    }
    exports.ClearCollections = ClearCollections;
    /**
     * Create entity cache action that loads multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param querySet The collections to load, typically the result of a query.
     * @param [tag] Optional tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    class LoadCollections {
        constructor(collections, tag) {
            this.type = EntityCacheAction.LOAD_COLLECTIONS;
            this.payload = { collections, tag };
        }
    }
    exports.LoadCollections = LoadCollections;
    /**
     * Create entity cache action that merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    class MergeQuerySet {
        constructor(querySet, mergeStrategy, tag) {
            this.type = EntityCacheAction.MERGE_QUERY_SET;
            this.payload = {
                querySet,
                mergeStrategy: mergeStrategy === null ? merge_strategy_1.MergeStrategy.PreserveChanges : mergeStrategy,
                tag,
            };
        }
    }
    exports.MergeQuerySet = MergeQuerySet;
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    class SetEntityCache {
        constructor(cache, tag) {
            this.cache = cache;
            this.type = EntityCacheAction.SET_ENTITY_CACHE;
            this.payload = { cache, tag };
        }
    }
    exports.SetEntityCache = SetEntityCache;
    // #region SaveEntities
    class SaveEntities {
        constructor(changeSet, url, options) {
            this.type = EntityCacheAction.SAVE_ENTITIES;
            options = options || {};
            if (changeSet) {
                changeSet.tag = changeSet.tag || options.tag;
            }
            this.payload = Object.assign(Object.assign({ changeSet, url }, options), { tag: changeSet.tag });
        }
    }
    exports.SaveEntities = SaveEntities;
    class SaveEntitiesCancel {
        constructor(correlationId, reason, entityNames, tag) {
            this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
            this.payload = { correlationId, reason, entityNames, tag };
        }
    }
    exports.SaveEntitiesCancel = SaveEntitiesCancel;
    class SaveEntitiesCanceled {
        constructor(correlationId, reason, tag) {
            this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
            this.payload = { correlationId, reason, tag };
        }
    }
    exports.SaveEntitiesCanceled = SaveEntitiesCanceled;
    class SaveEntitiesError {
        constructor(error, originalAction) {
            this.type = EntityCacheAction.SAVE_ENTITIES_ERROR;
            const correlationId = originalAction.payload.correlationId;
            this.payload = { error, originalAction, correlationId };
        }
    }
    exports.SaveEntitiesError = SaveEntitiesError;
    class SaveEntitiesSuccess {
        constructor(changeSet, url, options) {
            this.type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
            options = options || {};
            if (changeSet) {
                changeSet.tag = changeSet.tag || options.tag;
            }
            this.payload = Object.assign(Object.assign({ changeSet, url }, options), { tag: changeSet.tag });
        }
    }
    exports.SaveEntitiesSuccess = SaveEntitiesSuccess;
});
// #endregion SaveEntities
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBTUEsMEZBQTBFO0lBQXRELHVEQUFBLGtCQUFrQixDQUFBO0lBS3RDLDBFQUEwRDtJQUUxRCxJQUFZLGlCQVdYO0lBWEQsV0FBWSxpQkFBaUI7UUFDM0Isb0ZBQStELENBQUE7UUFDL0Qsa0ZBQTZELENBQUE7UUFDN0QsZ0ZBQTJELENBQUE7UUFDM0QsMkVBQXNELENBQUE7UUFFdEQsNEVBQXVELENBQUE7UUFDdkQsMEZBQXFFLENBQUE7UUFDckUsOEZBQXlFLENBQUE7UUFDekUsd0ZBQW1FLENBQUE7UUFDbkUsNEZBQXVFLENBQUE7SUFDekUsQ0FBQyxFQVhXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBVzVCO0lBV0Q7Ozs7O09BS0c7SUFDSCxNQUFhLGdCQUFnQjtRQUkzQixZQUFZLFdBQXNCLEVBQUUsR0FBWTtZQUZ2QyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7WUFHbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQ0Y7SUFQRCw0Q0FPQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQWEsZUFBZTtRQUkxQixZQUFZLFdBQWdDLEVBQUUsR0FBWTtZQUZqRCxTQUFJLEdBQUcsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7WUFHakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQ0Y7SUFQRCwwQ0FPQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSCxNQUFhLGFBQWE7UUFTeEIsWUFDRSxRQUE2QixFQUM3QixhQUE2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ZGVkaWNhdGVkIHRvIHRoZSBFbnRpdHlDYWNoZSBhcyBhIHdob2xlXG4gKi9cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgQ2hhbmdlU2V0LCBDaGFuZ2VTZXRPcGVyYXRpb24gfSBmcm9tICcuL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmV4cG9ydCB7IENoYW5nZVNldCwgQ2hhbmdlU2V0T3BlcmF0aW9uIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG5leHBvcnQgZW51bSBFbnRpdHlDYWNoZUFjdGlvbiB7XG4gIENMRUFSX0NPTExFQ1RJT05TID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL2NsZWFyLWNvbGxlY3Rpb25zJyxcbiAgTE9BRF9DT0xMRUNUSU9OUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9sb2FkLWNvbGxlY3Rpb25zJyxcbiAgTUVSR0VfUVVFUllfU0VUID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL21lcmdlLXF1ZXJ5LXNldCcsXG4gIFNFVF9FTlRJVFlfQ0FDSEUgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2V0LWNhY2hlJyxcblxuICBTQVZFX0VOVElUSUVTID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL3NhdmUtZW50aXRpZXMnLFxuICBTQVZFX0VOVElUSUVTX0NBTkNFTCA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzLWNhbmNlbCcsXG4gIFNBVkVfRU5USVRJRVNfQ0FOQ0VMRUQgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1jYW5jZWxlZCcsXG4gIFNBVkVfRU5USVRJRVNfRVJST1IgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1lcnJvcicsXG4gIFNBVkVfRU5USVRJRVNfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzLXN1Y2Nlc3MnLFxufVxuXG4vKipcbiAqIEhhc2ggb2YgZW50aXRpZXMga2V5ZWQgYnkgRW50aXR5Q29sbGVjdGlvbiBuYW1lLFxuICogdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeSB0aGF0IHJldHVybmVkIHJlc3VsdHMgZnJvbSBhIG11bHRpLWNvbGxlY3Rpb24gcXVlcnlcbiAqIHRoYXQgd2lsbCBiZSBtZXJnZWQgaW50byBhbiBFbnRpdHlDYWNoZSB2aWEgdGhlIGBNZXJnZVF1ZXJ5U2V0YCBhY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q2FjaGVRdWVyeVNldCB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBhbnlbXTtcbn1cblxuLyoqXG4gKiBDbGVhciB0aGUgY29sbGVjdGlvbnMgaWRlbnRpZmllZCBpbiB0aGUgY29sbGVjdGlvblNldC5cbiAqIEBwYXJhbSBbY29sbGVjdGlvbnNdIEFycmF5IG9mIG5hbWVzIG9mIHRoZSBjb2xsZWN0aW9ucyB0byBjbGVhci5cbiAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgQ2xlYXJDb2xsZWN0aW9ucyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHsgY29sbGVjdGlvbnM/OiBzdHJpbmdbXTsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUztcblxuICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9ucz86IHN0cmluZ1tdLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGNvbGxlY3Rpb25zLCB0YWcgfTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBlbnRpdHkgY2FjaGUgYWN0aW9uIHRoYXQgbG9hZHMgbXVsdGlwbGUgZW50aXR5IGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gKiBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAqIEBwYXJhbSBxdWVyeVNldCBUaGUgY29sbGVjdGlvbnMgdG8gbG9hZCwgdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeS5cbiAqIEBwYXJhbSBbdGFnXSBPcHRpb25hbCB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gKiBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2FkQ29sbGVjdGlvbnMgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNvbGxlY3Rpb25zOiBFbnRpdHlDYWNoZVF1ZXJ5U2V0OyB0YWc/OiBzdHJpbmcgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM7XG5cbiAgY29uc3RydWN0b3IoY29sbGVjdGlvbnM6IEVudGl0eUNhY2hlUXVlcnlTZXQsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY29sbGVjdGlvbnMsIHRhZyB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gdGhhdCBtZXJnZXMgZW50aXRpZXMgZnJvbSBhIHF1ZXJ5IHJlc3VsdFxuICogdGhhdCByZXR1cm5lZCBlbnRpdGllcyBmcm9tIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICogQ29ycmVzcG9uZGluZyBlbnRpdHkgY2FjaGUgcmVkdWNlciBzaG91bGQgYWRkIGFuZCB1cGRhdGUgYWxsIGNvbGxlY3Rpb25zXG4gKiBhdCB0aGUgc2FtZSB0aW1lLCBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAqIEBwYXJhbSBxdWVyeVNldCBUaGUgcmVzdWx0IG9mIHRoZSBxdWVyeSBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKiBUaGVzZSBhcmUgdGhlIGVudGl0eSBkYXRhIHRvIG1lcmdlIGludG8gdGhlIHJlc3BlY3RpdmUgY29sbGVjdGlvbnMuXG4gKiBAcGFyYW0gbWVyZ2VTdHJhdGVneSBIb3cgdG8gbWVyZ2UgYSBxdWVyaWVkIGVudGl0eSB3aGVuIGl0IGlzIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlc1xuICogQHBhcmFtIFt0YWddIE9wdGlvbmFsIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1lcmdlUXVlcnlTZXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQ7XG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3k7XG4gICAgdGFnPzogc3RyaW5nO1xuICB9O1xuXG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQsXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgdGFnPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMucGF5bG9hZCA9IHtcbiAgICAgIHF1ZXJ5U2V0LFxuICAgICAgbWVyZ2VTdHJhdGVneTpcbiAgICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gZm9yIHJlcGxhY2luZyB0aGUgZW50aXJlIGVudGl0eSBjYWNoZS5cbiAqIERhbmdlcm91cyBiZWNhdXNlIGJydXRlIGZvcmNlIGJ1dCB1c2VmdWwgYXMgd2hlbiByZS1oeWRyYXRpbmcgYW4gRW50aXR5Q2FjaGVcbiAqIGZyb20gbG9jYWwgYnJvd3NlciBzdG9yYWdlIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGxhdW5jaGVzLlxuICogQHBhcmFtIGNhY2hlIE5ldyBzdGF0ZSBvZiB0aGUgZW50aXR5IGNhY2hlXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgU2V0RW50aXR5Q2FjaGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNhY2hlOiBFbnRpdHlDYWNoZTsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjYWNoZTogRW50aXR5Q2FjaGUsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY2FjaGUsIHRhZyB9O1xuICB9XG59XG5cbi8vICNyZWdpb24gU2F2ZUVudGl0aWVzXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNoYW5nZVNldDogQ2hhbmdlU2V0O1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gICAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBFcnJvcjtcbiAgICBza2lwPzogYm9vbGVhbjsgLy8gbm90IHVzZWRcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2hhbmdlU2V0OiBDaGFuZ2VTZXQsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgY2hhbmdlU2V0LnRhZyA9IGNoYW5nZVNldC50YWcgfHwgb3B0aW9ucy50YWc7XG4gICAgfVxuICAgIHRoaXMucGF5bG9hZCA9IHsgY2hhbmdlU2V0LCB1cmwsIC4uLm9wdGlvbnMsIHRhZzogY2hhbmdlU2V0LnRhZyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNDYW5jZWwgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgY29ycmVsYXRpb25JZDogYW55O1xuICAgIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgICByZWFkb25seSBlbnRpdHlOYW1lcz86IHN0cmluZ1tdO1xuICAgIHJlYWRvbmx5IHRhZz86IHN0cmluZztcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgZW50aXR5TmFtZXM/OiBzdHJpbmdbXSxcbiAgICB0YWc/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb3JyZWxhdGlvbklkLCByZWFzb24sIGVudGl0eU5hbWVzLCB0YWcgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzQ2FuY2VsZWQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgY29ycmVsYXRpb25JZDogYW55O1xuICAgIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDtcblxuICBjb25zdHJ1Y3Rvcihjb3JyZWxhdGlvbklkOiBhbnksIHJlYXNvbj86IHN0cmluZywgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb3JyZWxhdGlvbklkLCByZWFzb24sIHRhZyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNFcnJvciB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHtcbiAgICByZWFkb25seSBlcnJvcjogRGF0YVNlcnZpY2VFcnJvcjtcbiAgICByZWFkb25seSBvcmlnaW5hbEFjdGlvbjogU2F2ZUVudGl0aWVzO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ6IGFueTtcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I7XG4gIGNvbnN0cnVjdG9yKGVycm9yOiBEYXRhU2VydmljZUVycm9yLCBvcmlnaW5hbEFjdGlvbjogU2F2ZUVudGl0aWVzKSB7XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZDtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGVycm9yLCBvcmlnaW5hbEFjdGlvbiwgY29ycmVsYXRpb25JZCB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNTdWNjZXNzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNoYW5nZVNldDogQ2hhbmdlU2V0O1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gICAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBFcnJvcjtcbiAgICBza2lwPzogYm9vbGVhbjsgLy8gbm90IHVzZWRcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjaGFuZ2VTZXQ6IENoYW5nZVNldCxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICBjaGFuZ2VTZXQudGFnID0gY2hhbmdlU2V0LnRhZyB8fCBvcHRpb25zLnRhZztcbiAgICB9XG4gICAgdGhpcy5wYXlsb2FkID0geyBjaGFuZ2VTZXQsIHVybCwgLi4ub3B0aW9ucywgdGFnOiBjaGFuZ2VTZXQudGFnIH07XG4gIH1cbn1cbi8vICNlbmRyZWdpb24gU2F2ZUVudGl0aWVzXG4iXX0=