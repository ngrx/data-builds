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
 * Generated from: src/reducers/entity-collection-reducer-methods.ts
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
var /**
 * Base implementation of reducer methods for an entity collection.
 * @template T
 */
EntityCollectionReducerMethods = /** @class */ (function () {
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
    /**
     * Cancel a persistence operation
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.cancelPersist = /**
     * Cancel a persistence operation
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.setLoadingFalse(collection);
    };
    // #region query operations
    // #region query operations
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryAll = 
    // #region query operations
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.setLoadingTrue(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryAllError = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     */
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryAllSuccess = /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var data = this.extractData(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        return __assign(__assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loaded: true, loading: false });
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryByKey = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingTrue(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryByKeyError = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryByKeySuccess = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var data = this.extractData(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection =
            data == null
                ? collection
                : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryLoad = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.setLoadingTrue(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryLoadError = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     */
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryLoadSuccess = /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var data = this.extractData(action);
        return __assign(__assign({}, this.adapter.addAll(data, collection)), { loading: false, loaded: true, changeState: {} });
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingTrue(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryManyError = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.queryManySuccess = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var data = this.extractData(action);
        /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveAddMany = 
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
    function (collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            // ensure the entity has a PK
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveAddManyError = /**
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
    function (collection, action) {
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
    EntityCollectionReducerMethods.prototype.saveAddManySuccess = 
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
    function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        var entities = this.guard.mustBeEntities(action);
        /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveAddOne = 
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
    function (collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var entity = this.guard.mustBeEntity(action);
            // ensure the entity has a PK
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveAddOneError = /**
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
    function (collection, action) {
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
    EntityCollectionReducerMethods.prototype.saveAddOneSuccess = /**
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
    function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        var entity = this.guard.mustBeEntity(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveDeleteOne = 
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
    function (collection, action) {
        /** @type {?} */
        var toDelete = this.extractData(action);
        /** @type {?} */
        var deleteId = typeof toDelete === 'object'
            ? this.selectId(toDelete)
            : ((/** @type {?} */ (toDelete)));
        /** @type {?} */
        var change = collection.changeState[deleteId];
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
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection, mergeStrategy);
            collection = this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
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
    EntityCollectionReducerMethods.prototype.saveDeleteOneError = /**
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
    function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     */
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.saveDeleteOneSuccess = /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var deleteId = this.extractData(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes([deleteId], collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
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
    EntityCollectionReducerMethods.prototype.saveDeleteMany = 
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
    function (collection, action) {
        var _this = this;
        /** @type {?} */
        var deleteIds = this.extractData(action).map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (typeof d === 'object' ? _this.selectId(d) : ((/** @type {?} */ (d)))); }));
        deleteIds.forEach((/**
         * @param {?} deleteId
         * @return {?}
         */
        function (deleteId) {
            /** @type {?} */
            var change = collection.changeState[deleteId];
            // If entity is already tracked ...
            if (change) {
                if (change.changeType === ChangeType.Added) {
                    // Remove the added entity immediately and forget about its changes (via commit).
                    collection = _this.adapter.removeOne((/** @type {?} */ (deleteId)), collection);
                    collection = _this.entityChangeTracker.commitOne(deleteId, collection);
                    // Should not waste effort trying to delete on the server because it can't be there.
                    action.payload.skip = true;
                }
                else {
                    // Re-track it as a delete, even if tracking is turned off for this call.
                    collection = _this.entityChangeTracker.trackDeleteOne(deleteId, collection);
                }
            }
        }));
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(deleteIds, collection, mergeStrategy);
            collection = this.adapter.removeMany((/** @type {?} */ (deleteIds)), collection);
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
    EntityCollectionReducerMethods.prototype.saveDeleteManyError = /**
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
    function (collection, action) {
        return this.setLoadingFalse(collection);
    };
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     */
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.saveDeleteManySuccess = /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var deleteIds = this.extractData(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(deleteIds, collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeMany((/** @type {?} */ (deleteIds)), collection);
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
    EntityCollectionReducerMethods.prototype.saveUpdateOne = 
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
    function (collection, action) {
        /** @type {?} */
        var update = this.guard.mustBeUpdate(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpdateOneError = /**
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
    function (collection, action) {
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
    EntityCollectionReducerMethods.prototype.saveUpdateOneSuccess = /**
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
    function (collection, action) {
        /** @type {?} */
        var update = this.guard.mustBeUpdateResponse(action);
        /** @type {?} */
        var isOptimistic = this.isOptimistic(action);
        /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpdateMany = 
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
    function (collection, action) {
        /** @type {?} */
        var updates = this.guard.mustBeUpdates(action);
        if (this.isOptimistic(action)) {
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpdateManyError = /**
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
    function (collection, action) {
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
    EntityCollectionReducerMethods.prototype.saveUpdateManySuccess = /**
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
    function (collection, action) {
        /** @type {?} */
        var updates = this.guard.mustBeUpdateResponses(action);
        /** @type {?} */
        var isOptimistic = this.isOptimistic(action);
        /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpsertOne = 
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
    function (collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var entity = this.guard.mustBeEntity(action);
            // ensure the entity has a PK
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpsertOneError = /**
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
    function (collection, action) {
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
    EntityCollectionReducerMethods.prototype.saveUpsertOneSuccess = /**
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
    function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        var entity = this.guard.mustBeEntity(action);
        /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpsertMany = 
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
    function (collection, action) {
        if (this.isOptimistic(action)) {
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            // ensure the entity has a PK
            /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.saveUpsertManyError = /**
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
    function (collection, action) {
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
    EntityCollectionReducerMethods.prototype.saveUpsertManySuccess = /**
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
    function (collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        /** @type {?} */
        var entities = this.guard.mustBeEntities(action);
        /** @type {?} */
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
    EntityCollectionReducerMethods.prototype.addAll = 
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
    function (collection, action) {
        /** @type {?} */
        var entities = this.guard.mustBeEntities(action);
        return __assign(__assign({}, this.adapter.addAll(entities, collection)), { loading: false, loaded: true, changeState: {} });
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.addMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var entities = this.guard.mustBeEntities(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
        return this.adapter.addMany(entities, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.addOne = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var entity = this.guard.mustBeEntity(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
        return this.adapter.addOne(entity, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.removeMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        // payload must be entity keys
        /** @type {?} */
        var keys = (/** @type {?} */ (this.guard.mustBeKeys(action)));
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
        return this.adapter.removeMany(keys, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.removeOne = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        // payload must be entity key
        /** @type {?} */
        var key = (/** @type {?} */ (this.guard.mustBeKey(action)));
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
        return this.adapter.removeOne(key, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.removeAll = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return __assign(__assign({}, this.adapter.removeAll(collection)), { loaded: false, loading: false, changeState: {} });
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.updateMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        // payload must be an array of `Updates<T>`, not entities
        /** @type {?} */
        var updates = this.guard.mustBeUpdates(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
        return this.adapter.updateMany(updates, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.updateOne = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        // payload must be an `Update<T>`, not an entity
        /** @type {?} */
        var update = this.guard.mustBeUpdate(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
        return this.adapter.updateOne(update, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.upsertMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        // <v6: payload must be an array of `Updates<T>`, not entities
        // v6+: payload must be an array of T
        /** @type {?} */
        var entities = this.guard.mustBeEntities(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
        return this.adapter.upsertMany(entities, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.upsertOne = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        // <v6: payload must be an `Update<T>`, not an entity
        // v6+: payload must be a T
        /** @type {?} */
        var entity = this.guard.mustBeEntity(action);
        /** @type {?} */
        var mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
        return this.adapter.upsertOne(entity, collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.commitAll = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.entityChangeTracker.commitAll(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.commitMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.entityChangeTracker.commitMany(this.extractData(action), collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.commitOne = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.entityChangeTracker.commitOne(this.extractData(action), collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.undoAll = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.entityChangeTracker.undoAll(collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.undoMany = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.entityChangeTracker.undoMany(this.extractData(action), collection);
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.undoOne = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.entityChangeTracker.undoOne(this.extractData(action), collection);
    };
    /** Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely. */
    /**
     * Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setChangeState = /**
     * Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
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
    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setCollection = /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var newCollection = this.extractData(action);
        return collection === newCollection ? collection : newCollection;
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setFilter = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var filter = this.extractData(action);
        return collection.filter === filter
            ? collection
            : __assign(__assign({}, collection), { filter: filter });
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setLoaded = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        /** @type {?} */
        var loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : __assign(__assign({}, collection), { loaded: loaded });
    };
    /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setLoading = /**
     * @protected
     * @param {?} collection
     * @param {?} action
     * @return {?}
     */
    function (collection, action) {
        return this.setLoadingFlag(collection, this.extractData(action));
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setLoadingFalse = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.setLoadingFlag(collection, false);
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setLoadingTrue = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        return this.setLoadingFlag(collection, true);
    };
    /** Set the collection's loading flag */
    /**
     * Set the collection's loading flag
     * @protected
     * @param {?} collection
     * @param {?} loading
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.setLoadingFlag = /**
     * Set the collection's loading flag
     * @protected
     * @param {?} collection
     * @param {?} loading
     * @return {?}
     */
    function (collection, loading) {
        loading = loading === true ? true : false;
        return collection.loading === loading
            ? collection
            : __assign(__assign({}, collection), { loading: loading });
    };
    // #endregion Cache-only operations
    // #region helpers
    /** Safely extract data from the EntityAction payload */
    // #endregion Cache-only operations
    // #region helpers
    /**
     * Safely extract data from the EntityAction payload
     * @protected
     * @template D
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.extractData = 
    // #endregion Cache-only operations
    // #region helpers
    /**
     * Safely extract data from the EntityAction payload
     * @protected
     * @template D
     * @param {?} action
     * @return {?}
     */
    function (action) {
        return (/** @type {?} */ ((action.payload && action.payload.data)));
    };
    /** Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked. */
    /**
     * Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked.
     * @protected
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.extractMergeStrategy = /**
     * Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked.
     * @protected
     * @param {?} action
     * @return {?}
     */
    function (action) {
        // If not tracking this collection, always ignore changes
        return this.isChangeTracking
            ? action.payload && action.payload.mergeStrategy
            : MergeStrategy.IgnoreChanges;
    };
    /**
     * @protected
     * @param {?} action
     * @return {?}
     */
    EntityCollectionReducerMethods.prototype.isOptimistic = /**
     * @protected
     * @param {?} action
     * @return {?}
     */
    function (action) {
        return action.payload && action.payload.isOptimistic === true;
    };
    return EntityCollectionReducerMethods;
}());
/**
 * Base implementation of reducer methods for an entity collection.
 * @template T
 */
export { EntityCollectionReducerMethods };
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
var EntityCollectionReducerMethodsFactory = /** @class */ (function () {
    function EntityCollectionReducerMethodsFactory(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /** Create the  {EntityCollectionReducerMethods} for the named entity type */
    /**
     * Create the  {EntityCollectionReducerMethods} for the named entity type
     * @template T
     * @param {?} entityName
     * @return {?}
     */
    EntityCollectionReducerMethodsFactory.prototype.create = /**
     * Create the  {EntityCollectionReducerMethods} for the named entity type
     * @template T
     * @param {?} entityName
     * @return {?}
     */
    function (entityName) {
        /** @type {?} */
        var definition = this.entityDefinitionService.getDefinition(entityName);
        /** @type {?} */
        var methodsClass = new EntityCollectionReducerMethods(entityName, definition);
        return methodsClass.methods;
    };
    EntityCollectionReducerMethodsFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityCollectionReducerMethodsFactory.ctorParameters = function () { return [
        { type: EntityDefinitionService }
    ]; };
    return EntityCollectionReducerMethodsFactory;
}());
export { EntityCollectionReducerMethodsFactory };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerMethodsFactory.prototype.entityDefinitionService;
}
//# sourceMappingURL=entity-collection-reducer-methods.js.map