/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/reducers/entity-change-tracker-base.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsT0FBTyxFQUFFLFVBQVUsRUFBb0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7OztBQVMxRCxNQUFNLE9BQU8sdUJBQXVCOzs7OztJQUNsQyxZQUNVLE9BQXlCLEVBQ3pCLFFBQXVCO1FBRHZCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFFL0Isb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLGVBQWUsQ0FBQztJQUM5QyxDQUFDOzs7Ozs7OztJQVFELFNBQVMsQ0FBQyxVQUErQjtRQUN2QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxVQUFVO1lBQ1osQ0FBQyxpQ0FBTSxVQUFVLEtBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRSxDQUFDO0lBQ3pDLENBQUM7Ozs7Ozs7O0lBUUQsVUFBVSxDQUNSLGNBQXVDLEVBQ3ZDLFVBQStCO1FBRS9CLElBQUksY0FBYyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQjtTQUN4Qzs7WUFDRyxTQUFTLEdBQUcsS0FBSzs7Y0FDZixXQUFXLEdBQUcsY0FBYyxDQUFDLE1BQU07Ozs7O1FBQUMsQ0FBQyxRQUFRLEVBQUUs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QVUsQ0FBQyxtQkFBQSxNQUFNLEVBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNyRSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sU0FBUyxDQUFDLENBQUMsaUNBQU0sVUFBVSxLQUFFLFdBQVcsSUFBRyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2pFLENBQUM7Ozs7Ozs7O0lBUUQsT0FBTyxDQUNMLFVBQStCLEVBQy9CLFVBQStCO1FBRS9CLE9BQU8sVUFBVSxJQUFJLElBQUk7WUFDdkIsQ0FBQyxDQUFDLFVBQVU7WUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FFRjs7Ozs7O0lBcHRCRywwQ0FBaUM7Ozs7O0lBQ2pDLDJDQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUFkYXB0ZXIsIElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IENoYW5nZVR5cGUsIEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlDaGFuZ2VUcmFja2VyIH0gZnJvbSAnLi9lbnRpdHktY2hhbmdlLXRyYWNrZXInO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgRW50aXR5Q2hhbmdlVHJhY2tlciB3aXRoXG4gKiBtZXRob2RzIGZvciB0cmFja2luZywgY29tbWl0dGluZywgYW5kIHJldmVydGluZy91bmRvaW5nIHVuc2F2ZWQgZW50aXR5IGNoYW5nZXMuXG4gKiBVc2VkIGJ5IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kcyB3aGljaCBzaG91bGQgY2FsbCB0cmFja2VyIG1ldGhvZHMgQkVGT1JFIG1vZGlmeWluZyB0aGUgY29sbGVjdGlvbi5cbiAqIFNlZSBFbnRpdHlDaGFuZ2VUcmFja2VyIGRvY3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlDaGFuZ2VUcmFja2VyQmFzZTxUPiBpbXBsZW1lbnRzIEVudGl0eUNoYW5nZVRyYWNrZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFkYXB0ZXI6IEVudGl0eUFkYXB0ZXI8VD4sXG4gICAgcHJpdmF0ZSBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPlxuICApIHtcbiAgICAvKiogRXh0cmFjdCB0aGUgcHJpbWFyeSBrZXkgKGlkKTsgZGVmYXVsdCB0byBgaWRgICovXG4gICAgdGhpcy5zZWxlY3RJZCA9IHNlbGVjdElkIHx8IGRlZmF1bHRTZWxlY3RJZDtcbiAgfVxuXG4gIC8vICNyZWdpb24gY29tbWl0IG1ldGhvZHNcbiAgLyoqXG4gICAqIENvbW1pdCBhbGwgY2hhbmdlcyBhcyB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGNvbXBsZXRlbHkgcmVsb2FkZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgY29tbWl0QWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSkubGVuZ3RoID09PSAwXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZToge30gfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21taXQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0aWVzIGFzIHdoZW4gdGhleSBoYXZlIGJlZW4gcmVmcmVzaGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gY29tbWl0LlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZExpc3QgVGhlIGVudGl0aWVzIHRvIGNsZWFyIHRyYWNraW5nIG9yIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRNYW55KFxuICAgIGVudGl0eU9ySWRMaXN0OiAobnVtYmVyIHwgc3RyaW5nIHwgVClbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChlbnRpdHlPcklkTGlzdCA9PSBudWxsIHx8IGVudGl0eU9ySWRMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gY29tbWl0XG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGVudGl0eU9ySWRMaXN0LnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eU9ySWQpID0+IHtcbiAgICAgIGNvbnN0IGlkID1cbiAgICAgICAgdHlwZW9mIGVudGl0eU9ySWQgPT09ICdvYmplY3QnXG4gICAgICAgICAgPyB0aGlzLnNlbGVjdElkKGVudGl0eU9ySWQpXG4gICAgICAgICAgOiAoZW50aXR5T3JJZCBhcyBzdHJpbmcgfCBudW1iZXIpO1xuICAgICAgaWYgKGNoZ1N0YXRlW2lkXSkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1pdCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXR5IGFzIHdoZW4gaXQgaGF2ZSBiZWVuIHJlZnJlc2hlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEhhcm1sZXNzIHdoZW4gbm8gZW50aXR5IGNoYW5nZXMgdG8gY29tbWl0LlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZCBUaGUgZW50aXR5IHRvIGNsZWFyIHRyYWNraW5nIG9yIGl0cyBpZC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRPbmUoXG4gICAgZW50aXR5T3JJZDogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHlPcklkID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLmNvbW1pdE1hbnkoW2VudGl0eU9ySWRdLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb24gY29tbWl0IG1ldGhvZHNcblxuICAvLyAjcmVnaW9uIG1lcmdlIHF1ZXJ5XG4gIC8qKlxuICAgKiBNZXJnZSBxdWVyeSByZXN1bHRzIGludG8gdGhlIGNvbGxlY3Rpb24sIGFkanVzdGluZyB0aGUgQ2hhbmdlU3RhdGUgcGVyIHRoZSBtZXJnZVN0cmF0ZWd5LlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgcmV0dXJuZWQgZnJvbSBxdWVyeWluZyB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gbWVyZ2UgYSBxdWVyaWVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMsXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIG1lcmdlIHF1ZXJ5IHJlc3VsdHNcblxuICAvLyAjcmVnaW9uIG1lcmdlIHNhdmUgcmVzdWx0c1xuICAvKipcbiAgICogTWVyZ2UgcmVzdWx0IG9mIHNhdmluZyBuZXcgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHJldHVybmVkIGZyb20gc2F2aW5nIG5ldyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gbWVyZ2UgYSBzYXZlZCBlbnRpdHkgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZUFkZHMoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLm1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyxcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIGRlbGV0aW5nIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIgdGhhdCBoYXZlIHRoZSBnaXZlbiBwcmltYXJ5IGtleXNcbiAgICogQ2xlYXJzIHRoZSBlbnRpdHkgY2hhbmdlU3RhdGUgZm9yIHRob3NlIGtleXMgdW5sZXNzIHRoZSBNZXJnZVN0cmF0ZWd5IGlzIGlnbm9yZUNoYW5nZXMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBrZXlzIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlL2RlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIGFkanVzdCBjaGFuZ2UgdHJhY2tpbmcgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZURlbGV0ZXMoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PSBudWxsID8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICAvLyBzYW1lIGxvZ2ljIGZvciBhbGwgbm9uLWlnbm9yZSBtZXJnZSBzdHJhdGVnaWVzOiBhbHdheXMgY2xlYXIgKGNvbW1pdCkgdGhlIGNoYW5nZXNcbiAgICBjb25zdCBkZWxldGVJZHMgPSBrZXlzIGFzIHN0cmluZ1tdOyAvLyBtYWtlIFR5cGVTY3JpcHQgaGFwcHlcbiAgICBjb2xsZWN0aW9uID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlc1xuICAgICAgICA/IGNvbGxlY3Rpb25cbiAgICAgICAgOiB0aGlzLmNvbW1pdE1hbnkoZGVsZXRlSWRzLCBjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoZGVsZXRlSWRzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIHVwZGF0ZWQgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIHVwZGF0ZVJlc3BvbnNlRGF0YSBFbnRpdHkgcmVzcG9uc2UgZGF0YSByZXR1cm5lZCBmcm9tIHNhdmluZyB1cGRhdGVkIGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIFtza2lwVW5jaGFuZ2VkXSBUcnVlIG1lYW5zIHNraXAgdXBkYXRlIGlmIHNlcnZlciBkaWRuJ3QgY2hhbmdlIGl0LiBGYWxzZSBieSBkZWZhdWx0LlxuICAgKiBJZiB0aGUgdXBkYXRlIHdhcyBvcHRpbWlzdGljIGFuZCB0aGUgc2VydmVyIGRpZG4ndCBtYWtlIG1vcmUgY2hhbmdlcyBvZiBpdHMgb3duXG4gICAqIHRoZW4gdGhlIHVwZGF0ZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24gYW5kIHNob3VsZG4ndCBtYWtlIHRoZW0gYWdhaW4uXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgdXBkYXRlUmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5LFxuICAgIHNraXBVbmNoYW5nZWQgPSBmYWxzZVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodXBkYXRlUmVzcG9uc2VEYXRhID09IG51bGwgfHwgdXBkYXRlUmVzcG9uc2VEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gbWVyZ2UuXG4gICAgfVxuXG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGxldCBjaGFuZ2VTdGF0ZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGU7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGxldCB1cGRhdGVzOiBVcGRhdGU8VD5bXTtcblxuICAgIHN3aXRjaCAobWVyZ2VTdHJhdGVneSkge1xuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXM6XG4gICAgICAgIHVwZGF0ZXMgPSBmaWx0ZXJDaGFuZ2VkKHVwZGF0ZVJlc3BvbnNlRGF0YSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXM6XG4gICAgICAgIGNoYW5nZVN0YXRlID0gdXBkYXRlUmVzcG9uc2VEYXRhLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9sZElkID0gdXBkYXRlLmlkO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdXBkYXRlcyA9IGZpbHRlckNoYW5nZWQodXBkYXRlUmVzcG9uc2VEYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzOiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWFibGVFbnRpdGllcyA9IFtdIGFzIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdO1xuICAgICAgICBjaGFuZ2VTdGF0ZSA9IHVwZGF0ZVJlc3BvbnNlRGF0YS5yZWR1Y2UoKGNoZ1N0YXRlLCB1cGRhdGUpID0+IHtcbiAgICAgICAgICBjb25zdCBvbGRJZCA9IHVwZGF0ZS5pZDtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgLy8gVHJhY2tpbmcgYSBjaGFuZ2Ugc28gdXBkYXRlIG9yaWdpbmFsIHZhbHVlIGJ1dCBub3QgdGhlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3SWQgPSB0aGlzLnNlbGVjdElkKHVwZGF0ZS5jaGFuZ2VzIGFzIFQpO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ2hhbmdlU3RhdGUgPSBjaGFuZ2U7XG4gICAgICAgICAgICAvLyBJZiB0aGUgc2VydmVyIGNoYW5nZWQgdGhlIGlkLCByZWdpc3RlciB0aGUgbmV3IFwib3JpZ2luYWxWYWx1ZVwiIHVuZGVyIHRoZSBuZXcgaWRcbiAgICAgICAgICAgIC8vIGFuZCByZW1vdmUgdGhlIGNoYW5nZSB0cmFja2VkIHVuZGVyIHRoZSBvbGQgaWQuXG4gICAgICAgICAgICBpZiAobmV3SWQgIT09IG9sZElkKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdPcmlnVmFsdWUgPSB7XG4gICAgICAgICAgICAgIC4uLihvbGRDaGFuZ2VTdGF0ZSEub3JpZ2luYWxWYWx1ZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAuLi4odXBkYXRlLmNoYW5nZXMgYXMgYW55KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAoY2hnU3RhdGUgYXMgYW55KVtuZXdJZF0gPSB7XG4gICAgICAgICAgICAgIC4uLm9sZENoYW5nZVN0YXRlLFxuICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBuZXdPcmlnVmFsdWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGVhYmxlRW50aXRpZXMucHVzaCh1cGRhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgICAgICBjb2xsZWN0aW9uID0gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgICB1cGRhdGVzID0gZmlsdGVyQ2hhbmdlZCh1cGRhdGVhYmxlRW50aXRpZXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZGl0aW9uYWxseSBrZWVwIG9ubHkgdGhvc2UgdXBkYXRlcyB0aGF0IGhhdmUgYWRkaXRpb25hbCBzZXJ2ZXIgY2hhbmdlcy5cbiAgICAgKiAoZS5nLiwgZm9yIG9wdGltaXN0aWMgc2F2ZXMgYmVjYXVzZSB0aGV5IHVwZGF0ZXMgYXJlIGFscmVhZHkgaW4gdGhlIGN1cnJlbnQgY29sbGVjdGlvbilcbiAgICAgKiBTdHJpcCBvZmYgdGhlIGBjaGFuZ2VkYCBwcm9wZXJ0eS5cbiAgICAgKiBAcmVzcG9uc2VEYXRhIEVudGl0eSByZXNwb25zZSBkYXRhIGZyb20gc2VydmVyLlxuICAgICAqIE1heSBiZSBhbiBVcGRhdGVSZXNwb25zZURhdGE8VD4sIGEgc3ViY2xhc3Mgb2YgVXBkYXRlPFQ+IHdpdGggYSAnY2hhbmdlZCcgZmxhZy5cbiAgICAgKiBAcmV0dXJucyBVcGRhdGU8VD4gKHdpdGhvdXQgdGhlIGNoYW5nZWQgZmxhZylcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJDaGFuZ2VkKHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10pOiBVcGRhdGU8VD5bXSB7XG4gICAgICBpZiAoc2tpcFVuY2hhbmdlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBrZWVwIG9ubHkgdGhvc2UgdXBkYXRlcyB0aGF0IHRoZSBzZXJ2ZXIgY2hhbmdlZCAoa25vd2FibGUgaWYgaXMgVXBkYXRlUmVzcG9uc2VEYXRhPFQ+KVxuICAgICAgICByZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEuZmlsdGVyKHIgPT4gci5jaGFuZ2VkID09PSB0cnVlKTtcbiAgICAgIH1cbiAgICAgIC8vIFN0cmlwIHVuY2hhbmdlZCBwcm9wZXJ0eSBmcm9tIHJlc3BvbnNlRGF0YSwgbGVhdmluZyBqdXN0IHRoZSBwdXJlIFVwZGF0ZTxUPlxuICAgICAgLy8gVE9ETzogUmVtb3ZlPyBwcm9iYWJseSBub3QgbmVjZXNzYXJ5IGFzIHRoZSBVcGRhdGUgaXNuJ3Qgc3RvcmVkIGFuZCBhZGFwdGVyIHdpbGwgaWdub3JlIGBjaGFuZ2VkYC5cbiAgICAgIHJldHVybiByZXNwb25zZURhdGEubWFwKHIgPT4gKHsgaWQ6IHIuaWQgYXMgYW55LCBjaGFuZ2VzOiByLmNoYW5nZXMgfSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIHVwc2VydGVkIGVudGl0aWVzIGludG8gdGhlIGNvbGxlY3Rpb24sIGFkanVzdGluZyB0aGUgQ2hhbmdlU3RhdGUgcGVyIHRoZSBtZXJnZVN0cmF0ZWd5LlxuICAgKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyByZXR1cm5lZCBmcm9tIHNhdmluZyB1cHNlcnRzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBtZXJnZSBzYXZlIHJlc3VsdHNcblxuICAvLyAjcmVnaW9uIHF1ZXJ5ICYgc2F2ZSBoZWxwZXJzXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgdG8gbWVyZ2VcbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gQ29sbGVjdGlvbiBpbnRvIHdoaWNoIGVudGl0aWVzIGFyZSBtZXJnZWRcbiAgICogQHBhcmFtIGRlZmF1bHRNZXJnZVN0cmF0ZWd5IEhvdyB0byBtZXJnZSB3aGVuIGFjdGlvbidzIE1lcmdlU3RyYXRlZ3kgaXMgdW5zcGVjaWZpZWRcbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUaGUgYWN0aW9uJ3MgTWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcHJpdmF0ZSBtZXJnZVNlcnZlclVwc2VydHMoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGRlZmF1bHRNZXJnZVN0cmF0ZWd5OiBNZXJnZVN0cmF0ZWd5LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChlbnRpdGllcyA9PSBudWxsIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gbWVyZ2UuXG4gICAgfVxuXG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGxldCBjaGFuZ2VTdGF0ZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGU7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBkZWZhdWx0TWVyZ2VTdHJhdGVneSA6IG1lcmdlU3RyYXRlZ3k7XG5cbiAgICBzd2l0Y2ggKG1lcmdlU3RyYXRlZ3kpIHtcbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzOlxuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlczpcbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcblxuICAgICAgICBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXM6IHtcbiAgICAgICAgY29uc3QgdXBzZXJ0RW50aXRpZXMgPSBbXSBhcyBUW107XG4gICAgICAgIGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0ge1xuICAgICAgICAgICAgICAgIC4uLmNoZ1N0YXRlLFxuICAgICAgICAgICAgICAgIFtpZF06IHtcbiAgICAgICAgICAgICAgICAgIC4uLmNoZ1N0YXRlW2lkXSEsXG4gICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBlbnRpdHksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBzZXJ0RW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnRFbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHF1ZXJ5ICYgc2F2ZSBoZWxwZXJzXG5cbiAgLy8gI3JlZ2lvbiB0cmFjayBtZXRob2RzXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgYWRkaW5nIHRoZW0gdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIGFkZCB0byB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgVGhlIGVudGl0aWVzIHRvIGFkZC4gVGhleSBtdXN0IGFsbCBoYXZlIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tBZGRNYW55KFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIGVudGl0aWVzID09IG51bGwgfHxcbiAgICAgIGVudGl0aWVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgYWRkIHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuXG4gICAgICBpZiAoIXRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG4gICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5BZGRlZCB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgYWRkaW5nIGl0IHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCBhZGQgdG8gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIGFkZC4gSXQgbXVzdCBoYXZlIGFuIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIGltcGxlbWVudGF0aW9uIHN1cHBsaWVzIGEgZGVmYXVsdCBzdHJhdGVneS5cbiAgICovXG4gIHRyYWNrQWRkT25lKFxuICAgIGVudGl0eTogVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tBZGRNYW55KFtlbnRpdHldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgcmVtb3ZpbmcgdGhlbSB3aXRoIHRoZSBpbnRlbnRpb24gb2YgZGVsZXRpbmcgdGhlbSBvbiB0aGUgc2VydmVyLlxuICAgKiBEb2VzIE5PVCByZW1vdmUgZnJvbSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrRGVsZXRlTWFueShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICBrZXlzID09IG51bGwgfHxcbiAgICAgIGtleXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGtleXMucmVkdWNlKChjaGdTdGF0ZSwgaWQpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgaWYgKG9yaWdpbmFsVmFsdWUpIHtcbiAgICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgaWYgKHRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgICBpZiAodHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2U6IHN0b3AgdHJhY2tpbmcgYW4gYWRkZWQgZW50aXR5IHRoYXQgeW91IGRlbGV0ZVxuICAgICAgICAgICAgLy8gVGhlIGNhbGxlciBtdXN0IGFsc28gZGV0ZWN0IHRoaXMsIHJlbW92ZSBpdCBpbW1lZGlhdGVseSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAgICAgICAvLyBhbmQgc2tpcCBhdHRlbXB0IHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyLlxuICAgICAgICAgICAgY2xvbmVDaGdTdGF0ZU9uY2UoKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgfSBlbHNlIGlmICh0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuVXBkYXRlZCkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlOiBzd2l0Y2ggY2hhbmdlIHR5cGUgZnJvbSBVcGRhdGVkIHRvIERlbGV0ZWQuXG4gICAgICAgICAgICBjbG9uZUNoZ1N0YXRlT25jZSgpO1xuICAgICAgICAgICAgdHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID0gQ2hhbmdlVHlwZS5EZWxldGVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTdGFydCB0cmFja2luZyB0aGlzIGVudGl0eVxuICAgICAgICAgIGNsb25lQ2hnU3RhdGVPbmNlKCk7XG4gICAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkRlbGV0ZWQsIG9yaWdpbmFsVmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuXG4gICAgICBmdW5jdGlvbiBjbG9uZUNoZ1N0YXRlT25jZSgpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIGl0IGlzIHJlbW92ZWQgd2l0aCB0aGUgaW50ZW50aW9uIG9mIGRlbGV0aW5nIGl0IG9uIHRoZSBzZXJ2ZXIuXG4gICAqIERvZXMgTk9UIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja0RlbGV0ZU9uZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBrZXkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tEZWxldGVNYW55KFtrZXldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgdXBkYXRpbmcgdGhlbSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSB1cGRhdGVzIFRoZSBlbnRpdGllcyB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBkYXRlTWFueShcbiAgICB1cGRhdGVzOiBVcGRhdGU8VD5bXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgdXBkYXRlcyA9PSBudWxsIHx8XG4gICAgICB1cGRhdGVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGVudGl0eU1hcCA9IGNvbGxlY3Rpb24uZW50aXRpZXM7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSB1cGRhdGVzLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlczogZW50aXR5IH0gPSB1cGRhdGU7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IHVwZGF0ZSByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICAvLyBPbmx5IHRyYWNrIGlmIGl0IGlzIGluIHRoZSBjb2xsZWN0aW9uLiBTaWxlbnRseSBpZ25vcmUgaWYgaXQgaXMgbm90LlxuICAgICAgLy8gQG5ncngvZW50aXR5IGFkYXB0ZXIgd291bGQgYWxzbyBzaWxlbnRseSBpZ25vcmUuXG4gICAgICAvLyBUb2RvOiBzaG91bGQgbWlzc2luZyB1cGRhdGUgZW50aXR5IHJlYWxseSBiZSByZXBvcnRlZCBhcyBhbiBlcnJvcj9cbiAgICAgIGlmIChvcmlnaW5hbFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgIGlmICghdHJhY2tlZENoYW5nZSkge1xuICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5VcGRhdGVkLCBvcmlnaW5hbFZhbHVlIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIHVwZGF0aW5nIGl0IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIHVwZGF0ZSBUaGUgZW50aXR5IHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcGRhdGVPbmUoXG4gICAgdXBkYXRlOiBVcGRhdGU8VD4sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdXBkYXRlID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnRyYWNrVXBkYXRlTWFueShbdXBkYXRlXSwgY29sbGVjdGlvbiwgbWVyZ2VTdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgbXVsdGlwbGUgZW50aXRpZXMgYmVmb3JlIHVwc2VydGluZyAoYWRkaW5nIGFuZCB1cGRhdGluZykgdGhlbSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXRpZXMgdG8gYWRkIG9yIHVwZGF0ZS4gVGhleSBtdXN0IGJlIGNvbXBsZXRlIGVudGl0aWVzIHdpdGggaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1Vwc2VydE1hbnkoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgZW50aXRpZXMgPT0gbnVsbCB8fFxuICAgICAgZW50aXRpZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IHVwc2VydCByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcblxuICAgICAgaWYgKCF0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgICBjaGdTdGF0ZVtpZF0gPVxuICAgICAgICAgIG9yaWdpbmFsVmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuQWRkZWQgfVxuICAgICAgICAgICAgOiB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuVXBkYXRlZCwgb3JpZ2luYWxWYWx1ZSB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgdXBzZXJ0IChhZGRpbmcgYW5kIHVwZGF0aW5nKSBpdCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXR5IHRvIGFkZCBvciB1cGRhdGUuIEl0IG11c3QgYmUgYSBjb21wbGV0ZSBlbnRpdHkgd2l0aCBpdHMgaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBzZXJ0T25lKFxuICAgIGVudGl0eTogVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tVcHNlcnRNYW55KFtlbnRpdHldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHRyYWNrIG1ldGhvZHNcblxuICAvLyAjcmVnaW9uIHVuZG8gbWV0aG9kc1xuICAvKipcbiAgICogUmV2ZXJ0IHRoZSB1bnNhdmVkIGNoYW5nZXMgZm9yIGFsbCBjb2xsZWN0aW9uLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byB1bmRvLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9BbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGlkcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgY29uc3QgeyByZW1vdmUsIHVwc2VydCB9ID0gaWRzLnJlZHVjZShcbiAgICAgIChhY2MsIGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gYWNjLmNoZ1N0YXRlW2lkXSE7XG4gICAgICAgIHN3aXRjaCAoY2hhbmdlU3RhdGUuY2hhbmdlVHlwZSkge1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5BZGRlZDpcbiAgICAgICAgICAgIGFjYy5yZW1vdmUucHVzaChpZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuRGVsZXRlZDpcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBjaGFuZ2VTdGF0ZSEub3JpZ2luYWxWYWx1ZTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChyZW1vdmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5VcGRhdGVkOlxuICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKGNoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlISk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIC8vIGVudGl0aWVzVG9VbmRvXG4gICAgICB7XG4gICAgICAgIHJlbW92ZTogW10gYXMgKG51bWJlciB8IHN0cmluZylbXSxcbiAgICAgICAgdXBzZXJ0OiBbXSBhcyBUW10sXG4gICAgICAgIGNoZ1N0YXRlOiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkocmVtb3ZlIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0LCBjb2xsZWN0aW9uKTtcblxuICAgIHJldHVybiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlOiB7fSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydCB0aGUgdW5zYXZlZCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXRpZXMuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIHVuZG8uXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkTGlzdCBUaGUgZW50aXRpZXMgdG8gcmV2ZXJ0IG9yIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICB1bmRvTWFueShcbiAgICBlbnRpdHlPcklkTGlzdDogKG51bWJlciB8IHN0cmluZyB8IFQpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoZW50aXR5T3JJZExpc3QgPT0gbnVsbCB8fCBlbnRpdHlPcklkTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHVuZG9cbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuXG4gICAgY29uc3QgeyBjaGFuZ2VTdGF0ZSwgcmVtb3ZlLCB1cHNlcnQgfSA9IGVudGl0eU9ySWRMaXN0LnJlZHVjZShcbiAgICAgIChhY2MsIGVudGl0eU9ySWQpID0+IHtcbiAgICAgICAgbGV0IGNoZ1N0YXRlID0gYWNjLmNoYW5nZVN0YXRlO1xuICAgICAgICBjb25zdCBpZCA9XG4gICAgICAgICAgdHlwZW9mIGVudGl0eU9ySWQgPT09ICdvYmplY3QnXG4gICAgICAgICAgICA/IHRoaXMuc2VsZWN0SWQoZW50aXR5T3JJZClcbiAgICAgICAgICAgIDogKGVudGl0eU9ySWQgYXMgc3RyaW5nIHwgbnVtYmVyKTtcbiAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdITtcbiAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07IC8vIGNsZWFyIHRyYWNraW5nIG9mIHRoaXMgZW50aXR5XG4gICAgICAgICAgYWNjLmNoYW5nZVN0YXRlID0gY2hnU3RhdGU7XG4gICAgICAgICAgc3dpdGNoIChjaGFuZ2UuY2hhbmdlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkFkZGVkOlxuICAgICAgICAgICAgICBhY2MucmVtb3ZlLnB1c2goaWQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5EZWxldGVkOlxuICAgICAgICAgICAgICBjb25zdCByZW1vdmVkID0gY2hhbmdlIS5vcmlnaW5hbFZhbHVlO1xuICAgICAgICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChyZW1vdmVkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5VcGRhdGVkOlxuICAgICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2goY2hhbmdlIS5vcmlnaW5hbFZhbHVlISk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIC8vIGVudGl0aWVzVG9VbmRvXG4gICAgICB7XG4gICAgICAgIHJlbW92ZTogW10gYXMgKG51bWJlciB8IHN0cmluZylbXSxcbiAgICAgICAgdXBzZXJ0OiBbXSBhcyBUW10sXG4gICAgICAgIGNoYW5nZVN0YXRlOiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkocmVtb3ZlIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0LCBjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnQgdGhlIHVuc2F2ZWQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0eS5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gdW5kby5cbiAgICogQHBhcmFtIGVudGl0eU9ySWQgVGhlIGVudGl0eSB0byByZXZlcnQgb3IgaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9PbmUoXG4gICAgZW50aXR5T3JJZDogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHlPcklkID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnVuZG9NYW55KFtlbnRpdHlPcklkXSwgY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiB1bmRvIG1ldGhvZHNcbn1cbiJdfQ==