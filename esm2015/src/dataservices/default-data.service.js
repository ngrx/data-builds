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
        (result) => (/** @type {?} */ (key)))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFDTCxVQUFVLEVBRVYsVUFBVSxHQUNYLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSWpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBT3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7O0FBT3hELE1BQU0sT0FBTyxrQkFBa0I7Ozs7Ozs7SUFjN0IsWUFDRSxVQUFrQixFQUNSLElBQWdCLEVBQ2hCLGdCQUFrQyxFQUM1QyxNQUFpQztRQUZ2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFYcEMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBWXBCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLHFCQUFxQixDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO2NBQ3ZCLEVBQ0osSUFBSSxHQUFHLEtBQUssRUFDWixXQUFXLEdBQUcsSUFBSSxFQUNsQixRQUFRLEdBQUcsQ0FBQyxFQUNaLFNBQVMsR0FBRyxDQUFDLEVBQ2IsT0FBTyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQ2hCLEdBQUcsTUFBTSxJQUFJLEVBQUU7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Ozs7SUF6QkQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBeUJELEdBQUcsQ0FBQyxNQUFTOztjQUNMLGFBQWEsR0FDakIsTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsaUJBQWlCLENBQUM7UUFDOUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzdELENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLEdBQW9COztZQUNyQixHQUFzQjtRQUMxQixJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDZixHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxpQkFBaUIsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJO1FBQzNELG9FQUFvRTtRQUNwRSxHQUFHOzs7O1FBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLG1CQUFBLEdBQUcsRUFBbUIsRUFBQyxDQUN4QyxDQUFDO0lBQ0osQ0FBQzs7OztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7OztJQUVELE9BQU8sQ0FBQyxHQUFvQjs7WUFDdEIsR0FBc0I7UUFDMUIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2YsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsY0FBYyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Ozs7O0lBRUQsWUFBWSxDQUFDLFdBQWlDOztjQUN0QyxPQUFPLEdBQ1gsT0FBTyxXQUFXLEtBQUssUUFBUTtZQUM3QixDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO1lBQzdCLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUU7O2NBQzNCLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsTUFBaUI7O2NBQ2hCLEVBQUUsR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLEVBQUU7O2NBQ3hCLGFBQWEsR0FDakIsRUFBRSxJQUFJLElBQUk7WUFDUixDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxxQkFBcUIsQ0FBQztZQUN4RCxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU87UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7Ozs7SUFHRCxNQUFNLENBQUMsTUFBUzs7Y0FDUixhQUFhLEdBQ2pCLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxVQUFVLG9CQUFvQixDQUFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM3RCxDQUFDOzs7Ozs7Ozs7SUFFUyxPQUFPLENBQ2YsTUFBbUIsRUFDbkIsR0FBVyxFQUNYLElBQVUsRUFBRSxpQ0FBaUM7SUFDN0MsT0FBYTs7Y0FFUCxHQUFHLEdBQWdCLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1FBRXZELElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7O1lBRUcsT0FBZ0M7UUFFcEMsUUFBUSxNQUFNLEVBQUU7WUFDZCxLQUFLLFFBQVEsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDbEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUMvQztnQkFDRCxNQUFNO2FBQ1A7WUFDRCxLQUFLLEtBQUssQ0FBQyxDQUFDO2dCQUNWLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2lCQUM5QztnQkFDRCxNQUFNO2FBQ1A7WUFDRCxLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztpQkFDL0M7Z0JBQ0QsTUFBTTthQUNQO1lBQ0Qsb0NBQW9DO1lBQ3BDLEtBQUssS0FBSyxDQUFDLENBQUM7Z0JBQ1YsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDbEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUMvQztnQkFDRCxNQUFNO2FBQ1A7WUFDRCxPQUFPLENBQUMsQ0FBQzs7c0JBQ0QsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLDZCQUE2QixHQUFHLE1BQU0sQ0FBQztnQkFDL0QsT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM3QjtTQUNGO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDOzs7Ozs7SUFFTyxXQUFXLENBQUMsT0FBb0I7UUFDdEM7Ozs7UUFBTyxDQUFDLEdBQVEsRUFBRSxFQUFFOztrQkFDWixFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1lBQzdDLElBQUksRUFBRSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxDQUFDO2FBQ1g7O2tCQUNLLEtBQUssR0FBRyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7WUFDaEQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxFQUFDO0lBQ0osQ0FBQzs7Ozs7OztJQUVPLGVBQWUsQ0FBQyxLQUF3QixFQUFFLE9BQW9CO1FBQ3BFLElBQ0UsS0FBSyxDQUFDLE1BQU0sS0FBSyxHQUFHO1lBQ3BCLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUTtZQUMzQixJQUFJLENBQUMsV0FBVyxFQUNoQjtZQUNBLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7Ozs7OztJQXRLQyxtQ0FBd0I7Ozs7O0lBQ3hCLHlDQUErQjs7Ozs7SUFDL0Isd0NBQTZCOzs7OztJQUM3Qix1Q0FBNEI7Ozs7O0lBQzVCLHlDQUE4Qjs7Ozs7SUFDOUIsc0NBQXVCOzs7OztJQUN2Qix1Q0FBd0I7Ozs7O0lBQ3hCLHFDQUFzQjs7Ozs7SUFRcEIsa0NBQTBCOzs7OztJQUMxQiw4Q0FBNEM7Ozs7Ozs7QUE4SmhELE1BQU0sT0FBTyx5QkFBeUI7Ozs7OztJQUNwQyxZQUNZLElBQWdCLEVBQ2hCLGdCQUFrQyxFQUN0QixNQUFpQztRQUY3QyxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBMkI7UUFFdkQsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDdEIsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDM0UsQ0FBQzs7Ozs7OztJQU1ELE1BQU0sQ0FBSSxVQUFrQjtRQUMxQixPQUFPLElBQUksa0JBQWtCLENBQzNCLFVBQVUsRUFDVixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxnQkFBZ0IsRUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FDWixDQUFDO0lBQ0osQ0FBQzs7O1lBdEJGLFVBQVU7Ozs7WUF2TVQsVUFBVTtZQWtCSCxnQkFBZ0I7WUFQaEIsd0JBQXdCLHVCQWlNNUIsUUFBUTs7Ozs7OztJQUZULHlDQUEwQjs7Ozs7SUFDMUIscURBQTRDOzs7OztJQUM1QywyQ0FBdUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cENsaWVudCxcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBQYXJhbXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBtYXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcgfSBmcm9tICcuL2RlZmF1bHQtZGF0YS1zZXJ2aWNlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2UsXG4gIEh0dHBNZXRob2RzLFxuICBRdWVyeVBhcmFtcyxcbiAgUmVxdWVzdERhdGEsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBIdHRwVXJsR2VuZXJhdG9yIH0gZnJvbSAnLi9odHRwLXVybC1nZW5lcmF0b3InO1xuXG4vKipcbiAqIEEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGRlbGV0ZTQwNE9LOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXR5VXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdGllc1VybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZ2V0RGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLl9uYW1lID0gYCR7ZW50aXR5TmFtZX0gRGVmYXVsdERhdGFTZXJ2aWNlYDtcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBlbnRpdHlOYW1lO1xuICAgIGNvbnN0IHtcbiAgICAgIHJvb3QgPSAnYXBpJyxcbiAgICAgIGRlbGV0ZTQwNE9LID0gdHJ1ZSxcbiAgICAgIGdldERlbGF5ID0gMCxcbiAgICAgIHNhdmVEZWxheSA9IDAsXG4gICAgICB0aW1lb3V0OiB0byA9IDAsXG4gICAgfSA9IGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLmRlbGV0ZTQwNE9LID0gZGVsZXRlNDA0T0s7XG4gICAgdGhpcy5lbnRpdHlVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmVudGl0eVJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZW50aXRpZXNVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lLCByb290KTtcbiAgICB0aGlzLmdldERlbGF5ID0gZ2V0RGVsYXk7XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICBhZGQoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byBhZGRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IpO1xuICB9XG5cbiAgZGVsZXRlKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZGVsZXRlYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0RFTEVURScsIHRoaXMuZW50aXR5VXJsICsga2V5LCBlcnIpLnBpcGUoXG4gICAgICAvLyBmb3J3YXJkIHRoZSBpZCBvZiBkZWxldGVkIGVudGl0eSBhcyB0aGUgcmVzdWx0IG9mIHRoZSBIVFRQIERFTEVURVxuICAgICAgbWFwKChyZXN1bHQpID0+IGtleSBhcyBudW1iZXIgfCBzdHJpbmcpXG4gICAgKTtcbiAgfVxuXG4gIGdldEFsbCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXRpZXNVcmwpO1xuICB9XG5cbiAgZ2V0QnlJZChrZXk6IG51bWJlciB8IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBnZXRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycik7XG4gIH1cblxuICBnZXRXaXRoUXVlcnkocXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBjb25zdCBxUGFyYW1zID1cbiAgICAgIHR5cGVvZiBxdWVyeVBhcmFtcyA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7IGZyb21TdHJpbmc6IHF1ZXJ5UGFyYW1zIH1cbiAgICAgICAgOiB7IGZyb21PYmplY3Q6IHF1ZXJ5UGFyYW1zIH07XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMocVBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCwgdW5kZWZpbmVkLCB7IHBhcmFtcyB9KTtcbiAgfVxuXG4gIHVwZGF0ZSh1cGRhdGU6IFVwZGF0ZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGlkID0gdXBkYXRlICYmIHVwZGF0ZS5pZDtcbiAgICBjb25zdCB1cGRhdGVPckVycm9yID1cbiAgICAgIGlkID09IG51bGxcbiAgICAgICAgPyBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgdXBkYXRlIGRhdGEgb3IgaWRgKVxuICAgICAgICA6IHVwZGF0ZS5jaGFuZ2VzO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BVVCcsIHRoaXMuZW50aXR5VXJsICsgaWQsIHVwZGF0ZU9yRXJyb3IpO1xuICB9XG5cbiAgLy8gSW1wb3J0YW50ISBPbmx5IGNhbGwgaWYgdGhlIGJhY2tlbmQgc2VydmljZSBzdXBwb3J0cyB1cHNlcnRzIGFzIGEgUE9TVCB0byB0aGUgdGFyZ2V0IFVSTFxuICB1cHNlcnQoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byB1cHNlcnRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGV4ZWN1dGUoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kcyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LCAvLyBkYXRhLCBlcnJvciwgb3IgdW5kZWZpbmVkL251bGxcbiAgICBvcHRpb25zPzogYW55XG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgcmVxOiBSZXF1ZXN0RGF0YSA9IHsgbWV0aG9kLCB1cmwsIGRhdGEsIG9wdGlvbnMgfTtcblxuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKHJlcSkoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8QXJyYXlCdWZmZXI+O1xuXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ0RFTEVURSc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5kZWxldGUodXJsLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnR0VUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmdldCh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5nZXREZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5nZXREZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnUE9TVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wb3N0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIE4uQi46IEl0IG11c3QgcmV0dXJuIGFuIFVwZGF0ZTxUPlxuICAgICAgY2FzZSAnUFVUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnB1dCh1cmwsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdVbmltcGxlbWVudGVkIEhUVFAgbWV0aG9kLCAnICsgbWV0aG9kKTtcbiAgICAgICAgcmVzdWx0JCA9IHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0ICsgdGhpcy5zYXZlRGVsYXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCQucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IocmVxKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG9rID0gdGhpcy5oYW5kbGVEZWxldGU0MDQoZXJyLCByZXFEYXRhKTtcbiAgICAgIGlmIChvaykge1xuICAgICAgICByZXR1cm4gb2s7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgcmVxRGF0YSk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRGVsZXRlNDA0KGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSwgcmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICBpZiAoXG4gICAgICBlcnJvci5zdGF0dXMgPT09IDQwNCAmJlxuICAgICAgcmVxRGF0YS5tZXRob2QgPT09ICdERUxFVEUnICYmXG4gICAgICB0aGlzLmRlbGV0ZTQwNE9LXG4gICAgKSB7XG4gICAgICByZXR1cm4gb2Yoe30pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgaHR0cFVybEdlbmVyYXRvci5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoY29uZmlnLmVudGl0eUh0dHBSZXNvdXJjZVVybHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRlZmF1bHQge0VudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZX0gZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3IgdGhpcyBkYXRhIHNlcnZpY2VcbiAgICovXG4gIGNyZWF0ZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICAgIHJldHVybiBuZXcgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuaHR0cCxcbiAgICAgIHRoaXMuaHR0cFVybEdlbmVyYXRvcixcbiAgICAgIHRoaXMuY29uZmlnXG4gICAgKTtcbiAgfVxufVxuIl19