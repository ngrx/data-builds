(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-data-without-effects.module", ["require", "exports", "tslib", "@angular/core", "@ngrx/store", "@ngrx/data/src/utils/correlation-id-generator", "@ngrx/data/src/dispatchers/entity-dispatcher-default-options", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/dispatchers/entity-cache-dispatcher", "@ngrx/data/src/selectors/entity-cache-selector", "@ngrx/data/src/entity-services/entity-collection-service-elements-factory", "@ngrx/data/src/entity-services/entity-collection-service-factory", "@ngrx/data/src/entity-services/entity-services", "@ngrx/data/src/reducers/entity-collection-creator", "@ngrx/data/src/reducers/entity-collection-reducer", "@ngrx/data/src/reducers/entity-collection-reducer-methods", "@ngrx/data/src/reducers/entity-collection-reducer-registry", "@ngrx/data/src/dispatchers/entity-dispatcher-factory", "@ngrx/data/src/entity-metadata/entity-definition.service", "@ngrx/data/src/reducers/entity-cache-reducer", "@ngrx/data/src/reducers/constants", "@ngrx/data/src/utils/default-logger", "@ngrx/data/src/selectors/entity-selectors", "@ngrx/data/src/selectors/entity-selectors$", "@ngrx/data/src/entity-services/entity-services-base", "@ngrx/data/src/entity-services/entity-services-elements", "@ngrx/data/src/utils/interfaces"], factory);
    }
})(function (require, exports) {
    "use strict";
    var EntityDataModuleWithoutEffects_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const store_1 = require("@ngrx/store");
    const correlation_id_generator_1 = require("@ngrx/data/src/utils/correlation-id-generator");
    const entity_dispatcher_default_options_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher-default-options");
    const entity_action_factory_1 = require("@ngrx/data/src/actions/entity-action-factory");
    const entity_cache_dispatcher_1 = require("@ngrx/data/src/dispatchers/entity-cache-dispatcher");
    const entity_cache_selector_1 = require("@ngrx/data/src/selectors/entity-cache-selector");
    const entity_collection_service_elements_factory_1 = require("@ngrx/data/src/entity-services/entity-collection-service-elements-factory");
    const entity_collection_service_factory_1 = require("@ngrx/data/src/entity-services/entity-collection-service-factory");
    const entity_services_1 = require("@ngrx/data/src/entity-services/entity-services");
    const entity_collection_creator_1 = require("@ngrx/data/src/reducers/entity-collection-creator");
    const entity_collection_reducer_1 = require("@ngrx/data/src/reducers/entity-collection-reducer");
    const entity_collection_reducer_methods_1 = require("@ngrx/data/src/reducers/entity-collection-reducer-methods");
    const entity_collection_reducer_registry_1 = require("@ngrx/data/src/reducers/entity-collection-reducer-registry");
    const entity_dispatcher_factory_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher-factory");
    const entity_definition_service_1 = require("@ngrx/data/src/entity-metadata/entity-definition.service");
    const entity_cache_reducer_1 = require("@ngrx/data/src/reducers/entity-cache-reducer");
    const constants_1 = require("@ngrx/data/src/reducers/constants");
    const default_logger_1 = require("@ngrx/data/src/utils/default-logger");
    const entity_selectors_1 = require("@ngrx/data/src/selectors/entity-selectors");
    const entity_selectors_2 = require("@ngrx/data/src/selectors/entity-selectors$");
    const entity_services_base_1 = require("@ngrx/data/src/entity-services/entity-services-base");
    const entity_services_elements_1 = require("@ngrx/data/src/entity-services/entity-services-elements");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
    const ɵ0 = constants_1.ENTITY_CACHE_NAME;
    exports.ɵ0 = ɵ0;
    /**
     * Module without effects or dataservices which means no HTTP calls
     * This module helpful for internal testing.
     * Also helpful for apps that handle server access on their own and
     * therefore opt-out of @ngrx/effects for entities
     */
    let EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects_1 = class EntityDataModuleWithoutEffects {
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
            const key = entityCacheName || constants_1.ENTITY_CACHE_NAME;
            initialState =
                typeof initialState === 'function' ? initialState() : initialState;
            const reducers = (metaReducers || []).map(mr => {
                return mr instanceof core_1.InjectionToken ? injector.get(mr) : mr;
            });
            this.entityCacheFeature = {
                key,
                reducers: entityCacheReducerFactory.create(),
                reducerFactory: store_1.combineReducers,
                initialState: initialState || {},
                metaReducers: reducers,
            };
            reducerManager.addFeature(this.entityCacheFeature);
        }
        static forRoot(config) {
            return {
                ngModule: EntityDataModuleWithoutEffects_1,
                providers: [
                    {
                        provide: constants_1.ENTITY_CACHE_META_REDUCERS,
                        useValue: config.entityCacheMetaReducers
                            ? config.entityCacheMetaReducers
                            : [],
                    },
                    {
                        provide: constants_1.ENTITY_COLLECTION_META_REDUCERS,
                        useValue: config.entityCollectionMetaReducers
                            ? config.entityCollectionMetaReducers
                            : [],
                    },
                    {
                        provide: interfaces_1.PLURAL_NAMES_TOKEN,
                        multi: true,
                        useValue: config.pluralNames ? config.pluralNames : {},
                    },
                ],
            };
        }
        ngOnDestroy() {
            this.reducerManager.removeFeature(this.entityCacheFeature);
        }
    };
    EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects_1 = tslib_1.__decorate([
        core_1.NgModule({
            imports: [
                store_1.StoreModule,
            ],
            providers: [
                correlation_id_generator_1.CorrelationIdGenerator,
                entity_dispatcher_default_options_1.EntityDispatcherDefaultOptions,
                entity_action_factory_1.EntityActionFactory,
                entity_cache_dispatcher_1.EntityCacheDispatcher,
                entity_cache_reducer_1.EntityCacheReducerFactory,
                entity_cache_selector_1.entityCacheSelectorProvider,
                entity_collection_creator_1.EntityCollectionCreator,
                entity_collection_reducer_1.EntityCollectionReducerFactory,
                entity_collection_reducer_methods_1.EntityCollectionReducerMethodsFactory,
                entity_collection_reducer_registry_1.EntityCollectionReducerRegistry,
                entity_collection_service_elements_factory_1.EntityCollectionServiceElementsFactory,
                entity_collection_service_factory_1.EntityCollectionServiceFactory,
                entity_definition_service_1.EntityDefinitionService,
                entity_dispatcher_factory_1.EntityDispatcherFactory,
                entity_selectors_1.EntitySelectorsFactory,
                entity_selectors_2.EntitySelectors$Factory,
                entity_services_elements_1.EntityServicesElements,
                { provide: constants_1.ENTITY_CACHE_NAME_TOKEN, useValue: ɵ0 },
                { provide: entity_services_1.EntityServices, useClass: entity_services_base_1.EntityServicesBase },
                { provide: interfaces_1.Logger, useClass: default_logger_1.DefaultLogger },
            ],
        }),
        tslib_1.__param(3, core_1.Optional()),
        tslib_1.__param(3, core_1.Inject(constants_1.ENTITY_CACHE_NAME_TOKEN)),
        tslib_1.__param(4, core_1.Optional()),
        tslib_1.__param(4, core_1.Inject(constants_1.INITIAL_ENTITY_CACHE_STATE)),
        tslib_1.__param(5, core_1.Optional()),
        tslib_1.__param(5, core_1.Inject(constants_1.ENTITY_CACHE_META_REDUCERS)),
        tslib_1.__metadata("design:paramtypes", [store_1.ReducerManager,
            entity_cache_reducer_1.EntityCacheReducerFactory,
            core_1.Injector, String, Object, Array])
    ], EntityDataModuleWithoutEffects);
    exports.EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUEsd0NBUXVCO0lBRXZCLHVDQU1xQjtJQUVyQiw0RkFBMEU7SUFDMUUsb0hBQWlHO0lBRWpHLHdGQUFzRTtJQUV0RSxnR0FBOEU7SUFDOUUsMEZBQWdGO0lBQ2hGLDBJQUFzSDtJQUN0SCx3SEFBcUc7SUFDckcsb0ZBQW1FO0lBRW5FLGlHQUErRTtJQUMvRSxpR0FBc0Y7SUFDdEYsaUhBQXFHO0lBQ3JHLG1IQUFnRztJQUNoRyxvR0FBa0Y7SUFDbEYsd0dBQXNGO0lBRXRGLHVGQUE0RTtJQUM1RSxpRUFNOEI7SUFFOUIsd0VBQXVEO0lBQ3ZELGdGQUFzRTtJQUN0RSxpRkFBd0U7SUFDeEUsOEZBQTRFO0lBQzVFLHNHQUFvRjtJQUNwRixnRUFBZ0U7ZUF5Q2QsNkJBQWlCOztJQTVCbkU7Ozs7O09BS0c7SUE0QkgsSUFBYSw4QkFBOEIsc0NBQTNDLE1BQWEsOEJBQThCO1FBOEJ6QyxZQUNVLGNBQThCLEVBQ3RDLHlCQUFvRCxFQUM1QyxRQUFrQjtRQUMxQixrQkFBa0I7UUFHVixlQUF1QixFQUd2QixZQUFpQixFQUdqQixZQUUrQztZQWQvQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7WUFFOUIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtZQUlsQixvQkFBZSxHQUFmLGVBQWUsQ0FBUTtZQUd2QixpQkFBWSxHQUFaLFlBQVksQ0FBSztZQUdqQixpQkFBWSxHQUFaLFlBQVksQ0FFbUM7WUFFdkQscURBQXFEO1lBQ3JELGtEQUFrRDtZQUNsRCxNQUFNLEdBQUcsR0FBRyxlQUFlLElBQUksNkJBQWlCLENBQUM7WUFFakQsWUFBWTtnQkFDVixPQUFPLFlBQVks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akIsOEJBQThCLENBeUUxQztJQXpFWSx3RUFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIGNvbWJpbmVSZWR1Y2VycyxcbiAgTWV0YVJlZHVjZXIsXG4gIFJlZHVjZXJNYW5hZ2VyLFxuICBTdG9yZU1vZHVsZSxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBDb3JyZWxhdGlvbklkR2VuZXJhdG9yIH0gZnJvbSAnLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZURpc3BhdGNoZXIgfSBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1jYWNoZS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IGVudGl0eUNhY2hlU2VsZWN0b3JQcm92aWRlciB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZWxlbWVudHMtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItbWV0aG9kcyc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLXJlZ2lzdHJ5JztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IH0gZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlNZXRhZGF0YU1hcCB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5IH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY2FjaGUtcmVkdWNlcic7XG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfTkFNRSxcbiAgRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4sXG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICBJTklUSUFMX0VOVElUWV9DQUNIRV9TVEFURSxcbn0gZnJvbSAnLi9yZWR1Y2Vycy9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBEZWZhdWx0TG9nZ2VyIH0gZnJvbSAnLi91dGlscy9kZWZhdWx0LWxvZ2dlcic7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB9IGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzQmFzZSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcy1iYXNlJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtZWxlbWVudHMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFNb2R1bGVDb25maWcge1xuICBlbnRpdHlNZXRhZGF0YT86IEVudGl0eU1ldGFkYXRhTWFwO1xuICBlbnRpdHlDYWNoZU1ldGFSZWR1Y2Vycz86IChcbiAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPj4pW107XG4gIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnM/OiBNZXRhUmVkdWNlcjxFbnRpdHlDb2xsZWN0aW9uLCBFbnRpdHlBY3Rpb24+W107XG4gIC8vIEluaXRpYWwgRW50aXR5Q2FjaGUgc3RhdGUgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhhdCBzdGF0ZVxuICBpbml0aWFsRW50aXR5Q2FjaGVTdGF0ZT86IEVudGl0eUNhY2hlIHwgKCgpID0+IEVudGl0eUNhY2hlKTtcbiAgcGx1cmFsTmFtZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuLyoqXG4gKiBNb2R1bGUgd2l0aG91dCBlZmZlY3RzIG9yIGRhdGFzZXJ2aWNlcyB3aGljaCBtZWFucyBubyBIVFRQIGNhbGxzXG4gKiBUaGlzIG1vZHVsZSBoZWxwZnVsIGZvciBpbnRlcm5hbCB0ZXN0aW5nLlxuICogQWxzbyBoZWxwZnVsIGZvciBhcHBzIHRoYXQgaGFuZGxlIHNlcnZlciBhY2Nlc3Mgb24gdGhlaXIgb3duIGFuZFxuICogdGhlcmVmb3JlIG9wdC1vdXQgb2YgQG5ncngvZWZmZWN0cyBmb3IgZW50aXRpZXNcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIFN0b3JlTW9kdWxlLCAvLyByZWx5IG9uIFN0b3JlIGZlYXR1cmUgcHJvdmlkZXJzIHJhdGhlciB0aGFuIFN0b3JlLmZvckZlYXR1cmUoKVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBDb3JyZWxhdGlvbklkR2VuZXJhdG9yLFxuICAgIEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGlzcGF0Y2hlcixcbiAgICBFbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LFxuICAgIGVudGl0eUNhY2hlU2VsZWN0b3JQcm92aWRlcixcbiAgICBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvcixcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlclJlZ2lzdHJ5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSxcbiAgICBFbnRpdHlEZWZpbml0aW9uU2VydmljZSxcbiAgICBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICBFbnRpdHlTZWxlY3RvcnNGYWN0b3J5LFxuICAgIEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LFxuICAgIEVudGl0eVNlcnZpY2VzRWxlbWVudHMsXG4gICAgeyBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTiwgdXNlVmFsdWU6IEVOVElUWV9DQUNIRV9OQU1FIH0sXG4gICAgeyBwcm92aWRlOiBFbnRpdHlTZXJ2aWNlcywgdXNlQ2xhc3M6IEVudGl0eVNlcnZpY2VzQmFzZSB9LFxuICAgIHsgcHJvdmlkZTogTG9nZ2VyLCB1c2VDbGFzczogRGVmYXVsdExvZ2dlciB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVudGl0eUNhY2hlRmVhdHVyZTogYW55O1xuXG4gIHN0YXRpYyBmb3JSb290KFxuICAgIGNvbmZpZzogRW50aXR5RGF0YU1vZHVsZUNvbmZpZ1xuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cz4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUExVUkFMX05BTUVTX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcucGx1cmFsTmFtZXMgPyBjb25maWcucGx1cmFsTmFtZXMgOiB7fSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVkdWNlck1hbmFnZXI6IFJlZHVjZXJNYW5hZ2VyLFxuICAgIGVudGl0eUNhY2hlUmVkdWNlckZhY3Rvcnk6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgLy8gb3B0aW9uYWwgcGFyYW1zXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOKVxuICAgIHByaXZhdGUgZW50aXR5Q2FjaGVOYW1lOiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KElOSVRJQUxfRU5USVRZX0NBQ0hFX1NUQVRFKVxuICAgIHByaXZhdGUgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTKVxuICAgIHByaXZhdGUgbWV0YVJlZHVjZXJzOiAoXG4gICAgICB8IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+XG4gICAgICB8IEluamVjdGlvblRva2VuPE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+PilbXVxuICApIHtcbiAgICAvLyBBZGQgdGhlIEBuZ3J4L2RhdGEgZmVhdHVyZSB0byB0aGUgU3RvcmUncyBmZWF0dXJlc1xuICAgIC8vIGFzIFN0b3JlLmZvckZlYXR1cmUgZG9lcyBmb3IgU3RvcmVGZWF0dXJlTW9kdWxlXG4gICAgY29uc3Qga2V5ID0gZW50aXR5Q2FjaGVOYW1lIHx8IEVOVElUWV9DQUNIRV9OQU1FO1xuXG4gICAgaW5pdGlhbFN0YXRlID1cbiAgICAgIHR5cGVvZiBpbml0aWFsU3RhdGUgPT09ICdmdW5jdGlvbicgPyBpbml0aWFsU3RhdGUoKSA6IGluaXRpYWxTdGF0ZTtcblxuICAgIGNvbnN0IHJlZHVjZXJzOiBNZXRhUmVkdWNlcjxFbnRpdHlDYWNoZSwgQWN0aW9uPltdID0gKFxuICAgICAgbWV0YVJlZHVjZXJzIHx8IFtdXG4gICAgKS5tYXAobXIgPT4ge1xuICAgICAgcmV0dXJuIG1yIGluc3RhbmNlb2YgSW5qZWN0aW9uVG9rZW4gPyBpbmplY3Rvci5nZXQobXIpIDogbXI7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSA9IHtcbiAgICAgIGtleSxcbiAgICAgIHJlZHVjZXJzOiBlbnRpdHlDYWNoZVJlZHVjZXJGYWN0b3J5LmNyZWF0ZSgpLFxuICAgICAgcmVkdWNlckZhY3Rvcnk6IGNvbWJpbmVSZWR1Y2VycyxcbiAgICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlIHx8IHt9LFxuICAgICAgbWV0YVJlZHVjZXJzOiByZWR1Y2VycyxcbiAgICB9O1xuICAgIHJlZHVjZXJNYW5hZ2VyLmFkZEZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZWR1Y2VyTWFuYWdlci5yZW1vdmVGZWF0dXJlKHRoaXMuZW50aXR5Q2FjaGVGZWF0dXJlKTtcbiAgfVxufVxuIl19