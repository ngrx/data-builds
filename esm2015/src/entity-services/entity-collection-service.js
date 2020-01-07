/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-services/entity-collection-service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * A facade for managing
 * a cached collection of T entities in the ngrx store.
 * @record
 * @template T
 */
export function EntityCollectionService() { }
if (false) {
    /**
     * Dispatcher of EntityCommands (EntityActions)
     * @type {?}
     */
    EntityCollectionService.prototype.dispatcher;
    /**
     * Name of the entity type for this collection service
     * @type {?}
     */
    EntityCollectionService.prototype.entityName;
    /**
     * All selector functions of the entity collection
     * @type {?}
     */
    EntityCollectionService.prototype.selectors;
    /**
     * All selectors$ (observables of the selectors of entity collection properties)
     * @type {?}
     */
    EntityCollectionService.prototype.selectors$;
    /**
     * Create an {EntityAction} for this entity type.
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} payload
     * @param {?=} options
     * @return {?} the EntityAction
     */
    EntityCollectionService.prototype.createEntityAction = function (op, payload, options) { };
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the dispatched EntityAction
     */
    EntityCollectionService.prototype.createAndDispatch = function (op, data, options) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFhQSw2Q0F5Q0M7Ozs7OztJQVZDLDZDQUF5Qzs7Ozs7SUFHekMsNkNBQTRCOzs7OztJQUc1Qiw0Q0FBdUM7Ozs7O0lBR3ZDLDZDQUF5Qzs7Ozs7Ozs7SUE5QnpDLDJGQUltQjs7Ozs7Ozs7OztJQVVuQix1RkFJbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29tbWFuZHMgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktY29tbWFuZHMnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZ1xuXG4vKipcbiAqIEEgZmFjYWRlIGZvciBtYW5hZ2luZ1xuICogYSBjYWNoZWQgY29sbGVjdGlvbiBvZiBUIGVudGl0aWVzIGluIHRoZSBuZ3J4IHN0b3JlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+XG4gIGV4dGVuZHMgRW50aXR5Q29tbWFuZHM8VD4sXG4gICAgRW50aXR5U2VsZWN0b3JzJDxUPiB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUVudGl0eUFjdGlvbihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgcGF5bG9hZD86IGFueSxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248VD47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD47XG5cbiAgLyoqIERpc3BhdGNoZXIgb2YgRW50aXR5Q29tbWFuZHMgKEVudGl0eUFjdGlvbnMpICovXG4gIHJlYWRvbmx5IGRpc3BhdGNoZXI6IEVudGl0eURpc3BhdGNoZXI8VD47XG5cbiAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGNvbGxlY3Rpb24gc2VydmljZSAqL1xuICByZWFkb25seSBlbnRpdHlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqIEFsbCBzZWxlY3RvciBmdW5jdGlvbnMgb2YgdGhlIGVudGl0eSBjb2xsZWN0aW9uICovXG4gIHJlYWRvbmx5IHNlbGVjdG9yczogRW50aXR5U2VsZWN0b3JzPFQ+O1xuXG4gIC8qKiBBbGwgc2VsZWN0b3JzJCAob2JzZXJ2YWJsZXMgb2YgdGhlIHNlbGVjdG9ycyBvZiBlbnRpdHkgY29sbGVjdGlvbiBwcm9wZXJ0aWVzKSAqL1xuICByZWFkb25seSBzZWxlY3RvcnMkOiBFbnRpdHlTZWxlY3RvcnMkPFQ+O1xufVxuIl19