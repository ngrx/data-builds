/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2ludGVyZmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBSUEsaURBU0M7OztJQVJDLDJDQUFzQjs7Ozs7SUFDdEIsa0VBQThCOzs7OztJQUM5QixpRUFBeUQ7Ozs7SUFDekQsK0RBQTBCOzs7OztJQUMxQixrRUFBZ0M7Ozs7O0lBQ2hDLDJFQUE0RDs7Ozs7SUFDNUQscUVBQXlDOzs7OztJQUN6QyxxRUFBaUM7Ozs7O0FBS25DLGlDQUtDOzs7SUFKQyw2QkFBb0I7O0lBQ3BCLDBCQUFZOztJQUNaLDJCQUFXOztJQUNYLDhCQUFjOzs7Ozs7OztBQVFoQixpQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbi8qKiBBIHNlcnZpY2UgdGhhdCBwZXJmb3JtcyBSRVNULWxpa2UgSFRUUCBkYXRhIG9wZXJhdGlvbnMgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgYWRkKGVudGl0eTogVCk6IE9ic2VydmFibGU8VD47XG4gIGRlbGV0ZShpZDogbnVtYmVyIHwgc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+O1xuICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxUW10+O1xuICBnZXRCeUlkKGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+O1xuICBnZXRXaXRoUXVlcnkocGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyk6IE9ic2VydmFibGU8VFtdPjtcbiAgdXBkYXRlKHVwZGF0ZTogVXBkYXRlPFQ+KTogT2JzZXJ2YWJsZTxUPjtcbiAgdXBzZXJ0KGVudGl0eTogVCk6IE9ic2VydmFibGU8VD47XG59XG5cbmV4cG9ydCB0eXBlIEh0dHBNZXRob2RzID0gJ0RFTEVURScgfCAnR0VUJyB8ICdQT1NUJyB8ICdQVVQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3REYXRhIHtcbiAgbWV0aG9kOiBIdHRwTWV0aG9kcztcbiAgdXJsOiBzdHJpbmc7XG4gIGRhdGE/OiBhbnk7XG4gIG9wdGlvbnM/OiBhbnk7XG59XG5cbi8qKlxuICogQSBrZXkvdmFsdWUgbWFwIG9mIHBhcmFtZXRlcnMgdG8gYmUgdHVybmVkIGludG8gYW4gSFRUUCBxdWVyeSBzdHJpbmdcbiAqIFNhbWUgYXMgSHR0cENsaWVudCdzIEh0dHBQYXJhbXNPcHRpb25zIHdoaWNoIGlzIE5PVCBleHBvcnRlZCBhdCBwYWNrYWdlIGxldmVsXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMjAxM1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5UGFyYW1zIHtcbiAgW25hbWU6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdO1xufVxuIl19