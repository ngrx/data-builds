/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dataservices/data-service-error.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zZXJ2aWNlLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFXQSxNQUFNLE9BQU8sZ0JBQWdCOzs7OztJQUczQixZQUFtQixLQUFVLEVBQVMsV0FBK0I7UUFBbEQsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGOzs7SUFMQyxtQ0FBdUI7O0lBRVgsaUNBQWlCOztJQUFFLHVDQUFzQzs7Ozs7OztBQU12RSxTQUFTLGNBQWMsQ0FBQyxXQUFnQjtVQUNoQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVzs7UUFDeEMsVUFBVSxHQUFrQixJQUFJO0lBQ3BDLElBQUksS0FBSyxFQUFFO1FBQ1QseURBQXlEO1FBQ3pELFVBQVUsR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztLQUNoRTtTQUFNLElBQUksT0FBTyxFQUFFO1FBQ2xCLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDdEI7U0FBTSxJQUFJLElBQUksRUFBRTtRQUNmLCtDQUErQztRQUMvQyxVQUFVLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDM0Q7SUFFRCxPQUFPLE9BQU8sVUFBVSxLQUFLLFFBQVE7UUFDbkMsQ0FBQyxDQUFDLFVBQVU7UUFDWixDQUFDLENBQUMsVUFBVTtZQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2IsQ0FBQzs7Ozs7QUFHRCxrREFHQzs7O0lBRkMsNkNBQXdCOztJQUN4QixzREFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgUmVxdWVzdERhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEVycm9yIGZyb20gYSBEYXRhU2VydmljZVxuICogVGhlIHNvdXJjZSBlcnJvciBlaXRoZXIgY29tZXMgZnJvbSBhIGZhaWxlZCBIVFRQIHJlc3BvbnNlIG9yIHdhcyB0aHJvd24gd2l0aGluIHRoZSBzZXJ2aWNlLlxuICogQHBhcmFtIGVycm9yIHRoZSBIdHRwRXJyb3JSZXNwb25zZSBvciB0aGUgZXJyb3IgdGhyb3duIGJ5IHRoZSBzZXJ2aWNlXG4gKiBAcGFyYW0gcmVxdWVzdERhdGEgdGhlIEhUVFAgcmVxdWVzdCBpbmZvcm1hdGlvbiBzdWNoIGFzIHRoZSBtZXRob2QgYW5kIHRoZSB1cmwuXG4gKi9cbi8vIElmIGV4dGVuZCBmcm9tIEVycm9yLCBgZHNlIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvcmAgcmV0dXJucyBmYWxzZVxuLy8gaW4gc29tZSAoYWxsPykgdW5pdCB0ZXN0cyBzbyBkb24ndCBib3RoZXIgdHJ5aW5nLlxuZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlRXJyb3Ige1xuICBtZXNzYWdlOiBzdHJpbmcgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlcnJvcjogYW55LCBwdWJsaWMgcmVxdWVzdERhdGE6IFJlcXVlc3REYXRhIHwgbnVsbCkge1xuICAgIHRoaXMubWVzc2FnZSA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBlcnJvciA6IGV4dHJhY3RNZXNzYWdlKGVycm9yKTtcbiAgfVxufVxuXG4vLyBNYW55IHdheXMgdGhlIGVycm9yIGNhbiBiZSBzaGFwZWQuIFRoZXNlIGFyZSB0aGUgd2F5cyB3ZSByZWNvZ25pemUuXG5mdW5jdGlvbiBleHRyYWN0TWVzc2FnZShzb3VyY2VFcnJvcjogYW55KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHsgZXJyb3IsIGJvZHksIG1lc3NhZ2UgfSA9IHNvdXJjZUVycm9yO1xuICBsZXQgZXJyTWVzc2FnZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGlmIChlcnJvcikge1xuICAgIC8vIHByZWZlciBIdHRwRXJyb3JSZXNwb25zZS5lcnJvciB0byBpdHMgbWVzc2FnZSBwcm9wZXJ0eVxuICAgIGVyck1lc3NhZ2UgPSB0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnID8gZXJyb3IgOiBlcnJvci5tZXNzYWdlO1xuICB9IGVsc2UgaWYgKG1lc3NhZ2UpIHtcbiAgICBlcnJNZXNzYWdlID0gbWVzc2FnZTtcbiAgfSBlbHNlIGlmIChib2R5KSB7XG4gICAgLy8gdHJ5IHRoZSBib2R5IGlmIG5vIGVycm9yIG9yIG1lc3NhZ2UgcHJvcGVydHlcbiAgICBlcnJNZXNzYWdlID0gdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnID8gYm9keSA6IGJvZHkuZXJyb3I7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIGVyck1lc3NhZ2UgPT09ICdzdHJpbmcnXG4gICAgPyBlcnJNZXNzYWdlXG4gICAgOiBlcnJNZXNzYWdlXG4gICAgICA/IEpTT04uc3RyaW5naWZ5KGVyck1lc3NhZ2UpXG4gICAgICA6IG51bGw7XG59XG5cbi8qKiBQYXlsb2FkIGZvciBhbiBFbnRpdHlBY3Rpb24gZGF0YSBzZXJ2aWNlIGVycm9yIHN1Y2ggYXMgUVVFUllfQUxMX0VSUk9SICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3Ige1xuICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvcjtcbiAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbjtcbn1cbiJdfQ==