/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * @template T
 */
export class EntityDispatcherBase {
    /**
     * @param {?} entityName
     * @param {?} entityActionFactory
     * @param {?} store
     * @param {?=} selectId
     * @param {?=} defaultDispatcherOptions
     * @param {?=} reducedActions$
     * @param {?=} entityCacheSelector
     * @param {?=} correlationIdGenerator
     */
    constructor(entityName, entityActionFactory, store, selectId = defaultSelectId, defaultDispatcherOptions, reducedActions$, 
    /** Store selector for the EntityCache */
    entityCacheSelector, correlationIdGenerator) {
        this.entityName = entityName;
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.selectId = selectId;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.reducedActions$ = reducedActions$;
        this.correlationIdGenerator = correlationIdGenerator;
        this.guard = new EntityActionGuard(entityName, selectId);
        this.toUpdate = toUpdateFactory(selectId);
        /** @type {?} */
        const collectionSelector = createSelector(entityCacheSelector, (/**
         * @param {?} cache
         * @return {?}
         */
        cache => (/** @type {?} */ (cache[entityName]))));
        this.entityCollection$ = store.select(collectionSelector);
    }
    /**
     * Create an {EntityAction} for this entity type.
     * @template P
     * @param {?} entityOp {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the EntityAction
     */
    createEntityAction(entityOp, data, options) {
        return this.entityActionFactory.create(Object.assign({ entityName: this.entityName, entityOp,
            data }, options));
    }
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the dispatched EntityAction
     */
    createAndDispatch(op, data, options) {
        /** @type {?} */
        const action = this.createEntityAction(op, data, options);
        this.dispatch(action);
        return action;
    }
    /**
     * Dispatch an Action to the store.
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    // #region Query and save operations
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    add(entity, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.SAVE_ADD_ONE, entity, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([e, collection]) => (/** @type {?} */ (collection.entities[this.selectId(e)])))), shareReplay(1));
    }
    /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param {?} correlationId The correlation id for the corresponding EntityAction
     * @param {?=} reason
     * @param {?=} options
     * @return {?}
     */
    cancel(correlationId, reason, options) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId });
    }
    /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    delete(arg, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
        /** @type {?} */
        const key = this.getKey(arg);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.SAVE_DELETE_ONE, key, options);
        this.guard.mustBeKey(action);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(map((/**
         * @return {?}
         */
        () => key)), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @see load()
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     */
    getAll(options) {
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([entities, collection]) => entities.reduce((/**
         * @param {?} acc
         * @param {?} e
         * @return {?}
         */
        (acc, e) => {
            /** @type {?} */
            const entity = collection.entities[this.selectId(e)];
            if (entity) {
                acc.push(entity); // only return an entity found in the collection
            }
            return acc;
        }), (/** @type {?} */ ([]))))), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param {?} key
     * @param {?=} options
     * @return {?} A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    getByKey(key, options) {
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([entity, collection]) => (/** @type {?} */ (collection.entities[this.selectId(entity)])))), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param {?} queryParams the query in a form understood by the server
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(queryParams, options) {
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([entities, collection]) => entities.reduce((/**
         * @param {?} acc
         * @param {?} e
         * @return {?}
         */
        (acc, e) => {
            /** @type {?} */
            const entity = collection.entities[this.selectId(e)];
            if (entity) {
                acc.push(entity); // only return an entity found in the collection
            }
            return acc;
        }), (/** @type {?} */ ([]))))), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @see getAll
     * @param {?=} options
     * @return {?} A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     */
    load(options) {
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.QUERY_LOAD, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity update entity, which might be a partial of T but must at least have its key.
     * @param {?=} options
     * @return {?} A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        /** @type {?} */
        const update = this.toUpdate(entity);
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.SAVE_UPDATE_ONE, update, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity((/** @type {?} */ (action)));
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the update entity data id to get the entity from the collection
        // as might be different from the entity returned from the server
        // because the id changed or there are unsaved changes.
        map((/**
         * @param {?} updateData
         * @return {?}
         */
        updateData => updateData.changes)), withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([e, collection]) => (/** @type {?} */ (collection.entities[this.selectId((/** @type {?} */ (e)))])))), shareReplay(1));
    }
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
        /** @type {?} */
        const action = this.createEntityAction(EntityOp.SAVE_UPSERT_ONE, entity, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([e, collection]) => (/** @type {?} */ (collection.entities[this.selectId(e)])))), shareReplay(1));
    }
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
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    addAllToCache(entities, options) {
        this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
    }
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    addOneToCache(entity, options) {
        this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
    }
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    addManyToCache(entities, options) {
        this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
    }
    /**
     * Clear the cached entity collection
     * @param {?=} options
     * @return {?}
     */
    clearCache(options) {
        this.createAndDispatch(EntityOp.REMOVE_ALL, undefined, options);
    }
    /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    removeOneFromCache(arg, options) {
        this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
    }
    /**
     * @param {?} args
     * @param {?=} options
     * @return {?}
     */
    removeManyFromCache(args, options) {
        if (!args || args.length === 0) {
            return;
        }
        /** @type {?} */
        const keys = typeof args[0] === 'object'
            ? // if array[0] is a key, assume they're all keys
                ((/** @type {?} */ (args))).map((/**
                 * @param {?} arg
                 * @return {?}
                 */
                arg => this.getKey(arg)))
            : args;
        this.createAndDispatch(EntityOp.REMOVE_MANY, keys, options);
    }
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    updateOneInCache(entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        /** @type {?} */
        const update = this.toUpdate(entity);
        this.createAndDispatch(EntityOp.UPDATE_ONE, update, options);
    }
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    updateManyInCache(entities, options) {
        if (!entities || entities.length === 0) {
            return;
        }
        /** @type {?} */
        const updates = entities.map((/**
         * @param {?} entity
         * @return {?}
         */
        entity => this.toUpdate(entity)));
        this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
    }
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    upsertOneInCache(entity, options) {
        this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
    }
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    upsertManyInCache(entities, options) {
        if (!entities || entities.length === 0) {
            return;
        }
        this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
    }
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     * @param {?} pattern
     * @return {?}
     */
    setFilter(pattern) {
        this.createAndDispatch(EntityOp.SET_FILTER, pattern);
    }
    /**
     * Set the loaded flag
     * @param {?} isLoaded
     * @return {?}
     */
    setLoaded(isLoaded) {
        this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
    }
    /**
     * Set the loading flag
     * @param {?} isLoading
     * @return {?}
     */
    setLoading(isLoading) {
        this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
    }
    // #endregion Cache-only operations that do not update remote storage
    // #region private helpers
    /**
     * Get key from entity (unless arg is already a key)
     * @private
     * @param {?} arg
     * @return {?}
     */
    getKey(arg) {
        return typeof arg === 'object'
            ? this.selectId(arg)
            : ((/** @type {?} */ (arg)));
    }
    /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @private
     * @template D
     * @param {?} crid The correlationId for both the save and response actions.
     * @return {?}
     */
    getResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((/**
         * @param {?} act
         * @return {?}
         */
        (act) => !!act.payload)), filter((/**
         * @param {?} act
         * @return {?}
         */
        (act) => {
            const { correlationId, entityName, entityOp } = act.payload;
            return (entityName === this.entityName &&
                correlationId === crid &&
                (entityOp.endsWith(OP_SUCCESS) ||
                    entityOp.endsWith(OP_ERROR) ||
                    entityOp === EntityOp.CANCEL_PERSIST));
        })), take(1), mergeMap((/**
         * @param {?} act
         * @return {?}
         */
        act => {
            const { entityOp } = act.payload;
            return entityOp === EntityOp.CANCEL_PERSIST
                ? throwError(new PersistanceCanceled(act.payload.data))
                : entityOp.endsWith(OP_SUCCESS)
                    ? of((/** @type {?} */ (act.payload.data)))
                    : throwError(act.payload.data.error);
        })));
    }
    /**
     * @private
     * @param {?=} options
     * @return {?}
     */
    setQueryEntityActionOptions(options) {
        options = options || {};
        /** @type {?} */
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        return Object.assign({}, options, { correlationId });
    }
    /**
     * @private
     * @param {?=} options
     * @param {?=} defaultOptimism
     * @return {?}
     */
    setSaveEntityActionOptions(options, defaultOptimism) {
        options = options || {};
        /** @type {?} */
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        /** @type {?} */
        const isOptimistic = options.isOptimistic == null
            ? defaultOptimism || false
            : options.isOptimistic === true;
        return Object.assign({}, options, { correlationId, isOptimistic });
    }
}
if (false) {
    /**
     * Utility class with methods to validate EntityAction payloads.
     * @type {?}
     */
    EntityDispatcherBase.prototype.guard;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherBase.prototype.entityCollection$;
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `update...` and `upsert...` methods take `Update<T>` args
     * @type {?}
     */
    EntityDispatcherBase.prototype.toUpdate;
    /**
     * Name of the entity type for which entities are dispatched
     * @type {?}
     */
    EntityDispatcherBase.prototype.entityName;
    /**
     * Creates an {EntityAction}
     * @type {?}
     */
    EntityDispatcherBase.prototype.entityActionFactory;
    /**
     * The store, scoped to the EntityCache
     * @type {?}
     */
    EntityDispatcherBase.prototype.store;
    /**
     * Returns the primary key (id) of this entity
     * @type {?}
     */
    EntityDispatcherBase.prototype.selectId;
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     * @type {?}
     * @private
     */
    EntityDispatcherBase.prototype.defaultDispatcherOptions;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * @type {?}
     * @private
     */
    EntityDispatcherBase.prototype.reducedActions$;
    /**
     * Generates correlation ids for query and save methods
     * @type {?}
     * @private
     */
    EntityDispatcherBase.prototype.correlationIdGenerator;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFVLGNBQWMsRUFBaUIsTUFBTSxhQUFhLENBQUM7QUFHcEUsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQW9CLE1BQU0sTUFBTSxDQUFDO0FBQ3BFLE9BQU8sRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLElBQUksR0FDTCxNQUFNLGdCQUFnQixDQUFDO0FBR3hCLE9BQU8sRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFLbkUsT0FBTyxFQUFvQixtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFTdEUsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7Ozs7Ozs7SUFZL0IsWUFFUyxVQUFrQixFQUVsQixtQkFBd0MsRUFFeEMsS0FBeUIsRUFFekIsV0FBMEIsZUFBZSxFQUt4Qyx3QkFBd0QsRUFFeEQsZUFBbUM7SUFDM0MseUNBQXlDO0lBQ3pDLG1CQUF3QyxFQUVoQyxzQkFBOEM7UUFqQi9DLGVBQVUsR0FBVixVQUFVLENBQVE7UUFFbEIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUV4QyxVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUV6QixhQUFRLEdBQVIsUUFBUSxDQUFpQztRQUt4Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWdDO1FBRXhELG9CQUFlLEdBQWYsZUFB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ZW50IjpbImltcG9ydCB7IEFjdGlvbiwgY3JlYXRlU2VsZWN0b3IsIHNlbGVjdCwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgZmlsdGVyLFxuICBtYXAsXG4gIG1lcmdlTWFwLFxuICBzaGFyZVJlcGxheSxcbiAgd2l0aExhdGVzdEZyb20sXG4gIHRha2UsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQsIHRvVXBkYXRlRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkd1YXJkIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlU2VsZWN0b3IgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb21tYW5kcyB9IGZyb20gJy4vZW50aXR5LWNvbW1hbmRzJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIsIFBlcnNpc3RhbmNlQ2FuY2VsZWQgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IEVudGl0eU9wLCBPUF9FUlJPUiwgT1BfU1VDQ0VTUyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBFbnRpdHlDb2xsZWN0aW9uIGFjdGlvbnMgdG8gdGhlaXIgcmVkdWNlcnMgYW5kIGVmZmVjdHMgKGRlZmF1bHQgaW1wbGVtZW50YXRpb24pLlxuICogQWxsIHNhdmUgY29tbWFuZHMgcmVseSBvbiBhbiBOZ3J4IEVmZmVjdCBzdWNoIGFzIGBFbnRpdHlFZmZlY3RzLnBlcnNpc3QkYC5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eURpc3BhdGNoZXJCYXNlPFQ+IGltcGxlbWVudHMgRW50aXR5RGlzcGF0Y2hlcjxUPiB7XG4gIC8qKiBVdGlsaXR5IGNsYXNzIHdpdGggbWV0aG9kcyB0byB2YWxpZGF0ZSBFbnRpdHlBY3Rpb24gcGF5bG9hZHMuKi9cbiAgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuXG4gIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbjxUPj47XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmAgb2JqZWN0XG4gICAqIGB1cGRhdGUuLi5gIGFuZCBgdXBzZXJ0Li4uYCBtZXRob2RzIHRha2UgYFVwZGF0ZTxUPmAgYXJnc1xuICAgKi9cbiAgdG9VcGRhdGU6IChlbnRpdHk6IFBhcnRpYWw8VD4pID0+IFVwZGF0ZTxUPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHdoaWNoIGVudGl0aWVzIGFyZSBkaXNwYXRjaGVkICovXG4gICAgcHVibGljIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICAvKiogQ3JlYXRlcyBhbiB7RW50aXR5QWN0aW9ufSAqL1xuICAgIHB1YmxpYyBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIC8qKiBUaGUgc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBwdWJsaWMgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPixcbiAgICAvKiogUmV0dXJucyB0aGUgcHJpbWFyeSBrZXkgKGlkKSBvZiB0aGlzIGVudGl0eSAqL1xuICAgIHB1YmxpYyBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPiA9IGRlZmF1bHRTZWxlY3RJZCxcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaGVyIG9wdGlvbnMgY29uZmlndXJlIGRpc3BhdGNoZXIgYmVoYXZpb3Igc3VjaCBhc1xuICAgICAqIHdoZXRoZXIgYWRkIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWMgYnkgZGVmYXVsdC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRlZmF1bHREaXNwYXRjaGVyT3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIC8qKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuICovXG4gICAgcHJpdmF0ZSByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPixcbiAgICAvKiogU3RvcmUgc2VsZWN0b3IgZm9yIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIGVudGl0eUNhY2hlU2VsZWN0b3I6IEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgLyoqIEdlbmVyYXRlcyBjb3JyZWxhdGlvbiBpZHMgZm9yIHF1ZXJ5IGFuZCBzYXZlIG1ldGhvZHMgKi9cbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgKSB7XG4gICAgdGhpcy5ndWFyZCA9IG5ldyBFbnRpdHlBY3Rpb25HdWFyZChlbnRpdHlOYW1lLCBzZWxlY3RJZCk7XG4gICAgdGhpcy50b1VwZGF0ZSA9IHRvVXBkYXRlRmFjdG9yeTxUPihzZWxlY3RJZCk7XG5cbiAgICBjb25zdCBjb2xsZWN0aW9uU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIGVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgICBjYWNoZSA9PiBjYWNoZVtlbnRpdHlOYW1lXSBhcyBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICAgKTtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24kID0gc3RvcmUuc2VsZWN0KGNvbGxlY3Rpb25TZWxlY3Rvcik7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5T3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgZW50aXR5T3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgZW50aXR5TmFtZTogdGhpcy5lbnRpdHlOYW1lLFxuICAgICAgZW50aXR5T3AsXG4gICAgICBkYXRhLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUgYW5kXG4gICAqIGRpc3BhdGNoIGl0IGltbWVkaWF0ZWx5IHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVBbmREaXNwYXRjaDxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihvcCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gQWN0aW9uIHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBRdWVyeSBhbmQgc2F2ZSBvcGVyYXRpb25zXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljQWRkXG4gICAgKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgICAgIGVudGl0eSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChvcHRpb25zLmlzT3B0aW1pc3RpYykge1xuICAgICAgdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAocXVlcnkgb3Igc2F2ZSkuXG4gICAqIFdpbGwgY2F1c2Ugc2F2ZSBvYnNlcnZhYmxlIHRvIGVycm9yIHdpdGggYSBQZXJzaXN0ZW5jZUNhbmNlbCBlcnJvci5cbiAgICogQ2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciB1bmRvaW5nIGNoYW5nZXMgaW4gY2FjaGUgZnJvbSBwZW5kaW5nIG9wdGltaXN0aWMgc2F2ZVxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKi9cbiAgY2FuY2VsKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFjb3JyZWxhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgY29ycmVsYXRpb25JZCcpO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkNBTkNFTF9QRVJTSVNULCByZWFzb24sIHsgY29ycmVsYXRpb25JZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGVudGl0eSB0byBkZWxldGVcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuICBkZWxldGUoXG4gICAgYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY0RlbGV0ZVxuICAgICk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXkoYXJnKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORSxcbiAgICAgIGtleSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIHRoaXMuZ3VhcmQubXVzdEJlS2V5KGFjdGlvbik7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8bnVtYmVyIHwgc3RyaW5nPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBtYXAoKCkgPT4ga2V5KSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllcyB0aGF0IGFyZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBsb2FkKClcbiAgICovXG4gIGdldEFsbChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0FMTCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBpZHMgdG8gZ2V0IHRoZSBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2Ugb2YgdW5zYXZlZCBjaGFuZ2VzIChkZWxldGVzIG9yIHVwZGF0ZXMpLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlbnRpdGllcywgY29sbGVjdGlvbl0pID0+XG4gICAgICAgIGVudGl0aWVzLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICBhY2MucHVzaChlbnRpdHkpOyAvLyBvbmx5IHJldHVybiBhbiBlbnRpdHkgZm91bmQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXSBhcyBUW11cbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdHkgd2l0aCB0aGlzIHByaW1hcnkga2V5LlxuICAgKiBJZiB0aGUgc2VydmVyIHJldHVybnMgYW4gZW50aXR5LFxuICAgKiBtZXJnZSBpdCBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0QnlLZXkoa2V5OiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0JZX0tFWSwga2V5LCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcChcbiAgICAgICAgKFtlbnRpdHksIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZW50aXR5KV0hXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBxdWVyeVBhcmFtcyB0aGUgcXVlcnkgaW4gYSBmb3JtIHVuZGVyc3Rvb2QgYnkgdGhlIHNlcnZlclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgICAgIHF1ZXJ5UGFyYW1zLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBpZHMgdG8gZ2V0IHRoZSBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2Ugb2YgdW5zYXZlZCBjaGFuZ2VzIChkZWxldGVzIG9yIHVwZGF0ZXMpLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlbnRpdGllcywgY29sbGVjdGlvbl0pID0+XG4gICAgICAgIGVudGl0aWVzLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICBhY2MucHVzaChlbnRpdHkpOyAvLyBvbmx5IHJldHVybiBhbiBlbnRpdHkgZm91bmQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXSBhcyBUW11cbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogY29tcGxldGVseSByZXBsYWNlIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB3aXRoIHRoZSBxdWVyaWVkIGVudGl0aWVzLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGdldEFsbFxuICAgKi9cbiAgbG9hZChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0xPQUQsIG51bGwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFRbXT4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIHRoZSB1cGRhdGVkIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICogQHBhcmFtIGVudGl0eSB1cGRhdGUgZW50aXR5LCB3aGljaCBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgdXBkYXRlZCBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBkYXRlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNVcGRhdGVcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FLFxuICAgICAgdXBkYXRlLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24gYXMgRW50aXR5QWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VXBkYXRlUmVzcG9uc2VEYXRhPFQ+PihcbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZFxuICAgICkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgdXBkYXRlIGVudGl0eSBkYXRhIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyXG4gICAgICAvLyBiZWNhdXNlIHRoZSBpZCBjaGFuZ2VkIG9yIHRoZXJlIGFyZSB1bnNhdmVkIGNoYW5nZXMuXG4gICAgICBtYXAodXBkYXRlRGF0YSA9PiB1cGRhdGVEYXRhLmNoYW5nZXMpLFxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUgYXMgVCldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBPbmx5IGRpc3BhdGNoIHRoaXMgYWN0aW9uIGlmIHlvdXIgc2VydmVyIHN1cHBvcnRzIHVwc2VydC5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBzZXJ0KGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljVXBzZXJ0XG4gICAgKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbiAgICAgIGVudGl0eSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChvcHRpb25zLmlzT3B0aW1pc3RpYykge1xuICAgICAgdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG4gIC8vICNlbmRyZWdpb24gUXVlcnkgYW5kIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZVxuXG4gIC8vIFVuZ3VhcmRlZCBmb3IgcGVyZm9ybWFuY2UuXG4gIC8vIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHJ1bnMgYSBndWFyZCAod2hpY2ggdGhyb3dzKVxuICAvLyBEZXZlbG9wZXIgc2hvdWxkIHVuZGVyc3RhbmQgY2FjaGUtb25seSBtZXRob2RzIHdlbGwgZW5vdWdoXG4gIC8vIHRvIGNhbGwgdGhlbSB3aXRoIHRoZSBwcm9wZXIgZW50aXRpZXMuXG4gIC8vIE1heSByZWNvbnNpZGVyIGFuZCBhZGQgZ3VhcmRzIGluIGZ1dHVyZS5cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKi9cbiAgYWRkQWxsVG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX0FMTCwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIHRoZSBzYW1lIHByaW1hcnkga2V5IGlzIGFscmVhZHkgaW4gY2FjaGUuXG4gICAqL1xuICBhZGRPbmVUb0NhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9PTkUsIGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIG5ldyBlbnRpdGllcyBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdpdGggcHJpbWFyeSBrZXlzIGFscmVhZHkgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqL1xuICBhZGRNYW55VG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX01BTlksIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDbGVhciB0aGUgY2FjaGVkIGVudGl0eSBjb2xsZWN0aW9uICovXG4gIGNsZWFyQ2FjaGUob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9BTEwsIHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoa2V5OiBudW1iZXIgfCBzdHJpbmcsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcbiAgcmVtb3ZlT25lRnJvbUNhY2hlKFxuICAgIGFyZzogKG51bWJlciB8IHN0cmluZykgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX09ORSwgdGhpcy5nZXRLZXkoYXJnKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgVFtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghYXJncyB8fCBhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBrZXlzID1cbiAgICAgIHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0J1xuICAgICAgICA/IC8vIGlmIGFycmF5WzBdIGlzIGEga2V5LCBhc3N1bWUgdGhleSdyZSBhbGwga2V5c1xuICAgICAgICAgICg8VFtdPmFyZ3MpLm1hcChhcmcgPT4gdGhpcy5nZXRLZXkoYXJnKSlcbiAgICAgICAgOiBhcmdzO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX01BTlksIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIGNvbnN0IHVwZGF0ZTogVXBkYXRlPFQ+ID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBEQVRFX09ORSwgdXBkYXRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhlc2UgZW50aXRpZXMgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdob3NlIHByaW1hcnkga2V5cyBhcmUgbm90IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBVcGRhdGUgZW50aXRpZXMgbWF5IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBzdWNoIHBhcnRpYWwgZW50aXRpZXMgcGF0Y2ggdGhlaXIgY2FjaGVkIGNvdW50ZXJwYXJ0cy5cbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdGllcyB8fCBlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdXBkYXRlczogVXBkYXRlPFQ+W10gPSBlbnRpdGllcy5tYXAoZW50aXR5ID0+IHRoaXMudG9VcGRhdGUoZW50aXR5KSk7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUERBVEVfTUFOWSwgdXBkYXRlcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogUGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgKi9cbiAgdXBzZXJ0T25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUFNFUlRfT05FLCBlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKi9cbiAgdXBzZXJ0TWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0aWVzIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQU0VSVF9NQU5ZLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYXR0ZXJuIHRoYXQgdGhlIGNvbGxlY3Rpb24ncyBmaWx0ZXIgYXBwbGllc1xuICAgKiB3aGVuIHVzaW5nIHRoZSBgZmlsdGVyZWRFbnRpdGllc2Agc2VsZWN0b3IuXG4gICAqL1xuICBzZXRGaWx0ZXIocGF0dGVybjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfRklMVEVSLCBwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRlZCBmbGFnICovXG4gIHNldExvYWRlZChpc0xvYWRlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0xPQURFRCwgISFpc0xvYWRlZCk7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkaW5nIGZsYWcgKi9cbiAgc2V0TG9hZGluZyhpc0xvYWRpbmc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9MT0FESU5HLCAhIWlzTG9hZGluZyk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlXG5cbiAgLy8gI3JlZ2lvbiBwcml2YXRlIGhlbHBlcnNcblxuICAvKiogR2V0IGtleSBmcm9tIGVudGl0eSAodW5sZXNzIGFyZyBpcyBhbHJlYWR5IGEga2V5KSAqL1xuICBwcml2YXRlIGdldEtleShhcmc6IG51bWJlciB8IHN0cmluZyB8IFQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAgID8gdGhpcy5zZWxlY3RJZChhcmcpXG4gICAgICA6IChhcmcgYXMgbnVtYmVyIHwgc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gT2JzZXJ2YWJsZSBvZiBkYXRhIGZyb20gdGhlIHNlcnZlci1zdWNjZXNzIEVudGl0eUFjdGlvbiB3aXRoXG4gICAqIHRoZSBnaXZlbiBDb3JyZWxhdGlvbiBJZCwgYWZ0ZXIgdGhhdCBhY3Rpb24gd2FzIHByb2Nlc3NlZCBieSB0aGUgbmdyeCBzdG9yZS5cbiAgICogb3IgZWxzZSBwdXQgdGhlIHNlcnZlciBlcnJvciBvbiB0aGUgT2JzZXJ2YWJsZSBlcnJvciBjaGFubmVsLlxuICAgKiBAcGFyYW0gY3JpZCBUaGUgY29ycmVsYXRpb25JZCBmb3IgYm90aCB0aGUgc2F2ZSBhbmQgcmVzcG9uc2UgYWN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgZ2V0UmVzcG9uc2VEYXRhJDxEID0gYW55PihjcmlkOiBhbnkpOiBPYnNlcnZhYmxlPEQ+IHtcbiAgICAvKipcbiAgICAgKiByZWR1Y2VkQWN0aW9ucyQgbXVzdCBiZSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgICAqIGJlY2F1c2UgdGhlIHJlc3BvbnNlIGFjdGlvbiBtaWdodCBoYXZlIGJlZW4gZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmVcbiAgICAgKiBiZWZvcmUgY2FsbGVyIGhhZCBhIGNoYW5jZSB0byBzdWJzY3JpYmUuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMucmVkdWNlZEFjdGlvbnMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGFjdDogYW55KSA9PiAhIWFjdC5wYXlsb2FkKSxcbiAgICAgIGZpbHRlcigoYWN0OiBFbnRpdHlBY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9ID0gYWN0LnBheWxvYWQ7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgZW50aXR5TmFtZSA9PT0gdGhpcy5lbnRpdHlOYW1lICYmXG4gICAgICAgICAgY29ycmVsYXRpb25JZCA9PT0gY3JpZCAmJlxuICAgICAgICAgIChlbnRpdHlPcC5lbmRzV2l0aChPUF9TVUNDRVNTKSB8fFxuICAgICAgICAgICAgZW50aXR5T3AuZW5kc1dpdGgoT1BfRVJST1IpIHx8XG4gICAgICAgICAgICBlbnRpdHlPcCA9PT0gRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICAgIHRha2UoMSksXG4gICAgICBtZXJnZU1hcChhY3QgPT4ge1xuICAgICAgICBjb25zdCB7IGVudGl0eU9wIH0gPSBhY3QucGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIGVudGl0eU9wID09PSBFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVFxuICAgICAgICAgID8gdGhyb3dFcnJvcihuZXcgUGVyc2lzdGFuY2VDYW5jZWxlZChhY3QucGF5bG9hZC5kYXRhKSlcbiAgICAgICAgICA6IGVudGl0eU9wLmVuZHNXaXRoKE9QX1NVQ0NFU1MpXG4gICAgICAgICAgICA/IG9mKGFjdC5wYXlsb2FkLmRhdGEgYXMgRClcbiAgICAgICAgICAgIDogdGhyb3dFcnJvcihhY3QucGF5bG9hZC5kYXRhLmVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbk9wdGlvbnMge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIHJldHVybiB7IC4uLm9wdGlvbnMsIGNvcnJlbGF0aW9uSWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMsXG4gICAgZGVmYXVsdE9wdGltaXNtPzogYm9vbGVhblxuICApOiBFbnRpdHlBY3Rpb25PcHRpb25zIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBjb3JyZWxhdGlvbklkID1cbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZCA9PSBudWxsXG4gICAgICAgID8gdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yLm5leHQoKVxuICAgICAgICA6IG9wdGlvbnMuY29ycmVsYXRpb25JZDtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPVxuICAgICAgb3B0aW9ucy5pc09wdGltaXN0aWMgPT0gbnVsbFxuICAgICAgICA/IGRlZmF1bHRPcHRpbWlzbSB8fCBmYWxzZVxuICAgICAgICA6IG9wdGlvbnMuaXNPcHRpbWlzdGljID09PSB0cnVlO1xuICAgIHJldHVybiB7IC4uLm9wdGlvbnMsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYyB9O1xuICB9XG4gIC8vICNlbmRyZWdpb24gcHJpdmF0ZSBoZWxwZXJzXG59XG4iXX0=