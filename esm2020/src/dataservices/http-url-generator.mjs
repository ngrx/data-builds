import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../utils/interfaces";
/**
 * Known resource URLS for specific entity types.
 * Each entity's resource URLS are endpoints that
 * target single entity and multi-entity HTTP operations.
 * Used by the `DefaultHttpUrlGenerator`.
 */
export class EntityHttpResourceUrls {
}
/**
 * Generate the base part of an HTTP URL for
 * single entity or entity collection resource
 */
export class HttpUrlGenerator {
}
export class DefaultHttpUrlGenerator {
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
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     */
    getResourceUrls(entityName, root, trailingSlashEndpoints = false) {
        let resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
            const nRoot = trailingSlashEndpoints ? root : normalizeRoot(root);
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
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/hero'
     */
    entityResource(entityName, root, trailingSlashEndpoints) {
        return this.getResourceUrls(entityName, root, trailingSlashEndpoints).entityResourceUrl;
    }
    /**
     * Create the path to a multiple entity (collection) resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/heroes'
     */
    collectionResource(entityName, root) {
        return this.getResourceUrls(entityName, root).collectionResourceUrl;
    }
    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
     * Well-formed resource urls end in a '/';
     * Note: this method does not ensure that resource urls are well-formed.
     */
    registerHttpResourceUrls(entityHttpResourceUrls) {
        this.knownHttpResourceUrls = {
            ...this.knownHttpResourceUrls,
            ...(entityHttpResourceUrls || {}),
        };
    }
}
/** @nocollapse */ /** @nocollapse */ DefaultHttpUrlGenerator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, deps: [{ token: i1.Pluralizer }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ /** @nocollapse */ DefaultHttpUrlGenerator.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultHttpUrlGenerator });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Pluralizer }]; } });
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[/\s]+|[/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUczQzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0Isc0JBQXNCO0NBRTNDO0FBdUJEOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IsZ0JBQWdCO0NBcUJyQztBQUdELE1BQU0sT0FBTyx1QkFBdUI7SUFTbEMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVIxQzs7Ozs7V0FLRztRQUNPLDBCQUFxQixHQUEyQixFQUFFLENBQUM7SUFFaEIsQ0FBQztJQUU5Qzs7OztPQUlHO0lBQ08sZUFBZSxDQUN2QixVQUFrQixFQUNsQixJQUFZLEVBQ1oseUJBQWtDLEtBQUs7UUFFdkMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxLQUFLLEdBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQSxDQUFDLENBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25FLFlBQVksR0FBRztnQkFDYixpQkFBaUIsRUFBRSxHQUFHLEtBQUssSUFBSSxVQUFVLEdBQUcsQ0FBQyxXQUFXLEVBQUU7Z0JBQzFELHFCQUFxQixFQUFFLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMxRCxVQUFVLENBQ1gsR0FBRyxDQUFDLFdBQVcsRUFBRTthQUNuQixDQUFDO1lBQ0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsY0FBYyxDQUFDLFVBQWtCLEVBQUUsSUFBWSxFQUM3QyxzQkFBK0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztJQUMxRixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxrQkFBa0IsQ0FBQyxVQUFrQixFQUFFLElBQVk7UUFDakQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx3QkFBd0IsQ0FDdEIsc0JBQThDO1FBRTlDLElBQUksQ0FBQyxxQkFBcUIsR0FBRztZQUMzQixHQUFHLElBQUksQ0FBQyxxQkFBcUI7WUFDN0IsR0FBRyxDQUFDLHNCQUFzQixJQUFJLEVBQUUsQ0FBQztTQUNsQyxDQUFDO0lBQ0osQ0FBQzs7MEpBckVVLHVCQUF1Qjs4SkFBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVU7O0FBeUVYLGtEQUFrRDtBQUNsRCxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQVk7SUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVyYWxpemVyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogS25vd24gcmVzb3VyY2UgVVJMUyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGVzLlxuICogRWFjaCBlbnRpdHkncyByZXNvdXJjZSBVUkxTIGFyZSBlbmRwb2ludHMgdGhhdFxuICogdGFyZ2V0IHNpbmdsZSBlbnRpdHkgYW5kIG11bHRpLWVudGl0eSBIVFRQIG9wZXJhdGlvbnMuXG4gKiBVc2VkIGJ5IHRoZSBgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3JgLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5SHR0cFJlc291cmNlVXJscyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBIdHRwUmVzb3VyY2VVcmxzO1xufVxuXG4vKipcbiAqIFJlc291cmNlIFVSTFMgZm9yIEhUVFAgb3BlcmF0aW9ucyB0aGF0IHRhcmdldCBzaW5nbGUgZW50aXR5XG4gKiBhbmQgbXVsdGktZW50aXR5IGVuZHBvaW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIdHRwUmVzb3VyY2VVcmxzIHtcbiAgLyoqXG4gICAqIFRoZSBVUkwgcGF0aCBmb3IgYSBzaW5nbGUgZW50aXR5IGVuZHBvaW50LCBlLmcsIGBzb21lLWFwaS1yb290L2hlcm8vYFxuICAgKiBzdWNoIGFzIHlvdSdkIHVzZSB0byBhZGQgYSBoZXJvLlxuICAgKiBFeGFtcGxlOiBgaHR0cENsaWVudC5wb3N0PEhlcm8+KCdzb21lLWFwaS1yb290L2hlcm8vJywgYWRkZWRIZXJvKWAuXG4gICAqIE5vdGUgdHJhaWxpbmcgc2xhc2ggKC8pLlxuICAgKi9cbiAgZW50aXR5UmVzb3VyY2VVcmw6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBVUkwgcGF0aCBmb3IgYSBtdWx0aXBsZS1lbnRpdHkgZW5kcG9pbnQsIGUuZywgYHNvbWUtYXBpLXJvb3QvaGVyb2VzL2BcbiAgICogc3VjaCBhcyB5b3UnZCB1c2Ugd2hlbiBnZXR0aW5nIGFsbCBoZXJvZXMuXG4gICAqIEV4YW1wbGU6IGBodHRwQ2xpZW50LmdldDxIZXJvW10+KCdzb21lLWFwaS1yb290L2hlcm9lcy8nKWBcbiAgICogTm90ZSB0cmFpbGluZyBzbGFzaCAoLykuXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2VVcmw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgYmFzZSBwYXJ0IG9mIGFuIEhUVFAgVVJMIGZvclxuICogc2luZ2xlIGVudGl0eSBvciBlbnRpdHkgY29sbGVjdGlvbiByZXNvdXJjZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSHR0cFVybEdlbmVyYXRvciB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGJhc2UgVVJMIGZvciBhIHNpbmdsZSBlbnRpdHkgcmVzb3VyY2UsXG4gICAqIGUuZy4sIHRoZSBiYXNlIFVSTCB0byBnZXQgYSBzaW5nbGUgaGVybyBieSBpdHMgaWRcbiAgICovXG4gIGFic3RyYWN0IGVudGl0eVJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nLFxuICAgIHRyYWlsaW5nU2xhc2hFbmRwb2ludHM6IGJvb2xlYW4pOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgY29sbGVjdGlvbiByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhbGwgaGVyb2VzXG4gICAqL1xuICBhYnN0cmFjdCBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxsc1xuICAgKiBAcGFyYW0gZW50aXR5SHR0cFJlc291cmNlVXJscyB7RW50aXR5SHR0cFJlc291cmNlVXJsc30gcmVzb3VyY2UgdXJscyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGUgbmFtZXNcbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzPzogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgaW1wbGVtZW50cyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIEtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxscy5cbiAgICogR2VuZXJhdG9yIG1ldGhvZHMgcmV0dXJucyB0aGVzZSByZXNvdXJjZSBVUkxzIGZvciBhIGdpdmVuIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIElmIHRoZSByZXNvdXJjZXMgZm9yIGFuIGVudGl0eSB0eXBlIG5hbWUgYXJlIG5vdCBrbm93LCBpdCBnZW5lcmF0ZXNcbiAgICogYW5kIGNhY2hlcyBhIHJlc291cmNlIG5hbWUgZm9yIGZ1dHVyZSB1c2VcbiAgICovXG4gIHByb3RlY3RlZCBrbm93bkh0dHBSZXNvdXJjZVVybHM6IEVudGl0eUh0dHBSZXNvdXJjZVVybHMgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdXJhbGl6ZXI6IFBsdXJhbGl6ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEdldCBvciBnZW5lcmF0ZSB0aGUgZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSBuYW1lXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByb290OiBzdHJpbmcsXG4gICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50czogYm9vbGVhbiA9IGZhbHNlXG4gICk6IEh0dHBSZXNvdXJjZVVybHMge1xuICAgIGxldCByZXNvdXJjZVVybHMgPSB0aGlzLmtub3duSHR0cFJlc291cmNlVXJsc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXJlc291cmNlVXJscykge1xuICAgICAgY29uc3QgblJvb3QgPSAgdHJhaWxpbmdTbGFzaEVuZHBvaW50cyA/IHJvb3Q6ICBub3JtYWxpemVSb290KHJvb3QpO1xuICAgICAgcmVzb3VyY2VVcmxzID0ge1xuICAgICAgICBlbnRpdHlSZXNvdXJjZVVybDogYCR7blJvb3R9LyR7ZW50aXR5TmFtZX0vYC50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBjb2xsZWN0aW9uUmVzb3VyY2VVcmw6IGAke25Sb290fS8ke3RoaXMucGx1cmFsaXplci5wbHVyYWxpemUoXG4gICAgICAgICAgZW50aXR5TmFtZVxuICAgICAgICApfS9gLnRvTG93ZXJDYXNlKCksXG4gICAgICB9O1xuICAgICAgdGhpcy5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoeyBbZW50aXR5TmFtZV06IHJlc291cmNlVXJscyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlVXJscztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHBhdGggdG8gYSBzaW5nbGUgZW50aXR5IHJlc291cmNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqIEByZXR1cm5zIGNvbXBsZXRlIHBhdGggdG8gcmVzb3VyY2UsIGUuZywgJ3NvbWUtYXBpL2hlcm8nXG4gICAqL1xuICBlbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyxcbiAgICB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZVVybHMoZW50aXR5TmFtZSwgcm9vdCwgdHJhaWxpbmdTbGFzaEVuZHBvaW50cykuZW50aXR5UmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgbXVsdGlwbGUgZW50aXR5IChjb2xsZWN0aW9uKSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvZXMnXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290KS5jb2xsZWN0aW9uUmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKiBXZWxsLWZvcm1lZCByZXNvdXJjZSB1cmxzIGVuZCBpbiBhICcvJztcbiAgICogTm90ZTogdGhpcyBtZXRob2QgZG9lcyBub3QgZW5zdXJlIHRoYXQgcmVzb3VyY2UgdXJscyBhcmUgd2VsbC1mb3JtZWQuXG4gICAqL1xuICByZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5SHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmtub3duSHR0cFJlc291cmNlVXJscyA9IHtcbiAgICAgIC4uLnRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzLFxuICAgICAgLi4uKGVudGl0eUh0dHBSZXNvdXJjZVVybHMgfHwge30pLFxuICAgIH07XG4gIH1cbn1cblxuLyoqIFJlbW92ZSBsZWFkaW5nICYgdHJhaWxpbmcgc3BhY2VzIG9yIHNsYXNoZXMgKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3Q6IHN0cmluZykge1xuICByZXR1cm4gcm9vdC5yZXBsYWNlKC9eWy9cXHNdK3xbL1xcc10rJC9nLCAnJyk7XG59XG4iXX0=