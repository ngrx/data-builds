(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/entity-cache", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9yZWR1Y2Vycy9lbnRpdHktY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDYWNoZSB7XG4gIC8vIE11c3QgYmUgYGFueWAgc2luY2Ugd2UgZG9uJ3Qga25vdyB3aGF0IHR5cGUgb2YgY29sbGVjdGlvbnMgd2Ugd2lsbCBoYXZlXG4gIFtuYW1lOiBzdHJpbmddOiBFbnRpdHlDb2xsZWN0aW9uPGFueT47XG59XG4iXX0=