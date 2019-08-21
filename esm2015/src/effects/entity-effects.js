/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { asyncScheduler, Observable, of, race } from 'rxjs';
import { catchError, delay, filter, map, mergeMap } from 'rxjs/operators';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { EntityOp, makeSuccessOp } from '../actions/entity-op';
import { ofEntityOp } from '../actions/entity-action-operators';
import { EntityDataService } from '../dataservices/entity-data.service';
import { PersistenceResultHandler } from '../dataservices/persistence-result-handler.service';
/** @type {?} */
export const persistOps = [
    EntityOp.QUERY_ALL,
    EntityOp.QUERY_LOAD,
    EntityOp.QUERY_BY_KEY,
    EntityOp.QUERY_MANY,
    EntityOp.SAVE_ADD_ONE,
    EntityOp.SAVE_DELETE_ONE,
    EntityOp.SAVE_UPDATE_ONE,
    EntityOp.SAVE_UPSERT_ONE,
];
export class EntityEffects {
    /**
     * @param {?} actions
     * @param {?} dataService
     * @param {?} entityActionFactory
     * @param {?} resultHandler
     * @param {?} scheduler
     */
    constructor(actions, dataService, entityActionFactory, resultHandler, scheduler) {
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
        this.cancel$ = this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((/**
         * @param {?} action
         * @return {?}
         */
        (action) => action.payload.correlationId)), filter((/**
         * @param {?} id
         * @return {?}
         */
        id => id != null)));
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = this.actions.pipe(ofEntityOp(persistOps), mergeMap((/**
         * @param {?} action
         * @return {?}
         */
        action => this.persist(action))));
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param {?} action A persistence operation EntityAction
     * @return {?}
     */
    persist(action) {
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
            const c = this.cancel$.pipe(filter((/**
             * @param {?} id
             * @return {?}
             */
            id => action.payload.correlationId === id)), map((/**
             * @param {?} id
             * @return {?}
             */
            id => this.entityActionFactory.createFromAction(action, {
                entityOp: EntityOp.CANCELED_PERSIST,
            }))));
            // Data: entity collection DataService result as a successful persistence EntityAction
            /** @type {?} */
            const d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    }
    /**
     * @private
     * @param {?} action
     * @return {?}
     */
    callDataService(action) {
        const { entityName, entityOp, data } = action.payload;
        /** @type {?} */
        const service = this.dataService.getService(entityName);
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
                const { id, changes } = (/** @type {?} */ (data));
                return service.update(data).pipe(map((/**
                 * @param {?} updatedEntity
                 * @return {?}
                 */
                updatedEntity => {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    /** @type {?} */
                    const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    /** @type {?} */
                    const responseData = hasData
                        ? { id, changes: Object.assign({}, changes, updatedEntity), changed: true }
                        : { id, changes, changed: false };
                    return responseData;
                })));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(map((/**
                 * @param {?} upsertedEntity
                 * @return {?}
                 */
                upsertedEntity => {
                    /** @type {?} */
                    const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                })));
            default:
                throw new Error(`Persistence action "${entityOp}" is not implemented.`);
        }
    }
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     * @private
     * @param {?} action
     * @return {?}
     */
    handleError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (/**
         * @param {?} error
         * @return {?}
         */
        (error) => of(this.resultHandler.handleError(action)(error)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler)));
    }
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     * @private
     * @param {?} originalAction
     * @return {?}
     */
    handleSkipSuccess$(originalAction) {
        /** @type {?} */
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        /** @type {?} */
        const successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
}
EntityEffects.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityEffects.ctorParameters = () => [
    { type: Actions },
    { type: EntityDataService },
    { type: EntityActionFactory },
    { type: PersistenceResultHandler },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
];
tslib_1.__decorate([
    Effect({ dispatch: false }),
    tslib_1.__metadata("design:type", Observable)
], EntityEffects.prototype, "cancel$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Observable)
], EntityEffects.prototype, "persist$", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBaUIsTUFBTSxNQUFNLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUcxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUdoRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQzs7QUFFOUYsTUFBTSxPQUFPLFVBQVUsR0FBZTtJQUNwQyxRQUFRLENBQUMsU0FBUztJQUNsQixRQUFRLENBQUMsVUFBVTtJQUNuQixRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRLENBQUMsVUFBVTtJQUNuQixRQUFRLENBQUMsWUFBWTtJQUNyQixRQUFRLENBQUMsZUFBZTtJQUN4QixRQUFRLENBQUMsZUFBZTtJQUN4QixRQUFRLENBQUMsZUFBZTtD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akIsbUJBQW1CO1lBT25CLHdCQUF3Qjs0Q0E4QzVCLFFBQVEsWUFDUixNQUFNLFNBQUMsd0JBQXdCOztBQXhCbEM7SUFEQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7c0NBQ25CLFVBQVU7OENBSWpCO0FBSUY7SUFGQyxNQUFNLEVBQUU7c0NBRUMsVUFBVTsrQ0FHbEI7Ozs7Ozs7SUFqQkYsc0NBQTJCOzs7OztJQUszQixnQ0FLRTs7SUFFRixpQ0FLRTs7Ozs7SUFHQSxnQ0FBc0M7Ozs7O0lBQ3RDLG9DQUFzQzs7Ozs7SUFDdEMsNENBQWdEOzs7OztJQUNoRCxzQ0FBK0M7Ozs7Ozs7O0lBTS9DLGtDQUVnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIEVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIsIE9ic2VydmFibGUsIG9mLCByYWNlLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgZmlsdGVyLCBtYXAsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IEVudGl0eU9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgb2ZFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgcGVyc2lzdE9wczogRW50aXR5T3BbXSA9IFtcbiAgRW50aXR5T3AuUVVFUllfQUxMLFxuICBFbnRpdHlPcC5RVUVSWV9MT0FELFxuICBFbnRpdHlPcC5RVUVSWV9CWV9LRVksXG4gIEVudGl0eU9wLlFVRVJZX01BTlksXG4gIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIG5vbi1udWxsIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbiBpZHMgZnJvbSBDQU5DRUxfUEVSU0lTVCBhY3Rpb25zXG4gICAqL1xuICBARWZmZWN0KHsgZGlzcGF0Y2g6IGZhbHNlIH0pXG4gIGNhbmNlbCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuYWN0aW9ucy5waXBlKFxuICAgIG9mRW50aXR5T3AoRW50aXR5T3AuQ0FOQ0VMX1BFUlNJU1QpLFxuICAgIG1hcCgoYWN0aW9uOiBFbnRpdHlBY3Rpb24pID0+IGFjdGlvbi5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgIGZpbHRlcihpZCA9PiBpZCAhPSBudWxsKVxuICApO1xuXG4gIEBFZmZlY3QoKVxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBwZXJzaXN0JDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgb2ZFbnRpdHlPcChwZXJzaXN0T3BzKSxcbiAgICBtZXJnZU1hcChhY3Rpb24gPT4gdGhpcy5wZXJzaXN0KGFjdGlvbikpXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zPEVudGl0eUFjdGlvbj4sXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgcmVzdWx0SGFuZGxlcjogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIEEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIEVudGl0eUFjdGlvblxuICAgKi9cbiAgcGVyc2lzdChhY3Rpb246IEVudGl0eUFjdGlvbik6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLnNraXApIHtcbiAgICAgIC8vIFNob3VsZCBub3QgcGVyc2lzdC4gUHJldGVuZCBpdCBzdWNjZWVkZWQuXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTa2lwU3VjY2VzcyQoYWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZSBvZiBDQU5DRUxFRF9QRVJTSVNUIGZvciBhIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5jYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcihpZCA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkID09PSBpZCksXG4gICAgICAgIG1hcChpZCA9PlxuICAgICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKGFjdGlvbiwge1xuICAgICAgICAgICAgZW50aXR5T3A6IEVudGl0eU9wLkNBTkNFTEVEX1BFUlNJU1QsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogZW50aXR5IGNvbGxlY3Rpb24gRGF0YVNlcnZpY2UgcmVzdWx0IGFzIGEgc3VjY2Vzc2Z1bCBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmNhbGxEYXRhU2VydmljZShhY3Rpb24pLnBpcGUoXG4gICAgICAgIG1hcCh0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlU3VjY2VzcyhhY3Rpb24pKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYWxsRGF0YVNlcnZpY2UoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICBjb25zdCB7IGVudGl0eU5hbWUsIGVudGl0eU9wLCBkYXRhIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5kYXRhU2VydmljZS5nZXRTZXJ2aWNlKGVudGl0eU5hbWUpO1xuICAgIHN3aXRjaCAoZW50aXR5T3ApIHtcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQUxMOlxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9MT0FEOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRBbGwoKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9CWV9LRVk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEJ5SWQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTUFOWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0V2l0aFF1ZXJ5KGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfQUREX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuYWRkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZGVsZXRlKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORTpcbiAgICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YSBhcyBVcGRhdGU8YW55PjsgLy8gZGF0YSBtdXN0IGJlIFVwZGF0ZTxUPlxuICAgICAgICByZXR1cm4gc2VydmljZS51cGRhdGUoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAodXBkYXRlZEVudGl0eSA9PiB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gYW4gVXBkYXRlPFQ+IHdpdGggdXBkYXRlZCBlbnRpdHkgZGF0YS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciByZXR1cm5lZCBlbnRpdHkgZGF0YSwgbWVyZ2Ugd2l0aCB0aGUgY2hhbmdlcyB0aGF0IHdlcmUgc2VudFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgJ2NoYW5nZWQnIGZsYWcgdG8gdHJ1ZS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YSxcbiAgICAgICAgICAgIC8vIGFzc3VtZSBpdCBtYWRlIG5vIGFkZGl0aW9uYWwgY2hhbmdlcyBvZiBpdHMgb3duLCByZXR1cm4gdGhlIG9yaWdpbmFsIGNoYW5nZXMsXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSBgY2hhbmdlZGAgZmxhZyB0byBgZmFsc2VgLlxuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwZGF0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBkYXRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPGFueT4gPSBoYXNEYXRhXG4gICAgICAgICAgICAgID8geyBpZCwgY2hhbmdlczogeyAuLi5jaGFuZ2VzLCAuLi51cGRhdGVkRW50aXR5IH0sIGNoYW5nZWQ6IHRydWUgfVxuICAgICAgICAgICAgICA6IHsgaWQsIGNoYW5nZXMsIGNoYW5nZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS51cHNlcnQoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAodXBzZXJ0ZWRFbnRpdHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwc2VydGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwc2VydGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIGhhc0RhdGEgPyB1cHNlcnRlZEVudGl0eSA6IGRhdGE7IC8vIGVuc3VyZSBhIHJldHVybmVkIGVudGl0eSB2YWx1ZS5cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQZXJzaXN0ZW5jZSBhY3Rpb24gXCIke2VudGl0eU9wfVwiIGlzIG5vdCBpbXBsZW1lbnRlZC5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uLFxuICAgKiByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IkKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChlcnJvcjogRXJyb3IpID0+IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycm9yOiBFcnJvcikgPT5cbiAgICAgIG9mKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVFcnJvcihhY3Rpb24pKGVycm9yKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQmVjYXVzZSBFbnRpdHlBY3Rpb24ucGF5bG9hZC5za2lwIGlzIHRydWUsIHNraXAgdGhlIHBlcnNpc3RlbmNlIHN0ZXAgYW5kXG4gICAqIHJldHVybiBhIHNjYWxhciBzdWNjZXNzIGFjdGlvbiB0aGF0IGxvb2tzIGxpa2UgdGhlIG9wZXJhdGlvbiBzdWNjZWVkZWQuXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZVNraXBTdWNjZXNzJChcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICBjb25zdCBzdWNjZXNzQWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oXG4gICAgICBvcmlnaW5hbEFjdGlvbixcbiAgICAgIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEFsdGhvdWdoIHJldHVybnMgaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgb25lIHRpY2sgKGJ5IHVzaW5nIGEgcHJvbWlzZSksXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gb2Yoc3VjY2Vzc0FjdGlvbikucGlwZShcbiAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgKTtcbiAgfVxufVxuIl19