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
     * \@params queryParams the query in a form understood by the server
     * @param {?} queryParams
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFVLGNBQWMsRUFBaUIsTUFBTSxhQUFhLENBQUM7QUFHcEUsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQW9CLE1BQU0sTUFBTSxDQUFDO0FBQ3BFLE9BQU8sRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLElBQUksR0FDTCxNQUFNLGdCQUFnQixDQUFDO0FBR3hCLE9BQU8sRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFLbkUsT0FBTyxFQUFvQixtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFTdEUsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7Ozs7Ozs7SUFZL0IsWUFFUyxVQUFrQixFQUVsQixtQkFBd0MsRUFFeEMsS0FBeUIsRUFFekIsV0FBMEIsZUFBZSxFQUt4Qyx3QkFBd0QsRUFFeEQsZUFBbUM7SUFDM0MseUNBQXlDO0lBQ3pDLG1CQUF3QyxFQUVoQyxzQkFBOEM7UUFqQi9DLGVBQVUsR0FBVixVQUFVLENBQVE7UUFFbEIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUV4QyxVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUV6QixhQUFRLEdBQVIsUUFBUSxDQUFpQztRQUt4Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWdDO1FBRXhELG9CQUFlLEdBQWYsZUFB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dGVudCI6WyJpbXBvcnQgeyBBY3Rpb24sIGNyZWF0ZVNlbGVjdG9yLCBzZWxlY3QsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbiAgc2hhcmVSZXBsYXksXG4gIHdpdGhMYXRlc3RGcm9tLFxuICB0YWtlLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkLCB0b1VwZGF0ZUZhY3RvcnkgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uLCBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25HdWFyZCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1ndWFyZCc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29tbWFuZHMgfSBmcm9tICcuL2VudGl0eS1jb21tYW5kcyc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyLCBQZXJzaXN0YW5jZUNhbmNlbGVkIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFbnRpdHlPcCwgT1BfRVJST1IsIE9QX1NVQ0NFU1MgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgRW50aXR5Q29sbGVjdGlvbiBhY3Rpb25zIHRvIHRoZWlyIHJlZHVjZXJzIGFuZCBlZmZlY3RzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKS5cbiAqIEFsbCBzYXZlIGNvbW1hbmRzIHJlbHkgb24gYW4gTmdyeCBFZmZlY3Qgc3VjaCBhcyBgRW50aXR5RWZmZWN0cy5wZXJzaXN0JGAuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyQmFzZTxUPiBpbXBsZW1lbnRzIEVudGl0eURpc3BhdGNoZXI8VD4ge1xuICAvKiogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLiovXG4gIGd1YXJkOiBFbnRpdHlBY3Rpb25HdWFyZDxUPjtcblxuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb24kOiBPYnNlcnZhYmxlPEVudGl0eUNvbGxlY3Rpb248VD4+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB3aGljaCBlbnRpdGllcyBhcmUgZGlzcGF0Y2hlZCAqL1xuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgLyoqIENyZWF0ZXMgYW4ge0VudGl0eUFjdGlvbn0gKi9cbiAgICBwdWJsaWMgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICAvKiogVGhlIHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHVibGljIHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT4sXG4gICAgLyoqIFJldHVybnMgdGhlIHByaW1hcnkga2V5IChpZCkgb2YgdGhpcyBlbnRpdHkgKi9cbiAgICBwdWJsaWMgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4gPSBkZWZhdWx0U2VsZWN0SWQsXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlciBvcHRpb25zIGNvbmZpZ3VyZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXNcbiAgICAgKiB3aGV0aGVyIGFkZCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAvKiogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLiAqL1xuICAgIHByaXZhdGUgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj4sXG4gICAgLyoqIFN0b3JlIHNlbGVjdG9yIGZvciB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBlbnRpdHlDYWNoZVNlbGVjdG9yOiBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgIC8qKiBHZW5lcmF0ZXMgY29ycmVsYXRpb24gaWRzIGZvciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzICovXG4gICAgcHJpdmF0ZSBjb3JyZWxhdGlvbklkR2VuZXJhdG9yOiBDb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICkge1xuICAgIHRoaXMuZ3VhcmQgPSBuZXcgRW50aXR5QWN0aW9uR3VhcmQoZW50aXR5TmFtZSwgc2VsZWN0SWQpO1xuICAgIHRoaXMudG9VcGRhdGUgPSB0b1VwZGF0ZUZhY3Rvcnk8VD4oc2VsZWN0SWQpO1xuXG4gICAgY29uc3QgY29sbGVjdGlvblNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBlbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgICAgY2FjaGUgPT4gY2FjaGVbZW50aXR5TmFtZV0gYXMgRW50aXR5Q29sbGVjdGlvbjxUPlxuICAgICk7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uJCA9IHN0b3JlLnNlbGVjdChjb2xsZWN0aW9uU2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eU9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlRW50aXR5QWN0aW9uPFAgPSBhbnk+KFxuICAgIGVudGl0eU9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlKHtcbiAgICAgIGVudGl0eU5hbWU6IHRoaXMuZW50aXR5TmFtZSxcbiAgICAgIGVudGl0eU9wLFxuICAgICAgZGF0YSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlIGFuZFxuICAgKiBkaXNwYXRjaCBpdCBpbW1lZGlhdGVseSB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlQW5kRGlzcGF0Y2g8UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24ob3AsIGRhdGEsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIEFjdGlvbiB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBhY3Rpb24gdGhlIEFjdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBBY3Rpb25cbiAgICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogQWN0aW9uIHtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8vICNyZWdpb24gUXVlcnkgYW5kIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGFkZChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY0FkZFxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX0FERF9PTkUsXG4gICAgICBlbnRpdHksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gY2FuY2VsIHRoZSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gKHF1ZXJ5IG9yIHNhdmUpLlxuICAgKiBXaWxsIGNhdXNlIHNhdmUgb2JzZXJ2YWJsZSB0byBlcnJvciB3aXRoIGEgUGVyc2lzdGVuY2VDYW5jZWwgZXJyb3IuXG4gICAqIENhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgdW5kb2luZyBjaGFuZ2VzIGluIGNhY2hlIGZyb20gcGVuZGluZyBvcHRpbWlzdGljIHNhdmVcbiAgICogQHBhcmFtIGNvcnJlbGF0aW9uSWQgVGhlIGNvcnJlbGF0aW9uIGlkIGZvciB0aGUgY29ycmVzcG9uZGluZyBFbnRpdHlBY3Rpb25cbiAgICogQHBhcmFtIFtyZWFzb25dIGV4cGxhaW5zIHdoeSBjYW5jZWxlZCBhbmQgYnkgd2hvbS5cbiAgICovXG4gIGNhbmNlbChcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghY29ycmVsYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGNvcnJlbGF0aW9uSWQnKTtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVCwgcmVhc29uLCB7IGNvcnJlbGF0aW9uSWQgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZGVsZXRlZCBrZXlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgZGVsZXRlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBlbnRpdHkgdG8gZGVsZXRlXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZGVsZXRlZCBrZXlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgZGVsZXRlKFxuICAgIGtleTogbnVtYmVyIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcbiAgZGVsZXRlKFxuICAgIGFyZzogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNEZWxldGVcbiAgICApO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5KGFyZyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gICAgICBrZXksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmd1YXJkLm11c3RCZUtleShhY3Rpb24pO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPG51bWJlciB8IHN0cmluZz4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgbWFwKCgpID0+IGtleSksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIG1lcmdlIHRoZSBxdWVyaWVkIGVudGl0aWVzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXMgdGhhdCBhcmUgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2VzcyBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgbG9hZCgpXG4gICAqL1xuICBnZXRBbGwob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihFbnRpdHlPcC5RVUVSWV9BTEwsIG51bGwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFRbXT4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgaWRzIHRvIGdldCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgdGhleSBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyXG4gICAgICAvLyBiZWNhdXNlIG9mIHVuc2F2ZWQgY2hhbmdlcyAoZGVsZXRlcyBvciB1cGRhdGVzKS5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZW50aXRpZXMsIGNvbGxlY3Rpb25dKSA9PlxuICAgICAgICBlbnRpdGllcy5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgYWNjLnB1c2goZW50aXR5KTsgLy8gb25seSByZXR1cm4gYW4gZW50aXR5IGZvdW5kIGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgW10gYXMgVFtdXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXR5IHdpdGggdGhpcyBwcmltYXJ5IGtleS5cbiAgICogSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGVudGl0eSxcbiAgICogbWVyZ2UgaXQgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldEJ5S2V5KGtleTogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihFbnRpdHlPcC5RVUVSWV9CWV9LRVksIGtleSwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoXG4gICAgICAgIChbZW50aXR5LCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGVudGl0eSldIVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdGllcyB0aGF0IHNhdGlzZnkgYSBxdWVyeSBleHByZXNzZWRcbiAgICogd2l0aCBlaXRoZXIgYSBxdWVyeSBwYXJhbWV0ZXIgbWFwIG9yIGFuIEhUVFAgVVJMIHF1ZXJ5IHN0cmluZyxcbiAgICogYW5kIG1lcmdlIHRoZSByZXN1bHRzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW1zIHF1ZXJ5UGFyYW1zIHRoZSBxdWVyeSBpbiBhIGZvcm0gdW5kZXJzdG9vZCBieSB0aGUgc2VydmVyXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllc1xuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICAgICAgcXVlcnlQYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfTE9BRCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSB1cGRhdGVkIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIC8vIHVwZGF0ZSBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgIC8vIHBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1VwZGF0ZVxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gICAgICB1cGRhdGUsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbiBhcyBFbnRpdHlBY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxVcGRhdGVSZXNwb25zZURhdGE8VD4+KFxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkXG4gICAgKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSB1cGRhdGUgZW50aXR5IGRhdGEgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGlkIGNoYW5nZWQgb3IgdGhlcmUgYXJlIHVuc2F2ZWQgY2hhbmdlcy5cbiAgICAgIG1hcCh1cGRhdGVEYXRhID0+IHVwZGF0ZURhdGEuY2hhbmdlcyksXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSBhcyBUKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIE9ubHkgZGlzcGF0Y2ggdGhpcyBhY3Rpb24gaWYgeW91ciBzZXJ2ZXIgc3VwcG9ydHMgdXBzZXJ0LlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cHNlcnQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNVcHNlcnRcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuICAgICAgZW50aXR5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBRdWVyeSBhbmQgc2F2ZSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlXG5cbiAgLy8gVW5ndWFyZGVkIGZvciBwZXJmb3JtYW5jZS5cbiAgLy8gRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gcnVucyBhIGd1YXJkICh3aGljaCB0aHJvd3MpXG4gIC8vIERldmVsb3BlciBzaG91bGQgdW5kZXJzdGFuZCBjYWNoZS1vbmx5IG1ldGhvZHMgd2VsbCBlbm91Z2hcbiAgLy8gdG8gY2FsbCB0aGVtIHdpdGggdGhlIHByb3BlciBlbnRpdGllcy5cbiAgLy8gTWF5IHJlY29uc2lkZXIgYW5kIGFkZCBndWFyZHMgaW4gZnV0dXJlLlxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICBhZGRBbGxUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfQUxMLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggdGhlIHNhbWUgcHJpbWFyeSBrZXkgaXMgYWxyZWFkeSBpbiBjYWNoZS5cbiAgICovXG4gIGFkZE9uZVRvQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX09ORSwgZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICovXG4gIGFkZE1hbnlUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfTUFOWSwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZShvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX0FMTCwgdW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShrZXk6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoXG4gICAgYXJnOiAobnVtYmVyIHwgc3RyaW5nKSB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfT05FLCB0aGlzLmdldEtleShhcmcpLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGFyZ3M6IChudW1iZXIgfCBzdHJpbmcpW10gfCBUW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFhcmdzIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGtleXMgPVxuICAgICAgdHlwZW9mIGFyZ3NbMF0gPT09ICdvYmplY3QnXG4gICAgICAgID8gLy8gaWYgYXJyYXlbMF0gaXMgYSBrZXksIGFzc3VtZSB0aGV5J3JlIGFsbCBrZXlzXG4gICAgICAgICAgKDxUW10+YXJncykubWFwKGFyZyA9PiB0aGlzLmdldEtleShhcmcpKVxuICAgICAgICA6IGFyZ3M7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfTUFOWSwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoYXQgZW50aXR5IGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIG1hdGNoaW5nIHByaW1hcnkga2V5IGlzIG5vdCBpbiBjYWNoZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqL1xuICB1cGRhdGVPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgY29uc3QgdXBkYXRlOiBVcGRhdGU8VD4gPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUERBVEVfT05FLCB1cGRhdGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGVzZSBlbnRpdGllcyBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2hvc2UgcHJpbWFyeSBrZXlzIGFyZSBub3QgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqIFVwZGF0ZSBlbnRpdGllcyBtYXkgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIHN1Y2ggcGFydGlhbCBlbnRpdGllcyBwYXRjaCB0aGVpciBjYWNoZWQgY291bnRlcnBhcnRzLlxuICAgKi9cbiAgdXBkYXRlTWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0aWVzIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB1cGRhdGVzOiBVcGRhdGU8VD5bXSA9IGVudGl0aWVzLm1hcChlbnRpdHkgPT4gdGhpcy50b1VwZGF0ZShlbnRpdHkpKTtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQREFURV9NQU5ZLCB1cGRhdGVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBQYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQU0VSVF9PTkUsIGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICB1cHNlcnRNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghZW50aXRpZXMgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBTRVJUX01BTlksIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9GSUxURVIsIHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfTE9BREVELCAhIWlzTG9hZGVkKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0xPQURJTkcsICEhaXNMb2FkaW5nKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2VcblxuICAvLyAjcmVnaW9uIHByaXZhdGUgaGVscGVyc1xuXG4gIC8qKiBHZXQga2V5IGZyb20gZW50aXR5ICh1bmxlc3MgYXJnIGlzIGFscmVhZHkgYSBrZXkpICovXG4gIHByaXZhdGUgZ2V0S2V5KGFyZzogbnVtYmVyIHwgc3RyaW5nIHwgVCkge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICAgPyB0aGlzLnNlbGVjdElkKGFyZylcbiAgICAgIDogKGFyZyBhcyBudW1iZXIgfCBzdHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBPYnNlcnZhYmxlIG9mIGRhdGEgZnJvbSB0aGUgc2VydmVyLXN1Y2Nlc3MgRW50aXR5QWN0aW9uIHdpdGhcbiAgICogdGhlIGdpdmVuIENvcnJlbGF0aW9uIElkLCBhZnRlciB0aGF0IGFjdGlvbiB3YXMgcHJvY2Vzc2VkIGJ5IHRoZSBuZ3J4IHN0b3JlLlxuICAgKiBvciBlbHNlIHB1dCB0aGUgc2VydmVyIGVycm9yIG9uIHRoZSBPYnNlcnZhYmxlIGVycm9yIGNoYW5uZWwuXG4gICAqIEBwYXJhbSBjcmlkIFRoZSBjb3JyZWxhdGlvbklkIGZvciBib3RoIHRoZSBzYXZlIGFuZCByZXNwb25zZSBhY3Rpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRSZXNwb25zZURhdGEkPEQgPSBhbnk+KGNyaWQ6IGFueSk6IE9ic2VydmFibGU8RD4ge1xuICAgIC8qKlxuICAgICAqIHJlZHVjZWRBY3Rpb25zJCBtdXN0IGJlIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAgICogYmVjYXVzZSB0aGUgcmVzcG9uc2UgYWN0aW9uIG1pZ2h0IGhhdmUgYmVlbiBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZVxuICAgICAqIGJlZm9yZSBjYWxsZXIgaGFkIGEgY2hhbmNlIHRvIHN1YnNjcmliZS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VkQWN0aW9ucyQucGlwZShcbiAgICAgIGZpbHRlcigoYWN0OiBhbnkpID0+ICEhYWN0LnBheWxvYWQpLFxuICAgICAgZmlsdGVyKChhY3Q6IEVudGl0eUFjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIGVudGl0eU5hbWUsIGVudGl0eU9wIH0gPSBhY3QucGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBlbnRpdHlOYW1lID09PSB0aGlzLmVudGl0eU5hbWUgJiZcbiAgICAgICAgICBjb3JyZWxhdGlvbklkID09PSBjcmlkICYmXG4gICAgICAgICAgKGVudGl0eU9wLmVuZHNXaXRoKE9QX1NVQ0NFU1MpIHx8XG4gICAgICAgICAgICBlbnRpdHlPcC5lbmRzV2l0aChPUF9FUlJPUikgfHxcbiAgICAgICAgICAgIGVudGl0eU9wID09PSBFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVClcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICAgdGFrZSgxKSxcbiAgICAgIG1lcmdlTWFwKGFjdCA9PiB7XG4gICAgICAgIGNvbnN0IHsgZW50aXR5T3AgfSA9IGFjdC5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gZW50aXR5T3AgPT09IEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUXG4gICAgICAgICAgPyB0aHJvd0Vycm9yKG5ldyBQZXJzaXN0YW5jZUNhbmNlbGVkKGFjdC5wYXlsb2FkLmRhdGEpKVxuICAgICAgICAgIDogZW50aXR5T3AuZW5kc1dpdGgoT1BfU1VDQ0VTUylcbiAgICAgICAgICAgID8gb2YoYWN0LnBheWxvYWQuZGF0YSBhcyBEKVxuICAgICAgICAgICAgOiB0aHJvd0Vycm9yKGFjdC5wYXlsb2FkLmRhdGEuZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyxcbiAgICBkZWZhdWx0T3B0aW1pc20/OiBib29sZWFuXG4gICk6IEVudGl0eUFjdGlvbk9wdGlvbnMge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9XG4gICAgICBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PSBudWxsXG4gICAgICAgID8gZGVmYXVsdE9wdGltaXNtIHx8IGZhbHNlXG4gICAgICAgIDogb3B0aW9ucy5pc09wdGltaXN0aWMgPT09IHRydWU7XG4gICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBwcml2YXRlIGhlbHBlcnNcbn1cbiJdfQ==