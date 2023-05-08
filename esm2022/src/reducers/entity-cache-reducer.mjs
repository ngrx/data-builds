import { Injectable } from '@angular/core';
import { EntityCacheAction, } from '../actions/entity-cache-action';
import { ChangeSetOperation, } from '../actions/entity-cache-change-set';
import { EntityOp } from '../actions/entity-op';
import { MergeStrategy } from '../actions/merge-strategy';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-creator";
import * as i2 from "./entity-collection-reducer-registry";
import * as i3 from "../utils/interfaces";
/**
 * Creates the EntityCacheReducer via its create() method
 */
class EntityCacheReducerFactory {
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
        // eslint-disable-next-line prefer-const
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
        // eslint-disable-next-line prefer-const
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
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
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
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
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
            : { ...cache, [entityName]: newCollection };
    }
    /** Ensure loading is false for every collection in entityNames */
    clearLoadingFlags(entityCache, entityNames) {
        let isMutated = false;
        entityNames.forEach((entityName) => {
            const collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = { ...entityCache };
                    isMutated = true;
                }
                entityCache[entityName] = { ...collection, loading: false };
            }
        });
        return entityCache;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCacheReducerFactory, deps: [{ token: i1.EntityCollectionCreator }, { token: i2.EntityCollectionReducerRegistry }, { token: i3.Logger }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCacheReducerFactory }); }
}
export { EntityCacheReducerFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCacheReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityCollectionCreator }, { type: i2.EntityCollectionReducerRegistry }, { type: i3.Logger }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNM0MsT0FBTyxFQUNMLGlCQUFpQixHQVFsQixNQUFNLGdDQUFnQyxDQUFDO0FBRXhDLE9BQU8sRUFDTCxrQkFBa0IsR0FFbkIsTUFBTSxvQ0FBb0MsQ0FBQztBQUs1QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7OztBQUUxRDs7R0FFRztBQUNILE1BQ2EseUJBQXlCO0lBQ3BDLFlBQ1UsdUJBQWdELEVBQ2hELCtCQUFnRSxFQUNoRSxNQUFjO1FBRmQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCxvQ0FBK0IsR0FBL0IsK0JBQStCLENBQWlDO1FBQ2hFLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDckIsQ0FBQztJQUVKOzs7T0FHRztJQUNILE1BQU07UUFDSixrRUFBa0U7UUFDbEUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckMsU0FBUyxrQkFBa0IsQ0FFekIsY0FBMkIsRUFBRSxFQUM3QixNQUF1QztZQUV2QyxzQkFBc0I7WUFDdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNuQixLQUFLLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ3hDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUNqQyxXQUFXLEVBQ1gsTUFBMEIsQ0FDM0IsQ0FBQztpQkFDSDtnQkFFRCxLQUFLLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ3ZDLE9BQU8sSUFBSSxD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QUFVLENBQUMsQ0FBQztZQUMzQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2QsV0FBVyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztvQkFDakMsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDbEI7Z0JBQ0QsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO2FBQzdEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO2lJQS9VVSx5QkFBeUI7cUlBQXpCLHlCQUF5Qjs7U0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBRHJDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vZW50aXR5LWNhY2hlJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIENsZWFyQ29sbGVjdGlvbnMsXG4gIExvYWRDb2xsZWN0aW9ucyxcbiAgTWVyZ2VRdWVyeVNldCxcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldEl0ZW0sXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgRW50aXR5Q2FjaGVSZWR1Y2VyIHZpYSBpdHMgY3JlYXRlKCkgbWV0aG9kXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcjogRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIEBuZ3J4L2RhdGEgZW50aXR5IGNhY2hlIHJlZHVjZXIgd2hpY2ggZWl0aGVyIHJlc3BvbmRzIHRvIGVudGl0eSBjYWNoZSBsZXZlbCBhY3Rpb25zXG4gICAqIG9yIChtb3JlIGNvbW1vbmx5KSBkZWxlZ2F0ZXMgdG8gYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgYmFzZWQgb24gdGhlIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUuXG4gICAqL1xuICBjcmVhdGUoKTogQWN0aW9uUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPiB7XG4gICAgLy8gVGhpcyB0ZWNobmlxdWUgZW5zdXJlcyBhIG5hbWVkIGZ1bmN0aW9uIGFwcGVhcnMgaW4gdGhlIGRlYnVnZ2VyXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlUmVkdWNlci5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gZW50aXR5Q2FjaGVSZWR1Y2VyKFxuICAgICAgdGhpczogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgICAgYWN0aW9uOiB7IHR5cGU6IHN0cmluZzsgcGF5bG9hZD86IGFueSB9XG4gICAgKTogRW50aXR5Q2FjaGUge1xuICAgICAgLy8gRW50aXR5Q2FjaGUgYWN0aW9uc1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkNMRUFSX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBDbGVhckNvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTE9BRF9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBMb2FkQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIE1lcmdlUXVlcnlTZXRcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIFNhdmVFbnRpdGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0NhbmNlbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNFcnJvclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNFVF9FTlRJVFlfQ0FDSEU6IHtcbiAgICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIEVudGl0eUNhY2hlLiBCZSBjYXJlZnVsIVxuICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5jYWNoZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBlbnRpdHkgY29sbGVjdGlvbiByZWR1Y2VyIGlmIHRoaXMgaXMgYSB2YWxpZCBFbnRpdHlBY3Rpb24gZm9yIGEgY29sbGVjdGlvblxuICAgICAgY29uc3QgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgaWYgKHBheWxvYWQgJiYgcGF5bG9hZC5lbnRpdHlOYW1lICYmIHBheWxvYWQuZW50aXR5T3AgJiYgIXBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIEVudGl0eUFjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCBhIHZhbGlkIEVudGl0eUFjdGlvblxuICAgICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGNsZWFyIG11bHRpcGxlIGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBDbGVhckNvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIGFuIGFycmF5IG9mIGNvbGxlY3Rpb24gbmFtZXMuXG4gICAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhcnMgYWxsIHRoZSBjb2xsZWN0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBjbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBDbGVhckNvbGxlY3Rpb25zXG4gICkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgICBsZXQgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlJFTU9WRV9BTEw7XG5cbiAgICBpZiAoIWNvbGxlY3Rpb25zKSB7XG4gICAgICAvLyBDb2xsZWN0aW9ucyBpcyBub3QgZGVmaW5lZC4gQ2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgICAgY29sbGVjdGlvbnMgPSBPYmplY3Qua2V5cyhlbnRpdHlDYWNoZSk7XG4gICAgfVxuXG4gICAgZW50aXR5Q2FjaGUgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0geyBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBsb2FkIGNvbGxlY3Rpb24gaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIExvYWRDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyB0aGUgUXVlcnlTZXQgb2YgZW50aXR5IGNvbGxlY3Rpb25zIHRvIGxvYWRcbiAgICovXG4gIHByb3RlY3RlZCBsb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IExvYWRDb2xsZWN0aW9uc1xuICApIHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuQUREX0FMTDtcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb25zKTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBjb2xsZWN0aW9uc1tlbnRpdHlOYW1lXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIG1lcmdlIHF1ZXJ5IHNldHMgaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIE1lcmdlUXVlcnlTZXQgYWN0aW9uIHdpdGggdGhlIHF1ZXJ5IHNldCBhbmQgYSBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcm90ZWN0ZWQgbWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTWVyZ2VRdWVyeVNldFxuICApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgbWVyZ2VTdHJhdGVneSwgcXVlcnlTZXQsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBudWxsID8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuUVVFUllfTUFOWV9TVUNDRVNTO1xuXG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhxdWVyeVNldCk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogcXVlcnlTZXRbZW50aXR5TmFtZV0sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvLyAjcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNcbiAgKSB7XG4gICAgY29uc3QgeyBjaGFuZ2VTZXQsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYywgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPVxuICAgICAgYWN0aW9uLnBheWxvYWQ7XG5cbiAgICB0cnkge1xuICAgICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgICB0YWcsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfTtcbiAgICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgICAgIGlmIChhY3QucGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgIHRocm93IGFjdC5wYXlsb2FkLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICBmdW5jdGlvbiBnZXRFbnRpdHlPcChpdGVtOiBDaGFuZ2VTZXRJdGVtKSB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ub3ApIHtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0FERF9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0OlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNDYW5jZWxSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc0NhbmNlbFxuICApIHtcbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKFxuICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lcyB8fCBbXVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc0Vycm9yXG4gICkge1xuICAgIGNvbnN0IG9yaWdpbmFsQWN0aW9uID0gYWN0aW9uLnBheWxvYWQub3JpZ2luYWxBY3Rpb247XG4gICAgY29uc3Qgb3JpZ2luYWxDaGFuZ2VTZXQgPSBvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldDtcblxuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBvcmlnaW5hbENoYW5nZVNldC5jaGFuZ2VzLm1hcChcbiAgICAgIChpdGVtKSA9PiBpdGVtLmVudGl0eU5hbWVcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlLCBlbnRpdHlOYW1lcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICApIHtcbiAgICBjb25zdCB7IGNoYW5nZVNldCwgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfSA9XG4gICAgICBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGNoYW5nZVNldC5jaGFuZ2VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgdGFnLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTUztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIEFwcGx5IHJlZHVjZXIgZm9yIHRoZSBhY3Rpb24ncyBFbnRpdHlDb2xsZWN0aW9uIChpZiB0aGUgYWN0aW9uIHRhcmdldHMgYSBjb2xsZWN0aW9uKSAqL1xuICBwcml2YXRlIGFwcGx5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgY2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNhY2hlW2VudGl0eU5hbWVdO1xuICAgIGNvbnN0IHJlZHVjZXIgPVxuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LmdldE9yQ3JlYXRlUmVkdWNlcihlbnRpdHlOYW1lKTtcblxuICAgIGxldCBuZXdDb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uO1xuICAgIHRyeSB7XG4gICAgICBuZXdDb2xsZWN0aW9uID0gY29sbGVjdGlvblxuICAgICAgICA/IHJlZHVjZXIoY29sbGVjdGlvbiwgYWN0aW9uKVxuICAgICAgICA6IHJlZHVjZXIodGhpcy5lbnRpdHlDb2xsZWN0aW9uQ3JlYXRvci5jcmVhdGUoZW50aXR5TmFtZSksIGFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuZXJyb3IgfHwgY29sbGVjdGlvbiA9PT0gbmV3Q29sbGVjdGlvbiFcbiAgICAgID8gY2FjaGVcbiAgICAgIDogeyAuLi5jYWNoZSwgW2VudGl0eU5hbWVdOiBuZXdDb2xsZWN0aW9uISB9O1xuICB9XG5cbiAgLyoqIEVuc3VyZSBsb2FkaW5nIGlzIGZhbHNlIGZvciBldmVyeSBjb2xsZWN0aW9uIGluIGVudGl0eU5hbWVzICovXG4gIHByaXZhdGUgY2xlYXJMb2FkaW5nRmxhZ3MoZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLCBlbnRpdHlOYW1lczogc3RyaW5nW10pIHtcbiAgICBsZXQgaXNNdXRhdGVkID0gZmFsc2U7XG4gICAgZW50aXR5TmFtZXMuZm9yRWFjaCgoZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGVudGl0eUNhY2hlW2VudGl0eU5hbWVdO1xuICAgICAgaWYgKGNvbGxlY3Rpb24ubG9hZGluZykge1xuICAgICAgICBpZiAoIWlzTXV0YXRlZCkge1xuICAgICAgICAgIGVudGl0eUNhY2hlID0geyAuLi5lbnRpdHlDYWNoZSB9O1xuICAgICAgICAgIGlzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5Q2FjaGVbZW50aXR5TmFtZV0gPSB7IC4uLmNvbGxlY3Rpb24sIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19