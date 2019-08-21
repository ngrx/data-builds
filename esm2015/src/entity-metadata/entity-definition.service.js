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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDL0UsT0FBTyxFQUdMLHFCQUFxQixHQUN0QixNQUFNLG1CQUFtQixDQUFDOzs7O0FBRTNCLHVDQUVDOzs7O0FBSUQsTUFBTSxPQUFPLHVCQUF1Qjs7OztJQUlsQyxZQUdFLGtCQUF1Qzs7OztRQUx4QixnQkFBVyxHQUFzQixFQUFFLENBQUM7UUFPbkQsSUFBSSxrQkFBa0IsRUFBRTtZQUN0QixrQkFBa0IsQ0FBQyxPQUFPOzs7O1lBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQztTQUNsRTtJQUNILENBQUM7Ozs7Ozs7Ozs7OztJQVVELGFBQWEsQ0FDWCxVQUFrQixFQUNsQixXQUFXLEdBQUcsSUFBSTtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDOztjQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsVUFBVSxJQUFJLENBQUMsQ0FBQztTQUN6RTtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Ozs7Ozs7SUFZRCxnQkFBZ0IsQ0FBQyxRQUF3QjtRQUN2QyxJQUFJLFFBQVEsRUFBRTs7a0JBQ04sVUFBVSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztZQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7SUFZRCxtQkFBbUIsQ0FBQyxjQUFpQyxFQUFFO1FBQ3JELHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDbEQsSUFBSSxDQUFDLGdCQUFnQixpQkFBRyxVQUFVLElBQUssV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFHLEVBQ2xFLENBQUM7SUFDSixDQUFDOzs7Ozs7Ozs7O0lBU0Qsa0JBQWtCLENBQUksVUFBK0I7UUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQ3ZELENBQUM7Ozs7Ozs7Ozs7OztJQVlELG1CQUFtQixDQUFDLFdBQThCO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7WUE1RkYsVUFBVTs7Ozt3Q0FNTixRQUFRLFlBQ1IsTUFBTSxTQUFDLHFCQUFxQjs7Ozs7Ozs7SUFKL0IsOENBQXFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBjcmVhdGVFbnRpdHlEZWZpbml0aW9uLCBFbnRpdHlEZWZpbml0aW9uIH0gZnJvbSAnLi9lbnRpdHktZGVmaW5pdGlvbic7XG5pbXBvcnQge1xuICBFbnRpdHlNZXRhZGF0YSxcbiAgRW50aXR5TWV0YWRhdGFNYXAsXG4gIEVOVElUWV9NRVRBREFUQV9UT0tFTixcbn0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURlZmluaXRpb25zIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IEVudGl0eURlZmluaXRpb248YW55Pjtcbn1cblxuLyoqIFJlZ2lzdHJ5IG9mIEVudGl0eURlZmluaXRpb25zIGZvciBhbGwgY2FjaGVkIGVudGl0eSB0eXBlcyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURlZmluaXRpb25TZXJ2aWNlIHtcbiAgLyoqIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgYWxsIGNhY2hlZCBlbnRpdHkgdHlwZXMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkZWZpbml0aW9uczogRW50aXR5RGVmaW5pdGlvbnMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX01FVEFEQVRBX1RPS0VOKVxuICAgIGVudGl0eU1ldGFkYXRhTWFwczogRW50aXR5TWV0YWRhdGFNYXBbXVxuICApIHtcbiAgICBpZiAoZW50aXR5TWV0YWRhdGFNYXBzKSB7XG4gICAgICBlbnRpdHlNZXRhZGF0YU1hcHMuZm9yRWFjaChtYXAgPT4gdGhpcy5yZWdpc3Rlck1ldGFkYXRhTWFwKG1hcCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgKG9yIGNyZWF0ZSkgYSBkYXRhIHNlcnZpY2UgZm9yIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgZ2V0RGVmaW5pdGlvbignSGVybycpOyAvLyBkZWZpbml0aW9uIGZvciBIZXJvZXMsIHVudHlwZWRcbiAgICogICBnZXREZWZpbml0aW9uPEhlcm8+KGBIZXJvYCk7IC8vIGRlZmluaXRpb24gZm9yIEhlcm9lcywgdHlwZWQgd2l0aCBIZXJvIGludGVyZmFjZVxuICAgKi9cbiAgZ2V0RGVmaW5pdGlvbjxUPihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgc2hvdWxkVGhyb3cgPSB0cnVlXG4gICk6IEVudGl0eURlZmluaXRpb248VD4ge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gdGhpcy5kZWZpbml0aW9uc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIWRlZmluaXRpb24gJiYgc2hvdWxkVGhyb3cpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gRW50aXR5RGVmaW5pdGlvbiBmb3IgZW50aXR5IHR5cGUgXCIke2VudGl0eU5hbWV9XCIuYCk7XG4gICAgfVxuICAgIHJldHVybiBkZWZpbml0aW9uO1xuICB9XG5cbiAgLy8vLy8vLy8gUmVnaXN0cmF0aW9uIG1ldGhvZHMgLy8vLy8vLy8vL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIHJlZ2lzdGVyIHRoZSB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIHRoZSB7RW50aXR5TWV0YWRhdGF9IG9mIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBkZWZpbml0aW9uIC0ge0VudGl0eU1ldGFkYXRhfSBmb3IgYSBjb2xsZWN0aW9uIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyTWV0YWRhdGEobXlIZXJvRW50aXR5RGVmaW5pdGlvbik7XG4gICAqL1xuICByZWdpc3Rlck1ldGFkYXRhKG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YSkge1xuICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IGNyZWF0ZUVudGl0eURlZmluaXRpb24obWV0YWRhdGEpO1xuICAgICAgdGhpcy5yZWdpc3RlckRlZmluaXRpb24oZGVmaW5pdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIEVudGl0eU1ldGFkYXRhTWFwLlxuICAgKiBAcGFyYW0gbWV0YWRhdGFNYXAgLSBhIG1hcCBvZiBlbnRpdHlUeXBlIG5hbWVzIHRvIGVudGl0eSBtZXRhZGF0YVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3Rlck1ldGFkYXRhTWFwKHtcbiAgICogICAgICdIZXJvJzogbXlIZXJvTWV0YWRhdGEsXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5NZXRhZGF0YVxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJNZXRhZGF0YU1hcChtZXRhZGF0YU1hcDogRW50aXR5TWV0YWRhdGFNYXAgPSB7fSkge1xuICAgIC8vIFRoZSBlbnRpdHkgdHlwZSBuYW1lIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgbWFwIGtleVxuICAgIE9iamVjdC5rZXlzKG1ldGFkYXRhTWFwIHx8IHt9KS5mb3JFYWNoKGVudGl0eU5hbWUgPT5cbiAgICAgIHRoaXMucmVnaXN0ZXJNZXRhZGF0YSh7IGVudGl0eU5hbWUsIC4uLm1ldGFkYXRhTWFwW2VudGl0eU5hbWVdIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBkZWZpbml0aW9uIC0gRW50aXR5RGVmaW5pdGlvbiBvZiBhIGNvbGxlY3Rpb24gZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJEZWZpbml0aW9uKCdIZXJvJywgbXlIZXJvRW50aXR5RGVmaW5pdGlvbik7XG4gICAqL1xuICByZWdpc3RlckRlZmluaXRpb248VD4oZGVmaW5pdGlvbjogRW50aXR5RGVmaW5pdGlvbjxUPikge1xuICAgIHRoaXMuZGVmaW5pdGlvbnNbZGVmaW5pdGlvbi5lbnRpdHlOYW1lXSA9IGRlZmluaXRpb247XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBiYXRjaCBvZiBFbnRpdHlEZWZpbml0aW9ucy5cbiAgICogQHBhcmFtIGRlZmluaXRpb25zIC0gbWFwIG9mIGVudGl0eVR5cGUgbmFtZSBhbmQgYXNzb2NpYXRlZCBFbnRpdHlEZWZpbml0aW9ucyB0byBtZXJnZS5cbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJEZWZpbml0aW9ucyh7XG4gICAqICAgICAnSGVybyc6IG15SGVyb0VudGl0eURlZmluaXRpb24sXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5FbnRpdHlEZWZpbml0aW9uXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3RlckRlZmluaXRpb25zKGRlZmluaXRpb25zOiBFbnRpdHlEZWZpbml0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5kZWZpbml0aW9ucywgZGVmaW5pdGlvbnMpO1xuICB9XG59XG4iXX0=