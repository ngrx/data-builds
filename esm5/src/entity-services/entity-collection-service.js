/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-collection-service.ts
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
//# sourceMappingURL=entity-collection-service.js.map