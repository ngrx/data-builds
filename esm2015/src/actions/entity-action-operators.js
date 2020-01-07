/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/actions/entity-action-operators.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7QUFtQmpELE1BQU0sVUFBVSxVQUFVLENBQ3hCLEdBQUcsZ0JBQXVCOztVQUVwQixHQUFHLEdBQWEsV0FBVyxDQUFDLGdCQUFnQixDQUFDO0lBQ25ELFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNsQixLQUFLLENBQUM7WUFDSixPQUFPLE1BQU07Ozs7WUFDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksRUFDcEQsQ0FBQztRQUNKLEtBQUssQ0FBQzs7a0JBQ0UsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxNQUFNOzs7O1lBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUUsQ0FDcEMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQ25ELENBQUM7UUFDSjtZQUNFLE9BQU8sTUFBTTs7OztZQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFOztzQkFDOUIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUMxRCxPQUFPLFFBQVEsSUFBSSxHQUFHLENBQUMsSUFBSTs7OztnQkFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUMsQ0FBQztZQUNuRCxDQUFDLEVBQ0YsQ0FBQztLQUNMO0FBQ0gsQ0FBQzs7Ozs7O0FBb0JELE1BQU0sVUFBVSxZQUFZLENBQzFCLEdBQUcsa0JBQXlCOztVQUV0QixLQUFLLEdBQWEsV0FBVyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZELFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNwQixLQUFLLENBQUM7WUFDSixPQUFPLE1BQU07Ozs7WUFDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksRUFDdEQsQ0FBQztRQUNKLEtBQUssQ0FBQzs7a0JBQ0UsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDckIsT0FBTyxNQUFNOzs7O1lBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUUsQ0FDcEMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQ3ZELENBQUM7UUFDSjtZQUNFLE9BQU8sTUFBTTs7OztZQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFOztzQkFDOUIsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUM5RCxPQUFPLENBQUMsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLElBQUk7Ozs7Z0JBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssVUFBVSxFQUFDLENBQUM7WUFDM0QsQ0FBQyxFQUNGLENBQUM7S0FDTDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4vZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4vZW50aXR5LW9wJztcbmltcG9ydCB7IGZsYXR0ZW5BcmdzIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcblxuLyoqXG4gKiBTZWxlY3QgYWN0aW9ucyBjb25jZXJuaW5nIG9uZSBvZiB0aGUgYWxsb3dlZCBFbnRpdHkgb3BlcmF0aW9uc1xuICogQHBhcmFtIGFsbG93ZWRFbnRpdHlPcHMgRW50aXR5IG9wZXJhdGlvbnMgKGUuZywgRW50aXR5T3AuUVVFUllfQUxMKSB3aG9zZSBhY3Rpb25zIHNob3VsZCBiZSBzZWxlY3RlZFxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoRW50aXR5T3AuUVVFUllfQUxMLCBFbnRpdHlPcC5RVUVSWV9NQU5ZKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoLi4ucXVlcnlPcHMpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcChxdWVyeU9wcyksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKCksIC4uLikgLy8gYW55IGFjdGlvbiB3aXRoIGEgZGVmaW5lZCBgZW50aXR5T3BgIHByb3BlcnR5XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5T3A8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIGFsbG93ZWRPcHM6IHN0cmluZ1tdIHwgRW50aXR5T3BbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5T3A8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRPcHM6IChzdHJpbmcgfCBFbnRpdHlPcClbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5T3A8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRFbnRpdHlPcHM6IGFueVtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD4ge1xuICBjb25zdCBvcHM6IHN0cmluZ1tdID0gZmxhdHRlbkFyZ3MoYWxsb3dlZEVudGl0eU9wcyk7XG4gIHN3aXRjaCAob3BzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5T3AgIT0gbnVsbFxuICAgICAgKTtcbiAgICBjYXNlIDE6XG4gICAgICBjb25zdCBvcCA9IG9wc1swXTtcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgb3AgPT09IGFjdGlvbi5wYXlsb2FkLmVudGl0eU9wXG4gICAgICApO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PiB7XG4gICAgICAgICAgY29uc3QgZW50aXR5T3AgPSBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlPcDtcbiAgICAgICAgICByZXR1cm4gZW50aXR5T3AgJiYgb3BzLnNvbWUobyA9PiBvID09PSBlbnRpdHlPcCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZWxlY3QgYWN0aW9ucyBjb25jZXJuaW5nIG9uZSBvZiB0aGUgYWxsb3dlZCBFbnRpdHkgdHlwZXNcbiAqIEBwYXJhbSBhbGxvd2VkRW50aXR5TmFtZXMgRW50aXR5LXR5cGUgbmFtZXMgKGUuZywgJ0hlcm8nKSB3aG9zZSBhY3Rpb25zIHNob3VsZCBiZSBzZWxlY3RlZFxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSgpLCAuLi4pIC8vIGF5biBFbnRpdHlBY3Rpb24gd2l0aCBhIGRlZmluZWQgZW50aXR5IHR5cGUgcHJvcGVydHlcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoJ0hlcm8nKSwgLi4uKSAvLyBFbnRpdHlBY3Rpb25zIGZvciB0aGUgSGVybyBlbnRpdHlcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoJ0hlcm8nLCAnVmlsbGFpbicsICdTaWRla2ljaycpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKC4uLnRoZUNob3NlbiksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUodGhlQ2hvc2VuKSwgLi4uKVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eVR5cGU8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIGFsbG93ZWRFbnRpdHlOYW1lcz86IHN0cmluZ1tdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlUeXBlPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkRW50aXR5TmFtZXM6IHN0cmluZ1tdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlUeXBlPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkRW50aXR5TmFtZXM6IGFueVtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD4ge1xuICBjb25zdCBuYW1lczogc3RyaW5nW10gPSBmbGF0dGVuQXJncyhhbGxvd2VkRW50aXR5TmFtZXMpO1xuICBzd2l0Y2ggKG5hbWVzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZSAhPSBudWxsXG4gICAgICApO1xuICAgIGNhc2UgMTpcbiAgICAgIGNvbnN0IG5hbWUgPSBuYW1lc1swXTtcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgbmFtZSA9PT0gYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZVxuICAgICAgKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT4ge1xuICAgICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lO1xuICAgICAgICAgIHJldHVybiAhIWVudGl0eU5hbWUgJiYgbmFtZXMuc29tZShuID0+IG4gPT09IGVudGl0eU5hbWUpO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG59XG4iXX0=