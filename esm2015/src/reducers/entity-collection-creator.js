import { Injectable, Optional } from '@angular/core';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
export class EntityCollectionCreator {
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
}
EntityCollectionCreator.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionCreator.ctorParameters = () => [
    { type: EntityDefinitionService, decorators: [{ type: Optional }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdyRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUd2RixNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLFlBQ3NCLHVCQUFpRDtRQUFqRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQTBCO0lBQ3BFLENBQUM7SUFFSjs7O09BR0c7SUFDSCxNQUFNLENBQ0osVUFBa0I7UUFFbEIsTUFBTSxHQUFHLEdBQ1AsSUFBSSxDQUFDLHVCQUF1QjtZQUM1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUN4QyxVQUFVLEVBQ1YsS0FBSyxDQUFDLGVBQWUsQ0FDdEIsQ0FBQztRQUVKLE1BQU0sWUFBWSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO1FBRTdDLE9BQVUsQ0FBQyxZQUFZLElBQUksMkJBQTJCLENBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7WUF2QkYsVUFBVTs7OztZQUZGLHVCQUF1Qix1QkFLM0IsUUFBUTs7QUF1QmIsTUFBTSxVQUFVLDJCQUEyQixDQUN6QyxVQUFtQjtJQUVuQixPQUFPO1FBQ0wsVUFBVTtRQUNWLEdBQUcsRUFBRSxFQUFFO1FBQ1AsUUFBUSxFQUFFLEVBQUU7UUFDWixNQUFNLEVBQUUsU0FBUztRQUNqQixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLEVBQUU7S0FDTyxDQUFDO0FBQzNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBlbnRpdHlEZWZpbml0aW9uU2VydmljZT86IEVudGl0eURlZmluaXRpb25TZXJ2aWNlXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBkZWZhdWx0IGNvbGxlY3Rpb24gZm9yIGFuIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBlbnRpdHkgdHlwZSBuYW1lXG4gICAqL1xuICBjcmVhdGU8VCA9IGFueSwgUyBleHRlbmRzIEVudGl0eUNvbGxlY3Rpb248VD4gPSBFbnRpdHlDb2xsZWN0aW9uPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogUyB7XG4gICAgY29uc3QgZGVmID1cbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UgJiZcbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbjxUPihcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZmFsc2UgLypzaG91bGRUaHJvdyovXG4gICAgICApO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gZGVmICYmIGRlZi5pbml0aWFsU3RhdGU7XG5cbiAgICByZXR1cm4gPFM+KGluaXRpYWxTdGF0ZSB8fCBjcmVhdGVFbXB0eUVudGl0eUNvbGxlY3Rpb248VD4oZW50aXR5TmFtZSkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUVudGl0eUNvbGxlY3Rpb248VD4oXG4gIGVudGl0eU5hbWU/OiBzdHJpbmdcbik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICByZXR1cm4ge1xuICAgIGVudGl0eU5hbWUsXG4gICAgaWRzOiBbXSxcbiAgICBlbnRpdGllczoge30sXG4gICAgZmlsdGVyOiB1bmRlZmluZWQsXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjaGFuZ2VTdGF0ZToge30sXG4gIH0gYXMgRW50aXR5Q29sbGVjdGlvbjxUPjtcbn1cbiJdfQ==