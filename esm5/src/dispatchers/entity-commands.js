/**
 * @fileoverview added by tsickle
 * Generated from: src/dispatchers/entity-commands.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Commands that update the remote server.
 * @record
 * @template T
 */
export function EntityServerCommands() { }
if (false) {
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    EntityServerCommands.prototype.add = function (entity, options) { };
    /**
     * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
     * @param {?} correlationId The correlation id for the corresponding EntityAction
     * @param {?=} reason
     * @param {?=} options
     * @return {?}
     */
    EntityServerCommands.prototype.cancel = function (correlationId, reason, options) { };
    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param {?} entity
     * @param {?=} options
     * @return {?} A terminating Observable of the deleted key
     * after server reports successful save or the save error.
     */
    EntityServerCommands.prototype.delete = function (entity, options) { };
    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param {?} key The primary key of the entity to remove
     * @param {?=} options
     * @return {?} Observable of the deleted key
     * after server reports successful save or the save error.
     */
    EntityServerCommands.prototype.delete = function (key, options) { };
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @see load()
     * @param {?=} options
     * @return {?} A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    EntityServerCommands.prototype.getAll = function (options) { };
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param {?} key The primary key of the entity to get.
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities that are in the collection
     * after server reports success or the query error.
     */
    EntityServerCommands.prototype.getByKey = function (key, options) { };
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param {?} queryParams the query in a form understood by the server
     * @param {?=} options
     * @return {?} A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    EntityServerCommands.prototype.getWithQuery = function (queryParams, options) { };
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @see getAll
     * @param {?=} options
     * @return {?} A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     */
    EntityServerCommands.prototype.load = function (options) { };
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param {?} entity update entity, which might be a partial of T but must at least have its key.
     * @param {?=} options
     * @return {?} A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    EntityServerCommands.prototype.update = function (entity, options) { };
    /**
     * Dispatch action to save a new or update an existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param {?} entity entity to upsert, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param {?=} options
     * @return {?} A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    EntityServerCommands.prototype.upsert = function (entity, options) { };
}
/**
 * A collection's cache-only commands, which do not update remote storage **
 * @record
 * @template T
 */
export function EntityCacheCommands() { }
if (false) {
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     * @param {?} entities to add directly to cache.
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.addAllToCache = function (entities, options) { };
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity to add directly to cache.
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.addOneToCache = function (entity, options) { };
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities to add directly to cache.
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.addManyToCache = function (entities, options) { };
    /**
     * Clear the cached entity collection
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.clearCache = function (options) { };
    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param {?} entity The entity to remove
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.removeOneFromCache = function (entity, options) { };
    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param {?} key The primary key of the entity to remove
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.removeOneFromCache = function (key, options) { };
    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.removeManyFromCache = function (entities, options) { };
    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param {?} keys The primary keys of the entities to remove
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.removeManyFromCache = function (keys, options) { };
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
    EntityCacheCommands.prototype.updateOneInCache = function (entity, options) { };
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
    EntityCacheCommands.prototype.updateManyInCache = function (entities, options) { };
    /**
     * Insert or update a cached entity directly.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload.
     * @param {?} entity to upsert directly in cache.
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.upsertOneInCache = function (entity, options) { };
    /**
     * Insert or update multiple cached entities directly.
     * Does not save to remote storage.
     * Upsert entities might be partial but must at least have their keys.
     * Pass an array of the Update<T> structure as the payload.
     * @param {?} entities to upsert directly in cache.
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.upsertManyInCache = function (entities, options) { };
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     * @param {?} pattern
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.setFilter = function (pattern, options) { };
    /**
     * Set the loaded flag
     * @param {?} isLoaded
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.setLoaded = function (isLoaded, options) { };
    /**
     * Set the loading flag
     * @param {?} isLoading
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.setLoading = function (isLoading, options) { };
}
/**
 * Commands that dispatch entity actions for a collection
 * @record
 * @template T
 */
export function EntityCommands() { }
//# sourceMappingURL=entity-commands.js.map