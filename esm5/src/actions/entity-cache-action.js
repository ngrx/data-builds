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
 * Generated from: src/actions/entity-cache-action.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export { ChangeSetOperation } from './entity-cache-change-set';
import { MergeStrategy } from '../actions/merge-strategy';
/** @enum {string} */
var EntityCacheAction = {
    CLEAR_COLLECTIONS: "@ngrx/data/entity-cache/clear-collections",
    LOAD_COLLECTIONS: "@ngrx/data/entity-cache/load-collections",
    MERGE_QUERY_SET: "@ngrx/data/entity-cache/merge-query-set",
    SET_ENTITY_CACHE: "@ngrx/data/entity-cache/set-cache",
    SAVE_ENTITIES: "@ngrx/data/entity-cache/save-entities",
    SAVE_ENTITIES_CANCEL: "@ngrx/data/entity-cache/save-entities-cancel",
    SAVE_ENTITIES_CANCELED: "@ngrx/data/entity-cache/save-entities-canceled",
    SAVE_ENTITIES_ERROR: "@ngrx/data/entity-cache/save-entities-error",
    SAVE_ENTITIES_SUCCESS: "@ngrx/data/entity-cache/save-entities-success",
};
export { EntityCacheAction };
/**
 * Hash of entities keyed by EntityCollection name,
 * typically the result of a query that returned results from a multi-collection query
 * that will be merged into an EntityCache via the `MergeQuerySet` action.
 * @record
 */
export function EntityCacheQuerySet() { }
/**
 * Clear the collections identified in the collectionSet.
 * @param [collections] Array of names of the collections to clear.
 * If empty array, does nothing. If no array, clear all collections.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
var /**
 * Clear the collections identified in the collectionSet.
 * @param [collections] Array of names of the collections to clear.
 * If empty array, does nothing. If no array, clear all collections.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
ClearCollections = /** @class */ (function () {
    function ClearCollections(collections, tag) {
        this.type = EntityCacheAction.CLEAR_COLLECTIONS;
        this.payload = { collections: collections, tag: tag };
    }
    return ClearCollections;
}());
/**
 * Clear the collections identified in the collectionSet.
 * @param [collections] Array of names of the collections to clear.
 * If empty array, does nothing. If no array, clear all collections.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export { ClearCollections };
if (false) {
    /** @type {?} */
    ClearCollections.prototype.payload;
    /** @type {?} */
    ClearCollections.prototype.type;
}
/**
 * Create entity cache action that loads multiple entity collections at the same time.
 * before any selectors$ observables emit.
 * @param querySet The collections to load, typically the result of a query.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 * in the form of a map of entity collections.
 */
var /**
 * Create entity cache action that loads multiple entity collections at the same time.
 * before any selectors$ observables emit.
 * @param querySet The collections to load, typically the result of a query.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 * in the form of a map of entity collections.
 */
LoadCollections = /** @class */ (function () {
    function LoadCollections(collections, tag) {
        this.type = EntityCacheAction.LOAD_COLLECTIONS;
        this.payload = { collections: collections, tag: tag };
    }
    return LoadCollections;
}());
/**
 * Create entity cache action that loads multiple entity collections at the same time.
 * before any selectors$ observables emit.
 * @param querySet The collections to load, typically the result of a query.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 * in the form of a map of entity collections.
 */
export { LoadCollections };
if (false) {
    /** @type {?} */
    LoadCollections.prototype.payload;
    /** @type {?} */
    LoadCollections.prototype.type;
}
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
var /**
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
MergeQuerySet = /** @class */ (function () {
    function MergeQuerySet(querySet, mergeStrategy, tag) {
        this.type = EntityCacheAction.MERGE_QUERY_SET;
        this.payload = {
            querySet: querySet,
            mergeStrategy: mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy,
            tag: tag,
        };
    }
    return MergeQuerySet;
}());
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
export { MergeQuerySet };
if (false) {
    /** @type {?} */
    MergeQuerySet.prototype.payload;
    /** @type {?} */
    MergeQuerySet.prototype.type;
}
/**
 * Create entity cache action for replacing the entire entity cache.
 * Dangerous because brute force but useful as when re-hydrating an EntityCache
 * from local browser storage when the application launches.
 * @param cache New state of the entity cache
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
var /**
 * Create entity cache action for replacing the entire entity cache.
 * Dangerous because brute force but useful as when re-hydrating an EntityCache
 * from local browser storage when the application launches.
 * @param cache New state of the entity cache
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
SetEntityCache = /** @class */ (function () {
    function SetEntityCache(cache, tag) {
        this.cache = cache;
        this.type = EntityCacheAction.SET_ENTITY_CACHE;
        this.payload = { cache: cache, tag: tag };
    }
    return SetEntityCache;
}());
/**
 * Create entity cache action for replacing the entire entity cache.
 * Dangerous because brute force but useful as when re-hydrating an EntityCache
 * from local browser storage when the application launches.
 * @param cache New state of the entity cache
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export { SetEntityCache };
if (false) {
    /** @type {?} */
    SetEntityCache.prototype.payload;
    /** @type {?} */
    SetEntityCache.prototype.type;
    /** @type {?} */
    SetEntityCache.prototype.cache;
}
// #region SaveEntities
var 
// #region SaveEntities
SaveEntities = /** @class */ (function () {
    function SaveEntities(changeSet, url, options) {
        this.type = EntityCacheAction.SAVE_ENTITIES;
        options = options || {};
        if (changeSet) {
            changeSet.tag = changeSet.tag || options.tag;
        }
        this.payload = __assign(__assign({ changeSet: changeSet, url: url }, options), { tag: changeSet.tag });
    }
    return SaveEntities;
}());
// #region SaveEntities
export { SaveEntities };
if (false) {
    /** @type {?} */
    SaveEntities.prototype.payload;
    /** @type {?} */
    SaveEntities.prototype.type;
}
var SaveEntitiesCancel = /** @class */ (function () {
    function SaveEntitiesCancel(correlationId, reason, entityNames, tag) {
        this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
        this.payload = { correlationId: correlationId, reason: reason, entityNames: entityNames, tag: tag };
    }
    return SaveEntitiesCancel;
}());
export { SaveEntitiesCancel };
if (false) {
    /** @type {?} */
    SaveEntitiesCancel.prototype.payload;
    /** @type {?} */
    SaveEntitiesCancel.prototype.type;
}
var SaveEntitiesCanceled = /** @class */ (function () {
    function SaveEntitiesCanceled(correlationId, reason, tag) {
        this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
        this.payload = { correlationId: correlationId, reason: reason, tag: tag };
    }
    return SaveEntitiesCanceled;
}());
export { SaveEntitiesCanceled };
if (false) {
    /** @type {?} */
    SaveEntitiesCanceled.prototype.payload;
    /** @type {?} */
    SaveEntitiesCanceled.prototype.type;
}
var SaveEntitiesError = /** @class */ (function () {
    function SaveEntitiesError(error, originalAction) {
        this.type = EntityCacheAction.SAVE_ENTITIES_ERROR;
        /** @type {?} */
        var correlationId = originalAction.payload.correlationId;
        this.payload = { error: error, originalAction: originalAction, correlationId: correlationId };
    }
    return SaveEntitiesError;
}());
export { SaveEntitiesError };
if (false) {
    /** @type {?} */
    SaveEntitiesError.prototype.payload;
    /** @type {?} */
    SaveEntitiesError.prototype.type;
}
var SaveEntitiesSuccess = /** @class */ (function () {
    function SaveEntitiesSuccess(changeSet, url, options) {
        this.type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
        options = options || {};
        if (changeSet) {
            changeSet.tag = changeSet.tag || options.tag;
        }
        this.payload = __assign(__assign({ changeSet: changeSet, url: url }, options), { tag: changeSet.tag });
    }
    return SaveEntitiesSuccess;
}());
export { SaveEntitiesSuccess };
if (false) {
    /** @type {?} */
    SaveEntitiesSuccess.prototype.payload;
    /** @type {?} */
    SaveEntitiesSuccess.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxPQUFPLEVBQWEsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUsxRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBRTFELElBQVksaUJBQWlCO0lBQzNCLGlCQUFpQiw2Q0FBOEM7SUFDL0QsZ0JBQWdCLDRDQUE2QztJQUM3RCxlQUFlLDJDQUE0QztJQUMzRCxnQkFBZ0IscUNBQXNDO0lBRXRELGFBQWEseUNBQTBDO0lBQ3ZELG9CQUFvQixnREFBaUQ7SUFDckUsc0JBQXNCLGtEQUFtRDtJQUN6RSxtQkFBbUIsK0NBQWdEO0lBQ25FLHFCQUFxQixpREFBa0Q7RUFDeEU7Ozs7Ozs7O0FBT0QseUNBRUM7Ozs7Ozs7QUFRRDs7Ozs7OztJQUlFLDBCQUFZLFdBQXNCLEVBQUUsR0FBWTtRQUZ2QyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7UUFHbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFdBQVcsYUFBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7Ozs7Ozs7Ozs7SUFOQyxtQ0FBMkQ7O0lBQzNELGdDQUFvRDs7Ozs7Ozs7O0FBY3REOzs7Ozs7OztJQUlFLHlCQUFZLFdBQWdDLEVBQUUsR0FBWTtRQUZqRCxTQUFJLEdBQUcsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7UUFHakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFdBQVcsYUFBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7Ozs7Ozs7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RDtJQWFFLDZCQUNFLFNBQW9CLEVBQ3BCLEdBQVcsRUFDWCxPQUE2QjtRQUx0QixTQUFJLEdBQUcsaUJBQWlCLENBQUMscUJBQXFCLENBQUM7UUFPdEQsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDeEIsSUFBSSxTQUFTLEVBQUU7WUFDYixTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUM5QztRQUNELElBQUksQ0FBQyxPQUFPLHVCQUFLLFNBQVMsV0FBQSxFQUFFLEdBQUcsS0FBQSxJQUFLLE9BQU8sS0FBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsR0FBRSxDQUFDO0lBQ3BFLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7Ozs7SUF2QkMsc0NBU0U7O0lBQ0YsbUNBQXdEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEFjdGlvbnMgZGVkaWNhdGVkIHRvIHRoZSBFbnRpdHlDYWNoZSBhcyBhIHdob2xlXG4gKi9cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgQ2hhbmdlU2V0LCBDaGFuZ2VTZXRPcGVyYXRpb24gfSBmcm9tICcuL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmV4cG9ydCB7IENoYW5nZVNldCwgQ2hhbmdlU2V0T3BlcmF0aW9uIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG5leHBvcnQgZW51bSBFbnRpdHlDYWNoZUFjdGlvbiB7XG4gIENMRUFSX0NPTExFQ1RJT05TID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL2NsZWFyLWNvbGxlY3Rpb25zJyxcbiAgTE9BRF9DT0xMRUNUSU9OUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9sb2FkLWNvbGxlY3Rpb25zJyxcbiAgTUVSR0VfUVVFUllfU0VUID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL21lcmdlLXF1ZXJ5LXNldCcsXG4gIFNFVF9FTlRJVFlfQ0FDSEUgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2V0LWNhY2hlJyxcblxuICBTQVZFX0VOVElUSUVTID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL3NhdmUtZW50aXRpZXMnLFxuICBTQVZFX0VOVElUSUVTX0NBTkNFTCA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzLWNhbmNlbCcsXG4gIFNBVkVfRU5USVRJRVNfQ0FOQ0VMRUQgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1jYW5jZWxlZCcsXG4gIFNBVkVfRU5USVRJRVNfRVJST1IgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1lcnJvcicsXG4gIFNBVkVfRU5USVRJRVNfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzLXN1Y2Nlc3MnLFxufVxuXG4vKipcbiAqIEhhc2ggb2YgZW50aXRpZXMga2V5ZWQgYnkgRW50aXR5Q29sbGVjdGlvbiBuYW1lLFxuICogdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeSB0aGF0IHJldHVybmVkIHJlc3VsdHMgZnJvbSBhIG11bHRpLWNvbGxlY3Rpb24gcXVlcnlcbiAqIHRoYXQgd2lsbCBiZSBtZXJnZWQgaW50byBhbiBFbnRpdHlDYWNoZSB2aWEgdGhlIGBNZXJnZVF1ZXJ5U2V0YCBhY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q2FjaGVRdWVyeVNldCB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBhbnlbXTtcbn1cblxuLyoqXG4gKiBDbGVhciB0aGUgY29sbGVjdGlvbnMgaWRlbnRpZmllZCBpbiB0aGUgY29sbGVjdGlvblNldC5cbiAqIEBwYXJhbSBbY29sbGVjdGlvbnNdIEFycmF5IG9mIG5hbWVzIG9mIHRoZSBjb2xsZWN0aW9ucyB0byBjbGVhci5cbiAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgQ2xlYXJDb2xsZWN0aW9ucyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHsgY29sbGVjdGlvbnM/OiBzdHJpbmdbXTsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUztcblxuICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9ucz86IHN0cmluZ1tdLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGNvbGxlY3Rpb25zLCB0YWcgfTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBlbnRpdHkgY2FjaGUgYWN0aW9uIHRoYXQgbG9hZHMgbXVsdGlwbGUgZW50aXR5IGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gKiBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAqIEBwYXJhbSBxdWVyeVNldCBUaGUgY29sbGVjdGlvbnMgdG8gbG9hZCwgdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeS5cbiAqIEBwYXJhbSBbdGFnXSBPcHRpb25hbCB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gKiBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2FkQ29sbGVjdGlvbnMgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNvbGxlY3Rpb25zOiBFbnRpdHlDYWNoZVF1ZXJ5U2V0OyB0YWc/OiBzdHJpbmcgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM7XG5cbiAgY29uc3RydWN0b3IoY29sbGVjdGlvbnM6IEVudGl0eUNhY2hlUXVlcnlTZXQsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY29sbGVjdGlvbnMsIHRhZyB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gdGhhdCBtZXJnZXMgZW50aXRpZXMgZnJvbSBhIHF1ZXJ5IHJlc3VsdFxuICogdGhhdCByZXR1cm5lZCBlbnRpdGllcyBmcm9tIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICogQ29ycmVzcG9uZGluZyBlbnRpdHkgY2FjaGUgcmVkdWNlciBzaG91bGQgYWRkIGFuZCB1cGRhdGUgYWxsIGNvbGxlY3Rpb25zXG4gKiBhdCB0aGUgc2FtZSB0aW1lLCBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAqIEBwYXJhbSBxdWVyeVNldCBUaGUgcmVzdWx0IG9mIHRoZSBxdWVyeSBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKiBUaGVzZSBhcmUgdGhlIGVudGl0eSBkYXRhIHRvIG1lcmdlIGludG8gdGhlIHJlc3BlY3RpdmUgY29sbGVjdGlvbnMuXG4gKiBAcGFyYW0gbWVyZ2VTdHJhdGVneSBIb3cgdG8gbWVyZ2UgYSBxdWVyaWVkIGVudGl0eSB3aGVuIGl0IGlzIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlc1xuICogQHBhcmFtIFt0YWddIE9wdGlvbmFsIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1lcmdlUXVlcnlTZXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQ7XG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3k7XG4gICAgdGFnPzogc3RyaW5nO1xuICB9O1xuXG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQsXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgdGFnPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMucGF5bG9hZCA9IHtcbiAgICAgIHF1ZXJ5U2V0LFxuICAgICAgbWVyZ2VTdHJhdGVneTpcbiAgICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gZm9yIHJlcGxhY2luZyB0aGUgZW50aXJlIGVudGl0eSBjYWNoZS5cbiAqIERhbmdlcm91cyBiZWNhdXNlIGJydXRlIGZvcmNlIGJ1dCB1c2VmdWwgYXMgd2hlbiByZS1oeWRyYXRpbmcgYW4gRW50aXR5Q2FjaGVcbiAqIGZyb20gbG9jYWwgYnJvd3NlciBzdG9yYWdlIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGxhdW5jaGVzLlxuICogQHBhcmFtIGNhY2hlIE5ldyBzdGF0ZSBvZiB0aGUgZW50aXR5IGNhY2hlXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgU2V0RW50aXR5Q2FjaGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNhY2hlOiBFbnRpdHlDYWNoZTsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjYWNoZTogRW50aXR5Q2FjaGUsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY2FjaGUsIHRhZyB9O1xuICB9XG59XG5cbi8vICNyZWdpb24gU2F2ZUVudGl0aWVzXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNoYW5nZVNldDogQ2hhbmdlU2V0O1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gICAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBFcnJvcjtcbiAgICBza2lwPzogYm9vbGVhbjsgLy8gbm90IHVzZWRcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2hhbmdlU2V0OiBDaGFuZ2VTZXQsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgY2hhbmdlU2V0LnRhZyA9IGNoYW5nZVNldC50YWcgfHwgb3B0aW9ucy50YWc7XG4gICAgfVxuICAgIHRoaXMucGF5bG9hZCA9IHsgY2hhbmdlU2V0LCB1cmwsIC4uLm9wdGlvbnMsIHRhZzogY2hhbmdlU2V0LnRhZyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNDYW5jZWwgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgY29ycmVsYXRpb25JZDogYW55O1xuICAgIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgICByZWFkb25seSBlbnRpdHlOYW1lcz86IHN0cmluZ1tdO1xuICAgIHJlYWRvbmx5IHRhZz86IHN0cmluZztcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgZW50aXR5TmFtZXM/OiBzdHJpbmdbXSxcbiAgICB0YWc/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb3JyZWxhdGlvbklkLCByZWFzb24sIGVudGl0eU5hbWVzLCB0YWcgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzQ2FuY2VsZWQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgY29ycmVsYXRpb25JZDogYW55O1xuICAgIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDtcblxuICBjb25zdHJ1Y3Rvcihjb3JyZWxhdGlvbklkOiBhbnksIHJlYXNvbj86IHN0cmluZywgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb3JyZWxhdGlvbklkLCByZWFzb24sIHRhZyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNFcnJvciB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHtcbiAgICByZWFkb25seSBlcnJvcjogRGF0YVNlcnZpY2VFcnJvcjtcbiAgICByZWFkb25seSBvcmlnaW5hbEFjdGlvbjogU2F2ZUVudGl0aWVzO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ6IGFueTtcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I7XG4gIGNvbnN0cnVjdG9yKGVycm9yOiBEYXRhU2VydmljZUVycm9yLCBvcmlnaW5hbEFjdGlvbjogU2F2ZUVudGl0aWVzKSB7XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZDtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGVycm9yLCBvcmlnaW5hbEFjdGlvbiwgY29ycmVsYXRpb25JZCB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNTdWNjZXNzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNoYW5nZVNldDogQ2hhbmdlU2V0O1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gICAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBFcnJvcjtcbiAgICBza2lwPzogYm9vbGVhbjsgLy8gbm90IHVzZWRcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjaGFuZ2VTZXQ6IENoYW5nZVNldCxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICBjaGFuZ2VTZXQudGFnID0gY2hhbmdlU2V0LnRhZyB8fCBvcHRpb25zLnRhZztcbiAgICB9XG4gICAgdGhpcy5wYXlsb2FkID0geyBjaGFuZ2VTZXQsIHVybCwgLi4ub3B0aW9ucywgdGFnOiBjaGFuZ2VTZXQudGFnIH07XG4gIH1cbn1cbi8vICNlbmRyZWdpb24gU2F2ZUVudGl0aWVzXG4iXX0=