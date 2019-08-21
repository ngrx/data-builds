import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { EntityServicesElements } from './entity-services-elements';
// tslint:disable:member-ordering
/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @example
 * export class EntityServices extends EntityServicesBase {
 *   constructor(entityServicesElements: EntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 */
var EntityServicesBase = /** @class */ (function () {
    // Dear ngrx-data developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    function EntityServicesBase(entityServicesElements) {
        this.entityServicesElements = entityServicesElements;
        /** Registry of EntityCollectionService instances */
        this.EntityCollectionServices = {};
    }
    Object.defineProperty(EntityServicesBase.prototype, "entityActionErrors$", {
        // #region EntityServicesElement-based properties
        /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
        get: function () {
            return this.entityServicesElements.entityActionErrors$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "entityCache$", {
        /** Observable of the entire entity cache */
        get: function () {
            return this.entityServicesElements.entityCache$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "entityCollectionServiceFactory", {
        /** Factory to create a default instance of an EntityCollectionService */
        get: function () {
            return this.entityServicesElements.entityCollectionServiceFactory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "reducedActions$", {
        /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent action reduced by the store.
         */
        get: function () {
            return this.entityServicesElements.reducedActions$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "store", {
        /** The ngrx store, scoped to the EntityCache */
        get: function () {
            return this.entityServicesElements.store;
        },
        enumerable: true,
        configurable: true
    });
    // #endregion EntityServicesElement-based properties
    /** Dispatch any action to the store */
    EntityServicesBase.prototype.dispatch = function (action) {
        this.store.dispatch(action);
    };
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    EntityServicesBase.prototype.createEntityCollectionService = function (entityName) {
        return this.entityCollectionServiceFactory.create(entityName);
    };
    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    EntityServicesBase.prototype.getEntityCollectionService = function (entityName) {
        var service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    };
    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    EntityServicesBase.prototype.registerEntityCollectionService = function (service, serviceName) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    };
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    EntityServicesBase.prototype.registerEntityCollectionServices = function (entityCollectionServices) {
        var _this = this;
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach(function (service) {
                return _this.registerEntityCollectionService(service);
            });
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach(function (serviceName) {
                _this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
            });
        }
    };
    EntityServicesBase = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [EntityServicesElements])
    ], EntityServicesBase);
    return EntityServicesBase;
}());
export { EntityServicesBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVczQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVwRSxpQ0FBaUM7QUFFakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFFSDtJQUNFLHdFQUF3RTtJQUN4RSw2REFBNkQ7SUFDN0QsNkNBQTZDO0lBQzdDLEVBQUU7SUFDRixrREFBa0Q7SUFDbEQsc0VBQXNFO0lBQ3RFLCtEQUErRDtJQUMvRCw0QkFBb0Isc0JBQThDO1FBQTlDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUF1Q2xFLG9EQUFvRDtRQUNuQyw2QkFBd0IsR0FBK0IsRUFBRSxDQUFDO0lBeENOLENBQUM7SUFLdEUsc0JBQUksbURBQW1CO1FBSHZCLGlEQUFpRDtRQUVqRCxvRkFBb0Y7YUFDcEY7WUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6RCxDQUFDOzs7T0FBQTtJQUdELHNCQUFJLDRDQUFZO1FBRGhCLDRDQUE0QzthQUM1QztZQUNFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztRQUNsRCxDQUFDOzs7T0FBQTtJQUdELHNCQUFJLDhEQUE4QjtRQURsQyx5RUFBeUU7YUFDekU7WUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyw4QkFBOEIsQ0FBQztRQUNwRSxDQUFDOzs7T0FBQTtJQU1ELHNCQUFJLCtDQUFlO1FBSm5COzs7V0FHRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDO1FBQ3JELENBQUM7OztPQUFBO0lBR0Qsc0JBQWMscUNBQUs7UUFEbkIsZ0RBQWdEO2FBQ2hEO1lBQ0UsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO1FBQzNDLENBQUM7OztPQUFBO0lBRUQsb0RBQW9EO0lBRXBELHVDQUF1QztJQUN2QyxxQ0FBUSxHQUFSLFVBQVMsTUFBYztRQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBS0Q7Ozs7O09BS0c7SUFDTywwREFBNkIsR0FBdkMsVUFHRSxVQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQVEsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdURBQTBCLEdBQTFCLFVBR0UsVUFBa0I7UUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFRLFVBQVUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDckQ7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDREQUErQixHQUEvQixVQUNFLE9BQW1DLEVBQ25DLFdBQW9CO1FBRXBCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw2REFBZ0MsR0FBaEMsVUFDRSx3QkFFa0M7UUFIcEMsaUJBaUJDO1FBWkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDM0Msd0JBQXdCLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztnQkFDdEMsT0FBQSxLQUFJLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUFDO1lBQTdDLENBQTZDLENBQzlDLENBQUM7U0FDSDthQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxXQUFXO2dCQUM3RCxLQUFJLENBQUMsK0JBQStCLENBQ2xDLHdCQUF3QixDQUFDLFdBQVcsQ0FBQyxFQUNyQyxXQUFXLENBQ1osQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBakhVLGtCQUFrQjtRQUQ5QixVQUFVLEVBQUU7aURBU2lDLHNCQUFzQjtPQVJ2RCxrQkFBa0IsQ0FrSDlCO0lBQUQseUJBQUM7Q0FBQSxBQWxIRCxJQWtIQztTQWxIWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCwgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy1lbGVtZW50cyc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZ1xuXG4vKipcbiAqIEJhc2UvZGVmYXVsdCBjbGFzcyBvZiBhIGNlbnRyYWwgcmVnaXN0cnkgb2YgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIGZvciBhbGwgZW50aXR5IHR5cGVzLlxuICogQ3JlYXRlIHlvdXIgb3duIHN1YmNsYXNzIHRvIGFkZCBhcHAtc3BlY2lmaWMgbWVtYmVycyBmb3IgYW4gaW1wcm92ZWQgZGV2ZWxvcGVyIGV4cGVyaWVuY2UuXG4gKlxuICogQGV4YW1wbGVcbiAqIGV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlcyBleHRlbmRzIEVudGl0eVNlcnZpY2VzQmFzZSB7XG4gKiAgIGNvbnN0cnVjdG9yKGVudGl0eVNlcnZpY2VzRWxlbWVudHM6IEVudGl0eVNlcnZpY2VzRWxlbWVudHMpIHtcbiAqICAgICBzdXBlcihlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKTtcbiAqICAgfVxuICogICAvLyBFeHRlbmQgd2l0aCB3ZWxsLWtub3duLCBhcHAgZW50aXR5IGNvbGxlY3Rpb24gc2VydmljZXNcbiAqICAgLy8gQ29udmVuaWVuY2UgcHJvcGVydHkgdG8gcmV0dXJuIGEgdHlwZWQgY3VzdG9tIGVudGl0eSBjb2xsZWN0aW9uIHNlcnZpY2VcbiAqICAgZ2V0IGNvbXBhbnlTZXJ2aWNlKCkge1xuICogICAgIHJldHVybiB0aGlzLmdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPE1vZGVsLkNvbXBhbnk+KCdDb21wYW55JykgYXMgQ29tcGFueVNlcnZpY2U7XG4gKiAgIH1cbiAqICAgLy8gQ29udmVuaWVuY2UgZGlzcGF0Y2ggbWV0aG9kc1xuICogICBjbGVhckNvbXBhbnkoY29tcGFueUlkOiBzdHJpbmcpIHtcbiAqICAgICB0aGlzLmRpc3BhdGNoKG5ldyBDbGVhckNvbXBhbnlBY3Rpb24oY29tcGFueUlkKSk7XG4gKiAgIH1cbiAqIH1cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eVNlcnZpY2VzQmFzZSBpbXBsZW1lbnRzIEVudGl0eVNlcnZpY2VzIHtcbiAgLy8gRGVhciBuZ3J4LWRhdGEgZGV2ZWxvcGVyOiB0aGluayBoYXJkIGJlZm9yZSBjaGFuZ2luZyB0aGUgY29uc3RydWN0b3IuXG4gIC8vIERvaW5nIHNvIHdpbGwgYnJlYWsgYXBwcyB0aGF0IGRlcml2ZSBmcm9tIHRoaXMgYmFzZSBjbGFzcyxcbiAgLy8gYW5kIG1hbnkgYXBwcyB3aWxsIGRlcml2ZSBmcm9tIHRoaXMgY2xhc3MuXG4gIC8vXG4gIC8vIERvIG5vdCBnaXZlIHRoaXMgY29uc3RydWN0b3IgYW4gaW1wbGVtZW50YXRpb24uXG4gIC8vIERvaW5nIHNvIG1ha2VzIGl0IGhhcmQgdG8gbW9jayBjbGFzc2VzIHRoYXQgZGVyaXZlIGZyb20gdGhpcyBjbGFzcy5cbiAgLy8gVXNlIGdldHRlciBwcm9wZXJ0aWVzIGluc3RlYWQuIEZvciBleGFtcGxlLCBzZWUgZW50aXR5Q2FjaGUkXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5U2VydmljZXNFbGVtZW50czogRW50aXR5U2VydmljZXNFbGVtZW50cykge31cblxuICAvLyAjcmVnaW9uIEVudGl0eVNlcnZpY2VzRWxlbWVudC1iYXNlZCBwcm9wZXJ0aWVzXG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgRW50aXR5QWN0aW9ucyAoZS5nLiBRVUVSWV9BTExfRVJST1IpIGZvciBhbGwgZW50aXR5IHR5cGVzICovXG4gIGdldCBlbnRpdHlBY3Rpb25FcnJvcnMkKCk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlBY3Rpb25FcnJvcnMkO1xuICB9XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUgKi9cbiAgZ2V0IGVudGl0eUNhY2hlJCgpOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPiB8IFN0b3JlPEVudGl0eUNhY2hlPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlDYWNoZSQ7XG4gIH1cblxuICAvKiogRmFjdG9yeSB0byBjcmVhdGUgYSBkZWZhdWx0IGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlICovXG4gIGdldCBlbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkoKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIGdldCByZWR1Y2VkQWN0aW9ucyQoKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLnJlZHVjZWRBY3Rpb25zJDtcbiAgfVxuXG4gIC8qKiBUaGUgbmdyeCBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICBwcm90ZWN0ZWQgZ2V0IHN0b3JlKCk6IFN0b3JlPEVudGl0eUNhY2hlPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5zdG9yZTtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb24gRW50aXR5U2VydmljZXNFbGVtZW50LWJhc2VkIHByb3BlcnRpZXNcblxuICAvKiogRGlzcGF0Y2ggYW55IGFjdGlvbiB0byB0aGUgc3RvcmUgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pIHtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gIH1cblxuICAvKiogUmVnaXN0cnkgb2YgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzICovXG4gIHByaXZhdGUgcmVhZG9ubHkgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCA9IHt9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgZGVmYXVsdCBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZS5cbiAgICogUHJlZmVyIGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKCkgdW5sZXNzIHlvdSByZWFsbHkgd2FudCBhIG5ldyBkZWZhdWx0IGluc3RhbmNlLlxuICAgKiBUaGlzIG9uZSB3aWxsIE5PVCBiZSByZWdpc3RlcmVkIHdpdGggRW50aXR5U2VydmljZXMhXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8XG4gICAgVCxcbiAgICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KGVudGl0eU5hbWUpO1xuICB9XG5cbiAgLyoqIEdldCAob3IgY3JlYXRlKSB0aGUgc2luZ2xldG9uIGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBnZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxcbiAgICBULFxuICAgIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgbGV0IHNlcnZpY2UgPSB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgIHNlcnZpY2UgPSB0aGlzLmNyZWF0ZUVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQsIFMkPihlbnRpdHlOYW1lKTtcbiAgICAgIHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW2VudGl0eU5hbWVdID0gc2VydmljZTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICAvKiogUmVnaXN0ZXIgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgdW5kZXIgaXRzIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBzZXJ2aWNlIHtFbnRpdHlDb2xsZWN0aW9uU2VydmljZX0gVGhlIGVudGl0eSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBzZXJ2aWNlTmFtZSB7c3RyaW5nfSBvcHRpb25hbCBzZXJ2aWNlIG5hbWUgdG8gdXNlIGluc3RlYWQgb2YgdGhlIHNlcnZpY2UncyBlbnRpdHlOYW1lXG4gICAqL1xuICByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+KFxuICAgIHNlcnZpY2U6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+LFxuICAgIHNlcnZpY2VOYW1lPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW3NlcnZpY2VOYW1lIHx8IHNlcnZpY2UuZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGVudGl0eSBzZXJ2aWNlcyBmb3Igc2V2ZXJhbCBlbnRpdHkgdHlwZXMgYXQgb25jZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB7RW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+W119XG4gICAqIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB0byByZWdpc3RlciwgZWl0aGVyIGFzIGEgbWFwIG9yIGFuIGFycmF5XG4gICAqL1xuICByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyhcbiAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6XG4gICAgICB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwXG4gICAgICB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXVxuICApOiB2b2lkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMpKSB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMuZm9yRWFjaChzZXJ2aWNlID0+XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZShzZXJ2aWNlKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMoZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHx8IHt9KS5mb3JFYWNoKHNlcnZpY2VOYW1lID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKFxuICAgICAgICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tzZXJ2aWNlTmFtZV0sXG4gICAgICAgICAgc2VydmljZU5hbWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19