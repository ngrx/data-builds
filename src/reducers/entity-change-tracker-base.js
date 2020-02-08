(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/entity-change-tracker-base", ["require", "exports", "@ngrx/data/src/reducers/entity-collection", "@ngrx/data/src/utils/utilities", "@ngrx/data/src/actions/merge-strategy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entity_collection_1 = require("@ngrx/data/src/reducers/entity-collection");
    const utilities_1 = require("@ngrx/data/src/utils/utilities");
    const merge_strategy_1 = require("@ngrx/data/src/actions/merge-strategy");
    /**
     * The default implementation of EntityChangeTracker with
     * methods for tracking, committing, and reverting/undoing unsaved entity changes.
     * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
     * See EntityChangeTracker docs.
     */
    class EntityChangeTrackerBase {
        constructor(adapter, selectId) {
            this.adapter = adapter;
            this.selectId = selectId;
            /** Extract the primary key (id); default to `id` */
            this.selectId = selectId || utilities_1.defaultSelectId;
        }
        // #region commit methods
        /**
         * Commit all changes as when the collection has been completely reloaded from the server.
         * Harmless when there are no entity changes to commit.
         * @param collection The entity collection
         */
        commitAll(collection) {
            return Object.keys(collection.changeState).length === 0
                ? collection
                : Object.assign(Object.assign({}, collection), { changeState: {} });
        }
        /**
         * Commit changes for the given entities as when they have been refreshed from the server.
         * Harmless when there are no entity changes to commit.
         * @param entityOrIdList The entities to clear tracking or their ids.
         * @param collection The entity collection
         */
        commitMany(entityOrIdList, collection) {
            if (entityOrIdList == null || entityOrIdList.length === 0) {
                return collection; // nothing to commit
            }
            let didMutate = false;
            const changeState = entityOrIdList.reduce((chgState, entityOrId) => {
                const id = typeof entityOrId === 'object'
                    ? this.selectId(entityOrId)
                    : entityOrId;
                if (chgState[id]) {
                    if (!didMutate) {
                        chgState = Object.assign({}, chgState);
                        didMutate = true;
                    }
                    delete chgState[id];
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
        }
        /**
         * Commit changes for the given entity as when it have been refreshed from the server.
         * Harmless when no entity changes to commit.
         * @param entityOrId The entity to clear tracking or its id.
         * @param collection The entity collection
         */
        commitOne(entityOrId, collection) {
            return entityOrId == null
                ? collection
                : this.commitMany([entityOrId], collection);
        }
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
        mergeQueryResults(entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, merge_strategy_1.MergeStrategy.PreserveChanges, mergeStrategy);
        }
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
        mergeSaveAdds(entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, merge_strategy_1.MergeStrategy.OverwriteChanges, mergeStrategy);
        }
        /**
         * Merge successful result of deleting entities on the server that have the given primary keys
         * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
         * @param entities keys primary keys of the entities to remove/delete.
         * @param collection The entity collection
         * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
         * Defaults to MergeStrategy.OverwriteChanges.
         * @returns The merged EntityCollection.
         */
        mergeSaveDeletes(keys, collection, mergeStrategy) {
            mergeStrategy =
                mergeStrategy == null ? merge_strategy_1.MergeStrategy.OverwriteChanges : mergeStrategy;
            // same logic for all non-ignore merge strategies: always clear (commit) the changes
            const deleteIds = keys; // make TypeScript happy
            collection =
                mergeStrategy === merge_strategy_1.MergeStrategy.IgnoreChanges
                    ? collection
                    : this.commitMany(deleteIds, collection);
            return this.adapter.removeMany(deleteIds, collection);
        }
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
        mergeSaveUpdates(updateResponseData, collection, mergeStrategy, skipUnchanged = false) {
            if (updateResponseData == null || updateResponseData.length === 0) {
                return collection; // nothing to merge.
            }
            let didMutate = false;
            let changeState = collection.changeState;
            mergeStrategy =
                mergeStrategy == null ? merge_strategy_1.MergeStrategy.OverwriteChanges : mergeStrategy;
            let updates;
            switch (mergeStrategy) {
                case merge_strategy_1.MergeStrategy.IgnoreChanges:
                    updates = filterChanged(updateResponseData);
                    return this.adapter.updateMany(updates, collection);
                case merge_strategy_1.MergeStrategy.OverwriteChanges:
                    changeState = updateResponseData.reduce((chgState, update) => {
                        const oldId = update.id;
                        const change = chgState[oldId];
                        if (change) {
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            delete chgState[oldId];
                        }
                        return chgState;
                    }, collection.changeState);
                    collection = didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
                    updates = filterChanged(updateResponseData);
                    return this.adapter.updateMany(updates, collection);
                case merge_strategy_1.MergeStrategy.PreserveChanges: {
                    const updateableEntities = [];
                    changeState = updateResponseData.reduce((chgState, update) => {
                        const oldId = update.id;
                        const change = chgState[oldId];
                        if (change) {
                            // Tracking a change so update original value but not the current value
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            const newId = this.selectId(update.changes);
                            const oldChangeState = change;
                            // If the server changed the id, register the new "originalValue" under the new id
                            // and remove the change tracked under the old id.
                            if (newId !== oldId) {
                                delete chgState[oldId];
                            }
                            const newOrigValue = Object.assign(Object.assign({}, oldChangeState.originalValue), update.changes);
                            chgState[newId] = Object.assign(Object.assign({}, oldChangeState), { originalValue: newOrigValue });
                        }
                        else {
                            updateableEntities.push(update);
                        }
                        return chgState;
                    }, collection.changeState);
                    collection = didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
                    updates = filterChanged(updateableEntities);
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
                    responseData = responseData.filter(r => r.changed === true);
                }
                // Strip unchanged property from responseData, leaving just the pure Update<T>
                // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
                return responseData.map(r => ({ id: r.id, changes: r.changes }));
            }
        }
        /**
         * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
         * The default is MergeStrategy.OverwriteChanges.
         * @param entities Entities returned from saving upserts to the server.
         * @param collection The entity collection
         * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
         * Defaults to MergeStrategy.OverwriteChanges.
         * @returns The merged EntityCollection.
         */
        mergeSaveUpserts(entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, merge_strategy_1.MergeStrategy.OverwriteChanges, mergeStrategy);
        }
        // #endregion merge save results
        // #region query & save helpers
        /**
         *
         * @param entities Entities to merge
         * @param collection Collection into which entities are merged
         * @param defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
         * @param [mergeStrategy] The action's MergeStrategy
         */
        mergeServerUpserts(entities, collection, defaultMergeStrategy, mergeStrategy) {
            if (entities == null || entities.length === 0) {
                return collection; // nothing to merge.
            }
            let didMutate = false;
            let changeState = collection.changeState;
            mergeStrategy =
                mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
            switch (mergeStrategy) {
                case merge_strategy_1.MergeStrategy.IgnoreChanges:
                    return this.adapter.upsertMany(entities, collection);
                case merge_strategy_1.MergeStrategy.OverwriteChanges:
                    collection = this.adapter.upsertMany(entities, collection);
                    changeState = entities.reduce((chgState, entity) => {
                        const id = this.selectId(entity);
                        const change = chgState[id];
                        if (change) {
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            delete chgState[id];
                        }
                        return chgState;
                    }, collection.changeState);
                    return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
                case merge_strategy_1.MergeStrategy.PreserveChanges: {
                    const upsertEntities = [];
                    changeState = entities.reduce((chgState, entity) => {
                        const id = this.selectId(entity);
                        const change = chgState[id];
                        if (change) {
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            change.originalValue = entity;
                        }
                        else {
                            upsertEntities.push(entity);
                        }
                        return chgState;
                    }, collection.changeState);
                    collection = this.adapter.upsertMany(upsertEntities, collection);
                    return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
                }
            }
        }
        // #endregion query & save helpers
        // #region track methods
        /**
         * Track multiple entities before adding them to the collection.
         * Does NOT add to the collection (the reducer's job).
         * @param entities The entities to add. They must all have their ids.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackAddMany(entities, collection, mergeStrategy) {
            if (mergeStrategy === merge_strategy_1.MergeStrategy.IgnoreChanges ||
                entities == null ||
                entities.length === 0) {
                return collection; // nothing to track
            }
            let didMutate = false;
            const changeState = entities.reduce((chgState, entity) => {
                const id = this.selectId(entity);
                if (id == null || id === '') {
                    throw new Error(`${collection.entityName} entity add requires a key to be tracked`);
                }
                const trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                    chgState[id] = { changeType: entity_collection_1.ChangeType.Added };
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
        }
        /**
         * Track an entity before adding it to the collection.
         * Does NOT add to the collection (the reducer's job).
         * @param entity The entity to add. It must have an id.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         * If not specified, implementation supplies a default strategy.
         */
        trackAddOne(entity, collection, mergeStrategy) {
            return entity == null
                ? collection
                : this.trackAddMany([entity], collection, mergeStrategy);
        }
        /**
         * Track multiple entities before removing them with the intention of deleting them on the server.
         * Does NOT remove from the collection (the reducer's job).
         * @param keys The primary keys of the entities to delete.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackDeleteMany(keys, collection, mergeStrategy) {
            if (mergeStrategy === merge_strategy_1.MergeStrategy.IgnoreChanges ||
                keys == null ||
                keys.length === 0) {
                return collection; // nothing to track
            }
            let didMutate = false;
            const entityMap = collection.entities;
            const changeState = keys.reduce((chgState, id) => {
                const originalValue = entityMap[id];
                if (originalValue) {
                    const trackedChange = chgState[id];
                    if (trackedChange) {
                        if (trackedChange.changeType === entity_collection_1.ChangeType.Added) {
                            // Special case: stop tracking an added entity that you delete
                            // The caller must also detect this, remove it immediately from the collection
                            // and skip attempt to delete on the server.
                            cloneChgStateOnce();
                            delete chgState[id];
                        }
                        else if (trackedChange.changeType === entity_collection_1.ChangeType.Updated) {
                            // Special case: switch change type from Updated to Deleted.
                            cloneChgStateOnce();
                            trackedChange.changeType = entity_collection_1.ChangeType.Deleted;
                        }
                    }
                    else {
                        // Start tracking this entity
                        cloneChgStateOnce();
                        chgState[id] = { changeType: entity_collection_1.ChangeType.Deleted, originalValue };
                    }
                }
                return chgState;
                function cloneChgStateOnce() {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                }
            }, collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
        }
        /**
         * Track an entity before it is removed with the intention of deleting it on the server.
         * Does NOT remove from the collection (the reducer's job).
         * @param key The primary key of the entity to delete.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackDeleteOne(key, collection, mergeStrategy) {
            return key == null
                ? collection
                : this.trackDeleteMany([key], collection, mergeStrategy);
        }
        /**
         * Track multiple entities before updating them in the collection.
         * Does NOT update the collection (the reducer's job).
         * @param updates The entities to update.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackUpdateMany(updates, collection, mergeStrategy) {
            if (mergeStrategy === merge_strategy_1.MergeStrategy.IgnoreChanges ||
                updates == null ||
                updates.length === 0) {
                return collection; // nothing to track
            }
            let didMutate = false;
            const entityMap = collection.entities;
            const changeState = updates.reduce((chgState, update) => {
                const { id, changes: entity } = update;
                if (id == null || id === '') {
                    throw new Error(`${collection.entityName} entity update requires a key to be tracked`);
                }
                const originalValue = entityMap[id];
                // Only track if it is in the collection. Silently ignore if it is not.
                // @ngrx/entity adapter would also silently ignore.
                // Todo: should missing update entity really be reported as an error?
                if (originalValue) {
                    const trackedChange = chgState[id];
                    if (!trackedChange) {
                        if (!didMutate) {
                            didMutate = true;
                            chgState = Object.assign({}, chgState);
                        }
                        chgState[id] = { changeType: entity_collection_1.ChangeType.Updated, originalValue };
                    }
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
        }
        /**
         * Track an entity before updating it in the collection.
         * Does NOT update the collection (the reducer's job).
         * @param update The entity to update.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackUpdateOne(update, collection, mergeStrategy) {
            return update == null
                ? collection
                : this.trackUpdateMany([update], collection, mergeStrategy);
        }
        /**
         * Track multiple entities before upserting (adding and updating) them to the collection.
         * Does NOT update the collection (the reducer's job).
         * @param entities The entities to add or update. They must be complete entities with ids.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackUpsertMany(entities, collection, mergeStrategy) {
            if (mergeStrategy === merge_strategy_1.MergeStrategy.IgnoreChanges ||
                entities == null ||
                entities.length === 0) {
                return collection; // nothing to track
            }
            let didMutate = false;
            const entityMap = collection.entities;
            const changeState = entities.reduce((chgState, entity) => {
                const id = this.selectId(entity);
                if (id == null || id === '') {
                    throw new Error(`${collection.entityName} entity upsert requires a key to be tracked`);
                }
                const trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                    const originalValue = entityMap[id];
                    chgState[id] =
                        originalValue == null
                            ? { changeType: entity_collection_1.ChangeType.Added }
                            : { changeType: entity_collection_1.ChangeType.Updated, originalValue };
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
        }
        /**
         * Track an entity before upsert (adding and updating) it to the collection.
         * Does NOT update the collection (the reducer's job).
         * @param entities The entity to add or update. It must be a complete entity with its id.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        trackUpsertOne(entity, collection, mergeStrategy) {
            return entity == null
                ? collection
                : this.trackUpsertMany([entity], collection, mergeStrategy);
        }
        // #endregion track methods
        // #region undo methods
        /**
         * Revert the unsaved changes for all collection.
         * Harmless when there are no entity changes to undo.
         * @param collection The entity collection
         */
        undoAll(collection) {
            const ids = Object.keys(collection.changeState);
            const { remove, upsert } = ids.reduce((acc, id) => {
                const changeState = acc.chgState[id];
                switch (changeState.changeType) {
                    case entity_collection_1.ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case entity_collection_1.ChangeType.Deleted:
                        const removed = changeState.originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case entity_collection_1.ChangeType.Updated:
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
            });
            collection = this.adapter.removeMany(remove, collection);
            collection = this.adapter.upsertMany(upsert, collection);
            return Object.assign(Object.assign({}, collection), { changeState: {} });
        }
        /**
         * Revert the unsaved changes for the given entities.
         * Harmless when there are no entity changes to undo.
         * @param entityOrIdList The entities to revert or their ids.
         * @param collection The entity collection
         */
        undoMany(entityOrIdList, collection) {
            if (entityOrIdList == null || entityOrIdList.length === 0) {
                return collection; // nothing to undo
            }
            let didMutate = false;
            const { changeState, remove, upsert } = entityOrIdList.reduce((acc, entityOrId) => {
                let chgState = acc.changeState;
                const id = typeof entityOrId === 'object'
                    ? this.selectId(entityOrId)
                    : entityOrId;
                const change = chgState[id];
                if (change) {
                    if (!didMutate) {
                        chgState = Object.assign({}, chgState);
                        didMutate = true;
                    }
                    delete chgState[id]; // clear tracking of this entity
                    acc.changeState = chgState;
                    switch (change.changeType) {
                        case entity_collection_1.ChangeType.Added:
                            acc.remove.push(id);
                            break;
                        case entity_collection_1.ChangeType.Deleted:
                            const removed = change.originalValue;
                            if (removed) {
                                acc.upsert.push(removed);
                            }
                            break;
                        case entity_collection_1.ChangeType.Updated:
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
            });
            collection = this.adapter.removeMany(remove, collection);
            collection = this.adapter.upsertMany(upsert, collection);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
        }
        /**
         * Revert the unsaved changes for the given entity.
         * Harmless when there are no entity changes to undo.
         * @param entityOrId The entity to revert or its id.
         * @param collection The entity collection
         */
        undoOne(entityOrId, collection) {
            return entityOrId == null
                ? collection
                : this.undoMany([entityOrId], collection);
        }
    }
    exports.EntityChangeTrackerBase = EntityChangeTrackerBase;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUEsaUZBQW1FO0lBQ25FLDhEQUFxRDtJQUVyRCwwRUFBMEQ7SUFHMUQ7Ozs7O09BS0c7SUFDSCxNQUFhLHVCQUF1QjtRQUNsQyxZQUNVLE9BQXlCLEVBQ3pCLFFBQXVCO1lBRHZCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1lBQ3pCLGFBQVEsR0FBUixRQUFRLENBQWU7WUFFL0Isb0RBQW9EO1lBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLDJCQUFlLENBQUM7UUFDOUMsQ0FBQztRQUVELHlCQUF5QjtRQUN6Qjs7OztXQUlHO1FBQ0gsU0FBUyxDQUFDLFVBQStCO1lBQ3ZDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7Z0JBQ3JELENBQUMsQ0FBQyxVQUFVO2dCQUNaLENBQUMsaUNBQU0sVUFBVSxLQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUUsQ0FBQztRQUN6QyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCxVQUFVLENBQ1IsY0FBdUMsRUFDdkMsVUFBK0I7WUFFL0IsSUFBSSxjQUFjLElBQUksSUFBSSxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN6RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQjthQUN4QztZQUNELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxFQUFFO2dCQUNqRSxNQUFNLEVBQUUsR0FDTixPQUFPLFVBQVUs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TUFBTSxPQUFPLEdBQUcsTUFBTyxDQUFDLGFBQWEsQ0FBQzs0QkFDdEMsSUFBSSxPQUFPLEVBQUU7Z0NBQ1gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7NkJBQzFCOzRCQUNELE1BQU07d0JBQ1IsS0FBSyw4QkFBVSxDQUFDLE9BQU87NEJBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxhQUFjLENBQUMsQ0FBQzs0QkFDeEMsTUFBTTtxQkFDVDtpQkFDRjtnQkFDRCxPQUFPLEdBQUcsQ0FBQztZQUNiLENBQUM7WUFDRCxpQkFBaUI7WUFDakI7Z0JBQ0UsTUFBTSxFQUFFLEVBQXlCO2dCQUNqQyxNQUFNLEVBQUUsRUFBUztnQkFDakIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXO2FBQ3BDLENBQ0YsQ0FBQztZQUVGLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFrQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekQsT0FBTyxTQUFTLENBQUMsQ0FBQyxpQ0FBTSxVQUFVLEtBQUUsV0FBVyxJQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDakUsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsT0FBTyxDQUNMLFVBQStCLEVBQy9CLFVBQStCO1lBRS9CLE9BQU8sVUFBVSxJQUFJLElBQUk7Z0JBQ3ZCLENBQUMsQ0FBQyxVQUFVO2dCQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUVGO0lBanRCRCwwREFpdEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgQ2hhbmdlVHlwZSwgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXIgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlcic7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBFbnRpdHlDaGFuZ2VUcmFja2VyIHdpdGhcbiAqIG1ldGhvZHMgZm9yIHRyYWNraW5nLCBjb21taXR0aW5nLCBhbmQgcmV2ZXJ0aW5nL3VuZG9pbmcgdW5zYXZlZCBlbnRpdHkgY2hhbmdlcy5cbiAqIFVzZWQgYnkgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzIHdoaWNoIHNob3VsZCBjYWxsIHRyYWNrZXIgbWV0aG9kcyBCRUZPUkUgbW9kaWZ5aW5nIHRoZSBjb2xsZWN0aW9uLlxuICogU2VlIEVudGl0eUNoYW5nZVRyYWNrZXIgZG9jcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q2hhbmdlVHJhY2tlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWRhcHRlcjogRW50aXR5QWRhcHRlcjxUPixcbiAgICBwcml2YXRlIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+XG4gICkge1xuICAgIC8qKiBFeHRyYWN0IHRoZSBwcmltYXJ5IGtleSAoaWQpOyBkZWZhdWx0IHRvIGBpZGAgKi9cbiAgICB0aGlzLnNlbGVjdElkID0gc2VsZWN0SWQgfHwgZGVmYXVsdFNlbGVjdElkO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBjb21taXQgbWV0aG9kc1xuICAvKipcbiAgICogQ29tbWl0IGFsbCBjaGFuZ2VzIGFzIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gY29tcGxldGVseSByZWxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIGNvbW1pdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRBbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKS5sZW5ndGggPT09IDBcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlOiB7fSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1pdCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXRpZXMgYXMgd2hlbiB0aGV5IGhhdmUgYmVlbiByZWZyZXNoZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkTGlzdCBUaGUgZW50aXRpZXMgdG8gY2xlYXIgdHJhY2tpbmcgb3IgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdE1hbnkoXG4gICAgZW50aXR5T3JJZExpc3Q6IChudW1iZXIgfCBzdHJpbmcgfCBUKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0eU9ySWRMaXN0ID09IG51bGwgfHwgZW50aXR5T3JJZExpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBjb21taXRcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXR5T3JJZExpc3QucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5T3JJZCkgPT4ge1xuICAgICAgY29uc3QgaWQgPVxuICAgICAgICB0eXBlb2YgZW50aXR5T3JJZCA9PT0gJ29iamVjdCdcbiAgICAgICAgICA/IHRoaXMuc2VsZWN0SWQoZW50aXR5T3JJZClcbiAgICAgICAgICA6IChlbnRpdHlPcklkIGFzIHN0cmluZyB8IG51bWJlcik7XG4gICAgICBpZiAoY2hnU3RhdGVbaWRdKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgY2hnU3RhdGVbaWRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogQ29tbWl0IGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgYXMgd2hlbiBpdCBoYXZlIGJlZW4gcmVmcmVzaGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICogSGFybWxlc3Mgd2hlbiBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkIFRoZSBlbnRpdHkgdG8gY2xlYXIgdHJhY2tpbmcgb3IgaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdE9uZShcbiAgICBlbnRpdHlPcklkOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eU9ySWQgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMuY29tbWl0TWFueShbZW50aXR5T3JJZF0sIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBjb21taXQgbWV0aG9kc1xuXG4gIC8vICNyZWdpb24gbWVyZ2UgcXVlcnlcbiAgLyoqXG4gICAqIE1lcmdlIHF1ZXJ5IHJlc3VsdHMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyByZXR1cm5lZCBmcm9tIHF1ZXJ5aW5nIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHF1ZXJpZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlUXVlcnlSZXN1bHRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyxcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICB9XG4gIC8vICNlbmRyZWdpb24gbWVyZ2UgcXVlcnkgcmVzdWx0c1xuXG4gIC8vICNyZWdpb24gbWVyZ2Ugc2F2ZSByZXN1bHRzXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIG5ldyBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzYXZpbmcgbmV3IGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlQWRkcyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2Ugc3VjY2Vzc2Z1bCByZXN1bHQgb2YgZGVsZXRpbmcgZW50aXRpZXMgb24gdGhlIHNlcnZlciB0aGF0IGhhdmUgdGhlIGdpdmVuIHByaW1hcnkga2V5c1xuICAgKiBDbGVhcnMgdGhlIGVudGl0eSBjaGFuZ2VTdGF0ZSBmb3IgdGhvc2Uga2V5cyB1bmxlc3MgdGhlIE1lcmdlU3RyYXRlZ3kgaXMgaWdub3JlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIGtleXMgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmUvZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gYWRqdXN0IGNoYW5nZSB0cmFja2luZyB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlRGVsZXRlcyhcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIC8vIHNhbWUgbG9naWMgZm9yIGFsbCBub24taWdub3JlIG1lcmdlIHN0cmF0ZWdpZXM6IGFsd2F5cyBjbGVhciAoY29tbWl0KSB0aGUgY2hhbmdlc1xuICAgIGNvbnN0IGRlbGV0ZUlkcyA9IGtleXMgYXMgc3RyaW5nW107IC8vIG1ha2UgVHlwZVNjcmlwdCBoYXBweVxuICAgIGNvbGxlY3Rpb24gPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzXG4gICAgICAgID8gY29sbGVjdGlvblxuICAgICAgICA6IHRoaXMuY29tbWl0TWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgdXBkYXRlZCBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gdXBkYXRlUmVzcG9uc2VEYXRhIEVudGl0eSByZXNwb25zZSBkYXRhIHJldHVybmVkIGZyb20gc2F2aW5nIHVwZGF0ZWQgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gW3NraXBVbmNoYW5nZWRdIFRydWUgbWVhbnMgc2tpcCB1cGRhdGUgaWYgc2VydmVyIGRpZG4ndCBjaGFuZ2UgaXQuIEZhbHNlIGJ5IGRlZmF1bHQuXG4gICAqIElmIHRoZSB1cGRhdGUgd2FzIG9wdGltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgZGlkbid0IG1ha2UgbW9yZSBjaGFuZ2VzIG9mIGl0cyBvd25cbiAgICogdGhlbiB0aGUgdXBkYXRlcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbiBhbmQgc2hvdWxkbid0IG1ha2UgdGhlbSBhZ2Fpbi5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlVXBkYXRlcyhcbiAgICB1cGRhdGVSZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgc2tpcFVuY2hhbmdlZCA9IGZhbHNlXG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh1cGRhdGVSZXNwb25zZURhdGEgPT0gbnVsbCB8fCB1cGRhdGVSZXNwb25zZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBtZXJnZS5cbiAgICB9XG5cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZTtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgbGV0IHVwZGF0ZXM6IFVwZGF0ZTxUPltdO1xuXG4gICAgc3dpdGNoIChtZXJnZVN0cmF0ZWd5KSB7XG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlczpcbiAgICAgICAgdXBkYXRlcyA9IGZpbHRlckNoYW5nZWQodXBkYXRlUmVzcG9uc2VEYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlczpcbiAgICAgICAgY2hhbmdlU3RhdGUgPSB1cGRhdGVSZXNwb25zZURhdGEucmVkdWNlKChjaGdTdGF0ZSwgdXBkYXRlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkSWQgPSB1cGRhdGUuaWQ7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbb2xkSWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICBjb2xsZWN0aW9uID0gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgICB1cGRhdGVzID0gZmlsdGVyQ2hhbmdlZCh1cGRhdGVSZXNwb25zZURhdGEpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXM6IHtcbiAgICAgICAgY29uc3QgdXBkYXRlYWJsZUVudGl0aWVzID0gW10gYXMgVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W107XG4gICAgICAgIGNoYW5nZVN0YXRlID0gdXBkYXRlUmVzcG9uc2VEYXRhLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9sZElkID0gdXBkYXRlLmlkO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAvLyBUcmFja2luZyBhIGNoYW5nZSBzbyB1cGRhdGUgb3JpZ2luYWwgdmFsdWUgYnV0IG5vdCB0aGUgY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdJZCA9IHRoaXMuc2VsZWN0SWQodXBkYXRlLmNoYW5nZXMgYXMgVCk7XG4gICAgICAgICAgICBjb25zdCBvbGRDaGFuZ2VTdGF0ZSA9IGNoYW5nZTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBzZXJ2ZXIgY2hhbmdlZCB0aGUgaWQsIHJlZ2lzdGVyIHRoZSBuZXcgXCJvcmlnaW5hbFZhbHVlXCIgdW5kZXIgdGhlIG5ldyBpZFxuICAgICAgICAgICAgLy8gYW5kIHJlbW92ZSB0aGUgY2hhbmdlIHRyYWNrZWQgdW5kZXIgdGhlIG9sZCBpZC5cbiAgICAgICAgICAgIGlmIChuZXdJZCAhPT0gb2xkSWQpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld09yaWdWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgLi4uKG9sZENoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLih1cGRhdGUuY2hhbmdlcyBhcyBhbnkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIChjaGdTdGF0ZSBhcyBhbnkpW25ld0lkXSA9IHtcbiAgICAgICAgICAgICAgLi4ub2xkQ2hhbmdlU3RhdGUsXG4gICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IG5ld09yaWdWYWx1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZWFibGVFbnRpdGllcy5wdXNoKHVwZGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuXG4gICAgICAgIHVwZGF0ZXMgPSBmaWx0ZXJDaGFuZ2VkKHVwZGF0ZWFibGVFbnRpdGllcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25kaXRpb25hbGx5IGtlZXAgb25seSB0aG9zZSB1cGRhdGVzIHRoYXQgaGF2ZSBhZGRpdGlvbmFsIHNlcnZlciBjaGFuZ2VzLlxuICAgICAqIChlLmcuLCBmb3Igb3B0aW1pc3RpYyBzYXZlcyBiZWNhdXNlIHRoZXkgdXBkYXRlcyBhcmUgYWxyZWFkeSBpbiB0aGUgY3VycmVudCBjb2xsZWN0aW9uKVxuICAgICAqIFN0cmlwIG9mZiB0aGUgYGNoYW5nZWRgIHByb3BlcnR5LlxuICAgICAqIEByZXNwb25zZURhdGEgRW50aXR5IHJlc3BvbnNlIGRhdGEgZnJvbSBzZXJ2ZXIuXG4gICAgICogTWF5IGJlIGFuIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiwgYSBzdWJjbGFzcyBvZiBVcGRhdGU8VD4gd2l0aCBhICdjaGFuZ2VkJyBmbGFnLlxuICAgICAqIEByZXR1cm5zIFVwZGF0ZTxUPiAod2l0aG91dCB0aGUgY2hhbmdlZCBmbGFnKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlckNoYW5nZWQocmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSk6IFVwZGF0ZTxUPltdIHtcbiAgICAgIGlmIChza2lwVW5jaGFuZ2VkID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGtlZXAgb25seSB0aG9zZSB1cGRhdGVzIHRoYXQgdGhlIHNlcnZlciBjaGFuZ2VkIChrbm93YWJsZSBpZiBpcyBVcGRhdGVSZXNwb25zZURhdGE8VD4pXG4gICAgICAgIHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlRGF0YS5maWx0ZXIociA9PiByLmNoYW5nZWQgPT09IHRydWUpO1xuICAgICAgfVxuICAgICAgLy8gU3RyaXAgdW5jaGFuZ2VkIHByb3BlcnR5IGZyb20gcmVzcG9uc2VEYXRhLCBsZWF2aW5nIGp1c3QgdGhlIHB1cmUgVXBkYXRlPFQ+XG4gICAgICAvLyBUT0RPOiBSZW1vdmU/IHByb2JhYmx5IG5vdCBuZWNlc3NhcnkgYXMgdGhlIFVwZGF0ZSBpc24ndCBzdG9yZWQgYW5kIGFkYXB0ZXIgd2lsbCBpZ25vcmUgYGNoYW5nZWRgLlxuICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YS5tYXAociA9PiAoeyBpZDogci5pZCBhcyBhbnksIGNoYW5nZXM6IHIuY2hhbmdlcyB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgdXBzZXJ0ZWQgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHJldHVybmVkIGZyb20gc2F2aW5nIHVwc2VydHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVNhdmVVcHNlcnRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMsXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIG1lcmdlIHNhdmUgcmVzdWx0c1xuXG4gIC8vICNyZWdpb24gcXVlcnkgJiBzYXZlIGhlbHBlcnNcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyB0byBtZXJnZVxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBDb2xsZWN0aW9uIGludG8gd2hpY2ggZW50aXRpZXMgYXJlIG1lcmdlZFxuICAgKiBAcGFyYW0gZGVmYXVsdE1lcmdlU3RyYXRlZ3kgSG93IHRvIG1lcmdlIHdoZW4gYWN0aW9uJ3MgTWVyZ2VTdHJhdGVneSBpcyB1bnNwZWNpZmllZFxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRoZSBhY3Rpb24ncyBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcml2YXRlIG1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgZGVmYXVsdE1lcmdlU3RyYXRlZ3k6IE1lcmdlU3RyYXRlZ3ksXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0aWVzID09IG51bGwgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBtZXJnZS5cbiAgICB9XG5cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZTtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IGRlZmF1bHRNZXJnZVN0cmF0ZWd5IDogbWVyZ2VTdHJhdGVneTtcblxuICAgIHN3aXRjaCAobWVyZ2VTdHJhdGVneSkge1xuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXM6XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzOlxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICAgIGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlczoge1xuICAgICAgICBjb25zdCB1cHNlcnRFbnRpdGllcyA9IFtdIGFzIFRbXTtcbiAgICAgICAgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGFuZ2Uub3JpZ2luYWxWYWx1ZSA9IGVudGl0eTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBzZXJ0RW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnRFbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHF1ZXJ5ICYgc2F2ZSBoZWxwZXJzXG5cbiAgLy8gI3JlZ2lvbiB0cmFjayBtZXRob2RzXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgYWRkaW5nIHRoZW0gdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIGFkZCB0byB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgVGhlIGVudGl0aWVzIHRvIGFkZC4gVGhleSBtdXN0IGFsbCBoYXZlIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tBZGRNYW55KFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIGVudGl0aWVzID09IG51bGwgfHxcbiAgICAgIGVudGl0aWVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgYWRkIHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuXG4gICAgICBpZiAoIXRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG4gICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5BZGRlZCB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgYWRkaW5nIGl0IHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCBhZGQgdG8gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIGFkZC4gSXQgbXVzdCBoYXZlIGFuIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIGltcGxlbWVudGF0aW9uIHN1cHBsaWVzIGEgZGVmYXVsdCBzdHJhdGVneS5cbiAgICovXG4gIHRyYWNrQWRkT25lKFxuICAgIGVudGl0eTogVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tBZGRNYW55KFtlbnRpdHldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgcmVtb3ZpbmcgdGhlbSB3aXRoIHRoZSBpbnRlbnRpb24gb2YgZGVsZXRpbmcgdGhlbSBvbiB0aGUgc2VydmVyLlxuICAgKiBEb2VzIE5PVCByZW1vdmUgZnJvbSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrRGVsZXRlTWFueShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICBrZXlzID09IG51bGwgfHxcbiAgICAgIGtleXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGtleXMucmVkdWNlKChjaGdTdGF0ZSwgaWQpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgaWYgKG9yaWdpbmFsVmFsdWUpIHtcbiAgICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgaWYgKHRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgICBpZiAodHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2U6IHN0b3AgdHJhY2tpbmcgYW4gYWRkZWQgZW50aXR5IHRoYXQgeW91IGRlbGV0ZVxuICAgICAgICAgICAgLy8gVGhlIGNhbGxlciBtdXN0IGFsc28gZGV0ZWN0IHRoaXMsIHJlbW92ZSBpdCBpbW1lZGlhdGVseSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAgICAgICAvLyBhbmQgc2tpcCBhdHRlbXB0IHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyLlxuICAgICAgICAgICAgY2xvbmVDaGdTdGF0ZU9uY2UoKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgfSBlbHNlIGlmICh0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuVXBkYXRlZCkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlOiBzd2l0Y2ggY2hhbmdlIHR5cGUgZnJvbSBVcGRhdGVkIHRvIERlbGV0ZWQuXG4gICAgICAgICAgICBjbG9uZUNoZ1N0YXRlT25jZSgpO1xuICAgICAgICAgICAgdHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID0gQ2hhbmdlVHlwZS5EZWxldGVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTdGFydCB0cmFja2luZyB0aGlzIGVudGl0eVxuICAgICAgICAgIGNsb25lQ2hnU3RhdGVPbmNlKCk7XG4gICAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkRlbGV0ZWQsIG9yaWdpbmFsVmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuXG4gICAgICBmdW5jdGlvbiBjbG9uZUNoZ1N0YXRlT25jZSgpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIGl0IGlzIHJlbW92ZWQgd2l0aCB0aGUgaW50ZW50aW9uIG9mIGRlbGV0aW5nIGl0IG9uIHRoZSBzZXJ2ZXIuXG4gICAqIERvZXMgTk9UIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja0RlbGV0ZU9uZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBrZXkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tEZWxldGVNYW55KFtrZXldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgdXBkYXRpbmcgdGhlbSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSB1cGRhdGVzIFRoZSBlbnRpdGllcyB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBkYXRlTWFueShcbiAgICB1cGRhdGVzOiBVcGRhdGU8VD5bXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgdXBkYXRlcyA9PSBudWxsIHx8XG4gICAgICB1cGRhdGVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGVudGl0eU1hcCA9IGNvbGxlY3Rpb24uZW50aXRpZXM7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSB1cGRhdGVzLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlczogZW50aXR5IH0gPSB1cGRhdGU7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IHVwZGF0ZSByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICAvLyBPbmx5IHRyYWNrIGlmIGl0IGlzIGluIHRoZSBjb2xsZWN0aW9uLiBTaWxlbnRseSBpZ25vcmUgaWYgaXQgaXMgbm90LlxuICAgICAgLy8gQG5ncngvZW50aXR5IGFkYXB0ZXIgd291bGQgYWxzbyBzaWxlbnRseSBpZ25vcmUuXG4gICAgICAvLyBUb2RvOiBzaG91bGQgbWlzc2luZyB1cGRhdGUgZW50aXR5IHJlYWxseSBiZSByZXBvcnRlZCBhcyBhbiBlcnJvcj9cbiAgICAgIGlmIChvcmlnaW5hbFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgIGlmICghdHJhY2tlZENoYW5nZSkge1xuICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5VcGRhdGVkLCBvcmlnaW5hbFZhbHVlIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIHVwZGF0aW5nIGl0IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIHVwZGF0ZSBUaGUgZW50aXR5IHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcGRhdGVPbmUoXG4gICAgdXBkYXRlOiBVcGRhdGU8VD4sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdXBkYXRlID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnRyYWNrVXBkYXRlTWFueShbdXBkYXRlXSwgY29sbGVjdGlvbiwgbWVyZ2VTdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgbXVsdGlwbGUgZW50aXRpZXMgYmVmb3JlIHVwc2VydGluZyAoYWRkaW5nIGFuZCB1cGRhdGluZykgdGhlbSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXRpZXMgdG8gYWRkIG9yIHVwZGF0ZS4gVGhleSBtdXN0IGJlIGNvbXBsZXRlIGVudGl0aWVzIHdpdGggaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1Vwc2VydE1hbnkoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgZW50aXRpZXMgPT0gbnVsbCB8fFxuICAgICAgZW50aXRpZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IHVwc2VydCByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcblxuICAgICAgaWYgKCF0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgICBjaGdTdGF0ZVtpZF0gPVxuICAgICAgICAgIG9yaWdpbmFsVmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuQWRkZWQgfVxuICAgICAgICAgICAgOiB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuVXBkYXRlZCwgb3JpZ2luYWxWYWx1ZSB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgdXBzZXJ0IChhZGRpbmcgYW5kIHVwZGF0aW5nKSBpdCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXR5IHRvIGFkZCBvciB1cGRhdGUuIEl0IG11c3QgYmUgYSBjb21wbGV0ZSBlbnRpdHkgd2l0aCBpdHMgaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBzZXJ0T25lKFxuICAgIGVudGl0eTogVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tVcHNlcnRNYW55KFtlbnRpdHldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHRyYWNrIG1ldGhvZHNcblxuICAvLyAjcmVnaW9uIHVuZG8gbWV0aG9kc1xuICAvKipcbiAgICogUmV2ZXJ0IHRoZSB1bnNhdmVkIGNoYW5nZXMgZm9yIGFsbCBjb2xsZWN0aW9uLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byB1bmRvLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9BbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGlkcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgY29uc3QgeyByZW1vdmUsIHVwc2VydCB9ID0gaWRzLnJlZHVjZShcbiAgICAgIChhY2MsIGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gYWNjLmNoZ1N0YXRlW2lkXSE7XG4gICAgICAgIHN3aXRjaCAoY2hhbmdlU3RhdGUuY2hhbmdlVHlwZSkge1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5BZGRlZDpcbiAgICAgICAgICAgIGFjYy5yZW1vdmUucHVzaChpZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuRGVsZXRlZDpcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBjaGFuZ2VTdGF0ZSEub3JpZ2luYWxWYWx1ZTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChyZW1vdmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5VcGRhdGVkOlxuICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKGNoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlISk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIC8vIGVudGl0aWVzVG9VbmRvXG4gICAgICB7XG4gICAgICAgIHJlbW92ZTogW10gYXMgKG51bWJlciB8IHN0cmluZylbXSxcbiAgICAgICAgdXBzZXJ0OiBbXSBhcyBUW10sXG4gICAgICAgIGNoZ1N0YXRlOiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkocmVtb3ZlIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0LCBjb2xsZWN0aW9uKTtcblxuICAgIHJldHVybiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlOiB7fSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydCB0aGUgdW5zYXZlZCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXRpZXMuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIHVuZG8uXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkTGlzdCBUaGUgZW50aXRpZXMgdG8gcmV2ZXJ0IG9yIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICB1bmRvTWFueShcbiAgICBlbnRpdHlPcklkTGlzdDogKG51bWJlciB8IHN0cmluZyB8IFQpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoZW50aXR5T3JJZExpc3QgPT0gbnVsbCB8fCBlbnRpdHlPcklkTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHVuZG9cbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuXG4gICAgY29uc3QgeyBjaGFuZ2VTdGF0ZSwgcmVtb3ZlLCB1cHNlcnQgfSA9IGVudGl0eU9ySWRMaXN0LnJlZHVjZShcbiAgICAgIChhY2MsIGVudGl0eU9ySWQpID0+IHtcbiAgICAgICAgbGV0IGNoZ1N0YXRlID0gYWNjLmNoYW5nZVN0YXRlO1xuICAgICAgICBjb25zdCBpZCA9XG4gICAgICAgICAgdHlwZW9mIGVudGl0eU9ySWQgPT09ICdvYmplY3QnXG4gICAgICAgICAgICA/IHRoaXMuc2VsZWN0SWQoZW50aXR5T3JJZClcbiAgICAgICAgICAgIDogKGVudGl0eU9ySWQgYXMgc3RyaW5nIHwgbnVtYmVyKTtcbiAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdITtcbiAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07IC8vIGNsZWFyIHRyYWNraW5nIG9mIHRoaXMgZW50aXR5XG4gICAgICAgICAgYWNjLmNoYW5nZVN0YXRlID0gY2hnU3RhdGU7XG4gICAgICAgICAgc3dpdGNoIChjaGFuZ2UuY2hhbmdlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkFkZGVkOlxuICAgICAgICAgICAgICBhY2MucmVtb3ZlLnB1c2goaWQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5EZWxldGVkOlxuICAgICAgICAgICAgICBjb25zdCByZW1vdmVkID0gY2hhbmdlIS5vcmlnaW5hbFZhbHVlO1xuICAgICAgICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChyZW1vdmVkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5VcGRhdGVkOlxuICAgICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2goY2hhbmdlIS5vcmlnaW5hbFZhbHVlISk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIC8vIGVudGl0aWVzVG9VbmRvXG4gICAgICB7XG4gICAgICAgIHJlbW92ZTogW10gYXMgKG51bWJlciB8IHN0cmluZylbXSxcbiAgICAgICAgdXBzZXJ0OiBbXSBhcyBUW10sXG4gICAgICAgIGNoYW5nZVN0YXRlOiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkocmVtb3ZlIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0LCBjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnQgdGhlIHVuc2F2ZWQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0eS5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gdW5kby5cbiAgICogQHBhcmFtIGVudGl0eU9ySWQgVGhlIGVudGl0eSB0byByZXZlcnQgb3IgaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9PbmUoXG4gICAgZW50aXR5T3JJZDogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHlPcklkID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnVuZG9NYW55KFtlbnRpdHlPcklkXSwgY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiB1bmRvIG1ldGhvZHNcbn1cbiJdfQ==