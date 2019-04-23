(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/schematics/ng-add/schema", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NjaGVtYXRpY3MvbmctYWRkL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBTY2hlbWEge1xuICBwYXRoPzogc3RyaW5nO1xuICBlZmZlY3RzPzogYm9vbGVhbjtcbiAgc2tpcFBhY2thZ2VKc29uPzogYm9vbGVhbjtcbiAgcHJvamVjdD86IHN0cmluZztcbiAgbW9kdWxlPzogc3RyaW5nO1xuICBtaWdyYXRlTmdyeERhdGE/OiBib29sZWFuO1xufVxuIl19