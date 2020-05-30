/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-services-elements.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntitySelectors$Factory } from '../selectors/entity-selectors$';
import { EntityCollectionServiceFactory } from './entity-collection-service-factory';
/**
 * Core ingredients of an EntityServices class
 */
export class EntityServicesElements {
    /**
     * @param {?} entityCollectionServiceFactory
     * @param {?} entityDispatcherFactory
     * @param {?} entitySelectors$Factory
     * @param {?} store
     */
    constructor(entityCollectionServiceFactory, 
    /** Creates EntityDispatchers for entity collections */
    entityDispatcherFactory, 
    /** Creates observable EntitySelectors$ for entity collections. */
    entitySelectors$Factory, store) {
        this.entityCollectionServiceFactory = entityCollectionServiceFactory;
        this.store = store;
        this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
        this.entityCache$ = entitySelectors$Factory.entityCache$;
        this.reducedActions$ = entityDispatcherFactory.reducedActions$;
    }
}
EntityServicesElements.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntityServicesElements.ctorParameters = () => [
    { type: EntityCollectionServiceFactory },
    { type: EntityDispatcherFactory },
    { type: EntitySelectors$Factory },
    { type: Store }
];
if (false) {
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @type {?}
     */
    EntityServicesElements.prototype.entityActionErrors$;
    /**
     * Observable of the entire entity cache
     * @type {?}
     */
    EntityServicesElements.prototype.entityCache$;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @type {?}
     */
    EntityServicesElements.prototype.reducedActions$;
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     * @type {?}
     */
    EntityServicesElements.prototype.entityCollectionServiceFactory;
    /**
     * The ngrx store, scoped to the EntityCache
     * @type {?}
     */
    EntityServicesElements.prototype.store;
}
//# sourceMappingURL=entity-services-elements.js.map