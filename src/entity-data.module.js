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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBLHdDQUE4RDtJQUU5RCwyQ0FBNkQ7SUFFN0QsMkZBQWdGO0lBRWhGLHVIQUcyRDtJQUUzRCx1RkFHMkM7SUFFM0MscUdBQWtGO0lBQ2xGLHNGQUFvRTtJQUNwRSx5RkFBdUU7SUFDdkUsMEVBQXlEO0lBRXpELG9GQUEwRTtJQUUxRSxpRUFHOEI7SUFDOUIsZ0VBQW9FO0lBQ3BFLGdGQUErRDtJQUUvRCwwR0FHOEM7SUFFOUM7Ozs7T0FJRztJQW9CSCxJQUFhLGdCQUFnQix3QkFBN0IsTUFBYSxnQkFBZ0I7UUFtQzNCLFlBQ1UsYUFBNEIsRUFDcEMsa0JBQXNDLEVBQ3RDLGFBQTRCO1lBRnBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1lBSXBDLDBFQUEwRTtZQUMxRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELEVBQUU7WUFDRix5RUFBeUU7WUFDekUsbUVBQW1FO1lBQ25FLDZEQUE2RDtZQUM3RCwrRkFBK0Y7WUFDL0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQWpERCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQThCO1lBQzNDLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLGtCQUFnQjtnQkFDMUIsU0FBUyxFQUFFO29CQUNULGtFQUFrRTtvQkFDbEUsNkNBQTZDO29CQUM3QyxzQkFBc0I7b0JBQ3RCLGlCQUFpQjtvQkFDakI7d0JBQ0UsT0FBTyxFQUFFLHVDQUFxQjt3QkFDOUIsS0FBSyxFQUFFLElBQUk7d0JBQ1gsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7cUJBQzdEO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxzQ0FBMEI7d0JBQ25DLFFBQVEsRUFBRSxNQUFNLENBQUMsdUJBQXVCOzRCQUN0QyxDQUFDLENBQUMsTUFBTSxDQUFDLHVCQUF1Qjs0QkFDaEMsQ0FBQyxDQUFDLEVBQUU7cUJBQ1A7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLDJDQUErQjt3QkFDeEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyw0QkFBNEI7NEJBQzNDLENBQUMsQ0FBQyxNQUFNLENBQUMsNEJBQTRCOzRCQUNyQyxDQUFDLENBQUMsRUFBRTtxQkFDUDtvQkFDRDt3QkFDRSxPQUFPLEVBQUUsK0JBQWtCO3dCQUMzQixLQUFLLEVBQUUsSUFBSTt3QkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDdkQ7aUJBQ0Y7YUFDRixDQUFDO1FBQ0osQ0FBQztRQW1CRDs7OztXQUlHO1FBQ0gsVUFBVSxDQUFDLG9CQUF5QjtZQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RELENBQUM7S0FDRixDQUFBO0lBNURZLGdCQUFnQjtRQW5CNUIsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLG1FQUE4QjtnQkFDOUIsdUJBQWE7YUFDZDtZQUNELFNBQVMsRUFBRTtnQkFDVCxnREFBeUI7Z0JBQ3pCLGtEQUFzQjtnQkFDdEIsdUNBQWlCO2dCQUNqQix5Q0FBa0I7Z0JBQ2xCLDhCQUFhO2dCQUNiLEVBQUUsT0FBTyxFQUFFLHFDQUFnQixFQUFFLFFBQVEsRUFBRSw0Q0FBdUIsRUFBRTtnQkFDaEU7b0JBQ0UsT0FBTyxFQUFFLDZEQUF3QjtvQkFDakMsUUFBUSxFQUFFLG9FQUErQjtpQkFDMUM7Z0JBQ0QsRUFBRSxPQUFPLEVBQUUsdUJBQVUsRUFBRSxRQUFRLEVBQUUsc0NBQWlCLEVBQUU7YUFDckQ7U0FDRixDQUFDO2lEQXFDeUIsdUJBQWE7WUFDaEIseUNBQWtCO1lBQ3ZCLDhCQUFhO09BdENuQixnQkFBZ0IsQ0E0RDVCO0lBNURZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVmZmVjdHNNb2R1bGUsIEVmZmVjdFNvdXJjZXMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IsXG4gIEh0dHBVcmxHZW5lcmF0b3IsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktY2FjaGUtZWZmZWN0cyc7XG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5RWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktZWZmZWN0cyc7XG5cbmltcG9ydCB7IEVOVElUWV9NRVRBREFUQV9UT0tFTiB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQbHVyYWxpemVyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGVmYXVsdFBsdXJhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5cbmltcG9ydCB7XG4gIEVudGl0eURhdGFNb2R1bGVDb25maWcsXG4gIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbn0gZnJvbSAnLi9lbnRpdHktZGF0YS13aXRob3V0LWVmZmVjdHMubW9kdWxlJztcblxuLyoqXG4gKiBlbnRpdHktZGF0YSBtYWluIG1vZHVsZSBpbmNsdWRlcyBlZmZlY3RzIGFuZCBIVFRQIGRhdGEgc2VydmljZXNcbiAqIENvbmZpZ3VyZSB3aXRoIGBmb3JSb290YC5cbiAqIE5vIGBmb3JGZWF0dXJlYCB5ZXQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgRWZmZWN0c01vZHVsZSwgLy8gZG8gbm90IHN1cHBseSBlZmZlY3RzIGJlY2F1c2UgY2FuJ3QgcmVwbGFjZSBsYXRlclxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIEVudGl0eUVmZmVjdHMsXG4gICAgeyBwcm92aWRlOiBIdHRwVXJsR2VuZXJhdG9yLCB1c2VDbGFzczogRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgICB1c2VDbGFzczogRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICB9LFxuICAgIHsgcHJvdmlkZTogUGx1cmFsaXplciwgdXNlQ2xhc3M6IERlZmF1bHRQbHVyYWxpemVyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgLy8gVE9ETzogTW92ZWQgdGhlc2UgZWZmZWN0cyBjbGFzc2VzIHVwIHRvIEVudGl0eURhdGFNb2R1bGUgaXRzZWxmXG4gICAgICAgIC8vIFJlbW92ZSB0aGlzIGNvbW1lbnQgaWYgdGhhdCB3YXMgYSBtaXN0YWtlLlxuICAgICAgICAvLyBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgICAgIC8vIEVudGl0eUVmZmVjdHMsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlNZXRhZGF0YSA/IGNvbmZpZy5lbnRpdHlNZXRhZGF0YSA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFBMVVJBTF9OQU1FU19UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLnBsdXJhbE5hbWVzID8gY29uZmlnLnBsdXJhbE5hbWVzIDoge30sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVmZmVjdFNvdXJjZXM6IEVmZmVjdFNvdXJjZXMsXG4gICAgZW50aXR5Q2FjaGVFZmZlY3RzOiBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgZW50aXR5RWZmZWN0czogRW50aXR5RWZmZWN0c1xuICApIHtcbiAgICAvLyBXZSBjYW4ndCB1c2UgYGZvckZlYXR1cmUoKWAgYmVjYXVzZSwgaWYgd2UgZGlkLCB0aGUgZGV2ZWxvcGVyIGNvdWxkIG5vdFxuICAgIC8vIHJlcGxhY2UgdGhlIGVudGl0eS1kYXRhIGBFbnRpdHlFZmZlY3RzYCB3aXRoIGEgY3VzdG9tIGFsdGVybmF0aXZlLlxuICAgIC8vIFJlcGxhY2luZyB0aGF0IGNsYXNzIGlzIGFuIGV4dGVuc2liaWxpdHkgcG9pbnQgd2UgbmVlZC5cbiAgICAvL1xuICAgIC8vIFRoZSBGRUFUVVJFX0VGRkVDVFMgdG9rZW4gaXMgbm90IGV4cG9zZWQsIHNvIGNhbid0IHVzZSB0aGF0IHRlY2huaXF1ZS5cbiAgICAvLyBXYXJuaW5nOiB0aGlzIGFsdGVybmF0aXZlIGFwcHJvYWNoIHJlbGllcyBvbiBhbiB1bmRvY3VtZW50ZWQgQVBJXG4gICAgLy8gdG8gYWRkIGVmZmVjdCBkaXJlY3RseSByYXRoZXIgdGhhbiB0aHJvdWdoIGBmb3JGZWF0dXJlKClgLlxuICAgIC8vIFRoZSBkYW5nZXIgaXMgdGhhdCBFZmZlY3RzTW9kdWxlLmZvckZlYXR1cmUgZXZvbHZlcyBhbmQgd2Ugbm8gbG9uZ2VyIHBlcmZvcm0gYSBjcnVjaWFsIHN0ZXAuXG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUNhY2hlRWZmZWN0cyk7XG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUVmZmVjdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm90aGVyIGNsYXNzIGluc3RhbmNlIHRoYXQgY29udGFpbnMgZWZmZWN0cy5cbiAgICogQHBhcmFtIGVmZmVjdFNvdXJjZUluc3RhbmNlIGEgY2xhc3MgaW5zdGFuY2UgdGhhdCBpbXBsZW1lbnRzIGVmZmVjdHMuXG4gICAqIFdhcm5pbmc6IHVuZG9jdW1lbnRlZCBAbmdyeC9lZmZlY3RzIEFQSVxuICAgKi9cbiAgYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZTogYW55KSB7XG4gICAgdGhpcy5lZmZlY3RTb3VyY2VzLmFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2UpO1xuICB9XG59XG4iXX0=