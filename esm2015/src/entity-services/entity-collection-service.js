/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQWFBLDZDQXlDQzs7Ozs7O0lBVkMsNkNBQXlDOzs7OztJQUd6Qyw2Q0FBNEI7Ozs7O0lBRzVCLDRDQUF1Qzs7Ozs7SUFHdkMsNkNBQXlDOzs7Ozs7OztJQTlCekMsMkZBSW1COzs7Ozs7Ozs7O0lBVW5CLHVGQUltQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb21tYW5kcyB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1jb21tYW5kcyc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyIH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nXG5cbi8qKlxuICogQSBmYWNhZGUgZm9yIG1hbmFnaW5nXG4gKiBhIGNhY2hlZCBjb2xsZWN0aW9uIG9mIFQgZW50aXRpZXMgaW4gdGhlIG5ncnggc3RvcmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD5cbiAgZXh0ZW5kcyBFbnRpdHlDb21tYW5kczxUPixcbiAgICBFbnRpdHlTZWxlY3RvcnMkPFQ+IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlRW50aXR5QWN0aW9uKFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBwYXlsb2FkPzogYW55LFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxUPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlIGFuZFxuICAgKiBkaXNwYXRjaCBpdCBpbW1lZGlhdGVseSB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlQW5kRGlzcGF0Y2g8UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPjtcblxuICAvKiogRGlzcGF0Y2hlciBvZiBFbnRpdHlDb21tYW5kcyAoRW50aXR5QWN0aW9ucykgKi9cbiAgcmVhZG9ubHkgZGlzcGF0Y2hlcjogRW50aXR5RGlzcGF0Y2hlcjxUPjtcblxuICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgY29sbGVjdGlvbiBzZXJ2aWNlICovXG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcblxuICAvKiogQWxsIHNlbGVjdG9yIGZ1bmN0aW9ucyBvZiB0aGUgZW50aXR5IGNvbGxlY3Rpb24gKi9cbiAgcmVhZG9ubHkgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD47XG5cbiAgLyoqIEFsbCBzZWxlY3RvcnMkIChvYnNlcnZhYmxlcyBvZiB0aGUgc2VsZWN0b3JzIG9mIGVudGl0eSBjb2xsZWN0aW9uIHByb3BlcnRpZXMpICovXG4gIHJlYWRvbmx5IHNlbGVjdG9ycyQ6IEVudGl0eVNlbGVjdG9ycyQ8VD47XG59XG4iXX0=