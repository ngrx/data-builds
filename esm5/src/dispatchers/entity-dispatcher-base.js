import * as tslib_1 from "tslib";
import { createSelector } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { filter, map, mergeMap, shareReplay, withLatestFrom, take, } from 'rxjs/operators';
import { defaultSelectId, toUpdateFactory } from '../utils/utilities';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { PersistanceCanceled } from './entity-dispatcher';
import { EntityOp, OP_ERROR, OP_SUCCESS } from '../actions/entity-op';
/**
 * Dispatches EntityCollection actions to their reducers and effects (default implementation).
 * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
 */
var EntityDispatcherBase = /** @class */ (function () {
    function EntityDispatcherBase(
    /** Name of the entity type for which entities are dispatched */
    entityName, 
    /** Creates an {EntityAction} */
    entityActionFactory, 
    /** The store, scoped to the EntityCache */
    store, 
    /** Returns the primary key (id) of this entity */
    selectId, 
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    reducedActions$, 
    /** Store selector for the EntityCache */
    entityCacheSelector, 
    /** Generates correlation ids for query and save methods */
    correlationIdGenerator) {
        if (selectId === void 0) { selectId = defaultSelectId; }
        this.entityName = entityName;
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.selectId = selectId;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.reducedActions$ = reducedActions$;
        this.correlationIdGenerator = correlationIdGenerator;
        this.guard = new EntityActionGuard(entityName, selectId);
        this.toUpdate = toUpdateFactory(selectId);
        var collectionSelector = createSelector(entityCacheSelector, function (cache) { return cache[entityName]; });
        this.entityCollection$ = store.select(collectionSelector);
    }
    /**
     * Create an {EntityAction} for this entity type.
     * @param entityOp {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the EntityAction
     */
    EntityDispatcherBase.prototype.createEntityAction = function (entityOp, data, options) {
        return this.entityActionFactory.create(tslib_1.__assign({ entityName: this.entityName, entityOp: entityOp,
            data: data }, options));
    };
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @param op {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the dispatched EntityAction
     */
    EntityDispatcherBase.prototype.createAndDispatch = function (op, data, options) {
        var action = this.createEntityAction(op, data, options);
        this.dispatch(action);
        return action;
    };
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    EntityDispatcherBase.prototype.dispatch = function (action) {
        this.store.dispatch(action);
        return action;
    };
    // #region Query and save operations
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    EntityDispatcherBase.prototype.add = function (entity, options) {
        var _this = this;
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
        var action = this.createEntityAction(EntityOp.SAVE_ADD_ONE, entity, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), e = _b[0], collection = _b[1];
            return collection.entities[_this.selectId(e)];
        }), shareReplay(1));
    };
    /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param correlationId The correlation id for the corresponding EntityAction
     * @param [reason] explains why canceled and by whom.
     */
    EntityDispatcherBase.prototype.cancel = function (correlationId, reason, options) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId: correlationId });
    };
    EntityDispatcherBase.prototype.delete = function (arg, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
        var key = this.getKey(arg);
        var action = this.createEntityAction(EntityOp.SAVE_DELETE_ONE, key, options);
        this.guard.mustBeKey(action);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(map(function () { return key; }), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @returns A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     * @see load()
     */
    EntityDispatcherBase.prototype.getAll = function (options) {
        var _this = this;
        options = this.setQueryEntityActionOptions(options);
        var action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), entities = _b[0], collection = _b[1];
            return entities.reduce(function (acc, e) {
                var entity = collection.entities[_this.selectId(e)];
                if (entity) {
                    acc.push(entity); // only return an entity found in the collection
                }
                return acc;
            }, []);
        }), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @returns A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    EntityDispatcherBase.prototype.getByKey = function (key, options) {
        var _this = this;
        options = this.setQueryEntityActionOptions(options);
        var action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), entity = _b[0], collection = _b[1];
            return collection.entities[_this.selectId(entity)];
        }), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    EntityDispatcherBase.prototype.getWithQuery = function (queryParams, options) {
        var _this = this;
        options = this.setQueryEntityActionOptions(options);
        var action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), entities = _b[0], collection = _b[1];
            return entities.reduce(function (acc, e) {
                var entity = collection.entities[_this.selectId(e)];
                if (entity) {
                    acc.push(entity); // only return an entity found in the collection
                }
                return acc;
            }, []);
        }), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @returns A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     * @see getAll
     */
    EntityDispatcherBase.prototype.load = function (options) {
        options = this.setQueryEntityActionOptions(options);
        var action = this.createEntityAction(EntityOp.QUERY_LOAD, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(shareReplay(1));
    };
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity update entity, which might be a partial of T but must at least have its key.
     * @returns A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    EntityDispatcherBase.prototype.update = function (entity, options) {
        var _this = this;
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        var update = this.toUpdate(entity);
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
        var action = this.createEntityAction(EntityOp.SAVE_UPDATE_ONE, update, options);
        if (options.isOptimistic) {
            this.guard.mustBeUpdate(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the update entity data id to get the entity from the collection
        // as might be different from the entity returned from the server
        // because the id changed or there are unsaved changes.
        map(function (updateData) { return updateData.changes; }), withLatestFrom(this.entityCollection$), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), e = _b[0], collection = _b[1];
            return collection.entities[_this.selectId(e)];
        }), shareReplay(1));
    };
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    EntityDispatcherBase.prototype.upsert = function (entity, options) {
        var _this = this;
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
        var action = this.createEntityAction(EntityOp.SAVE_UPSERT_ONE, entity, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), e = _b[0], collection = _b[1];
            return collection.entities[_this.selectId(e)];
        }), shareReplay(1));
    };
    // #endregion Query and save operations
    // #region Cache-only operations that do not update remote storage
    // Unguarded for performance.
    // EntityCollectionReducer<T> runs a guard (which throws)
    // Developer should understand cache-only methods well enough
    // to call them with the proper entities.
    // May reconsider and add guards in future.
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     */
    EntityDispatcherBase.prototype.addAllToCache = function (entities, options) {
        this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
    };
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     */
    EntityDispatcherBase.prototype.addOneToCache = function (entity, options) {
        this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
    };
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     */
    EntityDispatcherBase.prototype.addManyToCache = function (entities, options) {
        this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
    };
    /** Clear the cached entity collection */
    EntityDispatcherBase.prototype.clearCache = function (options) {
        this.createAndDispatch(EntityOp.REMOVE_ALL, undefined, options);
    };
    EntityDispatcherBase.prototype.removeOneFromCache = function (arg, options) {
        this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
    };
    EntityDispatcherBase.prototype.removeManyFromCache = function (args, options) {
        var _this = this;
        if (!args || args.length === 0) {
            return;
        }
        var keys = typeof args[0] === 'object'
            ? // if array[0] is a key, assume they're all keys
                args.map(function (arg) { return _this.getKey(arg); })
            : args;
        this.createAndDispatch(EntityOp.REMOVE_MANY, keys, options);
    };
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     */
    EntityDispatcherBase.prototype.updateOneInCache = function (entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        var update = this.toUpdate(entity);
        this.createAndDispatch(EntityOp.UPDATE_ONE, update, options);
    };
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     */
    EntityDispatcherBase.prototype.updateManyInCache = function (entities, options) {
        var _this = this;
        if (!entities || entities.length === 0) {
            return;
        }
        var updates = entities.map(function (entity) { return _this.toUpdate(entity); });
        this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
    };
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     */
    EntityDispatcherBase.prototype.upsertOneInCache = function (entity, options) {
        this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
    };
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     */
    EntityDispatcherBase.prototype.upsertManyInCache = function (entities, options) {
        if (!entities || entities.length === 0) {
            return;
        }
        this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
    };
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     */
    EntityDispatcherBase.prototype.setFilter = function (pattern) {
        this.createAndDispatch(EntityOp.SET_FILTER, pattern);
    };
    /** Set the loaded flag */
    EntityDispatcherBase.prototype.setLoaded = function (isLoaded) {
        this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
    };
    /** Set the loading flag */
    EntityDispatcherBase.prototype.setLoading = function (isLoading) {
        this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
    };
    // #endregion Cache-only operations that do not update remote storage
    // #region private helpers
    /** Get key from entity (unless arg is already a key) */
    EntityDispatcherBase.prototype.getKey = function (arg) {
        return typeof arg === 'object'
            ? this.selectId(arg)
            : arg;
    };
    /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    EntityDispatcherBase.prototype.getResponseData$ = function (crid) {
        var _this = this;
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter(function (act) { return !!act.payload; }), filter(function (act) {
            var _a = act.payload, correlationId = _a.correlationId, entityName = _a.entityName, entityOp = _a.entityOp;
            return (entityName === _this.entityName &&
                correlationId === crid &&
                (entityOp.endsWith(OP_SUCCESS) ||
                    entityOp.endsWith(OP_ERROR) ||
                    entityOp === EntityOp.CANCEL_PERSIST));
        }), take(1), mergeMap(function (act) {
            var entityOp = act.payload.entityOp;
            return entityOp === EntityOp.CANCEL_PERSIST
                ? throwError(new PersistanceCanceled(act.payload.data))
                : entityOp.endsWith(OP_SUCCESS)
                    ? of(act.payload.data)
                    : throwError(act.payload.data.error);
        }));
    };
    EntityDispatcherBase.prototype.setQueryEntityActionOptions = function (options) {
        options = options || {};
        var correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        return tslib_1.__assign({}, options, { correlationId: correlationId });
    };
    EntityDispatcherBase.prototype.setSaveEntityActionOptions = function (options, defaultOptimism) {
        options = options || {};
        var correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        var isOptimistic = options.isOptimistic == null
            ? defaultOptimism || false
            : options.isOptimistic === true;
        return tslib_1.__assign({}, options, { correlationId: correlationId, isOptimistic: isOptimistic });
    };
    return EntityDispatcherBase;
}());
export { EntityDispatcherBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFVLGNBQWMsRUFBUyxNQUFNLGFBQWEsQ0FBQztBQUc1RCxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGNBQWMsRUFDZCxJQUFJLEdBQ0wsTUFBTSxnQkFBZ0IsQ0FBQztBQUd4QixPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3RFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBS25FLE9BQU8sRUFBb0IsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU1RSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUt0RTs7O0dBR0c7QUFDSDtJQVlFO0lBQ0UsZ0VBQWdFO0lBQ3pELFVBQWtCO0lBQ3pCLGdDQUFnQztJQUN6QixtQkFBd0M7SUFDL0MsMkNBQTJDO0lBQ3BDLEtBQXlCO0lBQ2hDLGtEQUFrRDtJQUMzQyxRQUF5QztJQUNoRDs7O09BR0c7SUFDSyx3QkFBd0Q7SUFDaEUsMEVBQTBFO0lBQ2xFLGVBQW1DO0lBQzNDLHlDQUF5QztJQUN6QyxtQkFBd0M7SUFDeEMsMkRBQTJEO0lBQ25ELHNCQUE4QztRQVgvQyx5QkFBQSxFQUFBLDBCQUF5QztRQU56QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBRWxCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFFeEMsVUFBSyxHQUFM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LE9BQTZCO1FBRTdCLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQU0sYUFBYSxHQUNqQixPQUFPLENBQUMsYUFBYSxJQUFJLElBQUk7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUU7WUFDcEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDNUIsNEJBQVksT0FBTyxJQUFFLGFBQWEsZUFBQSxJQUFHO0lBQ3ZDLENBQUM7SUFFTyx5REFBMEIsR0FBbEMsVUFDRSxPQUE2QixFQUM3QixlQUF5QjtRQUV6QixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFNLGFBQWEsR0FDakIsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFO1lBQ3BDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzVCLElBQU0sWUFBWSxHQUNoQixPQUFPLENBQUMsWUFBWSxJQUFJLElBQUk7WUFDMUIsQ0FBQyxDQUFDLGVBQWUsSUFBSSxLQUFLO1lBQzFCLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQztRQUNwQyw0QkFBWSxPQUFPLElBQUUsYUFBYSxlQUFBLEVBQUUsWUFBWSxjQUFBLElBQUc7SUFDckQsQ0FBQztJQUVILDJCQUFDO0FBQUQsQ0FBQyxBQXRsQkQsSUFzbEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uLCBjcmVhdGVTZWxlY3RvciwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgZmlsdGVyLFxuICBtYXAsXG4gIG1lcmdlTWFwLFxuICBzaGFyZVJlcGxheSxcbiAgd2l0aExhdGVzdEZyb20sXG4gIHRha2UsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQsIHRvVXBkYXRlRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkd1YXJkIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlU2VsZWN0b3IgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb21tYW5kcyB9IGZyb20gJy4vZW50aXR5LWNvbW1hbmRzJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIsIFBlcnNpc3RhbmNlQ2FuY2VsZWQgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IEVudGl0eU9wLCBPUF9FUlJPUiwgT1BfU1VDQ0VTUyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBFbnRpdHlDb2xsZWN0aW9uIGFjdGlvbnMgdG8gdGhlaXIgcmVkdWNlcnMgYW5kIGVmZmVjdHMgKGRlZmF1bHQgaW1wbGVtZW50YXRpb24pLlxuICogQWxsIHNhdmUgY29tbWFuZHMgcmVseSBvbiBhbiBOZ3J4IEVmZmVjdCBzdWNoIGFzIGBFbnRpdHlFZmZlY3RzLnBlcnNpc3QkYC5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eURpc3BhdGNoZXJCYXNlPFQ+IGltcGxlbWVudHMgRW50aXR5RGlzcGF0Y2hlcjxUPiB7XG4gIC8qKiBVdGlsaXR5IGNsYXNzIHdpdGggbWV0aG9kcyB0byB2YWxpZGF0ZSBFbnRpdHlBY3Rpb24gcGF5bG9hZHMuKi9cbiAgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuXG4gIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbjxUPj47XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmAgb2JqZWN0XG4gICAqIGB1cGRhdGUuLi5gIGFuZCBgdXBzZXJ0Li4uYCBtZXRob2RzIHRha2UgYFVwZGF0ZTxUPmAgYXJnc1xuICAgKi9cbiAgdG9VcGRhdGU6IChlbnRpdHk6IFBhcnRpYWw8VD4pID0+IFVwZGF0ZTxUPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHdoaWNoIGVudGl0aWVzIGFyZSBkaXNwYXRjaGVkICovXG4gICAgcHVibGljIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICAvKiogQ3JlYXRlcyBhbiB7RW50aXR5QWN0aW9ufSAqL1xuICAgIHB1YmxpYyBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIC8qKiBUaGUgc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBwdWJsaWMgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPixcbiAgICAvKiogUmV0dXJucyB0aGUgcHJpbWFyeSBrZXkgKGlkKSBvZiB0aGlzIGVudGl0eSAqL1xuICAgIHB1YmxpYyBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPiA9IGRlZmF1bHRTZWxlY3RJZCxcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaGVyIG9wdGlvbnMgY29uZmlndXJlIGRpc3BhdGNoZXIgYmVoYXZpb3Igc3VjaCBhc1xuICAgICAqIHdoZXRoZXIgYWRkIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWMgYnkgZGVmYXVsdC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRlZmF1bHREaXNwYXRjaGVyT3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIC8qKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuICovXG4gICAgcHJpdmF0ZSByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPixcbiAgICAvKiogU3RvcmUgc2VsZWN0b3IgZm9yIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIGVudGl0eUNhY2hlU2VsZWN0b3I6IEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgLyoqIEdlbmVyYXRlcyBjb3JyZWxhdGlvbiBpZHMgZm9yIHF1ZXJ5IGFuZCBzYXZlIG1ldGhvZHMgKi9cbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgKSB7XG4gICAgdGhpcy5ndWFyZCA9IG5ldyBFbnRpdHlBY3Rpb25HdWFyZChlbnRpdHlOYW1lLCBzZWxlY3RJZCk7XG4gICAgdGhpcy50b1VwZGF0ZSA9IHRvVXBkYXRlRmFjdG9yeTxUPihzZWxlY3RJZCk7XG5cbiAgICBjb25zdCBjb2xsZWN0aW9uU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIGVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgICBjYWNoZSA9PiBjYWNoZVtlbnRpdHlOYW1lXSBhcyBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICAgKTtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24kID0gc3RvcmUuc2VsZWN0KGNvbGxlY3Rpb25TZWxlY3Rvcik7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5T3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgZW50aXR5T3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgZW50aXR5TmFtZTogdGhpcy5lbnRpdHlOYW1lLFxuICAgICAgZW50aXR5T3AsXG4gICAgICBkYXRhLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUgYW5kXG4gICAqIGRpc3BhdGNoIGl0IGltbWVkaWF0ZWx5IHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVBbmREaXNwYXRjaDxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihvcCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gQWN0aW9uIHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBRdWVyeSBhbmQgc2F2ZSBvcGVyYXRpb25zXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljQWRkXG4gICAgKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgICAgIGVudGl0eSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChvcHRpb25zLmlzT3B0aW1pc3RpYykge1xuICAgICAgdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAocXVlcnkgb3Igc2F2ZSkuXG4gICAqIFdpbGwgY2F1c2Ugc2F2ZSBvYnNlcnZhYmxlIHRvIGVycm9yIHdpdGggYSBQZXJzaXN0ZW5jZUNhbmNlbCBlcnJvci5cbiAgICogQ2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciB1bmRvaW5nIGNoYW5nZXMgaW4gY2FjaGUgZnJvbSBwZW5kaW5nIG9wdGltaXN0aWMgc2F2ZVxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKi9cbiAgY2FuY2VsKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFjb3JyZWxhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgY29ycmVsYXRpb25JZCcpO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkNBTkNFTF9QRVJTSVNULCByZWFzb24sIHsgY29ycmVsYXRpb25JZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGVudGl0eSB0byBkZWxldGVcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuICBkZWxldGUoXG4gICAgYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY0RlbGV0ZVxuICAgICk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXkoYXJnKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORSxcbiAgICAgIGtleSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIHRoaXMuZ3VhcmQubXVzdEJlS2V5KGFjdGlvbik7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8bnVtYmVyIHwgc3RyaW5nPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBtYXAoKCkgPT4ga2V5KSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllcyB0aGF0IGFyZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBsb2FkKClcbiAgICovXG4gIGdldEFsbChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0FMTCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBpZHMgdG8gZ2V0IHRoZSBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2Ugb2YgdW5zYXZlZCBjaGFuZ2VzIChkZWxldGVzIG9yIHVwZGF0ZXMpLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlbnRpdGllcywgY29sbGVjdGlvbl0pID0+XG4gICAgICAgIGVudGl0aWVzLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICBhY2MucHVzaChlbnRpdHkpOyAvLyBvbmx5IHJldHVybiBhbiBlbnRpdHkgZm91bmQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXSBhcyBUW11cbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdHkgd2l0aCB0aGlzIHByaW1hcnkga2V5LlxuICAgKiBJZiB0aGUgc2VydmVyIHJldHVybnMgYW4gZW50aXR5LFxuICAgKiBtZXJnZSBpdCBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0QnlLZXkoa2V5OiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0JZX0tFWSwga2V5LCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcChcbiAgICAgICAgKFtlbnRpdHksIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZW50aXR5KV0hXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBxdWVyeVBhcmFtcyB0aGUgcXVlcnkgaW4gYSBmb3JtIHVuZGVyc3Rvb2QgYnkgdGhlIHNlcnZlclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgICAgIHF1ZXJ5UGFyYW1zLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBpZHMgdG8gZ2V0IHRoZSBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2Ugb2YgdW5zYXZlZCBjaGFuZ2VzIChkZWxldGVzIG9yIHVwZGF0ZXMpLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlbnRpdGllcywgY29sbGVjdGlvbl0pID0+XG4gICAgICAgIGVudGl0aWVzLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICBhY2MucHVzaChlbnRpdHkpOyAvLyBvbmx5IHJldHVybiBhbiBlbnRpdHkgZm91bmQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXSBhcyBUW11cbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogY29tcGxldGVseSByZXBsYWNlIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB3aXRoIHRoZSBxdWVyaWVkIGVudGl0aWVzLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGdldEFsbFxuICAgKi9cbiAgbG9hZChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0xPQUQsIG51bGwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFRbXT4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIHRoZSB1cGRhdGVkIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICogQHBhcmFtIGVudGl0eSB1cGRhdGUgZW50aXR5LCB3aGljaCBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgdXBkYXRlZCBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBkYXRlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNVcGRhdGVcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FLFxuICAgICAgdXBkYXRlLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxVcGRhdGVSZXNwb25zZURhdGE8VD4+KFxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkXG4gICAgKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSB1cGRhdGUgZW50aXR5IGRhdGEgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGlkIGNoYW5nZWQgb3IgdGhlcmUgYXJlIHVuc2F2ZWQgY2hhbmdlcy5cbiAgICAgIG1hcCh1cGRhdGVEYXRhID0+IHVwZGF0ZURhdGEuY2hhbmdlcyksXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSBhcyBUKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIE9ubHkgZGlzcGF0Y2ggdGhpcyBhY3Rpb24gaWYgeW91ciBzZXJ2ZXIgc3VwcG9ydHMgdXBzZXJ0LlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cHNlcnQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNVcHNlcnRcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuICAgICAgZW50aXR5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBRdWVyeSBhbmQgc2F2ZSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlXG5cbiAgLy8gVW5ndWFyZGVkIGZvciBwZXJmb3JtYW5jZS5cbiAgLy8gRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gcnVucyBhIGd1YXJkICh3aGljaCB0aHJvd3MpXG4gIC8vIERldmVsb3BlciBzaG91bGQgdW5kZXJzdGFuZCBjYWNoZS1vbmx5IG1ldGhvZHMgd2VsbCBlbm91Z2hcbiAgLy8gdG8gY2FsbCB0aGVtIHdpdGggdGhlIHByb3BlciBlbnRpdGllcy5cbiAgLy8gTWF5IHJlY29uc2lkZXIgYW5kIGFkZCBndWFyZHMgaW4gZnV0dXJlLlxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICBhZGRBbGxUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfQUxMLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggdGhlIHNhbWUgcHJpbWFyeSBrZXkgaXMgYWxyZWFkeSBpbiBjYWNoZS5cbiAgICovXG4gIGFkZE9uZVRvQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX09ORSwgZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICovXG4gIGFkZE1hbnlUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfTUFOWSwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZShvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX0FMTCwgdW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShrZXk6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoXG4gICAgYXJnOiAobnVtYmVyIHwgc3RyaW5nKSB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfT05FLCB0aGlzLmdldEtleShhcmcpLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGFyZ3M6IChudW1iZXIgfCBzdHJpbmcpW10gfCBUW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFhcmdzIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGtleXMgPVxuICAgICAgdHlwZW9mIGFyZ3NbMF0gPT09ICdvYmplY3QnXG4gICAgICAgID8gLy8gaWYgYXJyYXlbMF0gaXMgYSBrZXksIGFzc3VtZSB0aGV5J3JlIGFsbCBrZXlzXG4gICAgICAgICAgKDxUW10+YXJncykubWFwKGFyZyA9PiB0aGlzLmdldEtleShhcmcpKVxuICAgICAgICA6IGFyZ3M7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfTUFOWSwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoYXQgZW50aXR5IGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIG1hdGNoaW5nIHByaW1hcnkga2V5IGlzIG5vdCBpbiBjYWNoZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqL1xuICB1cGRhdGVPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgY29uc3QgdXBkYXRlOiBVcGRhdGU8VD4gPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUERBVEVfT05FLCB1cGRhdGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGVzZSBlbnRpdGllcyBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2hvc2UgcHJpbWFyeSBrZXlzIGFyZSBub3QgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqIFVwZGF0ZSBlbnRpdGllcyBtYXkgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIHN1Y2ggcGFydGlhbCBlbnRpdGllcyBwYXRjaCB0aGVpciBjYWNoZWQgY291bnRlcnBhcnRzLlxuICAgKi9cbiAgdXBkYXRlTWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0aWVzIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB1cGRhdGVzOiBVcGRhdGU8VD5bXSA9IGVudGl0aWVzLm1hcChlbnRpdHkgPT4gdGhpcy50b1VwZGF0ZShlbnRpdHkpKTtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQREFURV9NQU5ZLCB1cGRhdGVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBQYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQU0VSVF9PTkUsIGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICB1cHNlcnRNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghZW50aXRpZXMgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBTRVJUX01BTlksIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9GSUxURVIsIHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfTE9BREVELCAhIWlzTG9hZGVkKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0xPQURJTkcsICEhaXNMb2FkaW5nKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2VcblxuICAvLyAjcmVnaW9uIHByaXZhdGUgaGVscGVyc1xuXG4gIC8qKiBHZXQga2V5IGZyb20gZW50aXR5ICh1bmxlc3MgYXJnIGlzIGFscmVhZHkgYSBrZXkpICovXG4gIHByaXZhdGUgZ2V0S2V5KGFyZzogbnVtYmVyIHwgc3RyaW5nIHwgVCkge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICAgPyB0aGlzLnNlbGVjdElkKGFyZylcbiAgICAgIDogKGFyZyBhcyBudW1iZXIgfCBzdHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBPYnNlcnZhYmxlIG9mIGRhdGEgZnJvbSB0aGUgc2VydmVyLXN1Y2Nlc3MgRW50aXR5QWN0aW9uIHdpdGhcbiAgICogdGhlIGdpdmVuIENvcnJlbGF0aW9uIElkLCBhZnRlciB0aGF0IGFjdGlvbiB3YXMgcHJvY2Vzc2VkIGJ5IHRoZSBuZ3J4IHN0b3JlLlxuICAgKiBvciBlbHNlIHB1dCB0aGUgc2VydmVyIGVycm9yIG9uIHRoZSBPYnNlcnZhYmxlIGVycm9yIGNoYW5uZWwuXG4gICAqIEBwYXJhbSBjcmlkIFRoZSBjb3JyZWxhdGlvbklkIGZvciBib3RoIHRoZSBzYXZlIGFuZCByZXNwb25zZSBhY3Rpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRSZXNwb25zZURhdGEkPEQgPSBhbnk+KGNyaWQ6IGFueSk6IE9ic2VydmFibGU8RD4ge1xuICAgIC8qKlxuICAgICAqIHJlZHVjZWRBY3Rpb25zJCBtdXN0IGJlIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAgICogYmVjYXVzZSB0aGUgcmVzcG9uc2UgYWN0aW9uIG1pZ2h0IGhhdmUgYmVlbiBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZVxuICAgICAqIGJlZm9yZSBjYWxsZXIgaGFkIGEgY2hhbmNlIHRvIHN1YnNjcmliZS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VkQWN0aW9ucyQucGlwZShcbiAgICAgIGZpbHRlcigoYWN0OiBhbnkpID0+ICEhYWN0LnBheWxvYWQpLFxuICAgICAgZmlsdGVyKChhY3Q6IEVudGl0eUFjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIGVudGl0eU5hbWUsIGVudGl0eU9wIH0gPSBhY3QucGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBlbnRpdHlOYW1lID09PSB0aGlzLmVudGl0eU5hbWUgJiZcbiAgICAgICAgICBjb3JyZWxhdGlvbklkID09PSBjcmlkICYmXG4gICAgICAgICAgKGVudGl0eU9wLmVuZHNXaXRoKE9QX1NVQ0NFU1MpIHx8XG4gICAgICAgICAgICBlbnRpdHlPcC5lbmRzV2l0aChPUF9FUlJPUikgfHxcbiAgICAgICAgICAgIGVudGl0eU9wID09PSBFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVClcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICAgdGFrZSgxKSxcbiAgICAgIG1lcmdlTWFwKGFjdCA9PiB7XG4gICAgICAgIGNvbnN0IHsgZW50aXR5T3AgfSA9IGFjdC5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gZW50aXR5T3AgPT09IEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUXG4gICAgICAgICAgPyB0aHJvd0Vycm9yKG5ldyBQZXJzaXN0YW5jZUNhbmNlbGVkKGFjdC5wYXlsb2FkLmRhdGEpKVxuICAgICAgICAgIDogZW50aXR5T3AuZW5kc1dpdGgoT1BfU1VDQ0VTUylcbiAgICAgICAgICAgID8gb2YoYWN0LnBheWxvYWQuZGF0YSBhcyBEKVxuICAgICAgICAgICAgOiB0aHJvd0Vycm9yKGFjdC5wYXlsb2FkLmRhdGEuZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyxcbiAgICBkZWZhdWx0T3B0aW1pc20/OiBib29sZWFuXG4gICk6IEVudGl0eUFjdGlvbk9wdGlvbnMge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9XG4gICAgICBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PSBudWxsXG4gICAgICAgID8gZGVmYXVsdE9wdGltaXNtIHx8IGZhbHNlXG4gICAgICAgIDogb3B0aW9ucy5pc09wdGltaXN0aWMgPT09IHRydWU7XG4gICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBwcml2YXRlIGhlbHBlcnNcbn1cbiJdfQ==