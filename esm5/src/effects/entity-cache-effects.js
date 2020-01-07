import { __decorate, __metadata, __param } from "tslib";
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
    EntityCacheEffects = __decorate([
        Injectable(),
        __param(4, Optional()),
        __param(4, Inject(ENTITY_EFFECTS_SCHEDULER)),
        __metadata("design:paramtypes", [Actions,
            EntityCacheDataService,
            EntityActionFactory,
            Logger, Object])
    ], EntityCacheEffects);
    return EntityCacheEffects;
}());
export { EntityCacheEffects };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUNMLGNBQWMsRUFFZCxFQUFFLEVBQ0YsS0FBSyxFQUNMLElBQUksR0FFTCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3RFLE9BQU8sRUFFTCwwQkFBMEIsR0FDM0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGlCQUFpQixFQUdqQixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLG1CQUFtQixHQUNwQixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUc3QztJQUtFLDRCQUNVLE9BQWdCLEVBQ2hCLFdBQW1DLEVBQ25D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QUFzQjtZQUNkLG1CQUFtQjtZQUNoQyxNQUFNO09BVGIsa0JBQWtCLENBb0o5QjtJQUFELHlCQUFDO0NBQUEsQUFwSkQsSUFvSkM7U0FwSlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgb2ZUeXBlLCBjcmVhdGVFZmZlY3QgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHtcbiAgYXN5bmNTY2hlZHVsZXIsXG4gIE9ic2VydmFibGUsXG4gIG9mLFxuICBtZXJnZSxcbiAgcmFjZSxcbiAgU2NoZWR1bGVyTGlrZSxcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBjb25jYXRNYXAsXG4gIGNhdGNoRXJyb3IsXG4gIGRlbGF5LFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0LFxuICBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsZWQsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9ucyxcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSBvZiBTQVZFX0VOVElUSUVTX0NBTkNFTCBhY3Rpb25zIHdpdGggbm9uLW51bGwgY29ycmVsYXRpb24gaWRzXG4gICAqL1xuICBzYXZlRW50aXRpZXNDYW5jZWwkOiBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbD4gPSBjcmVhdGVFZmZlY3QoXG4gICAgKCkgPT5cbiAgICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgICBvZlR5cGUoRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUwpLFxuICAgICAgICBmaWx0ZXIoKGE6IFNhdmVFbnRpdGllc0NhbmNlbCkgPT4gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIENvbmN1cnJlbnQgcGVyc2lzdGVuY2UgcmVxdWVzdHMgY29uc2lkZXJlZCB1bnNhZmUuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHNhdmVFbnRpdGllcyQ6IE9ic2VydmFibGU8QWN0aW9uPiA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVMpLFxuICAgICAgbWVyZ2VNYXAoKGFjdGlvbjogU2F2ZUVudGl0aWVzKSA9PiB0aGlzLnNhdmVFbnRpdGllcyhhY3Rpb24pKVxuICAgIClcbiAgKTtcblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIFNhdmVFbnRpdGllcyBhY3Rpb25zIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIFNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICovXG4gIHNhdmVFbnRpdGllcyhhY3Rpb246IFNhdmVFbnRpdGllcyk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgZXJyb3IgPSBhY3Rpb24ucGF5bG9hZC5lcnJvcjtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNoYW5nZVNldCA9IGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldCk7XG4gICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZywgdXJsIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgICBpZiAoY2hhbmdlU2V0LmNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gc2F2ZVxuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsZWQ+IGZvciBhIHNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyB0aGUgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKGEgPT4gY29ycmVsYXRpb25JZCA9PT0gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBtYXAoXG4gICAgICAgICAgYSA9PlxuICAgICAgICAgICAgbmV3IFNhdmVFbnRpdGllc0NhbmNlbGVkKFxuICAgICAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgICAgICBhLnBheWxvYWQucmVhc29uLFxuICAgICAgICAgICAgICBhLnBheWxvYWQudGFnXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IFNhdmVFbnRpdGllcyByZXN1bHQgYXMgYSBTYXZlRW50aXRpZXNTdWNjZXNzIGFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuZGF0YVNlcnZpY2Uuc2F2ZUVudGl0aWVzKGNoYW5nZVNldCwgdXJsKS5waXBlKFxuICAgICAgICBjb25jYXRNYXAocmVzdWx0ID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChhY3Rpb24sIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeSkoXG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiByZXR1cm4gaGFuZGxlciBvZiBlcnJvciByZXN1bHQgb2Ygc2F2ZUVudGl0aWVzLCByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb24gKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNcbiAgKTogKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBlcnIgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yID8gZXJyIDogbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCBudWxsKTtcbiAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzRXJyb3IoZXJyb3IsIGFjdGlvbikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgdGhlIENoYW5nZVNldCByZXN1bHQgb2Ygc3VjY2Vzc2Z1bCBzYXZlRW50aXRpZXMoKSAqL1xuICBwcml2YXRlIGhhbmRsZVNhdmVFbnRpdGllc1N1Y2Nlc3MkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzLFxuICAgIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnlcbiAgKTogKGNoYW5nZVNldDogQ2hhbmdlU2V0KSA9PiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IHsgdXJsLCBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgcmV0dXJuIGNoYW5nZVNldCA9PiB7XG4gICAgICAvLyBEYXRhU2VydmljZSByZXR1cm5lZCBhIENoYW5nZVNldCB3aXRoIHBvc3NpYmxlIHVwZGF0ZXMgdG8gdGhlIHNhdmVkIGVudGl0aWVzXG4gICAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBObyBDaGFuZ2VTZXQgPSBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkICcyMDQgLSBObyBDb250ZW50JyBiZWNhdXNlXG4gICAgICAvLyBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkL3VwZGF0ZWQgZW50aXRpZXMuXG4gICAgICAvLyBSZXNwb25kIHdpdGggc3VjY2VzcyBhY3Rpb24gYmVzdCBvbiB0aGUgQ2hhbmdlU2V0IGluIHRoZSByZXF1ZXN0LlxuICAgICAgY2hhbmdlU2V0ID0gYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgICAvLyBJZiBwZXNzaW1pc3RpYyBzYXZlLCByZXR1cm4gc3VjY2VzcyBhY3Rpb24gd2l0aCB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBpZiAoIWFjdGlvbi5wYXlsb2FkLmlzT3B0aW1pc3RpYykge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgb3B0aW1pc3RpYyBzYXZlLCBhdm9pZCBjYWNoZSBncmluZGluZyBieSBqdXN0IHR1cm5pbmcgb2ZmIHRoZSBsb2FkaW5nIGZsYWdzXG4gICAgICAvLyBmb3IgYWxsIGNvbGxlY3Rpb25zIGluIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGNvbnN0IGVudGl0eU5hbWVzID0gY2hhbmdlU2V0LmNoYW5nZXMucmVkdWNlKFxuICAgICAgICAoYWNjLCBpdGVtKSA9PlxuICAgICAgICAgIGFjYy5pbmRleE9mKGl0ZW0uZW50aXR5TmFtZSkgPT09IC0xXG4gICAgICAgICAgICA/IGFjYy5jb25jYXQoaXRlbS5lbnRpdHlOYW1lKVxuICAgICAgICAgICAgOiBhY2MsXG4gICAgICAgIFtdIGFzIHN0cmluZ1tdXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lcmdlKFxuICAgICAgICBlbnRpdHlOYW1lcy5tYXAobmFtZSA9PlxuICAgICAgICAgIGVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlKG5hbWUsIEVudGl0eU9wLlNFVF9MT0FESU5HLCBmYWxzZSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG59XG4iXX0=