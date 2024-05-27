import { Inject, Injectable, Optional } from '@angular/core';
import { compose } from '@ngrx/store';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-reducer";
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, deps: [{ token: i1.EntityCollectionReducerFactory }, { token: ENTITY_COLLECTION_META_REDUCERS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: EntityCollectionReducerRegistry }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionReducerFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_COLLECTION_META_REDUCERS]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLE9BQU8sRUFBZSxNQUFNLGFBQWEsQ0FBQztBQUluRCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQVc5RDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sK0JBQStCO0lBTzFDLFlBQ1UsOEJBQThELEVBR3RFLDRCQUE0RTtRQUhwRSxtQ0FBOEIsR0FBOUIsOEJBQThCLENBQWdDO1FBUDlELDZCQUF3QixHQUE2QixFQUFFLENBQUM7UUFZaEUseUNBQXlDO1FBQ3pDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUM5QyxJQUFJLEVBQ0osNEJBQTRCLElBQUksRUFBRSxDQUM1QixDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtCQUFrQixDQUFJLFVBQWtCO1FBQ3RDLElBQUksT0FBTyxHQUNULElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEdBQUcsSUFBSSxDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBSSxVQUFVLENBQUMsQ0FBQztZQUNwRSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBSSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUN0RCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsZUFBZSxDQUNiLFVBQWtCLEVBQ2xCLE9BQW1DO1FBRW5DLE9BQU8sR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsT0FBYyxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsZ0JBQWdCLENBQUMsUUFBa0M7UUFDakQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO2lJQWxFVSwrQkFBK0IsZ0VBVWhDLCtCQUErQjtxSUFWOUIsK0JBQStCOzsyRkFBL0IsK0JBQStCO2tCQUQzQyxVQUFVOzswQkFVTixRQUFROzswQkFDUixNQUFNOzJCQUFDLCtCQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbXBvc2UsIE1ldGFSZWR1Y2VyIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyLFxuICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnksXG59IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlcic7XG5cbi8qKiBBIGhhc2ggb2YgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VycyB7XG4gIFtlbnRpdHk6IHN0cmluZ106IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPGFueT47XG59XG5cbi8qKlxuICogUmVnaXN0cnkgb2YgZW50aXR5IHR5cGVzIGFuZCB0aGVpciBwcmV2aW91c2x5LWNvbnN0cnVjdGVkIHJlZHVjZXJzLlxuICogQ2FuIGNyZWF0ZSBhIG5ldyBDb2xsZWN0aW9uUmVkdWNlciwgd2hpY2ggaXQgcmVnaXN0ZXJzIGZvciBzdWJzZXF1ZW50IHVzZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkge1xuICBwcm90ZWN0ZWQgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMgPSB7fTtcbiAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXI6IE1ldGFSZWR1Y2VyPFxuICAgIEVudGl0eUNvbGxlY3Rpb24sXG4gICAgRW50aXR5QWN0aW9uXG4gID47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUylcbiAgICBlbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzPzogTWV0YVJlZHVjZXI8RW50aXR5Q29sbGVjdGlvbiwgRW50aXR5QWN0aW9uPltdXG4gICkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItc3ByZWFkXG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXIgPSBjb21wb3NlLmFwcGx5KFxuICAgICAgbnVsbCxcbiAgICAgIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnMgfHwgW11cbiAgICApIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlZ2lzdGVyZWQgRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gZm9yIHRoaXMgZW50aXR5IHR5cGUgb3IgY3JlYXRlIG9uZSBhbmQgcmVnaXN0ZXIgaXQuXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIHJlZHVjZXJcbiAgICovXG4gIGdldE9yQ3JlYXRlUmVkdWNlcjxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgbGV0IHJlZHVjZXI6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+ID1cbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzW2VudGl0eU5hbWVdO1xuXG4gICAgaWYgKCFyZWR1Y2VyKSB7XG4gICAgICByZWR1Y2VyID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnkuY3JlYXRlPFQ+KGVudGl0eU5hbWUpO1xuICAgICAgcmVkdWNlciA9IHRoaXMucmVnaXN0ZXJSZWR1Y2VyPFQ+KGVudGl0eU5hbWUsIHJlZHVjZXIpO1xuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnNbZW50aXR5TmFtZV0gPSByZWR1Y2VyO1xuICAgIH1cbiAgICByZXR1cm4gcmVkdWNlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlciBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIHJlZHVjZXIgLSByZWR1Y2VyIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcignSGVybycsIG15SGVyb1JlZHVjZXIpO1xuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcignVmlsbGFpbicsIG15VmlsbGFpblJlZHVjZXIpO1xuICAgKi9cbiAgcmVnaXN0ZXJSZWR1Y2VyPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByZWR1Y2VyOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VyKHJlZHVjZXIgYXMgYW55KTtcbiAgICByZXR1cm4gKHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzW2VudGl0eU5hbWUudHJpbSgpXSA9IHJlZHVjZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzLlxuICAgKiBAcGFyYW0gcmVkdWNlcnMgLSByZWR1Y2VycyB0byBtZXJnZSBpbnRvIGV4aXN0aW5nIHJlZHVjZXJzXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyUmVkdWNlcnMoe1xuICAgKiAgICAgSGVybzogbXlIZXJvUmVkdWNlcixcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpblJlZHVjZXJcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyUmVkdWNlcnMocmVkdWNlcnM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vycykge1xuICAgIGNvbnN0IGtleXMgPSByZWR1Y2VycyA/IE9iamVjdC5rZXlzKHJlZHVjZXJzKSA6IFtdO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnJlZ2lzdGVyUmVkdWNlcihrZXksIHJlZHVjZXJzW2tleV0pKTtcbiAgfVxufVxuIl19