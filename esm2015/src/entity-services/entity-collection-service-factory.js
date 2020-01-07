/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-services/entity-collection-service-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7Ozs7QUFRdEcsTUFBTSxPQUFPLDhCQUE4Qjs7OztJQUN6QyxZQUVTLHNDQUE4RTtRQUE5RSwyQ0FBc0MsR0FBdEMsc0NBQXNDLENBQXdDO0lBQ3BGLENBQUM7Ozs7Ozs7SUFNSixNQUFNLENBQ0osVUFBa0I7UUFFbEIsT0FBTyxJQUFJLDJCQUEyQixDQUNwQyxVQUFVLEVBQ1YsSUFBSSxDQUFDLHNDQUFzQyxDQUM1QyxDQUFDO0lBQ0osQ0FBQzs7O1lBbEJGLFVBQVU7Ozs7WUFQRixzQ0FBc0M7Ozs7Ozs7SUFXM0MsZ0ZBQXFGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VCYXNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWJhc2UnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZWxlbWVudHMtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcblxuLyoqXG4gKiBDcmVhdGVzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGluc3RhbmNlcyBmb3JcbiAqIGEgY2FjaGVkIGNvbGxlY3Rpb24gb2YgVCBlbnRpdGllcyBpbiB0aGUgbmdyeCBzdG9yZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgYW4gZW50aXR5IHR5cGUuICovXG4gICAgcHVibGljIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeVxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKi9cbiAgY3JlYXRlPFQsIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2U8VCwgUyQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnlcbiAgICApO1xuICB9XG59XG4iXX0=