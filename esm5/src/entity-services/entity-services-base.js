import { __decorate, __metadata } from "tslib";
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
    // Dear @ngrx/data developer: think hard before changing the constructor.
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
    EntityServicesBase = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [EntityServicesElements])
    ], EntityServicesBase);
    return EntityServicesBase;
}());
export { EntityServicesBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVczQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVwRSxpQ0FBaUM7QUFFakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFFSDtJQUNFLHlFQUF5RTtJQUN6RSw2REFBNkQ7SUFDN0QsNkNBQTZDO0lBQzdDLEVBQUU7SUFDRixrREFBa0Q7SUFDbEQsc0VBQXNFO0lBQ3RFLCtEQUErRDtJQUMvRCw0QkFBb0Isc0JBQThDO1FBQTlDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUF1Q2xFLG9EQUFvRDtRQUNuQyw2QkFBd0IsR0FBK0IsRUFBRSxDQUFDO0lBeENOLENBQUM7SUFLdEUsc0JBQUksbURBQW1CO1FBSHZCLGlEQUFpRDtRQUVqRCxvRkFBb0Y7YUFDcEY7WUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6RCxDQUFDOzs7T0FBQTtJQUdELHNCQUFJLDRDQUFZO1FBRGhCLDRDQUE0QzthQUM1QztZQUNFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztRQUNsRCxDQUFDOzs7T0FBQTtJQUdELHNCQUFJLDhEQUE4QjtRQURsQyx5RUFBeUU7YUFDekU7WUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyw4QkFBOEIsQ0FBQztRQUNwRSxDQUFDOzs7T0FBQTtJQU1ELHNCQUFJLCtDQUFlO1FBSm5COzs7V0FHRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDO1FBQ3JELENBQUM7OztPQUFBO0lBR0Qsc0JBQWMscUNBQUs7UUFEbkIsZ0RBQWdEO2FBQ2hEO1lBQ0UsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO1FBQzNDLENBQUM7OztPQUFBO0lBRUQsb0RBQW9EO0lBRXBELHVDQUF1QztJQUN2QyxxQ0FBUSxHQUFSLFVBQVMsTUFBYztRQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBS0Q7Ozs7O09BS0c7SUFDTywwREFBNkIsR0FBdkMsVUFHRSxVQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQVEsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdURBQTBCLEdBQTFCLFVBR0UsVUFBa0I7UUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFRLFVBQVUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDckQ7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDREQUErQixHQUEvQixVQUNFLE9BQW1DLEVBQ25DLFdBQW9CO1FBRXBCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw2REFBZ0MsR0FBaEMsVUFDRSx3QkFFa0M7UUFIcEMsaUJBaUJDO1FBWkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDM0Msd0JBQXdCLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztnQkFDdEMsT0FBQSxLQUFJLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUFDO1lBQTdDLENBQTZDLENBQzlDLENBQUM7U0FDSDthQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxXQUFXO2dCQUM3RCxLQUFJLENBQUMsK0JBQStCLENBQ2xDLHdCQUF3QixDQUFDLFdBQVcsQ0FBQyxFQUNyQyxXQUFXLENBQ1osQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBakhVLGtCQUFrQjtRQUQ5QixVQUFVLEVBQUU7eUNBU2lDLHNCQUFzQjtPQVJ2RCxrQkFBa0IsQ0FrSDlCO0lBQUQseUJBQUM7Q0FBQSxBQWxIRCxJQWtIQztTQWxIWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCwgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy1lbGVtZW50cyc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZ1xuXG4vKipcbiAqIEJhc2UvZGVmYXVsdCBjbGFzcyBvZiBhIGNlbnRyYWwgcmVnaXN0cnkgb2YgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIGZvciBhbGwgZW50aXR5IHR5cGVzLlxuICogQ3JlYXRlIHlvdXIgb3duIHN1YmNsYXNzIHRvIGFkZCBhcHAtc3BlY2lmaWMgbWVtYmVycyBmb3IgYW4gaW1wcm92ZWQgZGV2ZWxvcGVyIGV4cGVyaWVuY2UuXG4gKlxuICogQGV4YW1wbGVcbiAqIGV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlcyBleHRlbmRzIEVudGl0eVNlcnZpY2VzQmFzZSB7XG4gKiAgIGNvbnN0cnVjdG9yKGVudGl0eVNlcnZpY2VzRWxlbWVudHM6IEVudGl0eVNlcnZpY2VzRWxlbWVudHMpIHtcbiAqICAgICBzdXBlcihlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKTtcbiAqICAgfVxuICogICAvLyBFeHRlbmQgd2l0aCB3ZWxsLWtub3duLCBhcHAgZW50aXR5IGNvbGxlY3Rpb24gc2VydmljZXNcbiAqICAgLy8gQ29udmVuaWVuY2UgcHJvcGVydHkgdG8gcmV0dXJuIGEgdHlwZWQgY3VzdG9tIGVudGl0eSBjb2xsZWN0aW9uIHNlcnZpY2VcbiAqICAgZ2V0IGNvbXBhbnlTZXJ2aWNlKCkge1xuICogICAgIHJldHVybiB0aGlzLmdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPE1vZGVsLkNvbXBhbnk+KCdDb21wYW55JykgYXMgQ29tcGFueVNlcnZpY2U7XG4gKiAgIH1cbiAqICAgLy8gQ29udmVuaWVuY2UgZGlzcGF0Y2ggbWV0aG9kc1xuICogICBjbGVhckNvbXBhbnkoY29tcGFueUlkOiBzdHJpbmcpIHtcbiAqICAgICB0aGlzLmRpc3BhdGNoKG5ldyBDbGVhckNvbXBhbnlBY3Rpb24oY29tcGFueUlkKSk7XG4gKiAgIH1cbiAqIH1cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eVNlcnZpY2VzQmFzZSBpbXBsZW1lbnRzIEVudGl0eVNlcnZpY2VzIHtcbiAgLy8gRGVhciBAbmdyeC9kYXRhIGRldmVsb3BlcjogdGhpbmsgaGFyZCBiZWZvcmUgY2hhbmdpbmcgdGhlIGNvbnN0cnVjdG9yLlxuICAvLyBEb2luZyBzbyB3aWxsIGJyZWFrIGFwcHMgdGhhdCBkZXJpdmUgZnJvbSB0aGlzIGJhc2UgY2xhc3MsXG4gIC8vIGFuZCBtYW55IGFwcHMgd2lsbCBkZXJpdmUgZnJvbSB0aGlzIGNsYXNzLlxuICAvL1xuICAvLyBEbyBub3QgZ2l2ZSB0aGlzIGNvbnN0cnVjdG9yIGFuIGltcGxlbWVudGF0aW9uLlxuICAvLyBEb2luZyBzbyBtYWtlcyBpdCBoYXJkIHRvIG1vY2sgY2xhc3NlcyB0aGF0IGRlcml2ZSBmcm9tIHRoaXMgY2xhc3MuXG4gIC8vIFVzZSBnZXR0ZXIgcHJvcGVydGllcyBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgc2VlIGVudGl0eUNhY2hlJFxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVudGl0eVNlcnZpY2VzRWxlbWVudHM6IEVudGl0eVNlcnZpY2VzRWxlbWVudHMpIHt9XG5cbiAgLy8gI3JlZ2lvbiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnQtYmFzZWQgcHJvcGVydGllc1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICBnZXQgZW50aXR5QWN0aW9uRXJyb3JzJCgpOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5QWN0aW9uRXJyb3JzJDtcbiAgfVxuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpcmUgZW50aXR5IGNhY2hlICovXG4gIGdldCBlbnRpdHlDYWNoZSQoKTogT2JzZXJ2YWJsZTxFbnRpdHlDYWNoZT4gfCBTdG9yZTxFbnRpdHlDYWNoZT4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5Q2FjaGUkO1xuICB9XG5cbiAgLyoqIEZhY3RvcnkgdG8gY3JlYXRlIGEgZGVmYXVsdCBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSAqL1xuICBnZXQgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5KCk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnk7XG4gIH1cblxuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICBnZXQgcmVkdWNlZEFjdGlvbnMkKCk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5yZWR1Y2VkQWN0aW9ucyQ7XG4gIH1cblxuICAvKiogVGhlIG5ncnggc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgcHJvdGVjdGVkIGdldCBzdG9yZSgpOiBTdG9yZTxFbnRpdHlDYWNoZT4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuc3RvcmU7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uIEVudGl0eVNlcnZpY2VzRWxlbWVudC1iYXNlZCBwcm9wZXJ0aWVzXG5cbiAgLyoqIERpc3BhdGNoIGFueSBhY3Rpb24gdG8gdGhlIHN0b3JlICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICB9XG5cbiAgLyoqIFJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGluc3RhbmNlcyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlczogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAgPSB7fTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGRlZmF1bHQgaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UuXG4gICAqIFByZWZlciBnZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZSgpIHVubGVzcyB5b3UgcmVhbGx5IHdhbnQgYSBuZXcgZGVmYXVsdCBpbnN0YW5jZS5cbiAgICogVGhpcyBvbmUgd2lsbCBOT1QgYmUgcmVnaXN0ZXJlZCB3aXRoIEVudGl0eVNlcnZpY2VzIVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBvZiB0aGUgc2VydmljZVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFxuICAgIFQsXG4gICAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkuY3JlYXRlPFQsIFMkPihlbnRpdHlOYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXQgKG9yIGNyZWF0ZSkgdGhlIHNpbmdsZXRvbiBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBvZiB0aGUgc2VydmljZVxuICAgKi9cbiAgZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2U8XG4gICAgVCxcbiAgICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIGxldCBzZXJ2aWNlID0gdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFzZXJ2aWNlKSB7XG4gICAgICBzZXJ2aWNlID0gdGhpcy5jcmVhdGVFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxULCBTJD4oZW50aXR5TmFtZSk7XG4gICAgICB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tlbnRpdHlOYW1lXSA9IHNlcnZpY2U7XG4gICAgfVxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVyIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIHVuZGVyIGl0cyBlbnRpdHkgdHlwZSBuYW1lLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gc2VydmljZSB7RW50aXR5Q29sbGVjdGlvblNlcnZpY2V9IFRoZSBlbnRpdHkgc2VydmljZVxuICAgKiBAcGFyYW0gc2VydmljZU5hbWUge3N0cmluZ30gb3B0aW9uYWwgc2VydmljZSBuYW1lIHRvIHVzZSBpbnN0ZWFkIG9mIHRoZSBzZXJ2aWNlJ3MgZW50aXR5TmFtZVxuICAgKi9cbiAgcmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPihcbiAgICBzZXJ2aWNlOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPixcbiAgICBzZXJ2aWNlTmFtZT86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tzZXJ2aWNlTmFtZSB8fCBzZXJ2aWNlLmVudGl0eU5hbWVdID0gc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBlbnRpdHkgc2VydmljZXMgZm9yIHNldmVyYWwgZW50aXR5IHR5cGVzIGF0IG9uY2UuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMge0VudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8YW55PltdfVxuICAgKiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgdG8gcmVnaXN0ZXIsIGVpdGhlciBhcyBhIG1hcCBvciBhbiBhcnJheVxuICAgKi9cbiAgcmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMoXG4gICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzOlxuICAgICAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcFxuICAgICAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+W11cbiAgKTogdm9pZCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzKSkge1xuICAgICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzLmZvckVhY2goc2VydmljZSA9PlxuICAgICAgICB0aGlzLnJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2Uoc2VydmljZSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB8fCB7fSkuZm9yRWFjaChzZXJ2aWNlTmFtZSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZShcbiAgICAgICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWVdLFxuICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==