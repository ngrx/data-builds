/**
 * @fileoverview added by tsickle
 * Generated from: src/selectors/entity-selectors$.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter, shareReplay } from 'rxjs/operators';
import { OP_ERROR } from '../actions/entity-op';
import { ofEntityType } from '../actions/entity-action-operators';
import { ENTITY_CACHE_SELECTOR_TOKEN, } from './entity-cache-selector';
/**
 * The selector observable functions for entity collection members.
 * @record
 * @template T
 */
export function EntitySelectors$() { }
if (false) {
    /**
     * Name of the entity collection for these selectors$
     * @type {?}
     */
    EntitySelectors$.prototype.entityName;
    /**
     * Observable of the collection as a whole
     * @type {?}
     */
    EntitySelectors$.prototype.collection$;
    /**
     * Observable of count of entities in the cached collection.
     * @type {?}
     */
    EntitySelectors$.prototype.count$;
    /**
     * Observable of all entities in the cached collection.
     * @type {?}
     */
    EntitySelectors$.prototype.entities$;
    /**
     * Observable of actions related to this entity type.
     * @type {?}
     */
    EntitySelectors$.prototype.entityActions$;
    /**
     * Observable of the map of entity keys to entities
     * @type {?}
     */
    EntitySelectors$.prototype.entityMap$;
    /**
     * Observable of error actions related to this entity type.
     * @type {?}
     */
    EntitySelectors$.prototype.errors$;
    /**
     * Observable of the filter pattern applied by the entity collection's filter function
     * @type {?}
     */
    EntitySelectors$.prototype.filter$;
    /**
     * Observable of entities in the cached collection that pass the filter function
     * @type {?}
     */
    EntitySelectors$.prototype.filteredEntities$;
    /**
     * Observable of the keys of the cached collection, in the collection's native sort order
     * @type {?}
     */
    EntitySelectors$.prototype.keys$;
    /**
     * Observable true when the collection has been loaded
     * @type {?}
     */
    EntitySelectors$.prototype.loaded$;
    /**
     * Observable true when a multi-entity query command is in progress.
     * @type {?}
     */
    EntitySelectors$.prototype.loading$;
    /**
     * ChangeState (including original values) of entities with unsaved changes
     * @type {?}
     */
    EntitySelectors$.prototype.changeState$;
    /* Skipping unhandled member: readonly [name: string]: Observable<any> | Store<any> | any;*/
}
/**
 * Creates observable EntitySelectors$ for entity collections.
 */
export class EntitySelectors$Factory {
    /**
     * @param {?} store
     * @param {?} actions
     * @param {?} selectEntityCache
     */
    constructor(store, actions, selectEntityCache) {
        this.store = store;
        this.actions = actions;
        this.selectEntityCache = selectEntityCache;
        // This service applies to the cache in ngrx/store named `cacheName`
        this.entityCache$ = this.store.select(this.selectEntityCache);
        this.entityActionErrors$ = actions.pipe(filter((/**
         * @param {?} ea
         * @return {?}
         */
        (ea) => ea.payload &&
            ea.payload.entityOp &&
            ea.payload.entityOp.endsWith(OP_ERROR))), shareReplay(1));
    }
    /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @template T, S$
     * @param {?} entityName - is also the name of the collection.
     * @param {?} selectors - selector functions for this collection.
     *
     * @return {?}
     */
    create(entityName, selectors) {
        /** @type {?} */
        const selectors$ = {
            entityName,
        };
        Object.keys(selectors).forEach((/**
         * @param {?} name
         * @return {?}
         */
        (name) => {
            if (name.startsWith('select')) {
                // strip 'select' prefix from the selector fn name and append `$`
                // Ex: 'selectEntities' => 'entities$'
                /** @type {?} */
                const name$ = name[6].toLowerCase() + name.substr(7) + '$';
                selectors$[name$] = this.store.select(((/** @type {?} */ (selectors)))[name]);
            }
        }));
        selectors$.entityActions$ = this.actions.pipe(ofEntityType(entityName));
        selectors$.errors$ = this.entityActionErrors$.pipe(ofEntityType(entityName));
        return (/** @type {?} */ (selectors$));
    }
}
EntitySelectors$Factory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntitySelectors$Factory.ctorParameters = () => [
    { type: Store },
    { type: Actions },
    { type: undefined, decorators: [{ type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] }
];
if (false) {
    /**
     * Observable of the EntityCache
     * @type {?}
     */
    EntitySelectors$Factory.prototype.entityCache$;
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @type {?}
     */
    EntitySelectors$Factory.prototype.entityActionErrors$;
    /**
     * @type {?}
     * @private
     */
    EntitySelectors$Factory.prototype.store;
    /**
     * @type {?}
     * @private
     */
    EntitySelectors$Factory.prototype.actions;
    /**
     * @type {?}
     * @private
     */
    EntitySelectors$Factory.prototype.selectEntityCache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycyQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUl4QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3JELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbEUsT0FBTyxFQUNMLDJCQUEyQixHQUU1QixNQUFNLHlCQUF5QixDQUFDOzs7Ozs7QUFXakMsc0NBNENDOzs7Ozs7SUExQ0Msc0NBQTRCOzs7OztJQU01Qix1Q0FBNkU7Ozs7O0lBRzdFLGtDQUFvRDs7Ozs7SUFHcEQscUNBQWlEOzs7OztJQUdqRCwwQ0FBa0Q7Ozs7O0lBR2xELHNDQUFzRTs7Ozs7SUFHdEUsbUNBQTJDOzs7OztJQUczQyxtQ0FBcUQ7Ozs7O0lBR3JELDZDQUF5RDs7Ozs7SUFHekQsaUNBQTZFOzs7OztJQUc3RSxtQ0FBdUQ7Ozs7O0lBR3ZELG9DQUF3RDs7Ozs7SUFHeEQsd0NBRTZCOzs7Ozs7QUFLL0IsTUFBTSxPQUFPLHVCQUF1Qjs7Ozs7O0lBT2xDLFlBQ1UsS0FBaUIsRUFDakIsT0FBOEIsRUFFOUIsaUJBQXNDO1FBSHRDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFFOUIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFxQjtRQUU5QyxvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FDckMsTUFBTTs7OztRQUNKLENBQUMsRUFBZ0IsRUFBRSxFQUFFLENBQ25CLEVBQUUsQ0FBQyxPQUFPO1lBQ1YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRO1lBQ25CLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFDekMsRUFDRCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQ2YsQ0FBQztJQUNKLENBQUM7Ozs7Ozs7Ozs7SUFRRCxNQUFNLENBQ0osVUFBa0IsRUFDbEIsU0FBNkI7O2NBRXZCLFVBQVUsR0FBNEI7WUFDMUMsVUFBVTtTQUNYO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN0QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7Ozs7c0JBR3ZCLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHO2dCQUMxRCxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxtQkFBSyxTQUFTLEVBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDL0Q7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDeEUsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUNoRCxZQUFZLENBQUMsVUFBVSxDQUFDLENBQ3pCLENBQUM7UUFDRixPQUFPLG1CQUFBLFVBQVUsRUFBTSxDQUFDO0lBQzFCLENBQUM7OztZQXRERixVQUFVOzs7O1lBdkVGLEtBQUs7WUFDTCxPQUFPOzRDQWlGWCxNQUFNLFNBQUMsMkJBQTJCOzs7Ozs7O0lBUnJDLCtDQUFzQzs7Ozs7SUFHdEMsc0RBQThDOzs7OztJQUc1Qyx3Q0FBeUI7Ozs7O0lBQ3pCLDBDQUFzQzs7Ozs7SUFDdEMsb0RBQzhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHNoYXJlUmVwbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgT1BfRVJST1IgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eVR5cGUgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTixcbiAgRW50aXR5Q2FjaGVTZWxlY3Rvcixcbn0gZnJvbSAnLi9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzIH0gZnJvbSAnLi9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb24sXG4gIENoYW5nZVN0YXRlTWFwLFxufSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5cbi8qKlxuICogVGhlIHNlbGVjdG9yIG9ic2VydmFibGUgZnVuY3Rpb25zIGZvciBlbnRpdHkgY29sbGVjdGlvbiBtZW1iZXJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVNlbGVjdG9ycyQ8VD4ge1xuICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IGNvbGxlY3Rpb24gZm9yIHRoZXNlIHNlbGVjdG9ycyQgKi9cbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuXG4gIC8qKiBOYW1lcyBmcm9tIGN1c3RvbSBzZWxlY3RvcnMgZnJvbSBhZGRpdGlvbmFsQ29sbGVjdGlvblN0YXRlIGZpdHMgaGVyZSwgJ2FueScgdG8gYXZvaWQgY29uZmxpY3Qgd2l0aCBlbnRpdHlOYW1lICovXG4gIHJlYWRvbmx5IFtuYW1lOiBzdHJpbmddOiBPYnNlcnZhYmxlPGFueT4gfCBTdG9yZTxhbnk+IHwgYW55O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uIGFzIGEgd2hvbGUgKi9cbiAgcmVhZG9ubHkgY29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbj4gfCBTdG9yZTxFbnRpdHlDb2xsZWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBjb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IGNvdW50JDogT2JzZXJ2YWJsZTxudW1iZXI+IHwgU3RvcmU8bnVtYmVyPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBlbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIHJlYWRvbmx5IGVudGl0eUFjdGlvbnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIG1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICByZWFkb25seSBlbnRpdHlNYXAkOiBPYnNlcnZhYmxlPERpY3Rpb25hcnk8VD4+IHwgU3RvcmU8RGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIHJlYWRvbmx5IGVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgZmlsdGVyJDogT2JzZXJ2YWJsZTxzdHJpbmc+IHwgU3RvcmU8c3RyaW5nPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgZmlsdGVyZWRFbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIHJlYWRvbmx5IGtleXMkOiBPYnNlcnZhYmxlPHN0cmluZ1tdIHwgbnVtYmVyW10+IHwgU3RvcmU8c3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGxvYWRlZCAqL1xuICByZWFkb25seSBsb2FkZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIHJlYWRvbmx5IGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIENoYW5nZVN0YXRlIChpbmNsdWRpbmcgb3JpZ2luYWwgdmFsdWVzKSBvZiBlbnRpdGllcyB3aXRoIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICByZWFkb25seSBjaGFuZ2VTdGF0ZSQ6XG4gICAgfCBPYnNlcnZhYmxlPENoYW5nZVN0YXRlTWFwPFQ+PlxuICAgIHwgU3RvcmU8Q2hhbmdlU3RhdGVNYXA8VD4+O1xufVxuXG4vKiogQ3JlYXRlcyBvYnNlcnZhYmxlIEVudGl0eVNlbGVjdG9ycyQgZm9yIGVudGl0eSBjb2xsZWN0aW9ucy4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB7XG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBFbnRpdHlDYWNoZSAqL1xuICBlbnRpdHlDYWNoZSQ6IE9ic2VydmFibGU8RW50aXR5Q2FjaGU+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICBlbnRpdHlBY3Rpb25FcnJvcnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnM8RW50aXR5QWN0aW9uPixcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTilcbiAgICBwcml2YXRlIHNlbGVjdEVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZVNlbGVjdG9yXG4gICkge1xuICAgIC8vIFRoaXMgc2VydmljZSBhcHBsaWVzIHRvIHRoZSBjYWNoZSBpbiBuZ3J4L3N0b3JlIG5hbWVkIGBjYWNoZU5hbWVgXG4gICAgdGhpcy5lbnRpdHlDYWNoZSQgPSB0aGlzLnN0b3JlLnNlbGVjdCh0aGlzLnNlbGVjdEVudGl0eUNhY2hlKTtcbiAgICB0aGlzLmVudGl0eUFjdGlvbkVycm9ycyQgPSBhY3Rpb25zLnBpcGUoXG4gICAgICBmaWx0ZXIoXG4gICAgICAgIChlYTogRW50aXR5QWN0aW9uKSA9PlxuICAgICAgICAgIGVhLnBheWxvYWQgJiZcbiAgICAgICAgICBlYS5wYXlsb2FkLmVudGl0eU9wICYmXG4gICAgICAgICAgZWEucGF5bG9hZC5lbnRpdHlPcC5lbmRzV2l0aChPUF9FUlJPUilcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBlbnRpdHkgY29sbGVjdGlvbidzIHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZm9yIHRoaXMgZmFjdG9yeSdzIHN0b3JlLlxuICAgKiBgc2VsZWN0b3JzJGAgYXJlIG9ic2VydmFibGUgc2VsZWN0b3JzIG9mIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gaXMgYWxzbyB0aGUgbmFtZSBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHNlbGVjdG9ycyAtIHNlbGVjdG9yIGZ1bmN0aW9ucyBmb3IgdGhpcyBjb2xsZWN0aW9uLlxuICAgKiovXG4gIGNyZWF0ZTxULCBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD5cbiAgKTogUyQge1xuICAgIGNvbnN0IHNlbGVjdG9ycyQ6IHsgW3Byb3A6IHN0cmluZ106IGFueSB9ID0ge1xuICAgICAgZW50aXR5TmFtZSxcbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoc2VsZWN0b3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdzZWxlY3QnKSkge1xuICAgICAgICAvLyBzdHJpcCAnc2VsZWN0JyBwcmVmaXggZnJvbSB0aGUgc2VsZWN0b3IgZm4gbmFtZSBhbmQgYXBwZW5kIGAkYFxuICAgICAgICAvLyBFeDogJ3NlbGVjdEVudGl0aWVzJyA9PiAnZW50aXRpZXMkJ1xuICAgICAgICBjb25zdCBuYW1lJCA9IG5hbWVbNl0udG9Mb3dlckNhc2UoKSArIG5hbWUuc3Vic3RyKDcpICsgJyQnO1xuICAgICAgICBzZWxlY3RvcnMkW25hbWUkXSA9IHRoaXMuc3RvcmUuc2VsZWN0KCg8YW55PnNlbGVjdG9ycylbbmFtZV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGVjdG9ycyQuZW50aXR5QWN0aW9ucyQgPSB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoZW50aXR5TmFtZSkpO1xuICAgIHNlbGVjdG9ycyQuZXJyb3JzJCA9IHRoaXMuZW50aXR5QWN0aW9uRXJyb3JzJC5waXBlKFxuICAgICAgb2ZFbnRpdHlUeXBlKGVudGl0eU5hbWUpXG4gICAgKTtcbiAgICByZXR1cm4gc2VsZWN0b3JzJCBhcyBTJDtcbiAgfVxufVxuIl19