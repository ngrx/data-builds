import * as tslib_1 from "tslib";
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
        map(function (result) { return key; }));
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
        var params = new HttpParams(qParams);
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
                var error = new Error('Unimplemented HTTP method, ' + method);
                result$ = throwError(error);
            }
        }
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout + this.saveDelay));
        }
        return result$.pipe(catchError(this.handleError(req)));
    };
    DefaultDataService.prototype.handleError = function (reqData) {
        var _this = this;
        return function (err) {
            var ok = _this.handleDelete404(err, reqData);
            if (ok) {
                return ok;
            }
            var error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    };
    DefaultDataService.prototype.handleDelete404 = function (error, reqData) {
        if (error.status === 404 &&
            reqData.method === 'DELETE' &&
            this.delete404OK) {
            return of({});
        }
        return undefined;
    };
    return DefaultDataService;
}());
export { DefaultDataService };
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
        Injectable(),
        tslib_1.__param(2, Optional()),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            HttpUrlGenerator,
            DefaultDataServiceConfig])
    ], DefaultDataServiceFactory);
    return DefaultDataServiceFactory;
}());
export { DefaultDataServiceFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUNMLFVBQVUsRUFFVixVQUFVLEdBQ1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFPekUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFeEQ7Ozs7R0FJRztBQUNIO0lBY0UsNEJBQ0UsVUFBa0IsRUFDUixJQUFnQixFQUNoQixnQkFBa0MsRUFDNUMsTUFBaUM7UUFGdkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBWHBDLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztRQVlwQixJQUFJLENBQUMsS0FBSyxHQUFNLFVBQVUsd0JBQXFCLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDdkIsSUFBQSxpQkFPUSxFQU5aLFlBQVksRUFBWixpQ0FBWSxFQUNaLG1CQUFrQixFQUFsQix1Q0FBa0IsRUFDbEIs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QixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRDs7O09BR0c7SUFDSCwwQ0FBTSxHQUFOLFVBQVUsVUFBa0I7UUFDMUIsT0FBTyxJQUFJLGtCQUFrQixDQUMzQixVQUFVLEVBQ1YsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztJQUNKLENBQUM7SUFyQlUseUJBQXlCO1FBRHJDLFVBQVUsRUFBRTtRQUtSLG1CQUFBLFFBQVEsRUFBRSxDQUFBO2lEQUZLLFVBQVU7WUFDRSxnQkFBZ0I7WUFDYix3QkFBd0I7T0FKOUMseUJBQXlCLENBc0JyQztJQUFELGdDQUFDO0NBQUEsQUF0QkQsSUFzQkM7U0F0QlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBDbGllbnQsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwUGFyYW1zLFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlLFxuICBIdHRwTWV0aG9kcyxcbiAgUXVlcnlQYXJhbXMsXG4gIFJlcXVlc3REYXRhLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSHR0cFVybEdlbmVyYXRvciB9IGZyb20gJy4vaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuLyoqXG4gKiBBIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBkZWxldGU0MDRPSzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGVudGl0eU5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0eVVybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXRpZXNVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGdldERlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5fbmFtZSA9IGAke2VudGl0eU5hbWV9IERlZmF1bHREYXRhU2VydmljZWA7XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICBjb25zdCB7XG4gICAgICByb290ID0gJ2FwaScsXG4gICAgICBkZWxldGU0MDRPSyA9IHRydWUsXG4gICAgICBnZXREZWxheSA9IDAsXG4gICAgICBzYXZlRGVsYXkgPSAwLFxuICAgICAgdGltZW91dDogdG8gPSAwLFxuICAgIH0gPVxuICAgICAgY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuZGVsZXRlNDA0T0sgPSBkZWxldGU0MDRPSztcbiAgICB0aGlzLmVudGl0eVVybCA9IGh0dHBVcmxHZW5lcmF0b3IuZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZSwgcm9vdCk7XG4gICAgdGhpcy5lbnRpdGllc1VybCA9IGh0dHBVcmxHZW5lcmF0b3IuY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZ2V0RGVsYXkgPSBnZXREZWxheTtcbiAgICB0aGlzLnNhdmVEZWxheSA9IHNhdmVEZWxheTtcbiAgICB0aGlzLnRpbWVvdXQgPSB0bztcbiAgfVxuXG4gIGFkZChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIGFkZGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBkZWxldGUoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBkZWxldGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnREVMRVRFJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycikucGlwZShcbiAgICAgIC8vIGZvcndhcmQgdGhlIGlkIG9mIGRlbGV0ZWQgZW50aXR5IGFzIHRoZSByZXN1bHQgb2YgdGhlIEhUVFAgREVMRVRFXG4gICAgICBtYXAocmVzdWx0ID0+IGtleSBhcyBudW1iZXIgfCBzdHJpbmcpXG4gICAgKTtcbiAgfVxuXG4gIGdldEFsbCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXRpZXNVcmwpO1xuICB9XG5cbiAgZ2V0QnlJZChrZXk6IG51bWJlciB8IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBnZXRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycik7XG4gIH1cblxuICBnZXRXaXRoUXVlcnkocXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBjb25zdCBxUGFyYW1zID1cbiAgICAgIHR5cGVvZiBxdWVyeVBhcmFtcyA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7IGZyb21TdHJpbmc6IHF1ZXJ5UGFyYW1zIH1cbiAgICAgICAgOiB7IGZyb21PYmplY3Q6IHF1ZXJ5UGFyYW1zIH07XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMocVBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCwgdW5kZWZpbmVkLCB7IHBhcmFtcyB9KTtcbiAgfVxuXG4gIHVwZGF0ZSh1cGRhdGU6IFVwZGF0ZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGlkID0gdXBkYXRlICYmIHVwZGF0ZS5pZDtcbiAgICBjb25zdCB1cGRhdGVPckVycm9yID1cbiAgICAgIGlkID09IG51bGxcbiAgICAgICAgPyBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgdXBkYXRlIGRhdGEgb3IgaWRgKVxuICAgICAgICA6IHVwZGF0ZS5jaGFuZ2VzO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BVVCcsIHRoaXMuZW50aXR5VXJsICsgaWQsIHVwZGF0ZU9yRXJyb3IpO1xuICB9XG5cbiAgLy8gSW1wb3J0YW50ISBPbmx5IGNhbGwgaWYgdGhlIGJhY2tlbmQgc2VydmljZSBzdXBwb3J0cyB1cHNlcnRzIGFzIGEgUE9TVCB0byB0aGUgdGFyZ2V0IFVSTFxuICB1cHNlcnQoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byB1cHNlcnRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGV4ZWN1dGUoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kcyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LCAvLyBkYXRhLCBlcnJvciwgb3IgdW5kZWZpbmVkL251bGxcbiAgICBvcHRpb25zPzogYW55XG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgcmVxOiBSZXF1ZXN0RGF0YSA9IHsgbWV0aG9kLCB1cmwsIGRhdGEsIG9wdGlvbnMgfTtcblxuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKHJlcSkoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8QXJyYXlCdWZmZXI+O1xuXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ0RFTEVURSc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5kZWxldGUodXJsLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnR0VUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmdldCh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5nZXREZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5nZXREZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnUE9TVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wb3N0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIE4uQi46IEl0IG11c3QgcmV0dXJuIGFuIFVwZGF0ZTxUPlxuICAgICAgY2FzZSAnUFVUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnB1dCh1cmwsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdVbmltcGxlbWVudGVkIEhUVFAgbWV0aG9kLCAnICsgbWV0aG9kKTtcbiAgICAgICAgcmVzdWx0JCA9IHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0ICsgdGhpcy5zYXZlRGVsYXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCQucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IocmVxKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG9rID0gdGhpcy5oYW5kbGVEZWxldGU0MDQoZXJyLCByZXFEYXRhKTtcbiAgICAgIGlmIChvaykge1xuICAgICAgICByZXR1cm4gb2s7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgcmVxRGF0YSk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRGVsZXRlNDA0KGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSwgcmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICBpZiAoXG4gICAgICBlcnJvci5zdGF0dXMgPT09IDQwNCAmJlxuICAgICAgcmVxRGF0YS5tZXRob2QgPT09ICdERUxFVEUnICYmXG4gICAgICB0aGlzLmRlbGV0ZTQwNE9LXG4gICAgKSB7XG4gICAgICByZXR1cm4gb2Yoe30pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgaHR0cFVybEdlbmVyYXRvci5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoY29uZmlnLmVudGl0eUh0dHBSZXNvdXJjZVVybHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRlZmF1bHQge0VudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZX0gZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3IgdGhpcyBkYXRhIHNlcnZpY2VcbiAgICovXG4gIGNyZWF0ZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICAgIHJldHVybiBuZXcgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuaHR0cCxcbiAgICAgIHRoaXMuaHR0cFVybEdlbmVyYXRvcixcbiAgICAgIHRoaXMuY29uZmlnXG4gICAgKTtcbiAgfVxufVxuIl19