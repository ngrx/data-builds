/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/default-data-service-config.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Optional configuration settings for an entity collection data service
 * such as the `DefaultDataService<T>`.
 * @abstract
 */
var /**
 * Optional configuration settings for an entity collection data service
 * such as the `DefaultDataService<T>`.
 * @abstract
 */
DefaultDataServiceConfig = /** @class */ (function () {
    function DefaultDataServiceConfig() {
    }
    return DefaultDataServiceConfig;
}());
/**
 * Optional configuration settings for an entity collection data service
 * such as the `DefaultDataService<T>`.
 * @abstract
 */
export { DefaultDataServiceConfig };
if (false) {
    /**
     * root path of the web api.  may also include protocol, domain, and port
     * for remote api, e.g.: `'https://api-domain.com:8000/api/v1'` (default: 'api')
     * @type {?}
     */
    DefaultDataServiceConfig.prototype.root;
    /**
     * Known entity HttpResourceUrls.
     * HttpUrlGenerator will create these URLs for entity types not listed here.
     * @type {?}
     */
    DefaultDataServiceConfig.prototype.entityHttpResourceUrls;
    /**
     * Is a DELETE 404 really OK? (default: true)
     * @type {?}
     */
    DefaultDataServiceConfig.prototype.delete404OK;
    /**
     * Simulate GET latency in a demo (default: 0)
     * @type {?}
     */
    DefaultDataServiceConfig.prototype.getDelay;
    /**
     * Simulate save method (PUT/POST/DELETE) latency in a demo (default: 0)
     * @type {?}
     */
    DefaultDataServiceConfig.prototype.saveDelay;
    /**
     * request timeout in MS (default: 0)
     * @type {?}
     */
    DefaultDataServiceConfig.prototype.timeout;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQTs7Ozs7O0lBQUE7SUFtQkEsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQzs7Ozs7Ozs7Ozs7OztJQWRDLHdDQUFjOzs7Ozs7SUFLZCwwREFBZ0Q7Ozs7O0lBRWhELCtDQUFzQjs7Ozs7SUFFdEIsNENBQWtCOzs7OztJQUVsQiw2Q0FBbUI7Ozs7O0lBRW5CLDJDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUh0dHBSZXNvdXJjZVVybHMgfSBmcm9tICcuL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbi8qKlxuICogT3B0aW9uYWwgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBmb3IgYW4gZW50aXR5IGNvbGxlY3Rpb24gZGF0YSBzZXJ2aWNlXG4gKiBzdWNoIGFzIHRoZSBgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+YC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB7XG4gIC8qKlxuICAgKiByb290IHBhdGggb2YgdGhlIHdlYiBhcGkuICBtYXkgYWxzbyBpbmNsdWRlIHByb3RvY29sLCBkb21haW4sIGFuZCBwb3J0XG4gICAqIGZvciByZW1vdGUgYXBpLCBlLmcuOiBgJ2h0dHBzOi8vYXBpLWRvbWFpbi5jb206ODAwMC9hcGkvdjEnYCAoZGVmYXVsdDogJ2FwaScpXG4gICAqL1xuICByb290Pzogc3RyaW5nO1xuICAvKipcbiAgICogS25vd24gZW50aXR5IEh0dHBSZXNvdXJjZVVybHMuXG4gICAqIEh0dHBVcmxHZW5lcmF0b3Igd2lsbCBjcmVhdGUgdGhlc2UgVVJMcyBmb3IgZW50aXR5IHR5cGVzIG5vdCBsaXN0ZWQgaGVyZS5cbiAgICovXG4gIGVudGl0eUh0dHBSZXNvdXJjZVVybHM/OiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzO1xuICAvKiogSXMgYSBERUxFVEUgNDA0IHJlYWxseSBPSz8gKGRlZmF1bHQ6IHRydWUpICovXG4gIGRlbGV0ZTQwNE9LPzogYm9vbGVhbjtcbiAgLyoqIFNpbXVsYXRlIEdFVCBsYXRlbmN5IGluIGEgZGVtbyAoZGVmYXVsdDogMCkgKi9cbiAgZ2V0RGVsYXk/OiBudW1iZXI7XG4gIC8qKiBTaW11bGF0ZSBzYXZlIG1ldGhvZCAoUFVUL1BPU1QvREVMRVRFKSBsYXRlbmN5IGluIGEgZGVtbyAoZGVmYXVsdDogMCkgKi9cbiAgc2F2ZURlbGF5PzogbnVtYmVyO1xuICAvKiogcmVxdWVzdCB0aW1lb3V0IGluIE1TIChkZWZhdWx0OiAwKSovXG4gIHRpbWVvdXQ/OiBudW1iZXI7IC8vXG59XG4iXX0=