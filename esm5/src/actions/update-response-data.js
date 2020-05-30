/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/update-response-data.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Data returned in an EntityAction from the EntityEffects for SAVE_UPDATE_ONE_SUCCESS.
 * Effectively extends Update<T> with a 'changed' flag.
 * The is true if the server sent back changes to the entity data after update.
 * Such changes must be in the entity data in changes property.
 * Default is false (server did not return entity data; assume it changed nothing).
 * See EntityEffects.
 * @record
 * @template T
 */
export function UpdateResponseData() { }
if (false) {
    /**
     * Original key (id) of the entity
     * @type {?}
     */
    UpdateResponseData.prototype.id;
    /**
     * Entity update data. Should include the key (original or changed)
     * @type {?}
     */
    UpdateResponseData.prototype.changes;
    /**
     * Whether the server made additional changes after processing the update.
     * Such additional changes should be in the 'changes' object.
     * Default is false
     * @type {?|undefined}
     */
    UpdateResponseData.prototype.changed;
}
//# sourceMappingURL=update-response-data.js.map