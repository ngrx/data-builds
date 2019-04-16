import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { createEntityDefinition } from './entity-definition';
import { ENTITY_METADATA_TOKEN, } from './entity-metadata';
/** Registry of EntityDefinitions for all cached entity types */
var EntityDefinitionService = /** @class */ (function () {
    function EntityDefinitionService(entityMetadataMaps) {
        var _this = this;
        /** {EntityDefinition} for all cached entity types */
        this.definitions = {};
        if (entityMetadataMaps) {
            entityMetadataMaps.forEach(function (map) { return _this.registerMetadataMap(map); });
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
    EntityDefinitionService.prototype.getDefinition = function (entityName, shouldThrow) {
        if (shouldThrow === void 0) { shouldThrow = true; }
        entityName = entityName.trim();
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
    EntityDefinitionService.prototype.registerMetadata = function (metadata) {
        if (metadata) {
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
    EntityDefinitionService.prototype.registerMetadataMap = function (metadataMap) {
        var _this = this;
        if (metadataMap === void 0) { metadataMap = {}; }
        // The entity type name should be the same as the map key
        Object.keys(metadataMap || {}).forEach(function (entityName) {
            return _this.registerMetadata(tslib_1.__assign({ entityName: entityName }, metadataMap[entityName]));
        });
    };
    /**
     * Register an {EntityDefinition} for an entity type
     * @param definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     */
    EntityDefinitionService.prototype.registerDefinition = function (definition) {
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
    EntityDefinitionService.prototype.registerDefinitions = function (definitions) {
        Object.assign(this.definitions, definitions);
    };
    EntityDefinitionService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Optional()),
        tslib_1.__param(0, Inject(ENTITY_METADATA_TOKEN)),
        tslib_1.__metadata("design:paramtypes", [Array])
    ], EntityDefinitionService);
    return EntityDefinitionService;
}());
export { EntityDefinitionService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFrQixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0UsT0FBTyxFQUFFLHNCQUFzQixFQUFvQixNQUFNLHFCQUFxQixDQUFDO0FBQy9FLE9BQU8sRUFHTCxxQkFBcUIsR0FDdEIsTUFBTSxtQkFBbUIsQ0FBQztBQU8zQixnRUFBZ0U7QUFFaEU7SUFJRSxpQ0FHRSxrQkFBdUM7UUFIekMsaUJBUUM7UUFYRCxxREFBcUQ7UUFDcEMsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBT25ELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILCtDQUFhLEdBQWIsVUFDRSxVQUFrQixFQUNsQixXQUFrQjtRQUFsQiw0QkFBQSxFQUFBLGtCQUFrQjtRQUVsQixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBd0MsVUFBVSxRQUFJLENBQUMsQ0FBQztTQUN6RTtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx3Q0FBd0M7SUFFeEM7Ozs7Ozs7T0FPRztJQUNILGtEQUFnQixHQUFoQixVQUFpQixRQUF3QjtRQUN2QyxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxxREFBbUIsR0FBbkIsVUFBb0IsV0FBbUM7UUFBdkQsaUJBS0M7UUFMbUIsNEJBQUEsRUFBQSxnQkFBbUM7UUFDckQseURBQXlEO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7WUFDL0MsT0FBQSxLQUFJLENBQUMsZ0JBQWdCLG9CQUFHLFVBQVUsWUFBQSxJQUFLLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRztRQUFqRSxDQUFpRSxDQUNsRSxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILG9EQUFrQixHQUFsQixVQUFzQixVQUErQjtRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILHFEQUFtQixHQUFuQixVQUFvQixXQUE4QjtRQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQTNGVSx1QkFBdUI7UUFEbkMsVUFBVSxFQUFFO1FBTVIsbUJBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixtQkFBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7T0FOckIsdUJBQXVCLENBNEZuQztJQUFELDhCQUFDO0NBQUEsQUE1RkQsSUE0RkM7U0E1RlksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgY3JlYXRlRW50aXR5RGVmaW5pdGlvbiwgRW50aXR5RGVmaW5pdGlvbiB9IGZyb20gJy4vZW50aXR5LWRlZmluaXRpb24nO1xuaW1wb3J0IHtcbiAgRW50aXR5TWV0YWRhdGEsXG4gIEVudGl0eU1ldGFkYXRhTWFwLFxuICBFTlRJVFlfTUVUQURBVEFfVE9LRU4sXG59IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhJztcbmltcG9ydCB7IEVOVElUWV9DQUNIRV9OQU1FIH0gZnJvbSAnLi4vcmVkdWNlcnMvY29uc3RhbnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEZWZpbml0aW9ucyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBFbnRpdHlEZWZpbml0aW9uPGFueT47XG59XG5cbi8qKiBSZWdpc3RyeSBvZiBFbnRpdHlEZWZpbml0aW9ucyBmb3IgYWxsIGNhY2hlZCBlbnRpdHkgdHlwZXMgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB7XG4gIC8qKiB7RW50aXR5RGVmaW5pdGlvbn0gZm9yIGFsbCBjYWNoZWQgZW50aXR5IHR5cGVzICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVmaW5pdGlvbnM6IEVudGl0eURlZmluaXRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9NRVRBREFUQV9UT0tFTilcbiAgICBlbnRpdHlNZXRhZGF0YU1hcHM6IEVudGl0eU1ldGFkYXRhTWFwW11cbiAgKSB7XG4gICAgaWYgKGVudGl0eU1ldGFkYXRhTWFwcykge1xuICAgICAgZW50aXR5TWV0YWRhdGFNYXBzLmZvckVhY2gobWFwID0+IHRoaXMucmVnaXN0ZXJNZXRhZGF0YU1hcChtYXApKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IChvciBjcmVhdGUpIGEgZGF0YSBzZXJ2aWNlIGZvciBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGdldERlZmluaXRpb24oJ0hlcm8nKTsgLy8gZGVmaW5pdGlvbiBmb3IgSGVyb2VzLCB1bnR5cGVkXG4gICAqICAgZ2V0RGVmaW5pdGlvbjxIZXJvPihgSGVyb2ApOyAvLyBkZWZpbml0aW9uIGZvciBIZXJvZXMsIHR5cGVkIHdpdGggSGVybyBpbnRlcmZhY2VcbiAgICovXG4gIGdldERlZmluaXRpb248VD4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHNob3VsZFRocm93ID0gdHJ1ZVxuICApOiBFbnRpdHlEZWZpbml0aW9uPFQ+IHtcbiAgICBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZGVmaW5pdGlvbnNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFkZWZpbml0aW9uICYmIHNob3VsZFRocm93KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEVudGl0eURlZmluaXRpb24gZm9yIGVudGl0eSB0eXBlIFwiJHtlbnRpdHlOYW1lfVwiLmApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbiAgfVxuXG4gIC8vLy8vLy8vIFJlZ2lzdHJhdGlvbiBtZXRob2RzIC8vLy8vLy8vLy9cblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCByZWdpc3RlciB0aGUge0VudGl0eURlZmluaXRpb259IGZvciB0aGUge0VudGl0eU1ldGFkYXRhfSBvZiBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbiAtIHtFbnRpdHlNZXRhZGF0YX0gZm9yIGEgY29sbGVjdGlvbiBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3Rlck1ldGFkYXRhKG15SGVyb0VudGl0eURlZmluaXRpb24pO1xuICAgKi9cbiAgcmVnaXN0ZXJNZXRhZGF0YShtZXRhZGF0YTogRW50aXR5TWV0YWRhdGEpIHtcbiAgICBpZiAobWV0YWRhdGEpIHtcbiAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBjcmVhdGVFbnRpdHlEZWZpbml0aW9uKG1ldGFkYXRhKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJEZWZpbml0aW9uKGRlZmluaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlNZXRhZGF0YU1hcC5cbiAgICogQHBhcmFtIG1ldGFkYXRhTWFwIC0gYSBtYXAgb2YgZW50aXR5VHlwZSBuYW1lcyB0byBlbnRpdHkgbWV0YWRhdGFcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJNZXRhZGF0YU1hcCh7XG4gICAqICAgICAnSGVybyc6IG15SGVyb01ldGFkYXRhLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluTWV0YWRhdGFcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyTWV0YWRhdGFNYXAobWV0YWRhdGFNYXA6IEVudGl0eU1ldGFkYXRhTWFwID0ge30pIHtcbiAgICAvLyBUaGUgZW50aXR5IHR5cGUgbmFtZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG1hcCBrZXlcbiAgICBPYmplY3Qua2V5cyhtZXRhZGF0YU1hcCB8fCB7fSkuZm9yRWFjaChlbnRpdHlOYW1lID0+XG4gICAgICB0aGlzLnJlZ2lzdGVyTWV0YWRhdGEoeyBlbnRpdHlOYW1lLCAuLi5tZXRhZGF0YU1hcFtlbnRpdHlOYW1lXSB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4ge0VudGl0eURlZmluaXRpb259IGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbiAtIEVudGl0eURlZmluaXRpb24gb2YgYSBjb2xsZWN0aW9uIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyRGVmaW5pdGlvbignSGVybycsIG15SGVyb0VudGl0eURlZmluaXRpb24pO1xuICAgKi9cbiAgcmVnaXN0ZXJEZWZpbml0aW9uPFQ+KGRlZmluaXRpb246IEVudGl0eURlZmluaXRpb248VD4pIHtcbiAgICB0aGlzLmRlZmluaXRpb25zW2RlZmluaXRpb24uZW50aXR5TmFtZV0gPSBkZWZpbml0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgRW50aXR5RGVmaW5pdGlvbnMuXG4gICAqIEBwYXJhbSBkZWZpbml0aW9ucyAtIG1hcCBvZiBlbnRpdHlUeXBlIG5hbWUgYW5kIGFzc29jaWF0ZWQgRW50aXR5RGVmaW5pdGlvbnMgdG8gbWVyZ2UuXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyRGVmaW5pdGlvbnMoe1xuICAgKiAgICAgJ0hlcm8nOiBteUhlcm9FbnRpdHlEZWZpbml0aW9uLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluRW50aXR5RGVmaW5pdGlvblxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJEZWZpbml0aW9ucyhkZWZpbml0aW9uczogRW50aXR5RGVmaW5pdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZGVmaW5pdGlvbnMsIGRlZmluaXRpb25zKTtcbiAgfVxufVxuIl19