import { Injectable, Optional } from '@angular/core';
import { HttpParams, } from '@angular/common/http';
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
        map((result) => key));
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
        const params = new HttpParams(qParams);
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
                const error = new Error('Unimplemented HTTP method, ' + method);
                result$ = throwError(() => error);
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
            return throwError(() => error);
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
}
/** @nocollapse */ /** @nocollapse */ DefaultDataServiceFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultDataServiceFactory, deps: [{ token: i1.HttpClient }, { token: i2.HttpUrlGenerator }, { token: i3.DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ /** @nocollapse */ DefaultDataServiceFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultDataServiceFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultDataServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.HttpUrlGenerator }, { type: i3.DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBR0wsVUFBVSxHQUNYLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSWpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7OztBQVV4RDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQWM3QixZQUNFLFVBQWtCLEVBQ1IsSUFBZ0IsRUFDaEIsZ0JBQWtDLEVBQzVDLE1BQWlDO1FBRnZCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVhwQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFZcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUscUJBQXFCLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsTUFBTSxFQUNKLElBQUksR0FBRyxLQUFLLEVBQ1osV0FBVyxHQUFHLElBQUksRUFDbEIsUUFBUSxHQUFHLENBQUMsRUFDWixTQUFTLEdBQUcsQ0FBQyxFQUNiLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUNoQixHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFD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QUFJLENBQUMsTUFBTSxDQUNaLENBQUM7SUFDSixDQUFDOzs0SkFyQlUseUJBQXlCO2dLQUF6Qix5QkFBeUI7MkZBQXpCLHlCQUF5QjtrQkFEckMsVUFBVTs7MEJBS04sUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIG1hcCwgdGltZW91dCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZSxcbiAgSHR0cE1ldGhvZHMsXG4gIFF1ZXJ5UGFyYW1zLFxuICBSZXF1ZXN0RGF0YSxcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEh0dHBVcmxHZW5lcmF0b3IgfSBmcm9tICcuL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbi8qKlxuICogQSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZTxUPiBpbXBsZW1lbnRzIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGVsZXRlNDA0T0s6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbnRpdHlVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0aWVzVXJsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBnZXREZWxheSA9IDA7XG4gIHByb3RlY3RlZCBzYXZlRGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgdGltZW91dCA9IDA7XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJvdGVjdGVkIGh0dHBVcmxHZW5lcmF0b3I6IEh0dHBVcmxHZW5lcmF0b3IsXG4gICAgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuX25hbWUgPSBgJHtlbnRpdHlOYW1lfSBEZWZhdWx0RGF0YVNlcnZpY2VgO1xuICAgIHRoaXMuZW50aXR5TmFtZSA9IGVudGl0eU5hbWU7XG4gICAgY29uc3Qge1xuICAgICAgcm9vdCA9ICdhcGknLFxuICAgICAgZGVsZXRlNDA0T0sgPSB0cnVlLFxuICAgICAgZ2V0RGVsYXkgPSAwLFxuICAgICAgc2F2ZURlbGF5ID0gMCxcbiAgICAgIHRpbWVvdXQ6IHRvID0gMCxcbiAgICB9ID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuZGVsZXRlNDA0T0sgPSBkZWxldGU0MDRPSztcbiAgICB0aGlzLmVudGl0eVVybCA9IGh0dHBVcmxHZW5lcmF0b3IuZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZSwgcm9vdCk7XG4gICAgdGhpcy5lbnRpdGllc1VybCA9IGh0dHBVcmxHZW5lcmF0b3IuY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZ2V0RGVsYXkgPSBnZXREZWxheTtcbiAgICB0aGlzLnNhdmVEZWxheSA9IHNhdmVEZWxheTtcbiAgICB0aGlzLnRpbWVvdXQgPSB0bztcbiAgfVxuXG4gIGFkZChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIGFkZGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBkZWxldGUoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBkZWxldGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnREVMRVRFJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycikucGlwZShcbiAgICAgIC8vIGZvcndhcmQgdGhlIGlkIG9mIGRlbGV0ZWQgZW50aXR5IGFzIHRoZSByZXN1bHQgb2YgdGhlIEhUVFAgREVMRVRFXG4gICAgICBtYXAoKHJlc3VsdCkgPT4ga2V5IGFzIG51bWJlciB8IHN0cmluZylcbiAgICApO1xuICB9XG5cbiAgZ2V0QWxsKCk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCk7XG4gIH1cblxuICBnZXRCeUlkKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGdldGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyKTtcbiAgfVxuXG4gIGdldFdpdGhRdWVyeShxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIGNvbnN0IHFQYXJhbXMgPVxuICAgICAgdHlwZW9mIHF1ZXJ5UGFyYW1zID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZnJvbVN0cmluZzogcXVlcnlQYXJhbXMgfVxuICAgICAgICA6IHsgZnJvbU9iamVjdDogcXVlcnlQYXJhbXMgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyhxUGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsLCB1bmRlZmluZWQsIHsgcGFyYW1zIH0pO1xuICB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVXBkYXRlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgaWQgPSB1cGRhdGUgJiYgdXBkYXRlLmlkO1xuICAgIGNvbnN0IHVwZGF0ZU9yRXJyb3IgPVxuICAgICAgaWQgPT0gbnVsbFxuICAgICAgICA/IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiB1cGRhdGUgZGF0YSBvciBpZGApXG4gICAgICAgIDogdXBkYXRlLmNoYW5nZXM7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUFVUJywgdGhpcy5lbnRpdHlVcmwgKyBpZCwgdXBkYXRlT3JFcnJvcik7XG4gIH1cblxuICAvLyBJbXBvcnRhbnQhIE9ubHkgY2FsbCBpZiB0aGUgYmFja2VuZCBzZXJ2aWNlIHN1cHBvcnRzIHVwc2VydHMgYXMgYSBQT1NUIHRvIHRoZSB0YXJnZXQgVVJMXG4gIHVwc2VydChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIHVwc2VydGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhlY3V0ZShcbiAgICBtZXRob2Q6IEh0dHBNZXRob2RzLFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksIC8vIGRhdGEsIGVycm9yLCBvciB1bmRlZmluZWQvbnVsbFxuICAgIG9wdGlvbnM/OiBhbnlcbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCByZXE6IFJlcXVlc3REYXRhID0geyBtZXRob2QsIHVybCwgZGF0YSwgb3B0aW9ucyB9O1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IocmVxKShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0JDogT2JzZXJ2YWJsZTxBcnJheUJ1ZmZlcj47XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnREVMRVRFJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdHRVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLmdldERlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLmdldERlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdQT1NUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnBvc3QodXJsLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gTi5CLjogSXQgbXVzdCByZXR1cm4gYW4gVXBkYXRlPFQ+XG4gICAgICBjYXNlICdQVVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucHV0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQgSFRUUCBtZXRob2QsICcgKyBtZXRob2QpO1xuICAgICAgICByZXN1bHQkID0gdGhyb3dFcnJvcigoKSA9PiBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUodGltZW91dCh0aGlzLnRpbWVvdXQgKyB0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0JC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcihyZXEpKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgb2sgPSB0aGlzLmhhbmRsZURlbGV0ZTQwNChlcnIsIHJlcURhdGEpO1xuICAgICAgaWYgKG9rKSB7XG4gICAgICAgIHJldHVybiBvaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVEZWxldGU0MDQoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlLCByZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIGlmIChcbiAgICAgIGVycm9yLnN0YXR1cyA9PT0gNDA0ICYmXG4gICAgICByZXFEYXRhLm1ldGhvZCA9PT0gJ0RFTEVURScgJiZcbiAgICAgIHRoaXMuZGVsZXRlNDA0T0tcbiAgICApIHtcbiAgICAgIHJldHVybiBvZih7fSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBodHRwVXJsR2VuZXJhdG9yLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhjb25maWcuZW50aXR5SHR0cFJlc291cmNlVXJscyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCB7RW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlfSBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGRhdGEgc2VydmljZVxuICAgKi9cbiAgY3JlYXRlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5odHRwLFxuICAgICAgdGhpcy5odHRwVXJsR2VuZXJhdG9yLFxuICAgICAgdGhpcy5jb25maWdcbiAgICApO1xuICB9XG59XG4iXX0=