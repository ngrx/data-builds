/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-services-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityServicesElements } from './entity-services-elements';
// tslint:disable:member-ordering
/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * \@example
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
export class EntityServicesBase {
    // Dear @ngrx/data developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    /**
     * @param {?} entityServicesElements
     */
    constructor(entityServicesElements) {
        this.entityServicesElements = entityServicesElements;
        /**
         * Registry of EntityCollectionService instances
         */
        this.EntityCollectionServices = {};
    }
    // #region EntityServicesElement-based properties
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @return {?}
     */
    get entityActionErrors$() {
        return this.entityServicesElements.entityActionErrors$;
    }
    /**
     * Observable of the entire entity cache
     * @return {?}
     */
    get entityCache$() {
        return this.entityServicesElements.entityCache$;
    }
    /**
     * Factory to create a default instance of an EntityCollectionService
     * @return {?}
     */
    get entityCollectionServiceFactory() {
        return this.entityServicesElements.entityCollectionServiceFactory;
    }
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @return {?}
     */
    get reducedActions$() {
        return this.entityServicesElements.reducedActions$;
    }
    /**
     * The ngrx store, scoped to the EntityCache
     * @protected
     * @return {?}
     */
    get store() {
        return this.entityServicesElements.store;
    }
    // #endregion EntityServicesElement-based properties
    /**
     * Dispatch any action to the store
     * @param {?} action
     * @return {?}
     */
    dispatch(action) {
        this.store.dispatch(action);
    }
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @protected
     * @template T, S$
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    createEntityCollectionService(entityName) {
        return this.entityCollectionServiceFactory.create(entityName);
    }
    /**
     * Get (or create) the singleton instance of an EntityCollectionService
     * @template T, S$
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    getEntityCollectionService(entityName) {
        /** @type {?} */
        let service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    }
    /**
     * Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @template T
     * @param {?} service {EntityCollectionService} The entity service
     * @param {?=} serviceName {string} optional service name to use instead of the service's entityName
     * @return {?}
     */
    registerEntityCollectionService(service, serviceName) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    }
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param {?} entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     * @return {?}
     */
    registerEntityCollectionServices(entityCollectionServices) {
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach((/**
             * @param {?} service
             * @return {?}
             */
            (service) => this.registerEntityCollectionService(service)));
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach((/**
             * @param {?} serviceName
             * @return {?}
             */
            (serviceName) => {
                this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
            }));
        }
    }
}
EntityServicesBase.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityServicesBase.ctorParameters = () => [
    { type: EntityServicesElements }
];
if (false) {
    /**
     * Registry of EntityCollectionService instances
     * @type {?}
     * @private
     */
    EntityServicesBase.prototype.EntityCollectionServices;
    /**
     * @type {?}
     * @private
     */
    EntityServicesBase.prototype.entityServicesElements;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFXM0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QnBFLE1BQU0sT0FBTyxrQkFBa0I7Ozs7Ozs7Ozs7O0lBUTdCLFlBQW9CLHNCQUE4QztRQUE5QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCOzs7O1FBd0NqRCw2QkFBd0IsR0FBK0IsRUFBRSxDQUFDO0lBeENOLENBQUM7Ozs7OztJQUt0RSxJQUFJLG1CQUFtQjtRQUNyQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQztJQUN6RCxDQUFDOzs7OztJQUdELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztJQUNsRCxDQUFDOzs7OztJQUdELElBQUksOEJBQThCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLDhCQUE4QixDQUFDO0lBQ3BFLENBQUM7Ozs7OztJQU1ELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUM7SUFDckQsQ0FBQzs7Ozs7O0lBR0QsSUFBYyxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDOzs7Ozs7O0lBS0QsUUFBUSxDQUFDLE1BQWM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQzs7Ozs7Ozs7OztJQVdTLDZCQUE2QixDQUdyQyxVQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQVEsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQzs7Ozs7OztJQUtELDBCQUEwQixDQUd4QixVQUFrQjs7WUFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQztRQUN2RCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBUSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7Ozs7O0lBT0QsK0JBQStCLENBQzdCLE9BQW1DLEVBQ25DLFdBQW9CO1FBRXBCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3RSxDQUFDOzs7Ozs7OztJQVFELGdDQUFnQyxDQUM5Qix3QkFFa0M7UUFFbEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDM0Msd0JBQXdCLENBQUMsT0FBTzs7OztZQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FDM0MsSUFBSSxDQUFDLCtCQUErQixDQUFDLE9BQU8sQ0FBQyxFQUM5QyxDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTzs7OztZQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ2xFLElBQUksQ0FBQywrQkFBK0IsQ0FDbEMsd0JBQXdCLENBQUMsV0FBVyxDQUFDLEVBQ3JDLFdBQVcsQ0FDWixDQUFDO1lBQ0osQ0FBQyxFQUFDLENBQUM7U0FDSjtJQUNILENBQUM7OztZQWxIRixVQUFVOzs7O1lBeEJGLHNCQUFzQjs7Ozs7Ozs7SUF5RTdCLHNEQUEyRTs7Ozs7SUF4Qy9ELG9EQUFzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwLCBFbnRpdHlTZXJ2aWNlcyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyQgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXNFbGVtZW50cyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nXG5cbi8qKlxuICogQmFzZS9kZWZhdWx0IGNsYXNzIG9mIGEgY2VudHJhbCByZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgZm9yIGFsbCBlbnRpdHkgdHlwZXMuXG4gKiBDcmVhdGUgeW91ciBvd24gc3ViY2xhc3MgdG8gYWRkIGFwcC1zcGVjaWZpYyBtZW1iZXJzIGZvciBhbiBpbXByb3ZlZCBkZXZlbG9wZXIgZXhwZXJpZW5jZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogZXhwb3J0IGNsYXNzIEVudGl0eVNlcnZpY2VzIGV4dGVuZHMgRW50aXR5U2VydmljZXNCYXNlIHtcbiAqICAgY29uc3RydWN0b3IoZW50aXR5U2VydmljZXNFbGVtZW50czogRW50aXR5U2VydmljZXNFbGVtZW50cykge1xuICogICAgIHN1cGVyKGVudGl0eVNlcnZpY2VzRWxlbWVudHMpO1xuICogICB9XG4gKiAgIC8vIEV4dGVuZCB3aXRoIHdlbGwta25vd24sIGFwcCBlbnRpdHkgY29sbGVjdGlvbiBzZXJ2aWNlc1xuICogICAvLyBDb252ZW5pZW5jZSBwcm9wZXJ0eSB0byByZXR1cm4gYSB0eXBlZCBjdXN0b20gZW50aXR5IGNvbGxlY3Rpb24gc2VydmljZVxuICogICBnZXQgY29tcGFueVNlcnZpY2UoKSB7XG4gKiAgICAgcmV0dXJuIHRoaXMuZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2U8TW9kZWwuQ29tcGFueT4oJ0NvbXBhbnknKSBhcyBDb21wYW55U2VydmljZTtcbiAqICAgfVxuICogICAvLyBDb252ZW5pZW5jZSBkaXNwYXRjaCBtZXRob2RzXG4gKiAgIGNsZWFyQ29tcGFueShjb21wYW55SWQ6IHN0cmluZykge1xuICogICAgIHRoaXMuZGlzcGF0Y2gobmV3IENsZWFyQ29tcGFueUFjdGlvbihjb21wYW55SWQpKTtcbiAqICAgfVxuICogfVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5U2VydmljZXNCYXNlIGltcGxlbWVudHMgRW50aXR5U2VydmljZXMge1xuICAvLyBEZWFyIEBuZ3J4L2RhdGEgZGV2ZWxvcGVyOiB0aGluayBoYXJkIGJlZm9yZSBjaGFuZ2luZyB0aGUgY29uc3RydWN0b3IuXG4gIC8vIERvaW5nIHNvIHdpbGwgYnJlYWsgYXBwcyB0aGF0IGRlcml2ZSBmcm9tIHRoaXMgYmFzZSBjbGFzcyxcbiAgLy8gYW5kIG1hbnkgYXBwcyB3aWxsIGRlcml2ZSBmcm9tIHRoaXMgY2xhc3MuXG4gIC8vXG4gIC8vIERvIG5vdCBnaXZlIHRoaXMgY29uc3RydWN0b3IgYW4gaW1wbGVtZW50YXRpb24uXG4gIC8vIERvaW5nIHNvIG1ha2VzIGl0IGhhcmQgdG8gbW9jayBjbGFzc2VzIHRoYXQgZGVyaXZlIGZyb20gdGhpcyBjbGFzcy5cbiAgLy8gVXNlIGdldHRlciBwcm9wZXJ0aWVzIGluc3RlYWQuIEZvciBleGFtcGxlLCBzZWUgZW50aXR5Q2FjaGUkXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5U2VydmljZXNFbGVtZW50czogRW50aXR5U2VydmljZXNFbGVtZW50cykge31cblxuICAvLyAjcmVnaW9uIEVudGl0eVNlcnZpY2VzRWxlbWVudC1iYXNlZCBwcm9wZXJ0aWVzXG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgRW50aXR5QWN0aW9ucyAoZS5nLiBRVUVSWV9BTExfRVJST1IpIGZvciBhbGwgZW50aXR5IHR5cGVzICovXG4gIGdldCBlbnRpdHlBY3Rpb25FcnJvcnMkKCk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlBY3Rpb25FcnJvcnMkO1xuICB9XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUgKi9cbiAgZ2V0IGVudGl0eUNhY2hlJCgpOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPiB8IFN0b3JlPEVudGl0eUNhY2hlPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlDYWNoZSQ7XG4gIH1cblxuICAvKiogRmFjdG9yeSB0byBjcmVhdGUgYSBkZWZhdWx0IGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlICovXG4gIGdldCBlbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkoKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIGdldCByZWR1Y2VkQWN0aW9ucyQoKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLnJlZHVjZWRBY3Rpb25zJDtcbiAgfVxuXG4gIC8qKiBUaGUgbmdyeCBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICBwcm90ZWN0ZWQgZ2V0IHN0b3JlKCk6IFN0b3JlPEVudGl0eUNhY2hlPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5zdG9yZTtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb24gRW50aXR5U2VydmljZXNFbGVtZW50LWJhc2VkIHByb3BlcnRpZXNcblxuICAvKiogRGlzcGF0Y2ggYW55IGFjdGlvbiB0byB0aGUgc3RvcmUgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pIHtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gIH1cblxuICAvKiogUmVnaXN0cnkgb2YgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzICovXG4gIHByaXZhdGUgcmVhZG9ubHkgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCA9IHt9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgZGVmYXVsdCBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZS5cbiAgICogUHJlZmVyIGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKCkgdW5sZXNzIHlvdSByZWFsbHkgd2FudCBhIG5ldyBkZWZhdWx0IGluc3RhbmNlLlxuICAgKiBUaGlzIG9uZSB3aWxsIE5PVCBiZSByZWdpc3RlcmVkIHdpdGggRW50aXR5U2VydmljZXMhXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8XG4gICAgVCxcbiAgICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KGVudGl0eU5hbWUpO1xuICB9XG5cbiAgLyoqIEdldCAob3IgY3JlYXRlKSB0aGUgc2luZ2xldG9uIGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBnZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxcbiAgICBULFxuICAgIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgbGV0IHNlcnZpY2UgPSB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgIHNlcnZpY2UgPSB0aGlzLmNyZWF0ZUVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQsIFMkPihlbnRpdHlOYW1lKTtcbiAgICAgIHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW2VudGl0eU5hbWVdID0gc2VydmljZTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICAvKiogUmVnaXN0ZXIgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgdW5kZXIgaXRzIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBzZXJ2aWNlIHtFbnRpdHlDb2xsZWN0aW9uU2VydmljZX0gVGhlIGVudGl0eSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBzZXJ2aWNlTmFtZSB7c3RyaW5nfSBvcHRpb25hbCBzZXJ2aWNlIG5hbWUgdG8gdXNlIGluc3RlYWQgb2YgdGhlIHNlcnZpY2UncyBlbnRpdHlOYW1lXG4gICAqL1xuICByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+KFxuICAgIHNlcnZpY2U6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+LFxuICAgIHNlcnZpY2VOYW1lPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW3NlcnZpY2VOYW1lIHx8IHNlcnZpY2UuZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGVudGl0eSBzZXJ2aWNlcyBmb3Igc2V2ZXJhbCBlbnRpdHkgdHlwZXMgYXQgb25jZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB7RW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+W119XG4gICAqIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB0byByZWdpc3RlciwgZWl0aGVyIGFzIGEgbWFwIG9yIGFuIGFycmF5XG4gICAqL1xuICByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyhcbiAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6XG4gICAgICB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwXG4gICAgICB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXVxuICApOiB2b2lkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMpKSB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMuZm9yRWFjaCgoc2VydmljZSkgPT5cbiAgICAgICAgdGhpcy5yZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKHNlcnZpY2UpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgfHwge30pLmZvckVhY2goKHNlcnZpY2VOYW1lKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZShcbiAgICAgICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWVdLFxuICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==