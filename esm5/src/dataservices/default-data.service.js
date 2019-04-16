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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUNMLFVBQVUsRUFFVixVQUFVLEdBQ1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQU8sT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJdEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFPekUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFeEQ7Ozs7R0FJRztBQUNIO0lBY0UsNEJBQ0UsVUFBa0IsRUFDUixJQUFnQixFQUNoQixnQkFBa0MsRUFDNUMsTUFBaUM7UUFGdkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBWHBDLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztRQVlwQixJQUFJLENBQUMsS0FBSyxHQUFNLFVBQVUsd0JBQXFCLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDdkIsSUFBQSxpQkFPUSxFQU5aLFlBQVksRUFBWixpQ0FBWSxFQUNaLG1CQUFrQixFQUFsQix1Q0FBa0IsRUFDbEIs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QixDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRDs7O09BR0c7SUFDSCwwQ0FBTSxHQUFOLFVBQVUsVUFBa0I7UUFDMUIsT0FBTyxJQUFJLGtCQUFrQixDQUMzQixVQUFVLEVBQ1YsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztJQUNKLENBQUM7SUFyQlUseUJBQXlCO1FBRHJDLFVBQVUsRUFBRTtRQUtSLG1CQUFBLFFBQVEsRUFBRSxDQUFBO2lEQUZLLFVBQVU7WUFDRSxnQkFBZ0I7WUFDYix3QkFBd0I7T0FKOUMseUJBQXlCLENBc0JyQztJQUFELGdDQUFDO0NBQUEsQUF0QkQsSUFzQkM7U0F0QlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBDbGllbnQsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwUGFyYW1zLFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0YXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcgfSBmcm9tICcuL2RlZmF1bHQtZGF0YS1zZXJ2aWNlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2UsXG4gIEh0dHBNZXRob2RzLFxuICBRdWVyeVBhcmFtcyxcbiAgUmVxdWVzdERhdGEsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBIdHRwVXJsR2VuZXJhdG9yIH0gZnJvbSAnLi9odHRwLXVybC1nZW5lcmF0b3InO1xuXG4vKipcbiAqIEEgYmFzaWMsIGdlbmVyaWMgZW50aXR5IGRhdGEgc2VydmljZVxuICogc3VpdGFibGUgZm9yIHBlcnNpc3RlbmNlIG9mIG1vc3QgZW50aXRpZXMuXG4gKiBBc3N1bWVzIGEgY29tbW9uIFJFU1QteSB3ZWIgQVBJXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4gaW1wbGVtZW50cyBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGRlbGV0ZTQwNE9LOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXR5VXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdGllc1VybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZ2V0RGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLl9uYW1lID0gYCR7ZW50aXR5TmFtZX0gRGVmYXVsdERhdGFTZXJ2aWNlYDtcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBlbnRpdHlOYW1lO1xuICAgIGNvbnN0IHtcbiAgICAgIHJvb3QgPSAnYXBpJyxcbiAgICAgIGRlbGV0ZTQwNE9LID0gdHJ1ZSxcbiAgICAgIGdldERlbGF5ID0gMCxcbiAgICAgIHNhdmVEZWxheSA9IDAsXG4gICAgICB0aW1lb3V0OiB0byA9IDAsXG4gICAgfSA9XG4gICAgICBjb25maWcgfHwge307XG4gICAgdGhpcy5kZWxldGU0MDRPSyA9IGRlbGV0ZTQwNE9LO1xuICAgIHRoaXMuZW50aXR5VXJsID0gaHR0cFVybEdlbmVyYXRvci5lbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lLCByb290KTtcbiAgICB0aGlzLmVudGl0aWVzVXJsID0gaHR0cFVybEdlbmVyYXRvci5jb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZSwgcm9vdCk7XG4gICAgdGhpcy5nZXREZWxheSA9IGdldERlbGF5O1xuICAgIHRoaXMuc2F2ZURlbGF5ID0gc2F2ZURlbGF5O1xuICAgIHRoaXMudGltZW91dCA9IHRvO1xuICB9XG5cbiAgYWRkKGVudGl0eTogVCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGVudGl0eU9yRXJyb3IgPVxuICAgICAgZW50aXR5IHx8IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBlbnRpdHkgdG8gYWRkYCk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUE9TVCcsIHRoaXMuZW50aXR5VXJsLCBlbnRpdHlPckVycm9yKTtcbiAgfVxuXG4gIGRlbGV0ZShrZXk6IG51bWJlciB8IHN0cmluZyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGRlbGV0ZWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdERUxFVEUnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyKS5waXBlKFxuICAgICAgLy8gZm9yd2FyZCB0aGUgaWQgb2YgZGVsZXRlZCBlbnRpdHkgYXMgdGhlIHJlc3VsdCBvZiB0aGUgSFRUUCBERUxFVEVcbiAgICAgIG1hcChyZXN1bHQgPT4ga2V5IGFzIG51bWJlciB8IHN0cmluZylcbiAgICApO1xuICB9XG5cbiAgZ2V0QWxsKCk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCk7XG4gIH1cblxuICBnZXRCeUlkKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGdldGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyKTtcbiAgfVxuXG4gIGdldFdpdGhRdWVyeShxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIGNvbnN0IHFQYXJhbXMgPVxuICAgICAgdHlwZW9mIHF1ZXJ5UGFyYW1zID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZnJvbVN0cmluZzogcXVlcnlQYXJhbXMgfVxuICAgICAgICA6IHsgZnJvbU9iamVjdDogcXVlcnlQYXJhbXMgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyhxUGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsLCB1bmRlZmluZWQsIHsgcGFyYW1zIH0pO1xuICB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVXBkYXRlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgaWQgPSB1cGRhdGUgJiYgdXBkYXRlLmlkO1xuICAgIGNvbnN0IHVwZGF0ZU9yRXJyb3IgPVxuICAgICAgaWQgPT0gbnVsbFxuICAgICAgICA/IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiB1cGRhdGUgZGF0YSBvciBpZGApXG4gICAgICAgIDogdXBkYXRlLmNoYW5nZXM7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUFVUJywgdGhpcy5lbnRpdHlVcmwgKyBpZCwgdXBkYXRlT3JFcnJvcik7XG4gIH1cblxuICAvLyBJbXBvcnRhbnQhIE9ubHkgY2FsbCBpZiB0aGUgYmFja2VuZCBzZXJ2aWNlIHN1cHBvcnRzIHVwc2VydHMgYXMgYSBQT1NUIHRvIHRoZSB0YXJnZXQgVVJMXG4gIHVwc2VydChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIHVwc2VydGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhlY3V0ZShcbiAgICBtZXRob2Q6IEh0dHBNZXRob2RzLFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksIC8vIGRhdGEsIGVycm9yLCBvciB1bmRlZmluZWQvbnVsbFxuICAgIG9wdGlvbnM/OiBhbnlcbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCByZXE6IFJlcXVlc3REYXRhID0geyBtZXRob2QsIHVybCwgZGF0YSwgb3B0aW9ucyB9O1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IocmVxKShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0JDogT2JzZXJ2YWJsZTxBcnJheUJ1ZmZlcj47XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnREVMRVRFJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdHRVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLmdldERlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLmdldERlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdQT1NUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnBvc3QodXJsLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gTi5CLjogSXQgbXVzdCByZXR1cm4gYW4gVXBkYXRlPFQ+XG4gICAgICBjYXNlICdQVVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucHV0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQgSFRUUCBtZXRob2QsICcgKyBtZXRob2QpO1xuICAgICAgICByZXN1bHQkID0gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUodGltZW91dCh0aGlzLnRpbWVvdXQgKyB0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0JC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcihyZXEpKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgb2sgPSB0aGlzLmhhbmRsZURlbGV0ZTQwNChlcnIsIHJlcURhdGEpO1xuICAgICAgaWYgKG9rKSB7XG4gICAgICAgIHJldHVybiBvaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVEZWxldGU0MDQoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlLCByZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIGlmIChcbiAgICAgIGVycm9yLnN0YXR1cyA9PT0gNDA0ICYmXG4gICAgICByZXFEYXRhLm1ldGhvZCA9PT0gJ0RFTEVURScgJiZcbiAgICAgIHRoaXMuZGVsZXRlNDA0T0tcbiAgICApIHtcbiAgICAgIHJldHVybiBvZih7fSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBodHRwVXJsR2VuZXJhdG9yLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhjb25maWcuZW50aXR5SHR0cFJlc291cmNlVXJscyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCB7RW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlfSBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGRhdGEgc2VydmljZVxuICAgKi9cbiAgY3JlYXRlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5odHRwLFxuICAgICAgdGhpcy5odHRwVXJsR2VuZXJhdG9yLFxuICAgICAgdGhpcy5jb25maWdcbiAgICApO1xuICB9XG59XG4iXX0=