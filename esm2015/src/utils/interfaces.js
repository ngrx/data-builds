/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
/**
 * @abstract
 */
export class Logger {
}
if (false) {
    /**
     * @abstract
     * @param {?=} message
     * @param {...?} optionalParams
     * @return {?}
     */
    Logger.prototype.error = function (message, optionalParams) { };
    /**
     * @abstract
     * @param {?=} message
     * @param {...?} optionalParams
     * @return {?}
     */
    Logger.prototype.log = function (message, optionalParams) { };
    /**
     * @abstract
     * @param {?=} message
     * @param {...?} optionalParams
     * @return {?}
     */
    Logger.prototype.warn = function (message, optionalParams) { };
}
/**
 * Mapping of entity type name to its plural
 * @record
 */
export function EntityPluralNames() { }
/** @type {?} */
export const PLURAL_NAMES_TOKEN = new InjectionToken('@ngrx/data/plural-names');
/**
 * @abstract
 */
export class Pluralizer {
}
if (false) {
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    Pluralizer.prototype.pluralize = function (name) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvdXRpbHMvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUUvQyxNQUFNLE9BQWdCLE1BQU07Q0FJM0I7Ozs7Ozs7O0lBSEMsZ0VBQThEOzs7Ozs7O0lBQzlELDhEQUE0RDs7Ozs7OztJQUM1RCwrREFBNkQ7Ozs7OztBQU0vRCx1Q0FFQzs7QUFFRCxNQUFNLE9BQU8sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQ2xELHlCQUF5QixDQUMxQjs7OztBQUVELE1BQU0sT0FBZ0IsVUFBVTtDQUUvQjs7Ozs7OztJQURDLHFEQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2dnZXIge1xuICBhYnN0cmFjdCBlcnJvcihtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xuICBhYnN0cmFjdCBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbiAgYWJzdHJhY3Qgd2FybihtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xufVxuXG4vKipcbiAqIE1hcHBpbmcgb2YgZW50aXR5IHR5cGUgbmFtZSB0byBpdHMgcGx1cmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5UGx1cmFsTmFtZXMge1xuICBbZW50aXR5TmFtZTogc3RyaW5nXTogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgUExVUkFMX05BTUVTX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuPEVudGl0eVBsdXJhbE5hbWVzPihcbiAgJ0BuZ3J4L2RhdGEvcGx1cmFsLW5hbWVzJ1xuKTtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBsdXJhbGl6ZXIge1xuICBhYnN0cmFjdCBwbHVyYWxpemUobmFtZTogc3RyaW5nKTogc3RyaW5nO1xufVxuIl19