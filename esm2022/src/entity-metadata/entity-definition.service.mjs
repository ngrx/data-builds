import { Inject, Injectable, Optional } from '@angular/core';
import { createEntityDefinition } from './entity-definition';
import { ENTITY_METADATA_TOKEN, } from './entity-metadata';
import * as i0 from "@angular/core";
/** Registry of EntityDefinitions for all cached entity types */
class EntityDefinitionService {
    constructor(entityMetadataMaps) {
        /** {EntityDefinition} for all cached entity types */
        this.definitions = {};
        if (entityMetadataMaps) {
            entityMetadataMaps.forEach((map) => this.registerMetadataMap(map));
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
    getDefinition(entityName, shouldThrow = true) {
        entityName = entityName.trim();
        const definition = this.definitions[entityName];
        if (!definition && shouldThrow) {
            throw new Error(`No EntityDefinition for entity type "${entityName}".`);
        }
        return definition;
    }
    //////// Registration methods //////////
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param name - the name of the entity type
     * @param definition - {EntityMetadata} for a collection for that entity type
     *
     * Examples:
     *   registerMetadata(myHeroEntityDefinition);
     */
    registerMetadata(metadata) {
        if (metadata) {
            const definition = createEntityDefinition(metadata);
            this.registerDefinition(definition);
        }
    }
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
    registerMetadataMap(metadataMap = {}) {
        // The entity type name should be the same as the map key
        Object.keys(metadataMap || {}).forEach((entityName) => this.registerMetadata({ entityName, ...metadataMap[entityName] }));
    }
    /**
     * Register an {EntityDefinition} for an entity type
     * @param definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     */
    registerDefinition(definition) {
        this.definitions[definition.entityName] = definition;
    }
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
    registerDefinitions(definitions) {
        Object.assign(this.definitions, definitions);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDefinitionService, deps: [{ token: ENTITY_METADATA_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDefinitionService }); }
}
export { EntityDefinitionService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDefinitionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_METADATA_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxzQkFBc0IsRUFBb0IsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRSxPQUFPLEVBR0wscUJBQXFCLEdBQ3RCLE1BQU0sbUJBQW1CLENBQUM7O0FBTTNCLGdFQUFnRTtBQUNoRSxNQUNhLHVCQUF1QjtJQUlsQyxZQUdFLGtCQUF1QztRQU56QyxxREFBcUQ7UUFDcEMsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBT25ELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNwRTtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsYUFBYSxDQUNYLFVBQWtCLEVBQ2xCLFdBQVcsR0FBRyxJQUFJO1FBRWxCLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxVQUFVLElBQUksQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELHdDQUF3QztJQUV4Qzs7Ozs7OztPQU9HO0lBQ0gsZ0JBQWdCLENBQUMsUUFBd0I7UUFDdkMsSUFBSSxRQUFRLEVBQUU7WUFDWixNQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsbUJBQW1CLENBQUMsY0FBaUMsRUFBRTtRQUNyRCx5REFBeUQ7UUFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FDcEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FDbEUsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxrQkFBa0IsQ0FBSSxVQUErQjtRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILG1CQUFtQixDQUFDLFdBQThCO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDO2lJQTNGVSx1QkFBdUIsa0JBTXhCLHFCQUFxQjtxSUFOcEIsdUJBQXVCOztTQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVTs7MEJBTU4sUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGNyZWF0ZUVudGl0eURlZmluaXRpb24sIEVudGl0eURlZmluaXRpb24gfSBmcm9tICcuL2VudGl0eS1kZWZpbml0aW9uJztcbmltcG9ydCB7XG4gIEVudGl0eU1ldGFkYXRhLFxuICBFbnRpdHlNZXRhZGF0YU1hcCxcbiAgRU5USVRZX01FVEFEQVRBX1RPS0VOLFxufSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGVmaW5pdGlvbnMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogRW50aXR5RGVmaW5pdGlvbjxhbnk+O1xufVxuXG4vKiogUmVnaXN0cnkgb2YgRW50aXR5RGVmaW5pdGlvbnMgZm9yIGFsbCBjYWNoZWQgZW50aXR5IHR5cGVzICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGVmaW5pdGlvblNlcnZpY2Uge1xuICAvKioge0VudGl0eURlZmluaXRpb259IGZvciBhbGwgY2FjaGVkIGVudGl0eSB0eXBlcyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRlZmluaXRpb25zOiBFbnRpdHlEZWZpbml0aW9ucyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfTUVUQURBVEFfVE9LRU4pXG4gICAgZW50aXR5TWV0YWRhdGFNYXBzOiBFbnRpdHlNZXRhZGF0YU1hcFtdXG4gICkge1xuICAgIGlmIChlbnRpdHlNZXRhZGF0YU1hcHMpIHtcbiAgICAgIGVudGl0eU1ldGFkYXRhTWFwcy5mb3JFYWNoKChtYXApID0+IHRoaXMucmVnaXN0ZXJNZXRhZGF0YU1hcChtYXApKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IChvciBjcmVhdGUpIGEgZGF0YSBzZXJ2aWNlIGZvciBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGdldERlZmluaXRpb24oJ0hlcm8nKTsgLy8gZGVmaW5pdGlvbiBmb3IgSGVyb2VzLCB1bnR5cGVkXG4gICAqICAgZ2V0RGVmaW5pdGlvbjxIZXJvPihgSGVyb2ApOyAvLyBkZWZpbml0aW9uIGZvciBIZXJvZXMsIHR5cGVkIHdpdGggSGVybyBpbnRlcmZhY2VcbiAgICovXG4gIGdldERlZmluaXRpb248VD4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHNob3VsZFRocm93ID0gdHJ1ZVxuICApOiBFbnRpdHlEZWZpbml0aW9uPFQ+IHtcbiAgICBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZGVmaW5pdGlvbnNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFkZWZpbml0aW9uICYmIHNob3VsZFRocm93KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEVudGl0eURlZmluaXRpb24gZm9yIGVudGl0eSB0eXBlIFwiJHtlbnRpdHlOYW1lfVwiLmApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbiAgfVxuXG4gIC8vLy8vLy8vIFJlZ2lzdHJhdGlvbiBtZXRob2RzIC8vLy8vLy8vLy9cblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCByZWdpc3RlciB0aGUge0VudGl0eURlZmluaXRpb259IGZvciB0aGUge0VudGl0eU1ldGFkYXRhfSBvZiBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbiAtIHtFbnRpdHlNZXRhZGF0YX0gZm9yIGEgY29sbGVjdGlvbiBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3Rlck1ldGFkYXRhKG15SGVyb0VudGl0eURlZmluaXRpb24pO1xuICAgKi9cbiAgcmVnaXN0ZXJNZXRhZGF0YShtZXRhZGF0YTogRW50aXR5TWV0YWRhdGEpIHtcbiAgICBpZiAobWV0YWRhdGEpIHtcbiAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBjcmVhdGVFbnRpdHlEZWZpbml0aW9uKG1ldGFkYXRhKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJEZWZpbml0aW9uKGRlZmluaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlNZXRhZGF0YU1hcC5cbiAgICogQHBhcmFtIG1ldGFkYXRhTWFwIC0gYSBtYXAgb2YgZW50aXR5VHlwZSBuYW1lcyB0byBlbnRpdHkgbWV0YWRhdGFcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJNZXRhZGF0YU1hcCh7XG4gICAqICAgICAnSGVybyc6IG15SGVyb01ldGFkYXRhLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluTWV0YWRhdGFcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyTWV0YWRhdGFNYXAobWV0YWRhdGFNYXA6IEVudGl0eU1ldGFkYXRhTWFwID0ge30pIHtcbiAgICAvLyBUaGUgZW50aXR5IHR5cGUgbmFtZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG1hcCBrZXlcbiAgICBPYmplY3Qua2V5cyhtZXRhZGF0YU1hcCB8fCB7fSkuZm9yRWFjaCgoZW50aXR5TmFtZSkgPT5cbiAgICAgIHRoaXMucmVnaXN0ZXJNZXRhZGF0YSh7IGVudGl0eU5hbWUsIC4uLm1ldGFkYXRhTWFwW2VudGl0eU5hbWVdIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBkZWZpbml0aW9uIC0gRW50aXR5RGVmaW5pdGlvbiBvZiBhIGNvbGxlY3Rpb24gZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJEZWZpbml0aW9uKCdIZXJvJywgbXlIZXJvRW50aXR5RGVmaW5pdGlvbik7XG4gICAqL1xuICByZWdpc3RlckRlZmluaXRpb248VD4oZGVmaW5pdGlvbjogRW50aXR5RGVmaW5pdGlvbjxUPikge1xuICAgIHRoaXMuZGVmaW5pdGlvbnNbZGVmaW5pdGlvbi5lbnRpdHlOYW1lXSA9IGRlZmluaXRpb247XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBiYXRjaCBvZiBFbnRpdHlEZWZpbml0aW9ucy5cbiAgICogQHBhcmFtIGRlZmluaXRpb25zIC0gbWFwIG9mIGVudGl0eVR5cGUgbmFtZSBhbmQgYXNzb2NpYXRlZCBFbnRpdHlEZWZpbml0aW9ucyB0byBtZXJnZS5cbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJEZWZpbml0aW9ucyh7XG4gICAqICAgICAnSGVybyc6IG15SGVyb0VudGl0eURlZmluaXRpb24sXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5FbnRpdHlEZWZpbml0aW9uXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3RlckRlZmluaXRpb25zKGRlZmluaXRpb25zOiBFbnRpdHlEZWZpbml0aW9ucykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5kZWZpbml0aW9ucywgZGVmaW5pdGlvbnMpO1xuICB9XG59XG4iXX0=