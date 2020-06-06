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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDLE9BQU8sRUFDTCxpQkFBaUIsR0FRbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQ0wsa0JBQWtCLEdBRW5CLE1BQU0sb0NBQW9DLENBQUM7QUFHNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7Ozs7QUFLMUQ7SUFFRSxtQ0FDVSx1QkFBZ0QsRUFDaEQsK0JBQWdFLEVBQ2hFLE1BQWM7UUFGZCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9DQUErQixHQUEvQiwrQkFBK0IsQ0FBaUM7UUFDaEUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUNyQixDQUFDO0lBRUo7OztPQUdHOzs7Ozs7SUFDSCwwQ0FBTTs7Ozs7SUFBTjtRQUNFLGtFQUFrRTtRQUNsRSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7OztRQUVyQyxTQUFTLGtCQUFrQixDQUV6QixXQUE2QixFQUM3QixNQUF1QztZQUR2Qyw0QkFBQSxFQUFBLGdCQUE2QjtZQUc3QixzQkFBc0I7WUFDdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNuQixLQUFLLGlCQUFp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QUNqRCxDQUFDO0lBRUQsa0VBQWtFOzs7Ozs7OztJQUMxRCxxREFBaUI7Ozs7Ozs7SUFBekIsVUFBMEIsV0FBd0IsRUFBRSxXQUFxQjs7WUFDbkUsU0FBUyxHQUFHLEtBQUs7UUFDckIsV0FBVyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLFVBQVU7O2dCQUN0QixVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztZQUMxQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2QsV0FBVyxnQkFBUSxXQUFXLENBQUUsQ0FBQztvQkFDakMsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDbEI7Z0JBQ0QsV0FBVyxDQUFDLFVBQVUsQ0FBQyx5QkFBUSxVQUFVLEtBQUUsT0FBTyxFQUFFLEtBQUssR0FBRSxDQUFDO2FBQzdEO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOztnQkF6VkYsVUFBVTs7OztnQkFURix1QkFBdUI7Z0JBQ3ZCLCtCQUErQjtnQkFFL0IsTUFBTTs7SUFpV2YsZ0NBQUM7Q0FBQSxBQTNWRCxJQTJWQztTQTFWWSx5QkFBeUI7Ozs7OztJQUVsQyw0REFBd0Q7Ozs7O0lBQ3hELG9FQUF3RTs7Ozs7SUFDeEUsMkNBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25SZWR1Y2VyIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuL2VudGl0eS1jYWNoZSc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBDbGVhckNvbGxlY3Rpb25zLFxuICBMb2FkQ29sbGVjdGlvbnMsXG4gIE1lcmdlUXVlcnlTZXQsXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXRJdGVtLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIEVudGl0eUNhY2hlUmVkdWNlciB2aWEgaXRzIGNyZWF0ZSgpIG1ldGhvZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3I6IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBAbmdyeC9kYXRhIGVudGl0eSBjYWNoZSByZWR1Y2VyIHdoaWNoIGVpdGhlciByZXNwb25kcyB0byBlbnRpdHkgY2FjaGUgbGV2ZWwgYWN0aW9uc1xuICAgKiBvciAobW9yZSBjb21tb25seSkgZGVsZWdhdGVzIHRvIGFuIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyIGJhc2VkIG9uIHRoZSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lLlxuICAgKi9cbiAgY3JlYXRlKCk6IEFjdGlvblJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4ge1xuICAgIC8vIFRoaXMgdGVjaG5pcXVlIGVuc3VyZXMgYSBuYW1lZCBmdW5jdGlvbiBhcHBlYXJzIGluIHRoZSBkZWJ1Z2dlclxuICAgIHJldHVybiBlbnRpdHlDYWNoZVJlZHVjZXIuYmluZCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIGVudGl0eUNhY2hlUmVkdWNlcihcbiAgICAgIHRoaXM6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICAgIGFjdGlvbjogeyB0eXBlOiBzdHJpbmc7IHBheWxvYWQ/OiBhbnkgfVxuICAgICk6IEVudGl0eUNhY2hlIHtcbiAgICAgIC8vIEVudGl0eUNhY2hlIGFjdGlvbnNcbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgQ2xlYXJDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTG9hZENvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTUVSR0VfUVVFUllfU0VUOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBNZXJnZVF1ZXJ5U2V0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1JlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBTYXZlRW50aXRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNDYW5jZWxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0VSUk9SOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzRXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1M6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFOiB7XG4gICAgICAgICAgLy8gQ29tcGxldGVseSByZXBsYWNlIHRoZSBFbnRpdHlDYWNoZS4gQmUgY2FyZWZ1bCFcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuY2FjaGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgZW50aXR5IGNvbGxlY3Rpb24gcmVkdWNlciBpZiB0aGlzIGlzIGEgdmFsaWQgRW50aXR5QWN0aW9uIGZvciBhIGNvbGxlY3Rpb25cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQuZW50aXR5TmFtZSAmJiBwYXlsb2FkLmVudGl0eU9wICYmICFwYXlsb2FkLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBFbnRpdHlBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3QgYSB2YWxpZCBFbnRpdHlBY3Rpb25cbiAgICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBjbGVhciBtdWx0aXBsZSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgQ2xlYXJDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyBhbiBhcnJheSBvZiBjb2xsZWN0aW9uIG5hbWVzLlxuICAgKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBubyBhcnJheSwgY2xlYXJzIGFsbCB0aGUgY29sbGVjdGlvbnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogQ2xlYXJDb2xsZWN0aW9uc1xuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5SRU1PVkVfQUxMO1xuXG4gICAgaWYgKCFjb2xsZWN0aW9ucykge1xuICAgICAgLy8gQ29sbGVjdGlvbnMgaXMgbm90IGRlZmluZWQuIENsZWFyIGFsbCBjb2xsZWN0aW9ucy5cbiAgICAgIGNvbGxlY3Rpb25zID0gT2JqZWN0LmtleXMoZW50aXR5Q2FjaGUpO1xuICAgIH1cblxuICAgIGVudGl0eUNhY2hlID0gY29sbGVjdGlvbnMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHsgZW50aXR5TmFtZSwgZW50aXR5T3AgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbG9hZCBjb2xsZWN0aW9uIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBMb2FkQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgdGhlIFF1ZXJ5U2V0IG9mIGVudGl0eSBjb2xsZWN0aW9ucyB0byBsb2FkXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBMb2FkQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLkFERF9BTEw7XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9ucyk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogY29sbGVjdGlvbnNbZW50aXR5TmFtZV0sXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBtZXJnZSBxdWVyeSBzZXRzIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBNZXJnZVF1ZXJ5U2V0IGFjdGlvbiB3aXRoIHRoZSBxdWVyeSBzZXQgYW5kIGEgTWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcHJvdGVjdGVkIG1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IE1lcmdlUXVlcnlTZXRcbiAgKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1jb25zdFxuICAgIGxldCB7IG1lcmdlU3RyYXRlZ3ksIHF1ZXJ5U2V0LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlFVRVJZX01BTllfU1VDQ0VTUztcblxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMocXVlcnlTZXQpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IHF1ZXJ5U2V0W2VudGl0eU5hbWVdLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoYW5nZVNldCxcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICBpc09wdGltaXN0aWMsXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgdGFnLFxuICAgIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIHRyeSB7XG4gICAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgICB0YWcsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfTtcbiAgICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgICAgIGlmIChhY3QucGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgIHRocm93IGFjdC5wYXlsb2FkLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNDYW5jZWxcbiAgKSB7XG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhcbiAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZXMgfHwgW11cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNFcnJvclxuICApIHtcbiAgICBjb25zdCBvcmlnaW5hbEFjdGlvbiA9IGFjdGlvbi5wYXlsb2FkLm9yaWdpbmFsQWN0aW9uO1xuICAgIGNvbnN0IG9yaWdpbmFsQ2hhbmdlU2V0ID0gb3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gb3JpZ2luYWxDaGFuZ2VTZXQuY2hhbmdlcy5tYXAoaXRlbSA9PiBpdGVtLmVudGl0eU5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlLCBlbnRpdHlOYW1lcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICB0YWcsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9TVUNDRVNTO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuXG4gIC8vICNyZWdpb24gaGVscGVyc1xuICAvKiogQXBwbHkgcmVkdWNlciBmb3IgdGhlIGFjdGlvbidzIEVudGl0eUNvbGxlY3Rpb24gKGlmIHRoZSBhY3Rpb24gdGFyZ2V0cyBhIGNvbGxlY3Rpb24pICovXG4gIHByaXZhdGUgYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihcbiAgICBjYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApIHtcbiAgICBjb25zdCBlbnRpdHlOYW1lID0gYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZTtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY2FjaGVbZW50aXR5TmFtZV07XG4gICAgY29uc3QgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeS5nZXRPckNyZWF0ZVJlZHVjZXIoXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcblxuICAgIGxldCBuZXdDb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uO1xuICAgIHRyeSB7XG4gICAgICBuZXdDb2xsZWN0aW9uID0gY29sbGVjdGlvblxuICAgICAgICA/IHJlZHVjZXIoY29sbGVjdGlvbiwgYWN0aW9uKVxuICAgICAgICA6IHJlZHVjZXIodGhpcy5lbnRpdHlDb2xsZWN0aW9uQ3JlYXRvci5jcmVhdGUoZW50aXR5TmFtZSksIGFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmVycm9yIHx8IGNvbGxlY3Rpb24gPT09IG5ld0NvbGxlY3Rpb24hXG4gICAgICA/IGNhY2hlXG4gICAgICA6IHsgLi4uY2FjaGUsIFtlbnRpdHlOYW1lXTogbmV3Q29sbGVjdGlvbiEgfTtcbiAgfVxuXG4gIC8qKiBFbnN1cmUgbG9hZGluZyBpcyBmYWxzZSBmb3IgZXZlcnkgY29sbGVjdGlvbiBpbiBlbnRpdHlOYW1lcyAqL1xuICBwcml2YXRlIGNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSwgZW50aXR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgbGV0IGlzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGVudGl0eU5hbWVzLmZvckVhY2goZW50aXR5TmFtZSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gZW50aXR5Q2FjaGVbZW50aXR5TmFtZV07XG4gICAgICBpZiAoY29sbGVjdGlvbi5sb2FkaW5nKSB7XG4gICAgICAgIGlmICghaXNNdXRhdGVkKSB7XG4gICAgICAgICAgZW50aXR5Q2FjaGUgPSB7IC4uLmVudGl0eUNhY2hlIH07XG4gICAgICAgICAgaXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXSA9IHsgLi4uY29sbGVjdGlvbiwgbG9hZGluZzogZmFsc2UgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG4iXX0=