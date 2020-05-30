/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-collection-creator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
export class EntityCollectionCreator {
    /**
     * @param {?=} entityDefinitionService
     */
    constructor(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /**
     * Create the default collection for an entity type.
     * @template T, S
     * @param {?} entityName {string} entity type name
     * @return {?}
     */
    create(entityName) {
        /** @type {?} */
        const def = this.entityDefinitionService &&
            this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
        /** @type {?} */
        const initialState = def && def.initialState;
        return (/** @type {?} */ ((initialState || createEmptyEntityCollection(entityName))));
    }
}
EntityCollectionCreator.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntityCollectionCreator.ctorParameters = () => [
    { type: EntityDefinitionService, decorators: [{ type: Optional }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionCreator.prototype.entityDefinitionService;
}
/**
 * @template T
 * @param {?=} entityName
 * @return {?}
 */
export function createEmptyEntityCollection(entityName) {
    return (/** @type {?} */ ({
        entityName,
        ids: [],
        entities: {},
        filter: undefined,
        loaded: false,
        loading: false,
        changeState: {},
    }));
}
//# sourceMappingURL=entity-collection-creator.js.map