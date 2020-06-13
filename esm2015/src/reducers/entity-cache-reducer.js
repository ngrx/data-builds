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
        const entityOp = EntityOp.QUERY_MANY_SUCCESS;
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
            (item) => {
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
        (item) => item.entityName));
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
        (item) => {
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
        (entityName) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU0zQyxPQUFPLEVBQ0wsaUJBQWlCLEdBUWxCLE1BQU0sZ0NBQWdDLENBQUM7QUFFeEMsT0FBTyxFQUNMLGtCQUFrQixHQUVuQixNQUFNLG9DQUFvQyxDQUFDO0FBRzVDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7O0FBTTFELE1BQU0sT0FBTyx5QkFBeUI7Ozs7OztJQUNwQyxZQUNVLHVCQUFnRCxFQUNoRCwrQkFBZ0UsRUFDaEUsTUFBYztRQUZkLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsb0NBQStCLEdBQS9CLCtCQUErQixDQUFpQztRQUNoRSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3JCLENBQUM7Ozs7OztJQU1KLE1BQU07UUFDSixrRUFBa0U7UUFDbEUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7Ozs7UUFFckMsU0FBUyxrQkFBa0IsQ0FFekIsY0FBMkIsRUFBRSxFQUM3QixNQUF1QztZQUV2QyxzQkFBc0I7WUFDdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNuQixLQUFLLGlCQUFpQixDQUFDLGlCQUFpQixD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QUFJLENBQUM7aUJBQ2xCO2dCQUNELFdBQVcsQ0FBQyxVQUFVLENBQUMsbUNBQVEsVUFBVSxLQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUUsQ0FBQzthQUM3RDtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7O1lBM1ZGLFVBQVU7Ozs7WUFURix1QkFBdUI7WUFDdkIsK0JBQStCO1lBRS9CLE1BQU07Ozs7Ozs7SUFTWCw0REFBd0Q7Ozs7O0lBQ3hELG9FQUF3RTs7Ozs7SUFDeEUsMkNBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25SZWR1Y2VyIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuL2VudGl0eS1jYWNoZSc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBDbGVhckNvbGxlY3Rpb25zLFxuICBMb2FkQ29sbGVjdGlvbnMsXG4gIE1lcmdlUXVlcnlTZXQsXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXRJdGVtLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIEVudGl0eUNhY2hlUmVkdWNlciB2aWEgaXRzIGNyZWF0ZSgpIG1ldGhvZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3I6IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBAbmdyeC9kYXRhIGVudGl0eSBjYWNoZSByZWR1Y2VyIHdoaWNoIGVpdGhlciByZXNwb25kcyB0byBlbnRpdHkgY2FjaGUgbGV2ZWwgYWN0aW9uc1xuICAgKiBvciAobW9yZSBjb21tb25seSkgZGVsZWdhdGVzIHRvIGFuIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyIGJhc2VkIG9uIHRoZSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lLlxuICAgKi9cbiAgY3JlYXRlKCk6IEFjdGlvblJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4ge1xuICAgIC8vIFRoaXMgdGVjaG5pcXVlIGVuc3VyZXMgYSBuYW1lZCBmdW5jdGlvbiBhcHBlYXJzIGluIHRoZSBkZWJ1Z2dlclxuICAgIHJldHVybiBlbnRpdHlDYWNoZVJlZHVjZXIuYmluZCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIGVudGl0eUNhY2hlUmVkdWNlcihcbiAgICAgIHRoaXM6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICAgIGFjdGlvbjogeyB0eXBlOiBzdHJpbmc7IHBheWxvYWQ/OiBhbnkgfVxuICAgICk6IEVudGl0eUNhY2hlIHtcbiAgICAgIC8vIEVudGl0eUNhY2hlIGFjdGlvbnNcbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgQ2xlYXJDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTG9hZENvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTUVSR0VfUVVFUllfU0VUOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBNZXJnZVF1ZXJ5U2V0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1JlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBTYXZlRW50aXRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNDYW5jZWxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0VSUk9SOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzRXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1M6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFOiB7XG4gICAgICAgICAgLy8gQ29tcGxldGVseSByZXBsYWNlIHRoZSBFbnRpdHlDYWNoZS4gQmUgY2FyZWZ1bCFcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuY2FjaGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgZW50aXR5IGNvbGxlY3Rpb24gcmVkdWNlciBpZiB0aGlzIGlzIGEgdmFsaWQgRW50aXR5QWN0aW9uIGZvciBhIGNvbGxlY3Rpb25cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQuZW50aXR5TmFtZSAmJiBwYXlsb2FkLmVudGl0eU9wICYmICFwYXlsb2FkLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBFbnRpdHlBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3QgYSB2YWxpZCBFbnRpdHlBY3Rpb25cbiAgICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBjbGVhciBtdWx0aXBsZSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgQ2xlYXJDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyBhbiBhcnJheSBvZiBjb2xsZWN0aW9uIG5hbWVzLlxuICAgKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBubyBhcnJheSwgY2xlYXJzIGFsbCB0aGUgY29sbGVjdGlvbnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogQ2xlYXJDb2xsZWN0aW9uc1xuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5SRU1PVkVfQUxMO1xuXG4gICAgaWYgKCFjb2xsZWN0aW9ucykge1xuICAgICAgLy8gQ29sbGVjdGlvbnMgaXMgbm90IGRlZmluZWQuIENsZWFyIGFsbCBjb2xsZWN0aW9ucy5cbiAgICAgIGNvbGxlY3Rpb25zID0gT2JqZWN0LmtleXMoZW50aXR5Q2FjaGUpO1xuICAgIH1cblxuICAgIGVudGl0eUNhY2hlID0gY29sbGVjdGlvbnMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHsgZW50aXR5TmFtZSwgZW50aXR5T3AgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbG9hZCBjb2xsZWN0aW9uIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBMb2FkQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgdGhlIFF1ZXJ5U2V0IG9mIGVudGl0eSBjb2xsZWN0aW9ucyB0byBsb2FkXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBMb2FkQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLkFERF9BTEw7XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9ucyk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogY29sbGVjdGlvbnNbZW50aXR5TmFtZV0sXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBtZXJnZSBxdWVyeSBzZXRzIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBNZXJnZVF1ZXJ5U2V0IGFjdGlvbiB3aXRoIHRoZSBxdWVyeSBzZXQgYW5kIGEgTWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcHJvdGVjdGVkIG1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IE1lcmdlUXVlcnlTZXRcbiAgKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1jb25zdFxuICAgIGxldCB7IG1lcmdlU3RyYXRlZ3ksIHF1ZXJ5U2V0LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlFVRVJZX01BTllfU1VDQ0VTUztcblxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMocXVlcnlTZXQpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IHF1ZXJ5U2V0W2VudGl0eU5hbWVdLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoYW5nZVNldCxcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICBpc09wdGltaXN0aWMsXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgdGFnLFxuICAgIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIHRyeSB7XG4gICAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICAgIHRhZyxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgICBwYXlsb2FkLFxuICAgICAgICB9O1xuICAgICAgICBlbnRpdHlDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0KTtcbiAgICAgICAgaWYgKGFjdC5wYXlsb2FkLmVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgYWN0LnBheWxvYWQuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICBmdW5jdGlvbiBnZXRFbnRpdHlPcChpdGVtOiBDaGFuZ2VTZXRJdGVtKSB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ub3ApIHtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0FERF9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0OlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNDYW5jZWxSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc0NhbmNlbFxuICApIHtcbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKFxuICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lcyB8fCBbXVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc0Vycm9yXG4gICkge1xuICAgIGNvbnN0IG9yaWdpbmFsQWN0aW9uID0gYWN0aW9uLnBheWxvYWQub3JpZ2luYWxBY3Rpb247XG4gICAgY29uc3Qgb3JpZ2luYWxDaGFuZ2VTZXQgPSBvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldDtcblxuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBvcmlnaW5hbENoYW5nZVNldC5jaGFuZ2VzLm1hcChcbiAgICAgIChpdGVtKSA9PiBpdGVtLmVudGl0eU5hbWVcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlLCBlbnRpdHlOYW1lcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgIHRhZyxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBlbnRpdHlDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICBmdW5jdGlvbiBnZXRFbnRpdHlPcChpdGVtOiBDaGFuZ2VTZXRJdGVtKSB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ub3ApIHtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0OlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX1NVQ0NFU1M7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIC8qKiBBcHBseSByZWR1Y2VyIGZvciB0aGUgYWN0aW9uJ3MgRW50aXR5Q29sbGVjdGlvbiAoaWYgdGhlIGFjdGlvbiB0YXJnZXRzIGEgY29sbGVjdGlvbikgKi9cbiAgcHJpdmF0ZSBhcHBseUNvbGxlY3Rpb25SZWR1Y2VyKFxuICAgIGNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICkge1xuICAgIGNvbnN0IGVudGl0eU5hbWUgPSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjYWNoZVtlbnRpdHlOYW1lXTtcbiAgICBjb25zdCByZWR1Y2VyID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LmdldE9yQ3JlYXRlUmVkdWNlcihcbiAgICAgIGVudGl0eU5hbWVcbiAgICApO1xuXG4gICAgbGV0IG5ld0NvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb247XG4gICAgdHJ5IHtcbiAgICAgIG5ld0NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uXG4gICAgICAgID8gcmVkdWNlcihjb2xsZWN0aW9uLCBhY3Rpb24pXG4gICAgICAgIDogcmVkdWNlcih0aGlzLmVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLmNyZWF0ZShlbnRpdHlOYW1lKSwgYWN0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuZXJyb3IgfHwgY29sbGVjdGlvbiA9PT0gbmV3Q29sbGVjdGlvbiFcbiAgICAgID8gY2FjaGVcbiAgICAgIDogeyAuLi5jYWNoZSwgW2VudGl0eU5hbWVdOiBuZXdDb2xsZWN0aW9uISB9O1xuICB9XG5cbiAgLyoqIEVuc3VyZSBsb2FkaW5nIGlzIGZhbHNlIGZvciBldmVyeSBjb2xsZWN0aW9uIGluIGVudGl0eU5hbWVzICovXG4gIHByaXZhdGUgY2xlYXJMb2FkaW5nRmxhZ3MoZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLCBlbnRpdHlOYW1lczogc3RyaW5nW10pIHtcbiAgICBsZXQgaXNNdXRhdGVkID0gZmFsc2U7XG4gICAgZW50aXR5TmFtZXMuZm9yRWFjaCgoZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGVudGl0eUNhY2hlW2VudGl0eU5hbWVdO1xuICAgICAgaWYgKGNvbGxlY3Rpb24ubG9hZGluZykge1xuICAgICAgICBpZiAoIWlzTXV0YXRlZCkge1xuICAgICAgICAgIGVudGl0eUNhY2hlID0geyAuLi5lbnRpdHlDYWNoZSB9O1xuICAgICAgICAgIGlzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5Q2FjaGVbZW50aXR5TmFtZV0gPSB7IC4uLmNvbGxlY3Rpb24sIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19