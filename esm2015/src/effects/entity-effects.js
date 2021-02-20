import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { asyncScheduler, of, race } from 'rxjs';
import { catchError, delay, filter, map, mergeMap } from 'rxjs/operators';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { EntityOp, makeSuccessOp } from '../actions/entity-op';
import { ofEntityOp } from '../actions/entity-action-operators';
import { EntityDataService } from '../dataservices/entity-data.service';
import { PersistenceResultHandler } from '../dataservices/persistence-result-handler.service';
export const persistOps = [
    EntityOp.QUERY_ALL,
    EntityOp.QUERY_LOAD,
    EntityOp.QUERY_BY_KEY,
    EntityOp.QUERY_MANY,
    EntityOp.SAVE_ADD_ONE,
    EntityOp.SAVE_DELETE_ONE,
    EntityOp.SAVE_UPDATE_ONE,
    EntityOp.SAVE_UPSERT_ONE,
];
export class EntityEffects {
    constructor(actions, dataService, entityActionFactory, resultHandler, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.resultHandler = resultHandler;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
         */
        this.cancel$ = createEffect(() => this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((action) => action.payload.correlationId), filter((id) => id != null)), { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect(() => this.actions.pipe(ofEntityOp(persistOps), mergeMap((action) => this.persist(action))));
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation EntityAction
     */
    persist(action) {
        if (action.payload.skip) {
            // Should not persist. Pretend it succeeded.
            return this.handleSkipSuccess$(action);
        }
        if (action.payload.error) {
            return this.handleError$(action)(action.payload.error);
        }
        try {
            // Cancellation: returns Observable of CANCELED_PERSIST for a persistence EntityAction
            // whose correlationId matches cancellation correlationId
            const c = this.cancel$.pipe(filter((id) => action.payload.correlationId === id), map((id) => this.entityActionFactory.createFromAction(action, {
                entityOp: EntityOp.CANCELED_PERSIST,
            })));
            // Data: entity collection DataService result as a successful persistence EntityAction
            const d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    }
    callDataService(action) {
        const { entityName, entityOp, data } = action.payload;
        const service = this.dataService.getService(entityName);
        switch (entityOp) {
            case EntityOp.QUERY_ALL:
            case EntityOp.QUERY_LOAD:
                return service.getAll();
            case EntityOp.QUERY_BY_KEY:
                return service.getById(data);
            case EntityOp.QUERY_MANY:
                return service.getWithQuery(data);
            case EntityOp.SAVE_ADD_ONE:
                return service.add(data);
            case EntityOp.SAVE_DELETE_ONE:
                return service.delete(data);
            case EntityOp.SAVE_UPDATE_ONE:
                const { id, changes } = data; // data must be Update<T>
                return service.update(data).pipe(map((updatedEntity) => {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    const responseData = hasData
                        ? { id, changes: Object.assign(Object.assign({}, changes), updatedEntity), changed: true }
                        : { id, changes, changed: false };
                    return responseData;
                }));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(map((upsertedEntity) => {
                    const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                }));
            default:
                throw new Error(`Persistence action "${entityOp}" is not implemented.`);
        }
    }
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     */
    handleError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (error) => of(this.resultHandler.handleError(action)(error)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    handleSkipSuccess$(originalAction) {
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        const successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
}
EntityEffects.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityEffects.ctorParameters = () => [
    { type: Actions },
    { type: EntityDataService },
    { type: EntityActionFactory },
    { type: PersistenceResultHandler },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3RELE9BQU8sRUFBRSxjQUFjLEVBQWMsRUFBRSxFQUFFLElBQUksRUFBaUIsTUFBTSxNQUFNLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUcxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUdoRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUU5RixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWU7SUFDcEMsUUFBUSxDQUFDLFNBQVM7SUFDbEIsUUFBUSxDQUFDLFVBQVU7SUFDbkIsUUFBUSxDQUFDLFlBQVk7SUFDckIsUUFBUSxDQUFDLFVBQVU7SUFDbkIsUUFBUSxDQUFDLFlBQVk7SUFDckIsUUFBUSxDQUFDLGVBQWU7SUFDeEIsUUFBUSxDQUFDLGVBQWU7SUFDeEIsUUFBUSxDQUFDLGVBQWU7Q0FDekIsQ0FBQztBQUdG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QUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQzdELGNBQWMsRUFDZDtZQUNFLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQ0YsQ0FBQztRQUNGLGdDQUFnQztRQUNoQyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7OztZQXhLRixVQUFVOzs7O1lBM0JGLE9BQU87WUFhUCxpQkFBaUI7WUFOakIsbUJBQW1CO1lBT25CLHdCQUF3Qjs0Q0FrRDVCLFFBQVEsWUFDUixNQUFNLFNBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2YsIHJhY2UsIFNjaGVkdWxlckxpa2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgRW50aXR5T3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBwZXJzaXN0T3BzOiBFbnRpdHlPcFtdID0gW1xuICBFbnRpdHlPcC5RVUVSWV9BTEwsXG4gIEVudGl0eU9wLlFVRVJZX0xPQUQsXG4gIEVudGl0eU9wLlFVRVJZX0JZX0tFWSxcbiAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2Ygbm9uLW51bGwgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uIGlkcyBmcm9tIENBTkNFTF9QRVJTSVNUIGFjdGlvbnNcbiAgICovXG4gIGNhbmNlbCQ6IE9ic2VydmFibGU8YW55PiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mRW50aXR5T3AoRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpLFxuICAgICAgICBtYXAoKGFjdGlvbjogRW50aXR5QWN0aW9uKSA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgZmlsdGVyKChpZCkgPT4gaWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHBlcnNpc3QkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mRW50aXR5T3AocGVyc2lzdE9wcyksXG4gICAgICBtZXJnZU1hcCgoYWN0aW9uKSA9PiB0aGlzLnBlcnNpc3QoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zPEVudGl0eUFjdGlvbj4sXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgcmVzdWx0SGFuZGxlcjogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIEEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIEVudGl0eUFjdGlvblxuICAgKi9cbiAgcGVyc2lzdChhY3Rpb246IEVudGl0eUFjdGlvbik6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLnNraXApIHtcbiAgICAgIC8vIFNob3VsZCBub3QgcGVyc2lzdC4gUHJldGVuZCBpdCBzdWNjZWVkZWQuXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTa2lwU3VjY2VzcyQoYWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZSBvZiBDQU5DRUxFRF9QRVJTSVNUIGZvciBhIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5jYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcigoaWQpID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgPT09IGlkKSxcbiAgICAgICAgbWFwKChpZCkgPT5cbiAgICAgICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihhY3Rpb24sIHtcbiAgICAgICAgICAgIGVudGl0eU9wOiBFbnRpdHlPcC5DQU5DRUxFRF9QRVJTSVNULFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IGVudGl0eSBjb2xsZWN0aW9uIERhdGFTZXJ2aWNlIHJlc3VsdCBhcyBhIHN1Y2Nlc3NmdWwgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5jYWxsRGF0YVNlcnZpY2UoYWN0aW9uKS5waXBlKFxuICAgICAgICBtYXAodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZVN1Y2Nlc3MoYWN0aW9uKSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FsbERhdGFTZXJ2aWNlKGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgY29uc3QgeyBlbnRpdHlOYW1lLCBlbnRpdHlPcCwgZGF0YSB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0U2VydmljZShlbnRpdHlOYW1lKTtcbiAgICBzd2l0Y2ggKGVudGl0eU9wKSB7XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0FMTDpcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTE9BRDpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QWxsKCk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQllfS0VZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRCeUlkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX01BTlk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldFdpdGhRdWVyeShkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0FERF9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmFkZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmRlbGV0ZShkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkU6XG4gICAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGEgYXMgVXBkYXRlPGFueT47IC8vIGRhdGEgbXVzdCBiZSBVcGRhdGU8VD5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBkYXRlKGRhdGEpLnBpcGUoXG4gICAgICAgICAgbWFwKCh1cGRhdGVkRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vIFJldHVybiBhbiBVcGRhdGU8VD4gd2l0aCB1cGRhdGVkIGVudGl0eSBkYXRhLlxuICAgICAgICAgICAgLy8gSWYgc2VydmVyIHJldHVybmVkIGVudGl0eSBkYXRhLCBtZXJnZSB3aXRoIHRoZSBjaGFuZ2VzIHRoYXQgd2VyZSBzZW50XG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSAnY2hhbmdlZCcgZmxhZyB0byB0cnVlLlxuICAgICAgICAgICAgLy8gSWYgc2VydmVyIGRpZCBub3QgcmV0dXJuIGVudGl0eSBkYXRhLFxuICAgICAgICAgICAgLy8gYXNzdW1lIGl0IG1hZGUgbm8gYWRkaXRpb25hbCBjaGFuZ2VzIG9mIGl0cyBvd24sIHJldHVybiB0aGUgb3JpZ2luYWwgY2hhbmdlcyxcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlIGBjaGFuZ2VkYCBmbGFnIHRvIGBmYWxzZWAuXG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBkYXRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cGRhdGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8YW55PiA9IGhhc0RhdGFcbiAgICAgICAgICAgICAgPyB7IGlkLCBjaGFuZ2VzOiB7IC4uLmNoYW5nZXMsIC4uLnVwZGF0ZWRFbnRpdHkgfSwgY2hhbmdlZDogdHJ1ZSB9XG4gICAgICAgICAgICAgIDogeyBpZCwgY2hhbmdlcywgY2hhbmdlZDogZmFsc2UgfTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZURhdGE7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwc2VydChkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBzZXJ0ZWRFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwc2VydGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwc2VydGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIGhhc0RhdGEgPyB1cHNlcnRlZEVudGl0eSA6IGRhdGE7IC8vIGVuc3VyZSBhIHJldHVybmVkIGVudGl0eSB2YWx1ZS5cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQZXJzaXN0ZW5jZSBhY3Rpb24gXCIke2VudGl0eU9wfVwiIGlzIG5vdCBpbXBsZW1lbnRlZC5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uLFxuICAgKiByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IkKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChlcnJvcjogRXJyb3IpID0+IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycm9yOiBFcnJvcikgPT5cbiAgICAgIG9mKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVFcnJvcihhY3Rpb24pKGVycm9yKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQmVjYXVzZSBFbnRpdHlBY3Rpb24ucGF5bG9hZC5za2lwIGlzIHRydWUsIHNraXAgdGhlIHBlcnNpc3RlbmNlIHN0ZXAgYW5kXG4gICAqIHJldHVybiBhIHNjYWxhciBzdWNjZXNzIGFjdGlvbiB0aGF0IGxvb2tzIGxpa2UgdGhlIG9wZXJhdGlvbiBzdWNjZWVkZWQuXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZVNraXBTdWNjZXNzJChcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICBjb25zdCBzdWNjZXNzQWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oXG4gICAgICBvcmlnaW5hbEFjdGlvbixcbiAgICAgIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEFsdGhvdWdoIHJldHVybnMgaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgb25lIHRpY2sgKGJ5IHVzaW5nIGEgcHJvbWlzZSksXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gb2Yoc3VjY2Vzc0FjdGlvbikucGlwZShcbiAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgKTtcbiAgfVxufVxuIl19