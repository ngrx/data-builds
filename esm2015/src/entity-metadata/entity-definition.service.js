/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-metadata/entity-definition.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { createEntityDefinition } from './entity-definition';
import { ENTITY_METADATA_TOKEN, } from './entity-metadata';
/**
 * @record
 */
export function EntityDefinitions() { }
/**
 * Registry of EntityDefinitions for all cached entity types
 */
export class EntityDefinitionService {
    /**
     * @param {?} entityMetadataMaps
     */
    constructor(entityMetadataMaps) {
        /**
         * {EntityDefinition} for all cached entity types
         */
        this.definitions = {};
        if (entityMetadataMaps) {
            entityMetadataMaps.forEach((/**
             * @param {?} map
             * @return {?}
             */
            map => this.registerMetadataMap(map)));
        }
    }
    /**
     * Get (or create) a data service for entity type
     * @template T
     * @param {?} entityName - the name of the type
     *
     * Examples:
     *   getDefinition('Hero'); // definition for Heroes, untyped
     *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
     * @param {?=} shouldThrow
     * @return {?}
     */
    getDefinition(entityName, shouldThrow = true) {
        entityName = entityName.trim();
        /** @type {?} */
        const definition = this.definitions[entityName];
        if (!definition && shouldThrow) {
            throw new Error(`No EntityDefinition for entity type "${entityName}".`);
        }
        return definition;
    }
    //////// Registration methods //////////
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param {?} metadata
     * @return {?}
     */
    registerMetadata(metadata) {
        if (metadata) {
            /** @type {?} */
            const definition = createEntityDefinition(metadata);
            this.registerDefinition(definition);
        }
    }
    /**
     * Register an EntityMetadataMap.
     * @param {?=} metadataMap - a map of entityType names to entity metadata
     *
     * Examples:
     *   registerMetadataMap({
     *     'Hero': myHeroMetadata,
     *     Villain: myVillainMetadata
     *   });
     * @return {?}
     */
    registerMetadataMap(metadataMap = {}) {
        // The entity type name should be the same as the map key
        Object.keys(metadataMap || {}).forEach((/**
         * @param {?} entityName
         * @return {?}
         */
        entityName => this.registerMetadata(Object.assign({ entityName }, metadataMap[entityName]))));
    }
    /**
     * Register an {EntityDefinition} for an entity type
     * @template T
     * @param {?} definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     * @return {?}
     */
    registerDefinition(definition) {
        this.definitions[definition.entityName] = definition;
    }
    /**
     * Register a batch of EntityDefinitions.
     * @param {?} definitions - map of entityType name and associated EntityDefinitions to merge.
     *
     * Examples:
     *   registerDefinitions({
     *     'Hero': myHeroEntityDefinition,
     *     Villain: myVillainEntityDefinition
     *   });
     * @return {?}
     */
    registerDefinitions(definitions) {
        Object.assign(this.definitions, definitions);
    }
}
EntityDefinitionService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntityDefinitionService.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_METADATA_TOKEN,] }] }
];
if (false) {
    /**
     * {EntityDefinition} for all cached entity types
     * @type {?}
     * @private
     */
    EntityDefinitionService.prototype.definitions;
}
//# sourceMappingURL=entity-definition.service.js.map