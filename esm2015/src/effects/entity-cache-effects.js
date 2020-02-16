/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/effects/entity-cache-effects.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFDTCxjQUFjLEVBRWQsRUFBRSxFQUNGLEtBQUssRUFDTCxJQUFJLEdBRUwsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEdBQ1QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBRUwsMEJBQTBCLEdBQzNCLE1BQU0sb0NBQW9DLENBQUM7QUFDNUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFDTCxpQkFBaUIsRUFHakIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHN0MsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7Ozs7SUFLN0IsWUFDVSxPQUFn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RTtnQkFDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7Ozs7a0JBSUssV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTTs7Ozs7WUFDMUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDWixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxHQUFHLEdBQ1QsbUJBQUEsRUFBRSxFQUFZLENBQ2Y7WUFDRCxPQUFPLEtBQUssQ0FDVixXQUFXLENBQUMsR0FBRzs7OztZQUFDLElBQUksQ0FBQyxFQUFFLENBQ3JCLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsRUFDOUQsQ0FDRixDQUFDO1FBQ0osQ0FBQyxFQUFDO0lBQ0osQ0FBQzs7O1lBcEpGLFVBQVU7Ozs7WUF2Q0YsT0FBTztZQW1DUCxzQkFBc0I7WUFYdEIsbUJBQW1CO1lBYW5CLE1BQU07NENBa0JWLFFBQVEsWUFDUixNQUFNLFNBQUMsd0JBQXdCOzs7Ozs7OztJQWJsQywyQ0FBMkI7Ozs7O0lBb0IzQixpREFPRTs7SUFJRiwyQ0FLRTs7Ozs7SUFqQ0EscUNBQXdCOzs7OztJQUN4Qix5Q0FBMkM7Ozs7O0lBQzNDLGlEQUFnRDs7Ozs7SUFDaEQsb0NBQXNCOzs7Ozs7OztJQU10Qix1Q0FFZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zLCBvZlR5cGUsIGNyZWF0ZUVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQge1xuICBhc3luY1NjaGVkdWxlcixcbiAgT2JzZXJ2YWJsZSxcbiAgb2YsXG4gIG1lcmdlLFxuICByYWNlLFxuICBTY2hlZHVsZXJMaWtlLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGNvbmNhdE1hcCxcbiAgY2F0Y2hFcnJvcixcbiAgZGVsYXksXG4gIGZpbHRlcixcbiAgbWFwLFxuICBtZXJnZU1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBEYXRhU2VydmljZUVycm9yIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQge1xuICBDaGFuZ2VTZXQsXG4gIGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcblxuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVBY3Rpb24sXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNDYW5jZWxlZCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDYWNoZUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zLFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIFNBVkVfRU5USVRJRVNfQ0FOQ0VMIGFjdGlvbnMgd2l0aCBub24tbnVsbCBjb3JyZWxhdGlvbiBpZHNcbiAgICovXG4gIHNhdmVFbnRpdGllc0NhbmNlbCQ6IE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsPiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTCksXG4gICAgICAgIGZpbHRlcigoYTogU2F2ZUVudGl0aWVzQ2FuY2VsKSA9PiBhLnBheWxvYWQuY29ycmVsYXRpb25JZCAhPSBudWxsKVxuICAgICAgKSxcbiAgICB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gICk7XG5cbiAgLy8gQ29uY3VycmVudCBwZXJzaXN0ZW5jZSByZXF1ZXN0cyBjb25zaWRlcmVkIHVuc2FmZS5cbiAgLy8gYG1lcmdlTWFwYCBhbGxvd3MgZm9yIGNvbmN1cnJlbnQgcmVxdWVzdHMgd2hpY2ggbWF5IHJldHVybiBpbiBhbnkgb3JkZXJcbiAgc2F2ZUVudGl0aWVzJDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZlR5cGUoRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUyksXG4gICAgICBtZXJnZU1hcCgoYWN0aW9uOiBTYXZlRW50aXRpZXMpID0+IHRoaXMuc2F2ZUVudGl0aWVzKGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgU2F2ZUVudGl0aWVzIGFjdGlvbnMgYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBUaGUgU2F2ZUVudGl0aWVzIGFjdGlvblxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKGFjdGlvbjogU2F2ZUVudGl0aWVzKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCBlcnJvciA9IGFjdGlvbi5wYXlsb2FkLmVycm9yO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2hhbmdlU2V0ID0gZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMoYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0KTtcbiAgICAgIGNvbnN0IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnLCB1cmwgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH07XG5cbiAgICAgIGlmIChjaGFuZ2VTZXQuY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gbm90aGluZyB0byBzYXZlXG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWxlZD4gZm9yIGEgc2F2ZUVudGl0aWVzIGFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIHRoZSBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuc2F2ZUVudGl0aWVzQ2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoYSA9PiBjb3JyZWxhdGlvbklkID09PSBhLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIG1hcChcbiAgICAgICAgICBhID0+XG4gICAgICAgICAgICBuZXcgU2F2ZUVudGl0aWVzQ2FuY2VsZWQoXG4gICAgICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICAgIGEucGF5bG9hZC5yZWFzb24sXG4gICAgICAgICAgICAgIGEucGF5bG9hZC50YWdcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogU2F2ZUVudGl0aWVzIHJlc3VsdCBhcyBhIFNhdmVFbnRpdGllc1N1Y2Nlc3MgYWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5kYXRhU2VydmljZS5zYXZlRW50aXRpZXMoY2hhbmdlU2V0LCB1cmwpLnBpcGUoXG4gICAgICAgIGNvbmNhdE1hcChyZXN1bHQgPT5cbiAgICAgICAgICB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc1N1Y2Nlc3MkKGFjdGlvbiwgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5KShcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIGVycm9yIHJlc3VsdCBvZiBzYXZlRW50aXRpZXMsIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvbiAqL1xuICBwcml2YXRlIGhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1xuICApOiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgIGVyciBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3IgPyBlcnIgOiBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIG51bGwpO1xuICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNFcnJvcihlcnJvciwgYWN0aW9uKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKiByZXR1cm4gaGFuZGxlciBvZiB0aGUgQ2hhbmdlU2V0IHJlc3VsdCBvZiBzdWNjZXNzZnVsIHNhdmVFbnRpdGllcygpICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXMsXG4gICAgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeVxuICApOiAoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpID0+IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgeyB1cmwsIGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH07XG5cbiAgICByZXR1cm4gY2hhbmdlU2V0ID0+IHtcbiAgICAgIC8vIERhdGFTZXJ2aWNlIHJldHVybmVkIGEgQ2hhbmdlU2V0IHdpdGggcG9zc2libGUgdXBkYXRlcyB0byB0aGUgc2F2ZWQgZW50aXRpZXNcbiAgICAgIGlmIChjaGFuZ2VTZXQpIHtcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vIENoYW5nZVNldCA9IFNlcnZlciBwcm9iYWJseSByZXNwb25kZWQgJzIwNCAtIE5vIENvbnRlbnQnIGJlY2F1c2VcbiAgICAgIC8vIGl0IG1hZGUgbm8gY2hhbmdlcyB0byB0aGUgaW5zZXJ0ZWQvdXBkYXRlZCBlbnRpdGllcy5cbiAgICAgIC8vIFJlc3BvbmQgd2l0aCBzdWNjZXNzIGFjdGlvbiBiZXN0IG9uIHRoZSBDaGFuZ2VTZXQgaW4gdGhlIHJlcXVlc3QuXG4gICAgICBjaGFuZ2VTZXQgPSBhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAgIC8vIElmIHBlc3NpbWlzdGljIHNhdmUsIHJldHVybiBzdWNjZXNzIGFjdGlvbiB3aXRoIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGlmICghYWN0aW9uLnBheWxvYWQuaXNPcHRpbWlzdGljKSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBvcHRpbWlzdGljIHNhdmUsIGF2b2lkIGNhY2hlIGdyaW5kaW5nIGJ5IGp1c3QgdHVybmluZyBvZmYgdGhlIGxvYWRpbmcgZmxhZ3NcbiAgICAgIC8vIGZvciBhbGwgY29sbGVjdGlvbnMgaW4gdGhlIG9yaWdpbmFsIENoYW5nZVNldFxuICAgICAgY29uc3QgZW50aXR5TmFtZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcy5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGl0ZW0pID0+XG4gICAgICAgICAgYWNjLmluZGV4T2YoaXRlbS5lbnRpdHlOYW1lKSA9PT0gLTFcbiAgICAgICAgICAgID8gYWNjLmNvbmNhdChpdGVtLmVudGl0eU5hbWUpXG4gICAgICAgICAgICA6IGFjYyxcbiAgICAgICAgW10gYXMgc3RyaW5nW11cbiAgICAgICk7XG4gICAgICByZXR1cm4gbWVyZ2UoXG4gICAgICAgIGVudGl0eU5hbWVzLm1hcChuYW1lID0+XG4gICAgICAgICAgZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUobmFtZSwgRW50aXR5T3AuU0VUX0xPQURJTkcsIGZhbHNlKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==