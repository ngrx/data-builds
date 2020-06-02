/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-collection-creator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * Create the default collection for an entity type.
     * @template T, S
     * @param {?} entityName {string} entity type name
     * @return {?}
     */
    EntityCollectionCreator.prototype.create = /**
     * Create the default collection for an entity type.
     * @template T, S
     * @param {?} entityName {string} entity type name
     * @return {?}
     */
    function (entityName) {
        /** @type {?} */
        var def = this.entityDefinitionService &&
            this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
        /** @type {?} */
        var initialState = def && def.initialState;
        return (/** @type {?} */ ((initialState || createEmptyEntityCollection(entityName))));
    };
    EntityCollectionCreator.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EntityCollectionCreator.ctorParameters = function () { return [
        { type: EntityDefinitionService, decorators: [{ type: Optional }] }
    ]; };
    return EntityCollectionCreator;
}());
export { EntityCollectionCreator };
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
        entityName: entityName,
        ids: [],
        entities: {},
        filter: undefined,
        loaded: false,
        loading: false,
        changeState: {},
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3JELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRXZGO0lBRUUsaUNBQ3NCLHVCQUFpRDtRQUFqRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQTBCO0lBQ3BFLENBQUM7SUFFSjs7O09BR0c7Ozs7Ozs7SUFDSCx3Q0FBTTs7Ozs7O0lBQU4sVUFDRSxVQUFrQjs7WUFFWixHQUFHLEdBQ1AsSUFBSSxDQUFDLHVCQUF1QjtZQUM1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUN4QyxVQUFVLEVBQ1YsS0FBSyxDQUFDLGVBQWUsQ0FDdEI7O1lBRUcsWUFBWSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWTtRQUU1QyxPQUFPLG1CQUFHLENBQUMsWUFBWSxJQUFJLDJCQUEyQixDQUFJLFVBQVUsQ0FBQyxDQUFDLEVBQUEsQ0FBQztJQUN6RSxDQUFDOztnQkF2QkYsVUFBVTs7OztnQkFGRix1QkFBdUIsdUJBSzNCLFFBQVE7O0lBcUJiLDhCQUFDO0NBQUEsQUF4QkQsSUF3QkM7U0F2QlksdUJBQXVCOzs7Ozs7SUFFaEMsMERBQXFFOzs7Ozs7O0FBdUJ6RSxNQUFNLFVBQVUsMkJBQTJCLENBQ3pDLFVBQW1CO0lBRW5CLE9BQU8sbUJBQUE7UUFDTCxVQUFVLFlBQUE7UUFDVixHQUFHLEVBQUUsRUFBRTtRQUNQLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRSxFQUFFO0tBQ2hCLEVBQXVCLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlPzogRW50aXR5RGVmaW5pdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGRlZmF1bHQgY29sbGVjdGlvbiBmb3IgYW4gZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IGVudGl0eSB0eXBlIG5hbWVcbiAgICovXG4gIGNyZWF0ZTxUID0gYW55LCBTIGV4dGVuZHMgRW50aXR5Q29sbGVjdGlvbjxUPiA9IEVudGl0eUNvbGxlY3Rpb248VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBTIHtcbiAgICBjb25zdCBkZWYgPVxuICAgICAgdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZSAmJlxuICAgICAgdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uPFQ+KFxuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBmYWxzZSAvKnNob3VsZFRocm93Ki9cbiAgICAgICk7XG5cbiAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBkZWYgJiYgZGVmLmluaXRpYWxTdGF0ZTtcblxuICAgIHJldHVybiA8Uz4oaW5pdGlhbFN0YXRlIHx8IGNyZWF0ZUVtcHR5RW50aXR5Q29sbGVjdGlvbjxUPihlbnRpdHlOYW1lKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVtcHR5RW50aXR5Q29sbGVjdGlvbjxUPihcbiAgZW50aXR5TmFtZT86IHN0cmluZ1xuKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gIHJldHVybiB7XG4gICAgZW50aXR5TmFtZSxcbiAgICBpZHM6IFtdLFxuICAgIGVudGl0aWVzOiB7fSxcbiAgICBmaWx0ZXI6IHVuZGVmaW5lZCxcbiAgICBsb2FkZWQ6IGZhbHNlLFxuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgfSBhcyBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xufVxuIl19