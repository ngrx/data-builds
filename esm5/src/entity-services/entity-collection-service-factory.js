/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-collection-service-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase } from './entity-collection-service-base';
import { EntityCollectionServiceElementsFactory } from './entity-collection-service-elements-factory';
/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
var EntityCollectionServiceFactory = /** @class */ (function () {
    function EntityCollectionServiceFactory(entityCollectionServiceElementsFactory) {
        this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
    }
    /**
     * Create an EntityCollectionService for an entity type
     * @param entityName - name of the entity type
     */
    /**
     * Create an EntityCollectionService for an entity type
     * @template T, S$
     * @param {?} entityName - name of the entity type
     * @return {?}
     */
    EntityCollectionServiceFactory.prototype.create = /**
     * Create an EntityCollectionService for an entity type
     * @template T, S$
     * @param {?} entityName - name of the entity type
     * @return {?}
     */
    function (entityName) {
        return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
    };
    EntityCollectionServiceFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityCollectionServiceFactory.ctorParameters = function () { return [
        { type: EntityCollectionServiceElementsFactory }
    ]; };
    return EntityCollectionServiceFactory;
}());
export { EntityCollectionServiceFactory };
if (false) {
    /**
     * Creates the core elements of the EntityCollectionService for an entity type.
     * @type {?}
     */
    EntityCollectionServiceFactory.prototype.entityCollectionServiceElementsFactory;
}
//# sourceMappingURL=entity-collection-service-factory.js.map