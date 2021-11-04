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
/** @nocollapse */ EntityEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityEffects, deps: [{ token: i1.Actions }, { token: i2.EntityDataService }, { token: i3.EntityActionFactory }, { token: i4.PersistenceResultHandler }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ EntityEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Actions }, { type: i2.EntityDataService }, { type: i3.EntityActionFactory }, { type: i4.PersistenceResultHandler }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBVyxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdEQsT0FBTyxFQUFFLGNBQWMsRUFBYyxFQUFFLEVBQUUsSUFBSSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOzs7Ozs7QUFNaEUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFlO0lBQ3BDLFFBQVEsQ0FBQyxTQUFTO0lBQ2xCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0NBQ3pCLENBQUM7QUFHRixNQUFNLE9BQU8sYUFBYTtJQTBCeEIsWUFDVSxPQUE4QixFQUM5QixXQUE4QixFQUM5QixtQkFBd0MsRUFDeEMsYUFBdUM7SUFDL0M7Ozs7T0FJRztJQUdLLFNBQXdCO1FBWHhCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBQzlCLGdCQUFXLEdBQVgs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Z0M7UUFDaEMseURBQXlEO1FBQ3pELCtDQUErQztRQUMvQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksY0FBYyxDQUFDLENBQzVELENBQUM7SUFDSixDQUFDOzs2SEF2S1UsYUFBYSxxSkFxQ2Qsd0JBQXdCO2lJQXJDdkIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFxQ04sUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBjcmVhdGVFZmZlY3QgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IGFzeW5jU2NoZWR1bGVyLCBPYnNlcnZhYmxlLCBvZiwgcmFjZSwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIGZpbHRlciwgbWFwLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBFbnRpdHlPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IG9mRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tb3BlcmF0b3JzJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9lbnRpdHktZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IHBlcnNpc3RPcHM6IEVudGl0eU9wW10gPSBbXG4gIEVudGl0eU9wLlFVRVJZX0FMTCxcbiAgRW50aXR5T3AuUVVFUllfTE9BRCxcbiAgRW50aXR5T3AuUVVFUllfQllfS0VZLFxuICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICBFbnRpdHlPcC5TQVZFX0FERF9PTkUsXG4gIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkUsXG5dO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSBvZiBub24tbnVsbCBjYW5jZWxsYXRpb24gY29ycmVsYXRpb24gaWRzIGZyb20gQ0FOQ0VMX1BFUlNJU1QgYWN0aW9uc1xuICAgKi9cbiAgY2FuY2VsJDogT2JzZXJ2YWJsZTxhbnk+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZFbnRpdHlPcChFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVCksXG4gICAgICAgIG1hcCgoYWN0aW9uOiBFbnRpdHlBY3Rpb24pID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBmaWx0ZXIoKGlkKSA9PiBpZCAhPSBudWxsKVxuICAgICAgKSxcbiAgICB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gICk7XG5cbiAgLy8gYG1lcmdlTWFwYCBhbGxvd3MgZm9yIGNvbmN1cnJlbnQgcmVxdWVzdHMgd2hpY2ggbWF5IHJldHVybiBpbiBhbnkgb3JkZXJcbiAgcGVyc2lzdCQ6IE9ic2VydmFibGU8QWN0aW9uPiA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgb2ZFbnRpdHlPcChwZXJzaXN0T3BzKSxcbiAgICAgIG1lcmdlTWFwKChhY3Rpb24pID0+IHRoaXMucGVyc2lzdChhY3Rpb24pKVxuICAgIClcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnM8RW50aXR5QWN0aW9uPixcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSByZXN1bHRIYW5kbGVyOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gQSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gRW50aXR5QWN0aW9uXG4gICAqL1xuICBwZXJzaXN0KGFjdGlvbjogRW50aXR5QWN0aW9uKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuc2tpcCkge1xuICAgICAgLy8gU2hvdWxkIG5vdCBwZXJzaXN0LiBQcmV0ZW5kIGl0IHN1Y2NlZWRlZC5cbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNraXBTdWNjZXNzJChhY3Rpb24pO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGFjdGlvbi5wYXlsb2FkLmVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlIG9mIENBTkNFTEVEX1BFUlNJU1QgZm9yIGEgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKChpZCkgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCA9PT0gaWQpLFxuICAgICAgICBtYXAoKGlkKSA9PlxuICAgICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKGFjdGlvbiwge1xuICAgICAgICAgICAgZW50aXR5T3A6IEVudGl0eU9wLkNBTkNFTEVEX1BFUlNJU1QsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogZW50aXR5IGNvbGxlY3Rpb24gRGF0YVNlcnZpY2UgcmVzdWx0IGFzIGEgc3VjY2Vzc2Z1bCBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmNhbGxEYXRhU2VydmljZShhY3Rpb24pLnBpcGUoXG4gICAgICAgIG1hcCh0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlU3VjY2VzcyhhY3Rpb24pKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYWxsRGF0YVNlcnZpY2UoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICBjb25zdCB7IGVudGl0eU5hbWUsIGVudGl0eU9wLCBkYXRhIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5kYXRhU2VydmljZS5nZXRTZXJ2aWNlKGVudGl0eU5hbWUpO1xuICAgIHN3aXRjaCAoZW50aXR5T3ApIHtcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQUxMOlxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9MT0FEOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRBbGwoKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9CWV9LRVk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEJ5SWQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTUFOWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0V2l0aFF1ZXJ5KGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfQUREX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuYWRkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZGVsZXRlKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORTpcbiAgICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YSBhcyBVcGRhdGU8YW55PjsgLy8gZGF0YSBtdXN0IGJlIFVwZGF0ZTxUPlxuICAgICAgICByZXR1cm4gc2VydmljZS51cGRhdGUoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAoKHVwZGF0ZWRFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gUmV0dXJuIGFuIFVwZGF0ZTxUPiB3aXRoIHVwZGF0ZWQgZW50aXR5IGRhdGEuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgcmV0dXJuZWQgZW50aXR5IGRhdGEsIG1lcmdlIHdpdGggdGhlIGNoYW5nZXMgdGhhdCB3ZXJlIHNlbnRcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlICdjaGFuZ2VkJyBmbGFnIHRvIHRydWUuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgZGlkIG5vdCByZXR1cm4gZW50aXR5IGRhdGEsXG4gICAgICAgICAgICAvLyBhc3N1bWUgaXQgbWFkZSBubyBhZGRpdGlvbmFsIGNoYW5nZXMgb2YgaXRzIG93biwgcmV0dXJuIHRoZSBvcmlnaW5hbCBjaGFuZ2VzLFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgYGNoYW5nZWRgIGZsYWcgdG8gYGZhbHNlYC5cbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cGRhdGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwZGF0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxhbnk+ID0gaGFzRGF0YVxuICAgICAgICAgICAgICA/IHsgaWQsIGNoYW5nZXM6IHsgLi4uY2hhbmdlcywgLi4udXBkYXRlZEVudGl0eSB9LCBjaGFuZ2VkOiB0cnVlIH1cbiAgICAgICAgICAgICAgOiB7IGlkLCBjaGFuZ2VzLCBjaGFuZ2VkOiBmYWxzZSB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBzZXJ0KGRhdGEpLnBpcGUoXG4gICAgICAgICAgbWFwKCh1cHNlcnRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBzZXJ0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBzZXJ0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICByZXR1cm4gaGFzRGF0YSA/IHVwc2VydGVkRW50aXR5IDogZGF0YTsgLy8gZW5zdXJlIGEgcmV0dXJuZWQgZW50aXR5IHZhbHVlLlxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBlcnNpc3RlbmNlIGFjdGlvbiBcIiR7ZW50aXR5T3B9XCIgaXMgbm90IGltcGxlbWVudGVkLmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24sXG4gICAqIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvciQoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKGVycm9yOiBFcnJvcikgPT4gT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyb3I6IEVycm9yKSA9PlxuICAgICAgb2YodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZUVycm9yKGFjdGlvbikoZXJyb3IpKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWNhdXNlIEVudGl0eUFjdGlvbi5wYXlsb2FkLnNraXAgaXMgdHJ1ZSwgc2tpcCB0aGUgcGVyc2lzdGVuY2Ugc3RlcCBhbmRcbiAgICogcmV0dXJuIGEgc2NhbGFyIHN1Y2Nlc3MgYWN0aW9uIHRoYXQgbG9va3MgbGlrZSB0aGUgb3BlcmF0aW9uIHN1Y2NlZWRlZC5cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlU2tpcFN1Y2Nlc3MkKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIGNvbnN0IHN1Y2Nlc3NBY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihcbiAgICAgIG9yaWdpbmFsQWN0aW9uLFxuICAgICAge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgfVxuICAgICk7XG4gICAgLy8gQWx0aG91Z2ggcmV0dXJucyBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBvbmUgdGljayAoYnkgdXNpbmcgYSBwcm9taXNlKSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiBvZihzdWNjZXNzQWN0aW9uKS5waXBlKFxuICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICApO1xuICB9XG59XG4iXX0=