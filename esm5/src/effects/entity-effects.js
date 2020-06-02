var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/effects/entity-effects.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @type {?} */
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
    function EntityEffects(actions, dataService, entityActionFactory, resultHandler, scheduler) {
        var _this = this;
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.resultHandler = resultHandler;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /**
         * Delay for error and skip observables. Must be multiple of 10 for marble testing.
         */
        this.responseDelay = 10;
        /**
         * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
         */
        this.cancel$ = createEffect((/**
         * @return {?}
         */
        function () {
            return _this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((/**
             * @param {?} action
             * @return {?}
             */
            function (action) { return action.payload.correlationId; })), filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id != null; })));
        }), { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect((/**
         * @return {?}
         */
        function () {
            return _this.actions.pipe(ofEntityOp(persistOps), mergeMap((/**
             * @param {?} action
             * @return {?}
             */
            function (action) { return _this.persist(action); })));
        }));
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation EntityAction
     */
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action A persistence operation EntityAction
     * @return {?}
     */
    EntityEffects.prototype.persist = /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action A persistence operation EntityAction
     * @return {?}
     */
    function (action) {
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
            /** @type {?} */
            var c = this.cancel$.pipe(filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return action.payload.correlationId === id; })), map((/**
             * @param {?} id
             * @return {?}
             */
            function (id) {
                return _this.entityActionFactory.createFromAction(action, {
                    entityOp: EntityOp.CANCELED_PERSIST,
                });
            })));
            // Data: entity collection DataService result as a successful persistence EntityAction
            /** @type {?} */
            var d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    };
    /**
     * @private
     * @param {?} action
     * @return {?}
     */
    EntityEffects.prototype.callDataService = /**
     * @private
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var _a = action.payload, entityName = _a.entityName, entityOp = _a.entityOp, data = _a.data;
        /** @type {?} */
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
                var _b = (/** @type {?} */ (data)), id_1 = _b.id, changes_1 = _b.changes;
                return service.update(data).pipe(map((/**
                 * @param {?} updatedEntity
                 * @return {?}
                 */
                function (updatedEntity) {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    /** @type {?} */
                    var hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    /** @type {?} */
                    var responseData = hasData
                        ? { id: id_1, changes: __assign(__assign({}, changes_1), updatedEntity), changed: true }
                        : { id: id_1, changes: changes_1, changed: false };
                    return responseData;
                })));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(map((/**
                 * @param {?} upsertedEntity
                 * @return {?}
                 */
                function (upsertedEntity) {
                    /** @type {?} */
                    var hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                })));
            default:
                throw new Error("Persistence action \"" + entityOp + "\" is not implemented.");
        }
    };
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     */
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     * @private
     * @param {?} action
     * @return {?}
     */
    EntityEffects.prototype.handleError$ = /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
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
         * @param {?} error
         * @return {?}
         */
        function (error) {
            return of(_this.resultHandler.handleError(action)(error)).pipe(delay(_this.responseDelay, _this.scheduler || asyncScheduler));
        });
    };
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     * @private
     * @param {?} originalAction
     * @return {?}
     */
    EntityEffects.prototype.handleSkipSuccess$ = /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     * @private
     * @param {?} originalAction
     * @return {?}
     */
    function (originalAction) {
        /** @type {?} */
        var successOp = makeSuccessOp(originalAction.payload.entityOp);
        /** @type {?} */
        var successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    };
    EntityEffects.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EntityEffects.ctorParameters = function () { return [
        { type: Actions },
        { type: EntityDataService },
        { type: EntityActionFactory },
        { type: PersistenceResultHandler },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
    ]; };
    return EntityEffects;
}());
export { EntityEffects };
if (false) {
    /**
     * Delay for error and skip observables. Must be multiple of 10 for marble testing.
     * @type {?}
     * @private
     */
    EntityEffects.prototype.responseDelay;
    /**
     * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
     * @type {?}
     */
    EntityEffects.prototype.cancel$;
    /** @type {?} */
    EntityEffects.prototype.persist$;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.actions;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.dataService;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.entityActionFactory;
    /**
     * @type {?}
     * @private
     */
    EntityEffects.prototype.resultHandler;
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     * @type {?}
     * @private
     */
    EntityEffects.prototype.scheduler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd0RCxPQUFPLEVBQUUsY0FBYyxFQUFjLEVBQUUsRUFBRSxJQUFJLEVBQWlCLE1BQU0sTUFBTSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7O0FBRTlGLE1BQU0sS0FBTyxVQUFVLEdBQWU7SUFDcEMsUUFBUSxDQUFDLFNBQVM7SUFDbEIsUUFBUSxDQUFDLFVBQVU7SUFDbkIsUUFBUSxDQUFDLFlBQVk7SUFDckIsUUFBUSxDQUFDLFVBQVU7SUFDbkIsUUFBUSxDQUFDLFlBQVk7SUFDckIsUUFBUSxDQUFDLGVBQWU7SUFDeEIsUUFBUSxDQUFDLGVBQWU7SUFDeEIsUUFBUSxDQUFDLGVBQWU7Q0FDekI7QUFFRDtJQTJCRSx1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Q0FDRjtRQUNELGdDQUFnQztRQUNoQyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7O2dCQXhLRixVQUFVOzs7O2dCQTNCRixPQUFPO2dCQWFQLGlCQUFpQjtnQkFOakIsbUJBQW1CO2dCQU9uQix3QkFBd0I7Z0RBa0Q1QixRQUFRLFlBQ1IsTUFBTSxTQUFDLHdCQUF3Qjs7SUFtSXBDLG9CQUFDO0NBQUEsQUF6S0QsSUF5S0M7U0F4S1ksYUFBYTs7Ozs7OztJQUd4QixzQ0FBMkI7Ozs7O0lBSzNCLGdDQVFFOztJQUdGLGlDQUtFOzs7OztJQUdBLGdDQUFzQzs7Ozs7SUFDdEMsb0NBQXNDOzs7OztJQUN0Qyw0Q0FBZ0Q7Ozs7O0lBQ2hELHNDQUErQzs7Ozs7Ozs7SUFNL0Msa0NBRWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2YsIHJhY2UsIFNjaGVkdWxlckxpa2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSIH0gZnJvbSAnLi9lbnRpdHktZWZmZWN0cy1zY2hlZHVsZXInO1xuaW1wb3J0IHsgRW50aXR5T3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBwZXJzaXN0T3BzOiBFbnRpdHlPcFtdID0gW1xuICBFbnRpdHlPcC5RVUVSWV9BTEwsXG4gIEVudGl0eU9wLlFVRVJZX0xPQUQsXG4gIEVudGl0eU9wLlFVRVJZX0JZX0tFWSxcbiAgRW50aXR5T3AuUVVFUllfTUFOWSxcbiAgRW50aXR5T3AuU0FWRV9BRERfT05FLFxuICBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORSxcbiAgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUVmZmVjdHMge1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2Jsb2IvbWFzdGVyL2RvYy9tYXJibGUtdGVzdGluZy5tZFxuICAvKiogRGVsYXkgZm9yIGVycm9yIGFuZCBza2lwIG9ic2VydmFibGVzLiBNdXN0IGJlIG11bHRpcGxlIG9mIDEwIGZvciBtYXJibGUgdGVzdGluZy4gKi9cbiAgcHJpdmF0ZSByZXNwb25zZURlbGF5ID0gMTA7XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2Ygbm9uLW51bGwgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uIGlkcyBmcm9tIENBTkNFTF9QRVJTSVNUIGFjdGlvbnNcbiAgICovXG4gIGNhbmNlbCQ6IE9ic2VydmFibGU8YW55PiA9IGNyZWF0ZUVmZmVjdChcbiAgICAoKSA9PlxuICAgICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICAgIG9mRW50aXR5T3AoRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpLFxuICAgICAgICBtYXAoKGFjdGlvbjogRW50aXR5QWN0aW9uKSA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgZmlsdGVyKGlkID0+IGlkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBwZXJzaXN0JDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZkVudGl0eU9wKHBlcnNpc3RPcHMpLFxuICAgICAgbWVyZ2VNYXAoYWN0aW9uID0+IHRoaXMucGVyc2lzdChhY3Rpb24pKVxuICAgIClcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnM8RW50aXR5QWN0aW9uPixcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSByZXN1bHRIYW5kbGVyOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgLyoqXG4gICAgICogSW5qZWN0aW5nIGFuIG9wdGlvbmFsIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICogaW4gbm9ybWFsIGFwcGxpY2F0aW9uIHVzYWdlLCBidXQgaXRzIGluamVjdGVkIGhlcmUgc28gdGhhdCB5b3UgY2FuIG1vY2sgb3V0XG4gICAgICogZHVyaW5nIHRlc3RpbmcgdXNpbmcgdGhlIFJ4SlMgVGVzdFNjaGVkdWxlciBmb3Igc2ltdWxhdGluZyBwYXNzYWdlcyBvZiB0aW1lLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIpXG4gICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gQSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gRW50aXR5QWN0aW9uXG4gICAqL1xuICBwZXJzaXN0KGFjdGlvbjogRW50aXR5QWN0aW9uKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuc2tpcCkge1xuICAgICAgLy8gU2hvdWxkIG5vdCBwZXJzaXN0LiBQcmV0ZW5kIGl0IHN1Y2NlZWRlZC5cbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNraXBTdWNjZXNzJChhY3Rpb24pO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLnBheWxvYWQuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGFjdGlvbi5wYXlsb2FkLmVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlIG9mIENBTkNFTEVEX1BFUlNJU1QgZm9yIGEgcGVyc2lzdGVuY2UgRW50aXR5QWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKGlkID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgPT09IGlkKSxcbiAgICAgICAgbWFwKGlkID0+XG4gICAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oYWN0aW9uLCB7XG4gICAgICAgICAgICBlbnRpdHlPcDogRW50aXR5T3AuQ0FOQ0VMRURfUEVSU0lTVCxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBlbnRpdHkgY29sbGVjdGlvbiBEYXRhU2VydmljZSByZXN1bHQgYXMgYSBzdWNjZXNzZnVsIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuY2FsbERhdGFTZXJ2aWNlKGFjdGlvbikucGlwZShcbiAgICAgICAgbWFwKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVTdWNjZXNzKGFjdGlvbikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGxEYXRhU2VydmljZShhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIGNvbnN0IHsgZW50aXR5TmFtZSwgZW50aXR5T3AsIGRhdGEgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldFNlcnZpY2UoZW50aXR5TmFtZSk7XG4gICAgc3dpdGNoIChlbnRpdHlPcCkge1xuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9BTEw6XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0xPQUQ6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEFsbCgpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0JZX0tFWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QnlJZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9NQU5ZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRXaXRoUXVlcnkoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9BRERfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5hZGQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5kZWxldGUoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FOlxuICAgICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhIGFzIFVwZGF0ZTxhbnk+OyAvLyBkYXRhIG11c3QgYmUgVXBkYXRlPFQ+XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwZGF0ZShkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBkYXRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gYW4gVXBkYXRlPFQ+IHdpdGggdXBkYXRlZCBlbnRpdHkgZGF0YS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciByZXR1cm5lZCBlbnRpdHkgZGF0YSwgbWVyZ2Ugd2l0aCB0aGUgY2hhbmdlcyB0aGF0IHdlcmUgc2VudFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgJ2NoYW5nZWQnIGZsYWcgdG8gdHJ1ZS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YSxcbiAgICAgICAgICAgIC8vIGFzc3VtZSBpdCBtYWRlIG5vIGFkZGl0aW9uYWwgY2hhbmdlcyBvZiBpdHMgb3duLCByZXR1cm4gdGhlIG9yaWdpbmFsIGNoYW5nZXMsXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSBgY2hhbmdlZGAgZmxhZyB0byBgZmFsc2VgLlxuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwZGF0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBkYXRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPGFueT4gPSBoYXNEYXRhXG4gICAgICAgICAgICAgID8geyBpZCwgY2hhbmdlczogeyAuLi5jaGFuZ2VzLCAuLi51cGRhdGVkRW50aXR5IH0sIGNoYW5nZWQ6IHRydWUgfVxuICAgICAgICAgICAgICA6IHsgaWQsIGNoYW5nZXMsIGNoYW5nZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS51cHNlcnQoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAoKHVwc2VydGVkRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cHNlcnRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cHNlcnRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHJldHVybiBoYXNEYXRhID8gdXBzZXJ0ZWRFbnRpdHkgOiBkYXRhOyAvLyBlbnN1cmUgYSByZXR1cm5lZCBlbnRpdHkgdmFsdWUuXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUGVyc2lzdGVuY2UgYWN0aW9uIFwiJHtlbnRpdHlPcH1cIiBpcyBub3QgaW1wbGVtZW50ZWQuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbixcbiAgICogcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZUVycm9yJChcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoZXJyb3I6IEVycm9yKSA9PiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnJvcjogRXJyb3IpID0+XG4gICAgICBvZih0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlRXJyb3IoYWN0aW9uKShlcnJvcikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlY2F1c2UgRW50aXR5QWN0aW9uLnBheWxvYWQuc2tpcCBpcyB0cnVlLCBza2lwIHRoZSBwZXJzaXN0ZW5jZSBzdGVwIGFuZFxuICAgKiByZXR1cm4gYSBzY2FsYXIgc3VjY2VzcyBhY3Rpb24gdGhhdCBsb29rcyBsaWtlIHRoZSBvcGVyYXRpb24gc3VjY2VlZGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTa2lwU3VjY2VzcyQoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgY29uc3Qgc3VjY2Vzc0FjdGlvbiA9IHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKFxuICAgICAgb3JpZ2luYWxBY3Rpb24sXG4gICAgICB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICB9XG4gICAgKTtcbiAgICAvLyBBbHRob3VnaCByZXR1cm5zIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIG9uZSB0aWNrIChieSB1c2luZyBhIHByb21pc2UpLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIG9mKHN1Y2Nlc3NBY3Rpb24pLnBpcGUoXG4gICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==