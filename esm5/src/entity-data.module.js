import { __decorate, __metadata } from "tslib";
import { NgModule } from '@angular/core';
import { EffectsModule, EffectSources } from '@ngrx/effects';
import { DefaultDataServiceFactory } from './dataservices/default-data.service';
import { DefaultPersistenceResultHandler, PersistenceResultHandler, } from './dataservices/persistence-result-handler.service';
import { DefaultHttpUrlGenerator, HttpUrlGenerator, } from './dataservices/http-url-generator';
import { EntityCacheDataService } from './dataservices/entity-cache-data.service';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityDataService } from './dataservices/entity-data.service';
import { EntityEffects } from './effects/entity-effects';
import { ENTITY_METADATA_TOKEN } from './entity-metadata/entity-metadata';
import { ENTITY_CACHE_META_REDUCERS, ENTITY_COLLECTION_META_REDUCERS, } from './reducers/constants';
import { Pluralizer, PLURAL_NAMES_TOKEN } from './utils/interfaces';
import { DefaultPluralizer } from './utils/default-pluralizer';
import { EntityDataModuleWithoutEffects, } from './entity-data-without-effects.module';
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
var EntityDataModule = /** @class */ (function () {
    function EntityDataModule(effectSources, entityCacheEffects, entityEffects) {
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
    EntityDataModule_1 = EntityDataModule;
    EntityDataModule.forRoot = function (config) {
        return {
            ngModule: EntityDataModule_1,
            providers: [
                // TODO: Moved these effects classes up to EntityDataModule itself
                // Remove this comment if that was a mistake.
                // EntityCacheEffects,
                // EntityEffects,
                {
                    provide: ENTITY_METADATA_TOKEN,
                    multi: true,
                    useValue: config.entityMetadata ? config.entityMetadata : [],
                },
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
    /**
     * Add another class instance that contains effects.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    EntityDataModule.prototype.addEffects = function (effectSourceInstance) {
        this.effectSources.addEffects(effectSourceInstance);
    };
    var EntityDataModule_1;
    EntityDataModule = EntityDataModule_1 = __decorate([
        NgModule({
            imports: [
                EntityDataModuleWithoutEffects,
                EffectsModule,
            ],
            providers: [
                DefaultDataServiceFactory,
                EntityCacheDataService,
                EntityDataService,
                EntityCacheEffects,
                EntityEffects,
                { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
                {
                    provide: PersistenceResultHandler,
                    useClass: DefaultPersistenceResultHandler,
                },
                { provide: Pluralizer, useClass: DefaultPluralizer },
            ],
        }),
        __metadata("design:paramtypes", [EffectSources,
            EntityCacheEffects,
            EntityEffects])
    ], EntityDataModule);
    return EntityDataModule;
}());
export { EntityDataModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRWhGLE9BQU8sRUFDTCwrQkFBK0IsRUFDL0Isd0JBQXdCLEdBQ3pCLE1BQU0sbURBQW1ELENBQUM7QUFFM0QsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixnQkFBZ0IsR0FDakIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNsRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFMUUsT0FBTyxFQUNMLDBCQUEwQixFQUMxQiwrQkFBK0IsR0FDaEMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFL0QsT0FBTyxFQUVMLDhCQUE4QixHQUMvQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDOzs7O0dBSUc7QUFvQkg7SUFxQ0UsMEJBQ1UsYUFBNEIsRUFDcEMsa0JBQXNDLEVBQ3RDLGFBQTRCO1FBRnBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBSXBDLDBFQUEwRTtRQUMxRSxxRUFBcUU7UUFDckUsMERBQTBEO1FBQzFELEVBQUU7UUFDRix5RUFBeUU7UUFDekUsbUVBQW1FO1FBQ25FLDZEQUE2RDtRQUM3RCwrRkFBK0Y7UUFDL0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakMsQ0FBQzt5QkFwRFUsZ0JBQWdCO0lBQ3BCLHdCQUFPLEdBQWQsVUFDRSxNQUE4QjtRQUU5QixPQUFPO1lBQ0wsUUFBUSxFQUFFLGtCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFO2dCQUNsRSw2Q0FBNkM7Z0JBQzdDLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQjtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDN0Q7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLDBCQUEwQjtvQkFDbkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ3RDLENBQUMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCO3dCQUNoQyxDQUFDLENBQUMsRUFBRTtpQkFDUDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxRQUFRLEVBQUUsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEI7d0JBQ3JDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFtQkQ7Ozs7T0FJRztJQUNILHFDQUFVLEdBQVYsVUFBVyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN0RCxDQUFDOztJQTdEVSxnQkFBZ0I7UUFuQjVCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRTtnQkFDUCw4QkFBOEI7Z0JBQzlCLGFBQWE7YUFDZDtZQUNELFNBQVMsRUFBRTtnQkFDVCx5QkFBeUI7Z0JBQ3pCLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO2dCQUNoRTtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxRQUFRLEVBQUUsK0JBQStCO2lCQUMxQztnQkFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO2FBQ3JEO1NBQ0YsQ0FBQzt5Q0F1Q3lCLGFBQWE7WUFDaEIsa0JBQWtCO1lBQ3ZCLGFBQWE7T0F4Q25CLGdCQUFnQixDQThENUI7SUFBRCx1QkFBQztDQUFBLEFBOURELElBOERDO1NBOURZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVmZmVjdHNNb2R1bGUsIEVmZmVjdFNvdXJjZXMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IsXG4gIEh0dHBVcmxHZW5lcmF0b3IsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktY2FjaGUtZWZmZWN0cyc7XG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5RWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktZWZmZWN0cyc7XG5cbmltcG9ydCB7IEVOVElUWV9NRVRBREFUQV9UT0tFTiB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQbHVyYWxpemVyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGVmYXVsdFBsdXJhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5cbmltcG9ydCB7XG4gIEVudGl0eURhdGFNb2R1bGVDb25maWcsXG4gIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbn0gZnJvbSAnLi9lbnRpdHktZGF0YS13aXRob3V0LWVmZmVjdHMubW9kdWxlJztcblxuLyoqXG4gKiBlbnRpdHktZGF0YSBtYWluIG1vZHVsZSBpbmNsdWRlcyBlZmZlY3RzIGFuZCBIVFRQIGRhdGEgc2VydmljZXNcbiAqIENvbmZpZ3VyZSB3aXRoIGBmb3JSb290YC5cbiAqIE5vIGBmb3JGZWF0dXJlYCB5ZXQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgRWZmZWN0c01vZHVsZSwgLy8gZG8gbm90IHN1cHBseSBlZmZlY3RzIGJlY2F1c2UgY2FuJ3QgcmVwbGFjZSBsYXRlclxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIEVudGl0eUVmZmVjdHMsXG4gICAgeyBwcm92aWRlOiBIdHRwVXJsR2VuZXJhdG9yLCB1c2VDbGFzczogRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgICB1c2VDbGFzczogRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICB9LFxuICAgIHsgcHJvdmlkZTogUGx1cmFsaXplciwgdXNlQ2xhc3M6IERlZmF1bHRQbHVyYWxpemVyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChcbiAgICBjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWdcbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxFbnRpdHlEYXRhTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIC8vIFRPRE86IE1vdmVkIHRoZXNlIGVmZmVjdHMgY2xhc3NlcyB1cCB0byBFbnRpdHlEYXRhTW9kdWxlIGl0c2VsZlxuICAgICAgICAvLyBSZW1vdmUgdGhpcyBjb21tZW50IGlmIHRoYXQgd2FzIGEgbWlzdGFrZS5cbiAgICAgICAgLy8gRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgICAgICAvLyBFbnRpdHlFZmZlY3RzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX01FVEFEQVRBX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5TWV0YWRhdGEgPyBjb25maWcuZW50aXR5TWV0YWRhdGEgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBQTFVSQUxfTkFNRVNfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5wbHVyYWxOYW1lcyA/IGNvbmZpZy5wbHVyYWxOYW1lcyA6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlZmZlY3RTb3VyY2VzOiBFZmZlY3RTb3VyY2VzLFxuICAgIGVudGl0eUNhY2hlRWZmZWN0czogRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIGVudGl0eUVmZmVjdHM6IEVudGl0eUVmZmVjdHNcbiAgKSB7XG4gICAgLy8gV2UgY2FuJ3QgdXNlIGBmb3JGZWF0dXJlKClgIGJlY2F1c2UsIGlmIHdlIGRpZCwgdGhlIGRldmVsb3BlciBjb3VsZCBub3RcbiAgICAvLyByZXBsYWNlIHRoZSBlbnRpdHktZGF0YSBgRW50aXR5RWZmZWN0c2Agd2l0aCBhIGN1c3RvbSBhbHRlcm5hdGl2ZS5cbiAgICAvLyBSZXBsYWNpbmcgdGhhdCBjbGFzcyBpcyBhbiBleHRlbnNpYmlsaXR5IHBvaW50IHdlIG5lZWQuXG4gICAgLy9cbiAgICAvLyBUaGUgRkVBVFVSRV9FRkZFQ1RTIHRva2VuIGlzIG5vdCBleHBvc2VkLCBzbyBjYW4ndCB1c2UgdGhhdCB0ZWNobmlxdWUuXG4gICAgLy8gV2FybmluZzogdGhpcyBhbHRlcm5hdGl2ZSBhcHByb2FjaCByZWxpZXMgb24gYW4gdW5kb2N1bWVudGVkIEFQSVxuICAgIC8vIHRvIGFkZCBlZmZlY3QgZGlyZWN0bHkgcmF0aGVyIHRoYW4gdGhyb3VnaCBgZm9yRmVhdHVyZSgpYC5cbiAgICAvLyBUaGUgZGFuZ2VyIGlzIHRoYXQgRWZmZWN0c01vZHVsZS5mb3JGZWF0dXJlIGV2b2x2ZXMgYW5kIHdlIG5vIGxvbmdlciBwZXJmb3JtIGEgY3J1Y2lhbCBzdGVwLlxuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlDYWNoZUVmZmVjdHMpO1xuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlFZmZlY3RzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW5vdGhlciBjbGFzcyBpbnN0YW5jZSB0aGF0IGNvbnRhaW5zIGVmZmVjdHMuXG4gICAqIEBwYXJhbSBlZmZlY3RTb3VyY2VJbnN0YW5jZSBhIGNsYXNzIGluc3RhbmNlIHRoYXQgaW1wbGVtZW50cyBlZmZlY3RzLlxuICAgKiBXYXJuaW5nOiB1bmRvY3VtZW50ZWQgQG5ncngvZWZmZWN0cyBBUElcbiAgICovXG4gIGFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2U6IGFueSkge1xuICAgIHRoaXMuZWZmZWN0U291cmNlcy5hZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlKTtcbiAgfVxufVxuIl19