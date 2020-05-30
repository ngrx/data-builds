/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/correlation-id-generator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Generates a string id beginning 'CRID',
 * followed by a monotonically increasing integer for use as a correlation id.
 * As they are produced locally by a singleton service,
 * these ids are guaranteed to be unique only
 * for the duration of a single client browser instance.
 * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
 * Do NOT use for entity keys.
 */
var CorrelationIdGenerator = /** @class */ (function () {
    function CorrelationIdGenerator() {
        /**
         * Seed for the ids
         */
        this.seed = 0;
        /**
         * Prefix of the id, 'CRID;
         */
        this.prefix = 'CRID';
    }
    /** Return the next correlation id */
    /**
     * Return the next correlation id
     * @return {?}
     */
    CorrelationIdGenerator.prototype.next = /**
     * Return the next correlation id
     * @return {?}
     */
    function () {
        this.seed += 1;
        return this.prefix + this.seed;
    };
    CorrelationIdGenerator.decorators = [
        { type: Injectable },
    ];
    return CorrelationIdGenerator;
}());
export { CorrelationIdGenerator };
if (false) {
    /**
     * Seed for the ids
     * @type {?}
     * @protected
     */
    CorrelationIdGenerator.prototype.seed;
    /**
     * Prefix of the id, 'CRID;
     * @type {?}
     * @protected
     */
    CorrelationIdGenerator.prototype.prefix;
}
//# sourceMappingURL=correlation-id-generator.js.map