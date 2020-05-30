/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/interfaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * A service that performs REST-like HTTP data operations for an entity collection
 * @record
 * @template T
 */
export function EntityCollectionDataService() { }
if (false) {
    /** @type {?} */
    EntityCollectionDataService.prototype.name;
    /**
     * @param {?} entity
     * @return {?}
     */
    EntityCollectionDataService.prototype.add = function (entity) { };
    /**
     * @param {?} id
     * @return {?}
     */
    EntityCollectionDataService.prototype.delete = function (id) { };
    /**
     * @return {?}
     */
    EntityCollectionDataService.prototype.getAll = function () { };
    /**
     * @param {?} id
     * @return {?}
     */
    EntityCollectionDataService.prototype.getById = function (id) { };
    /**
     * @param {?} params
     * @return {?}
     */
    EntityCollectionDataService.prototype.getWithQuery = function (params) { };
    /**
     * @param {?} update
     * @return {?}
     */
    EntityCollectionDataService.prototype.update = function (update) { };
    /**
     * @param {?} entity
     * @return {?}
     */
    EntityCollectionDataService.prototype.upsert = function (entity) { };
}
/**
 * @record
 */
export function RequestData() { }
if (false) {
    /** @type {?} */
    RequestData.prototype.method;
    /** @type {?} */
    RequestData.prototype.url;
    /** @type {?|undefined} */
    RequestData.prototype.data;
    /** @type {?|undefined} */
    RequestData.prototype.options;
}
/**
 * A key/value map of parameters to be turned into an HTTP query string
 * Same as HttpClient's HttpParamsOptions which is NOT exported at package level
 * https://github.com/angular/angular/issues/22013
 * @record
 */
export function QueryParams() { }
//# sourceMappingURL=interfaces.js.map