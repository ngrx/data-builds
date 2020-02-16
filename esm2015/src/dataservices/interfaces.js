/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dataservices/interfaces.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2ludGVyZmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGlEQVNDOzs7SUFSQywyQ0FBc0I7Ozs7O0lBQ3RCLGtFQUE4Qjs7Ozs7SUFDOUIsaUVBQXlEOzs7O0lBQ3pELCtEQUEwQjs7Ozs7SUFDMUIsa0VBQWdDOzs7OztJQUNoQywyRUFBNEQ7Ozs7O0lBQzVELHFFQUF5Qzs7Ozs7SUFDekMscUVBQWlDOzs7OztBQUtuQyxpQ0FLQzs7O0lBSkMsNkJBQW9COztJQUNwQiwwQkFBWTs7SUFDWiwyQkFBVzs7SUFDWCw4QkFBYzs7Ozs7Ozs7QUFRaEIsaUNBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG4vKiogQSBzZXJ2aWNlIHRoYXQgcGVyZm9ybXMgUkVTVC1saWtlIEhUVFAgZGF0YSBvcGVyYXRpb25zIGZvciBhbiBlbnRpdHkgY29sbGVjdGlvbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIGFkZChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+O1xuICBkZWxldGUoaWQ6IG51bWJlciB8IHN0cmluZyk6IE9ic2VydmFibGU8bnVtYmVyIHwgc3RyaW5nPjtcbiAgZ2V0QWxsKCk6IE9ic2VydmFibGU8VFtdPjtcbiAgZ2V0QnlJZChpZDogYW55KTogT2JzZXJ2YWJsZTxUPjtcbiAgZ2V0V2l0aFF1ZXJ5KHBhcmFtczogUXVlcnlQYXJhbXMgfCBzdHJpbmcpOiBPYnNlcnZhYmxlPFRbXT47XG4gIHVwZGF0ZSh1cGRhdGU6IFVwZGF0ZTxUPik6IE9ic2VydmFibGU8VD47XG4gIHVwc2VydChlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPFQ+O1xufVxuXG5leHBvcnQgdHlwZSBIdHRwTWV0aG9kcyA9ICdERUxFVEUnIHwgJ0dFVCcgfCAnUE9TVCcgfCAnUFVUJztcblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0RGF0YSB7XG4gIG1ldGhvZDogSHR0cE1ldGhvZHM7XG4gIHVybDogc3RyaW5nO1xuICBkYXRhPzogYW55O1xuICBvcHRpb25zPzogYW55O1xufVxuXG4vKipcbiAqIEEga2V5L3ZhbHVlIG1hcCBvZiBwYXJhbWV0ZXJzIHRvIGJlIHR1cm5lZCBpbnRvIGFuIEhUVFAgcXVlcnkgc3RyaW5nXG4gKiBTYW1lIGFzIEh0dHBDbGllbnQncyBIdHRwUGFyYW1zT3B0aW9ucyB3aGljaCBpcyBOT1QgZXhwb3J0ZWQgYXQgcGFja2FnZSBsZXZlbFxuICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjIwMTNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBRdWVyeVBhcmFtcyB7XG4gIFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cbiJdfQ==