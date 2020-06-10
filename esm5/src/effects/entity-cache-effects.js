/**
 * @fileoverview added by tsickle
 * Generated from: src/effects/entity-cache-effects.ts
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
var EntityCacheEffects = /** @class */ (function () {
    function EntityCacheEffects(actions, dataService, entityActionFactory, logger, scheduler) {
        var _this = this;
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
        function () {
            return _this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return a.payload.correlationId != null; })));
        }), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect((/**
         * @return {?}
         */
        function () {
            return _this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((/**
             * @param {?} action
             * @return {?}
             */
            function (action) { return _this.saveEntities(action); })));
        }));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action The SaveEntities action
     * @return {?}
     */
    EntityCacheEffects.prototype.saveEntities = /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action The SaveEntities action
     * @return {?}
     */
    function (action) {
        var _this = this;
        /** @type {?} */
        var error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            /** @type {?} */
            var changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            var _a = action.payload, correlationId_1 = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag, url = _a.url;
            /** @type {?} */
            var options = { correlationId: correlationId_1, mergeStrategy: mergeStrategy, tag: tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            /** @type {?} */
            var c = this.saveEntitiesCancel$.pipe(filter((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return correlationId_1 === a.payload.correlationId; })), map((/**
             * @param {?} a
             * @return {?}
             */
            function (a) {
                return new SaveEntitiesCanceled(correlationId_1, a.payload.reason, a.payload.tag);
            })));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            /** @type {?} */
            var d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((/**
             * @param {?} result
             * @return {?}
             */
            function (result) {
                return _this.handleSaveEntitiesSuccess$(action, _this.entityActionFactory)(result);
            })), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    };
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    /**
     * return handler of error result of saveEntities, returning a scalar observable of error action
     * @private
     * @param {?} action
     * @return {?}
     */
    EntityCacheEffects.prototype.handleSaveEntitiesError$ = /**
     * return handler of error result of saveEntities, returning a scalar observable of error action
     * @private
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var _this = this;
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            /** @type {?} */
            var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(_this.responseDelay, _this.scheduler || asyncScheduler));
        });
    };
    /** return handler of the ChangeSet result of successful saveEntities() */
    /**
     * return handler of the ChangeSet result of successful saveEntities()
     * @private
     * @param {?} action
     * @param {?} entityActionFactory
     * @return {?}
     */
    EntityCacheEffects.prototype.handleSaveEntitiesSuccess$ = /**
     * return handler of the ChangeSet result of successful saveEntities()
     * @private
     * @param {?} action
     * @param {?} entityActionFactory
     * @return {?}
     */
    function (action, entityActionFactory) {
        var _a = action.payload, url = _a.url, correlationId = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
        /** @type {?} */
        var options = { correlationId: correlationId, mergeStrategy: mergeStrategy, tag: tag };
        return (/**
         * @param {?} changeSet
         * @return {?}
         */
        function (changeSet) {
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
            var entityNames = changeSet.changes.reduce((/**
             * @param {?} acc
             * @param {?} item
             * @return {?}
             */
            function (acc, item) {
                return acc.indexOf(item.entityName) === -1
                    ? acc.concat(item.entityName)
                    : acc;
            }), (/** @type {?} */ ([])));
            return merge(entityNames.map((/**
             * @param {?} name
             * @return {?}
             */
            function (name) {
                return entityActionFactory.create(name, EntityOp.SET_LOADING, false);
            })));
        });
    };
    EntityCacheEffects.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EntityCacheEffects.ctorParameters = function () { return [
        { type: Actions },
        { type: EntityCacheDataService },
        { type: EntityActionFactory },
        { type: Logger },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
    ]; };
    return EntityCacheEffects;
}());
export { EntityCacheEffects };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFDTCxjQUFjLEVBRWQsRUFBRSxFQUNGLEtBQUssRUFDTCxJQUFJLEdBRUwsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEdBQ1QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBRUwsMEJBQTBCLEdBQzNCLE1BQU0sb0NBQW9DLENBQUM7QUFDNUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFDTCxpQkFBaUIsRUFHakIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFN0M7SUFNRSw0QkFDVSxPQUFnQixFQUNoQixXQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsTUFBYyxFQVFk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Qjs7Ozs7Ozs7SUFNdEIsdUNBRWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgb2ZUeXBlLCBjcmVhdGVFZmZlY3QgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHtcbiAgYXN5bmNTY2hlZHVsZXIsXG4gIE9ic2VydmFibGUsXG4gIG9mLFxuICBtZXJnZSxcbiAgcmFjZSxcbiAgU2NoZWR1bGVyTGlrZSxcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBjb25jYXRNYXAsXG4gIGNhdGNoRXJyb3IsXG4gIGRlbGF5LFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0LFxuICBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsZWQsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9ucyxcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSBvZiBTQVZFX0VOVElUSUVTX0NBTkNFTCBhY3Rpb25zIHdpdGggbm9uLW51bGwgY29ycmVsYXRpb24gaWRzXG4gICAqL1xuICBzYXZlRW50aXRpZXNDYW5jZWwkOiBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbD4gPSBjcmVhdGVFZmZlY3QoXG4gICAgKCkgPT5cbiAgICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgICBvZlR5cGUoRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUwpLFxuICAgICAgICBmaWx0ZXIoKGE6IFNhdmVFbnRpdGllc0NhbmNlbCkgPT4gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIENvbmN1cnJlbnQgcGVyc2lzdGVuY2UgcmVxdWVzdHMgY29uc2lkZXJlZCB1bnNhZmUuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHNhdmVFbnRpdGllcyQ6IE9ic2VydmFibGU8QWN0aW9uPiA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVMpLFxuICAgICAgbWVyZ2VNYXAoKGFjdGlvbjogU2F2ZUVudGl0aWVzKSA9PiB0aGlzLnNhdmVFbnRpdGllcyhhY3Rpb24pKVxuICAgIClcbiAgKTtcblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIFNhdmVFbnRpdGllcyBhY3Rpb25zIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIFNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICovXG4gIHNhdmVFbnRpdGllcyhhY3Rpb246IFNhdmVFbnRpdGllcyk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgZXJyb3IgPSBhY3Rpb24ucGF5bG9hZC5lcnJvcjtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNoYW5nZVNldCA9IGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldCk7XG4gICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZywgdXJsIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgICBpZiAoY2hhbmdlU2V0LmNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gc2F2ZVxuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsZWQ+IGZvciBhIHNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyB0aGUgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKChhKSA9PiBjb3JyZWxhdGlvbklkID09PSBhLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIG1hcChcbiAgICAgICAgICAoYSkgPT5cbiAgICAgICAgICAgIG5ldyBTYXZlRW50aXRpZXNDYW5jZWxlZChcbiAgICAgICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnJlYXNvbixcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnRhZ1xuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBTYXZlRW50aXRpZXMgcmVzdWx0IGFzIGEgU2F2ZUVudGl0aWVzU3VjY2VzcyBhY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmRhdGFTZXJ2aWNlLnNhdmVFbnRpdGllcyhjaGFuZ2VTZXQsIHVybCkucGlwZShcbiAgICAgICAgY29uY2F0TWFwKChyZXN1bHQpID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeVxuICAgICAgICAgICkocmVzdWx0KVxuICAgICAgICApLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgZXJyb3IgcmVzdWx0IG9mIHNhdmVFbnRpdGllcywgcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICk6IChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc0Vycm9yKGVycm9yLCBhY3Rpb24pKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIHRoZSBDaGFuZ2VTZXQgcmVzdWx0IG9mIHN1Y2Nlc3NmdWwgc2F2ZUVudGl0aWVzKCkgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllcyxcbiAgICBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICk6IChjaGFuZ2VTZXQ6IENoYW5nZVNldCkgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCB7IHVybCwgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgIHJldHVybiAoY2hhbmdlU2V0KSA9PiB7XG4gICAgICAvLyBEYXRhU2VydmljZSByZXR1cm5lZCBhIENoYW5nZVNldCB3aXRoIHBvc3NpYmxlIHVwZGF0ZXMgdG8gdGhlIHNhdmVkIGVudGl0aWVzXG4gICAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBObyBDaGFuZ2VTZXQgPSBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkICcyMDQgLSBObyBDb250ZW50JyBiZWNhdXNlXG4gICAgICAvLyBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkL3VwZGF0ZWQgZW50aXRpZXMuXG4gICAgICAvLyBSZXNwb25kIHdpdGggc3VjY2VzcyBhY3Rpb24gYmVzdCBvbiB0aGUgQ2hhbmdlU2V0IGluIHRoZSByZXF1ZXN0LlxuICAgICAgY2hhbmdlU2V0ID0gYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgICAvLyBJZiBwZXNzaW1pc3RpYyBzYXZlLCByZXR1cm4gc3VjY2VzcyBhY3Rpb24gd2l0aCB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBpZiAoIWFjdGlvbi5wYXlsb2FkLmlzT3B0aW1pc3RpYykge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgb3B0aW1pc3RpYyBzYXZlLCBhdm9pZCBjYWNoZSBncmluZGluZyBieSBqdXN0IHR1cm5pbmcgb2ZmIHRoZSBsb2FkaW5nIGZsYWdzXG4gICAgICAvLyBmb3IgYWxsIGNvbGxlY3Rpb25zIGluIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGNvbnN0IGVudGl0eU5hbWVzID0gY2hhbmdlU2V0LmNoYW5nZXMucmVkdWNlKFxuICAgICAgICAoYWNjLCBpdGVtKSA9PlxuICAgICAgICAgIGFjYy5pbmRleE9mKGl0ZW0uZW50aXR5TmFtZSkgPT09IC0xXG4gICAgICAgICAgICA/IGFjYy5jb25jYXQoaXRlbS5lbnRpdHlOYW1lKVxuICAgICAgICAgICAgOiBhY2MsXG4gICAgICAgIFtdIGFzIHN0cmluZ1tdXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lcmdlKFxuICAgICAgICBlbnRpdHlOYW1lcy5tYXAoKG5hbWUpID0+XG4gICAgICAgICAgZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUobmFtZSwgRW50aXR5T3AuU0VUX0xPQURJTkcsIGZhbHNlKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==