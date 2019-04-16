/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { EntitySelectorsFactory, } from '../selectors/entity-selectors';
import { EntitySelectors$Factory, } from '../selectors/entity-selectors$';
/**
 * Core ingredients of an EntityCollectionService
 * @record
 * @template T, S$
 */
export function EntityCollectionServiceElements() { }
if (false) {
    /** @type {?} */
    EntityCollectionServiceElements.prototype.dispatcher;
    /** @type {?} */
    EntityCollectionServiceElements.prototype.entityName;
    /** @type {?} */
    EntityCollectionServiceElements.prototype.selectors;
    /** @type {?} */
    EntityCollectionServiceElements.prototype.selectors$;
}
/**
 * Creates the core elements of the EntityCollectionService for an entity type.
 */
export class EntityCollectionServiceElementsFactory {
    /**
     * @param {?} entityDispatcherFactory
     * @param {?} entityDefinitionService
     * @param {?} entitySelectorsFactory
     * @param {?} entitySelectors$Factory
     */
    constructor(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
        this.entityDispatcherFactory = entityDispatcherFactory;
        this.entityDefinitionService = entityDefinitionService;
        this.entitySelectorsFactory = entitySelectorsFactory;
        this.entitySelectors$Factory = entitySelectors$Factory;
    }
    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @template T, S$
     * @param {?} entityName - name of the entity type
     * @return {?}
     */
    create(entityName) {
        entityName = entityName.trim();
        /** @type {?} */
        const definition = this.entityDefinitionService.getDefinition(entityName);
        /** @type {?} */
        const dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
        /** @type {?} */
        const selectors = this.entitySelectorsFactory.create(definition.metadata);
        /** @type {?} */
        const selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
        return {
            dispatcher,
            entityName,
            selectors,
            selectors$,
        };
    }
}
EntityCollectionServiceElementsFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionServiceElementsFactory.ctorParameters = () => [
    { type: EntityDispatcherFactory },
    { type: EntityDefinitionService },
    { type: EntitySelectorsFactory },
    { type: EntitySelectors$Factory }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entityDispatcherFactory;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entityDefinitionService;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entitySelectorsFactory;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entitySelectors$Factory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFFTCxzQkFBc0IsR0FDdkIsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBRUwsdUJBQXVCLEdBQ3hCLE1BQU0sZ0NBQWdDLENBQUM7Ozs7OztBQUd4QyxxREFRQzs7O0lBSkMscURBQXlDOztJQUN6QyxxREFBNEI7O0lBQzVCLG9EQUF1Qzs7SUFDdkMscURBQXdCOzs7OztBQUsxQixNQUFNLE9BQU8sc0NBQXNDOzs7Ozs7O0lBQ2pELFlBQ1UsdUJBQWdELEVBQ2hELHVCQUFnRCxFQUNoRCxzQkFBOEMsRUFDOUMsdUJBQWdEO1FBSGhELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7SUFDdkQsQ0FBQzs7Ozs7OztJQU1KLE1BQU0sQ0FDSixVQUFrQjtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDOztjQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FDM0QsVUFBVSxDQUNYOztjQUNLLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUNwRCxVQUFVLEVBQ1YsVUFBVSxDQUFDLFFBQVEsRUFDbkIsVUFBVSxDQUFDLHVCQUF1QixDQUNuQzs7Y0FDSyxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FDbEQsVUFBVSxDQUFDLFFBQVEsQ0FDcEI7O2NBQ0ssVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQ3BELFVBQVUsRUFDVixTQUFTLENBQ1Y7UUFDRCxPQUFPO1lBQ0wsVUFBVTtZQUNWLFVBQVU7WUFDVixTQUFTO1lBQ1QsVUFBVTtTQUNYLENBQUM7SUFDSixDQUFDOzs7WUF0Q0YsVUFBVTs7OztZQXZCRix1QkFBdUI7WUFDdkIsdUJBQXVCO1lBRzlCLHNCQUFzQjtZQUl0Qix1QkFBdUI7Ozs7Ozs7SUFrQnJCLHlFQUF3RDs7Ozs7SUFDeEQseUVBQXdEOzs7OztJQUN4RCx3RUFBc0Q7Ozs7O0lBQ3RELHlFQUF3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlQmFzZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQge1xuICBFbnRpdHlTZWxlY3RvcnMsXG4gIEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7XG4gIEVudGl0eVNlbGVjdG9ycyQsXG4gIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuXG4vKiogQ29yZSBpbmdyZWRpZW50cyBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzPFxuICBULFxuICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4+IHtcbiAgcmVhZG9ubHkgZGlzcGF0Y2hlcjogRW50aXR5RGlzcGF0Y2hlcjxUPjtcbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuICByZWFkb25seSBzZWxlY3RvcnM6IEVudGl0eVNlbGVjdG9yczxUPjtcbiAgcmVhZG9ubHkgc2VsZWN0b3JzJDogUyQ7XG59XG5cbi8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgYW4gZW50aXR5IHR5cGUuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eURpc3BhdGNoZXJGYWN0b3J5OiBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICBwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlOiBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eVNlbGVjdG9yc0ZhY3Rvcnk6IEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG4gICAgcHJpdmF0ZSBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeTogRW50aXR5U2VsZWN0b3JzJEZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGluZ3JlZGllbnRzIGZvciBtYWtpbmcgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIHRoaXMgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKi9cbiAgY3JlYXRlPFQsIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzPFQsIFMkPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcbiAgICBjb25zdCBkaXNwYXRjaGVyID0gdGhpcy5lbnRpdHlEaXNwYXRjaGVyRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgZGVmaW5pdGlvbi5zZWxlY3RJZCxcbiAgICAgIGRlZmluaXRpb24uZW50aXR5RGlzcGF0Y2hlck9wdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IHRoaXMuZW50aXR5U2VsZWN0b3JzRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBkZWZpbml0aW9uLm1ldGFkYXRhXG4gICAgKTtcbiAgICBjb25zdCBzZWxlY3RvcnMkID0gdGhpcy5lbnRpdHlTZWxlY3RvcnMkRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdG9yc1xuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BhdGNoZXIsXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgc2VsZWN0b3JzLFxuICAgICAgc2VsZWN0b3JzJCxcbiAgICB9O1xuICB9XG59XG4iXX0=