import { __assign, __decorate, __metadata, __param } from "tslib";
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
                        ? { id: id_1, changes: __assign(__assign({}, changes_1), updatedEntity), changed: true }
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
    EntityEffects = __decorate([
        Injectable(),
        __param(4, Optional()),
        __param(4, Inject(ENTITY_EFFECTS_SCHEDULER)),
        __metadata("design:paramtypes", [Actions,
            EntityDataService,
            EntityActionFactory,
            PersistenceResultHandler, Object])
    ], EntityEffects);
    return EntityEffects;
}());
export { EntityEffects };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd0RCxPQUFPLEVBQUUsY0FBYyxFQUFjLEVBQUUsRUFBRSxJQUFJLEVBQWlCLE1BQU0sTUFBTSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFFOUYsTUFBTSxDQUFDLElBQU0sVUFBVSxHQUFlO0lBQ3BDLFFBQVEsQ0FBQyxTQUFTO0lBQ2xCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0NB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QztJQUVEOzs7T0FHRztJQUNLLDBDQUFrQixHQUExQixVQUNFLGNBQTRCO1FBRTVCLElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FDN0QsY0FBYyxFQUNkO1lBQ0UsUUFBUSxFQUFFLFNBQVM7U0FDcEIsQ0FDRixDQUFDO1FBQ0YsZ0NBQWdDO1FBQ2hDLHlEQUF5RDtRQUN6RCwrQ0FBK0M7UUFDL0MsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLGNBQWMsQ0FBQyxDQUM1RCxDQUFDO0lBQ0osQ0FBQztJQXZLVSxhQUFhO1FBRHpCLFVBQVUsRUFBRTtRQXFDUixXQUFBLFFBQVEsRUFBRSxDQUFBO1FBQ1YsV0FBQSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQTt5Q0FWaEIsT0FBTztZQUNILGlCQUFpQjtZQUNULG1CQUFtQjtZQUN6Qix3QkFBd0I7T0E5QnRDLGFBQWEsQ0F3S3pCO0lBQUQsb0JBQUM7Q0FBQSxBQXhLRCxJQXdLQztTQXhLWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2YsIHJhY2UsIFNjaGVkdWxlckxpa2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgRW50aXR5T3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBwZXJzaXN0T3BzOiBFbnRpdHlPcFtdID0gW1xuICBFbnRpdHlPcC5RVUVSWV9BTEwsXG4gIEVudGl0eU9wLlFVRVJZX0xPQUQsXG4gIEVudGl0eU9wLlFVRVJZX0JZX0tFWSxcbiAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2Ygbm9uLW51bGwgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uIGlkcyBmcm9tIENBTkNFTF9QRVJTSVNUIGFjdGlvbnNcbiAgICovXG4gIGNhbmNlbCQ6IE9ic2VydmFibGU8YW55PiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mRW50aXR5T3AoRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpLFxuICAgICAgICBtYXAoKGFjdGlvbjogRW50aXR5QWN0aW9uKSA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgZmlsdGVyKGlkID0+IGlkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBwZXJzaXN0JDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZkVudGl0eU9wKHBlcnNpc3RPcHMpLFxuICAgICAgbWVyZ2VNYXAoYWN0aW9uID0+IHRoaXMucGVyc2lzdChhY3Rpb24pKVxuICAgIClcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnM8RW50aXR5QWN0aW9uPixcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSByZXN1bHRIYW5kbGVyOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gQSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gRW50aXR5QWN0aW9uXG4gICAqL1xuICBwZXJzaXN0KGFjdGlvbjogRW50aXR5QWN0aW9uKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuc2tpcCkge1xuICAgICAgLy8gU2hvdWxkIG5vdCBwZXJzaXN0LiBQcmV0ZW5kIGl0IHN1Y2NlZWRlZC5cbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNraXBTdWNjZXNzJChhY3Rpb24pO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGFjdGlvbi5wYXlsb2FkLmVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlIG9mIENBTkNFTEVEX1BFUlNJU1QgZm9yIGEgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKGlkID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgPT09IGlkKSxcbiAgICAgICAgbWFwKGlkID0+XG4gICAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oYWN0aW9uLCB7XG4gICAgICAgICAgICBlbnRpdHlPcDogRW50aXR5T3AuQ0FOQ0VMRURfUEVSU0lTVCxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBlbnRpdHkgY29sbGVjdGlvbiBEYXRhU2VydmljZSByZXN1bHQgYXMgYSBzdWNjZXNzZnVsIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuY2FsbERhdGFTZXJ2aWNlKGFjdGlvbikucGlwZShcbiAgICAgICAgbWFwKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVTdWNjZXNzKGFjdGlvbikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGxEYXRhU2VydmljZShhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIGNvbnN0IHsgZW50aXR5TmFtZSwgZW50aXR5T3AsIGRhdGEgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldFNlcnZpY2UoZW50aXR5TmFtZSk7XG4gICAgc3dpdGNoIChlbnRpdHlPcCkge1xuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9BTEw6XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0xPQUQ6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEFsbCgpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0JZX0tFWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QnlJZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9NQU5ZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRXaXRoUXVlcnkoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9BRERfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5hZGQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5kZWxldGUoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FOlxuICAgICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhIGFzIFVwZGF0ZTxhbnk+OyAvLyBkYXRhIG11c3QgYmUgVXBkYXRlPFQ+XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwZGF0ZShkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBkYXRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gYW4gVXBkYXRlPFQ+IHdpdGggdXBkYXRlZCBlbnRpdHkgZGF0YS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciByZXR1cm5lZCBlbnRpdHkgZGF0YSwgbWVyZ2Ugd2l0aCB0aGUgY2hhbmdlcyB0aGF0IHdlcmUgc2VudFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgJ2NoYW5nZWQnIGZsYWcgdG8gdHJ1ZS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YSxcbiAgICAgICAgICAgIC8vIGFzc3VtZSBpdCBtYWRlIG5vIGFkZGl0aW9uYWwgY2hhbmdlcyBvZiBpdHMgb3duLCByZXR1cm4gdGhlIG9yaWdpbmFsIGNoYW5nZXMsXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSBgY2hhbmdlZGAgZmxhZyB0byBgZmFsc2VgLlxuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwZGF0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBkYXRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPGFueT4gPSBoYXNEYXRhXG4gICAgICAgICAgICAgID8geyBpZCwgY2hhbmdlczogeyAuLi5jaGFuZ2VzLCAuLi51cGRhdGVkRW50aXR5IH0sIGNoYW5nZWQ6IHRydWUgfVxuICAgICAgICAgICAgICA6IHsgaWQsIGNoYW5nZXMsIGNoYW5nZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS51cHNlcnQoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAoKHVwc2VydGVkRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cHNlcnRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cHNlcnRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHJldHVybiBoYXNEYXRhID8gdXBzZXJ0ZWRFbnRpdHkgOiBkYXRhOyAvLyBlbnN1cmUgYSByZXR1cm5lZCBlbnRpdHkgdmFsdWUuXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUGVyc2lzdGVuY2UgYWN0aW9uIFwiJHtlbnRpdHlPcH1cIiBpcyBub3QgaW1wbGVtZW50ZWQuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbixcbiAgICogcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZUVycm9yJChcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoZXJyb3I6IEVycm9yKSA9PiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnJvcjogRXJyb3IpID0+XG4gICAgICBvZih0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlRXJyb3IoYWN0aW9uKShlcnJvcikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlY2F1c2UgRW50aXR5QWN0aW9uLnBheWxvYWQuc2tpcCBpcyB0cnVlLCBza2lwIHRoZSBwZXJzaXN0ZW5jZSBzdGVwIGFuZFxuICAgKiByZXR1cm4gYSBzY2FsYXIgc3VjY2VzcyBhY3Rpb24gdGhhdCBsb29rcyBsaWtlIHRoZSBvcGVyYXRpb24gc3VjY2VlZGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTa2lwU3VjY2VzcyQoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgY29uc3Qgc3VjY2Vzc0FjdGlvbiA9IHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKFxuICAgICAgb3JpZ2luYWxBY3Rpb24sXG4gICAgICB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICB9XG4gICAgKTtcbiAgICAvLyBBbHRob3VnaCByZXR1cm5zIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIG9uZSB0aWNrIChieSB1c2luZyBhIHByb21pc2UpLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIG9mKHN1Y2Nlc3NBY3Rpb24pLnBpcGUoXG4gICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==