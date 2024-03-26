import { Injectable, Inject } from '@angular/core';
import { ScannedActionsSubject } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { filter, mergeMap, shareReplay, take } from 'rxjs/operators';
import { PersistanceCanceled } from './entity-dispatcher';
import { ClearCollections, EntityCacheAction, LoadCollections, MergeQuerySet, SetEntityCache, SaveEntities, SaveEntitiesCancel, } from '../actions/entity-cache-action';
import * as i0 from "@angular/core";
import * as i1 from "../utils/correlation-id-generator";
import * as i2 from "./entity-dispatcher-default-options";
import * as i3 from "@ngrx/store";
import * as i4 from "rxjs";
/**
 * Dispatches Entity Cache actions to the EntityCache reducer
 */
export class EntityCacheDispatcher {
    constructor(
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
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    /**
     * Dispatch action to cancel the saveEntities request with matching correlation id.
     * @param correlationId The correlation id for the corresponding action
     * @param [reason] explains why canceled and by whom.
     * @param [entityNames] array of entity names so can turn off loading flag for their collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    cancelSaveEntities(correlationId, reason, entityNames, tag) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        const action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
        this.dispatch(action);
    }
    /** Clear the named entity collections in cache
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If null/undefined/no array, clear all collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    clearCollections(collections, tag) {
        this.dispatch(new ClearCollections(collections, tag));
    }
    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param collections The collections to load, typically the result of a query.
     * @param [tag] tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    loadCollections(collections, tag) {
        this.dispatch(new LoadCollections(collections, tag));
    }
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
    mergeQuerySet(querySet, mergeStrategy, tag) {
        this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
    }
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] tag to identify the operation from the app perspective.
     */
    setEntityCache(cache, tag) {
        this.dispatch(new SetEntityCache(cache, tag));
    }
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
    saveEntities(changes, url, options) {
        const changeSet = Array.isArray(changes) ? { changes } : changes;
        options = options || {};
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        const isOptimistic = options.isOptimistic == null
            ? this.defaultDispatcherOptions.optimisticSaveEntities || false
            : options.isOptimistic === true;
        const tag = options.tag || 'Save Entities';
        options = { ...options, correlationId, isOptimistic, tag };
        const action = new SaveEntities(changeSet, url, options);
        this.dispatch(action);
        return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Return Observable of data from the server-success SaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    getSaveEntitiesResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((act) => act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
            act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
            act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((act) => crid === act.payload.correlationId), take(1), mergeMap((act) => {
            return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                ? throwError(new PersistanceCanceled(act.payload.reason))
                : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                    ? of(act.payload.changeSet)
                    : throwError(act.payload);
        }));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: EntityCacheDispatcher, deps: [{ token: i1.CorrelationIdGenerator }, { token: i2.EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: EntityCacheDispatcher }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: EntityCacheDispatcher, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CorrelationIdGenerator }, { type: i2.EntityDispatcherDefaultOptions }, { type: i4.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: i3.Store }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1jYWNoZS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBVSxxQkFBcUIsRUFBUyxNQUFNLGFBQWEsQ0FBQztBQUVuRSxPQUFPLEVBQWMsRUFBRSxFQUFnQixVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBUXJFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzFELE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBRWpCLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLFlBQVksRUFDWixrQkFBa0IsR0FHbkIsTUFBTSxnQ0FBZ0MsQ0FBQzs7Ozs7O0FBRXhDOztHQUVHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQVFoQztJQUNFLDJEQUEyRDtJQUNuRCxzQkFBOEM7SUFDdEQ7OztPQUdHO0lBQ0ssd0JBQXdEO0lBQ2hFLDBFQUEwRTtJQUMzQyxlQUFtQztJQUNsRSwyQ0FBMkM7SUFDbkMsS0FBeUI7UUFUekIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUs5Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWdDO1FBSXhELFVBQUssR0FBTCxLQUFLLENBQW9CO1FBRWpDLHVGQUF1RjtRQUN2RixzREFBc0Q7UUFDdEQsd0ZBQXdGO1FBQ3hGLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIFN1YnNjcmlwdGlvbiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBtZXJnZU1hcCwgc2hhcmVSZXBsYXksIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5cbmltcG9ydCB7IE1lcmdlU3RyYXRlZ3kgfSBmcm9tICcuLi9hY3Rpb25zL21lcmdlLXN0cmF0ZWd5JztcbmltcG9ydCB7IFBlcnNpc3RhbmNlQ2FuY2VsZWQgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyJztcblxuaW1wb3J0IHsgQ2hhbmdlU2V0LCBDaGFuZ2VTZXRJdGVtIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQge1xuICBDbGVhckNvbGxlY3Rpb25zLFxuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgRW50aXR5Q2FjaGVRdWVyeVNldCxcbiAgTG9hZENvbGxlY3Rpb25zLFxuICBNZXJnZVF1ZXJ5U2V0LFxuICBTZXRFbnRpdHlDYWNoZSxcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgRW50aXR5IENhY2hlIGFjdGlvbnMgdG8gdGhlIEVudGl0eUNhY2hlIHJlZHVjZXJcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRGlzcGF0Y2hlciB7XG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+O1xuICBwcml2YXRlIHJhU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIEdlbmVyYXRlcyBjb3JyZWxhdGlvbiBpZHMgZm9yIHF1ZXJ5IGFuZCBzYXZlIG1ldGhvZHMgKi9cbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IsXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlciBvcHRpb25zIGNvbmZpZ3VyZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXNcbiAgICAgKiB3aGV0aGVyIGFkZCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAvKiogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLiAqL1xuICAgIEBJbmplY3QoU2Nhbm5lZEFjdGlvbnNTdWJqZWN0KSBzY2FubmVkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPixcbiAgICAvKiogVGhlIHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+XG4gICkge1xuICAgIC8vIFJlcGxheSBiZWNhdXNlIHNvbWV0aW1lcyBpbiB0ZXN0cyB3aWxsIGZha2UgZGF0YSBzZXJ2aWNlIHdpdGggc3luY2hyb25vdXMgb2JzZXJ2YWJsZVxuICAgIC8vIHdoaWNoIG1ha2VzIHN1YnNjcmliZXIgbWlzcyB0aGUgZGlzcGF0Y2hlZCBhY3Rpb25zLlxuICAgIC8vIE9mIGNvdXJzZSB0aGF0J3MgYSB0ZXN0aW5nIG1pc3Rha2UuIEJ1dCBlYXN5IHRvIGZvcmdldCwgbGVhZGluZyB0byBwYWluZnVsIGRlYnVnZ2luZy5cbiAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCA9IHNjYW5uZWRBY3Rpb25zJC5waXBlKHNoYXJlUmVwbGF5KDEpKTtcbiAgICAvLyBTdGFydCBsaXN0ZW5pbmcgc28gbGF0ZSBzdWJzY3JpYmVyIHdvbid0IG1pc3MgdGhlIG1vc3QgcmVjZW50IGFjdGlvbi5cbiAgICB0aGlzLnJhU3Vic2NyaXB0aW9uID0gdGhpcy5yZWR1Y2VkQWN0aW9ucyQuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gQWN0aW9uIHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBjYW5jZWwgdGhlIHNhdmVFbnRpdGllcyByZXF1ZXN0IHdpdGggbWF0Y2hpbmcgY29ycmVsYXRpb24gaWQuXG4gICAqIEBwYXJhbSBjb3JyZWxhdGlvbklkIFRoZSBjb3JyZWxhdGlvbiBpZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYWN0aW9uXG4gICAqIEBwYXJhbSBbcmVhc29uXSBleHBsYWlucyB3aHkgY2FuY2VsZWQgYW5kIGJ5IHdob20uXG4gICAqIEBwYXJhbSBbZW50aXR5TmFtZXNdIGFycmF5IG9mIGVudGl0eSBuYW1lcyBzbyBjYW4gdHVybiBvZmYgbG9hZGluZyBmbGFnIGZvciB0aGVpciBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIFt0YWddIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAgICovXG4gIGNhbmNlbFNhdmVFbnRpdGllcyhcbiAgICBjb3JyZWxhdGlvbklkOiBhbnksXG4gICAgcmVhc29uPzogc3RyaW5nLFxuICAgIGVudGl0eU5hbWVzPzogc3RyaW5nW10sXG4gICAgdGFnPzogc3RyaW5nXG4gICk6IHZvaWQge1xuICAgIGlmICghY29ycmVsYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGNvcnJlbGF0aW9uSWQnKTtcbiAgICB9XG4gICAgY29uc3QgYWN0aW9uID0gbmV3IFNhdmVFbnRpdGllc0NhbmNlbChcbiAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICByZWFzb24sXG4gICAgICBlbnRpdHlOYW1lcyxcbiAgICAgIHRhZ1xuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICB9XG5cbiAgLyoqIENsZWFyIHRoZSBuYW1lZCBlbnRpdHkgY29sbGVjdGlvbnMgaW4gY2FjaGVcbiAgICogQHBhcmFtIFtjb2xsZWN0aW9uc10gQXJyYXkgb2YgbmFtZXMgb2YgdGhlIGNvbGxlY3Rpb25zIHRvIGNsZWFyLlxuICAgKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBudWxsL3VuZGVmaW5lZC9ubyBhcnJheSwgY2xlYXIgYWxsIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKi9cbiAgY2xlYXJDb2xsZWN0aW9ucyhjb2xsZWN0aW9ucz86IHN0cmluZ1tdLCB0YWc/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBDbGVhckNvbGxlY3Rpb25zKGNvbGxlY3Rpb25zLCB0YWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIG11bHRpcGxlIGVudGl0eSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb25zIFRoZSBjb2xsZWN0aW9ucyB0byBsb2FkLCB0eXBpY2FsbHkgdGhlIHJlc3VsdCBvZiBhIHF1ZXJ5LlxuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKiBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqL1xuICBsb2FkQ29sbGVjdGlvbnMoY29sbGVjdGlvbnM6IEVudGl0eUNhY2hlUXVlcnlTZXQsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IExvYWRDb2xsZWN0aW9ucyhjb2xsZWN0aW9ucywgdGFnKSk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIGVudGl0aWVzIGZyb20gYSBxdWVyeSByZXN1bHRcbiAgICogdGhhdCByZXR1cm5lZCBlbnRpdGllcyBmcm9tIG11bHRpcGxlIGNvbGxlY3Rpb25zLlxuICAgKiBDb3JyZXNwb25kaW5nIGVudGl0eSBjYWNoZSByZWR1Y2VyIHNob3VsZCBhZGQgYW5kIHVwZGF0ZSBhbGwgY29sbGVjdGlvbnNcbiAgICogYXQgdGhlIHNhbWUgdGltZSwgYmVmb3JlIGFueSBzZWxlY3RvcnMkIG9ic2VydmFibGVzIGVtaXQuXG4gICAqIEBwYXJhbSBxdWVyeVNldCBUaGUgcmVzdWx0IG9mIHRoZSBxdWVyeSBpbiB0aGUgZm9ybSBvZiBhIG1hcCBvZiBlbnRpdHkgY29sbGVjdGlvbnMuXG4gICAqIFRoZXNlIGFyZSB0aGUgZW50aXR5IGRhdGEgdG8gbWVyZ2UgaW50byB0aGUgcmVzcGVjdGl2ZSBjb2xsZWN0aW9ucy5cbiAgICogQHBhcmFtIG1lcmdlU3RyYXRlZ3kgSG93IHRvIG1lcmdlIGEgcXVlcmllZCBlbnRpdHkgd2hlbiBpdCBpcyBhbHJlYWR5IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBUaGUgZGVmYXVsdCBpcyBNZXJnZVN0cmF0ZWd5LlByZXNlcnZlQ2hhbmdlc1xuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKi9cbiAgbWVyZ2VRdWVyeVNldChcbiAgICBxdWVyeVNldDogRW50aXR5Q2FjaGVRdWVyeVNldCxcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneSxcbiAgICB0YWc/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgTWVyZ2VRdWVyeVNldChxdWVyeVNldCwgbWVyZ2VTdHJhdGVneSwgdGFnKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGVudGl0eSBjYWNoZSBhY3Rpb24gZm9yIHJlcGxhY2luZyB0aGUgZW50aXJlIGVudGl0eSBjYWNoZS5cbiAgICogRGFuZ2Vyb3VzIGJlY2F1c2UgYnJ1dGUgZm9yY2UgYnV0IHVzZWZ1bCBhcyB3aGVuIHJlLWh5ZHJhdGluZyBhbiBFbnRpdHlDYWNoZVxuICAgKiBmcm9tIGxvY2FsIGJyb3dzZXIgc3RvcmFnZSB3aGVuIHRoZSBhcHBsaWNhdGlvbiBsYXVuY2hlcy5cbiAgICogQHBhcmFtIGNhY2hlIE5ldyBzdGF0ZSBvZiB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBbdGFnXSB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gICAqL1xuICBzZXRFbnRpdHlDYWNoZShjYWNoZTogRW50aXR5Q2FjaGUsIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IFNldEVudGl0eUNhY2hlKGNhY2hlLCB0YWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gc2F2ZSBtdWx0aXBsZSBlbnRpdHkgY2hhbmdlcyB0byByZW1vdGUgc3RvcmFnZS5cbiAgICogUmVsaWVzIG9uIGFuIE5ncnggRWZmZWN0IHN1Y2ggYXMgRW50aXR5RWZmZWN0cy5zYXZlRW50aXRpZXMkLlxuICAgKiBJbXBvcnRhbnQ6IG9ubHkgY2FsbCBpZiB5b3VyIHNlcnZlciBzdXBwb3J0cyB0aGUgU2F2ZUVudGl0aWVzIHByb3RvY29sXG4gICAqIHRocm91Z2ggeW91ciBFbnRpdHlEYXRhU2VydmljZS5zYXZlRW50aXRpZXMgbWV0aG9kLlxuICAgKiBAcGFyYW0gY2hhbmdlcyBFaXRoZXIgdGhlIGVudGl0aWVzIHRvIHNhdmUsIGFzIGFuIGFycmF5IG9mIHtDaGFuZ2VTZXRJdGVtfSwgb3JcbiAgICogYSBDaGFuZ2VTZXQgdGhhdCBob2xkcyBzdWNoIGNoYW5nZXMuXG4gICAqIEBwYXJhbSB1cmwgVGhlIHNlcnZlciB1cmwgd2hpY2ggcmVjZWl2ZXMgdGhlIHNhdmUgcmVxdWVzdFxuICAgKiBAcGFyYW0gW29wdGlvbnNdIG9wdGlvbnMgc3VjaCBhcyB0YWcsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYywgYW5kIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZXNlIHZhbHVlcyBhcmUgZGVmYXVsdGVkIGlmIG5vdCBzdXBwbGllZC5cbiAgICogQHJldHVybnMgQSB0ZXJtaW5hdGluZyBPYnNlcnZhYmxlPENoYW5nZVNldD4gd2l0aCBkYXRhIHJldHVybmVkIGZyb20gdGhlIHNlcnZlclxuICAgKiBhZnRlciBzZXJ2ZXIgcmVwb3J0cyBzdWNjZXNzZnVsIHNhdmUgT1IgdGhlIHNhdmUgZXJyb3IuXG4gICAqIFRPRE86IHNob3VsZCByZXR1cm4gdGhlIG1hdGNoaW5nIGVudGl0aWVzIGZyb20gY2FjaGUgcmF0aGVyIHRoYW4gdGhlIHJhdyBzZXJ2ZXIgZGF0YS5cbiAgICovXG4gIHNhdmVFbnRpdGllcyhcbiAgICBjaGFuZ2VzOiBDaGFuZ2VTZXRJdGVtW10gfCBDaGFuZ2VTZXQsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+IHtcbiAgICBjb25zdCBjaGFuZ2VTZXQgPSBBcnJheS5pc0FycmF5KGNoYW5nZXMpID8geyBjaGFuZ2VzIH0gOiBjaGFuZ2VzO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPVxuICAgICAgb3B0aW9ucy5jb3JyZWxhdGlvbklkID09IG51bGxcbiAgICAgICAgPyB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3IubmV4dCgpXG4gICAgICAgIDogb3B0aW9ucy5jb3JyZWxhdGlvbklkO1xuICAgIGNvbnN0IGlzT3B0aW1pc3RpYyA9XG4gICAgICBvcHRpb25zLmlzT3B0aW1pc3RpYyA9PSBudWxsXG4gICAgICAgID8gdGhpcy5kZWZhdWx0RGlzcGF0Y2hlck9wdGlvbnMub3B0aW1pc3RpY1NhdmVFbnRpdGllcyB8fCBmYWxzZVxuICAgICAgICA6IG9wdGlvbnMuaXNPcHRpbWlzdGljID09PSB0cnVlO1xuICAgIGNvbnN0IHRhZyA9IG9wdGlvbnMudGFnIHx8ICdTYXZlIEVudGl0aWVzJztcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMsIHRhZyB9O1xuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBTYXZlRW50aXRpZXMoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5nZXRTYXZlRW50aXRpZXNSZXNwb25zZURhdGEkKG9wdGlvbnMuY29ycmVsYXRpb25JZCkucGlwZShcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gT2JzZXJ2YWJsZSBvZiBkYXRhIGZyb20gdGhlIHNlcnZlci1zdWNjZXNzIFNhdmVFbnRpdGllcyBhY3Rpb24gd2l0aFxuICAgKiB0aGUgZ2l2ZW4gQ29ycmVsYXRpb24gSWQsIGFmdGVyIHRoYXQgYWN0aW9uIHdhcyBwcm9jZXNzZWQgYnkgdGhlIG5ncnggc3RvcmUuXG4gICAqIG9yIGVsc2UgcHV0IHRoZSBzZXJ2ZXIgZXJyb3Igb24gdGhlIE9ic2VydmFibGUgZXJyb3IgY2hhbm5lbC5cbiAgICogQHBhcmFtIGNyaWQgVGhlIGNvcnJlbGF0aW9uSWQgZm9yIGJvdGggdGhlIHNhdmUgYW5kIHJlc3BvbnNlIGFjdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIGdldFNhdmVFbnRpdGllc1Jlc3BvbnNlRGF0YSQoY3JpZDogYW55KTogT2JzZXJ2YWJsZTxDaGFuZ2VTZXQ+IHtcbiAgICAvKipcbiAgICAgKiByZWR1Y2VkQWN0aW9ucyQgbXVzdCBiZSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgICAqIGJlY2F1c2UgdGhlIHJlc3BvbnNlIGFjdGlvbiBtaWdodCBoYXZlIGJlZW4gZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmVcbiAgICAgKiBiZWZvcmUgY2FsbGVyIGhhZCBhIGNoYW5jZSB0byBzdWJzY3JpYmUuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMucmVkdWNlZEFjdGlvbnMkLnBpcGUoXG4gICAgICBmaWx0ZXIoXG4gICAgICAgIChhY3Q6IEFjdGlvbikgPT5cbiAgICAgICAgICBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19TVUNDRVNTIHx8XG4gICAgICAgICAgYWN0LnR5cGUgPT09IEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfRVJST1IgfHxcbiAgICAgICAgICBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUxcbiAgICAgICksXG4gICAgICBmaWx0ZXIoKGFjdDogQWN0aW9uKSA9PiBjcmlkID09PSAoYWN0IGFzIGFueSkucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgIHRha2UoMSksXG4gICAgICBtZXJnZU1hcCgoYWN0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUxcbiAgICAgICAgICA/IHRocm93RXJyb3IoXG4gICAgICAgICAgICAgIG5ldyBQZXJzaXN0YW5jZUNhbmNlbGVkKFxuICAgICAgICAgICAgICAgIChhY3QgYXMgU2F2ZUVudGl0aWVzQ2FuY2VsKS5wYXlsb2FkLnJlYXNvblxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19TVUNDRVNTXG4gICAgICAgICAgPyBvZigoYWN0IGFzIFNhdmVFbnRpdGllc1N1Y2Nlc3MpLnBheWxvYWQuY2hhbmdlU2V0KVxuICAgICAgICAgIDogdGhyb3dFcnJvcigoYWN0IGFzIFNhdmVFbnRpdGllc0Vycm9yKS5wYXlsb2FkKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19