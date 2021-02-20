import { NgModule, Inject, Injector, InjectionToken, Optional, } from '@angular/core';
import { combineReducers, ReducerManager, StoreModule, } from '@ngrx/store';
import { CorrelationIdGenerator } from './utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
import { EntityActionFactory } from './actions/entity-action-factory';
import { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
import { entityCacheSelectorProvider } from './selectors/entity-cache-selector';
import { EntityCollectionServiceElementsFactory } from './entity-services/entity-collection-service-elements-factory';
import { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
import { EntityServices } from './entity-services/entity-services';
import { EntityCollectionCreator } from './reducers/entity-collection-creator';
import { EntityCollectionReducerFactory } from './reducers/entity-collection-reducer';
import { EntityCollectionReducerMethodsFactory } from './reducers/entity-collection-reducer-methods';
import { EntityCollectionReducerRegistry } from './reducers/entity-collection-reducer-registry';
import { EntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from './entity-metadata/entity-definition.service';
import { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import { ENTITY_CACHE_NAME, ENTITY_CACHE_NAME_TOKEN, ENTITY_CACHE_META_REDUCERS, ENTITY_COLLECTION_META_REDUCERS, INITIAL_ENTITY_CACHE_STATE, } from './reducers/constants';
import { DefaultLogger } from './utils/default-logger';
import { EntitySelectorsFactory } from './selectors/entity-selectors';
import { EntitySelectors$Factory } from './selectors/entity-selectors$';
import { EntityServicesBase } from './entity-services/entity-services-base';
import { EntityServicesElements } from './entity-services/entity-services-elements';
import { Logger, PLURAL_NAMES_TOKEN } from './utils/interfaces';
const ɵ0 = ENTITY_CACHE_NAME;
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
export class EntityDataModuleWithoutEffects {
    constructor(reducerManager, entityCacheReducerFactory, injector, 
    // optional params
    entityCacheName, initialState, metaReducers) {
        this.reducerManager = reducerManager;
        this.injector = injector;
        this.entityCacheName = entityCacheName;
        this.initialState = initialState;
        this.metaReducers = metaReducers;
        // Add the @ngrx/data feature to the Store's features
        // as Store.forFeature does for StoreFeatureModule
        const key = entityCacheName || ENTITY_CACHE_NAME;
        initialState =
            typeof initialState === 'function' ? initialState() : initialState;
        const reducers = (metaReducers || []).map((mr) => {
            return mr instanceof InjectionToken ? injector.get(mr) : mr;
        });
        this.entityCacheFeature = {
            key,
            reducers: entityCacheReducerFactory.create(),
            reducerFactory: combineReducers,
            initialState: initialState || {},
            metaReducers: reducers,
        };
        reducerManager.addFeature(this.entityCacheFeature);
    }
    static forRoot(config) {
        return {
            ngModule: EntityDataModuleWithoutEffects,
            providers: [
                {
                    provide: ENTITY_CACHE_META_REDUCERS,
                    useValue: config.entityCacheMetaReducers
                        ? config.entityCacheMetaReducers
                        : [],
                },
                {
                    provide: ENTITY_COLLECTION_META_REDUCERS,
                    useValue: config.entityCollectionMetaReducers
                        ? config.entityCollectionMetaReducers
                        : [],
                },
                {
                    provide: PLURAL_NAMES_TOKEN,
                    multi: true,
                    useValue: config.pluralNames ? config.pluralNames : {},
                },
            ],
        };
    }
    ngOnDestroy() {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    }
}
EntityDataModuleWithoutEffects.decorators = [
    { type: NgModule, args: [{
                imports: [
                    StoreModule,
                ],
                providers: [
                    CorrelationIdGenerator,
                    EntityDispatcherDefaultOptions,
                    EntityActionFactory,
                    EntityCacheDispatcher,
                    EntityCacheReducerFactory,
                    entityCacheSelectorProvider,
                    EntityCollectionCreator,
                    EntityCollectionReducerFactory,
                    EntityCollectionReducerMethodsFactory,
                    EntityCollectionReducerRegistry,
                    EntityCollectionServiceElementsFactory,
                    EntityCollectionServiceFactory,
                    EntityDefinitionService,
                    EntityDispatcherFactory,
                    EntitySelectorsFactory,
                    EntitySelectors$Factory,
                    EntityServicesElements,
                    { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ɵ0 },
                    { provide: EntityServices, useClass: EntityServicesBase },
                    { provide: Logger, useClass: DefaultLogger },
                ],
            },] }
];
/** @nocollapse */
EntityDataModuleWithoutEffects.ctorParameters = () => [
    { type: ReducerManager },
    { type: EntityCacheReducerFactory },
    { type: Injector },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_NAME_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [INITIAL_ENTITY_CACHE_STATE,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_META_REDUCERS,] }] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBQ1IsY0FBYyxFQUNkLFFBQVEsR0FFVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBRUwsZUFBZSxFQUVmLGNBQWMsRUFDZCxXQUFXLEdBQ1osTUFBTSxhQUFhLENBQUM7QUFFckIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDMUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFFakcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFdEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEYsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLE1BQU0sOERBQThELENBQUM7QUFDdEgsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDckcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRW5FLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3JHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5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O1NBQ0YsQ0FBQztJQUNKLENBQUM7SUEyQ0QsV0FBVztRQUNULElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdELENBQUM7OztZQXBHRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFdBQVc7aUJBQ1o7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULHNCQUFzQjtvQkFDdEIsOEJBQThCO29CQUM5QixtQkFBbUI7b0JBQ25CLHFCQUFxQjtvQkFDckIseUJBQXlCO29CQUN6QiwyQkFBMkI7b0JBQzNCLHVCQUF1QjtvQkFDdkIsOEJBQThCO29CQUM5QixxQ0FBcUM7b0JBQ3JDLCtCQUErQjtvQkFDL0Isc0NBQXNDO29CQUN0Qyw4QkFBOEI7b0JBQzlCLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2QixzQkFBc0I7b0JBQ3RCLHVCQUF1QjtvQkFDdkIsc0JBQXNCO29CQUN0QixFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLElBQW1CLEVBQUU7b0JBQ2pFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUU7b0JBQ3pELEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFO2lCQUM3QzthQUNGOzs7O1lBbEZDLGNBQWM7WUFzQlAseUJBQXlCO1lBaENoQyxRQUFRO3lDQWdJTCxRQUFRLFlBQ1IsTUFBTSxTQUFDLHVCQUF1Qjs0Q0FFOUIsUUFBUSxZQUNSLE1BQU0sU0FBQywwQkFBMEI7d0NBRWpDLFFBQVEsWUFDUixNQUFNLFNBQUMsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgTmdNb2R1bGUsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdGlvblRva2VuLFxuICBPcHRpb25hbCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBjb21iaW5lUmVkdWNlcnMsXG4gIE1ldGFSZWR1Y2VyLFxuICBSZWR1Y2VyTWFuYWdlcixcbiAgU3RvcmVNb2R1bGUsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVEaXNwYXRjaGVyIH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktY2FjaGUtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBlbnRpdHlDYWNoZVNlbGVjdG9yUHJvdmlkZXIgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWVsZW1lbnRzLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5TWV0YWRhdGFNYXAgfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktbWV0YWRhdGEnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNhY2hlLXJlZHVjZXInO1xuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX05BTUUsXG4gIEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOLFxuICBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgSU5JVElBTF9FTlRJVFlfQ0FDSEVfU1RBVEUsXG59IGZyb20gJy4vcmVkdWNlcnMvY29uc3RhbnRzJztcblxuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdC1sb2dnZXInO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzRmFjdG9yeSB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnkgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlc0Jhc2UgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZSc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzJztcbmltcG9ydCB7IExvZ2dlciwgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi91dGlscy9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnIHtcbiAgZW50aXR5TWV0YWRhdGE/OiBFbnRpdHlNZXRhZGF0YU1hcDtcbiAgZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnM/OiAoXG4gICAgfCBNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPlxuICAgIHwgSW5qZWN0aW9uVG9rZW48TWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4+XG4gIClbXTtcbiAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vycz86IE1ldGFSZWR1Y2VyPEVudGl0eUNvbGxlY3Rpb24sIEVudGl0eUFjdGlvbj5bXTtcbiAgLy8gSW5pdGlhbCBFbnRpdHlDYWNoZSBzdGF0ZSBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGF0IHN0YXRlXG4gIGluaXRpYWxFbnRpdHlDYWNoZVN0YXRlPzogRW50aXR5Q2FjaGUgfCAoKCkgPT4gRW50aXR5Q2FjaGUpO1xuICBwbHVyYWxOYW1lcz86IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9O1xufVxuXG4vKipcbiAqIE1vZHVsZSB3aXRob3V0IGVmZmVjdHMgb3IgZGF0YXNlcnZpY2VzIHdoaWNoIG1lYW5zIG5vIEhUVFAgY2FsbHNcbiAqIFRoaXMgbW9kdWxlIGhlbHBmdWwgZm9yIGludGVybmFsIHRlc3RpbmcuXG4gKiBBbHNvIGhlbHBmdWwgZm9yIGFwcHMgdGhhdCBoYW5kbGUgc2VydmVyIGFjY2VzcyBvbiB0aGVpciBvd24gYW5kXG4gKiB0aGVyZWZvcmUgb3B0LW91dCBvZiBAbmdyeC9lZmZlY3RzIGZvciBlbnRpdGllc1xuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgU3RvcmVNb2R1bGUsIC8vIHJlbHkgb24gU3RvcmUgZmVhdHVyZSBwcm92aWRlcnMgcmF0aGVyIHRoYW4gU3RvcmUuZm9yRmVhdHVyZSgpXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIENvcnJlbGF0aW9uSWRHZW5lcmF0b3IsXG4gICAgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgRW50aXR5Q2FjaGVEaXNwYXRjaGVyLFxuICAgIEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgZW50aXR5Q2FjaGVTZWxlY3RvclByb3ZpZGVyLFxuICAgIEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnksXG4gICAgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eURlZmluaXRpb25TZXJ2aWNlLFxuICAgIEVudGl0eURpc3BhdGNoZXJGYWN0b3J5LFxuICAgIEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG4gICAgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnksXG4gICAgRW50aXR5U2VydmljZXNFbGVtZW50cyxcbiAgICB7IHByb3ZpZGU6IEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOLCB1c2VWYWx1ZTogRU5USVRZX0NBQ0hFX05BTUUgfSxcbiAgICB7IHByb3ZpZGU6IEVudGl0eVNlcnZpY2VzLCB1c2VDbGFzczogRW50aXR5U2VydmljZXNCYXNlIH0sXG4gICAgeyBwcm92aWRlOiBMb2dnZXIsIHVzZUNsYXNzOiBEZWZhdWx0TG9nZ2VyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZW50aXR5Q2FjaGVGZWF0dXJlOiBhbnk7XG5cbiAgc3RhdGljIGZvclJvb3QoXG4gICAgY29uZmlnOiBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBQTFVSQUxfTkFNRVNfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5wbHVyYWxOYW1lcyA/IGNvbmZpZy5wbHVyYWxOYW1lcyA6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWR1Y2VyTWFuYWdlcjogUmVkdWNlck1hbmFnZXIsXG4gICAgZW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeTogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAvLyBvcHRpb25hbCBwYXJhbXNcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4pXG4gICAgcHJpdmF0ZSBlbnRpdHlDYWNoZU5hbWU6IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoSU5JVElBTF9FTlRJVFlfQ0FDSEVfU1RBVEUpXG4gICAgcHJpdmF0ZSBpbml0aWFsU3RhdGU6IGFueSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMpXG4gICAgcHJpdmF0ZSBtZXRhUmVkdWNlcnM6IChcbiAgICAgIHwgTWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj5cbiAgICAgIHwgSW5qZWN0aW9uVG9rZW48TWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4+XG4gICAgKVtdXG4gICkge1xuICAgIC8vIEFkZCB0aGUgQG5ncngvZGF0YSBmZWF0dXJlIHRvIHRoZSBTdG9yZSdzIGZlYXR1cmVzXG4gICAgLy8gYXMgU3RvcmUuZm9yRmVhdHVyZSBkb2VzIGZvciBTdG9yZUZlYXR1cmVNb2R1bGVcbiAgICBjb25zdCBrZXkgPSBlbnRpdHlDYWNoZU5hbWUgfHwgRU5USVRZX0NBQ0hFX05BTUU7XG5cbiAgICBpbml0aWFsU3RhdGUgPVxuICAgICAgdHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IGluaXRpYWxTdGF0ZSgpIDogaW5pdGlhbFN0YXRlO1xuXG4gICAgY29uc3QgcmVkdWNlcnM6IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+W10gPSAoXG4gICAgICBtZXRhUmVkdWNlcnMgfHwgW11cbiAgICApLm1hcCgobXIpID0+IHtcbiAgICAgIHJldHVybiBtciBpbnN0YW5jZW9mIEluamVjdGlvblRva2VuID8gaW5qZWN0b3IuZ2V0KG1yKSA6IG1yO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUgPSB7XG4gICAgICBrZXksXG4gICAgICByZWR1Y2VyczogZW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeS5jcmVhdGUoKSxcbiAgICAgIHJlZHVjZXJGYWN0b3J5OiBjb21iaW5lUmVkdWNlcnMsXG4gICAgICBpbml0aWFsU3RhdGU6IGluaXRpYWxTdGF0ZSB8fCB7fSxcbiAgICAgIG1ldGFSZWR1Y2VyczogcmVkdWNlcnMsXG4gICAgfTtcbiAgICByZWR1Y2VyTWFuYWdlci5hZGRGZWF0dXJlKHRoaXMuZW50aXR5Q2FjaGVGZWF0dXJlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVkdWNlck1hbmFnZXIucmVtb3ZlRmVhdHVyZSh0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSk7XG4gIH1cbn1cbiJdfQ==