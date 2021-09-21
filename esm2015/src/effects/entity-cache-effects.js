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
export class EntityCacheEffects {
    constructor(actions, dataService, entityActionFactory, logger, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
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
        this.saveEntitiesCancel$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((a) => a.payload.correlationId != null)), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((action) => this.saveEntities(action))));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    saveEntities(action) {
        const error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            const options = { correlationId, mergeStrategy, tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            const c = this.saveEntitiesCancel$.pipe(filter((a) => correlationId === a.payload.correlationId), map((a) => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((result) => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    }
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    handleSaveEntitiesError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
        };
    }
    /** return handler of the ChangeSet result of successful saveEntities() */
    handleSaveEntitiesSuccess$(action, entityActionFactory) {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        const options = { correlationId, mergeStrategy, tag };
        return (changeSet) => {
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
            const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1
                ? acc.concat(item.entityName)
                : acc, []);
            return merge(entityNames.map((name) => entityActionFactory.create(name, EntityOp.SET_LOADING, false)));
        };
    }
}
/** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
EntityCacheEffects.decorators = [
    { type: Injectable }
];
/**
 * @type {function(): !Array<(null|{
 *   type: ?,
 *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
 * })>}
 * @nocollapse
 */
EntityCacheEffects.ctorParameters = () => [
    { type: Actions },
    { type: EntityCacheDataService },
    { type: EntityActionFactory },
    { type: Logger },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQ0wsY0FBYyxFQUVkLEVBQUUsRUFDRixLQUFLLEVBQ0wsSUFBSSxHQUVMLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFDTixHQUFHLEVBQ0gsUUFBUSxHQUNULE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdEUsT0FBTyxFQUVMLDBCQUEwQixHQUMzQixNQUFNLG9DQUFvQyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVoRCxPQUFPLEVBQ0wsaUJBQWlCLEVBR2pCLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsbUJBQW1CLEdBQ3BCLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDbkYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzdDLE1BQU0sT0FBTyxrQkFBa0I7SUFLN0IsWUFDVSxPQUFnQixFQUNoQixXQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsTUFBYztJQUN0Qjs7OztPQUlHO0lBR0ssU0FBd0I7UUFYeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBd0I7UUFDbkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBUWQsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQWhCbEMsMEVBQTBFO1FBQzFFLHVGQUF1RjtRQUMvRSxrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQWlCM0I7O1dBRUc7UUFDSCx3QkFBbUIsR0FBbUMsWUFBWSxDQUNoRSxHQUFHLEVBQUUsQ0FDSCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDZixNQUFNLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsRUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLENBQ25FLEVBQ0gsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQ3BCLENBQUM7UUFFRixxREFBcUQ7UUFDckQsMEVBQTBFO1FBQzFFLGtCQUFhLEdBQXVCLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUN2QyxRQUFRLENBQUMsQ0FBQyxNQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQzlELENBQ0YsQ0FBQztJQXJCQyxDQUFDO0lBdUJKOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsTUFBb0I7UUFDL0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDbkMsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyRDtRQUNELElBQUk7WUFDRixNQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2xFLE1BQU0sT0FBTyxHQUFHLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUV0RCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDbEMsa0JBQWtCO2dCQUNsQixPQUFPLEVBQUUsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUM3RDtZQUVELG1GQUFtRjtZQUNuRiw2REFBNkQ7WUFDN0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFDeEQsR0FBRyxDQUNELENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDSixJQUFJLG9CQUFvQixDQUN0QixhQUFhLEVBQ2IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUNkLENBQ0osQ0FDRixDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQzFELFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ25CLElBQUksQ0FBQywwQkFBMEIsQ0FDN0IsTUFBTSxFQUNOLElBQUksQ0FBQyxtQkFBbUIsQ0FDekIsQ0FBQyxNQUFNLENBQUMsQ0FDVixFQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDbEQsQ0FBQztZQUVGLHdFQUF3RTtZQUN4RSxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUVELG9HQUFvRztJQUM1Rix3QkFBd0IsQ0FDOUIsTUFBb0I7UUFFcEIseUNBQXlDO1FBQ3pDLHFDQUFxQztRQUNyQywrQ0FBK0M7UUFDL0MsT0FBTyxDQUFDLEdBQTZCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLEtBQUssR0FDVCxHQUFHLFlBQVksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUUsT0FBTyxFQUFFLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksY0FBYyxDQUFDLENBQzVELENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsMEVBQTBFO0lBQ2xFLDBCQUEwQixDQUNoQyxNQUFvQixFQUNwQixtQkFBd0M7UUFFeEMsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbEUsTUFBTSxPQUFPLEdBQUcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRXRELE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNuQiwrRUFBK0U7WUFDL0UsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsT0FBTyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxzRUFBc0U7WUFDdEUsdURBQXVEO1lBQ3ZELG9FQUFvRTtZQUNwRSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFFckMseUVBQXlFO1lBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxpRkFBaUY7WUFDakYsZ0RBQWdEO1lBQ2hELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUMxQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLEdBQUcsRUFDVCxFQUFjLENBQ2YsQ0FBQztZQUNGLE9BQU8sS0FBSyxDQUNWLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUN2QixtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQzlELENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7Ozs7WUFySkYsVUFBVTs7Ozs7Ozs7OztZQXZDRixPQUFPO1lBbUNQLHNCQUFzQjtZQVh0QixtQkFBbUI7WUFhbkIsTUFBTTs0Q0FrQlYsUUFBUSxZQUNSLE1BQU0sU0FBQyx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBvZlR5cGUsIGNyZWF0ZUVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQge1xuICBhc3luY1NjaGVkdWxlcixcbiAgT2JzZXJ2YWJsZSxcbiAgb2YsXG4gIG1lcmdlLFxuICByYWNlLFxuICBTY2hlZHVsZXJMaWtlLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGNvbmNhdE1hcCxcbiAgY2F0Y2hFcnJvcixcbiAgZGVsYXksXG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQge1xuICBDaGFuZ2VTZXQsXG4gIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNDYW5jZWxlZCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zLFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIFNBVkVfRU5USVRJRVNfQ0FOQ0VMIGFjdGlvbnMgd2l0aCBub24tbnVsbCBjb3JyZWxhdGlvbiBpZHNcbiAgICovXG4gIHNhdmVFbnRpdGllc0NhbmNlbCQ6IE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsPiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTCksXG4gICAgICAgIGZpbHRlcigoYTogU2F2ZUVudGl0aWVzQ2FuY2VsKSA9PiBhLnBheWxvYWQuY29ycmVsYXRpb25JZCAhPSBudWxsKVxuICAgICAgKSxcbiAgICB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gICk7XG5cbiAgLy8gQ29uY3VycmVudCBwZXJzaXN0ZW5jZSByZXF1ZXN0cyBjb25zaWRlcmVkIHVuc2FmZS5cbiAgLy8gYG1lcmdlTWFwYCBhbGxvd3MgZm9yIGNvbmN1cnJlbnQgcmVxdWVzdHMgd2hpY2ggbWF5IHJldHVybiBpbiBhbnkgb3JkZXJcbiAgc2F2ZUVudGl0aWVzJDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZlR5cGUoRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUyksXG4gICAgICBtZXJnZU1hcCgoYWN0aW9uOiBTYXZlRW50aXRpZXMpID0+IHRoaXMuc2F2ZUVudGl0aWVzKGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgU2F2ZUVudGl0aWVzIGFjdGlvbnMgYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgU2F2ZUVudGl0aWVzIGFjdGlvblxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKGFjdGlvbjogU2F2ZUVudGl0aWVzKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCBlcnJvciA9IGFjdGlvbi5wYXlsb2FkLmVycm9yO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2hhbmdlU2V0ID0gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0KTtcbiAgICAgIGNvbnN0IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnLCB1cmwgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH07XG5cbiAgICAgIGlmIChjaGFuZ2VTZXQuY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gbm90aGluZyB0byBzYXZlXG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWxlZD4gZm9yIGEgc2F2ZUVudGl0aWVzIGFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIHRoZSBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGEpID0+IGNvcnJlbGF0aW9uSWQgPT09IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgbWFwKFxuICAgICAgICAgIChhKSA9PlxuICAgICAgICAgICAgbmV3IFNhdmVFbnRpdGllc0NhbmNlbGVkKFxuICAgICAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgICAgICBhLnBheWxvYWQucmVhc29uLFxuICAgICAgICAgICAgICBhLnBheWxvYWQudGFnXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIERhdGE6IFNhdmVFbnRpdGllcyByZXN1bHQgYXMgYSBTYXZlRW50aXRpZXNTdWNjZXNzIGFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuZGF0YVNlcnZpY2Uuc2F2ZUVudGl0aWVzKGNoYW5nZVNldCwgdXJsKS5waXBlKFxuICAgICAgICBjb25jYXRNYXAoKHJlc3VsdCkgPT5cbiAgICAgICAgICB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc1N1Y2Nlc3MkKFxuICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5XG4gICAgICAgICAgKShyZXN1bHQpXG4gICAgICAgICksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEVtaXQgd2hpY2ggZXZlciBnZXRzIHRoZXJlIGZpcnN0OyB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBpcyB0ZXJtaW5hdGVkLlxuICAgICAgcmV0dXJuIHJhY2UoYywgZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiByZXR1cm4gaGFuZGxlciBvZiBlcnJvciByZXN1bHQgb2Ygc2F2ZUVudGl0aWVzLCByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb24gKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNcbiAgKTogKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBlcnIgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yID8gZXJyIDogbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCBudWxsKTtcbiAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzRXJyb3IoZXJyb3IsIGFjdGlvbikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgdGhlIENoYW5nZVNldCByZXN1bHQgb2Ygc3VjY2Vzc2Z1bCBzYXZlRW50aXRpZXMoKSAqL1xuICBwcml2YXRlIGhhbmRsZVNhdmVFbnRpdGllc1N1Y2Nlc3MkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzLFxuICAgIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnlcbiAgKTogKGNoYW5nZVNldDogQ2hhbmdlU2V0KSA9PiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IHsgdXJsLCBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgcmV0dXJuIChjaGFuZ2VTZXQpID0+IHtcbiAgICAgIC8vIERhdGFTZXJ2aWNlIHJldHVybmVkIGEgQ2hhbmdlU2V0IHdpdGggcG9zc2libGUgdXBkYXRlcyB0byB0aGUgc2F2ZWQgZW50aXRpZXNcbiAgICAgIGlmIChjaGFuZ2VTZXQpIHtcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vIENoYW5nZVNldCA9IFNlcnZlciBwcm9iYWJseSByZXNwb25kZWQgJzIwNCAtIE5vIENvbnRlbnQnIGJlY2F1c2VcbiAgICAgIC8vIGl0IG1hZGUgbm8gY2hhbmdlcyB0byB0aGUgaW5zZXJ0ZWQvdXBkYXRlZCBlbnRpdGllcy5cbiAgICAgIC8vIFJlc3BvbmQgd2l0aCBzdWNjZXNzIGFjdGlvbiBiZXN0IG9uIHRoZSBDaGFuZ2VTZXQgaW4gdGhlIHJlcXVlc3QuXG4gICAgICBjaGFuZ2VTZXQgPSBhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAgIC8vIElmIHBlc3NpbWlzdGljIHNhdmUsIHJldHVybiBzdWNjZXNzIGFjdGlvbiB3aXRoIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGlmICghYWN0aW9uLnBheWxvYWQuaXNPcHRpbWlzdGljKSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBvcHRpbWlzdGljIHNhdmUsIGF2b2lkIGNhY2hlIGdyaW5kaW5nIGJ5IGp1c3QgdHVybmluZyBvZmYgdGhlIGxvYWRpbmcgZmxhZ3NcbiAgICAgIC8vIGZvciBhbGwgY29sbGVjdGlvbnMgaW4gdGhlIG9yaWdpbmFsIENoYW5nZVNldFxuICAgICAgY29uc3QgZW50aXR5TmFtZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcy5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGl0ZW0pID0+XG4gICAgICAgICAgYWNjLmluZGV4T2YoaXRlbS5lbnRpdHlOYW1lKSA9PT0gLTFcbiAgICAgICAgICAgID8gYWNjLmNvbmNhdChpdGVtLmVudGl0eU5hbWUpXG4gICAgICAgICAgICA6IGFjYyxcbiAgICAgICAgW10gYXMgc3RyaW5nW11cbiAgICAgICk7XG4gICAgICByZXR1cm4gbWVyZ2UoXG4gICAgICAgIGVudGl0eU5hbWVzLm1hcCgobmFtZSkgPT5cbiAgICAgICAgICBlbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZShuYW1lLCBFbnRpdHlPcC5TRVRfTE9BRElORywgZmFsc2UpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfTtcbiAgfVxufVxuIl19