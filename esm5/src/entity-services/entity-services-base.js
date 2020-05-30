/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-services-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityServicesElements } from './entity-services-elements';
// tslint:disable:member-ordering
/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * \@example
 * export class EntityServices extends EntityServicesBase {
 *   constructor(entityServicesElements: EntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 */
var EntityServicesBase = /** @class */ (function () {
    // Dear @ngrx/data developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    function EntityServicesBase(entityServicesElements) {
        this.entityServicesElements = entityServicesElements;
        /**
         * Registry of EntityCollectionService instances
         */
        this.EntityCollectionServices = {};
    }
    Object.defineProperty(EntityServicesBase.prototype, "entityActionErrors$", {
        // #region EntityServicesElement-based properties
        /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
        get: 
        // #region EntityServicesElement-based properties
        /**
         * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
         * @return {?}
         */
        function () {
            return this.entityServicesElements.entityActionErrors$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "entityCache$", {
        /** Observable of the entire entity cache */
        get: /**
         * Observable of the entire entity cache
         * @return {?}
         */
        function () {
            return this.entityServicesElements.entityCache$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "entityCollectionServiceFactory", {
        /** Factory to create a default instance of an EntityCollectionService */
        get: /**
         * Factory to create a default instance of an EntityCollectionService
         * @return {?}
         */
        function () {
            return this.entityServicesElements.entityCollectionServiceFactory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "reducedActions$", {
        /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent action reduced by the store.
         */
        get: /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent action reduced by the store.
         * @return {?}
         */
        function () {
            return this.entityServicesElements.reducedActions$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityServicesBase.prototype, "store", {
        /** The ngrx store, scoped to the EntityCache */
        get: /**
         * The ngrx store, scoped to the EntityCache
         * @protected
         * @return {?}
         */
        function () {
            return this.entityServicesElements.store;
        },
        enumerable: true,
        configurable: true
    });
    // #endregion EntityServicesElement-based properties
    /** Dispatch any action to the store */
    // #endregion EntityServicesElement-based properties
    /**
     * Dispatch any action to the store
     * @param {?} action
     * @return {?}
     */
    EntityServicesBase.prototype.dispatch = 
    // #endregion EntityServicesElement-based properties
    /**
     * Dispatch any action to the store
     * @param {?} action
     * @return {?}
     */
    function (action) {
        this.store.dispatch(action);
    };
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @protected
     * @template T, S$
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    EntityServicesBase.prototype.createEntityCollectionService = /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @protected
     * @template T, S$
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    function (entityName) {
        return this.entityCollectionServiceFactory.create(entityName);
    };
    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    /**
     * Get (or create) the singleton instance of an EntityCollectionService
     * @template T, S$
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    EntityServicesBase.prototype.getEntityCollectionService = /**
     * Get (or create) the singleton instance of an EntityCollectionService
     * @template T, S$
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    function (entityName) {
        /** @type {?} */
        var service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    };
    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    /**
     * Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @template T
     * @param {?} service {EntityCollectionService} The entity service
     * @param {?=} serviceName {string} optional service name to use instead of the service's entityName
     * @return {?}
     */
    EntityServicesBase.prototype.registerEntityCollectionService = /**
     * Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @template T
     * @param {?} service {EntityCollectionService} The entity service
     * @param {?=} serviceName {string} optional service name to use instead of the service's entityName
     * @return {?}
     */
    function (service, serviceName) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    };
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param {?} entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     * @return {?}
     */
    EntityServicesBase.prototype.registerEntityCollectionServices = /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param {?} entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     * @return {?}
     */
    function (entityCollectionServices) {
        var _this = this;
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach((/**
             * @param {?} service
             * @return {?}
             */
            function (service) {
                return _this.registerEntityCollectionService(service);
            }));
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach((/**
             * @param {?} serviceName
             * @return {?}
             */
            function (serviceName) {
                _this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
            }));
        }
    };
    EntityServicesBase.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityServicesBase.ctorParameters = function () { return [
        { type: EntityServicesElements }
    ]; };
    return EntityServicesBase;
}());
export { EntityServicesBase };
if (false) {
    /**
     * Registry of EntityCollectionService instances
     * @type {?}
     * @private
     */
    EntityServicesBase.prototype.EntityCollectionServices;
    /**
     * @type {?}
     * @private
     */
    EntityServicesBase.prototype.entityServicesElements;
}
//# sourceMappingURL=entity-services-base.js.map