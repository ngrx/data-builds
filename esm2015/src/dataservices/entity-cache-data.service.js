import { Injectable, Optional } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { ChangeSetOperation, excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import * as i0 from "@angular/core";
import * as i1 from "../entity-metadata/entity-definition.service";
import * as i2 from "@angular/common/http";
import * as i3 from "./default-data-service-config";
const updateOp = ChangeSetOperation.Update;
/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
export class EntityCacheDataService {
    constructor(entityDefinitionService, http, config) {
        this.entityDefinitionService = entityDefinitionService;
        this.http = http;
        this.idSelectors = {};
        this.saveDelay = 0;
        this.timeout = 0;
        const { saveDelay = 0, timeout: to = 0 } = config || {};
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
    /**
     * Save changes to multiple entities across one or more entity collections.
     * Server endpoint must understand the essential SaveEntities protocol,
     * in particular the ChangeSet interface (except for Update<T>).
     * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
     * It then reconstructs Update<T>[] in the returned observable result.
     * @param changeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param url The server endpoint that receives this request.
     */
    saveEntities(changeSet, url) {
        changeSet = this.filterChangeSet(changeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        changeSet = this.flattenUpdates(changeSet);
        let result$ = this.http
            .post(url, changeSet)
            .pipe(map((result) => this.restoreUpdates(result)), catchError(this.handleError({ method: 'POST', url, data: changeSet })));
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }
        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }
        return result$;
    }
    // #region helpers
    handleError(reqData) {
        return (err) => {
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    }
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    filterChangeSet(changeSet) {
        return excludeEmptyChangeSetItems(changeSet);
    }
    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    flattenUpdates(changeSet) {
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        let hasMutated = false;
        changes = changes.map((item) => {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return Object.assign(Object.assign({}, item), { entities: item.entities.map((u) => u.changes) });
            }
            else {
                return item;
            }
        });
        return hasMutated ? Object.assign(Object.assign({}, changeSet), { changes }) : changeSet;
    }
    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    restoreUpdates(changeSet) {
        if (changeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return changeSet;
        }
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        let hasMutated = false;
        changes = changes.map((item) => {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                const selectId = this.getIdSelector(item.entityName);
                return Object.assign(Object.assign({}, item), { entities: item.entities.map((u) => ({
                        id: selectId(u),
                        changes: u,
                    })) });
            }
            else {
                return item;
            }
        });
        return hasMutated ? Object.assign(Object.assign({}, changeSet), { changes }) : changeSet;
    }
    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    getIdSelector(entityName) {
        let idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector = this.entityDefinitionService.getDefinition(entityName)
                .selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    }
}
/** @nocollapse */ EntityCacheDataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityCacheDataService, deps: [{ token: i1.EntityDefinitionService }, { token: i2.HttpClient }, { token: i3.DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ EntityCacheDataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityCacheDataService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityCacheDataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityDefinitionService }, { type: i2.HttpClient }, { type: i3.DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHckQsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsT0FBTyxFQUNMLGtCQUFrQixFQUlsQiwwQkFBMEIsR0FDM0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7QUFLeEQsTUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0FBRTNDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxzQkFBc0I7SUFLakMsWUFDWSx1QkFBZ0QsRUFDaEQsSUFBZ0IsRUFDZCxNQUFpQztRQUZuQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELFNBQUksR0FBSixJQUFJLENBQVk7UUFObEIsZ0JBQVcsR0FBOEMsRUFBRSxDQUFDO1FBQzVELGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBT3BCLE1BQU0sRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FV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YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBtYXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IElkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldCxcbiAgQ2hhbmdlU2V0SXRlbSxcbiAgQ2hhbmdlU2V0VXBkYXRlLFxuICBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBSZXF1ZXN0RGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IHVwZGF0ZU9wID0gQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTtcblxuLyoqXG4gKiBEZWZhdWx0IGRhdGEgc2VydmljZSBmb3IgbWFraW5nIHJlbW90ZSBzZXJ2aWNlIGNhbGxzIHRhcmdldGluZyB0aGUgZW50aXJlIEVudGl0eUNhY2hlLlxuICogU2VlIEVudGl0eURhdGFTZXJ2aWNlIGZvciBzZXJ2aWNlcyB0aGF0IHRhcmdldCBhIHNpbmdsZSBFbnRpdHlDb2xsZWN0aW9uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIGlkU2VsZWN0b3JzOiB7IFtlbnRpdHlOYW1lOiBzdHJpbmddOiBJZFNlbGVjdG9yPGFueT4gfSA9IHt9O1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbnRpdHlEZWZpbml0aW9uU2VydmljZTogRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbnN0IHsgc2F2ZURlbGF5ID0gMCwgdGltZW91dDogdG8gPSAwIH0gPSBjb25maWcgfHwge307XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBjaGFuZ2VzIHRvIG11bHRpcGxlIGVudGl0aWVzIGFjcm9zcyBvbmUgb3IgbW9yZSBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqIFNlcnZlciBlbmRwb2ludCBtdXN0IHVuZGVyc3RhbmQgdGhlIGVzc2VudGlhbCBTYXZlRW50aXRpZXMgcHJvdG9jb2wsXG4gICAqIGluIHBhcnRpY3VsYXIgdGhlIENoYW5nZVNldCBpbnRlcmZhY2UgKGV4Y2VwdCBmb3IgVXBkYXRlPFQ+KS5cbiAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBleHRyYWN0cyB0aGUgZW50aXR5IGNoYW5nZXMgZnJvbSBhIENoYW5nZVNldCBVcGRhdGU8VD5bXSBhbmQgc2VuZHMgdGhvc2UuXG4gICAqIEl0IHRoZW4gcmVjb25zdHJ1Y3RzIFVwZGF0ZTxUPltdIGluIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHJlc3VsdC5cbiAgICogQHBhcmFtIGNoYW5nZVNldCAgQW4gYXJyYXkgb2YgU2F2ZUVudGl0eUl0ZW1zLlxuICAgKiBFYWNoIFNhdmVFbnRpdHlJdGVtIGRlc2NyaWJlIGEgY2hhbmdlIG9wZXJhdGlvbiBmb3Igb25lIG9yIG1vcmUgZW50aXRpZXMgb2YgYSBzaW5nbGUgY29sbGVjdGlvbixcbiAgICoga25vd24gYnkgaXRzICdlbnRpdHlOYW1lJy5cbiAgICogQHBhcmFtIHVybCBUaGUgc2VydmVyIGVuZHBvaW50IHRoYXQgcmVjZWl2ZXMgdGhpcyByZXF1ZXN0LlxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKGNoYW5nZVNldDogQ2hhbmdlU2V0LCB1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiB7XG4gICAgY2hhbmdlU2V0ID0gdGhpcy5maWx0ZXJDaGFuZ2VTZXQoY2hhbmdlU2V0KTtcbiAgICAvLyBBc3N1bWUgc2VydmVyIGRvZXNuJ3QgdW5kZXJzdGFuZCBAbmdyeC9lbnRpdHkgVXBkYXRlPFQ+IHN0cnVjdHVyZTtcbiAgICAvLyBFeHRyYWN0IHRoZSBlbnRpdHkgY2hhbmdlcyBmcm9tIHRoZSBVcGRhdGU8VD5bXSBhbmQgcmVzdG9yZSBvbiB0aGUgcmV0dXJuIGZyb20gc2VydmVyXG4gICAgY2hhbmdlU2V0ID0gdGhpcy5mbGF0dGVuVXBkYXRlcyhjaGFuZ2VTZXQpO1xuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiA9IHRoaXMuaHR0cFxuICAgICAgLnBvc3Q8Q2hhbmdlU2V0Pih1cmwsIGNoYW5nZVNldClcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHJlc3VsdCkgPT4gdGhpcy5yZXN0b3JlVXBkYXRlcyhyZXN1bHQpKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yKHsgbWV0aG9kOiAnUE9TVCcsIHVybCwgZGF0YTogY2hhbmdlU2V0IH0pKVxuICAgICAgKTtcblxuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUodGltZW91dCh0aGlzLnRpbWVvdXQpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0JDtcbiAgfVxuXG4gIC8vICNyZWdpb24gaGVscGVyc1xuICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IocmVxRGF0YTogUmVxdWVzdERhdGEpIHtcbiAgICByZXR1cm4gKGVycjogYW55KSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgcmVxRGF0YSk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXIgY2hhbmdlU2V0IHRvIHJlbW92ZSB1bndhbnRlZCBDaGFuZ2VTZXRJdGVtcy5cbiAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBleGNsdWRlcyBudWxsIGFuZCBlbXB0eSBDaGFuZ2VTZXRJdGVtcy5cbiAgICogQHBhcmFtIGNoYW5nZVNldCBDaGFuZ2VTZXQgd2l0aCBjaGFuZ2VzIHRvIGZpbHRlclxuICAgKi9cbiAgcHJvdGVjdGVkIGZpbHRlckNoYW5nZVNldChjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgcmV0dXJuIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGNoYW5nZVNldCk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCB0aGUgZW50aXRpZXMgaW4gdXBkYXRlIGNoYW5nZXMgZnJvbSBAbmdyeCBVcGRhdGU8VD4gc3RydWN0dXJlIHRvIGp1c3QgVC5cbiAgICogUmV2ZXJzZSBvZiByZXN0b3JlVXBkYXRlcygpLlxuICAgKi9cbiAgcHJvdGVjdGVkIGZsYXR0ZW5VcGRhdGVzKGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgICBsZXQgY2hhbmdlcyA9IGNoYW5nZVNldC5jaGFuZ2VzO1xuICAgIGlmIChjaGFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNoYW5nZVNldDtcbiAgICB9XG4gICAgbGV0IGhhc011dGF0ZWQgPSBmYWxzZTtcbiAgICBjaGFuZ2VzID0gY2hhbmdlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLm9wID09PSB1cGRhdGVPcCAmJiBpdGVtLmVudGl0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaGFzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBlbnRpdGllczogKGl0ZW0gYXMgQ2hhbmdlU2V0VXBkYXRlKS5lbnRpdGllcy5tYXAoKHUpID0+IHUuY2hhbmdlcyksXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KSBhcyBDaGFuZ2VTZXRJdGVtW107XG4gICAgcmV0dXJuIGhhc011dGF0ZWQgPyB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9IDogY2hhbmdlU2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIGZsYXR0ZW5lZCBUIGVudGl0aWVzIGluIHVwZGF0ZSBjaGFuZ2VzIGJhY2sgdG8gQG5ncnggVXBkYXRlPFQ+IHN0cnVjdHVyZXMuXG4gICAqIFJldmVyc2Ugb2YgZmxhdHRlblVwZGF0ZXMoKS5cbiAgICovXG4gIHByb3RlY3RlZCByZXN0b3JlVXBkYXRlcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgaWYgKGNoYW5nZVNldCA9PSBudWxsKSB7XG4gICAgICAvLyBOb3RoaW5nPyBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkIHdpdGggMjA0IC0gTm8gQ29udGVudCBiZWNhdXNlIGl0IG1hZGUgbm8gY2hhbmdlcyB0byB0aGUgaW5zZXJ0ZWQgb3IgdXBkYXRlZCBlbnRpdGllc1xuICAgICAgcmV0dXJuIGNoYW5nZVNldDtcbiAgICB9XG4gICAgbGV0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcztcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBoYXNNdXRhdGVkID0gZmFsc2U7XG4gICAgY2hhbmdlcyA9IGNoYW5nZXMubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5vcCA9PT0gdXBkYXRlT3ApIHtcbiAgICAgICAgLy8gVGhlc2UgYXJlIGVudGl0aWVzLCBub3QgVXBkYXRlczsgY29udmVydCBiYWNrIHRvIFVwZGF0ZXNcbiAgICAgICAgaGFzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IHNlbGVjdElkID0gdGhpcy5nZXRJZFNlbGVjdG9yKGl0ZW0uZW50aXR5TmFtZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBlbnRpdGllczogaXRlbS5lbnRpdGllcy5tYXAoKHU6IGFueSkgPT4gKHtcbiAgICAgICAgICAgIGlkOiBzZWxlY3RJZCh1KSxcbiAgICAgICAgICAgIGNoYW5nZXM6IHUsXG4gICAgICAgICAgfSkpLFxuICAgICAgICB9IGFzIENoYW5nZVNldFVwZGF0ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgIH0pIGFzIENoYW5nZVNldEl0ZW1bXTtcbiAgICByZXR1cm4gaGFzTXV0YXRlZCA/IHsgLi4uY2hhbmdlU2V0LCBjaGFuZ2VzIH0gOiBjaGFuZ2VTZXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpZCAocHJpbWFyeSBrZXkpIHNlbGVjdG9yIGZ1bmN0aW9uIGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKi9cbiAgcHJvdGVjdGVkIGdldElkU2VsZWN0b3IoZW50aXR5TmFtZTogc3RyaW5nKSB7XG4gICAgbGV0IGlkU2VsZWN0b3IgPSB0aGlzLmlkU2VsZWN0b3JzW2VudGl0eU5hbWVdO1xuICAgIGlmICghaWRTZWxlY3Rvcikge1xuICAgICAgaWRTZWxlY3RvciA9IHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbihlbnRpdHlOYW1lKVxuICAgICAgICAuc2VsZWN0SWQ7XG4gICAgICB0aGlzLmlkU2VsZWN0b3JzW2VudGl0eU5hbWVdID0gaWRTZWxlY3RvcjtcbiAgICB9XG4gICAgcmV0dXJuIGlkU2VsZWN0b3I7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG4iXX0=