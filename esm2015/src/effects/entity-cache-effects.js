import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { asyncScheduler, of, merge, race, } from 'rxjs';
import { concatMap, catchError, delay, filter, map, mergeMap, } from 'rxjs/operators';
import { DataServiceError } from '../dataservices/data-service-error';
import { excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityOp } from '../actions/entity-op';
import { EntityCacheAction, SaveEntitiesCanceled, SaveEntitiesError, SaveEntitiesSuccess, } from '../actions/entity-cache-action';
import { EntityCacheDataService } from '../dataservices/entity-cache-data.service';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { Logger } from '../utils/interfaces';
export class EntityCacheEffects {
    constructor(actions, dataService, entityActionFactory, logger, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.logger = logger;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         */
        this.saveEntitiesCancel$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((a) => a.payload.correlationId != null)), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((action) => this.saveEntities(action))));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    saveEntities(action) {
        const error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            const options = { correlationId, mergeStrategy, tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            const c = this.saveEntitiesCancel$.pipe(filter((a) => correlationId === a.payload.correlationId), map((a) => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((result) => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    }
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    handleSaveEntitiesError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
        };
    }
    /** return handler of the ChangeSet result of successful saveEntities() */
    handleSaveEntitiesSuccess$(action, entityActionFactory) {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        const options = { correlationId, mergeStrategy, tag };
        return (changeSet) => {
            // DataService returned a ChangeSet with possible updates to the saved entities
            if (changeSet) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // No ChangeSet = Server probably responded '204 - No Content' because
            // it made no changes to the inserted/updated entities.
            // Respond with success action best on the ChangeSet in the request.
            changeSet = action.payload.changeSet;
            // If pessimistic save, return success action with the original ChangeSet
            if (!action.payload.isOptimistic) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // If optimistic save, avoid cache grinding by just turning off the loading flags
            // for all collections in the original ChangeSet
            const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1
                ? acc.concat(item.entityName)
                : acc, []);
            return merge(entityNames.map((name) => entityActionFactory.create(name, EntityOp.SET_LOADING, false)));
        };
    }
}
EntityCacheEffects.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCacheEffects.ctorParameters = () => [
    { type: Actions },
    { type: EntityCacheDataService },
    { type: EntityActionFactory },
    { type: Logger },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQ0wsY0FBYyxFQUVkLEVBQUUsRUFDRixLQUFLLEVBQ0wsSUFBSSxHQUVMLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFDTixHQUFHLEVBQ0gsUUFBUSxHQUNULE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdEUsT0FBTyxFQUVMLDBCQUEwQixHQUMzQixNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVoRCxPQUFPLEVBQ0wsaUJBQWlCLEVBR2pCLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsbUJBQW1CLEdBQ3BCLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDbkYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzdDLE1BQU0sT0FBTyxrQkFBa0I7SUFLN0IsWUFDVSxPQUFnQixFQUNoQixXQUFtQyxF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LEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxzRUFBc0U7WUFDdEUsdURBQXVEO1lBQ3ZELG9FQUFvRTtZQUNwRSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFFckMseUVBQXlFO1lBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxpRkFBaUY7WUFDakYsZ0RBQWdEO1lBQ2hELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUMxQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLEdBQUcsRUFDVCxFQUFjLENBQ2YsQ0FBQztZQUNGLE9BQU8sS0FBSyxDQUNWLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUN2QixtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQzlELENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7OztZQXJKRixVQUFVOzs7O1lBdkNGLE9BQU87WUFtQ1Asc0JBQXNCO1lBWHRCLG1CQUFtQjtZQWFuQixNQUFNOzRDQWtCVixRQUFRLFlBQ1IsTUFBTSxTQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIG9mVHlwZSwgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5cbmltcG9ydCB7XG4gIGFzeW5jU2NoZWR1bGVyLFxuICBPYnNlcnZhYmxlLFxuICBvZixcbiAgbWVyZ2UsXG4gIHJhY2UsXG4gIFNjaGVkdWxlckxpa2UsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY29uY2F0TWFwLFxuICBjYXRjaEVycm9yLFxuICBkZWxheSxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIG1lcmdlTWFwLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7XG4gIENoYW5nZVNldCxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0NhbmNlbGVkLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnMsXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5Q2FjaGVEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2YgU0FWRV9FTlRJVElFU19DQU5DRUwgYWN0aW9ucyB3aXRoIG5vbi1udWxsIGNvcnJlbGF0aW9uIGlkc1xuICAgKi9cbiAgc2F2ZUVudGl0aWVzQ2FuY2VsJDogT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWw+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMKSxcbiAgICAgICAgZmlsdGVyKChhOiBTYXZlRW50aXRpZXNDYW5jZWwpID0+IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBDb25jdXJyZW50IHBlcnNpc3RlbmNlIHJlcXVlc3RzIGNvbnNpZGVyZWQgdW5zYWZlLlxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBzYXZlRW50aXRpZXMkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTKSxcbiAgICAgIG1lcmdlTWFwKChhY3Rpb246IFNhdmVFbnRpdGllcykgPT4gdGhpcy5zYXZlRW50aXRpZXMoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBTYXZlRW50aXRpZXMgYWN0aW9ucyBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBTYXZlRW50aXRpZXMgYWN0aW9uXG4gICAqL1xuICBzYXZlRW50aXRpZXMoYWN0aW9uOiBTYXZlRW50aXRpZXMpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IGVycm9yID0gYWN0aW9uLnBheWxvYWQuZXJyb3I7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGFuZ2VTZXQgPSBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQpO1xuICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcsIHVybCB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgICAgaWYgKGNoYW5nZVNldC5jaGFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBub3RoaW5nIHRvIHNhdmVcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbGVkPiBmb3IgYSBzYXZlRW50aXRpZXMgYWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgdGhlIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcigoYSkgPT4gY29ycmVsYXRpb25JZCA9PT0gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBtYXAoXG4gICAgICAgICAgKGEpID0+XG4gICAgICAgICAgICBuZXcgU2F2ZUVudGl0aWVzQ2FuY2VsZWQoXG4gICAgICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICAgIGEucGF5bG9hZC5yZWFzb24sXG4gICAgICAgICAgICAgIGEucGF5bG9hZC50YWdcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogU2F2ZUVudGl0aWVzIHJlc3VsdCBhcyBhIFNhdmVFbnRpdGllc1N1Y2Nlc3MgYWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5kYXRhU2VydmljZS5zYXZlRW50aXRpZXMoY2hhbmdlU2V0LCB1cmwpLnBpcGUoXG4gICAgICAgIGNvbmNhdE1hcCgocmVzdWx0KSA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnlcbiAgICAgICAgICApKHJlc3VsdClcbiAgICAgICAgKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIGVycm9yIHJlc3VsdCBvZiBzYXZlRW50aXRpZXMsIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvbiAqL1xuICBwcml2YXRlIGhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApOiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgIGVyciBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3IgPyBlcnIgOiBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIG51bGwpO1xuICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNFcnJvcihlcnJvciwgYWN0aW9uKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKiByZXR1cm4gaGFuZGxlciBvZiB0aGUgQ2hhbmdlU2V0IHJlc3VsdCBvZiBzdWNjZXNzZnVsIHNhdmVFbnRpdGllcygpICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXMsXG4gICAgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeVxuICApOiAoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpID0+IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgeyB1cmwsIGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH07XG5cbiAgICByZXR1cm4gKGNoYW5nZVNldCkgPT4ge1xuICAgICAgLy8gRGF0YVNlcnZpY2UgcmV0dXJuZWQgYSBDaGFuZ2VTZXQgd2l0aCBwb3NzaWJsZSB1cGRhdGVzIHRvIHRoZSBzYXZlZCBlbnRpdGllc1xuICAgICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gQ2hhbmdlU2V0ID0gU2VydmVyIHByb2JhYmx5IHJlc3BvbmRlZCAnMjA0IC0gTm8gQ29udGVudCcgYmVjYXVzZVxuICAgICAgLy8gaXQgbWFkZSBubyBjaGFuZ2VzIHRvIHRoZSBpbnNlcnRlZC91cGRhdGVkIGVudGl0aWVzLlxuICAgICAgLy8gUmVzcG9uZCB3aXRoIHN1Y2Nlc3MgYWN0aW9uIGJlc3Qgb24gdGhlIENoYW5nZVNldCBpbiB0aGUgcmVxdWVzdC5cbiAgICAgIGNoYW5nZVNldCA9IGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldDtcblxuICAgICAgLy8gSWYgcGVzc2ltaXN0aWMgc2F2ZSwgcmV0dXJuIHN1Y2Nlc3MgYWN0aW9uIHdpdGggdGhlIG9yaWdpbmFsIENoYW5nZVNldFxuICAgICAgaWYgKCFhY3Rpb24ucGF5bG9hZC5pc09wdGltaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG9wdGltaXN0aWMgc2F2ZSwgYXZvaWQgY2FjaGUgZ3JpbmRpbmcgYnkganVzdCB0dXJuaW5nIG9mZiB0aGUgbG9hZGluZyBmbGFnc1xuICAgICAgLy8gZm9yIGFsbCBjb2xsZWN0aW9ucyBpbiB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBjb25zdCBlbnRpdHlOYW1lcyA9IGNoYW5nZVNldC5jaGFuZ2VzLnJlZHVjZShcbiAgICAgICAgKGFjYywgaXRlbSkgPT5cbiAgICAgICAgICBhY2MuaW5kZXhPZihpdGVtLmVudGl0eU5hbWUpID09PSAtMVxuICAgICAgICAgICAgPyBhY2MuY29uY2F0KGl0ZW0uZW50aXR5TmFtZSlcbiAgICAgICAgICAgIDogYWNjLFxuICAgICAgICBbXSBhcyBzdHJpbmdbXVxuICAgICAgKTtcbiAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgZW50aXR5TmFtZXMubWFwKChuYW1lKSA9PlxuICAgICAgICAgIGVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlKG5hbWUsIEVudGl0eU9wLlNFVF9MT0FESU5HLCBmYWxzZSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG59XG4iXX0=