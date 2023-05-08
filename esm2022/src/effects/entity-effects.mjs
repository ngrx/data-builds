import { Inject, Injectable, Optional } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { asyncScheduler, of, race } from 'rxjs';
import { catchError, delay, filter, map, mergeMap } from 'rxjs/operators';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { EntityOp, makeSuccessOp } from '../actions/entity-op';
import { ofEntityOp } from '../actions/entity-action-operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
import * as i2 from "../dataservices/entity-data.service";
import * as i3 from "../actions/entity-action-factory";
import * as i4 from "../dataservices/persistence-result-handler.service";
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
class EntityEffects {
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
        const { entityName, entityOp, data, httpOptions } = action.payload;
        const service = this.dataService.getService(entityName);
        switch (entityOp) {
            case EntityOp.QUERY_ALL:
            case EntityOp.QUERY_LOAD:
                return service.getAll(httpOptions);
            case EntityOp.QUERY_BY_KEY:
                return service.getById(data, httpOptions);
            case EntityOp.QUERY_MANY:
                return service.getWithQuery(data, httpOptions);
            case EntityOp.SAVE_ADD_ONE:
                return service.add(data, httpOptions);
            case EntityOp.SAVE_DELETE_ONE:
                return service.delete(data, httpOptions);
            case EntityOp.SAVE_UPDATE_ONE:
                const { id, changes } = data; // data must be Update<T>
                return service.update(data, httpOptions).pipe(map((updatedEntity) => {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    const responseData = hasData
                        ? { id, changes: { ...changes, ...updatedEntity }, changed: true }
                        : { id, changes, changed: false };
                    return responseData;
                }));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data, httpOptions).pipe(map((upsertedEntity) => {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityEffects, deps: [{ token: i1.Actions }, { token: i2.EntityDataService }, { token: i3.EntityActionFactory }, { token: i4.PersistenceResultHandler }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityEffects }); }
}
export { EntityEffects };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Actions }, { type: i2.EntityDataService }, { type: i3.EntityActionFactory }, { type: i4.PersistenceResultHandler }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBVyxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdEQsT0FBTyxFQUFFLGNBQWMsRUFBYyxFQUFFLEVBQUUsSUFBSSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOzs7Ozs7QUFNaEUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFlO0lBQ3BDLFFBQVEsQ0FBQyxTQUFTO0lBQ2xCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0NBQ3pCLENBQUM7QUFFRixNQUNhLGFBQWE7SUEwQnhCLFlBQ1UsT0FBOEIsRUFDOUIsV0FBOEIsRUFDOUIsbUJBQXdDLEVBQ3hDLGFBQXVDO0lBQy9DOzs7O09BSUc7SUFHSyxTQUF3QjtRQVh4QixZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQUM5QixnQkFBVyxHQUFYLFdBQVcs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SUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUM3RCxjQUFjLEVBQ2Q7WUFDRSxRQUFRLEVBQUUsU0FBUztTQUNwQixDQUNGLENBQUM7UUFDRixnQ0FBZ0M7UUFDaEMseURBQXlEO1FBQ3pELCtDQUErQztRQUMvQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksY0FBYyxDQUFDLENBQzVELENBQUM7SUFDSixDQUFDO2lJQXZLVSxhQUFhLHFKQXFDZCx3QkFBd0I7cUlBckN2QixhQUFhOztTQUFiLGFBQWE7MkZBQWIsYUFBYTtrQkFEekIsVUFBVTs7MEJBcUNOLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2YsIHJhY2UsIFNjaGVkdWxlckxpa2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgRW50aXR5T3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBwZXJzaXN0T3BzOiBFbnRpdHlPcFtdID0gW1xuICBFbnRpdHlPcC5RVUVSWV9BTEwsXG4gIEVudGl0eU9wLlFVRVJZX0xPQUQsXG4gIEVudGl0eU9wLlFVRVJZX0JZX0tFWSxcbiAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2Ygbm9uLW51bGwgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uIGlkcyBmcm9tIENBTkNFTF9QRVJTSVNUIGFjdGlvbnNcbiAgICovXG4gIGNhbmNlbCQ6IE9ic2VydmFibGU8YW55PiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mRW50aXR5T3AoRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpLFxuICAgICAgICBtYXAoKGFjdGlvbjogRW50aXR5QWN0aW9uKSA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgZmlsdGVyKChpZCkgPT4gaWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHBlcnNpc3QkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mRW50aXR5T3AocGVyc2lzdE9wcyksXG4gICAgICBtZXJnZU1hcCgoYWN0aW9uKSA9PiB0aGlzLnBlcnNpc3QoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zPEVudGl0eUFjdGlvbj4sXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgcmVzdWx0SGFuZGxlcjogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIEEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIEVudGl0eUFjdGlvblxuICAgKi9cbiAgcGVyc2lzdChhY3Rpb246IEVudGl0eUFjdGlvbik6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLnNraXApIHtcbiAgICAgIC8vIFNob3VsZCBub3QgcGVyc2lzdC4gUHJldGVuZCBpdCBzdWNjZWVkZWQuXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTa2lwU3VjY2VzcyQoYWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZSBvZiBDQU5DRUxFRF9QRVJTSVNUIGZvciBhIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5jYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcigoaWQpID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgPT09IGlkKSxcbiAgICAgICAgbWFwKChpZCkgPT5cbiAgICAgICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihhY3Rpb24sIHtcbiAgICAgICAgICAgIGVudGl0eU9wOiBFbnRpdHlPcC5DQU5DRUxFRF9QRVJTSVNULFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IGVudGl0eSBjb2xsZWN0aW9uIERhdGFTZXJ2aWNlIHJlc3VsdCBhcyBhIHN1Y2Nlc3NmdWwgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5jYWxsRGF0YVNlcnZpY2UoYWN0aW9uKS5waXBlKFxuICAgICAgICBtYXAodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZVN1Y2Nlc3MoYWN0aW9uKSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYWxsRGF0YVNlcnZpY2UoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICBjb25zdCB7IGVudGl0eU5hbWUsIGVudGl0eU9wLCBkYXRhLCBodHRwT3B0aW9ucyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0U2VydmljZShlbnRpdHlOYW1lKTtcbiAgICBzd2l0Y2ggKGVudGl0eU9wKSB7XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0FMTDpcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTE9BRDpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QWxsKGh0dHBPcHRpb25zKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9CWV9LRVk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEJ5SWQoZGF0YSwgaHR0cE9wdGlvbnMpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX01BTlk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldFdpdGhRdWVyeShkYXRhLCBodHRwT3B0aW9ucyk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9BRERfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5hZGQoZGF0YSwgaHR0cE9wdGlvbnMpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZGVsZXRlKGRhdGEsIGh0dHBPcHRpb25zKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkU6XG4gICAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGEgYXMgVXBkYXRlPGFueT47IC8vIGRhdGEgbXVzdCBiZSBVcGRhdGU8VD5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBkYXRlKGRhdGEsIGh0dHBPcHRpb25zKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBkYXRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gYW4gVXBkYXRlPFQ+IHdpdGggdXBkYXRlZCBlbnRpdHkgZGF0YS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciByZXR1cm5lZCBlbnRpdHkgZGF0YSwgbWVyZ2Ugd2l0aCB0aGUgY2hhbmdlcyB0aGF0IHdlcmUgc2VudFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgJ2NoYW5nZWQnIGZsYWcgdG8gdHJ1ZS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YSxcbiAgICAgICAgICAgIC8vIGFzc3VtZSBpdCBtYWRlIG5vIGFkZGl0aW9uYWwgY2hhbmdlcyBvZiBpdHMgb3duLCByZXR1cm4gdGhlIG9yaWdpbmFsIGNoYW5nZXMsXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSBgY2hhbmdlZGAgZmxhZyB0byBgZmFsc2VgLlxuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwZGF0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBkYXRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPGFueT4gPSBoYXNEYXRhXG4gICAgICAgICAgICAgID8geyBpZCwgY2hhbmdlczogeyAuLi5jaGFuZ2VzLCAuLi51cGRhdGVkRW50aXR5IH0sIGNoYW5nZWQ6IHRydWUgfVxuICAgICAgICAgICAgICA6IHsgaWQsIGNoYW5nZXMsIGNoYW5nZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS51cHNlcnQoZGF0YSwgaHR0cE9wdGlvbnMpLnBpcGUoXG4gICAgICAgICAgbWFwKCh1cHNlcnRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBzZXJ0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBzZXJ0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICByZXR1cm4gaGFzRGF0YSA/IHVwc2VydGVkRW50aXR5IDogZGF0YTsgLy8gZW5zdXJlIGEgcmV0dXJuZWQgZW50aXR5IHZhbHVlLlxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBlcnNpc3RlbmNlIGFjdGlvbiBcIiR7ZW50aXR5T3B9XCIgaXMgbm90IGltcGxlbWVudGVkLmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24sXG4gICAqIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvciQoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKGVycm9yOiBFcnJvcikgPT4gT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyb3I6IEVycm9yKSA9PlxuICAgICAgb2YodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZUVycm9yKGFjdGlvbikoZXJyb3IpKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWNhdXNlIEVudGl0eUFjdGlvbi5wYXlsb2FkLnNraXAgaXMgdHJ1ZSwgc2tpcCB0aGUgcGVyc2lzdGVuY2Ugc3RlcCBhbmRcbiAgICogcmV0dXJuIGEgc2NhbGFyIHN1Y2Nlc3MgYWN0aW9uIHRoYXQgbG9va3MgbGlrZSB0aGUgb3BlcmF0aW9uIHN1Y2NlZWRlZC5cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlU2tpcFN1Y2Nlc3MkKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIGNvbnN0IHN1Y2Nlc3NBY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihcbiAgICAgIG9yaWdpbmFsQWN0aW9uLFxuICAgICAge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgfVxuICAgICk7XG4gICAgLy8gQWx0aG91Z2ggcmV0dXJucyBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBvbmUgdGljayAoYnkgdXNpbmcgYSBwcm9taXNlKSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiBvZihzdWNjZXNzQWN0aW9uKS5waXBlKFxuICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICApO1xuICB9XG59XG4iXX0=