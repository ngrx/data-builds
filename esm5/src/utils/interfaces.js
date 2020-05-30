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
//# sourceMappingURL=interfaces.js.map