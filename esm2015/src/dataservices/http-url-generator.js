/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/http-url-generator.ts
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
    { type: Injectable },
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
//# sourceMappingURL=http-url-generator.js.map