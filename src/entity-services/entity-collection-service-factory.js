(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-services/entity-collection-service-factory", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/entity-services/entity-collection-service-base", "@ngrx/data/src/entity-services/entity-collection-service-elements-factory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const entity_collection_service_base_1 = require("@ngrx/data/src/entity-services/entity-collection-service-base");
    const entity_collection_service_elements_factory_1 = require("@ngrx/data/src/entity-services/entity-collection-service-elements-factory");
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    let EntityCollectionServiceFactory = class EntityCollectionServiceFactory {
        constructor(
        /** Creates the core elements of the EntityCollectionService for an entity type. */
        entityCollectionServiceElementsFactory) {
            this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
        }
        /**
         * Create an EntityCollectionService for an entity type
         * @param entityName - name of the entity type
         */
        create(entityName) {
            return new entity_collection_service_base_1.EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
        }
    };
    EntityCollectionServiceFactory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [entity_collection_service_elements_factory_1.EntityCollectionServiceElementsFactory])
    ], EntityCollectionServiceFactory);
    exports.EntityCollectionServiceFactory = EntityCollectionServiceFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLHdDQUEyQztJQUUzQyxrSEFBK0U7SUFDL0UsMElBQXNHO0lBR3RHOzs7T0FHRztJQUVILElBQWEsOEJBQThCLEdBQTNDLE1BQWEsOEJBQThCO1FBQ3pDO1FBQ0UsbUZBQW1GO1FBQzVFLHNDQUE4RTtZQUE5RSwyQ0FBc0MsR0FBdEMsc0NBQXNDLENBQXdDO1FBQ3BGLENBQUM7UUFFSjs7O1dBR0c7UUFDSCxNQUFNLENBQ0osVUFBa0I7WUFFbEIsT0FBTyxJQUFJLDREQUEyQixDQUNwQyxVQUFVLEVBQ1YsSUFBSSxDQUFDLHNDQUFzQyxDQUM1QyxDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUE7SUFsQlksOEJBQThCO1FBRDFDLGlCQUFVLEVBQUU7aURBSXNDLG1GQUFzQztPQUg1RSw4QkFBOEIsQ0FrQjFDO0lBbEJZLHdFQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlQmFzZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWVsZW1lbnRzLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5cbi8qKlxuICogQ3JlYXRlcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBpbnN0YW5jZXMgZm9yXG4gKiBhIGNhY2hlZCBjb2xsZWN0aW9uIG9mIFQgZW50aXRpZXMgaW4gdGhlIG5ncnggc3RvcmUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogQ3JlYXRlcyB0aGUgY29yZSBlbGVtZW50cyBvZiB0aGUgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlLiAqL1xuICAgIHB1YmxpYyBlbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIGNyZWF0ZTxULCBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIHJldHVybiBuZXcgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VCYXNlPFQsIFMkPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICAgKTtcbiAgfVxufVxuIl19