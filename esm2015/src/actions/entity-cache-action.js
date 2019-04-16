/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export { ChangeSetOperation } from './entity-cache-change-set';
import { MergeStrategy } from '../actions/merge-strategy';
/** @enum {string} */
const EntityCacheAction = {
    CLEAR_COLLECTIONS: '@ngrx/data/entity-cache/clear-collections',
    LOAD_COLLECTIONS: '@ngrx/data/entity-cache/load-collections',
    MERGE_QUERY_SET: '@ngrx/data/entity-cache/merge-query-set',
    SET_ENTITY_CACHE: '@ngrx/data/entity-cache/set-cache',
    SAVE_ENTITIES: '@ngrx/data/entity-cache/save-entities',
    SAVE_ENTITIES_CANCEL: '@ngrx/data/entity-cache/save-entities-cancel',
    SAVE_ENTITIES_CANCELED: '@ngrx/data/entity-cache/save-entities-canceled',
    SAVE_ENTITIES_ERROR: '@ngrx/data/entity-cache/save-entities-error',
    SAVE_ENTITIES_SUCCESS: '@ngrx/data/entity-cache/save-entities-success',
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
export class ClearCollections {
    /**
     * @param {?=} collections
     * @param {?=} tag
     */
    constructor(collections, tag) {
        this.type = EntityCacheAction.CLEAR_COLLECTIONS;
        this.payload = { collections, tag };
    }
}
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
export class LoadCollections {
    /**
     * @param {?} collections
     * @param {?=} tag
     */
    constructor(collections, tag) {
        this.type = EntityCacheAction.LOAD_COLLECTIONS;
        this.payload = { collections, tag };
    }
}
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
export class MergeQuerySet {
    /**
     * @param {?} querySet
     * @param {?=} mergeStrategy
     * @param {?=} tag
     */
    constructor(querySet, mergeStrategy, tag) {
        this.type = EntityCacheAction.MERGE_QUERY_SET;
        this.payload = {
            querySet,
            mergeStrategy: mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy,
            tag,
        };
    }
}
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
export class SetEntityCache {
    /**
     * @param {?} cache
     * @param {?=} tag
     */
    constructor(cache, tag) {
        this.cache = cache;
        this.type = EntityCacheAction.SET_ENTITY_CACHE;
        this.payload = { cache, tag };
    }
}
if (false) {
    /** @type {?} */
    SetEntityCache.prototype.payload;
    /** @type {?} */
    SetEntityCache.prototype.type;
    /** @type {?} */
    SetEntityCache.prototype.cache;
}
// #region SaveEntities
export class SaveEntities {
    /**
     * @param {?} changeSet
     * @param {?} url
     * @param {?=} options
     */
    constructor(changeSet, url, options) {
        this.type = EntityCacheAction.SAVE_ENTITIES;
        options = options || {};
        if (changeSet) {
            changeSet.tag = changeSet.tag || options.tag;
        }
        this.payload = Object.assign({ changeSet, url }, options, { tag: changeSet.tag });
    }
}
if (false) {
    /** @type {?} */
    SaveEntities.prototype.payload;
    /** @type {?} */
    SaveEntities.prototype.type;
}
export class SaveEntitiesCancel {
    /**
     * @param {?} correlationId
     * @param {?=} reason
     * @param {?=} entityNames
     * @param {?=} tag
     */
    constructor(correlationId, reason, entityNames, tag) {
        this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
        this.payload = { correlationId, reason, entityNames, tag };
    }
}
if (false) {
    /** @type {?} */
    SaveEntitiesCancel.prototype.payload;
    /** @type {?} */
    SaveEntitiesCancel.prototype.type;
}
export class SaveEntitiesCanceled {
    /**
     * @param {?} correlationId
     * @param {?=} reason
     * @param {?=} tag
     */
    constructor(correlationId, reason, tag) {
        this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
        this.payload = { correlationId, reason, tag };
    }
}
if (false) {
    /** @type {?} */
    SaveEntitiesCanceled.prototype.payload;
    /** @type {?} */
    SaveEntitiesCanceled.prototype.type;
}
export class SaveEntitiesError {
    /**
     * @param {?} error
     * @param {?} originalAction
     */
    constructor(error, originalAction) {
        this.type = EntityCacheAction.SAVE_ENTITIES_ERROR;
        /** @type {?} */
        const correlationId = originalAction.payload.correlationId;
        this.payload = { error, originalAction, correlationId };
    }
}
if (false) {
    /** @type {?} */
    SaveEntitiesError.prototype.payload;
    /** @type {?} */
    SaveEntitiesError.prototype.type;
}
export class SaveEntitiesSuccess {
    /**
     * @param {?} changeSet
     * @param {?} url
     * @param {?=} options
     */
    constructor(changeSet, url, options) {
        this.type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
        options = options || {};
        if (changeSet) {
            changeSet.tag = changeSet.tag || options.tag;
        }
        this.payload = Object.assign({ changeSet, url }, options, { tag: changeSet.tag });
    }
}
if (false) {
    /** @type {?} */
    SaveEntitiesSuccess.prototype.payload;
    /** @type {?} */
    SaveEntitiesSuccess.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFNQSxPQUFPLEVBQWEsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUsxRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7OztJQUd4RCxtQkFBb0IsMkNBQTJDO0lBQy9ELGtCQUFtQiwwQ0FBMEM7SUFDN0QsaUJBQWtCLHlDQUF5QztJQUMzRCxrQkFBbUIsbUNBQW1DO0lBRXRELGVBQWdCLHVDQUF1QztJQUN2RCxzQkFBdUIsOENBQThDO0lBQ3JFLHdCQUF5QixnREFBZ0Q7SUFDekUscUJBQXNCLDZDQUE2QztJQUNuRSx1QkFBd0IsK0NBQStDOzs7Ozs7Ozs7QUFRekUseUNBRUM7Ozs7Ozs7QUFRRCxNQUFNLE9BQU8sZ0JBQWdCOzs7OztJQUkzQixZQUFZLFdBQXNCLEVBQUUsR0FBWTtRQUZ2QyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7UUFHbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7OztJQU5DLG1DQUEyRDs7SUFDM0QsZ0NBQW9EOzs7Ozs7Ozs7QUFjdEQsTUFBTSxPQUFPLGVBQWU7Ozs7O0lBSTFCLFlBQVksV0FBZ0MsRUFBRSxHQUFZO1FBRmpELFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztRQUdqRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Q0FDRjs7O0lBTkMsa0NBQXFFOztJQUNyRSwrQkFBbUQ7Ozs7Ozs7Ozs7Ozs7QUFrQnJELE1BQU0sT0FBTyxhQUFhOzs7Ozs7SUFT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LElBQUksQ0FBQyxPQUFPLG1CQUFLLFNBQVMsRUFBRSxHQUFHLElBQUssT0FBTyxJQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRyxHQUFFLENBQUM7SUFDcEUsQ0FBQztDQUNGOzs7SUF2QkMsc0NBU0U7O0lBQ0YsbUNBQXdEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEFjdGlvbnMgZGVkaWNhdGVkIHRvIHRoZSBFbnRpdHlDYWNoZSBhcyBhIHdob2xlXG4gKi9cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgQ2hhbmdlU2V0LCBDaGFuZ2VTZXRPcGVyYXRpb24gfSBmcm9tICcuL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmV4cG9ydCB7IENoYW5nZVNldCwgQ2hhbmdlU2V0T3BlcmF0aW9uIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG5leHBvcnQgZW51bSBFbnRpdHlDYWNoZUFjdGlvbiB7XG4gIENMRUFSX0NPTExFQ1RJT05TID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL2NsZWFyLWNvbGxlY3Rpb25zJyxcbiAgTE9BRF9DT0xMRUNUSU9OUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9sb2FkLWNvbGxlY3Rpb25zJyxcbiAgTUVSR0VfUVVFUllfU0VUID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL21lcmdlLXF1ZXJ5LXNldCcsXG4gIFNFVF9FTlRJVFlfQ0FDSEUgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2V0LWNhY2hlJyxcblxuICBTQVZFX0VOVElUSUVTID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL3NhdmUtZW50aXRpZXMnLFxuICBTQVZFX0VOVElUSUVTX0NBTkNFTCA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzLWNhbmNlbCcsXG4gIFNBVkVfRU5USVRJRVNfQ0FOQ0VMRUQgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1jYW5jZWxlZCcsXG4gIFNBVkVfRU5USVRJRVNfRVJST1IgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1lcnJvcicsXG4gIFNBVkVfRU5USVRJRVNfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzLXN1Y2Nlc3MnLFxufVxuXG4vKipcbiAqIEhhc2ggb2YgZW50aXRpZXMga2V5ZWQgYnkgRW50aXR5Q29sbGVjdGlvbiBuYW1lLFxuICogdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeSB0aGF0IHJldHVybmVkIHJlc3VsdHMgZnJvbSBhIG11bHRpLWNvbGxlY3Rpb24gcXVlcnlcbiAqIHRoYXQgd2lsbCBiZSBtZXJnZWQgaW50byBhbiBFbnRpdHlDYWNoZSB2aWEgdGhlIGBNZXJnZVF1ZXJ5U2V0YCBhY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q2FjaGVRdWVyeVNldCB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBhbnlbXTtcbn1cblxuLyoqXG4gKiBDbGVhciB0aGUgY29sbGVjdGlvbnMgaWRlbnRpZmllZCBpbiB0aGUgY29sbGVjdGlvblNldC5cbiAqIEBwYXJhbSBbY29sbGVjdGlvbnNdIEFycmF5IG9mIG5hbWVzIG9mIHRoZSBjb2xsZWN0aW9ucyB0byBjbGVhci5cbiAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgQ2xlYXJDb2xsZWN0aW9ucyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHsgY29sbGVjdGlvbnM/OiBzdHJpbmdbXTsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUztcblxuICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9ucz86IHN0cmluZ1tdLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGNvbGxlY3Rpb25zLCB0YWcgfTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBlbnRpdHkgY2FjaGUgYWN0aW9uIHRoYXQgbG9hZHMgbXVsdGlwbGUgZW50aXR5IGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gKiBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAqIEBwYXJhbSBxdWVyeVNldCBUaGUgY29sbGVjdGlvbnMgdG8gbG9hZCwgdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeS5cbiAqIEBwYXJhbSBbdGFnXSBPcHRpb25hbCB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gKiBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2FkQ29sbGVjdGlvbnMgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNvbGxlY3Rpb25zOiBFbnRpdHlDYWNoZVF1ZXJ5U2V0OyB0YWc/OiBzdHJpbmcgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM7XG5cbiAgY29uc3RydWN0b3IoY29sbGVjdGlvbnM6IEVudGl0eUNhY2hlUXVlcnlTZXQsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY29sbGVjdGlvbnMsIHRhZyB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gdGhhdCBtZXJnZXMgZW50aXRpZXMgZnJvbSBhIHF1ZXJ5IHJlc3VsdFxuICogdGhhdCByZXR1cm5lZCBlbnRpdGllcyBmcm9tIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICogQ29ycmVzcG9uZGluZyBlbnRpdHkgY2FjaGUgcmVkdWNlciBzaG91bGQgYWRkIGFuZCB1cGRhdGUgYWxsIGNvbGxlY3Rpb25zXG4gKiBhdCB0aGUgc2FtZSB0aW1lLCBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAqIEBwYXJhbSBxdWVyeVNldCBUaGUgcmVzdWx0IG9mIHRoZSBxdWVyeSBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKiBUaGVzZSBhcmUgdGhlIGVudGl0eSBkYXRhIHRvIG1lcmdlIGludG8gdGhlIHJlc3BlY3RpdmUgY29sbGVjdGlvbnMuXG4gKiBAcGFyYW0gbWVyZ2VTdHJhdGVneSBIb3cgdG8gbWVyZ2UgYSBxdWVyaWVkIGVudGl0eSB3aGVuIGl0IGlzIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlc1xuICogQHBhcmFtIFt0YWddIE9wdGlvbmFsIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1lcmdlUXVlcnlTZXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQ7XG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3k7XG4gICAgdGFnPzogc3RyaW5nO1xuICB9O1xuXG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQsXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgdGFnPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMucGF5bG9hZCA9IHtcbiAgICAgIHF1ZXJ5U2V0LFxuICAgICAgbWVyZ2VTdHJhdGVneTpcbiAgICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gZm9yIHJlcGxhY2luZyB0aGUgZW50aXJlIGVudGl0eSBjYWNoZS5cbiAqIERhbmdlcm91cyBiZWNhdXNlIGJydXRlIGZvcmNlIGJ1dCB1c2VmdWwgYXMgd2hlbiByZS1oeWRyYXRpbmcgYW4gRW50aXR5Q2FjaGVcbiAqIGZyb20gbG9jYWwgYnJvd3NlciBzdG9yYWdlIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGxhdW5jaGVzLlxuICogQHBhcmFtIGNhY2hlIE5ldyBzdGF0ZSBvZiB0aGUgZW50aXR5IGNhY2hlXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICovXG5leHBvcnQgY2xhc3MgU2V0RW50aXR5Q2FjaGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNhY2hlOiBFbnRpdHlDYWNoZTsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjYWNoZTogRW50aXR5Q2FjaGUsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY2FjaGUsIHRhZyB9O1xuICB9XG59XG5cbi8vICNyZWdpb24gU2F2ZUVudGl0aWVzXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNoYW5nZVNldDogQ2hhbmdlU2V0O1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gICAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBFcnJvcjtcbiAgICBza2lwPzogYm9vbGVhbjsgLy8gbm90IHVzZWRcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2hhbmdlU2V0OiBDaGFuZ2VTZXQsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgY2hhbmdlU2V0LnRhZyA9IGNoYW5nZVNldC50YWcgfHwgb3B0aW9ucy50YWc7XG4gICAgfVxuICAgIHRoaXMucGF5bG9hZCA9IHsgY2hhbmdlU2V0LCB1cmwsIC4uLm9wdGlvbnMsIHRhZzogY2hhbmdlU2V0LnRhZyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNDYW5jZWwgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgY29ycmVsYXRpb25JZDogYW55O1xuICAgIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgICByZWFkb25seSBlbnRpdHlOYW1lcz86IHN0cmluZ1tdO1xuICAgIHJlYWRvbmx5IHRhZz86IHN0cmluZztcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgZW50aXR5TmFtZXM/OiBzdHJpbmdbXSxcbiAgICB0YWc/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb3JyZWxhdGlvbklkLCByZWFzb24sIGVudGl0eU5hbWVzLCB0YWcgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzQ2FuY2VsZWQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgY29ycmVsYXRpb25JZDogYW55O1xuICAgIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDtcblxuICBjb25zdHJ1Y3Rvcihjb3JyZWxhdGlvbklkOiBhbnksIHJlYXNvbj86IHN0cmluZywgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb3JyZWxhdGlvbklkLCByZWFzb24sIHRhZyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNFcnJvciB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHtcbiAgICByZWFkb25seSBlcnJvcjogRGF0YVNlcnZpY2VFcnJvcjtcbiAgICByZWFkb25seSBvcmlnaW5hbEFjdGlvbjogU2F2ZUVudGl0aWVzO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ6IGFueTtcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I7XG4gIGNvbnN0cnVjdG9yKGVycm9yOiBEYXRhU2VydmljZUVycm9yLCBvcmlnaW5hbEFjdGlvbjogU2F2ZUVudGl0aWVzKSB7XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZDtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGVycm9yLCBvcmlnaW5hbEFjdGlvbiwgY29ycmVsYXRpb25JZCB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYXZlRW50aXRpZXNTdWNjZXNzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNoYW5nZVNldDogQ2hhbmdlU2V0O1xuICAgIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gICAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gICAgZXJyb3I/OiBFcnJvcjtcbiAgICBza2lwPzogYm9vbGVhbjsgLy8gbm90IHVzZWRcbiAgfTtcbiAgcmVhZG9ubHkgdHlwZSA9IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjaGFuZ2VTZXQ6IENoYW5nZVNldCxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICBjaGFuZ2VTZXQudGFnID0gY2hhbmdlU2V0LnRhZyB8fCBvcHRpb25zLnRhZztcbiAgICB9XG4gICAgdGhpcy5wYXlsb2FkID0geyBjaGFuZ2VTZXQsIHVybCwgLi4ub3B0aW9ucywgdGFnOiBjaGFuZ2VTZXQudGFnIH07XG4gIH1cbn1cbi8vICNlbmRyZWdpb24gU2F2ZUVudGl0aWVzXG4iXX0=