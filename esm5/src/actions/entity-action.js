/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Action concerning an entity collection.
 * @record
 * @template P
 */
export function EntityAction() { }
if (false) {
    /** @type {?} */
    EntityAction.prototype.type;
    /** @type {?} */
    EntityAction.prototype.payload;
}
/**
 * Options of an EntityAction
 * @record
 */
export function EntityActionOptions() { }
if (false) {
    /**
     * Correlate related EntityActions, particularly related saves. Must be serializable.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.correlationId;
    /**
     * True if should perform action optimistically (before server responds)
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.isOptimistic;
    /** @type {?|undefined} */
    EntityActionOptions.prototype.mergeStrategy;
    /**
     * The tag to use in the action's type. The entityName if no tag specified.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.tag;
    /**
     * The action was determined (usually by a reducer) to be in error.
     * Downstream effects should not process but rather treat it as an error.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.error;
    /**
     * Downstream effects should skip processing this action but should return
     * an innocuous Observable<Action> of success.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.skip;
}
/**
 * Payload of an EntityAction
 * @record
 * @template P
 */
export function EntityActionPayload() { }
if (false) {
    /** @type {?} */
    EntityActionPayload.prototype.entityName;
    /** @type {?} */
    EntityActionPayload.prototype.entityOp;
    /** @type {?|undefined} */
    EntityActionPayload.prototype.data;
}
//# sourceMappingURL=entity-action.js.map