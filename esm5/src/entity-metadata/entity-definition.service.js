import { __assign, __decorate, __metadata, __param } from "tslib";
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
            return _this.registerMetadata(__assign({ entityName: entityName }, metadataMap[entityName]));
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
    EntityDefinitionService = __decorate([
        Injectable(),
        __param(0, Optional()),
        __param(0, Inject(ENTITY_METADATA_TOKEN)),
        __metadata("design:paramtypes", [Array])
    ], EntityDefinitionService);
    return EntityDefinitionService;
}());
export { EntityDefinitionService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDL0UsT0FBTyxFQUdMLHFCQUFxQixHQUN0QixNQUFNLG1CQUFtQixDQUFDO0FBTTNCLGdFQUFnRTtBQUVoRTtJQUlFLGlDQUdFLGtCQUF1QztRQUh6QyxpQkFRQztRQVhELHFEQUFxRDtRQUNwQyxnQkFBVyxHQUFzQixFQUFFLENBQUM7UUFPbkQsSUFBSSxrQkFBa0IsRUFBRTtZQUN0QixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztTQUNsRTtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsK0NBQWEsR0FBYixVQUNFLFVBQWtCLEVBQ2xCLFdBQWtCO1FBQWxCLDRCQUFBLEVBQUEsa0JBQWtCO1FBRWxCLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDJDQUF3QyxVQUFVLFFBQUksQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELHdDQUF3QztJQUV4Qzs7Ozs7OztPQU9HO0lBQ0gsa0RBQWdCLEdBQWhCLFVBQWlCLFFBQXdCO1FBQ3ZDLElBQUksUUFBUSxFQUFFO1lBQ1osSUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILHFEQUFtQixHQUFuQixVQUFvQixXQUFtQztRQUF2RCxpQkFLQztRQUxtQiw0QkFBQSxFQUFBLGdCQUFtQztRQUNyRCx5REFBeUQ7UUFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtZQUMvQyxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsWUFBRyxVQUFVLFlBQUEsSUFBSyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUc7UUFBakUsQ0FBaUUsQ0FDbEUsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxvREFBa0IsR0FBbEIsVUFBc0IsVUFBK0I7UUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxxREFBbUIsR0FBbkIsVUFBb0IsV0FBOEI7UUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUEzRlUsdUJBQXVCO1FBRG5DLFVBQVUsRUFBRTtRQU1SLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixXQUFBLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBOztPQU5yQix1QkFBdUIsQ0E0Rm5DO0lBQUQsOEJBQUM7Q0FBQSxBQTVGRCxJQTRGQztTQTVGWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGNyZWF0ZUVudGl0eURlZmluaXRpb24sIEVudGl0eURlZmluaXRpb24gfSBmcm9tICcuL2VudGl0eS1kZWZpbml0aW9uJztcbmltcG9ydCB7XG4gIEVudGl0eU1ldGFkYXRhLFxuICBFbnRpdHlNZXRhZGF0YU1hcCxcbiAgRU5USVRZX01FVEFEQVRBX1RPS0VOLFxufSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGVmaW5pdGlvbnMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogRW50aXR5RGVmaW5pdGlvbjxhbnk+O1xufVxuXG4vKiogUmVnaXN0cnkgb2YgRW50aXR5RGVmaW5pdGlvbnMgZm9yIGFsbCBjYWNoZWQgZW50aXR5IHR5cGVzICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGVmaW5pdGlvblNlcnZpY2Uge1xuICAvKioge0VudGl0eURlZmluaXRpb259IGZvciBhbGwgY2FjaGVkIGVudGl0eSB0eXBlcyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRlZmluaXRpb25zOiBFbnRpdHlEZWZpbml0aW9ucyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfTUVUQURBVEFfVE9LRU4pXG4gICAgZW50aXR5TWV0YWRhdGFNYXBzOiBFbnRpdHlNZXRhZGF0YU1hcFtdXG4gICkge1xuICAgIGlmIChlbnRpdHlNZXRhZGF0YU1hcHMpIHtcbiAgICAgIGVudGl0eU1ldGFkYXRhTWFwcy5mb3JFYWNoKG1hcCA9PiB0aGlzLnJlZ2lzdGVyTWV0YWRhdGFNYXAobWFwKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCAob3IgY3JlYXRlKSBhIGRhdGEgc2VydmljZSBmb3IgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICBnZXREZWZpbml0aW9uKCdIZXJvJyk7IC8vIGRlZmluaXRpb24gZm9yIEhlcm9lcywgdW50eXBlZFxuICAgKiAgIGdldERlZmluaXRpb248SGVybz4oYEhlcm9gKTsgLy8gZGVmaW5pdGlvbiBmb3IgSGVyb2VzLCB0eXBlZCB3aXRoIEhlcm8gaW50ZXJmYWNlXG4gICAqL1xuICBnZXREZWZpbml0aW9uPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBzaG91bGRUaHJvdyA9IHRydWVcbiAgKTogRW50aXR5RGVmaW5pdGlvbjxUPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmRlZmluaXRpb25zW2VudGl0eU5hbWVdO1xuICAgIGlmICghZGVmaW5pdGlvbiAmJiBzaG91bGRUaHJvdykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBFbnRpdHlEZWZpbml0aW9uIGZvciBlbnRpdHkgdHlwZSBcIiR7ZW50aXR5TmFtZX1cIi5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmluaXRpb247XG4gIH1cblxuICAvLy8vLy8vLyBSZWdpc3RyYXRpb24gbWV0aG9kcyAvLy8vLy8vLy8vXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgcmVnaXN0ZXIgdGhlIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgdGhlIHtFbnRpdHlNZXRhZGF0YX0gb2YgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGRlZmluaXRpb24gLSB7RW50aXR5TWV0YWRhdGF9IGZvciBhIGNvbGxlY3Rpb24gZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJNZXRhZGF0YShteUhlcm9FbnRpdHlEZWZpbml0aW9uKTtcbiAgICovXG4gIHJlZ2lzdGVyTWV0YWRhdGEobWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhKSB7XG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBjb25zdCBkZWZpbml0aW9uID0gY3JlYXRlRW50aXR5RGVmaW5pdGlvbihtZXRhZGF0YSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyRGVmaW5pdGlvbihkZWZpbml0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gRW50aXR5TWV0YWRhdGFNYXAuXG4gICAqIEBwYXJhbSBtZXRhZGF0YU1hcCAtIGEgbWFwIG9mIGVudGl0eVR5cGUgbmFtZXMgdG8gZW50aXR5IG1ldGFkYXRhXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyTWV0YWRhdGFNYXAoe1xuICAgKiAgICAgJ0hlcm8nOiBteUhlcm9NZXRhZGF0YSxcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbk1ldGFkYXRhXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3Rlck1ldGFkYXRhTWFwKG1ldGFkYXRhTWFwOiBFbnRpdHlNZXRhZGF0YU1hcCA9IHt9KSB7XG4gICAgLy8gVGhlIGVudGl0eSB0eXBlIG5hbWUgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBtYXAga2V5XG4gICAgT2JqZWN0LmtleXMobWV0YWRhdGFNYXAgfHwge30pLmZvckVhY2goZW50aXR5TmFtZSA9PlxuICAgICAgdGhpcy5yZWdpc3Rlck1ldGFkYXRhKHsgZW50aXR5TmFtZSwgLi4ubWV0YWRhdGFNYXBbZW50aXR5TmFtZV0gfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGRlZmluaXRpb24gLSBFbnRpdHlEZWZpbml0aW9uIG9mIGEgY29sbGVjdGlvbiBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlckRlZmluaXRpb24oJ0hlcm8nLCBteUhlcm9FbnRpdHlEZWZpbml0aW9uKTtcbiAgICovXG4gIHJlZ2lzdGVyRGVmaW5pdGlvbjxUPihkZWZpbml0aW9uOiBFbnRpdHlEZWZpbml0aW9uPFQ+KSB7XG4gICAgdGhpcy5kZWZpbml0aW9uc1tkZWZpbml0aW9uLmVudGl0eU5hbWVdID0gZGVmaW5pdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGJhdGNoIG9mIEVudGl0eURlZmluaXRpb25zLlxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbnMgLSBtYXAgb2YgZW50aXR5VHlwZSBuYW1lIGFuZCBhc3NvY2lhdGVkIEVudGl0eURlZmluaXRpb25zIHRvIG1lcmdlLlxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlckRlZmluaXRpb25zKHtcbiAgICogICAgICdIZXJvJzogbXlIZXJvRW50aXR5RGVmaW5pdGlvbixcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbkVudGl0eURlZmluaXRpb25cbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyRGVmaW5pdGlvbnMoZGVmaW5pdGlvbnM6IEVudGl0eURlZmluaXRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmRlZmluaXRpb25zLCBkZWZpbml0aW9ucyk7XG4gIH1cbn1cbiJdfQ==