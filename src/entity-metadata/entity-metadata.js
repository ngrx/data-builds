(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-metadata/entity-metadata", ["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular/core");
    exports.ENTITY_METADATA_TOKEN = new core_1.InjectionToken('@ngrx/data/entity-metadata');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW1ldGFkYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsd0NBQStDO0lBT2xDLFFBQUEscUJBQXFCLEdBQUcsSUFBSSxxQkFBYyxDQUNyRCw0QkFBNEIsQ0FDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElkU2VsZWN0b3IsIENvbXBhcmVyIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IEVudGl0eUZpbHRlckZuIH0gZnJvbSAnLi9lbnRpdHktZmlsdGVycyc7XG5cbmV4cG9ydCBjb25zdCBFTlRJVFlfTUVUQURBVEFfVE9LRU4gPSBuZXcgSW5qZWN0aW9uVG9rZW48RW50aXR5TWV0YWRhdGFNYXA+KFxuICAnQG5ncngvZGF0YS9lbnRpdHktbWV0YWRhdGEnXG4pO1xuXG4vKiogTWV0YWRhdGEgdGhhdCBkZXNjcmliZSBhbiBlbnRpdHkgdHlwZSBhbmQgaXRzIGNvbGxlY3Rpb24gdG8gQG5ncngvZGF0YSAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlNZXRhZGF0YTxUID0gYW55LCBTIGV4dGVuZHMgb2JqZWN0ID0ge30+IHtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdHlEaXNwYXRjaGVyT3B0aW9ucz86IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPjtcbiAgZmlsdGVyRm4/OiBFbnRpdHlGaWx0ZXJGbjxUPjtcbiAgbm9DaGFuZ2VUcmFja2luZz86IGJvb2xlYW47XG4gIHNlbGVjdElkPzogSWRTZWxlY3RvcjxUPjtcbiAgc29ydENvbXBhcmVyPzogZmFsc2UgfCBDb21wYXJlcjxUPjtcbiAgYWRkaXRpb25hbENvbGxlY3Rpb25TdGF0ZT86IFM7XG59XG5cbi8qKiBNYXAgZW50aXR5LXR5cGUgbmFtZSB0byBpdHMgRW50aXR5TWV0YWRhdGEgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5TWV0YWRhdGFNYXAge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogUGFydGlhbDxFbnRpdHlNZXRhZGF0YTxhbnk+Pjtcbn1cbiJdfQ==