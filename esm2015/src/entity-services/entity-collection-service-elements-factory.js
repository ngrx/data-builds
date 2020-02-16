/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-services/entity-collection-service-elements-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN2RixPQUFPLEVBRUwsc0JBQXNCLEdBQ3ZCLE1BQU0sK0JBQStCLENBQUM7QUFDdkMsT0FBTyxFQUVMLHVCQUF1QixHQUN4QixNQUFNLGdDQUFnQyxDQUFDOzs7Ozs7QUFHeEMscURBUUM7OztJQUpDLHFEQUF5Qzs7SUFDekMscURBQTRCOztJQUM1QixvREFBdUM7O0lBQ3ZDLHFEQUF3Qjs7Ozs7QUFLMUIsTUFBTSxPQUFPLHNDQUFzQzs7Ozs7OztJQUNqRCxZQUNVLHVCQUFnRCxFQUNoRCx1QkFBZ0QsRUFDaEQsc0JBQThDLEVBQzlDLHVCQUFnRDtRQUhoRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUM5Qyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO0lBQ3ZELENBQUM7Ozs7Ozs7SUFNSixNQUFNLENBQ0osVUFBa0I7UUFFbEIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Y0FDekIsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQzNELFVBQVUsQ0FDWDs7Y0FDSyxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FDcEQsVUFBVSxFQUNWLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLFVBQVUsQ0FBQyx1QkFBdUIsQ0FDbkM7O2NBQ0ssU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQ2xELFVBQVUsQ0FBQyxRQUFRLENBQ3BCOztjQUNLLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUNwRCxVQUFVLEVBQ1YsU0FBUyxDQUNWO1FBQ0QsT0FBTztZQUNMLFVBQVU7WUFDVixVQUFVO1lBQ1YsU0FBUztZQUNULFVBQVU7U0FDWCxDQUFDO0lBQ0osQ0FBQzs7O1lBdENGLFVBQVU7Ozs7WUF2QkYsdUJBQXVCO1lBQ3ZCLHVCQUF1QjtZQUc5QixzQkFBc0I7WUFJdEIsdUJBQXVCOzs7Ozs7O0lBa0JyQix5RUFBd0Q7Ozs7O0lBQ3hELHlFQUF3RDs7Ozs7SUFDeEQsd0VBQXNEOzs7OztJQUN0RCx5RUFBd0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyIH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgRW50aXR5U2VsZWN0b3JzLFxuICBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQge1xuICBFbnRpdHlTZWxlY3RvcnMkLFxuICBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSxcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcblxuLyoqIENvcmUgaW5ncmVkaWVudHMgb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50czxcbiAgVCxcbiAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuPiB7XG4gIHJlYWRvbmx5IGRpc3BhdGNoZXI6IEVudGl0eURpc3BhdGNoZXI8VD47XG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD47XG4gIHJlYWRvbmx5IHNlbGVjdG9ycyQ6IFMkO1xufVxuXG4vKiogQ3JlYXRlcyB0aGUgY29yZSBlbGVtZW50cyBvZiB0aGUgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlEaXNwYXRjaGVyRmFjdG9yeTogRW50aXR5RGlzcGF0Y2hlckZhY3RvcnksXG4gICAgcHJpdmF0ZSBlbnRpdHlEZWZpbml0aW9uU2VydmljZTogRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlTZWxlY3RvcnNGYWN0b3J5OiBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxuICAgIHByaXZhdGUgZW50aXR5U2VsZWN0b3JzJEZhY3Rvcnk6IEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5XG4gICkge31cblxuICAvKipcbiAgICogR2V0IHRoZSBpbmdyZWRpZW50cyBmb3IgbWFraW5nIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciB0aGlzIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIGNyZWF0ZTxULCBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50czxULCBTJD4ge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uPFQ+KFxuICAgICAgZW50aXR5TmFtZVxuICAgICk7XG4gICAgY29uc3QgZGlzcGF0Y2hlciA9IHRoaXMuZW50aXR5RGlzcGF0Y2hlckZhY3RvcnkuY3JlYXRlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIGRlZmluaXRpb24uc2VsZWN0SWQsXG4gICAgICBkZWZpbml0aW9uLmVudGl0eURpc3BhdGNoZXJPcHRpb25zXG4gICAgKTtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSB0aGlzLmVudGl0eVNlbGVjdG9yc0ZhY3RvcnkuY3JlYXRlPFQ+KFxuICAgICAgZGVmaW5pdGlvbi5tZXRhZGF0YVxuICAgICk7XG4gICAgY29uc3Qgc2VsZWN0b3JzJCA9IHRoaXMuZW50aXR5U2VsZWN0b3JzJEZhY3RvcnkuY3JlYXRlPFQsIFMkPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICBzZWxlY3RvcnNcbiAgICApO1xuICAgIHJldHVybiB7XG4gICAgICBkaXNwYXRjaGVyLFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdG9ycyxcbiAgICAgIHNlbGVjdG9ycyQsXG4gICAgfTtcbiAgfVxufVxuIl19