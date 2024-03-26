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
        return this.execute('GET', this.entitiesUrl, null, null, options);
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
export class DefaultDataServiceFactory {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DefaultDataServiceFactory, deps: [{ token: i1.HttpClient }, { token: i2.HttpUrlGenerator }, { token: i3.DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DefaultDataServiceFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DefaultDataServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.HttpUrlGenerator }, { type: i3.DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUdMLFdBQVcsRUFDWCxVQUFVLEdBQ1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBV3hEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sa0JBQWtCO0lBVzdCLElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFDRSxVQUFrQixFQUNSLElBQWdCLEVBQ2hCLGdCQUFrQyxFQUM1QyxNQUFpQztRQUZ2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFacEMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBWXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLHFCQUFxQixDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLE1BQU0sRUFDSixJQUFJLEdBQUcsS0FBSyxFQUNaLFdBQVcsR0FBRyxJQUFJLEVBQ2xCLFFBQVEsR0FBRyxDQUFDLEVBQ1osU0FBUyxHQUFHLENBQUMsRUFDYixPQUFPLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFDZixzQkFBc0IsR0FBRyxLQUFLLEdBQy9CLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FDOUMsVUFBVSxFQUNWLElBQUksRUFDSixzQkFBc0IsQ0FDdkIsQ0FBQztRQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBUyxFQUFFLE9BQXFCO1FBQ2xDLE1BQU0sYUFBYSxHQUNqQixNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxNQUFNLENBQ0osR0FBb0IsRUFDcEIsT0FBcUI7UUFFckIsSUFBSSxHQUFzQixDQUFDO1FBQzNCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2hCLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxVQUFVLGlCQUFpQixDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FDakIsUUFBUSxFQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUNwQixHQUFHLEVBQ0gsSUFBSSxFQUNKLE9BQU8sQ0FDUixDQUFDLElBQUk7UUFDSixvRUFBb0U7UUFDcEUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFzQixDQUFDLENBQ3hDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQXFCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBb0IsRUFBRSxPQUFxQjtRQUNqRCxJQUFJLEdBQXNCLENBQUM7UUFDM0IsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEIsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsY0FBYyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsWUFBWSxDQUNWLFdBQTZDLEVBQzdDLE9BQXFCO1FBRXJCLE1BQU0sT0FBTyxHQUNYLE9BQU8sV0FBVyxLQUFLLFFBQVE7WUFDN0IsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtZQUM3QixDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdkMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUNqQixLQUFLLEVBQ0wsSUFBSSxDQUFDLFdBQVcsRUFDaEIsU0FBUyxFQUNULEVBQUUsTUFBTSxFQUFFLEVBQ1YsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQWlCLEVBQUUsT0FBcUI7UUFDN0MsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDL0IsTUFBTSxhQUFhLEdBQ2pCLEVBQUUsSUFBSSxJQUFJO1lBQ1IsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUscUJBQXFCLENBQUM7WUFDeEQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUNqQixLQUFLLEVBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQ25CLGFBQWEsRUFDYixJQUFJLEVBQ0osT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRUQsMkZBQTJGO0lBQzNGLE1BQU0sQ0FBQyxNQUFTLEVBQUUsT0FBcUI7UUFDckMsTUFBTSxhQUFhLEdBQ2pCLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxVQUFVLG9CQUFvQixDQUFDLENBQUM7UUFDbEUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVTLE9BQU8sQ0FDZixNQUFtQixFQUNuQixHQUFXLEVBQ1gsSUFBVSxFQUFFLGlDQUFpQztJQUM3QyxPQUFhLEVBQUUsNEJBQTRCO0lBQzNDLFdBQXlCLENBQUMsZ0RBQWdEOztRQUUxRSxJQUFJLDZCQUE2QixHQUFRLFNBQVMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2hCLDZCQUE2QixHQUFHO2dCQUM5QixPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVc7b0JBQy9CLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDO29CQUMzQyxDQUFDLENBQUMsU0FBUztnQkFDYixNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVU7b0JBQzdCLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDO29CQUN6QyxDQUFDLENBQUMsU0FBUzthQUNkLENBQUM7UUFDSixDQUFDO1FBRUQsbUJBQW1CO1FBQ25CLGtHQUFrRztRQUNsRyxxRUFBcUU7UUFFckUsd0VBQXdFO1FBQ3hFLGtDQUFrQztRQUVsQyxxRUFBcUU7UUFDckUsdUVBQXVFO1FBQ3ZFLHdDQUF3QztRQUN4QyxJQUFJLGFBQWEsR0FBUSxTQUFTLENBQUM7UUFDbkMsSUFBSSxPQUFPLElBQUksNkJBQTZCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLFNBQVMsRUFBRSxJQUFJLE9BQU8sSUFBSSw2QkFBNkIsRUFBRSxDQUFDO2dCQUM1RCxPQUFPLENBQUMsSUFBSSxDQUNWLCtRQUErUSxDQUNoUixDQUFDO1lBQ0osQ0FBQztZQUVELGFBQWEsR0FBRztnQkFDZCxHQUFHLE9BQU87Z0JBQ1YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsT0FBTztnQkFDbkUsTUFBTSxFQUFFLDZCQUE2QixFQUFFLE1BQU0sSUFBSSxPQUFPLEVBQUUsTUFBTTthQUNqRSxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFnQjtZQUN2QixNQUFNO1lBQ04sR0FBRztZQUNILElBQUk7WUFDSixPQUFPLEVBQUUsYUFBYTtTQUN2QixDQUFDO1FBRUYsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxJQUFJLE9BQWdDLENBQUM7UUFFckMsUUFBUSxNQUFNLEVBQUUsQ0FBQztZQUNmLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDbkIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUNELE1BQU07WUFDUixDQUFDO1lBQ0QsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNsQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUM7Z0JBQ0QsTUFBTTtZQUNSLENBQUM7WUFDRCxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ25ELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNuQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUM7Z0JBQ0QsTUFBTTtZQUNSLENBQUM7WUFDRCxvQ0FBb0M7WUFDcEMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDbkIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUNELE1BQU07WUFDUixDQUFDO1lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0gsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTyxXQUFXLENBQUMsT0FBb0I7UUFDdEMsT0FBTyxDQUFDLEdBQVEsRUFBRSxFQUFFO1lBQ2xCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDO1lBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVPLGVBQWUsQ0FBQyxLQUF3QixFQUFFLE9BQW9CO1FBQ3BFLElBQ0UsS0FBSyxDQUFDLE1BQU0sS0FBSyxHQUFHO1lBQ3BCLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUTtZQUMzQixJQUFJLENBQUMsV0FBVyxFQUNoQixDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8seUJBQXlCO0lBQ3BDLFlBQ1ksSUFBZ0IsRUFDaEIsZ0JBQWtDLEVBQ3RCLE1BQWlDO1FBRjdDLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUEyQjtRQUV2RCxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN0QixnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFJLFVBQWtCO1FBQzFCLE9BQU8sSUFBSSxrQkFBa0IsQ0FDM0IsVUFBVSxFQUNWLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLGdCQUFnQixFQUNyQixJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7SUFDSixDQUFDO2lJQXJCVSx5QkFBeUI7cUlBQXpCLHlCQUF5Qjs7MkZBQXpCLHlCQUF5QjtrQkFEckMsVUFBVTs7MEJBS04sUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBDbGllbnQsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwSGVhZGVycyxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIG1hcCwgdGltZW91dCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZSxcbiAgSHR0cE1ldGhvZHMsXG4gIEh0dHBPcHRpb25zLFxuICBRdWVyeVBhcmFtcyxcbiAgUmVxdWVzdERhdGEsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBIdHRwVXJsR2VuZXJhdG9yIH0gZnJvbSAnLi9odHRwLXVybC1nZW5lcmF0b3InO1xuXG4vKipcbiAqIEEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGRlbGV0ZTQwNE9LOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXR5VXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdGllc1VybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZ2V0RGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuICBwcm90ZWN0ZWQgdHJhaWxpbmdTbGFzaEVuZHBvaW50cyA9IGZhbHNlO1xuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLl9uYW1lID0gYCR7ZW50aXR5TmFtZX0gRGVmYXVsdERhdGFTZXJ2aWNlYDtcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBlbnRpdHlOYW1lO1xuICAgIGNvbnN0IHtcbiAgICAgIHJvb3QgPSAnYXBpJyxcbiAgICAgIGRlbGV0ZTQwNE9LID0gdHJ1ZSxcbiAgICAgIGdldERlbGF5ID0gMCxcbiAgICAgIHNhdmVEZWxheSA9IDAsXG4gICAgICB0aW1lb3V0OiB0byA9IDAsXG4gICAgICB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzID0gZmFsc2UsXG4gICAgfSA9IGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLmRlbGV0ZTQwNE9LID0gZGVsZXRlNDA0T0s7XG4gICAgdGhpcy5lbnRpdHlVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmVudGl0eVJlc291cmNlKFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHJvb3QsXG4gICAgICB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzXG4gICAgKTtcbiAgICB0aGlzLmVudGl0aWVzVXJsID0gaHR0cFVybEdlbmVyYXRvci5jb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZSwgcm9vdCk7XG4gICAgdGhpcy5nZXREZWxheSA9IGdldERlbGF5O1xuICAgIHRoaXMuc2F2ZURlbGF5ID0gc2F2ZURlbGF5O1xuICAgIHRoaXMudGltZW91dCA9IHRvO1xuICB9XG5cbiAgYWRkKGVudGl0eTogVCwgb3B0aW9ucz86IEh0dHBPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byBhZGRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IsIG51bGwsIG9wdGlvbnMpO1xuICB9XG5cbiAgZGVsZXRlKFxuICAgIGtleTogbnVtYmVyIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBIdHRwT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBkZWxldGVgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKFxuICAgICAgJ0RFTEVURScsXG4gICAgICB0aGlzLmVudGl0eVVybCArIGtleSxcbiAgICAgIGVycixcbiAgICAgIG51bGwsXG4gICAgICBvcHRpb25zXG4gICAgKS5waXBlKFxuICAgICAgLy8gZm9yd2FyZCB0aGUgaWQgb2YgZGVsZXRlZCBlbnRpdHkgYXMgdGhlIHJlc3VsdCBvZiB0aGUgSFRUUCBERUxFVEVcbiAgICAgIG1hcCgocmVzdWx0KSA9PiBrZXkgYXMgbnVtYmVyIHwgc3RyaW5nKVxuICAgICk7XG4gIH1cblxuICBnZXRBbGwob3B0aW9ucz86IEh0dHBPcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsLCBudWxsLCBudWxsLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldEJ5SWQoa2V5OiBudW1iZXIgfCBzdHJpbmcsIG9wdGlvbnM/OiBIdHRwT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBnZXRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVyciwgbnVsbCwgb3B0aW9ucyk7XG4gIH1cblxuICBnZXRXaXRoUXVlcnkoXG4gICAgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIG9wdGlvbnM/OiBIdHRwT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIGNvbnN0IHFQYXJhbXMgPVxuICAgICAgdHlwZW9mIHF1ZXJ5UGFyYW1zID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZnJvbVN0cmluZzogcXVlcnlQYXJhbXMgfVxuICAgICAgICA6IHsgZnJvbU9iamVjdDogcXVlcnlQYXJhbXMgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyhxUGFyYW1zKTtcblxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoXG4gICAgICAnR0VUJyxcbiAgICAgIHRoaXMuZW50aXRpZXNVcmwsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB7IHBhcmFtcyB9LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH1cblxuICB1cGRhdGUodXBkYXRlOiBVcGRhdGU8VD4sIG9wdGlvbnM/OiBIdHRwT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGlkID0gdXBkYXRlICYmIHVwZGF0ZS5pZDtcbiAgICBjb25zdCB1cGRhdGVPckVycm9yID1cbiAgICAgIGlkID09IG51bGxcbiAgICAgICAgPyBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgdXBkYXRlIGRhdGEgb3IgaWRgKVxuICAgICAgICA6IHVwZGF0ZS5jaGFuZ2VzO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoXG4gICAgICAnUFVUJyxcbiAgICAgIHRoaXMuZW50aXR5VXJsICsgaWQsXG4gICAgICB1cGRhdGVPckVycm9yLFxuICAgICAgbnVsbCxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgLy8gSW1wb3J0YW50ISBPbmx5IGNhbGwgaWYgdGhlIGJhY2tlbmQgc2VydmljZSBzdXBwb3J0cyB1cHNlcnRzIGFzIGEgUE9TVCB0byB0aGUgdGFyZ2V0IFVSTFxuICB1cHNlcnQoZW50aXR5OiBULCBvcHRpb25zPzogSHR0cE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIHVwc2VydGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvciwgbnVsbCwgb3B0aW9ucyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhlY3V0ZShcbiAgICBtZXRob2Q6IEh0dHBNZXRob2RzLFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksIC8vIGRhdGEsIGVycm9yLCBvciB1bmRlZmluZWQvbnVsbFxuICAgIG9wdGlvbnM/OiBhbnksIC8vIG9wdGlvbnMgb3IgdW5kZWZpbmVkL251bGxcbiAgICBodHRwT3B0aW9ucz86IEh0dHBPcHRpb25zIC8vIHRoZXNlIG92ZXJyaWRlIGFueSBvcHRpb25zIHBhc3NlZCB2aWEgb3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGxldCBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9uczogYW55ID0gdW5kZWZpbmVkO1xuICAgIGlmIChodHRwT3B0aW9ucykge1xuICAgICAgZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnMgPSB7XG4gICAgICAgIGhlYWRlcnM6IGh0dHBPcHRpb25zPy5odHRwSGVhZGVyc1xuICAgICAgICAgID8gbmV3IEh0dHBIZWFkZXJzKGh0dHBPcHRpb25zPy5odHRwSGVhZGVycylcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgcGFyYW1zOiBodHRwT3B0aW9ucz8uaHR0cFBhcmFtc1xuICAgICAgICAgID8gbmV3IEh0dHBQYXJhbXMoaHR0cE9wdGlvbnM/Lmh0dHBQYXJhbXMpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBtYXkgaGF2ZTpcbiAgICAvLyBvcHRpb25zOiBjb250YWluaW5nIGhlYWRlcnMsIHBhcmFtcywgb3IgYW55IG90aGVyIGFsbG93ZWQgaHR0cCBvcHRpb25zIGFscmVhZHkgaW4gYW5ndWxhcidzIGFwaVxuICAgIC8vIGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zOiBoZWFkZXJzIGFuZCBwYXJhbXMgaW4gYW5ndWxhcidzIGFwaVxuXG4gICAgLy8gV2UgdGhlcmVmb3JlIG5lZWQgdG8gbWVyZ2UgdGhlc2Ugc28gdGhhdCB0aGUgYWN0aW9uIG9uZXMgb3ZlcnJpZGUgdGhlXG4gICAgLy8gZXhpc3Rpbmcga2V5cyB3aGVyZSBhcHBsaWNhYmxlLlxuXG4gICAgLy8gSWYgYW55IG9wdGlvbnMgaGF2ZSBiZWVuIHNwZWNpZmllZCwgcGFzcyB0aGVtIHRvIGh0dHAgY2xpZW50LiBOb3RlXG4gICAgLy8gdGhlIG5ldyBodHRwIG9wdGlvbnMsIGlmIHNwZWNpZmllZCwgd2lsbCBvdmVycmlkZSBhbnkgb3B0aW9ucyBwYXNzZWRcbiAgICAvLyBmcm9tIHRoZSBkZXByZWNhdGVkIG9wdGlvbnMgcGFyYW1ldGVyXG4gICAgbGV0IG1lcmdlZE9wdGlvbnM6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBpZiAob3B0aW9ucyB8fCBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9ucykge1xuICAgICAgaWYgKGlzRGV2TW9kZSgpICYmIG9wdGlvbnMgJiYgZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnMpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdAbmdyeC9kYXRhOiBvcHRpb25zLmh0dHBQYXJhbXMgd2lsbCBiZSBtZXJnZWQgd2l0aCBxdWVyeVBhcmFtcyB3aGVuIGJvdGggYXJlIGFyZSBwcm92aWRlZCB0byBnZXRXaXRoUXVlcnkoKS4gSW4gdGhlIGV2ZW50IG9mIGEgY29uZmxpY3QgSHR0cE9wdGlvbnMuaHR0cFBhcmFtcyB3aWxsIG92ZXJyaWRlIHF1ZXJ5UGFyYW1zYC4gVGhlIHF1ZXJ5UGFyYW1zIHBhcmFtZXRlciBvZiBnZXRXaXRoUXVlcnkoKSB3aWxsIGJlIHJlbW92ZWQgaW4gbmV4dCBtYWpvciByZWxlYXNlLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgaGVhZGVyczogZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnM/LmhlYWRlcnMgPz8gb3B0aW9ucz8uaGVhZGVycyxcbiAgICAgICAgcGFyYW1zOiBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9ucz8ucGFyYW1zID8/IG9wdGlvbnM/LnBhcmFtcyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgcmVxOiBSZXF1ZXN0RGF0YSA9IHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIHVybCxcbiAgICAgIGRhdGEsXG4gICAgICBvcHRpb25zOiBtZXJnZWRPcHRpb25zLFxuICAgIH07XG5cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvcihyZXEpKGRhdGEpO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQkOiBPYnNlcnZhYmxlPEFycmF5QnVmZmVyPjtcblxuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdERUxFVEUnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZGVsZXRlKHVybCwgbWVyZ2VkT3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0dFVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5nZXQodXJsLCBtZXJnZWRPcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0RGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuZ2V0RGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ1BPU1QnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucG9zdCh1cmwsIGRhdGEsIG1lcmdlZE9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICAvLyBOLkIuOiBJdCBtdXN0IHJldHVybiBhbiBVcGRhdGU8VD5cbiAgICAgIGNhc2UgJ1BVVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wdXQodXJsLCBkYXRhLCBtZXJnZWRPcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignVW5pbXBsZW1lbnRlZCBIVFRQIG1ldGhvZCwgJyArIG1ldGhvZCk7XG4gICAgICAgIHJlc3VsdCQgPSB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZSh0aW1lb3V0KHRoaXMudGltZW91dCArIHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQkLnBpcGUoY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yKHJlcSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IocmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICByZXR1cm4gKGVycjogYW55KSA9PiB7XG4gICAgICBjb25zdCBvayA9IHRoaXMuaGFuZGxlRGVsZXRlNDA0KGVyciwgcmVxRGF0YSk7XG4gICAgICBpZiAob2spIHtcbiAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIHJlcURhdGEpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZURlbGV0ZTQwNChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UsIHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgaWYgKFxuICAgICAgZXJyb3Iuc3RhdHVzID09PSA0MDQgJiZcbiAgICAgIHJlcURhdGEubWV0aG9kID09PSAnREVMRVRFJyAmJlxuICAgICAgdGhpcy5kZWxldGU0MDRPS1xuICAgICkge1xuICAgICAgcmV0dXJuIG9mKHt9KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGh0dHBVcmxHZW5lcmF0b3IucmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKGNvbmZpZy5lbnRpdHlIdHRwUmVzb3VyY2VVcmxzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHtFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2V9IGZvciB0aGUgZ2l2ZW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgZGF0YSBzZXJ2aWNlXG4gICAqL1xuICBjcmVhdGU8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IERlZmF1bHREYXRhU2VydmljZTxUPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmh0dHAsXG4gICAgICB0aGlzLmh0dHBVcmxHZW5lcmF0b3IsXG4gICAgICB0aGlzLmNvbmZpZ1xuICAgICk7XG4gIH1cbn1cbiJdfQ==