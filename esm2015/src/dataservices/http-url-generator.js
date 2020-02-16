/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dataservices/http-url-generator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Pluralizer } from '../utils/interfaces';
/**
 * Known resource URLS for specific entity types.
 * Each entity's resource URLS are endpoints that
 * target single entity and multi-entity HTTP operations.
 * Used by the `DefaultHttpUrlGenerator`.
 * @abstract
 */
export class EntityHttpResourceUrls {
}
/**
 * Resource URLS for HTTP operations that target single entity
 * and multi-entity endpoints.
 * @record
 */
export function HttpResourceUrls() { }
if (false) {
    /**
     * The URL path for a single entity endpoint, e.g, `some-api-root/hero/`
     * such as you'd use to add a hero.
     * Example: `httpClient.post<Hero>('some-api-root/hero/', addedHero)`.
     * Note trailing slash (/).
     * @type {?}
     */
    HttpResourceUrls.prototype.entityResourceUrl;
    /**
     * The URL path for a multiple-entity endpoint, e.g, `some-api-root/heroes/`
     * such as you'd use when getting all heroes.
     * Example: `httpClient.get<Hero[]>('some-api-root/heroes/')`
     * Note trailing slash (/).
     * @type {?}
     */
    HttpResourceUrls.prototype.collectionResourceUrl;
}
/**
 * Generate the base part of an HTTP URL for
 * single entity or entity collection resource
 * @abstract
 */
export class HttpUrlGenerator {
}
if (false) {
    /**
     * Return the base URL for a single entity resource,
     * e.g., the base URL to get a single hero by its id
     * @abstract
     * @param {?} entityName
     * @param {?} root
     * @return {?}
     */
    HttpUrlGenerator.prototype.entityResource = function (entityName, root) { };
    /**
     * Return the base URL for a collection resource,
     * e.g., the base URL to get all heroes
     * @abstract
     * @param {?} entityName
     * @param {?} root
     * @return {?}
     */
    HttpUrlGenerator.prototype.collectionResource = function (entityName, root) { };
    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @abstract
     * @param {?=} entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
     * @return {?}
     */
    HttpUrlGenerator.prototype.registerHttpResourceUrls = function (entityHttpResourceUrls) { };
}
export class DefaultHttpUrlGenerator {
    /**
     * @param {?} pluralizer
     */
    constructor(pluralizer) {
        this.pluralizer = pluralizer;
        /**
         * Known single-entity and collection resource URLs for HTTP calls.
         * Generator methods returns these resource URLs for a given entity type name.
         * If the resources for an entity type name are not know, it generates
         * and caches a resource name for future use
         */
        this.knownHttpResourceUrls = {};
    }
    /**
     * Get or generate the entity and collection resource URLs for the given entity type name
     * @protected
     * @param {?} entityName {string} Name of the entity type, e.g, 'Hero'
     * @param {?} root {string} Root path to the resource, e.g., 'some-api`
     * @return {?}
     */
    getResourceUrls(entityName, root) {
        /** @type {?} */
        let resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
            /** @type {?} */
            const nRoot = normalizeRoot(root);
            resourceUrls = {
                entityResourceUrl: `${nRoot}/${entityName}/`.toLowerCase(),
                collectionResourceUrl: `${nRoot}/${this.pluralizer.pluralize(entityName)}/`.toLowerCase(),
            };
            this.registerHttpResourceUrls({ [entityName]: resourceUrls });
        }
        return resourceUrls;
    }
    /**
     * Create the path to a single entity resource
     * @param {?} entityName {string} Name of the entity type, e.g, 'Hero'
     * @param {?} root {string} Root path to the resource, e.g., 'some-api`
     * @return {?} complete path to resource, e.g, 'some-api/hero'
     */
    entityResource(entityName, root) {
        return this.getResourceUrls(entityName, root).entityResourceUrl;
    }
    /**
     * Create the path to a multiple entity (collection) resource
     * @param {?} entityName {string} Name of the entity type, e.g, 'Hero'
     * @param {?} root {string} Root path to the resource, e.g., 'some-api`
     * @return {?} complete path to resource, e.g, 'some-api/heroes'
     */
    collectionResource(entityName, root) {
        return this.getResourceUrls(entityName, root).collectionResourceUrl;
    }
    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param {?} entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
     * Well-formed resource urls end in a '/';
     * Note: this method does not ensure that resource urls are well-formed.
     * @return {?}
     */
    registerHttpResourceUrls(entityHttpResourceUrls) {
        this.knownHttpResourceUrls = Object.assign(Object.assign({}, this.knownHttpResourceUrls), (entityHttpResourceUrls || {}));
    }
}
DefaultHttpUrlGenerator.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DefaultHttpUrlGenerator.ctorParameters = () => [
    { type: Pluralizer }
];
if (false) {
    /**
     * Known single-entity and collection resource URLs for HTTP calls.
     * Generator methods returns these resource URLs for a given entity type name.
     * If the resources for an entity type name are not know, it generates
     * and caches a resource name for future use
     * @type {?}
     * @protected
     */
    DefaultHttpUrlGenerator.prototype.knownHttpResourceUrls;
    /**
     * @type {?}
     * @private
     */
    DefaultHttpUrlGenerator.prototype.pluralizer;
}
/**
 * Remove leading & trailing spaces or slashes
 * @param {?} root
 * @return {?}
 */
export function normalizeRoot(root) {
    return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7Ozs7O0FBUWpELE1BQU0sT0FBZ0Isc0JBQXNCO0NBRTNDOzs7Ozs7QUFNRCxzQ0FlQzs7Ozs7Ozs7O0lBUkMsNkNBQTBCOzs7Ozs7OztJQU8xQixpREFBOEI7Ozs7Ozs7QUFPaEMsTUFBTSxPQUFnQixnQkFBZ0I7Q0FvQnJDOzs7Ozs7Ozs7O0lBZkMsNEVBQWtFOzs7Ozs7Ozs7SUFNbEUsZ0ZBQXNFOzs7Ozs7O0lBTXRFLDRGQUVROztBQUlWLE1BQU0sT0FBTyx1QkFBdUI7Ozs7SUFTbEMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTs7Ozs7OztRQUZoQywwQkFBcUIsR0FBMkIsRUFBRSxDQUFDO0lBRWhCLENBQUM7Ozs7Ozs7O0lBT3BDLGVBQWUsQ0FDdkIsVUFBa0IsRUFDbEIsSUFBWTs7WUFFUixZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQztRQUN6RCxJQUFJLENBQUMsWUFBWSxFQUFFOztrQkFDWCxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztZQUNqQyxZQUFZLEdBQUc7Z0JBQ2IsaUJBQWlCLEVBQUUsR0FBRyxLQUFLLElBQUksVUFBVSxHQUFHLENBQUMsV0FBVyxFQUFFO2dCQUMxRCxxQkFBcUIsRUFBRSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDMUQsVUFBVSxDQUNYLEdBQUcsQ0FBQyxXQUFXLEVBQUU7YUFDbkIsQ0FBQztZQUNGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztTQUMvRDtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7Ozs7Ozs7SUFRRCxjQUFjLENBQUMsVUFBa0IsRUFBRSxJQUFZO1FBQzdDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUM7SUFDbEUsQ0FBQzs7Ozs7OztJQVFELGtCQUFrQixDQUFDLFVBQWtCLEVBQUUsSUFBWTtRQUNqRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLHFCQUFxQixDQUFDO0lBQ3RFLENBQUM7Ozs7Ozs7O0lBUUQsd0JBQXdCLENBQ3RCLHNCQUE4QztRQUU5QyxJQUFJLENBQUMscUJBQXFCLG1DQUNyQixJQUFJLENBQUMscUJBQXFCLEdBQzFCLENBQUMsc0JBQXNCLElBQUksRUFBRSxDQUFDLENBQ2xDLENBQUM7SUFDSixDQUFDOzs7WUFwRUYsVUFBVTs7OztZQTNERixVQUFVOzs7Ozs7Ozs7OztJQW1FakIsd0RBQTZEOzs7OztJQUVqRCw2Q0FBOEI7Ozs7Ozs7QUE4RDVDLE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBWTtJQUN4QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsdXJhbGl6ZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBLbm93biByZXNvdXJjZSBVUkxTIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZXMuXG4gKiBFYWNoIGVudGl0eSdzIHJlc291cmNlIFVSTFMgYXJlIGVuZHBvaW50cyB0aGF0XG4gKiB0YXJnZXQgc2luZ2xlIGVudGl0eSBhbmQgbXVsdGktZW50aXR5IEhUVFAgb3BlcmF0aW9ucy5cbiAqIFVzZWQgYnkgdGhlIGBEZWZhdWx0SHR0cFVybEdlbmVyYXRvcmAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IEh0dHBSZXNvdXJjZVVybHM7XG59XG5cbi8qKlxuICogUmVzb3VyY2UgVVJMUyBmb3IgSFRUUCBvcGVyYXRpb25zIHRoYXQgdGFyZ2V0IHNpbmdsZSBlbnRpdHlcbiAqIGFuZCBtdWx0aS1lbnRpdHkgZW5kcG9pbnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEh0dHBSZXNvdXJjZVVybHMge1xuICAvKipcbiAgICogVGhlIFVSTCBwYXRoIGZvciBhIHNpbmdsZSBlbnRpdHkgZW5kcG9pbnQsIGUuZywgYHNvbWUtYXBpLXJvb3QvaGVyby9gXG4gICAqIHN1Y2ggYXMgeW91J2QgdXNlIHRvIGFkZCBhIGhlcm8uXG4gICAqIEV4YW1wbGU6IGBodHRwQ2xpZW50LnBvc3Q8SGVybz4oJ3NvbWUtYXBpLXJvb3QvaGVyby8nLCBhZGRlZEhlcm8pYC5cbiAgICogTm90ZSB0cmFpbGluZyBzbGFzaCAoLykuXG4gICAqL1xuICBlbnRpdHlSZXNvdXJjZVVybDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIFVSTCBwYXRoIGZvciBhIG11bHRpcGxlLWVudGl0eSBlbmRwb2ludCwgZS5nLCBgc29tZS1hcGktcm9vdC9oZXJvZXMvYFxuICAgKiBzdWNoIGFzIHlvdSdkIHVzZSB3aGVuIGdldHRpbmcgYWxsIGhlcm9lcy5cbiAgICogRXhhbXBsZTogYGh0dHBDbGllbnQuZ2V0PEhlcm9bXT4oJ3NvbWUtYXBpLXJvb3QvaGVyb2VzLycpYFxuICAgKiBOb3RlIHRyYWlsaW5nIHNsYXNoICgvKS5cbiAgICovXG4gIGNvbGxlY3Rpb25SZXNvdXJjZVVybDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBiYXNlIHBhcnQgb2YgYW4gSFRUUCBVUkwgZm9yXG4gKiBzaW5nbGUgZW50aXR5IG9yIGVudGl0eSBjb2xsZWN0aW9uIHJlc291cmNlXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgc2luZ2xlIGVudGl0eSByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhIHNpbmdsZSBoZXJvIGJ5IGl0cyBpZFxuICAgKi9cbiAgYWJzdHJhY3QgZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgY29sbGVjdGlvbiByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhbGwgaGVyb2VzXG4gICAqL1xuICBhYnN0cmFjdCBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxsc1xuICAgKiBAcGFyYW0gZW50aXR5SHR0cFJlc291cmNlVXJscyB7RW50aXR5SHR0cFJlc291cmNlVXJsc30gcmVzb3VyY2UgdXJscyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGUgbmFtZXNcbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzPzogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgaW1wbGVtZW50cyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIEtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxscy5cbiAgICogR2VuZXJhdG9yIG1ldGhvZHMgcmV0dXJucyB0aGVzZSByZXNvdXJjZSBVUkxzIGZvciBhIGdpdmVuIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIElmIHRoZSByZXNvdXJjZXMgZm9yIGFuIGVudGl0eSB0eXBlIG5hbWUgYXJlIG5vdCBrbm93LCBpdCBnZW5lcmF0ZXNcbiAgICogYW5kIGNhY2hlcyBhIHJlc291cmNlIG5hbWUgZm9yIGZ1dHVyZSB1c2VcbiAgICovXG4gIHByb3RlY3RlZCBrbm93bkh0dHBSZXNvdXJjZVVybHM6IEVudGl0eUh0dHBSZXNvdXJjZVVybHMgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdXJhbGl6ZXI6IFBsdXJhbGl6ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEdldCBvciBnZW5lcmF0ZSB0aGUgZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSBuYW1lXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByb290OiBzdHJpbmdcbiAgKTogSHR0cFJlc291cmNlVXJscyB7XG4gICAgbGV0IHJlc291cmNlVXJscyA9IHRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzW2VudGl0eU5hbWVdO1xuICAgIGlmICghcmVzb3VyY2VVcmxzKSB7XG4gICAgICBjb25zdCBuUm9vdCA9IG5vcm1hbGl6ZVJvb3Qocm9vdCk7XG4gICAgICByZXNvdXJjZVVybHMgPSB7XG4gICAgICAgIGVudGl0eVJlc291cmNlVXJsOiBgJHtuUm9vdH0vJHtlbnRpdHlOYW1lfS9gLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGNvbGxlY3Rpb25SZXNvdXJjZVVybDogYCR7blJvb3R9LyR7dGhpcy5wbHVyYWxpemVyLnBsdXJhbGl6ZShcbiAgICAgICAgICBlbnRpdHlOYW1lXG4gICAgICAgICl9L2AudG9Mb3dlckNhc2UoKSxcbiAgICAgIH07XG4gICAgICB0aGlzLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyh7IFtlbnRpdHlOYW1lXTogcmVzb3VyY2VVcmxzIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb3VyY2VVcmxzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgcGF0aCB0byBhIHNpbmdsZSBlbnRpdHkgcmVzb3VyY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICogQHJldHVybnMgY29tcGxldGUgcGF0aCB0byByZXNvdXJjZSwgZS5nLCAnc29tZS1hcGkvaGVybydcbiAgICovXG4gIGVudGl0eVJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZVVybHMoZW50aXR5TmFtZSwgcm9vdCkuZW50aXR5UmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgbXVsdGlwbGUgZW50aXR5IChjb2xsZWN0aW9uKSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvZXMnXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290KS5jb2xsZWN0aW9uUmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKiBXZWxsLWZvcm1lZCByZXNvdXJjZSB1cmxzIGVuZCBpbiBhICcvJztcbiAgICogTm90ZTogdGhpcyBtZXRob2QgZG9lcyBub3QgZW5zdXJlIHRoYXQgcmVzb3VyY2UgdXJscyBhcmUgd2VsbC1mb3JtZWQuXG4gICAqL1xuICByZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5SHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmtub3duSHR0cFJlc291cmNlVXJscyA9IHtcbiAgICAgIC4uLnRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzLFxuICAgICAgLi4uKGVudGl0eUh0dHBSZXNvdXJjZVVybHMgfHwge30pLFxuICAgIH07XG4gIH1cbn1cblxuLyoqIFJlbW92ZSBsZWFkaW5nICYgdHJhaWxpbmcgc3BhY2VzIG9yIHNsYXNoZXMgKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3Q6IHN0cmluZykge1xuICByZXR1cm4gcm9vdC5yZXBsYWNlKC9eW1xcL1xcc10rfFtcXC9cXHNdKyQvZywgJycpO1xufVxuIl19