/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dataservices/default-data-service-config.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Optional configuration settings for an entity collection data service
 * such as the `DefaultDataService<T>`.
 * @abstract
 */
export class DefaultDataServiceConfig {
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxNQUFNLE9BQWdCLHdCQUF3QjtDQW1CN0M7Ozs7Ozs7SUFkQyx3Q0FBYzs7Ozs7O0lBS2QsMERBQWdEOzs7OztJQUVoRCwrQ0FBc0I7Ozs7O0lBRXRCLDRDQUFrQjs7Ozs7SUFFbEIsNkNBQW1COzs7OztJQUVuQiwyQ0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzIH0gZnJvbSAnLi9odHRwLXVybC1nZW5lcmF0b3InO1xuXG4vKipcbiAqIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uIGRhdGEgc2VydmljZVxuICogc3VjaCBhcyB0aGUgYERlZmF1bHREYXRhU2VydmljZTxUPmAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcge1xuICAvKipcbiAgICogcm9vdCBwYXRoIG9mIHRoZSB3ZWIgYXBpLiAgbWF5IGFsc28gaW5jbHVkZSBwcm90b2NvbCwgZG9tYWluLCBhbmQgcG9ydFxuICAgKiBmb3IgcmVtb3RlIGFwaSwgZS5nLjogYCdodHRwczovL2FwaS1kb21haW4uY29tOjgwMDAvYXBpL3YxJ2AgKGRlZmF1bHQ6ICdhcGknKVxuICAgKi9cbiAgcm9vdD86IHN0cmluZztcbiAgLyoqXG4gICAqIEtub3duIGVudGl0eSBIdHRwUmVzb3VyY2VVcmxzLlxuICAgKiBIdHRwVXJsR2VuZXJhdG9yIHdpbGwgY3JlYXRlIHRoZXNlIFVSTHMgZm9yIGVudGl0eSB0eXBlcyBub3QgbGlzdGVkIGhlcmUuXG4gICAqL1xuICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzPzogRW50aXR5SHR0cFJlc291cmNlVXJscztcbiAgLyoqIElzIGEgREVMRVRFIDQwNCByZWFsbHkgT0s/IChkZWZhdWx0OiB0cnVlKSAqL1xuICBkZWxldGU0MDRPSz86IGJvb2xlYW47XG4gIC8qKiBTaW11bGF0ZSBHRVQgbGF0ZW5jeSBpbiBhIGRlbW8gKGRlZmF1bHQ6IDApICovXG4gIGdldERlbGF5PzogbnVtYmVyO1xuICAvKiogU2ltdWxhdGUgc2F2ZSBtZXRob2QgKFBVVC9QT1NUL0RFTEVURSkgbGF0ZW5jeSBpbiBhIGRlbW8gKGRlZmF1bHQ6IDApICovXG4gIHNhdmVEZWxheT86IG51bWJlcjtcbiAgLyoqIHJlcXVlc3QgdGltZW91dCBpbiBNUyAoZGVmYXVsdDogMCkqL1xuICB0aW1lb3V0PzogbnVtYmVyOyAvL1xufVxuIl19