import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntitySelectors$Factory } from '../selectors/entity-selectors$';
import { EntityCollectionServiceFactory } from './entity-collection-service-factory';
/** Core ingredients of an EntityServices class */
var EntityServicesElements = /** @class */ (function () {
    function EntityServicesElements(
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    entityCollectionServiceFactory, 
    /** Creates EntityDispatchers for entity collections */
    entityDispatcherFactory, 
    /** Creates observable EntitySelectors$ for entity collections. */
    entitySelectors$Factory, 
    /** The ngrx store, scoped to the EntityCache */
    store) {
        this.entityCollectionServiceFactory = entityCollectionServiceFactory;
        this.store = store;
        this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
        this.entityCache$ = entitySelectors$Factory.entityCache$;
        this.reducedActions$ = entityDispatcherFactory.reducedActions$;
    }
    EntityServicesElements = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [EntityCollectionServiceFactory,
            EntityDispatcherFactory,
            EntitySelectors$Factory,
            Store])
    ], EntityServicesElements);
    return EntityServicesElements;
}());
export { EntityServicesElements };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBVSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFLNUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDbkYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFckYsa0RBQWtEO0FBRWxEO0lBQ0U7SUFDRTs7O09BR0c7SUFDYSw4QkFBOEQ7SUFDOUUsdURBQXVEO0lBQ3ZELHVCQUFnRDtJQUNoRCxrRUFBa0U7SUFDbEUsdUJBQWdEO0lBQ2hELGdEQUFnRDtJQUNoQyxLQUF5QjtRQU56QixtQ0FBOEIsR0FBOUIsOEJBQThCLENBQWdDO1FBTTlELFVBQUssR0FBTCxLQUFLLENBQW9CO1FBRXpDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyx1QkFBdUIsQ0FBQyxtQkFBbUIsQ0FBQztRQUN2RSxJQUFJLENBQUMsWUFBWSxHQUFHLHVCQUF1QixDQUFDLFlBQVksQ0FBQztRQUN6RCxJQUFJLENBQUMsZUFBZSxHQUFHLHVCQUF1QixDQUFDLGVBQWUsQ0FBQztJQUNqRSxDQUFDO0lBakJVLHNCQUFzQjtRQURsQyxVQUFVLEVBQUU7aURBT3VDLDhCQUE4QjtZQUVyRCx1QkFBdUI7WUFFdkIsdUJBQXVCO1lBRXpCLEtBQUs7T0FabkIsc0JBQXNCLENBOEJsQztJQUFELDZCQUFDO0NBQUEsQUE5QkQsSUE4QkM7U0E5Qlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5cbi8qKiBDb3JlIGluZ3JlZGllbnRzIG9mIGFuIEVudGl0eVNlcnZpY2VzIGNsYXNzICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5U2VydmljZXNFbGVtZW50cyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzIGZvclxuICAgICAqIGEgY2FjaGVkIGNvbGxlY3Rpb24gb2YgVCBlbnRpdGllcyBpbiB0aGUgbmdyeCBzdG9yZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnksXG4gICAgLyoqIENyZWF0ZXMgRW50aXR5RGlzcGF0Y2hlcnMgZm9yIGVudGl0eSBjb2xsZWN0aW9ucyAqL1xuICAgIGVudGl0eURpc3BhdGNoZXJGYWN0b3J5OiBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICAvKiogQ3JlYXRlcyBvYnNlcnZhYmxlIEVudGl0eVNlbGVjdG9ycyQgZm9yIGVudGl0eSBjb2xsZWN0aW9ucy4gKi9cbiAgICBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeTogRW50aXR5U2VsZWN0b3JzJEZhY3RvcnksXG4gICAgLyoqIFRoZSBuZ3J4IHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHVibGljIHJlYWRvbmx5IHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT5cbiAgKSB7XG4gICAgdGhpcy5lbnRpdHlBY3Rpb25FcnJvcnMkID0gZW50aXR5U2VsZWN0b3JzJEZhY3RvcnkuZW50aXR5QWN0aW9uRXJyb3JzJDtcbiAgICB0aGlzLmVudGl0eUNhY2hlJCA9IGVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LmVudGl0eUNhY2hlJDtcbiAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCA9IGVudGl0eURpc3BhdGNoZXJGYWN0b3J5LnJlZHVjZWRBY3Rpb25zJDtcbiAgfVxuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICByZWFkb25seSBlbnRpdHlBY3Rpb25FcnJvcnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUgKi9cbiAgcmVhZG9ubHkgZW50aXR5Q2FjaGUkOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPiB8IFN0b3JlPEVudGl0eUNhY2hlPjtcblxuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICByZWFkb25seSByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPjtcbn1cbiJdfQ==