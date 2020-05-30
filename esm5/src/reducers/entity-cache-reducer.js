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
 * Generated from: src/reducers/entity-cache-reducer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityCacheAction, } from '../actions/entity-cache-action';
import { ChangeSetOperation, } from '../actions/entity-cache-change-set';
import { EntityCollectionCreator } from './entity-collection-creator';
import { EntityCollectionReducerRegistry } from './entity-collection-reducer-registry';
import { EntityOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';
import { MergeStrategy } from '../actions/merge-strategy';
/**
 * Creates the EntityCacheReducer via its create() method
 */
var EntityCacheReducerFactory = /** @class */ (function () {
    function EntityCacheReducerFactory(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
        this.entityCollectionCreator = entityCollectionCreator;
        this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
        this.logger = logger;
    }
    /**
     * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     */
    /**
     * Create the \@ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.create = /**
     * Create the \@ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     * @return {?}
     */
    function () {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);
        /**
         * @this {?}
         * @param {?=} entityCache
         * @param {?=} action
         * @return {?}
         */
        function entityCacheReducer(entityCache, action) {
            if (entityCache === void 0) { entityCache = {}; }
            // EntityCache actions
            switch (action.type) {
                case EntityCacheAction.CLEAR_COLLECTIONS: {
                    return this.clearCollectionsReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.LOAD_COLLECTIONS: {
                    return this.loadCollectionsReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.MERGE_QUERY_SET: {
                    return this.mergeQuerySetReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.SAVE_ENTITIES: {
                    return this.saveEntitiesReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                    return this.saveEntitiesCancelReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.SAVE_ENTITIES_ERROR: {
                    return this.saveEntitiesErrorReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                    return this.saveEntitiesSuccessReducer(entityCache, (/** @type {?} */ (action)));
                }
                case EntityCacheAction.SET_ENTITY_CACHE: {
                    // Completely replace the EntityCache. Be careful!
                    return action.payload.cache;
                }
            }
            // Apply entity collection reducer if this is a valid EntityAction for a collection
            /** @type {?} */
            var payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, (/** @type {?} */ (action)));
            }
            // Not a valid EntityAction
            return entityCache;
        }
    };
    /**
     * Reducer to clear multiple collections at the same time.
     * @param entityCache the entity cache
     * @param action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     */
    /**
     * Reducer to clear multiple collections at the same time.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.clearCollectionsReducer = /**
     * Reducer to clear multiple collections at the same time.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     * @return {?}
     */
    function (entityCache, action) {
        var _this = this;
        // tslint:disable-next-line:prefer-const
        var _a = action.payload, collections = _a.collections, tag = _a.tag;
        /** @type {?} */
        var entityOp = EntityOp.REMOVE_ALL;
        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }
        entityCache = collections.reduce((/**
         * @param {?} newCache
         * @param {?} entityName
         * @return {?}
         */
        function (newCache, entityName) {
            /** @type {?} */
            var payload = { entityName: entityName, entityOp: entityOp };
            /** @type {?} */
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            newCache = _this.applyCollectionReducer(newCache, act);
            return newCache;
        }), entityCache);
        return entityCache;
    };
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
     */
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a LoadCollections action whose payload is the QuerySet of entity collections to load
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.loadCollectionsReducer = /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a LoadCollections action whose payload is the QuerySet of entity collections to load
     * @return {?}
     */
    function (entityCache, action) {
        var _this = this;
        var _a = action.payload, collections = _a.collections, tag = _a.tag;
        /** @type {?} */
        var entityOp = EntityOp.ADD_ALL;
        /** @type {?} */
        var entityNames = Object.keys(collections);
        entityCache = entityNames.reduce((/**
         * @param {?} newCache
         * @param {?} entityName
         * @return {?}
         */
        function (newCache, entityName) {
            /** @type {?} */
            var payload = {
                entityName: entityName,
                entityOp: entityOp,
                data: collections[entityName],
            };
            /** @type {?} */
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            newCache = _this.applyCollectionReducer(newCache, act);
            return newCache;
        }), entityCache);
        return entityCache;
    };
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a MergeQuerySet action with the query set and a MergeStrategy
     */
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a MergeQuerySet action with the query set and a MergeStrategy
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.mergeQuerySetReducer = /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a MergeQuerySet action with the query set and a MergeStrategy
     * @return {?}
     */
    function (entityCache, action) {
        var _this = this;
        // tslint:disable-next-line:prefer-const
        var _a = action.payload, mergeStrategy = _a.mergeStrategy, querySet = _a.querySet, tag = _a.tag;
        mergeStrategy =
            mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
        /** @type {?} */
        var entityOp = EntityOp.UPSERT_MANY;
        /** @type {?} */
        var entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce((/**
         * @param {?} newCache
         * @param {?} entityName
         * @return {?}
         */
        function (newCache, entityName) {
            /** @type {?} */
            var payload = {
                entityName: entityName,
                entityOp: entityOp,
                data: querySet[entityName],
                mergeStrategy: mergeStrategy,
            };
            /** @type {?} */
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            newCache = _this.applyCollectionReducer(newCache, act);
            return newCache;
        }), entityCache);
        return entityCache;
    };
    // #region saveEntities reducers
    // #region saveEntities reducers
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.saveEntitiesReducer = 
    // #region saveEntities reducers
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    function (entityCache, action) {
        var _this = this;
        var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
        try {
            changeSet.changes.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                /** @type {?} */
                var entityName = item.entityName;
                /** @type {?} */
                var payload = {
                    entityName: entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId: correlationId,
                    isOptimistic: isOptimistic,
                    mergeStrategy: mergeStrategy,
                    tag: tag,
                };
                /** @type {?} */
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                entityCache = _this.applyCollectionReducer(entityCache, act);
                if (act.payload.error) {
                    throw act.payload.error;
                }
            }));
        }
        catch (error) {
            action.payload.error = error;
        }
        return entityCache;
        /**
         * @param {?} item
         * @return {?}
         */
        function getEntityOp(item) {
            switch (item.op) {
                case ChangeSetOperation.Add:
                    return EntityOp.SAVE_ADD_MANY;
                case ChangeSetOperation.Delete:
                    return EntityOp.SAVE_DELETE_MANY;
                case ChangeSetOperation.Update:
                    return EntityOp.SAVE_UPDATE_MANY;
                case ChangeSetOperation.Upsert:
                    return EntityOp.SAVE_UPSERT_MANY;
            }
        }
    };
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.saveEntitiesCancelReducer = /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    function (entityCache, action) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
    };
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.saveEntitiesErrorReducer = /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    function (entityCache, action) {
        /** @type {?} */
        var originalAction = action.payload.originalAction;
        /** @type {?} */
        var originalChangeSet = originalAction.payload.changeSet;
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        /** @type {?} */
        var entityNames = originalChangeSet.changes.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item.entityName; }));
        return this.clearLoadingFlags(entityCache, entityNames);
    };
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.saveEntitiesSuccessReducer = /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    function (entityCache, action) {
        var _this = this;
        var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
        changeSet.changes.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            /** @type {?} */
            var entityName = item.entityName;
            /** @type {?} */
            var payload = {
                entityName: entityName,
                entityOp: getEntityOp(item),
                data: item.entities,
                correlationId: correlationId,
                isOptimistic: isOptimistic,
                mergeStrategy: mergeStrategy,
                tag: tag,
            };
            /** @type {?} */
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            entityCache = _this.applyCollectionReducer(entityCache, act);
        }));
        return entityCache;
        /**
         * @param {?} item
         * @return {?}
         */
        function getEntityOp(item) {
            switch (item.op) {
                case ChangeSetOperation.Add:
                    return EntityOp.SAVE_ADD_MANY_SUCCESS;
                case ChangeSetOperation.Delete:
                    return EntityOp.SAVE_DELETE_MANY_SUCCESS;
                case ChangeSetOperation.Update:
                    return EntityOp.SAVE_UPDATE_MANY_SUCCESS;
                case ChangeSetOperation.Upsert:
                    return EntityOp.SAVE_UPSERT_MANY_SUCCESS;
            }
        }
    };
    // #endregion saveEntities reducers
    // #region helpers
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    // #endregion saveEntities reducers
    // #region helpers
    /**
     * Apply reducer for the action's EntityCollection (if the action targets a collection)
     * @private
     * @param {?=} cache
     * @param {?=} action
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.applyCollectionReducer = 
    // #endregion saveEntities reducers
    // #region helpers
    /**
     * Apply reducer for the action's EntityCollection (if the action targets a collection)
     * @private
     * @param {?=} cache
     * @param {?=} action
     * @return {?}
     */
    function (cache, action) {
        var _a;
        if (cache === void 0) { cache = {}; }
        /** @type {?} */
        var entityName = action.payload.entityName;
        /** @type {?} */
        var collection = cache[entityName];
        /** @type {?} */
        var reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
        /** @type {?} */
        var newCollection;
        try {
            newCollection = collection
                ? reducer(collection, action)
                : reducer(this.entityCollectionCreator.create(entityName), action);
        }
        catch (error) {
            this.logger.error(error);
            action.payload.error = error;
        }
        return action.payload.error || collection === (/** @type {?} */ (newCollection))
            ? cache
            : __assign(__assign({}, cache), (_a = {}, _a[entityName] = (/** @type {?} */ (newCollection)), _a));
    };
    /** Ensure loading is false for every collection in entityNames */
    /**
     * Ensure loading is false for every collection in entityNames
     * @private
     * @param {?} entityCache
     * @param {?} entityNames
     * @return {?}
     */
    EntityCacheReducerFactory.prototype.clearLoadingFlags = /**
     * Ensure loading is false for every collection in entityNames
     * @private
     * @param {?} entityCache
     * @param {?} entityNames
     * @return {?}
     */
    function (entityCache, entityNames) {
        /** @type {?} */
        var isMutated = false;
        entityNames.forEach((/**
         * @param {?} entityName
         * @return {?}
         */
        function (entityName) {
            /** @type {?} */
            var collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = __assign({}, entityCache);
                    isMutated = true;
                }
                entityCache[entityName] = __assign(__assign({}, collection), { loading: false });
            }
        }));
        return entityCache;
    };
    EntityCacheReducerFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityCacheReducerFactory.ctorParameters = function () { return [
        { type: EntityCollectionCreator },
        { type: EntityCollectionReducerRegistry },
        { type: Logger }
    ]; };
    return EntityCacheReducerFactory;
}());
export { EntityCacheReducerFactory };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCacheReducerFactory.prototype.entityCollectionCreator;
    /**
     * @type {?}
     * @private
     */
    EntityCacheReducerFactory.prototype.entityCollectionReducerRegistry;
    /**
     * @type {?}
     * @private
     */
    EntityCacheReducerFactory.prototype.logger;
}
//# sourceMappingURL=entity-cache-reducer.js.map