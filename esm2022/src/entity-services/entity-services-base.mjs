import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./entity-services-elements";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFhM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQ2Esa0JBQWtCO0lBQzdCLHlFQUF5RTtJQUN6RSw2REFBNkQ7SUFDN0QsNkNBQTZDO0lBQzdDLEVBQUU7SUFDRixrREFBa0Q7SUFDbEQsc0VBQXNFO0lBQ3RFLCtEQUErRDtJQUMvRCxZQUFvQixzQkFBOEM7UUFBOUMsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQXVDbEUsb0RBQW9EO1FBQ25DLDZCQUF3QixHQUErQixFQUFFLENBQUM7SUF4Q04sQ0FBQztJQUV0RSxpREFBaUQ7SUFFakQsb0ZBQW9GO0lBQ3BGLElBQUksbUJBQW1CO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLG1CQUFtQixDQUFDO0lBQ3pELENBQUM7SUFFRCw0Q0FBNEM7SUFDNUMsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDO0lBQ2xELENBQUM7SUFFRCx5RUFBeUU7SUFDekUsSUFBSSw4QkFBOEI7UUFDaEMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsOEJBQThCLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUM7SUFDckQsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxJQUFjLEtBQUs7UUFDakIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO0lBQzNDLENBQUM7SUFFRCxvREFBb0Q7SUFFcEQsdUNBQXVDO0lBQ3ZDLFFBQVEsQ0FBQyxNQUFjO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFLRDs7Ozs7T0FLRztJQUNPLDZCQUE2QixDQUdyQyxVQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQVEsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsMEJBQTBCLENBR3hCLFVBQWtCO1FBQ2xCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBUSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCwrQkFBK0IsQ0FDN0IsT0FBbUMsRUFDbkMsV0FBb0I7UUFFcEIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQzdFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGdDQUFnQyxDQUM5Qix3QkFFa0M7UUFFbEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDM0Msd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FDM0MsSUFBSSxDQUFDLCtCQUErQixDQUFDLE9BQU8sQ0FBQyxDQUM5QyxDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ2xFLElBQUksQ0FBQywrQkFBK0IsQ0FDbEMsd0JBQXdCLENBQUMsV0FBVyxDQUFDLEVBQ3JDLFdBQVcsQ0FDWixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7aUlBakhVLGtCQUFrQjtxSUFBbEIsa0JBQWtCOztTQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwLCBFbnRpdHlTZXJ2aWNlcyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyQgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXNFbGVtZW50cyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzJztcblxuLyoqXG4gKiBCYXNlL2RlZmF1bHQgY2xhc3Mgb2YgYSBjZW50cmFsIHJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyBmb3IgYWxsIGVudGl0eSB0eXBlcy5cbiAqIENyZWF0ZSB5b3VyIG93biBzdWJjbGFzcyB0byBhZGQgYXBwLXNwZWNpZmljIG1lbWJlcnMgZm9yIGFuIGltcHJvdmVkIGRldmVsb3BlciBleHBlcmllbmNlLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBgYGB0c1xuICogZXhwb3J0IGNsYXNzIEVudGl0eVNlcnZpY2VzIGV4dGVuZHMgRW50aXR5U2VydmljZXNCYXNlIHtcbiAqICAgY29uc3RydWN0b3IoZW50aXR5U2VydmljZXNFbGVtZW50czogRW50aXR5U2VydmljZXNFbGVtZW50cykge1xuICogICAgIHN1cGVyKGVudGl0eVNlcnZpY2VzRWxlbWVudHMpO1xuICogICB9XG4gKiAgIC8vIEV4dGVuZCB3aXRoIHdlbGwta25vd24sIGFwcCBlbnRpdHkgY29sbGVjdGlvbiBzZXJ2aWNlc1xuICogICAvLyBDb252ZW5pZW5jZSBwcm9wZXJ0eSB0byByZXR1cm4gYSB0eXBlZCBjdXN0b20gZW50aXR5IGNvbGxlY3Rpb24gc2VydmljZVxuICogICBnZXQgY29tcGFueVNlcnZpY2UoKSB7XG4gKiAgICAgcmV0dXJuIHRoaXMuZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2U8TW9kZWwuQ29tcGFueT4oJ0NvbXBhbnknKSBhcyBDb21wYW55U2VydmljZTtcbiAqICAgfVxuICogICAvLyBDb252ZW5pZW5jZSBkaXNwYXRjaCBtZXRob2RzXG4gKiAgIGNsZWFyQ29tcGFueShjb21wYW55SWQ6IHN0cmluZykge1xuICogICAgIHRoaXMuZGlzcGF0Y2gobmV3IENsZWFyQ29tcGFueUFjdGlvbihjb21wYW55SWQpKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlc0Jhc2UgaW1wbGVtZW50cyBFbnRpdHlTZXJ2aWNlcyB7XG4gIC8vIERlYXIgQG5ncngvZGF0YSBkZXZlbG9wZXI6IHRoaW5rIGhhcmQgYmVmb3JlIGNoYW5naW5nIHRoZSBjb25zdHJ1Y3Rvci5cbiAgLy8gRG9pbmcgc28gd2lsbCBicmVhayBhcHBzIHRoYXQgZGVyaXZlIGZyb20gdGhpcyBiYXNlIGNsYXNzLFxuICAvLyBhbmQgbWFueSBhcHBzIHdpbGwgZGVyaXZlIGZyb20gdGhpcyBjbGFzcy5cbiAgLy9cbiAgLy8gRG8gbm90IGdpdmUgdGhpcyBjb25zdHJ1Y3RvciBhbiBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gRG9pbmcgc28gbWFrZXMgaXQgaGFyZCB0byBtb2NrIGNsYXNzZXMgdGhhdCBkZXJpdmUgZnJvbSB0aGlzIGNsYXNzLlxuICAvLyBVc2UgZ2V0dGVyIHByb3BlcnRpZXMgaW5zdGVhZC4gRm9yIGV4YW1wbGUsIHNlZSBlbnRpdHlDYWNoZSRcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzOiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKSB7fVxuXG4gIC8vICNyZWdpb24gRW50aXR5U2VydmljZXNFbGVtZW50LWJhc2VkIHByb3BlcnRpZXNcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBFbnRpdHlBY3Rpb25zIChlLmcuIFFVRVJZX0FMTF9FUlJPUikgZm9yIGFsbCBlbnRpdHkgdHlwZXMgKi9cbiAgZ2V0IGVudGl0eUFjdGlvbkVycm9ycyQoKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUFjdGlvbkVycm9ycyQ7XG4gIH1cblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXJlIGVudGl0eSBjYWNoZSAqL1xuICBnZXQgZW50aXR5Q2FjaGUkKCk6IE9ic2VydmFibGU8RW50aXR5Q2FjaGU+IHwgU3RvcmU8RW50aXR5Q2FjaGU+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUNhY2hlJDtcbiAgfVxuXG4gIC8qKiBGYWN0b3J5IHRvIGNyZWF0ZSBhIGRlZmF1bHQgaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgKi9cbiAgZ2V0IGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSgpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgZ2V0IHJlZHVjZWRBY3Rpb25zJCgpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMucmVkdWNlZEFjdGlvbnMkO1xuICB9XG5cbiAgLyoqIFRoZSBuZ3J4IHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gIHByb3RlY3RlZCBnZXQgc3RvcmUoKTogU3RvcmU8RW50aXR5Q2FjaGU+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLnN0b3JlO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnQtYmFzZWQgcHJvcGVydGllc1xuXG4gIC8qKiBEaXNwYXRjaCBhbnkgYWN0aW9uIHRvIHRoZSBzdG9yZSAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBpbnN0YW5jZXMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwID0ge307XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBkZWZhdWx0IGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlLlxuICAgKiBQcmVmZXIgZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2UoKSB1bmxlc3MgeW91IHJlYWxseSB3YW50IGEgbmV3IGRlZmF1bHQgaW5zdGFuY2UuXG4gICAqIFRoaXMgb25lIHdpbGwgTk9UIGJlIHJlZ2lzdGVyZWQgd2l0aCBFbnRpdHlTZXJ2aWNlcyFcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxcbiAgICBULFxuICAgIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5LmNyZWF0ZTxULCBTJD4oZW50aXR5TmFtZSk7XG4gIH1cblxuICAvKiogR2V0IChvciBjcmVhdGUpIHRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFxuICAgIFQsXG4gICAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW2VudGl0eU5hbWVdO1xuICAgIGlmICghc2VydmljZSkge1xuICAgICAgc2VydmljZSA9IHRoaXMuY3JlYXRlRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VCwgUyQ+KGVudGl0eU5hbWUpO1xuICAgICAgdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICAgIH1cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB1bmRlciBpdHMgZW50aXR5IHR5cGUgbmFtZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIHNlcnZpY2Uge0VudGl0eUNvbGxlY3Rpb25TZXJ2aWNlfSBUaGUgZW50aXR5IHNlcnZpY2VcbiAgICogQHBhcmFtIHNlcnZpY2VOYW1lIHtzdHJpbmd9IG9wdGlvbmFsIHNlcnZpY2UgbmFtZSB0byB1c2UgaW5zdGVhZCBvZiB0aGUgc2VydmljZSdzIGVudGl0eU5hbWVcbiAgICovXG4gIHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4oXG4gICAgc2VydmljZTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgc2VydmljZU5hbWU/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWUgfHwgc2VydmljZS5lbnRpdHlOYW1lXSA9IHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgZW50aXR5IHNlcnZpY2VzIGZvciBzZXZlcmFsIGVudGl0eSB0eXBlcyBhdCBvbmNlLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHtFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXX1cbiAgICogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHRvIHJlZ2lzdGVyLCBlaXRoZXIgYXMgYSBtYXAgb3IgYW4gYXJyYXlcbiAgICovXG4gIHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzKFxuICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlczpcbiAgICAgIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXBcbiAgICAgIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8YW55PltdXG4gICk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcykpIHtcbiAgICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcy5mb3JFYWNoKChzZXJ2aWNlKSA9PlxuICAgICAgICB0aGlzLnJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2Uoc2VydmljZSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB8fCB7fSkuZm9yRWFjaCgoc2VydmljZU5hbWUpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKFxuICAgICAgICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tzZXJ2aWNlTmFtZV0sXG4gICAgICAgICAgc2VydmljZU5hbWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19