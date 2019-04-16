/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
export class EntityDispatcherFactory {
    /**
     * @param {?} entityActionFactory
     * @param {?} store
     * @param {?} entityDispatcherDefaultOptions
     * @param {?} scannedActions$
     * @param {?} entityCacheSelector
     * @param {?} correlationIdGenerator
     */
    constructor(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
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
     * @template T
     * @param {?} entityName
     * @param {?=} selectId
     * @param {?=} defaultOptions
     * @return {?}
     */
    create(
    /** Name of the entity type */
    entityName, 
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     */
    selectId = defaultSelectId, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     */
    defaultOptions = {}) {
        // merge w/ defaultOptions with injected defaults
        /** @type {?} */
        const options = Object.assign({}, this.entityDispatcherDefaultOptions, defaultOptions);
        return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.raSubscription.unsubscribe();
    }
}
EntityDispatcherFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityDispatcherFactory.ctorParameters = () => [
    { type: EntityActionFactory },
    { type: Store },
    { type: EntityDispatcherDefaultOptions },
    { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] },
    { type: CorrelationIdGenerator }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFVLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVuRSxPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckYsT0FBTyxFQUFFLGVBQWUsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQztBQUV0RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUV2RSxPQUFPLEVBRUwsMkJBQTJCLEdBRTVCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7QUFNaEUsTUFBTSxPQUFPLHVCQUF1Qjs7Ozs7Ozs7O0lBUWxDLFlBQ1UsbUJBQXdDLEVBQ3hDLEtBQXlCLEVBQ3pCLDhCQUE4RCxFQUN2QyxlQUFtQyxFQUUxRCxtQkFBd0MsRUFDeEMsc0JBQThDO1FBTjlDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFDekIsbUNBQThCLEdBQTlCLDhCQUE4QixDQUFnQztRQUc5RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFFdEQsdUZBQXVGO1FBQ3ZGLHNEQUFzRDtRQUN0RCx3RkFBd0Y7UUFDeEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekQsQ0FBQzs7Ozs7Ozs7O0lBS0QsTUFBTTtJQUNKLDhCQUE4QjtJQUM5QixVQUFrQjtJQUNsQjs7O09BR0c7SUFDSCxXQUEwQixlQUFlO0lBQ3pDOztPQUVHO0lBQ0gsaUJBQTBELEVBQUU7OztjQUd0RCxPQUFPLHFCQUNSLElBQUksQ0FBQyw4QkFBOEIsRUFDbkMsY0FBYyxDQUNsQjtRQUNELE9BQU8sSUFBSSxvQkFBb0IsQ0FDN0IsVUFBVSxFQUNWLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsSUFBSSxDQUFDLEtBQUssRUFDVixRQUFRLEVBQ1IsT0FBTyxFQUNQLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsSUFBSSxDQUFDLHNCQUFzQixDQUM1QixDQUFDO0lBQ0osQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BDLENBQUM7OztZQTdERixVQUFVOzs7O1lBYkYsbUJBQW1CO1lBVFgsS0FBSztZQU1iLDhCQUE4QjtZQUo5QixVQUFVLHVCQWlDZCxNQUFNLFNBQUMscUJBQXFCOzRDQUM1QixNQUFNLFNBQUMsMkJBQTJCO1lBL0I5QixzQkFBc0I7Ozs7Ozs7O0lBdUI3QixrREFBb0M7Ozs7O0lBQ3BDLGlEQUFxQzs7Ozs7SUFHbkMsc0RBQWdEOzs7OztJQUNoRCx3Q0FBaUM7Ozs7O0lBQ2pDLGlFQUFzRTs7Ozs7SUFFdEUsc0RBQ2dEOzs7OztJQUNoRCx5REFBc0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSwgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0IH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmVSZXBsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkLCB0b1VwZGF0ZUZhY3RvcnkgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICBFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4sXG4gIGNyZWF0ZUVudGl0eUNhY2hlU2VsZWN0b3IsXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckJhc2UgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWJhc2UnO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBRdWVyeVBhcmFtcyB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9pbnRlcmZhY2VzJztcblxuLyoqIENyZWF0ZXMgRW50aXR5RGlzcGF0Y2hlcnMgZm9yIGVudGl0eSBjb2xsZWN0aW9ucyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj47XG4gIHByaXZhdGUgcmFTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+LFxuICAgIHByaXZhdGUgZW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgQEluamVjdChTY2FubmVkQWN0aW9uc1N1YmplY3QpIHNjYW5uZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOKVxuICAgIHByaXZhdGUgZW50aXR5Q2FjaGVTZWxlY3RvcjogRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgKSB7XG4gICAgLy8gUmVwbGF5IGJlY2F1c2Ugc29tZXRpbWVzIGluIHRlc3RzIHdpbGwgZmFrZSBkYXRhIHNlcnZpY2Ugd2l0aCBzeW5jaHJvbm91cyBvYnNlcnZhYmxlXG4gICAgLy8gd2hpY2ggbWFrZXMgc3Vic2NyaWJlciBtaXNzIHRoZSBkaXNwYXRjaGVkIGFjdGlvbnMuXG4gICAgLy8gT2YgY291cnNlIHRoYXQncyBhIHRlc3RpbmcgbWlzdGFrZS4gQnV0IGVhc3kgdG8gZm9yZ2V0LCBsZWFkaW5nIHRvIHBhaW5mdWwgZGVidWdnaW5nLlxuICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkID0gc2Nhbm5lZEFjdGlvbnMkLnBpcGUoc2hhcmVSZXBsYXkoMSkpO1xuICAgIC8vIFN0YXJ0IGxpc3RlbmluZyBzbyBsYXRlIHN1YnNjcmliZXIgd29uJ3QgbWlzcyB0aGUgbW9zdCByZWNlbnQgYWN0aW9uLlxuICAgIHRoaXMucmFTdWJzY3JpcHRpb24gPSB0aGlzLnJlZHVjZWRBY3Rpb25zJC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gYEVudGl0eURpc3BhdGNoZXJgIGZvciBhbiBlbnRpdHkgdHlwZSBgVGAgYW5kIHN0b3JlLlxuICAgKi9cbiAgY3JlYXRlPFQ+KFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSAqL1xuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHByaW1hcnkga2V5IGZvciBhbiBlbnRpdHkgYFRgLlxuICAgICAqIFVzdWFsbHkgYWNxdWlyZWQgZnJvbSBgRW50aXR5RGVmaW5pdGlvbmAgbWV0YWRhdGEuXG4gICAgICovXG4gICAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4gPSBkZWZhdWx0U2VsZWN0SWQsXG4gICAgLyoqIERlZmF1bHRzIGZvciBvcHRpb25zIHRoYXQgaW5mbHVlbmNlIGRpc3BhdGNoZXIgYmVoYXZpb3Igc3VjaCBhcyB3aGV0aGVyXG4gICAgICogYGFkZCgpYCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljO1xuICAgICAqL1xuICAgIGRlZmF1bHRPcHRpb25zOiBQYXJ0aWFsPEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucz4gPSB7fVxuICApOiBFbnRpdHlEaXNwYXRjaGVyPFQ+IHtcbiAgICAvLyBtZXJnZSB3LyBkZWZhdWx0T3B0aW9ucyB3aXRoIGluamVjdGVkIGRlZmF1bHRzXG4gICAgY29uc3Qgb3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5lbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgRW50aXR5RGlzcGF0Y2hlckJhc2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgICAgdGhpcy5zdG9yZSxcbiAgICAgIHNlbGVjdElkLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkLFxuICAgICAgdGhpcy5lbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgICAgdGhpcy5jb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmFTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19