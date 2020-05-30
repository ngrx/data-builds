/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes,extraRequire}
 * tslint:disable
 */ 
import * as i0 from "@angular/core";
import * as i1 from "./entity-data-without-effects.module";
import * as i2 from "./utils/correlation-id-generator";
import * as i3 from "./dispatchers/entity-dispatcher-default-options";
import * as i4 from "./actions/entity-action-factory";
import * as i5 from "./dispatchers/entity-cache-dispatcher";
import * as i6 from "@ngrx/store";
import * as i7 from "./selectors/entity-cache-selector";
import * as i8 from "./reducers/constants";
import * as i9 from "./dispatchers/entity-dispatcher-factory";
import * as i10 from "./selectors/entity-selectors";
import * as i11 from "./reducers/entity-collection-creator";
import * as i12 from "./selectors/entity-selectors$";
import * as i13 from "@ngrx/effects";
import * as i14 from "./entity-services/entity-collection-service-elements-factory";
import * as i15 from "./entity-metadata/entity-definition.service";
import * as i16 from "./entity-services/entity-collection-service-factory";
import * as i17 from "./entity-services/entity-services-elements";
import * as i18 from "./entity-services/entity-services";
import * as i19 from "./entity-services/entity-services-base";
import * as i20 from "./entity-metadata/entity-metadata";
import * as i21 from "./reducers/entity-collection-reducer-methods";
import * as i22 from "./reducers/entity-collection-reducer";
import * as i23 from "./reducers/entity-collection-reducer-registry";
import * as i24 from "./utils/interfaces";
import * as i25 from "./utils/default-logger";
import * as i26 from "./reducers/entity-cache-reducer";
var EntityDataModuleWithoutEffectsNgFactory = i0.ɵcmf(i1.EntityDataModuleWithoutEffects, [], function (_l) { return i0.ɵmod([i0.ɵmpd(512, i0.ComponentFactoryResolver, i0.ɵCodegenComponentFactoryResolver, [[8, []], [3, i0.ComponentFactoryResolver], i0.NgModuleRef]), i0.ɵmpd(4608, i2.CorrelationIdGenerator, i2.CorrelationIdGenerator, []), i0.ɵmpd(4608, i3.EntityDispatcherDefaultOptions, i3.EntityDispatcherDefaultOptions, []), i0.ɵmpd(4608, i4.EntityActionFactory, i4.EntityActionFactory, []), i0.ɵmpd(4608, i5.EntityCacheDispatcher, i5.EntityCacheDispatcher, [i2.CorrelationIdGenerator, i3.EntityDispatcherDefaultOptions, i6.ScannedActionsSubject, i6.Store]), i0.ɵmpd(5120, i7.ENTITY_CACHE_SELECTOR_TOKEN, i7.createEntityCacheSelector, [[2, i8.ENTITY_CACHE_NAME_TOKEN]]), i0.ɵmpd(135680, i9.EntityDispatcherFactory, i9.EntityDispatcherFactory, [i4.EntityActionFactory, i6.Store, i3.EntityDispatcherDefaultOptions, i6.ScannedActionsSubject, i7.ENTITY_CACHE_SELECTOR_TOKEN, i2.CorrelationIdGenerator]), i0.ɵmpd(4608, i10.EntitySelectorsFactory, i10.EntitySelectorsFactory, [[2, i11.EntityCollectionCreator], [2, i7.ENTITY_CACHE_SELECTOR_TOKEN]]), i0.ɵmpd(4608, i12.EntitySelectors$Factory, i12.EntitySelectors$Factory, [i6.Store, i13.Actions, i7.ENTITY_CACHE_SELECTOR_TOKEN]), i0.ɵmpd(4608, i14.EntityCollectionServiceElementsFactory, i14.EntityCollectionServiceElementsFactory, [i9.EntityDispatcherFactory, i15.EntityDefinitionService, i10.EntitySelectorsFactory, i12.EntitySelectors$Factory]), i0.ɵmpd(4608, i16.EntityCollectionServiceFactory, i16.EntityCollectionServiceFactory, [i14.EntityCollectionServiceElementsFactory]), i0.ɵmpd(4608, i17.EntityServicesElements, i17.EntityServicesElements, [i16.EntityCollectionServiceFactory, i9.EntityDispatcherFactory, i12.EntitySelectors$Factory, i6.Store]), i0.ɵmpd(4608, i18.EntityServices, i19.EntityServicesBase, [i17.EntityServicesElements]), i0.ɵmpd(1073742336, i6.StoreModule, i6.StoreModule, []), i0.ɵmpd(512, i15.EntityDefinitionService, i15.EntityDefinitionService, [[2, i20.ENTITY_METADATA_TOKEN]]), i0.ɵmpd(512, i11.EntityCollectionCreator, i11.EntityCollectionCreator, [[2, i15.EntityDefinitionService]]), i0.ɵmpd(512, i21.EntityCollectionReducerMethodsFactory, i21.EntityCollectionReducerMethodsFactory, [i15.EntityDefinitionService]), i0.ɵmpd(512, i22.EntityCollectionReducerFactory, i22.EntityCollectionReducerFactory, [i21.EntityCollectionReducerMethodsFactory]), i0.ɵmpd(512, i23.EntityCollectionReducerRegistry, i23.EntityCollectionReducerRegistry, [i22.EntityCollectionReducerFactory, [2, i8.ENTITY_COLLECTION_META_REDUCERS]]), i0.ɵmpd(512, i24.Logger, i25.DefaultLogger, []), i0.ɵmpd(512, i26.EntityCacheReducerFactory, i26.EntityCacheReducerFactory, [i11.EntityCollectionCreator, i23.EntityCollectionReducerRegistry, i24.Logger]), i0.ɵmpd(256, i8.ENTITY_CACHE_NAME_TOKEN, i1.ɵ0, []), i0.ɵmpd(1073873408, i1.EntityDataModuleWithoutEffects, i1.EntityDataModuleWithoutEffects, [i6.ReducerManager, i26.EntityCacheReducerFactory, i0.Injector, [2, i8.ENTITY_CACHE_NAME_TOKEN], [2, i8.INITIAL_ENTITY_CACHE_STATE], [2, i8.ENTITY_CACHE_META_REDUCERS]])]); });
export { EntityDataModuleWithoutEffectsNgFactory as EntityDataModuleWithoutEffectsNgFactory };
//# sourceMappingURL=entity-data-without-effects.module.ngfactory.js.map