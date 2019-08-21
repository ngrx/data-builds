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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sUUFBUSxFQUNSLGNBQWMsRUFDZCxRQUFRLEdBRVQsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUVMLGVBQWUsRUFFZixjQUFjLEVBQ2QsV0FBVyxHQUNaLE1BQU0sYUFBYSxDQUFDO0FBRXJCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRWpHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRXRFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3RILE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUVuRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RixPQUFPLEVBQUUscUNBQXFDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUNyRyxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRyxPQUFPLEVBQUUsdUJBQXVCLEVB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c0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgTmdNb2R1bGUsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdGlvblRva2VuLFxuICBPcHRpb25hbCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBjb21iaW5lUmVkdWNlcnMsXG4gIE1ldGFSZWR1Y2VyLFxuICBSZWR1Y2VyTWFuYWdlcixcbiAgU3RvcmVNb2R1bGUsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVEaXNwYXRjaGVyIH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktY2FjaGUtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBlbnRpdHlDYWNoZVNlbGVjdG9yUHJvdmlkZXIgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWVsZW1lbnRzLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5TWV0YWRhdGFNYXAgfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktbWV0YWRhdGEnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNhY2hlLXJlZHVjZXInO1xuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX05BTUUsXG4gIEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOLFxuICBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgSU5JVElBTF9FTlRJVFlfQ0FDSEVfU1RBVEUsXG59IGZyb20gJy4vcmVkdWNlcnMvY29uc3RhbnRzJztcblxuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdC1sb2dnZXInO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzRmFjdG9yeSB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnkgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlc0Jhc2UgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZSc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzJztcbmltcG9ydCB7IExvZ2dlciwgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi91dGlscy9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnIHtcbiAgZW50aXR5TWV0YWRhdGE/OiBFbnRpdHlNZXRhZGF0YU1hcDtcbiAgZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnM/OiAoXG4gICAgfCBNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPlxuICAgIHwgSW5qZWN0aW9uVG9rZW48TWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4+KVtdO1xuICBlbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzPzogTWV0YVJlZHVjZXI8RW50aXR5Q29sbGVjdGlvbiwgRW50aXR5QWN0aW9uPltdO1xuICAvLyBJbml0aWFsIEVudGl0eUNhY2hlIHN0YXRlIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoYXQgc3RhdGVcbiAgaW5pdGlhbEVudGl0eUNhY2hlU3RhdGU/OiBFbnRpdHlDYWNoZSB8ICgoKSA9PiBFbnRpdHlDYWNoZSk7XG4gIHBsdXJhbE5hbWVzPzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKlxuICogTW9kdWxlIHdpdGhvdXQgZWZmZWN0cyBvciBkYXRhc2VydmljZXMgd2hpY2ggbWVhbnMgbm8gSFRUUCBjYWxsc1xuICogVGhpcyBtb2R1bGUgaGVscGZ1bCBmb3IgaW50ZXJuYWwgdGVzdGluZy5cbiAqIEFsc28gaGVscGZ1bCBmb3IgYXBwcyB0aGF0IGhhbmRsZSBzZXJ2ZXIgYWNjZXNzIG9uIHRoZWlyIG93biBhbmRcbiAqIHRoZXJlZm9yZSBvcHQtb3V0IG9mIEBuZ3J4L2VmZmVjdHMgZm9yIGVudGl0aWVzXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBTdG9yZU1vZHVsZSwgLy8gcmVseSBvbiBTdG9yZSBmZWF0dXJlIHByb3ZpZGVycyByYXRoZXIgdGhhbiBTdG9yZS5mb3JGZWF0dXJlKClcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ29ycmVsYXRpb25JZEdlbmVyYXRvcixcbiAgICBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMsXG4gICAgRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBFbnRpdHlDYWNoZURpc3BhdGNoZXIsXG4gICAgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICBlbnRpdHlDYWNoZVNlbGVjdG9yUHJvdmlkZXIsXG4gICAgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IsXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnksXG4gICAgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UsXG4gICAgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnksXG4gICAgRW50aXR5U2VsZWN0b3JzRmFjdG9yeSxcbiAgICBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSxcbiAgICBFbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLFxuICAgIHsgcHJvdmlkZTogRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4sIHVzZVZhbHVlOiBFTlRJVFlfQ0FDSEVfTkFNRSB9LFxuICAgIHsgcHJvdmlkZTogRW50aXR5U2VydmljZXMsIHVzZUNsYXNzOiBFbnRpdHlTZXJ2aWNlc0Jhc2UgfSxcbiAgICB7IHByb3ZpZGU6IExvZ2dlciwgdXNlQ2xhc3M6IERlZmF1bHRMb2dnZXIgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlbnRpdHlDYWNoZUZlYXR1cmU6IGFueTtcblxuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFBMVVJBTF9OQU1FU19UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLnBsdXJhbE5hbWVzID8gY29uZmlnLnBsdXJhbE5hbWVzIDoge30sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlZHVjZXJNYW5hZ2VyOiBSZWR1Y2VyTWFuYWdlcixcbiAgICBlbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5OiBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIC8vIG9wdGlvbmFsIHBhcmFtc1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTilcbiAgICBwcml2YXRlIGVudGl0eUNhY2hlTmFtZTogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChJTklUSUFMX0VOVElUWV9DQUNIRV9TVEFURSlcbiAgICBwcml2YXRlIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUylcbiAgICBwcml2YXRlIG1ldGFSZWR1Y2VyczogKFxuICAgICAgfCBNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPlxuICAgICAgfCBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPj4pW11cbiAgKSB7XG4gICAgLy8gQWRkIHRoZSBuZ3J4LWRhdGEgZmVhdHVyZSB0byB0aGUgU3RvcmUncyBmZWF0dXJlc1xuICAgIC8vIGFzIFN0b3JlLmZvckZlYXR1cmUgZG9lcyBmb3IgU3RvcmVGZWF0dXJlTW9kdWxlXG4gICAgY29uc3Qga2V5ID0gZW50aXR5Q2FjaGVOYW1lIHx8IEVOVElUWV9DQUNIRV9OQU1FO1xuXG4gICAgaW5pdGlhbFN0YXRlID1cbiAgICAgIHR5cGVvZiBpbml0aWFsU3RhdGUgPT09ICdmdW5jdGlvbicgPyBpbml0aWFsU3RhdGUoKSA6IGluaXRpYWxTdGF0ZTtcblxuICAgIGNvbnN0IHJlZHVjZXJzOiBNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPltdID0gKFxuICAgICAgbWV0YVJlZHVjZXJzIHx8IFtdXG4gICAgKS5tYXAobXIgPT4ge1xuICAgICAgcmV0dXJuIG1yIGluc3RhbmNlb2YgSW5qZWN0aW9uVG9rZW4gPyBpbmplY3Rvci5nZXQobXIpIDogbXI7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSA9IHtcbiAgICAgIGtleSxcbiAgICAgIHJlZHVjZXJzOiBlbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LmNyZWF0ZSgpLFxuICAgICAgcmVkdWNlckZhY3Rvcnk6IGNvbWJpbmVSZWR1Y2VycyxcbiAgICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlIHx8IHt9LFxuICAgICAgbWV0YVJlZHVjZXJzOiByZWR1Y2VycyxcbiAgICB9O1xuICAgIHJlZHVjZXJNYW5hZ2VyLmFkZEZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZWR1Y2VyTWFuYWdlci5yZW1vdmVGZWF0dXJlKHRoaXMuZW50aXR5Q2FjaGVGZWF0dXJlKTtcbiAgfVxufVxuIl19