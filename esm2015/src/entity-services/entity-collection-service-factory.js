/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase } from './entity-collection-service-base';
import { EntityCollectionServiceElementsFactory } from './entity-collection-service-elements-factory';
/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
export class EntityCollectionServiceFactory {
    /**
     * @param {?} entityCollectionServiceElementsFactory
     */
    constructor(entityCollectionServiceElementsFactory) {
        this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
    }
    /**
     * Create an EntityCollectionService for an entity type
     * @template T, S$
     * @param {?} entityName - name of the entity type
     * @return {?}
     */
    create(entityName) {
        return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
    }
}
EntityCollectionServiceFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionServiceFactory.ctorParameters = () => [
    { type: EntityCollectionServiceElementsFactory }
];
if (false) {
    /**
     * Creates the core elements of the EntityCollectionService for an entity type.
     * @type {?}
     */
    EntityCollectionServiceFactory.prototype.entityCollectionServiceElementsFactory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7OztBQVF0RyxNQUFNLE9BQU8sOEJBQThCOzs7O0lBQ3pDLFlBRVMsc0NBQThFO1FBQTlFLDJDQUFzQyxHQUF0QyxzQ0FBc0MsQ0FBd0M7SUFDcEYsQ0FBQzs7Ozs7OztJQU1KLE1BQU0sQ0FDSixVQUFrQjtRQUVsQixPQUFPLElBQUksMkJBQTJCLENBQ3BDLFVBQVUsRUFDVixJQUFJLENBQUMsc0NBQXNDLENBQzVDLENBQUM7SUFDSixDQUFDOzs7WUFsQkYsVUFBVTs7OztZQVBGLHNDQUFzQzs7Ozs7OztJQVczQyxnRkFBcUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2UgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtYmFzZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyQgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuXG4vKipcbiAqIENyZWF0ZXMgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzIGZvclxuICogYSBjYWNoZWQgY29sbGVjdGlvbiBvZiBUIGVudGl0aWVzIGluIHRoZSBuZ3J4IHN0b3JlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIENyZWF0ZXMgdGhlIGNvcmUgZWxlbWVudHMgb2YgdGhlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciBhbiBlbnRpdHkgdHlwZS4gKi9cbiAgICBwdWJsaWMgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBjcmVhdGU8VCwgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlQmFzZTxULCBTJD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeVxuICAgICk7XG4gIH1cbn1cbiJdfQ==