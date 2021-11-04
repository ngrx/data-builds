import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
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
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
import * as i2 from "./effects/entity-cache-effects";
import * as i3 from "./effects/entity-effects";
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
/** @nocollapse */ EntityDataModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataModule, deps: [{ token: i1.EffectSources }, { token: i2.EntityCacheEffects }, { token: i3.EntityEffects }], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ EntityDataModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataModule, imports: [EntityDataModuleWithoutEffects,
        EffectsModule] });
/** @nocollapse */ EntityDataModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataModule, providers: [
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
    ], imports: [[
            EntityDataModuleWithoutEffects,
            EffectsModule, // do not supply effects because can't replace later
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }], ctorParameters: function () { return [{ type: i1.EffectSources }, { type: i2.EntityCacheEffects }, { type: i3.EntityEffects }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGFBQWEsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFaEYsT0FBTyxFQUNMLCtCQUErQixFQUMvQix3QkFBd0IsR0FDekIsTUFBTSxtREFBbUQsQ0FBQztBQUUzRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGdCQUFnQixHQUNqQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUUxRSxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLCtCQUErQixHQUNoQyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUvRCxPQUFPLEVBRUwsOEJBQThCLEdBQy9CLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBRTlDOzs7O0dBSUc7QUFvQkgsTUFBTSxPQUFPLGdCQUFnQjtJQXFDM0IsWUFDVSxhQUE0QixFQUNwQyxrQkFBc0MsRUFD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bmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFZmZlY3RzTW9kdWxlLCBFZmZlY3RTb3VyY2VzIH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5cbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZSc7XG5cbmltcG9ydCB7XG4gIERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbn0gZnJvbSAnLi9kYXRhc2VydmljZXMvcGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZSc7XG5cbmltcG9ydCB7XG4gIERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yLFxuICBIdHRwVXJsR2VuZXJhdG9yLFxufSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9odHRwLXVybC1nZW5lcmF0b3InO1xuXG5pbXBvcnQgeyBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhc2VydmljZXMvZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMnO1xuaW1wb3J0IHsgRW50aXR5RGF0YVNlcnZpY2UgfSBmcm9tICcuL2RhdGFzZXJ2aWNlcy9lbnRpdHktZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMnO1xuXG5pbXBvcnQgeyBFTlRJVFlfTUVUQURBVEFfVE9LRU4gfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktbWV0YWRhdGEnO1xuXG5pbXBvcnQge1xuICBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbn0gZnJvbSAnLi9yZWR1Y2Vycy9jb25zdGFudHMnO1xuaW1wb3J0IHsgUGx1cmFsaXplciwgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi91dGlscy9pbnRlcmZhY2VzJztcbmltcG9ydCB7IERlZmF1bHRQbHVyYWxpemVyIH0gZnJvbSAnLi91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXInO1xuXG5pbXBvcnQge1xuICBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnLFxuICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG59IGZyb20gJy4vZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZSc7XG5cbi8qKlxuICogZW50aXR5LWRhdGEgbWFpbiBtb2R1bGUgaW5jbHVkZXMgZWZmZWN0cyBhbmQgSFRUUCBkYXRhIHNlcnZpY2VzXG4gKiBDb25maWd1cmUgd2l0aCBgZm9yUm9vdGAuXG4gKiBObyBgZm9yRmVhdHVyZWAgeWV0LlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzLFxuICAgIEVmZmVjdHNNb2R1bGUsIC8vIGRvIG5vdCBzdXBwbHkgZWZmZWN0cyBiZWNhdXNlIGNhbid0IHJlcGxhY2UgbGF0ZXJcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSxcbiAgICBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlLFxuICAgIEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICBFbnRpdHlFZmZlY3RzLFxuICAgIHsgcHJvdmlkZTogSHR0cFVybEdlbmVyYXRvciwgdXNlQ2xhc3M6IERlZmF1bHRIdHRwVXJsR2VuZXJhdG9yIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgICAgdXNlQ2xhc3M6IERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIsXG4gICAgfSxcbiAgICB7IHByb3ZpZGU6IFBsdXJhbGl6ZXIsIHVzZUNsYXNzOiBEZWZhdWx0UGx1cmFsaXplciB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoXG4gICAgY29uZmlnOiBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RW50aXR5RGF0YU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRW50aXR5RGF0YU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICAvLyBUT0RPOiBNb3ZlZCB0aGVzZSBlZmZlY3RzIGNsYXNzZXMgdXAgdG8gRW50aXR5RGF0YU1vZHVsZSBpdHNlbGZcbiAgICAgICAgLy8gUmVtb3ZlIHRoaXMgY29tbWVudCBpZiB0aGF0IHdhcyBhIG1pc3Rha2UuXG4gICAgICAgIC8vIEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICAgICAgLy8gRW50aXR5RWZmZWN0cyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9NRVRBREFUQV9UT0tFTixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eU1ldGFkYXRhID8gY29uZmlnLmVudGl0eU1ldGFkYXRhIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBFTlRJVFlfQ0FDSEVfTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDYWNoZU1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA/IGNvbmZpZy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUExVUkFMX05BTUVTX1RPS0VOLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcucGx1cmFsTmFtZXMgPyBjb25maWcucGx1cmFsTmFtZXMgOiB7fSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWZmZWN0U291cmNlczogRWZmZWN0U291cmNlcyxcbiAgICBlbnRpdHlDYWNoZUVmZmVjdHM6IEVudGl0eUNhY2hlRWZmZWN0cyxcbiAgICBlbnRpdHlFZmZlY3RzOiBFbnRpdHlFZmZlY3RzXG4gICkge1xuICAgIC8vIFdlIGNhbid0IHVzZSBgZm9yRmVhdHVyZSgpYCBiZWNhdXNlLCBpZiB3ZSBkaWQsIHRoZSBkZXZlbG9wZXIgY291bGQgbm90XG4gICAgLy8gcmVwbGFjZSB0aGUgZW50aXR5LWRhdGEgYEVudGl0eUVmZmVjdHNgIHdpdGggYSBjdXN0b20gYWx0ZXJuYXRpdmUuXG4gICAgLy8gUmVwbGFjaW5nIHRoYXQgY2xhc3MgaXMgYW4gZXh0ZW5zaWJpbGl0eSBwb2ludCB3ZSBuZWVkLlxuICAgIC8vXG4gICAgLy8gVGhlIEZFQVRVUkVfRUZGRUNUUyB0b2tlbiBpcyBub3QgZXhwb3NlZCwgc28gY2FuJ3QgdXNlIHRoYXQgdGVjaG5pcXVlLlxuICAgIC8vIFdhcm5pbmc6IHRoaXMgYWx0ZXJuYXRpdmUgYXBwcm9hY2ggcmVsaWVzIG9uIGFuIHVuZG9jdW1lbnRlZCBBUElcbiAgICAvLyB0byBhZGQgZWZmZWN0IGRpcmVjdGx5IHJhdGhlciB0aGFuIHRocm91Z2ggYGZvckZlYXR1cmUoKWAuXG4gICAgLy8gVGhlIGRhbmdlciBpcyB0aGF0IEVmZmVjdHNNb2R1bGUuZm9yRmVhdHVyZSBldm9sdmVzIGFuZCB3ZSBubyBsb25nZXIgcGVyZm9ybSBhIGNydWNpYWwgc3RlcC5cbiAgICB0aGlzLmFkZEVmZmVjdHMoZW50aXR5Q2FjaGVFZmZlY3RzKTtcbiAgICB0aGlzLmFkZEVmZmVjdHMoZW50aXR5RWZmZWN0cyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFub3RoZXIgY2xhc3MgaW5zdGFuY2UgdGhhdCBjb250YWlucyBlZmZlY3RzLlxuICAgKiBAcGFyYW0gZWZmZWN0U291cmNlSW5zdGFuY2UgYSBjbGFzcyBpbnN0YW5jZSB0aGF0IGltcGxlbWVudHMgZWZmZWN0cy5cbiAgICogV2FybmluZzogdW5kb2N1bWVudGVkIEBuZ3J4L2VmZmVjdHMgQVBJXG4gICAqL1xuICBhZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgICB0aGlzLmVmZmVjdFNvdXJjZXMuYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZSk7XG4gIH1cbn1cbiJdfQ==