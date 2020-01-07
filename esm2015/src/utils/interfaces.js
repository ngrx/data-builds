/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/utils/interfaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvdXRpbHMvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFFL0MsTUFBTSxPQUFnQixNQUFNO0NBSTNCOzs7Ozs7OztJQUhDLGdFQUE4RDs7Ozs7OztJQUM5RCw4REFBNEQ7Ozs7Ozs7SUFDNUQsK0RBQTZEOzs7Ozs7QUFNL0QsdUNBRUM7O0FBRUQsTUFBTSxPQUFPLGtCQUFrQixHQUFHLElBQUksY0FBYyxDQUNsRCx5QkFBeUIsQ0FDMUI7Ozs7QUFFRCxNQUFNLE9BQWdCLFVBQVU7Q0FFL0I7Ozs7Ozs7SUFEQyxxREFBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9nZ2VyIHtcbiAgYWJzdHJhY3QgZXJyb3IobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbiAgYWJzdHJhY3QgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XG4gIGFic3RyYWN0IHdhcm4obWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbn1cblxuLyoqXG4gKiBNYXBwaW5nIG9mIGVudGl0eSB0eXBlIG5hbWUgdG8gaXRzIHBsdXJhbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVBsdXJhbE5hbWVzIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFBMVVJBTF9OQU1FU19UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxFbnRpdHlQbHVyYWxOYW1lcz4oXG4gICdAbmdyeC9kYXRhL3BsdXJhbC1uYW1lcydcbik7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbHVyYWxpemVyIHtcbiAgYWJzdHJhY3QgcGx1cmFsaXplKG5hbWU6IHN0cmluZyk6IHN0cmluZztcbn1cbiJdfQ==