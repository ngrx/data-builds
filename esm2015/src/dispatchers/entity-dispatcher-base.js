/**
 * @fileoverview added by tsickle
 * Generated from: src/dispatchers/entity-dispatcher-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        (cache) => (/** @type {?} */ (cache[entityName]))));
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
            this.guard.mustBeUpdate(action);
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
        (updateData) => updateData.changes)), withLatestFrom(this.entityCollection$), map((/**
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
                (arg) => this.getKey(arg)))
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
        (entity) => this.toUpdate(entity)));
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
        (act) => {
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
        return Object.assign(Object.assign({}, options), { correlationId });
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
        return Object.assign(Object.assign({}, options), { correlationId, isOptimistic });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBVSxjQUFjLEVBQVMsTUFBTSxhQUFhLENBQUM7QUFHNUQsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUNMLE1BQU0sRUFDTixHQUFHLEVBQ0gsUUFBUSxFQUNSLFdBQVcsRUFDWCxjQUFjLEVBQ2QsSUFBSSxHQUNMLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEIsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUd0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUtuRSxPQUFPLEVBQW9CLG1CQUFtQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFNUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7OztBQVN0RSxNQUFNLE9BQU8sb0JBQW9COzs7Ozs7Ozs7OztJQVkvQixZQUVTLFVBQWtCLEVBRWxCLG1CQUF3QyxFQUV4QyxLQUF5QixFQUV6QixXQUEwQixlQUFlLEVBS3hDLHdCQUF3RCxFQUV4RCxlQUFtQztJQUMzQyx5Q0FBeUM7SUFDekMsbUJBQXdDLEVBRWhDLHNCQUE4QztRQWpCL0MsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUVsQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBRXhDLFVBQUssR0FBTCxLQUFLLENBQW9CO1FBRXpCLGFBQVEsR0FBUixRQUFRLENBQWlDO1FBS3hDLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBZ0M7UUFFeEQsb0JBQWUsR0FBZixlQUFlLENB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiwgY3JlYXRlU2VsZWN0b3IsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbiAgc2hhcmVSZXBsYXksXG4gIHdpdGhMYXRlc3RGcm9tLFxuICB0YWtlLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkLCB0b1VwZGF0ZUZhY3RvcnkgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uLCBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25HdWFyZCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1ndWFyZCc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29tbWFuZHMgfSBmcm9tICcuL2VudGl0eS1jb21tYW5kcyc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyLCBQZXJzaXN0YW5jZUNhbmNlbGVkIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFbnRpdHlPcCwgT1BfRVJST1IsIE9QX1NVQ0NFU1MgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgRW50aXR5Q29sbGVjdGlvbiBhY3Rpb25zIHRvIHRoZWlyIHJlZHVjZXJzIGFuZCBlZmZlY3RzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKS5cbiAqIEFsbCBzYXZlIGNvbW1hbmRzIHJlbHkgb24gYW4gTmdyeCBFZmZlY3Qgc3VjaCBhcyBgRW50aXR5RWZmZWN0cy5wZXJzaXN0JGAuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyQmFzZTxUPiBpbXBsZW1lbnRzIEVudGl0eURpc3BhdGNoZXI8VD4ge1xuICAvKiogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLiovXG4gIGd1YXJkOiBFbnRpdHlBY3Rpb25HdWFyZDxUPjtcblxuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb24kOiBPYnNlcnZhYmxlPEVudGl0eUNvbGxlY3Rpb248VD4+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB3aGljaCBlbnRpdGllcyBhcmUgZGlzcGF0Y2hlZCAqL1xuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgLyoqIENyZWF0ZXMgYW4ge0VudGl0eUFjdGlvbn0gKi9cbiAgICBwdWJsaWMgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICAvKiogVGhlIHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHVibGljIHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT4sXG4gICAgLyoqIFJldHVybnMgdGhlIHByaW1hcnkga2V5IChpZCkgb2YgdGhpcyBlbnRpdHkgKi9cbiAgICBwdWJsaWMgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4gPSBkZWZhdWx0U2VsZWN0SWQsXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlciBvcHRpb25zIGNvbmZpZ3VyZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXNcbiAgICAgKiB3aGV0aGVyIGFkZCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAvKiogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLiAqL1xuICAgIHByaXZhdGUgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj4sXG4gICAgLyoqIFN0b3JlIHNlbGVjdG9yIGZvciB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBlbnRpdHlDYWNoZVNlbGVjdG9yOiBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgIC8qKiBHZW5lcmF0ZXMgY29ycmVsYXRpb24gaWRzIGZvciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzICovXG4gICAgcHJpdmF0ZSBjb3JyZWxhdGlvbklkR2VuZXJhdG9yOiBDb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICkge1xuICAgIHRoaXMuZ3VhcmQgPSBuZXcgRW50aXR5QWN0aW9uR3VhcmQoZW50aXR5TmFtZSwgc2VsZWN0SWQpO1xuICAgIHRoaXMudG9VcGRhdGUgPSB0b1VwZGF0ZUZhY3Rvcnk8VD4oc2VsZWN0SWQpO1xuXG4gICAgY29uc3QgY29sbGVjdGlvblNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBlbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgICAgKGNhY2hlKSA9PiBjYWNoZVtlbnRpdHlOYW1lXSBhcyBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICAgKTtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24kID0gc3RvcmUuc2VsZWN0KGNvbGxlY3Rpb25TZWxlY3Rvcik7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5T3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgZW50aXR5T3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgZW50aXR5TmFtZTogdGhpcy5lbnRpdHlOYW1lLFxuICAgICAgZW50aXR5T3AsXG4gICAgICBkYXRhLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUgYW5kXG4gICAqIGRpc3BhdGNoIGl0IGltbWVkaWF0ZWx5IHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVBbmREaXNwYXRjaDxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihvcCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gQWN0aW9uIHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBRdWVyeSBhbmQgc2F2ZSBvcGVyYXRpb25zXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljQWRkXG4gICAgKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgICAgIGVudGl0eSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChvcHRpb25zLmlzT3B0aW1pc3RpYykge1xuICAgICAgdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAocXVlcnkgb3Igc2F2ZSkuXG4gICAqIFdpbGwgY2F1c2Ugc2F2ZSBvYnNlcnZhYmxlIHRvIGVycm9yIHdpdGggYSBQZXJzaXN0ZW5jZUNhbmNlbCBlcnJvci5cbiAgICogQ2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciB1bmRvaW5nIGNoYW5nZXMgaW4gY2FjaGUgZnJvbSBwZW5kaW5nIG9wdGltaXN0aWMgc2F2ZVxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKi9cbiAgY2FuY2VsKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFjb3JyZWxhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgY29ycmVsYXRpb25JZCcpO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkNBTkNFTF9QRVJTSVNULCByZWFzb24sIHsgY29ycmVsYXRpb25JZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGVudGl0eSB0byBkZWxldGVcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuICBkZWxldGUoXG4gICAgYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY0RlbGV0ZVxuICAgICk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXkoYXJnKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORSxcbiAgICAgIGtleSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIHRoaXMuZ3VhcmQubXVzdEJlS2V5KGFjdGlvbik7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8bnVtYmVyIHwgc3RyaW5nPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBtYXAoKCkgPT4ga2V5KSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllcyB0aGF0IGFyZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBsb2FkKClcbiAgICovXG4gIGdldEFsbChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0FMTCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBpZHMgdG8gZ2V0IHRoZSBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2Ugb2YgdW5zYXZlZCBjaGFuZ2VzIChkZWxldGVzIG9yIHVwZGF0ZXMpLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlbnRpdGllcywgY29sbGVjdGlvbl0pID0+XG4gICAgICAgIGVudGl0aWVzLnJlZHVjZSgoYWNjLCBlKSA9PiB7XG4gICAgICAgICAgY29uc3QgZW50aXR5ID0gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXTtcbiAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICBhY2MucHVzaChlbnRpdHkpOyAvLyBvbmx5IHJldHVybiBhbiBlbnRpdHkgZm91bmQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10gYXMgVFtdKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdHkgd2l0aCB0aGlzIHByaW1hcnkga2V5LlxuICAgKiBJZiB0aGUgc2VydmVyIHJldHVybnMgYW4gZW50aXR5LFxuICAgKiBtZXJnZSBpdCBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0QnlLZXkoa2V5OiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0JZX0tFWSwga2V5LCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcChcbiAgICAgICAgKFtlbnRpdHksIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZW50aXR5KV0hXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBxdWVyeVBhcmFtcyB0aGUgcXVlcnkgaW4gYSBmb3JtIHVuZGVyc3Rvb2QgYnkgdGhlIHNlcnZlclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgICAgIHF1ZXJ5UGFyYW1zLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBpZHMgdG8gZ2V0IHRoZSBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2Ugb2YgdW5zYXZlZCBjaGFuZ2VzIChkZWxldGVzIG9yIHVwZGF0ZXMpLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlbnRpdGllcywgY29sbGVjdGlvbl0pID0+XG4gICAgICAgIGVudGl0aWVzLnJlZHVjZSgoYWNjLCBlKSA9PiB7XG4gICAgICAgICAgY29uc3QgZW50aXR5ID0gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXTtcbiAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICBhY2MucHVzaChlbnRpdHkpOyAvLyBvbmx5IHJldHVybiBhbiBlbnRpdHkgZm91bmQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10gYXMgVFtdKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogY29tcGxldGVseSByZXBsYWNlIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB3aXRoIHRoZSBxdWVyaWVkIGVudGl0aWVzLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGdldEFsbFxuICAgKi9cbiAgbG9hZChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKEVudGl0eU9wLlFVRVJZX0xPQUQsIG51bGwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFRbXT4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIHRoZSB1cGRhdGVkIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICogQHBhcmFtIGVudGl0eSB1cGRhdGUgZW50aXR5LCB3aGljaCBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgdXBkYXRlZCBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBkYXRlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNVcGRhdGVcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FLFxuICAgICAgdXBkYXRlLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxVcGRhdGVSZXNwb25zZURhdGE8VD4+KFxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkXG4gICAgKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSB1cGRhdGUgZW50aXR5IGRhdGEgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGlkIGNoYW5nZWQgb3IgdGhlcmUgYXJlIHVuc2F2ZWQgY2hhbmdlcy5cbiAgICAgIG1hcCgodXBkYXRlRGF0YSkgPT4gdXBkYXRlRGF0YS5jaGFuZ2VzKSxcbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlIGFzIFQpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IG9yIGV4aXN0aW5nIGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogT25seSBkaXNwYXRjaCB0aGlzIGFjdGlvbiBpZiB5b3VyIHNlcnZlciBzdXBwb3J0cyB1cHNlcnQuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1Vwc2VydFxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkUsXG4gICAgICBlbnRpdHksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIFF1ZXJ5IGFuZCBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2VcblxuICAvLyBVbmd1YXJkZWQgZm9yIHBlcmZvcm1hbmNlLlxuICAvLyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiBydW5zIGEgZ3VhcmQgKHdoaWNoIHRocm93cylcbiAgLy8gRGV2ZWxvcGVyIHNob3VsZCB1bmRlcnN0YW5kIGNhY2hlLW9ubHkgbWV0aG9kcyB3ZWxsIGVub3VnaFxuICAvLyB0byBjYWxsIHRoZW0gd2l0aCB0aGUgcHJvcGVyIGVudGl0aWVzLlxuICAvLyBNYXkgcmVjb25zaWRlciBhbmQgYWRkIGd1YXJkcyBpbiBmdXR1cmUuXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIGFkZEFsbFRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9BTEwsIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfT05FLCBlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtdWx0aXBsZSBuZXcgZW50aXRpZXMgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aXRoIHByaW1hcnkga2V5cyBhbHJlYWR5IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKi9cbiAgYWRkTWFueVRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9NQU5ZLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfQUxMLCB1bmRlZmluZWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG4gIHJlbW92ZU9uZUZyb21DYWNoZShcbiAgICBhcmc6IChudW1iZXIgfCBzdHJpbmcpIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9PTkUsIHRoaXMuZ2V0S2V5KGFyZyksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAgYXJnczogKG51bWJlciB8IHN0cmluZylbXSB8IFRbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWFyZ3MgfHwgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qga2V5cyA9XG4gICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCdcbiAgICAgICAgPyAvLyBpZiBhcnJheVswXSBpcyBhIGtleSwgYXNzdW1lIHRoZXkncmUgYWxsIGtleXNcbiAgICAgICAgICAoPFRbXT5hcmdzKS5tYXAoKGFyZykgPT4gdGhpcy5nZXRLZXkoYXJnKSlcbiAgICAgICAgOiBhcmdzO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX01BTlksIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIGNvbnN0IHVwZGF0ZTogVXBkYXRlPFQ+ID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBEQVRFX09ORSwgdXBkYXRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhlc2UgZW50aXRpZXMgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdob3NlIHByaW1hcnkga2V5cyBhcmUgbm90IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBVcGRhdGUgZW50aXRpZXMgbWF5IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBzdWNoIHBhcnRpYWwgZW50aXRpZXMgcGF0Y2ggdGhlaXIgY2FjaGVkIGNvdW50ZXJwYXJ0cy5cbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdGllcyB8fCBlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdXBkYXRlczogVXBkYXRlPFQ+W10gPSBlbnRpdGllcy5tYXAoKGVudGl0eSkgPT5cbiAgICAgIHRoaXMudG9VcGRhdGUoZW50aXR5KVxuICAgICk7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUERBVEVfTUFOWSwgdXBkYXRlcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogUGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgKi9cbiAgdXBzZXJ0T25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUFNFUlRfT05FLCBlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKi9cbiAgdXBzZXJ0TWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0aWVzIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQU0VSVF9NQU5ZLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYXR0ZXJuIHRoYXQgdGhlIGNvbGxlY3Rpb24ncyBmaWx0ZXIgYXBwbGllc1xuICAgKiB3aGVuIHVzaW5nIHRoZSBgZmlsdGVyZWRFbnRpdGllc2Agc2VsZWN0b3IuXG4gICAqL1xuICBzZXRGaWx0ZXIocGF0dGVybjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfRklMVEVSLCBwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRlZCBmbGFnICovXG4gIHNldExvYWRlZChpc0xvYWRlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0xPQURFRCwgISFpc0xvYWRlZCk7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkaW5nIGZsYWcgKi9cbiAgc2V0TG9hZGluZyhpc0xvYWRpbmc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9MT0FESU5HLCAhIWlzTG9hZGluZyk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlXG5cbiAgLy8gI3JlZ2lvbiBwcml2YXRlIGhlbHBlcnNcblxuICAvKiogR2V0IGtleSBmcm9tIGVudGl0eSAodW5sZXNzIGFyZyBpcyBhbHJlYWR5IGEga2V5KSAqL1xuICBwcml2YXRlIGdldEtleShhcmc6IG51bWJlciB8IHN0cmluZyB8IFQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAgID8gdGhpcy5zZWxlY3RJZChhcmcpXG4gICAgICA6IChhcmcgYXMgbnVtYmVyIHwgc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gT2JzZXJ2YWJsZSBvZiBkYXRhIGZyb20gdGhlIHNlcnZlci1zdWNjZXNzIEVudGl0eUFjdGlvbiB3aXRoXG4gICAqIHRoZSBnaXZlbiBDb3JyZWxhdGlvbiBJZCwgYWZ0ZXIgdGhhdCBhY3Rpb24gd2FzIHByb2Nlc3NlZCBieSB0aGUgbmdyeCBzdG9yZS5cbiAgICogb3IgZWxzZSBwdXQgdGhlIHNlcnZlciBlcnJvciBvbiB0aGUgT2JzZXJ2YWJsZSBlcnJvciBjaGFubmVsLlxuICAgKiBAcGFyYW0gY3JpZCBUaGUgY29ycmVsYXRpb25JZCBmb3IgYm90aCB0aGUgc2F2ZSBhbmQgcmVzcG9uc2UgYWN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgZ2V0UmVzcG9uc2VEYXRhJDxEID0gYW55PihjcmlkOiBhbnkpOiBPYnNlcnZhYmxlPEQ+IHtcbiAgICAvKipcbiAgICAgKiByZWR1Y2VkQWN0aW9ucyQgbXVzdCBiZSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgICAqIGJlY2F1c2UgdGhlIHJlc3BvbnNlIGFjdGlvbiBtaWdodCBoYXZlIGJlZW4gZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmVcbiAgICAgKiBiZWZvcmUgY2FsbGVyIGhhZCBhIGNoYW5jZSB0byBzdWJzY3JpYmUuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMucmVkdWNlZEFjdGlvbnMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGFjdDogYW55KSA9PiAhIWFjdC5wYXlsb2FkKSxcbiAgICAgIGZpbHRlcigoYWN0OiBFbnRpdHlBY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9ID0gYWN0LnBheWxvYWQ7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgZW50aXR5TmFtZSA9PT0gdGhpcy5lbnRpdHlOYW1lICYmXG4gICAgICAgICAgY29ycmVsYXRpb25JZCA9PT0gY3JpZCAmJlxuICAgICAgICAgIChlbnRpdHlPcC5lbmRzV2l0aChPUF9TVUNDRVNTKSB8fFxuICAgICAgICAgICAgZW50aXR5T3AuZW5kc1dpdGgoT1BfRVJST1IpIHx8XG4gICAgICAgICAgICBlbnRpdHlPcCA9PT0gRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICAgIHRha2UoMSksXG4gICAgICBtZXJnZU1hcCgoYWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgZW50aXR5T3AgfSA9IGFjdC5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gZW50aXR5T3AgPT09IEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUXG4gICAgICAgICAgPyB0aHJvd0Vycm9yKG5ldyBQZXJzaXN0YW5jZUNhbmNlbGVkKGFjdC5wYXlsb2FkLmRhdGEpKVxuICAgICAgICAgIDogZW50aXR5T3AuZW5kc1dpdGgoT1BfU1VDQ0VTUylcbiAgICAgICAgICA/IG9mKGFjdC5wYXlsb2FkLmRhdGEgYXMgRClcbiAgICAgICAgICA6IHRocm93RXJyb3IoYWN0LnBheWxvYWQuZGF0YS5lcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb25PcHRpb25zIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBjb3JyZWxhdGlvbklkID1cbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZCA9PSBudWxsXG4gICAgICAgID8gdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yLm5leHQoKVxuICAgICAgICA6IG9wdGlvbnMuY29ycmVsYXRpb25JZDtcbiAgICByZXR1cm4geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkIH07XG4gIH1cblxuICBwcml2YXRlIHNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zLFxuICAgIGRlZmF1bHRPcHRpbWlzbT86IGJvb2xlYW5cbiAgKTogRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID1cbiAgICAgIG9wdGlvbnMuaXNPcHRpbWlzdGljID09IG51bGxcbiAgICAgICAgPyBkZWZhdWx0T3B0aW1pc20gfHwgZmFsc2VcbiAgICAgICAgOiBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PT0gdHJ1ZTtcbiAgICByZXR1cm4geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHByaXZhdGUgaGVscGVyc1xufVxuIl19