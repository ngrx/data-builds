var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/selectors/entity-selectors.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { createSelector } from '@ngrx/store';
import { ENTITY_CACHE_SELECTOR_TOKEN, createEntityCacheSelector, } from './entity-cache-selector';
import { ENTITY_CACHE_NAME } from '../reducers/constants';
import { EntityCollectionCreator } from '../reducers/entity-collection-creator';
/**
 * The selector functions for entity collection members,
 * Selects from the entity collection to the collection member
 * Contrast with {EntitySelectors}.
 * @record
 * @template T
 */
export function CollectionSelectors() { }
if (false) {
    /**
     * Count of entities in the cached collection.
     * @type {?}
     */
    CollectionSelectors.prototype.selectCount;
    /**
     * All entities in the cached collection.
     * @type {?}
     */
    CollectionSelectors.prototype.selectEntities;
    /**
     * Map of entity keys to entities
     * @type {?}
     */
    CollectionSelectors.prototype.selectEntityMap;
    /**
     * Filter pattern applied by the entity collection's filter function
     * @type {?}
     */
    CollectionSelectors.prototype.selectFilter;
    /**
     * Entities in the cached collection that pass the filter function
     * @type {?}
     */
    CollectionSelectors.prototype.selectFilteredEntities;
    /**
     * Keys of the cached collection, in the collection's native sort order
     * @type {?}
     */
    CollectionSelectors.prototype.selectKeys;
    /**
     * True when the collection has been fully loaded.
     * @type {?}
     */
    CollectionSelectors.prototype.selectLoaded;
    /**
     * True when a multi-entity query command is in progress.
     * @type {?}
     */
    CollectionSelectors.prototype.selectLoading;
    /**
     * ChangeState (including original values) of entities with unsaved changes
     * @type {?}
     */
    CollectionSelectors.prototype.selectChangeState;
    /* Skipping unhandled member: readonly [selector: string]: any;*/
}
/**
 * The selector functions for entity collection members,
 * Selects from store root, through EntityCache, to the entity collection member
 * Contrast with {CollectionSelectors}.
 * @record
 * @template T
 */
export function EntitySelectors() { }
if (false) {
    /**
     * Name of the entity collection for these selectors
     * @type {?}
     */
    EntitySelectors.prototype.entityName;
    /**
     * The cached EntityCollection itself
     * @type {?}
     */
    EntitySelectors.prototype.selectCollection;
    /**
     * Count of entities in the cached collection.
     * @type {?}
     */
    EntitySelectors.prototype.selectCount;
    /**
     * All entities in the cached collection.
     * @type {?}
     */
    EntitySelectors.prototype.selectEntities;
    /**
     * The EntityCache
     * @type {?}
     */
    EntitySelectors.prototype.selectEntityCache;
    /**
     * Map of entity keys to entities
     * @type {?}
     */
    EntitySelectors.prototype.selectEntityMap;
    /**
     * Filter pattern applied by the entity collection's filter function
     * @type {?}
     */
    EntitySelectors.prototype.selectFilter;
    /**
     * Entities in the cached collection that pass the filter function
     * @type {?}
     */
    EntitySelectors.prototype.selectFilteredEntities;
    /**
     * Keys of the cached collection, in the collection's native sort order
     * @type {?}
     */
    EntitySelectors.prototype.selectKeys;
    /**
     * True when the collection has been fully loaded.
     * @type {?}
     */
    EntitySelectors.prototype.selectLoaded;
    /**
     * True when a multi-entity query command is in progress.
     * @type {?}
     */
    EntitySelectors.prototype.selectLoading;
    /**
     * ChangeState (including original values) of entities with unsaved changes
     * @type {?}
     */
    EntitySelectors.prototype.selectChangeState;
    /* Skipping unhandled member: readonly [name: string]: MemoizedSelector<EntityCollection<T>, any> | string;*/
}
/**
 * Creates EntitySelector functions for entity collections.
 */
var EntitySelectorsFactory = /** @class */ (function () {
    function EntitySelectorsFactory(entityCollectionCreator, selectEntityCache) {
        this.entityCollectionCreator =
            entityCollectionCreator || new EntityCollectionCreator();
        this.selectEntityCache =
            selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
    }
    /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @param entityName the name of the collection
     */
    /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @template T, C
     * @param {?} entityName the name of the collection
     * @return {?}
     */
    EntitySelectorsFactory.prototype.createCollectionSelector = /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @template T, C
     * @param {?} entityName the name of the collection
     * @return {?}
     */
    function (entityName) {
        var _this = this;
        /** @type {?} */
        var getCollection = (/**
         * @param {?=} cache
         * @return {?}
         */
        function (cache) {
            if (cache === void 0) { cache = {}; }
            return (/** @type {?} */ (((cache[entityName] ||
                _this.entityCollectionCreator.create(entityName)))));
        });
        return createSelector(this.selectEntityCache, getCollection);
    };
    // createCollectionSelectors implementation
    // createCollectionSelectors implementation
    /**
     * @template T, S
     * @param {?} metadataOrName
     * @return {?}
     */
    EntitySelectorsFactory.prototype.createCollectionSelectors = 
    // createCollectionSelectors implementation
    /**
     * @template T, S
     * @param {?} metadataOrName
     * @return {?}
     */
    function (metadataOrName) {
        /** @type {?} */
        var metadata = typeof metadataOrName === 'string'
            ? { entityName: metadataOrName }
            : metadataOrName;
        /** @type {?} */
        var selectKeys = (/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.ids; });
        /** @type {?} */
        var selectEntityMap = (/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.entities; });
        /** @type {?} */
        var selectEntities = createSelector(selectKeys, selectEntityMap, (/**
         * @param {?} keys
         * @param {?} entities
         * @return {?}
         */
        function (keys, entities) {
            return keys.map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) { return (/** @type {?} */ (entities[key])); }));
        }));
        /** @type {?} */
        var selectCount = createSelector(selectKeys, (/**
         * @param {?} keys
         * @return {?}
         */
        function (keys) { return keys.length; }));
        // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
        /** @type {?} */
        var selectFilter = (/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.filter; });
        /** @type {?} */
        var filterFn = metadata.filterFn;
        /** @type {?} */
        var selectFilteredEntities = filterFn
            ? createSelector(selectEntities, selectFilter, (/**
             * @param {?} entities
             * @param {?} pattern
             * @return {?}
             */
            function (entities, pattern) { return filterFn(entities, pattern); }))
            : selectEntities;
        /** @type {?} */
        var selectLoaded = (/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.loaded; });
        /** @type {?} */
        var selectLoading = (/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.loading; });
        /** @type {?} */
        var selectChangeState = (/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.changeState; });
        // Create collection selectors for each `additionalCollectionState` property.
        // These all extend from `selectCollection`
        /** @type {?} */
        var extra = metadata.additionalCollectionState || {};
        /** @type {?} */
        var extraSelectors = {};
        Object.keys(extra).forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
            extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = (/**
             * @param {?} c
             * @return {?}
             */
            function (c) { return ((/** @type {?} */ (c)))[k]; });
        }));
        return (/** @type {?} */ (__assign({ selectCount: selectCount,
            selectEntities: selectEntities,
            selectEntityMap: selectEntityMap,
            selectFilter: selectFilter,
            selectFilteredEntities: selectFilteredEntities,
            selectKeys: selectKeys,
            selectLoaded: selectLoaded,
            selectLoading: selectLoading,
            selectChangeState: selectChangeState }, extraSelectors)));
    };
    // createCollectionSelectors implementation
    // createCollectionSelectors implementation
    /**
     * @template T, S
     * @param {?} metadataOrName
     * @return {?}
     */
    EntitySelectorsFactory.prototype.create = 
    // createCollectionSelectors implementation
    /**
     * @template T, S
     * @param {?} metadataOrName
     * @return {?}
     */
    function (metadataOrName) {
        /** @type {?} */
        var metadata = typeof metadataOrName === 'string'
            ? { entityName: metadataOrName }
            : metadataOrName;
        /** @type {?} */
        var entityName = metadata.entityName;
        /** @type {?} */
        var selectCollection = this.createCollectionSelector(entityName);
        /** @type {?} */
        var collectionSelectors = this.createCollectionSelectors(metadata);
        /** @type {?} */
        var entitySelectors = {};
        Object.keys(collectionSelectors).forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
            entitySelectors[k] = createSelector(selectCollection, collectionSelectors[k]);
        }));
        return (/** @type {?} */ (__assign({ entityName: entityName,
            selectCollection: selectCollection, selectEntityCache: this.selectEntityCache }, entitySelectors)));
    };
    EntitySelectorsFactory.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EntitySelectorsFactory.ctorParameters = function () { return [
        { type: EntityCollectionCreator, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] }
    ]; };
    return EntitySelectorsFactory;
}());
export { EntitySelectorsFactory };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntitySelectorsFactory.prototype.entityCollectionCreator;
    /**
     * @type {?}
     * @private
     */
    EntitySelectorsFactory.prototype.selectEntityCache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUk3RCxPQUFPLEVBQUUsY0FBYyxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBSXZELE9BQU8sRUFDTCwyQkFBMkIsRUFFM0IseUJBQXlCLEdBQzFCLE1BQU0seUJBQXlCLENBQUM7QUFDakMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFLMUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUNBQXVDLENBQUM7Ozs7Ozs7O0FBUWhGLHlDQTZCQzs7Ozs7O0lBekJDLDBDQUE0RDs7Ozs7SUFHNUQsNkNBQTREOzs7OztJQUc1RCw4Q0FBdUU7Ozs7O0lBR3ZFLDJDQUE2RDs7Ozs7SUFHN0QscURBQW9FOzs7OztJQUdwRSx5Q0FBd0U7Ozs7O0lBR3hFLDJDQUE4RDs7Ozs7SUFHOUQsNENBQStEOzs7OztJQUcvRCxnREFBNkU7Ozs7Ozs7Ozs7QUFRL0UscUNBc0NDOzs7Ozs7SUFwQ0MscUNBQTRCOzs7OztJQUs1QiwyQ0FBeUU7Ozs7O0lBR3pFLHNDQUF1RDs7Ozs7SUFHdkQseUNBQXVEOzs7OztJQUd2RCw0Q0FBa0U7Ozs7O0lBR2xFLDBDQUFrRTs7Ozs7SUFHbEUsdUNBQXdEOzs7OztJQUd4RCxpREFBK0Q7Ozs7O0lBRy9ELHFDQUFtRTs7Ozs7SUFHbkUsdUNBQXlEOzs7OztJQUd6RCx3Q0FBMEQ7Ozs7O0lBRzFELDRDQUF3RTs7Ozs7O0FBSTFFO0lBS0UsZ0NBQ2MsdUJBQWlELEVBRzdELGlCQUF1QztRQUV2QyxJQUFJLENBQUMsdUJBQXVCO1lBQzFCLHVCQUF1QixJQUFJLElBQUks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c0JBQXNCOzs7Ozs7SUFDakMseURBQXlEOzs7OztJQUN6RCxtREFBK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8vIFByb2QgYnVpbGQgcmVxdWlyZXMgYE1lbW9pemVkU2VsZWN0b3IgZXZlbiB0aG91Z2ggbm90IHVzZWQuXG5pbXBvcnQgeyBNZW1vaXplZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IsIFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTixcbiAgRW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgY3JlYXRlRW50aXR5Q2FjaGVTZWxlY3Rvcixcbn0gZnJvbSAnLi9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRU5USVRZX0NBQ0hFX05BTUUgfSBmcm9tICcuLi9yZWR1Y2Vycy9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbixcbiAgQ2hhbmdlU3RhdGVNYXAsXG59IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlNZXRhZGF0YSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktbWV0YWRhdGEnO1xuXG4vKipcbiAqIFRoZSBzZWxlY3RvciBmdW5jdGlvbnMgZm9yIGVudGl0eSBjb2xsZWN0aW9uIG1lbWJlcnMsXG4gKiBTZWxlY3RzIGZyb20gdGhlIGVudGl0eSBjb2xsZWN0aW9uIHRvIHRoZSBjb2xsZWN0aW9uIG1lbWJlclxuICogQ29udHJhc3Qgd2l0aCB7RW50aXR5U2VsZWN0b3JzfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+IHtcbiAgcmVhZG9ubHkgW3NlbGVjdG9yOiBzdHJpbmddOiBhbnk7XG5cbiAgLyoqIENvdW50IG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0Q291bnQ6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIG51bWJlcj47XG5cbiAgLyoqIEFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IHNlbGVjdEVudGl0aWVzOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBUW10+O1xuXG4gIC8qKiBNYXAgb2YgZW50aXR5IGtleXMgdG8gZW50aXRpZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0RW50aXR5TWFwOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBEaWN0aW9uYXJ5PFQ+PjtcblxuICAvKiogRmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgc2VsZWN0RmlsdGVyOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBzdHJpbmc+O1xuXG4gIC8qKiBFbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgc2VsZWN0RmlsdGVyZWRFbnRpdGllczogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgVFtdPjtcblxuICAvKiogS2V5cyBvZiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24sIGluIHRoZSBjb2xsZWN0aW9uJ3MgbmF0aXZlIHNvcnQgb3JkZXIgKi9cbiAgcmVhZG9ubHkgc2VsZWN0S2V5czogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgc3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIFRydWUgd2hlbiB0aGUgY29sbGVjdGlvbiBoYXMgYmVlbiBmdWxseSBsb2FkZWQuICovXG4gIHJlYWRvbmx5IHNlbGVjdExvYWRlZDogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgYm9vbGVhbj47XG5cbiAgLyoqIFRydWUgd2hlbiBhIG11bHRpLWVudGl0eSBxdWVyeSBjb21tYW5kIGlzIGluIHByb2dyZXNzLiAqL1xuICByZWFkb25seSBzZWxlY3RMb2FkaW5nOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBib29sZWFuPjtcblxuICAvKiogQ2hhbmdlU3RhdGUgKGluY2x1ZGluZyBvcmlnaW5hbCB2YWx1ZXMpIG9mIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIHJlYWRvbmx5IHNlbGVjdENoYW5nZVN0YXRlOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBDaGFuZ2VTdGF0ZU1hcDxUPj47XG59XG5cbi8qKlxuICogVGhlIHNlbGVjdG9yIGZ1bmN0aW9ucyBmb3IgZW50aXR5IGNvbGxlY3Rpb24gbWVtYmVycyxcbiAqIFNlbGVjdHMgZnJvbSBzdG9yZSByb290LCB0aHJvdWdoIEVudGl0eUNhY2hlLCB0byB0aGUgZW50aXR5IGNvbGxlY3Rpb24gbWVtYmVyXG4gKiBDb250cmFzdCB3aXRoIHtDb2xsZWN0aW9uU2VsZWN0b3JzfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlTZWxlY3RvcnM8VD4ge1xuICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IGNvbGxlY3Rpb24gZm9yIHRoZXNlIHNlbGVjdG9ycyAqL1xuICByZWFkb25seSBlbnRpdHlOYW1lOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgW25hbWU6IHN0cmluZ106IE1lbW9pemVkU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgYW55PiB8IHN0cmluZztcblxuICAvKiogVGhlIGNhY2hlZCBFbnRpdHlDb2xsZWN0aW9uIGl0c2VsZiAqL1xuICByZWFkb25seSBzZWxlY3RDb2xsZWN0aW9uOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgRW50aXR5Q29sbGVjdGlvbjxUPj47XG5cbiAgLyoqIENvdW50IG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0Q291bnQ6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBudW1iZXI+O1xuXG4gIC8qKiBBbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBzZWxlY3RFbnRpdGllczogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIFRbXT47XG5cbiAgLyoqIFRoZSBFbnRpdHlDYWNoZSAqL1xuICByZWFkb25seSBzZWxlY3RFbnRpdHlDYWNoZTogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIEVudGl0eUNhY2hlPjtcblxuICAvKiogTWFwIG9mIGVudGl0eSBrZXlzIHRvIGVudGl0aWVzICovXG4gIHJlYWRvbmx5IHNlbGVjdEVudGl0eU1hcDogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIERpY3Rpb25hcnk8VD4+O1xuXG4gIC8qKiBGaWx0ZXIgcGF0dGVybiBhcHBsaWVkIGJ5IHRoZSBlbnRpdHkgY29sbGVjdGlvbidzIGZpbHRlciBmdW5jdGlvbiAqL1xuICByZWFkb25seSBzZWxlY3RGaWx0ZXI6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBzdHJpbmc+O1xuXG4gIC8qKiBFbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgc2VsZWN0RmlsdGVyZWRFbnRpdGllczogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIFRbXT47XG5cbiAgLyoqIEtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIHJlYWRvbmx5IHNlbGVjdEtleXM6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBzdHJpbmdbXSB8IG51bWJlcltdPjtcblxuICAvKiogVHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGZ1bGx5IGxvYWRlZC4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0TG9hZGVkOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgYm9vbGVhbj47XG5cbiAgLyoqIFRydWUgd2hlbiBhIG11bHRpLWVudGl0eSBxdWVyeSBjb21tYW5kIGlzIGluIHByb2dyZXNzLiAqL1xuICByZWFkb25seSBzZWxlY3RMb2FkaW5nOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgYm9vbGVhbj47XG5cbiAgLyoqIENoYW5nZVN0YXRlIChpbmNsdWRpbmcgb3JpZ2luYWwgdmFsdWVzKSBvZiBlbnRpdGllcyB3aXRoIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICByZWFkb25seSBzZWxlY3RDaGFuZ2VTdGF0ZTogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIENoYW5nZVN0YXRlTWFwPFQ+Pjtcbn1cblxuLyoqIENyZWF0ZXMgRW50aXR5U2VsZWN0b3IgZnVuY3Rpb25zIGZvciBlbnRpdHkgY29sbGVjdGlvbnMuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5U2VsZWN0b3JzRmFjdG9yeSB7XG4gIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3I6IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yO1xuICBwcml2YXRlIHNlbGVjdEVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZVNlbGVjdG9yO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yPzogRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTilcbiAgICBzZWxlY3RFbnRpdHlDYWNoZT86IEVudGl0eUNhY2hlU2VsZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciA9XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB8fCBuZXcgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IoKTtcbiAgICB0aGlzLnNlbGVjdEVudGl0eUNhY2hlID1cbiAgICAgIHNlbGVjdEVudGl0eUNhY2hlIHx8IGNyZWF0ZUVudGl0eUNhY2hlU2VsZWN0b3IoRU5USVRZX0NBQ0hFX05BTUUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgTmdSeCBzZWxlY3RvciBmcm9tIHRoZSBzdG9yZSByb290IHRvIHRoZSBuYW1lZCBjb2xsZWN0aW9uLFxuICAgKiBlLmcuIGZyb20gT2JqZWN0IHRvIEhlcm9lcy5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUgdGhlIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICovXG4gIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcjxcbiAgICBUID0gYW55LFxuICAgIEMgZXh0ZW5kcyBFbnRpdHlDb2xsZWN0aW9uPFQ+ID0gRW50aXR5Q29sbGVjdGlvbjxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGdldENvbGxlY3Rpb24gPSAoY2FjaGU6IEVudGl0eUNhY2hlID0ge30pID0+XG4gICAgICA8Qz4oXG4gICAgICAgIChjYWNoZVtlbnRpdHlOYW1lXSB8fFxuICAgICAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IuY3JlYXRlPFQ+KGVudGl0eU5hbWUpKVxuICAgICAgKTtcbiAgICByZXR1cm4gY3JlYXRlU2VsZWN0b3IodGhpcy5zZWxlY3RFbnRpdHlDYWNoZSwgZ2V0Q29sbGVjdGlvbik7XG4gIH1cblxuICAvLy8vLy8vIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnMgLy8vLy8vLy8vL1xuXG4gIC8vIEJhc2VkIG9uIEBuZ3J4L2VudGl0eS9zdGF0ZV9zZWxlY3RvcnMudHNcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZTp1bmlmaWVkLXNpZ25hdHVyZXNcbiAgLy8gY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9ycyhtZXRhZGF0YSkgb3ZlcmxvYWRcbiAgLyoqXG4gICAqIENyZWF0ZXMgZW50aXR5IGNvbGxlY3Rpb24gc2VsZWN0b3JzIGZyb20gbWV0YWRhdGEuXG4gICAqIEBwYXJhbSBtZXRhZGF0YSAtIEVudGl0eU1ldGFkYXRhIGZvciB0aGUgY29sbGVjdGlvbi5cbiAgICogTWF5IGJlIHBhcnRpYWwgYnV0IG11Y2ggaGF2ZSBgZW50aXR5TmFtZWAuXG4gICAqL1xuICBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzPFxuICAgIFQsXG4gICAgUyBleHRlbmRzIENvbGxlY3Rpb25TZWxlY3RvcnM8VD4gPSBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+XG4gID4obWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhPFQ+KTogUztcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZTp1bmlmaWVkLXNpZ25hdHVyZXNcbiAgLy8gY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9ycyhlbnRpdHlOYW1lKSBvdmVybG9hZFxuICAvKipcbiAgICogQ3JlYXRlcyBkZWZhdWx0IGVudGl0eSBjb2xsZWN0aW9uIHNlbGVjdG9ycyBmb3IgYW4gZW50aXR5IHR5cGUuXG4gICAqIFVzZSB0aGUgbWV0YWRhdGEgb3ZlcmxvYWQgZm9yIGFkZGl0aW9uYWwgY29sbGVjdGlvbiBzZWxlY3RvcnMuXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnM8XG4gICAgVCxcbiAgICBTIGV4dGVuZHMgQ29sbGVjdGlvblNlbGVjdG9yczxUPiA9IENvbGxlY3Rpb25TZWxlY3RvcnM8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBTO1xuXG4gIC8vIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnMgaW1wbGVtZW50YXRpb25cbiAgY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9yczxcbiAgICBULFxuICAgIFMgZXh0ZW5kcyBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+ID0gQ29sbGVjdGlvblNlbGVjdG9yczxUPlxuICA+KG1ldGFkYXRhT3JOYW1lOiBFbnRpdHlNZXRhZGF0YTxUPiB8IHN0cmluZyk6IFMge1xuICAgIGNvbnN0IG1ldGFkYXRhID1cbiAgICAgIHR5cGVvZiBtZXRhZGF0YU9yTmFtZSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7IGVudGl0eU5hbWU6IG1ldGFkYXRhT3JOYW1lIH1cbiAgICAgICAgOiBtZXRhZGF0YU9yTmFtZTtcbiAgICBjb25zdCBzZWxlY3RLZXlzID0gKGM6IEVudGl0eUNvbGxlY3Rpb248VD4pID0+IGMuaWRzO1xuICAgIGNvbnN0IHNlbGVjdEVudGl0eU1hcCA9IChjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSA9PiBjLmVudGl0aWVzO1xuXG4gICAgY29uc3Qgc2VsZWN0RW50aXRpZXM6IFNlbGVjdG9yPFxuICAgICAgRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICAgIFRbXVxuICAgID4gPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHNlbGVjdEtleXMsXG4gICAgICBzZWxlY3RFbnRpdHlNYXAsXG4gICAgICAoa2V5czogKG51bWJlciB8IHN0cmluZylbXSwgZW50aXRpZXM6IERpY3Rpb25hcnk8VD4pOiBUW10gPT5cbiAgICAgICAga2V5cy5tYXAoKGtleSkgPT4gZW50aXRpZXNba2V5XSBhcyBUKVxuICAgICk7XG5cbiAgICBjb25zdCBzZWxlY3RDb3VudDogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgbnVtYmVyPiA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgc2VsZWN0S2V5cyxcbiAgICAgIChrZXlzKSA9PiBrZXlzLmxlbmd0aFxuICAgICk7XG5cbiAgICAvLyBFbnRpdHlDb2xsZWN0aW9uIHNlbGVjdG9ycyB0aGF0IGdvIGJleW9uZCB0aGUgbmdyeC9lbnRpdHkvRW50aXR5U3RhdGUgc2VsZWN0b3JzXG4gICAgY29uc3Qgc2VsZWN0RmlsdGVyID0gKGM6IEVudGl0eUNvbGxlY3Rpb248VD4pID0+IGMuZmlsdGVyO1xuXG4gICAgY29uc3QgZmlsdGVyRm4gPSBtZXRhZGF0YS5maWx0ZXJGbjtcbiAgICBjb25zdCBzZWxlY3RGaWx0ZXJlZEVudGl0aWVzOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBUW10+ID0gZmlsdGVyRm5cbiAgICAgID8gY3JlYXRlU2VsZWN0b3IoXG4gICAgICAgICAgc2VsZWN0RW50aXRpZXMsXG4gICAgICAgICAgc2VsZWN0RmlsdGVyLFxuICAgICAgICAgIChlbnRpdGllczogVFtdLCBwYXR0ZXJuOiBhbnkpOiBUW10gPT4gZmlsdGVyRm4oZW50aXRpZXMsIHBhdHRlcm4pXG4gICAgICAgIClcbiAgICAgIDogc2VsZWN0RW50aXRpZXM7XG5cbiAgICBjb25zdCBzZWxlY3RMb2FkZWQgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5sb2FkZWQ7XG4gICAgY29uc3Qgc2VsZWN0TG9hZGluZyA9IChjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSA9PiBjLmxvYWRpbmc7XG4gICAgY29uc3Qgc2VsZWN0Q2hhbmdlU3RhdGUgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5jaGFuZ2VTdGF0ZTtcblxuICAgIC8vIENyZWF0ZSBjb2xsZWN0aW9uIHNlbGVjdG9ycyBmb3IgZWFjaCBgYWRkaXRpb25hbENvbGxlY3Rpb25TdGF0ZWAgcHJvcGVydHkuXG4gICAgLy8gVGhlc2UgYWxsIGV4dGVuZCBmcm9tIGBzZWxlY3RDb2xsZWN0aW9uYFxuICAgIGNvbnN0IGV4dHJhID0gbWV0YWRhdGEuYWRkaXRpb25hbENvbGxlY3Rpb25TdGF0ZSB8fCB7fTtcbiAgICBjb25zdCBleHRyYVNlbGVjdG9yczoge1xuICAgICAgW25hbWU6IHN0cmluZ106IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIGFueT47XG4gICAgfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGV4dHJhKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBleHRyYVNlbGVjdG9yc1snc2VsZWN0JyArIGtbMF0udG9VcHBlckNhc2UoKSArIGsuc2xpY2UoMSldID0gKFxuICAgICAgICBjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICAgICApID0+ICg8YW55PmMpW2tdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGVjdENvdW50LFxuICAgICAgc2VsZWN0RW50aXRpZXMsXG4gICAgICBzZWxlY3RFbnRpdHlNYXAsXG4gICAgICBzZWxlY3RGaWx0ZXIsXG4gICAgICBzZWxlY3RGaWx0ZXJlZEVudGl0aWVzLFxuICAgICAgc2VsZWN0S2V5cyxcbiAgICAgIHNlbGVjdExvYWRlZCxcbiAgICAgIHNlbGVjdExvYWRpbmcsXG4gICAgICBzZWxlY3RDaGFuZ2VTdGF0ZSxcbiAgICAgIC4uLmV4dHJhU2VsZWN0b3JzLFxuICAgIH0gYXMgUztcbiAgfVxuXG4gIC8vLy8vLy8gY3JlYXRlIC8vLy8vLy8vLy9cblxuICAvLyBjcmVhdGUobWV0YWRhdGEpIG92ZXJsb2FkXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBzdG9yZS1yb290ZWQgc2VsZWN0b3JzIGZvciBhbiBlbnRpdHkgY29sbGVjdGlvbi5cbiAgICoge0VudGl0eVNlbGVjdG9ycyRGYWN0b3J5fSB0dXJucyB0aGVtIGludG8gc2VsZWN0b3JzJC5cbiAgICpcbiAgICogQHBhcmFtIG1ldGFkYXRhIC0gRW50aXR5TWV0YWRhdGEgZm9yIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBNYXkgYmUgcGFydGlhbCBidXQgbXVjaCBoYXZlIGBlbnRpdHlOYW1lYC5cbiAgICpcbiAgICogQmFzZWQgb24gbmdyeC9lbnRpdHkvc3RhdGVfc2VsZWN0b3JzLnRzXG4gICAqIERpZmZlcnMgaW4gdGhhdCB0aGVzZSBzZWxlY3RvcnMgc2VsZWN0IGZyb20gdGhlIE5nUnggc3RvcmUgcm9vdCxcbiAgICogdGhyb3VnaCB0aGUgY29sbGVjdGlvbiwgdG8gdGhlIGNvbGxlY3Rpb24gbWVtYmVycy5cbiAgICovXG4gIGNyZWF0ZTxULCBTIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzPFQ+ID0gRW50aXR5U2VsZWN0b3JzPFQ+PihcbiAgICBtZXRhZGF0YTogRW50aXR5TWV0YWRhdGE8VD5cbiAgKTogUztcblxuICAvLyBjcmVhdGUoZW50aXR5TmFtZSkgb3ZlcmxvYWRcbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGRlZmF1bHQgc3RvcmUtcm9vdGVkIHNlbGVjdG9ycyBmb3IgYW4gZW50aXR5IGNvbGxlY3Rpb24uXG4gICAqIHtFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeX0gdHVybnMgdGhlbSBpbnRvIHNlbGVjdG9ycyQuXG4gICAqIFVzZSB0aGUgbWV0YWRhdGEgb3ZlcmxvYWQgZm9yIGFkZGl0aW9uYWwgY29sbGVjdGlvbiBzZWxlY3RvcnMuXG4gICAqXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gbmFtZSBvZiB0aGUgZW50aXR5IHR5cGUuXG4gICAqXG4gICAqIEJhc2VkIG9uIG5ncngvZW50aXR5L3N0YXRlX3NlbGVjdG9ycy50c1xuICAgKiBEaWZmZXJzIGluIHRoYXQgdGhlc2Ugc2VsZWN0b3JzIHNlbGVjdCBmcm9tIHRoZSBOZ1J4IHN0b3JlIHJvb3QsXG4gICAqIHRocm91Z2ggdGhlIGNvbGxlY3Rpb24sIHRvIHRoZSBjb2xsZWN0aW9uIG1lbWJlcnMuXG4gICAqL1xuICBjcmVhdGU8VCwgUyBleHRlbmRzIEVudGl0eVNlbGVjdG9yczxUPiA9IEVudGl0eVNlbGVjdG9yczxUPj4oXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnVuaWZpZWQtc2lnbmF0dXJlc1xuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBTO1xuXG4gIC8vIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnMgaW1wbGVtZW50YXRpb25cbiAgY3JlYXRlPFQsIFMgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnM8VD4gPSBFbnRpdHlTZWxlY3RvcnM8VD4+KFxuICAgIG1ldGFkYXRhT3JOYW1lOiBFbnRpdHlNZXRhZGF0YTxUPiB8IHN0cmluZ1xuICApOiBTIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9XG4gICAgICB0eXBlb2YgbWV0YWRhdGFPck5hbWUgPT09ICdzdHJpbmcnXG4gICAgICAgID8geyBlbnRpdHlOYW1lOiBtZXRhZGF0YU9yTmFtZSB9XG4gICAgICAgIDogbWV0YWRhdGFPck5hbWU7XG4gICAgY29uc3QgZW50aXR5TmFtZSA9IG1ldGFkYXRhLmVudGl0eU5hbWU7XG4gICAgY29uc3Qgc2VsZWN0Q29sbGVjdGlvbjogU2VsZWN0b3I8XG4gICAgICBPYmplY3QsXG4gICAgICBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICAgPiA9IHRoaXMuY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9yPFQ+KGVudGl0eU5hbWUpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb25TZWxlY3RvcnMgPSB0aGlzLmNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnM8VD4obWV0YWRhdGEpO1xuXG4gICAgY29uc3QgZW50aXR5U2VsZWN0b3JzOiB7XG4gICAgICBbbmFtZTogc3RyaW5nXTogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgYW55PjtcbiAgICB9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29sbGVjdGlvblNlbGVjdG9ycykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgZW50aXR5U2VsZWN0b3JzW2tdID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdENvbGxlY3Rpb24sXG4gICAgICAgIGNvbGxlY3Rpb25TZWxlY3RvcnNba11cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdENvbGxlY3Rpb24sXG4gICAgICBzZWxlY3RFbnRpdHlDYWNoZTogdGhpcy5zZWxlY3RFbnRpdHlDYWNoZSxcbiAgICAgIC4uLmVudGl0eVNlbGVjdG9ycyxcbiAgICB9IGFzIFM7XG4gIH1cbn1cbiJdfQ==