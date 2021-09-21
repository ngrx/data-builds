import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { ChangeSetOperation, excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
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
/** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
EntityCacheDataService.decorators = [
    { type: Injectable }
];
/**
 * @type {function(): !Array<(null|{
 *   type: ?,
 *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
 * })>}
 * @nocollapse
 */
EntityCacheDataService.ctorParameters = () => [
    { type: EntityDefinitionService },
    { type: HttpClient },
    { type: DefaultDataServiceConfig, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSWpFLE9BQU8sRUFDTCxrQkFBa0IsRUFJbEIsMEJBQTBCLEdBQzNCLE1BQU0sb0NBQW9DLENBQUM7QUFDNUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFHdkYsTUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0FBRTNDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxzQkFBc0I7SUFLakMsWUFDWSx1QkFBZ0QsRUFDaEQsSUFBZ0IsRUFDZCxNQUFpQztRQUZuQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELFNBQUksR0FBSixJQUFJLENBQVk7UUFObEIsZ0JBQVcsR0FBOEMsRUFBRSxDQUFDO1FBQzVELGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBT3BCLE1BQU0sRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILFlBQVksQ0FBQyxTQUFvQixFQUFFLEdBQVc7UUFDNUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMscUVBQXFFO1FBQ3JFLHdGQUF3RjtRQUN4RixTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUzQyxJQUFJLE9BQU8sR0FBMEIsSUFBSSxDQUFDLElBQUk7YUFDM0MsSUFBSSxDQUFZLEdBQUcsRUFBRSxTQUFTLENBQUM7YUFDL0IsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUM1QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQ3ZFLENBQUM7UUFFSixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQy9DO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxrQkFBa0I7SUFDUixXQUFXLENBQUMsT0FBb0I7UUFDeEMsT0FBTyxDQUFDLEdBQVEsRUFBRSxFQUFFO1lBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sZUFBZSxDQUFDLFNBQW9CO1FBQzVDLE9BQU8sMEJBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNPLGNBQWMsQ0FBQyxTQUFvQjtRQUMzQyxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDdkIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM3QixJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEQsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsdUNBQ0ssSUFBSSxLQUNQLFFBQVEsRUFBRyxJQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFDbEU7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQzthQUNiO1FBQ0gsQ0FBQyxDQUFvQixDQUFDO1FBQ3RCLE9BQU8sVUFBVSxDQUFDLENBQUMsaUNBQU0sU0FBUyxLQUFFLE9BQU8sSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDTyxjQUFjLENBQUMsU0FBb0I7UUFDM0MsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3JCLDBIQUEwSDtZQUMxSCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN4QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxRQUFRLEVBQUU7Z0JBQ3hCLDJEQUEyRDtnQkFDM0QsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3JELE9BQU8sZ0NBQ0YsSUFBSSxLQUNQLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ2YsT0FBTyxFQUFFLENBQUM7cUJBQ1gsQ0FBQyxDQUFDLEdBQ2UsQ0FBQzthQUN0QjtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQzthQUNiO1FBQ0gsQ0FBQyxDQUFvQixDQUFDO1FBQ3RCLE9BQU8sVUFBVSxDQUFDLENBQUMsaUNBQU0sU0FBUyxLQUFFLE9BQU8sSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDTyxhQUFhLENBQUMsVUFBa0I7UUFDeEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO2lCQUNoRSxRQUFRLENBQUM7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztTQUMzQztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Ozs7WUF6SUYsVUFBVTs7Ozs7Ozs7OztZQVRGLHVCQUF1QjtZQWhCdkIsVUFBVTtZQWVWLHdCQUF3Qix1QkFtQjVCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIG1hcCwgdGltZW91dCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSWRTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7XG4gIENoYW5nZVNldE9wZXJhdGlvbixcbiAgQ2hhbmdlU2V0LFxuICBDaGFuZ2VTZXRJdGVtLFxuICBDaGFuZ2VTZXRVcGRhdGUsXG4gIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcgfSBmcm9tICcuL2RlZmF1bHQtZGF0YS1zZXJ2aWNlLWNvbmZpZyc7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFJlcXVlc3REYXRhIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgdXBkYXRlT3AgPSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBkYXRlO1xuXG4vKipcbiAqIERlZmF1bHQgZGF0YSBzZXJ2aWNlIGZvciBtYWtpbmcgcmVtb3RlIHNlcnZpY2UgY2FsbHMgdGFyZ2V0aW5nIHRoZSBlbnRpcmUgRW50aXR5Q2FjaGUuXG4gKiBTZWUgRW50aXR5RGF0YVNlcnZpY2UgZm9yIHNlcnZpY2VzIHRoYXQgdGFyZ2V0IGEgc2luZ2xlIEVudGl0eUNvbGxlY3Rpb25cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRGF0YVNlcnZpY2Uge1xuICBwcm90ZWN0ZWQgaWRTZWxlY3RvcnM6IHsgW2VudGl0eU5hbWU6IHN0cmluZ106IElkU2VsZWN0b3I8YW55PiB9ID0ge307XG4gIHByb3RlY3RlZCBzYXZlRGVsYXkgPSAwO1xuICBwcm90ZWN0ZWQgdGltZW91dCA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVudGl0eURlZmluaXRpb25TZXJ2aWNlOiBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBAT3B0aW9uYWwoKSBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgY29uc3QgeyBzYXZlRGVsYXkgPSAwLCB0aW1lb3V0OiB0byA9IDAgfSA9IGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLnNhdmVEZWxheSA9IHNhdmVEZWxheTtcbiAgICB0aGlzLnRpbWVvdXQgPSB0bztcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGNoYW5nZXMgdG8gbXVsdGlwbGUgZW50aXRpZXMgYWNyb3NzIG9uZSBvciBtb3JlIGVudGl0eSBjb2xsZWN0aW9ucy5cbiAgICogU2VydmVyIGVuZHBvaW50IG11c3QgdW5kZXJzdGFuZCB0aGUgZXNzZW50aWFsIFNhdmVFbnRpdGllcyBwcm90b2NvbCxcbiAgICogaW4gcGFydGljdWxhciB0aGUgQ2hhbmdlU2V0IGludGVyZmFjZSAoZXhjZXB0IGZvciBVcGRhdGU8VD4pLlxuICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGV4dHJhY3RzIHRoZSBlbnRpdHkgY2hhbmdlcyBmcm9tIGEgQ2hhbmdlU2V0IFVwZGF0ZTxUPltdIGFuZCBzZW5kcyB0aG9zZS5cbiAgICogSXQgdGhlbiByZWNvbnN0cnVjdHMgVXBkYXRlPFQ+W10gaW4gdGhlIHJldHVybmVkIG9ic2VydmFibGUgcmVzdWx0LlxuICAgKiBAcGFyYW0gY2hhbmdlU2V0ICBBbiBhcnJheSBvZiBTYXZlRW50aXR5SXRlbXMuXG4gICAqIEVhY2ggU2F2ZUVudGl0eUl0ZW0gZGVzY3JpYmUgYSBjaGFuZ2Ugb3BlcmF0aW9uIGZvciBvbmUgb3IgbW9yZSBlbnRpdGllcyBvZiBhIHNpbmdsZSBjb2xsZWN0aW9uLFxuICAgKiBrbm93biBieSBpdHMgJ2VudGl0eU5hbWUnLlxuICAgKiBAcGFyYW0gdXJsIFRoZSBzZXJ2ZXIgZW5kcG9pbnQgdGhhdCByZWNlaXZlcyB0aGlzIHJlcXVlc3QuXG4gICAqL1xuICBzYXZlRW50aXRpZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQsIHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+IHtcbiAgICBjaGFuZ2VTZXQgPSB0aGlzLmZpbHRlckNoYW5nZVNldChjaGFuZ2VTZXQpO1xuICAgIC8vIEFzc3VtZSBzZXJ2ZXIgZG9lc24ndCB1bmRlcnN0YW5kIEBuZ3J4L2VudGl0eSBVcGRhdGU8VD4gc3RydWN0dXJlO1xuICAgIC8vIEV4dHJhY3QgdGhlIGVudGl0eSBjaGFuZ2VzIGZyb20gdGhlIFVwZGF0ZTxUPltdIGFuZCByZXN0b3JlIG9uIHRoZSByZXR1cm4gZnJvbSBzZXJ2ZXJcbiAgICBjaGFuZ2VTZXQgPSB0aGlzLmZsYXR0ZW5VcGRhdGVzKGNoYW5nZVNldCk7XG5cbiAgICBsZXQgcmVzdWx0JDogT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+ID0gdGhpcy5odHRwXG4gICAgICAucG9zdDxDaGFuZ2VTZXQ+KHVybCwgY2hhbmdlU2V0KVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzdWx0KSA9PiB0aGlzLnJlc3RvcmVVcGRhdGVzKHJlc3VsdCkpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IoeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBkYXRhOiBjaGFuZ2VTZXQgfSkpXG4gICAgICApO1xuXG4gICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZSh0aW1lb3V0KHRoaXMudGltZW91dCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQkO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIHByb3RlY3RlZCBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlciBjaGFuZ2VTZXQgdG8gcmVtb3ZlIHVud2FudGVkIENoYW5nZVNldEl0ZW1zLlxuICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGV4Y2x1ZGVzIG51bGwgYW5kIGVtcHR5IENoYW5nZVNldEl0ZW1zLlxuICAgKiBAcGFyYW0gY2hhbmdlU2V0IENoYW5nZVNldCB3aXRoIGNoYW5nZXMgdG8gZmlsdGVyXG4gICAqL1xuICBwcm90ZWN0ZWQgZmlsdGVyQ2hhbmdlU2V0KGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgICByZXR1cm4gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoY2hhbmdlU2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBlbnRpdGllcyBpbiB1cGRhdGUgY2hhbmdlcyBmcm9tIEBuZ3J4IFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgdG8ganVzdCBULlxuICAgKiBSZXZlcnNlIG9mIHJlc3RvcmVVcGRhdGVzKCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgZmxhdHRlblVwZGF0ZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIGxldCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXM7XG4gICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgaGFzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGNoYW5nZXMgPSBjaGFuZ2VzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ub3AgPT09IHVwZGF0ZU9wICYmIGl0ZW0uZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBoYXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVudGl0aWVzOiAoaXRlbSBhcyBDaGFuZ2VTZXRVcGRhdGUpLmVudGl0aWVzLm1hcCgodSkgPT4gdS5jaGFuZ2VzKSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgIH0pIGFzIENoYW5nZVNldEl0ZW1bXTtcbiAgICByZXR1cm4gaGFzTXV0YXRlZCA/IHsgLi4uY2hhbmdlU2V0LCBjaGFuZ2VzIH0gOiBjaGFuZ2VTZXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCB0aGUgZmxhdHRlbmVkIFQgZW50aXRpZXMgaW4gdXBkYXRlIGNoYW5nZXMgYmFjayB0byBAbmdyeCBVcGRhdGU8VD4gc3RydWN0dXJlcy5cbiAgICogUmV2ZXJzZSBvZiBmbGF0dGVuVXBkYXRlcygpLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlc3RvcmVVcGRhdGVzKGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgICBpZiAoY2hhbmdlU2V0ID09IG51bGwpIHtcbiAgICAgIC8vIE5vdGhpbmc/IFNlcnZlciBwcm9iYWJseSByZXNwb25kZWQgd2l0aCAyMDQgLSBObyBDb250ZW50IGJlY2F1c2UgaXQgbWFkZSBubyBjaGFuZ2VzIHRvIHRoZSBpbnNlcnRlZCBvciB1cGRhdGVkIGVudGl0aWVzXG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgY2hhbmdlcyA9IGNoYW5nZVNldC5jaGFuZ2VzO1xuICAgIGlmIChjaGFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNoYW5nZVNldDtcbiAgICB9XG4gICAgbGV0IGhhc011dGF0ZWQgPSBmYWxzZTtcbiAgICBjaGFuZ2VzID0gY2hhbmdlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLm9wID09PSB1cGRhdGVPcCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgZW50aXRpZXMsIG5vdCBVcGRhdGVzOyBjb252ZXJ0IGJhY2sgdG8gVXBkYXRlc1xuICAgICAgICBoYXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc2VsZWN0SWQgPSB0aGlzLmdldElkU2VsZWN0b3IoaXRlbS5lbnRpdHlOYW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVudGl0aWVzOiBpdGVtLmVudGl0aWVzLm1hcCgodTogYW55KSA9PiAoe1xuICAgICAgICAgICAgaWQ6IHNlbGVjdElkKHUpLFxuICAgICAgICAgICAgY2hhbmdlczogdSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0gYXMgQ2hhbmdlU2V0VXBkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSkgYXMgQ2hhbmdlU2V0SXRlbVtdO1xuICAgIHJldHVybiBoYXNNdXRhdGVkID8geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfSA6IGNoYW5nZVNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGlkIChwcmltYXJ5IGtleSkgc2VsZWN0b3IgZnVuY3Rpb24gZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0SWRTZWxlY3RvcihlbnRpdHlOYW1lOiBzdHJpbmcpIHtcbiAgICBsZXQgaWRTZWxlY3RvciA9IHRoaXMuaWRTZWxlY3RvcnNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFpZFNlbGVjdG9yKSB7XG4gICAgICBpZFNlbGVjdG9yID0gdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uKGVudGl0eU5hbWUpXG4gICAgICAgIC5zZWxlY3RJZDtcbiAgICAgIHRoaXMuaWRTZWxlY3RvcnNbZW50aXR5TmFtZV0gPSBpZFNlbGVjdG9yO1xuICAgIH1cbiAgICByZXR1cm4gaWRTZWxlY3RvcjtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cbiJdfQ==