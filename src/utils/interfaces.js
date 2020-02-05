(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/utils/interfaces", ["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular/core");
    class Logger {
    }
    exports.Logger = Logger;
    exports.PLURAL_NAMES_TOKEN = new core_1.InjectionToken('@ngrx/data/plural-names');
    class Pluralizer {
    }
    exports.Pluralizer = Pluralizer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvdXRpbHMvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLHdDQUErQztJQUUvQyxNQUFzQixNQUFNO0tBSTNCO0lBSkQsd0JBSUM7SUFTWSxRQUFBLGtCQUFrQixHQUFHLElBQUkscUJBQWMsQ0FDbEQseUJBQXlCLENBQzFCLENBQUM7SUFFRixNQUFzQixVQUFVO0tBRS9CO0lBRkQsZ0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9nZ2VyIHtcbiAgYWJzdHJhY3QgZXJyb3IobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbiAgYWJzdHJhY3QgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XG4gIGFic3RyYWN0IHdhcm4obWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbn1cblxuLyoqXG4gKiBNYXBwaW5nIG9mIGVudGl0eSB0eXBlIG5hbWUgdG8gaXRzIHBsdXJhbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVBsdXJhbE5hbWVzIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFBMVVJBTF9OQU1FU19UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxFbnRpdHlQbHVyYWxOYW1lcz4oXG4gICdAbmdyeC9kYXRhL3BsdXJhbC1uYW1lcydcbik7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbHVyYWxpemVyIHtcbiAgYWJzdHJhY3QgcGx1cmFsaXplKG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cbiJdfQ==