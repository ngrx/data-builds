/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUk3RCxPQUFPLEVBQXlCLGNBQWMsRUFBWSxNQUFNLGFBQWEsQ0FBQztBQU05RSxPQUFPLEVBQ0wsMkJBQTJCLEVBRTNCLHlCQUF5QixHQUMxQixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBSzFELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDOzs7Ozs7OztBQVNoRix5Q0E2QkM7Ozs7OztJQXpCQywwQ0FBNEQ7Ozs7O0lBRzVELDZDQUE0RDs7Ozs7SUFHNUQsOENBQXVFOzs7OztJQUd2RSwyQ0FBNkQ7Ozs7O0lBRzdELHFEQUFvRTs7Ozs7SUFHcEUseUNBQXdFOzs7OztJQUd4RSwyQ0FBOEQ7Ozs7O0lBRzlELDRDQUErRDs7Ozs7SUFHL0QsZ0RBQTZFOzs7Ozs7Ozs7O0FBUS9FLHFDQXNDQzs7Ozs7O0lBcENDLHFDQUE0Qjs7Ozs7SUFLNUIsMkNBQXlFOzs7OztJQUd6RSxzQ0FBdUQ7Ozs7O0lBR3ZELHlDQUF1RDs7Ozs7SUFHdkQsNENBQWtFOzs7OztJQUdsRSwwQ0FBa0U7Ozs7O0lBR2xFLHVDQUF3RDs7Ozs7SUFHeEQsaURBQStEOzs7OztJQUcvRCxxQ0FBbUU7Ozs7O0lBR25FLHVDQUF5RDs7Ozs7SUFHekQsd0NBQTBEOzs7OztJQUcxRCw0Q0FBd0U7Ozs7OztBQUsxRSxNQUFNLE9BQU8sc0JBQXNCOzs7OztJQUlqQyxZQUNjLHVCQUFpRCxFQUc3RCxpQkFBdUM7UUFFdkMsSUFBSSxDQUFDLHVC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QWE7WUFDYixpQkFBaUIsSUFDZCxjQUFjLEdBQ2IsQ0FBQztJQUNULENBQUM7Ozs7Ozs7SUFzQ0QsTUFBTSxDQUNKLGNBQTBDOztjQUVwQyxRQUFRLEdBQ1osT0FBTyxjQUFjLEtBQUssUUFBUTtZQUNoQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFO1lBQ2hDLENBQUMsQ0FBQyxjQUFjOztjQUNkLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVTs7Y0FDaEMsZ0JBQWdCLEdBR2xCLElBQUksQ0FBQyx3QkFBd0IsQ0FBSSxVQUFVLENBQUM7O2NBQzFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBSSxRQUFRLENBQUM7O2NBRWpFLGVBQWUsR0FFakIsRUFBRTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0MsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FDakMsZ0JBQWdCLEVBQ2hCLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUN2QixDQUFDO1FBQ0osQ0FBQyxFQUFDLENBQUM7UUFFSCxPQUFPLG1DQUNMLFVBQVU7WUFDVixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixJQUN0QyxlQUFlLEdBQ2QsQ0FBQztJQUNULENBQUM7OztZQWxNRixVQUFVOzs7O1lBdEZGLHVCQUF1Qix1QkE0RjNCLFFBQVE7NENBQ1IsUUFBUSxZQUNSLE1BQU0sU0FBQywyQkFBMkI7Ozs7Ozs7SUFOckMseURBQXlEOzs7OztJQUN6RCxtREFBK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8vIFByb2QgYnVpbGQgcmVxdWlyZXMgYE1lbW9pemVkU2VsZWN0b3IgZXZlbiB0aG91Z2ggbm90IHVzZWQuXG5pbXBvcnQgeyBNZW1vaXplZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgY3JlYXRlRmVhdHVyZVNlbGVjdG9yLCBjcmVhdGVTZWxlY3RvciwgU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4sXG4gIEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gIGNyZWF0ZUVudGl0eUNhY2hlU2VsZWN0b3IsXG59IGZyb20gJy4vZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVOVElUWV9DQUNIRV9OQU1FIH0gZnJvbSAnLi4vcmVkdWNlcnMvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb24sXG4gIENoYW5nZVN0YXRlTWFwLFxufSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5RmlsdGVyRm4gfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWZpbHRlcnMnO1xuaW1wb3J0IHsgRW50aXR5TWV0YWRhdGEgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhJztcblxuLyoqXG4gKiBUaGUgc2VsZWN0b3IgZnVuY3Rpb25zIGZvciBlbnRpdHkgY29sbGVjdGlvbiBtZW1iZXJzLFxuICogU2VsZWN0cyBmcm9tIHRoZSBlbnRpdHkgY29sbGVjdGlvbiB0byB0aGUgY29sbGVjdGlvbiBtZW1iZXJcbiAqIENvbnRyYXN0IHdpdGgge0VudGl0eVNlbGVjdG9yc30uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29sbGVjdGlvblNlbGVjdG9yczxUPiB7XG4gIHJlYWRvbmx5IFtzZWxlY3Rvcjogc3RyaW5nXTogYW55O1xuXG4gIC8qKiBDb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IHNlbGVjdENvdW50OiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBudW1iZXI+O1xuXG4gIC8qKiBBbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBzZWxlY3RFbnRpdGllczogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgVFtdPjtcblxuICAvKiogTWFwIG9mIGVudGl0eSBrZXlzIHRvIGVudGl0aWVzICovXG4gIHJlYWRvbmx5IHNlbGVjdEVudGl0eU1hcDogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgRGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIEZpbHRlciBwYXR0ZXJuIGFwcGxpZWQgYnkgdGhlIGVudGl0eSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGZ1bmN0aW9uICovXG4gIHJlYWRvbmx5IHNlbGVjdEZpbHRlcjogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgc3RyaW5nPjtcblxuICAvKiogRW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHRoYXQgcGFzcyB0aGUgZmlsdGVyIGZ1bmN0aW9uICovXG4gIHJlYWRvbmx5IHNlbGVjdEZpbHRlcmVkRW50aXRpZXM6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIFRbXT47XG5cbiAgLyoqIEtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIHJlYWRvbmx5IHNlbGVjdEtleXM6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIHN0cmluZ1tdIHwgbnVtYmVyW10+O1xuXG4gIC8qKiBUcnVlIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gZnVsbHkgbG9hZGVkLiAqL1xuICByZWFkb25seSBzZWxlY3RMb2FkZWQ6IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIGJvb2xlYW4+O1xuXG4gIC8qKiBUcnVlIHdoZW4gYSBtdWx0aS1lbnRpdHkgcXVlcnkgY29tbWFuZCBpcyBpbiBwcm9ncmVzcy4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0TG9hZGluZzogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgYm9vbGVhbj47XG5cbiAgLyoqIENoYW5nZVN0YXRlIChpbmNsdWRpbmcgb3JpZ2luYWwgdmFsdWVzKSBvZiBlbnRpdGllcyB3aXRoIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICByZWFkb25seSBzZWxlY3RDaGFuZ2VTdGF0ZTogU2VsZWN0b3I8RW50aXR5Q29sbGVjdGlvbjxUPiwgQ2hhbmdlU3RhdGVNYXA8VD4+O1xufVxuXG4vKipcbiAqIFRoZSBzZWxlY3RvciBmdW5jdGlvbnMgZm9yIGVudGl0eSBjb2xsZWN0aW9uIG1lbWJlcnMsXG4gKiBTZWxlY3RzIGZyb20gc3RvcmUgcm9vdCwgdGhyb3VnaCBFbnRpdHlDYWNoZSwgdG8gdGhlIGVudGl0eSBjb2xsZWN0aW9uIG1lbWJlclxuICogQ29udHJhc3Qgd2l0aCB7Q29sbGVjdGlvblNlbGVjdG9yc30uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5U2VsZWN0b3JzPFQ+IHtcbiAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSBjb2xsZWN0aW9uIGZvciB0aGVzZSBzZWxlY3RvcnMgKi9cbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IFtuYW1lOiBzdHJpbmddOiBNZW1vaXplZFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIGFueT4gfCBzdHJpbmc7XG5cbiAgLyoqIFRoZSBjYWNoZWQgRW50aXR5Q29sbGVjdGlvbiBpdHNlbGYgKi9cbiAgcmVhZG9ubHkgc2VsZWN0Q29sbGVjdGlvbjogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIEVudGl0eUNvbGxlY3Rpb248VD4+O1xuXG4gIC8qKiBDb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IHNlbGVjdENvdW50OiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgbnVtYmVyPjtcblxuICAvKiogQWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0RW50aXRpZXM6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBUW10+O1xuXG4gIC8qKiBUaGUgRW50aXR5Q2FjaGUgKi9cbiAgcmVhZG9ubHkgc2VsZWN0RW50aXR5Q2FjaGU6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBFbnRpdHlDYWNoZT47XG5cbiAgLyoqIE1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICByZWFkb25seSBzZWxlY3RFbnRpdHlNYXA6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBEaWN0aW9uYXJ5PFQ+PjtcblxuICAvKiogRmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgc2VsZWN0RmlsdGVyOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgc3RyaW5nPjtcblxuICAvKiogRW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHRoYXQgcGFzcyB0aGUgZmlsdGVyIGZ1bmN0aW9uICovXG4gIHJlYWRvbmx5IHNlbGVjdEZpbHRlcmVkRW50aXRpZXM6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBUW10+O1xuXG4gIC8qKiBLZXlzIG9mIHRoZSBjYWNoZWQgY29sbGVjdGlvbiwgaW4gdGhlIGNvbGxlY3Rpb24ncyBuYXRpdmUgc29ydCBvcmRlciAqL1xuICByZWFkb25seSBzZWxlY3RLZXlzOiBNZW1vaXplZFNlbGVjdG9yPE9iamVjdCwgc3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIFRydWUgd2hlbiB0aGUgY29sbGVjdGlvbiBoYXMgYmVlbiBmdWxseSBsb2FkZWQuICovXG4gIHJlYWRvbmx5IHNlbGVjdExvYWRlZDogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIGJvb2xlYW4+O1xuXG4gIC8qKiBUcnVlIHdoZW4gYSBtdWx0aS1lbnRpdHkgcXVlcnkgY29tbWFuZCBpcyBpbiBwcm9ncmVzcy4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0TG9hZGluZzogTWVtb2l6ZWRTZWxlY3RvcjxPYmplY3QsIGJvb2xlYW4+O1xuXG4gIC8qKiBDaGFuZ2VTdGF0ZSAoaW5jbHVkaW5nIG9yaWdpbmFsIHZhbHVlcykgb2YgZW50aXRpZXMgd2l0aCB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgcmVhZG9ubHkgc2VsZWN0Q2hhbmdlU3RhdGU6IE1lbW9pemVkU2VsZWN0b3I8T2JqZWN0LCBDaGFuZ2VTdGF0ZU1hcDxUPj47XG59XG5cbi8qKiBDcmVhdGVzIEVudGl0eVNlbGVjdG9yIGZ1bmN0aW9ucyBmb3IgZW50aXR5IGNvbGxlY3Rpb25zLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eVNlbGVjdG9yc0ZhY3Rvcnkge1xuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25DcmVhdG9yOiBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcjtcbiAgcHJpdmF0ZSBzZWxlY3RFbnRpdHlDYWNoZTogRW50aXR5Q2FjaGVTZWxlY3RvcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBlbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcj86IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4pXG4gICAgc2VsZWN0RW50aXR5Q2FjaGU/OiBFbnRpdHlDYWNoZVNlbGVjdG9yXG4gICkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgPVxuICAgICAgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfHwgbmV3IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yKCk7XG4gICAgdGhpcy5zZWxlY3RFbnRpdHlDYWNoZSA9XG4gICAgICBzZWxlY3RFbnRpdHlDYWNoZSB8fCBjcmVhdGVFbnRpdHlDYWNoZVNlbGVjdG9yKEVOVElUWV9DQUNIRV9OQU1FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIE5nUnggc2VsZWN0b3IgZnJvbSB0aGUgc3RvcmUgcm9vdCB0byB0aGUgbmFtZWQgY29sbGVjdGlvbixcbiAgICogZS5nLiBmcm9tIE9iamVjdCB0byBIZXJvZXMuXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHRoZSBuYW1lIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAqL1xuICBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3I8XG4gICAgVCA9IGFueSxcbiAgICBDIGV4dGVuZHMgRW50aXR5Q29sbGVjdGlvbjxUPiA9IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBnZXRDb2xsZWN0aW9uID0gKGNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9KSA9PlxuICAgICAgPEM+KFxuICAgICAgICAoY2FjaGVbZW50aXR5TmFtZV0gfHxcbiAgICAgICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLmNyZWF0ZTxUPihlbnRpdHlOYW1lKSlcbiAgICAgICk7XG4gICAgcmV0dXJuIGNyZWF0ZVNlbGVjdG9yKHRoaXMuc2VsZWN0RW50aXR5Q2FjaGUsIGdldENvbGxlY3Rpb24pO1xuICB9XG5cbiAgLy8vLy8vLyBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzIC8vLy8vLy8vLy9cblxuICAvLyBCYXNlZCBvbiBAbmdyeC9lbnRpdHkvc3RhdGVfc2VsZWN0b3JzLnRzXG5cbiAgLy8gdHNsaW50OmRpc2FibGU6dW5pZmllZC1zaWduYXR1cmVzXG4gIC8vIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnMobWV0YWRhdGEpIG92ZXJsb2FkXG4gIC8qKlxuICAgKiBDcmVhdGVzIGVudGl0eSBjb2xsZWN0aW9uIHNlbGVjdG9ycyBmcm9tIG1ldGFkYXRhLlxuICAgKiBAcGFyYW0gbWV0YWRhdGEgLSBFbnRpdHlNZXRhZGF0YSBmb3IgdGhlIGNvbGxlY3Rpb24uXG4gICAqIE1heSBiZSBwYXJ0aWFsIGJ1dCBtdWNoIGhhdmUgYGVudGl0eU5hbWVgLlxuICAgKi9cbiAgY3JlYXRlQ29sbGVjdGlvblNlbGVjdG9yczxcbiAgICBULFxuICAgIFMgZXh0ZW5kcyBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+ID0gQ29sbGVjdGlvblNlbGVjdG9yczxUPlxuICA+KG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YTxUPik6IFM7XG5cbiAgLy8gdHNsaW50OmRpc2FibGU6dW5pZmllZC1zaWduYXR1cmVzXG4gIC8vIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnMoZW50aXR5TmFtZSkgb3ZlcmxvYWRcbiAgLyoqXG4gICAqIENyZWF0ZXMgZGVmYXVsdCBlbnRpdHkgY29sbGVjdGlvbiBzZWxlY3RvcnMgZm9yIGFuIGVudGl0eSB0eXBlLlxuICAgKiBVc2UgdGhlIG1ldGFkYXRhIG92ZXJsb2FkIGZvciBhZGRpdGlvbmFsIGNvbGxlY3Rpb24gc2VsZWN0b3JzLlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzPFxuICAgIFQsXG4gICAgUyBleHRlbmRzIENvbGxlY3Rpb25TZWxlY3RvcnM8VD4gPSBDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKTogUztcblxuICAvLyBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzIGltcGxlbWVudGF0aW9uXG4gIGNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcnM8XG4gICAgVCxcbiAgICBTIGV4dGVuZHMgQ29sbGVjdGlvblNlbGVjdG9yczxUPiA9IENvbGxlY3Rpb25TZWxlY3RvcnM8VD5cbiAgPihtZXRhZGF0YU9yTmFtZTogRW50aXR5TWV0YWRhdGE8VD4gfCBzdHJpbmcpOiBTIHtcbiAgICBjb25zdCBtZXRhZGF0YSA9XG4gICAgICB0eXBlb2YgbWV0YWRhdGFPck5hbWUgPT09ICdzdHJpbmcnXG4gICAgICAgID8geyBlbnRpdHlOYW1lOiBtZXRhZGF0YU9yTmFtZSB9XG4gICAgICAgIDogbWV0YWRhdGFPck5hbWU7XG4gICAgY29uc3Qgc2VsZWN0S2V5cyA9IChjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSA9PiBjLmlkcztcbiAgICBjb25zdCBzZWxlY3RFbnRpdHlNYXAgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5lbnRpdGllcztcblxuICAgIGNvbnN0IHNlbGVjdEVudGl0aWVzOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBUW10+ID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBzZWxlY3RLZXlzLFxuICAgICAgc2VsZWN0RW50aXR5TWFwLFxuICAgICAgKGtleXM6IChudW1iZXIgfCBzdHJpbmcpW10sIGVudGl0aWVzOiBEaWN0aW9uYXJ5PFQ+KTogVFtdID0+XG4gICAgICAgIGtleXMubWFwKGtleSA9PiBlbnRpdGllc1trZXldIGFzIFQpXG4gICAgKTtcblxuICAgIGNvbnN0IHNlbGVjdENvdW50OiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBudW1iZXI+ID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBzZWxlY3RLZXlzLFxuICAgICAga2V5cyA9PiBrZXlzLmxlbmd0aFxuICAgICk7XG5cbiAgICAvLyBFbnRpdHlDb2xsZWN0aW9uIHNlbGVjdG9ycyB0aGF0IGdvIGJleW9uZCB0aGUgbmdyeC9lbnRpdHkvRW50aXR5U3RhdGUgc2VsZWN0b3JzXG4gICAgY29uc3Qgc2VsZWN0RmlsdGVyID0gKGM6IEVudGl0eUNvbGxlY3Rpb248VD4pID0+IGMuZmlsdGVyO1xuXG4gICAgY29uc3QgZmlsdGVyRm4gPSBtZXRhZGF0YS5maWx0ZXJGbjtcbiAgICBjb25zdCBzZWxlY3RGaWx0ZXJlZEVudGl0aWVzOiBTZWxlY3RvcjxFbnRpdHlDb2xsZWN0aW9uPFQ+LCBUW10+ID0gZmlsdGVyRm5cbiAgICAgID8gY3JlYXRlU2VsZWN0b3IoXG4gICAgICAgICAgc2VsZWN0RW50aXRpZXMsXG4gICAgICAgICAgc2VsZWN0RmlsdGVyLFxuICAgICAgICAgIChlbnRpdGllczogVFtdLCBwYXR0ZXJuOiBhbnkpOiBUW10gPT4gZmlsdGVyRm4oZW50aXRpZXMsIHBhdHRlcm4pXG4gICAgICAgIClcbiAgICAgIDogc2VsZWN0RW50aXRpZXM7XG5cbiAgICBjb25zdCBzZWxlY3RMb2FkZWQgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5sb2FkZWQ7XG4gICAgY29uc3Qgc2VsZWN0TG9hZGluZyA9IChjOiBFbnRpdHlDb2xsZWN0aW9uPFQ+KSA9PiBjLmxvYWRpbmc7XG4gICAgY29uc3Qgc2VsZWN0Q2hhbmdlU3RhdGUgPSAoYzogRW50aXR5Q29sbGVjdGlvbjxUPikgPT4gYy5jaGFuZ2VTdGF0ZTtcblxuICAgIC8vIENyZWF0ZSBjb2xsZWN0aW9uIHNlbGVjdG9ycyBmb3IgZWFjaCBgYWRkaXRpb25hbENvbGxlY3Rpb25TdGF0ZWAgcHJvcGVydHkuXG4gICAgLy8gVGhlc2UgYWxsIGV4dGVuZCBmcm9tIGBzZWxlY3RDb2xsZWN0aW9uYFxuICAgIGNvbnN0IGV4dHJhID0gbWV0YWRhdGEuYWRkaXRpb25hbENvbGxlY3Rpb25TdGF0ZSB8fCB7fTtcbiAgICBjb25zdCBleHRyYVNlbGVjdG9yczoge1xuICAgICAgW25hbWU6IHN0cmluZ106IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIGFueT47XG4gICAgfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGV4dHJhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgZXh0cmFTZWxlY3RvcnNbJ3NlbGVjdCcgKyBrWzBdLnRvVXBwZXJDYXNlKCkgKyBrLnNsaWNlKDEpXSA9IChcbiAgICAgICAgYzogRW50aXR5Q29sbGVjdGlvbjxUPlxuICAgICAgKSA9PiAoPGFueT5jKVtrXTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RDb3VudCxcbiAgICAgIHNlbGVjdEVudGl0aWVzLFxuICAgICAgc2VsZWN0RW50aXR5TWFwLFxuICAgICAgc2VsZWN0RmlsdGVyLFxuICAgICAgc2VsZWN0RmlsdGVyZWRFbnRpdGllcyxcbiAgICAgIHNlbGVjdEtleXMsXG4gICAgICBzZWxlY3RMb2FkZWQsXG4gICAgICBzZWxlY3RMb2FkaW5nLFxuICAgICAgc2VsZWN0Q2hhbmdlU3RhdGUsXG4gICAgICAuLi5leHRyYVNlbGVjdG9ycyxcbiAgICB9IGFzIFM7XG4gIH1cblxuICAvLy8vLy8vIGNyZWF0ZSAvLy8vLy8vLy8vXG5cbiAgLy8gY3JlYXRlKG1ldGFkYXRhKSBvdmVybG9hZFxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgc3RvcmUtcm9vdGVkIHNlbGVjdG9ycyBmb3IgYW4gZW50aXR5IGNvbGxlY3Rpb24uXG4gICAqIHtFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeX0gdHVybnMgdGhlbSBpbnRvIHNlbGVjdG9ycyQuXG4gICAqXG4gICAqIEBwYXJhbSBtZXRhZGF0YSAtIEVudGl0eU1ldGFkYXRhIGZvciB0aGUgY29sbGVjdGlvbi5cbiAgICogTWF5IGJlIHBhcnRpYWwgYnV0IG11Y2ggaGF2ZSBgZW50aXR5TmFtZWAuXG4gICAqXG4gICAqIEJhc2VkIG9uIG5ncngvZW50aXR5L3N0YXRlX3NlbGVjdG9ycy50c1xuICAgKiBEaWZmZXJzIGluIHRoYXQgdGhlc2Ugc2VsZWN0b3JzIHNlbGVjdCBmcm9tIHRoZSBOZ1J4IHN0b3JlIHJvb3QsXG4gICAqIHRocm91Z2ggdGhlIGNvbGxlY3Rpb24sIHRvIHRoZSBjb2xsZWN0aW9uIG1lbWJlcnMuXG4gICAqL1xuICBjcmVhdGU8VCwgUyBleHRlbmRzIEVudGl0eVNlbGVjdG9yczxUPiA9IEVudGl0eVNlbGVjdG9yczxUPj4oXG4gICAgbWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhPFQ+XG4gICk6IFM7XG5cbiAgLy8gY3JlYXRlKGVudGl0eU5hbWUpIG92ZXJsb2FkXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBkZWZhdWx0IHN0b3JlLXJvb3RlZCBzZWxlY3RvcnMgZm9yIGFuIGVudGl0eSBjb2xsZWN0aW9uLlxuICAgKiB7RW50aXR5U2VsZWN0b3JzJEZhY3Rvcnl9IHR1cm5zIHRoZW0gaW50byBzZWxlY3RvcnMkLlxuICAgKiBVc2UgdGhlIG1ldGFkYXRhIG92ZXJsb2FkIGZvciBhZGRpdGlvbmFsIGNvbGxlY3Rpb24gc2VsZWN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLlxuICAgKlxuICAgKiBCYXNlZCBvbiBuZ3J4L2VudGl0eS9zdGF0ZV9zZWxlY3RvcnMudHNcbiAgICogRGlmZmVycyBpbiB0aGF0IHRoZXNlIHNlbGVjdG9ycyBzZWxlY3QgZnJvbSB0aGUgTmdSeCBzdG9yZSByb290LFxuICAgKiB0aHJvdWdoIHRoZSBjb2xsZWN0aW9uLCB0byB0aGUgY29sbGVjdGlvbiBtZW1iZXJzLlxuICAgKi9cbiAgY3JlYXRlPFQsIFMgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnM8VD4gPSBFbnRpdHlTZWxlY3RvcnM8VD4+KFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp1bmlmaWVkLXNpZ25hdHVyZXNcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogUztcblxuICAvLyBjcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzIGltcGxlbWVudGF0aW9uXG4gIGNyZWF0ZTxULCBTIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzPFQ+ID0gRW50aXR5U2VsZWN0b3JzPFQ+PihcbiAgICBtZXRhZGF0YU9yTmFtZTogRW50aXR5TWV0YWRhdGE8VD4gfCBzdHJpbmdcbiAgKTogUyB7XG4gICAgY29uc3QgbWV0YWRhdGEgPVxuICAgICAgdHlwZW9mIG1ldGFkYXRhT3JOYW1lID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHsgZW50aXR5TmFtZTogbWV0YWRhdGFPck5hbWUgfVxuICAgICAgICA6IG1ldGFkYXRhT3JOYW1lO1xuICAgIGNvbnN0IGVudGl0eU5hbWUgPSBtZXRhZGF0YS5lbnRpdHlOYW1lO1xuICAgIGNvbnN0IHNlbGVjdENvbGxlY3Rpb246IFNlbGVjdG9yPFxuICAgICAgT2JqZWN0LFxuICAgICAgRW50aXR5Q29sbGVjdGlvbjxUPlxuICAgID4gPSB0aGlzLmNyZWF0ZUNvbGxlY3Rpb25TZWxlY3RvcjxUPihlbnRpdHlOYW1lKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uU2VsZWN0b3JzID0gdGhpcy5jcmVhdGVDb2xsZWN0aW9uU2VsZWN0b3JzPFQ+KG1ldGFkYXRhKTtcblxuICAgIGNvbnN0IGVudGl0eVNlbGVjdG9yczoge1xuICAgICAgW25hbWU6IHN0cmluZ106IFNlbGVjdG9yPEVudGl0eUNvbGxlY3Rpb248VD4sIGFueT47XG4gICAgfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGNvbGxlY3Rpb25TZWxlY3RvcnMpLmZvckVhY2goayA9PiB7XG4gICAgICBlbnRpdHlTZWxlY3RvcnNba10gPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0Q29sbGVjdGlvbixcbiAgICAgICAgY29sbGVjdGlvblNlbGVjdG9yc1trXVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgc2VsZWN0Q29sbGVjdGlvbixcbiAgICAgIHNlbGVjdEVudGl0eUNhY2hlOiB0aGlzLnNlbGVjdEVudGl0eUNhY2hlLFxuICAgICAgLi4uZW50aXR5U2VsZWN0b3JzLFxuICAgIH0gYXMgUztcbiAgfVxufVxuIl19