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
//# sourceMappingURL=entity-dispatcher-base.js.map