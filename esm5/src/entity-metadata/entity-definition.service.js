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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDL0UsT0FBTyxFQUdMLHFCQUFxQixHQUN0QixNQUFNLG1CQUFtQixDQUFDOzs7O0FBRTNCLHVDQUVDOzs7O0FBR0Q7SUFLRSxpQ0FHRSxrQkFBdUM7UUFIekMsaUJBUUM7Ozs7UUFWZ0IsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBT25ELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsa0JBQWtCLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUE3QixDQUE2QixFQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRzs7Ozs7Ozs7Ozs7O0lBQ0gsK0NBQWE7Ozs7Ozs7Ozs7O0lBQWIsVUFDRSxVQUFrQixFQUNsQixXQUFrQjtRQUFsQiw0QkFBQSxFQUFBLGtCQUFrQjtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDOztZQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBd0MsVUFBVSxRQUFJLENBQUMsQ0FBQztTQUN6RTtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx3Q0FBd0M7SUFFeEM7Ozs7Ozs7T0FPRzs7Ozs7OztJQUNILGtEQUFnQjs7Ozs7OztJQUFoQixVQUFpQixRQUF3QjtRQUN2QyxJQUFJLFFBQVEsRUFBRTs7Z0JBQ04sVUFBVSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztZQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHOzs7Ozs7Ozs7Ozs7SUFDSCxxREFBbUI7Ozs7Ozs7Ozs7O0lBQW5CLFVBQW9CLFdBQW1DO1FBQXZELGlCQUtDO1FBTG1CLDRCQUFBLEVBQUEsZ0JBQW1DO1FBQ3JELHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxVQUFVO1lBQy9DLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixZQUFHLFVBQVUsWUFBQSxJQUFLLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRztRQUFqRSxDQUFpRSxFQUNsRSxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRzs7Ozs7Ozs7OztJQUNILG9EQUFrQjs7Ozs7Ozs7O0lBQWxCLFVBQXNCLFVBQStCO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHOzs7Ozs7Ozs7Ozs7SUFDSCxxREFBbUI7Ozs7Ozs7Ozs7O0lBQW5CLFVBQW9CLFdBQThCO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDOztnQkE1RkYsVUFBVTs7Ozs0Q0FNTixRQUFRLFlBQ1IsTUFBTSxTQUFDLHFCQUFxQjs7SUFzRmpDLDhCQUFDO0NBQUEsQUE3RkQsSUE2RkM7U0E1RlksdUJBQXVCOzs7Ozs7O0lBRWxDLDhDQUFxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgY3JlYXRlRW50aXR5RGVmaW5pdGlvbiwgRW50aXR5RGVmaW5pdGlvbiB9IGZyb20gJy4vZW50aXR5LWRlZmluaXRpb24nO1xuaW1wb3J0IHtcbiAgRW50aXR5TWV0YWRhdGEsXG4gIEVudGl0eU1ldGFkYXRhTWFwLFxuICBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG59IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEZWZpbml0aW9ucyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBFbnRpdHlEZWZpbml0aW9uPGFueT47XG59XG5cbi8qKiBSZWdpc3RyeSBvZiBFbnRpdHlEZWZpbml0aW9ucyBmb3IgYWxsIGNhY2hlZCBlbnRpdHkgdHlwZXMgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB7XG4gIC8qKiB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIGFsbCBjYWNoZWQgZW50aXR5IHR5cGVzICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVmaW5pdGlvbnM6IEVudGl0eURlZmluaXRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9NRVRBREFUQV9UT0tFTilcbiAgICBlbnRpdHlNZXRhZGF0YU1hcHM6IEVudGl0eU1ldGFkYXRhTWFwW11cbiAgKSB7XG4gICAgaWYgKGVudGl0eU1ldGFkYXRhTWFwcykge1xuICAgICAgZW50aXR5TWV0YWRhdGFNYXBzLmZvckVhY2gobWFwID0+IHRoaXMucmVnaXN0ZXJNZXRhZGF0YU1hcChtYXApKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IChvciBjcmVhdGUpIGEgZGF0YSBzZXJ2aWNlIGZvciBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGdldERlZmluaXRpb24oJ0hlcm8nKTsgLy8gZGVmaW5pdGlvbiBmb3IgSGVyb2VzLCB1bnR5cGVkXG4gICAqICAgZ2V0RGVmaW5pdGlvbjxIZXJvPihgSGVyb2ApOyAvLyBkZWZpbml0aW9uIGZvciBIZXJvZXMsIHR5cGVkIHdpdGggSGVybyBpbnRlcmZhY2VcbiAgICovXG4gIGdldERlZmluaXRpb248VD4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHNob3VsZFRocm93ID0gdHJ1ZVxuICApOiBFbnRpdHlEZWZpbml0aW9uPFQ+IHtcbiAgICBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZGVmaW5pdGlvbnNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFkZWZpbml0aW9uICYmIHNob3VsZFRocm93KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEVudGl0eURlZmluaXRpb24gZm9yIGVudGl0eSB0eXBlIFwiJHtlbnRpdHlOYW1lfVwiLmApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbiAgfVxuXG4gIC8vLy8vLy8vIFJlZ2lzdHJhdGlvbiBtZXRob2RzIC8vLy8vLy8vLy9cblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCByZWdpc3RlciB0aGUge0VudGl0eURlZmluaXRpb259IGZvciB0aGUge0VudGl0eU1ldGFkYXRhfSBvZiBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbiAtIHtFbnRpdHlNZXRhZGF0YX0gZm9yIGEgY29sbGVjdGlvbiBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3Rlck1ldGFkYXRhKG15SGVyb0VudGl0eURlZmluaXRpb24pO1xuICAgKi9cbiAgcmVnaXN0ZXJNZXRhZGF0YShtZXRhZGF0YTogRW50aXR5TWV0YWRhdGEpIHtcbiAgICBpZiAobWV0YWRhdGEpIHtcbiAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBjcmVhdGVFbnRpdHlEZWZpbml0aW9uKG1ldGFkYXRhKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJEZWZpbml0aW9uKGRlZmluaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlNZXRhZGF0YU1hcC5cbiAgICogQHBhcmFtIG1ldGFkYXRhTWFwIC0gYSBtYXAgb2YgZW50aXR5VHlwZSBuYW1lcyB0byBlbnRpdHkgbWV0YWRhdGFcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJNZXRhZGF0YU1hcCh7XG4gICAqICAgICAnSGVybyc6IG15SGVyb01ldGFkYXRhLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluTWV0YWRhdGFcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyTWV0YWRhdGFNYXAobWV0YWRhdGFNYXA6IEVudGl0eU1ldGFkYXRhTWFwID0ge30pIHtcbiAgICAvLyBUaGUgZW50aXR5IHR5cGUgbmFtZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG1hcCBrZXlcbiAgICBPYmplY3Qua2V5cyhtZXRhZGF0YU1hcCB8fCB7fSkuZm9yRWFjaChlbnRpdHlOYW1lID0+XG4gICAgICB0aGlzLnJlZ2lzdGVyTWV0YWRhdGEoeyBlbnRpdHlOYW1lLCAuLi5tZXRhZGF0YU1hcFtlbnRpdHlOYW1lXSB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4ge0VudGl0eURlZmluaXRpb259IGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbiAtIEVudGl0eURlZmluaXRpb24gb2YgYSBjb2xsZWN0aW9uIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyRGVmaW5pdGlvbignSGVybycsIG15SGVyb0VudGl0eURlZmluaXRpb24pO1xuICAgKi9cbiAgcmVnaXN0ZXJEZWZpbml0aW9uPFQ+KGRlZmluaXRpb246IEVudGl0eURlZmluaXRpb248VD4pIHtcbiAgICB0aGlzLmRlZmluaXRpb25zW2RlZmluaXRpb24uZW50aXR5TmFtZV0gPSBkZWZpbml0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgRW50aXR5RGVmaW5pdGlvbnMuXG4gICAqIEBwYXJhbSBkZWZpbml0aW9ucyAtIG1hcCBvZiBlbnRpdHlUeXBlIG5hbWUgYW5kIGFzc29jaWF0ZWQgRW50aXR5RGVmaW5pdGlvbnMgdG8gbWVyZ2UuXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyRGVmaW5pdGlvbnMoe1xuICAgKiAgICAgJ0hlcm8nOiBteUhlcm9FbnRpdHlEZWZpbml0aW9uLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluRW50aXR5RGVmaW5pdGlvblxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJEZWZpbml0aW9ucyhkZWZpbml0aW9uczogRW50aXR5RGVmaW5pdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZGVmaW5pdGlvbnMsIGRlZmluaXRpb25zKTtcbiAgfVxufVxuIl19