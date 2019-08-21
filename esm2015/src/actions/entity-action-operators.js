/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { filter } from 'rxjs/operators';
import { flattenArgs } from '../utils/utilities';
/**
 * @template T
 * @param {...?} allowedEntityOps
 * @return {?}
 */
export function ofEntityOp(...allowedEntityOps) {
    /** @type {?} */
    const ops = flattenArgs(allowedEntityOps);
    switch (ops.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && action.payload.entityOp != null));
        case 1:
            /** @type {?} */
            const op = ops[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && op === action.payload.entityOp));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => {
                /** @type {?} */
                const entityOp = action.payload && action.payload.entityOp;
                return entityOp && ops.some((/**
                 * @param {?} o
                 * @return {?}
                 */
                o => o === entityOp));
            }));
    }
}
/**
 * @template T
 * @param {...?} allowedEntityNames
 * @return {?}
 */
export function ofEntityType(...allowedEntityNames) {
    /** @type {?} */
    const names = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && action.payload.entityName != null));
        case 1:
            /** @type {?} */
            const name = names[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => action.payload && name === action.payload.entityName));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            (action) => {
                /** @type {?} */
                const entityName = action.payload && action.payload.entityName;
                return !!entityName && names.some((/**
                 * @param {?} n
                 * @return {?}
                 */
                n => n === entityName));
            }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl4QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQW1CakQsTUFBTSxVQUFVLFVBQVUsQ0FDeEIsR0FBRyxnQkFBdUI7O1VBRXBCLEdBQUcsR0FBYSxXQUFXLENBQUMsZ0JBQWdCLENBQUM7SUFDbkQsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2xCLEtBQUssQ0FBQztZQUNKLE9BQU8sTUFBTTs7OztZQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxFQUNwRCxDQUFDO1FBQ0osS0FBSyxDQUFDOztrQkFDRSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqQixPQUFPLE1BQU07Ozs7WUFDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFDbkQsQ0FBQztRQUNKO1lBQ0UsT0FBTyxNQUFNOzs7O1lBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUU7O3NCQUM5QixRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVE7Z0JBQzFELE9BQU8sUUFBUSxJQUFJLEdBQUcsQ0FBQyxJQUFJOzs7O2dCQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBQyxDQUFDO1lBQ25ELENBQUMsRUFDRixDQUFDO0tBQ0w7QUFDSCxDQUFDOzs7Ozs7QUFvQkQsTUFBTSxVQUFVLFlBQVksQ0FDMUIsR0FBRyxrQkFBeUI7O1VBRXRCLEtBQUssR0FBYSxXQUFXLENBQUMsa0JBQWtCLENBQUM7SUFDdkQsUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ3BCLEtBQUssQ0FBQztZQUNKLE9BQU8sTUFBTTs7OztZQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxFQUN0RCxDQUFDO1FBQ0osS0FBSyxDQUFDOztrQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLE1BQU07Ozs7WUFDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFDdkQsQ0FBQztRQUNKO1lBQ0UsT0FBTyxNQUFNOzs7O1lBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUU7O3NCQUM5QixVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7Z0JBQzlELE9BQU8sQ0FBQyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSTs7OztnQkFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUMsQ0FBQztZQUMzRCxDQUFDLEVBQ0YsQ0FBQztLQUNMO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi9lbnRpdHktb3AnO1xuaW1wb3J0IHsgZmxhdHRlbkFyZ3MgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuXG4vKipcbiAqIFNlbGVjdCBhY3Rpb25zIGNvbmNlcm5pbmcgb25lIG9mIHRoZSBhbGxvd2VkIEVudGl0eSBvcGVyYXRpb25zXG4gKiBAcGFyYW0gYWxsb3dlZEVudGl0eU9wcyBFbnRpdHkgb3BlcmF0aW9ucyAoZS5nLCBFbnRpdHlPcC5RVUVSWV9BTEwpIHdob3NlIGFjdGlvbnMgc2hvdWxkIGJlIHNlbGVjdGVkXG4gKiBFeGFtcGxlOlxuICogYGBgXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcChFbnRpdHlPcC5RVUVSWV9BTEwsIEVudGl0eU9wLlFVRVJZX01BTlkpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcCguLi5xdWVyeU9wcyksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKHF1ZXJ5T3BzKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoKSwgLi4uKSAvLyBhbnkgYWN0aW9uIHdpdGggYSBkZWZpbmVkIGBlbnRpdHlPcGAgcHJvcGVydHlcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlPcDxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgYWxsb3dlZE9wczogc3RyaW5nW10gfCBFbnRpdHlPcFtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlPcDxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZE9wczogKHN0cmluZyB8IEVudGl0eU9wKVtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlPcDxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZEVudGl0eU9wczogYW55W11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPiB7XG4gIGNvbnN0IG9wczogc3RyaW5nW10gPSBmbGF0dGVuQXJncyhhbGxvd2VkRW50aXR5T3BzKTtcbiAgc3dpdGNoIChvcHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCAhPSBudWxsXG4gICAgICApO1xuICAgIGNhc2UgMTpcbiAgICAgIGNvbnN0IG9wID0gb3BzWzBdO1xuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBvcCA9PT0gYWN0aW9uLnBheWxvYWQuZW50aXR5T3BcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+IHtcbiAgICAgICAgICBjb25zdCBlbnRpdHlPcCA9IGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU9wO1xuICAgICAgICAgIHJldHVybiBlbnRpdHlPcCAmJiBvcHMuc29tZShvID0+IG8gPT09IGVudGl0eU9wKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlbGVjdCBhY3Rpb25zIGNvbmNlcm5pbmcgb25lIG9mIHRoZSBhbGxvd2VkIEVudGl0eSB0eXBlc1xuICogQHBhcmFtIGFsbG93ZWRFbnRpdHlOYW1lcyBFbnRpdHktdHlwZSBuYW1lcyAoZS5nLCAnSGVybycpIHdob3NlIGFjdGlvbnMgc2hvdWxkIGJlIHNlbGVjdGVkXG4gKiBFeGFtcGxlOlxuICogYGBgXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKCksIC4uLikgLy8gYXluIEVudGl0eUFjdGlvbiB3aXRoIGEgZGVmaW5lZCBlbnRpdHkgdHlwZSBwcm9wZXJ0eVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSgnSGVybycpLCAuLi4pIC8vIEVudGl0eUFjdGlvbnMgZm9yIHRoZSBIZXJvIGVudGl0eVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSgnSGVybycsICdWaWxsYWluJywgJ1NpZGVraWNrJyksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoLi4udGhlQ2hvc2VuKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSh0aGVDaG9zZW4pLCAuLi4pXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5VHlwZTxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgYWxsb3dlZEVudGl0eU5hbWVzPzogc3RyaW5nW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eVR5cGU8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRFbnRpdHlOYW1lczogc3RyaW5nW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eVR5cGU8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRFbnRpdHlOYW1lczogYW55W11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPiB7XG4gIGNvbnN0IG5hbWVzOiBzdHJpbmdbXSA9IGZsYXR0ZW5BcmdzKGFsbG93ZWRFbnRpdHlOYW1lcyk7XG4gIHN3aXRjaCAobmFtZXMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lICE9IG51bGxcbiAgICAgICk7XG4gICAgY2FzZSAxOlxuICAgICAgY29uc3QgbmFtZSA9IG5hbWVzWzBdO1xuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBuYW1lID09PSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lXG4gICAgICApO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PiB7XG4gICAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgICAgICAgcmV0dXJuICEhZW50aXR5TmFtZSAmJiBuYW1lcy5zb21lKG4gPT4gbiA9PT0gZW50aXR5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cbn1cbiJdfQ==