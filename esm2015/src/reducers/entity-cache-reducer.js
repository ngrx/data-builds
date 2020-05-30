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
export class EntityCacheReducerFactory {
    /**
     * @param {?} entityCollectionCreator
     * @param {?} entityCollectionReducerRegistry
     * @param {?} logger
     */
    constructor(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
        this.entityCollectionCreator = entityCollectionCreator;
        this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
        this.logger = logger;
    }
    /**
     * Create the \@ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     * @return {?}
     */
    create() {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);
        /**
         * @this {?}
         * @param {?=} entityCache
         * @param {?=} action
         * @return {?}
         */
        function entityCacheReducer(entityCache = {}, action) {
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
            const payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, (/** @type {?} */ (action)));
            }
            // Not a valid EntityAction
            return entityCache;
        }
    }
    /**
     * Reducer to clear multiple collections at the same time.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     * @return {?}
     */
    clearCollectionsReducer(entityCache, action) {
        // tslint:disable-next-line:prefer-const
        let { collections, tag } = action.payload;
        /** @type {?} */
        const entityOp = EntityOp.REMOVE_ALL;
        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }
        entityCache = collections.reduce((/**
         * @param {?} newCache
         * @param {?} entityName
         * @return {?}
         */
        (newCache, entityName) => {
            /** @type {?} */
            const payload = { entityName, entityOp };
            /** @type {?} */
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }), entityCache);
        return entityCache;
    }
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a LoadCollections action whose payload is the QuerySet of entity collections to load
     * @return {?}
     */
    loadCollectionsReducer(entityCache, action) {
        const { collections, tag } = action.payload;
        /** @type {?} */
        const entityOp = EntityOp.ADD_ALL;
        /** @type {?} */
        const entityNames = Object.keys(collections);
        entityCache = entityNames.reduce((/**
         * @param {?} newCache
         * @param {?} entityName
         * @return {?}
         */
        (newCache, entityName) => {
            /** @type {?} */
            const payload = {
                entityName,
                entityOp,
                data: collections[entityName],
            };
            /** @type {?} */
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }), entityCache);
        return entityCache;
    }
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @protected
     * @param {?} entityCache the entity cache
     * @param {?} action a MergeQuerySet action with the query set and a MergeStrategy
     * @return {?}
     */
    mergeQuerySetReducer(entityCache, action) {
        // tslint:disable-next-line:prefer-const
        let { mergeStrategy, querySet, tag } = action.payload;
        mergeStrategy =
            mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
        /** @type {?} */
        const entityOp = EntityOp.UPSERT_MANY;
        /** @type {?} */
        const entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce((/**
         * @param {?} newCache
         * @param {?} entityName
         * @return {?}
         */
        (newCache, entityName) => {
            /** @type {?} */
            const payload = {
                entityName,
                entityOp,
                data: querySet[entityName],
                mergeStrategy,
            };
            /** @type {?} */
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }), entityCache);
        return entityCache;
    }
    // #region saveEntities reducers
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    saveEntitiesReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag, } = action.payload;
        try {
            changeSet.changes.forEach((/**
             * @param {?} item
             * @return {?}
             */
            item => {
                /** @type {?} */
                const entityName = item.entityName;
                /** @type {?} */
                const payload = {
                    entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId,
                    isOptimistic,
                    mergeStrategy,
                    tag,
                };
                /** @type {?} */
                const act = {
                    type: `[${entityName}] ${action.type}`,
                    payload,
                };
                entityCache = this.applyCollectionReducer(entityCache, act);
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
    }
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    saveEntitiesCancelReducer(entityCache, action) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
    }
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    saveEntitiesErrorReducer(entityCache, action) {
        /** @type {?} */
        const originalAction = action.payload.originalAction;
        /** @type {?} */
        const originalChangeSet = originalAction.payload.changeSet;
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        /** @type {?} */
        const entityNames = originalChangeSet.changes.map((/**
         * @param {?} item
         * @return {?}
         */
        item => item.entityName));
        return this.clearLoadingFlags(entityCache, entityNames);
    }
    /**
     * @protected
     * @param {?} entityCache
     * @param {?} action
     * @return {?}
     */
    saveEntitiesSuccessReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag, } = action.payload;
        changeSet.changes.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            /** @type {?} */
            const entityName = item.entityName;
            /** @type {?} */
            const payload = {
                entityName,
                entityOp: getEntityOp(item),
                data: item.entities,
                correlationId,
                isOptimistic,
                mergeStrategy,
                tag,
            };
            /** @type {?} */
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            entityCache = this.applyCollectionReducer(entityCache, act);
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
    }
    // #endregion saveEntities reducers
    // #region helpers
    /**
     * Apply reducer for the action's EntityCollection (if the action targets a collection)
     * @private
     * @param {?=} cache
     * @param {?=} action
     * @return {?}
     */
    applyCollectionReducer(cache = {}, action) {
        /** @type {?} */
        const entityName = action.payload.entityName;
        /** @type {?} */
        const collection = cache[entityName];
        /** @type {?} */
        const reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
        /** @type {?} */
        let newCollection;
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
            : Object.assign(Object.assign({}, cache), { [entityName]: (/** @type {?} */ (newCollection)) });
    }
    /**
     * Ensure loading is false for every collection in entityNames
     * @private
     * @param {?} entityCache
     * @param {?} entityNames
     * @return {?}
     */
    clearLoadingFlags(entityCache, entityNames) {
        /** @type {?} */
        let isMutated = false;
        entityNames.forEach((/**
         * @param {?} entityName
         * @return {?}
         */
        entityName => {
            /** @type {?} */
            const collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = Object.assign({}, entityCache);
                    isMutated = true;
                }
                entityCache[entityName] = Object.assign(Object.assign({}, collection), { loading: false });
            }
        }));
        return entityCache;
    }
}
EntityCacheReducerFactory.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntityCacheReducerFactory.ctorParameters = () => [
    { type: EntityCollectionCreator },
    { type: EntityCollectionReducerRegistry },
    { type: Logger }
];
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