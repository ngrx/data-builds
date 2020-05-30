/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/default-logger.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class DefaultLogger {
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    error(message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    }
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    log(message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    }
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    warn(message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    }
}
DefaultLogger.decorators = [
    { type: Injectable },
];
//# sourceMappingURL=default-logger.js.map