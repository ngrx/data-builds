/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/reducers/entity-collection-reducer-methods.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { ChangeType, } from './entity-collection';
import { EntityChangeTrackerBase } from './entity-change-tracker-base';
import { toUpdateFactory } from '../utils/utilities';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { EntityOp } from '../actions/entity-op';
import { MergeStrategy } from '../actions/merge-strategy';
/**
 * Map of {EntityOp} to reducer method for the operation.
 * If an operation is missing, caller should return the collection for that reducer.
 * @record
 * @template T
 */
export function EntityCollectionReducerMethodMap() { }
/**
 * Base implementation of reducer methods for an entity collection.
 * @template T
 */
export class EntityCollectionReducerMethods {
    /**
     * @param {?} entityName
     * @param {?} definition
     * @param {?=} entityChangeTracker
     */
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
    /**
     * Cancel a persistence operation
     * @protected
     * @param {?} collection
     * @return {?}
     */
    cancelPersist(collection) {
        return this.setLoadingFalse(collection);
    }
    // #region query operations
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    queryAll(collection) {
        return this.setLoadingTrue(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryAllError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryAllSuccess(collection, action) {
        /** @type {?} */
        const data = this.extractData(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        return Object.assign(Object.assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loaded: true, loading: false });
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryByKey(collection, action) {
        return this.setLoadingTrue(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryByKeyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryByKeySuccess(collection, action) {
        /** @type {?} */
        const data = this.extractData(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection =
            data == null
                ? collection
                : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    queryLoad(collection) {
        return this.setLoadingTrue(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryLoadError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryLoadSuccess(collection, action) {
        /** @type {?} */
        const data = this.extractData(action);
        return Object.assign(Object.assign({}, this.adapter.addAll(data, collection)), { loading: false, loaded: true, changeState: {} });
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryMany(collection, action) {
        return this.setLoadingTrue(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    queryManySuccess(collection, action) {
        /** @type {?} */
        const data = this.extractData(action);
        /** @type {?} */
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
     * @protected
     * @param {?} collection The collection to which the entities should be added.
     * @param {?} action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of entities.
     * If saving optimistically, the entities must have their keys.
     * @return {?}
     */
    saveAddMany(collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const entities = this.guard.mustBeEntities(action);
            // ensure the entity has a PK
            /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveAddManySuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        const entities = this.guard.mustBeEntities(action);
        /** @type {?} */
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
     * @protected
     * @param {?} collection The collection to which the entity should be added.
     * @param {?} action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an entity.
     * If saving optimistically, the entity must have a key.
     * @return {?}
     */
    saveAddOne(collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const entity = this.guard.mustBeEntity(action);
            // ensure the entity has a PK
            /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveAddOneSuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        const entity = this.guard.mustBeEntity(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
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
     * @protected
     * @param {?} collection Will remove the entity with this key from the collection.
     * @param {?} action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a primary key or an entity with a key;
     * this reducer extracts the key from the entity.
     * @return {?}
     */
    saveDeleteOne(collection, action) {
        /** @type {?} */
        const toDelete = this.extractData(action);
        /** @type {?} */
        const deleteId = typeof toDelete === 'object'
            ? this.selectId(toDelete)
            : ((/** @type {?} */ (toDelete)));
        /** @type {?} */
        const change = collection.changeState[deleteId];
        // If entity is already tracked ...
        if (change) {
            if (change.changeType === ChangeType.Added) {
                // Remove the added entity immediately and forget about its changes (via commit).
                collection = this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
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
            /** @type {?} */
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection, mergeStrategy);
            collection = this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveDeleteOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveDeleteOneSuccess(collection, action) {
        /** @type {?} */
        const deleteId = this.extractData(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes([deleteId], collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
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
     * @protected
     * @param {?} collection Removes entities from this collection.
     * @param {?} action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of primary keys or entities with a key;
     * this reducer extracts the key from the entity.
     * @return {?}
     */
    saveDeleteMany(collection, action) {
        /** @type {?} */
        const deleteIds = this.extractData(action).map((/**
         * @param {?} d
         * @return {?}
         */
        d => (typeof d === 'object' ? this.selectId(d) : ((/** @type {?} */ (d))))));
        deleteIds.forEach((/**
         * @param {?} deleteId
         * @return {?}
         */
        deleteId => {
            /** @type {?} */
            const change = collection.changeState[deleteId];
            // If entity is already tracked ...
            if (change) {
                if (change.changeType === ChangeType.Added) {
                    // Remove the added entity immediately and forget about its changes (via commit).
                    collection = this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
                    collection = this.entityChangeTracker.commitOne(deleteId, collection);
                    // Should not waste effort trying to delete on the server because it can't be there.
                    action.payload.skip = true;
                }
                else {
                    // Re-track it as a delete, even if tracking is turned off for this call.
                    collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
                }
            }
        }));
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(deleteIds, collection, mergeStrategy);
            collection = this.adapter.removeMany((/** @type {?} */ (deleteIds)), collection);
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveDeleteManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveDeleteManySuccess(collection, action) {
        /** @type {?} */
        const deleteIds = this.extractData(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(deleteIds, collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeMany((/** @type {?} */ (deleteIds)), collection);
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
     * @protected
     * @param {?} collection The collection to update
     * @param {?} action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an {Update<T>}
     * @return {?}
     */
    saveUpdateOne(collection, action) {
        /** @type {?} */
        const update = this.guard.mustBeUpdate(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
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
     * @protected
     * @param {?} collection The collection to update
     * @param {?} action The action payload holds options, including if the save is optimistic, and
     * the update data which, must be an UpdateResponse<T> that corresponds to the Update sent to the server.
     * You must include an UpdateResponse even if the save was optimistic,
     * to ensure that the change tracking is properly reset.
     * @return {?}
     */
    saveUpdateOneSuccess(collection, action) {
        /** @type {?} */
        const update = this.guard.mustBeUpdateResponse(action);
        /** @type {?} */
        const isOptimistic = this.isOptimistic(action);
        /** @type {?} */
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
     * @protected
     * @param {?} collection The collection to update
     * @param {?} action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of {Update<T>}.
     * @return {?}
     */
    saveUpdateMany(collection, action) {
        /** @type {?} */
        const updates = this.guard.mustBeUpdates(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
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
     * @protected
     * @param {?} collection The collection to update
     * @param {?} action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of UpdateResponse<T>.
     * You must include an UpdateResponse for every Update sent to the server,
     * even if the save was optimistic, to ensure that the change tracking is properly reset.
     * @return {?}
     */
    saveUpdateManySuccess(collection, action) {
        /** @type {?} */
        const updates = this.guard.mustBeUpdateResponses(action);
        /** @type {?} */
        const isOptimistic = this.isOptimistic(action);
        /** @type {?} */
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
     * @protected
     * @param {?} collection The collection to which the entity should be upserted.
     * @param {?} action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a whole entity.
     * If saving optimistically, the entity must have its key.
     * @return {?}
     */
    saveUpsertOne(collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const entity = this.guard.mustBeEntity(action);
            // ensure the entity has a PK
            /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveUpsertOneSuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        const entity = this.guard.mustBeEntity(action);
        /** @type {?} */
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
     * @protected
     * @param {?} collection The collection to which the entities should be upserted.
     * @param {?} action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of whole entities.
     * If saving optimistically, the entities must have their keys.
     * @return {?}
     */
    saveUpsertMany(collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            const entities = this.guard.mustBeEntities(action);
            // ensure the entity has a PK
            /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    saveUpsertManySuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        const entities = this.guard.mustBeEntities(action);
        /** @type {?} */
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
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    addAll(collection, action) {
        /** @type {?} */
        const entities = this.guard.mustBeEntities(action);
        return Object.assign(Object.assign({}, this.adapter.addAll(entities, collection)), { loading: false, loaded: true, changeState: {} });
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    addMany(collection, action) {
        /** @type {?} */
        const entities = this.guard.mustBeEntities(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
        return this.adapter.addMany(entities, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    addOne(collection, action) {
        /** @type {?} */
        const entity = this.guard.mustBeEntity(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
        return this.adapter.addOne(entity, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    removeMany(collection, action) {
        // payload must be entity keys
        /** @type {?} */
        const keys = (/** @type {?} */ (this.guard.mustBeKeys(action)));
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
        return this.adapter.removeMany(keys, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    removeOne(collection, action) {
        // payload must be entity key
        /** @type {?} */
        const key = (/** @type {?} */ (this.guard.mustBeKey(action)));
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
        return this.adapter.removeOne(key, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    removeAll(collection, action) {
        return Object.assign(Object.assign({}, this.adapter.removeAll(collection)), { loaded: false, loading: false, changeState: {} });
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    updateMany(collection, action) {
        // payload must be an array of `Updates<T>`, not entities
        /** @type {?} */
        const updates = this.guard.mustBeUpdates(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
        return this.adapter.updateMany(updates, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    updateOne(collection, action) {
        // payload must be an `Update<T>`, not an entity
        /** @type {?} */
        const update = this.guard.mustBeUpdate(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
        return this.adapter.updateOne(update, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    upsertMany(collection, action) {
        // <v6: payload must be an array of `Updates<T>`, not entities
        // v6+: payload must be an array of T
        /** @type {?} */
        const entities = this.guard.mustBeEntities(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
        return this.adapter.upsertMany(entities, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    upsertOne(collection, action) {
        // <v6: payload must be an `Update<T>`, not an entity
        // v6+: payload must be a T
        /** @type {?} */
        const entity = this.guard.mustBeEntity(action);
        /** @type {?} */
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
        return this.adapter.upsertOne(entity, collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    commitAll(collection) {
        return this.entityChangeTracker.commitAll(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    commitMany(collection, action) {
        return this.entityChangeTracker.commitMany(this.extractData(action), collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    commitOne(collection, action) {
        return this.entityChangeTracker.commitOne(this.extractData(action), collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    undoAll(collection) {
        return this.entityChangeTracker.undoAll(collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    undoMany(collection, action) {
        return this.entityChangeTracker.undoMany(this.extractData(action), collection);
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    undoOne(collection, action) {
        return this.entityChangeTracker.undoOne(this.extractData(action), collection);
    }
    /**
     * Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    setChangeState(collection, action) {
        /** @type {?} */
        const changeState = this.extractData(action);
        return collection.changeState === changeState
            ? collection
            : Object.assign(Object.assign({}, collection), { changeState });
    }
    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    setCollection(collection, action) {
        /** @type {?} */
        const newCollection = this.extractData(action);
        return collection === newCollection ? collection : newCollection;
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    setFilter(collection, action) {
        /** @type {?} */
        const filter = this.extractData(action);
        return collection.filter === filter
            ? collection
            : Object.assign(Object.assign({}, collection), { filter });
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    setLoaded(collection, action) {
        /** @type {?} */
        const loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : Object.assign(Object.assign({}, collection), { loaded });
    }
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    setLoading(collection, action) {
        return this.setLoadingFlag(collection, this.extractData(action));
    }
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    setLoadingFalse(collection) {
        return this.setLoadingFlag(collection, false);
    }
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    setLoadingTrue(collection) {
        return this.setLoadingFlag(collection, true);
    }
    /**
     * Set the collection's loading flag
     * @protected
     * @param {?} collection
     * @param {?} loading
     * @return {?}
     */
    setLoadingFlag(collection, loading) {
        loading = loading === true ? true : false;
        return collection.loading === loading
            ? collection
            : Object.assign(Object.assign({}, collection), { loading });
    }
    // #endregion Cache-only operations
    // #region helpers
    /**
     * Safely extract data from the EntityAction payload
     * @protected
     * @template D
     * @param {?} action
     * @return {?}
     */
    extractData(action) {
        return (/** @type {?} */ ((action.payload && action.payload.data)));
    }
    /**
     * Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked.
     * @protected
     * @param {?} action
     * @return {?}
     */
    extractMergeStrategy(action) {
        // If not tracking this collection, always ignore changes
        return this.isChangeTracking
            ? action.payload && action.payload.mergeStrategy
            : MergeStrategy.IgnoreChanges;
    }
    /**
     * @protected
     * @param {?} action
     * @return {?}
     */
    isOptimistic(action) {
        return action.payload && action.payload.isOptimistic === true;
    }
}
if (false) {
    /**
     * @type {?}
     * @protected
     */
    EntityCollectionReducerMethods.prototype.adapter;
    /**
     * @type {?}
     * @protected
     */
    EntityCollectionReducerMethods.prototype.guard;
    /**
     * True if this collection tracks unsaved changes
     * @type {?}
     * @protected
     */
    EntityCollectionReducerMethods.prototype.isChangeTracking;
    /**
     * Extract the primary key (id); default to `id`
     * @type {?}
     */
    EntityCollectionReducerMethods.prototype.selectId;
    /**
     * Track changes to entities since the last query or save
     * Can revert some or all of those changes
     * @type {?}
     */
    EntityCollectionReducerMethods.prototype.entityChangeTracker;
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `id`: the primary key and
     * `changes`: the entity (or partial entity of changes).
     * @type {?}
     * @protected
     */
    EntityCollectionReducerMethods.prototype.toUpdate;
    /**
     * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
     * keyed by the {EntityOp}
     * @type {?}
     */
    EntityCollectionReducerMethods.prototype.methods;
    /** @type {?} */
    EntityCollectionReducerMethods.prototype.entityName;
    /** @type {?} */
    EntityCollectionReducerMethods.prototype.definition;
}
/**
 * Creates {EntityCollectionReducerMethods} for a given entity type.
 */
export class EntityCollectionReducerMethodsFactory {
    /**
     * @param {?} entityDefinitionService
     */
    constructor(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /**
     * Create the  {EntityCollectionReducerMethods} for the named entity type
     * @template T
     * @param {?} entityName
     * @return {?}
     */
    create(entityName) {
        /** @type {?} */
        const definition = this.entityDefinitionService.getDefinition(entityName);
        /** @type {?} */
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerMethodsFactory.prototype.entityDefinitionService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFFTCxVQUFVLEdBRVgsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFHbkUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7Ozs7OztBQU8xRCxzREFLQzs7Ozs7QUFLRCxNQUFNLE9BQU8sOEJBQThCOzs7Ozs7SUErR3pDLFlBQ1MsVUFBa0IsRUFDbEIsVUFBK0I7SUFDdEM7OztPQUdHO0lBQ0gsbUJBQTRDO1FBTnJDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBcUI7Ozs7O1FBdkYvQixZQUFPLEdBQXdDO1lBQ3RELENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUV4RCxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDOUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3pELENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTdELENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNuRCxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM5RCxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWxFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMzRCxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRS9ELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMzRCxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRS9ELENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyRCxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hFLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFcEUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ25ELENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzlELENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFbEUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0QsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0RSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BFLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0QsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0RSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BFLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0QsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0RSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN6RCxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BFLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Ozs7O1lBUXhFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEQsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWhELENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFaEQsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVoRCxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVB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Ozs7Ozs7O0lBR1Msb0JBQW9CLENBQUMsTUFBb0I7UUFDakQseURBQXlEO1FBQ3pELE9BQU8sSUFBSSxDQUFDLGdCQUFnQjtZQUMxQixDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWE7WUFDaEQsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDbEMsQ0FBQzs7Ozs7O0lBRVMsWUFBWSxDQUFDLE1BQW9CO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUM7SUFDaEUsQ0FBQztDQUdGOzs7Ozs7SUFscUNDLGlEQUFvQzs7Ozs7SUFDcEMsK0NBQXNDOzs7Ozs7SUFFdEMsMERBQW9DOzs7OztJQUdwQyxrREFBd0I7Ozs7OztJQU14Qiw2REFBNEM7Ozs7Ozs7O0lBTzVDLGtEQUFzRDs7Ozs7O0lBTXRELGlEQW1GRTs7SUFHQSxvREFBeUI7O0lBQ3pCLG9EQUFzQzs7Ozs7QUF3akMxQyxNQUFNLE9BQU8scUNBQXFDOzs7O0lBQ2hELFlBQW9CLHVCQUFnRDtRQUFoRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO0lBQUcsQ0FBQzs7Ozs7OztJQUd4RSxNQUFNLENBQUksVUFBa0I7O2NBQ3BCLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUMzRCxVQUFVLENBQ1g7O2NBQ0ssWUFBWSxHQUFHLElBQUksOEJBQThCLENBQ3JELFVBQVUsRUFDVixVQUFVLENBQ1g7UUFFRCxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUM7SUFDOUIsQ0FBQzs7O1lBZkYsVUFBVTs7OztZQTNyQ0YsdUJBQXVCOzs7Ozs7O0lBNnJDbEIsd0VBQXdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7XG4gIENoYW5nZVN0YXRlTWFwLFxuICBDaGFuZ2VUeXBlLFxuICBFbnRpdHlDb2xsZWN0aW9uLFxufSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlIH0gZnJvbSAnLi9lbnRpdHktY2hhbmdlLXRyYWNrZXItYmFzZSc7XG5pbXBvcnQgeyB0b1VwZGF0ZUZhY3RvcnkgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkd1YXJkIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmltcG9ydCB7IEVudGl0eUNoYW5nZVRyYWNrZXIgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlcic7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBNYXAgb2Yge0VudGl0eU9wfSB0byByZWR1Y2VyIG1ldGhvZCBmb3IgdGhlIG9wZXJhdGlvbi5cbiAqIElmIGFuIG9wZXJhdGlvbiBpcyBtaXNzaW5nLCBjYWxsZXIgc2hvdWxkIHJldHVybiB0aGUgY29sbGVjdGlvbiBmb3IgdGhhdCByZWR1Y2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kTWFwPFQ+IHtcbiAgW21ldGhvZDogc3RyaW5nXTogKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKSA9PiBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xufVxuXG4vKipcbiAqIEJhc2UgaW1wbGVtZW50YXRpb24gb2YgcmVkdWNlciBtZXRob2RzIGZvciBhbiBlbnRpdHkgY29sbGVjdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kczxUPiB7XG4gIHByb3RlY3RlZCBhZGFwdGVyOiBFbnRpdHlBZGFwdGVyPFQ+O1xuICBwcm90ZWN0ZWQgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuICAvKiogVHJ1ZSBpZiB0aGlzIGNvbGxlY3Rpb24gdHJhY2tzIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICBwcm90ZWN0ZWQgaXNDaGFuZ2VUcmFja2luZzogYm9vbGVhbjtcblxuICAvKiogRXh0cmFjdCB0aGUgcHJpbWFyeSBrZXkgKGlkKTsgZGVmYXVsdCB0byBgaWRgICovXG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuXG4gIC8qKlxuICAgKiBUcmFjayBjaGFuZ2VzIHRvIGVudGl0aWVzIHNpbmNlIHRoZSBsYXN0IHF1ZXJ5IG9yIHNhdmVcbiAgICogQ2FuIHJldmVydCBzb21lIG9yIGFsbCBvZiB0aG9zZSBjaGFuZ2VzXG4gICAqL1xuICBlbnRpdHlDaGFuZ2VUcmFja2VyOiBFbnRpdHlDaGFuZ2VUcmFja2VyPFQ+O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgaWRgOiB0aGUgcHJpbWFyeSBrZXkgYW5kXG4gICAqIGBjaGFuZ2VzYDogdGhlIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkgb2YgY2hhbmdlcykuXG4gICAqL1xuICBwcm90ZWN0ZWQgdG9VcGRhdGU6IChlbnRpdHk6IFBhcnRpYWw8VD4pID0+IFVwZGF0ZTxUPjtcblxuICAvKipcbiAgICogRGljdGlvbmFyeSBvZiB0aGUge0VudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc30gZm9yIHRoaXMgZW50aXR5IHR5cGUsXG4gICAqIGtleWVkIGJ5IHRoZSB7RW50aXR5T3B9XG4gICAqL1xuICByZWFkb25seSBtZXRob2RzOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZE1hcDxUPiA9IHtcbiAgICBbRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1RdOiB0aGlzLmNhbmNlbFBlcnNpc3QuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9BTExdOiB0aGlzLnF1ZXJ5QWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0FMTF9FUlJPUl06IHRoaXMucXVlcnlBbGxFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9BTExfU1VDQ0VTU106IHRoaXMucXVlcnlBbGxTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUVVFUllfQllfS0VZXTogdGhpcy5xdWVyeUJ5S2V5LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0JZX0tFWV9FUlJPUl06IHRoaXMucXVlcnlCeUtleUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0JZX0tFWV9TVUNDRVNTXTogdGhpcy5xdWVyeUJ5S2V5U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX0xPQURdOiB0aGlzLnF1ZXJ5TG9hZC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9MT0FEX0VSUk9SXTogdGhpcy5xdWVyeUxvYWRFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9MT0FEX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5TG9hZFN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9NQU5ZXTogdGhpcy5xdWVyeU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfTUFOWV9FUlJPUl06IHRoaXMucXVlcnlNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfTUFOWV9TVUNDRVNTXTogdGhpcy5xdWVyeU1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9BRERfTUFOWV06IHRoaXMuc2F2ZUFkZE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9BRERfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZUFkZE1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVBZGRNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX09ORV06IHRoaXMuc2F2ZUFkZE9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9PTkVfRVJST1JdOiB0aGlzLnNhdmVBZGRPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZUFkZE9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZXTogdGhpcy5zYXZlRGVsZXRlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlRGVsZXRlTWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZURlbGV0ZU1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FXTogdGhpcy5zYXZlRGVsZXRlT25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX09ORV9FUlJPUl06IHRoaXMuc2F2ZURlbGV0ZU9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlRGVsZXRlT25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX01BTlldOiB0aGlzLnNhdmVVcGRhdGVNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX01BTllfRVJST1JdOiB0aGlzLnNhdmVVcGRhdGVNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9TVUNDRVNTXTogdGhpcy5zYXZlVXBkYXRlTWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9PTkVdOiB0aGlzLnNhdmVVcGRhdGVPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfT05FX0VSUk9SXTogdGhpcy5zYXZlVXBkYXRlT25lRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfT05FX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcGRhdGVPbmVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV06IHRoaXMuc2F2ZVVwc2VydE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZVVwc2VydE1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcHNlcnRNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX09ORV06IHRoaXMuc2F2ZVVwc2VydE9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkVfRVJST1JdOiB0aGlzLnNhdmVVcHNlcnRPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZVVwc2VydE9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIC8vIERvIG5vdGhpbmcgb24gc2F2ZSBlcnJvcnMgZXhjZXB0IHR1cm4gdGhlIGxvYWRpbmcgZmxhZyBvZmYuXG4gICAgLy8gU2VlIHRoZSBDaGFuZ2VUcmFja2VyTWV0YVJlZHVjZXJzXG4gICAgLy8gT3IgdGhlIGFwcCBjb3VsZCBsaXN0ZW4gZm9yIHRob3NlIGVycm9ycyBhbmQgZG8gc29tZXRoaW5nXG5cbiAgICAvLy8gY2FjaGUgb25seSBvcGVyYXRpb25zIC8vL1xuXG4gICAgW0VudGl0eU9wLkFERF9BTExdOiB0aGlzLmFkZEFsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5BRERfTUFOWV06IHRoaXMuYWRkTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5BRERfT05FXTogdGhpcy5hZGRPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5SRU1PVkVfQUxMXTogdGhpcy5yZW1vdmVBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUkVNT1ZFX01BTlldOiB0aGlzLnJlbW92ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUkVNT1ZFX09ORV06IHRoaXMucmVtb3ZlT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuVVBEQVRFX01BTlldOiB0aGlzLnVwZGF0ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVVBEQVRFX09ORV06IHRoaXMudXBkYXRlT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuVVBTRVJUX01BTlldOiB0aGlzLnVwc2VydE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVVBTRVJUX09ORV06IHRoaXMudXBzZXJ0T25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuQ09NTUlUX0FMTF06IHRoaXMuY29tbWl0QWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkNPTU1JVF9NQU5ZXTogdGhpcy5jb21taXRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkNPTU1JVF9PTkVdOiB0aGlzLmNvbW1pdE9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VTkRPX0FMTF06IHRoaXMudW5kb0FsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VTkRPX01BTlldOiB0aGlzLnVuZG9NYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVORE9fT05FXTogdGhpcy51bmRvT25lLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0VUX0NIQU5HRV9TVEFURV06IHRoaXMuc2V0Q2hhbmdlU3RhdGUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0NPTExFQ1RJT05dOiB0aGlzLnNldENvbGxlY3Rpb24uYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0ZJTFRFUl06IHRoaXMuc2V0RmlsdGVyLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNFVF9MT0FERURdOiB0aGlzLnNldExvYWRlZC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfTE9BRElOR106IHRoaXMuc2V0TG9hZGluZy5iaW5kKHRoaXMpLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcHVibGljIGRlZmluaXRpb246IEVudGl0eURlZmluaXRpb248VD4sXG4gICAgLypcbiAgICAgKiBUcmFjayBjaGFuZ2VzIHRvIGVudGl0aWVzIHNpbmNlIHRoZSBsYXN0IHF1ZXJ5IG9yIHNhdmVcbiAgICAgKiBDYW4gcmV2ZXJ0IHNvbWUgb3IgYWxsIG9mIHRob3NlIGNoYW5nZXNcbiAgICAgKi9cbiAgICBlbnRpdHlDaGFuZ2VUcmFja2VyPzogRW50aXR5Q2hhbmdlVHJhY2tlcjxUPlxuICApIHtcbiAgICB0aGlzLmFkYXB0ZXIgPSBkZWZpbml0aW9uLmVudGl0eUFkYXB0ZXI7XG4gICAgdGhpcy5pc0NoYW5nZVRyYWNraW5nID0gZGVmaW5pdGlvbi5ub0NoYW5nZVRyYWNraW5nICE9PSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0SWQgPSBkZWZpbml0aW9uLnNlbGVjdElkO1xuXG4gICAgdGhpcy5ndWFyZCA9IG5ldyBFbnRpdHlBY3Rpb25HdWFyZChlbnRpdHlOYW1lLCB0aGlzLnNlbGVjdElkKTtcbiAgICB0aGlzLnRvVXBkYXRlID0gdG9VcGRhdGVGYWN0b3J5KHRoaXMuc2VsZWN0SWQpO1xuXG4gICAgdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyID1cbiAgICAgIGVudGl0eUNoYW5nZVRyYWNrZXIgfHxcbiAgICAgIG5ldyBFbnRpdHlDaGFuZ2VUcmFja2VyQmFzZTxUPih0aGlzLmFkYXB0ZXIsIHRoaXMuc2VsZWN0SWQpO1xuICB9XG5cbiAgLyoqIENhbmNlbCBhIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiAqL1xuICBwcm90ZWN0ZWQgY2FuY2VsUGVyc2lzdChcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8vICNyZWdpb24gcXVlcnkgb3BlcmF0aW9uc1xuXG4gIHByb3RlY3RlZCBxdWVyeUFsbChjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlBbGxFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgcXVlcnkgcmVzdWx0cyBwZXIgdGhlIE1lcmdlU3RyYXRlZ3lcbiAgICogU2V0cyBsb2FkaW5nIGZsYWcgdG8gZmFsc2UgYW5kIGxvYWRlZCBmbGFnIHRvIHRydWUuXG4gICAqL1xuICBwcm90ZWN0ZWQgcXVlcnlBbGxTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKSxcbiAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlCeUtleShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZz5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlCeUtleUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QnlLZXlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPVxuICAgICAgZGF0YSA9PSBudWxsXG4gICAgICAgID8gY29sbGVjdGlvblxuICAgICAgICA6IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICAgICAgICAgIFtkYXRhXSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICAgICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlMb2FkKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUxvYWRFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogU2V0cyBsb2FkZWQgZmxhZyB0byB0cnVlLCBsb2FkaW5nIGZsYWcgdG8gZmFsc2UsXG4gICAqIGFuZCBjbGVhcnMgY2hhbmdlU3RhdGUgZm9yIHRoZSBlbnRpcmUgY29sbGVjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBxdWVyeUxvYWRTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmFkYXB0ZXIuYWRkQWxsKGRhdGEsIGNvbGxlY3Rpb24pLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VTdGF0ZToge30sXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeU1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeU1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBxdWVyeSBvcGVyYXRpb25zXG5cbiAgLy8gI3JlZ2lvbiBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIHNhdmVBZGRNYW55XG4gIC8qKlxuICAgKiBTYXZlIG11bHRpcGxlIG5ldyBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBpbW1lZGlhdGVseS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gd2hpY2ggdGhlIGVudGl0aWVzIHNob3VsZCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGFycmF5IG9mIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBtdXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tBZGRNYW55KFxuICAgICAgICBlbnRpdGllcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIuYWRkTWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBuZXcgZW50aXRpZXMgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBuZXcgZW50aXRpZXMgYXJlIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVBZGRNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkT25lXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgbmV3IGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgYWRkZWQgZW50aXRpZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKSxcbiAgICogYW5kIG1heSBldmVuIHJldHVybiBhZGRpdGlvbmFsIG5ldyBlbnRpdGllcy5cbiAgICogVGhlcmVmb3JlLCB1cHNlcnQgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqIE5vdGU6IHNhdmVBZGRNYW55U3VjY2VzcyBkaWZmZXJzIGZyb20gc2F2ZUFkZE9uZVN1Y2Nlc3Mgd2hlbiBvcHRpbWlzdGljLlxuICAgKiBzYXZlQWRkT25lU3VjY2VzcyB1cGRhdGVzIChub3QgdXBzZXJ0cykgd2l0aCB0aGUgbG9uZSBlbnRpdHkgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBUaGVyZSBpcyBubyBlZmZlY3QgaWYgdGhlIGVudGl0eSBpcyBub3QgYWxyZWFkeSBpbiBjYWNoZS5cbiAgICogc2F2ZUFkZE1hbnlTdWNjZXNzIHdpbGwgYWRkIGFuIGVudGl0eSBpZiBpdCBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwc2VydHMoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZUFkZHMoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE9uZVxuICAvKipcbiAgICogU2F2ZSBhIG5ldyBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgZW50aXR5IGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXR5IHNob3VsZCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGVudGl0eS5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IG11c3QgaGF2ZSBhIGtleS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE9uZShcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5hZGRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIGEgbmV3IGVudGl0eSBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaXMgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0eSBpcyBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkT25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIGEgbmV3IGVudGl0eSB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXR5IGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdHkgaXMgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWUgKGlmIGFueSlcbiAgICogQ2F1dGlvbjogaW4gYSByYWNlLCB0aGlzIHVwZGF0ZSBjb3VsZCBvdmVyd3JpdGUgdW5zYXZlZCB1c2VyIGNoYW5nZXMuXG4gICAqIFVzZSBwZXNzaW1pc3RpYyBhZGQgdG8gYXZvaWQgdGhpcyByaXNrLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKSB7XG4gICAgLy8gRm9yIHBlc3NpbWlzdGljIHNhdmUsIGVuc3VyZSB0aGUgc2VydmVyIGdlbmVyYXRlZCB0aGUgcHJpbWFyeSBrZXkgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc2VuZCBvbmUuXG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCB1cGRhdGU6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiA9IHRoaXMudG9VcGRhdGUoZW50aXR5KTtcbiAgICAgIC8vIEFsd2F5cyB1cGRhdGUgdGhlIGNhY2hlIHdpdGggYWRkZWQgZW50aXR5IHJldHVybmVkIGZyb20gc2VydmVyXG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgICAgIFt1cGRhdGVdLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgICBmYWxzZSAvKm5ldmVyIHNraXAqL1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVBZGRzKFxuICAgICAgICBbZW50aXR5XSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE9uZVxuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE1hbnlcbiAgLy8gVE9ETyBNQU5ZXG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVEZWxldGVPbmVcbiAgLyoqXG4gICAqIERlbGV0ZSBhbiBlbnRpdHkgZnJvbSB0aGUgc2VydmVyIGJ5IGtleSBhbmQgcmVtb3ZlIGl0IGZyb20gdGhlIGNvbGxlY3Rpb24gKGlmIHByZXNlbnQpLlxuICAgKiBJZiB0aGUgZW50aXR5IGlzIGFuIHVuc2F2ZWQgbmV3IGVudGl0eSwgcmVtb3ZlIGl0IGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHlcbiAgICogYW5kIHNraXAgdGhlIHNlcnZlciBkZWxldGUgcmVxdWVzdC5cbiAgICogQW4gb3B0aW1pc3RpYyBzYXZlIHJlbW92ZXMgYW4gZXhpc3RpbmcgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHk7XG4gICAqIGEgcGVzc2ltaXN0aWMgc2F2ZSByZW1vdmVzIGl0IGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgc3VjY2Vzc2Z1bCBkZWxldGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFdpbGwgcmVtb3ZlIHRoZSBlbnRpdHkgd2l0aCB0aGlzIGtleSBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYSBwcmltYXJ5IGtleSBvciBhbiBlbnRpdHkgd2l0aCBhIGtleTtcbiAgICogdGhpcyByZWR1Y2VyIGV4dHJhY3RzIHRoZSBrZXkgZnJvbSB0aGUgZW50aXR5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXIgfCBzdHJpbmcgfCBUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB0b0RlbGV0ZSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBjb25zdCBkZWxldGVJZCA9XG4gICAgICB0eXBlb2YgdG9EZWxldGUgPT09ICdvYmplY3QnXG4gICAgICAgID8gdGhpcy5zZWxlY3RJZCh0b0RlbGV0ZSlcbiAgICAgICAgOiAodG9EZWxldGUgYXMgc3RyaW5nIHwgbnVtYmVyKTtcbiAgICBjb25zdCBjaGFuZ2UgPSBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlW2RlbGV0ZUlkXTtcbiAgICAvLyBJZiBlbnRpdHkgaXMgYWxyZWFkeSB0cmFja2VkIC4uLlxuICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgIGlmIChjaGFuZ2UuY2hhbmdlVHlwZSA9PT0gQ2hhbmdlVHlwZS5BZGRlZCkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGFkZGVkIGVudGl0eSBpbW1lZGlhdGVseSBhbmQgZm9yZ2V0IGFib3V0IGl0cyBjaGFuZ2VzICh2aWEgY29tbWl0KS5cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5jb21taXRPbmUoZGVsZXRlSWQsIGNvbGxlY3Rpb24pO1xuICAgICAgICAvLyBTaG91bGQgbm90IHdhc3RlIGVmZm9ydCB0cnlpbmcgdG8gZGVsZXRlIG9uIHRoZSBzZXJ2ZXIgYmVjYXVzZSBpdCBjYW4ndCBiZSB0aGVyZS5cbiAgICAgICAgYWN0aW9uLnBheWxvYWQuc2tpcCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZS10cmFjayBpdCBhcyBhIGRlbGV0ZSwgZXZlbiBpZiB0cmFja2luZyBpcyB0dXJuZWQgb2ZmIGZvciB0aGlzIGNhbGwuXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICAgICAgZGVsZXRlSWQsXG4gICAgICAgICAgY29sbGVjdGlvblxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG9wdGltaXN0aWMgZGVsZXRlLCB0cmFjayBjdXJyZW50IHN0YXRlIGFuZCByZW1vdmUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlT25lKFxuICAgICAgICBkZWxldGVJZCxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGRlbGV0ZUlkIGFzIHN0cmluZywgY29sbGVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBkZWxldGUgdGhlIGVudGl0eSBvbiB0aGUgc2VydmVyIGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0eSBjb3VsZCBzdGlsbCBiZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGlzIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlT25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgZW50aXR5IG9uIHRoZSBzZXJ2ZXIuIFRoZSBrZXkgb2YgdGhlIGRlbGV0ZWQgZW50aXR5IGlzIGluIHRoZSBhY3Rpb24gcGF5bG9hZCBkYXRhLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGlmIHRoZSBlbnRpdHkgaXMgc3RpbGwgaW4gdGhlIGNvbGxlY3Rpb24gaXQgd2lsbCBiZSByZW1vdmVkLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBoYXMgYWxyZWFkeSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlT25lU3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZz5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGVsZXRlSWQgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZURlbGV0ZXMoXG4gICAgICAgIFtkZWxldGVJZF0sXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFBlc3NpbWlzdGljOiBpZ25vcmUgbWVyZ2VTdHJhdGVneS4gUmVtb3ZlIGVudGl0eSBmcm9tIHRoZSBjb2xsZWN0aW9uIGFuZCBmcm9tIGNoYW5nZSB0cmFja2luZy5cbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGRlbGV0ZUlkIGFzIHN0cmluZywgY29sbGVjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShkZWxldGVJZCwgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVEZWxldGVPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVEZWxldGVNYW55XG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIGJ5IGtleSBhbmQgcmVtb3ZlIHRoZW0gZnJvbSB0aGUgY29sbGVjdGlvbiAoaWYgcHJlc2VudCkuXG4gICAqIFJlbW92ZXMgdW5zYXZlZCBuZXcgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseVxuICAgKiBidXQgdGhlIGlkIGlzIHN0aWxsIHNlbnQgdG8gdGhlIHNlcnZlciBmb3IgZGVsZXRpb24gZXZlbiB0aG91Z2ggdGhlIHNlcnZlciB3aWxsIG5vdCBmaW5kIHRoYXQgZW50aXR5LlxuICAgKiBUaGVyZWZvcmUsIHRoZSBzZXJ2ZXIgbXVzdCBiZSB3aWxsaW5nIHRvIGlnbm9yZSBhIGRlbGV0ZSByZXF1ZXN0IGZvciBhbiBlbnRpdHkgaXQgY2Fubm90IGZpbmQuXG4gICAqIEFuIG9wdGltaXN0aWMgc2F2ZSByZW1vdmVzIGV4aXN0aW5nIGVudGl0aWVzIGZyb20gdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHk7XG4gICAqIGEgcGVzc2ltaXN0aWMgc2F2ZSByZW1vdmVzIHRoZW0gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzZnVsIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gUmVtb3ZlcyBlbnRpdGllcyBmcm9tIHRoaXMgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGFycmF5IG9mIHByaW1hcnkga2V5cyBvciBlbnRpdGllcyB3aXRoIGEga2V5O1xuICAgKiB0aGlzIHJlZHVjZXIgZXh0cmFjdHMgdGhlIGtleSBmcm9tIHRoZSBlbnRpdHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU1hbnkoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjwobnVtYmVyIHwgc3RyaW5nIHwgVClbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZGVsZXRlSWRzID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pLm1hcChcbiAgICAgIGQgPT4gKHR5cGVvZiBkID09PSAnb2JqZWN0JyA/IHRoaXMuc2VsZWN0SWQoZCkgOiAoZCBhcyBzdHJpbmcgfCBudW1iZXIpKVxuICAgICk7XG4gICAgZGVsZXRlSWRzLmZvckVhY2goZGVsZXRlSWQgPT4ge1xuICAgICAgY29uc3QgY2hhbmdlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZVtkZWxldGVJZF07XG4gICAgICAvLyBJZiBlbnRpdHkgaXMgYWxyZWFkeSB0cmFja2VkIC4uLlxuICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICBpZiAoY2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuQWRkZWQpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGFkZGVkIGVudGl0eSBpbW1lZGlhdGVseSBhbmQgZm9yZ2V0IGFib3V0IGl0cyBjaGFuZ2VzICh2aWEgY29tbWl0KS5cbiAgICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShkZWxldGVJZCBhcyBzdHJpbmcsIGNvbGxlY3Rpb24pO1xuICAgICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0T25lKGRlbGV0ZUlkLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICAvLyBTaG91bGQgbm90IHdhc3RlIGVmZm9ydCB0cnlpbmcgdG8gZGVsZXRlIG9uIHRoZSBzZXJ2ZXIgYmVjYXVzZSBpdCBjYW4ndCBiZSB0aGVyZS5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5za2lwID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZS10cmFjayBpdCBhcyBhIGRlbGV0ZSwgZXZlbiBpZiB0cmFja2luZyBpcyB0dXJuZWQgb2ZmIGZvciB0aGlzIGNhbGwuXG4gICAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgICAgICAgIGRlbGV0ZUlkLFxuICAgICAgICAgICAgY29sbGVjdGlvblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBJZiBvcHRpbWlzdGljIGRlbGV0ZSwgdHJhY2sgY3VycmVudCBzdGF0ZSBhbmQgcmVtb3ZlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU1hbnkoXG4gICAgICAgIGRlbGV0ZUlkcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShkZWxldGVJZHMgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIGRlbGV0ZSB0aGUgZW50aXRpZXMgb24gdGhlIHNlcnZlciBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBjb3VsZCBzdGlsbCBiZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgYXJlIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlTWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBkZWxldGVkIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIuIFRoZSBrZXlzIG9mIHRoZSBkZWxldGVkIGVudGl0aWVzIGFyZSBpbiB0aGUgYWN0aW9uIHBheWxvYWQgZGF0YS5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBlbnRpdGllcyB0aGF0IGFyZSBzdGlsbCBpbiB0aGUgY29sbGVjdGlvbiB3aWxsIGJlIHJlbW92ZWQuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPChudW1iZXIgfCBzdHJpbmcpW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRlbGV0ZUlkcyA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlRGVsZXRlcyhcbiAgICAgICAgZGVsZXRlSWRzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQZXNzaW1pc3RpYzogaWdub3JlIG1lcmdlU3RyYXRlZ3kuIFJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvbiBhbmQgZnJvbSBjaGFuZ2UgdHJhY2tpbmcuXG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoZGVsZXRlSWRzIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0TWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRGVsZXRlTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZVVwZGF0ZU9uZVxuICAvKipcbiAgICogU2F2ZSBhbiB1cGRhdGUgdG8gYW4gZXhpc3RpbmcgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdHkgaW1tZWRpYXRlbHksIGJlZm9yZSB0aGUgc2F2ZSByZXF1ZXN0LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiB7VXBkYXRlPFQ+fVxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlT25lKFxuICAgICAgICB1cGRhdGUsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwZGF0ZU9uZSh1cGRhdGUsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHVwZGF0ZSB0aGUgZW50aXR5IG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGlzIGluIHRoZSBwcmUtc2F2ZSBzdGF0ZVxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2FzIHVwZGF0ZWRcbiAgICogYW5kIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU9uZUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCB0aGUgdXBkYXRlZCBlbnRpdHkgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSB3YXMgYWxyZWFkeSB1cGRhdGVkIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZSAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIHVwZGF0ZSB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgaWYgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYywgYW5kXG4gICAqIHRoZSB1cGRhdGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiBVcGRhdGVSZXNwb25zZTxUPiB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBVcGRhdGUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKiBZb3UgbXVzdCBpbmNsdWRlIGFuIFVwZGF0ZVJlc3BvbnNlIGV2ZW4gaWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsXG4gICAqIHRvIGVuc3VyZSB0aGF0IHRoZSBjaGFuZ2UgdHJhY2tpbmcgaXMgcHJvcGVybHkgcmVzZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlUmVzcG9uc2UoYWN0aW9uKTtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPSB0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcGRhdGVzKFxuICAgICAgW3VwZGF0ZV0sXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIGlzT3B0aW1pc3RpYyAvKnNraXAgdW5jaGFuZ2VkIGlmIG9wdGltaXN0aWMgKi9cbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcGRhdGVPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVVcGRhdGVNYW55XG4gIC8qKlxuICAgKiBTYXZlIHVwZGF0ZWQgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW1tZWRpYXRlbHksIGJlZm9yZSB0aGUgc2F2ZSByZXF1ZXN0LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiBhcnJheSBvZiB7VXBkYXRlPFQ+fS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPltdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVzKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlTWFueShcbiAgICAgICAgdXBkYXRlcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byB1cGRhdGUgZW50aXRpZXMgb24gdGhlIHNlcnZlciBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiBhcmUgaW4gdGhlIHByZS1zYXZlIHN0YXRlXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdlcmUgdXBkYXRlZFxuICAgKiBhbmQgeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlTWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCB0aGUgdXBkYXRlZCBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3aWxsIGJlIHVwZGF0ZWQgd2l0aCBkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3ZXJlIGFscmVhZHkgdXBkYXRlZC5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgdXBkYXRlIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4gYXJyYXkgb2YgVXBkYXRlUmVzcG9uc2U8VD4uXG4gICAqIFlvdSBtdXN0IGluY2x1ZGUgYW4gVXBkYXRlUmVzcG9uc2UgZm9yIGV2ZXJ5IFVwZGF0ZSBzZW50IHRvIHRoZSBzZXJ2ZXIsXG4gICAqIGV2ZW4gaWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHRvIGVuc3VyZSB0aGF0IHRoZSBjaGFuZ2UgdHJhY2tpbmcgaXMgcHJvcGVybHkgcmVzZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZVJlc3BvbnNlcyhhY3Rpb24pO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9IHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgICB1cGRhdGVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICBmYWxzZSAvKiBuZXZlciBza2lwICovXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBkYXRlTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZVVwc2VydE9uZVxuICAvKipcbiAgICogU2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdHkgc2hvdWxkIGJlIHVwc2VydGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYSB3aG9sZSBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBtdXN0IGhhdmUgaXRzIGtleS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0T25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1Vwc2VydE9uZShcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIG5ldyBvciBleGlzdGluZyBlbnRpdHkgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBuZXcgb3IgdXBkYXRlZCBlbnRpdHkgaXMgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0aWVzIGFyZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0T25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0aWVzIGFyZSBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgLy8gQWx3YXlzIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCB1cHNlcnRlZCBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHNlcnZlclxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICAgIFtlbnRpdHldLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcHNlcnRPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVVcHNlcnRNYW55XG4gIC8qKlxuICAgKiBTYXZlIG11bHRpcGxlIG5ldyBvciBleGlzdGluZyBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBpbW1lZGlhdGVseS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gd2hpY2ggdGhlIGVudGl0aWVzIHNob3VsZCBiZSB1cHNlcnRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGFycmF5IG9mIHdob2xlIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBtdXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRNYW55KFxuICAgICAgICBlbnRpdGllcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBuZXcgZW50aXRpZXMgYXJlIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgYWRkZWQgZW50aXRpZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgYWRkIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0TWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIC8vIEZvciBwZXNzaW1pc3RpYyBzYXZlLCBlbnN1cmUgdGhlIHNlcnZlciBnZW5lcmF0ZWQgdGhlIHByaW1hcnkga2V5IGlmIHRoZSBjbGllbnQgZGlkbid0IHNlbmQgb25lLlxuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgLy8gQWx3YXlzIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCB1cHNlcnRlZCBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHNlcnZlclxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcHNlcnRNYW55XG5cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIGNhY2hlLW9ubHkgb3BlcmF0aW9uc1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogU2V0cyBsb2FkZWQgZmxhZyB0byB0cnVlLlxuICAgKiBNZXJnZXMgcXVlcnkgcmVzdWx0cywgcHJlc2VydmluZyB1bnNhdmVkIGNoYW5nZXNcbiAgICovXG4gIHByb3RlY3RlZCBhZGRBbGwoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmFkYXB0ZXIuYWRkQWxsKGVudGl0aWVzLCBjb2xsZWN0aW9uKSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlU3RhdGU6IHt9LFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkTWFueShcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuYWRkTWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tBZGRPbmUoXG4gICAgICBlbnRpdHksXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5hZGRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW1vdmVNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyW10gfCBzdHJpbmdbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGVudGl0eSBrZXlzXG4gICAgY29uc3Qga2V5cyA9IHRoaXMuZ3VhcmQubXVzdEJlS2V5cyhhY3Rpb24pIGFzIHN0cmluZ1tdO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU1hbnkoXG4gICAgICBrZXlzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShrZXlzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW1vdmVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXIgfCBzdHJpbmc+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBlbnRpdHkga2V5XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ndWFyZC5tdXN0QmVLZXkoYWN0aW9uKSBhcyBzdHJpbmc7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlT25lKFxuICAgICAga2V5LFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGtleSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlQWxsKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuYWRhcHRlci5yZW1vdmVBbGwoY29sbGVjdGlvbiksXG4gICAgICBsb2FkZWQ6IGZhbHNlLCAvLyBPbmx5IFJFTU9WRV9BTEwgc2V0cyBsb2FkZWQgdG8gZmFsc2VcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgY2hhbmdlU3RhdGU6IHt9LCAvLyBBc3N1bWUgY2xlYXJpbmcgdGhlIGNvbGxlY3Rpb24gYW5kIG5vdCB0cnlpbmcgdG8gZGVsZXRlIGFsbCBlbnRpdGllc1xuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPltdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyBwYXlsb2FkIG11c3QgYmUgYW4gYXJyYXkgb2YgYFVwZGF0ZXM8VD5gLCBub3QgZW50aXRpZXNcbiAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlTWFueShcbiAgICAgIHVwZGF0ZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZU9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGFuIGBVcGRhdGU8VD5gLCBub3QgYW4gZW50aXR5XG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGUoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcGRhdGVPbmUoXG4gICAgICB1cGRhdGUsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVPbmUodXBkYXRlLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cHNlcnRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyA8djY6IHBheWxvYWQgbXVzdCBiZSBhbiBhcnJheSBvZiBgVXBkYXRlczxUPmAsIG5vdCBlbnRpdGllc1xuICAgIC8vIHY2KzogcGF5bG9hZCBtdXN0IGJlIGFuIGFycmF5IG9mIFRcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRNYW55KFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cHNlcnRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cHNlcnRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyA8djY6IHBheWxvYWQgbXVzdCBiZSBhbiBgVXBkYXRlPFQ+YCwgbm90IGFuIGVudGl0eVxuICAgIC8vIHY2KzogcGF5bG9hZCBtdXN0IGJlIGEgVFxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0T25lKFxuICAgICAgZW50aXR5LFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0T25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWl0QWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdEFsbChjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21taXRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE1hbnkoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21taXRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShcbiAgICAgIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSxcbiAgICAgIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVuZG9BbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPikge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudW5kb0FsbChjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci51bmRvTWFueShcbiAgICAgIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSxcbiAgICAgIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVuZG9PbmUoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPiwgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD4pIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnVuZG9PbmUoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBEYW5nZXJvdXM6IENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgY29sbGVjdGlvbidzIENoYW5nZVN0YXRlLiBVc2UgcmFyZWx5IGFuZCB3aXNlbHkuICovXG4gIHByb3RlY3RlZCBzZXRDaGFuZ2VTdGF0ZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPENoYW5nZVN0YXRlTWFwPFQ+PlxuICApIHtcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSA9PT0gY2hhbmdlU3RhdGVcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH07XG4gIH1cblxuICAvKipcbiAgICogRGFuZ2Vyb3VzOiBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNvbGxlY3Rpb24uXG4gICAqIFByaW1hcmlseSBmb3IgdGVzdGluZyBhbmQgcmVoeWRyYXRpb24gZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgKiBVc2UgcmFyZWx5IGFuZCB3aXNlbHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0Q29sbGVjdGlvbihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUNvbGxlY3Rpb248VD4+XG4gICkge1xuICAgIGNvbnN0IG5ld0NvbGxlY3Rpb24gPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24gPT09IG5ld0NvbGxlY3Rpb24gPyBjb2xsZWN0aW9uIDogbmV3Q29sbGVjdGlvbjtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRGaWx0ZXIoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxhbnk+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maWx0ZXIgPT09IGZpbHRlclxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgZmlsdGVyIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGVkKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248Ym9vbGVhbj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgbG9hZGVkID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pID09PSB0cnVlIHx8IGZhbHNlO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmxvYWRlZCA9PT0gbG9hZGVkXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBsb2FkZWQgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248Ym9vbGVhbj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbiwgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nRmFsc2UoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uLCBmYWxzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGluZ1RydWUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGNvbGxlY3Rpb24ncyBsb2FkaW5nIGZsYWcgKi9cbiAgcHJvdGVjdGVkIHNldExvYWRpbmdGbGFnKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sIGxvYWRpbmc6IGJvb2xlYW4pIHtcbiAgICBsb2FkaW5nID0gbG9hZGluZyA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5sb2FkaW5nID09PSBsb2FkaW5nXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBsb2FkaW5nIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIFNhZmVseSBleHRyYWN0IGRhdGEgZnJvbSB0aGUgRW50aXR5QWN0aW9uIHBheWxvYWQgKi9cbiAgcHJvdGVjdGVkIGV4dHJhY3REYXRhPEQgPSBhbnk+KGFjdGlvbjogRW50aXR5QWN0aW9uPEQ+KTogRCB7XG4gICAgcmV0dXJuIChhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5kYXRhKSBhcyBEO1xuICB9XG5cbiAgLyoqIFNhZmVseSBleHRyYWN0IE1lcmdlU3RyYXRlZ3kgZnJvbSBFbnRpdHlBY3Rpb24uIFNldCB0byBJZ25vcmVDaGFuZ2VzIGlmIGNvbGxlY3Rpb24gaXRzZWxmIGlzIG5vdCB0cmFja2VkLiAqL1xuICBwcm90ZWN0ZWQgZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICAvLyBJZiBub3QgdHJhY2tpbmcgdGhpcyBjb2xsZWN0aW9uLCBhbHdheXMgaWdub3JlIGNoYW5nZXNcbiAgICByZXR1cm4gdGhpcy5pc0NoYW5nZVRyYWNraW5nXG4gICAgICA/IGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLm1lcmdlU3RyYXRlZ3lcbiAgICAgIDogTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzT3B0aW1pc3RpYyhhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5pc09wdGltaXN0aWMgPT09IHRydWU7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHtFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHN9IGZvciBhIGdpdmVuIGVudGl0eSB0eXBlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U6IEVudGl0eURlZmluaXRpb25TZXJ2aWNlKSB7fVxuXG4gIC8qKiBDcmVhdGUgdGhlICB7RW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzfSBmb3IgdGhlIG5hbWVkIGVudGl0eSB0eXBlICovXG4gIGNyZWF0ZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZE1hcDxUPiB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbjxUPihcbiAgICAgIGVudGl0eU5hbWVcbiAgICApO1xuICAgIGNvbnN0IG1ldGhvZHNDbGFzcyA9IG5ldyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHMoXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgZGVmaW5pdGlvblxuICAgICk7XG5cbiAgICByZXR1cm4gbWV0aG9kc0NsYXNzLm1ldGhvZHM7XG4gIH1cbn1cbiJdfQ==