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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBR0wsVUFBVSxHQUNYLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSWpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7OztBQVV4RDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQWU3QixZQUNFLFVBQWtCLEVBQ1IsSUFBZ0IsRUFDaEIsZ0JBQWtDLEVBQzVDLE1BQWlDO1FBRnZCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVpwQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWiwyQkFBc0IsR0FBRyxLQUFLLENBQUM7UUFZdkMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUscUJBQXFCLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsTUFBTSxFQUNKLElBQUksR0FBRyxLQUFLLEVBQ1osV0FBVyxHQUFHLElBQUksRUFDbEIsUUFBUSxHQUFHLENBQUMsRUFDWixTQUFTLEdBQUcsQ0FBQyxFQUNiLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUNmLHNC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QixDQUMzQixVQUFVLEVBQ1YsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztJQUNKLENBQUM7OzRKQXJCVSx5QkFBeUI7Z0tBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxVQUFVOzswQkFLTixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBDbGllbnQsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwUGFyYW1zLFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlLFxuICBIdHRwTWV0aG9kcyxcbiAgUXVlcnlQYXJhbXMsXG4gIFJlcXVlc3REYXRhLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSHR0cFVybEdlbmVyYXRvciB9IGZyb20gJy4vaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuLyoqXG4gKiBBIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBkZWxldGU0MDRPSzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGVudGl0eU5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0eVVybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXRpZXNVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGdldERlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcbiAgcHJvdGVjdGVkIHRyYWlsaW5nU2xhc2hFbmRwb2ludHMgPSBmYWxzZTtcblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5fbmFtZSA9IGAke2VudGl0eU5hbWV9IERlZmF1bHREYXRhU2VydmljZWA7XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICBjb25zdCB7XG4gICAgICByb290ID0gJ2FwaScsXG4gICAgICBkZWxldGU0MDRPSyA9IHRydWUsXG4gICAgICBnZXREZWxheSA9IDAsXG4gICAgICBzYXZlRGVsYXkgPSAwLFxuICAgICAgdGltZW91dDogdG8gPSAwLFxuICAgICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50cyA9IGZhbHNlLFxuICAgIH0gPSBjb25maWcgfHwge307XG4gICAgdGhpcy5kZWxldGU0MDRPSyA9IGRlbGV0ZTQwNE9LO1xuICAgIHRoaXMuZW50aXR5VXJsID0gaHR0cFVybEdlbmVyYXRvci5lbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lLCByb290LFxuICAgICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50cyk7XG4gICAgdGhpcy5lbnRpdGllc1VybCA9IGh0dHBVcmxHZW5lcmF0b3IuY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZ2V0RGVsYXkgPSBnZXREZWxheTtcbiAgICB0aGlzLnNhdmVEZWxheSA9IHNhdmVEZWxheTtcbiAgICB0aGlzLnRpbWVvdXQgPSB0bztcbiAgfVxuXG4gIGFkZChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIGFkZGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBkZWxldGUoa2V5OiBudW1iZXIgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPG51bWJlciB8IHN0cmluZz4ge1xuICAgIGxldCBlcnI6IEVycm9yIHwgdW5kZWZpbmVkO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGtleSB0byBkZWxldGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnREVMRVRFJywgdGhpcy5lbnRpdHlVcmwgKyBrZXksIGVycikucGlwZShcbiAgICAgIC8vIGZvcndhcmQgdGhlIGlkIG9mIGRlbGV0ZWQgZW50aXR5IGFzIHRoZSByZXN1bHQgb2YgdGhlIEhUVFAgREVMRVRFXG4gICAgICBtYXAoKHJlc3VsdCkgPT4ga2V5IGFzIG51bWJlciB8IHN0cmluZylcbiAgICApO1xuICB9XG5cbiAgZ2V0QWxsKCk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCk7XG4gIH1cblxuICBnZXRCeUlkKGtleTogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgbGV0IGVycjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIga2V5IHRvIGdldGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0eVVybCArIGtleSwgZXJyKTtcbiAgfVxuXG4gIGdldFdpdGhRdWVyeShxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIGNvbnN0IHFQYXJhbXMgPVxuICAgICAgdHlwZW9mIHF1ZXJ5UGFyYW1zID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZnJvbVN0cmluZzogcXVlcnlQYXJhbXMgfVxuICAgICAgICA6IHsgZnJvbU9iamVjdDogcXVlcnlQYXJhbXMgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyhxUGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdHRVQnLCB0aGlzLmVudGl0aWVzVXJsLCB1bmRlZmluZWQsIHsgcGFyYW1zIH0pO1xuICB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVXBkYXRlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgaWQgPSB1cGRhdGUgJiYgdXBkYXRlLmlkO1xuICAgIGNvbnN0IHVwZGF0ZU9yRXJyb3IgPVxuICAgICAgaWQgPT0gbnVsbFxuICAgICAgICA/IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiB1cGRhdGUgZGF0YSBvciBpZGApXG4gICAgICAgIDogdXBkYXRlLmNoYW5nZXM7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUFVUJywgdGhpcy5lbnRpdHlVcmwgKyBpZCwgdXBkYXRlT3JFcnJvcik7XG4gIH1cblxuICAvLyBJbXBvcnRhbnQhIE9ubHkgY2FsbCBpZiB0aGUgYmFja2VuZCBzZXJ2aWNlIHN1cHBvcnRzIHVwc2VydHMgYXMgYSBQT1NUIHRvIHRoZSB0YXJnZXQgVVJMXG4gIHVwc2VydChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBlbnRpdHlPckVycm9yID1cbiAgICAgIGVudGl0eSB8fCBuZXcgRXJyb3IoYE5vIFwiJHt0aGlzLmVudGl0eU5hbWV9XCIgZW50aXR5IHRvIHVwc2VydGApO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ1BPU1QnLCB0aGlzLmVudGl0eVVybCwgZW50aXR5T3JFcnJvcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhlY3V0ZShcbiAgICBtZXRob2Q6IEh0dHBNZXRob2RzLFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksIC8vIGRhdGEsIGVycm9yLCBvciB1bmRlZmluZWQvbnVsbFxuICAgIG9wdGlvbnM/OiBhbnlcbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCByZXE6IFJlcXVlc3REYXRhID0geyBtZXRob2QsIHVybCwgZGF0YSwgb3B0aW9ucyB9O1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IocmVxKShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0JDogT2JzZXJ2YWJsZTxBcnJheUJ1ZmZlcj47XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnREVMRVRFJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdHRVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLmdldERlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLmdldERlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdQT1NUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnBvc3QodXJsLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gTi5CLjogSXQgbXVzdCByZXR1cm4gYW4gVXBkYXRlPFQ+XG4gICAgICBjYXNlICdQVVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucHV0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQgSFRUUCBtZXRob2QsICcgKyBtZXRob2QpO1xuICAgICAgICByZXN1bHQkID0gdGhyb3dFcnJvcigoKSA9PiBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUodGltZW91dCh0aGlzLnRpbWVvdXQgKyB0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0JC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcihyZXEpKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgb2sgPSB0aGlzLmhhbmRsZURlbGV0ZTQwNChlcnIsIHJlcURhdGEpO1xuICAgICAgaWYgKG9rKSB7XG4gICAgICAgIHJldHVybiBvaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVEZWxldGU0MDQoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlLCByZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIGlmIChcbiAgICAgIGVycm9yLnN0YXR1cyA9PT0gNDA0ICYmXG4gICAgICByZXFEYXRhLm1ldGhvZCA9PT0gJ0RFTEVURScgJiZcbiAgICAgIHRoaXMuZGVsZXRlNDA0T0tcbiAgICApIHtcbiAgICAgIHJldHVybiBvZih7fSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBodHRwVXJsR2VuZXJhdG9yLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhjb25maWcuZW50aXR5SHR0cFJlc291cmNlVXJscyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCB7RW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlfSBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGRhdGEgc2VydmljZVxuICAgKi9cbiAgY3JlYXRlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5odHRwLFxuICAgICAgdGhpcy5odHRwVXJsR2VuZXJhdG9yLFxuICAgICAgdGhpcy5jb25maWdcbiAgICApO1xuICB9XG59XG4iXX0=