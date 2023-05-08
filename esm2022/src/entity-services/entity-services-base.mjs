import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./entity-services-elements";
/* eslint-disable @typescript-eslint/member-ordering */
/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @usageNotes
 * ```ts
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
 * ```
 */
class EntityServicesBase {
    // Dear @ngrx/data developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    constructor(entityServicesElements) {
        this.entityServicesElements = entityServicesElements;
        /** Registry of EntityCollectionService instances */
        this.EntityCollectionServices = {};
    }
    // #region EntityServicesElement-based properties
    /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    get entityActionErrors$() {
        return this.entityServicesElements.entityActionErrors$;
    }
    /** Observable of the entire entity cache */
    get entityCache$() {
        return this.entityServicesElements.entityCache$;
    }
    /** Factory to create a default instance of an EntityCollectionService */
    get entityCollectionServiceFactory() {
        return this.entityServicesElements.entityCollectionServiceFactory;
    }
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    get reducedActions$() {
        return this.entityServicesElements.reducedActions$;
    }
    /** The ngrx store, scoped to the EntityCache */
    get store() {
        return this.entityServicesElements.store;
    }
    // #endregion EntityServicesElement-based properties
    /** Dispatch any action to the store */
    dispatch(action) {
        this.store.dispatch(action);
    }
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    createEntityCollectionService(entityName) {
        return this.entityCollectionServiceFactory.create(entityName);
    }
    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    getEntityCollectionService(entityName) {
        let service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    }
    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    registerEntityCollectionService(service, serviceName) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    }
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    registerEntityCollectionServices(entityCollectionServices) {
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach((service) => this.registerEntityCollectionService(service));
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach((serviceName) => {
                this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
            });
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityServicesBase, deps: [{ token: i1.EntityServicesElements }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityServicesBase }); }
}
export { EntityServicesBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityServicesBase, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityServicesElements }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFhM0MsdURBQXVEO0FBRXZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFDSCxNQUNhLGtCQUFrQjtJQUM3Qix5RUFBeUU7SUFDekUsNkRBQTZEO0lBQzdELDZDQUE2QztJQUM3QyxFQUFFO0lBQ0Ysa0RBQWtEO0lBQ2xELHNFQUFzRTtJQUN0RSwrREFBK0Q7SUFDL0QsWUFBb0Isc0JBQThDO1FBQTlDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUF1Q2xFLG9EQUFvRDtRQUNuQyw2QkFBd0IsR0FBK0IsRUFBRSxDQUFDO0lBeENOLENBQUM7SUFFdEUsaURBQWlEO0lBRWpELG9GQUFvRjtJQUNwRixJQUFJLG1CQUFtQjtRQUNyQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQztJQUN6RCxDQUFDO0lBRUQsNENBQTRDO0lBQzVDLElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztJQUNsRCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLElBQUksOEJBQThCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLDhCQUE4QixDQUFDO0lBQ3BFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDO0lBQ3JELENBQUM7SUFFRCxnREFBZ0Q7SUFDaEQsSUFBYyxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDO0lBRUQsb0RBQW9EO0lBRXBELHVDQUF1QztJQUN2QyxRQUFRLENBQUMsTUFBYztRQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBS0Q7Ozs7O09BS0c7SUFDTyw2QkFBNkIsQ0FHckMsVUFBa0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsOEJBQThCLENBQUMsTUFBTSxDQUFRLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7T0FFRztJQUNILDBCQUEwQixDQUd4QixVQUFrQjtRQUNsQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQVEsVUFBVSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNyRDtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsK0JBQStCLENBQzdCLE9BQW1DLEVBQ25DLFdBQW9CO1FBRXBCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxnQ0FBZ0MsQ0FDOUIsd0JBRWtDO1FBRWxDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQzNDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQzNDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxPQUFPLENBQUMsQ0FDOUMsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUNsRSxJQUFJLENBQUMsK0JBQStCLENBQ2xDLHdCQUF3QixDQUFDLFdBQVcsQ0FBQyxFQUNyQyxXQUFXLENBQ1osQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO2lJQWpIVSxrQkFBa0I7cUlBQWxCLGtCQUFrQjs7U0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCwgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy1lbGVtZW50cyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9tZW1iZXItb3JkZXJpbmcgKi9cblxuLyoqXG4gKiBCYXNlL2RlZmF1bHQgY2xhc3Mgb2YgYSBjZW50cmFsIHJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyBmb3IgYWxsIGVudGl0eSB0eXBlcy5cbiAqIENyZWF0ZSB5b3VyIG93biBzdWJjbGFzcyB0byBhZGQgYXBwLXNwZWNpZmljIG1lbWJlcnMgZm9yIGFuIGltcHJvdmVkIGRldmVsb3BlciBleHBlcmllbmNlLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBgYGB0c1xuICogZXhwb3J0IGNsYXNzIEVudGl0eVNlcnZpY2VzIGV4dGVuZHMgRW50aXR5U2VydmljZXNCYXNlIHtcbiAqICAgY29uc3RydWN0b3IoZW50aXR5U2VydmljZXNFbGVtZW50czogRW50aXR5U2VydmljZXNFbGVtZW50cykge1xuICogICAgIHN1cGVyKGVudGl0eVNlcnZpY2VzRWxlbWVudHMpO1xuICogICB9XG4gKiAgIC8vIEV4dGVuZCB3aXRoIHdlbGwta25vd24sIGFwcCBlbnRpdHkgY29sbGVjdGlvbiBzZXJ2aWNlc1xuICogICAvLyBDb252ZW5pZW5jZSBwcm9wZXJ0eSB0byByZXR1cm4gYSB0eXBlZCBjdXN0b20gZW50aXR5IGNvbGxlY3Rpb24gc2VydmljZVxuICogICBnZXQgY29tcGFueVNlcnZpY2UoKSB7XG4gKiAgICAgcmV0dXJuIHRoaXMuZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2U8TW9kZWwuQ29tcGFueT4oJ0NvbXBhbnknKSBhcyBDb21wYW55U2VydmljZTtcbiAqICAgfVxuICogICAvLyBDb252ZW5pZW5jZSBkaXNwYXRjaCBtZXRob2RzXG4gKiAgIGNsZWFyQ29tcGFueShjb21wYW55SWQ6IHN0cmluZykge1xuICogICAgIHRoaXMuZGlzcGF0Y2gobmV3IENsZWFyQ29tcGFueUFjdGlvbihjb21wYW55SWQpKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlc0Jhc2UgaW1wbGVtZW50cyBFbnRpdHlTZXJ2aWNlcyB7XG4gIC8vIERlYXIgQG5ncngvZGF0YSBkZXZlbG9wZXI6IHRoaW5rIGhhcmQgYmVmb3JlIGNoYW5naW5nIHRoZSBjb25zdHJ1Y3Rvci5cbiAgLy8gRG9pbmcgc28gd2lsbCBicmVhayBhcHBzIHRoYXQgZGVyaXZlIGZyb20gdGhpcyBiYXNlIGNsYXNzLFxuICAvLyBhbmQgbWFueSBhcHBzIHdpbGwgZGVyaXZlIGZyb20gdGhpcyBjbGFzcy5cbiAgLy9cbiAgLy8gRG8gbm90IGdpdmUgdGhpcyBjb25zdHJ1Y3RvciBhbiBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gRG9pbmcgc28gbWFrZXMgaXQgaGFyZCB0byBtb2NrIGNsYXNzZXMgdGhhdCBkZXJpdmUgZnJvbSB0aGlzIGNsYXNzLlxuICAvLyBVc2UgZ2V0dGVyIHByb3BlcnRpZXMgaW5zdGVhZC4gRm9yIGV4YW1wbGUsIHNlZSBlbnRpdHlDYWNoZSRcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzOiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKSB7fVxuXG4gIC8vICNyZWdpb24gRW50aXR5U2VydmljZXNFbGVtZW50LWJhc2VkIHByb3BlcnRpZXNcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBFbnRpdHlBY3Rpb25zIChlLmcuIFFVRVJZX0FMTF9FUlJPUikgZm9yIGFsbCBlbnRpdHkgdHlwZXMgKi9cbiAgZ2V0IGVudGl0eUFjdGlvbkVycm9ycyQoKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUFjdGlvbkVycm9ycyQ7XG4gIH1cblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXJlIGVudGl0eSBjYWNoZSAqL1xuICBnZXQgZW50aXR5Q2FjaGUkKCk6IE9ic2VydmFibGU8RW50aXR5Q2FjaGU+IHwgU3RvcmU8RW50aXR5Q2FjaGU+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUNhY2hlJDtcbiAgfVxuXG4gIC8qKiBGYWN0b3J5IHRvIGNyZWF0ZSBhIGRlZmF1bHQgaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgKi9cbiAgZ2V0IGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSgpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgZ2V0IHJlZHVjZWRBY3Rpb25zJCgpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMucmVkdWNlZEFjdGlvbnMkO1xuICB9XG5cbiAgLyoqIFRoZSBuZ3J4IHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gIHByb3RlY3RlZCBnZXQgc3RvcmUoKTogU3RvcmU8RW50aXR5Q2FjaGU+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLnN0b3JlO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnQtYmFzZWQgcHJvcGVydGllc1xuXG4gIC8qKiBEaXNwYXRjaCBhbnkgYWN0aW9uIHRvIHRoZSBzdG9yZSAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBpbnN0YW5jZXMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwID0ge307XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBkZWZhdWx0IGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlLlxuICAgKiBQcmVmZXIgZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2UoKSB1bmxlc3MgeW91IHJlYWxseSB3YW50IGEgbmV3IGRlZmF1bHQgaW5zdGFuY2UuXG4gICAqIFRoaXMgb25lIHdpbGwgTk9UIGJlIHJlZ2lzdGVyZWQgd2l0aCBFbnRpdHlTZXJ2aWNlcyFcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxcbiAgICBULFxuICAgIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5LmNyZWF0ZTxULCBTJD4oZW50aXR5TmFtZSk7XG4gIH1cblxuICAvKiogR2V0IChvciBjcmVhdGUpIHRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFxuICAgIFQsXG4gICAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW2VudGl0eU5hbWVdO1xuICAgIGlmICghc2VydmljZSkge1xuICAgICAgc2VydmljZSA9IHRoaXMuY3JlYXRlRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VCwgUyQ+KGVudGl0eU5hbWUpO1xuICAgICAgdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICAgIH1cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB1bmRlciBpdHMgZW50aXR5IHR5cGUgbmFtZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIHNlcnZpY2Uge0VudGl0eUNvbGxlY3Rpb25TZXJ2aWNlfSBUaGUgZW50aXR5IHNlcnZpY2VcbiAgICogQHBhcmFtIHNlcnZpY2VOYW1lIHtzdHJpbmd9IG9wdGlvbmFsIHNlcnZpY2UgbmFtZSB0byB1c2UgaW5zdGVhZCBvZiB0aGUgc2VydmljZSdzIGVudGl0eU5hbWVcbiAgICovXG4gIHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4oXG4gICAgc2VydmljZTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgc2VydmljZU5hbWU/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWUgfHwgc2VydmljZS5lbnRpdHlOYW1lXSA9IHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgZW50aXR5IHNlcnZpY2VzIGZvciBzZXZlcmFsIGVudGl0eSB0eXBlcyBhdCBvbmNlLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHtFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXX1cbiAgICogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHRvIHJlZ2lzdGVyLCBlaXRoZXIgYXMgYSBtYXAgb3IgYW4gYXJyYXlcbiAgICovXG4gIHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzKFxuICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlczpcbiAgICAgIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXBcbiAgICAgIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8YW55PltdXG4gICk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcykpIHtcbiAgICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcy5mb3JFYWNoKChzZXJ2aWNlKSA9PlxuICAgICAgICB0aGlzLnJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2Uoc2VydmljZSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB8fCB7fSkuZm9yRWFjaCgoc2VydmljZU5hbWUpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKFxuICAgICAgICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tzZXJ2aWNlTmFtZV0sXG4gICAgICAgICAgc2VydmljZU5hbWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19