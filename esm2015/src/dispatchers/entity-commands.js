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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbW1hbmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBTUEsMENBNEdDOzs7Ozs7Ozs7O0lBcEdDLG9FQUE2RDs7Ozs7Ozs7SUFRN0Qsc0ZBSVE7Ozs7Ozs7O0lBU1IsdUVBQThFOzs7Ozs7OztJQVM5RSxvRUFHK0I7Ozs7Ozs7OztJQVUvQiwrREFBdUQ7Ozs7Ozs7Ozs7SUFXdkQsc0VBQWlFOzs7Ozs7Ozs7O0lBV2pFLGtGQUdtQjs7Ozs7Ozs7O0lBVW5CLDZEQUFxRDs7Ozs7Ozs7OztJQVdyRCx1RUFBeUU7Ozs7Ozs7Ozs7SUFVekUsdUVBQWdFOzs7Ozs7O0FBS2xFLHlDQTBHQzs7Ozs7Ozs7O0lBckdDLCtFQUFrRTs7Ozs7Ozs7O0lBT2xFLDZFQUE4RDs7Ozs7Ozs7O0lBTzlELGdGQUFtRTs7Ozs7O0lBR25FLGtFQUFnRDs7Ozs7Ozs7SUFPaEQsa0ZBQW1FOzs7Ozs7OztJQU9uRSwrRUFBOEU7Ozs7Ozs7O0lBTzlFLHFGQUF3RTs7Ozs7Ozs7SUFPeEUsaUZBR1E7Ozs7Ozs7Ozs7O0lBU1IsZ0ZBQTBFOzs7Ozs7Ozs7OztJQVMxRSxtRkFHUTs7Ozs7Ozs7OztJQVFSLGdGQUEwRTs7Ozs7Ozs7OztJQVExRSxtRkFHUTs7Ozs7Ozs7SUFNUiwwRUFBNkQ7Ozs7Ozs7SUFHN0QsMkVBQWtFOzs7Ozs7O0lBR2xFLDZFQUFvRTs7Ozs7OztBQUl0RSxvQ0FFNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2ludGVyZmFjZXMnO1xuXG4vKiogQ29tbWFuZHMgdGhhdCB1cGRhdGUgdGhlIHJlbW90ZSBzZXJ2ZXIuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVNlcnZlckNvbW1hbmRzPFQ+IHtcbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIGEgbmV3IGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogQHBhcmFtIGVudGl0eSBlbnRpdHkgdG8gYWRkLCB3aGljaCBtYXkgb21pdCBpdHMga2V5IGlmIHBlc3NpbWlzdGljIGFuZCB0aGUgc2VydmVyIGNyZWF0ZXMgdGhlIGtleTtcbiAgICogbXVzdCBoYXZlIGEga2V5IGlmIG9wdGltaXN0aWMgc2F2ZS5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdHlcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIG9yIHRoZSBzYXZlIGVycm9yLlxuICAgKi9cbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gY2FuY2VsIHRoZSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gKHF1ZXJ5IG9yIHNhdmUpIHdpdGggdGhlIGdpdmVuIGNvcnJlbGF0aW9uSWQuXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgRW50aXR5QWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIHRoZSB0YWdcbiAgICovXG4gIGNhbmNlbChcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBkZWxldGUgZW50aXR5IGZyb20gcmVtb3RlIHN0b3JhZ2UgYnkga2V5LlxuICAgKiBAcGFyYW0ga2V5IFRoZSBlbnRpdHkgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gZGVsZXRlIGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlIGJ5IGtleS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byByZW1vdmVcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIHNhdmUgYW5kIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgb2YgdGhlIGRlbGV0ZWQga2V5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBxdWVyeSByZW1vdGUgc3RvcmFnZSBmb3IgYWxsIGVudGl0aWVzIGFuZFxuICAgKiBtZXJnZSB0aGUgcXVlcmllZCBlbnRpdGllcyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIG1lcmdlIGJlaGF2aW9yXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBsb2FkKClcbiAgICovXG4gIGdldEFsbChvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXR5IHdpdGggdGhpcyBwcmltYXJ5IGtleS5cbiAgICogSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGVudGl0eSxcbiAgICogbWVyZ2UgaXQgaW50byB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gZ2V0LlxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgbWVyZ2UgYmVoYXZpb3JcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBxdWVyaWVkIGVudGl0aWVzIHRoYXQgYXJlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3Mgb3IgdGhlIHF1ZXJ5IGVycm9yLlxuICAgKi9cbiAgZ2V0QnlLZXkoa2V5OiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciB0aGUgZW50aXRpZXMgdGhhdCBzYXRpc2Z5IGEgcXVlcnkgZXhwcmVzc2VkXG4gICAqIHdpdGggZWl0aGVyIGEgcXVlcnkgcGFyYW1ldGVyIG1hcCBvciBhbiBIVFRQIFVSTCBxdWVyeSBzdHJpbmcsXG4gICAqIGFuZCBtZXJnZSB0aGUgcmVzdWx0cyBpbnRvIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHF1ZXJ5UGFyYW1zIHRoZSBxdWVyeSBpbiBhIGZvcm0gdW5kZXJzdG9vZCBieSB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHF1ZXJpZWQgZW50aXRpZXNcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBxdWVyeSBvciB0aGUgcXVlcnkgZXJyb3IuXG4gICAqL1xuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHF1ZXJ5IHJlbW90ZSBzdG9yYWdlIGZvciBhbGwgZW50aXRpZXMgYW5kXG4gICAqIGNvbXBsZXRlbHkgcmVwbGFjZSB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gd2l0aCB0aGUgcXVlcmllZCBlbnRpdGllcy5cbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIGxvYWQgYmVoYXZpb3JcbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHF1ZXJ5IG9yIHRoZSBxdWVyeSBlcnJvci5cbiAgICogQHNlZSBnZXRBbGxcbiAgICovXG4gIGxvYWQob3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIHRoZSB1cGRhdGVkIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBUaGUgdXBkYXRlIGVudGl0eSBtYXkgYmUgcGFydGlhbCAoYnV0IG11c3QgaGF2ZSBpdHMga2V5KVxuICAgKiBpbiB3aGljaCBjYXNlIGl0IHBhdGNoZXMgdGhlIGV4aXN0aW5nIGVudGl0eS5cbiAgICogQHBhcmFtIGVudGl0eSB1cGRhdGUgZW50aXR5LCB3aGljaCBtaWdodCBiZSBhIHBhcnRpYWwgb2YgVCBidXQgbXVzdCBhdCBsZWFzdCBoYXZlIGl0cyBrZXkuXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBzYXZlIGFuZCBtZXJnZSBiZWhhdmlvclxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGUgb2YgdGhlIHVwZGF0ZWQgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgYSBuZXcgb3IgdXBkYXRlIGFuIGV4aXN0aW5nIGVudGl0eSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogT25seSBkaXNwYXRjaCB0aGlzIGFjdGlvbiBpZiB5b3VyIHNlcnZlciBzdXBwb3J0cyB1cHNlcnQuXG4gICAqIEBwYXJhbSBlbnRpdHkgZW50aXR5IHRvIHVwc2VydCwgd2hpY2ggbWF5IG9taXQgaXRzIGtleSBpZiBwZXNzaW1pc3RpYyBhbmQgdGhlIHNlcnZlciBjcmVhdGVzIHRoZSBrZXk7XG4gICAqIG11c3QgaGF2ZSBhIGtleSBpZiBvcHRpbWlzdGljIHNhdmUuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXR5XG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBvciB0aGUgc2F2ZSBlcnJvci5cbiAgICovXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogT2JzZXJ2YWJsZTxUPjtcbn1cblxuLyoqKiBBIGNvbGxlY3Rpb24ncyBjYWNoZS1vbmx5IGNvbW1hbmRzLCB3aGljaCBkbyBub3QgdXBkYXRlIHJlbW90ZSBzdG9yYWdlICoqKi9cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDYWNoZUNvbW1hbmRzPFQ+IHtcbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICovXG4gIGFkZEFsbFRvQ2FjaGUoZW50aXRpZXM6IFRbXSwgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZW50aXR5IGRpcmVjdGx5IHRvIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3Qgc2F2ZSB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCB0aGUgc2FtZSBwcmltYXJ5IGtleSBpcyBhbHJlYWR5IGluIGNhY2hlLlxuICAgKi9cbiAgYWRkT25lVG9DYWNoZShlbnRpdHk6IFQsIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIG5ldyBlbnRpdGllcyBkaXJlY3RseSB0byB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEVudGl0aWVzIHdpdGggcHJpbWFyeSBrZXlzIGFscmVhZHkgaW4gY2FjaGUgYXJlIGlnbm9yZWQuXG4gICAqL1xuICBhZGRNYW55VG9DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqIENsZWFyIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgY2xlYXJDYWNoZShvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPbmVGcm9tQ2FjaGUoZW50aXR5OiBULCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRpdHkgZGlyZWN0bHkgZnJvbSB0aGUgY2FjaGUuXG4gICAqIERvZXMgbm90IGRlbGV0ZSB0aGF0IGVudGl0eSBmcm9tIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlT25lRnJvbUNhY2hlKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShlbnRpdGllczogVFtdLCBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtdWx0aXBsZSBlbnRpdGllcyBkaXJlY3RseSBmcm9tIHRoZSBjYWNoZS5cbiAgICogRG9lcyBub3QgZGVsZXRlIHRoZXNlIGVudGl0aWVzIGZyb20gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTWFueUZyb21DYWNoZShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGNhY2hlZCBlbnRpdHkgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHVwZGF0ZSB0aGF0IGVudGl0eSBpbiByZW1vdGUgc3RvcmFnZS5cbiAgICogSWdub3JlZCBpZiBhbiBlbnRpdHkgd2l0aCBtYXRjaGluZyBwcmltYXJ5IGtleSBpcyBub3QgaW4gY2FjaGUuXG4gICAqIFRoZSB1cGRhdGUgZW50aXR5IG1heSBiZSBwYXJ0aWFsIChidXQgbXVzdCBoYXZlIGl0cyBrZXkpXG4gICAqIGluIHdoaWNoIGNhc2UgaXQgcGF0Y2hlcyB0aGUgZXhpc3RpbmcgZW50aXR5LlxuICAgKi9cbiAgdXBkYXRlT25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogVXBkYXRlIG11bHRpcGxlIGNhY2hlZCBlbnRpdGllcyBkaXJlY3RseS5cbiAgICogRG9lcyBub3QgdXBkYXRlIHRoZXNlIGVudGl0aWVzIGluIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBFbnRpdGllcyB3aG9zZSBwcmltYXJ5IGtleXMgYXJlIG5vdCBpbiBjYWNoZSBhcmUgaWdub3JlZC5cbiAgICogVXBkYXRlIGVudGl0aWVzIG1heSBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogc3VjaCBwYXJ0aWFsIGVudGl0aWVzIHBhdGNoIHRoZWlyIGNhY2hlZCBjb3VudGVycGFydHMuXG4gICAqL1xuICB1cGRhdGVNYW55SW5DYWNoZShcbiAgICBlbnRpdGllczogUGFydGlhbDxUPltdLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEluc2VydCBvciB1cGRhdGUgYSBjYWNoZWQgZW50aXR5IGRpcmVjdGx5LlxuICAgKiBEb2VzIG5vdCBzYXZlIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBVcHNlcnQgZW50aXR5IG1pZ2h0IGJlIGEgcGFydGlhbCBvZiBUIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgaXRzIGtleS5cbiAgICogUGFzcyB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgKi9cbiAgdXBzZXJ0T25lSW5DYWNoZShlbnRpdHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogSW5zZXJ0IG9yIHVwZGF0ZSBtdWx0aXBsZSBjYWNoZWQgZW50aXRpZXMgZGlyZWN0bHkuXG4gICAqIERvZXMgbm90IHNhdmUgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFVwc2VydCBlbnRpdGllcyBtaWdodCBiZSBwYXJ0aWFsIGJ1dCBtdXN0IGF0IGxlYXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICogUGFzcyBhbiBhcnJheSBvZiB0aGUgVXBkYXRlPFQ+IHN0cnVjdHVyZSBhcyB0aGUgcGF5bG9hZFxuICAgKi9cbiAgdXBzZXJ0TWFueUluQ2FjaGUoXG4gICAgZW50aXRpZXM6IFBhcnRpYWw8VD5bXSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhdHRlcm4gdGhhdCB0aGUgY29sbGVjdGlvbidzIGZpbHRlciBhcHBsaWVzXG4gICAqIHdoZW4gdXNpbmcgdGhlIGBmaWx0ZXJlZEVudGl0aWVzYCBzZWxlY3Rvci5cbiAgICovXG4gIHNldEZpbHRlcihwYXR0ZXJuOiBhbnksIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKiogU2V0IHRoZSBsb2FkZWQgZmxhZyAqL1xuICBzZXRMb2FkZWQoaXNMb2FkZWQ6IGJvb2xlYW4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcblxuICAvKiogU2V0IHRoZSBsb2FkaW5nIGZsYWcgKi9cbiAgc2V0TG9hZGluZyhpc0xvYWRpbmc6IGJvb2xlYW4sIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zKTogdm9pZDtcbn1cblxuLyoqIENvbW1hbmRzIHRoYXQgZGlzcGF0Y2ggZW50aXR5IGFjdGlvbnMgZm9yIGEgY29sbGVjdGlvbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb21tYW5kczxUPlxuICBleHRlbmRzIEVudGl0eVNlcnZlckNvbW1hbmRzPFQ+LFxuICAgIEVudGl0eUNhY2hlQ29tbWFuZHM8VD4ge31cbiJdfQ==