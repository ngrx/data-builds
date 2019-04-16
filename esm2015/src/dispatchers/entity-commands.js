/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * \@params queryParams the query in a form understood by the server
     * @param {?} queryParams
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
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.addAllToCache = function (entities, options) { };
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.addOneToCache = function (entity, options) { };
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param {?} entities
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
     * @param {?} entity
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
     * @param {?} entities
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.updateManyInCache = function (entities, options) { };
    /**
     * Insert or update a cached entity directly.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     * @param {?} entity
     * @param {?=} options
     * @return {?}
     */
    EntityCacheCommands.prototype.upsertOneInCache = function (entity, options) { };
    /**
     * Insert or update multiple cached entities directly.
     * Does not save to remote storage.
     * Upsert entities might be partial but must at least have their keys.
     * Pass an array of the Update<T> structure as the payload
     * @param {?} entities
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbW1hbmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBTUEsMENBNEdDOzs7Ozs7Ozs7O0lBcEdDLG9FQUE2RDs7Ozs7Ozs7SUFRN0Qsc0ZBSVE7Ozs7Ozs7O0lBU1IsdUVBQThFOzs7Ozs7OztJQVM5RSxvRUFHK0I7Ozs7Ozs7OztJQVUvQiwrREFBdUQ7Ozs7Ozs7Ozs7SUFXdkQsc0VBQWlFOzs7Ozs7Ozs7OztJQVdqRSxrRkFHbUI7Ozs7Ozs7OztJQVVuQiw2REFBcUQ7Ozs7Ozs7Ozs7SUFXckQsdUVBQXlFOzs7Ozs7Ozs7O0lBVXpFLHVFQUFnRTs7Ozs7OztBQUtsRSx5Q0EwR0M7Ozs7Ozs7OztJQXJHQywrRUFBa0U7Ozs7Ozs7OztJQU9sRSw2RUFBOEQ7Ozs7Ozs7OztJQU85RCxnRkFBbUU7Ozs7OztJQUduRSxrRUFBZ0Q7Ozs7Ozs7O0lBT2hELGtGQUFtRTs7Ozs7Ozs7SUFPbkUsK0VBQThFOzs7Ozs7OztJQU85RSxxRkFBd0U7Ozs7Ozs7O0lBT3hFLGlGQUdROzs7Ozs7Ozs7OztJQVNSLGdGQUEwRTs7Ozs7Ozs7Ozs7SUFTMUUsbUZBR1E7Ozs7Ozs7Ozs7SUFRUixnRkFBMEU7Ozs7Ozs7Ozs7SUFRMUUsbUZBR1E7Ozs7Ozs7O0lBTVIsMEVBQTZEOzs7Ozs7O0lBRzdELDJFQUFrRTs7Ozs7OztJQUdsRSw2RUFBb0U7Ozs7Ozs7QUFJdEUsb0NBRTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcblxuLyoqIENvbW1hbmRzIHRoYXQgdXBkYXRlIHRoZSByZW1vdGUgc2VydmVyLiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlTZXJ2ZXJDb21tYW5kczxUPiB7XG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBlbnRpdHkgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIGFkZCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGFkZChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIChxdWVyeSBvciBzYXZlKSB3aXRoIHRoZSBnaXZlbiBjb3JyZWxhdGlvbklkLlxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIEVudGl0eUFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyB0aGUgdGFnXG4gICAqL1xuICBjYW5jZWwoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgZW50aXR5IHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2Ugc2F2ZSBhbmQgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGRlbGV0ZSBlbnRpdHkgZnJvbSByZW1vdGUgc3RvcmFnZSBieSBrZXkuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIHRoZSBkZWxldGVkIGtleVxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgb3IgdGhlIHNhdmUgZXJyb3IuXG4gICAqL1xuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogbWVyZ2UgdGhlIHF1ZXJpZWQgZW50aXRpZXMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqIEBzZWUgbG9hZCgpXG4gICAqL1xuICBnZXRBbGwob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0eSB3aXRoIHRoaXMgcHJpbWFyeSBrZXkuXG4gICAqIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBlbnRpdHksXG4gICAqIG1lcmdlIGl0IGludG8gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIGdldC5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllcyB0aGF0IGFyZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzIG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldEJ5S2V5KGtleTogYW55LCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VD47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgdGhlIGVudGl0aWVzIHRoYXQgc2F0aXNmeSBhIHF1ZXJ5IGV4cHJlc3NlZFxuICAgKiB3aXRoIGVpdGhlciBhIHF1ZXJ5IHBhcmFtZXRlciBtYXAgb3IgYW4gSFRUUCBVUkwgcXVlcnkgc3RyaW5nLFxuICAgKiBhbmQgbWVyZ2UgdGhlIHJlc3VsdHMgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbXMgcXVlcnlQYXJhbXMgdGhlIHF1ZXJ5IGluIGEgZm9ybSB1bmRlcnN0b29kIGJ5IHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgcXVlcmllZCBlbnRpdGllc1xuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICovXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gcXVlcnkgcmVtb3RlIHN0b3JhZ2UgZm9yIGFsbCBlbnRpdGllcyBhbmRcbiAgICogY29tcGxldGVseSByZXBsYWNlIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB3aXRoIHRoZSBxdWVyaWVkIGVudGl0aWVzLlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbG9hZCBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgcXVlcnkgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKiBAc2VlIGdldEFsbFxuICAgKi9cbiAgbG9hZChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgdGhlIHVwZGF0ZWQgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBAcGFyYW0gZW50aXR5IHVwZGF0ZSBlbnRpdHksIHdoaWNoIG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgdXBkYXRlZCBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBkYXRlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBhIG5ldyBvciB1cGRhdGUgYW4gZXhpc3RpbmcgZW50aXR5IHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBPbmx5IGRpc3BhdGNoIHRoaXMgYWN0aW9uIGlmIHlvdXIgc2VydmVyIHN1cHBvcnRzIHVwc2VydC5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gdXBzZXJ0LCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgdXBzZXJ0KGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+O1xufVxuXG4vKioqIEEgY29sbGVjdGlvbidzIGNhY2hlLW9ubHkgY29tbWFuZHMsIHdoaWNoIGRvIG5vdCB1cGRhdGUgcmVtb3RlIHN0b3JhZ2UgKioqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNhY2hlQ29tbWFuZHM8VD4ge1xuICAvKipcbiAgICogUmVwbGFjZSBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKi9cbiAgYWRkQWxsVG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBlbnRpdHkgZGlyZWN0bHkgdG8gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIHRoZSBzYW1lIHByaW1hcnkga2V5IGlzIGFscmVhZHkgaW4gY2FjaGUuXG4gICAqL1xuICBhZGRPbmVUb0NhY2hlKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgbmV3IGVudGl0aWVzIGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogRW50aXRpZXMgd2l0aCBwcmltYXJ5IGtleXMgYWxyZWFkeSBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICovXG4gIGFkZE1hbnlUb0NhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKiogQ2xlYXIgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbiAqL1xuICBjbGVhckNhY2hlKG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZU9uZUZyb21DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGVudGl0eSBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoYXQgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoa2V5OiBudW1iZXIgfCBzdHJpbmcsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKGVudGl0aWVzOiBUW10sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIG11bHRpcGxlIGVudGl0aWVzIGRpcmVjdGx5IGZyb20gdGhlIGNhY2hlLlxuICAgKiBEb2VzIG5vdCBkZWxldGUgdGhlc2UgZW50aXRpZXMgZnJvbSByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVNYW55RnJvbUNhY2hlKFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcblxuICAvKipcbiAgICogVXBkYXRlIGEgY2FjaGVkIGVudGl0eSBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoYXQgZW50aXR5IGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBJZ25vcmVkIGlmIGFuIGVudGl0eSB3aXRoIG1hdGNoaW5nIHByaW1hcnkga2V5IGlzIG5vdCBpbiBjYWNoZS5cbiAgICogVGhlIHVwZGF0ZSBlbnRpdHkgbWF5IGJlIHBhcnRpYWwgKGJ1dCBtdXN0IGhhdmUgaXRzIGtleSlcbiAgICogaW4gd2hpY2ggY2FzZSBpdCBwYXRjaGVzIHRoZSBleGlzdGluZyBlbnRpdHkuXG4gICAqL1xuICB1cGRhdGVPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgbXVsdGlwbGUgY2FjaGVkIGVudGl0aWVzIGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCB1cGRhdGUgdGhlc2UgZW50aXRpZXMgaW4gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdob3NlIHByaW1hcnkga2V5cyBhcmUgbm90IGluIGNhY2hlIGFyZSBpZ25vcmVkLlxuICAgKiBVcGRhdGUgZW50aXRpZXMgbWF5IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBzdWNoIHBhcnRpYWwgZW50aXRpZXMgcGF0Y2ggdGhlaXIgY2FjaGVkIGNvdW50ZXJwYXJ0cy5cbiAgICovXG4gIHVwZGF0ZU1hbnlJbkNhY2hlKFxuICAgIGVudGl0aWVzOiBQYXJ0aWFsPFQ+W10sXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogdm9pZDtcblxuICAvKipcbiAgICogSW5zZXJ0IG9yIHVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdHkgbWlnaHQgYmUgYSBwYXJ0aWFsIG9mIFQgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSBpdHMga2V5LlxuICAgKiBQYXNzIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAqL1xuICB1cHNlcnRPbmVJbkNhY2hlKGVudGl0eTogUGFydGlhbDxUPiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBJbnNlcnQgb3IgdXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogVXBzZXJ0IGVudGl0aWVzIG1pZ2h0IGJlIHBhcnRpYWwgYnV0IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKiBQYXNzIGFuIGFycmF5IG9mIHRoZSBVcGRhdGU8VD4gc3RydWN0dXJlIGFzIHRoZSBwYXlsb2FkXG4gICAqL1xuICB1cHNlcnRNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGF0dGVybiB0aGF0IHRoZSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGFwcGxpZXNcbiAgICogd2hlbiB1c2luZyB0aGUgYGZpbHRlcmVkRW50aXRpZXNgIHNlbGVjdG9yLlxuICAgKi9cbiAgc2V0RmlsdGVyKHBhdHRlcm46IGFueSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKiBTZXQgdGhlIGxvYWRlZCBmbGFnICovXG4gIHNldExvYWRlZChpc0xvYWRlZDogYm9vbGVhbiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKiBTZXQgdGhlIGxvYWRpbmcgZmxhZyAqL1xuICBzZXRMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbiwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xufVxuXG4vKiogQ29tbWFuZHMgdGhhdCBkaXNwYXRjaCBlbnRpdHkgYWN0aW9ucyBmb3IgYSBjb2xsZWN0aW9uICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbW1hbmRzPFQ+XG4gIGV4dGVuZHMgRW50aXR5U2VydmVyQ29tbWFuZHM8VD4sXG4gICAgRW50aXR5Q2FjaGVDb21tYW5kczxUPiB7fVxuIl19