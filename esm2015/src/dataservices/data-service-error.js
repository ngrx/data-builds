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
//# sourceMappingURL=data-service-error.js.map