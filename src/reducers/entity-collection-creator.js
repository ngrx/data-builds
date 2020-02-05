(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/entity-collection-creator", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/entity-metadata/entity-definition.service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const entity_definition_service_1 = require("@ngrx/data/src/entity-metadata/entity-definition.service");
    let EntityCollectionCreator = class EntityCollectionCreator {
        constructor(entityDefinitionService) {
            this.entityDefinitionService = entityDefinitionService;
        }
        /**
         * Create the default collection for an entity type.
         * @param entityName {string} entity type name
         */
        create(entityName) {
            const def = this.entityDefinitionService &&
                this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
            const initialState = def && def.initialState;
            return (initialState || createEmptyEntityCollection(entityName));
        }
    };
    EntityCollectionCreator = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(0, core_1.Optional()),
        tslib_1.__metadata("design:paramtypes", [entity_definition_service_1.EntityDefinitionService])
    ], EntityCollectionCreator);
    exports.EntityCollectionCreator = EntityCollectionCreator;
    function createEmptyEntityCollection(entityName) {
        return {
            entityName,
            ids: [],
            entities: {},
            filter: undefined,
            loaded: false,
            loading: false,
            changeState: {},
        };
    }
    exports.createEmptyEntityCollection = createEmptyEntityCollection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBcUQ7SUFHckQsd0dBQXVGO0lBR3ZGLElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXVCO1FBQ2xDLFlBQ3NCLHVCQUFpRDtZQUFqRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQTBCO1FBQ3BFLENBQUM7UUFFSjs7O1dBR0c7UUFDSCxNQUFNLENBQ0osVUFBa0I7WUFFbEIsTUFBTSxHQUFHLEdBQ1AsSUFBSSxDQUFDLHVCQUF1QjtnQkFDNUIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FDeEMsVUFBVSxFQUNWLEtBQUssQ0FBQyxlQUFlLENBQ3RCLENBQUM7WUFFSixNQUFNLFlBQVksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQztZQUU3QyxPQUFVLENBQUMsWUFBWSxJQUFJLDJCQUEyQixDQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDekUsQ0FBQztLQUNGLENBQUE7SUF2QlksdUJBQXVCO1FBRG5DLGlCQUFVLEVBQUU7UUFHUixtQkFBQSxlQUFRLEVBQUUsQ0FBQTtpREFBbUMsbURBQXVCO09BRjVELHVCQUF1QixDQXVCbkM7SUF2QlksMERBQXVCO0lBeUJwQyxTQUFnQiwyQkFBMkIsQ0FDekMsVUFBbUI7UUFFbkIsT0FBTztZQUNMLFVBQVU7WUFDVixHQUFHLEVBQUUsRUFBRTtZQUNQLFFBQVEsRUFBRSxFQUFFO1lBQ1osTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLFdBQVcsRUFBRSxFQUFFO1NBQ08sQ0FBQztJQUMzQixDQUFDO0lBWkQsa0VBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBlbnRpdHlEZWZpbml0aW9uU2VydmljZT86IEVudGl0eURlZmluaXRpb25TZXJ2aWNlXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBkZWZhdWx0IGNvbGxlY3Rpb24gZm9yIGFuIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBlbnRpdHkgdHlwZSBuYW1lXG4gICAqL1xuICBjcmVhdGU8VCA9IGFueSwgUyBleHRlbmRzIEVudGl0eUNvbGxlY3Rpb248VD4gPSBFbnRpdHlDb2xsZWN0aW9uPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogUyB7XG4gICAgY29uc3QgZGVmID1cbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UgJiZcbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbjxUPihcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZmFsc2UgLypzaG91bGRUaHJvdyovXG4gICAgICApO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gZGVmICYmIGRlZi5pbml0aWFsU3RhdGU7XG5cbiAgICByZXR1cm4gPFM+KGluaXRpYWxTdGF0ZSB8fCBjcmVhdGVFbXB0eUVudGl0eUNvbGxlY3Rpb248VD4oZW50aXR5TmFtZSkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUVudGl0eUNvbGxlY3Rpb248VD4oXG4gIGVudGl0eU5hbWU/OiBzdHJpbmdcbik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICByZXR1cm4ge1xuICAgIGVudGl0eU5hbWUsXG4gICAgaWRzOiBbXSxcbiAgICBlbnRpdGllczoge30sXG4gICAgZmlsdGVyOiB1bmRlZmluZWQsXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjaGFuZ2VTdGF0ZToge30sXG4gIH0gYXMgRW50aXR5Q29sbGVjdGlvbjxUPjtcbn1cbiJdfQ==