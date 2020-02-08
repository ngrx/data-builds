(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/update-response-data", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXJlc3BvbnNlLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGF0YSByZXR1cm5lZCBpbiBhbiBFbnRpdHlBY3Rpb24gZnJvbSB0aGUgRW50aXR5RWZmZWN0cyBmb3IgU0FWRV9VUERBVEVfT05FX1NVQ0NFU1MuXG4gKiBFZmZlY3RpdmVseSBleHRlbmRzIFVwZGF0ZTxUPiB3aXRoIGEgJ2NoYW5nZWQnIGZsYWcuXG4gKiBUaGUgaXMgdHJ1ZSBpZiB0aGUgc2VydmVyIHNlbnQgYmFjayBjaGFuZ2VzIHRvIHRoZSBlbnRpdHkgZGF0YSBhZnRlciB1cGRhdGUuXG4gKiBTdWNoIGNoYW5nZXMgbXVzdCBiZSBpbiB0aGUgZW50aXR5IGRhdGEgaW4gY2hhbmdlcyBwcm9wZXJ0eS5cbiAqIERlZmF1bHQgaXMgZmFsc2UgKHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YTsgYXNzdW1lIGl0IGNoYW5nZWQgbm90aGluZykuXG4gKiBTZWUgRW50aXR5RWZmZWN0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVSZXNwb25zZURhdGE8VD4ge1xuICAvKiogT3JpZ2luYWwga2V5IChpZCkgb2YgdGhlIGVudGl0eSAqL1xuICBpZDogbnVtYmVyIHwgc3RyaW5nO1xuICAvKiogRW50aXR5IHVwZGF0ZSBkYXRhLiBTaG91bGQgaW5jbHVkZSB0aGUga2V5IChvcmlnaW5hbCBvciBjaGFuZ2VkKSAqL1xuICBjaGFuZ2VzOiBQYXJ0aWFsPFQ+O1xuICAvKipcbiAgICogV2hldGhlciB0aGUgc2VydmVyIG1hZGUgYWRkaXRpb25hbCBjaGFuZ2VzIGFmdGVyIHByb2Nlc3NpbmcgdGhlIHVwZGF0ZS5cbiAgICogU3VjaCBhZGRpdGlvbmFsIGNoYW5nZXMgc2hvdWxkIGJlIGluIHRoZSAnY2hhbmdlcycgb2JqZWN0LlxuICAgKiBEZWZhdWx0IGlzIGZhbHNlXG4gICAqL1xuICBjaGFuZ2VkPzogYm9vbGVhbjtcbn1cbiJdfQ==