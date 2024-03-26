import { filter } from 'rxjs/operators';
import { flattenArgs } from '../utils/utilities';
export function ofEntityOp(...allowedEntityOps) {
    const ops = flattenArgs(allowedEntityOps);
    switch (ops.length) {
        case 0:
            return filter((action) => action.payload && action.payload.entityOp != null);
        case 1:
            const op = ops[0];
            return filter((action) => action.payload && op === action.payload.entityOp);
        default:
            return filter((action) => {
                const entityOp = action.payload && action.payload.entityOp;
                return entityOp && ops.some((o) => o === entityOp);
            });
    }
}
export function ofEntityType(...allowedEntityNames) {
    const names = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter((action) => action.payload && action.payload.entityName != null);
        case 1:
            const name = names[0];
            return filter((action) => action.payload && name === action.payload.entityName);
        default:
            return filter((action) => {
                const entityName = action.payload && action.payload.entityName;
                return !!entityName && names.some((n) => n === entityName);
            });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXhDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQW1CakQsTUFBTSxVQUFVLFVBQVUsQ0FDeEIsR0FBRyxnQkFBdUI7SUFFMUIsTUFBTSxHQUFHLEdBQWEsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDcEQsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkIsS0FBSyxDQUFDO1lBQ0osT0FBTyxNQUFNLENBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUUsQ0FDcEMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQ3BELENBQUM7UUFDSixLQUFLLENBQUM7WUFDSixNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsT0FBTyxNQUFNLENBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUUsQ0FDcEMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQ25ELENBQUM7UUFDSjtZQUNFLE9BQU8sTUFBTSxDQUFDLENBQUMsTUFBb0IsRUFBZSxFQUFFO2dCQUNsRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO2dCQUMzRCxPQUFPLFFBQVEsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0FBQ0gsQ0FBQztBQW9CRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixHQUFHLGtCQUF5QjtJQUU1QixNQUFNLEtBQUssR0FBYSxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4RCxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQixLQUFLLENBQUM7WUFDSixPQUFPLE1BQU0sQ0FDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FDdEQsQ0FBQztRQUNKLEtBQUssQ0FBQztZQUNKLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixPQUFPLE1BQU0sQ0FDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FDdkQsQ0FBQztRQUNKO1lBQ0UsT0FBTyxNQUFNLENBQUMsQ0FBQyxNQUFvQixFQUFlLEVBQUU7Z0JBQ2xELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7Z0JBQy9ELE9BQU8sQ0FBQyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi9lbnRpdHktb3AnO1xuaW1wb3J0IHsgZmxhdHRlbkFyZ3MgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuXG4vKipcbiAqIFNlbGVjdCBhY3Rpb25zIGNvbmNlcm5pbmcgb25lIG9mIHRoZSBhbGxvd2VkIEVudGl0eSBvcGVyYXRpb25zXG4gKiBAcGFyYW0gYWxsb3dlZEVudGl0eU9wcyBFbnRpdHkgb3BlcmF0aW9ucyAoZS5nLCBFbnRpdHlPcC5RVUVSWV9BTEwpIHdob3NlIGFjdGlvbnMgc2hvdWxkIGJlIHNlbGVjdGVkXG4gKiBFeGFtcGxlOlxuICogYGBgXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcChFbnRpdHlPcC5RVUVSWV9BTEwsIEVudGl0eU9wLlFVRVJZX01BTlkpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcCguLi5xdWVyeU9wcyksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKHF1ZXJ5T3BzKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoKSwgLi4uKSAvLyBhbnkgYWN0aW9uIHdpdGggYSBkZWZpbmVkIGBlbnRpdHlPcGAgcHJvcGVydHlcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlPcDxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgYWxsb3dlZE9wczogc3RyaW5nW10gfCBFbnRpdHlPcFtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlPcDxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZE9wczogKHN0cmluZyB8IEVudGl0eU9wKVtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlPcDxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZEVudGl0eU9wczogYW55W11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPiB7XG4gIGNvbnN0IG9wczogc3RyaW5nW10gPSBmbGF0dGVuQXJncyhhbGxvd2VkRW50aXR5T3BzKTtcbiAgc3dpdGNoIChvcHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCAhPSBudWxsXG4gICAgICApO1xuICAgIGNhc2UgMTpcbiAgICAgIGNvbnN0IG9wID0gb3BzWzBdO1xuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBvcCA9PT0gYWN0aW9uLnBheWxvYWQuZW50aXR5T3BcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmaWx0ZXIoKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHlPcCA9IGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU9wO1xuICAgICAgICByZXR1cm4gZW50aXR5T3AgJiYgb3BzLnNvbWUoKG8pID0+IG8gPT09IGVudGl0eU9wKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU2VsZWN0IGFjdGlvbnMgY29uY2VybmluZyBvbmUgb2YgdGhlIGFsbG93ZWQgRW50aXR5IHR5cGVzXG4gKiBAcGFyYW0gYWxsb3dlZEVudGl0eU5hbWVzIEVudGl0eS10eXBlIG5hbWVzIChlLmcsICdIZXJvJykgd2hvc2UgYWN0aW9ucyBzaG91bGQgYmUgc2VsZWN0ZWRcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoKSwgLi4uKSAvLyBheW4gRW50aXR5QWN0aW9uIHdpdGggYSBkZWZpbmVkIGVudGl0eSB0eXBlIHByb3BlcnR5XG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKCdIZXJvJyksIC4uLikgLy8gRW50aXR5QWN0aW9ucyBmb3IgdGhlIEhlcm8gZW50aXR5XG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKCdIZXJvJywgJ1ZpbGxhaW4nLCAnU2lkZWtpY2snKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSguLi50aGVDaG9zZW4pLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKHRoZUNob3NlbiksIC4uLilcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlUeXBlPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICBhbGxvd2VkRW50aXR5TmFtZXM/OiBzdHJpbmdbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5VHlwZTxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZEVudGl0eU5hbWVzOiBzdHJpbmdbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5VHlwZTxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZEVudGl0eU5hbWVzOiBhbnlbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+IHtcbiAgY29uc3QgbmFtZXM6IHN0cmluZ1tdID0gZmxhdHRlbkFyZ3MoYWxsb3dlZEVudGl0eU5hbWVzKTtcbiAgc3dpdGNoIChuYW1lcy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUgIT0gbnVsbFxuICAgICAgKTtcbiAgICBjYXNlIDE6XG4gICAgICBjb25zdCBuYW1lID0gbmFtZXNbMF07XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIG5hbWUgPT09IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmaWx0ZXIoKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZTtcbiAgICAgICAgcmV0dXJuICEhZW50aXR5TmFtZSAmJiBuYW1lcy5zb21lKChuKSA9PiBuID09PSBlbnRpdHlOYW1lKTtcbiAgICAgIH0pO1xuICB9XG59XG4iXX0=