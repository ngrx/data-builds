import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { EntitySelectorsFactory, } from '../selectors/entity-selectors';
import { EntitySelectors$Factory, } from '../selectors/entity-selectors$';
/** Creates the core elements of the EntityCollectionService for an entity type. */
var EntityCollectionServiceElementsFactory = /** @class */ (function () {
    function EntityCollectionServiceElementsFactory(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
        this.entityDispatcherFactory = entityDispatcherFactory;
        this.entityDefinitionService = entityDefinitionService;
        this.entitySelectorsFactory = entitySelectorsFactory;
        this.entitySelectors$Factory = entitySelectors$Factory;
    }
    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @param entityName - name of the entity type
     */
    EntityCollectionServiceElementsFactory.prototype.create = function (entityName) {
        entityName = entityName.trim();
        var definition = this.entityDefinitionService.getDefinition(entityName);
        var dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
        var selectors = this.entitySelectorsFactory.create(definition.metadata);
        var selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
        return {
            dispatcher: dispatcher,
            entityName: entityName,
            selectors: selectors,
            selectors$: selectors$,
        };
    };
    EntityCollectionServiceElementsFactory = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [EntityDispatcherFactory,
            EntityDefinitionService,
            EntitySelectorsFactory,
            EntitySelectors$Factory])
    ], EntityCollectionServiceElementsFactory);
    return EntityCollectionServiceElementsFactory;
}());
export { EntityCollectionServiceElementsFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFFTCxzQkFBc0IsR0FDdkIsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBRUwsdUJBQXVCLEdBQ3hCLE1BQU0sZ0NBQWdDLENBQUM7QUFheEMsbUZBQW1GO0FBRW5GO0lBQ0UsZ0RBQ1UsdUJBQWdELEVBQ2hELHVCQUFnRCxFQUNoRCxzQkFBOEMsRUFDOUMsdUJBQWdEO1FBSGhELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7SUFDdkQsQ0FBQztJQUVKOzs7T0FHRztJQUNILHVEQUFNLEdBQU4sVUFDRSxVQUFrQjtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQzNELFVBQVUsQ0FDWCxDQUFDO1FBQ0YsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FDcEQsVUFBVSxFQUNWLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLFVBQVUsQ0FBQyx1QkFBdUIsQ0FDbkMsQ0FBQztRQUNGLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQ2xELFVBQVUsQ0FBQyxRQUFRLENBQ3BCLENBQUM7UUFDRixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUNwRCxVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUM7UUFDRixPQUFPO1lBQ0wsVUFBVSxZQUFBO1lBQ1YsVUFBVSxZQUFBO1lBQ1YsU0FBUyxXQUFBO1lBQ1QsVUFBVSxZQUFBO1NBQ1gsQ0FBQztJQUNKLENBQUM7SUFyQ1Usc0NBQXNDO1FBRGxELFVBQVUsRUFBRTt5Q0FHd0IsdUJBQXVCO1lBQ3ZCLHVCQUF1QjtZQUN4QixzQkFBc0I7WUFDckIsdUJBQXVCO09BTC9DLHNDQUFzQyxDQXNDbEQ7SUFBRCw2Q0FBQztDQUFBLEFBdENELElBc0NDO1NBdENZLHNDQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQge1xuICBFbnRpdHlTZWxlY3RvcnMsXG4gIEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7XG4gIEVudGl0eVNlbGVjdG9ycyQsXG4gIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuXG4vKiogQ29yZSBpbmdyZWRpZW50cyBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzPFxuICBULFxuICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4+IHtcbiAgcmVhZG9ubHkgZGlzcGF0Y2hlcjogRW50aXR5RGlzcGF0Y2hlcjxUPjtcbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuICByZWFkb25seSBzZWxlY3RvcnM6IEVudGl0eVNlbGVjdG9yczxUPjtcbiAgcmVhZG9ubHkgc2VsZWN0b3JzJDogUyQ7XG59XG5cbi8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgYW4gZW50aXR5IHR5cGUuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eURpc3BhdGNoZXJGYWN0b3J5OiBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICBwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlOiBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eVNlbGVjdG9yc0ZhY3Rvcnk6IEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG4gICAgcHJpdmF0ZSBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeTogRW50aXR5U2VsZWN0b3JzJEZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGluZ3JlZGllbnRzIGZvciBtYWtpbmcgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIHRoaXMgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKi9cbiAgY3JlYXRlPFQsIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzPFQsIFMkPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcbiAgICBjb25zdCBkaXNwYXRjaGVyID0gdGhpcy5lbnRpdHlEaXNwYXRjaGVyRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgZGVmaW5pdGlvbi5zZWxlY3RJZCxcbiAgICAgIGRlZmluaXRpb24uZW50aXR5RGlzcGF0Y2hlck9wdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IHRoaXMuZW50aXR5U2VsZWN0b3JzRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBkZWZpbml0aW9uLm1ldGFkYXRhXG4gICAgKTtcbiAgICBjb25zdCBzZWxlY3RvcnMkID0gdGhpcy5lbnRpdHlTZWxlY3RvcnMkRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdG9yc1xuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BhdGNoZXIsXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgc2VsZWN0b3JzLFxuICAgICAgc2VsZWN0b3JzJCxcbiAgICB9O1xuICB9XG59XG4iXX0=