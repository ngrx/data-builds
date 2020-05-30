/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-change-tracker.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 * @record
 * @template T
 */
export function EntityChangeTracker() { }
if (false) {
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTracker.prototype.commitAll = function (collection) { };
    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} entityOrIdList The entities to clear tracking or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTracker.prototype.commitMany = function (entityOrIdList, collection) { };
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param {?} entityOrId The entity to clear tracking or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTracker.prototype.commitOne = function (entityOrId, collection) { };
    /**
     * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
     * @param {?} entities Entities returned from querying the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTracker.prototype.mergeQueryResults = function (entities, collection, mergeStrategy) { };
    /**
     * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} entities Entities returned from saving new entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTracker.prototype.mergeSaveAdds = function (entities, collection, mergeStrategy) { };
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param {?} keys
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTracker.prototype.mergeSaveDeletes = function (keys, collection, mergeStrategy) { };
    /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} entities Entities returned from saving upsert entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTracker.prototype.mergeSaveUpserts = function (entities, collection, mergeStrategy) { };
    /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} updates Entity response data returned from saving updated entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @param {?=} skipUnchanged
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTracker.prototype.mergeSaveUpdates = function (updates, collection, mergeStrategy, skipUnchanged) { };
    /**
     * Track multiple entities before adding them to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param {?} entities The entities to add. They must all have their ids.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackAddMany = function (entities, collection, mergeStrategy) { };
    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param {?} entity The entity to add. It must have an id.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackAddOne = function (entity, collection, mergeStrategy) { };
    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} keys The primary keys of the entities to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackDeleteMany = function (keys, collection, mergeStrategy) { };
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} key The primary key of the entity to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackDeleteOne = function (key, collection, mergeStrategy) { };
    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} updates The entities to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackUpdateMany = function (updates, collection, mergeStrategy) { };
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} update The entity to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackUpdateOne = function (update, collection, mergeStrategy) { };
    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entities The entities to add or update. They must be complete entities with ids.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackUpsertMany = function (entities, collection, mergeStrategy) { };
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entity
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTracker.prototype.trackUpsertOne = function (entity, collection, mergeStrategy) { };
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTracker.prototype.undoAll = function (collection) { };
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrIdList The entities to revert or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTracker.prototype.undoMany = function (entityOrIdList, collection) { };
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrId The entity to revert or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTracker.prototype.undoOne = function (entityOrId, collection) { };
}
//# sourceMappingURL=entity-change-tracker.js.map