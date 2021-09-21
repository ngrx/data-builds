import { Inject, Injectable, Optional } from '@angular/core';
import { compose } from '@ngrx/store';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import { EntityCollectionReducerFactory, } from './entity-collection-reducer';
/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
export class EntityCollectionReducerRegistry {
    constructor(entityCollectionReducerFactory, entityCollectionMetaReducers) {
        this.entityCollectionReducerFactory = entityCollectionReducerFactory;
        this.entityCollectionReducers = {};
        // eslint-disable-next-line prefer-spread
        this.entityCollectionMetaReducer = compose.apply(null, entityCollectionMetaReducers || []);
    }
    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @param entityName Name of the entity type for this reducer
     */
    getOrCreateReducer(entityName) {
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
     * @param entityName - the name of the entity type
     * @param reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     */
    registerReducer(entityName, reducer) {
        reducer = this.entityCollectionMetaReducer(reducer);
        return (this.entityCollectionReducers[entityName.trim()] = reducer);
    }
    /**
     * Register a batch of EntityCollectionReducers.
     * @param reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     */
    registerReducers(reducers) {
        const keys = reducers ? Object.keys(reducers) : [];
        keys.forEach((key) => this.registerReducer(key, reducers[key]));
    }
}
/** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
EntityCollectionReducerRegistry.decorators = [
    { type: Injectable }
];
/**
 * @type {function(): !Array<(null|{
 *   type: ?,
 *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
 * })>}
 * @nocollapse
 */
EntityCollectionReducerRegistry.ctorParameters = () => [
    { type: EntityCollectionReducerFactory },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_COLLECTION_META_REDUCERS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLE9BQU8sRUFBZSxNQUFNLGFBQWEsQ0FBQztBQUluRCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUQsT0FBTyxFQUVMLDhCQUE4QixHQUMvQixNQUFNLDZCQUE2QixDQUFDO0FBT3JDOzs7R0FHRztBQUVILE1BQU0sT0FBTywrQkFBK0I7SUFPMUMsWUFDVSw4QkFBOEQsRUFHdEUsNEJBQTRFO1FBSHBFLG1DQUE4QixHQUE5Qiw4QkFBOEIsQ0FBZ0M7UUFQOUQsNkJBQXdCLEdBQTZCLEVBQUUsQ0FBQztRQVloRSx5Q0FBeUM7UUFDekMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQzlDLElBQUksRUFDSiw0QkFBNEIsSUFBSSxFQUFFLENBQzVCLENBQUM7SUFDWCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsa0JBQWtCLENBQUksVUFBa0I7UUFDdEMsSUFBSSxPQUFPLEdBQStCLElBQUksQ0FBQyx3QkFBd0IsQ0FDckUsVUFBVSxDQUNYLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQUksVUFBVSxDQUFDLENBQUM7WUFDcEUsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUksVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDckQ7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxlQUFlLENBQ2IsVUFBa0IsRUFDbEIsT0FBbUM7UUFFbkMsT0FBTyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFjLENBQUMsQ0FBQztRQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxnQkFBZ0IsQ0FBQyxRQUFrQztRQUNqRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Ozs7WUFwRUYsVUFBVTs7Ozs7Ozs7OztZQVpULDhCQUE4Qjt3Q0FzQjNCLFFBQVEsWUFDUixNQUFNLFNBQUMsK0JBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tcG9zZSwgTWV0YVJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXIsXG4gIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSxcbn0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyJztcblxuLyoqIEEgaGFzaCBvZiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzIHtcbiAgW2VudGl0eTogc3RyaW5nXTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8YW55Pjtcbn1cblxuLyoqXG4gKiBSZWdpc3RyeSBvZiBlbnRpdHkgdHlwZXMgYW5kIHRoZWlyIHByZXZpb3VzbHktY29uc3RydWN0ZWQgcmVkdWNlcnMuXG4gKiBDYW4gY3JlYXRlIGEgbmV3IENvbGxlY3Rpb25SZWR1Y2VyLCB3aGljaCBpdCByZWdpc3RlcnMgZm9yIHN1YnNlcXVlbnQgdXNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB7XG4gIHByb3RlY3RlZCBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VycyA9IHt9O1xuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcjogTWV0YVJlZHVjZXI8XG4gICAgRW50aXR5Q29sbGVjdGlvbixcbiAgICBFbnRpdHlBY3Rpb25cbiAgPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTKVxuICAgIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnM/OiBNZXRhUmVkdWNlcjxFbnRpdHlDb2xsZWN0aW9uLCBFbnRpdHlBY3Rpb24+W11cbiAgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1zcHJlYWRcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlciA9IGNvbXBvc2UuYXBwbHkoXG4gICAgICBudWxsLFxuICAgICAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VycyB8fCBbXVxuICAgICkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcmVnaXN0ZXJlZCBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiBmb3IgdGhpcyBlbnRpdHkgdHlwZSBvciBjcmVhdGUgb25lIGFuZCByZWdpc3RlciBpdC5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUgTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgcmVkdWNlclxuICAgKi9cbiAgZ2V0T3JDcmVhdGVSZWR1Y2VyPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHtcbiAgICBsZXQgcmVkdWNlcjogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vyc1tcbiAgICAgIGVudGl0eU5hbWVcbiAgICBdO1xuXG4gICAgaWYgKCFyZWR1Y2VyKSB7XG4gICAgICByZWR1Y2VyID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnkuY3JlYXRlPFQ+KGVudGl0eU5hbWUpO1xuICAgICAgcmVkdWNlciA9IHRoaXMucmVnaXN0ZXJSZWR1Y2VyPFQ+KGVudGl0eU5hbWUsIHJlZHVjZXIpO1xuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnNbZW50aXR5TmFtZV0gPSByZWR1Y2VyO1xuICAgIH1cbiAgICByZXR1cm4gcmVkdWNlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlciBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIHJlZHVjZXIgLSByZWR1Y2VyIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcignSGVybycsIG15SGVyb1JlZHVjZXIpO1xuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcignVmlsbGFpbicsIG15VmlsbGFpblJlZHVjZXIpO1xuICAgKi9cbiAgcmVnaXN0ZXJSZWR1Y2VyPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByZWR1Y2VyOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VyKHJlZHVjZXIgYXMgYW55KTtcbiAgICByZXR1cm4gKHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzW2VudGl0eU5hbWUudHJpbSgpXSA9IHJlZHVjZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzLlxuICAgKiBAcGFyYW0gcmVkdWNlcnMgLSByZWR1Y2VycyB0byBtZXJnZSBpbnRvIGV4aXN0aW5nIHJlZHVjZXJzXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcnMoe1xuICAgKiAgICAgSGVybzogbXlIZXJvUmVkdWNlcixcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpblJlZHVjZXJcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyUmVkdWNlcnMocmVkdWNlcnM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vycykge1xuICAgIGNvbnN0IGtleXMgPSByZWR1Y2VycyA/IE9iamVjdC5rZXlzKHJlZHVjZXJzKSA6IFtdO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnJlZ2lzdGVyUmVkdWNlcihrZXksIHJlZHVjZXJzW2tleV0pKTtcbiAgfVxufVxuIl19