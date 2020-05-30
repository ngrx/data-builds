var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var /**
 * The default implementation of EntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 * @template T
 */
EntityChangeTrackerBase = /** @class */ (function () {
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
    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.commitAll = 
    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} collection The entity collection
     * @return {?}
     */
    function (collection) {
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
    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} entityOrIdList The entities to clear tracking or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.commitMany = /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param {?} entityOrIdList The entities to clear tracking or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    function (entityOrIdList, collection) {
        var _this = this;
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to commit
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var changeState = entityOrIdList.reduce((/**
         * @param {?} chgState
         * @param {?} entityOrId
         * @return {?}
         */
        function (chgState, entityOrId) {
            /** @type {?} */
            var id = typeof entityOrId === 'object'
                ? _this.selectId(entityOrId)
                : ((/** @type {?} */ (entityOrId)));
            if (chgState[id]) {
                if (!didMutate) {
                    chgState = __assign({}, chgState);
                    didMutate = true;
                }
                delete chgState[id];
            }
            return chgState;
        }), collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param entityOrId The entity to clear tracking or its id.
     * @param collection The entity collection
     */
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param {?} entityOrId The entity to clear tracking or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.commitOne = /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param {?} entityOrId The entity to clear tracking or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    function (entityOrId, collection) {
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
    // #endregion commit methods
    // #region merge query
    /**
     * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
     * @param {?} entities Entities returned from querying the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeQueryResults = 
    // #endregion commit methods
    // #region merge query
    /**
     * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
     * @param {?} entities Entities returned from querying the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    function (entities, collection, mergeStrategy) {
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
    EntityChangeTrackerBase.prototype.mergeSaveAdds = 
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
    function (entities, collection, mergeStrategy) {
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
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param {?} keys
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveDeletes = /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param {?} keys
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    function (keys, collection, mergeStrategy) {
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        // same logic for all non-ignore merge strategies: always clear (commit) the changes
        /** @type {?} */
        var deleteIds = (/** @type {?} */ (keys));
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
    /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} updateResponseData Entity response data returned from saving updated entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @param {?=} skipUnchanged
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveUpdates = /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} updateResponseData Entity response data returned from saving updated entities to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @param {?=} skipUnchanged
     * @return {?} The merged EntityCollection.
     */
    function (updateResponseData, collection, mergeStrategy, skipUnchanged) {
        var _this = this;
        if (skipUnchanged === void 0) { skipUnchanged = false; }
        if (updateResponseData == null || updateResponseData.length === 0) {
            return collection; // nothing to merge.
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        /** @type {?} */
        var updates;
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
                function (chgState, update) {
                    /** @type {?} */
                    var oldId = update.id;
                    /** @type {?} */
                    var change = chgState[oldId];
                    if (change) {
                        if (!didMutate) {
                            chgState = __assign({}, chgState);
                            didMutate = true;
                        }
                        delete chgState[oldId];
                    }
                    return chgState;
                }), collection.changeState);
                collection = didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.PreserveChanges: {
                /** @type {?} */
                var updateableEntities_1 = (/** @type {?} */ ([]));
                changeState = updateResponseData.reduce((/**
                 * @param {?} chgState
                 * @param {?} update
                 * @return {?}
                 */
                function (chgState, update) {
                    /** @type {?} */
                    var oldId = update.id;
                    /** @type {?} */
                    var change = chgState[oldId];
                    if (change) {
                        // Tracking a change so update original value but not the current value
                        if (!didMutate) {
                            chgState = __assign({}, chgState);
                            didMutate = true;
                        }
                        /** @type {?} */
                        var newId = _this.selectId((/** @type {?} */ (update.changes)));
                        /** @type {?} */
                        var oldChangeState = change;
                        // If the server changed the id, register the new "originalValue" under the new id
                        // and remove the change tracked under the old id.
                        if (newId !== oldId) {
                            delete chgState[oldId];
                        }
                        /** @type {?} */
                        var newOrigValue = __assign(__assign({}, ((/** @type {?} */ ((/** @type {?} */ (oldChangeState)).originalValue)))), ((/** @type {?} */ (update.changes))));
                        ((/** @type {?} */ (chgState)))[newId] = __assign(__assign({}, oldChangeState), { originalValue: newOrigValue });
                    }
                    else {
                        updateableEntities_1.push(update);
                    }
                    return chgState;
                }), collection.changeState);
                collection = didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
                updates = filterChanged(updateableEntities_1);
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
                function (r) { return r.changed === true; }));
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map((/**
             * @param {?} r
             * @return {?}
             */
            function (r) { return ({ id: (/** @type {?} */ (r.id)), changes: r.changes }); }));
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
    /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} entities Entities returned from saving upserts to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    EntityChangeTrackerBase.prototype.mergeSaveUpserts = /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param {?} entities Entities returned from saving upserts to the server.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?} The merged EntityCollection.
     */
    function (entities, collection, mergeStrategy) {
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
    EntityChangeTrackerBase.prototype.mergeServerUpserts = 
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
    function (entities, collection, defaultMergeStrategy, mergeStrategy) {
        var _this = this;
        if (entities == null || entities.length === 0) {
            return collection; // nothing to merge.
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var changeState = collection.changeState;
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
                function (chgState, entity) {
                    /** @type {?} */
                    var id = _this.selectId(entity);
                    /** @type {?} */
                    var change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = __assign({}, chgState);
                            didMutate = true;
                        }
                        delete chgState[id];
                    }
                    return chgState;
                }), collection.changeState);
                return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
            case MergeStrategy.PreserveChanges: {
                /** @type {?} */
                var upsertEntities_1 = (/** @type {?} */ ([]));
                changeState = entities.reduce((/**
                 * @param {?} chgState
                 * @param {?} entity
                 * @return {?}
                 */
                function (chgState, entity) {
                    var _a;
                    /** @type {?} */
                    var id = _this.selectId(entity);
                    /** @type {?} */
                    var change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = __assign(__assign({}, chgState), (_a = {}, _a[id] = __assign(__assign({}, (/** @type {?} */ (chgState[id]))), { originalValue: entity }), _a));
                            didMutate = true;
                        }
                    }
                    else {
                        upsertEntities_1.push(entity);
                    }
                    return chgState;
                }), collection.changeState);
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
    EntityChangeTrackerBase.prototype.trackAddMany = 
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
    function (entities, collection, mergeStrategy) {
        var _this = this;
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var changeState = entities.reduce((/**
         * @param {?} chgState
         * @param {?} entity
         * @return {?}
         */
        function (chgState, entity) {
            /** @type {?} */
            var id = _this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(collection.entityName + " entity add requires a key to be tracked");
            }
            /** @type {?} */
            var trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = __assign({}, chgState);
                }
                chgState[id] = { changeType: ChangeType.Added };
            }
            return chgState;
        }), collection.changeState);
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
    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param {?} entity The entity to add. It must have an id.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackAddOne = /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param {?} entity The entity to add. It must have an id.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (entity, collection, mergeStrategy) {
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
    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} keys The primary keys of the entities to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackDeleteMany = /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} keys The primary keys of the entities to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (keys, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            keys == null ||
            keys.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var entityMap = collection.entities;
        /** @type {?} */
        var changeState = keys.reduce((/**
         * @param {?} chgState
         * @param {?} id
         * @return {?}
         */
        function (chgState, id) {
            /** @type {?} */
            var originalValue = entityMap[id];
            if (originalValue) {
                /** @type {?} */
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
            /**
             * @return {?}
             */
            function cloneChgStateOnce() {
                if (!didMutate) {
                    didMutate = true;
                    chgState = __assign({}, chgState);
                }
            }
        }), collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param key The primary key of the entity to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} key The primary key of the entity to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackDeleteOne = /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param {?} key The primary key of the entity to delete.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (key, collection, mergeStrategy) {
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
    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} updates The entities to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackUpdateMany = /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} updates The entities to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (updates, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            updates == null ||
            updates.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var entityMap = collection.entities;
        /** @type {?} */
        var changeState = updates.reduce((/**
         * @param {?} chgState
         * @param {?} update
         * @return {?}
         */
        function (chgState, update) {
            var id = update.id, entity = update.changes;
            if (id == null || id === '') {
                throw new Error(collection.entityName + " entity update requires a key to be tracked");
            }
            /** @type {?} */
            var originalValue = entityMap[id];
            // Only track if it is in the collection. Silently ignore if it is not.
            // @ngrx/entity adapter would also silently ignore.
            // Todo: should missing update entity really be reported as an error?
            if (originalValue) {
                /** @type {?} */
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
        }), collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param update The entity to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} update The entity to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackUpdateOne = /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} update The entity to update.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (update, collection, mergeStrategy) {
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
    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entities The entities to add or update. They must be complete entities with ids.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackUpsertMany = /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entities The entities to add or update. They must be complete entities with ids.
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (entities, collection, mergeStrategy) {
        var _this = this;
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        /** @type {?} */
        var didMutate = false;
        /** @type {?} */
        var entityMap = collection.entities;
        /** @type {?} */
        var changeState = entities.reduce((/**
         * @param {?} chgState
         * @param {?} entity
         * @return {?}
         */
        function (chgState, entity) {
            /** @type {?} */
            var id = _this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(collection.entityName + " entity upsert requires a key to be tracked");
            }
            /** @type {?} */
            var trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = __assign({}, chgState);
                }
                /** @type {?} */
                var originalValue = entityMap[id];
                chgState[id] =
                    originalValue == null
                        ? { changeType: ChangeType.Added }
                        : { changeType: ChangeType.Updated, originalValue: originalValue };
            }
            return chgState;
        }), collection.changeState);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entity to add or update. It must be a complete entity with its id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entity
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.trackUpsertOne = /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param {?} entity
     * @param {?} collection The entity collection
     * @param {?=} mergeStrategy
     * @return {?}
     */
    function (entity, collection, mergeStrategy) {
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
    // #endregion track methods
    // #region undo methods
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.undoAll = 
    // #endregion track methods
    // #region undo methods
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param {?} collection The entity collection
     * @return {?}
     */
    function (collection) {
        /** @type {?} */
        var ids = Object.keys(collection.changeState);
        var _a = ids.reduce((/**
         * @param {?} acc
         * @param {?} id
         * @return {?}
         */
        function (acc, id) {
            /** @type {?} */
            var changeState = (/** @type {?} */ (acc.chgState[id]));
            switch (changeState.changeType) {
                case ChangeType.Added:
                    acc.remove.push(id);
                    break;
                case ChangeType.Deleted:
                    /** @type {?} */
                    var removed = (/** @type {?} */ (changeState)).originalValue;
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
        }), remove = _a.remove, upsert = _a.upsert;
        collection = this.adapter.removeMany((/** @type {?} */ (remove)), collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return __assign(__assign({}, collection), { changeState: {} });
    };
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param entityOrIdList The entities to revert or their ids.
     * @param collection The entity collection
     */
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrIdList The entities to revert or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.undoMany = /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrIdList The entities to revert or their ids.
     * @param {?} collection The entity collection
     * @return {?}
     */
    function (entityOrIdList, collection) {
        var _this = this;
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to undo
        }
        /** @type {?} */
        var didMutate = false;
        var _a = entityOrIdList.reduce((/**
         * @param {?} acc
         * @param {?} entityOrId
         * @return {?}
         */
        function (acc, entityOrId) {
            /** @type {?} */
            var chgState = acc.changeState;
            /** @type {?} */
            var id = typeof entityOrId === 'object'
                ? _this.selectId(entityOrId)
                : ((/** @type {?} */ (entityOrId)));
            /** @type {?} */
            var change = (/** @type {?} */ (chgState[id]));
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
                        /** @type {?} */
                        var removed = (/** @type {?} */ (change)).originalValue;
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
        }), changeState = _a.changeState, remove = _a.remove, upsert = _a.upsert;
        collection = this.adapter.removeMany((/** @type {?} */ (remove)), collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return didMutate ? __assign(__assign({}, collection), { changeState: changeState }) : collection;
    };
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param entityOrId The entity to revert or its id.
     * @param collection The entity collection
     */
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrId The entity to revert or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    EntityChangeTrackerBase.prototype.undoOne = /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param {?} entityOrId The entity to revert or its id.
     * @param {?} collection The entity collection
     * @return {?}
     */
    function (entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.undoMany([entityOrId], collection);
    };
    return EntityChangeTrackerBase;
}());
/**
 * The default implementation of EntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 * @template T
 */
export { EntityChangeTrackerBase };
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