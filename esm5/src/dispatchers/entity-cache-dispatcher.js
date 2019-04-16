import * as tslib_1 from "tslib";
import { Injectable, Inject } from '@angular/core';
import { ScannedActionsSubject, Store, } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { filter, mergeMap, shareReplay, take } from 'rxjs/operators';
import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { PersistanceCanceled } from './entity-dispatcher';
import { ClearCollections, EntityCacheAction, LoadCollections, MergeQuerySet, SetEntityCache, SaveEntities, SaveEntitiesCancel, } from '../actions/entity-cache-action';
/**
 * Dispatches Entity Cache actions to the EntityCache reducer
 */
var EntityCacheDispatcher = /** @class */ (function () {
    function EntityCacheDispatcher(
    /** Generates correlation ids for query and save methods */
    correlationIdGenerator, 
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    scannedActions$, 
    /** The store, scoped to the EntityCache */
    store) {
        this.correlationIdGenerator = correlationIdGenerator;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.store = store;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    EntityCacheDispatcher.prototype.dispatch = function (action) {
        this.store.dispatch(action);
        return action;
    };
    /**
     * Dispatch action to cancel the saveEntities request with matching correlation id.
     * @param correlationId The correlation id for the corresponding action
     * @param [reason] explains why canceled and by whom.
     * @param [entityNames] array of entity names so can turn off loading flag for their collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    EntityCacheDispatcher.prototype.cancelSaveEntities = function (correlationId, reason, entityNames, tag) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        var action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
        this.dispatch(action);
    };
    /** Clear the named entity collections in cache
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If null/undefined/no array, clear all collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    EntityCacheDispatcher.prototype.clearCollections = function (collections, tag) {
        this.dispatch(new ClearCollections(collections, tag));
    };
    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param collections The collections to load, typically the result of a query.
     * @param [tag] tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    EntityCacheDispatcher.prototype.loadCollections = function (collections, tag) {
        this.dispatch(new LoadCollections(collections, tag));
    };
    /**
     * Merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param [tag] tag to identify the operation from the app perspective.
     */
    EntityCacheDispatcher.prototype.mergeQuerySet = function (querySet, mergeStrategy, tag) {
        this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
    };
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] tag to identify the operation from the app perspective.
     */
    EntityCacheDispatcher.prototype.setEntityCache = function (cache, tag) {
        this.dispatch(new SetEntityCache(cache, tag));
    };
    /**
     * Dispatch action to save multiple entity changes to remote storage.
     * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
     * Important: only call if your server supports the SaveEntities protocol
     * through your EntityDataService.saveEntities method.
     * @param changes Either the entities to save, as an array of {ChangeSetItem}, or
     * a ChangeSet that holds such changes.
     * @param url The server url which receives the save request
     * @param [options] options such as tag, correlationId, isOptimistic, and mergeStrategy.
     * These values are defaulted if not supplied.
     * @returns A terminating Observable<ChangeSet> with data returned from the server
     * after server reports successful save OR the save error.
     * TODO: should return the matching entities from cache rather than the raw server data.
     */
    EntityCacheDispatcher.prototype.saveEntities = function (changes, url, options) {
        var changeSet = Array.isArray(changes) ? { changes: changes } : changes;
        options = options || {};
        var correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        var isOptimistic = options.isOptimistic == null
            ? this.defaultDispatcherOptions.optimisticSaveEntities || false
            : options.isOptimistic === true;
        var tag = options.tag || 'Save Entities';
        options = tslib_1.__assign({}, options, { correlationId: correlationId, isOptimistic: isOptimistic, tag: tag });
        var action = new SaveEntities(changeSet, url, options);
        this.dispatch(action);
        return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
    };
    /**
     * Return Observable of data from the server-success SaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    EntityCacheDispatcher.prototype.getSaveEntitiesResponseData$ = function (crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter(function (act) {
            return act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
                act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
                act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL;
        }), filter(function (act) { return crid === act.payload.correlationId; }), take(1), mergeMap(function (act) {
            return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                ? throwError(new PersistanceCanceled(act.payload.reason))
                : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                    ? of(act.payload.changeSet)
                    : throwError(act.payload);
        }));
    };
    EntityCacheDispatcher = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(2, Inject(ScannedActionsSubject)),
        tslib_1.__metadata("design:paramtypes", [CorrelationIdGenerator,
            EntityDispatcherDefaultOptions,
            Observable,
            Store])
    ], EntityCacheDispatcher);
    return EntityCacheDispatcher;
}());
export { EntityCacheDispatcher };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1jYWNoZS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBR0wscUJBQXFCLEVBRXJCLEtBQUssR0FDTixNQUFNLGFBQWEsQ0FBQztBQUVyQixPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBZ0IsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxNQUFNLEVBQU8sUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUkzRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUdyRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUkxRCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUVqQixlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxZQUFZLEVBQ1osa0JBQWtCLEdBR25CLE1BQU0sZ0NBQWdDLENBQUM7QUFFeEM7O0dBRUc7QUFFSDtJQVFFO0lBQ0UsMkRBQTJEO0lBQ25ELHNCQUE4QztJQUN0RDs7O09BR0c7SUFDSyx3QkFBd0Q7SUFDaEUsMEVBQTBFO0lBQzNDLGVBQW1DO0lBQ2xFLDJDQUEyQztJQUNuQyxLQUF5QjtRQVR6QiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBSzlDLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBZ0M7UUFJeEQsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFFakMsdUZBQXVG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QUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBekxVLHFCQUFxQjtRQURqQyxVQUFVLEVBQUU7UUFrQlIsbUJBQUEsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7aURBUEUsc0JBQXNCO1lBS3BCLDhCQUE4QjtZQUVoQixVQUFVO1lBRTNDLEtBQUs7T0FuQlgscUJBQXFCLENBMExqQztJQUFELDRCQUFDO0NBQUEsQUExTEQsSUEwTEM7U0ExTFkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIGNyZWF0ZVNlbGVjdG9yLFxuICBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG4gIHNlbGVjdCxcbiAgU3RvcmUsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIFN1YnNjcmlwdGlvbiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBtYXAsIG1lcmdlTWFwLCBzaGFyZVJlcGxheSwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcblxuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgUGVyc2lzdGFuY2VDYW5jZWxlZCB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbmltcG9ydCB7IENoYW5nZVNldCwgQ2hhbmdlU2V0SXRlbSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHtcbiAgQ2xlYXJDb2xsZWN0aW9ucyxcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIEVudGl0eUNhY2hlUXVlcnlTZXQsXG4gIExvYWRDb2xsZWN0aW9ucyxcbiAgTWVyZ2VRdWVyeVNldCxcbiAgU2V0RW50aXR5Q2FjaGUsXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcblxuLyoqXG4gKiBEaXNwYXRjaGVzIEVudGl0eSBDYWNoZSBhY3Rpb25zIHRvIHRoZSBFbnRpdHlDYWNoZSByZWR1Y2VyXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZURpc3BhdGNoZXIge1xuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPjtcbiAgcHJpdmF0ZSByYVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBHZW5lcmF0ZXMgY29ycmVsYXRpb24gaWRzIGZvciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzICovXG4gICAgcHJpdmF0ZSBjb3JyZWxhdGlvbklkR2VuZXJhdG9yOiBDb3JyZWxhdGlvbklkR2VuZXJhdG9yLFxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoZXIgb3B0aW9ucyBjb25maWd1cmUgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzXG4gICAgICogd2hldGhlciBhZGQgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYyBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIHByaXZhdGUgZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgLyoqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy4gKi9cbiAgICBASW5qZWN0KFNjYW5uZWRBY3Rpb25zU3ViamVjdCkgc2Nhbm5lZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj4sXG4gICAgLyoqIFRoZSBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPlxuICApIHtcbiAgICAvLyBSZXBsYXkgYmVjYXVzZSBzb21ldGltZXMgaW4gdGVzdHMgd2lsbCBmYWtlIGRhdGEgc2VydmljZSB3aXRoIHN5bmNocm9ub3VzIG9ic2VydmFibGVcbiAgICAvLyB3aGljaCBtYWtlcyBzdWJzY3JpYmVyIG1pc3MgdGhlIGRpc3BhdGNoZWQgYWN0aW9ucy5cbiAgICAvLyBPZiBjb3Vyc2UgdGhhdCdzIGEgdGVzdGluZyBtaXN0YWtlLiBCdXQgZWFzeSB0byBmb3JnZXQsIGxlYWRpbmcgdG8gcGFpbmZ1bCBkZWJ1Z2dpbmcuXG4gICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQgPSBzY2FubmVkQWN0aW9ucyQucGlwZShzaGFyZVJlcGxheSgxKSk7XG4gICAgLy8gU3RhcnQgbGlzdGVuaW5nIHNvIGxhdGUgc3Vic2NyaWJlciB3b24ndCBtaXNzIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24uXG4gICAgdGhpcy5yYVN1YnNjcmlwdGlvbiA9IHRoaXMucmVkdWNlZEFjdGlvbnMkLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIEFjdGlvbiB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBhY3Rpb24gdGhlIEFjdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBBY3Rpb25cbiAgICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogQWN0aW9uIHtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gY2FuY2VsIHRoZSBzYXZlRW50aXRpZXMgcmVxdWVzdCB3aXRoIG1hdGNoaW5nIGNvcnJlbGF0aW9uIGlkLlxuICAgKiBAcGFyYW0gY29ycmVsYXRpb25JZCBUaGUgY29ycmVsYXRpb24gaWQgZm9yIHRoZSBjb3JyZXNwb25kaW5nIGFjdGlvblxuICAgKiBAcGFyYW0gW3JlYXNvbl0gZXhwbGFpbnMgd2h5IGNhbmNlbGVkIGFuZCBieSB3aG9tLlxuICAgKiBAcGFyYW0gW2VudGl0eU5hbWVzXSBhcnJheSBvZiBlbnRpdHkgbmFtZXMgc28gY2FuIHR1cm4gb2ZmIGxvYWRpbmcgZmxhZyBmb3IgdGhlaXIgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBbdGFnXSB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gICAqL1xuICBjYW5jZWxTYXZlRW50aXRpZXMoXG4gICAgY29ycmVsYXRpb25JZDogYW55LFxuICAgIHJlYXNvbj86IHN0cmluZyxcbiAgICBlbnRpdHlOYW1lcz86IHN0cmluZ1tdLFxuICAgIHRhZz86IHN0cmluZ1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWNvcnJlbGF0aW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBjb3JyZWxhdGlvbklkJyk7XG4gICAgfVxuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBTYXZlRW50aXRpZXNDYW5jZWwoXG4gICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgcmVhc29uLFxuICAgICAgZW50aXR5TmFtZXMsXG4gICAgICB0YWdcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBDbGVhciB0aGUgbmFtZWQgZW50aXR5IGNvbGxlY3Rpb25zIGluIGNhY2hlXG4gICAqIEBwYXJhbSBbY29sbGVjdGlvbnNdIEFycmF5IG9mIG5hbWVzIG9mIHRoZSBjb2xsZWN0aW9ucyB0byBjbGVhci5cbiAgICogSWYgZW1wdHkgYXJyYXksIGRvZXMgbm90aGluZy4gSWYgbnVsbC91bmRlZmluZWQvbm8gYXJyYXksIGNsZWFyIGFsbCBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIFt0YWddIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAgICovXG4gIGNsZWFyQ29sbGVjdGlvbnMoY29sbGVjdGlvbnM/OiBzdHJpbmdbXSwgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQ2xlYXJDb2xsZWN0aW9ucyhjb2xsZWN0aW9ucywgdGFnKSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBtdWx0aXBsZSBlbnRpdHkgY29sbGVjdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICogYmVmb3JlIGFueSBzZWxlY3RvcnMkIG9ic2VydmFibGVzIGVtaXQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9ucyBUaGUgY29sbGVjdGlvbnMgdG8gbG9hZCwgdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBxdWVyeS5cbiAgICogQHBhcmFtIFt0YWddIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAgICogaW4gdGhlIGZvcm0gb2YgYSBtYXAgb2YgZW50aXR5IGNvbGxlY3Rpb25zLlxuICAgKi9cbiAgbG9hZENvbGxlY3Rpb25zKGNvbGxlY3Rpb25zOiBFbnRpdHlDYWNoZVF1ZXJ5U2V0LCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBMb2FkQ29sbGVjdGlvbnMoY29sbGVjdGlvbnMsIHRhZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlcyBlbnRpdGllcyBmcm9tIGEgcXVlcnkgcmVzdWx0XG4gICAqIHRoYXQgcmV0dXJuZWQgZW50aXRpZXMgZnJvbSBtdWx0aXBsZSBjb2xsZWN0aW9ucy5cbiAgICogQ29ycmVzcG9uZGluZyBlbnRpdHkgY2FjaGUgcmVkdWNlciBzaG91bGQgYWRkIGFuZCB1cGRhdGUgYWxsIGNvbGxlY3Rpb25zXG4gICAqIGF0IHRoZSBzYW1lIHRpbWUsIGJlZm9yZSBhbnkgc2VsZWN0b3JzJCBvYnNlcnZhYmxlcyBlbWl0LlxuICAgKiBAcGFyYW0gcXVlcnlTZXQgVGhlIHJlc3VsdCBvZiB0aGUgcXVlcnkgaW4gdGhlIGZvcm0gb2YgYSBtYXAgb2YgZW50aXR5IGNvbGxlY3Rpb25zLlxuICAgKiBUaGVzZSBhcmUgdGhlIGVudGl0eSBkYXRhIHRvIG1lcmdlIGludG8gdGhlIHJlc3BlY3RpdmUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBtZXJnZVN0cmF0ZWd5IEhvdyB0byBtZXJnZSBhIHF1ZXJpZWQgZW50aXR5IHdoZW4gaXQgaXMgYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXNcbiAgICogQHBhcmFtIFt0YWddIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAgICovXG4gIG1lcmdlUXVlcnlTZXQoXG4gICAgcXVlcnlTZXQ6IEVudGl0eUNhY2hlUXVlcnlTZXQsXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3ksXG4gICAgdGFnPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IE1lcmdlUXVlcnlTZXQocXVlcnlTZXQsIG1lcmdlU3RyYXRlZ3ksIHRhZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBlbnRpdHkgY2FjaGUgYWN0aW9uIGZvciByZXBsYWNpbmcgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUuXG4gICAqIERhbmdlcm91cyBiZWNhdXNlIGJydXRlIGZvcmNlIGJ1dCB1c2VmdWwgYXMgd2hlbiByZS1oeWRyYXRpbmcgYW4gRW50aXR5Q2FjaGVcbiAgICogZnJvbSBsb2NhbCBicm93c2VyIHN0b3JhZ2Ugd2hlbiB0aGUgYXBwbGljYXRpb24gbGF1bmNoZXMuXG4gICAqIEBwYXJhbSBjYWNoZSBOZXcgc3RhdGUgb2YgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKi9cbiAgc2V0RW50aXR5Q2FjaGUoY2FjaGU6IEVudGl0eUNhY2hlLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBTZXRFbnRpdHlDYWNoZShjYWNoZSwgdGFnKSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHNhdmUgbXVsdGlwbGUgZW50aXR5IGNoYW5nZXMgdG8gcmVtb3RlIHN0b3JhZ2UuXG4gICAqIFJlbGllcyBvbiBhbiBOZ3J4IEVmZmVjdCBzdWNoIGFzIEVudGl0eUVmZmVjdHMuc2F2ZUVudGl0aWVzJC5cbiAgICogSW1wb3J0YW50OiBvbmx5IGNhbGwgaWYgeW91ciBzZXJ2ZXIgc3VwcG9ydHMgdGhlIFNhdmVFbnRpdGllcyBwcm90b2NvbFxuICAgKiB0aHJvdWdoIHlvdXIgRW50aXR5RGF0YVNlcnZpY2Uuc2F2ZUVudGl0aWVzIG1ldGhvZC5cbiAgICogQHBhcmFtIGNoYW5nZXMgRWl0aGVyIHRoZSBlbnRpdGllcyB0byBzYXZlLCBhcyBhbiBhcnJheSBvZiB7Q2hhbmdlU2V0SXRlbX0sIG9yXG4gICAqIGEgQ2hhbmdlU2V0IHRoYXQgaG9sZHMgc3VjaCBjaGFuZ2VzLlxuICAgKiBAcGFyYW0gdXJsIFRoZSBzZXJ2ZXIgdXJsIHdoaWNoIHJlY2VpdmVzIHRoZSBzYXZlIHJlcXVlc3RcbiAgICogQHBhcmFtIFtvcHRpb25zXSBvcHRpb25zIHN1Y2ggYXMgdGFnLCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMsIGFuZCBtZXJnZVN0cmF0ZWd5LlxuICAgKiBUaGVzZSB2YWx1ZXMgYXJlIGRlZmF1bHRlZCBpZiBub3Qgc3VwcGxpZWQuXG4gICAqIEByZXR1cm5zIEEgdGVybWluYXRpbmcgT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+IHdpdGggZGF0YSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICogYWZ0ZXIgc2VydmVyIHJlcG9ydHMgc3VjY2Vzc2Z1bCBzYXZlIE9SIHRoZSBzYXZlIGVycm9yLlxuICAgKiBUT0RPOiBzaG91bGQgcmV0dXJuIHRoZSBtYXRjaGluZyBlbnRpdGllcyBmcm9tIGNhY2hlIHJhdGhlciB0aGFuIHRoZSByYXcgc2VydmVyIGRhdGEuXG4gICAqL1xuICBzYXZlRW50aXRpZXMoXG4gICAgY2hhbmdlczogQ2hhbmdlU2V0SXRlbVtdIHwgQ2hhbmdlU2V0LFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiB7XG4gICAgY29uc3QgY2hhbmdlU2V0ID0gQXJyYXkuaXNBcnJheShjaGFuZ2VzKSA/IHsgY2hhbmdlcyB9IDogY2hhbmdlcztcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBjb3JyZWxhdGlvbklkID1cbiAgICAgIG9wdGlvbnMuY29ycmVsYXRpb25JZCA9PSBudWxsXG4gICAgICAgID8gdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yLm5leHQoKVxuICAgICAgICA6IG9wdGlvbnMuY29ycmVsYXRpb25JZDtcbiAgICBjb25zdCBpc09wdGltaXN0aWMgPVxuICAgICAgb3B0aW9ucy5pc09wdGltaXN0aWMgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuZGVmYXVsdERpc3BhdGNoZXJPcHRpb25zLm9wdGltaXN0aWNTYXZlRW50aXRpZXMgfHwgZmFsc2VcbiAgICAgICAgOiBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PT0gdHJ1ZTtcbiAgICBjb25zdCB0YWcgPSBvcHRpb25zLnRhZyB8fCAnU2F2ZSBFbnRpdGllcyc7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljLCB0YWcgfTtcbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgU2F2ZUVudGl0aWVzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2F2ZUVudGl0aWVzUmVzcG9uc2VEYXRhJChvcHRpb25zLmNvcnJlbGF0aW9uSWQpLnBpcGUoXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIE9ic2VydmFibGUgb2YgZGF0YSBmcm9tIHRoZSBzZXJ2ZXItc3VjY2VzcyBTYXZlRW50aXRpZXMgYWN0aW9uIHdpdGhcbiAgICogdGhlIGdpdmVuIENvcnJlbGF0aW9uIElkLCBhZnRlciB0aGF0IGFjdGlvbiB3YXMgcHJvY2Vzc2VkIGJ5IHRoZSBuZ3J4IHN0b3JlLlxuICAgKiBvciBlbHNlIHB1dCB0aGUgc2VydmVyIGVycm9yIG9uIHRoZSBPYnNlcnZhYmxlIGVycm9yIGNoYW5uZWwuXG4gICAqIEBwYXJhbSBjcmlkIFRoZSBjb3JyZWxhdGlvbklkIGZvciBib3RoIHRoZSBzYXZlIGFuZCByZXNwb25zZSBhY3Rpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRTYXZlRW50aXRpZXNSZXNwb25zZURhdGEkKGNyaWQ6IGFueSk6IE9ic2VydmFibGU8Q2hhbmdlU2V0PiB7XG4gICAgLyoqXG4gICAgICogcmVkdWNlZEFjdGlvbnMkIG11c3QgYmUgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICAgKiBiZWNhdXNlIHRoZSByZXNwb25zZSBhY3Rpb24gbWlnaHQgaGF2ZSBiZWVuIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlXG4gICAgICogYmVmb3JlIGNhbGxlciBoYWQgYSBjaGFuY2UgdG8gc3Vic2NyaWJlLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLnJlZHVjZWRBY3Rpb25zJC5waXBlKFxuICAgICAgZmlsdGVyKFxuICAgICAgICAoYWN0OiBBY3Rpb24pID0+XG4gICAgICAgICAgYWN0LnR5cGUgPT09IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTUyB8fFxuICAgICAgICAgIGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0VSUk9SIHx8XG4gICAgICAgICAgYWN0LnR5cGUgPT09IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMXG4gICAgICApLFxuICAgICAgZmlsdGVyKChhY3Q6IEFjdGlvbikgPT4gY3JpZCA9PT0gKGFjdCBhcyBhbnkpLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICB0YWtlKDEpLFxuICAgICAgbWVyZ2VNYXAoYWN0ID0+IHtcbiAgICAgICAgcmV0dXJuIGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTFxuICAgICAgICAgID8gdGhyb3dFcnJvcihcbiAgICAgICAgICAgICAgbmV3IFBlcnNpc3RhbmNlQ2FuY2VsZWQoXG4gICAgICAgICAgICAgICAgKGFjdCBhcyBTYXZlRW50aXRpZXNDYW5jZWwpLnBheWxvYWQucmVhc29uXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1NcbiAgICAgICAgICAgID8gb2YoKGFjdCBhcyBTYXZlRW50aXRpZXNTdWNjZXNzKS5wYXlsb2FkLmNoYW5nZVNldClcbiAgICAgICAgICAgIDogdGhyb3dFcnJvcigoYWN0IGFzIFNhdmVFbnRpdGllc0Vycm9yKS5wYXlsb2FkKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19