/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFrQixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0UsT0FBTyxFQUFFLHNCQUFzQixFQUFvQixNQUFNLHFCQUFxQixDQUFDO0FBQy9FLE9BQU8sRUFHTCxxQkFBcUIsR0FDdEIsTUFBTSxtQkFBbUIsQ0FBQzs7OztBQUczQix1Q0FFQzs7OztBQUlELE1BQU0sT0FBTyx1QkFBdUI7Ozs7SUFJbEMsWUFHRSxrQkFBdUM7Ozs7UUFMeEIsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBT25ELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsa0JBQWtCLENBQUMsT0FBTzs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7SUFVRCxhQUFhLENBQ1gsVUFBa0IsRUFDbEIsV0FBVyxHQUFHLElBQUk7UUFFbEIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Y0FDekIsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQy9DLElBQUksQ0FBQyxVQUFVLElBQUksV0FBVyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLFVBQVUsSUFBSSxDQUFDLENBQUM7U0FDekU7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7O0lBWUQsZ0JBQWdCLENBQUMsUUFBd0I7UUFDdkMsSUFBSSxRQUFRLEVBQUU7O2tCQUNOLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQyxRQUFRLENBQUM7WUFDbkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7O0lBWUQsbUJBQW1CLENBQUMsY0FBaUMsRUFBRTtRQUNyRCx5REFBeUQ7UUFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTzs7OztRQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ2xELElBQUksQ0FBQyxnQkFBZ0IsaUJBQUcsVUFBVSxJQUFLLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRyxFQUNsRSxDQUFDO0lBQ0osQ0FBQzs7Ozs7Ozs7OztJQVNELGtCQUFrQixDQUFJLFVBQStCO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN2RCxDQUFDOzs7Ozs7Ozs7Ozs7SUFZRCxtQkFBbUIsQ0FBQyxXQUE4QjtRQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7O1lBNUZGLFVBQVU7Ozs7d0NBTU4sUUFBUSxZQUNSLE1BQU0sU0FBQyxxQkFBcUI7Ozs7Ozs7O0lBSi9CLDhDQUFxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGNyZWF0ZUVudGl0eURlZmluaXRpb24sIEVudGl0eURlZmluaXRpb24gfSBmcm9tICcuL2VudGl0eS1kZWZpbml0aW9uJztcbmltcG9ydCB7XG4gIEVudGl0eU1ldGFkYXRhLFxuICBFbnRpdHlNZXRhZGF0YU1hcCxcbiAgRU5USVRZX01FVEFEQVRBX1RPS0VOLFxufSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YSc7XG5pbXBvcnQgeyBFTlRJVFlfQ0FDSEVfTkFNRSB9IGZyb20gJy4uL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGVmaW5pdGlvbnMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogRW50aXR5RGVmaW5pdGlvbjxhbnk+O1xufVxuXG4vKiogUmVnaXN0cnkgb2YgRW50aXR5RGVmaW5pdGlvbnMgZm9yIGFsbCBjYWNoZWQgZW50aXR5IHR5cGVzICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGVmaW5pdGlvblNlcnZpY2Uge1xuICAvKioge0VudGl0eURlZmluaXRpb259IGZvciBhbGwgY2FjaGVkIGVudGl0eSB0eXBlcyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRlZmluaXRpb25zOiBFbnRpdHlEZWZpbml0aW9ucyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfTUVUQURBVEFfVE9LRU4pXG4gICAgZW50aXR5TWV0YWRhdGFNYXBzOiBFbnRpdHlNZXRhZGF0YU1hcFtdXG4gICkge1xuICAgIGlmIChlbnRpdHlNZXRhZGF0YU1hcHMpIHtcbiAgICAgIGVudGl0eU1ldGFkYXRhTWFwcy5mb3JFYWNoKG1hcCA9PiB0aGlzLnJlZ2lzdGVyTWV0YWRhdGFNYXAobWFwKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCAob3IgY3JlYXRlKSBhIGRhdGEgc2VydmljZSBmb3IgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICBnZXREZWZpbml0aW9uKCdIZXJvJyk7IC8vIGRlZmluaXRpb24gZm9yIEhlcm9lcywgdW50eXBlZFxuICAgKiAgIGdldERlZmluaXRpb248SGVybz4oYEhlcm9gKTsgLy8gZGVmaW5pdGlvbiBmb3IgSGVyb2VzLCB0eXBlZCB3aXRoIEhlcm8gaW50ZXJmYWNlXG4gICAqL1xuICBnZXREZWZpbml0aW9uPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBzaG91bGRUaHJvdyA9IHRydWVcbiAgKTogRW50aXR5RGVmaW5pdGlvbjxUPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmRlZmluaXRpb25zW2VudGl0eU5hbWVdO1xuICAgIGlmICghZGVmaW5pdGlvbiAmJiBzaG91bGRUaHJvdykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBFbnRpdHlEZWZpbml0aW9uIGZvciBlbnRpdHkgdHlwZSBcIiR7ZW50aXR5TmFtZX1cIi5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmluaXRpb247XG4gIH1cblxuICAvLy8vLy8vLyBSZWdpc3RyYXRpb24gbWV0aG9kcyAvLy8vLy8vLy8vXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgcmVnaXN0ZXIgdGhlIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgdGhlIHtFbnRpdHlNZXRhZGF0YX0gb2YgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGRlZmluaXRpb24gLSB7RW50aXR5TWV0YWRhdGF9IGZvciBhIGNvbGxlY3Rpb24gZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJNZXRhZGF0YShteUhlcm9FbnRpdHlEZWZpbml0aW9uKTtcbiAgICovXG4gIHJlZ2lzdGVyTWV0YWRhdGEobWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhKSB7XG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBjb25zdCBkZWZpbml0aW9uID0gY3JlYXRlRW50aXR5RGVmaW5pdGlvbihtZXRhZGF0YSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyRGVmaW5pdGlvbihkZWZpbml0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gRW50aXR5TWV0YWRhdGFNYXAuXG4gICAqIEBwYXJhbSBtZXRhZGF0YU1hcCAtIGEgbWFwIG9mIGVudGl0eVR5cGUgbmFtZXMgdG8gZW50aXR5IG1ldGFkYXRhXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyTWV0YWRhdGFNYXAoe1xuICAgKiAgICAgJ0hlcm8nOiBteUhlcm9NZXRhZGF0YSxcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbk1ldGFkYXRhXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3Rlck1ldGFkYXRhTWFwKG1ldGFkYXRhTWFwOiBFbnRpdHlNZXRhZGF0YU1hcCA9IHt9KSB7XG4gICAgLy8gVGhlIGVudGl0eSB0eXBlIG5hbWUgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBtYXAga2V5XG4gICAgT2JqZWN0LmtleXMobWV0YWRhdGFNYXAgfHwge30pLmZvckVhY2goZW50aXR5TmFtZSA9PlxuICAgICAgdGhpcy5yZWdpc3Rlck1ldGFkYXRhKHsgZW50aXR5TmFtZSwgLi4ubWV0YWRhdGFNYXBbZW50aXR5TmFtZV0gfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGRlZmluaXRpb24gLSBFbnRpdHlEZWZpbml0aW9uIG9mIGEgY29sbGVjdGlvbiBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlckRlZmluaXRpb24oJ0hlcm8nLCBteUhlcm9FbnRpdHlEZWZpbml0aW9uKTtcbiAgICovXG4gIHJlZ2lzdGVyRGVmaW5pdGlvbjxUPihkZWZpbml0aW9uOiBFbnRpdHlEZWZpbml0aW9uPFQ+KSB7XG4gICAgdGhpcy5kZWZpbml0aW9uc1tkZWZpbml0aW9uLmVudGl0eU5hbWVdID0gZGVmaW5pdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGJhdGNoIG9mIEVudGl0eURlZmluaXRpb25zLlxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbnMgLSBtYXAgb2YgZW50aXR5VHlwZSBuYW1lIGFuZCBhc3NvY2lhdGVkIEVudGl0eURlZmluaXRpb25zIHRvIG1lcmdlLlxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlckRlZmluaXRpb25zKHtcbiAgICogICAgICdIZXJvJzogbXlIZXJvRW50aXR5RGVmaW5pdGlvbixcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbkVudGl0eURlZmluaXRpb25cbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyRGVmaW5pdGlvbnMoZGVmaW5pdGlvbnM6IEVudGl0eURlZmluaXRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmRlZmluaXRpb25zLCBkZWZpbml0aW9ucyk7XG4gIH1cbn1cbiJdfQ==