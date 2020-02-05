(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/utils/correlation-id-generator", ["require", "exports", "tslib", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    /**
     * Generates a string id beginning 'CRID',
     * followed by a monotonically increasing integer for use as a correlation id.
     * As they are produced locally by a singleton service,
     * these ids are guaranteed to be unique only
     * for the duration of a single client browser instance.
     * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
     * Do NOT use for entity keys.
     */
    let CorrelationIdGenerator = class CorrelationIdGenerator {
        constructor() {
            /** Seed for the ids */
            this.seed = 0;
            /** Prefix of the id, 'CRID; */
            this.prefix = 'CRID';
        }
        /** Return the next correlation id */
        next() {
            this.seed += 1;
            return this.prefix + this.seed;
        }
    };
    CorrelationIdGenerator = tslib_1.__decorate([
        core_1.Injectable()
    ], CorrelationIdGenerator);
    exports.CorrelationIdGenerator = CorrelationIdGenerator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTJDO0lBRTNDOzs7Ozs7OztPQVFHO0lBRUgsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7UUFBbkM7WUFDRSx1QkFBdUI7WUFDYixTQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLCtCQUErQjtZQUNyQixXQUFNLEdBQUcsTUFBTSxDQUFDO1FBTTVCLENBQUM7UUFMQyxxQ0FBcUM7UUFDckMsSUFBSTtZQUNGLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsQ0FBQztLQUNGLENBQUE7SUFWWSxzQkFBc0I7UUFEbEMsaUJBQVUsRUFBRTtPQUNBLHNCQUFzQixDQVVsQztJQVZZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgaWQgYmVnaW5uaW5nICdDUklEJyxcbiAqIGZvbGxvd2VkIGJ5IGEgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIGludGVnZXIgZm9yIHVzZSBhcyBhIGNvcnJlbGF0aW9uIGlkLlxuICogQXMgdGhleSBhcmUgcHJvZHVjZWQgbG9jYWxseSBieSBhIHNpbmdsZXRvbiBzZXJ2aWNlLFxuICogdGhlc2UgaWRzIGFyZSBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZSBvbmx5XG4gKiBmb3IgdGhlIGR1cmF0aW9uIG9mIGEgc2luZ2xlIGNsaWVudCBicm93c2VyIGluc3RhbmNlLlxuICogTmdyeCBlbnRpdHkgZGlzcGF0Y2hlciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzIGNhbGwgdGhpcyBzZXJ2aWNlIHRvIGdlbmVyYXRlIGRlZmF1bHQgY29ycmVsYXRpb24gaWRzLlxuICogRG8gTk9UIHVzZSBmb3IgZW50aXR5IGtleXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIHtcbiAgLyoqIFNlZWQgZm9yIHRoZSBpZHMgKi9cbiAgcHJvdGVjdGVkIHNlZWQgPSAwO1xuICAvKiogUHJlZml4IG9mIHRoZSBpZCwgJ0NSSUQ7ICovXG4gIHByb3RlY3RlZCBwcmVmaXggPSAnQ1JJRCc7XG4gIC8qKiBSZXR1cm4gdGhlIG5leHQgY29ycmVsYXRpb24gaWQgKi9cbiAgbmV4dCgpIHtcbiAgICB0aGlzLnNlZWQgKz0gMTtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnNlZWQ7XG4gIH1cbn1cbiJdfQ==