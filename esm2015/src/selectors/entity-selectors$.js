/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { Store, } from '@ngrx/store';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycyQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUlMLEtBQUssR0FDTixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXhDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHckQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNsRSxPQUFPLEVBQ0wsMkJBQTJCLEdBRTVCLE1BQU0seUJBQXlCLENBQUM7Ozs7OztBQWFqQyxzQ0F5Q0M7Ozs7OztJQXZDQyxzQ0FBNEI7Ozs7O0lBRzVCLHVDQUE2RTs7Ozs7SUFHN0Usa0NBQW9EOzs7OztJQUdwRCxxQ0FBaUQ7Ozs7O0lBR2pELDBDQUFrRDs7Ozs7SUFHbEQsc0NBQXNFOzs7OztJQUd0RSxtQ0FBMkM7Ozs7O0lBRzNDLG1DQUFxRDs7Ozs7SUFHckQsNkNBQXlEOzs7OztJQUd6RCxpQ0FBNkU7Ozs7O0lBRzdFLG1DQUF1RDs7Ozs7SUFHdkQsb0NBQXdEOzs7OztJQUd4RCx3Q0FFNkI7Ozs7O0FBSy9CLE1BQU0sT0FBTyx1QkFBdUI7Ozs7OztJQU9sQyxZQUNVLEtBQWlCLEVBQ2pCLE9BQThCLEVBRTlCLGlCQUFzQztRQUh0QyxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBRTlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBcUI7UUFFOUMsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQ3JDLE1BQU07Ozs7UUFDSixDQUFDLEVBQWdCLEVBQUUsRUFBRSxDQUNuQixFQUFFLENBQUMsT0FBTztZQUNWLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUTtZQUNuQixFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQ3pDLEVBQ0QsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUNmLENBQUM7SUFDSixDQUFDOzs7Ozs7Ozs7O0lBUUQsTUFBTSxDQUNKLFVBQWtCLEVBQ2xCLFNBQTZCOztjQUV2QixVQUFVLEdBQTRCO1lBQzFDLFVBQVU7U0FDWDtRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTzs7OztRQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTs7OztzQkFHdkIsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7Z0JBQzFELFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLG1CQUFLLFNBQVMsRUFBQSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMvRDtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN4RSxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ2hELFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FDekIsQ0FBQztRQUNGLE9BQU8sbUJBQUEsVUFBVSxFQUFNLENBQUM7SUFDMUIsQ0FBQzs7O1lBdERGLFVBQVU7Ozs7WUF2RVQsS0FBSztZQUVFLE9BQU87NENBZ0ZYLE1BQU0sU0FBQywyQkFBMkI7Ozs7Ozs7SUFSckMsK0NBQXNDOzs7OztJQUd0QyxzREFBOEM7Ozs7O0lBRzVDLHdDQUF5Qjs7Ozs7SUFDekIsMENBQXNDOzs7OztJQUN0QyxvREFDOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgY3JlYXRlRmVhdHVyZVNlbGVjdG9yLFxuICBjcmVhdGVTZWxlY3RvcixcbiAgU2VsZWN0b3IsXG4gIFN0b3JlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBY3Rpb25zIH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBzaGFyZVJlcGxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IE9QX0VSUk9SIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgb2ZFbnRpdHlUeXBlIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4sXG4gIEVudGl0eUNhY2hlU2VsZWN0b3IsXG59IGZyb20gJy4vZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyB9IGZyb20gJy4vZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uLFxuICBDaGFuZ2VTdGF0ZU1hcCxcbn0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9yc0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1zZWxlY3RvcnMnO1xuXG4vKipcbiAqIFRoZSBzZWxlY3RvciBvYnNlcnZhYmxlIGZ1bmN0aW9ucyBmb3IgZW50aXR5IGNvbGxlY3Rpb24gbWVtYmVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlTZWxlY3RvcnMkPFQ+IHtcbiAgLyoqIE5hbWUgb2YgdGhlIGVudGl0eSBjb2xsZWN0aW9uIGZvciB0aGVzZSBzZWxlY3RvcnMkICovXG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgY29sbGVjdGlvbiBhcyBhIHdob2xlICovXG4gIHJlYWRvbmx5IGNvbGxlY3Rpb24kOiBPYnNlcnZhYmxlPEVudGl0eUNvbGxlY3Rpb24+IHwgU3RvcmU8RW50aXR5Q29sbGVjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgY291bnQgb2YgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBjb3VudCQ6IE9ic2VydmFibGU8bnVtYmVyPiB8IFN0b3JlPG51bWJlcj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgYWxsIGVudGl0aWVzIGluIHRoZSBjYWNoZWQgY29sbGVjdGlvbi4gKi9cbiAgcmVhZG9ubHkgZW50aXRpZXMkOiBPYnNlcnZhYmxlPFRbXT4gfCBTdG9yZTxUW10+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGFjdGlvbnMgcmVsYXRlZCB0byB0aGlzIGVudGl0eSB0eXBlLiAqL1xuICByZWFkb25seSBlbnRpdHlBY3Rpb25zJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBtYXAgb2YgZW50aXR5IGtleXMgdG8gZW50aXRpZXMgKi9cbiAgcmVhZG9ubHkgZW50aXR5TWFwJDogT2JzZXJ2YWJsZTxEaWN0aW9uYXJ5PFQ+PiB8IFN0b3JlPERpY3Rpb25hcnk8VD4+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvbnMgcmVsYXRlZCB0byB0aGlzIGVudGl0eSB0eXBlLiAqL1xuICByZWFkb25seSBlcnJvcnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGZpbHRlciBwYXR0ZXJuIGFwcGxpZWQgYnkgdGhlIGVudGl0eSBjb2xsZWN0aW9uJ3MgZmlsdGVyIGZ1bmN0aW9uICovXG4gIHJlYWRvbmx5IGZpbHRlciQ6IE9ic2VydmFibGU8c3RyaW5nPiB8IFN0b3JlPHN0cmluZz47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uIHRoYXQgcGFzcyB0aGUgZmlsdGVyIGZ1bmN0aW9uICovXG4gIHJlYWRvbmx5IGZpbHRlcmVkRW50aXRpZXMkOiBPYnNlcnZhYmxlPFRbXT4gfCBTdG9yZTxUW10+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBrZXlzIG9mIHRoZSBjYWNoZWQgY29sbGVjdGlvbiwgaW4gdGhlIGNvbGxlY3Rpb24ncyBuYXRpdmUgc29ydCBvcmRlciAqL1xuICByZWFkb25seSBrZXlzJDogT2JzZXJ2YWJsZTxzdHJpbmdbXSB8IG51bWJlcltdPiB8IFN0b3JlPHN0cmluZ1tdIHwgbnVtYmVyW10+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIHRydWUgd2hlbiB0aGUgY29sbGVjdGlvbiBoYXMgYmVlbiBsb2FkZWQgKi9cbiAgcmVhZG9ubHkgbG9hZGVkJDogT2JzZXJ2YWJsZTxib29sZWFuPiB8IFN0b3JlPGJvb2xlYW4+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIHRydWUgd2hlbiBhIG11bHRpLWVudGl0eSBxdWVyeSBjb21tYW5kIGlzIGluIHByb2dyZXNzLiAqL1xuICByZWFkb25seSBsb2FkaW5nJDogT2JzZXJ2YWJsZTxib29sZWFuPiB8IFN0b3JlPGJvb2xlYW4+O1xuXG4gIC8qKiBDaGFuZ2VTdGF0ZSAoaW5jbHVkaW5nIG9yaWdpbmFsIHZhbHVlcykgb2YgZW50aXRpZXMgd2l0aCB1bnNhdmVkIGNoYW5nZXMgKi9cbiAgcmVhZG9ubHkgY2hhbmdlU3RhdGUkOlxuICAgIHwgT2JzZXJ2YWJsZTxDaGFuZ2VTdGF0ZU1hcDxUPj5cbiAgICB8IFN0b3JlPENoYW5nZVN0YXRlTWFwPFQ+Pjtcbn1cblxuLyoqIENyZWF0ZXMgb2JzZXJ2YWJsZSBFbnRpdHlTZWxlY3RvcnMkIGZvciBlbnRpdHkgY29sbGVjdGlvbnMuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5U2VsZWN0b3JzJEZhY3Rvcnkge1xuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgZW50aXR5Q2FjaGUkOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlcnJvciBFbnRpdHlBY3Rpb25zIChlLmcuIFFVRVJZX0FMTF9FUlJPUikgZm9yIGFsbCBlbnRpdHkgdHlwZXMgKi9cbiAgZW50aXR5QWN0aW9uRXJyb3JzJDogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPGFueT4sXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zPEVudGl0eUFjdGlvbj4sXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfU0VMRUNUT1JfVE9LRU4pXG4gICAgcHJpdmF0ZSBzZWxlY3RFbnRpdHlDYWNoZTogRW50aXR5Q2FjaGVTZWxlY3RvclxuICApIHtcbiAgICAvLyBUaGlzIHNlcnZpY2UgYXBwbGllcyB0byB0aGUgY2FjaGUgaW4gbmdyeC9zdG9yZSBuYW1lZCBgY2FjaGVOYW1lYFxuICAgIHRoaXMuZW50aXR5Q2FjaGUkID0gdGhpcy5zdG9yZS5zZWxlY3QodGhpcy5zZWxlY3RFbnRpdHlDYWNoZSk7XG4gICAgdGhpcy5lbnRpdHlBY3Rpb25FcnJvcnMkID0gYWN0aW9ucy5waXBlKFxuICAgICAgZmlsdGVyKFxuICAgICAgICAoZWE6IEVudGl0eUFjdGlvbikgPT5cbiAgICAgICAgICBlYS5wYXlsb2FkICYmXG4gICAgICAgICAgZWEucGF5bG9hZC5lbnRpdHlPcCAmJlxuICAgICAgICAgIGVhLnBheWxvYWQuZW50aXR5T3AuZW5kc1dpdGgoT1BfRVJST1IpXG4gICAgICApLFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gZW50aXR5IGNvbGxlY3Rpb24ncyBzZWxlY3RvcnMkIG9ic2VydmFibGVzIGZvciB0aGlzIGZhY3RvcnkncyBzdG9yZS5cbiAgICogYHNlbGVjdG9ycyRgIGFyZSBvYnNlcnZhYmxlIHNlbGVjdG9ycyBvZiB0aGUgY2FjaGVkIGVudGl0eSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIGlzIGFsc28gdGhlIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBzZWxlY3RvcnMgLSBzZWxlY3RvciBmdW5jdGlvbnMgZm9yIHRoaXMgY29sbGVjdGlvbi5cbiAgICoqL1xuICBjcmVhdGU8VCwgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHNlbGVjdG9yczogRW50aXR5U2VsZWN0b3JzPFQ+XG4gICk6IFMkIHtcbiAgICBjb25zdCBzZWxlY3RvcnMkOiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSA9IHtcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKHNlbGVjdG9ycykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ3NlbGVjdCcpKSB7XG4gICAgICAgIC8vIHN0cmlwICdzZWxlY3QnIHByZWZpeCBmcm9tIHRoZSBzZWxlY3RvciBmbiBuYW1lIGFuZCBhcHBlbmQgYCRgXG4gICAgICAgIC8vIEV4OiAnc2VsZWN0RW50aXRpZXMnID0+ICdlbnRpdGllcyQnXG4gICAgICAgIGNvbnN0IG5hbWUkID0gbmFtZVs2XS50b0xvd2VyQ2FzZSgpICsgbmFtZS5zdWJzdHIoNykgKyAnJCc7XG4gICAgICAgIHNlbGVjdG9ycyRbbmFtZSRdID0gdGhpcy5zdG9yZS5zZWxlY3QoKDxhbnk+c2VsZWN0b3JzKVtuYW1lXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc2VsZWN0b3JzJC5lbnRpdHlBY3Rpb25zJCA9IHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZShlbnRpdHlOYW1lKSk7XG4gICAgc2VsZWN0b3JzJC5lcnJvcnMkID0gdGhpcy5lbnRpdHlBY3Rpb25FcnJvcnMkLnBpcGUoXG4gICAgICBvZkVudGl0eVR5cGUoZW50aXR5TmFtZSlcbiAgICApO1xuICAgIHJldHVybiBzZWxlY3RvcnMkIGFzIFMkO1xuICB9XG59XG4iXX0=