// src/actions/entity-action-factory.mjs
import { Injectable } from "@angular/core";
import * as i0 from "@angular/core";
var EntityActionFactory = class _EntityActionFactory {
  // polymorphic create for the two signatures
  create(nameOrPayload, entityOp, data, options) {
    const payload = typeof nameOrPayload === "string" ? {
      ...options || {},
      entityName: nameOrPayload,
      entityOp,
      data
    } : nameOrPayload;
    return this.createCore(payload);
  }
  /**
   * Create an EntityAction to perform an operation (op) for a particular entity type
   * (entityName) with optional data and other optional flags
   * @param payload Defines the EntityAction and its options
   */
  createCore(payload) {
    const { entityName, entityOp, tag } = payload;
    if (!entityName) {
      throw new Error("Missing entity name for new action");
    }
    if (entityOp == null) {
      throw new Error("Missing EntityOp for new action");
    }
    const type = this.formatActionType(entityOp, tag || entityName);
    return { type, payload };
  }
  /**
   * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
   * @param from Source action that is the base for the new action
   * @param newProperties New EntityAction properties that replace the source action properties
   */
  createFromAction(from, newProperties) {
    return this.create({ ...from.payload, ...newProperties });
  }
  formatActionType(op, tag) {
    return `[${tag}] ${op}`;
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i0, type: _EntityActionFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i0, type: _EntityActionFactory });
  }
};
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i0, type: EntityActionFactory, decorators: [{
  type: Injectable
}] });

// src/actions/entity-action-guard.mjs
var EntityActionGuard = class {
  constructor(entityName, selectId) {
    this.entityName = entityName;
    this.selectId = selectId;
  }
  /** Throw if the action payload is not an entity with a valid key */
  mustBeEntity(action) {
    const data = this.extractData(action);
    if (!data) {
      return this.throwError(action, `should have a single entity.`);
    }
    const id = this.selectId(data);
    if (this.isNotKeyType(id)) {
      this.throwError(action, `has a missing or invalid entity key (id)`);
    }
    return data;
  }
  /** Throw if the action payload is not an array of entities with valid keys */
  mustBeEntities(action) {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entities`);
    }
    data.forEach((entity, i) => {
      const id = this.selectId(entity);
      if (this.isNotKeyType(id)) {
        const msg = `, item ${i + 1}, does not have a valid entity key (id)`;
        this.throwError(action, msg);
      }
    });
    return data;
  }
  /** Throw if the action payload is not a single, valid key */
  mustBeKey(action) {
    const data = this.extractData(action);
    if (data === void 0) {
      throw new Error(`should be a single entity key`);
    }
    if (this.isNotKeyType(data)) {
      throw new Error(`is not a valid key (id)`);
    }
    return data;
  }
  /** Throw if the action payload is not an array of valid keys */
  mustBeKeys(action) {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entity keys (id)`);
    }
    data.forEach((id, i) => {
      if (this.isNotKeyType(id)) {
        const msg = `${this.entityName} ', item ${i + 1}, is not a valid entity key (id)`;
        this.throwError(action, msg);
      }
    });
    return data;
  }
  /** Throw if the action payload is not an update with a valid key (id) */
  mustBeUpdate(action) {
    const data = this.extractData(action);
    if (!data) {
      return this.throwError(action, `should be a single entity update`);
    }
    const { id, changes } = data;
    const id2 = this.selectId(changes);
    if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
      this.throwError(action, `has a missing or invalid entity key (id)`);
    }
    return data;
  }
  /** Throw if the action payload is not an array of updates with valid keys (ids) */
  mustBeUpdates(action) {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entity updates`);
    }
    data.forEach((item, i) => {
      const { id, changes } = item;
      const id2 = this.selectId(changes);
      if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
        this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
      }
    });
    return data;
  }
  /** Throw if the action payload is not an update response with a valid key (id) */
  mustBeUpdateResponse(action) {
    const data = this.extractData(action);
    if (!data) {
      return this.throwError(action, `should be a single entity update`);
    }
    const { id, changes } = data;
    const id2 = this.selectId(changes);
    if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
      this.throwError(action, `has a missing or invalid entity key (id)`);
    }
    return data;
  }
  /** Throw if the action payload is not an array of update responses with valid keys (ids) */
  mustBeUpdateResponses(action) {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entity updates`);
    }
    data.forEach((item, i) => {
      const { id, changes } = item;
      const id2 = this.selectId(changes);
      if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
        this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
      }
    });
    return data;
  }
  extractData(action) {
    return action.payload && action.payload.data;
  }
  /** Return true if this key (id) is invalid */
  isNotKeyType(id) {
    return typeof id !== "string" && typeof id !== "number";
  }
  throwError(action, msg) {
    throw new Error(`${this.entityName} EntityAction guard for "${action.type}": payload ${msg}`);
  }
};

// src/utils/utilities.mjs
function defaultSelectId(entity) {
  return entity == null ? void 0 : entity.id;
}
function flattenArgs(args) {
  if (args == null) {
    return [];
  }
  if (Array.isArray(args[0])) {
    const [head, ...tail] = args;
    args = [...head, ...tail];
  }
  return args;
}
function toUpdateFactory(selectId) {
  selectId = selectId || defaultSelectId;
  return function toUpdate(entity) {
    const id = selectId(entity);
    if (id == null) {
      throw new Error("Primary key may not be null/undefined.");
    }
    return entity && { id, changes: entity };
  };
}

// src/actions/entity-action-operators.mjs
import { filter } from "rxjs/operators";
function ofEntityOp(...allowedEntityOps) {
  const ops = flattenArgs(allowedEntityOps);
  switch (ops.length) {
    case 0:
      return filter((action) => action.payload && action.payload.entityOp != null);
    case 1:
      const op = ops[0];
      return filter((action) => action.payload && op === action.payload.entityOp);
    default:
      return filter((action) => {
        const entityOp = action.payload && action.payload.entityOp;
        return entityOp && ops.some((o) => o === entityOp);
      });
  }
}
function ofEntityType(...allowedEntityNames) {
  const names = flattenArgs(allowedEntityNames);
  switch (names.length) {
    case 0:
      return filter((action) => action.payload && action.payload.entityName != null);
    case 1:
      const name = names[0];
      return filter((action) => action.payload && name === action.payload.entityName);
    default:
      return filter((action) => {
        const entityName = action.payload && action.payload.entityName;
        return !!entityName && names.some((n) => n === entityName);
      });
  }
}

// src/actions/entity-cache-change-set.mjs
var ChangeSetOperation;
(function(ChangeSetOperation2) {
  ChangeSetOperation2["Add"] = "Add";
  ChangeSetOperation2["Delete"] = "Delete";
  ChangeSetOperation2["Update"] = "Update";
  ChangeSetOperation2["Upsert"] = "Upsert";
})(ChangeSetOperation || (ChangeSetOperation = {}));
var ChangeSetItemFactory = class {
  /** Create the ChangeSetAdd for new entities of the given entity type */
  add(entityName, entities) {
    entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
    return { entityName, op: ChangeSetOperation.Add, entities };
  }
  /** Create the ChangeSetDelete for primary keys of the given entity type */
  delete(entityName, keys) {
    const ids = Array.isArray(keys) ? keys : keys ? [keys] : [];
    return { entityName, op: ChangeSetOperation.Delete, entities: ids };
  }
  /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
  update(entityName, updates) {
    updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
    return { entityName, op: ChangeSetOperation.Update, entities: updates };
  }
  /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
  upsert(entityName, entities) {
    entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
    return { entityName, op: ChangeSetOperation.Upsert, entities };
  }
};
var changeSetItemFactory = new ChangeSetItemFactory();
function excludeEmptyChangeSetItems(changeSet) {
  changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
  const changes = changeSet.changes.filter((c) => c != null && c.entities && c.entities.length > 0);
  return { ...changeSet, changes };
}

// src/actions/merge-strategy.mjs
var MergeStrategy;
(function(MergeStrategy2) {
  MergeStrategy2[MergeStrategy2["IgnoreChanges"] = 0] = "IgnoreChanges";
  MergeStrategy2[MergeStrategy2["PreserveChanges"] = 1] = "PreserveChanges";
  MergeStrategy2[MergeStrategy2["OverwriteChanges"] = 2] = "OverwriteChanges";
})(MergeStrategy || (MergeStrategy = {}));

// src/actions/entity-cache-action.mjs
var EntityCacheAction;
(function(EntityCacheAction2) {
  EntityCacheAction2["CLEAR_COLLECTIONS"] = "@ngrx/data/entity-cache/clear-collections";
  EntityCacheAction2["LOAD_COLLECTIONS"] = "@ngrx/data/entity-cache/load-collections";
  EntityCacheAction2["MERGE_QUERY_SET"] = "@ngrx/data/entity-cache/merge-query-set";
  EntityCacheAction2["SET_ENTITY_CACHE"] = "@ngrx/data/entity-cache/set-cache";
  EntityCacheAction2["SAVE_ENTITIES"] = "@ngrx/data/entity-cache/save-entities";
  EntityCacheAction2["SAVE_ENTITIES_CANCEL"] = "@ngrx/data/entity-cache/save-entities-cancel";
  EntityCacheAction2["SAVE_ENTITIES_CANCELED"] = "@ngrx/data/entity-cache/save-entities-canceled";
  EntityCacheAction2["SAVE_ENTITIES_ERROR"] = "@ngrx/data/entity-cache/save-entities-error";
  EntityCacheAction2["SAVE_ENTITIES_SUCCESS"] = "@ngrx/data/entity-cache/save-entities-success";
})(EntityCacheAction || (EntityCacheAction = {}));
var ClearCollections = class {
  constructor(collections, tag) {
    this.type = EntityCacheAction.CLEAR_COLLECTIONS;
    this.payload = { collections, tag };
  }
};
var LoadCollections = class {
  constructor(collections, tag) {
    this.type = EntityCacheAction.LOAD_COLLECTIONS;
    this.payload = { collections, tag };
  }
};
var MergeQuerySet = class {
  constructor(querySet, mergeStrategy, tag) {
    this.type = EntityCacheAction.MERGE_QUERY_SET;
    this.payload = {
      querySet,
      mergeStrategy: mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy,
      tag
    };
  }
};
var SetEntityCache = class {
  constructor(cache, tag) {
    this.cache = cache;
    this.type = EntityCacheAction.SET_ENTITY_CACHE;
    this.payload = { cache, tag };
  }
};
var SaveEntities = class {
  constructor(changeSet, url, options) {
    this.type = EntityCacheAction.SAVE_ENTITIES;
    options = options || {};
    if (changeSet) {
      changeSet.tag = changeSet.tag || options.tag;
    }
    this.payload = { changeSet, url, ...options, tag: changeSet.tag };
  }
};
var SaveEntitiesCancel = class {
  constructor(correlationId, reason, entityNames, tag) {
    this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
    this.payload = { correlationId, reason, entityNames, tag };
  }
};
var SaveEntitiesCanceled = class {
  constructor(correlationId, reason, tag) {
    this.type = EntityCacheAction.SAVE_ENTITIES_CANCELED;
    this.payload = { correlationId, reason, tag };
  }
};
var SaveEntitiesError = class {
  constructor(error, originalAction) {
    this.type = EntityCacheAction.SAVE_ENTITIES_ERROR;
    const correlationId = originalAction.payload.correlationId;
    this.payload = { error, originalAction, correlationId };
  }
};
var SaveEntitiesSuccess = class {
  constructor(changeSet, url, options) {
    this.type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
    options = options || {};
    if (changeSet) {
      changeSet.tag = changeSet.tag || options.tag;
    }
    this.payload = { changeSet, url, ...options, tag: changeSet.tag };
  }
};

// src/actions/entity-op.mjs
var EntityOp;
(function(EntityOp2) {
  EntityOp2["CANCEL_PERSIST"] = "@ngrx/data/cancel-persist";
  EntityOp2["CANCELED_PERSIST"] = "@ngrx/data/canceled-persist";
  EntityOp2["QUERY_ALL"] = "@ngrx/data/query-all";
  EntityOp2["QUERY_ALL_SUCCESS"] = "@ngrx/data/query-all/success";
  EntityOp2["QUERY_ALL_ERROR"] = "@ngrx/data/query-all/error";
  EntityOp2["QUERY_LOAD"] = "@ngrx/data/query-load";
  EntityOp2["QUERY_LOAD_SUCCESS"] = "@ngrx/data/query-load/success";
  EntityOp2["QUERY_LOAD_ERROR"] = "@ngrx/data/query-load/error";
  EntityOp2["QUERY_MANY"] = "@ngrx/data/query-many";
  EntityOp2["QUERY_MANY_SUCCESS"] = "@ngrx/data/query-many/success";
  EntityOp2["QUERY_MANY_ERROR"] = "@ngrx/data/query-many/error";
  EntityOp2["QUERY_BY_KEY"] = "@ngrx/data/query-by-key";
  EntityOp2["QUERY_BY_KEY_SUCCESS"] = "@ngrx/data/query-by-key/success";
  EntityOp2["QUERY_BY_KEY_ERROR"] = "@ngrx/data/query-by-key/error";
  EntityOp2["SAVE_ADD_MANY"] = "@ngrx/data/save/add-many";
  EntityOp2["SAVE_ADD_MANY_ERROR"] = "@ngrx/data/save/add-many/error";
  EntityOp2["SAVE_ADD_MANY_SUCCESS"] = "@ngrx/data/save/add-many/success";
  EntityOp2["SAVE_ADD_ONE"] = "@ngrx/data/save/add-one";
  EntityOp2["SAVE_ADD_ONE_ERROR"] = "@ngrx/data/save/add-one/error";
  EntityOp2["SAVE_ADD_ONE_SUCCESS"] = "@ngrx/data/save/add-one/success";
  EntityOp2["SAVE_DELETE_MANY"] = "@ngrx/data/save/delete-many";
  EntityOp2["SAVE_DELETE_MANY_SUCCESS"] = "@ngrx/data/save/delete-many/success";
  EntityOp2["SAVE_DELETE_MANY_ERROR"] = "@ngrx/data/save/delete-many/error";
  EntityOp2["SAVE_DELETE_ONE"] = "@ngrx/data/save/delete-one";
  EntityOp2["SAVE_DELETE_ONE_SUCCESS"] = "@ngrx/data/save/delete-one/success";
  EntityOp2["SAVE_DELETE_ONE_ERROR"] = "@ngrx/data/save/delete-one/error";
  EntityOp2["SAVE_UPDATE_MANY"] = "@ngrx/data/save/update-many";
  EntityOp2["SAVE_UPDATE_MANY_SUCCESS"] = "@ngrx/data/save/update-many/success";
  EntityOp2["SAVE_UPDATE_MANY_ERROR"] = "@ngrx/data/save/update-many/error";
  EntityOp2["SAVE_UPDATE_ONE"] = "@ngrx/data/save/update-one";
  EntityOp2["SAVE_UPDATE_ONE_SUCCESS"] = "@ngrx/data/save/update-one/success";
  EntityOp2["SAVE_UPDATE_ONE_ERROR"] = "@ngrx/data/save/update-one/error";
  EntityOp2["SAVE_UPSERT_MANY"] = "@ngrx/data/save/upsert-many";
  EntityOp2["SAVE_UPSERT_MANY_SUCCESS"] = "@ngrx/data/save/upsert-many/success";
  EntityOp2["SAVE_UPSERT_MANY_ERROR"] = "@ngrx/data/save/upsert-many/error";
  EntityOp2["SAVE_UPSERT_ONE"] = "@ngrx/data/save/upsert-one";
  EntityOp2["SAVE_UPSERT_ONE_SUCCESS"] = "@ngrx/data/save/upsert-one/success";
  EntityOp2["SAVE_UPSERT_ONE_ERROR"] = "@ngrx/data/save/upsert-one/error";
  EntityOp2["ADD_ALL"] = "@ngrx/data/add-all";
  EntityOp2["ADD_MANY"] = "@ngrx/data/add-many";
  EntityOp2["ADD_ONE"] = "@ngrx/data/add-one";
  EntityOp2["REMOVE_ALL"] = "@ngrx/data/remove-all";
  EntityOp2["REMOVE_MANY"] = "@ngrx/data/remove-many";
  EntityOp2["REMOVE_ONE"] = "@ngrx/data/remove-one";
  EntityOp2["UPDATE_MANY"] = "@ngrx/data/update-many";
  EntityOp2["UPDATE_ONE"] = "@ngrx/data/update-one";
  EntityOp2["UPSERT_MANY"] = "@ngrx/data/upsert-many";
  EntityOp2["UPSERT_ONE"] = "@ngrx/data/upsert-one";
  EntityOp2["COMMIT_ALL"] = "@ngrx/data/commit-all";
  EntityOp2["COMMIT_MANY"] = "@ngrx/data/commit-many";
  EntityOp2["COMMIT_ONE"] = "@ngrx/data/commit-one";
  EntityOp2["UNDO_ALL"] = "@ngrx/data/undo-all";
  EntityOp2["UNDO_MANY"] = "@ngrx/data/undo-many";
  EntityOp2["UNDO_ONE"] = "@ngrx/data/undo-one";
  EntityOp2["SET_CHANGE_STATE"] = "@ngrx/data/set-change-state";
  EntityOp2["SET_COLLECTION"] = "@ngrx/data/set-collection";
  EntityOp2["SET_FILTER"] = "@ngrx/data/set-filter";
  EntityOp2["SET_LOADED"] = "@ngrx/data/set-loaded";
  EntityOp2["SET_LOADING"] = "@ngrx/data/set-loading";
})(EntityOp || (EntityOp = {}));
var OP_SUCCESS = "/success";
var OP_ERROR = "/error";
function makeErrorOp(op) {
  return op + OP_ERROR;
}
function makeSuccessOp(op) {
  return op + OP_SUCCESS;
}

// src/dataservices/data-service-error.mjs
var DataServiceError = class extends Error {
  constructor(error, requestData) {
    super(typeof error === "string" ? error : extractMessage(error) ?? void 0);
    this.error = error;
    this.requestData = requestData;
    this.name = this.constructor.name;
  }
};
function extractMessage(sourceError) {
  const { error, body, message } = sourceError;
  let errMessage = null;
  if (error) {
    errMessage = typeof error === "string" ? error : error.message;
  } else if (message) {
    errMessage = message;
  } else if (body) {
    errMessage = typeof body === "string" ? body : body.error;
  }
  return typeof errMessage === "string" ? errMessage : errMessage ? JSON.stringify(errMessage) : null;
}

// src/dataservices/default-data-service-config.mjs
var DefaultDataServiceConfig = class {
};

// src/utils/interfaces.mjs
import { InjectionToken } from "@angular/core";
var Logger = class {
};
var PLURAL_NAMES_TOKEN = new InjectionToken("@ngrx/data Plural Names");
var Pluralizer = class {
};

// src/dataservices/http-url-generator.mjs
import { Injectable as Injectable2 } from "@angular/core";
import * as i02 from "@angular/core";
var EntityHttpResourceUrls = class {
};
var HttpUrlGenerator = class {
};
var DefaultHttpUrlGenerator = class _DefaultHttpUrlGenerator {
  constructor(pluralizer) {
    this.pluralizer = pluralizer;
    this.knownHttpResourceUrls = {};
  }
  /**
   * Get or generate the entity and collection resource URLs for the given entity type name
   * @param entityName {string} Name of the entity type, e.g, 'Hero'
   * @param root {string} Root path to the resource, e.g., 'some-api`
   */
  getResourceUrls(entityName, root, trailingSlashEndpoints = false) {
    let resourceUrls = this.knownHttpResourceUrls[entityName];
    if (!resourceUrls) {
      const nRoot = trailingSlashEndpoints ? root : normalizeRoot(root);
      resourceUrls = {
        entityResourceUrl: `${nRoot}/${entityName}/`.toLowerCase(),
        collectionResourceUrl: `${nRoot}/${this.pluralizer.pluralize(entityName)}/`.toLowerCase()
      };
      this.registerHttpResourceUrls({ [entityName]: resourceUrls });
    }
    return resourceUrls;
  }
  /**
   * Create the path to a single entity resource
   * @param entityName {string} Name of the entity type, e.g, 'Hero'
   * @param root {string} Root path to the resource, e.g., 'some-api`
   * @returns complete path to resource, e.g, 'some-api/hero'
   */
  entityResource(entityName, root, trailingSlashEndpoints) {
    return this.getResourceUrls(entityName, root, trailingSlashEndpoints).entityResourceUrl;
  }
  /**
   * Create the path to a multiple entity (collection) resource
   * @param entityName {string} Name of the entity type, e.g, 'Hero'
   * @param root {string} Root path to the resource, e.g., 'some-api`
   * @returns complete path to resource, e.g, 'some-api/heroes'
   */
  collectionResource(entityName, root) {
    return this.getResourceUrls(entityName, root).collectionResourceUrl;
  }
  /**
   * Register known single-entity and collection resource URLs for HTTP calls
   * @param entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
   * Well-formed resource urls end in a '/';
   * Note: this method does not ensure that resource urls are well-formed.
   */
  registerHttpResourceUrls(entityHttpResourceUrls) {
    this.knownHttpResourceUrls = {
      ...this.knownHttpResourceUrls,
      ...entityHttpResourceUrls || {}
    };
  }
  static {
    this.ɵfac = i02.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i02, type: _DefaultHttpUrlGenerator, deps: [{ token: Pluralizer }], target: i02.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i02.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i02, type: _DefaultHttpUrlGenerator });
  }
};
i02.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i02, type: DefaultHttpUrlGenerator, decorators: [{
  type: Injectable2
}], ctorParameters: () => [{ type: Pluralizer }] });
function normalizeRoot(root) {
  return root.replace(/^[/\s]+|[/\s]+$/g, "");
}

// src/dataservices/default-data.service.mjs
import { Injectable as Injectable3, isDevMode, Optional } from "@angular/core";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { of, throwError } from "rxjs";
import { catchError, delay, map, timeout } from "rxjs/operators";
import * as i03 from "@angular/core";
import * as i1 from "@angular/common/http";
var DefaultDataService = class {
  get name() {
    return this._name;
  }
  constructor(entityName, http, httpUrlGenerator, config) {
    this.http = http;
    this.httpUrlGenerator = httpUrlGenerator;
    this.getDelay = 0;
    this.saveDelay = 0;
    this.timeout = 0;
    this.trailingSlashEndpoints = false;
    this._name = `${entityName} DefaultDataService`;
    this.entityName = entityName;
    const { root = "api", delete404OK = true, getDelay = 0, saveDelay = 0, timeout: to = 0, trailingSlashEndpoints = false } = config || {};
    this.delete404OK = delete404OK;
    this.entityUrl = httpUrlGenerator.entityResource(entityName, root, trailingSlashEndpoints);
    this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
    this.getDelay = getDelay;
    this.saveDelay = saveDelay;
    this.timeout = to;
  }
  add(entity, options) {
    const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
    return this.execute("POST", this.entityUrl, entityOrError, null, options);
  }
  delete(key, options) {
    let err;
    if (key == null) {
      err = new Error(`No "${this.entityName}" key to delete`);
    }
    return this.execute("DELETE", this.entityUrl + key, err, null, options).pipe(
      // forward the id of deleted entity as the result of the HTTP DELETE
      map((result) => key)
    );
  }
  getAll(options) {
    return this.execute("GET", this.entitiesUrl, null, null, options);
  }
  getById(key, options) {
    let err;
    if (key == null) {
      err = new Error(`No "${this.entityName}" key to get`);
    }
    return this.execute("GET", this.entityUrl + key, err, null, options);
  }
  getWithQuery(queryParams, options) {
    const qParams = typeof queryParams === "string" ? { fromString: queryParams } : { fromObject: queryParams };
    const params = new HttpParams(qParams);
    return this.execute("GET", this.entitiesUrl, void 0, { params }, options);
  }
  update(update, options) {
    const id = update && update.id;
    const updateOrError = id == null ? new Error(`No "${this.entityName}" update data or id`) : update.changes;
    return this.execute("PUT", this.entityUrl + id, updateOrError, null, options);
  }
  // Important! Only call if the backend service supports upserts as a POST to the target URL
  upsert(entity, options) {
    const entityOrError = entity || new Error(`No "${this.entityName}" entity to upsert`);
    return this.execute("POST", this.entityUrl, entityOrError, null, options);
  }
  execute(method, url, data, options, httpOptions) {
    let entityActionHttpClientOptions = void 0;
    if (httpOptions) {
      entityActionHttpClientOptions = {
        headers: httpOptions?.httpHeaders ? new HttpHeaders(httpOptions?.httpHeaders) : void 0,
        params: httpOptions?.httpParams ? new HttpParams(httpOptions?.httpParams) : void 0
      };
    }
    let mergedOptions = void 0;
    if (options || entityActionHttpClientOptions) {
      if (isDevMode() && options && entityActionHttpClientOptions) {
        console.warn("@ngrx/data: options.httpParams will be merged with queryParams when both are are provided to getWithQuery(). In the event of a conflict HttpOptions.httpParams will override queryParams`. The queryParams parameter of getWithQuery() will be removed in next major release.");
      }
      mergedOptions = {
        ...options,
        headers: entityActionHttpClientOptions?.headers ?? options?.headers,
        params: entityActionHttpClientOptions?.params ?? options?.params
      };
    }
    const req = {
      method,
      url,
      data,
      options: mergedOptions
    };
    if (data instanceof Error) {
      return this.handleError(req)(data);
    }
    let result$;
    switch (method) {
      case "DELETE": {
        result$ = this.http.delete(url, mergedOptions);
        if (this.saveDelay) {
          result$ = result$.pipe(delay(this.saveDelay));
        }
        break;
      }
      case "GET": {
        result$ = this.http.get(url, mergedOptions);
        if (this.getDelay) {
          result$ = result$.pipe(delay(this.getDelay));
        }
        break;
      }
      case "POST": {
        result$ = this.http.post(url, data, mergedOptions);
        if (this.saveDelay) {
          result$ = result$.pipe(delay(this.saveDelay));
        }
        break;
      }
      case "PUT": {
        result$ = this.http.put(url, data, mergedOptions);
        if (this.saveDelay) {
          result$ = result$.pipe(delay(this.saveDelay));
        }
        break;
      }
      default: {
        const error = new Error("Unimplemented HTTP method, " + method);
        result$ = throwError(error);
      }
    }
    if (this.timeout) {
      result$ = result$.pipe(timeout(this.timeout + this.saveDelay));
    }
    return result$.pipe(catchError(this.handleError(req)));
  }
  handleError(reqData) {
    return (err) => {
      const ok = this.handleDelete404(err, reqData);
      if (ok) {
        return ok;
      }
      const error = new DataServiceError(err, reqData);
      return throwError(error);
    };
  }
  handleDelete404(error, reqData) {
    if (error.status === 404 && reqData.method === "DELETE" && this.delete404OK) {
      return of({});
    }
    return void 0;
  }
};
var DefaultDataServiceFactory = class _DefaultDataServiceFactory {
  constructor(http, httpUrlGenerator, config) {
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
  create(entityName) {
    return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
  }
  static {
    this.ɵfac = i03.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i03, type: _DefaultDataServiceFactory, deps: [{ token: i1.HttpClient }, { token: HttpUrlGenerator }, { token: DefaultDataServiceConfig, optional: true }], target: i03.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i03.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i03, type: _DefaultDataServiceFactory });
  }
};
i03.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i03, type: DefaultDataServiceFactory, decorators: [{
  type: Injectable3
}], ctorParameters: () => [{ type: i1.HttpClient }, { type: HttpUrlGenerator }, { type: DefaultDataServiceConfig, decorators: [{
  type: Optional
}] }] });

// src/entity-metadata/entity-definition.mjs
import { createEntityAdapter } from "@ngrx/entity";
function createEntityDefinition(metadata) {
  let entityName = metadata.entityName;
  if (!entityName) {
    throw new Error("Missing required entityName");
  }
  metadata.entityName = entityName = entityName.trim();
  const selectId = metadata.selectId || defaultSelectId;
  const sortComparer = metadata.sortComparer = metadata.sortComparer || false;
  const entityAdapter = createEntityAdapter({ selectId, sortComparer });
  const entityDispatcherOptions = metadata.entityDispatcherOptions || {};
  const initialState = entityAdapter.getInitialState({
    entityName,
    filter: "",
    loaded: false,
    loading: false,
    changeState: {},
    ...metadata.additionalCollectionState || {}
  });
  const noChangeTracking = metadata.noChangeTracking === true;
  return {
    entityName,
    entityAdapter,
    entityDispatcherOptions,
    initialState,
    metadata,
    noChangeTracking,
    selectId,
    sortComparer
  };
}

// src/entity-metadata/entity-metadata.mjs
import { InjectionToken as InjectionToken2 } from "@angular/core";
var ENTITY_METADATA_TOKEN = new InjectionToken2("@ngrx/data Entity Metadata");

// src/entity-metadata/entity-definition.service.mjs
import { Inject, Injectable as Injectable4, Optional as Optional2 } from "@angular/core";
import * as i04 from "@angular/core";
var EntityDefinitionService = class _EntityDefinitionService {
  constructor(entityMetadataMaps) {
    this.definitions = {};
    if (entityMetadataMaps) {
      entityMetadataMaps.forEach((map6) => this.registerMetadataMap(map6));
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
  getDefinition(entityName, shouldThrow = true) {
    entityName = entityName.trim();
    const definition = this.definitions[entityName];
    if (!definition && shouldThrow) {
      throw new Error(`No EntityDefinition for entity type "${entityName}".`);
    }
    return definition;
  }
  //////// Registration methods //////////
  /**
   * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
   * @param name - the name of the entity type
   * @param definition - {EntityMetadata} for a collection for that entity type
   *
   * Examples:
   *   registerMetadata(myHeroEntityDefinition);
   */
  registerMetadata(metadata) {
    if (metadata) {
      const definition = createEntityDefinition(metadata);
      this.registerDefinition(definition);
    }
  }
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
  registerMetadataMap(metadataMap = {}) {
    Object.keys(metadataMap || {}).forEach((entityName) => this.registerMetadata({ entityName, ...metadataMap[entityName] }));
  }
  /**
   * Register an {EntityDefinition} for an entity type
   * @param definition - EntityDefinition of a collection for that entity type
   *
   * Examples:
   *   registerDefinition('Hero', myHeroEntityDefinition);
   */
  registerDefinition(definition) {
    this.definitions[definition.entityName] = definition;
  }
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
  registerDefinitions(definitions) {
    Object.assign(this.definitions, definitions);
  }
  static {
    this.ɵfac = i04.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i04, type: _EntityDefinitionService, deps: [{ token: ENTITY_METADATA_TOKEN, optional: true }], target: i04.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i04.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i04, type: _EntityDefinitionService });
  }
};
i04.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i04, type: EntityDefinitionService, decorators: [{
  type: Injectable4
}], ctorParameters: () => [{ type: void 0, decorators: [{
  type: Optional2
}, {
  type: Inject,
  args: [ENTITY_METADATA_TOKEN]
}] }] });

// src/dataservices/entity-cache-data.service.mjs
import { Injectable as Injectable5, Optional as Optional3 } from "@angular/core";
import { throwError as throwError2 } from "rxjs";
import { catchError as catchError2, delay as delay2, map as map2, timeout as timeout2 } from "rxjs/operators";
import * as i05 from "@angular/core";
import * as i2 from "@angular/common/http";
var updateOp = ChangeSetOperation.Update;
var EntityCacheDataService = class _EntityCacheDataService {
  constructor(entityDefinitionService, http, config) {
    this.entityDefinitionService = entityDefinitionService;
    this.http = http;
    this.idSelectors = {};
    this.saveDelay = 0;
    this.timeout = 0;
    const { saveDelay = 0, timeout: to = 0 } = config || {};
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
  saveEntities(changeSet, url) {
    changeSet = this.filterChangeSet(changeSet);
    changeSet = this.flattenUpdates(changeSet);
    let result$ = this.http.post(url, changeSet).pipe(map2((result) => this.restoreUpdates(result)), catchError2(this.handleError({ method: "POST", url, data: changeSet })));
    if (this.timeout) {
      result$ = result$.pipe(timeout2(this.timeout));
    }
    if (this.saveDelay) {
      result$ = result$.pipe(delay2(this.saveDelay));
    }
    return result$;
  }
  // #region helpers
  handleError(reqData) {
    return (err) => {
      const error = new DataServiceError(err, reqData);
      return throwError2(error);
    };
  }
  /**
   * Filter changeSet to remove unwanted ChangeSetItems.
   * This implementation excludes null and empty ChangeSetItems.
   * @param changeSet ChangeSet with changes to filter
   */
  filterChangeSet(changeSet) {
    return excludeEmptyChangeSetItems(changeSet);
  }
  /**
   * Convert the entities in update changes from @ngrx Update<T> structure to just T.
   * Reverse of restoreUpdates().
   */
  flattenUpdates(changeSet) {
    let changes = changeSet.changes;
    if (changes.length === 0) {
      return changeSet;
    }
    let hasMutated = false;
    changes = changes.map((item) => {
      if (item.op === updateOp && item.entities.length > 0) {
        hasMutated = true;
        return {
          ...item,
          entities: item.entities.map((u) => u.changes)
        };
      } else {
        return item;
      }
    });
    return hasMutated ? { ...changeSet, changes } : changeSet;
  }
  /**
   * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
   * Reverse of flattenUpdates().
   */
  restoreUpdates(changeSet) {
    if (changeSet == null) {
      return changeSet;
    }
    let changes = changeSet.changes;
    if (changes.length === 0) {
      return changeSet;
    }
    let hasMutated = false;
    changes = changes.map((item) => {
      if (item.op === updateOp) {
        hasMutated = true;
        const selectId = this.getIdSelector(item.entityName);
        return {
          ...item,
          entities: item.entities.map((u) => ({
            id: selectId(u),
            changes: u
          }))
        };
      } else {
        return item;
      }
    });
    return hasMutated ? { ...changeSet, changes } : changeSet;
  }
  /**
   * Get the id (primary key) selector function for an entity type
   * @param entityName name of the entity type
   */
  getIdSelector(entityName) {
    let idSelector = this.idSelectors[entityName];
    if (!idSelector) {
      idSelector = this.entityDefinitionService.getDefinition(entityName).selectId;
      this.idSelectors[entityName] = idSelector;
    }
    return idSelector;
  }
  static {
    this.ɵfac = i05.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i05, type: _EntityCacheDataService, deps: [{ token: EntityDefinitionService }, { token: i2.HttpClient }, { token: DefaultDataServiceConfig, optional: true }], target: i05.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i05.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i05, type: _EntityCacheDataService });
  }
};
i05.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i05, type: EntityCacheDataService, decorators: [{
  type: Injectable5
}], ctorParameters: () => [{ type: EntityDefinitionService }, { type: i2.HttpClient }, { type: DefaultDataServiceConfig, decorators: [{
  type: Optional3
}] }] });

// src/dataservices/entity-data.service.mjs
import { Injectable as Injectable6 } from "@angular/core";
import * as i06 from "@angular/core";
var EntityDataService = class _EntityDataService {
  // TODO:  Optionally inject specialized entity data services
  // for those that aren't derived from BaseDataService.
  constructor(defaultDataServiceFactory) {
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
  getService(entityName) {
    entityName = entityName.trim();
    let service = this.services[entityName];
    if (!service) {
      service = this.defaultDataServiceFactory.create(entityName);
      this.services[entityName] = service;
    }
    return service;
  }
  /**
   * Register an EntityCollectionDataService for an entity type
   * @param entityName - the name of the entity type
   * @param service - data service for that entity type
   *
   * Examples:
   *   registerService('Hero', myHeroDataService);
   *   registerService('Villain', myVillainDataService);
   */
  registerService(entityName, service) {
    this.services[entityName.trim()] = service;
  }
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
  registerServices(services) {
    this.services = { ...this.services, ...services };
  }
  static {
    this.ɵfac = i06.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i06, type: _EntityDataService, deps: [{ token: DefaultDataServiceFactory }], target: i06.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i06.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i06, type: _EntityDataService });
  }
};
i06.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i06, type: EntityDataService, decorators: [{
  type: Injectable6
}], ctorParameters: () => [{ type: DefaultDataServiceFactory }] });

// src/dataservices/persistence-result-handler.service.mjs
import { Injectable as Injectable7 } from "@angular/core";
import * as i07 from "@angular/core";
var PersistenceResultHandler = class {
};
var DefaultPersistenceResultHandler = class _DefaultPersistenceResultHandler {
  constructor(logger, entityActionFactory) {
    this.logger = logger;
    this.entityActionFactory = entityActionFactory;
  }
  /** Handle successful result of persistence operation on an EntityAction */
  handleSuccess(originalAction) {
    const successOp = makeSuccessOp(originalAction.payload.entityOp);
    return (data) => this.entityActionFactory.createFromAction(originalAction, {
      entityOp: successOp,
      data
    });
  }
  /** Handle error result of persistence operation on an EntityAction */
  handleError(originalAction) {
    const errorOp = makeErrorOp(originalAction.payload.entityOp);
    return (err) => {
      const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
      const errorData = { error, originalAction };
      this.logger.error(errorData);
      const action = this.entityActionFactory.createFromAction(originalAction, {
        entityOp: errorOp,
        data: errorData
      });
      return action;
    };
  }
  static {
    this.ɵfac = i07.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i07, type: _DefaultPersistenceResultHandler, deps: [{ token: Logger }, { token: EntityActionFactory }], target: i07.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i07.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i07, type: _DefaultPersistenceResultHandler });
  }
};
i07.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i07, type: DefaultPersistenceResultHandler, decorators: [{
  type: Injectable7
}], ctorParameters: () => [{ type: Logger }, { type: EntityActionFactory }] });

// src/dispatchers/entity-dispatcher.mjs
var PersistanceCanceled = class {
  constructor(message) {
    this.message = message;
    this.message = message || "Canceled by user";
  }
};

// src/utils/correlation-id-generator.mjs
import { Injectable as Injectable8 } from "@angular/core";
import * as i08 from "@angular/core";
var CorrelationIdGenerator = class _CorrelationIdGenerator {
  constructor() {
    this.seed = 0;
    this.prefix = "CRID";
  }
  /** Return the next correlation id */
  next() {
    this.seed += 1;
    return this.prefix + this.seed;
  }
  static {
    this.ɵfac = i08.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i08, type: _CorrelationIdGenerator, deps: [], target: i08.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i08.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i08, type: _CorrelationIdGenerator });
  }
};
i08.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i08, type: CorrelationIdGenerator, decorators: [{
  type: Injectable8
}] });

// src/dispatchers/entity-dispatcher-default-options.mjs
import { Injectable as Injectable9 } from "@angular/core";
import * as i09 from "@angular/core";
var EntityDispatcherDefaultOptions = class _EntityDispatcherDefaultOptions {
  constructor() {
    this.optimisticAdd = false;
    this.optimisticDelete = true;
    this.optimisticUpdate = false;
    this.optimisticUpsert = false;
    this.optimisticSaveEntities = false;
  }
  static {
    this.ɵfac = i09.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i09, type: _EntityDispatcherDefaultOptions, deps: [], target: i09.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i09.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i09, type: _EntityDispatcherDefaultOptions });
  }
};
i09.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i09, type: EntityDispatcherDefaultOptions, decorators: [{
  type: Injectable9
}] });

// src/dispatchers/entity-cache-dispatcher.mjs
import { Injectable as Injectable10, Inject as Inject2 } from "@angular/core";
import { ScannedActionsSubject } from "@ngrx/store";
import { of as of2, throwError as throwError3 } from "rxjs";
import { filter as filter2, mergeMap, shareReplay, take } from "rxjs/operators";
import * as i010 from "@angular/core";
import * as i3 from "@ngrx/store";
import * as i4 from "rxjs";
var EntityCacheDispatcher = class _EntityCacheDispatcher {
  constructor(correlationIdGenerator, defaultDispatcherOptions, scannedActions$, store) {
    this.correlationIdGenerator = correlationIdGenerator;
    this.defaultDispatcherOptions = defaultDispatcherOptions;
    this.store = store;
    this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
    this.raSubscription = this.reducedActions$.subscribe();
  }
  /**
   * Dispatch an Action to the store.
   * @param action the Action
   * @returns the dispatched Action
   */
  dispatch(action) {
    this.store.dispatch(action);
    return action;
  }
  /**
   * Dispatch action to cancel the saveEntities request with matching correlation id.
   * @param correlationId The correlation id for the corresponding action
   * @param [reason] explains why canceled and by whom.
   * @param [entityNames] array of entity names so can turn off loading flag for their collections.
   * @param [tag] tag to identify the operation from the app perspective.
   */
  cancelSaveEntities(correlationId, reason, entityNames, tag) {
    if (!correlationId) {
      throw new Error("Missing correlationId");
    }
    const action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
    this.dispatch(action);
  }
  /** Clear the named entity collections in cache
   * @param [collections] Array of names of the collections to clear.
   * If empty array, does nothing. If null/undefined/no array, clear all collections.
   * @param [tag] tag to identify the operation from the app perspective.
   */
  clearCollections(collections, tag) {
    this.dispatch(new ClearCollections(collections, tag));
  }
  /**
   * Load multiple entity collections at the same time.
   * before any selectors$ observables emit.
   * @param collections The collections to load, typically the result of a query.
   * @param [tag] tag to identify the operation from the app perspective.
   * in the form of a map of entity collections.
   */
  loadCollections(collections, tag) {
    this.dispatch(new LoadCollections(collections, tag));
  }
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
  mergeQuerySet(querySet, mergeStrategy, tag) {
    this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
  }
  /**
   * Create entity cache action for replacing the entire entity cache.
   * Dangerous because brute force but useful as when re-hydrating an EntityCache
   * from local browser storage when the application launches.
   * @param cache New state of the entity cache
   * @param [tag] tag to identify the operation from the app perspective.
   */
  setEntityCache(cache, tag) {
    this.dispatch(new SetEntityCache(cache, tag));
  }
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
  saveEntities(changes, url, options) {
    const changeSet = Array.isArray(changes) ? { changes } : changes;
    options = options || {};
    const correlationId = options.correlationId == null ? this.correlationIdGenerator.next() : options.correlationId;
    const isOptimistic = options.isOptimistic == null ? this.defaultDispatcherOptions.optimisticSaveEntities || false : options.isOptimistic === true;
    const tag = options.tag || "Save Entities";
    options = { ...options, correlationId, isOptimistic, tag };
    const action = new SaveEntities(changeSet, url, options);
    this.dispatch(action);
    return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
  }
  /**
   * Return Observable of data from the server-success SaveEntities action with
   * the given Correlation Id, after that action was processed by the ngrx store.
   * or else put the server error on the Observable error channel.
   * @param crid The correlationId for both the save and response actions.
   */
  getSaveEntitiesResponseData$(crid) {
    return this.reducedActions$.pipe(filter2((act) => act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS || act.type === EntityCacheAction.SAVE_ENTITIES_ERROR || act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL), filter2((act) => crid === act.payload.correlationId), take(1), mergeMap((act) => {
      return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL ? throwError3(new PersistanceCanceled(act.payload.reason)) : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ? of2(act.payload.changeSet) : throwError3(act.payload);
    }));
  }
  static {
    this.ɵfac = i010.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i010, type: _EntityCacheDispatcher, deps: [{ token: CorrelationIdGenerator }, { token: EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: i3.Store }], target: i010.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i010.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i010, type: _EntityCacheDispatcher });
  }
};
i010.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i010, type: EntityCacheDispatcher, decorators: [{
  type: Injectable10
}], ctorParameters: () => [{ type: CorrelationIdGenerator }, { type: EntityDispatcherDefaultOptions }, { type: i4.Observable, decorators: [{
  type: Inject2,
  args: [ScannedActionsSubject]
}] }, { type: i3.Store }] });

// src/dispatchers/entity-dispatcher-base.mjs
import { createSelector } from "@ngrx/store";
import { of as of3, throwError as throwError4 } from "rxjs";
import { filter as filter3, map as map3, mergeMap as mergeMap2, shareReplay as shareReplay2, withLatestFrom, take as take2 } from "rxjs/operators";
var EntityDispatcherBase = class {
  constructor(entityName, entityActionFactory, store, selectId = defaultSelectId, defaultDispatcherOptions, reducedActions$, entityCacheSelector, correlationIdGenerator) {
    this.entityName = entityName;
    this.entityActionFactory = entityActionFactory;
    this.store = store;
    this.selectId = selectId;
    this.defaultDispatcherOptions = defaultDispatcherOptions;
    this.reducedActions$ = reducedActions$;
    this.correlationIdGenerator = correlationIdGenerator;
    this.guard = new EntityActionGuard(entityName, selectId);
    this.toUpdate = toUpdateFactory(selectId);
    const collectionSelector = createSelector(entityCacheSelector, (cache) => cache[entityName]);
    this.entityCollection$ = store.select(collectionSelector);
  }
  /**
   * Create an {EntityAction} for this entity type.
   * @param entityOp {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the EntityAction
   */
  createEntityAction(entityOp, data, options) {
    return this.entityActionFactory.create({
      entityName: this.entityName,
      entityOp,
      data,
      ...options
    });
  }
  /**
   * Create an {EntityAction} for this entity type and
   * dispatch it immediately to the store.
   * @param op {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the dispatched EntityAction
   */
  createAndDispatch(op, data, options) {
    const action = this.createEntityAction(op, data, options);
    this.dispatch(action);
    return action;
  }
  /**
   * Dispatch an Action to the store.
   * @param action the Action
   * @returns the dispatched Action
   */
  dispatch(action) {
    this.store.dispatch(action);
    return action;
  }
  // #region Query and save operations
  /**
   * Dispatch action to save a new entity to remote storage.
   * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
   * must have a key if optimistic save.
   * @returns A terminating Observable of the entity
   * after server reports successful save or the save error.
   */
  add(entity, options) {
    options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
    const action = this.createEntityAction(EntityOp.SAVE_ADD_ONE, entity, options);
    if (options.isOptimistic) {
      this.guard.mustBeEntity(action);
    }
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(
      // Use the returned entity data's id to get the entity from the collection
      // as it might be different from the entity returned from the server.
      withLatestFrom(this.entityCollection$),
      map3(([e, collection]) => collection.entities[this.selectId(e)]),
      shareReplay2(1)
    );
  }
  /**
   * Dispatch action to cancel the persistence operation (query or save).
   * Will cause save observable to error with a PersistenceCancel error.
   * Caller is responsible for undoing changes in cache from pending optimistic save
   * @param correlationId The correlation id for the corresponding EntityAction
   * @param [reason] explains why canceled and by whom.
   */
  cancel(correlationId, reason, options) {
    if (!correlationId) {
      throw new Error("Missing correlationId");
    }
    this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId });
  }
  delete(arg, options) {
    options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
    const key = this.getKey(arg);
    const action = this.createEntityAction(EntityOp.SAVE_DELETE_ONE, key, options);
    this.guard.mustBeKey(action);
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(map3(() => key), shareReplay2(1));
  }
  /**
   * Dispatch action to query remote storage for all entities and
   * merge the queried entities into the cached collection.
   * @returns A terminating Observable of the queried entities that are in the collection
   * after server reports success query or the query error.
   * @see load()
   */
  getAll(options) {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(
      // Use the returned entity ids to get the entities from the collection
      // as they might be different from the entities returned from the server
      // because of unsaved changes (deletes or updates).
      withLatestFrom(this.entityCollection$),
      map3(([entities, collection]) => entities.reduce((acc, e) => {
        const entity = collection.entities[this.selectId(e)];
        if (entity) {
          acc.push(entity);
        }
        return acc;
      }, [])),
      shareReplay2(1)
    );
  }
  /**
   * Dispatch action to query remote storage for the entity with this primary key.
   * If the server returns an entity,
   * merge it into the cached collection.
   * @returns A terminating Observable of the collection
   * after server reports successful query or the query error.
   */
  getByKey(key, options) {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(
      // Use the returned entity data's id to get the entity from the collection
      // as it might be different from the entity returned from the server.
      withLatestFrom(this.entityCollection$),
      map3(([entity, collection]) => collection.entities[this.selectId(entity)]),
      shareReplay2(1)
    );
  }
  /**
   * Dispatch action to query remote storage for the entities that satisfy a query expressed
   * with either a query parameter map or an HTTP URL query string,
   * and merge the results into the cached collection.
   * @param queryParams the query in a form understood by the server
   * @returns A terminating Observable of the queried entities
   * after server reports successful query or the query error.
   */
  getWithQuery(queryParams, options) {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(
      // Use the returned entity ids to get the entities from the collection
      // as they might be different from the entities returned from the server
      // because of unsaved changes (deletes or updates).
      withLatestFrom(this.entityCollection$),
      map3(([entities, collection]) => entities.reduce((acc, e) => {
        const entity = collection.entities[this.selectId(e)];
        if (entity) {
          acc.push(entity);
        }
        return acc;
      }, [])),
      shareReplay2(1)
    );
  }
  /**
   * Dispatch action to query remote storage for all entities and
   * completely replace the cached collection with the queried entities.
   * @returns A terminating Observable of the entities in the collection
   * after server reports successful query or the query error.
   * @see getAll
   */
  load(options) {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_LOAD, null, options);
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(shareReplay2(1));
  }
  /**
   * Dispatch action to query remote storage for the entities that satisfy a query expressed
   * with either a query parameter map or an HTTP URL query string,
   * and completely replace the cached collection with the queried entities.
   * @param queryParams the query in a form understood by the server
   * @param [options] options that influence load behavior
   * @returns A terminating Observable of the queried entities
   * after server reports successful query or the query error.
   */
  loadWithQuery(queryParams, options) {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(shareReplay2(1));
  }
  /**
   * Dispatch action to save the updated entity (or partial entity) in remote storage.
   * The update entity may be partial (but must have its key)
   * in which case it patches the existing entity.
   * @param entity update entity, which might be a partial of T but must at least have its key.
   * @returns A terminating Observable of the updated entity
   * after server reports successful save or the save error.
   */
  update(entity, options) {
    const update = this.toUpdate(entity);
    options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
    const action = this.createEntityAction(EntityOp.SAVE_UPDATE_ONE, update, options);
    if (options.isOptimistic) {
      this.guard.mustBeUpdate(action);
    }
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(
      // Use the update entity data id to get the entity from the collection
      // as might be different from the entity returned from the server
      // because the id changed or there are unsaved changes.
      map3((updateData) => updateData.changes),
      withLatestFrom(this.entityCollection$),
      map3(([e, collection]) => collection.entities[this.selectId(e)]),
      shareReplay2(1)
    );
  }
  /**
   * Dispatch action to save a new or existing entity to remote storage.
   * Only dispatch this action if your server supports upsert.
   * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
   * must have a key if optimistic save.
   * @returns A terminating Observable of the entity
   * after server reports successful save or the save error.
   */
  upsert(entity, options) {
    options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
    const action = this.createEntityAction(EntityOp.SAVE_UPSERT_ONE, entity, options);
    if (options.isOptimistic) {
      this.guard.mustBeEntity(action);
    }
    this.dispatch(action);
    return this.getResponseData$(options.correlationId).pipe(
      // Use the returned entity data's id to get the entity from the collection
      // as it might be different from the entity returned from the server.
      withLatestFrom(this.entityCollection$),
      map3(([e, collection]) => collection.entities[this.selectId(e)]),
      shareReplay2(1)
    );
  }
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
  addAllToCache(entities, options) {
    this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
  }
  /**
   * Add a new entity directly to the cache.
   * Does not save to remote storage.
   * Ignored if an entity with the same primary key is already in cache.
   */
  addOneToCache(entity, options) {
    this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
  }
  /**
   * Add multiple new entities directly to the cache.
   * Does not save to remote storage.
   * Entities with primary keys already in cache are ignored.
   */
  addManyToCache(entities, options) {
    this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
  }
  /** Clear the cached entity collection */
  clearCache(options) {
    this.createAndDispatch(EntityOp.REMOVE_ALL, void 0, options);
  }
  removeOneFromCache(arg, options) {
    this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
  }
  removeManyFromCache(args, options) {
    if (!args || args.length === 0) {
      return;
    }
    const keys = typeof args[0] === "object" ? (
      // if array[0] is a key, assume they're all keys
      args.map((arg) => this.getKey(arg))
    ) : args;
    this.createAndDispatch(EntityOp.REMOVE_MANY, keys, options);
  }
  /**
   * Update a cached entity directly.
   * Does not update that entity in remote storage.
   * Ignored if an entity with matching primary key is not in cache.
   * The update entity may be partial (but must have its key)
   * in which case it patches the existing entity.
   */
  updateOneInCache(entity, options) {
    const update = this.toUpdate(entity);
    this.createAndDispatch(EntityOp.UPDATE_ONE, update, options);
  }
  /**
   * Update multiple cached entities directly.
   * Does not update these entities in remote storage.
   * Entities whose primary keys are not in cache are ignored.
   * Update entities may be partial but must at least have their keys.
   * such partial entities patch their cached counterparts.
   */
  updateManyInCache(entities, options) {
    if (!entities || entities.length === 0) {
      return;
    }
    const updates = entities.map((entity) => this.toUpdate(entity));
    this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
  }
  /**
   * Add or update a new entity directly to the cache.
   * Does not save to remote storage.
   * Upsert entity might be a partial of T but must at least have its key.
   * Pass the Update<T> structure as the payload
   */
  upsertOneInCache(entity, options) {
    this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
  }
  /**
   * Add or update multiple cached entities directly.
   * Does not save to remote storage.
   */
  upsertManyInCache(entities, options) {
    if (!entities || entities.length === 0) {
      return;
    }
    this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
  }
  /**
   * Set the pattern that the collection's filter applies
   * when using the `filteredEntities` selector.
   */
  setFilter(pattern) {
    this.createAndDispatch(EntityOp.SET_FILTER, pattern);
  }
  /** Set the loaded flag */
  setLoaded(isLoaded) {
    this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
  }
  /** Set the loading flag */
  setLoading(isLoading) {
    this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
  }
  // #endregion Cache-only operations that do not update remote storage
  // #region private helpers
  /** Get key from entity (unless arg is already a key) */
  getKey(arg) {
    return typeof arg === "object" ? this.selectId(arg) : arg;
  }
  /**
   * Return Observable of data from the server-success EntityAction with
   * the given Correlation Id, after that action was processed by the ngrx store.
   * or else put the server error on the Observable error channel.
   * @param crid The correlationId for both the save and response actions.
   */
  getResponseData$(crid) {
    return this.reducedActions$.pipe(filter3((act) => !!act.payload), filter3((act) => {
      const { correlationId, entityName, entityOp } = act.payload;
      return entityName === this.entityName && correlationId === crid && (entityOp.endsWith(OP_SUCCESS) || entityOp.endsWith(OP_ERROR) || entityOp === EntityOp.CANCEL_PERSIST);
    }), take2(1), mergeMap2((act) => {
      const { entityOp } = act.payload;
      return entityOp === EntityOp.CANCEL_PERSIST ? throwError4(new PersistanceCanceled(act.payload.data)) : entityOp.endsWith(OP_SUCCESS) ? of3(act.payload.data) : throwError4(act.payload.data.error);
    }));
  }
  setQueryEntityActionOptions(options) {
    options = options || {};
    const correlationId = options.correlationId == null ? this.correlationIdGenerator.next() : options.correlationId;
    return { ...options, correlationId };
  }
  setSaveEntityActionOptions(options, defaultOptimism) {
    options = options || {};
    const correlationId = options.correlationId == null ? this.correlationIdGenerator.next() : options.correlationId;
    const isOptimistic = options.isOptimistic == null ? defaultOptimism || false : options.isOptimistic === true;
    return { ...options, correlationId, isOptimistic };
  }
};

// src/reducers/constants.mjs
import { InjectionToken as InjectionToken3 } from "@angular/core";
var ENTITY_CACHE_NAME = "entityCache";
var ENTITY_CACHE_NAME_TOKEN = new InjectionToken3("@ngrx/data Entity Cache Name");
var ENTITY_CACHE_META_REDUCERS = new InjectionToken3("@ngrx/data Entity Cache Meta Reducers");
var ENTITY_COLLECTION_META_REDUCERS = new InjectionToken3("@ngrx/data Entity Collection Meta Reducers");
var INITIAL_ENTITY_CACHE_STATE = new InjectionToken3("@ngrx/data Initial Entity Cache State");

// src/selectors/entity-cache-selector.mjs
import { InjectionToken as InjectionToken4, Optional as Optional4 } from "@angular/core";
import { createFeatureSelector } from "@ngrx/store";
var ENTITY_CACHE_SELECTOR_TOKEN = new InjectionToken4("@ngrx/data Entity Cache Selector");
var entityCacheSelectorProvider = {
  provide: ENTITY_CACHE_SELECTOR_TOKEN,
  useFactory: createEntityCacheSelector,
  deps: [[new Optional4(), ENTITY_CACHE_NAME_TOKEN]]
};
function createEntityCacheSelector(entityCacheName) {
  entityCacheName = entityCacheName || ENTITY_CACHE_NAME;
  return createFeatureSelector(entityCacheName);
}

// src/dispatchers/entity-dispatcher-factory.mjs
import { Inject as Inject3, Injectable as Injectable11 } from "@angular/core";
import { ScannedActionsSubject as ScannedActionsSubject2 } from "@ngrx/store";
import { shareReplay as shareReplay3 } from "rxjs/operators";
import * as i011 from "@angular/core";
import * as i22 from "@ngrx/store";
import * as i5 from "rxjs";
var EntityDispatcherFactory = class _EntityDispatcherFactory {
  constructor(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
    this.entityActionFactory = entityActionFactory;
    this.store = store;
    this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
    this.entityCacheSelector = entityCacheSelector;
    this.correlationIdGenerator = correlationIdGenerator;
    this.reducedActions$ = scannedActions$.pipe(shareReplay3(1));
    this.raSubscription = this.reducedActions$.subscribe();
  }
  /**
   * Create an `EntityDispatcher` for an entity type `T` and store.
   */
  create(entityName, selectId = defaultSelectId, defaultOptions = {}) {
    const options = {
      ...this.entityDispatcherDefaultOptions,
      ...defaultOptions
    };
    return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
  }
  ngOnDestroy() {
    this.raSubscription.unsubscribe();
  }
  static {
    this.ɵfac = i011.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i011, type: _EntityDispatcherFactory, deps: [{ token: EntityActionFactory }, { token: i22.Store }, { token: EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject2 }, { token: ENTITY_CACHE_SELECTOR_TOKEN }, { token: CorrelationIdGenerator }], target: i011.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i011.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i011, type: _EntityDispatcherFactory });
  }
};
i011.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i011, type: EntityDispatcherFactory, decorators: [{
  type: Injectable11
}], ctorParameters: () => [{ type: EntityActionFactory }, { type: i22.Store }, { type: EntityDispatcherDefaultOptions }, { type: i5.Observable, decorators: [{
  type: Inject3,
  args: [ScannedActionsSubject2]
}] }, { type: void 0, decorators: [{
  type: Inject3,
  args: [ENTITY_CACHE_SELECTOR_TOKEN]
}] }, { type: CorrelationIdGenerator }] });

// src/effects/entity-effects-scheduler.mjs
import { InjectionToken as InjectionToken5 } from "@angular/core";
var ENTITY_EFFECTS_SCHEDULER = new InjectionToken5("@ngrx/data Entity Effects Scheduler");

// src/effects/entity-cache-effects.mjs
import { Inject as Inject4, Injectable as Injectable12, Optional as Optional5 } from "@angular/core";
import { ofType, createEffect } from "@ngrx/effects";
import { asyncScheduler, of as of4, merge, race } from "rxjs";
import { concatMap, catchError as catchError3, delay as delay3, filter as filter4, map as map4, mergeMap as mergeMap3 } from "rxjs/operators";
import * as i012 from "@angular/core";
import * as i12 from "@ngrx/effects";
var EntityCacheEffects = class _EntityCacheEffects {
  constructor(actions, dataService, entityActionFactory, logger, scheduler) {
    this.actions = actions;
    this.dataService = dataService;
    this.entityActionFactory = entityActionFactory;
    this.logger = logger;
    this.scheduler = scheduler;
    this.responseDelay = 10;
    this.saveEntitiesCancel$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter4((a) => a.payload.correlationId != null)), { dispatch: false });
    this.saveEntities$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap3((action) => this.saveEntities(action))));
  }
  /**
   * Perform the requested SaveEntities actions and return a scalar Observable<Action>
   * that the effect should dispatch to the store after the server responds.
   * @param action The SaveEntities action
   */
  saveEntities(action) {
    const error = action.payload.error;
    if (error) {
      return this.handleSaveEntitiesError$(action)(error);
    }
    try {
      const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
      const { correlationId, mergeStrategy, tag, url } = action.payload;
      const options = { correlationId, mergeStrategy, tag };
      if (changeSet.changes.length === 0) {
        return of4(new SaveEntitiesSuccess(changeSet, url, options));
      }
      const c = this.saveEntitiesCancel$.pipe(filter4((a) => correlationId === a.payload.correlationId), map4((a) => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
      const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((result) => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), catchError3(this.handleSaveEntitiesError$(action)));
      return race(c, d);
    } catch (err) {
      return this.handleSaveEntitiesError$(action)(err);
    }
  }
  /** return handler of error result of saveEntities, returning a scalar observable of error action */
  handleSaveEntitiesError$(action) {
    return (err) => {
      const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
      return of4(new SaveEntitiesError(error, action)).pipe(delay3(this.responseDelay, this.scheduler || asyncScheduler));
    };
  }
  /** return handler of the ChangeSet result of successful saveEntities() */
  handleSaveEntitiesSuccess$(action, entityActionFactory) {
    const { url, correlationId, mergeStrategy, tag } = action.payload;
    const options = { correlationId, mergeStrategy, tag };
    return (changeSet) => {
      if (changeSet) {
        return of4(new SaveEntitiesSuccess(changeSet, url, options));
      }
      changeSet = action.payload.changeSet;
      if (!action.payload.isOptimistic) {
        return of4(new SaveEntitiesSuccess(changeSet, url, options));
      }
      const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1 ? acc.concat(item.entityName) : acc, []);
      return merge(entityNames.map((name) => entityActionFactory.create(name, EntityOp.SET_LOADING, false)));
    };
  }
  static {
    this.ɵfac = i012.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i012, type: _EntityCacheEffects, deps: [{ token: i12.Actions }, { token: EntityCacheDataService }, { token: EntityActionFactory }, { token: Logger }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i012.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i012.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i012, type: _EntityCacheEffects });
  }
};
i012.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i012, type: EntityCacheEffects, decorators: [{
  type: Injectable12
}], ctorParameters: () => [{ type: i12.Actions }, { type: EntityCacheDataService }, { type: EntityActionFactory }, { type: Logger }, { type: void 0, decorators: [{
  type: Optional5
}, {
  type: Inject4,
  args: [ENTITY_EFFECTS_SCHEDULER]
}] }] });

// src/effects/entity-effects.mjs
import { Inject as Inject5, Injectable as Injectable13, Optional as Optional6 } from "@angular/core";
import { createEffect as createEffect2 } from "@ngrx/effects";
import { asyncScheduler as asyncScheduler2, of as of5, race as race2 } from "rxjs";
import { catchError as catchError4, delay as delay4, filter as filter5, map as map5, mergeMap as mergeMap4 } from "rxjs/operators";
import * as i013 from "@angular/core";
import * as i13 from "@ngrx/effects";
var persistOps = [
  EntityOp.QUERY_ALL,
  EntityOp.QUERY_LOAD,
  EntityOp.QUERY_BY_KEY,
  EntityOp.QUERY_MANY,
  EntityOp.SAVE_ADD_ONE,
  EntityOp.SAVE_DELETE_ONE,
  EntityOp.SAVE_UPDATE_ONE,
  EntityOp.SAVE_UPSERT_ONE
];
var EntityEffects = class _EntityEffects {
  constructor(actions, dataService, entityActionFactory, resultHandler, scheduler) {
    this.actions = actions;
    this.dataService = dataService;
    this.entityActionFactory = entityActionFactory;
    this.resultHandler = resultHandler;
    this.scheduler = scheduler;
    this.responseDelay = 10;
    this.cancel$ = createEffect2(() => this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map5((action) => action.payload.correlationId), filter5((id) => id != null)), { dispatch: false });
    this.persist$ = createEffect2(() => this.actions.pipe(ofEntityOp(persistOps), mergeMap4((action) => this.persist(action))));
  }
  /**
   * Perform the requested persistence operation and return a scalar Observable<Action>
   * that the effect should dispatch to the store after the server responds.
   * @param action A persistence operation EntityAction
   */
  persist(action) {
    if (action.payload.skip) {
      return this.handleSkipSuccess$(action);
    }
    if (action.payload.error) {
      return this.handleError$(action)(action.payload.error);
    }
    try {
      const c = this.cancel$.pipe(filter5((id) => action.payload.correlationId === id), map5((id) => this.entityActionFactory.createFromAction(action, {
        entityOp: EntityOp.CANCELED_PERSIST
      })));
      const d = this.callDataService(action).pipe(map5(this.resultHandler.handleSuccess(action)), catchError4(this.handleError$(action)));
      return race2(c, d);
    } catch (err) {
      return this.handleError$(action)(err);
    }
  }
  callDataService(action) {
    const { entityName, entityOp, data, httpOptions } = action.payload;
    const service = this.dataService.getService(entityName);
    switch (entityOp) {
      case EntityOp.QUERY_ALL:
      case EntityOp.QUERY_LOAD:
        return service.getAll(httpOptions);
      case EntityOp.QUERY_BY_KEY:
        return service.getById(data, httpOptions);
      case EntityOp.QUERY_MANY:
        return service.getWithQuery(data, httpOptions);
      case EntityOp.SAVE_ADD_ONE:
        return service.add(data, httpOptions);
      case EntityOp.SAVE_DELETE_ONE:
        return service.delete(data, httpOptions);
      case EntityOp.SAVE_UPDATE_ONE:
        const { id, changes } = data;
        return service.update(data, httpOptions).pipe(map5((updatedEntity) => {
          const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
          const responseData = hasData ? { id, changes: { ...changes, ...updatedEntity }, changed: true } : { id, changes, changed: false };
          return responseData;
        }));
      case EntityOp.SAVE_UPSERT_ONE:
        return service.upsert(data, httpOptions).pipe(map5((upsertedEntity) => {
          const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
          return hasData ? upsertedEntity : data;
        }));
      default:
        throw new Error(`Persistence action "${entityOp}" is not implemented.`);
    }
  }
  /**
   * Handle error result of persistence operation on an EntityAction,
   * returning a scalar observable of error action
   */
  handleError$(action) {
    return (error) => of5(this.resultHandler.handleError(action)(error)).pipe(delay4(this.responseDelay, this.scheduler || asyncScheduler2));
  }
  /**
   * Because EntityAction.payload.skip is true, skip the persistence step and
   * return a scalar success action that looks like the operation succeeded.
   */
  handleSkipSuccess$(originalAction) {
    const successOp = makeSuccessOp(originalAction.payload.entityOp);
    const successAction = this.entityActionFactory.createFromAction(originalAction, {
      entityOp: successOp
    });
    return of5(successAction).pipe(delay4(this.responseDelay, this.scheduler || asyncScheduler2));
  }
  static {
    this.ɵfac = i013.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i013, type: _EntityEffects, deps: [{ token: i13.Actions }, { token: EntityDataService }, { token: EntityActionFactory }, { token: PersistenceResultHandler }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i013.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i013.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i013, type: _EntityEffects });
  }
};
i013.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i013, type: EntityEffects, decorators: [{
  type: Injectable13
}], ctorParameters: () => [{ type: i13.Actions }, { type: EntityDataService }, { type: EntityActionFactory }, { type: PersistenceResultHandler }, { type: void 0, decorators: [{
  type: Optional6
}, {
  type: Inject5,
  args: [ENTITY_EFFECTS_SCHEDULER]
}] }] });

// src/entity-metadata/entity-filters.mjs
function PropsFilterFnFactory(props = []) {
  if (props.length === 0) {
    return (entities, pattern) => entities;
  }
  return (entities, pattern) => {
    if (!entities) {
      return [];
    }
    const regExp = typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
    if (regExp) {
      const predicate = (e) => props.some((prop) => regExp.test(e[prop]));
      return entities.filter(predicate);
    }
    return entities;
  };
}

// src/entity-services/entity-collection-service-base.mjs
var EntityCollectionServiceBase = class {
  constructor(entityName, serviceElementsFactory) {
    this.entityName = entityName;
    entityName = entityName.trim();
    const { dispatcher, selectors, selectors$ } = serviceElementsFactory.create(entityName);
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
  createEntityAction(op, data, options) {
    return this.dispatcher.createEntityAction(op, data, options);
  }
  /**
   * Create an {EntityAction} for this entity type and
   * dispatch it immediately to the store.
   * @param op {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the dispatched EntityAction
   */
  createAndDispatch(op, data, options) {
    return this.dispatcher.createAndDispatch(op, data, options);
  }
  /**
   * Dispatch an action of any type to the ngrx store.
   * @param action the Action
   * @returns the dispatched Action
   */
  dispatch(action) {
    return this.dispatcher.dispatch(action);
  }
  /** The NgRx Store for the {EntityCache} */
  get store() {
    return this.dispatcher.store;
  }
  add(entity, options) {
    return this.dispatcher.add(entity, options);
  }
  /**
   * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
   * @param correlationId The correlation id for the corresponding EntityAction
   * @param [reason] explains why canceled and by whom.
   * @param [options] options such as the tag and mergeStrategy
   */
  cancel(correlationId, reason, options) {
    this.dispatcher.cancel(correlationId, reason, options);
  }
  delete(arg, options) {
    return this.dispatcher.delete(arg, options);
  }
  /**
   * Dispatch action to query remote storage for all entities and
   * merge the queried entities into the cached collection.
   * @param [options] options that influence merge behavior
   * @returns Observable of the collection
   * after server reports successful query or the query error.
   * @see load()
   */
  getAll(options) {
    return this.dispatcher.getAll(options);
  }
  /**
   * Dispatch action to query remote storage for the entity with this primary key.
   * If the server returns an entity,
   * merge it into the cached collection.
   * @param key The primary key of the entity to get.
   * @param [options] options that influence merge behavior
   * @returns Observable of the queried entity that is in the collection
   * after server reports success or the query error.
   */
  getByKey(key, options) {
    return this.dispatcher.getByKey(key, options);
  }
  /**
   * Dispatch action to query remote storage for the entities that satisfy a query expressed
   * with either a query parameter map or an HTTP URL query string,
   * and merge the results into the cached collection.
   * @param queryParams the query in a form understood by the server
   * @param [options] options that influence merge behavior
   * @returns Observable of the queried entities
   * after server reports successful query or the query error.
   */
  getWithQuery(queryParams, options) {
    return this.dispatcher.getWithQuery(queryParams, options);
  }
  /**
   * Dispatch action to query remote storage for all entities and
   * completely replace the cached collection with the queried entities.
   * @param [options] options that influence load behavior
   * @returns Observable of the collection
   * after server reports successful query or the query error.
   * @see getAll
   */
  load(options) {
    return this.dispatcher.load(options);
  }
  /**
   * Dispatch action to query remote storage for the entities that satisfy a query expressed
   * with either a query parameter map or an HTTP URL query string,
   * and completely replace the cached collection with the queried entities.
   * @param queryParams the query in a form understood by the server
   * @param [options] options that influence load behavior
   * @returns Observable of the queried entities
   * after server reports successful query or the query error.
   */
  loadWithQuery(queryParams, options) {
    return this.dispatcher.loadWithQuery(queryParams, options);
  }
  /**
   * Dispatch action to save the updated entity (or partial entity) in remote storage.
   * The update entity may be partial (but must have its key)
   * in which case it patches the existing entity.
   * @param entity update entity, which might be a partial of T but must at least have its key.
   * @param [options] options that influence save and merge behavior
   * @returns Observable of the updated entity
   * after server reports successful save or the save error.
   */
  update(entity, options) {
    return this.dispatcher.update(entity, options);
  }
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
  upsert(entity, options) {
    return this.dispatcher.upsert(entity, options);
  }
  /*** Cache-only operations that do not update remote storage ***/
  /**
   * Replace all entities in the cached collection.
   * Does not save to remote storage.
   * @param entities to add directly to cache.
   * @param [options] options such as mergeStrategy
   */
  addAllToCache(entities, options) {
    this.dispatcher.addAllToCache(entities, options);
  }
  /**
   * Add a new entity directly to the cache.
   * Does not save to remote storage.
   * Ignored if an entity with the same primary key is already in cache.
   * @param entity to add directly to cache.
   * @param [options] options such as mergeStrategy
   */
  addOneToCache(entity, options) {
    this.dispatcher.addOneToCache(entity, options);
  }
  /**
   * Add multiple new entities directly to the cache.
   * Does not save to remote storage.
   * Entities with primary keys already in cache are ignored.
   * @param entities to add directly to cache.
   * @param [options] options such as mergeStrategy
   */
  addManyToCache(entities, options) {
    this.dispatcher.addManyToCache(entities, options);
  }
  /** Clear the cached entity collection */
  clearCache() {
    this.dispatcher.clearCache();
  }
  removeOneFromCache(arg, options) {
    this.dispatcher.removeOneFromCache(arg, options);
  }
  removeManyFromCache(args, options) {
    this.dispatcher.removeManyFromCache(args, options);
  }
  /**
   * Update a cached entity directly.
   * Does not update that entity in remote storage.
   * Ignored if an entity with matching primary key is not in cache.
   * The update entity may be partial (but must have its key)
   * in which case it patches the existing entity.
   * @param entity to update directly in cache.
   * @param [options] options such as mergeStrategy
   */
  updateOneInCache(entity, options) {
    this.dispatcher.updateOneInCache(entity, options);
  }
  /**
   * Update multiple cached entities directly.
   * Does not update these entities in remote storage.
   * Entities whose primary keys are not in cache are ignored.
   * Update entities may be partial but must at least have their keys.
   * such partial entities patch their cached counterparts.
   * @param entities to update directly in cache.
   * @param [options] options such as mergeStrategy
   */
  updateManyInCache(entities, options) {
    this.dispatcher.updateManyInCache(entities, options);
  }
  /**
   * Insert or update a cached entity directly.
   * Does not save to remote storage.
   * Upsert entity might be a partial of T but must at least have its key.
   * Pass the Update<T> structure as the payload.
   * @param entity to upsert directly in cache.
   * @param [options] options such as mergeStrategy
   */
  upsertOneInCache(entity, options) {
    this.dispatcher.upsertOneInCache(entity, options);
  }
  /**
   * Insert or update multiple cached entities directly.
   * Does not save to remote storage.
   * Upsert entities might be partial but must at least have their keys.
   * Pass an array of the Update<T> structure as the payload.
   * @param entities to upsert directly in cache.
   * @param [options] options such as mergeStrategy
   */
  upsertManyInCache(entities, options) {
    this.dispatcher.upsertManyInCache(entities, options);
  }
  /**
   * Set the pattern that the collection's filter applies
   * when using the `filteredEntities` selector.
   */
  setFilter(pattern) {
    this.dispatcher.setFilter(pattern);
  }
  /** Set the loaded flag */
  setLoaded(isLoaded) {
    this.dispatcher.setLoaded(!!isLoaded);
  }
  /** Set the loading flag */
  setLoading(isLoading) {
    this.dispatcher.setLoading(!!isLoading);
  }
};

// src/reducers/entity-collection-creator.mjs
import { Injectable as Injectable14, Optional as Optional7 } from "@angular/core";
import * as i014 from "@angular/core";
var EntityCollectionCreator = class _EntityCollectionCreator {
  constructor(entityDefinitionService) {
    this.entityDefinitionService = entityDefinitionService;
  }
  /**
   * Create the default collection for an entity type.
   * @param entityName {string} entity type name
   */
  create(entityName) {
    const def = this.entityDefinitionService && this.entityDefinitionService.getDefinition(
      entityName,
      false
      /*shouldThrow*/
    );
    const initialState = def && def.initialState;
    return initialState || createEmptyEntityCollection(entityName);
  }
  static {
    this.ɵfac = i014.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i014, type: _EntityCollectionCreator, deps: [{ token: EntityDefinitionService, optional: true }], target: i014.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i014.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i014, type: _EntityCollectionCreator });
  }
};
i014.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i014, type: EntityCollectionCreator, decorators: [{
  type: Injectable14
}], ctorParameters: () => [{ type: EntityDefinitionService, decorators: [{
  type: Optional7
}] }] });
function createEmptyEntityCollection(entityName) {
  return {
    entityName,
    ids: [],
    entities: {},
    filter: void 0,
    loaded: false,
    loading: false,
    changeState: {}
  };
}

// src/selectors/entity-selectors.mjs
import { Inject as Inject6, Injectable as Injectable15, Optional as Optional8 } from "@angular/core";
import { createSelector as createSelector2 } from "@ngrx/store";
import * as i015 from "@angular/core";
var EntitySelectorsFactory = class _EntitySelectorsFactory {
  constructor(entityCollectionCreator, selectEntityCache) {
    this.entityCollectionCreator = entityCollectionCreator || new EntityCollectionCreator();
    this.selectEntityCache = selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
  }
  /**
   * Create the NgRx selector from the store root to the named collection,
   * e.g. from Object to Heroes.
   * @param entityName the name of the collection
   */
  createCollectionSelector(entityName) {
    const getCollection = (cache = {}) => cache[entityName] || this.entityCollectionCreator.create(entityName);
    return createSelector2(this.selectEntityCache, getCollection);
  }
  // createCollectionSelectors implementation
  createCollectionSelectors(metadataOrName) {
    const metadata = typeof metadataOrName === "string" ? { entityName: metadataOrName } : metadataOrName;
    const selectKeys = (c) => c.ids;
    const selectEntityMap = (c) => c.entities;
    const selectEntities = createSelector2(selectKeys, selectEntityMap, (keys, entities) => keys.map((key) => entities[key]));
    const selectCount = createSelector2(selectKeys, (keys) => keys.length);
    const selectFilter = (c) => c.filter;
    const filterFn = metadata.filterFn;
    const selectFilteredEntities = filterFn ? createSelector2(selectEntities, selectFilter, (entities, pattern) => filterFn(entities, pattern)) : selectEntities;
    const selectLoaded = (c) => c.loaded;
    const selectLoading = (c) => c.loading;
    const selectChangeState = (c) => c.changeState;
    const extra = metadata.additionalCollectionState || {};
    const extraSelectors = {};
    Object.keys(extra).forEach((k) => {
      extraSelectors["select" + k[0].toUpperCase() + k.slice(1)] = (c) => c[k];
    });
    return {
      selectCount,
      selectEntities,
      selectEntityMap,
      selectFilter,
      selectFilteredEntities,
      selectKeys,
      selectLoaded,
      selectLoading,
      selectChangeState,
      ...extraSelectors
    };
  }
  // createCollectionSelectors implementation
  create(metadataOrName) {
    const metadata = typeof metadataOrName === "string" ? { entityName: metadataOrName } : metadataOrName;
    const entityName = metadata.entityName;
    const selectCollection = this.createCollectionSelector(entityName);
    const collectionSelectors = this.createCollectionSelectors(metadata);
    const entitySelectors = {};
    Object.keys(collectionSelectors).forEach((k) => {
      entitySelectors[k] = createSelector2(selectCollection, collectionSelectors[k]);
    });
    return {
      entityName,
      selectCollection,
      selectEntityCache: this.selectEntityCache,
      ...entitySelectors
    };
  }
  static {
    this.ɵfac = i015.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i015, type: _EntitySelectorsFactory, deps: [{ token: EntityCollectionCreator, optional: true }, { token: ENTITY_CACHE_SELECTOR_TOKEN, optional: true }], target: i015.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i015.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i015, type: _EntitySelectorsFactory });
  }
};
i015.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i015, type: EntitySelectorsFactory, decorators: [{
  type: Injectable15
}], ctorParameters: () => [{ type: EntityCollectionCreator, decorators: [{
  type: Optional8
}] }, { type: void 0, decorators: [{
  type: Optional8
}, {
  type: Inject6,
  args: [ENTITY_CACHE_SELECTOR_TOKEN]
}] }] });

// src/selectors/entity-selectors$.mjs
import { Inject as Inject7, Injectable as Injectable16 } from "@angular/core";
import { filter as filter6, shareReplay as shareReplay4 } from "rxjs/operators";
import * as i016 from "@angular/core";
import * as i14 from "@ngrx/store";
import * as i23 from "@ngrx/effects";
var EntitySelectors$Factory = class _EntitySelectors$Factory {
  constructor(store, actions, selectEntityCache) {
    this.store = store;
    this.actions = actions;
    this.selectEntityCache = selectEntityCache;
    this.entityCache$ = this.store.select(this.selectEntityCache);
    this.entityActionErrors$ = actions.pipe(filter6((ea) => ea.payload && ea.payload.entityOp && ea.payload.entityOp.endsWith(OP_ERROR)), shareReplay4(1));
  }
  /**
   * Creates an entity collection's selectors$ observables for this factory's store.
   * `selectors$` are observable selectors of the cached entity collection.
   * @param entityName - is also the name of the collection.
   * @param selectors - selector functions for this collection.
   **/
  create(entityName, selectors) {
    const selectors$ = {
      entityName
    };
    Object.keys(selectors).forEach((name) => {
      if (name.startsWith("select")) {
        const name$ = name[6].toLowerCase() + name.substring(7) + "$";
        selectors$[name$] = this.store.select(selectors[name]);
      }
    });
    selectors$["entityActions$"] = this.actions.pipe(ofEntityType(entityName));
    selectors$["errors$"] = this.entityActionErrors$.pipe(ofEntityType(entityName));
    return selectors$;
  }
  static {
    this.ɵfac = i016.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i016, type: _EntitySelectors$Factory, deps: [{ token: i14.Store }, { token: i23.Actions }, { token: ENTITY_CACHE_SELECTOR_TOKEN }], target: i016.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i016.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i016, type: _EntitySelectors$Factory });
  }
};
i016.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i016, type: EntitySelectors$Factory, decorators: [{
  type: Injectable16
}], ctorParameters: () => [{ type: i14.Store }, { type: i23.Actions }, { type: void 0, decorators: [{
  type: Inject7,
  args: [ENTITY_CACHE_SELECTOR_TOKEN]
}] }] });

// src/entity-services/entity-collection-service-elements-factory.mjs
import { Injectable as Injectable17 } from "@angular/core";
import * as i017 from "@angular/core";
var EntityCollectionServiceElementsFactory = class _EntityCollectionServiceElementsFactory {
  constructor(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
    this.entityDispatcherFactory = entityDispatcherFactory;
    this.entityDefinitionService = entityDefinitionService;
    this.entitySelectorsFactory = entitySelectorsFactory;
    this.entitySelectors$Factory = entitySelectors$Factory;
  }
  /**
   * Get the ingredients for making an EntityCollectionService for this entity type
   * @param entityName - name of the entity type
   */
  create(entityName) {
    entityName = entityName.trim();
    const definition = this.entityDefinitionService.getDefinition(entityName);
    const dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
    const selectors = this.entitySelectorsFactory.create(definition.metadata);
    const selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
    return {
      dispatcher,
      entityName,
      selectors,
      selectors$
    };
  }
  static {
    this.ɵfac = i017.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i017, type: _EntityCollectionServiceElementsFactory, deps: [{ token: EntityDispatcherFactory }, { token: EntityDefinitionService }, { token: EntitySelectorsFactory }, { token: EntitySelectors$Factory }], target: i017.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i017.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i017, type: _EntityCollectionServiceElementsFactory });
  }
};
i017.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i017, type: EntityCollectionServiceElementsFactory, decorators: [{
  type: Injectable17
}], ctorParameters: () => [{ type: EntityDispatcherFactory }, { type: EntityDefinitionService }, { type: EntitySelectorsFactory }, { type: EntitySelectors$Factory }] });

// src/entity-services/entity-collection-service-factory.mjs
import { Injectable as Injectable18 } from "@angular/core";
import * as i018 from "@angular/core";
var EntityCollectionServiceFactory = class _EntityCollectionServiceFactory {
  constructor(entityCollectionServiceElementsFactory) {
    this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
  }
  /**
   * Create an EntityCollectionService for an entity type
   * @param entityName - name of the entity type
   */
  create(entityName) {
    return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
  }
  static {
    this.ɵfac = i018.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i018, type: _EntityCollectionServiceFactory, deps: [{ token: EntityCollectionServiceElementsFactory }], target: i018.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i018.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i018, type: _EntityCollectionServiceFactory });
  }
};
i018.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i018, type: EntityCollectionServiceFactory, decorators: [{
  type: Injectable18
}], ctorParameters: () => [{ type: EntityCollectionServiceElementsFactory }] });

// src/entity-services/entity-services-elements.mjs
import { Injectable as Injectable19 } from "@angular/core";
import * as i019 from "@angular/core";
import * as i42 from "@ngrx/store";
var EntityServicesElements = class _EntityServicesElements {
  constructor(entityCollectionServiceFactory, entityDispatcherFactory, entitySelectors$Factory, store) {
    this.entityCollectionServiceFactory = entityCollectionServiceFactory;
    this.store = store;
    this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
    this.entityCache$ = entitySelectors$Factory.entityCache$;
    this.reducedActions$ = entityDispatcherFactory.reducedActions$;
  }
  static {
    this.ɵfac = i019.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i019, type: _EntityServicesElements, deps: [{ token: EntityCollectionServiceFactory }, { token: EntityDispatcherFactory }, { token: EntitySelectors$Factory }, { token: i42.Store }], target: i019.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i019.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i019, type: _EntityServicesElements });
  }
};
i019.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i019, type: EntityServicesElements, decorators: [{
  type: Injectable19
}], ctorParameters: () => [{ type: EntityCollectionServiceFactory }, { type: EntityDispatcherFactory }, { type: EntitySelectors$Factory }, { type: i42.Store }] });

// src/entity-services/entity-services-base.mjs
import { Injectable as Injectable20 } from "@angular/core";
import * as i020 from "@angular/core";
var EntityServicesBase = class _EntityServicesBase {
  // Dear @ngrx/data developer: think hard before changing the constructor.
  // Doing so will break apps that derive from this base class,
  // and many apps will derive from this class.
  //
  // Do not give this constructor an implementation.
  // Doing so makes it hard to mock classes that derive from this class.
  // Use getter properties instead. For example, see entityCache$
  constructor(entityServicesElements) {
    this.entityServicesElements = entityServicesElements;
    this.EntityCollectionServices = {};
  }
  // #region EntityServicesElement-based properties
  /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
  get entityActionErrors$() {
    return this.entityServicesElements.entityActionErrors$;
  }
  /** Observable of the entire entity cache */
  get entityCache$() {
    return this.entityServicesElements.entityCache$;
  }
  /** Factory to create a default instance of an EntityCollectionService */
  get entityCollectionServiceFactory() {
    return this.entityServicesElements.entityCollectionServiceFactory;
  }
  /**
   * Actions scanned by the store after it processed them with reducers.
   * A replay observable of the most recent action reduced by the store.
   */
  get reducedActions$() {
    return this.entityServicesElements.reducedActions$;
  }
  /** The ngrx store, scoped to the EntityCache */
  get store() {
    return this.entityServicesElements.store;
  }
  // #endregion EntityServicesElement-based properties
  /** Dispatch any action to the store */
  dispatch(action) {
    this.store.dispatch(action);
  }
  /**
   * Create a new default instance of an EntityCollectionService.
   * Prefer getEntityCollectionService() unless you really want a new default instance.
   * This one will NOT be registered with EntityServices!
   * @param entityName {string} Name of the entity type of the service
   */
  createEntityCollectionService(entityName) {
    return this.entityCollectionServiceFactory.create(entityName);
  }
  /** Get (or create) the singleton instance of an EntityCollectionService
   * @param entityName {string} Name of the entity type of the service
   */
  getEntityCollectionService(entityName) {
    let service = this.EntityCollectionServices[entityName];
    if (!service) {
      service = this.createEntityCollectionService(entityName);
      this.EntityCollectionServices[entityName] = service;
    }
    return service;
  }
  /** Register an EntityCollectionService under its entity type name.
   * Will replace a pre-existing service for that type.
   * @param service {EntityCollectionService} The entity service
   * @param serviceName {string} optional service name to use instead of the service's entityName
   */
  registerEntityCollectionService(service, serviceName) {
    this.EntityCollectionServices[serviceName || service.entityName] = service;
  }
  /**
   * Register entity services for several entity types at once.
   * Will replace a pre-existing service for that type.
   * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
   * EntityCollectionServices to register, either as a map or an array
   */
  registerEntityCollectionServices(entityCollectionServices) {
    if (Array.isArray(entityCollectionServices)) {
      entityCollectionServices.forEach((service) => this.registerEntityCollectionService(service));
    } else {
      Object.keys(entityCollectionServices || {}).forEach((serviceName) => {
        this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
      });
    }
  }
  static {
    this.ɵfac = i020.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i020, type: _EntityServicesBase, deps: [{ token: EntityServicesElements }], target: i020.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i020.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i020, type: _EntityServicesBase });
  }
};
i020.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i020, type: EntityServicesBase, decorators: [{
  type: Injectable20
}], ctorParameters: () => [{ type: EntityServicesElements }] });

// src/entity-services/entity-services.mjs
var EntityServices = class {
};

// src/reducers/entity-collection.mjs
var ChangeType;
(function(ChangeType2) {
  ChangeType2[ChangeType2["Unchanged"] = 0] = "Unchanged";
  ChangeType2[ChangeType2["Added"] = 1] = "Added";
  ChangeType2[ChangeType2["Deleted"] = 2] = "Deleted";
  ChangeType2[ChangeType2["Updated"] = 3] = "Updated";
})(ChangeType || (ChangeType = {}));

// src/reducers/entity-change-tracker-base.mjs
var EntityChangeTrackerBase = class {
  constructor(adapter, selectId) {
    this.adapter = adapter;
    this.selectId = selectId;
    this.selectId = selectId || defaultSelectId;
  }
  // #region commit methods
  /**
   * Commit all changes as when the collection has been completely reloaded from the server.
   * Harmless when there are no entity changes to commit.
   * @param collection The entity collection
   */
  commitAll(collection) {
    return Object.keys(collection.changeState).length === 0 ? collection : { ...collection, changeState: {} };
  }
  /**
   * Commit changes for the given entities as when they have been refreshed from the server.
   * Harmless when there are no entity changes to commit.
   * @param entityOrIdList The entities to clear tracking or their ids.
   * @param collection The entity collection
   */
  commitMany(entityOrIdList, collection) {
    if (entityOrIdList == null || entityOrIdList.length === 0) {
      return collection;
    }
    let didMutate = false;
    const changeState = entityOrIdList.reduce((chgState, entityOrId) => {
      const id = typeof entityOrId === "object" ? this.selectId(entityOrId) : entityOrId;
      if (chgState[id]) {
        if (!didMutate) {
          chgState = { ...chgState };
          didMutate = true;
        }
        delete chgState[id];
      }
      return chgState;
    }, collection.changeState);
    return didMutate ? { ...collection, changeState } : collection;
  }
  /**
   * Commit changes for the given entity as when it have been refreshed from the server.
   * Harmless when no entity changes to commit.
   * @param entityOrId The entity to clear tracking or its id.
   * @param collection The entity collection
   */
  commitOne(entityOrId, collection) {
    return entityOrId == null ? collection : this.commitMany([entityOrId], collection);
  }
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
  mergeQueryResults(entities, collection, mergeStrategy) {
    return this.mergeServerUpserts(entities, collection, MergeStrategy.PreserveChanges, mergeStrategy);
  }
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
  mergeSaveAdds(entities, collection, mergeStrategy) {
    return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
  }
  /**
   * Merge successful result of deleting entities on the server that have the given primary keys
   * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
   * @param entities keys primary keys of the entities to remove/delete.
   * @param collection The entity collection
   * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
   * Defaults to MergeStrategy.OverwriteChanges.
   * @returns The merged EntityCollection.
   */
  mergeSaveDeletes(keys, collection, mergeStrategy) {
    mergeStrategy = mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
    const deleteIds = keys;
    collection = mergeStrategy === MergeStrategy.IgnoreChanges ? collection : this.commitMany(deleteIds, collection);
    return this.adapter.removeMany(deleteIds, collection);
  }
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
  mergeSaveUpdates(updateResponseData, collection, mergeStrategy, skipUnchanged = false) {
    if (updateResponseData == null || updateResponseData.length === 0) {
      return collection;
    }
    let didMutate = false;
    let changeState = collection.changeState;
    mergeStrategy = mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
    let updates;
    switch (mergeStrategy) {
      case MergeStrategy.IgnoreChanges:
        updates = filterChanged(updateResponseData);
        return this.adapter.updateMany(updates, collection);
      case MergeStrategy.OverwriteChanges:
        changeState = updateResponseData.reduce((chgState, update) => {
          const oldId = update.id;
          const change = chgState[oldId];
          if (change) {
            if (!didMutate) {
              chgState = { ...chgState };
              didMutate = true;
            }
            delete chgState[oldId];
          }
          return chgState;
        }, collection.changeState);
        collection = didMutate ? { ...collection, changeState } : collection;
        updates = filterChanged(updateResponseData);
        return this.adapter.updateMany(updates, collection);
      case MergeStrategy.PreserveChanges: {
        const updateableEntities = [];
        changeState = updateResponseData.reduce((chgState, update) => {
          const oldId = update.id;
          const change = chgState[oldId];
          if (change) {
            if (!didMutate) {
              chgState = { ...chgState };
              didMutate = true;
            }
            const newId = this.selectId(update.changes);
            const oldChangeState = change;
            if (newId !== oldId) {
              delete chgState[oldId];
            }
            const newOrigValue = {
              ...oldChangeState.originalValue,
              ...update.changes
            };
            chgState[newId] = {
              ...oldChangeState,
              originalValue: newOrigValue
            };
          } else {
            updateableEntities.push(update);
          }
          return chgState;
        }, collection.changeState);
        collection = didMutate ? { ...collection, changeState } : collection;
        updates = filterChanged(updateableEntities);
        return this.adapter.updateMany(updates, collection);
      }
    }
    function filterChanged(responseData) {
      if (skipUnchanged === true) {
        responseData = responseData.filter((r) => r.changed === true);
      }
      return responseData.map((r) => ({ id: r.id, changes: r.changes }));
    }
  }
  /**
   * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
   * The default is MergeStrategy.OverwriteChanges.
   * @param entities Entities returned from saving upserts to the server.
   * @param collection The entity collection
   * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
   * Defaults to MergeStrategy.OverwriteChanges.
   * @returns The merged EntityCollection.
   */
  mergeSaveUpserts(entities, collection, mergeStrategy) {
    return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
  }
  // #endregion merge save results
  // #region query & save helpers
  /**
   *
   * @param entities Entities to merge
   * @param collection Collection into which entities are merged
   * @param defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
   * @param [mergeStrategy] The action's MergeStrategy
   */
  mergeServerUpserts(entities, collection, defaultMergeStrategy, mergeStrategy) {
    if (entities == null || entities.length === 0) {
      return collection;
    }
    let didMutate = false;
    let changeState = collection.changeState;
    mergeStrategy = mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
    switch (mergeStrategy) {
      case MergeStrategy.IgnoreChanges:
        return this.adapter.upsertMany(entities, collection);
      case MergeStrategy.OverwriteChanges:
        collection = this.adapter.upsertMany(entities, collection);
        changeState = entities.reduce((chgState, entity) => {
          const id = this.selectId(entity);
          const change = chgState[id];
          if (change) {
            if (!didMutate) {
              chgState = { ...chgState };
              didMutate = true;
            }
            delete chgState[id];
          }
          return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
      case MergeStrategy.PreserveChanges: {
        const upsertEntities = [];
        changeState = entities.reduce((chgState, entity) => {
          const id = this.selectId(entity);
          const change = chgState[id];
          if (change) {
            if (!didMutate) {
              chgState = {
                ...chgState,
                [id]: {
                  ...chgState[id],
                  originalValue: entity
                }
              };
              didMutate = true;
            }
          } else {
            upsertEntities.push(entity);
          }
          return chgState;
        }, collection.changeState);
        collection = this.adapter.upsertMany(upsertEntities, collection);
        return didMutate ? { ...collection, changeState } : collection;
      }
    }
  }
  // #endregion query & save helpers
  // #region track methods
  /**
   * Track multiple entities before adding them to the collection.
   * Does NOT add to the collection (the reducer's job).
   * @param entities The entities to add. They must all have their ids.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackAddMany(entities, collection, mergeStrategy) {
    if (mergeStrategy === MergeStrategy.IgnoreChanges || entities == null || entities.length === 0) {
      return collection;
    }
    let didMutate = false;
    const changeState = entities.reduce((chgState, entity) => {
      const id = this.selectId(entity);
      if (id == null || id === "") {
        throw new Error(`${collection.entityName} entity add requires a key to be tracked`);
      }
      const trackedChange = chgState[id];
      if (!trackedChange) {
        if (!didMutate) {
          didMutate = true;
          chgState = { ...chgState };
        }
        chgState[id] = { changeType: ChangeType.Added };
      }
      return chgState;
    }, collection.changeState);
    return didMutate ? { ...collection, changeState } : collection;
  }
  /**
   * Track an entity before adding it to the collection.
   * Does NOT add to the collection (the reducer's job).
   * @param entity The entity to add. It must have an id.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   * If not specified, implementation supplies a default strategy.
   */
  trackAddOne(entity, collection, mergeStrategy) {
    return entity == null ? collection : this.trackAddMany([entity], collection, mergeStrategy);
  }
  /**
   * Track multiple entities before removing them with the intention of deleting them on the server.
   * Does NOT remove from the collection (the reducer's job).
   * @param keys The primary keys of the entities to delete.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackDeleteMany(keys, collection, mergeStrategy) {
    if (mergeStrategy === MergeStrategy.IgnoreChanges || keys == null || keys.length === 0) {
      return collection;
    }
    let didMutate = false;
    const entityMap = collection.entities;
    const changeState = keys.reduce((chgState, id) => {
      const originalValue = entityMap[id];
      if (originalValue) {
        const trackedChange = chgState[id];
        if (trackedChange) {
          if (trackedChange.changeType === ChangeType.Added) {
            cloneChgStateOnce();
            delete chgState[id];
          } else if (trackedChange.changeType === ChangeType.Updated) {
            cloneChgStateOnce();
            chgState[id] = { ...chgState[id], changeType: ChangeType.Deleted };
          }
        } else {
          cloneChgStateOnce();
          chgState[id] = { changeType: ChangeType.Deleted, originalValue };
        }
      }
      return chgState;
      function cloneChgStateOnce() {
        if (!didMutate) {
          didMutate = true;
          chgState = { ...chgState };
        }
      }
    }, collection.changeState);
    return didMutate ? { ...collection, changeState } : collection;
  }
  /**
   * Track an entity before it is removed with the intention of deleting it on the server.
   * Does NOT remove from the collection (the reducer's job).
   * @param key The primary key of the entity to delete.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackDeleteOne(key, collection, mergeStrategy) {
    return key == null ? collection : this.trackDeleteMany([key], collection, mergeStrategy);
  }
  /**
   * Track multiple entities before updating them in the collection.
   * Does NOT update the collection (the reducer's job).
   * @param updates The entities to update.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpdateMany(updates, collection, mergeStrategy) {
    if (mergeStrategy === MergeStrategy.IgnoreChanges || updates == null || updates.length === 0) {
      return collection;
    }
    let didMutate = false;
    const entityMap = collection.entities;
    const changeState = updates.reduce((chgState, update) => {
      const { id, changes: entity } = update;
      if (id == null || id === "") {
        throw new Error(`${collection.entityName} entity update requires a key to be tracked`);
      }
      const originalValue = entityMap[id];
      if (originalValue) {
        const trackedChange = chgState[id];
        if (!trackedChange) {
          if (!didMutate) {
            didMutate = true;
            chgState = { ...chgState };
          }
          chgState[id] = { changeType: ChangeType.Updated, originalValue };
        }
      }
      return chgState;
    }, collection.changeState);
    return didMutate ? { ...collection, changeState } : collection;
  }
  /**
   * Track an entity before updating it in the collection.
   * Does NOT update the collection (the reducer's job).
   * @param update The entity to update.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpdateOne(update, collection, mergeStrategy) {
    return update == null ? collection : this.trackUpdateMany([update], collection, mergeStrategy);
  }
  /**
   * Track multiple entities before upserting (adding and updating) them to the collection.
   * Does NOT update the collection (the reducer's job).
   * @param entities The entities to add or update. They must be complete entities with ids.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpsertMany(entities, collection, mergeStrategy) {
    if (mergeStrategy === MergeStrategy.IgnoreChanges || entities == null || entities.length === 0) {
      return collection;
    }
    let didMutate = false;
    const entityMap = collection.entities;
    const changeState = entities.reduce((chgState, entity) => {
      const id = this.selectId(entity);
      if (id == null || id === "") {
        throw new Error(`${collection.entityName} entity upsert requires a key to be tracked`);
      }
      const trackedChange = chgState[id];
      if (!trackedChange) {
        if (!didMutate) {
          didMutate = true;
          chgState = { ...chgState };
        }
        const originalValue = entityMap[id];
        chgState[id] = originalValue == null ? { changeType: ChangeType.Added } : { changeType: ChangeType.Updated, originalValue };
      }
      return chgState;
    }, collection.changeState);
    return didMutate ? { ...collection, changeState } : collection;
  }
  /**
   * Track an entity before upsert (adding and updating) it to the collection.
   * Does NOT update the collection (the reducer's job).
   * @param entities The entity to add or update. It must be a complete entity with its id.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpsertOne(entity, collection, mergeStrategy) {
    return entity == null ? collection : this.trackUpsertMany([entity], collection, mergeStrategy);
  }
  // #endregion track methods
  // #region undo methods
  /**
   * Revert the unsaved changes for all collection.
   * Harmless when there are no entity changes to undo.
   * @param collection The entity collection
   */
  undoAll(collection) {
    const ids = Object.keys(collection.changeState);
    const { remove, upsert } = ids.reduce(
      (acc, id) => {
        const changeState = acc.chgState[id];
        switch (changeState.changeType) {
          case ChangeType.Added:
            acc.remove.push(id);
            break;
          case ChangeType.Deleted:
            const removed = changeState.originalValue;
            if (removed) {
              acc.upsert.push(removed);
            }
            break;
          case ChangeType.Updated:
            acc.upsert.push(changeState.originalValue);
            break;
        }
        return acc;
      },
      // entitiesToUndo
      {
        remove: [],
        upsert: [],
        chgState: collection.changeState
      }
    );
    collection = this.adapter.removeMany(remove, collection);
    collection = this.adapter.upsertMany(upsert, collection);
    return { ...collection, changeState: {} };
  }
  /**
   * Revert the unsaved changes for the given entities.
   * Harmless when there are no entity changes to undo.
   * @param entityOrIdList The entities to revert or their ids.
   * @param collection The entity collection
   */
  undoMany(entityOrIdList, collection) {
    if (entityOrIdList == null || entityOrIdList.length === 0) {
      return collection;
    }
    let didMutate = false;
    const { changeState, remove, upsert } = entityOrIdList.reduce(
      (acc, entityOrId) => {
        let chgState = acc.changeState;
        const id = typeof entityOrId === "object" ? this.selectId(entityOrId) : entityOrId;
        const change = chgState[id];
        if (change) {
          if (!didMutate) {
            chgState = { ...chgState };
            didMutate = true;
          }
          delete chgState[id];
          acc.changeState = chgState;
          switch (change.changeType) {
            case ChangeType.Added:
              acc.remove.push(id);
              break;
            case ChangeType.Deleted:
              const removed = change.originalValue;
              if (removed) {
                acc.upsert.push(removed);
              }
              break;
            case ChangeType.Updated:
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
        changeState: collection.changeState
      }
    );
    collection = this.adapter.removeMany(remove, collection);
    collection = this.adapter.upsertMany(upsert, collection);
    return didMutate ? { ...collection, changeState } : collection;
  }
  /**
   * Revert the unsaved changes for the given entity.
   * Harmless when there are no entity changes to undo.
   * @param entityOrId The entity to revert or its id.
   * @param collection The entity collection
   */
  undoOne(entityOrId, collection) {
    return entityOrId == null ? collection : this.undoMany([entityOrId], collection);
  }
};

// src/reducers/entity-collection-reducer-methods.mjs
import { Injectable as Injectable21 } from "@angular/core";
import * as i021 from "@angular/core";
var EntityCollectionReducerMethods = class {
  constructor(entityName, definition, entityChangeTracker) {
    this.entityName = entityName;
    this.definition = definition;
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
      [EntityOp.SET_LOADING]: this.setLoading.bind(this)
    };
    this.adapter = definition.entityAdapter;
    this.isChangeTracking = definition.noChangeTracking !== true;
    this.selectId = definition.selectId;
    this.guard = new EntityActionGuard(entityName, this.selectId);
    this.toUpdate = toUpdateFactory(this.selectId);
    this.entityChangeTracker = entityChangeTracker || new EntityChangeTrackerBase(this.adapter, this.selectId);
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
    return {
      ...this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy),
      loaded: true,
      loading: false
    };
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
    collection = data == null ? collection : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
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
    return {
      ...this.adapter.setAll(data, collection),
      loading: false,
      loaded: true,
      changeState: {}
    };
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
    return {
      ...this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy),
      loaded: true,
      loading: false
    };
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
      const entities = this.guard.mustBeEntities(action);
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
    const entities = this.guard.mustBeEntities(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    if (this.isOptimistic(action)) {
      collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
    } else {
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
      const entity = this.guard.mustBeEntity(action);
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
    const entity = this.guard.mustBeEntity(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    if (this.isOptimistic(action)) {
      const update = this.toUpdate(entity);
      collection = this.entityChangeTracker.mergeSaveUpdates(
        [update],
        collection,
        mergeStrategy,
        false
        /*never skip*/
      );
    } else {
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
    const deleteId = typeof toDelete === "object" ? this.selectId(toDelete) : toDelete;
    const change = collection.changeState[deleteId];
    if (change) {
      if (change.changeType === ChangeType.Added) {
        collection = this.adapter.removeOne(deleteId, collection);
        collection = this.entityChangeTracker.commitOne(deleteId, collection);
        action.payload.skip = true;
      } else {
        collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
      }
    }
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
    } else {
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
    const deleteIds = this.extractData(action).map((d) => typeof d === "object" ? this.selectId(d) : d);
    deleteIds.forEach((deleteId) => {
      const change = collection.changeState[deleteId];
      if (change) {
        if (change.changeType === ChangeType.Added) {
          collection = this.adapter.removeOne(deleteId, collection);
          collection = this.entityChangeTracker.commitOne(deleteId, collection);
          action.payload.skip = true;
        } else {
          collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
        }
      }
    });
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
    } else {
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
    collection = this.entityChangeTracker.mergeSaveUpdates(
      [update],
      collection,
      mergeStrategy,
      isOptimistic
      /*skip unchanged if optimistic */
    );
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
    collection = this.entityChangeTracker.mergeSaveUpdates(
      updates,
      collection,
      mergeStrategy,
      false
      /* never skip */
    );
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
      const entity = this.guard.mustBeEntity(action);
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
    const entity = this.guard.mustBeEntity(action);
    const mergeStrategy = this.extractMergeStrategy(action);
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
      const entities = this.guard.mustBeEntities(action);
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
    const entities = this.guard.mustBeEntities(action);
    const mergeStrategy = this.extractMergeStrategy(action);
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
    return {
      ...this.adapter.setAll(entities, collection),
      loading: false,
      loaded: true,
      changeState: {}
    };
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
    const keys = this.guard.mustBeKeys(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
    return this.adapter.removeMany(keys, collection);
  }
  removeOne(collection, action) {
    const key = this.guard.mustBeKey(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
    return this.adapter.removeOne(key, collection);
  }
  removeAll(collection, action) {
    return {
      ...this.adapter.removeAll(collection),
      loaded: false,
      // Only REMOVE_ALL sets loaded to false
      loading: false,
      changeState: {}
      // Assume clearing the collection and not trying to delete all entities
    };
  }
  updateMany(collection, action) {
    const updates = this.guard.mustBeUpdates(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
    return this.adapter.updateMany(updates, collection);
  }
  updateOne(collection, action) {
    const update = this.guard.mustBeUpdate(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
    return this.adapter.updateOne(update, collection);
  }
  upsertMany(collection, action) {
    const entities = this.guard.mustBeEntities(action);
    const mergeStrategy = this.extractMergeStrategy(action);
    collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
    return this.adapter.upsertMany(entities, collection);
  }
  upsertOne(collection, action) {
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
    return collection.changeState === changeState ? collection : { ...collection, changeState };
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
    const filter7 = this.extractData(action);
    return collection.filter === filter7 ? collection : { ...collection, filter: filter7 };
  }
  setLoaded(collection, action) {
    const loaded = this.extractData(action) === true || false;
    return collection.loaded === loaded ? collection : { ...collection, loaded };
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
    return collection.loading === loading ? collection : { ...collection, loading };
  }
  // #endregion Cache-only operations
  // #region helpers
  /** Safely extract data from the EntityAction payload */
  extractData(action) {
    return action.payload && action.payload.data;
  }
  /** Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked. */
  extractMergeStrategy(action) {
    return this.isChangeTracking ? action.payload && action.payload.mergeStrategy : MergeStrategy.IgnoreChanges;
  }
  isOptimistic(action) {
    return action.payload && action.payload.isOptimistic === true;
  }
};
var EntityCollectionReducerMethodsFactory = class _EntityCollectionReducerMethodsFactory {
  constructor(entityDefinitionService) {
    this.entityDefinitionService = entityDefinitionService;
  }
  /** Create the  {EntityCollectionReducerMethods} for the named entity type */
  create(entityName) {
    const definition = this.entityDefinitionService.getDefinition(entityName);
    const methodsClass = new EntityCollectionReducerMethods(entityName, definition);
    return methodsClass.methods;
  }
  static {
    this.ɵfac = i021.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i021, type: _EntityCollectionReducerMethodsFactory, deps: [{ token: EntityDefinitionService }], target: i021.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i021.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i021, type: _EntityCollectionReducerMethodsFactory });
  }
};
i021.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i021, type: EntityCollectionReducerMethodsFactory, decorators: [{
  type: Injectable21
}], ctorParameters: () => [{ type: EntityDefinitionService }] });

// src/reducers/entity-collection-reducer.mjs
import { Injectable as Injectable22 } from "@angular/core";
import * as i022 from "@angular/core";
var EntityCollectionReducerFactory = class _EntityCollectionReducerFactory {
  constructor(methodsFactory) {
    this.methodsFactory = methodsFactory;
  }
  /** Create a default reducer for a collection of entities of T */
  create(entityName) {
    const methods = this.methodsFactory.create(entityName);
    return function entityCollectionReducer(collection, action) {
      const reducerMethod = methods[action.payload.entityOp];
      return reducerMethod ? reducerMethod(collection, action) : collection;
    };
  }
  static {
    this.ɵfac = i022.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i022, type: _EntityCollectionReducerFactory, deps: [{ token: EntityCollectionReducerMethodsFactory }], target: i022.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i022.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i022, type: _EntityCollectionReducerFactory });
  }
};
i022.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i022, type: EntityCollectionReducerFactory, decorators: [{
  type: Injectable22
}], ctorParameters: () => [{ type: EntityCollectionReducerMethodsFactory }] });

// src/reducers/entity-collection-reducer-registry.mjs
import { Inject as Inject8, Injectable as Injectable23, Optional as Optional9 } from "@angular/core";
import { compose } from "@ngrx/store";
import * as i023 from "@angular/core";
var EntityCollectionReducerRegistry = class _EntityCollectionReducerRegistry {
  constructor(entityCollectionReducerFactory, entityCollectionMetaReducers) {
    this.entityCollectionReducerFactory = entityCollectionReducerFactory;
    this.entityCollectionReducers = {};
    this.entityCollectionMetaReducer = compose.apply(null, entityCollectionMetaReducers || []);
  }
  /**
   * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
   * @param entityName Name of the entity type for this reducer
   */
  getOrCreateReducer(entityName) {
    let reducer = this.entityCollectionReducers[entityName];
    if (!reducer) {
      reducer = this.entityCollectionReducerFactory.create(entityName);
      reducer = this.registerReducer(entityName, reducer);
      this.entityCollectionReducers[entityName] = reducer;
    }
    return reducer;
  }
  /**
   * Register an EntityCollectionReducer for an entity type
   * @param entityName - the name of the entity type
   * @param reducer - reducer for that entity type
   *
   * Examples:
   *   registerReducer('Hero', myHeroReducer);
   *   registerReducer('Villain', myVillainReducer);
   */
  registerReducer(entityName, reducer) {
    reducer = this.entityCollectionMetaReducer(reducer);
    return this.entityCollectionReducers[entityName.trim()] = reducer;
  }
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
  registerReducers(reducers) {
    const keys = reducers ? Object.keys(reducers) : [];
    keys.forEach((key) => this.registerReducer(key, reducers[key]));
  }
  static {
    this.ɵfac = i023.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i023, type: _EntityCollectionReducerRegistry, deps: [{ token: EntityCollectionReducerFactory }, { token: ENTITY_COLLECTION_META_REDUCERS, optional: true }], target: i023.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i023.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i023, type: _EntityCollectionReducerRegistry });
  }
};
i023.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i023, type: EntityCollectionReducerRegistry, decorators: [{
  type: Injectable23
}], ctorParameters: () => [{ type: EntityCollectionReducerFactory }, { type: void 0, decorators: [{
  type: Optional9
}, {
  type: Inject8,
  args: [ENTITY_COLLECTION_META_REDUCERS]
}] }] });

// src/reducers/entity-cache-reducer.mjs
import { Injectable as Injectable24 } from "@angular/core";
import * as i024 from "@angular/core";
var EntityCacheReducerFactory = class _EntityCacheReducerFactory {
  constructor(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
    this.entityCollectionCreator = entityCollectionCreator;
    this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
    this.logger = logger;
  }
  /**
   * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
   * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
   */
  create() {
    return entityCacheReducer.bind(this);
    function entityCacheReducer(entityCache = {}, action) {
      switch (action.type) {
        case EntityCacheAction.CLEAR_COLLECTIONS: {
          return this.clearCollectionsReducer(entityCache, action);
        }
        case EntityCacheAction.LOAD_COLLECTIONS: {
          return this.loadCollectionsReducer(entityCache, action);
        }
        case EntityCacheAction.MERGE_QUERY_SET: {
          return this.mergeQuerySetReducer(entityCache, action);
        }
        case EntityCacheAction.SAVE_ENTITIES: {
          return this.saveEntitiesReducer(entityCache, action);
        }
        case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
          return this.saveEntitiesCancelReducer(entityCache, action);
        }
        case EntityCacheAction.SAVE_ENTITIES_ERROR: {
          return this.saveEntitiesErrorReducer(entityCache, action);
        }
        case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
          return this.saveEntitiesSuccessReducer(entityCache, action);
        }
        case EntityCacheAction.SET_ENTITY_CACHE: {
          return action.payload.cache;
        }
      }
      const payload = action.payload;
      if (payload && payload.entityName && payload.entityOp && !payload.error) {
        return this.applyCollectionReducer(entityCache, action);
      }
      return entityCache;
    }
  }
  /**
   * Reducer to clear multiple collections at the same time.
   * @param entityCache the entity cache
   * @param action a ClearCollections action whose payload is an array of collection names.
   * If empty array, does nothing. If no array, clears all the collections.
   */
  clearCollectionsReducer(entityCache, action) {
    let { collections, tag } = action.payload;
    const entityOp = EntityOp.REMOVE_ALL;
    if (!collections) {
      collections = Object.keys(entityCache);
    }
    entityCache = collections.reduce((newCache, entityName) => {
      const payload = { entityName, entityOp };
      const act = {
        type: `[${entityName}] ${action.type}`,
        payload
      };
      newCache = this.applyCollectionReducer(newCache, act);
      return newCache;
    }, entityCache);
    return entityCache;
  }
  /**
   * Reducer to load collection in the form of a hash of entity data for multiple collections.
   * @param entityCache the entity cache
   * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
   */
  loadCollectionsReducer(entityCache, action) {
    const { collections, tag } = action.payload;
    const entityOp = EntityOp.ADD_ALL;
    const entityNames = Object.keys(collections);
    entityCache = entityNames.reduce((newCache, entityName) => {
      const payload = {
        entityName,
        entityOp,
        data: collections[entityName]
      };
      const act = {
        type: `[${entityName}] ${action.type}`,
        payload
      };
      newCache = this.applyCollectionReducer(newCache, act);
      return newCache;
    }, entityCache);
    return entityCache;
  }
  /**
   * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
   * @param entityCache the entity cache
   * @param action a MergeQuerySet action with the query set and a MergeStrategy
   */
  mergeQuerySetReducer(entityCache, action) {
    let { mergeStrategy, querySet, tag } = action.payload;
    mergeStrategy = mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
    const entityOp = EntityOp.QUERY_MANY_SUCCESS;
    const entityNames = Object.keys(querySet);
    entityCache = entityNames.reduce((newCache, entityName) => {
      const payload = {
        entityName,
        entityOp,
        data: querySet[entityName],
        mergeStrategy
      };
      const act = {
        type: `[${entityName}] ${action.type}`,
        payload
      };
      newCache = this.applyCollectionReducer(newCache, act);
      return newCache;
    }, entityCache);
    return entityCache;
  }
  // #region saveEntities reducers
  saveEntitiesReducer(entityCache, action) {
    const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
    try {
      changeSet.changes.forEach((item) => {
        const entityName = item.entityName;
        const payload = {
          entityName,
          entityOp: getEntityOp(item),
          data: item.entities,
          correlationId,
          isOptimistic,
          mergeStrategy,
          tag
        };
        const act = {
          type: `[${entityName}] ${action.type}`,
          payload
        };
        entityCache = this.applyCollectionReducer(entityCache, act);
        if (act.payload.error) {
          throw act.payload.error;
        }
      });
    } catch (error) {
      action.payload.error = error;
    }
    return entityCache;
    function getEntityOp(item) {
      switch (item.op) {
        case ChangeSetOperation.Add:
          return EntityOp.SAVE_ADD_MANY;
        case ChangeSetOperation.Delete:
          return EntityOp.SAVE_DELETE_MANY;
        case ChangeSetOperation.Update:
          return EntityOp.SAVE_UPDATE_MANY;
        case ChangeSetOperation.Upsert:
          return EntityOp.SAVE_UPSERT_MANY;
      }
    }
  }
  saveEntitiesCancelReducer(entityCache, action) {
    return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
  }
  saveEntitiesErrorReducer(entityCache, action) {
    const originalAction = action.payload.originalAction;
    const originalChangeSet = originalAction.payload.changeSet;
    const entityNames = originalChangeSet.changes.map((item) => item.entityName);
    return this.clearLoadingFlags(entityCache, entityNames);
  }
  saveEntitiesSuccessReducer(entityCache, action) {
    const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
    changeSet.changes.forEach((item) => {
      const entityName = item.entityName;
      const payload = {
        entityName,
        entityOp: getEntityOp(item),
        data: item.entities,
        correlationId,
        isOptimistic,
        mergeStrategy,
        tag
      };
      const act = {
        type: `[${entityName}] ${action.type}`,
        payload
      };
      entityCache = this.applyCollectionReducer(entityCache, act);
    });
    return entityCache;
    function getEntityOp(item) {
      switch (item.op) {
        case ChangeSetOperation.Add:
          return EntityOp.SAVE_ADD_MANY_SUCCESS;
        case ChangeSetOperation.Delete:
          return EntityOp.SAVE_DELETE_MANY_SUCCESS;
        case ChangeSetOperation.Update:
          return EntityOp.SAVE_UPDATE_MANY_SUCCESS;
        case ChangeSetOperation.Upsert:
          return EntityOp.SAVE_UPSERT_MANY_SUCCESS;
      }
    }
  }
  // #endregion saveEntities reducers
  // #region helpers
  /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
  applyCollectionReducer(cache = {}, action) {
    const entityName = action.payload.entityName;
    const collection = cache[entityName];
    const reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
    let newCollection;
    try {
      newCollection = collection ? reducer(collection, action) : reducer(this.entityCollectionCreator.create(entityName), action);
    } catch (error) {
      this.logger.error(error);
      action.payload.error = error;
    }
    return action.payload.error || collection === newCollection ? cache : { ...cache, [entityName]: newCollection };
  }
  /** Ensure loading is false for every collection in entityNames */
  clearLoadingFlags(entityCache, entityNames) {
    let isMutated = false;
    entityNames.forEach((entityName) => {
      const collection = entityCache[entityName];
      if (collection.loading) {
        if (!isMutated) {
          entityCache = { ...entityCache };
          isMutated = true;
        }
        entityCache[entityName] = { ...collection, loading: false };
      }
    });
    return entityCache;
  }
  static {
    this.ɵfac = i024.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i024, type: _EntityCacheReducerFactory, deps: [{ token: EntityCollectionCreator }, { token: EntityCollectionReducerRegistry }, { token: Logger }], target: i024.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i024.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i024, type: _EntityCacheReducerFactory });
  }
};
i024.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i024, type: EntityCacheReducerFactory, decorators: [{
  type: Injectable24
}], ctorParameters: () => [{ type: EntityCollectionCreator }, { type: EntityCollectionReducerRegistry }, { type: Logger }] });

// src/utils/default-logger.mjs
import { Injectable as Injectable25 } from "@angular/core";
import * as i025 from "@angular/core";
var DefaultLogger = class _DefaultLogger {
  error(message, extra) {
    if (message) {
      extra ? console.error(message, extra) : console.error(message);
    }
  }
  log(message, extra) {
    if (message) {
      extra ? console.log(message, extra) : console.log(message);
    }
  }
  warn(message, extra) {
    if (message) {
      extra ? console.warn(message, extra) : console.warn(message);
    }
  }
  static {
    this.ɵfac = i025.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i025, type: _DefaultLogger, deps: [], target: i025.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i025.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i025, type: _DefaultLogger });
  }
};
i025.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i025, type: DefaultLogger, decorators: [{
  type: Injectable25
}] });

// src/utils/default-pluralizer.mjs
import { Inject as Inject9, Injectable as Injectable26, Optional as Optional10 } from "@angular/core";
import * as i026 from "@angular/core";
var uncountable = [
  // 'sheep',
  // 'fish',
  // 'deer',
  // 'moose',
  // 'rice',
  // 'species',
  "equipment",
  "information",
  "money",
  "series"
];
var DefaultPluralizer = class _DefaultPluralizer {
  constructor(pluralNames) {
    this.pluralNames = {};
    if (pluralNames) {
      pluralNames.forEach((pn) => this.registerPluralNames(pn));
    }
  }
  /**
   * Pluralize a singular name using common English language pluralization rules
   * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
   */
  pluralize(name) {
    const plural = this.pluralNames[name];
    if (plural) {
      return plural;
    }
    if (uncountable.indexOf(name.toLowerCase()) >= 0) {
      return name;
    } else if (/[aeiou]y$/.test(name)) {
      return name + "s";
    } else if (name.endsWith("y")) {
      return name.substring(0, name.length - 1) + "ies";
    } else if (/[s|ss|sh|ch|x|z]$/.test(name)) {
      return name + "es";
    } else {
      return name + "s";
    }
  }
  /**
   * Register a mapping of entity type name to the entity name's plural
   * @param pluralNames {EntityPluralNames} plural names for entity types
   */
  registerPluralNames(pluralNames) {
    this.pluralNames = { ...this.pluralNames, ...pluralNames || {} };
  }
  static {
    this.ɵfac = i026.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i026, type: _DefaultPluralizer, deps: [{ token: PLURAL_NAMES_TOKEN, optional: true }], target: i026.ɵɵFactoryTarget.Injectable });
  }
  static {
    this.ɵprov = i026.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i026, type: _DefaultPluralizer });
  }
};
i026.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i026, type: DefaultPluralizer, decorators: [{
  type: Injectable26
}], ctorParameters: () => [{ type: void 0, decorators: [{
  type: Optional10
}, {
  type: Inject9,
  args: [PLURAL_NAMES_TOKEN]
}] }] });

// src/utils/guid-fns.mjs
function getUuid() {
  return "xxxxxxxxxx4xxyxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function getGuid() {
  return getUuid();
}
function getGuidComb(seed) {
  const timePart = ("00" + (seed || (/* @__PURE__ */ new Date()).getTime()).toString(16)).slice(-12);
  return "xxxxxxxxxx4xxyxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  }) + timePart;
}
function guidComparer(l, r) {
  const lLow = l.slice(-12);
  const rLow = r.slice(-12);
  return lLow !== rLow ? lLow < rLow ? -1 : +(lLow !== rLow) : l < r ? -1 : +(l !== r);
}

// src/provide-entity-data.mjs
import { ENVIRONMENT_INITIALIZER, inject, InjectionToken as InjectionToken6, makeEnvironmentProviders } from "@angular/core";
import { combineReducers, ReducerManager } from "@ngrx/store";
import { EffectSources } from "@ngrx/effects";
var BASE_ENTITY_DATA_PROVIDERS = [
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
  { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ENTITY_CACHE_NAME },
  { provide: EntityServices, useClass: EntityServicesBase },
  { provide: Logger, useClass: DefaultLogger },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => initializeBaseEntityData()
  }
];
function initializeBaseEntityData() {
  const reducerManager = inject(ReducerManager);
  const entityCacheReducerFactory = inject(EntityCacheReducerFactory);
  const entityCacheName = inject(ENTITY_CACHE_NAME_TOKEN, {
    optional: true
  });
  const initialStateOrFn = inject(INITIAL_ENTITY_CACHE_STATE, {
    optional: true
  });
  const metaReducersOrTokens = inject(ENTITY_CACHE_META_REDUCERS, {
    optional: true
  });
  const key = entityCacheName || ENTITY_CACHE_NAME;
  const metaReducers = (metaReducersOrTokens || []).map((mr) => {
    return mr instanceof InjectionToken6 ? inject(mr) : mr;
  });
  const initialState = typeof initialStateOrFn === "function" ? initialStateOrFn() : initialStateOrFn;
  const entityCacheFeature = {
    key,
    reducers: entityCacheReducerFactory.create(),
    reducerFactory: combineReducers,
    initialState: initialState || {},
    metaReducers
  };
  reducerManager.addFeature(entityCacheFeature);
}
var ENTITY_DATA_EFFECTS_PROVIDERS = [
  DefaultDataServiceFactory,
  EntityCacheDataService,
  EntityDataService,
  EntityCacheEffects,
  EntityEffects,
  { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
  {
    provide: PersistenceResultHandler,
    useClass: DefaultPersistenceResultHandler
  },
  { provide: Pluralizer, useClass: DefaultPluralizer },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => initializeEntityDataEffects()
  }
];
function initializeEntityDataEffects() {
  const effectsSources = inject(EffectSources);
  const entityCacheEffects = inject(EntityCacheEffects);
  const entityEffects = inject(EntityEffects);
  effectsSources.addEffects(entityCacheEffects);
  effectsSources.addEffects(entityEffects);
}
function provideEntityDataConfig(config) {
  return [
    {
      provide: ENTITY_CACHE_META_REDUCERS,
      useValue: config.entityCacheMetaReducers ? config.entityCacheMetaReducers : []
    },
    {
      provide: ENTITY_COLLECTION_META_REDUCERS,
      useValue: config.entityCollectionMetaReducers ? config.entityCollectionMetaReducers : []
    },
    {
      provide: PLURAL_NAMES_TOKEN,
      multi: true,
      useValue: config.pluralNames ? config.pluralNames : {}
    },
    {
      provide: ENTITY_METADATA_TOKEN,
      multi: true,
      useValue: config.entityMetadata ? config.entityMetadata : []
    }
  ];
}
function provideEntityData(config, ...features) {
  return makeEnvironmentProviders([
    BASE_ENTITY_DATA_PROVIDERS,
    provideEntityDataConfig(config),
    ...features.map((feature) => feature.ɵproviders)
  ]);
}
var EntityDataFeatureKind;
(function(EntityDataFeatureKind2) {
  EntityDataFeatureKind2[EntityDataFeatureKind2["WithEffects"] = 0] = "WithEffects";
})(EntityDataFeatureKind || (EntityDataFeatureKind = {}));
function withEffects() {
  return {
    ɵkind: EntityDataFeatureKind.WithEffects,
    ɵproviders: [ENTITY_DATA_EFFECTS_PROVIDERS]
  };
}

// src/entity-data-without-effects.module.mjs
import { NgModule } from "@angular/core";
import * as i027 from "@angular/core";
var EntityDataModuleWithoutEffects = class _EntityDataModuleWithoutEffects {
  static forRoot(config) {
    return {
      ngModule: _EntityDataModuleWithoutEffects,
      providers: [provideEntityDataConfig(config)]
    };
  }
  static {
    this.ɵfac = i027.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i027, type: _EntityDataModuleWithoutEffects, deps: [], target: i027.ɵɵFactoryTarget.NgModule });
  }
  static {
    this.ɵmod = i027.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.0-next.6", ngImport: i027, type: _EntityDataModuleWithoutEffects });
  }
  static {
    this.ɵinj = i027.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i027, type: _EntityDataModuleWithoutEffects, providers: [BASE_ENTITY_DATA_PROVIDERS] });
  }
};
i027.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i027, type: EntityDataModuleWithoutEffects, decorators: [{
  type: NgModule,
  args: [{
    providers: [BASE_ENTITY_DATA_PROVIDERS]
  }]
}] });

// src/entity-data.module.mjs
import { NgModule as NgModule2 } from "@angular/core";
import * as i028 from "@angular/core";
var EntityDataModule = class _EntityDataModule {
  static forRoot(config) {
    return {
      ngModule: _EntityDataModule,
      providers: [provideEntityDataConfig(config)]
    };
  }
  static {
    this.ɵfac = i028.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i028, type: _EntityDataModule, deps: [], target: i028.ɵɵFactoryTarget.NgModule });
  }
  static {
    this.ɵmod = i028.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.0-next.6", ngImport: i028, type: _EntityDataModule, imports: [EntityDataModuleWithoutEffects] });
  }
  static {
    this.ɵinj = i028.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i028, type: _EntityDataModule, providers: [ENTITY_DATA_EFFECTS_PROVIDERS], imports: [EntityDataModuleWithoutEffects] });
  }
};
i028.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.6", ngImport: i028, type: EntityDataModule, decorators: [{
  type: NgModule2,
  args: [{
    imports: [EntityDataModuleWithoutEffects],
    providers: [ENTITY_DATA_EFFECTS_PROVIDERS]
  }]
}] });
export {
  ChangeSetItemFactory,
  ChangeSetOperation,
  ChangeType,
  ClearCollections,
  CorrelationIdGenerator,
  DataServiceError,
  DefaultDataService,
  DefaultDataServiceConfig,
  DefaultDataServiceFactory,
  DefaultHttpUrlGenerator,
  DefaultLogger,
  DefaultPersistenceResultHandler,
  DefaultPluralizer,
  ENTITY_CACHE_META_REDUCERS,
  ENTITY_CACHE_NAME,
  ENTITY_CACHE_NAME_TOKEN,
  ENTITY_CACHE_SELECTOR_TOKEN,
  ENTITY_COLLECTION_META_REDUCERS,
  ENTITY_METADATA_TOKEN,
  EntityActionFactory,
  EntityActionGuard,
  EntityCacheAction,
  EntityCacheDataService,
  EntityCacheDispatcher,
  EntityCacheEffects,
  EntityCacheReducerFactory,
  EntityChangeTrackerBase,
  EntityCollectionCreator,
  EntityCollectionReducerFactory,
  EntityCollectionReducerMethods,
  EntityCollectionReducerMethodsFactory,
  EntityCollectionReducerRegistry,
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityCollectionServiceFactory,
  EntityDataModule,
  EntityDataModuleWithoutEffects,
  EntityDataService,
  EntityDefinitionService,
  EntityDispatcherBase,
  EntityDispatcherDefaultOptions,
  EntityDispatcherFactory,
  EntityEffects,
  EntityHttpResourceUrls,
  EntityOp,
  EntitySelectors$Factory,
  EntitySelectorsFactory,
  EntityServices,
  EntityServicesBase,
  EntityServicesElements,
  HttpUrlGenerator,
  INITIAL_ENTITY_CACHE_STATE,
  LoadCollections,
  Logger,
  MergeQuerySet,
  MergeStrategy,
  OP_ERROR,
  OP_SUCCESS,
  PLURAL_NAMES_TOKEN,
  PersistanceCanceled,
  PersistenceResultHandler,
  Pluralizer,
  PropsFilterFnFactory,
  SaveEntities,
  SaveEntitiesCancel,
  SaveEntitiesCanceled,
  SaveEntitiesError,
  SaveEntitiesSuccess,
  SetEntityCache,
  changeSetItemFactory,
  createEmptyEntityCollection,
  createEntityCacheSelector,
  createEntityDefinition,
  defaultSelectId,
  entityCacheSelectorProvider,
  excludeEmptyChangeSetItems,
  flattenArgs,
  getGuid,
  getGuidComb,
  guidComparer,
  makeErrorOp,
  makeSuccessOp,
  normalizeRoot,
  ofEntityOp,
  ofEntityType,
  persistOps,
  provideEntityData,
  toUpdateFactory,
  withEffects
};
//# sourceMappingURL=ngrx-data.mjs.map
