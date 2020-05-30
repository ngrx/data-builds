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
export class EntitySelectorsFactory {
    /**
     * @param {?=} entityCollectionCreator
     * @param {?=} selectEntityCache
     */
    constructor(entityCollectionCreator, selectEntityCache) {
        this.entityCollectionCreator =
            entityCollectionCreator || new EntityCollectionCreator();
        this.selectEntityCache =
            selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
    }
    /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @template T, C
     * @param {?} entityName the name of the collection
     * @return {?}
     */
    createCollectionSelector(entityName) {
        /** @type {?} */
        const getCollection = (/**
         * @param {?=} cache
         * @return {?}
         */
        (cache = {}) => (/** @type {?} */ (((cache[entityName] ||
            this.entityCollectionCreator.create(entityName))))));
        return createSelector(this.selectEntityCache, getCollection);
    }
    // createCollectionSelectors implementation
    /**
     * @template T, S
     * @param {?} metadataOrName
     * @return {?}
     */
    createCollectionSelectors(metadataOrName) {
        /** @type {?} */
        const metadata = typeof metadataOrName === 'string'
            ? { entityName: metadataOrName }
            : metadataOrName;
        /** @type {?} */
        const selectKeys = (/**
         * @param {?} c
         * @return {?}
         */
        (c) => c.ids);
        /** @type {?} */
        const selectEntityMap = (/**
         * @param {?} c
         * @return {?}
         */
        (c) => c.entities);
        /** @type {?} */
        const selectEntities = createSelector(selectKeys, selectEntityMap, (/**
         * @param {?} keys
         * @param {?} entities
         * @return {?}
         */
        (keys, entities) => keys.map((/**
         * @param {?} key
         * @return {?}
         */
        key => (/** @type {?} */ (entities[key]))))));
        /** @type {?} */
        const selectCount = createSelector(selectKeys, (/**
         * @param {?} keys
         * @return {?}
         */
        keys => keys.length));
        // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
        /** @type {?} */
        const selectFilter = (/**
         * @param {?} c
         * @return {?}
         */
        (c) => c.filter);
        /** @type {?} */
        const filterFn = metadata.filterFn;
        /** @type {?} */
        const selectFilteredEntities = filterFn
            ? createSelector(selectEntities, selectFilter, (/**
             * @param {?} entities
             * @param {?} pattern
             * @return {?}
             */
            (entities, pattern) => filterFn(entities, pattern)))
            : selectEntities;
        /** @type {?} */
        const selectLoaded = (/**
         * @param {?} c
         * @return {?}
         */
        (c) => c.loaded);
        /** @type {?} */
        const selectLoading = (/**
         * @param {?} c
         * @return {?}
         */
        (c) => c.loading);
        /** @type {?} */
        const selectChangeState = (/**
         * @param {?} c
         * @return {?}
         */
        (c) => c.changeState);
        // Create collection selectors for each `additionalCollectionState` property.
        // These all extend from `selectCollection`
        /** @type {?} */
        const extra = metadata.additionalCollectionState || {};
        /** @type {?} */
        const extraSelectors = {};
        Object.keys(extra).forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => {
            extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = (/**
             * @param {?} c
             * @return {?}
             */
            (c) => ((/** @type {?} */ (c)))[k]);
        }));
        return (/** @type {?} */ (Object.assign({ selectCount,
            selectEntities,
            selectEntityMap,
            selectFilter,
            selectFilteredEntities,
            selectKeys,
            selectLoaded,
            selectLoading,
            selectChangeState }, extraSelectors)));
    }
    // createCollectionSelectors implementation
    /**
     * @template T, S
     * @param {?} metadataOrName
     * @return {?}
     */
    create(metadataOrName) {
        /** @type {?} */
        const metadata = typeof metadataOrName === 'string'
            ? { entityName: metadataOrName }
            : metadataOrName;
        /** @type {?} */
        const entityName = metadata.entityName;
        /** @type {?} */
        const selectCollection = this.createCollectionSelector(entityName);
        /** @type {?} */
        const collectionSelectors = this.createCollectionSelectors(metadata);
        /** @type {?} */
        const entitySelectors = {};
        Object.keys(collectionSelectors).forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => {
            entitySelectors[k] = createSelector(selectCollection, collectionSelectors[k]);
        }));
        return (/** @type {?} */ (Object.assign({ entityName,
            selectCollection, selectEntityCache: this.selectEntityCache }, entitySelectors)));
    }
}
EntitySelectorsFactory.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntitySelectorsFactory.ctorParameters = () => [
    { type: EntityCollectionCreator, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] }
];
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