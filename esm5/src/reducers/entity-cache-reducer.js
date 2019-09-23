import * as tslib_1 from "tslib";
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
    EntityCacheReducerFactory.prototype.create = function () {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);
        function entityCacheReducer(entityCache, action) {
            if (entityCache === void 0) { entityCache = {}; }
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
            var payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, action);
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
    EntityCacheReducerFactory.prototype.clearCollectionsReducer = function (entityCache, action) {
        var _this = this;
        // tslint:disable-next-line:prefer-const
        var _a = action.payload, collections = _a.collections, tag = _a.tag;
        var entityOp = EntityOp.REMOVE_ALL;
        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }
        entityCache = collections.reduce(function (newCache, entityName) {
            var payload = { entityName: entityName, entityOp: entityOp };
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            newCache = _this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    };
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
     */
    EntityCacheReducerFactory.prototype.loadCollectionsReducer = function (entityCache, action) {
        var _this = this;
        var _a = action.payload, collections = _a.collections, tag = _a.tag;
        var entityOp = EntityOp.ADD_ALL;
        var entityNames = Object.keys(collections);
        entityCache = entityNames.reduce(function (newCache, entityName) {
            var payload = {
                entityName: entityName,
                entityOp: entityOp,
                data: collections[entityName],
            };
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            newCache = _this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    };
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a MergeQuerySet action with the query set and a MergeStrategy
     */
    EntityCacheReducerFactory.prototype.mergeQuerySetReducer = function (entityCache, action) {
        var _this = this;
        // tslint:disable-next-line:prefer-const
        var _a = action.payload, mergeStrategy = _a.mergeStrategy, querySet = _a.querySet, tag = _a.tag;
        mergeStrategy =
            mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
        var entityOp = EntityOp.UPSERT_MANY;
        var entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce(function (newCache, entityName) {
            var payload = {
                entityName: entityName,
                entityOp: entityOp,
                data: querySet[entityName],
                mergeStrategy: mergeStrategy,
            };
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            newCache = _this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    };
    // #region saveEntities reducers
    EntityCacheReducerFactory.prototype.saveEntitiesReducer = function (entityCache, action) {
        var _this = this;
        var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
        try {
            changeSet.changes.forEach(function (item) {
                var entityName = item.entityName;
                var payload = {
                    entityName: entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId: correlationId,
                    isOptimistic: isOptimistic,
                    mergeStrategy: mergeStrategy,
                    tag: tag,
                };
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                entityCache = _this.applyCollectionReducer(entityCache, act);
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
    };
    EntityCacheReducerFactory.prototype.saveEntitiesCancelReducer = function (entityCache, action) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
    };
    EntityCacheReducerFactory.prototype.saveEntitiesErrorReducer = function (entityCache, action) {
        var originalAction = action.payload.originalAction;
        var originalChangeSet = originalAction.payload.changeSet;
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        var entityNames = originalChangeSet.changes.map(function (item) { return item.entityName; });
        return this.clearLoadingFlags(entityCache, entityNames);
    };
    EntityCacheReducerFactory.prototype.saveEntitiesSuccessReducer = function (entityCache, action) {
        var _this = this;
        var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
        changeSet.changes.forEach(function (item) {
            var entityName = item.entityName;
            var payload = {
                entityName: entityName,
                entityOp: getEntityOp(item),
                data: item.entities,
                correlationId: correlationId,
                isOptimistic: isOptimistic,
                mergeStrategy: mergeStrategy,
                tag: tag,
            };
            var act = {
                type: "[" + entityName + "] " + action.type,
                payload: payload,
            };
            entityCache = _this.applyCollectionReducer(entityCache, act);
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
    };
    // #endregion saveEntities reducers
    // #region helpers
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    EntityCacheReducerFactory.prototype.applyCollectionReducer = function (cache, action) {
        var _a;
        if (cache === void 0) { cache = {}; }
        var entityName = action.payload.entityName;
        var collection = cache[entityName];
        var reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
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
        return action.payload.error || collection === newCollection
            ? cache
            : tslib_1.__assign({}, cache, (_a = {}, _a[entityName] = newCollection, _a));
    };
    /** Ensure loading is false for every collection in entityNames */
    EntityCacheReducerFactory.prototype.clearLoadingFlags = function (entityCache, entityNames) {
        var isMutated = false;
        entityNames.forEach(function (entityName) {
            var collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = tslib_1.__assign({}, entityCache);
                    isMutated = true;
                }
                entityCache[entityName] = tslib_1.__assign({}, collection, { loading: false });
            }
        });
        return entityCache;
    };
    EntityCacheReducerFactory = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [EntityCollectionCreator,
            EntityCollectionReducerRegistry,
            Logger])
    ], EntityCacheReducerFactory);
    return EntityCacheReducerFactory;
}());
export { EntityCacheReducerFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDLE9BQU8sRUFDTCxpQkFBaUIsR0FRbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQ0wsa0JBQWtCLEdBRW5CLE1BQU0sb0NBQW9DLENBQUM7QUFHNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQ7O0dBRUc7QUFFSDtJQUNFLG1DQUNVLHVCQUFnRCxFQUNoRCwrQkFBZ0UsRUFDaEUsTUFBYztRQUZkLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsb0NBQStCLEdBQS9CLCtCQUErQixDQUFpQztRQUNoRSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3JCLENBQUM7SUFFSjs7O09BR0c7SUFDSCwwQ0FBTSxHQUFOO1FBQ0Usa0VBQWtFO1FBQ2xFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLFNBQVMsa0JBQWtCLENBRXpCLFdBQTZCLEVBQzdCLE1BQXVDO1lBRHZDLDRCQUFBLEVBQUEsZ0JBQTZCO1lBRzdCLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUss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S0FBSztZQUNQLENBQUMsc0JBQU0sS0FBSyxlQUFHLFVBQVUsSUFBRyxhQUFjLE1BQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0VBQWtFO0lBQzFELHFEQUFpQixHQUF6QixVQUEwQixXQUF3QixFQUFFLFdBQXFCO1FBQ3ZFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtZQUM1QixJQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNkLFdBQVcsd0JBQVEsV0FBVyxDQUFFLENBQUM7b0JBQ2pDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO2dCQUNELFdBQVcsQ0FBQyxVQUFVLENBQUMsd0JBQVEsVUFBVSxJQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUUsQ0FBQzthQUM3RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQXhWVSx5QkFBeUI7UUFEckMsVUFBVSxFQUFFO2lEQUd3Qix1QkFBdUI7WUFDZiwrQkFBK0I7WUFDeEQsTUFBTTtPQUpiLHlCQUF5QixDQTBWckM7SUFBRCxnQ0FBQztDQUFBLEFBMVZELElBMFZDO1NBMVZZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUmVkdWNlciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgQ2xlYXJDb2xsZWN0aW9ucyxcbiAgTG9hZENvbGxlY3Rpb25zLFxuICBNZXJnZVF1ZXJ5U2V0LFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5cbmltcG9ydCB7XG4gIENoYW5nZVNldE9wZXJhdGlvbixcbiAgQ2hhbmdlU2V0SXRlbSxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItcmVnaXN0cnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBFbnRpdHlDYWNoZVJlZHVjZXIgdmlhIGl0cyBjcmVhdGUoKSBtZXRob2RcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yOiBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlclxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgQG5ncngvZGF0YSBlbnRpdHkgY2FjaGUgcmVkdWNlciB3aGljaCBlaXRoZXIgcmVzcG9uZHMgdG8gZW50aXR5IGNhY2hlIGxldmVsIGFjdGlvbnNcbiAgICogb3IgKG1vcmUgY29tbW9ubHkpIGRlbGVnYXRlcyB0byBhbiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlciBiYXNlZCBvbiB0aGUgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZS5cbiAgICovXG4gIGNyZWF0ZSgpOiBBY3Rpb25SZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+IHtcbiAgICAvLyBUaGlzIHRlY2huaXF1ZSBlbnN1cmVzIGEgbmFtZWQgZnVuY3Rpb24gYXBwZWFycyBpbiB0aGUgZGVidWdnZXJcbiAgICByZXR1cm4gZW50aXR5Q2FjaGVSZWR1Y2VyLmJpbmQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiBlbnRpdHlDYWNoZVJlZHVjZXIoXG4gICAgICB0aGlzOiBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgICBhY3Rpb246IHsgdHlwZTogc3RyaW5nOyBwYXlsb2FkPzogYW55IH1cbiAgICApOiBFbnRpdHlDYWNoZSB7XG4gICAgICAvLyBFbnRpdHlDYWNoZSBhY3Rpb25zXG4gICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uQ0xFQVJfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIENsZWFyQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5MT0FEX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIExvYWRDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLk1FUkdFX1FVRVJZX1NFVDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLm1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTWVyZ2VRdWVyeVNldFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNSZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUw6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWxSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19FUlJPUjoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0Vycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19TVUNDRVNTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNTdWNjZXNzXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0VUX0VOVElUWV9DQUNIRToge1xuICAgICAgICAgIC8vIENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgRW50aXR5Q2FjaGUuIEJlIGNhcmVmdWwhXG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmNhY2hlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGVudGl0eSBjb2xsZWN0aW9uIHJlZHVjZXIgaWYgdGhpcyBpcyBhIHZhbGlkIEVudGl0eUFjdGlvbiBmb3IgYSBjb2xsZWN0aW9uXG4gICAgICBjb25zdCBwYXlsb2FkID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBpZiAocGF5bG9hZCAmJiBwYXlsb2FkLmVudGl0eU5hbWUgJiYgcGF5bG9hZC5lbnRpdHlPcCAmJiAhcGF5bG9hZC5lcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3Rpb24gYXMgRW50aXR5QWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90IGEgdmFsaWQgRW50aXR5QWN0aW9uXG4gICAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gY2xlYXIgbXVsdGlwbGUgY29sbGVjdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIENsZWFyQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgYW4gYXJyYXkgb2YgY29sbGVjdGlvbiBuYW1lcy5cbiAgICogSWYgZW1wdHkgYXJyYXksIGRvZXMgbm90aGluZy4gSWYgbm8gYXJyYXksIGNsZWFycyBhbGwgdGhlIGNvbGxlY3Rpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IENsZWFyQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1jb25zdFxuICAgIGxldCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuUkVNT1ZFX0FMTDtcblxuICAgIGlmICghY29sbGVjdGlvbnMpIHtcbiAgICAgIC8vIENvbGxlY3Rpb25zIGlzIG5vdCBkZWZpbmVkLiBDbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gICAgICBjb2xsZWN0aW9ucyA9IE9iamVjdC5rZXlzKGVudGl0eUNhY2hlKTtcbiAgICB9XG5cbiAgICBlbnRpdHlDYWNoZSA9IGNvbGxlY3Rpb25zLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7IGVudGl0eU5hbWUsIGVudGl0eU9wIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGxvYWQgY29sbGVjdGlvbiBpbiB0aGUgZm9ybSBvZiBhIGhhc2ggb2YgZW50aXR5IGRhdGEgZm9yIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgTG9hZENvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIHRoZSBRdWVyeVNldCBvZiBlbnRpdHkgY29sbGVjdGlvbnMgdG8gbG9hZFxuICAgKi9cbiAgcHJvdGVjdGVkIGxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTG9hZENvbGxlY3Rpb25zXG4gICkge1xuICAgIGNvbnN0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5BRERfQUxMO1xuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbnMpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IGNvbGxlY3Rpb25zW2VudGl0eU5hbWVdLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbWVyZ2UgcXVlcnkgc2V0cyBpbiB0aGUgZm9ybSBvZiBhIGhhc2ggb2YgZW50aXR5IGRhdGEgZm9yIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgTWVyZ2VRdWVyeVNldCBhY3Rpb24gd2l0aCB0aGUgcXVlcnkgc2V0IGFuZCBhIE1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHByb3RlY3RlZCBtZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBNZXJnZVF1ZXJ5U2V0XG4gICkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uc3RcbiAgICBsZXQgeyBtZXJnZVN0cmF0ZWd5LCBxdWVyeVNldCwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IG51bGwgPyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5VUFNFUlRfTUFOWTtcblxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMocXVlcnlTZXQpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IHF1ZXJ5U2V0W2VudGl0eU5hbWVdLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoYW5nZVNldCxcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICBpc09wdGltaXN0aWMsXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgdGFnLFxuICAgIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIHRyeSB7XG4gICAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgICB0YWcsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfTtcbiAgICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgICAgIGlmIChhY3QucGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgIHRocm93IGFjdC5wYXlsb2FkLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNDYW5jZWxcbiAgKSB7XG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhcbiAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZXMgfHwgW11cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNFcnJvclxuICApIHtcbiAgICBjb25zdCBvcmlnaW5hbEFjdGlvbiA9IGFjdGlvbi5wYXlsb2FkLm9yaWdpbmFsQWN0aW9uO1xuICAgIGNvbnN0IG9yaWdpbmFsQ2hhbmdlU2V0ID0gb3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gb3JpZ2luYWxDaGFuZ2VTZXQuY2hhbmdlcy5tYXAoaXRlbSA9PiBpdGVtLmVudGl0eU5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlLCBlbnRpdHlOYW1lcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzU3VjY2Vzc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICB0YWcsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgZW50aXR5Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9TVUNDRVNTO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuXG4gIC8vICNyZWdpb24gaGVscGVyc1xuICAvKiogQXBwbHkgcmVkdWNlciBmb3IgdGhlIGFjdGlvbidzIEVudGl0eUNvbGxlY3Rpb24gKGlmIHRoZSBhY3Rpb24gdGFyZ2V0cyBhIGNvbGxlY3Rpb24pICovXG4gIHByaXZhdGUgYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihcbiAgICBjYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApIHtcbiAgICBjb25zdCBlbnRpdHlOYW1lID0gYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZTtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY2FjaGVbZW50aXR5TmFtZV07XG4gICAgY29uc3QgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeS5nZXRPckNyZWF0ZVJlZHVjZXIoXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcblxuICAgIGxldCBuZXdDb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uO1xuICAgIHRyeSB7XG4gICAgICBuZXdDb2xsZWN0aW9uID0gY29sbGVjdGlvblxuICAgICAgICA/IHJlZHVjZXIoY29sbGVjdGlvbiwgYWN0aW9uKVxuICAgICAgICA6IHJlZHVjZXIodGhpcy5lbnRpdHlDb2xsZWN0aW9uQ3JlYXRvci5jcmVhdGUoZW50aXR5TmFtZSksIGFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmVycm9yIHx8IGNvbGxlY3Rpb24gPT09IG5ld0NvbGxlY3Rpb24hXG4gICAgICA/IGNhY2hlXG4gICAgICA6IHsgLi4uY2FjaGUsIFtlbnRpdHlOYW1lXTogbmV3Q29sbGVjdGlvbiEgfTtcbiAgfVxuXG4gIC8qKiBFbnN1cmUgbG9hZGluZyBpcyBmYWxzZSBmb3IgZXZlcnkgY29sbGVjdGlvbiBpbiBlbnRpdHlOYW1lcyAqL1xuICBwcml2YXRlIGNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSwgZW50aXR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgbGV0IGlzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGVudGl0eU5hbWVzLmZvckVhY2goZW50aXR5TmFtZSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gZW50aXR5Q2FjaGVbZW50aXR5TmFtZV07XG4gICAgICBpZiAoY29sbGVjdGlvbi5sb2FkaW5nKSB7XG4gICAgICAgIGlmICghaXNNdXRhdGVkKSB7XG4gICAgICAgICAgZW50aXR5Q2FjaGUgPSB7IC4uLmVudGl0eUNhY2hlIH07XG4gICAgICAgICAgaXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXSA9IHsgLi4uY29sbGVjdGlvbiwgbG9hZGluZzogZmFsc2UgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG4iXX0=