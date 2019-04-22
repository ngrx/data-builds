import * as tslib_1 from "tslib";
import { NgModule, Inject, Injector, InjectionToken, Optional, } from '@angular/core';
import { combineReducers, ReducerManager, StoreModule, } from '@ngrx/store';
import { CorrelationIdGenerator } from './utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
import { EntityActionFactory } from './actions/entity-action-factory';
import { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
import { entityCacheSelectorProvider } from './selectors/entity-cache-selector';
import { EntityCollectionServiceElementsFactory } from './entity-services/entity-collection-service-elements-factory';
import { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
import { EntityServices, } from './entity-services/entity-services';
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
var ɵ0 = ENTITY_CACHE_NAME;
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
var EntityDataModuleWithoutEffects = /** @class */ (function () {
    function EntityDataModuleWithoutEffects(reducerManager, entityCacheReducerFactory, injector, 
    // optional params
    entityCacheName, initialState, metaReducers) {
        this.reducerManager = reducerManager;
        this.injector = injector;
        this.entityCacheName = entityCacheName;
        this.initialState = initialState;
        this.metaReducers = metaReducers;
        // Add the ngrx-data feature to the Store's features
        // as Store.forFeature does for StoreFeatureModule
        var key = entityCacheName || ENTITY_CACHE_NAME;
        initialState =
            typeof initialState === 'function' ? initialState() : initialState;
        var reducers = (metaReducers || []).map(function (mr) {
            return mr instanceof InjectionToken ? injector.get(mr) : mr;
        });
        this.entityCacheFeature = {
            key: key,
            reducers: entityCacheReducerFactory.create(),
            reducerFactory: combineReducers,
            initialState: initialState || {},
            metaReducers: reducers,
        };
        reducerManager.addFeature(this.entityCacheFeature);
    }
    EntityDataModuleWithoutEffects_1 = EntityDataModuleWithoutEffects;
    EntityDataModuleWithoutEffects.forRoot = function (config) {
        return {
            ngModule: EntityDataModuleWithoutEffects_1,
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
    };
    EntityDataModuleWithoutEffects.prototype.ngOnDestroy = function () {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    };
    var EntityDataModuleWithoutEffects_1;
    EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects_1 = tslib_1.__decorate([
        NgModule({
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
        }),
        tslib_1.__param(3, Optional()),
        tslib_1.__param(3, Inject(ENTITY_CACHE_NAME_TOKEN)),
        tslib_1.__param(4, Optional()),
        tslib_1.__param(4, Inject(INITIAL_ENTITY_CACHE_STATE)),
        tslib_1.__param(5, Optional()),
        tslib_1.__param(5, Inject(ENTITY_CACHE_META_REDUCERS)),
        tslib_1.__metadata("design:paramtypes", [ReducerManager,
            EntityCacheReducerFactory,
            Injector, String, Object, Array])
    ], EntityDataModuleWithoutEffects);
    return EntityDataModuleWithoutEffects;
}());
export { EntityDataModuleWithoutEffects };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sUUFBUSxFQUNSLGNBQWMsRUFDZCxRQUFRLEdBRVQsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUdMLGVBQWUsRUFFZixjQUFjLEVBQ2QsV0FBVyxHQUNaLE1BQU0sYUFBYSxDQUFDO0FBRXJCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRWpHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRXRFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRWhGLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3RILE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3JHLE9BQU8sRUFFTCxjQUFjLEdBQ2YsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RixPQUFPLEVBQUUscUNBQXFDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUNyRyxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRyxPQUFPLEVBQUUsdUJBQXVCLEVB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ZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgT3B0aW9uYWwsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgY29tYmluZVJlZHVjZXJzLFxuICBNZXRhUmVkdWNlcixcbiAgUmVkdWNlck1hbmFnZXIsXG4gIFN0b3JlTW9kdWxlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRGlzcGF0Y2hlciB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWNhY2hlLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgZW50aXR5Q2FjaGVTZWxlY3RvclByb3ZpZGVyIH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZWxlbWVudHMtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAsXG4gIEVudGl0eVNlcnZpY2VzLFxufSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItbWV0aG9kcyc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1lZmZlY3RzJztcbmltcG9ydCB7XG4gIEVudGl0eU1ldGFkYXRhTWFwLFxuICBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG59IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyJztcbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9OQU1FLFxuICBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTixcbiAgRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gIEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gIElOSVRJQUxfRU5USVRZX0NBQ0hFX1NUQVRFLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtbG9nZ2VyJztcbmltcG9ydCB7IERlZmF1bHRQbHVyYWxpemVyIH0gZnJvbSAnLi91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXInO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzIH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzQmFzZSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcy1iYXNlJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtZWxlbWVudHMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBQbHVyYWxpemVyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFNb2R1bGVDb25maWcge1xuICBlbnRpdHlNZXRhZGF0YT86IEVudGl0eU1ldGFkYXRhTWFwO1xuICBlbnRpdHlDYWNoZU1ldGFSZWR1Y2Vycz86IChcbiAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPj4pW107XG4gIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnM/OiBNZXRhUmVkdWNlcjxFbnRpdHlDb2xsZWN0aW9uLCBFbnRpdHlBY3Rpb24+W107XG4gIC8vIEluaXRpYWwgRW50aXR5Q2FjaGUgc3RhdGUgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhhdCBzdGF0ZVxuICBpbml0aWFsRW50aXR5Q2FjaGVTdGF0ZT86IEVudGl0eUNhY2hlIHwgKCgpID0+IEVudGl0eUNhY2hlKTtcbiAgcGx1cmFsTmFtZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuLyoqXG4gKiBNb2R1bGUgd2l0aG91dCBlZmZlY3RzIG9yIGRhdGFzZXJ2aWNlcyB3aGljaCBtZWFucyBubyBIVFRQIGNhbGxzXG4gKiBUaGlzIG1vZHVsZSBoZWxwZnVsIGZvciBpbnRlcm5hbCB0ZXN0aW5nLlxuICogQWxzbyBoZWxwZnVsIGZvciBhcHBzIHRoYXQgaGFuZGxlIHNlcnZlciBhY2Nlc3Mgb24gdGhlaXIgb3duIGFuZFxuICogdGhlcmVmb3JlIG9wdC1vdXQgb2YgQG5ncngvZWZmZWN0cyBmb3IgZW50aXRpZXNcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIFN0b3JlTW9kdWxlLCAvLyByZWx5IG9uIFN0b3JlIGZlYXR1cmUgcHJvdmlkZXJzIHJhdGhlciB0aGFuIFN0b3JlLmZvckZlYXR1cmUoKVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBDb3JyZWxhdGlvbklkR2VuZXJhdG9yLFxuICAgIEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGlzcGF0Y2hlcixcbiAgICBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgIGVudGl0eUNhY2hlU2VsZWN0b3JQcm92aWRlcixcbiAgICBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSxcbiAgICBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxuICAgIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxuICAgIEVudGl0eVNlcnZpY2VzRWxlbWVudHMsXG4gICAgeyBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTiwgdXNlVmFsdWU6IEVOVElUWV9DQUNIRV9OQU1FIH0sXG4gICAgeyBwcm92aWRlOiBFbnRpdHlTZXJ2aWNlcywgdXNlQ2xhc3M6IEVudGl0eVNlcnZpY2VzQmFzZSB9LFxuICAgIHsgcHJvdmlkZTogTG9nZ2VyLCB1c2VDbGFzczogRGVmYXVsdExvZ2dlciB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVudGl0eUNhY2hlRmVhdHVyZTogYW55O1xuXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogRW50aXR5RGF0YU1vZHVsZUNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUExVUkFMX05BTUVTX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcucGx1cmFsTmFtZXMgPyBjb25maWcucGx1cmFsTmFtZXMgOiB7fSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVkdWNlck1hbmFnZXI6IFJlZHVjZXJNYW5hZ2VyLFxuICAgIGVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnk6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgLy8gb3B0aW9uYWwgcGFyYW1zXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOKVxuICAgIHByaXZhdGUgZW50aXR5Q2FjaGVOYW1lOiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KElOSVRJQUxfRU5USVRZX0NBQ0hFX1NUQVRFKVxuICAgIHByaXZhdGUgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTKVxuICAgIHByaXZhdGUgbWV0YVJlZHVjZXJzOiAoXG4gICAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgICB8IEluamVjdGlvblRva2VuPE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+PilbXVxuICApIHtcbiAgICAvLyBBZGQgdGhlIG5ncngtZGF0YSBmZWF0dXJlIHRvIHRoZSBTdG9yZSdzIGZlYXR1cmVzXG4gICAgLy8gYXMgU3RvcmUuZm9yRmVhdHVyZSBkb2VzIGZvciBTdG9yZUZlYXR1cmVNb2R1bGVcbiAgICBjb25zdCBrZXkgPSBlbnRpdHlDYWNoZU5hbWUgfHwgRU5USVRZX0NBQ0hFX05BTUU7XG5cbiAgICBpbml0aWFsU3RhdGUgPVxuICAgICAgdHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IGluaXRpYWxTdGF0ZSgpIDogaW5pdGlhbFN0YXRlO1xuXG4gICAgY29uc3QgcmVkdWNlcnM6IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+W10gPSAoXG4gICAgICBtZXRhUmVkdWNlcnMgfHwgW11cbiAgICApLm1hcChtciA9PiB7XG4gICAgICByZXR1cm4gbXIgaW5zdGFuY2VvZiBJbmplY3Rpb25Ub2tlbiA/IGluamVjdG9yLmdldChtcikgOiBtcjtcbiAgICB9KTtcblxuICAgIHRoaXMuZW50aXR5Q2FjaGVGZWF0dXJlID0ge1xuICAgICAga2V5LFxuICAgICAgcmVkdWNlcnM6IGVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnkuY3JlYXRlKCksXG4gICAgICByZWR1Y2VyRmFjdG9yeTogY29tYmluZVJlZHVjZXJzLFxuICAgICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGUgfHwge30sXG4gICAgICBtZXRhUmVkdWNlcnM6IHJlZHVjZXJzLFxuICAgIH07XG4gICAgcmVkdWNlck1hbmFnZXIuYWRkRmVhdHVyZSh0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlZHVjZXJNYW5hZ2VyLnJlbW92ZUZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG59XG4iXX0=