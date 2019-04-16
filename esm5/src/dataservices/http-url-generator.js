import * as tslib_1 from "tslib";
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
        this.knownHttpResourceUrls = tslib_1.__assign({}, this.knownHttpResourceUrls, (entityHttpResourceUrls || {}));
    };
    DefaultHttpUrlGenerator = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Pluralizer])
    ], DefaultHttpUrlGenerator);
    return DefaultHttpUrlGenerator;
}());
export { DefaultHttpUrlGenerator };
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQVUsVUFBVSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFakQ7Ozs7O0dBS0c7QUFDSDtJQUFBO0lBRUEsQ0FBQztJQUFELDZCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7O0FBdUJEOzs7R0FHRztBQUNIO0lBQUE7SUFvQkEsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQXBCRCxJQW9CQzs7QUFHRDtJQVNFLGlDQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBUjFDOzs7OztXQUtHO1FBQ08sMEJBQXFCLEdBQTJCLEVBQUUsQ0FBQztJQUVoQixDQUFDO0lBRTlDOzs7O09BSUc7SUFDTyxpREFBZSxHQUF6QixVQUNFLFVBQWtCLEVBQ2xCLElBQVk7O1FBRVosSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLFlBQVksR0FBRztnQkFDYixpQkFBaUIsRUFBRSxDQUFHLEtBQUssU0FBSSxVQUFVLE1BQUcsQ0FBQSxDQUFDLFdBQVcsRUFBRTtnQkFDMUQscUJBQXFCLEVBQUUsQ0FBRyxLQUFLLFNBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQzFELFVBQVUsQ0FDWCxNQUFHLENBQUEsQ0FBQyxXQUFXLEVBQUU7YUFDbkIsQ0FBQztZQUNGLElBQUksQ0FBQyx3QkFBd0IsV0FBRyxHQUFDLFVBQVUsSUFBRyxZQUFZLE1BQUcsQ0FBQztTQUMvRDtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGdEQUFjLEdBQWQsVUFBZSxVQUFrQixFQUFFLElBQVk7UUFDN0MsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxvREFBa0IsR0FBbEIsVUFBbUIsVUFBa0IsRUFBRSxJQUFZO1FBQ2pELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsMERBQXdCLEdBQXhCLFVBQ0Usc0JBQThDO1FBRTlDLElBQUksQ0FBQyxxQkFBcUIsd0JBQ3JCLElBQUksQ0FBQyxxQkFBcUIsRUFDMUIsQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUMsQ0FDbEMsQ0FBQztJQUNKLENBQUM7SUFuRVUsdUJBQXVCO1FBRG5DLFVBQVUsRUFBRTtpREFVcUIsVUFBVTtPQVQvQix1QkFBdUIsQ0FvRW5DO0lBQUQsOEJBQUM7Q0FBQSxBQXBFRCxJQW9FQztTQXBFWSx1QkFBdUI7QUFzRXBDLGtEQUFrRDtBQUNsRCxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQVk7SUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1cmFsaXplciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEtub3duIHJlc291cmNlIFVSTFMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlcy5cbiAqIEVhY2ggZW50aXR5J3MgcmVzb3VyY2UgVVJMUyBhcmUgZW5kcG9pbnRzIHRoYXRcbiAqIHRhcmdldCBzaW5nbGUgZW50aXR5IGFuZCBtdWx0aS1lbnRpdHkgSFRUUCBvcGVyYXRpb25zLlxuICogVXNlZCBieSB0aGUgYERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yYC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudGl0eUh0dHBSZXNvdXJjZVVybHMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogSHR0cFJlc291cmNlVXJscztcbn1cblxuLyoqXG4gKiBSZXNvdXJjZSBVUkxTIGZvciBIVFRQIG9wZXJhdGlvbnMgdGhhdCB0YXJnZXQgc2luZ2xlIGVudGl0eVxuICogYW5kIG11bHRpLWVudGl0eSBlbmRwb2ludHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSHR0cFJlc291cmNlVXJscyB7XG4gIC8qKlxuICAgKiBUaGUgVVJMIHBhdGggZm9yIGEgc2luZ2xlIGVudGl0eSBlbmRwb2ludCwgZS5nLCBgc29tZS1hcGktcm9vdC9oZXJvL2BcbiAgICogc3VjaCBhcyB5b3UnZCB1c2UgdG8gYWRkIGEgaGVyby5cbiAgICogRXhhbXBsZTogYGh0dHBDbGllbnQucG9zdDxIZXJvPignc29tZS1hcGktcm9vdC9oZXJvLycsIGFkZGVkSGVybylgLlxuICAgKiBOb3RlIHRyYWlsaW5nIHNsYXNoICgvKS5cbiAgICovXG4gIGVudGl0eVJlc291cmNlVXJsOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgVVJMIHBhdGggZm9yIGEgbXVsdGlwbGUtZW50aXR5IGVuZHBvaW50LCBlLmcsIGBzb21lLWFwaS1yb290L2hlcm9lcy9gXG4gICAqIHN1Y2ggYXMgeW91J2QgdXNlIHdoZW4gZ2V0dGluZyBhbGwgaGVyb2VzLlxuICAgKiBFeGFtcGxlOiBgaHR0cENsaWVudC5nZXQ8SGVyb1tdPignc29tZS1hcGktcm9vdC9oZXJvZXMvJylgXG4gICAqIE5vdGUgdHJhaWxpbmcgc2xhc2ggKC8pLlxuICAgKi9cbiAgY29sbGVjdGlvblJlc291cmNlVXJsOiBzdHJpbmc7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIGJhc2UgcGFydCBvZiBhbiBIVFRQIFVSTCBmb3JcbiAqIHNpbmdsZSBlbnRpdHkgb3IgZW50aXR5IGNvbGxlY3Rpb24gcmVzb3VyY2VcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEh0dHBVcmxHZW5lcmF0b3Ige1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBiYXNlIFVSTCBmb3IgYSBzaW5nbGUgZW50aXR5IHJlc291cmNlLFxuICAgKiBlLmcuLCB0aGUgYmFzZSBVUkwgdG8gZ2V0IGEgc2luZ2xlIGhlcm8gYnkgaXRzIGlkXG4gICAqL1xuICBhYnN0cmFjdCBlbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBiYXNlIFVSTCBmb3IgYSBjb2xsZWN0aW9uIHJlc291cmNlLFxuICAgKiBlLmcuLCB0aGUgYmFzZSBVUkwgdG8gZ2V0IGFsbCBoZXJvZXNcbiAgICovXG4gIGFic3RyYWN0IGNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKi9cbiAgYWJzdHJhY3QgcmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eUh0dHBSZXNvdXJjZVVybHM/OiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzXG4gICk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SHR0cFVybEdlbmVyYXRvciBpbXBsZW1lbnRzIEh0dHBVcmxHZW5lcmF0b3Ige1xuICAvKipcbiAgICogS25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzLlxuICAgKiBHZW5lcmF0b3IgbWV0aG9kcyByZXR1cm5zIHRoZXNlIHJlc291cmNlIFVSTHMgZm9yIGEgZ2l2ZW4gZW50aXR5IHR5cGUgbmFtZS5cbiAgICogSWYgdGhlIHJlc291cmNlcyBmb3IgYW4gZW50aXR5IHR5cGUgbmFtZSBhcmUgbm90IGtub3csIGl0IGdlbmVyYXRlc1xuICAgKiBhbmQgY2FjaGVzIGEgcmVzb3VyY2UgbmFtZSBmb3IgZnV0dXJlIHVzZVxuICAgKi9cbiAgcHJvdGVjdGVkIGtub3duSHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJscyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1cmFsaXplcjogUGx1cmFsaXplcikge31cblxuICAvKipcbiAgICogR2V0IG9yIGdlbmVyYXRlIHRoZSBlbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlIG5hbWVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICovXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHJvb3Q6IHN0cmluZ1xuICApOiBIdHRwUmVzb3VyY2VVcmxzIHtcbiAgICBsZXQgcmVzb3VyY2VVcmxzID0gdGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFyZXNvdXJjZVVybHMpIHtcbiAgICAgIGNvbnN0IG5Sb290ID0gbm9ybWFsaXplUm9vdChyb290KTtcbiAgICAgIHJlc291cmNlVXJscyA9IHtcbiAgICAgICAgZW50aXR5UmVzb3VyY2VVcmw6IGAke25Sb290fS8ke2VudGl0eU5hbWV9L2AudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgY29sbGVjdGlvblJlc291cmNlVXJsOiBgJHtuUm9vdH0vJHt0aGlzLnBsdXJhbGl6ZXIucGx1cmFsaXplKFxuICAgICAgICAgIGVudGl0eU5hbWVcbiAgICAgICAgKX0vYC50b0xvd2VyQ2FzZSgpLFxuICAgICAgfTtcbiAgICAgIHRoaXMucmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKHsgW2VudGl0eU5hbWVdOiByZXNvdXJjZVVybHMgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXNvdXJjZVVybHM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgc2luZ2xlIGVudGl0eSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvJ1xuICAgKi9cbiAgZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290KS5lbnRpdHlSZXNvdXJjZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHBhdGggdG8gYSBtdWx0aXBsZSBlbnRpdHkgKGNvbGxlY3Rpb24pIHJlc291cmNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqIEByZXR1cm5zIGNvbXBsZXRlIHBhdGggdG8gcmVzb3VyY2UsIGUuZywgJ3NvbWUtYXBpL2hlcm9lcydcbiAgICovXG4gIGNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VVcmxzKGVudGl0eU5hbWUsIHJvb3QpLmNvbGxlY3Rpb25SZXNvdXJjZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBrbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHNcbiAgICogQHBhcmFtIGVudGl0eUh0dHBSZXNvdXJjZVVybHMge0VudGl0eUh0dHBSZXNvdXJjZVVybHN9IHJlc291cmNlIHVybHMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlIG5hbWVzXG4gICAqIFdlbGwtZm9ybWVkIHJlc291cmNlIHVybHMgZW5kIGluIGEgJy8nO1xuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBkb2VzIG5vdCBlbnN1cmUgdGhhdCByZXNvdXJjZSB1cmxzIGFyZSB3ZWxsLWZvcm1lZC5cbiAgICovXG4gIHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzOiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzXG4gICk6IHZvaWQge1xuICAgIHRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzID0ge1xuICAgICAgLi4udGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHMsXG4gICAgICAuLi4oZW50aXR5SHR0cFJlc291cmNlVXJscyB8fCB7fSksXG4gICAgfTtcbiAgfVxufVxuXG4vKiogUmVtb3ZlIGxlYWRpbmcgJiB0cmFpbGluZyBzcGFjZXMgb3Igc2xhc2hlcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVJvb3Qocm9vdDogc3RyaW5nKSB7XG4gIHJldHVybiByb290LnJlcGxhY2UoL15bXFwvXFxzXSt8W1xcL1xcc10rJC9nLCAnJyk7XG59XG4iXX0=