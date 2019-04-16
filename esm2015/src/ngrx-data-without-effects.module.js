/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/**
 * @record
 */
export function NgrxDataModuleConfig() { }
if (false) {
    /** @type {?|undefined} */
    NgrxDataModuleConfig.prototype.entityMetadata;
    /** @type {?|undefined} */
    NgrxDataModuleConfig.prototype.entityCacheMetaReducers;
    /** @type {?|undefined} */
    NgrxDataModuleConfig.prototype.entityCollectionMetaReducers;
    /** @type {?|undefined} */
    NgrxDataModuleConfig.prototype.initialEntityCacheState;
    /** @type {?|undefined} */
    NgrxDataModuleConfig.prototype.pluralNames;
}
const ɵ0 = ENTITY_CACHE_NAME;
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of \@ngrx/effects for entities
 */
export class NgrxDataModuleWithoutEffects {
    /**
     * @param {?} reducerManager
     * @param {?} entityCacheReducerFactory
     * @param {?} injector
     * @param {?} entityCacheName
     * @param {?} initialState
     * @param {?} metaReducers
     */
    constructor(reducerManager, entityCacheReducerFactory, injector, entityCacheName, initialState, metaReducers) {
        this.reducerManager = reducerManager;
        this.injector = injector;
        this.entityCacheName = entityCacheName;
        this.initialState = initialState;
        this.metaReducers = metaReducers;
        // Add the ngrx-data feature to the Store's features
        // as Store.forFeature does for StoreFeatureModule
        /** @type {?} */
        const key = entityCacheName || ENTITY_CACHE_NAME;
        initialState =
            typeof initialState === 'function' ? initialState() : initialState;
        /** @type {?} */
        const reducers = (metaReducers || []).map((/**
         * @param {?} mr
         * @return {?}
         */
        mr => {
            return mr instanceof InjectionToken ? injector.get(mr) : mr;
        }));
        this.entityCacheFeature = {
            key,
            reducers: entityCacheReducerFactory.create(),
            reducerFactory: combineReducers,
            initialState: initialState || {},
            metaReducers: reducers,
        };
        reducerManager.addFeature(this.entityCacheFeature);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgrxDataModuleWithoutEffects,
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    }
}
NgrxDataModuleWithoutEffects.decorators = [
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
NgrxDataModuleWithoutEffects.ctorParameters = () => [
    { type: ReducerManager },
    { type: EntityCacheReducerFactory },
    { type: Injector },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_NAME_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [INITIAL_ENTITY_CACHE_STATE,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_META_REDUCERS,] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgrxDataModuleWithoutEffects.prototype.entityCacheFeature;
    /**
     * @type {?}
     * @private
     */
    NgrxDataModuleWithoutEffects.prototype.reducerManager;
    /**
     * @type {?}
     * @private
     */
    NgrxDataModuleWithoutEffects.prototype.injector;
    /**
     * @type {?}
     * @private
     */
    NgrxDataModuleWithoutEffects.prototype.entityCacheName;
    /**
     * @type {?}
     * @private
     */
    NgrxDataModuleWithoutEffects.prototype.initialState;
    /**
     * @type {?}
     * @private
     */
    NgrxDataModuleWithoutEffects.prototype.metaReducers;
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdyeC1kYXRhLXdpdGhvdXQtZWZmZWN0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL25ncngtZGF0YS13aXRob3V0LWVmZmVjdHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBQ1IsY0FBYyxFQUNkLFFBQVEsR0FFVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBR0wsZUFBZSxFQUVmLGNBQWMsRUFDZCxXQUFXLEdBQ1osTUFBTSxhQUFhLENBQUM7QUFFckIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDMUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFFakcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFdEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFaEYsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLE1BQU0sOERBQThELENBQUM7QUFDdEgsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDckcsT0FBTyxFQUVMLGNBQWMsR0FDZixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3JHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlD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dWxlV2l0aFByb3ZpZGVycyxcbiAgTmdNb2R1bGUsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIEluamVjdGlvblRva2VuLFxuICBPcHRpb25hbCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25SZWR1Y2VyLFxuICBjb21iaW5lUmVkdWNlcnMsXG4gIE1ldGFSZWR1Y2VyLFxuICBSZWR1Y2VyTWFuYWdlcixcbiAgU3RvcmVNb2R1bGUsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4vdXRpbHMvY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVEaXNwYXRjaGVyIH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktY2FjaGUtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBlbnRpdHlDYWNoZVNlbGVjdG9yUHJvdmlkZXIgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCxcbiAgRW50aXR5U2VydmljZXMsXG59IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXInO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItcmVnaXN0cnknO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgfSBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMnO1xuaW1wb3J0IHtcbiAgRW50aXR5TWV0YWRhdGFNYXAsXG4gIEVOVElUWV9NRVRBREFUQV9UT0tFTixcbn0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhJztcblxuaW1wb3J0IHsgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNhY2hlLXJlZHVjZXInO1xuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX05BTUUsXG4gIEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOLFxuICBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgSU5JVElBTF9FTlRJVFlfQ0FDSEVfU1RBVEUsXG59IGZyb20gJy4vcmVkdWNlcnMvY29uc3RhbnRzJztcblxuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdC1sb2dnZXInO1xuaW1wb3J0IHsgRGVmYXVsdFBsdXJhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9yc0ZhY3RvcnkgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXNCYXNlIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWJhc2UnO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXNFbGVtZW50cyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcy1lbGVtZW50cyc7XG5pbXBvcnQgeyBMb2dnZXIsIFBsdXJhbGl6ZXIsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdyeERhdGFNb2R1bGVDb25maWcge1xuICBlbnRpdHlNZXRhZGF0YT86IEVudGl0eU1ldGFkYXRhTWFwO1xuICBlbnRpdHlDYWNoZU1ldGFSZWR1Y2Vycz86IChcbiAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPj4pW107XG4gIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnM/OiBNZXRhUmVkdWNlcjxFbnRpdHlDb2xsZWN0aW9uLCBFbnRpdHlBY3Rpb24+W107XG4gIC8vIEluaXRpYWwgRW50aXR5Q2FjaGUgc3RhdGUgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhhdCBzdGF0ZVxuICBpbml0aWFsRW50aXR5Q2FjaGVTdGF0ZT86IEVudGl0eUNhY2hlIHwgKCgpID0+IEVudGl0eUNhY2hlKTtcbiAgcGx1cmFsTmFtZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuLyoqXG4gKiBNb2R1bGUgd2l0aG91dCBlZmZlY3RzIG9yIGRhdGFzZXJ2aWNlcyB3aGljaCBtZWFucyBubyBIVFRQIGNhbGxzXG4gKiBUaGlzIG1vZHVsZSBoZWxwZnVsIGZvciBpbnRlcm5hbCB0ZXN0aW5nLlxuICogQWxzbyBoZWxwZnVsIGZvciBhcHBzIHRoYXQgaGFuZGxlIHNlcnZlciBhY2Nlc3Mgb24gdGhlaXIgb3duIGFuZFxuICogdGhlcmVmb3JlIG9wdC1vdXQgb2YgQG5ncngvZWZmZWN0cyBmb3IgZW50aXRpZXNcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIFN0b3JlTW9kdWxlLCAvLyByZWx5IG9uIFN0b3JlIGZlYXR1cmUgcHJvdmlkZXJzIHJhdGhlciB0aGFuIFN0b3JlLmZvckZlYXR1cmUoKVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBDb3JyZWxhdGlvbklkR2VuZXJhdG9yLFxuICAgIEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGlzcGF0Y2hlcixcbiAgICBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgIGVudGl0eUNhY2hlU2VsZWN0b3JQcm92aWRlcixcbiAgICBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSxcbiAgICBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxuICAgIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxuICAgIEVudGl0eVNlcnZpY2VzRWxlbWVudHMsXG4gICAgeyBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTiwgdXNlVmFsdWU6IEVOVElUWV9DQUNIRV9OQU1FIH0sXG4gICAgeyBwcm92aWRlOiBFbnRpdHlTZXJ2aWNlcywgdXNlQ2xhc3M6IEVudGl0eVNlcnZpY2VzQmFzZSB9LFxuICAgIHsgcHJvdmlkZTogTG9nZ2VyLCB1c2VDbGFzczogRGVmYXVsdExvZ2dlciB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3J4RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlbnRpdHlDYWNoZUZlYXR1cmU6IGFueTtcblxuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IE5ncnhEYXRhTW9kdWxlQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOZ3J4RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUExVUkFMX05BTUVTX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcucGx1cmFsTmFtZXMgPyBjb25maWcucGx1cmFsTmFtZXMgOiB7fSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVkdWNlck1hbmFnZXI6IFJlZHVjZXJNYW5hZ2VyLFxuICAgIGVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnk6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgLy8gb3B0aW9uYWwgcGFyYW1zXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOKVxuICAgIHByaXZhdGUgZW50aXR5Q2FjaGVOYW1lOiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KElOSVRJQUxfRU5USVRZX0NBQ0hFX1NUQVRFKVxuICAgIHByaXZhdGUgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTKVxuICAgIHByaXZhdGUgbWV0YVJlZHVjZXJzOiAoXG4gICAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgICB8IEluamVjdGlvblRva2VuPE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+PilbXVxuICApIHtcbiAgICAvLyBBZGQgdGhlIG5ncngtZGF0YSBmZWF0dXJlIHRvIHRoZSBTdG9yZSdzIGZlYXR1cmVzXG4gICAgLy8gYXMgU3RvcmUuZm9yRmVhdHVyZSBkb2VzIGZvciBTdG9yZUZlYXR1cmVNb2R1bGVcbiAgICBjb25zdCBrZXkgPSBlbnRpdHlDYWNoZU5hbWUgfHwgRU5USVRZX0NBQ0hFX05BTUU7XG5cbiAgICBpbml0aWFsU3RhdGUgPVxuICAgICAgdHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IGluaXRpYWxTdGF0ZSgpIDogaW5pdGlhbFN0YXRlO1xuXG4gICAgY29uc3QgcmVkdWNlcnM6IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+W10gPSAoXG4gICAgICBtZXRhUmVkdWNlcnMgfHwgW11cbiAgICApLm1hcChtciA9PiB7XG4gICAgICByZXR1cm4gbXIgaW5zdGFuY2VvZiBJbmplY3Rpb25Ub2tlbiA/IGluamVjdG9yLmdldChtcikgOiBtcjtcbiAgICB9KTtcblxuICAgIHRoaXMuZW50aXR5Q2FjaGVGZWF0dXJlID0ge1xuICAgICAga2V5LFxuICAgICAgcmVkdWNlcnM6IGVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnkuY3JlYXRlKCksXG4gICAgICByZWR1Y2VyRmFjdG9yeTogY29tYmluZVJlZHVjZXJzLFxuICAgICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGUgfHwge30sXG4gICAgICBtZXRhUmVkdWNlcnM6IHJlZHVjZXJzLFxuICAgIH07XG4gICAgcmVkdWNlck1hbmFnZXIuYWRkRmVhdHVyZSh0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlZHVjZXJNYW5hZ2VyLnJlbW92ZUZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG59XG4iXX0=