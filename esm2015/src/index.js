/**
 * @fileoverview added by tsickle
 * Generated from: src/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// actions
export { EntityActionFactory } from './actions/entity-action-factory';
export { EntityActionGuard } from './actions/entity-action-guard';
export { ofEntityOp, ofEntityType } from './actions/entity-action-operators';
export { EntityCacheAction, ClearCollections, LoadCollections, MergeQuerySet, SetEntityCache, SaveEntities, SaveEntitiesCancel, SaveEntitiesCanceled, SaveEntitiesError, SaveEntitiesSuccess, } from './actions/entity-cache-action';
export { ChangeSetOperation, ChangeSetItemFactory, changeSetItemFactory, excludeEmptyChangeSetItems, } from './actions/entity-cache-change-set';
export { EntityOp, OP_SUCCESS, OP_ERROR, makeErrorOp, makeSuccessOp, } from './actions/entity-op';
export { MergeStrategy } from './actions/merge-strategy';
// // dataservices
export { DataServiceError } from './dataservices/data-service-error';
export { DefaultDataServiceConfig } from './dataservices/default-data-service-config';
export { DefaultDataService } from './dataservices/default-data.service';
export { DefaultDataServiceFactory } from './dataservices/default-data.service';
export { EntityCacheDataService } from './dataservices/entity-cache-data.service';
export { EntityDataService } from './dataservices/entity-data.service';
export { EntityHttpResourceUrls } from './dataservices/http-url-generator';
export { HttpUrlGenerator } from './dataservices/http-url-generator';
export { DefaultHttpUrlGenerator } from './dataservices/http-url-generator';
export { normalizeRoot } from './dataservices/http-url-generator';
export { PersistenceResultHandler, DefaultPersistenceResultHandler, } from './dataservices/persistence-result-handler.service';
// // dispatchers
export { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
export { EntityDispatcherBase } from './dispatchers/entity-dispatcher-base';
export { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
export { EntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
export { PersistanceCanceled, } from './dispatchers/entity-dispatcher';
// // effects
export { EntityCacheEffects } from './effects/entity-cache-effects';
export { persistOps, EntityEffects } from './effects/entity-effects';
// // entity-metadata
export { EntityDefinitionService, } from './entity-metadata/entity-definition.service';
export { createEntityDefinition, } from './entity-metadata/entity-definition';
export { PropsFilterFnFactory, } from './entity-metadata/entity-filters';
export { ENTITY_METADATA_TOKEN, } from './entity-metadata/entity-metadata';
// // entity-services
export { EntityCollectionServiceBase } from './entity-services/entity-collection-service-base';
export { EntityCollectionServiceElementsFactory, } from './entity-services/entity-collection-service-elements-factory';
export { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
export { EntityServicesBase } from './entity-services/entity-services-base';
export { EntityServicesElements } from './entity-services/entity-services-elements';
export { EntityServices, } from './entity-services/entity-services';
// // reducers
export { ENTITY_CACHE_NAME, ENTITY_CACHE_NAME_TOKEN, ENTITY_CACHE_META_REDUCERS, ENTITY_COLLECTION_META_REDUCERS, INITIAL_ENTITY_CACHE_STATE, } from './reducers/constants';
export { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
export { EntityChangeTrackerBase } from './reducers/entity-change-tracker-base';
export { EntityCollectionCreator, createEmptyEntityCollection, } from './reducers/entity-collection-creator';
export { EntityCollectionReducerMethods, EntityCollectionReducerMethodsFactory, } from './reducers/entity-collection-reducer-methods';
export { EntityCollectionReducerRegistry, } from './reducers/entity-collection-reducer-registry';
export { EntityCollectionReducerFactory, } from './reducers/entity-collection-reducer';
export { ChangeType, } from './reducers/entity-collection';
// // selectors
export { ENTITY_CACHE_SELECTOR_TOKEN, entityCacheSelectorProvider, createEntityCacheSelector, } from './selectors/entity-cache-selector';
export { EntitySelectorsFactory, } from './selectors/entity-selectors';
export { EntitySelectors$Factory, } from './selectors/entity-selectors$';
// // Utils
export { CorrelationIdGenerator } from './utils/correlation-id-generator';
export { DefaultLogger } from './utils/default-logger';
export { DefaultPluralizer } from './utils/default-pluralizer';
export { getGuid, getGuidComb, guidComparer } from './utils/guid-fns';
export { Logger, PLURAL_NAMES_TOKEN, Pluralizer, } from './utils/interfaces';
export { defaultSelectId, flattenArgs, toUpdateFactory, } from './utils/utilities';
// // EntityDataModule
export { EntityDataModuleWithoutEffects, } from './entity-data-without-effects.module';
export { EntityDataModule } from './entity-data.module';
//# sourceMappingURL=index.js.map