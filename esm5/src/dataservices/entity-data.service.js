var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var EntityDataService = /** @class */ (function () {
    // TODO:  Optionally inject specialized entity data services
    // for those that aren't derived from BaseDataService.
    function EntityDataService(defaultDataServiceFactory) {
        this.defaultDataServiceFactory = defaultDataServiceFactory;
        this.services = {};
    }
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     */
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
    EntityDataService.prototype.getService = /**
     * Get (or create) a data service for entity type
     * @template T
     * @param {?} entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     * @return {?}
     */
    function (entityName) {
        entityName = entityName.trim();
        /** @type {?} */
        var service = this.services[entityName];
        if (!service) {
            service = this.defaultDataServiceFactory.create(entityName);
            this.services[entityName] = service;
        }
        return service;
    };
    /**
     * Register an EntityCollectionDataService for an entity type
     * @param entityName - the name of the entity type
     * @param service - data service for that entity type
     *
     * Examples:
     *   registerService('Hero', myHeroDataService);
     *   registerService('Villain', myVillainDataService);
     */
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
    EntityDataService.prototype.registerService = /**
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
    function (entityName, service) {
        this.services[entityName.trim()] = service;
    };
    /**
     * Register a batch of data services.
     * @param services - data services to merge into existing services
     *
     * Examples:
     *   registerServices({
     *     Hero: myHeroDataService,
     *     Villain: myVillainDataService
     *   });
     */
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
    EntityDataService.prototype.registerServices = /**
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
    function (services) {
        this.services = __assign(__assign({}, this.services), services);
    };
    EntityDataService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityDataService.ctorParameters = function () { return [
        { type: DefaultDataServiceFactory }
    ]; };
    return EntityDataService;
}());
export { EntityDataService };
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