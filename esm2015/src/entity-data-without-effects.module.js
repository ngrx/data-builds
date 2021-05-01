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
    // eslint-disable-next-line @angular-eslint/contextual-lifecycle
    ngOnDestroy() {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    }
}
EntityDataModuleWithoutEffects.decorators = [
    { type: NgModule, args: [{
                imports: [
                    StoreModule, // rely on Store feature providers rather than Store.forFeature()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBQ1IsY0FBYyxFQUNkLFFBQVEsR0FFVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBRUwsZUFBZSxFQUVmLGNBQWMsRUFDZCxXQUFXLEdBQ1osTUFBTSxhQUFhLENBQUM7QUFFckIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDMUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFFakcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFdEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEYsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLE1BQU0sOERBQThELENBQUM7QUFDdEgsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDckcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRW5FLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3JHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5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O1NBQ0YsQ0FBQztJQUNKLENBQUM7SUEyQ0QsZ0VBQWdFO0lBQ2hFLFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM3RCxDQUFDOzs7WUFyR0YsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUUsaUVBQWlFO2lCQUMvRTtnQkFDRCxTQUFTLEVBQUU7b0JBQ1Qsc0JBQXNCO29CQUN0Qiw4QkFBOEI7b0JBQzlCLG1CQUFtQjtvQkFDbkIscUJBQXFCO29CQUNyQix5QkFBeUI7b0JBQ3pCLDJCQUEyQjtvQkFDM0IsdUJBQXVCO29CQUN2Qiw4QkFBOEI7b0JBQzlCLHFDQUFxQztvQkFDckMsK0JBQStCO29CQUMvQixzQ0FBc0M7b0JBQ3RDLDhCQUE4QjtvQkFDOUIsdUJBQXVCO29CQUN2Qix1QkFBdUI7b0JBQ3ZCLHNCQUFzQjtvQkFDdEIsdUJBQXVCO29CQUN2QixzQkFBc0I7b0JBQ3RCLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsSUFBbUIsRUFBRTtvQkFDakUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRTtvQkFDekQsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUU7aUJBQzdDO2FBQ0Y7Ozs7WUFsRkMsY0FBYztZQXNCUCx5QkFBeUI7WUFoQ2hDLFFBQVE7eUNBZ0lMLFFBQVEsWUFDUixNQUFNLFNBQUMsdUJBQXVCOzRDQUU5QixRQUFRLFlBQ1IsTUFBTSxTQUFDLDBCQUEwQjt3Q0FFakMsUUFBUSxZQUNSLE1BQU0sU0FBQywwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIGNvbWJpbmVSZWR1Y2VycyxcbiAgTWV0YVJlZHVjZXIsXG4gIFJlZHVjZXJNYW5hZ2VyLFxuICBTdG9yZU1vZHVsZSxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZURpc3BhdGNoZXIgfSBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1jYWNoZS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IGVudGl0eUNhY2hlU2VsZWN0b3JQcm92aWRlciB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZWxlbWVudHMtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItbWV0aG9kcyc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlNZXRhZGF0YU1hcCB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUtcmVkdWNlcic7XG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfTkFNRSxcbiAgRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4sXG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICBJTklUSUFMX0VOVElUWV9DQUNIRV9TVEFURSxcbn0gZnJvbSAnLi9yZWR1Y2Vycy9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBEZWZhdWx0TG9nZ2VyIH0gZnJvbSAnLi91dGlscy9kZWZhdWx0LWxvZ2dlcic7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzQmFzZSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcy1iYXNlJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtZWxlbWVudHMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFNb2R1bGVDb25maWcge1xuICBlbnRpdHlNZXRhZGF0YT86IEVudGl0eU1ldGFkYXRhTWFwO1xuICBlbnRpdHlDYWNoZU1ldGFSZWR1Y2Vycz86IChcbiAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPj5cbiAgKVtdO1xuICBlbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzPzogTWV0YVJlZHVjZXI8RW50aXR5Q29sbGVjdGlvbiwgRW50aXR5QWN0aW9uPltdO1xuICAvLyBJbml0aWFsIEVudGl0eUNhY2hlIHN0YXRlIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoYXQgc3RhdGVcbiAgaW5pdGlhbEVudGl0eUNhY2hlU3RhdGU/OiBFbnRpdHlDYWNoZSB8ICgoKSA9PiBFbnRpdHlDYWNoZSk7XG4gIHBsdXJhbE5hbWVzPzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKlxuICogTW9kdWxlIHdpdGhvdXQgZWZmZWN0cyBvciBkYXRhc2VydmljZXMgd2hpY2ggbWVhbnMgbm8gSFRUUCBjYWxsc1xuICogVGhpcyBtb2R1bGUgaGVscGZ1bCBmb3IgaW50ZXJuYWwgdGVzdGluZy5cbiAqIEFsc28gaGVscGZ1bCBmb3IgYXBwcyB0aGF0IGhhbmRsZSBzZXJ2ZXIgYWNjZXNzIG9uIHRoZWlyIG93biBhbmRcbiAqIHRoZXJlZm9yZSBvcHQtb3V0IG9mIEBuZ3J4L2VmZmVjdHMgZm9yIGVudGl0aWVzXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBTdG9yZU1vZHVsZSwgLy8gcmVseSBvbiBTdG9yZSBmZWF0dXJlIHByb3ZpZGVycyByYXRoZXIgdGhhbiBTdG9yZS5mb3JGZWF0dXJlKClcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ29ycmVsYXRpb25JZEdlbmVyYXRvcixcbiAgICBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBFbnRpdHlDYWNoZURpc3BhdGNoZXIsXG4gICAgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICBlbnRpdHlDYWNoZVNlbGVjdG9yUHJvdmlkZXIsXG4gICAgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnksXG4gICAgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnksXG4gICAgRW50aXR5U2VsZWN0b3JzRmFjdG9yeSxcbiAgICBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSxcbiAgICBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLFxuICAgIHsgcHJvdmlkZTogRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4sIHVzZVZhbHVlOiBFTlRJVFlfQ0FDSEVfTkFNRSB9LFxuICAgIHsgcHJvdmlkZTogRW50aXR5U2VydmljZXMsIHVzZUNsYXNzOiBFbnRpdHlTZXJ2aWNlc0Jhc2UgfSxcbiAgICB7IHByb3ZpZGU6IExvZ2dlciwgdXNlQ2xhc3M6IERlZmF1bHRMb2dnZXIgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlbnRpdHlDYWNoZUZlYXR1cmU6IGFueTtcblxuICBzdGF0aWMgZm9yUm9vdChcbiAgICBjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWdcbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHM+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFBMVVJBTF9OQU1FU19UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLnBsdXJhbE5hbWVzID8gY29uZmlnLnBsdXJhbE5hbWVzIDoge30sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlZHVjZXJNYW5hZ2VyOiBSZWR1Y2VyTWFuYWdlcixcbiAgICBlbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5OiBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIC8vIG9wdGlvbmFsIHBhcmFtc1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTilcbiAgICBwcml2YXRlIGVudGl0eUNhY2hlTmFtZTogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChJTklUSUFMX0VOVElUWV9DQUNIRV9TVEFURSlcbiAgICBwcml2YXRlIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUylcbiAgICBwcml2YXRlIG1ldGFSZWR1Y2VyczogKFxuICAgICAgfCBNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPlxuICAgICAgfCBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPj5cbiAgICApW11cbiAgKSB7XG4gICAgLy8gQWRkIHRoZSBAbmdyeC9kYXRhIGZlYXR1cmUgdG8gdGhlIFN0b3JlJ3MgZmVhdHVyZXNcbiAgICAvLyBhcyBTdG9yZS5mb3JGZWF0dXJlIGRvZXMgZm9yIFN0b3JlRmVhdHVyZU1vZHVsZVxuICAgIGNvbnN0IGtleSA9IGVudGl0eUNhY2hlTmFtZSB8fCBFTlRJVFlfQ0FDSEVfTkFNRTtcblxuICAgIGluaXRpYWxTdGF0ZSA9XG4gICAgICB0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAnZnVuY3Rpb24nID8gaW5pdGlhbFN0YXRlKCkgOiBpbml0aWFsU3RhdGU7XG5cbiAgICBjb25zdCByZWR1Y2VyczogTWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj5bXSA9IChcbiAgICAgIG1ldGFSZWR1Y2VycyB8fCBbXVxuICAgICkubWFwKChtcikgPT4ge1xuICAgICAgcmV0dXJuIG1yIGluc3RhbmNlb2YgSW5qZWN0aW9uVG9rZW4gPyBpbmplY3Rvci5nZXQobXIpIDogbXI7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSA9IHtcbiAgICAgIGtleSxcbiAgICAgIHJlZHVjZXJzOiBlbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LmNyZWF0ZSgpLFxuICAgICAgcmVkdWNlckZhY3Rvcnk6IGNvbWJpbmVSZWR1Y2VycyxcbiAgICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlIHx8IHt9LFxuICAgICAgbWV0YVJlZHVjZXJzOiByZWR1Y2VycyxcbiAgICB9O1xuICAgIHJlZHVjZXJNYW5hZ2VyLmFkZEZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9jb250ZXh0dWFsLWxpZmVjeWNsZVxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlZHVjZXJNYW5hZ2VyLnJlbW92ZUZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG59XG4iXX0=