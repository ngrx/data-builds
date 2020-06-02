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
 * Generated from: src/dispatchers/entity-dispatcher-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { Store, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { defaultSelectId } from '../utils/utilities';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { ENTITY_CACHE_SELECTOR_TOKEN, } from '../selectors/entity-cache-selector';
import { EntityDispatcherBase } from './entity-dispatcher-base';
/**
 * Creates EntityDispatchers for entity collections
 */
var EntityDispatcherFactory = /** @class */ (function () {
    function EntityDispatcherFactory(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
        this.entityCacheSelector = entityCacheSelector;
        this.correlationIdGenerator = correlationIdGenerator;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     */
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     * @template T
     * @param {?} entityName
     * @param {?=} selectId
     * @param {?=} defaultOptions
     * @return {?}
     */
    EntityDispatcherFactory.prototype.create = /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     * @template T
     * @param {?} entityName
     * @param {?=} selectId
     * @param {?=} defaultOptions
     * @return {?}
     */
    function (
    /** Name of the entity type */
    entityName, 
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     */
    selectId, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     */
    defaultOptions) {
        if (selectId === void 0) { selectId = defaultSelectId; }
        if (defaultOptions === void 0) { defaultOptions = {}; }
        // merge w/ defaultOptions with injected defaults
        /** @type {?} */
        var options = __assign(__assign({}, this.entityDispatcherDefaultOptions), defaultOptions);
        return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
    };
    /**
     * @return {?}
     */
    EntityDispatcherFactory.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.raSubscription.unsubscribe();
    };
    EntityDispatcherFactory.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EntityDispatcherFactory.ctorParameters = function () { return [
        { type: EntityActionFactory },
        { type: Store },
        { type: EntityDispatcherDefaultOptions },
        { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] },
        { type: CorrelationIdGenerator }
    ]; };
    return EntityDispatcherFactory;
}());
export { EntityDispatcherFactory };
if (false) {
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @type {?}
     */
    EntityDispatcherFactory.prototype.reducedActions$;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.raSubscription;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.entityActionFactory;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.store;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.entityDispatcherDefaultOptions;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.entityCacheSelector;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.correlationIdGenerator;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFVLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVuRSxPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXZFLE9BQU8sRUFFTCwyQkFBMkIsR0FDNUIsTUFBTSxvQ0FBb0MsQ0FBQztBQUU1QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7OztBQUdoRTtJQVNFLGlDQUNVLG1CQUF3QyxFQUN4QyxLQUF5QixFQUN6Qiw4QkFBOEQsRUFDdkMsZUFBbUMsRUFFMUQsbUJBQXdDLEVBQ3hDLHNCQUE4QztRQU45Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLFVBQUssR0FBTCxLQUFLLENBQW9CO1FBQ3pCLG1DQUE4QixHQUE5Qiw4QkFBOEIsQ0FBZ0M7UUFHOUQsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBRXRELHVGQUF1RjtRQUN2RixzREFBc0Q7UUFDdEQsd0ZBQXdGO1FBQ3hGLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCx3RUFBd0U7UUFDeEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFRDs7T0FFRzs7Ozs7Ozs7O0lBQ0gsd0NBQU07Ozs7Ozs7O0lBQU47SUFDRSw4QkFBOEI7SUFDOUIsVUFBa0I7SUFDbEI7OztPQUdHO0lBQ0gsUUFBeUM7SUFDekM7O09BRUc7SUFDSCxjQUE0RDtRQUo1RCx5QkFBQSxFQUFBLDBCQUF5QztRQUl6QywrQkFBQSxFQUFBLG1CQUE0RDs7O1lBR3RELE9BQU8seUJBQ1IsSUFBSSxDQUFDLDhCQUE4QixHQUNuQyxjQUFjLENBQ2xCO1FBQ0QsT0FBTyxJQUFJLG9CQUFvQixDQUM3QixVQUFVLEVBQ1YsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsS0FBSyxFQUNWLFFBQVEsRUFDUixPQUFPLEVBQ1AsSUFBSSxDQUFDLGVBQWUsRUFDcEIsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsc0JBQXNCLENBQzVCLENBQUM7SUFDSixDQUFDOzs7O0lBRUQsNkNBQVc7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQyxDQUFDOztnQkE3REYsVUFBVTs7OztnQkFWRixtQkFBbUI7Z0JBUlgsS0FBSztnQkFNYiw4QkFBOEI7Z0JBSjlCLFVBQVUsdUJBNkJkLE1BQU0sU0FBQyxxQkFBcUI7Z0RBQzVCLE1BQU0sU0FBQywyQkFBMkI7Z0JBM0I5QixzQkFBc0I7O0lBMkUvQiw4QkFBQztDQUFBLEFBOURELElBOERDO1NBN0RZLHVCQUF1Qjs7Ozs7OztJQUtsQyxrREFBb0M7Ozs7O0lBQ3BDLGlEQUFxQzs7Ozs7SUFHbkMsc0RBQWdEOzs7OztJQUNoRCx3Q0FBaUM7Ozs7O0lBQ2pDLGlFQUFzRTs7Ozs7SUFFdEUsc0RBQ2dEOzs7OztJQUNoRCx5REFBc0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSwgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0IH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlUmVwbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOLFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJCYXNlIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1iYXNlJztcblxuLyoqIENyZWF0ZXMgRW50aXR5RGlzcGF0Y2hlcnMgZm9yIGVudGl0eSBjb2xsZWN0aW9ucyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj47XG4gIHByaXZhdGUgcmFTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+LFxuICAgIHByaXZhdGUgZW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgQEluamVjdChTY2FubmVkQWN0aW9uc1N1YmplY3QpIHNjYW5uZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOKVxuICAgIHByaXZhdGUgZW50aXR5Q2FjaGVTZWxlY3RvcjogRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgKSB7XG4gICAgLy8gUmVwbGF5IGJlY2F1c2Ugc29tZXRpbWVzIGluIHRlc3RzIHdpbGwgZmFrZSBkYXRhIHNlcnZpY2Ugd2l0aCBzeW5jaHJvbm91cyBvYnNlcnZhYmxlXG4gICAgLy8gd2hpY2ggbWFrZXMgc3Vic2NyaWJlciBtaXNzIHRoZSBkaXNwYXRjaGVkIGFjdGlvbnMuXG4gICAgLy8gT2YgY291cnNlIHRoYXQncyBhIHRlc3RpbmcgbWlzdGFrZS4gQnV0IGVhc3kgdG8gZm9yZ2V0LCBsZWFkaW5nIHRvIHBhaW5mdWwgZGVidWdnaW5nLlxuICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkID0gc2Nhbm5lZEFjdGlvbnMkLnBpcGUoc2hhcmVSZXBsYXkoMSkpO1xuICAgIC8vIFN0YXJ0IGxpc3RlbmluZyBzbyBsYXRlIHN1YnNjcmliZXIgd29uJ3QgbWlzcyB0aGUgbW9zdCByZWNlbnQgYWN0aW9uLlxuICAgIHRoaXMucmFTdWJzY3JpcHRpb24gPSB0aGlzLnJlZHVjZWRBY3Rpb25zJC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gYEVudGl0eURpc3BhdGNoZXJgIGZvciBhbiBlbnRpdHkgdHlwZSBgVGAgYW5kIHN0b3JlLlxuICAgKi9cbiAgY3JlYXRlPFQ+KFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSAqL1xuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHByaW1hcnkga2V5IGZvciBhbiBlbnRpdHkgYFRgLlxuICAgICAqIFVzdWFsbHkgYWNxdWlyZWQgZnJvbSBgRW50aXR5RGVmaW5pdGlvbmAgbWV0YWRhdGEuXG4gICAgICovXG4gICAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4gPSBkZWZhdWx0U2VsZWN0SWQsXG4gICAgLyoqIERlZmF1bHRzIGZvciBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIGRpc3BhdGNoZXIgYmVoYXZpb3Igc3VjaCBhcyB3aGV0aGVyXG4gICAgICogYGFkZCgpYCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljO1xuICAgICAqL1xuICAgIGRlZmF1bHRPcHRpb25zOiBQYXJ0aWFsPEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucz4gPSB7fVxuICApOiBFbnRpdHlEaXNwYXRjaGVyPFQ+IHtcbiAgICAvLyBtZXJnZSB3LyBkZWZhdWx0T3B0aW9ucyB3aXRoIGluamVjdGVkIGRlZmF1bHRzXG4gICAgY29uc3Qgb3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5lbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgRW50aXR5RGlzcGF0Y2hlckJhc2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgICAgdGhpcy5zdG9yZSxcbiAgICAgIHNlbGVjdElkLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkLFxuICAgICAgdGhpcy5lbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgICAgdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmFTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19