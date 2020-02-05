(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-services/entity-collection-service-elements-factory", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/dispatchers/entity-dispatcher-factory", "@ngrx/data/src/entity-metadata/entity-definition.service", "@ngrx/data/src/selectors/entity-selectors", "@ngrx/data/src/selectors/entity-selectors$"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const entity_dispatcher_factory_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher-factory");
    const entity_definition_service_1 = require("@ngrx/data/src/entity-metadata/entity-definition.service");
    const entity_selectors_1 = require("@ngrx/data/src/selectors/entity-selectors");
    const entity_selectors_2 = require("@ngrx/data/src/selectors/entity-selectors$");
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    let EntityCollectionServiceElementsFactory = class EntityCollectionServiceElementsFactory {
        constructor(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
            this.entityDispatcherFactory = entityDispatcherFactory;
            this.entityDefinitionService = entityDefinitionService;
            this.entitySelectorsFactory = entitySelectorsFactory;
            this.entitySelectors$Factory = entitySelectors$Factory;
        }
        /**
         * Get the ingredients for making an EntityCollectionService for this entity type
         * @param entityName - name of the entity type
         */
        create(entityName) {
            entityName = entityName.trim();
            const definition = this.entityDefinitionService.getDefinition(entityName);
            const dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
            const selectors = this.entitySelectorsFactory.create(definition.metadata);
            const selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
            return {
                dispatcher,
                entityName,
                selectors,
                selectors$,
            };
        }
    };
    EntityCollectionServiceElementsFactory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [entity_dispatcher_factory_1.EntityDispatcherFactory,
            entity_definition_service_1.EntityDefinitionService,
            entity_selectors_1.EntitySelectorsFactory,
            entity_selectors_2.EntitySelectors$Factory])
    ], EntityCollectionServiceElementsFactory);
    exports.EntityCollectionServiceElementsFactory = EntityCollectionServiceElementsFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLHdDQUEyQztJQUUzQyxvR0FBbUY7SUFDbkYsd0dBQXVGO0lBQ3ZGLGdGQUd1QztJQUN2QyxpRkFHd0M7SUFheEMsbUZBQW1GO0lBRW5GLElBQWEsc0NBQXNDLEdBQW5ELE1BQWEsc0NBQXNDO1FBQ2pELFlBQ1UsdUJBQWdELEVBQ2hELHVCQUFnRCxFQUNoRCxzQkFBOEMsRUFDOUMsdUJBQWdEO1lBSGhELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7WUFDaEQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtZQUNoRCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1lBQzlDLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDdkQsQ0FBQztRQUVKOzs7V0FHRztRQUNILE1BQU0sQ0FDSixVQUFrQjtZQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQzNELFVBQVUsQ0FDWCxDQUFDO1lBQ0YsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FDcEQsVUFBVSxFQUNWLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLFVBQVUsQ0FBQyx1QkFBdUIsQ0FDbkMsQ0FBQztZQUNGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQ2xELFVBQVUsQ0FBQyxRQUFRLENBQ3BCLENBQUM7WUFDRixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUNwRCxVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUM7WUFDRixPQUFPO2dCQUNMLFVBQVU7Z0JBQ1YsVUFBVTtnQkFDVixTQUFTO2dCQUNULFVBQVU7YUFDWCxDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUE7SUF0Q1ksc0NBQXNDO1FBRGxELGlCQUFVLEVBQUU7aURBR3dCLG1EQUF1QjtZQUN2QixtREFBdUI7WUFDeEIseUNBQXNCO1lBQ3JCLDBDQUF1QjtPQUwvQyxzQ0FBc0MsQ0FzQ2xEO0lBdENZLHdGQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXIgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQge1xuICBFbnRpdHlTZWxlY3RvcnMsXG4gIEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7XG4gIEVudGl0eVNlbGVjdG9ycyQsXG4gIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuXG4vKiogQ29yZSBpbmdyZWRpZW50cyBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzPFxuICBULFxuICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4+IHtcbiAgcmVhZG9ubHkgZGlzcGF0Y2hlcjogRW50aXR5RGlzcGF0Y2hlcjxUPjtcbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuICByZWFkb25seSBzZWxlY3RvcnM6IEVudGl0eVNlbGVjdG9yczxUPjtcbiAgcmVhZG9ubHkgc2VsZWN0b3JzJDogUyQ7XG59XG5cbi8qKiBDcmVhdGVzIHRoZSBjb3JlIGVsZW1lbnRzIG9mIHRoZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgYW4gZW50aXR5IHR5cGUuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eURpc3BhdGNoZXJGYWN0b3J5OiBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICBwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlOiBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eVNlbGVjdG9yc0ZhY3Rvcnk6IEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG4gICAgcHJpdmF0ZSBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeTogRW50aXR5U2VsZWN0b3JzJEZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGluZ3JlZGllbnRzIGZvciBtYWtpbmcgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIHRoaXMgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKi9cbiAgY3JlYXRlPFQsIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzPFQsIFMkPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICBlbnRpdHlOYW1lXG4gICAgKTtcbiAgICBjb25zdCBkaXNwYXRjaGVyID0gdGhpcy5lbnRpdHlEaXNwYXRjaGVyRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgZGVmaW5pdGlvbi5zZWxlY3RJZCxcbiAgICAgIGRlZmluaXRpb24uZW50aXR5RGlzcGF0Y2hlck9wdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IHRoaXMuZW50aXR5U2VsZWN0b3JzRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBkZWZpbml0aW9uLm1ldGFkYXRhXG4gICAgKTtcbiAgICBjb25zdCBzZWxlY3RvcnMkID0gdGhpcy5lbnRpdHlTZWxlY3RvcnMkRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdG9yc1xuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BhdGNoZXIsXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgc2VsZWN0b3JzLFxuICAgICAgc2VsZWN0b3JzJCxcbiAgICB9O1xuICB9XG59XG4iXX0=