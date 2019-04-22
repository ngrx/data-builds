import * as tslib_1 from "tslib";
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
     * Add another class instance that contains @Effect methods.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    EntityDataModule.prototype.addEffects = function (effectSourceInstance) {
        this.effectSources.addEffects(effectSourceInstance);
    };
    var EntityDataModule_1;
    EntityDataModule = EntityDataModule_1 = tslib_1.__decorate([
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
        tslib_1.__metadata("design:paramtypes", [EffectSources,
            EntityCacheEffects,
            EntityEffects])
    ], EntityDataModule);
    return EntityDataModule;
}());
export { EntityDataModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRWhGLE9BQU8sRUFDTCwrQkFBK0IsRUFDL0Isd0JBQXdCLEdBQ3pCLE1BQU0sbURBQW1ELENBQUM7QUFFM0QsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixnQkFBZ0IsR0FDakIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNsRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFMUUsT0FBTyxFQUNMLDBCQUEwQixFQUMxQiwrQkFBK0IsR0FDaEMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFL0QsT0FBTyxFQUVMLDhCQUE4QixHQUMvQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDOzs7O0dBSUc7QUFvQkg7SUFtQ0UsMEJBQ1UsYUFBNEIsRUFDcEMsa0JBQXNDLEVBQ3RDLGFBQTRCO1FBRnBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBSXBDLDBFQUEwRTtRQUMxRSxxRUFBcUU7UUFDckUsMERBQTBEO1FBQzFELEVBQUU7UUFDRix5RUFBeUU7UUFDekUsbUVBQW1FO1FBQ25FLDZEQUE2RDtRQUM3RCwrRkFBK0Y7UUFDL0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakMsQ0FBQzt5QkFsRFUsZ0JBQWdCO0lBQ3BCLHdCQUFPLEdBQWQsVUFBZSxNQUE4QjtRQUMzQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGtCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFO2dCQUNsRSw2Q0FBNkM7Z0JBQzdDLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQjtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDN0Q7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLDBCQUEwQjtvQkFDbkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ3RDLENBQUMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCO3dCQUNoQyxDQUFDLENBQUMsRUFBRTtpQkFDUDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxRQUFRLEVBQUUsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEI7d0JBQ3JDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFtQkQ7Ozs7T0FJRztJQUNILHFDQUFVLEdBQVYsVUFBVyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN0RCxDQUFDOztJQTNEVSxnQkFBZ0I7UUFuQjVCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRTtnQkFDUCw4QkFBOEI7Z0JBQzlCLGFBQWE7YUFDZDtZQUNELFNBQVMsRUFBRTtnQkFDVCx5QkFBeUI7Z0JBQ3pCLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO2dCQUNoRTtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxRQUFRLEVBQUUsK0JBQStCO2lCQUMxQztnQkFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO2FBQ3JEO1NBQ0YsQ0FBQztpREFxQ3lCLGFBQWE7WUFDaEIsa0JBQWtCO1lBQ3ZCLGFBQWE7T0F0Q25CLGdCQUFnQixDQTRENUI7SUFBRCx1QkFBQztDQUFBLEFBNURELElBNERDO1NBNURZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVmZmVjdHNNb2R1bGUsIEVmZmVjdFNvdXJjZXMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IsXG4gIEh0dHBVcmxHZW5lcmF0b3IsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktY2FjaGUtZWZmZWN0cyc7XG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5RWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktZWZmZWN0cyc7XG5cbmltcG9ydCB7IEVOVElUWV9NRVRBREFUQV9UT0tFTiB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQbHVyYWxpemVyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGVmYXVsdFBsdXJhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5cbmltcG9ydCB7XG4gIEVudGl0eURhdGFNb2R1bGVDb25maWcsXG4gIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbn0gZnJvbSAnLi9lbnRpdHktZGF0YS13aXRob3V0LWVmZmVjdHMubW9kdWxlJztcblxuLyoqXG4gKiBlbnRpdHktZGF0YSBtYWluIG1vZHVsZSBpbmNsdWRlcyBlZmZlY3RzIGFuZCBIVFRQIGRhdGEgc2VydmljZXNcbiAqIENvbmZpZ3VyZSB3aXRoIGBmb3JSb290YC5cbiAqIE5vIGBmb3JGZWF0dXJlYCB5ZXQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgRWZmZWN0c01vZHVsZSwgLy8gZG8gbm90IHN1cHBseSBlZmZlY3RzIGJlY2F1c2UgY2FuJ3QgcmVwbGFjZSBsYXRlclxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIEVudGl0eUVmZmVjdHMsXG4gICAgeyBwcm92aWRlOiBIdHRwVXJsR2VuZXJhdG9yLCB1c2VDbGFzczogRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgICB1c2VDbGFzczogRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICB9LFxuICAgIHsgcHJvdmlkZTogUGx1cmFsaXplciwgdXNlQ2xhc3M6IERlZmF1bHRQbHVyYWxpemVyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgLy8gVE9ETzogTW92ZWQgdGhlc2UgZWZmZWN0cyBjbGFzc2VzIHVwIHRvIEVudGl0eURhdGFNb2R1bGUgaXRzZWxmXG4gICAgICAgIC8vIFJlbW92ZSB0aGlzIGNvbW1lbnQgaWYgdGhhdCB3YXMgYSBtaXN0YWtlLlxuICAgICAgICAvLyBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgICAgIC8vIEVudGl0eUVmZmVjdHMsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlNZXRhZGF0YSA/IGNvbmZpZy5lbnRpdHlNZXRhZGF0YSA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFBMVVJBTF9OQU1FU19UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLnBsdXJhbE5hbWVzID8gY29uZmlnLnBsdXJhbE5hbWVzIDoge30sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVmZmVjdFNvdXJjZXM6IEVmZmVjdFNvdXJjZXMsXG4gICAgZW50aXR5Q2FjaGVFZmZlY3RzOiBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgZW50aXR5RWZmZWN0czogRW50aXR5RWZmZWN0c1xuICApIHtcbiAgICAvLyBXZSBjYW4ndCB1c2UgYGZvckZlYXR1cmUoKWAgYmVjYXVzZSwgaWYgd2UgZGlkLCB0aGUgZGV2ZWxvcGVyIGNvdWxkIG5vdFxuICAgIC8vIHJlcGxhY2UgdGhlIGVudGl0eS1kYXRhIGBFbnRpdHlFZmZlY3RzYCB3aXRoIGEgY3VzdG9tIGFsdGVybmF0aXZlLlxuICAgIC8vIFJlcGxhY2luZyB0aGF0IGNsYXNzIGlzIGFuIGV4dGVuc2liaWxpdHkgcG9pbnQgd2UgbmVlZC5cbiAgICAvL1xuICAgIC8vIFRoZSBGRUFUVVJFX0VGRkVDVFMgdG9rZW4gaXMgbm90IGV4cG9zZWQsIHNvIGNhbid0IHVzZSB0aGF0IHRlY2huaXF1ZS5cbiAgICAvLyBXYXJuaW5nOiB0aGlzIGFsdGVybmF0aXZlIGFwcHJvYWNoIHJlbGllcyBvbiBhbiB1bmRvY3VtZW50ZWQgQVBJXG4gICAgLy8gdG8gYWRkIGVmZmVjdCBkaXJlY3RseSByYXRoZXIgdGhhbiB0aHJvdWdoIGBmb3JGZWF0dXJlKClgLlxuICAgIC8vIFRoZSBkYW5nZXIgaXMgdGhhdCBFZmZlY3RzTW9kdWxlLmZvckZlYXR1cmUgZXZvbHZlcyBhbmQgd2Ugbm8gbG9uZ2VyIHBlcmZvcm0gYSBjcnVjaWFsIHN0ZXAuXG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUNhY2hlRWZmZWN0cyk7XG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUVmZmVjdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm90aGVyIGNsYXNzIGluc3RhbmNlIHRoYXQgY29udGFpbnMgQEVmZmVjdCBtZXRob2RzLlxuICAgKiBAcGFyYW0gZWZmZWN0U291cmNlSW5zdGFuY2UgYSBjbGFzcyBpbnN0YW5jZSB0aGF0IGltcGxlbWVudHMgZWZmZWN0cy5cbiAgICogV2FybmluZzogdW5kb2N1bWVudGVkIEBuZ3J4L2VmZmVjdHMgQVBJXG4gICAqL1xuICBhZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgICB0aGlzLmVmZmVjdFNvdXJjZXMuYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZSk7XG4gIH1cbn1cbiJdfQ==