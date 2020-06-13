/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-change-tracker-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeType } from './entity-collection';
import { defaultSelectId } from '../utils/utilities';
import { MergeStrategy } from '../actions/merge-strategy';
/**
 * The default implementation of EntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 * @template T
 */
export class EntityChangeTrackerBase {
    /**
     * @param {?} adapter
     * @param {?} selectId
     */
    constructor(adapter, selectId) {
        this.adapter = adapter;
        this.selectId = selectId;
        /** Extract the primary key (id); default to `id` */
        this.selectId = selectId || defaultSelectId;
    }
    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} collection The entity collection
     * @return {?}
     */
    commitAll(collection) {
        return Object.keys(collection.changeState).length === 0
            ? collection
            : Object.assign(Object.assign({}, collection), { changeState: {} });
    }
    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} entityOrIdList The entities to clear tracking or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    commitMany(entityOrIdList, collection) {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to commit
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        const changeState = entityOrIdList.reduce((/**
         * @param {?} chgState
         * @param {?} entityOrId
         * @return {?}
         */
        (chgState, entityOrId) => {
            /** @type {?} */
            const id = typeof entityOrId === 'object'
                ? this.selectId(entityOrId)
                : ((/** @type {?} */ (entityOrId)));
            if (chgState[id]) {
                if (!didMutate) {
                    chgState = Object.assign({}, chgState);
                    didMutate = true;
                }
                delete chgState[id];
            }
            return chgState;
        }), collection.changeState);
        return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
    }
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param {?} entityOrId The entity to clear tracking or its id.
     * @param {?} collection The entity collection
     * @return {?}
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
     * @param {?} entities Entities returned from querying the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    mergeQueryResults(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.PreserveChanges, mergeStrategy);
    }
    // #endregion merge query results
    // #region merge save results
    /**
     * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} entities Entities returned from saving new entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    mergeSaveAdds(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    }
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param {?} keys
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    mergeSaveDeletes(keys, collection, mergeStrategy) {
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        // same logic for all non-ignore merge strategies: always clear (commit) the changes
        /** @type {?} */
        const deleteIds = (/** @type {?} */ (keys));
        collection =
            mergeStrategy === MergeStrategy.IgnoreChanges
                ? collection
                : this.commitMany(deleteIds, collection);
        return this.adapter.removeMany(deleteIds, collection);
    }
    /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} updateResponseData Entity response data returned from saving updated entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @param {?=} skipUnchanged
     * @return {?} The merged EntityCollection.
     */
    mergeSaveUpdates(updateResponseData, collection, mergeStrategy, skipUnchanged = false) {
        if (updateResponseData == null || updateResponseData.length === 0) {
            return collection; // nothing to merge.
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        /** @type {?} */
        let updates;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.OverwriteChanges:
                changeState = updateResponseData.reduce((/**
                 * @param {?} chgState
                 * @param {?} update
                 * @return {?}
                 */
                (chgState, update) => {
                    /** @type {?} */
                    const oldId = update.id;
                    /** @type {?} */
                    const change = chgState[oldId];
                    if (change) {
                        if (!didMutate) {
                            chgState = Object.assign({}, chgState);
                            didMutate = true;
                        }
                        delete chgState[oldId];
                    }
                    return chgState;
                }), collection.changeState);
                collection = didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.PreserveChanges: {
                /** @type {?} */
                const updateableEntities = (/** @type {?} */ ([]));
                changeState = updateResponseData.reduce((/**
                 * @param {?} chgState
                 * @param {?} update
                 * @return {?}
                 */
                (chgState, update) => {
                    /** @type {?} */
                    const oldId = update.id;
                    /** @type {?} */
                    const change = chgState[oldId];
                    if (change) {
                        // Tracking a change so update original value but not the current value
                        if (!didMutate) {
                            chgState = Object.assign({}, chgState);
                            didMutate = true;
                        }
                        /** @type {?} */
                        const newId = this.selectId((/** @type {?} */ (update.changes)));
                        /** @type {?} */
                        const oldChangeState = change;
                        // If the server changed the id, register the new "originalValue" under the new id
                        // and remove the change tracked under the old id.
                        if (newId !== oldId) {
                            delete chgState[oldId];
                        }
                        /** @type {?} */
                        const newOrigValue = Object.assign(Object.assign({}, ((/** @type {?} */ ((/** @type {?} */ (oldChangeState)).originalValue)))), ((/** @type {?} */ (update.changes))));
                        ((/** @type {?} */ (chgState)))[newId] = Object.assign(Object.assign({}, oldChangeState), { originalValue: newOrigValue });
                    }
                    else {
                        updateableEntities.push(update);
                    }
                    return chgState;
                }), collection.changeState);
                collection = didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
                updates = filterChanged(updateableEntities);
                return this.adapter.updateMany(updates, collection);
            }
        }
        /**
         * Conditionally keep only those updates that have additional server changes.
         * (e.g., for optimistic saves because they updates are already in the current collection)
         * Strip off the `changed` property.
         * \@responseData Entity response data from server.
         * May be an UpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
         * @param {?} responseData
         * @return {?} Update<T> (without the changed flag)
         */
        function filterChanged(responseData) {
            if (skipUnchanged === true) {
                // keep only those updates that the server changed (knowable if is UpdateResponseData<T>)
                responseData = responseData.filter((/**
                 * @param {?} r
                 * @return {?}
                 */
                (r) => r.changed === true));
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map((/**
             * @param {?} r
             * @return {?}
             */
            (r) => ({ id: (/** @type {?} */ (r.id)), changes: r.changes })));
        }
    }
    /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} entities Entities returned from saving upserts to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    mergeSaveUpserts(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    }
    // #endregion merge save results
    // #region query & save helpers
    /**
     *
     * @private
     * @param {?} entities Entities to merge
     * @param {?} collection Collection into which entities are merged
     * @param {?} defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
     * @param {?=} mergeStrategy
     * @return {?}
     */
    mergeServerUpserts(entities, collection, defaultMergeStrategy, mergeStrategy) {
        if (entities == null || entities.length === 0) {
            return collection; // nothing to merge.
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                return this.adapter.upsertMany(entities, collection);
            case MergeStrategy.OverwriteChanges:
                collection = this.adapter.upsertMany(entities, collection);
                changeState = entities.reduce((/**
                 * @param {?} chgState
                 * @param {?} entity
                 * @return {?}
                 */
                (chgState, entity) => {
                    /** @type {?} */
                    const id = this.selectId(entity);
                    /** @type {?} */
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = Object.assign({}, chgState);
                            didMutate = true;
                        }
                        delete chgState[id];
                    }
                    return chgState;
                }), collection.changeState);
                return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
            case MergeStrategy.PreserveChanges: {
                /** @type {?} */
                const upsertEntities = (/** @type {?} */ ([]));
                changeState = entities.reduce((/**
                 * @param {?} chgState
                 * @param {?} entity
                 * @return {?}
                 */
                (chgState, entity) => {
                    /** @type {?} */
                    const id = this.selectId(entity);
                    /** @type {?} */
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = Object.assign(Object.assign({}, chgState), { [id]: Object.assign(Object.assign({}, (/** @type {?} */ (chgState[id]))), { originalValue: entity }) });
                            didMutate = true;
                        }
                    }
                    else {
                        upsertEntities.push(entity);
                    }
                    return chgState;
                }), collection.changeState);
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
     * @param {?} entities The entities to add. They must all have their ids.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackAddMany(entities, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        const changeState = entities.reduce((/**
         * @param {?} chgState
         * @param {?} entity
         * @return {?}
         */
        (chgState, entity) => {
            /** @type {?} */
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity add requires a key to be tracked`);
            }
            /** @type {?} */
            const trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = Object.assign({}, chgState);
                }
                chgState[id] = { changeType: ChangeType.Added };
            }
            return chgState;
        }), collection.changeState);
        return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
    }
    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param {?} entity The entity to add. It must have an id.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackAddOne(entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackAddMany([entity], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} keys The primary keys of the entities to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackDeleteMany(keys, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            keys == null ||
            keys.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        const entityMap = collection.entities;
        /** @type {?} */
        const changeState = keys.reduce((/**
         * @param {?} chgState
         * @param {?} id
         * @return {?}
         */
        (chgState, id) => {
            /** @type {?} */
            const originalValue = entityMap[id];
            if (originalValue) {
                /** @type {?} */
                const trackedChange = chgState[id];
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
                    chgState[id] = { changeType: ChangeType.Deleted, originalValue };
                }
            }
            return chgState;
            /**
             * @return {?}
             */
            function cloneChgStateOnce() {
                if (!didMutate) {
                    didMutate = true;
                    chgState = Object.assign({}, chgState);
                }
            }
        }), collection.changeState);
        return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
    }
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} key The primary key of the entity to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackDeleteOne(key, collection, mergeStrategy) {
        return key == null
            ? collection
            : this.trackDeleteMany([key], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} updates The entities to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackUpdateMany(updates, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            updates == null ||
            updates.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        const entityMap = collection.entities;
        /** @type {?} */
        const changeState = updates.reduce((/**
         * @param {?} chgState
         * @param {?} update
         * @return {?}
         */
        (chgState, update) => {
            const { id, changes: entity } = update;
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity update requires a key to be tracked`);
            }
            /** @type {?} */
            const originalValue = entityMap[id];
            // Only track if it is in the collection. Silently ignore if it is not.
            // @ngrx/entity adapter would also silently ignore.
            // Todo: should missing update entity really be reported as an error?
            if (originalValue) {
                /** @type {?} */
                const trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                    chgState[id] = { changeType: ChangeType.Updated, originalValue };
                }
            }
            return chgState;
        }), collection.changeState);
        return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
    }
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} update The entity to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackUpdateOne(update, collection, mergeStrategy) {
        return update == null
            ? collection
            : this.trackUpdateMany([update], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entities The entities to add or update. They must be complete entities with ids.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    trackUpsertMany(entities, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        let didMutate = false;
        /** @type {?} */
        const entityMap = collection.entities;
        /** @type {?} */
        const changeState = entities.reduce((/**
         * @param {?} chgState
         * @param {?} entity
         * @return {?}
         */
        (chgState, entity) => {
            /** @type {?} */
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity upsert requires a key to be tracked`);
            }
            /** @type {?} */
            const trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = Object.assign({}, chgState);
                }
                /** @type {?} */
                const originalValue = entityMap[id];
                chgState[id] =
                    originalValue == null
                        ? { changeType: ChangeType.Added }
                        : { changeType: ChangeType.Updated, originalValue };
            }
            return chgState;
        }), collection.changeState);
        return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
    }
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entity
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
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
     * @param {?} collection The entity collection
     * @return {?}
     */
    undoAll(collection) {
        /** @type {?} */
        const ids = Object.keys(collection.changeState);
        const { remove, upsert } = ids.reduce((/**
         * @param {?} acc
         * @param {?} id
         * @return {?}
         */
        (acc, id) => {
            /** @type {?} */
            const changeState = (/** @type {?} */ (acc.chgState[id]));
            switch (changeState.changeType) {
                case ChangeType.Added:
                    acc.remove.push(id);
                    break;
                case ChangeType.Deleted:
                    /** @type {?} */
                    const removed = (/** @type {?} */ (changeState)).originalValue;
                    if (removed) {
                        acc.upsert.push(removed);
                    }
                    break;
                case ChangeType.Updated:
                    acc.upsert.push((/** @type {?} */ ((/** @type {?} */ (changeState)).originalValue)));
                    break;
            }
            return acc;
        }), 
        // entitiesToUndo
        {
            remove: (/** @type {?} */ ([])),
            upsert: (/** @type {?} */ ([])),
            chgState: collection.changeState,
        });
        collection = this.adapter.removeMany((/** @type {?} */ (remove)), collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return Object.assign(Object.assign({}, collection), { changeState: {} });
    }
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrIdList The entities to revert or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    undoMany(entityOrIdList, collection) {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to undo
        }
        /** @type {?} */
        let didMutate = false;
        const { changeState, remove, upsert } = entityOrIdList.reduce((/**
         * @param {?} acc
         * @param {?} entityOrId
         * @return {?}
         */
        (acc, entityOrId) => {
            /** @type {?} */
            let chgState = acc.changeState;
            /** @type {?} */
            const id = typeof entityOrId === 'object'
                ? this.selectId(entityOrId)
                : ((/** @type {?} */ (entityOrId)));
            /** @type {?} */
            const change = (/** @type {?} */ (chgState[id]));
            if (change) {
                if (!didMutate) {
                    chgState = Object.assign({}, chgState);
                    didMutate = true;
                }
                delete chgState[id]; // clear tracking of this entity
                acc.changeState = chgState;
                switch (change.changeType) {
                    case ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case ChangeType.Deleted:
                        /** @type {?} */
                        const removed = (/** @type {?} */ (change)).originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case ChangeType.Updated:
                        acc.upsert.push((/** @type {?} */ ((/** @type {?} */ (change)).originalValue)));
                        break;
                }
            }
            return acc;
        }), 
        // entitiesToUndo
        {
            remove: (/** @type {?} */ ([])),
            upsert: (/** @type {?} */ ([])),
            changeState: collection.changeState,
        });
        collection = this.adapter.removeMany((/** @type {?} */ (remove)), collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return didMutate ? Object.assign(Object.assign({}, collection), { changeState }) : collection;
    }
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrId The entity to revert or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    undoOne(entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.undoMany([entityOrId], collection);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityChangeTrackerBase.prototype.adapter;
    /**
     * @type {?}
     * @private
     */
    EntityChangeTrackerBase.prototype.selectId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsT0FBTyxFQUFFLFVBQVUsRUFBb0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7OztBQVMxRCxNQUFNLE9BQU8sdUJBQXVCOzs7OztJQUNsQyxZQUNVLE9BQXlCLEVBQ3pCLFFBQXVCO1FBRHZCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFFL0Isb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLGVBQWUsQ0FBQztJQUM5QyxDQUFDOzs7Ozs7OztJQVFELFNBQVMsQ0FBQyxVQUErQjtRQUN2QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxVQUFVO1lBQ1osQ0FBQyxpQ0FBTSxVQUFVLEtBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRSxDQUFDO0lBQ3pDLENBQUM7Ozs7Ozs7O0lBUUQsVUFBVSxDQUNSLGNBQXVDLEVBQ3ZDLFVBQStCO1FBRS9CLElBQUksY0FBYyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQjtTQUN4Qzs7WUFDRyxTQUFTLEdBQUcsS0FBSzs7Y0FDZixXQUFXLEdBQUcsY0FBYyxDQUFDLE1BQU07Ozs7O1FBQUMsQ0FBQyxRQUFRLEVBQUUsVUFB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Q0FBQyxVQUFVLENBQUMsbUJBQUEsTUFBTSxFQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckUsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RCxPQUFPLFNBQVMsQ0FBQyxDQUFDLGlDQUFNLFVBQVUsS0FBRSxXQUFXLElBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNqRSxDQUFDOzs7Ozs7OztJQVFELE9BQU8sQ0FDTCxVQUErQixFQUMvQixVQUErQjtRQUUvQixPQUFPLFVBQVUsSUFBSSxJQUFJO1lBQ3ZCLENBQUMsQ0FBQyxVQUFVO1lBQ1osQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBRUY7Ozs7OztJQXB0QkcsMENBQWlDOzs7OztJQUNqQywyQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlBZGFwdGVyLCBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBDaGFuZ2VUeXBlLCBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5Q2hhbmdlVHJhY2tlciB9IGZyb20gJy4vZW50aXR5LWNoYW5nZS10cmFja2VyJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIEVudGl0eUNoYW5nZVRyYWNrZXIgd2l0aFxuICogbWV0aG9kcyBmb3IgdHJhY2tpbmcsIGNvbW1pdHRpbmcsIGFuZCByZXZlcnRpbmcvdW5kb2luZyB1bnNhdmVkIGVudGl0eSBjaGFuZ2VzLlxuICogVXNlZCBieSBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHMgd2hpY2ggc2hvdWxkIGNhbGwgdHJhY2tlciBtZXRob2RzIEJFRk9SRSBtb2RpZnlpbmcgdGhlIGNvbGxlY3Rpb24uXG4gKiBTZWUgRW50aXR5Q2hhbmdlVHJhY2tlciBkb2NzLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5Q2hhbmdlVHJhY2tlckJhc2U8VD4gaW1wbGVtZW50cyBFbnRpdHlDaGFuZ2VUcmFja2VyPFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhZGFwdGVyOiBFbnRpdHlBZGFwdGVyPFQ+LFxuICAgIHByaXZhdGUgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD5cbiAgKSB7XG4gICAgLyoqIEV4dHJhY3QgdGhlIHByaW1hcnkga2V5IChpZCk7IGRlZmF1bHQgdG8gYGlkYCAqL1xuICAgIHRoaXMuc2VsZWN0SWQgPSBzZWxlY3RJZCB8fCBkZWZhdWx0U2VsZWN0SWQ7XG4gIH1cblxuICAvLyAjcmVnaW9uIGNvbW1pdCBtZXRob2RzXG4gIC8qKlxuICAgKiBDb21taXQgYWxsIGNoYW5nZXMgYXMgd2hlbiB0aGUgY29sbGVjdGlvbiBoYXMgYmVlbiBjb21wbGV0ZWx5IHJlbG9hZGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gY29tbWl0LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdEFsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpLmxlbmd0aCA9PT0gMFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGU6IHt9IH07XG4gIH1cblxuICAvKipcbiAgICogQ29tbWl0IGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdGllcyBhcyB3aGVuIHRoZXkgaGF2ZSBiZWVuIHJlZnJlc2hlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIGNvbW1pdC5cbiAgICogQHBhcmFtIGVudGl0eU9ySWRMaXN0IFRoZSBlbnRpdGllcyB0byBjbGVhciB0cmFja2luZyBvciB0aGVpciBpZHMuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgY29tbWl0TWFueShcbiAgICBlbnRpdHlPcklkTGlzdDogKG51bWJlciB8IHN0cmluZyB8IFQpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoZW50aXR5T3JJZExpc3QgPT0gbnVsbCB8fCBlbnRpdHlPcklkTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIGNvbW1pdFxuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSBlbnRpdHlPcklkTGlzdC5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHlPcklkKSA9PiB7XG4gICAgICBjb25zdCBpZCA9XG4gICAgICAgIHR5cGVvZiBlbnRpdHlPcklkID09PSAnb2JqZWN0J1xuICAgICAgICAgID8gdGhpcy5zZWxlY3RJZChlbnRpdHlPcklkKVxuICAgICAgICAgIDogKGVudGl0eU9ySWQgYXMgc3RyaW5nIHwgbnVtYmVyKTtcbiAgICAgIGlmIChjaGdTdGF0ZVtpZF0pIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21taXQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0eSBhcyB3aGVuIGl0IGhhdmUgYmVlbiByZWZyZXNoZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBIYXJtbGVzcyB3aGVuIG5vIGVudGl0eSBjaGFuZ2VzIHRvIGNvbW1pdC5cbiAgICogQHBhcmFtIGVudGl0eU9ySWQgVGhlIGVudGl0eSB0byBjbGVhciB0cmFja2luZyBvciBpdHMgaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgY29tbWl0T25lKFxuICAgIGVudGl0eU9ySWQ6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gZW50aXR5T3JJZCA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy5jb21taXRNYW55KFtlbnRpdHlPcklkXSwgY29sbGVjdGlvbik7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uIGNvbW1pdCBtZXRob2RzXG5cbiAgLy8gI3JlZ2lvbiBtZXJnZSBxdWVyeVxuICAvKipcbiAgICogTWVyZ2UgcXVlcnkgcmVzdWx0cyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHJldHVybmVkIGZyb20gcXVlcnlpbmcgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgcXVlcmllZCBlbnRpdHkgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VRdWVyeVJlc3VsdHMoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLm1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBtZXJnZSBxdWVyeSByZXN1bHRzXG5cbiAgLy8gI3JlZ2lvbiBtZXJnZSBzYXZlIHJlc3VsdHNcbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgbmV3IGVudGl0aWVzIGludG8gdGhlIGNvbGxlY3Rpb24sIGFkanVzdGluZyB0aGUgQ2hhbmdlU3RhdGUgcGVyIHRoZSBtZXJnZVN0cmF0ZWd5LlxuICAgKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyByZXR1cm5lZCBmcm9tIHNhdmluZyBuZXcgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVNhdmVBZGRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMsXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBkZWxldGluZyBlbnRpdGllcyBvbiB0aGUgc2VydmVyIHRoYXQgaGF2ZSB0aGUgZ2l2ZW4gcHJpbWFyeSBrZXlzXG4gICAqIENsZWFycyB0aGUgZW50aXR5IGNoYW5nZVN0YXRlIGZvciB0aG9zZSBrZXlzIHVubGVzcyB0aGUgTWVyZ2VTdHJhdGVneSBpcyBpZ25vcmVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gZW50aXRpZXMga2V5cyBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIHJlbW92ZS9kZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBhZGp1c3QgY2hhbmdlIHRyYWNraW5nIHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVNhdmVEZWxldGVzKFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgLy8gc2FtZSBsb2dpYyBmb3IgYWxsIG5vbi1pZ25vcmUgbWVyZ2Ugc3RyYXRlZ2llczogYWx3YXlzIGNsZWFyIChjb21taXQpIHRoZSBjaGFuZ2VzXG4gICAgY29uc3QgZGVsZXRlSWRzID0ga2V5cyBhcyBzdHJpbmdbXTsgLy8gbWFrZSBUeXBlU2NyaXB0IGhhcHB5XG4gICAgY29sbGVjdGlvbiA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXNcbiAgICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICAgIDogdGhpcy5jb21taXRNYW55KGRlbGV0ZUlkcywgY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KGRlbGV0ZUlkcywgY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2UgcmVzdWx0IG9mIHNhdmluZyB1cGRhdGVkIGVudGl0aWVzIGludG8gdGhlIGNvbGxlY3Rpb24sIGFkanVzdGluZyB0aGUgQ2hhbmdlU3RhdGUgcGVyIHRoZSBtZXJnZVN0cmF0ZWd5LlxuICAgKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEBwYXJhbSB1cGRhdGVSZXNwb25zZURhdGEgRW50aXR5IHJlc3BvbnNlIGRhdGEgcmV0dXJuZWQgZnJvbSBzYXZpbmcgdXBkYXRlZCBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gbWVyZ2UgYSBzYXZlZCBlbnRpdHkgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEBwYXJhbSBbc2tpcFVuY2hhbmdlZF0gVHJ1ZSBtZWFucyBza2lwIHVwZGF0ZSBpZiBzZXJ2ZXIgZGlkbid0IGNoYW5nZSBpdC4gRmFsc2UgYnkgZGVmYXVsdC5cbiAgICogSWYgdGhlIHVwZGF0ZSB3YXMgb3B0aW1pc3RpYyBhbmQgdGhlIHNlcnZlciBkaWRuJ3QgbWFrZSBtb3JlIGNoYW5nZXMgb2YgaXRzIG93blxuICAgKiB0aGVuIHRoZSB1cGRhdGVzIGFyZSBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uIGFuZCBzaG91bGRuJ3QgbWFrZSB0aGVtIGFnYWluLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVNhdmVVcGRhdGVzKFxuICAgIHVwZGF0ZVJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneSxcbiAgICBza2lwVW5jaGFuZ2VkID0gZmFsc2VcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHVwZGF0ZVJlc3BvbnNlRGF0YSA9PSBudWxsIHx8IHVwZGF0ZVJlc3BvbnNlRGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIG1lcmdlLlxuICAgIH1cblxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBsZXQgY2hhbmdlU3RhdGUgPSBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlO1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PSBudWxsID8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICBsZXQgdXBkYXRlczogVXBkYXRlPFQ+W107XG5cbiAgICBzd2l0Y2ggKG1lcmdlU3RyYXRlZ3kpIHtcbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzOlxuICAgICAgICB1cGRhdGVzID0gZmlsdGVyQ2hhbmdlZCh1cGRhdGVSZXNwb25zZURhdGEpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzOlxuICAgICAgICBjaGFuZ2VTdGF0ZSA9IHVwZGF0ZVJlc3BvbnNlRGF0YS5yZWR1Y2UoKGNoZ1N0YXRlLCB1cGRhdGUpID0+IHtcbiAgICAgICAgICBjb25zdCBvbGRJZCA9IHVwZGF0ZS5pZDtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgY2hnU3RhdGVbb2xkSWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuXG4gICAgICAgIHVwZGF0ZXMgPSBmaWx0ZXJDaGFuZ2VkKHVwZGF0ZVJlc3BvbnNlRGF0YSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlczoge1xuICAgICAgICBjb25zdCB1cGRhdGVhYmxlRW50aXRpZXMgPSBbXSBhcyBVcGRhdGVSZXNwb25zZURhdGE8VD5bXTtcbiAgICAgICAgY2hhbmdlU3RhdGUgPSB1cGRhdGVSZXNwb25zZURhdGEucmVkdWNlKChjaGdTdGF0ZSwgdXBkYXRlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkSWQgPSB1cGRhdGUuaWQ7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbb2xkSWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIC8vIFRyYWNraW5nIGEgY2hhbmdlIHNvIHVwZGF0ZSBvcmlnaW5hbCB2YWx1ZSBidXQgbm90IHRoZSBjdXJyZW50IHZhbHVlXG4gICAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld0lkID0gdGhpcy5zZWxlY3RJZCh1cGRhdGUuY2hhbmdlcyBhcyBUKTtcbiAgICAgICAgICAgIGNvbnN0IG9sZENoYW5nZVN0YXRlID0gY2hhbmdlO1xuICAgICAgICAgICAgLy8gSWYgdGhlIHNlcnZlciBjaGFuZ2VkIHRoZSBpZCwgcmVnaXN0ZXIgdGhlIG5ldyBcIm9yaWdpbmFsVmFsdWVcIiB1bmRlciB0aGUgbmV3IGlkXG4gICAgICAgICAgICAvLyBhbmQgcmVtb3ZlIHRoZSBjaGFuZ2UgdHJhY2tlZCB1bmRlciB0aGUgb2xkIGlkLlxuICAgICAgICAgICAgaWYgKG5ld0lkICE9PSBvbGRJZCkge1xuICAgICAgICAgICAgICBkZWxldGUgY2hnU3RhdGVbb2xkSWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3T3JpZ1ZhbHVlID0ge1xuICAgICAgICAgICAgICAuLi4ob2xkQ2hhbmdlU3RhdGUhLm9yaWdpbmFsVmFsdWUgYXMgYW55KSxcbiAgICAgICAgICAgICAgLi4uKHVwZGF0ZS5jaGFuZ2VzIGFzIGFueSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgKGNoZ1N0YXRlIGFzIGFueSlbbmV3SWRdID0ge1xuICAgICAgICAgICAgICAuLi5vbGRDaGFuZ2VTdGF0ZSxcbiAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZTogbmV3T3JpZ1ZhbHVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlYWJsZUVudGl0aWVzLnB1c2godXBkYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdXBkYXRlcyA9IGZpbHRlckNoYW5nZWQodXBkYXRlYWJsZUVudGl0aWVzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbmRpdGlvbmFsbHkga2VlcCBvbmx5IHRob3NlIHVwZGF0ZXMgdGhhdCBoYXZlIGFkZGl0aW9uYWwgc2VydmVyIGNoYW5nZXMuXG4gICAgICogKGUuZy4sIGZvciBvcHRpbWlzdGljIHNhdmVzIGJlY2F1c2UgdGhleSB1cGRhdGVzIGFyZSBhbHJlYWR5IGluIHRoZSBjdXJyZW50IGNvbGxlY3Rpb24pXG4gICAgICogU3RyaXAgb2ZmIHRoZSBgY2hhbmdlZGAgcHJvcGVydHkuXG4gICAgICogQHJlc3BvbnNlRGF0YSBFbnRpdHkgcmVzcG9uc2UgZGF0YSBmcm9tIHNlcnZlci5cbiAgICAgKiBNYXkgYmUgYW4gVXBkYXRlUmVzcG9uc2VEYXRhPFQ+LCBhIHN1YmNsYXNzIG9mIFVwZGF0ZTxUPiB3aXRoIGEgJ2NoYW5nZWQnIGZsYWcuXG4gICAgICogQHJldHVybnMgVXBkYXRlPFQ+ICh3aXRob3V0IHRoZSBjaGFuZ2VkIGZsYWcpXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyQ2hhbmdlZChyZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdKTogVXBkYXRlPFQ+W10ge1xuICAgICAgaWYgKHNraXBVbmNoYW5nZWQgPT09IHRydWUpIHtcbiAgICAgICAgLy8ga2VlcCBvbmx5IHRob3NlIHVwZGF0ZXMgdGhhdCB0aGUgc2VydmVyIGNoYW5nZWQgKGtub3dhYmxlIGlmIGlzIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPilcbiAgICAgICAgcmVzcG9uc2VEYXRhID0gcmVzcG9uc2VEYXRhLmZpbHRlcigocikgPT4gci5jaGFuZ2VkID09PSB0cnVlKTtcbiAgICAgIH1cbiAgICAgIC8vIFN0cmlwIHVuY2hhbmdlZCBwcm9wZXJ0eSBmcm9tIHJlc3BvbnNlRGF0YSwgbGVhdmluZyBqdXN0IHRoZSBwdXJlIFVwZGF0ZTxUPlxuICAgICAgLy8gVE9ETzogUmVtb3ZlPyBwcm9iYWJseSBub3QgbmVjZXNzYXJ5IGFzIHRoZSBVcGRhdGUgaXNuJ3Qgc3RvcmVkIGFuZCBhZGFwdGVyIHdpbGwgaWdub3JlIGBjaGFuZ2VkYC5cbiAgICAgIHJldHVybiByZXNwb25zZURhdGEubWFwKChyKSA9PiAoeyBpZDogci5pZCBhcyBhbnksIGNoYW5nZXM6IHIuY2hhbmdlcyB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgdXBzZXJ0ZWQgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHJldHVybmVkIGZyb20gc2F2aW5nIHVwc2VydHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVNhdmVVcHNlcnRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMsXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIG1lcmdlIHNhdmUgcmVzdWx0c1xuXG4gIC8vICNyZWdpb24gcXVlcnkgJiBzYXZlIGhlbHBlcnNcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyB0byBtZXJnZVxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBDb2xsZWN0aW9uIGludG8gd2hpY2ggZW50aXRpZXMgYXJlIG1lcmdlZFxuICAgKiBAcGFyYW0gZGVmYXVsdE1lcmdlU3RyYXRlZ3kgSG93IHRvIG1lcmdlIHdoZW4gYWN0aW9uJ3MgTWVyZ2VTdHJhdGVneSBpcyB1bnNwZWNpZmllZFxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRoZSBhY3Rpb24ncyBNZXJnZVN0cmF0ZWd5XG4gICAqL1xuICBwcml2YXRlIG1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgZGVmYXVsdE1lcmdlU3RyYXRlZ3k6IE1lcmdlU3RyYXRlZ3ksXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0aWVzID09IG51bGwgfHwgZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBtZXJnZS5cbiAgICB9XG5cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZTtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IGRlZmF1bHRNZXJnZVN0cmF0ZWd5IDogbWVyZ2VTdHJhdGVneTtcblxuICAgIHN3aXRjaCAobWVyZ2VTdHJhdGVneSkge1xuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXM6XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzOlxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICAgIGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlczoge1xuICAgICAgICBjb25zdCB1cHNlcnRFbnRpdGllcyA9IFtdIGFzIFRbXTtcbiAgICAgICAgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgLi4uY2hnU3RhdGUsXG4gICAgICAgICAgICAgICAgW2lkXToge1xuICAgICAgICAgICAgICAgICAgLi4uY2hnU3RhdGVbaWRdISxcbiAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IGVudGl0eSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cHNlcnRFbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KHVwc2VydEVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vICNlbmRyZWdpb24gcXVlcnkgJiBzYXZlIGhlbHBlcnNcblxuICAvLyAjcmVnaW9uIHRyYWNrIG1ldGhvZHNcbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSBhZGRpbmcgdGhlbSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgYWRkIHRvIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXRpZXMgdG8gYWRkLiBUaGV5IG11c3QgYWxsIGhhdmUgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja0FkZE1hbnkoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgZW50aXRpZXMgPT0gbnVsbCB8fFxuICAgICAgZW50aXRpZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKGlkID09IG51bGwgfHwgaWQgPT09ICcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtjb2xsZWN0aW9uLmVudGl0eU5hbWV9IGVudGl0eSBhZGQgcmVxdWlyZXMgYSBrZXkgdG8gYmUgdHJhY2tlZGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG5cbiAgICAgIGlmICghdHJhY2tlZENoYW5nZSkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgIH1cbiAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkFkZGVkIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYW4gZW50aXR5IGJlZm9yZSBhZGRpbmcgaXQgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIGFkZCB0byB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXR5IFRoZSBlbnRpdHkgdG8gYWRkLiBJdCBtdXN0IGhhdmUgYW4gaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgaW1wbGVtZW50YXRpb24gc3VwcGxpZXMgYSBkZWZhdWx0IHN0cmF0ZWd5LlxuICAgKi9cbiAgdHJhY2tBZGRPbmUoXG4gICAgZW50aXR5OiBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja0FkZE1hbnkoW2VudGl0eV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSByZW1vdmluZyB0aGVtIHdpdGggdGhlIGludGVudGlvbiBvZiBkZWxldGluZyB0aGVtIG9uIHRoZSBzZXJ2ZXIuXG4gICAqIERvZXMgTk9UIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBrZXlzIFRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0aWVzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tEZWxldGVNYW55KFxuICAgIGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIGtleXMgPT0gbnVsbCB8fFxuICAgICAga2V5cy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHRyYWNrXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBlbnRpdHlNYXAgPSBjb2xsZWN0aW9uLmVudGl0aWVzO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0ga2V5cy5yZWR1Y2UoKGNoZ1N0YXRlLCBpZCkgPT4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICBpZiAob3JpZ2luYWxWYWx1ZSkge1xuICAgICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICBpZiAodHJhY2tlZENoYW5nZSkge1xuICAgICAgICAgIGlmICh0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuQWRkZWQpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZTogc3RvcCB0cmFja2luZyBhbiBhZGRlZCBlbnRpdHkgdGhhdCB5b3UgZGVsZXRlXG4gICAgICAgICAgICAvLyBUaGUgY2FsbGVyIG11c3QgYWxzbyBkZXRlY3QgdGhpcywgcmVtb3ZlIGl0IGltbWVkaWF0ZWx5IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIC8vIGFuZCBza2lwIGF0dGVtcHQgdG8gZGVsZXRlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICBjbG9uZUNoZ1N0YXRlT25jZSgpO1xuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRyYWNrZWRDaGFuZ2UuY2hhbmdlVHlwZSA9PT0gQ2hhbmdlVHlwZS5VcGRhdGVkKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2U6IHN3aXRjaCBjaGFuZ2UgdHlwZSBmcm9tIFVwZGF0ZWQgdG8gRGVsZXRlZC5cbiAgICAgICAgICAgIGNsb25lQ2hnU3RhdGVPbmNlKCk7XG4gICAgICAgICAgICB0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPSBDaGFuZ2VUeXBlLkRlbGV0ZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFN0YXJ0IHRyYWNraW5nIHRoaXMgZW50aXR5XG4gICAgICAgICAgY2xvbmVDaGdTdGF0ZU9uY2UoKTtcbiAgICAgICAgICBjaGdTdGF0ZVtpZF0gPSB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuRGVsZXRlZCwgb3JpZ2luYWxWYWx1ZSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG5cbiAgICAgIGZ1bmN0aW9uIGNsb25lQ2hnU3RhdGVPbmNlKCkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgaXQgaXMgcmVtb3ZlZCB3aXRoIHRoZSBpbnRlbnRpb24gb2YgZGVsZXRpbmcgaXQgb24gdGhlIHNlcnZlci5cbiAgICogRG9lcyBOT1QgcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGtleSBUaGUgcHJpbWFyeSBrZXkgb2YgdGhlIGVudGl0eSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrRGVsZXRlT25lKFxuICAgIGtleTogbnVtYmVyIHwgc3RyaW5nLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGtleSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja0RlbGV0ZU1hbnkoW2tleV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSB1cGRhdGluZyB0aGVtIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIHVwZGF0ZXMgVGhlIGVudGl0aWVzIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcGRhdGVNYW55KFxuICAgIHVwZGF0ZXM6IFVwZGF0ZTxUPltdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICB1cGRhdGVzID09IG51bGwgfHxcbiAgICAgIHVwZGF0ZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IHVwZGF0ZXMucmVkdWNlKChjaGdTdGF0ZSwgdXBkYXRlKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzOiBlbnRpdHkgfSA9IHVwZGF0ZTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgdXBkYXRlIHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gZW50aXR5TWFwW2lkXTtcbiAgICAgIC8vIE9ubHkgdHJhY2sgaWYgaXQgaXMgaW4gdGhlIGNvbGxlY3Rpb24uIFNpbGVudGx5IGlnbm9yZSBpZiBpdCBpcyBub3QuXG4gICAgICAvLyBAbmdyeC9lbnRpdHkgYWRhcHRlciB3b3VsZCBhbHNvIHNpbGVudGx5IGlnbm9yZS5cbiAgICAgIC8vIFRvZG86IHNob3VsZCBtaXNzaW5nIHVwZGF0ZSBlbnRpdHkgcmVhbGx5IGJlIHJlcG9ydGVkIGFzIGFuIGVycm9yP1xuICAgICAgaWYgKG9yaWdpbmFsVmFsdWUpIHtcbiAgICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgaWYgKCF0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLlVwZGF0ZWQsIG9yaWdpbmFsVmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgdXBkYXRpbmcgaXQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIHVwZGF0ZSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gdXBkYXRlIFRoZSBlbnRpdHkgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1VwZGF0ZU9uZShcbiAgICB1cGRhdGU6IFVwZGF0ZTxUPixcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB1cGRhdGUgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tVcGRhdGVNYW55KFt1cGRhdGVdLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgdXBzZXJ0aW5nIChhZGRpbmcgYW5kIHVwZGF0aW5nKSB0aGVtIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0aWVzIFRoZSBlbnRpdGllcyB0byBhZGQgb3IgdXBkYXRlLiBUaGV5IG11c3QgYmUgY29tcGxldGUgZW50aXRpZXMgd2l0aCBpZHMuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBzZXJ0TWFueShcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICBlbnRpdGllcyA9PSBudWxsIHx8XG4gICAgICBlbnRpdGllcy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHRyYWNrXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBlbnRpdHlNYXAgPSBjb2xsZWN0aW9uLmVudGl0aWVzO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgdXBzZXJ0IHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuXG4gICAgICBpZiAoIXRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICAgIGNoZ1N0YXRlW2lkXSA9XG4gICAgICAgICAgb3JpZ2luYWxWYWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5BZGRlZCB9XG4gICAgICAgICAgICA6IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5VcGRhdGVkLCBvcmlnaW5hbFZhbHVlIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYW4gZW50aXR5IGJlZm9yZSB1cHNlcnQgKGFkZGluZyBhbmQgdXBkYXRpbmcpIGl0IHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0aWVzIFRoZSBlbnRpdHkgdG8gYWRkIG9yIHVwZGF0ZS4gSXQgbXVzdCBiZSBhIGNvbXBsZXRlIGVudGl0eSB3aXRoIGl0cyBpZC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcHNlcnRPbmUoXG4gICAgZW50aXR5OiBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja1Vwc2VydE1hbnkoW2VudGl0eV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG4gIC8vICNlbmRyZWdpb24gdHJhY2sgbWV0aG9kc1xuXG4gIC8vICNyZWdpb24gdW5kbyBtZXRob2RzXG4gIC8qKlxuICAgKiBSZXZlcnQgdGhlIHVuc2F2ZWQgY2hhbmdlcyBmb3IgYWxsIGNvbGxlY3Rpb24uXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIHVuZG8uXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgdW5kb0FsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgaWRzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICBjb25zdCB7IHJlbW92ZSwgdXBzZXJ0IH0gPSBpZHMucmVkdWNlKFxuICAgICAgKGFjYywgaWQpID0+IHtcbiAgICAgICAgY29uc3QgY2hhbmdlU3RhdGUgPSBhY2MuY2hnU3RhdGVbaWRdITtcbiAgICAgICAgc3dpdGNoIChjaGFuZ2VTdGF0ZS5jaGFuZ2VUeXBlKSB7XG4gICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkFkZGVkOlxuICAgICAgICAgICAgYWNjLnJlbW92ZS5wdXNoKGlkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5EZWxldGVkOlxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGNoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKHJlbW92ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLlVwZGF0ZWQ6XG4gICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2goY2hhbmdlU3RhdGUhLm9yaWdpbmFsVmFsdWUhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAgLy8gZW50aXRpZXNUb1VuZG9cbiAgICAgIHtcbiAgICAgICAgcmVtb3ZlOiBbXSBhcyAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgICAgICB1cHNlcnQ6IFtdIGFzIFRbXSxcbiAgICAgICAgY2hnU3RhdGU6IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShyZW1vdmUgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnQsIGNvbGxlY3Rpb24pO1xuXG4gICAgcmV0dXJuIHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGU6IHt9IH07XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJ0IHRoZSB1bnNhdmVkIGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdGllcy5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gdW5kby5cbiAgICogQHBhcmFtIGVudGl0eU9ySWRMaXN0IFRoZSBlbnRpdGllcyB0byByZXZlcnQgb3IgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9NYW55KFxuICAgIGVudGl0eU9ySWRMaXN0OiAobnVtYmVyIHwgc3RyaW5nIHwgVClbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChlbnRpdHlPcklkTGlzdCA9PSBudWxsIHx8IGVudGl0eU9ySWRMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdW5kb1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG5cbiAgICBjb25zdCB7IGNoYW5nZVN0YXRlLCByZW1vdmUsIHVwc2VydCB9ID0gZW50aXR5T3JJZExpc3QucmVkdWNlKFxuICAgICAgKGFjYywgZW50aXR5T3JJZCkgPT4ge1xuICAgICAgICBsZXQgY2hnU3RhdGUgPSBhY2MuY2hhbmdlU3RhdGU7XG4gICAgICAgIGNvbnN0IGlkID1cbiAgICAgICAgICB0eXBlb2YgZW50aXR5T3JJZCA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgID8gdGhpcy5zZWxlY3RJZChlbnRpdHlPcklkKVxuICAgICAgICAgICAgOiAoZW50aXR5T3JJZCBhcyBzdHJpbmcgfCBudW1iZXIpO1xuICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtpZF0hO1xuICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTsgLy8gY2xlYXIgdHJhY2tpbmcgb2YgdGhpcyBlbnRpdHlcbiAgICAgICAgICBhY2MuY2hhbmdlU3RhdGUgPSBjaGdTdGF0ZTtcbiAgICAgICAgICBzd2l0Y2ggKGNoYW5nZS5jaGFuZ2VUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuQWRkZWQ6XG4gICAgICAgICAgICAgIGFjYy5yZW1vdmUucHVzaChpZCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkRlbGV0ZWQ6XG4gICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBjaGFuZ2UhLm9yaWdpbmFsVmFsdWU7XG4gICAgICAgICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKHJlbW92ZWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLlVwZGF0ZWQ6XG4gICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChjaGFuZ2UhLm9yaWdpbmFsVmFsdWUhKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAgLy8gZW50aXRpZXNUb1VuZG9cbiAgICAgIHtcbiAgICAgICAgcmVtb3ZlOiBbXSBhcyAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgICAgICB1cHNlcnQ6IFtdIGFzIFRbXSxcbiAgICAgICAgY2hhbmdlU3RhdGU6IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShyZW1vdmUgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnQsIGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydCB0aGUgdW5zYXZlZCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXR5LlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byB1bmRvLlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZCBUaGUgZW50aXR5IHRvIHJldmVydCBvciBpdHMgaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgdW5kb09uZShcbiAgICBlbnRpdHlPcklkOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eU9ySWQgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudW5kb01hbnkoW2VudGl0eU9ySWRdLCBjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHVuZG8gbWV0aG9kc1xufVxuIl19