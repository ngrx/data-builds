var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
var /**
 * Dispatches EntityCollection actions to their reducers and effects (default implementation).
 * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
 * @template T
 */
EntityDispatcherBase = /** @class */ (function () {
    function EntityDispatcherBase(entityName, entityActionFactory, store, selectId, defaultDispatcherOptions, reducedActions$, 
    /** Store selector for the EntityCache */
    entityCacheSelector, correlationIdGenerator) {
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
        /** @type {?} */
        var collectionSelector = createSelector(entityCacheSelector, (/**
         * @param {?} cache
         * @return {?}
         */
        function (cache) { return (/** @type {?} */ (cache[entityName])); }));
        this.entityCollection$ = store.select(collectionSelector);
    }
    /**
     * Create an {EntityAction} for this entity type.
     * @param entityOp {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the EntityAction
     */
    /**
     * Create an {EntityAction} for this entity type.
     * @template P
     * @param {?} entityOp {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the EntityAction
     */
    EntityDispatcherBase.prototype.createEntityAction = /**
     * Create an {EntityAction} for this entity type.
     * @template P
     * @param {?} entityOp {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the EntityAction
     */
    function (entityOp, data, options) {
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
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the dispatched EntityAction
     */
    EntityDispatcherBase.prototype.createAndDispatch = /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the dispatched EntityAction
     */
    function (op, data, options) {
        /** @type {?} */
        var action = this.createEntityAction(op, data, options);
        this.dispatch(action);
        return action;
    };
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    /**
     * Dispatch an Action to the store.
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    EntityDispatcherBase.prototype.dispatch = /**
     * Dispatch an Action to the store.
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    function (action) {
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
    // #region Query and save operations
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    EntityDispatcherBase.prototype.add = 
    // #region Query and save operations
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    function (entity, options) {
        var _this = this;
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.SAVE_ADD_ONE, entity, options);
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
        function (_a) {
            var _b = __read(_a, 2), e = _b[0], collection = _b[1];
            return (/** @type {?} */ (collection.entities[_this.selectId(e)]));
        })), shareReplay(1));
    };
    /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param correlationId The correlation id for the corresponding EntityAction
     * @param [reason] explains why canceled and by whom.
     */
    /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param {?} correlationId The correlation id for the corresponding EntityAction
     * @param {?=} reason
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.cancel = /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param {?} correlationId The correlation id for the corresponding EntityAction
     * @param {?=} reason
     * @param {?=} options
     * @return {?}
     */
    function (correlationId, reason, options) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId: correlationId });
    };
    /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.delete = /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    function (arg, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
        /** @type {?} */
        var key = this.getKey(arg);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.SAVE_DELETE_ONE, key, options);
        this.guard.mustBeKey(action);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(map((/**
         * @return {?}
         */
        function () { return key; })), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @returns A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     * @see load()
     */
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @see load()
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     */
    EntityDispatcherBase.prototype.getAll = /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @see load()
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     */
    function (options) {
        var _this = this;
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = __read(_a, 2), entities = _b[0], collection = _b[1];
            return entities.reduce((/**
             * @param {?} acc
             * @param {?} e
             * @return {?}
             */
            function (acc, e) {
                /** @type {?} */
                var entity = collection.entities[_this.selectId(e)];
                if (entity) {
                    acc.push(entity); // only return an entity found in the collection
                }
                return acc;
            }), (/** @type {?} */ ([])));
        })), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @returns A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param {?} key
     * @param {?=} options
     * @return {?} A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    EntityDispatcherBase.prototype.getByKey = /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param {?} key
     * @param {?=} options
     * @return {?} A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    function (key, options) {
        var _this = this;
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = __read(_a, 2), entity = _b[0], collection = _b[1];
            return (/** @type {?} */ (collection.entities[_this.selectId(entity)]));
        })), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param {?} queryParams the query in a form understood by the server
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    EntityDispatcherBase.prototype.getWithQuery = /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param {?} queryParams the query in a form understood by the server
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    function (queryParams, options) {
        var _this = this;
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = __read(_a, 2), entities = _b[0], collection = _b[1];
            return entities.reduce((/**
             * @param {?} acc
             * @param {?} e
             * @return {?}
             */
            function (acc, e) {
                /** @type {?} */
                var entity = collection.entities[_this.selectId(e)];
                if (entity) {
                    acc.push(entity); // only return an entity found in the collection
                }
                return acc;
            }), (/** @type {?} */ ([])));
        })), shareReplay(1));
    };
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @returns A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     * @see getAll
     */
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @see getAll
     * @param {?=} options
     * @return {?} A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     */
    EntityDispatcherBase.prototype.load = /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @see getAll
     * @param {?=} options
     * @return {?} A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     */
    function (options) {
        options = this.setQueryEntityActionOptions(options);
        /** @type {?} */
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
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity update entity, which might be a partial of T but must at least have its key.
     * @param {?=} options
     * @return {?} A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    EntityDispatcherBase.prototype.update = /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity update entity, which might be a partial of T but must at least have its key.
     * @param {?=} options
     * @return {?} A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    function (entity, options) {
        var _this = this;
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        /** @type {?} */
        var update = this.toUpdate(entity);
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.SAVE_UPDATE_ONE, update, options);
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
        function (updateData) { return updateData.changes; })), withLatestFrom(this.entityCollection$), map((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = __read(_a, 2), e = _b[0], collection = _b[1];
            return (/** @type {?} */ (collection.entities[_this.selectId((/** @type {?} */ (e)))]));
        })), shareReplay(1));
    };
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    EntityDispatcherBase.prototype.upsert = /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    function (entity, options) {
        var _this = this;
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
        /** @type {?} */
        var action = this.createEntityAction(EntityOp.SAVE_UPSERT_ONE, entity, options);
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
        function (_a) {
            var _b = __read(_a, 2), e = _b[0], collection = _b[1];
            return (/** @type {?} */ (collection.entities[_this.selectId(e)]));
        })), shareReplay(1));
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
    EntityDispatcherBase.prototype.addAllToCache = 
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
    function (entities, options) {
        this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
    };
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     */
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.addOneToCache = /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    function (entity, options) {
        this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
    };
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     */
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.addManyToCache = /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    function (entities, options) {
        this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
    };
    /** Clear the cached entity collection */
    /**
     * Clear the cached entity collection
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.clearCache = /**
     * Clear the cached entity collection
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        this.createAndDispatch(EntityOp.REMOVE_ALL, undefined, options);
    };
    /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.removeOneFromCache = /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    function (arg, options) {
        this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
    };
    /**
     * @param {?} args
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.removeManyFromCache = /**
     * @param {?} args
     * @param {?=} options
     * @return {?}
     */
    function (args, options) {
        var _this = this;
        if (!args || args.length === 0) {
            return;
        }
        /** @type {?} */
        var keys = typeof args[0] === 'object'
            ? // if array[0] is a key, assume they're all keys
                ((/** @type {?} */ (args))).map((/**
                 * @param {?} arg
                 * @return {?}
                 */
                function (arg) { return _this.getKey(arg); }))
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
    EntityDispatcherBase.prototype.updateOneInCache = /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    function (entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        /** @type {?} */
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
    EntityDispatcherBase.prototype.updateManyInCache = /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    function (entities, options) {
        var _this = this;
        if (!entities || entities.length === 0) {
            return;
        }
        /** @type {?} */
        var updates = entities.map((/**
         * @param {?} entity
         * @return {?}
         */
        function (entity) { return _this.toUpdate(entity); }));
        this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
    };
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     */
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.upsertOneInCache = /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    function (entity, options) {
        this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
    };
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     */
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.upsertManyInCache = /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    function (entities, options) {
        if (!entities || entities.length === 0) {
            return;
        }
        this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
    };
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     */
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     * @param {?} pattern
     * @return {?}
     */
    EntityDispatcherBase.prototype.setFilter = /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     * @param {?} pattern
     * @return {?}
     */
    function (pattern) {
        this.createAndDispatch(EntityOp.SET_FILTER, pattern);
    };
    /** Set the loaded flag */
    /**
     * Set the loaded flag
     * @param {?} isLoaded
     * @return {?}
     */
    EntityDispatcherBase.prototype.setLoaded = /**
     * Set the loaded flag
     * @param {?} isLoaded
     * @return {?}
     */
    function (isLoaded) {
        this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
    };
    /** Set the loading flag */
    /**
     * Set the loading flag
     * @param {?} isLoading
     * @return {?}
     */
    EntityDispatcherBase.prototype.setLoading = /**
     * Set the loading flag
     * @param {?} isLoading
     * @return {?}
     */
    function (isLoading) {
        this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
    };
    // #endregion Cache-only operations that do not update remote storage
    // #region private helpers
    /** Get key from entity (unless arg is already a key) */
    // #endregion Cache-only operations that do not update remote storage
    // #region private helpers
    /**
     * Get key from entity (unless arg is already a key)
     * @private
     * @param {?} arg
     * @return {?}
     */
    EntityDispatcherBase.prototype.getKey = 
    // #endregion Cache-only operations that do not update remote storage
    // #region private helpers
    /**
     * Get key from entity (unless arg is already a key)
     * @private
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        return typeof arg === 'object'
            ? this.selectId(arg)
            : ((/** @type {?} */ (arg)));
    };
    /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @private
     * @template D
     * @param {?} crid The correlationId for both the save and response actions.
     * @return {?}
     */
    EntityDispatcherBase.prototype.getResponseData$ = /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @private
     * @template D
     * @param {?} crid The correlationId for both the save and response actions.
     * @return {?}
     */
    function (crid) {
        var _this = this;
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((/**
         * @param {?} act
         * @return {?}
         */
        function (act) { return !!act.payload; })), filter((/**
         * @param {?} act
         * @return {?}
         */
        function (act) {
            var _a = act.payload, correlationId = _a.correlationId, entityName = _a.entityName, entityOp = _a.entityOp;
            return (entityName === _this.entityName &&
                correlationId === crid &&
                (entityOp.endsWith(OP_SUCCESS) ||
                    entityOp.endsWith(OP_ERROR) ||
                    entityOp === EntityOp.CANCEL_PERSIST));
        })), take(1), mergeMap((/**
         * @param {?} act
         * @return {?}
         */
        function (act) {
            var entityOp = act.payload.entityOp;
            return entityOp === EntityOp.CANCEL_PERSIST
                ? throwError(new PersistanceCanceled(act.payload.data))
                : entityOp.endsWith(OP_SUCCESS)
                    ? of((/** @type {?} */ (act.payload.data)))
                    : throwError(act.payload.data.error);
        })));
    };
    /**
     * @private
     * @param {?=} options
     * @return {?}
     */
    EntityDispatcherBase.prototype.setQueryEntityActionOptions = /**
     * @private
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        options = options || {};
        /** @type {?} */
        var correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        return __assign(__assign({}, options), { correlationId: correlationId });
    };
    /**
     * @private
     * @param {?=} options
     * @param {?=} defaultOptimism
     * @return {?}
     */
    EntityDispatcherBase.prototype.setSaveEntityActionOptions = /**
     * @private
     * @param {?=} options
     * @param {?=} defaultOptimism
     * @return {?}
     */
    function (options, defaultOptimism) {
        options = options || {};
        /** @type {?} */
        var correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        /** @type {?} */
        var isOptimistic = options.isOptimistic == null
            ? defaultOptimism || false
            : options.isOptimistic === true;
        return __assign(__assign({}, options), { correlationId: correlationId, isOptimistic: isOptimistic });
    };
    return EntityDispatcherBase;
}());
/**
 * Dispatches EntityCollection actions to their reducers and effects (default implementation).
 * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
 * @template T
 */
export { EntityDispatcherBase };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBVSxjQUFjLEVBQVMsTUFBTSxhQUFhLENBQUM7QUFHNUQsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUNMLE1BQU0sRUFDTixHQUFHLEVBQ0gsUUFBUSxFQUNSLFdBQVcsRUFDWCxjQUFjLEVBQ2QsSUFBSSxHQUNMLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEIsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUd0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUtuRSxPQUFPLEVBQW9CLG1CQUFtQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFNUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7OztBQVN0RTs7Ozs7O0lBWUUsOEJBRVMsVUFBa0IsRUFFbEIsbUJBQXdDLEVBRXhDLEtBQXlCLEVBRXpCLFFBQXlDLEVBS3hDLHdCQUF3RCxFQUV4RCxlQUFtQztJQUMzQyx5Q0FBeUM7SUFDekMsbUJBQXdDLEVBRWhDLHNCQUE4QztRQVgvQyx5QkFBQSxFQUFBLDBCQUF5QztRQU56QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBRWxCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFFeEMsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFFekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUM7UUFLeEMsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUFnQztRQUV4RCxvQkFBZSxHQUFm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NEI7Ozs7O0lBRTVCLGlEQUEyRDs7Ozs7O0lBTTNELHdDQUE0Qzs7Ozs7SUFJMUMsMENBQXlCOzs7OztJQUV6QixtREFBK0M7Ozs7O0lBRS9DLHFDQUFnQzs7Ozs7SUFFaEMsd0NBQWdEOzs7Ozs7O0lBS2hELHdEQUFnRTs7Ozs7O0lBRWhFLCtDQUEyQzs7Ozs7O0lBSTNDLHNEQUFzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiwgY3JlYXRlU2VsZWN0b3IsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbiAgc2hhcmVSZXBsYXksXG4gIHdpdGhMYXRlc3RGcm9tLFxuICB0YWtlLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkLCB0b1VwZGF0ZUZhY3RvcnkgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uLCBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25HdWFyZCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1ndWFyZCc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29tbWFuZHMgfSBmcm9tICcuL2VudGl0eS1jb21tYW5kcyc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyLCBQZXJzaXN0YW5jZUNhbmNlbGVkIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFbnRpdHlPcCwgT1BfRVJST1IsIE9QX1NVQ0NFU1MgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgRW50aXR5Q29sbGVjdGlvbiBhY3Rpb25zIHRvIHRoZWlyIHJlZHVjZXJzIGFuZCBlZmZlY3RzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKS5cbiAqIEFsbCBzYXZlIGNvbW1hbmRzIHJlbHkgb24gYW4gTmdyeCBFZmZlY3Qgc3VjaCBhcyBgRW50aXR5RWZmZWN0cy5wZXJzaXN0JGAuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyQmFzZTxUPiBpbXBsZW1lbnRzIEVudGl0eURpc3BhdGNoZXI8VD4ge1xuICAvKiogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLiovXG4gIGd1YXJkOiBFbnRpdHlBY3Rpb25HdWFyZDxUPjtcblxuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb24kOiBPYnNlcnZhYmxlPEVudGl0eUNvbGxlY3Rpb248VD4+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB3aGljaCBlbnRpdGllcyBhcmUgZGlzcGF0Y2hlZCAqL1xuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgLyoqIENyZWF0ZXMgYW4ge0VudGl0eUFjdGlvbn0gKi9cbiAgICBwdWJsaWMgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICAvKiogVGhlIHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHVibGljIHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT4sXG4gICAgLyoqIFJldHVybnMgdGhlIHByaW1hcnkga2V5IChpZCkgb2YgdGhpcyBlbnRpdHkgKi9cbiAgICBwdWJsaWMgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4gPSBkZWZhdWx0U2VsZWN0SWQsXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlciBvcHRpb25zIGNvbmZpZ3VyZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXNcbiAgICAgKiB3aGV0aGVyIGFkZCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAvKiogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLiAqL1xuICAgIHByaXZhdGUgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj4sXG4gICAgLyoqIFN0b3JlIHNlbGVjdG9yIGZvciB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBlbnRpdHlDYWNoZVNlbGVjdG9yOiBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgIC8qKiBHZW5lcmF0ZXMgY29ycmVsYXRpb24gaWRzIGZvciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzICovXG4gICAgcHJpdmF0ZSBjb3JyZWxhdGlvbklkR2VuZXJhdG9yOiBDb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICkge1xuICAgIHRoaXMuZ3VhcmQgPSBuZXcgRW50aXR5QWN0aW9uR3VhcmQoZW50aXR5TmFtZSwgc2VsZWN0SWQpO1xuICAgIHRoaXMudG9VcGRhdGUgPSB0b1VwZGF0ZUZhY3Rvcnk8VD4oc2VsZWN0SWQpO1xuXG4gICAgY29uc3QgY29sbGVjdGlvblNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBlbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgICAgY2FjaGUgPT4gY2FjaGVbZW50aXR5TmFtZV0gYXMgRW50aXR5Q29sbGVjdGlvbjxUPlxuICAgICk7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uJCA9IHN0b3JlLnNlbGVjdChjb2xsZWN0aW9uU2VsZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eU9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlRW50aXR5QWN0aW9uPFAgPSBhbnk+KFxuICAgIGVudGl0eU9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlKHtcbiAgICAgIGVudGl0eU5hbWU6IHRoaXMuZW50aXR5TmFtZSxcbiAgICAgIGVudGl0eU9wLFxuICAgICAgZGF0YSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlIGFuZFxuICAgKiBkaXNwYXRjaCBpdCBpbW1lZGlhdGVseSB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlQW5kRGlzcGF0Y2g8UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24ob3AsIGRhdGEsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIEFjdGlvbiB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBhY3Rpb24gdGhlIEFjdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBBY3Rpb25cbiAgICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogQWN0aW9uIHtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8vICNyZWdpb24gUXVlcnkgYW5kIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGFkZChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY0FkZFxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX0FERF9PTkUsXG4gICAgICBlbnRpdHksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gY2FuY2VsIHRoZSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gKHF1ZXJ5IG9yIHNhdmUpLlxuICAgKiBXaWxsIGNhdXNlIHNhdmUgb2JzZXJ2YWJsZSB0byBlcnJvciB3aXRoIGEgUGVyc2lzdGVuY2VDYW5jZWwgZXJyb3IuXG4gICAqIENhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgdW5kb2luZyBjaGFuZ2VzIGluIGNhY2hlIGZyb20gcGVuZGluZyBvcHRpbWlzdGljIHNhdmVcbiAgICogQHBhcmFtIGNvcnJlbGF0aW9uSWQgVGhlIGNvcnJlbGF0aW9uIGlkIGZvciB0aGUgY29ycmVzcG9uZGluZyBFbnRpdHlBY3Rpb25cbiAgICogQHBhcmFtIFtyZWFzb25dIGV4cGxhaW5zIHdoeSBjYW5jZWxlZCBhbmQgYnkgd2hvbS5cbiAgICovXG4gIGNhbmNlbChcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghY29ycmVsYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGNvcnJlbGF0aW9uSWQnKTtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVCwgcmVhc29uLCB7IGNvcnJlbGF0aW9uSWQgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZGVsZXRlZCBrZXlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgZGVsZXRlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBlbnRpdHkgdG8gZGVsZXRlXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZGVsZXRlZCBrZXlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgZGVsZXRlKFxuICAgIGtleTogbnVtYmVyIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcbiAgZGVsZXRlKFxuICAgIGFyZzogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNEZWxldGVcbiAgICApO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5KGFyZyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gICAgICBrZXksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmd1YXJkLm11c3RCZUtleShhY3Rpb24pO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPG51bWJlciB8IHN0cmluZz4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgbWFwKCgpID0+IGtleSksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIG1lcmdlIHRoZSBxdWVyaWVkIGVudGl0aWVzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXMgdGhhdCBhcmUgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2VzcyBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgbG9hZCgpXG4gICAqL1xuICBnZXRBbGwob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihFbnRpdHlPcC5RVUVSWV9BTEwsIG51bGwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFRbXT4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgaWRzIHRvIGdldCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgdGhleSBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyXG4gICAgICAvLyBiZWNhdXNlIG9mIHVuc2F2ZWQgY2hhbmdlcyAoZGVsZXRlcyBvciB1cGRhdGVzKS5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZW50aXRpZXMsIGNvbGxlY3Rpb25dKSA9PlxuICAgICAgICBlbnRpdGllcy5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgYWNjLnB1c2goZW50aXR5KTsgLy8gb25seSByZXR1cm4gYW4gZW50aXR5IGZvdW5kIGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgW10gYXMgVFtdXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXR5IHdpdGggdGhpcyBwcmltYXJ5IGtleS5cbiAgICogSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGVudGl0eSxcbiAgICogbWVyZ2UgaXQgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldEJ5S2V5KGtleTogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihFbnRpdHlPcC5RVUVSWV9CWV9LRVksIGtleSwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoXG4gICAgICAgIChbZW50aXR5LCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGVudGl0eSldIVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdGllcyB0aGF0IHNhdGlzZnkgYSBxdWVyeSBleHByZXNzZWRcbiAgICogd2l0aCBlaXRoZXIgYSBxdWVyeSBwYXJhbWV0ZXIgbWFwIG9yIGFuIEhUVFAgVVJMIHF1ZXJ5IHN0cmluZyxcbiAgICogYW5kIG1lcmdlIHRoZSByZXN1bHRzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gcXVlcnlQYXJhbXMgdGhlIHF1ZXJ5IGluIGEgZm9ybSB1bmRlcnN0b29kIGJ5IHRoZSBzZXJ2ZXJcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0V2l0aFF1ZXJ5KFxuICAgIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlFVRVJZX01BTlksXG4gICAgICBxdWVyeVBhcmFtcyxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFRbXT4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgaWRzIHRvIGdldCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgdGhleSBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyXG4gICAgICAvLyBiZWNhdXNlIG9mIHVuc2F2ZWQgY2hhbmdlcyAoZGVsZXRlcyBvciB1cGRhdGVzKS5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZW50aXRpZXMsIGNvbGxlY3Rpb25dKSA9PlxuICAgICAgICBlbnRpdGllcy5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgYWNjLnB1c2goZW50aXR5KTsgLy8gb25seSByZXR1cm4gYW4gZW50aXR5IGZvdW5kIGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgW10gYXMgVFtdXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIGNvbXBsZXRlbHkgcmVwbGFjZSB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gd2l0aCB0aGUgcXVlcmllZCBlbnRpdGllcy5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBnZXRBbGxcbiAgICovXG4gIGxvYWQob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihFbnRpdHlPcC5RVUVSWV9MT0FELCBudWxsLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSB0aGUgdXBkYXRlZCBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqIEBwYXJhbSBlbnRpdHkgdXBkYXRlIGVudGl0eSwgd2hpY2ggbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHVwZGF0ZWQgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMudG9VcGRhdGUoZW50aXR5KTtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljVXBkYXRlXG4gICAgKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORSxcbiAgICAgIHVwZGF0ZSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChvcHRpb25zLmlzT3B0aW1pc3RpYykge1xuICAgICAgdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGUoYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VXBkYXRlUmVzcG9uc2VEYXRhPFQ+PihcbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZFxuICAgICkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgdXBkYXRlIGVudGl0eSBkYXRhIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyXG4gICAgICAvLyBiZWNhdXNlIHRoZSBpZCBjaGFuZ2VkIG9yIHRoZXJlIGFyZSB1bnNhdmVkIGNoYW5nZXMuXG4gICAgICBtYXAodXBkYXRlRGF0YSA9PiB1cGRhdGVEYXRhLmNoYW5nZXMpLFxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUgYXMgVCldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBPbmx5IGRpc3BhdGNoIHRoaXMgYWN0aW9uIGlmIHlvdXIgc2VydmVyIHN1cHBvcnRzIHVwc2VydC5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBzZXJ0KGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljVXBzZXJ0XG4gICAgKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICAgIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbiAgICAgIGVudGl0eSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGlmIChvcHRpb25zLmlzT3B0aW1pc3RpYykge1xuICAgICAgdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VD4ob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgLy8gVXNlIHRoZSByZXR1cm5lZCBlbnRpdHkgZGF0YSdzIGlkIHRvIGdldCB0aGUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIGl0IG1pZ2h0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBlbnRpdHkgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5lbnRpdHlDb2xsZWN0aW9uJCksXG4gICAgICBtYXAoKFtlLCBjb2xsZWN0aW9uXSkgPT4gY29sbGVjdGlvbi5lbnRpdGllc1t0aGlzLnNlbGVjdElkKGUpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG4gIC8vICNlbmRyZWdpb24gUXVlcnkgYW5kIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZVxuXG4gIC8vIFVuZ3VhcmRlZCBmb3IgcGVyZm9ybWFuY2UuXG4gIC8vIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHJ1bnMgYSBndWFyZCAod2hpY2ggdGhyb3dzKVxuICAvLyBEZXZlbG9wZXIgc2hvdWxkIHVuZGVyc3RhbmQgY2FjaGUtb25seSBtZXRob2RzIHdlbGwgZW5vdWdoXG4gIC8vIHRvIGNhbGwgdGhlbSB3aXRoIHRoZSBwcm9wZXIgZW50aXRpZXMuXG4gIC8vIE1heSByZWNvbnNpZGVyIGFuZCBhZGQgZ3VhcmRzIGluIGZ1dHVyZS5cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKi9cbiAgYWRkQWxsVG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX0FMTCwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIHRoZSBzYW1lIHByaW1hcnkga2V5IGlzIGFscmVhZHkgaW4gY2FjaGUuXG4gICAqL1xuICBhZGRPbmVUb0NhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9PTkUsIGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIG5ldyBlbnRpdGllcyBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdpdGggcHJpbWFyeSBrZXlzIGFscmVhZHkgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqL1xuICBhZGRNYW55VG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQUREX01BTlksIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDbGVhciB0aGUgY2FjaGVkIGVudGl0eSBjb2xsZWN0aW9uICovXG4gIGNsZWFyQ2FjaGUob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9BTEwsIHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoa2V5OiBudW1iZXIgfCBzdHJpbmcsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcbiAgcmVtb3ZlT25lRnJvbUNhY2hlKFxuICAgIGFyZzogKG51bWJlciB8IHN0cmluZykgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX09ORSwgdGhpcy5nZXRLZXkoYXJnKSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgVFtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghYXJncyB8fCBhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBrZXlzID1cbiAgICAgIHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0J1xuICAgICAgICA/IC8vIGlmIGFycmF5WzBdIGlzIGEga2V5LCBhc3N1bWUgdGhleSdyZSBhbGwga2V5c1xuICAgICAgICAgICg8VFtdPmFyZ3MpLm1hcChhcmcgPT4gdGhpcy5nZXRLZXkoYXJnKSlcbiAgICAgICAgOiBhcmdzO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuUkVNT1ZFX01BTlksIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIGNvbnN0IHVwZGF0ZTogVXBkYXRlPFQ+ID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBEQVRFX09ORSwgdXBkYXRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhlc2UgZW50aXRpZXMgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdob3NlIHByaW1hcnkga2V5cyBhcmUgbm90IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBVcGRhdGUgZW50aXRpZXMgbWF5IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBzdWNoIHBhcnRpYWwgZW50aXRpZXMgcGF0Y2ggdGhlaXIgY2FjaGVkIGNvdW50ZXJwYXJ0cy5cbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdGllcyB8fCBlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdXBkYXRlczogVXBkYXRlPFQ+W10gPSBlbnRpdGllcy5tYXAoZW50aXR5ID0+IHRoaXMudG9VcGRhdGUoZW50aXR5KSk7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUERBVEVfTUFOWSwgdXBkYXRlcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogUGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgKi9cbiAgdXBzZXJ0T25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUFNFUlRfT05FLCBlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKi9cbiAgdXBzZXJ0TWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0aWVzIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQU0VSVF9NQU5ZLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYXR0ZXJuIHRoYXQgdGhlIGNvbGxlY3Rpb24ncyBmaWx0ZXIgYXBwbGllc1xuICAgKiB3aGVuIHVzaW5nIHRoZSBgZmlsdGVyZWRFbnRpdGllc2Agc2VsZWN0b3IuXG4gICAqL1xuICBzZXRGaWx0ZXIocGF0dGVybjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfRklMVEVSLCBwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRlZCBmbGFnICovXG4gIHNldExvYWRlZChpc0xvYWRlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0xPQURFRCwgISFpc0xvYWRlZCk7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkaW5nIGZsYWcgKi9cbiAgc2V0TG9hZGluZyhpc0xvYWRpbmc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9MT0FESU5HLCAhIWlzTG9hZGluZyk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlXG5cbiAgLy8gI3JlZ2lvbiBwcml2YXRlIGhlbHBlcnNcblxuICAvKiogR2V0IGtleSBmcm9tIGVudGl0eSAodW5sZXNzIGFyZyBpcyBhbHJlYWR5IGEga2V5KSAqL1xuICBwcml2YXRlIGdldEtleShhcmc6IG51bWJlciB8IHN0cmluZyB8IFQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAgID8gdGhpcy5zZWxlY3RJZChhcmcpXG4gICAgICA6IChhcmcgYXMgbnVtYmVyIHwgc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gT2JzZXJ2YWJsZSBvZiBkYXRhIGZyb20gdGhlIHNlcnZlci1zdWNjZXNzIEVudGl0eUFjdGlvbiB3aXRoXG4gICAqIHRoZSBnaXZlbiBDb3JyZWxhdGlvbiBJZCwgYWZ0ZXIgdGhhdCBhY3Rpb24gd2FzIHByb2Nlc3NlZCBieSB0aGUgbmdyeCBzdG9yZS5cbiAgICogb3IgZWxzZSBwdXQgdGhlIHNlcnZlciBlcnJvciBvbiB0aGUgT2JzZXJ2YWJsZSBlcnJvciBjaGFubmVsLlxuICAgKiBAcGFyYW0gY3JpZCBUaGUgY29ycmVsYXRpb25JZCBmb3IgYm90aCB0aGUgc2F2ZSBhbmQgcmVzcG9uc2UgYWN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgZ2V0UmVzcG9uc2VEYXRhJDxEID0gYW55PihjcmlkOiBhbnkpOiBPYnNlcnZhYmxlPEQ+IHtcbiAgICAvKipcbiAgICAgKiByZWR1Y2VkQWN0aW9ucyQgbXVzdCBiZSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgICAqIGJlY2F1c2UgdGhlIHJlc3BvbnNlIGFjdGlvbiBtaWdodCBoYXZlIGJlZW4gZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmVcbiAgICAgKiBiZWZvcmUgY2FsbGVyIGhhZCBhIGNoYW5jZSB0byBzdWJzY3JpYmUuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMucmVkdWNlZEFjdGlvbnMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGFjdDogYW55KSA9PiAhIWFjdC5wYXlsb2FkKSxcbiAgICAgIGZpbHRlcigoYWN0OiBFbnRpdHlBY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBlbnRpdHlOYW1lLCBlbnRpdHlPcCB9ID0gYWN0LnBheWxvYWQ7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgZW50aXR5TmFtZSA9PT0gdGhpcy5lbnRpdHlOYW1lICYmXG4gICAgICAgICAgY29ycmVsYXRpb25JZCA9PT0gY3JpZCAmJlxuICAgICAgICAgIChlbnRpdHlPcC5lbmRzV2l0aChPUF9TVUNDRVNTKSB8fFxuICAgICAgICAgICAgZW50aXR5T3AuZW5kc1dpdGgoT1BfRVJST1IpIHx8XG4gICAgICAgICAgICBlbnRpdHlPcCA9PT0gRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICAgIHRha2UoMSksXG4gICAgICBtZXJnZU1hcChhY3QgPT4ge1xuICAgICAgICBjb25zdCB7IGVudGl0eU9wIH0gPSBhY3QucGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIGVudGl0eU9wID09PSBFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVFxuICAgICAgICAgID8gdGhyb3dFcnJvcihuZXcgUGVyc2lzdGFuY2VDYW5jZWxlZChhY3QucGF5bG9hZC5kYXRhKSlcbiAgICAgICAgICA6IGVudGl0eU9wLmVuZHNXaXRoKE9QX1NVQ0NFU1MpXG4gICAgICAgICAgICA/IG9mKGFjdC5wYXlsb2FkLmRhdGEgYXMgRClcbiAgICAgICAgICAgIDogdGhyb3dFcnJvcihhY3QucGF5bG9hZC5kYXRhLmVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0UXVlcnlFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbk9wdGlvbnMge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIHJldHVybiB7IC4uLm9wdGlvbnMsIGNvcnJlbGF0aW9uSWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMsXG4gICAgZGVmYXVsdE9wdGltaXNtPzogYm9vbGVhblxuICApOiBFbnRpdHlBY3Rpb25PcHRpb25zIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBjb3JyZWxhdGlvbklkID1cbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZCA9PSBudWxsXG4gICAgICAgID8gdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yLm5leHQoKVxuICAgICAgICA6IG9wdGlvbnMuY29ycmVsYXRpb25JZDtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPVxuICAgICAgb3B0aW9ucy5pc09wdGltaXN0aWMgPT0gbnVsbFxuICAgICAgICA/IGRlZmF1bHRPcHRpbWlzbSB8fCBmYWxzZVxuICAgICAgICA6IG9wdGlvbnMuaXNPcHRpbWlzdGljID09PSB0cnVlO1xuICAgIHJldHVybiB7IC4uLm9wdGlvbnMsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYyB9O1xuICB9XG4gIC8vICNlbmRyZWdpb24gcHJpdmF0ZSBoZWxwZXJzXG59XG4iXX0=