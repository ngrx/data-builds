import { __assign, __decorate, __metadata } from "tslib";
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
            : __assign(__assign({}, cache), (_a = {}, _a[entityName] = newCollection, _a));
    };
    /** Ensure loading is false for every collection in entityNames */
    EntityCacheReducerFactory.prototype.clearLoadingFlags = function (entityCache, entityNames) {
        var isMutated = false;
        entityNames.forEach(function (entityName) {
            var collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = __assign({}, entityCache);
                    isMutated = true;
                }
                entityCache[entityName] = __assign(__assign({}, collection), { loading: false });
            }
        });
        return entityCache;
    };
    EntityCacheReducerFactory = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [EntityCollectionCreator,
            EntityCollectionReducerRegistry,
            Logger])
    ], EntityCacheReducerFactory);
    return EntityCacheReducerFactory;
}());
export { EntityCacheReducerFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDLE9BQU8sRUFDTCxpQkFBaUIsR0FRbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQ0wsa0JBQWtCLEdBRW5CLE1BQU0sb0NBQW9DLENBQUM7QUFHNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFMUQ7O0dBRUc7QUFFSDtJQUNFLG1DQUNVLHVCQUFnRCxFQUNoRCwrQkFBZ0UsRUFDaEUsTUFBYztRQUZkLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsb0NBQStCLEdBQS9CLCtCQUErQixDQUFpQztRQUNoRSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3JCLENBQUM7SUFFSjs7O09BR0c7SUFDSCwwQ0FBTSxHQUFOO1FBQ0Usa0VBQWtFO1FBQ2xFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLFNBQVMsa0JBQWtCLENBRXpCLFdBQTZCLEVBQzdCLE1BQXVDO1lBRHZDLDRCQUFBLEVBQUEsZ0JBQTZCO1lBRzdCLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUss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S0FBSztZQUNQLENBQUMsdUJBQU0sS0FBSyxnQkFBRyxVQUFVLElBQUcsYUFBYyxNQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELGtFQUFrRTtJQUMxRCxxREFBaUIsR0FBekIsVUFBMEIsV0FBd0IsRUFBRSxXQUFxQjtRQUN2RSxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7WUFDNUIsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDZCxXQUFXLGdCQUFRLFdBQVcsQ0FBRSxDQUFDO29CQUNqQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtnQkFDRCxXQUFXLENBQUMsVUFBVSxDQUFDLHlCQUFRLFVBQVUsS0FBRSxPQUFPLEVBQUUsS0FBSyxHQUFFLENBQUM7YUFDN0Q7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUF4VlUseUJBQXlCO1FBRHJDLFVBQVUsRUFBRTt5Q0FHd0IsdUJBQXVCO1lBQ2YsK0JBQStCO1lBQ3hELE1BQU07T0FKYix5QkFBeUIsQ0EwVnJDO0lBQUQsZ0NBQUM7Q0FBQSxBQTFWRCxJQTBWQztTQTFWWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vZW50aXR5LWNhY2hlJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIENsZWFyQ29sbGVjdGlvbnMsXG4gIExvYWRDb2xsZWN0aW9ucyxcbiAgTWVyZ2VRdWVyeVNldCxcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldEl0ZW0sXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgRW50aXR5Q2FjaGVSZWR1Y2VyIHZpYSBpdHMgY3JlYXRlKCkgbWV0aG9kXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcjogRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIEBuZ3J4L2RhdGEgZW50aXR5IGNhY2hlIHJlZHVjZXIgd2hpY2ggZWl0aGVyIHJlc3BvbmRzIHRvIGVudGl0eSBjYWNoZSBsZXZlbCBhY3Rpb25zXG4gICAqIG9yIChtb3JlIGNvbW1vbmx5KSBkZWxlZ2F0ZXMgdG8gYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgYmFzZWQgb24gdGhlIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUuXG4gICAqL1xuICBjcmVhdGUoKTogQWN0aW9uUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPiB7XG4gICAgLy8gVGhpcyB0ZWNobmlxdWUgZW5zdXJlcyBhIG5hbWVkIGZ1bmN0aW9uIGFwcGVhcnMgaW4gdGhlIGRlYnVnZ2VyXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlUmVkdWNlci5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gZW50aXR5Q2FjaGVSZWR1Y2VyKFxuICAgICAgdGhpczogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgICAgYWN0aW9uOiB7IHR5cGU6IHN0cmluZzsgcGF5bG9hZD86IGFueSB9XG4gICAgKTogRW50aXR5Q2FjaGUge1xuICAgICAgLy8gRW50aXR5Q2FjaGUgYWN0aW9uc1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkNMRUFSX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBDbGVhckNvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTE9BRF9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBMb2FkQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIE1lcmdlUXVlcnlTZXRcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIFNhdmVFbnRpdGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0NhbmNlbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNFcnJvclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNFVF9FTlRJVFlfQ0FDSEU6IHtcbiAgICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIEVudGl0eUNhY2hlLiBCZSBjYXJlZnVsIVxuICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5jYWNoZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBlbnRpdHkgY29sbGVjdGlvbiByZWR1Y2VyIGlmIHRoaXMgaXMgYSB2YWxpZCBFbnRpdHlBY3Rpb24gZm9yIGEgY29sbGVjdGlvblxuICAgICAgY29uc3QgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgaWYgKHBheWxvYWQgJiYgcGF5bG9hZC5lbnRpdHlOYW1lICYmIHBheWxvYWQuZW50aXR5T3AgJiYgIXBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIEVudGl0eUFjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCBhIHZhbGlkIEVudGl0eUFjdGlvblxuICAgICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGNsZWFyIG11bHRpcGxlIGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBDbGVhckNvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIGFuIGFycmF5IG9mIGNvbGxlY3Rpb24gbmFtZXMuXG4gICAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhcnMgYWxsIHRoZSBjb2xsZWN0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBjbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBDbGVhckNvbGxlY3Rpb25zXG4gICkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uc3RcbiAgICBsZXQgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlJFTU9WRV9BTEw7XG5cbiAgICBpZiAoIWNvbGxlY3Rpb25zKSB7XG4gICAgICAvLyBDb2xsZWN0aW9ucyBpcyBub3QgZGVmaW5lZC4gQ2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgICAgY29sbGVjdGlvbnMgPSBPYmplY3Qua2V5cyhlbnRpdHlDYWNoZSk7XG4gICAgfVxuXG4gICAgZW50aXR5Q2FjaGUgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0geyBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBsb2FkIGNvbGxlY3Rpb24gaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIExvYWRDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyB0aGUgUXVlcnlTZXQgb2YgZW50aXR5IGNvbGxlY3Rpb25zIHRvIGxvYWRcbiAgICovXG4gIHByb3RlY3RlZCBsb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IExvYWRDb2xsZWN0aW9uc1xuICApIHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuQUREX0FMTDtcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb25zKTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBjb2xsZWN0aW9uc1tlbnRpdHlOYW1lXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIG1lcmdlIHF1ZXJ5IHNldHMgaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIE1lcmdlUXVlcnlTZXQgYWN0aW9uIHdpdGggdGhlIHF1ZXJ5IHNldCBhbmQgYSBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcm90ZWN0ZWQgbWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTWVyZ2VRdWVyeVNldFxuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgbWVyZ2VTdHJhdGVneSwgcXVlcnlTZXQsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBudWxsID8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuVVBTRVJUX01BTlk7XG5cbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKHF1ZXJ5U2V0KTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBxdWVyeVNldFtlbnRpdHlOYW1lXSxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8vICNyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICB0cnkge1xuICAgICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgICAgdGFnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH07XG4gICAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgICAgICBpZiAoYWN0LnBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBhY3QucGF5bG9hZC5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTlk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICkge1xuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoXG4gICAgICBlbnRpdHlDYWNoZSxcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVzIHx8IFtdXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzRXJyb3JcbiAgKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxBY3Rpb24gPSBhY3Rpb24ucGF5bG9hZC5vcmlnaW5hbEFjdGlvbjtcbiAgICBjb25zdCBvcmlnaW5hbENoYW5nZVNldCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IG9yaWdpbmFsQ2hhbmdlU2V0LmNoYW5nZXMubWFwKGl0ZW0gPT4gaXRlbS5lbnRpdHlOYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZSwgZW50aXR5TmFtZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hhbmdlU2V0LFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgdGFnLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTUztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIEFwcGx5IHJlZHVjZXIgZm9yIHRoZSBhY3Rpb24ncyBFbnRpdHlDb2xsZWN0aW9uIChpZiB0aGUgYWN0aW9uIHRhcmdldHMgYSBjb2xsZWN0aW9uKSAqL1xuICBwcml2YXRlIGFwcGx5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgY2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNhY2hlW2VudGl0eU5hbWVdO1xuICAgIGNvbnN0IHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkuZ2V0T3JDcmVhdGVSZWR1Y2VyKFxuICAgICAgZW50aXR5TmFtZVxuICAgICk7XG5cbiAgICBsZXQgbmV3Q29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjtcbiAgICB0cnkge1xuICAgICAgbmV3Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cbiAgICAgICAgPyByZWR1Y2VyKGNvbGxlY3Rpb24sIGFjdGlvbilcbiAgICAgICAgOiByZWR1Y2VyKHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IuY3JlYXRlKGVudGl0eU5hbWUpLCBhY3Rpb24pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5lcnJvciB8fCBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uIVxuICAgICAgPyBjYWNoZVxuICAgICAgOiB7IC4uLmNhY2hlLCBbZW50aXR5TmFtZV06IG5ld0NvbGxlY3Rpb24hIH07XG4gIH1cblxuICAvKiogRW5zdXJlIGxvYWRpbmcgaXMgZmFsc2UgZm9yIGV2ZXJ5IGNvbGxlY3Rpb24gaW4gZW50aXR5TmFtZXMgKi9cbiAgcHJpdmF0ZSBjbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzOiBzdHJpbmdbXSkge1xuICAgIGxldCBpc011dGF0ZWQgPSBmYWxzZTtcbiAgICBlbnRpdHlOYW1lcy5mb3JFYWNoKGVudGl0eU5hbWUgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGVudGl0eUNhY2hlW2VudGl0eU5hbWVdO1xuICAgICAgaWYgKGNvbGxlY3Rpb24ubG9hZGluZykge1xuICAgICAgICBpZiAoIWlzTXV0YXRlZCkge1xuICAgICAgICAgIGVudGl0eUNhY2hlID0geyAuLi5lbnRpdHlDYWNoZSB9O1xuICAgICAgICAgIGlzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5Q2FjaGVbZW50aXR5TmFtZV0gPSB7IC4uLmNvbGxlY3Rpb24sIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19