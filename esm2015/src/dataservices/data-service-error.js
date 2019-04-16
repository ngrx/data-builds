/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
// If extend from Error, `dse instanceof DataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
export class DataServiceError {
    /**
     * @param {?} error
     * @param {?} requestData
     */
    constructor(error, requestData) {
        this.error = error;
        this.requestData = requestData;
        this.message = typeof error === 'string' ? error : extractMessage(error);
    }
}
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
    const { error, body, message } = sourceError;
    /** @type {?} */
    let errMessage = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zZXJ2aWNlLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVdBLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7O0lBRzNCLFlBQW1CLEtBQVUsRUFBUyxXQUErQjtRQUFsRCxVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQ25FLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0Y7OztJQUxDLG1DQUF1Qjs7SUFFWCxpQ0FBaUI7O0lBQUUsdUNBQXNDOzs7Ozs7O0FBTXZFLFNBQVMsY0FBYyxDQUFDLFdBQWdCO1VBQ2hDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXOztRQUN4QyxVQUFVLEdBQWtCLElBQUk7SUFDcEMsSUFBSSxLQUFLLEVBQUU7UUFDVCx5REFBeUQ7UUFDekQsVUFBVSxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0tBQ2hFO1NBQU0sSUFBSSxPQUFPLEVBQUU7UUFDbEIsVUFBVSxHQUFHLE9BQU8sQ0FBQztLQUN0QjtTQUFNLElBQUksSUFBSSxFQUFFO1FBQ2YsK0NBQStDO1FBQy9DLFVBQVUsR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUMzRDtJQUVELE9BQU8sT0FBTyxVQUFVLEtBQUssUUFBUTtRQUNuQyxDQUFDLENBQUMsVUFBVTtRQUNaLENBQUMsQ0FBQyxVQUFVO1lBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDYixDQUFDOzs7OztBQUdELGtEQUdDOzs7SUFGQyw2Q0FBd0I7O0lBQ3hCLHNEQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBSZXF1ZXN0RGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRXJyb3IgZnJvbSBhIERhdGFTZXJ2aWNlXG4gKiBUaGUgc291cmNlIGVycm9yIGVpdGhlciBjb21lcyBmcm9tIGEgZmFpbGVkIEhUVFAgcmVzcG9uc2Ugb3Igd2FzIHRocm93biB3aXRoaW4gdGhlIHNlcnZpY2UuXG4gKiBAcGFyYW0gZXJyb3IgdGhlIEh0dHBFcnJvclJlc3BvbnNlIG9yIHRoZSBlcnJvciB0aHJvd24gYnkgdGhlIHNlcnZpY2VcbiAqIEBwYXJhbSByZXF1ZXN0RGF0YSB0aGUgSFRUUCByZXF1ZXN0IGluZm9ybWF0aW9uIHN1Y2ggYXMgdGhlIG1ldGhvZCBhbmQgdGhlIHVybC5cbiAqL1xuLy8gSWYgZXh0ZW5kIGZyb20gRXJyb3IsIGBkc2UgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yYCByZXR1cm5zIGZhbHNlXG4vLyBpbiBzb21lIChhbGw/KSB1bml0IHRlc3RzIHNvIGRvbid0IGJvdGhlciB0cnlpbmcuXG5leHBvcnQgY2xhc3MgRGF0YVNlcnZpY2VFcnJvciB7XG4gIG1lc3NhZ2U6IHN0cmluZyB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVycm9yOiBhbnksIHB1YmxpYyByZXF1ZXN0RGF0YTogUmVxdWVzdERhdGEgfCBudWxsKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IGVycm9yIDogZXh0cmFjdE1lc3NhZ2UoZXJyb3IpO1xuICB9XG59XG5cbi8vIE1hbnkgd2F5cyB0aGUgZXJyb3IgY2FuIGJlIHNoYXBlZC4gVGhlc2UgYXJlIHRoZSB3YXlzIHdlIHJlY29nbml6ZS5cbmZ1bmN0aW9uIGV4dHJhY3RNZXNzYWdlKHNvdXJjZUVycm9yOiBhbnkpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgeyBlcnJvciwgYm9keSwgbWVzc2FnZSB9ID0gc291cmNlRXJyb3I7XG4gIGxldCBlcnJNZXNzYWdlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgaWYgKGVycm9yKSB7XG4gICAgLy8gcHJlZmVyIEh0dHBFcnJvclJlc3BvbnNlLmVycm9yIHRvIGl0cyBtZXNzYWdlIHByb3BlcnR5XG4gICAgZXJyTWVzc2FnZSA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBlcnJvciA6IGVycm9yLm1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAobWVzc2FnZSkge1xuICAgIGVyck1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9IGVsc2UgaWYgKGJvZHkpIHtcbiAgICAvLyB0cnkgdGhlIGJvZHkgaWYgbm8gZXJyb3Igb3IgbWVzc2FnZSBwcm9wZXJ0eVxuICAgIGVyck1lc3NhZ2UgPSB0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycgPyBib2R5IDogYm9keS5lcnJvcjtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2YgZXJyTWVzc2FnZSA9PT0gJ3N0cmluZydcbiAgICA/IGVyck1lc3NhZ2VcbiAgICA6IGVyck1lc3NhZ2VcbiAgICAgID8gSlNPTi5zdHJpbmdpZnkoZXJyTWVzc2FnZSlcbiAgICAgIDogbnVsbDtcbn1cblxuLyoqIFBheWxvYWQgZm9yIGFuIEVudGl0eUFjdGlvbiBkYXRhIHNlcnZpY2UgZXJyb3Igc3VjaCBhcyBRVUVSWV9BTExfRVJST1IgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciB7XG4gIGVycm9yOiBEYXRhU2VydmljZUVycm9yO1xuICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uO1xufVxuIl19