(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dispatchers/entity-dispatcher-default-options", ["require", "exports", "tslib", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    /**
     * Default options for EntityDispatcher behavior
     * such as whether `add()` is optimistic or pessimistic by default.
     * An optimistic save modifies the collection immediately and before saving to the server.
     * A pessimistic save modifies the collection after the server confirms the save was successful.
     * This class initializes the defaults to the safest values.
     * Provide an alternative to change the defaults for all entity collections.
     */
    let EntityDispatcherDefaultOptions = class EntityDispatcherDefaultOptions {
        constructor() {
            /** True if added entities are saved optimistically; false if saved pessimistically. */
            this.optimisticAdd = false;
            /** True if deleted entities are saved optimistically; false if saved pessimistically. */
            this.optimisticDelete = true;
            /** True if updated entities are saved optimistically; false if saved pessimistically. */
            this.optimisticUpdate = false;
            /** True if upsert entities are saved optimistically; false if saved pessimistically. */
            this.optimisticUpsert = false;
            /** True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically. */
            this.optimisticSaveEntities = false;
        }
    };
    EntityDispatcherDefaultOptions = tslib_1.__decorate([
        core_1.Injectable()
    ], EntityDispatcherDefaultOptions);
    exports.EntityDispatcherDefaultOptions = EntityDispatcherDefaultOptions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTJDO0lBQzNDOzs7Ozs7O09BT0c7SUFFSCxJQUFhLDhCQUE4QixHQUEzQyxNQUFhLDhCQUE4QjtRQUEzQztZQUNFLHVGQUF1RjtZQUN2RixrQkFBYSxHQUFHLEtBQUssQ0FBQztZQUN0Qix5RkFBeUY7WUFDekYscUJBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLHlGQUF5RjtZQUN6RixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDekIsd0ZBQXdGO1lBQ3hGLHFCQUFnQixHQUFHLEtBQUssQ0FBQztZQUN6QixpSEFBaUg7WUFDakgsMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLENBQUM7S0FBQSxDQUFBO0lBWFksOEJBQThCO1FBRDFDLGlCQUFVLEVBQUU7T0FDQSw4QkFBOEIsQ0FXMUM7SUFYWSx3RUFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgRW50aXR5RGlzcGF0Y2hlciBiZWhhdmlvclxuICogc3VjaCBhcyB3aGV0aGVyIGBhZGQoKWAgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYyBieSBkZWZhdWx0LlxuICogQW4gb3B0aW1pc3RpYyBzYXZlIG1vZGlmaWVzIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5IGFuZCBiZWZvcmUgc2F2aW5nIHRvIHRoZSBzZXJ2ZXIuXG4gKiBBIHBlc3NpbWlzdGljIHNhdmUgbW9kaWZpZXMgdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgdGhlIHNlcnZlciBjb25maXJtcyB0aGUgc2F2ZSB3YXMgc3VjY2Vzc2Z1bC5cbiAqIFRoaXMgY2xhc3MgaW5pdGlhbGl6ZXMgdGhlIGRlZmF1bHRzIHRvIHRoZSBzYWZlc3QgdmFsdWVzLlxuICogUHJvdmlkZSBhbiBhbHRlcm5hdGl2ZSB0byBjaGFuZ2UgdGhlIGRlZmF1bHRzIGZvciBhbGwgZW50aXR5IGNvbGxlY3Rpb25zLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFRydWUgaWYgYWRkZWQgZW50aXRpZXMgYXJlIHNhdmVkIG9wdGltaXN0aWNhbGx5OyBmYWxzZSBpZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHkuICovXG4gIG9wdGltaXN0aWNBZGQgPSBmYWxzZTtcbiAgLyoqIFRydWUgaWYgZGVsZXRlZCBlbnRpdGllcyBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY0RlbGV0ZSA9IHRydWU7XG4gIC8qKiBUcnVlIGlmIHVwZGF0ZWQgZW50aXRpZXMgYXJlIHNhdmVkIG9wdGltaXN0aWNhbGx5OyBmYWxzZSBpZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHkuICovXG4gIG9wdGltaXN0aWNVcGRhdGUgPSBmYWxzZTtcbiAgLyoqIFRydWUgaWYgdXBzZXJ0IGVudGl0aWVzIGFyZSBzYXZlZCBvcHRpbWlzdGljYWxseTsgZmFsc2UgaWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LiAqL1xuICBvcHRpbWlzdGljVXBzZXJ0ID0gZmFsc2U7XG4gIC8qKiBUcnVlIGlmIGVudGl0aWVzIGluIGEgY2FjaGUgc2F2ZUVudGl0aWVzIHJlcXVlc3QgYXJlIHNhdmVkIG9wdGltaXN0aWNhbGx5OyBmYWxzZSBpZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHkuICovXG4gIG9wdGltaXN0aWNTYXZlRW50aXRpZXMgPSBmYWxzZTtcbn1cbiJdfQ==