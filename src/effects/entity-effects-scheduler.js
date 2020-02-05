(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/effects/entity-effects-scheduler", ["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular/core");
    // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
    /** Token to inject a special RxJS Scheduler during marble tests. */
    exports.ENTITY_EFFECTS_SCHEDULER = new core_1.InjectionToken('EntityEffects Scheduler');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lZmZlY3RzL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLHdDQUErQztJQUcvQywwRUFBMEU7SUFDMUUsb0VBQW9FO0lBQ3ZELFFBQUEsd0JBQXdCLEdBQUcsSUFBSSxxQkFBYyxDQUN4RCx5QkFBeUIsQ0FDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAncnhqcyc7XG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4vKiogVG9rZW4gdG8gaW5qZWN0IGEgc3BlY2lhbCBSeEpTIFNjaGVkdWxlciBkdXJpbmcgbWFyYmxlIHRlc3RzLiAqL1xuZXhwb3J0IGNvbnN0IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTY2hlZHVsZXJMaWtlPihcbiAgJ0VudGl0eUVmZmVjdHMgU2NoZWR1bGVyJ1xuKTtcbiJdfQ==