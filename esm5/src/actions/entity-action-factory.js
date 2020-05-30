var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var EntityActionFactory = /** @class */ (function () {
    function EntityActionFactory() {
    }
    // polymorphic create for the two signatures
    // polymorphic create for the two signatures
    /**
     * @template P
     * @param {?} nameOrPayload
     * @param {?=} entityOp
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    EntityActionFactory.prototype.create = 
    // polymorphic create for the two signatures
    /**
     * @template P
     * @param {?} nameOrPayload
     * @param {?=} entityOp
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    function (nameOrPayload, entityOp, data, options) {
        /** @type {?} */
        var payload = typeof nameOrPayload === 'string'
            ? ((/** @type {?} */ (__assign(__assign({}, (options || {})), { entityName: nameOrPayload, entityOp: entityOp,
                data: data }))))
            : nameOrPayload;
        return this.createCore(payload);
    };
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the EntityAction and its options
     */
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @protected
     * @template P
     * @param {?} payload Defines the EntityAction and its options
     * @return {?}
     */
    EntityActionFactory.prototype.createCore = /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @protected
     * @template P
     * @param {?} payload Defines the EntityAction and its options
     * @return {?}
     */
    function (payload) {
        var entityName = payload.entityName, entityOp = payload.entityOp, tag = payload.tag;
        if (!entityName) {
            throw new Error('Missing entity name for new action');
        }
        if (entityOp == null) {
            throw new Error('Missing EntityOp for new action');
        }
        /** @type {?} */
        var type = this.formatActionType(entityOp, tag || entityName);
        return { type: type, payload: payload };
    };
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @param from Source action that is the base for the new action
     * @param newProperties New EntityAction properties that replace the source action properties
     */
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @template P
     * @param {?} from Source action that is the base for the new action
     * @param {?} newProperties New EntityAction properties that replace the source action properties
     * @return {?}
     */
    EntityActionFactory.prototype.createFromAction = /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @template P
     * @param {?} from Source action that is the base for the new action
     * @param {?} newProperties New EntityAction properties that replace the source action properties
     * @return {?}
     */
    function (from, newProperties) {
        return this.create(__assign(__assign({}, from.payload), newProperties));
    };
    /**
     * @param {?} op
     * @param {?} tag
     * @return {?}
     */
    EntityActionFactory.prototype.formatActionType = /**
     * @param {?} op
     * @param {?} tag
     * @return {?}
     */
    function (op, tag) {
        return "[" + tag + "] " + op;
        // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
    };
    EntityActionFactory.decorators = [
        { type: Injectable },
    ];
    return EntityActionFactory;
}());
export { EntityActionFactory };
//# sourceMappingURL=entity-action-factory.js.map