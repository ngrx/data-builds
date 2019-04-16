/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    // Dear ngrx-data developer: think hard before changing the constructor.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFVLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWdCbkQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QnBFLE1BQU0sT0FBTyxrQkFBa0I7Ozs7Ozs7Ozs7O0lBUTdCLFlBQW9CLHNCQUE4QztRQUE5QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCOzs7O1FBd0NqRCw2QkFBd0IsR0FBK0IsRUFBRSxDQUFDO0lBeENOLENBQUM7Ozs7OztJQUt0RSxJQUFJLG1CQUFtQjtRQUNyQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQztJQUN6RCxDQUFDOzs7OztJQUdELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztJQUNsRCxDQUFDOzs7OztJQUdELElBQUksOEJBQThCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLDhCQUE4QixDQUFDO0lBQ3BFLENBQUM7Ozs7OztJQU1ELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUM7SUFDckQsQ0FBQzs7Ozs7O0lBR0QsSUFBYyxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDOzs7Ozs7O0lBS0QsUUFBUSxDQUFDLE1BQWM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQzs7Ozs7Ozs7OztJQVdTLDZCQUE2QixDQUdyQyxVQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQVEsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQzs7Ozs7OztJQUtELDBCQUEwQixDQUd4QixVQUFrQjs7WUFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQztRQUN2RCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBUSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7Ozs7O0lBT0QsK0JBQStCLENBQzdCLE9BQW1DLEVBQ25DLFdBQW9CO1FBRXBCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3RSxDQUFDOzs7Ozs7OztJQVFELGdDQUFnQyxDQUM5Qix3QkFFa0M7UUFFbEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDM0Msd0JBQXdCLENBQUMsT0FBTzs7OztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQ3pDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxPQUFPLENBQUMsRUFDOUMsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU87Ozs7WUFBQyxXQUFXLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxDQUFDLCtCQUErQixDQUNsQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsRUFDckMsV0FBVyxDQUNaLENBQUM7WUFDSixDQUFDLEVBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7O1lBbEhGLFVBQVU7Ozs7WUF4QkYsc0JBQXNCOzs7Ozs7OztJQXlFN0Isc0RBQTJFOzs7OztJQXhDL0Qsb0RBQXNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2UgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtYmFzZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCwgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5IH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHtcbiAgRW50aXR5U2VsZWN0b3JzJCxcbiAgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnksXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMtZWxlbWVudHMnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptZW1iZXItb3JkZXJpbmdcblxuLyoqXG4gKiBCYXNlL2RlZmF1bHQgY2xhc3Mgb2YgYSBjZW50cmFsIHJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyBmb3IgYWxsIGVudGl0eSB0eXBlcy5cbiAqIENyZWF0ZSB5b3VyIG93biBzdWJjbGFzcyB0byBhZGQgYXBwLXNwZWNpZmljIG1lbWJlcnMgZm9yIGFuIGltcHJvdmVkIGRldmVsb3BlciBleHBlcmllbmNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBleHBvcnQgY2xhc3MgRW50aXR5U2VydmljZXMgZXh0ZW5kcyBFbnRpdHlTZXJ2aWNlc0Jhc2Uge1xuICogICBjb25zdHJ1Y3RvcihlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzOiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKSB7XG4gKiAgICAgc3VwZXIoZW50aXR5U2VydmljZXNFbGVtZW50cyk7XG4gKiAgIH1cbiAqICAgLy8gRXh0ZW5kIHdpdGggd2VsbC1rbm93biwgYXBwIGVudGl0eSBjb2xsZWN0aW9uIHNlcnZpY2VzXG4gKiAgIC8vIENvbnZlbmllbmNlIHByb3BlcnR5IHRvIHJldHVybiBhIHR5cGVkIGN1c3RvbSBlbnRpdHkgY29sbGVjdGlvbiBzZXJ2aWNlXG4gKiAgIGdldCBjb21wYW55U2VydmljZSgpIHtcbiAqICAgICByZXR1cm4gdGhpcy5nZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxNb2RlbC5Db21wYW55PignQ29tcGFueScpIGFzIENvbXBhbnlTZXJ2aWNlO1xuICogICB9XG4gKiAgIC8vIENvbnZlbmllbmNlIGRpc3BhdGNoIG1ldGhvZHNcbiAqICAgY2xlYXJDb21wYW55KGNvbXBhbnlJZDogc3RyaW5nKSB7XG4gKiAgICAgdGhpcy5kaXNwYXRjaChuZXcgQ2xlYXJDb21wYW55QWN0aW9uKGNvbXBhbnlJZCkpO1xuICogICB9XG4gKiB9XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlc0Jhc2UgaW1wbGVtZW50cyBFbnRpdHlTZXJ2aWNlcyB7XG4gIC8vIERlYXIgbmdyeC1kYXRhIGRldmVsb3BlcjogdGhpbmsgaGFyZCBiZWZvcmUgY2hhbmdpbmcgdGhlIGNvbnN0cnVjdG9yLlxuICAvLyBEb2luZyBzbyB3aWxsIGJyZWFrIGFwcHMgdGhhdCBkZXJpdmUgZnJvbSB0aGlzIGJhc2UgY2xhc3MsXG4gIC8vIGFuZCBtYW55IGFwcHMgd2lsbCBkZXJpdmUgZnJvbSB0aGlzIGNsYXNzLlxuICAvL1xuICAvLyBEbyBub3QgZ2l2ZSB0aGlzIGNvbnN0cnVjdG9yIGFuIGltcGxlbWVudGF0aW9uLlxuICAvLyBEb2luZyBzbyBtYWtlcyBpdCBoYXJkIHRvIG1vY2sgY2xhc3NlcyB0aGF0IGRlcml2ZSBmcm9tIHRoaXMgY2xhc3MuXG4gIC8vIFVzZSBnZXR0ZXIgcHJvcGVydGllcyBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgc2VlIGVudGl0eUNhY2hlJFxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVudGl0eVNlcnZpY2VzRWxlbWVudHM6IEVudGl0eVNlcnZpY2VzRWxlbWVudHMpIHt9XG5cbiAgLy8gI3JlZ2lvbiBFbnRpdHlTZXJ2aWNlc0VsZW1lbnQtYmFzZWQgcHJvcGVydGllc1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICBnZXQgZW50aXR5QWN0aW9uRXJyb3JzJCgpOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5QWN0aW9uRXJyb3JzJDtcbiAgfVxuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpcmUgZW50aXR5IGNhY2hlICovXG4gIGdldCBlbnRpdHlDYWNoZSQoKTogT2JzZXJ2YWJsZTxFbnRpdHlDYWNoZT4gfCBTdG9yZTxFbnRpdHlDYWNoZT4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuZW50aXR5Q2FjaGUkO1xuICB9XG5cbiAgLyoqIEZhY3RvcnkgdG8gY3JlYXRlIGEgZGVmYXVsdCBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSAqL1xuICBnZXQgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5KCk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnk7XG4gIH1cblxuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICBnZXQgcmVkdWNlZEFjdGlvbnMkKCk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5yZWR1Y2VkQWN0aW9ucyQ7XG4gIH1cblxuICAvKiogVGhlIG5ncnggc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgcHJvdGVjdGVkIGdldCBzdG9yZSgpOiBTdG9yZTxFbnRpdHlDYWNoZT4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVNlcnZpY2VzRWxlbWVudHMuc3RvcmU7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uIEVudGl0eVNlcnZpY2VzRWxlbWVudC1iYXNlZCBwcm9wZXJ0aWVzXG5cbiAgLyoqIERpc3BhdGNoIGFueSBhY3Rpb24gdG8gdGhlIHN0b3JlICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICB9XG5cbiAgLyoqIFJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGluc3RhbmNlcyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlczogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAgPSB7fTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGRlZmF1bHQgaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UuXG4gICAqIFByZWZlciBnZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZSgpIHVubGVzcyB5b3UgcmVhbGx5IHdhbnQgYSBuZXcgZGVmYXVsdCBpbnN0YW5jZS5cbiAgICogVGhpcyBvbmUgd2lsbCBOT1QgYmUgcmVnaXN0ZXJlZCB3aXRoIEVudGl0eVNlcnZpY2VzIVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBvZiB0aGUgc2VydmljZVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFxuICAgIFQsXG4gICAgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkuY3JlYXRlPFQsIFMkPihlbnRpdHlOYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXQgKG9yIGNyZWF0ZSkgdGhlIHNpbmdsZXRvbiBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBvZiB0aGUgc2VydmljZVxuICAgKi9cbiAgZ2V0RW50aXR5Q29sbGVjdGlvblNlcnZpY2U8XG4gICAgVCxcbiAgICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIGxldCBzZXJ2aWNlID0gdGhpcy5FbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFzZXJ2aWNlKSB7XG4gICAgICBzZXJ2aWNlID0gdGhpcy5jcmVhdGVFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxULCBTJD4oZW50aXR5TmFtZSk7XG4gICAgICB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tlbnRpdHlOYW1lXSA9IHNlcnZpY2U7XG4gICAgfVxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVyIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIHVuZGVyIGl0cyBlbnRpdHkgdHlwZSBuYW1lLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gc2VydmljZSB7RW50aXR5Q29sbGVjdGlvblNlcnZpY2V9IFRoZSBlbnRpdHkgc2VydmljZVxuICAgKiBAcGFyYW0gc2VydmljZU5hbWUge3N0cmluZ30gb3B0aW9uYWwgc2VydmljZSBuYW1lIHRvIHVzZSBpbnN0ZWFkIG9mIHRoZSBzZXJ2aWNlJ3MgZW50aXR5TmFtZVxuICAgKi9cbiAgcmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPihcbiAgICBzZXJ2aWNlOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPixcbiAgICBzZXJ2aWNlTmFtZT86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tzZXJ2aWNlTmFtZSB8fCBzZXJ2aWNlLmVudGl0eU5hbWVdID0gc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBlbnRpdHkgc2VydmljZXMgZm9yIHNldmVyYWwgZW50aXR5IHR5cGVzIGF0IG9uY2UuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMge0VudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwIHwgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8YW55PltdfVxuICAgKiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgdG8gcmVnaXN0ZXIsIGVpdGhlciBhcyBhIG1hcCBvciBhbiBhcnJheVxuICAgKi9cbiAgcmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMoXG4gICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzOlxuICAgICAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcFxuICAgICAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+W11cbiAgKTogdm9pZCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzKSkge1xuICAgICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzLmZvckVhY2goc2VydmljZSA9PlxuICAgICAgICB0aGlzLnJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2Uoc2VydmljZSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB8fCB7fSkuZm9yRWFjaChzZXJ2aWNlTmFtZSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZShcbiAgICAgICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWVdLFxuICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==