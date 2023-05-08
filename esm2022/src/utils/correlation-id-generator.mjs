import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Generates a string id beginning 'CRID',
 * followed by a monotonically increasing integer for use as a correlation id.
 * As they are produced locally by a singleton service,
 * these ids are guaranteed to be unique only
 * for the duration of a single client browser instance.
 * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
 * Do NOT use for entity keys.
 */
class CorrelationIdGenerator {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CorrelationIdGenerator, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CorrelationIdGenerator }); }
}
export { CorrelationIdGenerator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CorrelationIdGenerator, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0M7Ozs7Ozs7O0dBUUc7QUFDSCxNQUNhLHNCQUFzQjtJQURuQztRQUVFLHVCQUF1QjtRQUNiLFNBQUksR0FBRyxDQUFDLENBQUM7UUFDbkIsK0JBQStCO1FBQ3JCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FNM0I7SUFMQyxxQ0FBcUM7SUFDckMsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDakMsQ0FBQztpSUFUVSxzQkFBc0I7cUlBQXRCLHNCQUFzQjs7U0FBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBRGxDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgc3RyaW5nIGlkIGJlZ2lubmluZyAnQ1JJRCcsXG4gKiBmb2xsb3dlZCBieSBhIG1vbm90b25pY2FsbHkgaW5jcmVhc2luZyBpbnRlZ2VyIGZvciB1c2UgYXMgYSBjb3JyZWxhdGlvbiBpZC5cbiAqIEFzIHRoZXkgYXJlIHByb2R1Y2VkIGxvY2FsbHkgYnkgYSBzaW5nbGV0b24gc2VydmljZSxcbiAqIHRoZXNlIGlkcyBhcmUgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUgb25seVxuICogZm9yIHRoZSBkdXJhdGlvbiBvZiBhIHNpbmdsZSBjbGllbnQgYnJvd3NlciBpbnN0YW5jZS5cbiAqIE5ncnggZW50aXR5IGRpc3BhdGNoZXIgcXVlcnkgYW5kIHNhdmUgbWV0aG9kcyBjYWxsIHRoaXMgc2VydmljZSB0byBnZW5lcmF0ZSBkZWZhdWx0IGNvcnJlbGF0aW9uIGlkcy5cbiAqIERvIE5PVCB1c2UgZm9yIGVudGl0eSBrZXlzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB7XG4gIC8qKiBTZWVkIGZvciB0aGUgaWRzICovXG4gIHByb3RlY3RlZCBzZWVkID0gMDtcbiAgLyoqIFByZWZpeCBvZiB0aGUgaWQsICdDUklEOyAqL1xuICBwcm90ZWN0ZWQgcHJlZml4ID0gJ0NSSUQnO1xuICAvKiogUmV0dXJuIHRoZSBuZXh0IGNvcnJlbGF0aW9uIGlkICovXG4gIG5leHQoKSB7XG4gICAgdGhpcy5zZWVkICs9IDE7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5zZWVkO1xuICB9XG59XG4iXX0=