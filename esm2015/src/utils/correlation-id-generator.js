/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/utils/correlation-id-generator.ts
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
export class CorrelationIdGenerator {
    constructor() {
        /**
         * Seed for the ids
         */
        this.seed = 0;
        /**
         * Prefix of the id, 'CRID;
         */
        this.prefix = 'CRID';
    }
    /**
     * Return the next correlation id
     * @return {?}
     */
    next() {
        this.seed += 1;
        return this.prefix + this.seed;
    }
}
CorrelationIdGenerator.decorators = [
    { type: Injectable }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7O0FBWTNDLE1BQU0sT0FBTyxzQkFBc0I7SUFEbkM7Ozs7UUFHWSxTQUFJLEdBQUcsQ0FBQyxDQUFDOzs7O1FBRVQsV0FBTSxHQUFHLE1BQU0sQ0FBQztJQU01QixDQUFDOzs7OztJQUpDLElBQUk7UUFDRixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUM7OztZQVZGLFVBQVU7Ozs7Ozs7O0lBR1Qsc0NBQW1COzs7Ozs7SUFFbkIsd0NBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHN0cmluZyBpZCBiZWdpbm5pbmcgJ0NSSUQnLFxuICogZm9sbG93ZWQgYnkgYSBtb25vdG9uaWNhbGx5IGluY3JlYXNpbmcgaW50ZWdlciBmb3IgdXNlIGFzIGEgY29ycmVsYXRpb24gaWQuXG4gKiBBcyB0aGV5IGFyZSBwcm9kdWNlZCBsb2NhbGx5IGJ5IGEgc2luZ2xldG9uIHNlcnZpY2UsXG4gKiB0aGVzZSBpZHMgYXJlIGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlIG9ubHlcbiAqIGZvciB0aGUgZHVyYXRpb24gb2YgYSBzaW5nbGUgY2xpZW50IGJyb3dzZXIgaW5zdGFuY2UuXG4gKiBOZ3J4IGVudGl0eSBkaXNwYXRjaGVyIHF1ZXJ5IGFuZCBzYXZlIG1ldGhvZHMgY2FsbCB0aGlzIHNlcnZpY2UgdG8gZ2VuZXJhdGUgZGVmYXVsdCBjb3JyZWxhdGlvbiBpZHMuXG4gKiBEbyBOT1QgdXNlIGZvciBlbnRpdHkga2V5cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uSWRHZW5lcmF0b3Ige1xuICAvKiogU2VlZCBmb3IgdGhlIGlkcyAqL1xuICBwcm90ZWN0ZWQgc2VlZCA9IDA7XG4gIC8qKiBQcmVmaXggb2YgdGhlIGlkLCAnQ1JJRDsgKi9cbiAgcHJvdGVjdGVkIHByZWZpeCA9ICdDUklEJztcbiAgLyoqIFJldHVybiB0aGUgbmV4dCBjb3JyZWxhdGlvbiBpZCAqL1xuICBuZXh0KCkge1xuICAgIHRoaXMuc2VlZCArPSAxO1xuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMuc2VlZDtcbiAgfVxufVxuIl19