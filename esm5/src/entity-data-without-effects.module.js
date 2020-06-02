/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-data-without-effects.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule, Inject, Injector, InjectionToken, Optional, } from '@angular/core';
import { combineReducers, ReducerManager, StoreModule, } from '@ngrx/store';
import { CorrelationIdGenerator } from './utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
import { EntityActionFactory } from './actions/entity-action-factory';
import { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
import { entityCacheSelectorProvider } from './selectors/entity-cache-selector';
import { EntityCollectionServiceElementsFactory } from './entity-services/entity-collection-service-elements-factory';
import { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
import { EntityServices } from './entity-services/entity-services';
import { EntityCollectionCreator } from './reducers/entity-collection-creator';
import { EntityCollectionReducerFactory } from './reducers/entity-collection-reducer';
import { EntityCollectionReducerMethodsFactory } from './reducers/entity-collection-reducer-methods';
import { EntityCollectionReducerRegistry } from './reducers/entity-collection-reducer-registry';
import { EntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from './entity-metadata/entity-definition.service';
import { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import { ENTITY_CACHE_NAME, ENTITY_CACHE_NAME_TOKEN, ENTITY_CACHE_META_REDUCERS, ENTITY_COLLECTION_META_REDUCERS, INITIAL_ENTITY_CACHE_STATE, } from './reducers/constants';
import { DefaultLogger } from './utils/default-logger';
import { EntitySelectorsFactory } from './selectors/entity-selectors';
import { EntitySelectors$Factory } from './selectors/entity-selectors$';
import { EntityServicesBase } from './entity-services/entity-services-base';
import { EntityServicesElements } from './entity-services/entity-services-elements';
import { Logger, PLURAL_NAMES_TOKEN } from './utils/interfaces';
/**
 * @record
 */
export function EntityDataModuleConfig() { }
if (false) {
    /** @type {?|undefined} */
    EntityDataModuleConfig.prototype.entityMetadata;
    /** @type {?|undefined} */
    EntityDataModuleConfig.prototype.entityCacheMetaReducers;
    /** @type {?|undefined} */
    EntityDataModuleConfig.prototype.entityCollectionMetaReducers;
    /** @type {?|undefined} */
    EntityDataModuleConfig.prototype.initialEntityCacheState;
    /** @type {?|undefined} */
    EntityDataModuleConfig.prototype.pluralNames;
}
var ɵ0 = ENTITY_CACHE_NAME;
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of \@ngrx/effects for entities
 */
var EntityDataModuleWithoutEffects = /** @class */ (function () {
    function EntityDataModuleWithoutEffects(reducerManager, entityCacheReducerFactory, injector, entityCacheName, initialState, metaReducers) {
        this.reducerManager = reducerManager;
        this.injector = injector;
        this.entityCacheName = entityCacheName;
        this.initialState = initialState;
        this.metaReducers = metaReducers;
        // Add the @ngrx/data feature to the Store's features
        // as Store.forFeature does for StoreFeatureModule
        /** @type {?} */
        var key = entityCacheName || ENTITY_CACHE_NAME;
        initialState =
            typeof initialState === 'function' ? initialState() : initialState;
        /** @type {?} */
        var reducers = (metaReducers || []).map((/**
         * @param {?} mr
         * @return {?}
         */
        function (mr) {
            return mr instanceof InjectionToken ? injector.get(mr) : mr;
        }));
        this.entityCacheFeature = {
            key: key,
            reducers: entityCacheReducerFactory.create(),
            reducerFactory: combineReducers,
            initialState: initialState || {},
            metaReducers: reducers,
        };
        reducerManager.addFeature(this.entityCacheFeature);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    EntityDataModuleWithoutEffects.forRoot = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: EntityDataModuleWithoutEffects,
            providers: [
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
     * @return {?}
     */
    EntityDataModuleWithoutEffects.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    };
    EntityDataModuleWithoutEffects.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        StoreModule,
                    ],
                    providers: [
                        CorrelationIdGenerator,
                        EntityDispatcherDefaultOptions,
                        EntityActionFactory,
                        EntityCacheDispatcher,
                        EntityCacheReducerFactory,
                        entityCacheSelectorProvider,
                        EntityCollectionCreator,
                        EntityCollectionReducerFactory,
                        EntityCollectionReducerMethodsFactory,
                        EntityCollectionReducerRegistry,
                        EntityCollectionServiceElementsFactory,
                        EntityCollectionServiceFactory,
                        EntityDefinitionService,
                        EntityDispatcherFactory,
                        EntitySelectorsFactory,
                        EntitySelectors$Factory,
                        EntityServicesElements,
                        { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ɵ0 },
                        { provide: EntityServices, useClass: EntityServicesBase },
                        { provide: Logger, useClass: DefaultLogger },
                    ],
                },] }
    ];
    /** @nocollapse */
    EntityDataModuleWithoutEffects.ctorParameters = function () { return [
        { type: ReducerManager },
        { type: EntityCacheReducerFactory },
        { type: Injector },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_NAME_TOKEN,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [INITIAL_ENTITY_CACHE_STATE,] }] },
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_META_REDUCERS,] }] }
    ]; };
    return EntityDataModuleWithoutEffects;
}());
export { EntityDataModuleWithoutEffects };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityDataModuleWithoutEffects.prototype.entityCacheFeature;
    /**
     * @type {?}
     * @private
     */
    EntityDataModuleWithoutEffects.prototype.reducerManager;
    /**
     * @type {?}
     * @private
     */
    EntityDataModuleWithoutEffects.prototype.injector;
    /**
     * @type {?}
     * @private
     */
    EntityDataModuleWithoutEffects.prototype.entityCacheName;
    /**
     * @type {?}
     * @private
     */
    EntityDataModuleWithoutEffects.prototype.initialState;
    /**
     * @type {?}
     * @private
     */
    EntityDataModuleWithoutEffects.prototype.metaReducers;
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFFBQVEsRUFDUixjQUFjLEVBQ2QsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTCxlQUFlLEVBRWYsY0FBYyxFQUNkLFdBQVcsR0FDWixNQUFNLGFBQWEsQ0FBQztBQUVyQixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUVqRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUV0RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsc0NBQXNDLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUN0SCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUNyRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFbkUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDL0UsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDckcsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEcsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUNBQXlDLENBQUM7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IjpbImltcG9ydCB7XG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgT3B0aW9uYWwsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgY29tYmluZVJlZHVjZXJzLFxuICBNZXRhUmVkdWNlcixcbiAgUmVkdWNlck1hbmFnZXIsXG4gIFN0b3JlTW9kdWxlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IENvcnJlbGF0aW9uSWRHZW5lcmF0b3IgfSBmcm9tICcuL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRGlzcGF0Y2hlciB9IGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWNhY2hlLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgZW50aXR5Q2FjaGVTZWxlY3RvclByb3ZpZGVyIH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlTZXJ2aWNlcyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXInO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSB9IGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItcmVnaXN0cnknO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckZhY3RvcnkgfSBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eU1ldGFkYXRhTWFwIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LW1ldGFkYXRhJztcbmltcG9ydCB7IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnkgfSBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyJztcbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9OQU1FLFxuICBFTlRJVFlfQ0FDSEVfTkFNRV9UT0tFTixcbiAgRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMsXG4gIEVOVElUWV9DT0xMRUNUSU9OX01FVEFfUkVEVUNFUlMsXG4gIElOSVRJQUxfRU5USVRZX0NBQ0hFX1NUQVRFLFxufSBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tICcuL3V0aWxzL2RlZmF1bHQtbG9nZ2VyJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9yc0ZhY3RvcnkgfSBmcm9tICcuL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyRGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXNCYXNlIH0gZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWJhc2UnO1xuaW1wb3J0IHsgRW50aXR5U2VydmljZXNFbGVtZW50cyB9IGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcy1lbGVtZW50cyc7XG5pbXBvcnQgeyBMb2dnZXIsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGF0YU1vZHVsZUNvbmZpZyB7XG4gIGVudGl0eU1ldGFkYXRhPzogRW50aXR5TWV0YWRhdGFNYXA7XG4gIGVudGl0eUNhY2hlTWV0YVJlZHVjZXJzPzogKFxuICAgIHwgTWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj5cbiAgICB8IEluamVjdGlvblRva2VuPE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+PilbXTtcbiAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2Vycz86IE1ldGFSZWR1Y2VyPEVudGl0eUNvbGxlY3Rpb24sIEVudGl0eUFjdGlvbj5bXTtcbiAgLy8gSW5pdGlhbCBFbnRpdHlDYWNoZSBzdGF0ZSBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGF0IHN0YXRlXG4gIGluaXRpYWxFbnRpdHlDYWNoZVN0YXRlPzogRW50aXR5Q2FjaGUgfCAoKCkgPT4gRW50aXR5Q2FjaGUpO1xuICBwbHVyYWxOYW1lcz86IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9O1xufVxuXG4vKipcbiAqIE1vZHVsZSB3aXRob3V0IGVmZmVjdHMgb3IgZGF0YXNlcnZpY2VzIHdoaWNoIG1lYW5zIG5vIEhUVFAgY2FsbHNcbiAqIFRoaXMgbW9kdWxlIGhlbHBmdWwgZm9yIGludGVybmFsIHRlc3RpbmcuXG4gKiBBbHNvIGhlbHBmdWwgZm9yIGFwcHMgdGhhdCBoYW5kbGUgc2VydmVyIGFjY2VzcyBvbiB0aGVpciBvd24gYW5kXG4gKiB0aGVyZWZvcmUgb3B0LW91dCBvZiBAbmdyeC9lZmZlY3RzIGZvciBlbnRpdGllc1xuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgU3RvcmVNb2R1bGUsIC8vIHJlbHkgb24gU3RvcmUgZmVhdHVyZSBwcm92aWRlcnMgcmF0aGVyIHRoYW4gU3RvcmUuZm9yRmVhdHVyZSgpXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIENvcnJlbGF0aW9uSWRHZW5lcmF0b3IsXG4gICAgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgRW50aXR5Q2FjaGVEaXNwYXRjaGVyLFxuICAgIEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgZW50aXR5Q2FjaGVTZWxlY3RvclByb3ZpZGVyLFxuICAgIEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSxcbiAgICBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5LFxuICAgIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyUmVnaXN0cnksXG4gICAgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnksXG4gICAgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5LFxuICAgIEVudGl0eURlZmluaXRpb25TZXJ2aWNlLFxuICAgIEVudGl0eURpc3BhdGNoZXJGYWN0b3J5LFxuICAgIEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG4gICAgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnksXG4gICAgRW50aXR5U2VydmljZXNFbGVtZW50cyxcbiAgICB7IHByb3ZpZGU6IEVOVElUWV9DQUNIRV9OQU1FX1RPS0VOLCB1c2VWYWx1ZTogRU5USVRZX0NBQ0hFX05BTUUgfSxcbiAgICB7IHByb3ZpZGU6IEVudGl0eVNlcnZpY2VzLCB1c2VDbGFzczogRW50aXR5U2VydmljZXNCYXNlIH0sXG4gICAgeyBwcm92aWRlOiBMb2dnZXIsIHVzZUNsYXNzOiBEZWZhdWx0TG9nZ2VyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZW50aXR5Q2FjaGVGZWF0dXJlOiBhbnk7XG5cbiAgc3RhdGljIGZvclJvb3QoXG4gICAgY29uZmlnOiBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEVOVElUWV9DQUNIRV9NRVRBX1JFRFVDRVJTLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcuZW50aXR5Q2FjaGVNZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNhY2hlTWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRU5USVRZX0NPTExFQ1RJT05fTUVUQV9SRURVQ0VSUyxcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgID8gY29uZmlnLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnNcbiAgICAgICAgICAgIDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBQTFVSQUxfTkFNRVNfVE9LRU4sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZy5wbHVyYWxOYW1lcyA/IGNvbmZpZy5wbHVyYWxOYW1lcyA6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWR1Y2VyTWFuYWdlcjogUmVkdWNlck1hbmFnZXIsXG4gICAgZW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeTogRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSxcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAvLyBvcHRpb25hbCBwYXJhbXNcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX05BTUVfVE9LRU4pXG4gICAgcHJpdmF0ZSBlbnRpdHlDYWNoZU5hbWU6IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoSU5JVElBTF9FTlRJVFlfQ0FDSEVfU1RBVEUpXG4gICAgcHJpdmF0ZSBpbml0aWFsU3RhdGU6IGFueSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0NBQ0hFX01FVEFfUkVEVUNFUlMpXG4gICAgcHJpdmF0ZSBtZXRhUmVkdWNlcnM6IChcbiAgICAgIHwgTWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj5cbiAgICAgIHwgSW5qZWN0aW9uVG9rZW48TWV0YVJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4+KVtdXG4gICkge1xuICAgIC8vIEFkZCB0aGUgQG5ncngvZGF0YSBmZWF0dXJlIHRvIHRoZSBTdG9yZSdzIGZlYXR1cmVzXG4gICAgLy8gYXMgU3RvcmUuZm9yRmVhdHVyZSBkb2VzIGZvciBTdG9yZUZlYXR1cmVNb2R1bGVcbiAgICBjb25zdCBrZXkgPSBlbnRpdHlDYWNoZU5hbWUgfHwgRU5USVRZX0NBQ0hFX05BTUU7XG5cbiAgICBpbml0aWFsU3RhdGUgPVxuICAgICAgdHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IGluaXRpYWxTdGF0ZSgpIDogaW5pdGlhbFN0YXRlO1xuXG4gICAgY29uc3QgcmVkdWNlcnM6IE1ldGFSZWR1Y2VyPEVudGl0eUNhY2hlLCBBY3Rpb24+W10gPSAoXG4gICAgICBtZXRhUmVkdWNlcnMgfHwgW11cbiAgICApLm1hcChtciA9PiB7XG4gICAgICByZXR1cm4gbXIgaW5zdGFuY2VvZiBJbmplY3Rpb25Ub2tlbiA/IGluamVjdG9yLmdldChtcikgOiBtcjtcbiAgICB9KTtcblxuICAgIHRoaXMuZW50aXR5Q2FjaGVGZWF0dXJlID0ge1xuICAgICAga2V5LFxuICAgICAgcmVkdWNlcnM6IGVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnkuY3JlYXRlKCksXG4gICAgICByZWR1Y2VyRmFjdG9yeTogY29tYmluZVJlZHVjZXJzLFxuICAgICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGUgfHwge30sXG4gICAgICBtZXRhUmVkdWNlcnM6IHJlZHVjZXJzLFxuICAgIH07XG4gICAgcmVkdWNlck1hbmFnZXIuYWRkRmVhdHVyZSh0aGlzLmVudGl0eUNhY2hlRmVhdHVyZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlZHVjZXJNYW5hZ2VyLnJlbW92ZUZlYXR1cmUodGhpcy5lbnRpdHlDYWNoZUZlYXR1cmUpO1xuICB9XG59XG4iXX0=