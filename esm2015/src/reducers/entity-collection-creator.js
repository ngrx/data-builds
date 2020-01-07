/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/reducers/entity-collection-creator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3JELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR3ZGLE1BQU0sT0FBTyx1QkFBdUI7Ozs7SUFDbEMsWUFDc0IsdUJBQWlEO1FBQWpELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBMEI7SUFDcEUsQ0FBQzs7Ozs7OztJQU1KLE1BQU0sQ0FDSixVQUFrQjs7Y0FFWixHQUFHLEdBQ1AsSUFBSSxDQUFDLHVCQUF1QjtZQUM1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUN4QyxVQUFVLEVBQ1YsS0FBSyxDQUFDLGVBQWUsQ0FDdEI7O2NBRUcsWUFBWSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWTtRQUU1QyxPQUFPLG1CQUFHLENBQUMsWUFBWSxJQUFJLDJCQUEyQixDQUFJLFVBQVUsQ0FBQyxDQUFDLEVBQUEsQ0FBQztJQUN6RSxDQUFDOzs7WUF2QkYsVUFBVTs7OztZQUZGLHVCQUF1Qix1QkFLM0IsUUFBUTs7Ozs7OztJQUFULDBEQUFxRTs7Ozs7OztBQXVCekUsTUFBTSxVQUFVLDJCQUEyQixDQUN6QyxVQUFtQjtJQUVuQixPQUFPLG1CQUFBO1FBQ0wsVUFBVTtRQUNWLEdBQUcsRUFBRSxFQUFFO1FBQ1AsUUFBUSxFQUFFLEVBQUU7UUFDWixNQUFNLEVBQUUsU0FBUztRQUNqQixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLEVBQUU7S0FDaEIsRUFBdUIsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5RGVmaW5pdGlvblNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uQ3JlYXRvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U/OiBFbnRpdHlEZWZpbml0aW9uU2VydmljZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgZGVmYXVsdCBjb2xsZWN0aW9uIGZvciBhbiBlbnRpdHkgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gZW50aXR5IHR5cGUgbmFtZVxuICAgKi9cbiAgY3JlYXRlPFQgPSBhbnksIFMgZXh0ZW5kcyBFbnRpdHlDb2xsZWN0aW9uPFQ+ID0gRW50aXR5Q29sbGVjdGlvbjxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IFMge1xuICAgIGNvbnN0IGRlZiA9XG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlICYmXG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oXG4gICAgICAgIGVudGl0eU5hbWUsXG4gICAgICAgIGZhbHNlIC8qc2hvdWxkVGhyb3cqL1xuICAgICAgKTtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IGRlZiAmJiBkZWYuaW5pdGlhbFN0YXRlO1xuXG4gICAgcmV0dXJuIDxTPihpbml0aWFsU3RhdGUgfHwgY3JlYXRlRW1wdHlFbnRpdHlDb2xsZWN0aW9uPFQ+KGVudGl0eU5hbWUpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlFbnRpdHlDb2xsZWN0aW9uPFQ+KFxuICBlbnRpdHlOYW1lPzogc3RyaW5nXG4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgcmV0dXJuIHtcbiAgICBlbnRpdHlOYW1lLFxuICAgIGlkczogW10sXG4gICAgZW50aXRpZXM6IHt9LFxuICAgIGZpbHRlcjogdW5kZWZpbmVkLFxuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2hhbmdlU3RhdGU6IHt9LFxuICB9IGFzIEVudGl0eUNvbGxlY3Rpb248VD47XG59XG4iXX0=