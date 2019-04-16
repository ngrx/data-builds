import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { asyncScheduler, Observable, of, merge, race, } from 'rxjs';
import { concatMap, catchError, delay, filter, map, mergeMap, } from 'rxjs/operators';
import { DataServiceError } from '../dataservices/data-service-error';
import { excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityOp } from '../actions/entity-op';
import { EntityCacheAction, SaveEntitiesCanceled, SaveEntitiesError, SaveEntitiesSuccess, } from '../actions/entity-cache-action';
import { EntityCacheDataService } from '../dataservices/entity-cache-data.service';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { Logger } from '../utils/interfaces';
var EntityCacheEffects = /** @class */ (function () {
    function EntityCacheEffects(actions, dataService, entityActionFactory, logger, 
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
        this.logger = logger;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         */
        this.saveEntitiesCancel$ = this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter(function (a) { return a.payload.correlationId != null; }));
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap(function (action) { return _this.saveEntities(action); }));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    EntityCacheEffects.prototype.saveEntities = function (action) {
        var _this = this;
        var error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            var changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            var _a = action.payload, correlationId_1 = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag, url = _a.url;
            var options = { correlationId: correlationId_1, mergeStrategy: mergeStrategy, tag: tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            var c = this.saveEntitiesCancel$.pipe(filter(function (a) { return correlationId_1 === a.payload.correlationId; }), map(function (a) {
                return new SaveEntitiesCanceled(correlationId_1, a.payload.reason, a.payload.tag);
            }));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            var d = this.dataService.saveEntities(changeSet, url).pipe(concatMap(function (result) {
                return _this.handleSaveEntitiesSuccess$(action, _this.entityActionFactory)(result);
            }), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    };
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    EntityCacheEffects.prototype.handleSaveEntitiesError$ = function (action) {
        var _this = this;
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return function (err) {
            var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(_this.responseDelay, _this.scheduler || asyncScheduler));
        };
    };
    /** return handler of the ChangeSet result of successful saveEntities() */
    EntityCacheEffects.prototype.handleSaveEntitiesSuccess$ = function (action, entityActionFactory) {
        var _a = action.payload, url = _a.url, correlationId = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
        var options = { correlationId: correlationId, mergeStrategy: mergeStrategy, tag: tag };
        return function (changeSet) {
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
            var entityNames = changeSet.changes.reduce(function (acc, item) {
                return acc.indexOf(item.entityName) === -1
                    ? acc.concat(item.entityName)
                    : acc;
            }, []);
            return merge(entityNames.map(function (name) {
                return entityActionFactory.create(name, EntityOp.SET_LOADING, false);
            }));
        };
    };
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Observable)
    ], EntityCacheEffects.prototype, "saveEntitiesCancel$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Observable)
    ], EntityCacheEffects.prototype, "saveEntities$", void 0);
    EntityCacheEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(4, Optional()),
        tslib_1.__param(4, Inject(ENTITY_EFFECTS_SCHEDULER)),
        tslib_1.__metadata("design:paramtypes", [Actions,
            EntityCacheDataService,
            EntityActionFactory,
            Logger, Object])
    ], EntityCacheEffects);
    return EntityCacheEffects;
}());
export { EntityCacheEffects };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFeEQsT0FBTyxFQUNMLGNBQWMsRUFDZCxVQUFVLEVBQ1YsRUFBRSxFQUNGLEtBQUssRUFDTCxJQUFJLEdBRUwsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEdBQ1QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBRUwsMEJBQTBCLEdBQzNCLE1BQU0sb0NBQW9DLENBQUM7QUFDNUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFDTCxpQkFBaUIsRUFHakIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFJN0M7SUFLRSw0QkFDVSxPQUFnQixFQUNoQixX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QUFBO2lEQVZoQixPQUFPO1lBQ0gsc0JBQXNCO1lBQ2QsbUJBQW1CO1lBQ2hDLE1BQU07T0FUYixrQkFBa0IsQ0FnSjlCO0lBQUQseUJBQUM7Q0FBQSxBQWhKRCxJQWdKQztTQWhKWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBFZmZlY3QsIG9mVHlwZSB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQge1xuICBhc3luY1NjaGVkdWxlcixcbiAgT2JzZXJ2YWJsZSxcbiAgb2YsXG4gIG1lcmdlLFxuICByYWNlLFxuICBTY2hlZHVsZXJMaWtlLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGNvbmNhdE1hcCxcbiAgY2F0Y2hFcnJvcixcbiAgZGVsYXksXG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQge1xuICBDaGFuZ2VTZXQsXG4gIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNDYW5jZWxlZCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zLFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIFNBVkVfRU5USVRJRVNfQ0FOQ0VMIGFjdGlvbnMgd2l0aCBub24tbnVsbCBjb3JyZWxhdGlvbiBpZHNcbiAgICovXG4gIEBFZmZlY3QoeyBkaXNwYXRjaDogZmFsc2UgfSlcbiAgc2F2ZUVudGl0aWVzQ2FuY2VsJDogT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWw+ID0gdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMKSxcbiAgICBmaWx0ZXIoKGE6IFNhdmVFbnRpdGllc0NhbmNlbCkgPT4gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgIT0gbnVsbClcbiAgKTtcblxuICBARWZmZWN0KClcbiAgLy8gQ29uY3VycmVudCBwZXJzaXN0ZW5jZSByZXF1ZXN0cyBjb25zaWRlcmVkIHVuc2FmZS5cbiAgLy8gYG1lcmdlTWFwYCBhbGxvd3MgZm9yIGNvbmN1cnJlbnQgcmVxdWVzdHMgd2hpY2ggbWF5IHJldHVybiBpbiBhbnkgb3JkZXJcbiAgc2F2ZUVudGl0aWVzJDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVMpLFxuICAgIG1lcmdlTWFwKChhY3Rpb246IFNhdmVFbnRpdGllcykgPT4gdGhpcy5zYXZlRW50aXRpZXMoYWN0aW9uKSlcbiAgKTtcblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIFNhdmVFbnRpdGllcyBhY3Rpb25zIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIFNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICovXG4gIHNhdmVFbnRpdGllcyhhY3Rpb246IFNhdmVFbnRpdGllcyk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgZXJyb3IgPSBhY3Rpb24ucGF5bG9hZC5lcnJvcjtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNoYW5nZVNldCA9IGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldCk7XG4gICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZywgdXJsIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgICBpZiAoY2hhbmdlU2V0LmNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gc2F2ZVxuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsZWQ+IGZvciBhIHNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyB0aGUgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKGEgPT4gY29ycmVsYXRpb25JZCA9PT0gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBtYXAoXG4gICAgICAgICAgYSA9PlxuICAgICAgICAgICAgbmV3IFNhdmVFbnRpdGllc0NhbmNlbGVkKFxuICAgICAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgICAgICBhLnBheWxvYWQucmVhc29uLFxuICAgICAgICAgICAgICBhLnBheWxvYWQudGFnXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IFNhdmVFbnRpdGllcyByZXN1bHQgYXMgYSBTYXZlRW50aXRpZXNTdWNjZXNzIGFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuZGF0YVNlcnZpY2Uuc2F2ZUVudGl0aWVzKGNoYW5nZVNldCwgdXJsKS5waXBlKFxuICAgICAgICBjb25jYXRNYXAocmVzdWx0ID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChhY3Rpb24sIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeSkoXG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiByZXR1cm4gaGFuZGxlciBvZiBlcnJvciByZXN1bHQgb2Ygc2F2ZUVudGl0aWVzLCByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb24gKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNcbiAgKTogKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBlcnIgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yID8gZXJyIDogbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCBudWxsKTtcbiAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzRXJyb3IoZXJyb3IsIGFjdGlvbikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgdGhlIENoYW5nZVNldCByZXN1bHQgb2Ygc3VjY2Vzc2Z1bCBzYXZlRW50aXRpZXMoKSAqL1xuICBwcml2YXRlIGhhbmRsZVNhdmVFbnRpdGllc1N1Y2Nlc3MkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzLFxuICAgIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnlcbiAgKTogKGNoYW5nZVNldDogQ2hhbmdlU2V0KSA9PiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IHsgdXJsLCBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgcmV0dXJuIGNoYW5nZVNldCA9PiB7XG4gICAgICAvLyBEYXRhU2VydmljZSByZXR1cm5lZCBhIENoYW5nZVNldCB3aXRoIHBvc3NpYmxlIHVwZGF0ZXMgdG8gdGhlIHNhdmVkIGVudGl0aWVzXG4gICAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBObyBDaGFuZ2VTZXQgPSBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkICcyMDQgLSBObyBDb250ZW50JyBiZWNhdXNlXG4gICAgICAvLyBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkL3VwZGF0ZWQgZW50aXRpZXMuXG4gICAgICAvLyBSZXNwb25kIHdpdGggc3VjY2VzcyBhY3Rpb24gYmVzdCBvbiB0aGUgQ2hhbmdlU2V0IGluIHRoZSByZXF1ZXN0LlxuICAgICAgY2hhbmdlU2V0ID0gYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgICAvLyBJZiBwZXNzaW1pc3RpYyBzYXZlLCByZXR1cm4gc3VjY2VzcyBhY3Rpb24gd2l0aCB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBpZiAoIWFjdGlvbi5wYXlsb2FkLmlzT3B0aW1pc3RpYykge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgb3B0aW1pc3RpYyBzYXZlLCBhdm9pZCBjYWNoZSBncmluZGluZyBieSBqdXN0IHR1cm5pbmcgb2ZmIHRoZSBsb2FkaW5nIGZsYWdzXG4gICAgICAvLyBmb3IgYWxsIGNvbGxlY3Rpb25zIGluIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGNvbnN0IGVudGl0eU5hbWVzID0gY2hhbmdlU2V0LmNoYW5nZXMucmVkdWNlKFxuICAgICAgICAoYWNjLCBpdGVtKSA9PlxuICAgICAgICAgIGFjYy5pbmRleE9mKGl0ZW0uZW50aXR5TmFtZSkgPT09IC0xXG4gICAgICAgICAgICA/IGFjYy5jb25jYXQoaXRlbS5lbnRpdHlOYW1lKVxuICAgICAgICAgICAgOiBhY2MsXG4gICAgICAgIFtdIGFzIHN0cmluZ1tdXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lcmdlKFxuICAgICAgICBlbnRpdHlOYW1lcy5tYXAobmFtZSA9PlxuICAgICAgICAgIGVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlKG5hbWUsIEVudGl0eU9wLlNFVF9MT0FESU5HLCBmYWxzZSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG59XG4iXX0=