import { Injectable } from '@angular/core';
/**
 * Generates a string id beginning 'CRID',
 * followed by a monotonically increasing integer for use as a correlation id.
 * As they are produced locally by a singleton service,
 * these ids are guaranteed to be unique only
 * for the duration of a single client browser instance.
 * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
 * Do NOT use for entity keys.
 */
export class CorrelationIdGenerator {
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
}
CorrelationIdGenerator.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQzs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sT0FBTyxzQkFBc0I7SUFEbkM7UUFFRSx1QkFBdUI7UUFDYixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLCtCQUErQjtRQUNyQixXQUFNLEdBQUcsTUFBTSxDQUFDO0lBTTVCLENBQUM7SUFMQyxxQ0FBcUM7SUFDckMsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDakMsQ0FBQzs7O1lBVkYsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgaWQgYmVnaW5uaW5nICdDUklEJyxcbiAqIGZvbGxvd2VkIGJ5IGEgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIGludGVnZXIgZm9yIHVzZSBhcyBhIGNvcnJlbGF0aW9uIGlkLlxuICogQXMgdGhleSBhcmUgcHJvZHVjZWQgbG9jYWxseSBieSBhIHNpbmdsZXRvbiBzZXJ2aWNlLFxuICogdGhlc2UgaWRzIGFyZSBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZSBvbmx5XG4gKiBmb3IgdGhlIGR1cmF0aW9uIG9mIGEgc2luZ2xlIGNsaWVudCBicm93c2VyIGluc3RhbmNlLlxuICogTmdyeCBlbnRpdHkgZGlzcGF0Y2hlciBxdWVyeSBhbmQgc2F2ZSBtZXRob2RzIGNhbGwgdGhpcyBzZXJ2aWNlIHRvIGdlbmVyYXRlIGRlZmF1bHQgY29ycmVsYXRpb24gaWRzLlxuICogRG8gTk9UIHVzZSBmb3IgZW50aXR5IGtleXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIHtcbiAgLyoqIFNlZWQgZm9yIHRoZSBpZHMgKi9cbiAgcHJvdGVjdGVkIHNlZWQgPSAwO1xuICAvKiogUHJlZml4IG9mIHRoZSBpZCwgJ0NSSUQ7ICovXG4gIHByb3RlY3RlZCBwcmVmaXggPSAnQ1JJRCc7XG4gIC8qKiBSZXR1cm4gdGhlIG5leHQgY29ycmVsYXRpb24gaWQgKi9cbiAgbmV4dCgpIHtcbiAgICB0aGlzLnNlZWQgKz0gMTtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnNlZWQ7XG4gIH1cbn1cbiJdfQ==