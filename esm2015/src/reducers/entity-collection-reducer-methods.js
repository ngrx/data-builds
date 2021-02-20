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
export class EntityCollectionReducerMethods {
    constructor(entityName, definition, 
    /*
     * Track changes to entities since the last query or save
     * Can revert some or all of those changes
     */
    entityChangeTracker) {
        this.entityName = entityName;
        this.definition = definition;
        /**
         * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
         * keyed by the {EntityOp}
         */
        this.methods = {
            [EntityOp.CANCEL_PERSIST]: this.cancelPersist.bind(this),
            [EntityOp.QUERY_ALL]: this.queryAll.bind(this),
            [EntityOp.QUERY_ALL_ERROR]: this.queryAllError.bind(this),
            [EntityOp.QUERY_ALL_SUCCESS]: this.queryAllSuccess.bind(this),
            [EntityOp.QUERY_BY_KEY]: this.queryByKey.bind(this),
            [EntityOp.QUERY_BY_KEY_ERROR]: this.queryByKeyError.bind(this),
            [EntityOp.QUERY_BY_KEY_SUCCESS]: this.queryByKeySuccess.bind(this),
            [EntityOp.QUERY_LOAD]: this.queryLoad.bind(this),
            [EntityOp.QUERY_LOAD_ERROR]: this.queryLoadError.bind(this),
            [EntityOp.QUERY_LOAD_SUCCESS]: this.queryLoadSuccess.bind(this),
            [EntityOp.QUERY_MANY]: this.queryMany.bind(this),
            [EntityOp.QUERY_MANY_ERROR]: this.queryManyError.bind(this),
            [EntityOp.QUERY_MANY_SUCCESS]: this.queryManySuccess.bind(this),
            [EntityOp.SAVE_ADD_MANY]: this.saveAddMany.bind(this),
            [EntityOp.SAVE_ADD_MANY_ERROR]: this.saveAddManyError.bind(this),
            [EntityOp.SAVE_ADD_MANY_SUCCESS]: this.saveAddManySuccess.bind(this),
            [EntityOp.SAVE_ADD_ONE]: this.saveAddOne.bind(this),
            [EntityOp.SAVE_ADD_ONE_ERROR]: this.saveAddOneError.bind(this),
            [EntityOp.SAVE_ADD_ONE_SUCCESS]: this.saveAddOneSuccess.bind(this),
            [EntityOp.SAVE_DELETE_MANY]: this.saveDeleteMany.bind(this),
            [EntityOp.SAVE_DELETE_MANY_ERROR]: this.saveDeleteManyError.bind(this),
            [EntityOp.SAVE_DELETE_MANY_SUCCESS]: this.saveDeleteManySuccess.bind(this),
            [EntityOp.SAVE_DELETE_ONE]: this.saveDeleteOne.bind(this),
            [EntityOp.SAVE_DELETE_ONE_ERROR]: this.saveDeleteOneError.bind(this),
            [EntityOp.SAVE_DELETE_ONE_SUCCESS]: this.saveDeleteOneSuccess.bind(this),
            [EntityOp.SAVE_UPDATE_MANY]: this.saveUpdateMany.bind(this),
            [EntityOp.SAVE_UPDATE_MANY_ERROR]: this.saveUpdateManyError.bind(this),
            [EntityOp.SAVE_UPDATE_MANY_SUCCESS]: this.saveUpdateManySuccess.bind(this),
            [EntityOp.SAVE_UPDATE_ONE]: this.saveUpdateOne.bind(this),
            [EntityOp.SAVE_UPDATE_ONE_ERROR]: this.saveUpdateOneError.bind(this),
            [EntityOp.SAVE_UPDATE_ONE_SUCCESS]: this.saveUpdateOneSuccess.bind(this),
            [EntityOp.SAVE_UPSERT_MANY]: this.saveUpsertMany.bind(this),
            [EntityOp.SAVE_UPSERT_MANY_ERROR]: this.saveUpsertManyError.bind(this),
            [EntityOp.SAVE_UPSERT_MANY_SUCCESS]: this.saveUpsertManySuccess.bind(this),
            [EntityOp.SAVE_UPSERT_ONE]: this.saveUpsertOne.bind(this),
            [EntityOp.SAVE_UPSERT_ONE_ERROR]: this.saveUpsertOneError.bind(this),
            [EntityOp.SAVE_UPSERT_ONE_SUCCESS]: this.saveUpsertOneSuccess.bind(this),
            // Do nothing on save errors except turn the loading flag off.
            // See the ChangeTrackerMetaReducers
            // Or the app could listen for those errors and do something
            /// cache only operations ///
            [EntityOp.ADD_ALL]: this.addAll.bind(this),
            [EntityOp.ADD_MANY]: this.addMany.bind(this),
            [EntityOp.ADD_ONE]: this.addOne.bind(this),
            [EntityOp.REMOVE_ALL]: this.removeAll.bind(this),
            [EntityOp.REMOVE_MANY]: this.removeMany.bind(this),
            [EntityOp.REMOVE_ONE]: this.removeOne.bind(this),
            [EntityOp.UPDATE_MANY]: this.updateMany.bind(this),
            [EntityOp.UPDATE_ONE]: this.updateOne.bind(this),
            [EntityOp.UPSERT_MANY]: this.upsertMany.bind(this),
            [EntityOp.UPSERT_ONE]: this.upsertOne.bind(this),
            [EntityOp.COMMIT_ALL]: this.commitAll.bind(this),
            [EntityOp.COMMIT_MANY]: this.commitMany.bind(this),
            [EntityOp.COMMIT_ONE]: this.commitOne.bind(this),
            [EntityOp.UNDO_ALL]: this.undoAll.bind(this),
            [EntityOp.UNDO_MANY]: this.undoMany.bind(this),
            [EntityOp.UNDO_ONE]: this.undoOne.bind(this),
            [EntityOp.SET_CHANGE_STATE]: this.setChangeState.bind(this),
            [EntityOp.SET_COLLECTION]: this.setCollection.bind(this),
            [EntityOp.SET_FILTER]: this.setFilter.bind(this),
            [EntityOp.SET_LOADED]: this.setLoaded.bind(this),
            [EntityOp.SET_LOADING]: this.setLoading.bind(this),
        };
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
    cancelPersist(collection) {
        return this.setLoadingFalse(collection);
    }
    // #region query operations
    queryAll(collection) {
        return this.setLoadingTrue(collection);
    }
    queryAllError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     */
    queryAllSuccess(collection, action) {
        const data = this.extractData(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        return Object.assign(Object.assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loaded: true, loading: false });
    }
    queryByKey(collection, action) {
        return this.setLoadingTrue(collection);
    }
    queryByKeyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    queryByKeySuccess(collection, action) {
        const data = this.extractData(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection =
            data == null
                ? collection
                : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
    queryLoad(collection) {
        return this.setLoadingTrue(collection);
    }
    queryLoadError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     */
    queryLoadSuccess(collection, action) {
        const data = this.extractData(action);
        return Object.assign(Object.assign({}, this.adapter.setAll(data, collection)), { loading: false, loaded: true, changeState: {} });
    }
    queryMany(collection, action) {
        return this.setLoadingTrue(collection);
    }
    queryManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    queryManySuccess(collection, action) {
        const data = this.extractData(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        return Object.assign(Object.assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loading: false });
    }
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
    saveAddMany(collection, action) {
        if (this.isOptimistic(action)) {
            const entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
            collection = this.adapter.addMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save new entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    saveAddManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
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
    saveAddManySuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
        }
        else {
            collection = this.entityChangeTracker.mergeSaveAdds(entities, collection, mergeStrategy);
        }
        return this.setLoadingFalse(collection);
    }
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
    saveAddOne(collection, action) {
        if (this.isOptimistic(action)) {
            const entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
            collection = this.adapter.addOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save a new entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entity is in the collection and
     * you may need to compensate for the error.
     */
    saveAddOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved a new entity to the server.
     * If saved pessimistically, add the entity from the server to the collection.
     * If saved optimistically, the added entity is already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    saveAddOneSuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            const update = this.toUpdate(entity);
            // Always update the cache with added entity returned from server
            collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, false /*never skip*/);
        }
        else {
            collection = this.entityChangeTracker.mergeSaveAdds([entity], collection, mergeStrategy);
        }
        return this.setLoadingFalse(collection);
    }
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
    saveDeleteOne(collection, action) {
        const toDelete = this.extractData(action);
        const deleteId = typeof toDelete === 'object'
            ? this.selectId(toDelete)
            : toDelete;
        const change = collection.changeState[deleteId];
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
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection, mergeStrategy);
            collection = this.adapter.removeOne(deleteId, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to delete the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entity is not in the collection and
     * you may need to compensate for the error.
     */
    saveDeleteOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     */
    saveDeleteOneSuccess(collection, action) {
        const deleteId = this.extractData(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes([deleteId], collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeOne(deleteId, collection);
            collection = this.entityChangeTracker.commitOne(deleteId, collection);
        }
        return this.setLoadingFalse(collection);
    }
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
    saveDeleteMany(collection, action) {
        const deleteIds = this.extractData(action).map((d) => typeof d === 'object' ? this.selectId(d) : d);
        deleteIds.forEach((deleteId) => {
            const change = collection.changeState[deleteId];
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
        });
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(deleteIds, collection, mergeStrategy);
            collection = this.adapter.removeMany(deleteIds, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to delete the entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entities are not in the collection and
     * you may need to compensate for the error.
     */
    saveDeleteManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     */
    saveDeleteManySuccess(collection, action) {
        const deleteIds = this.extractData(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(deleteIds, collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeMany(deleteIds, collection);
            collection = this.entityChangeTracker.commitMany(deleteIds, collection);
        }
        return this.setLoadingFalse(collection);
    }
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
    saveUpdateOne(collection, action) {
        const update = this.guard.mustBeUpdate(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
            collection = this.adapter.updateOne(update, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to update the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity in the collection is in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entity in the collection was updated
     * and you may need to compensate for the error.
     */
    saveUpdateOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
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
    saveUpdateOneSuccess(collection, action) {
        const update = this.guard.mustBeUpdateResponse(action);
        const isOptimistic = this.isOptimistic(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, isOptimistic /*skip unchanged if optimistic */);
        return this.setLoadingFalse(collection);
    }
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
    saveUpdateMany(collection, action) {
        const updates = this.guard.mustBeUpdates(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
            collection = this.adapter.updateMany(updates, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to update entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities in the collection are in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entities in the collection were updated
     * and you may need to compensate for the error.
     */
    saveUpdateManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
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
    saveUpdateManySuccess(collection, action) {
        const updates = this.guard.mustBeUpdateResponses(action);
        const isOptimistic = this.isOptimistic(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates(updates, collection, mergeStrategy, false /* never skip */);
        return this.setLoadingFalse(collection);
    }
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
    saveUpsertOne(collection, action) {
        if (this.isOptimistic(action)) {
            const entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
            collection = this.adapter.upsertOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save new or existing entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new or updated entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    saveUpsertOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    saveUpsertOneSuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts([entity], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
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
    saveUpsertMany(collection, action) {
        if (this.isOptimistic(action)) {
            const entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
            collection = this.adapter.upsertMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save new or existing entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    saveUpsertManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    saveUpsertManySuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpsertMany
    // #endregion save operations
    // #region cache-only operations
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true.
     * Merges query results, preserving unsaved changes
     */
    addAll(collection, action) {
        const entities = this.guard.mustBeEntities(action);
        return Object.assign(Object.assign({}, this.adapter.setAll(entities, collection)), { loading: false, loaded: true, changeState: {} });
    }
    addMany(collection, action) {
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
        return this.adapter.addMany(entities, collection);
    }
    addOne(collection, action) {
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
        return this.adapter.addOne(entity, collection);
    }
    removeMany(collection, action) {
        // payload must be entity keys
        const keys = this.guard.mustBeKeys(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
        return this.adapter.removeMany(keys, collection);
    }
    removeOne(collection, action) {
        // payload must be entity key
        const key = this.guard.mustBeKey(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
        return this.adapter.removeOne(key, collection);
    }
    removeAll(collection, action) {
        return Object.assign(Object.assign({}, this.adapter.removeAll(collection)), { loaded: false, loading: false, changeState: {} });
    }
    updateMany(collection, action) {
        // payload must be an array of `Updates<T>`, not entities
        const updates = this.guard.mustBeUpdates(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
        return this.adapter.updateMany(updates, collection);
    }
    updateOne(collection, action) {
        // payload must be an `Update<T>`, not an entity
        const update = this.guard.mustBeUpdate(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
        return this.adapter.updateOne(update, collection);
    }
    upsertMany(collection, action) {
        // <v6: payload must be an array of `Updates<T>`, not entities
        // v6+: payload must be an array of T
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
        return this.adapter.upsertMany(entities, collection);
    }
    upsertOne(collection, action) {
        // <v6: payload must be an `Update<T>`, not an entity
        // v6+: payload must be a T
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
        return this.adapter.upsertOne(entity, collection);
    }
    commitAll(collection) {
        return this.entityChangeTracker.commitAll(collection);
    }
    commitMany(collection, action) {
        return this.entityChangeTracker.commitMany(this.extractData(action), collection);
    }
    commitOne(collection, action) {
        return this.entityChangeTracker.commitOne(this.extractData(action), collection);
    }
    undoAll(collection) {
        return this.entityChangeTracker.undoAll(collection);
    }
    undoMany(collection, action) {
        return this.entityChangeTracker.undoMany(this.extractData(action), collection);
    }
    undoOne(collection, action) {
        return this.entityChangeTracker.undoOne(this.extractData(action), collection);
    }
    /** Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely. */
    setChangeState(collection, action) {
        const changeState = this.extractData(action);
        return collection.changeState === changeState
            ? collection
            : Object.assign(Object.assign({}, collection), { changeState });
    }
    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     */
    setCollection(collection, action) {
        const newCollection = this.extractData(action);
        return collection === newCollection ? collection : newCollection;
    }
    setFilter(collection, action) {
        const filter = this.extractData(action);
        return collection.filter === filter
            ? collection
            : Object.assign(Object.assign({}, collection), { filter });
    }
    setLoaded(collection, action) {
        const loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : Object.assign(Object.assign({}, collection), { loaded });
    }
    setLoading(collection, action) {
        return this.setLoadingFlag(collection, this.extractData(action));
    }
    setLoadingFalse(collection) {
        return this.setLoadingFlag(collection, false);
    }
    setLoadingTrue(collection) {
        return this.setLoadingFlag(collection, true);
    }
    /** Set the collection's loading flag */
    setLoadingFlag(collection, loading) {
        loading = loading === true ? true : false;
        return collection.loading === loading
            ? collection
            : Object.assign(Object.assign({}, collection), { loading });
    }
    // #endregion Cache-only operations
    // #region helpers
    /** Safely extract data from the EntityAction payload */
    extractData(action) {
        return (action.payload && action.payload.data);
    }
    /** Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked. */
    extractMergeStrategy(action) {
        // If not tracking this collection, always ignore changes
        return this.isChangeTracking
            ? action.payload && action.payload.mergeStrategy
            : MergeStrategy.IgnoreChanges;
    }
    isOptimistic(action) {
        return action.payload && action.payload.isOptimistic === true;
    }
}
/**
 * Creates {EntityCollectionReducerMethods} for a given entity type.
 */
export class EntityCollectionReducerMethodsFactory {
    constructor(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /** Create the  {EntityCollectionReducerMethods} for the named entity type */
    create(entityName) {
        const definition = this.entityDefinitionService.getDefinition(entityName);
        const methodsClass = new EntityCollectionReducerMethods(entityName, definition);
        return methodsClass.methods;
    }
}
EntityCollectionReducerMethodsFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionReducerMethodsFactory.ctorParameters = () => [
    { type: EntityDefinitionService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBRUwsVUFBVSxHQUVYLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBR25FLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFjMUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sOEJBQThCO0lBK0d6QyxZQUNTLFVBQWtCLEVBQ2xCLFVBQStCO0lBQ3RDOzs7T0FHRztJQUNILG1CQUE0QztRQU5yQyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQXFCO1FBM0Z4Qzs7O1dBR0c7UUFDTSxZQUFPLEdBQXdDO1lBQ3RELENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUV4RCxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDOUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3pELENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTdELENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNuRCxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM5RCxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWxFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMzRCxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRS9ELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMzRCxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRS9ELENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyRCxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hFLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFcEUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ25ELENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzlELENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFbEUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0QsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0RSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BFLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0QsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0RSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BFLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0QsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0RSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BFLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEUsOERBQThEO1lBQzlELG9DQUFvQztZQUNwQyw0REFBNEQ7WUFFNUQsNkJBQTZCO1lBRTdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEQsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWhELENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFaEQsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVoRCxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzlDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUU1QyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMzRCxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDeEQsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbkQsQ0FBQztRQVdBLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQztRQUM3RCxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFFcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxtQkFBbUI7WUFDdEIsbUJBQW1CO2dCQUNuQixJQUFJLHVCQUF1QixDQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxxQ0FBcUM7SUFDM0IsYUFBYSxDQUNyQixVQUErQjtRQUUvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELDJCQUEyQjtJQUVqQixRQUFRLENBQUMsVUFBK0I7UUFDaEQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFUyxhQUFhLENBQ3JCLFVBQStCLEVBQy9CLE1BQWtEO1FBRWxELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sZUFBZSxDQUN2QixVQUErQixFQUMvQixNQUF5QjtRQUV6QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCx1Q0FDSyxJQUFJLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQzNDLElBQUksRUFDSixVQUFVLEVBQ1YsYUFBYSxDQUNkLEtBQ0QsTUFBTSxFQUFFLElBQUksRUFDWixPQUFPLEVBQUUsS0FBSyxJQUNkO0lBQ0osQ0FBQztJQUVTLFVBQVUsQ0FDbEIsVUFBK0IsRUFDL0IsTUFBcUM7UUFFckMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFUyxlQUFlLENBQ3ZCLFVBQStCLEVBQy9CLE1BQWtEO1FBRWxELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRVMsaUJBQWlCLENBQ3pCLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELFVBQVU7WUFDUixJQUFJLElBQUksSUFBSTtnQkFDVixDQUFDLENBQUMsVUFBVTtnQkFDWixDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUN4QyxDQUFDLElBQUksQ0FBQyxFQUNOLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztRQUNSLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRVMsU0FBUyxDQUFDLFVBQStCO1FBQ2pELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRVMsY0FBYyxDQUN0QixVQUErQixFQUMvQixNQUFrRDtRQUVsRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxnQkFBZ0IsQ0FDeEIsVUFBK0IsRUFDL0IsTUFBeUI7UUFFekIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0Qyx1Q0FDSyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQ2QsTUFBTSxFQUFFLElBQUksRUFDWixXQUFXLEVBQUUsRUFBRSxJQUNmO0lBQ0osQ0FBQztJQUVTLFNBQVMsQ0FDakIsVUFBK0IsRUFDL0IsTUFBb0I7UUFFcEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFUyxjQUFjLENBQ3RCLFVBQStCLEVBQy9CLE1BQWtEO1FBRWxELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRVMsZ0JBQWdCLENBQ3hCLFVBQStCLEVBQy9CLE1BQXlCO1FBRXpCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELHVDQUNLLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FDM0MsSUFBSSxFQUNKLFVBQVUsRUFDVixhQUFhLENBQ2QsS0FDRCxPQUFPLEVBQUUsS0FBSyxJQUNkO0lBQ0osQ0FBQztJQUNELDhCQUE4QjtJQUU5QiwwQkFBMEI7SUFFMUIsc0JBQXNCO0lBQ3RCOzs7Ozs7OztPQVFHO0lBQ08sV0FBVyxDQUNuQixVQUErQixFQUMvQixNQUF5QjtRQUV6QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7WUFDakYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUNoRCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1lBQ0YsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUN6RDtRQUNELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLGdCQUFnQixDQUN4QixVQUErQixFQUMvQixNQUFrRDtRQUVsRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELHlCQUF5QjtJQUV6QixxQkFBcUI7SUFDckI7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNPLGtCQUFrQixDQUMxQixVQUErQixFQUMvQixNQUF5QjtRQUV6QixtR0FBbUc7UUFDbkcsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM3QixVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUNwRCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1NBQ0g7YUFBTTtZQUNMLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUNqRCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1NBQ0g7UUFDRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELHlCQUF5QjtJQUV6QixxQkFBcUI7SUFDckI7Ozs7Ozs7O09BUUc7SUFDTyxVQUFVLENBQ2xCLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtZQUM3RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQy9DLE1BQU0sRUFDTixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7WUFDRixVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sZUFBZSxDQUN2QixVQUErQixFQUMvQixNQUFrRDtRQUVsRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ08saUJBQWlCLENBQ3pCLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLG1HQUFtRztRQUNuRyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLE1BQU0sTUFBTSxHQUEwQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVELGlFQUFpRTtZQUNqRSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUNwRCxDQUFDLE1BQU0sQ0FBQyxFQUNSLFVBQVUsRUFDVixhQUFhLEVBQ2IsS0FBSyxDQUFDLGNBQWMsQ0FDckIsQ0FBQztTQUNIO2FBQU07WUFDTCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FDakQsQ0FBQyxNQUFNLENBQUMsRUFDUixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0Qsd0JBQXdCO0lBRXhCLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1oseUJBQXlCO0lBRXpCLHdCQUF3QjtJQUN4Qjs7Ozs7Ozs7OztPQVVHO0lBQ08sYUFBYSxDQUNyQixVQUErQixFQUMvQixNQUF5QztRQUV6QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sUUFBUSxHQUNaLE9BQU8sUUFBUSxLQUFLLFFBQVE7WUFDMUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ3pCLENBQUMsQ0FBRSxRQUE0QixDQUFDO1FBQ3BDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsbUNBQW1DO1FBQ25DLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Z0JBQzFDLGlGQUFpRjtnQkFDakYsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3BFLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDdEUsb0ZBQW9GO2dCQUNwRixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDNUI7aUJBQU07Z0JBQ0wseUVBQXlFO2dCQUN6RSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FDbEQsUUFBUSxFQUNSLFVBQVUsQ0FDWCxDQUFDO2FBQ0g7U0FDRjtRQUVELG9FQUFvRTtRQUNwRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUNsRCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1lBQ0YsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDckU7UUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxrQkFBa0IsQ0FDMUIsVUFBK0IsRUFDL0IsTUFBa0Q7UUFFbEQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sb0JBQW9CLENBQzVCLFVBQStCLEVBQy9CLE1BQXFDO1FBRXJDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUNwRCxDQUFDLFFBQVEsQ0FBQyxFQUNWLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztTQUNIO2FBQU07WUFDTCxpR0FBaUc7WUFDakcsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDcEUsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCwyQkFBMkI7SUFFM0IseUJBQXlCO0lBQ3pCOzs7Ozs7Ozs7OztPQVdHO0lBQ08sY0FBYyxDQUN0QixVQUErQixFQUMvQixNQUE2QztRQUU3QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ25ELE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBcUIsQ0FDbEUsQ0FBQztRQUNGLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELG1DQUFtQztZQUNuQyxJQUFJLE1BQU0sRUFBRTtnQkFDVixJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLEtBQUssRUFBRTtvQkFDMUMsaUZBQWlGO29CQUNqRixVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDcEUsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUN0RSxvRkFBb0Y7b0JBQ3BGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDNUI7cUJBQU07b0JBQ0wseUVBQXlFO29CQUN6RSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FDbEQsUUFBUSxFQUNSLFVBQVUsQ0FDWCxDQUFDO2lCQUNIO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILG9FQUFvRTtRQUNwRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUNuRCxTQUFTLEVBQ1QsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1lBQ0YsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQXFCLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDekU7UUFDRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxtQkFBbUIsQ0FDM0IsVUFBK0IsRUFDL0IsTUFBa0Q7UUFFbEQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08scUJBQXFCLENBQzdCLFVBQStCLEVBQy9CLE1BQXlDO1FBRXpDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUNwRCxTQUFTLEVBQ1QsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1NBQ0g7YUFBTTtZQUNMLGlHQUFpRztZQUNqRyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBcUIsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN4RSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDekU7UUFDRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELDRCQUE0QjtJQUU1Qix3QkFBd0I7SUFDeEI7Ozs7Ozs7T0FPRztJQUNPLGFBQWEsQ0FDckIsVUFBK0IsRUFDL0IsTUFBK0I7UUFFL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FDbEQsTUFBTSxFQUNOLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztZQUNGLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDekQ7UUFDRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxrQkFBa0IsQ0FDMUIsVUFBK0IsRUFDL0IsTUFBa0Q7UUFFbEQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ08sb0JBQW9CLENBQzVCLFVBQStCLEVBQy9CLE1BQTJDO1FBRTNDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDcEQsQ0FBQyxNQUFNLENBQUMsRUFDUixVQUFVLEVBQ1YsYUFBYSxFQUNiLFlBQVksQ0FBQyxpQ0FBaUMsQ0FDL0MsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsMkJBQTJCO0lBRTNCLHlCQUF5QjtJQUN6Qjs7Ozs7OztPQU9HO0lBQ08sY0FBYyxDQUN0QixVQUErQixFQUMvQixNQUFpQztRQUVqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUNuRCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1lBQ0YsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztTQUMzRDtRQUNELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLG1CQUFtQixDQUMzQixVQUErQixFQUMvQixNQUFrRDtRQUVsRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDTyxxQkFBcUIsQ0FDN0IsVUFBK0IsRUFDL0IsTUFBNkM7UUFFN0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUNwRCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGFBQWEsRUFDYixLQUFLLENBQUMsZ0JBQWdCLENBQ3ZCLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELDRCQUE0QjtJQUU1Qix3QkFBd0I7SUFDeEI7Ozs7Ozs7O09BUUc7SUFDTyxhQUFhLENBQ3JCLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtZQUM3RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQ2xELE1BQU0sRUFDTixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7WUFDRixVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sa0JBQWtCLENBQzFCLFVBQStCLEVBQy9CLE1BQWtEO1FBRWxELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDTyxvQkFBb0IsQ0FDNUIsVUFBK0IsRUFDL0IsTUFBdUI7UUFFdkIsbUdBQW1HO1FBQ25HLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxzRUFBc0U7UUFDdEUsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDcEQsQ0FBQyxNQUFNLENBQUMsRUFDUixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELDJCQUEyQjtJQUUzQix5QkFBeUI7SUFDekI7Ozs7Ozs7O09BUUc7SUFDTyxjQUFjLENBQ3RCLFVBQStCLEVBQy9CLE1BQXlCO1FBRXpCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtZQUNqRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQ25ELFFBQVEsRUFDUixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7WUFDRixVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sbUJBQW1CLENBQzNCLFVBQStCLEVBQy9CLE1BQWtEO1FBRWxELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDTyxxQkFBcUIsQ0FDN0IsVUFBK0IsRUFDL0IsTUFBeUI7UUFFekIsbUdBQW1HO1FBQ25HLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxzRUFBc0U7UUFDdEUsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDcEQsUUFBUSxFQUNSLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsNEJBQTRCO0lBRTVCLDZCQUE2QjtJQUU3QixnQ0FBZ0M7SUFFaEM7Ozs7T0FJRztJQUNPLE1BQU0sQ0FDZCxVQUErQixFQUMvQixNQUF5QjtRQUV6QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCx1Q0FDSyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEtBQzVDLE9BQU8sRUFBRSxLQUFLLEVBQ2QsTUFBTSxFQUFFLElBQUksRUFDWixXQUFXLEVBQUUsRUFBRSxJQUNmO0lBQ0osQ0FBQztJQUVTLE9BQU8sQ0FDZixVQUErQixFQUMvQixNQUF5QjtRQUV6QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQ2hELFFBQVEsRUFDUixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRVMsTUFBTSxDQUNkLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FDL0MsTUFBTSxFQUNOLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFUyxVQUFVLENBQ2xCLFVBQStCLEVBQy9CLE1BQXlDO1FBRXpDLDhCQUE4QjtRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQWEsQ0FBQztRQUN2RCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQ25ELElBQUksRUFDSixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRVMsU0FBUyxDQUNqQixVQUErQixFQUMvQixNQUFxQztRQUVyQyw2QkFBNkI7UUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFXLENBQUM7UUFDbkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUNsRCxHQUFHLEVBQ0gsVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVTLFNBQVMsQ0FDakIsVUFBK0IsRUFDL0IsTUFBdUI7UUFFdkIsdUNBQ0ssSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQ3JDLE1BQU0sRUFBRSxLQUFLLEVBQ2IsT0FBTyxFQUFFLEtBQUssRUFDZCxXQUFXLEVBQUUsRUFBRSxJQUNmO0lBQ0osQ0FBQztJQUVTLFVBQVUsQ0FDbEIsVUFBK0IsRUFDL0IsTUFBaUM7UUFFakMseURBQXlEO1FBQ3pELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FDbkQsT0FBTyxFQUNQLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFUyxTQUFTLENBQ2pCLFVBQStCLEVBQy9CLE1BQStCO1FBRS9CLGdEQUFnRDtRQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQ2xELE1BQU0sRUFDTixVQUFVLEVBQ1YsYUFBYSxDQUNkLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRVMsVUFBVSxDQUNsQixVQUErQixFQUMvQixNQUF5QjtRQUV6Qiw4REFBOEQ7UUFDOUQscUNBQXFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FDbkQsUUFBUSxFQUNSLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFUyxTQUFTLENBQ2pCLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLHFEQUFxRDtRQUNyRCwyQkFBMkI7UUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUNsRCxNQUFNLEVBQ04sVUFBVSxFQUNWLGFBQWEsQ0FDZCxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVTLFNBQVMsQ0FBQyxVQUErQjtRQUNqRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVTLFVBQVUsQ0FDbEIsVUFBK0IsRUFDL0IsTUFBeUI7UUFFekIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUN4QixVQUFVLENBQ1gsQ0FBQztJQUNKLENBQUM7SUFFUyxTQUFTLENBQ2pCLFVBQStCLEVBQy9CLE1BQXVCO1FBRXZCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFDeEIsVUFBVSxDQUNYLENBQUM7SUFDSixDQUFDO0lBRVMsT0FBTyxDQUFDLFVBQStCO1FBQy9DLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRVMsUUFBUSxDQUNoQixVQUErQixFQUMvQixNQUF5QjtRQUV6QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQ3hCLFVBQVUsQ0FDWCxDQUFDO0lBQ0osQ0FBQztJQUVTLE9BQU8sQ0FBQyxVQUErQixFQUFFLE1BQXVCO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFDeEIsVUFBVSxDQUNYLENBQUM7SUFDSixDQUFDO0lBRUQseUZBQXlGO0lBQy9FLGNBQWMsQ0FDdEIsVUFBK0IsRUFDL0IsTUFBdUM7UUFFdkMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxPQUFPLFVBQVUsQ0FBQyxXQUFXLEtBQUssV0FBVztZQUMzQyxDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsaUNBQU0sVUFBVSxLQUFFLFdBQVcsR0FBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sYUFBYSxDQUNyQixVQUErQixFQUMvQixNQUF5QztRQUV6QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLE9BQU8sVUFBVSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDbkUsQ0FBQztJQUVTLFNBQVMsQ0FDakIsVUFBK0IsRUFDL0IsTUFBeUI7UUFFekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxPQUFPLFVBQVUsQ0FBQyxNQUFNLEtBQUssTUFBTTtZQUNqQyxDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsaUNBQU0sVUFBVSxLQUFFLE1BQU0sR0FBRSxDQUFDO0lBQ2hDLENBQUM7SUFFUyxTQUFTLENBQ2pCLFVBQStCLEVBQy9CLE1BQTZCO1FBRTdCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQztRQUMxRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLEtBQUssTUFBTTtZQUNqQyxDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsaUNBQU0sVUFBVSxLQUFFLE1BQU0sR0FBRSxDQUFDO0lBQ2hDLENBQUM7SUFFUyxVQUFVLENBQ2xCLFVBQStCLEVBQy9CLE1BQTZCO1FBRTdCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFUyxlQUFlLENBQ3ZCLFVBQStCO1FBRS9CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVTLGNBQWMsQ0FDdEIsVUFBK0I7UUFFL0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsd0NBQXdDO0lBQzlCLGNBQWMsQ0FBQyxVQUErQixFQUFFLE9BQWdCO1FBQ3hFLE9BQU8sR0FBRyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMxQyxPQUFPLFVBQVUsQ0FBQyxPQUFPLEtBQUssT0FBTztZQUNuQyxDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsaUNBQU0sVUFBVSxLQUFFLE9BQU8sR0FBRSxDQUFDO0lBQ2pDLENBQUM7SUFDRCxtQ0FBbUM7SUFFbkMsa0JBQWtCO0lBQ2xCLHdEQUF3RDtJQUM5QyxXQUFXLENBQVUsTUFBdUI7UUFDcEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQU0sQ0FBQztJQUN0RCxDQUFDO0lBRUQsZ0hBQWdIO0lBQ3RHLG9CQUFvQixDQUFDLE1BQW9CO1FBQ2pELHlEQUF5RDtRQUN6RCxPQUFPLElBQUksQ0FBQyxnQkFBZ0I7WUFDMUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1lBQ2hELENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ2xDLENBQUM7SUFFUyxZQUFZLENBQUMsTUFBb0I7UUFDekMsT0FBTyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQztJQUNoRSxDQUFDO0NBR0Y7QUFFRDs7R0FFRztBQUVILE1BQU0sT0FBTyxxQ0FBcUM7SUFDaEQsWUFBb0IsdUJBQWdEO1FBQWhELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7SUFBRyxDQUFDO0lBRXhFLDZFQUE2RTtJQUM3RSxNQUFNLENBQUksVUFBa0I7UUFDMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FDM0QsVUFBVSxDQUNYLENBQUM7UUFDRixNQUFNLFlBQVksR0FBRyxJQUFJLDhCQUE4QixDQUNyRCxVQUFVLEVBQ1YsVUFBVSxDQUNYLENBQUM7UUFFRixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUM7SUFDOUIsQ0FBQzs7O1lBZkYsVUFBVTs7OztZQTNyQ0YsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7XG4gIENoYW5nZVN0YXRlTWFwLFxuICBDaGFuZ2VUeXBlLFxuICBFbnRpdHlDb2xsZWN0aW9uLFxufSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlIH0gZnJvbSAnLi9lbnRpdHktY2hhbmdlLXRyYWNrZXItYmFzZSc7XG5pbXBvcnQgeyB0b1VwZGF0ZUZhY3RvcnkgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkd1YXJkIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXIgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlcic7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBNYXAgb2Yge0VudGl0eU9wfSB0byByZWR1Y2VyIG1ldGhvZCBmb3IgdGhlIG9wZXJhdGlvbi5cbiAqIElmIGFuIG9wZXJhdGlvbiBpcyBtaXNzaW5nLCBjYWxsZXIgc2hvdWxkIHJldHVybiB0aGUgY29sbGVjdGlvbiBmb3IgdGhhdCByZWR1Y2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kTWFwPFQ+IHtcbiAgW21ldGhvZDogc3RyaW5nXTogKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSA9PiBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xufVxuXG4vKipcbiAqIEJhc2UgaW1wbGVtZW50YXRpb24gb2YgcmVkdWNlciBtZXRob2RzIGZvciBhbiBlbnRpdHkgY29sbGVjdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kczxUPiB7XG4gIHByb3RlY3RlZCBhZGFwdGVyOiBFbnRpdHlBZGFwdGVyPFQ+O1xuICBwcm90ZWN0ZWQgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuICAvKiogVHJ1ZSBpZiB0aGlzIGNvbGxlY3Rpb24gdHJhY2tzIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICBwcm90ZWN0ZWQgaXNDaGFuZ2VUcmFja2luZzogYm9vbGVhbjtcblxuICAvKiogRXh0cmFjdCB0aGUgcHJpbWFyeSBrZXkgKGlkKTsgZGVmYXVsdCB0byBgaWRgICovXG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuXG4gIC8qKlxuICAgKiBUcmFjayBjaGFuZ2VzIHRvIGVudGl0aWVzIHNpbmNlIHRoZSBsYXN0IHF1ZXJ5IG9yIHNhdmVcbiAgICogQ2FuIHJldmVydCBzb21lIG9yIGFsbCBvZiB0aG9zZSBjaGFuZ2VzXG4gICAqL1xuICBlbnRpdHlDaGFuZ2VUcmFja2VyOiBFbnRpdHlDaGFuZ2VUcmFja2VyPFQ+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgaWRgOiB0aGUgcHJpbWFyeSBrZXkgYW5kXG4gICAqIGBjaGFuZ2VzYDogdGhlIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkgb2YgY2hhbmdlcykuXG4gICAqL1xuICBwcm90ZWN0ZWQgdG9VcGRhdGU6IChlbnRpdHk6IFBhcnRpYWw8VD4pID0+IFVwZGF0ZTxUPjtcblxuICAvKipcbiAgICogRGljdGlvbmFyeSBvZiB0aGUge0VudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc30gZm9yIHRoaXMgZW50aXR5IHR5cGUsXG4gICAqIGtleWVkIGJ5IHRoZSB7RW50aXR5T3B9XG4gICAqL1xuICByZWFkb25seSBtZXRob2RzOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZE1hcDxUPiA9IHtcbiAgICBbRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1RdOiB0aGlzLmNhbmNlbFBlcnNpc3QuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9BTExdOiB0aGlzLnF1ZXJ5QWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0FMTF9FUlJPUl06IHRoaXMucXVlcnlBbGxFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9BTExfU1VDQ0VTU106IHRoaXMucXVlcnlBbGxTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUVVFUllfQllfS0VZXTogdGhpcy5xdWVyeUJ5S2V5LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0JZX0tFWV9FUlJPUl06IHRoaXMucXVlcnlCeUtleUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0JZX0tFWV9TVUNDRVNTXTogdGhpcy5xdWVyeUJ5S2V5U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX0xPQURdOiB0aGlzLnF1ZXJ5TG9hZC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9MT0FEX0VSUk9SXTogdGhpcy5xdWVyeUxvYWRFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9MT0FEX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5TG9hZFN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9NQU5ZXTogdGhpcy5xdWVyeU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfTUFOWV9FUlJPUl06IHRoaXMucXVlcnlNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfTUFOWV9TVUNDRVNTXTogdGhpcy5xdWVyeU1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9BRERfTUFOWV06IHRoaXMuc2F2ZUFkZE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9BRERfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZUFkZE1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVBZGRNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX09ORV06IHRoaXMuc2F2ZUFkZE9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9PTkVfRVJST1JdOiB0aGlzLnNhdmVBZGRPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZUFkZE9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZXTogdGhpcy5zYXZlRGVsZXRlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlRGVsZXRlTWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZURlbGV0ZU1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FXTogdGhpcy5zYXZlRGVsZXRlT25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX09ORV9FUlJPUl06IHRoaXMuc2F2ZURlbGV0ZU9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlRGVsZXRlT25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX01BTlldOiB0aGlzLnNhdmVVcGRhdGVNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX01BTllfRVJST1JdOiB0aGlzLnNhdmVVcGRhdGVNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTXTogdGhpcy5zYXZlVXBkYXRlTWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9PTkVdOiB0aGlzLnNhdmVVcGRhdGVPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfT05FX0VSUk9SXTogdGhpcy5zYXZlVXBkYXRlT25lRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfT05FX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcGRhdGVPbmVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV06IHRoaXMuc2F2ZVVwc2VydE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZVVwc2VydE1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcHNlcnRNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX09ORV06IHRoaXMuc2F2ZVVwc2VydE9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkVfRVJST1JdOiB0aGlzLnNhdmVVcHNlcnRPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZVVwc2VydE9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIC8vIERvIG5vdGhpbmcgb24gc2F2ZSBlcnJvcnMgZXhjZXB0IHR1cm4gdGhlIGxvYWRpbmcgZmxhZyBvZmYuXG4gICAgLy8gU2VlIHRoZSBDaGFuZ2VUcmFja2VyTWV0YVJlZHVjZXJzXG4gICAgLy8gT3IgdGhlIGFwcCBjb3VsZCBsaXN0ZW4gZm9yIHRob3NlIGVycm9ycyBhbmQgZG8gc29tZXRoaW5nXG5cbiAgICAvLy8gY2FjaGUgb25seSBvcGVyYXRpb25zIC8vL1xuXG4gICAgW0VudGl0eU9wLkFERF9BTExdOiB0aGlzLmFkZEFsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5BRERfTUFOWV06IHRoaXMuYWRkTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5BRERfT05FXTogdGhpcy5hZGRPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5SRU1PVkVfQUxMXTogdGhpcy5yZW1vdmVBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUkVNT1ZFX01BTlldOiB0aGlzLnJlbW92ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUkVNT1ZFX09ORV06IHRoaXMucmVtb3ZlT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuVVBEQVRFX01BTlldOiB0aGlzLnVwZGF0ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVVBEQVRFX09ORV06IHRoaXMudXBkYXRlT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuVVBTRVJUX01BTlldOiB0aGlzLnVwc2VydE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVVBTRVJUX09ORV06IHRoaXMudXBzZXJ0T25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuQ09NTUlUX0FMTF06IHRoaXMuY29tbWl0QWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkNPTU1JVF9NQU5ZXTogdGhpcy5jb21taXRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkNPTU1JVF9PTkVdOiB0aGlzLmNvbW1pdE9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VTkRPX0FMTF06IHRoaXMudW5kb0FsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VTkRPX01BTlldOiB0aGlzLnVuZG9NYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVORE9fT05FXTogdGhpcy51bmRvT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0VUX0NIQU5HRV9TVEFURV06IHRoaXMuc2V0Q2hhbmdlU3RhdGUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0NPTExFQ1RJT05dOiB0aGlzLnNldENvbGxlY3Rpb24uYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0ZJTFRFUl06IHRoaXMuc2V0RmlsdGVyLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNFVF9MT0FERURdOiB0aGlzLnNldExvYWRlZC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfTE9BRElOR106IHRoaXMuc2V0TG9hZGluZy5iaW5kKHRoaXMpLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcHVibGljIGRlZmluaXRpb246IEVudGl0eURlZmluaXRpb248VD4sXG4gICAgLypcbiAgICAgKiBUcmFjayBjaGFuZ2VzIHRvIGVudGl0aWVzIHNpbmNlIHRoZSBsYXN0IHF1ZXJ5IG9yIHNhdmVcbiAgICAgKiBDYW4gcmV2ZXJ0IHNvbWUgb3IgYWxsIG9mIHRob3NlIGNoYW5nZXNcbiAgICAgKi9cbiAgICBlbnRpdHlDaGFuZ2VUcmFja2VyPzogRW50aXR5Q2hhbmdlVHJhY2tlcjxUPlxuICApIHtcbiAgICB0aGlzLmFkYXB0ZXIgPSBkZWZpbml0aW9uLmVudGl0eUFkYXB0ZXI7XG4gICAgdGhpcy5pc0NoYW5nZVRyYWNraW5nID0gZGVmaW5pdGlvbi5ub0NoYW5nZVRyYWNraW5nICE9PSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0SWQgPSBkZWZpbml0aW9uLnNlbGVjdElkO1xuXG4gICAgdGhpcy5ndWFyZCA9IG5ldyBFbnRpdHlBY3Rpb25HdWFyZChlbnRpdHlOYW1lLCB0aGlzLnNlbGVjdElkKTtcbiAgICB0aGlzLnRvVXBkYXRlID0gdG9VcGRhdGVGYWN0b3J5KHRoaXMuc2VsZWN0SWQpO1xuXG4gICAgdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyID1cbiAgICAgIGVudGl0eUNoYW5nZVRyYWNrZXIgfHxcbiAgICAgIG5ldyBFbnRpdHlDaGFuZ2VUcmFja2VyQmFzZTxUPih0aGlzLmFkYXB0ZXIsIHRoaXMuc2VsZWN0SWQpO1xuICB9XG5cbiAgLyoqIENhbmNlbCBhIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAqL1xuICBwcm90ZWN0ZWQgY2FuY2VsUGVyc2lzdChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8vICNyZWdpb24gcXVlcnkgb3BlcmF0aW9uc1xuXG4gIHByb3RlY3RlZCBxdWVyeUFsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlBbGxFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgcXVlcnkgcmVzdWx0cyBwZXIgdGhlIE1lcmdlU3RyYXRlZ3lcbiAgICogU2V0cyBsb2FkaW5nIGZsYWcgdG8gZmFsc2UgYW5kIGxvYWRlZCBmbGFnIHRvIHRydWUuXG4gICAqL1xuICBwcm90ZWN0ZWQgcXVlcnlBbGxTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKSxcbiAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlCeUtleShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZz5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlCeUtleUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QnlLZXlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPVxuICAgICAgZGF0YSA9PSBudWxsXG4gICAgICAgID8gY29sbGVjdGlvblxuICAgICAgICA6IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICAgICAgICAgIFtkYXRhXSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICAgICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlMb2FkKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUxvYWRFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogU2V0cyBsb2FkZWQgZmxhZyB0byB0cnVlLCBsb2FkaW5nIGZsYWcgdG8gZmFsc2UsXG4gICAqIGFuZCBjbGVhcnMgY2hhbmdlU3RhdGUgZm9yIHRoZSBlbnRpcmUgY29sbGVjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBxdWVyeUxvYWRTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmFkYXB0ZXIuc2V0QWxsKGRhdGEsIGNvbGxlY3Rpb24pLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VTdGF0ZToge30sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeU1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeU1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBxdWVyeSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIHNhdmVBZGRNYW55XG4gIC8qKlxuICAgKiBTYXZlIG11bHRpcGxlIG5ldyBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBpbW1lZGlhdGVseS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gd2hpY2ggdGhlIGVudGl0aWVzIHNob3VsZCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGFycmF5IG9mIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBtdXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tBZGRNYW55KFxuICAgICAgICBlbnRpdGllcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIuYWRkTWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBuZXcgZW50aXRpZXMgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBuZXcgZW50aXRpZXMgYXJlIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVBZGRNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkT25lXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgbmV3IGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgYWRkZWQgZW50aXRpZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKSxcbiAgICogYW5kIG1heSBldmVuIHJldHVybiBhZGRpdGlvbmFsIG5ldyBlbnRpdGllcy5cbiAgICogVGhlcmVmb3JlLCB1cHNlcnQgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqIE5vdGU6IHNhdmVBZGRNYW55U3VjY2VzcyBkaWZmZXJzIGZyb20gc2F2ZUFkZE9uZVN1Y2Nlc3Mgd2hlbiBvcHRpbWlzdGljLlxuICAgKiBzYXZlQWRkT25lU3VjY2VzcyB1cGRhdGVzIChub3QgdXBzZXJ0cykgd2l0aCB0aGUgbG9uZSBlbnRpdHkgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBUaGVyZSBpcyBubyBlZmZlY3QgaWYgdGhlIGVudGl0eSBpcyBub3QgYWxyZWFkeSBpbiBjYWNoZS5cbiAgICogc2F2ZUFkZE1hbnlTdWNjZXNzIHdpbGwgYWRkIGFuIGVudGl0eSBpZiBpdCBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwc2VydHMoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZUFkZHMoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE9uZVxuICAvKipcbiAgICogU2F2ZSBhIG5ldyBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgZW50aXR5IGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXR5IHNob3VsZCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGVudGl0eS5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IG11c3QgaGF2ZSBhIGtleS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE9uZShcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5hZGRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIGEgbmV3IGVudGl0eSBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaXMgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0eSBpcyBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkT25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIGEgbmV3IGVudGl0eSB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXR5IGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdHkgaXMgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWUgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyBhZGQgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKSB7XG4gICAgLy8gRm9yIHBlc3NpbWlzdGljIHNhdmUsIGVuc3VyZSB0aGUgc2VydmVyIGdlbmVyYXRlZCB0aGUgcHJpbWFyeSBrZXkgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc2VuZCBvbmUuXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCB1cGRhdGU6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiA9IHRoaXMudG9VcGRhdGUoZW50aXR5KTtcbiAgICAgIC8vIEFsd2F5cyB1cGRhdGUgdGhlIGNhY2hlIHdpdGggYWRkZWQgZW50aXR5IHJldHVybmVkIGZyb20gc2VydmVyXG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgICAgIFt1cGRhdGVdLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICBmYWxzZSAvKm5ldmVyIHNraXAqL1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVBZGRzKFxuICAgICAgICBbZW50aXR5XSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE9uZVxuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE1hbnlcbiAgLy8gVE9ETyBNQU5ZXG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVEZWxldGVPbmVcbiAgLyoqXG4gICAqIERlbGV0ZSBhbiBlbnRpdHkgZnJvbSB0aGUgc2VydmVyIGJ5IGtleSBhbmQgcmVtb3ZlIGl0IGZyb20gdGhlIGNvbGxlY3Rpb24gKGlmIHByZXNlbnQpLlxuICAgKiBJZiB0aGUgZW50aXR5IGlzIGFuIHVuc2F2ZWQgbmV3IGVudGl0eSwgcmVtb3ZlIGl0IGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHlcbiAgICogYW5kIHNraXAgdGhlIHNlcnZlciBkZWxldGUgcmVxdWVzdC5cbiAgICogQW4gb3B0aW1pc3RpYyBzYXZlIHJlbW92ZXMgYW4gZXhpc3RpbmcgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHk7XG4gICAqIGEgcGVzc2ltaXN0aWMgc2F2ZSByZW1vdmVzIGl0IGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgc3VjY2Vzc2Z1bCBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFdpbGwgcmVtb3ZlIHRoZSBlbnRpdHkgd2l0aCB0aGlzIGtleSBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYSBwcmltYXJ5IGtleSBvciBhbiBlbnRpdHkgd2l0aCBhIGtleTtcbiAgICogdGhpcyByZWR1Y2VyIGV4dHJhY3RzIHRoZSBrZXkgZnJvbSB0aGUgZW50aXR5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXIgfCBzdHJpbmcgfCBUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB0b0RlbGV0ZSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBjb25zdCBkZWxldGVJZCA9XG4gICAgICB0eXBlb2YgdG9EZWxldGUgPT09ICdvYmplY3QnXG4gICAgICAgID8gdGhpcy5zZWxlY3RJZCh0b0RlbGV0ZSlcbiAgICAgICAgOiAodG9EZWxldGUgYXMgc3RyaW5nIHwgbnVtYmVyKTtcbiAgICBjb25zdCBjaGFuZ2UgPSBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlW2RlbGV0ZUlkXTtcbiAgICAvLyBJZiBlbnRpdHkgaXMgYWxyZWFkeSB0cmFja2VkIC4uLlxuICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgIGlmIChjaGFuZ2UuY2hhbmdlVHlwZSA9PT0gQ2hhbmdlVHlwZS5BZGRlZCkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGFkZGVkIGVudGl0eSBpbW1lZGlhdGVseSBhbmQgZm9yZ2V0IGFib3V0IGl0cyBjaGFuZ2VzICh2aWEgY29tbWl0KS5cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRPbmUoZGVsZXRlSWQsIGNvbGxlY3Rpb24pO1xuICAgICAgICAvLyBTaG91bGQgbm90IHdhc3RlIGVmZm9ydCB0cnlpbmcgdG8gZGVsZXRlIG9uIHRoZSBzZXJ2ZXIgYmVjYXVzZSBpdCBjYW4ndCBiZSB0aGVyZS5cbiAgICAgICAgYWN0aW9uLnBheWxvYWQuc2tpcCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZS10cmFjayBpdCBhcyBhIGRlbGV0ZSwgZXZlbiBpZiB0cmFja2luZyBpcyB0dXJuZWQgb2ZmIGZvciB0aGlzIGNhbGwuXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICAgICAgZGVsZXRlSWQsXG4gICAgICAgICAgY29sbGVjdGlvblxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG9wdGltaXN0aWMgZGVsZXRlLCB0cmFjayBjdXJyZW50IHN0YXRlIGFuZCByZW1vdmUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlT25lKFxuICAgICAgICBkZWxldGVJZCxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGRlbGV0ZUlkIGFzIHN0cmluZywgY29sbGVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBkZWxldGUgdGhlIGVudGl0eSBvbiB0aGUgc2VydmVyIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0eSBjb3VsZCBzdGlsbCBiZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGlzIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlT25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgZW50aXR5IG9uIHRoZSBzZXJ2ZXIuIFRoZSBrZXkgb2YgdGhlIGRlbGV0ZWQgZW50aXR5IGlzIGluIHRoZSBhY3Rpb24gcGF5bG9hZCBkYXRhLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGlmIHRoZSBlbnRpdHkgaXMgc3RpbGwgaW4gdGhlIGNvbGxlY3Rpb24gaXQgd2lsbCBiZSByZW1vdmVkLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBoYXMgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlT25lU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZz5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGVsZXRlSWQgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZURlbGV0ZXMoXG4gICAgICAgIFtkZWxldGVJZF0sXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFBlc3NpbWlzdGljOiBpZ25vcmUgbWVyZ2VTdHJhdGVneS4gUmVtb3ZlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uIGFuZCBmcm9tIGNoYW5nZSB0cmFja2luZy5cbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGRlbGV0ZUlkIGFzIHN0cmluZywgY29sbGVjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShkZWxldGVJZCwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVEZWxldGVPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVEZWxldGVNYW55XG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIGJ5IGtleSBhbmQgcmVtb3ZlIHRoZW0gZnJvbSB0aGUgY29sbGVjdGlvbiAoaWYgcHJlc2VudCkuXG4gICAqIFJlbW92ZXMgdW5zYXZlZCBuZXcgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseVxuICAgKiBidXQgdGhlIGlkIGlzIHN0aWxsIHNlbnQgdG8gdGhlIHNlcnZlciBmb3IgZGVsZXRpb24gZXZlbiB0aG91Z2ggdGhlIHNlcnZlciB3aWxsIG5vdCBmaW5kIHRoYXQgZW50aXR5LlxuICAgKiBUaGVyZWZvcmUsIHRoZSBzZXJ2ZXIgbXVzdCBiZSB3aWxsaW5nIHRvIGlnbm9yZSBhIGRlbGV0ZSByZXF1ZXN0IGZvciBhbiBlbnRpdHkgaXQgY2Fubm90IGZpbmQuXG4gICAqIEFuIG9wdGltaXN0aWMgc2F2ZSByZW1vdmVzIGV4aXN0aW5nIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHk7XG4gICAqIGEgcGVzc2ltaXN0aWMgc2F2ZSByZW1vdmVzIHRoZW0gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzZnVsIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gUmVtb3ZlcyBlbnRpdGllcyBmcm9tIHRoaXMgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGFycmF5IG9mIHByaW1hcnkga2V5cyBvciBlbnRpdGllcyB3aXRoIGEga2V5O1xuICAgKiB0aGlzIHJlZHVjZXIgZXh0cmFjdHMgdGhlIGtleSBmcm9tIHRoZSBlbnRpdHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjwobnVtYmVyIHwgc3RyaW5nIHwgVClbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGVsZXRlSWRzID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLm1hcCgoZCkgPT5cbiAgICAgIHR5cGVvZiBkID09PSAnb2JqZWN0JyA/IHRoaXMuc2VsZWN0SWQoZCkgOiAoZCBhcyBzdHJpbmcgfCBudW1iZXIpXG4gICAgKTtcbiAgICBkZWxldGVJZHMuZm9yRWFjaCgoZGVsZXRlSWQpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5nZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGVbZGVsZXRlSWRdO1xuICAgICAgLy8gSWYgZW50aXR5IGlzIGFscmVhZHkgdHJhY2tlZCAuLi5cbiAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBhZGRlZCBlbnRpdHkgaW1tZWRpYXRlbHkgYW5kIGZvcmdldCBhYm91dCBpdHMgY2hhbmdlcyAodmlhIGNvbW1pdCkuXG4gICAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShkZWxldGVJZCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgLy8gU2hvdWxkIG5vdCB3YXN0ZSBlZmZvcnQgdHJ5aW5nIHRvIGRlbGV0ZSBvbiB0aGUgc2VydmVyIGJlY2F1c2UgaXQgY2FuJ3QgYmUgdGhlcmUuXG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQuc2tpcCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmUtdHJhY2sgaXQgYXMgYSBkZWxldGUsIGV2ZW4gaWYgdHJhY2tpbmcgaXMgdHVybmVkIG9mZiBmb3IgdGhpcyBjYWxsLlxuICAgICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICAgICAgICBkZWxldGVJZCxcbiAgICAgICAgICAgIGNvbGxlY3Rpb25cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gSWYgb3B0aW1pc3RpYyBkZWxldGUsIHRyYWNrIGN1cnJlbnQgc3RhdGUgYW5kIHJlbW92ZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVNYW55KFxuICAgICAgICBkZWxldGVJZHMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoZGVsZXRlSWRzIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBkZWxldGUgdGhlIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgY291bGQgc3RpbGwgYmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGFyZSBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgZGVsZXRlZCBlbnRpdGllcyBvbiB0aGUgc2VydmVyLiBUaGUga2V5cyBvZiB0aGUgZGVsZXRlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGFjdGlvbiBwYXlsb2FkIGRhdGEuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgZW50aXRpZXMgdGhhdCBhcmUgc3RpbGwgaW4gdGhlIGNvbGxlY3Rpb24gd2lsbCBiZSByZW1vdmVkLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGhhdmUgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlTWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjwobnVtYmVyIHwgc3RyaW5nKVtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkZWxldGVJZHMgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZURlbGV0ZXMoXG4gICAgICAgIGRlbGV0ZUlkcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUGVzc2ltaXN0aWM6IGlnbm9yZSBtZXJnZVN0cmF0ZWd5LiBSZW1vdmUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb24gYW5kIGZyb20gY2hhbmdlIHRyYWNraW5nLlxuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KGRlbGV0ZUlkcyBhcyBzdHJpbmdbXSwgY29sbGVjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE1hbnkoZGVsZXRlSWRzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZURlbGV0ZU1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVVcGRhdGVPbmVcbiAgLyoqXG4gICAqIFNhdmUgYW4gdXBkYXRlIHRvIGFuIGV4aXN0aW5nIGVudGl0eS5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXR5IGltbWVkaWF0ZWx5LCBiZWZvcmUgdGhlIHNhdmUgcmVxdWVzdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4ge1VwZGF0ZTxUPn1cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU9uZShcbiAgICAgICAgdXBkYXRlLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cGRhdGVPbmUodXBkYXRlLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byB1cGRhdGUgdGhlIGVudGl0eSBvbiB0aGUgc2VydmVyIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBpcyBpbiB0aGUgcHJlLXNhdmUgc3RhdGVcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdhcyB1cGRhdGVkXG4gICAqIGFuZCB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgdGhlIHVwZGF0ZWQgZW50aXR5IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCBkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgd2FzIGFscmVhZHkgdXBkYXRlZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWUgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyB1cGRhdGUgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsIGFuZFxuICAgKiB0aGUgdXBkYXRlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4gVXBkYXRlUmVzcG9uc2U8VD4gdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgVXBkYXRlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICogWW91IG11c3QgaW5jbHVkZSBhbiBVcGRhdGVSZXNwb25zZSBldmVuIGlmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLFxuICAgKiB0byBlbnN1cmUgdGhhdCB0aGUgY2hhbmdlIHRyYWNraW5nIGlzIHByb3Blcmx5IHJlc2V0LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZVJlc3BvbnNlKGFjdGlvbik7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID0gdGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBkYXRlcyhcbiAgICAgIFt1cGRhdGVdLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICBpc09wdGltaXN0aWMgLypza2lwIHVuY2hhbmdlZCBpZiBvcHRpbWlzdGljICovXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBkYXRlT25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlVXBkYXRlTWFueVxuICAvKipcbiAgICogU2F2ZSB1cGRhdGVkIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0aWVzIGltbWVkaWF0ZWx5LCBiZWZvcmUgdGhlIHNhdmUgcmVxdWVzdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4gYXJyYXkgb2Yge1VwZGF0ZTxUPn0uXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD5bXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgdXBkYXRlcyA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlcyhhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU1hbnkoXG4gICAgICAgIHVwZGF0ZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gdXBkYXRlIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gYXJlIGluIHRoZSBwcmUtc2F2ZSBzdGF0ZVxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3ZXJlIHVwZGF0ZWRcbiAgICogYW5kIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgdGhlIHVwZGF0ZWQgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2lsbCBiZSB1cGRhdGVkIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2VyZSBhbHJlYWR5IHVwZGF0ZWQuXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIHVwZGF0ZSB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgaWYgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhIHdoaWNoLCBtdXN0IGJlIGFuIGFycmF5IG9mIFVwZGF0ZVJlc3BvbnNlPFQ+LlxuICAgKiBZb3UgbXVzdCBpbmNsdWRlIGFuIFVwZGF0ZVJlc3BvbnNlIGZvciBldmVyeSBVcGRhdGUgc2VudCB0byB0aGUgc2VydmVyLFxuICAgKiBldmVuIGlmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB0byBlbnN1cmUgdGhhdCB0aGUgY2hhbmdlIHRyYWNraW5nIGlzIHByb3Blcmx5IHJlc2V0LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVSZXNwb25zZXMoYWN0aW9uKTtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPSB0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcGRhdGVzKFxuICAgICAgdXBkYXRlcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgZmFsc2UgLyogbmV2ZXIgc2tpcCAqL1xuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZVVwZGF0ZU1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVVcHNlcnRPbmVcbiAgLyoqXG4gICAqIFNhdmUgYSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCBkZWxheSBhZGRpbmcgdG8gY29sbGVjdGlvbiB1bnRpbCBzZXJ2ZXIgYWNrbm93bGVkZ2VzIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseTsgYWRkIGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXR5IHNob3VsZCBiZSB1cHNlcnRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGEgd2hvbGUgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgbXVzdCBoYXZlIGl0cyBrZXkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRPbmUoXG4gICAgICAgIGVudGl0eSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0T25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBuZXcgb3IgZXhpc3RpbmcgZW50aXR5IGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgbmV3IG9yIHVwZGF0ZWQgZW50aXR5IGlzIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE9uZUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBhZGQgdGhlIGVudGl0aWVzIGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdGllcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZXMgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyBhZGQgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKSB7XG4gICAgLy8gRm9yIHBlc3NpbWlzdGljIHNhdmUsIGVuc3VyZSB0aGUgc2VydmVyIGdlbmVyYXRlZCB0aGUgcHJpbWFyeSBrZXkgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc2VuZCBvbmUuXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIC8vIEFsd2F5cyB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdXBzZXJ0ZWQgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzZXJ2ZXJcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwc2VydHMoXG4gICAgICBbZW50aXR5XSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBzZXJ0T25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlVXBzZXJ0TWFueVxuICAvKipcbiAgICogU2F2ZSBtdWx0aXBsZSBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdGllcyBzaG91bGQgYmUgdXBzZXJ0ZWQuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhbiBhcnJheSBvZiB3aG9sZSBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgbXVzdCBoYXZlIHRoZWlyIGtleXMuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTsgLy8gZW5zdXJlIHRoZSBlbnRpdHkgaGFzIGEgUEtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0TWFueShcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHNhdmUgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgbmV3IGVudGl0aWVzIGFyZSBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIHVuc2F2ZWQgZW50aXRpZXMgYXJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcHNlcnRNYW55RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0aWVzIGFyZSBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIC8vIEFsd2F5cyB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdXBzZXJ0ZWQgZW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzZXJ2ZXJcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwc2VydHMoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBzZXJ0TWFueVxuXG4gIC8vICNlbmRyZWdpb24gc2F2ZSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBjYWNoZS1vbmx5IG9wZXJhdGlvbnNcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIFNldHMgbG9hZGVkIGZsYWcgdG8gdHJ1ZS5cbiAgICogTWVyZ2VzIHF1ZXJ5IHJlc3VsdHMsIHByZXNlcnZpbmcgdW5zYXZlZCBjaGFuZ2VzXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkQWxsKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5hZGFwdGVyLnNldEFsbChlbnRpdGllcywgY29sbGVjdGlvbiksXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZE1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE1hbnkoXG4gICAgICBlbnRpdGllcyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmFkZE1hbnkoZW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZE9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkT25lKFxuICAgICAgZW50aXR5LFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuYWRkT25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlcltdIHwgc3RyaW5nW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBlbnRpdHkga2V5c1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLmd1YXJkLm11c3RCZUtleXMoYWN0aW9uKSBhcyBzdHJpbmdbXTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVNYW55KFxuICAgICAga2V5cyxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoa2V5cywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyBwYXlsb2FkIG11c3QgYmUgZW50aXR5IGtleVxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ3VhcmQubXVzdEJlS2V5KGFjdGlvbikgYXMgc3RyaW5nO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgIGtleSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShrZXksIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbW92ZUFsbChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmFkYXB0ZXIucmVtb3ZlQWxsKGNvbGxlY3Rpb24pLFxuICAgICAgbG9hZGVkOiBmYWxzZSwgLy8gT25seSBSRU1PVkVfQUxMIHNldHMgbG9hZGVkIHRvIGZhbHNlXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGNoYW5nZVN0YXRlOiB7fSwgLy8gQXNzdW1lIGNsZWFyaW5nIHRoZSBjb2xsZWN0aW9uIGFuZCBub3QgdHJ5aW5nIHRvIGRlbGV0ZSBhbGwgZW50aXRpZXNcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD5bXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGFuIGFycmF5IG9mIGBVcGRhdGVzPFQ+YCwgbm90IGVudGl0aWVzXG4gICAgY29uc3QgdXBkYXRlcyA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1VwZGF0ZU1hbnkoXG4gICAgICB1cGRhdGVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBhbiBgVXBkYXRlPFQ+YCwgbm90IGFuIGVudGl0eVxuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlT25lKFxuICAgICAgdXBkYXRlLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlT25lKHVwZGF0ZSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBzZXJ0TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gPHY2OiBwYXlsb2FkIG11c3QgYmUgYW4gYXJyYXkgb2YgYFVwZGF0ZXM8VD5gLCBub3QgZW50aXRpZXNcbiAgICAvLyB2Nis6IHBheWxvYWQgbXVzdCBiZSBhbiBhcnJheSBvZiBUXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0TWFueShcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBzZXJ0T25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gPHY2OiBwYXlsb2FkIG11c3QgYmUgYW4gYFVwZGF0ZTxUPmAsIG5vdCBhbiBlbnRpdHlcbiAgICAvLyB2Nis6IHBheWxvYWQgbXVzdCBiZSBhIFRcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1Vwc2VydE9uZShcbiAgICAgIGVudGl0eSxcbiAgICAgIGNvbGxlY3Rpb24sXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwc2VydE9uZShlbnRpdHksIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbW1pdEFsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRBbGwoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWl0TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRNYW55KFxuICAgICAgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWl0T25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRPbmUoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvQWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnVuZG9BbGwoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5kb01hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudW5kb01hbnkoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvT25lKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sIGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci51bmRvT25lKFxuICAgICAgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLFxuICAgICAgY29sbGVjdGlvblxuICAgICk7XG4gIH1cblxuICAvKiogRGFuZ2Vyb3VzOiBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNvbGxlY3Rpb24ncyBDaGFuZ2VTdGF0ZS4gVXNlIHJhcmVseSBhbmQgd2lzZWx5LiAqL1xuICBwcm90ZWN0ZWQgc2V0Q2hhbmdlU3RhdGUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxDaGFuZ2VTdGF0ZU1hcDxUPj5cbiAgKSB7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUgPT09IGNoYW5nZVN0YXRlXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERhbmdlcm91czogQ29tcGxldGVseSByZXBsYWNlIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBQcmltYXJpbHkgZm9yIHRlc3RpbmcgYW5kIHJlaHlkcmF0aW9uIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICogVXNlIHJhcmVseSBhbmQgd2lzZWx5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldENvbGxlY3Rpb24oXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlDb2xsZWN0aW9uPFQ+PlxuICApIHtcbiAgICBjb25zdCBuZXdDb2xsZWN0aW9uID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uID09PSBuZXdDb2xsZWN0aW9uID8gY29sbGVjdGlvbiA6IG5ld0NvbGxlY3Rpb247XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RmlsdGVyKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248YW55PlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyID09PSBmaWx0ZXJcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGZpbHRlciB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldExvYWRlZChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPGJvb2xlYW4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGxvYWRlZCA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSA9PT0gdHJ1ZSB8fCBmYWxzZTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5sb2FkZWQgPT09IGxvYWRlZFxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgbG9hZGVkIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGluZyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPGJvb2xlYW4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGbGFnKGNvbGxlY3Rpb24sIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGluZ0ZhbHNlKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldExvYWRpbmdUcnVlKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbiwgdHJ1ZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSBjb2xsZWN0aW9uJ3MgbG9hZGluZyBmbGFnICovXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LCBsb2FkaW5nOiBib29sZWFuKSB7XG4gICAgbG9hZGluZyA9IGxvYWRpbmcgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24ubG9hZGluZyA9PT0gbG9hZGluZ1xuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgbG9hZGluZyB9O1xuICB9XG4gIC8vICNlbmRyZWdpb24gQ2FjaGUtb25seSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIC8qKiBTYWZlbHkgZXh0cmFjdCBkYXRhIGZyb20gdGhlIEVudGl0eUFjdGlvbiBwYXlsb2FkICovXG4gIHByb3RlY3RlZCBleHRyYWN0RGF0YTxEID0gYW55PihhY3Rpb246IEVudGl0eUFjdGlvbjxEPik6IEQge1xuICAgIHJldHVybiAoYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZGF0YSkgYXMgRDtcbiAgfVxuXG4gIC8qKiBTYWZlbHkgZXh0cmFjdCBNZXJnZVN0cmF0ZWd5IGZyb20gRW50aXR5QWN0aW9uLiBTZXQgdG8gSWdub3JlQ2hhbmdlcyBpZiBjb2xsZWN0aW9uIGl0c2VsZiBpcyBub3QgdHJhY2tlZC4gKi9cbiAgcHJvdGVjdGVkIGV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgLy8gSWYgbm90IHRyYWNraW5nIHRoaXMgY29sbGVjdGlvbiwgYWx3YXlzIGlnbm9yZSBjaGFuZ2VzXG4gICAgcmV0dXJuIHRoaXMuaXNDaGFuZ2VUcmFja2luZ1xuICAgICAgPyBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5tZXJnZVN0cmF0ZWd5XG4gICAgICA6IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcztcbiAgfVxuXG4gIHByb3RlY3RlZCBpc09wdGltaXN0aWMoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuaXNPcHRpbWlzdGljID09PSB0cnVlO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG5cbi8qKlxuICogQ3JlYXRlcyB7RW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzfSBmb3IgYSBnaXZlbiBlbnRpdHkgdHlwZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlOiBFbnRpdHlEZWZpbml0aW9uU2VydmljZSkge31cblxuICAvKiogQ3JlYXRlIHRoZSAge0VudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc30gZm9yIHRoZSBuYW1lZCBlbnRpdHkgdHlwZSAqL1xuICBjcmVhdGU8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RNYXA8VD4ge1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcbiAgICBjb25zdCBtZXRob2RzQ2xhc3MgPSBuZXcgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzKFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIGRlZmluaXRpb25cbiAgICApO1xuXG4gICAgcmV0dXJuIG1ldGhvZHNDbGFzcy5tZXRob2RzO1xuICB9XG59XG4iXX0=