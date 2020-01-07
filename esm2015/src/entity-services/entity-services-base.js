/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-services/entity-services-base.ts
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
            service => this.registerEntityCollectionService(service)));
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach((/**
             * @param {?} serviceName
             * @return {?}
             */
            serviceName => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFXM0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QnBFLE1BQU0sT0FBTyxrQkFBa0I7Ozs7Ozs7Ozs7O0lBUTdCLFlBQW9CLHNCQUE4QztRQUE5QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCOzs7O1FBd0NqRCw2QkFBd0IsR0FBK0IsRUFBRSxDQUFDO0lBeENOLENBQUM7Ozs7OztJQUt0RSxJQUFJLG1CQUFtQjtRQUNyQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQztJQUN6RCxDQUFDOzs7OztJQUdELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztJQUNsRCxDQUFDOzs7OztJQUdELElBQUksOEJBQThCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLDhCQUE4QixDQUFDO0lBQ3BFLENBQUM7Ozs7OztJQU1ELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUM7SUFDckQsQ0FBQzs7Ozs7O0lBR0QsSUFBYyxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDOzs7Ozs7O0lBS0QsUUFBUSxDQUFDLE1BQWM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQzs7Ozs7Ozs7OztJQVdTLDZCQUE2QixDQUdyQyxVQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQVEsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQzs7Ozs7OztJQUtELDBCQUEwQixDQUd4QixVQUFrQjs7WUFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQztRQUN2RCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBUSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7Ozs7O0lBT0QsK0JBQStCLENBQzdCLE9BQW1DLEVBQ25DLFdBQW9CO1FBRXBCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3RSxDQUFDOzs7Ozs7OztJQVFELGdDQUFnQyxDQUM5Qix3QkFFa0M7UUFFbEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDM0Msd0JBQXdCLENBQUMsT0FBTzs7OztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQ3pDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxPQUFPLENBQUMsRUFDOUMsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU87Ozs7WUFBQyxXQUFXLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxDQUFDLCtCQUErQixDQUNsQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsRUFDckMsV0FBVyxDQUNaLENBQUM7WUFDSixDQUFDLEVBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7O1lBbEhGLFVBQVU7Ozs7WUF4QkYsc0JBQXNCOzs7Ozs7OztJQXlFN0Isc0RBQTJFOzs7OztJQXhDL0Qsb0RBQXNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAsIEVudGl0eVNlcnZpY2VzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMtZWxlbWVudHMnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptZW1iZXItb3JkZXJpbmdcblxuLyoqXG4gKiBCYXNlL2RlZmF1bHQgY2xhc3Mgb2YgYSBjZW50cmFsIHJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyBmb3IgYWxsIGVudGl0eSB0eXBlcy5cbiAqIENyZWF0ZSB5b3VyIG93biBzdWJjbGFzcyB0byBhZGQgYXBwLXNwZWNpZmljIG1lbWJlcnMgZm9yIGFuIGltcHJvdmVkIGRldmVsb3BlciBleHBlcmllbmNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBleHBvcnQgY2xhc3MgRW50aXR5U2VydmljZXMgZXh0ZW5kcyBFbnRpdHlTZXJ2aWNlc0Jhc2Uge1xuICogICBjb25zdHJ1Y3RvcihlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzOiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKSB7XG4gKiAgICAgc3VwZXIoZW50aXR5U2VydmljZXNFbGVtZW50cyk7XG4gKiAgIH1cbiAqICAgLy8gRXh0ZW5kIHdpdGggd2VsbC1rbm93biwgYXBwIGVudGl0eSBjb2xsZWN0aW9uIHNlcnZpY2VzXG4gKiAgIC8vIENvbnZlbmllbmNlIHByb3BlcnR5IHRvIHJldHVybiBhIHR5cGVkIGN1c3RvbSBlbnRpdHkgY29sbGVjdGlvbiBzZXJ2aWNlXG4gKiAgIGdldCBjb21wYW55U2VydmljZSgpIHtcbiAqICAgICByZXR1cm4gdGhpcy5nZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxNb2RlbC5Db21wYW55PignQ29tcGFueScpIGFzIENvbXBhbnlTZXJ2aWNlO1xuICogICB9XG4gKiAgIC8vIENvbnZlbmllbmNlIGRpc3BhdGNoIG1ldGhvZHNcbiAqICAgY2xlYXJDb21wYW55KGNvbXBhbnlJZDogc3RyaW5nKSB7XG4gKiAgICAgdGhpcy5kaXNwYXRjaChuZXcgQ2xlYXJDb21wYW55QWN0aW9uKGNvbXBhbnlJZCkpO1xuICogICB9XG4gKiB9XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlc0Jhc2UgaW1wbGVtZW50cyBFbnRpdHlTZXJ2aWNlcyB7XG4gIC8vIERlYXIgQG5ncngvZGF0YSBkZXZlbG9wZXI6IHRoaW5rIGhhcmQgYmVmb3JlIGNoYW5naW5nIHRoZSBjb25zdHJ1Y3Rvci5cbiAgLy8gRG9pbmcgc28gd2lsbCBicmVhayBhcHBzIHRoYXQgZGVyaXZlIGZyb20gdGhpcyBiYXNlIGNsYXNzLFxuICAvLyBhbmQgbWFueSBhcHBzIHdpbGwgZGVyaXZlIGZyb20gdGhpcyBjbGFzcy5cbiAgLy9cbiAgLy8gRG8gbm90IGdpdmUgdGhpcyBjb25zdHJ1Y3RvciBhbiBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gRG9pbmcgc28gbWFrZXMgaXQgaGFyZCB0byBtb2NrIGNsYXNzZXMgdGhhdCBkZXJpdmUgZnJvbSB0aGlzIGNsYXNzLlxuICAvLyBVc2UgZ2V0dGVyIHByb3BlcnRpZXMgaW5zdGVhZC4gRm9yIGV4YW1wbGUsIHNlZSBlbnRpdHlDYWNoZSRcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzOiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKSB7fVxuXG4gIC8vICNyZWdpb24gRW50aXR5U2VydmljZXNFbGVtZW50LWJhc2VkIHByb3BlcnRpZXNcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBFbnRpdHlBY3Rpb25zIChlLmcuIFFVRVJZX0FMTF9FUlJPUikgZm9yIGFsbCBlbnRpdHkgdHlwZXMgKi9cbiAgZ2V0IGVudGl0eUFjdGlvbkVycm9ycyQoKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUFjdGlvbkVycm9ycyQ7XG4gIH1cblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZW50aXJlIGVudGl0eSBjYWNoZSAqL1xuICBnZXQgZW50aXR5Q2FjaGUkKCk6IE9ic2VydmFibGU8RW50aXR5Q2FjaGU+IHwgU3RvcmU8RW50aXR5Q2FjaGU+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUNhY2hlJDtcbiAgfVxuXG4gIC8qKiBGYWN0b3J5IHRvIGNyZWF0ZSBhIGRlZmF1bHQgaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgKi9cbiAgZ2V0IGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSgpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgZ2V0IHJlZHVjZWRBY3Rpb25zJCgpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMucmVkdWNlZEFjdGlvbnMkO1xuICB9XG5cbiAgLyoqIFRoZSBuZ3J4IHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gIHByb3RlY3RlZCBnZXQgc3RvcmUoKTogU3RvcmU8RW50aXR5Q2FjaGU+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLnN0b3JlO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvbiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnQtYmFzZWQgcHJvcGVydGllc1xuXG4gIC8qKiBEaXNwYXRjaCBhbnkgYWN0aW9uIHRvIHRoZSBzdG9yZSAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBpbnN0YW5jZXMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwID0ge307XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBkZWZhdWx0IGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlLlxuICAgKiBQcmVmZXIgZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2UoKSB1bmxlc3MgeW91IHJlYWxseSB3YW50IGEgbmV3IGRlZmF1bHQgaW5zdGFuY2UuXG4gICAqIFRoaXMgb25lIHdpbGwgTk9UIGJlIHJlZ2lzdGVyZWQgd2l0aCBFbnRpdHlTZXJ2aWNlcyFcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxcbiAgICBULFxuICAgIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5LmNyZWF0ZTxULCBTJD4oZW50aXR5TmFtZSk7XG4gIH1cblxuICAvKiogR2V0IChvciBjcmVhdGUpIHRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFxuICAgIFQsXG4gICAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW2VudGl0eU5hbWVdO1xuICAgIGlmICghc2VydmljZSkge1xuICAgICAgc2VydmljZSA9IHRoaXMuY3JlYXRlRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VCwgUyQ+KGVudGl0eU5hbWUpO1xuICAgICAgdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICAgIH1cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB1bmRlciBpdHMgZW50aXR5IHR5cGUgbmFtZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIHNlcnZpY2Uge0VudGl0eUNvbGxlY3Rpb25TZXJ2aWNlfSBUaGUgZW50aXR5IHNlcnZpY2VcbiAgICogQHBhcmFtIHNlcnZpY2VOYW1lIHtzdHJpbmd9IG9wdGlvbmFsIHNlcnZpY2UgbmFtZSB0byB1c2UgaW5zdGVhZCBvZiB0aGUgc2VydmljZSdzIGVudGl0eU5hbWVcbiAgICovXG4gIHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4oXG4gICAgc2VydmljZTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgc2VydmljZU5hbWU/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWUgfHwgc2VydmljZS5lbnRpdHlOYW1lXSA9IHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgZW50aXR5IHNlcnZpY2VzIGZvciBzZXZlcmFsIGVudGl0eSB0eXBlcyBhdCBvbmNlLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHtFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXX1cbiAgICogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHRvIHJlZ2lzdGVyLCBlaXRoZXIgYXMgYSBtYXAgb3IgYW4gYXJyYXlcbiAgICovXG4gIHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzKFxuICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlczpcbiAgICAgIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXBcbiAgICAgIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8YW55PltdXG4gICk6IHZvaWQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcykpIHtcbiAgICAgIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcy5mb3JFYWNoKHNlcnZpY2UgPT5cbiAgICAgICAgdGhpcy5yZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKHNlcnZpY2UpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgfHwge30pLmZvckVhY2goc2VydmljZU5hbWUgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2UoXG4gICAgICAgICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW3NlcnZpY2VOYW1lXSxcbiAgICAgICAgICBzZXJ2aWNlTmFtZVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=