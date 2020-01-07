/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dataservices/default-data.service.ts
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
export class DefaultDataService {
    /**
     * @param {?} entityName
     * @param {?} http
     * @param {?} httpUrlGenerator
     * @param {?=} config
     */
    constructor(entityName, http, httpUrlGenerator, config) {
        this.http = http;
        this.httpUrlGenerator = httpUrlGenerator;
        this.getDelay = 0;
        this.saveDelay = 0;
        this.timeout = 0;
        this._name = `${entityName} DefaultDataService`;
        this.entityName = entityName;
        const { root = 'api', delete404OK = true, getDelay = 0, saveDelay = 0, timeout: to = 0, } = config || {};
        this.delete404OK = delete404OK;
        this.entityUrl = httpUrlGenerator.entityResource(entityName, root);
        this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
        this.getDelay = getDelay;
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
    /**
     * @return {?}
     */
    get name() {
        return this._name;
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    add(entity) {
        /** @type {?} */
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
        return this.execute('POST', this.entityUrl, entityOrError);
    }
    /**
     * @param {?} key
     * @return {?}
     */
    delete(key) {
        /** @type {?} */
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to delete`);
        }
        return this.execute('DELETE', this.entityUrl + key, err).pipe(
        // forward the id of deleted entity as the result of the HTTP DELETE
        map((/**
         * @param {?} result
         * @return {?}
         */
        result => (/** @type {?} */ (key)))));
    }
    /**
     * @return {?}
     */
    getAll() {
        return this.execute('GET', this.entitiesUrl);
    }
    /**
     * @param {?} key
     * @return {?}
     */
    getById(key) {
        /** @type {?} */
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to get`);
        }
        return this.execute('GET', this.entityUrl + key, err);
    }
    /**
     * @param {?} queryParams
     * @return {?}
     */
    getWithQuery(queryParams) {
        /** @type {?} */
        const qParams = typeof queryParams === 'string'
            ? { fromString: queryParams }
            : { fromObject: queryParams };
        /** @type {?} */
        const params = new HttpParams(qParams);
        return this.execute('GET', this.entitiesUrl, undefined, { params });
    }
    /**
     * @param {?} update
     * @return {?}
     */
    update(update) {
        /** @type {?} */
        const id = update && update.id;
        /** @type {?} */
        const updateOrError = id == null
            ? new Error(`No "${this.entityName}" update data or id`)
            : update.changes;
        return this.execute('PUT', this.entityUrl + id, updateOrError);
    }
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    /**
     * @param {?} entity
     * @return {?}
     */
    upsert(entity) {
        /** @type {?} */
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to upsert`);
        return this.execute('POST', this.entityUrl, entityOrError);
    }
    /**
     * @protected
     * @param {?} method
     * @param {?} url
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    execute(method, url, data, // data, error, or undefined/null
    options) {
        /** @type {?} */
        const req = { method, url, data, options };
        if (data instanceof Error) {
            return this.handleError(req)(data);
        }
        /** @type {?} */
        let result$;
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
                const error = new Error('Unimplemented HTTP method, ' + method);
                result$ = throwError(error);
            }
        }
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout + this.saveDelay));
        }
        return result$.pipe(catchError(this.handleError(req)));
    }
    /**
     * @private
     * @param {?} reqData
     * @return {?}
     */
    handleError(reqData) {
        return (/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            /** @type {?} */
            const ok = this.handleDelete404(err, reqData);
            if (ok) {
                return ok;
            }
            /** @type {?} */
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        });
    }
    /**
     * @private
     * @param {?} error
     * @param {?} reqData
     * @return {?}
     */
    handleDelete404(error, reqData) {
        if (error.status === 404 &&
            reqData.method === 'DELETE' &&
            this.delete404OK) {
            return of({});
        }
        return undefined;
    }
}
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
export class DefaultDataServiceFactory {
    /**
     * @param {?} http
     * @param {?} httpUrlGenerator
     * @param {?=} config
     */
    constructor(http, httpUrlGenerator, config) {
        this.http = http;
        this.httpUrlGenerator = httpUrlGenerator;
        this.config = config;
        config = config || {};
        httpUrlGenerator.registerHttpResourceUrls(config.entityHttpResourceUrls);
    }
    /**
     * Create a default {EntityCollectionDataService} for the given entity type
     * @template T
     * @param {?} entityName {string} Name of the entity type for this data service
     * @return {?}
     */
    create(entityName) {
        return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
    }
}
DefaultDataServiceFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DefaultDataServiceFactory.ctorParameters = () => [
    { type: HttpClient },
    { type: HttpUrlGenerator },
    { type: DefaultDataServiceConfig, decorators: [{ type: Optional }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFDTCxVQUFVLEVBRVYsVUFBVSxHQUNYLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSWpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBT3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7O0FBT3hELE1BQU0sT0FBTyxrQkFBa0I7Ozs7Ozs7SUFjN0IsWUFDRSxVQUFrQixFQUNSLElBQWdCLEVBQ2hCLGdCQUFrQyxFQUM1QyxNQUFpQztRQUZ2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFYcEMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBWXBCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLHFCQUFxQixDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO2NBQ3ZCLEVBQ0osSUFBSSxHQUFHLEtBQUssRUFDWixXQUFXLEdBQUcsSUFBSSxFQUNsQixR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d0JBQXdCLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDM0UsQ0FBQzs7Ozs7OztJQU1ELE1BQU0sQ0FBSSxVQUFrQjtRQUMxQixPQUFPLElBQUksa0JBQWtCLENBQzNCLFVBQVUsRUFDVixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxnQkFBZ0IsRUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FDWixDQUFDO0lBQ0osQ0FBQzs7O1lBdEJGLFVBQVU7Ozs7WUF4TVQsVUFBVTtZQWtCSCxnQkFBZ0I7WUFQaEIsd0JBQXdCLHVCQWtNNUIsUUFBUTs7Ozs7OztJQUZULHlDQUEwQjs7Ozs7SUFDMUIscURBQTRDOzs7OztJQUM1QywyQ0FBdUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cENsaWVudCxcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBQYXJhbXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBtYXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcgfSBmcm9tICcuL2RlZmF1bHQtZGF0YS1zZXJ2aWNlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2UsXG4gIEh0dHBNZXRob2RzLFxuICBRdWVyeVBhcmFtcyxcbiAgUmVxdWVzdERhdGEsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBIdHRwVXJsR2VuZXJhdG9yIH0gZnJvbSAnLi9odHRwLXVybC1nZW5lcmF0b3InO1xuXG4vKipcbiAqIEEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGRlbGV0ZTQwNE9LOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXR5VXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdGllc1VybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZ2V0RGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLl9uYW1lID0gYCR7ZW50aXR5TmFtZX0gRGVmYXVsdERhdGFTZXJ2aWNlYDtcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBlbnRpdHlOYW1lO1xuICAgIGNvbnN0IHtcbiAgICAgIHJvb3QgPSAnYXBpJyxcbiAgICAgIGRlbGV0ZTQwNE9LID0gdHJ1ZSxcbiAgICAgIGdldERlbGF5ID0gMCxcbiAgICAgIHNhdmVEZWxheSA9IDAsXG4gICAgICB0aW1lb3V0OiB0byA9IDAsXG4gICAgfSA9XG4gICAgICBjb25maWcgfHwge307XG4gICAgdGhpcy5kZWxldGU0MDRPSyA9IGRlbGV0ZTQwNE9LO1xuICAgIHRoaXMuZW50aXR5VXJsID0gaHR0cFVybEdlbmVyYXRvci5lbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lLCByb290KTtcbiAgICB0aGlzLmVudGl0aWVzVXJsID0gaHR0cFVybEdlbmVyYXRvci5jb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZSwgcm9vdCk7XG4gICAgdGhpcy5nZXREZWxheSA9IGdldERlbGF5O1xuICAgIHRoaXMuc2F2ZURlbGF5ID0gc2F2ZURlbGF5O1xuICAgIHRoaXMudGltZW91dCA9IHRvO1xuICB9XG5cbiAgYWRkKGVudGl0eTogVCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGVudGl0eU9yRXJyb3IgPVxuICAgICAgZW50aXR5IHx8IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBlbnRpdHkgdG8gYWRkYCk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUE9TVCcsIHRoaXMuZW50aXR5VXJsLCBlbnRpdHlPckVycm9yKTtcbiAgfVxuXG4gIGRlbGV0ZShrZXk6IG51bWJlciB8IHN0cmluZyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGRlbGV0ZWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdERUxFVEUnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyKS5waXBlKFxuICAgICAgLy8gZm9yd2FyZCB0aGUgaWQgb2YgZGVsZXRlZCBlbnRpdHkgYXMgdGhlIHJlc3VsdCBvZiB0aGUgSFRUUCBERUxFVEVcbiAgICAgIG1hcChyZXN1bHQgPT4ga2V5IGFzIG51bWJlciB8IHN0cmluZylcbiAgICApO1xuICB9XG5cbiAgZ2V0QWxsKCk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCk7XG4gIH1cblxuICBnZXRCeUlkKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGdldGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyKTtcbiAgfVxuXG4gIGdldFdpdGhRdWVyeShxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIGNvbnN0IHFQYXJhbXMgPVxuICAgICAgdHlwZW9mIHF1ZXJ5UGFyYW1zID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZnJvbVN0cmluZzogcXVlcnlQYXJhbXMgfVxuICAgICAgICA6IHsgZnJvbU9iamVjdDogcXVlcnlQYXJhbXMgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyhxUGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsLCB1bmRlZmluZWQsIHsgcGFyYW1zIH0pO1xuICB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVXBkYXRlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgaWQgPSB1cGRhdGUgJiYgdXBkYXRlLmlkO1xuICAgIGNvbnN0IHVwZGF0ZU9yRXJyb3IgPVxuICAgICAgaWQgPT0gbnVsbFxuICAgICAgICA/IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiB1cGRhdGUgZGF0YSBvciBpZGApXG4gICAgICAgIDogdXBkYXRlLmNoYW5nZXM7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUFVUJywgdGhpcy5lbnRpdHlVcmwgKyBpZCwgdXBkYXRlT3JFcnJvcik7XG4gIH1cblxuICAvLyBJbXBvcnRhbnQhIE9ubHkgY2FsbCBpZiB0aGUgYmFja2VuZCBzZXJ2aWNlIHN1cHBvcnRzIHVwc2VydHMgYXMgYSBQT1NUIHRvIHRoZSB0YXJnZXQgVVJMXG4gIHVwc2VydChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIHVwc2VydGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhlY3V0ZShcbiAgICBtZXRob2Q6IEh0dHBNZXRob2RzLFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksIC8vIGRhdGEsIGVycm9yLCBvciB1bmRlZmluZWQvbnVsbFxuICAgIG9wdGlvbnM/OiBhbnlcbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCByZXE6IFJlcXVlc3REYXRhID0geyBtZXRob2QsIHVybCwgZGF0YSwgb3B0aW9ucyB9O1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IocmVxKShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0JDogT2JzZXJ2YWJsZTxBcnJheUJ1ZmZlcj47XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnREVMRVRFJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdHRVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLmdldERlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLmdldERlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdQT1NUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnBvc3QodXJsLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gTi5CLjogSXQgbXVzdCByZXR1cm4gYW4gVXBkYXRlPFQ+XG4gICAgICBjYXNlICdQVVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucHV0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQgSFRUUCBtZXRob2QsICcgKyBtZXRob2QpO1xuICAgICAgICByZXN1bHQkID0gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUodGltZW91dCh0aGlzLnRpbWVvdXQgKyB0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0JC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcihyZXEpKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgb2sgPSB0aGlzLmhhbmRsZURlbGV0ZTQwNChlcnIsIHJlcURhdGEpO1xuICAgICAgaWYgKG9rKSB7XG4gICAgICAgIHJldHVybiBvaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVEZWxldGU0MDQoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlLCByZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIGlmIChcbiAgICAgIGVycm9yLnN0YXR1cyA9PT0gNDA0ICYmXG4gICAgICByZXFEYXRhLm1ldGhvZCA9PT0gJ0RFTEVURScgJiZcbiAgICAgIHRoaXMuZGVsZXRlNDA0T0tcbiAgICApIHtcbiAgICAgIHJldHVybiBvZih7fSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBodHRwVXJsR2VuZXJhdG9yLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhjb25maWcuZW50aXR5SHR0cFJlc291cmNlVXJscyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCB7RW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlfSBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGRhdGEgc2VydmljZVxuICAgKi9cbiAgY3JlYXRlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5odHRwLFxuICAgICAgdGhpcy5odHRwVXJsR2VuZXJhdG9yLFxuICAgICAgdGhpcy5jb25maWdcbiAgICApO1xuICB9XG59XG4iXX0=