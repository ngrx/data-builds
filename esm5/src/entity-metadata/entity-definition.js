var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-metadata/entity-definition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { createEntityAdapter } from '@ngrx/entity';
import { defaultSelectId } from '../utils/utilities';
/**
 * @record
 * @template T
 */
export function EntityDefinition() { }
if (false) {
    /** @type {?} */
    EntityDefinition.prototype.entityName;
    /** @type {?} */
    EntityDefinition.prototype.entityAdapter;
    /** @type {?|undefined} */
    EntityDefinition.prototype.entityDispatcherOptions;
    /** @type {?} */
    EntityDefinition.prototype.initialState;
    /** @type {?} */
    EntityDefinition.prototype.metadata;
    /** @type {?} */
    EntityDefinition.prototype.noChangeTracking;
    /** @type {?} */
    EntityDefinition.prototype.selectId;
    /** @type {?} */
    EntityDefinition.prototype.sortComparer;
}
/**
 * @template T, S
 * @param {?} metadata
 * @return {?}
 */
export function createEntityDefinition(metadata) {
    /** @type {?} */
    var entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    /** @type {?} */
    var selectId = metadata.selectId || defaultSelectId;
    /** @type {?} */
    var sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    /** @type {?} */
    var entityAdapter = createEntityAdapter({ selectId: selectId, sortComparer: sortComparer });
    /** @type {?} */
    var entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    /** @type {?} */
    var initialState = entityAdapter.getInitialState(__assign({ entityName: entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
    /** @type {?} */
    var noChangeTracking = metadata.noChangeTracking === true;
    return {
        entityName: entityName,
        entityAdapter: entityAdapter,
        entityDispatcherOptions: entityDispatcherOptions,
        initialState: initialState,
        metadata: metadata,
        noChangeTracking: noChangeTracking,
        selectId: selectId,
        sortComparer: sortComparer,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFpQixtQkFBbUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUlsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7O0FBSXJELHNDQVNDOzs7SUFSQyxzQ0FBbUI7O0lBQ25CLHlDQUFnQzs7SUFDaEMsbURBQWtFOztJQUNsRSx3Q0FBa0M7O0lBQ2xDLG9DQUE0Qjs7SUFDNUIsNENBQTBCOztJQUMxQixvQ0FBd0I7O0lBQ3hCLHdDQUFrQzs7Ozs7OztBQUdwQyxNQUFNLFVBQVUsc0JBQXNCLENBQ3BDLFFBQThCOztRQUUxQixVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVU7SUFDcEMsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNoRDtJQUNELFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7UUFDL0MsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLElBQUksZUFBZTs7UUFDL0MsWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQzs7UUFFdkUsYUFBYSxHQUFHLG1CQUFtQixDQUFJLEVBQUUsUUFBUSxVQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUUsQ0FBQzs7UUFFbEUsdUJBQXVCLEdBQzNCLFFBQVEsQ0FBQyx1QkFBdUIsSUFBSSxFQUFFOztRQUVsQyxZQUFZLEdBQXdCLGFBQWEsQ0FBQyxlQUFlLFlBQ3JFLFVBQVUsWUFBQSxFQUNWLE1BQU0sRUFBRSxFQUFFLEVBQ1YsTUFBTSxFQUFFLEtBQUssRUFDYixPQUFPLEVBQUUsS0FBSyxFQUNkLFdBQVcsRUFBRSxFQUFFLElBQ1osQ0FBQyxRQUFRLENBQUMseUJBQXlCLElBQUksRUFBRSxDQUFDLEVBQzdDOztRQUVJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJO0lBRTNELE9BQU87UUFDTCxVQUFVLFlBQUE7UUFDVixhQUFhLGVBQUE7UUFDYix1QkFBdUIseUJBQUE7UUFDdkIsWUFBWSxjQUFBO1FBQ1osUUFBUSxVQUFBO1FBQ1IsZ0JBQWdCLGtCQUFBO1FBQ2hCLFFBQVEsVUFBQTtRQUNSLFlBQVksY0FBQTtLQUNiLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgY3JlYXRlRW50aXR5QWRhcHRlciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5pbXBvcnQgeyBDb21wYXJlciwgSWRTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eU1ldGFkYXRhIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURlZmluaXRpb248VCA9IGFueT4ge1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0eUFkYXB0ZXI6IEVudGl0eUFkYXB0ZXI8VD47XG4gIGVudGl0eURpc3BhdGNoZXJPcHRpb25zPzogUGFydGlhbDxFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM+O1xuICBpbml0aWFsU3RhdGU6IEVudGl0eUNvbGxlY3Rpb248VD47XG4gIG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YTxUPjtcbiAgbm9DaGFuZ2VUcmFja2luZzogYm9vbGVhbjtcbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG4gIHNvcnRDb21wYXJlcjogZmFsc2UgfCBDb21wYXJlcjxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVudGl0eURlZmluaXRpb248VCwgUyBleHRlbmRzIG9iamVjdD4oXG4gIG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YTxULCBTPlxuKTogRW50aXR5RGVmaW5pdGlvbjxUPiB7XG4gIGxldCBlbnRpdHlOYW1lID0gbWV0YWRhdGEuZW50aXR5TmFtZTtcbiAgaWYgKCFlbnRpdHlOYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIGVudGl0eU5hbWUnKTtcbiAgfVxuICBtZXRhZGF0YS5lbnRpdHlOYW1lID0gZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICBjb25zdCBzZWxlY3RJZCA9IG1ldGFkYXRhLnNlbGVjdElkIHx8IGRlZmF1bHRTZWxlY3RJZDtcbiAgY29uc3Qgc29ydENvbXBhcmVyID0gKG1ldGFkYXRhLnNvcnRDb21wYXJlciA9IG1ldGFkYXRhLnNvcnRDb21wYXJlciB8fCBmYWxzZSk7XG5cbiAgY29uc3QgZW50aXR5QWRhcHRlciA9IGNyZWF0ZUVudGl0eUFkYXB0ZXI8VD4oeyBzZWxlY3RJZCwgc29ydENvbXBhcmVyIH0pO1xuXG4gIGNvbnN0IGVudGl0eURpc3BhdGNoZXJPcHRpb25zOiBQYXJ0aWFsPEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucz4gPVxuICAgIG1ldGFkYXRhLmVudGl0eURpc3BhdGNoZXJPcHRpb25zIHx8IHt9O1xuXG4gIGNvbnN0IGluaXRpYWxTdGF0ZTogRW50aXR5Q29sbGVjdGlvbjxUPiA9IGVudGl0eUFkYXB0ZXIuZ2V0SW5pdGlhbFN0YXRlKHtcbiAgICBlbnRpdHlOYW1lLFxuICAgIGZpbHRlcjogJycsXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjaGFuZ2VTdGF0ZToge30sXG4gICAgLi4uKG1ldGFkYXRhLmFkZGl0aW9uYWxDb2xsZWN0aW9uU3RhdGUgfHwge30pLFxuICB9KTtcblxuICBjb25zdCBub0NoYW5nZVRyYWNraW5nID0gbWV0YWRhdGEubm9DaGFuZ2VUcmFja2luZyA9PT0gdHJ1ZTsgLy8gZmFsc2UgYnkgZGVmYXVsdFxuXG4gIHJldHVybiB7XG4gICAgZW50aXR5TmFtZSxcbiAgICBlbnRpdHlBZGFwdGVyLFxuICAgIGVudGl0eURpc3BhdGNoZXJPcHRpb25zLFxuICAgIGluaXRpYWxTdGF0ZSxcbiAgICBtZXRhZGF0YSxcbiAgICBub0NoYW5nZVRyYWNraW5nLFxuICAgIHNlbGVjdElkLFxuICAgIHNvcnRDb21wYXJlcixcbiAgfTtcbn1cbiJdfQ==