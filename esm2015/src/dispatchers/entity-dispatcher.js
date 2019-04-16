/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFhQSxzQ0FzREM7Ozs7OztJQXBEQyxzQ0FBNEI7Ozs7O0lBSzVCLGlDQUFxQzs7Ozs7SUFHckMsb0NBQWlDOzs7OztJQUdqQyxpQ0FBbUM7Ozs7Ozs7OztJQVNuQyxpRkFJbUI7Ozs7Ozs7Ozs7SUFVbkIsZ0ZBSW1COzs7Ozs7SUFPbkIsNERBQWlDOzs7Ozs7O0lBTWpDLDREQUF3Qzs7Ozs7QUFNMUMsTUFBTSxPQUFPLG1CQUFtQjs7OztJQUM5QixZQUE0QixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLGtCQUFrQixDQUFDO0lBQy9DLENBQUM7Q0FDRjs7O0lBSGEsc0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiwgRW50aXR5QWN0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25HdWFyZCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1ndWFyZCc7XG5pbXBvcnQgeyBFbnRpdHlDb21tYW5kcyB9IGZyb20gJy4vZW50aXR5LWNvbW1hbmRzJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgRW50aXR5Q29sbGVjdGlvbiBhY3Rpb25zIHRvIHRoZWlyIHJlZHVjZXJzIGFuZCBlZmZlY3RzLlxuICogVGhlIHN1YnN0YW5jZSBvZiB0aGUgaW50ZXJmYWNlIGlzIGluIEVudGl0eUNvbW1hbmRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURpc3BhdGNoZXI8VD4gZXh0ZW5kcyBFbnRpdHlDb21tYW5kczxUPiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSAqL1xuICByZWFkb25seSBlbnRpdHlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgY2xhc3Mgd2l0aCBtZXRob2RzIHRvIHZhbGlkYXRlIEVudGl0eUFjdGlvbiBwYXlsb2Fkcy5cbiAgICovXG4gIHJlYWRvbmx5IGd1YXJkOiBFbnRpdHlBY3Rpb25HdWFyZDxUPjtcblxuICAvKiogUmV0dXJucyB0aGUgcHJpbWFyeSBrZXkgKGlkKSBvZiB0aGlzIGVudGl0eSAqL1xuICByZWFkb25seSBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPjtcblxuICAvKiogUmV0dXJucyB0aGUgc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgcmVhZG9ubHkgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gb3Age0VudGl0eU9wfSB0aGUgZW50aXR5IG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW2RhdGFdIHRoZSBhY3Rpb24gZGF0YVxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKiBAcmV0dXJucyB0aGUgRW50aXR5QWN0aW9uXG4gICAqL1xuICBjcmVhdGVFbnRpdHlBY3Rpb248UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHtFbnRpdHlBY3Rpb259IGZvciB0aGlzIGVudGl0eSB0eXBlIGFuZFxuICAgKiBkaXNwYXRjaCBpdCBpbW1lZGlhdGVseSB0byB0aGUgc3RvcmUuXG4gICAqIEBwYXJhbSBvcCB7RW50aXR5T3B9IHRoZSBlbnRpdHkgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbZGF0YV0gdGhlIGFjdGlvbiBkYXRhXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEVudGl0eUFjdGlvblxuICAgKi9cbiAgY3JlYXRlQW5kRGlzcGF0Y2g8UCA9IGFueT4oXG4gICAgb3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPjtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gQWN0aW9uIHRvIHRoZSBzdG9yZS5cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkaXNwYXRjaGVkIEFjdGlvblxuICAgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb247XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmAgb2JqZWN0XG4gICAqIGB1cGRhdGUuLi5gIGFuZCBgdXBzZXJ0Li4uYCBtZXRob2RzIHRha2UgYFVwZGF0ZTxUPmAgYXJnc1xuICAgKi9cbiAgdG9VcGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+KTogVXBkYXRlPFQ+O1xufVxuXG4vKipcbiAqIFBlcnNpc3RlbmNlIG9wZXJhdGlvbiBjYW5jZWxlZFxuICovXG5leHBvcnQgY2xhc3MgUGVyc2lzdGFuY2VDYW5jZWxlZCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnQ2FuY2VsZWQgYnkgdXNlcic7XG4gIH1cbn1cbiJdfQ==