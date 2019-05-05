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
            this.guard.mustBeEntity(action);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFVLGNBQWMsRUFBaUIsTUFBTSxhQUFhLENBQUM7QUFHcEUsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQW9CLE1BQU0sTUFBTSxDQUFDO0FBQ3BFLE9BQU8sRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLElBQUksR0FDTCxNQUFNLGdCQUFnQixDQUFDO0FBR3hCLE9BQU8sRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFLbkUsT0FBTyxFQUFvQixtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBS3RFOzs7R0FHRztBQUNIO0lBWUU7SUFDRSxnRUFBZ0U7SUFDekQsVUFBa0I7SUFDekIsZ0NBQWdDO0lBQ3pCLG1CQUF3QztJQUMvQywyQ0FBMkM7SUFDcEMsS0FBeUI7SUFDaEMsa0RBQWtEO0lBQzNDLFFBQXlDO0lBQ2hEOzs7T0FHRztJQUNLLHdCQUF3RDtJQUNoRSwwRUFBMEU7SUFDbEUsZUFBbUM7SUFDM0MseUNBQXlDO0lBQ3pDLG1CQUF3QztJQUN4QywyREFBMkQ7SUFDbkQsc0JBQThDO1FBWC9DLHlCQUFBLEVBQUEsMEJBQXlDO1FBTnpDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFFbEIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUV4QyxVQUFLLEdB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QUNFLE9BQTZCO1FBRTdCLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQU0sYUFBYSxHQUNqQixPQUFPLENBQUMsYUFBYSxJQUFJLElBQUk7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUU7WUFDcEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDNUIsNEJBQVksT0FBTyxJQUFFLGFBQWEsZUFBQSxJQUFHO0lBQ3ZDLENBQUM7SUFFTyx5REFBMEIsR0FBbEMsVUFDRSxPQUE2QixFQUM3QixlQUF5QjtRQUV6QixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFNLGFBQWEsR0FDakIsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFO1lBQ3BDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzVCLElBQU0sWUFBWSxHQUNoQixPQUFPLENBQUMsWUFBWSxJQUFJLElBQUk7WUFDMUIsQ0FBQyxDQUFDLGVBQWUsSUFBSSxLQUFLO1lBQzFCLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQztRQUNwQyw0QkFBWSxPQUFPLElBQUUsYUFBYSxlQUFBLEVBQUUsWUFBWSxjQUFBLElBQUc7SUFDckQsQ0FBQztJQUVILDJCQUFDO0FBQUQsQ0FBQyxBQXRsQkQsSUFzbEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uLCBjcmVhdGVTZWxlY3Rvciwgc2VsZWN0LCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yLCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHNoYXJlUmVwbGF5LFxuICB3aXRoTGF0ZXN0RnJvbSxcbiAgdGFrZSxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCwgdG9VcGRhdGVGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbW1hbmRzIH0gZnJvbSAnLi9lbnRpdHktY29tbWFuZHMnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciwgUGVyc2lzdGFuY2VDYW5jZWxlZCB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgRW50aXR5T3AsIE9QX0VSUk9SLCBPUF9TVUNDRVNTIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgUXVlcnlQYXJhbXMgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBEaXNwYXRjaGVzIEVudGl0eUNvbGxlY3Rpb24gYWN0aW9ucyB0byB0aGVpciByZWR1Y2VycyBhbmQgZWZmZWN0cyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbikuXG4gKiBBbGwgc2F2ZSBjb21tYW5kcyByZWx5IG9uIGFuIE5ncnggRWZmZWN0IHN1Y2ggYXMgYEVudGl0eUVmZmVjdHMucGVyc2lzdCRgLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5RGlzcGF0Y2hlckJhc2U8VD4gaW1wbGVtZW50cyBFbnRpdHlEaXNwYXRjaGVyPFQ+IHtcbiAgLyoqIFV0aWxpdHkgY2xhc3Mgd2l0aCBtZXRob2RzIHRvIHZhbGlkYXRlIEVudGl0eUFjdGlvbiBwYXlsb2Fkcy4qL1xuICBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG5cbiAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uJDogT2JzZXJ2YWJsZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YCBvYmplY3RcbiAgICogYHVwZGF0ZS4uLmAgYW5kIGB1cHNlcnQuLi5gIG1ldGhvZHMgdGFrZSBgVXBkYXRlPFQ+YCBhcmdzXG4gICAqL1xuICB0b1VwZGF0ZTogKGVudGl0eTogUGFydGlhbDxUPikgPT4gVXBkYXRlPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3Igd2hpY2ggZW50aXRpZXMgYXJlIGRpc3BhdGNoZWQgKi9cbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKiBDcmVhdGVzIGFuIHtFbnRpdHlBY3Rpb259ICovXG4gICAgcHVibGljIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgLyoqIFRoZSBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIHB1YmxpYyBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+LFxuICAgIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gICAgcHVibGljIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+ID0gZGVmYXVsdFNlbGVjdElkLFxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoZXIgb3B0aW9ucyBjb25maWd1cmUgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzXG4gICAgICogd2hldGhlciBhZGQgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYyBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIHByaXZhdGUgZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgLyoqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy4gKi9cbiAgICBwcml2YXRlIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIC8qKiBTdG9yZSBzZWxlY3RvciBmb3IgdGhlIEVudGl0eUNhY2hlICovXG4gICAgZW50aXR5Q2FjaGVTZWxlY3RvcjogRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAvKiogR2VuZXJhdGVzIGNvcnJlbGF0aW9uIGlkcyBmb3IgcXVlcnkgYW5kIHNhdmUgbWV0aG9kcyAqL1xuICAgIHByaXZhdGUgY29ycmVsYXRpb25JZEdlbmVyYXRvcjogQ29ycmVsYXRpb25JZEdlbmVyYXRvclxuICApIHtcbiAgICB0aGlzLmd1YXJkID0gbmV3IEVudGl0eUFjdGlvbkd1YXJkKGVudGl0eU5hbWUsIHNlbGVjdElkKTtcbiAgICB0aGlzLnRvVXBkYXRlID0gdG9VcGRhdGVGYWN0b3J5PFQ+KHNlbGVjdElkKTtcblxuICAgIGNvbnN0IGNvbGxlY3Rpb25TZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgZW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAgIGNhY2hlID0+IGNhY2hlW2VudGl0eU5hbWVdIGFzIEVudGl0eUNvbGxlY3Rpb248VD5cbiAgICApO1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbiQgPSBzdG9yZS5zZWxlY3QoY29sbGVjdGlvblNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlPcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUVudGl0eUFjdGlvbjxQID0gYW55PihcbiAgICBlbnRpdHlPcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZSh7XG4gICAgICBlbnRpdHlOYW1lOiB0aGlzLmVudGl0eU5hbWUsXG4gICAgICBlbnRpdHlPcCxcbiAgICAgIGRhdGEsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKG9wLCBkYXRhLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBBY3Rpb24gdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gYWN0aW9uIHRoZSBBY3Rpb25cbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgQWN0aW9uXG4gICAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbik6IEFjdGlvbiB7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvLyAjcmVnaW9uIFF1ZXJ5IGFuZCBzYXZlIG9wZXJhdGlvbnNcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBhZGQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNBZGRcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICAgICAgZW50aXR5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKS5cbiAgICogV2lsbCBjYXVzZSBzYXZlIG9ic2VydmFibGUgdG8gZXJyb3Igd2l0aCBhIFBlcnNpc3RlbmNlQ2FuY2VsIGVycm9yLlxuICAgKiBDYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIHVuZG9pbmcgY2hhbmdlcyBpbiBjYWNoZSBmcm9tIHBlbmRpbmcgb3B0aW1pc3RpYyBzYXZlXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgRW50aXR5QWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWNvcnJlbGF0aW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBjb3JyZWxhdGlvbklkJyk7XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QsIHJlYXNvbiwgeyBjb3JyZWxhdGlvbklkIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgZW50aXR5IHRvIGRlbGV0ZVxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG4gIGRlbGV0ZShcbiAgICBhcmc6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljRGVsZXRlXG4gICAgKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleShhcmcpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICAgICAga2V5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5ndWFyZC5tdXN0QmVLZXkoYWN0aW9uKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxudW1iZXIgfCBzdHJpbmc+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIG1hcCgoKSA9PiBrZXkpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBtZXJnZSB0aGUgcXVlcmllZCBlbnRpdGllcyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzIHRoYXQgYXJlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3MgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGxvYWQoKVxuICAgKi9cbiAgZ2V0QWxsKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfQUxMLCBudWxsLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0eSB3aXRoIHRoaXMgcHJpbWFyeSBrZXkuXG4gICAqIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBlbnRpdHksXG4gICAqIG1lcmdlIGl0IGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRCeUtleShrZXk6IGFueSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfQllfS0VZLCBrZXksIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKFxuICAgICAgICAoW2VudGl0eSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlbnRpdHkpXSFcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXRpZXMgdGhhdCBzYXRpc2Z5IGEgcXVlcnkgZXhwcmVzc2VkXG4gICAqIHdpdGggZWl0aGVyIGEgcXVlcnkgcGFyYW1ldGVyIG1hcCBvciBhbiBIVFRQIFVSTCBxdWVyeSBzdHJpbmcsXG4gICAqIGFuZCBtZXJnZSB0aGUgcmVzdWx0cyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHF1ZXJ5UGFyYW1zIHRoZSBxdWVyeSBpbiBhIGZvcm0gdW5kZXJzdG9vZCBieSB0aGUgc2VydmVyXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllc1xuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICAgICAgcXVlcnlQYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfTE9BRCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSB1cGRhdGVkIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIC8vIHVwZGF0ZSBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgIC8vIHBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1VwZGF0ZVxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gICAgICB1cGRhdGUsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbiBhcyBFbnRpdHlBY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxVcGRhdGVSZXNwb25zZURhdGE8VD4+KFxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkXG4gICAgKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSB1cGRhdGUgZW50aXR5IGRhdGEgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGlkIGNoYW5nZWQgb3IgdGhlcmUgYXJlIHVuc2F2ZWQgY2hhbmdlcy5cbiAgICAgIG1hcCh1cGRhdGVEYXRhID0+IHVwZGF0ZURhdGEuY2hhbmdlcyksXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSBhcyBUKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIE9ubHkgZGlzcGF0Y2ggdGhpcyBhY3Rpb24gaWYgeW91ciBzZXJ2ZXIgc3VwcG9ydHMgdXBzZXJ0LlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cHNlcnQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNVcHNlcnRcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuICAgICAgZW50aXR5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBRdWVyeSBhbmQgc2F2ZSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlXG5cbiAgLy8gVW5ndWFyZGVkIGZvciBwZXJmb3JtYW5jZS5cbiAgLy8gRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gcnVucyBhIGd1YXJkICh3aGljaCB0aHJvd3MpXG4gIC8vIERldmVsb3BlciBzaG91bGQgdW5kZXJzdGFuZCBjYWNoZS1vbmx5IG1ldGhvZHMgd2VsbCBlbm91Z2hcbiAgLy8gdG8gY2FsbCB0aGVtIHdpdGggdGhlIHByb3BlciBlbnRpdGllcy5cbiAgLy8gTWF5IHJlY29uc2lkZXIgYW5kIGFkZCBndWFyZHMgaW4gZnV0dXJlLlxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICBhZGRBbGxUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfQUxMLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggdGhlIHNhbWUgcHJpbWFyeSBrZXkgaXMgYWxyZWFkeSBpbiBjYWNoZS5cbiAgICovXG4gIGFkZE9uZVRvQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX09ORSwgZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICovXG4gIGFkZE1hbnlUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfTUFOWSwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZShvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX0FMTCwgdW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShrZXk6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoXG4gICAgYXJnOiAobnVtYmVyIHwgc3RyaW5nKSB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfT05FLCB0aGlzLmdldEtleShhcmcpLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGFyZ3M6IChudW1iZXIgfCBzdHJpbmcpW10gfCBUW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFhcmdzIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGtleXMgPVxuICAgICAgdHlwZW9mIGFyZ3NbMF0gPT09ICdvYmplY3QnXG4gICAgICAgID8gLy8gaWYgYXJyYXlbMF0gaXMgYSBrZXksIGFzc3VtZSB0aGV5J3JlIGFsbCBrZXlzXG4gICAgICAgICAgKDxUW10+YXJncykubWFwKGFyZyA9PiB0aGlzLmdldEtleShhcmcpKVxuICAgICAgICA6IGFyZ3M7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfTUFOWSwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoYXQgZW50aXR5IGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIG1hdGNoaW5nIHByaW1hcnkga2V5IGlzIG5vdCBpbiBjYWNoZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqL1xuICB1cGRhdGVPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgY29uc3QgdXBkYXRlOiBVcGRhdGU8VD4gPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUERBVEVfT05FLCB1cGRhdGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGVzZSBlbnRpdGllcyBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2hvc2UgcHJpbWFyeSBrZXlzIGFyZSBub3QgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqIFVwZGF0ZSBlbnRpdGllcyBtYXkgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIHN1Y2ggcGFydGlhbCBlbnRpdGllcyBwYXRjaCB0aGVpciBjYWNoZWQgY291bnRlcnBhcnRzLlxuICAgKi9cbiAgdXBkYXRlTWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0aWVzIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB1cGRhdGVzOiBVcGRhdGU8VD5bXSA9IGVudGl0aWVzLm1hcChlbnRpdHkgPT4gdGhpcy50b1VwZGF0ZShlbnRpdHkpKTtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQREFURV9NQU5ZLCB1cGRhdGVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBQYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQU0VSVF9PTkUsIGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICB1cHNlcnRNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghZW50aXRpZXMgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBTRVJUX01BTlksIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9GSUxURVIsIHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfTE9BREVELCAhIWlzTG9hZGVkKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0xPQURJTkcsICEhaXNMb2FkaW5nKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2VcblxuICAvLyAjcmVnaW9uIHByaXZhdGUgaGVscGVyc1xuXG4gIC8qKiBHZXQga2V5IGZyb20gZW50aXR5ICh1bmxlc3MgYXJnIGlzIGFscmVhZHkgYSBrZXkpICovXG4gIHByaXZhdGUgZ2V0S2V5KGFyZzogbnVtYmVyIHwgc3RyaW5nIHwgVCkge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICAgPyB0aGlzLnNlbGVjdElkKGFyZylcbiAgICAgIDogKGFyZyBhcyBudW1iZXIgfCBzdHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBPYnNlcnZhYmxlIG9mIGRhdGEgZnJvbSB0aGUgc2VydmVyLXN1Y2Nlc3MgRW50aXR5QWN0aW9uIHdpdGhcbiAgICogdGhlIGdpdmVuIENvcnJlbGF0aW9uIElkLCBhZnRlciB0aGF0IGFjdGlvbiB3YXMgcHJvY2Vzc2VkIGJ5IHRoZSBuZ3J4IHN0b3JlLlxuICAgKiBvciBlbHNlIHB1dCB0aGUgc2VydmVyIGVycm9yIG9uIHRoZSBPYnNlcnZhYmxlIGVycm9yIGNoYW5uZWwuXG4gICAqIEBwYXJhbSBjcmlkIFRoZSBjb3JyZWxhdGlvbklkIGZvciBib3RoIHRoZSBzYXZlIGFuZCByZXNwb25zZSBhY3Rpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRSZXNwb25zZURhdGEkPEQgPSBhbnk+KGNyaWQ6IGFueSk6IE9ic2VydmFibGU8RD4ge1xuICAgIC8qKlxuICAgICAqIHJlZHVjZWRBY3Rpb25zJCBtdXN0IGJlIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAgICogYmVjYXVzZSB0aGUgcmVzcG9uc2UgYWN0aW9uIG1pZ2h0IGhhdmUgYmVlbiBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZVxuICAgICAqIGJlZm9yZSBjYWxsZXIgaGFkIGEgY2hhbmNlIHRvIHN1YnNjcmliZS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VkQWN0aW9ucyQucGlwZShcbiAgICAgIGZpbHRlcigoYWN0OiBhbnkpID0+ICEhYWN0LnBheWxvYWQpLFxuICAgICAgZmlsdGVyKChhY3Q6IEVudGl0eUFjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIGVudGl0eU5hbWUsIGVudGl0eU9wIH0gPSBhY3QucGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBlbnRpdHlOYW1lID09PSB0aGlzLmVudGl0eU5hbWUgJiZcbiAgICAgICAgICBjb3JyZWxhdGlvbklkID09PSBjcmlkICYmXG4gICAgICAgICAgKGVudGl0eU9wLmVuZHNXaXRoKE9QX1NVQ0NFU1MpIHx8XG4gICAgICAgICAgICBlbnRpdHlPcC5lbmRzV2l0aChPUF9FUlJPUikgfHxcbiAgICAgICAgICAgIGVudGl0eU9wID09PSBFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVClcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICAgdGFrZSgxKSxcbiAgICAgIG1lcmdlTWFwKGFjdCA9PiB7XG4gICAgICAgIGNvbnN0IHsgZW50aXR5T3AgfSA9IGFjdC5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gZW50aXR5T3AgPT09IEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUXG4gICAgICAgICAgPyB0aHJvd0Vycm9yKG5ldyBQZXJzaXN0YW5jZUNhbmNlbGVkKGFjdC5wYXlsb2FkLmRhdGEpKVxuICAgICAgICAgIDogZW50aXR5T3AuZW5kc1dpdGgoT1BfU1VDQ0VTUylcbiAgICAgICAgICAgID8gb2YoYWN0LnBheWxvYWQuZGF0YSBhcyBEKVxuICAgICAgICAgICAgOiB0aHJvd0Vycm9yKGFjdC5wYXlsb2FkLmRhdGEuZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyxcbiAgICBkZWZhdWx0T3B0aW1pc20/OiBib29sZWFuXG4gICk6IEVudGl0eUFjdGlvbk9wdGlvbnMge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9XG4gICAgICBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PSBudWxsXG4gICAgICAgID8gZGVmYXVsdE9wdGltaXNtIHx8IGZhbHNlXG4gICAgICAgIDogb3B0aW9ucy5pc09wdGltaXN0aWMgPT09IHRydWU7XG4gICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBwcml2YXRlIGhlbHBlcnNcbn1cbiJdfQ==