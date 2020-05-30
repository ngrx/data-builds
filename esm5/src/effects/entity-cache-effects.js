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
        { type: Injectable },
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
//# sourceMappingURL=entity-cache-effects.js.map