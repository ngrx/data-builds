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
const ɵ0 = ENTITY_CACHE_NAME;
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of \@ngrx/effects for entities
 */
export class EntityDataModuleWithoutEffects {
    /**
     * @param {?} reducerManager
     * @param {?} entityCacheReducerFactory
     * @param {?} injector
     * @param {?} entityCacheName
     * @param {?} initialState
     * @param {?} metaReducers
     */
    constructor(reducerManager, entityCacheReducerFactory, injector, entityCacheName, initialState, metaReducers) {
        this.reducerManager = reducerManager;
        this.injector = injector;
        this.entityCacheName = entityCacheName;
        this.initialState = initialState;
        this.metaReducers = metaReducers;
        // Add the @ngrx/data feature to the Store's features
        // as Store.forFeature does for StoreFeatureModule
        /** @type {?} */
        const key = entityCacheName || ENTITY_CACHE_NAME;
        initialState =
            typeof initialState === 'function' ? initialState() : initialState;
        /** @type {?} */
        const reducers = (metaReducers || []).map((/**
         * @param {?} mr
         * @return {?}
         */
        mr => {
            return mr instanceof InjectionToken ? injector.get(mr) : mr;
        }));
        this.entityCacheFeature = {
            key,
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
    static forRoot(config) {
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    }
}
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
            },] },
];
/** @nocollapse */
EntityDataModuleWithoutEffects.ctorParameters = () => [
    { type: ReducerManager },
    { type: EntityCacheReducerFactory },
    { type: Injector },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_NAME_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [INITIAL_ENTITY_CACHE_STATE,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_CACHE_META_REDUCERS,] }] }
];
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
//# sourceMappingURL=entity-data-without-effects.module.js.map