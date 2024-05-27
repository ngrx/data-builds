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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, deps: [{ token: i1.Pluralizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: DefaultHttpUrlGenerator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Pluralizer }] });
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[/\s]+|[/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUczQzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0Isc0JBQXNCO0NBRTNDO0FBdUJEOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IsZ0JBQWdCO0NBd0JyQztBQUdELE1BQU0sT0FBTyx1QkFBdUI7SUFTbEMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVIxQzs7Ozs7V0FLRztRQUNPLDBCQUFxQixHQUEyQixFQUFFLENBQUM7SUFFaEIsQ0FBQztJQUU5Qzs7OztPQUlHO0lBQ08sZUFBZSxDQUN2QixVQUFrQixFQUNsQixJQUFZLEVBQ1osc0JBQXNCLEdBQUcsS0FBSztRQUU5QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xCLE1BQU0sS0FBSyxHQUFHLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRSxZQUFZLEdBQUc7Z0JBQ2IsaUJBQWlCLEVBQUUsR0FBRyxLQUFLLElBQUksVUFBVSxHQUFHLENBQUMsV0FBVyxFQUFFO2dCQUMxRCxxQkFBcUIsRUFBRSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDMUQsVUFBVSxDQUNYLEdBQUcsQ0FBQyxXQUFXLEVBQUU7YUFDbkIsQ0FBQztZQUNGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsY0FBYyxDQUNaLFVBQWtCLEVBQ2xCLElBQVksRUFDWixzQkFBK0I7UUFFL0IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLENBQUM7YUFDbEUsaUJBQWlCLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsa0JBQWtCLENBQUMsVUFBa0IsRUFBRSxJQUFZO1FBQ2pELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsd0JBQXdCLENBQ3RCLHNCQUE4QztRQUU5QyxJQUFJLENBQUMscUJBQXFCLEdBQUc7WUFDM0IsR0FBRyxJQUFJLENBQUMscUJBQXFCO1lBQzdCLEdBQUcsQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUM7U0FDbEMsQ0FBQztJQUNKLENBQUM7aUlBekVVLHVCQUF1QjtxSUFBdkIsdUJBQXVCOzsyRkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVOztBQTZFWCxrREFBa0Q7QUFDbEQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxJQUFZO0lBQ3hDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1cmFsaXplciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEtub3duIHJlc291cmNlIFVSTFMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlcy5cbiAqIEVhY2ggZW50aXR5J3MgcmVzb3VyY2UgVVJMUyBhcmUgZW5kcG9pbnRzIHRoYXRcbiAqIHRhcmdldCBzaW5nbGUgZW50aXR5IGFuZCBtdWx0aS1lbnRpdHkgSFRUUCBvcGVyYXRpb25zLlxuICogVXNlZCBieSB0aGUgYERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yYC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudGl0eUh0dHBSZXNvdXJjZVVybHMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogSHR0cFJlc291cmNlVXJscztcbn1cblxuLyoqXG4gKiBSZXNvdXJjZSBVUkxTIGZvciBIVFRQIG9wZXJhdGlvbnMgdGhhdCB0YXJnZXQgc2luZ2xlIGVudGl0eVxuICogYW5kIG11bHRpLWVudGl0eSBlbmRwb2ludHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSHR0cFJlc291cmNlVXJscyB7XG4gIC8qKlxuICAgKiBUaGUgVVJMIHBhdGggZm9yIGEgc2luZ2xlIGVudGl0eSBlbmRwb2ludCwgZS5nLCBgc29tZS1hcGktcm9vdC9oZXJvL2BcbiAgICogc3VjaCBhcyB5b3UnZCB1c2UgdG8gYWRkIGEgaGVyby5cbiAgICogRXhhbXBsZTogYGh0dHBDbGllbnQucG9zdDxIZXJvPignc29tZS1hcGktcm9vdC9oZXJvLycsIGFkZGVkSGVybylgLlxuICAgKiBOb3RlIHRyYWlsaW5nIHNsYXNoICgvKS5cbiAgICovXG4gIGVudGl0eVJlc291cmNlVXJsOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgVVJMIHBhdGggZm9yIGEgbXVsdGlwbGUtZW50aXR5IGVuZHBvaW50LCBlLmcsIGBzb21lLWFwaS1yb290L2hlcm9lcy9gXG4gICAqIHN1Y2ggYXMgeW91J2QgdXNlIHdoZW4gZ2V0dGluZyBhbGwgaGVyb2VzLlxuICAgKiBFeGFtcGxlOiBgaHR0cENsaWVudC5nZXQ8SGVyb1tdPignc29tZS1hcGktcm9vdC9oZXJvZXMvJylgXG4gICAqIE5vdGUgdHJhaWxpbmcgc2xhc2ggKC8pLlxuICAgKi9cbiAgY29sbGVjdGlvblJlc291cmNlVXJsOiBzdHJpbmc7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIGJhc2UgcGFydCBvZiBhbiBIVFRQIFVSTCBmb3JcbiAqIHNpbmdsZSBlbnRpdHkgb3IgZW50aXR5IGNvbGxlY3Rpb24gcmVzb3VyY2VcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEh0dHBVcmxHZW5lcmF0b3Ige1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBiYXNlIFVSTCBmb3IgYSBzaW5nbGUgZW50aXR5IHJlc291cmNlLFxuICAgKiBlLmcuLCB0aGUgYmFzZSBVUkwgdG8gZ2V0IGEgc2luZ2xlIGhlcm8gYnkgaXRzIGlkXG4gICAqL1xuICBhYnN0cmFjdCBlbnRpdHlSZXNvdXJjZShcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcm9vdDogc3RyaW5nLFxuICAgIHRyYWlsaW5nU2xhc2hFbmRwb2ludHM6IGJvb2xlYW5cbiAgKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGJhc2UgVVJMIGZvciBhIGNvbGxlY3Rpb24gcmVzb3VyY2UsXG4gICAqIGUuZy4sIHRoZSBiYXNlIFVSTCB0byBnZXQgYWxsIGhlcm9lc1xuICAgKi9cbiAgYWJzdHJhY3QgY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBrbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHNcbiAgICogQHBhcmFtIGVudGl0eUh0dHBSZXNvdXJjZVVybHMge0VudGl0eUh0dHBSZXNvdXJjZVVybHN9IHJlc291cmNlIHVybHMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlIG5hbWVzXG4gICAqL1xuICBhYnN0cmFjdCByZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5SHR0cFJlc291cmNlVXJscz86IEVudGl0eUh0dHBSZXNvdXJjZVVybHNcbiAgKTogdm9pZDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yIGltcGxlbWVudHMgSHR0cFVybEdlbmVyYXRvciB7XG4gIC8qKlxuICAgKiBLbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHMuXG4gICAqIEdlbmVyYXRvciBtZXRob2RzIHJldHVybnMgdGhlc2UgcmVzb3VyY2UgVVJMcyBmb3IgYSBnaXZlbiBlbnRpdHkgdHlwZSBuYW1lLlxuICAgKiBJZiB0aGUgcmVzb3VyY2VzIGZvciBhbiBlbnRpdHkgdHlwZSBuYW1lIGFyZSBub3Qga25vdywgaXQgZ2VuZXJhdGVzXG4gICAqIGFuZCBjYWNoZXMgYSByZXNvdXJjZSBuYW1lIGZvciBmdXR1cmUgdXNlXG4gICAqL1xuICBwcm90ZWN0ZWQga25vd25IdHRwUmVzb3VyY2VVcmxzOiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzID0ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVyYWxpemVyOiBQbHVyYWxpemVyKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgb3IgZ2VuZXJhdGUgdGhlIGVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciB0aGUgZ2l2ZW4gZW50aXR5IHR5cGUgbmFtZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcm9vdDogc3RyaW5nLFxuICAgIHRyYWlsaW5nU2xhc2hFbmRwb2ludHMgPSBmYWxzZVxuICApOiBIdHRwUmVzb3VyY2VVcmxzIHtcbiAgICBsZXQgcmVzb3VyY2VVcmxzID0gdGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFyZXNvdXJjZVVybHMpIHtcbiAgICAgIGNvbnN0IG5Sb290ID0gdHJhaWxpbmdTbGFzaEVuZHBvaW50cyA/IHJvb3QgOiBub3JtYWxpemVSb290KHJvb3QpO1xuICAgICAgcmVzb3VyY2VVcmxzID0ge1xuICAgICAgICBlbnRpdHlSZXNvdXJjZVVybDogYCR7blJvb3R9LyR7ZW50aXR5TmFtZX0vYC50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBjb2xsZWN0aW9uUmVzb3VyY2VVcmw6IGAke25Sb290fS8ke3RoaXMucGx1cmFsaXplci5wbHVyYWxpemUoXG4gICAgICAgICAgZW50aXR5TmFtZVxuICAgICAgICApfS9gLnRvTG93ZXJDYXNlKCksXG4gICAgICB9O1xuICAgICAgdGhpcy5yZWdpc3Rlckh0dHBSZXNvdXJjZVVybHMoeyBbZW50aXR5TmFtZV06IHJlc291cmNlVXJscyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlVXJscztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHBhdGggdG8gYSBzaW5nbGUgZW50aXR5IHJlc291cmNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqIEByZXR1cm5zIGNvbXBsZXRlIHBhdGggdG8gcmVzb3VyY2UsIGUuZywgJ3NvbWUtYXBpL2hlcm8nXG4gICAqL1xuICBlbnRpdHlSZXNvdXJjZShcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcm9vdDogc3RyaW5nLFxuICAgIHRyYWlsaW5nU2xhc2hFbmRwb2ludHM6IGJvb2xlYW5cbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZVVybHMoZW50aXR5TmFtZSwgcm9vdCwgdHJhaWxpbmdTbGFzaEVuZHBvaW50cylcbiAgICAgIC5lbnRpdHlSZXNvdXJjZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHBhdGggdG8gYSBtdWx0aXBsZSBlbnRpdHkgKGNvbGxlY3Rpb24pIHJlc291cmNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqIEByZXR1cm5zIGNvbXBsZXRlIHBhdGggdG8gcmVzb3VyY2UsIGUuZywgJ3NvbWUtYXBpL2hlcm9lcydcbiAgICovXG4gIGNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VVcmxzKGVudGl0eU5hbWUsIHJvb3QpLmNvbGxlY3Rpb25SZXNvdXJjZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBrbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHNcbiAgICogQHBhcmFtIGVudGl0eUh0dHBSZXNvdXJjZVVybHMge0VudGl0eUh0dHBSZXNvdXJjZVVybHN9IHJlc291cmNlIHVybHMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlIG5hbWVzXG4gICAqIFdlbGwtZm9ybWVkIHJlc291cmNlIHVybHMgZW5kIGluIGEgJy8nO1xuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBkb2VzIG5vdCBlbnN1cmUgdGhhdCByZXNvdXJjZSB1cmxzIGFyZSB3ZWxsLWZvcm1lZC5cbiAgICovXG4gIHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzOiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzXG4gICk6IHZvaWQge1xuICAgIHRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzID0ge1xuICAgICAgLi4udGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHMsXG4gICAgICAuLi4oZW50aXR5SHR0cFJlc291cmNlVXJscyB8fCB7fSksXG4gICAgfTtcbiAgfVxufVxuXG4vKiogUmVtb3ZlIGxlYWRpbmcgJiB0cmFpbGluZyBzcGFjZXMgb3Igc2xhc2hlcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVJvb3Qocm9vdDogc3RyaW5nKSB7XG4gIHJldHVybiByb290LnJlcGxhY2UoL15bL1xcc10rfFsvXFxzXSskL2csICcnKTtcbn1cbiJdfQ==