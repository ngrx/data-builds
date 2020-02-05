(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/entity-collection", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Types of change in a ChangeState instance */
    var ChangeType;
    (function (ChangeType) {
        /** The entity has not changed from its last known server state. */
        ChangeType[ChangeType["Unchanged"] = 0] = "Unchanged";
        /** The entity was added to the collection */
        ChangeType[ChangeType["Added"] = 1] = "Added";
        /** The entity is scheduled for delete and was removed from the collection */
        ChangeType[ChangeType["Deleted"] = 2] = "Deleted";
        /** The entity in the collection was updated */
        ChangeType[ChangeType["Updated"] = 3] = "Updated";
    })(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUEsZ0RBQWdEO0lBQ2hELElBQVksVUFTWDtJQVRELFdBQVksVUFBVTtRQUNwQixtRUFBbUU7UUFDbkUscURBQWEsQ0FBQTtRQUNiLDZDQUE2QztRQUM3Qyw2Q0FBSyxDQUFBO1FBQ0wsNkVBQTZFO1FBQzdFLGlEQUFPLENBQUE7UUFDUCwrQ0FBK0M7UUFDL0MsaURBQU8sQ0FBQTtJQUNULENBQUMsRUFUVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQVNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eVN0YXRlLCBEaWN0aW9uYXJ5IH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuLyoqIFR5cGVzIG9mIGNoYW5nZSBpbiBhIENoYW5nZVN0YXRlIGluc3RhbmNlICovXG5leHBvcnQgZW51bSBDaGFuZ2VUeXBlIHtcbiAgLyoqIFRoZSBlbnRpdHkgaGFzIG5vdCBjaGFuZ2VkIGZyb20gaXRzIGxhc3Qga25vd24gc2VydmVyIHN0YXRlLiAqL1xuICBVbmNoYW5nZWQgPSAwLFxuICAvKiogVGhlIGVudGl0eSB3YXMgYWRkZWQgdG8gdGhlIGNvbGxlY3Rpb24gKi9cbiAgQWRkZWQsXG4gIC8qKiBUaGUgZW50aXR5IGlzIHNjaGVkdWxlZCBmb3IgZGVsZXRlIGFuZCB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uICovXG4gIERlbGV0ZWQsXG4gIC8qKiBUaGUgZW50aXR5IGluIHRoZSBjb2xsZWN0aW9uIHdhcyB1cGRhdGVkICovXG4gIFVwZGF0ZWQsXG59XG5cbi8qKlxuICogQ2hhbmdlIHN0YXRlIGZvciBhbiBlbnRpdHkgd2l0aCB1bnNhdmVkIGNoYW5nZXM7XG4gKiBhbiBlbnRyeSBpbiBhbiBFbnRpdHlDb2xsZWN0aW9uLmNoYW5nZVN0YXRlIG1hcFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVN0YXRlPFQ+IHtcbiAgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZTtcbiAgb3JpZ2luYWxWYWx1ZT86IFQgfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogTWFwIG9mIGVudGl0eSBwcmltYXJ5IGtleXMgdG8gZW50aXR5IENoYW5nZVN0YXRlcy5cbiAqIEVhY2ggZW50cnkgcmVwcmVzZW50cyBhbiBlbnRpdHkgd2l0aCB1bnNhdmVkIGNoYW5nZXMuXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5nZVN0YXRlTWFwPFQ+ID0gRGljdGlvbmFyeTxDaGFuZ2VTdGF0ZTxUPj47XG5cbi8qKlxuICogRGF0YSBhbmQgaW5mb3JtYXRpb24gYWJvdXQgYSBjb2xsZWN0aW9uIG9mIGVudGl0aWVzIG9mIGEgc2luZ2xlIHR5cGUuXG4gKiBFbnRpdHlDb2xsZWN0aW9ucyBhcmUgbWFpbnRhaW5lZCBpbiB0aGUgRW50aXR5Q2FjaGUgd2l0aGluIHRoZSBuZ3J4IHN0b3JlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb248VCA9IGFueT4gZXh0ZW5kcyBFbnRpdHlTdGF0ZTxUPiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3IgdGhpcyBjb2xsZWN0aW9uICovXG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgLyoqIEEgbWFwIG9mIENoYW5nZVN0YXRlcywga2V5ZWQgYnkgaWQsIGZvciBlbnRpdGllcyB3aXRoIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICBjaGFuZ2VTdGF0ZTogQ2hhbmdlU3RhdGVNYXA8VD47XG4gIC8qKiBUaGUgdXNlcidzIGN1cnJlbnQgY29sbGVjdGlvbiBmaWx0ZXIgcGF0dGVybiAqL1xuICBmaWx0ZXI/OiBzdHJpbmc7XG4gIC8qKiB0cnVlIGlmIGNvbGxlY3Rpb24gd2FzIGV2ZXIgZmlsbGVkIGJ5IFF1ZXJ5QWxsOyBmb3JjZWQgZmFsc2UgaWYgY2xlYXJlZCAqL1xuICBsb2FkZWQ6IGJvb2xlYW47XG4gIC8qKiB0cnVlIHdoZW4gYSBxdWVyeSBvciBzYXZlIG9wZXJhdGlvbiBpcyBpbiBwcm9ncmVzcyAqL1xuICBsb2FkaW5nOiBib29sZWFuO1xufVxuIl19