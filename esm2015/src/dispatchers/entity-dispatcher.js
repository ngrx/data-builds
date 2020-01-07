/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dispatchers/entity-dispatcher.ts
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
export class PersistanceCanceled {
    /**
     * @param {?=} message
     */
    constructor(message) {
        this.message = message;
        this.message = message || 'Canceled by user';
    }
}
if (false) {
    /** @type {?} */
    PersistanceCanceled.prototype.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBYUEsc0NBc0RDOzs7Ozs7SUFwREMsc0NBQTRCOzs7OztJQUs1QixpQ0FBcUM7Ozs7O0lBR3JDLG9DQUFpQzs7Ozs7SUFHakMsaUNBQW1DOzs7Ozs7Ozs7SUFTbkMsaUZBSW1COzs7Ozs7Ozs7O0lBVW5CLGdGQUltQjs7Ozs7O0lBT25CLDREQUFpQzs7Ozs7OztJQU1qQyw0REFBd0M7Ozs7O0FBTTFDLE1BQU0sT0FBTyxtQkFBbUI7Ozs7SUFDOUIsWUFBNEIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7OztJQUhhLHNDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24sIEVudGl0eUFjdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uR3VhcmQgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZ3VhcmQnO1xuaW1wb3J0IHsgRW50aXR5Q29tbWFuZHMgfSBmcm9tICcuL2VudGl0eS1jb21tYW5kcyc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcblxuLyoqXG4gKiBEaXNwYXRjaGVzIEVudGl0eUNvbGxlY3Rpb24gYWN0aW9ucyB0byB0aGVpciByZWR1Y2VycyBhbmQgZWZmZWN0cy5cbiAqIFRoZSBzdWJzdGFuY2Ugb2YgdGhlIGludGVyZmFjZSBpcyBpbiBFbnRpdHlDb21tYW5kcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEaXNwYXRjaGVyPFQ+IGV4dGVuZHMgRW50aXR5Q29tbWFuZHM8VD4ge1xuICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgKi9cbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVdGlsaXR5IGNsYXNzIHdpdGggbWV0aG9kcyB0byB2YWxpZGF0ZSBFbnRpdHlBY3Rpb24gcGF5bG9hZHMuXG4gICAqL1xuICByZWFkb25seSBndWFyZDogRW50aXR5QWN0aW9uR3VhcmQ8VD47XG5cbiAgLyoqIFJldHVybnMgdGhlIHByaW1hcnkga2V5IChpZCkgb2YgdGhpcyBlbnRpdHkgKi9cbiAgcmVhZG9ubHkgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG5cbiAgLyoqIFJldHVybnMgdGhlIHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gIHJlYWRvbmx5IHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIG9wIHtFbnRpdHlPcH0gdGhlIGVudGl0eSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtkYXRhXSB0aGUgYWN0aW9uIGRhdGFcbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICogQHJldHVybnMgdGhlIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlRW50aXR5QWN0aW9uPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB7RW50aXR5QWN0aW9ufSBmb3IgdGhpcyBlbnRpdHkgdHlwZSBhbmRcbiAgICogZGlzcGF0Y2ggaXQgaW1tZWRpYXRlbHkgdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBFbnRpdHlBY3Rpb25cbiAgICovXG4gIGNyZWF0ZUFuZERpc3BhdGNoPFAgPSBhbnk+KFxuICAgIG9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD47XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIEFjdGlvbiB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBhY3Rpb24gdGhlIEFjdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGlzcGF0Y2hlZCBBY3Rpb25cbiAgICovXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKTogQWN0aW9uO1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gIG9iamVjdFxuICAgKiBgdXBkYXRlLi4uYCBhbmQgYHVwc2VydC4uLmAgbWV0aG9kcyB0YWtlIGBVcGRhdGU8VD5gIGFyZ3NcbiAgICovXG4gIHRvVXBkYXRlKGVudGl0eTogUGFydGlhbDxUPik6IFVwZGF0ZTxUPjtcbn1cblxuLyoqXG4gKiBQZXJzaXN0ZW5jZSBvcGVyYXRpb24gY2FuY2VsZWRcbiAqL1xuZXhwb3J0IGNsYXNzIFBlcnNpc3RhbmNlQ2FuY2VsZWQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZT86IHN0cmluZykge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ0NhbmNlbGVkIGJ5IHVzZXInO1xuICB9XG59XG4iXX0=