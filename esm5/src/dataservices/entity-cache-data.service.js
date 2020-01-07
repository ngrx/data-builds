import { __assign, __decorate, __metadata, __param } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { ChangeSetOperation, excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
var updateOp = ChangeSetOperation.Update;
/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
var EntityCacheDataService = /** @class */ (function () {
    function EntityCacheDataService(entityDefinitionService, http, config) {
        this.entityDefinitionService = entityDefinitionService;
        this.http = http;
        this.idSelectors = {};
        this.saveDelay = 0;
        this.timeout = 0;
        var _a = config || {}, _b = _a.saveDelay, saveDelay = _b === void 0 ? 0 : _b, _c = _a.timeout, to = _c === void 0 ? 0 : _c;
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
    EntityCacheDataService.prototype.saveEntities = function (changeSet, url) {
        var _this = this;
        changeSet = this.filterChangeSet(changeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        changeSet = this.flattenUpdates(changeSet);
        var result$ = this.http
            .post(url, changeSet)
            .pipe(map(function (result) { return _this.restoreUpdates(result); }), catchError(this.handleError({ method: 'POST', url: url, data: changeSet })));
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }
        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }
        return result$;
    };
    // #region helpers
    EntityCacheDataService.prototype.handleError = function (reqData) {
        return function (err) {
            var error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    };
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    EntityCacheDataService.prototype.filterChangeSet = function (changeSet) {
        return excludeEmptyChangeSetItems(changeSet);
    };
    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    EntityCacheDataService.prototype.flattenUpdates = function (changeSet) {
        var changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        var hasMutated = false;
        changes = changes.map(function (item) {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return __assign(__assign({}, item), { entities: item.entities.map(function (u) { return u.changes; }) });
            }
            else {
                return item;
            }
        });
        return hasMutated ? __assign(__assign({}, changeSet), { changes: changes }) : changeSet;
    };
    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    EntityCacheDataService.prototype.restoreUpdates = function (changeSet) {
        var _this = this;
        if (changeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return changeSet;
        }
        var changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        var hasMutated = false;
        changes = changes.map(function (item) {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                var selectId_1 = _this.getIdSelector(item.entityName);
                return __assign(__assign({}, item), { entities: item.entities.map(function (u) { return ({
                        id: selectId_1(u),
                        changes: u,
                    }); }) });
            }
            else {
                return item;
            }
        });
        return hasMutated ? __assign(__assign({}, changeSet), { changes: changes }) : changeSet;
    };
    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    EntityCacheDataService.prototype.getIdSelector = function (entityName) {
        var idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector = this.entityDefinitionService.getDefinition(entityName)
                .selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    };
    EntityCacheDataService = __decorate([
        Injectable(),
        __param(2, Optional()),
        __metadata("design:paramtypes", [EntityDefinitionService,
            HttpClient,
            DefaultDataServiceConfig])
    ], EntityCacheDataService);
    return EntityCacheDataService;
}());
export { EntityCacheDataService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlqRSxPQUFPLEVBQ0wsa0JBQWtCLEVBSWxCLDBCQUEwQixHQUMzQixNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR3ZGLElBQU0sUUFBUSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztBQUUzQzs7O0dBR0c7QUFFSDtJQUtFLGdDQUNZLHVCQUFnRCxFQUNoRCxJQUFnQixFQUNkLE1BQWlDO1FBRm5DLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsU0FBSSxHQUFKLElBQUksQ0FBWTtRQU5sQixnQkFBVyxHQUE4QyxFQUFFLENBQUM7UUFDNUQsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFPZCxJQUFBLGlCQUFpRCxFQUEvQyxpQkFBYSxFQUFiLGtDQUFhLEVBQUUsZUFBZSxFQUFmLDJCQUFnQyxDQUFD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QyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1NBQzNDO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQXhJVSxzQkFBc0I7UUFEbEMsVUFBVSxFQUFFO1FBU1IsV0FBQSxRQUFRLEVBQUUsQ0FBQTt5Q0FGd0IsdUJBQXVCO1lBQzFDLFVBQVU7WUFDTCx3QkFBd0I7T0FScEMsc0JBQXNCLENBMElsQztJQUFELDZCQUFDO0NBQUEsQUExSUQsSUEwSUM7U0ExSVksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBtYXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IElkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldCxcbiAgQ2hhbmdlU2V0SXRlbSxcbiAgQ2hhbmdlU2V0VXBkYXRlLFxuICBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBSZXF1ZXN0RGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IHVwZGF0ZU9wID0gQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTtcblxuLyoqXG4gKiBEZWZhdWx0IGRhdGEgc2VydmljZSBmb3IgbWFraW5nIHJlbW90ZSBzZXJ2aWNlIGNhbGxzIHRhcmdldGluZyB0aGUgZW50aXJlIEVudGl0eUNhY2hlLlxuICogU2VlIEVudGl0eURhdGFTZXJ2aWNlIGZvciBzZXJ2aWNlcyB0aGF0IHRhcmdldCBhIHNpbmdsZSBFbnRpdHlDb2xsZWN0aW9uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIGlkU2VsZWN0b3JzOiB7IFtlbnRpdHlOYW1lOiBzdHJpbmddOiBJZFNlbGVjdG9yPGFueT4gfSA9IHt9O1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbnRpdHlEZWZpbml0aW9uU2VydmljZTogRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbnN0IHsgc2F2ZURlbGF5ID0gMCwgdGltZW91dDogdG8gPSAwIH0gPSBjb25maWcgfHwge307XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBjaGFuZ2VzIHRvIG11bHRpcGxlIGVudGl0aWVzIGFjcm9zcyBvbmUgb3IgbW9yZSBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqIFNlcnZlciBlbmRwb2ludCBtdXN0IHVuZGVyc3RhbmQgdGhlIGVzc2VudGlhbCBTYXZlRW50aXRpZXMgcHJvdG9jb2wsXG4gICAqIGluIHBhcnRpY3VsYXIgdGhlIENoYW5nZVNldCBpbnRlcmZhY2UgKGV4Y2VwdCBmb3IgVXBkYXRlPFQ+KS5cbiAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBleHRyYWN0cyB0aGUgZW50aXR5IGNoYW5nZXMgZnJvbSBhIENoYW5nZVNldCBVcGRhdGU8VD5bXSBhbmQgc2VuZHMgdGhvc2UuXG4gICAqIEl0IHRoZW4gcmVjb25zdHJ1Y3RzIFVwZGF0ZTxUPltdIGluIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHJlc3VsdC5cbiAgICogQHBhcmFtIGNoYW5nZVNldCAgQW4gYXJyYXkgb2YgU2F2ZUVudGl0eUl0ZW1zLlxuICAgKiBFYWNoIFNhdmVFbnRpdHlJdGVtIGRlc2NyaWJlIGEgY2hhbmdlIG9wZXJhdGlvbiBmb3Igb25lIG9yIG1vcmUgZW50aXRpZXMgb2YgYSBzaW5nbGUgY29sbGVjdGlvbixcbiAgICoga25vd24gYnkgaXRzICdlbnRpdHlOYW1lJy5cbiAgICogQHBhcmFtIHVybCBUaGUgc2VydmVyIGVuZHBvaW50IHRoYXQgcmVjZWl2ZXMgdGhpcyByZXF1ZXN0LlxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKGNoYW5nZVNldDogQ2hhbmdlU2V0LCB1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiB7XG4gICAgY2hhbmdlU2V0ID0gdGhpcy5maWx0ZXJDaGFuZ2VTZXQoY2hhbmdlU2V0KTtcbiAgICAvLyBBc3N1bWUgc2VydmVyIGRvZXNuJ3QgdW5kZXJzdGFuZCBAbmdyeC9lbnRpdHkgVXBkYXRlPFQ+IHN0cnVjdHVyZTtcbiAgICAvLyBFeHRyYWN0IHRoZSBlbnRpdHkgY2hhbmdlcyBmcm9tIHRoZSBVcGRhdGU8VD5bXSBhbmQgcmVzdG9yZSBvbiB0aGUgcmV0dXJuIGZyb20gc2VydmVyXG4gICAgY2hhbmdlU2V0ID0gdGhpcy5mbGF0dGVuVXBkYXRlcyhjaGFuZ2VTZXQpO1xuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiA9IHRoaXMuaHR0cFxuICAgICAgLnBvc3Q8Q2hhbmdlU2V0Pih1cmwsIGNoYW5nZVNldClcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAocmVzdWx0ID0+IHRoaXMucmVzdG9yZVVwZGF0ZXMocmVzdWx0KSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcih7IG1ldGhvZDogJ1BPU1QnLCB1cmwsIGRhdGE6IGNoYW5nZVNldCB9KSlcbiAgICAgICk7XG5cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0KSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdCQ7XG4gIH1cblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIHJlcURhdGEpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIGNoYW5nZVNldCB0byByZW1vdmUgdW53YW50ZWQgQ2hhbmdlU2V0SXRlbXMuXG4gICAqIFRoaXMgaW1wbGVtZW50YXRpb24gZXhjbHVkZXMgbnVsbCBhbmQgZW1wdHkgQ2hhbmdlU2V0SXRlbXMuXG4gICAqIEBwYXJhbSBjaGFuZ2VTZXQgQ2hhbmdlU2V0IHdpdGggY2hhbmdlcyB0byBmaWx0ZXJcbiAgICovXG4gIHByb3RlY3RlZCBmaWx0ZXJDaGFuZ2VTZXQoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIHJldHVybiBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhjaGFuZ2VTZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIGVudGl0aWVzIGluIHVwZGF0ZSBjaGFuZ2VzIGZyb20gQG5ncnggVXBkYXRlPFQ+IHN0cnVjdHVyZSB0byBqdXN0IFQuXG4gICAqIFJldmVyc2Ugb2YgcmVzdG9yZVVwZGF0ZXMoKS5cbiAgICovXG4gIHByb3RlY3RlZCBmbGF0dGVuVXBkYXRlcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgbGV0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcztcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBoYXNNdXRhdGVkID0gZmFsc2U7XG4gICAgY2hhbmdlcyA9IGNoYW5nZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0ub3AgPT09IHVwZGF0ZU9wICYmIGl0ZW0uZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBoYXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVudGl0aWVzOiAoaXRlbSBhcyBDaGFuZ2VTZXRVcGRhdGUpLmVudGl0aWVzLm1hcCh1ID0+IHUuY2hhbmdlcyksXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KSBhcyBDaGFuZ2VTZXRJdGVtW107XG4gICAgcmV0dXJuIGhhc011dGF0ZWQgPyB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9IDogY2hhbmdlU2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIGZsYXR0ZW5lZCBUIGVudGl0aWVzIGluIHVwZGF0ZSBjaGFuZ2VzIGJhY2sgdG8gQG5ncnggVXBkYXRlPFQ+IHN0cnVjdHVyZXMuXG4gICAqIFJldmVyc2Ugb2YgZmxhdHRlblVwZGF0ZXMoKS5cbiAgICovXG4gIHByb3RlY3RlZCByZXN0b3JlVXBkYXRlcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgaWYgKGNoYW5nZVNldCA9PSBudWxsKSB7XG4gICAgICAvLyBOb3RoaW5nPyBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkIHdpdGggMjA0IC0gTm8gQ29udGVudCBiZWNhdXNlIGl0IG1hZGUgbm8gY2hhbmdlcyB0byB0aGUgaW5zZXJ0ZWQgb3IgdXBkYXRlZCBlbnRpdGllc1xuICAgICAgcmV0dXJuIGNoYW5nZVNldDtcbiAgICB9XG4gICAgbGV0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcztcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBoYXNNdXRhdGVkID0gZmFsc2U7XG4gICAgY2hhbmdlcyA9IGNoYW5nZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0ub3AgPT09IHVwZGF0ZU9wKSB7XG4gICAgICAgIC8vIFRoZXNlIGFyZSBlbnRpdGllcywgbm90IFVwZGF0ZXM7IGNvbnZlcnQgYmFjayB0byBVcGRhdGVzXG4gICAgICAgIGhhc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBzZWxlY3RJZCA9IHRoaXMuZ2V0SWRTZWxlY3RvcihpdGVtLmVudGl0eU5hbWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgZW50aXRpZXM6IGl0ZW0uZW50aXRpZXMubWFwKCh1OiBhbnkpID0+ICh7XG4gICAgICAgICAgICBpZDogc2VsZWN0SWQodSksXG4gICAgICAgICAgICBjaGFuZ2VzOiB1LFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfSBhcyBDaGFuZ2VTZXRVcGRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KSBhcyBDaGFuZ2VTZXRJdGVtW107XG4gICAgcmV0dXJuIGhhc011dGF0ZWQgPyB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9IDogY2hhbmdlU2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgKHByaW1hcnkga2V5KSBzZWxlY3RvciBmdW5jdGlvbiBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBnZXRJZFNlbGVjdG9yKGVudGl0eU5hbWU6IHN0cmluZykge1xuICAgIGxldCBpZFNlbGVjdG9yID0gdGhpcy5pZFNlbGVjdG9yc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIWlkU2VsZWN0b3IpIHtcbiAgICAgIGlkU2VsZWN0b3IgPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb24oZW50aXR5TmFtZSlcbiAgICAgICAgLnNlbGVjdElkO1xuICAgICAgdGhpcy5pZFNlbGVjdG9yc1tlbnRpdHlOYW1lXSA9IGlkU2VsZWN0b3I7XG4gICAgfVxuICAgIHJldHVybiBpZFNlbGVjdG9yO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19