import { __assign, __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Pluralizer } from '../utils/interfaces';
/**
 * Known resource URLS for specific entity types.
 * Each entity's resource URLS are endpoints that
 * target single entity and multi-entity HTTP operations.
 * Used by the `DefaultHttpUrlGenerator`.
 */
var EntityHttpResourceUrls = /** @class */ (function () {
    function EntityHttpResourceUrls() {
    }
    return EntityHttpResourceUrls;
}());
export { EntityHttpResourceUrls };
/**
 * Generate the base part of an HTTP URL for
 * single entity or entity collection resource
 */
var HttpUrlGenerator = /** @class */ (function () {
    function HttpUrlGenerator() {
    }
    return HttpUrlGenerator;
}());
export { HttpUrlGenerator };
var DefaultHttpUrlGenerator = /** @class */ (function () {
    function DefaultHttpUrlGenerator(pluralizer) {
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
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     */
    DefaultHttpUrlGenerator.prototype.getResourceUrls = function (entityName, root) {
        var _a;
        var resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
            var nRoot = normalizeRoot(root);
            resourceUrls = {
                entityResourceUrl: (nRoot + "/" + entityName + "/").toLowerCase(),
                collectionResourceUrl: (nRoot + "/" + this.pluralizer.pluralize(entityName) + "/").toLowerCase(),
            };
            this.registerHttpResourceUrls((_a = {}, _a[entityName] = resourceUrls, _a));
        }
        return resourceUrls;
    };
    /**
     * Create the path to a single entity resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/hero'
     */
    DefaultHttpUrlGenerator.prototype.entityResource = function (entityName, root) {
        return this.getResourceUrls(entityName, root).entityResourceUrl;
    };
    /**
     * Create the path to a multiple entity (collection) resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/heroes'
     */
    DefaultHttpUrlGenerator.prototype.collectionResource = function (entityName, root) {
        return this.getResourceUrls(entityName, root).collectionResourceUrl;
    };
    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
     * Well-formed resource urls end in a '/';
     * Note: this method does not ensure that resource urls are well-formed.
     */
    DefaultHttpUrlGenerator.prototype.registerHttpResourceUrls = function (entityHttpResourceUrls) {
        this.knownHttpResourceUrls = __assign(__assign({}, this.knownHttpResourceUrls), (entityHttpResourceUrls || {}));
    };
    DefaultHttpUrlGenerator = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Pluralizer])
    ], DefaultHttpUrlGenerator);
    return DefaultHttpUrlGenerator;
}());
export { DefaultHttpUrlGenerator };
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVqRDs7Ozs7R0FLRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQsNkJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQzs7QUF1QkQ7OztHQUdHO0FBQ0g7SUFBQTtJQW9CQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBcEJELElBb0JDOztBQUdEO0lBU0UsaUNBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFSMUM7Ozs7O1dBS0c7UUFDTywwQkFBcUIsR0FBMkIsRUFBRSxDQUFDO0lBRWhCLENBQUM7SUFFOUM7Ozs7T0FJRztJQUNPLGlEQUFlLEdBQXpCLFVBQ0UsVUFBa0IsRUFDbEIsSUFBWTs7UUFFWixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixJQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsWUFBWSxHQUFHO2dCQUNiLGlCQUFpQixFQUFFLENBQUcsS0FBSyxTQUFJLFVBQVUsTUFBRyxDQUFBLENBQUMsV0FBVyxFQUFFO2dCQUMxRCxxQkFBcUIsRUFBRSxDQUFHLEtBQUssU0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDMUQsVUFBVSxDQUNYLE1BQUcsQ0FBQSxDQUFDLFdBQVcsRUFBRTthQUNuQixDQUFDO1lBQ0YsSUFBSSxDQUFDLHdCQUF3QixXQUFHLEdBQUMsVUFBVSxJQUFHLFlBQVksTUFBRyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsZ0RBQWMsR0FBZCxVQUFlLFVBQWtCLEVBQUUsSUFBWTtRQUM3QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDO0lBQ2xFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILG9EQUFrQixHQUFsQixVQUFtQixVQUFrQixFQUFFLElBQVk7UUFDakQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCwwREFBd0IsR0FBeEIsVUFDRSxzQkFBOEM7UUFFOUMsSUFBSSxDQUFDLHFCQUFxQix5QkFDckIsSUFBSSxDQUFDLHFCQUFxQixHQUMxQixDQUFDLHNCQUFzQixJQUFJLEVBQUUsQ0FBQyxDQUNsQyxDQUFDO0lBQ0osQ0FBQztJQW5FVSx1QkFBdUI7UUFEbkMsVUFBVSxFQUFFO3lDQVVxQixVQUFVO09BVC9CLHVCQUF1QixDQW9FbkM7SUFBRCw4QkFBQztDQUFBLEFBcEVELElBb0VDO1NBcEVZLHVCQUF1QjtBQXNFcEMsa0RBQWtEO0FBQ2xELE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBWTtJQUN4QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsdXJhbGl6ZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBLbm93biByZXNvdXJjZSBVUkxTIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZXMuXG4gKiBFYWNoIGVudGl0eSdzIHJlc291cmNlIFVSTFMgYXJlIGVuZHBvaW50cyB0aGF0XG4gKiB0YXJnZXQgc2luZ2xlIGVudGl0eSBhbmQgbXVsdGktZW50aXR5IEhUVFAgb3BlcmF0aW9ucy5cbiAqIFVzZWQgYnkgdGhlIGBEZWZhdWx0SHR0cFVybEdlbmVyYXRvcmAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IEh0dHBSZXNvdXJjZVVybHM7XG59XG5cbi8qKlxuICogUmVzb3VyY2UgVVJMUyBmb3IgSFRUUCBvcGVyYXRpb25zIHRoYXQgdGFyZ2V0IHNpbmdsZSBlbnRpdHlcbiAqIGFuZCBtdWx0aS1lbnRpdHkgZW5kcG9pbnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEh0dHBSZXNvdXJjZVVybHMge1xuICAvKipcbiAgICogVGhlIFVSTCBwYXRoIGZvciBhIHNpbmdsZSBlbnRpdHkgZW5kcG9pbnQsIGUuZywgYHNvbWUtYXBpLXJvb3QvaGVyby9gXG4gICAqIHN1Y2ggYXMgeW91J2QgdXNlIHRvIGFkZCBhIGhlcm8uXG4gICAqIEV4YW1wbGU6IGBodHRwQ2xpZW50LnBvc3Q8SGVybz4oJ3NvbWUtYXBpLXJvb3QvaGVyby8nLCBhZGRlZEhlcm8pYC5cbiAgICogTm90ZSB0cmFpbGluZyBzbGFzaCAoLykuXG4gICAqL1xuICBlbnRpdHlSZXNvdXJjZVVybDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIFVSTCBwYXRoIGZvciBhIG11bHRpcGxlLWVudGl0eSBlbmRwb2ludCwgZS5nLCBgc29tZS1hcGktcm9vdC9oZXJvZXMvYFxuICAgKiBzdWNoIGFzIHlvdSdkIHVzZSB3aGVuIGdldHRpbmcgYWxsIGhlcm9lcy5cbiAgICogRXhhbXBsZTogYGh0dHBDbGllbnQuZ2V0PEhlcm9bXT4oJ3NvbWUtYXBpLXJvb3QvaGVyb2VzLycpYFxuICAgKiBOb3RlIHRyYWlsaW5nIHNsYXNoICgvKS5cbiAgICovXG4gIGNvbGxlY3Rpb25SZXNvdXJjZVVybDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBiYXNlIHBhcnQgb2YgYW4gSFRUUCBVUkwgZm9yXG4gKiBzaW5nbGUgZW50aXR5IG9yIGVudGl0eSBjb2xsZWN0aW9uIHJlc291cmNlXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgc2luZ2xlIGVudGl0eSByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhIHNpbmdsZSBoZXJvIGJ5IGl0cyBpZFxuICAgKi9cbiAgYWJzdHJhY3QgZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgY29sbGVjdGlvbiByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhbGwgaGVyb2VzXG4gICAqL1xuICBhYnN0cmFjdCBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxsc1xuICAgKiBAcGFyYW0gZW50aXR5SHR0cFJlc291cmNlVXJscyB7RW50aXR5SHR0cFJlc291cmNlVXJsc30gcmVzb3VyY2UgdXJscyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGUgbmFtZXNcbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzPzogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgaW1wbGVtZW50cyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIEtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxscy5cbiAgICogR2VuZXJhdG9yIG1ldGhvZHMgcmV0dXJucyB0aGVzZSByZXNvdXJjZSBVUkxzIGZvciBhIGdpdmVuIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIElmIHRoZSByZXNvdXJjZXMgZm9yIGFuIGVudGl0eSB0eXBlIG5hbWUgYXJlIG5vdCBrbm93LCBpdCBnZW5lcmF0ZXNcbiAgICogYW5kIGNhY2hlcyBhIHJlc291cmNlIG5hbWUgZm9yIGZ1dHVyZSB1c2VcbiAgICovXG4gIHByb3RlY3RlZCBrbm93bkh0dHBSZXNvdXJjZVVybHM6IEVudGl0eUh0dHBSZXNvdXJjZVVybHMgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdXJhbGl6ZXI6IFBsdXJhbGl6ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEdldCBvciBnZW5lcmF0ZSB0aGUgZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSBuYW1lXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByb290OiBzdHJpbmdcbiAgKTogSHR0cFJlc291cmNlVXJscyB7XG4gICAgbGV0IHJlc291cmNlVXJscyA9IHRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzW2VudGl0eU5hbWVdO1xuICAgIGlmICghcmVzb3VyY2VVcmxzKSB7XG4gICAgICBjb25zdCBuUm9vdCA9IG5vcm1hbGl6ZVJvb3Qocm9vdCk7XG4gICAgICByZXNvdXJjZVVybHMgPSB7XG4gICAgICAgIGVudGl0eVJlc291cmNlVXJsOiBgJHtuUm9vdH0vJHtlbnRpdHlOYW1lfS9gLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGNvbGxlY3Rpb25SZXNvdXJjZVVybDogYCR7blJvb3R9LyR7dGhpcy5wbHVyYWxpemVyLnBsdXJhbGl6ZShcbiAgICAgICAgICBlbnRpdHlOYW1lXG4gICAgICAgICl9L2AudG9Mb3dlckNhc2UoKSxcbiAgICAgIH07XG4gICAgICB0aGlzLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyh7IFtlbnRpdHlOYW1lXTogcmVzb3VyY2VVcmxzIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb3VyY2VVcmxzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgcGF0aCB0byBhIHNpbmdsZSBlbnRpdHkgcmVzb3VyY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICogQHJldHVybnMgY29tcGxldGUgcGF0aCB0byByZXNvdXJjZSwgZS5nLCAnc29tZS1hcGkvaGVybydcbiAgICovXG4gIGVudGl0eVJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZVVybHMoZW50aXR5TmFtZSwgcm9vdCkuZW50aXR5UmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgbXVsdGlwbGUgZW50aXR5IChjb2xsZWN0aW9uKSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvZXMnXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290KS5jb2xsZWN0aW9uUmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKiBXZWxsLWZvcm1lZCByZXNvdXJjZSB1cmxzIGVuZCBpbiBhICcvJztcbiAgICogTm90ZTogdGhpcyBtZXRob2QgZG9lcyBub3QgZW5zdXJlIHRoYXQgcmVzb3VyY2UgdXJscyBhcmUgd2VsbC1mb3JtZWQuXG4gICAqL1xuICByZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5SHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmtub3duSHR0cFJlc291cmNlVXJscyA9IHtcbiAgICAgIC4uLnRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzLFxuICAgICAgLi4uKGVudGl0eUh0dHBSZXNvdXJjZVVybHMgfHwge30pLFxuICAgIH07XG4gIH1cbn1cblxuLyoqIFJlbW92ZSBsZWFkaW5nICYgdHJhaWxpbmcgc3BhY2VzIG9yIHNsYXNoZXMgKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3Q6IHN0cmluZykge1xuICByZXR1cm4gcm9vdC5yZXBsYWNlKC9eW1xcL1xcc10rfFtcXC9cXHNdKyQvZywgJycpO1xufVxuIl19