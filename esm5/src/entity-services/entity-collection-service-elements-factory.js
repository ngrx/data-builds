/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-collection-service-elements-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { EntitySelectorsFactory, } from '../selectors/entity-selectors';
import { EntitySelectors$Factory, } from '../selectors/entity-selectors$';
/**
 * Core ingredients of an EntityCollectionService
 * @record
 * @template T, S$
 */
export function EntityCollectionServiceElements() { }
if (false) {
    /** @type {?} */
    EntityCollectionServiceElements.prototype.dispatcher;
    /** @type {?} */
    EntityCollectionServiceElements.prototype.entityName;
    /** @type {?} */
    EntityCollectionServiceElements.prototype.selectors;
    /** @type {?} */
    EntityCollectionServiceElements.prototype.selectors$;
}
/**
 * Creates the core elements of the EntityCollectionService for an entity type.
 */
var EntityCollectionServiceElementsFactory = /** @class */ (function () {
    function EntityCollectionServiceElementsFactory(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
        this.entityDispatcherFactory = entityDispatcherFactory;
        this.entityDefinitionService = entityDefinitionService;
        this.entitySelectorsFactory = entitySelectorsFactory;
        this.entitySelectors$Factory = entitySelectors$Factory;
    }
    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @param entityName - name of the entity type
     */
    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @template T, S$
     * @param {?} entityName - name of the entity type
     * @return {?}
     */
    EntityCollectionServiceElementsFactory.prototype.create = /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @template T, S$
     * @param {?} entityName - name of the entity type
     * @return {?}
     */
    function (entityName) {
        entityName = entityName.trim();
        /** @type {?} */
        var definition = this.entityDefinitionService.getDefinition(entityName);
        /** @type {?} */
        var dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
        /** @type {?} */
        var selectors = this.entitySelectorsFactory.create(definition.metadata);
        /** @type {?} */
        var selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
        return {
            dispatcher: dispatcher,
            entityName: entityName,
            selectors: selectors,
            selectors$: selectors$,
        };
    };
    EntityCollectionServiceElementsFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityCollectionServiceElementsFactory.ctorParameters = function () { return [
        { type: EntityDispatcherFactory },
        { type: EntityDefinitionService },
        { type: EntitySelectorsFactory },
        { type: EntitySelectors$Factory }
    ]; };
    return EntityCollectionServiceElementsFactory;
}());
export { EntityCollectionServiceElementsFactory };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entityDispatcherFactory;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entityDefinitionService;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entitySelectorsFactory;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionServiceElementsFactory.prototype.entitySelectors$Factory;
}
//# sourceMappingURL=entity-collection-service-elements-factory.js.map