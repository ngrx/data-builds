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
        { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7O0FBVzNDO0lBQUE7Ozs7UUFHWSxTQUFJLEdBQUcsQ0FBQyxDQUFDOzs7O1FBRVQsV0FBTSxHQUFHLE1BQU0sQ0FBQztJQU01QixDQUFDO0lBTEMscUNBQXFDOzs7OztJQUNyQyxxQ0FBSTs7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDOztnQkFWRixVQUFVOztJQVdYLDZCQUFDO0NBQUEsQUFYRCxJQVdDO1NBVlksc0JBQXNCOzs7Ozs7O0lBRWpDLHNDQUFtQjs7Ozs7O0lBRW5CLHdDQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgaWQgYmVnaW5uaW5nICdDUklEJyxcbiAqIGZvbGxvd2VkIGJ5IGEgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIGludGVnZXIgZm9yIHVzZSBhcyBhIGNvcnJlbGF0aW9uIGlkLlxuICogQXMgdGhleSBhcmUgcHJvZHVjZWQgbG9jYWxseSBieSBhIHNpbmdsZXRvbiBzZXJ2aWNlLFxuICogdGhlc2UgaWRzIGFyZSBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZSBvbmx5XG4gKiBmb3IgdGhlIGR1cmF0aW9uIG9mIGEgc2luZ2xlIGNsaWVudCBicm93c2VyIGluc3RhbmNlLlxuICogTmdyeCBlbnRpdHkgZGlzcGF0Y2hlciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzIGNhbGwgdGhpcyBzZXJ2aWNlIHRvIGdlbmVyYXRlIGRlZmF1bHQgY29ycmVsYXRpb24gaWRzLlxuICogRG8gTk9UIHVzZSBmb3IgZW50aXR5IGtleXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIHtcbiAgLyoqIFNlZWQgZm9yIHRoZSBpZHMgKi9cbiAgcHJvdGVjdGVkIHNlZWQgPSAwO1xuICAvKiogUHJlZml4IG9mIHRoZSBpZCwgJ0NSSUQ7ICovXG4gIHByb3RlY3RlZCBwcmVmaXggPSAnQ1JJRCc7XG4gIC8qKiBSZXR1cm4gdGhlIG5leHQgY29ycmVsYXRpb24gaWQgKi9cbiAgbmV4dCgpIHtcbiAgICB0aGlzLnNlZWQgKz0gMTtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnNlZWQ7XG4gIH1cbn1cbiJdfQ==