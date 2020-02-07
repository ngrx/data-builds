(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-data.module", ["require", "exports", "tslib", "@angular/core", "@ngrx/effects", "@ngrx/data/src/dataservices/default-data.service", "@ngrx/data/src/dataservices/persistence-result-handler.service", "@ngrx/data/src/dataservices/http-url-generator", "@ngrx/data/src/dataservices/entity-cache-data.service", "@ngrx/data/src/effects/entity-cache-effects", "@ngrx/data/src/dataservices/entity-data.service", "@ngrx/data/src/effects/entity-effects", "@ngrx/data/src/entity-metadata/entity-metadata", "@ngrx/data/src/reducers/constants", "@ngrx/data/src/utils/interfaces", "@ngrx/data/src/utils/default-pluralizer", "@ngrx/data/src/entity-data-without-effects.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    var EntityDataModule_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const effects_1 = require("@ngrx/effects");
    const default_data_service_1 = require("@ngrx/data/src/dataservices/default-data.service");
    const persistence_result_handler_service_1 = require("@ngrx/data/src/dataservices/persistence-result-handler.service");
    const http_url_generator_1 = require("@ngrx/data/src/dataservices/http-url-generator");
    const entity_cache_data_service_1 = require("@ngrx/data/src/dataservices/entity-cache-data.service");
    const entity_cache_effects_1 = require("@ngrx/data/src/effects/entity-cache-effects");
    const entity_data_service_1 = require("@ngrx/data/src/dataservices/entity-data.service");
    const entity_effects_1 = require("@ngrx/data/src/effects/entity-effects");
    const entity_metadata_1 = require("@ngrx/data/src/entity-metadata/entity-metadata");
    const constants_1 = require("@ngrx/data/src/reducers/constants");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
    const default_pluralizer_1 = require("@ngrx/data/src/utils/default-pluralizer");
    const entity_data_without_effects_module_1 = require("@ngrx/data/src/entity-data-without-effects.module");
    /**
     * entity-data main module includes effects and HTTP data services
     * Configure with `forRoot`.
     * No `forFeature` yet.
     */
    let EntityDataModule = EntityDataModule_1 = class EntityDataModule {
        constructor(effectSources, entityCacheEffects, entityEffects) {
            this.effectSources = effectSources;
            // We can't use `forFeature()` because, if we did, the developer could not
            // replace the entity-data `EntityEffects` with a custom alternative.
            // Replacing that class is an extensibility point we need.
            //
            // The FEATURE_EFFECTS token is not exposed, so can't use that technique.
            // Warning: this alternative approach relies on an undocumented API
            // to add effect directly rather than through `forFeature()`.
            // The danger is that EffectsModule.forFeature evolves and we no longer perform a crucial step.
            this.addEffects(entityCacheEffects);
            this.addEffects(entityEffects);
        }
        static forRoot(config) {
            return {
                ngModule: EntityDataModule_1,
                providers: [
                    // TODO: Moved these effects classes up to EntityDataModule itself
                    // Remove this comment if that was a mistake.
                    // EntityCacheEffects,
                    // EntityEffects,
                    {
                        provide: entity_metadata_1.ENTITY_METADATA_TOKEN,
                        multi: true,
                        useValue: config.entityMetadata ? config.entityMetadata : [],
                    },
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
        /**
         * Add another class instance that contains effects.
         * @param effectSourceInstance a class instance that implements effects.
         * Warning: undocumented @ngrx/effects API
         */
        addEffects(effectSourceInstance) {
            this.effectSources.addEffects(effectSourceInstance);
        }
    };
    EntityDataModule = EntityDataModule_1 = tslib_1.__decorate([
        core_1.NgModule({
            imports: [
                entity_data_without_effects_module_1.EntityDataModuleWithoutEffects,
                effects_1.EffectsModule,
            ],
            providers: [
                default_data_service_1.DefaultDataServiceFactory,
                entity_cache_data_service_1.EntityCacheDataService,
                entity_data_service_1.EntityDataService,
                entity_cache_effects_1.EntityCacheEffects,
                entity_effects_1.EntityEffects,
                { provide: http_url_generator_1.HttpUrlGenerator, useClass: http_url_generator_1.DefaultHttpUrlGenerator },
                {
                    provide: persistence_result_handler_service_1.PersistenceResultHandler,
                    useClass: persistence_result_handler_service_1.DefaultPersistenceResultHandler,
                },
                { provide: interfaces_1.Pluralizer, useClass: default_pluralizer_1.DefaultPluralizer },
            ],
        }),
        tslib_1.__metadata("design:paramtypes", [effects_1.EffectSources,
            entity_cache_effects_1.EntityCacheEffects,
            entity_effects_1.EntityEffects])
    ], EntityDataModule);
    exports.EntityDataModule = EntityDataModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBLHdDQUE4RDtJQUU5RCwyQ0FBNkQ7SUFFN0QsMkZBQWdGO0lBRWhGLHVIQUcyRDtJQUUzRCx1RkFHMkM7SUFFM0MscUdBQWtGO0lBQ2xGLHNGQUFvRTtJQUNwRSx5RkFBdUU7SUFDdkUsMEVBQXlEO0lBRXpELG9GQUEwRTtJQUUxRSxpRUFHOEI7SUFDOUIsZ0VBQW9FO0lBQ3BFLGdGQUErRDtJQUUvRCwwR0FHOEM7SUFFOUM7Ozs7T0FJRztJQW9CSCxJQUFhLGdCQUFnQix3QkFBN0IsTUFBYSxnQkFBZ0I7UUFxQzNCLFlBQ1UsYUFBNEIsRUFDcEMsa0JBQXNDLEVBQ3RDLGFBQTRCO1lBRnBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1lBSXBDLDBFQUEwRTtZQUMxRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELEVBQUU7WUFDRix5RUFBeUU7WUFDekUsbUVBQW1FO1lBQ25FLDZEQUE2RDtZQUM3RCwrRkFBK0Y7WUFDL0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQW5ERCxNQUFNLENBQUMsT0FBTyxDQUNaLE1BQThCO1lBRTlCLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLGtCQUFnQjtnQkFDMUIsU0FBUyxFQUFFO29CQUNULGtFQUFrRTtvQkFDbEUsNkNBQTZDO29CQUM3QyxzQkFBc0I7b0JBQ3RCLGlCQUFpQjtvQkFDakI7d0JBQ0UsT0FBTyxFQUFFLHVDQUFxQjt3QkFDOUIsS0FBSyxFQUFFLElBQUk7d0JBQ1gsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7cUJBQzdEO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxzQ0FBMEI7d0JBQ25DLFFBQVEsRUFBRSxNQUFNLENBQUMsdUJBQXVCOzRCQUN0QyxDQUFDLENBQUMsTUFBTSxDQUFDLHVCQUF1Qjs0QkFDaEMsQ0FBQyxDQUFDLEVBQUU7cUJBQ1A7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLDJDQUErQjt3QkFDeEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyw0QkFBNEI7NEJBQzNDLENBQUMsQ0FBQyxNQUFNLENBQUMsNEJBQTRCOzRCQUNyQyxDQUFDLENBQUMsRUFBRTtxQkFDUDtvQkFDRDt3QkFDRSxPQUFPLEVBQUUsK0JBQWtCO3dCQUMzQixLQUFLLEVBQUUsSUFBSTt3QkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDdkQ7aUJBQ0Y7YUFDRixDQUFDO1FBQ0osQ0FBQztRQW1CRDs7OztXQUlHO1FBQ0gsVUFBVSxDQUFDLG9CQUF5QjtZQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RELENBQUM7S0FDRixDQUFBO0lBOURZLGdCQUFnQjtRQW5CNUIsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLG1FQUE4QjtnQkFDOUIsdUJBQWE7YUFDZDtZQUNELFNBQVMsRUFBRTtnQkFDVCxnREFBeUI7Z0JBQ3pCLGtEQUFzQjtnQkFDdEIsdUNBQWlCO2dCQUNqQix5Q0FBa0I7Z0JBQ2xCLDhCQUFhO2dCQUNiLEVBQUUsT0FBTyxFQUFFLHFDQUFnQixFQUFFLFFBQVEsRUFBRSw0Q0FBdUIsRUFBRTtnQkFDaEU7b0JBQ0UsT0FBTyxFQUFFLDZEQUF3QjtvQkFDakMsUUFBUSxFQUFFLG9FQUErQjtpQkFDMUM7Z0JBQ0QsRUFBRSxPQUFPLEVBQUUsdUJBQVUsRUFBRSxRQUFRLEVBQUUsc0NBQWlCLEVBQUU7YUFDckQ7U0FDRixDQUFDO2lEQXVDeUIsdUJBQWE7WUFDaEIseUNBQWtCO1lBQ3ZCLDhCQUFhO09BeENuQixnQkFBZ0IsQ0E4RDVCO0lBOURZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVmZmVjdHNNb2R1bGUsIEVmZmVjdFNvdXJjZXMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IsXG4gIEh0dHBVcmxHZW5lcmF0b3IsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktY2FjaGUtZWZmZWN0cyc7XG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5RWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktZWZmZWN0cyc7XG5cbmltcG9ydCB7IEVOVElUWV9NRVRBREFUQV9UT0tFTiB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQbHVyYWxpemVyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGVmYXVsdFBsdXJhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5cbmltcG9ydCB7XG4gIEVudGl0eURhdGFNb2R1bGVDb25maWcsXG4gIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbn0gZnJvbSAnLi9lbnRpdHktZGF0YS13aXRob3V0LWVmZmVjdHMubW9kdWxlJztcblxuLyoqXG4gKiBlbnRpdHktZGF0YSBtYWluIG1vZHVsZSBpbmNsdWRlcyBlZmZlY3RzIGFuZCBIVFRQIGRhdGEgc2VydmljZXNcbiAqIENvbmZpZ3VyZSB3aXRoIGBmb3JSb290YC5cbiAqIE5vIGBmb3JGZWF0dXJlYCB5ZXQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgRWZmZWN0c01vZHVsZSwgLy8gZG8gbm90IHN1cHBseSBlZmZlY3RzIGJlY2F1c2UgY2FuJ3QgcmVwbGFjZSBsYXRlclxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIEVudGl0eUVmZmVjdHMsXG4gICAgeyBwcm92aWRlOiBIdHRwVXJsR2VuZXJhdG9yLCB1c2VDbGFzczogRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgICB1c2VDbGFzczogRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICB9LFxuICAgIHsgcHJvdmlkZTogUGx1cmFsaXplciwgdXNlQ2xhc3M6IERlZmF1bHRQbHVyYWxpemVyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChcbiAgICBjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWdcbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxFbnRpdHlEYXRhTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIC8vIFRPRE86IE1vdmVkIHRoZXNlIGVmZmVjdHMgY2xhc3NlcyB1cCB0byBFbnRpdHlEYXRhTW9kdWxlIGl0c2VsZlxuICAgICAgICAvLyBSZW1vdmUgdGhpcyBjb21tZW50IGlmIHRoYXQgd2FzIGEgbWlzdGFrZS5cbiAgICAgICAgLy8gRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgICAgICAvLyBFbnRpdHlFZmZlY3RzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX01FVEFEQVRBX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5TWV0YWRhdGEgPyBjb25maWcuZW50aXR5TWV0YWRhdGEgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBQTFVSQUxfTkFNRVNfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5wbHVyYWxOYW1lcyA/IGNvbmZpZy5wbHVyYWxOYW1lcyA6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlZmZlY3RTb3VyY2VzOiBFZmZlY3RTb3VyY2VzLFxuICAgIGVudGl0eUNhY2hlRWZmZWN0czogRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIGVudGl0eUVmZmVjdHM6IEVudGl0eUVmZmVjdHNcbiAgKSB7XG4gICAgLy8gV2UgY2FuJ3QgdXNlIGBmb3JGZWF0dXJlKClgIGJlY2F1c2UsIGlmIHdlIGRpZCwgdGhlIGRldmVsb3BlciBjb3VsZCBub3RcbiAgICAvLyByZXBsYWNlIHRoZSBlbnRpdHktZGF0YSBgRW50aXR5RWZmZWN0c2Agd2l0aCBhIGN1c3RvbSBhbHRlcm5hdGl2ZS5cbiAgICAvLyBSZXBsYWNpbmcgdGhhdCBjbGFzcyBpcyBhbiBleHRlbnNpYmlsaXR5IHBvaW50IHdlIG5lZWQuXG4gICAgLy9cbiAgICAvLyBUaGUgRkVBVFVSRV9FRkZFQ1RTIHRva2VuIGlzIG5vdCBleHBvc2VkLCBzbyBjYW4ndCB1c2UgdGhhdCB0ZWNobmlxdWUuXG4gICAgLy8gV2FybmluZzogdGhpcyBhbHRlcm5hdGl2ZSBhcHByb2FjaCByZWxpZXMgb24gYW4gdW5kb2N1bWVudGVkIEFQSVxuICAgIC8vIHRvIGFkZCBlZmZlY3QgZGlyZWN0bHkgcmF0aGVyIHRoYW4gdGhyb3VnaCBgZm9yRmVhdHVyZSgpYC5cbiAgICAvLyBUaGUgZGFuZ2VyIGlzIHRoYXQgRWZmZWN0c01vZHVsZS5mb3JGZWF0dXJlIGV2b2x2ZXMgYW5kIHdlIG5vIGxvbmdlciBwZXJmb3JtIGEgY3J1Y2lhbCBzdGVwLlxuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlDYWNoZUVmZmVjdHMpO1xuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlFZmZlY3RzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW5vdGhlciBjbGFzcyBpbnN0YW5jZSB0aGF0IGNvbnRhaW5zIGVmZmVjdHMuXG4gICAqIEBwYXJhbSBlZmZlY3RTb3VyY2VJbnN0YW5jZSBhIGNsYXNzIGluc3RhbmNlIHRoYXQgaW1wbGVtZW50cyBlZmZlY3RzLlxuICAgKiBXYXJuaW5nOiB1bmRvY3VtZW50ZWQgQG5ncngvZWZmZWN0cyBBUElcbiAgICovXG4gIGFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2U6IGFueSkge1xuICAgIHRoaXMuZWZmZWN0U291cmNlcy5hZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlKTtcbiAgfVxufVxuIl19