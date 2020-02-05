(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/entity-cache-reducer", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/actions/entity-cache-action", "@ngrx/data/src/actions/entity-cache-change-set", "@ngrx/data/src/reducers/entity-collection-creator", "@ngrx/data/src/reducers/entity-collection-reducer-registry", "@ngrx/data/src/actions/entity-op", "@ngrx/data/src/utils/interfaces", "@ngrx/data/src/actions/merge-strategy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const entity_cache_action_1 = require("@ngrx/data/src/actions/entity-cache-action");
    const entity_cache_change_set_1 = require("@ngrx/data/src/actions/entity-cache-change-set");
    const entity_collection_creator_1 = require("@ngrx/data/src/reducers/entity-collection-creator");
    const entity_collection_reducer_registry_1 = require("@ngrx/data/src/reducers/entity-collection-reducer-registry");
    const entity_op_1 = require("@ngrx/data/src/actions/entity-op");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
    const merge_strategy_1 = require("@ngrx/data/src/actions/merge-strategy");
    /**
     * Creates the EntityCacheReducer via its create() method
     */
    let EntityCacheReducerFactory = class EntityCacheReducerFactory {
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
                    case entity_cache_action_1.EntityCacheAction.CLEAR_COLLECTIONS: {
                        return this.clearCollectionsReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.LOAD_COLLECTIONS: {
                        return this.loadCollectionsReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.MERGE_QUERY_SET: {
                        return this.mergeQuerySetReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.SAVE_ENTITIES: {
                        return this.saveEntitiesReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                        return this.saveEntitiesCancelReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.SAVE_ENTITIES_ERROR: {
                        return this.saveEntitiesErrorReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                        return this.saveEntitiesSuccessReducer(entityCache, action);
                    }
                    case entity_cache_action_1.EntityCacheAction.SET_ENTITY_CACHE: {
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
            const entityOp = entity_op_1.EntityOp.REMOVE_ALL;
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
            const entityOp = entity_op_1.EntityOp.ADD_ALL;
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
                mergeStrategy === null ? merge_strategy_1.MergeStrategy.PreserveChanges : mergeStrategy;
            const entityOp = entity_op_1.EntityOp.UPSERT_MANY;
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
                changeSet.changes.forEach(item => {
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
                    case entity_cache_change_set_1.ChangeSetOperation.Add:
                        return entity_op_1.EntityOp.SAVE_ADD_MANY;
                    case entity_cache_change_set_1.ChangeSetOperation.Delete:
                        return entity_op_1.EntityOp.SAVE_DELETE_MANY;
                    case entity_cache_change_set_1.ChangeSetOperation.Update:
                        return entity_op_1.EntityOp.SAVE_UPDATE_MANY;
                    case entity_cache_change_set_1.ChangeSetOperation.Upsert:
                        return entity_op_1.EntityOp.SAVE_UPSERT_MANY;
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
            const entityNames = originalChangeSet.changes.map(item => item.entityName);
            return this.clearLoadingFlags(entityCache, entityNames);
        }
        saveEntitiesSuccessReducer(entityCache, action) {
            const { changeSet, correlationId, isOptimistic, mergeStrategy, tag, } = action.payload;
            changeSet.changes.forEach(item => {
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
                    case entity_cache_change_set_1.ChangeSetOperation.Add:
                        return entity_op_1.EntityOp.SAVE_ADD_MANY_SUCCESS;
                    case entity_cache_change_set_1.ChangeSetOperation.Delete:
                        return entity_op_1.EntityOp.SAVE_DELETE_MANY_SUCCESS;
                    case entity_cache_change_set_1.ChangeSetOperation.Update:
                        return entity_op_1.EntityOp.SAVE_UPDATE_MANY_SUCCESS;
                    case entity_cache_change_set_1.ChangeSetOperation.Upsert:
                        return entity_op_1.EntityOp.SAVE_UPSERT_MANY_SUCCESS;
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
            entityNames.forEach(entityName => {
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
    };
    EntityCacheReducerFactory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [entity_collection_creator_1.EntityCollectionCreator,
            entity_collection_reducer_registry_1.EntityCollectionReducerRegistry,
            interfaces_1.Logger])
    ], EntityCacheReducerFactory);
    exports.EntityCacheReducerFactory = EntityCacheReducerFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLHdDQUEyQztJQU0zQyxvRkFTd0M7SUFFeEMsNEZBRzRDO0lBRzVDLGlHQUFzRTtJQUN0RSxtSEFBdUY7SUFDdkYsZ0VBQWdEO0lBQ2hELGdFQUE2QztJQUM3QywwRUFBMEQ7SUFFMUQ7O09BRUc7SUFFSCxJQUFhLHlCQUF5QixHQUF0QyxNQUFhLHlCQUF5QjtRQUNwQyxZQUNVLHVCQUFnRCxFQUNoRCwrQkFBZ0UsRUFDaEUsTUFBYztZQUZkLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7WUFDaEQsb0NBQStCLEdBQS9CLCtCQUErQixDQUFpQztZQUNoRSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3JCLENBQUM7UUFFSjs7O1dBR0c7UUFDSCxNQUFNO1lBQ0osa0VBQWtFO1lBQ2xFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJDLFNBQVMsa0JBQWtCLENBRXpCLGNBQTJCLEVBQUUsRUFDN0IsTUFBdUM7Z0JBRXZDLHNCQUFzQjtnQkFDdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUNuQixLQUFLLHVDQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUM7d0JBQ3hDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUNqQyxXQUFXLEVBQ1gsTUFBMEIsQ0FDM0IsQ0FBQztxQkFDSDtvQkFFRCxLQUFLLHVDQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBQ3ZDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUNoQyxXQUFXLEVBQ1gsTUFBeUIsQ0FDMUIsQ0FBQztxQkFDSDtvQkFFRCxLQUFLLHVDQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUN0QyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FDOUIsV0FBVyxFQUNYLE1BQXVCLENBQ3hCLENBQUM7cUJBQ0g7b0JBRUQsS0FBSyx1Q0FBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEMsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLE1BQXNCLENBQUMsQ0FBQztxQkFDdEU7b0JBRUQsS0FBSyx1Q0FBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO3dCQUMzQyxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FDbkMsV0FBVyxFQUNYLE1BQTRCLENBQzdCLENBQUM7cUJBQ0g7b0JBRUQsS0FBSyx1Q0FBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUMxQyxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FDbEMsV0FBVyxFQUNYLE1BQTJCLENBQzVCLENBQUM7cUJBQ0g7b0JBRUQsS0FBSyx1Q0FBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3dCQUM1QyxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FDcEMsV0FBVyxFQUNYLE1BQTZCLENBQzlCLENBQUM7cUJBQ0g7b0JBRUQsS0FBSyx1Q0FBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUN2QyxrREFBa0Q7d0JBQ2xELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQzdCO2lCQUNGO2dCQUVELG1GQUFtRjtnQkFDbkYsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztnQkFDL0IsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtvQkFDdkUsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLE1BQXNCLENBQUMsQ0FBQztpQkFDekU7Z0JBRUQsMkJBQTJCO2dCQUMzQixPQUFPLFdBQVcsQ0FBQztZQUNyQixDQUFDO1FBQ0gsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ08sdUJBQXVCLENBQy9CLFdBQXdCLEVBQ3hCLE1BQXdCO1lBRXhCLHdDQUF3QztZQUN4QyxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDMUMsTUFBTSxRQUFRLEdBQUcsb0JBQVEsQ0FBQyxVQUFVLENBQUM7WUFFckMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDaEIscURBQXFEO2dCQUNyRCxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN4QztZQUVELFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxFQUFFO2dCQUN4RCxNQUFNLE9BQU8sR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQztnQkFDekMsTUFBTSxHQUFHLEdBQWlCO29CQUN4QixJQUFJLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtvQkFDdEMsT0FBTztpQkFDUixDQUFDO2dCQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxPQUFPLFFBQVEsQ0FBQztZQUNsQixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDaEIsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQztRQUVEOzs7O1dBSUc7UUFDTyxzQkFBc0IsQ0FDOUIsV0FBd0IsRUFDeEIsTUFBdUI7WUFFdkIsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQzVDLE1BQU0sUUFBUSxHQUFHLG9CQUFRLENBQUMsT0FBTyxDQUFDO1lBQ2xDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDN0MsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEVBQUU7Z0JBQ3hELE1BQU0sT0FBTyxHQUFHO29CQUNkLFVBQVU7b0JBQ1YsUUFBUTtvQkFDUixJQUFJLEVBQUUsV0FBVyxDQUFDLFVBQVUsQ0FBQztpQkFDOUIsQ0FBQztnQkFDRixNQUFNLEdBQUcsR0FBaUI7b0JBQ3hCLElBQUksRUFBRSxJQUFJLFVBQVUsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUN0QyxPQUFPO2lCQUNSLENBQUM7Z0JBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3RELE9BQU8sUUFBUSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoQixPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNPLG9CQUFvQixDQUM1QixXQUF3QixFQUN4QixNQUFxQjtZQUVyQix3Q0FBd0M7WUFDeEMsSUFBSSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUN0RCxhQUFhO2dCQUNYLGFBQWEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLDhCQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDekUsTUFBTSxRQUFRLEdBQUcsb0JBQVEsQ0FBQyxXQUFXLENBQUM7WUFFdEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRTtnQkFDeEQsTUFBTSxPQUFPLEdBQUc7b0JBQ2QsVUFBVTtvQkFDVixRQUFRO29CQUNSLElBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDO29CQUMxQixhQUFhO2lCQUNkLENBQUM7Z0JBQ0YsTUFBTSxHQUFHLEdBQWlCO29CQUN4QixJQUFJLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtvQkFDdEMsT0FBTztpQkFDUixDQUFDO2dCQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxPQUFPLFFBQVEsQ0FBQztZQUNsQixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDaEIsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQztRQUVELGdDQUFnQztRQUN0QixtQkFBbUIsQ0FDM0IsV0FBd0IsRUFDeEIsTUFBb0I7WUFFcEIsTUFBTSxFQUNKLFNBQVMsRUFDVCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGFBQWEsRUFDYixHQUFHLEdBQ0osR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBRW5CLElBQUk7Z0JBQ0YsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ25DLE1BQU0sT0FBTyxHQUFHO3dCQUNkLFVBQVU7d0JBQ1YsUUFBUSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUM7d0JBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTt3QkFDbkIsYUFBYTt3QkFDYixZQUFZO3dCQUNaLGFBQWE7d0JBQ2IsR0FBRztxQkFDSixDQUFDO29CQUVGLE1BQU0sR0FBRyxHQUFpQjt3QkFDeEIsSUFBSSxFQUFFLElBQUksVUFBVSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7d0JBQ3RDLE9BQU87cUJBQ1IsQ0FBQztvQkFDRixXQUFXLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUQsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDckIsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDekI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUM5QjtZQUVELE9BQU8sV0FBVyxDQUFDO1lBQ25CLFNBQVMsV0FBVyxDQUFDLElBQW1CO2dCQUN0QyxRQUFRLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQ2YsS0FBSyw0Q0FBa0IsQ0FBQyxHQUFHO3dCQUN6QixPQUFPLG9CQUFRLENBQUMsYUFBYSxDQUFDO29CQUNoQyxLQUFLLDRDQUFrQixDQUFDLE1BQU07d0JBQzVCLE9BQU8sb0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDbkMsS0FBSyw0Q0FBa0IsQ0FBQyxNQUFNO3dCQUM1QixPQUFPLG9CQUFRLENBQUMsZ0JBQWdCLENBQUM7b0JBQ25DLEtBQUssNENBQWtCLENBQUMsTUFBTTt3QkFDNUIsT0FBTyxvQkFBUSxDQUFDLGdCQUFnQixDQUFDO2lCQUNwQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRVMseUJBQXlCLENBQ2pDLFdBQXdCLEVBQ3hCLE1BQTBCO1lBRTFCLG1GQUFtRjtZQUNuRixnR0FBZ0c7WUFDaEcsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQzNCLFdBQVcsRUFDWCxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQ2pDLENBQUM7UUFDSixDQUFDO1FBRVMsd0JBQXdCLENBQ2hDLFdBQXdCLEVBQ3hCLE1BQXlCO1lBRXpCLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQ3JELE1BQU0saUJBQWlCLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFFM0QsbUZBQW1GO1lBQ25GLGdHQUFnRztZQUNoRyxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRVMsMEJBQTBCLENBQ2xDLFdBQXdCLEVBQ3hCLE1BQTJCO1lBRTNCLE1BQU0sRUFDSixTQUFTLEVBQ1QsYUFBYSxFQUNiLFlBQVksRUFDWixhQUFhLEVBQ2IsR0FBRyxHQUNKLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUVuQixTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDbkMsTUFBTSxPQUFPLEdBQUc7b0JBQ2QsVUFBVTtvQkFDVixRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQztvQkFDM0IsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUNuQixhQUFhO29CQUNiLFlBQVk7b0JBQ1osYUFBYTtvQkFDYixHQUFHO2lCQUNKLENBQUM7Z0JBRUYsTUFBTSxHQUFHLEdBQWlCO29CQUN4QixJQUFJLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtvQkFDdEMsT0FBTztpQkFDUixDQUFDO2dCQUNGLFdBQVcsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxXQUFXLENBQUM7WUFDbkIsU0FBUyxXQUFXLENBQUMsSUFBbUI7Z0JBQ3RDLFFBQVEsSUFBSSxDQUFDLEVBQUUsRUFBRTtvQkFDZixLQUFLLDRDQUFrQixDQUFDLEdBQUc7d0JBQ3pCLE9BQU8sb0JBQVEsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDeEMsS0FBSyw0Q0FBa0IsQ0FBQyxNQUFNO3dCQUM1QixPQUFPLG9CQUFRLENBQUMsd0JBQXdCLENBQUM7b0JBQzNDLEtBQUssNENBQWtCLENBQUMsTUFBTTt3QkFDNUIsT0FBTyxvQkFBUSxDQUFDLHdCQUF3QixDQUFDO29CQUMzQyxLQUFLLDRDQUFrQixDQUFDLE1BQU07d0JBQzVCLE9BQU8sb0JBQVEsQ0FBQyx3QkFBd0IsQ0FBQztpQkFDNUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUNELG1DQUFtQztRQUVuQyxrQkFBa0I7UUFDbEIsMkZBQTJGO1FBQ25GLHNCQUFzQixDQUM1QixRQUFxQixFQUFFLEVBQ3ZCLE1BQW9CO1lBRXBCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQzdDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsK0JBQStCLENBQUMsa0JBQWtCLENBQ3JFLFVBQVUsQ0FDWCxDQUFDO1lBRUYsSUFBSSxhQUErQixDQUFDO1lBQ3BDLElBQUk7Z0JBQ0YsYUFBYSxHQUFHLFVBQVU7b0JBQ3hCLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztvQkFDN0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3RFO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUM5QjtZQUVELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksVUFBVSxLQUFLLGFBQWM7Z0JBQzFELENBQUMsQ0FBQyxLQUFLO2dCQUNQLENBQUMsaUNBQU0sS0FBSyxLQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsYUFBYyxHQUFFLENBQUM7UUFDakQsQ0FBQztRQUVELGtFQUFrRTtRQUMxRCxpQkFBaUIsQ0FBQyxXQUF3QixFQUFFLFdBQXFCO1lBQ3ZFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMvQixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNDLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtvQkFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRTt3QkFDZCxXQUFXLHFCQUFRLFdBQVcsQ0FBRSxDQUFDO3dCQUNqQyxTQUFTLEdBQUcsSUFBSSxDQUFDO3FCQUNsQjtvQkFDRCxXQUFXLENBQUMsVUFBVSxDQUFDLG1DQUFRLFVBQVUsS0FBRSxPQUFPLEVBQUUsS0FBSyxHQUFFLENBQUM7aUJBQzdEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO0tBRUYsQ0FBQTtJQTFWWSx5QkFBeUI7UUFEckMsaUJBQVUsRUFBRTtpREFHd0IsbURBQXVCO1lBQ2Ysb0VBQStCO1lBQ3hELG1CQUFNO09BSmIseUJBQXlCLENBMFZyQztJQTFWWSw4REFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vZW50aXR5LWNhY2hlJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIENsZWFyQ29sbGVjdGlvbnMsXG4gIExvYWRDb2xsZWN0aW9ucyxcbiAgTWVyZ2VRdWVyeVNldCxcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldEl0ZW0sXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgRW50aXR5Q2FjaGVSZWR1Y2VyIHZpYSBpdHMgY3JlYXRlKCkgbWV0aG9kXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcjogRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIEBuZ3J4L2RhdGEgZW50aXR5IGNhY2hlIHJlZHVjZXIgd2hpY2ggZWl0aGVyIHJlc3BvbmRzIHRvIGVudGl0eSBjYWNoZSBsZXZlbCBhY3Rpb25zXG4gICAqIG9yIChtb3JlIGNvbW1vbmx5KSBkZWxlZ2F0ZXMgdG8gYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgYmFzZWQgb24gdGhlIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUuXG4gICAqL1xuICBjcmVhdGUoKTogQWN0aW9uUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPiB7XG4gICAgLy8gVGhpcyB0ZWNobmlxdWUgZW5zdXJlcyBhIG5hbWVkIGZ1bmN0aW9uIGFwcGVhcnMgaW4gdGhlIGRlYnVnZ2VyXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlUmVkdWNlci5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gZW50aXR5Q2FjaGVSZWR1Y2VyKFxuICAgICAgdGhpczogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgICAgYWN0aW9uOiB7IHR5cGU6IHN0cmluZzsgcGF5bG9hZD86IGFueSB9XG4gICAgKTogRW50aXR5Q2FjaGUge1xuICAgICAgLy8gRW50aXR5Q2FjaGUgYWN0aW9uc1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkNMRUFSX0NPTExFQ1RJT05TOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBDbGVhckNvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTE9BRF9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBMb2FkQ29sbGVjdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5NRVJHRV9RVUVSWV9TRVQ6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tZXJnZVF1ZXJ5U2V0UmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIE1lcmdlUXVlcnlTZXRcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIFNhdmVFbnRpdGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc0NhbmNlbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1I6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNFcnJvclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzU3VjY2Vzc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLlNFVF9FTlRJVFlfQ0FDSEU6IHtcbiAgICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIEVudGl0eUNhY2hlLiBCZSBjYXJlZnVsIVxuICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5jYWNoZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBlbnRpdHkgY29sbGVjdGlvbiByZWR1Y2VyIGlmIHRoaXMgaXMgYSB2YWxpZCBFbnRpdHlBY3Rpb24gZm9yIGEgY29sbGVjdGlvblxuICAgICAgY29uc3QgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgaWYgKHBheWxvYWQgJiYgcGF5bG9hZC5lbnRpdHlOYW1lICYmIHBheWxvYWQuZW50aXR5T3AgJiYgIXBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0aW9uIGFzIEVudGl0eUFjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCBhIHZhbGlkIEVudGl0eUFjdGlvblxuICAgICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIGNsZWFyIG11bHRpcGxlIGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBDbGVhckNvbGxlY3Rpb25zIGFjdGlvbiB3aG9zZSBwYXlsb2FkIGlzIGFuIGFycmF5IG9mIGNvbGxlY3Rpb24gbmFtZXMuXG4gICAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG5vIGFycmF5LCBjbGVhcnMgYWxsIHRoZSBjb2xsZWN0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCBjbGVhckNvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBDbGVhckNvbGxlY3Rpb25zXG4gICkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uc3RcbiAgICBsZXQgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlJFTU9WRV9BTEw7XG5cbiAgICBpZiAoIWNvbGxlY3Rpb25zKSB7XG4gICAgICAvLyBDb2xsZWN0aW9ucyBpcyBub3QgZGVmaW5lZC4gQ2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgICAgY29sbGVjdGlvbnMgPSBPYmplY3Qua2V5cyhlbnRpdHlDYWNoZSk7XG4gICAgfVxuXG4gICAgZW50aXR5Q2FjaGUgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0geyBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBsb2FkIGNvbGxlY3Rpb24gaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIExvYWRDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyB0aGUgUXVlcnlTZXQgb2YgZW50aXR5IGNvbGxlY3Rpb25zIHRvIGxvYWRcbiAgICovXG4gIHByb3RlY3RlZCBsb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IExvYWRDb2xsZWN0aW9uc1xuICApIHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zLCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuQUREX0FMTDtcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb25zKTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBjb2xsZWN0aW9uc1tlbnRpdHlOYW1lXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIHRvIG1lcmdlIHF1ZXJ5IHNldHMgaW4gdGhlIGZvcm0gb2YgYSBoYXNoIG9mIGVudGl0eSBkYXRhIGZvciBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIGVudGl0eUNhY2hlIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIGFjdGlvbiBhIE1lcmdlUXVlcnlTZXQgYWN0aW9uIHdpdGggdGhlIHF1ZXJ5IHNldCBhbmQgYSBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcm90ZWN0ZWQgbWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogTWVyZ2VRdWVyeVNldFxuICApIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgbWVyZ2VTdHJhdGVneSwgcXVlcnlTZXQsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBudWxsID8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGNvbnN0IGVudGl0eU9wID0gRW50aXR5T3AuVVBTRVJUX01BTlk7XG5cbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IE9iamVjdC5rZXlzKHF1ZXJ5U2V0KTtcbiAgICBlbnRpdHlDYWNoZSA9IGVudGl0eU5hbWVzLnJlZHVjZSgobmV3Q2FjaGUsIGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGVudGl0eU9wLFxuICAgICAgICBkYXRhOiBxdWVyeVNldFtlbnRpdHlOYW1lXSxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIH07XG4gICAgICBjb25zdCBhY3Q6IEVudGl0eUFjdGlvbiA9IHtcbiAgICAgICAgdHlwZTogYFske2VudGl0eU5hbWV9XSAke2FjdGlvbi50eXBlfWAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICB9O1xuICAgICAgbmV3Q2FjaGUgPSB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIobmV3Q2FjaGUsIGFjdCk7XG4gICAgICByZXR1cm4gbmV3Q2FjaGU7XG4gICAgfSwgZW50aXR5Q2FjaGUpO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuXG4gIC8vICNyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFuZ2VTZXQsXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIHRhZyxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICB0cnkge1xuICAgICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgICAgdGFnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH07XG4gICAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgICAgICBpZiAoYWN0LnBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBhY3QucGF5bG9hZC5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTlk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzQ2FuY2VsXG4gICkge1xuICAgIC8vIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIG9ubHkgY2xlYXIgdGhlIGxvYWRpbmcgZmxhZyBmb3IgdGhlIGNvbGxlY3Rpb25zIGludm9sdmVkXG4gICAgLy8gSWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHlvdSdsbCBoYXZlIHRvIGNvbXBlbnNhdGUgdG8gZml4IHRoZSBjYWNoZSBhcyB5b3UgdGhpbmsgbmVjZXNzYXJ5XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJMb2FkaW5nRmxhZ3MoXG4gICAgICBlbnRpdHlDYWNoZSxcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVzIHx8IFtdXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRW50aXRpZXNFcnJvclJlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzRXJyb3JcbiAgKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxBY3Rpb24gPSBhY3Rpb24ucGF5bG9hZC5vcmlnaW5hbEFjdGlvbjtcbiAgICBjb25zdCBvcmlnaW5hbENoYW5nZVNldCA9IG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICBjb25zdCBlbnRpdHlOYW1lcyA9IG9yaWdpbmFsQ2hhbmdlU2V0LmNoYW5nZXMubWFwKGl0ZW0gPT4gaXRlbS5lbnRpdHlOYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZSwgZW50aXR5TmFtZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hhbmdlU2V0LFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICB0YWcsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY2hhbmdlU2V0LmNoYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBpdGVtLmVudGl0eU5hbWU7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcDogZ2V0RW50aXR5T3AoaXRlbSksXG4gICAgICAgIGRhdGE6IGl0ZW0uZW50aXRpZXMsXG4gICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgIGlzT3B0aW1pc3RpYyxcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgdGFnLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICAgIGZ1bmN0aW9uIGdldEVudGl0eU9wKGl0ZW06IENoYW5nZVNldEl0ZW0pIHtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5BZGQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcHNlcnQ6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTUztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIEFwcGx5IHJlZHVjZXIgZm9yIHRoZSBhY3Rpb24ncyBFbnRpdHlDb2xsZWN0aW9uIChpZiB0aGUgYWN0aW9uIHRhcmdldHMgYSBjb2xsZWN0aW9uKSAqL1xuICBwcml2YXRlIGFwcGx5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgY2FjaGU6IEVudGl0eUNhY2hlID0ge30sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSB7XG4gICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNhY2hlW2VudGl0eU5hbWVdO1xuICAgIGNvbnN0IHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkuZ2V0T3JDcmVhdGVSZWR1Y2VyKFxuICAgICAgZW50aXR5TmFtZVxuICAgICk7XG5cbiAgICBsZXQgbmV3Q29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjtcbiAgICB0cnkge1xuICAgICAgbmV3Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cbiAgICAgICAgPyByZWR1Y2VyKGNvbGxlY3Rpb24sIGFjdGlvbilcbiAgICAgICAgOiByZWR1Y2VyKHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IuY3JlYXRlKGVudGl0eU5hbWUpLCBhY3Rpb24pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICBhY3Rpb24ucGF5bG9hZC5lcnJvciA9IGVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5lcnJvciB8fCBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uIVxuICAgICAgPyBjYWNoZVxuICAgICAgOiB7IC4uLmNhY2hlLCBbZW50aXR5TmFtZV06IG5ld0NvbGxlY3Rpb24hIH07XG4gIH1cblxuICAvKiogRW5zdXJlIGxvYWRpbmcgaXMgZmFsc2UgZm9yIGV2ZXJ5IGNvbGxlY3Rpb24gaW4gZW50aXR5TmFtZXMgKi9cbiAgcHJpdmF0ZSBjbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsIGVudGl0eU5hbWVzOiBzdHJpbmdbXSkge1xuICAgIGxldCBpc011dGF0ZWQgPSBmYWxzZTtcbiAgICBlbnRpdHlOYW1lcy5mb3JFYWNoKGVudGl0eU5hbWUgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGVudGl0eUNhY2hlW2VudGl0eU5hbWVdO1xuICAgICAgaWYgKGNvbGxlY3Rpb24ubG9hZGluZykge1xuICAgICAgICBpZiAoIWlzTXV0YXRlZCkge1xuICAgICAgICAgIGVudGl0eUNhY2hlID0geyAuLi5lbnRpdHlDYWNoZSB9O1xuICAgICAgICAgIGlzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5Q2FjaGVbZW50aXR5TmFtZV0gPSB7IC4uLmNvbGxlY3Rpb24sIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19