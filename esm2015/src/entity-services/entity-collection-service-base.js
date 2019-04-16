/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * \@params queryParams the query in a form understood by the server
     * @param {?} queryParams
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
     * @param {?} entities
     * @return {?}
     */
    addAllToCache(entities) {
        this.dispatcher.addAllToCache(entities);
    }
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity
     * @return {?}
     */
    addOneToCache(entity) {
        this.dispatcher.addOneToCache(entity);
    }
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities
     * @return {?}
     */
    addManyToCache(entities) {
        this.dispatcher.addManyToCache(entities);
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
     * @return {?}
     */
    removeOneFromCache(arg) {
        this.dispatcher.removeOneFromCache((/** @type {?} */ (arg)));
    }
    /**
     * @param {?} args
     * @return {?}
     */
    removeManyFromCache(args) {
        this.dispatcher.removeManyFromCache((/** @type {?} */ (args)));
    }
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity
     * @return {?}
     */
    updateOneInCache(entity) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        this.dispatcher.updateOneInCache(entity);
    }
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     * @param {?} entities
     * @return {?}
     */
    updateManyInCache(entities) {
        this.dispatcher.updateManyInCache(entities);
    }
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     * @param {?} entity
     * @return {?}
     */
    upsertOneInCache(entity) {
        this.dispatcher.upsertOneInCache(entity);
    }
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     * @param {?} entities
     * @return {?}
     */
    upsertManyInCache(entities) {
        this.dispatcher.upsertManyInCache(entities);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNLE9BQU8sMkJBQTJCOzs7OztJQWF0QyxZQUVrQixVQUFrQjtJQUNsQyxvRkFBb0Y7SUFDcEYsc0JBQThEO1FBRjlDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFJbEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztjQUN6QixFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUd6RSxVQUFVLENBQUM7UUFFYixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUVwQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDaEQsSUFB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QzNDLENBQUM7Ozs7Ozs7SUFNRCxpQkFBaUIsQ0FBQyxRQUFzQjtRQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Ozs7Ozs7SUFNRCxTQUFTLENBQUMsT0FBWTtRQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxDQUFDOzs7Ozs7SUFHRCxTQUFTLENBQUMsUUFBaUI7UUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Ozs7OztJQUdELFVBQVUsQ0FBQyxTQUFrQjtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQTBDRjs7Ozs7O0lBblpDLGlEQUF5Qzs7Ozs7SUFHekMsZ0RBQXVDOzs7OztJQUd2QyxpREFBd0I7Ozs7O0lBb0Z4Qiw0Q0FBNEI7Ozs7O0lBRzVCLCtDQUF3Qjs7Ozs7O0lBTXhCLCtDQUE0Qzs7Ozs7SUE0UTVDLGtEQUEwRTs7Ozs7SUFHMUUsNkNBQTJDOzs7OztJQUczQyxnREFBd0M7Ozs7O0lBR3hDLHFEQUF5Qzs7Ozs7SUFHekMsaURBQTZEOzs7OztJQUc3RCw4Q0FBa0M7Ozs7O0lBR2xDLDhDQUE0Qzs7Ozs7SUFHNUMsd0RBQWdEOzs7OztJQUdoRCw0Q0FBb0U7Ozs7O0lBR3BFLDhDQUE4Qzs7Ozs7SUFHOUMsK0NBQStDOzs7OztJQUcvQyxtREFBdUU7Ozs7O0lBdFlyRSxpREFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucyB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbixcbiAgQ2hhbmdlU3RhdGVNYXAsXG59IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYSBjb25jcmV0ZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPi5cbiAqIENhbiBiZSBpbnN0YW50aWF0ZWQuIENhbm5vdCBiZSBpbmplY3RlZC4gVXNlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB0byBjcmVhdGUuXG4gKiBAcGFyYW0gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50cyBUaGUgaW5ncmVkaWVudHMgZm9yIHRoaXMgc2VydmljZVxuICogYXMgYSBzb3VyY2Ugb2Ygc3VwcG9ydGluZyBzZXJ2aWNlcyBmb3IgY3JlYXRpbmcgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4gaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2U8XG4gIFQsXG4gIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbj4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gIC8qKiBEaXNwYXRjaGVyIG9mIEVudGl0eUNvbW1hbmRzIChFbnRpdHlBY3Rpb25zKSAqL1xuICByZWFkb25seSBkaXNwYXRjaGVyOiBFbnRpdHlEaXNwYXRjaGVyPFQ+O1xuXG4gIC8qKiBBbGwgc2VsZWN0b3JzIG9mIGVudGl0eSBjb2xsZWN0aW9uIHByb3BlcnRpZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD47XG5cbiAgLyoqIEFsbCBzZWxlY3RvcnMkIChvYnNlcnZhYmxlcyBvZiBlbnRpdHkgY29sbGVjdGlvbiBwcm9wZXJ0aWVzKSAqL1xuICByZWFkb25seSBzZWxlY3RvcnMkOiBTJDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhpcyBjb2xsZWN0aW9uIHNlcnZpY2UgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgdGhpcyBlbnRpdHkgdHlwZSAqL1xuICAgIHNlcnZpY2VFbGVtZW50c0ZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICkge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCB7IGRpc3BhdGNoZXIsIHNlbGVjdG9ycywgc2VsZWN0b3JzJCB9ID0gc2VydmljZUVsZW1lbnRzRmFjdG9yeS5jcmVhdGU8XG4gICAgICBULFxuICAgICAgUyRcbiAgICA+KGVudGl0eU5hbWUpO1xuXG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuZ3VhcmQgPSBkaXNwYXRjaGVyLmd1YXJkO1xuICAgIHRoaXMuc2VsZWN0SWQgPSBkaXNwYXRjaGVyLnNlbGVjdElkO1xuICAgIHRoaXMudG9VcGRhdGUgPSBkaXNwYXRjaGVyLnRvVXBkYXRlO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSBzZWxlY3RvcnM7XG4gICAgdGhpcy5zZWxlY3RvcnMkID0gc2VsZWN0b3JzJDtcbiAgICB0aGlzLmNvbGxlY3Rpb24kID0gc2VsZWN0b3JzJC5jb2xsZWN0aW9uJDtcbiAgICB0aGlzLmNvdW50JCA9IHNlbGVjdG9ycyQuY291bnQkO1xuICAgIHRoaXMuZW50aXRpZXMkID0gc2VsZWN0b3JzJC5lbnRpdGllcyQ7XG4gICAgdGhpcy5lbnRpdHlBY3Rpb25zJCA9IHNlbGVjdG9ycyQuZW50aXR5QWN0aW9ucyQ7XG4gICAgdGhpcy5lbnRpdHlNYXAkID0gc2VsZWN0b3JzJC5lbnRpdHlNYXAkO1xuICAgIHRoaXMuZXJyb3JzJCA9IHNlbGVjdG9ycyQuZXJyb3JzJDtcbiAgICB0aGlzLmZpbHRlciQgPSBzZWxlY3RvcnMkLmZpbHRlciQ7XG4gICAgdGhpcy5maWx0ZXJlZEVudGl0aWVzJCA9IHNlbGVjdG9ycyQuZmlsdGVyZWRFbnRpdGllcyQ7XG4gICAgdGhpcy5rZXlzJCA9IHNlbGVjdG9ycyQua2V5cyQ7XG4gICAgdGhpcy5sb2FkZWQkID0gc2VsZWN0b3JzJC5sb2FkZWQkO1xuICAgIHRoaXMubG9hZGluZyQgPSBzZWxlY3RvcnMkLmxvYWRpbmckO1xuICAgIHRoaXMuY2hhbmdlU3RhdGUkID0gc2VsZWN0b3JzJC5jaGFuZ2VTdGF0ZSQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5jcmVhdGVFbnRpdHlBY3Rpb24ob3AsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuY3JlYXRlQW5kRGlzcGF0Y2gob3AsIGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIGFjdGlvbiBvZiBhbnkgdHlwZSB0byB0aGUgbmdyeCBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBUaGUgTmdSeCBTdG9yZSBmb3IgdGhlIHtFbnRpdHlDYWNoZX0gKi9cbiAgZ2V0IHN0b3JlKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuc3RvcmU7XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLlxuICAgKi9cbiAgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuXG4gIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgLy8gcmVnaW9uIERpc3BhdGNoIGNvbW1hbmRzXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBhZGQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuYWRkKGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKSB3aXRoIHRoZSBnaXZlbiBjb3JyZWxhdGlvbklkLlxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyB0aGUgdGFnXG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuY2FuY2VsKGNvcnJlbGF0aW9uSWQsIHJlYXNvbiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGVudGl0eSB0byBkZWxldGVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG4gIGRlbGV0ZShcbiAgICBhcmc6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmRlbGV0ZShhcmcgYXMgYW55LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGxvYWQoKVxuICAgKi9cbiAgZ2V0QWxsKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmdldEFsbChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIHRoZSBlbnRpdHkgd2l0aCB0aGlzIHByaW1hcnkga2V5LlxuICAgKiBJZiB0aGUgc2VydmVyIHJldHVybnMgYW4gZW50aXR5LFxuICAgKiBtZXJnZSBpdCBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byBnZXQuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0eSB0aGF0IGlzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3Mgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0QnlLZXkoa2V5OiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRCeUtleShrZXksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbXMgcXVlcnlQYXJhbXMgdGhlIHF1ZXJ5IGluIGEgZm9ybSB1bmRlcnN0b29kIGJ5IHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXRXaXRoUXVlcnkocXVlcnlQYXJhbXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBsb2FkIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmxvYWQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHVwZGF0ZWQgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci51cGRhdGUoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIENhbGwgb25seSBpZiB0aGUgc2VydmVyIHN1cHBvcnRzIHVwc2VydC5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkIG9yIHVwc2VydC5cbiAgICogSXQgbWF5IG9taXQgaXRzIGtleSBpZiBhbiBhZGQsIGFuZCBpcyBwZXNzaW1pc3RpYywgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci51cHNlcnQoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiogQ2FjaGUtb25seSBvcGVyYXRpb25zIHRoYXQgZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZSAqKiovXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIGFkZEFsbFRvQ2FjaGUoZW50aXRpZXM6IFRbXSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5hZGRBbGxUb0NhY2hlKGVudGl0aWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuYWRkT25lVG9DYWNoZShlbnRpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtdWx0aXBsZSBuZXcgZW50aXRpZXMgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aXRoIHByaW1hcnkga2V5cyBhbHJlYWR5IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKi9cbiAgYWRkTWFueVRvQ2FjaGUoZW50aXRpZXM6IFRbXSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5hZGRNYW55VG9DYWNoZShlbnRpdGllcyk7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5jbGVhckNhY2hlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShlbnRpdHk6IFQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShrZXk6IG51bWJlciB8IHN0cmluZyk6IHZvaWQ7XG4gIHJlbW92ZU9uZUZyb21DYWNoZShhcmc6IChudW1iZXIgfCBzdHJpbmcpIHwgVCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5yZW1vdmVPbmVGcm9tQ2FjaGUoYXJnIGFzIGFueSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGVudGl0aWVzOiBUW10pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgbXVsdGlwbGUgZW50aXRpZXMgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGVzZSBlbnRpdGllcyBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoa2V5czogKG51bWJlciB8IHN0cmluZylbXSk6IHZvaWQ7XG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoYXJnczogKG51bWJlciB8IHN0cmluZylbXSB8IFRbXSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5yZW1vdmVNYW55RnJvbUNhY2hlKGFyZ3MgYXMgYW55W10pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4pOiB2b2lkIHtcbiAgICAvLyB1cGRhdGUgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICAvLyBwYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwZGF0ZU9uZUluQ2FjaGUoZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhlc2UgZW50aXRpZXMgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdob3NlIHByaW1hcnkga2V5cyBhcmUgbm90IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBVcGRhdGUgZW50aXRpZXMgbWF5IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBzdWNoIHBhcnRpYWwgZW50aXRpZXMgcGF0Y2ggdGhlaXIgY2FjaGVkIGNvdW50ZXJwYXJ0cy5cbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIudXBkYXRlTWFueUluQ2FjaGUoZW50aXRpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogVXBzZXJ0IGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIFBhc3MgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWRcbiAgICovXG4gIHVwc2VydE9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwc2VydE9uZUluQ2FjaGUoZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIHVwc2VydE1hbnlJbkNhY2hlKGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIudXBzZXJ0TWFueUluQ2FjaGUoZW50aXRpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGF0dGVybiB0aGF0IHRoZSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGFwcGxpZXNcbiAgICogd2hlbiB1c2luZyB0aGUgYGZpbHRlcmVkRW50aXRpZXNgIHNlbGVjdG9yLlxuICAgKi9cbiAgc2V0RmlsdGVyKHBhdHRlcm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zZXRGaWx0ZXIocGF0dGVybik7XG4gIH1cblxuICAvKiogU2V0IHRoZSBsb2FkZWQgZmxhZyAqL1xuICBzZXRMb2FkZWQoaXNMb2FkZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuc2V0TG9hZGVkKCEhaXNMb2FkZWQpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGluZyBmbGFnICovXG4gIHNldExvYWRpbmcoaXNMb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnNldExvYWRpbmcoISFpc0xvYWRpbmcpO1xuICB9XG5cbiAgLy8gZW5kcmVnaW9uIERpc3BhdGNoIGNvbW1hbmRzXG5cbiAgLy8gcmVnaW9uIFNlbGVjdG9ycyRcbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb24gYXMgYSB3aG9sZSAqL1xuICBjb2xsZWN0aW9uJDogT2JzZXJ2YWJsZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PiB8IFN0b3JlPEVudGl0eUNvbGxlY3Rpb248VD4+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGNvdW50IG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgY291bnQkOiBPYnNlcnZhYmxlPG51bWJlcj4gfCBTdG9yZTxudW1iZXI+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIGVudGl0aWVzJDogT2JzZXJ2YWJsZTxUW10+IHwgU3RvcmU8VFtdPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhY3Rpb25zIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkgdHlwZS4gKi9cbiAgZW50aXR5QWN0aW9ucyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgbWFwIG9mIGVudGl0eSBrZXlzIHRvIGVudGl0aWVzICovXG4gIGVudGl0eU1hcCQ6IE9ic2VydmFibGU8RGljdGlvbmFyeTxUPj4gfCBTdG9yZTxEaWN0aW9uYXJ5PFQ+PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25zIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkgdHlwZS4gKi9cbiAgZXJyb3JzJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBmaWx0ZXIgcGF0dGVybiBhcHBsaWVkIGJ5IHRoZSBlbnRpdHkgY29sbGVjdGlvbidzIGZpbHRlciBmdW5jdGlvbiAqL1xuICBmaWx0ZXIkOiBPYnNlcnZhYmxlPHN0cmluZz4gfCBTdG9yZTxzdHJpbmc+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB0aGF0IHBhc3MgdGhlIGZpbHRlciBmdW5jdGlvbiAqL1xuICBmaWx0ZXJlZEVudGl0aWVzJDogT2JzZXJ2YWJsZTxUW10+IHwgU3RvcmU8VFtdPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUga2V5cyBvZiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24sIGluIHRoZSBjb2xsZWN0aW9uJ3MgbmF0aXZlIHNvcnQgb3JkZXIgKi9cbiAga2V5cyQ6IE9ic2VydmFibGU8c3RyaW5nW10gfCBudW1iZXJbXT4gfCBTdG9yZTxzdHJpbmdbXSB8IG51bWJlcltdPjtcblxuICAvKiogT2JzZXJ2YWJsZSB0cnVlIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gbG9hZGVkICovXG4gIGxvYWRlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBTdG9yZTxib29sZWFuPjtcblxuICAvKiogT2JzZXJ2YWJsZSB0cnVlIHdoZW4gYSBtdWx0aS1lbnRpdHkgcXVlcnkgY29tbWFuZCBpcyBpbiBwcm9ncmVzcy4gKi9cbiAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBTdG9yZTxib29sZWFuPjtcblxuICAvKiogT3JpZ2luYWwgZW50aXR5IHZhbHVlcyBmb3IgZW50aXRpZXMgd2l0aCB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgY2hhbmdlU3RhdGUkOiBPYnNlcnZhYmxlPENoYW5nZVN0YXRlTWFwPFQ+PiB8IFN0b3JlPENoYW5nZVN0YXRlTWFwPFQ+PjtcblxuICAvLyBlbmRyZWdpb24gU2VsZWN0b3JzJFxufVxuIl19