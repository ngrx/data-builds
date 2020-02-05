(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dataservices/default-data-service-config", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Optional configuration settings for an entity collection data service
     * such as the `DefaultDataService<T>`.
     */
    class DefaultDataServiceConfig {
    }
    exports.DefaultDataServiceConfig = DefaultDataServiceConfig;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUE7OztPQUdHO0lBQ0gsTUFBc0Isd0JBQXdCO0tBbUI3QztJQW5CRCw0REFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzIH0gZnJvbSAnLi9odHRwLXVybC1nZW5lcmF0b3InO1xuXG4vKipcbiAqIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uIGRhdGEgc2VydmljZVxuICogc3VjaCBhcyB0aGUgYERlZmF1bHREYXRhU2VydmljZTxUPmAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcge1xuICAvKipcbiAgICogcm9vdCBwYXRoIG9mIHRoZSB3ZWIgYXBpLiAgbWF5IGFsc28gaW5jbHVkZSBwcm90b2NvbCwgZG9tYWluLCBhbmQgcG9ydFxuICAgKiBmb3IgcmVtb3RlIGFwaSwgZS5nLjogYCdodHRwczovL2FwaS1kb21haW4uY29tOjgwMDAvYXBpL3YxJ2AgKGRlZmF1bHQ6ICdhcGknKVxuICAgKi9cbiAgcm9vdD86IHN0cmluZztcbiAgLyoqXG4gICAqIEtub3duIGVudGl0eSBIdHRwUmVzb3VyY2VVcmxzLlxuICAgKiBIdHRwVXJsR2VuZXJhdG9yIHdpbGwgY3JlYXRlIHRoZXNlIFVSTHMgZm9yIGVudGl0eSB0eXBlcyBub3QgbGlzdGVkIGhlcmUuXG4gICAqL1xuICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzPzogRW50aXR5SHR0cFJlc291cmNlVXJscztcbiAgLyoqIElzIGEgREVMRVRFIDQwNCByZWFsbHkgT0s/IChkZWZhdWx0OiB0cnVlKSAqL1xuICBkZWxldGU0MDRPSz86IGJvb2xlYW47XG4gIC8qKiBTaW11bGF0ZSBHRVQgbGF0ZW5jeSBpbiBhIGRlbW8gKGRlZmF1bHQ6IDApICovXG4gIGdldERlbGF5PzogbnVtYmVyO1xuICAvKiogU2ltdWxhdGUgc2F2ZSBtZXRob2QgKFBVVC9QT1NUL0RFTEVURSkgbGF0ZW5jeSBpbiBhIGRlbW8gKGRlZmF1bHQ6IDApICovXG4gIHNhdmVEZWxheT86IG51bWJlcjtcbiAgLyoqIHJlcXVlc3QgdGltZW91dCBpbiBNUyAoZGVmYXVsdDogMCkqL1xuICB0aW1lb3V0PzogbnVtYmVyOyAvL1xufVxuIl19