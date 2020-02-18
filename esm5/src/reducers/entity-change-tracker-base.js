import { __assign } from "tslib";
import { ChangeType } from './entity-collection';
import { defaultSelectId } from '../utils/utilities';
import { MergeStrategy } from '../actions/merge-strategy';
/**
 * The default implementation of EntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 */
var EntityChangeTrackerBase = /** @class */ (function () {
    function EntityChangeTrackerBase(adapter, selectId) {
        this.adapter = adapter;
        this.selectId = selectId;
        /** Extract the primary key (id); default to `id` */
        this.selectId = selectId || defaultSelectId;
    }
    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param collection The entity collection
     */
    EntityChangeTrackerBase.prototype.commitAll = function (collection) {
        return Object.keys(collection.changeState).length === 0
            ? collection
            : __assign(__assign({}, collection), { changeState: {} });
    };
    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param entityOrIdList The entities to clear tracking or their ids.
     * @param collection The entity collection
     */
    EntityChangeTrackerBase.prototype.commitMany = function (entityOrIdList, collection) {
        var _this = this;
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to commit
        }
        var didMutate = false;
        var changeState = entityOrIdList.reduce(function (chgState, entityOrId) {
            var id = typeof entityOrId === 'object'
                ? _this.selectId(entityOrId)
                : entityOrId;
            if (chgState[id]) {
                if (!didMutate) {
                    chgState = __assign({}, chgState);
                    didMutate = true;
                }
                delete chgState[id];
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param entityOrId The entity to clear tracking or its id.
     * @param collection The entity collection
     */
    EntityChangeTrackerBase.prototype.commitOne = function (entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.commitMany([entityOrId], collection);
    };
    // #endregion commit methods
    // #region merge query
    /**
     * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
     * @param entities Entities returned from querying the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a queried entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.PreserveChanges.
     * @returns The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeQueryResults = function (entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.PreserveChanges, mergeStrategy);
    };
    // #endregion merge query results
    // #region merge save results
    /**
     * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving new entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveAdds = function (entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    };
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param entities keys primary keys of the entities to remove/delete.
     * @param collection The entity collection
     * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveDeletes = function (keys, collection, mergeStrategy) {
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        // same logic for all non-ignore merge strategies: always clear (commit) the changes
        var deleteIds = keys; // make TypeScript happy
        collection =
            mergeStrategy === MergeStrategy.IgnoreChanges
                ? collection
                : this.commitMany(deleteIds, collection);
        return this.adapter.removeMany(deleteIds, collection);
    };
    /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param updateResponseData Entity response data returned from saving updated entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @param [skipUnchanged] True means skip update if server didn't change it. False by default.
     * If the update was optimistic and the server didn't make more changes of its own
     * then the updates are already in the collection and shouldn't make them again.
     * @returns The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveUpdates = function (updateResponseData, collection, mergeStrategy, skipUnchanged) {
        var _this = this;
        if (skipUnchanged === void 0) { skipUnchanged = false; }
        if (updateResponseData == null || updateResponseData.length === 0) {
            return collection; // nothing to merge.
        }
        var didMutate = false;
        var changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        var updates;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.OverwriteChanges:
                changeState = updateResponseData.reduce(function (chgState, update) {
                    var oldId = update.id;
                    var change = chgState[oldId];
                    if (change) {
                        if (!didMutate) {
                            chgState = __assign({}, chgState);
                            didMutate = true;
                        }
                        delete chgState[oldId];
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.PreserveChanges: {
                var updateableEntities_1 = [];
                changeState = updateResponseData.reduce(function (chgState, update) {
                    var oldId = update.id;
                    var change = chgState[oldId];
                    if (change) {
                        // Tracking a change so update original value but not the current value
                        if (!didMutate) {
                            chgState = __assign({}, chgState);
                            didMutate = true;
                        }
                        var newId = _this.selectId(update.changes);
                        var oldChangeState = change;
                        // If the server changed the id, register the new "originalValue" under the new id
                        // and remove the change tracked under the old id.
                        if (newId !== oldId) {
                            delete chgState[oldId];
                        }
                        var newOrigValue = __assign(__assign({}, oldChangeState.originalValue), update.changes);
                        chgState[newId] = __assign(__assign({}, oldChangeState), { originalValue: newOrigValue });
                    }
                    else {
                        updateableEntities_1.push(update);
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
                updates = filterChanged(updateableEntities_1);
                return this.adapter.updateMany(updates, collection);
            }
        }
        /**
         * Conditionally keep only those updates that have additional server changes.
         * (e.g., for optimistic saves because they updates are already in the current collection)
         * Strip off the `changed` property.
         * @responseData Entity response data from server.
         * May be an UpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
         * @returns Update<T> (without the changed flag)
         */
        function filterChanged(responseData) {
            if (skipUnchanged === true) {
                // keep only those updates that the server changed (knowable if is UpdateResponseData<T>)
                responseData = responseData.filter(function (r) { return r.changed === true; });
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map(function (r) { return ({ id: r.id, changes: r.changes }); });
        }
    };
    /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving upserts to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveUpserts = function (entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    };
    // #endregion merge save results
    // #region query & save helpers
    /**
     *
     * @param entities Entities to merge
     * @param collection Collection into which entities are merged
     * @param defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
     * @param [mergeStrategy] The action's MergeStrategy
     */
    EntityChangeTrackerBase.prototype.mergeServerUpserts = function (entities, collection, defaultMergeStrategy, mergeStrategy) {
        var _this = this;
        if (entities == null || entities.length === 0) {
            return collection; // nothing to merge.
        }
        var didMutate = false;
        var changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                return this.adapter.upsertMany(entities, collection);
            case MergeStrategy.OverwriteChanges:
                collection = this.adapter.upsertMany(entities, collection);
                changeState = entities.reduce(function (chgState, entity) {
                    var id = _this.selectId(entity);
                    var change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = __assign({}, chgState);
                            didMutate = true;
                        }
                        delete chgState[id];
                    }
                    return chgState;
                }, collection.changeState);
                return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
            case MergeStrategy.PreserveChanges: {
                var upsertEntities_1 = [];
                changeState = entities.reduce(function (chgState, entity) {
                    var _a;
                    var id = _this.selectId(entity);
                    var change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = __assign(__assign({}, chgState), (_a = {}, _a[id] = __assign(__assign({}, chgState[id]), { originalValue: entity }), _a));
                            didMutate = true;
                        }
                    }
                    else {
                        upsertEntities_1.push(entity);
                    }
                    return chgState;
                }, collection.changeState);
                collection = this.adapter.upsertMany(upsertEntities_1, collection);
                return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
            }
        }
    };
    // #endregion query & save helpers
    // #region track methods
    /**
     * Track multiple entities before adding them to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entities The entities to add. They must all have their ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackAddMany = function (entities, collection, mergeStrategy) {
        var _this = this;
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        var didMutate = false;
        var changeState = entities.reduce(function (chgState, entity) {
            var id = _this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(collection.entityName + " entity add requires a key to be tracked");
            }
            var trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = __assign({}, chgState);
                }
                chgState[id] = { changeType: ChangeType.Added };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entity The entity to add. It must have an id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     * If not specified, implementation supplies a default strategy.
     */
    EntityChangeTrackerBase.prototype.trackAddOne = function (entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackAddMany([entity], collection, mergeStrategy);
    };
    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param keys The primary keys of the entities to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackDeleteMany = function (keys, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            keys == null ||
            keys.length === 0) {
            return collection; // nothing to track
        }
        var didMutate = false;
        var entityMap = collection.entities;
        var changeState = keys.reduce(function (chgState, id) {
            var originalValue = entityMap[id];
            if (originalValue) {
                var trackedChange = chgState[id];
                if (trackedChange) {
                    if (trackedChange.changeType === ChangeType.Added) {
                        // Special case: stop tracking an added entity that you delete
                        // The caller must also detect this, remove it immediately from the collection
                        // and skip attempt to delete on the server.
                        cloneChgStateOnce();
                        delete chgState[id];
                    }
                    else if (trackedChange.changeType === ChangeType.Updated) {
                        // Special case: switch change type from Updated to Deleted.
                        cloneChgStateOnce();
                        trackedChange.changeType = ChangeType.Deleted;
                    }
                }
                else {
                    // Start tracking this entity
                    cloneChgStateOnce();
                    chgState[id] = { changeType: ChangeType.Deleted, originalValue: originalValue };
                }
            }
            return chgState;
            function cloneChgStateOnce() {
                if (!didMutate) {
                    didMutate = true;
                    chgState = __assign({}, chgState);
                }
            }
        }, collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param key The primary key of the entity to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackDeleteOne = function (key, collection, mergeStrategy) {
        return key == null
            ? collection
            : this.trackDeleteMany([key], collection, mergeStrategy);
    };
    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param updates The entities to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackUpdateMany = function (updates, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            updates == null ||
            updates.length === 0) {
            return collection; // nothing to track
        }
        var didMutate = false;
        var entityMap = collection.entities;
        var changeState = updates.reduce(function (chgState, update) {
            var id = update.id, entity = update.changes;
            if (id == null || id === '') {
                throw new Error(collection.entityName + " entity update requires a key to be tracked");
            }
            var originalValue = entityMap[id];
            // Only track if it is in the collection. Silently ignore if it is not.
            // @ngrx/entity adapter would also silently ignore.
            // Todo: should missing update entity really be reported as an error?
            if (originalValue) {
                var trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = __assign({}, chgState);
                    }
                    chgState[id] = { changeType: ChangeType.Updated, originalValue: originalValue };
                }
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param update The entity to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackUpdateOne = function (update, collection, mergeStrategy) {
        return update == null
            ? collection
            : this.trackUpdateMany([update], collection, mergeStrategy);
    };
    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entities to add or update. They must be complete entities with ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackUpsertMany = function (entities, collection, mergeStrategy) {
        var _this = this;
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        var didMutate = false;
        var entityMap = collection.entities;
        var changeState = entities.reduce(function (chgState, entity) {
            var id = _this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(collection.entityName + " entity upsert requires a key to be tracked");
            }
            var trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = __assign({}, chgState);
                }
                var originalValue = entityMap[id];
                chgState[id] =
                    originalValue == null
                        ? { changeType: ChangeType.Added }
                        : { changeType: ChangeType.Updated, originalValue: originalValue };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entity to add or update. It must be a complete entity with its id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    EntityChangeTrackerBase.prototype.trackUpsertOne = function (entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackUpsertMany([entity], collection, mergeStrategy);
    };
    // #endregion track methods
    // #region undo methods
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param collection The entity collection
     */
    EntityChangeTrackerBase.prototype.undoAll = function (collection) {
        var ids = Object.keys(collection.changeState);
        var _a = ids.reduce(function (acc, id) {
            var changeState = acc.chgState[id];
            switch (changeState.changeType) {
                case ChangeType.Added:
                    acc.remove.push(id);
                    break;
                case ChangeType.Deleted:
                    var removed = changeState.originalValue;
                    if (removed) {
                        acc.upsert.push(removed);
                    }
                    break;
                case ChangeType.Updated:
                    acc.upsert.push(changeState.originalValue);
                    break;
            }
            return acc;
        }, 
        // entitiesToUndo
        {
            remove: [],
            upsert: [],
            chgState: collection.changeState,
        }), remove = _a.remove, upsert = _a.upsert;
        collection = this.adapter.removeMany(remove, collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return __assign(__assign({}, collection), { changeState: {} });
    };
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param entityOrIdList The entities to revert or their ids.
     * @param collection The entity collection
     */
    EntityChangeTrackerBase.prototype.undoMany = function (entityOrIdList, collection) {
        var _this = this;
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to undo
        }
        var didMutate = false;
        var _a = entityOrIdList.reduce(function (acc, entityOrId) {
            var chgState = acc.changeState;
            var id = typeof entityOrId === 'object'
                ? _this.selectId(entityOrId)
                : entityOrId;
            var change = chgState[id];
            if (change) {
                if (!didMutate) {
                    chgState = __assign({}, chgState);
                    didMutate = true;
                }
                delete chgState[id]; // clear tracking of this entity
                acc.changeState = chgState;
                switch (change.changeType) {
                    case ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case ChangeType.Deleted:
                        var removed = change.originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case ChangeType.Updated:
                        acc.upsert.push(change.originalValue);
                        break;
                }
            }
            return acc;
        }, 
        // entitiesToUndo
        {
            remove: [],
            upsert: [],
            changeState: collection.changeState,
        }), changeState = _a.changeState, remove = _a.remove, upsert = _a.upsert;
        collection = this.adapter.removeMany(remove, collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param entityOrId The entity to revert or its id.
     * @param collection The entity collection
     */
    EntityChangeTrackerBase.prototype.undoOne = function (entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.undoMany([entityOrId], collection);
    };
    return EntityChangeTrackerBase;
}());
export { EntityChangeTrackerBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFvQixNQUFNLHFCQUFxQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHMUQ7Ozs7O0dBS0c7QUFDSDtJQUNFLGlDQUNVLE9BQXlCLEVBQ3pCLFFBQXVCO1FBRHZCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFFL0Isb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLGVBQWUsQ0FBQztJQUM5QyxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCOzs7O09BSUc7SUFDSCwyQ0FBUyxHQUFULFVBQVUsVUFBK0I7UUFDdkMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUNyRCxDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsdUJBQU0sVUFBVSxLQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw0Q0FBVSxHQUFWLFVBQ0UsY0FBdUMsRUFDdkMsVUFBK0I7UUFGakMsaUJBd0JDO1FBcEJDLElBQUksY0FBYyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQjtTQUN4QztRQUNELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0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VSxDQUFDLENBQUM7UUFDekQsT0FBTyxTQUFTLENBQUMsQ0FBQyx1QkFBTSxVQUFVLEtBQUUsV0FBVyxhQUFBLElBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx5Q0FBTyxHQUFQLFVBQ0UsVUFBK0IsRUFDL0IsVUFBK0I7UUFFL0IsT0FBTyxVQUFVLElBQUksSUFBSTtZQUN2QixDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVILDhCQUFDO0FBQUQsQ0FBQyxBQXR0QkQsSUFzdEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgQ2hhbmdlVHlwZSwgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXIgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlcic7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBFbnRpdHlDaGFuZ2VUcmFja2VyIHdpdGhcbiAqIG1ldGhvZHMgZm9yIHRyYWNraW5nLCBjb21taXR0aW5nLCBhbmQgcmV2ZXJ0aW5nL3VuZG9pbmcgdW5zYXZlZCBlbnRpdHkgY2hhbmdlcy5cbiAqIFVzZWQgYnkgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzIHdoaWNoIHNob3VsZCBjYWxsIHRyYWNrZXIgbWV0aG9kcyBCRUZPUkUgbW9kaWZ5aW5nIHRoZSBjb2xsZWN0aW9uLlxuICogU2VlIEVudGl0eUNoYW5nZVRyYWNrZXIgZG9jcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q2hhbmdlVHJhY2tlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWRhcHRlcjogRW50aXR5QWRhcHRlcjxUPixcbiAgICBwcml2YXRlIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+XG4gICkge1xuICAgIC8qKiBFeHRyYWN0IHRoZSBwcmltYXJ5IGtleSAoaWQpOyBkZWZhdWx0IHRvIGBpZGAgKi9cbiAgICB0aGlzLnNlbGVjdElkID0gc2VsZWN0SWQgfHwgZGVmYXVsdFNlbGVjdElkO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBjb21taXQgbWV0aG9kc1xuICAvKipcbiAgICogQ29tbWl0IGFsbCBjaGFuZ2VzIGFzIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gY29tcGxldGVseSByZWxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIGNvbW1pdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRBbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKS5sZW5ndGggPT09IDBcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlOiB7fSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1pdCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXRpZXMgYXMgd2hlbiB0aGV5IGhhdmUgYmVlbiByZWZyZXNoZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkTGlzdCBUaGUgZW50aXRpZXMgdG8gY2xlYXIgdHJhY2tpbmcgb3IgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdE1hbnkoXG4gICAgZW50aXR5T3JJZExpc3Q6IChudW1iZXIgfCBzdHJpbmcgfCBUKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0eU9ySWRMaXN0ID09IG51bGwgfHwgZW50aXR5T3JJZExpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBjb21taXRcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXR5T3JJZExpc3QucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5T3JJZCkgPT4ge1xuICAgICAgY29uc3QgaWQgPVxuICAgICAgICB0eXBlb2YgZW50aXR5T3JJZCA9PT0gJ29iamVjdCdcbiAgICAgICAgICA/IHRoaXMuc2VsZWN0SWQoZW50aXR5T3JJZClcbiAgICAgICAgICA6IChlbnRpdHlPcklkIGFzIHN0cmluZyB8IG51bWJlcik7XG4gICAgICBpZiAoY2hnU3RhdGVbaWRdKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgY2hnU3RhdGVbaWRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogQ29tbWl0IGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgYXMgd2hlbiBpdCBoYXZlIGJlZW4gcmVmcmVzaGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICogSGFybWxlc3Mgd2hlbiBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkIFRoZSBlbnRpdHkgdG8gY2xlYXIgdHJhY2tpbmcgb3IgaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdE9uZShcbiAgICBlbnRpdHlPcklkOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eU9ySWQgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMuY29tbWl0TWFueShbZW50aXR5T3JJZF0sIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBjb21taXQgbWV0aG9kc1xuXG4gIC8vICNyZWdpb24gbWVyZ2UgcXVlcnlcbiAgLyoqXG4gICAqIE1lcmdlIHF1ZXJ5IHJlc3VsdHMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyByZXR1cm5lZCBmcm9tIHF1ZXJ5aW5nIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHF1ZXJpZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlUXVlcnlSZXN1bHRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyxcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICB9XG4gIC8vICNlbmRyZWdpb24gbWVyZ2UgcXVlcnkgcmVzdWx0c1xuXG4gIC8vICNyZWdpb24gbWVyZ2Ugc2F2ZSByZXN1bHRzXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIG5ldyBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzYXZpbmcgbmV3IGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlQWRkcyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2Ugc3VjY2Vzc2Z1bCByZXN1bHQgb2YgZGVsZXRpbmcgZW50aXRpZXMgb24gdGhlIHNlcnZlciB0aGF0IGhhdmUgdGhlIGdpdmVuIHByaW1hcnkga2V5c1xuICAgKiBDbGVhcnMgdGhlIGVudGl0eSBjaGFuZ2VTdGF0ZSBmb3IgdGhvc2Uga2V5cyB1bmxlc3MgdGhlIE1lcmdlU3RyYXRlZ3kgaXMgaWdub3JlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIGtleXMgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmUvZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gYWRqdXN0IGNoYW5nZSB0cmFja2luZyB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlRGVsZXRlcyhcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIC8vIHNhbWUgbG9naWMgZm9yIGFsbCBub24taWdub3JlIG1lcmdlIHN0cmF0ZWdpZXM6IGFsd2F5cyBjbGVhciAoY29tbWl0KSB0aGUgY2hhbmdlc1xuICAgIGNvbnN0IGRlbGV0ZUlkcyA9IGtleXMgYXMgc3RyaW5nW107IC8vIG1ha2UgVHlwZVNjcmlwdCBoYXBweVxuICAgIGNvbGxlY3Rpb24gPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzXG4gICAgICAgID8gY29sbGVjdGlvblxuICAgICAgICA6IHRoaXMuY29tbWl0TWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgdXBkYXRlZCBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gdXBkYXRlUmVzcG9uc2VEYXRhIEVudGl0eSByZXNwb25zZSBkYXRhIHJldHVybmVkIGZyb20gc2F2aW5nIHVwZGF0ZWQgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gW3NraXBVbmNoYW5nZWRdIFRydWUgbWVhbnMgc2tpcCB1cGRhdGUgaWYgc2VydmVyIGRpZG4ndCBjaGFuZ2UgaXQuIEZhbHNlIGJ5IGRlZmF1bHQuXG4gICAqIElmIHRoZSB1cGRhdGUgd2FzIG9wdGltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgZGlkbid0IG1ha2UgbW9yZSBjaGFuZ2VzIG9mIGl0cyBvd25cbiAgICogdGhlbiB0aGUgdXBkYXRlcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbiBhbmQgc2hvdWxkbid0IG1ha2UgdGhlbSBhZ2Fpbi5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlVXBkYXRlcyhcbiAgICB1cGRhdGVSZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgc2tpcFVuY2hhbmdlZCA9IGZhbHNlXG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh1cGRhdGVSZXNwb25zZURhdGEgPT0gbnVsbCB8fCB1cGRhdGVSZXNwb25zZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBtZXJnZS5cbiAgICB9XG5cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZTtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgbGV0IHVwZGF0ZXM6IFVwZGF0ZTxUPltdO1xuXG4gICAgc3dpdGNoIChtZXJnZVN0cmF0ZWd5KSB7XG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlczpcbiAgICAgICAgdXBkYXRlcyA9IGZpbHRlckNoYW5nZWQodXBkYXRlUmVzcG9uc2VEYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlczpcbiAgICAgICAgY2hhbmdlU3RhdGUgPSB1cGRhdGVSZXNwb25zZURhdGEucmVkdWNlKChjaGdTdGF0ZSwgdXBkYXRlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkSWQgPSB1cGRhdGUuaWQ7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbb2xkSWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICBjb2xsZWN0aW9uID0gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgICB1cGRhdGVzID0gZmlsdGVyQ2hhbmdlZCh1cGRhdGVSZXNwb25zZURhdGEpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXM6IHtcbiAgICAgICAgY29uc3QgdXBkYXRlYWJsZUVudGl0aWVzID0gW10gYXMgVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W107XG4gICAgICAgIGNoYW5nZVN0YXRlID0gdXBkYXRlUmVzcG9uc2VEYXRhLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9sZElkID0gdXBkYXRlLmlkO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAvLyBUcmFja2luZyBhIGNoYW5nZSBzbyB1cGRhdGUgb3JpZ2luYWwgdmFsdWUgYnV0IG5vdCB0aGUgY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdJZCA9IHRoaXMuc2VsZWN0SWQodXBkYXRlLmNoYW5nZXMgYXMgVCk7XG4gICAgICAgICAgICBjb25zdCBvbGRDaGFuZ2VTdGF0ZSA9IGNoYW5nZTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBzZXJ2ZXIgY2hhbmdlZCB0aGUgaWQsIHJlZ2lzdGVyIHRoZSBuZXcgXCJvcmlnaW5hbFZhbHVlXCIgdW5kZXIgdGhlIG5ldyBpZFxuICAgICAgICAgICAgLy8gYW5kIHJlbW92ZSB0aGUgY2hhbmdlIHRyYWNrZWQgdW5kZXIgdGhlIG9sZCBpZC5cbiAgICAgICAgICAgIGlmIChuZXdJZCAhPT0gb2xkSWQpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld09yaWdWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgLi4uKG9sZENoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLih1cGRhdGUuY2hhbmdlcyBhcyBhbnkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIChjaGdTdGF0ZSBhcyBhbnkpW25ld0lkXSA9IHtcbiAgICAgICAgICAgICAgLi4ub2xkQ2hhbmdlU3RhdGUsXG4gICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IG5ld09yaWdWYWx1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZWFibGVFbnRpdGllcy5wdXNoKHVwZGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuXG4gICAgICAgIHVwZGF0ZXMgPSBmaWx0ZXJDaGFuZ2VkKHVwZGF0ZWFibGVFbnRpdGllcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25kaXRpb25hbGx5IGtlZXAgb25seSB0aG9zZSB1cGRhdGVzIHRoYXQgaGF2ZSBhZGRpdGlvbmFsIHNlcnZlciBjaGFuZ2VzLlxuICAgICAqIChlLmcuLCBmb3Igb3B0aW1pc3RpYyBzYXZlcyBiZWNhdXNlIHRoZXkgdXBkYXRlcyBhcmUgYWxyZWFkeSBpbiB0aGUgY3VycmVudCBjb2xsZWN0aW9uKVxuICAgICAqIFN0cmlwIG9mZiB0aGUgYGNoYW5nZWRgIHByb3BlcnR5LlxuICAgICAqIEByZXNwb25zZURhdGEgRW50aXR5IHJlc3BvbnNlIGRhdGEgZnJvbSBzZXJ2ZXIuXG4gICAgICogTWF5IGJlIGFuIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiwgYSBzdWJjbGFzcyBvZiBVcGRhdGU8VD4gd2l0aCBhICdjaGFuZ2VkJyBmbGFnLlxuICAgICAqIEByZXR1cm5zIFVwZGF0ZTxUPiAod2l0aG91dCB0aGUgY2hhbmdlZCBmbGFnKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlckNoYW5nZWQocmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSk6IFVwZGF0ZTxUPltdIHtcbiAgICAgIGlmIChza2lwVW5jaGFuZ2VkID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGtlZXAgb25seSB0aG9zZSB1cGRhdGVzIHRoYXQgdGhlIHNlcnZlciBjaGFuZ2VkIChrbm93YWJsZSBpZiBpcyBVcGRhdGVSZXNwb25zZURhdGE8VD4pXG4gICAgICAgIHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlRGF0YS5maWx0ZXIociA9PiByLmNoYW5nZWQgPT09IHRydWUpO1xuICAgICAgfVxuICAgICAgLy8gU3RyaXAgdW5jaGFuZ2VkIHByb3BlcnR5IGZyb20gcmVzcG9uc2VEYXRhLCBsZWF2aW5nIGp1c3QgdGhlIHB1cmUgVXBkYXRlPFQ+XG4gICAgICAvLyBUT0RPOiBSZW1vdmU/IHByb2JhYmx5IG5vdCBuZWNlc3NhcnkgYXMgdGhlIFVwZGF0ZSBpc24ndCBzdG9yZWQgYW5kIGFkYXB0ZXIgd2lsbCBpZ25vcmUgYGNoYW5nZWRgLlxuICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YS5tYXAociA9PiAoeyBpZDogci5pZCBhcyBhbnksIGNoYW5nZXM6IHIuY2hhbmdlcyB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgdXBzZXJ0ZWQgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHJldHVybmVkIGZyb20gc2F2aW5nIHVwc2VydHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVNhdmVVcHNlcnRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMsXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIG1lcmdlIHNhdmUgcmVzdWx0c1xuXG4gIC8vICNyZWdpb24gcXVlcnkgJiBzYXZlIGhlbHBlcnNcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyB0byBtZXJnZVxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBDb2xsZWN0aW9uIGludG8gd2hpY2ggZW50aXRpZXMgYXJlIG1lcmdlZFxuICAgKiBAcGFyYW0gZGVmYXVsdE1lcmdlU3RyYXRlZ3kgSG93IHRvIG1lcmdlIHdoZW4gYWN0aW9uJ3MgTWVyZ2VTdHJhdGVneSBpcyB1bnNwZWNpZmllZFxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRoZSBhY3Rpb24ncyBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcml2YXRlIG1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgZGVmYXVsdE1lcmdlU3RyYXRlZ3k6IE1lcmdlU3RyYXRlZ3ksXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0aWVzID09IG51bGwgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBtZXJnZS5cbiAgICB9XG5cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZTtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IGRlZmF1bHRNZXJnZVN0cmF0ZWd5IDogbWVyZ2VTdHJhdGVneTtcblxuICAgIHN3aXRjaCAobWVyZ2VTdHJhdGVneSkge1xuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXM6XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzOlxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICAgIGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlczoge1xuICAgICAgICBjb25zdCB1cHNlcnRFbnRpdGllcyA9IFtdIGFzIFRbXTtcbiAgICAgICAgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgLi4uY2hnU3RhdGUsXG4gICAgICAgICAgICAgICAgW2lkXToge1xuICAgICAgICAgICAgICAgICAgLi4uY2hnU3RhdGVbaWRdISxcbiAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IGVudGl0eSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cHNlcnRFbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KHVwc2VydEVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vICNlbmRyZWdpb24gcXVlcnkgJiBzYXZlIGhlbHBlcnNcblxuICAvLyAjcmVnaW9uIHRyYWNrIG1ldGhvZHNcbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSBhZGRpbmcgdGhlbSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgYWRkIHRvIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXRpZXMgdG8gYWRkLiBUaGV5IG11c3QgYWxsIGhhdmUgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja0FkZE1hbnkoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgZW50aXRpZXMgPT0gbnVsbCB8fFxuICAgICAgZW50aXRpZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKGlkID09IG51bGwgfHwgaWQgPT09ICcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtjb2xsZWN0aW9uLmVudGl0eU5hbWV9IGVudGl0eSBhZGQgcmVxdWlyZXMgYSBrZXkgdG8gYmUgdHJhY2tlZGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG5cbiAgICAgIGlmICghdHJhY2tlZENoYW5nZSkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgIH1cbiAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkFkZGVkIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYW4gZW50aXR5IGJlZm9yZSBhZGRpbmcgaXQgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIGFkZCB0byB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gYWRkLiBJdCBtdXN0IGhhdmUgYW4gaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgaW1wbGVtZW50YXRpb24gc3VwcGxpZXMgYSBkZWZhdWx0IHN0cmF0ZWd5LlxuICAgKi9cbiAgdHJhY2tBZGRPbmUoXG4gICAgZW50aXR5OiBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja0FkZE1hbnkoW2VudGl0eV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSByZW1vdmluZyB0aGVtIHdpdGggdGhlIGludGVudGlvbiBvZiBkZWxldGluZyB0aGVtIG9uIHRoZSBzZXJ2ZXIuXG4gICAqIERvZXMgTk9UIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tEZWxldGVNYW55KFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIGtleXMgPT0gbnVsbCB8fFxuICAgICAga2V5cy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHRyYWNrXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBlbnRpdHlNYXAgPSBjb2xsZWN0aW9uLmVudGl0aWVzO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0ga2V5cy5yZWR1Y2UoKGNoZ1N0YXRlLCBpZCkgPT4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICBpZiAob3JpZ2luYWxWYWx1ZSkge1xuICAgICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICBpZiAodHJhY2tlZENoYW5nZSkge1xuICAgICAgICAgIGlmICh0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuQWRkZWQpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZTogc3RvcCB0cmFja2luZyBhbiBhZGRlZCBlbnRpdHkgdGhhdCB5b3UgZGVsZXRlXG4gICAgICAgICAgICAvLyBUaGUgY2FsbGVyIG11c3QgYWxzbyBkZXRlY3QgdGhpcywgcmVtb3ZlIGl0IGltbWVkaWF0ZWx5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIC8vIGFuZCBza2lwIGF0dGVtcHQgdG8gZGVsZXRlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICBjbG9uZUNoZ1N0YXRlT25jZSgpO1xuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRyYWNrZWRDaGFuZ2UuY2hhbmdlVHlwZSA9PT0gQ2hhbmdlVHlwZS5VcGRhdGVkKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2U6IHN3aXRjaCBjaGFuZ2UgdHlwZSBmcm9tIFVwZGF0ZWQgdG8gRGVsZXRlZC5cbiAgICAgICAgICAgIGNsb25lQ2hnU3RhdGVPbmNlKCk7XG4gICAgICAgICAgICB0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPSBDaGFuZ2VUeXBlLkRlbGV0ZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFN0YXJ0IHRyYWNraW5nIHRoaXMgZW50aXR5XG4gICAgICAgICAgY2xvbmVDaGdTdGF0ZU9uY2UoKTtcbiAgICAgICAgICBjaGdTdGF0ZVtpZF0gPSB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuRGVsZXRlZCwgb3JpZ2luYWxWYWx1ZSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG5cbiAgICAgIGZ1bmN0aW9uIGNsb25lQ2hnU3RhdGVPbmNlKCkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgaXQgaXMgcmVtb3ZlZCB3aXRoIHRoZSBpbnRlbnRpb24gb2YgZGVsZXRpbmcgaXQgb24gdGhlIHNlcnZlci5cbiAgICogRG9lcyBOT1QgcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrRGVsZXRlT25lKFxuICAgIGtleTogbnVtYmVyIHwgc3RyaW5nLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGtleSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja0RlbGV0ZU1hbnkoW2tleV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSB1cGRhdGluZyB0aGVtIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIHVwZGF0ZXMgVGhlIGVudGl0aWVzIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcGRhdGVNYW55KFxuICAgIHVwZGF0ZXM6IFVwZGF0ZTxUPltdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICB1cGRhdGVzID09IG51bGwgfHxcbiAgICAgIHVwZGF0ZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IHVwZGF0ZXMucmVkdWNlKChjaGdTdGF0ZSwgdXBkYXRlKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzOiBlbnRpdHkgfSA9IHVwZGF0ZTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgdXBkYXRlIHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gZW50aXR5TWFwW2lkXTtcbiAgICAgIC8vIE9ubHkgdHJhY2sgaWYgaXQgaXMgaW4gdGhlIGNvbGxlY3Rpb24uIFNpbGVudGx5IGlnbm9yZSBpZiBpdCBpcyBub3QuXG4gICAgICAvLyBAbmdyeC9lbnRpdHkgYWRhcHRlciB3b3VsZCBhbHNvIHNpbGVudGx5IGlnbm9yZS5cbiAgICAgIC8vIFRvZG86IHNob3VsZCBtaXNzaW5nIHVwZGF0ZSBlbnRpdHkgcmVhbGx5IGJlIHJlcG9ydGVkIGFzIGFuIGVycm9yP1xuICAgICAgaWYgKG9yaWdpbmFsVmFsdWUpIHtcbiAgICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgaWYgKCF0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLlVwZGF0ZWQsIG9yaWdpbmFsVmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgdXBkYXRpbmcgaXQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIHVwZGF0ZSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gdXBkYXRlIFRoZSBlbnRpdHkgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1VwZGF0ZU9uZShcbiAgICB1cGRhdGU6IFVwZGF0ZTxUPixcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB1cGRhdGUgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tVcGRhdGVNYW55KFt1cGRhdGVdLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgdXBzZXJ0aW5nIChhZGRpbmcgYW5kIHVwZGF0aW5nKSB0aGVtIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0aWVzIFRoZSBlbnRpdGllcyB0byBhZGQgb3IgdXBkYXRlLiBUaGV5IG11c3QgYmUgY29tcGxldGUgZW50aXRpZXMgd2l0aCBpZHMuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBzZXJ0TWFueShcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICBlbnRpdGllcyA9PSBudWxsIHx8XG4gICAgICBlbnRpdGllcy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHRyYWNrXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBlbnRpdHlNYXAgPSBjb2xsZWN0aW9uLmVudGl0aWVzO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgdXBzZXJ0IHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuXG4gICAgICBpZiAoIXRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICAgIGNoZ1N0YXRlW2lkXSA9XG4gICAgICAgICAgb3JpZ2luYWxWYWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5BZGRlZCB9XG4gICAgICAgICAgICA6IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5VcGRhdGVkLCBvcmlnaW5hbFZhbHVlIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYW4gZW50aXR5IGJlZm9yZSB1cHNlcnQgKGFkZGluZyBhbmQgdXBkYXRpbmcpIGl0IHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0aWVzIFRoZSBlbnRpdHkgdG8gYWRkIG9yIHVwZGF0ZS4gSXQgbXVzdCBiZSBhIGNvbXBsZXRlIGVudGl0eSB3aXRoIGl0cyBpZC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcHNlcnRPbmUoXG4gICAgZW50aXR5OiBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja1Vwc2VydE1hbnkoW2VudGl0eV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG4gIC8vICNlbmRyZWdpb24gdHJhY2sgbWV0aG9kc1xuXG4gIC8vICNyZWdpb24gdW5kbyBtZXRob2RzXG4gIC8qKlxuICAgKiBSZXZlcnQgdGhlIHVuc2F2ZWQgY2hhbmdlcyBmb3IgYWxsIGNvbGxlY3Rpb24uXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIHVuZG8uXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgdW5kb0FsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgaWRzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICBjb25zdCB7IHJlbW92ZSwgdXBzZXJ0IH0gPSBpZHMucmVkdWNlKFxuICAgICAgKGFjYywgaWQpID0+IHtcbiAgICAgICAgY29uc3QgY2hhbmdlU3RhdGUgPSBhY2MuY2hnU3RhdGVbaWRdITtcbiAgICAgICAgc3dpdGNoIChjaGFuZ2VTdGF0ZS5jaGFuZ2VUeXBlKSB7XG4gICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkFkZGVkOlxuICAgICAgICAgICAgYWNjLnJlbW92ZS5wdXNoKGlkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5EZWxldGVkOlxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGNoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKHJlbW92ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLlVwZGF0ZWQ6XG4gICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2goY2hhbmdlU3RhdGUhLm9yaWdpbmFsVmFsdWUhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAgLy8gZW50aXRpZXNUb1VuZG9cbiAgICAgIHtcbiAgICAgICAgcmVtb3ZlOiBbXSBhcyAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgICAgICB1cHNlcnQ6IFtdIGFzIFRbXSxcbiAgICAgICAgY2hnU3RhdGU6IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShyZW1vdmUgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnQsIGNvbGxlY3Rpb24pO1xuXG4gICAgcmV0dXJuIHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGU6IHt9IH07XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJ0IHRoZSB1bnNhdmVkIGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdGllcy5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gdW5kby5cbiAgICogQHBhcmFtIGVudGl0eU9ySWRMaXN0IFRoZSBlbnRpdGllcyB0byByZXZlcnQgb3IgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9NYW55KFxuICAgIGVudGl0eU9ySWRMaXN0OiAobnVtYmVyIHwgc3RyaW5nIHwgVClbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChlbnRpdHlPcklkTGlzdCA9PSBudWxsIHx8IGVudGl0eU9ySWRMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdW5kb1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG5cbiAgICBjb25zdCB7IGNoYW5nZVN0YXRlLCByZW1vdmUsIHVwc2VydCB9ID0gZW50aXR5T3JJZExpc3QucmVkdWNlKFxuICAgICAgKGFjYywgZW50aXR5T3JJZCkgPT4ge1xuICAgICAgICBsZXQgY2hnU3RhdGUgPSBhY2MuY2hhbmdlU3RhdGU7XG4gICAgICAgIGNvbnN0IGlkID1cbiAgICAgICAgICB0eXBlb2YgZW50aXR5T3JJZCA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgID8gdGhpcy5zZWxlY3RJZChlbnRpdHlPcklkKVxuICAgICAgICAgICAgOiAoZW50aXR5T3JJZCBhcyBzdHJpbmcgfCBudW1iZXIpO1xuICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtpZF0hO1xuICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTsgLy8gY2xlYXIgdHJhY2tpbmcgb2YgdGhpcyBlbnRpdHlcbiAgICAgICAgICBhY2MuY2hhbmdlU3RhdGUgPSBjaGdTdGF0ZTtcbiAgICAgICAgICBzd2l0Y2ggKGNoYW5nZS5jaGFuZ2VUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuQWRkZWQ6XG4gICAgICAgICAgICAgIGFjYy5yZW1vdmUucHVzaChpZCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkRlbGV0ZWQ6XG4gICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBjaGFuZ2UhLm9yaWdpbmFsVmFsdWU7XG4gICAgICAgICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKHJlbW92ZWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLlVwZGF0ZWQ6XG4gICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChjaGFuZ2UhLm9yaWdpbmFsVmFsdWUhKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAgLy8gZW50aXRpZXNUb1VuZG9cbiAgICAgIHtcbiAgICAgICAgcmVtb3ZlOiBbXSBhcyAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgICAgICB1cHNlcnQ6IFtdIGFzIFRbXSxcbiAgICAgICAgY2hhbmdlU3RhdGU6IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShyZW1vdmUgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnQsIGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydCB0aGUgdW5zYXZlZCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXR5LlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byB1bmRvLlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZCBUaGUgZW50aXR5IHRvIHJldmVydCBvciBpdHMgaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgdW5kb09uZShcbiAgICBlbnRpdHlPcklkOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eU9ySWQgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudW5kb01hbnkoW2VudGl0eU9ySWRdLCBjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHVuZG8gbWV0aG9kc1xufVxuIl19