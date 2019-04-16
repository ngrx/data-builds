/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
export class EntityServices {
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFpQkEsTUFBTSxPQUFnQixjQUFjO0NBa0RuQzs7Ozs7O0lBN0NDLDZDQUFnRTs7Ozs7SUFHaEUsc0NBQTZFOzs7Ozs7SUFhN0UseUNBQXNEOzs7Ozs7O0lBbkJ0RCwwREFBd0M7Ozs7Ozs7O0lBV3hDLGdGQUU4Qjs7Ozs7Ozs7O0lBYzlCLGtGQUVROzs7Ozs7OztJQU1SLG9HQUVROzs7Ozs7OztJQU1SLHNHQUdROzs7Ozs7QUFPVixnREFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZ1xuXG4vKipcbiAqIENsYXNzLUludGVyZmFjZSBmb3IgRW50aXR5Q2FjaGUgYW5kIEVudGl0eUNvbGxlY3Rpb24gc2VydmljZXMuXG4gKiBTZXJ2ZXMgYXMgYW4gQW5ndWxhciBwcm92aWRlciB0b2tlbiBmb3IgdGhpcyBzZXJ2aWNlIGNsYXNzLlxuICogSW5jbHVkZXMgYSByZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgZm9yIGFsbCBlbnRpdHkgdHlwZXMuXG4gKiBDcmVhdGVzIGEgbmV3IGRlZmF1bHQgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFueSBlbnRpdHkgdHlwZSBub3QgaW4gdGhlIHJlZ2lzdHJ5LlxuICogT3B0aW9uYWxseSByZWdpc3RlciBzcGVjaWFsaXplZCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgZm9yIGluZGl2aWR1YWwgdHlwZXNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudGl0eVNlcnZpY2VzIHtcbiAgLyoqIERpc3BhdGNoIGFueSBhY3Rpb24gdG8gdGhlIHN0b3JlICovXG4gIGFic3RyYWN0IGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogdm9pZDtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBFbnRpdHlBY3Rpb25zIChlLmcuIFFVRVJZX0FMTF9FUlJPUikgZm9yIGFsbCBlbnRpdHkgdHlwZXMgKi9cbiAgYWJzdHJhY3QgcmVhZG9ubHkgZW50aXR5QWN0aW9uRXJyb3JzJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBlbnRpcmUgZW50aXR5IGNhY2hlICovXG4gIGFic3RyYWN0IHJlYWRvbmx5IGVudGl0eUNhY2hlJDogT2JzZXJ2YWJsZTxFbnRpdHlDYWNoZT4gfCBTdG9yZTxFbnRpdHlDYWNoZT47XG5cbiAgLyoqIEdldCAob3IgY3JlYXRlKSB0aGUgc2luZ2xldG9uIGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBhYnN0cmFjdCBnZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUID0gYW55PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD47XG5cbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgQWN0aW9uIChub3QganVzdCBFbnRpdHlBY3Rpb24pIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVhZG9ubHkgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj47XG5cbiAgLy8gI3JlZ2lvbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBjcmVhdGlvbiBhbmQgcmVnaXN0cmF0aW9uIEFQSVxuXG4gIC8qKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB1bmRlciBpdHMgZW50aXR5IHR5cGUgbmFtZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIHNlcnZpY2Uge0VudGl0eUNvbGxlY3Rpb25TZXJ2aWNlfSBUaGUgZW50aXR5IHNlcnZpY2VcbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVyRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4oXG4gICAgc2VydmljZTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD5cbiAgKTogdm9pZDtcblxuICAvKiogUmVnaXN0ZXIgZW50aXR5IHNlcnZpY2VzIGZvciBzZXZlcmFsIGVudGl0eSB0eXBlcyBhdCBvbmNlLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzIEFycmF5IG9mIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB0byByZWdpc3RlclxuICAgKi9cbiAgYWJzdHJhY3QgcmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMoXG4gICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VzOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+W11cbiAgKTogdm9pZDtcblxuICAvKiogUmVnaXN0ZXIgZW50aXR5IHNlcnZpY2VzIGZvciBzZXZlcmFsIGVudGl0eSB0eXBlcyBhdCBvbmNlLlxuICAgKiBXaWxsIHJlcGxhY2UgYSBwcmUtZXhpc3Rpbmcgc2VydmljZSBmb3IgdGhhdCB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAgTWFwIG9mIHNlcnZpY2UtbmFtZSB0byBlbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlXG4gICAqL1xuICBhYnN0cmFjdCByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyhcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dW5pZmllZC1zaWduYXR1cmVzXG4gICAgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXA6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwXG4gICk6IHZvaWQ7XG4gIC8vICNlbmRyZWdpb24gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgY3JlYXRpb24gYW5kIHJlZ2lzdHJhdGlvbiBBUElcbn1cblxuLyoqXG4gKiBBIG1hcCBvZiBzZXJ2aWNlIG9yIGVudGl0eSBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+O1xufVxuIl19