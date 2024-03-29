import { createEntityAdapter } from '@ngrx/entity';
import { defaultSelectId } from '../utils/utilities';
export function createEntityDefinition(metadata) {
    let entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    const selectId = metadata.selectId || defaultSelectId;
    const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    const entityAdapter = createEntityAdapter({ selectId, sortComparer });
    const entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    const initialState = entityAdapter.getInitialState({
        entityName,
        filter: '',
        loaded: false,
        loading: false,
        changeState: {},
        ...(metadata.additionalCollectionState || {}),
    });
    const noChangeTracking = metadata.noChangeTracking === true; // false by default
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLG1CQUFtQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBSWxFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQWVyRCxNQUFNLFVBQVUsc0JBQXNCLENBQ3BDLFFBQThCO0lBRTlCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDckMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsUUFBUSxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLElBQUksZUFBZSxDQUFDO0lBQ3RELE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxDQUFDO0lBRTlFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFJLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFekUsTUFBTSx1QkFBdUIsR0FDM0IsUUFBUSxDQUFDLHVCQUF1QixJQUFJLEVBQUUsQ0FBQztJQUV6QyxNQUFNLFlBQVksR0FBd0IsYUFBYSxDQUFDLGVBQWUsQ0FBQztRQUN0RSxVQUFVO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLEVBQUU7UUFDZixHQUFHLENBQUMsUUFBUSxDQUFDLHlCQUF5QixJQUFJLEVBQUUsQ0FBQztLQUM5QyxDQUFDLENBQUM7SUFFSCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsQ0FBQyxtQkFBbUI7SUFFaEYsT0FBTztRQUNMLFVBQVU7UUFDVixhQUFhO1FBQ2IsdUJBQXVCO1FBQ3ZCLFlBQVk7UUFDWixRQUFRO1FBQ1IsZ0JBQWdCO1FBQ2hCLFFBQVE7UUFDUixZQUFZO0tBQ2IsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlBZGFwdGVyLCBjcmVhdGVFbnRpdHlBZGFwdGVyIH0gZnJvbSAnQG5ncngvZW50aXR5JztcbmltcG9ydCB7IENvbXBhcmVyLCBJZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5TWV0YWRhdGEgfSBmcm9tICcuL2VudGl0eS1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGVmaW5pdGlvbjxUID0gYW55PiB7XG4gIGVudGl0eU5hbWU6IHN0cmluZztcbiAgZW50aXR5QWRhcHRlcjogRW50aXR5QWRhcHRlcjxUPjtcbiAgZW50aXR5RGlzcGF0Y2hlck9wdGlvbnM/OiBQYXJ0aWFsPEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucz47XG4gIGluaXRpYWxTdGF0ZTogRW50aXR5Q29sbGVjdGlvbjxUPjtcbiAgbWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhPFQ+O1xuICBub0NoYW5nZVRyYWNraW5nOiBib29sZWFuO1xuICBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPjtcbiAgc29ydENvbXBhcmVyOiBmYWxzZSB8IENvbXBhcmVyPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW50aXR5RGVmaW5pdGlvbjxULCBTIGV4dGVuZHMgb2JqZWN0PihcbiAgbWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhPFQsIFM+XG4pOiBFbnRpdHlEZWZpbml0aW9uPFQ+IHtcbiAgbGV0IGVudGl0eU5hbWUgPSBtZXRhZGF0YS5lbnRpdHlOYW1lO1xuICBpZiAoIWVudGl0eU5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcmVxdWlyZWQgZW50aXR5TmFtZScpO1xuICB9XG4gIG1ldGFkYXRhLmVudGl0eU5hbWUgPSBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gIGNvbnN0IHNlbGVjdElkID0gbWV0YWRhdGEuc2VsZWN0SWQgfHwgZGVmYXVsdFNlbGVjdElkO1xuICBjb25zdCBzb3J0Q29tcGFyZXIgPSAobWV0YWRhdGEuc29ydENvbXBhcmVyID0gbWV0YWRhdGEuc29ydENvbXBhcmVyIHx8IGZhbHNlKTtcblxuICBjb25zdCBlbnRpdHlBZGFwdGVyID0gY3JlYXRlRW50aXR5QWRhcHRlcjxUPih7IHNlbGVjdElkLCBzb3J0Q29tcGFyZXIgfSk7XG5cbiAgY29uc3QgZW50aXR5RGlzcGF0Y2hlck9wdGlvbnM6IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPiA9XG4gICAgbWV0YWRhdGEuZW50aXR5RGlzcGF0Y2hlck9wdGlvbnMgfHwge307XG5cbiAgY29uc3QgaW5pdGlhbFN0YXRlOiBFbnRpdHlDb2xsZWN0aW9uPFQ+ID0gZW50aXR5QWRhcHRlci5nZXRJbml0aWFsU3RhdGUoe1xuICAgIGVudGl0eU5hbWUsXG4gICAgZmlsdGVyOiAnJyxcbiAgICBsb2FkZWQ6IGZhbHNlLFxuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgICAuLi4obWV0YWRhdGEuYWRkaXRpb25hbENvbGxlY3Rpb25TdGF0ZSB8fCB7fSksXG4gIH0pO1xuXG4gIGNvbnN0IG5vQ2hhbmdlVHJhY2tpbmcgPSBtZXRhZGF0YS5ub0NoYW5nZVRyYWNraW5nID09PSB0cnVlOyAvLyBmYWxzZSBieSBkZWZhdWx0XG5cbiAgcmV0dXJuIHtcbiAgICBlbnRpdHlOYW1lLFxuICAgIGVudGl0eUFkYXB0ZXIsXG4gICAgZW50aXR5RGlzcGF0Y2hlck9wdGlvbnMsXG4gICAgaW5pdGlhbFN0YXRlLFxuICAgIG1ldGFkYXRhLFxuICAgIG5vQ2hhbmdlVHJhY2tpbmcsXG4gICAgc2VsZWN0SWQsXG4gICAgc29ydENvbXBhcmVyLFxuICB9O1xufVxuIl19