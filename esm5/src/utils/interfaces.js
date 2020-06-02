/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/interfaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
/**
 * @abstract
 */
var /**
 * @abstract
 */
Logger = /** @class */ (function () {
    function Logger() {
    }
    return Logger;
}());
/**
 * @abstract
 */
export { Logger };
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
export var PLURAL_NAMES_TOKEN = new InjectionToken('@ngrx/data/plural-names');
/**
 * @abstract
 */
var /**
 * @abstract
 */
Pluralizer = /** @class */ (function () {
    function Pluralizer() {
    }
    return Pluralizer;
}());
/**
 * @abstract
 */
export { Pluralizer };
if (false) {
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    Pluralizer.prototype.pluralize = function (name) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvdXRpbHMvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFFL0M7Ozs7SUFBQTtJQUlBLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7Ozs7Ozs7OztJQUhDLGdFQUE4RDs7Ozs7OztJQUM5RCw4REFBNEQ7Ozs7Ozs7SUFDNUQsK0RBQTZEOzs7Ozs7QUFNL0QsdUNBRUM7O0FBRUQsTUFBTSxLQUFPLGtCQUFrQixHQUFHLElBQUksY0FBYyxDQUNsRCx5QkFBeUIsQ0FDMUI7Ozs7QUFFRDs7OztJQUFBO0lBRUEsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7Ozs7Ozs7Ozs7O0lBREMscURBQXlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExvZ2dlciB7XG4gIGFic3RyYWN0IGVycm9yKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XG4gIGFic3RyYWN0IGxvZyhtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xuICBhYnN0cmFjdCB3YXJuKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XG59XG5cbi8qKlxuICogTWFwcGluZyBvZiBlbnRpdHkgdHlwZSBuYW1lIHRvIGl0cyBwbHVyYWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlQbHVyYWxOYW1lcyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQTFVSQUxfTkFNRVNfVE9LRU4gPSBuZXcgSW5qZWN0aW9uVG9rZW48RW50aXR5UGx1cmFsTmFtZXM+KFxuICAnQG5ncngvZGF0YS9wbHVyYWwtbmFtZXMnXG4pO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGx1cmFsaXplciB7XG4gIGFic3RyYWN0IHBsdXJhbGl6ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmc7XG59XG4iXX0=