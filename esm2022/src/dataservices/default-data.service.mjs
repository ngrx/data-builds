import { Injectable, isDevMode, Optional } from '@angular/core';
import { HttpHeaders, HttpParams, } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { DataServiceError } from './data-service-error';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./http-url-generator";
import * as i3 from "./default-data-service-config";
/**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
export class DefaultDataService {
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
        const { root = 'api', delete404OK = true, getDelay = 0, saveDelay = 0, timeout: to = 0, trailingSlashEndpoints = false, } = config || {};
        this.delete404OK = delete404OK;
        this.entityUrl = httpUrlGenerator.entityResource(entityName, root, trailingSlashEndpoints);
        this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
        this.getDelay = getDelay;
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
    add(entity, options) {
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
        return this.execute('POST', this.entityUrl, entityOrError, null, options);
    }
    delete(key, options) {
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to delete`);
        }
        return this.execute('DELETE', this.entityUrl + key, err, null, options).pipe(
        // forward the id of deleted entity as the result of the HTTP DELETE
        map((result) => key));
    }
    getAll(options) {
        return this.execute('GET', this.entitiesUrl, null, options);
    }
    getById(key, options) {
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to get`);
        }
        return this.execute('GET', this.entityUrl + key, err, null, options);
    }
    getWithQuery(queryParams, options) {
        const qParams = typeof queryParams === 'string'
            ? { fromString: queryParams }
            : { fromObject: queryParams };
        const params = new HttpParams(qParams);
        return this.execute('GET', this.entitiesUrl, undefined, { params }, options);
    }
    update(update, options) {
        const id = update && update.id;
        const updateOrError = id == null
            ? new Error(`No "${this.entityName}" update data or id`)
            : update.changes;
        return this.execute('PUT', this.entityUrl + id, updateOrError, null, options);
    }
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    upsert(entity, options) {
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to upsert`);
        return this.execute('POST', this.entityUrl, entityOrError, null, options);
    }
    execute(method, url, data, // data, error, or undefined/null
    options, // options or undefined/null
    httpOptions // these override any options passed via options
    ) {
        let entityActionHttpClientOptions = undefined;
        if (httpOptions) {
            entityActionHttpClientOptions = {
                headers: httpOptions?.httpHeaders
                    ? new HttpHeaders(httpOptions?.httpHeaders)
                    : undefined,
                params: httpOptions?.httpParams
                    ? new HttpParams(httpOptions?.httpParams)
                    : undefined,
            };
        }
        // Now we may have:
        // options: containing headers, params, or any other allowed http options already in angular's api
        // entityActionHttpClientOptions: headers and params in angular's api
        // We therefore need to merge these so that the action ones override the
        // existing keys where applicable.
        // If any options have been specified, pass them to http client. Note
        // the new http options, if specified, will override any options passed
        // from the deprecated options parameter
        let mergedOptions = undefined;
        if (options || entityActionHttpClientOptions) {
            if (isDevMode() && options && entityActionHttpClientOptions) {
                console.warn('@ngrx/data: options.httpParams will be merged with queryParams when both are are provided to getWithQuery(). In the event of a conflict HttpOptions.httpParams will override queryParams`. The queryParams parameter of getWithQuery() will be removed in next major release.');
            }
            mergedOptions = {
                ...options,
                headers: entityActionHttpClientOptions?.headers ?? options?.headers,
                params: entityActionHttpClientOptions?.params ?? options?.params,
            };
        }
        const req = {
            method,
            url,
            data,
            options: mergedOptions,
        };
        if (data instanceof Error) {
            return this.handleError(req)(data);
        }
        let result$;
        switch (method) {
            case 'DELETE': {
                result$ = this.http.delete(url, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            case 'GET': {
                result$ = this.http.get(url, mergedOptions);
                if (this.getDelay) {
                    result$ = result$.pipe(delay(this.getDelay));
                }
                break;
            }
            case 'POST': {
                result$ = this.http.post(url, data, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            // N.B.: It must return an Update<T>
            case 'PUT': {
                result$ = this.http.put(url, data, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            default: {
                const error = new Error('Unimplemented HTTP method, ' + method);
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
        if (error.status === 404 &&
            reqData.method === 'DELETE' &&
            this.delete404OK) {
            return of({});
        }
        return undefined;
    }
}
/**
 * Create a basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
class DefaultDataServiceFactory {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultDataServiceFactory, deps: [{ token: i1.HttpClient }, { token: i2.HttpUrlGenerator }, { token: i3.DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultDataServiceFactory }); }
}
export { DefaultDataServiceFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultDataServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.HttpUrlGenerator }, { type: i3.DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUdMLFdBQVcsRUFDWCxVQUFVLEdBQ1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBV3hEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sa0JBQWtCO0lBVzdCLElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFDRSxVQUFrQixFQUNSLElBQWdCLEVBQ2hCLGdCQUFrQyxFQUM1QyxNQUFpQztRQUZ2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFacEMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBWXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLHFCQUFxQixDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLE1BQU0sRUFDSixJQUFJLEdBQUcsS0FBSyxFQUNaLFdBQVcsR0FBRyxJQUFJLEVB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M0UsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBSSxVQUFrQjtRQUMxQixPQUFPLElBQUksa0JBQWtCLENBQzNCLFVBQVUsRUFDVixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxnQkFBZ0IsRUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FDWixDQUFDO0lBQ0osQ0FBQztpSUFyQlUseUJBQXlCO3FJQUF6Qix5QkFBeUI7O1NBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxVQUFVOzswQkFLTixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cENsaWVudCxcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBIZWFkZXJzLFxuICBIdHRwUGFyYW1zLFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlLFxuICBIdHRwTWV0aG9kcyxcbiAgSHR0cE9wdGlvbnMsXG4gIFF1ZXJ5UGFyYW1zLFxuICBSZXF1ZXN0RGF0YSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEh0dHBVcmxHZW5lcmF0b3IgfSBmcm9tICcuL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbi8qKlxuICogQSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZTxUPiBpbXBsZW1lbnRzIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGVsZXRlNDA0T0s6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdHlVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0aWVzVXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBnZXREZWxheSA9IDA7XG4gIHByb3RlY3RlZCBzYXZlRGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgdGltZW91dCA9IDA7XG4gIHByb3RlY3RlZCB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzID0gZmFsc2U7XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuX25hbWUgPSBgJHtlbnRpdHlOYW1lfSBEZWZhdWx0RGF0YVNlcnZpY2VgO1xuICAgIHRoaXMuZW50aXR5TmFtZSA9IGVudGl0eU5hbWU7XG4gICAgY29uc3Qge1xuICAgICAgcm9vdCA9ICdhcGknLFxuICAgICAgZGVsZXRlNDA0T0sgPSB0cnVlLFxuICAgICAgZ2V0RGVsYXkgPSAwLFxuICAgICAgc2F2ZURlbGF5ID0gMCxcbiAgICAgIHRpbWVvdXQ6IHRvID0gMCxcbiAgICAgIHRyYWlsaW5nU2xhc2hFbmRwb2ludHMgPSBmYWxzZSxcbiAgICB9ID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuZGVsZXRlNDA0T0sgPSBkZWxldGU0MDRPSztcbiAgICB0aGlzLmVudGl0eVVybCA9IGh0dHBVcmxHZW5lcmF0b3IuZW50aXR5UmVzb3VyY2UoXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgcm9vdCxcbiAgICAgIHRyYWlsaW5nU2xhc2hFbmRwb2ludHNcbiAgICApO1xuICAgIHRoaXMuZW50aXRpZXNVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lLCByb290KTtcbiAgICB0aGlzLmdldERlbGF5ID0gZ2V0RGVsYXk7XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICBhZGQoZW50aXR5OiBULCBvcHRpb25zPzogSHR0cE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIGFkZGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvciwgbnVsbCwgb3B0aW9ucyk7XG4gIH1cblxuICBkZWxldGUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEh0dHBPcHRpb25zXG4gICk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGRlbGV0ZWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoXG4gICAgICAnREVMRVRFJyxcbiAgICAgIHRoaXMuZW50aXR5VXJsICsga2V5LFxuICAgICAgZXJyLFxuICAgICAgbnVsbCxcbiAgICAgIG9wdGlvbnNcbiAgICApLnBpcGUoXG4gICAgICAvLyBmb3J3YXJkIHRoZSBpZCBvZiBkZWxldGVkIGVudGl0eSBhcyB0aGUgcmVzdWx0IG9mIHRoZSBIVFRQIERFTEVURVxuICAgICAgbWFwKChyZXN1bHQpID0+IGtleSBhcyBudW1iZXIgfCBzdHJpbmcpXG4gICAgKTtcbiAgfVxuXG4gIGdldEFsbChvcHRpb25zPzogSHR0cE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXRpZXNVcmwsIG51bGwsIG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0QnlJZChrZXk6IG51bWJlciB8IHN0cmluZywgb3B0aW9ucz86IEh0dHBPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGdldGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyLCBudWxsLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldFdpdGhRdWVyeShcbiAgICBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgb3B0aW9ucz86IEh0dHBPcHRpb25zXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgY29uc3QgcVBhcmFtcyA9XG4gICAgICB0eXBlb2YgcXVlcnlQYXJhbXMgPT09ICdzdHJpbmcnXG4gICAgICAgID8geyBmcm9tU3RyaW5nOiBxdWVyeVBhcmFtcyB9XG4gICAgICAgIDogeyBmcm9tT2JqZWN0OiBxdWVyeVBhcmFtcyB9O1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHFQYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShcbiAgICAgICdHRVQnLFxuICAgICAgdGhpcy5lbnRpdGllc1VybCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHsgcGFyYW1zIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHVwZGF0ZSh1cGRhdGU6IFVwZGF0ZTxUPiwgb3B0aW9ucz86IEh0dHBPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgaWQgPSB1cGRhdGUgJiYgdXBkYXRlLmlkO1xuICAgIGNvbnN0IHVwZGF0ZU9yRXJyb3IgPVxuICAgICAgaWQgPT0gbnVsbFxuICAgICAgICA/IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiB1cGRhdGUgZGF0YSBvciBpZGApXG4gICAgICAgIDogdXBkYXRlLmNoYW5nZXM7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShcbiAgICAgICdQVVQnLFxuICAgICAgdGhpcy5lbnRpdHlVcmwgKyBpZCxcbiAgICAgIHVwZGF0ZU9yRXJyb3IsXG4gICAgICBudWxsLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH1cblxuICAvLyBJbXBvcnRhbnQhIE9ubHkgY2FsbCBpZiB0aGUgYmFja2VuZCBzZXJ2aWNlIHN1cHBvcnRzIHVwc2VydHMgYXMgYSBQT1NUIHRvIHRoZSB0YXJnZXQgVVJMXG4gIHVwc2VydChlbnRpdHk6IFQsIG9wdGlvbnM/OiBIdHRwT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGVudGl0eU9yRXJyb3IgPVxuICAgICAgZW50aXR5IHx8IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBlbnRpdHkgdG8gdXBzZXJ0YCk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUE9TVCcsIHRoaXMuZW50aXR5VXJsLCBlbnRpdHlPckVycm9yLCBudWxsLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBleGVjdXRlKFxuICAgIG1ldGhvZDogSHR0cE1ldGhvZHMsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSwgLy8gZGF0YSwgZXJyb3IsIG9yIHVuZGVmaW5lZC9udWxsXG4gICAgb3B0aW9ucz86IGFueSwgLy8gb3B0aW9ucyBvciB1bmRlZmluZWQvbnVsbFxuICAgIGh0dHBPcHRpb25zPzogSHR0cE9wdGlvbnMgLy8gdGhlc2Ugb3ZlcnJpZGUgYW55IG9wdGlvbnMgcGFzc2VkIHZpYSBvcHRpb25zXG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgbGV0IGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGh0dHBPcHRpb25zKSB7XG4gICAgICBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9ucyA9IHtcbiAgICAgICAgaGVhZGVyczogaHR0cE9wdGlvbnM/Lmh0dHBIZWFkZXJzXG4gICAgICAgICAgPyBuZXcgSHR0cEhlYWRlcnMoaHR0cE9wdGlvbnM/Lmh0dHBIZWFkZXJzKVxuICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IGh0dHBPcHRpb25zPy5odHRwUGFyYW1zXG4gICAgICAgICAgPyBuZXcgSHR0cFBhcmFtcyhodHRwT3B0aW9ucz8uaHR0cFBhcmFtcylcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIG1heSBoYXZlOlxuICAgIC8vIG9wdGlvbnM6IGNvbnRhaW5pbmcgaGVhZGVycywgcGFyYW1zLCBvciBhbnkgb3RoZXIgYWxsb3dlZCBodHRwIG9wdGlvbnMgYWxyZWFkeSBpbiBhbmd1bGFyJ3MgYXBpXG4gICAgLy8gZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnM6IGhlYWRlcnMgYW5kIHBhcmFtcyBpbiBhbmd1bGFyJ3MgYXBpXG5cbiAgICAvLyBXZSB0aGVyZWZvcmUgbmVlZCB0byBtZXJnZSB0aGVzZSBzbyB0aGF0IHRoZSBhY3Rpb24gb25lcyBvdmVycmlkZSB0aGVcbiAgICAvLyBleGlzdGluZyBrZXlzIHdoZXJlIGFwcGxpY2FibGUuXG5cbiAgICAvLyBJZiBhbnkgb3B0aW9ucyBoYXZlIGJlZW4gc3BlY2lmaWVkLCBwYXNzIHRoZW0gdG8gaHR0cCBjbGllbnQuIE5vdGVcbiAgICAvLyB0aGUgbmV3IGh0dHAgb3B0aW9ucywgaWYgc3BlY2lmaWVkLCB3aWxsIG92ZXJyaWRlIGFueSBvcHRpb25zIHBhc3NlZFxuICAgIC8vIGZyb20gdGhlIGRlcHJlY2F0ZWQgb3B0aW9ucyBwYXJhbWV0ZXJcbiAgICBsZXQgbWVyZ2VkT3B0aW9uczogYW55ID0gdW5kZWZpbmVkO1xuICAgIGlmIChvcHRpb25zIHx8IGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zKSB7XG4gICAgICBpZiAoaXNEZXZNb2RlKCkgJiYgb3B0aW9ucyAmJiBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9ucykge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ0BuZ3J4L2RhdGE6IG9wdGlvbnMuaHR0cFBhcmFtcyB3aWxsIGJlIG1lcmdlZCB3aXRoIHF1ZXJ5UGFyYW1zIHdoZW4gYm90aCBhcmUgYXJlIHByb3ZpZGVkIHRvIGdldFdpdGhRdWVyeSgpLiBJbiB0aGUgZXZlbnQgb2YgYSBjb25mbGljdCBIdHRwT3B0aW9ucy5odHRwUGFyYW1zIHdpbGwgb3ZlcnJpZGUgcXVlcnlQYXJhbXNgLiBUaGUgcXVlcnlQYXJhbXMgcGFyYW1ldGVyIG9mIGdldFdpdGhRdWVyeSgpIHdpbGwgYmUgcmVtb3ZlZCBpbiBuZXh0IG1ham9yIHJlbGVhc2UuJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBtZXJnZWRPcHRpb25zID0ge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBoZWFkZXJzOiBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9ucz8uaGVhZGVycyA/PyBvcHRpb25zPy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zPy5wYXJhbXMgPz8gb3B0aW9ucz8ucGFyYW1zLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXE6IFJlcXVlc3REYXRhID0ge1xuICAgICAgbWV0aG9kLFxuICAgICAgdXJsLFxuICAgICAgZGF0YSxcbiAgICAgIG9wdGlvbnM6IG1lcmdlZE9wdGlvbnMsXG4gICAgfTtcblxuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKHJlcSkoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8QXJyYXlCdWZmZXI+O1xuXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ0RFTEVURSc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5kZWxldGUodXJsLCBtZXJnZWRPcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnR0VUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmdldCh1cmwsIG1lcmdlZE9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5nZXREZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5nZXREZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnUE9TVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wb3N0KHVybCwgZGF0YSwgbWVyZ2VkT3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIE4uQi46IEl0IG11c3QgcmV0dXJuIGFuIFVwZGF0ZTxUPlxuICAgICAgY2FzZSAnUFVUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnB1dCh1cmwsIGRhdGEsIG1lcmdlZE9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdVbmltcGxlbWVudGVkIEhUVFAgbWV0aG9kLCAnICsgbWV0aG9kKTtcbiAgICAgICAgcmVzdWx0JCA9IHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0ICsgdGhpcy5zYXZlRGVsYXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCQucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IocmVxKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG9rID0gdGhpcy5oYW5kbGVEZWxldGU0MDQoZXJyLCByZXFEYXRhKTtcbiAgICAgIGlmIChvaykge1xuICAgICAgICByZXR1cm4gb2s7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgcmVxRGF0YSk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRGVsZXRlNDA0KGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSwgcmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICBpZiAoXG4gICAgICBlcnJvci5zdGF0dXMgPT09IDQwNCAmJlxuICAgICAgcmVxRGF0YS5tZXRob2QgPT09ICdERUxFVEUnICYmXG4gICAgICB0aGlzLmRlbGV0ZTQwNE9LXG4gICAgKSB7XG4gICAgICByZXR1cm4gb2Yoe30pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgaHR0cFVybEdlbmVyYXRvci5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoY29uZmlnLmVudGl0eUh0dHBSZXNvdXJjZVVybHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRlZmF1bHQge0VudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZX0gZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3IgdGhpcyBkYXRhIHNlcnZpY2VcbiAgICovXG4gIGNyZWF0ZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICAgIHJldHVybiBuZXcgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuaHR0cCxcbiAgICAgIHRoaXMuaHR0cFVybEdlbmVyYXRvcixcbiAgICAgIHRoaXMuY29uZmlnXG4gICAgKTtcbiAgfVxufVxuIl19