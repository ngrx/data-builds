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
//# sourceMappingURL=default-data-service-config.js.map