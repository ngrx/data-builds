/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action-operators.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { filter } from 'rxjs/operators';
import { flattenArgs } from '../utils/utilities';
/**
 * @template T
 * @param {...?} allowedEntityOps
 * @return {?}
 */
export function ofEntityOp() {
    var allowedEntityOps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedEntityOps[_i] = arguments[_i];
    }
    /** @type {?} */
    var ops = flattenArgs(allowedEntityOps);
    switch (ops.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && action.payload.entityOp != null;
            }));
        case 1:
            /** @type {?} */
            var op_1 = ops[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && op_1 === action.payload.entityOp;
            }));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                /** @type {?} */
                var entityOp = action.payload && action.payload.entityOp;
                return entityOp && ops.some((/**
                 * @param {?} o
                 * @return {?}
                 */
                function (o) { return o === entityOp; }));
            }));
    }
}
/**
 * @template T
 * @param {...?} allowedEntityNames
 * @return {?}
 */
export function ofEntityType() {
    var allowedEntityNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedEntityNames[_i] = arguments[_i];
    }
    /** @type {?} */
    var names = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && action.payload.entityName != null;
            }));
        case 1:
            /** @type {?} */
            var name_1 = names[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && name_1 === action.payload.entityName;
            }));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                /** @type {?} */
                var entityName = action.payload && action.payload.entityName;
                return !!entityName && names.some((/**
                 * @param {?} n
                 * @return {?}
                 */
                function (n) { return n === entityName; }));
            }));
    }
}
//# sourceMappingURL=entity-action-operators.js.map