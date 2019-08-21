/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        name => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycyQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNwQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXhDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHckQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNsRSxPQUFPLEVBQ0wsMkJBQTJCLEdBRTVCLE1BQU0seUJBQXlCLENBQUM7Ozs7OztBQVdqQyxzQ0F5Q0M7Ozs7OztJQXZDQyxzQ0FBNEI7Ozs7O0lBRzVCLHVDQUE2RTs7Ozs7SUFHN0Usa0NBQW9EOzs7OztJQUdwRCxxQ0FBaUQ7Ozs7O0lBR2pELDBDQUFrRDs7Ozs7SUFHbEQsc0NBQXNFOzs7OztJQUd0RSxtQ0FBMkM7Ozs7O0lBRzNDLG1DQUFxRDs7Ozs7SUFHckQsNkNBQXlEOzs7OztJQUd6RCxpQ0FBNkU7Ozs7O0lBRzdFLG1DQUF1RDs7Ozs7SUFHdkQsb0NBQXdEOzs7OztJQUd4RCx3Q0FFNkI7Ozs7O0FBSy9CLE1BQU0sT0FBTyx1QkFBdUI7Ozs7OztJQU9sQyxZQUNVLEtBQWlCLEVBQ2pCLE9BQThCLEVBRTlCLGlCQUFzQztRQUh0QyxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBRTlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBcUI7UUFFOUMsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQ3JDLE1BQU07Ozs7UUFDSixDQUFDLEVBQWdCLEVBQUUsRUFBRSxDQUNuQixFQUFFLENBQUMsT0FBTztZQUNWLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUTtZQUNuQixFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQ3pDLEVBQ0QsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUNmLENBQUM7SUFDSixDQUFDOzs7Ozs7Ozs7O0lBUUQsTUFBTSxDQUNKLFVBQWtCLEVBQ2xCLFNBQTZCOztjQUV2QixVQUFVLEdBQTRCO1lBQzFDLFVBQVU7U0FDWDtRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTzs7OztRQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTs7OztzQkFHdkIsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7Z0JBQzFELFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLG1CQUFLLFNBQVMsRUFBQSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMvRDtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN4RSxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ2hELFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FDekIsQ0FBQztRQUNGLE9BQU8sbUJBQUEsVUFBVSxFQUFNLENBQUM7SUFDMUIsQ0FBQzs7O1lBdERGLFVBQVU7Ozs7WUFwRUYsS0FBSztZQUNMLE9BQU87NENBOEVYLE1BQU0sU0FBQywyQkFBMkI7Ozs7Ozs7SUFSckMsK0NBQXNDOzs7OztJQUd0QyxzREFBOEM7Ozs7O0lBRzVDLHdDQUF5Qjs7Ozs7SUFDekIsMENBQXNDOzs7OztJQUN0QyxvREFDOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucyB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgc2hhcmVSZXBsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBPUF9FUlJPUiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IG9mRW50aXR5VHlwZSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOLFxuICBFbnRpdHlDYWNoZVNlbGVjdG9yLFxufSBmcm9tICcuL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMgfSBmcm9tICcuL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvbixcbiAgQ2hhbmdlU3RhdGVNYXAsXG59IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcblxuLyoqXG4gKiBUaGUgc2VsZWN0b3Igb2JzZXJ2YWJsZSBmdW5jdGlvbnMgZm9yIGVudGl0eSBjb2xsZWN0aW9uIG1lbWJlcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5U2VsZWN0b3JzJDxUPiB7XG4gIC8qKiBOYW1lIG9mIHRoZSBlbnRpdHkgY29sbGVjdGlvbiBmb3IgdGhlc2Ugc2VsZWN0b3JzJCAqL1xuICByZWFkb25seSBlbnRpdHlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGNvbGxlY3Rpb24gYXMgYSB3aG9sZSAqL1xuICByZWFkb25seSBjb2xsZWN0aW9uJDogT2JzZXJ2YWJsZTxFbnRpdHlDb2xsZWN0aW9uPiB8IFN0b3JlPEVudGl0eUNvbGxlY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGNvdW50IG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgcmVhZG9ubHkgY291bnQkOiBPYnNlcnZhYmxlPG51bWJlcj4gfCBTdG9yZTxudW1iZXI+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGFsbCBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IGVudGl0aWVzJDogT2JzZXJ2YWJsZTxUW10+IHwgU3RvcmU8VFtdPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhY3Rpb25zIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkgdHlwZS4gKi9cbiAgcmVhZG9ubHkgZW50aXR5QWN0aW9ucyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgbWFwIG9mIGVudGl0eSBrZXlzIHRvIGVudGl0aWVzICovXG4gIHJlYWRvbmx5IGVudGl0eU1hcCQ6IE9ic2VydmFibGU8RGljdGlvbmFyeTxUPj4gfCBTdG9yZTxEaWN0aW9uYXJ5PFQ+PjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25zIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkgdHlwZS4gKi9cbiAgcmVhZG9ubHkgZXJyb3JzJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBmaWx0ZXIgcGF0dGVybiBhcHBsaWVkIGJ5IHRoZSBlbnRpdHkgY29sbGVjdGlvbidzIGZpbHRlciBmdW5jdGlvbiAqL1xuICByZWFkb25seSBmaWx0ZXIkOiBPYnNlcnZhYmxlPHN0cmluZz4gfCBTdG9yZTxzdHJpbmc+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbiB0aGF0IHBhc3MgdGhlIGZpbHRlciBmdW5jdGlvbiAqL1xuICByZWFkb25seSBmaWx0ZXJlZEVudGl0aWVzJDogT2JzZXJ2YWJsZTxUW10+IHwgU3RvcmU8VFtdPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUga2V5cyBvZiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24sIGluIHRoZSBjb2xsZWN0aW9uJ3MgbmF0aXZlIHNvcnQgb3JkZXIgKi9cbiAgcmVhZG9ubHkga2V5cyQ6IE9ic2VydmFibGU8c3RyaW5nW10gfCBudW1iZXJbXT4gfCBTdG9yZTxzdHJpbmdbXSB8IG51bWJlcltdPjtcblxuICAvKiogT2JzZXJ2YWJsZSB0cnVlIHdoZW4gdGhlIGNvbGxlY3Rpb24gaGFzIGJlZW4gbG9hZGVkICovXG4gIHJlYWRvbmx5IGxvYWRlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBTdG9yZTxib29sZWFuPjtcblxuICAvKiogT2JzZXJ2YWJsZSB0cnVlIHdoZW4gYSBtdWx0aS1lbnRpdHkgcXVlcnkgY29tbWFuZCBpcyBpbiBwcm9ncmVzcy4gKi9cbiAgcmVhZG9ubHkgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBTdG9yZTxib29sZWFuPjtcblxuICAvKiogQ2hhbmdlU3RhdGUgKGluY2x1ZGluZyBvcmlnaW5hbCB2YWx1ZXMpIG9mIGVudGl0aWVzIHdpdGggdW5zYXZlZCBjaGFuZ2VzICovXG4gIHJlYWRvbmx5IGNoYW5nZVN0YXRlJDpcbiAgICB8IE9ic2VydmFibGU8Q2hhbmdlU3RhdGVNYXA8VD4+XG4gICAgfCBTdG9yZTxDaGFuZ2VTdGF0ZU1hcDxUPj47XG59XG5cbi8qKiBDcmVhdGVzIG9ic2VydmFibGUgRW50aXR5U2VsZWN0b3JzJCBmb3IgZW50aXR5IGNvbGxlY3Rpb25zLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5IHtcbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIEVudGl0eUNhY2hlICovXG4gIGVudGl0eUNhY2hlJDogT2JzZXJ2YWJsZTxFbnRpdHlDYWNoZT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgRW50aXR5QWN0aW9ucyAoZS5nLiBRVUVSWV9BTExfRVJST1IpIGZvciBhbGwgZW50aXR5IHR5cGVzICovXG4gIGVudGl0eUFjdGlvbkVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uczxFbnRpdHlBY3Rpb24+LFxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX1NFTEVDVE9SX1RPS0VOKVxuICAgIHByaXZhdGUgc2VsZWN0RW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlU2VsZWN0b3JcbiAgKSB7XG4gICAgLy8gVGhpcyBzZXJ2aWNlIGFwcGxpZXMgdG8gdGhlIGNhY2hlIGluIG5ncngvc3RvcmUgbmFtZWQgYGNhY2hlTmFtZWBcbiAgICB0aGlzLmVudGl0eUNhY2hlJCA9IHRoaXMuc3RvcmUuc2VsZWN0KHRoaXMuc2VsZWN0RW50aXR5Q2FjaGUpO1xuICAgIHRoaXMuZW50aXR5QWN0aW9uRXJyb3JzJCA9IGFjdGlvbnMucGlwZShcbiAgICAgIGZpbHRlcihcbiAgICAgICAgKGVhOiBFbnRpdHlBY3Rpb24pID0+XG4gICAgICAgICAgZWEucGF5bG9hZCAmJlxuICAgICAgICAgIGVhLnBheWxvYWQuZW50aXR5T3AgJiZcbiAgICAgICAgICBlYS5wYXlsb2FkLmVudGl0eU9wLmVuZHNXaXRoKE9QX0VSUk9SKVxuICAgICAgKSxcbiAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGVudGl0eSBjb2xsZWN0aW9uJ3Mgc2VsZWN0b3JzJCBvYnNlcnZhYmxlcyBmb3IgdGhpcyBmYWN0b3J5J3Mgc3RvcmUuXG4gICAqIGBzZWxlY3RvcnMkYCBhcmUgb2JzZXJ2YWJsZSBzZWxlY3RvcnMgb2YgdGhlIGNhY2hlZCBlbnRpdHkgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSBpcyBhbHNvIHRoZSBuYW1lIG9mIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gc2VsZWN0b3JzIC0gc2VsZWN0b3IgZnVuY3Rpb25zIGZvciB0aGlzIGNvbGxlY3Rpb24uXG4gICAqKi9cbiAgY3JlYXRlPFQsIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBzZWxlY3RvcnM6IEVudGl0eVNlbGVjdG9yczxUPlxuICApOiBTJCB7XG4gICAgY29uc3Qgc2VsZWN0b3JzJDogeyBbcHJvcDogc3RyaW5nXTogYW55IH0gPSB7XG4gICAgICBlbnRpdHlOYW1lLFxuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhzZWxlY3RvcnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdzZWxlY3QnKSkge1xuICAgICAgICAvLyBzdHJpcCAnc2VsZWN0JyBwcmVmaXggZnJvbSB0aGUgc2VsZWN0b3IgZm4gbmFtZSBhbmQgYXBwZW5kIGAkYFxuICAgICAgICAvLyBFeDogJ3NlbGVjdEVudGl0aWVzJyA9PiAnZW50aXRpZXMkJ1xuICAgICAgICBjb25zdCBuYW1lJCA9IG5hbWVbNl0udG9Mb3dlckNhc2UoKSArIG5hbWUuc3Vic3RyKDcpICsgJyQnO1xuICAgICAgICBzZWxlY3RvcnMkW25hbWUkXSA9IHRoaXMuc3RvcmUuc2VsZWN0KCg8YW55PnNlbGVjdG9ycylbbmFtZV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGVjdG9ycyQuZW50aXR5QWN0aW9ucyQgPSB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoZW50aXR5TmFtZSkpO1xuICAgIHNlbGVjdG9ycyQuZXJyb3JzJCA9IHRoaXMuZW50aXR5QWN0aW9uRXJyb3JzJC5waXBlKFxuICAgICAgb2ZFbnRpdHlUeXBlKGVudGl0eU5hbWUpXG4gICAgKTtcbiAgICByZXR1cm4gc2VsZWN0b3JzJCBhcyBTJDtcbiAgfVxufVxuIl19