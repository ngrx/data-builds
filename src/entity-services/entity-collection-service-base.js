(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-services/entity-collection-service-base", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // tslint:disable:member-ordering
    /**
     * Base class for a concrete EntityCollectionService<T>.
     * Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.
     * @param EntityCollectionServiceElements The ingredients for this service
     * as a source of supporting services for creating an EntityCollectionService<T> instance.
     */
    class EntityCollectionServiceBase {
        constructor(
        /** Name of the entity type of this collection service */
        entityName, 
        /** Creates the core elements of the EntityCollectionService for this entity type */
        serviceElementsFactory) {
            this.entityName = entityName;
            entityName = entityName.trim();
            const { dispatcher, selectors, selectors$ } = serviceElementsFactory.create(entityName);
            this.entityName = entityName;
            this.dispatcher = dispatcher;
            this.guard = dispatcher.guard;
            this.selectId = dispatcher.selectId;
            this.toUpdate = dispatcher.toUpdate;
            this.selectors = selectors;
            this.selectors$ = selectors$;
            this.collection$ = selectors$.collection$;
            this.count$ = selectors$.count$;
            this.entities$ = selectors$.entities$;
            this.entityActions$ = selectors$.entityActions$;
            this.entityMap$ = selectors$.entityMap$;
            this.errors$ = selectors$.errors$;
            this.filter$ = selectors$.filter$;
            this.filteredEntities$ = selectors$.filteredEntities$;
            this.keys$ = selectors$.keys$;
            this.loaded$ = selectors$.loaded$;
            this.loading$ = selectors$.loading$;
            this.changeState$ = selectors$.changeState$;
        }
        /**
         * Create an {EntityAction} for this entity type.
         * @param op {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the EntityAction
         */
        createEntityAction(op, data, options) {
            return this.dispatcher.createEntityAction(op, data, options);
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
            return this.dispatcher.createAndDispatch(op, data, options);
        }
        /**
         * Dispatch an action of any type to the ngrx store.
         * @param action the Action
         * @returns the dispatched Action
         */
        dispatch(action) {
            return this.dispatcher.dispatch(action);
        }
        /** The NgRx Store for the {EntityCache} */
        get store() {
            return this.dispatcher.store;
        }
        // region Dispatch commands
        /**
         * Dispatch action to save a new entity to remote storage.
         * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @param [options] options that influence save and merge behavior
         * @returns Observable of the entity
         * after server reports successful save or the save error.
         */
        add(entity, options) {
            return this.dispatcher.add(entity, options);
        }
        /**
         * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
         * @param correlationId The correlation id for the corresponding EntityAction
         * @param [reason] explains why canceled and by whom.
         * @param [options] options such as the tag and mergeStrategy
         */
        cancel(correlationId, reason, options) {
            this.dispatcher.cancel(correlationId, reason, options);
        }
        delete(arg, options) {
            return this.dispatcher.delete(arg, options);
        }
        /**
         * Dispatch action to query remote storage for all entities and
         * merge the queried entities into the cached collection.
         * @param [options] options that influence merge behavior
         * @returns Observable of the collection
         * after server reports successful query or the query error.
         * @see load()
         */
        getAll(options) {
            return this.dispatcher.getAll(options);
        }
        /**
         * Dispatch action to query remote storage for the entity with this primary key.
         * If the server returns an entity,
         * merge it into the cached collection.
         * @param key The primary key of the entity to get.
         * @param [options] options that influence merge behavior
         * @returns Observable of the queried entity that is in the collection
         * after server reports success or the query error.
         */
        getByKey(key, options) {
            return this.dispatcher.getByKey(key, options);
        }
        /**
         * Dispatch action to query remote storage for the entities that satisfy a query expressed
         * with either a query parameter map or an HTTP URL query string,
         * and merge the results into the cached collection.
         * @param queryParams the query in a form understood by the server
         * @param [options] options that influence merge behavior
         * @returns Observable of the queried entities
         * after server reports successful query or the query error.
         */
        getWithQuery(queryParams, options) {
            return this.dispatcher.getWithQuery(queryParams, options);
        }
        /**
         * Dispatch action to query remote storage for all entities and
         * completely replace the cached collection with the queried entities.
         * @param [options] options that influence load behavior
         * @returns Observable of the collection
         * after server reports successful query or the query error.
         * @see getAll
         */
        load(options) {
            return this.dispatcher.load(options);
        }
        /**
         * Dispatch action to save the updated entity (or partial entity) in remote storage.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param entity update entity, which might be a partial of T but must at least have its key.
         * @param [options] options that influence save and merge behavior
         * @returns Observable of the updated entity
         * after server reports successful save or the save error.
         */
        update(entity, options) {
            return this.dispatcher.update(entity, options);
        }
        /**
         * Dispatch action to save a new or existing entity to remote storage.
         * Call only if the server supports upsert.
         * @param entity entity to add or upsert.
         * It may omit its key if an add, and is pessimistic, and the server creates the key;
         * must have a key if optimistic save.
         * @param [options] options that influence save and merge behavior
         * @returns Observable of the entity
         * after server reports successful save or the save error.
         */
        upsert(entity, options) {
            return this.dispatcher.upsert(entity, options);
        }
        /*** Cache-only operations that do not update remote storage ***/
        /**
         * Replace all entities in the cached collection.
         * Does not save to remote storage.
         * @param entities to add directly to cache.
         * @param [options] options such as mergeStrategy
         */
        addAllToCache(entities, options) {
            this.dispatcher.addAllToCache(entities, options);
        }
        /**
         * Add a new entity directly to the cache.
         * Does not save to remote storage.
         * Ignored if an entity with the same primary key is already in cache.
         * @param entity to add directly to cache.
         * @param [options] options such as mergeStrategy
         */
        addOneToCache(entity, options) {
            this.dispatcher.addOneToCache(entity, options);
        }
        /**
         * Add multiple new entities directly to the cache.
         * Does not save to remote storage.
         * Entities with primary keys already in cache are ignored.
         * @param entities to add directly to cache.
         * @param [options] options such as mergeStrategy
         */
        addManyToCache(entities, options) {
            this.dispatcher.addManyToCache(entities, options);
        }
        /** Clear the cached entity collection */
        clearCache() {
            this.dispatcher.clearCache();
        }
        removeOneFromCache(arg, options) {
            this.dispatcher.removeOneFromCache(arg, options);
        }
        removeManyFromCache(args, options) {
            this.dispatcher.removeManyFromCache(args, options);
        }
        /**
         * Update a cached entity directly.
         * Does not update that entity in remote storage.
         * Ignored if an entity with matching primary key is not in cache.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param entity to update directly in cache.
         * @param [options] options such as mergeStrategy
         */
        updateOneInCache(entity, options) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            this.dispatcher.updateOneInCache(entity, options);
        }
        /**
         * Update multiple cached entities directly.
         * Does not update these entities in remote storage.
         * Entities whose primary keys are not in cache are ignored.
         * Update entities may be partial but must at least have their keys.
         * such partial entities patch their cached counterparts.
         * @param entities to update directly in cache.
         * @param [options] options such as mergeStrategy
         */
        updateManyInCache(entities, options) {
            this.dispatcher.updateManyInCache(entities, options);
        }
        /**
         * Insert or update a cached entity directly.
         * Does not save to remote storage.
         * Upsert entity might be a partial of T but must at least have its key.
         * Pass the Update<T> structure as the payload.
         * @param entity to upsert directly in cache.
         * @param [options] options such as mergeStrategy
         */
        upsertOneInCache(entity, options) {
            this.dispatcher.upsertOneInCache(entity, options);
        }
        /**
         * Insert or update multiple cached entities directly.
         * Does not save to remote storage.
         * Upsert entities might be partial but must at least have their keys.
         * Pass an array of the Update<T> structure as the payload.
         * @param entities to upsert directly in cache.
         * @param [options] options such as mergeStrategy
         */
        upsertManyInCache(entities, options) {
            this.dispatcher.upsertManyInCache(entities, options);
        }
        /**
         * Set the pattern that the collection's filter applies
         * when using the `filteredEntities` selector.
         */
        setFilter(pattern) {
            this.dispatcher.setFilter(pattern);
        }
        /** Set the loaded flag */
        setLoaded(isLoaded) {
            this.dispatcher.setLoaded(!!isLoaded);
        }
        /** Set the loading flag */
        setLoading(isLoading) {
            this.dispatcher.setLoading(!!isLoading);
        }
    }
    exports.EntityCollectionServiceBase = EntityCollectionServiceBase;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBbUJBLGlDQUFpQztJQUVqQzs7Ozs7T0FLRztJQUNILE1BQWEsMkJBQTJCO1FBYXRDO1FBQ0UseURBQXlEO1FBQ3pDLFVBQWtCO1FBQ2xDLG9GQUFvRjtRQUNwRixzQkFBOEQ7WUFGOUMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtZQUlsQyxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FHekUsVUFBVSxDQUFDLENBQUM7WUFFZCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUVwQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUM7WUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUN0QyxJQUFJLENBQUMs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O1lBQ2hFLHdFQUF3RTtZQUN4RSw4Q0FBOEM7WUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVEOzs7Ozs7OztXQVFHO1FBQ0gsaUJBQWlCLENBQ2YsUUFBc0IsRUFDdEIsT0FBNkI7WUFFN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUVEOzs7Ozs7O1dBT0c7UUFDSCxnQkFBZ0IsQ0FBQyxNQUFrQixFQUFFLE9BQTZCO1lBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFRDs7Ozs7OztXQU9HO1FBQ0gsaUJBQWlCLENBQ2YsUUFBc0IsRUFDdEIsT0FBNkI7WUFFN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUVEOzs7V0FHRztRQUNILFNBQVMsQ0FBQyxPQUFZO1lBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCwwQkFBMEI7UUFDMUIsU0FBUyxDQUFDLFFBQWlCO1lBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsMkJBQTJCO1FBQzNCLFVBQVUsQ0FBQyxTQUFrQjtZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsQ0FBQztLQTBDRjtJQTNiRCxrRUEyYkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbixcbiAgQ2hhbmdlU3RhdGVNYXAsXG59IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYSBjb25jcmV0ZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPi5cbiAqIENhbiBiZSBpbnN0YW50aWF0ZWQuIENhbm5vdCBiZSBpbmplY3RlZC4gVXNlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB0byBjcmVhdGUuXG4gKiBAcGFyYW0gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50cyBUaGUgaW5ncmVkaWVudHMgZm9yIHRoaXMgc2VydmljZVxuICogYXMgYSBzb3VyY2Ugb2Ygc3VwcG9ydGluZyBzZXJ2aWNlcyBmb3IgY3JlYXRpbmcgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4gaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2U8XG4gIFQsXG4gIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbj4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gIC8qKiBEaXNwYXRjaGVyIG9mIEVudGl0eUNvbW1hbmRzIChFbnRpdHlBY3Rpb25zKSAqL1xuICByZWFkb25seSBkaXNwYXRjaGVyOiBFbnRpdHlEaXNwYXRjaGVyPFQ+O1xuXG4gIC8qKiBBbGwgc2VsZWN0b3JzIG9mIGVudGl0eSBjb2xsZWN0aW9uIHByb3BlcnRpZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD47XG5cbiAgLyoqIEFsbCBzZWxlY3RvcnMkIChvYnNlcnZhYmxlcyBvZiBlbnRpdHkgY29sbGVjdGlvbiBwcm9wZXJ0aWVzKSAqL1xuICByZWFkb25seSBzZWxlY3RvcnMkOiBTJDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhpcyBjb2xsZWN0aW9uIHNlcnZpY2UgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgdGhpcyBlbnRpdHkgdHlwZSAqL1xuICAgIHNlcnZpY2VFbGVtZW50c0ZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICkge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCB7IGRpc3BhdGNoZXIsIHNlbGVjdG9ycywgc2VsZWN0b3JzJCB9ID0gc2VydmljZUVsZW1lbnRzRmFjdG9yeS5jcmVhdGU8XG4gICAgICBULFxuICAgICAgUyRcbiAgICA+KGVudGl0eU5hbWUpO1xuXG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuZ3VhcmQgPSBkaXNwYXRjaGVyLmd1YXJkO1xuICAgIHRoaXMuc2VsZWN0SWQgPSBkaXNwYXRjaGVyLnNlbGVjdElkO1xuICAgIHRoaXMudG9VcGRhdGUgPSBkaXNwYXRjaGVyLnRvVXBkYXRlO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSBzZWxlY3RvcnM7XG4gICAgdGhpcy5zZWxlY3RvcnMkID0gc2VsZWN0b3JzJDtcbiAgICB0aGlzLmNvbGxlY3Rpb24kID0gc2VsZWN0b3JzJC5jb2xsZWN0aW9uJDtcbiAgICB0aGlzLmNvdW50JCA9IHNlbGVjdG9ycyQuY291bnQkO1xuICAgIHRoaXMuZW50aXRpZXMkID0gc2VsZWN0b3JzJC5lbnRpdGllcyQ7XG4gICAgdGhpcy5lbnRpdHlBY3Rpb25zJCA9IHNlbGVjdG9ycyQuZW50aXR5QWN0aW9ucyQ7XG4gICAgdGhpcy5lbnRpdHlNYXAkID0gc2VsZWN0b3JzJC5lbnRpdHlNYXAkO1xuICAgIHRoaXMuZXJyb3JzJCA9IHNlbGVjdG9ycyQuZXJyb3JzJDtcbiAgICB0aGlzLmZpbHRlciQgPSBzZWxlY3RvcnMkLmZpbHRlciQ7XG4gICAgdGhpcy5maWx0ZXJlZEVudGl0aWVzJCA9IHNlbGVjdG9ycyQuZmlsdGVyZWRFbnRpdGllcyQ7XG4gICAgdGhpcy5rZXlzJCA9IHNlbGVjdG9ycyQua2V5cyQ7XG4gICAgdGhpcy5sb2FkZWQkID0gc2VsZWN0b3JzJC5sb2FkZWQkO1xuICAgIHRoaXMubG9hZGluZyQgPSBzZWxlY3RvcnMkLmxvYWRpbmckO1xuICAgIHRoaXMuY2hhbmdlU3RhdGUkID0gc2VsZWN0b3JzJC5jaGFuZ2VTdGF0ZSQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5jcmVhdGVFbnRpdHlBY3Rpb24ob3AsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuY3JlYXRlQW5kRGlzcGF0Y2gob3AsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIGFjdGlvbiBvZiBhbnkgdHlwZSB0byB0aGUgbmdyeCBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBUaGUgTmdSeCBTdG9yZSBmb3IgdGhlIHtFbnRpdHlDYWNoZX0gKi9cbiAgZ2V0IHN0b3JlKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuc3RvcmU7XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLlxuICAgKi9cbiAgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuXG4gIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgLy8gcmVnaW9uIERpc3BhdGNoIGNvbW1hbmRzXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBhZGQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuYWRkKGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKSB3aXRoIHRoZSBnaXZlbiBjb3JyZWxhdGlvbklkLlxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyB0aGUgdGFnIGFuZCBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuY2FuY2VsKGNvcnJlbGF0aW9uSWQsIHJlYXNvbiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGVudGl0eSB0byBkZWxldGVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG4gIGRlbGV0ZShcbiAgICBhcmc6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmRlbGV0ZShhcmcgYXMgYW55LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGxvYWQoKVxuICAgKi9cbiAgZ2V0QWxsKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmdldEFsbChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdHkgd2l0aCB0aGlzIHByaW1hcnkga2V5LlxuICAgKiBJZiB0aGUgc2VydmVyIHJldHVybnMgYW4gZW50aXR5LFxuICAgKiBtZXJnZSBpdCBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byBnZXQuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0eSB0aGF0IGlzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3Mgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0QnlLZXkoa2V5OiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRCeUtleShrZXksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBxdWVyeVBhcmFtcyB0aGUgcXVlcnkgaW4gYSBmb3JtIHVuZGVyc3Rvb2QgYnkgdGhlIHNlcnZlclxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllc1xuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmdldFdpdGhRdWVyeShxdWVyeVBhcmFtcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIGNvbXBsZXRlbHkgcmVwbGFjZSB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gd2l0aCB0aGUgcXVlcmllZCBlbnRpdGllcy5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIGxvYWQgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBnZXRBbGxcbiAgICovXG4gIGxvYWQob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIubG9hZChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSB0aGUgdXBkYXRlZCBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqIEBwYXJhbSBlbnRpdHkgdXBkYXRlIGVudGl0eSwgd2hpY2ggbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgdXBkYXRlZCBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBkYXRlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLnVwZGF0ZShlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IG9yIGV4aXN0aW5nIGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQ2FsbCBvbmx5IGlmIHRoZSBzZXJ2ZXIgc3VwcG9ydHMgdXBzZXJ0LlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQgb3IgdXBzZXJ0LlxuICAgKiBJdCBtYXkgb21pdCBpdHMga2V5IGlmIGFuIGFkZCwgYW5kIGlzIHBlc3NpbWlzdGljLCBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBzZXJ0KGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLnVwc2VydChlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqKiBDYWNoZS1vbmx5IG9wZXJhdGlvbnMgdGhhdCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlICoqKi9cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgdG8gYWRkIGRpcmVjdGx5IHRvIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBhZGRBbGxUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmFkZEFsbFRvQ2FjaGUoZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIHRoZSBzYW1lIHByaW1hcnkga2V5IGlzIGFscmVhZHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBlbnRpdHkgdG8gYWRkIGRpcmVjdGx5IHRvIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBhZGRPbmVUb0NhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuYWRkT25lVG9DYWNoZShlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtdWx0aXBsZSBuZXcgZW50aXRpZXMgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aXRoIHByaW1hcnkga2V5cyBhbHJlYWR5IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgdG8gYWRkIGRpcmVjdGx5IHRvIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBhZGRNYW55VG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5hZGRNYW55VG9DYWNoZShlbnRpdGllcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5jbGVhckNhY2hlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG4gIHJlbW92ZU9uZUZyb21DYWNoZShcbiAgICBhcmc6IChudW1iZXIgfCBzdHJpbmcpIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIucmVtb3ZlT25lRnJvbUNhY2hlKGFyZyBhcyBhbnksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGFyZ3M6IChudW1iZXIgfCBzdHJpbmcpW10gfCBUW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnJlbW92ZU1hbnlGcm9tQ2FjaGUoYXJncyBhcyBhbnlbXSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoYXQgZW50aXR5IGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIG1hdGNoaW5nIHByaW1hcnkga2V5IGlzIG5vdCBpbiBjYWNoZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqIEBwYXJhbSBlbnRpdHkgdG8gdXBkYXRlIGRpcmVjdGx5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICB1cGRhdGVPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwZGF0ZU9uZUluQ2FjaGUoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhlc2UgZW50aXRpZXMgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdob3NlIHByaW1hcnkga2V5cyBhcmUgbm90IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBVcGRhdGUgZW50aXRpZXMgbWF5IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBzdWNoIHBhcnRpYWwgZW50aXRpZXMgcGF0Y2ggdGhlaXIgY2FjaGVkIGNvdW50ZXJwYXJ0cy5cbiAgICogQHBhcmFtIGVudGl0aWVzIHRvIHVwZGF0ZSBkaXJlY3RseSBpbiBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgdXBkYXRlTWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIudXBkYXRlTWFueUluQ2FjaGUoZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBvciB1cGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogUGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZC5cbiAgICogQHBhcmFtIGVudGl0eSB0byB1cHNlcnQgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwc2VydE9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci51cHNlcnRPbmVJbkNhY2hlKGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IG9yIHVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdGllcyBtaWdodCBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogUGFzcyBhbiBhcnJheSBvZiB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZC5cbiAgICogQHBhcmFtIGVudGl0aWVzIHRvIHVwc2VydCBkaXJlY3RseSBpbiBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgdXBzZXJ0TWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIudXBzZXJ0TWFueUluQ2FjaGUoZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGF0dGVybiB0aGF0IHRoZSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGFwcGxpZXNcbiAgICogd2hlbiB1c2luZyB0aGUgYGZpbHRlcmVkRW50aXRpZXNgIHNlbGVjdG9yLlxuICAgKi9cbiAgc2V0RmlsdGVyKHBhdHRlcm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zZXRGaWx0ZXIocGF0dGVybik7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkZWQgZmxhZyAqL1xuICBzZXRMb2FkZWQoaXNMb2FkZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuc2V0TG9hZGVkKCEhaXNMb2FkZWQpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGluZyBmbGFnICovXG4gIHNldExvYWRpbmcoaXNMb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnNldExvYWRpbmcoISFpc0xvYWRpbmcpO1xuICB9XG5cbiAgLy8gZW5kcmVnaW9uIERpc3BhdGNoIGNvbW1hbmRzXG5cbiAgLy8gcmVnaW9uIFNlbGVjdG9ycyRcbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb24gYXMgYSB3aG9sZSAqL1xuICBjb2xsZWN0aW9uJDogT2JzZXJ2YWJsZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PiB8IFN0b3JlPEVudGl0eUNvbGxlY3Rpb248VD4+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGNvdW50IG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgY291bnQkOiBPYnNlcnZhYmxlPG51bWJlcj4gfCBTdG9yZTxudW1iZXI+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIGVudGl0aWVzJDogT2JzZXJ2YWJsZTxUW10+IHwgU3RvcmU8VFtdPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhY3Rpb25zIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkgdHlwZS4gKi9cbiAgZW50aXR5QWN0aW9ucyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgbWFwIG9mIGVudGl0eSBrZXlzIHRvIGVudGl0aWVzICovXG4gIGVudGl0eU1hcCQ6IE9ic2VydmFibGU8RGljdGlvbmFyeTxUPj4gfCBTdG9yZTxEaWN0aW9uYXJ5PFQ+PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25zIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkgdHlwZS4gKi9cbiAgZXJyb3JzJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBmaWx0ZXIgcGF0dGVybiBhcHBsaWVkIGJ5IHRoZSBlbnRpdHkgY29sbGVjdGlvbidzIGZpbHRlciBmdW5jdGlvbiAqL1xuICBmaWx0ZXIkOiBPYnNlcnZhYmxlPGFueT4gfCBTdG9yZTxhbnk+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB0aGF0IHBhc3MgdGhlIGZpbHRlciBmdW5jdGlvbiAqL1xuICBmaWx0ZXJlZEVudGl0aWVzJDogT2JzZXJ2YWJsZTxUW10+IHwgU3RvcmU8VFtdPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUga2V5cyBvZiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24sIGluIHRoZSBjb2xsZWN0aW9uJ3MgbmF0aXZlIHNvcnQgb3JkZXIgKi9cbiAga2V5cyQ6IE9ic2VydmFibGU8c3RyaW5nW10gfCBudW1iZXJbXT4gfCBTdG9yZTxzdHJpbmdbXSB8IG51bWJlcltdPjtcblxuICAvKiogT2JzZXJ2YWJsZSB0cnVlIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gbG9hZGVkICovXG4gIGxvYWRlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBTdG9yZTxib29sZWFuPjtcblxuICAvKiogT2JzZXJ2YWJsZSB0cnVlIHdoZW4gYSBtdWx0aS1lbnRpdHkgcXVlcnkgY29tbWFuZCBpcyBpbiBwcm9ncmVzcy4gKi9cbiAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBTdG9yZTxib29sZWFuPjtcblxuICAvKiogT3JpZ2luYWwgZW50aXR5IHZhbHVlcyBmb3IgZW50aXRpZXMgd2l0aCB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgY2hhbmdlU3RhdGUkOiBPYnNlcnZhYmxlPENoYW5nZVN0YXRlTWFwPFQ+PiB8IFN0b3JlPENoYW5nZVN0YXRlTWFwPFQ+PjtcblxuICAvLyBlbmRyZWdpb24gU2VsZWN0b3JzJFxufVxuIl19