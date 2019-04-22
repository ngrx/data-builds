/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class EntityDataModule {
    /**
     * @param {?} effectSources
     * @param {?} entityCacheEffects
     * @param {?} entityEffects
     */
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
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: EntityDataModule,
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
    }
    /**
     * Add another class instance that contains \@Effect methods.
     * @param {?} effectSourceInstance a class instance that implements effects.
     * Warning: undocumented \@ngrx/effects API
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.effectSources.addEffects(effectSourceInstance);
    }
}
EntityDataModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
/** @nocollapse */
EntityDataModule.ctorParameters = () => [
    { type: EffectSources },
    { type: EntityCacheEffects },
    { type: EntityEffects }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityDataModule.prototype.effectSources;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRWhGLE9BQU8sRUFDTCwrQkFBK0IsRUFDL0Isd0JBQXdCLEdBQ3pCLE1BQU0sbURBQW1ELENBQUM7QUFFM0QsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixnQkFBZ0IsR0FDakIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNsRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFMUUsT0FBTyxFQUNMLDBCQUEwQixFQUMxQiwrQkFBK0IsR0FDaEMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFL0QsT0FBTyxFQUVMLDhCQUE4QixHQUMvQixNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7QUEwQjlDLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7OztJQW1DM0IsWUFDVSxhQUE0QixFQUNwQyxrQkFBc0MsRUFDdEMsYUFBNEI7UUFGcEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFJcEMsMEVBQTBFO1FBQzFFLHFFQUFxRTtRQUNyRSwwREFBMEQ7UUFDMUQsRUFBRTtRQUNGLHlFQUF5RTtRQUN6RSxtRUFBbUU7UUFDbkUsNkRBQTZEO1FBQzdELCtGQUErRjtRQUMvRixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7OztJQWpERCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQThCO1FBQzNDLE9BQU87WUFDTCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRTtnQkFDVCxrRUFBa0U7Z0JBQ2xFLDZDQUE2QztnQkFDN0Msc0JBQXNCO2dCQUN0QixpQkFBaUI7Z0JBQ2pCO29CQUNFLE9BQU8sRUFBRSxxQkFBcUI7b0JBQzlCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUM3RDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsMEJBQTBCO29CQUNuQyxRQUFRLEVBQUUsTUFBTSxDQUFDLHVCQUF1Qjt3QkFDdEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ2hDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSwrQkFBK0I7b0JBQ3hDLFFBQVEsRUFBRSxNQUFNLENBQUMsNEJBQTRCO3dCQUMzQyxDQUFDLENBQUMsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDckMsQ0FBQyxDQUFDLEVBQUU7aUJBQ1A7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGtCQUFrQjtvQkFDM0IsS0FBSyxFQUFFLElBQUk7b0JBQ1gsUUFBUSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQ3ZEO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7Ozs7OztJQXdCRCxVQUFVLENBQUMsb0JBQXlCO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdEQsQ0FBQzs7O1lBOUVGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsOEJBQThCO29CQUM5QixhQUFhO2lCQUNkO2dCQUNELFNBQVMsRUFBRTtvQkFDVCx5QkFBeUI7b0JBQ3pCLHNCQUFzQjtvQkFDdEIsaUJBQWlCO29CQUNqQixrQkFBa0I7b0JBQ2xCLGFBQWE7b0JBQ2IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO29CQUNoRTt3QkFDRSxPQUFPLEVBQUUsd0JBQXdCO3dCQUNqQyxRQUFRLEVBQUUsK0JBQStCO3FCQUMxQztvQkFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO2lCQUNyRDthQUNGOzs7O1lBeER1QixhQUFhO1lBZTVCLGtCQUFrQjtZQUVsQixhQUFhOzs7Ozs7O0lBNEVsQix5Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFZmZlY3RzTW9kdWxlLCBFZmZlY3RTb3VyY2VzIH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5cbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZSc7XG5cbmltcG9ydCB7XG4gIERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbn0gZnJvbSAnLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmltcG9ydCB7XG4gIERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yLFxuICBIdHRwVXJsR2VuZXJhdG9yLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9odHRwLXVybC1nZW5lcmF0b3InO1xuXG5pbXBvcnQgeyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMnO1xuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMnO1xuXG5pbXBvcnQgeyBFTlRJVFlfTUVUQURBVEFfVE9LRU4gfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktbWV0YWRhdGEnO1xuXG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbn0gZnJvbSAnLi9yZWR1Y2Vycy9jb25zdGFudHMnO1xuaW1wb3J0IHsgUGx1cmFsaXplciwgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi91dGlscy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IERlZmF1bHRQbHVyYWxpemVyIH0gZnJvbSAnLi91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXInO1xuXG5pbXBvcnQge1xuICBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnLFxuICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG59IGZyb20gJy4vZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZSc7XG5cbi8qKlxuICogZW50aXR5LWRhdGEgbWFpbiBtb2R1bGUgaW5jbHVkZXMgZWZmZWN0cyBhbmQgSFRUUCBkYXRhIHNlcnZpY2VzXG4gKiBDb25maWd1cmUgd2l0aCBgZm9yUm9vdGAuXG4gKiBObyBgZm9yRmVhdHVyZWAgeWV0LlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxuICAgIEVmZmVjdHNNb2R1bGUsIC8vIGRvIG5vdCBzdXBwbHkgZWZmZWN0cyBiZWNhdXNlIGNhbid0IHJlcGxhY2UgbGF0ZXJcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSxcbiAgICBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlLFxuICAgIEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICBFbnRpdHlFZmZlY3RzLFxuICAgIHsgcHJvdmlkZTogSHR0cFVybEdlbmVyYXRvciwgdXNlQ2xhc3M6IERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgICAgdXNlQ2xhc3M6IERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgfSxcbiAgICB7IHByb3ZpZGU6IFBsdXJhbGl6ZXIsIHVzZUNsYXNzOiBEZWZhdWx0UGx1cmFsaXplciB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIC8vIFRPRE86IE1vdmVkIHRoZXNlIGVmZmVjdHMgY2xhc3NlcyB1cCB0byBFbnRpdHlEYXRhTW9kdWxlIGl0c2VsZlxuICAgICAgICAvLyBSZW1vdmUgdGhpcyBjb21tZW50IGlmIHRoYXQgd2FzIGEgbWlzdGFrZS5cbiAgICAgICAgLy8gRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgICAgICAvLyBFbnRpdHlFZmZlY3RzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX01FVEFEQVRBX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5TWV0YWRhdGEgPyBjb25maWcuZW50aXR5TWV0YWRhdGEgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBQTFVSQUxfTkFNRVNfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5wbHVyYWxOYW1lcyA/IGNvbmZpZy5wbHVyYWxOYW1lcyA6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlZmZlY3RTb3VyY2VzOiBFZmZlY3RTb3VyY2VzLFxuICAgIGVudGl0eUNhY2hlRWZmZWN0czogRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIGVudGl0eUVmZmVjdHM6IEVudGl0eUVmZmVjdHNcbiAgKSB7XG4gICAgLy8gV2UgY2FuJ3QgdXNlIGBmb3JGZWF0dXJlKClgIGJlY2F1c2UsIGlmIHdlIGRpZCwgdGhlIGRldmVsb3BlciBjb3VsZCBub3RcbiAgICAvLyByZXBsYWNlIHRoZSBlbnRpdHktZGF0YSBgRW50aXR5RWZmZWN0c2Agd2l0aCBhIGN1c3RvbSBhbHRlcm5hdGl2ZS5cbiAgICAvLyBSZXBsYWNpbmcgdGhhdCBjbGFzcyBpcyBhbiBleHRlbnNpYmlsaXR5IHBvaW50IHdlIG5lZWQuXG4gICAgLy9cbiAgICAvLyBUaGUgRkVBVFVSRV9FRkZFQ1RTIHRva2VuIGlzIG5vdCBleHBvc2VkLCBzbyBjYW4ndCB1c2UgdGhhdCB0ZWNobmlxdWUuXG4gICAgLy8gV2FybmluZzogdGhpcyBhbHRlcm5hdGl2ZSBhcHByb2FjaCByZWxpZXMgb24gYW4gdW5kb2N1bWVudGVkIEFQSVxuICAgIC8vIHRvIGFkZCBlZmZlY3QgZGlyZWN0bHkgcmF0aGVyIHRoYW4gdGhyb3VnaCBgZm9yRmVhdHVyZSgpYC5cbiAgICAvLyBUaGUgZGFuZ2VyIGlzIHRoYXQgRWZmZWN0c01vZHVsZS5mb3JGZWF0dXJlIGV2b2x2ZXMgYW5kIHdlIG5vIGxvbmdlciBwZXJmb3JtIGEgY3J1Y2lhbCBzdGVwLlxuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlDYWNoZUVmZmVjdHMpO1xuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlFZmZlY3RzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW5vdGhlciBjbGFzcyBpbnN0YW5jZSB0aGF0IGNvbnRhaW5zIEBFZmZlY3QgbWV0aG9kcy5cbiAgICogQHBhcmFtIGVmZmVjdFNvdXJjZUluc3RhbmNlIGEgY2xhc3MgaW5zdGFuY2UgdGhhdCBpbXBsZW1lbnRzIGVmZmVjdHMuXG4gICAqIFdhcm5pbmc6IHVuZG9jdW1lbnRlZCBAbmdyeC9lZmZlY3RzIEFQSVxuICAgKi9cbiAgYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZTogYW55KSB7XG4gICAgdGhpcy5lZmZlY3RTb3VyY2VzLmFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2UpO1xuICB9XG59XG4iXX0=