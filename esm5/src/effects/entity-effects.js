import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { asyncScheduler, Observable, of, race } from 'rxjs';
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
        this.cancel$ = this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map(function (action) { return action.payload.correlationId; }), filter(function (id) { return id != null; }));
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = this.actions.pipe(ofEntityOp(persistOps), mergeMap(function (action) { return _this.persist(action); }));
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
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], EntityEffects.prototype, "cancel$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], EntityEffects.prototype, "persist$", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdoRCxPQUFPLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRTlGLE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBZTtJQUNwQyxRQUFRLENBQUMsU0FBUztJQUNsQixRQUFRLENBQUMsVUFBVTtJQUNuQixRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRLENBQUMsVUFBVTtJQUNuQixRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRLENBQUMsZUFBZTtJQUN4QixRQUFRLENBQUMsZUFBZTtJQUN4QixRQUFRLENB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Q0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQzdELGNBQWMsRUFDZDtZQUNFLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQ0YsQ0FBQztRQUNGLGdDQUFnQztRQUNoQyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7SUExSkQ7UUFEQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7MENBQ25CLFVBQVU7a0RBSWpCO0lBSUY7UUFGQyxNQUFNLEVBQUU7MENBRUMsVUFBVTttREFHbEI7SUFwQlMsYUFBYTtRQUR6QixVQUFVLEVBQUU7UUFpQ1IsbUJBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixtQkFBQSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtpREFWaEIsT0FBTztZQUNILGlCQUFpQjtZQUNULG1CQUFtQjtZQUN6Qix3QkFBd0I7T0ExQnRDLGFBQWEsQ0FvS3pCO0lBQUQsb0JBQUM7Q0FBQSxBQXBLRCxJQW9LQztTQXBLWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2YsIHJhY2UsIFNjaGVkdWxlckxpa2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgRW50aXR5T3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBwZXJzaXN0T3BzOiBFbnRpdHlPcFtdID0gW1xuICBFbnRpdHlPcC5RVUVSWV9BTEwsXG4gIEVudGl0eU9wLlFVRVJZX0xPQUQsXG4gIEVudGl0eU9wLlFVRVJZX0JZX0tFWSxcbiAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2Ygbm9uLW51bGwgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uIGlkcyBmcm9tIENBTkNFTF9QRVJTSVNUIGFjdGlvbnNcbiAgICovXG4gIEBFZmZlY3QoeyBkaXNwYXRjaDogZmFsc2UgfSlcbiAgY2FuY2VsJDogT2JzZXJ2YWJsZTxhbnk+ID0gdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgb2ZFbnRpdHlPcChFbnRpdHlPcC5DQU5DRUxfUEVSU0lTVCksXG4gICAgbWFwKChhY3Rpb246IEVudGl0eUFjdGlvbikgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgZmlsdGVyKGlkID0+IGlkICE9IG51bGwpXG4gICk7XG5cbiAgQEVmZmVjdCgpXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHBlcnNpc3QkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSB0aGlzLmFjdGlvbnMucGlwZShcbiAgICBvZkVudGl0eU9wKHBlcnNpc3RPcHMpLFxuICAgIG1lcmdlTWFwKGFjdGlvbiA9PiB0aGlzLnBlcnNpc3QoYWN0aW9uKSlcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnM8RW50aXR5QWN0aW9uPixcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSByZXN1bHRIYW5kbGVyOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gQSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gRW50aXR5QWN0aW9uXG4gICAqL1xuICBwZXJzaXN0KGFjdGlvbjogRW50aXR5QWN0aW9uKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuc2tpcCkge1xuICAgICAgLy8gU2hvdWxkIG5vdCBwZXJzaXN0LiBQcmV0ZW5kIGl0IHN1Y2NlZWRlZC5cbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNraXBTdWNjZXNzJChhY3Rpb24pO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGFjdGlvbi5wYXlsb2FkLmVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlIG9mIENBTkNFTEVEX1BFUlNJU1QgZm9yIGEgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKGlkID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgPT09IGlkKSxcbiAgICAgICAgbWFwKGlkID0+XG4gICAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oYWN0aW9uLCB7XG4gICAgICAgICAgICBlbnRpdHlPcDogRW50aXR5T3AuQ0FOQ0VMRURfUEVSU0lTVCxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBlbnRpdHkgY29sbGVjdGlvbiBEYXRhU2VydmljZSByZXN1bHQgYXMgYSBzdWNjZXNzZnVsIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuY2FsbERhdGFTZXJ2aWNlKGFjdGlvbikucGlwZShcbiAgICAgICAgbWFwKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVTdWNjZXNzKGFjdGlvbikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGxEYXRhU2VydmljZShhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIGNvbnN0IHsgZW50aXR5TmFtZSwgZW50aXR5T3AsIGRhdGEgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldFNlcnZpY2UoZW50aXR5TmFtZSk7XG4gICAgc3dpdGNoIChlbnRpdHlPcCkge1xuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9BTEw6XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0xPQUQ6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEFsbCgpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0JZX0tFWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QnlJZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9NQU5ZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRXaXRoUXVlcnkoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9BRERfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5hZGQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5kZWxldGUoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FOlxuICAgICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhIGFzIFVwZGF0ZTxhbnk+OyAvLyBkYXRhIG11c3QgYmUgVXBkYXRlPFQ+XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwZGF0ZShkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCh1cGRhdGVkRW50aXR5ID0+IHtcbiAgICAgICAgICAgIC8vIFJldHVybiBhbiBVcGRhdGU8VD4gd2l0aCB1cGRhdGVkIGVudGl0eSBkYXRhLlxuICAgICAgICAgICAgLy8gSWYgc2VydmVyIHJldHVybmVkIGVudGl0eSBkYXRhLCBtZXJnZSB3aXRoIHRoZSBjaGFuZ2VzIHRoYXQgd2VyZSBzZW50XG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSAnY2hhbmdlZCcgZmxhZyB0byB0cnVlLlxuICAgICAgICAgICAgLy8gSWYgc2VydmVyIGRpZCBub3QgcmV0dXJuIGVudGl0eSBkYXRhLFxuICAgICAgICAgICAgLy8gYXNzdW1lIGl0IG1hZGUgbm8gYWRkaXRpb25hbCBjaGFuZ2VzIG9mIGl0cyBvd24sIHJldHVybiB0aGUgb3JpZ2luYWwgY2hhbmdlcyxcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlIGBjaGFuZ2VkYCBmbGFnIHRvIGBmYWxzZWAuXG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBkYXRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cGRhdGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8YW55PiA9IGhhc0RhdGFcbiAgICAgICAgICAgICAgPyB7IGlkLCBjaGFuZ2VzOiB7IC4uLmNoYW5nZXMsIC4uLnVwZGF0ZWRFbnRpdHkgfSwgY2hhbmdlZDogdHJ1ZSB9XG4gICAgICAgICAgICAgIDogeyBpZCwgY2hhbmdlcywgY2hhbmdlZDogZmFsc2UgfTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZURhdGE7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX1VQU0VSVF9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwc2VydChkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCh1cHNlcnRlZEVudGl0eSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBzZXJ0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBzZXJ0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICByZXR1cm4gaGFzRGF0YSA/IHVwc2VydGVkRW50aXR5IDogZGF0YTsgLy8gZW5zdXJlIGEgcmV0dXJuZWQgZW50aXR5IHZhbHVlLlxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBlcnNpc3RlbmNlIGFjdGlvbiBcIiR7ZW50aXR5T3B9XCIgaXMgbm90IGltcGxlbWVudGVkLmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24sXG4gICAqIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvciQoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKGVycm9yOiBFcnJvcikgPT4gT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyb3I6IEVycm9yKSA9PlxuICAgICAgb2YodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZUVycm9yKGFjdGlvbikoZXJyb3IpKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWNhdXNlIEVudGl0eUFjdGlvbi5wYXlsb2FkLnNraXAgaXMgdHJ1ZSwgc2tpcCB0aGUgcGVyc2lzdGVuY2Ugc3RlcCBhbmRcbiAgICogcmV0dXJuIGEgc2NhbGFyIHN1Y2Nlc3MgYWN0aW9uIHRoYXQgbG9va3MgbGlrZSB0aGUgb3BlcmF0aW9uIHN1Y2NlZWRlZC5cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlU2tpcFN1Y2Nlc3MkKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIGNvbnN0IHN1Y2Nlc3NBY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihcbiAgICAgIG9yaWdpbmFsQWN0aW9uLFxuICAgICAge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgfVxuICAgICk7XG4gICAgLy8gQWx0aG91Z2ggcmV0dXJucyBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBvbmUgdGljayAoYnkgdXNpbmcgYSBwcm9taXNlKSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiBvZihzdWNjZXNzQWN0aW9uKS5waXBlKFxuICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICApO1xuICB9XG59XG4iXX0=