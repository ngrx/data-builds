import { Inject, Injectable } from '@angular/core';
import { ScannedActionsSubject } from '@ngrx/store';
import { shareReplay } from 'rxjs/operators';
import { defaultSelectId } from '../utils/utilities';
import { ENTITY_CACHE_SELECTOR_TOKEN, } from '../selectors/entity-cache-selector';
import { EntityDispatcherBase } from './entity-dispatcher-base';
import * as i0 from "@angular/core";
import * as i1 from "../actions/entity-action-factory";
import * as i2 from "@ngrx/store";
import * as i3 from "./entity-dispatcher-default-options";
import * as i4 from "../utils/correlation-id-generator";
import * as i5 from "rxjs";
/** Creates EntityDispatchers for entity collections */
export class EntityDispatcherFactory {
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
        const options = {
            ...this.entityDispatcherDefaultOptions,
            ...defaultOptions,
        };
        return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
    }
    ngOnDestroy() {
        this.raSubscription.unsubscribe();
    }
}
/** @nocollapse */ /** @nocollapse */ EntityDispatcherFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: EntityDispatcherFactory, deps: [{ token: i1.EntityActionFactory }, { token: i2.Store }, { token: i3.EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: ENTITY_CACHE_SELECTOR_TOKEN }, { token: i4.CorrelationIdGenerator }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ /** @nocollapse */ EntityDispatcherFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: EntityDispatcherFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: EntityDispatcherFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityActionFactory }, { type: i2.Store }, { type: i3.EntityDispatcherDefaultOptions }, { type: i5.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ENTITY_CACHE_SELECTOR_TOKEN]
                }] }, { type: i4.CorrelationIdGenerator }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQWlCLHFCQUFxQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR25FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUk3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHckQsT0FBTyxFQUVMLDJCQUEyQixHQUM1QixNQUFNLG9DQUFvQyxDQUFDO0FBRTVDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7O0FBRWhFLHVEQUF1RDtBQUV2RCxNQUFNLE9BQU8sdUJBQXVCO0lBUWxDLFlBQ1UsbUJBQXdDLEVBQ3hDLEtBQXlCLEVBQ3pCLDhCQUE4RCxFQUN2QyxlQUFtQyxFQUUxRCxtQkFBd0MsRUFDeEMsc0JBQThDO1FBTjlDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFDekIsbUNBQThCLEdBQTlCLDhCQUE4QixDQUFnQztRQUc5RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFFdEQsdUZBQXVGO1FBQ3ZGLHNEQUFzRDtRQUN0RCx3RkFBd0Y7UUFDeEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTTtJQUNKLDhCQUE4QjtJQUM5QixVQUFrQjtJQUNsQjs7O09BR0c7SUFDSCxXQUEwQixlQUFlO0lBQ3pDOztPQUVHO0lBQ0gsaUJBQTBELEVBQUU7UUFFNUQsaURBQWlEO1FBQ2pELE1BQU0sT0FBTyxHQUFtQztZQUM5QyxHQUFHLElBQUksQ0FBQyw4QkFBOEI7WUFDdEMsR0FBRyxjQUFjO1NBQ2xCLENBQUM7UUFDRixPQUFPLElBQUksb0JBQW9CLENBQzdCLFVBQVUsRUFDVixJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLElBQUksQ0FBQyxLQUFLLEVBQ1YsUUFBUSxFQUNSLE9BQU8sRUFDUCxJQUFJLENBQUMsZUFBZSxFQUNwQixJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLElBQUksQ0FBQyxzQkFBc0IsQ0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQyxDQUFDOzswSkE1RFUsdUJBQXVCLHdIQVl4QixxQkFBcUIsYUFDckIsMkJBQTJCOzhKQWIxQix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVTs7MEJBYU4sTUFBTTsyQkFBQyxxQkFBcUI7OzBCQUM1QixNQUFNOzJCQUFDLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlLCBTY2FubmVkQWN0aW9uc1N1YmplY3QgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmVSZXBsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICBFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4sXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckJhc2UgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWJhc2UnO1xuXG4vKiogQ3JlYXRlcyBFbnRpdHlEaXNwYXRjaGVycyBmb3IgZW50aXR5IGNvbGxlY3Rpb25zICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPjtcbiAgcHJpdmF0ZSByYVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT4sXG4gICAgcHJpdmF0ZSBlbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICBASW5qZWN0KFNjYW5uZWRBY3Rpb25zU3ViamVjdCkgc2Nhbm5lZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj4sXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4pXG4gICAgcHJpdmF0ZSBlbnRpdHlDYWNoZVNlbGVjdG9yOiBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICAgIHByaXZhdGUgY29ycmVsYXRpb25JZEdlbmVyYXRvcjogQ29ycmVsYXRpb25JZEdlbmVyYXRvclxuICApIHtcbiAgICAvLyBSZXBsYXkgYmVjYXVzZSBzb21ldGltZXMgaW4gdGVzdHMgd2lsbCBmYWtlIGRhdGEgc2VydmljZSB3aXRoIHN5bmNocm9ub3VzIG9ic2VydmFibGVcbiAgICAvLyB3aGljaCBtYWtlcyBzdWJzY3JpYmVyIG1pc3MgdGhlIGRpc3BhdGNoZWQgYWN0aW9ucy5cbiAgICAvLyBPZiBjb3Vyc2UgdGhhdCdzIGEgdGVzdGluZyBtaXN0YWtlLiBCdXQgZWFzeSB0byBmb3JnZXQsIGxlYWRpbmcgdG8gcGFpbmZ1bCBkZWJ1Z2dpbmcuXG4gICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQgPSBzY2FubmVkQWN0aW9ucyQucGlwZShzaGFyZVJlcGxheSgxKSk7XG4gICAgLy8gU3RhcnQgbGlzdGVuaW5nIHNvIGxhdGUgc3Vic2NyaWJlciB3b24ndCBtaXNzIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24uXG4gICAgdGhpcy5yYVN1YnNjcmlwdGlvbiA9IHRoaXMucmVkdWNlZEFjdGlvbnMkLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBgRW50aXR5RGlzcGF0Y2hlcmAgZm9yIGFuIGVudGl0eSB0eXBlIGBUYCBhbmQgc3RvcmUuXG4gICAqL1xuICBjcmVhdGU8VD4oXG4gICAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlICovXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcHJpbWFyeSBrZXkgZm9yIGFuIGVudGl0eSBgVGAuXG4gICAgICogVXN1YWxseSBhY3F1aXJlZCBmcm9tIGBFbnRpdHlEZWZpbml0aW9uYCBtZXRhZGF0YS5cbiAgICAgKi9cbiAgICBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPiA9IGRlZmF1bHRTZWxlY3RJZCxcbiAgICAvKiogRGVmYXVsdHMgZm9yIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzIHdoZXRoZXJcbiAgICAgKiBgYWRkKClgIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWM7XG4gICAgICovXG4gICAgZGVmYXVsdE9wdGlvbnM6IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPiA9IHt9XG4gICk6IEVudGl0eURpc3BhdGNoZXI8VD4ge1xuICAgIC8vIG1lcmdlIHcvIGRlZmF1bHRPcHRpb25zIHdpdGggaW5qZWN0ZWQgZGVmYXVsdHNcbiAgICBjb25zdCBvcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLmVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBFbnRpdHlEaXNwYXRjaGVyQmFzZTxUPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgICB0aGlzLnN0b3JlLFxuICAgICAgc2VsZWN0SWQsXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQsXG4gICAgICB0aGlzLmVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgICB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yYVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=