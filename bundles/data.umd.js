/**
 * @license NgRx 8.0.1
 * (c) 2015-2018 Brandon Roberts, Mike Ryan, Rob Wormald, Victor Savkin
 * License: MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/core'), require('rxjs/operators'), require('@angular/common/http'), require('rxjs'), require('@ngrx/entity'), require('@ngrx/store'), require('@ngrx/effects')) :
    typeof define === 'function' && define.amd ? define('@ngrx/data', ['exports', 'tslib', '@angular/core', 'rxjs/operators', '@angular/common/http', 'rxjs', '@ngrx/entity', '@ngrx/store', '@ngrx/effects'], factory) :
    (global = global || self, factory((global.ngrx = global.ngrx || {}, global.ngrx.data = {}), global.tslib, global.ng.core, global.rxjs.operators, global.ng.common.http, global.rxjs, global['@ngrx/entity'], global['@ngrx/store'], global['@ngrx/effects']));
}(this, function (exports, tslib_1, core, operators, http, rxjs, entity, store, effects) { 'use strict';

    var EntityActionFactory = /** @class */ (function () {
        function EntityActionFactory() {
        }
        // polymorphic create for the two signatures
        EntityActionFactory.prototype.create = function (nameOrPayload, entityOp, data, options) {
            var payload = typeof nameOrPayload === 'string'
                ? tslib_1.__assign({}, (options || {}), { entityName: nameOrPayload, entityOp: entityOp,
                    data: data })
                : nameOrPayload;
            return this.createCore(payload);
        };
        /**
         * Create an EntityAction to perform an operation (op) for a particular entity type
         * (entityName) with optional data and other optional flags
         * @param payload Defines the EntityAction and its options
         */
        EntityActionFactory.prototype.createCore = function (payload) {
            var entityName = payload.entityName, entityOp = payload.entityOp, tag = payload.tag;
            if (!entityName) {
                throw new Error('Missing entity name for new action');
            }
            if (entityOp == null) {
                throw new Error('Missing EntityOp for new action');
            }
            var type = this.formatActionType(entityOp, tag || entityName);
            return { type: type, payload: payload };
        };
        /**
         * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
         * @param from Source action that is the base for the new action
         * @param newProperties New EntityAction properties that replace the source action properties
         */
        EntityActionFactory.prototype.createFromAction = function (from, newProperties) {
            return this.create(tslib_1.__assign({}, from.payload, newProperties));
        };
        EntityActionFactory.prototype.formatActionType = function (op, tag) {
            return "[" + tag + "] " + op;
            // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
        };
        EntityActionFactory = tslib_1.__decorate([
            core.Injectable()
        ], EntityActionFactory);
        return EntityActionFactory;
    }());

    /**
     * Guard methods that ensure EntityAction payload is as expected.
     * Each method returns that payload if it passes the guard or
     * throws an error.
     */
    var EntityActionGuard = /** @class */ (function () {
        function EntityActionGuard(entityName, selectId) {
            this.entityName = entityName;
            this.selectId = selectId;
        }
        /** Throw if the action payload is not an entity with a valid key */
        EntityActionGuard.prototype.mustBeEntity = function (action) {
            var data = this.extractData(action);
            if (!data) {
                return this.throwError(action, "should have a single entity.");
            }
            var id = this.selectId(data);
            if (this.isNotKeyType(id)) {
                this.throwError(action, "has a missing or invalid entity key (id)");
            }
            return data;
        };
        /** Throw if the action payload is not an array of entities with valid keys */
        EntityActionGuard.prototype.mustBeEntities = function (action) {
            var _this = this;
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entities");
            }
            data.forEach(function (entity, i) {
                var id = _this.selectId(entity);
                if (_this.isNotKeyType(id)) {
                    var msg = ", item " + (i + 1) + ", does not have a valid entity key (id)";
                    _this.throwError(action, msg);
                }
            });
            return data;
        };
        /** Throw if the action payload is not a single, valid key */
        EntityActionGuard.prototype.mustBeKey = function (action) {
            var data = this.extractData(action);
            if (!data) {
                throw new Error("should be a single entity key");
            }
            if (this.isNotKeyType(data)) {
                throw new Error("is not a valid key (id)");
            }
            return data;
        };
        /** Throw if the action payload is not an array of valid keys */
        EntityActionGuard.prototype.mustBeKeys = function (action) {
            var _this = this;
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entity keys (id)");
            }
            data.forEach(function (id, i) {
                if (_this.isNotKeyType(id)) {
                    var msg = _this.entityName + " ', item " + (i +
                        1) + ", is not a valid entity key (id)";
                    _this.throwError(action, msg);
                }
            });
            return data;
        };
        /** Throw if the action payload is not an update with a valid key (id) */
        EntityActionGuard.prototype.mustBeUpdate = function (action) {
            var data = this.extractData(action);
            if (!data) {
                return this.throwError(action, "should be a single entity update");
            }
            var id = data.id, changes = data.changes;
            var id2 = this.selectId(changes);
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, "has a missing or invalid entity key (id)");
            }
            return data;
        };
        /** Throw if the action payload is not an array of updates with valid keys (ids) */
        EntityActionGuard.prototype.mustBeUpdates = function (action) {
            var _this = this;
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entity updates");
            }
            data.forEach(function (item, i) {
                var id = item.id, changes = item.changes;
                var id2 = _this.selectId(changes);
                if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                    _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
                }
            });
            return data;
        };
        /** Throw if the action payload is not an update response with a valid key (id) */
        EntityActionGuard.prototype.mustBeUpdateResponse = function (action) {
            var data = this.extractData(action);
            if (!data) {
                return this.throwError(action, "should be a single entity update");
            }
            var id = data.id, changes = data.changes;
            var id2 = this.selectId(changes);
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, "has a missing or invalid entity key (id)");
            }
            return data;
        };
        /** Throw if the action payload is not an array of update responses with valid keys (ids) */
        EntityActionGuard.prototype.mustBeUpdateResponses = function (action) {
            var _this = this;
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entity updates");
            }
            data.forEach(function (item, i) {
                var id = item.id, changes = item.changes;
                var id2 = _this.selectId(changes);
                if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                    _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
                }
            });
            return data;
        };
        EntityActionGuard.prototype.extractData = function (action) {
            return action.payload && action.payload.data;
        };
        /** Return true if this key (id) is invalid */
        EntityActionGuard.prototype.isNotKeyType = function (id) {
            return typeof id !== 'string' && typeof id !== 'number';
        };
        EntityActionGuard.prototype.throwError = function (action, msg) {
            throw new Error(this.entityName + " EntityAction guard for \"" + action.type + "\": payload " + msg);
        };
        return EntityActionGuard;
    }());

    /**
     * Default function that returns the entity's primary key (pkey).
     * Assumes that the entity has an `id` pkey property.
     * Returns `undefined` if no entity or `id`.
     * Every selectId fn must return `undefined` when it cannot produce a full pkey.
     */
    function defaultSelectId(entity) {
        return entity == null ? undefined : entity.id;
    }
    /**
     * Flatten first arg if it is an array
     * Allows fn with ...rest signature to be called with an array instead of spread
     * Example:
     * ```
     * // See entity-action-operators.ts
     * const persistOps = [EntityOp.QUERY_ALL, EntityOp.ADD, ...];
     * actions.pipe(ofEntityOp(...persistOps)) // works
     * actions.pipe(ofEntityOp(persistOps)) // also works
     * ```
     * */
    function flattenArgs(args) {
        if (args == null) {
            return [];
        }
        if (Array.isArray(args[0])) {
            var _a = tslib_1.__read(args), head = _a[0], tail = _a.slice(1);
            args = tslib_1.__spread(head, tail);
        }
        return args;
    }
    /**
     * Return a function that converts an entity (or partial entity) into the `Update<T>`
     * whose `id` is the primary key and
     * `changes` is the entity (or partial entity of changes).
     */
    function toUpdateFactory(selectId) {
        selectId = selectId || defaultSelectId;
        /**
         * Convert an entity (or partial entity) into the `Update<T>`
         * whose `id` is the primary key and
         * `changes` is the entity (or partial entity of changes).
         * @param selectId function that returns the entity's primary key (id)
         */
        return function toUpdate(entity) {
            var id = selectId(entity);
            if (id == null) {
                throw new Error('Primary key may not be null/undefined.');
            }
            return entity && { id: id, changes: entity };
        };
    }

    function ofEntityOp() {
        var allowedEntityOps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allowedEntityOps[_i] = arguments[_i];
        }
        var ops = flattenArgs(allowedEntityOps);
        switch (ops.length) {
            case 0:
                return operators.filter(function (action) {
                    return action.payload && action.payload.entityOp != null;
                });
            case 1:
                var op_1 = ops[0];
                return operators.filter(function (action) {
                    return action.payload && op_1 === action.payload.entityOp;
                });
            default:
                return operators.filter(function (action) {
                    var entityOp = action.payload && action.payload.entityOp;
                    return entityOp && ops.some(function (o) { return o === entityOp; });
                });
        }
    }
    function ofEntityType() {
        var allowedEntityNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allowedEntityNames[_i] = arguments[_i];
        }
        var names = flattenArgs(allowedEntityNames);
        switch (names.length) {
            case 0:
                return operators.filter(function (action) {
                    return action.payload && action.payload.entityName != null;
                });
            case 1:
                var name_1 = names[0];
                return operators.filter(function (action) {
                    return action.payload && name_1 === action.payload.entityName;
                });
            default:
                return operators.filter(function (action) {
                    var entityName = action.payload && action.payload.entityName;
                    return !!entityName && names.some(function (n) { return n === entityName; });
                });
        }
    }

    (function (ChangeSetOperation) {
        ChangeSetOperation["Add"] = "Add";
        ChangeSetOperation["Delete"] = "Delete";
        ChangeSetOperation["Update"] = "Update";
        ChangeSetOperation["Upsert"] = "Upsert";
    })(exports.ChangeSetOperation || (exports.ChangeSetOperation = {}));
    /**
     * Factory to create a ChangeSetItem for a ChangeSetOperation
     */
    var ChangeSetItemFactory = /** @class */ (function () {
        function ChangeSetItemFactory() {
        }
        /** Create the ChangeSetAdd for new entities of the given entity type */
        ChangeSetItemFactory.prototype.add = function (entityName, entities) {
            entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
            return { entityName: entityName, op: exports.ChangeSetOperation.Add, entities: entities };
        };
        /** Create the ChangeSetDelete for primary keys of the given entity type */
        ChangeSetItemFactory.prototype.delete = function (entityName, keys) {
            var ids = Array.isArray(keys)
                ? keys
                : keys
                    ? [keys]
                    : [];
            return { entityName: entityName, op: exports.ChangeSetOperation.Delete, entities: ids };
        };
        /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
        ChangeSetItemFactory.prototype.update = function (entityName, updates) {
            updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
            return { entityName: entityName, op: exports.ChangeSetOperation.Update, entities: updates };
        };
        /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
        ChangeSetItemFactory.prototype.upsert = function (entityName, entities) {
            entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
            return { entityName: entityName, op: exports.ChangeSetOperation.Upsert, entities: entities };
        };
        return ChangeSetItemFactory;
    }());
    /**
     * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
     */
    var changeSetItemFactory = new ChangeSetItemFactory();
    /**
     * Return ChangeSet after filtering out null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    function excludeEmptyChangeSetItems(changeSet) {
        changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
        var changes = changeSet.changes.filter(function (c) { return c != null && c.entities && c.entities.length > 0; });
        return tslib_1.__assign({}, changeSet, { changes: changes });
    }

    /** How to merge an entity, after query or save, when the corresponding entity in the collection has unsaved changes. */
    (function (MergeStrategy) {
        /**
         * Update the collection entities and ignore all change tracking for this operation.
         * ChangeState is untouched.
         */
        MergeStrategy[MergeStrategy["IgnoreChanges"] = 0] = "IgnoreChanges";
        /**
         * Updates current values for unchanged entities.
         * If entities are changed, preserves their current values and
         * overwrites their originalValue with the merge entity.
         * This is the query-success default.
         */
        MergeStrategy[MergeStrategy["PreserveChanges"] = 1] = "PreserveChanges";
        /**
         * Replace the current collection entities.
         * Discards the ChangeState for the merged entities if set
         * and their ChangeTypes becomes "unchanged".
         * This is the save-success default.
         */
        MergeStrategy[MergeStrategy["OverwriteChanges"] = 2] = "OverwriteChanges";
    })(exports.MergeStrategy || (exports.MergeStrategy = {}));

    (function (EntityCacheAction) {
        EntityCacheAction["CLEAR_COLLECTIONS"] = "@ngrx/data/entity-cache/clear-collections";
        EntityCacheAction["LOAD_COLLECTIONS"] = "@ngrx/data/entity-cache/load-collections";
        EntityCacheAction["MERGE_QUERY_SET"] = "@ngrx/data/entity-cache/merge-query-set";
        EntityCacheAction["SET_ENTITY_CACHE"] = "@ngrx/data/entity-cache/set-cache";
        EntityCacheAction["SAVE_ENTITIES"] = "@ngrx/data/entity-cache/save-entities";
        EntityCacheAction["SAVE_ENTITIES_CANCEL"] = "@ngrx/data/entity-cache/save-entities-cancel";
        EntityCacheAction["SAVE_ENTITIES_CANCELED"] = "@ngrx/data/entity-cache/save-entities-canceled";
        EntityCacheAction["SAVE_ENTITIES_ERROR"] = "@ngrx/data/entity-cache/save-entities-error";
        EntityCacheAction["SAVE_ENTITIES_SUCCESS"] = "@ngrx/data/entity-cache/save-entities-success";
    })(exports.EntityCacheAction || (exports.EntityCacheAction = {}));
    /**
     * Clear the collections identified in the collectionSet.
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If no array, clear all collections.
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    var ClearCollections = /** @class */ (function () {
        function ClearCollections(collections, tag) {
            this.type = exports.EntityCacheAction.CLEAR_COLLECTIONS;
            this.payload = { collections: collections, tag: tag };
        }
        return ClearCollections;
    }());
    /**
     * Create entity cache action that loads multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param querySet The collections to load, typically the result of a query.
     * @param [tag] Optional tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    var LoadCollections = /** @class */ (function () {
        function LoadCollections(collections, tag) {
            this.type = exports.EntityCacheAction.LOAD_COLLECTIONS;
            this.payload = { collections: collections, tag: tag };
        }
        return LoadCollections;
    }());
    /**
     * Create entity cache action that merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    var MergeQuerySet = /** @class */ (function () {
        function MergeQuerySet(querySet, mergeStrategy, tag) {
            this.type = exports.EntityCacheAction.MERGE_QUERY_SET;
            this.payload = {
                querySet: querySet,
                mergeStrategy: mergeStrategy === null ? exports.MergeStrategy.PreserveChanges : mergeStrategy,
                tag: tag,
            };
        }
        return MergeQuerySet;
    }());
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    var SetEntityCache = /** @class */ (function () {
        function SetEntityCache(cache, tag) {
            this.cache = cache;
            this.type = exports.EntityCacheAction.SET_ENTITY_CACHE;
            this.payload = { cache: cache, tag: tag };
        }
        return SetEntityCache;
    }());
    // #region SaveEntities
    var SaveEntities = /** @class */ (function () {
        function SaveEntities(changeSet, url, options) {
            this.type = exports.EntityCacheAction.SAVE_ENTITIES;
            options = options || {};
            if (changeSet) {
                changeSet.tag = changeSet.tag || options.tag;
            }
            this.payload = tslib_1.__assign({ changeSet: changeSet, url: url }, options, { tag: changeSet.tag });
        }
        return SaveEntities;
    }());
    var SaveEntitiesCancel = /** @class */ (function () {
        function SaveEntitiesCancel(correlationId, reason, entityNames, tag) {
            this.type = exports.EntityCacheAction.SAVE_ENTITIES_CANCEL;
            this.payload = { correlationId: correlationId, reason: reason, entityNames: entityNames, tag: tag };
        }
        return SaveEntitiesCancel;
    }());
    var SaveEntitiesCanceled = /** @class */ (function () {
        function SaveEntitiesCanceled(correlationId, reason, tag) {
            this.type = exports.EntityCacheAction.SAVE_ENTITIES_CANCEL;
            this.payload = { correlationId: correlationId, reason: reason, tag: tag };
        }
        return SaveEntitiesCanceled;
    }());
    var SaveEntitiesError = /** @class */ (function () {
        function SaveEntitiesError(error, originalAction) {
            this.type = exports.EntityCacheAction.SAVE_ENTITIES_ERROR;
            var correlationId = originalAction.payload.correlationId;
            this.payload = { error: error, originalAction: originalAction, correlationId: correlationId };
        }
        return SaveEntitiesError;
    }());
    var SaveEntitiesSuccess = /** @class */ (function () {
        function SaveEntitiesSuccess(changeSet, url, options) {
            this.type = exports.EntityCacheAction.SAVE_ENTITIES_SUCCESS;
            options = options || {};
            if (changeSet) {
                changeSet.tag = changeSet.tag || options.tag;
            }
            this.payload = tslib_1.__assign({ changeSet: changeSet, url: url }, options, { tag: changeSet.tag });
        }
        return SaveEntitiesSuccess;
    }());
    // #endregion SaveEntities

    // Ensure that these suffix values and the EntityOp suffixes match
    (function (EntityOp) {
        // Persistance operations
        EntityOp["CANCEL_PERSIST"] = "@ngrx/data/cancel-persist";
        EntityOp["CANCELED_PERSIST"] = "@ngrx/data/canceled-persist";
        EntityOp["QUERY_ALL"] = "@ngrx/data/query-all";
        EntityOp["QUERY_ALL_SUCCESS"] = "@ngrx/data/query-all/success";
        EntityOp["QUERY_ALL_ERROR"] = "@ngrx/data/query-all/error";
        EntityOp["QUERY_LOAD"] = "@ngrx/data/query-load";
        EntityOp["QUERY_LOAD_SUCCESS"] = "@ngrx/data/query-load/success";
        EntityOp["QUERY_LOAD_ERROR"] = "@ngrx/data/query-load/error";
        EntityOp["QUERY_MANY"] = "@ngrx/data/query-many";
        EntityOp["QUERY_MANY_SUCCESS"] = "@ngrx/data/query-many/success";
        EntityOp["QUERY_MANY_ERROR"] = "@ngrx/data/query-many/error";
        EntityOp["QUERY_BY_KEY"] = "@ngrx/data/query-by-key";
        EntityOp["QUERY_BY_KEY_SUCCESS"] = "@ngrx/data/query-by-key/success";
        EntityOp["QUERY_BY_KEY_ERROR"] = "@ngrx/data/query-by-key/error";
        EntityOp["SAVE_ADD_MANY"] = "@ngrx/data/save/add-many";
        EntityOp["SAVE_ADD_MANY_ERROR"] = "@ngrx/data/save/add-many/error";
        EntityOp["SAVE_ADD_MANY_SUCCESS"] = "@ngrx/data/save/add-many/success";
        EntityOp["SAVE_ADD_ONE"] = "@ngrx/data/save/add-one";
        EntityOp["SAVE_ADD_ONE_ERROR"] = "@ngrx/data/save/add-one/error";
        EntityOp["SAVE_ADD_ONE_SUCCESS"] = "@ngrx/data/save/add-one/success";
        EntityOp["SAVE_DELETE_MANY"] = "@ngrx/data/save/delete-many";
        EntityOp["SAVE_DELETE_MANY_SUCCESS"] = "@ngrx/data/save/delete-many/success";
        EntityOp["SAVE_DELETE_MANY_ERROR"] = "@ngrx/data/save/delete-many/error";
        EntityOp["SAVE_DELETE_ONE"] = "@ngrx/data/save/delete-one";
        EntityOp["SAVE_DELETE_ONE_SUCCESS"] = "@ngrx/data/save/delete-one/success";
        EntityOp["SAVE_DELETE_ONE_ERROR"] = "@ngrx/data/save/delete-one/error";
        EntityOp["SAVE_UPDATE_MANY"] = "@ngrx/data/save/update-many";
        EntityOp["SAVE_UPDATE_MANY_SUCCESS"] = "@ngrx/data/save/update-many/success";
        EntityOp["SAVE_UPDATE_MANY_ERROR"] = "@ngrx/data/save/update-many/error";
        EntityOp["SAVE_UPDATE_ONE"] = "@ngrx/data/save/update-one";
        EntityOp["SAVE_UPDATE_ONE_SUCCESS"] = "@ngrx/data/save/update-one/success";
        EntityOp["SAVE_UPDATE_ONE_ERROR"] = "@ngrx/data/save/update-one/error";
        // Use only if the server supports upsert;
        EntityOp["SAVE_UPSERT_MANY"] = "@ngrx/data/save/upsert-many";
        EntityOp["SAVE_UPSERT_MANY_SUCCESS"] = "@ngrx/data/save/upsert-many/success";
        EntityOp["SAVE_UPSERT_MANY_ERROR"] = "@ngrx/data/save/upsert-many/error";
        // Use only if the server supports upsert;
        EntityOp["SAVE_UPSERT_ONE"] = "@ngrx/data/save/upsert-one";
        EntityOp["SAVE_UPSERT_ONE_SUCCESS"] = "@ngrx/data/save/upsert-one/success";
        EntityOp["SAVE_UPSERT_ONE_ERROR"] = "@ngrx/data/save/upsert-one/error";
        // Cache operations
        EntityOp["ADD_ALL"] = "@ngrx/data/add-all";
        EntityOp["ADD_MANY"] = "@ngrx/data/add-many";
        EntityOp["ADD_ONE"] = "@ngrx/data/add-one";
        EntityOp["REMOVE_ALL"] = "@ngrx/data/remove-all";
        EntityOp["REMOVE_MANY"] = "@ngrx/data/remove-many";
        EntityOp["REMOVE_ONE"] = "@ngrx/data/remove-one";
        EntityOp["UPDATE_MANY"] = "@ngrx/data/update-many";
        EntityOp["UPDATE_ONE"] = "@ngrx/data/update-one";
        EntityOp["UPSERT_MANY"] = "@ngrx/data/upsert-many";
        EntityOp["UPSERT_ONE"] = "@ngrx/data/upsert-one";
        EntityOp["COMMIT_ALL"] = "@ngrx/data/commit-all";
        EntityOp["COMMIT_MANY"] = "@ngrx/data/commit-many";
        EntityOp["COMMIT_ONE"] = "@ngrx/data/commit-one";
        EntityOp["UNDO_ALL"] = "@ngrx/data/undo-all";
        EntityOp["UNDO_MANY"] = "@ngrx/data/undo-many";
        EntityOp["UNDO_ONE"] = "@ngrx/data/undo-one";
        EntityOp["SET_CHANGE_STATE"] = "@ngrx/data/set-change-state";
        EntityOp["SET_COLLECTION"] = "@ngrx/data/set-collection";
        EntityOp["SET_FILTER"] = "@ngrx/data/set-filter";
        EntityOp["SET_LOADED"] = "@ngrx/data/set-loaded";
        EntityOp["SET_LOADING"] = "@ngrx/data/set-loading";
    })(exports.EntityOp || (exports.EntityOp = {}));
    /** "Success" suffix appended to EntityOps that are successful.*/
    var OP_SUCCESS = '/success';
    /** "Error" suffix appended to EntityOps that have failed.*/
    var OP_ERROR = '/error';
    /** Make the error EntityOp corresponding to the given EntityOp */
    function makeErrorOp(op) {
        return (op + OP_ERROR);
    }
    /** Make the success EntityOp corresponding to the given EntityOp */
    function makeSuccessOp(op) {
        return (op + OP_SUCCESS);
    }

    /**
     * Error from a DataService
     * The source error either comes from a failed HTTP response or was thrown within the service.
     * @param error the HttpErrorResponse or the error thrown by the service
     * @param requestData the HTTP request information such as the method and the url.
     */
    // If extend from Error, `dse instanceof DataServiceError` returns false
    // in some (all?) unit tests so don't bother trying.
    var DataServiceError = /** @class */ (function () {
        function DataServiceError(error, requestData) {
            this.error = error;
            this.requestData = requestData;
            this.message = typeof error === 'string' ? error : extractMessage(error);
        }
        return DataServiceError;
    }());
    // Many ways the error can be shaped. These are the ways we recognize.
    function extractMessage(sourceError) {
        var error = sourceError.error, body = sourceError.body, message = sourceError.message;
        var errMessage = null;
        if (error) {
            // prefer HttpErrorResponse.error to its message property
            errMessage = typeof error === 'string' ? error : error.message;
        }
        else if (message) {
            errMessage = message;
        }
        else if (body) {
            // try the body if no error or message property
            errMessage = typeof body === 'string' ? body : body.error;
        }
        return typeof errMessage === 'string'
            ? errMessage
            : errMessage
                ? JSON.stringify(errMessage)
                : null;
    }

    /**
     * Optional configuration settings for an entity collection data service
     * such as the `DefaultDataService<T>`.
     */
    var DefaultDataServiceConfig = /** @class */ (function () {
        function DefaultDataServiceConfig() {
        }
        return DefaultDataServiceConfig;
    }());

    var Logger = /** @class */ (function () {
        function Logger() {
        }
        return Logger;
    }());
    var PLURAL_NAMES_TOKEN = new core.InjectionToken('@ngrx/data/plural-names');
    var Pluralizer = /** @class */ (function () {
        function Pluralizer() {
        }
        return Pluralizer;
    }());

    /**
     * Known resource URLS for specific entity types.
     * Each entity's resource URLS are endpoints that
     * target single entity and multi-entity HTTP operations.
     * Used by the `DefaultHttpUrlGenerator`.
     */
    var EntityHttpResourceUrls = /** @class */ (function () {
        function EntityHttpResourceUrls() {
        }
        return EntityHttpResourceUrls;
    }());
    /**
     * Generate the base part of an HTTP URL for
     * single entity or entity collection resource
     */
    var HttpUrlGenerator = /** @class */ (function () {
        function HttpUrlGenerator() {
        }
        return HttpUrlGenerator;
    }());
    var DefaultHttpUrlGenerator = /** @class */ (function () {
        function DefaultHttpUrlGenerator(pluralizer) {
            this.pluralizer = pluralizer;
            /**
             * Known single-entity and collection resource URLs for HTTP calls.
             * Generator methods returns these resource URLs for a given entity type name.
             * If the resources for an entity type name are not know, it generates
             * and caches a resource name for future use
             */
            this.knownHttpResourceUrls = {};
        }
        /**
         * Get or generate the entity and collection resource URLs for the given entity type name
         * @param entityName {string} Name of the entity type, e.g, 'Hero'
         * @param root {string} Root path to the resource, e.g., 'some-api`
         */
        DefaultHttpUrlGenerator.prototype.getResourceUrls = function (entityName, root) {
            var _a;
            var resourceUrls = this.knownHttpResourceUrls[entityName];
            if (!resourceUrls) {
                var nRoot = normalizeRoot(root);
                resourceUrls = {
                    entityResourceUrl: (nRoot + "/" + entityName + "/").toLowerCase(),
                    collectionResourceUrl: (nRoot + "/" + this.pluralizer.pluralize(entityName) + "/").toLowerCase(),
                };
                this.registerHttpResourceUrls((_a = {}, _a[entityName] = resourceUrls, _a));
            }
            return resourceUrls;
        };
        /**
         * Create the path to a single entity resource
         * @param entityName {string} Name of the entity type, e.g, 'Hero'
         * @param root {string} Root path to the resource, e.g., 'some-api`
         * @returns complete path to resource, e.g, 'some-api/hero'
         */
        DefaultHttpUrlGenerator.prototype.entityResource = function (entityName, root) {
            return this.getResourceUrls(entityName, root).entityResourceUrl;
        };
        /**
         * Create the path to a multiple entity (collection) resource
         * @param entityName {string} Name of the entity type, e.g, 'Hero'
         * @param root {string} Root path to the resource, e.g., 'some-api`
         * @returns complete path to resource, e.g, 'some-api/heroes'
         */
        DefaultHttpUrlGenerator.prototype.collectionResource = function (entityName, root) {
            return this.getResourceUrls(entityName, root).collectionResourceUrl;
        };
        /**
         * Register known single-entity and collection resource URLs for HTTP calls
         * @param entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
         * Well-formed resource urls end in a '/';
         * Note: this method does not ensure that resource urls are well-formed.
         */
        DefaultHttpUrlGenerator.prototype.registerHttpResourceUrls = function (entityHttpResourceUrls) {
            this.knownHttpResourceUrls = tslib_1.__assign({}, this.knownHttpResourceUrls, (entityHttpResourceUrls || {}));
        };
        DefaultHttpUrlGenerator = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [Pluralizer])
        ], DefaultHttpUrlGenerator);
        return DefaultHttpUrlGenerator;
    }());
    /** Remove leading & trailing spaces or slashes */
    function normalizeRoot(root) {
        return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
    }

    /**
     * A basic, generic entity data service
     * suitable for persistence of most entities.
     * Assumes a common REST-y web API
     */
    var DefaultDataService = /** @class */ (function () {
        function DefaultDataService(entityName, http, httpUrlGenerator, config) {
            this.http = http;
            this.httpUrlGenerator = httpUrlGenerator;
            this.getDelay = 0;
            this.saveDelay = 0;
            this.timeout = 0;
            this._name = entityName + " DefaultDataService";
            this.entityName = entityName;
            var _a = config || {}, _b = _a.root, root = _b === void 0 ? 'api' : _b, _c = _a.delete404OK, delete404OK = _c === void 0 ? true : _c, _d = _a.getDelay, getDelay = _d === void 0 ? 0 : _d, _e = _a.saveDelay, saveDelay = _e === void 0 ? 0 : _e, _f = _a.timeout, to = _f === void 0 ? 0 : _f;
            this.delete404OK = delete404OK;
            this.entityUrl = httpUrlGenerator.entityResource(entityName, root);
            this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
            this.getDelay = getDelay;
            this.saveDelay = saveDelay;
            this.timeout = to;
        }
        Object.defineProperty(DefaultDataService.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        DefaultDataService.prototype.add = function (entity) {
            var entityOrError = entity || new Error("No \"" + this.entityName + "\" entity to add");
            return this.execute('POST', this.entityUrl, entityOrError);
        };
        DefaultDataService.prototype.delete = function (key) {
            var err;
            if (key == null) {
                err = new Error("No \"" + this.entityName + "\" key to delete");
            }
            return this.execute('DELETE', this.entityUrl + key, err).pipe(
            // forward the id of deleted entity as the result of the HTTP DELETE
            operators.map(function (result) { return key; }));
        };
        DefaultDataService.prototype.getAll = function () {
            return this.execute('GET', this.entitiesUrl);
        };
        DefaultDataService.prototype.getById = function (key) {
            var err;
            if (key == null) {
                err = new Error("No \"" + this.entityName + "\" key to get");
            }
            return this.execute('GET', this.entityUrl + key, err);
        };
        DefaultDataService.prototype.getWithQuery = function (queryParams) {
            var qParams = typeof queryParams === 'string'
                ? { fromString: queryParams }
                : { fromObject: queryParams };
            var params = new http.HttpParams(qParams);
            return this.execute('GET', this.entitiesUrl, undefined, { params: params });
        };
        DefaultDataService.prototype.update = function (update) {
            var id = update && update.id;
            var updateOrError = id == null
                ? new Error("No \"" + this.entityName + "\" update data or id")
                : update.changes;
            return this.execute('PUT', this.entityUrl + id, updateOrError);
        };
        // Important! Only call if the backend service supports upserts as a POST to the target URL
        DefaultDataService.prototype.upsert = function (entity) {
            var entityOrError = entity || new Error("No \"" + this.entityName + "\" entity to upsert");
            return this.execute('POST', this.entityUrl, entityOrError);
        };
        DefaultDataService.prototype.execute = function (method, url, data, // data, error, or undefined/null
        options) {
            var req = { method: method, url: url, data: data, options: options };
            if (data instanceof Error) {
                return this.handleError(req)(data);
            }
            var result$;
            switch (method) {
                case 'DELETE': {
                    result$ = this.http.delete(url, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators.delay(this.saveDelay));
                    }
                    break;
                }
                case 'GET': {
                    result$ = this.http.get(url, options);
                    if (this.getDelay) {
                        result$ = result$.pipe(operators.delay(this.getDelay));
                    }
                    break;
                }
                case 'POST': {
                    result$ = this.http.post(url, data, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators.delay(this.saveDelay));
                    }
                    break;
                }
                // N.B.: It must return an Update<T>
                case 'PUT': {
                    result$ = this.http.put(url, data, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators.delay(this.saveDelay));
                    }
                    break;
                }
                default: {
                    var error = new Error('Unimplemented HTTP method, ' + method);
                    result$ = rxjs.throwError(error);
                }
            }
            if (this.timeout) {
                result$ = result$.pipe(operators.timeout(this.timeout + this.saveDelay));
            }
            return result$.pipe(operators.catchError(this.handleError(req)));
        };
        DefaultDataService.prototype.handleError = function (reqData) {
            var _this = this;
            return function (err) {
                var ok = _this.handleDelete404(err, reqData);
                if (ok) {
                    return ok;
                }
                var error = new DataServiceError(err, reqData);
                return rxjs.throwError(error);
            };
        };
        DefaultDataService.prototype.handleDelete404 = function (error, reqData) {
            if (error.status === 404 &&
                reqData.method === 'DELETE' &&
                this.delete404OK) {
                return rxjs.of({});
            }
            return undefined;
        };
        return DefaultDataService;
    }());
    /**
     * Create a basic, generic entity data service
     * suitable for persistence of most entities.
     * Assumes a common REST-y web API
     */
    var DefaultDataServiceFactory = /** @class */ (function () {
        function DefaultDataServiceFactory(http, httpUrlGenerator, config) {
            this.http = http;
            this.httpUrlGenerator = httpUrlGenerator;
            this.config = config;
            config = config || {};
            httpUrlGenerator.registerHttpResourceUrls(config.entityHttpResourceUrls);
        }
        /**
         * Create a default {EntityCollectionDataService} for the given entity type
         * @param entityName {string} Name of the entity type for this data service
         */
        DefaultDataServiceFactory.prototype.create = function (entityName) {
            return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
        };
        DefaultDataServiceFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(2, core.Optional()),
            tslib_1.__metadata("design:paramtypes", [http.HttpClient,
                HttpUrlGenerator,
                DefaultDataServiceConfig])
        ], DefaultDataServiceFactory);
        return DefaultDataServiceFactory;
    }());

    function createEntityDefinition(metadata) {
        var entityName = metadata.entityName;
        if (!entityName) {
            throw new Error('Missing required entityName');
        }
        metadata.entityName = entityName = entityName.trim();
        var selectId = metadata.selectId || defaultSelectId;
        var sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
        var entityAdapter = entity.createEntityAdapter({ selectId: selectId, sortComparer: sortComparer });
        var entityDispatcherOptions = metadata.entityDispatcherOptions || {};
        var initialState = entityAdapter.getInitialState(tslib_1.__assign({ entityName: entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
        var noChangeTracking = metadata.noChangeTracking === true; // false by default
        return {
            entityName: entityName,
            entityAdapter: entityAdapter,
            entityDispatcherOptions: entityDispatcherOptions,
            initialState: initialState,
            metadata: metadata,
            noChangeTracking: noChangeTracking,
            selectId: selectId,
            sortComparer: sortComparer,
        };
    }

    var ENTITY_METADATA_TOKEN = new core.InjectionToken('@ngrx/data/entity-metadata');

    /** Registry of EntityDefinitions for all cached entity types */
    var EntityDefinitionService = /** @class */ (function () {
        function EntityDefinitionService(entityMetadataMaps) {
            var _this = this;
            /** {EntityDefinition} for all cached entity types */
            this.definitions = {};
            if (entityMetadataMaps) {
                entityMetadataMaps.forEach(function (map) { return _this.registerMetadataMap(map); });
            }
        }
        /**
         * Get (or create) a data service for entity type
         * @param entityName - the name of the type
         *
         * Examples:
         *   getDefinition('Hero'); // definition for Heroes, untyped
         *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
         */
        EntityDefinitionService.prototype.getDefinition = function (entityName, shouldThrow) {
            if (shouldThrow === void 0) { shouldThrow = true; }
            entityName = entityName.trim();
            var definition = this.definitions[entityName];
            if (!definition && shouldThrow) {
                throw new Error("No EntityDefinition for entity type \"" + entityName + "\".");
            }
            return definition;
        };
        //////// Registration methods //////////
        /**
         * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
         * @param name - the name of the entity type
         * @param definition - {EntityMetadata} for a collection for that entity type
         *
         * Examples:
         *   registerMetadata(myHeroEntityDefinition);
         */
        EntityDefinitionService.prototype.registerMetadata = function (metadata) {
            if (metadata) {
                var definition = createEntityDefinition(metadata);
                this.registerDefinition(definition);
            }
        };
        /**
         * Register an EntityMetadataMap.
         * @param metadataMap - a map of entityType names to entity metadata
         *
         * Examples:
         *   registerMetadataMap({
         *     'Hero': myHeroMetadata,
         *     Villain: myVillainMetadata
         *   });
         */
        EntityDefinitionService.prototype.registerMetadataMap = function (metadataMap) {
            var _this = this;
            if (metadataMap === void 0) { metadataMap = {}; }
            // The entity type name should be the same as the map key
            Object.keys(metadataMap || {}).forEach(function (entityName) {
                return _this.registerMetadata(tslib_1.__assign({ entityName: entityName }, metadataMap[entityName]));
            });
        };
        /**
         * Register an {EntityDefinition} for an entity type
         * @param definition - EntityDefinition of a collection for that entity type
         *
         * Examples:
         *   registerDefinition('Hero', myHeroEntityDefinition);
         */
        EntityDefinitionService.prototype.registerDefinition = function (definition) {
            this.definitions[definition.entityName] = definition;
        };
        /**
         * Register a batch of EntityDefinitions.
         * @param definitions - map of entityType name and associated EntityDefinitions to merge.
         *
         * Examples:
         *   registerDefinitions({
         *     'Hero': myHeroEntityDefinition,
         *     Villain: myVillainEntityDefinition
         *   });
         */
        EntityDefinitionService.prototype.registerDefinitions = function (definitions) {
            Object.assign(this.definitions, definitions);
        };
        EntityDefinitionService = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(0, core.Optional()),
            tslib_1.__param(0, core.Inject(ENTITY_METADATA_TOKEN)),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], EntityDefinitionService);
        return EntityDefinitionService;
    }());

    var updateOp = exports.ChangeSetOperation.Update;
    /**
     * Default data service for making remote service calls targeting the entire EntityCache.
     * See EntityDataService for services that target a single EntityCollection
     */
    var EntityCacheDataService = /** @class */ (function () {
        function EntityCacheDataService(entityDefinitionService, http, config) {
            this.entityDefinitionService = entityDefinitionService;
            this.http = http;
            this.idSelectors = {};
            this.saveDelay = 0;
            this.timeout = 0;
            var _a = config || {}, _b = _a.saveDelay, saveDelay = _b === void 0 ? 0 : _b, _c = _a.timeout, to = _c === void 0 ? 0 : _c;
            this.saveDelay = saveDelay;
            this.timeout = to;
        }
        /**
         * Save changes to multiple entities across one or more entity collections.
         * Server endpoint must understand the essential SaveEntities protocol,
         * in particular the ChangeSet interface (except for Update<T>).
         * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
         * It then reconstructs Update<T>[] in the returned observable result.
         * @param changeSet  An array of SaveEntityItems.
         * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
         * known by its 'entityName'.
         * @param url The server endpoint that receives this request.
         */
        EntityCacheDataService.prototype.saveEntities = function (changeSet, url) {
            var _this = this;
            changeSet = this.filterChangeSet(changeSet);
            // Assume server doesn't understand @ngrx/entity Update<T> structure;
            // Extract the entity changes from the Update<T>[] and restore on the return from server
            changeSet = this.flattenUpdates(changeSet);
            var result$ = this.http
                .post(url, changeSet)
                .pipe(operators.map(function (result) { return _this.restoreUpdates(result); }), operators.catchError(this.handleError({ method: 'POST', url: url, data: changeSet })));
            if (this.timeout) {
                result$ = result$.pipe(operators.timeout(this.timeout));
            }
            if (this.saveDelay) {
                result$ = result$.pipe(operators.delay(this.saveDelay));
            }
            return result$;
        };
        // #region helpers
        EntityCacheDataService.prototype.handleError = function (reqData) {
            return function (err) {
                var error = new DataServiceError(err, reqData);
                return rxjs.throwError(error);
            };
        };
        /**
         * Filter changeSet to remove unwanted ChangeSetItems.
         * This implementation excludes null and empty ChangeSetItems.
         * @param changeSet ChangeSet with changes to filter
         */
        EntityCacheDataService.prototype.filterChangeSet = function (changeSet) {
            return excludeEmptyChangeSetItems(changeSet);
        };
        /**
         * Convert the entities in update changes from @ngrx Update<T> structure to just T.
         * Reverse of restoreUpdates().
         */
        EntityCacheDataService.prototype.flattenUpdates = function (changeSet) {
            var changes = changeSet.changes;
            if (changes.length === 0) {
                return changeSet;
            }
            var hasMutated = false;
            changes = changes.map(function (item) {
                if (item.op === updateOp && item.entities.length > 0) {
                    hasMutated = true;
                    return tslib_1.__assign({}, item, { entities: item.entities.map(function (u) { return u.changes; }) });
                }
                else {
                    return item;
                }
            });
            return hasMutated ? tslib_1.__assign({}, changeSet, { changes: changes }) : changeSet;
        };
        /**
         * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
         * Reverse of flattenUpdates().
         */
        EntityCacheDataService.prototype.restoreUpdates = function (changeSet) {
            var _this = this;
            if (changeSet == null) {
                // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
                return changeSet;
            }
            var changes = changeSet.changes;
            if (changes.length === 0) {
                return changeSet;
            }
            var hasMutated = false;
            changes = changes.map(function (item) {
                if (item.op === updateOp) {
                    // These are entities, not Updates; convert back to Updates
                    hasMutated = true;
                    var selectId_1 = _this.getIdSelector(item.entityName);
                    return tslib_1.__assign({}, item, { entities: item.entities.map(function (u) { return ({
                            id: selectId_1(u),
                            changes: u,
                        }); }) });
                }
                else {
                    return item;
                }
            });
            return hasMutated ? tslib_1.__assign({}, changeSet, { changes: changes }) : changeSet;
        };
        /**
         * Get the id (primary key) selector function for an entity type
         * @param entityName name of the entity type
         */
        EntityCacheDataService.prototype.getIdSelector = function (entityName) {
            var idSelector = this.idSelectors[entityName];
            if (!idSelector) {
                idSelector = this.entityDefinitionService.getDefinition(entityName)
                    .selectId;
                this.idSelectors[entityName] = idSelector;
            }
            return idSelector;
        };
        EntityCacheDataService = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(2, core.Optional()),
            tslib_1.__metadata("design:paramtypes", [EntityDefinitionService,
                http.HttpClient,
                DefaultDataServiceConfig])
        ], EntityCacheDataService);
        return EntityCacheDataService;
    }());

    /**
     * Registry of EntityCollection data services that make REST-like CRUD calls
     * to entity collection endpoints.
     */
    var EntityDataService = /** @class */ (function () {
        // TODO:  Optionally inject specialized entity data services
        // for those that aren't derived from BaseDataService.
        function EntityDataService(defaultDataServiceFactory) {
            this.defaultDataServiceFactory = defaultDataServiceFactory;
            this.services = {};
        }
        /**
         * Get (or create) a data service for entity type
         * @param entityName - the name of the type
         *
         * Examples:
         *   getService('Hero'); // data service for Heroes, untyped
         *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
         */
        EntityDataService.prototype.getService = function (entityName) {
            entityName = entityName.trim();
            var service = this.services[entityName];
            if (!service) {
                service = this.defaultDataServiceFactory.create(entityName);
                this.services[entityName] = service;
            }
            return service;
        };
        /**
         * Register an EntityCollectionDataService for an entity type
         * @param entityName - the name of the entity type
         * @param service - data service for that entity type
         *
         * Examples:
         *   registerService('Hero', myHeroDataService);
         *   registerService('Villain', myVillainDataService);
         */
        EntityDataService.prototype.registerService = function (entityName, service) {
            this.services[entityName.trim()] = service;
        };
        /**
         * Register a batch of data services.
         * @param services - data services to merge into existing services
         *
         * Examples:
         *   registerServices({
         *     Hero: myHeroDataService,
         *     Villain: myVillainDataService
         *   });
         */
        EntityDataService.prototype.registerServices = function (services) {
            this.services = tslib_1.__assign({}, this.services, services);
        };
        EntityDataService = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [DefaultDataServiceFactory])
        ], EntityDataService);
        return EntityDataService;
    }());

    /**
     * Handling of responses from persistence operation
     */
    var PersistenceResultHandler = /** @class */ (function () {
        function PersistenceResultHandler() {
        }
        return PersistenceResultHandler;
    }());
    /**
     * Default handling of responses from persistence operation,
     * specifically an EntityDataService
     */
    var DefaultPersistenceResultHandler = /** @class */ (function () {
        function DefaultPersistenceResultHandler(logger, entityActionFactory) {
            this.logger = logger;
            this.entityActionFactory = entityActionFactory;
        }
        /** Handle successful result of persistence operation on an EntityAction */
        DefaultPersistenceResultHandler.prototype.handleSuccess = function (originalAction) {
            var _this = this;
            var successOp = makeSuccessOp(originalAction.payload.entityOp);
            return function (data) {
                return _this.entityActionFactory.createFromAction(originalAction, {
                    entityOp: successOp,
                    data: data,
                });
            };
        };
        /** Handle error result of persistence operation on an EntityAction */
        DefaultPersistenceResultHandler.prototype.handleError = function (originalAction) {
            var _this = this;
            var errorOp = makeErrorOp(originalAction.payload.entityOp);
            return function (err) {
                var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
                var errorData = { error: error, originalAction: originalAction };
                _this.logger.error(errorData);
                var action = _this.entityActionFactory.createFromAction(originalAction, {
                    entityOp: errorOp,
                    data: errorData,
                });
                return action;
            };
        };
        DefaultPersistenceResultHandler = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [Logger,
                EntityActionFactory])
        ], DefaultPersistenceResultHandler);
        return DefaultPersistenceResultHandler;
    }());

    /**
     * Generates a string id beginning 'CRID',
     * followed by a monotonically increasing integer for use as a correlation id.
     * As they are produced locally by a singleton service,
     * these ids are guaranteed to be unique only
     * for the duration of a single client browser instance.
     * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
     * Do NOT use for entity keys.
     */
    var CorrelationIdGenerator = /** @class */ (function () {
        function CorrelationIdGenerator() {
            /** Seed for the ids */
            this.seed = 0;
            /** Prefix of the id, 'CRID; */
            this.prefix = 'CRID';
        }
        /** Return the next correlation id */
        CorrelationIdGenerator.prototype.next = function () {
            this.seed += 1;
            return this.prefix + this.seed;
        };
        CorrelationIdGenerator = tslib_1.__decorate([
            core.Injectable()
        ], CorrelationIdGenerator);
        return CorrelationIdGenerator;
    }());

    /**
     * Default options for EntityDispatcher behavior
     * such as whether `add()` is optimistic or pessimistic by default.
     * An optimistic save modifies the collection immediately and before saving to the server.
     * A pessimistic save modifies the collection after the server confirms the save was successful.
     * This class initializes the defaults to the safest values.
     * Provide an alternative to change the defaults for all entity collections.
     */
    var EntityDispatcherDefaultOptions = /** @class */ (function () {
        function EntityDispatcherDefaultOptions() {
            /** True if added entities are saved optimistically; false if saved pessimistically. */
            this.optimisticAdd = false;
            /** True if deleted entities are saved optimistically; false if saved pessimistically. */
            this.optimisticDelete = true;
            /** True if updated entities are saved optimistically; false if saved pessimistically. */
            this.optimisticUpdate = false;
            /** True if upsert entities are saved optimistically; false if saved pessimistically. */
            this.optimisticUpsert = false;
            /** True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically. */
            this.optimisticSaveEntities = false;
        }
        EntityDispatcherDefaultOptions = tslib_1.__decorate([
            core.Injectable()
        ], EntityDispatcherDefaultOptions);
        return EntityDispatcherDefaultOptions;
    }());

    /**
     * Persistence operation canceled
     */
    var PersistanceCanceled = /** @class */ (function () {
        function PersistanceCanceled(message) {
            this.message = message;
            this.message = message || 'Canceled by user';
        }
        return PersistanceCanceled;
    }());

    /**
     * Dispatches Entity Cache actions to the EntityCache reducer
     */
    var EntityCacheDispatcher = /** @class */ (function () {
        function EntityCacheDispatcher(
        /** Generates correlation ids for query and save methods */
        correlationIdGenerator, 
        /**
         * Dispatcher options configure dispatcher behavior such as
         * whether add is optimistic or pessimistic by default.
         */
        defaultDispatcherOptions, 
        /** Actions scanned by the store after it processed them with reducers. */
        scannedActions$, 
        /** The store, scoped to the EntityCache */
        store) {
            this.correlationIdGenerator = correlationIdGenerator;
            this.defaultDispatcherOptions = defaultDispatcherOptions;
            this.store = store;
            // Replay because sometimes in tests will fake data service with synchronous observable
            // which makes subscriber miss the dispatched actions.
            // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
            this.reducedActions$ = scannedActions$.pipe(operators.shareReplay(1));
            // Start listening so late subscriber won't miss the most recent action.
            this.raSubscription = this.reducedActions$.subscribe();
        }
        /**
         * Dispatch an Action to the store.
         * @param action the Action
         * @returns the dispatched Action
         */
        EntityCacheDispatcher.prototype.dispatch = function (action) {
            this.store.dispatch(action);
            return action;
        };
        /**
         * Dispatch action to cancel the saveEntities request with matching correlation id.
         * @param correlationId The correlation id for the corresponding action
         * @param [reason] explains why canceled and by whom.
         * @param [entityNames] array of entity names so can turn off loading flag for their collections.
         * @param [tag] tag to identify the operation from the app perspective.
         */
        EntityCacheDispatcher.prototype.cancelSaveEntities = function (correlationId, reason, entityNames, tag) {
            if (!correlationId) {
                throw new Error('Missing correlationId');
            }
            var action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
            this.dispatch(action);
        };
        /** Clear the named entity collections in cache
         * @param [collections] Array of names of the collections to clear.
         * If empty array, does nothing. If null/undefined/no array, clear all collections.
         * @param [tag] tag to identify the operation from the app perspective.
         */
        EntityCacheDispatcher.prototype.clearCollections = function (collections, tag) {
            this.dispatch(new ClearCollections(collections, tag));
        };
        /**
         * Load multiple entity collections at the same time.
         * before any selectors$ observables emit.
         * @param collections The collections to load, typically the result of a query.
         * @param [tag] tag to identify the operation from the app perspective.
         * in the form of a map of entity collections.
         */
        EntityCacheDispatcher.prototype.loadCollections = function (collections, tag) {
            this.dispatch(new LoadCollections(collections, tag));
        };
        /**
         * Merges entities from a query result
         * that returned entities from multiple collections.
         * Corresponding entity cache reducer should add and update all collections
         * at the same time, before any selectors$ observables emit.
         * @param querySet The result of the query in the form of a map of entity collections.
         * These are the entity data to merge into the respective collections.
         * @param mergeStrategy How to merge a queried entity when it is already in the collection.
         * The default is MergeStrategy.PreserveChanges
         * @param [tag] tag to identify the operation from the app perspective.
         */
        EntityCacheDispatcher.prototype.mergeQuerySet = function (querySet, mergeStrategy, tag) {
            this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
        };
        /**
         * Create entity cache action for replacing the entire entity cache.
         * Dangerous because brute force but useful as when re-hydrating an EntityCache
         * from local browser storage when the application launches.
         * @param cache New state of the entity cache
         * @param [tag] tag to identify the operation from the app perspective.
         */
        EntityCacheDispatcher.prototype.setEntityCache = function (cache, tag) {
            this.dispatch(new SetEntityCache(cache, tag));
        };
        /**
         * Dispatch action to save multiple entity changes to remote storage.
         * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
         * Important: only call if your server supports the SaveEntities protocol
         * through your EntityDataService.saveEntities method.
         * @param changes Either the entities to save, as an array of {ChangeSetItem}, or
         * a ChangeSet that holds such changes.
         * @param url The server url which receives the save request
         * @param [options] options such as tag, correlationId, isOptimistic, and mergeStrategy.
         * These values are defaulted if not supplied.
         * @returns A terminating Observable<ChangeSet> with data returned from the server
         * after server reports successful save OR the save error.
         * TODO: should return the matching entities from cache rather than the raw server data.
         */
        EntityCacheDispatcher.prototype.saveEntities = function (changes, url, options) {
            var changeSet = Array.isArray(changes) ? { changes: changes } : changes;
            options = options || {};
            var correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            var isOptimistic = options.isOptimistic == null
                ? this.defaultDispatcherOptions.optimisticSaveEntities || false
                : options.isOptimistic === true;
            var tag = options.tag || 'Save Entities';
            options = tslib_1.__assign({}, options, { correlationId: correlationId, isOptimistic: isOptimistic, tag: tag });
            var action = new SaveEntities(changeSet, url, options);
            this.dispatch(action);
            return this.getSaveEntitiesResponseData$(options.correlationId).pipe(operators.shareReplay(1));
        };
        /**
         * Return Observable of data from the server-success SaveEntities action with
         * the given Correlation Id, after that action was processed by the ngrx store.
         * or else put the server error on the Observable error channel.
         * @param crid The correlationId for both the save and response actions.
         */
        EntityCacheDispatcher.prototype.getSaveEntitiesResponseData$ = function (crid) {
            /**
             * reducedActions$ must be replay observable of the most recent action reduced by the store.
             * because the response action might have been dispatched to the store
             * before caller had a chance to subscribe.
             */
            return this.reducedActions$.pipe(operators.filter(function (act) {
                return act.type === exports.EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
                    act.type === exports.EntityCacheAction.SAVE_ENTITIES_ERROR ||
                    act.type === exports.EntityCacheAction.SAVE_ENTITIES_CANCEL;
            }), operators.filter(function (act) { return crid === act.payload.correlationId; }), operators.take(1), operators.mergeMap(function (act) {
                return act.type === exports.EntityCacheAction.SAVE_ENTITIES_CANCEL
                    ? rxjs.throwError(new PersistanceCanceled(act.payload.reason))
                    : act.type === exports.EntityCacheAction.SAVE_ENTITIES_SUCCESS
                        ? rxjs.of(act.payload.changeSet)
                        : rxjs.throwError(act.payload);
            }));
        };
        EntityCacheDispatcher = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(2, core.Inject(store.ScannedActionsSubject)),
            tslib_1.__metadata("design:paramtypes", [CorrelationIdGenerator,
                EntityDispatcherDefaultOptions,
                rxjs.Observable,
                store.Store])
        ], EntityCacheDispatcher);
        return EntityCacheDispatcher;
    }());

    /**
     * Dispatches EntityCollection actions to their reducers and effects (default implementation).
     * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
     */
    var EntityDispatcherBase = /** @class */ (function () {
        function EntityDispatcherBase(
        /** Name of the entity type for which entities are dispatched */
        entityName, 
        /** Creates an {EntityAction} */
        entityActionFactory, 
        /** The store, scoped to the EntityCache */
        store$1, 
        /** Returns the primary key (id) of this entity */
        selectId, 
        /**
         * Dispatcher options configure dispatcher behavior such as
         * whether add is optimistic or pessimistic by default.
         */
        defaultDispatcherOptions, 
        /** Actions scanned by the store after it processed them with reducers. */
        reducedActions$, 
        /** Store selector for the EntityCache */
        entityCacheSelector, 
        /** Generates correlation ids for query and save methods */
        correlationIdGenerator) {
            if (selectId === void 0) { selectId = defaultSelectId; }
            this.entityName = entityName;
            this.entityActionFactory = entityActionFactory;
            this.store = store$1;
            this.selectId = selectId;
            this.defaultDispatcherOptions = defaultDispatcherOptions;
            this.reducedActions$ = reducedActions$;
            this.correlationIdGenerator = correlationIdGenerator;
            this.guard = new EntityActionGuard(entityName, selectId);
            this.toUpdate = toUpdateFactory(selectId);
            var collectionSelector = store.createSelector(entityCacheSelector, function (cache) { return cache[entityName]; });
            this.entityCollection$ = store$1.select(collectionSelector);
        }
        /**
         * Create an {EntityAction} for this entity type.
         * @param entityOp {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the EntityAction
         */
        EntityDispatcherBase.prototype.createEntityAction = function (entityOp, data, options) {
            return this.entityActionFactory.create(tslib_1.__assign({ entityName: this.entityName, entityOp: entityOp,
                data: data }, options));
        };
        /**
         * Create an {EntityAction} for this entity type and
         * dispatch it immediately to the store.
         * @param op {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the dispatched EntityAction
         */
        EntityDispatcherBase.prototype.createAndDispatch = function (op, data, options) {
            var action = this.createEntityAction(op, data, options);
            this.dispatch(action);
            return action;
        };
        /**
         * Dispatch an Action to the store.
         * @param action the Action
         * @returns the dispatched Action
         */
        EntityDispatcherBase.prototype.dispatch = function (action) {
            this.store.dispatch(action);
            return action;
        };
        // #region Query and save operations
        /**
         * Dispatch action to save a new entity to remote storage.
         * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @returns A terminating Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityDispatcherBase.prototype.add = function (entity, options) {
            var _this = this;
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
            var action = this.createEntityAction(exports.EntityOp.SAVE_ADD_ONE, entity, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators.withLatestFrom(this.entityCollection$), operators.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), e = _b[0], collection = _b[1];
                return collection.entities[_this.selectId(e)];
            }), operators.shareReplay(1));
        };
        /**
         * Dispatch action to cancel the persistence operation (query or save).
         * Will cause save observable to error with a PersistenceCancel error.
         * Caller is responsible for undoing changes in cache from pending optimistic save
         * @param correlationId The correlation id for the corresponding EntityAction
         * @param [reason] explains why canceled and by whom.
         */
        EntityDispatcherBase.prototype.cancel = function (correlationId, reason, options) {
            if (!correlationId) {
                throw new Error('Missing correlationId');
            }
            this.createAndDispatch(exports.EntityOp.CANCEL_PERSIST, reason, { correlationId: correlationId });
        };
        EntityDispatcherBase.prototype.delete = function (arg, options) {
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
            var key = this.getKey(arg);
            var action = this.createEntityAction(exports.EntityOp.SAVE_DELETE_ONE, key, options);
            this.guard.mustBeKey(action);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(operators.map(function () { return key; }), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * merge the queried entities into the cached collection.
         * @returns A terminating Observable of the queried entities that are in the collection
         * after server reports success query or the query error.
         * @see load()
         */
        EntityDispatcherBase.prototype.getAll = function (options) {
            var _this = this;
            options = this.setQueryEntityActionOptions(options);
            var action = this.createEntityAction(exports.EntityOp.QUERY_ALL, null, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity ids to get the entities from the collection
            // as they might be different from the entities returned from the server
            // because of unsaved changes (deletes or updates).
            operators.withLatestFrom(this.entityCollection$), operators.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), entities = _b[0], collection = _b[1];
                return entities.reduce(function (acc, e) {
                    var entity = collection.entities[_this.selectId(e)];
                    if (entity) {
                        acc.push(entity); // only return an entity found in the collection
                    }
                    return acc;
                }, []);
            }), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for the entity with this primary key.
         * If the server returns an entity,
         * merge it into the cached collection.
         * @returns A terminating Observable of the collection
         * after server reports successful query or the query error.
         */
        EntityDispatcherBase.prototype.getByKey = function (key, options) {
            var _this = this;
            options = this.setQueryEntityActionOptions(options);
            var action = this.createEntityAction(exports.EntityOp.QUERY_BY_KEY, key, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators.withLatestFrom(this.entityCollection$), operators.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), entity = _b[0], collection = _b[1];
                return collection.entities[_this.selectId(entity)];
            }), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for the entities that satisfy a query expressed
         * with either a query parameter map or an HTTP URL query string,
         * and merge the results into the cached collection.
         * @param queryParams the query in a form understood by the server
         * @returns A terminating Observable of the queried entities
         * after server reports successful query or the query error.
         */
        EntityDispatcherBase.prototype.getWithQuery = function (queryParams, options) {
            var _this = this;
            options = this.setQueryEntityActionOptions(options);
            var action = this.createEntityAction(exports.EntityOp.QUERY_MANY, queryParams, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity ids to get the entities from the collection
            // as they might be different from the entities returned from the server
            // because of unsaved changes (deletes or updates).
            operators.withLatestFrom(this.entityCollection$), operators.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), entities = _b[0], collection = _b[1];
                return entities.reduce(function (acc, e) {
                    var entity = collection.entities[_this.selectId(e)];
                    if (entity) {
                        acc.push(entity); // only return an entity found in the collection
                    }
                    return acc;
                }, []);
            }), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * completely replace the cached collection with the queried entities.
         * @returns A terminating Observable of the entities in the collection
         * after server reports successful query or the query error.
         * @see getAll
         */
        EntityDispatcherBase.prototype.load = function (options) {
            options = this.setQueryEntityActionOptions(options);
            var action = this.createEntityAction(exports.EntityOp.QUERY_LOAD, null, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(operators.shareReplay(1));
        };
        /**
         * Dispatch action to save the updated entity (or partial entity) in remote storage.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param entity update entity, which might be a partial of T but must at least have its key.
         * @returns A terminating Observable of the updated entity
         * after server reports successful save or the save error.
         */
        EntityDispatcherBase.prototype.update = function (entity, options) {
            var _this = this;
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            var update = this.toUpdate(entity);
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
            var action = this.createEntityAction(exports.EntityOp.SAVE_UPDATE_ONE, update, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the update entity data id to get the entity from the collection
            // as might be different from the entity returned from the server
            // because the id changed or there are unsaved changes.
            operators.map(function (updateData) { return updateData.changes; }), operators.withLatestFrom(this.entityCollection$), operators.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), e = _b[0], collection = _b[1];
                return collection.entities[_this.selectId(e)];
            }), operators.shareReplay(1));
        };
        /**
         * Dispatch action to save a new or existing entity to remote storage.
         * Only dispatch this action if your server supports upsert.
         * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @returns A terminating Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityDispatcherBase.prototype.upsert = function (entity, options) {
            var _this = this;
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
            var action = this.createEntityAction(exports.EntityOp.SAVE_UPSERT_ONE, entity, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators.withLatestFrom(this.entityCollection$), operators.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), e = _b[0], collection = _b[1];
                return collection.entities[_this.selectId(e)];
            }), operators.shareReplay(1));
        };
        // #endregion Query and save operations
        // #region Cache-only operations that do not update remote storage
        // Unguarded for performance.
        // EntityCollectionReducer<T> runs a guard (which throws)
        // Developer should understand cache-only methods well enough
        // to call them with the proper entities.
        // May reconsider and add guards in future.
        /**
         * Replace all entities in the cached collection.
         * Does not save to remote storage.
         */
        EntityDispatcherBase.prototype.addAllToCache = function (entities, options) {
            this.createAndDispatch(exports.EntityOp.ADD_ALL, entities, options);
        };
        /**
         * Add a new entity directly to the cache.
         * Does not save to remote storage.
         * Ignored if an entity with the same primary key is already in cache.
         */
        EntityDispatcherBase.prototype.addOneToCache = function (entity, options) {
            this.createAndDispatch(exports.EntityOp.ADD_ONE, entity, options);
        };
        /**
         * Add multiple new entities directly to the cache.
         * Does not save to remote storage.
         * Entities with primary keys already in cache are ignored.
         */
        EntityDispatcherBase.prototype.addManyToCache = function (entities, options) {
            this.createAndDispatch(exports.EntityOp.ADD_MANY, entities, options);
        };
        /** Clear the cached entity collection */
        EntityDispatcherBase.prototype.clearCache = function (options) {
            this.createAndDispatch(exports.EntityOp.REMOVE_ALL, undefined, options);
        };
        EntityDispatcherBase.prototype.removeOneFromCache = function (arg, options) {
            this.createAndDispatch(exports.EntityOp.REMOVE_ONE, this.getKey(arg), options);
        };
        EntityDispatcherBase.prototype.removeManyFromCache = function (args, options) {
            var _this = this;
            if (!args || args.length === 0) {
                return;
            }
            var keys = typeof args[0] === 'object'
                ? // if array[0] is a key, assume they're all keys
                    args.map(function (arg) { return _this.getKey(arg); })
                : args;
            this.createAndDispatch(exports.EntityOp.REMOVE_MANY, keys, options);
        };
        /**
         * Update a cached entity directly.
         * Does not update that entity in remote storage.
         * Ignored if an entity with matching primary key is not in cache.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         */
        EntityDispatcherBase.prototype.updateOneInCache = function (entity, options) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            var update = this.toUpdate(entity);
            this.createAndDispatch(exports.EntityOp.UPDATE_ONE, update, options);
        };
        /**
         * Update multiple cached entities directly.
         * Does not update these entities in remote storage.
         * Entities whose primary keys are not in cache are ignored.
         * Update entities may be partial but must at least have their keys.
         * such partial entities patch their cached counterparts.
         */
        EntityDispatcherBase.prototype.updateManyInCache = function (entities, options) {
            var _this = this;
            if (!entities || entities.length === 0) {
                return;
            }
            var updates = entities.map(function (entity) { return _this.toUpdate(entity); });
            this.createAndDispatch(exports.EntityOp.UPDATE_MANY, updates, options);
        };
        /**
         * Add or update a new entity directly to the cache.
         * Does not save to remote storage.
         * Upsert entity might be a partial of T but must at least have its key.
         * Pass the Update<T> structure as the payload
         */
        EntityDispatcherBase.prototype.upsertOneInCache = function (entity, options) {
            this.createAndDispatch(exports.EntityOp.UPSERT_ONE, entity, options);
        };
        /**
         * Add or update multiple cached entities directly.
         * Does not save to remote storage.
         */
        EntityDispatcherBase.prototype.upsertManyInCache = function (entities, options) {
            if (!entities || entities.length === 0) {
                return;
            }
            this.createAndDispatch(exports.EntityOp.UPSERT_MANY, entities, options);
        };
        /**
         * Set the pattern that the collection's filter applies
         * when using the `filteredEntities` selector.
         */
        EntityDispatcherBase.prototype.setFilter = function (pattern) {
            this.createAndDispatch(exports.EntityOp.SET_FILTER, pattern);
        };
        /** Set the loaded flag */
        EntityDispatcherBase.prototype.setLoaded = function (isLoaded) {
            this.createAndDispatch(exports.EntityOp.SET_LOADED, !!isLoaded);
        };
        /** Set the loading flag */
        EntityDispatcherBase.prototype.setLoading = function (isLoading) {
            this.createAndDispatch(exports.EntityOp.SET_LOADING, !!isLoading);
        };
        // #endregion Cache-only operations that do not update remote storage
        // #region private helpers
        /** Get key from entity (unless arg is already a key) */
        EntityDispatcherBase.prototype.getKey = function (arg) {
            return typeof arg === 'object'
                ? this.selectId(arg)
                : arg;
        };
        /**
         * Return Observable of data from the server-success EntityAction with
         * the given Correlation Id, after that action was processed by the ngrx store.
         * or else put the server error on the Observable error channel.
         * @param crid The correlationId for both the save and response actions.
         */
        EntityDispatcherBase.prototype.getResponseData$ = function (crid) {
            var _this = this;
            /**
             * reducedActions$ must be replay observable of the most recent action reduced by the store.
             * because the response action might have been dispatched to the store
             * before caller had a chance to subscribe.
             */
            return this.reducedActions$.pipe(operators.filter(function (act) { return !!act.payload; }), operators.filter(function (act) {
                var _a = act.payload, correlationId = _a.correlationId, entityName = _a.entityName, entityOp = _a.entityOp;
                return (entityName === _this.entityName &&
                    correlationId === crid &&
                    (entityOp.endsWith(OP_SUCCESS) ||
                        entityOp.endsWith(OP_ERROR) ||
                        entityOp === exports.EntityOp.CANCEL_PERSIST));
            }), operators.take(1), operators.mergeMap(function (act) {
                var entityOp = act.payload.entityOp;
                return entityOp === exports.EntityOp.CANCEL_PERSIST
                    ? rxjs.throwError(new PersistanceCanceled(act.payload.data))
                    : entityOp.endsWith(OP_SUCCESS)
                        ? rxjs.of(act.payload.data)
                        : rxjs.throwError(act.payload.data.error);
            }));
        };
        EntityDispatcherBase.prototype.setQueryEntityActionOptions = function (options) {
            options = options || {};
            var correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            return tslib_1.__assign({}, options, { correlationId: correlationId });
        };
        EntityDispatcherBase.prototype.setSaveEntityActionOptions = function (options, defaultOptimism) {
            options = options || {};
            var correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            var isOptimistic = options.isOptimistic == null
                ? defaultOptimism || false
                : options.isOptimistic === true;
            return tslib_1.__assign({}, options, { correlationId: correlationId, isOptimistic: isOptimistic });
        };
        return EntityDispatcherBase;
    }());

    var ENTITY_CACHE_NAME = 'entityCache';
    var ENTITY_CACHE_NAME_TOKEN = new core.InjectionToken('@ngrx/data/entity-cache-name');
    var ENTITY_CACHE_META_REDUCERS = new core.InjectionToken('@ngrx/data/entity-cache-meta-reducers');
    var ENTITY_COLLECTION_META_REDUCERS = new core.InjectionToken('@ngrx/data/entity-collection-meta-reducers');
    var INITIAL_ENTITY_CACHE_STATE = new core.InjectionToken('@ngrx/data/initial-entity-cache-state');

    var ENTITY_CACHE_SELECTOR_TOKEN = new core.InjectionToken('@ngrx/data/entity-cache-selector');
    var entityCacheSelectorProvider = {
        provide: ENTITY_CACHE_SELECTOR_TOKEN,
        useFactory: createEntityCacheSelector,
        deps: [[new core.Optional(), ENTITY_CACHE_NAME_TOKEN]],
    };
    function createEntityCacheSelector(entityCacheName) {
        entityCacheName = entityCacheName || ENTITY_CACHE_NAME;
        return store.createFeatureSelector(entityCacheName);
    }

    /** Creates EntityDispatchers for entity collections */
    var EntityDispatcherFactory = /** @class */ (function () {
        function EntityDispatcherFactory(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
            this.entityActionFactory = entityActionFactory;
            this.store = store;
            this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
            this.entityCacheSelector = entityCacheSelector;
            this.correlationIdGenerator = correlationIdGenerator;
            // Replay because sometimes in tests will fake data service with synchronous observable
            // which makes subscriber miss the dispatched actions.
            // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
            this.reducedActions$ = scannedActions$.pipe(operators.shareReplay(1));
            // Start listening so late subscriber won't miss the most recent action.
            this.raSubscription = this.reducedActions$.subscribe();
        }
        /**
         * Create an `EntityDispatcher` for an entity type `T` and store.
         */
        EntityDispatcherFactory.prototype.create = function (
        /** Name of the entity type */
        entityName, 
        /**
         * Function that returns the primary key for an entity `T`.
         * Usually acquired from `EntityDefinition` metadata.
         */
        selectId, 
        /** Defaults for options that influence dispatcher behavior such as whether
         * `add()` is optimistic or pessimistic;
         */
        defaultOptions) {
            if (selectId === void 0) { selectId = defaultSelectId; }
            if (defaultOptions === void 0) { defaultOptions = {}; }
            // merge w/ defaultOptions with injected defaults
            var options = tslib_1.__assign({}, this.entityDispatcherDefaultOptions, defaultOptions);
            return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
        };
        EntityDispatcherFactory.prototype.ngOnDestroy = function () {
            this.raSubscription.unsubscribe();
        };
        EntityDispatcherFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(3, core.Inject(store.ScannedActionsSubject)),
            tslib_1.__param(4, core.Inject(ENTITY_CACHE_SELECTOR_TOKEN)),
            tslib_1.__metadata("design:paramtypes", [EntityActionFactory,
                store.Store,
                EntityDispatcherDefaultOptions,
                rxjs.Observable, Function, CorrelationIdGenerator])
        ], EntityDispatcherFactory);
        return EntityDispatcherFactory;
    }());

    // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
    /** Token to inject a special RxJS Scheduler during marble tests. */
    var ENTITY_EFFECTS_SCHEDULER = new core.InjectionToken('EntityEffects Scheduler');

    var EntityCacheEffects = /** @class */ (function () {
        function EntityCacheEffects(actions, dataService, entityActionFactory, logger, 
        /**
         * Injecting an optional Scheduler that will be undefined
         * in normal application usage, but its injected here so that you can mock out
         * during testing using the RxJS TestScheduler for simulating passages of time.
         */
        scheduler) {
            var _this = this;
            this.actions = actions;
            this.dataService = dataService;
            this.entityActionFactory = entityActionFactory;
            this.logger = logger;
            this.scheduler = scheduler;
            // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
            /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
            this.responseDelay = 10;
            /**
             * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
             */
            this.saveEntitiesCancel$ = this.actions.pipe(effects.ofType(exports.EntityCacheAction.SAVE_ENTITIES_CANCEL), operators.filter(function (a) { return a.payload.correlationId != null; }));
            // Concurrent persistence requests considered unsafe.
            // `mergeMap` allows for concurrent requests which may return in any order
            this.saveEntities$ = this.actions.pipe(effects.ofType(exports.EntityCacheAction.SAVE_ENTITIES), operators.mergeMap(function (action) { return _this.saveEntities(action); }));
        }
        /**
         * Perform the requested SaveEntities actions and return a scalar Observable<Action>
         * that the effect should dispatch to the store after the server responds.
         * @param action The SaveEntities action
         */
        EntityCacheEffects.prototype.saveEntities = function (action) {
            var _this = this;
            var error = action.payload.error;
            if (error) {
                return this.handleSaveEntitiesError$(action)(error);
            }
            try {
                var changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
                var _a = action.payload, correlationId_1 = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag, url = _a.url;
                var options = { correlationId: correlationId_1, mergeStrategy: mergeStrategy, tag: tag };
                if (changeSet.changes.length === 0) {
                    // nothing to save
                    return rxjs.of(new SaveEntitiesSuccess(changeSet, url, options));
                }
                // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
                // whose correlationId matches the cancellation correlationId
                var c = this.saveEntitiesCancel$.pipe(operators.filter(function (a) { return correlationId_1 === a.payload.correlationId; }), operators.map(function (a) {
                    return new SaveEntitiesCanceled(correlationId_1, a.payload.reason, a.payload.tag);
                }));
                // Data: SaveEntities result as a SaveEntitiesSuccess action
                var d = this.dataService.saveEntities(changeSet, url).pipe(operators.concatMap(function (result) {
                    return _this.handleSaveEntitiesSuccess$(action, _this.entityActionFactory)(result);
                }), operators.catchError(this.handleSaveEntitiesError$(action)));
                // Emit which ever gets there first; the other observable is terminated.
                return rxjs.race(c, d);
            }
            catch (err) {
                return this.handleSaveEntitiesError$(action)(err);
            }
        };
        /** return handler of error result of saveEntities, returning a scalar observable of error action */
        EntityCacheEffects.prototype.handleSaveEntitiesError$ = function (action) {
            var _this = this;
            // Although error may return immediately,
            // ensure observable takes some time,
            // as app likely assumes asynchronous response.
            return function (err) {
                var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
                return rxjs.of(new SaveEntitiesError(error, action)).pipe(operators.delay(_this.responseDelay, _this.scheduler || rxjs.asyncScheduler));
            };
        };
        /** return handler of the ChangeSet result of successful saveEntities() */
        EntityCacheEffects.prototype.handleSaveEntitiesSuccess$ = function (action, entityActionFactory) {
            var _a = action.payload, url = _a.url, correlationId = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
            var options = { correlationId: correlationId, mergeStrategy: mergeStrategy, tag: tag };
            return function (changeSet) {
                // DataService returned a ChangeSet with possible updates to the saved entities
                if (changeSet) {
                    return rxjs.of(new SaveEntitiesSuccess(changeSet, url, options));
                }
                // No ChangeSet = Server probably responded '204 - No Content' because
                // it made no changes to the inserted/updated entities.
                // Respond with success action best on the ChangeSet in the request.
                changeSet = action.payload.changeSet;
                // If pessimistic save, return success action with the original ChangeSet
                if (!action.payload.isOptimistic) {
                    return rxjs.of(new SaveEntitiesSuccess(changeSet, url, options));
                }
                // If optimistic save, avoid cache grinding by just turning off the loading flags
                // for all collections in the original ChangeSet
                var entityNames = changeSet.changes.reduce(function (acc, item) {
                    return acc.indexOf(item.entityName) === -1
                        ? acc.concat(item.entityName)
                        : acc;
                }, []);
                return rxjs.merge(entityNames.map(function (name) {
                    return entityActionFactory.create(name, exports.EntityOp.SET_LOADING, false);
                }));
            };
        };
        tslib_1.__decorate([
            effects.Effect({ dispatch: false }),
            tslib_1.__metadata("design:type", rxjs.Observable)
        ], EntityCacheEffects.prototype, "saveEntitiesCancel$", void 0);
        tslib_1.__decorate([
            effects.Effect(),
            tslib_1.__metadata("design:type", rxjs.Observable)
        ], EntityCacheEffects.prototype, "saveEntities$", void 0);
        EntityCacheEffects = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(4, core.Optional()),
            tslib_1.__param(4, core.Inject(ENTITY_EFFECTS_SCHEDULER)),
            tslib_1.__metadata("design:paramtypes", [effects.Actions,
                EntityCacheDataService,
                EntityActionFactory,
                Logger, Object])
        ], EntityCacheEffects);
        return EntityCacheEffects;
    }());

    var persistOps = [
        exports.EntityOp.QUERY_ALL,
        exports.EntityOp.QUERY_LOAD,
        exports.EntityOp.QUERY_BY_KEY,
        exports.EntityOp.QUERY_MANY,
        exports.EntityOp.SAVE_ADD_ONE,
        exports.EntityOp.SAVE_DELETE_ONE,
        exports.EntityOp.SAVE_UPDATE_ONE,
        exports.EntityOp.SAVE_UPSERT_ONE,
    ];
    var EntityEffects = /** @class */ (function () {
        function EntityEffects(actions, dataService, entityActionFactory, resultHandler, 
        /**
         * Injecting an optional Scheduler that will be undefined
         * in normal application usage, but its injected here so that you can mock out
         * during testing using the RxJS TestScheduler for simulating passages of time.
         */
        scheduler) {
            var _this = this;
            this.actions = actions;
            this.dataService = dataService;
            this.entityActionFactory = entityActionFactory;
            this.resultHandler = resultHandler;
            this.scheduler = scheduler;
            // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
            /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
            this.responseDelay = 10;
            /**
             * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
             */
            this.cancel$ = this.actions.pipe(ofEntityOp(exports.EntityOp.CANCEL_PERSIST), operators.map(function (action) { return action.payload.correlationId; }), operators.filter(function (id) { return id != null; }));
            // `mergeMap` allows for concurrent requests which may return in any order
            this.persist$ = this.actions.pipe(ofEntityOp(persistOps), operators.mergeMap(function (action) { return _this.persist(action); }));
        }
        /**
         * Perform the requested persistence operation and return a scalar Observable<Action>
         * that the effect should dispatch to the store after the server responds.
         * @param action A persistence operation EntityAction
         */
        EntityEffects.prototype.persist = function (action) {
            var _this = this;
            if (action.payload.skip) {
                // Should not persist. Pretend it succeeded.
                return this.handleSkipSuccess$(action);
            }
            if (action.payload.error) {
                return this.handleError$(action)(action.payload.error);
            }
            try {
                // Cancellation: returns Observable of CANCELED_PERSIST for a persistence EntityAction
                // whose correlationId matches cancellation correlationId
                var c = this.cancel$.pipe(operators.filter(function (id) { return action.payload.correlationId === id; }), operators.map(function (id) {
                    return _this.entityActionFactory.createFromAction(action, {
                        entityOp: exports.EntityOp.CANCELED_PERSIST,
                    });
                }));
                // Data: entity collection DataService result as a successful persistence EntityAction
                var d = this.callDataService(action).pipe(operators.map(this.resultHandler.handleSuccess(action)), operators.catchError(this.handleError$(action)));
                // Emit which ever gets there first; the other observable is terminated.
                return rxjs.race(c, d);
            }
            catch (err) {
                return this.handleError$(action)(err);
            }
        };
        EntityEffects.prototype.callDataService = function (action) {
            var _a = action.payload, entityName = _a.entityName, entityOp = _a.entityOp, data = _a.data;
            var service = this.dataService.getService(entityName);
            switch (entityOp) {
                case exports.EntityOp.QUERY_ALL:
                case exports.EntityOp.QUERY_LOAD:
                    return service.getAll();
                case exports.EntityOp.QUERY_BY_KEY:
                    return service.getById(data);
                case exports.EntityOp.QUERY_MANY:
                    return service.getWithQuery(data);
                case exports.EntityOp.SAVE_ADD_ONE:
                    return service.add(data);
                case exports.EntityOp.SAVE_DELETE_ONE:
                    return service.delete(data);
                case exports.EntityOp.SAVE_UPDATE_ONE:
                    var _b = data, id_1 = _b.id, changes_1 = _b.changes; // data must be Update<T>
                    return service.update(data).pipe(operators.map(function (updatedEntity) {
                        // Return an Update<T> with updated entity data.
                        // If server returned entity data, merge with the changes that were sent
                        // and set the 'changed' flag to true.
                        // If server did not return entity data,
                        // assume it made no additional changes of its own, return the original changes,
                        // and set the `changed` flag to `false`.
                        var hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                        var responseData = hasData
                            ? { id: id_1, changes: tslib_1.__assign({}, changes_1, updatedEntity), changed: true }
                            : { id: id_1, changes: changes_1, changed: false };
                        return responseData;
                    }));
                case exports.EntityOp.SAVE_UPSERT_ONE:
                    return service.upsert(data).pipe(operators.map(function (upsertedEntity) {
                        var hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                        return hasData ? upsertedEntity : data; // ensure a returned entity value.
                    }));
                default:
                    throw new Error("Persistence action \"" + entityOp + "\" is not implemented.");
            }
        };
        /**
         * Handle error result of persistence operation on an EntityAction,
         * returning a scalar observable of error action
         */
        EntityEffects.prototype.handleError$ = function (action) {
            var _this = this;
            // Although error may return immediately,
            // ensure observable takes some time,
            // as app likely assumes asynchronous response.
            return function (error) {
                return rxjs.of(_this.resultHandler.handleError(action)(error)).pipe(operators.delay(_this.responseDelay, _this.scheduler || rxjs.asyncScheduler));
            };
        };
        /**
         * Because EntityAction.payload.skip is true, skip the persistence step and
         * return a scalar success action that looks like the operation succeeded.
         */
        EntityEffects.prototype.handleSkipSuccess$ = function (originalAction) {
            var successOp = makeSuccessOp(originalAction.payload.entityOp);
            var successAction = this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
            });
            // Although returns immediately,
            // ensure observable takes one tick (by using a promise),
            // as app likely assumes asynchronous response.
            return rxjs.of(successAction).pipe(operators.delay(this.responseDelay, this.scheduler || rxjs.asyncScheduler));
        };
        tslib_1.__decorate([
            effects.Effect({ dispatch: false }),
            tslib_1.__metadata("design:type", rxjs.Observable)
        ], EntityEffects.prototype, "cancel$", void 0);
        tslib_1.__decorate([
            effects.Effect(),
            tslib_1.__metadata("design:type", rxjs.Observable)
        ], EntityEffects.prototype, "persist$", void 0);
        EntityEffects = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(4, core.Optional()),
            tslib_1.__param(4, core.Inject(ENTITY_EFFECTS_SCHEDULER)),
            tslib_1.__metadata("design:paramtypes", [effects.Actions,
                EntityDataService,
                EntityActionFactory,
                PersistenceResultHandler, Object])
        ], EntityEffects);
        return EntityEffects;
    }());

    /**
     * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
     * anywhere in any of the given props of an entity.
     * If pattern is a string, spaces are significant and ignores case.
     */
    function PropsFilterFnFactory(props) {
        if (props === void 0) { props = []; }
        if (props.length === 0) {
            // No properties -> nothing could match -> return unfiltered
            return function (entities, pattern) { return entities; };
        }
        return function (entities, pattern) {
            if (!entities) {
                return [];
            }
            var regExp = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
            if (regExp) {
                var predicate = function (e) { return props.some(function (prop) { return regExp.test(e[prop]); }); };
                return entities.filter(predicate);
            }
            return entities;
        };
    }

    // tslint:disable:member-ordering
    /**
     * Base class for a concrete EntityCollectionService<T>.
     * Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.
     * @param EntityCollectionServiceElements The ingredients for this service
     * as a source of supporting services for creating an EntityCollectionService<T> instance.
     */
    var EntityCollectionServiceBase = /** @class */ (function () {
        function EntityCollectionServiceBase(
        /** Name of the entity type of this collection service */
        entityName, 
        /** Creates the core elements of the EntityCollectionService for this entity type */
        serviceElementsFactory) {
            this.entityName = entityName;
            entityName = entityName.trim();
            var _a = serviceElementsFactory.create(entityName), dispatcher = _a.dispatcher, selectors = _a.selectors, selectors$ = _a.selectors$;
            this.entityName = entityName;
            this.dispatcher = dispatcher;
            this.guard = dispatcher.guard;
            this.selectId = dispatcher.selectId;
            this.toUpdate = dispatcher.toUpdate;
            this.selectors = selectors;
            this.selectors$ = selectors$;
            this.collection$ = selectors$.collection$;
            this.count$ = selectors$.count$;
            this.entities$ = selectors$.entities$;
            this.entityActions$ = selectors$.entityActions$;
            this.entityMap$ = selectors$.entityMap$;
            this.errors$ = selectors$.errors$;
            this.filter$ = selectors$.filter$;
            this.filteredEntities$ = selectors$.filteredEntities$;
            this.keys$ = selectors$.keys$;
            this.loaded$ = selectors$.loaded$;
            this.loading$ = selectors$.loading$;
            this.changeState$ = selectors$.changeState$;
        }
        /**
         * Create an {EntityAction} for this entity type.
         * @param op {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the EntityAction
         */
        EntityCollectionServiceBase.prototype.createEntityAction = function (op, data, options) {
            return this.dispatcher.createEntityAction(op, data, options);
        };
        /**
         * Create an {EntityAction} for this entity type and
         * dispatch it immediately to the store.
         * @param op {EntityOp} the entity operation
         * @param [data] the action data
         * @param [options] additional options
         * @returns the dispatched EntityAction
         */
        EntityCollectionServiceBase.prototype.createAndDispatch = function (op, data, options) {
            return this.dispatcher.createAndDispatch(op, data, options);
        };
        /**
         * Dispatch an action of any type to the ngrx store.
         * @param action the Action
         * @returns the dispatched Action
         */
        EntityCollectionServiceBase.prototype.dispatch = function (action) {
            return this.dispatcher.dispatch(action);
        };
        Object.defineProperty(EntityCollectionServiceBase.prototype, "store", {
            /** The NgRx Store for the {EntityCache} */
            get: function () {
                return this.dispatcher.store;
            },
            enumerable: true,
            configurable: true
        });
        // region Dispatch commands
        /**
         * Dispatch action to save a new entity to remote storage.
         * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @param [options] options that influence save and merge behavior
         * @returns Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityCollectionServiceBase.prototype.add = function (entity, options) {
            return this.dispatcher.add(entity, options);
        };
        /**
         * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
         * @param correlationId The correlation id for the corresponding EntityAction
         * @param [reason] explains why canceled and by whom.
         * @param [options] options such as the tag
         */
        EntityCollectionServiceBase.prototype.cancel = function (correlationId, reason, options) {
            this.dispatcher.cancel(correlationId, reason, options);
        };
        EntityCollectionServiceBase.prototype.delete = function (arg, options) {
            return this.dispatcher.delete(arg, options);
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * merge the queried entities into the cached collection.
         * @param [options] options that influence merge behavior
         * @returns Observable of the collection
         * after server reports successful query or the query error.
         * @see load()
         */
        EntityCollectionServiceBase.prototype.getAll = function (options) {
            return this.dispatcher.getAll(options);
        };
        /**
         * Dispatch action to query remote storage for the entity with this primary key.
         * If the server returns an entity,
         * merge it into the cached collection.
         * @param key The primary key of the entity to get.
         * @param [options] options that influence merge behavior
         * @returns Observable of the queried entity that is in the collection
         * after server reports success or the query error.
         */
        EntityCollectionServiceBase.prototype.getByKey = function (key, options) {
            return this.dispatcher.getByKey(key, options);
        };
        /**
         * Dispatch action to query remote storage for the entities that satisfy a query expressed
         * with either a query parameter map or an HTTP URL query string,
         * and merge the results into the cached collection.
         * @param queryParams the query in a form understood by the server
         * @param [options] options that influence merge behavior
         * @returns Observable of the queried entities
         * after server reports successful query or the query error.
         */
        EntityCollectionServiceBase.prototype.getWithQuery = function (queryParams, options) {
            return this.dispatcher.getWithQuery(queryParams, options);
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * completely replace the cached collection with the queried entities.
         * @param [options] options that influence load behavior
         * @returns Observable of the collection
         * after server reports successful query or the query error.
         * @see getAll
         */
        EntityCollectionServiceBase.prototype.load = function (options) {
            return this.dispatcher.load(options);
        };
        /**
         * Dispatch action to save the updated entity (or partial entity) in remote storage.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param entity update entity, which might be a partial of T but must at least have its key.
         * @param [options] options that influence save and merge behavior
         * @returns Observable of the updated entity
         * after server reports successful save or the save error.
         */
        EntityCollectionServiceBase.prototype.update = function (entity, options) {
            return this.dispatcher.update(entity, options);
        };
        /**
         * Dispatch action to save a new or existing entity to remote storage.
         * Call only if the server supports upsert.
         * @param entity entity to add or upsert.
         * It may omit its key if an add, and is pessimistic, and the server creates the key;
         * must have a key if optimistic save.
         * @param [options] options that influence save and merge behavior
         * @returns Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityCollectionServiceBase.prototype.upsert = function (entity, options) {
            return this.dispatcher.upsert(entity, options);
        };
        /*** Cache-only operations that do not update remote storage ***/
        /**
         * Replace all entities in the cached collection.
         * Does not save to remote storage.
         */
        EntityCollectionServiceBase.prototype.addAllToCache = function (entities) {
            this.dispatcher.addAllToCache(entities);
        };
        /**
         * Add a new entity directly to the cache.
         * Does not save to remote storage.
         * Ignored if an entity with the same primary key is already in cache.
         */
        EntityCollectionServiceBase.prototype.addOneToCache = function (entity) {
            this.dispatcher.addOneToCache(entity);
        };
        /**
         * Add multiple new entities directly to the cache.
         * Does not save to remote storage.
         * Entities with primary keys already in cache are ignored.
         */
        EntityCollectionServiceBase.prototype.addManyToCache = function (entities) {
            this.dispatcher.addManyToCache(entities);
        };
        /** Clear the cached entity collection */
        EntityCollectionServiceBase.prototype.clearCache = function () {
            this.dispatcher.clearCache();
        };
        EntityCollectionServiceBase.prototype.removeOneFromCache = function (arg) {
            this.dispatcher.removeOneFromCache(arg);
        };
        EntityCollectionServiceBase.prototype.removeManyFromCache = function (args) {
            this.dispatcher.removeManyFromCache(args);
        };
        /**
         * Update a cached entity directly.
         * Does not update that entity in remote storage.
         * Ignored if an entity with matching primary key is not in cache.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         */
        EntityCollectionServiceBase.prototype.updateOneInCache = function (entity) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            this.dispatcher.updateOneInCache(entity);
        };
        /**
         * Update multiple cached entities directly.
         * Does not update these entities in remote storage.
         * Entities whose primary keys are not in cache are ignored.
         * Update entities may be partial but must at least have their keys.
         * such partial entities patch their cached counterparts.
         */
        EntityCollectionServiceBase.prototype.updateManyInCache = function (entities) {
            this.dispatcher.updateManyInCache(entities);
        };
        /**
         * Add or update a new entity directly to the cache.
         * Does not save to remote storage.
         * Upsert entity might be a partial of T but must at least have its key.
         * Pass the Update<T> structure as the payload
         */
        EntityCollectionServiceBase.prototype.upsertOneInCache = function (entity) {
            this.dispatcher.upsertOneInCache(entity);
        };
        /**
         * Add or update multiple cached entities directly.
         * Does not save to remote storage.
         */
        EntityCollectionServiceBase.prototype.upsertManyInCache = function (entities) {
            this.dispatcher.upsertManyInCache(entities);
        };
        /**
         * Set the pattern that the collection's filter applies
         * when using the `filteredEntities` selector.
         */
        EntityCollectionServiceBase.prototype.setFilter = function (pattern) {
            this.dispatcher.setFilter(pattern);
        };
        /** Set the loaded flag */
        EntityCollectionServiceBase.prototype.setLoaded = function (isLoaded) {
            this.dispatcher.setLoaded(!!isLoaded);
        };
        /** Set the loading flag */
        EntityCollectionServiceBase.prototype.setLoading = function (isLoading) {
            this.dispatcher.setLoading(!!isLoading);
        };
        return EntityCollectionServiceBase;
    }());

    var EntityCollectionCreator = /** @class */ (function () {
        function EntityCollectionCreator(entityDefinitionService) {
            this.entityDefinitionService = entityDefinitionService;
        }
        /**
         * Create the default collection for an entity type.
         * @param entityName {string} entity type name
         */
        EntityCollectionCreator.prototype.create = function (entityName) {
            var def = this.entityDefinitionService &&
                this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
            var initialState = def && def.initialState;
            return (initialState || createEmptyEntityCollection(entityName));
        };
        EntityCollectionCreator = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(0, core.Optional()),
            tslib_1.__metadata("design:paramtypes", [EntityDefinitionService])
        ], EntityCollectionCreator);
        return EntityCollectionCreator;
    }());
    function createEmptyEntityCollection(entityName) {
        return {
            entityName: entityName,
            ids: [],
            entities: {},
            filter: undefined,
            loaded: false,
            loading: false,
            changeState: {},
        };
    }

    /** Creates EntitySelector functions for entity collections. */
    var EntitySelectorsFactory = /** @class */ (function () {
        function EntitySelectorsFactory(entityCollectionCreator, selectEntityCache) {
            this.entityCollectionCreator =
                entityCollectionCreator || new EntityCollectionCreator();
            this.selectEntityCache =
                selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
        }
        /**
         * Create the NgRx selector from the store root to the named collection,
         * e.g. from Object to Heroes.
         * @param entityName the name of the collection
         */
        EntitySelectorsFactory.prototype.createCollectionSelector = function (entityName) {
            var _this = this;
            var getCollection = function (cache) {
                if (cache === void 0) { cache = {}; }
                return ((cache[entityName] ||
                    _this.entityCollectionCreator.create(entityName)));
            };
            return store.createSelector(this.selectEntityCache, getCollection);
        };
        // createCollectionSelectors implementation
        EntitySelectorsFactory.prototype.createCollectionSelectors = function (metadataOrName) {
            var metadata = typeof metadataOrName === 'string'
                ? { entityName: metadataOrName }
                : metadataOrName;
            var selectKeys = function (c) { return c.ids; };
            var selectEntityMap = function (c) { return c.entities; };
            var selectEntities = store.createSelector(selectKeys, selectEntityMap, function (keys, entities) {
                return keys.map(function (key) { return entities[key]; });
            });
            var selectCount = store.createSelector(selectKeys, function (keys) { return keys.length; });
            // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
            var selectFilter = function (c) { return c.filter; };
            var filterFn = metadata.filterFn;
            var selectFilteredEntities = filterFn
                ? store.createSelector(selectEntities, selectFilter, function (entities, pattern) { return filterFn(entities, pattern); })
                : selectEntities;
            var selectLoaded = function (c) { return c.loaded; };
            var selectLoading = function (c) { return c.loading; };
            var selectChangeState = function (c) { return c.changeState; };
            // Create collection selectors for each `additionalCollectionState` property.
            // These all extend from `selectCollection`
            var extra = metadata.additionalCollectionState || {};
            var extraSelectors = {};
            Object.keys(extra).forEach(function (k) {
                extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = function (c) { return c[k]; };
            });
            return tslib_1.__assign({ selectCount: selectCount,
                selectEntities: selectEntities,
                selectEntityMap: selectEntityMap,
                selectFilter: selectFilter,
                selectFilteredEntities: selectFilteredEntities,
                selectKeys: selectKeys,
                selectLoaded: selectLoaded,
                selectLoading: selectLoading,
                selectChangeState: selectChangeState }, extraSelectors);
        };
        // createCollectionSelectors implementation
        EntitySelectorsFactory.prototype.create = function (metadataOrName) {
            var metadata = typeof metadataOrName === 'string'
                ? { entityName: metadataOrName }
                : metadataOrName;
            var entityName = metadata.entityName;
            var selectCollection = this.createCollectionSelector(entityName);
            var collectionSelectors = this.createCollectionSelectors(metadata);
            var entitySelectors = {};
            Object.keys(collectionSelectors).forEach(function (k) {
                entitySelectors[k] = store.createSelector(selectCollection, collectionSelectors[k]);
            });
            return tslib_1.__assign({ entityName: entityName,
                selectCollection: selectCollection, selectEntityCache: this.selectEntityCache }, entitySelectors);
        };
        EntitySelectorsFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(0, core.Optional()),
            tslib_1.__param(1, core.Optional()),
            tslib_1.__param(1, core.Inject(ENTITY_CACHE_SELECTOR_TOKEN)),
            tslib_1.__metadata("design:paramtypes", [EntityCollectionCreator, Function])
        ], EntitySelectorsFactory);
        return EntitySelectorsFactory;
    }());

    /** Creates observable EntitySelectors$ for entity collections. */
    var EntitySelectors$Factory = /** @class */ (function () {
        function EntitySelectors$Factory(store, actions, selectEntityCache) {
            this.store = store;
            this.actions = actions;
            this.selectEntityCache = selectEntityCache;
            // This service applies to the cache in ngrx/store named `cacheName`
            this.entityCache$ = this.store.select(this.selectEntityCache);
            this.entityActionErrors$ = actions.pipe(operators.filter(function (ea) {
                return ea.payload &&
                    ea.payload.entityOp &&
                    ea.payload.entityOp.endsWith(OP_ERROR);
            }), operators.shareReplay(1));
        }
        /**
         * Creates an entity collection's selectors$ observables for this factory's store.
         * `selectors$` are observable selectors of the cached entity collection.
         * @param entityName - is also the name of the collection.
         * @param selectors - selector functions for this collection.
         **/
        EntitySelectors$Factory.prototype.create = function (entityName, selectors) {
            var _this = this;
            var selectors$ = {
                entityName: entityName,
            };
            Object.keys(selectors).forEach(function (name) {
                if (name.startsWith('select')) {
                    // strip 'select' prefix from the selector fn name and append `$`
                    // Ex: 'selectEntities' => 'entities$'
                    var name$ = name[6].toLowerCase() + name.substr(7) + '$';
                    selectors$[name$] = _this.store.select(selectors[name]);
                }
            });
            selectors$.entityActions$ = this.actions.pipe(ofEntityType(entityName));
            selectors$.errors$ = this.entityActionErrors$.pipe(ofEntityType(entityName));
            return selectors$;
        };
        EntitySelectors$Factory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(2, core.Inject(ENTITY_CACHE_SELECTOR_TOKEN)),
            tslib_1.__metadata("design:paramtypes", [store.Store,
                effects.Actions, Function])
        ], EntitySelectors$Factory);
        return EntitySelectors$Factory;
    }());

    /** Creates the core elements of the EntityCollectionService for an entity type. */
    var EntityCollectionServiceElementsFactory = /** @class */ (function () {
        function EntityCollectionServiceElementsFactory(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
            this.entityDispatcherFactory = entityDispatcherFactory;
            this.entityDefinitionService = entityDefinitionService;
            this.entitySelectorsFactory = entitySelectorsFactory;
            this.entitySelectors$Factory = entitySelectors$Factory;
        }
        /**
         * Get the ingredients for making an EntityCollectionService for this entity type
         * @param entityName - name of the entity type
         */
        EntityCollectionServiceElementsFactory.prototype.create = function (entityName) {
            entityName = entityName.trim();
            var definition = this.entityDefinitionService.getDefinition(entityName);
            var dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
            var selectors = this.entitySelectorsFactory.create(definition.metadata);
            var selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
            return {
                dispatcher: dispatcher,
                entityName: entityName,
                selectors: selectors,
                selectors$: selectors$,
            };
        };
        EntityCollectionServiceElementsFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityDispatcherFactory,
                EntityDefinitionService,
                EntitySelectorsFactory,
                EntitySelectors$Factory])
        ], EntityCollectionServiceElementsFactory);
        return EntityCollectionServiceElementsFactory;
    }());

    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    var EntityCollectionServiceFactory = /** @class */ (function () {
        function EntityCollectionServiceFactory(
        /** Creates the core elements of the EntityCollectionService for an entity type. */
        entityCollectionServiceElementsFactory) {
            this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
        }
        /**
         * Create an EntityCollectionService for an entity type
         * @param entityName - name of the entity type
         */
        EntityCollectionServiceFactory.prototype.create = function (entityName) {
            return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
        };
        EntityCollectionServiceFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityCollectionServiceElementsFactory])
        ], EntityCollectionServiceFactory);
        return EntityCollectionServiceFactory;
    }());

    /** Core ingredients of an EntityServices class */
    var EntityServicesElements = /** @class */ (function () {
        function EntityServicesElements(
        /**
         * Creates EntityCollectionService instances for
         * a cached collection of T entities in the ngrx store.
         */
        entityCollectionServiceFactory, 
        /** Creates EntityDispatchers for entity collections */
        entityDispatcherFactory, 
        /** Creates observable EntitySelectors$ for entity collections. */
        entitySelectors$Factory, 
        /** The ngrx store, scoped to the EntityCache */
        store) {
            this.entityCollectionServiceFactory = entityCollectionServiceFactory;
            this.store = store;
            this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
            this.entityCache$ = entitySelectors$Factory.entityCache$;
            this.reducedActions$ = entityDispatcherFactory.reducedActions$;
        }
        EntityServicesElements = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityCollectionServiceFactory,
                EntityDispatcherFactory,
                EntitySelectors$Factory,
                store.Store])
        ], EntityServicesElements);
        return EntityServicesElements;
    }());

    // tslint:disable:member-ordering
    /**
     * Base/default class of a central registry of EntityCollectionServices for all entity types.
     * Create your own subclass to add app-specific members for an improved developer experience.
     *
     * @example
     * export class EntityServices extends EntityServicesBase {
     *   constructor(entityServicesElements: EntityServicesElements) {
     *     super(entityServicesElements);
     *   }
     *   // Extend with well-known, app entity collection services
     *   // Convenience property to return a typed custom entity collection service
     *   get companyService() {
     *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
     *   }
     *   // Convenience dispatch methods
     *   clearCompany(companyId: string) {
     *     this.dispatch(new ClearCompanyAction(companyId));
     *   }
     * }
     */
    var EntityServicesBase = /** @class */ (function () {
        // Dear ngrx-data developer: think hard before changing the constructor.
        // Doing so will break apps that derive from this base class,
        // and many apps will derive from this class.
        //
        // Do not give this constructor an implementation.
        // Doing so makes it hard to mock classes that derive from this class.
        // Use getter properties instead. For example, see entityCache$
        function EntityServicesBase(entityServicesElements) {
            this.entityServicesElements = entityServicesElements;
            /** Registry of EntityCollectionService instances */
            this.EntityCollectionServices = {};
        }
        Object.defineProperty(EntityServicesBase.prototype, "entityActionErrors$", {
            // #region EntityServicesElement-based properties
            /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
            get: function () {
                return this.entityServicesElements.entityActionErrors$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "entityCache$", {
            /** Observable of the entire entity cache */
            get: function () {
                return this.entityServicesElements.entityCache$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "entityCollectionServiceFactory", {
            /** Factory to create a default instance of an EntityCollectionService */
            get: function () {
                return this.entityServicesElements.entityCollectionServiceFactory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "reducedActions$", {
            /**
             * Actions scanned by the store after it processed them with reducers.
             * A replay observable of the most recent action reduced by the store.
             */
            get: function () {
                return this.entityServicesElements.reducedActions$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "store", {
            /** The ngrx store, scoped to the EntityCache */
            get: function () {
                return this.entityServicesElements.store;
            },
            enumerable: true,
            configurable: true
        });
        // #endregion EntityServicesElement-based properties
        /** Dispatch any action to the store */
        EntityServicesBase.prototype.dispatch = function (action) {
            this.store.dispatch(action);
        };
        /**
         * Create a new default instance of an EntityCollectionService.
         * Prefer getEntityCollectionService() unless you really want a new default instance.
         * This one will NOT be registered with EntityServices!
         * @param entityName {string} Name of the entity type of the service
         */
        EntityServicesBase.prototype.createEntityCollectionService = function (entityName) {
            return this.entityCollectionServiceFactory.create(entityName);
        };
        /** Get (or create) the singleton instance of an EntityCollectionService
         * @param entityName {string} Name of the entity type of the service
         */
        EntityServicesBase.prototype.getEntityCollectionService = function (entityName) {
            var service = this.EntityCollectionServices[entityName];
            if (!service) {
                service = this.createEntityCollectionService(entityName);
                this.EntityCollectionServices[entityName] = service;
            }
            return service;
        };
        /** Register an EntityCollectionService under its entity type name.
         * Will replace a pre-existing service for that type.
         * @param service {EntityCollectionService} The entity service
         * @param serviceName {string} optional service name to use instead of the service's entityName
         */
        EntityServicesBase.prototype.registerEntityCollectionService = function (service, serviceName) {
            this.EntityCollectionServices[serviceName || service.entityName] = service;
        };
        /**
         * Register entity services for several entity types at once.
         * Will replace a pre-existing service for that type.
         * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
         * EntityCollectionServices to register, either as a map or an array
         */
        EntityServicesBase.prototype.registerEntityCollectionServices = function (entityCollectionServices) {
            var _this = this;
            if (Array.isArray(entityCollectionServices)) {
                entityCollectionServices.forEach(function (service) {
                    return _this.registerEntityCollectionService(service);
                });
            }
            else {
                Object.keys(entityCollectionServices || {}).forEach(function (serviceName) {
                    _this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
                });
            }
        };
        EntityServicesBase = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityServicesElements])
        ], EntityServicesBase);
        return EntityServicesBase;
    }());

    // tslint:disable:member-ordering
    /**
     * Class-Interface for EntityCache and EntityCollection services.
     * Serves as an Angular provider token for this service class.
     * Includes a registry of EntityCollectionServices for all entity types.
     * Creates a new default EntityCollectionService for any entity type not in the registry.
     * Optionally register specialized EntityCollectionServices for individual types
     */
    var EntityServices = /** @class */ (function () {
        function EntityServices() {
        }
        return EntityServices;
    }());

    /** Types of change in a ChangeState instance */
    (function (ChangeType) {
        /** The entity has not changed from its last known server state. */
        ChangeType[ChangeType["Unchanged"] = 0] = "Unchanged";
        /** The entity was added to the collection */
        ChangeType[ChangeType["Added"] = 1] = "Added";
        /** The entity is scheduled for delete and was removed from the collection */
        ChangeType[ChangeType["Deleted"] = 2] = "Deleted";
        /** The entity in the collection was updated */
        ChangeType[ChangeType["Updated"] = 3] = "Updated";
    })(exports.ChangeType || (exports.ChangeType = {}));

    /**
     * The default implementation of EntityChangeTracker with
     * methods for tracking, committing, and reverting/undoing unsaved entity changes.
     * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
     * See EntityChangeTracker docs.
     */
    var EntityChangeTrackerBase = /** @class */ (function () {
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
        EntityChangeTrackerBase.prototype.commitAll = function (collection) {
            return Object.keys(collection.changeState).length === 0
                ? collection
                : tslib_1.__assign({}, collection, { changeState: {} });
        };
        /**
         * Commit changes for the given entities as when they have been refreshed from the server.
         * Harmless when there are no entity changes to commit.
         * @param entityOrIdList The entities to clear tracking or their ids.
         * @param collection The entity collection
         */
        EntityChangeTrackerBase.prototype.commitMany = function (entityOrIdList, collection) {
            var _this = this;
            if (entityOrIdList == null || entityOrIdList.length === 0) {
                return collection; // nothing to commit
            }
            var didMutate = false;
            var changeState = entityOrIdList.reduce(function (chgState, entityOrId) {
                var id = typeof entityOrId === 'object'
                    ? _this.selectId(entityOrId)
                    : entityOrId;
                if (chgState[id]) {
                    if (!didMutate) {
                        chgState = tslib_1.__assign({}, chgState);
                        didMutate = true;
                    }
                    delete chgState[id];
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
        };
        /**
         * Commit changes for the given entity as when it have been refreshed from the server.
         * Harmless when no entity changes to commit.
         * @param entityOrId The entity to clear tracking or its id.
         * @param collection The entity collection
         */
        EntityChangeTrackerBase.prototype.commitOne = function (entityOrId, collection) {
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
        EntityChangeTrackerBase.prototype.mergeQueryResults = function (entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, exports.MergeStrategy.PreserveChanges, mergeStrategy);
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
        EntityChangeTrackerBase.prototype.mergeSaveAdds = function (entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, exports.MergeStrategy.OverwriteChanges, mergeStrategy);
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
        EntityChangeTrackerBase.prototype.mergeSaveDeletes = function (keys, collection, mergeStrategy) {
            mergeStrategy =
                mergeStrategy == null ? exports.MergeStrategy.OverwriteChanges : mergeStrategy;
            // same logic for all non-ignore merge strategies: always clear (commit) the changes
            var deleteIds = keys; // make TypeScript happy
            collection =
                mergeStrategy === exports.MergeStrategy.IgnoreChanges
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
        EntityChangeTrackerBase.prototype.mergeSaveUpdates = function (updateResponseData, collection, mergeStrategy, skipUnchanged) {
            var _this = this;
            if (skipUnchanged === void 0) { skipUnchanged = false; }
            if (updateResponseData == null || updateResponseData.length === 0) {
                return collection; // nothing to merge.
            }
            var didMutate = false;
            var changeState = collection.changeState;
            mergeStrategy =
                mergeStrategy == null ? exports.MergeStrategy.OverwriteChanges : mergeStrategy;
            var updates;
            switch (mergeStrategy) {
                case exports.MergeStrategy.IgnoreChanges:
                    updates = filterChanged(updateResponseData);
                    return this.adapter.updateMany(updates, collection);
                case exports.MergeStrategy.OverwriteChanges:
                    changeState = updateResponseData.reduce(function (chgState, update) {
                        var oldId = update.id;
                        var change = chgState[oldId];
                        if (change) {
                            if (!didMutate) {
                                chgState = tslib_1.__assign({}, chgState);
                                didMutate = true;
                            }
                            delete chgState[oldId];
                        }
                        return chgState;
                    }, collection.changeState);
                    collection = didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
                    updates = filterChanged(updateResponseData);
                    return this.adapter.updateMany(updates, collection);
                case exports.MergeStrategy.PreserveChanges: {
                    var updateableEntities_1 = [];
                    changeState = updateResponseData.reduce(function (chgState, update) {
                        var oldId = update.id;
                        var change = chgState[oldId];
                        if (change) {
                            // Tracking a change so update original value but not the current value
                            if (!didMutate) {
                                chgState = tslib_1.__assign({}, chgState);
                                didMutate = true;
                            }
                            var newId = _this.selectId(update.changes);
                            var oldChangeState = change;
                            // If the server changed the id, register the new "originalValue" under the new id
                            // and remove the change tracked under the old id.
                            if (newId !== oldId) {
                                delete chgState[oldId];
                            }
                            var newOrigValue = tslib_1.__assign({}, oldChangeState.originalValue, update.changes);
                            chgState[newId] = tslib_1.__assign({}, oldChangeState, { originalValue: newOrigValue });
                        }
                        else {
                            updateableEntities_1.push(update);
                        }
                        return chgState;
                    }, collection.changeState);
                    collection = didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
                    updates = filterChanged(updateableEntities_1);
                    return this.adapter.updateMany(updates, collection);
                }
            }
            /**
             * Conditionally keep only those updates that have additional server changes.
             * (e.g., for optimistic saves because they updates are already in the current collection)
             * Strip off the `changed` property.
             * @responseData Entity response data from server.
             * May be an UpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
             * @returns Update<T> (without the changed flag)
             */
            function filterChanged(responseData) {
                if (skipUnchanged === true) {
                    // keep only those updates that the server changed (knowable if is UpdateResponseData<T>)
                    responseData = responseData.filter(function (r) { return r.changed === true; });
                }
                // Strip unchanged property from responseData, leaving just the pure Update<T>
                // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
                return responseData.map(function (r) { return ({ id: r.id, changes: r.changes }); });
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
        EntityChangeTrackerBase.prototype.mergeSaveUpserts = function (entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, exports.MergeStrategy.OverwriteChanges, mergeStrategy);
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
        EntityChangeTrackerBase.prototype.mergeServerUpserts = function (entities, collection, defaultMergeStrategy, mergeStrategy) {
            var _this = this;
            if (entities == null || entities.length === 0) {
                return collection; // nothing to merge.
            }
            var didMutate = false;
            var changeState = collection.changeState;
            mergeStrategy =
                mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
            switch (mergeStrategy) {
                case exports.MergeStrategy.IgnoreChanges:
                    return this.adapter.upsertMany(entities, collection);
                case exports.MergeStrategy.OverwriteChanges:
                    collection = this.adapter.upsertMany(entities, collection);
                    changeState = entities.reduce(function (chgState, entity) {
                        var id = _this.selectId(entity);
                        var change = chgState[id];
                        if (change) {
                            if (!didMutate) {
                                chgState = tslib_1.__assign({}, chgState);
                                didMutate = true;
                            }
                            delete chgState[id];
                        }
                        return chgState;
                    }, collection.changeState);
                    return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
                case exports.MergeStrategy.PreserveChanges: {
                    var upsertEntities_1 = [];
                    changeState = entities.reduce(function (chgState, entity) {
                        var id = _this.selectId(entity);
                        var change = chgState[id];
                        if (change) {
                            if (!didMutate) {
                                chgState = tslib_1.__assign({}, chgState);
                                didMutate = true;
                            }
                            change.originalValue = entity;
                        }
                        else {
                            upsertEntities_1.push(entity);
                        }
                        return chgState;
                    }, collection.changeState);
                    collection = this.adapter.upsertMany(upsertEntities_1, collection);
                    return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
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
        EntityChangeTrackerBase.prototype.trackAddMany = function (entities, collection, mergeStrategy) {
            var _this = this;
            if (mergeStrategy === exports.MergeStrategy.IgnoreChanges ||
                entities == null ||
                entities.length === 0) {
                return collection; // nothing to track
            }
            var didMutate = false;
            var changeState = entities.reduce(function (chgState, entity) {
                var id = _this.selectId(entity);
                if (id == null || id === '') {
                    throw new Error(collection.entityName + " entity add requires a key to be tracked");
                }
                var trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = tslib_1.__assign({}, chgState);
                    }
                    chgState[id] = { changeType: exports.ChangeType.Added };
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before adding it to the collection.
         * Does NOT add to the collection (the reducer's job).
         * @param entity The entity to add. It must have an id.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         * If not specified, implementation supplies a default strategy.
         */
        EntityChangeTrackerBase.prototype.trackAddOne = function (entity, collection, mergeStrategy) {
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
        EntityChangeTrackerBase.prototype.trackDeleteMany = function (keys, collection, mergeStrategy) {
            if (mergeStrategy === exports.MergeStrategy.IgnoreChanges ||
                keys == null ||
                keys.length === 0) {
                return collection; // nothing to track
            }
            var didMutate = false;
            var entityMap = collection.entities;
            var changeState = keys.reduce(function (chgState, id) {
                var originalValue = entityMap[id];
                if (originalValue) {
                    var trackedChange = chgState[id];
                    if (trackedChange) {
                        if (trackedChange.changeType === exports.ChangeType.Added) {
                            // Special case: stop tracking an added entity that you delete
                            // The caller must also detect this, remove it immediately from the collection
                            // and skip attempt to delete on the server.
                            cloneChgStateOnce();
                            delete chgState[id];
                        }
                        else if (trackedChange.changeType === exports.ChangeType.Updated) {
                            // Special case: switch change type from Updated to Deleted.
                            cloneChgStateOnce();
                            trackedChange.changeType = exports.ChangeType.Deleted;
                        }
                    }
                    else {
                        // Start tracking this entity
                        cloneChgStateOnce();
                        chgState[id] = { changeType: exports.ChangeType.Deleted, originalValue: originalValue };
                    }
                }
                return chgState;
                function cloneChgStateOnce() {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = tslib_1.__assign({}, chgState);
                    }
                }
            }, collection.changeState);
            return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before it is removed with the intention of deleting it on the server.
         * Does NOT remove from the collection (the reducer's job).
         * @param key The primary key of the entity to delete.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        EntityChangeTrackerBase.prototype.trackDeleteOne = function (key, collection, mergeStrategy) {
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
        EntityChangeTrackerBase.prototype.trackUpdateMany = function (updates, collection, mergeStrategy) {
            if (mergeStrategy === exports.MergeStrategy.IgnoreChanges ||
                updates == null ||
                updates.length === 0) {
                return collection; // nothing to track
            }
            var didMutate = false;
            var entityMap = collection.entities;
            var changeState = updates.reduce(function (chgState, update) {
                var id = update.id, entity = update.changes;
                if (id == null || id === '') {
                    throw new Error(collection.entityName + " entity update requires a key to be tracked");
                }
                var originalValue = entityMap[id];
                // Only track if it is in the collection. Silently ignore if it is not.
                // @ngrx/entity adapter would also silently ignore.
                // Todo: should missing update entity really be reported as an error?
                if (originalValue) {
                    var trackedChange = chgState[id];
                    if (!trackedChange) {
                        if (!didMutate) {
                            didMutate = true;
                            chgState = tslib_1.__assign({}, chgState);
                        }
                        chgState[id] = { changeType: exports.ChangeType.Updated, originalValue: originalValue };
                    }
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before updating it in the collection.
         * Does NOT update the collection (the reducer's job).
         * @param update The entity to update.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        EntityChangeTrackerBase.prototype.trackUpdateOne = function (update, collection, mergeStrategy) {
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
        EntityChangeTrackerBase.prototype.trackUpsertMany = function (entities, collection, mergeStrategy) {
            var _this = this;
            if (mergeStrategy === exports.MergeStrategy.IgnoreChanges ||
                entities == null ||
                entities.length === 0) {
                return collection; // nothing to track
            }
            var didMutate = false;
            var entityMap = collection.entities;
            var changeState = entities.reduce(function (chgState, entity) {
                var id = _this.selectId(entity);
                if (id == null || id === '') {
                    throw new Error(collection.entityName + " entity upsert requires a key to be tracked");
                }
                var trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = tslib_1.__assign({}, chgState);
                    }
                    var originalValue = entityMap[id];
                    chgState[id] =
                        originalValue == null
                            ? { changeType: exports.ChangeType.Added }
                            : { changeType: exports.ChangeType.Updated, originalValue: originalValue };
                }
                return chgState;
            }, collection.changeState);
            return didMutate ? tslib_1.__assign({}, collection, { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before upsert (adding and updating) it to the collection.
         * Does NOT update the collection (the reducer's job).
         * @param entities The entity to add or update. It must be a complete entity with its id.
         * @param collection The entity collection
         * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
         */
        EntityChangeTrackerBase.prototype.trackUpsertOne = function (entity, collection, mergeStrategy) {
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
        EntityChangeTrackerBase.prototype.undoAll = function (collection) {
            var ids = Object.keys(collection.changeState);
            var _a = ids.reduce(function (acc, id) {
                var changeState = acc.chgState[id];
                switch (changeState.changeType) {
                    case exports.ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case exports.ChangeType.Deleted:
                        var removed = changeState.originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case exports.ChangeType.Updated:
                        acc.upsert.push(changeState.originalValue);
                        break;
                }
                return acc;
            }, 
            // entitiesToUndo
            {
                remove: [],
                upsert: [],
                chgState: collection.changeState,
            }), remove = _a.remove, upsert = _a.upsert;
            collection = this.adapter.removeMany(remove, collection);
            collection = this.adapter.upsertMany(upsert, collection);
            return tslib_1.__assign({}, collection, { changeState: {} });
        };
        /**
         * Revert the unsaved changes for the given entities.
         * Harmless when there are no entity changes to undo.
         * @param entityOrIdList The entities to revert or their ids.
         * @param collection The entity collection
         */
        EntityChangeTrackerBase.prototype.undoMany = function (entityOrIdList, collection) {
            var _this = this;
            if (entityOrIdList == null || entityOrIdList.length === 0) {
                return collection; // nothing to undo
            }
            var didMutate = false;
            var _a = entityOrIdList.reduce(function (acc, entityOrId) {
                var chgState = acc.changeState;
                var id = typeof entityOrId === 'object'
                    ? _this.selectId(entityOrId)
                    : entityOrId;
                var change = chgState[id];
                if (change) {
                    if (!didMutate) {
                        chgState = tslib_1.__assign({}, chgState);
                        didMutate = true;
                    }
                    delete chgState[id]; // clear tracking of this entity
                    switch (change.changeType) {
                        case exports.ChangeType.Added:
                            acc.remove.push(id);
                            break;
                        case exports.ChangeType.Deleted:
                            var removed = change.originalValue;
                            if (removed) {
                                acc.upsert.push(removed);
                            }
                            break;
                        case exports.ChangeType.Updated:
                            acc.upsert.push(change.originalValue);
                            break;
                    }
                }
                return acc;
            }, 
            // entitiesToUndo
            {
                remove: [],
                upsert: [],
                changeState: collection.changeState,
            }), changeState = _a.changeState, remove = _a.remove, upsert = _a.upsert;
            collection = this.adapter.removeMany(remove, collection);
            collection = this.adapter.upsertMany(upsert, collection);
            return didMutate ? collection : tslib_1.__assign({}, collection, { changeState: changeState });
        };
        /**
         * Revert the unsaved changes for the given entity.
         * Harmless when there are no entity changes to undo.
         * @param entityOrId The entity to revert or its id.
         * @param collection The entity collection
         */
        EntityChangeTrackerBase.prototype.undoOne = function (entityOrId, collection) {
            return entityOrId == null
                ? collection
                : this.undoMany([entityOrId], collection);
        };
        return EntityChangeTrackerBase;
    }());

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
                _a[exports.EntityOp.CANCEL_PERSIST] = this.cancelPersist.bind(this),
                _a[exports.EntityOp.QUERY_ALL] = this.queryAll.bind(this),
                _a[exports.EntityOp.QUERY_ALL_ERROR] = this.queryAllError.bind(this),
                _a[exports.EntityOp.QUERY_ALL_SUCCESS] = this.queryAllSuccess.bind(this),
                _a[exports.EntityOp.QUERY_BY_KEY] = this.queryByKey.bind(this),
                _a[exports.EntityOp.QUERY_BY_KEY_ERROR] = this.queryByKeyError.bind(this),
                _a[exports.EntityOp.QUERY_BY_KEY_SUCCESS] = this.queryByKeySuccess.bind(this),
                _a[exports.EntityOp.QUERY_LOAD] = this.queryLoad.bind(this),
                _a[exports.EntityOp.QUERY_LOAD_ERROR] = this.queryLoadError.bind(this),
                _a[exports.EntityOp.QUERY_LOAD_SUCCESS] = this.queryLoadSuccess.bind(this),
                _a[exports.EntityOp.QUERY_MANY] = this.queryMany.bind(this),
                _a[exports.EntityOp.QUERY_MANY_ERROR] = this.queryManyError.bind(this),
                _a[exports.EntityOp.QUERY_MANY_SUCCESS] = this.queryManySuccess.bind(this),
                _a[exports.EntityOp.SAVE_ADD_MANY] = this.saveAddMany.bind(this),
                _a[exports.EntityOp.SAVE_ADD_MANY_ERROR] = this.saveAddManyError.bind(this),
                _a[exports.EntityOp.SAVE_ADD_MANY_SUCCESS] = this.saveAddManySuccess.bind(this),
                _a[exports.EntityOp.SAVE_ADD_ONE] = this.saveAddOne.bind(this),
                _a[exports.EntityOp.SAVE_ADD_ONE_ERROR] = this.saveAddOneError.bind(this),
                _a[exports.EntityOp.SAVE_ADD_ONE_SUCCESS] = this.saveAddOneSuccess.bind(this),
                _a[exports.EntityOp.SAVE_DELETE_MANY] = this.saveDeleteMany.bind(this),
                _a[exports.EntityOp.SAVE_DELETE_MANY_ERROR] = this.saveDeleteManyError.bind(this),
                _a[exports.EntityOp.SAVE_DELETE_MANY_SUCCESS] = this.saveDeleteManySuccess.bind(this),
                _a[exports.EntityOp.SAVE_DELETE_ONE] = this.saveDeleteOne.bind(this),
                _a[exports.EntityOp.SAVE_DELETE_ONE_ERROR] = this.saveDeleteOneError.bind(this),
                _a[exports.EntityOp.SAVE_DELETE_ONE_SUCCESS] = this.saveDeleteOneSuccess.bind(this),
                _a[exports.EntityOp.SAVE_UPDATE_MANY] = this.saveUpdateMany.bind(this),
                _a[exports.EntityOp.SAVE_UPDATE_MANY_ERROR] = this.saveUpdateManyError.bind(this),
                _a[exports.EntityOp.SAVE_UPDATE_MANY_SUCCESS] = this.saveUpdateManySuccess.bind(this),
                _a[exports.EntityOp.SAVE_UPDATE_ONE] = this.saveUpdateOne.bind(this),
                _a[exports.EntityOp.SAVE_UPDATE_ONE_ERROR] = this.saveUpdateOneError.bind(this),
                _a[exports.EntityOp.SAVE_UPDATE_ONE_SUCCESS] = this.saveUpdateOneSuccess.bind(this),
                _a[exports.EntityOp.SAVE_UPSERT_MANY] = this.saveUpsertMany.bind(this),
                _a[exports.EntityOp.SAVE_UPSERT_MANY_ERROR] = this.saveUpsertManyError.bind(this),
                _a[exports.EntityOp.SAVE_UPSERT_MANY_SUCCESS] = this.saveUpsertManySuccess.bind(this),
                _a[exports.EntityOp.SAVE_UPSERT_ONE] = this.saveUpsertOne.bind(this),
                _a[exports.EntityOp.SAVE_UPSERT_ONE_ERROR] = this.saveUpsertOneError.bind(this),
                _a[exports.EntityOp.SAVE_UPSERT_ONE_SUCCESS] = this.saveUpsertOneSuccess.bind(this),
                // Do nothing on save errors except turn the loading flag off.
                // See the ChangeTrackerMetaReducers
                // Or the app could listen for those errors and do something
                /// cache only operations ///
                _a[exports.EntityOp.ADD_ALL] = this.addAll.bind(this),
                _a[exports.EntityOp.ADD_MANY] = this.addMany.bind(this),
                _a[exports.EntityOp.ADD_ONE] = this.addOne.bind(this),
                _a[exports.EntityOp.REMOVE_ALL] = this.removeAll.bind(this),
                _a[exports.EntityOp.REMOVE_MANY] = this.removeMany.bind(this),
                _a[exports.EntityOp.REMOVE_ONE] = this.removeOne.bind(this),
                _a[exports.EntityOp.UPDATE_MANY] = this.updateMany.bind(this),
                _a[exports.EntityOp.UPDATE_ONE] = this.updateOne.bind(this),
                _a[exports.EntityOp.UPSERT_MANY] = this.upsertMany.bind(this),
                _a[exports.EntityOp.UPSERT_ONE] = this.upsertOne.bind(this),
                _a[exports.EntityOp.COMMIT_ALL] = this.commitAll.bind(this),
                _a[exports.EntityOp.COMMIT_MANY] = this.commitMany.bind(this),
                _a[exports.EntityOp.COMMIT_ONE] = this.commitOne.bind(this),
                _a[exports.EntityOp.UNDO_ALL] = this.undoAll.bind(this),
                _a[exports.EntityOp.UNDO_MANY] = this.undoMany.bind(this),
                _a[exports.EntityOp.UNDO_ONE] = this.undoOne.bind(this),
                _a[exports.EntityOp.SET_CHANGE_STATE] = this.setChangeState.bind(this),
                _a[exports.EntityOp.SET_COLLECTION] = this.setCollection.bind(this),
                _a[exports.EntityOp.SET_FILTER] = this.setFilter.bind(this),
                _a[exports.EntityOp.SET_LOADED] = this.setLoaded.bind(this),
                _a[exports.EntityOp.SET_LOADING] = this.setLoading.bind(this),
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
                if (change.changeType === exports.ChangeType.Added) {
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
                    if (change.changeType === exports.ChangeType.Added) {
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
                : exports.MergeStrategy.IgnoreChanges;
        };
        EntityCollectionReducerMethods.prototype.isOptimistic = function (action) {
            return action.payload && action.payload.isOptimistic === true;
        };
        return EntityCollectionReducerMethods;
    }());
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
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityDefinitionService])
        ], EntityCollectionReducerMethodsFactory);
        return EntityCollectionReducerMethodsFactory;
    }());

    /** Create a default reducer for a specific entity collection */
    var EntityCollectionReducerFactory = /** @class */ (function () {
        function EntityCollectionReducerFactory(methodsFactory) {
            this.methodsFactory = methodsFactory;
        }
        /** Create a default reducer for a collection of entities of T */
        EntityCollectionReducerFactory.prototype.create = function (entityName) {
            var methods = this.methodsFactory.create(entityName);
            /** Perform Actions against a particular entity collection in the EntityCache */
            return function entityCollectionReducer(collection, action) {
                var reducerMethod = methods[action.payload.entityOp];
                return reducerMethod ? reducerMethod(collection, action) : collection;
            };
        };
        EntityCollectionReducerFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityCollectionReducerMethodsFactory])
        ], EntityCollectionReducerFactory);
        return EntityCollectionReducerFactory;
    }());

    /**
     * Registry of entity types and their previously-constructed reducers.
     * Can create a new CollectionReducer, which it registers for subsequent use.
     */
    var EntityCollectionReducerRegistry = /** @class */ (function () {
        function EntityCollectionReducerRegistry(entityCollectionReducerFactory, entityCollectionMetaReducers) {
            this.entityCollectionReducerFactory = entityCollectionReducerFactory;
            this.entityCollectionReducers = {};
            this.entityCollectionMetaReducer = store.compose.apply(null, entityCollectionMetaReducers || []);
        }
        /**
         * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
         * @param entityName Name of the entity type for this reducer
         */
        EntityCollectionReducerRegistry.prototype.getOrCreateReducer = function (entityName) {
            var reducer = this.entityCollectionReducers[entityName];
            if (!reducer) {
                reducer = this.entityCollectionReducerFactory.create(entityName);
                reducer = this.registerReducer(entityName, reducer);
                this.entityCollectionReducers[entityName] = reducer;
            }
            return reducer;
        };
        /**
         * Register an EntityCollectionReducer for an entity type
         * @param entityName - the name of the entity type
         * @param reducer - reducer for that entity type
         *
         * Examples:
         *   registerReducer('Hero', myHeroReducer);
         *   registerReducer('Villain', myVillainReducer);
         */
        EntityCollectionReducerRegistry.prototype.registerReducer = function (entityName, reducer) {
            reducer = this.entityCollectionMetaReducer(reducer);
            return (this.entityCollectionReducers[entityName.trim()] = reducer);
        };
        /**
         * Register a batch of EntityCollectionReducers.
         * @param reducers - reducers to merge into existing reducers
         *
         * Examples:
         *   registerReducers({
         *     Hero: myHeroReducer,
         *     Villain: myVillainReducer
         *   });
         */
        EntityCollectionReducerRegistry.prototype.registerReducers = function (reducers) {
            var _this = this;
            var keys = reducers ? Object.keys(reducers) : [];
            keys.forEach(function (key) { return _this.registerReducer(key, reducers[key]); });
        };
        EntityCollectionReducerRegistry = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(1, core.Optional()),
            tslib_1.__param(1, core.Inject(ENTITY_COLLECTION_META_REDUCERS)),
            tslib_1.__metadata("design:paramtypes", [EntityCollectionReducerFactory, Array])
        ], EntityCollectionReducerRegistry);
        return EntityCollectionReducerRegistry;
    }());

    /**
     * Creates the EntityCacheReducer via its create() method
     */
    var EntityCacheReducerFactory = /** @class */ (function () {
        function EntityCacheReducerFactory(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
            this.entityCollectionCreator = entityCollectionCreator;
            this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
            this.logger = logger;
        }
        /**
         * Create the ngrx-data entity cache reducer which either responds to entity cache level actions
         * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
         */
        EntityCacheReducerFactory.prototype.create = function () {
            // This technique ensures a named function appears in the debugger
            return entityCacheReducer.bind(this);
            function entityCacheReducer(entityCache, action) {
                if (entityCache === void 0) { entityCache = {}; }
                // EntityCache actions
                switch (action.type) {
                    case exports.EntityCacheAction.CLEAR_COLLECTIONS: {
                        return this.clearCollectionsReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.LOAD_COLLECTIONS: {
                        return this.loadCollectionsReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.MERGE_QUERY_SET: {
                        return this.mergeQuerySetReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.SAVE_ENTITIES: {
                        return this.saveEntitiesReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                        return this.saveEntitiesCancelReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.SAVE_ENTITIES_ERROR: {
                        return this.saveEntitiesErrorReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                        return this.saveEntitiesSuccessReducer(entityCache, action);
                    }
                    case exports.EntityCacheAction.SET_ENTITY_CACHE: {
                        // Completely replace the EntityCache. Be careful!
                        return action.payload.cache;
                    }
                }
                // Apply entity collection reducer if this is a valid EntityAction for a collection
                var payload = action.payload;
                if (payload && payload.entityName && payload.entityOp && !payload.error) {
                    return this.applyCollectionReducer(entityCache, action);
                }
                // Not a valid EntityAction
                return entityCache;
            }
        };
        /**
         * Reducer to clear multiple collections at the same time.
         * @param entityCache the entity cache
         * @param action a ClearCollections action whose payload is an array of collection names.
         * If empty array, does nothing. If no array, clears all the collections.
         */
        EntityCacheReducerFactory.prototype.clearCollectionsReducer = function (entityCache, action) {
            var _this = this;
            // tslint:disable-next-line:prefer-const
            var _a = action.payload, collections = _a.collections, tag = _a.tag;
            var entityOp = exports.EntityOp.REMOVE_ALL;
            if (!collections) {
                // Collections is not defined. Clear all collections.
                collections = Object.keys(entityCache);
            }
            entityCache = collections.reduce(function (newCache, entityName) {
                var payload = { entityName: entityName, entityOp: entityOp };
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                newCache = _this.applyCollectionReducer(newCache, act);
                return newCache;
            }, entityCache);
            return entityCache;
        };
        /**
         * Reducer to load collection in the form of a hash of entity data for multiple collections.
         * @param entityCache the entity cache
         * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
         */
        EntityCacheReducerFactory.prototype.loadCollectionsReducer = function (entityCache, action) {
            var _this = this;
            var _a = action.payload, collections = _a.collections, tag = _a.tag;
            var entityOp = exports.EntityOp.ADD_ALL;
            var entityNames = Object.keys(collections);
            entityCache = entityNames.reduce(function (newCache, entityName) {
                var payload = {
                    entityName: entityName,
                    entityOp: entityOp,
                    data: collections[entityName],
                };
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                newCache = _this.applyCollectionReducer(newCache, act);
                return newCache;
            }, entityCache);
            return entityCache;
        };
        /**
         * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
         * @param entityCache the entity cache
         * @param action a MergeQuerySet action with the query set and a MergeStrategy
         */
        EntityCacheReducerFactory.prototype.mergeQuerySetReducer = function (entityCache, action) {
            var _this = this;
            // tslint:disable-next-line:prefer-const
            var _a = action.payload, mergeStrategy = _a.mergeStrategy, querySet = _a.querySet, tag = _a.tag;
            mergeStrategy =
                mergeStrategy === null ? exports.MergeStrategy.PreserveChanges : mergeStrategy;
            var entityOp = exports.EntityOp.UPSERT_MANY;
            var entityNames = Object.keys(querySet);
            entityCache = entityNames.reduce(function (newCache, entityName) {
                var payload = {
                    entityName: entityName,
                    entityOp: entityOp,
                    data: querySet[entityName],
                    mergeStrategy: mergeStrategy,
                };
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                newCache = _this.applyCollectionReducer(newCache, act);
                return newCache;
            }, entityCache);
            return entityCache;
        };
        // #region saveEntities reducers
        EntityCacheReducerFactory.prototype.saveEntitiesReducer = function (entityCache, action) {
            var _this = this;
            var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
            try {
                changeSet.changes.forEach(function (item) {
                    var entityName = item.entityName;
                    var payload = {
                        entityName: entityName,
                        entityOp: getEntityOp(item),
                        data: item.entities,
                        correlationId: correlationId,
                        isOptimistic: isOptimistic,
                        mergeStrategy: mergeStrategy,
                        tag: tag,
                    };
                    var act = {
                        type: "[" + entityName + "] " + action.type,
                        payload: payload,
                    };
                    entityCache = _this.applyCollectionReducer(entityCache, act);
                    if (act.payload.error) {
                        throw act.payload.error;
                    }
                });
            }
            catch (error) {
                action.payload.error = error;
            }
            return entityCache;
            function getEntityOp(item) {
                switch (item.op) {
                    case exports.ChangeSetOperation.Add:
                        return exports.EntityOp.SAVE_ADD_MANY;
                    case exports.ChangeSetOperation.Delete:
                        return exports.EntityOp.SAVE_DELETE_MANY;
                    case exports.ChangeSetOperation.Update:
                        return exports.EntityOp.SAVE_UPDATE_MANY;
                    case exports.ChangeSetOperation.Upsert:
                        return exports.EntityOp.SAVE_UPSERT_MANY;
                }
            }
        };
        EntityCacheReducerFactory.prototype.saveEntitiesCancelReducer = function (entityCache, action) {
            // This implementation can only clear the loading flag for the collections involved
            // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
            return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
        };
        EntityCacheReducerFactory.prototype.saveEntitiesErrorReducer = function (entityCache, action) {
            var originalAction = action.payload.originalAction;
            var originalChangeSet = originalAction.payload.changeSet;
            // This implementation can only clear the loading flag for the collections involved
            // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
            var entityNames = originalChangeSet.changes.map(function (item) { return item.entityName; });
            return this.clearLoadingFlags(entityCache, entityNames);
        };
        EntityCacheReducerFactory.prototype.saveEntitiesSuccessReducer = function (entityCache, action) {
            var _this = this;
            var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
            changeSet.changes.forEach(function (item) {
                var entityName = item.entityName;
                var payload = {
                    entityName: entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId: correlationId,
                    isOptimistic: isOptimistic,
                    mergeStrategy: mergeStrategy,
                    tag: tag,
                };
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                entityCache = _this.applyCollectionReducer(entityCache, act);
            });
            return entityCache;
            function getEntityOp(item) {
                switch (item.op) {
                    case exports.ChangeSetOperation.Add:
                        return exports.EntityOp.SAVE_ADD_MANY_SUCCESS;
                    case exports.ChangeSetOperation.Delete:
                        return exports.EntityOp.SAVE_DELETE_MANY_SUCCESS;
                    case exports.ChangeSetOperation.Update:
                        return exports.EntityOp.SAVE_UPDATE_MANY_SUCCESS;
                    case exports.ChangeSetOperation.Upsert:
                        return exports.EntityOp.SAVE_UPSERT_MANY_SUCCESS;
                }
            }
        };
        // #endregion saveEntities reducers
        // #region helpers
        /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
        EntityCacheReducerFactory.prototype.applyCollectionReducer = function (cache, action) {
            var _a;
            if (cache === void 0) { cache = {}; }
            var entityName = action.payload.entityName;
            var collection = cache[entityName];
            var reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
            var newCollection;
            try {
                newCollection = collection
                    ? reducer(collection, action)
                    : reducer(this.entityCollectionCreator.create(entityName), action);
            }
            catch (error) {
                this.logger.error(error);
                action.payload.error = error;
            }
            return action.payload.error || collection === newCollection
                ? cache
                : tslib_1.__assign({}, cache, (_a = {}, _a[entityName] = newCollection, _a));
        };
        /** Ensure loading is false for every collection in entityNames */
        EntityCacheReducerFactory.prototype.clearLoadingFlags = function (entityCache, entityNames) {
            var isMutated = false;
            entityNames.forEach(function (entityName) {
                var collection = entityCache[entityName];
                if (collection.loading) {
                    if (!isMutated) {
                        entityCache = tslib_1.__assign({}, entityCache);
                        isMutated = true;
                    }
                    entityCache[entityName] = tslib_1.__assign({}, collection, { loading: false });
                }
            });
            return entityCache;
        };
        EntityCacheReducerFactory = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__metadata("design:paramtypes", [EntityCollectionCreator,
                EntityCollectionReducerRegistry,
                Logger])
        ], EntityCacheReducerFactory);
        return EntityCacheReducerFactory;
    }());

    var DefaultLogger = /** @class */ (function () {
        function DefaultLogger() {
        }
        DefaultLogger.prototype.error = function (message, extra) {
            if (message) {
                extra ? console.error(message, extra) : console.error(message);
            }
        };
        DefaultLogger.prototype.log = function (message, extra) {
            if (message) {
                extra ? console.log(message, extra) : console.log(message);
            }
        };
        DefaultLogger.prototype.warn = function (message, extra) {
            if (message) {
                extra ? console.warn(message, extra) : console.warn(message);
            }
        };
        DefaultLogger = tslib_1.__decorate([
            core.Injectable()
        ], DefaultLogger);
        return DefaultLogger;
    }());

    var uncountable = [
        // 'sheep',
        // 'fish',
        // 'deer',
        // 'moose',
        // 'rice',
        // 'species',
        'equipment',
        'information',
        'money',
        'series',
    ];
    var DefaultPluralizer = /** @class */ (function () {
        function DefaultPluralizer(pluralNames) {
            var _this = this;
            this.pluralNames = {};
            // merge each plural names object
            if (pluralNames) {
                pluralNames.forEach(function (pn) { return _this.registerPluralNames(pn); });
            }
        }
        /**
         * Pluralize a singular name using common English language pluralization rules
         * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
         */
        DefaultPluralizer.prototype.pluralize = function (name) {
            var plural = this.pluralNames[name];
            if (plural) {
                return plural;
            }
            // singular and plural are the same
            if (uncountable.indexOf(name.toLowerCase()) >= 0) {
                return name;
                // vowel + y
            }
            else if (/[aeiou]y$/.test(name)) {
                return name + 's';
                // consonant + y
            }
            else if (name.endsWith('y')) {
                return name.substr(0, name.length - 1) + 'ies';
                // endings typically pluralized with 'es'
            }
            else if (/[s|ss|sh|ch|x|z]$/.test(name)) {
                return name + 'es';
            }
            else {
                return name + 's';
            }
        };
        /**
         * Register a mapping of entity type name to the entity name's plural
         * @param pluralNames {EntityPluralNames} plural names for entity types
         */
        DefaultPluralizer.prototype.registerPluralNames = function (pluralNames) {
            this.pluralNames = tslib_1.__assign({}, this.pluralNames, (pluralNames || {}));
        };
        DefaultPluralizer = tslib_1.__decorate([
            core.Injectable(),
            tslib_1.__param(0, core.Optional()),
            tslib_1.__param(0, core.Inject(PLURAL_NAMES_TOKEN)),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], DefaultPluralizer);
        return DefaultPluralizer;
    }());

    /*
    Client-side id-generators

    These GUID utility functions are not used by ngrx-data itself at this time.
    They are included as candidates for generating persistable correlation ids if that becomes desirable.
    They are also safe for generating unique entity ids on the client.

    Note they produce 32-character hexadecimal UUID strings,
    not the 128-bit representation found in server-side languages and databases.

    These utilities are experimental and may be withdrawn or replaced in future.
    */
    /**
     * Creates a Universally Unique Identifier (AKA GUID)
     */
    function getUuid() {
        // The original implementation is based on this SO answer:
        // http://stackoverflow.com/a/2117523/200253
        return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            var r = (Math.random() * 16) | 0, 
            // tslint:disable-next-line:no-bitwise
            v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /** Alias for getUuid(). Compare with getGuidComb(). */
    function getGuid() {
        return getUuid();
    }
    /**
     * Creates a sortable, pseudo-GUID (globally unique identifier)
     * whose trailing 6 bytes (12 hex digits) are time-based
     * Start either with the given getTime() value, seedTime,
     * or get the current time in ms.
     *
     * @param seed {number} - optional seed for reproducible time-part
     */
    function getGuidComb(seed) {
        // Each new Guid is greater than next if more than 1ms passes
        // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
        // Based on breeze.core.getUuid which is based on this StackOverflow answer
        // http://stackoverflow.com/a/2117523/200253
        //
        // Convert time value to hex: n.toString(16)
        // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
        // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
        //
        // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
        var timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(-12);
        return ('xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable:no-bitwise
            var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }) + timePart);
    }
    // Sort comparison value that's good enough
    function guidComparer(l, r) {
        var l_low = l.slice(-12);
        var r_low = r.slice(-12);
        return l_low !== r_low
            ? l_low < r_low
                ? -1
                : +(l_low !== r_low)
            : l < r
                ? -1
                : +(l !== r);
    }

    var ɵ0 = ENTITY_CACHE_NAME;
    /**
     * Module without effects or dataservices which means no HTTP calls
     * This module helpful for internal testing.
     * Also helpful for apps that handle server access on their own and
     * therefore opt-out of @ngrx/effects for entities
     */
    var EntityDataModuleWithoutEffects = /** @class */ (function () {
        function EntityDataModuleWithoutEffects(reducerManager, entityCacheReducerFactory, injector, 
        // optional params
        entityCacheName, initialState, metaReducers) {
            this.reducerManager = reducerManager;
            this.injector = injector;
            this.entityCacheName = entityCacheName;
            this.initialState = initialState;
            this.metaReducers = metaReducers;
            // Add the ngrx-data feature to the Store's features
            // as Store.forFeature does for StoreFeatureModule
            var key = entityCacheName || ENTITY_CACHE_NAME;
            initialState =
                typeof initialState === 'function' ? initialState() : initialState;
            var reducers = (metaReducers || []).map(function (mr) {
                return mr instanceof core.InjectionToken ? injector.get(mr) : mr;
            });
            this.entityCacheFeature = {
                key: key,
                reducers: entityCacheReducerFactory.create(),
                reducerFactory: store.combineReducers,
                initialState: initialState || {},
                metaReducers: reducers,
            };
            reducerManager.addFeature(this.entityCacheFeature);
        }
        EntityDataModuleWithoutEffects_1 = EntityDataModuleWithoutEffects;
        EntityDataModuleWithoutEffects.forRoot = function (config) {
            return {
                ngModule: EntityDataModuleWithoutEffects_1,
                providers: [
                    {
                        provide: ENTITY_CACHE_META_REDUCERS,
                        useValue: config.entityCacheMetaReducers
                            ? config.entityCacheMetaReducers
                            : [],
                    },
                    {
                        provide: ENTITY_COLLECTION_META_REDUCERS,
                        useValue: config.entityCollectionMetaReducers
                            ? config.entityCollectionMetaReducers
                            : [],
                    },
                    {
                        provide: PLURAL_NAMES_TOKEN,
                        multi: true,
                        useValue: config.pluralNames ? config.pluralNames : {},
                    },
                ],
            };
        };
        EntityDataModuleWithoutEffects.prototype.ngOnDestroy = function () {
            this.reducerManager.removeFeature(this.entityCacheFeature);
        };
        var EntityDataModuleWithoutEffects_1;
        EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects_1 = tslib_1.__decorate([
            core.NgModule({
                imports: [
                    store.StoreModule,
                ],
                providers: [
                    CorrelationIdGenerator,
                    EntityDispatcherDefaultOptions,
                    EntityActionFactory,
                    EntityCacheDispatcher,
                    EntityCacheReducerFactory,
                    entityCacheSelectorProvider,
                    EntityCollectionCreator,
                    EntityCollectionReducerFactory,
                    EntityCollectionReducerMethodsFactory,
                    EntityCollectionReducerRegistry,
                    EntityCollectionServiceElementsFactory,
                    EntityCollectionServiceFactory,
                    EntityDefinitionService,
                    EntityDispatcherFactory,
                    EntitySelectorsFactory,
                    EntitySelectors$Factory,
                    EntityServicesElements,
                    { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ɵ0 },
                    { provide: EntityServices, useClass: EntityServicesBase },
                    { provide: Logger, useClass: DefaultLogger },
                ],
            }),
            tslib_1.__param(3, core.Optional()),
            tslib_1.__param(3, core.Inject(ENTITY_CACHE_NAME_TOKEN)),
            tslib_1.__param(4, core.Optional()),
            tslib_1.__param(4, core.Inject(INITIAL_ENTITY_CACHE_STATE)),
            tslib_1.__param(5, core.Optional()),
            tslib_1.__param(5, core.Inject(ENTITY_CACHE_META_REDUCERS)),
            tslib_1.__metadata("design:paramtypes", [store.ReducerManager,
                EntityCacheReducerFactory,
                core.Injector, String, Object, Array])
        ], EntityDataModuleWithoutEffects);
        return EntityDataModuleWithoutEffects;
    }());

    /**
     * entity-data main module includes effects and HTTP data services
     * Configure with `forRoot`.
     * No `forFeature` yet.
     */
    var EntityDataModule = /** @class */ (function () {
        function EntityDataModule(effectSources, entityCacheEffects, entityEffects) {
            this.effectSources = effectSources;
            // We can't use `forFeature()` because, if we did, the developer could not
            // replace the entity-data `EntityEffects` with a custom alternative.
            // Replacing that class is an extensibility point we need.
            //
            // The FEATURE_EFFECTS token is not exposed, so can't use that technique.
            // Warning: this alternative approach relies on an undocumented API
            // to add effect directly rather than through `forFeature()`.
            // The danger is that EffectsModule.forFeature evolves and we no longer perform a crucial step.
            this.addEffects(entityCacheEffects);
            this.addEffects(entityEffects);
        }
        EntityDataModule_1 = EntityDataModule;
        EntityDataModule.forRoot = function (config) {
            return {
                ngModule: EntityDataModule_1,
                providers: [
                    // TODO: Moved these effects classes up to EntityDataModule itself
                    // Remove this comment if that was a mistake.
                    // EntityCacheEffects,
                    // EntityEffects,
                    {
                        provide: ENTITY_METADATA_TOKEN,
                        multi: true,
                        useValue: config.entityMetadata ? config.entityMetadata : [],
                    },
                    {
                        provide: ENTITY_CACHE_META_REDUCERS,
                        useValue: config.entityCacheMetaReducers
                            ? config.entityCacheMetaReducers
                            : [],
                    },
                    {
                        provide: ENTITY_COLLECTION_META_REDUCERS,
                        useValue: config.entityCollectionMetaReducers
                            ? config.entityCollectionMetaReducers
                            : [],
                    },
                    {
                        provide: PLURAL_NAMES_TOKEN,
                        multi: true,
                        useValue: config.pluralNames ? config.pluralNames : {},
                    },
                ],
            };
        };
        /**
         * Add another class instance that contains @Effect methods.
         * @param effectSourceInstance a class instance that implements effects.
         * Warning: undocumented @ngrx/effects API
         */
        EntityDataModule.prototype.addEffects = function (effectSourceInstance) {
            this.effectSources.addEffects(effectSourceInstance);
        };
        var EntityDataModule_1;
        EntityDataModule = EntityDataModule_1 = tslib_1.__decorate([
            core.NgModule({
                imports: [
                    EntityDataModuleWithoutEffects,
                    effects.EffectsModule,
                ],
                providers: [
                    DefaultDataServiceFactory,
                    EntityCacheDataService,
                    EntityDataService,
                    EntityCacheEffects,
                    EntityEffects,
                    { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
                    {
                        provide: PersistenceResultHandler,
                        useClass: DefaultPersistenceResultHandler,
                    },
                    { provide: Pluralizer, useClass: DefaultPluralizer },
                ],
            }),
            tslib_1.__metadata("design:paramtypes", [effects.EffectSources,
                EntityCacheEffects,
                EntityEffects])
        ], EntityDataModule);
        return EntityDataModule;
    }());

    // AOT v5 bug:

    /**
     * DO NOT EDIT
     *
     * This file is automatically generated at build
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ɵngrx_modules_data_data_a = ENTITY_EFFECTS_SCHEDULER;
    exports.EntityDataModule = EntityDataModule;
    exports.EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects;
    exports.EntityActionFactory = EntityActionFactory;
    exports.EntityActionGuard = EntityActionGuard;
    exports.ofEntityOp = ofEntityOp;
    exports.ofEntityType = ofEntityType;
    exports.ClearCollections = ClearCollections;
    exports.LoadCollections = LoadCollections;
    exports.MergeQuerySet = MergeQuerySet;
    exports.SetEntityCache = SetEntityCache;
    exports.SaveEntities = SaveEntities;
    exports.SaveEntitiesCancel = SaveEntitiesCancel;
    exports.SaveEntitiesCanceled = SaveEntitiesCanceled;
    exports.SaveEntitiesError = SaveEntitiesError;
    exports.SaveEntitiesSuccess = SaveEntitiesSuccess;
    exports.ChangeSetItemFactory = ChangeSetItemFactory;
    exports.changeSetItemFactory = changeSetItemFactory;
    exports.excludeEmptyChangeSetItems = excludeEmptyChangeSetItems;
    exports.OP_SUCCESS = OP_SUCCESS;
    exports.OP_ERROR = OP_ERROR;
    exports.makeErrorOp = makeErrorOp;
    exports.makeSuccessOp = makeSuccessOp;
    exports.DataServiceError = DataServiceError;
    exports.DefaultDataServiceConfig = DefaultDataServiceConfig;
    exports.DefaultDataService = DefaultDataService;
    exports.DefaultDataServiceFactory = DefaultDataServiceFactory;
    exports.EntityCacheDataService = EntityCacheDataService;
    exports.EntityDataService = EntityDataService;
    exports.EntityHttpResourceUrls = EntityHttpResourceUrls;
    exports.HttpUrlGenerator = HttpUrlGenerator;
    exports.DefaultHttpUrlGenerator = DefaultHttpUrlGenerator;
    exports.normalizeRoot = normalizeRoot;
    exports.PersistenceResultHandler = PersistenceResultHandler;
    exports.DefaultPersistenceResultHandler = DefaultPersistenceResultHandler;
    exports.EntityCacheDispatcher = EntityCacheDispatcher;
    exports.EntityDispatcherBase = EntityDispatcherBase;
    exports.EntityDispatcherDefaultOptions = EntityDispatcherDefaultOptions;
    exports.EntityDispatcherFactory = EntityDispatcherFactory;
    exports.PersistanceCanceled = PersistanceCanceled;
    exports.EntityCacheEffects = EntityCacheEffects;
    exports.persistOps = persistOps;
    exports.EntityEffects = EntityEffects;
    exports.EntityDefinitionService = EntityDefinitionService;
    exports.createEntityDefinition = createEntityDefinition;
    exports.PropsFilterFnFactory = PropsFilterFnFactory;
    exports.ENTITY_METADATA_TOKEN = ENTITY_METADATA_TOKEN;
    exports.EntityCollectionServiceBase = EntityCollectionServiceBase;
    exports.EntityCollectionServiceElementsFactory = EntityCollectionServiceElementsFactory;
    exports.EntityCollectionServiceFactory = EntityCollectionServiceFactory;
    exports.EntityServicesBase = EntityServicesBase;
    exports.EntityServicesElements = EntityServicesElements;
    exports.EntityServices = EntityServices;
    exports.ENTITY_CACHE_NAME = ENTITY_CACHE_NAME;
    exports.ENTITY_CACHE_NAME_TOKEN = ENTITY_CACHE_NAME_TOKEN;
    exports.ENTITY_CACHE_META_REDUCERS = ENTITY_CACHE_META_REDUCERS;
    exports.ENTITY_COLLECTION_META_REDUCERS = ENTITY_COLLECTION_META_REDUCERS;
    exports.INITIAL_ENTITY_CACHE_STATE = INITIAL_ENTITY_CACHE_STATE;
    exports.EntityCacheReducerFactory = EntityCacheReducerFactory;
    exports.EntityChangeTrackerBase = EntityChangeTrackerBase;
    exports.EntityCollectionCreator = EntityCollectionCreator;
    exports.createEmptyEntityCollection = createEmptyEntityCollection;
    exports.EntityCollectionReducerMethods = EntityCollectionReducerMethods;
    exports.EntityCollectionReducerMethodsFactory = EntityCollectionReducerMethodsFactory;
    exports.EntityCollectionReducerRegistry = EntityCollectionReducerRegistry;
    exports.EntityCollectionReducerFactory = EntityCollectionReducerFactory;
    exports.ENTITY_CACHE_SELECTOR_TOKEN = ENTITY_CACHE_SELECTOR_TOKEN;
    exports.entityCacheSelectorProvider = entityCacheSelectorProvider;
    exports.createEntityCacheSelector = createEntityCacheSelector;
    exports.EntitySelectorsFactory = EntitySelectorsFactory;
    exports.EntitySelectors$Factory = EntitySelectors$Factory;
    exports.CorrelationIdGenerator = CorrelationIdGenerator;
    exports.DefaultLogger = DefaultLogger;
    exports.DefaultPluralizer = DefaultPluralizer;
    exports.getUuid = getUuid;
    exports.getGuid = getGuid;
    exports.getGuidComb = getGuidComb;
    exports.guidComparer = guidComparer;
    exports.Logger = Logger;
    exports.PLURAL_NAMES_TOKEN = PLURAL_NAMES_TOKEN;
    exports.Pluralizer = Pluralizer;
    exports.defaultSelectId = defaultSelectId;
    exports.flattenArgs = flattenArgs;
    exports.toUpdateFactory = toUpdateFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=data.umd.js.map
