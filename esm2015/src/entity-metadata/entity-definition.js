/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    let entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    /** @type {?} */
    const selectId = metadata.selectId || defaultSelectId;
    /** @type {?} */
    const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    /** @type {?} */
    const entityAdapter = createEntityAdapter({ selectId, sortComparer });
    /** @type {?} */
    const entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    /** @type {?} */
    const initialState = entityAdapter.getInitialState(Object.assign({ entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
    /** @type {?} */
    const noChangeTracking = metadata.noChangeTracking === true;
    return {
        entityName,
        entityAdapter,
        entityDispatcherOptions,
        initialState,
        metadata,
        noChangeTracking,
        selectId,
        sortComparer,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUE4QixtQkFBbUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVEvRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7O0FBS3JELHNDQVNDOzs7SUFSQyxzQ0FBbUI7O0lBQ25CLHlDQUFnQzs7SUFDaEMsbURBQWtFOztJQUNsRSx3Q0FBa0M7O0lBQ2xDLG9DQUE0Qjs7SUFDNUIsNENBQTBCOztJQUMxQixvQ0FBd0I7O0lBQ3hCLHdDQUFrQzs7Ozs7OztBQUdwQyxNQUFNLFVBQVUsc0JBQXNCLENBQ3BDLFFBQThCOztRQUUxQixVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVU7SUFDcEMsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNoRDtJQUNELFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7VUFDL0MsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLElBQUksZUFBZTs7VUFDL0MsWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQzs7VUFFdkUsYUFBYSxHQUFHLG1CQUFtQixDQUFJLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDOztVQUVsRSx1QkFBdUIsR0FDM0IsUUFBUSxDQUFDLHVCQUF1QixJQUFJLEVBQUU7O1VBRWxDLFlBQVksR0FBd0IsYUFBYSxDQUFDLGVBQWUsaUJBQ3JFLFVBQVUsRUFDVixNQUFNLEVBQUUsRUFBRSxFQUNWLE1BQU0sRUFBRSxLQUFLLEVBQ2IsT0FBTyxFQUFFLEtBQUssRUFDZCxXQUFXLEVBQUUsRUFBRSxJQUNaLENBQUMsUUFBUSxDQUFDLHlCQUF5QixJQUFJLEVBQUUsQ0FBQyxFQUM3Qzs7VUFFSSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLEtBQUssSUFBSTtJQUUzRCxPQUFPO1FBQ0wsVUFBVTtRQUNWLGFBQWE7UUFDYix1QkFBdUI7UUFDdkIsWUFBWTtRQUNaLFFBQVE7UUFDUixnQkFBZ0I7UUFDaEIsUUFBUTtRQUNSLFlBQVk7S0FDYixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eVN0YXRlLCBFbnRpdHlBZGFwdGVyLCBjcmVhdGVFbnRpdHlBZGFwdGVyIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7IENvbXBhcmVyLCBEaWN0aW9uYXJ5LCBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQge1xuICBFbnRpdHlTZWxlY3RvcnMsXG4gIEVudGl0eVNlbGVjdG9yc0ZhY3RvcnksXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUZpbHRlckZuIH0gZnJvbSAnLi9lbnRpdHktZmlsdGVycyc7XG5pbXBvcnQgeyBFbnRpdHlNZXRhZGF0YSB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEZWZpbml0aW9uPFQgPSBhbnk+IHtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdHlBZGFwdGVyOiBFbnRpdHlBZGFwdGVyPFQ+O1xuICBlbnRpdHlEaXNwYXRjaGVyT3B0aW9ucz86IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPjtcbiAgaW5pdGlhbFN0YXRlOiBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xuICBtZXRhZGF0YTogRW50aXR5TWV0YWRhdGE8VD47XG4gIG5vQ2hhbmdlVHJhY2tpbmc6IGJvb2xlYW47XG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuICBzb3J0Q29tcGFyZXI6IGZhbHNlIHwgQ29tcGFyZXI8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlEZWZpbml0aW9uPFQsIFMgZXh0ZW5kcyBvYmplY3Q+KFxuICBtZXRhZGF0YTogRW50aXR5TWV0YWRhdGE8VCwgUz5cbik6IEVudGl0eURlZmluaXRpb248VD4ge1xuICBsZXQgZW50aXR5TmFtZSA9IG1ldGFkYXRhLmVudGl0eU5hbWU7XG4gIGlmICghZW50aXR5TmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyByZXF1aXJlZCBlbnRpdHlOYW1lJyk7XG4gIH1cbiAgbWV0YWRhdGEuZW50aXR5TmFtZSA9IGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgY29uc3Qgc2VsZWN0SWQgPSBtZXRhZGF0YS5zZWxlY3RJZCB8fCBkZWZhdWx0U2VsZWN0SWQ7XG4gIGNvbnN0IHNvcnRDb21wYXJlciA9IChtZXRhZGF0YS5zb3J0Q29tcGFyZXIgPSBtZXRhZGF0YS5zb3J0Q29tcGFyZXIgfHwgZmFsc2UpO1xuXG4gIGNvbnN0IGVudGl0eUFkYXB0ZXIgPSBjcmVhdGVFbnRpdHlBZGFwdGVyPFQ+KHsgc2VsZWN0SWQsIHNvcnRDb21wYXJlciB9KTtcblxuICBjb25zdCBlbnRpdHlEaXNwYXRjaGVyT3B0aW9uczogUGFydGlhbDxFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM+ID1cbiAgICBtZXRhZGF0YS5lbnRpdHlEaXNwYXRjaGVyT3B0aW9ucyB8fCB7fTtcblxuICBjb25zdCBpbml0aWFsU3RhdGU6IEVudGl0eUNvbGxlY3Rpb248VD4gPSBlbnRpdHlBZGFwdGVyLmdldEluaXRpYWxTdGF0ZSh7XG4gICAgZW50aXR5TmFtZSxcbiAgICBmaWx0ZXI6ICcnLFxuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2hhbmdlU3RhdGU6IHt9LFxuICAgIC4uLihtZXRhZGF0YS5hZGRpdGlvbmFsQ29sbGVjdGlvblN0YXRlIHx8IHt9KSxcbiAgfSk7XG5cbiAgY29uc3Qgbm9DaGFuZ2VUcmFja2luZyA9IG1ldGFkYXRhLm5vQ2hhbmdlVHJhY2tpbmcgPT09IHRydWU7IC8vIGZhbHNlIGJ5IGRlZmF1bHRcblxuICByZXR1cm4ge1xuICAgIGVudGl0eU5hbWUsXG4gICAgZW50aXR5QWRhcHRlcixcbiAgICBlbnRpdHlEaXNwYXRjaGVyT3B0aW9ucyxcbiAgICBpbml0aWFsU3RhdGUsXG4gICAgbWV0YWRhdGEsXG4gICAgbm9DaGFuZ2VUcmFja2luZyxcbiAgICBzZWxlY3RJZCxcbiAgICBzb3J0Q29tcGFyZXIsXG4gIH07XG59XG4iXX0=