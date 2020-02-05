(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dataservices/entity-cache-data.service", ["require", "exports", "tslib", "@angular/core", "@angular/common/http", "rxjs", "rxjs/operators", "@ngrx/data/src/actions/entity-cache-change-set", "@ngrx/data/src/dataservices/data-service-error", "@ngrx/data/src/dataservices/default-data-service-config", "@ngrx/data/src/entity-metadata/entity-definition.service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const http_1 = require("@angular/common/http");
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    const entity_cache_change_set_1 = require("@ngrx/data/src/actions/entity-cache-change-set");
    const data_service_error_1 = require("@ngrx/data/src/dataservices/data-service-error");
    const default_data_service_config_1 = require("@ngrx/data/src/dataservices/default-data-service-config");
    const entity_definition_service_1 = require("@ngrx/data/src/entity-metadata/entity-definition.service");
    const updateOp = entity_cache_change_set_1.ChangeSetOperation.Update;
    /**
     * Default data service for making remote service calls targeting the entire EntityCache.
     * See EntityDataService for services that target a single EntityCollection
     */
    let EntityCacheDataService = class EntityCacheDataService {
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
                .pipe(operators_1.map(result => this.restoreUpdates(result)), operators_1.catchError(this.handleError({ method: 'POST', url, data: changeSet })));
            if (this.timeout) {
                result$ = result$.pipe(operators_1.timeout(this.timeout));
            }
            if (this.saveDelay) {
                result$ = result$.pipe(operators_1.delay(this.saveDelay));
            }
            return result$;
        }
        // #region helpers
        handleError(reqData) {
            return (err) => {
                const error = new data_service_error_1.DataServiceError(err, reqData);
                return rxjs_1.throwError(error);
            };
        }
        /**
         * Filter changeSet to remove unwanted ChangeSetItems.
         * This implementation excludes null and empty ChangeSetItems.
         * @param changeSet ChangeSet with changes to filter
         */
        filterChangeSet(changeSet) {
            return entity_cache_change_set_1.excludeEmptyChangeSetItems(changeSet);
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
            changes = changes.map(item => {
                if (item.op === updateOp && item.entities.length > 0) {
                    hasMutated = true;
                    return Object.assign(Object.assign({}, item), { entities: item.entities.map(u => u.changes) });
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
            changes = changes.map(item => {
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
    };
    EntityCacheDataService = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(2, core_1.Optional()),
        tslib_1.__metadata("design:paramtypes", [entity_definition_service_1.EntityDefinitionService,
            http_1.HttpClient,
            default_data_service_config_1.DefaultDataServiceConfig])
    ], EntityCacheDataService);
    exports.EntityCacheDataService = EntityCacheDataService;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQXFEO0lBQ3JELCtDQUFrRDtJQUVsRCwrQkFBOEM7SUFDOUMsOENBQWlFO0lBSWpFLDRGQU00QztJQUM1Qyx1RkFBd0Q7SUFDeEQseUdBQXlFO0lBQ3pFLHdHQUF1RjtJQUd2RixNQUFNLFFBQVEsR0FBRyw0Q0FBa0IsQ0FBQyxNQUFNLENBQUM7SUFFM0M7OztPQUdHO0lBRUgsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7UUFLakMsWUFDWSx1QkFBZ0QsRUFDaEQsSUFBZ0IsRUFDZCxNQUFpQztZQUZuQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1lBQ2hELFNBQUksR0FBSixJQUFJLENBQVk7WUFObEIsZ0JBQVcsR0FBOEMsRUFBRSxDQUFDO1lBQzVELGNBQVMsR0FBRyxDQUFDLENBQUM7WUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1lBT3BCLE1BQU0sRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBRUQ7Ozs7Ozs7Ozs7V0FVRztRQUNILFlBQVksQ0FBQyxTQUFvQixFQUFFLEdBQVc7WUFDNUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUMscUVBQXFFO1lBQ3JFLHdGQUF3RjtZQUN4RixTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMs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UUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNyRCxPQUFPLGdDQUNGLElBQUksS0FDUCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7NEJBQ3ZDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUNmLE9BQU8sRUFBRSxDQUFDO3lCQUNYLENBQUMsQ0FBQyxHQUNlLENBQUM7aUJBQ3RCO3FCQUFNO29CQUNMLE9BQU8sSUFBSSxDQUFDO2lCQUNiO1lBQ0gsQ0FBQyxDQUFvQixDQUFDO1lBQ3RCLE9BQU8sVUFBVSxDQUFDLENBQUMsaUNBQU0sU0FBUyxLQUFFLE9BQU8sSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVELENBQUM7UUFFRDs7O1dBR0c7UUFDTyxhQUFhLENBQUMsVUFBa0I7WUFDeEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztxQkFDaEUsUUFBUSxDQUFDO2dCQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO2FBQzNDO1lBQ0QsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQztLQUVGLENBQUE7SUExSVksc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7UUFTUixtQkFBQSxlQUFRLEVBQUUsQ0FBQTtpREFGd0IsbURBQXVCO1lBQzFDLGlCQUFVO1lBQ0wsc0RBQXdCO09BUnBDLHNCQUFzQixDQTBJbEM7SUExSVksd0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBtYXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IElkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQge1xuICBDaGFuZ2VTZXRPcGVyYXRpb24sXG4gIENoYW5nZVNldCxcbiAgQ2hhbmdlU2V0SXRlbSxcbiAgQ2hhbmdlU2V0VXBkYXRlLFxuICBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEtc2VydmljZS1jb25maWcnO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBSZXF1ZXN0RGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IHVwZGF0ZU9wID0gQ2hhbmdlU2V0T3BlcmF0aW9uLlVwZGF0ZTtcblxuLyoqXG4gKiBEZWZhdWx0IGRhdGEgc2VydmljZSBmb3IgbWFraW5nIHJlbW90ZSBzZXJ2aWNlIGNhbGxzIHRhcmdldGluZyB0aGUgZW50aXJlIEVudGl0eUNhY2hlLlxuICogU2VlIEVudGl0eURhdGFTZXJ2aWNlIGZvciBzZXJ2aWNlcyB0aGF0IHRhcmdldCBhIHNpbmdsZSBFbnRpdHlDb2xsZWN0aW9uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIGlkU2VsZWN0b3JzOiB7IFtlbnRpdHlOYW1lOiBzdHJpbmddOiBJZFNlbGVjdG9yPGFueT4gfSA9IHt9O1xuICBwcm90ZWN0ZWQgc2F2ZURlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHRpbWVvdXQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbnRpdHlEZWZpbml0aW9uU2VydmljZTogRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbnN0IHsgc2F2ZURlbGF5ID0gMCwgdGltZW91dDogdG8gPSAwIH0gPSBjb25maWcgfHwge307XG4gICAgdGhpcy5zYXZlRGVsYXkgPSBzYXZlRGVsYXk7XG4gICAgdGhpcy50aW1lb3V0ID0gdG87XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBjaGFuZ2VzIHRvIG11bHRpcGxlIGVudGl0aWVzIGFjcm9zcyBvbmUgb3IgbW9yZSBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqIFNlcnZlciBlbmRwb2ludCBtdXN0IHVuZGVyc3RhbmQgdGhlIGVzc2VudGlhbCBTYXZlRW50aXRpZXMgcHJvdG9jb2wsXG4gICAqIGluIHBhcnRpY3VsYXIgdGhlIENoYW5nZVNldCBpbnRlcmZhY2UgKGV4Y2VwdCBmb3IgVXBkYXRlPFQ+KS5cbiAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBleHRyYWN0cyB0aGUgZW50aXR5IGNoYW5nZXMgZnJvbSBhIENoYW5nZVNldCBVcGRhdGU8VD5bXSBhbmQgc2VuZHMgdGhvc2UuXG4gICAqIEl0IHRoZW4gcmVjb25zdHJ1Y3RzIFVwZGF0ZTxUPltdIGluIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHJlc3VsdC5cbiAgICogQHBhcmFtIGNoYW5nZVNldCAgQW4gYXJyYXkgb2YgU2F2ZUVudGl0eUl0ZW1zLlxuICAgKiBFYWNoIFNhdmVFbnRpdHlJdGVtIGRlc2NyaWJlIGEgY2hhbmdlIG9wZXJhdGlvbiBmb3Igb25lIG9yIG1vcmUgZW50aXRpZXMgb2YgYSBzaW5nbGUgY29sbGVjdGlvbixcbiAgICoga25vd24gYnkgaXRzICdlbnRpdHlOYW1lJy5cbiAgICogQHBhcmFtIHVybCBUaGUgc2VydmVyIGVuZHBvaW50IHRoYXQgcmVjZWl2ZXMgdGhpcyByZXF1ZXN0LlxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKGNoYW5nZVNldDogQ2hhbmdlU2V0LCB1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiB7XG4gICAgY2hhbmdlU2V0ID0gdGhpcy5maWx0ZXJDaGFuZ2VTZXQoY2hhbmdlU2V0KTtcbiAgICAvLyBBc3N1bWUgc2VydmVyIGRvZXNuJ3QgdW5kZXJzdGFuZCBAbmdyeC9lbnRpdHkgVXBkYXRlPFQ+IHN0cnVjdHVyZTtcbiAgICAvLyBFeHRyYWN0IHRoZSBlbnRpdHkgY2hhbmdlcyBmcm9tIHRoZSBVcGRhdGU8VD5bXSBhbmQgcmVzdG9yZSBvbiB0aGUgcmV0dXJuIGZyb20gc2VydmVyXG4gICAgY2hhbmdlU2V0ID0gdGhpcy5mbGF0dGVuVXBkYXRlcyhjaGFuZ2VTZXQpO1xuXG4gICAgbGV0IHJlc3VsdCQ6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiA9IHRoaXMuaHR0cFxuICAgICAgLnBvc3Q8Q2hhbmdlU2V0Pih1cmwsIGNoYW5nZVNldClcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAocmVzdWx0ID0+IHRoaXMucmVzdG9yZVVwZGF0ZXMocmVzdWx0KSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcih7IG1ldGhvZDogJ1BPU1QnLCB1cmwsIGRhdGE6IGNoYW5nZVNldCB9KSlcbiAgICAgICk7XG5cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0KSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdCQ7XG4gIH1cblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIHJlcURhdGEpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIGNoYW5nZVNldCB0byByZW1vdmUgdW53YW50ZWQgQ2hhbmdlU2V0SXRlbXMuXG4gICAqIFRoaXMgaW1wbGVtZW50YXRpb24gZXhjbHVkZXMgbnVsbCBhbmQgZW1wdHkgQ2hhbmdlU2V0SXRlbXMuXG4gICAqIEBwYXJhbSBjaGFuZ2VTZXQgQ2hhbmdlU2V0IHdpdGggY2hhbmdlcyB0byBmaWx0ZXJcbiAgICovXG4gIHByb3RlY3RlZCBmaWx0ZXJDaGFuZ2VTZXQoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIHJldHVybiBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhjaGFuZ2VTZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIGVudGl0aWVzIGluIHVwZGF0ZSBjaGFuZ2VzIGZyb20gQG5ncnggVXBkYXRlPFQ+IHN0cnVjdHVyZSB0byBqdXN0IFQuXG4gICAqIFJldmVyc2Ugb2YgcmVzdG9yZVVwZGF0ZXMoKS5cbiAgICovXG4gIHByb3RlY3RlZCBmbGF0dGVuVXBkYXRlcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgbGV0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcztcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBoYXNNdXRhdGVkID0gZmFsc2U7XG4gICAgY2hhbmdlcyA9IGNoYW5nZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0ub3AgPT09IHVwZGF0ZU9wICYmIGl0ZW0uZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBoYXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVudGl0aWVzOiAoaXRlbSBhcyBDaGFuZ2VTZXRVcGRhdGUpLmVudGl0aWVzLm1hcCh1ID0+IHUuY2hhbmdlcyksXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KSBhcyBDaGFuZ2VTZXRJdGVtW107XG4gICAgcmV0dXJuIGhhc011dGF0ZWQgPyB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9IDogY2hhbmdlU2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIGZsYXR0ZW5lZCBUIGVudGl0aWVzIGluIHVwZGF0ZSBjaGFuZ2VzIGJhY2sgdG8gQG5ncnggVXBkYXRlPFQ+IHN0cnVjdHVyZXMuXG4gICAqIFJldmVyc2Ugb2YgZmxhdHRlblVwZGF0ZXMoKS5cbiAgICovXG4gIHByb3RlY3RlZCByZXN0b3JlVXBkYXRlcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgaWYgKGNoYW5nZVNldCA9PSBudWxsKSB7XG4gICAgICAvLyBOb3RoaW5nPyBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkIHdpdGggMjA0IC0gTm8gQ29udGVudCBiZWNhdXNlIGl0IG1hZGUgbm8gY2hhbmdlcyB0byB0aGUgaW5zZXJ0ZWQgb3IgdXBkYXRlZCBlbnRpdGllc1xuICAgICAgcmV0dXJuIGNoYW5nZVNldDtcbiAgICB9XG4gICAgbGV0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcztcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBoYXNNdXRhdGVkID0gZmFsc2U7XG4gICAgY2hhbmdlcyA9IGNoYW5nZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0ub3AgPT09IHVwZGF0ZU9wKSB7XG4gICAgICAgIC8vIFRoZXNlIGFyZSBlbnRpdGllcywgbm90IFVwZGF0ZXM7IGNvbnZlcnQgYmFjayB0byBVcGRhdGVzXG4gICAgICAgIGhhc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBzZWxlY3RJZCA9IHRoaXMuZ2V0SWRTZWxlY3RvcihpdGVtLmVudGl0eU5hbWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgZW50aXRpZXM6IGl0ZW0uZW50aXRpZXMubWFwKCh1OiBhbnkpID0+ICh7XG4gICAgICAgICAgICBpZDogc2VsZWN0SWQodSksXG4gICAgICAgICAgICBjaGFuZ2VzOiB1LFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfSBhcyBDaGFuZ2VTZXRVcGRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KSBhcyBDaGFuZ2VTZXRJdGVtW107XG4gICAgcmV0dXJuIGhhc011dGF0ZWQgPyB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9IDogY2hhbmdlU2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgKHByaW1hcnkga2V5KSBzZWxlY3RvciBmdW5jdGlvbiBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBnZXRJZFNlbGVjdG9yKGVudGl0eU5hbWU6IHN0cmluZykge1xuICAgIGxldCBpZFNlbGVjdG9yID0gdGhpcy5pZFNlbGVjdG9yc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIWlkU2VsZWN0b3IpIHtcbiAgICAgIGlkU2VsZWN0b3IgPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb24oZW50aXR5TmFtZSlcbiAgICAgICAgLnNlbGVjdElkO1xuICAgICAgdGhpcy5pZFNlbGVjdG9yc1tlbnRpdHlOYW1lXSA9IGlkU2VsZWN0b3I7XG4gICAgfVxuICAgIHJldHVybiBpZFNlbGVjdG9yO1xuICB9XG4gIC8vICNlbmRyZWdpb24gaGVscGVyc1xufVxuIl19