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
    getResourceUrls(entityName, root) {
        let resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
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
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/hero'
     */
    entityResource(entityName, root) {
        return this.getResourceUrls(entityName, root).entityResourceUrl;
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
        this.knownHttpResourceUrls = Object.assign(Object.assign({}, this.knownHttpResourceUrls), (entityHttpResourceUrls || {}));
    }
}
/** @nocollapse */ DefaultHttpUrlGenerator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: DefaultHttpUrlGenerator, deps: [{ token: i1.Pluralizer }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ DefaultHttpUrlGenerator.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: DefaultHttpUrlGenerator });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: DefaultHttpUrlGenerator, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Pluralizer }]; } });
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[/\s]+|[/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUczQzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0Isc0JBQXNCO0NBRTNDO0FBdUJEOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IsZ0JBQWdCO0NBb0JyQztBQUdELE1BQU0sT0FBTyx1QkFBdUI7SUFTbEMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVIxQzs7Ozs7V0FLRztRQUNPLDBCQUFxQixHQUEyQixFQUFFLENBQUM7SUFFaEIsQ0FBQztJQUU5Qzs7OztPQUlHO0lBQ08sZUFBZSxDQUN2QixVQUFrQixFQUNsQixJQUFZO1FBRVosSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLFlBQVksR0FBRztnQkFDYixpQkFBaUIsRUFBRSxHQUFHLEtBQUssSUFBSSxVQUFVLEdBQUcsQ0FBQyxXQUFXLEVBQUU7Z0JBQzFELHFCQUFxQixFQUFFLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMxRCxVQUFVLENBQ1gsR0FBRyxDQUFDLFdBQVcsRUFBRTthQUNuQixDQUFDO1lBQ0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsY0FBYyxDQUFDLFVBQWtCLEVBQUUsSUFBWTtRQUM3QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDO0lBQ2xFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGtCQUFrQixDQUFDLFVBQWtCLEVBQUUsSUFBWTtRQUNqRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLHFCQUFxQixDQUFDO0lBQ3RFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILHdCQUF3QixDQUN0QixzQkFBOEM7UUFFOUMsSUFBSSxDQUFDLHFCQUFxQixtQ0FDckIsSUFBSSxDQUFDLHFCQUFxQixHQUMxQixDQUFDLHNCQUFzQixJQUFJLEVBQUUsQ0FBQyxDQUNsQyxDQUFDO0lBQ0osQ0FBQzs7dUlBbkVVLHVCQUF1QjsySUFBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVU7O0FBdUVYLGtEQUFrRDtBQUNsRCxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQVk7SUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVyYWxpemVyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogS25vd24gcmVzb3VyY2UgVVJMUyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGVzLlxuICogRWFjaCBlbnRpdHkncyByZXNvdXJjZSBVUkxTIGFyZSBlbmRwb2ludHMgdGhhdFxuICogdGFyZ2V0IHNpbmdsZSBlbnRpdHkgYW5kIG11bHRpLWVudGl0eSBIVFRQIG9wZXJhdGlvbnMuXG4gKiBVc2VkIGJ5IHRoZSBgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3JgLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5SHR0cFJlc291cmNlVXJscyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBIdHRwUmVzb3VyY2VVcmxzO1xufVxuXG4vKipcbiAqIFJlc291cmNlIFVSTFMgZm9yIEhUVFAgb3BlcmF0aW9ucyB0aGF0IHRhcmdldCBzaW5nbGUgZW50aXR5XG4gKiBhbmQgbXVsdGktZW50aXR5IGVuZHBvaW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIdHRwUmVzb3VyY2VVcmxzIHtcbiAgLyoqXG4gICAqIFRoZSBVUkwgcGF0aCBmb3IgYSBzaW5nbGUgZW50aXR5IGVuZHBvaW50LCBlLmcsIGBzb21lLWFwaS1yb290L2hlcm8vYFxuICAgKiBzdWNoIGFzIHlvdSdkIHVzZSB0byBhZGQgYSBoZXJvLlxuICAgKiBFeGFtcGxlOiBgaHR0cENsaWVudC5wb3N0PEhlcm8+KCdzb21lLWFwaS1yb290L2hlcm8vJywgYWRkZWRIZXJvKWAuXG4gICAqIE5vdGUgdHJhaWxpbmcgc2xhc2ggKC8pLlxuICAgKi9cbiAgZW50aXR5UmVzb3VyY2VVcmw6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBVUkwgcGF0aCBmb3IgYSBtdWx0aXBsZS1lbnRpdHkgZW5kcG9pbnQsIGUuZywgYHNvbWUtYXBpLXJvb3QvaGVyb2VzL2BcbiAgICogc3VjaCBhcyB5b3UnZCB1c2Ugd2hlbiBnZXR0aW5nIGFsbCBoZXJvZXMuXG4gICAqIEV4YW1wbGU6IGBodHRwQ2xpZW50LmdldDxIZXJvW10+KCdzb21lLWFwaS1yb290L2hlcm9lcy8nKWBcbiAgICogTm90ZSB0cmFpbGluZyBzbGFzaCAoLykuXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2VVcmw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgYmFzZSBwYXJ0IG9mIGFuIEhUVFAgVVJMIGZvclxuICogc2luZ2xlIGVudGl0eSBvciBlbnRpdHkgY29sbGVjdGlvbiByZXNvdXJjZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSHR0cFVybEdlbmVyYXRvciB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGJhc2UgVVJMIGZvciBhIHNpbmdsZSBlbnRpdHkgcmVzb3VyY2UsXG4gICAqIGUuZy4sIHRoZSBiYXNlIFVSTCB0byBnZXQgYSBzaW5nbGUgaGVybyBieSBpdHMgaWRcbiAgICovXG4gIGFic3RyYWN0IGVudGl0eVJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGJhc2UgVVJMIGZvciBhIGNvbGxlY3Rpb24gcmVzb3VyY2UsXG4gICAqIGUuZy4sIHRoZSBiYXNlIFVSTCB0byBnZXQgYWxsIGhlcm9lc1xuICAgKi9cbiAgYWJzdHJhY3QgY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBrbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHNcbiAgICogQHBhcmFtIGVudGl0eUh0dHBSZXNvdXJjZVVybHMge0VudGl0eUh0dHBSZXNvdXJjZVVybHN9IHJlc291cmNlIHVybHMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlIG5hbWVzXG4gICAqL1xuICBhYnN0cmFjdCByZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5SHR0cFJlc291cmNlVXJscz86IEVudGl0eUh0dHBSZXNvdXJjZVVybHNcbiAgKTogdm9pZDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yIGltcGxlbWVudHMgSHR0cFVybEdlbmVyYXRvciB7XG4gIC8qKlxuICAgKiBLbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHMuXG4gICAqIEdlbmVyYXRvciBtZXRob2RzIHJldHVybnMgdGhlc2UgcmVzb3VyY2UgVVJMcyBmb3IgYSBnaXZlbiBlbnRpdHkgdHlwZSBuYW1lLlxuICAgKiBJZiB0aGUgcmVzb3VyY2VzIGZvciBhbiBlbnRpdHkgdHlwZSBuYW1lIGFyZSBub3Qga25vdywgaXQgZ2VuZXJhdGVzXG4gICAqIGFuZCBjYWNoZXMgYSByZXNvdXJjZSBuYW1lIGZvciBmdXR1cmUgdXNlXG4gICAqL1xuICBwcm90ZWN0ZWQga25vd25IdHRwUmVzb3VyY2VVcmxzOiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzID0ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVyYWxpemVyOiBQbHVyYWxpemVyKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgb3IgZ2VuZXJhdGUgdGhlIGVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgbmFtZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcm9vdDogc3RyaW5nXG4gICk6IEh0dHBSZXNvdXJjZVVybHMge1xuICAgIGxldCByZXNvdXJjZVVybHMgPSB0aGlzLmtub3duSHR0cFJlc291cmNlVXJsc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXJlc291cmNlVXJscykge1xuICAgICAgY29uc3QgblJvb3QgPSBub3JtYWxpemVSb290KHJvb3QpO1xuICAgICAgcmVzb3VyY2VVcmxzID0ge1xuICAgICAgICBlbnRpdHlSZXNvdXJjZVVybDogYCR7blJvb3R9LyR7ZW50aXR5TmFtZX0vYC50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBjb2xsZWN0aW9uUmVzb3VyY2VVcmw6IGAke25Sb290fS8ke3RoaXMucGx1cmFsaXplci5wbHVyYWxpemUoXG4gICAgICAgICAgZW50aXR5TmFtZVxuICAgICAgICApfS9gLnRvTG93ZXJDYXNlKCksXG4gICAgICB9O1xuICAgICAgdGhpcy5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoeyBbZW50aXR5TmFtZV06IHJlc291cmNlVXJscyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlVXJscztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHBhdGggdG8gYSBzaW5nbGUgZW50aXR5IHJlc291cmNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqIEByZXR1cm5zIGNvbXBsZXRlIHBhdGggdG8gcmVzb3VyY2UsIGUuZywgJ3NvbWUtYXBpL2hlcm8nXG4gICAqL1xuICBlbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VVcmxzKGVudGl0eU5hbWUsIHJvb3QpLmVudGl0eVJlc291cmNlVXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgcGF0aCB0byBhIG11bHRpcGxlIGVudGl0eSAoY29sbGVjdGlvbikgcmVzb3VyY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICogQHJldHVybnMgY29tcGxldGUgcGF0aCB0byByZXNvdXJjZSwgZS5nLCAnc29tZS1hcGkvaGVyb2VzJ1xuICAgKi9cbiAgY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZVVybHMoZW50aXR5TmFtZSwgcm9vdCkuY29sbGVjdGlvblJlc291cmNlVXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxsc1xuICAgKiBAcGFyYW0gZW50aXR5SHR0cFJlc291cmNlVXJscyB7RW50aXR5SHR0cFJlc291cmNlVXJsc30gcmVzb3VyY2UgdXJscyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGUgbmFtZXNcbiAgICogV2VsbC1mb3JtZWQgcmVzb3VyY2UgdXJscyBlbmQgaW4gYSAnLyc7XG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGRvZXMgbm90IGVuc3VyZSB0aGF0IHJlc291cmNlIHVybHMgYXJlIHdlbGwtZm9ybWVkLlxuICAgKi9cbiAgcmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eUh0dHBSZXNvdXJjZVVybHM6IEVudGl0eUh0dHBSZXNvdXJjZVVybHNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHMgPSB7XG4gICAgICAuLi50aGlzLmtub3duSHR0cFJlc291cmNlVXJscyxcbiAgICAgIC4uLihlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHx8IHt9KSxcbiAgICB9O1xuICB9XG59XG5cbi8qKiBSZW1vdmUgbGVhZGluZyAmIHRyYWlsaW5nIHNwYWNlcyBvciBzbGFzaGVzICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplUm9vdChyb290OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJvb3QucmVwbGFjZSgvXlsvXFxzXSt8Wy9cXHNdKyQvZywgJycpO1xufVxuIl19