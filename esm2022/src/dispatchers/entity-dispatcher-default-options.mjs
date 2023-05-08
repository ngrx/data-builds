import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
class EntityDispatcherDefaultOptions {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDispatcherDefaultOptions, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDispatcherDefaultOptions }); }
}
export { EntityDispatcherDefaultOptions };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDispatcherDefaultOptions, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFDM0M7Ozs7Ozs7R0FPRztBQUNILE1BQ2EsOEJBQThCO0lBRDNDO1FBRUUsdUZBQXVGO1FBQ3ZGLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLHlGQUF5RjtRQUN6RixxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDeEIseUZBQXlGO1FBQ3pGLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUN6Qix3RkFBd0Y7UUFDeEYscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLGlIQUFpSDtRQUNqSCwyQkFBc0IsR0FBRyxLQUFLLENBQUM7S0FDaEM7aUlBWFksOEJBQThCO3FJQUE5Qiw4QkFBOEI7O1NBQTlCLDhCQUE4QjsyRkFBOUIsOEJBQThCO2tCQUQxQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMgZm9yIEVudGl0eURpc3BhdGNoZXIgYmVoYXZpb3JcbiAqIHN1Y2ggYXMgd2hldGhlciBgYWRkKClgIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWMgYnkgZGVmYXVsdC5cbiAqIEFuIG9wdGltaXN0aWMgc2F2ZSBtb2RpZmllcyB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseSBhbmQgYmVmb3JlIHNhdmluZyB0byB0aGUgc2VydmVyLlxuICogQSBwZXNzaW1pc3RpYyBzYXZlIG1vZGlmaWVzIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHRoZSBzZXJ2ZXIgY29uZmlybXMgdGhlIHNhdmUgd2FzIHN1Y2Nlc3NmdWwuXG4gKiBUaGlzIGNsYXNzIGluaXRpYWxpemVzIHRoZSBkZWZhdWx0cyB0byB0aGUgc2FmZXN0IHZhbHVlcy5cbiAqIFByb3ZpZGUgYW4gYWx0ZXJuYXRpdmUgdG8gY2hhbmdlIHRoZSBkZWZhdWx0cyBmb3IgYWxsIGVudGl0eSBjb2xsZWN0aW9ucy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUcnVlIGlmIGFkZGVkIGVudGl0aWVzIGFyZSBzYXZlZCBvcHRpbWlzdGljYWxseTsgZmFsc2UgaWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LiAqL1xuICBvcHRpbWlzdGljQWRkID0gZmFsc2U7XG4gIC8qKiBUcnVlIGlmIGRlbGV0ZWQgZW50aXRpZXMgYXJlIHNhdmVkIG9wdGltaXN0aWNhbGx5OyBmYWxzZSBpZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHkuICovXG4gIG9wdGltaXN0aWNEZWxldGUgPSB0cnVlO1xuICAvKiogVHJ1ZSBpZiB1cGRhdGVkIGVudGl0aWVzIGFyZSBzYXZlZCBvcHRpbWlzdGljYWxseTsgZmFsc2UgaWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LiAqL1xuICBvcHRpbWlzdGljVXBkYXRlID0gZmFsc2U7XG4gIC8qKiBUcnVlIGlmIHVwc2VydCBlbnRpdGllcyBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY1Vwc2VydCA9IGZhbHNlO1xuICAvKiogVHJ1ZSBpZiBlbnRpdGllcyBpbiBhIGNhY2hlIHNhdmVFbnRpdGllcyByZXF1ZXN0IGFyZSBzYXZlZCBvcHRpbWlzdGljYWxseTsgZmFsc2UgaWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LiAqL1xuICBvcHRpbWlzdGljU2F2ZUVudGl0aWVzID0gZmFsc2U7XG59XG4iXX0=