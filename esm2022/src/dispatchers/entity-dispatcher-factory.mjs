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
class EntityDispatcherFactory {
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
     * @param {IdSelector<T>} selectId
     */
    selectId = defaultSelectId, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     * @param {Partial<EntityDispatcherDefaultOptions>} defaultOptions
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDispatcherFactory, deps: [{ token: i1.EntityActionFactory }, { token: i2.Store }, { token: i3.EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: ENTITY_CACHE_SELECTOR_TOKEN }, { token: i4.CorrelationIdGenerator }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDispatcherFactory }); }
}
export { EntityDispatcherFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDispatcherFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityActionFactory }, { type: i2.Store }, { type: i3.EntityDispatcherDefaultOptions }, { type: i5.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ENTITY_CACHE_SELECTOR_TOKEN]
                }] }, { type: i4.CorrelationIdGenerator }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQWlCLHFCQUFxQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR25FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUk3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHckQsT0FBTyxFQUVMLDJCQUEyQixHQUM1QixNQUFNLG9DQUFvQyxDQUFDO0FBRTVDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7O0FBRWhFLHVEQUF1RDtBQUN2RCxNQUNhLHVCQUF1QjtJQVFsQyxZQUNVLG1CQUF3QyxFQUN4QyxLQUF5QixFQUN6Qiw4QkFBOEQsRUFDdkMsZUFBbUMsRUFFMUQsbUJBQXdDLEVBQ3hDLHNCQUE4QztRQU45Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLFVBQUssR0FBTCxLQUFLLENBQW9CO1FBQ3pCLG1DQUE4QixHQUE5Qiw4QkFBOEIsQ0FBZ0M7UUFHOUQsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBRXRELHVGQUF1RjtRQUN2RixzREFBc0Q7UUFDdEQsd0ZBQXdGO1FBQ3hGLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCx3RUFBd0U7UUFDeEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07SUFDSiw4QkFBOEI7SUFDOUIsVUFBa0I7SUFDbEI7Ozs7T0FJRztJQUNILFdBQTBCLGVBQWU7SUFDekM7OztPQUdHO0lBQ0gsaUJBQTBELEVBQUU7UUFFNUQsaURBQWlEO1FBQ2pELE1BQU0sT0FBTyxHQUFtQztZQUM5QyxHQUFHLElBQUksQ0FBQyw4QkFBOEI7WUFDdEMsR0FBRyxjQUFjO1NBQ2xCLENBQUM7UUFDRixPQUFPLElBQUksb0JBQW9CLENBQzdCLFVBQVUsRUFDVixJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLElBQUksQ0FBQyxLQUFLLEVBQ1YsUUFBUSxFQUNSLE9BQU8sRUFDUCxJQUFJLENBQUMsZUFBZSxFQUNwQixJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLElBQUksQ0FBQyxzQkFBc0IsQ0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQyxDQUFDO2lJQTlEVSx1QkFBdUIsd0hBWXhCLHFCQUFxQixhQUNyQiwyQkFBMkI7cUlBYjFCLHVCQUF1Qjs7U0FBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVU7OzBCQWFOLE1BQU07MkJBQUMscUJBQXFCOzswQkFDNUIsTUFBTTsyQkFBQywyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSwgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0IH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlUmVwbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOLFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJCYXNlIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlci1iYXNlJztcblxuLyoqIENyZWF0ZXMgRW50aXR5RGlzcGF0Y2hlcnMgZm9yIGVudGl0eSBjb2xsZWN0aW9ucyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj47XG4gIHByaXZhdGUgcmFTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+LFxuICAgIHByaXZhdGUgZW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgQEluamVjdChTY2FubmVkQWN0aW9uc1N1YmplY3QpIHNjYW5uZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOKVxuICAgIHByaXZhdGUgZW50aXR5Q2FjaGVTZWxlY3RvcjogRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICBwcml2YXRlIGNvcnJlbGF0aW9uSWRHZW5lcmF0b3I6IENvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgKSB7XG4gICAgLy8gUmVwbGF5IGJlY2F1c2Ugc29tZXRpbWVzIGluIHRlc3RzIHdpbGwgZmFrZSBkYXRhIHNlcnZpY2Ugd2l0aCBzeW5jaHJvbm91cyBvYnNlcnZhYmxlXG4gICAgLy8gd2hpY2ggbWFrZXMgc3Vic2NyaWJlciBtaXNzIHRoZSBkaXNwYXRjaGVkIGFjdGlvbnMuXG4gICAgLy8gT2YgY291cnNlIHRoYXQncyBhIHRlc3RpbmcgbWlzdGFrZS4gQnV0IGVhc3kgdG8gZm9yZ2V0LCBsZWFkaW5nIHRvIHBhaW5mdWwgZGVidWdnaW5nLlxuICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkID0gc2Nhbm5lZEFjdGlvbnMkLnBpcGUoc2hhcmVSZXBsYXkoMSkpO1xuICAgIC8vIFN0YXJ0IGxpc3RlbmluZyBzbyBsYXRlIHN1YnNjcmliZXIgd29uJ3QgbWlzcyB0aGUgbW9zdCByZWNlbnQgYWN0aW9uLlxuICAgIHRoaXMucmFTdWJzY3JpcHRpb24gPSB0aGlzLnJlZHVjZWRBY3Rpb25zJC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gYEVudGl0eURpc3BhdGNoZXJgIGZvciBhbiBlbnRpdHkgdHlwZSBgVGAgYW5kIHN0b3JlLlxuICAgKi9cbiAgY3JlYXRlPFQ+KFxuICAgIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSAqL1xuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHByaW1hcnkga2V5IGZvciBhbiBlbnRpdHkgYFRgLlxuICAgICAqIFVzdWFsbHkgYWNxdWlyZWQgZnJvbSBgRW50aXR5RGVmaW5pdGlvbmAgbWV0YWRhdGEuXG4gICAgICogQHBhcmFtIHtJZFNlbGVjdG9yPFQ+fSBzZWxlY3RJZFxuICAgICAqL1xuICAgIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+ID0gZGVmYXVsdFNlbGVjdElkLFxuICAgIC8qKiBEZWZhdWx0cyBmb3Igb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXMgd2hldGhlclxuICAgICAqIGBhZGQoKWAgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYztcbiAgICAgKiBAcGFyYW0ge1BhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPn0gZGVmYXVsdE9wdGlvbnNcbiAgICAgKi9cbiAgICBkZWZhdWx0T3B0aW9uczogUGFydGlhbDxFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM+ID0ge31cbiAgKTogRW50aXR5RGlzcGF0Y2hlcjxUPiB7XG4gICAgLy8gbWVyZ2Ugdy8gZGVmYXVsdE9wdGlvbnMgd2l0aCBpbmplY3RlZCBkZWZhdWx0c1xuICAgIGNvbnN0IG9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMuZW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IEVudGl0eURpc3BhdGNoZXJCYXNlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICAgIHRoaXMuc3RvcmUsXG4gICAgICBzZWxlY3RJZCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCxcbiAgICAgIHRoaXMuZW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAgIHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvclxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJhU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==