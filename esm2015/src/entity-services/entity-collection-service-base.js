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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNLE9BQU8sMkJBQTJCOzs7OztJQWF0QyxZQUVrQixVQUFrQjtJQUNsQyxvRkFBb0Y7SUFDcEYsc0JBQThEO1FBRjlDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFJbEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztjQUN6QixFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUd6RSxVQUFVLENBQUM7UUFFYixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUVwQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDaEQsSUFB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M0MsQ0FBQzs7Ozs7OztJQU1ELGlCQUFpQixDQUFDLFFBQXNCO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7Ozs7OztJQU1ELFNBQVMsQ0FBQyxPQUFZO1FBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Ozs7OztJQUdELFNBQVMsQ0FBQyxRQUFpQjtRQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7Ozs7O0lBR0QsVUFBVSxDQUFDLFNBQWtCO1FBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBMENGOzs7Ozs7SUFuWkMsaURBQXlDOzs7OztJQUd6QyxnREFBdUM7Ozs7O0lBR3ZDLGlEQUF3Qjs7Ozs7SUFvRnhCLDRDQUE0Qjs7Ozs7SUFHNUIsK0NBQXdCOzs7Ozs7SUFNeEIsK0NBQTRDOzs7OztJQTRRNUMsa0RBQTBFOzs7OztJQUcxRSw2Q0FBMkM7Ozs7O0lBRzNDLGdEQUF3Qzs7Ozs7SUFHeEMscURBQXlDOzs7OztJQUd6QyxpREFBNkQ7Ozs7O0lBRzdELDhDQUFrQzs7Ozs7SUFHbEMsOENBQTRDOzs7OztJQUc1Qyx3REFBZ0Q7Ozs7O0lBR2hELDRDQUFvRTs7Ozs7SUFHcEUsOENBQThDOzs7OztJQUc5QywrQ0FBK0M7Ozs7O0lBRy9DLG1EQUF1RTs7Ozs7SUF0WXJFLGlEQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zIH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5LCBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25HdWFyZCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1ndWFyZCc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uLFxuICBDaGFuZ2VTdGF0ZU1hcCxcbn0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWVsZW1lbnRzLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IFF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2ludGVyZmFjZXMnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptZW1iZXItb3JkZXJpbmdcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhIGNvbmNyZXRlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+LlxuICogQ2FuIGJlIGluc3RhbnRpYXRlZC4gQ2Fubm90IGJlIGluamVjdGVkLiBVc2UgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzIFRoZSBpbmdyZWRpZW50cyBmb3IgdGhpcyBzZXJ2aWNlXG4gKiBhcyBhIHNvdXJjZSBvZiBzdXBwb3J0aW5nIHNlcnZpY2VzIGZvciBjcmVhdGluZyBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlQmFzZTxcbiAgVCxcbiAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuPiBpbXBsZW1lbnRzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgLyoqIERpc3BhdGNoZXIgb2YgRW50aXR5Q29tbWFuZHMgKEVudGl0eUFjdGlvbnMpICovXG4gIHJlYWRvbmx5IGRpc3BhdGNoZXI6IEVudGl0eURpc3BhdGNoZXI8VD47XG5cbiAgLyoqIEFsbCBzZWxlY3RvcnMgb2YgZW50aXR5IGNvbGxlY3Rpb24gcHJvcGVydGllcyAqL1xuICByZWFkb25seSBzZWxlY3RvcnM6IEVudGl0eVNlbGVjdG9yczxUPjtcblxuICAvKiogQWxsIHNlbGVjdG9ycyQgKG9ic2VydmFibGVzIG9mIGVudGl0eSBjb2xsZWN0aW9uIHByb3BlcnRpZXMpICovXG4gIHJlYWRvbmx5IHNlbGVjdG9ycyQ6IFMkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBvZiB0aGlzIGNvbGxlY3Rpb24gc2VydmljZSAqL1xuICAgIHB1YmxpYyByZWFkb25seSBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgLyoqIENyZWF0ZXMgdGhlIGNvcmUgZWxlbWVudHMgb2YgdGhlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciB0aGlzIGVudGl0eSB0eXBlICovXG4gICAgc2VydmljZUVsZW1lbnRzRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnlcbiAgKSB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IHsgZGlzcGF0Y2hlciwgc2VsZWN0b3JzLCBzZWxlY3RvcnMkIH0gPSBzZXJ2aWNlRWxlbWVudHNGYWN0b3J5LmNyZWF0ZTxcbiAgICAgIFQsXG4gICAgICBTJFxuICAgID4oZW50aXR5TmFtZSk7XG5cbiAgICB0aGlzLmVudGl0eU5hbWUgPSBlbnRpdHlOYW1lO1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG4gICAgdGhpcy5ndWFyZCA9IGRpc3BhdGNoZXIuZ3VhcmQ7XG4gICAgdGhpcy5zZWxlY3RJZCA9IGRpc3BhdGNoZXIuc2VsZWN0SWQ7XG4gICAgdGhpcy50b1VwZGF0ZSA9IGRpc3BhdGNoZXIudG9VcGRhdGU7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IHNlbGVjdG9ycztcbiAgICB0aGlzLnNlbGVjdG9ycyQgPSBzZWxlY3RvcnMkO1xuICAgIHRoaXMuY29sbGVjdGlvbiQgPSBzZWxlY3RvcnMkLmNvbGxlY3Rpb24kO1xuICAgIHRoaXMuY291bnQkID0gc2VsZWN0b3JzJC5jb3VudCQ7XG4gICAgdGhpcy5lbnRpdGllcyQgPSBzZWxlY3RvcnMkLmVudGl0aWVzJDtcbiAgICB0aGlzLmVudGl0eUFjdGlvbnMkID0gc2VsZWN0b3JzJC5lbnRpdHlBY3Rpb25zJDtcbiAgICB0aGlzLmVudGl0eU1hcCQgPSBzZWxlY3RvcnMkLmVudGl0eU1hcCQ7XG4gICAgdGhpcy5lcnJvcnMkID0gc2VsZWN0b3JzJC5lcnJvcnMkO1xuICAgIHRoaXMuZmlsdGVyJCA9IHNlbGVjdG9ycyQuZmlsdGVyJDtcbiAgICB0aGlzLmZpbHRlcmVkRW50aXRpZXMkID0gc2VsZWN0b3JzJC5maWx0ZXJlZEVudGl0aWVzJDtcbiAgICB0aGlzLmtleXMkID0gc2VsZWN0b3JzJC5rZXlzJDtcbiAgICB0aGlzLmxvYWRlZCQgPSBzZWxlY3RvcnMkLmxvYWRlZCQ7XG4gICAgdGhpcy5sb2FkaW5nJCA9IHNlbGVjdG9ycyQubG9hZGluZyQ7XG4gICAgdGhpcy5jaGFuZ2VTdGF0ZSQgPSBzZWxlY3RvcnMkLmNoYW5nZVN0YXRlJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUVudGl0eUFjdGlvbjxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmNyZWF0ZUVudGl0eUFjdGlvbihvcCwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlIGFuZFxuICAgKiBkaXNwYXRjaCBpdCBpbW1lZGlhdGVseSB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlQW5kRGlzcGF0Y2g8UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5jcmVhdGVBbmREaXNwYXRjaChvcCwgZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gYWN0aW9uIG9mIGFueSB0eXBlIHRvIHRoZSBuZ3J4IHN0b3JlLlxuICAgKiBAcGFyYW0gYWN0aW9uIHRoZSBBY3Rpb25cbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgQWN0aW9uXG4gICAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbik6IEFjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5kaXNwYXRjaChhY3Rpb24pO1xuICB9XG5cbiAgLyoqIFRoZSBOZ1J4IFN0b3JlIGZvciB0aGUge0VudGl0eUNhY2hlfSAqL1xuICBnZXQgc3RvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5zdG9yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IGNsYXNzIHdpdGggbWV0aG9kcyB0byB2YWxpZGF0ZSBFbnRpdHlBY3Rpb24gcGF5bG9hZHMuXG4gICAqL1xuICBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG5cbiAgLyoqIFJldHVybnMgdGhlIHByaW1hcnkga2V5IChpZCkgb2YgdGhpcyBlbnRpdHkgKi9cbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmAgb2JqZWN0XG4gICAqIGB1cGRhdGUuLi5gIGFuZCBgdXBzZXJ0Li4uYCBtZXRob2RzIHRha2UgYFVwZGF0ZTxUPmAgYXJnc1xuICAgKi9cbiAgdG9VcGRhdGU6IChlbnRpdHk6IFBhcnRpYWw8VD4pID0+IFVwZGF0ZTxUPjtcblxuICAvLyByZWdpb24gRGlzcGF0Y2ggY29tbWFuZHNcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byBhZGQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGFkZChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5hZGQoZW50aXR5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gY2FuY2VsIHRoZSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gKHF1ZXJ5IG9yIHNhdmUpIHdpdGggdGhlIGdpdmVuIGNvcnJlbGF0aW9uSWQuXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgRW50aXR5QWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIHRoZSB0YWdcbiAgICovXG4gIGNhbmNlbChcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5jYW5jZWwoY29ycmVsYXRpb25JZCwgcmVhc29uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgZW50aXR5IHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgZGVsZXRlZCBrZXlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgZGVsZXRlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSBvZiB0aGUgZGVsZXRlZCBrZXlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgZGVsZXRlKFxuICAgIGtleTogbnVtYmVyIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcbiAgZGVsZXRlKFxuICAgIGFyZzogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZGVsZXRlKGFyZyBhcyBhbnksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBtZXJnZSB0aGUgcXVlcmllZCBlbnRpdGllcyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgbG9hZCgpXG4gICAqL1xuICBnZXRBbGwob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZ2V0QWxsKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0eSB3aXRoIHRoaXMgcHJpbWFyeSBrZXkuXG4gICAqIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBlbnRpdHksXG4gICAqIG1lcmdlIGl0IGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIGdldC5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXR5IHRoYXQgaXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2VzcyBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRCeUtleShrZXk6IGFueSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmdldEJ5S2V5KGtleSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXRpZXMgdGhhdCBzYXRpc2Z5IGEgcXVlcnkgZXhwcmVzc2VkXG4gICAqIHdpdGggZWl0aGVyIGEgcXVlcnkgcGFyYW1ldGVyIG1hcCBvciBhbiBIVFRQIFVSTCBxdWVyeSBzdHJpbmcsXG4gICAqIGFuZCBtZXJnZSB0aGUgcmVzdWx0cyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHF1ZXJ5UGFyYW1zIHRoZSBxdWVyeSBpbiBhIGZvcm0gdW5kZXJzdG9vZCBieSB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0V2l0aFF1ZXJ5KFxuICAgIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZ2V0V2l0aFF1ZXJ5KHF1ZXJ5UGFyYW1zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogY29tcGxldGVseSByZXBsYWNlIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB3aXRoIHRoZSBxdWVyaWVkIGVudGl0aWVzLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbG9hZCBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGdldEFsbFxuICAgKi9cbiAgbG9hZChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5sb2FkKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIHRoZSB1cGRhdGVkIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICogQHBhcmFtIGVudGl0eSB1cGRhdGUgZW50aXR5LCB3aGljaCBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSB1cGRhdGVkIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIudXBkYXRlKGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBDYWxsIG9ubHkgaWYgdGhlIHNlcnZlciBzdXBwb3J0cyB1cHNlcnQuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCBvciB1cHNlcnQuXG4gICAqIEl0IG1heSBvbWl0IGl0cyBrZXkgaWYgYW4gYWRkLCBhbmQgaXMgcGVzc2ltaXN0aWMsIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cHNlcnQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIudXBzZXJ0KGVudGl0eSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKioqIENhY2hlLW9ubHkgb3BlcmF0aW9ucyB0aGF0IGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2UgKioqL1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICBhZGRBbGxUb0NhY2hlKGVudGl0aWVzOiBUW10pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuYWRkQWxsVG9DYWNoZShlbnRpdGllcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggdGhlIHNhbWUgcHJpbWFyeSBrZXkgaXMgYWxyZWFkeSBpbiBjYWNoZS5cbiAgICovXG4gIGFkZE9uZVRvQ2FjaGUoZW50aXR5OiBUKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmFkZE9uZVRvQ2FjaGUoZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICovXG4gIGFkZE1hbnlUb0NhY2hlKGVudGl0aWVzOiBUW10pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuYWRkTWFueVRvQ2FjaGUoZW50aXRpZXMpO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuY2xlYXJDYWNoZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoZW50aXR5OiBUKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiB2b2lkO1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoYXJnOiAobnVtYmVyIHwgc3RyaW5nKSB8IFQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIucmVtb3ZlT25lRnJvbUNhY2hlKGFyZyBhcyBhbnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10pOiB2b2lkO1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGFyZ3M6IChudW1iZXIgfCBzdHJpbmcpW10gfCBUW10pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIucmVtb3ZlTWFueUZyb21DYWNoZShhcmdzIGFzIGFueVtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhhdCBlbnRpdHkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggbWF0Y2hpbmcgcHJpbWFyeSBrZXkgaXMgbm90IGluIGNhY2hlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICovXG4gIHVwZGF0ZU9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+KTogdm9pZCB7XG4gICAgLy8gdXBkYXRlIGVudGl0eSBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAgLy8gcGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgIHRoaXMuZGlzcGF0Y2hlci51cGRhdGVPbmVJbkNhY2hlKGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoZXNlIGVudGl0aWVzIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aG9zZSBwcmltYXJ5IGtleXMgYXJlIG5vdCBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogVXBkYXRlIGVudGl0aWVzIG1heSBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogc3VjaCBwYXJ0aWFsIGVudGl0aWVzIHBhdGNoIHRoZWlyIGNhY2hlZCBjb3VudGVycGFydHMuXG4gICAqL1xuICB1cGRhdGVNYW55SW5DYWNoZShlbnRpdGllczogUGFydGlhbDxUPltdKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwZGF0ZU1hbnlJbkNhY2hlKGVudGl0aWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgdXBkYXRlIGEgbmV3IGVudGl0eSBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBQYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci51cHNlcnRPbmVJbkNhY2hlKGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqL1xuICB1cHNlcnRNYW55SW5DYWNoZShlbnRpdGllczogUGFydGlhbDxUPltdKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnVwc2VydE1hbnlJbkNhY2hlKGVudGl0aWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuc2V0RmlsdGVyKHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnNldExvYWRlZCghIWlzTG9hZGVkKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zZXRMb2FkaW5nKCEhaXNMb2FkaW5nKTtcbiAgfVxuXG4gIC8vIGVuZHJlZ2lvbiBEaXNwYXRjaCBjb21tYW5kc1xuXG4gIC8vIHJlZ2lvbiBTZWxlY3RvcnMkXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uIGFzIGEgd2hvbGUgKi9cbiAgY29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbjxUPj4gfCBTdG9yZTxFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBjb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIGNvdW50JDogT2JzZXJ2YWJsZTxudW1iZXI+IHwgU3RvcmU8bnVtYmVyPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICBlbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIGVudGl0eUFjdGlvbnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIG1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICBlbnRpdHlNYXAkOiBPYnNlcnZhYmxlPERpY3Rpb25hcnk8VD4+IHwgU3RvcmU8RGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIGVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgZmlsdGVyJDogT2JzZXJ2YWJsZTxzdHJpbmc+IHwgU3RvcmU8c3RyaW5nPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgZmlsdGVyZWRFbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIGtleXMkOiBPYnNlcnZhYmxlPHN0cmluZ1tdIHwgbnVtYmVyW10+IHwgU3RvcmU8c3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGxvYWRlZCAqL1xuICBsb2FkZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9yaWdpbmFsIGVudGl0eSB2YWx1ZXMgZm9yIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIGNoYW5nZVN0YXRlJDogT2JzZXJ2YWJsZTxDaGFuZ2VTdGF0ZU1hcDxUPj4gfCBTdG9yZTxDaGFuZ2VTdGF0ZU1hcDxUPj47XG5cbiAgLy8gZW5kcmVnaW9uIFNlbGVjdG9ycyRcbn1cbiJdfQ==