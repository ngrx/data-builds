/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/default-logger.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var DefaultLogger = /** @class */ (function () {
    function DefaultLogger() {
    }
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    DefaultLogger.prototype.error = /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    function (message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    };
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    DefaultLogger.prototype.log = /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    function (message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    };
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    DefaultLogger.prototype.warn = /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    function (message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    };
    DefaultLogger.decorators = [
        { type: Injectable },
    ];
    return DefaultLogger;
}());
export { DefaultLogger };
//# sourceMappingURL=default-logger.js.map