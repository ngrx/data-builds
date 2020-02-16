/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
// If extend from Error, `dse instanceof DataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
var DataServiceError = /** @class */ (function () {
    function DataServiceError(error, requestData) {
        this.error = error;
        this.requestData = requestData;
        this.message = typeof error === 'string' ? error : extractMessage(error);
    }
    return DataServiceError;
}());
export { DataServiceError };
// Many ways the error can be shaped. These are the ways we recognize.
function extractMessage(sourceError) {
    var error = sourceError.error, body = sourceError.body, message = sourceError.message;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zZXJ2aWNlLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBOzs7OztHQUtHO0FBQ0gsd0VBQXdFO0FBQ3hFLG9EQUFvRDtBQUNwRDtJQUdFLDBCQUFtQixLQUFVLEVBQVMsV0FBK0I7UUFBbEQsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7O0FBRUQsc0VBQXNFO0FBQ3RFLFNBQVMsY0FBYyxDQUFDLFdBQWdCO0lBQzlCLElBQUEseUJBQUssRUFBRSx1QkFBSSxFQUFFLDZCQUFPLENBQWlCO0lBQzdDLElBQUksVUFBVSxHQUFrQixJQUFJLENBQUM7SUFDckMsSUFBSSxLQUFLLEVBQUU7UUFDVCx5REFBeUQ7UUFDekQsVUFBVSxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0tBQ2hFO1NBQU0sSUFBSSxPQUFPLEVBQUU7UUFDbEIsVUFBVSxHQUFHLE9BQU8sQ0FBQztLQUN0QjtTQUFNLElBQUksSUFBSSxFQUFFO1FBQ2YsK0NBQStDO1FBQy9DLFVBQVUsR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUMzRDtJQUVELE9BQU8sT0FBTyxVQUFVLEtBQUssUUFBUTtRQUNuQyxDQUFDLENBQUMsVUFBVTtRQUNaLENBQUMsQ0FBQyxVQUFVO1lBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IFJlcXVlc3REYXRhIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBFcnJvciBmcm9tIGEgRGF0YVNlcnZpY2VcbiAqIFRoZSBzb3VyY2UgZXJyb3IgZWl0aGVyIGNvbWVzIGZyb20gYSBmYWlsZWQgSFRUUCByZXNwb25zZSBvciB3YXMgdGhyb3duIHdpdGhpbiB0aGUgc2VydmljZS5cbiAqIEBwYXJhbSBlcnJvciB0aGUgSHR0cEVycm9yUmVzcG9uc2Ugb3IgdGhlIGVycm9yIHRocm93biBieSB0aGUgc2VydmljZVxuICogQHBhcmFtIHJlcXVlc3REYXRhIHRoZSBIVFRQIHJlcXVlc3QgaW5mb3JtYXRpb24gc3VjaCBhcyB0aGUgbWV0aG9kIGFuZCB0aGUgdXJsLlxuICovXG4vLyBJZiBleHRlbmQgZnJvbSBFcnJvciwgYGRzZSBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3JgIHJldHVybnMgZmFsc2Vcbi8vIGluIHNvbWUgKGFsbD8pIHVuaXQgdGVzdHMgc28gZG9uJ3QgYm90aGVyIHRyeWluZy5cbmV4cG9ydCBjbGFzcyBEYXRhU2VydmljZUVycm9yIHtcbiAgbWVzc2FnZTogc3RyaW5nIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXJyb3I6IGFueSwgcHVibGljIHJlcXVlc3REYXRhOiBSZXF1ZXN0RGF0YSB8IG51bGwpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSB0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnID8gZXJyb3IgOiBleHRyYWN0TWVzc2FnZShlcnJvcik7XG4gIH1cbn1cblxuLy8gTWFueSB3YXlzIHRoZSBlcnJvciBjYW4gYmUgc2hhcGVkLiBUaGVzZSBhcmUgdGhlIHdheXMgd2UgcmVjb2duaXplLlxuZnVuY3Rpb24gZXh0cmFjdE1lc3NhZ2Uoc291cmNlRXJyb3I6IGFueSk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCB7IGVycm9yLCBib2R5LCBtZXNzYWdlIH0gPSBzb3VyY2VFcnJvcjtcbiAgbGV0IGVyck1lc3NhZ2U6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBpZiAoZXJyb3IpIHtcbiAgICAvLyBwcmVmZXIgSHR0cEVycm9yUmVzcG9uc2UuZXJyb3IgdG8gaXRzIG1lc3NhZ2UgcHJvcGVydHlcbiAgICBlcnJNZXNzYWdlID0gdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IGVycm9yIDogZXJyb3IubWVzc2FnZTtcbiAgfSBlbHNlIGlmIChtZXNzYWdlKSB7XG4gICAgZXJyTWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAoYm9keSkge1xuICAgIC8vIHRyeSB0aGUgYm9keSBpZiBubyBlcnJvciBvciBtZXNzYWdlIHByb3BlcnR5XG4gICAgZXJyTWVzc2FnZSA9IHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJyA/IGJvZHkgOiBib2R5LmVycm9yO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBlcnJNZXNzYWdlID09PSAnc3RyaW5nJ1xuICAgID8gZXJyTWVzc2FnZVxuICAgIDogZXJyTWVzc2FnZVxuICAgICAgPyBKU09OLnN0cmluZ2lmeShlcnJNZXNzYWdlKVxuICAgICAgOiBudWxsO1xufVxuXG4vKiogUGF5bG9hZCBmb3IgYW4gRW50aXR5QWN0aW9uIGRhdGEgc2VydmljZSBlcnJvciBzdWNoIGFzIFFVRVJZX0FMTF9FUlJPUiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yIHtcbiAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3I7XG4gIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb247XG59XG4iXX0=