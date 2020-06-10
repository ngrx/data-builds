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
        { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDL0UsT0FBTyxFQUdMLHFCQUFxQixHQUN0QixNQUFNLG1CQUFtQixDQUFDOzs7O0FBRTNCLHVDQUVDOzs7O0FBR0Q7SUFLRSxpQ0FHRSxrQkFBdUM7UUFIekMsaUJBUUM7Ozs7UUFWZ0IsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBT25ELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsa0JBQWtCLENBQUMsT0FBTzs7OztZQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUE3QixDQUE2QixFQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRzs7Ozs7Ozs7Ozs7O0lBQ0gsK0NBQWE7Ozs7Ozs7Ozs7O0lBQWIsVUFDRSxVQUFrQixFQUNsQixXQUFrQjtRQUFsQiw0QkFBQSxFQUFBLGtCQUFrQjtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDOztZQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBd0MsVUFBVSxRQUFJLENBQUMsQ0FBQztTQUN6RTtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx3Q0FBd0M7SUFFeEM7Ozs7Ozs7T0FPRzs7Ozs7OztJQUNILGtEQUFnQjs7Ozs7OztJQUFoQixVQUFpQixRQUF3QjtRQUN2QyxJQUFJLFFBQVEsRUFBRTs7Z0JBQ04sVUFBVSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztZQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHOzs7Ozs7Ozs7Ozs7SUFDSCxxREFBbUI7Ozs7Ozs7Ozs7O0lBQW5CLFVBQW9CLFdBQW1DO1FBQXZELGlCQUtDO1FBTG1CLDRCQUFBLEVBQUEsZ0JBQW1DO1FBQ3JELHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxVQUFVO1lBQ2hELE9BQUEsS0FBSSxDQUFDLGdCQUFnQixZQUFHLFVBQVUsWUFBQSxJQUFLLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRztRQUFqRSxDQUFpRSxFQUNsRSxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRzs7Ozs7Ozs7OztJQUNILG9EQUFrQjs7Ozs7Ozs7O0lBQWxCLFVBQXNCLFVBQStCO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHOzs7Ozs7Ozs7Ozs7SUFDSCxxREFBbUI7Ozs7Ozs7Ozs7O0lBQW5CLFVBQW9CLFdBQThCO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDOztnQkE1RkYsVUFBVTs7Ozs0Q0FNTixRQUFRLFlBQ1IsTUFBTSxTQUFDLHFCQUFxQjs7SUFzRmpDLDhCQUFDO0NBQUEsQUE3RkQsSUE2RkM7U0E1RlksdUJBQXVCOzs7Ozs7O0lBRWxDLDhDQUFxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgY3JlYXRlRW50aXR5RGVmaW5pdGlvbiwgRW50aXR5RGVmaW5pdGlvbiB9IGZyb20gJy4vZW50aXR5LWRlZmluaXRpb24nO1xuaW1wb3J0IHtcbiAgRW50aXR5TWV0YWRhdGEsXG4gIEVudGl0eU1ldGFkYXRhTWFwLFxuICBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG59IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEZWZpbml0aW9ucyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBFbnRpdHlEZWZpbml0aW9uPGFueT47XG59XG5cbi8qKiBSZWdpc3RyeSBvZiBFbnRpdHlEZWZpbml0aW9ucyBmb3IgYWxsIGNhY2hlZCBlbnRpdHkgdHlwZXMgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB7XG4gIC8qKiB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIGFsbCBjYWNoZWQgZW50aXR5IHR5cGVzICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVmaW5pdGlvbnM6IEVudGl0eURlZmluaXRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9NRVRBREFUQV9UT0tFTilcbiAgICBlbnRpdHlNZXRhZGF0YU1hcHM6IEVudGl0eU1ldGFkYXRhTWFwW11cbiAgKSB7XG4gICAgaWYgKGVudGl0eU1ldGFkYXRhTWFwcykge1xuICAgICAgZW50aXR5TWV0YWRhdGFNYXBzLmZvckVhY2goKG1hcCkgPT4gdGhpcy5yZWdpc3Rlck1ldGFkYXRhTWFwKG1hcCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgKG9yIGNyZWF0ZSkgYSBkYXRhIHNlcnZpY2UgZm9yIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgZ2V0RGVmaW5pdGlvbignSGVybycpOyAvLyBkZWZpbml0aW9uIGZvciBIZXJvZXMsIHVudHlwZWRcbiAgICogICBnZXREZWZpbml0aW9uPEhlcm8+KGBIZXJvYCk7IC8vIGRlZmluaXRpb24gZm9yIEhlcm9lcywgdHlwZWQgd2l0aCBIZXJvIGludGVyZmFjZVxuICAgKi9cbiAgZ2V0RGVmaW5pdGlvbjxUPihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgc2hvdWxkVGhyb3cgPSB0cnVlXG4gICk6IEVudGl0eURlZmluaXRpb248VD4ge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gdGhpcy5kZWZpbml0aW9uc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIWRlZmluaXRpb24gJiYgc2hvdWxkVGhyb3cpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gRW50aXR5RGVmaW5pdGlvbiBmb3IgZW50aXR5IHR5cGUgXCIke2VudGl0eU5hbWV9XCIuYCk7XG4gICAgfVxuICAgIHJldHVybiBkZWZpbml0aW9uO1xuICB9XG5cbiAgLy8vLy8vLy8gUmVnaXN0cmF0aW9uIG1ldGhvZHMgLy8vLy8vLy8vL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIHJlZ2lzdGVyIHRoZSB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIHRoZSB7RW50aXR5TWV0YWRhdGF9IG9mIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBkZWZpbml0aW9uIC0ge0VudGl0eU1ldGFkYXRhfSBmb3IgYSBjb2xsZWN0aW9uIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyTWV0YWRhdGEobXlIZXJvRW50aXR5RGVmaW5pdGlvbik7XG4gICAqL1xuICByZWdpc3Rlck1ldGFkYXRhKG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YSkge1xuICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IGNyZWF0ZUVudGl0eURlZmluaXRpb24obWV0YWRhdGEpO1xuICAgICAgdGhpcy5yZWdpc3RlckRlZmluaXRpb24oZGVmaW5pdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIEVudGl0eU1ldGFkYXRhTWFwLlxuICAgKiBAcGFyYW0gbWV0YWRhdGFNYXAgLSBhIG1hcCBvZiBlbnRpdHlUeXBlIG5hbWVzIHRvIGVudGl0eSBtZXRhZGF0YVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3Rlck1ldGFkYXRhTWFwKHtcbiAgICogICAgICdIZXJvJzogbXlIZXJvTWV0YWRhdGEsXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5NZXRhZGF0YVxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJNZXRhZGF0YU1hcChtZXRhZGF0YU1hcDogRW50aXR5TWV0YWRhdGFNYXAgPSB7fSkge1xuICAgIC8vIFRoZSBlbnRpdHkgdHlwZSBuYW1lIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgbWFwIGtleVxuICAgIE9iamVjdC5rZXlzKG1ldGFkYXRhTWFwIHx8IHt9KS5mb3JFYWNoKChlbnRpdHlOYW1lKSA9PlxuICAgICAgdGhpcy5yZWdpc3Rlck1ldGFkYXRhKHsgZW50aXR5TmFtZSwgLi4ubWV0YWRhdGFNYXBbZW50aXR5TmFtZV0gfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGRlZmluaXRpb24gLSBFbnRpdHlEZWZpbml0aW9uIG9mIGEgY29sbGVjdGlvbiBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlckRlZmluaXRpb24oJ0hlcm8nLCBteUhlcm9FbnRpdHlEZWZpbml0aW9uKTtcbiAgICovXG4gIHJlZ2lzdGVyRGVmaW5pdGlvbjxUPihkZWZpbml0aW9uOiBFbnRpdHlEZWZpbml0aW9uPFQ+KSB7XG4gICAgdGhpcy5kZWZpbml0aW9uc1tkZWZpbml0aW9uLmVudGl0eU5hbWVdID0gZGVmaW5pdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGJhdGNoIG9mIEVudGl0eURlZmluaXRpb25zLlxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbnMgLSBtYXAgb2YgZW50aXR5VHlwZSBuYW1lIGFuZCBhc3NvY2lhdGVkIEVudGl0eURlZmluaXRpb25zIHRvIG1lcmdlLlxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlckRlZmluaXRpb25zKHtcbiAgICogICAgICdIZXJvJzogbXlIZXJvRW50aXR5RGVmaW5pdGlvbixcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbkVudGl0eURlZmluaXRpb25cbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyRGVmaW5pdGlvbnMoZGVmaW5pdGlvbnM6IEVudGl0eURlZmluaXRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmRlZmluaXRpb25zLCBkZWZpbml0aW9ucyk7XG4gIH1cbn1cbiJdfQ==