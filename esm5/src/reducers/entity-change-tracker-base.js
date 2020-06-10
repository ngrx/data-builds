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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL3JlZHVjZXJzL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFvQixNQUFNLHFCQUFxQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7Ozs7Ozs7O0FBUzFEOzs7Ozs7OztJQUNFLGlDQUNVLE9BQXlCLEVBQ3pCLFFBQXVCO1FBRHZCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFFL0Isb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLGVBQWUsQ0FBQztJQUM5QyxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsMkNBQVM7Ozs7Ozs7O0lBQVQsVUFBVSxVQUErQjtRQUN2QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxVQUFVO1lBQ1osQ0FBQyx1QkFBTSxVQUFVLEtBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCw0Q0FBVTs7Ozs7OztJQUFWLFVBQ0UsY0FBdUMsRUFDdkMsVUFBK0I7UUFGakMsaUJBd0JDO1FBcEJDLElBQUksY0FBYyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQjtTQUN4Qzs7WUFDRyxTQUFTLEdBQUcsS0FB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LE1BQU0sRUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekQsT0FBTyxTQUFTLENBQUMsQ0FBQyx1QkFBTSxVQUFVLEtBQUUsV0FBVyxhQUFBLElBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gseUNBQU87Ozs7Ozs7SUFBUCxVQUNFLFVBQStCLEVBQy9CLFVBQStCO1FBRS9CLE9BQU8sVUFBVSxJQUFJLElBQUk7WUFDdkIsQ0FBQyxDQUFDLFVBQVU7WUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFSCw4QkFBQztBQUFELENBQUMsQUF0dEJELElBc3RCQzs7Ozs7Ozs7Ozs7Ozs7SUFwdEJHLDBDQUFpQzs7Ozs7SUFDakMsMkNBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgQ2hhbmdlVHlwZSwgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXIgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlcic7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBFbnRpdHlDaGFuZ2VUcmFja2VyIHdpdGhcbiAqIG1ldGhvZHMgZm9yIHRyYWNraW5nLCBjb21taXR0aW5nLCBhbmQgcmV2ZXJ0aW5nL3VuZG9pbmcgdW5zYXZlZCBlbnRpdHkgY2hhbmdlcy5cbiAqIFVzZWQgYnkgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzIHdoaWNoIHNob3VsZCBjYWxsIHRyYWNrZXIgbWV0aG9kcyBCRUZPUkUgbW9kaWZ5aW5nIHRoZSBjb2xsZWN0aW9uLlxuICogU2VlIEVudGl0eUNoYW5nZVRyYWNrZXIgZG9jcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q2hhbmdlVHJhY2tlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWRhcHRlcjogRW50aXR5QWRhcHRlcjxUPixcbiAgICBwcml2YXRlIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+XG4gICkge1xuICAgIC8qKiBFeHRyYWN0IHRoZSBwcmltYXJ5IGtleSAoaWQpOyBkZWZhdWx0IHRvIGBpZGAgKi9cbiAgICB0aGlzLnNlbGVjdElkID0gc2VsZWN0SWQgfHwgZGVmYXVsdFNlbGVjdElkO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBjb21taXQgbWV0aG9kc1xuICAvKipcbiAgICogQ29tbWl0IGFsbCBjaGFuZ2VzIGFzIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gY29tcGxldGVseSByZWxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIGNvbW1pdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRBbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKS5sZW5ndGggPT09IDBcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlOiB7fSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1pdCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXRpZXMgYXMgd2hlbiB0aGV5IGhhdmUgYmVlbiByZWZyZXNoZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkTGlzdCBUaGUgZW50aXRpZXMgdG8gY2xlYXIgdHJhY2tpbmcgb3IgdGhlaXIgaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdE1hbnkoXG4gICAgZW50aXR5T3JJZExpc3Q6IChudW1iZXIgfCBzdHJpbmcgfCBUKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0eU9ySWRMaXN0ID09IG51bGwgfHwgZW50aXR5T3JJZExpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBjb21taXRcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXR5T3JJZExpc3QucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5T3JJZCkgPT4ge1xuICAgICAgY29uc3QgaWQgPVxuICAgICAgICB0eXBlb2YgZW50aXR5T3JJZCA9PT0gJ29iamVjdCdcbiAgICAgICAgICA/IHRoaXMuc2VsZWN0SWQoZW50aXR5T3JJZClcbiAgICAgICAgICA6IChlbnRpdHlPcklkIGFzIHN0cmluZyB8IG51bWJlcik7XG4gICAgICBpZiAoY2hnU3RhdGVbaWRdKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgY2hnU3RhdGVbaWRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogQ29tbWl0IGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgYXMgd2hlbiBpdCBoYXZlIGJlZW4gcmVmcmVzaGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICogSGFybWxlc3Mgd2hlbiBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkIFRoZSBlbnRpdHkgdG8gY2xlYXIgdHJhY2tpbmcgb3IgaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIGNvbW1pdE9uZShcbiAgICBlbnRpdHlPcklkOiBudW1iZXIgfCBzdHJpbmcgfCBULFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIGVudGl0eU9ySWQgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMuY29tbWl0TWFueShbZW50aXR5T3JJZF0sIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBjb21taXQgbWV0aG9kc1xuXG4gIC8vICNyZWdpb24gbWVyZ2UgcXVlcnlcbiAgLyoqXG4gICAqIE1lcmdlIHF1ZXJ5IHJlc3VsdHMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyByZXR1cm5lZCBmcm9tIHF1ZXJ5aW5nIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHF1ZXJpZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlUXVlcnlSZXN1bHRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZVNlcnZlclVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlcyxcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICB9XG4gIC8vICNlbmRyZWdpb24gbWVyZ2UgcXVlcnkgcmVzdWx0c1xuXG4gIC8vICNyZWdpb24gbWVyZ2Ugc2F2ZSByZXN1bHRzXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIG5ldyBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzYXZpbmcgbmV3IGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlQWRkcyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2Ugc3VjY2Vzc2Z1bCByZXN1bHQgb2YgZGVsZXRpbmcgZW50aXRpZXMgb24gdGhlIHNlcnZlciB0aGF0IGhhdmUgdGhlIGdpdmVuIHByaW1hcnkga2V5c1xuICAgKiBDbGVhcnMgdGhlIGVudGl0eSBjaGFuZ2VTdGF0ZSBmb3IgdGhvc2Uga2V5cyB1bmxlc3MgdGhlIE1lcmdlU3RyYXRlZ3kgaXMgaWdub3JlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIGtleXMgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byByZW1vdmUvZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gYWRqdXN0IGNoYW5nZSB0cmFja2luZyB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlRGVsZXRlcyhcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIC8vIHNhbWUgbG9naWMgZm9yIGFsbCBub24taWdub3JlIG1lcmdlIHN0cmF0ZWdpZXM6IGFsd2F5cyBjbGVhciAoY29tbWl0KSB0aGUgY2hhbmdlc1xuICAgIGNvbnN0IGRlbGV0ZUlkcyA9IGtleXMgYXMgc3RyaW5nW107IC8vIG1ha2UgVHlwZVNjcmlwdCBoYXBweVxuICAgIGNvbGxlY3Rpb24gPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzXG4gICAgICAgID8gY29sbGVjdGlvblxuICAgICAgICA6IHRoaXMuY29tbWl0TWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHJlc3VsdCBvZiBzYXZpbmcgdXBkYXRlZCBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gdXBkYXRlUmVzcG9uc2VEYXRhIEVudGl0eSByZXNwb25zZSBkYXRhIHJldHVybmVkIGZyb20gc2F2aW5nIHVwZGF0ZWQgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIG1lcmdlIGEgc2F2ZWQgZW50aXR5IHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGhhcyBhbiB1bnNhdmVkIGNoYW5nZS5cbiAgICogRGVmYXVsdHMgdG8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gW3NraXBVbmNoYW5nZWRdIFRydWUgbWVhbnMgc2tpcCB1cGRhdGUgaWYgc2VydmVyIGRpZG4ndCBjaGFuZ2UgaXQuIEZhbHNlIGJ5IGRlZmF1bHQuXG4gICAqIElmIHRoZSB1cGRhdGUgd2FzIG9wdGltaXN0aWMgYW5kIHRoZSBzZXJ2ZXIgZGlkbid0IG1ha2UgbW9yZSBjaGFuZ2VzIG9mIGl0cyBvd25cbiAgICogdGhlbiB0aGUgdXBkYXRlcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbiBhbmQgc2hvdWxkbid0IG1ha2UgdGhlbSBhZ2Fpbi5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlVXBkYXRlcyhcbiAgICB1cGRhdGVSZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgc2tpcFVuY2hhbmdlZCA9IGZhbHNlXG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh1cGRhdGVSZXNwb25zZURhdGEgPT0gbnVsbCB8fCB1cGRhdGVSZXNwb25zZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byBtZXJnZS5cbiAgICB9XG5cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZTtcbiAgICBtZXJnZVN0cmF0ZWd5ID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyA6IG1lcmdlU3RyYXRlZ3k7XG4gICAgbGV0IHVwZGF0ZXM6IFVwZGF0ZTxUPltdO1xuXG4gICAgc3dpdGNoIChtZXJnZVN0cmF0ZWd5KSB7XG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlczpcbiAgICAgICAgdXBkYXRlcyA9IGZpbHRlckNoYW5nZWQodXBkYXRlUmVzcG9uc2VEYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlczpcbiAgICAgICAgY2hhbmdlU3RhdGUgPSB1cGRhdGVSZXNwb25zZURhdGEucmVkdWNlKChjaGdTdGF0ZSwgdXBkYXRlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkSWQgPSB1cGRhdGUuaWQ7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbb2xkSWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICBjb2xsZWN0aW9uID0gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgICB1cGRhdGVzID0gZmlsdGVyQ2hhbmdlZCh1cGRhdGVSZXNwb25zZURhdGEpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXM6IHtcbiAgICAgICAgY29uc3QgdXBkYXRlYWJsZUVudGl0aWVzID0gW10gYXMgVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W107XG4gICAgICAgIGNoYW5nZVN0YXRlID0gdXBkYXRlUmVzcG9uc2VEYXRhLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9sZElkID0gdXBkYXRlLmlkO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAvLyBUcmFja2luZyBhIGNoYW5nZSBzbyB1cGRhdGUgb3JpZ2luYWwgdmFsdWUgYnV0IG5vdCB0aGUgY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdJZCA9IHRoaXMuc2VsZWN0SWQodXBkYXRlLmNoYW5nZXMgYXMgVCk7XG4gICAgICAgICAgICBjb25zdCBvbGRDaGFuZ2VTdGF0ZSA9IGNoYW5nZTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBzZXJ2ZXIgY2hhbmdlZCB0aGUgaWQsIHJlZ2lzdGVyIHRoZSBuZXcgXCJvcmlnaW5hbFZhbHVlXCIgdW5kZXIgdGhlIG5ldyBpZFxuICAgICAgICAgICAgLy8gYW5kIHJlbW92ZSB0aGUgY2hhbmdlIHRyYWNrZWQgdW5kZXIgdGhlIG9sZCBpZC5cbiAgICAgICAgICAgIGlmIChuZXdJZCAhPT0gb2xkSWQpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld09yaWdWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgLi4uKG9sZENoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLih1cGRhdGUuY2hhbmdlcyBhcyBhbnkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIChjaGdTdGF0ZSBhcyBhbnkpW25ld0lkXSA9IHtcbiAgICAgICAgICAgICAgLi4ub2xkQ2hhbmdlU3RhdGUsXG4gICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IG5ld09yaWdWYWx1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZWFibGVFbnRpdGllcy5wdXNoKHVwZGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuXG4gICAgICAgIHVwZGF0ZXMgPSBmaWx0ZXJDaGFuZ2VkKHVwZGF0ZWFibGVFbnRpdGllcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25kaXRpb25hbGx5IGtlZXAgb25seSB0aG9zZSB1cGRhdGVzIHRoYXQgaGF2ZSBhZGRpdGlvbmFsIHNlcnZlciBjaGFuZ2VzLlxuICAgICAqIChlLmcuLCBmb3Igb3B0aW1pc3RpYyBzYXZlcyBiZWNhdXNlIHRoZXkgdXBkYXRlcyBhcmUgYWxyZWFkeSBpbiB0aGUgY3VycmVudCBjb2xsZWN0aW9uKVxuICAgICAqIFN0cmlwIG9mZiB0aGUgYGNoYW5nZWRgIHByb3BlcnR5LlxuICAgICAqIEByZXNwb25zZURhdGEgRW50aXR5IHJlc3BvbnNlIGRhdGEgZnJvbSBzZXJ2ZXIuXG4gICAgICogTWF5IGJlIGFuIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiwgYSBzdWJjbGFzcyBvZiBVcGRhdGU8VD4gd2l0aCBhICdjaGFuZ2VkJyBmbGFnLlxuICAgICAqIEByZXR1cm5zIFVwZGF0ZTxUPiAod2l0aG91dCB0aGUgY2hhbmdlZCBmbGFnKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlckNoYW5nZWQocmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSk6IFVwZGF0ZTxUPltdIHtcbiAgICAgIGlmIChza2lwVW5jaGFuZ2VkID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGtlZXAgb25seSB0aG9zZSB1cGRhdGVzIHRoYXQgdGhlIHNlcnZlciBjaGFuZ2VkIChrbm93YWJsZSBpZiBpcyBVcGRhdGVSZXNwb25zZURhdGE8VD4pXG4gICAgICAgIHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlRGF0YS5maWx0ZXIoKHIpID0+IHIuY2hhbmdlZCA9PT0gdHJ1ZSk7XG4gICAgICB9XG4gICAgICAvLyBTdHJpcCB1bmNoYW5nZWQgcHJvcGVydHkgZnJvbSByZXNwb25zZURhdGEsIGxlYXZpbmcganVzdCB0aGUgcHVyZSBVcGRhdGU8VD5cbiAgICAgIC8vIFRPRE86IFJlbW92ZT8gcHJvYmFibHkgbm90IG5lY2Vzc2FyeSBhcyB0aGUgVXBkYXRlIGlzbid0IHN0b3JlZCBhbmQgYWRhcHRlciB3aWxsIGlnbm9yZSBgY2hhbmdlZGAuXG4gICAgICByZXR1cm4gcmVzcG9uc2VEYXRhLm1hcCgocikgPT4gKHsgaWQ6IHIuaWQgYXMgYW55LCBjaGFuZ2VzOiByLmNoYW5nZXMgfSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIHVwc2VydGVkIGVudGl0aWVzIGludG8gdGhlIGNvbGxlY3Rpb24sIGFkanVzdGluZyB0aGUgQ2hhbmdlU3RhdGUgcGVyIHRoZSBtZXJnZVN0cmF0ZWd5LlxuICAgKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBFbnRpdGllcyByZXR1cm5lZCBmcm9tIHNhdmluZyB1cHNlcnRzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHJldHVybnMgVGhlIG1lcmdlZCBFbnRpdHlDb2xsZWN0aW9uLlxuICAgKi9cbiAgbWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBtZXJnZSBzYXZlIHJlc3VsdHNcblxuICAvLyAjcmVnaW9uIHF1ZXJ5ICYgc2F2ZSBoZWxwZXJzXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgdG8gbWVyZ2VcbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gQ29sbGVjdGlvbiBpbnRvIHdoaWNoIGVudGl0aWVzIGFyZSBtZXJnZWRcbiAgICogQHBhcmFtIGRlZmF1bHRNZXJnZVN0cmF0ZWd5IEhvdyB0byBtZXJnZSB3aGVuIGFjdGlvbidzIE1lcmdlU3RyYXRlZ3kgaXMgdW5zcGVjaWZpZWRcbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUaGUgYWN0aW9uJ3MgTWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcHJpdmF0ZSBtZXJnZVNlcnZlclVwc2VydHMoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGRlZmF1bHRNZXJnZVN0cmF0ZWd5OiBNZXJnZVN0cmF0ZWd5LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChlbnRpdGllcyA9PSBudWxsIHx8IGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gbWVyZ2UuXG4gICAgfVxuXG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGxldCBjaGFuZ2VTdGF0ZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGU7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBkZWZhdWx0TWVyZ2VTdHJhdGVneSA6IG1lcmdlU3RyYXRlZ3k7XG5cbiAgICBzd2l0Y2ggKG1lcmdlU3RyYXRlZ3kpIHtcbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzOlxuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlczpcbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcblxuICAgICAgICBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG5cbiAgICAgIGNhc2UgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXM6IHtcbiAgICAgICAgY29uc3QgdXBzZXJ0RW50aXRpZXMgPSBbXSBhcyBUW107XG4gICAgICAgIGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0ge1xuICAgICAgICAgICAgICAgIC4uLmNoZ1N0YXRlLFxuICAgICAgICAgICAgICAgIFtpZF06IHtcbiAgICAgICAgICAgICAgICAgIC4uLmNoZ1N0YXRlW2lkXSEsXG4gICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBlbnRpdHksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBzZXJ0RW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueSh1cHNlcnRFbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyAjZW5kcmVnaW9uIHF1ZXJ5ICYgc2F2ZSBoZWxwZXJzXG5cbiAgLy8gI3JlZ2lvbiB0cmFjayBtZXRob2RzXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgYWRkaW5nIHRoZW0gdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIGFkZCB0byB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgVGhlIGVudGl0aWVzIHRvIGFkZC4gVGhleSBtdXN0IGFsbCBoYXZlIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tBZGRNYW55KFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIGVudGl0aWVzID09IG51bGwgfHxcbiAgICAgIGVudGl0aWVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZW50aXRpZXMucmVkdWNlKChjaGdTdGF0ZSwgZW50aXR5KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7Y29sbGVjdGlvbi5lbnRpdHlOYW1lfSBlbnRpdHkgYWRkIHJlcXVpcmVzIGEga2V5IHRvIGJlIHRyYWNrZWRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuXG4gICAgICBpZiAoIXRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG4gICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5BZGRlZCB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgYWRkaW5nIGl0IHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCBhZGQgdG8gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0eSBUaGUgZW50aXR5IHRvIGFkZC4gSXQgbXVzdCBoYXZlIGFuIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIGltcGxlbWVudGF0aW9uIHN1cHBsaWVzIGEgZGVmYXVsdCBzdHJhdGVneS5cbiAgICovXG4gIHRyYWNrQWRkT25lKFxuICAgIGVudGl0eTogVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tBZGRNYW55KFtlbnRpdHldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgcmVtb3ZpbmcgdGhlbSB3aXRoIHRoZSBpbnRlbnRpb24gb2YgZGVsZXRpbmcgdGhlbSBvbiB0aGUgc2VydmVyLlxuICAgKiBEb2VzIE5PVCByZW1vdmUgZnJvbSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0ga2V5cyBUaGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdGllcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrRGVsZXRlTWFueShcbiAgICBrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICBrZXlzID09IG51bGwgfHxcbiAgICAgIGtleXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGtleXMucmVkdWNlKChjaGdTdGF0ZSwgaWQpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgaWYgKG9yaWdpbmFsVmFsdWUpIHtcbiAgICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgaWYgKHRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgICBpZiAodHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2U6IHN0b3AgdHJhY2tpbmcgYW4gYWRkZWQgZW50aXR5IHRoYXQgeW91IGRlbGV0ZVxuICAgICAgICAgICAgLy8gVGhlIGNhbGxlciBtdXN0IGFsc28gZGV0ZWN0IHRoaXMsIHJlbW92ZSBpdCBpbW1lZGlhdGVseSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAgICAgICAgICAvLyBhbmQgc2tpcCBhdHRlbXB0IHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyLlxuICAgICAgICAgICAgY2xvbmVDaGdTdGF0ZU9uY2UoKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgfSBlbHNlIGlmICh0cmFja2VkQ2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuVXBkYXRlZCkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlOiBzd2l0Y2ggY2hhbmdlIHR5cGUgZnJvbSBVcGRhdGVkIHRvIERlbGV0ZWQuXG4gICAgICAgICAgICBjbG9uZUNoZ1N0YXRlT25jZSgpO1xuICAgICAgICAgICAgdHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID0gQ2hhbmdlVHlwZS5EZWxldGVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTdGFydCB0cmFja2luZyB0aGlzIGVudGl0eVxuICAgICAgICAgIGNsb25lQ2hnU3RhdGVPbmNlKCk7XG4gICAgICAgICAgY2hnU3RhdGVbaWRdID0geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkRlbGV0ZWQsIG9yaWdpbmFsVmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuXG4gICAgICBmdW5jdGlvbiBjbG9uZUNoZ1N0YXRlT25jZSgpIHtcbiAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIGl0IGlzIHJlbW92ZWQgd2l0aCB0aGUgaW50ZW50aW9uIG9mIGRlbGV0aW5nIGl0IG9uIHRoZSBzZXJ2ZXIuXG4gICAqIERvZXMgTk9UIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBrZXkgVGhlIHByaW1hcnkga2V5IG9mIHRoZSBlbnRpdHkgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja0RlbGV0ZU9uZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBrZXkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tEZWxldGVNYW55KFtrZXldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBtdWx0aXBsZSBlbnRpdGllcyBiZWZvcmUgdXBkYXRpbmcgdGhlbSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSB1cGRhdGVzIFRoZSBlbnRpdGllcyB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBkYXRlTWFueShcbiAgICB1cGRhdGVzOiBVcGRhdGU8VD5bXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgdXBkYXRlcyA9PSBudWxsIHx8XG4gICAgICB1cGRhdGVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGVudGl0eU1hcCA9IGNvbGxlY3Rpb24uZW50aXRpZXM7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSB1cGRhdGVzLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlczogZW50aXR5IH0gPSB1cGRhdGU7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IHVwZGF0ZSByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3JpZ2luYWxWYWx1ZSA9IGVudGl0eU1hcFtpZF07XG4gICAgICAvLyBPbmx5IHRyYWNrIGlmIGl0IGlzIGluIHRoZSBjb2xsZWN0aW9uLiBTaWxlbnRseSBpZ25vcmUgaWYgaXQgaXMgbm90LlxuICAgICAgLy8gQG5ncngvZW50aXR5IGFkYXB0ZXIgd291bGQgYWxzbyBzaWxlbnRseSBpZ25vcmUuXG4gICAgICAvLyBUb2RvOiBzaG91bGQgbWlzc2luZyB1cGRhdGUgZW50aXR5IHJlYWxseSBiZSByZXBvcnRlZCBhcyBhbiBlcnJvcj9cbiAgICAgIGlmIChvcmlnaW5hbFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgIGlmICghdHJhY2tlZENoYW5nZSkge1xuICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5VcGRhdGVkLCBvcmlnaW5hbFZhbHVlIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIHVwZGF0aW5nIGl0IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCB1cGRhdGUgdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIHVwZGF0ZSBUaGUgZW50aXR5IHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcGRhdGVPbmUoXG4gICAgdXBkYXRlOiBVcGRhdGU8VD4sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdXBkYXRlID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnRyYWNrVXBkYXRlTWFueShbdXBkYXRlXSwgY29sbGVjdGlvbiwgbWVyZ2VTdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgbXVsdGlwbGUgZW50aXRpZXMgYmVmb3JlIHVwc2VydGluZyAoYWRkaW5nIGFuZCB1cGRhdGluZykgdGhlbSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXRpZXMgdG8gYWRkIG9yIHVwZGF0ZS4gVGhleSBtdXN0IGJlIGNvbXBsZXRlIGVudGl0aWVzIHdpdGggaWRzLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1Vwc2VydE1hbnkoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAgZW50aXRpZXMgPT0gbnVsbCB8fFxuICAgICAgZW50aXRpZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB0cmFja1xuICAgIH1cbiAgICBsZXQgZGlkTXV0YXRlID0gZmFsc2U7XG4gICAgY29uc3QgZW50aXR5TWFwID0gY29sbGVjdGlvbi5lbnRpdGllcztcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IHVwc2VydCByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcblxuICAgICAgaWYgKCF0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgICBjaGdTdGF0ZVtpZF0gPVxuICAgICAgICAgIG9yaWdpbmFsVmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuQWRkZWQgfVxuICAgICAgICAgICAgOiB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuVXBkYXRlZCwgb3JpZ2luYWxWYWx1ZSB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGFuIGVudGl0eSBiZWZvcmUgdXBzZXJ0IChhZGRpbmcgYW5kIHVwZGF0aW5nKSBpdCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBUaGUgZW50aXR5IHRvIGFkZCBvciB1cGRhdGUuIEl0IG11c3QgYmUgYSBjb21wbGV0ZSBlbnRpdHkgd2l0aCBpdHMgaWQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBzZXJ0T25lKFxuICAgIGVudGl0eTogVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHkgPT0gbnVsbFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHRoaXMudHJhY2tVcHNlcnRNYW55KFtlbnRpdHldLCBjb2xsZWN0aW9uLCBtZXJnZVN0cmF0ZWd5KTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHRyYWNrIG1ldGhvZHNcblxuICAvLyAjcmVnaW9uIHVuZG8gbWV0aG9kc1xuICAvKipcbiAgICogUmV2ZXJ0IHRoZSB1bnNhdmVkIGNoYW5nZXMgZm9yIGFsbCBjb2xsZWN0aW9uLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byB1bmRvLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9BbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGlkcyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgY29uc3QgeyByZW1vdmUsIHVwc2VydCB9ID0gaWRzLnJlZHVjZShcbiAgICAgIChhY2MsIGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gYWNjLmNoZ1N0YXRlW2lkXSE7XG4gICAgICAgIHN3aXRjaCAoY2hhbmdlU3RhdGUuY2hhbmdlVHlwZSkge1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5BZGRlZDpcbiAgICAgICAgICAgIGFjYy5yZW1vdmUucHVzaChpZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuRGVsZXRlZDpcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBjaGFuZ2VTdGF0ZSEub3JpZ2luYWxWYWx1ZTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChyZW1vdmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5VcGRhdGVkOlxuICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKGNoYW5nZVN0YXRlIS5vcmlnaW5hbFZhbHVlISk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIC8vIGVudGl0aWVzVG9VbmRvXG4gICAgICB7XG4gICAgICAgIHJlbW92ZTogW10gYXMgKG51bWJlciB8IHN0cmluZylbXSxcbiAgICAgICAgdXBzZXJ0OiBbXSBhcyBUW10sXG4gICAgICAgIGNoZ1N0YXRlOiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkocmVtb3ZlIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0LCBjb2xsZWN0aW9uKTtcblxuICAgIHJldHVybiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlOiB7fSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydCB0aGUgdW5zYXZlZCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXRpZXMuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIHVuZG8uXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkTGlzdCBUaGUgZW50aXRpZXMgdG8gcmV2ZXJ0IG9yIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICB1bmRvTWFueShcbiAgICBlbnRpdHlPcklkTGlzdDogKG51bWJlciB8IHN0cmluZyB8IFQpW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoZW50aXR5T3JJZExpc3QgPT0gbnVsbCB8fCBlbnRpdHlPcklkTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHVuZG9cbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuXG4gICAgY29uc3QgeyBjaGFuZ2VTdGF0ZSwgcmVtb3ZlLCB1cHNlcnQgfSA9IGVudGl0eU9ySWRMaXN0LnJlZHVjZShcbiAgICAgIChhY2MsIGVudGl0eU9ySWQpID0+IHtcbiAgICAgICAgbGV0IGNoZ1N0YXRlID0gYWNjLmNoYW5nZVN0YXRlO1xuICAgICAgICBjb25zdCBpZCA9XG4gICAgICAgICAgdHlwZW9mIGVudGl0eU9ySWQgPT09ICdvYmplY3QnXG4gICAgICAgICAgICA/IHRoaXMuc2VsZWN0SWQoZW50aXR5T3JJZClcbiAgICAgICAgICAgIDogKGVudGl0eU9ySWQgYXMgc3RyaW5nIHwgbnVtYmVyKTtcbiAgICAgICAgY29uc3QgY2hhbmdlID0gY2hnU3RhdGVbaWRdITtcbiAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtpZF07IC8vIGNsZWFyIHRyYWNraW5nIG9mIHRoaXMgZW50aXR5XG4gICAgICAgICAgYWNjLmNoYW5nZVN0YXRlID0gY2hnU3RhdGU7XG4gICAgICAgICAgc3dpdGNoIChjaGFuZ2UuY2hhbmdlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkFkZGVkOlxuICAgICAgICAgICAgICBhY2MucmVtb3ZlLnB1c2goaWQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5EZWxldGVkOlxuICAgICAgICAgICAgICBjb25zdCByZW1vdmVkID0gY2hhbmdlIS5vcmlnaW5hbFZhbHVlO1xuICAgICAgICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChyZW1vdmVkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5VcGRhdGVkOlxuICAgICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2goY2hhbmdlIS5vcmlnaW5hbFZhbHVlISk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIC8vIGVudGl0aWVzVG9VbmRvXG4gICAgICB7XG4gICAgICAgIHJlbW92ZTogW10gYXMgKG51bWJlciB8IHN0cmluZylbXSxcbiAgICAgICAgdXBzZXJ0OiBbXSBhcyBUW10sXG4gICAgICAgIGNoYW5nZVN0YXRlOiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkocmVtb3ZlIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0LCBjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnQgdGhlIHVuc2F2ZWQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0eS5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gdW5kby5cbiAgICogQHBhcmFtIGVudGl0eU9ySWQgVGhlIGVudGl0eSB0byByZXZlcnQgb3IgaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICovXG4gIHVuZG9PbmUoXG4gICAgZW50aXR5T3JJZDogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHlPcklkID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnVuZG9NYW55KFtlbnRpdHlPcklkXSwgY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiB1bmRvIG1ldGhvZHNcbn1cbiJdfQ==