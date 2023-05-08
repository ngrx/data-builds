import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../dispatchers/entity-dispatcher-factory";
import * as i2 from "../entity-metadata/entity-definition.service";
import * as i3 from "../selectors/entity-selectors";
import * as i4 from "../selectors/entity-selectors$";
/** Creates the core elements of the EntityCollectionService for an entity type. */
class EntityCollectionServiceElementsFactory {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory, deps: [{ token: i1.EntityDispatcherFactory }, { token: i2.EntityDefinitionService }, { token: i3.EntitySelectorsFactory }, { token: i4.EntitySelectors$Factory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory }); }
}
export { EntityCollectionServiceElementsFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityDispatcherFactory }, { type: i2.EntityDefinitionService }, { type: i3.EntitySelectorsFactory }, { type: i4.EntitySelectors$Factory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQXdCM0MsbUZBQW1GO0FBQ25GLE1BQ2Esc0NBQXNDO0lBQ2pELFlBQ1UsdUJBQWdELEVBQ2hELHVCQUFnRCxFQUNoRCxzQkFBOEMsRUFDOUMsdUJBQWdEO1FBSGhELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7SUFDdkQsQ0FBQztJQUVKOzs7T0FHRztJQUNILE1BQU0sQ0FDSixVQUFrQjtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUNkLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQUksVUFBVSxDQUFDLENBQUM7UUFDNUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FDcEQsVUFBVSxFQUNWLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLFVBQVUsQ0FBQyx1QkFBdUIsQ0FDbkMsQ0FBQztRQUNGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQ2xELFVBQVUsQ0FBQyxRQUFRLENBQ3BCLENBQUM7UUFDRixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUNwRCxVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUM7UUFDRixPQUFPO1lBQ0wsVUFBVTtZQUNWLFVBQVU7WUFDVixTQUFTO1lBQ1QsVUFBVTtTQUNYLENBQUM7SUFDSixDQUFDO2lJQXBDVSxzQ0FBc0M7cUlBQXRDLHNDQUFzQzs7U0FBdEMsc0NBQXNDOzJGQUF0QyxzQ0FBc0M7a0JBRGxELFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyIH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgRW50aXR5U2VsZWN0b3JzLFxuICBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxufSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQge1xuICBFbnRpdHlTZWxlY3RvcnMkLFxuICBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSxcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcblxuLyoqIENvcmUgaW5ncmVkaWVudHMgb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50czxcbiAgVCxcbiAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuPiB7XG4gIHJlYWRvbmx5IGRpc3BhdGNoZXI6IEVudGl0eURpc3BhdGNoZXI8VD47XG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD47XG4gIHJlYWRvbmx5IHNlbGVjdG9ycyQ6IFMkO1xufVxuXG4vKiogQ3JlYXRlcyB0aGUgY29yZSBlbGVtZW50cyBvZiB0aGUgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlEaXNwYXRjaGVyRmFjdG9yeTogRW50aXR5RGlzcGF0Y2hlckZhY3RvcnksXG4gICAgcHJpdmF0ZSBlbnRpdHlEZWZpbml0aW9uU2VydmljZTogRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlTZWxlY3RvcnNGYWN0b3J5OiBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxuICAgIHByaXZhdGUgZW50aXR5U2VsZWN0b3JzJEZhY3Rvcnk6IEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5XG4gICkge31cblxuICAvKipcbiAgICogR2V0IHRoZSBpbmdyZWRpZW50cyBmb3IgbWFraW5nIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciB0aGlzIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIGNyZWF0ZTxULCBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50czxULCBTJD4ge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCBkZWZpbml0aW9uID1cbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbjxUPihlbnRpdHlOYW1lKTtcbiAgICBjb25zdCBkaXNwYXRjaGVyID0gdGhpcy5lbnRpdHlEaXNwYXRjaGVyRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgZGVmaW5pdGlvbi5zZWxlY3RJZCxcbiAgICAgIGRlZmluaXRpb24uZW50aXR5RGlzcGF0Y2hlck9wdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IHRoaXMuZW50aXR5U2VsZWN0b3JzRmFjdG9yeS5jcmVhdGU8VD4oXG4gICAgICBkZWZpbml0aW9uLm1ldGFkYXRhXG4gICAgKTtcbiAgICBjb25zdCBzZWxlY3RvcnMkID0gdGhpcy5lbnRpdHlTZWxlY3RvcnMkRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdG9yc1xuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BhdGNoZXIsXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgc2VsZWN0b3JzLFxuICAgICAgc2VsZWN0b3JzJCxcbiAgICB9O1xuICB9XG59XG4iXX0=