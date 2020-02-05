(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/selectors/entity-cache-selector", ["require", "exports", "@angular/core", "@ngrx/store", "@ngrx/data/src/reducers/constants"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular/core");
    const store_1 = require("@ngrx/store");
    const constants_1 = require("@ngrx/data/src/reducers/constants");
    exports.ENTITY_CACHE_SELECTOR_TOKEN = new core_1.InjectionToken('@ngrx/data/entity-cache-selector');
    exports.entityCacheSelectorProvider = {
        provide: exports.ENTITY_CACHE_SELECTOR_TOKEN,
        useFactory: createEntityCacheSelector,
        deps: [[new core_1.Optional(), constants_1.ENTITY_CACHE_NAME_TOKEN]],
    };
    function createEntityCacheSelector(entityCacheName) {
        entityCacheName = entityCacheName || constants_1.ENTITY_CACHE_NAME;
        return store_1.createFeatureSelector(entityCacheName);
    }
    exports.createEntityCacheSelector = createEntityCacheSelector;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXNlbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTBFO0lBQzFFLHVDQUFzRTtJQUV0RSxpRUFHK0I7SUFFbEIsUUFBQSwyQkFBMkIsR0FBRyxJQUFJLHFCQUFjLENBRTNELGtDQUFrQyxDQUFDLENBQUM7SUFFekIsUUFBQSwyQkFBMkIsR0FBb0I7UUFDMUQsT0FBTyxFQUFFLG1DQUEyQjtRQUNwQyxVQUFVLEVBQUUseUJBQXlCO1FBQ3JDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRSxtQ0FBdUIsQ0FBQyxDQUFDO0tBQ2xELENBQUM7SUFJRixTQUFnQix5QkFBeUIsQ0FDdkMsZUFBd0I7UUFFeEIsZUFBZSxHQUFHLGVBQWUsSUFBSSw2QkFBaUIsQ0FBQztRQUN2RCxPQUFPLDZCQUFxQixDQUFjLGVBQWUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFMRCw4REFLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuLCBPcHRpb25hbCwgRmFjdG9yeVByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjcmVhdGVGZWF0dXJlU2VsZWN0b3IsIE1lbW9pemVkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfTkFNRSxcbiAgRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4sXG59IGZyb20gJy4uL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjb25zdCBFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4gPSBuZXcgSW5qZWN0aW9uVG9rZW48XG4gIE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBFbnRpdHlDYWNoZT5cbj4oJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlLXNlbGVjdG9yJyk7XG5cbmV4cG9ydCBjb25zdCBlbnRpdHlDYWNoZVNlbGVjdG9yUHJvdmlkZXI6IEZhY3RvcnlQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOLFxuICB1c2VGYWN0b3J5OiBjcmVhdGVFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTl1dLFxufTtcblxuZXhwb3J0IHR5cGUgRW50aXR5Q2FjaGVTZWxlY3RvciA9IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBFbnRpdHlDYWNoZT47XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlDYWNoZVNlbGVjdG9yKFxuICBlbnRpdHlDYWNoZU5hbWU/OiBzdHJpbmdcbik6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBFbnRpdHlDYWNoZT4ge1xuICBlbnRpdHlDYWNoZU5hbWUgPSBlbnRpdHlDYWNoZU5hbWUgfHwgRU5USVRZX0NBQ0hFX05BTUU7XG4gIHJldHVybiBjcmVhdGVGZWF0dXJlU2VsZWN0b3I8RW50aXR5Q2FjaGU+KGVudGl0eUNhY2hlTmFtZSk7XG59XG4iXX0=