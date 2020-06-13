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
                (o) => o === entityOp));
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
                (n) => n === entityName));
            }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7QUFtQmpELE1BQU0sVUFBVSxVQUFVLENBQ3hCLEdBQUcsZ0JBQXVCOztVQUVwQixHQUFHLEdBQWEsV0FBVyxDQUFDLGdCQUFnQixDQUFDO0lBQ25ELFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNsQixLQUFLLENBQUM7WUFDSixPQUFPLE1BQU07Ozs7WUFDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksRUFDcEQsQ0FBQztRQUNKLEtBQUssQ0FBQzs7a0JBQ0UsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxNQUFNOzs7O1lBQ1gsQ0FBQyxNQUFvQixFQUFlLEVBQUUsQ0FDcEMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQ25ELENBQUM7UUFDSjtZQUNFLE9BQU8sTUFBTTs7OztZQUFDLENBQUMsTUFBb0IsRUFBZSxFQUFFOztzQkFDNUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUMxRCxPQUFPLFFBQVEsSUFBSSxHQUFHLENBQUMsSUFBSTs7OztnQkFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBQyxDQUFDO1lBQ3JELENBQUMsRUFBQyxDQUFDO0tBQ047QUFDSCxDQUFDOzs7Ozs7QUFvQkQsTUFBTSxVQUFVLFlBQVksQ0FDMUIsR0FBRyxrQkFBeUI7O1VBRXRCLEtBQUssR0FBYSxXQUFXLENBQUMsa0JBQWtCLENBQUM7SUFDdkQsUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ3BCLEtBQUssQ0FBQztZQUNKLE9BQU8sTUFBTTs7OztZQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxFQUN0RCxDQUFDO1FBQ0osS0FBSyxDQUFDOztrQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLE1BQU07Ozs7WUFDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFDdkQsQ0FBQztRQUNKO1lBQ0UsT0FBTyxNQUFNOzs7O1lBQUMsQ0FBQyxNQUFvQixFQUFlLEVBQUU7O3NCQUM1QyxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7Z0JBQzlELE9BQU8sQ0FBQyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSTs7OztnQkFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBQyxDQUFDO1lBQzdELENBQUMsRUFBQyxDQUFDO0tBQ047QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBmbGF0dGVuQXJncyB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5cbi8qKlxuICogU2VsZWN0IGFjdGlvbnMgY29uY2VybmluZyBvbmUgb2YgdGhlIGFsbG93ZWQgRW50aXR5IG9wZXJhdGlvbnNcbiAqIEBwYXJhbSBhbGxvd2VkRW50aXR5T3BzIEVudGl0eSBvcGVyYXRpb25zIChlLmcsIEVudGl0eU9wLlFVRVJZX0FMTCkgd2hvc2UgYWN0aW9ucyBzaG91bGQgYmUgc2VsZWN0ZWRcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKEVudGl0eU9wLlFVRVJZX0FMTCwgRW50aXR5T3AuUVVFUllfTUFOWSksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKC4uLnF1ZXJ5T3BzKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AocXVlcnlPcHMpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcCgpLCAuLi4pIC8vIGFueSBhY3Rpb24gd2l0aCBhIGRlZmluZWQgYGVudGl0eU9wYCBwcm9wZXJ0eVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eU9wPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICBhbGxvd2VkT3BzOiBzdHJpbmdbXSB8IEVudGl0eU9wW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eU9wPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkT3BzOiAoc3RyaW5nIHwgRW50aXR5T3ApW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eU9wPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkRW50aXR5T3BzOiBhbnlbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+IHtcbiAgY29uc3Qgb3BzOiBzdHJpbmdbXSA9IGZsYXR0ZW5BcmdzKGFsbG93ZWRFbnRpdHlPcHMpO1xuICBzd2l0Y2ggKG9wcy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU9wICE9IG51bGxcbiAgICAgICk7XG4gICAgY2FzZSAxOlxuICAgICAgY29uc3Qgb3AgPSBvcHNbMF07XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIG9wID09PSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlPcFxuICAgICAgKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZpbHRlcigoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eU9wID0gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5T3A7XG4gICAgICAgIHJldHVybiBlbnRpdHlPcCAmJiBvcHMuc29tZSgobykgPT4gbyA9PT0gZW50aXR5T3ApO1xuICAgICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZWxlY3QgYWN0aW9ucyBjb25jZXJuaW5nIG9uZSBvZiB0aGUgYWxsb3dlZCBFbnRpdHkgdHlwZXNcbiAqIEBwYXJhbSBhbGxvd2VkRW50aXR5TmFtZXMgRW50aXR5LXR5cGUgbmFtZXMgKGUuZywgJ0hlcm8nKSB3aG9zZSBhY3Rpb25zIHNob3VsZCBiZSBzZWxlY3RlZFxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSgpLCAuLi4pIC8vIGF5biBFbnRpdHlBY3Rpb24gd2l0aCBhIGRlZmluZWQgZW50aXR5IHR5cGUgcHJvcGVydHlcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoJ0hlcm8nKSwgLi4uKSAvLyBFbnRpdHlBY3Rpb25zIGZvciB0aGUgSGVybyBlbnRpdHlcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoJ0hlcm8nLCAnVmlsbGFpbicsICdTaWRla2ljaycpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKC4uLnRoZUNob3NlbiksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUodGhlQ2hvc2VuKSwgLi4uKVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eVR5cGU8VCBleHRlbmRzIEVudGl0eUFjdGlvbj4oXG4gIGFsbG93ZWRFbnRpdHlOYW1lcz86IHN0cmluZ1tdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlUeXBlPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkRW50aXR5TmFtZXM6IHN0cmluZ1tdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD47XG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlUeXBlPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkRW50aXR5TmFtZXM6IGFueVtdXG4pOiBPcGVyYXRvckZ1bmN0aW9uPEVudGl0eUFjdGlvbiwgVD4ge1xuICBjb25zdCBuYW1lczogc3RyaW5nW10gPSBmbGF0dGVuQXJncyhhbGxvd2VkRW50aXR5TmFtZXMpO1xuICBzd2l0Y2ggKG5hbWVzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZSAhPSBudWxsXG4gICAgICApO1xuICAgIGNhc2UgMTpcbiAgICAgIGNvbnN0IG5hbWUgPSBuYW1lc1swXTtcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQgJiYgbmFtZSA9PT0gYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZVxuICAgICAgKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZpbHRlcigoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lO1xuICAgICAgICByZXR1cm4gISFlbnRpdHlOYW1lICYmIG5hbWVzLnNvbWUoKG4pID0+IG4gPT09IGVudGl0eU5hbWUpO1xuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==