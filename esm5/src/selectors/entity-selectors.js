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
        { type: Injectable },
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
//# sourceMappingURL=entity-selectors.js.map