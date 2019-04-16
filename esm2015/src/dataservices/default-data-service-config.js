/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * root path of the web api (default: 'api')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLE1BQU0sT0FBZ0Isd0JBQXdCO0NBZ0I3Qzs7Ozs7O0lBZEMsd0NBQWM7Ozs7OztJQUtkLDBEQUFnRDs7Ozs7SUFFaEQsK0NBQXNCOzs7OztJQUV0Qiw0Q0FBa0I7Ozs7O0lBRWxCLDZDQUFtQjs7Ozs7SUFFbkIsMkNBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cFVybEdlbmVyYXRvciwgRW50aXR5SHR0cFJlc291cmNlVXJscyB9IGZyb20gJy4vaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuLyoqXG4gKiBPcHRpb25hbCBjb25maWd1cmF0aW9uIHNldHRpbmdzIGZvciBhbiBlbnRpdHkgY29sbGVjdGlvbiBkYXRhIHNlcnZpY2VcbiAqIHN1Y2ggYXMgdGhlIGBEZWZhdWx0RGF0YVNlcnZpY2U8VD5gLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnIHtcbiAgLyoqIHJvb3QgcGF0aCBvZiB0aGUgd2ViIGFwaSAoZGVmYXVsdDogJ2FwaScpICovXG4gIHJvb3Q/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBLbm93biBlbnRpdHkgSHR0cFJlc291cmNlVXJscy5cbiAgICogSHR0cFVybEdlbmVyYXRvciB3aWxsIGNyZWF0ZSB0aGVzZSBVUkxzIGZvciBlbnRpdHkgdHlwZXMgbm90IGxpc3RlZCBoZXJlLlxuICAgKi9cbiAgZW50aXR5SHR0cFJlc291cmNlVXJscz86IEVudGl0eUh0dHBSZXNvdXJjZVVybHM7XG4gIC8qKiBJcyBhIERFTEVURSA0MDQgcmVhbGx5IE9LPyAoZGVmYXVsdDogdHJ1ZSkgKi9cbiAgZGVsZXRlNDA0T0s/OiBib29sZWFuO1xuICAvKiogU2ltdWxhdGUgR0VUIGxhdGVuY3kgaW4gYSBkZW1vIChkZWZhdWx0OiAwKSAqL1xuICBnZXREZWxheT86IG51bWJlcjtcbiAgLyoqIFNpbXVsYXRlIHNhdmUgbWV0aG9kIChQVVQvUE9TVC9ERUxFVEUpIGxhdGVuY3kgaW4gYSBkZW1vIChkZWZhdWx0OiAwKSAqL1xuICBzYXZlRGVsYXk/OiBudW1iZXI7XG4gIC8qKiByZXF1ZXN0IHRpbWVvdXQgaW4gTVMgKGRlZmF1bHQ6IDApKi9cbiAgdGltZW91dD86IG51bWJlcjsgLy9cbn1cbiJdfQ==