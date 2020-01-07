/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dispatchers/entity-commands.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbW1hbmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBLDBDQTRHQzs7Ozs7Ozs7OztJQXBHQyxvRUFBNkQ7Ozs7Ozs7O0lBUTdELHNGQUlROzs7Ozs7OztJQVNSLHVFQUE4RTs7Ozs7Ozs7SUFTOUUsb0VBRytCOzs7Ozs7Ozs7SUFVL0IsK0RBQXVEOzs7Ozs7Ozs7O0lBV3ZELHNFQUFpRTs7Ozs7Ozs7OztJQVdqRSxrRkFHbUI7Ozs7Ozs7OztJQVVuQiw2REFBcUQ7Ozs7Ozs7Ozs7SUFXckQsdUVBQXlFOzs7Ozs7Ozs7O0lBVXpFLHVFQUFnRTs7Ozs7OztBQUtsRSx5Q0E0SEM7Ozs7Ozs7OztJQXJIQywrRUFBa0U7Ozs7Ozs7OztJQVNsRSw2RUFBOEQ7Ozs7Ozs7OztJQVM5RCxnRkFBbUU7Ozs7OztJQUduRSxrRUFBZ0Q7Ozs7Ozs7O0lBUWhELGtGQUFtRTs7Ozs7Ozs7SUFRbkUsK0VBQThFOzs7Ozs7OztJQVE5RSxxRkFBd0U7Ozs7Ozs7O0lBUXhFLGlGQUdROzs7Ozs7Ozs7OztJQVdSLGdGQUEwRTs7Ozs7Ozs7Ozs7SUFXMUUsbUZBR1E7Ozs7Ozs7Ozs7SUFVUixnRkFBMEU7Ozs7Ozs7Ozs7SUFVMUUsbUZBR1E7Ozs7Ozs7O0lBTVIsMEVBQTZEOzs7Ozs7O0lBRzdELDJFQUFrRTs7Ozs7OztJQUdsRSw2RUFBb0U7Ozs7Ozs7QUFJdEUsb0NBRTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcblxuLyoqIENvbW1hbmRzIHRoYXQgdXBkYXRlIHRoZSByZW1vdGUgc2VydmVyLiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlTZXJ2ZXJDb21tYW5kczxUPiB7XG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGFkZChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKSB3aXRoIHRoZSBnaXZlbiBjb3JyZWxhdGlvbklkLlxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyB0aGUgdGFnXG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgZW50aXR5IHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgbG9hZCgpXG4gICAqL1xuICBnZXRBbGwob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0eSB3aXRoIHRoaXMgcHJpbWFyeSBrZXkuXG4gICAqIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBlbnRpdHksXG4gICAqIG1lcmdlIGl0IGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIGdldC5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllcyB0aGF0IGFyZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldEJ5S2V5KGtleTogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBxdWVyeVBhcmFtcyB0aGUgcXVlcnkgaW4gYSBmb3JtIHVuZGVyc3Rvb2QgYnkgdGhlIHNlcnZlclxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0V2l0aFF1ZXJ5KFxuICAgIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPFRbXT47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBjb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHdpdGggdGhlIHF1ZXJpZWQgZW50aXRpZXMuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBsb2FkIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgZ2V0QWxsXG4gICAqL1xuICBsb2FkKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSB0aGUgdXBkYXRlZCBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqIEBwYXJhbSBlbnRpdHkgdXBkYXRlIGVudGl0eSwgd2hpY2ggbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSB1cGRhdGVkIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IG9yIHVwZGF0ZSBhbiBleGlzdGluZyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIE9ubHkgZGlzcGF0Y2ggdGhpcyBhY3Rpb24gaWYgeW91ciBzZXJ2ZXIgc3VwcG9ydHMgdXBzZXJ0LlxuICAgKiBAcGFyYW0gZW50aXR5IGVudGl0eSB0byB1cHNlcnQsIHdoaWNoIG1heSBvbWl0IGl0cyBrZXkgaWYgcGVzc2ltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgY3JlYXRlcyB0aGUga2V5O1xuICAgKiBtdXN0IGhhdmUgYSBrZXkgaWYgb3B0aW1pc3RpYyBzYXZlLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0eVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICB1cHNlcnQoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD47XG59XG5cbi8qKiogQSBjb2xsZWN0aW9uJ3MgY2FjaGUtb25seSBjb21tYW5kcywgd2hpY2ggZG8gbm90IHVwZGF0ZSByZW1vdGUgc3RvcmFnZSAqKiovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q2FjaGVDb21tYW5kczxUPiB7XG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byBhZGQgZGlyZWN0bHkgdG8gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIGFkZEFsbFRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gZW50aXR5IHRvIGFkZCBkaXJlY3RseSB0byBjYWNoZS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIG5ldyBlbnRpdGllcyBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdpdGggcHJpbWFyeSBrZXlzIGFscmVhZHkgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byBhZGQgZGlyZWN0bHkgdG8gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIGFkZE1hbnlUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZW50aXR5IGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhhdCBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgbWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHJlbW92ZU1hbnlGcm9tQ2FjaGUoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhhdCBlbnRpdHkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIElnbm9yZWQgaWYgYW4gZW50aXR5IHdpdGggbWF0Y2hpbmcgcHJpbWFyeSBrZXkgaXMgbm90IGluIGNhY2hlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICogQHBhcmFtIGVudGl0eSB0byB1cGRhdGUgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwZGF0ZU9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGVzZSBlbnRpdGllcyBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2hvc2UgcHJpbWFyeSBrZXlzIGFyZSBub3QgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqIFVwZGF0ZSBlbnRpdGllcyBtYXkgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIHN1Y2ggcGFydGlhbCBlbnRpdGllcyBwYXRjaCB0aGVpciBjYWNoZWQgY291bnRlcnBhcnRzLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgdG8gdXBkYXRlIGRpcmVjdGx5IGluIGNhY2hlLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyBtZXJnZVN0cmF0ZWd5XG4gICAqL1xuICB1cGRhdGVNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEluc2VydCBvciB1cGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogUGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZC5cbiAgICogQHBhcmFtIGVudGl0eSB0byB1cHNlcnQgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwc2VydE9uZUluQ2FjaGUoZW50aXR5OiBQYXJ0aWFsPFQ+LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEluc2VydCBvciB1cGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXRpZXMgbWlnaHQgYmUgcGFydGlhbCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqIFBhc3MgYW4gYXJyYXkgb2YgdGhlIFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgYXMgdGhlIHBheWxvYWQuXG4gICAqIEBwYXJhbSBlbnRpdGllcyB0byB1cHNlcnQgZGlyZWN0bHkgaW4gY2FjaGUuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIG1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHVwc2VydE1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcblxuICAvKipcbiAgICogU2V0IHRoZSBwYXR0ZXJuIHRoYXQgdGhlIGNvbGxlY3Rpb24ncyBmaWx0ZXIgYXBwbGllc1xuICAgKiB3aGVuIHVzaW5nIHRoZSBgZmlsdGVyZWRFbnRpdGllc2Agc2VsZWN0b3IuXG4gICAqL1xuICBzZXRGaWx0ZXIocGF0dGVybjogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqIFNldCB0aGUgbG9hZGVkIGZsYWcgKi9cbiAgc2V0TG9hZGVkKGlzTG9hZGVkOiBib29sZWFuLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqIFNldCB0aGUgbG9hZGluZyBmbGFnICovXG4gIHNldExvYWRpbmcoaXNMb2FkaW5nOiBib29sZWFuLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG59XG5cbi8qKiBDb21tYW5kcyB0aGF0IGRpc3BhdGNoIGVudGl0eSBhY3Rpb25zIGZvciBhIGNvbGxlY3Rpb24gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29tbWFuZHM8VD5cbiAgZXh0ZW5kcyBFbnRpdHlTZXJ2ZXJDb21tYW5kczxUPixcbiAgICBFbnRpdHlDYWNoZUNvbW1hbmRzPFQ+IHt9XG4iXX0=