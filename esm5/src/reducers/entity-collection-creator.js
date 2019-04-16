import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
var EntityCollectionCreator = /** @class */ (function () {
    function EntityCollectionCreator(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /**
     * Create the default collection for an entity type.
     * @param entityName {string} entity type name
     */
    EntityCollectionCreator.prototype.create = function (entityName) {
        var def = this.entityDefinitionService &&
            this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
        var initialState = def && def.initialState;
        return (initialState || createEmptyEntityCollection(entityName));
    };
    EntityCollectionCreator = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Optional()),
        tslib_1.__metadata("design:paramtypes", [EntityDefinitionService])
    ], EntityCollectionCreator);
    return EntityCollectionCreator;
}());
export { EntityCollectionCreator };
export function createEmptyEntityCollection(entityName) {
    return {
        entityName: entityName,
        ids: [],
        entities: {},
        filter: undefined,
        loaded: false,
        loading: false,
        changeState: {},
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHckQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFHdkY7SUFDRSxpQ0FDc0IsdUJBQWlEO1FBQWpELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBMEI7SUFDcEUsQ0FBQztJQUVKOzs7T0FHRztJQUNILHdDQUFNLEdBQU4sVUFDRSxVQUFrQjtRQUVsQixJQUFNLEdBQUcsR0FDUCxJQUFJLENBQUMsdUJBQXVCO1lBQzVCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQ3hDLFVBQVUsRUFDVixLQUFLLENBQUMsZUFBZSxDQUN0QixDQUFDO1FBRUosSUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFFN0MsT0FBVSxDQUFDLFlBQVksSUFBSSwyQkFBMkIsQ0FBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUF0QlUsdUJBQXVCO1FBRG5DLFVBQVUsRUFBRTtRQUdSLG1CQUFBLFFBQVEsRUFBRSxDQUFBO2lEQUFtQyx1QkFBdUI7T0FGNUQsdUJBQXVCLENBdUJuQztJQUFELDhCQUFDO0NBQUEsQUF2QkQsSUF1QkM7U0F2QlksdUJBQXVCO0FBeUJwQyxNQUFNLFVBQVUsMkJBQTJCLENBQ3pDLFVBQW1CO0lBRW5CLE9BQU87UUFDTCxVQUFVLFlBQUE7UUFDVixHQUFHLEVBQUUsRUFBRTtRQUNQLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRSxFQUFFO0tBQ08sQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U/OiBFbnRpdHlEZWZpbml0aW9uU2VydmljZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgZGVmYXVsdCBjb2xsZWN0aW9uIGZvciBhbiBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gZW50aXR5IHR5cGUgbmFtZVxuICAgKi9cbiAgY3JlYXRlPFQgPSBhbnksIFMgZXh0ZW5kcyBFbnRpdHlDb2xsZWN0aW9uPFQ+ID0gRW50aXR5Q29sbGVjdGlvbjxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IFMge1xuICAgIGNvbnN0IGRlZiA9XG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlICYmXG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGZhbHNlIC8qc2hvdWxkVGhyb3cqL1xuICAgICAgKTtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IGRlZiAmJiBkZWYuaW5pdGlhbFN0YXRlO1xuXG4gICAgcmV0dXJuIDxTPihpbml0aWFsU3RhdGUgfHwgY3JlYXRlRW1wdHlFbnRpdHlDb2xsZWN0aW9uPFQ+KGVudGl0eU5hbWUpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlFbnRpdHlDb2xsZWN0aW9uPFQ+KFxuICBlbnRpdHlOYW1lPzogc3RyaW5nXG4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgcmV0dXJuIHtcbiAgICBlbnRpdHlOYW1lLFxuICAgIGlkczogW10sXG4gICAgZW50aXRpZXM6IHt9LFxuICAgIGZpbHRlcjogdW5kZWZpbmVkLFxuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2hhbmdlU3RhdGU6IHt9LFxuICB9IGFzIEVudGl0eUNvbGxlY3Rpb248VD47XG59XG4iXX0=