/**
 * @fileoverview added by tsickle
 * Generated from: src/dispatchers/entity-dispatcher-default-options.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
export class EntityDispatcherDefaultOptions {
    constructor() {
        /**
         * True if added entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticAdd = false;
        /**
         * True if deleted entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticDelete = true;
        /**
         * True if updated entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticUpdate = false;
        /**
         * True if upsert entities are saved optimistically; false if saved pessimistically.
         */
        this.optimisticUpsert = false;
        /**
         * True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically.
         */
        this.optimisticSaveEntities = false;
    }
}
EntityDispatcherDefaultOptions.decorators = [
    { type: Injectable },
];
if (false) {
    /**
     * True if added entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticAdd;
    /**
     * True if deleted entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticDelete;
    /**
     * True if updated entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticUpdate;
    /**
     * True if upsert entities are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticUpsert;
    /**
     * True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically.
     * @type {?}
     */
    EntityDispatcherDefaultOptions.prototype.optimisticSaveEntities;
}
//# sourceMappingURL=entity-dispatcher-default-options.js.map