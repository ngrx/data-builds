/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/default-data.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpParams, } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { DataServiceError } from './data-service-error';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { HttpUrlGenerator } from './http-url-generator';
/**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 * @template T
 */
var /**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 * @template T
 */
DefaultDataService = /** @class */ (function () {
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
        get: /**
         * @return {?}
         */
        function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} entity
     * @return {?}
     */
    DefaultDataService.prototype.add = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var entityOrError = entity || new Error("No \"" + this.entityName + "\" entity to add");
        return this.execute('POST', this.entityUrl, entityOrError);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    DefaultDataService.prototype.delete = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var err;
        if (key == null) {
            err = new Error("No \"" + this.entityName + "\" key to delete");
        }
        return this.execute('DELETE', this.entityUrl + key, err).pipe(
        // forward the id of deleted entity as the result of the HTTP DELETE
        map((/**
         * @param {?} result
         * @return {?}
         */
        function (result) { return (/** @type {?} */ (key)); })));
    };
    /**
     * @return {?}
     */
    DefaultDataService.prototype.getAll = /**
     * @return {?}
     */
    function () {
        return this.execute('GET', this.entitiesUrl);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    DefaultDataService.prototype.getById = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var err;
        if (key == null) {
            err = new Error("No \"" + this.entityName + "\" key to get");
        }
        return this.execute('GET', this.entityUrl + key, err);
    };
    /**
     * @param {?} queryParams
     * @return {?}
     */
    DefaultDataService.prototype.getWithQuery = /**
     * @param {?} queryParams
     * @return {?}
     */
    function (queryParams) {
        /** @type {?} */
        var qParams = typeof queryParams === 'string'
            ? { fromString: queryParams }
            : { fromObject: queryParams };
        /** @type {?} */
        var params = new HttpParams(qParams);
        return this.execute('GET', this.entitiesUrl, undefined, { params: params });
    };
    /**
     * @param {?} update
     * @return {?}
     */
    DefaultDataService.prototype.update = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        /** @type {?} */
        var id = update && update.id;
        /** @type {?} */
        var updateOrError = id == null
            ? new Error("No \"" + this.entityName + "\" update data or id")
            : update.changes;
        return this.execute('PUT', this.entityUrl + id, updateOrError);
    };
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    /**
     * @param {?} entity
     * @return {?}
     */
    DefaultDataService.prototype.upsert = 
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var entityOrError = entity || new Error("No \"" + this.entityName + "\" entity to upsert");
        return this.execute('POST', this.entityUrl, entityOrError);
    };
    /**
     * @protected
     * @param {?} method
     * @param {?} url
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    DefaultDataService.prototype.execute = /**
     * @protected
     * @param {?} method
     * @param {?} url
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    function (method, url, data, // data, error, or undefined/null
    options) {
        /** @type {?} */
        var req = { method: method, url: url, data: data, options: options };
        if (data instanceof Error) {
            return this.handleError(req)(data);
        }
        /** @type {?} */
        var result$;
        switch (method) {
            case 'DELETE': {
                result$ = this.http.delete(url, options);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            case 'GET': {
                result$ = this.http.get(url, options);
                if (this.getDelay) {
                    result$ = result$.pipe(delay(this.getDelay));
                }
                break;
            }
            case 'POST': {
                result$ = this.http.post(url, data, options);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            // N.B.: It must return an Update<T>
            case 'PUT': {
                result$ = this.http.put(url, data, options);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            default: {
                /** @type {?} */
                var error = new Error('Unimplemented HTTP method, ' + method);
                result$ = throwError(error);
            }
        }
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout + this.saveDelay));
        }
        return result$.pipe(catchError(this.handleError(req)));
    };
    /**
     * @private
     * @param {?} reqData
     * @return {?}
     */
    DefaultDataService.prototype.handleError = /**
     * @private
     * @param {?} reqData
     * @return {?}
     */
    function (reqData) {
        var _this = this;
        return (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            /** @type {?} */
            var ok = _this.handleDelete404(err, reqData);
            if (ok) {
                return ok;
            }
            /** @type {?} */
            var error = new DataServiceError(err, reqData);
            return throwError(error);
        });
    };
    /**
     * @private
     * @param {?} error
     * @param {?} reqData
     * @return {?}
     */
    DefaultDataService.prototype.handleDelete404 = /**
     * @private
     * @param {?} error
     * @param {?} reqData
     * @return {?}
     */
    function (error, reqData) {
        if (error.status === 404 &&
            reqData.method === 'DELETE' &&
            this.delete404OK) {
            return of({});
        }
        return undefined;
    };
    return DefaultDataService;
}());
/**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 * @template T
 */
export { DefaultDataService };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype._name;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.delete404OK;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.entityName;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.entityUrl;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.entitiesUrl;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.getDelay;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.saveDelay;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.timeout;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.http;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataService.prototype.httpUrlGenerator;
}
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
    /**
     * Create a default {EntityCollectionDataService} for the given entity type
     * @template T
     * @param {?} entityName {string} Name of the entity type for this data service
     * @return {?}
     */
    DefaultDataServiceFactory.prototype.create = /**
     * Create a default {EntityCollectionDataService} for the given entity type
     * @template T
     * @param {?} entityName {string} Name of the entity type for this data service
     * @return {?}
     */
    function (entityName) {
        return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
    };
    DefaultDataServiceFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DefaultDataServiceFactory.ctorParameters = function () { return [
        { type: HttpClient },
        { type: HttpUrlGenerator },
        { type: DefaultDataServiceConfig, decorators: [{ type: Optional }] }
    ]; };
    return DefaultDataServiceFactory;
}());
export { DefaultDataServiceFactory };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    DefaultDataServiceFactory.prototype.http;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataServiceFactory.prototype.httpUrlGenerator;
    /**
     * @type {?}
     * @protected
     */
    DefaultDataServiceFactory.prototype.config;
}
//# sourceMappingURL=default-data.service.js.map