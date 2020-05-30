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
//# sourceMappingURL=entity-cache-action.js.map