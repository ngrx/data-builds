/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?} actions
     * @param {?} dataService
     * @param {?} entityActionFactory
     * @param {?} logger
     * @param {?} scheduler
     */
    constructor(actions, dataService, entityActionFactory, logger, scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.logger = logger;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /**
         * Delay for error and skip observables. Must be multiple of 10 for marble testing.
         */
        this.responseDelay = 10;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         */
        this.saveEntitiesCancel$ = createEffect((/**
         * @return {?}
         */
        () => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((/**
         * @param {?} a
         * @return {?}
         */
        (a) => a.payload.correlationId != null)))), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect((/**
         * @return {?}
         */
        () => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((/**
         * @param {?} action
         * @return {?}
         */
        (action) => this.saveEntities(action))))));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action The SaveEntities action
     * @return {?}
     */
    saveEntities(action) {
        /** @type {?} */
        const error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            /** @type {?} */
            const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            /** @type {?} */
            const options = { correlationId, mergeStrategy, tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            /** @type {?} */
            const c = this.saveEntitiesCancel$.pipe(filter((/**
             * @param {?} a
             * @return {?}
             */
            a => correlationId === a.payload.correlationId)), map((/**
             * @param {?} a
             * @return {?}
             */
            a => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag))));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            /** @type {?} */
            const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((/**
             * @param {?} result
             * @return {?}
             */
            result => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result))), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    }
    /**
     * return handler of error result of saveEntities, returning a scalar observable of error action
     * @private
     * @param {?} action
     * @return {?}
     */
    handleSaveEntitiesError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            /** @type {?} */
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
        });
    }
    /**
     * return handler of the ChangeSet result of successful saveEntities()
     * @private
     * @param {?} action
     * @param {?} entityActionFactory
     * @return {?}
     */
    handleSaveEntitiesSuccess$(action, entityActionFactory) {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        /** @type {?} */
        const options = { correlationId, mergeStrategy, tag };
        return (/**
         * @param {?} changeSet
         * @return {?}
         */
        changeSet => {
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
            /** @type {?} */
            const entityNames = changeSet.changes.reduce((/**
             * @param {?} acc
             * @param {?} item
             * @return {?}
             */
            (acc, item) => acc.indexOf(item.entityName) === -1
                ? acc.concat(item.entityName)
                : acc), (/** @type {?} */ ([])));
            return merge(entityNames.map((/**
             * @param {?} name
             * @return {?}
             */
            name => entityActionFactory.create(name, EntityOp.SET_LOADING, false))));
        });
    }
}
EntityCacheEffects.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCacheEffects.ctorParameters = () => [
    { type: Actions },
    { type: EntityCacheDataService },
    { type: EntityActionFactory },
    { type: Logger },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
];
if (false) {
    /**
     * Delay for error and skip observables. Must be multiple of 10 for marble testing.
     * @type {?}
     * @private
     */
    EntityCacheEffects.prototype.responseDelay;
    /**
     * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
     * @type {?}
     */
    EntityCacheEffects.prototype.saveEntitiesCancel$;
    /** @type {?} */
    EntityCacheEffects.prototype.saveEntities$;
    /**
     * @type {?}
     * @private
     */
    EntityCacheEffects.prototype.actions;
    /**
     * @type {?}
     * @private
     */
    EntityCacheEffects.prototype.dataService;
    /**
     * @type {?}
     * @private
     */
    EntityCacheEffects.prototype.entityActionFactory;
    /**
     * @type {?}
     * @private
     */
    EntityCacheEffects.prototype.logger;
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     * @type {?}
     * @private
     */
    EntityCacheEffects.prototype.scheduler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUNMLGNBQWMsRUFFZCxFQUFFLEVBQ0YsS0FBSyxFQUNMLElBQUksR0FFTCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sR0FBRyxFQUNILFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3RFLE9BQU8sRUFFTCwwQkFBMEIsR0FDM0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGlCQUFpQixFQUdqQixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLG1CQUFtQixHQUNwQixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUc3QyxNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7OztJQUs3QixZQUNVLE9BQWdCLEVBQ2hCLFdBQW1DLEVBQ25DLG1CQUF3QyxFQUN4QyxNQUFjLEVBUWQsU0FBd0I7UUFYeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBd0I7UUFDbkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBUWQsY0FBUyxHQUFULFNBQVMsQ0FBZTs7Ozs7UUFkMUIsa0JBQWEsR0FBRyxFQUFFLENBQUM7Ozs7UUFvQjNCLHdCQUFtQixHQUFtQyxZQUFZOzs7UUFDaEUsR0FBRyxFQUFFLENBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLEVBQzlDLE1BQU07Ozs7UUFBQyxDQUFDLENBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLElBQUksRUFBQyxDQUNuRSxHQUNILEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUNwQixDQUFDOzs7UUFJRixrQkFBYSxHQUF1QixZQUFZOzs7UUFBQyxHQUFHLEVBQUUsQ0FDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUN2QyxRQUFROzs7O1FBQUMsQ0FBQyxNQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQzlELEVBQ0YsQ0FBQztJQXJCQyxDQUFDOzs7Ozs7O0lBNEJKLFlBQVksQ0FBQyxNQUFvQjs7Y0FDekIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSztRQUNsQyxJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsSUFBSTs7a0JBQ0ksU0FBUyxHQUFHLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2tCQUNoRSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPOztrQkFDM0QsT0FBTyxHQUFHLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUU7WUFFckQsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2xDLGtCQUFrQjtnQkFDbEIsT0FBTyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7Ozs7a0JBSUssQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ3JDLE1BQU07Ozs7WUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBQyxFQUN0RCxHQUFHOzs7O1lBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FDRixJQUFJLG9CQUFvQixDQUN0QixhQUFhLEVBQ2IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUNkLEVBQ0osQ0FDRjs7O2tCQUdLLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUMxRCxTQUFTOzs7O1lBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDakIsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FDL0QsTUFBTSxDQUNQLEVBQ0YsRUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ2xEO1lBRUQsd0VBQXdFO1lBQ3hFLE9BQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkQ7SUFDSCxDQUFDOzs7Ozs7O0lBR08sd0JBQXdCLENBQzlCLE1BQW9CO1FBRXBCLHlDQUF5QztRQUN6QyxxQ0FBcUM7UUFDckMsK0NBQStDO1FBQy9DOzs7O1FBQU8sQ0FBQyxHQUE2QixFQUFFLEVBQUU7O2tCQUNqQyxLQUFLLEdBQ1QsR0FBRyxZQUFZLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztZQUN6RSxPQUFPLEVBQUUsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztRQUNKLENBQUMsRUFBQztJQUNKLENBQUM7Ozs7Ozs7O0lBR08sMEJBQTBCLENBQ2hDLE1BQW9CLEVBQ3BCLG1CQUF3QztjQUVsQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPOztjQUMzRCxPQUFPLEdBQUcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUVyRDs7OztRQUFPLFNBQVMsQ0FBQyxFQUFFO1lBQ2pCLCtFQUErRTtZQUMvRSxJQUFJLFNBQVMsRUFBRTtnQkFDYixPQUFPLEVBQUUsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUM3RDtZQUVELHNFQUFzRTtZQUN0RSx1REFBdUQ7WUFDdkQsb0VBQW9FO1lBQ3BFLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUVyQyx5RUFBeUU7WUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUNoQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUM3RDs7OztrQkFJSyxXQUFXLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNOzs7OztZQUMxQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLEdBQUcsR0FDVCxtQkFBQSxFQUFFLEVBQVksQ0FDZjtZQUNELE9BQU8sS0FBSyxDQUNWLFdBQVcsQ0FBQyxHQUFHOzs7O1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDckIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUM5RCxDQUNGLENBQUM7UUFDSixDQUFDLEVBQUM7SUFDSixDQUFDOzs7WUFwSkYsVUFBVTs7OztZQXZDRixPQUFPO1lBbUNQLHNCQUFzQjtZQVh0QixtQkFBbUI7WUFhbkIsTUFBTTs0Q0FrQlYsUUFBUSxZQUNSLE1BQU0sU0FBQyx3QkFBd0I7Ozs7Ozs7O0lBYmxDLDJDQUEyQjs7Ozs7SUFvQjNCLGlEQU9FOztJQUlGLDJDQUtFOzs7OztJQWpDQSxxQ0FBd0I7Ozs7O0lBQ3hCLHlDQUEyQzs7Ozs7SUFDM0MsaURBQWdEOzs7OztJQUNoRCxvQ0FBc0I7Ozs7Ozs7O0lBTXRCLHVDQUVnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIG9mVHlwZSwgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5cbmltcG9ydCB7XG4gIGFzeW5jU2NoZWR1bGVyLFxuICBPYnNlcnZhYmxlLFxuICBvZixcbiAgbWVyZ2UsXG4gIHJhY2UsXG4gIFNjaGVkdWxlckxpa2UsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY29uY2F0TWFwLFxuICBjYXRjaEVycm9yLFxuICBkZWxheSxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIG1lcmdlTWFwLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7XG4gIENoYW5nZVNldCxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0NhbmNlbGVkLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnMsXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5Q2FjaGVEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2YgU0FWRV9FTlRJVElFU19DQU5DRUwgYWN0aW9ucyB3aXRoIG5vbi1udWxsIGNvcnJlbGF0aW9uIGlkc1xuICAgKi9cbiAgc2F2ZUVudGl0aWVzQ2FuY2VsJDogT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWw+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMKSxcbiAgICAgICAgZmlsdGVyKChhOiBTYXZlRW50aXRpZXNDYW5jZWwpID0+IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBDb25jdXJyZW50IHBlcnNpc3RlbmNlIHJlcXVlc3RzIGNvbnNpZGVyZWQgdW5zYWZlLlxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBzYXZlRW50aXRpZXMkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTKSxcbiAgICAgIG1lcmdlTWFwKChhY3Rpb246IFNhdmVFbnRpdGllcykgPT4gdGhpcy5zYXZlRW50aXRpZXMoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBTYXZlRW50aXRpZXMgYWN0aW9ucyBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBTYXZlRW50aXRpZXMgYWN0aW9uXG4gICAqL1xuICBzYXZlRW50aXRpZXMoYWN0aW9uOiBTYXZlRW50aXRpZXMpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IGVycm9yID0gYWN0aW9uLnBheWxvYWQuZXJyb3I7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGFuZ2VTZXQgPSBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQpO1xuICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcsIHVybCB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgICAgaWYgKGNoYW5nZVNldC5jaGFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBub3RoaW5nIHRvIHNhdmVcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbGVkPiBmb3IgYSBzYXZlRW50aXRpZXMgYWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgdGhlIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcihhID0+IGNvcnJlbGF0aW9uSWQgPT09IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgbWFwKFxuICAgICAgICAgIGEgPT5cbiAgICAgICAgICAgIG5ldyBTYXZlRW50aXRpZXNDYW5jZWxlZChcbiAgICAgICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnJlYXNvbixcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnRhZ1xuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBTYXZlRW50aXRpZXMgcmVzdWx0IGFzIGEgU2F2ZUVudGl0aWVzU3VjY2VzcyBhY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmRhdGFTZXJ2aWNlLnNhdmVFbnRpdGllcyhjaGFuZ2VTZXQsIHVybCkucGlwZShcbiAgICAgICAgY29uY2F0TWFwKHJlc3VsdCA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoYWN0aW9uLCB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkpKFxuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgZXJyb3IgcmVzdWx0IG9mIHNhdmVFbnRpdGllcywgcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICk6IChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc0Vycm9yKGVycm9yLCBhY3Rpb24pKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIHRoZSBDaGFuZ2VTZXQgcmVzdWx0IG9mIHN1Y2Nlc3NmdWwgc2F2ZUVudGl0aWVzKCkgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllcyxcbiAgICBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICk6IChjaGFuZ2VTZXQ6IENoYW5nZVNldCkgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCB7IHVybCwgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgIHJldHVybiBjaGFuZ2VTZXQgPT4ge1xuICAgICAgLy8gRGF0YVNlcnZpY2UgcmV0dXJuZWQgYSBDaGFuZ2VTZXQgd2l0aCBwb3NzaWJsZSB1cGRhdGVzIHRvIHRoZSBzYXZlZCBlbnRpdGllc1xuICAgICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gQ2hhbmdlU2V0ID0gU2VydmVyIHByb2JhYmx5IHJlc3BvbmRlZCAnMjA0IC0gTm8gQ29udGVudCcgYmVjYXVzZVxuICAgICAgLy8gaXQgbWFkZSBubyBjaGFuZ2VzIHRvIHRoZSBpbnNlcnRlZC91cGRhdGVkIGVudGl0aWVzLlxuICAgICAgLy8gUmVzcG9uZCB3aXRoIHN1Y2Nlc3MgYWN0aW9uIGJlc3Qgb24gdGhlIENoYW5nZVNldCBpbiB0aGUgcmVxdWVzdC5cbiAgICAgIGNoYW5nZVNldCA9IGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldDtcblxuICAgICAgLy8gSWYgcGVzc2ltaXN0aWMgc2F2ZSwgcmV0dXJuIHN1Y2Nlc3MgYWN0aW9uIHdpdGggdGhlIG9yaWdpbmFsIENoYW5nZVNldFxuICAgICAgaWYgKCFhY3Rpb24ucGF5bG9hZC5pc09wdGltaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG9wdGltaXN0aWMgc2F2ZSwgYXZvaWQgY2FjaGUgZ3JpbmRpbmcgYnkganVzdCB0dXJuaW5nIG9mZiB0aGUgbG9hZGluZyBmbGFnc1xuICAgICAgLy8gZm9yIGFsbCBjb2xsZWN0aW9ucyBpbiB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBjb25zdCBlbnRpdHlOYW1lcyA9IGNoYW5nZVNldC5jaGFuZ2VzLnJlZHVjZShcbiAgICAgICAgKGFjYywgaXRlbSkgPT5cbiAgICAgICAgICBhY2MuaW5kZXhPZihpdGVtLmVudGl0eU5hbWUpID09PSAtMVxuICAgICAgICAgICAgPyBhY2MuY29uY2F0KGl0ZW0uZW50aXR5TmFtZSlcbiAgICAgICAgICAgIDogYWNjLFxuICAgICAgICBbXSBhcyBzdHJpbmdbXVxuICAgICAgKTtcbiAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgZW50aXR5TmFtZXMubWFwKG5hbWUgPT5cbiAgICAgICAgICBlbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZShuYW1lLCBFbnRpdHlPcC5TRVRfTE9BRElORywgZmFsc2UpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfTtcbiAgfVxufVxuIl19