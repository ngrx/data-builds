import { Inject, Injectable, Optional } from '@angular/core';
import { compose } from '@ngrx/store';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-reducer";
/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
class EntityCollectionReducerRegistry {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, deps: [{ token: i1.EntityCollectionReducerFactory }, { token: ENTITY_COLLECTION_META_REDUCERS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionReducerRegistry }); }
}
export { EntityCollectionReducerRegistry };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityCollectionReducerFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_COLLECTION_META_REDUCERS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLE9BQU8sRUFBZSxNQUFNLGFBQWEsQ0FBQztBQUluRCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQVc5RDs7O0dBR0c7QUFDSCxNQUNhLCtCQUErQjtJQU8xQyxZQUNVLDhCQUE4RCxFQUd0RSw0QkFBNEU7UUFIcEUsbUNBQThCLEdBQTlCLDhCQUE4QixDQUFnQztRQVA5RCw2QkFBd0IsR0FBNkIsRUFBRSxDQUFDO1FBWWhFLHlDQUF5QztRQUN6QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FDOUMsSUFBSSxFQUNKLDRCQUE0QixJQUFJLEVBQUUsQ0FDNUIsQ0FBQztJQUNYLENBQUM7SUFFRDs7O09BR0c7SUFDSCxrQkFBa0IsQ0FBSSxVQUFrQjtRQUN0QyxJQUFJLE9BQU8sR0FDVCxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sR0FBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsTUFBTSxDQUFJLFVBQVUsQ0FBQyxDQUFDO1lBQ3BFLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFJLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsZUFBZSxDQUNiLFVBQWtCLEVBQ2xCLE9BQW1DO1FBRW5DLE9BQU8sR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsT0FBYyxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsZ0JBQWdCLENBQUMsUUFBa0M7UUFDakQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO2lJQWxFVSwrQkFBK0IsZ0VBVWhDLCtCQUErQjtxSUFWOUIsK0JBQStCOztTQUEvQiwrQkFBK0I7MkZBQS9CLCtCQUErQjtrQkFEM0MsVUFBVTs7MEJBVU4sUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQywrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb21wb3NlLCBNZXRhUmVkdWNlciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcixcbiAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxufSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXInO1xuXG4vKiogQSBoYXNoIG9mIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VycyAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMge1xuICBbZW50aXR5OiBzdHJpbmddOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxhbnk+O1xufVxuXG4vKipcbiAqIFJlZ2lzdHJ5IG9mIGVudGl0eSB0eXBlcyBhbmQgdGhlaXIgcHJldmlvdXNseS1jb25zdHJ1Y3RlZCByZWR1Y2Vycy5cbiAqIENhbiBjcmVhdGUgYSBuZXcgQ29sbGVjdGlvblJlZHVjZXIsIHdoaWNoIGl0IHJlZ2lzdGVycyBmb3Igc3Vic2VxdWVudCB1c2UuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IHtcbiAgcHJvdGVjdGVkIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyczogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzID0ge307XG4gIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VyOiBNZXRhUmVkdWNlcjxcbiAgICBFbnRpdHlDb2xsZWN0aW9uLFxuICAgIEVudGl0eUFjdGlvblxuICA+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMpXG4gICAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vycz86IE1ldGFSZWR1Y2VyPEVudGl0eUNvbGxlY3Rpb24sIEVudGl0eUFjdGlvbj5bXVxuICApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXNwcmVhZFxuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VyID0gY29tcG9zZS5hcHBseShcbiAgICAgIG51bGwsXG4gICAgICBlbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzIHx8IFtdXG4gICAgKSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSByZWdpc3RlcmVkIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IGZvciB0aGlzIGVudGl0eSB0eXBlIG9yIGNyZWF0ZSBvbmUgYW5kIHJlZ2lzdGVyIGl0LlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZSBmb3IgdGhpcyByZWR1Y2VyXG4gICAqL1xuICBnZXRPckNyZWF0ZVJlZHVjZXI8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4ge1xuICAgIGxldCByZWR1Y2VyOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiA9XG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vyc1tlbnRpdHlOYW1lXTtcblxuICAgIGlmICghcmVkdWNlcikge1xuICAgICAgcmVkdWNlciA9IHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LmNyZWF0ZTxUPihlbnRpdHlOYW1lKTtcbiAgICAgIHJlZHVjZXIgPSB0aGlzLnJlZ2lzdGVyUmVkdWNlcjxUPihlbnRpdHlOYW1lLCByZWR1Y2VyKTtcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJzW2VudGl0eU5hbWVdID0gcmVkdWNlcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlZHVjZXI7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gRW50aXR5Q29sbGVjdGlvblJlZHVjZXIgZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSByZWR1Y2VyIC0gcmVkdWNlciBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlclJlZHVjZXIoJ0hlcm8nLCBteUhlcm9SZWR1Y2VyKTtcbiAgICogICByZWdpc3RlclJlZHVjZXIoJ1ZpbGxhaW4nLCBteVZpbGxhaW5SZWR1Y2VyKTtcbiAgICovXG4gIHJlZ2lzdGVyUmVkdWNlcjxUPihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgcmVkdWNlcjogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4ge1xuICAgIHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcihyZWR1Y2VyIGFzIGFueSk7XG4gICAgcmV0dXJuICh0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vyc1tlbnRpdHlOYW1lLnRyaW0oKV0gPSByZWR1Y2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGJhdGNoIG9mIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vycy5cbiAgICogQHBhcmFtIHJlZHVjZXJzIC0gcmVkdWNlcnMgdG8gbWVyZ2UgaW50byBleGlzdGluZyByZWR1Y2Vyc1xuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlclJlZHVjZXJzKHtcbiAgICogICAgIEhlcm86IG15SGVyb1JlZHVjZXIsXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5SZWR1Y2VyXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3RlclJlZHVjZXJzKHJlZHVjZXJzOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMpIHtcbiAgICBjb25zdCBrZXlzID0gcmVkdWNlcnMgPyBPYmplY3Qua2V5cyhyZWR1Y2VycykgOiBbXTtcbiAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gdGhpcy5yZWdpc3RlclJlZHVjZXIoa2V5LCByZWR1Y2Vyc1trZXldKSk7XG4gIH1cbn1cbiJdfQ==