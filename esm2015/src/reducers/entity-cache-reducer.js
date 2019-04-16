/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * Create the ngrx-data entity cache reducer which either responds to entity cache level actions
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
            : Object.assign({}, cache, { [entityName]: (/** @type {?} */ (newCollection)) });
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
                entityCache[entityName] = Object.assign({}, collection, { loading: false });
            }
        }));
        return entityCache;
    }
}
EntityCacheReducerFactory.decorators = [
    { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTzNDLE9BQU8sRUFDTCxpQkFBaUIsR0FRbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQ0wsa0JBQWtCLEdBRW5CLE1BQU0sb0NBQW9DLENBQUM7QUFHNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7Ozs7QUFNMUQsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7O0lBQ3BDLFlBQ1UsdUJBQWdELEVBQ2hELCtCQUFnRSxFQUNoRSxNQUFjO1FBRmQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCxvQ0FBK0IsR0FBL0IsK0JBQStCLENBQWlDO1FBQ2hFLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDckIsQ0FBQzs7Ozs7O0lBTUosTUFBTTtRQUNKLGtFQUFrRTtRQUNsRSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7OztRQUVyQyxTQUFTLGtCQUFrQixDQUV6QixjQUEyQixFQUFFLEVBQzdCLE1BQXVDO1lBRXZDLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUssaUJBQWlCLENBQUMsaUJBQWlC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LFdBQVcsQ0FBQyxVQUFVLENBQUMscUJBQVEsVUFBVSxJQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUUsQ0FBQzthQUM3RDtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7O1lBelZGLFVBQVU7Ozs7WUFURix1QkFBdUI7WUFDdkIsK0JBQStCO1lBRS9CLE1BQU07Ozs7Ozs7SUFTWCw0REFBd0Q7Ozs7O0lBQ3hELG9FQUF3RTs7Ozs7SUFDeEUsMkNBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25SZWR1Y2VyIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuL2VudGl0eS1jYWNoZSc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBDbGVhckNvbGxlY3Rpb25zLFxuICBMb2FkQ29sbGVjdGlvbnMsXG4gIE1lcmdlUXVlcnlTZXQsXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXRJdGVtLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIEVudGl0eUNhY2hlUmVkdWNlciB2aWEgaXRzIGNyZWF0ZSgpIG1ldGhvZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3I6IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBuZ3J4LWRhdGEgZW50aXR5IGNhY2hlIHJlZHVjZXIgd2hpY2ggZWl0aGVyIHJlc3BvbmRzIHRvIGVudGl0eSBjYWNoZSBsZXZlbCBhY3Rpb25zXG4gICAqIG9yIChtb3JlIGNvbW1vbmx5KSBkZWxlZ2F0ZXMgdG8gYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgYmFzZWQgb24gdGhlIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUuXG4gICAqL1xuICBjcmVhdGUoKTogQWN0aW9uUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPiB7XG4gICAgLy8gVGhpcyB0ZWNobmlxdWUgZW5zdXJlcyBhIG5hbWVkIGZ1bmN0aW9uIGFwcGVhcnMgaW4gdGhlIGRlYnVnZ2VyXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlUmVkdWNlci5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gZW50aXR5Q2FjaGVSZWR1Y2VyKFxuICAgICAgdGhpczogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgICAgYWN0aW9uOiB7IHR5cGU6IHN0cmluZzsgcGF5bG9hZD86IGFueSB9XG4gICAgKTogRW50aXR5Q2FjaGUge1xuICAgICAgLy8gRW50aXR5Q2FjaGUgYWN0aW9uc1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkNMRUFSX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBDbGVhckNvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTE9BRF9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBMb2FkQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIE1lcmdlUXVlcnlTZXRcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIFNhdmVFbnRpdGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0NhbmNlbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNFcnJvclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNFVF9FTlRJVFlfQ0FDSEU6IHtcbiAgICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIEVudGl0eUNhY2hlLiBCZSBjYXJlZnVsIVxuICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5jYWNoZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBlbnRpdHkgY29sbGVjdGlvbiByZWR1Y2VyIGlmIHRoaXMgaXMgYSB2YWxpZCBFbnRpdHlBY3Rpb24gZm9yIGEgY29sbGVjdGlvblxuICAgICAgY29uc3QgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgaWYgKHBheWxvYWQgJiYgcGF5bG9hZC5lbnRpdHlOYW1lICYmIHBheWxvYWQuZW50aXR5T3AgJiYgIXBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIEVudGl0eUFjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCBhIHZhbGlkIEVudGl0eUFjdGlvblxuICAgICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGNsZWFyIG11bHRpcGxlIGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBDbGVhckNvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIGFuIGFycmF5IG9mIGNvbGxlY3Rpb24gbmFtZXMuXG4gICAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhcnMgYWxsIHRoZSBjb2xsZWN0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBjbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBDbGVhckNvbGxlY3Rpb25zXG4gICkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uc3RcbiAgICBsZXQgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlJFTU9WRV9BTEw7XG5cbiAgICBpZiAoIWNvbGxlY3Rpb25zKSB7XG4gICAgICAvLyBDb2xsZWN0aW9ucyBpcyBub3QgZGVmaW5lZC4gQ2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgICAgY29sbGVjdGlvbnMgPSBPYmplY3Qua2V5cyhlbnRpdHlDYWNoZSk7XG4gICAgfVxuXG4gICAgZW50aXR5Q2FjaGUgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0geyBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBsb2FkIGNvbGxlY3Rpb24gaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIExvYWRDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyB0aGUgUXVlcnlTZXQgb2YgZW50aXR5IGNvbGxlY3Rpb25zIHRvIGxvYWRcbiAgICovXG4gIHByb3RlY3RlZCBsb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IExvYWRDb2xsZWN0aW9uc1xuICApIHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuQUREX0FMTDtcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb25zKTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBjb2xsZWN0aW9uc1tlbnRpdHlOYW1lXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIG1lcmdlIHF1ZXJ5IHNldHMgaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIE1lcmdlUXVlcnlTZXQgYWN0aW9uIHdpdGggdGhlIHF1ZXJ5IHNldCBhbmQgYSBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcm90ZWN0ZWQgbWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTWVyZ2VRdWVyeVNldFxuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgbWVyZ2VTdHJhdGVneSwgcXVlcnlTZXQsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBudWxsID8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuVVBTRVJUX01BTlk7XG5cbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKHF1ZXJ5U2V0KTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBxdWVyeVNldFtlbnRpdHlOYW1lXSxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8vICNyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICB0cnkge1xuICAgICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgICAgdGFnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH07XG4gICAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgICAgICBpZiAoYWN0LnBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBhY3QucGF5bG9hZC5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTlk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICkge1xuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoXG4gICAgICBlbnRpdHlDYWNoZSxcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVzIHx8IFtdXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzRXJyb3JcbiAgKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxBY3Rpb24gPSBhY3Rpb24ucGF5bG9hZC5vcmlnaW5hbEFjdGlvbjtcbiAgICBjb25zdCBvcmlnaW5hbENoYW5nZVNldCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IG9yaWdpbmFsQ2hhbmdlU2V0LmNoYW5nZXMubWFwKGl0ZW0gPT4gaXRlbS5lbnRpdHlOYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZSwgZW50aXR5TmFtZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hhbmdlU2V0LFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgdGFnLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTUztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIEFwcGx5IHJlZHVjZXIgZm9yIHRoZSBhY3Rpb24ncyBFbnRpdHlDb2xsZWN0aW9uIChpZiB0aGUgYWN0aW9uIHRhcmdldHMgYSBjb2xsZWN0aW9uKSAqL1xuICBwcml2YXRlIGFwcGx5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgY2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNhY2hlW2VudGl0eU5hbWVdO1xuICAgIGNvbnN0IHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkuZ2V0T3JDcmVhdGVSZWR1Y2VyKFxuICAgICAgZW50aXR5TmFtZVxuICAgICk7XG5cbiAgICBsZXQgbmV3Q29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjtcbiAgICB0cnkge1xuICAgICAgbmV3Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cbiAgICAgICAgPyByZWR1Y2VyKGNvbGxlY3Rpb24sIGFjdGlvbilcbiAgICAgICAgOiByZWR1Y2VyKHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IuY3JlYXRlKGVudGl0eU5hbWUpLCBhY3Rpb24pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5lcnJvciB8fCBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uIVxuICAgICAgPyBjYWNoZVxuICAgICAgOiB7IC4uLmNhY2hlLCBbZW50aXR5TmFtZV06IG5ld0NvbGxlY3Rpb24hIH07XG4gIH1cblxuICAvKiogRW5zdXJlIGxvYWRpbmcgaXMgZmFsc2UgZm9yIGV2ZXJ5IGNvbGxlY3Rpb24gaW4gZW50aXR5TmFtZXMgKi9cbiAgcHJpdmF0ZSBjbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzOiBzdHJpbmdbXSkge1xuICAgIGxldCBpc011dGF0ZWQgPSBmYWxzZTtcbiAgICBlbnRpdHlOYW1lcy5mb3JFYWNoKGVudGl0eU5hbWUgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGVudGl0eUNhY2hlW2VudGl0eU5hbWVdO1xuICAgICAgaWYgKGNvbGxlY3Rpb24ubG9hZGluZykge1xuICAgICAgICBpZiAoIWlzTXV0YXRlZCkge1xuICAgICAgICAgIGVudGl0eUNhY2hlID0geyAuLi5lbnRpdHlDYWNoZSB9O1xuICAgICAgICAgIGlzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5Q2FjaGVbZW50aXR5TmFtZV0gPSB7IC4uLmNvbGxlY3Rpb24sIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19