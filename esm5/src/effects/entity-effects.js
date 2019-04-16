import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { asyncScheduler, Observable, of, race } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, } from 'rxjs/operators';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdoRCxPQUFPLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxPQUFPLEVBRUwsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBR3hCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRTlGLE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBZTtJQUNwQyxRQUFRLENBQUMsU0FBUztJQUNsQixRQUFRLENBQUMsVUFBVTtJQUNuQixRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRLENBQUMsVUFBVTtJQUNuQixRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRLENBQUMsZUFBZTtJQUN4QixRQUFRLENBQUMsZUFBZTtJQUN4QixRQUFRLENBQUMsZUFBZTtDQUN6QixDQUFDO0FBR0Y7SUFzQkUsdUJBQ1UsT0FBOEIsRUFDOUIsV0FBOEIsRUFDOUIsbUJBQXdDLEVBQ3hDLGFBQXVDO0lBQy9DOzs7O09BSUc7SUFHSyxTQUF3QjtRQVpsQyxpQkFhSTtRQVpNLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUFtQjtRQUM5Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGtCQUFhLEdBQWIsYUFBYSxDQUEwQjtRQVF2QyxjQUFTLEdBQVQsU0FBUyxDQUFlO1FBakNsQywwRUFBMEU7UUFDMUUsdUZBQXVGO1FBQy9FLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBRTNCOztXQUVHO1FBRUgsWUFBTyxHQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDMUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFDbkMsR0FBRyxDQUFDLFVBQUMsTUFBb0IsSUFBSyxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUE1QixDQUE0QixDQUFDLEVBQzNELE1BQU0sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsSUFBSSxJQUFJLEVBQVYsQ0FBVSxDQUFDLENBQ3pCLENBQUM7UUFJRixBQURBLDBFQUEwRTtRQUMxRSxhQUFRLEdBQXVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUM5QyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQ3RCLFFBQVEsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FDekMsQ0FBQztJQWVDLENBQUM7SUFFSjs7OztPQUlHO0lBQ0gsK0JBQU8sR0FBUCxVQUFRLE1BQW9CO1FBQTVCLGlCQStCQztRQTlCQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ3ZCLDRDQUE0QztZQUM1QyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJO1lBQ0Ysc0ZBQXNGO1lBQ3RGLHlEQUF5RDtZQUN6RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDekIsTUFBTSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEtBQUssRUFBRSxFQUFuQyxDQUFtQyxDQUFDLEVBQ2pELEdBQUcsQ0FBQyxVQUFBLEVBQUU7Z0JBQ0osT0FBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO29CQUNoRCxRQUFRLEVBQUUsUUFBUSxDQUFDLGdCQUFnQjtpQkFDcEMsQ0FBQztZQUZGLENBRUUsQ0FDSCxDQUNGLENBQUM7WUFFRixzRkFBc0Y7WUFDdEYsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQ3pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUM3QyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUN0QyxDQUFDO1lBRUYsd0VBQXdFO1lBQ3hFLE9BQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVPLHVDQUFlLEdBQXZCLFVBQXdCLE1BQW9CO1FBQ3BDLElBQUEsbUJBQStDLEVBQTdDLDBCQUFVLEVBQUUsc0JBQVEsRUFBRSxjQUF1QixDQUFDO1FBQ3RELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsUUFBUSxFQUFFO1lBQ2hCLEtBQUssUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUN4QixLQUFLLFFBQVEsQ0FBQyxVQUFVO2dCQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUUxQixLQUFLLFFBQVEsQ0FBQyxZQUFZO2dCQUN4QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFL0IsS0FBSyxRQUFRLENBQUMsVUFBVTtnQkFDdEIsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLEtBQUssUUFBUSxDQUFDLFlBQVk7Z0JBQ3hCLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixLQUFLLFFBQVEsQ0FBQyxlQUFlO2dCQUMzQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFOUIsS0FBSyxRQUFRLENBQUMsZUFBZTtnQkFDckIsSUFBQSxTQUFxQyxFQUFuQyxZQUFFLEVBQUUsc0JBQStCLENBQUMsQ0FBQyx5QkFBeUI7Z0JBQ3RFLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQzlCLEdBQUcsQ0FBQyxVQUFBLGFBQWE7b0JBQ2YsZ0RBQWdEO29CQUNoRCx3RUFBd0U7b0JBQ3hFLHNDQUFzQztvQkFDdEMsd0NBQXdDO29CQUN4QyxnRkFBZ0Y7b0JBQ2hGLHlDQUF5QztvQkFDekMsSUFBTSxPQUFPLEdBQ1gsYUFBYSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDekQsSUFBTSxZQUFZLEdBQTRCLE9BQU87d0JBQ25ELENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBQSxFQUFFLE9BQU8sdUJBQU8sU0FBTyxFQUFLLGFBQWEsQ0FBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7d0JBQ2xFLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBQSxFQUFFLE9BQU8sV0FBQSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztvQkFDcEMsT0FBTyxZQUFZLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUNILENBQUM7WUFFSixLQUFLLFFBQVEsQ0FBQyxlQUFlO2dCQUMzQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUM5QixHQUFHLENBQUMsVUFBQSxjQUFjO29CQUNoQixJQUFNLE9BQU8sR0FDWCxjQUFjLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUMzRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQ0FBa0M7Z0JBQzVFLENBQUMsQ0FBQyxDQUNILENBQUM7WUFDSjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUF1QixRQUFRLDJCQUF1QixDQUFDLENBQUM7U0FDM0U7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssb0NBQVksR0FBcEIsVUFDRSxNQUFvQjtRQUR0QixpQkFVQztRQVBDLHlDQUF5QztRQUN6QyxxQ0FBcUM7UUFDckMsK0NBQStDO1FBQy9DLE9BQU8sVUFBQyxLQUFZO1lBQ2xCLE9BQUEsRUFBRSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNwRCxLQUFLLENBQUMsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsU0FBUyxJQUFJLGNBQWMsQ0FBQyxDQUM1RDtRQUZELENBRUMsQ0FBQztJQUNOLENBQUM7SUFFRDs7O09BR0c7SUFDSywwQ0FBa0IsR0FBMUIsVUFDRSxjQUE0QjtRQUU1QixJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQzdELGNBQWMsRUFDZDtZQUNFLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQ0YsQ0FBQztRQUNGLGdDQUFnQztRQUNoQyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7SUExSkQ7UUFEQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7MENBQ25CLFVBQVU7a0RBSWpCO0lBSUY7UUFGQyxNQUFNLEVBQUU7MENBRUMsVUFBVTttREFHbEI7SUFwQlMsYUFBYTtRQUR6QixVQUFVLEVBQUU7UUFpQ1IsbUJBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixtQkFBQSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtpREFWaEIsT0FBTztZQUNILGlCQUFpQjtZQUNULG1CQUFtQjtZQUN6Qix3QkFBd0I7T0ExQnRDLGFBQWEsQ0FvS3pCO0lBQUQsb0JBQUM7Q0FBQSxBQXBLRCxJQW9LQztTQXBLWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2YsIHJhY2UsIFNjaGVkdWxlckxpa2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGNvbmNhdE1hcCxcbiAgY2F0Y2hFcnJvcixcbiAgZGVsYXksXG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IEVudGl0eU9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgb2ZFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgcGVyc2lzdE9wczogRW50aXR5T3BbXSA9IFtcbiAgRW50aXR5T3AuUVVFUllfQUxMLFxuICBFbnRpdHlPcC5RVUVSWV9MT0FELFxuICBFbnRpdHlPcC5RVUVSWV9CWV9LRVksXG4gIEVudGl0eU9wLlFVRVJZX01BTlksXG4gIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIG5vbi1udWxsIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbiBpZHMgZnJvbSBDQU5DRUxfUEVSU0lTVCBhY3Rpb25zXG4gICAqL1xuICBARWZmZWN0KHsgZGlzcGF0Y2g6IGZhbHNlIH0pXG4gIGNhbmNlbCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuYWN0aW9ucy5waXBlKFxuICAgIG9mRW50aXR5T3AoRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpLFxuICAgIG1hcCgoYWN0aW9uOiBFbnRpdHlBY3Rpb24pID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgIGZpbHRlcihpZCA9PiBpZCAhPSBudWxsKVxuICApO1xuXG4gIEBFZmZlY3QoKVxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBwZXJzaXN0JDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgb2ZFbnRpdHlPcChwZXJzaXN0T3BzKSxcbiAgICBtZXJnZU1hcChhY3Rpb24gPT4gdGhpcy5wZXJzaXN0KGFjdGlvbikpXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zPEVudGl0eUFjdGlvbj4sXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgcmVzdWx0SGFuZGxlcjogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIEEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIEVudGl0eUFjdGlvblxuICAgKi9cbiAgcGVyc2lzdChhY3Rpb246IEVudGl0eUFjdGlvbik6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLnNraXApIHtcbiAgICAgIC8vIFNob3VsZCBub3QgcGVyc2lzdC4gUHJldGVuZCBpdCBzdWNjZWVkZWQuXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTa2lwU3VjY2VzcyQoYWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZSBvZiBDQU5DRUxFRF9QRVJTSVNUIGZvciBhIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5jYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcihpZCA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkID09PSBpZCksXG4gICAgICAgIG1hcChpZCA9PlxuICAgICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKGFjdGlvbiwge1xuICAgICAgICAgICAgZW50aXR5T3A6IEVudGl0eU9wLkNBTkNFTEVEX1BFUlNJU1QsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogZW50aXR5IGNvbGxlY3Rpb24gRGF0YVNlcnZpY2UgcmVzdWx0IGFzIGEgc3VjY2Vzc2Z1bCBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmNhbGxEYXRhU2VydmljZShhY3Rpb24pLnBpcGUoXG4gICAgICAgIG1hcCh0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlU3VjY2VzcyhhY3Rpb24pKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYWxsRGF0YVNlcnZpY2UoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICBjb25zdCB7IGVudGl0eU5hbWUsIGVudGl0eU9wLCBkYXRhIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5kYXRhU2VydmljZS5nZXRTZXJ2aWNlKGVudGl0eU5hbWUpO1xuICAgIHN3aXRjaCAoZW50aXR5T3ApIHtcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQUxMOlxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9MT0FEOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRBbGwoKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9CWV9LRVk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEJ5SWQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTUFOWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0V2l0aFF1ZXJ5KGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfQUREX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuYWRkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZGVsZXRlKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORTpcbiAgICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YSBhcyBVcGRhdGU8YW55PjsgLy8gZGF0YSBtdXN0IGJlIFVwZGF0ZTxUPlxuICAgICAgICByZXR1cm4gc2VydmljZS51cGRhdGUoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAodXBkYXRlZEVudGl0eSA9PiB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gYW4gVXBkYXRlPFQ+IHdpdGggdXBkYXRlZCBlbnRpdHkgZGF0YS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciByZXR1cm5lZCBlbnRpdHkgZGF0YSwgbWVyZ2Ugd2l0aCB0aGUgY2hhbmdlcyB0aGF0IHdlcmUgc2VudFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgJ2NoYW5nZWQnIGZsYWcgdG8gdHJ1ZS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YSxcbiAgICAgICAgICAgIC8vIGFzc3VtZSBpdCBtYWRlIG5vIGFkZGl0aW9uYWwgY2hhbmdlcyBvZiBpdHMgb3duLCByZXR1cm4gdGhlIG9yaWdpbmFsIGNoYW5nZXMsXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSBgY2hhbmdlZGAgZmxhZyB0byBgZmFsc2VgLlxuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwZGF0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBkYXRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPGFueT4gPSBoYXNEYXRhXG4gICAgICAgICAgICAgID8geyBpZCwgY2hhbmdlczogeyAuLi5jaGFuZ2VzLCAuLi51cGRhdGVkRW50aXR5IH0sIGNoYW5nZWQ6IHRydWUgfVxuICAgICAgICAgICAgICA6IHsgaWQsIGNoYW5nZXMsIGNoYW5nZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS51cHNlcnQoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAodXBzZXJ0ZWRFbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwc2VydGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwc2VydGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIGhhc0RhdGEgPyB1cHNlcnRlZEVudGl0eSA6IGRhdGE7IC8vIGVuc3VyZSBhIHJldHVybmVkIGVudGl0eSB2YWx1ZS5cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQZXJzaXN0ZW5jZSBhY3Rpb24gXCIke2VudGl0eU9wfVwiIGlzIG5vdCBpbXBsZW1lbnRlZC5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uLFxuICAgKiByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IkKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChlcnJvcjogRXJyb3IpID0+IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycm9yOiBFcnJvcikgPT5cbiAgICAgIG9mKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVFcnJvcihhY3Rpb24pKGVycm9yKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQmVjYXVzZSBFbnRpdHlBY3Rpb24ucGF5bG9hZC5za2lwIGlzIHRydWUsIHNraXAgdGhlIHBlcnNpc3RlbmNlIHN0ZXAgYW5kXG4gICAqIHJldHVybiBhIHNjYWxhciBzdWNjZXNzIGFjdGlvbiB0aGF0IGxvb2tzIGxpa2UgdGhlIG9wZXJhdGlvbiBzdWNjZWVkZWQuXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZVNraXBTdWNjZXNzJChcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICBjb25zdCBzdWNjZXNzQWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oXG4gICAgICBvcmlnaW5hbEFjdGlvbixcbiAgICAgIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEFsdGhvdWdoIHJldHVybnMgaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgb25lIHRpY2sgKGJ5IHVzaW5nIGEgcHJvbWlzZSksXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gb2Yoc3VjY2Vzc0FjdGlvbikucGlwZShcbiAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgKTtcbiAgfVxufVxuIl19