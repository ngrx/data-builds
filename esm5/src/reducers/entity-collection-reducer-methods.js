import * as tslib_1 from "tslib";
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
        return tslib_1.__assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy), { loaded: true, loading: false });
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
        return tslib_1.__assign({}, this.adapter.addAll(data, collection), { loading: false, loaded: true, changeState: {} });
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
        return tslib_1.__assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy), { loading: false });
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
        return tslib_1.__assign({}, this.adapter.addAll(entities, collection), { loading: false, loaded: true, changeState: {} });
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
        return tslib_1.__assign({}, this.adapter.removeAll(collection), { loaded: false, loading: false, changeState: {} });
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
            : tslib_1.__assign({}, collection, { changeState: changeState });
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
            : tslib_1.__assign({}, collection, { filter: filter });
    };
    EntityCollectionReducerMethods.prototype.setLoaded = function (collection, action) {
        var loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : tslib_1.__assign({}, collection, { loaded: loaded });
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
            : tslib_1.__assign({}, collection, { loading: loading });
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
    EntityCollectionReducerMethodsFactory = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [EntityDefinitionService])
    ], EntityCollectionReducerMethodsFactory);
    return EntityCollectionReducerMethodsFactory;
}());
export { EntityCollectionReducerMethodsFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPM0MsT0FBTyxFQUVMLFVBQVUsR0FFWCxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBbUIsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFHbkUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQWMxRDs7R0FFRztBQUNIO0lBK0dFLHdDQUNTLFVBQWtCLEVBQ2xCLFVBQStCO0lBQ3RDOzs7T0FHRztJQUNILG1CQUE0Qzs7UUFOckMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFxQjtRQTNGeEM7OztXQUdHO1FBQ00sWUFBTztZQUNkLEdBQUMsUUFBUSxDQUFDLGNBQWMsSUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEQsR0FBQyxRQUFRLENBQUMsU0FBUyxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM5QyxHQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJ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QyxJQUFJLENBQUM7WUFDNUMsR0FBQyxRQUFRLENBQUMsT0FBTyxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUUxQyxHQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hELEdBQUMsUUFBUSxDQUFDLFdBQVcsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEQsR0FBQyxRQUFRLENBQUMsVUFBVSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVoRCxHQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFaEQsR0FBQyxRQUFRLENBQUMsV0FBVyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxHQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWhELEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsR0FBQyxRQUFRLENBQUMsV0FBVyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxHQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hELEdBQUMsUUFBUSxDQUFDLFFBQVEsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUMsR0FBQyxRQUFRLENBQUMsU0FBUyxJQUFHLElBQUks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cUNBQXFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBFbnRpdHlBZGFwdGVyLCBEaWN0aW9uYXJ5LCBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU3RhdGVNYXAsXG4gIENoYW5nZVR5cGUsXG4gIEVudGl0eUNvbGxlY3Rpb24sXG59IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2hhbmdlVHJhY2tlckJhc2UgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCwgdG9VcGRhdGVGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25HdWFyZCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1ndWFyZCc7XG5pbXBvcnQgeyBFbnRpdHlDaGFuZ2VUcmFja2VyIH0gZnJvbSAnLi9lbnRpdHktY2hhbmdlLXRyYWNrZXInO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvbiB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogTWFwIG9mIHtFbnRpdHlPcH0gdG8gcmVkdWNlciBtZXRob2QgZm9yIHRoZSBvcGVyYXRpb24uXG4gKiBJZiBhbiBvcGVyYXRpb24gaXMgbWlzc2luZywgY2FsbGVyIHNob3VsZCByZXR1cm4gdGhlIGNvbGxlY3Rpb24gZm9yIHRoYXQgcmVkdWNlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZE1hcDxUPiB7XG4gIFttZXRob2Q6IHN0cmluZ106IChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICkgPT4gRW50aXR5Q29sbGVjdGlvbjxUPjtcbn1cblxuLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIHJlZHVjZXIgbWV0aG9kcyBmb3IgYW4gZW50aXR5IGNvbGxlY3Rpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHM8VD4ge1xuICBwcm90ZWN0ZWQgYWRhcHRlcjogRW50aXR5QWRhcHRlcjxUPjtcbiAgcHJvdGVjdGVkIGd1YXJkOiBFbnRpdHlBY3Rpb25HdWFyZDxUPjtcbiAgLyoqIFRydWUgaWYgdGhpcyBjb2xsZWN0aW9uIHRyYWNrcyB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgcHJvdGVjdGVkIGlzQ2hhbmdlVHJhY2tpbmc6IGJvb2xlYW47XG5cbiAgLyoqIEV4dHJhY3QgdGhlIHByaW1hcnkga2V5IChpZCk7IGRlZmF1bHQgdG8gYGlkYCAqL1xuICBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPjtcblxuICAvKipcbiAgICogVHJhY2sgY2hhbmdlcyB0byBlbnRpdGllcyBzaW5jZSB0aGUgbGFzdCBxdWVyeSBvciBzYXZlXG4gICAqIENhbiByZXZlcnQgc29tZSBvciBhbGwgb2YgdGhvc2UgY2hhbmdlc1xuICAgKi9cbiAgZW50aXR5Q2hhbmdlVHJhY2tlcjogRW50aXR5Q2hhbmdlVHJhY2tlcjxUPjtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YCBvYmplY3RcbiAgICogYGlkYDogdGhlIHByaW1hcnkga2V5IGFuZFxuICAgKiBgY2hhbmdlc2A6IHRoZSBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5IG9mIGNoYW5nZXMpLlxuICAgKi9cbiAgcHJvdGVjdGVkIHRvVXBkYXRlOiAoZW50aXR5OiBQYXJ0aWFsPFQ+KSA9PiBVcGRhdGU8VD47XG5cbiAgLyoqXG4gICAqIERpY3Rpb25hcnkgb2YgdGhlIHtFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHN9IGZvciB0aGlzIGVudGl0eSB0eXBlLFxuICAgKiBrZXllZCBieSB0aGUge0VudGl0eU9wfVxuICAgKi9cbiAgcmVhZG9ubHkgbWV0aG9kczogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RNYXA8VD4gPSB7XG4gICAgW0VudGl0eU9wLkNBTkNFTF9QRVJTSVNUXTogdGhpcy5jYW5jZWxQZXJzaXN0LmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUVVFUllfQUxMXTogdGhpcy5xdWVyeUFsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9BTExfRVJST1JdOiB0aGlzLnF1ZXJ5QWxsRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQUxMX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5QWxsU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX0JZX0tFWV06IHRoaXMucXVlcnlCeUtleS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9CWV9LRVlfRVJST1JdOiB0aGlzLnF1ZXJ5QnlLZXlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9CWV9LRVlfU1VDQ0VTU106IHRoaXMucXVlcnlCeUtleVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9MT0FEXTogdGhpcy5xdWVyeUxvYWQuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfTE9BRF9FUlJPUl06IHRoaXMucXVlcnlMb2FkRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfTE9BRF9TVUNDRVNTXTogdGhpcy5xdWVyeUxvYWRTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUVVFUllfTUFOWV06IHRoaXMucXVlcnlNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX01BTllfRVJST1JdOiB0aGlzLnF1ZXJ5TWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX01BTllfU1VDQ0VTU106IHRoaXMucXVlcnlNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX01BTlldOiB0aGlzLnNhdmVBZGRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX01BTllfRVJST1JdOiB0aGlzLnNhdmVBZGRNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9BRERfTUFOWV9TVUNDRVNTXTogdGhpcy5zYXZlQWRkTWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9PTkVdOiB0aGlzLnNhdmVBZGRPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9BRERfT05FX0VSUk9SXTogdGhpcy5zYXZlQWRkT25lRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9BRERfT05FX1NVQ0NFU1NdOiB0aGlzLnNhdmVBZGRPbmVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV06IHRoaXMuc2F2ZURlbGV0ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZURlbGV0ZU1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVEZWxldGVNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX09ORV06IHRoaXMuc2F2ZURlbGV0ZU9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkVfRVJST1JdOiB0aGlzLnNhdmVEZWxldGVPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZURlbGV0ZU9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZXTogdGhpcy5zYXZlVXBkYXRlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlVXBkYXRlTWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZVVwZGF0ZU1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfT05FXTogdGhpcy5zYXZlVXBkYXRlT25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX09ORV9FUlJPUl06IHRoaXMuc2F2ZVVwZGF0ZU9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlVXBkYXRlT25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX01BTlldOiB0aGlzLnNhdmVVcHNlcnRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfRVJST1JdOiB0aGlzLnNhdmVVcHNlcnRNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9TVUNDRVNTXTogdGhpcy5zYXZlVXBzZXJ0TWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkVdOiB0aGlzLnNhdmVVcHNlcnRPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FX0VSUk9SXTogdGhpcy5zYXZlVXBzZXJ0T25lRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcHNlcnRPbmVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICAvLyBEbyBub3RoaW5nIG9uIHNhdmUgZXJyb3JzIGV4Y2VwdCB0dXJuIHRoZSBsb2FkaW5nIGZsYWcgb2ZmLlxuICAgIC8vIFNlZSB0aGUgQ2hhbmdlVHJhY2tlck1ldGFSZWR1Y2Vyc1xuICAgIC8vIE9yIHRoZSBhcHAgY291bGQgbGlzdGVuIGZvciB0aG9zZSBlcnJvcnMgYW5kIGRvIHNvbWV0aGluZ1xuXG4gICAgLy8vIGNhY2hlIG9ubHkgb3BlcmF0aW9ucyAvLy9cblxuICAgIFtFbnRpdHlPcC5BRERfQUxMXTogdGhpcy5hZGRBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuQUREX01BTlldOiB0aGlzLmFkZE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuQUREX09ORV06IHRoaXMuYWRkT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUkVNT1ZFX0FMTF06IHRoaXMucmVtb3ZlQWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlJFTU9WRV9NQU5ZXTogdGhpcy5yZW1vdmVNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlJFTU9WRV9PTkVdOiB0aGlzLnJlbW92ZU9uZS5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlVQREFURV9NQU5ZXTogdGhpcy51cGRhdGVNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVQREFURV9PTkVdOiB0aGlzLnVwZGF0ZU9uZS5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlVQU0VSVF9NQU5ZXTogdGhpcy51cHNlcnRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVQU0VSVF9PTkVdOiB0aGlzLnVwc2VydE9uZS5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLkNPTU1JVF9BTExdOiB0aGlzLmNvbW1pdEFsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5DT01NSVRfTUFOWV06IHRoaXMuY29tbWl0TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5DT01NSVRfT05FXTogdGhpcy5jb21taXRPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVU5ET19BTExdOiB0aGlzLnVuZG9BbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVU5ET19NQU5ZXTogdGhpcy51bmRvTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VTkRPX09ORV06IHRoaXMudW5kb09uZS5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNFVF9DSEFOR0VfU1RBVEVdOiB0aGlzLnNldENoYW5nZVN0YXRlLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNFVF9DT0xMRUNUSU9OXTogdGhpcy5zZXRDb2xsZWN0aW9uLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNFVF9GSUxURVJdOiB0aGlzLnNldEZpbHRlci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfTE9BREVEXTogdGhpcy5zZXRMb2FkZWQuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0xPQURJTkddOiB0aGlzLnNldExvYWRpbmcuYmluZCh0aGlzKSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHB1YmxpYyBkZWZpbml0aW9uOiBFbnRpdHlEZWZpbml0aW9uPFQ+LFxuICAgIC8qXG4gICAgICogVHJhY2sgY2hhbmdlcyB0byBlbnRpdGllcyBzaW5jZSB0aGUgbGFzdCBxdWVyeSBvciBzYXZlXG4gICAgICogQ2FuIHJldmVydCBzb21lIG9yIGFsbCBvZiB0aG9zZSBjaGFuZ2VzXG4gICAgICovXG4gICAgZW50aXR5Q2hhbmdlVHJhY2tlcj86IEVudGl0eUNoYW5nZVRyYWNrZXI8VD5cbiAgKSB7XG4gICAgdGhpcy5hZGFwdGVyID0gZGVmaW5pdGlvbi5lbnRpdHlBZGFwdGVyO1xuICAgIHRoaXMuaXNDaGFuZ2VUcmFja2luZyA9IGRlZmluaXRpb24ubm9DaGFuZ2VUcmFja2luZyAhPT0gdHJ1ZTtcbiAgICB0aGlzLnNlbGVjdElkID0gZGVmaW5pdGlvbi5zZWxlY3RJZDtcblxuICAgIHRoaXMuZ3VhcmQgPSBuZXcgRW50aXR5QWN0aW9uR3VhcmQoZW50aXR5TmFtZSwgdGhpcy5zZWxlY3RJZCk7XG4gICAgdGhpcy50b1VwZGF0ZSA9IHRvVXBkYXRlRmFjdG9yeSh0aGlzLnNlbGVjdElkKTtcblxuICAgIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlciA9XG4gICAgICBlbnRpdHlDaGFuZ2VUcmFja2VyIHx8XG4gICAgICBuZXcgRW50aXR5Q2hhbmdlVHJhY2tlckJhc2U8VD4odGhpcy5hZGFwdGVyLCB0aGlzLnNlbGVjdElkKTtcbiAgfVxuXG4gIC8qKiBDYW5jZWwgYSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gKi9cbiAgcHJvdGVjdGVkIGNhbmNlbFBlcnNpc3QoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvLyAjcmVnaW9uIHF1ZXJ5IG9wZXJhdGlvbnNcblxuICBwcm90ZWN0ZWQgcXVlcnlBbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QWxsRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIHF1ZXJ5IHJlc3VsdHMgcGVyIHRoZSBNZXJnZVN0cmF0ZWd5XG4gICAqIFNldHMgbG9hZGluZyBmbGFnIHRvIGZhbHNlIGFuZCBsb2FkZWQgZmxhZyB0byB0cnVlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHF1ZXJ5QWxsU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VRdWVyeVJlc3VsdHMoXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICksXG4gICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QnlLZXkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXIgfCBzdHJpbmc+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QnlLZXlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUJ5S2V5U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID1cbiAgICAgIGRhdGEgPT0gbnVsbFxuICAgICAgICA/IGNvbGxlY3Rpb25cbiAgICAgICAgOiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VRdWVyeVJlc3VsdHMoXG4gICAgICAgICAgICBbZGF0YV0sXG4gICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgICAgICk7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TG9hZChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlMb2FkRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIFNldHMgbG9hZGVkIGZsYWcgdG8gdHJ1ZSwgbG9hZGluZyBmbGFnIHRvIGZhbHNlLFxuICAgKiBhbmQgY2xlYXJzIGNoYW5nZVN0YXRlIGZvciB0aGUgZW50aXJlIGNvbGxlY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgcXVlcnlMb2FkU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5hZGFwdGVyLmFkZEFsbChkYXRhLCBjb2xsZWN0aW9uKSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlU3RhdGU6IHt9LFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlNYW55RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VRdWVyeVJlc3VsdHMoXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICksXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICB9O1xuICB9XG4gIC8vICNlbmRyZWdpb24gcXVlcnkgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gc2F2ZSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkTWFueVxuICAvKipcbiAgICogU2F2ZSBtdWx0aXBsZSBuZXcgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdGllcyBzaG91bGQgYmUgYWRkZWQuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhbiBhcnJheSBvZiBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgbXVzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTsgLy8gZW5zdXJlIHRoZSBlbnRpdHkgaGFzIGEgUEtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkTWFueShcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLmFkZE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHNhdmUgbmV3IGVudGl0aWVzIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgbmV3IGVudGl0aWVzIGFyZSBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIHVuc2F2ZWQgZW50aXRpZXMgYXJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRNYW55RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE9uZVxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIG5ldyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0aWVzIGFyZSBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZCksXG4gICAqIGFuZCBtYXkgZXZlbiByZXR1cm4gYWRkaXRpb25hbCBuZXcgZW50aXRpZXMuXG4gICAqIFRoZXJlZm9yZSwgdXBzZXJ0IHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZXMgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyBhZGQgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKiBOb3RlOiBzYXZlQWRkTWFueVN1Y2Nlc3MgZGlmZmVycyBmcm9tIHNhdmVBZGRPbmVTdWNjZXNzIHdoZW4gb3B0aW1pc3RpYy5cbiAgICogc2F2ZUFkZE9uZVN1Y2Nlc3MgdXBkYXRlcyAobm90IHVwc2VydHMpIHdpdGggdGhlIGxvbmUgZW50aXR5IGZyb20gdGhlIHNlcnZlci5cbiAgICogVGhlcmUgaXMgbm8gZWZmZWN0IGlmIHRoZSBlbnRpdHkgaXMgbm90IGFscmVhZHkgaW4gY2FjaGUuXG4gICAqIHNhdmVBZGRNYW55U3VjY2VzcyB3aWxsIGFkZCBhbiBlbnRpdHkgaWYgaXQgaXMgbm90IGZvdW5kIGluIGNhY2hlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKSB7XG4gICAgLy8gRm9yIHBlc3NpbWlzdGljIHNhdmUsIGVuc3VyZSB0aGUgc2VydmVyIGdlbmVyYXRlZCB0aGUgcHJpbWFyeSBrZXkgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc2VuZCBvbmUuXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcHNlcnRzKFxuICAgICAgICBlbnRpdGllcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVBZGRzKFxuICAgICAgICBlbnRpdGllcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVBZGRPbmVcbiAgLyoqXG4gICAqIFNhdmUgYSBuZXcgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCBkZWxheSBhZGRpbmcgdG8gY29sbGVjdGlvbiB1bnRpbCBzZXJ2ZXIgYWNrbm93bGVkZ2VzIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseTsgYWRkIGVudGl0eSBpbW1lZGlhdGVseS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gd2hpY2ggdGhlIGVudGl0eSBzaG91bGQgYmUgYWRkZWQuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhbiBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBtdXN0IGhhdmUgYSBrZXkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tBZGRPbmUoXG4gICAgICAgIGVudGl0eSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIuYWRkT25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBhIG5ldyBlbnRpdHkgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGlzIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdHkgaXMgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE9uZUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCBhIG5ldyBlbnRpdHkgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBhZGQgdGhlIGVudGl0eSBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgYWRkZWQgZW50aXR5IGlzIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgYWRkIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkT25lU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICkge1xuICAgIC8vIEZvciBwZXNzaW1pc3RpYyBzYXZlLCBlbnN1cmUgdGhlIHNlcnZlciBnZW5lcmF0ZWQgdGhlIHByaW1hcnkga2V5IGlmIHRoZSBjbGllbnQgZGlkbid0IHNlbmQgb25lLlxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgdXBkYXRlOiBVcGRhdGVSZXNwb25zZURhdGE8VD4gPSB0aGlzLnRvVXBkYXRlKGVudGl0eSk7XG4gICAgICAvLyBBbHdheXMgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIGFkZGVkIGVudGl0eSByZXR1cm5lZCBmcm9tIHNlcnZlclxuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcGRhdGVzKFxuICAgICAgICBbdXBkYXRlXSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgICAgZmFsc2UgLypuZXZlciBza2lwKi9cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlQWRkcyhcbiAgICAgICAgW2VudGl0eV0sXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVBZGRPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVBZGRNYW55XG4gIC8vIFRPRE8gTUFOWVxuICAvLyAjZW5kcmVnaW9uIHNhdmVBZGRNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlRGVsZXRlT25lXG4gIC8qKlxuICAgKiBEZWxldGUgYW4gZW50aXR5IGZyb20gdGhlIHNlcnZlciBieSBrZXkgYW5kIHJlbW92ZSBpdCBmcm9tIHRoZSBjb2xsZWN0aW9uIChpZiBwcmVzZW50KS5cbiAgICogSWYgdGhlIGVudGl0eSBpcyBhbiB1bnNhdmVkIG5ldyBlbnRpdHksIHJlbW92ZSBpdCBmcm9tIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5XG4gICAqIGFuZCBza2lwIHRoZSBzZXJ2ZXIgZGVsZXRlIHJlcXVlc3QuXG4gICAqIEFuIG9wdGltaXN0aWMgc2F2ZSByZW1vdmVzIGFuIGV4aXN0aW5nIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5O1xuICAgKiBhIHBlc3NpbWlzdGljIHNhdmUgcmVtb3ZlcyBpdCBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHN1Y2Nlc3NmdWwgZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBXaWxsIHJlbW92ZSB0aGUgZW50aXR5IHdpdGggdGhpcyBrZXkgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGEgcHJpbWFyeSBrZXkgb3IgYW4gZW50aXR5IHdpdGggYSBrZXk7XG4gICAqIHRoaXMgcmVkdWNlciBleHRyYWN0cyB0aGUga2V5IGZyb20gdGhlIGVudGl0eS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nIHwgVD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgdG9EZWxldGUgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgY29uc3QgZGVsZXRlSWQgPVxuICAgICAgdHlwZW9mIHRvRGVsZXRlID09PSAnb2JqZWN0J1xuICAgICAgICA/IHRoaXMuc2VsZWN0SWQodG9EZWxldGUpXG4gICAgICAgIDogKHRvRGVsZXRlIGFzIHN0cmluZyB8IG51bWJlcik7XG4gICAgY29uc3QgY2hhbmdlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZVtkZWxldGVJZF07XG4gICAgLy8gSWYgZW50aXR5IGlzIGFscmVhZHkgdHJhY2tlZCAuLi5cbiAgICBpZiAoY2hhbmdlKSB7XG4gICAgICBpZiAoY2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuQWRkZWQpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhZGRlZCBlbnRpdHkgaW1tZWRpYXRlbHkgYW5kIGZvcmdldCBhYm91dCBpdHMgY2hhbmdlcyAodmlhIGNvbW1pdCkuXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGRlbGV0ZUlkIGFzIHN0cmluZywgY29sbGVjdGlvbik7XG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0T25lKGRlbGV0ZUlkLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgLy8gU2hvdWxkIG5vdCB3YXN0ZSBlZmZvcnQgdHJ5aW5nIHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyIGJlY2F1c2UgaXQgY2FuJ3QgYmUgdGhlcmUuXG4gICAgICAgIGFjdGlvbi5wYXlsb2FkLnNraXAgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmUtdHJhY2sgaXQgYXMgYSBkZWxldGUsIGV2ZW4gaWYgdHJhY2tpbmcgaXMgdHVybmVkIG9mZiBmb3IgdGhpcyBjYWxsLlxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlT25lKFxuICAgICAgICAgIGRlbGV0ZUlkLFxuICAgICAgICAgIGNvbGxlY3Rpb25cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBvcHRpbWlzdGljIGRlbGV0ZSwgdHJhY2sgY3VycmVudCBzdGF0ZSBhbmQgcmVtb3ZlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgICAgZGVsZXRlSWQsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShkZWxldGVJZCBhcyBzdHJpbmcsIGNvbGxlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gZGVsZXRlIHRoZSBlbnRpdHkgb24gdGhlIHNlcnZlciBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgY291bGQgc3RpbGwgYmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBpcyBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU9uZUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBkZWxldGVkIGVudGl0eSBvbiB0aGUgc2VydmVyLiBUaGUga2V5IG9mIHRoZSBkZWxldGVkIGVudGl0eSBpcyBpbiB0aGUgYWN0aW9uIHBheWxvYWQgZGF0YS5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBpZiB0aGUgZW50aXR5IGlzIHN0aWxsIGluIHRoZSBjb2xsZWN0aW9uIGl0IHdpbGwgYmUgcmVtb3ZlZC5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaGFzIGFscmVhZHkgYmVlbiByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXIgfCBzdHJpbmc+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRlbGV0ZUlkID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVEZWxldGVzKFxuICAgICAgICBbZGVsZXRlSWRdLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQZXNzaW1pc3RpYzogaWdub3JlIG1lcmdlU3RyYXRlZ3kuIFJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvbiBhbmQgZnJvbSBjaGFuZ2UgdHJhY2tpbmcuXG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShkZWxldGVJZCBhcyBzdHJpbmcsIGNvbGxlY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRPbmUoZGVsZXRlSWQsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRGVsZXRlT25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlRGVsZXRlTWFueVxuICAvKipcbiAgICogRGVsZXRlIG11bHRpcGxlIGVudGl0aWVzIGZyb20gdGhlIHNlcnZlciBieSBrZXkgYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGNvbGxlY3Rpb24gKGlmIHByZXNlbnQpLlxuICAgKiBSZW1vdmVzIHVuc2F2ZWQgbmV3IGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHlcbiAgICogYnV0IHRoZSBpZCBpcyBzdGlsbCBzZW50IHRvIHRoZSBzZXJ2ZXIgZm9yIGRlbGV0aW9uIGV2ZW4gdGhvdWdoIHRoZSBzZXJ2ZXIgd2lsbCBub3QgZmluZCB0aGF0IGVudGl0eS5cbiAgICogVGhlcmVmb3JlLCB0aGUgc2VydmVyIG11c3QgYmUgd2lsbGluZyB0byBpZ25vcmUgYSBkZWxldGUgcmVxdWVzdCBmb3IgYW4gZW50aXR5IGl0IGNhbm5vdCBmaW5kLlxuICAgKiBBbiBvcHRpbWlzdGljIHNhdmUgcmVtb3ZlcyBleGlzdGluZyBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5O1xuICAgKiBhIHBlc3NpbWlzdGljIHNhdmUgcmVtb3ZlcyB0aGVtIGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgc3VjY2Vzc2Z1bCBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFJlbW92ZXMgZW50aXRpZXMgZnJvbSB0aGlzIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhbiBhcnJheSBvZiBwcmltYXJ5IGtleXMgb3IgZW50aXRpZXMgd2l0aCBhIGtleTtcbiAgICogdGhpcyByZWR1Y2VyIGV4dHJhY3RzIHRoZSBrZXkgZnJvbSB0aGUgZW50aXR5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248KG51bWJlciB8IHN0cmluZyB8IFQpW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRlbGV0ZUlkcyA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKS5tYXAoXG4gICAgICBkID0+ICh0eXBlb2YgZCA9PT0gJ29iamVjdCcgPyB0aGlzLnNlbGVjdElkKGQpIDogKGQgYXMgc3RyaW5nIHwgbnVtYmVyKSlcbiAgICApO1xuICAgIGRlbGV0ZUlkcy5mb3JFYWNoKGRlbGV0ZUlkID0+IHtcbiAgICAgIGNvbnN0IGNoYW5nZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGVbZGVsZXRlSWRdO1xuICAgICAgLy8gSWYgZW50aXR5IGlzIGFscmVhZHkgdHJhY2tlZCAuLi5cbiAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBhZGRlZCBlbnRpdHkgaW1tZWRpYXRlbHkgYW5kIGZvcmdldCBhYm91dCBpdHMgY2hhbmdlcyAodmlhIGNvbW1pdCkuXG4gICAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShkZWxldGVJZCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgLy8gU2hvdWxkIG5vdCB3YXN0ZSBlZmZvcnQgdHJ5aW5nIHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyIGJlY2F1c2UgaXQgY2FuJ3QgYmUgdGhlcmUuXG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQuc2tpcCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmUtdHJhY2sgaXQgYXMgYSBkZWxldGUsIGV2ZW4gaWYgdHJhY2tpbmcgaXMgdHVybmVkIG9mZiBmb3IgdGhpcyBjYWxsLlxuICAgICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICAgICAgICBkZWxldGVJZCxcbiAgICAgICAgICAgIGNvbGxlY3Rpb25cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gSWYgb3B0aW1pc3RpYyBkZWxldGUsIHRyYWNrIGN1cnJlbnQgc3RhdGUgYW5kIHJlbW92ZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVNYW55KFxuICAgICAgICBkZWxldGVJZHMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoZGVsZXRlSWRzIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBkZWxldGUgdGhlIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgY291bGQgc3RpbGwgYmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGFyZSBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgZGVsZXRlZCBlbnRpdGllcyBvbiB0aGUgc2VydmVyLiBUaGUga2V5cyBvZiB0aGUgZGVsZXRlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGFjdGlvbiBwYXlsb2FkIGRhdGEuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgZW50aXRpZXMgdGhhdCBhcmUgc3RpbGwgaW4gdGhlIGNvbGxlY3Rpb24gd2lsbCBiZSByZW1vdmVkLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGhhdmUgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlTWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjwobnVtYmVyIHwgc3RyaW5nKVtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkZWxldGVJZHMgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZURlbGV0ZXMoXG4gICAgICAgIGRlbGV0ZUlkcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUGVzc2ltaXN0aWM6IGlnbm9yZSBtZXJnZVN0cmF0ZWd5LiBSZW1vdmUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb24gYW5kIGZyb20gY2hhbmdlIHRyYWNraW5nLlxuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KGRlbGV0ZUlkcyBhcyBzdHJpbmdbXSwgY29sbGVjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE1hbnkoZGVsZXRlSWRzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZURlbGV0ZU1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVVcGRhdGVPbmVcbiAgLyoqXG4gICAqIFNhdmUgYW4gdXBkYXRlIHRvIGFuIGV4aXN0aW5nIGVudGl0eS5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXR5IGltbWVkaWF0ZWx5LCBiZWZvcmUgdGhlIHNhdmUgcmVxdWVzdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4ge1VwZGF0ZTxUPn1cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU9uZShcbiAgICAgICAgdXBkYXRlLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cGRhdGVPbmUodXBkYXRlLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byB1cGRhdGUgdGhlIGVudGl0eSBvbiB0aGUgc2VydmVyIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBpcyBpbiB0aGUgcHJlLXNhdmUgc3RhdGVcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdhcyB1cGRhdGVkXG4gICAqIGFuZCB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgdGhlIHVwZGF0ZWQgZW50aXR5IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCBkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgd2FzIGFscmVhZHkgdXBkYXRlZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWUgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyB1cGRhdGUgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsIGFuZFxuICAgKiB0aGUgdXBkYXRlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4gVXBkYXRlUmVzcG9uc2U8VD4gdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgVXBkYXRlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICogWW91IG11c3QgaW5jbHVkZSBhbiBVcGRhdGVSZXNwb25zZSBldmVuIGlmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLFxuICAgKiB0byBlbnN1cmUgdGhhdCB0aGUgY2hhbmdlIHRyYWNraW5nIGlzIHByb3Blcmx5IHJlc2V0LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZVJlc3BvbnNlKGFjdGlvbik7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID0gdGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBkYXRlcyhcbiAgICAgIFt1cGRhdGVdLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICBpc09wdGltaXN0aWMgLypza2lwIHVuY2hhbmdlZCBpZiBvcHRpbWlzdGljICovXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBkYXRlT25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlVXBkYXRlTWFueVxuICAvKipcbiAgICogU2F2ZSB1cGRhdGVkIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0aWVzIGltbWVkaWF0ZWx5LCBiZWZvcmUgdGhlIHNhdmUgcmVxdWVzdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4gYXJyYXkgb2Yge1VwZGF0ZTxUPn0uXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD5bXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgdXBkYXRlcyA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlcyhhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU1hbnkoXG4gICAgICAgIHVwZGF0ZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gdXBkYXRlIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gYXJlIGluIHRoZSBwcmUtc2F2ZSBzdGF0ZVxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3ZXJlIHVwZGF0ZWRcbiAgICogYW5kIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgdGhlIHVwZGF0ZWQgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2lsbCBiZSB1cGRhdGVkIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2VyZSBhbHJlYWR5IHVwZGF0ZWQuXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIHVwZGF0ZSB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgaWYgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhIHdoaWNoLCBtdXN0IGJlIGFuIGFycmF5IG9mIFVwZGF0ZVJlc3BvbnNlPFQ+LlxuICAgKiBZb3UgbXVzdCBpbmNsdWRlIGFuIFVwZGF0ZVJlc3BvbnNlIGZvciBldmVyeSBVcGRhdGUgc2VudCB0byB0aGUgc2VydmVyLFxuICAgKiBldmVuIGlmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB0byBlbnN1cmUgdGhhdCB0aGUgY2hhbmdlIHRyYWNraW5nIGlzIHByb3Blcmx5IHJlc2V0LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVSZXNwb25zZXMoYWN0aW9uKTtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPSB0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcGRhdGVzKFxuICAgICAgdXBkYXRlcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgZmFsc2UgLyogbmV2ZXIgc2tpcCAqL1xuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZVVwZGF0ZU1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVVcHNlcnRPbmVcbiAgLyoqXG4gICAqIFNhdmUgYSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCBkZWxheSBhZGRpbmcgdG8gY29sbGVjdGlvbiB1bnRpbCBzZXJ2ZXIgYWNrbm93bGVkZ2VzIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseTsgYWRkIGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXR5IHNob3VsZCBiZSB1cHNlcnRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGEgd2hvbGUgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgbXVzdCBoYXZlIGl0cyBrZXkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRPbmUoXG4gICAgICAgIGVudGl0eSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0T25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5IGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgbmV3IG9yIHVwZGF0ZWQgZW50aXR5IGlzIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE9uZUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBhZGQgdGhlIGVudGl0aWVzIGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdGllcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZXMgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyBhZGQgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKSB7XG4gICAgLy8gRm9yIHBlc3NpbWlzdGljIHNhdmUsIGVuc3VyZSB0aGUgc2VydmVyIGdlbmVyYXRlZCB0aGUgcHJpbWFyeSBrZXkgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc2VuZCBvbmUuXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIC8vIEFsd2F5cyB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdXBzZXJ0ZWQgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzZXJ2ZXJcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwc2VydHMoXG4gICAgICBbZW50aXR5XSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBzZXJ0T25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlVXBzZXJ0TWFueVxuICAvKipcbiAgICogU2F2ZSBtdWx0aXBsZSBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdGllcyBzaG91bGQgYmUgdXBzZXJ0ZWQuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhbiBhcnJheSBvZiB3aG9sZSBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgbXVzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTsgLy8gZW5zdXJlIHRoZSBlbnRpdHkgaGFzIGEgUEtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0TWFueShcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHNhdmUgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgbmV3IGVudGl0aWVzIGFyZSBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIHVuc2F2ZWQgZW50aXRpZXMgYXJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRNYW55RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0aWVzIGFyZSBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIC8vIEFsd2F5cyB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdXBzZXJ0ZWQgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzZXJ2ZXJcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBzZXJ0TWFueVxuXG4gIC8vICNlbmRyZWdpb24gc2F2ZSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBjYWNoZS1vbmx5IG9wZXJhdGlvbnNcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIFNldHMgbG9hZGVkIGZsYWcgdG8gdHJ1ZS5cbiAgICogTWVyZ2VzIHF1ZXJ5IHJlc3VsdHMsIHByZXNlcnZpbmcgdW5zYXZlZCBjaGFuZ2VzXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkQWxsKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5hZGFwdGVyLmFkZEFsbChlbnRpdGllcywgY29sbGVjdGlvbiksXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE1hbnkoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmFkZE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkT25lKFxuICAgICAgZW50aXR5LFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuYWRkT25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlcltdIHwgc3RyaW5nW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBlbnRpdHkga2V5c1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLmd1YXJkLm11c3RCZUtleXMoYWN0aW9uKSBhcyBzdHJpbmdbXTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVNYW55KFxuICAgICAga2V5cyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoa2V5cywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyBwYXlsb2FkIG11c3QgYmUgZW50aXR5IGtleVxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ3VhcmQubXVzdEJlS2V5KGFjdGlvbikgYXMgc3RyaW5nO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgIGtleSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShrZXksIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbW92ZUFsbChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmFkYXB0ZXIucmVtb3ZlQWxsKGNvbGxlY3Rpb24pLFxuICAgICAgbG9hZGVkOiBmYWxzZSwgLy8gT25seSBSRU1PVkVfQUxMIHNldHMgbG9hZGVkIHRvIGZhbHNlXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGNoYW5nZVN0YXRlOiB7fSwgLy8gQXNzdW1lIGNsZWFyaW5nIHRoZSBjb2xsZWN0aW9uIGFuZCBub3QgdHJ5aW5nIHRvIGRlbGV0ZSBhbGwgZW50aXRpZXNcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD5bXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGFuIGFycmF5IG9mIGBVcGRhdGVzPFQ+YCwgbm90IGVudGl0aWVzXG4gICAgY29uc3QgdXBkYXRlcyA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU1hbnkoXG4gICAgICB1cGRhdGVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBhbiBgVXBkYXRlPFQ+YCwgbm90IGFuIGVudGl0eVxuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlT25lKFxuICAgICAgdXBkYXRlLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlT25lKHVwZGF0ZSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBzZXJ0TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gPHY2OiBwYXlsb2FkIG11c3QgYmUgYW4gYXJyYXkgb2YgYFVwZGF0ZXM8VD5gLCBub3QgZW50aXRpZXNcbiAgICAvLyB2Nis6IHBheWxvYWQgbXVzdCBiZSBhbiBhcnJheSBvZiBUXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0TWFueShcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBzZXJ0T25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gPHY2OiBwYXlsb2FkIG11c3QgYmUgYW4gYFVwZGF0ZTxUPmAsIG5vdCBhbiBlbnRpdHlcbiAgICAvLyB2Nis6IHBheWxvYWQgbXVzdCBiZSBhIFRcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1Vwc2VydE9uZShcbiAgICAgIGVudGl0eSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwc2VydE9uZShlbnRpdHksIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbW1pdEFsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRBbGwoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWl0TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRNYW55KFxuICAgICAgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWl0T25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRPbmUoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvQWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnVuZG9BbGwoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5kb01hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudW5kb01hbnkoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvT25lKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci51bmRvT25lKFxuICAgICAgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG4gIH1cblxuICAvKiogRGFuZ2Vyb3VzOiBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNvbGxlY3Rpb24ncyBDaGFuZ2VTdGF0ZS4gVXNlIHJhcmVseSBhbmQgd2lzZWx5LiAqL1xuICBwcm90ZWN0ZWQgc2V0Q2hhbmdlU3RhdGUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxDaGFuZ2VTdGF0ZU1hcDxUPj5cbiAgKSB7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUgPT09IGNoYW5nZVN0YXRlXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERhbmdlcm91czogQ29tcGxldGVseSByZXBsYWNlIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBQcmltYXJpbHkgZm9yIHRlc3RpbmcgYW5kIHJlaHlkcmF0aW9uIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICogVXNlIHJhcmVseSBhbmQgd2lzZWx5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldENvbGxlY3Rpb24oXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlDb2xsZWN0aW9uPFQ+PlxuICApIHtcbiAgICBjb25zdCBuZXdDb2xsZWN0aW9uID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uID8gY29sbGVjdGlvbiA6IG5ld0NvbGxlY3Rpb247XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RmlsdGVyKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248YW55PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyID09PSBmaWx0ZXJcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGZpbHRlciB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldExvYWRlZChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPGJvb2xlYW4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGxvYWRlZCA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSA9PT0gdHJ1ZSB8fCBmYWxzZTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5sb2FkZWQgPT09IGxvYWRlZFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgbG9hZGVkIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGluZyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPGJvb2xlYW4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGbGFnKGNvbGxlY3Rpb24sIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGluZ0ZhbHNlKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldExvYWRpbmdUcnVlKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbiwgdHJ1ZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSBjb2xsZWN0aW9uJ3MgbG9hZGluZyBmbGFnICovXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LCBsb2FkaW5nOiBib29sZWFuKSB7XG4gICAgbG9hZGluZyA9IGxvYWRpbmcgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24ubG9hZGluZyA9PT0gbG9hZGluZ1xuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgbG9hZGluZyB9O1xuICB9XG4gIC8vICNlbmRyZWdpb24gQ2FjaGUtb25seSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIC8qKiBTYWZlbHkgZXh0cmFjdCBkYXRhIGZyb20gdGhlIEVudGl0eUFjdGlvbiBwYXlsb2FkICovXG4gIHByb3RlY3RlZCBleHRyYWN0RGF0YTxEID0gYW55PihhY3Rpb246IEVudGl0eUFjdGlvbjxEPik6IEQge1xuICAgIHJldHVybiAoYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZGF0YSkgYXMgRDtcbiAgfVxuXG4gIC8qKiBTYWZlbHkgZXh0cmFjdCBNZXJnZVN0cmF0ZWd5IGZyb20gRW50aXR5QWN0aW9uLiBTZXQgdG8gSWdub3JlQ2hhbmdlcyBpZiBjb2xsZWN0aW9uIGl0c2VsZiBpcyBub3QgdHJhY2tlZC4gKi9cbiAgcHJvdGVjdGVkIGV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgLy8gSWYgbm90IHRyYWNraW5nIHRoaXMgY29sbGVjdGlvbiwgYWx3YXlzIGlnbm9yZSBjaGFuZ2VzXG4gICAgcmV0dXJuIHRoaXMuaXNDaGFuZ2VUcmFja2luZ1xuICAgICAgPyBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5tZXJnZVN0cmF0ZWd5XG4gICAgICA6IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcztcbiAgfVxuXG4gIHByb3RlY3RlZCBpc09wdGltaXN0aWMoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuaXNPcHRpbWlzdGljID09PSB0cnVlO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG5cbi8qKlxuICogQ3JlYXRlcyB7RW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzfSBmb3IgYSBnaXZlbiBlbnRpdHkgdHlwZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlOiBFbnRpdHlEZWZpbml0aW9uU2VydmljZSkge31cblxuICAvKiogQ3JlYXRlIHRoZSAge0VudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc30gZm9yIHRoZSBuYW1lZCBlbnRpdHkgdHlwZSAqL1xuICBjcmVhdGU8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RNYXA8VD4ge1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcbiAgICBjb25zdCBtZXRob2RzQ2xhc3MgPSBuZXcgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzKFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIGRlZmluaXRpb25cbiAgICApO1xuXG4gICAgcmV0dXJuIG1ldGhvZHNDbGFzcy5tZXRob2RzO1xuICB9XG59XG4iXX0=