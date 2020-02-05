(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/constants", ["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular/core");
    exports.ENTITY_CACHE_NAME = 'entityCache';
    exports.ENTITY_CACHE_NAME_TOKEN = new core_1.InjectionToken('@ngrx/data/entity-cache-name');
    exports.ENTITY_CACHE_META_REDUCERS = new core_1.InjectionToken('@ngrx/data/entity-cache-meta-reducers');
    exports.ENTITY_COLLECTION_META_REDUCERS = new core_1.InjectionToken('@ngrx/data/entity-collection-meta-reducers');
    exports.INITIAL_ENTITY_CACHE_STATE = new core_1.InjectionToken('@ngrx/data/initial-entity-cache-state');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9yZWR1Y2Vycy9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBK0M7SUFJbEMsUUFBQSxpQkFBaUIsR0FBRyxhQUFhLENBQUM7SUFDbEMsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLHFCQUFjLENBQ3ZELDhCQUE4QixDQUMvQixDQUFDO0lBRVcsUUFBQSwwQkFBMEIsR0FBRyxJQUFJLHFCQUFjLENBRTFELHVDQUF1QyxDQUFDLENBQUM7SUFDOUIsUUFBQSwrQkFBK0IsR0FBRyxJQUFJLHFCQUFjLENBRS9ELDRDQUE0QyxDQUFDLENBQUM7SUFFbkMsUUFBQSwwQkFBMEIsR0FBRyxJQUFJLHFCQUFjLENBRTFELHVDQUF1QyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWV0YVJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vZW50aXR5LWNhY2hlJztcblxuZXhwb3J0IGNvbnN0IEVOVElUWV9DQUNIRV9OQU1FID0gJ2VudGl0eUNhY2hlJztcbmV4cG9ydCBjb25zdCBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KFxuICAnQG5ncngvZGF0YS9lbnRpdHktY2FjaGUtbmFtZSdcbik7XG5cbmV4cG9ydCBjb25zdCBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxcbiAgTWV0YVJlZHVjZXI8YW55LCBhbnk+W11cbj4oJ0BuZ3J4L2RhdGEvZW50aXR5LWNhY2hlLW1ldGEtcmVkdWNlcnMnKTtcbmV4cG9ydCBjb25zdCBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTID0gbmV3IEluamVjdGlvblRva2VuPFxuICBNZXRhUmVkdWNlcjxhbnksIGFueT5bXVxuPignQG5ncngvZGF0YS9lbnRpdHktY29sbGVjdGlvbi1tZXRhLXJlZHVjZXJzJyk7XG5cbmV4cG9ydCBjb25zdCBJTklUSUFMX0VOVElUWV9DQUNIRV9TVEFURSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxcbiAgRW50aXR5Q2FjaGUgfCAoKCkgPT4gRW50aXR5Q2FjaGUpXG4+KCdAbmdyeC9kYXRhL2luaXRpYWwtZW50aXR5LWNhY2hlLXN0YXRlJyk7XG4iXX0=