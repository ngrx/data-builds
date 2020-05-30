/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class EntityActionFactory {
    // polymorphic create for the two signatures
    /**
     * @template P
     * @param {?} nameOrPayload
     * @param {?=} entityOp
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    create(nameOrPayload, entityOp, data, options) {
        /** @type {?} */
        const payload = typeof nameOrPayload === 'string'
            ? ((/** @type {?} */ (Object.assign(Object.assign({}, (options || {})), { entityName: nameOrPayload, entityOp,
                data }))))
            : nameOrPayload;
        return this.createCore(payload);
    }
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @protected
     * @template P
     * @param {?} payload Defines the EntityAction and its options
     * @return {?}
     */
    createCore(payload) {
        const { entityName, entityOp, tag } = payload;
        if (!entityName) {
            throw new Error('Missing entity name for new action');
        }
        if (entityOp == null) {
            throw new Error('Missing EntityOp for new action');
        }
        /** @type {?} */
        const type = this.formatActionType(entityOp, tag || entityName);
        return { type, payload };
    }
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @template P
     * @param {?} from Source action that is the base for the new action
     * @param {?} newProperties New EntityAction properties that replace the source action properties
     * @return {?}
     */
    createFromAction(from, newProperties) {
        return this.create(Object.assign(Object.assign({}, from.payload), newProperties));
    }
    /**
     * @param {?} op
     * @param {?} tag
     * @return {?}
     */
    formatActionType(op, tag) {
        return `[${tag}] ${op}`;
        // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
    }
}
EntityActionFactory.decorators = [
    { type: Injectable },
];
//# sourceMappingURL=entity-action-factory.js.map