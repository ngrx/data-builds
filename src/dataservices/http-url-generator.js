(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dataservices/http-url-generator", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/utils/interfaces"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
    /**
     * Known resource URLS for specific entity types.
     * Each entity's resource URLS are endpoints that
     * target single entity and multi-entity HTTP operations.
     * Used by the `DefaultHttpUrlGenerator`.
     */
    class EntityHttpResourceUrls {
    }
    exports.EntityHttpResourceUrls = EntityHttpResourceUrls;
    /**
     * Generate the base part of an HTTP URL for
     * single entity or entity collection resource
     */
    class HttpUrlGenerator {
    }
    exports.HttpUrlGenerator = HttpUrlGenerator;
    let DefaultHttpUrlGenerator = class DefaultHttpUrlGenerator {
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
    };
    DefaultHttpUrlGenerator = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [interfaces_1.Pluralizer])
    ], DefaultHttpUrlGenerator);
    exports.DefaultHttpUrlGenerator = DefaultHttpUrlGenerator;
    /** Remove leading & trailing spaces or slashes */
    function normalizeRoot(root) {
        return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
    }
    exports.normalizeRoot = normalizeRoot;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLHdDQUEyQztJQUMzQyxnRUFBaUQ7SUFFakQ7Ozs7O09BS0c7SUFDSCxNQUFzQixzQkFBc0I7S0FFM0M7SUFGRCx3REFFQztJQXVCRDs7O09BR0c7SUFDSCxNQUFzQixnQkFBZ0I7S0FvQnJDO0lBcEJELDRDQW9CQztJQUdELElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXVCO1FBU2xDLFlBQW9CLFVBQXNCO1lBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7WUFSMUM7Ozs7O2VBS0c7WUFDTywwQkFBcUIsR0FBMkIsRUFBRSxDQUFDO1FBRWhCLENBQUM7UUFFOUM7Ozs7V0FJRztRQUNPLGVBQWUsQ0FDdkIsVUFBa0IsRUFDbEIsSUFBWTtZQUVaLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNqQixNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLFlBQVksR0FBRztvQkFDYixpQkFBaUIsRUFBRSxHQUFHLEtBQUssSUFBSSxVQUFVLEdBQUcsQ0FBQyxXQUFXLEVBQUU7b0JBQzFELHFCQUFxQixFQUFFLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMxRCxVQUFVLENBQ1gsR0FBRyxDQUFDLFdBQVcsRUFBRTtpQkFDbkIsQ0FBQztnQkFDRixJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7YUFDL0Q7WUFDRCxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCxjQUFjLENBQUMsVUFBa0IsRUFBRSxJQUFZO1lBQzdDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUM7UUFDbEUsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0JBQWtCLENBQUMsVUFBa0IsRUFBRSxJQUFZO1lBQ2pELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUM7UUFDdEUsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsd0JBQXdCLENBQ3RCLHNCQUE4QztZQUU5QyxJQUFJLENBQUMscUJBQXFCLG1DQUNyQixJQUFJLENBQUMscUJBQXFCLEdBQzFCLENBQUMsc0JBQXNCLElBQUksRUFBRSxDQUFDLENBQ2xDLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQTtJQXBFWSx1QkFBdUI7UUFEbkMsaUJBQVUsRUFBRTtpREFVcUIsdUJBQVU7T0FUL0IsdUJBQXVCLENBb0VuQztJQXBFWSwwREFBdUI7SUFzRXBDLGtEQUFrRDtJQUNsRCxTQUFnQixhQUFhLENBQUMsSUFBWTtRQUN4QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUZELHNDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1cmFsaXplciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEtub3duIHJlc291cmNlIFVSTFMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlcy5cbiAqIEVhY2ggZW50aXR5J3MgcmVzb3VyY2UgVVJMUyBhcmUgZW5kcG9pbnRzIHRoYXRcbiAqIHRhcmdldCBzaW5nbGUgZW50aXR5IGFuZCBtdWx0aS1lbnRpdHkgSFRUUCBvcGVyYXRpb25zLlxuICogVXNlZCBieSB0aGUgYERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yYC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudGl0eUh0dHBSZXNvdXJjZVVybHMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogSHR0cFJlc291cmNlVXJscztcbn1cblxuLyoqXG4gKiBSZXNvdXJjZSBVUkxTIGZvciBIVFRQIG9wZXJhdGlvbnMgdGhhdCB0YXJnZXQgc2luZ2xlIGVudGl0eVxuICogYW5kIG11bHRpLWVudGl0eSBlbmRwb2ludHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSHR0cFJlc291cmNlVXJscyB7XG4gIC8qKlxuICAgKiBUaGUgVVJMIHBhdGggZm9yIGEgc2luZ2xlIGVudGl0eSBlbmRwb2ludCwgZS5nLCBgc29tZS1hcGktcm9vdC9oZXJvL2BcbiAgICogc3VjaCBhcyB5b3UnZCB1c2UgdG8gYWRkIGEgaGVyby5cbiAgICogRXhhbXBsZTogYGh0dHBDbGllbnQucG9zdDxIZXJvPignc29tZS1hcGktcm9vdC9oZXJvLycsIGFkZGVkSGVybylgLlxuICAgKiBOb3RlIHRyYWlsaW5nIHNsYXNoICgvKS5cbiAgICovXG4gIGVudGl0eVJlc291cmNlVXJsOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgVVJMIHBhdGggZm9yIGEgbXVsdGlwbGUtZW50aXR5IGVuZHBvaW50LCBlLmcsIGBzb21lLWFwaS1yb290L2hlcm9lcy9gXG4gICAqIHN1Y2ggYXMgeW91J2QgdXNlIHdoZW4gZ2V0dGluZyBhbGwgaGVyb2VzLlxuICAgKiBFeGFtcGxlOiBgaHR0cENsaWVudC5nZXQ8SGVyb1tdPignc29tZS1hcGktcm9vdC9oZXJvZXMvJylgXG4gICAqIE5vdGUgdHJhaWxpbmcgc2xhc2ggKC8pLlxuICAgKi9cbiAgY29sbGVjdGlvblJlc291cmNlVXJsOiBzdHJpbmc7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIGJhc2UgcGFydCBvZiBhbiBIVFRQIFVSTCBmb3JcbiAqIHNpbmdsZSBlbnRpdHkgb3IgZW50aXR5IGNvbGxlY3Rpb24gcmVzb3VyY2VcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEh0dHBVcmxHZW5lcmF0b3Ige1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBiYXNlIFVSTCBmb3IgYSBzaW5nbGUgZW50aXR5IHJlc291cmNlLFxuICAgKiBlLmcuLCB0aGUgYmFzZSBVUkwgdG8gZ2V0IGEgc2luZ2xlIGhlcm8gYnkgaXRzIGlkXG4gICAqL1xuICBhYnN0cmFjdCBlbnRpdHlSZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBiYXNlIFVSTCBmb3IgYSBjb2xsZWN0aW9uIHJlc291cmNlLFxuICAgKiBlLmcuLCB0aGUgYmFzZSBVUkwgdG8gZ2V0IGFsbCBoZXJvZXNcbiAgICovXG4gIGFic3RyYWN0IGNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogUmVnaXN0ZXIga25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzXG4gICAqIEBwYXJhbSBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHtFbnRpdHlIdHRwUmVzb3VyY2VVcmxzfSByZXNvdXJjZSB1cmxzIGZvciBzcGVjaWZpYyBlbnRpdHkgdHlwZSBuYW1lc1xuICAgKi9cbiAgYWJzdHJhY3QgcmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eUh0dHBSZXNvdXJjZVVybHM/OiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzXG4gICk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SHR0cFVybEdlbmVyYXRvciBpbXBsZW1lbnRzIEh0dHBVcmxHZW5lcmF0b3Ige1xuICAvKipcbiAgICogS25vd24gc2luZ2xlLWVudGl0eSBhbmQgY29sbGVjdGlvbiByZXNvdXJjZSBVUkxzIGZvciBIVFRQIGNhbGxzLlxuICAgKiBHZW5lcmF0b3IgbWV0aG9kcyByZXR1cm5zIHRoZXNlIHJlc291cmNlIFVSTHMgZm9yIGEgZ2l2ZW4gZW50aXR5IHR5cGUgbmFtZS5cbiAgICogSWYgdGhlIHJlc291cmNlcyBmb3IgYW4gZW50aXR5IHR5cGUgbmFtZSBhcmUgbm90IGtub3csIGl0IGdlbmVyYXRlc1xuICAgKiBhbmQgY2FjaGVzIGEgcmVzb3VyY2UgbmFtZSBmb3IgZnV0dXJlIHVzZVxuICAgKi9cbiAgcHJvdGVjdGVkIGtub3duSHR0cFJlc291cmNlVXJsczogRW50aXR5SHR0cFJlc291cmNlVXJscyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1cmFsaXplcjogUGx1cmFsaXplcikge31cblxuICAvKipcbiAgICogR2V0IG9yIGdlbmVyYXRlIHRoZSBlbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlIG5hbWVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICovXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZVVybHMoXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHJvb3Q6IHN0cmluZ1xuICApOiBIdHRwUmVzb3VyY2VVcmxzIHtcbiAgICBsZXQgcmVzb3VyY2VVcmxzID0gdGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFyZXNvdXJjZVVybHMpIHtcbiAgICAgIGNvbnN0IG5Sb290ID0gbm9ybWFsaXplUm9vdChyb290KTtcbiAgICAgIHJlc291cmNlVXJscyA9IHtcbiAgICAgICAgZW50aXR5UmVzb3VyY2VVcmw6IGAke25Sb290fS8ke2VudGl0eU5hbWV9L2AudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgY29sbGVjdGlvblJlc291cmNlVXJsOiBgJHtuUm9vdH0vJHt0aGlzLnBsdXJhbGl6ZXIucGx1cmFsaXplKFxuICAgICAgICAgIGVudGl0eU5hbWVcbiAgICAgICAgKX0vYC50b0xvd2VyQ2FzZSgpLFxuICAgICAgfTtcbiAgICAgIHRoaXMucmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKHsgW2VudGl0eU5hbWVdOiByZXNvdXJjZVVybHMgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXNvdXJjZVVybHM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBwYXRoIHRvIGEgc2luZ2xlIGVudGl0eSByZXNvdXJjZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSwgZS5nLCAnSGVybydcbiAgICogQHBhcmFtIHJvb3Qge3N0cmluZ30gUm9vdCBwYXRoIHRvIHRoZSByZXNvdXJjZSwgZS5nLiwgJ3NvbWUtYXBpYFxuICAgKiBAcmV0dXJucyBjb21wbGV0ZSBwYXRoIHRvIHJlc291cmNlLCBlLmcsICdzb21lLWFwaS9oZXJvJ1xuICAgKi9cbiAgZW50aXR5UmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290KS5lbnRpdHlSZXNvdXJjZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHBhdGggdG8gYSBtdWx0aXBsZSBlbnRpdHkgKGNvbGxlY3Rpb24pIHJlc291cmNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqIEByZXR1cm5zIGNvbXBsZXRlIHBhdGggdG8gcmVzb3VyY2UsIGUuZywgJ3NvbWUtYXBpL2hlcm9lcydcbiAgICovXG4gIGNvbGxlY3Rpb25SZXNvdXJjZShlbnRpdHlOYW1lOiBzdHJpbmcsIHJvb3Q6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2VVcmxzKGVudGl0eU5hbWUsIHJvb3QpLmNvbGxlY3Rpb25SZXNvdXJjZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBrbm93biBzaW5nbGUtZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIEhUVFAgY2FsbHNcbiAgICogQHBhcmFtIGVudGl0eUh0dHBSZXNvdXJjZVVybHMge0VudGl0eUh0dHBSZXNvdXJjZVVybHN9IHJlc291cmNlIHVybHMgZm9yIHNwZWNpZmljIGVudGl0eSB0eXBlIG5hbWVzXG4gICAqIFdlbGwtZm9ybWVkIHJlc291cmNlIHVybHMgZW5kIGluIGEgJy8nO1xuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBkb2VzIG5vdCBlbnN1cmUgdGhhdCByZXNvdXJjZSB1cmxzIGFyZSB3ZWxsLWZvcm1lZC5cbiAgICovXG4gIHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzOiBFbnRpdHlIdHRwUmVzb3VyY2VVcmxzXG4gICk6IHZvaWQge1xuICAgIHRoaXMua25vd25IdHRwUmVzb3VyY2VVcmxzID0ge1xuICAgICAgLi4udGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHMsXG4gICAgICAuLi4oZW50aXR5SHR0cFJlc291cmNlVXJscyB8fCB7fSksXG4gICAgfTtcbiAgfVxufVxuXG4vKiogUmVtb3ZlIGxlYWRpbmcgJiB0cmFpbGluZyBzcGFjZXMgb3Igc2xhc2hlcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVJvb3Qocm9vdDogc3RyaW5nKSB7XG4gIHJldHVybiByb290LnJlcGxhY2UoL15bXFwvXFxzXSt8W1xcL1xcc10rJC9nLCAnJyk7XG59XG4iXX0=