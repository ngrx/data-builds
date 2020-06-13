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
        (key) => (/** @type {?} */ (entities[key]))))));
        /** @type {?} */
        const selectCount = createSelector(selectKeys, (/**
         * @param {?} keys
         * @return {?}
         */
        (keys) => keys.length));
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
        (k) => {
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
        (k) => {
            entitySelectors[k] = createSelector(selectCollection, collectionSelectors[k]);
        }));
        return (/** @type {?} */ (Object.assign({ entityName,
            selectCollection, selectEntityCache: this.selectEntityCache }, entitySelectors)));
    }
}
EntitySelectorsFactory.decorators = [
    { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJN0QsT0FBTyxFQUFFLGNBQWMsRUFBWSxNQUFNLGFBQWEsQ0FBQztBQUl2RCxPQUFPLEVBQ0wsMkJBQTJCLEVBRTNCLHlCQUF5QixHQUMxQixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBSzFELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDOzs7Ozs7OztBQVFoRix5Q0E2QkM7Ozs7OztJQXpCQywwQ0FBNEQ7Ozs7O0lBRzVELDZDQUE0RDs7Ozs7SUFHNUQsOENBQXVFOzs7OztJQUd2RSwyQ0FBNkQ7Ozs7O0lBRzdELHFEQUFvRTs7Ozs7SUFHcEUseUNBQXdFOzs7OztJQUd4RSwyQ0FBOEQ7Ozs7O0lBRzlELDRDQUErRDs7Ozs7SUFHL0QsZ0RBQTZFOzs7Ozs7Ozs7O0FBUS9FLHFDQXNDQzs7Ozs7O0lBcENDLHFDQUE0Qjs7Ozs7SUFLNUIsMkNBQXlFOzs7OztJQUd6RSxzQ0FBdUQ7Ozs7O0lBR3ZELHlDQUF1RDs7Ozs7SUFHdkQsNENBQWtFOzs7OztJQUdsRSwwQ0FBa0U7Ozs7O0lBR2xFLHVDQUF3RDs7Ozs7SUFHeEQsaURBQStEOzs7OztJQUcvRCxxQ0FBbUU7Ozs7O0lBR25FLHVDQUF5RDs7Ozs7SUFHekQsd0NBQTBEOzs7OztJQUcxRCw0Q0FBd0U7Ozs7OztBQUsxRSxNQUFNLE9BQU8sc0JBQXNCOzs7OztJQUlqQyxZQUNjLHVCQUFpRCxFQUc3RCxpQkFBdUM7UUFFdkMsSUFBSSxDQUFDLHVCQUF1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WUFBWTtZQUNaLGFBQWE7WUFDYixpQkFBaUIsSUFDZCxjQUFjLEdBQ2IsQ0FBQztJQUNULENBQUM7Ozs7Ozs7SUFzQ0QsTUFBTSxDQUNKLGNBQTBDOztjQUVwQyxRQUFRLEdBQ1osT0FBTyxjQUFjLEtBQUssUUFBUTtZQUNoQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFO1lBQ2hDLENBQUMsQ0FBQyxjQUFjOztjQUNkLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVTs7Y0FDaEMsZ0JBQWdCLEdBR2xCLElBQUksQ0FBQyx3QkFBd0IsQ0FBSSxVQUFVLENBQUM7O2NBQzFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBSSxRQUFRLENBQUM7O2NBRWpFLGVBQWUsR0FFakIsRUFBRTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUM3QyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUNqQyxnQkFBZ0IsRUFDaEIsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQ3ZCLENBQUM7UUFDSixDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sbUNBQ0wsVUFBVTtZQUNWLGdCQUFnQixFQUNoQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLElBQ3RDLGVBQWUsR0FDZCxDQUFDO0lBQ1QsQ0FBQzs7O1lBck1GLFVBQVU7Ozs7WUFyRkYsdUJBQXVCLHVCQTJGM0IsUUFBUTs0Q0FDUixRQUFRLFlBQ1IsTUFBTSxTQUFDLDJCQUEyQjs7Ozs7OztJQU5yQyx5REFBeUQ7Ozs7O0lBQ3pELG1EQUErQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLy8gUHJvZCBidWlsZCByZXF1aXJlcyBgTWVtb2l6ZWRTZWxlY3RvciBldmVuIHRob3VnaCBub3QgdXNlZC5cbmltcG9ydCB7IE1lbW9pemVkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciwgU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOLFxuICBFbnRpdHlDYWNoZVNlbGVjdG9yLFxuICBjcmVhdGVFbnRpdHlDYWNoZVNlbGVjdG9yLFxufSBmcm9tICcuL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFTlRJVFlfQ0FDSEVfTkFNRSB9IGZyb20gJy4uL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uLFxuICBDaGFuZ2VTdGF0ZU1hcCxcbn0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eU1ldGFkYXRhIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbi8qKlxuICogVGhlIHNlbGVjdG9yIGZ1bmN0aW9ucyBmb3IgZW50aXR5IGNvbGxlY3Rpb24gbWVtYmVycyxcbiAqIFNlbGVjdHMgZnJvbSB0aGUgZW50aXR5IGNvbGxlY3Rpb24gdG8gdGhlIGNvbGxlY3Rpb24gbWVtYmVyXG4gKiBDb250cmFzdCB3aXRoIHtFbnRpdHlTZWxlY3RvcnN9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbGxlY3Rpb25TZWxlY3RvcnM8VD4ge1xuICByZWFkb25seSBbc2VsZWN0b3I6IHN0cmluZ106IGFueTtcblxuICAvKiogQ291bnQgb2YgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBzZWxlY3RDb3VudDogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgbnVtYmVyPjtcblxuICAvKiogQWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0RW50aXRpZXM6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIFRbXT47XG5cbiAgLyoqIE1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICByZWFkb25seSBzZWxlY3RFbnRpdHlNYXA6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIERpY3Rpb25hcnk8VD4+O1xuXG4gIC8qKiBGaWx0ZXIgcGF0dGVybiBhcHBsaWVkIGJ5IHRoZSBlbnRpdHkgY29sbGVjdGlvbidzIGZpbHRlciBmdW5jdGlvbiAqL1xuICByZWFkb25seSBzZWxlY3RGaWx0ZXI6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIHN0cmluZz47XG5cbiAgLyoqIEVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB0aGF0IHBhc3MgdGhlIGZpbHRlciBmdW5jdGlvbiAqL1xuICByZWFkb25seSBzZWxlY3RGaWx0ZXJlZEVudGl0aWVzOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBUW10+O1xuXG4gIC8qKiBLZXlzIG9mIHRoZSBjYWNoZWQgY29sbGVjdGlvbiwgaW4gdGhlIGNvbGxlY3Rpb24ncyBuYXRpdmUgc29ydCBvcmRlciAqL1xuICByZWFkb25seSBzZWxlY3RLZXlzOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBzdHJpbmdbXSB8IG51bWJlcltdPjtcblxuICAvKiogVHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGZ1bGx5IGxvYWRlZC4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0TG9hZGVkOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBib29sZWFuPjtcblxuICAvKiogVHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIHJlYWRvbmx5IHNlbGVjdExvYWRpbmc6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIGJvb2xlYW4+O1xuXG4gIC8qKiBDaGFuZ2VTdGF0ZSAoaW5jbHVkaW5nIG9yaWdpbmFsIHZhbHVlcykgb2YgZW50aXRpZXMgd2l0aCB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0Q2hhbmdlU3RhdGU6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIENoYW5nZVN0YXRlTWFwPFQ+Pjtcbn1cblxuLyoqXG4gKiBUaGUgc2VsZWN0b3IgZnVuY3Rpb25zIGZvciBlbnRpdHkgY29sbGVjdGlvbiBtZW1iZXJzLFxuICogU2VsZWN0cyBmcm9tIHN0b3JlIHJvb3QsIHRocm91Z2ggRW50aXR5Q2FjaGUsIHRvIHRoZSBlbnRpdHkgY29sbGVjdGlvbiBtZW1iZXJcbiAqIENvbnRyYXN0IHdpdGgge0NvbGxlY3Rpb25TZWxlY3RvcnN9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVNlbGVjdG9yczxUPiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgY29sbGVjdGlvbiBmb3IgdGhlc2Ugc2VsZWN0b3JzICovXG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcblxuICByZWFkb25seSBbbmFtZTogc3RyaW5nXTogTWVtb2l6ZWRTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBhbnk+IHwgc3RyaW5nO1xuXG4gIC8qKiBUaGUgY2FjaGVkIEVudGl0eUNvbGxlY3Rpb24gaXRzZWxmICovXG4gIHJlYWRvbmx5IHNlbGVjdENvbGxlY3Rpb246IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBFbnRpdHlDb2xsZWN0aW9uPFQ+PjtcblxuICAvKiogQ291bnQgb2YgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBzZWxlY3RDb3VudDogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIG51bWJlcj47XG5cbiAgLyoqIEFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IHNlbGVjdEVudGl0aWVzOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgVFtdPjtcblxuICAvKiogVGhlIEVudGl0eUNhY2hlICovXG4gIHJlYWRvbmx5IHNlbGVjdEVudGl0eUNhY2hlOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgRW50aXR5Q2FjaGU+O1xuXG4gIC8qKiBNYXAgb2YgZW50aXR5IGtleXMgdG8gZW50aXRpZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0RW50aXR5TWFwOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgRGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIEZpbHRlciBwYXR0ZXJuIGFwcGxpZWQgYnkgdGhlIGVudGl0eSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGZ1bmN0aW9uICovXG4gIHJlYWRvbmx5IHNlbGVjdEZpbHRlcjogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIHN0cmluZz47XG5cbiAgLyoqIEVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB0aGF0IHBhc3MgdGhlIGZpbHRlciBmdW5jdGlvbiAqL1xuICByZWFkb25seSBzZWxlY3RGaWx0ZXJlZEVudGl0aWVzOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgVFtdPjtcblxuICAvKiogS2V5cyBvZiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24sIGluIHRoZSBjb2xsZWN0aW9uJ3MgbmF0aXZlIHNvcnQgb3JkZXIgKi9cbiAgcmVhZG9ubHkgc2VsZWN0S2V5czogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIHN0cmluZ1tdIHwgbnVtYmVyW10+O1xuXG4gIC8qKiBUcnVlIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gZnVsbHkgbG9hZGVkLiAqL1xuICByZWFkb25seSBzZWxlY3RMb2FkZWQ6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBib29sZWFuPjtcblxuICAvKiogVHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIHJlYWRvbmx5IHNlbGVjdExvYWRpbmc6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBib29sZWFuPjtcblxuICAvKiogQ2hhbmdlU3RhdGUgKGluY2x1ZGluZyBvcmlnaW5hbCB2YWx1ZXMpIG9mIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIHJlYWRvbmx5IHNlbGVjdENoYW5nZVN0YXRlOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgQ2hhbmdlU3RhdGVNYXA8VD4+O1xufVxuXG4vKiogQ3JlYXRlcyBFbnRpdHlTZWxlY3RvciBmdW5jdGlvbnMgZm9yIGVudGl0eSBjb2xsZWN0aW9ucy4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5IHtcbiAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcjogRW50aXR5Q29sbGVjdGlvbkNyZWF0b3I7XG4gIHByaXZhdGUgc2VsZWN0RW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlU2VsZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3I/OiBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOKVxuICAgIHNlbGVjdEVudGl0eUNhY2hlPzogRW50aXR5Q2FjaGVTZWxlY3RvclxuICApIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25DcmVhdG9yID1cbiAgICAgIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIHx8IG5ldyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcigpO1xuICAgIHRoaXMuc2VsZWN0RW50aXR5Q2FjaGUgPVxuICAgICAgc2VsZWN0RW50aXR5Q2FjaGUgfHwgY3JlYXRlRW50aXR5Q2FjaGVTZWxlY3RvcihFTlRJVFlfQ0FDSEVfTkFNRSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBOZ1J4IHNlbGVjdG9yIGZyb20gdGhlIHN0b3JlIHJvb3QgdG8gdGhlIG5hbWVkIGNvbGxlY3Rpb24sXG4gICAqIGUuZy4gZnJvbSBPYmplY3QgdG8gSGVyb2VzLlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB0aGUgbmFtZSBvZiB0aGUgY29sbGVjdGlvblxuICAgKi9cbiAgY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9yPFxuICAgIFQgPSBhbnksXG4gICAgQyBleHRlbmRzIEVudGl0eUNvbGxlY3Rpb248VD4gPSBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZ2V0Q29sbGVjdGlvbiA9IChjYWNoZTogRW50aXR5Q2FjaGUgPSB7fSkgPT5cbiAgICAgIDxDPihcbiAgICAgICAgKGNhY2hlW2VudGl0eU5hbWVdIHx8XG4gICAgICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uQ3JlYXRvci5jcmVhdGU8VD4oZW50aXR5TmFtZSkpXG4gICAgICApO1xuICAgIHJldHVybiBjcmVhdGVTZWxlY3Rvcih0aGlzLnNlbGVjdEVudGl0eUNhY2hlLCBnZXRDb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8vLy8vLy8gY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9ycyAvLy8vLy8vLy8vXG5cbiAgLy8gQmFzZWQgb24gQG5ncngvZW50aXR5L3N0YXRlX3NlbGVjdG9ycy50c1xuXG4gIC8vIHRzbGludDpkaXNhYmxlOnVuaWZpZWQtc2lnbmF0dXJlc1xuICAvLyBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzKG1ldGFkYXRhKSBvdmVybG9hZFxuICAvKipcbiAgICogQ3JlYXRlcyBlbnRpdHkgY29sbGVjdGlvbiBzZWxlY3RvcnMgZnJvbSBtZXRhZGF0YS5cbiAgICogQHBhcmFtIG1ldGFkYXRhIC0gRW50aXR5TWV0YWRhdGEgZm9yIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBNYXkgYmUgcGFydGlhbCBidXQgbXVjaCBoYXZlIGBlbnRpdHlOYW1lYC5cbiAgICovXG4gIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnM8XG4gICAgVCxcbiAgICBTIGV4dGVuZHMgQ29sbGVjdGlvblNlbGVjdG9yczxUPiA9IENvbGxlY3Rpb25TZWxlY3RvcnM8VD5cbiAgPihtZXRhZGF0YTogRW50aXR5TWV0YWRhdGE8VD4pOiBTO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlOnVuaWZpZWQtc2lnbmF0dXJlc1xuICAvLyBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzKGVudGl0eU5hbWUpIG92ZXJsb2FkXG4gIC8qKlxuICAgKiBDcmVhdGVzIGRlZmF1bHQgZW50aXR5IGNvbGxlY3Rpb24gc2VsZWN0b3JzIGZvciBhbiBlbnRpdHkgdHlwZS5cbiAgICogVXNlIHRoZSBtZXRhZGF0YSBvdmVybG9hZCBmb3IgYWRkaXRpb25hbCBjb2xsZWN0aW9uIHNlbGVjdG9ycy5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKi9cbiAgY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9yczxcbiAgICBULFxuICAgIFMgZXh0ZW5kcyBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+ID0gQ29sbGVjdGlvblNlbGVjdG9yczxUPlxuICA+KGVudGl0eU5hbWU6IHN0cmluZyk6IFM7XG5cbiAgLy8gY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9ycyBpbXBsZW1lbnRhdGlvblxuICBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzPFxuICAgIFQsXG4gICAgUyBleHRlbmRzIENvbGxlY3Rpb25TZWxlY3RvcnM8VD4gPSBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+XG4gID4obWV0YWRhdGFPck5hbWU6IEVudGl0eU1ldGFkYXRhPFQ+IHwgc3RyaW5nKTogUyB7XG4gICAgY29uc3QgbWV0YWRhdGEgPVxuICAgICAgdHlwZW9mIG1ldGFkYXRhT3JOYW1lID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZW50aXR5TmFtZTogbWV0YWRhdGFPck5hbWUgfVxuICAgICAgICA6IG1ldGFkYXRhT3JOYW1lO1xuICAgIGNvbnN0IHNlbGVjdEtleXMgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5pZHM7XG4gICAgY29uc3Qgc2VsZWN0RW50aXR5TWFwID0gKGM6IEVudGl0eUNvbGxlY3Rpb248VD4pID0+IGMuZW50aXRpZXM7XG5cbiAgICBjb25zdCBzZWxlY3RFbnRpdGllczogU2VsZWN0b3I8XG4gICAgICBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgICAgVFtdXG4gICAgPiA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgc2VsZWN0S2V5cyxcbiAgICAgIHNlbGVjdEVudGl0eU1hcCxcbiAgICAgIChrZXlzOiAobnVtYmVyIHwgc3RyaW5nKVtdLCBlbnRpdGllczogRGljdGlvbmFyeTxUPik6IFRbXSA9PlxuICAgICAgICBrZXlzLm1hcCgoa2V5KSA9PiBlbnRpdGllc1trZXldIGFzIFQpXG4gICAgKTtcblxuICAgIGNvbnN0IHNlbGVjdENvdW50OiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBudW1iZXI+ID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBzZWxlY3RLZXlzLFxuICAgICAgKGtleXMpID0+IGtleXMubGVuZ3RoXG4gICAgKTtcblxuICAgIC8vIEVudGl0eUNvbGxlY3Rpb24gc2VsZWN0b3JzIHRoYXQgZ28gYmV5b25kIHRoZSBuZ3J4L2VudGl0eS9FbnRpdHlTdGF0ZSBzZWxlY3RvcnNcbiAgICBjb25zdCBzZWxlY3RGaWx0ZXIgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5maWx0ZXI7XG5cbiAgICBjb25zdCBmaWx0ZXJGbiA9IG1ldGFkYXRhLmZpbHRlckZuO1xuICAgIGNvbnN0IHNlbGVjdEZpbHRlcmVkRW50aXRpZXM6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIFRbXT4gPSBmaWx0ZXJGblxuICAgICAgPyBjcmVhdGVTZWxlY3RvcihcbiAgICAgICAgICBzZWxlY3RFbnRpdGllcyxcbiAgICAgICAgICBzZWxlY3RGaWx0ZXIsXG4gICAgICAgICAgKGVudGl0aWVzOiBUW10sIHBhdHRlcm46IGFueSk6IFRbXSA9PiBmaWx0ZXJGbihlbnRpdGllcywgcGF0dGVybilcbiAgICAgICAgKVxuICAgICAgOiBzZWxlY3RFbnRpdGllcztcblxuICAgIGNvbnN0IHNlbGVjdExvYWRlZCA9IChjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSA9PiBjLmxvYWRlZDtcbiAgICBjb25zdCBzZWxlY3RMb2FkaW5nID0gKGM6IEVudGl0eUNvbGxlY3Rpb248VD4pID0+IGMubG9hZGluZztcbiAgICBjb25zdCBzZWxlY3RDaGFuZ2VTdGF0ZSA9IChjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSA9PiBjLmNoYW5nZVN0YXRlO1xuXG4gICAgLy8gQ3JlYXRlIGNvbGxlY3Rpb24gc2VsZWN0b3JzIGZvciBlYWNoIGBhZGRpdGlvbmFsQ29sbGVjdGlvblN0YXRlYCBwcm9wZXJ0eS5cbiAgICAvLyBUaGVzZSBhbGwgZXh0ZW5kIGZyb20gYHNlbGVjdENvbGxlY3Rpb25gXG4gICAgY29uc3QgZXh0cmEgPSBtZXRhZGF0YS5hZGRpdGlvbmFsQ29sbGVjdGlvblN0YXRlIHx8IHt9O1xuICAgIGNvbnN0IGV4dHJhU2VsZWN0b3JzOiB7XG4gICAgICBbbmFtZTogc3RyaW5nXTogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgYW55PjtcbiAgICB9ID0ge307XG4gICAgT2JqZWN0LmtleXMoZXh0cmEpLmZvckVhY2goKGspID0+IHtcbiAgICAgIGV4dHJhU2VsZWN0b3JzWydzZWxlY3QnICsga1swXS50b1VwcGVyQ2FzZSgpICsgay5zbGljZSgxKV0gPSAoXG4gICAgICAgIGM6IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgICAgICkgPT4gKDxhbnk+Yylba107XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0Q291bnQsXG4gICAgICBzZWxlY3RFbnRpdGllcyxcbiAgICAgIHNlbGVjdEVudGl0eU1hcCxcbiAgICAgIHNlbGVjdEZpbHRlcixcbiAgICAgIHNlbGVjdEZpbHRlcmVkRW50aXRpZXMsXG4gICAgICBzZWxlY3RLZXlzLFxuICAgICAgc2VsZWN0TG9hZGVkLFxuICAgICAgc2VsZWN0TG9hZGluZyxcbiAgICAgIHNlbGVjdENoYW5nZVN0YXRlLFxuICAgICAgLi4uZXh0cmFTZWxlY3RvcnMsXG4gICAgfSBhcyBTO1xuICB9XG5cbiAgLy8vLy8vLyBjcmVhdGUgLy8vLy8vLy8vL1xuXG4gIC8vIGNyZWF0ZShtZXRhZGF0YSkgb3ZlcmxvYWRcbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHN0b3JlLXJvb3RlZCBzZWxlY3RvcnMgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uLlxuICAgKiB7RW50aXR5U2VsZWN0b3JzJEZhY3Rvcnl9IHR1cm5zIHRoZW0gaW50byBzZWxlY3RvcnMkLlxuICAgKlxuICAgKiBAcGFyYW0gbWV0YWRhdGEgLSBFbnRpdHlNZXRhZGF0YSBmb3IgdGhlIGNvbGxlY3Rpb24uXG4gICAqIE1heSBiZSBwYXJ0aWFsIGJ1dCBtdWNoIGhhdmUgYGVudGl0eU5hbWVgLlxuICAgKlxuICAgKiBCYXNlZCBvbiBuZ3J4L2VudGl0eS9zdGF0ZV9zZWxlY3RvcnMudHNcbiAgICogRGlmZmVycyBpbiB0aGF0IHRoZXNlIHNlbGVjdG9ycyBzZWxlY3QgZnJvbSB0aGUgTmdSeCBzdG9yZSByb290LFxuICAgKiB0aHJvdWdoIHRoZSBjb2xsZWN0aW9uLCB0byB0aGUgY29sbGVjdGlvbiBtZW1iZXJzLlxuICAgKi9cbiAgY3JlYXRlPFQsIFMgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnM8VD4gPSBFbnRpdHlTZWxlY3RvcnM8VD4+KFxuICAgIG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YTxUPlxuICApOiBTO1xuXG4gIC8vIGNyZWF0ZShlbnRpdHlOYW1lKSBvdmVybG9hZFxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgZGVmYXVsdCBzdG9yZS1yb290ZWQgc2VsZWN0b3JzIGZvciBhbiBlbnRpdHkgY29sbGVjdGlvbi5cbiAgICoge0VudGl0eVNlbGVjdG9ycyRGYWN0b3J5fSB0dXJucyB0aGVtIGludG8gc2VsZWN0b3JzJC5cbiAgICogVXNlIHRoZSBtZXRhZGF0YSBvdmVybG9hZCBmb3IgYWRkaXRpb25hbCBjb2xsZWN0aW9uIHNlbGVjdG9ycy5cbiAgICpcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZS5cbiAgICpcbiAgICogQmFzZWQgb24gbmdyeC9lbnRpdHkvc3RhdGVfc2VsZWN0b3JzLnRzXG4gICAqIERpZmZlcnMgaW4gdGhhdCB0aGVzZSBzZWxlY3RvcnMgc2VsZWN0IGZyb20gdGhlIE5nUnggc3RvcmUgcm9vdCxcbiAgICogdGhyb3VnaCB0aGUgY29sbGVjdGlvbiwgdG8gdGhlIGNvbGxlY3Rpb24gbWVtYmVycy5cbiAgICovXG4gIGNyZWF0ZTxULCBTIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzPFQ+ID0gRW50aXR5U2VsZWN0b3JzPFQ+PihcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dW5pZmllZC1zaWduYXR1cmVzXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IFM7XG5cbiAgLy8gY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9ycyBpbXBsZW1lbnRhdGlvblxuICBjcmVhdGU8VCwgUyBleHRlbmRzIEVudGl0eVNlbGVjdG9yczxUPiA9IEVudGl0eVNlbGVjdG9yczxUPj4oXG4gICAgbWV0YWRhdGFPck5hbWU6IEVudGl0eU1ldGFkYXRhPFQ+IHwgc3RyaW5nXG4gICk6IFMge1xuICAgIGNvbnN0IG1ldGFkYXRhID1cbiAgICAgIHR5cGVvZiBtZXRhZGF0YU9yTmFtZSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7IGVudGl0eU5hbWU6IG1ldGFkYXRhT3JOYW1lIH1cbiAgICAgICAgOiBtZXRhZGF0YU9yTmFtZTtcbiAgICBjb25zdCBlbnRpdHlOYW1lID0gbWV0YWRhdGEuZW50aXR5TmFtZTtcbiAgICBjb25zdCBzZWxlY3RDb2xsZWN0aW9uOiBTZWxlY3RvcjxcbiAgICAgIE9iamVjdCxcbiAgICAgIEVudGl0eUNvbGxlY3Rpb248VD5cbiAgICA+ID0gdGhpcy5jcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3I8VD4oZW50aXR5TmFtZSk7XG4gICAgY29uc3QgY29sbGVjdGlvblNlbGVjdG9ycyA9IHRoaXMuY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9yczxUPihtZXRhZGF0YSk7XG5cbiAgICBjb25zdCBlbnRpdHlTZWxlY3RvcnM6IHtcbiAgICAgIFtuYW1lOiBzdHJpbmddOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBhbnk+O1xuICAgIH0gPSB7fTtcbiAgICBPYmplY3Qua2V5cyhjb2xsZWN0aW9uU2VsZWN0b3JzKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBlbnRpdHlTZWxlY3RvcnNba10gPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0Q29sbGVjdGlvbixcbiAgICAgICAgY29sbGVjdGlvblNlbGVjdG9yc1trXVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgc2VsZWN0Q29sbGVjdGlvbixcbiAgICAgIHNlbGVjdEVudGl0eUNhY2hlOiB0aGlzLnNlbGVjdEVudGl0eUNhY2hlLFxuICAgICAgLi4uZW50aXR5U2VsZWN0b3JzLFxuICAgIH0gYXMgUztcbiAgfVxufVxuIl19