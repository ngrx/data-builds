/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/actions/entity-cache-action.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export { ChangeSetOperation } from './entity-cache-change-set';
import { MergeStrategy } from '../actions/merge-strategy';
/** @enum {string} */
const EntityCacheAction = {
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
        this.payload = Object.assign(Object.assign({ changeSet, url }, options), { tag: changeSet.tag });
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
        this.payload = Object.assign(Object.assign({ changeSet, url }, options), { tag: changeSet.tag });
    }
}
if (false) {
    /** @type {?} */
    SaveEntitiesSuccess.prototype.payload;
    /** @type {?} */
    SaveEntitiesSuccess.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBTUEsT0FBTyxFQUFhLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFLMUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUUxRCxNQUFZLGlCQUFpQjtJQUMzQixpQkFBaUIsNkNBQThDO0lBQy9ELGdCQUFnQiw0Q0FBNkM7SUFDN0QsZUFBZSwyQ0FBNEM7SUFDM0QsZ0JBQWdCLHFDQUFzQztJQUV0RCxhQUFhLHlDQUEwQztJQUN2RCxvQkFBb0IsZ0RBQWlEO0lBQ3JFLHNCQUFzQixrREFBbUQ7SUFDekUsbUJBQW1CLCtDQUFnRDtJQUNuRSxxQkFBcUIsaURBQWtEO0VBQ3hFOzs7Ozs7OztBQU9ELHlDQUVDOzs7Ozs7O0FBUUQsTUFBTSxPQUFPLGdCQUFnQjs7Ozs7SUFJM0IsWUFBWSxXQUFzQixFQUFFLEdBQVk7UUFGdkMsU0FBSSxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO1FBR2xELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDdEMsQ0FBQztDQUNGOzs7SUFOQyxtQ0FBMkQ7O0lBQzNELGdDQUFvRDs7Ozs7Ozs7O0FBY3RELE1BQU0sT0FBTyxlQUFlOzs7OztJQUkxQixZQUFZLFdBQWdDLEVBQUUsR0FBWTtRQUZqRCxTQUFJLEdBQUcsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7UUFHakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7OztJQU5DLGtDQUFxRTs7SUFDckUsK0JBQW1EOzs7Ozs7Ozs7Ozs7O0FBa0JyRCxNQUFN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QUFHLENBQUM7U0FDOUM7UUFDRCxJQUFJLENBQUMsT0FBTyxpQ0FBSyxTQUFTLEVBQUUsR0FBRyxJQUFLLE9BQU8sS0FBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsR0FBRSxDQUFDO0lBQ3BFLENBQUM7Q0FDRjs7O0lBdkJDLHNDQVNFOztJQUNGLG1DQUF3RCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBBY3Rpb25zIGRlZGljYXRlZCB0byB0aGUgRW50aXR5Q2FjaGUgYXMgYSB3aG9sZVxuICovXG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IENoYW5nZVNldCwgQ2hhbmdlU2V0T3BlcmF0aW9uIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5leHBvcnQgeyBDaGFuZ2VTZXQsIENoYW5nZVNldE9wZXJhdGlvbiB9IGZyb20gJy4vZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcblxuZXhwb3J0IGVudW0gRW50aXR5Q2FjaGVBY3Rpb24ge1xuICBDTEVBUl9DT0xMRUNUSU9OUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9jbGVhci1jb2xsZWN0aW9ucycsXG4gIExPQURfQ09MTEVDVElPTlMgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvbG9hZC1jb2xsZWN0aW9ucycsXG4gIE1FUkdFX1FVRVJZX1NFVCA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9tZXJnZS1xdWVyeS1zZXQnLFxuICBTRVRfRU5USVRZX0NBQ0hFID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL3NldC1jYWNoZScsXG5cbiAgU0FWRV9FTlRJVElFUyA9ICdAbmdyeC9kYXRhL2VudGl0eS1jYWNoZS9zYXZlLWVudGl0aWVzJyxcbiAgU0FWRV9FTlRJVElFU19DQU5DRUwgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1jYW5jZWwnLFxuICBTQVZFX0VOVElUSUVTX0NBTkNFTEVEID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL3NhdmUtZW50aXRpZXMtY2FuY2VsZWQnLFxuICBTQVZFX0VOVElUSUVTX0VSUk9SID0gJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlL3NhdmUtZW50aXRpZXMtZXJyb3InLFxuICBTQVZFX0VOVElUSUVTX1NVQ0NFU1MgPSAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUvc2F2ZS1lbnRpdGllcy1zdWNjZXNzJyxcbn1cblxuLyoqXG4gKiBIYXNoIG9mIGVudGl0aWVzIGtleWVkIGJ5IEVudGl0eUNvbGxlY3Rpb24gbmFtZSxcbiAqIHR5cGljYWxseSB0aGUgcmVzdWx0IG9mIGEgcXVlcnkgdGhhdCByZXR1cm5lZCByZXN1bHRzIGZyb20gYSBtdWx0aS1jb2xsZWN0aW9uIHF1ZXJ5XG4gKiB0aGF0IHdpbGwgYmUgbWVyZ2VkIGludG8gYW4gRW50aXR5Q2FjaGUgdmlhIHRoZSBgTWVyZ2VRdWVyeVNldGAgYWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNhY2hlUXVlcnlTZXQge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogYW55W107XG59XG5cbi8qKlxuICogQ2xlYXIgdGhlIGNvbGxlY3Rpb25zIGlkZW50aWZpZWQgaW4gdGhlIGNvbGxlY3Rpb25TZXQuXG4gKiBAcGFyYW0gW2NvbGxlY3Rpb25zXSBBcnJheSBvZiBuYW1lcyBvZiB0aGUgY29sbGVjdGlvbnMgdG8gY2xlYXIuXG4gKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBubyBhcnJheSwgY2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICogQHBhcmFtIFt0YWddIE9wdGlvbmFsIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENsZWFyQ29sbGVjdGlvbnMgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBwYXlsb2FkOiB7IGNvbGxlY3Rpb25zPzogc3RyaW5nW107IHRhZz86IHN0cmluZyB9O1xuICByZWFkb25seSB0eXBlID0gRW50aXR5Q2FjaGVBY3Rpb24uQ0xFQVJfQ09MTEVDVElPTlM7XG5cbiAgY29uc3RydWN0b3IoY29sbGVjdGlvbnM/OiBzdHJpbmdbXSwgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5wYXlsb2FkID0geyBjb2xsZWN0aW9ucywgdGFnIH07XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgZW50aXR5IGNhY2hlIGFjdGlvbiB0aGF0IGxvYWRzIG11bHRpcGxlIGVudGl0eSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICogYmVmb3JlIGFueSBzZWxlY3RvcnMkIG9ic2VydmFibGVzIGVtaXQuXG4gKiBAcGFyYW0gcXVlcnlTZXQgVGhlIGNvbGxlY3Rpb25zIHRvIGxvYWQsIHR5cGljYWxseSB0aGUgcmVzdWx0IG9mIGEgcXVlcnkuXG4gKiBAcGFyYW0gW3RhZ10gT3B0aW9uYWwgdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICogaW4gdGhlIGZvcm0gb2YgYSBtYXAgb2YgZW50aXR5IGNvbGxlY3Rpb25zLlxuICovXG5leHBvcnQgY2xhc3MgTG9hZENvbGxlY3Rpb25zIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDogeyBjb2xsZWN0aW9uczogRW50aXR5Q2FjaGVRdWVyeVNldDsgdGFnPzogc3RyaW5nIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5MT0FEX0NPTExFQ1RJT05TO1xuXG4gIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb25zOiBFbnRpdHlDYWNoZVF1ZXJ5U2V0LCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGNvbGxlY3Rpb25zLCB0YWcgfTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBlbnRpdHkgY2FjaGUgYWN0aW9uIHRoYXQgbWVyZ2VzIGVudGl0aWVzIGZyb20gYSBxdWVyeSByZXN1bHRcbiAqIHRoYXQgcmV0dXJuZWQgZW50aXRpZXMgZnJvbSBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAqIENvcnJlc3BvbmRpbmcgZW50aXR5IGNhY2hlIHJlZHVjZXIgc2hvdWxkIGFkZCBhbmQgdXBkYXRlIGFsbCBjb2xsZWN0aW9uc1xuICogYXQgdGhlIHNhbWUgdGltZSwgYmVmb3JlIGFueSBzZWxlY3RvcnMkIG9ic2VydmFibGVzIGVtaXQuXG4gKiBAcGFyYW0gcXVlcnlTZXQgVGhlIHJlc3VsdCBvZiB0aGUgcXVlcnkgaW4gdGhlIGZvcm0gb2YgYSBtYXAgb2YgZW50aXR5IGNvbGxlY3Rpb25zLlxuICogVGhlc2UgYXJlIHRoZSBlbnRpdHkgZGF0YSB0byBtZXJnZSBpbnRvIHRoZSByZXNwZWN0aXZlIGNvbGxlY3Rpb25zLlxuICogQHBhcmFtIG1lcmdlU3RyYXRlZ3kgSG93IHRvIG1lcmdlIGEgcXVlcmllZCBlbnRpdHkgd2hlbiBpdCBpcyBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXNcbiAqIEBwYXJhbSBbdGFnXSBPcHRpb25hbCB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXJnZVF1ZXJ5U2V0IGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHF1ZXJ5U2V0OiBFbnRpdHlDYWNoZVF1ZXJ5U2V0O1xuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5O1xuICAgIHRhZz86IHN0cmluZztcbiAgfTtcblxuICByZWFkb25seSB0eXBlID0gRW50aXR5Q2FjaGVBY3Rpb24uTUVSR0VfUVVFUllfU0VUO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHF1ZXJ5U2V0OiBFbnRpdHlDYWNoZVF1ZXJ5U2V0LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5LFxuICAgIHRhZz86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLnBheWxvYWQgPSB7XG4gICAgICBxdWVyeVNldCxcbiAgICAgIG1lcmdlU3RyYXRlZ3k6XG4gICAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IG51bGwgPyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBlbnRpdHkgY2FjaGUgYWN0aW9uIGZvciByZXBsYWNpbmcgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUuXG4gKiBEYW5nZXJvdXMgYmVjYXVzZSBicnV0ZSBmb3JjZSBidXQgdXNlZnVsIGFzIHdoZW4gcmUtaHlkcmF0aW5nIGFuIEVudGl0eUNhY2hlXG4gKiBmcm9tIGxvY2FsIGJyb3dzZXIgc3RvcmFnZSB3aGVuIHRoZSBhcHBsaWNhdGlvbiBsYXVuY2hlcy5cbiAqIEBwYXJhbSBjYWNoZSBOZXcgc3RhdGUgb2YgdGhlIGVudGl0eSBjYWNoZVxuICogQHBhcmFtIFt0YWddIE9wdGlvbmFsIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNldEVudGl0eUNhY2hlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDogeyBjYWNoZTogRW50aXR5Q2FjaGU7IHRhZz86IHN0cmluZyB9O1xuICByZWFkb25seSB0eXBlID0gRW50aXR5Q2FjaGVBY3Rpb24uU0VUX0VOVElUWV9DQUNIRTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgY2FjaGU6IEVudGl0eUNhY2hlLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBheWxvYWQgPSB7IGNhY2hlLCB0YWcgfTtcbiAgfVxufVxuXG4vLyAjcmVnaW9uIFNhdmVFbnRpdGllc1xuZXhwb3J0IGNsYXNzIFNhdmVFbnRpdGllcyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHtcbiAgICByZWFkb25seSBjaGFuZ2VTZXQ6IENoYW5nZVNldDtcbiAgICByZWFkb25seSB1cmw6IHN0cmluZztcbiAgICByZWFkb25seSBjb3JyZWxhdGlvbklkPzogYW55O1xuICAgIHJlYWRvbmx5IGlzT3B0aW1pc3RpYz86IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3k7XG4gICAgcmVhZG9ubHkgdGFnPzogc3RyaW5nO1xuICAgIGVycm9yPzogRXJyb3I7XG4gICAgc2tpcD86IGJvb2xlYW47IC8vIG5vdCB1c2VkXG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNoYW5nZVNldDogQ2hhbmdlU2V0LFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICkge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChjaGFuZ2VTZXQpIHtcbiAgICAgIGNoYW5nZVNldC50YWcgPSBjaGFuZ2VTZXQudGFnIHx8IG9wdGlvbnMudGFnO1xuICAgIH1cbiAgICB0aGlzLnBheWxvYWQgPSB7IGNoYW5nZVNldCwgdXJsLCAuLi5vcHRpb25zLCB0YWc6IGNoYW5nZVNldC50YWcgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzQ2FuY2VsIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ6IGFueTtcbiAgICByZWFkb25seSByZWFzb24/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZW50aXR5TmFtZXM/OiBzdHJpbmdbXTtcbiAgICByZWFkb25seSB0YWc/OiBzdHJpbmc7XG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIGVudGl0eU5hbWVzPzogc3RyaW5nW10sXG4gICAgdGFnPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY29ycmVsYXRpb25JZCwgcmVhc29uLCBlbnRpdHlOYW1lcywgdGFnIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNhdmVFbnRpdGllc0NhbmNlbGVkIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZDoge1xuICAgIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ6IGFueTtcbiAgICByZWFkb25seSByZWFzb24/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdGFnPzogc3RyaW5nO1xuICB9O1xuICByZWFkb25seSB0eXBlID0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUw7XG5cbiAgY29uc3RydWN0b3IoY29ycmVsYXRpb25JZDogYW55LCByZWFzb24/OiBzdHJpbmcsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMucGF5bG9hZCA9IHsgY29ycmVsYXRpb25JZCwgcmVhc29uLCB0YWcgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzRXJyb3Ige1xuICByZWFkb25seSBwYXlsb2FkOiB7XG4gICAgcmVhZG9ubHkgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3I7XG4gICAgcmVhZG9ubHkgb3JpZ2luYWxBY3Rpb246IFNhdmVFbnRpdGllcztcbiAgICByZWFkb25seSBjb3JyZWxhdGlvbklkOiBhbnk7XG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0VSUk9SO1xuICBjb25zdHJ1Y3RvcihlcnJvcjogRGF0YVNlcnZpY2VFcnJvciwgb3JpZ2luYWxBY3Rpb246IFNhdmVFbnRpdGllcykge1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPSBvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQ7XG4gICAgdGhpcy5wYXlsb2FkID0geyBlcnJvciwgb3JpZ2luYWxBY3Rpb24sIGNvcnJlbGF0aW9uSWQgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2F2ZUVudGl0aWVzU3VjY2VzcyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHBheWxvYWQ6IHtcbiAgICByZWFkb25seSBjaGFuZ2VTZXQ6IENoYW5nZVNldDtcbiAgICByZWFkb25seSB1cmw6IHN0cmluZztcbiAgICByZWFkb25seSBjb3JyZWxhdGlvbklkPzogYW55O1xuICAgIHJlYWRvbmx5IGlzT3B0aW1pc3RpYz86IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3k7XG4gICAgcmVhZG9ubHkgdGFnPzogc3RyaW5nO1xuICAgIGVycm9yPzogRXJyb3I7XG4gICAgc2tpcD86IGJvb2xlYW47IC8vIG5vdCB1c2VkXG4gIH07XG4gIHJlYWRvbmx5IHR5cGUgPSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1M7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2hhbmdlU2V0OiBDaGFuZ2VTZXQsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgY2hhbmdlU2V0LnRhZyA9IGNoYW5nZVNldC50YWcgfHwgb3B0aW9ucy50YWc7XG4gICAgfVxuICAgIHRoaXMucGF5bG9hZCA9IHsgY2hhbmdlU2V0LCB1cmwsIC4uLm9wdGlvbnMsIHRhZzogY2hhbmdlU2V0LnRhZyB9O1xuICB9XG59XG4vLyAjZW5kcmVnaW9uIFNhdmVFbnRpdGllc1xuIl19