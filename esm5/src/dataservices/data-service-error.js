/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/data-service-error.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
// If extend from Error, `dse instanceof DataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
var /**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
// If extend from Error, `dse instanceof DataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
DataServiceError = /** @class */ (function () {
    function DataServiceError(error, requestData) {
        this.error = error;
        this.requestData = requestData;
        this.message = typeof error === 'string' ? error : extractMessage(error);
    }
    return DataServiceError;
}());
/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
// If extend from Error, `dse instanceof DataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
export { DataServiceError };
if (false) {
    /** @type {?} */
    DataServiceError.prototype.message;
    /** @type {?} */
    DataServiceError.prototype.error;
    /** @type {?} */
    DataServiceError.prototype.requestData;
}
// Many ways the error can be shaped. These are the ways we recognize.
/**
 * @param {?} sourceError
 * @return {?}
 */
function extractMessage(sourceError) {
    var error = sourceError.error, body = sourceError.body, message = sourceError.message;
    /** @type {?} */
    var errMessage = null;
    if (error) {
        // prefer HttpErrorResponse.error to its message property
        errMessage = typeof error === 'string' ? error : error.message;
    }
    else if (message) {
        errMessage = message;
    }
    else if (body) {
        // try the body if no error or message property
        errMessage = typeof body === 'string' ? body : body.error;
    }
    return typeof errMessage === 'string'
        ? errMessage
        : errMessage
            ? JSON.stringify(errMessage)
            : null;
}
/**
 * Payload for an EntityAction data service error such as QUERY_ALL_ERROR
 * @record
 */
export function EntityActionDataServiceError() { }
if (false) {
    /** @type {?} */
    EntityActionDataServiceError.prototype.error;
    /** @type {?} */
    EntityActionDataServiceError.prototype.originalAction;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zZXJ2aWNlLWVycm9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7O0lBR0UsMEJBQW1CLEtBQVUsRUFBUyxXQUErQjtRQUFsRCxVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQ25FLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQzs7Ozs7Ozs7Ozs7O0lBTEMsbUNBQXVCOztJQUVYLGlDQUFpQjs7SUFBRSx1Q0FBc0M7Ozs7Ozs7QUFNdkUsU0FBUyxjQUFjLENBQUMsV0FBZ0I7SUFDOUIsSUFBQSx5QkFBSyxFQUFFLHVCQUFJLEVBQUUsNkJBQU87O1FBQ3hCLFVBQVUsR0FBa0IsSUFBSTtJQUNwQyxJQUFJLEtBQUssRUFBRTtRQUNULHlEQUF5RDtRQUN6RCxVQUFVLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7S0FDaEU7U0FBTSxJQUFJLE9BQU8sRUFBRTtRQUNsQixVQUFVLEdBQUcsT0FBTyxDQUFDO0tBQ3RCO1NBQU0sSUFBSSxJQUFJLEVBQUU7UUFDZiwrQ0FBK0M7UUFDL0MsVUFBVSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQzNEO0lBRUQsT0FBTyxPQUFPLFVBQVUsS0FBSyxRQUFRO1FBQ25DLENBQUMsQ0FBQyxVQUFVO1FBQ1osQ0FBQyxDQUFDLFVBQVU7WUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNYLENBQUM7Ozs7O0FBR0Qsa0RBR0M7OztJQUZDLDZDQUF3Qjs7SUFDeEIsc0RBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IFJlcXVlc3REYXRhIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBFcnJvciBmcm9tIGEgRGF0YVNlcnZpY2VcbiAqIFRoZSBzb3VyY2UgZXJyb3IgZWl0aGVyIGNvbWVzIGZyb20gYSBmYWlsZWQgSFRUUCByZXNwb25zZSBvciB3YXMgdGhyb3duIHdpdGhpbiB0aGUgc2VydmljZS5cbiAqIEBwYXJhbSBlcnJvciB0aGUgSHR0cEVycm9yUmVzcG9uc2Ugb3IgdGhlIGVycm9yIHRocm93biBieSB0aGUgc2VydmljZVxuICogQHBhcmFtIHJlcXVlc3REYXRhIHRoZSBIVFRQIHJlcXVlc3QgaW5mb3JtYXRpb24gc3VjaCBhcyB0aGUgbWV0aG9kIGFuZCB0aGUgdXJsLlxuICovXG4vLyBJZiBleHRlbmQgZnJvbSBFcnJvciwgYGRzZSBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3JgIHJldHVybnMgZmFsc2Vcbi8vIGluIHNvbWUgKGFsbD8pIHVuaXQgdGVzdHMgc28gZG9uJ3QgYm90aGVyIHRyeWluZy5cbmV4cG9ydCBjbGFzcyBEYXRhU2VydmljZUVycm9yIHtcbiAgbWVzc2FnZTogc3RyaW5nIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXJyb3I6IGFueSwgcHVibGljIHJlcXVlc3REYXRhOiBSZXF1ZXN0RGF0YSB8IG51bGwpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSB0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnID8gZXJyb3IgOiBleHRyYWN0TWVzc2FnZShlcnJvcik7XG4gIH1cbn1cblxuLy8gTWFueSB3YXlzIHRoZSBlcnJvciBjYW4gYmUgc2hhcGVkLiBUaGVzZSBhcmUgdGhlIHdheXMgd2UgcmVjb2duaXplLlxuZnVuY3Rpb24gZXh0cmFjdE1lc3NhZ2Uoc291cmNlRXJyb3I6IGFueSk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCB7IGVycm9yLCBib2R5LCBtZXNzYWdlIH0gPSBzb3VyY2VFcnJvcjtcbiAgbGV0IGVyck1lc3NhZ2U6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBpZiAoZXJyb3IpIHtcbiAgICAvLyBwcmVmZXIgSHR0cEVycm9yUmVzcG9uc2UuZXJyb3IgdG8gaXRzIG1lc3NhZ2UgcHJvcGVydHlcbiAgICBlcnJNZXNzYWdlID0gdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IGVycm9yIDogZXJyb3IubWVzc2FnZTtcbiAgfSBlbHNlIGlmIChtZXNzYWdlKSB7XG4gICAgZXJyTWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAoYm9keSkge1xuICAgIC8vIHRyeSB0aGUgYm9keSBpZiBubyBlcnJvciBvciBtZXNzYWdlIHByb3BlcnR5XG4gICAgZXJyTWVzc2FnZSA9IHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJyA/IGJvZHkgOiBib2R5LmVycm9yO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBlcnJNZXNzYWdlID09PSAnc3RyaW5nJ1xuICAgID8gZXJyTWVzc2FnZVxuICAgIDogZXJyTWVzc2FnZVxuICAgID8gSlNPTi5zdHJpbmdpZnkoZXJyTWVzc2FnZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKiBQYXlsb2FkIGZvciBhbiBFbnRpdHlBY3Rpb24gZGF0YSBzZXJ2aWNlIGVycm9yIHN1Y2ggYXMgUVVFUllfQUxMX0VSUk9SICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3Ige1xuICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvcjtcbiAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbjtcbn1cbiJdfQ==