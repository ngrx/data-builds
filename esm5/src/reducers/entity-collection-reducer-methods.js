import { __assign, __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { ChangeType, } from './entity-collection';
import { EntityChangeTrackerBase } from './entity-change-tracker-base';
import { toUpdateFactory } from '../utils/utilities';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { EntityOp } from '../actions/entity-op';
import { MergeStrategy } from '../actions/merge-strategy';
/**
 * Base implementation of reducer methods for an entity collection.
 */
var EntityCollectionReducerMethods = /** @class */ (function () {
    function EntityCollectionReducerMethods(entityName, definition, 
    /*
     * Track changes to entities since the last query or save
     * Can revert some or all of those changes
     */
    entityChangeTracker) {
        var _a;
        this.entityName = entityName;
        this.definition = definition;
        /**
         * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
         * keyed by the {EntityOp}
         */
        this.methods = (_a = {},
            _a[EntityOp.CANCEL_PERSIST] = this.cancelPersist.bind(this),
            _a[EntityOp.QUERY_ALL] = this.queryAll.bind(this),
            _a[EntityOp.QUERY_ALL_ERROR] = this.queryAllError.bind(this),
            _a[EntityOp.QUERY_ALL_SUCCESS] = this.queryAllSuccess.bind(this),
            _a[EntityOp.QUERY_BY_KEY] = this.queryByKey.bind(this),
            _a[EntityOp.QUERY_BY_KEY_ERROR] = this.queryByKeyError.bind(this),
            _a[EntityOp.QUERY_BY_KEY_SUCCESS] = this.queryByKeySuccess.bind(this),
            _a[EntityOp.QUERY_LOAD] = this.queryLoad.bind(this),
            _a[EntityOp.QUERY_LOAD_ERROR] = this.queryLoadError.bind(this),
            _a[EntityOp.QUERY_LOAD_SUCCESS] = this.queryLoadSuccess.bind(this),
            _a[EntityOp.QUERY_MANY] = this.queryMany.bind(this),
            _a[EntityOp.QUERY_MANY_ERROR] = this.queryManyError.bind(this),
            _a[EntityOp.QUERY_MANY_SUCCESS] = this.queryManySuccess.bind(this),
            _a[EntityOp.SAVE_ADD_MANY] = this.saveAddMany.bind(this),
            _a[EntityOp.SAVE_ADD_MANY_ERROR] = this.saveAddManyError.bind(this),
            _a[EntityOp.SAVE_ADD_MANY_SUCCESS] = this.saveAddManySuccess.bind(this),
            _a[EntityOp.SAVE_ADD_ONE] = this.saveAddOne.bind(this),
            _a[EntityOp.SAVE_ADD_ONE_ERROR] = this.saveAddOneError.bind(this),
            _a[EntityOp.SAVE_ADD_ONE_SUCCESS] = this.saveAddOneSuccess.bind(this),
            _a[EntityOp.SAVE_DELETE_MANY] = this.saveDeleteMany.bind(this),
            _a[EntityOp.SAVE_DELETE_MANY_ERROR] = this.saveDeleteManyError.bind(this),
            _a[EntityOp.SAVE_DELETE_MANY_SUCCESS] = this.saveDeleteManySuccess.bind(this),
            _a[EntityOp.SAVE_DELETE_ONE] = this.saveDeleteOne.bind(this),
            _a[EntityOp.SAVE_DELETE_ONE_ERROR] = this.saveDeleteOneError.bind(this),
            _a[EntityOp.SAVE_DELETE_ONE_SUCCESS] = this.saveDeleteOneSuccess.bind(this),
            _a[EntityOp.SAVE_UPDATE_MANY] = this.saveUpdateMany.bind(this),
            _a[EntityOp.SAVE_UPDATE_MANY_ERROR] = this.saveUpdateManyError.bind(this),
            _a[EntityOp.SAVE_UPDATE_MANY_SUCCESS] = this.saveUpdateManySuccess.bind(this),
            _a[EntityOp.SAVE_UPDATE_ONE] = this.saveUpdateOne.bind(this),
            _a[EntityOp.SAVE_UPDATE_ONE_ERROR] = this.saveUpdateOneError.bind(this),
            _a[EntityOp.SAVE_UPDATE_ONE_SUCCESS] = this.saveUpdateOneSuccess.bind(this),
            _a[EntityOp.SAVE_UPSERT_MANY] = this.saveUpsertMany.bind(this),
            _a[EntityOp.SAVE_UPSERT_MANY_ERROR] = this.saveUpsertManyError.bind(this),
            _a[EntityOp.SAVE_UPSERT_MANY_SUCCESS] = this.saveUpsertManySuccess.bind(this),
            _a[EntityOp.SAVE_UPSERT_ONE] = this.saveUpsertOne.bind(this),
            _a[EntityOp.SAVE_UPSERT_ONE_ERROR] = this.saveUpsertOneError.bind(this),
            _a[EntityOp.SAVE_UPSERT_ONE_SUCCESS] = this.saveUpsertOneSuccess.bind(this),
            // Do nothing on save errors except turn the loading flag off.
            // See the ChangeTrackerMetaReducers
            // Or the app could listen for those errors and do something
            /// cache only operations ///
            _a[EntityOp.ADD_ALL] = this.addAll.bind(this),
            _a[EntityOp.ADD_MANY] = this.addMany.bind(this),
            _a[EntityOp.ADD_ONE] = this.addOne.bind(this),
            _a[EntityOp.REMOVE_ALL] = this.removeAll.bind(this),
            _a[EntityOp.REMOVE_MANY] = this.removeMany.bind(this),
            _a[EntityOp.REMOVE_ONE] = this.removeOne.bind(this),
            _a[EntityOp.UPDATE_MANY] = this.updateMany.bind(this),
            _a[EntityOp.UPDATE_ONE] = this.updateOne.bind(this),
            _a[EntityOp.UPSERT_MANY] = this.upsertMany.bind(this),
            _a[EntityOp.UPSERT_ONE] = this.upsertOne.bind(this),
            _a[EntityOp.COMMIT_ALL] = this.commitAll.bind(this),
            _a[EntityOp.COMMIT_MANY] = this.commitMany.bind(this),
            _a[EntityOp.COMMIT_ONE] = this.commitOne.bind(this),
            _a[EntityOp.UNDO_ALL] = this.undoAll.bind(this),
            _a[EntityOp.UNDO_MANY] = this.undoMany.bind(this),
            _a[EntityOp.UNDO_ONE] = this.undoOne.bind(this),
            _a[EntityOp.SET_CHANGE_STATE] = this.setChangeState.bind(this),
            _a[EntityOp.SET_COLLECTION] = this.setCollection.bind(this),
            _a[EntityOp.SET_FILTER] = this.setFilter.bind(this),
            _a[EntityOp.SET_LOADED] = this.setLoaded.bind(this),
            _a[EntityOp.SET_LOADING] = this.setLoading.bind(this),
            _a);
        this.adapter = definition.entityAdapter;
        this.isChangeTracking = definition.noChangeTracking !== true;
        this.selectId = definition.selectId;
        this.guard = new EntityActionGuard(entityName, this.selectId);
        this.toUpdate = toUpdateFactory(this.selectId);
        this.entityChangeTracker =
            entityChangeTracker ||
                new EntityChangeTrackerBase(this.adapter, this.selectId);
    }
    /** Cancel a persistence operation */
    EntityCollectionReducerMethods.prototype.cancelPersist = function (collection) {
        return this.setLoadingFalse(collection);
    };
    // #region query operations
    EntityCollectionReducerMethods.prototype.queryAll = function (collection) {
        return this.setLoadingTrue(collection);
    };
    EntityCollectionReducerMethods.prototype.queryAllError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     */
    EntityCollectionReducerMethods.prototype.queryAllSuccess = function (collection, action) {
        var data = this.extractData(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        return __assign(__assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loaded: true, loading: false });
    };
    EntityCollectionReducerMethods.prototype.queryByKey = function (collection, action) {
        return this.setLoadingTrue(collection);
    };
    EntityCollectionReducerMethods.prototype.queryByKeyError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    EntityCollectionReducerMethods.prototype.queryByKeySuccess = function (collection, action) {
        var data = this.extractData(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection =
            data == null
                ? collection
                : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    };
    EntityCollectionReducerMethods.prototype.queryLoad = function (collection) {
        return this.setLoadingTrue(collection);
    };
    EntityCollectionReducerMethods.prototype.queryLoadError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     */
    EntityCollectionReducerMethods.prototype.queryLoadSuccess = function (collection, action) {
        var data = this.extractData(action);
        return __assign(__assign({}, this.adapter.addAll(data, collection)), { loading: false, loaded: true, changeState: {} });
    };
    EntityCollectionReducerMethods.prototype.queryMany = function (collection, action) {
        return this.setLoadingTrue(collection);
    };
    EntityCollectionReducerMethods.prototype.queryManyError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    EntityCollectionReducerMethods.prototype.queryManySuccess = function (collection, action) {
        var data = this.extractData(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        return __assign(__assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loading: false });
    };
    // #endregion query operations
    // #region save operations
    // #region saveAddMany
    /**
     * Save multiple new entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of entities.
     * If saving optimistically, the entities must have their keys.
     */
    EntityCollectionReducerMethods.prototype.saveAddMany = function (collection, action) {
        if (this.isOptimistic(action)) {
            var entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
            collection = this.adapter.addMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to save new entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveAddManyError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    // #endregion saveAddMany
    // #region saveAddOne
    /**
     * Successfully saved new entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field),
     * and may even return additional new entities.
     * Therefore, upsert the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     * Note: saveAddManySuccess differs from saveAddOneSuccess when optimistic.
     * saveAddOneSuccess updates (not upserts) with the lone entity from the server.
     * There is no effect if the entity is not already in cache.
     * saveAddManySuccess will add an entity if it is not found in cache.
     */
    EntityCollectionReducerMethods.prototype.saveAddManySuccess = function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        var entities = this.guard.mustBeEntities(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
        }
        else {
            collection = this.entityChangeTracker.mergeSaveAdds(entities, collection, mergeStrategy);
        }
        return this.setLoadingFalse(collection);
    };
    // #endregion saveAddMany
    // #region saveAddOne
    /**
     * Save a new entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add entity immediately.
     * @param collection The collection to which the entity should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an entity.
     * If saving optimistically, the entity must have a key.
     */
    EntityCollectionReducerMethods.prototype.saveAddOne = function (collection, action) {
        if (this.isOptimistic(action)) {
            var entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
            collection = this.adapter.addOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to save a new entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entity is in the collection and
     * you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveAddOneError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully saved a new entity to the server.
     * If saved pessimistically, add the entity from the server to the collection.
     * If saved optimistically, the added entity is already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    EntityCollectionReducerMethods.prototype.saveAddOneSuccess = function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        var entity = this.guard.mustBeEntity(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            var update = this.toUpdate(entity);
            // Always update the cache with added entity returned from server
            collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, false /*never skip*/);
        }
        else {
            collection = this.entityChangeTracker.mergeSaveAdds([entity], collection, mergeStrategy);
        }
        return this.setLoadingFalse(collection);
    };
    // #endregion saveAddOne
    // #region saveAddMany
    // TODO MANY
    // #endregion saveAddMany
    // #region saveDeleteOne
    /**
     * Delete an entity from the server by key and remove it from the collection (if present).
     * If the entity is an unsaved new entity, remove it from the collection immediately
     * and skip the server delete request.
     * An optimistic save removes an existing entity from the collection immediately;
     * a pessimistic save removes it after the server confirms successful delete.
     * @param collection Will remove the entity with this key from the collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a primary key or an entity with a key;
     * this reducer extracts the key from the entity.
     */
    EntityCollectionReducerMethods.prototype.saveDeleteOne = function (collection, action) {
        var toDelete = this.extractData(action);
        var deleteId = typeof toDelete === 'object'
            ? this.selectId(toDelete)
            : toDelete;
        var change = collection.changeState[deleteId];
        // If entity is already tracked ...
        if (change) {
            if (change.changeType === ChangeType.Added) {
                // Remove the added entity immediately and forget about its changes (via commit).
                collection = this.adapter.removeOne(deleteId, collection);
                collection = this.entityChangeTracker.commitOne(deleteId, collection);
                // Should not waste effort trying to delete on the server because it can't be there.
                action.payload.skip = true;
            }
            else {
                // Re-track it as a delete, even if tracking is turned off for this call.
                collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
            }
        }
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection, mergeStrategy);
            collection = this.adapter.removeOne(deleteId, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to delete the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entity is not in the collection and
     * you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveDeleteOneError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     */
    EntityCollectionReducerMethods.prototype.saveDeleteOneSuccess = function (collection, action) {
        var deleteId = this.extractData(action);
        if (this.isOptimistic(action)) {
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes([deleteId], collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeOne(deleteId, collection);
            collection = this.entityChangeTracker.commitOne(deleteId, collection);
        }
        return this.setLoadingFalse(collection);
    };
    // #endregion saveDeleteOne
    // #region saveDeleteMany
    /**
     * Delete multiple entities from the server by key and remove them from the collection (if present).
     * Removes unsaved new entities from the collection immediately
     * but the id is still sent to the server for deletion even though the server will not find that entity.
     * Therefore, the server must be willing to ignore a delete request for an entity it cannot find.
     * An optimistic save removes existing entities from the collection immediately;
     * a pessimistic save removes them after the server confirms successful delete.
     * @param collection Removes entities from this collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of primary keys or entities with a key;
     * this reducer extracts the key from the entity.
     */
    EntityCollectionReducerMethods.prototype.saveDeleteMany = function (collection, action) {
        var _this = this;
        var deleteIds = this.extractData(action).map(function (d) { return (typeof d === 'object' ? _this.selectId(d) : d); });
        deleteIds.forEach(function (deleteId) {
            var change = collection.changeState[deleteId];
            // If entity is already tracked ...
            if (change) {
                if (change.changeType === ChangeType.Added) {
                    // Remove the added entity immediately and forget about its changes (via commit).
                    collection = _this.adapter.removeOne(deleteId, collection);
                    collection = _this.entityChangeTracker.commitOne(deleteId, collection);
                    // Should not waste effort trying to delete on the server because it can't be there.
                    action.payload.skip = true;
                }
                else {
                    // Re-track it as a delete, even if tracking is turned off for this call.
                    collection = _this.entityChangeTracker.trackDeleteOne(deleteId, collection);
                }
            }
        });
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(deleteIds, collection, mergeStrategy);
            collection = this.adapter.removeMany(deleteIds, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to delete the entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entities are not in the collection and
     * you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveDeleteManyError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     */
    EntityCollectionReducerMethods.prototype.saveDeleteManySuccess = function (collection, action) {
        var deleteIds = this.extractData(action);
        if (this.isOptimistic(action)) {
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(deleteIds, collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeMany(deleteIds, collection);
            collection = this.entityChangeTracker.commitMany(deleteIds, collection);
        }
        return this.setLoadingFalse(collection);
    };
    // #endregion saveDeleteMany
    // #region saveUpdateOne
    /**
     * Save an update to an existing entity.
     * If saving pessimistically, update the entity in the collection after the server confirms success.
     * If saving optimistically, update the entity immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an {Update<T>}
     */
    EntityCollectionReducerMethods.prototype.saveUpdateOne = function (collection, action) {
        var update = this.guard.mustBeUpdate(action);
        if (this.isOptimistic(action)) {
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
            collection = this.adapter.updateOne(update, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to update the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity in the collection is in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entity in the collection was updated
     * and you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveUpdateOneError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully saved the updated entity to the server.
     * If saved pessimistically, update the entity in the collection with data from the server.
     * If saved optimistically, the entity was already updated in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic, and
     * the update data which, must be an UpdateResponse<T> that corresponds to the Update sent to the server.
     * You must include an UpdateResponse even if the save was optimistic,
     * to ensure that the change tracking is properly reset.
     */
    EntityCollectionReducerMethods.prototype.saveUpdateOneSuccess = function (collection, action) {
        var update = this.guard.mustBeUpdateResponse(action);
        var isOptimistic = this.isOptimistic(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, isOptimistic /*skip unchanged if optimistic */);
        return this.setLoadingFalse(collection);
    };
    // #endregion saveUpdateOne
    // #region saveUpdateMany
    /**
     * Save updated entities.
     * If saving pessimistically, update the entities in the collection after the server confirms success.
     * If saving optimistically, update the entities immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of {Update<T>}.
     */
    EntityCollectionReducerMethods.prototype.saveUpdateMany = function (collection, action) {
        var updates = this.guard.mustBeUpdates(action);
        if (this.isOptimistic(action)) {
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
            collection = this.adapter.updateMany(updates, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to update entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities in the collection are in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entities in the collection were updated
     * and you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveUpdateManyError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully saved the updated entities to the server.
     * If saved pessimistically, the entities in the collection will be updated with data from the server.
     * If saved optimistically, the entities in the collection were already updated.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of UpdateResponse<T>.
     * You must include an UpdateResponse for every Update sent to the server,
     * even if the save was optimistic, to ensure that the change tracking is properly reset.
     */
    EntityCollectionReducerMethods.prototype.saveUpdateManySuccess = function (collection, action) {
        var updates = this.guard.mustBeUpdateResponses(action);
        var isOptimistic = this.isOptimistic(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates(updates, collection, mergeStrategy, false /* never skip */);
        return this.setLoadingFalse(collection);
    };
    // #endregion saveUpdateMany
    // #region saveUpsertOne
    /**
     * Save a new or existing entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entity should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a whole entity.
     * If saving optimistically, the entity must have its key.
     */
    EntityCollectionReducerMethods.prototype.saveUpsertOne = function (collection, action) {
        if (this.isOptimistic(action)) {
            var entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
            collection = this.adapter.upsertOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to save new or existing entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new or updated entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveUpsertOneError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    EntityCollectionReducerMethods.prototype.saveUpsertOneSuccess = function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        var entity = this.guard.mustBeEntity(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts([entity], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    };
    // #endregion saveUpsertOne
    // #region saveUpsertMany
    /**
     * Save multiple new or existing entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of whole entities.
     * If saving optimistically, the entities must have their keys.
     */
    EntityCollectionReducerMethods.prototype.saveUpsertMany = function (collection, action) {
        if (this.isOptimistic(action)) {
            var entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
            collection = this.adapter.upsertMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    };
    /**
     * Attempt to save new or existing entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    EntityCollectionReducerMethods.prototype.saveUpsertManyError = function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    EntityCollectionReducerMethods.prototype.saveUpsertManySuccess = function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        var entities = this.guard.mustBeEntities(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    };
    // #endregion saveUpsertMany
    // #endregion save operations
    // #region cache-only operations
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true.
     * Merges query results, preserving unsaved changes
     */
    EntityCollectionReducerMethods.prototype.addAll = function (collection, action) {
        var entities = this.guard.mustBeEntities(action);
        return __assign(__assign({}, this.adapter.addAll(entities, collection)), { loading: false, loaded: true, changeState: {} });
    };
    EntityCollectionReducerMethods.prototype.addMany = function (collection, action) {
        var entities = this.guard.mustBeEntities(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
        return this.adapter.addMany(entities, collection);
    };
    EntityCollectionReducerMethods.prototype.addOne = function (collection, action) {
        var entity = this.guard.mustBeEntity(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
        return this.adapter.addOne(entity, collection);
    };
    EntityCollectionReducerMethods.prototype.removeMany = function (collection, action) {
        // payload must be entity keys
        var keys = this.guard.mustBeKeys(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
        return this.adapter.removeMany(keys, collection);
    };
    EntityCollectionReducerMethods.prototype.removeOne = function (collection, action) {
        // payload must be entity key
        var key = this.guard.mustBeKey(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
        return this.adapter.removeOne(key, collection);
    };
    EntityCollectionReducerMethods.prototype.removeAll = function (collection, action) {
        return __assign(__assign({}, this.adapter.removeAll(collection)), { loaded: false, loading: false, changeState: {} });
    };
    EntityCollectionReducerMethods.prototype.updateMany = function (collection, action) {
        // payload must be an array of `Updates<T>`, not entities
        var updates = this.guard.mustBeUpdates(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
        return this.adapter.updateMany(updates, collection);
    };
    EntityCollectionReducerMethods.prototype.updateOne = function (collection, action) {
        // payload must be an `Update<T>`, not an entity
        var update = this.guard.mustBeUpdate(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
        return this.adapter.updateOne(update, collection);
    };
    EntityCollectionReducerMethods.prototype.upsertMany = function (collection, action) {
        // <v6: payload must be an array of `Updates<T>`, not entities
        // v6+: payload must be an array of T
        var entities = this.guard.mustBeEntities(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
        return this.adapter.upsertMany(entities, collection);
    };
    EntityCollectionReducerMethods.prototype.upsertOne = function (collection, action) {
        // <v6: payload must be an `Update<T>`, not an entity
        // v6+: payload must be a T
        var entity = this.guard.mustBeEntity(action);
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
        return this.adapter.upsertOne(entity, collection);
    };
    EntityCollectionReducerMethods.prototype.commitAll = function (collection) {
        return this.entityChangeTracker.commitAll(collection);
    };
    EntityCollectionReducerMethods.prototype.commitMany = function (collection, action) {
        return this.entityChangeTracker.commitMany(this.extractData(action), collection);
    };
    EntityCollectionReducerMethods.prototype.commitOne = function (collection, action) {
        return this.entityChangeTracker.commitOne(this.extractData(action), collection);
    };
    EntityCollectionReducerMethods.prototype.undoAll = function (collection) {
        return this.entityChangeTracker.undoAll(collection);
    };
    EntityCollectionReducerMethods.prototype.undoMany = function (collection, action) {
        return this.entityChangeTracker.undoMany(this.extractData(action), collection);
    };
    EntityCollectionReducerMethods.prototype.undoOne = function (collection, action) {
        return this.entityChangeTracker.undoOne(this.extractData(action), collection);
    };
    /** Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely. */
    EntityCollectionReducerMethods.prototype.setChangeState = function (collection, action) {
        var changeState = this.extractData(action);
        return collection.changeState === changeState
            ? collection
            : __assign(__assign({}, collection), { changeState: changeState });
    };
    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     */
    EntityCollectionReducerMethods.prototype.setCollection = function (collection, action) {
        var newCollection = this.extractData(action);
        return collection === newCollection ? collection : newCollection;
    };
    EntityCollectionReducerMethods.prototype.setFilter = function (collection, action) {
        var filter = this.extractData(action);
        return collection.filter === filter
            ? collection
            : __assign(__assign({}, collection), { filter: filter });
    };
    EntityCollectionReducerMethods.prototype.setLoaded = function (collection, action) {
        var loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : __assign(__assign({}, collection), { loaded: loaded });
    };
    EntityCollectionReducerMethods.prototype.setLoading = function (collection, action) {
        return this.setLoadingFlag(collection, this.extractData(action));
    };
    EntityCollectionReducerMethods.prototype.setLoadingFalse = function (collection) {
        return this.setLoadingFlag(collection, false);
    };
    EntityCollectionReducerMethods.prototype.setLoadingTrue = function (collection) {
        return this.setLoadingFlag(collection, true);
    };
    /** Set the collection's loading flag */
    EntityCollectionReducerMethods.prototype.setLoadingFlag = function (collection, loading) {
        loading = loading === true ? true : false;
        return collection.loading === loading
            ? collection
            : __assign(__assign({}, collection), { loading: loading });
    };
    // #endregion Cache-only operations
    // #region helpers
    /** Safely extract data from the EntityAction payload */
    EntityCollectionReducerMethods.prototype.extractData = function (action) {
        return (action.payload && action.payload.data);
    };
    /** Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked. */
    EntityCollectionReducerMethods.prototype.extractMergeStrategy = function (action) {
        // If not tracking this collection, always ignore changes
        return this.isChangeTracking
            ? action.payload && action.payload.mergeStrategy
            : MergeStrategy.IgnoreChanges;
    };
    EntityCollectionReducerMethods.prototype.isOptimistic = function (action) {
        return action.payload && action.payload.isOptimistic === true;
    };
    return EntityCollectionReducerMethods;
}());
export { EntityCollectionReducerMethods };
/**
 * Creates {EntityCollectionReducerMethods} for a given entity type.
 */
var EntityCollectionReducerMethodsFactory = /** @class */ (function () {
    function EntityCollectionReducerMethodsFactory(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /** Create the  {EntityCollectionReducerMethods} for the named entity type */
    EntityCollectionReducerMethodsFactory.prototype.create = function (entityName) {
        var definition = this.entityDefinitionService.getDefinition(entityName);
        var methodsClass = new EntityCollectionReducerMethods(entityName, definition);
        return methodsClass.methods;
    };
    EntityCollectionReducerMethodsFactory = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [EntityDefinitionService])
    ], EntityCollectionReducerMethodsFactory);
    return EntityCollectionReducerMethodsFactory;
}());
export { EntityCollectionReducerMethodsFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUVMLFVBQVUsR0FFWCxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUdyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUduRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN2RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBYzFEOztHQUVHO0FBQ0g7SUErR0Usd0NBQ1MsVUFBa0IsRUFDbEIsVUFBK0I7SUFDdEM7OztPQUdHO0lBQ0gsbUJBQTRDOztRQU5yQyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQXFCO1FBM0Z4Qzs7O1dBR0c7UUFDTSxZQUFPO1lBQ2QsR0FBQyxRQUFRLENBQUMsY0FBYyxJQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUV4RCxHQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzlDLEdBQUMsUUFBUSxDQUFDLGVBQWUsSUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUks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LElBQUksQ0FBQztZQUM1QyxHQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFDLEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsR0FBQyxRQUFRLENBQUMsV0FBVyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxHQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWhELEdBQUMsUUFBUSxDQUFDLFdBQVcsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEQsR0FBQyxRQUFRLENBQUMsVUFBVSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVoRCxHQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFaEQsR0FBQyxRQUFRLENBQUMsVUFBVSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxHQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsR0FBQyxRQUFRLENBQUMsUUFBUSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QyxHQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUcsSUFBSSxD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Q0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlBZGFwdGVyLCBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuaW1wb3J0IHtcbiAgQ2hhbmdlU3RhdGVNYXAsXG4gIENoYW5nZVR5cGUsXG4gIEVudGl0eUNvbGxlY3Rpb24sXG59IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2hhbmdlVHJhY2tlckJhc2UgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlJztcbmltcG9ydCB7IHRvVXBkYXRlRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q2hhbmdlVHJhY2tlciB9IGZyb20gJy4vZW50aXR5LWNoYW5nZS10cmFja2VyJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb24gfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24nO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIE1hcCBvZiB7RW50aXR5T3B9IHRvIHJlZHVjZXIgbWV0aG9kIGZvciB0aGUgb3BlcmF0aW9uLlxuICogSWYgYW4gb3BlcmF0aW9uIGlzIG1pc3NpbmcsIGNhbGxlciBzaG91bGQgcmV0dXJuIHRoZSBjb2xsZWN0aW9uIGZvciB0aGF0IHJlZHVjZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RNYXA8VD4ge1xuICBbbWV0aG9kOiBzdHJpbmddOiAoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApID0+IEVudGl0eUNvbGxlY3Rpb248VD47XG59XG5cbi8qKlxuICogQmFzZSBpbXBsZW1lbnRhdGlvbiBvZiByZWR1Y2VyIG1ldGhvZHMgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzPFQ+IHtcbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEVudGl0eUFkYXB0ZXI8VD47XG4gIHByb3RlY3RlZCBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG4gIC8qKiBUcnVlIGlmIHRoaXMgY29sbGVjdGlvbiB0cmFja3MgdW5zYXZlZCBjaGFuZ2VzICovXG4gIHByb3RlY3RlZCBpc0NoYW5nZVRyYWNraW5nOiBib29sZWFuO1xuXG4gIC8qKiBFeHRyYWN0IHRoZSBwcmltYXJ5IGtleSAoaWQpOyBkZWZhdWx0IHRvIGBpZGAgKi9cbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG5cbiAgLyoqXG4gICAqIFRyYWNrIGNoYW5nZXMgdG8gZW50aXRpZXMgc2luY2UgdGhlIGxhc3QgcXVlcnkgb3Igc2F2ZVxuICAgKiBDYW4gcmV2ZXJ0IHNvbWUgb3IgYWxsIG9mIHRob3NlIGNoYW5nZXNcbiAgICovXG4gIGVudGl0eUNoYW5nZVRyYWNrZXI6IEVudGl0eUNoYW5nZVRyYWNrZXI8VD47XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmAgb2JqZWN0XG4gICAqIGBpZGA6IHRoZSBwcmltYXJ5IGtleSBhbmRcbiAgICogYGNoYW5nZXNgOiB0aGUgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSBvZiBjaGFuZ2VzKS5cbiAgICovXG4gIHByb3RlY3RlZCB0b1VwZGF0ZTogKGVudGl0eTogUGFydGlhbDxUPikgPT4gVXBkYXRlPFQ+O1xuXG4gIC8qKlxuICAgKiBEaWN0aW9uYXJ5IG9mIHRoZSB7RW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzfSBmb3IgdGhpcyBlbnRpdHkgdHlwZSxcbiAgICoga2V5ZWQgYnkgdGhlIHtFbnRpdHlPcH1cbiAgICovXG4gIHJlYWRvbmx5IG1ldGhvZHM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kTWFwPFQ+ID0ge1xuICAgIFtFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVF06IHRoaXMuY2FuY2VsUGVyc2lzdC5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX0FMTF06IHRoaXMucXVlcnlBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQUxMX0VSUk9SXTogdGhpcy5xdWVyeUFsbEVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0FMTF9TVUNDRVNTXTogdGhpcy5xdWVyeUFsbFN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9CWV9LRVldOiB0aGlzLnF1ZXJ5QnlLZXkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQllfS0VZX0VSUk9SXTogdGhpcy5xdWVyeUJ5S2V5RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQllfS0VZX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5QnlLZXlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUVVFUllfTE9BRF06IHRoaXMucXVlcnlMb2FkLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0xPQURfRVJST1JdOiB0aGlzLnF1ZXJ5TG9hZEVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0xPQURfU1VDQ0VTU106IHRoaXMucXVlcnlMb2FkU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX01BTlldOiB0aGlzLnF1ZXJ5TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9NQU5ZX0VSUk9SXTogdGhpcy5xdWVyeU1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5TWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9NQU5ZXTogdGhpcy5zYXZlQWRkTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlQWRkTWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZUFkZE1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9BRERfT05FXTogdGhpcy5zYXZlQWRkT25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX09ORV9FUlJPUl06IHRoaXMuc2F2ZUFkZE9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlQWRkT25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX01BTlldOiB0aGlzLnNhdmVEZWxldGVNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX01BTllfRVJST1JdOiB0aGlzLnNhdmVEZWxldGVNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV9TVUNDRVNTXTogdGhpcy5zYXZlRGVsZXRlTWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkVdOiB0aGlzLnNhdmVEZWxldGVPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FX0VSUk9SXTogdGhpcy5zYXZlRGVsZXRlT25lRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FX1NVQ0NFU1NdOiB0aGlzLnNhdmVEZWxldGVPbmVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV06IHRoaXMuc2F2ZVVwZGF0ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZVVwZGF0ZU1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcGRhdGVNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX09ORV06IHRoaXMuc2F2ZVVwZGF0ZU9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9PTkVfRVJST1JdOiB0aGlzLnNhdmVVcGRhdGVPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZVVwZGF0ZU9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZXTogdGhpcy5zYXZlVXBzZXJ0TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlVXBzZXJ0TWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZVVwc2VydE1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FXTogdGhpcy5zYXZlVXBzZXJ0T25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX09ORV9FUlJPUl06IHRoaXMuc2F2ZVVwc2VydE9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlVXBzZXJ0T25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgLy8gRG8gbm90aGluZyBvbiBzYXZlIGVycm9ycyBleGNlcHQgdHVybiB0aGUgbG9hZGluZyBmbGFnIG9mZi5cbiAgICAvLyBTZWUgdGhlIENoYW5nZVRyYWNrZXJNZXRhUmVkdWNlcnNcbiAgICAvLyBPciB0aGUgYXBwIGNvdWxkIGxpc3RlbiBmb3IgdGhvc2UgZXJyb3JzIGFuZCBkbyBzb21ldGhpbmdcblxuICAgIC8vLyBjYWNoZSBvbmx5IG9wZXJhdGlvbnMgLy8vXG5cbiAgICBbRW50aXR5T3AuQUREX0FMTF06IHRoaXMuYWRkQWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkFERF9NQU5ZXTogdGhpcy5hZGRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkFERF9PTkVdOiB0aGlzLmFkZE9uZS5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlJFTU9WRV9BTExdOiB0aGlzLnJlbW92ZUFsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5SRU1PVkVfTUFOWV06IHRoaXMucmVtb3ZlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5SRU1PVkVfT05FXTogdGhpcy5yZW1vdmVPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5VUERBVEVfTUFOWV06IHRoaXMudXBkYXRlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VUERBVEVfT05FXTogdGhpcy51cGRhdGVPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5VUFNFUlRfTUFOWV06IHRoaXMudXBzZXJ0TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VUFNFUlRfT05FXTogdGhpcy51cHNlcnRPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5DT01NSVRfQUxMXTogdGhpcy5jb21taXRBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuQ09NTUlUX01BTlldOiB0aGlzLmNvbW1pdE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuQ09NTUlUX09ORV06IHRoaXMuY29tbWl0T25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVORE9fQUxMXTogdGhpcy51bmRvQWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVORE9fTUFOWV06IHRoaXMudW5kb01hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVU5ET19PTkVdOiB0aGlzLnVuZG9PbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TRVRfQ0hBTkdFX1NUQVRFXTogdGhpcy5zZXRDaGFuZ2VTdGF0ZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfQ09MTEVDVElPTl06IHRoaXMuc2V0Q29sbGVjdGlvbi5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfRklMVEVSXTogdGhpcy5zZXRGaWx0ZXIuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0xPQURFRF06IHRoaXMuc2V0TG9hZGVkLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNFVF9MT0FESU5HXTogdGhpcy5zZXRMb2FkaW5nLmJpbmQodGhpcyksXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgZGVmaW5pdGlvbjogRW50aXR5RGVmaW5pdGlvbjxUPixcbiAgICAvKlxuICAgICAqIFRyYWNrIGNoYW5nZXMgdG8gZW50aXRpZXMgc2luY2UgdGhlIGxhc3QgcXVlcnkgb3Igc2F2ZVxuICAgICAqIENhbiByZXZlcnQgc29tZSBvciBhbGwgb2YgdGhvc2UgY2hhbmdlc1xuICAgICAqL1xuICAgIGVudGl0eUNoYW5nZVRyYWNrZXI/OiBFbnRpdHlDaGFuZ2VUcmFja2VyPFQ+XG4gICkge1xuICAgIHRoaXMuYWRhcHRlciA9IGRlZmluaXRpb24uZW50aXR5QWRhcHRlcjtcbiAgICB0aGlzLmlzQ2hhbmdlVHJhY2tpbmcgPSBkZWZpbml0aW9uLm5vQ2hhbmdlVHJhY2tpbmcgIT09IHRydWU7XG4gICAgdGhpcy5zZWxlY3RJZCA9IGRlZmluaXRpb24uc2VsZWN0SWQ7XG5cbiAgICB0aGlzLmd1YXJkID0gbmV3IEVudGl0eUFjdGlvbkd1YXJkKGVudGl0eU5hbWUsIHRoaXMuc2VsZWN0SWQpO1xuICAgIHRoaXMudG9VcGRhdGUgPSB0b1VwZGF0ZUZhY3RvcnkodGhpcy5zZWxlY3RJZCk7XG5cbiAgICB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIgPVxuICAgICAgZW50aXR5Q2hhbmdlVHJhY2tlciB8fFxuICAgICAgbmV3IEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlPFQ+KHRoaXMuYWRhcHRlciwgdGhpcy5zZWxlY3RJZCk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uICovXG4gIHByb3RlY3RlZCBjYW5jZWxQZXJzaXN0KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBxdWVyeSBvcGVyYXRpb25zXG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUFsbEVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlcyBxdWVyeSByZXN1bHRzIHBlciB0aGUgTWVyZ2VTdHJhdGVneVxuICAgKiBTZXRzIGxvYWRpbmcgZmxhZyB0byBmYWxzZSBhbmQgbG9hZGVkIGZsYWcgdG8gdHJ1ZS5cbiAgICovXG4gIHByb3RlY3RlZCBxdWVyeUFsbFN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlUXVlcnlSZXN1bHRzKFxuICAgICAgICBkYXRhLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApLFxuICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUJ5S2V5KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUJ5S2V5RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlCeUtleVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9XG4gICAgICBkYXRhID09IG51bGxcbiAgICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICAgIDogdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlUXVlcnlSZXN1bHRzKFxuICAgICAgICAgICAgW2RhdGFdLFxuICAgICAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUxvYWQoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TG9hZEVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBTZXRzIGxvYWRlZCBmbGFnIHRvIHRydWUsIGxvYWRpbmcgZmxhZyB0byBmYWxzZSxcbiAgICogYW5kIGNsZWFycyBjaGFuZ2VTdGF0ZSBmb3IgdGhlIGVudGlyZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHF1ZXJ5TG9hZFN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuYWRhcHRlci5hZGRBbGwoZGF0YSwgY29sbGVjdGlvbiksXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlUXVlcnlSZXN1bHRzKFxuICAgICAgICBkYXRhLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHF1ZXJ5IG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE1hbnlcbiAgLyoqXG4gICAqIFNhdmUgbXVsdGlwbGUgbmV3IGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCBkZWxheSBhZGRpbmcgdG8gY29sbGVjdGlvbiB1bnRpbCBzZXJ2ZXIgYWNrbm93bGVkZ2VzIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseTsgYWRkIGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXRpZXMgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gYXJyYXkgb2YgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIG11c3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE1hbnkoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5hZGRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIG5ldyBlbnRpdGllcyBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIG5ldyBlbnRpdGllcyBhcmUgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0aWVzIGFyZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkTWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVBZGRPbmVcbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCBuZXcgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBhZGQgdGhlIGVudGl0aWVzIGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdGllcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpLFxuICAgKiBhbmQgbWF5IGV2ZW4gcmV0dXJuIGFkZGl0aW9uYWwgbmV3IGVudGl0aWVzLlxuICAgKiBUaGVyZWZvcmUsIHVwc2VydCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgYWRkIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICogTm90ZTogc2F2ZUFkZE1hbnlTdWNjZXNzIGRpZmZlcnMgZnJvbSBzYXZlQWRkT25lU3VjY2VzcyB3aGVuIG9wdGltaXN0aWMuXG4gICAqIHNhdmVBZGRPbmVTdWNjZXNzIHVwZGF0ZXMgKG5vdCB1cHNlcnRzKSB3aXRoIHRoZSBsb25lIGVudGl0eSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIFRoZXJlIGlzIG5vIGVmZmVjdCBpZiB0aGUgZW50aXR5IGlzIG5vdCBhbHJlYWR5IGluIGNhY2hlLlxuICAgKiBzYXZlQWRkTWFueVN1Y2Nlc3Mgd2lsbCBhZGQgYW4gZW50aXR5IGlmIGl0IGlzIG5vdCBmb3VuZCBpbiBjYWNoZS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkTWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIC8vIEZvciBwZXNzaW1pc3RpYyBzYXZlLCBlbnN1cmUgdGhlIHNlcnZlciBnZW5lcmF0ZWQgdGhlIHByaW1hcnkga2V5IGlmIHRoZSBjbGllbnQgZGlkbid0IHNlbmQgb25lLlxuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlQWRkcyhcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVBZGRNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkT25lXG4gIC8qKlxuICAgKiBTYXZlIGEgbmV3IGVudGl0eS5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBlbnRpdHkgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdHkgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgbXVzdCBoYXZlIGEga2V5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTsgLy8gZW5zdXJlIHRoZSBlbnRpdHkgaGFzIGEgUEtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkT25lKFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLmFkZE9uZShlbnRpdHksIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHNhdmUgYSBuZXcgZW50aXR5IGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0eSBpcyBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIHVuc2F2ZWQgZW50aXR5IGlzIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgYSBuZXcgZW50aXR5IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdHkgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0eSBpcyBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZSAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+ID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgICAgLy8gQWx3YXlzIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCBhZGRlZCBlbnRpdHkgcmV0dXJuZWQgZnJvbSBzZXJ2ZXJcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBkYXRlcyhcbiAgICAgICAgW3VwZGF0ZV0sXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgIGZhbHNlIC8qbmV2ZXIgc2tpcCovXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZUFkZHMoXG4gICAgICAgIFtlbnRpdHldLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkT25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkTWFueVxuICAvLyBUT0RPIE1BTllcbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZURlbGV0ZU9uZVxuICAvKipcbiAgICogRGVsZXRlIGFuIGVudGl0eSBmcm9tIHRoZSBzZXJ2ZXIgYnkga2V5IGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgY29sbGVjdGlvbiAoaWYgcHJlc2VudCkuXG4gICAqIElmIHRoZSBlbnRpdHkgaXMgYW4gdW5zYXZlZCBuZXcgZW50aXR5LCByZW1vdmUgaXQgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseVxuICAgKiBhbmQgc2tpcCB0aGUgc2VydmVyIGRlbGV0ZSByZXF1ZXN0LlxuICAgKiBBbiBvcHRpbWlzdGljIHNhdmUgcmVtb3ZlcyBhbiBleGlzdGluZyBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseTtcbiAgICogYSBwZXNzaW1pc3RpYyBzYXZlIHJlbW92ZXMgaXQgYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzZnVsIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gV2lsbCByZW1vdmUgdGhlIGVudGl0eSB3aXRoIHRoaXMga2V5IGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhIHByaW1hcnkga2V5IG9yIGFuIGVudGl0eSB3aXRoIGEga2V5O1xuICAgKiB0aGlzIHJlZHVjZXIgZXh0cmFjdHMgdGhlIGtleSBmcm9tIHRoZSBlbnRpdHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZyB8IFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHRvRGVsZXRlID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IGRlbGV0ZUlkID1cbiAgICAgIHR5cGVvZiB0b0RlbGV0ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgPyB0aGlzLnNlbGVjdElkKHRvRGVsZXRlKVxuICAgICAgICA6ICh0b0RlbGV0ZSBhcyBzdHJpbmcgfCBudW1iZXIpO1xuICAgIGNvbnN0IGNoYW5nZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGVbZGVsZXRlSWRdO1xuICAgIC8vIElmIGVudGl0eSBpcyBhbHJlYWR5IHRyYWNrZWQgLi4uXG4gICAgaWYgKGNoYW5nZSkge1xuICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgYWRkZWQgZW50aXR5IGltbWVkaWF0ZWx5IGFuZCBmb3JnZXQgYWJvdXQgaXRzIGNoYW5nZXMgKHZpYSBjb21taXQpLlxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShkZWxldGVJZCBhcyBzdHJpbmcsIGNvbGxlY3Rpb24pO1xuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShkZWxldGVJZCwgY29sbGVjdGlvbik7XG4gICAgICAgIC8vIFNob3VsZCBub3Qgd2FzdGUgZWZmb3J0IHRyeWluZyB0byBkZWxldGUgb24gdGhlIHNlcnZlciBiZWNhdXNlIGl0IGNhbid0IGJlIHRoZXJlLlxuICAgICAgICBhY3Rpb24ucGF5bG9hZC5za2lwID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFJlLXRyYWNrIGl0IGFzIGEgZGVsZXRlLCBldmVuIGlmIHRyYWNraW5nIGlzIHR1cm5lZCBvZmYgZm9yIHRoaXMgY2FsbC5cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgICAgICBkZWxldGVJZCxcbiAgICAgICAgICBjb2xsZWN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgb3B0aW1pc3RpYyBkZWxldGUsIHRyYWNrIGN1cnJlbnQgc3RhdGUgYW5kIHJlbW92ZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICAgIGRlbGV0ZUlkLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIGRlbGV0ZSB0aGUgZW50aXR5IG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGNvdWxkIHN0aWxsIGJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaXMgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgZGVsZXRlZCBlbnRpdHkgb24gdGhlIHNlcnZlci4gVGhlIGtleSBvZiB0aGUgZGVsZXRlZCBlbnRpdHkgaXMgaW4gdGhlIGFjdGlvbiBwYXlsb2FkIGRhdGEuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgaWYgdGhlIGVudGl0eSBpcyBzdGlsbCBpbiB0aGUgY29sbGVjdGlvbiBpdCB3aWxsIGJlIHJlbW92ZWQuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGhhcyBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkZWxldGVJZCA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlRGVsZXRlcyhcbiAgICAgICAgW2RlbGV0ZUlkXSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUGVzc2ltaXN0aWM6IGlnbm9yZSBtZXJnZVN0cmF0ZWd5LiBSZW1vdmUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb24gYW5kIGZyb20gY2hhbmdlIHRyYWNraW5nLlxuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0T25lKGRlbGV0ZUlkLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZURlbGV0ZU9uZVxuXG4gIC8vICNyZWdpb24gc2F2ZURlbGV0ZU1hbnlcbiAgLyoqXG4gICAqIERlbGV0ZSBtdWx0aXBsZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgYnkga2V5IGFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBjb2xsZWN0aW9uIChpZiBwcmVzZW50KS5cbiAgICogUmVtb3ZlcyB1bnNhdmVkIG5ldyBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5XG4gICAqIGJ1dCB0aGUgaWQgaXMgc3RpbGwgc2VudCB0byB0aGUgc2VydmVyIGZvciBkZWxldGlvbiBldmVuIHRob3VnaCB0aGUgc2VydmVyIHdpbGwgbm90IGZpbmQgdGhhdCBlbnRpdHkuXG4gICAqIFRoZXJlZm9yZSwgdGhlIHNlcnZlciBtdXN0IGJlIHdpbGxpbmcgdG8gaWdub3JlIGEgZGVsZXRlIHJlcXVlc3QgZm9yIGFuIGVudGl0eSBpdCBjYW5ub3QgZmluZC5cbiAgICogQW4gb3B0aW1pc3RpYyBzYXZlIHJlbW92ZXMgZXhpc3RpbmcgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseTtcbiAgICogYSBwZXNzaW1pc3RpYyBzYXZlIHJlbW92ZXMgdGhlbSBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHN1Y2Nlc3NmdWwgZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBSZW1vdmVzIGVudGl0aWVzIGZyb20gdGhpcyBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gYXJyYXkgb2YgcHJpbWFyeSBrZXlzIG9yIGVudGl0aWVzIHdpdGggYSBrZXk7XG4gICAqIHRoaXMgcmVkdWNlciBleHRyYWN0cyB0aGUga2V5IGZyb20gdGhlIGVudGl0eS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPChudW1iZXIgfCBzdHJpbmcgfCBUKVtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkZWxldGVJZHMgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbikubWFwKFxuICAgICAgZCA9PiAodHlwZW9mIGQgPT09ICdvYmplY3QnID8gdGhpcy5zZWxlY3RJZChkKSA6IChkIGFzIHN0cmluZyB8IG51bWJlcikpXG4gICAgKTtcbiAgICBkZWxldGVJZHMuZm9yRWFjaChkZWxldGVJZCA9PiB7XG4gICAgICBjb25zdCBjaGFuZ2UgPSBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlW2RlbGV0ZUlkXTtcbiAgICAgIC8vIElmIGVudGl0eSBpcyBhbHJlYWR5IHRyYWNrZWQgLi4uXG4gICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgIGlmIChjaGFuZ2UuY2hhbmdlVHlwZSA9PT0gQ2hhbmdlVHlwZS5BZGRlZCkge1xuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYWRkZWQgZW50aXR5IGltbWVkaWF0ZWx5IGFuZCBmb3JnZXQgYWJvdXQgaXRzIGNoYW5nZXMgKHZpYSBjb21taXQpLlxuICAgICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGRlbGV0ZUlkIGFzIHN0cmluZywgY29sbGVjdGlvbik7XG4gICAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRPbmUoZGVsZXRlSWQsIGNvbGxlY3Rpb24pO1xuICAgICAgICAgIC8vIFNob3VsZCBub3Qgd2FzdGUgZWZmb3J0IHRyeWluZyB0byBkZWxldGUgb24gdGhlIHNlcnZlciBiZWNhdXNlIGl0IGNhbid0IGJlIHRoZXJlLlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkLnNraXAgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlLXRyYWNrIGl0IGFzIGEgZGVsZXRlLCBldmVuIGlmIHRyYWNraW5nIGlzIHR1cm5lZCBvZmYgZm9yIHRoaXMgY2FsbC5cbiAgICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlT25lKFxuICAgICAgICAgICAgZGVsZXRlSWQsXG4gICAgICAgICAgICBjb2xsZWN0aW9uXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIElmIG9wdGltaXN0aWMgZGVsZXRlLCB0cmFjayBjdXJyZW50IHN0YXRlIGFuZCByZW1vdmUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlTWFueShcbiAgICAgICAgZGVsZXRlSWRzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KGRlbGV0ZUlkcyBhcyBzdHJpbmdbXSwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gZGVsZXRlIHRoZSBlbnRpdGllcyBvbiB0aGUgc2VydmVyIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGNvdWxkIHN0aWxsIGJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBhcmUgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVNYW55RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgZW50aXRpZXMgb24gdGhlIHNlcnZlci4gVGhlIGtleXMgb2YgdGhlIGRlbGV0ZWQgZW50aXRpZXMgYXJlIGluIHRoZSBhY3Rpb24gcGF5bG9hZCBkYXRhLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGVudGl0aWVzIHRoYXQgYXJlIHN0aWxsIGluIHRoZSBjb2xsZWN0aW9uIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248KG51bWJlciB8IHN0cmluZylbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGVsZXRlSWRzID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVEZWxldGVzKFxuICAgICAgICBkZWxldGVJZHMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFBlc3NpbWlzdGljOiBpZ25vcmUgbWVyZ2VTdHJhdGVneS4gUmVtb3ZlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uIGFuZCBmcm9tIGNoYW5nZSB0cmFja2luZy5cbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShkZWxldGVJZHMgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRNYW55KGRlbGV0ZUlkcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVEZWxldGVNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlVXBkYXRlT25lXG4gIC8qKlxuICAgKiBTYXZlIGFuIHVwZGF0ZSB0byBhbiBleGlzdGluZyBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0eSBpbW1lZGlhdGVseSwgYmVmb3JlIHRoZSBzYXZlIHJlcXVlc3QuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgaWYgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhIHdoaWNoLCBtdXN0IGJlIGFuIHtVcGRhdGU8VD59XG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGUoYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcGRhdGVPbmUoXG4gICAgICAgIHVwZGF0ZSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBkYXRlT25lKHVwZGF0ZSwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gdXBkYXRlIHRoZSBlbnRpdHkgb24gdGhlIHNlcnZlciBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaXMgaW4gdGhlIHByZS1zYXZlIHN0YXRlXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3YXMgdXBkYXRlZFxuICAgKiBhbmQgeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlT25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIHRoZSB1cGRhdGVkIGVudGl0eSB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IHdhcyBhbHJlYWR5IHVwZGF0ZWQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgdXBkYXRlIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLCBhbmRcbiAgICogdGhlIHVwZGF0ZSBkYXRhIHdoaWNoLCBtdXN0IGJlIGFuIFVwZGF0ZVJlc3BvbnNlPFQ+IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIFVwZGF0ZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIFlvdSBtdXN0IGluY2x1ZGUgYW4gVXBkYXRlUmVzcG9uc2UgZXZlbiBpZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYyxcbiAgICogdG8gZW5zdXJlIHRoYXQgdGhlIGNoYW5nZSB0cmFja2luZyBpcyBwcm9wZXJseSByZXNldC5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlT25lU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVSZXNwb25zZShhY3Rpb24pO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9IHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgICBbdXBkYXRlXSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgaXNPcHRpbWlzdGljIC8qc2tpcCB1bmNoYW5nZWQgaWYgb3B0aW1pc3RpYyAqL1xuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZVVwZGF0ZU9uZVxuXG4gIC8vICNyZWdpb24gc2F2ZVVwZGF0ZU1hbnlcbiAgLyoqXG4gICAqIFNhdmUgdXBkYXRlZCBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdGllcyBpbW1lZGlhdGVseSwgYmVmb3JlIHRoZSBzYXZlIHJlcXVlc3QuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgaWYgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhIHdoaWNoLCBtdXN0IGJlIGFuIGFycmF5IG9mIHtVcGRhdGU8VD59LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+W10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZXMoYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcGRhdGVNYW55KFxuICAgICAgICB1cGRhdGVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHVwZGF0ZSBlbnRpdGllcyBvbiB0aGUgc2VydmVyIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIGFyZSBpbiB0aGUgcHJlLXNhdmUgc3RhdGVcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2VyZSB1cGRhdGVkXG4gICAqIGFuZCB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVNYW55RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIHRoZSB1cGRhdGVkIGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpbGwgYmUgdXBkYXRlZCB3aXRoIGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdlcmUgYWxyZWFkeSB1cGRhdGVkLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZXMgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyB1cGRhdGUgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiBhcnJheSBvZiBVcGRhdGVSZXNwb25zZTxUPi5cbiAgICogWW91IG11c3QgaW5jbHVkZSBhbiBVcGRhdGVSZXNwb25zZSBmb3IgZXZlcnkgVXBkYXRlIHNlbnQgdG8gdGhlIHNlcnZlcixcbiAgICogZXZlbiBpZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgdG8gZW5zdXJlIHRoYXQgdGhlIGNoYW5nZSB0cmFja2luZyBpcyBwcm9wZXJseSByZXNldC5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlTWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD5bXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgdXBkYXRlcyA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlUmVzcG9uc2VzKGFjdGlvbik7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID0gdGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBkYXRlcyhcbiAgICAgIHVwZGF0ZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIGZhbHNlIC8qIG5ldmVyIHNraXAgKi9cbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcGRhdGVNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlVXBzZXJ0T25lXG4gIC8qKlxuICAgKiBTYXZlIGEgbmV3IG9yIGV4aXN0aW5nIGVudGl0eS5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBpbW1lZGlhdGVseS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gd2hpY2ggdGhlIGVudGl0eSBzaG91bGQgYmUgdXBzZXJ0ZWQuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhIHdob2xlIGVudGl0eS5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IG11c3QgaGF2ZSBpdHMga2V5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTsgLy8gZW5zdXJlIHRoZSBlbnRpdHkgaGFzIGEgUEtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0T25lKFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE9uZShlbnRpdHksIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHNhdmUgbmV3IG9yIGV4aXN0aW5nIGVudGl0eSBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIG5ldyBvciB1cGRhdGVkIGVudGl0eSBpcyBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIHVuc2F2ZWQgZW50aXRpZXMgYXJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgYWRkZWQgZW50aXRpZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgYWRkIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0T25lU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICkge1xuICAgIC8vIEZvciBwZXNzaW1pc3RpYyBzYXZlLCBlbnN1cmUgdGhlIHNlcnZlciBnZW5lcmF0ZWQgdGhlIHByaW1hcnkga2V5IGlmIHRoZSBjbGllbnQgZGlkbid0IHNlbmQgb25lLlxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAvLyBBbHdheXMgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHVwc2VydGVkIGVudGl0aWVzIHJldHVybmVkIGZyb20gc2VydmVyXG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcHNlcnRzKFxuICAgICAgW2VudGl0eV0sXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZVVwc2VydE9uZVxuXG4gIC8vICNyZWdpb24gc2F2ZVVwc2VydE1hbnlcbiAgLyoqXG4gICAqIFNhdmUgbXVsdGlwbGUgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCBkZWxheSBhZGRpbmcgdG8gY29sbGVjdGlvbiB1bnRpbCBzZXJ2ZXIgYWNrbm93bGVkZ2VzIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseTsgYWRkIGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXRpZXMgc2hvdWxkIGJlIHVwc2VydGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gYXJyYXkgb2Ygd2hvbGUgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIG11c3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1Vwc2VydE1hbnkoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIG5ldyBlbnRpdGllcyBhcmUgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0aWVzIGFyZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0TWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBhZGQgdGhlIGVudGl0aWVzIGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdGllcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZXMgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyBhZGQgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKSB7XG4gICAgLy8gRm9yIHBlc3NpbWlzdGljIHNhdmUsIGVuc3VyZSB0aGUgc2VydmVyIGdlbmVyYXRlZCB0aGUgcHJpbWFyeSBrZXkgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc2VuZCBvbmUuXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAvLyBBbHdheXMgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHVwc2VydGVkIGVudGl0aWVzIHJldHVybmVkIGZyb20gc2VydmVyXG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZVVwc2VydE1hbnlcblxuICAvLyAjZW5kcmVnaW9uIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gY2FjaGUtb25seSBvcGVyYXRpb25zXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBTZXRzIGxvYWRlZCBmbGFnIHRvIHRydWUuXG4gICAqIE1lcmdlcyBxdWVyeSByZXN1bHRzLCBwcmVzZXJ2aW5nIHVuc2F2ZWQgY2hhbmdlc1xuICAgKi9cbiAgcHJvdGVjdGVkIGFkZEFsbChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuYWRhcHRlci5hZGRBbGwoZW50aXRpZXMsIGNvbGxlY3Rpb24pLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VTdGF0ZToge30sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhZGRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tBZGRNYW55KFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5hZGRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhZGRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE9uZShcbiAgICAgIGVudGl0eSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmFkZE9uZShlbnRpdHksIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbW92ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXJbXSB8IHN0cmluZ1tdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyBwYXlsb2FkIG11c3QgYmUgZW50aXR5IGtleXNcbiAgICBjb25zdCBrZXlzID0gdGhpcy5ndWFyZC5tdXN0QmVLZXlzKGFjdGlvbikgYXMgc3RyaW5nW107XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlTWFueShcbiAgICAgIGtleXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KGtleXMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbW92ZU9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZz5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGVudGl0eSBrZXlcbiAgICBjb25zdCBrZXkgPSB0aGlzLmd1YXJkLm11c3RCZUtleShhY3Rpb24pIGFzIHN0cmluZztcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICBrZXksXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoa2V5LCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW1vdmVBbGwoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5hZGFwdGVyLnJlbW92ZUFsbChjb2xsZWN0aW9uKSxcbiAgICAgIGxvYWRlZDogZmFsc2UsIC8vIE9ubHkgUkVNT1ZFX0FMTCBzZXRzIGxvYWRlZCB0byBmYWxzZVxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICBjaGFuZ2VTdGF0ZToge30sIC8vIEFzc3VtZSBjbGVhcmluZyB0aGUgY29sbGVjdGlvbiBhbmQgbm90IHRyeWluZyB0byBkZWxldGUgYWxsIGVudGl0aWVzXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+W10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBhbiBhcnJheSBvZiBgVXBkYXRlczxUPmAsIG5vdCBlbnRpdGllc1xuICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcGRhdGVNYW55KFxuICAgICAgdXBkYXRlcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyBwYXlsb2FkIG11c3QgYmUgYW4gYFVwZGF0ZTxUPmAsIG5vdCBhbiBlbnRpdHlcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU9uZShcbiAgICAgIHVwZGF0ZSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU9uZSh1cGRhdGUsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwc2VydE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIDx2NjogcGF5bG9hZCBtdXN0IGJlIGFuIGFycmF5IG9mIGBVcGRhdGVzPFQ+YCwgbm90IGVudGl0aWVzXG4gICAgLy8gdjYrOiBwYXlsb2FkIG11c3QgYmUgYW4gYXJyYXkgb2YgVFxuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1Vwc2VydE1hbnkoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwc2VydE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIDx2NjogcGF5bG9hZCBtdXN0IGJlIGFuIGBVcGRhdGU8VD5gLCBub3QgYW4gZW50aXR5XG4gICAgLy8gdjYrOiBwYXlsb2FkIG11c3QgYmUgYSBUXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRPbmUoXG4gICAgICBlbnRpdHksXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cHNlcnRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21taXRBbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPikge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0QWxsKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbW1pdE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0TWFueShcbiAgICAgIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSxcbiAgICAgIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbW1pdE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0T25lKFxuICAgICAgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5kb0FsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci51bmRvQWxsKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVuZG9NYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnVuZG9NYW55KFxuICAgICAgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5kb09uZShjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LCBhY3Rpb246IEVudGl0eUFjdGlvbjxUPikge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudW5kb09uZShcbiAgICAgIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSxcbiAgICAgIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgLyoqIERhbmdlcm91czogQ29tcGxldGVseSByZXBsYWNlIHRoZSBjb2xsZWN0aW9uJ3MgQ2hhbmdlU3RhdGUuIFVzZSByYXJlbHkgYW5kIHdpc2VseS4gKi9cbiAgcHJvdGVjdGVkIHNldENoYW5nZVN0YXRlKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248Q2hhbmdlU3RhdGVNYXA8VD4+XG4gICkge1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlID09PSBjaGFuZ2VTdGF0ZVxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEYW5nZXJvdXM6IENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgY29sbGVjdGlvbi5cbiAgICogUHJpbWFyaWx5IGZvciB0ZXN0aW5nIGFuZCByZWh5ZHJhdGlvbiBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAqIFVzZSByYXJlbHkgYW5kIHdpc2VseS5cbiAgICovXG4gIHByb3RlY3RlZCBzZXRDb2xsZWN0aW9uKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5Q29sbGVjdGlvbjxUPj5cbiAgKSB7XG4gICAgY29uc3QgbmV3Q29sbGVjdGlvbiA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbiA9PT0gbmV3Q29sbGVjdGlvbiA/IGNvbGxlY3Rpb24gOiBuZXdDb2xsZWN0aW9uO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldEZpbHRlcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPGFueT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbHRlciA9PT0gZmlsdGVyXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBmaWx0ZXIgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMb2FkZWQoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxib29sZWFuPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBsb2FkZWQgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbikgPT09IHRydWUgfHwgZmFsc2U7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24ubG9hZGVkID09PSBsb2FkZWRcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGxvYWRlZCB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldExvYWRpbmcoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxib29sZWFuPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uLCB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbikpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldExvYWRpbmdGYWxzZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGbGFnKGNvbGxlY3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nVHJ1ZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGbGFnKGNvbGxlY3Rpb24sIHRydWUpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgY29sbGVjdGlvbidzIGxvYWRpbmcgZmxhZyAqL1xuICBwcm90ZWN0ZWQgc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPiwgbG9hZGluZzogYm9vbGVhbikge1xuICAgIGxvYWRpbmcgPSBsb2FkaW5nID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmxvYWRpbmcgPT09IGxvYWRpbmdcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGxvYWRpbmcgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIENhY2hlLW9ubHkgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gaGVscGVyc1xuICAvKiogU2FmZWx5IGV4dHJhY3QgZGF0YSBmcm9tIHRoZSBFbnRpdHlBY3Rpb24gcGF5bG9hZCAqL1xuICBwcm90ZWN0ZWQgZXh0cmFjdERhdGE8RCA9IGFueT4oYWN0aW9uOiBFbnRpdHlBY3Rpb248RD4pOiBEIHtcbiAgICByZXR1cm4gKGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmRhdGEpIGFzIEQ7XG4gIH1cblxuICAvKiogU2FmZWx5IGV4dHJhY3QgTWVyZ2VTdHJhdGVneSBmcm9tIEVudGl0eUFjdGlvbi4gU2V0IHRvIElnbm9yZUNoYW5nZXMgaWYgY29sbGVjdGlvbiBpdHNlbGYgaXMgbm90IHRyYWNrZWQuICovXG4gIHByb3RlY3RlZCBleHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIC8vIElmIG5vdCB0cmFja2luZyB0aGlzIGNvbGxlY3Rpb24sIGFsd2F5cyBpZ25vcmUgY2hhbmdlc1xuICAgIHJldHVybiB0aGlzLmlzQ2hhbmdlVHJhY2tpbmdcbiAgICAgID8gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQubWVyZ2VTdHJhdGVneVxuICAgICAgOiBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNPcHRpbWlzdGljKGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmlzT3B0aW1pc3RpYyA9PT0gdHJ1ZTtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuXG4vKipcbiAqIENyZWF0ZXMge0VudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc30gZm9yIGEgZ2l2ZW4gZW50aXR5IHR5cGUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlEZWZpbml0aW9uU2VydmljZTogRW50aXR5RGVmaW5pdGlvblNlcnZpY2UpIHt9XG5cbiAgLyoqIENyZWF0ZSB0aGUgIHtFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHN9IGZvciB0aGUgbmFtZWQgZW50aXR5IHR5cGUgKi9cbiAgY3JlYXRlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kTWFwPFQ+IHtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uPFQ+KFxuICAgICAgZW50aXR5TmFtZVxuICAgICk7XG4gICAgY29uc3QgbWV0aG9kc0NsYXNzID0gbmV3IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kcyhcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICBkZWZpbml0aW9uXG4gICAgKTtcblxuICAgIHJldHVybiBtZXRob2RzQ2xhc3MubWV0aG9kcztcbiAgfVxufVxuIl19