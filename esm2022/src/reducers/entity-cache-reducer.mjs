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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i0, type: EntityCacheReducerFactory, deps: [{ token: i1.EntityCollectionCreator }, { token: i2.EntityCollectionReducerRegistry }, { token: i3.Logger }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i0, type: EntityCacheReducerFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i0, type: EntityCacheReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionCreator }, { type: i2.EntityCollectionReducerRegistry }, { type: i3.Logger }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNM0MsT0FBTyxFQUNMLGlCQUFpQixHQVFsQixNQUFNLGdDQUFnQyxDQUFDO0FBRXhDLE9BQU8sRUFDTCxrQkFBa0IsR0FFbkIsTUFBTSxvQ0FBb0MsQ0FBQztBQUs1QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7OztBQUUxRDs7R0FFRztBQUVILE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsWUFDVSx1QkFBZ0QsRUFDaEQsK0JBQWdFLEVBQ2hFLE1BQWM7UUFGZCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9DQUErQixHQUEvQiwrQkFBK0IsQ0FBaUM7UUFDaEUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUNyQixDQUFDO0lBRUo7OztPQUdHO0lBQ0gsTUFBTTtRQUNKLGtFQUFrRTtRQUNsRSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxTQUFTLGtCQUFrQixDQUV6QixjQUEyQixFQUFFLEVBQzdCLE1BQXVDO1lBRXZDLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUNqQyxXQUFXLEVBQ1gsTUFBMEIsQ0FDM0IsQ0FBQztnQkFDSixDQUFDO2dCQUVELEtBQUssaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FB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RUFBRSxhQUFjLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0VBQWtFO0lBQzFELGlCQUFpQixDQUFDLFdBQXdCLEVBQUUsV0FBcUI7UUFDdkUsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNqQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixXQUFXLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO29CQUNqQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixDQUFDO2dCQUNELFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUM5RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO3dJQS9VVSx5QkFBeUI7NElBQXpCLHlCQUF5Qjs7a0dBQXpCLHlCQUF5QjtrQkFEckMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUmVkdWNlciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgQ2xlYXJDb2xsZWN0aW9ucyxcbiAgTG9hZENvbGxlY3Rpb25zLFxuICBNZXJnZVF1ZXJ5U2V0LFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5cbmltcG9ydCB7XG4gIENoYW5nZVNldE9wZXJhdGlvbixcbiAgQ2hhbmdlU2V0SXRlbSxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItcmVnaXN0cnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBFbnRpdHlDYWNoZVJlZHVjZXIgdmlhIGl0cyBjcmVhdGUoKSBtZXRob2RcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yOiBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlclxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgQG5ncngvZGF0YSBlbnRpdHkgY2FjaGUgcmVkdWNlciB3aGljaCBlaXRoZXIgcmVzcG9uZHMgdG8gZW50aXR5IGNhY2hlIGxldmVsIGFjdGlvbnNcbiAgICogb3IgKG1vcmUgY29tbW9ubHkpIGRlbGVnYXRlcyB0byBhbiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlciBiYXNlZCBvbiB0aGUgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZS5cbiAgICovXG4gIGNyZWF0ZSgpOiBBY3Rpb25SZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+IHtcbiAgICAvLyBUaGlzIHRlY2huaXF1ZSBlbnN1cmVzIGEgbmFtZWQgZnVuY3Rpb24gYXBwZWFycyBpbiB0aGUgZGVidWdnZXJcbiAgICByZXR1cm4gZW50aXR5Q2FjaGVSZWR1Y2VyLmJpbmQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiBlbnRpdHlDYWNoZVJlZHVjZXIoXG4gICAgICB0aGlzOiBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgICBhY3Rpb246IHsgdHlwZTogc3RyaW5nOyBwYXlsb2FkPzogYW55IH1cbiAgICApOiBFbnRpdHlDYWNoZSB7XG4gICAgICAvLyBFbnRpdHlDYWNoZSBhY3Rpb25zXG4gICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uQ0xFQVJfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIENsZWFyQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5MT0FEX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIExvYWRDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLk1FUkdFX1FVRVJZX1NFVDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLm1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTWVyZ2VRdWVyeVNldFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNSZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUw6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWxSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19FUlJPUjoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0Vycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19TVUNDRVNTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNTdWNjZXNzXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0VUX0VOVElUWV9DQUNIRToge1xuICAgICAgICAgIC8vIENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgRW50aXR5Q2FjaGUuIEJlIGNhcmVmdWwhXG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmNhY2hlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGVudGl0eSBjb2xsZWN0aW9uIHJlZHVjZXIgaWYgdGhpcyBpcyBhIHZhbGlkIEVudGl0eUFjdGlvbiBmb3IgYSBjb2xsZWN0aW9uXG4gICAgICBjb25zdCBwYXlsb2FkID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBpZiAocGF5bG9hZCAmJiBwYXlsb2FkLmVudGl0eU5hbWUgJiYgcGF5bG9hZC5lbnRpdHlPcCAmJiAhcGF5bG9hZC5lcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3Rpb24gYXMgRW50aXR5QWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90IGEgdmFsaWQgRW50aXR5QWN0aW9uXG4gICAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gY2xlYXIgbXVsdGlwbGUgY29sbGVjdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIENsZWFyQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgYW4gYXJyYXkgb2YgY29sbGVjdGlvbiBuYW1lcy5cbiAgICogSWYgZW1wdHkgYXJyYXksIGRvZXMgbm90aGluZy4gSWYgbm8gYXJyYXksIGNsZWFycyBhbGwgdGhlIGNvbGxlY3Rpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IENsZWFyQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICAgIGxldCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuUkVNT1ZFX0FMTDtcblxuICAgIGlmICghY29sbGVjdGlvbnMpIHtcbiAgICAgIC8vIENvbGxlY3Rpb25zIGlzIG5vdCBkZWZpbmVkLiBDbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gICAgICBjb2xsZWN0aW9ucyA9IE9iamVjdC5rZXlzKGVudGl0eUNhY2hlKTtcbiAgICB9XG5cbiAgICBlbnRpdHlDYWNoZSA9IGNvbGxlY3Rpb25zLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7IGVudGl0eU5hbWUsIGVudGl0eU9wIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGxvYWQgY29sbGVjdGlvbiBpbiB0aGUgZm9ybSBvZiBhIGhhc2ggb2YgZW50aXR5IGRhdGEgZm9yIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgTG9hZENvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIHRoZSBRdWVyeVNldCBvZiBlbnRpdHkgY29sbGVjdGlvbnMgdG8gbG9hZFxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTG9hZENvbGxlY3Rpb25zXG4gICkge1xuICAgIGNvbnN0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5BRERfQUxMO1xuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbnMpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IGNvbGxlY3Rpb25zW2VudGl0eU5hbWVdLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbWVyZ2UgcXVlcnkgc2V0cyBpbiB0aGUgZm9ybSBvZiBhIGhhc2ggb2YgZW50aXR5IGRhdGEgZm9yIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgTWVyZ2VRdWVyeVNldCBhY3Rpb24gd2l0aCB0aGUgcXVlcnkgc2V0IGFuZCBhIE1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHByb3RlY3RlZCBtZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBNZXJnZVF1ZXJ5U2V0XG4gICkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgICBsZXQgeyBtZXJnZVN0cmF0ZWd5LCBxdWVyeVNldCwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IG51bGwgPyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5RVUVSWV9NQU5ZX1NVQ0NFU1M7XG5cbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKHF1ZXJ5U2V0KTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBxdWVyeVNldFtlbnRpdHlOYW1lXSxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8vICNyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApIHtcbiAgICBjb25zdCB7IGNoYW5nZVNldCwgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfSA9XG4gICAgICBhY3Rpb24ucGF5bG9hZDtcblxuICAgIHRyeSB7XG4gICAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICAgIHRhZyxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgICBwYXlsb2FkLFxuICAgICAgICB9O1xuICAgICAgICBlbnRpdHlDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0KTtcbiAgICAgICAgaWYgKGFjdC5wYXlsb2FkLmVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgYWN0LnBheWxvYWQuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTlk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICkge1xuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoXG4gICAgICBlbnRpdHlDYWNoZSxcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVzIHx8IFtdXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzRXJyb3JcbiAgKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxBY3Rpb24gPSBhY3Rpb24ucGF5bG9hZC5vcmlnaW5hbEFjdGlvbjtcbiAgICBjb25zdCBvcmlnaW5hbENoYW5nZVNldCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IG9yaWdpbmFsQ2hhbmdlU2V0LmNoYW5nZXMubWFwKFxuICAgICAgKGl0ZW0pID0+IGl0ZW0uZW50aXR5TmFtZVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoZW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNTdWNjZXNzXG4gICkge1xuICAgIGNvbnN0IHsgY2hhbmdlU2V0LCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9ID1cbiAgICAgIGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICB0YWcsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9TVUNDRVNTO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuXG4gIC8vICNyZWdpb24gaGVscGVyc1xuICAvKiogQXBwbHkgcmVkdWNlciBmb3IgdGhlIGFjdGlvbidzIEVudGl0eUNvbGxlY3Rpb24gKGlmIHRoZSBhY3Rpb24gdGFyZ2V0cyBhIGNvbGxlY3Rpb24pICovXG4gIHByaXZhdGUgYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihcbiAgICBjYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApIHtcbiAgICBjb25zdCBlbnRpdHlOYW1lID0gYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZTtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY2FjaGVbZW50aXR5TmFtZV07XG4gICAgY29uc3QgcmVkdWNlciA9XG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkuZ2V0T3JDcmVhdGVSZWR1Y2VyKGVudGl0eU5hbWUpO1xuXG4gICAgbGV0IG5ld0NvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb247XG4gICAgdHJ5IHtcbiAgICAgIG5ld0NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uXG4gICAgICAgID8gcmVkdWNlcihjb2xsZWN0aW9uLCBhY3Rpb24pXG4gICAgICAgIDogcmVkdWNlcih0aGlzLmVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLmNyZWF0ZShlbnRpdHlOYW1lKSwgYWN0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5lcnJvciB8fCBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uIVxuICAgICAgPyBjYWNoZVxuICAgICAgOiB7IC4uLmNhY2hlLCBbZW50aXR5TmFtZV06IG5ld0NvbGxlY3Rpb24hIH07XG4gIH1cblxuICAvKiogRW5zdXJlIGxvYWRpbmcgaXMgZmFsc2UgZm9yIGV2ZXJ5IGNvbGxlY3Rpb24gaW4gZW50aXR5TmFtZXMgKi9cbiAgcHJpdmF0ZSBjbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzOiBzdHJpbmdbXSkge1xuICAgIGxldCBpc011dGF0ZWQgPSBmYWxzZTtcbiAgICBlbnRpdHlOYW1lcy5mb3JFYWNoKChlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gZW50aXR5Q2FjaGVbZW50aXR5TmFtZV07XG4gICAgICBpZiAoY29sbGVjdGlvbi5sb2FkaW5nKSB7XG4gICAgICAgIGlmICghaXNNdXRhdGVkKSB7XG4gICAgICAgICAgZW50aXR5Q2FjaGUgPSB7IC4uLmVudGl0eUNhY2hlIH07XG4gICAgICAgICAgaXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXSA9IHsgLi4uY29sbGVjdGlvbiwgbG9hZGluZzogZmFsc2UgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG4iXX0=