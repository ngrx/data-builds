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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFVLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVuRSxPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXZFLE9BQU8sRUFFTCwyQkFBMkIsR0FDNUIsTUFBTSxvQ0FBb0MsQ0FBQztBQUU1QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7OztBQUloRSxNQUFNLE9BQU8sdUJBQXVCOzs7Ozs7Ozs7SUFRbEMsWUFDVSxtQkFBd0MsRUFDeEMsS0FBeUIsRUFDekIsOEJBQThELEVBQ3ZDLGVBQW1DLEVBRTFELG1CQUF3QyxFQUN4QyxzQkFBOEM7UUFOOUMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUN6QixtQ0FBOEIsR0FBOUIsOEJBQThCLENBQWdDO1FBRzlELHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUV0RCx1RkFBdUY7UUFDdkYsc0RBQXNEO1FBQ3RELHdGQUF3RjtRQUN4RixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6RCxDQUFDOzs7Ozs7Ozs7SUFLRCxNQUFNO0lBQ0osOEJBQThCO0lBQzlCLFVBQWtCO0lBQ2xCOzs7T0FHRztJQUNILFdBQTBCLGVBQWU7SUFDekM7O09BRUc7SUFDSCxpQkFBMEQsRUFBRTs7O2NBR3RELE9BQU8scUJBQ1IsSUFBSSxDQUFDLDhCQUE4QixFQUNuQyxjQUFjLENBQ2xCO1FBQ0QsT0FBTyxJQUFJLG9CQUFvQixDQUM3QixVQUFVLEVBQ1YsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsS0FBSyxFQUNWLFFBQVEsRUFDUixPQUFPLEVBQ1AsSUFBSSxDQUFDLGVBQWUsRUFDcEIsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsc0JBQXNCLENBQzVCLENBQUM7SUFDSixDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDcEMsQ0FBQzs7O1lBN0RGLFVBQVU7Ozs7WUFWRixtQkFBbUI7WUFSWCxLQUFLO1lBTWIsOEJBQThCO1lBSjlCLFVBQVUsdUJBNkJkLE1BQU0sU0FBQyxxQkFBcUI7NENBQzVCLE1BQU0sU0FBQywyQkFBMkI7WUEzQjlCLHNCQUFzQjs7Ozs7Ozs7SUFtQjdCLGtEQUFvQzs7Ozs7SUFDcEMsaURBQXFDOzs7OztJQUduQyxzREFBZ0Q7Ozs7O0lBQ2hELHdDQUFpQzs7Ozs7SUFDakMsaUVBQXNFOzs7OztJQUV0RSxzREFDZ0Q7Ozs7O0lBQ2hELHlEQUFzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlLCBTY2FubmVkQWN0aW9uc1N1YmplY3QgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmVSZXBsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICBFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4sXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckJhc2UgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWJhc2UnO1xuXG4vKiogQ3JlYXRlcyBFbnRpdHlEaXNwYXRjaGVycyBmb3IgZW50aXR5IGNvbGxlY3Rpb25zICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPjtcbiAgcHJpdmF0ZSByYVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT4sXG4gICAgcHJpdmF0ZSBlbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICBASW5qZWN0KFNjYW5uZWRBY3Rpb25zU3ViamVjdCkgc2Nhbm5lZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj4sXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4pXG4gICAgcHJpdmF0ZSBlbnRpdHlDYWNoZVNlbGVjdG9yOiBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgIHByaXZhdGUgY29ycmVsYXRpb25JZEdlbmVyYXRvcjogQ29ycmVsYXRpb25JZEdlbmVyYXRvclxuICApIHtcbiAgICAvLyBSZXBsYXkgYmVjYXVzZSBzb21ldGltZXMgaW4gdGVzdHMgd2lsbCBmYWtlIGRhdGEgc2VydmljZSB3aXRoIHN5bmNocm9ub3VzIG9ic2VydmFibGVcbiAgICAvLyB3aGljaCBtYWtlcyBzdWJzY3JpYmVyIG1pc3MgdGhlIGRpc3BhdGNoZWQgYWN0aW9ucy5cbiAgICAvLyBPZiBjb3Vyc2UgdGhhdCdzIGEgdGVzdGluZyBtaXN0YWtlLiBCdXQgZWFzeSB0byBmb3JnZXQsIGxlYWRpbmcgdG8gcGFpbmZ1bCBkZWJ1Z2dpbmcuXG4gICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQgPSBzY2FubmVkQWN0aW9ucyQucGlwZShzaGFyZVJlcGxheSgxKSk7XG4gICAgLy8gU3RhcnQgbGlzdGVuaW5nIHNvIGxhdGUgc3Vic2NyaWJlciB3b24ndCBtaXNzIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24uXG4gICAgdGhpcy5yYVN1YnNjcmlwdGlvbiA9IHRoaXMucmVkdWNlZEFjdGlvbnMkLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBgRW50aXR5RGlzcGF0Y2hlcmAgZm9yIGFuIGVudGl0eSB0eXBlIGBUYCBhbmQgc3RvcmUuXG4gICAqL1xuICBjcmVhdGU8VD4oXG4gICAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlICovXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcHJpbWFyeSBrZXkgZm9yIGFuIGVudGl0eSBgVGAuXG4gICAgICogVXN1YWxseSBhY3F1aXJlZCBmcm9tIGBFbnRpdHlEZWZpbml0aW9uYCBtZXRhZGF0YS5cbiAgICAgKi9cbiAgICBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPiA9IGRlZmF1bHRTZWxlY3RJZCxcbiAgICAvKiogRGVmYXVsdHMgZm9yIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzIHdoZXRoZXJcbiAgICAgKiBgYWRkKClgIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWM7XG4gICAgICovXG4gICAgZGVmYXVsdE9wdGlvbnM6IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPiA9IHt9XG4gICk6IEVudGl0eURpc3BhdGNoZXI8VD4ge1xuICAgIC8vIG1lcmdlIHcvIGRlZmF1bHRPcHRpb25zIHdpdGggaW5qZWN0ZWQgZGVmYXVsdHNcbiAgICBjb25zdCBvcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLmVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBFbnRpdHlEaXNwYXRjaGVyQmFzZTxUPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgICB0aGlzLnN0b3JlLFxuICAgICAgc2VsZWN0SWQsXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQsXG4gICAgICB0aGlzLmVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgICB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yYVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=