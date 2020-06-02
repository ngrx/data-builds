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
        { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFDTCxVQUFVLEVBRVYsVUFBVSxHQUNYLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSWpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBT3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7O0FBT3hEOzs7Ozs7O0lBY0UsNEJBQ0UsVUFBa0IsRUFDUixJQUFnQixFQUNoQixnQkFBa0MsRUFDNUMsTUFBaUM7UUFGdkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBWHBDLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztRQVlwQixJQUFJLENBQUMsS0FBSyxHQUFNLFVBQVUsd0JBQXFCLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDdkIsSUFBQSxpQkFPUSxFQU5aLFlBQVksRUFBWixpQ0FBWSxFQUNaLG1CQUFrQixFQUFsQix1Q0FBa0IsRUFDbEIsZ0JBQVksRUFBWixpQ0FBWSxFQUNaLGlC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QVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUEyQjtRQUV2RCxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN0QixnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0gsMENBQU07Ozs7OztJQUFOLFVBQVUsVUFBa0I7UUFDMUIsT0FBTyxJQUFJLGtCQUFrQixDQUMzQixVQUFVLEVBQ1YsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztJQUNKLENBQUM7O2dCQXRCRixVQUFVOzs7O2dCQXhNVCxVQUFVO2dCQWtCSCxnQkFBZ0I7Z0JBUGhCLHdCQUF3Qix1QkFrTTVCLFFBQVE7O0lBa0JiLGdDQUFDO0NBQUEsQUF2QkQsSUF1QkM7U0F0QlkseUJBQXlCOzs7Ozs7SUFFbEMseUNBQTBCOzs7OztJQUMxQixxREFBNEM7Ozs7O0lBQzVDLDJDQUF1RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIG1hcCwgdGltZW91dCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZSxcbiAgSHR0cE1ldGhvZHMsXG4gIFF1ZXJ5UGFyYW1zLFxuICBSZXF1ZXN0RGF0YSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEh0dHBVcmxHZW5lcmF0b3IgfSBmcm9tICcuL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbi8qKlxuICogQSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZTxUPiBpbXBsZW1lbnRzIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGVsZXRlNDA0T0s6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdHlVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0aWVzVXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBnZXREZWxheSA9IDA7XG4gIHByb3RlY3RlZCBzYXZlRGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgdGltZW91dCA9IDA7XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuX25hbWUgPSBgJHtlbnRpdHlOYW1lfSBEZWZhdWx0RGF0YVNlcnZpY2VgO1xuICAgIHRoaXMuZW50aXR5TmFtZSA9IGVudGl0eU5hbWU7XG4gICAgY29uc3Qge1xuICAgICAgcm9vdCA9ICdhcGknLFxuICAgICAgZGVsZXRlNDA0T0sgPSB0cnVlLFxuICAgICAgZ2V0RGVsYXkgPSAwLFxuICAgICAgc2F2ZURlbGF5ID0gMCxcbiAgICAgIHRpbWVvdXQ6IHRvID0gMCxcbiAgICB9ID1cbiAgICAgIGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLmRlbGV0ZTQwNE9LID0gZGVsZXRlNDA0T0s7XG4gICAgdGhpcy5lbnRpdHlVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmVudGl0eVJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZW50aXRpZXNVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lLCByb290KTtcbiAgICB0aGlzLmdldERlbGF5ID0gZ2V0RGVsYXk7XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICBhZGQoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byBhZGRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IpO1xuICB9XG5cbiAgZGVsZXRlKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZGVsZXRlYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0RFTEVURScsIHRoaXMuZW50aXR5VXJsICsga2V5LCBlcnIpLnBpcGUoXG4gICAgICAvLyBmb3J3YXJkIHRoZSBpZCBvZiBkZWxldGVkIGVudGl0eSBhcyB0aGUgcmVzdWx0IG9mIHRoZSBIVFRQIERFTEVURVxuICAgICAgbWFwKHJlc3VsdCA9PiBrZXkgYXMgbnVtYmVyIHwgc3RyaW5nKVxuICAgICk7XG4gIH1cblxuICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsKTtcbiAgfVxuXG4gIGdldEJ5SWQoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZ2V0YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXR5VXJsICsga2V5LCBlcnIpO1xuICB9XG5cbiAgZ2V0V2l0aFF1ZXJ5KHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgY29uc3QgcVBhcmFtcyA9XG4gICAgICB0eXBlb2YgcXVlcnlQYXJhbXMgPT09ICdzdHJpbmcnXG4gICAgICAgID8geyBmcm9tU3RyaW5nOiBxdWVyeVBhcmFtcyB9XG4gICAgICAgIDogeyBmcm9tT2JqZWN0OiBxdWVyeVBhcmFtcyB9O1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHFQYXJhbXMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXRpZXNVcmwsIHVuZGVmaW5lZCwgeyBwYXJhbXMgfSk7XG4gIH1cblxuICB1cGRhdGUodXBkYXRlOiBVcGRhdGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBpZCA9IHVwZGF0ZSAmJiB1cGRhdGUuaWQ7XG4gICAgY29uc3QgdXBkYXRlT3JFcnJvciA9XG4gICAgICBpZCA9PSBudWxsXG4gICAgICAgID8gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIHVwZGF0ZSBkYXRhIG9yIGlkYClcbiAgICAgICAgOiB1cGRhdGUuY2hhbmdlcztcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQVVQnLCB0aGlzLmVudGl0eVVybCArIGlkLCB1cGRhdGVPckVycm9yKTtcbiAgfVxuXG4gIC8vIEltcG9ydGFudCEgT25seSBjYWxsIGlmIHRoZSBiYWNrZW5kIHNlcnZpY2Ugc3VwcG9ydHMgdXBzZXJ0cyBhcyBhIFBPU1QgdG8gdGhlIHRhcmdldCBVUkxcbiAgdXBzZXJ0KGVudGl0eTogVCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGVudGl0eU9yRXJyb3IgPVxuICAgICAgZW50aXR5IHx8IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBlbnRpdHkgdG8gdXBzZXJ0YCk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUE9TVCcsIHRoaXMuZW50aXR5VXJsLCBlbnRpdHlPckVycm9yKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBleGVjdXRlKFxuICAgIG1ldGhvZDogSHR0cE1ldGhvZHMsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSwgLy8gZGF0YSwgZXJyb3IsIG9yIHVuZGVmaW5lZC9udWxsXG4gICAgb3B0aW9ucz86IGFueVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IHJlcTogUmVxdWVzdERhdGEgPSB7IG1ldGhvZCwgdXJsLCBkYXRhLCBvcHRpb25zIH07XG5cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvcihyZXEpKGRhdGEpO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQkOiBPYnNlcnZhYmxlPEFycmF5QnVmZmVyPjtcblxuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdERUxFVEUnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZGVsZXRlKHVybCwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0dFVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5nZXQodXJsLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0RGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuZ2V0RGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ1BPU1QnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucG9zdCh1cmwsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICAvLyBOLkIuOiBJdCBtdXN0IHJldHVybiBhbiBVcGRhdGU8VD5cbiAgICAgIGNhc2UgJ1BVVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wdXQodXJsLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignVW5pbXBsZW1lbnRlZCBIVFRQIG1ldGhvZCwgJyArIG1ldGhvZCk7XG4gICAgICAgIHJlc3VsdCQgPSB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZSh0aW1lb3V0KHRoaXMudGltZW91dCArIHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQkLnBpcGUoY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yKHJlcSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IocmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICByZXR1cm4gKGVycjogYW55KSA9PiB7XG4gICAgICBjb25zdCBvayA9IHRoaXMuaGFuZGxlRGVsZXRlNDA0KGVyciwgcmVxRGF0YSk7XG4gICAgICBpZiAob2spIHtcbiAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIHJlcURhdGEpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZURlbGV0ZTQwNChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UsIHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgaWYgKFxuICAgICAgZXJyb3Iuc3RhdHVzID09PSA0MDQgJiZcbiAgICAgIHJlcURhdGEubWV0aG9kID09PSAnREVMRVRFJyAmJlxuICAgICAgdGhpcy5kZWxldGU0MDRPS1xuICAgICkge1xuICAgICAgcmV0dXJuIG9mKHt9KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGh0dHBVcmxHZW5lcmF0b3IucmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKGNvbmZpZy5lbnRpdHlIdHRwUmVzb3VyY2VVcmxzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHtFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2V9IGZvciB0aGUgZ2l2ZW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgZGF0YSBzZXJ2aWNlXG4gICAqL1xuICBjcmVhdGU8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IERlZmF1bHREYXRhU2VydmljZTxUPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmh0dHAsXG4gICAgICB0aGlzLmh0dHBVcmxHZW5lcmF0b3IsXG4gICAgICB0aGlzLmNvbmZpZ1xuICAgICk7XG4gIH1cbn1cbiJdfQ==