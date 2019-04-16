/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { ChangeSetOperation, excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
/** @type {?} */
const updateOp = ChangeSetOperation.Update;
/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
export class EntityCacheDataService {
    /**
     * @param {?} entityDefinitionService
     * @param {?} http
     * @param {?=} config
     */
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
     * @param {?} changeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param {?} url The server endpoint that receives this request.
     * @return {?}
     */
    saveEntities(changeSet, url) {
        changeSet = this.filterChangeSet(changeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        changeSet = this.flattenUpdates(changeSet);
        /** @type {?} */
        let result$ = this.http
            .post(url, changeSet)
            .pipe(map((/**
         * @param {?} result
         * @return {?}
         */
        result => this.restoreUpdates(result))), catchError(this.handleError({ method: 'POST', url, data: changeSet })));
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }
        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }
        return result$;
    }
    // #region helpers
    /**
     * @protected
     * @param {?} reqData
     * @return {?}
     */
    handleError(reqData) {
        return (/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            /** @type {?} */
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        });
    }
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @protected
     * @param {?} changeSet ChangeSet with changes to filter
     * @return {?}
     */
    filterChangeSet(changeSet) {
        return excludeEmptyChangeSetItems(changeSet);
    }
    /**
     * Convert the entities in update changes from \@ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     * @protected
     * @param {?} changeSet
     * @return {?}
     */
    flattenUpdates(changeSet) {
        /** @type {?} */
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        /** @type {?} */
        let hasMutated = false;
        changes = (/** @type {?} */ (changes.map((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return Object.assign({}, item, { entities: ((/** @type {?} */ (item))).entities.map((/**
                     * @param {?} u
                     * @return {?}
                     */
                    u => u.changes)) });
            }
            else {
                return item;
            }
        }))));
        return hasMutated ? Object.assign({}, changeSet, { changes }) : changeSet;
    }
    /**
     * Convert the flattened T entities in update changes back to \@ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     * @protected
     * @param {?} changeSet
     * @return {?}
     */
    restoreUpdates(changeSet) {
        if (changeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return changeSet;
        }
        /** @type {?} */
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        /** @type {?} */
        let hasMutated = false;
        changes = (/** @type {?} */ (changes.map((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                /** @type {?} */
                const selectId = this.getIdSelector(item.entityName);
                return (/** @type {?} */ (Object.assign({}, item, { entities: item.entities.map((/**
                     * @param {?} u
                     * @return {?}
                     */
                    (u) => ({
                        id: selectId(u),
                        changes: u,
                    }))) })));
            }
            else {
                return item;
            }
        }))));
        return hasMutated ? Object.assign({}, changeSet, { changes }) : changeSet;
    }
    /**
     * Get the id (primary key) selector function for an entity type
     * @protected
     * @param {?} entityName name of the entity type
     * @return {?}
     */
    getIdSelector(entityName) {
        /** @type {?} */
        let idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector = this.entityDefinitionService.getDefinition(entityName)
                .selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    }
}
EntityCacheDataService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCacheDataService.ctorParameters = () => [
    { type: EntityDefinitionService },
    { type: HttpClient },
    { type: DefaultDataServiceConfig, decorators: [{ type: Optional }] }
];
if (false) {
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.idSelectors;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.saveDelay;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.timeout;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.entityDefinitionService;
    /**
     * @type {?}
     * @protected
     */
    EntityCacheDataService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFDTCxVQUFVLEdBR1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlqRSxPQUFPLEVBQ0wsa0JBQWtCLEVBSWxCLDBCQUEwQixHQUMzQixNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOztNQUdqRixRQUFRLEdBQUcsa0JBQWtCLENBQUMsTUFBTTs7Ozs7QUFPMUMsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7O0lBS2pDLFlBQ1ksdUJBQWdELEVBQ2hELElBQWdCLEVBQ2QsTUFBaUM7UUFGbkMsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBTmxCLGdCQUFXLEdBQThDLEVBQUUsQ0FBQztRQUM1RCxjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztjQU9kLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLE1B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QkFtQjVCLFFBQVE7Ozs7Ozs7SUFQWCw2Q0FBc0U7Ozs7O0lBQ3RFLDJDQUF3Qjs7Ozs7SUFDeEIseUNBQXNCOzs7OztJQUdwQix5REFBMEQ7Ozs7O0lBQzFELHNDQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXQsXG4gIENoYW5nZVNldEl0ZW0sXG4gIENoYW5nZVNldFVwZGF0ZSxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVxdWVzdERhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCB1cGRhdGVPcCA9IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU7XG5cbi8qKlxuICogRGVmYXVsdCBkYXRhIHNlcnZpY2UgZm9yIG1ha2luZyByZW1vdGUgc2VydmljZSBjYWxscyB0YXJnZXRpbmcgdGhlIGVudGlyZSBFbnRpdHlDYWNoZS5cbiAqIFNlZSBFbnRpdHlEYXRhU2VydmljZSBmb3Igc2VydmljZXMgdGhhdCB0YXJnZXQgYSBzaW5nbGUgRW50aXR5Q29sbGVjdGlvblxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB7XG4gIHByb3RlY3RlZCBpZFNlbGVjdG9yczogeyBbZW50aXR5TmFtZTogc3RyaW5nXTogSWRTZWxlY3Rvcjxhbnk+IH0gPSB7fTtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U6IEVudGl0eURlZmluaXRpb25TZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIEBPcHRpb25hbCgpIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25zdCB7IHNhdmVEZWxheSA9IDAsIHRpbWVvdXQ6IHRvID0gMCB9ID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuc2F2ZURlbGF5ID0gc2F2ZURlbGF5O1xuICAgIHRoaXMudGltZW91dCA9IHRvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgY2hhbmdlcyB0byBtdWx0aXBsZSBlbnRpdGllcyBhY3Jvc3Mgb25lIG9yIG1vcmUgZW50aXR5IGNvbGxlY3Rpb25zLlxuICAgKiBTZXJ2ZXIgZW5kcG9pbnQgbXVzdCB1bmRlcnN0YW5kIHRoZSBlc3NlbnRpYWwgU2F2ZUVudGl0aWVzIHByb3RvY29sLFxuICAgKiBpbiBwYXJ0aWN1bGFyIHRoZSBDaGFuZ2VTZXQgaW50ZXJmYWNlIChleGNlcHQgZm9yIFVwZGF0ZTxUPikuXG4gICAqIFRoaXMgaW1wbGVtZW50YXRpb24gZXh0cmFjdHMgdGhlIGVudGl0eSBjaGFuZ2VzIGZyb20gYSBDaGFuZ2VTZXQgVXBkYXRlPFQ+W10gYW5kIHNlbmRzIHRob3NlLlxuICAgKiBJdCB0aGVuIHJlY29uc3RydWN0cyBVcGRhdGU8VD5bXSBpbiB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSByZXN1bHQuXG4gICAqIEBwYXJhbSBjaGFuZ2VTZXQgIEFuIGFycmF5IG9mIFNhdmVFbnRpdHlJdGVtcy5cbiAgICogRWFjaCBTYXZlRW50aXR5SXRlbSBkZXNjcmliZSBhIGNoYW5nZSBvcGVyYXRpb24gZm9yIG9uZSBvciBtb3JlIGVudGl0aWVzIG9mIGEgc2luZ2xlIGNvbGxlY3Rpb24sXG4gICAqIGtub3duIGJ5IGl0cyAnZW50aXR5TmFtZScuXG4gICAqIEBwYXJhbSB1cmwgVGhlIHNlcnZlciBlbmRwb2ludCB0aGF0IHJlY2VpdmVzIHRoaXMgcmVxdWVzdC5cbiAgICovXG4gIHNhdmVFbnRpdGllcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCwgdXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPENoYW5nZVNldD4ge1xuICAgIGNoYW5nZVNldCA9IHRoaXMuZmlsdGVyQ2hhbmdlU2V0KGNoYW5nZVNldCk7XG4gICAgLy8gQXNzdW1lIHNlcnZlciBkb2Vzbid0IHVuZGVyc3RhbmQgQG5ncngvZW50aXR5IFVwZGF0ZTxUPiBzdHJ1Y3R1cmU7XG4gICAgLy8gRXh0cmFjdCB0aGUgZW50aXR5IGNoYW5nZXMgZnJvbSB0aGUgVXBkYXRlPFQ+W10gYW5kIHJlc3RvcmUgb24gdGhlIHJldHVybiBmcm9tIHNlcnZlclxuICAgIGNoYW5nZVNldCA9IHRoaXMuZmxhdHRlblVwZGF0ZXMoY2hhbmdlU2V0KTtcblxuICAgIGxldCByZXN1bHQkOiBPYnNlcnZhYmxlPENoYW5nZVNldD4gPSB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PENoYW5nZVNldD4odXJsLCBjaGFuZ2VTZXQpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKHJlc3VsdCA9PiB0aGlzLnJlc3RvcmVVcGRhdGVzKHJlc3VsdCkpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IoeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBkYXRhOiBjaGFuZ2VTZXQgfSkpXG4gICAgICApO1xuXG4gICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZSh0aW1lb3V0KHRoaXMudGltZW91dCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQkO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIHByb3RlY3RlZCBoYW5kbGVFcnJvcihyZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlciBjaGFuZ2VTZXQgdG8gcmVtb3ZlIHVud2FudGVkIENoYW5nZVNldEl0ZW1zLlxuICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGV4Y2x1ZGVzIG51bGwgYW5kIGVtcHR5IENoYW5nZVNldEl0ZW1zLlxuICAgKiBAcGFyYW0gY2hhbmdlU2V0IENoYW5nZVNldCB3aXRoIGNoYW5nZXMgdG8gZmlsdGVyXG4gICAqL1xuICBwcm90ZWN0ZWQgZmlsdGVyQ2hhbmdlU2V0KGNoYW5nZVNldDogQ2hhbmdlU2V0KTogQ2hhbmdlU2V0IHtcbiAgICByZXR1cm4gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoY2hhbmdlU2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBlbnRpdGllcyBpbiB1cGRhdGUgY2hhbmdlcyBmcm9tIEBuZ3J4IFVwZGF0ZTxUPiBzdHJ1Y3R1cmUgdG8ganVzdCBULlxuICAgKiBSZXZlcnNlIG9mIHJlc3RvcmVVcGRhdGVzKCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgZmxhdHRlblVwZGF0ZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIGxldCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXM7XG4gICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgaGFzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGNoYW5nZXMgPSBjaGFuZ2VzLm1hcChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLm9wID09PSB1cGRhdGVPcCAmJiBpdGVtLmVudGl0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaGFzTXV0YXRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBlbnRpdGllczogKGl0ZW0gYXMgQ2hhbmdlU2V0VXBkYXRlKS5lbnRpdGllcy5tYXAodSA9PiB1LmNoYW5nZXMpLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSkgYXMgQ2hhbmdlU2V0SXRlbVtdO1xuICAgIHJldHVybiBoYXNNdXRhdGVkID8geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfSA6IGNoYW5nZVNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBmbGF0dGVuZWQgVCBlbnRpdGllcyBpbiB1cGRhdGUgY2hhbmdlcyBiYWNrIHRvIEBuZ3J4IFVwZGF0ZTxUPiBzdHJ1Y3R1cmVzLlxuICAgKiBSZXZlcnNlIG9mIGZsYXR0ZW5VcGRhdGVzKCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVzdG9yZVVwZGF0ZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIGlmIChjaGFuZ2VTZXQgPT0gbnVsbCkge1xuICAgICAgLy8gTm90aGluZz8gU2VydmVyIHByb2JhYmx5IHJlc3BvbmRlZCB3aXRoIDIwNCAtIE5vIENvbnRlbnQgYmVjYXVzZSBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkIG9yIHVwZGF0ZWQgZW50aXRpZXNcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXM7XG4gICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgaGFzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGNoYW5nZXMgPSBjaGFuZ2VzLm1hcChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLm9wID09PSB1cGRhdGVPcCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgZW50aXRpZXMsIG5vdCBVcGRhdGVzOyBjb252ZXJ0IGJhY2sgdG8gVXBkYXRlc1xuICAgICAgICBoYXNNdXRhdGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc2VsZWN0SWQgPSB0aGlzLmdldElkU2VsZWN0b3IoaXRlbS5lbnRpdHlOYW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVudGl0aWVzOiBpdGVtLmVudGl0aWVzLm1hcCgodTogYW55KSA9PiAoe1xuICAgICAgICAgICAgaWQ6IHNlbGVjdElkKHUpLFxuICAgICAgICAgICAgY2hhbmdlczogdSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH0gYXMgQ2hhbmdlU2V0VXBkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSkgYXMgQ2hhbmdlU2V0SXRlbVtdO1xuICAgIHJldHVybiBoYXNNdXRhdGVkID8geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfSA6IGNoYW5nZVNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGlkIChwcmltYXJ5IGtleSkgc2VsZWN0b3IgZnVuY3Rpb24gZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0SWRTZWxlY3RvcihlbnRpdHlOYW1lOiBzdHJpbmcpIHtcbiAgICBsZXQgaWRTZWxlY3RvciA9IHRoaXMuaWRTZWxlY3RvcnNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFpZFNlbGVjdG9yKSB7XG4gICAgICBpZFNlbGVjdG9yID0gdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uKGVudGl0eU5hbWUpXG4gICAgICAgIC5zZWxlY3RJZDtcbiAgICAgIHRoaXMuaWRTZWxlY3RvcnNbZW50aXR5TmFtZV0gPSBpZFNlbGVjdG9yO1xuICAgIH1cbiAgICByZXR1cm4gaWRTZWxlY3RvcjtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cbiJdfQ==