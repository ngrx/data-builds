/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntitySelectors$Factory } from '../selectors/entity-selectors$';
import { EntityCollectionServiceFactory } from './entity-collection-service-factory';
/**
 * Core ingredients of an EntityServices class
 */
export class EntityServicesElements {
    /**
     * @param {?} entityCollectionServiceFactory
     * @param {?} entityDispatcherFactory
     * @param {?} entitySelectors$Factory
     * @param {?} store
     */
    constructor(entityCollectionServiceFactory, 
    /** Creates EntityDispatchers for entity collections */
    entityDispatcherFactory, 
    /** Creates observable EntitySelectors$ for entity collections. */
    entitySelectors$Factory, store) {
        this.entityCollectionServiceFactory = entityCollectionServiceFactory;
        this.store = store;
        this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
        this.entityCache$ = entitySelectors$Factory.entityCache$;
        this.reducedActions$ = entityDispatcherFactory.reducedActions$;
    }
}
EntityServicesElements.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityServicesElements.ctorParameters = () => [
    { type: EntityCollectionServiceFactory },
    { type: EntityDispatcherFactory },
    { type: EntitySelectors$Factory },
    { type: Store }
];
if (false) {
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @type {?}
     */
    EntityServicesElements.prototype.entityActionErrors$;
    /**
     * Observable of the entire entity cache
     * @type {?}
     */
    EntityServicesElements.prototype.entityCache$;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @type {?}
     */
    EntityServicesElements.prototype.reducedActions$;
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     * @type {?}
     */
    EntityServicesElements.prototype.entityCollectionServiceFactory;
    /**
     * The ngrx store, scoped to the EntityCache
     * @type {?}
     */
    EntityServicesElements.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBVSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFLNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDbkYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scUNBQXFDLENBQUM7Ozs7QUFJckYsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7OztJQUNqQyxZQUtrQiw4QkFBOEQ7SUFDOUUsdURBQXVEO0lBQ3ZELHVCQUFnRDtJQUNoRCxrRUFBa0U7SUFDbEUsdUJBQWdELEVBRWhDLEtBQXlCO1FBTnpCLG1DQUE4QixHQUE5Qiw4QkFBOEIsQ0FBZ0M7UUFNOUQsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFFekMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLHVCQUF1QixDQUFDLG1CQUFtQixDQUFDO1FBQ3ZFLElBQUksQ0FBQyxZQUFZLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDO1FBQ3pELElBQUksQ0FBQyxlQUFlLEdBQUcsdUJBQXVCLENBQUMsZUFBZSxDQUFDO0lBQ2pFLENBQUM7OztZQWxCRixVQUFVOzs7O1lBSEYsOEJBQThCO1lBRjlCLHVCQUF1QjtZQUN2Qix1QkFBdUI7WUFOZixLQUFLOzs7Ozs7O0lBK0JwQixxREFBdUQ7Ozs7O0lBR3ZELDhDQUFvRTs7Ozs7O0lBTXBFLGlEQUE2Qzs7Ozs7O0lBdkIzQyxnRUFBOEU7Ozs7O0lBTTlFLHVDQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnkgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWZhY3RvcnknO1xuXG4vKiogQ29yZSBpbmdyZWRpZW50cyBvZiBhbiBFbnRpdHlTZXJ2aWNlcyBjbGFzcyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eVNlcnZpY2VzRWxlbWVudHMge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGluc3RhbmNlcyBmb3JcbiAgICAgKiBhIGNhY2hlZCBjb2xsZWN0aW9uIG9mIFQgZW50aXRpZXMgaW4gdGhlIG5ncnggc3RvcmUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5LFxuICAgIC8qKiBDcmVhdGVzIEVudGl0eURpc3BhdGNoZXJzIGZvciBlbnRpdHkgY29sbGVjdGlvbnMgKi9cbiAgICBlbnRpdHlEaXNwYXRjaGVyRmFjdG9yeTogRW50aXR5RGlzcGF0Y2hlckZhY3RvcnksXG4gICAgLyoqIENyZWF0ZXMgb2JzZXJ2YWJsZSBFbnRpdHlTZWxlY3RvcnMkIGZvciBlbnRpdHkgY29sbGVjdGlvbnMuICovXG4gICAgZW50aXR5U2VsZWN0b3JzJEZhY3Rvcnk6IEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxuICAgIC8qKiBUaGUgbmdyeCBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+XG4gICkge1xuICAgIHRoaXMuZW50aXR5QWN0aW9uRXJyb3JzJCA9IGVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LmVudGl0eUFjdGlvbkVycm9ycyQ7XG4gICAgdGhpcy5lbnRpdHlDYWNoZSQgPSBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeS5lbnRpdHlDYWNoZSQ7XG4gICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQgPSBlbnRpdHlEaXNwYXRjaGVyRmFjdG9yeS5yZWR1Y2VkQWN0aW9ucyQ7XG4gIH1cblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBFbnRpdHlBY3Rpb25zIChlLmcuIFFVRVJZX0FMTF9FUlJPUikgZm9yIGFsbCBlbnRpdHkgdHlwZXMgKi9cbiAgcmVhZG9ubHkgZW50aXR5QWN0aW9uRXJyb3JzJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpcmUgZW50aXR5IGNhY2hlICovXG4gIHJlYWRvbmx5IGVudGl0eUNhY2hlJDogT2JzZXJ2YWJsZTxFbnRpdHlDYWNoZT4gfCBTdG9yZTxFbnRpdHlDYWNoZT47XG5cbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj47XG59XG4iXX0=