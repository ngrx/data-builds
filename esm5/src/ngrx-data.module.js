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
import { NgrxDataModuleWithoutEffects, } from './ngrx-data-without-effects.module';
/**
 * Ngrx-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
var NgrxDataModule = /** @class */ (function () {
    function NgrxDataModule(effectSources, entityCacheEffects, entityEffects) {
        this.effectSources = effectSources;
        // We can't use `forFeature()` because, if we did, the developer could not
        // replace the ngrx-data `EntityEffects` with a custom alternative.
        // Replacing that class is an extensibility point we need.
        //
        // The FEATURE_EFFECTS token is not exposed, so can't use that technique.
        // Warning: this alternative approach relies on an undocumented API
        // to add effect directly rather than through `forFeature()`.
        // The danger is that EffectsModule.forFeature evolves and we no longer perform a crucial step.
        this.addEffects(entityCacheEffects);
        this.addEffects(entityEffects);
    }
    NgrxDataModule_1 = NgrxDataModule;
    NgrxDataModule.forRoot = function (config) {
        return {
            ngModule: NgrxDataModule_1,
            providers: [
                // TODO: Moved these effects classes up to NgrxDataModule itself
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
    NgrxDataModule.prototype.addEffects = function (effectSourceInstance) {
        this.effectSources.addEffects(effectSourceInstance);
    };
    var NgrxDataModule_1;
    NgrxDataModule = NgrxDataModule_1 = tslib_1.__decorate([
        NgModule({
            imports: [
                NgrxDataModuleWithoutEffects,
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
    ], NgrxDataModule);
    return NgrxDataModule;
}());
export { NgrxDataModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdyeC1kYXRhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvbmdyeC1kYXRhLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFaEYsT0FBTyxFQUNMLCtCQUErQixFQUMvQix3QkFBd0IsR0FDekIsTUFBTSxtREFBbUQsQ0FBQztBQUUzRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGdCQUFnQixHQUNqQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUUxRSxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLCtCQUErQixHQUNoQyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUvRCxPQUFPLEVBRUwsNEJBQTRCLEdBQzdCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUM7Ozs7R0FJRztBQW9CSDtJQW1DRSx3QkFDVSxhQUE0QixFQUNwQyxrQkFBc0MsRUFDdEMsYUFBNEI7UUFGcEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFJcEMsMEVBQTBFO1FBQzFFLG1FQUFtRTtRQUNuRSwwREFBMEQ7UUFDMUQsRUFBRTtRQUNGLHlFQUF5RTtRQUN6RSxtRUFBbUU7UUFDbkUsNkRBQTZEO1FBQzdELCtGQUErRjtRQUMvRixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqQyxDQUFDO3VCQWxEVSxjQUFjO0lBQ2xCLHNCQUFPLEdBQWQsVUFBZSxNQUE0QjtRQUN6QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFjO1lBQ3hCLFNBQVMsRUFBRTtnQkFDVCxnRUFBZ0U7Z0JBQ2hFLDZDQUE2QztnQkFDN0Msc0JBQXNCO2dCQUN0QixpQkFBaUI7Z0JBQ2pCO29CQUNFLE9BQU8sRUFBRSxxQkFBcUI7b0JBQzlCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUM3RDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsMEJBQTBCO29CQUNuQyxRQUFRLEVBQUUsTUFBTSxDQUFDLHVCQUF1Qjt3QkFDdEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ2hDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSwrQkFBK0I7b0JBQ3hDLFFBQVEsRUFBRSxNQUFNLENBQUMsNEJBQTRCO3dCQUMzQyxDQUFDLENBQUMsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDckMsQ0FBQyxDQUFDLEVBQUU7aUJBQ1A7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGtCQUFrQjtvQkFDM0IsS0FBSyxFQUFFLElBQUk7b0JBQ1gsUUFBUSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQ3ZEO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQW1CRDs7OztPQUlHO0lBQ0gsbUNBQVUsR0FBVixVQUFXLG9CQUF5QjtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3RELENBQUM7O0lBM0RVLGNBQWM7UUFuQjFCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRTtnQkFDUCw0QkFBNEI7Z0JBQzVCLGFBQWE7YUFDZDtZQUNELFNBQVMsRUFBRTtnQkFDVCx5QkFBeUI7Z0JBQ3pCLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO2dCQUNoRTtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxRQUFRLEVBQUUsK0JBQStCO2lCQUMxQztnQkFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO2FBQ3JEO1NBQ0YsQ0FBQztpREFxQ3lCLGFBQWE7WUFDaEIsa0JBQWtCO1lBQ3ZCLGFBQWE7T0F0Q25CLGNBQWMsQ0E0RDFCO0lBQUQscUJBQUM7Q0FBQSxBQTVERCxJQTREQztTQTVEWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRWZmZWN0c01vZHVsZSwgRWZmZWN0U291cmNlcyB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBEZWZhdWx0SHR0cFVybEdlbmVyYXRvcixcbiAgSHR0cFVybEdlbmVyYXRvcixcbn0gZnJvbSAnLi9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuaW1wb3J0IHsgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1jYWNoZS1lZmZlY3RzJztcbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1lZmZlY3RzJztcblxuaW1wb3J0IHsgRU5USVRZX01FVEFEQVRBX1RPS0VOIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhJztcblxuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gIEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG59IGZyb20gJy4vcmVkdWNlcnMvY29uc3RhbnRzJztcbmltcG9ydCB7IFBsdXJhbGl6ZXIsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEZWZhdWx0UGx1cmFsaXplciB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdC1wbHVyYWxpemVyJztcblxuaW1wb3J0IHtcbiAgTmdyeERhdGFNb2R1bGVDb25maWcsXG4gIE5ncnhEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG59IGZyb20gJy4vbmdyeC1kYXRhLXdpdGhvdXQtZWZmZWN0cy5tb2R1bGUnO1xuXG4vKipcbiAqIE5ncngtZGF0YSBtYWluIG1vZHVsZSBpbmNsdWRlcyBlZmZlY3RzIGFuZCBIVFRQIGRhdGEgc2VydmljZXNcbiAqIENvbmZpZ3VyZSB3aXRoIGBmb3JSb290YC5cbiAqIE5vIGBmb3JGZWF0dXJlYCB5ZXQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOZ3J4RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxuICAgIEVmZmVjdHNNb2R1bGUsIC8vIGRvIG5vdCBzdXBwbHkgZWZmZWN0cyBiZWNhdXNlIGNhbid0IHJlcGxhY2UgbGF0ZXJcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSxcbiAgICBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlLFxuICAgIEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICBFbnRpdHlFZmZlY3RzLFxuICAgIHsgcHJvdmlkZTogSHR0cFVybEdlbmVyYXRvciwgdXNlQ2xhc3M6IERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgICAgdXNlQ2xhc3M6IERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgfSxcbiAgICB7IHByb3ZpZGU6IFBsdXJhbGl6ZXIsIHVzZUNsYXNzOiBEZWZhdWx0UGx1cmFsaXplciB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3J4RGF0YU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogTmdyeERhdGFNb2R1bGVDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5ncnhEYXRhTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIC8vIFRPRE86IE1vdmVkIHRoZXNlIGVmZmVjdHMgY2xhc3NlcyB1cCB0byBOZ3J4RGF0YU1vZHVsZSBpdHNlbGZcbiAgICAgICAgLy8gUmVtb3ZlIHRoaXMgY29tbWVudCBpZiB0aGF0IHdhcyBhIG1pc3Rha2UuXG4gICAgICAgIC8vIEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICAgICAgLy8gRW50aXR5RWZmZWN0cyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9NRVRBREFUQV9UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eU1ldGFkYXRhID8gY29uZmlnLmVudGl0eU1ldGFkYXRhIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUExVUkFMX05BTUVTX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcucGx1cmFsTmFtZXMgPyBjb25maWcucGx1cmFsTmFtZXMgOiB7fSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWZmZWN0U291cmNlczogRWZmZWN0U291cmNlcyxcbiAgICBlbnRpdHlDYWNoZUVmZmVjdHM6IEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICBlbnRpdHlFZmZlY3RzOiBFbnRpdHlFZmZlY3RzXG4gICkge1xuICAgIC8vIFdlIGNhbid0IHVzZSBgZm9yRmVhdHVyZSgpYCBiZWNhdXNlLCBpZiB3ZSBkaWQsIHRoZSBkZXZlbG9wZXIgY291bGQgbm90XG4gICAgLy8gcmVwbGFjZSB0aGUgbmdyeC1kYXRhIGBFbnRpdHlFZmZlY3RzYCB3aXRoIGEgY3VzdG9tIGFsdGVybmF0aXZlLlxuICAgIC8vIFJlcGxhY2luZyB0aGF0IGNsYXNzIGlzIGFuIGV4dGVuc2liaWxpdHkgcG9pbnQgd2UgbmVlZC5cbiAgICAvL1xuICAgIC8vIFRoZSBGRUFUVVJFX0VGRkVDVFMgdG9rZW4gaXMgbm90IGV4cG9zZWQsIHNvIGNhbid0IHVzZSB0aGF0IHRlY2huaXF1ZS5cbiAgICAvLyBXYXJuaW5nOiB0aGlzIGFsdGVybmF0aXZlIGFwcHJvYWNoIHJlbGllcyBvbiBhbiB1bmRvY3VtZW50ZWQgQVBJXG4gICAgLy8gdG8gYWRkIGVmZmVjdCBkaXJlY3RseSByYXRoZXIgdGhhbiB0aHJvdWdoIGBmb3JGZWF0dXJlKClgLlxuICAgIC8vIFRoZSBkYW5nZXIgaXMgdGhhdCBFZmZlY3RzTW9kdWxlLmZvckZlYXR1cmUgZXZvbHZlcyBhbmQgd2Ugbm8gbG9uZ2VyIHBlcmZvcm0gYSBjcnVjaWFsIHN0ZXAuXG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUNhY2hlRWZmZWN0cyk7XG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUVmZmVjdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm90aGVyIGNsYXNzIGluc3RhbmNlIHRoYXQgY29udGFpbnMgQEVmZmVjdCBtZXRob2RzLlxuICAgKiBAcGFyYW0gZWZmZWN0U291cmNlSW5zdGFuY2UgYSBjbGFzcyBpbnN0YW5jZSB0aGF0IGltcGxlbWVudHMgZWZmZWN0cy5cbiAgICogV2FybmluZzogdW5kb2N1bWVudGVkIEBuZ3J4L2VmZmVjdHMgQVBJXG4gICAqL1xuICBhZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgICB0aGlzLmVmZmVjdFNvdXJjZXMuYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZSk7XG4gIH1cbn1cbiJdfQ==