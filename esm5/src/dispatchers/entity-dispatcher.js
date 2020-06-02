/**
 * @fileoverview added by tsickle
 * Generated from: src/dispatchers/entity-dispatcher.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Dispatches EntityCollection actions to their reducers and effects.
 * The substance of the interface is in EntityCommands.
 * @record
 * @template T
 */
export function EntityDispatcher() { }
if (false) {
    /**
     * Name of the entity type
     * @type {?}
     */
    EntityDispatcher.prototype.entityName;
    /**
     * Utility class with methods to validate EntityAction payloads.
     * @type {?}
     */
    EntityDispatcher.prototype.guard;
    /**
     * Returns the primary key (id) of this entity
     * @type {?}
     */
    EntityDispatcher.prototype.selectId;
    /**
     * Returns the store, scoped to the EntityCache
     * @type {?}
     */
    EntityDispatcher.prototype.store;
    /**
     * Create an {EntityAction} for this entity type.
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the EntityAction
     */
    EntityDispatcher.prototype.createEntityAction = function (op, data, options) { };
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @template P
     * @param {?} op {EntityOp} the entity operation
     * @param {?=} data
     * @param {?=} options
     * @return {?} the dispatched EntityAction
     */
    EntityDispatcher.prototype.createAndDispatch = function (op, data, options) { };
    /**
     * Dispatch an Action to the store.
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    EntityDispatcher.prototype.dispatch = function (action) { };
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `update...` and `upsert...` methods take `Update<T>` args
     * @param {?} entity
     * @return {?}
     */
    EntityDispatcher.prototype.toUpdate = function (entity) { };
}
/**
 * Persistence operation canceled
 */
var /**
 * Persistence operation canceled
 */
PersistanceCanceled = /** @class */ (function () {
    function PersistanceCanceled(message) {
        this.message = message;
        this.message = message || 'Canceled by user';
    }
    return PersistanceCanceled;
}());
/**
 * Persistence operation canceled
 */
export { PersistanceCanceled };
if (false) {
    /** @type {?} */
    PersistanceCanceled.prototype.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBYUEsc0NBc0RDOzs7Ozs7SUFwREMsc0NBQTRCOzs7OztJQUs1QixpQ0FBcUM7Ozs7O0lBR3JDLG9DQUFpQzs7Ozs7SUFHakMsaUNBQW1DOzs7Ozs7Ozs7SUFTbkMsaUZBSW1COzs7Ozs7Ozs7O0lBVW5CLGdGQUltQjs7Ozs7O0lBT25CLDREQUFpQzs7Ozs7OztJQU1qQyw0REFBd0M7Ozs7O0FBTTFDOzs7O0lBQ0UsNkJBQTRCLE9BQWdCO1FBQWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksa0JBQWtCLENBQUM7SUFDL0MsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7Ozs7SUFIYSxzQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uLCBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkd1YXJkIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmltcG9ydCB7IEVudGl0eUNvbW1hbmRzIH0gZnJvbSAnLi9lbnRpdHktY29tbWFuZHMnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBFbnRpdHlDb2xsZWN0aW9uIGFjdGlvbnMgdG8gdGhlaXIgcmVkdWNlcnMgYW5kIGVmZmVjdHMuXG4gKiBUaGUgc3Vic3RhbmNlIG9mIHRoZSBpbnRlcmZhY2UgaXMgaW4gRW50aXR5Q29tbWFuZHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGlzcGF0Y2hlcjxUPiBleHRlbmRzIEVudGl0eUNvbW1hbmRzPFQ+IHtcbiAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlICovXG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVXRpbGl0eSBjbGFzcyB3aXRoIG1ldGhvZHMgdG8gdmFsaWRhdGUgRW50aXR5QWN0aW9uIHBheWxvYWRzLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3VhcmQ6IEVudGl0eUFjdGlvbkd1YXJkPFQ+O1xuXG4gIC8qKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleSAoaWQpIG9mIHRoaXMgZW50aXR5ICovXG4gIHJlYWRvbmx5IHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuXG4gIC8qKiBSZXR1cm5zIHRoZSBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICByZWFkb25seSBzdG9yZTogU3RvcmU8RW50aXR5Q2FjaGU+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUVudGl0eUFjdGlvbjxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4ge0VudGl0eUFjdGlvbn0gZm9yIHRoaXMgZW50aXR5IHR5cGUgYW5kXG4gICAqIGRpc3BhdGNoIGl0IGltbWVkaWF0ZWx5IHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVBbmREaXNwYXRjaDxQID0gYW55PihcbiAgICBvcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBBY3Rpb24gdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gYWN0aW9uIHRoZSBBY3Rpb25cbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgQWN0aW9uXG4gICAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbik6IEFjdGlvbjtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YCBvYmplY3RcbiAgICogYHVwZGF0ZS4uLmAgYW5kIGB1cHNlcnQuLi5gIG1ldGhvZHMgdGFrZSBgVXBkYXRlPFQ+YCBhcmdzXG4gICAqL1xuICB0b1VwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4pOiBVcGRhdGU8VD47XG59XG5cbi8qKlxuICogUGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGNhbmNlbGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBQZXJzaXN0YW5jZUNhbmNlbGVkIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdDYW5jZWxlZCBieSB1c2VyJztcbiAgfVxufVxuIl19