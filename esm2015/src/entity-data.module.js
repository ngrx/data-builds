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
/** @nocollapse */
EntityDataModule.ctorParameters = () => [
    { type: EffectSources },
    { type: EntityCacheEffects },
    { type: EntityEffects }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFaEYsT0FBTyxFQUNMLCtCQUErQixFQUMvQix3QkFBd0IsR0FDekIsTUFBTSxtREFBbUQsQ0FBQztBQUUzRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGdCQUFnQixHQUNqQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUUxRSxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLCtCQUErQixHQUNoQyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUvRCxPQUFPLEVBRUwsOEJBQThCLEdBQy9CLE1BQU0sc0NBQXNDLENBQUM7QUFFOUM7Ozs7R0FJRztBQW9CSCxNQUFNLE9BQU8sZ0JBQWdCO0lBcUMzQixZQUNVLGFBQTRCLEVBQ3BDLGtCQUFzQyxFQUN0QyxhQUE0QjtRQUZwQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUlwQywwRUFBMEU7UUFDMUUscUVBQXFFO1FBQ3JFLDBEQUEwRDtRQUMxRCxFQUFFO1FBQ0YseUVBQXlFO1FBQ3pFLG1FQUFtRTtRQUNuRSw2REFBNkQ7UUFDN0QsK0ZBQStGO1FBQy9GLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFuREQsTUFBTSxDQUFDLE9BQU8sQ0FDWixNQUE4QjtRQUU5QixPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFO2dCQUNsRSw2Q0FBNkM7Z0JBQzdDLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQjtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDN0Q7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLDBCQUEwQjtvQkFDbkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ3RDLENBQUMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCO3dCQUNoQyxDQUFDLENBQUMsRUFBRTtpQkFDUDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxRQUFRLEVBQUUsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEI7d0JBQ3JDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFtQkQ7Ozs7T0FJRztJQUNILFVBQVUsQ0FBQyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7WUFoRkYsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCw4QkFBOEI7b0JBQzlCLGFBQWEsRUFBRSxvREFBb0Q7aUJBQ3BFO2dCQUNELFNBQVMsRUFBRTtvQkFDVCx5QkFBeUI7b0JBQ3pCLHNCQUFzQjtvQkFDdEIsaUJBQWlCO29CQUNqQixrQkFBa0I7b0JBQ2xCLGFBQWE7b0JBQ2IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO29CQUNoRTt3QkFDRSxPQUFPLEVBQUUsd0JBQXdCO3dCQUNqQyxRQUFRLEVBQUUsK0JBQStCO3FCQUMxQztvQkFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO2lCQUNyRDthQUNGOzs7O1lBeER1QixhQUFhO1lBZTVCLGtCQUFrQjtZQUVsQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRWZmZWN0c01vZHVsZSwgRWZmZWN0U291cmNlcyB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBEZWZhdWx0SHR0cFVybEdlbmVyYXRvcixcbiAgSHR0cFVybEdlbmVyYXRvcixcbn0gZnJvbSAnLi9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuaW1wb3J0IHsgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1jYWNoZS1lZmZlY3RzJztcbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1lZmZlY3RzJztcblxuaW1wb3J0IHsgRU5USVRZX01FVEFEQVRBX1RPS0VOIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhJztcblxuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gIEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG59IGZyb20gJy4vcmVkdWNlcnMvY29uc3RhbnRzJztcbmltcG9ydCB7IFBsdXJhbGl6ZXIsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEZWZhdWx0UGx1cmFsaXplciB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdC1wbHVyYWxpemVyJztcblxuaW1wb3J0IHtcbiAgRW50aXR5RGF0YU1vZHVsZUNvbmZpZyxcbiAgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxufSBmcm9tICcuL2VudGl0eS1kYXRhLXdpdGhvdXQtZWZmZWN0cy5tb2R1bGUnO1xuXG4vKipcbiAqIGVudGl0eS1kYXRhIG1haW4gbW9kdWxlIGluY2x1ZGVzIGVmZmVjdHMgYW5kIEhUVFAgZGF0YSBzZXJ2aWNlc1xuICogQ29uZmlndXJlIHdpdGggYGZvclJvb3RgLlxuICogTm8gYGZvckZlYXR1cmVgIHlldC5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbiAgICBFZmZlY3RzTW9kdWxlLCAvLyBkbyBub3Qgc3VwcGx5IGVmZmVjdHMgYmVjYXVzZSBjYW4ndCByZXBsYWNlIGxhdGVyXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIERlZmF1bHREYXRhU2VydmljZUZhY3RvcnksXG4gICAgRW50aXR5Q2FjaGVEYXRhU2VydmljZSxcbiAgICBFbnRpdHlEYXRhU2VydmljZSxcbiAgICBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgRW50aXR5RWZmZWN0cyxcbiAgICB7IHByb3ZpZGU6IEh0dHBVcmxHZW5lcmF0b3IsIHVzZUNsYXNzOiBEZWZhdWx0SHR0cFVybEdlbmVyYXRvciB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICAgIHVzZUNsYXNzOiBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIH0sXG4gICAgeyBwcm92aWRlOiBQbHVyYWxpemVyLCB1c2VDbGFzczogRGVmYXVsdFBsdXJhbGl6ZXIgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KFxuICAgIGNvbmZpZzogRW50aXR5RGF0YU1vZHVsZUNvbmZpZ1xuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEVudGl0eURhdGFNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgLy8gVE9ETzogTW92ZWQgdGhlc2UgZWZmZWN0cyBjbGFzc2VzIHVwIHRvIEVudGl0eURhdGFNb2R1bGUgaXRzZWxmXG4gICAgICAgIC8vIFJlbW92ZSB0aGlzIGNvbW1lbnQgaWYgdGhhdCB3YXMgYSBtaXN0YWtlLlxuICAgICAgICAvLyBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgICAgIC8vIEVudGl0eUVmZmVjdHMsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlNZXRhZGF0YSA/IGNvbmZpZy5lbnRpdHlNZXRhZGF0YSA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcuZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFBMVVJBTF9OQU1FU19UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLnBsdXJhbE5hbWVzID8gY29uZmlnLnBsdXJhbE5hbWVzIDoge30sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVmZmVjdFNvdXJjZXM6IEVmZmVjdFNvdXJjZXMsXG4gICAgZW50aXR5Q2FjaGVFZmZlY3RzOiBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgZW50aXR5RWZmZWN0czogRW50aXR5RWZmZWN0c1xuICApIHtcbiAgICAvLyBXZSBjYW4ndCB1c2UgYGZvckZlYXR1cmUoKWAgYmVjYXVzZSwgaWYgd2UgZGlkLCB0aGUgZGV2ZWxvcGVyIGNvdWxkIG5vdFxuICAgIC8vIHJlcGxhY2UgdGhlIGVudGl0eS1kYXRhIGBFbnRpdHlFZmZlY3RzYCB3aXRoIGEgY3VzdG9tIGFsdGVybmF0aXZlLlxuICAgIC8vIFJlcGxhY2luZyB0aGF0IGNsYXNzIGlzIGFuIGV4dGVuc2liaWxpdHkgcG9pbnQgd2UgbmVlZC5cbiAgICAvL1xuICAgIC8vIFRoZSBGRUFUVVJFX0VGRkVDVFMgdG9rZW4gaXMgbm90IGV4cG9zZWQsIHNvIGNhbid0IHVzZSB0aGF0IHRlY2huaXF1ZS5cbiAgICAvLyBXYXJuaW5nOiB0aGlzIGFsdGVybmF0aXZlIGFwcHJvYWNoIHJlbGllcyBvbiBhbiB1bmRvY3VtZW50ZWQgQVBJXG4gICAgLy8gdG8gYWRkIGVmZmVjdCBkaXJlY3RseSByYXRoZXIgdGhhbiB0aHJvdWdoIGBmb3JGZWF0dXJlKClgLlxuICAgIC8vIFRoZSBkYW5nZXIgaXMgdGhhdCBFZmZlY3RzTW9kdWxlLmZvckZlYXR1cmUgZXZvbHZlcyBhbmQgd2Ugbm8gbG9uZ2VyIHBlcmZvcm0gYSBjcnVjaWFsIHN0ZXAuXG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUNhY2hlRWZmZWN0cyk7XG4gICAgdGhpcy5hZGRFZmZlY3RzKGVudGl0eUVmZmVjdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm90aGVyIGNsYXNzIGluc3RhbmNlIHRoYXQgY29udGFpbnMgZWZmZWN0cy5cbiAgICogQHBhcmFtIGVmZmVjdFNvdXJjZUluc3RhbmNlIGEgY2xhc3MgaW5zdGFuY2UgdGhhdCBpbXBsZW1lbnRzIGVmZmVjdHMuXG4gICAqIFdhcm5pbmc6IHVuZG9jdW1lbnRlZCBAbmdyeC9lZmZlY3RzIEFQSVxuICAgKi9cbiAgYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZTogYW55KSB7XG4gICAgdGhpcy5lZmZlY3RTb3VyY2VzLmFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2UpO1xuICB9XG59XG4iXX0=