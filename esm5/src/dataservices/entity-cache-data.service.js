import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
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
                return tslib_1.__assign({}, item, { entities: item.entities.map(function (u) { return u.changes; }) });
            }
            else {
                return item;
            }
        });
        return hasMutated ? tslib_1.__assign({}, changeSet, { changes: changes }) : changeSet;
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
                return tslib_1.__assign({}, item, { entities: item.entities.map(function (u) { return ({
                        id: selectId_1(u),
                        changes: u,
                    }); }) });
            }
            else {
                return item;
            }
        });
        return hasMutated ? tslib_1.__assign({}, changeSet, { changes: changes }) : changeSet;
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
    EntityCacheDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(2, Optional()),
        tslib_1.__metadata("design:paramtypes", [EntityDefinitionService,
            HttpClient,
            DefaultDataServiceConfig])
    ], EntityCacheDataService);
    return EntityCacheDataService;
}());
export { EntityCacheDataService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFDTCxVQUFVLEdBR1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlqRSxPQUFPLEVBQ0wsa0JBQWtCLEVBSWxCLDBCQUEwQixHQUMzQixNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR3ZGLElBQU0sUUFBUSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztBQUUzQzs7O0dBR0c7QUFFSDtJQUtFLGdDQUNZLHVCQUFnRCxFQUNoRCxJQUFnQixFQUNkLE1BQWlDO1FBRm5DLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsU0FBSSxHQUFKLElBQUksQ0FBWTtRQU5sQixnQkFBVyxHQUE4QyxFQUFFLENBQUM7UUFDNUQsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFPZCxJQUFBLGlCQUFpRCxFQUEvQyxpQkFBYSxFQUFiLGtDQUFhLEVBQUUsZUFBZSxFQUFmLDJCQUFnQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsNkNBQVksR0FBWixVQUFhLFNBQW9CLEVBQUUsR0FBVztRQUE5QyxpQkFzQkM7UUFyQkMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMscUVBQXFFO1FBQ3JFLHdGQUF3RjtRQUN4RixTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUzQyxJQUFJLE9BQU8sR0FBMEIsSUFBSSxDQUFDLElBQUk7YUFDM0MsSUFBSSxDQUFZLEdBQUcsRUFBRSxTQUFTLENBQUM7YUFDL0IsSUFBSSxDQUNILEdBQUcsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQTNCLENBQTJCLENBQUMsRUFDMUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBQSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQ3ZFLENBQUM7UUFFSixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQy9DO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxrQkFBa0I7SUFDUiw0Q0FBVyxHQUFyQixVQUFzQixPQUFvQjtRQUN4QyxPQUFPLFVBQUMsR0FBUTtZQUNkLElBQU0sS0FBSyxHQUFHLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sZ0RBQWUsR0FBekIsVUFBMEIsU0FBb0I7UUFDNUMsT0FBTywwQkFBMEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sK0NBQWMsR0FBeEIsVUFBeUIsU0FBb0I7UUFDM0MsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtZQUN4QixJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEQsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsNEJBQ0ssSUFBSSxJQUNQLFFBQVEsRUFBRyxJQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxJQUNoRTthQUNIO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDO2FBQ2I7UUFDSCxDQUFDLENBQW9CLENBQUM7UUFDdEIsT0FBTyxVQUFVLENBQUMsQ0FBQyxzQkFBTSxTQUFTLElBQUUsT0FBTyxTQUFBLElBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sK0NBQWMsR0FBeEIsVUFBeUIsU0FBb0I7UUFBN0MsaUJBMkJDO1FBMUJDLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNyQiwwSEFBMEg7WUFDMUgsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDdkIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO1lBQ3hCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxRQUFRLEVBQUU7Z0JBQ3hCLDJEQUEyRDtnQkFDM0QsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsSUFBTSxVQUFRLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3JELE9BQU8scUJBQ0YsSUFBSSxJQUNQLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUM7d0JBQ3ZDLEVBQUUsRUFBRSxVQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNmLE9BQU8sRUFBRSxDQUFDO3FCQUNYLENBQUMsRUFIc0MsQ0FHdEMsQ0FBQyxHQUNlLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUM7YUFDYjtRQUNILENBQUMsQ0FBb0IsQ0FBQztRQUN0QixPQUFPLFVBQVUsQ0FBQyxDQUFDLHNCQUFNLFNBQVMsSUFBRSxPQUFPLFNBQUEsSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDTyw4Q0FBYSxHQUF2QixVQUF3QixVQUFrQjtRQUN4QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7aUJBQ2hFLFFBQVEsQ0FBQztZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1NBQzNDO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQXhJVSxzQkFBc0I7UUFEbEMsVUFBVSxFQUFFO1FBU1IsbUJBQUEsUUFBUSxFQUFFLENBQUE7aURBRndCLHVCQUF1QjtZQUMxQyxVQUFVO1lBQ0wsd0JBQXdCO09BUnBDLHNCQUFzQixDQTBJbEM7SUFBRCw2QkFBQztDQUFBLEFBMUlELElBMElDO1NBMUlZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXQsXG4gIENoYW5nZVNldEl0ZW0sXG4gIENoYW5nZVNldFVwZGF0ZSxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVxdWVzdERhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCB1cGRhdGVPcCA9IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU7XG5cbi8qKlxuICogRGVmYXVsdCBkYXRhIHNlcnZpY2UgZm9yIG1ha2luZyByZW1vdGUgc2VydmljZSBjYWxscyB0YXJnZXRpbmcgdGhlIGVudGlyZSBFbnRpdHlDYWNoZS5cbiAqIFNlZSBFbnRpdHlEYXRhU2VydmljZSBmb3Igc2VydmljZXMgdGhhdCB0YXJnZXQgYSBzaW5nbGUgRW50aXR5Q29sbGVjdGlvblxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB7XG4gIHByb3RlY3RlZCBpZFNlbGVjdG9yczogeyBbZW50aXR5TmFtZTogc3RyaW5nXTogSWRTZWxlY3Rvcjxhbnk+IH0gPSB7fTtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U6IEVudGl0eURlZmluaXRpb25TZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIEBPcHRpb25hbCgpIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25zdCB7IHNhdmVEZWxheSA9IDAsIHRpbWVvdXQ6IHRvID0gMCB9ID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuc2F2ZURlbGF5ID0gc2F2ZURlbGF5O1xuICAgIHRoaXMudGltZW91dCA9IHRvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgY2hhbmdlcyB0byBtdWx0aXBsZSBlbnRpdGllcyBhY3Jvc3Mgb25lIG9yIG1vcmUgZW50aXR5IGNvbGxlY3Rpb25zLlxuICAgKiBTZXJ2ZXIgZW5kcG9pbnQgbXVzdCB1bmRlcnN0YW5kIHRoZSBlc3NlbnRpYWwgU2F2ZUVudGl0aWVzIHByb3RvY29sLFxuICAgKiBpbiBwYXJ0aWN1bGFyIHRoZSBDaGFuZ2VTZXQgaW50ZXJmYWNlIChleGNlcHQgZm9yIFVwZGF0ZTxUPikuXG4gICAqIFRoaXMgaW1wbGVtZW50YXRpb24gZXh0cmFjdHMgdGhlIGVudGl0eSBjaGFuZ2VzIGZyb20gYSBDaGFuZ2VTZXQgVXBkYXRlPFQ+W10gYW5kIHNlbmRzIHRob3NlLlxuICAgKiBJdCB0aGVuIHJlY29uc3RydWN0cyBVcGRhdGU8VD5bXSBpbiB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSByZXN1bHQuXG4gICAqIEBwYXJhbSBjaGFuZ2VTZXQgIEFuIGFycmF5IG9mIFNhdmVFbnRpdHlJdGVtcy5cbiAgICogRWFjaCBTYXZlRW50aXR5SXRlbSBkZXNjcmliZSBhIGNoYW5nZSBvcGVyYXRpb24gZm9yIG9uZSBvciBtb3JlIGVudGl0aWVzIG9mIGEgc2luZ2xlIGNvbGxlY3Rpb24sXG4gICAqIGtub3duIGJ5IGl0cyAnZW50aXR5TmFtZScuXG4gICAqIEBwYXJhbSB1cmwgVGhlIHNlcnZlciBlbmRwb2ludCB0aGF0IHJlY2VpdmVzIHRoaXMgcmVxdWVzdC5cbiAgICovXG4gIHNhdmVFbnRpdGllcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCwgdXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPENoYW5nZVNldD4ge1xuICAgIGNoYW5nZVNldCA9IHRoaXMuZmlsdGVyQ2hhbmdlU2V0KGNoYW5nZVNldCk7XG4gICAgLy8gQXNzdW1lIHNlcnZlciBkb2Vzbid0IHVuZGVyc3RhbmQgQG5ncngvZW50aXR5IFVwZGF0ZTxUPiBzdHJ1Y3R1cmU7XG4gICAgLy8gRXh0cmFjdCB0aGUgZW50aXR5IGNoYW5nZXMgZnJvbSB0aGUgVXBkYXRlPFQ+W10gYW5kIHJlc3RvcmUgb24gdGhlIHJldHVybiBmcm9tIHNlcnZlclxuICAgIGNoYW5nZVNldCA9IHRoaXMuZmxhdHRlblVwZGF0ZXMoY2hhbmdlU2V0KTtcblxuICAgIGxldCByZXN1bHQkOiBPYnNlcnZhYmxlPENoYW5nZVNldD4gPSB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PENoYW5nZVNldD4odXJsLCBjaGFuZ2VTZXQpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKHJlc3VsdCA9PiB0aGlzLnJlc3RvcmVVcGRhdGVzKHJlc3VsdCkpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IoeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBkYXRhOiBjaGFuZ2VTZXQgfSkpXG4gICAgICApO1xuXG4gICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZSh0aW1lb3V0KHRoaXMudGltZW91dCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQkO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIHByb3RlY3RlZCBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlciBjaGFuZ2VTZXQgdG8gcmVtb3ZlIHVud2FudGVkIENoYW5nZVNldEl0ZW1zLlxuICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGV4Y2x1ZGVzIG51bGwgYW5kIGVtcHR5IENoYW5nZVNldEl0ZW1zLlxuICAgKiBAcGFyYW0gY2hhbmdlU2V0IENoYW5nZVNldCB3aXRoIGNoYW5nZXMgdG8gZmlsdGVyXG4gICAqL1xuICBwcm90ZWN0ZWQgZmlsdGVyQ2hhbmdlU2V0KGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgICByZXR1cm4gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoY2hhbmdlU2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBlbnRpdGllcyBpbiB1cGRhdGUgY2hhbmdlcyBmcm9tIEBuZ3J4IFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgdG8ganVzdCBULlxuICAgKiBSZXZlcnNlIG9mIHJlc3RvcmVVcGRhdGVzKCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgZmxhdHRlblVwZGF0ZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIGxldCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXM7XG4gICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgaGFzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGNoYW5nZXMgPSBjaGFuZ2VzLm1hcChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLm9wID09PSB1cGRhdGVPcCAmJiBpdGVtLmVudGl0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaGFzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBlbnRpdGllczogKGl0ZW0gYXMgQ2hhbmdlU2V0VXBkYXRlKS5lbnRpdGllcy5tYXAodSA9PiB1LmNoYW5nZXMpLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSkgYXMgQ2hhbmdlU2V0SXRlbVtdO1xuICAgIHJldHVybiBoYXNNdXRhdGVkID8geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfSA6IGNoYW5nZVNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBmbGF0dGVuZWQgVCBlbnRpdGllcyBpbiB1cGRhdGUgY2hhbmdlcyBiYWNrIHRvIEBuZ3J4IFVwZGF0ZTxUPiBzdHJ1Y3R1cmVzLlxuICAgKiBSZXZlcnNlIG9mIGZsYXR0ZW5VcGRhdGVzKCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVzdG9yZVVwZGF0ZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIGlmIChjaGFuZ2VTZXQgPT0gbnVsbCkge1xuICAgICAgLy8gTm90aGluZz8gU2VydmVyIHByb2JhYmx5IHJlc3BvbmRlZCB3aXRoIDIwNCAtIE5vIENvbnRlbnQgYmVjYXVzZSBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkIG9yIHVwZGF0ZWQgZW50aXRpZXNcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXM7XG4gICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgaGFzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGNoYW5nZXMgPSBjaGFuZ2VzLm1hcChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLm9wID09PSB1cGRhdGVPcCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgZW50aXRpZXMsIG5vdCBVcGRhdGVzOyBjb252ZXJ0IGJhY2sgdG8gVXBkYXRlc1xuICAgICAgICBoYXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc2VsZWN0SWQgPSB0aGlzLmdldElkU2VsZWN0b3IoaXRlbS5lbnRpdHlOYW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVudGl0aWVzOiBpdGVtLmVudGl0aWVzLm1hcCgodTogYW55KSA9PiAoe1xuICAgICAgICAgICAgaWQ6IHNlbGVjdElkKHUpLFxuICAgICAgICAgICAgY2hhbmdlczogdSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0gYXMgQ2hhbmdlU2V0VXBkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSkgYXMgQ2hhbmdlU2V0SXRlbVtdO1xuICAgIHJldHVybiBoYXNNdXRhdGVkID8geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfSA6IGNoYW5nZVNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGlkIChwcmltYXJ5IGtleSkgc2VsZWN0b3IgZnVuY3Rpb24gZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0SWRTZWxlY3RvcihlbnRpdHlOYW1lOiBzdHJpbmcpIHtcbiAgICBsZXQgaWRTZWxlY3RvciA9IHRoaXMuaWRTZWxlY3RvcnNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFpZFNlbGVjdG9yKSB7XG4gICAgICBpZFNlbGVjdG9yID0gdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uKGVudGl0eU5hbWUpXG4gICAgICAgIC5zZWxlY3RJZDtcbiAgICAgIHRoaXMuaWRTZWxlY3RvcnNbZW50aXR5TmFtZV0gPSBpZFNlbGVjdG9yO1xuICAgIH1cbiAgICByZXR1cm4gaWRTZWxlY3RvcjtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cbiJdfQ==