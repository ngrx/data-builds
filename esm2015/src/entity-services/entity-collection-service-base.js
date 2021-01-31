/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-collection-service-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable:member-ordering
/**
 * Base class for a concrete EntityCollectionService<T>.
 * Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.
 * @param EntityCollectionServiceElements The ingredients for this service
 * as a source of supporting services for creating an EntityCollectionService<T> instance.
 * @template T, S$
 */
export class EntityCollectionServiceBase {
    /**
     * @param {?} entityName
     * @param {?} serviceElementsFactory
     */
    constructor(entityName, 
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
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the EntityAction
     */
    createEntityAction(op, data, options) {
        return this.dispatcher.createEntityAction(op, data, options);
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
        return this.dispatcher.createAndDispatch(op, data, options);
    }
    /**
     * Dispatch an action of any type to the ngrx store.
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    dispatch(action) {
        return this.dispatcher.dispatch(action);
    }
    /**
     * The NgRx Store for the {EntityCache}
     * @return {?}
     */
    get store() {
        return this.dispatcher.store;
    }
    /**
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    add(entity, options) {
        return this.dispatcher.add(entity, options);
    }
    /**
     * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
     * @param {?} correlationId The correlation id for the corresponding EntityAction
     * @param {?=} reason
     * @param {?=} options
     * @return {?}
     */
    cancel(correlationId, reason, options) {
        this.dispatcher.cancel(correlationId, reason, options);
    }
    /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    delete(arg, options) {
        return this.dispatcher.delete((/** @type {?} */ (arg)), options);
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @see load()
     * @param {?=} options
     * @return {?} Observable of the collection
     * after server reports successful query or the query error.
     */
    getAll(options) {
        return this.dispatcher.getAll(options);
    }
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param {?} key The primary key of the entity to get.
     * @param {?=} options
     * @return {?} Observable of the queried entity that is in the collection
     * after server reports success or the query error.
     */
    getByKey(key, options) {
        return this.dispatcher.getByKey(key, options);
    }
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param {?} queryParams the query in a form understood by the server
     * @param {?=} options
     * @return {?} Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(queryParams, options) {
        return this.dispatcher.getWithQuery(queryParams, options);
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @see getAll
     * @param {?=} options
     * @return {?} Observable of the collection
     * after server reports successful query or the query error.
     */
    load(options) {
        return this.dispatcher.load(options);
    }
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity update entity, which might be a partial of T but must at least have its key.
     * @param {?=} options
     * @return {?} Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity, options) {
        return this.dispatcher.update(entity, options);
    }
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Call only if the server supports upsert.
     * @param {?} entity entity to add or upsert.
     * It may omit its key if an add, and is pessimistic, and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity, options) {
        return this.dispatcher.upsert(entity, options);
    }
    /*** Cache-only operations that do not update remote storage ***/
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     * @param {?} entities to add directly to cache.
     * @param {?=} options
     * @return {?}
     */
    addAllToCache(entities, options) {
        this.dispatcher.addAllToCache(entities, options);
    }
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity to add directly to cache.
     * @param {?=} options
     * @return {?}
     */
    addOneToCache(entity, options) {
        this.dispatcher.addOneToCache(entity, options);
    }
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities to add directly to cache.
     * @param {?=} options
     * @return {?}
     */
    addManyToCache(entities, options) {
        this.dispatcher.addManyToCache(entities, options);
    }
    /**
     * Clear the cached entity collection
     * @return {?}
     */
    clearCache() {
        this.dispatcher.clearCache();
    }
    /**
     * @param {?} arg
     * @param {?=} options
     * @return {?}
     */
    removeOneFromCache(arg, options) {
        this.dispatcher.removeOneFromCache((/** @type {?} */ (arg)), options);
    }
    /**
     * @param {?} args
     * @param {?=} options
     * @return {?}
     */
    removeManyFromCache(args, options) {
        this.dispatcher.removeManyFromCache((/** @type {?} */ (args)), options);
    }
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity to update directly in cache.
     * @param {?=} options
     * @return {?}
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
     * @param {?} entities to update directly in cache.
     * @param {?=} options
     * @return {?}
     */
    updateManyInCache(entities, options) {
        this.dispatcher.updateManyInCache(entities, options);
    }
    /**
     * Insert or update a cached entity directly.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload.
     * @param {?} entity to upsert directly in cache.
     * @param {?=} options
     * @return {?}
     */
    upsertOneInCache(entity, options) {
        this.dispatcher.upsertOneInCache(entity, options);
    }
    /**
     * Insert or update multiple cached entities directly.
     * Does not save to remote storage.
     * Upsert entities might be partial but must at least have their keys.
     * Pass an array of the Update<T> structure as the payload.
     * @param {?} entities to upsert directly in cache.
     * @param {?=} options
     * @return {?}
     */
    upsertManyInCache(entities, options) {
        this.dispatcher.upsertManyInCache(entities, options);
    }
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     * @param {?} pattern
     * @return {?}
     */
    setFilter(pattern) {
        this.dispatcher.setFilter(pattern);
    }
    /**
     * Set the loaded flag
     * @param {?} isLoaded
     * @return {?}
     */
    setLoaded(isLoaded) {
        this.dispatcher.setLoaded(!!isLoaded);
    }
    /**
     * Set the loading flag
     * @param {?} isLoading
     * @return {?}
     */
    setLoading(isLoading) {
        this.dispatcher.setLoading(!!isLoading);
    }
}
if (false) {
    /**
     * Dispatcher of EntityCommands (EntityActions)
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.dispatcher;
    /**
     * All selectors of entity collection properties
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.selectors;
    /**
     * All selectors$ (observables of entity collection properties)
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.selectors$;
    /**
     * Utility class with methods to validate EntityAction payloads.
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.guard;
    /**
     * Returns the primary key (id) of this entity
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.selectId;
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `update...` and `upsert...` methods take `Update<T>` args
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.toUpdate;
    /**
     * Observable of the collection as a whole
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.collection$;
    /**
     * Observable of count of entities in the cached collection.
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.count$;
    /**
     * Observable of all entities in the cached collection.
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.entities$;
    /**
     * Observable of actions related to this entity type.
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.entityActions$;
    /**
     * Observable of the map of entity keys to entities
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.entityMap$;
    /**
     * Observable of error actions related to this entity type.
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.errors$;
    /**
     * Observable of the filter pattern applied by the entity collection's filter function
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.filter$;
    /**
     * Observable of entities in the cached collection that pass the filter function
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.filteredEntities$;
    /**
     * Observable of the keys of the cached collection, in the collection's native sort order
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.keys$;
    /**
     * Observable true when the collection has been loaded
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.loaded$;
    /**
     * Observable true when a multi-entity query command is in progress.
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.loading$;
    /**
     * Original entity values for entities with unsaved changes
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.changeState$;
    /**
     * Name of the entity type of this collection service
     * @type {?}
     */
    EntityCollectionServiceBase.prototype.entityName;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTSxPQUFPLDJCQUEyQjs7Ozs7SUFhdEMsWUFFa0IsVUFBa0I7SUFDbEMsb0ZBQW9GO0lBQ3BGLHNCQUE4RDtRQUY5QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBSWxDLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Y0FDekIsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FHekUsVUFBVSxDQUFDO1FBRWIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFFcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQ2hELElBQUksQ0FBQyxV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O0lBamJyRSxpREFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbixcbiAgQ2hhbmdlU3RhdGVNYXAsXG59IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYSBjb25jcmV0ZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPi5cbiAqIENhbiBiZSBpbnN0YW50aWF0ZWQuIENhbm5vdCBiZSBpbmplY3RlZC4gVXNlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB0byBjcmVhdGUuXG4gKiBAcGFyYW0gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50cyBUaGUgaW5ncmVkaWVudHMgZm9yIHRoaXMgc2VydmljZVxuICogYXMgYSBzb3VyY2Ugb2Ygc3VwcG9ydGluZyBzZXJ2aWNlcyBmb3IgY3JlYXRpbmcgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4gaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2U8XG4gIFQsXG4gIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbj4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gIC8qKiBEaXNwYXRjaGVyIG9mIEVudGl0eUNvbW1hbmRzIChFbnRpdHlBY3Rpb25zKSAqL1xuICByZWFkb25seSBkaXNwYXRjaGVyOiBFbnRpdHlEaXNwYXRjaGVyPFQ+O1xuXG4gIC8qKiBBbGwgc2VsZWN0b3JzIG9mIGVudGl0eSBjb2xsZWN0aW9uIHByb3BlcnRpZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD47XG5cbiAgLyoqIEFsbCBzZWxlY3RvcnMkIChvYnNlcnZhYmxlcyBvZiBlbnRpdHkgY29sbGVjdGlvbiBwcm9wZXJ0aWVzKSAqL1xuICByZWFkb25seSBzZWxlY3RvcnMkOiBTJDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhpcyBjb2xsZWN0aW9uIHNlcnZpY2UgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgdGhpcyBlbnRpdHkgdHlwZSAqL1xuICAgIHNlcnZpY2VFbGVtZW50c0ZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICkge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCB7IGRpc3BhdGNoZXIsIHNlbGVjdG9ycywgc2VsZWN0b3JzJCB9ID0gc2VydmljZUVsZW1lbnRzRmFjdG9yeS5jcmVhdGU8XG4gICAgICBULFxuICAgICAgUyRcbiAgICA+KGVudGl0eU5hbWUpO1xuXG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuZ3VhcmQgPSBkaXNwYXRjaGVyLmd1YXJkO1xuICAgIHRoaXMuc2VsZWN0SWQgPSBkaXNwYXRjaGVyLnNlbGVjdElkO1xuICAgIHRoaXMudG9VcGRhdGUgPSBkaXNwYXRjaGVyLnRvVXBkYXRlO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSBzZWxlY3RvcnM7XG4gICAgdGhpcy5zZWxlY3RvcnMkID0gc2VsZWN0b3JzJDtcbiAgICB0aGlzLmNvbGxlY3Rpb24kID0gc2VsZWN0b3JzJC5jb2xsZWN0aW9uJDtcbiAgICB0aGlzLmNvdW50JCA9IHNlbGVjdG9ycyQuY291bnQkO1xuICAgIHRoaXMuZW50aXRpZXMkID0gc2VsZWN0b3JzJC5lbnRpdGllcyQ7XG4gICAgdGhpcy5lbnRpdHlBY3Rpb25zJCA9IHNlbGVjdG9ycyQuZW50aXR5QWN0aW9ucyQ7XG4gICAgdGhpcy5lbnRpdHlNYXAkID0gc2VsZWN0b3JzJC5lbnRpdHlNYXAkO1xuICAgIHRoaXMuZXJyb3JzJCA9IHNlbGVjdG9ycyQuZXJyb3JzJDtcbiAgICB0aGlzLmZpbHRlciQgPSBzZWxlY3RvcnMkLmZpbHRlciQ7XG4gICAgdGhpcy5maWx0ZXJlZEVudGl0aWVzJCA9IHNlbGVjdG9ycyQuZmlsdGVyZWRFbnRpdGllcyQ7XG4gICAgdGhpcy5rZXlzJCA9IHNlbGVjdG9ycyQua2V5cyQ7XG4gICAgdGhpcy5sb2FkZWQkID0gc2VsZWN0b3JzJC5sb2FkZWQkO1xuICAgIHRoaXMubG9hZGluZyQgPSBzZWxlY3RvcnMkLmxvYWRpbmckO1xuICAgIHRoaXMuY2hhbmdlU3RhdGUkID0gc2VsZWN0b3JzJC5jaGFuZ2VTdGF0ZSQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5jcmVhdGVFbnRpdHlBY3Rpb24ob3AsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuY3JlYXRlQW5kRGlzcGF0Y2gob3AsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIGFjdGlvbiBvZiBhbnkgdHlwZSB0byB0aGUgbmdyeCBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBUaGUgTmdSeCBTdG9yZSBmb3IgdGhlIHtFbnRpdHlDYWNoZX0gKi9cbiAgZ2V0IHN0b3JlKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuc3RvcmU7XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLlxuICAgKi9cbiAgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuXG4gIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgLy8gcmVnaW9uIERpc3BhdGNoIGNvbW1hbmRzXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBhZGQoXG4gICAgZW50aXR5OiBQYXJ0aWFsPFQ+LFxuICAgIG9wdGlvbnM6IEVudGl0eUFjdGlvbk9wdGlvbnMgJiB7IGlzT3B0aW1pc3RpYzogZmFsc2UgfVxuICApOiBPYnNlcnZhYmxlPFQ+O1xuICBhZGQoXG4gICAgZW50aXR5OiBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zICYgeyBpc09wdGltaXN0aWM/OiB0cnVlIH1cbiAgKTogT2JzZXJ2YWJsZTxUPjtcbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmFkZChlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAocXVlcnkgb3Igc2F2ZSkgd2l0aCB0aGUgZ2l2ZW4gY29ycmVsYXRpb25JZC5cbiAgICogQHBhcmFtIGNvcnJlbGF0aW9uSWQgVGhlIGNvcnJlbGF0aW9uIGlkIGZvciB0aGUgY29ycmVzcG9uZGluZyBFbnRpdHlBY3Rpb25cbiAgICogQHBhcmFtIFtyZWFzb25dIGV4cGxhaW5zIHdoeSBjYW5jZWxlZCBhbmQgYnkgd2hvbS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgdGhlIHRhZyBhbmQgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgY2FuY2VsKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmNhbmNlbChjb3JyZWxhdGlvbklkLCByZWFzb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBlbnRpdHkgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuICBkZWxldGUoXG4gICAgYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5kZWxldGUoYXJnIGFzIGFueSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIG1lcmdlIHRoZSBxdWVyaWVkIGVudGl0aWVzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBsb2FkKClcbiAgICovXG4gIGdldEFsbChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRBbGwob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXR5IHdpdGggdGhpcyBwcmltYXJ5IGtleS5cbiAgICogSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGVudGl0eSxcbiAgICogbWVyZ2UgaXQgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gZ2V0LlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdHkgdGhhdCBpcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldEJ5S2V5KGtleTogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZ2V0QnlLZXkoa2V5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdGllcyB0aGF0IHNhdGlzZnkgYSBxdWVyeSBleHByZXNzZWRcbiAgICogd2l0aCBlaXRoZXIgYSBxdWVyeSBwYXJhbWV0ZXIgbWFwIG9yIGFuIEhUVFAgVVJMIHF1ZXJ5IHN0cmluZyxcbiAgICogYW5kIG1lcmdlIHRoZSByZXN1bHRzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gcXVlcnlQYXJhbXMgdGhlIHF1ZXJ5IGluIGEgZm9ybSB1bmRlcnN0b29kIGJ5IHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRXaXRoUXVlcnkocXVlcnlQYXJhbXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBsb2FkIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmxvYWQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHVwZGF0ZWQgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci51cGRhdGUoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIENhbGwgb25seSBpZiB0aGUgc2VydmVyIHN1cHBvcnRzIHVwc2VydC5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkIG9yIHVwc2VydC5cbiAgICogSXQgbWF5IG9taXQgaXRzIGtleSBpZiBhbiBhZGQsIGFuZCBpcyBwZXNzaW1pc3RpYywgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci51cHNlcnQoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiogQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZSAqKiovXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0aWVzIHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkQWxsVG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5hZGRBbGxUb0NhY2hlKGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gZW50aXR5IHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmFkZE9uZVRvQ2FjaGUoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogQHBhcmFtIGVudGl0aWVzIHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkTWFueVRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuYWRkTWFueVRvQ2FjaGUoZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuY2xlYXJDYWNoZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShrZXk6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoXG4gICAgYXJnOiAobnVtYmVyIHwgc3RyaW5nKSB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnJlbW92ZU9uZUZyb21DYWNoZShhcmcgYXMgYW55LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgVFtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5yZW1vdmVNYW55RnJvbUNhY2hlKGFyZ3MgYXMgYW55W10sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHRvIHVwZGF0ZSBkaXJlY3RseSBpbiBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIHRoaXMuZGlzcGF0Y2hlci51cGRhdGVPbmVJbkNhY2hlKGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoZXNlIGVudGl0aWVzIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aG9zZSBwcmltYXJ5IGtleXMgYXJlIG5vdCBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogVXBkYXRlIGVudGl0aWVzIG1heSBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogc3VjaCBwYXJ0aWFsIGVudGl0aWVzIHBhdGNoIHRoZWlyIGNhY2hlZCBjb3VudGVycGFydHMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byB1cGRhdGUgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwZGF0ZU1hbnlJbkNhY2hlKGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgb3IgdXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogVXBzZXJ0IGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIFBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWQuXG4gICAqIEBwYXJhbSBlbnRpdHkgdG8gdXBzZXJ0IGRpcmVjdGx5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIudXBzZXJ0T25lSW5DYWNoZShlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBvciB1cGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXRpZXMgbWlnaHQgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIFBhc3MgYW4gYXJyYXkgb2YgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWQuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byB1cHNlcnQgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwc2VydE1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwc2VydE1hbnlJbkNhY2hlKGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuc2V0RmlsdGVyKHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnNldExvYWRlZCghIWlzTG9hZGVkKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zZXRMb2FkaW5nKCEhaXNMb2FkaW5nKTtcbiAgfVxuXG4gIC8vIGVuZHJlZ2lvbiBEaXNwYXRjaCBjb21tYW5kc1xuXG4gIC8vIHJlZ2lvbiBTZWxlY3RvcnMkXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uIGFzIGEgd2hvbGUgKi9cbiAgY29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbjxUPj4gfCBTdG9yZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBjb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIGNvdW50JDogT2JzZXJ2YWJsZTxudW1iZXI+IHwgU3RvcmU8bnVtYmVyPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICBlbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIGVudGl0eUFjdGlvbnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIG1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICBlbnRpdHlNYXAkOiBPYnNlcnZhYmxlPERpY3Rpb25hcnk8VD4+IHwgU3RvcmU8RGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIGVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgZmlsdGVyJDogT2JzZXJ2YWJsZTxhbnk+IHwgU3RvcmU8YW55PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgZmlsdGVyZWRFbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIGtleXMkOiBPYnNlcnZhYmxlPHN0cmluZ1tdIHwgbnVtYmVyW10+IHwgU3RvcmU8c3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGxvYWRlZCAqL1xuICBsb2FkZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9yaWdpbmFsIGVudGl0eSB2YWx1ZXMgZm9yIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIGNoYW5nZVN0YXRlJDogT2JzZXJ2YWJsZTxDaGFuZ2VTdGF0ZU1hcDxUPj4gfCBTdG9yZTxDaGFuZ2VTdGF0ZU1hcDxUPj47XG5cbiAgLy8gZW5kcmVnaW9uIFNlbGVjdG9ycyRcbn1cbiJdfQ==