(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-services/entity-services-elements", ["require", "exports", "tslib", "@angular/core", "@ngrx/store", "@ngrx/data/src/dispatchers/entity-dispatcher-factory", "@ngrx/data/src/selectors/entity-selectors$", "@ngrx/data/src/entity-services/entity-collection-service-factory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const store_1 = require("@ngrx/store");
    const entity_dispatcher_factory_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher-factory");
    const entity_selectors_1 = require("@ngrx/data/src/selectors/entity-selectors$");
    const entity_collection_service_factory_1 = require("@ngrx/data/src/entity-services/entity-collection-service-factory");
    /** Core ingredients of an EntityServices class */
    let EntityServicesElements = class EntityServicesElements {
        constructor(
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
    };
    EntityServicesElements = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [entity_collection_service_factory_1.EntityCollectionServiceFactory,
            entity_dispatcher_factory_1.EntityDispatcherFactory,
            entity_selectors_1.EntitySelectors$Factory,
            store_1.Store])
    ], EntityServicesElements);
    exports.EntityServicesElements = EntityServicesElements;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLHdDQUEyQztJQUMzQyx1Q0FBNEM7SUFLNUMsb0dBQW1GO0lBQ25GLGlGQUF5RTtJQUN6RSx3SEFBcUY7SUFFckYsa0RBQWtEO0lBRWxELElBQWEsc0JBQXNCLEdBQW5DLE1BQWEsc0JBQXNCO1FBQ2pDO1FBQ0U7OztXQUdHO1FBQ2EsOEJBQThEO1FBQzlFLHVEQUF1RDtRQUN2RCx1QkFBZ0Q7UUFDaEQsa0VBQWtFO1FBQ2xFLHVCQUFnRDtRQUNoRCxnREFBZ0Q7UUFDaEMsS0FBeUI7WUFOekIsbUNBQThCLEdBQTlCLDhCQUE4QixDQUFnQztZQU05RCxVQUFLLEdBQUwsS0FBSyxDQUFvQjtZQUV6QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsdUJBQXVCLENBQUMsbUJBQW1CLENBQUM7WUFDdkUsSUFBSSxDQUFDLFlBQVksR0FBRyx1QkFBdUIsQ0FBQyxZQUFZLENBQUM7WUFDekQsSUFBSSxDQUFDLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQyxlQUFlLENBQUM7UUFDakUsQ0FBQztLQWFGLENBQUE7SUE5Qlksc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7aURBT3VDLGtFQUE4QjtZQUVyRCxtREFBdUI7WUFFdkIsMENBQXVCO1lBRXpCLGFBQUs7T0FabkIsc0JBQXNCLENBOEJsQztJQTlCWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5IH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5JztcblxuLyoqIENvcmUgaW5ncmVkaWVudHMgb2YgYW4gRW50aXR5U2VydmljZXMgY2xhc3MgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBpbnN0YW5jZXMgZm9yXG4gICAgICogYSBjYWNoZWQgY29sbGVjdGlvbiBvZiBUIGVudGl0aWVzIGluIHRoZSBuZ3J4IHN0b3JlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBlbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSxcbiAgICAvKiogQ3JlYXRlcyBFbnRpdHlEaXNwYXRjaGVycyBmb3IgZW50aXR5IGNvbGxlY3Rpb25zICovXG4gICAgZW50aXR5RGlzcGF0Y2hlckZhY3Rvcnk6IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5LFxuICAgIC8qKiBDcmVhdGVzIG9ic2VydmFibGUgRW50aXR5U2VsZWN0b3JzJCBmb3IgZW50aXR5IGNvbGxlY3Rpb25zLiAqL1xuICAgIGVudGl0eVNlbGVjdG9ycyRGYWN0b3J5OiBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSxcbiAgICAvKiogVGhlIG5ncnggc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPlxuICApIHtcbiAgICB0aGlzLmVudGl0eUFjdGlvbkVycm9ycyQgPSBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeS5lbnRpdHlBY3Rpb25FcnJvcnMkO1xuICAgIHRoaXMuZW50aXR5Q2FjaGUkID0gZW50aXR5U2VsZWN0b3JzJEZhY3RvcnkuZW50aXR5Q2FjaGUkO1xuICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkID0gZW50aXR5RGlzcGF0Y2hlckZhY3RvcnkucmVkdWNlZEFjdGlvbnMkO1xuICB9XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgRW50aXR5QWN0aW9ucyAoZS5nLiBRVUVSWV9BTExfRVJST1IpIGZvciBhbGwgZW50aXR5IHR5cGVzICovXG4gIHJlYWRvbmx5IGVudGl0eUFjdGlvbkVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXJlIGVudGl0eSBjYWNoZSAqL1xuICByZWFkb25seSBlbnRpdHlDYWNoZSQ6IE9ic2VydmFibGU8RW50aXR5Q2FjaGU+IHwgU3RvcmU8RW50aXR5Q2FjaGU+O1xuXG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIHJlYWRvbmx5IHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+O1xufVxuIl19