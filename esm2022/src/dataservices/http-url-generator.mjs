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
class DefaultHttpUrlGenerator {
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
        return this.getResourceUrls(entityName, root, trailingSlashEndpoints)
            .entityResourceUrl;
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, deps: [{ token: i1.Pluralizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultHttpUrlGenerator }); }
}
export { DefaultHttpUrlGenerator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Pluralizer }]; } });
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[/\s]+|[/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUczQzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0Isc0JBQXNCO0NBRTNDO0FBdUJEOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IsZ0JBQWdCO0NBd0JyQztBQUVELE1BQ2EsdUJBQXVCO0lBU2xDLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFSMUM7Ozs7O1dBS0c7UUFDTywwQkFBcUIsR0FBMkIsRUFBRSxDQUFDO0lBRWhCLENBQUM7SUFFOUM7Ozs7T0FJRztJQUNPLGVBQWUsQ0FDdkIsVUFBa0IsRUFDbEIsSUFBWSxFQUNaLHNCQUFzQixHQUFHLEtBQUs7UUFFOUIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxLQUFLLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xFLFlBQVksR0FBRztnQkFDYixpQkFBaUIsRUFBRSxHQUFHLEtBQUssSUFBSSxVQUFVLEdBQUcsQ0FBQyxXQUFXLEVBQUU7Z0JBQzFELHFCQUFxQixFQUFFLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMxRCxVQUFVLENBQ1gsR0FBRyxDQUFDLFdBQVcsRUFBRTthQUNuQixDQUFDO1lBQ0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsY0FBYyxDQUNaLFVBQWtCLEVBQ2xCLElBQVksRUFDWixzQkFBK0I7UUFFL0IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLENBQUM7YUFDbEUsaUJBQWlCLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsa0JBQWtCLENBQUMsVUFBa0IsRUFBRSxJQUFZO1FBQ2pELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsd0JBQXdCLENBQ3RCLHNCQUE4QztRQUU5QyxJQUFJLENBQUMscUJBQXFCLEdBQUc7WUFDM0IsR0FBRyxJQUFJLENBQUMscUJBQXFCO1lBQzdCLEdBQUcsQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUM7U0FDbEMsQ0FBQztJQUNKLENBQUM7aUlBekVVLHVCQUF1QjtxSUFBdkIsdUJBQXVCOztTQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVTs7QUE2RVgsa0RBQWtEO0FBQ2xELE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBWTtJQUN4QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsdXJhbGl6ZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBLbm93biByZXNvdXJjZSBVUkxTIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZXMuXG4gKiBFYWNoIGVudGl0eSdzIHJlc291cmNlIFVSTFMgYXJlIGVuZHBvaW50cyB0aGF0XG4gKiB0YXJnZXQgc2luZ2xlIGVudGl0eSBhbmQgbXVsdGktZW50aXR5IEhUVFAgb3BlcmF0aW9ucy5cbiAqIFVzZWQgYnkgdGhlIGBEZWZhdWx0SHR0cFVybEdlbmVyYXRvcmAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IEh0dHBSZXNvdXJjZVVybHM7XG59XG5cbi8qKlxuICogUmVzb3VyY2UgVVJMUyBmb3IgSFRUUCBvcGVyYXRpb25zIHRoYXQgdGFyZ2V0IHNpbmdsZSBlbnRpdHlcbiAqIGFuZCBtdWx0aS1lbnRpdHkgZW5kcG9pbnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEh0dHBSZXNvdXJjZVVybHMge1xuICAvKipcbiAgICogVGhlIFVSTCBwYXRoIGZvciBhIHNpbmdsZSBlbnRpdHkgZW5kcG9pbnQsIGUuZywgYHNvbWUtYXBpLXJvb3QvaGVyby9gXG4gICAqIHN1Y2ggYXMgeW91J2QgdXNlIHRvIGFkZCBhIGhlcm8uXG4gICAqIEV4YW1wbGU6IGBodHRwQ2xpZW50LnBvc3Q8SGVybz4oJ3NvbWUtYXBpLXJvb3QvaGVyby8nLCBhZGRlZEhlcm8pYC5cbiAgICogTm90ZSB0cmFpbGluZyBzbGFzaCAoLykuXG4gICAqL1xuICBlbnRpdHlSZXNvdXJjZVVybDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIFVSTCBwYXRoIGZvciBhIG11bHRpcGxlLWVudGl0eSBlbmRwb2ludCwgZS5nLCBgc29tZS1hcGktcm9vdC9oZXJvZXMvYFxuICAgKiBzdWNoIGFzIHlvdSdkIHVzZSB3aGVuIGdldHRpbmcgYWxsIGhlcm9lcy5cbiAgICogRXhhbXBsZTogYGh0dHBDbGllbnQuZ2V0PEhlcm9bXT4oJ3NvbWUtYXBpLXJvb3QvaGVyb2VzLycpYFxuICAgKiBOb3RlIHRyYWlsaW5nIHNsYXNoICgvKS5cbiAgICovXG4gIGNvbGxlY3Rpb25SZXNvdXJjZVVybDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBiYXNlIHBhcnQgb2YgYW4gSFRUUCBVUkwgZm9yXG4gKiBzaW5nbGUgZW50aXR5IG9yIGVudGl0eSBjb2xsZWN0aW9uIHJlc291cmNlXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgc2luZ2xlIGVudGl0eSByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhIHNpbmdsZSBoZXJvIGJ5IGl0cyBpZFxuICAgKi9cbiAgYWJzdHJhY3QgZW50aXR5UmVzb3VyY2UoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHJvb3Q6IHN0cmluZyxcbiAgICB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzOiBib29sZWFuXG4gICk6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBiYXNlIFVSTCBmb3IgYSBjb2xsZWN0aW9uIHJlc291cmNlLFxuICAgKiBlLmcuLCB0aGUgYmFzZSBVUkwgdG8gZ2V0IGFsbCBoZXJvZXNcbiAgICovXG4gIGFic3RyYWN0IGNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKi9cbiAgYWJzdHJhY3QgcmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eUh0dHBSZXNvdXJjZVVybHM/OiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzXG4gICk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SHR0cFVybEdlbmVyYXRvciBpbXBsZW1lbnRzIEh0dHBVcmxHZW5lcmF0b3Ige1xuICAvKipcbiAgICogS25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzLlxuICAgKiBHZW5lcmF0b3IgbWV0aG9kcyByZXR1cm5zIHRoZXNlIHJlc291cmNlIFVSTHMgZm9yIGEgZ2l2ZW4gZW50aXR5IHR5cGUgbmFtZS5cbiAgICogSWYgdGhlIHJlc291cmNlcyBmb3IgYW4gZW50aXR5IHR5cGUgbmFtZSBhcmUgbm90IGtub3csIGl0IGdlbmVyYXRlc1xuICAgKiBhbmQgY2FjaGVzIGEgcmVzb3VyY2UgbmFtZSBmb3IgZnV0dXJlIHVzZVxuICAgKi9cbiAgcHJvdGVjdGVkIGtub3duSHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJscyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1cmFsaXplcjogUGx1cmFsaXplcikge31cblxuICAvKipcbiAgICogR2V0IG9yIGdlbmVyYXRlIHRoZSBlbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlIG5hbWVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICovXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHJvb3Q6IHN0cmluZyxcbiAgICB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzID0gZmFsc2VcbiAgKTogSHR0cFJlc291cmNlVXJscyB7XG4gICAgbGV0IHJlc291cmNlVXJscyA9IHRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzW2VudGl0eU5hbWVdO1xuICAgIGlmICghcmVzb3VyY2VVcmxzKSB7XG4gICAgICBjb25zdCBuUm9vdCA9IHRyYWlsaW5nU2xhc2hFbmRwb2ludHMgPyByb290IDogbm9ybWFsaXplUm9vdChyb290KTtcbiAgICAgIHJlc291cmNlVXJscyA9IHtcbiAgICAgICAgZW50aXR5UmVzb3VyY2VVcmw6IGAke25Sb290fS8ke2VudGl0eU5hbWV9L2AudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgY29sbGVjdGlvblJlc291cmNlVXJsOiBgJHtuUm9vdH0vJHt0aGlzLnBsdXJhbGl6ZXIucGx1cmFsaXplKFxuICAgICAgICAgIGVudGl0eU5hbWVcbiAgICAgICAgKX0vYC50b0xvd2VyQ2FzZSgpLFxuICAgICAgfTtcbiAgICAgIHRoaXMucmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKHsgW2VudGl0eU5hbWVdOiByZXNvdXJjZVVybHMgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXNvdXJjZVVybHM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgc2luZ2xlIGVudGl0eSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvJ1xuICAgKi9cbiAgZW50aXR5UmVzb3VyY2UoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHJvb3Q6IHN0cmluZyxcbiAgICB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzOiBib29sZWFuXG4gICk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VVcmxzKGVudGl0eU5hbWUsIHJvb3QsIHRyYWlsaW5nU2xhc2hFbmRwb2ludHMpXG4gICAgICAuZW50aXR5UmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgbXVsdGlwbGUgZW50aXR5IChjb2xsZWN0aW9uKSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvZXMnXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290KS5jb2xsZWN0aW9uUmVzb3VyY2VVcmw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKiBXZWxsLWZvcm1lZCByZXNvdXJjZSB1cmxzIGVuZCBpbiBhICcvJztcbiAgICogTm90ZTogdGhpcyBtZXRob2QgZG9lcyBub3QgZW5zdXJlIHRoYXQgcmVzb3VyY2UgdXJscyBhcmUgd2VsbC1mb3JtZWQuXG4gICAqL1xuICByZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5SHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkIHtcbiAgICB0aGlzLmtub3duSHR0cFJlc291cmNlVXJscyA9IHtcbiAgICAgIC4uLnRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzLFxuICAgICAgLi4uKGVudGl0eUh0dHBSZXNvdXJjZVVybHMgfHwge30pLFxuICAgIH07XG4gIH1cbn1cblxuLyoqIFJlbW92ZSBsZWFkaW5nICYgdHJhaWxpbmcgc3BhY2VzIG9yIHNsYXNoZXMgKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3Q6IHN0cmluZykge1xuICByZXR1cm4gcm9vdC5yZXBsYWNlKC9eWy9cXHNdK3xbL1xcc10rJC9nLCAnJyk7XG59XG4iXX0=