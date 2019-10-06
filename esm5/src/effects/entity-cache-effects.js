import * as tslib_1 from "tslib";
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
        this.saveEntitiesCancel$ = createEffect(function () {
            return _this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter(function (a) { return a.payload.correlationId != null; }));
        }, { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect(function () {
            return _this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap(function (action) { return _this.saveEntities(action); }));
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUNMLGNBQWMsRUFFZCxFQUFFLEVBQ0YsS0FBSyxFQUNMLElBQUksR0FFTCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3RFLE9BQU8sRUFFTCwwQkFBMEIsR0FDM0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGlCQUFpQixFQUdqQixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLG1CQUFtQixHQUNwQixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUc3QztJQUtFLDRCQUNVLE9BQWdCLEVBQ2hCLFdBQW1DLEVBQ25D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c0JBQXNCO1lBQ2QsbUJBQW1CO1lBQ2hDLE1BQU07T0FUYixrQkFBa0IsQ0FvSjlCO0lBQUQseUJBQUM7Q0FBQSxBQXBKRCxJQW9KQztTQXBKWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBvZlR5cGUsIGNyZWF0ZUVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQge1xuICBhc3luY1NjaGVkdWxlcixcbiAgT2JzZXJ2YWJsZSxcbiAgb2YsXG4gIG1lcmdlLFxuICByYWNlLFxuICBTY2hlZHVsZXJMaWtlLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGNvbmNhdE1hcCxcbiAgY2F0Y2hFcnJvcixcbiAgZGVsYXksXG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQge1xuICBDaGFuZ2VTZXQsXG4gIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNDYW5jZWxlZCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zLFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIFNBVkVfRU5USVRJRVNfQ0FOQ0VMIGFjdGlvbnMgd2l0aCBub24tbnVsbCBjb3JyZWxhdGlvbiBpZHNcbiAgICovXG4gIHNhdmVFbnRpdGllc0NhbmNlbCQ6IE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsPiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTCksXG4gICAgICAgIGZpbHRlcigoYTogU2F2ZUVudGl0aWVzQ2FuY2VsKSA9PiBhLnBheWxvYWQuY29ycmVsYXRpb25JZCAhPSBudWxsKVxuICAgICAgKSxcbiAgICB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gICk7XG5cbiAgLy8gQ29uY3VycmVudCBwZXJzaXN0ZW5jZSByZXF1ZXN0cyBjb25zaWRlcmVkIHVuc2FmZS5cbiAgLy8gYG1lcmdlTWFwYCBhbGxvd3MgZm9yIGNvbmN1cnJlbnQgcmVxdWVzdHMgd2hpY2ggbWF5IHJldHVybiBpbiBhbnkgb3JkZXJcbiAgc2F2ZUVudGl0aWVzJDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZlR5cGUoRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUyksXG4gICAgICBtZXJnZU1hcCgoYWN0aW9uOiBTYXZlRW50aXRpZXMpID0+IHRoaXMuc2F2ZUVudGl0aWVzKGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgU2F2ZUVudGl0aWVzIGFjdGlvbnMgYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgU2F2ZUVudGl0aWVzIGFjdGlvblxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKGFjdGlvbjogU2F2ZUVudGl0aWVzKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCBlcnJvciA9IGFjdGlvbi5wYXlsb2FkLmVycm9yO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2hhbmdlU2V0ID0gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0KTtcbiAgICAgIGNvbnN0IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnLCB1cmwgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH07XG5cbiAgICAgIGlmIChjaGFuZ2VTZXQuY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gbm90aGluZyB0byBzYXZlXG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWxlZD4gZm9yIGEgc2F2ZUVudGl0aWVzIGFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIHRoZSBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoYSA9PiBjb3JyZWxhdGlvbklkID09PSBhLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIG1hcChcbiAgICAgICAgICBhID0+XG4gICAgICAgICAgICBuZXcgU2F2ZUVudGl0aWVzQ2FuY2VsZWQoXG4gICAgICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICAgIGEucGF5bG9hZC5yZWFzb24sXG4gICAgICAgICAgICAgIGEucGF5bG9hZC50YWdcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogU2F2ZUVudGl0aWVzIHJlc3VsdCBhcyBhIFNhdmVFbnRpdGllc1N1Y2Nlc3MgYWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5kYXRhU2VydmljZS5zYXZlRW50aXRpZXMoY2hhbmdlU2V0LCB1cmwpLnBpcGUoXG4gICAgICAgIGNvbmNhdE1hcChyZXN1bHQgPT5cbiAgICAgICAgICB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc1N1Y2Nlc3MkKGFjdGlvbiwgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5KShcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIGVycm9yIHJlc3VsdCBvZiBzYXZlRW50aXRpZXMsIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvbiAqL1xuICBwcml2YXRlIGhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApOiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgIGVyciBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3IgPyBlcnIgOiBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIG51bGwpO1xuICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNFcnJvcihlcnJvciwgYWN0aW9uKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKiByZXR1cm4gaGFuZGxlciBvZiB0aGUgQ2hhbmdlU2V0IHJlc3VsdCBvZiBzdWNjZXNzZnVsIHNhdmVFbnRpdGllcygpICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXMsXG4gICAgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeVxuICApOiAoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpID0+IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgeyB1cmwsIGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH07XG5cbiAgICByZXR1cm4gY2hhbmdlU2V0ID0+IHtcbiAgICAgIC8vIERhdGFTZXJ2aWNlIHJldHVybmVkIGEgQ2hhbmdlU2V0IHdpdGggcG9zc2libGUgdXBkYXRlcyB0byB0aGUgc2F2ZWQgZW50aXRpZXNcbiAgICAgIGlmIChjaGFuZ2VTZXQpIHtcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vIENoYW5nZVNldCA9IFNlcnZlciBwcm9iYWJseSByZXNwb25kZWQgJzIwNCAtIE5vIENvbnRlbnQnIGJlY2F1c2VcbiAgICAgIC8vIGl0IG1hZGUgbm8gY2hhbmdlcyB0byB0aGUgaW5zZXJ0ZWQvdXBkYXRlZCBlbnRpdGllcy5cbiAgICAgIC8vIFJlc3BvbmQgd2l0aCBzdWNjZXNzIGFjdGlvbiBiZXN0IG9uIHRoZSBDaGFuZ2VTZXQgaW4gdGhlIHJlcXVlc3QuXG4gICAgICBjaGFuZ2VTZXQgPSBhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAgIC8vIElmIHBlc3NpbWlzdGljIHNhdmUsIHJldHVybiBzdWNjZXNzIGFjdGlvbiB3aXRoIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGlmICghYWN0aW9uLnBheWxvYWQuaXNPcHRpbWlzdGljKSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBvcHRpbWlzdGljIHNhdmUsIGF2b2lkIGNhY2hlIGdyaW5kaW5nIGJ5IGp1c3QgdHVybmluZyBvZmYgdGhlIGxvYWRpbmcgZmxhZ3NcbiAgICAgIC8vIGZvciBhbGwgY29sbGVjdGlvbnMgaW4gdGhlIG9yaWdpbmFsIENoYW5nZVNldFxuICAgICAgY29uc3QgZW50aXR5TmFtZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcy5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGl0ZW0pID0+XG4gICAgICAgICAgYWNjLmluZGV4T2YoaXRlbS5lbnRpdHlOYW1lKSA9PT0gLTFcbiAgICAgICAgICAgID8gYWNjLmNvbmNhdChpdGVtLmVudGl0eU5hbWUpXG4gICAgICAgICAgICA6IGFjYyxcbiAgICAgICAgW10gYXMgc3RyaW5nW11cbiAgICAgICk7XG4gICAgICByZXR1cm4gbWVyZ2UoXG4gICAgICAgIGVudGl0eU5hbWVzLm1hcChuYW1lID0+XG4gICAgICAgICAgZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUobmFtZSwgRW50aXR5T3AuU0VUX0xPQURJTkcsIGZhbHNlKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==