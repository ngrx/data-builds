(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dataservices/default-data.service", ["require", "exports", "tslib", "@angular/core", "@angular/common/http", "rxjs", "rxjs/operators", "@ngrx/data/src/dataservices/data-service-error", "@ngrx/data/src/dataservices/default-data-service-config", "@ngrx/data/src/dataservices/http-url-generator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const http_1 = require("@angular/common/http");
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    const data_service_error_1 = require("@ngrx/data/src/dataservices/data-service-error");
    const default_data_service_config_1 = require("@ngrx/data/src/dataservices/default-data-service-config");
    const http_url_generator_1 = require("@ngrx/data/src/dataservices/http-url-generator");
    /**
     * A basic, generic entity data service
     * suitable for persistence of most entities.
     * Assumes a common REST-y web API
     */
    class DefaultDataService {
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
        get name() {
            return this._name;
        }
        add(entity) {
            const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
            return this.execute('POST', this.entityUrl, entityOrError);
        }
        delete(key) {
            let err;
            if (key == null) {
                err = new Error(`No "${this.entityName}" key to delete`);
            }
            return this.execute('DELETE', this.entityUrl + key, err).pipe(
            // forward the id of deleted entity as the result of the HTTP DELETE
            operators_1.map(result => key));
        }
        getAll() {
            return this.execute('GET', this.entitiesUrl);
        }
        getById(key) {
            let err;
            if (key == null) {
                err = new Error(`No "${this.entityName}" key to get`);
            }
            return this.execute('GET', this.entityUrl + key, err);
        }
        getWithQuery(queryParams) {
            const qParams = typeof queryParams === 'string'
                ? { fromString: queryParams }
                : { fromObject: queryParams };
            const params = new http_1.HttpParams(qParams);
            return this.execute('GET', this.entitiesUrl, undefined, { params });
        }
        update(update) {
            const id = update && update.id;
            const updateOrError = id == null
                ? new Error(`No "${this.entityName}" update data or id`)
                : update.changes;
            return this.execute('PUT', this.entityUrl + id, updateOrError);
        }
        // Important! Only call if the backend service supports upserts as a POST to the target URL
        upsert(entity) {
            const entityOrError = entity || new Error(`No "${this.entityName}" entity to upsert`);
            return this.execute('POST', this.entityUrl, entityOrError);
        }
        execute(method, url, data, // data, error, or undefined/null
        options) {
            const req = { method, url, data, options };
            if (data instanceof Error) {
                return this.handleError(req)(data);
            }
            let result$;
            switch (method) {
                case 'DELETE': {
                    result$ = this.http.delete(url, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators_1.delay(this.saveDelay));
                    }
                    break;
                }
                case 'GET': {
                    result$ = this.http.get(url, options);
                    if (this.getDelay) {
                        result$ = result$.pipe(operators_1.delay(this.getDelay));
                    }
                    break;
                }
                case 'POST': {
                    result$ = this.http.post(url, data, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators_1.delay(this.saveDelay));
                    }
                    break;
                }
                // N.B.: It must return an Update<T>
                case 'PUT': {
                    result$ = this.http.put(url, data, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators_1.delay(this.saveDelay));
                    }
                    break;
                }
                default: {
                    const error = new Error('Unimplemented HTTP method, ' + method);
                    result$ = rxjs_1.throwError(error);
                }
            }
            if (this.timeout) {
                result$ = result$.pipe(operators_1.timeout(this.timeout + this.saveDelay));
            }
            return result$.pipe(operators_1.catchError(this.handleError(req)));
        }
        handleError(reqData) {
            return (err) => {
                const ok = this.handleDelete404(err, reqData);
                if (ok) {
                    return ok;
                }
                const error = new data_service_error_1.DataServiceError(err, reqData);
                return rxjs_1.throwError(error);
            };
        }
        handleDelete404(error, reqData) {
            if (error.status === 404 &&
                reqData.method === 'DELETE' &&
                this.delete404OK) {
                return rxjs_1.of({});
            }
            return undefined;
        }
    }
    exports.DefaultDataService = DefaultDataService;
    /**
     * Create a basic, generic entity data service
     * suitable for persistence of most entities.
     * Assumes a common REST-y web API
     */
    let DefaultDataServiceFactory = class DefaultDataServiceFactory {
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
    };
    DefaultDataServiceFactory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(2, core_1.Optional()),
        tslib_1.__metadata("design:paramtypes", [http_1.HttpClient,
            http_url_generator_1.HttpUrlGenerator,
            default_data_service_config_1.DefaultDataServiceConfig])
    ], DefaultDataServiceFactory);
    exports.DefaultDataServiceFactory = DefaultDataServiceFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBcUQ7SUFDckQsK0NBSThCO0lBRTlCLCtCQUFrRDtJQUNsRCw4Q0FBaUU7SUFJakUsdUZBQXdEO0lBQ3hELHlHQUF5RTtJQU96RSx1RkFBd0Q7SUFFeEQ7Ozs7T0FJRztJQUNILE1BQWEsa0JBQWtCO1FBYzdCLFlBQ0UsVUFBa0IsRUFDUixJQUFnQixFQUNoQixnQkFBa0MsRUFDNUMsTUFBaUM7WUFGdkIsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUNoQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1lBWHBDLGFBQVEsR0FBRyxDQUFDLENBQUM7WUFDYixjQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztZQVlwQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsVUFBVSxxQkFBcUIsQ0FBQztZQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixNQUFNLEVBQ0osSUFBSSxHQUFHLEtBQUssRUFDWixXQUFXLEdBQUcsSUFBSSxFQUNsQixRQUFRLEdBQUcsQ0FBQyxFQUNaLFNBQVMsR0FBRyxDQUFDLEVBQ2IsT0FBTyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQ2hCLEdBQ0MsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsV0FBVyxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJ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Qyx5QkFBeUIsQ0FzQnJDO0lBdEJZLDhEQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIG1hcCwgdGltZW91dCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZSxcbiAgSHR0cE1ldGhvZHMsXG4gIFF1ZXJ5UGFyYW1zLFxuICBSZXF1ZXN0RGF0YSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEh0dHBVcmxHZW5lcmF0b3IgfSBmcm9tICcuL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbi8qKlxuICogQSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZTxUPiBpbXBsZW1lbnRzIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGVsZXRlNDA0T0s6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdHlVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0aWVzVXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBnZXREZWxheSA9IDA7XG4gIHByb3RlY3RlZCBzYXZlRGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgdGltZW91dCA9IDA7XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuX25hbWUgPSBgJHtlbnRpdHlOYW1lfSBEZWZhdWx0RGF0YVNlcnZpY2VgO1xuICAgIHRoaXMuZW50aXR5TmFtZSA9IGVudGl0eU5hbWU7XG4gICAgY29uc3Qge1xuICAgICAgcm9vdCA9ICdhcGknLFxuICAgICAgZGVsZXRlNDA0T0sgPSB0cnVlLFxuICAgICAgZ2V0RGVsYXkgPSAwLFxuICAgICAgc2F2ZURlbGF5ID0gMCxcbiAgICAgIHRpbWVvdXQ6IHRvID0gMCxcbiAgICB9ID1cbiAgICAgIGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLmRlbGV0ZTQwNE9LID0gZGVsZXRlNDA0T0s7XG4gICAgdGhpcy5lbnRpdHlVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmVudGl0eVJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZW50aXRpZXNVcmwgPSBodHRwVXJsR2VuZXJhdG9yLmNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lLCByb290KTtcbiAgICB0aGlzLmdldERlbGF5ID0gZ2V0RGVsYXk7XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICBhZGQoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byBhZGRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IpO1xuICB9XG5cbiAgZGVsZXRlKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZGVsZXRlYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0RFTEVURScsIHRoaXMuZW50aXR5VXJsICsga2V5LCBlcnIpLnBpcGUoXG4gICAgICAvLyBmb3J3YXJkIHRoZSBpZCBvZiBkZWxldGVkIGVudGl0eSBhcyB0aGUgcmVzdWx0IG9mIHRoZSBIVFRQIERFTEVURVxuICAgICAgbWFwKHJlc3VsdCA9PiBrZXkgYXMgbnVtYmVyIHwgc3RyaW5nKVxuICAgICk7XG4gIH1cblxuICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsKTtcbiAgfVxuXG4gIGdldEJ5SWQoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZ2V0YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXR5VXJsICsga2V5LCBlcnIpO1xuICB9XG5cbiAgZ2V0V2l0aFF1ZXJ5KHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgY29uc3QgcVBhcmFtcyA9XG4gICAgICB0eXBlb2YgcXVlcnlQYXJhbXMgPT09ICdzdHJpbmcnXG4gICAgICAgID8geyBmcm9tU3RyaW5nOiBxdWVyeVBhcmFtcyB9XG4gICAgICAgIDogeyBmcm9tT2JqZWN0OiBxdWVyeVBhcmFtcyB9O1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHFQYXJhbXMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXRpZXNVcmwsIHVuZGVmaW5lZCwgeyBwYXJhbXMgfSk7XG4gIH1cblxuICB1cGRhdGUodXBkYXRlOiBVcGRhdGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBpZCA9IHVwZGF0ZSAmJiB1cGRhdGUuaWQ7XG4gICAgY29uc3QgdXBkYXRlT3JFcnJvciA9XG4gICAgICBpZCA9PSBudWxsXG4gICAgICAgID8gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIHVwZGF0ZSBkYXRhIG9yIGlkYClcbiAgICAgICAgOiB1cGRhdGUuY2hhbmdlcztcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQVVQnLCB0aGlzLmVudGl0eVVybCArIGlkLCB1cGRhdGVPckVycm9yKTtcbiAgfVxuXG4gIC8vIEltcG9ydGFudCEgT25seSBjYWxsIGlmIHRoZSBiYWNrZW5kIHNlcnZpY2Ugc3VwcG9ydHMgdXBzZXJ0cyBhcyBhIFBPU1QgdG8gdGhlIHRhcmdldCBVUkxcbiAgdXBzZXJ0KGVudGl0eTogVCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGVudGl0eU9yRXJyb3IgPVxuICAgICAgZW50aXR5IHx8IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBlbnRpdHkgdG8gdXBzZXJ0YCk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUE9TVCcsIHRoaXMuZW50aXR5VXJsLCBlbnRpdHlPckVycm9yKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBleGVjdXRlKFxuICAgIG1ldGhvZDogSHR0cE1ldGhvZHMsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSwgLy8gZGF0YSwgZXJyb3IsIG9yIHVuZGVmaW5lZC9udWxsXG4gICAgb3B0aW9ucz86IGFueVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IHJlcTogUmVxdWVzdERhdGEgPSB7IG1ldGhvZCwgdXJsLCBkYXRhLCBvcHRpb25zIH07XG5cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvcihyZXEpKGRhdGEpO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQkOiBPYnNlcnZhYmxlPEFycmF5QnVmZmVyPjtcblxuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdERUxFVEUnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZGVsZXRlKHVybCwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ0dFVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5nZXQodXJsLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0RGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuZ2V0RGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ1BPU1QnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucG9zdCh1cmwsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICAvLyBOLkIuOiBJdCBtdXN0IHJldHVybiBhbiBVcGRhdGU8VD5cbiAgICAgIGNhc2UgJ1BVVCc6IHtcbiAgICAgICAgcmVzdWx0JCA9IHRoaXMuaHR0cC5wdXQodXJsLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignVW5pbXBsZW1lbnRlZCBIVFRQIG1ldGhvZCwgJyArIG1ldGhvZCk7XG4gICAgICAgIHJlc3VsdCQgPSB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZSh0aW1lb3V0KHRoaXMudGltZW91dCArIHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQkLnBpcGUoY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yKHJlcSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IocmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICByZXR1cm4gKGVycjogYW55KSA9PiB7XG4gICAgICBjb25zdCBvayA9IHRoaXMuaGFuZGxlRGVsZXRlNDA0KGVyciwgcmVxRGF0YSk7XG4gICAgICBpZiAob2spIHtcbiAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIHJlcURhdGEpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZURlbGV0ZTQwNChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UsIHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgaWYgKFxuICAgICAgZXJyb3Iuc3RhdHVzID09PSA0MDQgJiZcbiAgICAgIHJlcURhdGEubWV0aG9kID09PSAnREVMRVRFJyAmJlxuICAgICAgdGhpcy5kZWxldGU0MDRPS1xuICAgICkge1xuICAgICAgcmV0dXJuIG9mKHt9KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBodHRwVXJsR2VuZXJhdG9yOiBIdHRwVXJsR2VuZXJhdG9yLFxuICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGh0dHBVcmxHZW5lcmF0b3IucmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKGNvbmZpZy5lbnRpdHlIdHRwUmVzb3VyY2VVcmxzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHtFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2V9IGZvciB0aGUgZ2l2ZW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgZGF0YSBzZXJ2aWNlXG4gICAqL1xuICBjcmVhdGU8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IERlZmF1bHREYXRhU2VydmljZTxUPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmh0dHAsXG4gICAgICB0aGlzLmh0dHBVcmxHZW5lcmF0b3IsXG4gICAgICB0aGlzLmNvbmZpZ1xuICAgICk7XG4gIH1cbn1cbiJdfQ==