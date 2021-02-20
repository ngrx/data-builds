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
    constructor(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
        this.entityCollectionCreator = entityCollectionCreator;
        this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
        this.logger = logger;
    }
    /**
     * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     */
    create() {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);
        function entityCacheReducer(entityCache = {}, action) {
            // EntityCache actions
            switch (action.type) {
                case EntityCacheAction.CLEAR_COLLECTIONS: {
                    return this.clearCollectionsReducer(entityCache, action);
                }
                case EntityCacheAction.LOAD_COLLECTIONS: {
                    return this.loadCollectionsReducer(entityCache, action);
                }
                case EntityCacheAction.MERGE_QUERY_SET: {
                    return this.mergeQuerySetReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES: {
                    return this.saveEntitiesReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                    return this.saveEntitiesCancelReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_ERROR: {
                    return this.saveEntitiesErrorReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                    return this.saveEntitiesSuccessReducer(entityCache, action);
                }
                case EntityCacheAction.SET_ENTITY_CACHE: {
                    // Completely replace the EntityCache. Be careful!
                    return action.payload.cache;
                }
            }
            // Apply entity collection reducer if this is a valid EntityAction for a collection
            const payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, action);
            }
            // Not a valid EntityAction
            return entityCache;
        }
    }
    /**
     * Reducer to clear multiple collections at the same time.
     * @param entityCache the entity cache
     * @param action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     */
    clearCollectionsReducer(entityCache, action) {
        // tslint:disable-next-line:prefer-const
        let { collections, tag } = action.payload;
        const entityOp = EntityOp.REMOVE_ALL;
        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }
        entityCache = collections.reduce((newCache, entityName) => {
            const payload = { entityName, entityOp };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
     */
    loadCollectionsReducer(entityCache, action) {
        const { collections, tag } = action.payload;
        const entityOp = EntityOp.ADD_ALL;
        const entityNames = Object.keys(collections);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: collections[entityName],
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a MergeQuerySet action with the query set and a MergeStrategy
     */
    mergeQuerySetReducer(entityCache, action) {
        // tslint:disable-next-line:prefer-const
        let { mergeStrategy, querySet, tag } = action.payload;
        mergeStrategy =
            mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
        const entityOp = EntityOp.QUERY_MANY_SUCCESS;
        const entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: querySet[entityName],
                mergeStrategy,
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    // #region saveEntities reducers
    saveEntitiesReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag, } = action.payload;
        try {
            changeSet.changes.forEach((item) => {
                const entityName = item.entityName;
                const payload = {
                    entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId,
                    isOptimistic,
                    mergeStrategy,
                    tag,
                };
                const act = {
                    type: `[${entityName}] ${action.type}`,
                    payload,
                };
                entityCache = this.applyCollectionReducer(entityCache, act);
                if (act.payload.error) {
                    throw act.payload.error;
                }
            });
        }
        catch (error) {
            action.payload.error = error;
        }
        return entityCache;
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
    saveEntitiesCancelReducer(entityCache, action) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
    }
    saveEntitiesErrorReducer(entityCache, action) {
        const originalAction = action.payload.originalAction;
        const originalChangeSet = originalAction.payload.changeSet;
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        const entityNames = originalChangeSet.changes.map((item) => item.entityName);
        return this.clearLoadingFlags(entityCache, entityNames);
    }
    saveEntitiesSuccessReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag, } = action.payload;
        changeSet.changes.forEach((item) => {
            const entityName = item.entityName;
            const payload = {
                entityName,
                entityOp: getEntityOp(item),
                data: item.entities,
                correlationId,
                isOptimistic,
                mergeStrategy,
                tag,
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            entityCache = this.applyCollectionReducer(entityCache, act);
        });
        return entityCache;
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
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    applyCollectionReducer(cache = {}, action) {
        const entityName = action.payload.entityName;
        const collection = cache[entityName];
        const reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
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
        return action.payload.error || collection === newCollection
            ? cache
            : Object.assign(Object.assign({}, cache), { [entityName]: newCollection });
    }
    /** Ensure loading is false for every collection in entityNames */
    clearLoadingFlags(entityCache, entityNames) {
        let isMutated = false;
        entityNames.forEach((entityName) => {
            const collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = Object.assign({}, entityCache);
                    isMutated = true;
                }
                entityCache[entityName] = Object.assign(Object.assign({}, collection), { loading: false });
            }
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNM0MsT0FBTyxFQUNMLGlCQUFpQixHQVFsQixNQUFNLGdDQUFnQyxDQUFDO0FBRXhDLE9BQU8sRUFDTCxrQkFBa0IsR0FFbkIsTUFBTSxvQ0FBb0MsQ0FBQztBQUc1QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUUxRDs7R0FFRztBQUVILE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsWUFDVSx1QkFBZ0QsRUFDaEQsK0JBQWdFLEVBQ2hFLE1BQWM7UUFGZCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9DQUErQixHQUEvQiwrQkFBK0IsQ0FBaUM7UUFDaEUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUNyQixDQUFDO0lBRUo7OztPQUdHO0lBQ0gsTUFBTTtRQUNKLGtFQUFrRTtRQUNsRSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxTQUFTLGtCQUFrQixDQUV6QixjQUEyQixFQUFFLEVBQzdCLE1BQXVDO1lBRXZDLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUssaUJBQWlCLENBQUMsaUJBQWlCLENB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LEVBQUUsV0FBcUI7UUFDdkUsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNqQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNkLFdBQVcscUJBQVEsV0FBVyxDQUFFLENBQUM7b0JBQ2pDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO2dCQUNELFdBQVcsQ0FBQyxVQUFVLENBQUMsbUNBQVEsVUFBVSxLQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUUsQ0FBQzthQUM3RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7O1lBM1ZGLFVBQVU7Ozs7WUFURix1QkFBdUI7WUFDdkIsK0JBQStCO1lBRS9CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vZW50aXR5LWNhY2hlJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIENsZWFyQ29sbGVjdGlvbnMsXG4gIExvYWRDb2xsZWN0aW9ucyxcbiAgTWVyZ2VRdWVyeVNldCxcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldEl0ZW0sXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgRW50aXR5Q2FjaGVSZWR1Y2VyIHZpYSBpdHMgY3JlYXRlKCkgbWV0aG9kXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcjogRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIEBuZ3J4L2RhdGEgZW50aXR5IGNhY2hlIHJlZHVjZXIgd2hpY2ggZWl0aGVyIHJlc3BvbmRzIHRvIGVudGl0eSBjYWNoZSBsZXZlbCBhY3Rpb25zXG4gICAqIG9yIChtb3JlIGNvbW1vbmx5KSBkZWxlZ2F0ZXMgdG8gYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgYmFzZWQgb24gdGhlIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUuXG4gICAqL1xuICBjcmVhdGUoKTogQWN0aW9uUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPiB7XG4gICAgLy8gVGhpcyB0ZWNobmlxdWUgZW5zdXJlcyBhIG5hbWVkIGZ1bmN0aW9uIGFwcGVhcnMgaW4gdGhlIGRlYnVnZ2VyXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlUmVkdWNlci5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gZW50aXR5Q2FjaGVSZWR1Y2VyKFxuICAgICAgdGhpczogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgICAgYWN0aW9uOiB7IHR5cGU6IHN0cmluZzsgcGF5bG9hZD86IGFueSB9XG4gICAgKTogRW50aXR5Q2FjaGUge1xuICAgICAgLy8gRW50aXR5Q2FjaGUgYWN0aW9uc1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkNMRUFSX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBDbGVhckNvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTE9BRF9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBMb2FkQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIE1lcmdlUXVlcnlTZXRcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIFNhdmVFbnRpdGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0NhbmNlbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNFcnJvclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNFVF9FTlRJVFlfQ0FDSEU6IHtcbiAgICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIEVudGl0eUNhY2hlLiBCZSBjYXJlZnVsIVxuICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5jYWNoZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBlbnRpdHkgY29sbGVjdGlvbiByZWR1Y2VyIGlmIHRoaXMgaXMgYSB2YWxpZCBFbnRpdHlBY3Rpb24gZm9yIGEgY29sbGVjdGlvblxuICAgICAgY29uc3QgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgaWYgKHBheWxvYWQgJiYgcGF5bG9hZC5lbnRpdHlOYW1lICYmIHBheWxvYWQuZW50aXR5T3AgJiYgIXBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIEVudGl0eUFjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCBhIHZhbGlkIEVudGl0eUFjdGlvblxuICAgICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGNsZWFyIG11bHRpcGxlIGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBDbGVhckNvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIGFuIGFycmF5IG9mIGNvbGxlY3Rpb24gbmFtZXMuXG4gICAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhcnMgYWxsIHRoZSBjb2xsZWN0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBjbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBDbGVhckNvbGxlY3Rpb25zXG4gICkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uc3RcbiAgICBsZXQgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlJFTU9WRV9BTEw7XG5cbiAgICBpZiAoIWNvbGxlY3Rpb25zKSB7XG4gICAgICAvLyBDb2xsZWN0aW9ucyBpcyBub3QgZGVmaW5lZC4gQ2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgICAgY29sbGVjdGlvbnMgPSBPYmplY3Qua2V5cyhlbnRpdHlDYWNoZSk7XG4gICAgfVxuXG4gICAgZW50aXR5Q2FjaGUgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0geyBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBsb2FkIGNvbGxlY3Rpb24gaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIExvYWRDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyB0aGUgUXVlcnlTZXQgb2YgZW50aXR5IGNvbGxlY3Rpb25zIHRvIGxvYWRcbiAgICovXG4gIHByb3RlY3RlZCBsb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IExvYWRDb2xsZWN0aW9uc1xuICApIHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuQUREX0FMTDtcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb25zKTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBjb2xsZWN0aW9uc1tlbnRpdHlOYW1lXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIG1lcmdlIHF1ZXJ5IHNldHMgaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIE1lcmdlUXVlcnlTZXQgYWN0aW9uIHdpdGggdGhlIHF1ZXJ5IHNldCBhbmQgYSBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcm90ZWN0ZWQgbWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTWVyZ2VRdWVyeVNldFxuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgbWVyZ2VTdHJhdGVneSwgcXVlcnlTZXQsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBudWxsID8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuUVVFUllfTUFOWV9TVUNDRVNTO1xuXG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhxdWVyeVNldCk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogcXVlcnlTZXRbZW50aXR5TmFtZV0sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvLyAjcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNcbiAgKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hhbmdlU2V0LFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNoYW5nZVNldC5jaGFuZ2VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgICAgdGFnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH07XG4gICAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgICAgICBpZiAoYWN0LnBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBhY3QucGF5bG9hZC5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTlk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICkge1xuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoXG4gICAgICBlbnRpdHlDYWNoZSxcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVzIHx8IFtdXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzRXJyb3JcbiAgKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxBY3Rpb24gPSBhY3Rpb24ucGF5bG9hZC5vcmlnaW5hbEFjdGlvbjtcbiAgICBjb25zdCBvcmlnaW5hbENoYW5nZVNldCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IG9yaWdpbmFsQ2hhbmdlU2V0LmNoYW5nZXMubWFwKFxuICAgICAgKGl0ZW0pID0+IGl0ZW0uZW50aXR5TmFtZVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoZW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNTdWNjZXNzXG4gICkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoYW5nZVNldCxcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICBpc09wdGltaXN0aWMsXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgdGFnLFxuICAgIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGNoYW5nZVNldC5jaGFuZ2VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgdGFnLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTUztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIEFwcGx5IHJlZHVjZXIgZm9yIHRoZSBhY3Rpb24ncyBFbnRpdHlDb2xsZWN0aW9uIChpZiB0aGUgYWN0aW9uIHRhcmdldHMgYSBjb2xsZWN0aW9uKSAqL1xuICBwcml2YXRlIGFwcGx5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgY2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNhY2hlW2VudGl0eU5hbWVdO1xuICAgIGNvbnN0IHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkuZ2V0T3JDcmVhdGVSZWR1Y2VyKFxuICAgICAgZW50aXR5TmFtZVxuICAgICk7XG5cbiAgICBsZXQgbmV3Q29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjtcbiAgICB0cnkge1xuICAgICAgbmV3Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cbiAgICAgICAgPyByZWR1Y2VyKGNvbGxlY3Rpb24sIGFjdGlvbilcbiAgICAgICAgOiByZWR1Y2VyKHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IuY3JlYXRlKGVudGl0eU5hbWUpLCBhY3Rpb24pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5lcnJvciB8fCBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uIVxuICAgICAgPyBjYWNoZVxuICAgICAgOiB7IC4uLmNhY2hlLCBbZW50aXR5TmFtZV06IG5ld0NvbGxlY3Rpb24hIH07XG4gIH1cblxuICAvKiogRW5zdXJlIGxvYWRpbmcgaXMgZmFsc2UgZm9yIGV2ZXJ5IGNvbGxlY3Rpb24gaW4gZW50aXR5TmFtZXMgKi9cbiAgcHJpdmF0ZSBjbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzOiBzdHJpbmdbXSkge1xuICAgIGxldCBpc011dGF0ZWQgPSBmYWxzZTtcbiAgICBlbnRpdHlOYW1lcy5mb3JFYWNoKChlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gZW50aXR5Q2FjaGVbZW50aXR5TmFtZV07XG4gICAgICBpZiAoY29sbGVjdGlvbi5sb2FkaW5nKSB7XG4gICAgICAgIGlmICghaXNNdXRhdGVkKSB7XG4gICAgICAgICAgZW50aXR5Q2FjaGUgPSB7IC4uLmVudGl0eUNhY2hlIH07XG4gICAgICAgICAgaXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXSA9IHsgLi4uY29sbGVjdGlvbiwgbG9hZGluZzogZmFsc2UgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG4iXX0=