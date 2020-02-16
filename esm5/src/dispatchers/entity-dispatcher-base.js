import { __assign, __read } from "tslib";
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
        return this.entityActionFactory.create(__assign({ entityName: this.entityName, entityOp: entityOp,
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
            var _b = __read(_a, 2), e = _b[0], collection = _b[1];
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
            var _b = __read(_a, 2), entities = _b[0], collection = _b[1];
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
            var _b = __read(_a, 2), entity = _b[0], collection = _b[1];
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
            var _b = __read(_a, 2), entities = _b[0], collection = _b[1];
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
            var _b = __read(_a, 2), e = _b[0], collection = _b[1];
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
            var _b = __read(_a, 2), e = _b[0], collection = _b[1];
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
        return __assign(__assign({}, options), { correlationId: correlationId });
    };
    EntityDispatcherBase.prototype.setSaveEntityActionOptions = function (options, defaultOptimism) {
        options = options || {};
        var correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        var isOptimistic = options.isOptimistic == null
            ? defaultOptimism || false
            : options.isOptimistic === true;
        return __assign(__assign({}, options), { correlationId: correlationId, isOptimistic: isOptimistic });
    };
    return EntityDispatcherBase;
}());
export { EntityDispatcherBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFVLGNBQWMsRUFBUyxNQUFNLGFBQWEsQ0FBQztBQUc1RCxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGNBQWMsRUFDZCxJQUFJLEdBQ0wsTUFBTSxnQkFBZ0IsQ0FBQztBQUd4QixPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3RFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBS25FLE9BQU8sRUFBb0IsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU1RSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUt0RTs7O0dBR0c7QUFDSDtJQVlFO0lBQ0UsZ0VBQWdFO0lBQ3pELFVBQWtCO0lBQ3pCLGdDQUFnQztJQUN6QixtQkFBd0M7SUFDL0MsMkNBQTJDO0lBQ3BDLEtBQXlCO0lBQ2hDLGtEQUFrRDtJQUMzQyxRQUF5QztJQUNoRDs7O09BR0c7SUFDSyx3QkFBd0Q7SUFDaEUsMEVBQTBFO0lBQ2xFLGVBQW1DO0lBQzNDLHlDQUF5QztJQUN6QyxtQkFBd0M7SUFDeEMsMkRBQTJEO0lBQ25ELHNCQUE4QztRQVgvQyx5QkFBQSxFQUFBLDBCQUF5QztRQU56QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBRWxCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFFeEMsVUFBSyxHQUFM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T0FBNkI7UUFFN0IsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDeEIsSUFBTSxhQUFhLEdBQ2pCLE9BQU8sQ0FBQyxhQUFhLElBQUksSUFBSTtZQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRTtZQUNwQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUM1Qiw2QkFBWSxPQUFPLEtBQUUsYUFBYSxlQUFBLElBQUc7SUFDdkMsQ0FBQztJQUVPLHlEQUEwQixHQUFsQyxVQUNFLE9BQTZCLEVBQzdCLGVBQXlCO1FBRXpCLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQU0sYUFBYSxHQUNqQixPQUFPLENBQUMsYUFBYSxJQUFJLElBQUk7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUU7WUFDcEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDNUIsSUFBTSxZQUFZLEdBQ2hCLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSTtZQUMxQixDQUFDLENBQUMsZUFBZSxJQUFJLEtBQUs7WUFDMUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDO1FBQ3BDLDZCQUFZLE9BQU8sS0FBRSxhQUFhLGVBQUEsRUFBRSxZQUFZLGNBQUEsSUFBRztJQUNyRCxDQUFDO0lBRUgsMkJBQUM7QUFBRCxDQUFDLEFBdGxCRCxJQXNsQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24sIGNyZWF0ZVNlbGVjdG9yLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHNoYXJlUmVwbGF5LFxuICB3aXRoTGF0ZXN0RnJvbSxcbiAgdGFrZSxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCwgdG9VcGRhdGVGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbW1hbmRzIH0gZnJvbSAnLi9lbnRpdHktY29tbWFuZHMnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciwgUGVyc2lzdGFuY2VDYW5jZWxlZCB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgRW50aXR5T3AsIE9QX0VSUk9SLCBPUF9TVUNDRVNTIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgUXVlcnlQYXJhbXMgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBEaXNwYXRjaGVzIEVudGl0eUNvbGxlY3Rpb24gYWN0aW9ucyB0byB0aGVpciByZWR1Y2VycyBhbmQgZWZmZWN0cyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbikuXG4gKiBBbGwgc2F2ZSBjb21tYW5kcyByZWx5IG9uIGFuIE5ncnggRWZmZWN0IHN1Y2ggYXMgYEVudGl0eUVmZmVjdHMucGVyc2lzdCRgLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5RGlzcGF0Y2hlckJhc2U8VD4gaW1wbGVtZW50cyBFbnRpdHlEaXNwYXRjaGVyPFQ+IHtcbiAgLyoqIFV0aWxpdHkgY2xhc3Mgd2l0aCBtZXRob2RzIHRvIHZhbGlkYXRlIEVudGl0eUFjdGlvbiBwYXlsb2Fkcy4qL1xuICBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG5cbiAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uJDogT2JzZXJ2YWJsZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YCBvYmplY3RcbiAgICogYHVwZGF0ZS4uLmAgYW5kIGB1cHNlcnQuLi5gIG1ldGhvZHMgdGFrZSBgVXBkYXRlPFQ+YCBhcmdzXG4gICAqL1xuICB0b1VwZGF0ZTogKGVudGl0eTogUGFydGlhbDxUPikgPT4gVXBkYXRlPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3Igd2hpY2ggZW50aXRpZXMgYXJlIGRpc3BhdGNoZWQgKi9cbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKiBDcmVhdGVzIGFuIHtFbnRpdHlBY3Rpb259ICovXG4gICAgcHVibGljIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgLyoqIFRoZSBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIHB1YmxpYyBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+LFxuICAgIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gICAgcHVibGljIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+ID0gZGVmYXVsdFNlbGVjdElkLFxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoZXIgb3B0aW9ucyBjb25maWd1cmUgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzXG4gICAgICogd2hldGhlciBhZGQgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYyBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIHByaXZhdGUgZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgLyoqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy4gKi9cbiAgICBwcml2YXRlIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIC8qKiBTdG9yZSBzZWxlY3RvciBmb3IgdGhlIEVudGl0eUNhY2hlICovXG4gICAgZW50aXR5Q2FjaGVTZWxlY3RvcjogRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAvKiogR2VuZXJhdGVzIGNvcnJlbGF0aW9uIGlkcyBmb3IgcXVlcnkgYW5kIHNhdmUgbWV0aG9kcyAqL1xuICAgIHByaXZhdGUgY29ycmVsYXRpb25JZEdlbmVyYXRvcjogQ29ycmVsYXRpb25JZEdlbmVyYXRvclxuICApIHtcbiAgICB0aGlzLmd1YXJkID0gbmV3IEVudGl0eUFjdGlvbkd1YXJkKGVudGl0eU5hbWUsIHNlbGVjdElkKTtcbiAgICB0aGlzLnRvVXBkYXRlID0gdG9VcGRhdGVGYWN0b3J5PFQ+KHNlbGVjdElkKTtcblxuICAgIGNvbnN0IGNvbGxlY3Rpb25TZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgZW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAgIGNhY2hlID0+IGNhY2hlW2VudGl0eU5hbWVdIGFzIEVudGl0eUNvbGxlY3Rpb248VD5cbiAgICApO1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbiQgPSBzdG9yZS5zZWxlY3QoY29sbGVjdGlvblNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlPcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUVudGl0eUFjdGlvbjxQID0gYW55PihcbiAgICBlbnRpdHlPcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZSh7XG4gICAgICBlbnRpdHlOYW1lOiB0aGlzLmVudGl0eU5hbWUsXG4gICAgICBlbnRpdHlPcCxcbiAgICAgIGRhdGEsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKG9wLCBkYXRhLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBBY3Rpb24gdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gYWN0aW9uIHRoZSBBY3Rpb25cbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgQWN0aW9uXG4gICAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbik6IEFjdGlvbiB7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvLyAjcmVnaW9uIFF1ZXJ5IGFuZCBzYXZlIG9wZXJhdGlvbnNcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBhZGQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNBZGRcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICAgICAgZW50aXR5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKS5cbiAgICogV2lsbCBjYXVzZSBzYXZlIG9ic2VydmFibGUgdG8gZXJyb3Igd2l0aCBhIFBlcnNpc3RlbmNlQ2FuY2VsIGVycm9yLlxuICAgKiBDYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIHVuZG9pbmcgY2hhbmdlcyBpbiBjYWNoZSBmcm9tIHBlbmRpbmcgb3B0aW1pc3RpYyBzYXZlXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgRW50aXR5QWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWNvcnJlbGF0aW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBjb3JyZWxhdGlvbklkJyk7XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QsIHJlYXNvbiwgeyBjb3JyZWxhdGlvbklkIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgZW50aXR5IHRvIGRlbGV0ZVxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG4gIGRlbGV0ZShcbiAgICBhcmc6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljRGVsZXRlXG4gICAgKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleShhcmcpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICAgICAga2V5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5ndWFyZC5tdXN0QmVLZXkoYWN0aW9uKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxudW1iZXIgfCBzdHJpbmc+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIG1hcCgoKSA9PiBrZXkpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBtZXJnZSB0aGUgcXVlcmllZCBlbnRpdGllcyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzIHRoYXQgYXJlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3MgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGxvYWQoKVxuICAgKi9cbiAgZ2V0QWxsKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfQUxMLCBudWxsLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0eSB3aXRoIHRoaXMgcHJpbWFyeSBrZXkuXG4gICAqIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBlbnRpdHksXG4gICAqIG1lcmdlIGl0IGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRCeUtleShrZXk6IGFueSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfQllfS0VZLCBrZXksIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKFxuICAgICAgICAoW2VudGl0eSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlbnRpdHkpXSFcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXRpZXMgdGhhdCBzYXRpc2Z5IGEgcXVlcnkgZXhwcmVzc2VkXG4gICAqIHdpdGggZWl0aGVyIGEgcXVlcnkgcGFyYW1ldGVyIG1hcCBvciBhbiBIVFRQIFVSTCBxdWVyeSBzdHJpbmcsXG4gICAqIGFuZCBtZXJnZSB0aGUgcmVzdWx0cyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHF1ZXJ5UGFyYW1zIHRoZSBxdWVyeSBpbiBhIGZvcm0gdW5kZXJzdG9vZCBieSB0aGUgc2VydmVyXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllc1xuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICAgICAgcXVlcnlQYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfTE9BRCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSB1cGRhdGVkIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIC8vIHVwZGF0ZSBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgIC8vIHBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1VwZGF0ZVxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gICAgICB1cGRhdGUsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlKGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPj4oXG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWRcbiAgICApLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHVwZGF0ZSBlbnRpdHkgZGF0YSBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSB0aGUgaWQgY2hhbmdlZCBvciB0aGVyZSBhcmUgdW5zYXZlZCBjaGFuZ2VzLlxuICAgICAgbWFwKHVwZGF0ZURhdGEgPT4gdXBkYXRlRGF0YS5jaGFuZ2VzKSxcbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlIGFzIFQpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IG9yIGV4aXN0aW5nIGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogT25seSBkaXNwYXRjaCB0aGlzIGFjdGlvbiBpZiB5b3VyIHNlcnZlciBzdXBwb3J0cyB1cHNlcnQuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1Vwc2VydFxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkUsXG4gICAgICBlbnRpdHksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIFF1ZXJ5IGFuZCBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2VcblxuICAvLyBVbmd1YXJkZWQgZm9yIHBlcmZvcm1hbmNlLlxuICAvLyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiBydW5zIGEgZ3VhcmQgKHdoaWNoIHRocm93cylcbiAgLy8gRGV2ZWxvcGVyIHNob3VsZCB1bmRlcnN0YW5kIGNhY2hlLW9ubHkgbWV0aG9kcyB3ZWxsIGVub3VnaFxuICAvLyB0byBjYWxsIHRoZW0gd2l0aCB0aGUgcHJvcGVyIGVudGl0aWVzLlxuICAvLyBNYXkgcmVjb25zaWRlciBhbmQgYWRkIGd1YXJkcyBpbiBmdXR1cmUuXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIGFkZEFsbFRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9BTEwsIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfT05FLCBlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtdWx0aXBsZSBuZXcgZW50aXRpZXMgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aXRoIHByaW1hcnkga2V5cyBhbHJlYWR5IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKi9cbiAgYWRkTWFueVRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9NQU5ZLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfQUxMLCB1bmRlZmluZWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG4gIHJlbW92ZU9uZUZyb21DYWNoZShcbiAgICBhcmc6IChudW1iZXIgfCBzdHJpbmcpIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9PTkUsIHRoaXMuZ2V0S2V5KGFyZyksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAgYXJnczogKG51bWJlciB8IHN0cmluZylbXSB8IFRbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWFyZ3MgfHwgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qga2V5cyA9XG4gICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCdcbiAgICAgICAgPyAvLyBpZiBhcnJheVswXSBpcyBhIGtleSwgYXNzdW1lIHRoZXkncmUgYWxsIGtleXNcbiAgICAgICAgICAoPFRbXT5hcmdzKS5tYXAoYXJnID0+IHRoaXMuZ2V0S2V5KGFyZykpXG4gICAgICAgIDogYXJncztcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9NQU5ZLCBrZXlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhhdCBlbnRpdHkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggbWF0Y2hpbmcgcHJpbWFyeSBrZXkgaXMgbm90IGluIGNhY2hlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICovXG4gIHVwZGF0ZU9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIC8vIHVwZGF0ZSBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgIC8vIHBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICBjb25zdCB1cGRhdGU6IFVwZGF0ZTxUPiA9IHRoaXMudG9VcGRhdGUoZW50aXR5KTtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQREFURV9PTkUsIHVwZGF0ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoZXNlIGVudGl0aWVzIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aG9zZSBwcmltYXJ5IGtleXMgYXJlIG5vdCBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogVXBkYXRlIGVudGl0aWVzIG1heSBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogc3VjaCBwYXJ0aWFsIGVudGl0aWVzIHBhdGNoIHRoZWlyIGNhY2hlZCBjb3VudGVycGFydHMuXG4gICAqL1xuICB1cGRhdGVNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghZW50aXRpZXMgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHVwZGF0ZXM6IFVwZGF0ZTxUPltdID0gZW50aXRpZXMubWFwKGVudGl0eSA9PiB0aGlzLnRvVXBkYXRlKGVudGl0eSkpO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBEQVRFX01BTlksIHVwZGF0ZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogVXBzZXJ0IGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIFBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICovXG4gIHVwc2VydE9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBTRVJUX09ORSwgZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIHVwc2VydE1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdGllcyB8fCBlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUFNFUlRfTUFOWSwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGF0dGVybiB0aGF0IHRoZSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGFwcGxpZXNcbiAgICogd2hlbiB1c2luZyB0aGUgYGZpbHRlcmVkRW50aXRpZXNgIHNlbGVjdG9yLlxuICAgKi9cbiAgc2V0RmlsdGVyKHBhdHRlcm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0ZJTFRFUiwgcGF0dGVybik7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkZWQgZmxhZyAqL1xuICBzZXRMb2FkZWQoaXNMb2FkZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9MT0FERUQsICEhaXNMb2FkZWQpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGluZyBmbGFnICovXG4gIHNldExvYWRpbmcoaXNMb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfTE9BRElORywgISFpc0xvYWRpbmcpO1xuICB9XG4gIC8vICNlbmRyZWdpb24gQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZVxuXG4gIC8vICNyZWdpb24gcHJpdmF0ZSBoZWxwZXJzXG5cbiAgLyoqIEdldCBrZXkgZnJvbSBlbnRpdHkgKHVubGVzcyBhcmcgaXMgYWxyZWFkeSBhIGtleSkgKi9cbiAgcHJpdmF0ZSBnZXRLZXkoYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBUKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgICA/IHRoaXMuc2VsZWN0SWQoYXJnKVxuICAgICAgOiAoYXJnIGFzIG51bWJlciB8IHN0cmluZyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIE9ic2VydmFibGUgb2YgZGF0YSBmcm9tIHRoZSBzZXJ2ZXItc3VjY2VzcyBFbnRpdHlBY3Rpb24gd2l0aFxuICAgKiB0aGUgZ2l2ZW4gQ29ycmVsYXRpb24gSWQsIGFmdGVyIHRoYXQgYWN0aW9uIHdhcyBwcm9jZXNzZWQgYnkgdGhlIG5ncnggc3RvcmUuXG4gICAqIG9yIGVsc2UgcHV0IHRoZSBzZXJ2ZXIgZXJyb3Igb24gdGhlIE9ic2VydmFibGUgZXJyb3IgY2hhbm5lbC5cbiAgICogQHBhcmFtIGNyaWQgVGhlIGNvcnJlbGF0aW9uSWQgZm9yIGJvdGggdGhlIHNhdmUgYW5kIHJlc3BvbnNlIGFjdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIGdldFJlc3BvbnNlRGF0YSQ8RCA9IGFueT4oY3JpZDogYW55KTogT2JzZXJ2YWJsZTxEPiB7XG4gICAgLyoqXG4gICAgICogcmVkdWNlZEFjdGlvbnMkIG11c3QgYmUgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICAgKiBiZWNhdXNlIHRoZSByZXNwb25zZSBhY3Rpb24gbWlnaHQgaGF2ZSBiZWVuIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlXG4gICAgICogYmVmb3JlIGNhbGxlciBoYWQgYSBjaGFuY2UgdG8gc3Vic2NyaWJlLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLnJlZHVjZWRBY3Rpb25zJC5waXBlKFxuICAgICAgZmlsdGVyKChhY3Q6IGFueSkgPT4gISFhY3QucGF5bG9hZCksXG4gICAgICBmaWx0ZXIoKGFjdDogRW50aXR5QWN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29ycmVsYXRpb25JZCwgZW50aXR5TmFtZSwgZW50aXR5T3AgfSA9IGFjdC5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGVudGl0eU5hbWUgPT09IHRoaXMuZW50aXR5TmFtZSAmJlxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQgPT09IGNyaWQgJiZcbiAgICAgICAgICAoZW50aXR5T3AuZW5kc1dpdGgoT1BfU1VDQ0VTUykgfHxcbiAgICAgICAgICAgIGVudGl0eU9wLmVuZHNXaXRoKE9QX0VSUk9SKSB8fFxuICAgICAgICAgICAgZW50aXR5T3AgPT09IEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUKVxuICAgICAgICApO1xuICAgICAgfSksXG4gICAgICB0YWtlKDEpLFxuICAgICAgbWVyZ2VNYXAoYWN0ID0+IHtcbiAgICAgICAgY29uc3QgeyBlbnRpdHlPcCB9ID0gYWN0LnBheWxvYWQ7XG4gICAgICAgIHJldHVybiBlbnRpdHlPcCA9PT0gRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1RcbiAgICAgICAgICA/IHRocm93RXJyb3IobmV3IFBlcnNpc3RhbmNlQ2FuY2VsZWQoYWN0LnBheWxvYWQuZGF0YSkpXG4gICAgICAgICAgOiBlbnRpdHlPcC5lbmRzV2l0aChPUF9TVUNDRVNTKVxuICAgICAgICAgICAgPyBvZihhY3QucGF5bG9hZC5kYXRhIGFzIEQpXG4gICAgICAgICAgICA6IHRocm93RXJyb3IoYWN0LnBheWxvYWQuZGF0YS5lcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb25PcHRpb25zIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBjb3JyZWxhdGlvbklkID1cbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZCA9PSBudWxsXG4gICAgICAgID8gdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yLm5leHQoKVxuICAgICAgICA6IG9wdGlvbnMuY29ycmVsYXRpb25JZDtcbiAgICByZXR1cm4geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkIH07XG4gIH1cblxuICBwcml2YXRlIHNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zLFxuICAgIGRlZmF1bHRPcHRpbWlzbT86IGJvb2xlYW5cbiAgKTogRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID1cbiAgICAgIG9wdGlvbnMuaXNPcHRpbWlzdGljID09IG51bGxcbiAgICAgICAgPyBkZWZhdWx0T3B0aW1pc20gfHwgZmFsc2VcbiAgICAgICAgOiBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PT0gdHJ1ZTtcbiAgICByZXR1cm4geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHByaXZhdGUgaGVscGVyc1xufVxuIl19