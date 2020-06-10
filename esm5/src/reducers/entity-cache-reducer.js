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
        var entityOp = EntityOp.QUERY_MANY_SUCCESS;
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
        { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDLE9BQU8sRUFDTCxpQkFBaUIsR0FRbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQ0wsa0JBQWtCLEdBRW5CLE1BQU0sb0NBQW9DLENBQUM7QUFHNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7Ozs7QUFLMUQ7SUFFRSxtQ0FDVSx1QkFBZ0QsRUFDaEQsK0JBQWdFLEVBQ2hFLE1BQWM7UUFGZCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9DQUErQixHQUEvQiwrQkFBK0IsQ0FBaUM7UUFDaEUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUNyQixDQUFDO0lBRUo7OztPQUdHOzs7Ozs7SUFDSCwwQ0FBTTs7Ozs7SUFBTjtRQUNFLGtFQUFrRTtRQUNsRSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7OztRQUVyQyxTQUFTLGtCQUFrQixDQUV6QixXQUE2QixFQUM3QixNQUF1QztZQUR2Qyw0QkFBQSxFQUFBLGdCQUE2QjtZQUc3QixzQkFBc0I7WUFDdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNuQixLQUFLLGlCQUFp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SUFDakQsQ0FBQztJQUVELGtFQUFrRTs7Ozs7Ozs7SUFDMUQscURBQWlCOzs7Ozs7O0lBQXpCLFVBQTBCLFdBQXdCLEVBQUUsV0FBcUI7O1lBQ25FLFNBQVMsR0FBRyxLQUFLO1FBQ3JCLFdBQVcsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxVQUFVOztnQkFDdkIsVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7WUFDMUMsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNkLFdBQVcsZ0JBQVEsV0FBVyxDQUFFLENBQUM7b0JBQ2pDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO2dCQUNELFdBQVcsQ0FBQyxVQUFVLENBQUMseUJBQVEsVUFBVSxLQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUUsQ0FBQzthQUM3RDtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7Z0JBM1ZGLFVBQVU7Ozs7Z0JBVEYsdUJBQXVCO2dCQUN2QiwrQkFBK0I7Z0JBRS9CLE1BQU07O0lBbVdmLGdDQUFDO0NBQUEsQUE3VkQsSUE2VkM7U0E1VlkseUJBQXlCOzs7Ozs7SUFFbEMsNERBQXdEOzs7OztJQUN4RCxvRUFBd0U7Ozs7O0lBQ3hFLDJDQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUmVkdWNlciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgQ2xlYXJDb2xsZWN0aW9ucyxcbiAgTG9hZENvbGxlY3Rpb25zLFxuICBNZXJnZVF1ZXJ5U2V0LFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5cbmltcG9ydCB7XG4gIENoYW5nZVNldE9wZXJhdGlvbixcbiAgQ2hhbmdlU2V0SXRlbSxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItcmVnaXN0cnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBFbnRpdHlDYWNoZVJlZHVjZXIgdmlhIGl0cyBjcmVhdGUoKSBtZXRob2RcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yOiBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlclxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgQG5ncngvZGF0YSBlbnRpdHkgY2FjaGUgcmVkdWNlciB3aGljaCBlaXRoZXIgcmVzcG9uZHMgdG8gZW50aXR5IGNhY2hlIGxldmVsIGFjdGlvbnNcbiAgICogb3IgKG1vcmUgY29tbW9ubHkpIGRlbGVnYXRlcyB0byBhbiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlciBiYXNlZCBvbiB0aGUgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZS5cbiAgICovXG4gIGNyZWF0ZSgpOiBBY3Rpb25SZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+IHtcbiAgICAvLyBUaGlzIHRlY2huaXF1ZSBlbnN1cmVzIGEgbmFtZWQgZnVuY3Rpb24gYXBwZWFycyBpbiB0aGUgZGVidWdnZXJcbiAgICByZXR1cm4gZW50aXR5Q2FjaGVSZWR1Y2VyLmJpbmQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiBlbnRpdHlDYWNoZVJlZHVjZXIoXG4gICAgICB0aGlzOiBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgICBhY3Rpb246IHsgdHlwZTogc3RyaW5nOyBwYXlsb2FkPzogYW55IH1cbiAgICApOiBFbnRpdHlDYWNoZSB7XG4gICAgICAvLyBFbnRpdHlDYWNoZSBhY3Rpb25zXG4gICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uQ0xFQVJfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIENsZWFyQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5MT0FEX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIExvYWRDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLk1FUkdFX1FVRVJZX1NFVDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLm1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTWVyZ2VRdWVyeVNldFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNSZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUw6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWxSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19FUlJPUjoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0Vycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19TVUNDRVNTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNTdWNjZXNzXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0VUX0VOVElUWV9DQUNIRToge1xuICAgICAgICAgIC8vIENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgRW50aXR5Q2FjaGUuIEJlIGNhcmVmdWwhXG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmNhY2hlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGVudGl0eSBjb2xsZWN0aW9uIHJlZHVjZXIgaWYgdGhpcyBpcyBhIHZhbGlkIEVudGl0eUFjdGlvbiBmb3IgYSBjb2xsZWN0aW9uXG4gICAgICBjb25zdCBwYXlsb2FkID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBpZiAocGF5bG9hZCAmJiBwYXlsb2FkLmVudGl0eU5hbWUgJiYgcGF5bG9hZC5lbnRpdHlPcCAmJiAhcGF5bG9hZC5lcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3Rpb24gYXMgRW50aXR5QWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90IGEgdmFsaWQgRW50aXR5QWN0aW9uXG4gICAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gY2xlYXIgbXVsdGlwbGUgY29sbGVjdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIENsZWFyQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgYW4gYXJyYXkgb2YgY29sbGVjdGlvbiBuYW1lcy5cbiAgICogSWYgZW1wdHkgYXJyYXksIGRvZXMgbm90aGluZy4gSWYgbm8gYXJyYXksIGNsZWFycyBhbGwgdGhlIGNvbGxlY3Rpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IENsZWFyQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1jb25zdFxuICAgIGxldCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuUkVNT1ZFX0FMTDtcblxuICAgIGlmICghY29sbGVjdGlvbnMpIHtcbiAgICAgIC8vIENvbGxlY3Rpb25zIGlzIG5vdCBkZWZpbmVkLiBDbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gICAgICBjb2xsZWN0aW9ucyA9IE9iamVjdC5rZXlzKGVudGl0eUNhY2hlKTtcbiAgICB9XG5cbiAgICBlbnRpdHlDYWNoZSA9IGNvbGxlY3Rpb25zLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7IGVudGl0eU5hbWUsIGVudGl0eU9wIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGxvYWQgY29sbGVjdGlvbiBpbiB0aGUgZm9ybSBvZiBhIGhhc2ggb2YgZW50aXR5IGRhdGEgZm9yIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgTG9hZENvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIHRoZSBRdWVyeVNldCBvZiBlbnRpdHkgY29sbGVjdGlvbnMgdG8gbG9hZFxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTG9hZENvbGxlY3Rpb25zXG4gICkge1xuICAgIGNvbnN0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5BRERfQUxMO1xuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbnMpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IGNvbGxlY3Rpb25zW2VudGl0eU5hbWVdLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbWVyZ2UgcXVlcnkgc2V0cyBpbiB0aGUgZm9ybSBvZiBhIGhhc2ggb2YgZW50aXR5IGRhdGEgZm9yIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgTWVyZ2VRdWVyeVNldCBhY3Rpb24gd2l0aCB0aGUgcXVlcnkgc2V0IGFuZCBhIE1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHByb3RlY3RlZCBtZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBNZXJnZVF1ZXJ5U2V0XG4gICkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uc3RcbiAgICBsZXQgeyBtZXJnZVN0cmF0ZWd5LCBxdWVyeVNldCwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IG51bGwgPyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5RVUVSWV9NQU5ZX1NVQ0NFU1M7XG5cbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKHF1ZXJ5U2V0KTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBxdWVyeVNldFtlbnRpdHlOYW1lXSxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8vICNyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICB0cnkge1xuICAgICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgICB0YWcsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfTtcbiAgICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgICAgIGlmIChhY3QucGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgIHRocm93IGFjdC5wYXlsb2FkLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNDYW5jZWxcbiAgKSB7XG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhcbiAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZXMgfHwgW11cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNFcnJvclxuICApIHtcbiAgICBjb25zdCBvcmlnaW5hbEFjdGlvbiA9IGFjdGlvbi5wYXlsb2FkLm9yaWdpbmFsQWN0aW9uO1xuICAgIGNvbnN0IG9yaWdpbmFsQ2hhbmdlU2V0ID0gb3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gb3JpZ2luYWxDaGFuZ2VTZXQuY2hhbmdlcy5tYXAoXG4gICAgICAoaXRlbSkgPT4gaXRlbS5lbnRpdHlOYW1lXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZSwgZW50aXR5TmFtZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hhbmdlU2V0LFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICB0YWcsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9TVUNDRVNTO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuXG4gIC8vICNyZWdpb24gaGVscGVyc1xuICAvKiogQXBwbHkgcmVkdWNlciBmb3IgdGhlIGFjdGlvbidzIEVudGl0eUNvbGxlY3Rpb24gKGlmIHRoZSBhY3Rpb24gdGFyZ2V0cyBhIGNvbGxlY3Rpb24pICovXG4gIHByaXZhdGUgYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihcbiAgICBjYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApIHtcbiAgICBjb25zdCBlbnRpdHlOYW1lID0gYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZTtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY2FjaGVbZW50aXR5TmFtZV07XG4gICAgY29uc3QgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeS5nZXRPckNyZWF0ZVJlZHVjZXIoXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcblxuICAgIGxldCBuZXdDb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uO1xuICAgIHRyeSB7XG4gICAgICBuZXdDb2xsZWN0aW9uID0gY29sbGVjdGlvblxuICAgICAgICA/IHJlZHVjZXIoY29sbGVjdGlvbiwgYWN0aW9uKVxuICAgICAgICA6IHJlZHVjZXIodGhpcy5lbnRpdHlDb2xsZWN0aW9uQ3JlYXRvci5jcmVhdGUoZW50aXR5TmFtZSksIGFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmVycm9yIHx8IGNvbGxlY3Rpb24gPT09IG5ld0NvbGxlY3Rpb24hXG4gICAgICA/IGNhY2hlXG4gICAgICA6IHsgLi4uY2FjaGUsIFtlbnRpdHlOYW1lXTogbmV3Q29sbGVjdGlvbiEgfTtcbiAgfVxuXG4gIC8qKiBFbnN1cmUgbG9hZGluZyBpcyBmYWxzZSBmb3IgZXZlcnkgY29sbGVjdGlvbiBpbiBlbnRpdHlOYW1lcyAqL1xuICBwcml2YXRlIGNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSwgZW50aXR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgbGV0IGlzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGVudGl0eU5hbWVzLmZvckVhY2goKGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXTtcbiAgICAgIGlmIChjb2xsZWN0aW9uLmxvYWRpbmcpIHtcbiAgICAgICAgaWYgKCFpc011dGF0ZWQpIHtcbiAgICAgICAgICBlbnRpdHlDYWNoZSA9IHsgLi4uZW50aXR5Q2FjaGUgfTtcbiAgICAgICAgICBpc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVudGl0eUNhY2hlW2VudGl0eU5hbWVdID0geyAuLi5jb2xsZWN0aW9uLCBsb2FkaW5nOiBmYWxzZSB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cbiJdfQ==