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
     * Create the ngrx-data entity cache reducer which either responds to entity cache level actions
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTzNDLE9BQU8sRUFDTCxpQkFBaUIsR0FRbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQ0wsa0JBQWtCLEdBRW5CLE1BQU0sb0NBQW9DLENBQUM7QUFHNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQ7O0dBRUc7QUFFSDtJQUNFLG1DQUNVLHVCQUFnRCxFQUNoRCwrQkFBZ0UsRUFDaEUsTUFBYztRQUZkLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsb0NBQStCLEdBQS9CLCtCQUErQixDQUFpQztRQUNoRSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3JCLENBQUM7SUFFSjs7O09BR0c7SUFDSCwwQ0FBTSxHQUFOO1FBQ0Usa0VBQWtFO1FBQ2xFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLFNBQVMsa0JBQWtCLENBRXpCLFdBQTZCLEVBQzdCLE1BQXVDO1lBRHZDLDRCQUFBLEVBQUEsZ0JBQTZCO1lBRzdCLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUss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S0FBSztZQUNQLENBQUMsc0JBQU0sS0FBSyxlQUFHLFVBQVUsSUFBRyxhQUFjLE1BQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0VBQWtFO0lBQzFELHFEQUFpQixHQUF6QixVQUEwQixXQUF3QixFQUFFLFdBQXFCO1FBQ3ZFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtZQUM1QixJQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNkLFdBQVcsd0JBQVEsV0FBVyxDQUFFLENBQUM7b0JBQ2pDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO2dCQUNELFdBQVcsQ0FBQyxVQUFVLENBQUMsd0JBQVEsVUFBVSxJQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUUsQ0FBQzthQUM3RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQXhWVSx5QkFBeUI7UUFEckMsVUFBVSxFQUFFO2lEQUd3Qix1QkFBdUI7WUFDZiwrQkFBK0I7WUFDeEQsTUFBTTtPQUpiLHlCQUF5QixDQTBWckM7SUFBRCxnQ0FBQztDQUFBLEFBMVZELElBMFZDO1NBMVZZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUmVkdWNlciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9lbnRpdHktY2FjaGUnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgQ2xlYXJDb2xsZWN0aW9ucyxcbiAgTG9hZENvbGxlY3Rpb25zLFxuICBNZXJnZVF1ZXJ5U2V0LFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5cbmltcG9ydCB7XG4gIENoYW5nZVNldE9wZXJhdGlvbixcbiAgQ2hhbmdlU2V0SXRlbSxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItcmVnaXN0cnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBFbnRpdHlDYWNoZVJlZHVjZXIgdmlhIGl0cyBjcmVhdGUoKSBtZXRob2RcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yOiBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlclxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgbmdyeC1kYXRhIGVudGl0eSBjYWNoZSByZWR1Y2VyIHdoaWNoIGVpdGhlciByZXNwb25kcyB0byBlbnRpdHkgY2FjaGUgbGV2ZWwgYWN0aW9uc1xuICAgKiBvciAobW9yZSBjb21tb25seSkgZGVsZWdhdGVzIHRvIGFuIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyIGJhc2VkIG9uIHRoZSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lLlxuICAgKi9cbiAgY3JlYXRlKCk6IEFjdGlvblJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4ge1xuICAgIC8vIFRoaXMgdGVjaG5pcXVlIGVuc3VyZXMgYSBuYW1lZCBmdW5jdGlvbiBhcHBlYXJzIGluIHRoZSBkZWJ1Z2dlclxuICAgIHJldHVybiBlbnRpdHlDYWNoZVJlZHVjZXIuYmluZCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIGVudGl0eUNhY2hlUmVkdWNlcihcbiAgICAgIHRoaXM6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICAgIGFjdGlvbjogeyB0eXBlOiBzdHJpbmc7IHBheWxvYWQ/OiBhbnkgfVxuICAgICk6IEVudGl0eUNhY2hlIHtcbiAgICAgIC8vIEVudGl0eUNhY2hlIGFjdGlvbnNcbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgQ2xlYXJDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTG9hZENvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTUVSR0VfUVVFUllfU0VUOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBNZXJnZVF1ZXJ5U2V0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1JlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBTYXZlRW50aXRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNDYW5jZWxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0VSUk9SOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzRXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1M6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFOiB7XG4gICAgICAgICAgLy8gQ29tcGxldGVseSByZXBsYWNlIHRoZSBFbnRpdHlDYWNoZS4gQmUgY2FyZWZ1bCFcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuY2FjaGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgZW50aXR5IGNvbGxlY3Rpb24gcmVkdWNlciBpZiB0aGlzIGlzIGEgdmFsaWQgRW50aXR5QWN0aW9uIGZvciBhIGNvbGxlY3Rpb25cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQuZW50aXR5TmFtZSAmJiBwYXlsb2FkLmVudGl0eU9wICYmICFwYXlsb2FkLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBFbnRpdHlBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3QgYSB2YWxpZCBFbnRpdHlBY3Rpb25cbiAgICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBjbGVhciBtdWx0aXBsZSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgQ2xlYXJDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyBhbiBhcnJheSBvZiBjb2xsZWN0aW9uIG5hbWVzLlxuICAgKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBubyBhcnJheSwgY2xlYXJzIGFsbCB0aGUgY29sbGVjdGlvbnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogQ2xlYXJDb2xsZWN0aW9uc1xuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5SRU1PVkVfQUxMO1xuXG4gICAgaWYgKCFjb2xsZWN0aW9ucykge1xuICAgICAgLy8gQ29sbGVjdGlvbnMgaXMgbm90IGRlZmluZWQuIENsZWFyIGFsbCBjb2xsZWN0aW9ucy5cbiAgICAgIGNvbGxlY3Rpb25zID0gT2JqZWN0LmtleXMoZW50aXR5Q2FjaGUpO1xuICAgIH1cblxuICAgIGVudGl0eUNhY2hlID0gY29sbGVjdGlvbnMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHsgZW50aXR5TmFtZSwgZW50aXR5T3AgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbG9hZCBjb2xsZWN0aW9uIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBMb2FkQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgdGhlIFF1ZXJ5U2V0IG9mIGVudGl0eSBjb2xsZWN0aW9ucyB0byBsb2FkXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBMb2FkQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLkFERF9BTEw7XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9ucyk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogY29sbGVjdGlvbnNbZW50aXR5TmFtZV0sXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBtZXJnZSBxdWVyeSBzZXRzIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBNZXJnZVF1ZXJ5U2V0IGFjdGlvbiB3aXRoIHRoZSBxdWVyeSBzZXQgYW5kIGEgTWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcHJvdGVjdGVkIG1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IE1lcmdlUXVlcnlTZXRcbiAgKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1jb25zdFxuICAgIGxldCB7IG1lcmdlU3RyYXRlZ3ksIHF1ZXJ5U2V0LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlVQU0VSVF9NQU5ZO1xuXG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhxdWVyeVNldCk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogcXVlcnlTZXRbZW50aXR5TmFtZV0sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvLyAjcmVnaW9uIHNhdmVFbnRpdGllcyByZWR1Y2Vyc1xuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNcbiAgKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hhbmdlU2V0LFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNoYW5nZVNldC5jaGFuZ2VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgICAgZGF0YTogaXRlbS5lbnRpdGllcyxcbiAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICAgIHRhZyxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgICBwYXlsb2FkLFxuICAgICAgICB9O1xuICAgICAgICBlbnRpdHlDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0KTtcbiAgICAgICAgaWYgKGFjdC5wYXlsb2FkLmVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgYWN0LnBheWxvYWQuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICBmdW5jdGlvbiBnZXRFbnRpdHlPcChpdGVtOiBDaGFuZ2VTZXRJdGVtKSB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ub3ApIHtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0FERF9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5EZWxldGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfREVMRVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0OlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNDYW5jZWxSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc0NhbmNlbFxuICApIHtcbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIHJldHVybiB0aGlzLmNsZWFyTG9hZGluZ0ZsYWdzKFxuICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lcyB8fCBbXVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc0Vycm9yXG4gICkge1xuICAgIGNvbnN0IG9yaWdpbmFsQWN0aW9uID0gYWN0aW9uLnBheWxvYWQub3JpZ2luYWxBY3Rpb247XG4gICAgY29uc3Qgb3JpZ2luYWxDaGFuZ2VTZXQgPSBvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldDtcblxuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBvcmlnaW5hbENoYW5nZVNldC5jaGFuZ2VzLm1hcChpdGVtID0+IGl0ZW0uZW50aXR5TmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoZW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNTdWNjZXNzXG4gICkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoYW5nZVNldCxcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICBpc09wdGltaXN0aWMsXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgdGFnLFxuICAgIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGNoYW5nZVNldC5jaGFuZ2VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgIHRhZyxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBlbnRpdHlDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICBmdW5jdGlvbiBnZXRFbnRpdHlPcChpdGVtOiBDaGFuZ2VTZXRJdGVtKSB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ub3ApIHtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0OlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX1NVQ0NFU1M7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIC8qKiBBcHBseSByZWR1Y2VyIGZvciB0aGUgYWN0aW9uJ3MgRW50aXR5Q29sbGVjdGlvbiAoaWYgdGhlIGFjdGlvbiB0YXJnZXRzIGEgY29sbGVjdGlvbikgKi9cbiAgcHJpdmF0ZSBhcHBseUNvbGxlY3Rpb25SZWR1Y2VyKFxuICAgIGNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICkge1xuICAgIGNvbnN0IGVudGl0eU5hbWUgPSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjYWNoZVtlbnRpdHlOYW1lXTtcbiAgICBjb25zdCByZWR1Y2VyID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LmdldE9yQ3JlYXRlUmVkdWNlcihcbiAgICAgIGVudGl0eU5hbWVcbiAgICApO1xuXG4gICAgbGV0IG5ld0NvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb247XG4gICAgdHJ5IHtcbiAgICAgIG5ld0NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uXG4gICAgICAgID8gcmVkdWNlcihjb2xsZWN0aW9uLCBhY3Rpb24pXG4gICAgICAgIDogcmVkdWNlcih0aGlzLmVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLmNyZWF0ZShlbnRpdHlOYW1lKSwgYWN0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuZXJyb3IgfHwgY29sbGVjdGlvbiA9PT0gbmV3Q29sbGVjdGlvbiFcbiAgICAgID8gY2FjaGVcbiAgICAgIDogeyAuLi5jYWNoZSwgW2VudGl0eU5hbWVdOiBuZXdDb2xsZWN0aW9uISB9O1xuICB9XG5cbiAgLyoqIEVuc3VyZSBsb2FkaW5nIGlzIGZhbHNlIGZvciBldmVyeSBjb2xsZWN0aW9uIGluIGVudGl0eU5hbWVzICovXG4gIHByaXZhdGUgY2xlYXJMb2FkaW5nRmxhZ3MoZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLCBlbnRpdHlOYW1lczogc3RyaW5nW10pIHtcbiAgICBsZXQgaXNNdXRhdGVkID0gZmFsc2U7XG4gICAgZW50aXR5TmFtZXMuZm9yRWFjaChlbnRpdHlOYW1lID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXTtcbiAgICAgIGlmIChjb2xsZWN0aW9uLmxvYWRpbmcpIHtcbiAgICAgICAgaWYgKCFpc011dGF0ZWQpIHtcbiAgICAgICAgICBlbnRpdHlDYWNoZSA9IHsgLi4uZW50aXR5Q2FjaGUgfTtcbiAgICAgICAgICBpc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVudGl0eUNhY2hlW2VudGl0eU5hbWVdID0geyAuLi5jb2xsZWN0aW9uLCBsb2FkaW5nOiBmYWxzZSB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cbiJdfQ==