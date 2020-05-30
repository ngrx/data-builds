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
export function ofEntityOp(...allowedEntityOps) {
    /** @type {?} */
    const ops = flattenArgs(allowedEntityOps);
    switch (ops.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && action.payload.entityOp != null));
        case 1:
            /** @type {?} */
            const op = ops[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && op === action.payload.entityOp));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => {
                /** @type {?} */
                const entityOp = action.payload && action.payload.entityOp;
                return entityOp && ops.some((/**
                 * @param {?} o
                 * @return {?}
                 */
                o => o === entityOp));
            }));
    }
}
/**
 * @template T
 * @param {...?} allowedEntityNames
 * @return {?}
 */
export function ofEntityType(...allowedEntityNames) {
    /** @type {?} */
    const names = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && action.payload.entityName != null));
        case 1:
            /** @type {?} */
            const name = names[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && name === action.payload.entityName));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => {
                /** @type {?} */
                const entityName = action.payload && action.payload.entityName;
                return !!entityName && names.some((/**
                 * @param {?} n
                 * @return {?}
                 */
                n => n === entityName));
            }));
    }
}
//# sourceMappingURL=entity-action-operators.js.map