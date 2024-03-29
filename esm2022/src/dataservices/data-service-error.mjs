/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
export class DataServiceError extends Error {
    constructor(error, requestData) {
        super(typeof error === 'string' ? error : extractMessage(error) ?? undefined);
        this.error = error;
        this.requestData = requestData;
        this.name = this.constructor.name;
    }
}
// Many ways the error can be shaped. These are the ways we recognize.
function extractMessage(sourceError) {
    const { error, body, message } = sourceError;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zZXJ2aWNlLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLGdCQUFpQixTQUFRLEtBQUs7SUFDekMsWUFBbUIsS0FBVSxFQUFTLFdBQStCO1FBQ25FLEtBQUssQ0FDSCxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FDdkUsQ0FBQztRQUhlLFVBQUssR0FBTCxLQUFLLENBQUs7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFJbkUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUNwQyxDQUFDO0NBQ0Y7QUFFRCxzRUFBc0U7QUFDdEUsU0FBUyxjQUFjLENBQUMsV0FBZ0I7SUFDdEMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVyxDQUFDO0lBQzdDLElBQUksVUFBVSxHQUFrQixJQUFJLENBQUM7SUFDckMsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUNWLHlEQUF5RDtRQUN6RCxVQUFVLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDakUsQ0FBQztTQUFNLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbkIsVUFBVSxHQUFHLE9BQU8sQ0FBQztJQUN2QixDQUFDO1NBQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNoQiwrQ0FBK0M7UUFDL0MsVUFBVSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzVELENBQUM7SUFFRCxPQUFPLE9BQU8sVUFBVSxLQUFLLFFBQVE7UUFDbkMsQ0FBQyxDQUFDLFVBQVU7UUFDWixDQUFDLENBQUMsVUFBVTtZQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBSZXF1ZXN0RGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRXJyb3IgZnJvbSBhIERhdGFTZXJ2aWNlXG4gKiBUaGUgc291cmNlIGVycm9yIGVpdGhlciBjb21lcyBmcm9tIGEgZmFpbGVkIEhUVFAgcmVzcG9uc2Ugb3Igd2FzIHRocm93biB3aXRoaW4gdGhlIHNlcnZpY2UuXG4gKiBAcGFyYW0gZXJyb3IgdGhlIEh0dHBFcnJvclJlc3BvbnNlIG9yIHRoZSBlcnJvciB0aHJvd24gYnkgdGhlIHNlcnZpY2VcbiAqIEBwYXJhbSByZXF1ZXN0RGF0YSB0aGUgSFRUUCByZXF1ZXN0IGluZm9ybWF0aW9uIHN1Y2ggYXMgdGhlIG1ldGhvZCBhbmQgdGhlIHVybC5cbiAqL1xuZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlcnJvcjogYW55LCBwdWJsaWMgcmVxdWVzdERhdGE6IFJlcXVlc3REYXRhIHwgbnVsbCkge1xuICAgIHN1cGVyKFxuICAgICAgdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IGVycm9yIDogZXh0cmFjdE1lc3NhZ2UoZXJyb3IpID8/IHVuZGVmaW5lZFxuICAgICk7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG59XG5cbi8vIE1hbnkgd2F5cyB0aGUgZXJyb3IgY2FuIGJlIHNoYXBlZC4gVGhlc2UgYXJlIHRoZSB3YXlzIHdlIHJlY29nbml6ZS5cbmZ1bmN0aW9uIGV4dHJhY3RNZXNzYWdlKHNvdXJjZUVycm9yOiBhbnkpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgeyBlcnJvciwgYm9keSwgbWVzc2FnZSB9ID0gc291cmNlRXJyb3I7XG4gIGxldCBlcnJNZXNzYWdlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgaWYgKGVycm9yKSB7XG4gICAgLy8gcHJlZmVyIEh0dHBFcnJvclJlc3BvbnNlLmVycm9yIHRvIGl0cyBtZXNzYWdlIHByb3BlcnR5XG4gICAgZXJyTWVzc2FnZSA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBlcnJvciA6IGVycm9yLm1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAobWVzc2FnZSkge1xuICAgIGVyck1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9IGVsc2UgaWYgKGJvZHkpIHtcbiAgICAvLyB0cnkgdGhlIGJvZHkgaWYgbm8gZXJyb3Igb3IgbWVzc2FnZSBwcm9wZXJ0eVxuICAgIGVyck1lc3NhZ2UgPSB0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycgPyBib2R5IDogYm9keS5lcnJvcjtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2YgZXJyTWVzc2FnZSA9PT0gJ3N0cmluZydcbiAgICA/IGVyck1lc3NhZ2VcbiAgICA6IGVyck1lc3NhZ2VcbiAgICA/IEpTT04uc3RyaW5naWZ5KGVyck1lc3NhZ2UpXG4gICAgOiBudWxsO1xufVxuXG4vKiogUGF5bG9hZCBmb3IgYW4gRW50aXR5QWN0aW9uIGRhdGEgc2VydmljZSBlcnJvciBzdWNoIGFzIFFVRVJZX0FMTF9FUlJPUiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yIHtcbiAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3I7XG4gIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb247XG59XG4iXX0=