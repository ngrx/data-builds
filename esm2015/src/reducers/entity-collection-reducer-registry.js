/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        key => this.registerReducer(key, reducers[key])));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBaUIsT0FBTyxFQUFlLE1BQU0sYUFBYSxDQUFDO0FBSWxFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM5RCxPQUFPLEVBRUwsOEJBQThCLEdBQy9CLE1BQU0sNkJBQTZCLENBQUM7Ozs7O0FBR3JDLDhDQUVDOzs7OztBQU9ELE1BQU0sT0FBTywrQkFBK0I7Ozs7O0lBTzFDLFlBQ1UsOEJBQThELEVBR3RFLDRCQUE0RTtRQUhwRSxtQ0FBOEIsR0FBOUIsOEJBQThCLENBQWdDO1FBUDlELDZCQUF3QixHQUE2QixFQUFFLENBQUM7UUFZaEUsSUFBSSxDQUFDLDJCQUEyQixHQUFHLG1CQUFBLE9BQU8sQ0FBQyxLQUFLLENBQzlDLElBQUksRUFDSiw0QkFBNEIsSUFBSSxFQUFFLENBQ25DLEVBQU8sQ0FBQztJQUNYLENBQUM7Ozs7Ozs7SUFNRCxrQkFBa0IsQ0FBSSxVQUFrQjs7WUFDbEMsT0FBTyxHQUErQixJQUFJLENBQUMsd0JBQXdCLENBQ3JFLFVBQVUsQ0FDWDtRQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBSSxVQUFVLENBQUMsQ0FBQztZQUNwRSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBSSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNyRDtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Ozs7Ozs7Ozs7OztJQVdELGVBQWUsQ0FDYixVQUFrQixFQUNsQixPQUFtQztRQUVuQyxPQUFPLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLG1CQUFBLE9BQU8sRUFBTyxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDOzs7Ozs7Ozs7Ozs7SUFZRCxnQkFBZ0IsQ0FBQyxRQUFrQzs7Y0FDM0MsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsRCxJQUFJLENBQUMsT0FBTzs7OztRQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUNoRSxDQUFDOzs7WUFuRUYsVUFBVTs7OztZQVpULDhCQUE4Qjt3Q0FzQjNCLFFBQVEsWUFDUixNQUFNLFNBQUMsK0JBQStCOzs7Ozs7O0lBVHpDLG1FQUFrRTs7Ozs7SUFDbEUsc0VBR0U7Ozs7O0lBR0EseUVBQXNFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uUmVkdWNlciwgY29tcG9zZSwgTWV0YVJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXIsXG4gIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSxcbn0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyJztcblxuLyoqIEEgaGFzaCBvZiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzIHtcbiAgW2VudGl0eTogc3RyaW5nXTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8YW55Pjtcbn1cblxuLyoqXG4gKiBSZWdpc3RyeSBvZiBlbnRpdHkgdHlwZXMgYW5kIHRoZWlyIHByZXZpb3VzbHktY29uc3RydWN0ZWQgcmVkdWNlcnMuXG4gKiBDYW4gY3JlYXRlIGEgbmV3IENvbGxlY3Rpb25SZWR1Y2VyLCB3aGljaCBpdCByZWdpc3RlcnMgZm9yIHN1YnNlcXVlbnQgdXNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB7XG4gIHByb3RlY3RlZCBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VycyA9IHt9O1xuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcjogTWV0YVJlZHVjZXI8XG4gICAgRW50aXR5Q29sbGVjdGlvbixcbiAgICBFbnRpdHlBY3Rpb25cbiAgPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTKVxuICAgIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnM/OiBNZXRhUmVkdWNlcjxFbnRpdHlDb2xsZWN0aW9uLCBFbnRpdHlBY3Rpb24+W11cbiAgKSB7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXIgPSBjb21wb3NlLmFwcGx5KFxuICAgICAgbnVsbCxcbiAgICAgIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnMgfHwgW11cbiAgICApIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlZ2lzdGVyZWQgRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gZm9yIHRoaXMgZW50aXR5IHR5cGUgb3IgY3JlYXRlIG9uZSBhbmQgcmVnaXN0ZXIgaXQuXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIHJlZHVjZXJcbiAgICovXG4gIGdldE9yQ3JlYXRlUmVkdWNlcjxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgbGV0IHJlZHVjZXI6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+ID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnNbXG4gICAgICBlbnRpdHlOYW1lXG4gICAgXTtcblxuICAgIGlmICghcmVkdWNlcikge1xuICAgICAgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LmNyZWF0ZTxUPihlbnRpdHlOYW1lKTtcbiAgICAgIHJlZHVjZXIgPSB0aGlzLnJlZ2lzdGVyUmVkdWNlcjxUPihlbnRpdHlOYW1lLCByZWR1Y2VyKTtcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzW2VudGl0eU5hbWVdID0gcmVkdWNlcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlZHVjZXI7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSByZWR1Y2VyIC0gcmVkdWNlciBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlclJlZHVjZXIoJ0hlcm8nLCBteUhlcm9SZWR1Y2VyKTtcbiAgICogICByZWdpc3RlclJlZHVjZXIoJ1ZpbGxhaW4nLCBteVZpbGxhaW5SZWR1Y2VyKTtcbiAgICovXG4gIHJlZ2lzdGVyUmVkdWNlcjxUPihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcmVkdWNlcjogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4ge1xuICAgIHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcihyZWR1Y2VyIGFzIGFueSk7XG4gICAgcmV0dXJuICh0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vyc1tlbnRpdHlOYW1lLnRyaW0oKV0gPSByZWR1Y2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGJhdGNoIG9mIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vycy5cbiAgICogQHBhcmFtIHJlZHVjZXJzIC0gcmVkdWNlcnMgdG8gbWVyZ2UgaW50byBleGlzdGluZyByZWR1Y2Vyc1xuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlclJlZHVjZXJzKHtcbiAgICogICAgIEhlcm86IG15SGVyb1JlZHVjZXIsXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5SZWR1Y2VyXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3RlclJlZHVjZXJzKHJlZHVjZXJzOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMpIHtcbiAgICBjb25zdCBrZXlzID0gcmVkdWNlcnMgPyBPYmplY3Qua2V5cyhyZWR1Y2VycykgOiBbXTtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHRoaXMucmVnaXN0ZXJSZWR1Y2VyKGtleSwgcmVkdWNlcnNba2V5XSkpO1xuICB9XG59XG4iXX0=