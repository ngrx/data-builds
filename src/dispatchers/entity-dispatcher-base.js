(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dispatchers/entity-dispatcher-base", ["require", "exports", "@ngrx/store", "rxjs", "rxjs/operators", "@ngrx/data/src/utils/utilities", "@ngrx/data/src/actions/entity-action-guard", "@ngrx/data/src/dispatchers/entity-dispatcher", "@ngrx/data/src/actions/entity-op"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const store_1 = require("@ngrx/store");
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    const utilities_1 = require("@ngrx/data/src/utils/utilities");
    const entity_action_guard_1 = require("@ngrx/data/src/actions/entity-action-guard");
    const entity_dispatcher_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher");
    const entity_op_1 = require("@ngrx/data/src/actions/entity-op");
    /**
     * Dispatches EntityCollection actions to their reducers and effects (default implementation).
     * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
     */
    class EntityDispatcherBase {
        constructor(
        /** Name of the entity type for which entities are dispatched */
        entityName, 
        /** Creates an {EntityAction} */
        entityActionFactory, 
        /** The store, scoped to the EntityCache */
        store, 
        /** Returns the primary key (id) of this entity */
        selectId = utilities_1.defaultSelectId, 
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
            this.entityName = entityName;
            this.entityActionFactory = entityActionFactory;
            this.store = store;
            this.selectId = selectId;
            this.defaultDispatcherOptions = defaultDispatcherOptions;
            this.reducedActions$ = reducedActions$;
            this.correlationIdGenerator = correlationIdGenerator;
            this.guard = new entity_action_guard_1.EntityActionGuard(entityName, selectId);
            this.toUpdate = utilities_1.toUpdateFactory(selectId);
            const collectionSelector = store_1.createSelector(entityCacheSelector, cache => cache[entityName]);
            this.entityCollection$ = store.select(collectionSelector);
        }
        /**
         * Create an {EntityAction} for this entity type.
         * @param entityOp {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the EntityAction
         */
        createEntityAction(entityOp, data, options) {
            return this.entityActionFactory.create(Object.assign({ entityName: this.entityName, entityOp,
                data }, options));
        }
        /**
         * Create an {EntityAction} for this entity type and
         * dispatch it immediately to the store.
         * @param op {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the dispatched EntityAction
         */
        createAndDispatch(op, data, options) {
            const action = this.createEntityAction(op, data, options);
            this.dispatch(action);
            return action;
        }
        /**
         * Dispatch an Action to the store.
         * @param action the Action
         * @returns the dispatched Action
         */
        dispatch(action) {
            this.store.dispatch(action);
            return action;
        }
        // #region Query and save operations
        /**
         * Dispatch action to save a new entity to remote storage.
         * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @returns A terminating Observable of the entity
         * after server reports successful save or the save error.
         */
        add(entity, options) {
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
            const action = this.createEntityAction(entity_op_1.EntityOp.SAVE_ADD_ONE, entity, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators_1.withLatestFrom(this.entityCollection$), operators_1.map(([e, collection]) => collection.entities[this.selectId(e)]), operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to cancel the persistence operation (query or save).
         * Will cause save observable to error with a PersistenceCancel error.
         * Caller is responsible for undoing changes in cache from pending optimistic save
         * @param correlationId The correlation id for the corresponding EntityAction
         * @param [reason] explains why canceled and by whom.
         */
        cancel(correlationId, reason, options) {
            if (!correlationId) {
                throw new Error('Missing correlationId');
            }
            this.createAndDispatch(entity_op_1.EntityOp.CANCEL_PERSIST, reason, { correlationId });
        }
        delete(arg, options) {
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
            const key = this.getKey(arg);
            const action = this.createEntityAction(entity_op_1.EntityOp.SAVE_DELETE_ONE, key, options);
            this.guard.mustBeKey(action);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(operators_1.map(() => key), operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to query remote storage for all entities and
         * merge the queried entities into the cached collection.
         * @returns A terminating Observable of the queried entities that are in the collection
         * after server reports success query or the query error.
         * @see load()
         */
        getAll(options) {
            options = this.setQueryEntityActionOptions(options);
            const action = this.createEntityAction(entity_op_1.EntityOp.QUERY_ALL, null, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity ids to get the entities from the collection
            // as they might be different from the entities returned from the server
            // because of unsaved changes (deletes or updates).
            operators_1.withLatestFrom(this.entityCollection$), operators_1.map(([entities, collection]) => entities.reduce((acc, e) => {
                const entity = collection.entities[this.selectId(e)];
                if (entity) {
                    acc.push(entity); // only return an entity found in the collection
                }
                return acc;
            }, [])), operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to query remote storage for the entity with this primary key.
         * If the server returns an entity,
         * merge it into the cached collection.
         * @returns A terminating Observable of the collection
         * after server reports successful query or the query error.
         */
        getByKey(key, options) {
            options = this.setQueryEntityActionOptions(options);
            const action = this.createEntityAction(entity_op_1.EntityOp.QUERY_BY_KEY, key, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators_1.withLatestFrom(this.entityCollection$), operators_1.map(([entity, collection]) => collection.entities[this.selectId(entity)]), operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to query remote storage for the entities that satisfy a query expressed
         * with either a query parameter map or an HTTP URL query string,
         * and merge the results into the cached collection.
         * @param queryParams the query in a form understood by the server
         * @returns A terminating Observable of the queried entities
         * after server reports successful query or the query error.
         */
        getWithQuery(queryParams, options) {
            options = this.setQueryEntityActionOptions(options);
            const action = this.createEntityAction(entity_op_1.EntityOp.QUERY_MANY, queryParams, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity ids to get the entities from the collection
            // as they might be different from the entities returned from the server
            // because of unsaved changes (deletes or updates).
            operators_1.withLatestFrom(this.entityCollection$), operators_1.map(([entities, collection]) => entities.reduce((acc, e) => {
                const entity = collection.entities[this.selectId(e)];
                if (entity) {
                    acc.push(entity); // only return an entity found in the collection
                }
                return acc;
            }, [])), operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to query remote storage for all entities and
         * completely replace the cached collection with the queried entities.
         * @returns A terminating Observable of the entities in the collection
         * after server reports successful query or the query error.
         * @see getAll
         */
        load(options) {
            options = this.setQueryEntityActionOptions(options);
            const action = this.createEntityAction(entity_op_1.EntityOp.QUERY_LOAD, null, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to save the updated entity (or partial entity) in remote storage.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param entity update entity, which might be a partial of T but must at least have its key.
         * @returns A terminating Observable of the updated entity
         * after server reports successful save or the save error.
         */
        update(entity, options) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            const update = this.toUpdate(entity);
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
            const action = this.createEntityAction(entity_op_1.EntityOp.SAVE_UPDATE_ONE, update, options);
            if (options.isOptimistic) {
                this.guard.mustBeUpdate(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the update entity data id to get the entity from the collection
            // as might be different from the entity returned from the server
            // because the id changed or there are unsaved changes.
            operators_1.map(updateData => updateData.changes), operators_1.withLatestFrom(this.entityCollection$), operators_1.map(([e, collection]) => collection.entities[this.selectId(e)]), operators_1.shareReplay(1));
        }
        /**
         * Dispatch action to save a new or existing entity to remote storage.
         * Only dispatch this action if your server supports upsert.
         * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @returns A terminating Observable of the entity
         * after server reports successful save or the save error.
         */
        upsert(entity, options) {
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
            const action = this.createEntityAction(entity_op_1.EntityOp.SAVE_UPSERT_ONE, entity, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators_1.withLatestFrom(this.entityCollection$), operators_1.map(([e, collection]) => collection.entities[this.selectId(e)]), operators_1.shareReplay(1));
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
         */
        addAllToCache(entities, options) {
            this.createAndDispatch(entity_op_1.EntityOp.ADD_ALL, entities, options);
        }
        /**
         * Add a new entity directly to the cache.
         * Does not save to remote storage.
         * Ignored if an entity with the same primary key is already in cache.
         */
        addOneToCache(entity, options) {
            this.createAndDispatch(entity_op_1.EntityOp.ADD_ONE, entity, options);
        }
        /**
         * Add multiple new entities directly to the cache.
         * Does not save to remote storage.
         * Entities with primary keys already in cache are ignored.
         */
        addManyToCache(entities, options) {
            this.createAndDispatch(entity_op_1.EntityOp.ADD_MANY, entities, options);
        }
        /** Clear the cached entity collection */
        clearCache(options) {
            this.createAndDispatch(entity_op_1.EntityOp.REMOVE_ALL, undefined, options);
        }
        removeOneFromCache(arg, options) {
            this.createAndDispatch(entity_op_1.EntityOp.REMOVE_ONE, this.getKey(arg), options);
        }
        removeManyFromCache(args, options) {
            if (!args || args.length === 0) {
                return;
            }
            const keys = typeof args[0] === 'object'
                ? // if array[0] is a key, assume they're all keys
                    args.map(arg => this.getKey(arg))
                : args;
            this.createAndDispatch(entity_op_1.EntityOp.REMOVE_MANY, keys, options);
        }
        /**
         * Update a cached entity directly.
         * Does not update that entity in remote storage.
         * Ignored if an entity with matching primary key is not in cache.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         */
        updateOneInCache(entity, options) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            const update = this.toUpdate(entity);
            this.createAndDispatch(entity_op_1.EntityOp.UPDATE_ONE, update, options);
        }
        /**
         * Update multiple cached entities directly.
         * Does not update these entities in remote storage.
         * Entities whose primary keys are not in cache are ignored.
         * Update entities may be partial but must at least have their keys.
         * such partial entities patch their cached counterparts.
         */
        updateManyInCache(entities, options) {
            if (!entities || entities.length === 0) {
                return;
            }
            const updates = entities.map(entity => this.toUpdate(entity));
            this.createAndDispatch(entity_op_1.EntityOp.UPDATE_MANY, updates, options);
        }
        /**
         * Add or update a new entity directly to the cache.
         * Does not save to remote storage.
         * Upsert entity might be a partial of T but must at least have its key.
         * Pass the Update<T> structure as the payload
         */
        upsertOneInCache(entity, options) {
            this.createAndDispatch(entity_op_1.EntityOp.UPSERT_ONE, entity, options);
        }
        /**
         * Add or update multiple cached entities directly.
         * Does not save to remote storage.
         */
        upsertManyInCache(entities, options) {
            if (!entities || entities.length === 0) {
                return;
            }
            this.createAndDispatch(entity_op_1.EntityOp.UPSERT_MANY, entities, options);
        }
        /**
         * Set the pattern that the collection's filter applies
         * when using the `filteredEntities` selector.
         */
        setFilter(pattern) {
            this.createAndDispatch(entity_op_1.EntityOp.SET_FILTER, pattern);
        }
        /** Set the loaded flag */
        setLoaded(isLoaded) {
            this.createAndDispatch(entity_op_1.EntityOp.SET_LOADED, !!isLoaded);
        }
        /** Set the loading flag */
        setLoading(isLoading) {
            this.createAndDispatch(entity_op_1.EntityOp.SET_LOADING, !!isLoading);
        }
        // #endregion Cache-only operations that do not update remote storage
        // #region private helpers
        /** Get key from entity (unless arg is already a key) */
        getKey(arg) {
            return typeof arg === 'object'
                ? this.selectId(arg)
                : arg;
        }
        /**
         * Return Observable of data from the server-success EntityAction with
         * the given Correlation Id, after that action was processed by the ngrx store.
         * or else put the server error on the Observable error channel.
         * @param crid The correlationId for both the save and response actions.
         */
        getResponseData$(crid) {
            /**
             * reducedActions$ must be replay observable of the most recent action reduced by the store.
             * because the response action might have been dispatched to the store
             * before caller had a chance to subscribe.
             */
            return this.reducedActions$.pipe(operators_1.filter((act) => !!act.payload), operators_1.filter((act) => {
                const { correlationId, entityName, entityOp } = act.payload;
                return (entityName === this.entityName &&
                    correlationId === crid &&
                    (entityOp.endsWith(entity_op_1.OP_SUCCESS) ||
                        entityOp.endsWith(entity_op_1.OP_ERROR) ||
                        entityOp === entity_op_1.EntityOp.CANCEL_PERSIST));
            }), operators_1.take(1), operators_1.mergeMap(act => {
                const { entityOp } = act.payload;
                return entityOp === entity_op_1.EntityOp.CANCEL_PERSIST
                    ? rxjs_1.throwError(new entity_dispatcher_1.PersistanceCanceled(act.payload.data))
                    : entityOp.endsWith(entity_op_1.OP_SUCCESS)
                        ? rxjs_1.of(act.payload.data)
                        : rxjs_1.throwError(act.payload.data.error);
            }));
        }
        setQueryEntityActionOptions(options) {
            options = options || {};
            const correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            return Object.assign(Object.assign({}, options), { correlationId });
        }
        setSaveEntityActionOptions(options, defaultOptimism) {
            options = options || {};
            const correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            const isOptimistic = options.isOptimistic == null
                ? defaultOptimism || false
                : options.isOptimistic === true;
            return Object.assign(Object.assign({}, options), { correlationId, isOptimistic });
        }
    }
    exports.EntityDispatcherBase = EntityDispatcherBase;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLHVDQUE0RDtJQUc1RCwrQkFBa0Q7SUFDbEQsOENBT3dCO0lBR3hCLDhEQUFzRTtJQUd0RSxvRkFBbUU7SUFLbkUsb0ZBQTRFO0lBRTVFLGdFQUFzRTtJQUt0RTs7O09BR0c7SUFDSCxNQUFhLG9CQUFvQjtRQVkvQjtRQUNFLGdFQUFnRTtRQUN6RCxVQUFrQjtRQUN6QixnQ0FBZ0M7UUFDekIsbUJBQXdDO1FBQy9DLDJDQUEyQztRQUNwQyxLQUF5QjtRQUNoQyxrREFBa0Q7UUFDM0MsV0FBMEIsMkJBQWU7UUFDaEQ7OztXQUdHO1FBQ0ssd0JBQXdEO1FBQ2hFLDBFQUEwRTtRQUNsRSxlQUFtQztRQUMzQyx5Q0FBeUM7UUFDekMsbUJBQXdDO1FBQ3hDLDJEQUEyRDtRQUNuRCxzQkFBOEM7WUFqQi9DLGVBQVUsR0FBVixVQUFVLENBQVE7WUFFbEIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtZQUV4QyxVQUFLLEdBQUwsS0FBSyxDQUFvQjtZQUV6QixhQUFRLEdBQVIsUUFBUSxDQUFpQztZQUt4Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWdDO1lBRXhELG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtZQUluQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1lBRXRELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBZSxDQUFJLFFBQVEsQ0FBQyxDQUFDO1lBRTdDLE1BQU0sa0JBQWtCLEdBQUcsc0JBQWMsQ0FDdkMsbUJBQW1CLEVBQ25CLEtBQUss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bXBvcnQgeyBBY3Rpb24sIGNyZWF0ZVNlbGVjdG9yLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHNoYXJlUmVwbGF5LFxuICB3aXRoTGF0ZXN0RnJvbSxcbiAgdGFrZSxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCwgdG9VcGRhdGVGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbW1hbmRzIH0gZnJvbSAnLi9lbnRpdHktY29tbWFuZHMnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciwgUGVyc2lzdGFuY2VDYW5jZWxlZCB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgRW50aXR5T3AsIE9QX0VSUk9SLCBPUF9TVUNDRVNTIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgUXVlcnlQYXJhbXMgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBEaXNwYXRjaGVzIEVudGl0eUNvbGxlY3Rpb24gYWN0aW9ucyB0byB0aGVpciByZWR1Y2VycyBhbmQgZWZmZWN0cyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbikuXG4gKiBBbGwgc2F2ZSBjb21tYW5kcyByZWx5IG9uIGFuIE5ncnggRWZmZWN0IHN1Y2ggYXMgYEVudGl0eUVmZmVjdHMucGVyc2lzdCRgLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5RGlzcGF0Y2hlckJhc2U8VD4gaW1wbGVtZW50cyBFbnRpdHlEaXNwYXRjaGVyPFQ+IHtcbiAgLyoqIFV0aWxpdHkgY2xhc3Mgd2l0aCBtZXRob2RzIHRvIHZhbGlkYXRlIEVudGl0eUFjdGlvbiBwYXlsb2Fkcy4qL1xuICBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG5cbiAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uJDogT2JzZXJ2YWJsZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YCBvYmplY3RcbiAgICogYHVwZGF0ZS4uLmAgYW5kIGB1cHNlcnQuLi5gIG1ldGhvZHMgdGFrZSBgVXBkYXRlPFQ+YCBhcmdzXG4gICAqL1xuICB0b1VwZGF0ZTogKGVudGl0eTogUGFydGlhbDxUPikgPT4gVXBkYXRlPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3Igd2hpY2ggZW50aXRpZXMgYXJlIGRpc3BhdGNoZWQgKi9cbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKiBDcmVhdGVzIGFuIHtFbnRpdHlBY3Rpb259ICovXG4gICAgcHVibGljIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgLyoqIFRoZSBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIHB1YmxpYyBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+LFxuICAgIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gICAgcHVibGljIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+ID0gZGVmYXVsdFNlbGVjdElkLFxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoZXIgb3B0aW9ucyBjb25maWd1cmUgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzXG4gICAgICogd2hldGhlciBhZGQgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYyBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIHByaXZhdGUgZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgLyoqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy4gKi9cbiAgICBwcml2YXRlIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIC8qKiBTdG9yZSBzZWxlY3RvciBmb3IgdGhlIEVudGl0eUNhY2hlICovXG4gICAgZW50aXR5Q2FjaGVTZWxlY3RvcjogRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAvKiogR2VuZXJhdGVzIGNvcnJlbGF0aW9uIGlkcyBmb3IgcXVlcnkgYW5kIHNhdmUgbWV0aG9kcyAqL1xuICAgIHByaXZhdGUgY29ycmVsYXRpb25JZEdlbmVyYXRvcjogQ29ycmVsYXRpb25JZEdlbmVyYXRvclxuICApIHtcbiAgICB0aGlzLmd1YXJkID0gbmV3IEVudGl0eUFjdGlvbkd1YXJkKGVudGl0eU5hbWUsIHNlbGVjdElkKTtcbiAgICB0aGlzLnRvVXBkYXRlID0gdG9VcGRhdGVGYWN0b3J5PFQ+KHNlbGVjdElkKTtcblxuICAgIGNvbnN0IGNvbGxlY3Rpb25TZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgZW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAgIGNhY2hlID0+IGNhY2hlW2VudGl0eU5hbWVdIGFzIEVudGl0eUNvbGxlY3Rpb248VD5cbiAgICApO1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbiQgPSBzdG9yZS5zZWxlY3QoY29sbGVjdGlvblNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlPcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUVudGl0eUFjdGlvbjxQID0gYW55PihcbiAgICBlbnRpdHlPcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZSh7XG4gICAgICBlbnRpdHlOYW1lOiB0aGlzLmVudGl0eU5hbWUsXG4gICAgICBlbnRpdHlPcCxcbiAgICAgIGRhdGEsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKG9wLCBkYXRhLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBBY3Rpb24gdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gYWN0aW9uIHRoZSBBY3Rpb25cbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgQWN0aW9uXG4gICAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbik6IEFjdGlvbiB7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvLyAjcmVnaW9uIFF1ZXJ5IGFuZCBzYXZlIG9wZXJhdGlvbnNcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBhZGQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIG9wdGlvbnMgPSB0aGlzLnNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNBZGRcbiAgICApO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICAgICAgZW50aXR5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgaWYgKG9wdGlvbnMuaXNPcHRpbWlzdGljKSB7XG4gICAgICB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHJldHVybmVkIGVudGl0eSBkYXRhJ3MgaWQgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgLy8gYXMgaXQgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0eSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2UsIGNvbGxlY3Rpb25dKSA9PiBjb2xsZWN0aW9uLmVudGl0aWVzW3RoaXMuc2VsZWN0SWQoZSldISksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKS5cbiAgICogV2lsbCBjYXVzZSBzYXZlIG9ic2VydmFibGUgdG8gZXJyb3Igd2l0aCBhIFBlcnNpc3RlbmNlQ2FuY2VsIGVycm9yLlxuICAgKiBDYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIHVuZG9pbmcgY2hhbmdlcyBpbiBjYWNoZSBmcm9tIHBlbmRpbmcgb3B0aW1pc3RpYyBzYXZlXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgRW50aXR5QWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWNvcnJlbGF0aW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBjb3JyZWxhdGlvbklkJyk7XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QsIHJlYXNvbiwgeyBjb3JyZWxhdGlvbklkIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgZW50aXR5IHRvIGRlbGV0ZVxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG4gIGRlbGV0ZShcbiAgICBhcmc6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRTYXZlRW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljRGVsZXRlXG4gICAgKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleShhcmcpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgICAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICAgICAga2V5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5ndWFyZC5tdXN0QmVLZXkoYWN0aW9uKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxudW1iZXIgfCBzdHJpbmc+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIG1hcCgoKSA9PiBrZXkpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBtZXJnZSB0aGUgcXVlcmllZCBlbnRpdGllcyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzIHRoYXQgYXJlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3MgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGxvYWQoKVxuICAgKi9cbiAgZ2V0QWxsKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfQUxMLCBudWxsLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0eSB3aXRoIHRoaXMgcHJpbWFyeSBrZXkuXG4gICAqIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBlbnRpdHksXG4gICAqIG1lcmdlIGl0IGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRCeUtleShrZXk6IGFueSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfQllfS0VZLCBrZXksIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKFxuICAgICAgICAoW2VudGl0eSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlbnRpdHkpXSFcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXRpZXMgdGhhdCBzYXRpc2Z5IGEgcXVlcnkgZXhwcmVzc2VkXG4gICAqIHdpdGggZWl0aGVyIGEgcXVlcnkgcGFyYW1ldGVyIG1hcCBvciBhbiBIVFRQIFVSTCBxdWVyeSBzdHJpbmcsXG4gICAqIGFuZCBtZXJnZSB0aGUgcmVzdWx0cyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHF1ZXJ5UGFyYW1zIHRoZSBxdWVyeSBpbiBhIGZvcm0gdW5kZXJzdG9vZCBieSB0aGUgc2VydmVyXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllc1xuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICAgICAgcXVlcnlQYXJhbXMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzcG9uc2VEYXRhJDxUW10+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGlkcyB0byBnZXQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGVudGl0aWVzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSBvZiB1bnNhdmVkIGNoYW5nZXMgKGRlbGV0ZXMgb3IgdXBkYXRlcykuXG4gICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLmVudGl0eUNvbGxlY3Rpb24kKSxcbiAgICAgIG1hcCgoW2VudGl0aWVzLCBjb2xsZWN0aW9uXSkgPT5cbiAgICAgICAgZW50aXRpZXMucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV07XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIGFjYy5wdXNoKGVudGl0eSk7IC8vIG9ubHkgcmV0dXJuIGFuIGVudGl0eSBmb3VuZCBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdIGFzIFRbXVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRRdWVyeUVudGl0eUFjdGlvbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oRW50aXR5T3AuUVVFUllfTE9BRCwgbnVsbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFJlc3BvbnNlRGF0YSQ8VFtdPihvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSB1cGRhdGVkIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIC8vIHVwZGF0ZSBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgIC8vIHBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1VwZGF0ZVxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gICAgICB1cGRhdGUsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlKGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPj4oXG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWRcbiAgICApLnBpcGUoXG4gICAgICAvLyBVc2UgdGhlIHVwZGF0ZSBlbnRpdHkgZGF0YSBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgICAgLy8gYmVjYXVzZSB0aGUgaWQgY2hhbmdlZCBvciB0aGVyZSBhcmUgdW5zYXZlZCBjaGFuZ2VzLlxuICAgICAgbWFwKHVwZGF0ZURhdGEgPT4gdXBkYXRlRGF0YS5jaGFuZ2VzKSxcbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlIGFzIFQpXSEpLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IG9yIGV4aXN0aW5nIGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogT25seSBkaXNwYXRjaCB0aGlzIGFjdGlvbiBpZiB5b3VyIHNlcnZlciBzdXBwb3J0cyB1cHNlcnQuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0U2F2ZUVudGl0eUFjdGlvbk9wdGlvbnMoXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1Vwc2VydFxuICAgICk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5jcmVhdGVFbnRpdHlBY3Rpb24oXG4gICAgICBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkUsXG4gICAgICBlbnRpdHksXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBpZiAob3B0aW9ucy5pc09wdGltaXN0aWMpIHtcbiAgICAgIHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNwb25zZURhdGEkPFQ+KG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIC8vIFVzZSB0aGUgcmV0dXJuZWQgZW50aXR5IGRhdGEncyBpZCB0byBnZXQgdGhlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAvLyBhcyBpdCBtaWdodCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgZW50aXR5IHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuZW50aXR5Q29sbGVjdGlvbiQpLFxuICAgICAgbWFwKChbZSwgY29sbGVjdGlvbl0pID0+IGNvbGxlY3Rpb24uZW50aXRpZXNbdGhpcy5zZWxlY3RJZChlKV0hKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIFF1ZXJ5IGFuZCBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2VcblxuICAvLyBVbmd1YXJkZWQgZm9yIHBlcmZvcm1hbmNlLlxuICAvLyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiBydW5zIGEgZ3VhcmQgKHdoaWNoIHRocm93cylcbiAgLy8gRGV2ZWxvcGVyIHNob3VsZCB1bmRlcnN0YW5kIGNhY2hlLW9ubHkgbWV0aG9kcyB3ZWxsIGVub3VnaFxuICAvLyB0byBjYWxsIHRoZW0gd2l0aCB0aGUgcHJvcGVyIGVudGl0aWVzLlxuICAvLyBNYXkgcmVjb25zaWRlciBhbmQgYWRkIGd1YXJkcyBpbiBmdXR1cmUuXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIGFkZEFsbFRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9BTEwsIGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5BRERfT05FLCBlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtdWx0aXBsZSBuZXcgZW50aXRpZXMgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aXRoIHByaW1hcnkga2V5cyBhbHJlYWR5IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKi9cbiAgYWRkTWFueVRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLkFERF9NQU5ZLCBlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5SRU1PVkVfQUxMLCB1bmRlZmluZWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG4gIHJlbW92ZU9uZUZyb21DYWNoZShcbiAgICBhcmc6IChudW1iZXIgfCBzdHJpbmcpIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9PTkUsIHRoaXMuZ2V0S2V5KGFyZyksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAgYXJnczogKG51bWJlciB8IHN0cmluZylbXSB8IFRbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWFyZ3MgfHwgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qga2V5cyA9XG4gICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCdcbiAgICAgICAgPyAvLyBpZiBhcnJheVswXSBpcyBhIGtleSwgYXNzdW1lIHRoZXkncmUgYWxsIGtleXNcbiAgICAgICAgICAoPFRbXT5hcmdzKS5tYXAoYXJnID0+IHRoaXMuZ2V0S2V5KGFyZykpXG4gICAgICAgIDogYXJncztcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlJFTU9WRV9NQU5ZLCBrZXlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhhdCBlbnRpdHkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggbWF0Y2hpbmcgcHJpbWFyeSBrZXkgaXMgbm90IGluIGNhY2hlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICovXG4gIHVwZGF0ZU9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIC8vIHVwZGF0ZSBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgIC8vIHBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICBjb25zdCB1cGRhdGU6IFVwZGF0ZTxUPiA9IHRoaXMudG9VcGRhdGUoZW50aXR5KTtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlVQREFURV9PTkUsIHVwZGF0ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoZXNlIGVudGl0aWVzIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aG9zZSBwcmltYXJ5IGtleXMgYXJlIG5vdCBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogVXBkYXRlIGVudGl0aWVzIG1heSBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogc3VjaCBwYXJ0aWFsIGVudGl0aWVzIHBhdGNoIHRoZWlyIGNhY2hlZCBjb3VudGVycGFydHMuXG4gICAqL1xuICB1cGRhdGVNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIGlmICghZW50aXRpZXMgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHVwZGF0ZXM6IFVwZGF0ZTxUPltdID0gZW50aXRpZXMubWFwKGVudGl0eSA9PiB0aGlzLnRvVXBkYXRlKGVudGl0eSkpO1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBEQVRFX01BTlksIHVwZGF0ZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogVXBzZXJ0IGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIFBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICovXG4gIHVwc2VydE9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuVVBTRVJUX09ORSwgZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIHVwc2VydE1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdGllcyB8fCBlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5VUFNFUlRfTUFOWSwgZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGF0dGVybiB0aGF0IHRoZSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGFwcGxpZXNcbiAgICogd2hlbiB1c2luZyB0aGUgYGZpbHRlcmVkRW50aXRpZXNgIHNlbGVjdG9yLlxuICAgKi9cbiAgc2V0RmlsdGVyKHBhdHRlcm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlQW5kRGlzcGF0Y2goRW50aXR5T3AuU0VUX0ZJTFRFUiwgcGF0dGVybik7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkZWQgZmxhZyAqL1xuICBzZXRMb2FkZWQoaXNMb2FkZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUFuZERpc3BhdGNoKEVudGl0eU9wLlNFVF9MT0FERUQsICEhaXNMb2FkZWQpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGluZyBmbGFnICovXG4gIHNldExvYWRpbmcoaXNMb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVBbmREaXNwYXRjaChFbnRpdHlPcC5TRVRfTE9BRElORywgISFpc0xvYWRpbmcpO1xuICB9XG4gIC8vICNlbmRyZWdpb24gQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZVxuXG4gIC8vICNyZWdpb24gcHJpdmF0ZSBoZWxwZXJzXG5cbiAgLyoqIEdldCBrZXkgZnJvbSBlbnRpdHkgKHVubGVzcyBhcmcgaXMgYWxyZWFkeSBhIGtleSkgKi9cbiAgcHJpdmF0ZSBnZXRLZXkoYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBUKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgICA/IHRoaXMuc2VsZWN0SWQoYXJnKVxuICAgICAgOiAoYXJnIGFzIG51bWJlciB8IHN0cmluZyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIE9ic2VydmFibGUgb2YgZGF0YSBmcm9tIHRoZSBzZXJ2ZXItc3VjY2VzcyBFbnRpdHlBY3Rpb24gd2l0aFxuICAgKiB0aGUgZ2l2ZW4gQ29ycmVsYXRpb24gSWQsIGFmdGVyIHRoYXQgYWN0aW9uIHdhcyBwcm9jZXNzZWQgYnkgdGhlIG5ncnggc3RvcmUuXG4gICAqIG9yIGVsc2UgcHV0IHRoZSBzZXJ2ZXIgZXJyb3Igb24gdGhlIE9ic2VydmFibGUgZXJyb3IgY2hhbm5lbC5cbiAgICogQHBhcmFtIGNyaWQgVGhlIGNvcnJlbGF0aW9uSWQgZm9yIGJvdGggdGhlIHNhdmUgYW5kIHJlc3BvbnNlIGFjdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIGdldFJlc3BvbnNlRGF0YSQ8RCA9IGFueT4oY3JpZDogYW55KTogT2JzZXJ2YWJsZTxEPiB7XG4gICAgLyoqXG4gICAgICogcmVkdWNlZEFjdGlvbnMkIG11c3QgYmUgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICAgKiBiZWNhdXNlIHRoZSByZXNwb25zZSBhY3Rpb24gbWlnaHQgaGF2ZSBiZWVuIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlXG4gICAgICogYmVmb3JlIGNhbGxlciBoYWQgYSBjaGFuY2UgdG8gc3Vic2NyaWJlLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLnJlZHVjZWRBY3Rpb25zJC5waXBlKFxuICAgICAgZmlsdGVyKChhY3Q6IGFueSkgPT4gISFhY3QucGF5bG9hZCksXG4gICAgICBmaWx0ZXIoKGFjdDogRW50aXR5QWN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29ycmVsYXRpb25JZCwgZW50aXR5TmFtZSwgZW50aXR5T3AgfSA9IGFjdC5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGVudGl0eU5hbWUgPT09IHRoaXMuZW50aXR5TmFtZSAmJlxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQgPT09IGNyaWQgJiZcbiAgICAgICAgICAoZW50aXR5T3AuZW5kc1dpdGgoT1BfU1VDQ0VTUykgfHxcbiAgICAgICAgICAgIGVudGl0eU9wLmVuZHNXaXRoKE9QX0VSUk9SKSB8fFxuICAgICAgICAgICAgZW50aXR5T3AgPT09IEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUKVxuICAgICAgICApO1xuICAgICAgfSksXG4gICAgICB0YWtlKDEpLFxuICAgICAgbWVyZ2VNYXAoYWN0ID0+IHtcbiAgICAgICAgY29uc3QgeyBlbnRpdHlPcCB9ID0gYWN0LnBheWxvYWQ7XG4gICAgICAgIHJldHVybiBlbnRpdHlPcCA9PT0gRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1RcbiAgICAgICAgICA/IHRocm93RXJyb3IobmV3IFBlcnNpc3RhbmNlQ2FuY2VsZWQoYWN0LnBheWxvYWQuZGF0YSkpXG4gICAgICAgICAgOiBlbnRpdHlPcC5lbmRzV2l0aChPUF9TVUNDRVNTKVxuICAgICAgICAgICAgPyBvZihhY3QucGF5bG9hZC5kYXRhIGFzIEQpXG4gICAgICAgICAgICA6IHRocm93RXJyb3IoYWN0LnBheWxvYWQuZGF0YS5lcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHNldFF1ZXJ5RW50aXR5QWN0aW9uT3B0aW9ucyhcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb25PcHRpb25zIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBjb3JyZWxhdGlvbklkID1cbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZCA9PSBudWxsXG4gICAgICAgID8gdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yLm5leHQoKVxuICAgICAgICA6IG9wdGlvbnMuY29ycmVsYXRpb25JZDtcbiAgICByZXR1cm4geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkIH07XG4gIH1cblxuICBwcml2YXRlIHNldFNhdmVFbnRpdHlBY3Rpb25PcHRpb25zKFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zLFxuICAgIGRlZmF1bHRPcHRpbWlzbT86IGJvb2xlYW5cbiAgKTogRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID1cbiAgICAgIG9wdGlvbnMuaXNPcHRpbWlzdGljID09IG51bGxcbiAgICAgICAgPyBkZWZhdWx0T3B0aW1pc20gfHwgZmFsc2VcbiAgICAgICAgOiBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PT0gdHJ1ZTtcbiAgICByZXR1cm4geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHByaXZhdGUgaGVscGVyc1xufVxuIl19