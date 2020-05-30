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
        { type: Injectable },
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
//# sourceMappingURL=entity-effects.js.map