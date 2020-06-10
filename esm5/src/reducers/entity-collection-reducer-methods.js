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
        function (d) {
            return typeof d === 'object' ? _this.selectId(d) : ((/** @type {?} */ (d)));
        }));
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
        { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUVMLFVBQVUsR0FFWCxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUdyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUduRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN2RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7O0FBTzFELHNEQUtDOzs7OztBQUtEOzs7OztJQStHRSx3Q0FDUyxVQUFrQixFQUNsQixVQUErQjtJQUN0Qzs7O09BR0c7SUFDSCxtQkFBNEM7O1FBTnJDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBcUI7Ozs7O1FBdkYvQixZQUFPO1lBQ2QsR0FBQyxRQUFRLENBQUMsY0FBYyxJQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUV4RCxHQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzlDLEdBQUMsUUFBUSxDQUFDLGVBQWUsSUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJ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Q0FBQztZQUM1QyxHQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRTFDLEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsR0FBQyxRQUFRLENBQUMsV0FBVyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRCxHQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRWhELEdBQUMsUUFBUSxDQUFDLFdBQVcsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEQsR0FBQyxRQUFRLENBQUMsVUFBVSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVoRCxHQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFaEQsR0FBQyxRQUFRLENBQUMsVUFBVSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoRCxHQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xELEdBQUMsUUFBUSxDQUFDLFVBQVUsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEQsR0FBQyxRQUFRLENBQUMsUUFBUSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QyxHQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUcsSUFBSSxDQUFDLFFB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QUFLLElBQUksQ0FBQztJQUNoRSxDQUFDO0lBR0gscUNBQUM7QUFBRCxDQUFDLEFBbnFDRCxJQW1xQ0M7Ozs7Ozs7Ozs7O0lBbHFDQyxpREFBb0M7Ozs7O0lBQ3BDLCtDQUFzQzs7Ozs7O0lBRXRDLDBEQUFvQzs7Ozs7SUFHcEMsa0RBQXdCOzs7Ozs7SUFNeEIsNkRBQTRDOzs7Ozs7OztJQU81QyxrREFBc0Q7Ozs7OztJQU10RCxpREFtRkU7O0lBR0Esb0RBQXlCOztJQUN6QixvREFBc0M7Ozs7O0FBdWpDMUM7SUFFRSwrQ0FBb0IsdUJBQWdEO1FBQWhELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7SUFBRyxDQUFDO0lBRXhFLDZFQUE2RTs7Ozs7OztJQUM3RSxzREFBTTs7Ozs7O0lBQU4sVUFBVSxVQUFrQjs7WUFDcEIsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQzNELFVBQVUsQ0FDWDs7WUFDSyxZQUFZLEdBQUcsSUFBSSw4QkFBOEIsQ0FDckQsVUFBVSxFQUNWLFVBQVUsQ0FDWDtRQUVELE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQztJQUM5QixDQUFDOztnQkFmRixVQUFVOzs7O2dCQTNyQ0YsdUJBQXVCOztJQTJzQ2hDLDRDQUFDO0NBQUEsQUFoQkQsSUFnQkM7U0FmWSxxQ0FBcUM7Ozs7OztJQUNwQyx3RUFBd0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlBZGFwdGVyLCBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuaW1wb3J0IHtcbiAgQ2hhbmdlU3RhdGVNYXAsXG4gIENoYW5nZVR5cGUsXG4gIEVudGl0eUNvbGxlY3Rpb24sXG59IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2hhbmdlVHJhY2tlckJhc2UgfSBmcm9tICcuL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlJztcbmltcG9ydCB7IHRvVXBkYXRlRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q2hhbmdlVHJhY2tlciB9IGZyb20gJy4vZW50aXR5LWNoYW5nZS10cmFja2VyJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb24gfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24nO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIE1hcCBvZiB7RW50aXR5T3B9IHRvIHJlZHVjZXIgbWV0aG9kIGZvciB0aGUgb3BlcmF0aW9uLlxuICogSWYgYW4gb3BlcmF0aW9uIGlzIG1pc3NpbmcsIGNhbGxlciBzaG91bGQgcmV0dXJuIHRoZSBjb2xsZWN0aW9uIGZvciB0aGF0IHJlZHVjZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RNYXA8VD4ge1xuICBbbWV0aG9kOiBzdHJpbmddOiAoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApID0+IEVudGl0eUNvbGxlY3Rpb248VD47XG59XG5cbi8qKlxuICogQmFzZSBpbXBsZW1lbnRhdGlvbiBvZiByZWR1Y2VyIG1ldGhvZHMgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzPFQ+IHtcbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEVudGl0eUFkYXB0ZXI8VD47XG4gIHByb3RlY3RlZCBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG4gIC8qKiBUcnVlIGlmIHRoaXMgY29sbGVjdGlvbiB0cmFja3MgdW5zYXZlZCBjaGFuZ2VzICovXG4gIHByb3RlY3RlZCBpc0NoYW5nZVRyYWNraW5nOiBib29sZWFuO1xuXG4gIC8qKiBFeHRyYWN0IHRoZSBwcmltYXJ5IGtleSAoaWQpOyBkZWZhdWx0IHRvIGBpZGAgKi9cbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG5cbiAgLyoqXG4gICAqIFRyYWNrIGNoYW5nZXMgdG8gZW50aXRpZXMgc2luY2UgdGhlIGxhc3QgcXVlcnkgb3Igc2F2ZVxuICAgKiBDYW4gcmV2ZXJ0IHNvbWUgb3IgYWxsIG9mIHRob3NlIGNoYW5nZXNcbiAgICovXG4gIGVudGl0eUNoYW5nZVRyYWNrZXI6IEVudGl0eUNoYW5nZVRyYWNrZXI8VD47XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmAgb2JqZWN0XG4gICAqIGBpZGA6IHRoZSBwcmltYXJ5IGtleSBhbmRcbiAgICogYGNoYW5nZXNgOiB0aGUgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSBvZiBjaGFuZ2VzKS5cbiAgICovXG4gIHByb3RlY3RlZCB0b1VwZGF0ZTogKGVudGl0eTogUGFydGlhbDxUPikgPT4gVXBkYXRlPFQ+O1xuXG4gIC8qKlxuICAgKiBEaWN0aW9uYXJ5IG9mIHRoZSB7RW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzfSBmb3IgdGhpcyBlbnRpdHkgdHlwZSxcbiAgICoga2V5ZWQgYnkgdGhlIHtFbnRpdHlPcH1cbiAgICovXG4gIHJlYWRvbmx5IG1ldGhvZHM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kTWFwPFQ+ID0ge1xuICAgIFtFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVF06IHRoaXMuY2FuY2VsUGVyc2lzdC5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX0FMTF06IHRoaXMucXVlcnlBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQUxMX0VSUk9SXTogdGhpcy5xdWVyeUFsbEVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0FMTF9TVUNDRVNTXTogdGhpcy5xdWVyeUFsbFN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5RVUVSWV9CWV9LRVldOiB0aGlzLnF1ZXJ5QnlLZXkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQllfS0VZX0VSUk9SXTogdGhpcy5xdWVyeUJ5S2V5RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuUVVFUllfQllfS0VZX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5QnlLZXlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuUVVFUllfTE9BRF06IHRoaXMucXVlcnlMb2FkLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0xPQURfRVJST1JdOiB0aGlzLnF1ZXJ5TG9hZEVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlFVRVJZX0xPQURfU1VDQ0VTU106IHRoaXMucXVlcnlMb2FkU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlFVRVJZX01BTlldOiB0aGlzLnF1ZXJ5TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9NQU5ZX0VSUk9SXTogdGhpcy5xdWVyeU1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5RVUVSWV9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnF1ZXJ5TWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9NQU5ZXTogdGhpcy5zYXZlQWRkTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlQWRkTWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZUFkZE1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9BRERfT05FXTogdGhpcy5zYXZlQWRkT25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX09ORV9FUlJPUl06IHRoaXMuc2F2ZUFkZE9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfQUREX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlQWRkT25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX01BTlldOiB0aGlzLnNhdmVEZWxldGVNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfREVMRVRFX01BTllfRVJST1JdOiB0aGlzLnNhdmVEZWxldGVNYW55RXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV9TVUNDRVNTXTogdGhpcy5zYXZlRGVsZXRlTWFueVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkVdOiB0aGlzLnNhdmVEZWxldGVPbmUuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FX0VSUk9SXTogdGhpcy5zYXZlRGVsZXRlT25lRXJyb3IuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FX1NVQ0NFU1NdOiB0aGlzLnNhdmVEZWxldGVPbmVTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV06IHRoaXMuc2F2ZVVwZGF0ZU1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0FWRV9VUERBVEVfTUFOWV9FUlJPUl06IHRoaXMuc2F2ZVVwZGF0ZU1hbnlFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9NQU5ZX1NVQ0NFU1NdOiB0aGlzLnNhdmVVcGRhdGVNYW55U3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlNBVkVfVVBEQVRFX09ORV06IHRoaXMuc2F2ZVVwZGF0ZU9uZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9PTkVfRVJST1JdOiB0aGlzLnNhdmVVcGRhdGVPbmVFcnJvci5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQREFURV9PTkVfU1VDQ0VTU106IHRoaXMuc2F2ZVVwZGF0ZU9uZVN1Y2Nlc3MuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZXTogdGhpcy5zYXZlVXBzZXJ0TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX0VSUk9SXTogdGhpcy5zYXZlVXBzZXJ0TWFueUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX01BTllfU1VDQ0VTU106IHRoaXMuc2F2ZVVwc2VydE1hbnlTdWNjZXNzLmJpbmQodGhpcyksXG5cbiAgICBbRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FXTogdGhpcy5zYXZlVXBzZXJ0T25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX09ORV9FUlJPUl06IHRoaXMuc2F2ZVVwc2VydE9uZUVycm9yLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNBVkVfVVBTRVJUX09ORV9TVUNDRVNTXTogdGhpcy5zYXZlVXBzZXJ0T25lU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXG4gICAgLy8gRG8gbm90aGluZyBvbiBzYXZlIGVycm9ycyBleGNlcHQgdHVybiB0aGUgbG9hZGluZyBmbGFnIG9mZi5cbiAgICAvLyBTZWUgdGhlIENoYW5nZVRyYWNrZXJNZXRhUmVkdWNlcnNcbiAgICAvLyBPciB0aGUgYXBwIGNvdWxkIGxpc3RlbiBmb3IgdGhvc2UgZXJyb3JzIGFuZCBkbyBzb21ldGhpbmdcblxuICAgIC8vLyBjYWNoZSBvbmx5IG9wZXJhdGlvbnMgLy8vXG5cbiAgICBbRW50aXR5T3AuQUREX0FMTF06IHRoaXMuYWRkQWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkFERF9NQU5ZXTogdGhpcy5hZGRNYW55LmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLkFERF9PTkVdOiB0aGlzLmFkZE9uZS5iaW5kKHRoaXMpLFxuXG4gICAgW0VudGl0eU9wLlJFTU9WRV9BTExdOiB0aGlzLnJlbW92ZUFsbC5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5SRU1PVkVfTUFOWV06IHRoaXMucmVtb3ZlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5SRU1PVkVfT05FXTogdGhpcy5yZW1vdmVPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5VUERBVEVfTUFOWV06IHRoaXMudXBkYXRlTWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VUERBVEVfT05FXTogdGhpcy51cGRhdGVPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5VUFNFUlRfTUFOWV06IHRoaXMudXBzZXJ0TWFueS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5VUFNFUlRfT05FXTogdGhpcy51cHNlcnRPbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5DT01NSVRfQUxMXTogdGhpcy5jb21taXRBbGwuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuQ09NTUlUX01BTlldOiB0aGlzLmNvbW1pdE1hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuQ09NTUlUX09ORV06IHRoaXMuY29tbWl0T25lLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVORE9fQUxMXTogdGhpcy51bmRvQWxsLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlVORE9fTUFOWV06IHRoaXMudW5kb01hbnkuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuVU5ET19PTkVdOiB0aGlzLnVuZG9PbmUuYmluZCh0aGlzKSxcblxuICAgIFtFbnRpdHlPcC5TRVRfQ0hBTkdFX1NUQVRFXTogdGhpcy5zZXRDaGFuZ2VTdGF0ZS5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfQ09MTEVDVElPTl06IHRoaXMuc2V0Q29sbGVjdGlvbi5iaW5kKHRoaXMpLFxuICAgIFtFbnRpdHlPcC5TRVRfRklMVEVSXTogdGhpcy5zZXRGaWx0ZXIuYmluZCh0aGlzKSxcbiAgICBbRW50aXR5T3AuU0VUX0xPQURFRF06IHRoaXMuc2V0TG9hZGVkLmJpbmQodGhpcyksXG4gICAgW0VudGl0eU9wLlNFVF9MT0FESU5HXTogdGhpcy5zZXRMb2FkaW5nLmJpbmQodGhpcyksXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgZGVmaW5pdGlvbjogRW50aXR5RGVmaW5pdGlvbjxUPixcbiAgICAvKlxuICAgICAqIFRyYWNrIGNoYW5nZXMgdG8gZW50aXRpZXMgc2luY2UgdGhlIGxhc3QgcXVlcnkgb3Igc2F2ZVxuICAgICAqIENhbiByZXZlcnQgc29tZSBvciBhbGwgb2YgdGhvc2UgY2hhbmdlc1xuICAgICAqL1xuICAgIGVudGl0eUNoYW5nZVRyYWNrZXI/OiBFbnRpdHlDaGFuZ2VUcmFja2VyPFQ+XG4gICkge1xuICAgIHRoaXMuYWRhcHRlciA9IGRlZmluaXRpb24uZW50aXR5QWRhcHRlcjtcbiAgICB0aGlzLmlzQ2hhbmdlVHJhY2tpbmcgPSBkZWZpbml0aW9uLm5vQ2hhbmdlVHJhY2tpbmcgIT09IHRydWU7XG4gICAgdGhpcy5zZWxlY3RJZCA9IGRlZmluaXRpb24uc2VsZWN0SWQ7XG5cbiAgICB0aGlzLmd1YXJkID0gbmV3IEVudGl0eUFjdGlvbkd1YXJkKGVudGl0eU5hbWUsIHRoaXMuc2VsZWN0SWQpO1xuICAgIHRoaXMudG9VcGRhdGUgPSB0b1VwZGF0ZUZhY3RvcnkodGhpcy5zZWxlY3RJZCk7XG5cbiAgICB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIgPVxuICAgICAgZW50aXR5Q2hhbmdlVHJhY2tlciB8fFxuICAgICAgbmV3IEVudGl0eUNoYW5nZVRyYWNrZXJCYXNlPFQ+KHRoaXMuYWRhcHRlciwgdGhpcy5zZWxlY3RJZCk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uICovXG4gIHByb3RlY3RlZCBjYW5jZWxQZXJzaXN0KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBxdWVyeSBvcGVyYXRpb25zXG5cbiAgcHJvdGVjdGVkIHF1ZXJ5QWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUFsbEVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlcyBxdWVyeSByZXN1bHRzIHBlciB0aGUgTWVyZ2VTdHJhdGVneVxuICAgKiBTZXRzIGxvYWRpbmcgZmxhZyB0byBmYWxzZSBhbmQgbG9hZGVkIGZsYWcgdG8gdHJ1ZS5cbiAgICovXG4gIHByb3RlY3RlZCBxdWVyeUFsbFN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlUXVlcnlSZXN1bHRzKFxuICAgICAgICBkYXRhLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApLFxuICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUJ5S2V5KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUJ5S2V5RXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcXVlcnlCeUtleVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9XG4gICAgICBkYXRhID09IG51bGxcbiAgICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICAgIDogdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlUXVlcnlSZXN1bHRzKFxuICAgICAgICAgICAgW2RhdGFdLFxuICAgICAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBxdWVyeUxvYWQoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TG9hZEVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBTZXRzIGxvYWRlZCBmbGFnIHRvIHRydWUsIGxvYWRpbmcgZmxhZyB0byBmYWxzZSxcbiAgICogYW5kIGNsZWFycyBjaGFuZ2VTdGF0ZSBmb3IgdGhlIGVudGlyZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHF1ZXJ5TG9hZFN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuYWRhcHRlci5hZGRBbGwoZGF0YSwgY29sbGVjdGlvbiksXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlUXVlcnlSZXN1bHRzKFxuICAgICAgICBkYXRhLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHF1ZXJ5IG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIHNhdmUgb3BlcmF0aW9uc1xuXG4gIC8vICNyZWdpb24gc2F2ZUFkZE1hbnlcbiAgLyoqXG4gICAqIFNhdmUgbXVsdGlwbGUgbmV3IGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCBkZWxheSBhZGRpbmcgdG8gY29sbGVjdGlvbiB1bnRpbCBzZXJ2ZXIgYWNrbm93bGVkZ2VzIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseTsgYWRkIGltbWVkaWF0ZWx5LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB3aGljaCB0aGUgZW50aXRpZXMgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gYXJyYXkgb2YgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIG11c3QgaGF2ZSB0aGVpciBrZXlzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0FkZE1hbnkoXG4gICAgICAgIGVudGl0aWVzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5hZGRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIG5ldyBlbnRpdGllcyBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIG5ldyBlbnRpdGllcyBhcmUgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0aWVzIGFyZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkTWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUFkZE1hbnlcblxuICAvLyAjcmVnaW9uIHNhdmVBZGRPbmVcbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCBuZXcgZW50aXRpZXMgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBhZGQgdGhlIGVudGl0aWVzIGZyb20gdGhlIHNlcnZlciB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBhZGRlZCBlbnRpdGllcyBhcmUgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpLFxuICAgKiBhbmQgbWF5IGV2ZW4gcmV0dXJuIGFkZGl0aW9uYWwgbmV3IGVudGl0aWVzLlxuICAgKiBUaGVyZWZvcmUsIHVwc2VydCB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgYWRkIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICogTm90ZTogc2F2ZUFkZE1hbnlTdWNjZXNzIGRpZmZlcnMgZnJvbSBzYXZlQWRkT25lU3VjY2VzcyB3aGVuIG9wdGltaXN0aWMuXG4gICAqIHNhdmVBZGRPbmVTdWNjZXNzIHVwZGF0ZXMgKG5vdCB1cHNlcnRzKSB3aXRoIHRoZSBsb25lIGVudGl0eSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIFRoZXJlIGlzIG5vIGVmZmVjdCBpZiB0aGUgZW50aXR5IGlzIG5vdCBhbHJlYWR5IGluIGNhY2hlLlxuICAgKiBzYXZlQWRkTWFueVN1Y2Nlc3Mgd2lsbCBhZGQgYW4gZW50aXR5IGlmIGl0IGlzIG5vdCBmb3VuZCBpbiBjYWNoZS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlQWRkTWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIC8vIEZvciBwZXNzaW1pc3RpYyBzYXZlLCBlbnN1cmUgdGhlIHNlcnZlciBnZW5lcmF0ZWQgdGhlIHByaW1hcnkga2V5IGlmIHRoZSBjbGllbnQgZGlkbid0IHNlbmQgb25lLlxuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlQWRkcyhcbiAgICAgICAgZW50aXRpZXMsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVBZGRNYW55XG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkT25lXG4gIC8qKlxuICAgKiBTYXZlIGEgbmV3IGVudGl0eS5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBlbnRpdHkgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdHkgc2hvdWxkIGJlIGFkZGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgbXVzdCBoYXZlIGEga2V5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTsgLy8gZW5zdXJlIHRoZSBlbnRpdHkgaGFzIGEgUEtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkT25lKFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLmFkZE9uZShlbnRpdHksIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHNhdmUgYSBuZXcgZW50aXR5IGZhaWxlZCBvciB0aW1lZC1vdXQuXG4gICAqIEFjdGlvbiBob2xkcyB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgdGhlIGVudGl0eSBpcyBub3QgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIHVuc2F2ZWQgZW50aXR5IGlzIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVBZGRPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgYSBuZXcgZW50aXR5IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdHkgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0eSBpcyBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZSAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZUFkZE9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+ID0gdGhpcy50b1VwZGF0ZShlbnRpdHkpO1xuICAgICAgLy8gQWx3YXlzIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCBhZGRlZCBlbnRpdHkgcmV0dXJuZWQgZnJvbSBzZXJ2ZXJcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBkYXRlcyhcbiAgICAgICAgW3VwZGF0ZV0sXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgIGZhbHNlIC8qbmV2ZXIgc2tpcCovXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZUFkZHMoXG4gICAgICAgIFtlbnRpdHldLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkT25lXG5cbiAgLy8gI3JlZ2lvbiBzYXZlQWRkTWFueVxuICAvLyBUT0RPIE1BTllcbiAgLy8gI2VuZHJlZ2lvbiBzYXZlQWRkTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZURlbGV0ZU9uZVxuICAvKipcbiAgICogRGVsZXRlIGFuIGVudGl0eSBmcm9tIHRoZSBzZXJ2ZXIgYnkga2V5IGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgY29sbGVjdGlvbiAoaWYgcHJlc2VudCkuXG4gICAqIElmIHRoZSBlbnRpdHkgaXMgYW4gdW5zYXZlZCBuZXcgZW50aXR5LCByZW1vdmUgaXQgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseVxuICAgKiBhbmQgc2tpcCB0aGUgc2VydmVyIGRlbGV0ZSByZXF1ZXN0LlxuICAgKiBBbiBvcHRpbWlzdGljIHNhdmUgcmVtb3ZlcyBhbiBleGlzdGluZyBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseTtcbiAgICogYSBwZXNzaW1pc3RpYyBzYXZlIHJlbW92ZXMgaXQgYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzZnVsIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gV2lsbCByZW1vdmUgdGhlIGVudGl0eSB3aXRoIHRoaXMga2V5IGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyB3aGV0aGVyIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSwgd2hpY2ggbXVzdCBiZSBhIHByaW1hcnkga2V5IG9yIGFuIGVudGl0eSB3aXRoIGEga2V5O1xuICAgKiB0aGlzIHJlZHVjZXIgZXh0cmFjdHMgdGhlIGtleSBmcm9tIHRoZSBlbnRpdHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZURlbGV0ZU9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPG51bWJlciB8IHN0cmluZyB8IFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHRvRGVsZXRlID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGNvbnN0IGRlbGV0ZUlkID1cbiAgICAgIHR5cGVvZiB0b0RlbGV0ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgPyB0aGlzLnNlbGVjdElkKHRvRGVsZXRlKVxuICAgICAgICA6ICh0b0RlbGV0ZSBhcyBzdHJpbmcgfCBudW1iZXIpO1xuICAgIGNvbnN0IGNoYW5nZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGVbZGVsZXRlSWRdO1xuICAgIC8vIElmIGVudGl0eSBpcyBhbHJlYWR5IHRyYWNrZWQgLi4uXG4gICAgaWYgKGNoYW5nZSkge1xuICAgICAgaWYgKGNoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLkFkZGVkKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgYWRkZWQgZW50aXR5IGltbWVkaWF0ZWx5IGFuZCBmb3JnZXQgYWJvdXQgaXRzIGNoYW5nZXMgKHZpYSBjb21taXQpLlxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShkZWxldGVJZCBhcyBzdHJpbmcsIGNvbGxlY3Rpb24pO1xuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShkZWxldGVJZCwgY29sbGVjdGlvbik7XG4gICAgICAgIC8vIFNob3VsZCBub3Qgd2FzdGUgZWZmb3J0IHRyeWluZyB0byBkZWxldGUgb24gdGhlIHNlcnZlciBiZWNhdXNlIGl0IGNhbid0IGJlIHRoZXJlLlxuICAgICAgICBhY3Rpb24ucGF5bG9hZC5za2lwID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFJlLXRyYWNrIGl0IGFzIGEgZGVsZXRlLCBldmVuIGlmIHRyYWNraW5nIGlzIHR1cm5lZCBvZmYgZm9yIHRoaXMgY2FsbC5cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgICAgICBkZWxldGVJZCxcbiAgICAgICAgICBjb2xsZWN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgb3B0aW1pc3RpYyBkZWxldGUsIHRyYWNrIGN1cnJlbnQgc3RhdGUgYW5kIHJlbW92ZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tEZWxldGVPbmUoXG4gICAgICAgIGRlbGV0ZUlkLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIGRlbGV0ZSB0aGUgZW50aXR5IG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGNvdWxkIHN0aWxsIGJlIGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaXMgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5lZWQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVPbmVFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgZGVsZXRlZCBlbnRpdHkgb24gdGhlIHNlcnZlci4gVGhlIGtleSBvZiB0aGUgZGVsZXRlZCBlbnRpdHkgaXMgaW4gdGhlIGFjdGlvbiBwYXlsb2FkIGRhdGEuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgaWYgdGhlIGVudGl0eSBpcyBzdGlsbCBpbiB0aGUgY29sbGVjdGlvbiBpdCB3aWxsIGJlIHJlbW92ZWQuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGhhcyBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVPbmVTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyIHwgc3RyaW5nPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkZWxldGVJZCA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlRGVsZXRlcyhcbiAgICAgICAgW2RlbGV0ZUlkXSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUGVzc2ltaXN0aWM6IGlnbm9yZSBtZXJnZVN0cmF0ZWd5LiBSZW1vdmUgZW50aXR5IGZyb20gdGhlIGNvbGxlY3Rpb24gYW5kIGZyb20gY2hhbmdlIHRyYWNraW5nLlxuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVPbmUoZGVsZXRlSWQgYXMgc3RyaW5nLCBjb2xsZWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0T25lKGRlbGV0ZUlkLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZURlbGV0ZU9uZVxuXG4gIC8vICNyZWdpb24gc2F2ZURlbGV0ZU1hbnlcbiAgLyoqXG4gICAqIERlbGV0ZSBtdWx0aXBsZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgYnkga2V5IGFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBjb2xsZWN0aW9uIChpZiBwcmVzZW50KS5cbiAgICogUmVtb3ZlcyB1bnNhdmVkIG5ldyBlbnRpdGllcyBmcm9tIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5XG4gICAqIGJ1dCB0aGUgaWQgaXMgc3RpbGwgc2VudCB0byB0aGUgc2VydmVyIGZvciBkZWxldGlvbiBldmVuIHRob3VnaCB0aGUgc2VydmVyIHdpbGwgbm90IGZpbmQgdGhhdCBlbnRpdHkuXG4gICAqIFRoZXJlZm9yZSwgdGhlIHNlcnZlciBtdXN0IGJlIHdpbGxpbmcgdG8gaWdub3JlIGEgZGVsZXRlIHJlcXVlc3QgZm9yIGFuIGVudGl0eSBpdCBjYW5ub3QgZmluZC5cbiAgICogQW4gb3B0aW1pc3RpYyBzYXZlIHJlbW92ZXMgZXhpc3RpbmcgZW50aXRpZXMgZnJvbSB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseTtcbiAgICogYSBwZXNzaW1pc3RpYyBzYXZlIHJlbW92ZXMgdGhlbSBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHN1Y2Nlc3NmdWwgZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBSZW1vdmVzIGVudGl0aWVzIGZyb20gdGhpcyBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYW4gYXJyYXkgb2YgcHJpbWFyeSBrZXlzIG9yIGVudGl0aWVzIHdpdGggYSBrZXk7XG4gICAqIHRoaXMgcmVkdWNlciBleHRyYWN0cyB0aGUga2V5IGZyb20gdGhlIGVudGl0eS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPChudW1iZXIgfCBzdHJpbmcgfCBUKVtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBkZWxldGVJZHMgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbikubWFwKChkKSA9PlxuICAgICAgdHlwZW9mIGQgPT09ICdvYmplY3QnID8gdGhpcy5zZWxlY3RJZChkKSA6IChkIGFzIHN0cmluZyB8IG51bWJlcilcbiAgICApO1xuICAgIGRlbGV0ZUlkcy5mb3JFYWNoKChkZWxldGVJZCkgPT4ge1xuICAgICAgY29uc3QgY2hhbmdlID0gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZVtkZWxldGVJZF07XG4gICAgICAvLyBJZiBlbnRpdHkgaXMgYWxyZWFkeSB0cmFja2VkIC4uLlxuICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICBpZiAoY2hhbmdlLmNoYW5nZVR5cGUgPT09IENoYW5nZVR5cGUuQWRkZWQpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGFkZGVkIGVudGl0eSBpbW1lZGlhdGVseSBhbmQgZm9yZ2V0IGFib3V0IGl0cyBjaGFuZ2VzICh2aWEgY29tbWl0KS5cbiAgICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU9uZShkZWxldGVJZCBhcyBzdHJpbmcsIGNvbGxlY3Rpb24pO1xuICAgICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0T25lKGRlbGV0ZUlkLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICAvLyBTaG91bGQgbm90IHdhc3RlIGVmZm9ydCB0cnlpbmcgdG8gZGVsZXRlIG9uIHRoZSBzZXJ2ZXIgYmVjYXVzZSBpdCBjYW4ndCBiZSB0aGVyZS5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5za2lwID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZS10cmFjayBpdCBhcyBhIGRlbGV0ZSwgZXZlbiBpZiB0cmFja2luZyBpcyB0dXJuZWQgb2ZmIGZvciB0aGlzIGNhbGwuXG4gICAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU9uZShcbiAgICAgICAgICAgIGRlbGV0ZUlkLFxuICAgICAgICAgICAgY29sbGVjdGlvblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBJZiBvcHRpbWlzdGljIGRlbGV0ZSwgdHJhY2sgY3VycmVudCBzdGF0ZSBhbmQgcmVtb3ZlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pKSB7XG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU1hbnkoXG4gICAgICAgIGRlbGV0ZUlkcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShkZWxldGVJZHMgYXMgc3RyaW5nW10sIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIGRlbGV0ZSB0aGUgZW50aXRpZXMgb24gdGhlIHNlcnZlciBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBjb3VsZCBzdGlsbCBiZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgYXJlIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlRGVsZXRlTWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBkZWxldGVkIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIuIFRoZSBrZXlzIG9mIHRoZSBkZWxldGVkIGVudGl0aWVzIGFyZSBpbiB0aGUgYWN0aW9uIHBheWxvYWQgZGF0YS5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBlbnRpdGllcyB0aGF0IGFyZSBzdGlsbCBpbiB0aGUgY29sbGVjdGlvbiB3aWxsIGJlIHJlbW92ZWQuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgZW50aXRpZXMgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVEZWxldGVNYW55U3VjY2VzcyhcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPChudW1iZXIgfCBzdHJpbmcpW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGRlbGV0ZUlkcyA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAodGhpcy5pc09wdGltaXN0aWMoYWN0aW9uKSkge1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlRGVsZXRlcyhcbiAgICAgICAgZGVsZXRlSWRzLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQZXNzaW1pc3RpYzogaWdub3JlIG1lcmdlU3RyYXRlZ3kuIFJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgY29sbGVjdGlvbiBhbmQgZnJvbSBjaGFuZ2UgdHJhY2tpbmcuXG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoZGVsZXRlSWRzIGFzIHN0cmluZ1tdLCBjb2xsZWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIuY29tbWl0TWFueShkZWxldGVJZHMsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlRGVsZXRlTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZVVwZGF0ZU9uZVxuICAvKipcbiAgICogU2F2ZSBhbiB1cGRhdGUgdG8gYW4gZXhpc3RpbmcgZW50aXR5LlxuICAgKiBJZiBzYXZpbmcgcGVzc2ltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHN1Y2Nlc3MuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdXBkYXRlIHRoZSBlbnRpdHkgaW1tZWRpYXRlbHksIGJlZm9yZSB0aGUgc2F2ZSByZXF1ZXN0LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiB7VXBkYXRlPFQ+fVxuICAgKi9cbiAgcHJvdGVjdGVkIHNhdmVVcGRhdGVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlT25lKFxuICAgICAgICB1cGRhdGUsXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICAgICk7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwZGF0ZU9uZSh1cGRhdGUsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nVHJ1ZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHVwZGF0ZSB0aGUgZW50aXR5IG9uIHRoZSBzZXJ2ZXIgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB0aGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIGlzIGluIHRoZSBwcmUtc2F2ZSBzdGF0ZVxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2FzIHVwZGF0ZWRcbiAgICogYW5kIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU9uZUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCB0aGUgdXBkYXRlZCBlbnRpdHkgdG8gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSB3YXMgYWxyZWFkeSB1cGRhdGVkIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZSAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIHVwZGF0ZSB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgaWYgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYywgYW5kXG4gICAqIHRoZSB1cGRhdGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiBVcGRhdGVSZXNwb25zZTxUPiB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBVcGRhdGUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKiBZb3UgbXVzdCBpbmNsdWRlIGFuIFVwZGF0ZVJlc3BvbnNlIGV2ZW4gaWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsXG4gICAqIHRvIGVuc3VyZSB0aGF0IHRoZSBjaGFuZ2UgdHJhY2tpbmcgaXMgcHJvcGVybHkgcmVzZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD4+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMuZ3VhcmQubXVzdEJlVXBkYXRlUmVzcG9uc2UoYWN0aW9uKTtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPSB0aGlzLmlzT3B0aW1pc3RpYyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci5tZXJnZVNhdmVVcGRhdGVzKFxuICAgICAgW3VwZGF0ZV0sXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneSxcbiAgICAgIGlzT3B0aW1pc3RpYyAvKnNraXAgdW5jaGFuZ2VkIGlmIG9wdGltaXN0aWMgKi9cbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcGRhdGVPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVVcGRhdGVNYW55XG4gIC8qKlxuICAgKiBTYXZlIHVwZGF0ZWQgZW50aXRpZXMuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW1tZWRpYXRlbHksIGJlZm9yZSB0aGUgc2F2ZSByZXF1ZXN0LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byB1cGRhdGVcbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIGlmIHRoZSBzYXZlIGlzIG9wdGltaXN0aWMsXG4gICAqIGFuZCB0aGUgZGF0YSB3aGljaCwgbXVzdCBiZSBhbiBhcnJheSBvZiB7VXBkYXRlPFQ+fS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPltdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVzKGFjdGlvbik7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlTWFueShcbiAgICAgICAgdXBkYXRlcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byB1cGRhdGUgZW50aXRpZXMgb24gdGhlIHNlcnZlciBmYWlsZWQgb3IgdGltZWQtb3V0LlxuICAgKiBBY3Rpb24gaG9sZHMgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiBhcmUgaW4gdGhlIHByZS1zYXZlIHN0YXRlXG4gICAqIHlvdSBtYXkgbm90IGhhdmUgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGVycm9yLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdlcmUgdXBkYXRlZFxuICAgKiBhbmQgeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBkYXRlTWFueUVycm9yKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZhbHNlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Y2Nlc3NmdWxseSBzYXZlZCB0aGUgdXBkYXRlZCBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3aWxsIGJlIHVwZGF0ZWQgd2l0aCBkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBpbiB0aGUgY29sbGVjdGlvbiB3ZXJlIGFscmVhZHkgdXBkYXRlZC5cbiAgICogSG93ZXZlciwgdGhlIHNlcnZlciBtaWdodCBoYXZlIHNldCBvciBtb2RpZmllZCBvdGhlciBmaWVsZHMgKGUuZywgY29uY3VycmVuY3kgZmllbGQpXG4gICAqIFRoZXJlZm9yZSwgdXBkYXRlIHRoZSBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgdXBkYXRlIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIGFjdGlvbiBwYXlsb2FkIGhvbGRzIG9wdGlvbnMsIGluY2x1ZGluZyBpZiB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEgd2hpY2gsIG11c3QgYmUgYW4gYXJyYXkgb2YgVXBkYXRlUmVzcG9uc2U8VD4uXG4gICAqIFlvdSBtdXN0IGluY2x1ZGUgYW4gVXBkYXRlUmVzcG9uc2UgZm9yIGV2ZXJ5IFVwZGF0ZSBzZW50IHRvIHRoZSBzZXJ2ZXIsXG4gICAqIGV2ZW4gaWYgdGhlIHNhdmUgd2FzIG9wdGltaXN0aWMsIHRvIGVuc3VyZSB0aGF0IHRoZSBjaGFuZ2UgdHJhY2tpbmcgaXMgcHJvcGVybHkgcmVzZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwZGF0ZU1hbnlTdWNjZXNzKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLmd1YXJkLm11c3RCZVVwZGF0ZVJlc3BvbnNlcyhhY3Rpb24pO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9IHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLm1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgICB1cGRhdGVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICBmYWxzZSAvKiBuZXZlciBza2lwICovXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlVXBkYXRlTWFueVxuXG4gIC8vICNyZWdpb24gc2F2ZVVwc2VydE9uZVxuICAvKipcbiAgICogU2F2ZSBhIG5ldyBvciBleGlzdGluZyBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBwZXNzaW1pc3RpY2FsbHksIGRlbGF5IGFkZGluZyB0byBjb2xsZWN0aW9uIHVudGlsIHNlcnZlciBhY2tub3dsZWRnZXMgc3VjY2Vzcy5cbiAgICogSWYgc2F2aW5nIG9wdGltaXN0aWNhbGx5OyBhZGQgaW1tZWRpYXRlbHkuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHdoaWNoIHRoZSBlbnRpdHkgc2hvdWxkIGJlIHVwc2VydGVkLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gcGF5bG9hZCBob2xkcyBvcHRpb25zLCBpbmNsdWRpbmcgd2hldGhlciB0aGUgc2F2ZSBpcyBvcHRpbWlzdGljLFxuICAgKiBhbmQgdGhlIGRhdGEsIHdoaWNoIG11c3QgYmUgYSB3aG9sZSBlbnRpdHkuXG4gICAqIElmIHNhdmluZyBvcHRpbWlzdGljYWxseSwgdGhlIGVudGl0eSBtdXN0IGhhdmUgaXRzIGtleS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0T25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7IC8vIGVuc3VyZSB0aGUgZW50aXR5IGhhcyBhIFBLXG4gICAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja1Vwc2VydE9uZShcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgICApO1xuICAgICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ1RydWUoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byBzYXZlIG5ldyBvciBleGlzdGluZyBlbnRpdHkgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBuZXcgb3IgdXBkYXRlZCBlbnRpdHkgaXMgbm90IGluIHRoZSBjb2xsZWN0aW9uIGFuZFxuICAgKiB5b3UgbWF5IG5vdCBoYXZlIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgb3B0aW1pc3RpY2FsbHksIHRoZSB1bnNhdmVkIGVudGl0aWVzIGFyZSBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBuZWVkIHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBlcnJvci5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0T25lRXJyb3IoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmFsc2UoY29sbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3VjY2Vzc2Z1bGx5IHNhdmVkIG5ldyBvciBleGlzdGluZyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBJZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHksIGFkZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBJZiBzYXZlZCBvcHRpbWlzdGljYWxseSwgdGhlIGFkZGVkIGVudGl0aWVzIGFyZSBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBIb3dldmVyLCB0aGUgc2VydmVyIG1pZ2h0IGhhdmUgc2V0IG9yIG1vZGlmaWVkIG90aGVyIGZpZWxkcyAoZS5nLCBjb25jdXJyZW5jeSBmaWVsZClcbiAgICogVGhlcmVmb3JlLCB1cGRhdGUgdGhlIGVudGl0aWVzIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHJldHVybmVkIHZhbHVlcyAoaWYgYW55KVxuICAgKiBDYXV0aW9uOiBpbiBhIHJhY2UsIHRoaXMgdXBkYXRlIGNvdWxkIG92ZXJ3cml0ZSB1bnNhdmVkIHVzZXIgY2hhbmdlcy5cbiAgICogVXNlIHBlc3NpbWlzdGljIGFkZCB0byBhdm9pZCB0aGlzIHJpc2suXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE9uZVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApIHtcbiAgICAvLyBGb3IgcGVzc2ltaXN0aWMgc2F2ZSwgZW5zdXJlIHRoZSBzZXJ2ZXIgZ2VuZXJhdGVkIHRoZSBwcmltYXJ5IGtleSBpZiB0aGUgY2xpZW50IGRpZG4ndCBzZW5kIG9uZS5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0eShhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgLy8gQWx3YXlzIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCB1cHNlcnRlZCBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHNlcnZlclxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICAgIFtlbnRpdHldLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcHNlcnRPbmVcblxuICAvLyAjcmVnaW9uIHNhdmVVcHNlcnRNYW55XG4gIC8qKlxuICAgKiBTYXZlIG11bHRpcGxlIG5ldyBvciBleGlzdGluZyBlbnRpdGllcy5cbiAgICogSWYgc2F2aW5nIHBlc3NpbWlzdGljYWxseSwgZGVsYXkgYWRkaW5nIHRvIGNvbGxlY3Rpb24gdW50aWwgc2VydmVyIGFja25vd2xlZGdlcyBzdWNjZXNzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHk7IGFkZCBpbW1lZGlhdGVseS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gd2hpY2ggdGhlIGVudGl0aWVzIHNob3VsZCBiZSB1cHNlcnRlZC5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgYWN0aW9uIHBheWxvYWQgaG9sZHMgb3B0aW9ucywgaW5jbHVkaW5nIHdoZXRoZXIgdGhlIHNhdmUgaXMgb3B0aW1pc3RpYyxcbiAgICogYW5kIHRoZSBkYXRhLCB3aGljaCBtdXN0IGJlIGFuIGFycmF5IG9mIHdob2xlIGVudGl0aWVzLlxuICAgKiBJZiBzYXZpbmcgb3B0aW1pc3RpY2FsbHksIHRoZSBlbnRpdGllcyBtdXN0IGhhdmUgdGhlaXIga2V5cy5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0TWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKHRoaXMuaXNPcHRpbWlzdGljKGFjdGlvbikpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pOyAvLyBlbnN1cmUgdGhlIGVudGl0eSBoYXMgYSBQS1xuICAgICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRNYW55KFxuICAgICAgICBlbnRpdGllcyxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICAgKTtcbiAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdUcnVlKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc2F2ZSBuZXcgb3IgZXhpc3RpbmcgZW50aXRpZXMgZmFpbGVkIG9yIHRpbWVkLW91dC5cbiAgICogQWN0aW9uIGhvbGRzIHRoZSBlcnJvci5cbiAgICogSWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LCBuZXcgZW50aXRpZXMgYXJlIG5vdCBpbiB0aGUgY29sbGVjdGlvbiBhbmRcbiAgICogeW91IG1heSBub3QgaGF2ZSB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgdW5zYXZlZCBlbnRpdGllcyBhcmUgaW4gdGhlIGNvbGxlY3Rpb24gYW5kXG4gICAqIHlvdSBtYXkgbmVlZCB0byBjb21wZW5zYXRlIGZvciB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F2ZVVwc2VydE1hbnlFcnJvcihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWNjZXNzZnVsbHkgc2F2ZWQgbmV3IG9yIGV4aXN0aW5nIGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIElmIHNhdmVkIHBlc3NpbWlzdGljYWxseSwgYWRkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIElmIHNhdmVkIG9wdGltaXN0aWNhbGx5LCB0aGUgYWRkZWQgZW50aXRpZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEhvd2V2ZXIsIHRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBzZXQgb3IgbW9kaWZpZWQgb3RoZXIgZmllbGRzIChlLmcsIGNvbmN1cnJlbmN5IGZpZWxkKVxuICAgKiBUaGVyZWZvcmUsIHVwZGF0ZSB0aGUgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWVzIChpZiBhbnkpXG4gICAqIENhdXRpb246IGluIGEgcmFjZSwgdGhpcyB1cGRhdGUgY291bGQgb3ZlcndyaXRlIHVuc2F2ZWQgdXNlciBjaGFuZ2VzLlxuICAgKiBVc2UgcGVzc2ltaXN0aWMgYWRkIHRvIGF2b2lkIHRoaXMgcmlzay5cbiAgICovXG4gIHByb3RlY3RlZCBzYXZlVXBzZXJ0TWFueVN1Y2Nlc3MoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICkge1xuICAgIC8vIEZvciBwZXNzaW1pc3RpYyBzYXZlLCBlbnN1cmUgdGhlIHNlcnZlciBnZW5lcmF0ZWQgdGhlIHByaW1hcnkga2V5IGlmIHRoZSBjbGllbnQgZGlkbid0IHNlbmQgb25lLlxuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgLy8gQWx3YXlzIHVwZGF0ZSB0aGUgY2FjaGUgd2l0aCB1cHNlcnRlZCBlbnRpdGllcyByZXR1cm5lZCBmcm9tIHNlcnZlclxuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIubWVyZ2VTYXZlVXBzZXJ0cyhcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnNldExvYWRpbmdGYWxzZShjb2xsZWN0aW9uKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIHNhdmVVcHNlcnRNYW55XG5cbiAgLy8gI2VuZHJlZ2lvbiBzYXZlIG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIGNhY2hlLW9ubHkgb3BlcmF0aW9uc1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgZW50aXRpZXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogU2V0cyBsb2FkZWQgZmxhZyB0byB0cnVlLlxuICAgKiBNZXJnZXMgcXVlcnkgcmVzdWx0cywgcHJlc2VydmluZyB1bnNhdmVkIGNoYW5nZXNcbiAgICovXG4gIHByb3RlY3RlZCBhZGRBbGwoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdGllcyhhY3Rpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmFkYXB0ZXIuYWRkQWxsKGVudGl0aWVzLCBjb2xsZWN0aW9uKSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlU3RhdGU6IHt9LFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmd1YXJkLm11c3RCZUVudGl0aWVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrQWRkTWFueShcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuYWRkTWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkT25lKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ndWFyZC5tdXN0QmVFbnRpdHkoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tBZGRPbmUoXG4gICAgICBlbnRpdHksXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5hZGRPbmUoZW50aXR5LCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW1vdmVNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248bnVtYmVyW10gfCBzdHJpbmdbXT5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGVudGl0eSBrZXlzXG4gICAgY29uc3Qga2V5cyA9IHRoaXMuZ3VhcmQubXVzdEJlS2V5cyhhY3Rpb24pIGFzIHN0cmluZ1tdO1xuICAgIGNvbnN0IG1lcmdlU3RyYXRlZ3kgPSB0aGlzLmV4dHJhY3RNZXJnZVN0cmF0ZWd5KGFjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci50cmFja0RlbGV0ZU1hbnkoXG4gICAgICBrZXlzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlTWFueShrZXlzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW1vdmVPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxudW1iZXIgfCBzdHJpbmc+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIC8vIHBheWxvYWQgbXVzdCBiZSBlbnRpdHkga2V5XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ndWFyZC5tdXN0QmVLZXkoYWN0aW9uKSBhcyBzdHJpbmc7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrRGVsZXRlT25lKFxuICAgICAga2V5LFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucmVtb3ZlT25lKGtleSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlQWxsKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuYWRhcHRlci5yZW1vdmVBbGwoY29sbGVjdGlvbiksXG4gICAgICBsb2FkZWQ6IGZhbHNlLCAvLyBPbmx5IFJFTU9WRV9BTEwgc2V0cyBsb2FkZWQgdG8gZmFsc2VcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgY2hhbmdlU3RhdGU6IHt9LCAvLyBBc3N1bWUgY2xlYXJpbmcgdGhlIGNvbGxlY3Rpb24gYW5kIG5vdCB0cnlpbmcgdG8gZGVsZXRlIGFsbCBlbnRpdGllc1xuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPltdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyBwYXlsb2FkIG11c3QgYmUgYW4gYXJyYXkgb2YgYFVwZGF0ZXM8VD5gLCBub3QgZW50aXRpZXNcbiAgICBjb25zdCB1cGRhdGVzID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGVzKGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBkYXRlTWFueShcbiAgICAgIHVwZGF0ZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZU9uZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgLy8gcGF5bG9hZCBtdXN0IGJlIGFuIGBVcGRhdGU8VD5gLCBub3QgYW4gZW50aXR5XG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy5ndWFyZC5tdXN0QmVVcGRhdGUoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcGRhdGVPbmUoXG4gICAgICB1cGRhdGUsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVPbmUodXBkYXRlLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cHNlcnRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyA8djY6IHBheWxvYWQgbXVzdCBiZSBhbiBhcnJheSBvZiBgVXBkYXRlczxUPmAsIG5vdCBlbnRpdGllc1xuICAgIC8vIHY2KzogcGF5bG9hZCBtdXN0IGJlIGFuIGFycmF5IG9mIFRcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXRpZXMoYWN0aW9uKTtcbiAgICBjb25zdCBtZXJnZVN0cmF0ZWd5ID0gdGhpcy5leHRyYWN0TWVyZ2VTdHJhdGVneShhY3Rpb24pO1xuICAgIGNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudHJhY2tVcHNlcnRNYW55KFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgbWVyZ2VTdHJhdGVneVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cHNlcnRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cHNlcnRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAvLyA8djY6IHBheWxvYWQgbXVzdCBiZSBhbiBgVXBkYXRlPFQ+YCwgbm90IGFuIGVudGl0eVxuICAgIC8vIHY2KzogcGF5bG9hZCBtdXN0IGJlIGEgVFxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ3VhcmQubXVzdEJlRW50aXR5KGFjdGlvbik7XG4gICAgY29uc3QgbWVyZ2VTdHJhdGVneSA9IHRoaXMuZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uKTtcbiAgICBjb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnRyYWNrVXBzZXJ0T25lKFxuICAgICAgZW50aXR5LFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBzZXJ0T25lKGVudGl0eSwgY29sbGVjdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWl0QWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdEFsbChjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21taXRNYW55KFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPlxuICApIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE1hbnkoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21taXRPbmUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxUPlxuICApIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLmNvbW1pdE9uZShcbiAgICAgIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSxcbiAgICAgIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVuZG9BbGwoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPikge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNoYW5nZVRyYWNrZXIudW5kb0FsbChjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvTWFueShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT5cbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q2hhbmdlVHJhY2tlci51bmRvTWFueShcbiAgICAgIHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKSxcbiAgICAgIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVuZG9PbmUoY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPiwgYWN0aW9uOiBFbnRpdHlBY3Rpb248VD4pIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDaGFuZ2VUcmFja2VyLnVuZG9PbmUoXG4gICAgICB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbiksXG4gICAgICBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBEYW5nZXJvdXM6IENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgY29sbGVjdGlvbidzIENoYW5nZVN0YXRlLiBVc2UgcmFyZWx5IGFuZCB3aXNlbHkuICovXG4gIHByb3RlY3RlZCBzZXRDaGFuZ2VTdGF0ZShcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPENoYW5nZVN0YXRlTWFwPFQ+PlxuICApIHtcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSA9PT0gY2hhbmdlU3RhdGVcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH07XG4gIH1cblxuICAvKipcbiAgICogRGFuZ2Vyb3VzOiBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGNvbGxlY3Rpb24uXG4gICAqIFByaW1hcmlseSBmb3IgdGVzdGluZyBhbmQgcmVoeWRyYXRpb24gZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgKiBVc2UgcmFyZWx5IGFuZCB3aXNlbHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0Q29sbGVjdGlvbihcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPEVudGl0eUNvbGxlY3Rpb248VD4+XG4gICkge1xuICAgIGNvbnN0IG5ld0NvbGxlY3Rpb24gPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24gPT09IG5ld0NvbGxlY3Rpb24gPyBjb2xsZWN0aW9uIDogbmV3Q29sbGVjdGlvbjtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRGaWx0ZXIoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxhbnk+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maWx0ZXIgPT09IGZpbHRlclxuICAgICAgPyBjb2xsZWN0aW9uXG4gICAgICA6IHsgLi4uY29sbGVjdGlvbiwgZmlsdGVyIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGVkKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248Ym9vbGVhbj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgY29uc3QgbG9hZGVkID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pID09PSB0cnVlIHx8IGZhbHNlO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmxvYWRlZCA9PT0gbG9hZGVkXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBsb2FkZWQgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nKFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248Ym9vbGVhbj5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0TG9hZGluZ0ZsYWcoY29sbGVjdGlvbiwgdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMb2FkaW5nRmFsc2UoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uLCBmYWxzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0TG9hZGluZ1RydWUoXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nRmxhZyhjb2xsZWN0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIGNvbGxlY3Rpb24ncyBsb2FkaW5nIGZsYWcgKi9cbiAgcHJvdGVjdGVkIHNldExvYWRpbmdGbGFnKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sIGxvYWRpbmc6IGJvb2xlYW4pIHtcbiAgICBsb2FkaW5nID0gbG9hZGluZyA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5sb2FkaW5nID09PSBsb2FkaW5nXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBsb2FkaW5nIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBDYWNoZS1vbmx5IG9wZXJhdGlvbnNcblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgLyoqIFNhZmVseSBleHRyYWN0IGRhdGEgZnJvbSB0aGUgRW50aXR5QWN0aW9uIHBheWxvYWQgKi9cbiAgcHJvdGVjdGVkIGV4dHJhY3REYXRhPEQgPSBhbnk+KGFjdGlvbjogRW50aXR5QWN0aW9uPEQ+KTogRCB7XG4gICAgcmV0dXJuIChhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5kYXRhKSBhcyBEO1xuICB9XG5cbiAgLyoqIFNhZmVseSBleHRyYWN0IE1lcmdlU3RyYXRlZ3kgZnJvbSBFbnRpdHlBY3Rpb24uIFNldCB0byBJZ25vcmVDaGFuZ2VzIGlmIGNvbGxlY3Rpb24gaXRzZWxmIGlzIG5vdCB0cmFja2VkLiAqL1xuICBwcm90ZWN0ZWQgZXh0cmFjdE1lcmdlU3RyYXRlZ3koYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICAvLyBJZiBub3QgdHJhY2tpbmcgdGhpcyBjb2xsZWN0aW9uLCBhbHdheXMgaWdub3JlIGNoYW5nZXNcbiAgICByZXR1cm4gdGhpcy5pc0NoYW5nZVRyYWNraW5nXG4gICAgICA/IGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLm1lcmdlU3RyYXRlZ3lcbiAgICAgIDogTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzT3B0aW1pc3RpYyhhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5pc09wdGltaXN0aWMgPT09IHRydWU7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHtFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHN9IGZvciBhIGdpdmVuIGVudGl0eSB0eXBlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U6IEVudGl0eURlZmluaXRpb25TZXJ2aWNlKSB7fVxuXG4gIC8qKiBDcmVhdGUgdGhlICB7RW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzfSBmb3IgdGhlIG5hbWVkIGVudGl0eSB0eXBlICovXG4gIGNyZWF0ZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZE1hcDxUPiB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbjxUPihcbiAgICAgIGVudGl0eU5hbWVcbiAgICApO1xuICAgIGNvbnN0IG1ldGhvZHNDbGFzcyA9IG5ldyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHMoXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgZGVmaW5pdGlvblxuICAgICk7XG5cbiAgICByZXR1cm4gbWV0aG9kc0NsYXNzLm1ldGhvZHM7XG4gIH1cbn1cbiJdfQ==