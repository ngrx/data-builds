/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-collection-reducer-registry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { compose } from '@ngrx/store';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import { EntityCollectionReducerFactory, } from './entity-collection-reducer';
/**
 * A hash of EntityCollectionReducers
 * @record
 */
export function EntityCollectionReducers() { }
/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
export class EntityCollectionReducerRegistry {
    /**
     * @param {?} entityCollectionReducerFactory
     * @param {?=} entityCollectionMetaReducers
     */
    constructor(entityCollectionReducerFactory, entityCollectionMetaReducers) {
        this.entityCollectionReducerFactory = entityCollectionReducerFactory;
        this.entityCollectionReducers = {};
        this.entityCollectionMetaReducer = (/** @type {?} */ (compose.apply(null, entityCollectionMetaReducers || [])));
    }
    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @template T
     * @param {?} entityName Name of the entity type for this reducer
     * @return {?}
     */
    getOrCreateReducer(entityName) {
        /** @type {?} */
        let reducer = this.entityCollectionReducers[entityName];
        if (!reducer) {
            reducer = this.entityCollectionReducerFactory.create(entityName);
            reducer = this.registerReducer(entityName, reducer);
            this.entityCollectionReducers[entityName] = reducer;
        }
        return reducer;
    }
    /**
     * Register an EntityCollectionReducer for an entity type
     * @template T
     * @param {?} entityName - the name of the entity type
     * @param {?} reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     * @return {?}
     */
    registerReducer(entityName, reducer) {
        reducer = this.entityCollectionMetaReducer((/** @type {?} */ (reducer)));
        return (this.entityCollectionReducers[entityName.trim()] = reducer);
    }
    /**
     * Register a batch of EntityCollectionReducers.
     * @param {?} reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     * @return {?}
     */
    registerReducers(reducers) {
        /** @type {?} */
        const keys = reducers ? Object.keys(reducers) : [];
        keys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        (key) => this.registerReducer(key, reducers[key])));
    }
}
EntityCollectionReducerRegistry.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionReducerRegistry.ctorParameters = () => [
    { type: EntityCollectionReducerFactory },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_COLLECTION_META_REDUCERS,] }] }
];
if (false) {
    /**
     * @type {?}
     * @protected
     */
    EntityCollectionReducerRegistry.prototype.entityCollectionReducers;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerRegistry.prototype.entityCollectionMetaReducer;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerRegistry.prototype.entityCollectionReducerFactory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsT0FBTyxFQUFlLE1BQU0sYUFBYSxDQUFDO0FBSW5ELE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM5RCxPQUFPLEVBRUwsOEJBQThCLEdBQy9CLE1BQU0sNkJBQTZCLENBQUM7Ozs7O0FBR3JDLDhDQUVDOzs7OztBQU9ELE1BQU0sT0FBTywrQkFBK0I7Ozs7O0lBTzFDLFlBQ1UsOEJBQThELEVBR3RFLDRCQUE0RTtRQUhwRSxtQ0FBOEIsR0FBOUIsOEJBQThCLENBQWdDO1FBUDlELDZCQUF3QixHQUE2QixFQUFFLENBQUM7UUFZaEUsSUFBSSxDQUFDLDJCQUEyQixHQUFHLG1CQUFBLE9BQU8sQ0FBQyxLQUFLLENBQzlDLElBQUksRUFDSiw0QkFBNEIsSUFBSSxFQUFFLENBQ25DLEVBQU8sQ0FBQztJQUNYLENBQUM7Ozs7Ozs7SUFNRCxrQkFBa0IsQ0FBSSxVQUFrQjs7WUFDbEMsT0FBTyxHQUErQixJQUFJLENBQUMsd0JBQXdCLENBQ3JFLFVBQVUsQ0FDWDtRQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBSSxVQUFVLENBQUMsQ0FBQztZQUNwRSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBSSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNyRDtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Ozs7Ozs7Ozs7OztJQVdELGVBQWUsQ0FDYixVQUFrQixFQUNsQixPQUFtQztRQUVuQyxPQUFPLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLG1CQUFBLE9BQU8sRUFBTyxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDOzs7Ozs7Ozs7Ozs7SUFZRCxnQkFBZ0IsQ0FBQyxRQUFrQzs7Y0FDM0MsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsRCxJQUFJLENBQUMsT0FBTzs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQ2xFLENBQUM7OztZQW5FRixVQUFVOzs7O1lBWlQsOEJBQThCO3dDQXNCM0IsUUFBUSxZQUNSLE1BQU0sU0FBQywrQkFBK0I7Ozs7Ozs7SUFUekMsbUVBQWtFOzs7OztJQUNsRSxzRUFHRTs7Ozs7SUFHQSx5RUFBc0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb21wb3NlLCBNZXRhUmVkdWNlciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcixcbiAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxufSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXInO1xuXG4vKiogQSBoYXNoIG9mIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VycyAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMge1xuICBbZW50aXR5OiBzdHJpbmddOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxhbnk+O1xufVxuXG4vKipcbiAqIFJlZ2lzdHJ5IG9mIGVudGl0eSB0eXBlcyBhbmQgdGhlaXIgcHJldmlvdXNseS1jb25zdHJ1Y3RlZCByZWR1Y2Vycy5cbiAqIENhbiBjcmVhdGUgYSBuZXcgQ29sbGVjdGlvblJlZHVjZXIsIHdoaWNoIGl0IHJlZ2lzdGVycyBmb3Igc3Vic2VxdWVudCB1c2UuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IHtcbiAgcHJvdGVjdGVkIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyczogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzID0ge307XG4gIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VyOiBNZXRhUmVkdWNlcjxcbiAgICBFbnRpdHlDb2xsZWN0aW9uLFxuICAgIEVudGl0eUFjdGlvblxuICA+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMpXG4gICAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vycz86IE1ldGFSZWR1Y2VyPEVudGl0eUNvbGxlY3Rpb24sIEVudGl0eUFjdGlvbj5bXVxuICApIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlciA9IGNvbXBvc2UuYXBwbHkoXG4gICAgICBudWxsLFxuICAgICAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VycyB8fCBbXVxuICAgICkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcmVnaXN0ZXJlZCBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiBmb3IgdGhpcyBlbnRpdHkgdHlwZSBvciBjcmVhdGUgb25lIGFuZCByZWdpc3RlciBpdC5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUgTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgcmVkdWNlclxuICAgKi9cbiAgZ2V0T3JDcmVhdGVSZWR1Y2VyPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHtcbiAgICBsZXQgcmVkdWNlcjogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vyc1tcbiAgICAgIGVudGl0eU5hbWVcbiAgICBdO1xuXG4gICAgaWYgKCFyZWR1Y2VyKSB7XG4gICAgICByZWR1Y2VyID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnkuY3JlYXRlPFQ+KGVudGl0eU5hbWUpO1xuICAgICAgcmVkdWNlciA9IHRoaXMucmVnaXN0ZXJSZWR1Y2VyPFQ+KGVudGl0eU5hbWUsIHJlZHVjZXIpO1xuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnNbZW50aXR5TmFtZV0gPSByZWR1Y2VyO1xuICAgIH1cbiAgICByZXR1cm4gcmVkdWNlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlciBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIHJlZHVjZXIgLSByZWR1Y2VyIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcignSGVybycsIG15SGVyb1JlZHVjZXIpO1xuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcignVmlsbGFpbicsIG15VmlsbGFpblJlZHVjZXIpO1xuICAgKi9cbiAgcmVnaXN0ZXJSZWR1Y2VyPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByZWR1Y2VyOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VyKHJlZHVjZXIgYXMgYW55KTtcbiAgICByZXR1cm4gKHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzW2VudGl0eU5hbWUudHJpbSgpXSA9IHJlZHVjZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzLlxuICAgKiBAcGFyYW0gcmVkdWNlcnMgLSByZWR1Y2VycyB0byBtZXJnZSBpbnRvIGV4aXN0aW5nIHJlZHVjZXJzXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcnMoe1xuICAgKiAgICAgSGVybzogbXlIZXJvUmVkdWNlcixcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpblJlZHVjZXJcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyUmVkdWNlcnMocmVkdWNlcnM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vycykge1xuICAgIGNvbnN0IGtleXMgPSByZWR1Y2VycyA/IE9iamVjdC5rZXlzKHJlZHVjZXJzKSA6IFtdO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnJlZ2lzdGVyUmVkdWNlcihrZXksIHJlZHVjZXJzW2tleV0pKTtcbiAgfVxufVxuIl19