import { __assign } from "tslib";
import { createEntityAdapter } from '@ngrx/entity';
import { defaultSelectId } from '../utils/utilities';
export function createEntityDefinition(metadata) {
    var entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    var selectId = metadata.selectId || defaultSelectId;
    var sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    var entityAdapter = createEntityAdapter({ selectId: selectId, sortComparer: sortComparer });
    var entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    var initialState = entityAdapter.getInitialState(__assign({ entityName: entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
    var noChangeTracking = metadata.noChangeTracking === true; // false by default
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFpQixtQkFBbUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUlsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFlckQsTUFBTSxVQUFVLHNCQUFzQixDQUNwQyxRQUE4QjtJQUU5QixJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDaEQ7SUFDRCxRQUFRLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsSUFBSSxlQUFlLENBQUM7SUFDdEQsSUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLENBQUM7SUFFOUUsSUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUksRUFBRSxRQUFRLFVBQUEsRUFBRSxZQUFZLGNBQUEsRUFBRSxDQUFDLENBQUM7SUFFekUsSUFBTSx1QkFBdUIsR0FDM0IsUUFBUSxDQUFDLHVCQUF1QixJQUFJLEVBQUUsQ0FBQztJQUV6QyxJQUFNLFlBQVksR0FBd0IsYUFBYSxDQUFDLGVBQWUsWUFDckUsVUFBVSxZQUFBLEVBQ1YsTUFBTSxFQUFFLEVBQUUsRUFDVixNQUFNLEVBQUUsS0FBSyxFQUNiLE9BQU8sRUFBRSxLQUFLLEVBQ2QsV0FBVyxFQUFFLEVBQUUsSUFDWixDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsSUFBSSxFQUFFLENBQUMsRUFDN0MsQ0FBQztJQUVILElBQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxDQUFDLG1CQUFtQjtJQUVoRixPQUFPO1FBQ0wsVUFBVSxZQUFBO1FBQ1YsYUFBYSxlQUFBO1FBQ2IsdUJBQXVCLHlCQUFBO1FBQ3ZCLFlBQVksY0FBQTtRQUNaLFFBQVEsVUFBQTtRQUNSLGdCQUFnQixrQkFBQTtRQUNoQixRQUFRLFVBQUE7UUFDUixZQUFZLGNBQUE7S0FDYixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUFkYXB0ZXIsIGNyZWF0ZUVudGl0eUFkYXB0ZXIgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuaW1wb3J0IHsgQ29tcGFyZXIsIElkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHsgZGVmYXVsdFNlbGVjdElkIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlNZXRhZGF0YSB9IGZyb20gJy4vZW50aXR5LW1ldGFkYXRhJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEZWZpbml0aW9uPFQgPSBhbnk+IHtcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBlbnRpdHlBZGFwdGVyOiBFbnRpdHlBZGFwdGVyPFQ+O1xuICBlbnRpdHlEaXNwYXRjaGVyT3B0aW9ucz86IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPjtcbiAgaW5pdGlhbFN0YXRlOiBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xuICBtZXRhZGF0YTogRW50aXR5TWV0YWRhdGE8VD47XG4gIG5vQ2hhbmdlVHJhY2tpbmc6IGJvb2xlYW47XG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuICBzb3J0Q29tcGFyZXI6IGZhbHNlIHwgQ29tcGFyZXI8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlEZWZpbml0aW9uPFQsIFMgZXh0ZW5kcyBvYmplY3Q+KFxuICBtZXRhZGF0YTogRW50aXR5TWV0YWRhdGE8VCwgUz5cbik6IEVudGl0eURlZmluaXRpb248VD4ge1xuICBsZXQgZW50aXR5TmFtZSA9IG1ldGFkYXRhLmVudGl0eU5hbWU7XG4gIGlmICghZW50aXR5TmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyByZXF1aXJlZCBlbnRpdHlOYW1lJyk7XG4gIH1cbiAgbWV0YWRhdGEuZW50aXR5TmFtZSA9IGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgY29uc3Qgc2VsZWN0SWQgPSBtZXRhZGF0YS5zZWxlY3RJZCB8fCBkZWZhdWx0U2VsZWN0SWQ7XG4gIGNvbnN0IHNvcnRDb21wYXJlciA9IChtZXRhZGF0YS5zb3J0Q29tcGFyZXIgPSBtZXRhZGF0YS5zb3J0Q29tcGFyZXIgfHwgZmFsc2UpO1xuXG4gIGNvbnN0IGVudGl0eUFkYXB0ZXIgPSBjcmVhdGVFbnRpdHlBZGFwdGVyPFQ+KHsgc2VsZWN0SWQsIHNvcnRDb21wYXJlciB9KTtcblxuICBjb25zdCBlbnRpdHlEaXNwYXRjaGVyT3B0aW9uczogUGFydGlhbDxFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM+ID1cbiAgICBtZXRhZGF0YS5lbnRpdHlEaXNwYXRjaGVyT3B0aW9ucyB8fCB7fTtcblxuICBjb25zdCBpbml0aWFsU3RhdGU6IEVudGl0eUNvbGxlY3Rpb248VD4gPSBlbnRpdHlBZGFwdGVyLmdldEluaXRpYWxTdGF0ZSh7XG4gICAgZW50aXR5TmFtZSxcbiAgICBmaWx0ZXI6ICcnLFxuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2hhbmdlU3RhdGU6IHt9LFxuICAgIC4uLihtZXRhZGF0YS5hZGRpdGlvbmFsQ29sbGVjdGlvblN0YXRlIHx8IHt9KSxcbiAgfSk7XG5cbiAgY29uc3Qgbm9DaGFuZ2VUcmFja2luZyA9IG1ldGFkYXRhLm5vQ2hhbmdlVHJhY2tpbmcgPT09IHRydWU7IC8vIGZhbHNlIGJ5IGRlZmF1bHRcblxuICByZXR1cm4ge1xuICAgIGVudGl0eU5hbWUsXG4gICAgZW50aXR5QWRhcHRlcixcbiAgICBlbnRpdHlEaXNwYXRjaGVyT3B0aW9ucyxcbiAgICBpbml0aWFsU3RhdGUsXG4gICAgbWV0YWRhdGEsXG4gICAgbm9DaGFuZ2VUcmFja2luZyxcbiAgICBzZWxlY3RJZCxcbiAgICBzb3J0Q29tcGFyZXIsXG4gIH07XG59XG4iXX0=