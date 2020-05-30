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
var EntityDefinitionService = /** @class */ (function () {
    function EntityDefinitionService(entityMetadataMaps) {
        var _this = this;
        /**
         * {EntityDefinition} for all cached entity types
         */
        this.definitions = {};
        if (entityMetadataMaps) {
            entityMetadataMaps.forEach((/**
             * @param {?} map
             * @return {?}
             */
            function (map) { return _this.registerMetadataMap(map); }));
        }
    }
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getDefinition('Hero'); // definition for Heroes, untyped
     *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
     */
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
    EntityDefinitionService.prototype.getDefinition = /**
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
    function (entityName, shouldThrow) {
        if (shouldThrow === void 0) { shouldThrow = true; }
        entityName = entityName.trim();
        /** @type {?} */
        var definition = this.definitions[entityName];
        if (!definition && shouldThrow) {
            throw new Error("No EntityDefinition for entity type \"" + entityName + "\".");
        }
        return definition;
    };
    //////// Registration methods //////////
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param name - the name of the entity type
     * @param definition - {EntityMetadata} for a collection for that entity type
     *
     * Examples:
     *   registerMetadata(myHeroEntityDefinition);
     */
    //////// Registration methods //////////
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param {?} metadata
     * @return {?}
     */
    EntityDefinitionService.prototype.registerMetadata = 
    //////// Registration methods //////////
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param {?} metadata
     * @return {?}
     */
    function (metadata) {
        if (metadata) {
            /** @type {?} */
            var definition = createEntityDefinition(metadata);
            this.registerDefinition(definition);
        }
    };
    /**
     * Register an EntityMetadataMap.
     * @param metadataMap - a map of entityType names to entity metadata
     *
     * Examples:
     *   registerMetadataMap({
     *     'Hero': myHeroMetadata,
     *     Villain: myVillainMetadata
     *   });
     */
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
    EntityDefinitionService.prototype.registerMetadataMap = /**
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
    function (metadataMap) {
        var _this = this;
        if (metadataMap === void 0) { metadataMap = {}; }
        // The entity type name should be the same as the map key
        Object.keys(metadataMap || {}).forEach((/**
         * @param {?} entityName
         * @return {?}
         */
        function (entityName) {
            return _this.registerMetadata(__assign({ entityName: entityName }, metadataMap[entityName]));
        }));
    };
    /**
     * Register an {EntityDefinition} for an entity type
     * @param definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     */
    /**
     * Register an {EntityDefinition} for an entity type
     * @template T
     * @param {?} definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     * @return {?}
     */
    EntityDefinitionService.prototype.registerDefinition = /**
     * Register an {EntityDefinition} for an entity type
     * @template T
     * @param {?} definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     * @return {?}
     */
    function (definition) {
        this.definitions[definition.entityName] = definition;
    };
    /**
     * Register a batch of EntityDefinitions.
     * @param definitions - map of entityType name and associated EntityDefinitions to merge.
     *
     * Examples:
     *   registerDefinitions({
     *     'Hero': myHeroEntityDefinition,
     *     Villain: myVillainEntityDefinition
     *   });
     */
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
    EntityDefinitionService.prototype.registerDefinitions = /**
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
    function (definitions) {
        Object.assign(this.definitions, definitions);
    };
    EntityDefinitionService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityDefinitionService.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_METADATA_TOKEN,] }] }
    ]; };
    return EntityDefinitionService;
}());
export { EntityDefinitionService };
if (false) {
    /**
     * {EntityDefinition} for all cached entity types
     * @type {?}
     * @private
     */
    EntityDefinitionService.prototype.definitions;
}
//# sourceMappingURL=entity-definition.service.js.map