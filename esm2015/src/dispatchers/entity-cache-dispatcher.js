/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class EntityCacheDispatcher {
    /**
     * @param {?} correlationIdGenerator
     * @param {?} defaultDispatcherOptions
     * @param {?} scannedActions$
     * @param {?} store
     */
    constructor(correlationIdGenerator, defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    scannedActions$, store) {
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
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    /**
     * Dispatch action to cancel the saveEntities request with matching correlation id.
     * @param {?} correlationId The correlation id for the corresponding action
     * @param {?=} reason
     * @param {?=} entityNames
     * @param {?=} tag
     * @return {?}
     */
    cancelSaveEntities(correlationId, reason, entityNames, tag) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        /** @type {?} */
        const action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
        this.dispatch(action);
    }
    /**
     * Clear the named entity collections in cache
     * @param {?=} collections
     * @param {?=} tag
     * @return {?}
     */
    clearCollections(collections, tag) {
        this.dispatch(new ClearCollections(collections, tag));
    }
    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param {?} collections The collections to load, typically the result of a query.
     * @param {?=} tag
     * @return {?}
     */
    loadCollections(collections, tag) {
        this.dispatch(new LoadCollections(collections, tag));
    }
    /**
     * Merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param {?} querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param {?=} mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param {?=} tag
     * @return {?}
     */
    mergeQuerySet(querySet, mergeStrategy, tag) {
        this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
    }
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param {?} cache New state of the entity cache
     * @param {?=} tag
     * @return {?}
     */
    setEntityCache(cache, tag) {
        this.dispatch(new SetEntityCache(cache, tag));
    }
    /**
     * Dispatch action to save multiple entity changes to remote storage.
     * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
     * Important: only call if your server supports the SaveEntities protocol
     * through your EntityDataService.saveEntities method.
     * @param {?} changes Either the entities to save, as an array of {ChangeSetItem}, or
     * a ChangeSet that holds such changes.
     * @param {?} url The server url which receives the save request
     * @param {?=} options
     * @return {?} A terminating Observable<ChangeSet> with data returned from the server
     * after server reports successful save OR the save error.
     * TODO: should return the matching entities from cache rather than the raw server data.
     */
    saveEntities(changes, url, options) {
        /** @type {?} */
        const changeSet = Array.isArray(changes) ? { changes } : changes;
        options = options || {};
        /** @type {?} */
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        /** @type {?} */
        const isOptimistic = options.isOptimistic == null
            ? this.defaultDispatcherOptions.optimisticSaveEntities || false
            : options.isOptimistic === true;
        /** @type {?} */
        const tag = options.tag || 'Save Entities';
        options = Object.assign({}, options, { correlationId, isOptimistic, tag });
        /** @type {?} */
        const action = new SaveEntities(changeSet, url, options);
        this.dispatch(action);
        return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Return Observable of data from the server-success SaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @private
     * @param {?} crid The correlationId for both the save and response actions.
     * @return {?}
     */
    getSaveEntitiesResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((/**
         * @param {?} act
         * @return {?}
         */
        (act) => act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
            act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
            act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL)), filter((/**
         * @param {?} act
         * @return {?}
         */
        (act) => crid === ((/** @type {?} */ (act))).payload.correlationId)), take(1), mergeMap((/**
         * @param {?} act
         * @return {?}
         */
        act => {
            return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                ? throwError(new PersistanceCanceled(((/** @type {?} */ (act))).payload.reason))
                : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                    ? of(((/** @type {?} */ (act))).payload.changeSet)
                    : throwError(((/** @type {?} */ (act))).payload);
        })));
    }
}
EntityCacheDispatcher.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCacheDispatcher.ctorParameters = () => [
    { type: CorrelationIdGenerator },
    { type: EntityDispatcherDefaultOptions },
    { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] }] },
    { type: Store }
];
if (false) {
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @type {?}
     */
    EntityCacheDispatcher.prototype.reducedActions$;
    /**
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.raSubscription;
    /**
     * Generates correlation ids for query and save methods
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.correlationIdGenerator;
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.defaultDispatcherOptions;
    /**
     * The store, scoped to the EntityCache
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1jYWNoZS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBR0wscUJBQXFCLEVBRXJCLEtBQUssR0FDTixNQUFNLGFBQWEsQ0FBQztBQUVyQixPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBZ0IsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxNQUFNLEVBQU8sUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUkzRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUdyRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUkxRCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUVqQixlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxZQUFZLEVBQ1osa0JBQWtCLEdBR25CLE1BQU0sZ0NBQWdDLENBQUM7Ozs7QUFNeEMsTUFBTSxPQUFPLHFCQUFxQjs7Ozs7OztJQVFoQyxZQUVVLHNCQUE4QyxFQUs5Qyx3QkFBd0Q7SUFDaEUsMEVBQTBFO0lBQzNDLGVBQW1DLEVBRTFELEtBQXlCO1FBVHpCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFLOUMsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUFnQztRQUl4RCxVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUVqQyx1RkFBdUY7UUFDdkYsc0RBQXNEO1FBQ3RELHdGQUF3RjtR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QXFCO1lBbkQvQixLQUFLOzs7Ozs7OztJQXVDTCxnREFBb0M7Ozs7O0lBQ3BDLCtDQUFxQzs7Ozs7O0lBSW5DLHVEQUFzRDs7Ozs7OztJQUt0RCx5REFBZ0U7Ozs7OztJQUloRSxzQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgY3JlYXRlU2VsZWN0b3IsXG4gIFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgc2VsZWN0LFxuICBTdG9yZSxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9uLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAsIHNoYXJlUmVwbGF5LCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuXG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYWN0aW9ucy9tZXJnZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBQZXJzaXN0YW5jZUNhbmNlbGVkIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuaW1wb3J0IHsgQ2hhbmdlU2V0LCBDaGFuZ2VTZXRJdGVtIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQge1xuICBDbGVhckNvbGxlY3Rpb25zLFxuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgRW50aXR5Q2FjaGVRdWVyeVNldCxcbiAgTG9hZENvbGxlY3Rpb25zLFxuICBNZXJnZVF1ZXJ5U2V0LFxuICBTZXRFbnRpdHlDYWNoZSxcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgRW50aXR5IENhY2hlIGFjdGlvbnMgdG8gdGhlIEVudGl0eUNhY2hlIHJlZHVjZXJcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRGlzcGF0Y2hlciB7XG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+O1xuICBwcml2YXRlIHJhU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIEdlbmVyYXRlcyBjb3JyZWxhdGlvbiBpZHMgZm9yIHF1ZXJ5IGFuZCBzYXZlIG1ldGhvZHMgKi9cbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IsXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlciBvcHRpb25zIGNvbmZpZ3VyZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXNcbiAgICAgKiB3aGV0aGVyIGFkZCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAvKiogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLiAqL1xuICAgIEBJbmplY3QoU2Nhbm5lZEFjdGlvbnNTdWJqZWN0KSBzY2FubmVkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPixcbiAgICAvKiogVGhlIHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+XG4gICkge1xuICAgIC8vIFJlcGxheSBiZWNhdXNlIHNvbWV0aW1lcyBpbiB0ZXN0cyB3aWxsIGZha2UgZGF0YSBzZXJ2aWNlIHdpdGggc3luY2hyb25vdXMgb2JzZXJ2YWJsZVxuICAgIC8vIHdoaWNoIG1ha2VzIHN1YnNjcmliZXIgbWlzcyB0aGUgZGlzcGF0Y2hlZCBhY3Rpb25zLlxuICAgIC8vIE9mIGNvdXJzZSB0aGF0J3MgYSB0ZXN0aW5nIG1pc3Rha2UuIEJ1dCBlYXN5IHRvIGZvcmdldCwgbGVhZGluZyB0byBwYWluZnVsIGRlYnVnZ2luZy5cbiAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCA9IHNjYW5uZWRBY3Rpb25zJC5waXBlKHNoYXJlUmVwbGF5KDEpKTtcbiAgICAvLyBTdGFydCBsaXN0ZW5pbmcgc28gbGF0ZSBzdWJzY3JpYmVyIHdvbid0IG1pc3MgdGhlIG1vc3QgcmVjZW50IGFjdGlvbi5cbiAgICB0aGlzLnJhU3Vic2NyaXB0aW9uID0gdGhpcy5yZWR1Y2VkQWN0aW9ucyQuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gQWN0aW9uIHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHNhdmVFbnRpdGllcyByZXF1ZXN0IHdpdGggbWF0Y2hpbmcgY29ycmVsYXRpb24gaWQuXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqIEBwYXJhbSBbZW50aXR5TmFtZXNdIGFycmF5IG9mIGVudGl0eSBuYW1lcyBzbyBjYW4gdHVybiBvZmYgbG9hZGluZyBmbGFnIGZvciB0aGVpciBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIFt0YWddIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAgICovXG4gIGNhbmNlbFNhdmVFbnRpdGllcyhcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIGVudGl0eU5hbWVzPzogc3RyaW5nW10sXG4gICAgdGFnPzogc3RyaW5nXG4gICk6IHZvaWQge1xuICAgIGlmICghY29ycmVsYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGNvcnJlbGF0aW9uSWQnKTtcbiAgICB9XG4gICAgY29uc3QgYWN0aW9uID0gbmV3IFNhdmVFbnRpdGllc0NhbmNlbChcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICByZWFzb24sXG4gICAgICBlbnRpdHlOYW1lcyxcbiAgICAgIHRhZ1xuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBuYW1lZCBlbnRpdHkgY29sbGVjdGlvbnMgaW4gY2FjaGVcbiAgICogQHBhcmFtIFtjb2xsZWN0aW9uc10gQXJyYXkgb2YgbmFtZXMgb2YgdGhlIGNvbGxlY3Rpb25zIHRvIGNsZWFyLlxuICAgKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBudWxsL3VuZGVmaW5lZC9ubyBhcnJheSwgY2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKi9cbiAgY2xlYXJDb2xsZWN0aW9ucyhjb2xsZWN0aW9ucz86IHN0cmluZ1tdLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBDbGVhckNvbGxlY3Rpb25zKGNvbGxlY3Rpb25zLCB0YWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIG11bHRpcGxlIGVudGl0eSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb25zIFRoZSBjb2xsZWN0aW9ucyB0byBsb2FkLCB0eXBpY2FsbHkgdGhlIHJlc3VsdCBvZiBhIHF1ZXJ5LlxuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKiBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqL1xuICBsb2FkQ29sbGVjdGlvbnMoY29sbGVjdGlvbnM6IEVudGl0eUNhY2hlUXVlcnlTZXQsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IExvYWRDb2xsZWN0aW9ucyhjb2xsZWN0aW9ucywgdGFnKSk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIGVudGl0aWVzIGZyb20gYSBxdWVyeSByZXN1bHRcbiAgICogdGhhdCByZXR1cm5lZCBlbnRpdGllcyBmcm9tIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBDb3JyZXNwb25kaW5nIGVudGl0eSBjYWNoZSByZWR1Y2VyIHNob3VsZCBhZGQgYW5kIHVwZGF0ZSBhbGwgY29sbGVjdGlvbnNcbiAgICogYXQgdGhlIHNhbWUgdGltZSwgYmVmb3JlIGFueSBzZWxlY3RvcnMkIG9ic2VydmFibGVzIGVtaXQuXG4gICAqIEBwYXJhbSBxdWVyeVNldCBUaGUgcmVzdWx0IG9mIHRoZSBxdWVyeSBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqIFRoZXNlIGFyZSB0aGUgZW50aXR5IGRhdGEgdG8gbWVyZ2UgaW50byB0aGUgcmVzcGVjdGl2ZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIG1lcmdlU3RyYXRlZ3kgSG93IHRvIG1lcmdlIGEgcXVlcmllZCBlbnRpdHkgd2hlbiBpdCBpcyBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlc1xuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKi9cbiAgbWVyZ2VRdWVyeVNldChcbiAgICBxdWVyeVNldDogRW50aXR5Q2FjaGVRdWVyeVNldCxcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneSxcbiAgICB0YWc/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgTWVyZ2VRdWVyeVNldChxdWVyeVNldCwgbWVyZ2VTdHJhdGVneSwgdGFnKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gZm9yIHJlcGxhY2luZyB0aGUgZW50aXJlIGVudGl0eSBjYWNoZS5cbiAgICogRGFuZ2Vyb3VzIGJlY2F1c2UgYnJ1dGUgZm9yY2UgYnV0IHVzZWZ1bCBhcyB3aGVuIHJlLWh5ZHJhdGluZyBhbiBFbnRpdHlDYWNoZVxuICAgKiBmcm9tIGxvY2FsIGJyb3dzZXIgc3RvcmFnZSB3aGVuIHRoZSBhcHBsaWNhdGlvbiBsYXVuY2hlcy5cbiAgICogQHBhcmFtIGNhY2hlIE5ldyBzdGF0ZSBvZiB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBbdGFnXSB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gICAqL1xuICBzZXRFbnRpdHlDYWNoZShjYWNoZTogRW50aXR5Q2FjaGUsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IFNldEVudGl0eUNhY2hlKGNhY2hlLCB0YWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBtdWx0aXBsZSBlbnRpdHkgY2hhbmdlcyB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogUmVsaWVzIG9uIGFuIE5ncnggRWZmZWN0IHN1Y2ggYXMgRW50aXR5RWZmZWN0cy5zYXZlRW50aXRpZXMkLlxuICAgKiBJbXBvcnRhbnQ6IG9ubHkgY2FsbCBpZiB5b3VyIHNlcnZlciBzdXBwb3J0cyB0aGUgU2F2ZUVudGl0aWVzIHByb3RvY29sXG4gICAqIHRocm91Z2ggeW91ciBFbnRpdHlEYXRhU2VydmljZS5zYXZlRW50aXRpZXMgbWV0aG9kLlxuICAgKiBAcGFyYW0gY2hhbmdlcyBFaXRoZXIgdGhlIGVudGl0aWVzIHRvIHNhdmUsIGFzIGFuIGFycmF5IG9mIHtDaGFuZ2VTZXRJdGVtfSwgb3JcbiAgICogYSBDaGFuZ2VTZXQgdGhhdCBob2xkcyBzdWNoIGNoYW5nZXMuXG4gICAqIEBwYXJhbSB1cmwgVGhlIHNlcnZlciB1cmwgd2hpY2ggcmVjZWl2ZXMgdGhlIHNhdmUgcmVxdWVzdFxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyB0YWcsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYywgYW5kIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZXNlIHZhbHVlcyBhcmUgZGVmYXVsdGVkIGlmIG5vdCBzdXBwbGllZC5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlPENoYW5nZVNldD4gd2l0aCBkYXRhIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgT1IgdGhlIHNhdmUgZXJyb3IuXG4gICAqIFRPRE86IHNob3VsZCByZXR1cm4gdGhlIG1hdGNoaW5nIGVudGl0aWVzIGZyb20gY2FjaGUgcmF0aGVyIHRoYW4gdGhlIHJhdyBzZXJ2ZXIgZGF0YS5cbiAgICovXG4gIHNhdmVFbnRpdGllcyhcbiAgICBjaGFuZ2VzOiBDaGFuZ2VTZXRJdGVtW10gfCBDaGFuZ2VTZXQsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+IHtcbiAgICBjb25zdCBjaGFuZ2VTZXQgPSBBcnJheS5pc0FycmF5KGNoYW5nZXMpID8geyBjaGFuZ2VzIH0gOiBjaGFuZ2VzO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9XG4gICAgICBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PSBudWxsXG4gICAgICAgID8gdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1NhdmVFbnRpdGllcyB8fCBmYWxzZVxuICAgICAgICA6IG9wdGlvbnMuaXNPcHRpbWlzdGljID09PSB0cnVlO1xuICAgIGNvbnN0IHRhZyA9IG9wdGlvbnMudGFnIHx8ICdTYXZlIEVudGl0aWVzJztcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMsIHRhZyB9O1xuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBTYXZlRW50aXRpZXMoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRTYXZlRW50aXRpZXNSZXNwb25zZURhdGEkKG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gT2JzZXJ2YWJsZSBvZiBkYXRhIGZyb20gdGhlIHNlcnZlci1zdWNjZXNzIFNhdmVFbnRpdGllcyBhY3Rpb24gd2l0aFxuICAgKiB0aGUgZ2l2ZW4gQ29ycmVsYXRpb24gSWQsIGFmdGVyIHRoYXQgYWN0aW9uIHdhcyBwcm9jZXNzZWQgYnkgdGhlIG5ncnggc3RvcmUuXG4gICAqIG9yIGVsc2UgcHV0IHRoZSBzZXJ2ZXIgZXJyb3Igb24gdGhlIE9ic2VydmFibGUgZXJyb3IgY2hhbm5lbC5cbiAgICogQHBhcmFtIGNyaWQgVGhlIGNvcnJlbGF0aW9uSWQgZm9yIGJvdGggdGhlIHNhdmUgYW5kIHJlc3BvbnNlIGFjdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIGdldFNhdmVFbnRpdGllc1Jlc3BvbnNlRGF0YSQoY3JpZDogYW55KTogT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+IHtcbiAgICAvKipcbiAgICAgKiByZWR1Y2VkQWN0aW9ucyQgbXVzdCBiZSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgICAqIGJlY2F1c2UgdGhlIHJlc3BvbnNlIGFjdGlvbiBtaWdodCBoYXZlIGJlZW4gZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmVcbiAgICAgKiBiZWZvcmUgY2FsbGVyIGhhZCBhIGNoYW5jZSB0byBzdWJzY3JpYmUuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMucmVkdWNlZEFjdGlvbnMkLnBpcGUoXG4gICAgICBmaWx0ZXIoXG4gICAgICAgIChhY3Q6IEFjdGlvbikgPT5cbiAgICAgICAgICBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19TVUNDRVNTIHx8XG4gICAgICAgICAgYWN0LnR5cGUgPT09IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1IgfHxcbiAgICAgICAgICBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUxcbiAgICAgICksXG4gICAgICBmaWx0ZXIoKGFjdDogQWN0aW9uKSA9PiBjcmlkID09PSAoYWN0IGFzIGFueSkucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgIHRha2UoMSksXG4gICAgICBtZXJnZU1hcChhY3QgPT4ge1xuICAgICAgICByZXR1cm4gYWN0LnR5cGUgPT09IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMXG4gICAgICAgICAgPyB0aHJvd0Vycm9yKFxuICAgICAgICAgICAgICBuZXcgUGVyc2lzdGFuY2VDYW5jZWxlZChcbiAgICAgICAgICAgICAgICAoYWN0IGFzIFNhdmVFbnRpdGllc0NhbmNlbCkucGF5bG9hZC5yZWFzb25cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogYWN0LnR5cGUgPT09IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfU1VDQ0VTU1xuICAgICAgICAgICAgPyBvZigoYWN0IGFzIFNhdmVFbnRpdGllc1N1Y2Nlc3MpLnBheWxvYWQuY2hhbmdlU2V0KVxuICAgICAgICAgICAgOiB0aHJvd0Vycm9yKChhY3QgYXMgU2F2ZUVudGl0aWVzRXJyb3IpLnBheWxvYWQpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=