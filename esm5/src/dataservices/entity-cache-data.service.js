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
 * Generated from: src/dataservices/entity-cache-data.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { ChangeSetOperation, excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
/** @type {?} */
var updateOp = ChangeSetOperation.Update;
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
    /**
     * Save changes to multiple entities across one or more entity collections.
     * Server endpoint must understand the essential SaveEntities protocol,
     * in particular the ChangeSet interface (except for Update<T>).
     * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
     * It then reconstructs Update<T>[] in the returned observable result.
     * @param {?} changeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param {?} url The server endpoint that receives this request.
     * @return {?}
     */
    EntityCacheDataService.prototype.saveEntities = /**
     * Save changes to multiple entities across one or more entity collections.
     * Server endpoint must understand the essential SaveEntities protocol,
     * in particular the ChangeSet interface (except for Update<T>).
     * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
     * It then reconstructs Update<T>[] in the returned observable result.
     * @param {?} changeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param {?} url The server endpoint that receives this request.
     * @return {?}
     */
    function (changeSet, url) {
        var _this = this;
        changeSet = this.filterChangeSet(changeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        changeSet = this.flattenUpdates(changeSet);
        /** @type {?} */
        var result$ = this.http
            .post(url, changeSet)
            .pipe(map((/**
         * @param {?} result
         * @return {?}
         */
        function (result) { return _this.restoreUpdates(result); })), catchError(this.handleError({ method: 'POST', url: url, data: changeSet })));
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }
        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }
        return result$;
    };
    // #region helpers
    // #region helpers
    /**
     * @protected
     * @param {?} reqData
     * @return {?}
     */
    EntityCacheDataService.prototype.handleError = 
    // #region helpers
    /**
     * @protected
     * @param {?} reqData
     * @return {?}
     */
    function (reqData) {
        return (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            /** @type {?} */
            var error = new DataServiceError(err, reqData);
            return throwError(error);
        });
    };
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @protected
     * @param {?} changeSet ChangeSet with changes to filter
     * @return {?}
     */
    EntityCacheDataService.prototype.filterChangeSet = /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @protected
     * @param {?} changeSet ChangeSet with changes to filter
     * @return {?}
     */
    function (changeSet) {
        return excludeEmptyChangeSetItems(changeSet);
    };
    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    /**
     * Convert the entities in update changes from \@ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     * @protected
     * @param {?} changeSet
     * @return {?}
     */
    EntityCacheDataService.prototype.flattenUpdates = /**
     * Convert the entities in update changes from \@ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     * @protected
     * @param {?} changeSet
     * @return {?}
     */
    function (changeSet) {
        /** @type {?} */
        var changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        /** @type {?} */
        var hasMutated = false;
        changes = (/** @type {?} */ (changes.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return __assign(__assign({}, item), { entities: ((/** @type {?} */ (item))).entities.map((/**
                     * @param {?} u
                     * @return {?}
                     */
                    function (u) { return u.changes; })) });
            }
            else {
                return item;
            }
        }))));
        return hasMutated ? __assign(__assign({}, changeSet), { changes: changes }) : changeSet;
    };
    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    /**
     * Convert the flattened T entities in update changes back to \@ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     * @protected
     * @param {?} changeSet
     * @return {?}
     */
    EntityCacheDataService.prototype.restoreUpdates = /**
     * Convert the flattened T entities in update changes back to \@ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     * @protected
     * @param {?} changeSet
     * @return {?}
     */
    function (changeSet) {
        var _this = this;
        if (changeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return changeSet;
        }
        /** @type {?} */
        var changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        /** @type {?} */
        var hasMutated = false;
        changes = (/** @type {?} */ (changes.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                /** @type {?} */
                var selectId_1 = _this.getIdSelector(item.entityName);
                return (/** @type {?} */ (__assign(__assign({}, item), { entities: item.entities.map((/**
                     * @param {?} u
                     * @return {?}
                     */
                    function (u) { return ({
                        id: selectId_1(u),
                        changes: u,
                    }); })) })));
            }
            else {
                return item;
            }
        }))));
        return hasMutated ? __assign(__assign({}, changeSet), { changes: changes }) : changeSet;
    };
    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    /**
     * Get the id (primary key) selector function for an entity type
     * @protected
     * @param {?} entityName name of the entity type
     * @return {?}
     */
    EntityCacheDataService.prototype.getIdSelector = /**
     * Get the id (primary key) selector function for an entity type
     * @protected
     * @param {?} entityName name of the entity type
     * @return {?}
     */
    function (entityName) {
        /** @type {?} */
        var idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector = this.entityDefinitionService.getDefinition(entityName)
                .selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    };
    EntityCacheDataService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityCacheDataService.ctorParameters = function () { return [
        { type: EntityDefinitionService },
        { type: HttpClient },
        { type: DefaultDataServiceConfig, decorators: [{ type: Optional }] }
    ]; };
    return EntityCacheDataService;
}());
export { EntityCacheDataService };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.idSelectors;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.saveDelay;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.timeout;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.entityDefinitionService;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.http;
}
//# sourceMappingURL=entity-cache-data.service.js.map