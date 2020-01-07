/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-data.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * Add another class instance that contains effects.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUVoRixPQUFPLEVBQ0wsK0JBQStCLEVBQy9CLHdCQUF3QixHQUN6QixNQUFNLG1EQUFtRCxDQUFDO0FBRTNELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsZ0JBQWdCLEdBQ2pCLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXpELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRTFFLE9BQU8sRUFDTCwwQkFBMEIsRUFDMUIsK0JBQStCLEdBQ2hDLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRS9ELE9BQU8sRUFFTCw4QkFBOEIsR0FDL0IsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7O0FBMEI5QyxNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUFtQzNCLFlBQ1UsYUFBNEIsRUFDcEMsa0JBQXNDLEVBQ3RDLGFBQTRCO1FBRnBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBSXBDLDBFQUEwRTtRQUMxRSxxRUFBcUU7UUFDckUsMERBQTBEO1FBQzFELEVBQUU7UUFDRix5RUFBeUU7UUFDekUsbUVBQW1FO1FBQ25FLDZEQUE2RDtRQUM3RCwrRkFBK0Y7UUFDL0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakMsQ0FBQzs7Ozs7SUFqREQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUE4QjtRQUMzQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFO2dCQUNsRSw2Q0FBNkM7Z0JBQzdDLHNCQUFzQjtnQkFDdEIsaUJBQWlCO2dCQUNqQjtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDN0Q7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLDBCQUEwQjtvQkFDbkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyx1QkFBdUI7d0JBQ3RDLENBQUMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCO3dCQUNoQyxDQUFDLENBQUMsRUFBRTtpQkFDUDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxRQUFRLEVBQUUsTUFBTSxDQUFDLDRCQUE0Qjt3QkFDM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEI7d0JBQ3JDLENBQUMsQ0FBQyxFQUFFO2lCQUNQO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7Ozs7Ozs7SUF3QkQsVUFBVSxDQUFDLG9CQUF5QjtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3RELENBQUM7OztZQTlFRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLDhCQUE4QjtvQkFDOUIsYUFBYTtpQkFDZDtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QseUJBQXlCO29CQUN6QixzQkFBc0I7b0JBQ3RCLGlCQUFpQjtvQkFDakIsa0JBQWtCO29CQUNsQixhQUFhO29CQUNiLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBRTtvQkFDaEU7d0JBQ0UsT0FBTyxFQUFFLHdCQUF3Qjt3QkFDakMsUUFBUSxFQUFFLCtCQUErQjtxQkFDMUM7b0JBQ0QsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRTtpQkFDckQ7YUFDRjs7OztZQXhEdUIsYUFBYTtZQWU1QixrQkFBa0I7WUFFbEIsYUFBYTs7Ozs7OztJQTRFbEIseUNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRWZmZWN0c01vZHVsZSwgRWZmZWN0U291cmNlcyB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuXG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG59IGZyb20gJy4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBEZWZhdWx0SHR0cFVybEdlbmVyYXRvcixcbiAgSHR0cFVybEdlbmVyYXRvcixcbn0gZnJvbSAnLi9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuaW1wb3J0IHsgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB9IGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1jYWNoZS1lZmZlY3RzJztcbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1lZmZlY3RzJztcblxuaW1wb3J0IHsgRU5USVRZX01FVEFEQVRBX1RPS0VOIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhJztcblxuaW1wb3J0IHtcbiAgRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gIEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG59IGZyb20gJy4vcmVkdWNlcnMvY29uc3RhbnRzJztcbmltcG9ydCB7IFBsdXJhbGl6ZXIsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vdXRpbHMvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEZWZhdWx0UGx1cmFsaXplciB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdC1wbHVyYWxpemVyJztcblxuaW1wb3J0IHtcbiAgRW50aXR5RGF0YU1vZHVsZUNvbmZpZyxcbiAgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxufSBmcm9tICcuL2VudGl0eS1kYXRhLXdpdGhvdXQtZWZmZWN0cy5tb2R1bGUnO1xuXG4vKipcbiAqIGVudGl0eS1kYXRhIG1haW4gbW9kdWxlIGluY2x1ZGVzIGVmZmVjdHMgYW5kIEhUVFAgZGF0YSBzZXJ2aWNlc1xuICogQ29uZmlndXJlIHdpdGggYGZvclJvb3RgLlxuICogTm8gYGZvckZlYXR1cmVgIHlldC5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbiAgICBFZmZlY3RzTW9kdWxlLCAvLyBkbyBub3Qgc3VwcGx5IGVmZmVjdHMgYmVjYXVzZSBjYW4ndCByZXBsYWNlIGxhdGVyXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIERlZmF1bHREYXRhU2VydmljZUZhY3RvcnksXG4gICAgRW50aXR5Q2FjaGVEYXRhU2VydmljZSxcbiAgICBFbnRpdHlEYXRhU2VydmljZSxcbiAgICBFbnRpdHlDYWNoZUVmZmVjdHMsXG4gICAgRW50aXR5RWZmZWN0cyxcbiAgICB7IHByb3ZpZGU6IEh0dHBVcmxHZW5lcmF0b3IsIHVzZUNsYXNzOiBEZWZhdWx0SHR0cFVybEdlbmVyYXRvciB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICAgIHVzZUNsYXNzOiBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIH0sXG4gICAgeyBwcm92aWRlOiBQbHVyYWxpemVyLCB1c2VDbGFzczogRGVmYXVsdFBsdXJhbGl6ZXIgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogRW50aXR5RGF0YU1vZHVsZUNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRW50aXR5RGF0YU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICAvLyBUT0RPOiBNb3ZlZCB0aGVzZSBlZmZlY3RzIGNsYXNzZXMgdXAgdG8gRW50aXR5RGF0YU1vZHVsZSBpdHNlbGZcbiAgICAgICAgLy8gUmVtb3ZlIHRoaXMgY29tbWVudCBpZiB0aGF0IHdhcyBhIG1pc3Rha2UuXG4gICAgICAgIC8vIEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICAgICAgLy8gRW50aXR5RWZmZWN0cyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9NRVRBREFUQV9UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eU1ldGFkYXRhID8gY29uZmlnLmVudGl0eU1ldGFkYXRhIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUExVUkFMX05BTUVTX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcucGx1cmFsTmFtZXMgPyBjb25maWcucGx1cmFsTmFtZXMgOiB7fSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWZmZWN0U291cmNlczogRWZmZWN0U291cmNlcyxcbiAgICBlbnRpdHlDYWNoZUVmZmVjdHM6IEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICBlbnRpdHlFZmZlY3RzOiBFbnRpdHlFZmZlY3RzXG4gICkge1xuICAgIC8vIFdlIGNhbid0IHVzZSBgZm9yRmVhdHVyZSgpYCBiZWNhdXNlLCBpZiB3ZSBkaWQsIHRoZSBkZXZlbG9wZXIgY291bGQgbm90XG4gICAgLy8gcmVwbGFjZSB0aGUgZW50aXR5LWRhdGEgYEVudGl0eUVmZmVjdHNgIHdpdGggYSBjdXN0b20gYWx0ZXJuYXRpdmUuXG4gICAgLy8gUmVwbGFjaW5nIHRoYXQgY2xhc3MgaXMgYW4gZXh0ZW5zaWJpbGl0eSBwb2ludCB3ZSBuZWVkLlxuICAgIC8vXG4gICAgLy8gVGhlIEZFQVRVUkVfRUZGRUNUUyB0b2tlbiBpcyBub3QgZXhwb3NlZCwgc28gY2FuJ3QgdXNlIHRoYXQgdGVjaG5pcXVlLlxuICAgIC8vIFdhcm5pbmc6IHRoaXMgYWx0ZXJuYXRpdmUgYXBwcm9hY2ggcmVsaWVzIG9uIGFuIHVuZG9jdW1lbnRlZCBBUElcbiAgICAvLyB0byBhZGQgZWZmZWN0IGRpcmVjdGx5IHJhdGhlciB0aGFuIHRocm91Z2ggYGZvckZlYXR1cmUoKWAuXG4gICAgLy8gVGhlIGRhbmdlciBpcyB0aGF0IEVmZmVjdHNNb2R1bGUuZm9yRmVhdHVyZSBldm9sdmVzIGFuZCB3ZSBubyBsb25nZXIgcGVyZm9ybSBhIGNydWNpYWwgc3RlcC5cbiAgICB0aGlzLmFkZEVmZmVjdHMoZW50aXR5Q2FjaGVFZmZlY3RzKTtcbiAgICB0aGlzLmFkZEVmZmVjdHMoZW50aXR5RWZmZWN0cyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFub3RoZXIgY2xhc3MgaW5zdGFuY2UgdGhhdCBjb250YWlucyBlZmZlY3RzLlxuICAgKiBAcGFyYW0gZWZmZWN0U291cmNlSW5zdGFuY2UgYSBjbGFzcyBpbnN0YW5jZSB0aGF0IGltcGxlbWVudHMgZWZmZWN0cy5cbiAgICogV2FybmluZzogdW5kb2N1bWVudGVkIEBuZ3J4L2VmZmVjdHMgQVBJXG4gICAqL1xuICBhZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgICB0aGlzLmVmZmVjdFNvdXJjZXMuYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZSk7XG4gIH1cbn1cbiJdfQ==