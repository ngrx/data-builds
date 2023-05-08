import { Injectable, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../entity-metadata/entity-definition.service";
class EntityCollectionCreator {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionCreator, deps: [{ token: i1.EntityDefinitionService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionCreator }); }
}
export { EntityCollectionCreator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionCreator, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityDefinitionService, decorators: [{
                    type: Optional
                }] }]; } });
export function createEmptyEntityCollection(entityName) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBS3JELE1BQ2EsdUJBQXVCO0lBQ2xDLFlBQ3NCLHVCQUFpRDtRQUFqRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQTBCO0lBQ3BFLENBQUM7SUFFSjs7O09BR0c7SUFDSCxNQUFNLENBQ0osVUFBa0I7UUFFbEIsTUFBTSxHQUFHLEdBQ1AsSUFBSSxDQUFDLHVCQUF1QjtZQUM1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUN4QyxVQUFVLEVBQ1YsS0FBSyxDQUFDLGVBQWUsQ0FDdEIsQ0FBQztRQUVKLE1BQU0sWUFBWSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO1FBRTdDLE9BQVUsQ0FBQyxZQUFZLElBQUksMkJBQTJCLENBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO2lJQXRCVSx1QkFBdUI7cUlBQXZCLHVCQUF1Qjs7U0FBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVU7OzBCQUdOLFFBQVE7O0FBdUJiLE1BQU0sVUFBVSwyQkFBMkIsQ0FDekMsVUFBbUI7SUFFbkIsT0FBTztRQUNMLFVBQVU7UUFDVixHQUFHLEVBQUUsRUFBRTtRQUNQLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRSxFQUFFO0tBQ08sQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U/OiBFbnRpdHlEZWZpbml0aW9uU2VydmljZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgZGVmYXVsdCBjb2xsZWN0aW9uIGZvciBhbiBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gZW50aXR5IHR5cGUgbmFtZVxuICAgKi9cbiAgY3JlYXRlPFQgPSBhbnksIFMgZXh0ZW5kcyBFbnRpdHlDb2xsZWN0aW9uPFQ+ID0gRW50aXR5Q29sbGVjdGlvbjxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IFMge1xuICAgIGNvbnN0IGRlZiA9XG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlICYmXG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGZhbHNlIC8qc2hvdWxkVGhyb3cqL1xuICAgICAgKTtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IGRlZiAmJiBkZWYuaW5pdGlhbFN0YXRlO1xuXG4gICAgcmV0dXJuIDxTPihpbml0aWFsU3RhdGUgfHwgY3JlYXRlRW1wdHlFbnRpdHlDb2xsZWN0aW9uPFQ+KGVudGl0eU5hbWUpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlFbnRpdHlDb2xsZWN0aW9uPFQ+KFxuICBlbnRpdHlOYW1lPzogc3RyaW5nXG4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgcmV0dXJuIHtcbiAgICBlbnRpdHlOYW1lLFxuICAgIGlkczogW10sXG4gICAgZW50aXRpZXM6IHt9LFxuICAgIGZpbHRlcjogdW5kZWZpbmVkLFxuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2hhbmdlU3RhdGU6IHt9LFxuICB9IGFzIEVudGl0eUNvbGxlY3Rpb248VD47XG59XG4iXX0=