/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/entity-data.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { DefaultDataServiceFactory } from './default-data.service';
/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
export class EntityDataService {
    // TODO:  Optionally inject specialized entity data services
    // for those that aren't derived from BaseDataService.
    /**
     * @param {?} defaultDataServiceFactory
     */
    constructor(defaultDataServiceFactory) {
        this.defaultDataServiceFactory = defaultDataServiceFactory;
        this.services = {};
    }
    /**
     * Get (or create) a data service for entity type
     * @template T
     * @param {?} entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     * @return {?}
     */
    getService(entityName) {
        entityName = entityName.trim();
        /** @type {?} */
        let service = this.services[entityName];
        if (!service) {
            service = this.defaultDataServiceFactory.create(entityName);
            this.services[entityName] = service;
        }
        return service;
    }
    /**
     * Register an EntityCollectionDataService for an entity type
     * @template T
     * @param {?} entityName - the name of the entity type
     * @param {?} service - data service for that entity type
     *
     * Examples:
     *   registerService('Hero', myHeroDataService);
     *   registerService('Villain', myVillainDataService);
     * @return {?}
     */
    registerService(entityName, service) {
        this.services[entityName.trim()] = service;
    }
    /**
     * Register a batch of data services.
     * @param {?} services - data services to merge into existing services
     *
     * Examples:
     *   registerServices({
     *     Hero: myHeroDataService,
     *     Villain: myVillainDataService
     *   });
     * @return {?}
     */
    registerServices(services) {
        this.services = Object.assign(Object.assign({}, this.services), services);
    }
}
EntityDataService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntityDataService.ctorParameters = () => [
    { type: DefaultDataServiceFactory }
];
if (false) {
    /**
     * @type {?}
     * @protected
     */
    EntityDataService.prototype.services;
    /**
     * @type {?}
     * @protected
     */
    EntityDataService.prototype.defaultDataServiceFactory;
}
//# sourceMappingURL=entity-data.service.js.map