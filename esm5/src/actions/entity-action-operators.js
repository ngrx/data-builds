/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action-operators.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { filter } from 'rxjs/operators';
import { flattenArgs } from '../utils/utilities';
/**
 * @template T
 * @param {...?} allowedEntityOps
 * @return {?}
 */
export function ofEntityOp() {
    var allowedEntityOps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedEntityOps[_i] = arguments[_i];
    }
    /** @type {?} */
    var ops = flattenArgs(allowedEntityOps);
    switch (ops.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && action.payload.entityOp != null;
            }));
        case 1:
            /** @type {?} */
            var op_1 = ops[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && op_1 === action.payload.entityOp;
            }));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                /** @type {?} */
                var entityOp = action.payload && action.payload.entityOp;
                return entityOp && ops.some((/**
                 * @param {?} o
                 * @return {?}
                 */
                function (o) { return o === entityOp; }));
            }));
    }
}
/**
 * @template T
 * @param {...?} allowedEntityNames
 * @return {?}
 */
export function ofEntityType() {
    var allowedEntityNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedEntityNames[_i] = arguments[_i];
    }
    /** @type {?} */
    var names = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && action.payload.entityName != null;
            }));
        case 1:
            /** @type {?} */
            var name_1 = names[0];
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                return action.payload && name_1 === action.payload.entityName;
            }));
        default:
            return filter((/**
             * @param {?} action
             * @return {?}
             */
            function (action) {
                /** @type {?} */
                var entityName = action.payload && action.payload.entityName;
                return !!entityName && names.some((/**
                 * @param {?} n
                 * @return {?}
                 */
                function (n) { return n === entityName; }));
            }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7QUFtQmpELE1BQU0sVUFBVSxVQUFVO0lBQ3hCLDBCQUEwQjtTQUExQixVQUEwQixFQUExQixxQkFBMEIsRUFBMUIsSUFBMEI7UUFBMUIscUNBQTBCOzs7UUFFcEIsR0FBRyxHQUFhLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNuRCxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDbEIsS0FBSyxDQUFDO1lBQ0osT0FBTyxNQUFNOzs7O1lBQ1gsVUFBQyxNQUFvQjtnQkFDbkIsT0FBQSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUk7WUFBakQsQ0FBaUQsRUFDcEQsQ0FBQztRQUNKLEtBQUssQ0FBQzs7Z0JBQ0UsSUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxNQUFNOzs7O1lBQ1gsVUFBQyxNQUFvQjtnQkFDbkIsT0FBQSxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUUsS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVE7WUFBaEQsQ0FBZ0QsRUFDbkQsQ0FBQztRQUNKO1lBQ0UsT0FBTyxNQUFNOzs7O1lBQUMsVUFBQyxNQUFvQjs7b0JBQzNCLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUTtnQkFDMUQsT0FBTyxRQUFRLElBQUksR0FBRyxDQUFDLElBQUk7Ozs7Z0JBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEtBQUssUUFBUSxFQUFkLENBQWMsRUFBQyxDQUFDO1lBQ3JELENBQUMsRUFBQyxDQUFDO0tBQ047QUFDSCxDQUFDOzs7Ozs7QUFvQkQsTUFBTSxVQUFVLFlBQVk7SUFDMUIsNEJBQTRCO1NBQTVCLFVBQTRCLEVBQTVCLHFCQUE0QixFQUE1QixJQUE0QjtRQUE1Qix1Q0FBNEI7OztRQUV0QixLQUFLLEdBQWEsV0FBVyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZELFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNwQixLQUFLLENBQUM7WUFDSixPQUFPLE1BQU07Ozs7WUFDWCxVQUFDLE1BQW9CO2dCQUNuQixPQUFBLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSTtZQUFuRCxDQUFtRCxFQUN0RCxDQUFDO1FBQ0osS0FBSyxDQUFDOztnQkFDRSxNQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLE1BQU07Ozs7WUFDWCxVQUFDLE1BQW9CO2dCQUNuQixPQUFBLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBSSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUFwRCxDQUFvRCxFQUN2RCxDQUFDO1FBQ0o7WUFDRSxPQUFPLE1BQU07Ozs7WUFBQyxVQUFDLE1BQW9COztvQkFDM0IsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUM5RCxPQUFPLENBQUMsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLElBQUk7Ozs7Z0JBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEtBQUssVUFBVSxFQUFoQixDQUFnQixFQUFDLENBQUM7WUFDN0QsQ0FBQyxFQUFDLENBQUM7S0FDTjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4vZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4vZW50aXR5LW9wJztcbmltcG9ydCB7IGZsYXR0ZW5BcmdzIH0gZnJvbSAnLi4vdXRpbHMvdXRpbGl0aWVzJztcblxuLyoqXG4gKiBTZWxlY3QgYWN0aW9ucyBjb25jZXJuaW5nIG9uZSBvZiB0aGUgYWxsb3dlZCBFbnRpdHkgb3BlcmF0aW9uc1xuICogQHBhcmFtIGFsbG93ZWRFbnRpdHlPcHMgRW50aXR5IG9wZXJhdGlvbnMgKGUuZywgRW50aXR5T3AuUVVFUllfQUxMKSB3aG9zZSBhY3Rpb25zIHNob3VsZCBiZSBzZWxlY3RlZFxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoRW50aXR5T3AuUVVFUllfQUxMLCBFbnRpdHlPcC5RVUVSWV9NQU5ZKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoLi4ucXVlcnlPcHMpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcChxdWVyeU9wcyksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKCksIC4uLikgLy8gYW55IGFjdGlvbiB3aXRoIGEgZGVmaW5lZCBgZW50aXR5T3BgIHByb3BlcnR5XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5T3A8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIGFsbG93ZWRPcHM6IHN0cmluZ1tdIHwgRW50aXR5T3BbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5T3A8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRPcHM6IChzdHJpbmcgfCBFbnRpdHlPcClbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5T3A8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRFbnRpdHlPcHM6IGFueVtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD4ge1xuICBjb25zdCBvcHM6IHN0cmluZ1tdID0gZmxhdHRlbkFyZ3MoYWxsb3dlZEVudGl0eU9wcyk7XG4gIHN3aXRjaCAob3BzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5T3AgIT0gbnVsbFxuICAgICAgKTtcbiAgICBjYXNlIDE6XG4gICAgICBjb25zdCBvcCA9IG9wc1swXTtcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgb3AgPT09IGFjdGlvbi5wYXlsb2FkLmVudGl0eU9wXG4gICAgICApO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmlsdGVyKChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5T3AgPSBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlPcDtcbiAgICAgICAgcmV0dXJuIGVudGl0eU9wICYmIG9wcy5zb21lKChvKSA9PiBvID09PSBlbnRpdHlPcCk7XG4gICAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFNlbGVjdCBhY3Rpb25zIGNvbmNlcm5pbmcgb25lIG9mIHRoZSBhbGxvd2VkIEVudGl0eSB0eXBlc1xuICogQHBhcmFtIGFsbG93ZWRFbnRpdHlOYW1lcyBFbnRpdHktdHlwZSBuYW1lcyAoZS5nLCAnSGVybycpIHdob3NlIGFjdGlvbnMgc2hvdWxkIGJlIHNlbGVjdGVkXG4gKiBFeGFtcGxlOlxuICogYGBgXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKCksIC4uLikgLy8gYXluIEVudGl0eUFjdGlvbiB3aXRoIGEgZGVmaW5lZCBlbnRpdHkgdHlwZSBwcm9wZXJ0eVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSgnSGVybycpLCAuLi4pIC8vIEVudGl0eUFjdGlvbnMgZm9yIHRoZSBIZXJvIGVudGl0eVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSgnSGVybycsICdWaWxsYWluJywgJ1NpZGVraWNrJyksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoLi4udGhlQ2hvc2VuKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSh0aGVDaG9zZW4pLCAuLi4pXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5VHlwZTxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgYWxsb3dlZEVudGl0eU5hbWVzPzogc3RyaW5nW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eVR5cGU8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRFbnRpdHlOYW1lczogc3RyaW5nW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eVR5cGU8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIC4uLmFsbG93ZWRFbnRpdHlOYW1lczogYW55W11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPiB7XG4gIGNvbnN0IG5hbWVzOiBzdHJpbmdbXSA9IGZsYXR0ZW5BcmdzKGFsbG93ZWRFbnRpdHlOYW1lcyk7XG4gIHN3aXRjaCAobmFtZXMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lICE9IG51bGxcbiAgICAgICk7XG4gICAgY2FzZSAxOlxuICAgICAgY29uc3QgbmFtZSA9IG5hbWVzWzBdO1xuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT5cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZCAmJiBuYW1lID09PSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lXG4gICAgICApO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmlsdGVyKChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWU7XG4gICAgICAgIHJldHVybiAhIWVudGl0eU5hbWUgJiYgbmFtZXMuc29tZSgobikgPT4gbiA9PT0gZW50aXR5TmFtZSk7XG4gICAgICB9KTtcbiAgfVxufVxuIl19