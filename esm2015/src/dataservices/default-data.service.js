/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUNMLFVBQVUsRUFFVixVQUFVLEdBQ1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQU8sT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJdEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFPekUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7QUFPeEQsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7OztJQWM3QixZQUNFLFVBQWtCLEVBQ1IsSUFBZ0IsRUFDaEIsZ0JBQWtDLEVBQzVDLE1BQWlDO1FBRnZCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVhwQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFZcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUscUJBQXFCLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7Y0FDdkIsRUFDSixJQUFJLEdBQUcsS0FBSyxFQUNaLFdBQVcsR0FBRyxJQUFJLEVBQ2xCLFFB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QkFBd0IsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMzRSxDQUFDOzs7Ozs7O0lBTUQsTUFBTSxDQUFJLFVBQWtCO1FBQzFCLE9BQU8sSUFBSSxrQkFBa0IsQ0FDM0IsVUFBVSxFQUNWLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLGdCQUFnQixFQUNyQixJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7SUFDSixDQUFDOzs7WUF0QkYsVUFBVTs7OztZQXhNVCxVQUFVO1lBa0JILGdCQUFnQjtZQVBoQix3QkFBd0IsdUJBa001QixRQUFROzs7Ozs7O0lBRlQseUNBQTBCOzs7OztJQUMxQixxREFBNEM7Ozs7O0lBQzVDLDJDQUF1RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIG1hcCwgdGFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlLFxuICBIdHRwTWV0aG9kcyxcbiAgUXVlcnlQYXJhbXMsXG4gIFJlcXVlc3REYXRhLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSHR0cFVybEdlbmVyYXRvciB9IGZyb20gJy4vaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuLyoqXG4gKiBBIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBkZWxldGU0MDRPSzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGVudGl0eU5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0eVVybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXRpZXNVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGdldERlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5fbmFtZSA9IGAke2VudGl0eU5hbWV9IERlZmF1bHREYXRhU2VydmljZWA7XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICBjb25zdCB7XG4gICAgICByb290ID0gJ2FwaScsXG4gICAgICBkZWxldGU0MDRPSyA9IHRydWUsXG4gICAgICBnZXREZWxheSA9IDAsXG4gICAgICBzYXZlRGVsYXkgPSAwLFxuICAgICAgdGltZW91dDogdG8gPSAwLFxuICAgIH0gPVxuICAgICAgY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuZGVsZXRlNDA0T0sgPSBkZWxldGU0MDRPSztcbiAgICB0aGlzLmVudGl0eVVybCA9IGh0dHBVcmxHZW5lcmF0b3IuZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZSwgcm9vdCk7XG4gICAgdGhpcy5lbnRpdGllc1VybCA9IGh0dHBVcmxHZW5lcmF0b3IuY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZ2V0RGVsYXkgPSBnZXREZWxheTtcbiAgICB0aGlzLnNhdmVEZWxheSA9IHNhdmVEZWxheTtcbiAgICB0aGlzLnRpbWVvdXQgPSB0bztcbiAgfVxuXG4gIGFkZChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIGFkZGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBkZWxldGUoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBkZWxldGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnREVMRVRFJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycikucGlwZShcbiAgICAgIC8vIGZvcndhcmQgdGhlIGlkIG9mIGRlbGV0ZWQgZW50aXR5IGFzIHRoZSByZXN1bHQgb2YgdGhlIEhUVFAgREVMRVRFXG4gICAgICBtYXAocmVzdWx0ID0+IGtleSBhcyBudW1iZXIgfCBzdHJpbmcpXG4gICAgKTtcbiAgfVxuXG4gIGdldEFsbCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXRpZXNVcmwpO1xuICB9XG5cbiAgZ2V0QnlJZChrZXk6IG51bWJlciB8IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBnZXRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycik7XG4gIH1cblxuICBnZXRXaXRoUXVlcnkocXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBjb25zdCBxUGFyYW1zID1cbiAgICAgIHR5cGVvZiBxdWVyeVBhcmFtcyA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7IGZyb21TdHJpbmc6IHF1ZXJ5UGFyYW1zIH1cbiAgICAgICAgOiB7IGZyb21PYmplY3Q6IHF1ZXJ5UGFyYW1zIH07XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMocVBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCwgdW5kZWZpbmVkLCB7IHBhcmFtcyB9KTtcbiAgfVxuXG4gIHVwZGF0ZSh1cGRhdGU6IFVwZGF0ZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGlkID0gdXBkYXRlICYmIHVwZGF0ZS5pZDtcbiAgICBjb25zdCB1cGRhdGVPckVycm9yID1cbiAgICAgIGlkID09IG51bGxcbiAgICAgICAgPyBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgdXBkYXRlIGRhdGEgb3IgaWRgKVxuICAgICAgICA6IHVwZGF0ZS5jaGFuZ2VzO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BVVCcsIHRoaXMuZW50aXR5VXJsICsgaWQsIHVwZGF0ZU9yRXJyb3IpO1xuICB9XG5cbiAgLy8gSW1wb3J0YW50ISBPbmx5IGNhbGwgaWYgdGhlIGJhY2tlbmQgc2VydmljZSBzdXBwb3J0cyB1cHNlcnRzIGFzIGEgUE9TVCB0byB0aGUgdGFyZ2V0IFVSTFxuICB1cHNlcnQoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byB1cHNlcnRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGV4ZWN1dGUoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kcyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LCAvLyBkYXRhLCBlcnJvciwgb3IgdW5kZWZpbmVkL251bGxcbiAgICBvcHRpb25zPzogYW55XG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgcmVxOiBSZXF1ZXN0RGF0YSA9IHsgbWV0aG9kLCB1cmwsIGRhdGEsIG9wdGlvbnMgfTtcblxuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKHJlcSkoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8QXJyYXlCdWZmZXI+O1xuXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ0RFTEVURSc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5kZWxldGUodXJsLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnR0VUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmdldCh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5nZXREZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5nZXREZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnUE9TVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wb3N0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIE4uQi46IEl0IG11c3QgcmV0dXJuIGFuIFVwZGF0ZTxUPlxuICAgICAgY2FzZSAnUFVUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnB1dCh1cmwsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdVbmltcGxlbWVudGVkIEhUVFAgbWV0aG9kLCAnICsgbWV0aG9kKTtcbiAgICAgICAgcmVzdWx0JCA9IHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0ICsgdGhpcy5zYXZlRGVsYXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCQucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IocmVxKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG9rID0gdGhpcy5oYW5kbGVEZWxldGU0MDQoZXJyLCByZXFEYXRhKTtcbiAgICAgIGlmIChvaykge1xuICAgICAgICByZXR1cm4gb2s7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgcmVxRGF0YSk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRGVsZXRlNDA0KGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSwgcmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICBpZiAoXG4gICAgICBlcnJvci5zdGF0dXMgPT09IDQwNCAmJlxuICAgICAgcmVxRGF0YS5tZXRob2QgPT09ICdERUxFVEUnICYmXG4gICAgICB0aGlzLmRlbGV0ZTQwNE9LXG4gICAgKSB7XG4gICAgICByZXR1cm4gb2Yoe30pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgaHR0cFVybEdlbmVyYXRvci5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoY29uZmlnLmVudGl0eUh0dHBSZXNvdXJjZVVybHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRlZmF1bHQge0VudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZX0gZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3IgdGhpcyBkYXRhIHNlcnZpY2VcbiAgICovXG4gIGNyZWF0ZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICAgIHJldHVybiBuZXcgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuaHR0cCxcbiAgICAgIHRoaXMuaHR0cFVybEdlbmVyYXRvcixcbiAgICAgIHRoaXMuY29uZmlnXG4gICAgKTtcbiAgfVxufVxuIl19