/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-services/entity-collection-service-base.ts
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
    // region Dispatch commands
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} Observable of the entity
     * after server reports successful save or the save error.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTSxPQUFPLDJCQUEyQjs7Ozs7SUFhdEMsWUFFa0IsVUFBa0I7SUFDbEMsb0ZBQW9GO0lBQ3BGLHNCQUE4RDtRQUY5QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBSWxDLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Y0FDekIsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FHekUsVUFBVSxDQUFDO1FBRWIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFFcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQ2hELElB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L0MsbURBQXVFOzs7OztJQXphckUsaURBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IERpY3Rpb25hcnksIElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uLCBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkd1YXJkIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb24sXG4gIENoYW5nZVN0YXRlTWFwLFxufSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyIH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZWxlbWVudHMtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyQgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuaW1wb3J0IHsgUXVlcnlQYXJhbXMgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvaW50ZXJmYWNlcyc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZ1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGEgY29uY3JldGUgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4uXG4gKiBDYW4gYmUgaW5zdGFudGlhdGVkLiBDYW5ub3QgYmUgaW5qZWN0ZWQuIFVzZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgdG8gY3JlYXRlLlxuICogQHBhcmFtIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHMgVGhlIGluZ3JlZGllbnRzIGZvciB0aGlzIHNlcnZpY2VcbiAqIGFzIGEgc291cmNlIG9mIHN1cHBvcnRpbmcgc2VydmljZXMgZm9yIGNyZWF0aW5nIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IGluc3RhbmNlLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VCYXNlPFxuICBULFxuICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4+IGltcGxlbWVudHMgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAvKiogRGlzcGF0Y2hlciBvZiBFbnRpdHlDb21tYW5kcyAoRW50aXR5QWN0aW9ucykgKi9cbiAgcmVhZG9ubHkgZGlzcGF0Y2hlcjogRW50aXR5RGlzcGF0Y2hlcjxUPjtcblxuICAvKiogQWxsIHNlbGVjdG9ycyBvZiBlbnRpdHkgY29sbGVjdGlvbiBwcm9wZXJ0aWVzICovXG4gIHJlYWRvbmx5IHNlbGVjdG9yczogRW50aXR5U2VsZWN0b3JzPFQ+O1xuXG4gIC8qKiBBbGwgc2VsZWN0b3JzJCAob2JzZXJ2YWJsZXMgb2YgZW50aXR5IGNvbGxlY3Rpb24gcHJvcGVydGllcykgKi9cbiAgcmVhZG9ubHkgc2VsZWN0b3JzJDogUyQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoaXMgY29sbGVjdGlvbiBzZXJ2aWNlICovXG4gICAgcHVibGljIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICAvKiogQ3JlYXRlcyB0aGUgY29yZSBlbGVtZW50cyBvZiB0aGUgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIHRoaXMgZW50aXR5IHR5cGUgKi9cbiAgICBzZXJ2aWNlRWxlbWVudHNGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeVxuICApIHtcbiAgICBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gICAgY29uc3QgeyBkaXNwYXRjaGVyLCBzZWxlY3RvcnMsIHNlbGVjdG9ycyQgfSA9IHNlcnZpY2VFbGVtZW50c0ZhY3RvcnkuY3JlYXRlPFxuICAgICAgVCxcbiAgICAgIFMkXG4gICAgPihlbnRpdHlOYW1lKTtcblxuICAgIHRoaXMuZW50aXR5TmFtZSA9IGVudGl0eU5hbWU7XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmd1YXJkID0gZGlzcGF0Y2hlci5ndWFyZDtcbiAgICB0aGlzLnNlbGVjdElkID0gZGlzcGF0Y2hlci5zZWxlY3RJZDtcbiAgICB0aGlzLnRvVXBkYXRlID0gZGlzcGF0Y2hlci50b1VwZGF0ZTtcblxuICAgIHRoaXMuc2VsZWN0b3JzID0gc2VsZWN0b3JzO1xuICAgIHRoaXMuc2VsZWN0b3JzJCA9IHNlbGVjdG9ycyQ7XG4gICAgdGhpcy5jb2xsZWN0aW9uJCA9IHNlbGVjdG9ycyQuY29sbGVjdGlvbiQ7XG4gICAgdGhpcy5jb3VudCQgPSBzZWxlY3RvcnMkLmNvdW50JDtcbiAgICB0aGlzLmVudGl0aWVzJCA9IHNlbGVjdG9ycyQuZW50aXRpZXMkO1xuICAgIHRoaXMuZW50aXR5QWN0aW9ucyQgPSBzZWxlY3RvcnMkLmVudGl0eUFjdGlvbnMkO1xuICAgIHRoaXMuZW50aXR5TWFwJCA9IHNlbGVjdG9ycyQuZW50aXR5TWFwJDtcbiAgICB0aGlzLmVycm9ycyQgPSBzZWxlY3RvcnMkLmVycm9ycyQ7XG4gICAgdGhpcy5maWx0ZXIkID0gc2VsZWN0b3JzJC5maWx0ZXIkO1xuICAgIHRoaXMuZmlsdGVyZWRFbnRpdGllcyQgPSBzZWxlY3RvcnMkLmZpbHRlcmVkRW50aXRpZXMkO1xuICAgIHRoaXMua2V5cyQgPSBzZWxlY3RvcnMkLmtleXMkO1xuICAgIHRoaXMubG9hZGVkJCA9IHNlbGVjdG9ycyQubG9hZGVkJDtcbiAgICB0aGlzLmxvYWRpbmckID0gc2VsZWN0b3JzJC5sb2FkaW5nJDtcbiAgICB0aGlzLmNoYW5nZVN0YXRlJCA9IHNlbGVjdG9ycyQuY2hhbmdlU3RhdGUkO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlRW50aXR5QWN0aW9uPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuY3JlYXRlRW50aXR5QWN0aW9uKG9wLCBkYXRhLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUgYW5kXG4gICAqIGRpc3BhdGNoIGl0IGltbWVkaWF0ZWx5IHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVBbmREaXNwYXRjaDxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmNyZWF0ZUFuZERpc3BhdGNoKG9wLCBkYXRhLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBhY3Rpb24gb2YgYW55IHR5cGUgdG8gdGhlIG5ncnggc3RvcmUuXG4gICAqIEBwYXJhbSBhY3Rpb24gdGhlIEFjdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBBY3Rpb25cbiAgICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogQWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmRpc3BhdGNoKGFjdGlvbik7XG4gIH1cblxuICAvKiogVGhlIE5nUnggU3RvcmUgZm9yIHRoZSB7RW50aXR5Q2FjaGV9ICovXG4gIGdldCBzdG9yZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLnN0b3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgY2xhc3Mgd2l0aCBtZXRob2RzIHRvIHZhbGlkYXRlIEVudGl0eUFjdGlvbiBwYXlsb2Fkcy5cbiAgICovXG4gIGd1YXJkOiBFbnRpdHlBY3Rpb25HdWFyZDxUPjtcblxuICAvKiogUmV0dXJucyB0aGUgcHJpbWFyeSBrZXkgKGlkKSBvZiB0aGlzIGVudGl0eSAqL1xuICBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPjtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YCBvYmplY3RcbiAgICogYHVwZGF0ZS4uLmAgYW5kIGB1cHNlcnQuLi5gIG1ldGhvZHMgdGFrZSBgVXBkYXRlPFQ+YCBhcmdzXG4gICAqL1xuICB0b1VwZGF0ZTogKGVudGl0eTogUGFydGlhbDxUPikgPT4gVXBkYXRlPFQ+O1xuXG4gIC8vIHJlZ2lvbiBEaXNwYXRjaCBjb21tYW5kc1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmFkZChlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAocXVlcnkgb3Igc2F2ZSkgd2l0aCB0aGUgZ2l2ZW4gY29ycmVsYXRpb25JZC5cbiAgICogQHBhcmFtIGNvcnJlbGF0aW9uSWQgVGhlIGNvcnJlbGF0aW9uIGlkIGZvciB0aGUgY29ycmVzcG9uZGluZyBFbnRpdHlBY3Rpb25cbiAgICogQHBhcmFtIFtyZWFzb25dIGV4cGxhaW5zIHdoeSBjYW5jZWxlZCBhbmQgYnkgd2hvbS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgdGhlIHRhZyBhbmQgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgY2FuY2VsKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmNhbmNlbChjb3JyZWxhdGlvbklkLCByZWFzb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBlbnRpdHkgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuICBkZWxldGUoXG4gICAgYXJnOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5kZWxldGUoYXJnIGFzIGFueSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIG1lcmdlIHRoZSBxdWVyaWVkIGVudGl0aWVzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBsb2FkKClcbiAgICovXG4gIGdldEFsbChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRBbGwob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXR5IHdpdGggdGhpcyBwcmltYXJ5IGtleS5cbiAgICogSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGVudGl0eSxcbiAgICogbWVyZ2UgaXQgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gZ2V0LlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdHkgdGhhdCBpcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldEJ5S2V5KGtleTogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZ2V0QnlLZXkoa2V5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdGllcyB0aGF0IHNhdGlzZnkgYSBxdWVyeSBleHByZXNzZWRcbiAgICogd2l0aCBlaXRoZXIgYSBxdWVyeSBwYXJhbWV0ZXIgbWFwIG9yIGFuIEhUVFAgVVJMIHF1ZXJ5IHN0cmluZyxcbiAgICogYW5kIG1lcmdlIHRoZSByZXN1bHRzIGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gcXVlcnlQYXJhbXMgdGhlIHF1ZXJ5IGluIGEgZm9ybSB1bmRlcnN0b29kIGJ5IHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRXaXRoUXVlcnkocXVlcnlQYXJhbXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBsb2FkIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmxvYWQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHVwZGF0ZWQgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci51cGRhdGUoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIENhbGwgb25seSBpZiB0aGUgc2VydmVyIHN1cHBvcnRzIHVwc2VydC5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkIG9yIHVwc2VydC5cbiAgICogSXQgbWF5IG9taXQgaXRzIGtleSBpZiBhbiBhZGQsIGFuZCBpcyBwZXNzaW1pc3RpYywgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci51cHNlcnQoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiogQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZSAqKiovXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0aWVzIHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkQWxsVG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5hZGRBbGxUb0NhY2hlKGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gZW50aXR5IHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmFkZE9uZVRvQ2FjaGUoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogQHBhcmFtIGVudGl0aWVzIHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkTWFueVRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuYWRkTWFueVRvQ2FjaGUoZW50aXRpZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuY2xlYXJDYWNoZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShrZXk6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoXG4gICAgYXJnOiAobnVtYmVyIHwgc3RyaW5nKSB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnJlbW92ZU9uZUZyb21DYWNoZShhcmcgYXMgYW55LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdIHwgVFtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5yZW1vdmVNYW55RnJvbUNhY2hlKGFyZ3MgYXMgYW55W10sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHRvIHVwZGF0ZSBkaXJlY3RseSBpbiBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZCB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIHRoaXMuZGlzcGF0Y2hlci51cGRhdGVPbmVJbkNhY2hlKGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoZXNlIGVudGl0aWVzIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aG9zZSBwcmltYXJ5IGtleXMgYXJlIG5vdCBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogVXBkYXRlIGVudGl0aWVzIG1heSBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogc3VjaCBwYXJ0aWFsIGVudGl0aWVzIHBhdGNoIHRoZWlyIGNhY2hlZCBjb3VudGVycGFydHMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byB1cGRhdGUgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwZGF0ZU1hbnlJbkNhY2hlKGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgb3IgdXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogVXBzZXJ0IGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIFBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWQuXG4gICAqIEBwYXJhbSBlbnRpdHkgdG8gdXBzZXJ0IGRpcmVjdGx5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIudXBzZXJ0T25lSW5DYWNoZShlbnRpdHksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBvciB1cGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXRpZXMgbWlnaHQgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIFBhc3MgYW4gYXJyYXkgb2YgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWQuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byB1cHNlcnQgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwc2VydE1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwc2VydE1hbnlJbkNhY2hlKGVudGl0aWVzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuc2V0RmlsdGVyKHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnNldExvYWRlZCghIWlzTG9hZGVkKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zZXRMb2FkaW5nKCEhaXNMb2FkaW5nKTtcbiAgfVxuXG4gIC8vIGVuZHJlZ2lvbiBEaXNwYXRjaCBjb21tYW5kc1xuXG4gIC8vIHJlZ2lvbiBTZWxlY3RvcnMkXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uIGFzIGEgd2hvbGUgKi9cbiAgY29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbjxUPj4gfCBTdG9yZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBjb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIGNvdW50JDogT2JzZXJ2YWJsZTxudW1iZXI+IHwgU3RvcmU8bnVtYmVyPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICBlbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIGVudGl0eUFjdGlvbnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIG1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICBlbnRpdHlNYXAkOiBPYnNlcnZhYmxlPERpY3Rpb25hcnk8VD4+IHwgU3RvcmU8RGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIGVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgZmlsdGVyJDogT2JzZXJ2YWJsZTxhbnk+IHwgU3RvcmU8YW55PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgZmlsdGVyZWRFbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIGtleXMkOiBPYnNlcnZhYmxlPHN0cmluZ1tdIHwgbnVtYmVyW10+IHwgU3RvcmU8c3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGxvYWRlZCAqL1xuICBsb2FkZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9yaWdpbmFsIGVudGl0eSB2YWx1ZXMgZm9yIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIGNoYW5nZVN0YXRlJDogT2JzZXJ2YWJsZTxDaGFuZ2VTdGF0ZU1hcDxUPj4gfCBTdG9yZTxDaGFuZ2VTdGF0ZU1hcDxUPj47XG5cbiAgLy8gZW5kcmVnaW9uIFNlbGVjdG9ycyRcbn1cbiJdfQ==