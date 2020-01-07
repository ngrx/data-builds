/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/effects/entity-effects.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @type {?} */
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
    /**
     * @param {?} actions
     * @param {?} dataService
     * @param {?} entityActionFactory
     * @param {?} resultHandler
     * @param {?} scheduler
     */
    constructor(actions, dataService, entityActionFactory, resultHandler, scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.resultHandler = resultHandler;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /**
         * Delay for error and skip observables. Must be multiple of 10 for marble testing.
         */
        this.responseDelay = 10;
        /**
         * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
         */
        this.cancel$ = createEffect((/**
         * @return {?}
         */
        () => this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((/**
         * @param {?} action
         * @return {?}
         */
        (action) => action.payload.correlationId)), filter((/**
         * @param {?} id
         * @return {?}
         */
        id => id != null)))), { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect((/**
         * @return {?}
         */
        () => this.actions.pipe(ofEntityOp(persistOps), mergeMap((/**
         * @param {?} action
         * @return {?}
         */
        action => this.persist(action))))));
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action A persistence operation EntityAction
     * @return {?}
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
            /** @type {?} */
            const c = this.cancel$.pipe(filter((/**
             * @param {?} id
             * @return {?}
             */
            id => action.payload.correlationId === id)), map((/**
             * @param {?} id
             * @return {?}
             */
            id => this.entityActionFactory.createFromAction(action, {
                entityOp: EntityOp.CANCELED_PERSIST,
            }))));
            // Data: entity collection DataService result as a successful persistence EntityAction
            /** @type {?} */
            const d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    }
    /**
     * @private
     * @param {?} action
     * @return {?}
     */
    callDataService(action) {
        const { entityName, entityOp, data } = action.payload;
        /** @type {?} */
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
                const { id, changes } = (/** @type {?} */ (data));
                return service.update(data).pipe(map((/**
                 * @param {?} updatedEntity
                 * @return {?}
                 */
                (updatedEntity) => {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    /** @type {?} */
                    const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    /** @type {?} */
                    const responseData = hasData
                        ? { id, changes: Object.assign(Object.assign({}, changes), updatedEntity), changed: true }
                        : { id, changes, changed: false };
                    return responseData;
                })));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(map((/**
                 * @param {?} upsertedEntity
                 * @return {?}
                 */
                (upsertedEntity) => {
                    /** @type {?} */
                    const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                })));
            default:
                throw new Error(`Persistence action "${entityOp}" is not implemented.`);
        }
    }
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     * @private
     * @param {?} action
     * @return {?}
     */
    handleError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (/**
         * @param {?} error
         * @return {?}
         */
        (error) => of(this.resultHandler.handleError(action)(error)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler)));
    }
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     * @private
     * @param {?} originalAction
     * @return {?}
     */
    handleSkipSuccess$(originalAction) {
        /** @type {?} */
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        /** @type {?} */
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
if (false) {
    /**
     * Delay for error and skip observables. Must be multiple of 10 for marble testing.
     * @type {?}
     * @private
     */
    EntityEffects.prototype.responseDelay;
    /**
     * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
     * @type {?}
     */
    EntityEffects.prototype.cancel$;
    /** @type {?} */
    EntityEffects.prototype.persist$;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.actions;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.dataService;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.entityActionFactory;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.resultHandler;
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     * @type {?}
     * @private
     */
    EntityEffects.prototype.scheduler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdEQsT0FBTyxFQUFFLGNBQWMsRUFBYyxFQUFFLEVBQUUsSUFBSSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDOztBQUU5RixNQUFNLE9BQU8sVUFBVSxHQUFlO0lBQ3BDLFFBQVEsQ0FBQyxTQUFTO0lBQ2xCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0NBQ3pCO0FBR0Qs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QUFTLElBQUksY0FBYyxDQUFDLENBQzVELENBQUM7SUFDSixDQUFDOzs7WUF4S0YsVUFBVTs7OztZQTNCRixPQUFPO1lBYVAsaUJBQWlCO1lBTmpCLG1CQUFtQjtZQU9uQix3QkFBd0I7NENBa0Q1QixRQUFRLFlBQ1IsTUFBTSxTQUFDLHdCQUF3Qjs7Ozs7Ozs7SUFsQ2xDLHNDQUEyQjs7Ozs7SUFLM0IsZ0NBUUU7O0lBR0YsaUNBS0U7Ozs7O0lBR0EsZ0NBQXNDOzs7OztJQUN0QyxvQ0FBc0M7Ozs7O0lBQ3RDLDRDQUFnRDs7Ozs7SUFDaEQsc0NBQStDOzs7Ozs7OztJQU0vQyxrQ0FFZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBjcmVhdGVFZmZlY3QgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IGFzeW5jU2NoZWR1bGVyLCBPYnNlcnZhYmxlLCBvZiwgcmFjZSwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIGZpbHRlciwgbWFwLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBFbnRpdHlPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IG9mRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tb3BlcmF0b3JzJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9lbnRpdHktZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IHBlcnNpc3RPcHM6IEVudGl0eU9wW10gPSBbXG4gIEVudGl0eU9wLlFVRVJZX0FMTCxcbiAgRW50aXR5T3AuUVVFUllfTE9BRCxcbiAgRW50aXR5T3AuUVVFUllfQllfS0VZLFxuICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICBFbnRpdHlPcC5TQVZFX0FERF9PTkUsXG4gIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkUsXG5dO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSBvZiBub24tbnVsbCBjYW5jZWxsYXRpb24gY29ycmVsYXRpb24gaWRzIGZyb20gQ0FOQ0VMX1BFUlNJU1QgYWN0aW9uc1xuICAgKi9cbiAgY2FuY2VsJDogT2JzZXJ2YWJsZTxhbnk+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZFbnRpdHlPcChFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVCksXG4gICAgICAgIG1hcCgoYWN0aW9uOiBFbnRpdHlBY3Rpb24pID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBmaWx0ZXIoaWQgPT4gaWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHBlcnNpc3QkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mRW50aXR5T3AocGVyc2lzdE9wcyksXG4gICAgICBtZXJnZU1hcChhY3Rpb24gPT4gdGhpcy5wZXJzaXN0KGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uczxFbnRpdHlBY3Rpb24+LFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIHJlc3VsdEhhbmRsZXI6IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBBIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBFbnRpdHlBY3Rpb25cbiAgICovXG4gIHBlcnNpc3QoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5za2lwKSB7XG4gICAgICAvLyBTaG91bGQgbm90IHBlcnNpc3QuIFByZXRlbmQgaXQgc3VjY2VlZGVkLlxuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2tpcFN1Y2Nlc3MkKGFjdGlvbik7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5lcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoYWN0aW9uLnBheWxvYWQuZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGUgb2YgQ0FOQ0VMRURfUEVSU0lTVCBmb3IgYSBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuY2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoaWQgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCA9PT0gaWQpLFxuICAgICAgICBtYXAoaWQgPT5cbiAgICAgICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihhY3Rpb24sIHtcbiAgICAgICAgICAgIGVudGl0eU9wOiBFbnRpdHlPcC5DQU5DRUxFRF9QRVJTSVNULFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IGVudGl0eSBjb2xsZWN0aW9uIERhdGFTZXJ2aWNlIHJlc3VsdCBhcyBhIHN1Y2Nlc3NmdWwgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5jYWxsRGF0YVNlcnZpY2UoYWN0aW9uKS5waXBlKFxuICAgICAgICBtYXAodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZVN1Y2Nlc3MoYWN0aW9uKSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FsbERhdGFTZXJ2aWNlKGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgY29uc3QgeyBlbnRpdHlOYW1lLCBlbnRpdHlPcCwgZGF0YSB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0U2VydmljZShlbnRpdHlOYW1lKTtcbiAgICBzd2l0Y2ggKGVudGl0eU9wKSB7XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0FMTDpcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTE9BRDpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QWxsKCk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQllfS0VZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRCeUlkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX01BTlk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldFdpdGhRdWVyeShkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0FERF9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmFkZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmRlbGV0ZShkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkU6XG4gICAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGEgYXMgVXBkYXRlPGFueT47IC8vIGRhdGEgbXVzdCBiZSBVcGRhdGU8VD5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBkYXRlKGRhdGEpLnBpcGUoXG4gICAgICAgICAgbWFwKCh1cGRhdGVkRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vIFJldHVybiBhbiBVcGRhdGU8VD4gd2l0aCB1cGRhdGVkIGVudGl0eSBkYXRhLlxuICAgICAgICAgICAgLy8gSWYgc2VydmVyIHJldHVybmVkIGVudGl0eSBkYXRhLCBtZXJnZSB3aXRoIHRoZSBjaGFuZ2VzIHRoYXQgd2VyZSBzZW50XG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSAnY2hhbmdlZCcgZmxhZyB0byB0cnVlLlxuICAgICAgICAgICAgLy8gSWYgc2VydmVyIGRpZCBub3QgcmV0dXJuIGVudGl0eSBkYXRhLFxuICAgICAgICAgICAgLy8gYXNzdW1lIGl0IG1hZGUgbm8gYWRkaXRpb25hbCBjaGFuZ2VzIG9mIGl0cyBvd24sIHJldHVybiB0aGUgb3JpZ2luYWwgY2hhbmdlcyxcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlIGBjaGFuZ2VkYCBmbGFnIHRvIGBmYWxzZWAuXG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBkYXRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cGRhdGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8YW55PiA9IGhhc0RhdGFcbiAgICAgICAgICAgICAgPyB7IGlkLCBjaGFuZ2VzOiB7IC4uLmNoYW5nZXMsIC4uLnVwZGF0ZWRFbnRpdHkgfSwgY2hhbmdlZDogdHJ1ZSB9XG4gICAgICAgICAgICAgIDogeyBpZCwgY2hhbmdlcywgY2hhbmdlZDogZmFsc2UgfTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZURhdGE7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwc2VydChkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBzZXJ0ZWRFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwc2VydGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwc2VydGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIGhhc0RhdGEgPyB1cHNlcnRlZEVudGl0eSA6IGRhdGE7IC8vIGVuc3VyZSBhIHJldHVybmVkIGVudGl0eSB2YWx1ZS5cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQZXJzaXN0ZW5jZSBhY3Rpb24gXCIke2VudGl0eU9wfVwiIGlzIG5vdCBpbXBsZW1lbnRlZC5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uLFxuICAgKiByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IkKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChlcnJvcjogRXJyb3IpID0+IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycm9yOiBFcnJvcikgPT5cbiAgICAgIG9mKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVFcnJvcihhY3Rpb24pKGVycm9yKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQmVjYXVzZSBFbnRpdHlBY3Rpb24ucGF5bG9hZC5za2lwIGlzIHRydWUsIHNraXAgdGhlIHBlcnNpc3RlbmNlIHN0ZXAgYW5kXG4gICAqIHJldHVybiBhIHNjYWxhciBzdWNjZXNzIGFjdGlvbiB0aGF0IGxvb2tzIGxpa2UgdGhlIG9wZXJhdGlvbiBzdWNjZWVkZWQuXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZVNraXBTdWNjZXNzJChcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICBjb25zdCBzdWNjZXNzQWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oXG4gICAgICBvcmlnaW5hbEFjdGlvbixcbiAgICAgIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEFsdGhvdWdoIHJldHVybnMgaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgb25lIHRpY2sgKGJ5IHVzaW5nIGEgcHJvbWlzZSksXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gb2Yoc3VjY2Vzc0FjdGlvbikucGlwZShcbiAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgKTtcbiAgfVxufVxuIl19