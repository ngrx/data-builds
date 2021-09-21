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
     * Add another class instance that contains effects.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    addEffects(effectSourceInstance) {
        this.effectSources.addEffects(effectSourceInstance);
    }
}
/** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
EntityDataModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    EntityDataModuleWithoutEffects,
                    EffectsModule, // do not supply effects because can't replace later
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
/**
 * @type {function(): !Array<(null|{
 *   type: ?,
 *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
 * })>}
 * @nocollapse
 */
EntityDataModule.ctorParameters = () => [
    { type: EffectSources },
    { type: EntityCacheEffects },
    { type: EntityEffects }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFaEYsT0FBTyxFQUNMLCtCQUErQixFQUMvQix3QkFBd0IsR0FDekIsTUFBTSxtREFBbUQsQ0FBQztBQUUzRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGdCQUFnQixHQUNqQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUUxRSxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLCtCQUErQixHQUNoQyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUvRCxPQUFPLEVBRUwsOEJBQThCLEdBQy9CLE1BQU0sc0NBQXNDLENBQUM7QUFFOUM7Ozs7R0FJRztBQW9CSCxNQUFNLE9BQU8sZ0JBQWdCO0lBcUMzQixZQUNVLGFBQTRCLEVBQ3BDLGtCQUFzQyxFQUN0QyxhQUE0QjtRQUZwQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUlwQywwRUFBMEU7UUFDMUUscUVBQXFFO1FBQ3JFLDBEQUEwRDtRQUMxRCxFQUFFO1FBQ0YseUVBQXlFO1FBQ3pFLG1FQUFtRTtRQUNuRSw2REFBNkQ7UUFDN0QsK0ZBQStGO1FBQy9GLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFuREQsTUFBTSxDQUFDLE9BQU8sQ0FDWixNQUE4QjtRQUU5QixPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFO2dCQUNsRSw2Q0FBNkM7Z0JBQzdDLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQjtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDN0Q7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLDBCQUEwQjtvQkFDbkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ3RDLENBQUMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCO3dCQUNoQyxDQUFDLENBQUMsRUFBRTtpQkFDUDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxRQUFRLEVBQUUsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEI7d0JBQ3JDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFtQkQ7Ozs7T0FJRztJQUNILFVBQVUsQ0FBQyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7O1lBaEZGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsOEJBQThCO29CQUM5QixhQUFhLEVBQUUsb0RBQW9EO2lCQUNwRTtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QseUJBQXlCO29CQUN6QixzQkFBc0I7b0JBQ3RCLGlCQUFpQjtvQkFDakIsa0JBQWtCO29CQUNsQixhQUFhO29CQUNiLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBRTtvQkFDaEU7d0JBQ0UsT0FBTyxFQUFFLHdCQUF3Qjt3QkFDakMsUUFBUSxFQUFFLCtCQUErQjtxQkFDMUM7b0JBQ0QsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRTtpQkFDckQ7YUFDRjs7Ozs7Ozs7OztZQXhEdUIsYUFBYTtZQWU1QixrQkFBa0I7WUFFbEIsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVmZmVjdHNNb2R1bGUsIEVmZmVjdFNvdXJjZXMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IsXG4gIEh0dHBVcmxHZW5lcmF0b3IsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL2h0dHAtdXJsLWdlbmVyYXRvcic7XG5cbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktY2FjaGUtZWZmZWN0cyc7XG5pbXBvcnQgeyBFbnRpdHlEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5RWZmZWN0cyB9IGZyb20gJy4vZWZmZWN0cy9lbnRpdHktZWZmZWN0cyc7XG5cbmltcG9ydCB7IEVOVElUWV9NRVRBREFUQV9UT0tFTiB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1tZXRhZGF0YSc7XG5cbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQbHVyYWxpemVyLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGVmYXVsdFBsdXJhbGl6ZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5cbmltcG9ydCB7XG4gIEVudGl0eURhdGFNb2R1bGVDb25maWcsXG4gIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbn0gZnJvbSAnLi9lbnRpdHktZGF0YS13aXRob3V0LWVmZmVjdHMubW9kdWxlJztcblxuLyoqXG4gKiBlbnRpdHktZGF0YSBtYWluIG1vZHVsZSBpbmNsdWRlcyBlZmZlY3RzIGFuZCBIVFRQIGRhdGEgc2VydmljZXNcbiAqIENvbmZpZ3VyZSB3aXRoIGBmb3JSb290YC5cbiAqIE5vIGBmb3JGZWF0dXJlYCB5ZXQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgRWZmZWN0c01vZHVsZSwgLy8gZG8gbm90IHN1cHBseSBlZmZlY3RzIGJlY2F1c2UgY2FuJ3QgcmVwbGFjZSBsYXRlclxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eUNhY2hlRGF0YVNlcnZpY2UsXG4gICAgRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIEVudGl0eUVmZmVjdHMsXG4gICAgeyBwcm92aWRlOiBIdHRwVXJsR2VuZXJhdG9yLCB1c2VDbGFzczogRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgICB1c2VDbGFzczogRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICB9LFxuICAgIHsgcHJvdmlkZTogUGx1cmFsaXplciwgdXNlQ2xhc3M6IERlZmF1bHRQbHVyYWxpemVyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChcbiAgICBjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWdcbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxFbnRpdHlEYXRhTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIC8vIFRPRE86IE1vdmVkIHRoZXNlIGVmZmVjdHMgY2xhc3NlcyB1cCB0byBFbnRpdHlEYXRhTW9kdWxlIGl0c2VsZlxuICAgICAgICAvLyBSZW1vdmUgdGhpcyBjb21tZW50IGlmIHRoYXQgd2FzIGEgbWlzdGFrZS5cbiAgICAgICAgLy8gRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgICAgICAvLyBFbnRpdHlFZmZlY3RzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX01FVEFEQVRBX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5TWV0YWRhdGEgPyBjb25maWcuZW50aXR5TWV0YWRhdGEgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBQTFVSQUxfTkFNRVNfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5wbHVyYWxOYW1lcyA/IGNvbmZpZy5wbHVyYWxOYW1lcyA6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlZmZlY3RTb3VyY2VzOiBFZmZlY3RTb3VyY2VzLFxuICAgIGVudGl0eUNhY2hlRWZmZWN0czogRW50aXR5Q2FjaGVFZmZlY3RzLFxuICAgIGVudGl0eUVmZmVjdHM6IEVudGl0eUVmZmVjdHNcbiAgKSB7XG4gICAgLy8gV2UgY2FuJ3QgdXNlIGBmb3JGZWF0dXJlKClgIGJlY2F1c2UsIGlmIHdlIGRpZCwgdGhlIGRldmVsb3BlciBjb3VsZCBub3RcbiAgICAvLyByZXBsYWNlIHRoZSBlbnRpdHktZGF0YSBgRW50aXR5RWZmZWN0c2Agd2l0aCBhIGN1c3RvbSBhbHRlcm5hdGl2ZS5cbiAgICAvLyBSZXBsYWNpbmcgdGhhdCBjbGFzcyBpcyBhbiBleHRlbnNpYmlsaXR5IHBvaW50IHdlIG5lZWQuXG4gICAgLy9cbiAgICAvLyBUaGUgRkVBVFVSRV9FRkZFQ1RTIHRva2VuIGlzIG5vdCBleHBvc2VkLCBzbyBjYW4ndCB1c2UgdGhhdCB0ZWNobmlxdWUuXG4gICAgLy8gV2FybmluZzogdGhpcyBhbHRlcm5hdGl2ZSBhcHByb2FjaCByZWxpZXMgb24gYW4gdW5kb2N1bWVudGVkIEFQSVxuICAgIC8vIHRvIGFkZCBlZmZlY3QgZGlyZWN0bHkgcmF0aGVyIHRoYW4gdGhyb3VnaCBgZm9yRmVhdHVyZSgpYC5cbiAgICAvLyBUaGUgZGFuZ2VyIGlzIHRoYXQgRWZmZWN0c01vZHVsZS5mb3JGZWF0dXJlIGV2b2x2ZXMgYW5kIHdlIG5vIGxvbmdlciBwZXJmb3JtIGEgY3J1Y2lhbCBzdGVwLlxuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlDYWNoZUVmZmVjdHMpO1xuICAgIHRoaXMuYWRkRWZmZWN0cyhlbnRpdHlFZmZlY3RzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW5vdGhlciBjbGFzcyBpbnN0YW5jZSB0aGF0IGNvbnRhaW5zIGVmZmVjdHMuXG4gICAqIEBwYXJhbSBlZmZlY3RTb3VyY2VJbnN0YW5jZSBhIGNsYXNzIGluc3RhbmNlIHRoYXQgaW1wbGVtZW50cyBlZmZlY3RzLlxuICAgKiBXYXJuaW5nOiB1bmRvY3VtZW50ZWQgQG5ncngvZWZmZWN0cyBBUElcbiAgICovXG4gIGFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2U6IGFueSkge1xuICAgIHRoaXMuZWZmZWN0U291cmNlcy5hZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlKTtcbiAgfVxufVxuIl19