/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
export class EntityCollectionCreator {
    /**
     * @param {?=} entityDefinitionService
     */
    constructor(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /**
     * Create the default collection for an entity type.
     * @template T, S
     * @param {?} entityName {string} entity type name
     * @return {?}
     */
    create(entityName) {
        /** @type {?} */
        const def = this.entityDefinitionService &&
            this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
        /** @type {?} */
        const initialState = def && def.initialState;
        return (/** @type {?} */ ((initialState || createEmptyEntityCollection(entityName))));
    }
}
EntityCollectionCreator.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionCreator.ctorParameters = () => [
    { type: EntityDefinitionService, decorators: [{ type: Optional }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionCreator.prototype.entityDefinitionService;
}
/**
 * @template T
 * @param {?=} entityName
 * @return {?}
 */
export function createEmptyEntityCollection(entityName) {
    return (/** @type {?} */ ({
        entityName,
        ids: [],
        entities: {},
        filter: undefined,
        loaded: false,
        loading: false,
        changeState: {},
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHckQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFHdkYsTUFBTSxPQUFPLHVCQUF1Qjs7OztJQUNsQyxZQUNzQix1QkFBaUQ7UUFBakQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUEwQjtJQUNwRSxDQUFDOzs7Ozs7O0lBTUosTUFBTSxDQUNKLFVBQWtCOztjQUVaLEdBQUcsR0FDUCxJQUFJLENBQUMsdUJBQXVCO1lBQzVCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQ3hDLFVBQVUsRUFDVixLQUFLLENBQUMsZUFBZSxDQUN0Qjs7Y0FFRyxZQUFZLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZO1FBRTVDLE9BQU8sbUJBQUcsQ0FBQyxZQUFZLElBQUksMkJBQTJCLENBQUksVUFBVSxDQUFDLENBQUMsRUFBQSxDQUFDO0lBQ3pFLENBQUM7OztZQXZCRixVQUFVOzs7O1lBRkYsdUJBQXVCLHVCQUszQixRQUFROzs7Ozs7O0lBQVQsMERBQXFFOzs7Ozs7O0FBdUJ6RSxNQUFNLFVBQVUsMkJBQTJCLENBQ3pDLFVBQW1CO0lBRW5CLE9BQU8sbUJBQUE7UUFDTCxVQUFVO1FBQ1YsR0FBRyxFQUFFLEVBQUU7UUFDUCxRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLEtBQUs7UUFDZCxXQUFXLEVBQUUsRUFBRTtLQUNoQixFQUF1QixDQUFDO0FBQzNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBlbnRpdHlEZWZpbml0aW9uU2VydmljZT86IEVudGl0eURlZmluaXRpb25TZXJ2aWNlXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBkZWZhdWx0IGNvbGxlY3Rpb24gZm9yIGFuIGVudGl0eSB0eXBlLlxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSB7c3RyaW5nfSBlbnRpdHkgdHlwZSBuYW1lXG4gICAqL1xuICBjcmVhdGU8VCA9IGFueSwgUyBleHRlbmRzIEVudGl0eUNvbGxlY3Rpb248VD4gPSBFbnRpdHlDb2xsZWN0aW9uPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogUyB7XG4gICAgY29uc3QgZGVmID1cbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UgJiZcbiAgICAgIHRoaXMuZW50aXR5RGVmaW5pdGlvblNlcnZpY2UuZ2V0RGVmaW5pdGlvbjxUPihcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZmFsc2UgLypzaG91bGRUaHJvdyovXG4gICAgICApO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gZGVmICYmIGRlZi5pbml0aWFsU3RhdGU7XG5cbiAgICByZXR1cm4gPFM+KGluaXRpYWxTdGF0ZSB8fCBjcmVhdGVFbXB0eUVudGl0eUNvbGxlY3Rpb248VD4oZW50aXR5TmFtZSkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUVudGl0eUNvbGxlY3Rpb248VD4oXG4gIGVudGl0eU5hbWU/OiBzdHJpbmdcbik6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICByZXR1cm4ge1xuICAgIGVudGl0eU5hbWUsXG4gICAgaWRzOiBbXSxcbiAgICBlbnRpdGllczoge30sXG4gICAgZmlsdGVyOiB1bmRlZmluZWQsXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjaGFuZ2VTdGF0ZToge30sXG4gIH0gYXMgRW50aXR5Q29sbGVjdGlvbjxUPjtcbn1cbiJdfQ==