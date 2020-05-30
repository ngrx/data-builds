/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-cache-action.ts
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
//# sourceMappingURL=entity-cache-action.js.map