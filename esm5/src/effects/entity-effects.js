import * as tslib_1 from "tslib";
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
export var persistOps = [
    EntityOp.QUERY_ALL,
    EntityOp.QUERY_LOAD,
    EntityOp.QUERY_BY_KEY,
    EntityOp.QUERY_MANY,
    EntityOp.SAVE_ADD_ONE,
    EntityOp.SAVE_DELETE_ONE,
    EntityOp.SAVE_UPDATE_ONE,
    EntityOp.SAVE_UPSERT_ONE,
];
var EntityEffects = /** @class */ (function () {
    function EntityEffects(actions, dataService, entityActionFactory, resultHandler, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        var _this = this;
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
        this.cancel$ = createEffect(function () {
            return _this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map(function (action) { return action.payload.correlationId; }), filter(function (id) { return id != null; }));
        }, { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect(function () {
            return _this.actions.pipe(ofEntityOp(persistOps), mergeMap(function (action) { return _this.persist(action); }));
        });
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation EntityAction
     */
    EntityEffects.prototype.persist = function (action) {
        var _this = this;
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
            var c = this.cancel$.pipe(filter(function (id) { return action.payload.correlationId === id; }), map(function (id) {
                return _this.entityActionFactory.createFromAction(action, {
                    entityOp: EntityOp.CANCELED_PERSIST,
                });
            }));
            // Data: entity collection DataService result as a successful persistence EntityAction
            var d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    };
    EntityEffects.prototype.callDataService = function (action) {
        var _a = action.payload, entityName = _a.entityName, entityOp = _a.entityOp, data = _a.data;
        var service = this.dataService.getService(entityName);
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
                var _b = data, id_1 = _b.id, changes_1 = _b.changes; // data must be Update<T>
                return service.update(data).pipe(map(function (updatedEntity) {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    var hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    var responseData = hasData
                        ? { id: id_1, changes: tslib_1.__assign({}, changes_1, updatedEntity), changed: true }
                        : { id: id_1, changes: changes_1, changed: false };
                    return responseData;
                }));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(map(function (upsertedEntity) {
                    var hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                }));
            default:
                throw new Error("Persistence action \"" + entityOp + "\" is not implemented.");
        }
    };
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     */
    EntityEffects.prototype.handleError$ = function (action) {
        var _this = this;
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return function (error) {
            return of(_this.resultHandler.handleError(action)(error)).pipe(delay(_this.responseDelay, _this.scheduler || asyncScheduler));
        };
    };
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    EntityEffects.prototype.handleSkipSuccess$ = function (originalAction) {
        var successOp = makeSuccessOp(originalAction.payload.entityOp);
        var successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    };
    EntityEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(4, Optional()),
        tslib_1.__param(4, Inject(ENTITY_EFFECTS_SCHEDULER)),
        tslib_1.__metadata("design:paramtypes", [Actions,
            EntityDataService,
            EntityActionFactory,
            PersistenceResultHandler, Object])
    ], EntityEffects);
    return EntityEffects;
}());
export { EntityEffects };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd0RCxPQUFPLEVBQUUsY0FBYyxFQUFjLEVBQUUsRUFBRSxJQUFJLEVBQWlCLE1BQU0sTUFBTSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFFOUYsTUFBTSxDQUFDLElBQU0sVUFBVSxHQUFlO0lBQ3BDLFFBQVEsQ0FBQyxTQUFTO0lBQ2xCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0NB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QUVEOzs7T0FHRztJQUNLLDBDQUFrQixHQUExQixVQUNFLGNBQTRCO1FBRTVCLElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDN0QsY0FBYyxFQUNkO1lBQ0UsUUFBUSxFQUFFLFNBQVM7U0FDcEIsQ0FDRixDQUFDO1FBQ0YsZ0NBQWdDO1FBQ2hDLHlEQUF5RDtRQUN6RCwrQ0FBK0M7UUFDL0MsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLGNBQWMsQ0FBQyxDQUM1RCxDQUFDO0lBQ0osQ0FBQztJQXZLVSxhQUFhO1FBRHpCLFVBQVUsRUFBRTtRQXFDUixtQkFBQSxRQUFRLEVBQUUsQ0FBQTtRQUNWLG1CQUFBLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO2lEQVZoQixPQUFPO1lBQ0gsaUJBQWlCO1lBQ1QsbUJBQW1CO1lBQ3pCLHdCQUF3QjtPQTlCdEMsYUFBYSxDQXdLekI7SUFBRCxvQkFBQztDQUFBLEFBeEtELElBd0tDO1NBeEtZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBjcmVhdGVFZmZlY3QgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IGFzeW5jU2NoZWR1bGVyLCBPYnNlcnZhYmxlLCBvZiwgcmFjZSwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZGVsYXksIGZpbHRlciwgbWFwLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBFbnRpdHlPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IG9mRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tb3BlcmF0b3JzJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9lbnRpdHktZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IHBlcnNpc3RPcHM6IEVudGl0eU9wW10gPSBbXG4gIEVudGl0eU9wLlFVRVJZX0FMTCxcbiAgRW50aXR5T3AuUVVFUllfTE9BRCxcbiAgRW50aXR5T3AuUVVFUllfQllfS0VZLFxuICBFbnRpdHlPcC5RVUVSWV9NQU5ZLFxuICBFbnRpdHlPcC5TQVZFX0FERF9PTkUsXG4gIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkUsXG5dO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSBvZiBub24tbnVsbCBjYW5jZWxsYXRpb24gY29ycmVsYXRpb24gaWRzIGZyb20gQ0FOQ0VMX1BFUlNJU1QgYWN0aW9uc1xuICAgKi9cbiAgY2FuY2VsJDogT2JzZXJ2YWJsZTxhbnk+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZFbnRpdHlPcChFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVCksXG4gICAgICAgIG1hcCgoYWN0aW9uOiBFbnRpdHlBY3Rpb24pID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBmaWx0ZXIoaWQgPT4gaWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHBlcnNpc3QkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mRW50aXR5T3AocGVyc2lzdE9wcyksXG4gICAgICBtZXJnZU1hcChhY3Rpb24gPT4gdGhpcy5wZXJzaXN0KGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uczxFbnRpdHlBY3Rpb24+LFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIHJlc3VsdEhhbmRsZXI6IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBBIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBFbnRpdHlBY3Rpb25cbiAgICovXG4gIHBlcnNpc3QoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5za2lwKSB7XG4gICAgICAvLyBTaG91bGQgbm90IHBlcnNpc3QuIFByZXRlbmQgaXQgc3VjY2VlZGVkLlxuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2tpcFN1Y2Nlc3MkKGFjdGlvbik7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5lcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoYWN0aW9uLnBheWxvYWQuZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGUgb2YgQ0FOQ0VMRURfUEVSU0lTVCBmb3IgYSBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuY2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoaWQgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCA9PT0gaWQpLFxuICAgICAgICBtYXAoaWQgPT5cbiAgICAgICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihhY3Rpb24sIHtcbiAgICAgICAgICAgIGVudGl0eU9wOiBFbnRpdHlPcC5DQU5DRUxFRF9QRVJTSVNULFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IGVudGl0eSBjb2xsZWN0aW9uIERhdGFTZXJ2aWNlIHJlc3VsdCBhcyBhIHN1Y2Nlc3NmdWwgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5jYWxsRGF0YVNlcnZpY2UoYWN0aW9uKS5waXBlKFxuICAgICAgICBtYXAodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZVN1Y2Nlc3MoYWN0aW9uKSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FsbERhdGFTZXJ2aWNlKGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgY29uc3QgeyBlbnRpdHlOYW1lLCBlbnRpdHlPcCwgZGF0YSB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0U2VydmljZShlbnRpdHlOYW1lKTtcbiAgICBzd2l0Y2ggKGVudGl0eU9wKSB7XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0FMTDpcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTE9BRDpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QWxsKCk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQllfS0VZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRCeUlkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX01BTlk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldFdpdGhRdWVyeShkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0FERF9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmFkZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmRlbGV0ZShkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkU6XG4gICAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGEgYXMgVXBkYXRlPGFueT47IC8vIGRhdGEgbXVzdCBiZSBVcGRhdGU8VD5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBkYXRlKGRhdGEpLnBpcGUoXG4gICAgICAgICAgbWFwKHVwZGF0ZWRFbnRpdHkgPT4ge1xuICAgICAgICAgICAgLy8gUmV0dXJuIGFuIFVwZGF0ZTxUPiB3aXRoIHVwZGF0ZWQgZW50aXR5IGRhdGEuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgcmV0dXJuZWQgZW50aXR5IGRhdGEsIG1lcmdlIHdpdGggdGhlIGNoYW5nZXMgdGhhdCB3ZXJlIHNlbnRcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlICdjaGFuZ2VkJyBmbGFnIHRvIHRydWUuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgZGlkIG5vdCByZXR1cm4gZW50aXR5IGRhdGEsXG4gICAgICAgICAgICAvLyBhc3N1bWUgaXQgbWFkZSBubyBhZGRpdGlvbmFsIGNoYW5nZXMgb2YgaXRzIG93biwgcmV0dXJuIHRoZSBvcmlnaW5hbCBjaGFuZ2VzLFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgYGNoYW5nZWRgIGZsYWcgdG8gYGZhbHNlYC5cbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cGRhdGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwZGF0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxhbnk+ID0gaGFzRGF0YVxuICAgICAgICAgICAgICA/IHsgaWQsIGNoYW5nZXM6IHsgLi4uY2hhbmdlcywgLi4udXBkYXRlZEVudGl0eSB9LCBjaGFuZ2VkOiB0cnVlIH1cbiAgICAgICAgICAgICAgOiB7IGlkLCBjaGFuZ2VzLCBjaGFuZ2VkOiBmYWxzZSB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBzZXJ0KGRhdGEpLnBpcGUoXG4gICAgICAgICAgbWFwKHVwc2VydGVkRW50aXR5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cHNlcnRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cHNlcnRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHJldHVybiBoYXNEYXRhID8gdXBzZXJ0ZWRFbnRpdHkgOiBkYXRhOyAvLyBlbnN1cmUgYSByZXR1cm5lZCBlbnRpdHkgdmFsdWUuXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUGVyc2lzdGVuY2UgYWN0aW9uIFwiJHtlbnRpdHlPcH1cIiBpcyBub3QgaW1wbGVtZW50ZWQuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbixcbiAgICogcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZUVycm9yJChcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoZXJyb3I6IEVycm9yKSA9PiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnJvcjogRXJyb3IpID0+XG4gICAgICBvZih0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlRXJyb3IoYWN0aW9uKShlcnJvcikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlY2F1c2UgRW50aXR5QWN0aW9uLnBheWxvYWQuc2tpcCBpcyB0cnVlLCBza2lwIHRoZSBwZXJzaXN0ZW5jZSBzdGVwIGFuZFxuICAgKiByZXR1cm4gYSBzY2FsYXIgc3VjY2VzcyBhY3Rpb24gdGhhdCBsb29rcyBsaWtlIHRoZSBvcGVyYXRpb24gc3VjY2VlZGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTa2lwU3VjY2VzcyQoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgY29uc3Qgc3VjY2Vzc0FjdGlvbiA9IHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKFxuICAgICAgb3JpZ2luYWxBY3Rpb24sXG4gICAgICB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICB9XG4gICAgKTtcbiAgICAvLyBBbHRob3VnaCByZXR1cm5zIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIG9uZSB0aWNrIChieSB1c2luZyBhIHByb21pc2UpLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIG9mKHN1Y2Nlc3NBY3Rpb24pLnBpcGUoXG4gICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==