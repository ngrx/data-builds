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
//# sourceMappingURL=entity-dispatcher.js.map