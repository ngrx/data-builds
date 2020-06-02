/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-services.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable:member-ordering
/**
 * Class-Interface for EntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 * @abstract
 */
var 
// tslint:disable:member-ordering
/**
 * Class-Interface for EntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 * @abstract
 */
EntityServices = /** @class */ (function () {
    function EntityServices() {
    }
    return EntityServices;
}());
// tslint:disable:member-ordering
/**
 * Class-Interface for EntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 * @abstract
 */
export { EntityServices };
if (false) {
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @type {?}
     */
    EntityServices.prototype.entityActionErrors$;
    /**
     * Observable of the entire entity cache
     * @type {?}
     */
    EntityServices.prototype.entityCache$;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent Action (not just EntityAction) reduced by the store.
     * @type {?}
     */
    EntityServices.prototype.reducedActions$;
    /**
     * Dispatch any action to the store
     * @abstract
     * @param {?} action
     * @return {?}
     */
    EntityServices.prototype.dispatch = function (action) { };
    /**
     * Get (or create) the singleton instance of an EntityCollectionService
     * @abstract
     * @template T
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    EntityServices.prototype.getEntityCollectionService = function (entityName) { };
    /**
     * Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @abstract
     * @template T
     * @param {?} service {EntityCollectionService} The entity service
     * @return {?}
     */
    EntityServices.prototype.registerEntityCollectionService = function (service) { };
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @abstract
     * @param {?} entityCollectionServices Array of EntityCollectionServices to register
     * @return {?}
     */
    EntityServices.prototype.registerEntityCollectionServices = function (entityCollectionServices) { };
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @abstract
     * @param {?} entityCollectionServiceMap Map of service-name to entity-collection-service
     * @return {?}
     */
    EntityServices.prototype.registerEntityCollectionServices = function (entityCollectionServiceMap) { };
}
/**
 * A map of service or entity names to their corresponding EntityCollectionServices.
 * @record
 */
export function EntityCollectionServiceMap() { }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7OztJQUFBO0lBa0RBLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFsREQsSUFrREM7Ozs7Ozs7Ozs7Ozs7Ozs7SUE3Q0MsNkNBQWdFOzs7OztJQUdoRSxzQ0FBNkU7Ozs7OztJQWE3RSx5Q0FBc0Q7Ozs7Ozs7SUFuQnRELDBEQUF3Qzs7Ozs7Ozs7SUFXeEMsZ0ZBRThCOzs7Ozs7Ozs7SUFjOUIsa0ZBRVE7Ozs7Ozs7O0lBTVIsb0dBRVE7Ozs7Ozs7O0lBTVIsc0dBR1E7Ozs7OztBQU9WLGdEQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nXG5cbi8qKlxuICogQ2xhc3MtSW50ZXJmYWNlIGZvciBFbnRpdHlDYWNoZSBhbmQgRW50aXR5Q29sbGVjdGlvbiBzZXJ2aWNlcy5cbiAqIFNlcnZlcyBhcyBhbiBBbmd1bGFyIHByb3ZpZGVyIHRva2VuIGZvciB0aGlzIHNlcnZpY2UgY2xhc3MuXG4gKiBJbmNsdWRlcyBhIHJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyBmb3IgYWxsIGVudGl0eSB0eXBlcy5cbiAqIENyZWF0ZXMgYSBuZXcgZGVmYXVsdCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgYW55IGVudGl0eSB0eXBlIG5vdCBpbiB0aGUgcmVnaXN0cnkuXG4gKiBPcHRpb25hbGx5IHJlZ2lzdGVyIHNwZWNpYWxpemVkIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyBmb3IgaW5kaXZpZHVhbCB0eXBlc1xuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5U2VydmljZXMge1xuICAvKiogRGlzcGF0Y2ggYW55IGFjdGlvbiB0byB0aGUgc3RvcmUgKi9cbiAgYWJzdHJhY3QgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiB2b2lkO1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICBhYnN0cmFjdCByZWFkb25seSBlbnRpdHlBY3Rpb25FcnJvcnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUgKi9cbiAgYWJzdHJhY3QgcmVhZG9ubHkgZW50aXR5Q2FjaGUkOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPiB8IFN0b3JlPEVudGl0eUNhY2hlPjtcblxuICAvKiogR2V0IChvciBjcmVhdGUpIHRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHNlcnZpY2VcbiAgICovXG4gIGFic3RyYWN0IGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQgPSBhbnk+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPjtcblxuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBBY3Rpb24gKG5vdCBqdXN0IEVudGl0eUFjdGlvbikgcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICBhYnN0cmFjdCByZWFkb25seSByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPjtcblxuICAvLyAjcmVnaW9uIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGNyZWF0aW9uIGFuZCByZWdpc3RyYXRpb24gQVBJXG5cbiAgLyoqIFJlZ2lzdGVyIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIHVuZGVyIGl0cyBlbnRpdHkgdHlwZSBuYW1lLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gc2VydmljZSB7RW50aXR5Q29sbGVjdGlvblNlcnZpY2V9IFRoZSBlbnRpdHkgc2VydmljZVxuICAgKi9cbiAgYWJzdHJhY3QgcmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPihcbiAgICBzZXJ2aWNlOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPlxuICApOiB2b2lkO1xuXG4gIC8qKiBSZWdpc3RlciBlbnRpdHkgc2VydmljZXMgZm9yIHNldmVyYWwgZW50aXR5IHR5cGVzIGF0IG9uY2UuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgQXJyYXkgb2YgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIHRvIHJlZ2lzdGVyXG4gICAqL1xuICBhYnN0cmFjdCByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyhcbiAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXVxuICApOiB2b2lkO1xuXG4gIC8qKiBSZWdpc3RlciBlbnRpdHkgc2VydmljZXMgZm9yIHNldmVyYWwgZW50aXR5IHR5cGVzIGF0IG9uY2UuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCBNYXAgb2Ygc2VydmljZS1uYW1lIHRvIGVudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2VcbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzKFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp1bmlmaWVkLXNpZ25hdHVyZXNcbiAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcDogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXBcbiAgKTogdm9pZDtcbiAgLy8gI2VuZHJlZ2lvbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBjcmVhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIEFQSVxufVxuXG4vKipcbiAqIEEgbWFwIG9mIHNlcnZpY2Ugb3IgZW50aXR5IG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT47XG59XG4iXX0=