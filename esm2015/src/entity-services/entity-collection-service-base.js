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
//# sourceMappingURL=entity-collection-service-base.js.map