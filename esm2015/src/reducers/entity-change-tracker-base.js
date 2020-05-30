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
                r => r.changed === true));
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map((/**
             * @param {?} r
             * @return {?}
             */
            r => ({ id: (/** @type {?} */ (r.id)), changes: r.changes })));
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
//# sourceMappingURL=entity-change-tracker-base.js.map